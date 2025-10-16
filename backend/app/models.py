from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

def to_camel(string: str) -> str:
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class ChatRequest(CamelModel):
    session_id: str
    message: str
    language: Optional[str] = 'en'
    agent_type: Optional[str] = 'marketing'  # 'marketing' or 'contact'

class ChatResponse(CamelModel):
    response: str
    session_id: str
    conversation_id: str
    metadata: Optional[Dict[str, Any]] = None

class ConversationCreate(CamelModel):
    session_id: str
    status: Optional[str] = 'active'

class ConversationResponse(CamelModel):
    id: str
    session_id: str
    vertical: Optional[str]
    status: str
    created_at: datetime

class MessageResponse(CamelModel):
    id: str
    conversation_id: str
    role: str
    content: str
    created_at: datetime

class ConversationWithMessages(CamelModel):
    conversation: ConversationResponse
    messages: List[MessageResponse]

class LeadCreate(CamelModel):
    conversation_id: str
    vertical: Optional[str]
    problem_description: Optional[str]
    desired_solution: Optional[str]
    business_impact: Optional[str]
    contact_name: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    company_name: Optional[str]
    role: Optional[str]
    organization_type: Optional[str]
    operational_challenges: Optional[str]
    automation_goals: Optional[str]
    additional_context: Optional[str]
    additional_info: Optional[Dict[str, Any]]
    status: Optional[str] = 'new'

class ContactEmailRequest(CamelModel):
    email: str
    language: Optional[str] = 'en'

class ContactEmailResponse(CamelModel):
    success: bool
    message: str
