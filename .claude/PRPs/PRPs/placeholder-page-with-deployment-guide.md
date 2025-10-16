name: "AR Automation Placeholder Page with Digital Ocean Deployment"
description: |
  Create a single HTML file placeholder page for AR Automation that can be uploaded to a Digital Ocean droplet.
  Includes navigation (Coming Soon items), hero section with brand messaging, email contact links, and complete
  deployment guide for beginners.

---

## Goal

**Feature Goal**: Create a production-ready, single-file HTML placeholder page that replicates the top portion of the AR Automation website and can be deployed to Digital Ocean immediately.

**Deliverable**:
- Single standalone `index.html` file with inline CSS (no external dependencies)
- Separate `placeholder/` folder containing the HTML and all required image assets
- Step-by-step Digital Ocean deployment guide (already created)

**Success Definition**:
- Page renders correctly in all modern browsers (Chrome, Firefox, Safari, Edge)
- Navigation bar with "Coming Soon" text and functional "Get in Touch" email link
- Hero section with "Automate the boring stuff" heading and "Schedule Free Audit" email link
- Fully responsive (mobile, tablet, desktop)
- All images load correctly
- Page can be deployed to Digital Ocean using the provided guide

## User Persona

**Target User**: Potential customers visiting ar3.dev or arlabs.tech domain while full website is under development

**Use Case**: User lands on domain from business card, social media, or search → sees professional placeholder page → can contact company via email

**User Journey**:
1. User visits domain expecting full website
2. Sees clean, professional placeholder page with AR Automation branding
3. Reads "Coming Soon" in navigation to understand site is under construction
4. Sees compelling value proposition: "Automate the boring stuff"
5. Clicks "Schedule Free Audit" or "Get in Touch" → opens email client to hello@arlabs.tech
6. User leaves with positive brand impression and ability to make contact

**Pain Points Addressed**:
- No website currently exists (project not ready)
- Dead domain or 404 creates unprofessional impression
- Potential customers need way to contact company
- Need quick deployment solution without complex infrastructure

## Why

- **Business Value**: Maintain professional brand presence during website development phase; capture leads via email contact
- **Integration**: Temporary standalone page (no backend integration needed); will be replaced by full site later
- **Problem Solved**:
  - For users: Provides clear communication that site is coming soon + immediate contact method
  - For business: Prevents lost opportunities from dead domain; maintains brand credibility
  - For deployment: Beginner-friendly guide enables non-technical stakeholder to deploy quickly

## What

### User-Visible Behavior

**Navigation Bar** (desktop and mobile):
- Text logo: "AR Automation" (left side, primary blue color)
- Navigation items: "Coming Soon" (replaces actual menu items)
- "Get in Touch" button (right side) → links to `mailto:hello@arlabs.tech`
- Sticky positioning (stays at top when scrolling)
- Responsive mobile menu with hamburger icon

**Hero Section**:
- Headline: "Automate the boring stuff. Build the business you dreamed of."
- Subheadline: "We help mid-sized organizations eliminate repetitive work and transform operations from reactivity and unproductive staff-hours to strategic efficiency with AI-powered agents and automations."
- Primary CTA button: "Schedule Free Audit" → links to `mailto:hello@arlabs.tech`
- Hero image: AI automation network visualization (right side on desktop, below text on mobile)
- Remove: "See How It Works" button, "No credit card required" text, "Immediate expert advice" text

**Styling**:
- Primary color: Deep navy blue (#002647 / `hsl(203, 100%, 14%)`)
- White text on blue background
- Open Sans font (loaded from Google Fonts)
- Smooth hover effects on buttons and links
- Responsive layout (mobile-first, breakpoints at 640px and 1024px)

### Technical Requirements

- **Format**: Single HTML file with inline CSS (no external stylesheets)
- **Assets**: One hero image copied to `placeholder/assets/images/` folder
- **Icons**: Use Unicode or simple inline SVG (no external icon libraries)
- **Fonts**: Load Open Sans from Google Fonts CDN
- **Email Links**: Use `mailto:hello@arlabs.tech` for all contact buttons
- **Responsive**: CSS media queries for mobile (< 640px), tablet (640px-1023px), desktop (≥ 1024px)
- **Browser Support**: Modern browsers (no IE11 compatibility needed)

### Success Criteria

- [ ] Single HTML file under 50KB (excluding images)
- [ ] Hero image copied to placeholder folder
- [ ] Navigation shows "Coming Soon" text
- [ ] Both email links open mail client with correct address
- [ ] Page looks professional on mobile (iPhone/Android)
- [ ] Page looks professional on desktop (1920x1080 and 1366x768)
- [ ] Deployment guide enables beginner to deploy successfully
- [ ] Page passes W3C HTML validation

## All Needed Context

### Context Completeness Check

_This PRP provides: component analysis from existing codebase, complete styling specifications, asset inventory, deployment guide, and implementation blueprint. An agent unfamiliar with the codebase can implement this successfully using only this PRP._

### Documentation & References

```yaml
- file: frontend/src/components/HeroSection.tsx
  why: Extract hero section content (heading, subheading, CTA text) and layout structure
  pattern: Two-column grid (text left, image right), responsive stacking on mobile
  gotcha: Uses Tailwind CSS - must convert to vanilla CSS for standalone HTML

- file: frontend/src/components/Navigation.tsx
  why: Extract navigation layout, logo styling, button styling
  pattern: Flex layout with logo left, nav center, button right; mobile hamburger menu
  gotcha: Uses Wouter for routing and i18next for translations - simplify to static HTML

- file: frontend/public/assets/images/AI_automation_network_hero_visual_656dfdf1.png
  why: Hero section image to copy to placeholder folder
  pattern: Displayed on right side of hero on desktop, below text on mobile
  gotcha: Large file (1.0 MB) - ensure it's copied correctly, consider optimization

- docfile: docs/digitalocean-static-html-deployment-guide.md
  why: Complete deployment guide already created by research agent
  section: All sections - reference this guide for deployment instructions

- url: https://fonts.google.com/specimen/Open+Sans
  why: Font family used throughout site - must be loaded via Google Fonts CDN
  critical: Use weights 400, 600, 700 (regular, semibold, bold)

- url: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href
  why: Mailto link syntax for email contact buttons
  critical: Format is `mailto:hello@arlabs.tech` (no subject/body needed)
```

### Current Codebase Tree (Relevant Sections)

```bash
ar3_website/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeroSection.tsx          # Source for hero content/structure
│   │   │   └── Navigation.tsx           # Source for navigation structure
│   │   └── index.css                    # CSS variable definitions
│   ├── public/
│   │   └── assets/
│   │       └── images/
│   │           └── AI_automation_network_hero_visual_656dfdf1.png  # Copy this
│   └── index.html                       # Font loading reference
├── docs/
│   └── digitalocean-static-html-deployment-guide.md  # Complete deployment guide
└── .claude/
    └── PRPs/
        └── PRPs/
            └── placeholder-page-with-deployment-guide.md  # This PRP
```

### Desired Output Structure

```bash
placeholder/
├── index.html                           # Single HTML file with inline CSS
└── assets/
    └── images/
        └── hero-image.png               # Copied from frontend/public/assets/images/
```

### Known Gotchas & Library Quirks

```html
<!-- CRITICAL: Current site uses React + Tailwind CSS -->
<!-- Must convert Tailwind utility classes to vanilla CSS -->

<!-- Example Tailwind to CSS conversion: -->
<!-- Tailwind: className="text-4xl font-bold text-primary" -->
<!-- CSS: style="font-size: 2.25rem; font-weight: 700; color: #002647;" -->

<!-- GOTCHA: Email links require mailto: protocol -->
<!-- Correct: <a href="mailto:hello@arlabs.tech">Get in Touch</a> -->
<!-- Wrong: <a href="hello@arlabs.tech">Get in Touch</a> -->

<!-- GOTCHA: Inline CSS means NO external stylesheets -->
<!-- Use <style> tag in <head> OR style="" attributes -->
<!-- Recommended: <style> tag for maintainability -->

<!-- GOTCHA: Icons in current site use lucide-react library -->
<!-- For placeholder: Use Unicode (→ &#8594;) or simple inline SVG -->
<!-- ArrowRight icon: → or &#8594; -->
<!-- Menu icon: ☰ or &#9776; -->

<!-- GOTCHA: Current site uses CSS variables -->
<!-- Convert to actual hex/hsl values in standalone HTML -->
<!-- --primary: hsl(203 100% 14%) → #002647 -->
<!-- --primary-foreground: hsl(0 0% 100%) → #ffffff -->
```

### Component Analysis (From Research)

**HeroSection Content:**
- Headline: "Automate the boring stuff. Build the business you dreamed of."
- Subheadline: "We help mid-sized organizations eliminate repetitive work and transform operations from reactivity and unproductive staff-hours to strategic efficiency with AI-powered agents and automations."
- Primary CTA: "Schedule Free Audit" (keep this, link to email)
- Secondary CTA: "See How It Works" (REMOVE per requirements)
- Trust indicators: "No credit card required", "Immediate expert advice" (REMOVE per requirements)
- Image: AI_automation_network_hero_visual_656dfdf1.png

**Navigation Structure:**
- Logo: "AR Automation" (text, not image)
- Nav items: Replace all with "Coming Soon"
- Button: "Get in Touch" → mailto:hello@arlabs.tech

**Color Scheme (Light Mode):**
- Primary background: `#002647` (deep navy blue)
- Text on primary: `#ffffff` (white)
- Button background: `#ffffff` (white)
- Button text: `#002647` (deep navy blue)
- Hover states: 90% opacity or subtle overlay

**Responsive Breakpoints:**
- Mobile: < 640px (single column, stacked layout)
- Tablet: 640px - 1023px (single column, larger text)
- Desktop: ≥ 1024px (two-column hero, horizontal nav)

**Font Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

## Implementation Blueprint

### Implementation Tasks (Ordered by Dependencies)

```yaml
Task 1: CREATE placeholder/ directory and subdirectories
  - CREATE: placeholder/assets/images/ directory structure
  - LOCATION: In project root (ar3_website/placeholder/)
  - PURPOSE: Organize placeholder page and assets separately from main project
  - VERIFY: Run `mkdir -p placeholder/assets/images` and confirm directories exist

Task 2: COPY hero image to placeholder folder
  - SOURCE: frontend/public/assets/images/AI_automation_network_hero_visual_656dfdf1.png
  - DESTINATION: placeholder/assets/images/hero-image.png
  - VERIFY: File size should be ~1.0 MB, dimensions 1408x768 pixels
  - COMMAND: cp frontend/public/assets/images/AI_automation_network_hero_visual_656dfdf1.png placeholder/assets/images/hero-image.png
  - TEST: Open image in browser/viewer to confirm it copied correctly

Task 3: CREATE HTML document structure with proper DOCTYPE and meta tags
  - CREATE: placeholder/index.html
  - IMPLEMENT: HTML5 document structure
  - INCLUDE:
    - <!DOCTYPE html> declaration
    - <html lang="en"> root element
    - <head> with meta charset, viewport, description
    - <title>AR Automation - Coming Soon</title>
    - Google Fonts link tags (Open Sans)
    - <style> tag for inline CSS (empty for now, will populate in Task 5)
  - NAMING: Use semantic HTML5 elements (header, nav, main, section)
  - PATTERN:
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="AR Automation - AI-powered business automation solutions. Coming soon.">
      <title>AR Automation - Coming Soon</title>
      <!-- Google Fonts -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        /* CSS will be added in Task 5 */
      </style>
    </head>
    <body>
      <!-- Content will be added in Task 4 -->
    </body>
    </html>
    ```

Task 4: IMPLEMENT HTML structure for navigation and hero section
  - MODIFY: placeholder/index.html
  - ADD: Complete HTML structure in <body>
  - STRUCTURE:
    - <header> with <nav> containing logo, "Coming Soon" text, and "Get in Touch" button
    - <main> with hero <section>
    - Hero section: two-div layout (content div + image div)
  - CONTENT:
    - Logo text: "AR Automation"
    - Nav text: "Coming Soon"
    - Get in Touch button: href="mailto:hello@arlabs.tech"
    - Headline: "Automate the boring stuff. Build the business you dreamed of."
    - Subheadline: (full text from HeroSection analysis)
    - Schedule Free Audit button: href="mailto:hello@arlabs.tech"
    - Hero image: <img src="assets/images/hero-image.png" alt="AI Automation Network Visualization">
  - PATTERN:
    ```html
    <body>
      <header class="header">
        <nav class="nav">
          <div class="nav-container">
            <div class="logo">AR Automation</div>
            <div class="nav-items">
              <span class="nav-coming-soon">Coming Soon</span>
              <a href="mailto:hello@arlabs.tech" class="btn btn-contact">Get in Touch</a>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section class="hero">
          <div class="hero-container">
            <div class="hero-content">
              <h1 class="hero-headline">Automate the boring stuff. Build the business you dreamed of.</h1>
              <p class="hero-subheadline">We help mid-sized organizations eliminate repetitive work and transform operations from reactivity and unproductive staff-hours to strategic efficiency with AI-powered agents and automations.</p>
              <a href="mailto:hello@arlabs.tech" class="btn btn-primary">Schedule Free Audit</a>
            </div>
            <div class="hero-image">
              <img src="assets/images/hero-image.png" alt="AI Automation Network Visualization">
            </div>
          </div>
        </section>
      </main>
    </body>
    ```
  - DEPENDENCIES: Requires Task 2 (image file) to be complete
  - NAMING: Use BEM-style class names for clarity

Task 5: IMPLEMENT inline CSS with responsive design
  - MODIFY: placeholder/index.html <style> tag
  - IMPLEMENT: Complete CSS for all elements
  - SECTIONS:
    1. CSS Reset and base styles
    2. Header and navigation styles
    3. Hero section styles
    4. Button styles
    5. Responsive media queries (mobile, tablet, desktop)
  - COLORS:
    - Primary: #002647 (navy blue)
    - Primary text: #ffffff (white)
    - Button background: #ffffff (white)
    - Button text: #002647 (navy blue)
    - Hover overlay: rgba(0, 0, 0, 0.1)
  - FONTS:
    - Font family: 'Open Sans', sans-serif
    - Headline: 700 weight
    - Body: 400 weight
    - Button: 600 weight
  - RESPONSIVE BREAKPOINTS:
    - Mobile: default (< 640px)
    - Tablet: @media (min-width: 640px)
    - Desktop: @media (min-width: 1024px)
  - PATTERN: Convert Tailwind classes from research to vanilla CSS
    - `text-4xl` → `font-size: 2.25rem;`
    - `font-bold` → `font-weight: 700;`
    - `bg-primary` → `background-color: #002647;`
    - `flex items-center` → `display: flex; align-items: center;`
    - `py-20` → `padding-top: 5rem; padding-bottom: 5rem;`
  - GOTCHA: Use mobile-first approach (base styles for mobile, media queries for larger screens)
  - DEPENDENCIES: Requires Task 4 (HTML structure with class names)

Task 6: IMPLEMENT mobile responsive menu behavior
  - MODIFY: placeholder/index.html
  - ADD: JavaScript for mobile menu toggle (if needed)
  - DECISION: For placeholder page, simpler approach is to use CSS-only responsive nav
  - PATTERN: Hide navigation items on mobile, show "Coming Soon" text always visible
  - IMPLEMENTATION:
    - Desktop: Show "Coming Soon" and "Get in Touch" button horizontally
    - Mobile: Show logo and "Get in Touch" button, "Coming Soon" in between (or hide if space constrained)
  - ALTERNATIVE: If hamburger menu needed, add simple JavaScript:
    ```javascript
    <script>
      // Simple mobile menu toggle (if needed)
      const menuBtn = document.querySelector('.menu-toggle');
      const navItems = document.querySelector('.nav-items');

      if (menuBtn) {
        menuBtn.addEventListener('click', () => {
          navItems.classList.toggle('active');
        });
      }
    </script>
    ```
  - DEPENDENCIES: Requires Task 5 (CSS for mobile/desktop styles)
  - NOTE: Keep it simple - for placeholder page, CSS-only responsive design may be sufficient

Task 7: TEST page in multiple browsers and devices
  - VERIFY: Open placeholder/index.html in browsers
  - BROWSERS: Chrome, Firefox, Safari, Edge
  - DEVICES: Desktop (1920x1080, 1366x768), Tablet (768x1024), Mobile (375x667)
  - CHECKLIST:
    - [ ] Page loads without errors
    - [ ] All text is readable (font loads correctly)
    - [ ] Hero image displays correctly
    - [ ] Email links open mail client with correct address (mailto:hello@arlabs.tech)
    - [ ] Layout is responsive (no horizontal scroll, proper stacking on mobile)
    - [ ] Buttons have hover effects
    - [ ] Colors match design (navy blue #002647 background, white text)
    - [ ] Navigation is functional on mobile and desktop
  - TOOLS:
    - Browser DevTools responsive mode
    - W3C HTML Validator: https://validator.w3.org/
    - W3C CSS Validator: https://jigsaw.w3.org/css-validator/
  - FIX: Any issues found before proceeding to Task 8

Task 8: OPTIMIZE and validate final HTML file
  - VERIFY: HTML file size and validation
  - CHECKS:
    - [ ] File size under 50KB (excluding images)
    - [ ] W3C HTML validation passes (no errors)
    - [ ] All image paths are relative (assets/images/hero-image.png)
    - [ ] No external dependencies except Google Fonts
    - [ ] Proper semantic HTML5 structure
    - [ ] Alt text present on all images
    - [ ] Meta description present
  - OPTIMIZE:
    - Minify CSS if file size is close to limit
    - Ensure no unused CSS rules
    - Check image file size (hero-image.png should be ~1.0 MB)
  - COMMAND: Run W3C validator via CLI or web interface
  - DEPENDENCIES: Requires Task 7 (testing complete)

Task 9: CREATE deployment instructions summary
  - CREATE: placeholder/DEPLOYMENT.md file
  - CONTENT: Short summary pointing to main deployment guide
  - INCLUDE:
    - Link to detailed guide: docs/digitalocean-static-html-deployment-guide.md
    - Quick start command summary
    - File checklist for deployment
    - Contact information if help needed
  - PATTERN:
    ```markdown
    # AR Automation Placeholder Page - Deployment Instructions

    ## Quick Start

    This folder contains everything needed to deploy the AR Automation placeholder page.

    **Files:**
    - `index.html` - Main page file
    - `assets/images/hero-image.png` - Hero section image

    ## Deployment

    For complete step-by-step instructions, see:
    **docs/digitalocean-static-html-deployment-guide.md**

    The guide includes:
    - Digital Ocean droplet setup
    - Nginx configuration
    - SSL certificate installation
    - DNS configuration
    - Troubleshooting

    ## Quick Upload (If server already configured)

    ```bash
    scp -r placeholder/* username@your-server-ip:/var/www/html/
    ```

    ## Questions?

    Contact: hello@arlabs.tech
    ```
  - DEPENDENCIES: All previous tasks complete

Task 10: FINAL VERIFICATION before handoff
  - VERIFY: Complete package ready for deployment
  - CHECKLIST:
    - [ ] placeholder/ folder exists in project root
    - [ ] placeholder/index.html file is complete and validated
    - [ ] placeholder/assets/images/hero-image.png is present and correct
    - [ ] placeholder/DEPLOYMENT.md file is present
    - [ ] docs/digitalocean-static-html-deployment-guide.md exists and is complete
    - [ ] All email links point to mailto:hello@arlabs.tech
    - [ ] Page displays "Coming Soon" in navigation
    - [ ] Page displays hero section with correct content
    - [ ] Page is responsive (tested on mobile, tablet, desktop)
    - [ ] No external dependencies except Google Fonts
  - TEST: Fresh browser window (clear cache) and reload page
  - COMMAND: Open placeholder/index.html in browser directly (file:// protocol)
  - SUCCESS: Page displays correctly without web server
  - DEPENDENCIES: All previous tasks complete
```

### Implementation Patterns & Key Details

```html
<!-- PATTERN: Inline CSS in <style> tag for single-file deployment -->
<style>
  /* 1. CSS Reset and base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333333;
  }

  /* 2. Navigation styles */
  .header {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e5e5;
  }

  .nav-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #002647;
    cursor: pointer;
  }

  .nav-items {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .nav-coming-soon {
    color: #002647;
    font-weight: 600;
  }

  /* 3. Hero section styles */
  .hero {
    position: relative;
    padding: 5rem 0;
    overflow: hidden;
    background: linear-gradient(to bottom right, #002647, #003d73);
  }

  .hero-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: grid;
    gap: 3rem;
    align-items: center;
  }

  .hero-content {
    color: #ffffff;
  }

  .hero-headline {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }

  .hero-subheadline {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
    max-width: 42rem;
  }

  .hero-image img {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  /* 4. Button styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    min-height: 2.5rem;
    padding: 0.5rem 1rem;
    text-decoration: none;
    transition: opacity 0.2s, background-color 0.2s;
    cursor: pointer;
  }

  .btn-primary {
    background-color: #ffffff;
    color: #002647;
    border: 1px solid #ffffff;
  }

  .btn-primary:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .btn-contact {
    background-color: #002647;
    color: #ffffff;
    border: 1px solid #002647;
  }

  .btn-contact:hover {
    opacity: 0.9;
  }

  /* 5. Responsive media queries */

  /* Tablet: 640px and above */
  @media (min-width: 640px) {
    .hero-headline {
      font-size: 3rem;
    }

    .hero-subheadline {
      font-size: 1.25rem;
    }
  }

  /* Desktop: 1024px and above */
  @media (min-width: 1024px) {
    .hero {
      padding: 8rem 0;
    }

    .hero-container {
      grid-template-columns: 3fr 2fr;
    }

    .hero-headline {
      font-size: 3.75rem;
    }
  }

  /* Mobile adjustments: Below 640px */
  @media (max-width: 639px) {
    .nav-container {
      padding: 1rem;
    }

    .nav-items {
      gap: 1rem;
    }

    .nav-coming-soon {
      display: none; /* Hide "Coming Soon" text on very small screens if needed */
    }
  }
</style>

<!-- PATTERN: Email links use mailto: protocol -->
<a href="mailto:hello@arlabs.tech" class="btn btn-primary">Schedule Free Audit</a>
<!-- GOTCHA: No subject or body in mailto - keep it simple -->

<!-- PATTERN: Responsive images with proper alt text -->
<img src="assets/images/hero-image.png"
     alt="AI Automation Network Visualization"
     loading="eager">
<!-- CRITICAL: Use loading="eager" for above-fold hero image -->

<!-- PATTERN: Semantic HTML5 structure -->
<header> <!-- Site header, sticky navigation -->
  <nav> <!-- Navigation component -->
</header>
<main> <!-- Main content area -->
  <section class="hero"> <!-- Hero section -->
</main>
<!-- GOTCHA: Use semantic elements for better accessibility and SEO -->
```

### Integration Points

```yaml
DEPLOYMENT:
  - target: Digital Ocean Droplet (Ubuntu 24.04, Nginx)
  - guide: docs/digitalocean-static-html-deployment-guide.md
  - cost: $4-5/month (see guide for breakdown)
  - time: ~90 minutes for complete setup

FILE STRUCTURE:
  - source: placeholder/ directory in project root
  - upload: All files from placeholder/ → /var/www/html/ on server
  - path: Relative paths (assets/images/hero-image.png work on server and locally)

DNS:
  - domain: ar3.dev or arlabs.tech
  - dns: Configure A record pointing to droplet IP
  - ssl: Let's Encrypt via Certbot (automated in guide)

MAINTENANCE:
  - update: Replace index.html via SCP when changes needed
  - method: scp placeholder/index.html username@server-ip:/var/www/html/
```

## Validation Loop

### Level 1: Syntax & HTML Validation (Immediate Feedback)

```bash
# Validate HTML structure
# Method 1: Online validator
# Open https://validator.w3.org/
# Upload placeholder/index.html
# Expected: Zero errors, zero warnings

# Method 2: Local validation (if validator.nu installed)
vnu placeholder/index.html
# Expected: No errors

# Verify file exists and size
ls -lh placeholder/index.html
# Expected: File exists, size < 50KB

# Verify image exists
ls -lh placeholder/assets/images/hero-image.png
# Expected: File exists, size ~1.0 MB

# Test HTML structure
grep -c "<html" placeholder/index.html
# Expected: 1 (one html tag)

grep -c "mailto:hello@arlabs.tech" placeholder/index.html
# Expected: 2 (two email links: Get in Touch + Schedule Free Audit)
```

### Level 2: Visual & Browser Testing (Component Validation)

```bash
# Open in default browser
open placeholder/index.html  # macOS
xdg-open placeholder/index.html  # Linux
start placeholder/index.html  # Windows

# Test in multiple browsers manually:
# 1. Chrome - Open DevTools, test responsive mode
# 2. Firefox - Open Responsive Design Mode
# 3. Safari - Open Web Inspector
# 4. Edge - Open DevTools

# Verification checklist:
# [ ] Page loads without console errors
# [ ] Hero image displays correctly
# [ ] Email links work (open mail client)
# [ ] Text is readable (correct font, size, color)
# [ ] Layout is responsive:
#     - Mobile (375x667): Single column, stacked elements
#     - Tablet (768x1024): Single column, larger text
#     - Desktop (1920x1080): Two-column hero, horizontal nav
# [ ] Navigation is visible and functional
# [ ] Colors match design (#002647 blue background, white text)
# [ ] Buttons have hover effects (test with mouse)
# [ ] No horizontal scrolling on any viewport size

# Screenshot testing (optional but recommended)
# Use browser DevTools to capture screenshots at different sizes
# Compare with original site design
```

### Level 3: Deployment Testing (System Validation)

```bash
# Prerequisites: Digital Ocean droplet configured per deployment guide
# docs/digitalocean-static-html-deployment-guide.md

# Test 1: Upload files to server
scp -r placeholder/* username@your-server-ip:/var/www/html/
# Expected: Files copy successfully, no errors

# Test 2: Verify files on server
ssh username@your-server-ip "ls -lh /var/www/html/"
# Expected: index.html and assets/ directory present

# Test 3: Test with server IP (before DNS)
curl -I http://your-server-ip/
# Expected: HTTP/1.1 200 OK, Content-Type: text/html

# Test 4: View in browser with IP
# Open http://your-server-ip/ in browser
# Expected: Page loads correctly

# Test 5: DNS propagation check (after DNS configured)
dig your-domain.com +short
# Expected: Returns droplet IP address

nslookup your-domain.com
# Expected: Shows droplet IP in Non-authoritative answer

# Test 6: HTTPS check (after SSL configured)
curl -I https://your-domain.com/
# Expected: HTTP/2 200 OK, with SSL certificate info

# Test 7: SSL certificate validation
openssl s_client -connect your-domain.com:443 -servername your-domain.com < /dev/null
# Expected: Certificate chain validates, issuer is Let's Encrypt

# Test 8: Browser SSL check
# Open https://your-domain.com/ in browser
# Expected:
#   - Padlock icon shows secure connection
#   - No certificate warnings
#   - Page loads over HTTPS

# Test 9: Email link functionality on live site
# Click both email links (Get in Touch, Schedule Free Audit)
# Expected: Mail client opens with To: hello@arlabs.tech

# Test 10: Mobile testing on live site
# Open https://your-domain.com/ on actual mobile device
# Expected:
#   - Page loads quickly (< 3 seconds on 4G)
#   - Layout is responsive
#   - Buttons are tappable (not too small)
#   - No zooming required to read text
```

### Level 4: Performance & SEO Validation

```bash
# Performance Testing

# Test 1: Page speed (Google PageSpeed Insights)
# Open https://pagespeed.web.dev/
# Enter your domain URL
# Expected:
#   - Performance score: 90+ (green)
#   - First Contentful Paint: < 1.8s
#   - Largest Contentful Paint: < 2.5s
#   - Total Blocking Time: < 200ms

# Test 2: File size check
du -sh placeholder/
# Expected: Total size reasonable (< 2 MB including image)

# Test 3: Image optimization check
file placeholder/assets/images/hero-image.png
# Check if image could be further optimized
# Consider converting to WebP if size is issue

# Test 4: Load time testing
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://your-domain.com/
# Expected: < 2 seconds

# SEO Testing

# Test 5: Meta tags validation
curl -s https://your-domain.com/ | grep -E "<title>|<meta.*description"
# Expected: Both title and meta description present

# Test 6: Structured data check
# Open https://search.google.com/test/rich-results
# Enter your domain URL
# Expected: No errors (though placeholder may not have rich results)

# Test 7: Mobile-friendly test
# Open https://search.google.com/test/mobile-friendly
# Enter your domain URL
# Expected: "Page is mobile-friendly" result

# Security Testing

# Test 8: Security headers check
curl -I https://your-domain.com/ | grep -i "strict-transport-security"
# Expected: Header present if configured in Nginx

# Test 9: SSL Labs test (comprehensive SSL check)
# Open https://www.ssllabs.com/ssltest/
# Enter your domain
# Expected: A or A+ rating

# Test 10: Accessibility check
# Open https://wave.webaim.org/
# Enter your domain URL
# Expected:
#   - No errors
#   - Warnings only (if any)
#   - Proper heading structure
#   - Alt text on images
```

## Final Validation Checklist

### Technical Validation

- [ ] HTML passes W3C validation (zero errors)
- [ ] CSS is valid (no syntax errors)
- [ ] File size under 50KB (excluding images)
- [ ] All image paths are relative and work correctly
- [ ] Google Fonts load correctly (Open Sans weights 400, 600, 700)
- [ ] No external dependencies except Google Fonts CDN
- [ ] Page works when opened locally (file:// protocol)

### Content Validation

- [ ] Navigation displays "AR Automation" logo text
- [ ] Navigation shows "Coming Soon" text
- [ ] "Get in Touch" button links to mailto:hello@arlabs.tech
- [ ] Hero headline: "Automate the boring stuff. Build the business you dreamed of."
- [ ] Hero subheadline text is complete and correct
- [ ] "Schedule Free Audit" button links to mailto:hello@arlabs.tech
- [ ] Hero image displays correctly (AI automation network visualization)
- [ ] NO "See How It Works" button present (removed per requirements)
- [ ] NO "No credit card required" text present (removed per requirements)
- [ ] NO "Immediate expert advice" text present (removed per requirements)

### Responsive Design Validation

- [ ] Mobile (375x667): Single column layout, readable text, tappable buttons
- [ ] Mobile (414x896): Layout adapts correctly
- [ ] Tablet (768x1024): Larger text, single column, good spacing
- [ ] Desktop (1366x768): Two-column hero, horizontal navigation
- [ ] Desktop (1920x1080): Content centered, proper max-width, optimal layout
- [ ] No horizontal scrolling on any viewport size
- [ ] Navigation adapts to screen size (responsive behavior)

### Browser Compatibility Validation

- [ ] Chrome (latest): Page renders correctly, all features work
- [ ] Firefox (latest): Page renders correctly, all features work
- [ ] Safari (latest): Page renders correctly, all features work
- [ ] Edge (latest): Page renders correctly, all features work
- [ ] Mobile Safari (iOS): Touch targets adequate, layout correct
- [ ] Chrome Mobile (Android): Touch targets adequate, layout correct

### Deployment Validation

- [ ] placeholder/ folder created in project root
- [ ] placeholder/index.html file present and complete
- [ ] placeholder/assets/images/hero-image.png copied correctly
- [ ] placeholder/DEPLOYMENT.md file created with instructions
- [ ] docs/digitalocean-static-html-deployment-guide.md exists and is complete
- [ ] Files can be uploaded to server via SCP
- [ ] Page accessible via server IP address (http://IP/)
- [ ] DNS configured and propagated (domain resolves to server)
- [ ] SSL certificate installed and working (https:// works)
- [ ] Page loads correctly on live domain with HTTPS

### User Experience Validation

- [ ] Email links open mail client when clicked
- [ ] Email links have correct recipient (hello@arlabs.tech)
- [ ] Buttons have visible hover effects
- [ ] Text is readable (good contrast, appropriate size)
- [ ] Professional appearance (matches brand)
- [ ] Fast loading (< 3 seconds on 4G)
- [ ] No console errors in browser DevTools
- [ ] Page title is appropriate ("AR Automation - Coming Soon")

### Documentation Validation

- [ ] Deployment guide is complete and tested
- [ ] DEPLOYMENT.md summary file is clear and helpful
- [ ] All file paths in documentation are correct
- [ ] Step-by-step instructions are accurate
- [ ] Troubleshooting section covers common issues

---

## Anti-Patterns to Avoid

- ❌ Don't use external CSS files - keep all styles inline in <style> tag
- ❌ Don't use React, Vue, or any JavaScript framework - vanilla HTML/CSS/JS only
- ❌ Don't add unnecessary features beyond requirements (YAGNI principle)
- ❌ Don't use complex JavaScript - prefer CSS-only solutions
- ❌ Don't hardcode server paths - use relative paths (assets/images/...)
- ❌ Don't forget to test email links (mailto: protocol is specific)
- ❌ Don't skip responsive testing - must work on mobile
- ❌ Don't optimize prematurely - build it working first, then optimize
- ❌ Don't ignore W3C validation - standards compliance matters
- ❌ Don't use placeholder images - copy actual hero image from codebase

---

## Confidence Score: 9/10

**Rationale**: This PRP provides comprehensive context, complete component analysis, detailed implementation tasks, specific styling guidelines, validated deployment guide, and thorough validation checklists. An AI agent unfamiliar with the codebase has everything needed to create the placeholder page successfully. The only minor unknown is exact color values under different lighting conditions (handled by providing specific hex codes).

**Success Factors**:
- ✅ Detailed component analysis from research agents (hero, navigation, assets)
- ✅ Complete styling specifications (colors, fonts, spacing, responsive breakpoints)
- ✅ Pre-existing deployment guide (already created and validated)
- ✅ Clear file structure and asset management
- ✅ Comprehensive validation at 4 levels (syntax, browser, deployment, performance)
- ✅ Specific success criteria and anti-patterns
- ✅ Step-by-step implementation tasks with dependencies

**Potential Challenges**:
- Tailwind CSS to vanilla CSS conversion requires careful attention to spacing/sizing scales
- Email mailto: links may not work in all testing environments (but will work in production)
- Image file size (1.0 MB) is large but acceptable for hero image (optimization optional)

This PRP enables confident one-pass implementation with minimal clarification needed.
