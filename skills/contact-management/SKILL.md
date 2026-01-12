---
name: contact-management
description: This skill should be used when the user asks to "add a contact", "update contact info", "organize contacts", "find a contact", "manage contact groups", "import contacts", or is working with contact data in Missive.
---

## Core Principles

### Single Source of Truth
Each contact should exist once. Before creating, search for existing records to avoid duplicates.

### Keep Data Fresh
Update contact information when you notice changes (new email, title change, company move).

### Use Contact Books
Organize contacts into books based on your workflow (Clients, Vendors, Personal, etc.).

---

## Contact Operations

### Listing Contacts
```
missive_contacts action: list
- limit: Number of results (default 50)
- offset: For pagination
```

### Getting a Contact
```
missive_contacts action: get
- id: Contact ID
```

### Creating Contacts
```
missive_contacts action: create
- contact: Single contact object
- contacts: Array for bulk create

Contact fields:
- email (string)
- phone_number (string)
- first_name (string)
- last_name (string)
- company (string)
- contact_book (ID of contact book)
```

### Updating Contacts
```
missive_contacts action: update
- id: Contact ID
- contact: Fields to update
```

---

## Contact Organization

### Contact Books
Use `missive_contacts` action: `list_books` to see available books.

Common book structures:
- **Clients** - Active customers
- **Prospects** - Potential customers
- **Vendors** - Suppliers, service providers
- **Partners** - Business partners, collaborators
- **Personal** - Non-business contacts
- **Team** - Internal colleagues (if not using org directory)

### Contact Groups
Use `missive_contacts` action: `list_groups` to see groups.

Groups can span across books for cross-cutting organization:
- VIP contacts
- Newsletter subscribers
- Event attendees
- Project-specific groups

---

## Deduplication Patterns

### Before Creating
1. Search by email address (most reliable identifier)
2. Search by name + company combination
3. Check for variations (john@company.com vs john.doe@company.com)

### When Duplicates Found
- Identify the most complete record
- Merge information to that record
- Update references in conversations
- Remove duplicate (carefully)

### Prevention
- Establish naming conventions
- Standardize email formats
- Regular audits

---

## Bulk Operations

### Bulk Import Pattern
```
missive_contacts action: create
contacts: [
  { email: "...", first_name: "...", ... },
  { email: "...", first_name: "...", ... },
  ...
]
```

### Best Practices for Bulk
- Validate data before import
- Check for duplicates first
- Import in batches (respect rate limits)
- Assign to appropriate contact book

---

## Contact Data Quality

### Required Fields
At minimum, a contact needs:
- Email address OR phone number (identifier)
- Name (first and/or last)

### Recommended Fields
- Company (for B2B)
- Title/Role (helps with context)
- Contact book assignment

### Keep Updated
When you notice in conversations:
- New email addresses
- Title changes
- Company changes
- Phone number changes

Update the contact record to maintain accuracy.

---

## Contact Search Strategies

### Finding Contacts
Currently, list with pagination and filter client-side, or:
- Search by known email in conversation
- Look up from recent conversations
- Browse by contact book

### Using Contact Info
Once you have a contact ID, you can:
- View full details
- Update information
- Reference in drafts (for auto-complete)
- Associate with conversations

---

## Integration Points

### With Conversations
- Contact info appears on conversations with that email
- Enriches context when viewing threads

### With Drafts
- Contact data enables auto-complete
- Ensures correct addressing

### With Teams
- Shared contacts visible to team members
- Contact books can be team-specific
