from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from database import get_db, Conversation, Message, Lead
from models import (
    ChatRequest,
    ChatResponse,
    ConversationCreate,
    ConversationResponse,
    ConversationWithMessages,
    MessageResponse,
    LeadCreate
)
from langgraph_agent import conversation_graph, extract_lead_data
from langchain_core.messages import HumanMessage

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
async def chat(chat_request: ChatRequest, db: Session = Depends(get_db)):
    """Process chat message using LangGraph"""
    try:
        # Get or create conversation
        conversation = db.query(Conversation).filter(
            Conversation.session_id == chat_request.session_id
        ).first()
        
        if not conversation:
            conversation = Conversation(
                id=str(uuid.uuid4()),
                session_id=chat_request.session_id,
                status='active',
                created_at=datetime.utcnow()
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
        
        # Store user message
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
            else msg.content
            for msg in previous_messages
        ]
        
        # Invoke LangGraph agent
        result = conversation_graph.invoke({
            "messages": messages_for_graph,
            "language": chat_request.language or "en"
        })
        
        # Extract AI response
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
        
        # Check if lead is qualified
        if "LEAD_QUALIFIED" in ai_content:
            # Extract lead data from conversation
            all_messages = db.query(Message).filter(
                Message.conversation_id == conversation.id
            ).all()
            
            messages_dict = [
                {"role": msg.role, "content": msg.content}
                for msg in all_messages
            ]
            
            lead_data = extract_lead_data(messages_dict)
            
            # Check if lead already exists for this conversation
            existing_lead = db.query(Lead).filter(
                Lead.conversation_id == conversation.id
            ).first()
            
            if not existing_lead:
                # Create new lead
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
                
                # Update conversation status
                conversation.status = 'qualified'
                db.commit()
        
        return ChatResponse(
            response=ai_content,
            session_id=chat_request.session_id,
            conversation_id=conversation.id
        )
        
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
