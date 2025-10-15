# Product Requirement Prompt: Team Page Implementation

**Feature**: Create a team page including myself Richard Thompson @.claude/artifacts/profile-richard/ and Adam Konopka, our Senior Developer

**Created**: 2025-01-12
**Status**: Ready for Implementation
**Confidence Score**: 9/10

---

## Goal

### Feature Goal
Create a professional, accessible team page for AR Automation that showcases Richard Thompson (Founder & AI Engineer) and Adam Konopka (Senior Developer) with comprehensive profiles, credibility signals, and contact information.

### Deliverable
A fully functional `/team` route with:
- Responsive card-based grid layout (mobile: 1 col, desktop: 2 cols)
- Professional team member profiles with photos, bios, credentials
- LinkedIn and email contact links
- WCAG 2.1 AA accessibility compliance
- Consistent with existing site design patterns and branding

### Success Definition
- Page loads in under 2 seconds
- All accessibility tests pass (keyboard navigation, screen readers, color contrast)
- Responsive layout works on mobile (375px), tablet (768px), and desktop (1280px+)
- Navigation menu updated to link to `/team` route
- Profile information accurately reflects Richard Thompson's background from artifacts
- Professional, trustworthy appearance suitable for B2B automation consulting

---

## User Persona

### Target User
**B2B Decision Maker** (CTO, Operations Director, Business Owner)

### Use Case
Visiting the AR Automation website to evaluate the company's expertise and credibility before scheduling a consultation. Wants to understand who they'll be working with, what qualifications the team has, and whether they have relevant technical expertise.

### User Journey
1. Visits AR Automation website
2. Clicks "Team" in navigation menu
3. Lands on team page
4. Scans team member cards for credentials and expertise
5. Reads bios to understand backgrounds
6. Clicks LinkedIn to verify professional history
7. Decides to schedule consultation based on team credibility

### Pain Points Solved
- "Who are these people and what are their qualifications?"
- "Do they have relevant technical expertise for my industry?"
- "Can I trust them with my business automation needs?"
- "How do I contact them if I have questions?"

---

## Why

### Business Value
- **Builds Trust**: Professional team page increases conversion rates by 20-30% (industry standard)
- **Establishes Credibility**: Academic credentials, published research, and technical expertise differentiate from competitors
- **Reduces Friction**: Direct contact information lowers barrier to initial outreach
- **SEO Benefit**: Team member names, credentials, and expertise add relevant keywords

### Integration with Existing System
- Uses existing React + TypeScript + Vite + Tailwind stack
- Leverages existing shadcn/ui components (Card, Avatar, Badge, Button)
- Follows existing page structure pattern (Navigation → Hero → Content → CTA → Footer)
- Maintains design consistency with EdTechSolutionsPage.tsx and other existing pages

### Problems Solved
1. **Current State**: Navigation has `#team` anchor link but no dedicated team page
2. **Confusion**: Users can't find comprehensive team information
3. **Credibility Gap**: Richard's extensive background (Cognitive Science, Carnegie Mellon, published research) not visible
4. **Contact Friction**: No clear way to reach specific team members

---

## What

### User-Visible Behavior

**Route**: `/team`

**Page Structure**:
1. **Hero Section**:
   - Heading: "Meet Our Team"
   - Subheading: "Expert automation architects dedicated to transforming your business processes"
   - Background: Gradient (`bg-gradient-to-br from-primary to-primary/80`)

2. **Team Grid Section**:
   - Two-column responsive grid
   - Card for Richard Thompson:
     - Professional headshot (Avatar component)
     - Name: "Richard Thompson"
     - Title: "Founder, AI Engineer & Automation Architect"
     - Bio: 100-125 words highlighting Cognitive Science background, LangGraph expertise, context engineering achievement
     - Credentials: BSc First Class Honours, Carnegie Mellon, Published Research
     - Technical Focus: Badges for LangGraph, Python/FastAPI, React/TypeScript, Voice AI
     - LinkedIn and Email links
   - Card for Adam Konopka:
     - Professional headshot (Avatar component or placeholder)
     - Name: "Adam Konopka"
     - Title: "Senior Developer"
     - Bio: 75-100 words (needs to be created/sourced)
     - Credentials: (needs to be provided)
     - Technical Focus: Badges for expertise areas
     - LinkedIn and Email links

3. **CTA Section**:
   - Heading: "Ready to transform your business?"
   - Button: "Schedule a Consultation" (links to /conference)
   - Background: Gradient matching hero

**Interactions**:
- Hover effects on cards (shadow increase, subtle scale)
- Hover effects on contact icons (color change)
- Keyboard navigation supported
- Mobile touch-friendly (buttons 44x44px minimum)

### Success Criteria

**Functional**:
- [ ] `/team` route loads successfully
- [ ] Navigation menu links to `/team` (both desktop and mobile)
- [ ] Two team member cards display correctly
- [ ] All images load
- [ ] LinkedIn and email links work
- [ ] Responsive layout adapts correctly

**Quality**:
- [ ] WCAG 2.1 AA compliant (alt text, keyboard nav, color contrast)
- [ ] Lighthouse scores: Performance > 90, Accessibility 100
- [ ] No console errors
- [ ] Smooth animations (60fps)

**Content**:
- [ ] Richard Thompson bio accurately reflects profile artifacts
- [ ] Credentials and technical focus correctly displayed
- [ ] Professional, error-free copy
- [ ] Contact information is current

---

## Context

### Documentation References

```yaml
external_docs:
  - url: https://react.dev/learn
    section: "Components and Props"
    why: React component patterns for TeamPage and TeamMemberCard
    critical: Use functional components with hooks

  - url: https://tailwindcss.com/docs/responsive-design
    section: "Responsive Design"
    why: Mobile-first responsive grid layout implementation
    critical: Use breakpoint prefixes (md:, lg:) for responsive behavior

  - url: https://www.w3.org/WAI/WCAG21/quickref/
    section: "1.1.1 Non-text Content, 1.4.3 Contrast, 2.1.1 Keyboard"
    why: Accessibility compliance requirements
    critical: Alt text format: "[Name], [Title]", contrast ratio 4.5:1 minimum

  - url: https://www.radix-ui.com/primitives/docs/components/avatar
    section: "Avatar Component"
    why: Avatar component usage (currently unused in codebase)
    critical: Use AvatarImage with AvatarFallback for graceful degradation
```

### Codebase References

```yaml
patterns:
  - file: frontend/src/pages/EdTechSolutionsPage.tsx
    lines: 13-386
    pattern: "Full page structure with Navigation, Hero, multiple sections, Footer"
    follow: "Use this as template: Navigation at top, Footer at bottom, useEffect for scroll"
    gotcha: "Must include useEffect(() => window.scrollTo(0, 0), []) to scroll to top on load"

  - file: frontend/src/components/ui/card.tsx
    lines: 1-57
    pattern: "Card component with subcomponents (Card, CardHeader, CardTitle, CardContent, CardFooter)"
    follow: "Use Card for team member containers, CardContent for bio"
    example: |
      <Card className="p-8 hover:shadow-xl transition-all duration-300">
        <CardContent>
          {/* content */}
        </CardContent>
      </Card>
    gotcha: "Use h-full flex flex-col for equal-height cards, mt-auto on footer to push to bottom"

  - file: frontend/src/components/ui/avatar.tsx
    lines: 1-48
    pattern: "Avatar, AvatarImage, AvatarFallback components"
    follow: "First use of Avatar component in codebase - implement per Radix UI docs"
    example: |
      <Avatar className="h-24 w-24">
        <AvatarImage src="/assets/images/richard.jpg" alt="Richard Thompson" />
        <AvatarFallback>RT</AvatarFallback>
      </Avatar>
    gotcha: "Always provide AvatarFallback with initials for graceful degradation"

  - file: frontend/src/components/ui/badge.tsx
    lines: 1-37
    pattern: "Badge component with variants (default, secondary, outline)"
    follow: "Use variant='secondary' for technical skills/expertise badges"
    example: |
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">LangGraph</Badge>
        <Badge variant="secondary">Python/FastAPI</Badge>
      </div>

  - file: frontend/src/components/solutions/SolutionCategoryCard.tsx
    lines: 1-125
    pattern: "Card layout with icon, title, description, badges"
    follow: "Similar structure for team cards: avatar, name/title, bio, badges, links"
    gotcha: "Use group hover for nested animation effects: group hover:shadow-xl"

  - file: frontend/src/components/VerticalCard.tsx
    lines: 1-89
    pattern: "Full-height cards with mt-auto button placement"
    follow: "Use h-full flex flex-col on Card, mt-auto on button container"
    gotcha: "Buttons should be at bottom regardless of content length"

routing:
  - file: frontend/src/App.tsx
    lines: 1-50
    pattern: "Wouter routing with Switch and Route components"
    action: |
      1. Import TeamPage component
      2. Add route BEFORE NotFound catch-all:
         <Route path="/team" component={TeamPage} />
    gotcha: "Route order matters - more specific routes must come before general routes"

  - file: frontend/src/components/Navigation.tsx
    lines: 61-63, 111-113
    pattern: "Current #team anchor links in desktop and mobile navigation"
    action: |
      Replace anchor links with Wouter Link component:
      - Import: import { Link } from 'wouter';
      - Desktop (line 61-63):
        <Link href="/team">
          <a className="hover-elevate px-3 py-2 rounded-md">{t('nav.team')}</a>
        </Link>
      - Mobile (line 111-113): Same pattern
    gotcha: "Must wrap in Link component, keep existing classes and i18n"

profile_data:
  - file: .claude/artifacts/profile-richard/04-team-bio-ar-automation.md
    lines: 1-30
    why: "Source of truth for Richard Thompson's team page content"
    extract: |
      - Name: Richard Thompson
      - Title: AI Engineer, Automation Architect & Cognitive Science Researcher
      - Education: BSc Cognitive Science, First Class Honours, University of Exeter
      - Notable: Carnegie Mellon internship with Prof. J.L. McClelland
      - Research: Published in Developmental Science (2007)
      - Specialization: Agentic AI, LangGraph, Voice AI, Context Engineering
      - Achievement: 85-95% first-pass completion rates in AI development
      - Tech Stack: LangGraph, Python/FastAPI, React/TypeScript, Android/Kotlin
    critical: "Use bio excerpt from lines 5-15, preserve credibility signals"

tech_stack:
  - file: CLAUDE.md
    lines: 89-100
    stack: "React 18, TypeScript, Vite, Tailwind CSS, Wouter, shadcn/ui, i18next"
    gotcha: "NOT Next.js - using Vite; NOT Redux - using TanStack Query; routing with Wouter"
    styling: "Tailwind utility classes only, no custom CSS unless necessary"
    components: "All UI components from @/components/ui/ (shadcn/ui library)"
```

### Known Gotchas

```yaml
gotchas:
  - issue: "Navigation links currently use #team anchors"
    impact: "Will conflict with new /team route"
    solution: "Replace with Wouter Link components pointing to /team route"
    files: "frontend/src/components/Navigation.tsx lines 61-63, 111-113"

  - issue: "Avatar component defined but never used"
    impact: "No usage examples exist in codebase"
    solution: "Follow Radix UI documentation exactly, test with AvatarFallback"
    critical: "Always provide fallback with initials (e.g., RT for Richard Thompson)"

  - issue: "Adam Konopka profile information missing"
    impact: "Cannot complete second team member card with real data"
    solution: |
      Option 1: Use placeholder content and TODO comment for future update
      Option 2: Ask user for Adam's bio, credentials, photo before implementation
    recommendation: "Ask user for Adam's information NOW before proceeding"

  - issue: "Team member photos don't exist yet"
    impact: "AvatarImage src will 404 without actual images"
    solution: "Use AvatarFallback with initials until photos provided"
    location: "Place photos in frontend/public/assets/images/team/"
    naming: "richard-thompson.jpg, adam-konopka.jpg"

  - issue: "Equal-height cards with varying content lengths"
    impact: "Cards with shorter bios will be shorter than cards with longer bios"
    solution: "Use h-full flex flex-col on Card, mt-auto on footer section"
    example: "See VerticalCard.tsx lines 45-89 for pattern"

  - issue: "Dark mode support required"
    impact: "Must work in both light and dark themes"
    solution: "Use Tailwind dark: prefix for dark mode variants"
    example: "bg-white dark:bg-gray-800, text-gray-900 dark:text-white"

  - issue: "i18n translations might be needed"
    impact: "If content is translatable, needs German version"
    solution: "Keep team bios in English only (proper names, technical content)"
    note: "Page headings (\"Meet Our Team\") should use i18n if German version exists"
```

---

## Implementation Blueprint

### Data Models

```typescript
// frontend/src/lib/team-data.ts

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;  // Path to image in public/assets/images/team/
  credentials: string[];
  expertise: string[];
  linkedin?: string;
  email?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'richard-thompson',
    name: 'Richard Thompson',
    title: 'Founder, AI Engineer & Automation Architect',
    bio: 'Richard designs and builds the intelligent systems that power AR Automation's client solutions—from web platforms to voice-driven mobile applications. With a background in Cognitive Science (First Class Honours, University of Exeter) including research collaboration with Prof. J.L. McClelland at Carnegie Mellon University, he brings both rigorous academic training and practical understanding of how organizations work. Richard's context engineering framework has achieved 85-95% first-pass completion rates in AI-assisted development, transforming how AR Automation builds client solutions.',
    image: '/assets/images/team/richard-thompson.jpg',
    credentials: [
      'BSc Cognitive Science, First Class Honours',
      'Carnegie Mellon University Internship',
      'Published Researcher (Developmental Science, 2007)',
    ],
    expertise: [
      'Agentic AI',
      'LangGraph',
      'Python/FastAPI',
      'React/TypeScript',
      'Voice AI',
      'Context Engineering',
    ],
    linkedin: 'https://linkedin.com/in/richard-thompson',  // TODO: Update with actual LinkedIn URL if available
    email: 'richard@arlabs.tech',
  },
  {
    id: 'adam-konopka',
    name: 'Adam Konopka',
    title: 'Senior Developer',
    bio: 'Adam is a freelance web developer based in Augsburg, Germany, bringing extensive full-stack expertise to AR Automation's client projects. With a strong foundation from Technische Universität Berlin and deep experience in e-commerce solutions, he specializes in building scalable web applications across diverse industries including accounting, education, and e-commerce. Known for his proactive problem-solving approach and team-oriented mindset, Adam excels at rapidly adapting modern frameworks to deliver robust automation solutions that meet complex business requirements. His multilingual capabilities (German, English, Polish) enable seamless collaboration with international clients.',
    image: '/assets/images/team/adam-konopka.jpg',
    credentials: [
      'Technische Universität Berlin (2018-2023)',
      'Freelance Web Developer',
      'E-commerce specialist (Shopware, full-stack solutions)',
      'Multilingual: German, English, Polish',
    ],
    expertise: [
      'Vue.js',
      'Node.js',
      'PHP',
      'SQL',
      'Shopware',
      'E-commerce Solutions',
    ],
    linkedin: 'https://www.linkedin.com/in/adam-konopka-738b35184/',
    email: 'adam@arlabs.tech',
  },
];
```

---

### Ordered Tasks

#### Task 1: CREATE team data file
**File**: `frontend/src/lib/team-data.ts`

**Action**: CREATE new file with TeamMember interface and teamMembers array

**Implementation**:
- COPY interface and data structure from Data Models section above
- UPDATE Richard Thompson's linkedin and email with actual values
- ADD TODO comments for Adam Konopka's missing information
- PLACE file in lib/ directory alongside other data/utility files

**Validation**:
```bash
# Verify file exists and TypeScript compiles
npx tsc --noEmit frontend/src/lib/team-data.ts
```

**IF_FAIL**: Check import paths, ensure TypeScript is configured correctly

---

#### Task 2: CREATE TeamMemberCard component
**File**: `frontend/src/components/TeamMemberCard.tsx`

**Action**: CREATE reusable component for displaying team member profiles

**Pattern**: Follow Card + Avatar + Badge pattern from codebase analysis

**Implementation**:
```typescript
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin } from 'lucide-react';
import type { TeamMember } from '@/lib/team-data';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <Card className="group h-full flex flex-col p-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary">
      {/* Header: Avatar + Name/Title */}
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={member.image} alt={`${member.name}, ${member.title}`} />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-2xl font-bold text-primary mb-1">{member.name}</h3>
          <p className="text-base text-muted-foreground">{member.title}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-foreground leading-relaxed mb-6">
        {member.bio}
      </p>

      {/* Credentials */}
      {member.credentials.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-sm mb-2 text-foreground">Education & Credentials</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {member.credentials.map((cred, idx) => (
              <li key={idx}>• {cred}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Expertise Badges */}
      {member.expertise.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {member.expertise.map((skill, idx) => (
            <Badge key={idx} variant="secondary">{skill}</Badge>
          ))}
        </div>
      )}

      {/* Contact Links (pushed to bottom) */}
      <div className="flex gap-3 mt-auto">
        {member.linkedin && member.linkedin !== 'TODO: Add LinkedIn URL' && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
            aria-label={`${member.name}'s LinkedIn profile`}
          >
            <Linkedin className="w-5 h-5" />
          </a>
        )}
        {member.email && member.email !== 'TODO: Add email' && (
          <a
            href={`mailto:${member.email}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
            aria-label={`Email ${member.name}`}
          >
            <Mail className="w-5 h-5" />
          </a>
        )}
      </div>
    </Card>
  );
}
```

**Key Points**:
- FOLLOW Card pattern from SolutionCategoryCard.tsx
- USE h-full flex flex-col for equal-height cards
- USE mt-auto on contact links to push to bottom
- IMPLEMENT hover effects: shadow-xl, scale, border-color
- ENSURE accessibility: alt text, aria-labels, keyboard-accessible links
- HANDLE missing data gracefully (TODO checks for LinkedIn/email)

**Validation**:
```bash
# TypeScript compilation
npx tsc --noEmit frontend/src/components/TeamMemberCard.tsx

# Visual check
npm run dev
# Visit http://localhost:5173 and test component in isolation
```

**IF_FAIL**:
- Check imports from @/components/ui/
- Verify lucide-react icons are available
- Ensure TeamMember type is correctly imported

---

#### Task 3: CREATE TeamPage component
**File**: `frontend/src/pages/TeamPage.tsx`

**Action**: CREATE full team page with hero, grid, CTA sections

**Pattern**: Follow EdTechSolutionsPage.tsx structure (lines 13-386)

**Implementation**:
```typescript
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import { teamMembers } from '@/lib/team-data';

export default function TeamPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <span className="font-semibold">Our Team</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Meet Our Team
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Expert automation architects dedicated to transforming your business processes
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Schedule a consultation to explore automation opportunities for your organization
          </p>
          <Link href="/conference">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Schedule a Consultation
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

**Key Points**:
- COPY hero section pattern from EdTechSolutionsPage.tsx
- USE grid grid-cols-1 md:grid-cols-2 for responsive layout
- USE max-w-5xl to constrain width for 2-column layout
- CENTER grid with mx-auto
- FOLLOW gradient background pattern: from-primary to-primary/80
- ENSURE scroll-to-top on mount with useEffect

**Validation**:
```bash
# TypeScript compilation
npx tsc --noEmit frontend/src/pages/TeamPage.tsx

# Run dev server and test
npm run dev
# Visit http://localhost:5173/team (after routing is set up)
```

**IF_FAIL**:
- Check all imports resolve correctly
- Verify teamMembers array is exported from team-data.ts
- Ensure TeamMemberCard component exists

---

#### Task 4: UPDATE App.tsx to add /team route
**File**: `frontend/src/App.tsx`

**Action**: ADD new route for TeamPage

**Pattern**: Follow existing Wouter routing pattern

**Changes**:
1. ADD import at top:
```typescript
import TeamPage from "@/pages/TeamPage";
```

2. ADD route BEFORE NotFound catch-all (order matters):
```typescript
<Route path="/team" component={TeamPage} />
```

**Location**: Insert after `/conference` route, before `<Route component={NotFound} />`

**Example**:
```typescript
<Switch>
  <Route path="/" component={HomePage} />
  <Route path="/solutions" component={SolutionsPage} />
  <Route path="/use-cases" component={UseCasesPage} />
  <Route path="/demos" component={DemosPage} />
  <Route path="/resources" component={ResourcesPage} />
  <Route path="/conference" component={ConferencePage} />
  <Route path="/team" component={TeamPage} />  {/* NEW */}
  <Route component={NotFound} />
</Switch>
```

**Validation**:
```bash
# TypeScript compilation
npx tsc --noEmit frontend/src/App.tsx

# Test routing
npm run dev
# Navigate to http://localhost:5173/team
# Should load TeamPage component
```

**IF_FAIL**:
- Verify TeamPage import path is correct
- Check that route is BEFORE NotFound catch-all
- Ensure Wouter is installed and imported

---

#### Task 5: UPDATE Navigation.tsx to link to /team route
**File**: `frontend/src/components/Navigation.tsx`

**Action**: REPLACE `#team` anchor links with Wouter Link components

**Pattern**: Use Link from wouter for client-side routing

**Changes**:

1. ADD import at top:
```typescript
import { Link } from 'wouter';
```

2. FIND Desktop team link (around line 61-63):
```typescript
// OLD (remove):
<a href="#team" className="hover-elevate px-3 py-2 rounded-md" data-testid="link-team">
  {t('nav.team')}
</a>

// NEW (replace with):
<Link href="/team">
  <a className="hover-elevate px-3 py-2 rounded-md" data-testid="link-team">
    {t('nav.team')}
  </a>
</Link>
```

3. FIND Mobile team link (around line 111-113):
```typescript
// OLD (remove):
<a href="#team" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-team">
  {t('nav.team')}
</a>

// NEW (replace with):
<Link href="/team">
  <a className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-team">
    {t('nav.team')}
  </a>
</Link>
```

**Key Points**:
- PRESERVE existing className attributes
- PRESERVE data-testid attributes
- PRESERVE i18n translation function {t('nav.team')}
- DO NOT change any other navigation links

**Validation**:
```bash
# TypeScript compilation
npx tsc --noEmit frontend/src/components/Navigation.tsx

# Test navigation
npm run dev
# Click "Team" link in nav (both desktop and mobile)
# Should navigate to /team without full page reload
```

**IF_FAIL**:
- Verify Link is imported from 'wouter'
- Check that Link component wraps <a> element
- Test that other nav links still work

---

#### Task 6: COPY and optimize team images
**Directory**: `frontend/public/assets/images/team/`

**Action**: COPY photos from artifacts directory and optimize for web

**Source Photos Available**:
- Richard: `.claude/artifacts/profile-richard/mr_richard.jpg`
- Adam: `.claude/artifacts/profile-adam/mr_adam.jpg`
- Both: `.claude/artifacts/profile-richard/adam_and_richard.jpg` (optional for team culture section)

**Implementation**:
```bash
# Create directory
mkdir -p frontend/public/assets/images/team

# Copy photos with web-friendly names
cp .claude/artifacts/profile-adam/mr_adam.jpg frontend/public/assets/images/team/adam-konopka.jpg
cp .claude/artifacts/profile-richard/mr_richard.jpg frontend/public/assets/images/team/richard-thompson.jpg

# Optional: Copy team photo for future team culture section
cp .claude/artifacts/profile-richard/adam_and_richard.jpg frontend/public/assets/images/team/team-photo.jpg
```

**Image Optimization** (recommended):
```bash
# Check current file sizes
ls -lh frontend/public/assets/images/team/

# If images are > 100KB, optimize with one of these tools:
# - Squoosh.app (web-based)
# - ImageOptim (Mac)
# - sharp npm package:
npm install --save-dev sharp
npx sharp -i frontend/public/assets/images/team/adam-konopka.jpg -o frontend/public/assets/images/team/adam-konopka-optimized.jpg --resize 400 400
```

**Target Specs**:
- Dimensions: 400x400px (1x display)
- File size: < 100KB each
- Format: JPG is fine (WebP conversion optional)

**Validation**:
```bash
# Verify files exist
ls -la frontend/public/assets/images/team/

# Check they're accessible in browser (after starting dev server)
npm run dev
# Visit:
# http://localhost:5173/assets/images/team/richard-thompson.jpg
# http://localhost:5173/assets/images/team/adam-konopka.jpg
```

---

#### Task 7: REQUEST Adam Konopka information from user
**Action**: ASK user for Adam Konopka's profile data

**Required Information**:
1. **Bio**: 75-100 words highlighting:
   - Technical expertise and specializations
   - Key technologies/frameworks
   - What he brings to client projects
   - Background/experience highlights

2. **Credentials/Education**:
   - Degrees, certifications, notable achievements
   - Format as bullet points

3. **Technical Focus**:
   - 4-6 key expertise areas (for Badge components)
   - Example: "Node.js", "PostgreSQL", "System Architecture", etc.

4. **Contact Information**:
   - LinkedIn profile URL
   - Email address

5. **Professional Photo**:
   - High-quality headshot
   - 400x400px minimum
   - Professional background
   - File format: JPG or WebP

**Once provided**:
- UPDATE `frontend/src/lib/team-data.ts` with Adam's information
- ADD photo to `frontend/public/assets/images/team/adam-konopka.jpg`
- REMOVE all TODO comments

**IF NOT PROVIDED**:
- Card will display with placeholder initials "AK"
- Bio will show TODO message
- Consider adding "More team members coming soon" note

---

## Validation Loop

### Level 1: Syntax & Style
```bash
# TypeScript type checking
cd frontend
npx tsc --noEmit

# Expected: 0 errors

# ESLint
npm run lint

# Expected: 0 errors, 0 warnings

# Build test
npm run build

# Expected: Successful build, no errors
```

**Continue ONLY when**: All commands pass with zero errors

---

### Level 2: Unit & Component Tests
```bash
# Visual component testing
npm run dev

# Manual test checklist:
# 1. Visit http://localhost:5173/team
# 2. Verify page loads without console errors
# 3. Check that both team member cards render
# 4. Verify Avatar fallbacks show "RT" and "AK"
# 5. Test hover effects on cards (shadow, scale)
# 6. Test LinkedIn and email links (if data provided)
# 7. Click "Schedule a Consultation" button - should navigate to /conference
# 8. Click "Team" in navigation - should navigate to /team
```

**Responsive testing**:
```bash
# Mobile (375px)
# - Open DevTools, set viewport to iPhone SE
# - Should show 1 column layout
# - Cards should be full width
# - All text should be readable
# - Buttons should be 44x44px minimum

# Tablet (768px)
# - Set viewport to iPad
# - Should show 2 column layout
# - Cards should have equal heights
# - Spacing should be balanced

# Desktop (1280px+)
# - Set viewport to desktop
# - Should show 2 column layout
# - Grid should be centered with max-width
# - Hover effects should work
```

**Continue ONLY when**: All visual and responsive tests pass

---

### Level 3: Accessibility Testing
```bash
# Keyboard navigation test
# 1. Navigate to /team
# 2. Press Tab repeatedly
# 3. Verify focus moves through all interactive elements:
#    - Navigation links
#    - LinkedIn icons (if visible)
#    - Email icons (if visible)
#    - "Schedule a Consultation" button
# 4. Verify focus indicators are visible
# 5. Press Enter on each element to activate

# Screen reader test (if possible)
# - Use VoiceOver (Mac), NVDA (Windows), or JAWS
# - Navigate page and verify all content is announced
# - Check that alt text is read correctly for avatars
# - Verify link purposes are clear

# Color contrast test
# - Open DevTools Accessibility panel
# - Check all text has 4.5:1 contrast ratio minimum
# - Test both light and dark modes

# Lighthouse audit
# 1. Open DevTools
# 2. Run Lighthouse audit (Performance, Accessibility, Best Practices)
# 3. Check scores:
#    - Performance: > 90
#    - Accessibility: 100
#    - Best Practices: > 90
```

**Continue ONLY when**: Accessibility score is 100, keyboard nav works, color contrast passes

---

### Level 4: Integration & Final Validation
```bash
# Full user journey test
# 1. Start at homepage (/)
# 2. Click "Team" in navigation
# 3. Verify smooth navigation (no page reload)
# 4. Scroll through team page
# 5. Hover over team cards (check animations)
# 6. Click LinkedIn links (should open in new tab)
# 7. Click email links (should open mail client)
# 8. Click "Schedule a Consultation" (should navigate to /conference)
# 9. Use browser back button (should return to /team)
# 10. Test on mobile device or simulator

# Dark mode test
# 1. Toggle dark mode in navigation
# 2. Verify all sections render correctly
# 3. Check text contrast in dark mode
# 4. Verify cards, buttons, links are visible

# Cross-browser test (if possible)
# - Chrome/Edge
# - Firefox
# - Safari (Mac/iOS)
```

**Final Quality Check**:
- [ ] No console errors
- [ ] All links work correctly
- [ ] Images load (or fallbacks show)
- [ ] Responsive on all screen sizes
- [ ] Accessible via keyboard
- [ ] Dark mode works
- [ ] Animations are smooth
- [ ] Content is accurate and professional

---

## Final Checklist

### Technical Completeness
- [ ] TeamMemberCard component created and working
- [ ] TeamPage created with hero, grid, CTA
- [ ] /team route registered in App.tsx
- [ ] Navigation links updated to /team
- [ ] Team data file created with TypeScript types
- [ ] All imports resolve correctly
- [ ] TypeScript compiles with no errors
- [ ] Build succeeds without warnings

### Feature Completeness
- [ ] Richard Thompson profile is complete and accurate
- [ ] Adam Konopka profile is complete (or marked as TODO)
- [ ] Two team member cards display in grid
- [ ] Professional headshots display (or fallback initials)
- [ ] Bios, credentials, expertise all render correctly
- [ ] LinkedIn and email links work
- [ ] CTA button links to /conference page
- [ ] Page matches existing site design language

### Quality Assurance
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility = 100
- [ ] Keyboard navigation works completely
- [ ] Screen reader compatible (if tested)
- [ ] Responsive layout works on mobile, tablet, desktop
- [ ] Dark mode support working
- [ ] Smooth animations and transitions
- [ ] No layout shift when images load
- [ ] All text is error-free and professional

### User Experience
- [ ] Page loads quickly (< 2 seconds)
- [ ] Information is easy to scan and read
- [ ] Credibility signals are prominent
- [ ] Contact options are clear
- [ ] Professional and trustworthy appearance
- [ ] Matches brand identity and tone

---

## Confidence Score: 9/10

### High Confidence Factors
✅ Comprehensive codebase patterns identified (Card, Avatar, Badge usage)
✅ Routing pattern is clear and well-established (Wouter)
✅ Richard Thompson profile data is complete and ready to use
✅ Design patterns align with existing pages (EdTechSolutionsPage.tsx)
✅ All necessary UI components exist and are documented
✅ Accessibility requirements are well-defined (WCAG 2.1 AA)
✅ Responsive design patterns are consistent across codebase

### Risk Factor (−1 point)
⚠️  Adam Konopka profile information is missing (bio, credentials, photo, contact)
- **Impact**: Second team member card will show placeholder/TODO content
- **Mitigation**: Ask user for information before implementation, or use placeholder with clear TODOs

---

## Notes

### Adam Konopka Information Request
**IMPORTANT**: Before marking this PRP as complete, request the following from the user:

1. Professional bio (75-100 words)
2. Education and credentials
3. Technical expertise areas (4-6 skills)
4. LinkedIn URL
5. Email address
6. Professional headshot photo (400x400px, <100KB)

### Image Optimization
When photos are provided:
- Use WebP format with JPEG fallback for browser compatibility
- Compress to < 100KB per image
- Use 400x400px (1x) and 800x800px (2x) for Retina displays
- Tools: [Squoosh](https://squoosh.app/), ImageOptim, or `sharp` npm package

### Future Enhancements (Out of Scope)
- Individual team member detail pages (/team/richard-thompson)
- Video introductions
- Testimonials linked to team members
- Blog posts by author
- Calendar integration for direct booking
- Team culture section with group photo
- "Join Our Team" careers section

---

## Success Metrics

**After implementation, this feature will be successful if**:
- Conversion rate from team page to consultation booking increases by 15%+
- Bounce rate on team page is < 40%
- Average time on page is 45+ seconds
- No accessibility violations reported
- Lighthouse scores meet targets (Performance 90+, Accessibility 100)
- User feedback indicates increased trust and credibility

---

**END OF PRP**

*This PRP passes the "No Prior Knowledge" test: An AI agent unfamiliar with this codebase has everything needed to implement this feature successfully using only this document and codebase access.*