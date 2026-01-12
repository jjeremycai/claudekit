---
name: missive-draft-reply-single
description: This skill should be used when the user asks to "draft reply to [email]", "respond to [sender]", "reply to that email", or wants to draft a reply to a specific Missive conversation.
---

Find a specific Missive conversation and draft a reply.

## Workflow

### Step 1: Find the Conversation
Search by subject or sender:
```
missive_conversations (action: list, inbox: true)
```
Then filter results to find the matching conversation.

### Step 2: Get Full Thread
```
missive_conversations (action: messages, id: conversation_id)
```

### Step 3: Get Full Message Body
To include quoted content, fetch the full message:
```
missive_messages (action: get, id: message_id)
```
This returns the complete `body` field with HTML content.

### Step 4: Create Draft
```
missive_drafts (action: create, draft: {
  conversation: conversation_id,
  organization: org_id,
  from_field: {address: reply_to_address, name: "Jeremy Cai"},
  to_fields: [{address: sender_email, name: sender_name}],
  subject: "Re: [original subject]",
  body: "[formatted HTML - see below]"
})
```

## Draft Format Rules

### Reply Address
Reply from the address the original email was sent TO (check `to_fields` of incoming message).

### Paragraph Spacing
Use ONE `<br>` between paragraphs:
```html
<div>First paragraph</div>
<br>
<div>Second paragraph</div>
<br>
<div>Best,<br>Jeremy</div>
```

DO NOT use `<p>` tags - they create inconsistent spacing in email clients.

### FULL Thread Quoted (REQUIRED)
Every reply MUST include the ENTIRE conversation thread as nested blockquotes - not just the last message.

**Key rules:**
- Fetch ALL message bodies using missive_messages (action: get)
- PRESERVE signatures exactly as they appear
- Use 3x `<br>` between messages for clear separation

```html
<div>Your response here.</div>
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

### Date Formatting
Convert Unix timestamp to readable format:
- `1767836634` → "January 8, 2026"

### Content Guidelines
- Brief: 2-4 sentences
- Match the tone of the incoming email
- Professional but friendly
- Never send - only create draft
