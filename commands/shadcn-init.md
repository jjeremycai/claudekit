---
description: Set up shadcn/ui with Base UI or Radix, visual styles, and theming
argument-hint: [--new | --existing]
allowed-tools: Bash, Read, Glob, Grep, AskUserQuestion, WebFetch
---

# shadcn/ui Setup Wizard

This skill guides setup of shadcn/ui with the latest features (Dec 2025+):
- **Base UI support** - Alternative to Radix, single `@base-ui-components/react` package
- **5 visual styles** - Vega, Nova, Maia, Lyra, Mira
- **Theming** - Base colors, icon libraries, fonts, radius

## Quick Reference

### Visual Styles
| Style | Description | Best For |
|-------|-------------|----------|
| **Vega** | Classic shadcn look | General purpose |
| **Nova** | Compact padding/margins | Data-dense layouts |
| **Maia** | Soft, rounded, generous spacing | Consumer apps |
| **Lyra** | Boxy, sharp edges | Pairs with mono fonts |
| **Mira** | Ultra-compact | Dense interfaces, dashboards |

### Component Libraries
| Library | Notes |
|---------|-------|
| **Base UI** | Recommended. Modern, single package, better primitives (render prop vs asChild) |
| **Radix** | Original default. More mature but less actively maintained |

### Presets
Format: `{library}-{style}` e.g., `base-lyra`, `radix-vega`

Available: `base-vega`, `base-nova`, `base-maia`, `base-lyra`, `base-mira`, `radix-vega`, `radix-nova`, `radix-maia`, `radix-lyra`, `radix-mira`

## Step 1: Determine Project Type

Ask user:
```
Is this a NEW project or EXISTING project?
- New: Will use `npx shadcn create <name>` to scaffold from scratch
- Existing: Will use `npx shadcn init` to add shadcn to current project
```

## Step 2: Component Library

Ask user:
```
Which component library?
- Base UI (Recommended) - Modern primitives, actively maintained, single package
- Radix - Original shadcn default, mature but less active development
- Keep existing - Don't change (only for existing projects with shadcn already)
```

## Step 3: Visual Style

Ask user:
```
Which visual style?
- Vega - Classic shadcn look
- Nova - Compact layouts
- Maia - Soft and rounded
- Lyra - Boxy and sharp (pairs well with mono fonts)
- Mira - Dense interfaces
```

## Step 4: Additional Options

Ask about:
- **Base Color**: neutral, gray, zinc, stone, slate
- **Theme**: neutral, scaled, or custom
- **Icon Library**: lucide (default), hugeicons
- **Font**: inter (default), geist, jetbrains-mono (good with Lyra)
- **Radius**: default, or specify

## Step 5: Execute Setup

### For NEW projects:
```bash
npx shadcn@latest create <project-name> --template <vite|next|start> --preset <library-style>
```

Example:
```bash
npx shadcn@latest create my-app --template vite --preset base-lyra
```

### For EXISTING projects:
```bash
npx shadcn@latest init --force
```

Then configure via prompts or use flags.

## Step 6: Add Components

After init, add components:
```bash
npx shadcn@latest add button card dialog
npx shadcn@latest add --all  # Add everything
```

## Common Issues

### Registry 400 Error
If `--preset` fails with registry error:
1. Try the interactive web configurator: `https://ui.shadcn.com/create?base=base&style=lyra`
2. Use the interactive CLI without `--preset` flag
3. Check shadcn GitHub issues for known outages

### Tailwind v4 Compatibility
shadcn now supports Tailwind v4's CSS-native `@theme` configuration. No `tailwind.config.js` needed.

### Monorepo Setup
For monorepos, run from the package directory:
```bash
cd packages/web
npx shadcn@latest init
```

## Files Created/Modified

- `components.json` - shadcn configuration
- `src/components/ui/` - Component files
- `src/lib/utils.ts` - cn() utility
- `src/index.css` or `app/globals.css` - CSS variables and theme

## Interactive Configurator

If CLI has issues, use the web UI:
```
https://ui.shadcn.com/create?base=base&style=lyra
```

Configure options, then click "Create Project" to get the exact CLI command.
