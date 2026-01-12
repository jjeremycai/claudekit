---
description: Draft a reply to a specific Missive conversation
argument-hint: <subject or sender>
allowed-tools: mcp__missive__missive_conversations, mcp__missive__missive_messages, mcp__missive__missive_drafts, mcp__missive__missive_organizations
---

Find the Missive conversation matching "$ARGUMENTS" and draft a reply.

## Workflow

1. **Find conversation**: `missive_conversations (action: list, inbox: true)` then filter
2. **Get thread**: `missive_conversations (action: messages, id: conversation_id)`
3. **Get full message**: `missive_messages (action: get, id: message_id)` for complete body
4. **Create draft**: (never send)

## Draft Format Rules

### Match Sender
Reply from the address it was sent to (check `to_fields` of incoming message).

### Paragraph Spacing
Use ONE `<br>` between paragraphs (not two):
```html
<div>First paragraph</div>
<br>
<div>Second paragraph</div>
<br>
<div>Best,<br>Jeremy</div>
```

### Include Quoted Content (REQUIRED)
```html
<div>My response</div>
<br>
<div>Best,<br>Jeremy</div>
<br>
<div>On [Date], [Sender] &lt;[email]&gt; wrote:</div>
<blockquote style="margin:0 0 0 0.5em;padding:0 0 0 0.5em;border-left:2px solid #ccc">
[original message body from missive_messages response]
</blockquote>
```

### Content
- Brief: 2-4 sentences
- Professional but friendly
- Never send - only create draft
