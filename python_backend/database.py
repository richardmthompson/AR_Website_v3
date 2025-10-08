import os
from sqlalchemy import create_engine, Column, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(String, primary_key=True)
    session_id = Column(String, nullable=False, name="session_id")
    vertical = Column(Text, nullable=True)
    status = Column(Text, nullable=False, default='active')
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, name="created_at")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True)
    conversation_id = Column(String, nullable=False, name="conversation_id")
    role = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, name="created_at")

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(String, primary_key=True)
    conversation_id = Column(String, nullable=False, name="conversation_id")
    vertical = Column(Text, nullable=True)
    problem_description = Column(Text, nullable=True, name="problem_description")
    desired_solution = Column(Text, nullable=True, name="desired_solution")
    business_impact = Column(Text, nullable=True, name="business_impact")
    contact_name = Column(Text, nullable=True, name="contact_name")
    contact_email = Column(Text, nullable=True, name="contact_email")
    contact_phone = Column(Text, nullable=True, name="contact_phone")
    company_name = Column(Text, nullable=True, name="company_name")
    additional_info = Column(JSON, nullable=True, name="additional_info")
    status = Column(Text, nullable=False, default='new')
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, name="created_at")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
