# Claude Toolkit

Personal Claude Code plugin marketplace. Install to get access to custom agents, commands, skills, and plugins.

## Installation

```bash
claude plugin install jjeremycai/claude-toolkit
```

Or manually:
```bash
git clone https://github.com/jjeremycai/claude-toolkit.git
claude --plugin-dir /path/to/claude-toolkit
```

## Structure

```
claude-toolkit/
├── plugins/           # MCP-based plugins
│   └── ashby/         # Ashby ATS integration
├── agents/            # Specialized agents
├── commands/          # Slash commands
└── skills/            # Knowledge skills
```

## Plugins

| Plugin | Description |
|--------|-------------|
| [ashby](./plugins/ashby/) | Ashby ATS integration - manage candidates, jobs, interviews |

## Agents

| Agent | Description |
|-------|-------------|
| ashby-recruiter | Recruiting pipeline management |
| auditor | Codebase audit for simplicity |
| auth-expert | Auth debugging (PKCE, OAuth, sessions) |
| code-reviewer | Code review for quality and security |
| debugger | Error and test failure debugging |
| extract-pattern | Extract patterns from GitHub repos |
| frontend-engineer | High-quality UI development |
| plan-executor | Execute implementation plans |
| vercel-debugger | Vercel build/deployment debugging |

## Commands

| Command | Description |
|---------|-------------|
| `/beads-execute` | Execute Beads tickets |
| `/beads-write` | Generate Beads tickets |
| `/candidates` | Search Ashby candidates |
| `/ios-release` | Build and upload iOS app |
| `/jobs` | Search Ashby jobs |
| `/new-pr` | Create PR from changes |
| `/pipeline` | View Ashby recruiting pipeline |
| `/review-pr` | Senior engineer PR review |
| `/schedule` | Schedule Ashby interview |
| `/verify-changes` | Verify PR feedback addressed |

## Skills

| Skill | Description |
|-------|-------------|
| ashby-api-guide | Ashby API documentation |
| ashby-workflows | Recruiting workflow guidance |
| cto-audit | CTO-level codebase audit |
| frontend-design | Frontend engineering skill |

## License

MIT
