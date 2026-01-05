# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Personal Claude Code plugin marketplace containing shareable skills, agents, commands, and plugins.

## Structure

```
claude-toolkit/
├── plugins/              # MCP-based plugins (require servers)
│   └── ashby/            # Ashby ATS integration
├── agents/               # Specialized agents
├── commands/             # Slash commands
├── skills/               # Knowledge/instruction skills
└── README.md
```

## Plugin: Ashby

Full Ashby ATS integration with MCP server.

### Setup
```bash
cd plugins/ashby/mcp-server
uv sync
echo 'ASHBY_API_KEY=your-key' > .env
```

### Architecture
- `plugins/ashby/mcp-server/server.py` - Python MCP server with ~34 tools
- `agents/ashby-recruiter.md` - Recruiting workflow agent
- `commands/candidates.md`, `jobs.md`, `pipeline.md`, `schedule.md` - Slash commands
- `skills/ashby-*/` - API and workflow guidance

## Adding Components

### New Agent
Create `agents/<name>.md` with frontmatter:
```yaml
---
name: agent-name
description: |
  When to use this agent...
---
Agent instructions...
```

### New Command
Create `commands/<name>.md` with frontmatter:
```yaml
---
description: What the command does
argument-hint: [optional-arg]
---
Command instructions...
```

### New Skill
Create `skills/<name>/SKILL.md` with frontmatter:
```yaml
---
name: Skill Name
description: When to activate this skill...
---
Skill content...
```

## Installation

```bash
# Option 1: Plugin flag
claude --plugin-dir /path/to/claude-toolkit

# Option 2: Global install
cp -r claude-toolkit ~/.claude/plugins/claude-toolkit
```
