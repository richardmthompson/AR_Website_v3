from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from .database import get_db, Conversation, Message, Lead
from .models import (
    ChatRequest,
    ChatResponse,
    ConversationCreate,
    ConversationResponse,
    ConversationWithMessages,
    MessageResponse,
    LeadCreate
)
from .langgraph_agent import conversation_graph, extract_lead_data
from .contact_agent import contact_form_graph
from .email_service import send_internal_notification, send_thank_you_email, send_context_update_email
from langchain_core.messages import HumanMessage, AIMessage

app = FastAPI(title="AR Automation AI Chatbot API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AR Automation FastAPI"}

@app.post("/api/conversations", response_model=ConversationResponse)
async def create_conversation(
    conversation_data: ConversationCreate,
    db: Session = Depends(get_db)
):
    """Create a new conversation"""
    try:
        conversation = Conversation(
            id=str(uuid.uuid4()),
            session_id=conversation_data.session_id,
            status=conversation_data.status,
            created_at=datetime.utcnow()
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        
        return ConversationResponse(
            id=conversation.id,
            session_id=conversation.session_id,
            vertical=conversation.vertical,
            status=conversation.status,
            created_at=conversation.created_at
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/conversations/{session_id}", response_model=ConversationWithMessages)
async def get_conversation(session_id: str, db: Session = Depends(get_db)):
    """Get conversation with messages by session ID"""
    try:
        conversation = db.query(Conversation).filter(
            Conversation.session_id == session_id
        ).first()
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        messages = db.query(Message).filter(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at.desc()).all()
        
        return ConversationWithMessages(
            conversation=ConversationResponse(
                id=conversation.id,
                session_id=conversation.session_id,
                vertical=conversation.vertical,
                status=conversation.status,
                created_at=conversation.created_at
            ),
            messages=[
                MessageResponse(
                    id=msg.id,
                    conversation_id=msg.conversation_id,
                    role=msg.role,
                    content=msg.content,
                    created_at=msg.created_at
                )
                for msg in messages
            ]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/chat", response_model=ChatResponse)
async def chat(
    chat_request: ChatRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Process chat message using LangGraph (marketing or contact agent)"""
    try:
        agent_type = chat_request.agent_type or 'marketing'

        # Handle special signals for inactivity and tab close
        if chat_request.message in ["__INACTIVITY_SIGNAL__", "__CLOSE_SIGNAL__"]:
            return await handle_conversation_end_signal(
                chat_request, background_tasks, db
            )

        # Get or create conversation
        conversation = db.query(Conversation).filter(
            Conversation.session_id == chat_request.session_id
        ).first()

        if not conversation:
            conversation = Conversation(
                id=str(uuid.uuid4()),
                session_id=chat_request.session_id,
                status='active',
                emails_sent=False,
                update_email_sent=False,
                created_at=datetime.utcnow()
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # Store user message (except for special signals)
        user_message = Message(
            id=str(uuid.uuid4()),
            conversation_id=conversation.id,
            role='user',
            content=chat_request.message,
            created_at=datetime.utcnow()
        )
        db.add(user_message)
        db.commit()

        # Get previous messages for context
        previous_messages = db.query(Message).filter(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at.asc()).all()

        # Prepare messages for LangGraph
        messages_for_graph = [
            HumanMessage(content=msg.content) if msg.role == 'user'
            else AIMessage(content=msg.content)
            for msg in previous_messages
        ]

        # For contact agent: If this is the first message, add initial greeting
        if agent_type == 'contact' and len(messages_for_graph) <= 1:
            # Add greeting as first message if not already present
            greeting_en = "Hi! I'm Max from AR Automation. What's your name?"
            greeting_de = "Hi! Ich bin Max von AR Automation. Wie ist Ihr Name?"
            greeting = greeting_de if chat_request.language == "de" else greeting_en

            if not messages_for_graph or not isinstance(messages_for_graph[0], AIMessage):
                messages_for_graph = [AIMessage(content=greeting)] + messages_for_graph

        # Route to appropriate agent
        if agent_type == 'contact':
            # Load existing agent state from database if available
            if conversation.agent_state:
                # Restore previous state
                agent_input = conversation.agent_state.copy()
                # Update with new messages and current conversation data
                agent_input["messages"] = messages_for_graph
                agent_input["language"] = chat_request.language or "en"
                agent_input["emails_sent"] = conversation.emails_sent
                agent_input["update_email_sent"] = conversation.update_email_sent
                agent_input["conversation_status"] = conversation.status
            else:
                # Initialize fresh state for new conversation
                agent_input = {
                "messages": messages_for_graph,
                "language": chat_request.language or "en",
                "current_step": "name",
                "name": None,
                "email": None,
                "phone": None,
                "company": None,
                "role": None,
                "organization_type": None,
                "operational_challenges": None,
                "automation_goals": None,
                "additional_context": None,
                "is_qualified": False,
                "confirmation_shown": False,
                "emails_sent": conversation.emails_sent,
                "update_email_sent": conversation.update_email_sent,
                "qualified_timestamp": None,
                "conversation_status": conversation.status
                }

            # Invoke agent with persisted/new state
            result = contact_form_graph.invoke(
                input=agent_input,
                config={"recursion_limit": 50}
            )

            # Save updated state to database (excluding messages to save space)
            state_to_persist = {
                k: v for k, v in result.items()
                if k != "messages"  # Don't persist messages (stored separately)
            }
            conversation.agent_state = state_to_persist

            # Extract AI response and state
            ai_content = result["messages"][-1].content
            is_qualified = result.get("is_qualified", False)
            emails_sent = result.get("emails_sent", False)
            confirmation_shown = result.get("confirmation_shown", False)

            # Store AI message
            ai_message = Message(
                id=str(uuid.uuid4()),
                conversation_id=conversation.id,
                role='assistant',
                content=ai_content,
                created_at=datetime.utcnow()
            )
            db.add(ai_message)

            # IMMEDIATE EMAIL SENDING (Research-validated: 391% higher conversion)
            if is_qualified and not conversation.emails_sent:
                # Create/update lead in database
                existing_lead = db.query(Lead).filter(
                    Lead.conversation_id == conversation.id
                ).first()

                lead_data = {
                    "name": result.get("name"),
                    "email": result.get("email"),
                    "phone": result.get("phone"),
                    "company": result.get("company"),
                    "role": result.get("role"),
                    "organization_type": result.get("organization_type"),
                    "operational_challenges": result.get("operational_challenges"),
                    "automation_goals": result.get("automation_goals"),
                    "additional_context": result.get("additional_context", ""),
                    "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
                }

                if existing_lead:
                    # Update existing lead
                    existing_lead.contact_name = lead_data["name"]
                    existing_lead.contact_email = lead_data["email"]
                    existing_lead.contact_phone = lead_data["phone"]
                    existing_lead.company_name = lead_data["company"]
                    existing_lead.role = lead_data["role"]
                    existing_lead.organization_type = lead_data["organization_type"]
                    existing_lead.operational_challenges = lead_data["operational_challenges"]
                    existing_lead.automation_goals = lead_data["automation_goals"]
                    existing_lead.additional_context = lead_data["additional_context"]
                else:
                    # Create new lead
                    lead = Lead(
                        id=str(uuid.uuid4()),
                        conversation_id=conversation.id,
                        contact_name=lead_data["name"],
                        contact_email=lead_data["email"],
                        contact_phone=lead_data["phone"],
                        company_name=lead_data["company"],
                        role=lead_data["role"],
                        organization_type=lead_data["organization_type"],
                        operational_challenges=lead_data["operational_challenges"],
                        automation_goals=lead_data["automation_goals"],
                        additional_context=lead_data["additional_context"],
                        status='new',
                        created_at=datetime.utcnow()
                    )
                    db.add(lead)

                # Update conversation
                conversation.status = 'qualified_pending'
                conversation.emails_sent = True

                # Send emails IMMEDIATELY (< 5 seconds after qualification)
                background_tasks.add_task(send_internal_notification, lead_data)
                background_tasks.add_task(send_thank_you_email, lead_data)

            db.commit()

            # Return with metadata for frontend state tracking
            return ChatResponse(
                response=ai_content,
                session_id=chat_request.session_id,
                conversation_id=conversation.id,
                metadata={
                    "is_qualified": is_qualified,
                    "emails_sent": conversation.emails_sent,
                    "confirmation_shown": confirmation_shown,
                    "conversation_status": conversation.status
                }
            )

        else:
            # Use marketing agent (original behavior)
            result = conversation_graph.invoke({
                "messages": messages_for_graph,
                "language": chat_request.language or "en"
            })

            ai_content = result["messages"][-1].content

            # Store AI message
            ai_message = Message(
                id=str(uuid.uuid4()),
                conversation_id=conversation.id,
                role='assistant',
                content=ai_content,
                created_at=datetime.utcnow()
            )
            db.add(ai_message)
            db.commit()

            # Check if lead is qualified (legacy behavior)
            if "LEAD_QUALIFIED" in ai_content:
                all_messages = db.query(Message).filter(
                    Message.conversation_id == conversation.id
                ).all()

                messages_dict = [
                    {"role": msg.role, "content": msg.content}
                    for msg in all_messages
                ]

                lead_data = extract_lead_data(messages_dict)

                existing_lead = db.query(Lead).filter(
                    Lead.conversation_id == conversation.id
                ).first()

                if not existing_lead:
                    lead = Lead(
                        id=str(uuid.uuid4()),
                        conversation_id=conversation.id,
                        vertical=lead_data.get("vertical"),
                        problem_description=lead_data.get("problem_description"),
                        contact_email=lead_data.get("contact_email"),
                        contact_phone=lead_data.get("contact_phone"),
                        status='new',
                        created_at=datetime.utcnow()
                    )
                    db.add(lead)
                    conversation.status = 'qualified'
                    db.commit()

            return ChatResponse(
                response=ai_content,
                session_id=chat_request.session_id,
                conversation_id=conversation.id
            )

    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


async def handle_conversation_end_signal(
    chat_request: ChatRequest,
    background_tasks: BackgroundTasks,
    db: Session
):
    """Handle inactivity or tab close signals"""
    try:
        conversation = db.query(Conversation).filter(
            Conversation.session_id == chat_request.session_id
        ).first()

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Get the lead if it exists
        lead = db.query(Lead).filter(
            Lead.conversation_id == conversation.id
        ).first()

        if not lead:
            # No lead to send, just return
            return ChatResponse(
                response="Conversation closed.",
                session_id=chat_request.session_id,
                conversation_id=conversation.id
            )

        # Check if we need to send update email
        if lead and not conversation.update_email_sent and lead.additional_context:
            lead_data = {
                "name": lead.contact_name,
                "email": lead.contact_email,
                "company": lead.company_name,
                "additional_context": lead.additional_context
            }
            background_tasks.add_task(send_context_update_email, lead_data)
            conversation.update_email_sent = True

        # Update conversation status
        conversation.status = 'closed_inactive' if chat_request.message == "__INACTIVITY_SIGNAL__" else 'closed_complete'
        db.commit()

        return ChatResponse(
            response="Good to chat with you! We'll be in touch soon. — Max",
            session_id=chat_request.session_id,
            conversation_id=conversation.id,
            metadata={"conversation_closed": True}
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/leads")
async def create_lead(lead_data: LeadCreate, db: Session = Depends(get_db)):
    """Create a new lead"""
    try:
        lead = Lead(
            id=str(uuid.uuid4()),
            conversation_id=lead_data.conversation_id,
            vertical=lead_data.vertical,
            problem_description=lead_data.problem_description,
            desired_solution=lead_data.desired_solution,
            business_impact=lead_data.business_impact,
            contact_name=lead_data.contact_name,
            contact_email=lead_data.contact_email,
            contact_phone=lead_data.contact_phone,
            company_name=lead_data.company_name,
            additional_info=lead_data.additional_info,
            status=lead_data.status or 'new',
            created_at=datetime.utcnow()
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)
        
        return {"id": lead.id, "status": "created"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
