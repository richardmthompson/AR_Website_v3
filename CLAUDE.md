# CLAUDE-BASIC.md

This file provides streamlined guidance for building the AR Automation Website - a basic marketing website built with Next.js 14 as a static site.

## Core Development Philosophy

### KISS (Keep It Simple, Stupid)
Simplicity is the goal. Choose straightforward solutions over complex ones. Simple code is easier to understand, maintain, and debug.

### YAGNI (You Aren't Gonna Need It)
Build features only when you need them, not when you think you might need them later.

### Progressive Enhancement
Start simple and add complexity only when requirements demand it.

## 🚀 Getting Started

### Initial Setup
```bash
# Create new Next.js project with TypeScript and Tailwind
npx create-next-app@latest ar-automation-website --typescript --tailwind --app

cd ar-automation-website

# Start development server
npm run dev
# Visit http://localhost:3000
```

### Recommended Initial Dependencies
```bash
# Only add these when you actually need them:

# For icons (when needed)
npm install lucide-react

# For forms with validation (when you add a contact form)
npm install react-hook-form @hookform/resolvers zod

# For UI components (add as needed)
npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add card
```

## 🏗️ Project Structure

```
ARAutomationWebsite/
├── app/                  # App Router pages
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── about/           # About page
│       └── page.tsx
├── components/          # React components
│   └── ui/             # shadcn/ui components (when added)
├── lib/                # Utility functions
│   └── utils.ts        # Helper functions
├── public/             # Static assets (images, fonts, etc.)
└── next.config.js      # Next.js configuration
```

## 🎯 TypeScript Guidelines

### Keep Types Simple
```typescript
// ✅ Good - Simple and clear
interface PageProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

// ❌ Avoid - Over-engineered for a basic site
type PageId = string & { __brand: 'PageId' };
interface PageProps<T extends PageVariant = 'default'> {
  // ... complex generic types
}
```

### Use Strict TypeScript (Already Configured)
- Avoid `any` - use `unknown` if you really don't know the type
- Let TypeScript infer return types for simple functions
- Add explicit types for component props

## 🎨 Styling with Tailwind CSS

### Tailwind Best Practices
```typescript
// ✅ Good - Clean, readable Tailwind classes
export function Hero() {
  return (
    <section className="bg-blue-600 py-20 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold md:text-6xl">
          Welcome to AR Automation
        </h1>
        <p className="mt-4 text-xl">
          Streamlining your business processes
        </p>
      </div>
    </section>
  );
}

// If classes get too long, extract to a variable
const cardStyles = "rounded-lg border bg-white p-6 shadow-md hover:shadow-lg transition-shadow";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className={cardStyles}>{children}</div>;
}
```

### Responsive Design
```typescript
// Use Tailwind's responsive prefixes
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

## 📦 Component Guidelines

### Keep Components Simple
```typescript
// ✅ Good - Simple, focused component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors";
  const variantStyles = variant === 'primary'
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : "bg-gray-200 text-gray-900 hover:bg-gray-300";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles}`}
    >
      {children}
    </button>
  );
}
```

### Component Size Guidelines
- Keep components under 200 lines
- Keep files under 500 lines
- If a component is getting large, split it into smaller pieces

## 📝 Form Handling (When Needed)

### Simple Forms - Use Native HTML
```typescript
// For basic forms without complex validation
export function NewsletterForm() {
  return (
    <form action="/api/newsletter" method="POST">
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        required
        className="rounded-md border px-4 py-2"
      />
      <button type="submit" className="ml-2 rounded-md bg-blue-600 px-4 py-2 text-white">
        Subscribe
      </button>
    </form>
  );
}
```

### Complex Forms - Add React Hook Form + Zod
```typescript
// Only when you need validation, error handling, etc.
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    console.log('Form data:', data);
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input {...register('name')} placeholder="Name" className="w-full rounded-md border px-4 py-2" />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      {/* More fields... */}
    </form>
  );
}
```

## 🏗️ Static Site Configuration

### Next.js Configuration
```javascript
// next.config.js
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Generate static HTML
  basePath: isProd ? '/ARAutomationWebsite2' : '', // GitHub repo name
  assetPrefix: isProd ? '/ARAutomationWebsite2/' : '',
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig
```

### Build and Deploy
```bash
# Build static site
npm run build
# Output goes to 'out/' directory

# Test the build locally
npx serve out
# Visit http://localhost:3000
```

## 🚀 GitHub Pages Deployment

### Initial Setup

1. **Repository Settings**
   - Go to your GitHub repository settings
   - Navigate to Pages section
   - Set Source to "GitHub Actions"

2. **Required Files**
   - `.nojekyll` file in `public/` directory (prevents Jekyll processing)
   - `.github/workflows/deploy.yml` (automated deployment)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build with Next.js
        run: npm run build
        env:
          NODE_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Local Development vs Production

```bash
# Local development (no basePath)
npm run dev
# Visit http://localhost:3000

# Test production build locally
NODE_ENV=production npm run build
npx serve out
# Visit http://localhost:3000/ARAutomationWebsite2

# Or build without basePath for local testing
npm run build
npx serve out
# Visit http://localhost:3000
```

### Important GitHub Pages Notes

1. **URLs in Code**: When linking between pages, always use relative paths:
   ```typescript
   // ✅ Good - Works locally and on GitHub Pages
   <Link href="/about">About</Link>

   // ❌ Bad - Won't work on GitHub Pages
   <Link href="https://yourdomain.com/about">About</Link>
   ```

2. **Public Assets**: Reference assets from `/public` directory:
   ```typescript
   // ✅ Good - Next.js handles basePath automatically
   <Image src="/logo.png" alt="Logo" />

   // ❌ Bad - Hardcoded basePath
   <Image src="/ARAutomationWebsite2/logo.png" alt="Logo" />
   ```

3. **Custom Domain** (Optional): If you want a custom domain instead of `username.github.io/repo`:
   - Add a `CNAME` file to `public/` directory with your domain
   - Configure DNS settings with your domain provider
   - Update `next.config.js` to remove `basePath` when using custom domain

### Deployment Workflow

```bash
# 1. Make changes locally
npm run dev

# 2. Test that everything works
npm run lint
npm run build

# 3. Commit and push
git add .
git commit -m "Your commit message"
git push origin main

# 4. GitHub Actions automatically deploys to GitHub Pages
# Visit: https://YOUR_USERNAME.github.io/ARAutomationWebsite2
```

### Troubleshooting GitHub Pages

**404 on page refresh?**
- This is normal for client-side routing with GitHub Pages
- Use Next.js `<Link>` components for navigation
- Or add a custom 404.tsx page

**Assets not loading?**
- Ensure `basePath` is set correctly in `next.config.js`
- Check that `NODE_ENV=production` during build
- Verify `.nojekyll` file exists in `public/`

**Build fails in GitHub Actions?**
- Check the Actions tab for error logs
- Ensure all dependencies are in `package.json`
- Test build locally first: `npm run build`

## 🧪 Testing (Progressive Approach)

### Start with Manual Testing
1. Click through your site manually
2. Test on different screen sizes
3. Check all links work
4. Verify forms submit correctly

### Add Automated Tests When Needed
```bash
# When you're ready to add tests
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

Simple test example:
```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## 💅 Code Quality

### Development Workflow
```bash
# Start development
npm run dev

# Check TypeScript errors
npm run build
# or
npx tsc --noEmit

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

### Before Committing
- [ ] Site works in the browser
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Responsive design works (check mobile/tablet/desktop)
- [ ] Links all work

## 🎯 What to Build First

### Recommended Order
1. **Home page** - Hero section, value proposition, CTA
2. **About page** - Company info, team, mission
3. **Services/Features page** - What you offer
4. **Contact page** - Simple form or contact info
5. **Navigation** - Header with links to all pages
6. **Footer** - Copyright, links, social media

### Start Simple
```typescript
// app/page.tsx - Simple home page
export default function Home() {
  return (
    <main>
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold">AR Automation</h1>
          <p className="mt-4 text-xl">Streamlining your business processes</p>
          <button className="mt-8 rounded-md bg-white px-8 py-3 text-blue-600 font-semibold hover:bg-gray-100">
            Get Started
          </button>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">Our Services</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Service cards */}
          </div>
        </div>
      </section>
    </main>
  );
}
```

## 🚫 What to Avoid

### Don't Over-Engineer
- ❌ Don't add state management (Redux, Zustand) - you probably don't need it
- ❌ Don't add a database - it's a static site
- ❌ Don't create complex abstractions - keep it simple
- ❌ Don't worry about 80% test coverage - test what matters
- ❌ Don't add dependencies "just in case" - add them when needed

### Keep It Maintainable
- ❌ Don't create 1000+ line files
- ❌ Don't repeat code - extract reusable components
- ❌ Don't ignore TypeScript errors - fix them
- ❌ Don't skip responsive design - use Tailwind's responsive classes

## 📚 When to Level Up

### Add These When You Need Them

**Form Validation** → When you have complex forms
```bash
npm install react-hook-form @hookform/resolvers zod
```

**UI Component Library** → When you need consistent, accessible components
```bash
npx shadcn@latest init
```

**Testing** → When you want to prevent regressions
```bash
npm install -D jest @testing-library/react @playwright/test
```

**Analytics** → When you want to track visitors
```bash
npm install @vercel/analytics
# or Google Analytics
```

## 🎓 Learning Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/
- **shadcn/ui Components**: https://ui.shadcn.com/

---

**Remember**: Start simple, get it working, then iterate. Don't try to build the perfect site on day one.

*Last updated: October 2025*
