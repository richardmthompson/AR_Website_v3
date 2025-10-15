---
name: "GDPR Cookie Consent Banner Implementation"
description: "Create a GDPR-compliant cookie consent banner with bottom positioning, multi-language support, and preference management"
---

## Original Story

```
Build a GDPR-compliant cookie consent banner with the following requirements:
- Nice banner positioned at the bottom of the page
- GDPR compliant (explicit consent before non-essential cookies)
- Cookie categorization (Essential, Analytics, Marketing)
- Multi-language support (EN/DE)
- Persistent storage of user preferences
- Easy opt-out mechanism
```

## Story Metadata

**Story Type**: Feature
**Estimated Complexity**: Medium
**Primary Systems Affected**: Frontend (React components, hooks, i18n, styling)

---

## CONTEXT REFERENCES

### UI Component Patterns
- `/home/adamubuntu/AR_Website_v3/frontend/src/components/ui/dialog.tsx` - Dialog component for settings modal (Radix UI primitives)
- `/home/adamubuntu/AR_Website_v3/frontend/src/components/ui/button.tsx` - Button variants with class-variance-authority
- `/home/adamubuntu/AR_Website_v3/frontend/src/components/ui/checkbox.tsx` - Checkbox component for cookie categories
- `/home/adamubuntu/AR_Website_v3/frontend/src/components/ChatbotWidget.tsx:29` - Fixed positioning pattern (`fixed bottom-6 right-6 z-50`)

### State Management Patterns
- `/home/adamubuntu/AR_Website_v3/frontend/src/hooks/use-toast.ts` - Custom hook pattern with external state and listeners
- `/home/adamubuntu/AR_Website_v3/frontend/src/components/Navigation.tsx:12-14` - localStorage persistence pattern for user preferences
- `/home/adamubuntu/AR_Website_v3/frontend/src/components/ui/sidebar.tsx:28-29,86` - Cookie-based state persistence pattern

### i18n Integration
- `/home/adamubuntu/AR_Website_v3/frontend/src/i18n/config.ts` - i18next configuration and setup
- `/home/adamubuntu/AR_Website_v3/frontend/src/i18n/locales/en.json` - English translation file structure
- `/home/adamubuntu/AR_Website_v3/frontend/src/i18n/locales/de.json` - German translation file structure
- `/home/adamubuntu/AR_Website_v3/frontend/src/components/InlineChatbot.tsx` - Usage pattern for `useTranslation()` hook

### App Integration
- `/home/adamubuntu/AR_Website_v3/frontend/src/App.tsx:38` - Global component placement (add after Toaster)
- `/home/adamubuntu/AR_Website_v3/frontend/src/App.tsx:35-40` - Provider hierarchy and global UI pattern

### Styling & Utilities
- `/home/adamubuntu/AR_Website_v3/frontend/src/lib/utils.ts` - `cn()` utility for className merging
- `/home/adamubuntu/AR_Website_v3/frontend/tailwind.config.ts` - Tailwind configuration with animations
- Tailwind classes: `fixed inset-x-0 bottom-0 z-50` for bottom-fixed positioning
- Animation classes: `slide-in-from-bottom`, `fade-in`, `animate-in` (from tailwindcss-animate)

### GDPR Compliance References
- GDPR Article 7: Conditions for consent (explicit, informed, withdrawable)
- GDPR Article 13: Information to be provided (clear purpose description)
- Essential cookies: No consent required (strictly necessary for service)
- Non-essential cookies: Explicit opt-in required (Analytics, Marketing)

---

## IMPLEMENTATION TASKS

### Task 1: CREATE frontend/src/lib/cookie-utils.ts

- **IMPLEMENT**: Utility functions for cookie management and consent storage
- **PATTERN**: Follow `/home/adamubuntu/AR_Website_v3/frontend/src/lib/utils.ts` structure
- **EXPORTS**:
  - `saveCookieConsent(preferences)` - Save consent to localStorage
  - `getCookieConsent()` - Retrieve consent from localStorage
  - `hasUserResponded()` - Check if user has responded to banner
  - `enableCookies(category)` - Enable specific cookie category
  - `disableCookies(category)` - Disable specific cookie category
- **STORAGE_KEY**: `'cookie-consent'` (following pattern from `'language'` key)
- **TYPE_SAFETY**: Define TypeScript interfaces for consent preferences
- **GOTCHA**: Use JSON.stringify/parse for complex objects in localStorage
- **VALIDATE**: `npx tsc --noEmit && echo "✓ Type checking passed"`

### Task 2: CREATE frontend/src/hooks/use-cookie-consent.ts

- **IMPLEMENT**: Custom React hook for global cookie consent state management
- **PATTERN**: Follow `/home/adamubuntu/AR_Website_v3/frontend/src/hooks/use-toast.ts` architecture (lines 131-189)
- **ARCHITECTURE**:
  - External state (`memoryCookieState`) outside React
  - Listener array for component subscriptions
  - Dispatcher pattern for state updates
  - useEffect for listener registration/cleanup
- **STATE_STRUCTURE**:
  ```typescript
  {
    showBanner: boolean,
    showSettings: boolean,
    preferences: {
      necessary: boolean,  // always true
      analytics: boolean,
      marketing: boolean
    }
  }
  ```
- **EXPORTS**: `useCookieConsent()` hook with actions: `acceptAll`, `rejectAll`, `savePreferences`, `openSettings`, `closeBanner`
- **PERSISTENCE**: Integrate with `cookie-utils.ts` for localStorage
- **GOTCHA**: Initialize state from localStorage on module load
- **VALIDATE**: `npx tsc --noEmit && echo "✓ Type checking passed"`

### Task 3: ADD i18n translations to frontend/src/i18n/locales/en.json

- **ADD**: Cookie banner translations under `"cookies"` key
- **LOCATION**: After line 151 (before closing brace)
- **STRUCTURE**:
  ```json
  "cookies": {
    "banner": {
      "title": "We Value Your Privacy",
      "message": "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. Choose your preferences below.",
      "acceptAll": "Accept All",
      "rejectAll": "Reject All",
      "customize": "Customize Settings",
      "privacyPolicy": "Privacy Policy"
    },
    "settings": {
      "title": "Cookie Preferences",
      "description": "Manage your cookie preferences. You can enable or disable different types of cookies below.",
      "necessary": {
        "title": "Necessary Cookies",
        "description": "These cookies are essential for the website to function and cannot be disabled. They are usually set in response to actions you make, such as setting your privacy preferences or filling in forms."
      },
      "analytics": {
        "title": "Analytics Cookies",
        "description": "These cookies help us understand how visitors interact with our website, providing information about areas visited, time spent, and any issues encountered."
      },
      "marketing": {
        "title": "Marketing Cookies",
        "description": "These cookies are used to deliver personalized advertisements that are relevant to you and your interests. They may be set by us or by third-party providers."
      },
      "alwaysEnabled": "Always Enabled",
      "savePreferences": "Save Preferences",
      "acceptSelected": "Accept Selected"
    }
  }
  ```
- **PATTERN**: Follow existing nested key structure (e.g., `nav.industries`, `hero.headline`)
- **VALIDATE**: `cat frontend/src/i18n/locales/en.json | jq . > /dev/null && echo "✓ Valid JSON"`

### Task 4: ADD i18n translations to frontend/src/i18n/locales/de.json

- **ADD**: German cookie banner translations under `"cookies"` key
- **LOCATION**: After line 151 (before closing brace)
- **STRUCTURE**:
  ```json
  "cookies": {
    "banner": {
      "title": "Wir schätzen Ihre Privatsphäre",
      "message": "Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern, den Website-Traffic zu analysieren und Inhalte zu personalisieren. Wählen Sie unten Ihre Präferenzen.",
      "acceptAll": "Alle akzeptieren",
      "rejectAll": "Alle ablehnen",
      "customize": "Einstellungen anpassen",
      "privacyPolicy": "Datenschutzerklärung"
    },
    "settings": {
      "title": "Cookie-Einstellungen",
      "description": "Verwalten Sie Ihre Cookie-Einstellungen. Sie können verschiedene Arten von Cookies unten aktivieren oder deaktivieren.",
      "necessary": {
        "title": "Notwendige Cookies",
        "description": "Diese Cookies sind für die Funktion der Website unerlässlich und können nicht deaktiviert werden. Sie werden normalerweise als Reaktion auf Ihre Aktionen gesetzt, wie z.B. das Festlegen Ihrer Datenschutzeinstellungen oder das Ausfüllen von Formularen."
      },
      "analytics": {
        "title": "Analyse-Cookies",
        "description": "Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie Informationen über besuchte Bereiche, verbrachte Zeit und aufgetretene Probleme liefern."
      },
      "marketing": {
        "title": "Marketing-Cookies",
        "description": "Diese Cookies werden verwendet, um personalisierte Werbung zu liefern, die für Sie und Ihre Interessen relevant ist. Sie können von uns oder von Drittanbietern gesetzt werden."
      },
      "alwaysEnabled": "Immer aktiviert",
      "savePreferences": "Einstellungen speichern",
      "acceptSelected": "Ausgewählte akzeptieren"
    }
  }
  ```
- **CONSISTENCY**: Ensure structure matches en.json exactly
- **VALIDATE**: `cat frontend/src/i18n/locales/de.json | jq . > /dev/null && echo "✓ Valid JSON"`

### Task 5: CREATE frontend/src/components/CookieSettings.tsx

- **IMPLEMENT**: Settings dialog component for cookie preferences
- **PATTERN**: Follow `/home/adamubuntu/AR_Website_v3/frontend/src/components/ui/dialog.tsx` usage pattern
- **COMPONENTS**: Use Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Checkbox from ui/
- **IMPORTS**:
  ```typescript
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { Checkbox } from "@/components/ui/checkbox"
  import { useTranslation } from 'react-i18next'
  import { useCookieConsent } from '@/hooks/use-cookie-consent'
  ```
- **STRUCTURE**:
  - Dialog with `open` state from `useCookieConsent`
  - Three cookie categories with checkboxes (Necessary always disabled/checked)
  - "Save Preferences" and "Accept Selected" buttons
  - Scrollable content area for long descriptions
- **STYLING**:
  - Use `cn()` utility for className merging
  - Follow shadcn/ui button variants (default, outline)
  - Add padding and spacing consistent with existing dialogs
- **ACCESSIBILITY**:
  - Use semantic HTML
  - Proper ARIA labels
  - Keyboard navigation support (built into Radix Dialog)
- **GOTCHA**: Necessary cookies checkbox must be disabled (`disabled={true}`) and always checked
- **VALIDATE**: `npx tsc --noEmit && echo "✓ Type checking passed"`

### Task 6: CREATE frontend/src/components/CookieConsent.tsx

- **IMPLEMENT**: Main cookie consent banner component with bottom-fixed positioning
- **PATTERN**: Follow `/home/adamubuntu/AR_Website_v3/frontend/src/components/ChatbotWidget.tsx:29` for fixed positioning
- **POSITIONING**:
  - `fixed inset-x-0 bottom-0` for full-width bottom placement
  - `z-50` for overlay z-index (same level as navigation)
  - Responsive padding: `p-4 sm:p-6`
- **ANIMATIONS**:
  - Entry: `animate-in slide-in-from-bottom duration-500`
  - Exit: `animate-out slide-out-to-bottom duration-300`
  - Use Tailwind animate classes (from tailwindcss-animate plugin)
- **LAYOUT**:
  - Container: `max-w-7xl mx-auto` for centered content on large screens
  - Flex layout: `flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`
  - Text section on left, buttons on right (stacked on mobile)
- **COMPONENTS**: Use Button from ui/, CookieSettings dialog
- **IMPORTS**:
  ```typescript
  import { Button } from "@/components/ui/button"
  import { CookieSettings } from "./CookieSettings"
  import { useTranslation } from 'react-i18next'
  import { useCookieConsent } from '@/hooks/use-cookie-consent'
  import { cn } from "@/lib/utils"
  ```
- **VISIBILITY**: Only show if `showBanner` is true (from hook)
- **BUTTONS**:
  - "Accept All" - primary variant
  - "Reject All" - outline variant
  - "Customize Settings" - ghost/link variant
  - Privacy Policy link (optional, if route exists)
- **STYLING**:
  - Background: `bg-background/95 backdrop-blur-md` (semi-transparent with blur)
  - Border: `border-t border-border` (top border only)
  - Shadow: `shadow-lg` for elevation
- **GOTCHA**:
  - Return `null` if banner shouldn't be shown
  - Use conditional rendering, not CSS display:none (better for accessibility)
- **VALIDATE**: `npx tsc --noEmit && echo "✓ Type checking passed"`

### Task 7: UPDATE frontend/src/App.tsx

- **ADD**: Import and integrate CookieConsent component
- **LOCATION**: Line 38 (after `<Toaster />`, before `<Router />`)
- **IMPORT**: `import { CookieConsent } from "@/components/CookieConsent"`
- **FIND**: Line 37 with `<Toaster />`
- **INSERT_AFTER**:
  ```typescript
  <CookieConsent />
  ```
- **PATTERN**: Follow same pattern as Toaster (global UI component)
- **STRUCTURE** (lines 35-40 after change):
  ```typescript
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <CookieConsent />  {/* NEW LINE */}
      <Router />
    </TooltipProvider>
  </QueryClientProvider>
  ```
- **GOTCHA**: Maintain proper indentation (2 spaces per level)
- **VALIDATE**: `npx tsc --noEmit && echo "✓ Type checking passed"`

### Task 8: CREATE frontend/src/types/cookie-consent.ts (Optional but recommended)

- **IMPLEMENT**: TypeScript type definitions for cookie consent
- **EXPORTS**:
  ```typescript
  export type CookieCategory = 'necessary' | 'analytics' | 'marketing'

  export interface CookiePreferences {
    necessary: boolean
    analytics: boolean
    marketing: boolean
  }

  export interface CookieConsentState {
    showBanner: boolean
    showSettings: boolean
    preferences: CookiePreferences
    hasResponded: boolean
  }

  export interface CookieConsentActions {
    acceptAll: () => void
    rejectAll: () => void
    savePreferences: (preferences: CookiePreferences) => void
    openSettings: () => void
    closeBanner: () => void
    closeSettings: () => void
  }
  ```
- **PURPOSE**: Centralized type definitions for type safety
- **USAGE**: Import types in hook and components
- **VALIDATE**: `npx tsc --noEmit && echo "✓ Type checking passed"`

---

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

```bash
# Run after each file creation
cd frontend

# Type checking
npx tsc --noEmit

# Linting (if ESLint configured)
npm run lint

# Expected: Zero errors. Fix any type errors or linting issues before proceeding.
```

### Level 2: Component Validation (Visual Testing)

```bash
# Start development server
cd frontend
npm run dev

# Visit http://localhost:5173
# Expected behaviors:
# 1. Cookie banner appears at bottom on first visit
# 2. "Accept All" button hides banner and saves preferences
# 3. "Reject All" button hides banner and rejects non-essential cookies
# 4. "Customize Settings" opens dialog with 3 cookie categories
# 5. Settings dialog allows toggling Analytics and Marketing
# 6. "Save Preferences" in settings saves and closes dialog
# 7. Refreshing page does NOT show banner again (preferences persisted)
# 8. Language switch (EN/DE) updates all cookie banner text
# 9. Banner is responsive (stacks vertically on mobile)
# 10. Banner does not block page content (can scroll)
```

### Level 3: LocalStorage Validation

```bash
# Test localStorage persistence
# Open browser console (F12)

# Check saved preferences
localStorage.getItem('cookie-consent')
# Expected: JSON string with preferences object

# Test manual removal
localStorage.removeItem('cookie-consent')
# Refresh page
# Expected: Banner reappears

# Test preference structure
JSON.parse(localStorage.getItem('cookie-consent'))
# Expected: { necessary: true, analytics: boolean, marketing: boolean, timestamp: number }
```

### Level 4: GDPR Compliance Validation

```bash
# Manual GDPR compliance checklist:

# 1. Default State
# Expected: Only necessary cookies enabled by default

# 2. Explicit Consent
# Expected: Non-essential cookies NOT set until user clicks "Accept All" or customizes

# 3. Easy Opt-Out
# Expected: "Reject All" button clearly visible and functional

# 4. Clear Information
# Expected: Cookie descriptions explain purpose in plain language

# 5. Withdrawable Consent
# Expected: User can change preferences anytime (need to add settings trigger - see Notes)

# 6. Language Compliance
# Expected: All GDPR requirements met in both EN and DE

# 7. No Pre-checked Boxes
# Expected: Analytics and Marketing unchecked by default in settings
```

---

## COMPLETION CHECKLIST

- [ ] All 8 tasks completed
- [ ] TypeScript compilation successful (no errors)
- [ ] Banner appears on first visit
- [ ] All buttons functional (Accept All, Reject All, Customize)
- [ ] Settings dialog opens with 3 categories
- [ ] Preferences persist in localStorage
- [ ] Language switching works (EN/DE)
- [ ] Responsive design works (mobile + desktop)
- [ ] GDPR compliance verified (no pre-consent cookies)
- [ ] Banner doesn't reappear after user response

---

## Notes

### Additional Features to Consider (Future Enhancements)

1. **Settings Access After Initial Response**
   - Add a "Cookie Settings" link in footer
   - Small button/icon to reopen settings (e.g., cookie icon in bottom-right)
   - Allows users to change preferences later (GDPR requirement)

2. **Cookie Script Integration**
   - Add Google Analytics script conditionally (if analytics enabled)
   - Add marketing pixels conditionally (if marketing enabled)
   - Example:
     ```typescript
     useEffect(() => {
       if (preferences.analytics && hasResponded) {
         // Load Google Analytics
         window.gtag('config', 'GA-XXXXX')
       }
     }, [preferences, hasResponded])
     ```

3. **Consent Version Tracking**
   - Track version of consent (in case of policy changes)
   - Re-prompt users if consent version outdated
   - Add `version` field to localStorage: `{ version: 1, preferences: {...}, timestamp: ... }`

4. **Geo-Location Based Display**
   - Show banner only for EU visitors (GDPR requirement)
   - Use IP geolocation API or header-based detection
   - Consider showing globally for simplicity

5. **Analytics Integration**
   - Track consent decisions (anonymously)
   - Monitor acceptance rates
   - A/B test banner copy

### Technical Decisions Made

1. **Why custom div instead of Sheet/Drawer?**
   - Maximum control over positioning and animations
   - Simpler GDPR compliance (no extra libraries)
   - Better performance (no Radix Portal overhead)

2. **Why external state in hook instead of Context?**
   - Follows existing `useToast` pattern (proven in codebase)
   - Simpler than Context API
   - Better performance (no Provider re-renders)
   - Consistent with project patterns

3. **Why localStorage over cookies for preferences?**
   - Easier to manage (no cookie parsing)
   - Larger storage capacity
   - No server-side complexity
   - Following existing pattern (`'language'` key)

4. **Why separate Settings component?**
   - Separation of concerns (banner vs. detailed settings)
   - Reusable (can be triggered from footer link later)
   - Easier to test independently

### GDPR Compliance Notes

- **Explicit Consent**: Users must actively opt-in (no pre-checked boxes)
- **Granular Control**: Allow category-level control (Analytics, Marketing separate)
- **Easy Withdrawal**: Users can change mind anytime (add footer link in future)
- **Clear Information**: Descriptions explain what each category does
- **Necessary Exception**: Essential cookies don't require consent (login, security, etc.)
- **Documentation**: Consider adding `/privacy` route with full cookie policy

### File Paths Summary

**New Files Created:**
- `/home/adamubuntu/AR_Website_v3/frontend/src/lib/cookie-utils.ts`
- `/home/adamubuntu/AR_Website_v3/frontend/src/hooks/use-cookie-consent.ts`
- `/home/adamubuntu/AR_Website_v3/frontend/src/components/CookieConsent.tsx`
- `/home/adamubuntu/AR_Website_v3/frontend/src/components/CookieSettings.tsx`
- `/home/adamubuntu/AR_Website_v3/frontend/src/types/cookie-consent.ts` (optional)

**Modified Files:**
- `/home/adamubuntu/AR_Website_v3/frontend/src/App.tsx` (line 38)
- `/home/adamubuntu/AR_Website_v3/frontend/src/i18n/locales/en.json` (after line 151)
- `/home/adamubuntu/AR_Website_v3/frontend/src/i18n/locales/de.json` (after line 151)

---

## Success Metrics

- **User Experience**: Banner appears once, never annoys returning users
- **GDPR Compliance**: All GDPR requirements met (explicit consent, easy opt-out)
- **Performance**: No impact on page load (< 5KB added JavaScript)
- **Accessibility**: Fully keyboard navigable, screen reader friendly
- **i18n**: All text translatable, respects user language preference
- **Maintenance**: Clean, typed code following project patterns
