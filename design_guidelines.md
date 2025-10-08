# AR Automation Website Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (DeepMind) + Design System (Material Design 3)
- **Primary Reference:** DeepMind's scientific, authority-driven aesthetic adapted for light theme B2B context
- **Supporting System:** Material Design 3 for interactive components and elevation
- **Rationale:** B2B AI automation requires credibility and technical sophistication. DeepMind's clean, data-focused design conveys expertise while Material Design 3 provides accessible, modern interaction patterns.

## Core Design Principles

1. **Scientific Authority:** Clean layouts, generous whitespace, and precise typography establish technical credibility
2. **Vertical Clarity:** Strong visual differentiation between Accounting, E-commerce, and Education sections
3. **Progressive Disclosure:** Information reveals purposefully as users scroll, building trust before CTAs
4. **Conversational Integration:** Chatbot feels native, not bolted-on, with vertical-specific entry points

## Color System

### Light Theme Palette (H S% L% format)

**Primary Colors:**
- Primary Dark: `203 100% 14%` - Main headings, primary CTAs, navigation
- Primary Light: `203 40% 58%` - Secondary elements, hover states, accents

**Accent Colors:**
- Accent Red: `0 100% 24%` - Strategic CTAs, urgency indicators, important metrics
- Accent Cream: `43 88% 91%` - Section backgrounds, card highlights, soft contrast

**Neutral Scale:**
- Dark: `0 0% 21%` - Body text, secondary headings
- Light: `0 0% 96%` - Page backgrounds, subtle sections
- White: `0 0% 100%` - Cards, elevated surfaces

**Chatbot Accent:**
- AI Blue: `203 60% 45%` - Chatbot bubbles, AI indicators, processing states

## Typography

**Font System:** System font stack for performance
```
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Monospace: 'SF Mono', 'Monaco', 'Consolas', monospace (for code/data displays)
```

**Type Scale:**
- H1 Hero: 4rem (64px) / 700 / tight leading
- H2 Section: 3rem (48px) / 600 / snug leading  
- H3 Card: 1.75rem (28px) / 600 / normal
- Body Large: 1.125rem (18px) / 400 / relaxed
- Body Base: 1rem (16px) / 400 / relaxed
- Small: 0.875rem (14px) / 500 / normal

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 20, 24 (p-4, mt-8, gap-12, py-20, etc.)

**Container Strategy:**
- Page max-width: `max-w-7xl` (1280px)
- Content sections: `max-w-6xl` (1152px)
- Text content: `max-w-4xl` (896px)
- Vertical rhythm: `py-20` sections on desktop, `py-12` mobile

**Grid Patterns:**
- Hero: Asymmetric 60/40 split (text/visual)
- Vertical Cards: 3-column on desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Features: 2-column alternating with images
- Trust indicators: 4-column stat grid

## Component Library

### Navigation
- Height: 72px sticky header
- Glass morphism effect on scroll with `backdrop-blur-md` and subtle border
- Logo left, centered menu, CTA + language switcher right
- Dropdown menus with subtle shadow and rounded corners

### Hero Section
- Full-width with centered content container
- Large headline with gradient text effect (primary-dark to primary-light)
- Dual CTAs: Solid primary button + ghost secondary
- Background: Subtle geometric pattern or gradient mesh in cream tones
- Hero visual: Abstract data visualization or AI network graphic

### Vertical Cards
- Elevated cards with `shadow-lg` and `hover:shadow-xl` transition
- Top: Icon in circular badge (64px) with vertical-specific accent color
- Content: Icon, title, 3-4 pain points, 2-3 results (with numbers), dual CTAs
- Hover: Subtle lift with `hover:-translate-y-1` transform
- Vertical Colors: Accounting (blue), E-commerce (teal), Education (purple)

### Chatbot Widget
- Fixed bottom-right position with breathing animation
- Circular button (64px) with AI gradient background
- Expands to card (400px wide) with smooth animation
- Messages: User (right, primary-light bg), Bot (left, white bg with border)
- Typing indicator: Three animated dots
- Close: X icon top-right

### Trust Indicators
- Stat Counters: Large numbers (3rem) in accent-red, animated on scroll
- Client Logos: Grayscale grid, color on hover
- Case Study Cards: Image left, quote right, pull-quote styling
- Certifications: Badge grid with subtle borders

### Forms & Inputs
- Outlined inputs with focus ring in primary-light
- Labels: Floating animation on focus
- Validation: Inline green/red states
- Submit buttons: Full-width on mobile, auto-width desktop

## Imagery & Graphics

**Hero Section:** 
- Abstract AI/automation visualization (neural network, data flows, or workflow diagram)
- Style: Clean line art or subtle 3D renders in primary color palette
- Alternative: Customer success photo (authentic, not stock) with subtle overlay

**Vertical Sections:**
- Each vertical gets distinctive illustration style:
  - Accounting: Calculator/spreadsheet abstractions, document flows
  - E-commerce: Shopping cart/package journey, system integration diagrams  
  - Education: Student journey maps, multilingual interface mockups
- Icons: Heroicons outline style, 48px in circular badges

**Trust Section:**
- Real client logos (grayscale)
- Before/after process diagrams showing automation impact
- Screenshots of actual platform (with blur for sensitive data)

**Background Elements:**
- Subtle dot grids in sections (opacity 0.1)
- Gradient meshes transitioning between cream and light gray
- Geometric shapes as section dividers (angled, not straight)

## Page Structure (Homepage)

### 1. Navigation (72px height)
Sticky header with glass effect on scroll

### 2. Hero Section (85vh)
- Asymmetric layout: headline + subheadline left, abstract visual right
- Dual CTAs with risk reversal copy
- Trust badge bar: "Trusted by 500+ organizations" with mini logos

### 3. Problem Section (auto height, py-20)
- Grid of 6 pain point cards (3x2 on desktop)
- Each card: Icon, headline, description
- Emotional copy addressing frustration and stakes

### 4. Three Verticals Section (auto height, py-24)
- Introduction paragraph with bold "Choose your industry" heading
- 3-column card grid with vertical-specific entry points
- Each card leads to chatbot with pre-filled vertical context

### 5. Solutions Overview (auto height, py-20)
- Alternating 2-column layout (4 solutions)
- Image/screenshot left, content right (then flip)
- Feature bullets with checkmark icons

### 6. Trust Indicators (auto height, py-20)
- 4-column stat counter grid
- Client logo carousel below
- 2-3 highlighted case study cards

### 7. Chatbot Demo Section (auto height, py-24)
- "See it in action" headline
- Embedded chatbot preview (conversational flow example)
- CTA to try it live

### 8. Final CTA Section (auto height, py-24)
- Centered content with gradient background (cream to white)
- Bold headline, risk reversal copy
- Primary CTA button (large, prominent)
- Trust signals below: "No credit card • 15-min setup • GDPR compliant"

### 9. Footer (auto height, py-16)
- 4-column layout: Company, Industries, Resources, Contact
- Social icons, language switcher
- Legal links and copyright

## Interactions & Animations

**Scroll Animations:**
- Fade-in-up for section headings (delay: 100ms)
- Stagger animation for card grids (50ms per card)
- Counter animations for statistics (on viewport enter)

**Hover States:**
- Cards: Subtle lift + shadow increase
- Buttons: Background darken 10%, slight scale (1.02)
- Links: Underline slide-in from left

**Chatbot Interactions:**
- Widget pulse animation (repeat every 3s)
- Message bubble slide-in from bottom
- Typing indicator: dot bounce animation

**NO complex animations:** Avoid parallax, scroll-jacking, or excessive motion

## Accessibility

- Color contrast: Minimum 4.5:1 for body text, 3:1 for large text
- Focus indicators: 2px solid primary-light ring on all interactive elements
- ARIA labels for icon-only buttons
- Skip navigation link for keyboard users
- Reduced motion support: `prefers-reduced-motion: reduce` disables animations

## Responsive Breakpoints

- Mobile: `<640px` - Single column, stacked CTAs, hamburger menu
- Tablet: `640px-1024px` - 2-column grids, condensed spacing
- Desktop: `>1024px` - Full multi-column layouts, expanded spacing
- Large: `>1440px` - Max-width containers with centered content