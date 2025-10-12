# Max Chatbot - Technical Documentation

**Version:** 1.0
**Last Updated:** October 2024
**Status:** Active Development

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Current Implementation](#current-implementation)
  - [Frontend Component](#frontend-component)
  - [Backend Agent](#backend-agent)
  - [Database Schema](#database-schema)
  - [Lead Qualification Flow](#lead-qualification-flow)
- [Technical Components](#technical-components)
- [Current Gaps & Limitations](#current-gaps--limitations)
- [Future Development Options](#future-development-options)
  - [Option 1: Prompt-Based Sequencing](#option-1-prompt-based-sequencing)
  - [Option 2: RAG-Based Pipeline](#option-2-rag-based-pipeline)
- [Next Steps](#next-steps)

---

## Overview

**Max** is an AI-powered lead qualification chatbot for AR Automation. It engages potential clients in natural conversation to:
1. Understand their automation needs
2. Identify their industry vertical
3. Assess business impact potential
4. Collect contact information
5. Qualify them as leads for the sales team

**Technology Stack:**
- **Frontend:** React + TypeScript + Vite
- **Backend:** FastAPI + Python
- **AI Framework:** LangChain + LangGraph
- **LLM:** OpenAI GPT-4o-mini
- **Database:** PostgreSQL
- **Hosting:** Docker containers

---

## Architecture

### System Diagram

```
┌──────────────┐
│   Browser    │
│ (localhost)  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Frontend (React)                       │
│  - InlineChatbot.tsx                    │
│  - Manages UI state                     │
│  - Sends messages to backend            │
│  Port 3000                              │
└──────┬──────────────────────────────────┘
       │ POST /api/chat
       ▼
┌─────────────────────────────────────────┐
│  Backend (FastAPI)                      │
│  - main.py (API endpoints)              │
│  - langgraph_agent.py (AI logic)        │
│  Port 8000                              │
└──────┬──────────────┬───────────────────┘
       │              │
       ▼              ▼
┌─────────────┐  ┌──────────────────┐
│  PostgreSQL │  │  OpenAI API      │
│  - convos   │  │  GPT-4o-mini     │
│  - messages │  │                  │
│  - leads    │  │                  │
└─────────────┘  └──────────────────┘
```

### Data Flow

```
User types message
    ↓
Frontend: InlineChatbot.tsx
    ↓
POST /api/chat {sessionId, message, language}
    ↓
Backend: main.py:chat()
    ↓
1. Get/create conversation in DB
2. Save user message to DB
3. Retrieve conversation history
    ↓
LangGraph Agent: langgraph_agent.py
    ↓
1. Apply system prompt (language-specific)
2. Include conversation history
3. Send to OpenAI GPT-4o-mini
    ↓
OpenAI returns AI response
    ↓
Backend: main.py
    ↓
1. Save AI response to DB
2. Check for "LEAD_QUALIFIED" signal
3. If qualified: Extract lead data & save to leads table
    ↓
Return response to frontend
    ↓
Frontend displays message
```

---

## Current Implementation

### Frontend Component

**File:** `frontend/src/components/InlineChatbot.tsx`

**Key Functions:**

#### `generateSessionId()`
- Creates unique session identifier for each chat instance
- Format: `session_${timestamp}_${random}`
- Persists for the browser session

#### `handleSend()`
- **Purpose:** Send user message to backend
- **Process:**
  1. Validates input (non-empty, not loading)
  2. Adds user message to local state
  3. Calls `apiRequest('POST', '/api/chat', {...})`
  4. Parses response and adds AI message to state
  5. Handles errors with fallback message

**State Management:**
- `sessionId` - Unique chat session identifier
- `messages` - Array of `{role, content}` objects
- `input` - Current user input text
- `isLoading` - Loading state for API calls

**UI Features:**
- Multi-language support (EN/DE via i18next)
- Message history display
- Loading indicator with "thinking" animation
- Responsive design
- Keyboard support (Enter to send)

---

### Backend Agent

**File:** `backend/app/langgraph_agent.py`

#### System Prompts

**English Prompt (`SYSTEM_PROMPTS["en"]`):**
```
You are Max, a friendly AI assistant for AR Automation.
Your job is to qualify leads through natural conversation.

Lead qualification flow:
1. First message: Greet - "Hi, I'm Max. What task would you love to have done automatically?"
2. Understand automation problem
3. Ask about industry (Accounting, E-commerce, Education)
4. Ask about desired solution and outcomes
5. Ask about business impact (time, cost, revenue)
6. Collect contact info: name, email, phone, company

Keep responses brief (1-2 sentences), friendly, conversational.

When you have all info, respond with "LEAD_QUALIFIED" + summary.
```

**German Prompt:** Same structure, translated to German.

#### LangGraph Structure

**State Definition:**
```python
class ConversationState(TypedDict):
    messages: Annotated[list, add_messages]  # Message history
    language: str                             # 'en' or 'de'
```

**Graph Nodes:**
1. **agent_node** - Main processing node
   - Applies language-specific system prompt
   - Includes conversation history
   - Invokes OpenAI GPT-4o-mini
   - Returns AI response

**Graph Flow:**
```python
START → agent → END
```

**Model Configuration:**
- Model: `gpt-4o-mini`
- Temperature: 0.7 (conversational, slightly creative)
- Context: System prompt + full conversation history

#### Lead Data Extraction

**Function:** `extract_lead_data(messages: list) -> dict`

**Extraction Methods:**
- **Email:** Regex pattern `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}`
- **Phone:** Regex pattern `(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}`
- **Vertical:** Regex search for `accounting|e-commerce|education|buchhaltung|bildung`
- **Problem:** First user message content

**Returns:**
```python
{
    "contact_email": str | None,
    "contact_phone": str | None,
    "vertical": str | None,
    "problem_description": str | None
}
```

---

### Database Schema

**File:** `backend/app/database.py`

#### Tables

**1. Conversations**
```sql
CREATE TABLE conversations (
    id VARCHAR PRIMARY KEY,
    session_id VARCHAR NOT NULL,
    vertical TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP
);
```

**Purpose:** Track chat sessions
- `session_id`: Links to frontend session
- `vertical`: Industry identified (accounting, ecommerce, education)
- `status`: 'active' | 'qualified' | 'abandoned'

**2. Messages**
```sql
CREATE TABLE messages (
    id VARCHAR PRIMARY KEY,
    conversation_id VARCHAR NOT NULL,
    role TEXT NOT NULL,           -- 'user' | 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP
);
```

**Purpose:** Store all conversation messages
- Maintains conversation history
- Used for context in subsequent AI responses
- Chronologically ordered

**3. Leads**
```sql
CREATE TABLE leads (
    id VARCHAR PRIMARY KEY,
    conversation_id VARCHAR NOT NULL,
    vertical TEXT,
    problem_description TEXT,
    desired_solution TEXT,
    business_impact TEXT,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    company_name TEXT,
    additional_info JSON,
    status TEXT DEFAULT 'new',    -- 'new' | 'contacted' | 'qualified' | 'converted'
    created_at TIMESTAMP
);
```

**Purpose:** Store qualified lead information
- Created when AI detects "LEAD_QUALIFIED"
- Links back to conversation for full context
- Contains all collected contact details

---

### Lead Qualification Flow

**File:** `backend/app/main.py:chat()`

#### Current Sequence

**Step 1: Conversation Initialization**
```python
# Line 108-121
conversation = db.query(Conversation).filter(
    Conversation.session_id == chat_request.session_id
).first()

if not conversation:
    # Create new conversation
    conversation = Conversation(
        id=str(uuid.uuid4()),
        session_id=chat_request.session_id,
        status='active',
        created_at=datetime.utcnow()
    )
    db.add(conversation)
    db.commit()
```

**Step 2: Message Storage**
```python
# Line 124-132
user_message = Message(
    id=str(uuid.uuid4()),
    conversation_id=conversation.id,
    role='user',
    content=chat_request.message,
    created_at=datetime.utcnow()
)
db.add(user_message)
db.commit()
```

**Step 3: Context Retrieval**
```python
# Line 135-145
previous_messages = db.query(Message).filter(
    Message.conversation_id == conversation.id
).order_by(Message.created_at.asc()).all()

messages_for_graph = [
    HumanMessage(content=msg.content) if msg.role == 'user'
    else AIMessage(content=msg.content)
    for msg in previous_messages
]
```

**Step 4: AI Processing**
```python
# Line 148-154
result = conversation_graph.invoke({
    "messages": messages_for_graph,
    "language": chat_request.language or "en"
})

ai_content = result["messages"][-1].content
```

**Step 5: Response Storage**
```python
# Line 157-165
ai_message = Message(
    id=str(uuid.uuid4()),
    conversation_id=conversation.id,
    role='assistant',
    content=ai_content,
    created_at=datetime.utcnow()
)
db.add(ai_message)
db.commit()
```

**Step 6: Lead Qualification Check**
```python
# Line 168-202
if "LEAD_QUALIFIED" in ai_content:
    # Extract lead data from conversation
    all_messages = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).all()

    messages_dict = [
        {"role": msg.role, "content": msg.content}
        for msg in all_messages
    ]

    lead_data = extract_lead_data(messages_dict)

    # Check if lead already exists
    existing_lead = db.query(Lead).filter(
        Lead.conversation_id == conversation.id
    ).first()

    if not existing_lead:
        # Create new lead
        lead = Lead(
            id=str(uuid.uuid4()),
            conversation_id=conversation.id,
            vertical=lead_data.get("vertical"),
            problem_description=lead_data.get("problem_description"),
            contact_email=lead_data.get("contact_email"),
            contact_phone=lead_data.get("contact_phone"),
            status='new',
            created_at=datetime.utcnow()
        )
        db.add(lead)

        # Update conversation status
        conversation.status = 'qualified'
        db.commit()
```

#### Qualification Criteria

The AI determines qualification based on system prompt instructions:
1. ✅ Problem/pain point identified
2. ✅ Industry vertical known
3. ✅ Business impact discussed
4. ✅ Contact information collected (email, phone, name, company)

When all criteria met → AI responds with `"LEAD_QUALIFIED"` prefix

---

## Technical Components

### 1. Session Management
- **Frontend:** Generates `session_${timestamp}_${random}`
- **Backend:** Maps session to conversation ID
- **Persistence:** Session exists until browser reload
- **Future:** Could implement session persistence in localStorage

### 2. Multi-Language Support
- **Frontend:** i18next for UI translations
- **Backend:** Language-specific system prompts
- **Supported:** English (`en`), German (`de`)
- **Passed:** Via `language` parameter in API request

### 3. Context Management
- **Strategy:** Full conversation history passed to AI on each turn
- **Storage:** All messages stored in PostgreSQL
- **Ordering:** Chronological (oldest to newest)
- **Limitation:** No context window management (could hit token limits on long conversations)

### 4. Error Handling
- **Frontend:** Try-catch with fallback error message
- **Backend:** HTTP exceptions with rollback on DB errors
- **AI Failures:** Returns generic error to user

---

## Current Gaps & Limitations

### 1. No RAG (Retrieval-Augmented Generation)

**Status:** ❌ Not Implemented

**Issue:** Chatbot cannot access external knowledge bases

**Impact:**
- Cannot reference brand story documents in `.claude/artifacts/create_brand_story/`
- Cannot provide industry-specific expertise for:
  - Accounting automation best practices
  - E-commerce workflow recommendations
  - Education sector solutions
- Relies solely on GPT-4o-mini's general knowledge
- Responses may lack AR Automation's specific methodology/approach

**Files Available But Not Used:**
```
.claude/artifacts/create_brand_story/
├── accounting-automation-brand-script.md        (21KB)
├── accounting-automation-landing-page-copy.md  (14KB)
├── ecommerce-brandscript.md                     (31KB)
├── ecommerce-marketing-copy.md                  (4KB)
├── educational_institutions_brandscript.md     (17KB)
└── educational_institutions_landing_page.md    (12KB)
```

**What's Missing:**
- Vector database (Pinecone, Weaviate, Chroma, etc.)
- Embedding generation for brand documents
- RAG retrieval logic in LangGraph agent
- Semantic search to find relevant context

### 2. Hardcoded Conversation Flow

**Status:** ⚠️ Partially Implemented

**Issue:** Sales funnel sequence is embedded in system prompt

**Current Approach:**
- Qualification steps defined in `SYSTEM_PROMPTS` string
- AI decides when to move through stages
- No explicit state machine or stage tracking

**Limitations:**
- Hard to modify conversation flow without code changes
- No analytics on which stage users drop off
- Cannot A/B test different qualification sequences
- Difficult to ensure consistency across conversations

**Current Flow (from system prompt):**
```
1. Greeting
2. Problem discovery
3. Industry identification
4. Solution discussion
5. Business impact
6. Contact collection
```

### 3. Simple Lead Extraction

**Status:** ⚠️ Basic Regex Implementation

**Issue:** Uses regex patterns to extract structured data

**Current Logic:** `extract_lead_data()` function
- Email: `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}`
- Phone: `(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}`
- Vertical: Keyword search for `accounting|e-commerce|education`

**Limitations:**
- May miss contact info if formatted differently
- Cannot extract name, company (not implemented)
- No validation or confidence scoring
- Single-language patterns (English bias)

**Better Approach:**
- Use LLM for structured extraction
- LangChain's output parsers
- Pydantic validation
- Multi-language support

### 4. No Conversation Analytics

**Status:** ❌ Not Implemented

**Missing:**
- Conversion rate tracking
- Average messages to qualification
- Drop-off stage analysis
- Response time metrics
- Sentiment analysis

### 5. Limited Error Recovery

**Status:** ⚠️ Basic Implementation

**Issues:**
- If AI misunderstands, hard to reset context
- No conversation repair strategies
- No clarification requests
- Cannot backtrack or correct information

---

## Future Development Options

### Architecture Decision: Conversation Flow Management

We have two primary architectural options for improving the chatbot's conversation management:

---

### Option 1: Prompt-Based Sequencing

#### Concept
Use enhanced system prompts and few-shot examples to guide the AI through the sales funnel, without external knowledge bases.

#### Implementation Approach

**Enhanced System Prompt Structure:**
```python
ENHANCED_SYSTEM_PROMPT = """
You are Max, AR Automation's lead qualification specialist.

CONVERSATION STAGES:
1. GREETING: "Hi, I'm Max. What task would you love automated?"
2. DISCOVERY: Understand their pain point (ask clarifying questions)
3. VERTICAL: Identify industry (Accounting, E-commerce, Education)
4. IMPACT: Assess business impact (time, cost, revenue)
5. CONTACT: Collect name, email, phone, company
6. QUALIFICATION: Summarize and mark as LEAD_QUALIFIED

RULES:
- Only advance stages when you have clear answers
- Ask ONE question at a time
- Keep responses under 2 sentences
- Use their language (formal/informal)

STAGE TRANSITIONS:
- GREETING → DISCOVERY: After initial pain point mentioned
- DISCOVERY → VERTICAL: After understanding core problem
- VERTICAL → IMPACT: After industry confirmed
- IMPACT → CONTACT: After business value established
- CONTACT → QUALIFICATION: After all contact info collected

EXAMPLES:
[Few-shot examples of successful conversations]
"""
```

**State Tracking in LangGraph:**
```python
class ConversationState(TypedDict):
    messages: Annotated[list, add_messages]
    language: str
    current_stage: str  # NEW: track conversation stage
    collected_data: dict  # NEW: track what info we have
```

**Stage Detection Node:**
```python
def detect_stage(state: ConversationState):
    """Analyze conversation to determine current stage"""
    llm = get_llm()

    prompt = f"""
    Analyze this conversation and determine the stage:
    {state['messages']}

    Stages: GREETING, DISCOVERY, VERTICAL, IMPACT, CONTACT, QUALIFICATION

    Return: {{"stage": "...", "collected_data": {{...}} }}
    """

    result = llm.invoke(prompt)
    return {
        "current_stage": result.stage,
        "collected_data": result.collected_data
    }
```

**Enhanced LangGraph Workflow:**
```python
workflow = StateGraph(ConversationState)

workflow.add_node("detect_stage", detect_stage)
workflow.add_node("agent", agent_node)
workflow.add_node("validate_data", validate_collected_data)

workflow.add_edge(START, "detect_stage")
workflow.add_edge("detect_stage", "agent")
workflow.add_edge("agent", "validate_data")
workflow.add_conditional_edges(
    "validate_data",
    lambda state: "qualified" if state["current_stage"] == "QUALIFICATION" else "continue",
    {
        "qualified": END,
        "continue": "detect_stage"
    }
)
```

#### Pros
✅ No external dependencies (no vector DB needed)
✅ Faster to implement
✅ Lower infrastructure costs
✅ Easier to debug (all logic in code)
✅ Faster response times (no retrieval step)

#### Cons
❌ Limited domain knowledge (only GPT's general knowledge)
❌ Cannot reference specific AR Automation methodologies
❌ Harder to maintain (prompts in code)
❌ Cannot dynamically update conversation strategies
❌ Less flexible for A/B testing

#### Best For
- MVP / Early development
- When brand knowledge is stable
- Cost-sensitive deployments
- When simplicity is priority

---

### Option 2: RAG-Based Pipeline

#### Concept
Store conversation strategies, brand stories, and industry expertise in a vector database. Retrieve relevant context dynamically based on conversation state.

#### Implementation Approach

**Knowledge Base Structure:**
```
knowledge_base/
├── brand_stories/
│   ├── accounting_brand_story.md
│   ├── ecommerce_brand_story.md
│   └── education_brand_story.md
│
├── conversation_playbooks/
│   ├── qualification_funnel_v1.md     # Conversation stages & questions
│   ├── qualification_funnel_v2.md     # A/B test variant
│   ├── objection_handling.md          # Common objections & responses
│   └── industry_specific_questions.md
│
├── solution_catalog/
│   ├── accounting_automations.md      # What we offer for accounting
│   ├── ecommerce_automations.md
│   └── education_automations.md
│
└── sales_methodology/
    ├── discovery_framework.md         # How to uncover pain points
    ├── value_proposition.md           # AR Automation's unique value
    └── closing_techniques.md
```

**RAG Architecture:**
```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import MarkdownTextSplitter

# 1. Initialize vector store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

# 2. Index documents
def index_knowledge_base():
    splitter = MarkdownTextSplitter(chunk_size=1000, chunk_overlap=200)

    # Index brand stories
    for file in glob("knowledge_base/brand_stories/*.md"):
        docs = splitter.create_documents([open(file).read()])
        vectorstore.add_documents(docs, metadata={"type": "brand_story", "file": file})

    # Index conversation playbooks
    for file in glob("knowledge_base/conversation_playbooks/*.md"):
        docs = splitter.create_documents([open(file).read()])
        vectorstore.add_documents(docs, metadata={"type": "playbook", "file": file})

    # Index solution catalog
    for file in glob("knowledge_base/solution_catalog/*.md"):
        docs = splitter.create_documents([open(file).read()])
        vectorstore.add_documents(docs, metadata={"type": "solution", "file": file})

# 3. Retrieval function
def retrieve_context(query: str, vertical: str = None, context_type: str = None):
    """Retrieve relevant context from knowledge base"""

    filters = {}
    if vertical:
        filters["vertical"] = vertical
    if context_type:
        filters["type"] = context_type

    results = vectorstore.similarity_search(
        query,
        k=3,
        filter=filters
    )

    return "\n\n".join([doc.page_content for doc in results])
```

**Enhanced LangGraph with RAG:**
```python
class ConversationState(TypedDict):
    messages: Annotated[list, add_messages]
    language: str
    current_stage: str
    vertical: str | None
    retrieved_context: str  # NEW: RAG context

def rag_retrieval_node(state: ConversationState):
    """Retrieve relevant context based on conversation state"""

    # Determine what context to retrieve
    last_message = state["messages"][-1].content
    current_stage = state.get("current_stage", "GREETING")
    vertical = state.get("vertical")

    # Build retrieval query
    if current_stage == "GREETING":
        query = "greeting introduction first message"
        context_type = "playbook"
    elif current_stage == "DISCOVERY":
        query = f"discovery questions pain points {vertical or ''}"
        context_type = "playbook"
    elif current_stage == "VERTICAL":
        query = f"industry identification {vertical or ''} vertical"
        context_type = "playbook"
    elif current_stage == "IMPACT":
        query = f"business impact value proposition {vertical}"
        context_type = "solution"
    elif current_stage == "CONTACT":
        query = "contact information collection"
        context_type = "playbook"

    # Retrieve context
    context = retrieve_context(query, vertical=vertical, context_type=context_type)

    # Also get brand story for vertical if identified
    brand_context = ""
    if vertical:
        brand_context = retrieve_context(
            f"{vertical} brand story value proposition",
            vertical=vertical,
            context_type="brand_story"
        )

    return {
        "retrieved_context": f"{context}\n\n{brand_context}"
    }

def agent_with_rag(state: ConversationState):
    """Agent node that uses RAG context"""
    llm = get_llm()

    system_prompt = f"""
    You are Max, AR Automation's AI assistant.

    Use this context to inform your responses:
    {state.get('retrieved_context', '')}

    Current stage: {state.get('current_stage', 'GREETING')}
    Vertical: {state.get('vertical', 'Unknown')}

    Keep responses brief (1-2 sentences), conversational, and on-brand.
    """

    messages_with_context = [
        SystemMessage(content=system_prompt)
    ] + state["messages"]

    response = llm.invoke(messages_with_context)
    return {"messages": [response]}

# Build workflow
workflow = StateGraph(ConversationState)

workflow.add_node("detect_stage", detect_stage_node)
workflow.add_node("rag_retrieval", rag_retrieval_node)
workflow.add_node("agent", agent_with_rag)
workflow.add_node("validate", validate_data_node)

workflow.add_edge(START, "detect_stage")
workflow.add_edge("detect_stage", "rag_retrieval")
workflow.add_edge("rag_retrieval", "agent")
workflow.add_edge("agent", "validate")
workflow.add_conditional_edges("validate", check_qualification)

conversation_graph = workflow.compile()
```

**Conversation Playbook Example:**
```markdown
# Qualification Funnel V1

## Stage 1: Greeting
**Objective:** Make friendly first impression and identify initial pain point

**Questions:**
- "Hi, I'm Max. What task would you love to have done automatically?"
- "What's currently taking up most of your team's time?"

**Success Criteria:** User mentions a specific task or pain point

## Stage 2: Discovery
**Objective:** Deep understanding of the problem

**Questions:**
- "How often does [pain point] happen?"
- "What have you tried so far to solve this?"
- "What's the biggest frustration with [pain point]?"

**Success Criteria:** Clear problem articulation with frequency/impact

## Stage 3: Vertical Identification
**Objective:** Determine industry to tailor solution

**Questions:**
- "What industry are you in?"
- "Is this for [accounting/ecommerce/education]?"

**Success Criteria:** Vertical clearly identified

[etc...]
```

#### Dynamic Playbook Updates

**Key Advantage:** Update conversation flow without code changes

```python
# Update playbook in knowledge base
def update_playbook(playbook_name: str, new_content: str):
    """
    Update conversation playbook - changes take effect immediately
    No code deployment needed!
    """

    # Remove old version from vector store
    vectorstore.delete(filter={"file": f"playbooks/{playbook_name}.md"})

    # Add new version
    splitter = MarkdownTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = splitter.create_documents([new_content])
    vectorstore.add_documents(
        docs,
        metadata={"type": "playbook", "file": f"playbooks/{playbook_name}.md"}
    )

# A/B testing different funnels
def get_playbook_for_session(session_id: str):
    """Route to different playbooks for A/B testing"""

    # 50/50 split
    if hash(session_id) % 2 == 0:
        return "qualification_funnel_v1.md"
    else:
        return "qualification_funnel_v2.md"
```

#### Pros
✅ Rich domain knowledge (brand stories, methodologies)
✅ Dynamically updatable (no code changes needed)
✅ Industry-specific expertise
✅ Easy A/B testing of conversation strategies
✅ Consistent with AR Automation's voice/approach
✅ Can incorporate new industries without code changes
✅ Better handling of complex questions

#### Cons
❌ More complex infrastructure (vector DB required)
❌ Slower response times (retrieval step adds latency)
❌ Higher costs (embeddings + storage)
❌ More maintenance (keep knowledge base updated)
❌ Potential retrieval quality issues
❌ Harder to debug (context is dynamic)

#### Best For
- Production / Scale deployment
- When brand knowledge evolves frequently
- Multiple industries/verticals
- When domain expertise is critical
- Need for rapid iteration on conversation flow

---

## Next Steps

### Immediate (Next Sprint)

#### 1. Implement Conversation Stage Tracking
**Priority:** High
**Effort:** Medium
**Files to modify:**
- `backend/app/langgraph_agent.py` - Add stage detection
- `backend/app/database.py` - Add `current_stage` to Conversations table
- `backend/app/main.py` - Track stage transitions

**Outcome:** Visibility into where users drop off in funnel

#### 2. Improve Lead Extraction
**Priority:** High
**Effort:** Low
**Approach:**
- Use LLM for structured extraction (instead of regex)
- Implement Pydantic validators
- Extract all fields: name, email, phone, company

**Files to modify:**
- `backend/app/langgraph_agent.py:extract_lead_data()`

#### 3. Add Conversation Analytics
**Priority:** Medium
**Effort:** Medium
**Metrics to track:**
- Conversations started
- Completion rate per stage
- Average time to qualification
- Conversion rate

**New files:**
- `backend/app/analytics.py` - Analytics logic
- Dashboard or API endpoints for metrics

### Short-term (1-2 Sprints)

#### 4. Choose & Implement Flow Architecture
**Priority:** High
**Effort:** High
**Decision Required:**
- **Option 1:** Enhanced prompt-based sequencing (faster, simpler)
- **Option 2:** RAG-based pipeline (more powerful, complex)

**Recommendation:** Start with **Option 1** (prompt-based) for MVP, plan migration to **Option 2** (RAG) once we validate the conversation flow works.

**Implementation Checklist (Option 1):**
- [ ] Design enhanced system prompt with explicit stages
- [ ] Add state tracking to LangGraph
- [ ] Implement stage transition logic
- [ ] Create few-shot examples
- [ ] Test with sample conversations

**Implementation Checklist (Option 2):**
- [ ] Set up vector database (Chroma/Pinecone)
- [ ] Create knowledge base folder structure
- [ ] Convert brand stories to markdown chunks
- [ ] Implement embedding & indexing
- [ ] Build RAG retrieval node
- [ ] Integrate into LangGraph
- [ ] Test retrieval quality

#### 5. Integrate Brand Story Documents
**Priority:** High (if choosing Option 2)
**Effort:** Medium
**Source files:**
- `.claude/artifacts/create_brand_story/*.md`

**Process:**
1. Move to `knowledge_base/brand_stories/`
2. Create embeddings
3. Index in vector store
4. Update RAG retrieval to fetch brand context

### Long-term (3+ Sprints)

#### 6. Advanced Features
- [ ] Conversation repair & backtracking
- [ ] Sentiment analysis
- [ ] Multi-turn clarification requests
- [ ] Proactive objection handling
- [ ] Integration with CRM (HubSpot, Salesforce)
- [ ] Email follow-up automation
- [ ] Voice/speech interface
- [ ] Multi-lingual expansion (Spanish, French, etc.)

#### 7. Optimization
- [ ] Response caching for common questions
- [ ] Streaming responses (for better UX)
- [ ] Context window management (for long conversations)
- [ ] Model fine-tuning on successful conversations

---

## Appendix

### File Reference

**Frontend:**
- `frontend/src/components/InlineChatbot.tsx` - Main chatbot UI

**Backend:**
- `backend/app/main.py` - API endpoints
- `backend/app/langgraph_agent.py` - AI conversation logic
- `backend/app/database.py` - Database models & connection
- `backend/app/models.py` - Pydantic request/response models

**Knowledge Base (unused):**
- `.claude/artifacts/create_brand_story/accounting-automation-brand-script.md`
- `.claude/artifacts/create_brand_story/ecommerce-brandscript.md`
- `.claude/artifacts/create_brand_story/educational_institutions_brandscript.md`

### Dependencies

**Python:**
```txt
fastapi==0.115.5
langchain==0.3.13
langgraph==0.2.62
openai==1.57.2
sqlalchemy==2.0.36
psycopg2-binary==2.9.10
```

**JavaScript:**
```json
{
  "react": "^18.3.1",
  "@tanstack/react-query": "^5.60.5",
  "i18next": "^25.5.3"
}
```

### API Endpoints

**POST /api/chat**
- Request: `{sessionId, message, language}`
- Response: `{response, sessionId, conversationId}`
- Purpose: Send message, get AI response

**POST /api/conversations**
- Request: `{sessionId, status?}`
- Response: `{id, sessionId, vertical, status, createdAt}`
- Purpose: Create new conversation

**GET /api/conversations/{sessionId}**
- Response: `{conversation, messages[]}`
- Purpose: Retrieve conversation with full history

**POST /api/leads**
- Request: Lead data object
- Response: `{id, status}`
- Purpose: Manually create lead

---

**Document Status:** Living Document
**Next Review:** When implementing stage tracking or RAG
**Owner:** Development Team
**Related Docs:**
- [CLAUDE.md](../CLAUDE.md) - Development guidelines
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment guide
- [README.md](../README.md) - Project overview
