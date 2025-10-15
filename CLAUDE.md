# CLAUDE.md - AR Automation Website Development Guide

**AR Automation** is a full-stack marketing website with an AI-powered chatbot (Max) for lead qualification, built for automation consulting with a specialization in EdTech.

## Quick Reference

| Category | Details |
|----------|---------|
| **Architecture** | Full-stack monorepo (React + Vite frontend / FastAPI + LangGraph backend) |
| **Purpose** | Marketing site + AI chatbot lead qualification |
| **Languages** | English/German (i18next) |
| **Key Features** | Multi-page site, Solutions architecture, AI chatbot, Industry demos, Resource library |
| **Database** | PostgreSQL (local Docker) |
| **Deployment** | Docker Compose |

## Core Development Philosophy

- **KISS (Keep It Simple)**: Choose straightforward solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Build features only when needed, not "just in case"
- **Progressive Enhancement**: Start simple, add complexity when requirements demand it

## Project Structure

```
ar3_website/
├── frontend/
│   ├── src/
│   │   ├── pages/                    # 8 pages (see below)
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components (40+)
│   │   │   ├── solutions/            # Solutions architecture components
│   │   │   ├── HeroSection.tsx       # Landing hero
│   │   │   ├── InlineChatbot.tsx     # AI chatbot widget
│   │   │   ├── Navigation.tsx        # Header + language/theme
│   │   │   ├── VerticalsSection.tsx  # Industry cards
│   │   │   ├── SolutionsSection.tsx  # Services overview
│   │   │   ├── TrustIndicators.tsx   # Social proof
│   │   │   ├── CTASection.tsx        # Calls to action
│   │   │   └── Footer.tsx            # Site footer
│   │   ├── hooks/                    # use-mobile, use-toast
│   │   ├── lib/                      # Utilities (queryClient, utils)
│   │   └── i18n/                     # i18next config + locales
│   └── package.json                  # Dependencies reference
│
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI app + routes
│   │   ├── langgraph_agent.py        # AI conversation agent
│   │   ├── database.py               # PostgreSQL connection
│   │   └── models.py                 # SQLAlchemy models
│   └── requirements.txt              # Dependencies reference
│
├── docs/                             # Technical documentation
│   ├── max_chatbot.md                # Max chatbot specs
│   ├── langx-docs.md                 # LangChain/LangGraph quick ref
│   ├── email-automation-research.md  # Email automation research
│   ├── langchain/                    # LangChain docs
│   └── langgraph/                    # LangGraph docs
│
├── .claude/                          # Context engineering framework (see below)
│   ├── PRPs/                         # Product Requirements Prompts
│   ├── artifacts/                    # Generated artifacts
│   ├── commands/                     # Custom slash commands
│   └── Context-Engineering-Cognitive-Map.md
│
├── docker-compose.yml                # Development environment
├── .env.example                      # Environment template
├── CLAUDE.md                         # This file
├── CONTRIBUTING.md                   # Contribution guidelines
└── README.md                         # User-facing documentation
```

## Application Pages

The frontend is a **multi-page application** with the following routes:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage.tsx | Landing page with hero, chatbot, verticals, solutions |
| `/solutions` | SolutionsPage.tsx | Detailed solutions architecture & technical capabilities |
| `/resources` | ResourcesPage.tsx | Resource library and documentation |
| `/demos` | DemosPage.tsx | Interactive demos and use case examples |
| `/edtech-solutions` | EdTechSolutionsPage.tsx | EdTech-specific automation solutions |
| `/conference` | ConferencePage.tsx | Conference materials and presentations |
| `/use-cases` | UseCasesPage.tsx | Customer use cases and success stories |
| `*` | not-found.tsx | 404 page |

## Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite** (NOT Next.js)
- **Tailwind CSS** for styling
- **Wouter** for routing (lightweight)
- **TanStack Query** for data fetching/caching (NO Redux/Zustand)
- **Radix UI** (shadcn/ui) for accessible components
- **i18next** for internationalization
- **react-hook-form** + **zod** for form validation
- **Framer Motion** for animations

**Key Dependencies**: See `frontend/package.json`

### Backend
- **FastAPI** web framework
- **LangChain** + **LangGraph** for AI agent orchestration
- **OpenAI GPT-4** language model
- **SQLAlchemy** ORM + **PostgreSQL**
- **Pydantic** for validation
- **uvicorn** server

**Key Dependencies**: See `backend/requirements.txt`

### Infrastructure
- **Docker + Docker Compose** for containerization
- **PostgreSQL** (local Docker)

## Architecture Patterns

### Frontend Component Architecture

**Two component types:**

1. **Marketing Components** (mostly static)
   - HeroSection, VerticalsSection, SolutionsSection, TrustIndicators, CTASection
   - Content-focused, minimal interactivity

2. **Interactive Components** (backend integration)
   - InlineChatbot - AI conversation interface (LangGraph)
   - Navigation - language switching (EN/DE), theme toggle
   - Solutions components - architecture visualization, technical capabilities

**Key Principles:**
- Keep components under 200 lines (split if larger)
- Use proper TypeScript types (avoid `any`)
- Tailwind CSS utility classes for styling
- `cn()` helper for conditional classes

### Backend Agent Architecture

The AI chatbot uses **LangGraph** for stateful conversations:

```python
# See backend/app/langgraph_agent.py for full implementation

# Agent conversation flow:
# 1. Greeting → Initial welcome
# 2. Problem Discovery → Understand pain points
# 3. Industry Identification → Determine sector
# 4. Solution Recommendation → Suggest automations
# 5. Lead Qualification → Collect contact info
```

**Database Models** (see `backend/app/models.py`):
- `Conversation` - Chat sessions with language preference
- `Message` - Individual messages (user/assistant)
- `Lead` - Qualified leads with contact information

## Development Workflow

### Quick Start

For complete setup instructions, see [README.md](./README.md).

**TL;DR:**
```bash
cp .env.example .env          # Configure environment
# Edit .env: Add OPENAI_API_KEY
docker-compose up --build     # Start all services
# → Frontend: http://localhost:3000
# → Backend: http://localhost:8000/docs
```

Both frontend and backend support hot reload:
- Frontend: Edit `src/` → browser auto-refreshes
- Backend: Edit `app/` → server auto-reloads

## Development Guidelines

### TypeScript Best Practices

```typescript
// ✅ Use proper types
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ❌ Avoid 'any'
const handleMessage = (msg: any) => { ... }  // Bad
const handleMessage = (msg: ChatMessage) => { ... }  // Good
```

### Data Fetching Pattern

```typescript
// Use TanStack Query for all API calls
import { useQuery, useMutation } from '@tanstack/react-query';

function useChatMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${conversationId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: !!conversationId,
  });
}
```

For more patterns, see [TanStack Query docs](https://tanstack.com/query/latest).

### i18n Pattern

```typescript
// Use i18next for translations
import { useTranslation } from 'react-i18next';

export function Component() {
  const { t } = useTranslation();
  return <h1>{t('key.path')}</h1>;
}
```

### FastAPI Pattern

```python
# Use Pydantic for validation
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    language: str = "en"

@app.post("/api/chat/send")
async def send_message(request: ChatRequest):
    # Implementation
    pass
```

For more patterns, see [FastAPI docs](https://fastapi.tiangolo.com).

### Git Commit Guidelines

**Commit Message Format:**
- Use clear, descriptive commit messages
- Follow conventional commits format: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Keep subject line under 72 characters
- Add detailed description in commit body for complex changes

**IMPORTANT - Do NOT include:**
- ❌ "🤖 Generated with [Claude Code](https://claude.com/claude-code)"
- ❌ "Co-Authored-By: Claude <noreply@anthropic.com>"
- ❌ Any AI attribution or generation notices

## Testing

```bash
# Frontend type checking
cd frontend
npm run check     # TypeScript
npm run lint      # ESLint

# Backend (when tests implemented)
cd backend
pytest
```

**Manual Testing Checklist:**
- Chatbot responds correctly
- Language switching (EN/DE) works
- Lead qualification completes
- Responsive on mobile/tablet/desktop
- Theme toggle functions

## Code Quality Standards

### Pre-commit Checklist
- [ ] No TypeScript errors (`npm run check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Components under 200 lines
- [ ] Proper types (no `any`)
- [ ] Responsive design tested
- [ ] API endpoints properly typed

## What to Avoid

### Don't Over-Engineer
- ❌ Don't add state management (Redux, Zustand) - TanStack Query handles it
- ❌ Don't create complex abstractions early
- ❌ Don't add dependencies "just in case"
- ❌ Don't optimize prematurely

### Keep It Maintainable
- ❌ Don't create 1000+ line files
- ❌ Don't repeat code - extract components
- ❌ Don't ignore TypeScript/Python type errors
- ❌ Don't skip responsive design

## Deployment

Using Docker Compose:

```bash
docker-compose up --build
```

Configure environment variables in `.env` for your target environment (development or production).

## Additional Documentation

- **Max Chatbot**: `docs/max_chatbot.md` - Complete chatbot specification
- **LangChain/LangGraph**: `docs/langchain/`, `docs/langgraph/` - Framework documentation
- **Email Automation**: `docs/email-automation-research.md` - Integration research
- **Context Engineering**: `.claude/Context-Engineering-Cognitive-Map.md` - Development framework
- **Contributing**: `CONTRIBUTING.md` - Contribution guidelines

## Context Engineering Framework (`.claude/` Directory)

The `.claude/` directory contains the Context Engineering framework for AI-assisted development.

### Directory Structure

```
.claude/
├── PRPs/                              # Product Requirements Prompts
│   ├── PRPs/                          # NEW PRPs GO HERE (active work)
│   │   └── completed/                 # Move PRPs here when done
│   ├── research/                      # TECHNICAL RESEARCH GOES HERE
│   ├── scripts/                       # Framework automation scripts
│   └── templates/                     # 7 PRP template types
│
├── artifacts/                         # Strategic documents & outputs
│   ├── create_brand_story/            # Brand stories for verticals
│   ├── profile-adam/                  # Team profiles
│   └── profile-richard/
│
├── commands/                          # Slash commands (41 total)
│   ├── prp-commands/                  # PRP workflows (15 commands)
│   ├── development/                   # Dev workflows (6 commands)
│   ├── rapid-development/             # Advanced parallel (8 commands)
│   ├── code-quality/                  # Code review (3 commands)
│   ├── typescript/                    # TypeScript-specific (4 commands)
│   ├── git-operations/                # Git automation (3 commands)
│   └── ar_strategy/                   # Business strategy (2 commands)
│
├── Context-Engineering-Cognitive-Map.md   # Complete framework guide
└── settings.local.json
```

### File Placement Rules

**PRPs (Product Requirements Prompts):**
- New PRPs → `.claude/PRPs/PRPs/`
- Completed PRPs → `.claude/PRPs/PRPs/completed/`
- Technical research → `.claude/PRPs/research/`

**Artifacts:**
- Strategic documents and generated outputs → `.claude/artifacts/`
- Brand stories → `.claude/artifacts/create_brand_story/`
- Team profiles → `.claude/artifacts/profile-{name}/`

**Commands:**
- Custom slash commands → `.claude/commands/{category}/`

### Key Concepts

**PRPs** = Product Requirements Prompts - Structured specifications that provide AI agents with complete context, implementation strategy, and validation gates for building features.

**Artifacts** = Strategic knowledge documents (brand stories, research, profiles) that inform development but are not code.

**Commands** = Slash commands (like `/prp-story-create`) that orchestrate AI workflows for creating and executing PRPs.

For complete framework documentation, see `.claude/Context-Engineering-Cognitive-Map.md`.

## Learning Resources

- **React**: https://react.dev
- **Vite**: https://vitejs.dev/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TanStack Query**: https://tanstack.com/query/latest
- **FastAPI**: https://fastapi.tiangolo.com
- **LangChain**: https://python.langchain.com
- **LangGraph**: https://langchain-ai.github.io/langgraph/

## Project Notes

### Marketing vs. Chatbot Balance
- Marketing sections attract visitors (Hero, Solutions, Verticals, Trust, CTA)
- Chatbot (Max) qualifies them as leads through conversation
- Both work together harmoniously on the landing page

### Database Strategy
- PostgreSQL via Docker
- Tables auto-create on first run via SQLAlchemy

### API Design
- RESTful endpoints for chat operations
- OpenAPI docs auto-generated at `/docs`
- WebSocket support could be added for real-time updates

---

**Last updated:** October 2025
**Remember:** Keep it simple, functional, and user-friendly. Build only what's needed now.
