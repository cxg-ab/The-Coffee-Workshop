# Project Skills

Skills saved into this repo so they travel with the project and auto-load for
anyone working on the theme. Canonical copies live in **`.agents/skills/`**
(skills CLI lockfile) and are mirrored into **`.claude/skills/`** for Claude Code.

Install / refresh:

```bash
npx skills add <owner/repo> --skill <name> -a cursor -a claude-code --copy -y
npx skills list
npx skills update -y
```

Registry: https://skills.sh · CLI: https://github.com/vercel-labs/skills

---

## DESIGN.md brand library (VoltAgent)

**Source:** [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT · 74 brands)

Not a `SKILL.md` package — curated **DESIGN.md** files (Google Stitch format). Installed at **`design-md/<brand>/DESIGN.md`**.

```bash
cp design-md/starbucks/DESIGN.md ./DESIGN.md   # activate one brand for agents
```

See `design-md/README.md`. Keep TCW bronze / `#FAFAF8` identity; use these as references.

---

## Animation quality (GSAP + motion craft)

### greensock/gsap-skills (official, MIT · ~12.7k★)
https://github.com/greensock/gsap-skills · https://skills.sh/greensock/gsap-skills

| Skill | Use for |
|-------|---------|
| `gsap-core` | Tweens, easing, stagger, `matchMedia` / reduced-motion |
| `gsap-timeline` | Sequencing, labels, nesting |
| `gsap-scrolltrigger` | Scrub, pin, parallax, refresh/cleanup |
| `gsap-performance` | 60fps, transform-over-layout, jank / will-change |
| `gsap-plugins` | Plugin registration, SplitText, Flip, Draggable, etc. |
| `gsap-utils` | `clamp`, `mapRange`, `quickTo` helpers |
| `gsap-react` / `gsap-frameworks` | React/Vue/Svelte lifecycle (other projects) |

**TCW tip:** for hero shake / roast scrub / Lenis issues, start with
`gsap-performance` + `gsap-scrolltrigger`.

### emilkowalski/skills (MIT · ~23k★)
https://github.com/emilkowalski/skills · https://skills.sh/emilkowalski/skills

| Skill | Use for |
|-------|---------|
| `review-animations` | Critique motion code against a high craft bar |
| `improve-animations` | Prioritized motion audit + implementation plans |
| `find-animation-opportunities` | Where motion is missing (read-only proposals) |
| `animation-vocabulary` | Name a motion effect from a vague description |
| `emil-design-eng` | UI polish / design-engineering philosophy |

---

## Audit & UI quality

### AccessLint/skills (MIT) — already in repo
https://github.com/AccessLint/skills

- `audit` — WCAG 2.2 find (and optionally fix)
- `scan` — live page → selector + file:line
- `diff` — new/fixed violations vs baseline

Runtime: `@accesslint/mcp` + (for scan/diff) debuggable Chrome + a live URL.

### pbakaus/impeccable (Apache-2.0 · ~53k★)
https://github.com/pbakaus/impeccable · https://skills.sh/pbakaus/impeccable

- `impeccable` — frontend design/audit/polish (hierarchy, a11y, motion, tokens).
  Skills.sh marks **Med Risk** (review scripts before running); still widely used.

### vercel-labs/agent-skills — `web-design-guidelines`
https://github.com/vercel-labs/agent-skills

- UI / a11y / UX checklist review (“audit this page / component”).

### nextlevelbuilder/ui-ux-pro-max-skill (MIT)
- Searchable UI/UX style / palette / motion presets database (`scripts/search.py`, Python 3).

---

## Suggested prompts for this storefront

- “Use **gsap-performance** + **review-animations** on `theme/assets/animations.js` — hero circle hover flash.”
- “Use **improve-animations** for a prioritized motion audit of the homepage.”
- “Use **impeccable** / **web-design-guidelines** to audit the login page.”
- “Use **audit** / **scan** on the password Coming Soon page.”

All third-party skill content retains its original license from the source repos.
