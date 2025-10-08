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

class ChatResponse(CamelModel):
    response: str
    session_id: str
    conversation_id: str

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
    additional_info: Optional[Dict[str, Any]]
    status: Optional[str] = 'new'
