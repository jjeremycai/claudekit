---
name: docs-write
description: This skill should be used when the user asks to "write docs", "create documentation", "document this project", "write a README", or wants to create comprehensive documentation from scratch. Spawns @writer agent to analyze codebase and create consolidated docs.
---

Create comprehensive documentation for this project using the @writer agent.

## Step 1: Ask Preferences

Before starting, ask the user:

```
AskUserQuestion:
  question: "What documentation scope?"
  header: "Scope"
  options:
    - label: "README only (Recommended)"
      description: "Single comprehensive README with all essential info"
    - label: "README + Architecture diagram"
      description: "README plus visual system overview"
    - label: "Full documentation"
      description: "README, API docs, and Architecture (for complex projects)"
```

If user selects architecture diagram, also ask:

```
AskUserQuestion:
  question: "What format for architecture diagrams?"
  header: "Diagram"
  options:
    - label: "ASCII (Recommended)"
      description: "Simple text diagram, works everywhere"
    - label: "Mermaid"
      description: "Renders in GitHub/docs, has syntax restrictions"
```

## Step 2: Analyze Project

Gather context before writing:

```bash
# Project type and dependencies
cat package.json 2>/dev/null || cat Cargo.toml 2>/dev/null || cat go.mod 2>/dev/null || cat requirements.txt 2>/dev/null

# Existing documentation (or use Glob tool: pattern "**/*.md")
ls *.md 2>/dev/null

# Project structure
ls -la src/ 2>/dev/null || ls -la lib/ 2>/dev/null || ls -la
```

## Step 3: Spawn Writer Agent

Launch @writer with user's preferences:

```
Task: writer
Prompt: |
  Create documentation for this project.

  MODE: WRITE_MODE
  SCOPE: [from user selection]
  DIAGRAM_FORMAT: [if applicable]

  Requirements:
  - Read actual code before documenting
  - All commands must be copy-paste ready
  - All examples must be verified against code
  - Consolidate into as few files as possible

  Project context:
  [Include gathered context from step 2]
```

## Step 4: Verification

After @writer completes:

```bash
# Show created/updated docs
git status --porcelain | grep -E '\.md$'

# Verify README exists and has content
wc -l README.md
head -50 README.md
```

## Output Format

### Documentation Created

| File | Lines | Sections |
|------|-------|----------|
| README.md | N | Quick start, Architecture, API, Config, Development |

### Summary

Brief description of what was documented and any gaps that couldn't be filled.

## Notes

- Prefer updating existing README over creating new files
- Don't create documentation for trivial projects (< 5 source files)
- ASCII diagrams recommended for portability
