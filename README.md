# AR Automation Website

Full-stack application with AI-powered chatbot for lead qualification and automation consulting.

## Project Overview

AR Automation helps businesses identify and implement automation solutions. This application features:

- AI chatbot (Max) that qualifies leads through natural conversation
- Multi-language support (English/German)
- Lead tracking and management
- Industry-specific automation recommendations (Accounting, E-commerce, Education)

## Architecture

This is a **separated frontend + backend architecture**:

```
AR_Website_v3/
├── frontend/          # React + Vite + TypeScript
│   ├── src/          # Application source code
│   ├── public/       # Static assets
│   └── package.json
│
├── backend/           # FastAPI + LangGraph + Python
│   ├── app/          # Python application code
│   ├── tests/        # Backend tests
│   └── requirements.txt
│
├── docker-compose.yml      # Development environment
├── docker-compose.prod.yml # Production environment
├── Dockerfile.frontend     # Frontend container
├── Dockerfile.backend      # Backend container
└── nginx.conf             # Nginx configuration
```

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Wouter (routing)
- TanStack Query
- Radix UI components

### Backend
- FastAPI (Python)
- LangChain + LangGraph
- OpenAI GPT-4
- SQLAlchemy + PostgreSQL
- Pydantic

### Infrastructure
- Docker + Docker Compose
- Nginx (reverse proxy)
- PostgreSQL (Neon or local)

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.11+ (for local backend development)
- OpenAI API key
- PostgreSQL database (or Neon)

### Quick Start with Docker

1. Clone the repository
2. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
3. Add your OpenAI API key to `.env`
4. Start all services:
   ```bash
   docker-compose up --build
   ```

Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

#### Frontend Only
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

#### Backend Only
```bash
cd backend
pip install -r requirements.txt
cd app
uvicorn main:app --reload
# Visit http://localhost:8000
```

## Environment Variables

Create `.env` file in root directory:

```env
# Database
POSTGRES_DB=ar_automation
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432

# Or use external Neon database
DATABASE_URL=postgresql://user:pass@host/db

# API Keys
OPENAI_API_KEY=your-key-here
LANGCHAIN_API_KEY=optional
LANGCHAIN_TRACING_V2=false

# Ports
FRONTEND_PORT=80
BACKEND_PORT=8000
```

## Docker Deployment

### Architecture Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Frontend       │
│  (Nginx)        │
│  Port 80        │
└────────┬────────┘
         │
         ├─────────► Static Files
         │
         └─────────► /api/* ──┐
                               │
                               ▼
                    ┌──────────────────┐
                    │  Backend         │
                    │  (FastAPI)       │
                    │  Port 8000       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Database        │
                    │  (PostgreSQL)    │
                    │  Port 5432       │
                    └──────────────────┘
```

### Development

Start all services:
```bash
docker-compose up --build
```

Run in background:
```bash
docker-compose up -d --build
```

### Production

Using external database (recommended):
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Common Docker Commands

**Stop Services:**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

**View Logs:**
```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Restart Services:**
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

**Check Status:**
```bash
docker-compose ps
```

**Execute Commands in Containers:**
```bash
# Backend shell
docker-compose exec backend sh

# Database shell
docker-compose exec db psql -U postgres -d ar_automation
```

### Troubleshooting

**Port Already in Use:**

Change ports in `.env`:
```env
FRONTEND_PORT=8080  # Change from 80
BACKEND_PORT=8001   # Change from 8000
```

**Database Connection Issues:**

Check database is healthy:
```bash
docker-compose ps
docker-compose logs db
```

**Build Failures:**

Clean and rebuild:
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

**Frontend Can't Reach Backend:**

Verify backend health:
```bash
curl http://localhost:8000/health
```

Check nginx configuration:
```bash
docker-compose exec frontend cat /etc/nginx/nginx.conf
```

### Security Notes

1. **Never commit `.env` file** - Contains sensitive API keys
2. **Change default passwords** - Update PostgreSQL password in production
3. **Use HTTPS** - In production, use reverse proxy (Traefik, Caddy) for SSL
4. **Limit exposed ports** - Only expose necessary ports externally

## Project Structure Details

See individual README files:
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## API Documentation

Interactive API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## Type Sharing

Frontend can generate TypeScript types from backend OpenAPI schema:

```bash
cd frontend
npx openapi-typescript http://localhost:8000/openapi.json -o src/types/api.ts
```

## Health Checks

- Frontend: http://localhost/health
- Backend: http://localhost:8000/health

## Database

The application uses PostgreSQL with three main tables:
- `conversations` - Chat sessions
- `messages` - Individual messages
- `leads` - Qualified lead information

Tables are auto-created on first run.

## Features

- AI-powered lead qualification chatbot
- Conversation history and context
- Multi-language support (EN/DE)
- Industry-specific recommendations
- Contact information collection
- Lead status tracking
- Responsive design
- Dark/light theme

## Testing

### Frontend
```bash
cd frontend
npm run check  # TypeScript checking
```

### Backend
```bash
cd backend
pytest
```


## License

Private - AR Automation

## Support

For questions or issues, contact AR Automation support.
