# Email Timing & Inactivity Detection Strategy

## Overview

This document explains how email timing and conversation completion work in the AR Automation contact page chatbot.

## The Problem

**FastAPI is stateless** - the backend only runs when the frontend makes an API call. This means:

- ❌ Backend can't detect when user goes idle
- ❌ Backend can't detect when user closes browser tab
- ❌ Backend doesn't "know" conversation has ended
- ❌ Backend can't send "delayed" emails based on time

**We must solve this with frontend-driven detection.**

---

## The Solution: 3-Signal Architecture

### Signal 1: Confirmation (No Email Yet)

**When**: User confirms information after reviewing summary

**What Happens**:
```typescript
// Frontend
User: "yes, that's correct"
↓
Bot: "Great! Is there anything else you'd like to tell me about your automation needs?"
↓
Backend State: is_qualified=true, emails_sent=false
```

**Why Not Send Emails Here?**
- User might want to add more context
- User might correct information
- User might continue chatting

**State Change**:
```python
{
  "is_qualified": True,
  "confirmation_shown": True,
  "emails_sent": False,  # KEY: Don't send yet
  "conversation_status": "qualified_pending"
}
```

---

### Signal 2: Inactivity (Send Emails)

**When**: 5 minutes pass with no user activity

**Frontend Detection**:
```typescript
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const [lastMessageTime, setLastMessageTime] = useState(Date.now());

useEffect(() => {
  const timer = setInterval(() => {
    const timeSinceLastMessage = Date.now() - lastMessageTime;

    if (
      timeSinceLastMessage >= INACTIVITY_TIMEOUT &&
      isQualified &&
      !emailsSent
    ) {
      // Send special signal to backend
      sendInactivitySignal();
    }
  }, 30000); // Check every 30 seconds

  return () => clearInterval(timer);
}, [lastMessageTime, isQualified, emailsSent]);

const sendInactivitySignal = async () => {
  await apiRequest('POST', '/api/chat', {
    sessionId,
    message: '__INACTIVITY_SIGNAL__',
    language: i18n.language
  });
};
```

**Backend Handling**:
```python
# In /api/chat endpoint
if chat_request.message == "__INACTIVITY_SIGNAL__":
    state = get_conversation_state(chat_request.session_id)

    if state.get("is_qualified") and not state.get("emails_sent"):
        # Extract ALL accumulated context
        lead_data = {
            "name": state["name"],
            "email": state["email"],
            # ... all fields ...
            "additional_context": state.get("additional_context", ""),
            "operational_challenges": state["operational_challenges"],
            "automation_goals": state["automation_goals"]
        }

        # Send both emails as background tasks
        background_tasks.add_task(send_internal_notification, lead_data)
        background_tasks.add_task(send_thank_you_email, lead_data)

        # Mark as sent
        state["emails_sent"] = True
        state["conversation_status"] = "closed_inactive"

    return ChatResponse(
        response="Good to chat with you! We'll be in touch soon. — Max",
        session_id=session_id,
        conversation_id=conversation.id
    )
```

**What Gets Sent**:
- ✅ Original 8 fields (name, email, phone, company, role, org type, challenges, goals)
- ✅ ALL additional context from open discussion
- ✅ Any corrections made by user

---

### Signal 3: Tab Close (Send Emails)

**When**: User closes browser tab/window

**Frontend Detection**:
```typescript
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (conversationActive && isQualified && !emailsSent) {
      // Use navigator.sendBeacon (doesn't get canceled on tab close)
      const data = JSON.stringify({
        sessionId,
        message: '__CLOSE_SIGNAL__',
        language: i18n.language
      });

      navigator.sendBeacon('/api/chat/beacon', data);
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [conversationActive, isQualified, emailsSent, sessionId]);
```

**Why `navigator.sendBeacon`?**
- Regular `fetch()` gets canceled when tab closes
- `sendBeacon()` is designed for end-of-session analytics
- Guarantees delivery even as page unloads

**Backend Handling**:
```python
# Same as inactivity signal
if chat_request.message == "__CLOSE_SIGNAL__":
    # ... send emails with all context ...
    state["conversation_status"] = "closed_complete"
```

---

## Conversation Flow Examples

### Scenario 1: Quick Confirmation

```
User answers 8 questions
↓
Bot: "Ok, here's what I have... correct?"
↓
User: "yes" [State: is_qualified=true, emails_sent=false]
↓
Bot: "Anything else to add?"
↓
User: "no" [User goes idle]
↓
[5 minutes pass]
↓
Frontend: Sends __INACTIVITY_SIGNAL__
↓
Backend: Sends emails ✅
```

**Emails Include**: Original 8 fields only (no additional context)

---

### Scenario 2: User Elaborates

```
User answers 8 questions
↓
Bot: "Ok, here's what I have... correct?"
↓
User: "yes, but I'd like to tell you more" [State: is_qualified=true]
↓
Bot: "Tell me more about your challenges"
↓
User: [Long explanation about specific pain points]
↓
Bot: "That's helpful! Anything else?"
↓
User: [More details about timeline and budget]
↓
Bot: "Is there anything else?"
↓
User: "no, that's all" [User goes idle]
↓
[5 minutes pass]
↓
Frontend: Sends __INACTIVITY_SIGNAL__
↓
Backend: Updates fields with new info, sends emails ✅
```

**Emails Include**:
- Original 8 fields
- UPDATED `operational_challenges` with elaborated details
- UPDATED `automation_goals` with timeline/budget info
- `additional_context` with full discussion summary

---

### Scenario 3: User Closes Tab

```
User answers 8 questions
↓
Bot: "Ok, here's what I have... correct?"
↓
User: "yes"
↓
Bot: "Anything else?"
↓
User: [Closes browser tab] ❌
↓
Frontend: beforeunload → sends __CLOSE_SIGNAL__ via sendBeacon
↓
Backend: Sends emails immediately ✅
```

**Emails Include**: Original 8 fields (user didn't elaborate)

---

### Scenario 4: Implicit Confirmation

```
User answers 8 questions
↓
Bot: "Ok, here's what I have... correct?"
↓
User: "Actually, tell me more about pricing" [Keeps chatting without confirming]
↓
Bot: [Continues conversation]
↓
User: [Eventually stops responding]
↓
[5 minutes pass]
↓
Frontend: Sends __INACTIVITY_SIGNAL__
↓
Backend: Sends emails ✅
```

**Interpretation**: Continuing to chat = implicit confirmation

**Emails Include**: All conversation content captured

---

## State Tracking

### Backend State Fields

```python
class ContactFormState(TypedDict):
    # ... contact fields ...

    # Conversation lifecycle
    is_qualified: bool              # All 8 questions answered
    confirmation_shown: bool        # Summary presented to user
    emails_sent: bool              # Prevent duplicate sends
    qualified_timestamp: Optional[datetime]  # When qualified
    conversation_status: str        # active, qualified_pending, closed_inactive, closed_complete
```

### Frontend State Tracking

```typescript
const [conversationActive, setConversationActive] = useState(true);
const [isQualified, setIsQualified] = useState(false);
const [emailsSent, setEmailsSent] = useState(false);
const [lastMessageTime, setLastMessageTime] = useState(Date.now());
```

**How Frontend Knows State**:

Option 1: Backend includes metadata in response
```python
return ChatResponse(
    response="...",
    session_id=session_id,
    conversation_id=conversation.id,
    metadata={
        "is_qualified": state["is_qualified"],
        "emails_sent": state["emails_sent"],
        "confirmation_shown": state["confirmation_shown"]
    }
)
```

Option 2: Frontend parses conversation content
```typescript
// Check if bot response contains qualification markers
if (botResponse.includes("Ok, here's what I have")) {
  setIsQualified(true);
}
```

---

## Preventing Duplicate Emails

### The Problem

User might trigger multiple signals:
1. Inactivity timer fires
2. User comes back and closes tab
3. Both signals try to send emails

### The Solution

**Backend Check**:
```python
if state.get("emails_sent"):
    # Already sent, do nothing
    return ChatResponse(response="Conversation already closed", ...)
```

**Frontend Check**:
```typescript
if (emailsSent) {
  // Don't send any more signals
  return;
}
```

**Database Transaction**:
```python
# Atomic update to prevent race conditions
conversation = db.query(Conversation).filter(
    Conversation.session_id == session_id,
    Conversation.emails_sent == False  # Only update if not sent
).first()

if conversation:
    conversation.emails_sent = True
    db.commit()
    send_emails()
```

---

## Implementation Checklist

### Backend Tasks

- [ ] Add `emails_sent` boolean to ContactFormState
- [ ] Add `confirmation_shown` boolean to ContactFormState
- [ ] Add `conversation_status` string to ContactFormState
- [ ] Add `qualified_timestamp` datetime to ContactFormState
- [ ] Handle `__INACTIVITY_SIGNAL__` in /api/chat endpoint
- [ ] Handle `__CLOSE_SIGNAL__` in /api/chat endpoint
- [ ] Add `/api/chat/beacon` endpoint for sendBeacon support
- [ ] Implement email send logic with duplicate prevention
- [ ] Update `update_fields_from_discussion()` to accumulate context
- [ ] Add graceful closure message on inactivity

### Frontend Tasks

- [ ] Add inactivity timer (5 minutes)
- [ ] Track `lastMessageTime` on every message
- [ ] Implement `sendInactivitySignal()` function
- [ ] Add `beforeunload` event listener
- [ ] Implement `navigator.sendBeacon` for tab close
- [ ] Track `isQualified` state from backend responses
- [ ] Track `emailsSent` state from backend responses
- [ ] Prevent duplicate signal sends
- [ ] Display "conversation closed" message after inactivity
- [ ] Update UI to show conversation is complete

---

## Testing Strategy

### Test Case 1: Inactivity After Confirmation

```
1. Complete 8 questions
2. Confirm information
3. Wait 5 minutes
4. Verify inactivity signal sent
5. Verify both emails received
6. Verify emails_sent=true in state
```

### Test Case 2: Tab Close After Qualification

```
1. Complete 8 questions
2. Confirm information
3. Close browser tab
4. Verify CLOSE_SIGNAL sent via beacon
5. Verify both emails received
```

### Test Case 3: Elaboration + Inactivity

```
1. Complete 8 questions
2. Confirm information
3. Provide additional context (3-4 messages)
4. Wait 5 minutes
5. Verify emails include additional context
```

### Test Case 4: Duplicate Prevention

```
1. Complete 8 questions
2. Trigger inactivity (5 min)
3. Immediately close tab
4. Verify only ONE set of emails sent
5. Verify state shows emails_sent=true
```

### Test Case 5: User Returns After Timeout

```
1. Complete 8 questions
2. Wait 5 minutes (inactivity)
3. User returns and sends message
4. Verify bot responds "conversation already closed"
5. Verify no duplicate emails sent
```

---

## Edge Cases

### Edge Case 1: User Confirms Then Immediately Closes

**Scenario**: User says "yes" then closes tab before 5-min timer

**Solution**: `beforeunload` sends CLOSE_SIGNAL immediately

**Result**: Emails sent on tab close ✅

---

### Edge Case 2: User Never Confirms

**Scenario**: User provides all info but never responds to confirmation

**Solution**: Inactivity timer still triggers after 5 minutes

**Result**: Emails sent with all provided info ✅

**Interpretation**: Silence = implicit confirmation

---

### Edge Case 3: Backend Crash Before Sending Emails

**Scenario**: Inactivity signal received, backend crashes before email send

**Solution**:
- BackgroundTasks queued in FastAPI
- If crash happens during email send, task lost
- **Mitigation**: Add retry queue (future enhancement)
- **Acceptable Risk**: Rare occurrence, user can resubmit

**Alternative**: Implement job queue (Celery, Redis) for reliability

---

### Edge Case 4: User Navigates to Another Page (Same Site)

**Scenario**: User chats, then clicks "Solutions" link (stays on site)

**Current Behavior**: `beforeunload` fires → sends CLOSE_SIGNAL

**Problem**: User might come back to continue chat

**Better Solution**:
```typescript
// Only send signal if user is leaving the site entirely
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  // Check if navigation is within same origin
  if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
    // User navigating within site, don't close conversation yet
    return;
  }

  // User leaving site, send signal
  if (isQualified && !emailsSent) {
    navigator.sendBeacon('/api/chat/beacon', data);
  }
};
```

**Note**: This is complex to implement reliably. **Recommended**: Keep simple - inactivity timer is primary mechanism.

---

## Configuration

### Timeouts (Configurable)

```typescript
// frontend/src/config/chatbot.ts
export const CHATBOT_CONFIG = {
  INACTIVITY_TIMEOUT: 5 * 60 * 1000,      // 5 minutes
  INACTIVITY_CHECK_INTERVAL: 30 * 1000,   // 30 seconds
  AUTO_CLOSE_MESSAGE: "Good to chat with you! We'll be in touch soon. — Max"
};
```

```python
# backend/app/config.py
class ChatbotConfig:
    INACTIVITY_TIMEOUT_MINUTES = 5
    SEND_EMAILS_ON_CLOSE = True
    GRACEFUL_CLOSE_MESSAGE = "Good to chat with you! We'll be in touch soon. — Max"
```

---

## Future Enhancements

### Enhancement 1: WebSocket Connection

**Current**: HTTP requests (stateless)
**Future**: WebSocket connection (stateful)

**Benefit**: Backend can detect disconnect instantly

**Tradeoff**: More complex infrastructure, higher resource usage

---

### Enhancement 2: Email Queue with Retry

**Current**: BackgroundTasks (fire and forget)
**Future**: Celery + Redis job queue

**Benefit**: Guaranteed email delivery with retries

**Implementation**:
```python
# backend/app/tasks.py
from celery import Celery

celery_app = Celery('ar_automation')

@celery_app.task(bind=True, max_retries=3)
def send_lead_emails(self, lead_data):
    try:
        send_internal_notification(lead_data)
        send_thank_you_email(lead_data)
    except Exception as e:
        self.retry(exc=e, countdown=60)  # Retry after 1 minute
```

---

### Enhancement 3: Admin Dashboard

**Feature**: View conversations in real-time

**Use Case**: Support team can see when conversations are abandoned

**Implementation**:
- WebSocket connection to backend
- Dashboard shows active conversations
- Manual "send emails" button for abandoned chats

---

## Summary

### Email Timing Rules (Final)

| User Action | Time | Backend Action |
|-------------|------|----------------|
| Answers 8 questions | Immediate | Mark `is_qualified=true`, DON'T send emails |
| Confirms information | Immediate | Mark `confirmation_shown=true`, DON'T send emails |
| Continues chatting | Immediate | Continue conversation, accumulate context |
| Goes inactive | After 5 min | Frontend sends `__INACTIVITY_SIGNAL__` → Backend sends emails |
| Closes tab | Immediate | Frontend sends `__CLOSE_SIGNAL__` → Backend sends emails |
| Returns after timeout | Immediate | Backend responds "already closed", no new emails |

### Key Principle

**"Don't send emails until conversation is truly over"**

Conversation is over when:
1. User has been inactive for 5+ minutes, OR
2. User closes browser tab

NOT when:
- User confirms information (might add more)
- User is still actively chatting

---

**Last Updated**: October 12, 2025
**Author**: Claude (Anthropic)
**Related PRP**: `.claude/PRPs/conversational-contact-page.md`