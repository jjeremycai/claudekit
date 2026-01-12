---
name: missive-draft-reply-all
description: This skill should be used when the user asks to "draft all replies", "respond to inbox", "batch draft emails", "reply to everything", or wants to create draft replies for all open conversations in Missive that need responses.
---

Review Missive inbox and create draft replies for all conversations that need responses.

## Workflow

### Step 1: Fetch Inbox
```
missive_conversations (action: list, inbox: true)
```

### Step 2: Filter Conversations
Skip:
- Automated notifications (Ashby, CI/CD, system alerts)
- Newsletters and marketing emails
- No-reply addresses
- Already replied threads (check if last message is from user)
- Conversations that already have drafts (drafts_count > 0)
- Receipts and confirmations

Draft for:
- Direct questions requiring response
- Action requests
- Follow-ups on previous conversations
- Introduction emails from new contacts
- Client/customer messages
- Candidate responses to outreach

### Step 3: Fetch Message Details
For each conversation needing a draft:
```
missive_conversations (action: messages, id: conversation_id)
```

### Step 3.5: Ask Questions When Needed

**Before drafting, use AskUserQuestion if you need context.**

Ask when:
- Reply requires info you don't have (rates, availability, specific details)
- Multiple valid response directions (accept/decline, interested/pass)
- Email asks something only user can answer
- Unsure about tone or commitment level

**Batch all questions in ONE AskUserQuestion call** (up to 4 questions). Claude Code has built-in pagination/tabs for users to quickly click through.

Example - ask all at once:
```
questions: [
  {question: "Nathan Tsao - next steps?", options: ["Proceed", "Pass", "Delay"]},
  {question: "Brian Li - next steps?", options: ["Schedule call", "Discuss rate", "Pass"]},
  {question: "Qi Chen - how to respond?", options: ["Provide details", "Ask rate first", "Pass"]}
]
```

### Step 4: Create Drafts IN PARALLEL

**CRITICAL: When multiple drafts are needed, spawn subagents in parallel.**

Use the Task tool to create one subagent per draft. Launch ALL subagents in a SINGLE message with multiple Task tool calls.

Each subagent prompt should include:
- Conversation ID and organization ID
- Message ID of the message being replied to
- Full thread context
- Instructions to fetch message body and include quoted content

### Step 5: Report Results
Summarize: conversations reviewed, drafts created, skipped items.

## Draft Format Rules

### 1. Reply-All
Include all original recipients when appropriate.

### 2. Match Sender
Reply from the email address the original was sent TO (check the to_fields of the incoming message).

### 3. Brief Responses
2-4 sentences unless more detail is needed.

### 4. Paragraph Spacing
Use ONE `<br>` between paragraphs (not two):
```html
<div>First paragraph</div>
<br>
<div>Second paragraph</div>
<br>
<div>Best,<br>Jeremy</div>
```

### 5. Include FULL Conversation Thread
Every reply MUST include the ENTIRE thread as nested blockquotes - not just the last message.

**Key rules:**
- Fetch ALL message bodies using missive_messages (action: get)
- PRESERVE signatures exactly as they appear
- Use 3x `<br>` between messages for clear separation

```html
<div>Your response</div>
<br>
<div>Best,<br>Jeremy</div>
<br>
<br>
<div>On [Date 3], [Sender 3] wrote:</div>
<blockquote style="margin:0 0 0 0.5em;padding:0 0 0 0.5em;border-left:2px solid #ccc">
[Message 3 full body WITH signature]
<br>
<br>
<br>
<div>On [Date 2], [Sender 2] wrote:</div>
<blockquote style="margin:0 0 0 0.5em;padding:0 0 0 0.5em;border-left:2px solid #ccc">
[Message 2 full body WITH signature]
<br>
<br>
<br>
<div>On [Date 1], [Sender 1] wrote:</div>
<blockquote style="margin:0 0 0 0.5em;padding:0 0 0 0.5em;border-left:2px solid #ccc">
[Message 1 full body WITH signature]
</blockquote>
</blockquote>
</blockquote>
```

### 6. Never Send
Only create drafts - user will review and send.
