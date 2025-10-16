from typing import TypedDict, Annotated, Optional, Literal
from datetime import datetime
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import os
import re
import json

# Define ContactFormState with all required fields
class ContactFormState(TypedDict):
    messages: Annotated[list, add_messages]
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    company: Optional[str]
    role: Optional[str]
    organization_type: Optional[str]
    operational_challenges: Optional[str]
    automation_goals: Optional[str]
    additional_context: Optional[str]  # For extra info from open discussion
    current_step: str
    is_qualified: bool
    confirmation_shown: bool
    emails_sent: bool
    update_email_sent: bool
    qualified_timestamp: Optional[str]
    conversation_status: str  # active, qualified_pending, closed_inactive, closed_complete
    language: str

# Initialize OpenAI model
def get_llm(temperature: float = 0.7):
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=temperature,
        api_key=os.getenv("OPENAI_API_KEY")
    )

# Validation functions
def validate_email(email: str) -> bool:
    """Validate email format using regex"""
    pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return bool(re.match(pattern, email))

def validate_phone(phone: str) -> bool:
    """Validate phone format (flexible for international)"""
    # Remove common separators to check if we have enough digits
    digits_only = re.sub(r'[\s\-\.\(\)]+', '', phone)
    return len(digits_only) >= 10  # At least 10 digits

def get_last_user_message(state: ContactFormState) -> str:
    """Extract most recent user message"""
    for msg in reversed(state["messages"]):
        if isinstance(msg, HumanMessage):
            return msg.content.strip()
    return ""

def extract_from_message(message: str, field: str, llm) -> Optional[str]:
    """Use LLM to extract specific field from message"""
    system_prompt = f"""Extract the {field} from the user's message.
Return ONLY the extracted value, nothing else.
If you cannot find a {field}, return "NONE".

Examples:
User: "My name is John Smith"
Output: John Smith

User: "I work at Acme Corp"
Output: Acme Corp

User: "I'm not sure"
Output: NONE
"""

    try:
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=message)
        ])
        result = response.content.strip()
        return None if result == "NONE" else result
    except:
        return None

# Question nodes
def ask_name_node(state: ContactFormState):
    """Ask for user's name"""
    last_message = get_last_user_message(state)

    if state.get("name"):
        # Already have name, move to next step
        return {"current_step": "email"}

    if last_message:
        # Try to extract name from message
        llm = get_llm(temperature=0)
        extracted_name = extract_from_message(last_message, "name", llm)

        if extracted_name:
            return {
                "name": extracted_name,
                "current_step": "email",
                "messages": [AIMessage(content=f"Great to meet you, {extracted_name}! What's your email address?")]
            }

    # Ask for name
    language = state.get("language", "en")
    if language == "de":
        return {"messages": [AIMessage(content="Hi! Ich bin Max von AR Automation. Wie ist Ihr Name?")]}
    else:
        return {"messages": [AIMessage(content="Hi! I'm Max from AR Automation. What's your name?")]}

def ask_email_node(state: ContactFormState):
    """Ask for and validate email"""
    last_message = get_last_user_message(state)

    if state.get("email"):
        # Already have email, move to next step
        return {"current_step": "phone"}

    if last_message:
        # Try to extract email using regex
        email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', last_message)

        if email_match:
            email = email_match.group(0)
            if validate_email(email):
                return {
                    "email": email,
                    "current_step": "phone",
                    "messages": [AIMessage(content=f"Thanks! What's your phone number?")]
                }

        # Invalid or no email found
        return {"messages": [AIMessage(content="I need a valid email address. Could you provide your email? (e.g., name@company.com)")]}

    # First time asking
    name = state.get("name", "")
    return {"messages": [AIMessage(content=f"Great to meet you, {name}! What's your email address?")]}

def ask_phone_node(state: ContactFormState):
    """Ask for and validate phone"""
    last_message = get_last_user_message(state)

    if state.get("phone"):
        # Already have phone, move to next step
        return {"current_step": "company"}

    if last_message:
        # Try to extract phone using regex
        phone_match = re.search(r'\b(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b', last_message)

        if phone_match:
            phone = phone_match.group(0)
            if validate_phone(phone):
                return {
                    "phone": phone,
                    "current_step": "company",
                    "messages": [AIMessage(content=f"Thanks! What company or organization do you work for?")]
                }

        # Check if user wants to skip
        if any(word in last_message.lower() for word in ["skip", "no phone", "don't have", "prefer not"]):
            return {
                "phone": "Not provided",
                "current_step": "company",
                "messages": [AIMessage(content="No problem! What company or organization do you work for?")]
            }

        # Invalid or no phone found
        return {"messages": [AIMessage(content="I need a valid phone number. Could you provide it? (Or say 'skip' if you prefer)")]}

    # First time asking
    return {"messages": [AIMessage(content="Thanks! What's your phone number?")]}

def ask_company_node(state: ContactFormState):
    """Ask for company name"""
    last_message = get_last_user_message(state)

    if state.get("company"):
        # Already have company, move to next step
        return {"current_step": "role"}

    if last_message:
        # Use the message as company name
        llm = get_llm(temperature=0)
        extracted_company = extract_from_message(last_message, "company name", llm)

        if extracted_company:
            return {
                "company": extracted_company,
                "current_step": "role",
                "messages": [AIMessage(content=f"What's your role at {extracted_company}?")]
            }

    # Ask for company
    return {"messages": [AIMessage(content="What company or organization do you work for?")]}

def ask_role_node(state: ContactFormState):
    """Ask for user's role"""
    last_message = get_last_user_message(state)

    if state.get("role"):
        # Already have role, move to next step
        return {"current_step": "organization_type"}

    if last_message:
        # Use the message as role
        llm = get_llm(temperature=0)
        extracted_role = extract_from_message(last_message, "job role or title", llm)

        if extracted_role:
            company = state.get("company", "your organization")
            return {
                "role": extracted_role,
                "current_step": "organization_type",
                "messages": [AIMessage(content=f"What type of organization is {company}? (e.g., accounting firm, e-commerce, educational institution)")]
            }

    # Ask for role
    company = state.get("company", "your organization")
    return {"messages": [AIMessage(content=f"What's your role at {company}?")]}

def ask_organization_type_node(state: ContactFormState):
    """Ask for organization type"""
    last_message = get_last_user_message(state)

    if state.get("organization_type"):
        # Already have org type, move to next step
        return {"current_step": "challenges"}

    if last_message:
        # Use the message as organization type
        org_type = last_message.strip()
        return {
            "organization_type": org_type,
            "current_step": "challenges",
            "messages": [AIMessage(content="What are your main operational challenges or pain points?")]
        }

    # Ask for org type
    company = state.get("company", "your organization")
    return {"messages": [AIMessage(content=f"What type of organization is {company}? (e.g., accounting firm, e-commerce, educational institution)")]}

def ask_challenges_node(state: ContactFormState):
    """Ask for operational challenges"""
    last_message = get_last_user_message(state)

    if state.get("operational_challenges"):
        # Already have challenges, move to next step
        return {"current_step": "goals"}

    if last_message:
        # Accept full message as challenges
        return {
            "operational_challenges": last_message,
            "current_step": "goals",
            "messages": [AIMessage(content="Thanks for sharing that. What would you like to automate in an ideal world?")]
        }

    # Ask for challenges
    return {"messages": [AIMessage(content="What are your main operational challenges or pain points?")]}

def ask_goals_node(state: ContactFormState):
    """Ask for automation goals"""
    last_message = get_last_user_message(state)

    if state.get("automation_goals"):
        # Already have goals, move to confirmation
        return {"current_step": "confirm"}

    if last_message:
        # Accept full message as goals
        return {
            "automation_goals": last_message,
            "current_step": "confirm",
            "messages": []  # Will be set by routing
        }

    # Ask for goals
    return {"messages": [AIMessage(content="What would you like to automate in an ideal world?")]}

def confirm_and_review_node(state: ContactFormState):
    """Present summary and ask for confirmation/corrections"""
    name = state.get("name", "there")
    email = state.get("email", "[not provided]")
    phone = state.get("phone", "[not provided]")
    role = state.get("role", "[not provided]")
    company = state.get("company", "[not provided]")
    challenges = state.get("operational_challenges", "[not provided]")
    goals = state.get("automation_goals", "[not provided]")

    summary = f"""Ok, {name}, let me confirm what I have:

• Your contacts: {email} and {phone}
• You're a {role} at {company}
• Current challenges: {challenges}
• Automation goals: {goals}

Did I get anything wrong, or would you like to add any additional information?"""

    return {
        "current_step": "awaiting_confirmation",
        "confirmation_shown": True,
        "messages": [AIMessage(content=summary)]
    }

def open_discussion_node(state: ContactFormState):
    """Engage in conversational Q&A to gather more context"""
    llm = get_llm(temperature=0.7)

    system_prompt = """You are Max, helping gather additional details about the user's automation needs.

Your goal:
- Ask clarifying questions about their challenges or goals
- Encourage them to elaborate on specific pain points
- Be conversational and empathetic
- Keep responses brief (1-2 sentences)
- When they're done sharing, ask: "Is there anything else you'd like to add?"

Rules:
- Focus questions on operational challenges or automation goals
- Don't ask for information already collected (name, email, etc.)
- Don't make promises about solutions
- Be genuinely curious and helpful
"""

    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    response = llm.invoke(messages)

    # Check if user is done (indicates no more to add)
    last_message = get_last_user_message(state).lower()
    done_phrases = ["no", "that's all", "that's it", "nothing else", "looks good", "all correct", "nope", "we're good", "that'll do"]

    if any(phrase in last_message for phrase in done_phrases):
        return {
            "current_step": "qualify",
            "messages": [response]
        }

    return {
        "current_step": "open_discussion",
        "messages": [response]
    }

def update_fields_from_discussion(state: ContactFormState) -> dict:
    """Extract corrections or additions from open discussion"""
    llm = get_llm(temperature=0)

    # Get all discussion messages since confirmation
    discussion_messages = []
    found_confirmation = False
    for msg in state["messages"]:
        if found_confirmation and isinstance(msg, (HumanMessage, AIMessage)):
            discussion_messages.append(f"{msg.__class__.__name__}: {msg.content}")
        if "Did I get anything wrong" in str(msg.content):
            found_confirmation = True

    if not discussion_messages:
        return {}

    discussion_text = "\n".join(discussion_messages)

    prompt = f"""Analyze this conversation and extract any CORRECTIONS or ADDITIONS to these fields:

Original Information:
- Operational Challenges: {state.get('operational_challenges', 'N/A')}
- Automation Goals: {state.get('automation_goals', 'N/A')}

Conversation:
{discussion_text}

Return a JSON object with:
{{
  "operational_challenges": "updated or original text",
  "automation_goals": "updated or original text",
  "additional_context": "any new insights not fitting other fields"
}}

If no changes, return the original values. additional_context should capture timeline, budget, urgency, or other context.
"""

    try:
        response = llm.invoke([SystemMessage(content=prompt)])
        updates = json.loads(response.content)
        return {
            "operational_challenges": updates.get("operational_challenges", state.get("operational_challenges")),
            "automation_goals": updates.get("automation_goals", state.get("automation_goals")),
            "additional_context": updates.get("additional_context", state.get("additional_context", ""))
        }
    except Exception as e:
        print(f"Error updating fields: {e}")
        return {}  # Keep original if parsing fails

def qualify_lead_node(state: ContactFormState):
    """Mark lead as qualified and thank user"""
    name = state.get("name", "there")
    email = state.get("email", "your email")
    company = state.get("company", "your organization")
    internal_email = "team@arautomation.com"

    # Update fields if coming from open discussion
    if state.get("current_step") == "qualify" and state.get("confirmation_shown"):
        updates = update_fields_from_discussion(state)
        state.update(updates)

    # Add placeholder email notification messages to chatbot
    message = f"""Thanks {name}! I've passed your information to our team.

📧 Sending confirmation email to: {email}
📧 Sending internal notification to: {internal_email}

Someone will reach out to you at {email} within 24 hours to discuss how we can help {company}.

Looking forward to exploring how automation can transform your operations!

— Max"""

    return {
        "is_qualified": True,
        "qualified_timestamp": datetime.now().isoformat(),
        "conversation_status": "qualified_pending",
        "messages": [AIMessage(content=message)]
    }

# Routing functions
def route_next_step(state: ContactFormState) -> str:
    """Route to next question based on current step"""
    if state.get("is_qualified"):
        return END

    current = state.get("current_step", "name")

    # If we're still in the same step but already asked the question, END
    # (we're waiting for the user's response)
    last_msg = get_last_user_message(state)

    # If we're at a step and the field is not filled and no user message, we already asked
    if current == "name" and not state.get("name") and not last_msg:
        return END
    if current == "email" and not state.get("email") and len([m for m in state["messages"] if "email" in str(m.content).lower()]) > 0:
        return END
    if current == "phone" and not state.get("phone") and len([m for m in state["messages"] if "phone" in str(m.content).lower()]) > 0:
        return END

    # Step mapping
    step_map = {
        "name": "ask_name",
        "email": "ask_email",
        "phone": "ask_phone",
        "company": "ask_company",
        "role": "ask_role",
        "organization_type": "ask_organization_type",
        "challenges": "ask_challenges",
        "goals": "ask_goals",
        "confirm": "confirm_and_review",
        "awaiting_confirmation": "qualify_lead",  # Default if confirmation is bypassed
    }

    return step_map.get(current, "ask_name")

def route_after_confirmation(state: ContactFormState) -> str:
    """Route based on user response to confirmation"""
    last_message = get_last_user_message(state).lower()

    # Check if user wants to make corrections
    correction_phrases = ["wrong", "incorrect", "change", "actually", "update", "fix", "correction"]
    elaboration_phrases = ["tell you more", "add", "also", "yes", "more context", "like to", "want to", "elaborate"]

    if any(phrase in last_message for phrase in correction_phrases + elaboration_phrases):
        return "open_discussion"
    else:
        # User confirmed everything is correct
        return "qualify_lead"

def route_from_discussion(state: ContactFormState) -> str:
    """Route from open discussion - either continue discussing or qualify"""
    last_message = get_last_user_message(state).lower()

    # Check if user is done
    done_phrases = ["no", "that's all", "that's it", "nothing else", "looks good", "nope", "we're good"]

    if any(phrase in last_message for phrase in done_phrases):
        # User is done, proceed to qualification
        return "qualify_lead"
    else:
        # Continue discussion loop
        return "open_discussion"

# Build the contact form graph
def build_contact_form_graph():
    workflow = StateGraph(ContactFormState)

    # Add all nodes
    workflow.add_node("ask_name", ask_name_node)
    workflow.add_node("ask_email", ask_email_node)
    workflow.add_node("ask_phone", ask_phone_node)
    workflow.add_node("ask_company", ask_company_node)
    workflow.add_node("ask_role", ask_role_node)
    workflow.add_node("ask_organization_type", ask_organization_type_node)
    workflow.add_node("ask_challenges", ask_challenges_node)
    workflow.add_node("ask_goals", ask_goals_node)
    workflow.add_node("confirm_and_review", confirm_and_review_node)
    workflow.add_node("open_discussion", open_discussion_node)
    workflow.add_node("qualify_lead", qualify_lead_node)

    # Define flow
    workflow.add_edge(START, "ask_name")

    # Sequential question flow with conditional routing
    workflow.add_conditional_edges("ask_name", route_next_step)
    workflow.add_conditional_edges("ask_email", route_next_step)
    workflow.add_conditional_edges("ask_phone", route_next_step)
    workflow.add_conditional_edges("ask_company", route_next_step)
    workflow.add_conditional_edges("ask_role", route_next_step)
    workflow.add_conditional_edges("ask_organization_type", route_next_step)
    workflow.add_conditional_edges("ask_challenges", route_next_step)
    workflow.add_conditional_edges("ask_goals", route_next_step)

    # Confirmation routing
    workflow.add_conditional_edges("confirm_and_review", route_after_confirmation)

    # Open discussion can loop or proceed to qualification
    workflow.add_conditional_edges("open_discussion", route_from_discussion)

    # End flow
    workflow.add_edge("qualify_lead", END)

    # Compile with recursion limit
    return workflow.compile(
        checkpointer=None,  # No checkpointer for now
        interrupt_before=[],  # No interrupts
        interrupt_after=[],
        debug=False
    )

# Create the compiled graph
contact_form_graph = build_contact_form_graph()
