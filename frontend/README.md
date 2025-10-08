# AR Automation - Frontend

Modern, responsive React application for AR Automation's AI-powered chatbot and lead qualification system.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wouter** - Lightweight routing
- **TanStack Query** - Server state management
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animations
- **i18next** - Internationalization (EN/DE)

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and helpers
│   ├── hooks/          # Custom React hooks
│   └── main.tsx        # Application entry point
├── public/
│   └── assets/         # Static assets (images, icons)
├── index.html          # HTML entry point
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:5173

### Build

```bash
npm run build
```

Output in `dist/` directory.

### Type Checking

```bash
npm run check
```

## Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## Docker

Frontend runs in Nginx container in production. See root `docker-compose.yml`.

## Features

- AI chatbot interface with multi-language support
- Lead qualification workflow
- Responsive design (mobile-first)
- Dark/light theme support
- Smooth animations and transitions
- Accessible UI components
- Form validation with React Hook Form + Zod

## API Integration

Frontend communicates with FastAPI backend at `/api/*` endpoints (proxied via Nginx in production).

## Type Safety

TypeScript types can be generated from backend OpenAPI schema:

```bash
# Generate types from backend
npx openapi-typescript http://localhost:8000/openapi.json -o src/types/api.ts
```
