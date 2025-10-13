# Browser Tab/Window Close Events & Reliable Data Sending

**Research Date:** October 2024
**Purpose:** Comprehensive guide for handling browser tab/window close events and sending lead data reliably before page unload

---

## Table of Contents

1. [Section 1: Event Comparison](#section-1-event-comparison)
2. [Section 2: sendBeacon Analysis](#section-2-sendbeacon-analysis)
3. [Section 3: Alternative Approaches](#section-3-alternative-approaches)
4. [Section 4: Best Practices](#section-4-best-practices)
5. [Section 5: Real-World Examples](#section-5-real-world-examples)
6. [Section 6: Code Template](#section-6-code-template)
7. [Section 7: Testing Approach](#section-7-testing-approach)
8. [Additional Resources](#additional-resources)

---

## Section 1: Event Comparison

### Complete Event Comparison Table

| Event | Reliability | Browser Support | Mobile Support | When It Fires | When It DOESN'T Fire | Best Use Case | bfcache Compatible |
|-------|------------|-----------------|----------------|---------------|---------------------|---------------|-------------------|
| **visibilitychange** | ⭐⭐⭐⭐ High | All modern browsers | ✅ Excellent | Tab switch, minimize, app switch | Some older browsers | **Primary choice** for session end detection | ✅ Yes |
| **pagehide** | ⭐⭐⭐ Good | All modern browsers | ✅ Good | Page unload, navigation | Not always on mobile, bfcache restore | **Secondary/fallback** for visibilitychange | ✅ Yes |
| **beforeunload** | ⭐⭐ Poor | Desktop: Good, Mobile: Poor | ❌ Very unreliable | User-initiated navigation | Mobile browsers, bfcache scenarios, no user interaction | **Only for "unsaved changes" warnings** | ❌ No |
| **unload** | ⭐ Very Poor | Desktop: Fair, Mobile: Very Poor | ❌ Unreliable | Page unload (legacy) | Mobile Safari, bfcache scenarios, many mobile situations | **Deprecated - do not use** | ❌ No |

### Reliability Statistics

- **visibilitychange + pagehide combined:** 91% reliability
- **Using all 4 events (beforeunload, unload, pagehide, visibilitychange):** Only ~82.9% reliability
- **beforeunload alone:** ~30% failure rate across browsers when page closed
- **unload alone:** Does not fire on mobile Safari, unreliable on desktop

### Critical Findings

#### ✅ Recommended Approach
The **most reliable method** combines `visibilitychange` and `pagehide` events. Using `unload` and `beforeunload` events is inadvisable as it:
- Disables the browser's backward-forward cache (bfcache)
- Does not improve reliability
- Severely impacts performance

#### ❌ What NOT to Do
- **Never rely solely on `beforeunload` or `unload`** for analytics/data sending
- **Never use these events on mobile** - they simply don't fire in many situations
- **Don't listen to all 4 events** - it actually reduces reliability

### Event-Specific Details

#### visibilitychange (Primary Event)
**Best event to use** to signal the end of a user's session.

**When it fires:**
- Tab switches (hidden/visible)
- Window minimize/maximize
- Mobile app background/foreground
- Page enters bfcache

**Key characteristics:**
- Fires on `document`, not `window`
- Check `document.visibilityState === "hidden"` for session end
- Transitioning to hidden is the last event that's reliably observable
- **Treat the hidden state as the last reliable time to save app and user data**

**Implementation:**
```javascript
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    // Last reliable point to save data
  }
});
```

#### pagehide (Secondary Event)
**Next-best alternative** in browsers that don't fully support visibilitychange.

**When it fires:**
- Page navigation
- Page unload
- Before page enters bfcache

**Key characteristics:**
- Fires on `window`, not `document`
- More reliable than unload/beforeunload
- Compatible with bfcache (unlike unload/beforeunload)
- **More reliable on iOS** where pages are often frozen and stored in bfcache

**Note on timing:**
The spec was changed to match browser implementation - `visibilitychange` actually fires **after** `pagehide`, not before.

#### beforeunload (Limited Use Only)
**Use ONLY for unsaved changes warnings**, not for data sending.

**Legitimate uses:**
- Warning users about unsaved form data
- Preventing accidental navigation away from important work

**Best practice:**
```javascript
// Only add when user has unsaved changes
window.addEventListener('beforeunload', handler);

// Remove immediately after saving
window.removeEventListener('beforeunload', handler);
```

**Important limitations:**
- Requires user interaction ("sticky activation") to show dialog
- Not supported on mobile browsers
- Breaks bfcache
- Custom messages are now blocked by most browsers (shows generic message)

#### unload (Deprecated)
**DO NOT USE** - Chrome is actively deprecating this event.

**Why it's being deprecated:**
- Extremely unreliable, especially on mobile
- Blocks bfcache
- Negative performance impact
- Better alternatives exist

---

## Section 2: sendBeacon Analysis

### Reliability Guarantee

**Answer: NO** - sendBeacon does NOT guarantee delivery, but it's the most reliable method available.

**Key findings:**
- When used with `pagehide` or `visibilitychange` events: **95.8% reliability**
- About **30% of browsers that claim to support the beacon API failed to deliver data** when page was closed
- The reliability depends heavily on **which event** you use to trigger it

### Size Limits

**Hard limit: 64 KB (65,536 bytes)**

**Browser-specific enforcement:**
- **Chrome:** 64KB quota across **all** beacon-initiated requests within the same navigation context
- **Edge & Firefox:** 64KB limit **per beacon**
- **Safari:** Shows helpful error: "Beacon API cannot load. Reached maximum amount of queued data of 64Kb for keepalive"

**Testing the limit:**
```javascript
var url = '/api/track';
var n = 65536; // 64KB limit
var data = new Array(n+1).join('X');

if (!navigator.sendBeacon(url, data)) {
  alert('Data limit reached - sendBeacon returned false');
}
```

**What happens when exceeded:**
- `sendBeacon()` returns `false`
- No data is sent
- No error is thrown (just returns false)

### Browser Compatibility Matrix

| Browser | Support Since | Notes |
|---------|--------------|-------|
| Chrome | April 2018 | Full support, 64KB shared quota |
| Firefox | April 2018 (keepalive: Nov 2024 v133) | Full support |
| Safari | April 2018 | Full support, helpful error messages |
| Edge | April 2018 | Full support |
| Mobile Safari | April 2018 | Supported, but event reliability issues |
| Mobile Chrome | April 2018 | Supported, but event reliability issues |

**Overall:** Well established across all modern browsers since April 2018.

### Failure Scenarios

#### 1. Browser Shutdown / Last Tab Close
- **Firefox:** sendBeacon requests **NOT sent** when closing the browser (all tabs)
- Works if browser stays alive because of other tabs
- Does not work when closing the only/last tab

#### 2. Event Reliability Issues
- `beforeunload` and `unload` events are not reliably fired
- `unload` does not fire on mobile/desktop Safari
- Chrome's bfcache means unload won't fire when page can be cached

#### 3. Mobile Platform Limitations
- `pagehide`, `unload`, and `beforeunload` may not fire on mobile
- Mobile sessions are thought of as foreground/background, not distinct page loads
- `visibilitychange` is more reliable on mobile

#### 4. CORS Issues
- `application/json` content type triggers CORS preflight
- Preflight can fail if not properly configured on server
- Use `text/plain` or proper CORS headers

#### 5. Recent Browser Issues
- **Firefox 125:** pagehide event can't be used anymore to send sendBeacon request
- Various browser updates have broken beacon functionality temporarily

#### 6. Size Limit Failures
- Returns `false` when 64KB limit exceeded
- No automatic retry or queue
- Developer must handle the failure

#### 7. Network Failures
- No retry mechanism
- No response available (fire-and-forget)
- 4xx/5xx errors silently fail
- No way to verify delivery

### Code Examples

#### Basic Usage
```javascript
// Simple beacon send
const data = JSON.stringify({
  sessionId: 'abc123',
  userId: 'user456'
});

if (navigator.sendBeacon('/api/track', data)) {
  console.log('Beacon queued successfully');
} else {
  console.error('Beacon failed - size limit or queue full');
}
```

#### With Blob for Content-Type Control
```javascript
const payload = {
  event: 'session_end',
  timestamp: Date.now()
};

const blob = new Blob(
  [JSON.stringify(payload)],
  { type: 'application/json' }
);

navigator.sendBeacon('/api/track', blob);
```

#### Checking Return Value
```javascript
function sendBeaconWithFallback(url, data) {
  if (!navigator.sendBeacon(url, data)) {
    // Beacon failed - too large or queue full
    console.error('sendBeacon failed');
    return false;
  }
  return true;
}
```

---

## Section 3: Alternative Approaches

### Comparison Table

| Method | Reliability | Browser Support | Size Limit | Pros | Cons | When to Use |
|--------|------------|-----------------|------------|------|------|-------------|
| **navigator.sendBeacon** | 95.8% (with right events) | All modern (2018+) | 64KB | Simple API, designed for this use case | No response, no retry, no delivery guarantee | **Primary choice** for analytics |
| **fetch() with keepalive** | ~95.8% (similar to beacon) | Chrome/Edge (full), Firefox 133+ | 64KB | More flexible (methods, headers), access to response | Newer API, Firefox support only since Nov 2024 | When you need HTTP methods besides POST, or need response |
| **Background Sync API** | Very high (98%+ when online) | Chrome/Edge only | No hard limit | Retries until success, works offline | Requires Service Worker, Chrome-only, overkill for simple use | Complex offline-first apps |
| **fetchLater() / PendingBeacon** | 98% | Chrome Origin Trial only | 64KB | Best reliability | Experimental, Chrome-only, API in flux | Future solution (not ready for production) |
| **Synchronous XHR** | Variable | All browsers (being deprecated) | No limit | Blocks page unload, waits for response | **Deprecated**, terrible UX, disabled in Chrome 80+ for unload events | **Never use** |

### Detailed Analysis

#### 1. navigator.sendBeacon (Recommended)

**Reliability:** 95.8% when used with visibilitychange/pagehide

**Browser Support:** All modern browsers since April 2018

**Pros:**
- Simple, purpose-built API
- Non-blocking
- Browser guarantees attempt to send
- Survives page unload
- Compatible with bfcache

**Cons:**
- Only supports POST requests
- No access to response
- No retry on failure
- Blocked by some ad blockers (uBlock Origin)
- 64KB size limit
- No delivery guarantee

**When to use:**
- Primary choice for analytics and tracking
- Session end detection
- Lead tracking and qualification data
- Any fire-and-forget data that doesn't need confirmation

**Example:**
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    const data = JSON.stringify({ sessionEnd: Date.now() });
    navigator.sendBeacon('/api/session-end', data);
  }
});
```

#### 2. fetch() with keepalive

**Reliability:** Similar to sendBeacon (~95.8%)

**Browser Support:**
- Chrome/Edge: Full support
- Firefox: keepalive support since v133 (November 2024)
- Safari: Limited support

**Pros:**
- More flexible than sendBeacon (any HTTP method)
- Can set custom headers
- Access to server response (Promise-based)
- Can use GET, DELETE, PUT, etc.
- Survives page unload
- Not blocked by ad blockers as often

**Cons:**
- Newer API (Firefox support only since Nov 2024)
- Same 64KB limit
- More complex than sendBeacon
- Still no delivery guarantee
- No retry mechanism

**When to use:**
- Need HTTP methods other than POST
- Need to read server response
- Want more control over request configuration
- Want to avoid ad blocker issues

**Example:**
```javascript
window.addEventListener('pagehide', () => {
  fetch('/api/session-end', {
    method: 'POST',
    body: JSON.stringify({ sessionId: '123' }),
    headers: { 'Content-Type': 'application/json' },
    keepalive: true
  }).catch(err => {
    // Error handling (though page may be gone)
    console.error(err);
  });
});
```

#### 3. Background Sync API

**Reliability:** Very high (98%+ when connection available)

**Browser Support:** Chrome/Edge only (as of 2024)

**Pros:**
- Retries automatically until success
- Works offline (queues until connection available)
- Perfect for Progressive Web Apps
- Highest reliability of all methods
- No size limit (within reason)
- Browser manages the queue

**Cons:**
- Requires Service Worker setup
- Chrome/Edge only (no Firefox/Safari)
- More complex implementation
- Overkill for simple use cases
- Only works in PWA context

**When to use:**
- Progressive Web Apps with offline capability
- Critical data that MUST be delivered
- Apps where users frequently go offline
- Complex offline-first applications

**Example:**
```javascript
// In your page
navigator.serviceWorker.ready.then(registration => {
  registration.sync.register('send-analytics');
});

// In your service worker
self.addEventListener('sync', event => {
  if (event.tag === 'send-analytics') {
    event.waitUntil(
      fetch('/api/analytics', {
        method: 'POST',
        body: getQueuedData()
      })
    );
  }
});
```

#### 4. fetchLater() / PendingBeacon API (Future)

**Reliability:** 98% (in testing)

**Browser Support:** Chrome Origin Trial only (experimental)

**Status:** The PendingBeacon API was available in Chrome M107-M115 but has been deprecated. The new proposal is called **fetchLater()**, currently under specification.

**Pros:**
- Highest reliability (98% success rate)
- Browser controls exact send timing
- Frees developer from event handling complexity
- Designed specifically for this use case

**Cons:**
- Experimental (not production-ready)
- Chrome-only
- API still in flux
- Unknown timeline for standardization

**When to use:**
- Not recommended for production yet
- Monitor for future standardization
- Consider for Chrome-only apps in testing

**Example (may change):**
```javascript
// This API is experimental and subject to change
const beacon = new PendingPostBeacon('/api/analytics', {
  method: 'POST',
  body: JSON.stringify(data)
});
// Browser will send when it determines best time
```

### Recommendation Matrix

| Scenario | Recommended Approach | Fallback |
|----------|---------------------|----------|
| Analytics/tracking (all browsers) | `navigator.sendBeacon` | `fetch` with `keepalive` |
| Need response from server | `fetch` with `keepalive` | `navigator.sendBeacon` (if response not critical) |
| Offline-first PWA | Background Sync API | `fetch` with `keepalive` |
| Chrome-only app | Consider fetchLater() (when stable) | `navigator.sendBeacon` |
| Critical data, must deliver | Background Sync API | `fetch` with `keepalive` |
| Simple chat app (our use case) | `navigator.sendBeacon` | `fetch` with `keepalive` |

---

## Section 4: Best Practices

### Recommended Event Pattern

**Primary Recommendation: visibilitychange + pagehide**

This combination provides 91% reliability and maximum browser compatibility.

```javascript
let beaconSent = false;

// Primary: visibilitychange for most cases
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && !beaconSent) {
    sendData();
    beaconSent = true;
  }
});

// Fallback: pagehide for browsers/situations where visibilitychange doesn't fire
window.addEventListener('pagehide', () => {
  if (!beaconSent) {
    sendData();
    beaconSent = true;
  }
});

function sendData() {
  const data = JSON.stringify({
    sessionId: currentSessionId,
    timestamp: Date.now()
  });
  navigator.sendBeacon('/api/session-end', data);
}
```

### Recommended API for Sending Data

**Primary: navigator.sendBeacon**
- Purpose-built for this use case
- Best browser support
- Simple API
- Good reliability (95.8%)

**Fallback: fetch with keepalive**
- When sendBeacon unavailable
- When you need response
- When you need methods other than POST

```javascript
function sendDataReliably(url, data) {
  // Try sendBeacon first
  if (navigator.sendBeacon) {
    const success = navigator.sendBeacon(url, data);
    if (success) return;
  }

  // Fallback to fetch with keepalive
  if ('fetch' in window) {
    fetch(url, {
      method: 'POST',
      body: data,
      keepalive: true,
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {
      // Page likely unloaded, nothing we can do
    });
  }
}
```

### How to Handle Failures

**Reality Check:** You cannot guarantee 100% delivery. Accept 5-10% data loss.

**Strategies:**

1. **Check sendBeacon return value:**
```javascript
const success = navigator.sendBeacon(url, data);
if (!success) {
  // Too large or queue full
  // Option 1: Try to send smaller payload
  // Option 2: Log to localStorage and send on next visit
  // Option 3: Accept the loss
}
```

2. **Size limit handling:**
```javascript
function sendWithSizeCheck(url, data) {
  const payload = JSON.stringify(data);

  if (payload.length > 60000) { // Leave buffer before 64KB
    // Payload too large, send essential data only
    const essentialData = {
      sessionId: data.sessionId,
      leadQualified: data.leadQualified
    };
    navigator.sendBeacon(url, JSON.stringify(essentialData));
  } else {
    navigator.sendBeacon(url, payload);
  }
}
```

3. **Queue for next session (optional):**
```javascript
function sendOrQueue(url, data) {
  if (!navigator.sendBeacon(url, data)) {
    // Failed, queue for next session
    const queue = JSON.parse(localStorage.getItem('beaconQueue') || '[]');
    queue.push({ url, data, timestamp: Date.now() });
    localStorage.setItem('beaconQueue', JSON.stringify(queue));
  }
}

// On app initialization
function sendQueuedBeacons() {
  const queue = JSON.parse(localStorage.getItem('beaconQueue') || '[]');
  queue.forEach(item => {
    fetch(item.url, {
      method: 'POST',
      body: item.data,
      headers: { 'Content-Type': 'application/json' }
    });
  });
  localStorage.removeItem('beaconQueue');
}
```

### Duplicate Prevention

**Problem:** Both visibilitychange and pagehide might fire, or user might trigger multiple times.

**Solution: Use a flag**

```javascript
let dataSent = false;

function sendDataOnce() {
  if (dataSent) return;
  dataSent = true;

  const data = JSON.stringify({
    sessionId: getSessionId(),
    timestamp: Date.now()
  });

  navigator.sendBeacon('/api/track', data);
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    sendDataOnce();
  }
});

window.addEventListener('pagehide', sendDataOnce);
```

**Server-side deduplication:**
```javascript
// Include unique ID to deduplicate on server
const data = JSON.stringify({
  eventId: crypto.randomUUID(), // Unique per event
  sessionId: getSessionId(),
  timestamp: Date.now()
});

// Server can deduplicate based on eventId
```

### Mobile Considerations

**Key points:**
- `beforeunload` and `unload` are essentially non-functional on mobile
- `visibilitychange` is most reliable
- Mobile apps can be killed without any event firing
- Accept that some data loss is inevitable on mobile

**Mobile-specific implementation:**
```javascript
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  // On mobile, rely heavily on visibilitychange
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendData();
    }
  });

  // Also send data periodically (every 30 seconds)
  setInterval(sendData, 30000);
} else {
  // Desktop can use both events
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendData();
  });
  window.addEventListener('pagehide', sendData);
}
```

### Should You Show Confirmation Dialog?

**Short answer: Usually NO**

**When to show "Are you sure?" dialog:**
- ✅ User has unsaved form data
- ✅ User is in the middle of a complex workflow (e.g., multi-step checkout)
- ✅ Unsaved document/editor changes
- ✅ Active file upload in progress

**When NOT to show:**
- ❌ For analytics tracking
- ❌ To manipulate users into staying
- ❌ For marketing purposes
- ❌ Just to show ads or special offers

**How modern sites handle this:**

| Site | When They Show Dialog | When They Don't |
|------|----------------------|-----------------|
| Gmail | Composing unsaved email | Reading emails |
| Google Docs | Unsaved document changes | Viewing documents |
| Slack | Never (auto-saves everything) | N/A |
| Discord | Never (auto-saves everything) | N/A |
| E-commerce | Incomplete checkout | Browsing products |

**Best practice for confirmation dialogs:**

1. **Only when user has invested effort:**
```javascript
let hasUnsavedChanges = false;

// Track user input
document.querySelector('form').addEventListener('input', () => {
  hasUnsavedChanges = true;
});

// Show warning only if unsaved
window.addEventListener('beforeunload', (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    // Modern browsers show generic message
    e.returnValue = ''; // Required for Chrome
  }
});

// Remove warning after save
document.querySelector('form').addEventListener('submit', () => {
  hasUnsavedChanges = false;
});
```

2. **Use helpful, user-centric copy:**
   - ✅ "Are you sure you want to leave without completing your purchase?"
   - ❌ "Are you sure you want to leave this page?"

3. **For our chatbot use case:**
   - **Don't show a dialog** - just send the data silently
   - User closing tab is a clear intent to leave
   - Showing dialog would be annoying, not helpful

---

## Section 5: Real-World Examples

### Google Analytics Implementation

Google Analytics uses `visibilitychange` with `sendBeacon` for maximum reliability.

**Their approach:**
```javascript
// Google Analytics pattern (simplified)
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    // Send analytics with beacon transport
    ga('send', 'event', {
      eventCategory: 'Session',
      eventAction: 'end',
      transport: 'beacon'
    });
  }
});
```

**Key implementation details:**
- Set `transport: 'beacon'` in event parameters
- gtag.js only uses sendBeacon when transport is explicitly set to 'beacon'
- Uses POST request instead of GET when beacon is used

**Google Tag Manager approach:**
```javascript
// GTM configuration
{
  'event': 'session_end',
  'transport': 'beacon'  // Ensures sendBeacon is used
}
```

**Documentation:**
- [Simo Ahava - Leverage useBeacon and beforeunload](https://www.simoahava.com/analytics/leverage-usebeacon-beforeunload-google-analytics/)
- [GTMTips - Fire Trigger When User About To Leave](https://www.simoahava.com/analytics/fire-trigger-when-user-about-to-leave-page/)

### Mixpanel Implementation

**Mixpanel added sendBeacon support in January 2020.**

**Recommended pattern:**
```javascript
// Mixpanel pattern
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    mixpanel.track('Page closed', {
      // Event properties
      page: window.location.pathname,
      duration: getSessionDuration()
    }, {
      transport: 'sendBeacon'  // Important!
    });
  }
});
```

**Important notes:**
- Must specify `{transport: 'sendBeacon'}` in options
- Does not fire tracking callback when using sendBeacon
- sendBeacon sends in background, no server response available

**GitHub references:**
- [Issue #184: Support sendBeacon](https://github.com/mixpanel/mixpanel-js/issues/184)
- [Issue #250: Callback limitation](https://github.com/mixpanel/mixpanel-js/issues/250)

### Amplitude Implementation

**Amplitude provides two ways to handle page exit:**

**Option 1: Set transport to beacon at initialization**
```javascript
amplitude.init('API_KEY', null, {
  transport: 'beacon'
});
```

**Option 2: Set transport on page exit (recommended)**
```javascript
window.addEventListener('pagehide', () => {
  amplitude.setTransport('beacon');  // Switch to beacon
  amplitude.flush();                  // Send queued events
});
```

**Important caveat from Amplitude docs:**
> sendBeacon sends events in the background. Events dispatched by sendBeacon don't return server responses. Requests are not retried, including failed requests with 4xx or 5xx responses, so events may be lost.

**Documentation:**
- [Amplitude Browser SDK](https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2)
- [Race condition discussion](https://community.amplitude.com/data-instrumentation-57/race-condition-between-event-and-new-page-load-javascript-sdk-1080)

### Chat Applications

**Microsoft BotFramework WebChat:**

Sends end event on unload:
```javascript
// Dispatch bot activity on page unload
window.addEventListener('beforeunload', () => {
  window.WebChat.store.dispatch({
    type: 'WEB_CHAT/SEND_MESSAGE',
    payload: {
      text: '/end'  // Send end command
    }
  });
});
```

**Reference:** [Issue #3158](https://github.com/microsoft/BotFramework-WebChat/issues/3158)

**Atmosphere Framework (WebSocket chat):**

For WebSocket-based chat apps:
```javascript
// Unsubscribe pattern for WebSocket connections
window.addEventListener('beforeunload', function() {
  // Send unsubscribe message
  socket.send(JSON.stringify({
    action: 'unsubscribe',
    sessionId: sessionId
  }));

  // Close connection gracefully
  socket.close();
});
```

**Reference:** [Atmosphere Wiki](https://github.com/Atmosphere/atmosphere/wiki/Logic-for-application-that-want-use-beforeunload-event-for-unsubscribing)

### Session Recording Tools (FullStory, LogRocket)

While specific implementations are proprietary, these tools follow similar patterns:

**Common approach:**
1. Buffer events in memory
2. Periodically flush to server (every 30 seconds)
3. On `visibilitychange` (hidden), flush immediately with beacon
4. Use compression to stay under 64KB limit
5. Accept some data loss (typically 5-10%)

**Pattern they use:**
```javascript
let eventBuffer = [];

// Buffer events
function trackEvent(event) {
  eventBuffer.push(event);

  // Flush if buffer getting large
  if (eventBuffer.length > 100) {
    flushEvents();
  }
}

// Periodic flush (every 30 seconds)
setInterval(flushEvents, 30000);

// Flush on visibility change
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    flushEvents(true); // Force beacon usage
  }
});

function flushEvents(useBeacon = false) {
  if (eventBuffer.length === 0) return;

  const data = JSON.stringify(eventBuffer);

  if (useBeacon) {
    navigator.sendBeacon('/api/events', data);
  } else {
    fetch('/api/events', {
      method: 'POST',
      body: data,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  eventBuffer = [];
}
```

### GitHub Code Examples

**Comprehensive test example:**
- [bahmutov/onbeforeunload-example](https://github.com/bahmutov/onbeforeunload-example) - Cypress tests for beforeunload

**Simple examples:**
- [Simple beforeunload](https://gustavnikolaj.github.io/before-unload/examples/simple/) - Interactive demo

**Production examples:**
Search GitHub for:
- `navigator.sendBeacon visibilitychange` - Real implementations
- `pagehide beacon` - Various patterns
- `analytics unload` - Analytics patterns

---

## Section 6: Code Template

### Production-Ready Implementation

```typescript
/**
 * Reliable Page Unload Handler with sendBeacon
 *
 * Features:
 * - Uses visibilitychange (primary) + pagehide (fallback)
 * - Prevents duplicate sends
 * - Handles mobile browsers
 * - Size limit checking
 * - Graceful fallback to fetch with keepalive
 * - TypeScript type safety
 */

interface BeaconPayload {
  sessionId: string;
  timestamp: number;
  leadQualified: boolean;
  conversationId?: string;
  [key: string]: any;
}

class UnloadBeaconHandler {
  private beaconSent: boolean = false;
  private readonly endpoint: string;
  private readonly maxPayloadSize: number = 60000; // Leave buffer before 64KB

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.setupListeners();
  }

  private setupListeners(): void {
    // Primary: visibilitychange (most reliable)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendBeacon();
      }
    });

    // Fallback: pagehide (for older browsers or edge cases)
    window.addEventListener('pagehide', () => {
      this.sendBeacon();
    });
  }

  /**
   * Send beacon with duplicate prevention
   */
  private sendBeacon(): void {
    if (this.beaconSent) {
      return; // Already sent
    }

    const payload = this.collectData();
    const success = this.sendData(payload);

    if (success) {
      this.beaconSent = true;
    }
  }

  /**
   * Collect data to send
   */
  private collectData(): BeaconPayload {
    return {
      sessionId: this.getSessionId(),
      timestamp: Date.now(),
      leadQualified: this.isLeadQualified(),
      conversationId: this.getConversationId(),
      userAgent: navigator.userAgent,
      pageUrl: window.location.href
    };
  }

  /**
   * Send data with size checking and fallback
   */
  private sendData(payload: BeaconPayload): boolean {
    const data = JSON.stringify(payload);

    // Check size limit
    if (data.length > this.maxPayloadSize) {
      console.warn('Payload too large, sending essential data only');
      return this.sendEssentialData(payload);
    }

    // Try sendBeacon first
    if (this.trySendBeacon(data)) {
      return true;
    }

    // Fallback to fetch with keepalive
    return this.tryFetchKeepAlive(data);
  }

  /**
   * Attempt to send with navigator.sendBeacon
   */
  private trySendBeacon(data: string): boolean {
    if (!navigator.sendBeacon) {
      return false; // API not available
    }

    const blob = new Blob([data], { type: 'application/json' });
    const success = navigator.sendBeacon(this.endpoint, blob);

    if (success) {
      console.log('Beacon sent successfully');
    } else {
      console.warn('sendBeacon failed (queue full or size limit)');
    }

    return success;
  }

  /**
   * Fallback: fetch with keepalive
   */
  private tryFetchKeepAlive(data: string): boolean {
    if (!('fetch' in window)) {
      return false; // Fetch not available
    }

    try {
      fetch(this.endpoint, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json'
        },
        keepalive: true
      }).catch((error) => {
        // Page likely unloaded, can't handle error
        console.error('Fetch keepalive failed:', error);
      });

      return true; // Queued (may or may not succeed)
    } catch (error) {
      console.error('Fetch keepalive error:', error);
      return false;
    }
  }

  /**
   * Send only essential data if payload too large
   */
  private sendEssentialData(payload: BeaconPayload): boolean {
    const essentialPayload = {
      sessionId: payload.sessionId,
      timestamp: payload.timestamp,
      leadQualified: payload.leadQualified
    };

    const data = JSON.stringify(essentialPayload);
    return this.trySendBeacon(data) || this.tryFetchKeepAlive(data);
  }

  /**
   * Public method to manually trigger send (e.g., on user action)
   */
  public sendNow(): void {
    this.sendBeacon();
  }

  /**
   * Reset the sent flag (e.g., for testing or new session)
   */
  public reset(): void {
    this.beaconSent = false;
  }

  // Placeholder methods - implement based on your app
  private getSessionId(): string {
    return sessionStorage.getItem('sessionId') || 'unknown';
  }

  private getConversationId(): string | undefined {
    return sessionStorage.getItem('conversationId') || undefined;
  }

  private isLeadQualified(): boolean {
    return sessionStorage.getItem('leadQualified') === 'true';
  }
}

// Usage
const beaconHandler = new UnloadBeaconHandler('/api/session-end');

// Optional: Manually trigger send on specific user action
document.getElementById('endChat')?.addEventListener('click', () => {
  beaconHandler.sendNow();
});

export default UnloadBeaconHandler;
```

### React Hook Version

```typescript
import { useEffect, useRef } from 'react';

interface UseUnloadBeaconOptions {
  endpoint: string;
  getData: () => Record<string, any>;
  enabled?: boolean;
}

/**
 * React hook for sending beacon on page unload
 *
 * @example
 * useUnloadBeacon({
 *   endpoint: '/api/session-end',
 *   getData: () => ({
 *     sessionId: sessionId,
 *     leadQualified: isQualified
 *   }),
 *   enabled: conversationActive
 * });
 */
export function useUnloadBeacon({
  endpoint,
  getData,
  enabled = true
}: UseUnloadBeaconOptions) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const sendBeacon = () => {
      if (sentRef.current) return;

      const data = getData();
      const payload = JSON.stringify(data);

      // Try sendBeacon
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        if (navigator.sendBeacon(endpoint, blob)) {
          sentRef.current = true;
          return;
        }
      }

      // Fallback to fetch with keepalive
      fetch(endpoint, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      }).catch(() => {
        // Page likely unloaded
      });

      sentRef.current = true;
    };

    // visibilitychange listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendBeacon();
      }
    };

    // pagehide listener
    const handlePageHide = () => {
      sendBeacon();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [endpoint, getData, enabled]);

  // Return manual trigger function
  return {
    sendNow: () => {
      const data = getData();
      const payload = JSON.stringify(data);
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(endpoint, blob);
      }
    }
  };
}
```

### Simplified Vanilla JavaScript Version

```javascript
/**
 * Simple, production-ready beacon sender
 * Copy-paste ready for most use cases
 */

(function() {
  let sent = false;

  function sendData() {
    if (sent) return;
    sent = true;

    // Collect your data here
    const data = JSON.stringify({
      sessionId: sessionStorage.getItem('sessionId'),
      timestamp: Date.now(),
      // Add your data here
    });

    // Try sendBeacon
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/session-end', data);
      return;
    }

    // Fallback to fetch
    fetch('/api/session-end', {
      method: 'POST',
      body: data,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true
    }).catch(() => {});
  }

  // Listen to both events
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      sendData();
    }
  });

  window.addEventListener('pagehide', sendData);
})();
```

---

## Section 7: Testing Approach

### Manual Testing Steps

#### Test 1: Basic Functionality
1. Open DevTools → Network tab
2. Filter for your beacon endpoint (e.g., `/api/session-end`)
3. Load your page
4. Close the tab
5. **Expected:** Network request appears with status 200

#### Test 2: Tab Switch (visibilitychange)
1. Open DevTools → Network tab → preserve log
2. Load your page
3. Switch to another tab
4. **Expected:** Beacon request appears when tab becomes hidden

#### Test 3: Browser Back Button
1. Open DevTools → Network tab → preserve log
2. Navigate to your page from another page
3. Click browser back button
4. **Expected:** Beacon request appears (pagehide should fire)

#### Test 4: Page Refresh
1. Open DevTools → Network tab → preserve log
2. Load your page
3. Press F5 or click refresh
4. **Expected:** Beacon request appears before new page loads

#### Test 5: Navigation to New URL
1. Open DevTools → Network tab → preserve log
2. Load your page
3. Click a link to navigate away
4. **Expected:** Beacon request appears before navigation

#### Test 6: Mobile Browsers

**iOS Safari:**
1. Open page on iPhone/iPad
2. Switch to another app (home button)
3. Re-open Safari → check server logs
4. **Expected:** Beacon was sent when app backgrounded

**Android Chrome:**
1. Open page on Android
2. Switch to another app
3. Re-open Chrome → check server logs
4. **Expected:** Beacon was sent (visibilitychange)

#### Test 7: Size Limit
1. Modify payload to be > 64KB
2. Check console for warnings
3. **Expected:** sendBeacon returns false, fallback triggered

### Automated Testing (Challenging)

#### Cypress Testing

**Problem:** Cypress runs in the same execution context, making unload events tricky.

**Solution 1: Remove event listener in test**
```javascript
// In your test
cy.visit('/page');

// Remove beforeunload listener if present
cy.window().then(win => {
  win.removeEventListener('beforeunload', win.myUnloadHandler);
});

// Now navigate away
cy.visit('/other-page');
```

**Solution 2: Spy on sendBeacon**
```javascript
// In your test
cy.visit('/page');

// Spy on sendBeacon
cy.window().then(win => {
  cy.spy(win.navigator, 'sendBeacon').as('beaconSpy');
});

// Trigger visibility change
cy.document().trigger('visibilitychange', {
  target: { visibilityState: 'hidden' }
});

// Assert beacon was called
cy.get('@beaconSpy').should('have.been.calledOnce');
```

**Solution 3: Mock and verify**
```javascript
describe('Unload beacon', () => {
  it('sends beacon on visibility change', () => {
    cy.visit('/chatbot');

    // Mock sendBeacon
    cy.window().then((win) => {
      cy.stub(win.navigator, 'sendBeacon').returns(true).as('sendBeacon');
    });

    // Simulate visibility change
    cy.window().then((win) => {
      Object.defineProperty(win.document, 'visibilityState', {
        value: 'hidden',
        writable: true
      });
      win.document.dispatchEvent(new Event('visibilitychange'));
    });

    // Verify
    cy.get('@sendBeacon').should('have.been.calledWith',
      '/api/session-end',
      Cypress.sinon.match.any
    );
  });
});
```

**Reference:** [bahmutov/onbeforeunload-example](https://github.com/bahmutov/onbeforeunload-example)

#### Playwright Testing

Playwright has better support for page lifecycle events.

```javascript
// Playwright test
import { test, expect } from '@playwright/test';

test('sends beacon on page close', async ({ page, context }) => {
  // Listen for requests
  const requests = [];
  page.on('request', request => {
    if (request.url().includes('/api/session-end')) {
      requests.push(request);
    }
  });

  await page.goto('/chatbot');

  // Close page (triggers pagehide)
  await page.close();

  // Verify beacon was sent
  expect(requests.length).toBe(1);
  expect(requests[0].method()).toBe('POST');
});

test('sends beacon on visibility change', async ({ page }) => {
  await page.goto('/chatbot');

  // Mock sendBeacon
  const beaconCalls = [];
  await page.evaluate(() => {
    const original = navigator.sendBeacon;
    navigator.sendBeacon = function(...args) {
      window.__beaconCalls = window.__beaconCalls || [];
      window.__beaconCalls.push(args);
      return true;
    };
  });

  // Trigger visibility change
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  // Check if beacon was called
  const calls = await page.evaluate(() => window.__beaconCalls);
  expect(calls.length).toBeGreaterThan(0);
  expect(calls[0][0]).toContain('/api/session-end');
});
```

### Browser Compatibility Testing

#### Test Matrix

| Browser | Version | OS | visibilitychange | pagehide | sendBeacon | Notes |
|---------|---------|----|--------------------|----------|------------|-------|
| Chrome | Latest | macOS | ✅ | ✅ | ✅ | Full support |
| Chrome | Latest | Windows | ✅ | ✅ | ✅ | Full support |
| Chrome | Latest | Android | ✅ | ⚠️ | ✅ | pagehide unreliable |
| Firefox | Latest | macOS | ✅ | ✅ | ✅ | Full support |
| Firefox | Latest | Windows | ✅ | ✅ | ✅ | Full support |
| Firefox | Latest | Android | ✅ | ⚠️ | ✅ | pagehide unreliable |
| Safari | Latest | macOS | ✅ | ✅ | ✅ | Full support |
| Safari | Latest | iOS | ✅ | ⚠️ | ✅ | beforeunload doesn't work |
| Edge | Latest | Windows | ✅ | ✅ | ✅ | Full support |

#### Using BrowserStack/Sauce Labs

```javascript
// Example configuration for cross-browser testing
const browsers = [
  { browserName: 'chrome', version: 'latest' },
  { browserName: 'firefox', version: 'latest' },
  { browserName: 'safari', version: 'latest' },
  { browserName: 'edge', version: 'latest' },
  { browserName: 'chrome', platform: 'android' },
  { browserName: 'safari', platform: 'iOS' }
];

browsers.forEach(browser => {
  test(`Beacon works on ${browser.browserName}`, async () => {
    // Test implementation
  });
});
```

### Server-Side Verification

**Track beacon delivery rate:**

```javascript
// Server-side (Node.js/Express example)
const beaconStats = {
  sent: 0,
  received: 0
};

// Endpoint for beacon
app.post('/api/session-end', (req, res) => {
  beaconStats.received++;

  // Log for analysis
  console.log('Beacon received:', {
    sessionId: req.body.sessionId,
    userAgent: req.headers['user-agent'],
    timestamp: new Date()
  });

  res.sendStatus(200);
});

// Endpoint for stats
app.get('/api/beacon-stats', (req, res) => {
  res.json({
    ...beaconStats,
    deliveryRate: beaconStats.sent > 0
      ? (beaconStats.received / beaconStats.sent * 100).toFixed(2) + '%'
      : 'N/A'
  });
});
```

**Track by user agent to identify problem browsers:**

```javascript
const deliveryByBrowser = {};

app.post('/api/session-end', (req, res) => {
  const ua = req.headers['user-agent'];
  const browser = detectBrowser(ua); // Use ua-parser-js or similar

  if (!deliveryByBrowser[browser]) {
    deliveryByBrowser[browser] = { received: 0, failed: 0 };
  }

  deliveryByBrowser[browser].received++;

  res.sendStatus(200);
});
```

### Testing Tools

1. **Chrome DevTools Application Tab**
   - Test back/forward cache
   - See which events fire
   - Monitor beacon requests

2. **Network Tab with "Preserve Log"**
   - Essential for seeing requests after navigation
   - Filter by your endpoint URL
   - Check request payload

3. **Console Logging**
   ```javascript
   document.addEventListener('visibilitychange', () => {
     console.log('visibilitychange fired, state:', document.visibilityState);
   });

   window.addEventListener('pagehide', () => {
     console.log('pagehide fired');
   });
   ```

4. **Chrome Flags for Testing**
   - `chrome://flags/#back-forward-cache` - Enable/disable bfcache
   - Useful for testing different scenarios

### Debugging Checklist

When beacon isn't working:

- [ ] Check browser console for errors
- [ ] Verify endpoint URL is correct
- [ ] Check Network tab with "Preserve log" enabled
- [ ] Verify payload size < 64KB
- [ ] Test in different browser
- [ ] Check server logs for receipt
- [ ] Verify CORS headers if cross-origin
- [ ] Test on mobile device (not just mobile emulation)
- [ ] Check if ad blocker is interfering
- [ ] Verify content-type is supported by server

---

## Additional Resources

### Official Documentation

- **MDN - Navigator.sendBeacon():** https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
- **MDN - Page Visibility API:** https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
- **MDN - Window: pagehide event:** https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
- **MDN - Window: beforeunload event:** https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
- **Chrome - Page Lifecycle API:** https://developer.chrome.com/docs/web-platform/page-lifecycle-api
- **Chrome - Deprecating unload:** https://developer.chrome.com/docs/web-platform/deprecating-unload
- **web.dev - Back/forward cache:** https://web.dev/articles/bfcache

### Research & Analysis

- **NicJ - Beaconing in Practice:** https://nicj.net/beaconing-in-practice/
- **NicJ - Pending Beacon API Update:** https://nicj.net/beaconing-in-practice-an-update-on-reliability-and-the-pending-beacon-api/
- **Speed Kit - Unload Beacon Reliability:** https://www.speedkit.com/blog/unload-beacon-reliability-benchmarking-strategies-for-minimal-data-loss
- **Request Metrics - Using Beacon API:** https://requestmetrics.com/building/using-the-beacon-api

### Browser Implementation Details

- **W3C Beacon Spec:** https://github.com/w3c/beacon
- **WICG Pending Beacon:** https://github.com/WICG/pending-beacon
- **Page Visibility Spec Issues:** https://github.com/w3c/page-visibility/issues/39
- **HTML Spec - Unload:** https://github.com/whatwg/html/issues/3957

### Testing Resources

- **Cypress - beforeunload example:** https://github.com/bahmutov/onbeforeunload-example
- **Gleb Bahmutov - onbeforeunload testing:** https://glebbahmutov.com/blog/onbeforeunload/
- **Playwright - Page Lifecycle:** https://playwright.dev/

### Analytics Implementation Guides

- **Simo Ahava - Leverage useBeacon:** https://www.simoahava.com/analytics/leverage-usebeacon-beforeunload-google-analytics/
- **Simo Ahava - GTM Leave Trigger:** https://www.simoahava.com/analytics/fire-trigger-when-user-about-to-leave-page/
- **Mixpanel GitHub:** https://github.com/mixpanel/mixpanel-js
- **Amplitude Docs:** https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2

### Blog Posts & Tutorials

- **Don't lose user state - Page Visibility:** https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/
- **Safari vs Chrome - Page Close Events:** https://medium.com/preprintblog/understanding-browser-differences-in-handling-page-close-events-a-focus-on-safari-vs-chrome-154235e47782
- **64KB Limitation Analysis:** https://blog.huli.tw/2025/01/06/en/navigator-sendbeacon-64kib-and-source-code/

---

## Summary & Recommendations

### For Our Chatbot Use Case

**Recommended Implementation:**

1. **Events to Use:**
   - ✅ `visibilitychange` (primary)
   - ✅ `pagehide` (fallback)
   - ❌ Do NOT use `beforeunload` (unreliable, breaks bfcache)
   - ❌ Do NOT use `unload` (deprecated)

2. **API to Use:**
   - ✅ `navigator.sendBeacon` (primary)
   - ✅ `fetch` with `keepalive` (fallback)

3. **Data to Send:**
   ```json
   {
     "sessionId": "abc123",
     "conversationId": "conv456",
     "leadQualified": true,
     "timestamp": 1234567890,
     "messages": 5,
     "duration": 120
   }
   ```

4. **Implementation Pattern:**
   - Use the TypeScript class or React hook from Section 6
   - Prevent duplicate sends with boolean flag
   - Check payload size before sending
   - Do NOT show "are you sure?" dialog
   - Accept 5-10% data loss as inevitable

5. **Testing:**
   - Manual testing in Chrome, Firefox, Safari
   - Mobile testing on actual devices
   - Server-side tracking of delivery rate
   - Mock sendBeacon in automated tests

6. **Expected Results:**
   - 90-95% delivery rate on desktop
   - 85-90% delivery rate on mobile
   - Higher reliability than alternatives

### Key Takeaways

1. **Reliability:** No solution is 100% reliable. Expect 5-10% data loss.

2. **Events Matter More Than API:** Using the right events (visibilitychange + pagehide) is more important than which sending API you use.

3. **Mobile is Different:** Mobile browsers are less reliable. Accept this reality and design accordingly.

4. **Don't Fight the Browser:** Work with browser optimizations (bfcache) rather than against them.

5. **Keep it Simple:** The production-ready code template in Section 6 is all you need for most cases.

6. **Test Thoroughly:** Manual testing across browsers is essential. Automated testing is challenging but possible.

---

**Document Version:** 1.0
**Last Updated:** October 2024
**Maintained by:** AR Automation Development Team