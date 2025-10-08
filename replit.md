# AR Automation Website

## Project Overview
Marketing website for AR Automation with an intelligent AI chatbot (Max) for lead qualification across three verticals: Accounting, E-commerce, and Education.

## Tech Stack
- **Frontend**: React with TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon)
- **AI**: OpenAI GPT-4o-mini for chatbot responses
- **Styling**: DeepMind-inspired aesthetic with AR Automation brand colors

## Brand Colors
- Primary: #003049 (Deep Blue)
- Accent Red: #780000 (Dark Red)
- Accent Cream: #FDF0D5 (Cream)

## Features Implemented

### Homepage Sections
1. **Navigation** - Sticky header with industry dropdown, functional language switcher (EN/DE), Get in Touch CTA
2. **Hero Section** - Main headline, value proposition, CTAs for audit scheduling
3. **Verticals Section** - Three industry-specific cards (Accounting, E-commerce, Education) with pain points and results
4. **Inline Chatbot (Max)** - ChatGPT-style conversational interface for lead qualification with multilingual support
5. **Solutions Section** - Core automation offerings with feature highlights
6. **Trust Indicators** - Statistics, ROI metrics, trusted companies
7. **CTA Section** - Final conversion with audit scheduling and playbook download
8. **Footer** - Company info, links, social media

### Internationalization (i18n)
- **Libraries**: react-i18next, i18next
- **Supported Languages**: English (EN), German (DE)
- **Translation Files**: client/src/i18n/locales/en.json, client/src/i18n/locales/de.json
- **Language Persistence**: localStorage stores user language preference
- **Chatbot Multilingual**: Max responds in selected language with language-specific system prompts
- **Coverage**: All UI text, navigation, chatbot interface, and chatbot responses fully translated

### AI Chatbot (Max)
- **Position**: Inline between Verticals and Solutions sections
- **Purpose**: Qualify leads by gathering automation needs and contact information
- **Backend**: OpenAI integration with lead qualification flow
- **Database**: Stores conversations, messages, and qualified leads

## Database Schema

### conversations
- id, sessionId, vertical, status, createdAt
- Tracks chat sessions

### messages
- id, conversationId, role, content, createdAt
- Stores individual chat messages (user/assistant)

### leads
- id, conversationId, vertical, problemDescription, desiredSolution, businessImpact
- contactName, contactEmail, contactPhone, companyName, additionalInfo
- status, createdAt
- Stores qualified lead information

## API Endpoints
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:sessionId` - Get conversation with messages
- `POST /api/chat` - Send message and get AI response
- `POST /api/leads` - Create lead

## Lead Qualification Flow
1. Max asks: "What task would you love to have done automatically?"
2. User describes their problem
3. Max identifies industry vertical
4. Max asks about desired solution and business impact
5. Max collects contact information (name, email, phone, company)
6. System extracts data and creates qualified lead in database
7. Conversation marked as 'qualified'

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for chatbot
- `SESSION_SECRET` - Express session secret

## Recent Changes (Latest First)
- **2025-10-08**: Implemented full internationalization with English and German support
  - Installed react-i18next and i18next
  - Created translation files for EN/DE
  - Updated all components to use i18n translation keys
  - Implemented functional language switcher with localStorage persistence
  - Added multilingual chatbot support with German system prompts
  - Chatbot (Max) greeting and responses adapt to selected language
- Switched from in-memory storage to PostgreSQL database
- Implemented OpenAI integration for intelligent chatbot responses
- Added lead qualification logic with data extraction
- Created inline ChatGPT-style interface replacing floating widget
- Renamed chatbot from "Mr. Friendly" to "Max"
