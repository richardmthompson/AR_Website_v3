from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: Optional[str] = 'en'

class ChatResponse(BaseModel):
    response: str
    session_id: str
    conversation_id: str

class ConversationCreate(BaseModel):
    session_id: str
    status: Optional[str] = 'active'

class ConversationResponse(BaseModel):
    id: str
    session_id: str
    vertical: Optional[str]
    status: str
    created_at: datetime

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    created_at: datetime

class ConversationWithMessages(BaseModel):
    conversation: ConversationResponse
    messages: List[MessageResponse]

class LeadCreate(BaseModel):
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
