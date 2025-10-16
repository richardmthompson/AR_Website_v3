# AR Automation Website

Full-stack application with AI-powered chatbot (Max) for lead qualification and automation consulting, with a specialization in EdTech.

## Project Overview

AR Automation helps businesses identify and implement automation solutions through:

- **AI Chatbot (Max)** - Conversational lead qualification using LangGraph + OpenAI
- **Multi-page Marketing Site** - Solutions, resources, demos, use cases
- **Multi-language Support** - English/German (i18next)
- **Industry-specific Recommendations** - EdTech, Accounting, E-commerce, and more
- **Lead Management** - Track conversations and qualified leads

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- [OpenAI API key](https://platform.openai.com/api-keys)
- Text editor (VS Code, Cursor, etc.)

### 1. Clone & Configure

```bash
git clone <repository-url>
cd ar3_website
cp .env.example .env
```

### 2. Edit `.env` File

Open `.env` and configure:

```env
# Use local Docker database
DATABASE_URL=postgresql://postgres:postgres@db:5432/ar_automation

# PostgreSQL settings
POSTGRES_DB=ar_automation
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Add your OpenAI API key (REQUIRED)
OPENAI_API_KEY=sk-your-actual-key-here

# Development mode
ENVIRONMENT=development
NODE_ENV=development

# Ports
FRONTEND_PORT=3000
BACKEND_PORT=8000
```

### 3. Start Docker Services

```bash
docker-compose up --build
```

**First run takes 3-5 minutes** to build images and install dependencies.

### 4. Verify Setup

Open in your browser:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

You should see the AR Automation landing page with the Max chatbot widget.

## Architecture

```
ar3_website/
├── frontend/              # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/        # HomePage, SolutionsPage, ResourcesPage, etc.
│   │   ├── components/   # UI components
│   │   └── ...
│   └── Dockerfile        # Frontend container
│
├── backend/              # FastAPI + LangGraph + Python
│   ├── app/
│   │   ├── main.py              # API routes
│   │   ├── langgraph_agent.py   # AI conversation agent
│   │   ├── models.py            # Database models
│   │   └── ...
│   └── Dockerfile        # Backend container
│
├── docs/                 # Technical documentation
├── .claude/              # Context engineering framework
├── docker-compose.yml    # Container orchestration
└── .env                  # Environment configuration
```

## Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- Wouter for routing
- TanStack Query for data fetching
- Radix UI (shadcn/ui) components
- i18next for translations
- react-hook-form + zod for forms

### Backend
- FastAPI (Python web framework)
- LangChain + LangGraph (AI orchestration)
- OpenAI GPT-4 (language model)
- SQLAlchemy + PostgreSQL
- Pydantic for validation

### Infrastructure
- Docker + Docker Compose
- PostgreSQL (local Docker)

## Development Workflow

### Making Changes

Code changes auto-reload:
- **Frontend**: Edit `frontend/src/` → browser refreshes
- **Backend**: Edit `backend/app/` → server reloads
- **Database**: Data persists across container restarts

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stopping Services

```bash
# Stop containers (keeps data)
docker-compose down

# Stop and delete database data
docker-compose down -v
```

### Restarting

```bash
# After changing dependencies (package.json, requirements.txt)
docker-compose up --build

# Normal restart
docker-compose restart backend
```

### Running Commands in Containers

```bash
# Backend Python shell
docker-compose exec backend python

# Database shell
docker-compose exec db psql -U postgres -d ar_automation

# Frontend shell
docker-compose exec frontend sh
```

## Common Issues

### Port Already in Use

Change ports in `.env`:
```env
FRONTEND_PORT=3001  # Change from 3000
BACKEND_PORT=8001   # Change from 8000
```

### Database Connection Failed

Check database health:
```bash
docker-compose ps
docker-compose logs db
docker-compose restart db
```

### OpenAI API Errors

1. Verify your API key in `.env`
2. Check you have credits: https://platform.openai.com/usage
3. Restart backend: `docker-compose restart backend`

### "No Space Left on Device"

Clean up Docker:
```bash
docker system prune -a
docker volume prune
```

### Build Failures

Clean rebuild:
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Application Pages

The site includes multiple pages (all routed via Wouter):

| Route | Purpose |
|-------|---------|
| `/` | Landing page with hero, chatbot, verticals |
| `/solutions` | Solutions architecture & technical capabilities |
| `/resources` | Resource library and documentation |
| `/demos` | Interactive demos and examples |
| `/edtech-solutions` | EdTech-specific automation solutions |
| `/conference` | Conference materials |
| `/use-cases` | Customer success stories |
## Production Deployment

This application automatically deploys to DigitalOcean when code is pushed to the `main` branch.

### Automated Deployment

- **Trigger:** Push to `main` branch
- **Platform:** DigitalOcean $6 Droplet
- **Orchestration:** Docker Compose
- **CI/CD:** GitHub Actions

### Setup Instructions

For complete deployment setup instructions, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

### Quick Deploy

```bash
# Manual deployment on server
ssh root@YOUR_DROPLET_IP
cd /root/AR_Website_v3
./deploy.sh
```

### Monitoring

- Application: http://YOUR_DROPLET_IP
- API Health: http://YOUR_DROPLET_IP:8000/health
- Logs: `docker-compose -f docker-compose.prod.yml logs -f`

### Quick Reference

For common deployment commands, see [docs/DEPLOYMENT_QUICK_REF.md](./docs/DEPLOYMENT_QUICK_REF.md).

## Project Structure Details

See individual README files:
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## API Documentation

Interactive API docs:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Database

PostgreSQL with three main tables (auto-created on first run):
- `conversations` - Chat sessions with language preference
- `messages` - Individual chat messages
- `leads` - Qualified lead information

### Accessing Database

```bash
# Connect to database
docker-compose exec db psql -U postgres -d ar_automation

# View tables
\dt

# Query conversations
SELECT * FROM conversations;
```

## Testing

### Frontend

```bash
cd frontend
npm run check  # TypeScript type checking
npm run lint   # ESLint
```

### Backend

```bash
cd backend
pytest  # (when tests are implemented)
```

## Deployment

Using Docker Compose:

```bash
docker-compose up --build
```

Configure environment variables in `.env` for your target environment (development or production).

## Additional Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Development guidelines and patterns for AI assistant
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[docs/max_chatbot.md](./docs/max_chatbot.md)** - Max chatbot specification
- **[docs/email-automation-research.md](./docs/email-automation-research.md)** - Email automation research
- **[.claude/](./.claude/)** - Context engineering framework (PRPs, commands, artifacts)

## Security Notes

1. **Never commit `.env`** - Contains sensitive API keys
2. **Change default passwords** - Update PostgreSQL credentials in production
3. **Use HTTPS in production** - Configure SSL/TLS
4. **Rotate API keys regularly** - Especially OpenAI keys

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Local Docker DB |
| `OPENAI_API_KEY` | OpenAI API key | **Required** |
| `POSTGRES_DB` | Database name | `ar_automation` |
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `postgres` |
| `FRONTEND_PORT` | Frontend port | `3000` |
| `BACKEND_PORT` | Backend port | `8000` |
| `ENVIRONMENT` | Environment mode | `development` |

## License

Private - AR Automation

## Support

For development patterns and Claude Code usage, see [CLAUDE.md](./CLAUDE.md).

For questions or issues, contact AR Automation support.
