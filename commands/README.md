# Claude Code Commands

Custom slash commands for Claude Code.

## Commands

| Command | Description |
|---------|-------------|
| `/beads-execute` | Execute Beads tickets with subagent parallelization |
| `/beads-write` | Generate Beads tickets for a project based on codebase analysis |
| `/ios-release` | Build and upload iOS app to App Store Connect or TestFlight |
| `/new-pr` | Create a new PR from current changes with smart branch/target detection |
| `/review-pr` | Thorough senior engineer PR review with actionable feedback |
| `/verify-changes` | Verify that PR feedback has been properly addressed before merge |

## Installation

Copy the `.md` files to your Claude Code commands directory:

```bash
cp *.md ~/.claude/commands/
```

Or symlink the directory:

```bash
ln -s /path/to/commands ~/.claude/commands
```
