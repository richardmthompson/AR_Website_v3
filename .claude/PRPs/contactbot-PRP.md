# Conversational Contact Page with Lead Qualification

## Goal

**Feature Goal**: Transform the conference-specific contact page into a site-wide conversational contact system that uses an AI chatbot (Max) to sequentially collect lead information through natural conversation, then automatically sends notification emails to both the AR Automation team and the prospect.

**Deliverable**:
- New `/contact` route with ContactPage component featuring conversational chatbot
- Enhanced LangGraph agent with sequential question flow (name → email → phone → company → role → organization type → operational challenges → automation goals)
- Email automation system using Resend to send internal notifications and thank you emails
- Updated navigation and CTA buttons throughout site to link to new contact page

**Success Definition**:
- Chatbot successfully collects all required information through sequential conversation
- **NEW**: Chatbot presents confirmation summary and allows user to correct/elaborate
- **NEW**: Open discussion functionality captures additional context and updates fields
- Email notifications sent to AR Automation team with complete lead details (including additional_context)
- Thank you email sent to prospect upon completion
- All CTA buttons across the site navigate to `/contact` page
- Conversation state persists through page refreshes
- Form validation works for email and phone numbers
- Responsive design works on mobile, tablet, desktop

---

## User Persona

**Target User**: Potential clients visiting the AR Automation website

**Primary Personas**:
1. Small Business Owners (accounting firms, e-commerce stores)
2. EdTech Decision Makers (CEOs, COOs, CTOs)
3. Operations Leaders (looking to automate manual processes)
4. Enterprise Buyers (evaluating automation solutions)

**Use Case**: Visitors want to:
- Get in touch with AR Automation about automation needs
- Schedule a consultation without filling out traditional forms
- Have a conversational experience that feels personal
- Receive confirmation that their inquiry was received

**User Journey**:
1. Click "Get in Touch" button from homepage/navigation/industry pages
2. Land on `/contact` page with Max chatbot greeting
3. Have natural conversation answering questions one by one
4. **NEW**: Review summary of provided information
5. **NEW**: Option to confirm, correct, or elaborate on needs
6. **NEW**: If elaborating, have open conversation to provide more context
7. Receive thank you message from Max
8. Receive confirmation email at provided email address
9. AR Automation team receives notification with full lead details and discussion notes

**Pain Points Addressed**:
- Long, intimidating contact forms with 8+ fields at once
- Uncertainty about whether inquiry was received
- Impersonal form-filling experience
- Not knowing what to say in "message" field
- Having to remember all information at once

---

## Why

**Business Value**:
- **Higher Conversion Rate**: Conversational interface reduces form abandonment (industry average: 30-50% higher completion rate)
- **Better Lead Quality**: Sequential questioning ensures complete information collection
- **Faster Response Time**: Automated emails with lead details enable immediate follow-up
- **Professional Experience**: Chatbot demonstrates AR Automation's automation expertise
- **Scalability**: Automated lead qualification reduces manual data entry

**User Impact**:
- Easier, more natural way to contact the company
- Immediate confirmation of inquiry receipt
- Less cognitive load (one question at a time vs. 8 fields at once)
- Conversational experience feels more engaging
- Clear expectations set about next steps

**Integration with Existing Features**:
- Replaces placeholder CTA buttons throughout the site
- Extends existing Max chatbot framework from homepage
- Uses existing LangGraph + OpenAI infrastructure
- Follows existing component patterns (shadcn/ui, Tailwind CSS)
- Integrates with existing PostgreSQL database for lead storage

**Problems This Solves**:
- Currently 11 CTA buttons across the site do nothing (console.log or no onClick)
- Conference page form is conference-specific, not suitable for site-wide contact
- No way for prospects to easily reach out
- No automated confirmation emails
- Manual data entry required for lead tracking

---

## What

### User-Visible Behavior

#### 1. Contact Page (`/contact`)

**Hero Section**:
- Headline: "Let's Talk About Your Automation Needs"
- Subheadline: "Chat with Max, our AI assistant, for a personalized consultation"
- Background gradient (primary blue to lighter shade)
- Responsive layout

**Conversational Chatbot Section**:
- Max chatbot interface (similar to InlineChatbot on homepage)
- Greeting message: "Hi! I'm Max from AR Automation. What's your name?"
- Sequential question flow:
  1. **Name**: "What's your name?"
  2. **Email**: "Great to meet you, [Name]! What's your email address?"
  3. **Phone**: "Thanks! What's your phone number?"
  4. **Company**: "What company or organization do you work for?"
  5. **Role**: "What's your role at [Company]?"
  6. **Organization Type**: "What type of organization is [Company]? (e.g., accounting firm, e-commerce, educational institution)"
  7. **Operational Challenges**: "What are your main operational challenges or pain points?"
  8. **Automation Goals**: "What would you like to automate in an ideal world?"
  9. **Confirmation & Review**: "Ok, [Name], your contacts are [Email] and [Phone], you're a [Role] at [Company], where you're currently trying to solve [Operational Challenge], and would like to automate [Automation Goals]. Did I get anything wrong, or would you like to add any additional information?"
  10. **Open Discussion** (if user wants to elaborate): Engage in natural conversation to gather more context, ask clarifying questions about their challenges and goals
  11. **Final Confirmation**: Extract any corrections or additional details into appropriate fields
- Completion message: "Thanks [Name]! I've passed your information to our team. Someone will reach out to you at [Email] within 24 hours to discuss how we can help [Company]."

**What to Expect Section** (right sidebar):
- Card with information about what happens next
- List of discussion topics (similar to ConferencePage)
- Response time expectation (24 hours)

#### 2. Email Notifications

**Internal Notification Email** (sent to AR Automation team):
- Subject: "🚀 New Lead: [Name] from [Company]"
- Professional HTML template with:
  - Lead information summary (name, email, phone, company, role)
  - Organization details (type, challenges, goals)
  - Timestamp of inquiry
  - Direct link to conversation in database (future enhancement)
  - CTA button: "Respond to Lead"

**Thank You Email** (sent to prospect):
- Subject: "Thanks for reaching out to AR Automation!"
- Warm, branded HTML template with:
  - Personalized greeting using their name
  - Confirmation of receipt
  - What to expect next (24-hour response time)
  - Link back to website
  - AR Automation branding and logo

#### 3. Navigation Updates

All CTA buttons updated to navigate to `/contact`:
- **Navigation bar**: "Get in Touch" button (desktop + mobile)
- **Hero section**: "Schedule Free Audit" button
- **CTA section**: "Schedule Your Free Audit" button
- **Footer**: "Contact" link
- **Industry cards**: "Talk to Expert" buttons
- **EdTech solutions page**: "Schedule Assessment" buttons (2x)
- **Use cases page**: "Schedule Consultation" button
- **Demos page**: "Schedule Live Demo" buttons (2x)

---

## Context

### Codebase Patterns

```yaml
routing:
  library: wouter
  pattern: <Route path="/contact" component={ContactPage} />
  navigation_hook: useLocation() from 'wouter'
  example: frontend/src/App.tsx:19-27

chatbot:
  existing_implementation: frontend/src/components/InlineChatbot.tsx
  backend_agent: backend/app/langgraph_agent.py
  api_endpoint: /api/chat
  state_management: LangGraph StateGraph with TypedDict
  llm: OpenAI GPT-4o-mini

ui_components:
  library: shadcn/ui
  components_used: [Button, Input, Card, CardHeader, CardContent]
  styling: Tailwind CSS with utility classes
  icons: lucide-react
  example_form: frontend/src/pages/ConferencePage.tsx:81-177

database:
  orm: SQLAlchemy
  models: backend/app/database.py [Conversation, Message, Lead]
  tables: conversations, messages, leads
  connection: PostgreSQL (Neon serverless)

translations:
  library: i18next
  config: frontend/src/i18n/config.ts
  english: frontend/src/i18n/locales/en.json
  pattern: const { t } = useTranslation(); then t('key.subkey')
```

### Key Files to Reference

**Frontend Patterns**:
- Contact form layout: `frontend/src/pages/ConferencePage.tsx` (lines 68-246)
- Chatbot UI: `frontend/src/components/InlineChatbot.tsx` (entire file)
- Navigation with links: `frontend/src/components/Navigation.tsx` (lines 24-28, 49-51)
- Button patterns: `frontend/src/components/HeroSection.tsx` (lines 23-26)
- Card layouts: `frontend/src/components/ui/card.tsx`

**Backend Patterns**:
- Existing LangGraph agent: `backend/app/langgraph_agent.py` (lines 38-80)
- FastAPI endpoint: `backend/app/main.py` (lines 103-212)
- Database models: `backend/app/database.py` (lines 24-57)
- Pydantic models: `backend/app/models.py` (lines 15-58)

### External Research Documentation

**CRITICAL**: Three comprehensive research documents have been created with full implementation details:

1. **LangGraph Sequential Conversational Patterns**
   - Location: Research agent output (Task 1)
   - Key patterns: State management with TypedDict, sequential question nodes, conditional routing
   - Complete code example: Section 7 (production-ready implementation)
   - Validation patterns: Section 4
   - Best practices: Section 8
   - **Use this as the primary reference for implementing the enhanced LangGraph agent**

2. **Email Automation with FastAPI + Resend**
   - Location: `/Users/richardthompson/CODE/ar3_website/docs/email-automation-research.md`
   - Recommended service: Resend (free tier: 3,000 emails/month)
   - Integration pattern: FastAPI BackgroundTasks
   - Complete code examples: email_service.py module
   - HTML templates: Internal notification + thank you email
   - Setup guide: Section "Quick Start"
   - **Use this as the primary reference for email automation implementation**

3. **CTA Buttons and Contact Patterns Analysis**
   - Location: Research agent output (Task 3)
   - All CTA locations: 9 files, 11 individual buttons/links
   - Button patterns: Section 5
   - Translation keys: Section 4.2
   - Specific file locations: Section 6
   - **Use this to update all CTA buttons throughout the site**

### Important Gotchas

1. **Wouter vs React Router**: This project uses `wouter` NOT `react-router-dom`
   - Use `import { Link, useLocation } from 'wouter'`
   - NOT `import { Link } from 'react-router-dom'`

2. **LangGraph Message Handling**: Must use `add_messages` reducer
   - `messages: Annotated[list, add_messages]` in state TypedDict
   - Automatically appends messages instead of overwriting

3. **Email Validation**: LangGraph agent must validate email format before accepting
   - Use regex pattern: `r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'`
   - Reject invalid emails and ask again

4. **Phone Validation**: Accept international formats
   - Use flexible regex: `r'\b(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b'`
   - Optional field if user doesn't want to provide

5. **Conference Page**: Do NOT delete `/conference` route
   - Create new `/contact` page separately
   - Conference page may still be used for specific events
   - Reuse layout/styling patterns but create new component

6. **Environment Variables**: Resend API key must be added
   - Add `RESEND_API_KEY=re_xxx` to `.env` file
   - Add to `.env.example` for documentation
   - Access in FastAPI: `os.getenv("RESEND_API_KEY")`

7. **Email Templates**: Create new directory structure
   - `backend/app/templates/emails/` directory
   - `internal_notification.html` for team
   - `thank_you.html` for prospect
   - Use Jinja2 for templating

8. **Translation Keys**: Add new section to i18n files
   - Add `contact` section to `frontend/src/i18n/locales/en.json`
   - Add corresponding German translations to `de.json`

9. **Email Timing Strategy - CRITICAL** ⚠️ **UPDATED BASED ON INDUSTRY RESEARCH**:

   **Research Finding**: Send emails IMMEDIATELY upon qualification (not delayed)
   - 391% higher conversion responding within 1 minute vs 5+ minutes
   - 82% of consumers expect response within 10 minutes
   - All major CRM platforms (HubSpot, Salesforce, Pipedrive) default to immediate
   - **Source**: See `/.claude/PRPs/industry-research-summary.md`

   **NEW EMAIL TIMING RULES** (Research-Validated):
   ```
   1. User completes qualification → Send BOTH emails IMMEDIATELY (< 5 seconds)
      - Internal notification to sales team
      - Thank you/confirmation to prospect
   2. User continues chatting → Accumulate additional_context
   3. User goes inactive (10 min) → Send UPDATE email with new context
   4. User closes tab → Final beacon to save any unsent context
   ```

   **Why Immediate Sending is Better**:
   - Speed to lead is THE critical metric (data shows 80% drop in conversion after 5 min)
   - User gets instant confirmation (builds trust)
   - Sales team can respond while lead is still engaged
   - Can always send follow-up with additional context later

   **Dual Email Flow**:
   ```
   Email Wave 1 (Immediate - < 5 sec after qualification):
   - Internal: "New Lead: John Doe at Acme Corp"
   - Prospect: "Thanks for reaching out! We'll respond within 24 hours"

   Email Wave 2 (Optional - after inactivity if new context):
   - Internal: "Update on John Doe: Mentioned $50K budget and Q1 timeline"
   - (No second email to prospect - they already got confirmation)
   ```

   **State Tracking**:
   ```python
   class ContactFormState(TypedDict):
       # ... existing fields ...
       is_qualified: bool  # All questions answered
       confirmation_shown: bool  # Confirmation summary presented
       emails_sent: bool  # Initial emails sent (set TRUE on qualification)
       update_email_sent: bool  # Context update sent (set TRUE on inactivity)
       qualified_timestamp: Optional[datetime]  # When qualification happened
   ```

10. **Inactivity Detection - CRITICAL** ⚠️ **UPDATED BASED ON INDUSTRY RESEARCH**:

    **Research Finding**: Industry standard is 10 minutes (not 5)
    - Zendesk default: 10 minutes
    - LiveHelpNow most common: 10-15 minutes
    - Freshchat: 20 minutes
    - Intercom: 60 minutes
    - **Consensus**: 10 minutes for lead qualification conversations
    - **Source**: See `/.claude/PRPs/industry-research-summary.md`

    **Backend Can't Detect Inactivity** - FastAPI only runs when called

    **Frontend Must Handle**:
    ```typescript
    // In ContactChatbot component
    const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes (UPDATED from 5)
    const [lastMessageTime, setLastMessageTime] = useState(Date.now());

    useEffect(() => {
      const timer = setInterval(() => {
        const timeSinceLastMessage = Date.now() - lastMessageTime;

        if (timeSinceLastMessage >= INACTIVITY_TIMEOUT && conversationActive) {
          // Send special inactivity signal to backend
          sendMessage("__INACTIVITY_SIGNAL__", { silent: true });
          setConversationActive(false);
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(timer);
    }, [lastMessageTime]);
    ```

    **Backend Handling** (UPDATED for immediate email sending):
    ```python
    def handle_inactivity_signal(state: ContactFormState):
        """Handle frontend inactivity signal"""

        # Emails already sent on qualification
        # Only send UPDATE if there's new context
        if state.get("is_qualified") and not state.get("update_email_sent"):
            if state.get("additional_context"):
                # Send update email with new context to sales team only
                send_context_update_email(state)
                state["update_email_sent"] = True

        # Close conversation gracefully
        return {
            "messages": [AIMessage(content="Good to chat with you! We'll be in touch soon. — Max")],
            "conversation_status": "closed_inactive"
        }
    ```

11. **Browser Tab Close Detection** ⚠️ **UPDATED BASED ON INDUSTRY RESEARCH**:

    **Research Finding**: Use visibilitychange (not beforeunload)
    - beforeunload: 60-70% reliability desktop, 30-40% mobile
    - visibilitychange: 90-95% reliability desktop, 85-90% mobile
    - beforeunload breaks browser Back/Forward Cache
    - iOS Safari deprecated beforeunload since iOS 13.4
    - **Google Analytics, Mixpanel use visibilitychange pattern**
    - **Source**: See `/docs/page-unload-beacon-research.md`

    **Handle User Closing Tab** (UPDATED):
    ```typescript
    // In ContactChatbot component
    let beaconSent = false;

    useEffect(() => {
      // PRIMARY: visibilitychange event (91% reliable)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && !beaconSent) {
          // Page hidden (tab switch, minimize, close)
          if (conversationActive && hasUnsavedContext) {
            navigator.sendBeacon('/api/chat/close', JSON.stringify({
              sessionId,
              signal: 'CLOSE_SIGNAL'
            }));
            beaconSent = true;
          }
        }
      };

      // FALLBACK: pagehide event (for mobile)
      const handlePageHide = () => {
        if (!beaconSent && conversationActive && hasUnsavedContext) {
          navigator.sendBeacon('/api/chat/close', JSON.stringify({
            sessionId,
            signal: 'CLOSE_SIGNAL'
          }));
          beaconSent = true;
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('pagehide', handlePageHide);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('pagehide', handlePageHide);
      };
    }, [conversationActive, hasUnsavedContext, sessionId]);
    ```

    **Why This Works Better**:
    - Fires reliably on mobile (beforeunload often doesn't)
    - Doesn't break browser cache
    - Detects tab switch AND tab close
    - Industry standard (used by all major analytics tools)

---

## Implementation Tasks

### Phase 1: Backend - Enhanced LangGraph Agent

**Goal**: Create sequential conversational flow with proper validation

**Files to Create/Modify**:
- `backend/app/langgraph_agent.py` (enhance existing)
- `backend/app/contact_agent.py` (new, separate from marketing agent)

**Tasks**:
1. Create `ContactFormState` TypedDict with fields:
   ```python
   from datetime import datetime

   class ContactFormState(TypedDict):
       messages: Annotated[list, add_messages]
       name: Optional[str]
       email: Optional[str]
       phone: Optional[str]
       company: Optional[str]
       role: Optional[str]
       organization_type: Optional[str]
       operational_challenges: Optional[str]
       automation_goals: Optional[str]
       additional_context: Optional[str]  # NEW - For extra info from open discussion
       current_step: str
       is_qualified: bool
       confirmation_shown: bool  # NEW - Track if confirmation was presented
       emails_sent: bool  # NEW - Prevent duplicate emails
       qualified_timestamp: Optional[datetime]  # NEW - When qualification happened
       conversation_status: str  # NEW - active, qualified_pending, closed_inactive, closed_complete
       language: str
   ```

2. Create question and conversation nodes (11 nodes total):
   - `ask_name_node`: Extract name from message, ask if not found
   - `ask_email_node`: Extract and validate email, retry if invalid
   - `ask_phone_node`: Extract and validate phone
   - `ask_company_node`: Extract company name
   - `ask_role_node`: Extract role/title
   - `ask_organization_type_node`: Extract org type
   - `ask_challenges_node`: Accept full message as challenges
   - `ask_goals_node`: Accept full message as goals
   - `confirm_and_review_node`: **NEW** - Present summary of all collected info, ask if anything needs correction
   - `open_discussion_node`: **NEW** - Engage in conversational Q&A to gather additional context
   - `qualify_lead_node`: Mark qualified and thank user

3. Create routing function:
   ```python
   def route_next_step(state: ContactFormState) -> str:
       if state.get("is_qualified"):
           return END
       step_map = {"name": "ask_name", "email": "ask_email", ...}
       return step_map.get(state["current_step"], "ask_name")
   ```

4. Build conversation graph:
   ```python
   workflow = StateGraph(ContactFormState)

   # Add all nodes
   workflow.add_node("ask_name", ask_name_node)
   workflow.add_node("ask_email", ask_email_node)
   workflow.add_node("ask_phone", ask_phone_node)
   workflow.add_node("ask_company", ask_company_node)
   workflow.add_node("ask_role", ask_role_node)
   workflow.add_node("ask_organization_type", ask_organization_type_node)
   workflow.add_node("ask_challenges", ask_challenges_node)
   workflow.add_node("ask_goals", ask_goals_node)
   workflow.add_node("confirm_and_review", confirm_and_review_node)  # NEW
   workflow.add_node("open_discussion", open_discussion_node)  # NEW
   workflow.add_node("qualify_lead", qualify_lead_node)

   # Define flow
   workflow.add_edge(START, "ask_name")

   # Sequential question flow
   workflow.add_conditional_edges("ask_name", route_next_step)
   workflow.add_conditional_edges("ask_email", route_next_step)
   workflow.add_conditional_edges("ask_phone", route_next_step)
   workflow.add_conditional_edges("ask_company", route_next_step)
   workflow.add_conditional_edges("ask_role", route_next_step)
   workflow.add_conditional_edges("ask_organization_type", route_next_step)
   workflow.add_conditional_edges("ask_challenges", route_next_step)
   workflow.add_conditional_edges("ask_goals", route_next_step)

   # NEW: After all questions, go to confirmation
   # Modify route_next_step to route to "confirm_and_review" after goals

   # NEW: Confirmation routing
   workflow.add_conditional_edges("confirm_and_review", route_after_confirmation)

   # NEW: Open discussion can loop or proceed to qualification
   workflow.add_conditional_edges("open_discussion", route_from_discussion)

   # End flow
   workflow.add_edge("qualify_lead", END)

   return workflow.compile()
   ```

   **Flow Diagram**:
   ```
   START → ask_name → ask_email → ask_phone → ask_company → ask_role
         → ask_organization_type → ask_challenges → ask_goals
         → confirm_and_review
              ├─ (user confirms) → qualify_lead → END
              └─ (user wants to elaborate) → open_discussion
                                                  ├─ (more to share) → open_discussion (loop)
                                                  └─ (done) → qualify_lead → END
   ```

5. Create helper functions:
   - `extract_from_message(message, field, llm)`: LLM-based extraction
   - `validate_email(email)`: Regex validation
   - `validate_phone(phone)`: Regex validation
   - `get_last_user_message(state)`: Extract most recent user input

6. **Implement Confirmation & Review Node**:
   ```python
   def confirm_and_review_node(state: ContactFormState):
       """Present summary and ask for confirmation/corrections"""
       summary = f"""Ok, {state['name']}, your contacts are {state['email']} and {state['phone']}, you're a {state['role']} at {state['company']}, where you're currently trying to solve {state['operational_challenges']}, and would like to automate {state['automation_goals']}.

Did I get anything wrong, or would you like to add any additional information?"""

       return {
           "current_step": "awaiting_confirmation",
           "messages": [AIMessage(content=summary)]
       }
   ```

7. **Implement Open Discussion Node**:
   ```python
   def open_discussion_node(state: ContactFormState):
       """Engage in conversational Q&A to gather more context"""
       llm = get_llm(temperature=0.7)

       system_prompt = """You are Max, helping gather additional details about the user's automation needs.

Your goal:
- Ask clarifying questions about their challenges or goals
- Encourage them to elaborate on specific pain points
- Be conversational and empathetic
- Keep responses brief (1-2 sentences)
- When they're done sharing, ask: "Is there anything else you'd like to add?"

Rules:
- Focus questions on operational challenges or automation goals
- Don't ask for information already collected (name, email, etc.)
- Don't make promises about solutions
"""

       messages = [SystemMessage(content=system_prompt)] + state["messages"]
       response = llm.invoke(messages)

       # Check if user is done (indicates no more to add)
       last_message = get_last_user_message(state)
       done_phrases = ["no", "that's all", "that's it", "nothing else", "looks good", "all correct"]

       if any(phrase in last_message.lower() for phrase in done_phrases):
           return {
               "current_step": "qualify",
               "messages": [response]
           }

       return {
           "current_step": "open_discussion",
           "messages": [response]
       }
   ```

8. **Implement Field Update Logic**:
   ```python
   def update_fields_from_discussion(state: ContactFormState):
       """Extract corrections or additions from open discussion"""
       llm = get_llm(temperature=0)

       # Get all discussion messages since confirmation
       discussion_text = "\n".join([
           msg.content for msg in state["messages"]
           if isinstance(msg, HumanMessage)
       ])

       prompt = f"""Analyze this conversation and extract any CORRECTIONS or ADDITIONS to these fields:

Original Information:
- Operational Challenges: {state['operational_challenges']}
- Automation Goals: {state['automation_goals']}

Conversation:
{discussion_text}

Return a JSON object with:
{{
  "operational_challenges": "updated or original text",
  "automation_goals": "updated or original text",
  "additional_context": "any new insights not fitting other fields"
}}

If no changes, return the original values."""

       response = llm.invoke([SystemMessage(content=prompt)])

       try:
           import json
           updates = json.loads(response.content)
           return {
               "operational_challenges": updates.get("operational_challenges"),
               "automation_goals": updates.get("automation_goals"),
               "additional_context": updates.get("additional_context", "")
           }
       except:
           return {}  # Keep original if parsing fails
   ```

9. **Update Routing to Include Confirmation Flow**:
   ```python
   def route_after_confirmation(state: ContactFormState) -> str:
       """Route based on user response to confirmation"""
       last_message = get_last_user_message(state)

       # Check if user wants to make corrections
       correction_phrases = ["wrong", "incorrect", "change", "actually", "update", "fix"]
       elaboration_phrases = ["tell you more", "add", "also", "yes", "more context"]

       if any(phrase in last_message.lower() for phrase in correction_phrases + elaboration_phrases):
           return "open_discussion"
       else:
           # User confirmed everything is correct
           return "qualify_lead"

   def route_from_discussion(state: ContactFormState) -> str:
       """Route from open discussion - either continue discussing or qualify"""
       last_message = get_last_user_message(state)

       # Check if user is done
       done_phrases = ["no", "that's all", "that's it", "nothing else", "looks good", "nope", "we're good"]

       if any(phrase in last_message.lower() for phrase in done_phrases):
           # User is done, proceed to qualification
           # First update fields with any new information
           updates = update_fields_from_discussion(state)
           state.update(updates)
           return "qualify_lead"
       else:
           # Continue discussion loop
           return "open_discussion"

   def route_next_step(state: ContactFormState) -> str:
       """Route to next question based on current step"""
       if state.get("is_qualified"):
           return END

       current = state.get("current_step", "name")

       # Step mapping including NEW confirmation step
       step_map = {
           "name": "ask_name",
           "email": "ask_email",
           "phone": "ask_phone",
           "company": "ask_company",
           "role": "ask_role",
           "organization_type": "ask_organization_type",
           "challenges": "ask_challenges",
           "goals": "ask_goals",
           "confirm": "confirm_and_review",  # NEW - after goals, go to confirmation
           "awaiting_confirmation": "qualify_lead",  # If confirmation is bypassed
       }

       return step_map.get(current, "ask_name")
   ```

   **Important**: Update `ask_goals_node` to set `current_step="confirm"` instead of `"qualify"` so it routes to confirmation.

**Reference**: See research document "LangGraph Sequential Conversational Patterns", Section 7 for complete code example

**Validation Gate**: Test each question node independently with sample inputs, verify state updates correctly. Test confirmation flow with corrections and additions.

---

### Phase 2: Backend - Email Automation

**Goal**: Send automated emails when lead is qualified

**Files to Create**:
- `backend/app/email_service.py` (new)
- `backend/app/templates/emails/internal_notification.html` (new)
- `backend/app/templates/emails/thank_you.html` (new)

**Tasks**:
1. Install Resend package:
   ```bash
   cd backend
   pip install resend
   # Add to requirements.txt
   ```

2. Create `email_service.py` with functions:
   ```python
   async def send_internal_notification(lead_data: dict)
   async def send_thank_you_email(lead_data: dict)
   ```

3. Create HTML email templates (use Jinja2):
   - **Internal notification**: Include all lead fields, professional design
   - **Thank you email**: Warm, branded, set expectations

4. Add environment variable:
   - Add `RESEND_API_KEY` to `.env` and `.env.example`

5. Integrate with FastAPI endpoint:
   - Modify `/api/chat` endpoint in `main.py`
   - Add `BackgroundTasks` parameter
   - **CRITICAL UPDATE**: Send emails IMMEDIATELY on qualification (research-validated)

6. **UPDATED: Immediate Email Sending Logic** (Research-Validated):
   ```python
   # In /api/chat endpoint

   # After agent processes message and updates state
   result = contact_form_graph.invoke(state)
   new_state = result  # Contains updated is_qualified, etc.

   # IMMEDIATE EMAIL SENDING (< 5 seconds after qualification)
   if new_state.get("is_qualified") and not new_state.get("emails_sent"):
       lead_data = extract_lead_data(new_state)

       # Send both emails immediately as background tasks
       background_tasks.add_task(send_internal_notification, lead_data)
       background_tasks.add_task(send_thank_you_email, lead_data)

       # Mark as sent to prevent duplicates
       new_state["emails_sent"] = True

   # OPTIONAL: Update email on inactivity (if new context added)
   if chat_request.message == "__INACTIVITY_SIGNAL__":
       if new_state.get("is_qualified") and not new_state.get("update_email_sent"):
           if new_state.get("additional_context"):
               # Send update email to sales team only
               background_tasks.add_task(send_context_update_email, lead_data)
               new_state["update_email_sent"] = True

       return ChatResponse(
           response="Good to chat with you! We'll be in touch soon. — Max",
           session_id=chat_request.session_id,
           conversation_id=conversation.id
       )
   ```

7. **NEW: Create context update email function**:
   ```python
   # In email_service.py
   async def send_context_update_email(lead_data: dict):
       """Send update to sales team with additional context"""
       # Only send to internal team, not to prospect
       # Include all additional_context accumulated during open discussion
   ```

**Reference**: See `/Users/richardthompson/CODE/ar3_website/docs/email-automation-research.md` for complete implementation

**Validation Gate**: Test email sending with sample lead data in development, verify both emails received. Test inactivity signal triggers emails.

---

### Phase 3: Frontend - Contact Page Component

**Goal**: Create new ContactPage with conversational chatbot

**Files to Create**:
- `frontend/src/pages/ContactPage.tsx` (new)

**Tasks**:
1. Create ContactPage component structure:
   ```tsx
   export default function ContactPage() {
     useEffect(() => { window.scrollTo(0, 0); }, []);
     return (
       <div className="min-h-screen bg-background">
         <Navigation />
         {/* Hero Section */}
         {/* Chatbot Section */}
         {/* What to Expect Section */}
         <Footer />
       </div>
     );
   }
   ```

2. Implement Hero Section:
   - Headline: "Let's Talk About Your Automation Needs"
   - Subheadline: "Chat with Max, our AI assistant..."
   - Gradient background (primary to lighter shade)
   - Pattern: `ConferencePage.tsx` lines 37-65

3. Implement Chatbot Section:
   - Two-column layout (lg:grid-cols-2)
   - Left: Chatbot interface (reuse InlineChatbot component OR create new specialized version)
   - Right: "What to Expect" card (sticky sidebar)
   - Pattern: `ConferencePage.tsx` lines 68-246

4. Create or enhance chatbot component:
   - Option A: Reuse `InlineChatbot.tsx` with new prop `agentType="contact"`
   - Option B: Create `ContactChatbot.tsx` as specialized variant
   - Update API endpoint to use contact agent: `/api/contact/chat`

5. Add "What to Expect" sidebar:
   - Use Card component from shadcn/ui
   - List expected discussion topics
   - Show 24-hour response time
   - Pattern: `ConferencePage.tsx` lines 190-219

6. **NEW: Implement Inactivity Detection** (Research-Validated: 10 minutes is industry standard):
   ```tsx
   // In ContactChatbot component
   const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes (industry standard per Zendesk, LiveHelpNow)
   const [lastMessageTime, setLastMessageTime] = useState(Date.now());
   const [conversationActive, setConversationActive] = useState(true);
   const [isQualified, setIsQualified] = useState(false);
   const [emailsSent, setEmailsSent] = useState(false);

   // Update lastMessageTime whenever user or bot sends a message
   const handleSend = async () => {
     setLastMessageTime(Date.now());
     // ... rest of send logic
   };

   // Inactivity timer
   useEffect(() => {
     const timer = setInterval(() => {
       const timeSinceLastMessage = Date.now() - lastMessageTime;

       if (
         timeSinceLastMessage >= INACTIVITY_TIMEOUT &&
         conversationActive &&
         isQualified &&
         !emailsSent
       ) {
         // Send special signal to backend
         sendInactivitySignal();
         setConversationActive(false);
         setEmailsSent(true);
       }
     }, 30000); // Check every 30 seconds

     return () => clearInterval(timer);
   }, [lastMessageTime, conversationActive, isQualified, emailsSent]);

   const sendInactivitySignal = async () => {
     await apiRequest('POST', '/api/chat', {
       sessionId,
       message: '__INACTIVITY_SIGNAL__',
       language: i18n.language
     });
   };
   ```

7. **NEW: Implement Tab Close Detection** (Research-Validated: visibilitychange for 91% reliability):
   ```tsx
   // In ContactChatbot component
   useEffect(() => {
     let beaconSent = false;

     // Primary: visibilitychange (works on desktop, 90-95% reliable)
     const handleVisibilityChange = () => {
       if (document.visibilityState === 'hidden' && !beaconSent) {
         if (conversationActive && isQualified) {
           const data = JSON.stringify({
             sessionId,
             message: '__CLOSE_SIGNAL__',
             language: i18n.language
           });
           navigator.sendBeacon('/api/chat/beacon', data);
           beaconSent = true;
         }
       }
     };

     // Fallback: pagehide (works better on mobile iOS/Android)
     const handlePageHide = (e: PageTransitionEvent) => {
       if (!beaconSent) {
         if (conversationActive && isQualified) {
           const data = JSON.stringify({
             sessionId,
             message: '__CLOSE_SIGNAL__',
             language: i18n.language
           });
           navigator.sendBeacon('/api/chat/beacon', data);
           beaconSent = true;
         }
       }
     };

     document.addEventListener('visibilitychange', handleVisibilityChange);
     window.addEventListener('pagehide', handlePageHide);

     return () => {
       document.removeEventListener('visibilitychange', handleVisibilityChange);
       window.removeEventListener('pagehide', handlePageHide);
     };
   }, [conversationActive, isQualified, sessionId]);
   ```

8. **NEW: Track Conversation State from Backend**:
   ```tsx
   // Parse backend responses to track state
   useEffect(() => {
     if (messages.length > 0) {
       const lastMessage = messages[messages.length - 1];

       // Backend signals qualification status in response
       // Parse from response data or add explicit flags
       if (lastMessage.role === 'assistant') {
         // Check if backend indicated qualification
         // This could be in response metadata or parsed from content
         if (lastMessage.metadata?.is_qualified) {
           setIsQualified(true);
         }
         if (lastMessage.metadata?.emails_sent) {
           setEmailsSent(true);
         }
       }
     }
   }, [messages]);
   ```

**Reference**: Layout patterns from `ConferencePage.tsx`, chatbot patterns from `InlineChatbot.tsx`. See `industry-research-summary.md` for research validation.

**Validation Gate**: Page renders correctly, chatbot functional, responsive on mobile. Inactivity timer triggers after 10 minutes (industry standard). Tab close detection works with visibilitychange + pagehide (91% reliability on both desktop and mobile).

---

### Phase 4: Frontend - Routing and Navigation Updates

**Goal**: Add `/contact` route and update all CTAs to navigate to it

**Files to Modify**:
- `frontend/src/App.tsx`
- `frontend/src/components/Navigation.tsx`
- `frontend/src/components/HeroSection.tsx`
- `frontend/src/components/CTASection.tsx`
- `frontend/src/components/Footer.tsx`
- `frontend/src/components/VerticalsSection.tsx`
- `frontend/src/pages/EdTechSolutionsPage.tsx`
- `frontend/src/pages/UseCasesPage.tsx`
- `frontend/src/pages/DemosPage.tsx`

**Tasks**:
1. Add route to `App.tsx`:
   ```tsx
   import ContactPage from '@/pages/ContactPage';

   // Add after /conference route
   <Route path="/contact" component={ContactPage} />
   ```

2. Update Navigation component (2 locations):
   ```tsx
   import { useLocation } from 'wouter';
   const [, setLocation] = useLocation();

   // Desktop button (line 84)
   <Button onClick={() => setLocation('/contact')} data-testid="button-get-in-touch">
     {t('nav.getInTouch')}
   </Button>

   // Mobile button (lines 134-136) - same pattern
   ```

3. Update HeroSection component:
   ```tsx
   <Button size="lg" onClick={() => setLocation('/contact')}>
     {t('hero.scheduleAudit')}
     <ArrowRight className="..." />
   </Button>
   ```

4. Update CTASection component:
   ```tsx
   <Button size="lg" onClick={() => setLocation('/contact')}>
     <Calendar className="mr-2 w-5 h-5" />
     {t('cta.scheduleAudit')}
     <ArrowRight className="..." />
   </Button>
   ```

5. Update Footer component:
   ```tsx
   // Change line 14
   { label: t('footer.contact'), href: '/contact' }
   ```

6. Update VerticalsSection component:
   ```tsx
   <VerticalCard
     // ...
     onTalkToExpert={() => setLocation('/contact')}
   />
   ```

7. Update EdTechSolutionsPage (2 buttons):
   ```tsx
   // Lines 38, 366
   <Button onClick={() => setLocation('/contact')}>
     Schedule Assessment
   </Button>
   ```

8. Update UseCasesPage:
   ```tsx
   // Line 232
   <Button onClick={() => setLocation('/contact')}>
     Schedule Consultation
   </Button>
   ```

9. Update DemosPage (2 buttons):
   ```tsx
   // Lines 74, 148
   <Button onClick={() => setLocation('/contact')}>
     Schedule Live Demo
   </Button>
   ```

**Reference**: CTA patterns research document, Section 8 (Code Snippet: Complete Navigation Update)

**Validation Gate**: Click each button/link, verify navigation to `/contact`, test on mobile and desktop

---

### Phase 5: Frontend - Translation Keys

**Goal**: Add translation keys for contact page

**Files to Modify**:
- `frontend/src/i18n/locales/en.json`
- `frontend/src/i18n/locales/de.json`

**Tasks**:
1. Add to `en.json`:
   ```json
   {
     "contact": {
       "pageTitle": "Let's Talk About Your Automation Needs",
       "pageSubtitle": "Chat with Max, our AI assistant, for a personalized consultation",
       "chatbotHeader": "Chat with Max",
       "whatToExpectTitle": "What to Expect",
       "responseTime": "We typically respond within 24 hours",
       "discussionTopics": [
         "Deep-dive into your specific operational challenges",
         "Discussion of relevant automation solutions",
         "ROI analysis for your organization",
         "Introduction to our technical approach",
         "Implementation timeline and next steps"
       ]
     }
   }
   ```

2. Add corresponding German translations to `de.json`

**Reference**: CTA patterns research document, Section 4.2

**Validation Gate**: Switch language to German, verify all text translates correctly

---

### Phase 6: Backend - API Endpoint for Contact Agent

**Goal**: Create separate endpoint for contact agent (optional - can reuse existing `/api/chat`)

**Files to Modify**:
- `backend/app/main.py`

**Tasks**:
1. Option A: Reuse `/api/chat` endpoint
   - Add parameter to ChatRequest: `agent_type: Optional[str] = 'marketing'`
   - Route to appropriate agent based on type
   - Simpler approach, fewer changes

2. Option B: Create new endpoint `/api/contact/chat`
   - Separate endpoint for contact agent
   - Cleaner separation of concerns
   - Easier to maintain separately

3. Integrate email sending:
   ```python
   from fastapi import BackgroundTasks
   from .email_service import send_internal_notification, send_thank_you_email

   @app.post("/api/chat", response_model=ChatResponse)
   async def chat(
       chat_request: ChatRequest,
       background_tasks: BackgroundTasks,
       db: Session = Depends(get_db)
   ):
       # ... existing logic ...

       if state.get("is_qualified"):
           lead_data = {
               "name": state.get("name"),
               "email": state.get("email"),
               "phone": state.get("phone"),
               "company": state.get("company"),
               "role": state.get("role"),
               "organization_type": state.get("organization_type"),
               "operational_challenges": state.get("operational_challenges"),
               "automation_goals": state.get("automation_goals"),
               "additional_context": state.get("additional_context", "")  # NEW - Include discussion notes
           }

           background_tasks.add_task(send_internal_notification, lead_data)
           background_tasks.add_task(send_thank_you_email, lead_data)
   ```

**Reference**: FastAPI BackgroundTasks documentation, email automation research document

**Validation Gate**: Send test conversation through to completion, verify both emails sent

---

### Phase 7: Database Schema Updates (if needed)

**Goal**: Ensure database can store all contact form fields

**Files to Review**:
- `backend/app/database.py`
- `backend/app/models.py`

**Tasks**:
1. Review existing `Lead` model in `database.py`:
   - Verify fields exist for all contact information
   - Check if `organization_type`, `operational_challenges`, `automation_goals` fields exist
   - **NEW**: Add `additional_context` field for extra info from open discussion:
     ```python
     additional_context = Column(Text, nullable=True, name="additional_context")
     ```
   - Add missing fields if needed

2. Update `LeadCreate` Pydantic model in `models.py` to match database schema

3. Create database migration if schema changed (Alembic):
   ```bash
   alembic revision --autogenerate -m "Add contact form fields to leads table"
   alembic upgrade head
   ```

**Reference**: Existing models at `backend/app/database.py` lines 42-57

**Validation Gate**: Create test lead with all fields, verify saved to database correctly

---

## Validation Checklist

### Level 1: Code Quality
- [ ] TypeScript check passes: `cd frontend && npm run check`
- [ ] ESLint passes: `cd frontend && npm run lint`
- [ ] Python type check (if using mypy): `cd backend && mypy .`
- [ ] No console errors in browser DevTools

### Level 2: Backend Functionality
- [ ] LangGraph agent asks questions sequentially (one at a time)
- [ ] Agent validates email format and rejects invalid emails
- [ ] Agent validates phone format
- [ ] Agent transitions through all 8 question nodes correctly
- [ ] **NEW**: Agent presents confirmation summary after collecting all info
- [ ] **NEW**: Agent routes to open discussion when user wants to elaborate
- [ ] **NEW**: Agent extracts corrections/additions from open discussion
- [ ] **NEW**: Agent updates fields with information from discussion
- [ ] **NEW**: Open discussion can loop multiple times before qualifying
- [ ] **NEW**: `additional_context` field populated with extra discussion details
- [ ] Agent marks lead as qualified after confirmation/discussion complete
- [ ] Lead data saved to database with all fields (including additional_context)
- [ ] Internal notification email sent to team
- [ ] Thank you email sent to prospect
- [ ] Both emails have correct content and formatting

### Level 3: Frontend Functionality
- [ ] `/contact` route loads ContactPage component
- [ ] ContactPage renders hero, chatbot, and sidebar sections
- [ ] Chatbot connects to backend API successfully
- [ ] Messages display in chat interface
- [ ] User can type and send messages
- [ ] Loading state shows while waiting for response
- [ ] Conversation persists during session
- [ ] Page scrolls to top on mount

### Level 4: Navigation Updates
- [ ] Navigation bar "Get in Touch" button navigates to `/contact` (desktop)
- [ ] Navigation bar "Get in Touch" button navigates to `/contact` (mobile)
- [ ] Hero section CTA button navigates to `/contact`
- [ ] CTA section button navigates to `/contact`
- [ ] Footer "Contact" link navigates to `/contact`
- [ ] Industry cards "Talk to Expert" buttons navigate to `/contact`
- [ ] EdTech solutions page buttons navigate to `/contact` (2 buttons)
- [ ] Use cases page button navigates to `/contact`
- [ ] Demos page buttons navigate to `/contact` (2 buttons)
- [ ] All navigation works on both desktop and mobile

### Level 5: Responsive Design
- [ ] Contact page layout works on mobile (375px)
- [ ] Contact page layout works on tablet (768px)
- [ ] Contact page layout works on desktop (1024px+)
- [ ] Chatbot interface is usable on mobile
- [ ] Sidebar stacks properly on mobile
- [ ] All buttons are tappable on mobile (44px minimum)

### Level 6: Internationalization
- [ ] All new translation keys added to `en.json`
- [ ] All new translation keys added to `de.json`
- [ ] Language switcher works on contact page
- [ ] All text updates when language changes
- [ ] Chatbot responds in correct language

### Level 7: End-to-End Flow

**Scenario A: User confirms without elaboration**
- [ ] User clicks "Get in Touch" from homepage
- [ ] Lands on `/contact` page
- [ ] Chatbot greets user
- [ ] User provides name → chatbot acknowledges and asks for email
- [ ] User provides email → chatbot validates and asks for phone
- [ ] User provides phone → chatbot asks for company
- [ ] User provides company → chatbot asks for role
- [ ] User provides role → chatbot asks for organization type
- [ ] User provides org type → chatbot asks for challenges
- [ ] User provides challenges → chatbot asks for goals
- [ ] User provides goals → **NEW**: chatbot presents confirmation summary
- [ ] **NEW**: User confirms info is correct (e.g., "looks good")
- [ ] Chatbot thanks user and confirms next steps
- [ ] Internal notification email received by team with all details
- [ ] Thank you email received by prospect
- [ ] Lead visible in database with all fields populated

**Scenario B: User wants to elaborate/correct**
- [ ] ... (same steps through goals) ...
- [ ] User provides goals → **NEW**: chatbot presents confirmation summary
- [ ] **NEW**: User indicates they want to add more (e.g., "I'd like to tell you more")
- [ ] **NEW**: Chatbot asks clarifying question about challenges/goals
- [ ] **NEW**: User provides additional context
- [ ] **NEW**: Chatbot asks follow-up question
- [ ] **NEW**: User provides more details
- [ ] **NEW**: Chatbot asks if there's anything else to add
- [ ] **NEW**: User says "that's all"
- [ ] **NEW**: Agent updates `operational_challenges` or `automation_goals` fields with new info
- [ ] **NEW**: `additional_context` field contains discussion summary
- [ ] Chatbot thanks user and confirms next steps
- [ ] Internal notification email received with updated fields
- [ ] Thank you email received by prospect
- [ ] Lead visible in database with updated fields and additional_context

**Scenario C: User corrects information**
- [ ] ... (same steps through confirmation) ...
- [ ] **NEW**: User says "actually, my email is different"
- [ ] **NEW**: Chatbot enters open discussion to gather correction
- [ ] **NEW**: User provides corrected email
- [ ] **NEW**: Agent updates email field
- [ ] **NEW**: Chatbot confirms correction and asks if anything else needs updating
- [ ] **NEW**: User says "no, that's it"
- [ ] Chatbot qualifies lead with corrected information
- [ ] Emails sent to corrected address

**Scenario D: Inactivity detection (Research-Validated)**
- [ ] User completes all 8 questions and confirms information
- [ ] Emails sent IMMEDIATELY (< 5 seconds) with basic info
- [ ] `emails_sent` state set to true
- [ ] User continues chatting, provides additional context
- [ ] `additional_context` field accumulates new information
- [ ] User goes inactive for 10 minutes
- [ ] Frontend inactivity timer fires
- [ ] Frontend sends `__INACTIVITY_SIGNAL__` to backend
- [ ] Backend checks if `update_email_sent` is false
- [ ] If new context exists, backend sends UPDATE email to sales team only
- [ ] `update_email_sent` state set to true
- [ ] Chatbot displays graceful closure message
- [ ] Lead in database has both basic info and additional context

**Scenario E: Tab close detection (Research-Validated)**
- [ ] User completes all 8 questions and confirms
- [ ] Emails sent immediately (< 5 seconds)
- [ ] User starts providing additional context
- [ ] User closes browser tab
- [ ] `visibilitychange` event fires (or `pagehide` on mobile)
- [ ] Frontend sends `__CLOSE_SIGNAL__` via `navigator.sendBeacon`
- [ ] Backend saves any accumulated context to database
- [ ] If significant new context exists, backend sends update email
- [ ] No data loss occurs (91% reliability verified)
- [ ] Lead in database contains all conversation data

---

## Implementation Order

**Priority**: Implement in this order for incremental testability

1. **Backend Agent** (Phase 1) - Core conversation logic
2. **Backend API** (Phase 6) - Connect agent to FastAPI
3. **Frontend Page** (Phase 3) - UI for testing agent
4. **Frontend Route** (Phase 4, Task 1) - Make page accessible
5. **Email Service** (Phase 2) - Automated notifications
6. **Email Integration** (Phase 6, Task 3) - Connect emails to agent
7. **Navigation Updates** (Phase 4, Tasks 2-9) - Update all CTAs
8. **Translations** (Phase 5) - Add i18n support
9. **Database** (Phase 7) - Schema updates if needed

---

## Success Metrics

**Quantitative**:
- Contact form completion rate: Target >70% (vs industry average 50% for traditional forms)
- Average time to complete: Target <5 minutes
- Email delivery success rate: Target >99%
- Lead data completeness: Target 100% (all 8 fields)

**Qualitative**:
- User feedback on conversational experience
- Team feedback on lead quality
- Time saved on manual lead entry
- Professional appearance of emails

---

## Dependencies

**Frontend**:
- React 18.3.1
- TypeScript 5.6.3
- wouter 3.3.5 (routing)
- @tanstack/react-query 5.60.5 (API calls)
- i18next 25.5.3 (translations)
- lucide-react 0.453.0 (icons)
- shadcn/ui components (Button, Card, Input)

**Backend**:
- FastAPI 0.115.5
- LangChain 0.3.13
- LangGraph 0.2.62
- OpenAI 1.57.2
- SQLAlchemy 2.0.36
- Pydantic 2.10.3
- Resend (latest) - **NEW**
- Jinja2 (latest) - **NEW**

**Environment Variables**:
- `OPENAI_API_KEY` - Required (existing)
- `DATABASE_URL` - Required (existing)
- `RESEND_API_KEY` - Required (NEW - obtain from https://resend.com)
- `INTERNAL_NOTIFICATION_EMAIL` - Required (NEW - AR Automation team email)

---

## Risk Mitigation

**Risk**: LangGraph agent gets stuck in infinite loop
- **Mitigation**: Add max iteration limit in graph compilation, implement timeout

**Risk**: Email sending fails
- **Mitigation**: Use BackgroundTasks (non-blocking), log all errors, implement retry logic

**Risk**: Invalid email/phone breaks conversation flow
- **Mitigation**: Validate with regex before accepting, allow retry up to 3 times

**Risk**: User refreshes page mid-conversation
- **Mitigation**: Store conversation state in database, implement session recovery

**Risk**: API endpoint overwhelmed with requests
- **Mitigation**: Implement rate limiting, use FastAPI async handlers

**Risk**: Spam submissions
- **Mitigation**: Add rate limiting per IP, implement basic honeypot field (future enhancement)

---

## Future Enhancements

**Phase 2 (Post-MVP)**:
1. Add conversation persistence with browser localStorage
2. Implement "Resume conversation" functionality
3. Add rate limiting to prevent spam
4. Implement CRM integration (HubSpot, Salesforce)
5. Add analytics tracking for conversion funnels
6. Implement A/B testing for chatbot prompts
7. Add sentiment analysis for lead prioritization
8. Create admin dashboard to view leads and conversations

**Phase 3 (Advanced)**:
1. Add multi-turn clarification questions based on responses
2. Implement smart routing to specific team members
3. Add calendar integration for direct meeting scheduling
4. Implement SMS notifications option
5. Add voice input support for chatbot
6. Create mobile app version

---

## Documentation Links

**LangGraph**:
- Core concepts: https://langchain-ai.github.io/langgraph/concepts/low_level/
- Build chatbot tutorial: https://langchain-ai.github.io/langgraph/tutorials/get-started/1-build-basic-chatbot/
- Information gathering: https://langchain-ai.github.io/langgraph/tutorials/chatbots/information-gather-prompting/

**Email Automation**:
- Resend FastAPI guide: https://resend.com/docs/send-with-fastapi
- FastAPI BackgroundTasks: https://fastapi.tiangolo.com/tutorial/background-tasks/
- Jinja2 templates: https://jinja.palletsprojects.com/

**Frontend**:
- Wouter documentation: https://github.com/molefrog/wouter
- shadcn/ui components: https://ui.shadcn.com/
- i18next React: https://react.i18next.com/

---

## Notes

### Design Decisions

**Why separate contact agent instead of enhancing existing agent?**
- Different purposes: Marketing lead qualification vs general contact
- Cleaner separation of system prompts and question flows
- Easier to maintain and update independently
- Can be merged later if they become too similar

**Why Resend over SendGrid or AWS SES?**
- Simpler API and faster setup (5 minutes vs 30+ minutes)
- Better free tier for startup phase (3,000 emails/month)
- Excellent developer experience and documentation
- Modern, purpose-built for transactional emails

**Why BackgroundTasks instead of Celery?**
- Sufficient for email sending (lightweight operation)
- No additional infrastructure needed (no Redis, no workers)
- Simpler deployment and maintenance
- Can upgrade to Celery later if needed for heavy async operations

**Why sequential questions instead of multi-field form?**
- Higher completion rate (conversational UX reduces cognitive load)
- Demonstrates automation capabilities to prospects
- Allows for validation at each step
- More engaging and modern user experience
- Easier to collect complete information

### Implementation Notes

**Database Considerations**:
- Existing `Lead` model may already have sufficient fields
- Check before creating migration
- Use nullable fields for optional information (phone)

**Testing Strategy**:
- Unit test each LangGraph node independently
- Integration test full conversation flow
- Test email sending in development with test account
- Use test API keys for Resend during development

**Deployment Notes**:
- Verify Resend API key added to production environment variables
- Test email sending in staging before production
- Monitor email delivery rates in Resend dashboard
- Set up alerts for failed email deliveries

---

## Research Documents

This PRP was updated on October 13, 2025 with industry research findings. Comprehensive research was conducted across commercial chatbot platforms, email timing studies, and browser API documentation. Key findings changed our approach to email timing (immediate sending), inactivity detection (10 minutes), and tab close handling (visibilitychange pattern).

**Research Documents Created**:
1. **`.claude/PRPs/industry-research-summary.md`** ⭐ **PRIMARY REFERENCE**
   - Executive summary of all research findings
   - Critical changes needed (email timing, inactivity timeout, tab close detection)
   - Implementation impact analysis with conversion data
   - Comprehensive recommendations

2. **`.claude/PRPs/email-timing-strategy.md`**
   - Detailed explanation of 3-signal architecture
   - State management patterns
   - Edge case handling
   - Testing strategies

3. **`/docs/chatbot-conversation-completion-research.md`**
   - Commercial platform analysis (Intercom, Drift, HubSpot, Zendesk)
   - Industry standard timeouts and patterns
   - Best practices for conversation completion

4. **`/docs/page-unload-beacon-research.md`**
   - Browser API deep-dive (visibilitychange vs beforeunload)
   - Reliability statistics (91% vs 60-70%)
   - Mobile compatibility analysis
   - navigator.sendBeacon implementation patterns

5. **`/.claude/artifacts/email-timing-best-practices-research.md`**
   - Lead response timing studies (Harvard Business Review)
   - Conversion rate data (391% improvement < 1 min)
   - Industry benchmarks (Salesforce, HubSpot, Pipedrive)
   - Customer expectation research

**Research Validation**:
- ✅ 391% higher conversion responding within 1 minute vs 5+ minutes
- ✅ 10 minutes is industry standard timeout (Zendesk, LiveHelpNow, Freshchat)
- ✅ visibilitychange + pagehide = 91% reliability (vs beforeunload 60-70%)
- ✅ HTTP/REST validated as correct approach (WebSocket not needed)

---

**Created**: October 12, 2025
**Updated**: October 13, 2025 (Research-validated email timing, inactivity, and tab close patterns)
**Author**: Claude (Anthropic)
**Confidence Score**: 9.5/10 - Very high confidence. Implementation approach validated by industry research from commercial platforms (Intercom, Drift, Zendesk), email timing studies (HBR, TimeToReply), and browser API documentation (MDN, Google Analytics patterns).
**Estimated Implementation Time**: 8-12 hours (1-2 developer days)