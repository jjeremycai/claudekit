---
name: labeling
description: This skill should be used when the user asks to "label this conversation", "organize my inbox", "apply labels", "tag this email", "categorize conversations", or is working on inbox organization tasks in Missive.
---

## Core Principles

### Use Existing Labels Only
Do not create new labels. Work with the label taxonomy already established. If no suitable label exists, note this to the user rather than inventing one.

### Labels as Filters, Not Descriptions
Labels should help you find and filter conversations later, not describe every aspect of the email. Ask: "Will I need to find emails like this later?"

### Less is More
Apply 1-3 labels per conversation. Over-labeling creates noise and makes labels meaningless.

---

## When to Apply Labels

### Apply Labels For
- **Project/client identification** - "Project Alpha", "Client: Acme"
- **Action required** - "Needs Response", "Waiting On", "Review"
- **Priority** - "Urgent", "High Priority" (use sparingly)
- **Type categorization** - "Invoice", "Contract", "Support"

### Skip Labels For
- One-off conversations you won't need to find again
- Spam or newsletters (archive/delete instead)
- Conversations already in a well-organized mailbox

---

## Label Application Workflow

### Before Labeling
1. List available labels using `missive_labels` action: `list`
2. Understand the existing taxonomy structure
3. Check if the conversation already has labels

### Applying Labels
Use `missive_messages` or conversation actions to add labels:
- `add_shared_labels`: Array of label IDs to add
- Labels are additive - won't remove existing ones

### Label Hierarchy
If labels have parent/child structure:
- Apply the most specific applicable label
- Parent labels may auto-apply (check organization settings)

---

## Common Label Patterns

### Status-Based Labels
- **Needs Action** - Requires your response/work
- **Waiting On** - Ball is in someone else's court
- **Scheduled** - Has a future action date
- **Done** - Completed but keeping for reference

### Entity-Based Labels
- Client or customer names
- Project names
- Department names
- Vendor names

### Type-Based Labels
- Invoice / Billing
- Contract / Legal
- Support / Help
- Meeting / Calendar
- Internal / External

---

## Anti-Patterns to Avoid

### Don't Over-Label
❌ Applying 5+ labels to a single conversation
✅ Apply 1-3 most relevant labels

### Don't Duplicate Information
❌ Labeling "Invoice" on an email already in "Billing" mailbox
✅ Labels should add information, not repeat it

### Don't Label Everything
❌ Labeling every conversation that comes in
✅ Label only conversations you'll need to find/filter later

### Don't Create Implicit Labels
❌ Using subject line patterns as pseudo-labels
✅ Use actual labels for organization

---

## Querying by Label

Use `missive_conversations` with `shared_label` parameter to filter:
```
action: list
shared_label: [label_id]
```

Combine with other filters:
- `closed: false` - Open conversations only
- `team: [team_id]` - Specific team
- `assignee: [user_id]` - Specific assignee
