# AR Automation Website - Implementation Scratchpad

**Status**: 🚧 In Active Development
**Date**: October 12, 2025
**Original PRD**: `.claude/PRPs/ar-automation-website-prd.md`
**Phase 1 PRP**: `.claude/PRPs/phase-1-foundation-homepage.md`
**Project Type**: Marketing website with AI chatbot integration

## Quick Summary

AR Automation is a hybrid marketing website showcasing AI-powered business automation services across three target verticals (Accounting, E-commerce, Education). Built as a full-stack application with React + Vite frontend and (planned) chatbot backend.

**Architecture**: Vite + React 18 + TypeScript + TanStack Query + shadcn/ui
**NOT Next.js** - This project uses Vite, not Next.js App Router

**Current Implementation**:
- ✅ Phase 1 Complete: Foundation & Homepage (English only)
- ✅ Design system with AR Automation brand colors
- ✅ 8 pages implemented (Homepage, Solutions, Use Cases, Demos, Resources, Conference, EdTech Solutions, Not Found)
- ✅ Responsive design with mobile-first approach
- ⏳ Phase 2 Planned: Internationalization (English/German)
- ⏳ Phase 3 Planned: Chatbot integration with LangGraph

---

## Tech Stack

### Core Framework
- **Vite 5.4.20** - Build tool (NOT Next.js)
- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type safety
- **Wouter 3.3.5** - Lightweight routing (NOT react-router)

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first styling
- **shadcn/ui** - Component library built on Radix UI
- **Framer Motion 11.13.1** - Animations
- **lucide-react 0.453.0** - Icon library
- **next-themes 0.4.6** - Dark/light mode support

### State & Data Fetching
- **TanStack Query 5.60.5** - Server state management (NOT Redux)
- **React Hook Form 7.55.0** - Form handling
- **Zod 3.24.2** - Schema validation

### Internationalization
- **i18next 25.5.3** - Translation framework
- **react-i18next 16.0.0** - React bindings

### Backend (Planned)
- **FastAPI** - Python web framework for chatbot API
- **LangGraph** - AI agent orchestration
- **PostgreSQL** - Database for conversations/leads

---

## Directory Structure

```bash
ar3_website/
├── frontend/                     # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components (40+ components)
│   │   │   ├── solutions/       # EdTech-specific components (5 components)
│   │   │   ├── examples/        # Example components (legacy - can be removed)
│   │   │   └── *.tsx            # Core components (10 components)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx                 # Main landing page
│   │   │   ├── SolutionsPage.tsx           # General solutions overview
│   │   │   ├── EdTechSolutionsPage.tsx     # EdTech-specific solutions
│   │   │   ├── UseCasesPage.tsx            # Case studies
│   │   │   ├── DemosPage.tsx               # Demo showcases
│   │   │   ├── ResourcesPage.tsx           # Resources & downloads
│   │   │   ├── ConferencePage.tsx          # EdTech conference page
│   │   │   └── not-found.tsx               # 404 page
│   │   ├── lib/
│   │   │   ├── queryClient.ts              # TanStack Query setup
│   │   │   ├── utils.ts                    # Utility functions
│   │   │   └── edtech-solutions.ts         # EdTech data (568 lines)
│   │   ├── i18n/
│   │   │   └── config.ts                   # i18next configuration
│   │   ├── App.tsx                         # Root component with routing
│   │   ├── main.tsx                        # Entry point
│   │   └── index.css                       # Global styles
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                     # FastAPI + LangGraph (planned)
│   └── (to be implemented)
│
├── .claude/
│   ├── PRPs/                    # Product Requirement Prompts
│   │   ├── ar-automation-website-prd.md
│   │   ├── phase-1-foundation-homepage.md
│   │   └── edtech-expertise-showcase.md
│   └── artifacts/               # Content sources
│       ├── AR-Automation-Overview.md
│       ├── EdTech-Technical-Solution-Mapping.md
│       └── EdTech-Conference-Strategy-INTEGRATED.md
│
├── CLAUDE.md                    # Development guide
├── README.md
└── docker-compose.yml           # Development environment
```

---

## Pages Overview

### 1. **HomePage** (`src/pages/HomePage.tsx`)
**Route**: `/`
**Purpose**: Main landing page showcasing AR Automation's value proposition

**Sections**:
1. Navigation - Sticky header with menu
2. Hero Section - Value proposition headline
3. Verticals Section - 3 cards (Accounting, E-commerce, Education)
4. Inline Chatbot - Conversion bot placeholder
5. Solutions Section - 4 main solutions
6. Trust Indicators - Stats, client logos, certifications
7. CTA Section - Final conversion with risk reversal
8. Footer - Multi-column with links

**Components Used**:
- `Navigation.tsx`
- `HeroSection.tsx`
- `VerticalsSection.tsx` (uses `VerticalCard.tsx`)
- `InlineChatbot.tsx`
- `SolutionsSection.tsx`
- `TrustIndicators.tsx`
- `CTASection.tsx`
- `Footer.tsx`

---

### 2. **SolutionsPage** (`src/pages/SolutionsPage.tsx`)
**Route**: `/solutions`
**Purpose**: General solutions overview (all verticals)

**Content**:
- Industry solutions overview
- Technology stack presentation
- Integration capabilities
- CTA to vertical-specific pages

**Size**: 5,327 lines

---

### 3. **EdTechSolutionsPage** (`src/pages/EdTechSolutionsPage.tsx`)
**Route**: `/solutions/edtech`
**Purpose**: Education-specific solutions showcase

**Sections**:
1. Hero Section (enhanced)
2. Technical Capabilities (Agentic AI, n8n, Combined Power)
3. Solution Categories (8 categories with filtering)
4. Architecture Patterns (4 patterns in accordion)
5. Prospect Solutions (8 solutions in tabs)
6. Integration Points
7. Enhanced CTA

**Components Used**:
- `TechnicalCapabilitySection.tsx`
- `SolutionCategoryGrid.tsx` (uses `SolutionCategoryCard.tsx`)
- `ArchitecturePatternAccordion.tsx`
- `ProspectSolutionTabs.tsx`

**Size**: 10,518 lines (comprehensive showcase)

**Data Source**: `lib/edtech-solutions.ts` (568 lines)

---

### 4. **UseCasesPage** (`src/pages/UseCasesPage.tsx`)
**Route**: `/use-cases`
**Purpose**: Case studies and success stories

**Features**:
- 6 case studies with results
- Filterable by industry
- Card-based layout with hover effects

**Size**: 9,143 lines

---

### 5. **DemosPage** (`src/pages/DemosPage.tsx`)
**Route**: `/demos`
**Purpose**: Interactive demos and examples

**Content**:
- 3 demo showcases
- Video/interactive elements
- CTA to schedule custom demo

**Size**: 6,607 lines

---

### 6. **ResourcesPage** (`src/pages/ResourcesPage.tsx`)
**Route**: `/resources`
**Purpose**: Downloadable resources, guides, whitepapers

**Features**:
- Categorized resource cards
- Gated content (email capture)
- Download CTAs

**Size**: 9,987 lines

---

### 7. **ConferencePage** (`src/pages/ConferencePage.tsx`)
**Route**: `/conference`
**Purpose**: EdTech conference scheduling and information

**Features**:
- Meeting scheduler
- Conference agenda
- Speaker information
- What to expect section

**Size**: 11,873 lines

---

### 8. **NotFoundPage** (`src/pages/not-found.tsx`)
**Route**: `*` (catch-all)
**Purpose**: 404 error page

**Size**: 711 lines

---

## Core Components

### Navigation & Layout

#### **Navigation** (`src/components/Navigation.tsx`)
- Sticky header with logo, menu, language switcher
- Responsive mobile menu
- CTA button ("Get in Touch")
- Links to all main pages
- Industries dropdown (future)

#### **Footer** (`src/components/Footer.tsx`)
- Multi-column layout
- Company info, legal links
- Social media icons
- Newsletter signup (optional)

### Content Sections

#### **HeroSection** (`src/components/HeroSection.tsx`)
- Value proposition headline
- Subheadline and supporting text
- Primary + Secondary CTAs
- 60/40 text/visual split
- Responsive layout

#### **VerticalsSection** (`src/components/VerticalsSection.tsx`)
- 3-column grid of vertical cards
- Uses `VerticalCard.tsx` component
- Responsive (1 col mobile, 3 cols desktop)

**VerticalCard** (`src/components/VerticalCard.tsx`)
- Icon, title, description
- Pain points list
- Results/metrics
- CTA button
- Hover effects

#### **SolutionsSection** (`src/components/SolutionsSection.tsx`)
- 4 main solutions
- Alternating left/right layout
- Benefits lists
- Visual placeholders

#### **TrustIndicators** (`src/components/TrustIndicators.tsx`)
- Animated stat counters
- Client logo carousel
- Certification badges
- Case study highlights

#### **CTASection** (`src/components/CTASection.tsx`)
- Final conversion section
- Risk reversal messaging
- Prominent CTA button
- Accent background

### Interactive Components

#### **InlineChatbot** (`src/components/InlineChatbot.tsx`)
- Chatbot widget (placeholder)
- Conversion funnel entry point
- "What do you want to automate?" CTA
- Future: LangGraph integration

#### **ChatbotWidget** (`src/components/ChatbotWidget.tsx`)
- Full chatbot interface (planned)
- Vertical-specific variants
- Lead qualification logic

---

## shadcn/ui Components Available

40+ components from shadcn/ui including:
- `Accordion` - Collapsible sections
- `Alert`, `AlertDialog` - Notifications
- `Avatar` - User avatars
- `Badge` - Status badges
- `Button` - Primary UI element
- `Calendar` - Date picker
- `Card` - Content containers
- `Checkbox`, `RadioGroup`, `Switch` - Form inputs
- `Command` - Command palette
- `Dialog`, `Sheet`, `Drawer` - Modals
- `DropdownMenu`, `ContextMenu`, `Menubar` - Menus
- `Form`, `Input`, `Label`, `Select`, `Textarea` - Form elements
- `HoverCard`, `Popover`, `Tooltip` - Floating UI
- `NavigationMenu` - Complex navigation
- `Pagination` - Page navigation
- `Progress`, `Slider` - Interactive controls
- `ScrollArea` - Custom scrollbars
- `Separator` - Dividers
- `Tabs` - Tabbed interfaces
- `Toast`, `Toaster` - Notifications
- `Toggle`, `ToggleGroup` - Toggles

**Import Pattern**:
```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
```

---

## Design System

### Brand Colors (from Tailwind Config)

```typescript
colors: {
  // Primary Colors
  primary: {
    dark: '#003049',      // Main headings, primary CTAs
    light: '#669BBC',     // Secondary elements, hover states
  },

  // Accent Colors
  accent: {
    red: '#780000',       // Strategic highlights, urgent CTAs
    cream: '#FDF0D5',     // Background sections, cards
  },

  // Vertical-Specific Colors
  vertical: {
    education: '#4A90E2',
    accounting: '#2ECC71',
    ecommerce: '#E74C3C',
  },

  // Neutral Colors
  neutral: {
    dark: '#363636',      // Body text
    light: '#F5F5F5',     // Page background
    white: '#FFFFFF',     // Cards, content areas
  },
}
```

### Typography System

**Font Stack**: System fonts for performance
- `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

**Heading Weights**:
- h1: 700 (48px-64px)
- h2: 600 (36px-48px)
- h3: 600 (24px-32px)
- h4: 500 (20px-24px)

**Body Text**:
- Large: 18px
- Base: 16px
- Small: 14px

### Spacing System (8px base unit)

```typescript
spacing: {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
}
```

### Responsive Breakpoints

```typescript
screens: {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

---

## Routing with Wouter

**Critical**: This project uses Wouter, **NOT** react-router.

### Routing Pattern

```typescript
// App.tsx
import { Switch, Route } from "wouter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/solutions/edtech" component={EdTechSolutionsPage} />
      <Route path="/solutions" component={SolutionsPage} />
      <Route path="/use-cases" component={UseCasesPage} />
      <Route path="/demos" component={DemosPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/conference" component={ConferencePage} />
      <Route component={NotFound} />  {/* 404 catch-all */}
    </Switch>
  );
}
```

**Key Differences from react-router**:
- Uses `component` prop, not `element`
- No `<Routes>` wrapper, just `<Switch>`
- Catch-all route doesn't need `path="*"`
- Import from `"wouter"`, not `"react-router-dom"`

### Navigation Links

```typescript
// Using Wouter Link
import { Link } from "wouter";

<Link href="/solutions">Solutions</Link>
```

---

## Data Management

### TanStack Query Setup

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}
```

### Example Query Hook

```typescript
import { useQuery } from '@tanstack/react-query';

function useChatMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${conversationId}`);
      return res.json();
    },
    enabled: !!conversationId,
  });
}
```

---

## Internationalization (i18n)

### Current Status
- ⏳ **Planned for Phase 2**
- English-only implementation currently
- i18next + react-i18next configured but not activated

### Configuration (`src/i18n/config.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          // English translations
        }
      },
      de: {
        translation: {
          // German translations
        }
      }
    }
  });

export default i18n;
```

### Usage Pattern (Future)

```typescript
import { useTranslation } from 'react-i18next';

function HeroSection() {
  const { t } = useTranslation();

  return (
    <h1>{t('hero.title')}</h1>
  );
}
```

---

## Backend Architecture (Planned)

### Chatbot Backend
- **Framework**: FastAPI (Python)
- **AI Orchestration**: LangGraph + LangChain
- **LLM**: OpenAI GPT-4
- **Database**: PostgreSQL (Neon cloud DB)
- **ORM**: SQLAlchemy

### Chatbot Variants

```python
# 4 chatbot variants planned:
1. Accounting Chatbot - Accounting firm pain points
2. E-commerce Chatbot - E-commerce business pain points
3. Education Chatbot - Educational institution pain points
4. General Chatbot - Multi-industry qualification
```

### Lead Qualification Flow

```
1. Welcome + Vertical Confirmation
2. Quick Qualification (3-4 questions)
   - Company size
   - Pain points
   - Timeline
   - Budget authority
3. Lead Scoring Logic
4. Routing:
   - High-quality → Book consultation (calendar link)
   - Medium-quality → Download guide (email capture)
   - Low-quality → Resources (blog/case studies)
```

---

## Key Patterns & Conventions

### Component Structure

```typescript
// ✅ Good - Simple functional component
export default function HeroSection() {
  return (
    <section className="py-20 px-4 bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto">
        {/* Content */}
      </div>
    </section>
  );
}

// ✅ Good - Component with props
interface CardProps {
  title: string;
  description: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <div className="p-6 border rounded-lg">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

### Styling with Tailwind

```typescript
// ✅ Good - Utility classes
<button className="px-6 py-3 bg-primary-dark text-white rounded-md hover:bg-opacity-90 transition-colors">
  Click Me
</button>

// ✅ Good - Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>

// ✅ Good - Conditional classes with cn()
import { cn } from "@/lib/utils";

<div className={cn(
  "px-4 py-2 rounded",
  isActive && "bg-primary-dark text-white",
  !isActive && "bg-gray-200 text-gray-900"
)}>
```

### TypeScript Patterns

```typescript
// ✅ Good - Simple, clear interfaces
interface Solution {
  id: string;
  title: string;
  description: string;
  benefits: string[];
}

// ✅ Good - Enum for variants
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

// ❌ Avoid - Complex generic types
type ComplexType<T extends Record<string, any>> = ...;
```

---

## Development Workflow

### Starting Development Server

```bash
cd frontend
npm run dev
# Visit http://localhost:5173 (or port 3000/3001 if occupied)
```

### Type Checking

```bash
npm run check  # TypeScript type checking (tsc --noEmit)
```

### Building for Production

```bash
npm run build  # Creates dist/ directory
npm run preview  # Preview production build
```

### Key Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run check

# Build
npm run build

# Preview build
npm run preview
```

---

## Common Development Tasks

### Adding a New Page

1. Create page component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:
   ```typescript
   <Route path="/new-page" component={NewPage} />
   ```
3. Add navigation link in `Navigation.tsx`
4. Test routing and responsiveness

### Adding a New Component

1. Create component in appropriate directory:
   - `src/components/` for core components
   - `src/components/solutions/` for solution-specific components
   - `src/components/ui/` for shadcn/ui components
2. Export component with proper TypeScript interface
3. Import and use in page components
4. Test responsive behavior

### Styling a Component

1. Use Tailwind utility classes
2. Follow responsive pattern: `md:` for tablet, `lg:` for desktop
3. Use brand colors: `bg-primary-dark`, `text-accent-red`
4. Add hover effects: `hover:bg-opacity-90`, `hover:shadow-lg`
5. Add transitions: `transition-colors duration-200`

### Adding a shadcn/ui Component

```bash
# shadcn/ui CLI (if installed)
npx shadcn-ui@latest add button

# Or manually copy from https://ui.shadcn.com
# Create file in src/components/ui/ and paste code
```

---

## Known Issues & Gotchas

### 1. Routing Confusion
**Issue**: Using react-router patterns with Wouter
**Solution**: Remember Wouter uses `component` prop, not `element`

### 2. Import Aliases
**Issue**: Import paths not working
**Solution**: Use `@/` alias configured in tsconfig.json and vite.config.ts
```typescript
// ✅ Correct
import { Button } from "@/components/ui/button";

// ❌ Wrong
import { Button } from "../../components/ui/button";
```

### 3. Tailwind Classes Not Applying
**Issue**: Custom classes not working
**Solution**: Ensure classes are in Tailwind content paths in tailwind.config.js
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

### 4. TypeScript Errors
**Issue**: Type errors in shadcn/ui components
**Solution**: Many shadcn/ui components have complex types - use `@ts-ignore` sparingly if needed

### 5. Development vs Production
**Issue**: Works in dev but breaks in production
**Solution**: Always test production build before deploying:
```bash
npm run build
npm run preview
```

---

## Validation Checklist

### Before Committing

- [ ] `npm run check` passes (TypeScript)
- [ ] No console errors in browser DevTools
- [ ] Responsive design tested (375px, 768px, 1024px)
- [ ] Navigation links work
- [ ] Images load correctly
- [ ] Hover states work on interactive elements

### Before Deploying

- [ ] `npm run build` succeeds
- [ ] Production build tested with `npm run preview`
- [ ] No broken links
- [ ] Lighthouse score 90+ (Performance, Accessibility, Best Practices, SEO)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## Next Steps & Future Phases

### Phase 2: Internationalization (Planned)
- Install and configure next-intl
- Extract all English text to translation files
- Add German translations
- Implement language switcher in Navigation
- Test both locales

### Phase 3: Chatbot Integration (Planned)
- Set up FastAPI backend
- Implement LangGraph conversation flows
- Create 4 chatbot variants (Accounting, E-commerce, Education, General)
- Connect frontend to backend API
- Implement lead qualification logic
- Add calendar booking integration (Calendly/Cal.com)

### Phase 4: Additional Features (Future)
- Blog section with content management
- Team page with member profiles
- Advanced analytics (GA4, Mixpanel)
- A/B testing framework
- Video content integration
- Webinar landing pages
- Resource library expansion

---

## Quick Reference

### Essential Files
- **Main App**: `src/App.tsx` (routing)
- **Homepage**: `src/pages/HomePage.tsx`
- **Routing**: Wouter (NOT react-router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: TanStack Query (NOT Redux)
- **Build Tool**: Vite (NOT Next.js)

### Essential Commands
```bash
npm run dev      # Start dev server
npm run check    # TypeScript check
npm run build    # Production build
npm run preview  # Preview build
```

### Essential Imports
```typescript
// Routing
import { Link, Route, Switch } from "wouter";

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// State Management
import { useQuery, useMutation } from "@tanstack/react-query";

// Styling
import { cn } from "@/lib/utils";
```

---

## References

**For detailed PRD**: See `.claude/PRPs/ar-automation-website-prd.md`

**For Phase 1 implementation**: See `.claude/PRPs/phase-1-foundation-homepage.md`

**For EdTech solutions**: See `.claude/edtech-prp-scratchpad.md`

**For development philosophy**: See `CLAUDE.md`

**For brand content**: See `.claude/artifacts/AR-Automation-Overview.md`

---

**Last Updated**: October 12, 2025
**Current Phase**: Phase 1 Complete, Phase 2 Planning
**Status**: ✅ Foundation ready, 🚧 Active development
