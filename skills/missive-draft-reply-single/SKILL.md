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
Use TWO line breaks between paragraphs:
```html
First paragraph<br><br>

Second paragraph<br><br>

Best,<br>
Jeremy
```

DO NOT use `<p>` tags - they create inconsistent spacing in email clients.

### Quoted Content (REQUIRED)
Every reply MUST include the original message in a blockquote to preserve conversation context:

```html
<div>Your response here.</div>
<br>
<div>Another paragraph if needed.</div>
<br><br>
<div>On [Month Day, Year], [Sender Name] &lt;[sender@email.com]&gt; wrote:</div>
<blockquote style="margin:0 0 0 0.5em;padding:0 0 0 0.5em;border-left:2px solid #ccc">
[Full original message body from missive_messages response]
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
