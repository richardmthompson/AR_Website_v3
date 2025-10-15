# AR Automation - Backend

FastAPI backend with LangGraph-powered AI chatbot for lead qualification and conversation management.

## Tech Stack

- **FastAPI** - Modern async web framework
- **LangChain** - LLM framework
- **LangGraph** - Stateful AI agent orchestration
- **OpenAI GPT-4** - Language model
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application & routes
│   ├── database.py          # Database models and session
│   ├── models.py            # Pydantic models
│   ├── langgraph_agent.py   # AI agent logic
│   └── __init__.py
├── tests/                   # Unit and integration tests
└── requirements.txt         # Python dependencies
```

## Getting Started

### Prerequisites

- Python 3.11+
- PostgreSQL database
- OpenAI API key

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Environment Variables

Create `.env` file in backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ar_automation
OPENAI_API_KEY=your-openai-api-key
LANGCHAIN_API_KEY=optional
LANGCHAIN_TRACING_V2=false
LANGCHAIN_PROJECT=ar-automation
```

### Development

```bash
cd app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API available at http://localhost:8000

Interactive docs at http://localhost:8000/docs

### Database Setup

Database tables are created automatically on first run using SQLAlchemy models.

For production, consider using Alembic for migrations:

```bash
pip install alembic
alembic init migrations
# Configure alembic.ini and create migrations
```

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/{session_id}` - Get conversation with messages

### Chat
- `POST /api/chat` - Send message and get AI response

### Leads
- `POST /api/leads` - Create lead manually

## AI Agent

The chatbot uses LangGraph for stateful conversation management:

1. Greets user and asks about automation needs
2. Identifies industry vertical (Accounting, E-commerce, Education)
3. Gathers business impact information
4. Collects contact details
5. Qualifies lead when complete

Supports English and German languages.

## Docker

Backend runs in Python container. See root `docker-compose.yml`.

## Testing

```bash
pytest
```

## Database Models

- **Conversation** - Chat session tracking
- **Message** - Individual chat messages
- **Lead** - Qualified lead information

## OpenAPI Schema

Access OpenAPI JSON schema at:
```
http://localhost:8000/openapi.json
```

Use for frontend type generation.
