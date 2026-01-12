---
description: Draft replies to all open emails in Missive inbox
allowed-tools: mcp__missive__missive_conversations, mcp__missive__missive_messages, mcp__missive__missive_drafts, mcp__missive__missive_organizations, Task, AskUserQuestion
---

Review my Missive inbox and create draft replies for all conversations that need responses.

## Workflow

1. **Fetch inbox**: `missive_conversations (action: list, inbox: true)`
2. **Get organizations**: `missive_organizations (action: list)` for org IDs
3. **Filter**: Skip Ashby notifications, newsletters, marketing, no-reply, already-replied
4. **Fetch threads**: Get messages for each conversation needing a draft
5. **Ask questions**: Batch ALL questions in ONE AskUserQuestion call (up to 4) - Claude Code has pagination
6. **Create drafts IN PARALLEL**: Spawn subagents using Task tool - one per draft, all in same message

## When to Ask Questions

Use AskUserQuestion before drafting if:
- Reply needs info you don't have (rates, availability, dates)
- Multiple valid directions (accept/decline, interested/pass)
- Email asks something only I can answer
- Unsure about commitment level

**Batch all questions together** for pagination:
```
questions: [
  {question: "Nathan Tsao?", options: ["Proceed", "Pass", "Delay"]},
  {question: "Brian Li?", options: ["Schedule call", "Pass"]},
  {question: "Qi Chen?", options: ["Provide details", "Ask rate first"]}
]
```

## What to Draft
- Direct questions requiring my response
- Action requests
- Follow-ups on previous conversations
- Introduction emails from new contacts
- Client/customer messages
- Candidate responses

## What to Skip
- Newsletters and marketing emails
- Automated notifications (Ashby, CI/CD)
- No-reply addresses
- Already replied threads (last message is from me)
- Conversations with existing drafts (drafts_count > 0)
- Receipts and confirmations

## Draft Format Rules

### 1. Parallel Execution
When multiple drafts needed, use Task tool to spawn subagents in parallel - ALL in a single message.

### 2. Reply-All
Include all original recipients when appropriate.

### 3. Match Sender
Reply from the email address it was sent TO.

### 4. Paragraph Spacing
Use ONE `<br>` between paragraphs (not two):
```html
<div>First paragraph</div>
<br>
<div>Second paragraph</div>
<br>
<div>Best,<br>Jeremy</div>
```

### 5. Include Quoted Content
Fetch full message body using `missive_messages (action: get, id: message_id)` and include in blockquote:
```html
<div>My response</div>
<br>
<div>Best,<br>Jeremy</div>
<br>
<div>On [Date], [Sender] wrote:</div>
<blockquote style="margin:0 0 0 0.5em;padding:0 0 0 0.5em;border-left:2px solid #ccc">
[original message body]
</blockquote>
```

### 6. Never Send
Only create drafts - I will review first.

## Report
Summarize: conversations reviewed, drafts created, any needing special attention.
