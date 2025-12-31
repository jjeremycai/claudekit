# Claude Code Skills & Plugins

A collection of custom skills, agents, commands, and plugins for Claude Code.

## Contents

### Plugins

| Plugin | Description |
|--------|-------------|
| [ashby](./ashby/) | Ashby ATS integration for recruiting workflows |
| [cto-audit](./cto-audit/) | CTO-level codebase audit skill |
| [frontend-design](./frontend-design/) | Frontend design engineering skill |

### Commands

Custom slash commands in [`commands/`](./commands/):
- `/beads-execute` - Execute Beads tickets with subagent parallelization
- `/beads-write` - Generate Beads tickets for a project
- `/ios-release` - Build and upload iOS app to App Store Connect
- `/new-pr` - Create a new PR with smart branch detection
- `/review-pr` - Thorough senior engineer PR review
- `/verify-changes` - Verify PR feedback before merge

### Agents

Custom agents in [`agents/`](./agents/):
- `auditor` - Deep codebase audit
- `auth-expert` - Auth debugging (PKCE, OAuth, sessions)
- `code-reviewer` - Code review specialist
- `debugger` - Debugging specialist
- `extract-pattern` - Extract patterns from GitHub repos
- `frontend-engineer` - Frontend design engineer
- `plan-executor` - Execute implementation plans
- `vercel-debugger` - Vercel build/deployment debugging

## Installation

### Install a plugin

```bash
claude --plugin-dir /path/to/skills/ashby
```

### Install commands

```bash
cp commands/*.md ~/.claude/commands/
```

### Install agents

```bash
cp agents/*.md ~/.claude/agents/
```

## License

MIT
