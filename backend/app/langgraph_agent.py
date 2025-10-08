from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import os
import re

# System prompts for different languages
SYSTEM_PROMPTS = {
    "en": """You are Max, a friendly AI assistant for AR Automation. Your job is to qualify leads by gathering information about their automation needs through natural conversation.

Follow this lead qualification flow:
1. If this is the first message in the conversation, greet them: "Hi, I'm Max. What task would you love to have done automatically, quickly, and with no effort on your part?"
2. When they describe their automation problem, acknowledge it and ask which industry they're in (Accounting, E-commerce, or Education)
3. Ask about their desired solution and expected outcomes
4. Ask about business impact (time saved, cost reduction, revenue impact)
5. Collect contact information: name, email, phone number, and company name

Keep responses brief (1-2 sentences), friendly, and conversational. Focus on understanding their pain points.

When you have all information (problem, industry, impact, and contact details), respond with "LEAD_QUALIFIED" followed by a brief summary.""",
    
    "de": """Du bist Max, ein freundlicher KI-Assistent für AR Automation. Deine Aufgabe ist es, durch natürliche Gespräche Informationen über Automatisierungsbedürfnisse zu sammeln.

Folge diesem Qualifizierungsablauf:
1. Bei der ersten Nachricht im Gespräch, begrüße sie: "Hi, ich bin Max. Welche Aufgabe würden Sie gerne automatisch, schnell und ohne Aufwand erledigen lassen?"
2. Wenn sie ihr Automatisierungsproblem beschreiben, bestätige es und frage nach ihrer Branche (Buchhaltung, E-Commerce oder Bildung)
3. Frage nach der gewünschten Lösung und erwarteten Ergebnissen
4. Frage nach geschäftlichen Auswirkungen (eingesparte Zeit, Kostenreduzierung, Umsatzauswirkungen)
5. Sammle Kontaktinformationen: Name, E-Mail, Telefonnummer und Firmenname

Halte Antworten kurz (1-2 Sätze), freundlich und gesprächig. Konzentriere dich darauf, ihre Probleme zu verstehen.

Wenn du alle Informationen hast (Problem, Branche, Auswirkungen und Kontaktdaten), antworte mit "LEAD_QUALIFIED" gefolgt von einer kurzen Zusammenfassung."""
}

# Define conversation state
class ConversationState(TypedDict):
    messages: Annotated[list, add_messages]
    language: str

# Initialize OpenAI model
def get_llm():
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.7,
        api_key=os.getenv("OPENAI_API_KEY")
    )

# Agent node that processes messages
def agent_node(state: ConversationState):
    llm = get_llm()
    language = state.get("language", "en")
    system_prompt = SYSTEM_PROMPTS.get(language, SYSTEM_PROMPTS["en"])
    
    # Prepare messages with system prompt
    messages_with_system = [SystemMessage(content=system_prompt)] + state["messages"]
    
    # Get AI response
    response = llm.invoke(messages_with_system)
    
    return {"messages": [response]}

# Build the conversation graph
def build_conversation_graph():
    workflow = StateGraph(ConversationState)
    
    # Add the agent node
    workflow.add_node("agent", agent_node)
    
    # Define the flow
    workflow.add_edge(START, "agent")
    workflow.add_edge("agent", END)
    
    # Compile the graph
    return workflow.compile()

# Create the compiled graph
conversation_graph = build_conversation_graph()

# Helper function to extract lead data from conversation
def extract_lead_data(messages: list) -> dict:
    """Extract lead information from conversation messages"""
    conversation_text = "\n".join([
        f"{msg.get('role', 'unknown')}: {msg.get('content', '')}" 
        for msg in messages
    ])
    
    # Extract email
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', conversation_text)
    
    # Extract phone
    phone_match = re.search(r'\b(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b', conversation_text)
    
    # Extract vertical/industry
    vertical_match = re.search(r'\b(accounting|e-?commerce|education|buchhaltung|bildung)\b', conversation_text, re.IGNORECASE)
    
    # Get problem description from first user message
    user_messages = [msg for msg in messages if msg.get('role') == 'user']
    problem_description = user_messages[0].get('content') if user_messages else None
    
    return {
        "contact_email": email_match.group(0) if email_match else None,
        "contact_phone": phone_match.group(0) if phone_match else None,
        "vertical": vertical_match.group(0).lower() if vertical_match else None,
        "problem_description": problem_description
    }
