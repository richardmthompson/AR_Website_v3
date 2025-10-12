---
description: "Interactive documentation for the context engineering framework"
arguments: "Your question about the context engineering system (PRPs, Commands, Artifacts, or workflow)"
---

# Context Engineering Help

## User Question: $ARGUMENTS

## Mission

Provide **clear, actionable guidance** on how to use the context engineering framework by consulting the comprehensive Context-Engineering-Cognitive-Map.md knowledge base.

This command acts as an **interactive documentation assistant**, helping users understand:
- When to use specific PRP templates
- How to structure commands
- Best practices for artifacts
- Workflow patterns and integration
- Common pitfalls and solutions

## Process

### Step 1: Understand the Question

Analyze the user's question to determine:
- **Topic area**: PRPs, Commands, Artifacts, Workflows, Best Practices
- **Specificity level**: Conceptual vs. Tactical
- **Context needed**: Beginner vs. Advanced user

### Step 2: Consult the Knowledge Base

Read the relevant sections from @.claude/Context-Engineering-Cognitive-Map.md:

**For PRP-related questions:**
- Section: "Product Requirement Prompts (PRPs)"
- Section: "PRP Templates (7 Types)"
- Section: "PRP Lifecycle"

**For Command-related questions:**
- Section: "Commands System"
- Section: "Command Categories (41 Total)"
- Section: "Key Command Patterns"

**For Artifact-related questions:**
- Section: "Artifacts System"
- Section: "Artifact Types"
- Section: "Artifacts in the Development Workflow"

**For Workflow questions:**
- Section: "Workflow Examples"
- Section: "Integration Patterns"
- Section: "Best Practices & Principles"

**For Getting Started questions:**
- Section: "Getting Started Guide"
- Section: "For New Users of This System"

### Step 3: Extract Relevant Information

From the knowledge base, extract:
1. **Direct answer** to the user's question
2. **Related concepts** they should know about
3. **Concrete examples** from the cognitive map
4. **Command references** they can run next
5. **Common pitfalls** to avoid

### Step 4: Structure the Response

Provide a **clear, concise answer** with:

```
=Ö Answer:
[Direct answer to their question]

<¯ Key Concepts:
- [Related concept 1]
- [Related concept 2]

=¡ Example:
[Concrete example from the cognitive map]

=€ Next Steps:
[Suggested commands or actions]

  Common Pitfalls:
[What to avoid]

=Ú Related Topics:
[Links to related sections of the cognitive map]
```

### Step 5: Provide Command Suggestions

Based on the question, suggest **specific commands** they can run:

**If asking "how to create a PRP":**
```bash
/prp-story-create "your feature description"
# or
/prp-task-create "your task description"
```

**If asking "how to execute a PRP":**
```bash
/prp-story-execute "PRPs/your-prp-file.md"
```

**If asking "how to review code":**
```bash
/review-staged-unstaged
```

**If asking about workflow:**
```bash
/prime-core  # Start here every session
```

### Step 6: Offer Deep Dive Option

If the question is complex, offer to:
1. **Spawn a research agent** to explore the topic deeper
2. **Show specific examples** from the codebase
3. **Create a custom PRP** for their specific use case
4. **Walk through a workflow** step-by-step

## Response Template

```markdown
# Context Engineering Help: [Topic]

## =Ö Answer

[Clear, direct answer to the user's question, referencing specific sections of the cognitive map]

---

## <¯ Key Concepts

- **[Concept 1]**: [Brief explanation]
- **[Concept 2]**: [Brief explanation]
- **[Concept 3]**: [Brief explanation]

---

## =¡ Example

[Real example from the cognitive map, with file references if applicable]

Example from the cognitive map (lines X-Y):
```
[Code or workflow example]
```

---

## =€ What to Run Next

Based on your question, here are suggested commands:

```bash
# [Command 1 description]
/command-name "arguments"

# [Command 2 description]
/command-name "arguments"
```

---

##   Common Pitfalls

L **Pitfall 1**: [What to avoid]
 **Solution**: [What to do instead]

L **Pitfall 2**: [What to avoid]
 **Solution**: [What to do instead]

---

## =Ú Related Topics

For more information, see these sections in the Context-Engineering-Cognitive-Map.md:

- **[Section Name]** (lines X-Y): [Brief description]
- **[Section Name]** (lines X-Y): [Brief description]

---

## > Need More Help?

Run this command again with a more specific question:
```bash
/help-contexteng "your specific question here"
```

Or start with the basics:
```bash
/prime-core  # Prime Claude with project context
```
```

## Quality Criteria

### Answer Quality
- [ ] Direct, actionable answer provided
- [ ] References specific sections of cognitive map
- [ ] Includes concrete examples
- [ ] Suggests next commands to run
- [ ] Warns about common pitfalls

### Comprehensiveness
- [ ] Addresses the core question
- [ ] Provides related context
- [ ] Links to deeper resources
- [ ] Offers follow-up options

### Usability
- [ ] Clear structure with emojis for scanning
- [ ] Code examples are copy-pasteable
- [ ] File references include line numbers
- [ ] Command suggestions are actionable

## Common Question Categories

### Category 1: "Which PRP template should I use?"

**Answer Pattern:**
1. Describe the 7 PRP templates
2. Show template comparison matrix
3. Recommend based on user's scenario
4. Provide command to create that PRP type

### Category 2: "How do I create/execute a PRP?"

**Answer Pattern:**
1. Explain create/execute separation
2. Show the 2-phase workflow
3. Walk through an example
4. Provide exact commands to run

### Category 3: "What are artifacts vs PRPs?"

**Answer Pattern:**
1. Show the key distinctions table
2. Explain strategic vs. technical
3. Give examples of each
4. Show how they integrate

### Category 4: "How do I get started?"

**Answer Pattern:**
1. Point to Getting Started Guide
2. Suggest /prime-core first
3. Walk through simple workflow
4. Link to beginner examples

### Category 5: "What does [specific term] mean?"

**Answer Pattern:**
1. Define the term from cognitive map
2. Show where it fits in the system
3. Provide example usage
4. Link to related concepts

### Category 6: "Best practices for [X]?"

**Answer Pattern:**
1. Reference Best Practices section
2. Extract relevant principles
3. Show good vs. bad examples
4. Provide validation commands

## Special Handling

### If Question is Too Broad
```
"Your question covers a lot of ground! Let me help you narrow it down.

Are you asking about:
1. [Specific aspect 1]
2. [Specific aspect 2]
3. [Specific aspect 3]

Run this command again with one of these focused questions:
/help-contexteng "[specific question]"
```

### If Question Requires Codebase Context
```
"To answer this question well, I need to understand your specific codebase.

Let me first prime my context:
[Run /prime-core or read relevant files]

Then I can provide a tailored answer for your project."
```

### If Question is About Advanced Features
```
"This is an advanced topic! Here's what you need to know:

[Provide answer with prerequisites]

Prerequisites:
- [Prerequisite 1]
- [Prerequisite 2]

I recommend starting with the basics first:
/help-contexteng "how do I get started"
```

## Output

**Format:** Markdown response following the template above
**Location:** Display to user (no file save)
**Follow-up:** Offer to run suggested commands or dive deeper

## Success Metrics

**User Understands**: Answer is clear and actionable
**User Empowered**: Knows what command to run next
**User Confident**: Has examples and knows pitfalls to avoid
**User Connected**: Sees how this fits in the bigger system

---

**Remember**: This command is about **enabling users to help themselves** by making the context engineering framework accessible and understandable. Be concise, practical, and always provide next steps.
