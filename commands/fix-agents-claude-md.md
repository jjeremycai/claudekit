---
description: Refactor CLAUDE.md following progressive disclosure principles
---

Analyze and refactor the CLAUDE.md file at `~/.claude/CLAUDE.md` (or the iCloud path `~/Library/Mobile Documents/com~apple~CloudDocs/Dev/Claude Code/config/CLAUDE.md`).

## Steps

### 1. Find Contradictions
Identify any instructions that conflict with each other. For each contradiction found, ask the user which version to keep.

### 2. Identify Essentials
Extract only what belongs in root CLAUDE.md - instructions relevant to EVERY task:
- Core behavior modifications (not defaults)
- Non-standard conventions
- Project-specific requirements

### 3. Flag for Deletion
Identify instructions that are:
- **Redundant**: The agent already knows this (e.g., "read code before editing")
- **Too vague**: Not actionable (e.g., "write good code")
- **Overly obvious**: Standard behavior (e.g., "complete tasks")

Present deletions to user for approval before removing.

### 4. Apply Changes
After user approval:
- Remove flagged items
- Keep essential instructions concise
- Ensure no duplicate information

## Guidelines

- Never add time estimates or timeline predictions
- Every instruction should modify default behavior
- If an instruction wouldn't change what the agent does, delete it
- Prefer specific anti-patterns over vague principles
