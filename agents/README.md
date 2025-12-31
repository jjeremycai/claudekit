# Claude Code Agents

Custom agents for Claude Code Task tool.

## Agents

| Agent | Description |
|-------|-------------|
| `auditor` | Deep codebase audit for simplicity and functionality |
| `auth-expert` | Auth debugging expert for PKCE, cookies, sessions, OAuth, redirects |
| `code-reviewer` | Expert code review specialist for quality, security, maintainability |
| `debugger` | Debugging specialist for errors, test failures, unexpected behavior |
| `extract-pattern` | Extract implementation patterns from your GitHub repos |
| `frontend-engineer` | Frontend design engineer for high-quality, distinctive UI |
| `plan-executor` | Execute detailed implementation plans with surgical precision |
| `vercel-debugger` | Diagnose and fix Vercel build/deployment failures |

## Installation

Copy the `.md` files to your Claude Code agents directory:

```bash
cp *.md ~/.claude/agents/
```

Or symlink the directory:

```bash
ln -s /path/to/agents ~/.claude/agents
```
