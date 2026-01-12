---
name: inbox-triage
description: This skill should be used when the user asks to "triage my inbox", "prioritize emails", "what needs my attention", "sort through my messages", "help me process my inbox", or is reviewing conversations to determine what needs action in Missive.
---

## Core Principles

### Decide, Don't Defer
Every conversation should get a decision: respond, delegate, schedule, archive, or delete. Avoid "I'll deal with this later" piles.

### Urgency vs Importance
- **Urgent + Important**: Handle immediately
- **Important, not urgent**: Schedule time for it
- **Urgent, not important**: Delegate or quick response
- **Neither**: Archive or delete

### Time-Based Triage
For regular inbox processing, work through conversations newest-to-oldest. For catch-up after absence, oldest-to-newest.

---

## Triage Decision Framework

### 1. Can I Delete/Archive This?
- Spam → Delete
- Newsletter I don't read → Unsubscribe or delete
- FYI with no action needed → Archive
- Completed thread → Archive/close

### 2. Does This Need a Response?
- Direct question to me → Yes
- Request for me → Yes
- CC'd for awareness only → Probably not
- Auto-notification → No

### 3. Can I Respond in 2 Minutes?
- Yes → Do it now (or draft it)
- No → Schedule dedicated time

### 4. Am I the Right Person?
- Yes → Process it
- No → Delegate/forward with context

---

## Identifying Priority Conversations

### High Priority Indicators
- From VIPs (executives, key clients, important contacts)
- Time-sensitive language ("urgent", "ASAP", "by EOD", "deadline")
- Blockers (someone waiting on you to proceed)
- Revenue/customer impact
- Escalations

### Medium Priority Indicators
- Direct requests with reasonable timelines
- Follow-ups on ongoing work
- Meeting requests
- Questions requiring research

### Low Priority Indicators
- FYI/informational
- Newsletters you actually read
- Non-urgent internal updates
- Social/networking messages

---

## Triage Workflow

### Quick Scan Phase
1. Fetch recent conversations: `missive_conversations` action: `list`
2. Scan subjects and senders for high-priority flags
3. Identify spam/obvious archives first

### Decision Phase
For each conversation:
1. Read enough to understand what's needed
2. Classify: Archive, Respond, Delegate, Schedule, or Task
3. Take action or note the decision

### Action Phase
- **Archive**: Close the conversation
- **Respond**: Draft reply (use draft-reply skill)
- **Delegate**: Assign to appropriate team member
- **Schedule**: Create task with due date
- **Task**: Add to task list for follow-up

---

## Skip/Archive Criteria

Automatically skip or archive:
- **Marketing emails** - Promotional content, sales pitches
- **Newsletters** - Unless explicitly wanted
- **Automated notifications** - System alerts with no action needed
- **Social media notifications** - LinkedIn, Twitter, etc.
- **Completed transactions** - Order confirmations, receipts (archive, don't delete)
- **Calendar confirmations** - Meeting accepted/declined notifications

---

## Batch Processing Strategies

### The 4 D's
- **Delete**: Trash it
- **Do**: Handle it now (< 2 min)
- **Delegate**: Assign to someone else
- **Defer**: Schedule for later

### Touch It Once
Avoid re-reading the same email multiple times. Make a decision on first read when possible.

### Time Boxing
Set a fixed time for triage (e.g., 15 min morning, 15 min afternoon). Process what you can, then stop.

---

## Using Missive Features for Triage

### Conversation Status
- Open/Close conversations as you process
- Use closed status to indicate "handled"

### Assignments
- Assign to self = "I own this"
- Assign to others = delegation
- Use `missive_conversations` to check assignee

### Tasks
- Create tasks for follow-ups: `missive_tasks` action: `create`
- Include due dates for time-sensitive items
- Link tasks to conversations
