# Project Skills

Skills saved into this repo so they travel with the project and auto-load for
anyone working on the theme (Claude Code picks up `.claude/skills/*/SKILL.md`).

## ui-ux-pro-max
- **Source:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT © Next Level Builder)
- **What:** UI/UX design intelligence — a searchable local database of styles,
  color palettes, font pairings, product-type reasoning, UX guidelines, icons,
  motion presets, and chart types across many stacks.
- **Runtime:** the CLI searches (`scripts/search.py`) need **Python 3** (standard
  library only, no network). Without Python you can still use the Quick Reference
  in `SKILL.md` / `references/`.

## AccessLint (audit, scan, diff)
- **Source:** https://github.com/AccessLint/skills (MIT)
- **What:** WCAG 2.2 accessibility skills.
  - `audit` — find and (optionally) fix accessibility issues; can audit HTML.
  - `scan` — audit a live page and locate each violation (DOM selector → file:line).
  - `diff` — diff a live page's violations against a baseline/branch.
- **Runtime:**
  - `audit` uses the AccessLint MCP server (`@accesslint/mcp`), wired up in the
    repo's `/.mcp.json`. It runs via `npx` and needs Node.js + network access on
    first run to fetch the package.
  - `scan` / `diff` drive a live page over Chrome DevTools Protocol, so they need
    a **running dev server / URL** and a debuggable **Chrome/Chromium**. These are
    aimed at live web apps; for this Shopify theme they're most useful when
    previewing a rendered page.

All content retains its original MIT license from the source repositories above.
