# Simple Email Submission Form for Contact Page

## Goal

**Feature Goal**: Enable website visitors to submit their email address for contact requests through a simple, reliable form while the conversational chatbot is being fixed.

**Deliverable**:
- Backend POST endpoint `/api/contact/email` that accepts email submissions
- Frontend integration connecting existing ContactPage form to new endpoint
- Email notifications sent to AR Automation team (via placeholder/console for now)
- Success/error state handling in UI

**Success Definition**:
- User can submit email through ContactPage form
- Loading state shows during submission
- Success message displays after submission
- Email notifications trigger (console.log placeholder confirms)
- Form properly handles errors and shows user-friendly messages
- Form resets after successful submission with 3-second success display

---

## User Persona

**Target User**: Website visitors seeking to contact AR Automation

**Primary Context**: The conversational chatbot (Max) is currently experiencing technical issues. Visitors need a simple, reliable fallback method to express interest and provide their contact information.

**Use Case**:
- Visitor lands on `/contact` page
- Wants to get in touch about automation needs
- Needs quick way to leave contact information
- Expects confirmation their message was received

**User Journey**:
1. Navigate to `/contact` page
2. See heading: "Get in touch with us for a personalized consultation"
3. Read subtitle: "Do you want to talk more about what automation and agentic workflows would mean for you and your business?"
4. Enter email address in input field
5. Click "Submit" button
6. See loading state ("Sending...")
7. See success state ("Sent!") with checkmark icon
8. Form clears, success message auto-hides after 3 seconds
9. (Behind the scenes) AR Automation team receives notification

**Pain Points Addressed**:
- Broken chatbot preventing any contact
- Need for immediate working solution
- Uncertainty whether inquiry was received
- Complex forms asking for too much information upfront

---

## Why

**Business Value**:
- **Unblocks lead generation**: Provides working contact method while chatbot is repaired
- **Prevents lost opportunities**: Visitors can express interest even when chatbot fails
- **Demonstrates responsiveness**: Quick fix shows commitment to accessibility
- **Low implementation cost**: Reuses existing components and patterns
- **Easy to expand**: Foundation for more robust contact system later

**User Impact**:
- Can actually contact the company (currently impossible with broken chatbot)
- Simple, low-friction submission (just email address)
- Immediate feedback with loading and success states
- Confidence their message was received

**Integration with Existing Features**:
- Minimal changes to ContactPage component (form already exists)
- Reuses existing email service functions (send_internal_notification, send_thank_you_email)
- Follows established backend patterns (FastAPI endpoints, Pydantic models, BackgroundTasks)
- Uses existing frontend patterns (apiRequest, useState, Button/Input components)
- Models already defined (ContactEmailRequest, ContactEmailResponse)

**Problems This Solves**:
- Chatbot experiencing recursion limit errors after first message
- No working method for visitors to contact AR Automation
- Lost leads while chatbot is being debugged
- Need for simple interim solution without major architectural changes

---

## What

### User-Visible Behavior

#### Contact Page Form (`/contact`)

**Current State** (lines 374-380 in ContactPage.tsx):
- Heading: "Get in touch with us for a personalized consultation"
- Subtitle: "Do you want to talk more about what automation and agentic workflows would mean for you and your business?"
- Email input field with placeholder: "your.email@company.com"
- Submit button with three states

**Form States**:
1. **Default State**:
   - Input enabled, empty
   - Button shows "Submit" with arrow icon
   - Button disabled if email field is empty

2. **Loading State** (during submission):
   - Input disabled
   - Button shows "Sending..." with spinning loader icon
   - Button disabled

3. **Success State** (after successful submission):
   - Input disabled and cleared
   - Button shows "Sent!" with checkmark icon
   - Button disabled
   - State auto-resets to default after 3 seconds

4. **Error State** (if submission fails):
   - Input remains enabled with user's email
   - Error logged to console
   - Button returns to default state
   - User can retry submission

**Validation**:
- HTML5 email validation (`type="email"`, `required` attributes)
- Cannot submit empty or whitespace-only email
- Cannot submit while already submitting
- Cannot submit during success state display

### Technical Requirements

#### Backend

**New Endpoint**: `POST /api/contact/email`

**Request**:
```json
{
  "email": "user@example.com",
  "language": "en"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Thank you! We'll be in touch soon."
}
```

**Response (Error)**:
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Behavior**:
1. Validate email format (Pydantic EmailStr automatic validation)
2. Create lead_data dictionary with email + defaults for other fields
3. Trigger background tasks to send notifications (non-blocking)
4. Return success response immediately
5. Handle exceptions with 400 error + detail message

**Email Notifications** (Background Tasks):
- `send_internal_notification(lead_data)` - Notify AR Automation team
- `send_thank_you_email(lead_data)` - Confirm with prospect
- Both currently **placeholders** (console.log) - actual email sending not implemented

#### Frontend

**Modified Function**: `handleFallbackSubmit` (lines 343-361 in ContactPage.tsx)

**Change**: Replace `console.log` simulation with actual API call

**Flow**:
1. Prevent form default submission
2. Validate email not empty and not already submitting
3. Set `isSubmitting` to true
4. Call `apiRequest('POST', '/api/contact/email', {...})`
5. Parse response with `.json()`
6. On success: Set `submitted` true, clear email, auto-reset after 3s
7. On error: Log error, keep email in field for retry
8. Always: Reset `isSubmitting` in finally block

### Success Criteria

- [ ] Backend endpoint `/api/contact/email` responds successfully to valid email submissions
- [ ] Frontend form calls backend endpoint when submitted
- [ ] Loading state displays during API call (spinner + "Sending...")
- [ ] Success state displays after successful submission (checkmark + "Sent!")
- [ ] Email field clears on success
- [ ] Success state auto-resets to default after 3 seconds
- [ ] Email notifications trigger (verified by console.log output)
- [ ] Form handles errors gracefully without crashing
- [ ] Invalid email addresses are rejected by HTML5 validation
- [ ] User cannot double-submit (button disabled during submission)
- [ ] Form works in both English and German (language parameter passed)

---

## All Needed Context

### Context Completeness Check

_"If someone knew nothing about this codebase, would they have everything needed to implement this successfully?"_

**Answer**: Yes. This PRP provides:
- Exact file locations and line numbers for patterns to follow
- Complete context on existing models, endpoints, and functions
- Specific patterns from similar implementations
- Known gotchas and constraints
- External documentation links for reference
- Step-by-step implementation tasks

### Documentation & References

```yaml
# Backend Email Service Patterns
- file: backend/app/email_service.py
  why: Email sending function signatures (send_internal_notification, send_thank_you_email)
  pattern: async def send_internal_notification(lead_data: Dict) -> bool (line 19)
  critical: ALL FUNCTIONS ARE PLACEHOLDERS - console.log only, not real email sending
  gotcha: Return True even though no email sent; production requires Resend API implementation

# Backend Endpoint Patterns
- file: backend/app/main.py
  why: POST endpoint structure, BackgroundTasks usage, error handling patterns
  pattern: @app.post("/api/leads") endpoint (lines 431-457) - simplest reference
  critical: Must commit database BEFORE adding background tasks
  gotcha: UUID must be str(uuid.uuid4()), datetime must be utcnow() not now()

# Pydantic Model Patterns
- file: backend/app/models.py
  why: ContactEmailRequest and ContactEmailResponse models ALREADY DEFINED (lines 67-73)
  pattern: CamelModel base class auto-converts snake_case to camelCase (lines 9-13)
  critical: Models exist, just need to import and use them
  gotcha: populate_by_name=True accepts both snake_case and camelCase

# Database Patterns
- file: backend/app/database.py
  why: Lead model structure, get_db dependency pattern
  pattern: Lead model with nullable fields (lines 47-67)
  critical: Most Lead fields are nullable=True; only id, conversation_id, status, created_at required
  gotcha: No foreign key constraints enforced; conversation_id is String column only

# Frontend Form Pattern
- file: frontend/src/pages/ContactPage.tsx
  why: Existing form UI, state management, and button states already implemented
  pattern: handleFallbackSubmit function (lines 343-361) - needs API integration
  critical: State management complete: fallbackEmail, isSubmitting, submitted (lines 339-341)
  gotcha: Success state auto-resets after 3 seconds (line 359)

# Frontend API Pattern
- file: frontend/src/lib/queryClient.ts
  why: apiRequest function for making HTTP requests (lines 10-24)
  pattern: apiRequest('POST', url, data) returns Response; must call .json()
  critical: Automatically adds Content-Type header and includes credentials
  gotcha: Throws error if !res.ok; must wrap in try-catch

# External: Resend FastAPI Integration
- url: https://resend.com/docs/send-with-fastapi
  why: Official Resend integration pattern for FastAPI
  critical: Simple setup: pip install resend, set API key, call resend.Emails.send()
  gotcha: Requires domain verification before sending production emails

# External: FastAPI BackgroundTasks
- url: https://fastapi.tiangolo.com/tutorial/background-tasks/
  why: Pattern for non-blocking background task execution
  critical: Add tasks with background_tasks.add_task(func, *args)
  gotcha: Tasks execute AFTER response sent; can't modify response

# External: Pydantic EmailStr Validation
- url: https://docs.pydantic.dev/latest/api/networks/#pydantic.networks.EmailStr
  why: Built-in email validation for Pydantic models
  critical: Requires email-validator package: pip install email-validator
  gotcha: Validates RFC 5322 format; rejects invalid emails automatically

# External: React Form Best Practices
- url: https://carlrippon.com/successful-submission-in-react-hook-form/
  why: Success state management pattern in React forms
  critical: Use separate state for success, not just formState.isSubmitted
  gotcha: Must disable inputs during submission AND after success
```

### Current Codebase Structure

```bash
backend/
├── app/
│   ├── main.py                    # FastAPI app, endpoints (ADD NEW ENDPOINT HERE)
│   ├── models.py                  # ContactEmailRequest/Response ALREADY EXIST
│   ├── database.py                # Database models, get_db dependency
│   ├── email_service.py           # Email functions (placeholders)
│   └── templates/
│       └── emails/
│           ├── internal_notification.html
│           └── thank_you.html

frontend/
└── src/
    ├── pages/
    │   └── ContactPage.tsx        # Form component (MODIFY handleFallbackSubmit)
    └── lib/
        └── queryClient.ts         # apiRequest function
```

### Desired Codebase Structure (After Implementation)

```bash
backend/
├── app/
│   ├── main.py                    # [MODIFIED] +25 lines: new /api/contact/email endpoint
│   ├── models.py                  # [UNCHANGED] Models already exist
│   ├── database.py                # [UNCHANGED] Using existing patterns
│   └── email_service.py           # [UNCHANGED] Reusing existing functions

frontend/
└── src/
    └── pages/
        └── ContactPage.tsx        # [MODIFIED] ~15 lines: replace simulation with API call
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: Email Service Placeholders
# ALL email functions in backend/app/email_service.py are PLACEHOLDERS
# They print to console instead of sending actual emails
# Lines 20, 50, 76: [PLACEHOLDER] warnings in code
# Production requires: Resend API key setup + replace placeholder code

# CRITICAL: BackgroundTasks Execution Timing
# Background tasks run AFTER response is sent to client
# Must db.commit() BEFORE adding background tasks
# Cannot modify response after adding background tasks
# Pattern from main.py lines 293-296

# CRITICAL: UUID Generation
# Database uses String type for UUIDs, not UUID type
# Must use: str(uuid.uuid4()) not uuid.uuid4()
# Example: main.py lines 48, 272, 436

# CRITICAL: Datetime UTC Requirement
# Always use datetime.utcnow() not datetime.now()
# Database expects UTC timestamps
# Example: main.py lines 51, 284, 448

# CRITICAL: CamelCase Conversion
# All Pydantic models inherit from CamelModel
# Python: session_id → JSON: sessionId (automatic)
# Both formats accepted due to populate_by_name=True
# Pattern: models.py lines 5-13

# CRITICAL: Frontend State Management
# submitted state auto-resets after 3 seconds (line 359)
# isSubmitting must be reset in finally block to prevent stuck state
# Button disabled during: isSubmitting OR submitted OR empty email
# Pattern: ContactPage.tsx lines 339-361, 397-415

# CRITICAL: apiRequest Error Handling
# apiRequest throws error if !res.ok
# Must wrap in try-catch, not just check response.ok
# throwIfResNotOk helper (queryClient.ts lines 3-8)

# GOTCHA: Form Validation
# HTML5 validation happens BEFORE JavaScript
# type="email" + required attributes provide basic validation
# JavaScript validation is secondary check
# Pattern: ContactPage.tsx line 385

# GOTCHA: CORS Configuration
# Backend has allow_origins=["*"] - wide open CORS
# Production should restrict to actual frontend domain
# Config: main.py lines 28-34
```

---

## Implementation Blueprint

### Data Models and Structure

**Models ALREADY EXIST** in `backend/app/models.py` (lines 67-73):

```python
# NO CHANGES NEEDED - Just import these existing models

class ContactEmailRequest(CamelModel):
    email: str                           # Required, validated by Pydantic
    language: Optional[str] = 'en'       # Optional, defaults to English

class ContactEmailResponse(CamelModel):
    success: bool                        # True if submission succeeded
    message: str                         # User-facing message
```

**Import Statement** (add to main.py line 17):
```python
ContactEmailRequest,
ContactEmailResponse
```

### Implementation Tasks (Ordered by Dependencies)

```yaml
Task 1: MODIFY backend/app/main.py
  ACTION: ADD new POST endpoint /api/contact/email
  LOCATION: After /api/leads endpoint (after line 457)
  DEPENDENCIES: Import ContactEmailRequest, ContactEmailResponse (line 17)
  PATTERN: Follow /api/leads endpoint structure (lines 431-457)
  NAMING: async def submit_contact_email
  IMPLEMENTATION:
    - Decorator: @app.post("/api/contact/email", response_model=ContactEmailResponse)
    - Parameters: request: ContactEmailRequest, background_tasks: BackgroundTasks
    - Logic:
      1. Create lead_data dict with request.email + default values
      2. Add background tasks for email notifications
      3. Return ContactEmailResponse with success=True
      4. Catch exceptions, return success=False with error message
  LINES: ~25 new lines

Task 2: MODIFY frontend/src/pages/ContactPage.tsx
  ACTION: REPLACE setTimeout simulation with API call in handleFallbackSubmit
  LOCATION: Lines 343-361 (handleFallbackSubmit function)
  DEPENDENCIES: apiRequest already imported (line 8), i18n available (line 88)
  PATTERN: Follow ContactChatbot handleSend pattern (lines 186-243)
  NAMING: Keep existing function name handleFallbackSubmit
  IMPLEMENTATION:
    - Remove: console.log + setTimeout simulation (lines 349-359)
    - Add: try-catch-finally block with apiRequest
    - Call: apiRequest('POST', '/api/contact/email', { email, language })
    - Parse: await response.json()
    - Success: Set submitted=true, clear email, auto-reset
    - Error: Log error, keep email for retry
    - Finally: Always reset isSubmitting
  LINES: ~15 modified lines

Task 3: TEST endpoint manually
  ACTION: Test POST /api/contact/email with curl
  LOCATION: Terminal
  DEPENDENCIES: Backend running on localhost:8000
  COMMAND:
    curl -X POST http://localhost:8000/api/contact/email \
      -H "Content-Type: application/json" \
      -d '{"email": "test@example.com", "language": "en"}'
  EXPECTED: {"success": true, "message": "Thank you! We'll be in touch soon."}
  VERIFY: Console shows [PLACEHOLDER] email notifications

Task 4: TEST frontend integration
  ACTION: Submit email through ContactPage form
  LOCATION: Browser at http://localhost:3000/contact
  DEPENDENCIES: Frontend running, backend running
  STEPS:
    1. Navigate to /contact page
    2. Enter email: test@example.com
    3. Click Submit button
    4. Verify loading state shows ("Sending...")
    5. Verify success state shows ("Sent!")
    6. Verify form clears after 3 seconds
    7. Check browser console for errors
    8. Check backend console for [PLACEHOLDER] email logs
  EXPECTED: Smooth submission flow, no errors

Task 5: TEST error handling
  ACTION: Test error scenarios
  LOCATION: Browser + Backend
  SCENARIOS:
    - Invalid email format (HTML5 should block)
    - Backend offline (error handling should work)
    - Empty email (button should be disabled)
    - Double submission (button should be disabled)
  EXPECTED: Graceful error handling, user-friendly messages
```

### Implementation Patterns & Key Details

#### Backend Endpoint Pattern

```python
# File: backend/app/main.py
# Location: After line 457 (after /api/leads endpoint)

@app.post("/api/contact/email", response_model=ContactEmailResponse)
async def submit_contact_email(
    request: ContactEmailRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)  # Optional: if storing submissions
):
    """Handle simple email submission for contact requests"""
    try:
        # 1. Create lead_data dict for email functions
        # PATTERN: Match email service function signatures (email_service.py line 28-40)
        lead_data = {
            "name": "Website Visitor",           # Default - no name collected
            "email": request.email,              # From request
            "phone": "Not provided",             # Default
            "company": "Unknown",                # Default
            "role": "Unknown",                   # Default
            "organization_type": "Unknown",      # Default
            "operational_challenges": "Interested in learning more",  # Default
            "automation_goals": "Requested contact via email form",   # Default
            "additional_context": "",            # Empty
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")  # UTC timestamp
        }

        # 2. Send emails in background (non-blocking)
        # PATTERN: Background tasks from main.py lines 293-294
        # CRITICAL: These are PLACEHOLDERS - console.log only
        background_tasks.add_task(send_internal_notification, lead_data)
        background_tasks.add_task(send_thank_you_email, lead_data)

        # 3. Return success response immediately
        # PATTERN: Simple response from main.py line 454
        return ContactEmailResponse(
            success=True,
            message="Thank you! We'll be in touch soon."
        )

    except Exception as e:
        # 4. Handle errors gracefully
        # PATTERN: Error handling from main.py lines 455-457
        # NOTE: Don't rollback if not using database
        raise HTTPException(status_code=400, detail=str(e))
```

**Key Decisions**:
- **No database persistence**: Simplest implementation, just send emails
  - Alternative: Could create ContactFormSubmission model and store to database
  - Trade-off: More complexity vs. having submission records
- **Minimal data collection**: Only email required
  - All other lead_data fields use defaults
  - Matches intent: simple interim solution
- **Background tasks**: Non-blocking email sends
  - Response returns immediately (< 100ms)
  - Emails process after response sent
- **Reuse existing email functions**:
  - send_internal_notification() - notify team
  - send_thank_you_email() - confirm with user
  - Both are placeholders (console.log) but structure is ready

#### Frontend API Integration Pattern

```typescript
// File: frontend/src/pages/ContactPage.tsx
// Location: Lines 343-361 (replace handleFallbackSubmit)

const handleFallbackSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // PATTERN: Validation before submission (keep existing)
  if (!fallbackEmail.trim() || isSubmitting) return;

  setIsSubmitting(true);

  try {
    // PATTERN: API call using apiRequest (ContactChatbot lines 186-189)
    const response = await apiRequest('POST', '/api/contact/email', {
      email: fallbackEmail,
      language: i18n.language  // Pass current language (en/de)
    });

    // PATTERN: Parse response (ContactChatbot line 191)
    const data = await response.json();

    // PATTERN: Handle success (existing pattern lines 354-359)
    if (data.success) {
      setSubmitted(true);
      setFallbackEmail('');

      // Auto-reset success state after 3 seconds (keep existing)
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      // GOTCHA: Backend returned success=false (validation error)
      console.error('Email submission failed:', data.message);
      // TODO: Could add toast notification here
    }

  } catch (error) {
    // PATTERN: Error handling (ContactChatbot lines 215-220)
    console.error('Error submitting email:', error);
    // TODO: Could add toast notification here
    // Keep email in field so user can retry

  } finally {
    // CRITICAL: Always reset loading state to prevent stuck button
    // PATTERN: Finally block (ContactChatbot line 222)
    setIsSubmitting(false);
  }
};
```

**Key Points**:
- Use `apiRequest` (not raw fetch) - provides error handling, headers, credentials
- Must call `.json()` on response - apiRequest returns Response object
- Try-catch-finally pattern - always reset isSubmitting
- Success path clears email and shows success state
- Error path keeps email for retry
- 3-second auto-reset timer preserved from original

### Integration Points

```yaml
BACKEND:
  - endpoint: /api/contact/email
    file: backend/app/main.py
    location: After line 457
    imports: ContactEmailRequest, ContactEmailResponse (line 17)

  - email_service: Reuse existing functions
    file: backend/app/email_service.py
    functions: send_internal_notification, send_thank_you_email
    note: Currently placeholders (console.log)

FRONTEND:
  - form_handler: handleFallbackSubmit
    file: frontend/src/pages/ContactPage.tsx
    location: Lines 343-361
    change: Replace simulation with API call

  - state_management: Already implemented
    variables: fallbackEmail, isSubmitting, submitted
    location: Lines 339-341
    change: None needed

ENVIRONMENT:
  - RESEND_API_KEY: Not used yet (placeholders)
    when_needed: When replacing placeholder email functions
    setup: Get from Resend dashboard, add to .env

  - INTERNAL_NOTIFICATION_EMAIL: Already configured
    current: Defaults to team@arautomation.com
    location: backend/app/email_service.py line 23
```

---

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

```bash
# Frontend Type Checking
cd frontend
npm run check                     # TypeScript type validation
npm run lint                      # ESLint validation

# Expected: Zero errors. If errors exist, fix before proceeding.

# Backend Type Checking (if mypy used in project)
cd backend
mypy app/main.py                  # Type check new endpoint

# Expected: Zero errors. Fix any type issues before proceeding.
```

### Level 2: Unit Tests (Component Validation)

**Note**: This feature has minimal testable logic. Focus on integration testing.

Optional: Could add tests for:
- Backend endpoint validation (pytest test for /api/contact/email)
- Frontend form submission (React Testing Library)

**Priority**: Low - Manual testing more valuable for this simple feature

### Level 3: Integration Testing (System Validation)

```bash
# 1. Start Services
cd backend
uvicorn app.main:app --reload     # Terminal 1: Backend on port 8000

cd frontend
npm run dev                       # Terminal 2: Frontend on port 3000

# 2. Backend Health Check
curl http://localhost:8000/health
# Expected: {"status": "healthy", "service": "AR Automation FastAPI"}

# 3. Test Backend Endpoint Directly
curl -X POST http://localhost:8000/api/contact/email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "language": "en"}' \
  | jq .

# Expected Output:
# {
#   "success": true,
#   "message": "Thank you! We'll be in touch soon."
# }

# Expected Console (Backend):
# [PLACEHOLDER] Internal notification email to: team@arautomation.com
# [PLACEHOLDER] Thank you email to: test@example.com

# 4. Test Frontend Integration (Manual Browser Test)
# Navigate to: http://localhost:3000/contact

# Test Steps:
# a) Default State:
#    - Form shows email input + Submit button
#    - Button disabled if email empty
#    - Submit button shows arrow icon

# b) Invalid Email:
#    - Enter: "notanemail"
#    - Try to submit
#    - Expected: HTML5 validation blocks submission

# c) Valid Submission:
#    - Enter: "yourname@example.com"
#    - Click Submit
#    - Expected:
#      * Button changes to "Sending..." with spinner
#      * Input becomes disabled
#      * ~1 second later: Button shows "Sent!" with checkmark
#      * Email field clears
#      * After 3 seconds: Form returns to default state
#    - Check browser console: No errors
#    - Check backend console: See [PLACEHOLDER] email logs

# d) Error Handling:
#    - Stop backend server
#    - Enter: "test@example.com"
#    - Click Submit
#    - Expected:
#      * Loading state shows
#      * Error logged to console
#      * Button returns to default
#      * Email remains in field (can retry)

# 5. Language Parameter Test
curl -X POST http://localhost:8000/api/contact/email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "language": "de"}' \
  | jq .

# Expected: Same success response
# Note: Language parameter stored but not currently used (for future i18n emails)

# Expected: All tests pass, smooth UX, no console errors
```

### Level 4: User Acceptance Testing

```bash
# Manual Testing Checklist

# Functional Tests:
- [ ] User can submit email and see success message
- [ ] Loading state shows during submission (spinner + "Sending...")
- [ ] Success state shows after submission (checkmark + "Sent!")
- [ ] Form clears after successful submission
- [ ] Success state auto-hides after 3 seconds
- [ ] Backend console shows [PLACEHOLDER] email notifications
- [ ] Invalid emails are blocked by HTML5 validation
- [ ] Empty email prevents submission (button disabled)
- [ ] User cannot double-submit (button disabled during submission)

# Error Handling Tests:
- [ ] Backend offline: Shows error gracefully, doesn't crash
- [ ] Network error: Logs error, keeps email for retry
- [ ] Invalid response: Handles unexpected data

# UX Tests:
- [ ] Button states are clear and immediate
- [ ] Icons load correctly (Loader2, CheckCircle, ArrowRight)
- [ ] Loading spinner animates smoothly
- [ ] 3-second success display feels right (not too fast/slow)
- [ ] Form is responsive on mobile, tablet, desktop

# Integration Tests:
- [ ] Frontend talks to backend successfully
- [ ] Language parameter passes correctly (en/de)
- [ ] Email parameter passes correctly
- [ ] Response parsing works (data.success, data.message)

# Expected: All tests pass, UX feels smooth and professional
```

---

## Final Validation Checklist

### Technical Validation

- [ ] Backend endpoint responds to POST requests: `curl -X POST http://localhost:8000/api/contact/email`
- [ ] Frontend form submits without errors (check browser console)
- [ ] TypeScript compilation passes: `npm run check`
- [ ] ESLint validation passes: `npm run lint`
- [ ] No runtime errors in browser console
- [ ] No runtime errors in backend console (except [PLACEHOLDER] logs)

### Feature Validation

- [ ] All success criteria from "What" section met
- [ ] User journey flows smoothly from input → submit → success
- [ ] Loading and success states display correctly
- [ ] Email validation works (HTML5 + Pydantic)
- [ ] Error cases handled gracefully
- [ ] Form resets properly after submission
- [ ] Background tasks trigger (verified by console logs)

### Code Quality Validation

- [ ] Follows existing codebase patterns
  - Backend: Matches /api/leads endpoint structure
  - Frontend: Matches ContactChatbot API call pattern
  - Models: Uses existing ContactEmailRequest/Response
  - Error handling: try-catch-finally with proper cleanup

- [ ] File placement correct
  - Backend: New endpoint in main.py after existing endpoints
  - Frontend: Modified handleFallbackSubmit in ContactPage.tsx
  - No new files created (reuses existing components)

- [ ] No anti-patterns
  - ✅ Uses BackgroundTasks (not blocking)
  - ✅ Resets isSubmitting in finally block (no stuck states)
  - ✅ Uses apiRequest (not raw fetch)
  - ✅ Validates before submission
  - ✅ Provides user feedback (loading, success, error states)

- [ ] Dependencies managed
  - Backend: No new dependencies (uses existing FastAPI, Resend, Pydantic)
  - Frontend: No new dependencies (uses existing apiRequest, Button, Input)
  - Models: No new models (reuses ContactEmailRequest, ContactEmailResponse)

### Documentation & Deployment

- [ ] Code is self-documenting with clear function/variable names
- [ ] Console logs are informative (show email notification triggers)
- [ ] No new environment variables required
- [ ] Backend endpoint documented in OpenAPI (automatic via FastAPI)
- [ ] Feature ready for user testing

### Known Limitations (Acceptable for Now)

- [ ] Emails are **placeholders** (console.log only) - Production requires Resend API setup
- [ ] No database persistence of submissions - Could add later if needed
- [ ] Minimal validation (just email) - Could expand fields later
- [ ] No rate limiting - Could add SlowAPI if spam becomes issue
- [ ] No i18n for email content - All emails currently English
- [ ] No toast notifications for errors - Uses console.log only

---

## Anti-Patterns to Avoid

- ❌ Don't use raw `fetch()` - Use `apiRequest` from queryClient.ts
- ❌ Don't forget to reset `isSubmitting` in finally block - Causes stuck loading state
- ❌ Don't use `datetime.now()` - Use `datetime.utcnow()` for UTC timestamps
- ❌ Don't use `uuid.uuid4()` - Use `str(uuid.uuid4())` for String column
- ❌ Don't forget to parse response - `apiRequest` returns Response, must call `.json()`
- ❌ Don't add background tasks before `db.commit()` - Commit first, then add tasks
- ❌ Don't skip error handling - Always wrap API calls in try-catch
- ❌ Don't assume emails actually sent - They're placeholders (console.log)
- ❌ Don't create new Pydantic models - ContactEmailRequest/Response already exist
- ❌ Don't make form complex - Keep it simple (just email for now)

---

## Confidence Score

**9/10** - One-pass implementation success likelihood

**Rationale**:
- All patterns well-documented with specific line numbers
- Models already exist (ContactEmailRequest, ContactEmailResponse)
- Clear reference endpoints to follow (/ api/leads)
- Frontend form already built, just needs API connection
- Email functions exist (even if placeholder)
- Minimal new code required (~40 lines total)
- Low complexity, high clarity

**Uncertainty (-1 point)**:
- Email service placeholders might be confusing (but well-documented as "PLACEHOLDER")
- Minor: Whether to persist submissions to database (PRP recommends no database for simplicity)

**Success Factors**:
- Comprehensive context with exact file/line references
- Multiple reference patterns to follow
- Known gotchas clearly documented
- Simple, focused scope (just email submission)
- Existing infrastructure to build on
