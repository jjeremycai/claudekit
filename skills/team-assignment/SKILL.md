---
name: team-assignment
description: This skill should be used when the user asks to "assign this to", "delegate this email", "who should handle this", "route this conversation", "hand off this thread", or is making decisions about conversation ownership in Missive.
---

## Core Principles

### Clear Ownership
Every conversation that needs action should have one owner. Avoid shared ownership or "someone will handle it" situations.

### Context Transfers
When assigning, provide context. Don't just reassign - explain why and what's needed.

### Right Person, Right Skills
Route based on expertise, availability, and relationship to the contact.

---

## Assignment Operations

### Viewing Teams
```
missive_teams action: list
```
Returns all teams you have access to.

### Viewing Users
```
missive_users action: list
```
Returns all users in the organization.

### Assigning Conversations
Use `missive_messages` action: `create` with:
```
message: {
  conversation: [conversation_id],
  add_assignees: [user_id]
}
```

Or filter conversations by assignee:
```
missive_conversations action: list
assignee: [user_id]
```

---

## Assignment Decision Framework

### Route by Expertise
- Technical questions → Technical team member
- Billing issues → Finance/accounts person
- Sales inquiries → Sales team
- Support requests → Support team
- Legal/contract → Legal or leadership

### Route by Relationship
- Existing client relationship → Their account manager
- Previous thread history → Person who handled before
- Personal connection → Person they know

### Route by Availability
- Check workload before assigning
- Consider time zones
- Respect OOO/vacation status

### Route by Authority
- Decisions requiring approval → Manager/lead
- Escalations → Senior team member
- Sensitive topics → Appropriate authority level

---

## Handoff Best Practices

### What to Include
When delegating, add a note/post with:
1. **Why** you're assigning to them
2. **What** needs to be done
3. **When** it's needed (if time-sensitive)
4. **Context** they might not have

### Example Handoff
```
missive_posts action: create
post: {
  conversation: [conversation_id],
  markdown: "@[Name] - Assigning this to you as it's a billing question. Customer is asking about their last invoice. They're a long-term client, so please prioritize. Let me know if you need any background."
}
```

### What to Avoid
❌ Silent reassignment (no context)
❌ Reassigning without checking capacity
❌ Bouncing back and forth
❌ Assigning to group/nobody

---

## Team Structure Patterns

### Functional Teams
- Sales, Support, Engineering, etc.
- Route by topic/request type

### Account-Based Teams
- Client A team, Client B team
- Route by customer

### Geographic Teams
- EMEA, Americas, APAC
- Route by time zone or region

### Tiered Support
- Tier 1: General inquiries
- Tier 2: Technical issues
- Tier 3: Escalations
- Route by complexity

---

## Escalation Patterns

### When to Escalate
- Customer is frustrated/angry
- Issue is beyond your authority
- Technical complexity exceeds your knowledge
- Time-sensitive with no clear owner
- Potential legal/PR implications

### How to Escalate
1. Summarize the situation
2. Explain what's been tried
3. Clearly state what you need from escalation point
4. Assign to appropriate person with full context

### Escalation Chain
Know your escalation path:
- First: Team lead/senior
- Then: Department head
- Finally: Leadership

---

## Monitoring Assignments

### Your Assignments
```
missive_conversations action: list
assignee: [your_user_id]
closed: false
```

### Team Workload
Check assignment distribution across team by listing conversations filtered by each assignee.

### Unassigned Conversations
```
missive_conversations action: list
team: [team_id]
```
Then filter for those without assignees.

---

## Self-Assignment

### When to Self-Assign
- You're the right person for this
- You started the thread
- You have the relationship
- Quick task you can handle

### When Not to Self-Assign
- Outside your expertise
- Overloaded already
- Someone else is better suited
- Need authority you don't have

---

## Anti-Patterns

### Assignment Ping-Pong
❌ A assigns to B, B assigns back to A
✅ Discuss ownership before assigning

### Ghost Assignment
❌ Assign without any context or notification
✅ Always add a note explaining the assignment

### Abandon Assignment
❌ Assign and forget about it
✅ Follow up if no action taken

### Over-Assignment
❌ Assign trivial things that don't need ownership
✅ Only assign conversations needing clear accountability
