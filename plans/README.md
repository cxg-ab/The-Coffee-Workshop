# Homepage motion plans (Emil Kowalski skills)

Audit of the Shopify **homepage** (`templates/index.json`: hero → coffee-bean-roast → origin-sticky → brand-story → visit-workshop) against `emilkowalski/skills` (`improve-animations` + `review-animations` + `find-animation-opportunities`).

- **Commit stamped:** `18f64bd` (plans); implemented on later `main`
- **Stack:** Vanilla Liquid + GSAP 3 + ScrollTrigger + Lenis (desktop) + CSS keyframes
- **Personality:** Luxury specialty coffee — crisp, restrained delight on first paint; not playful bounce

## Plans (execute in order)

| # | Title | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 001 | Stop competing writers on hero circle | HIGH | DONE | — |
| 002 | Gate/delete button hover scale; kill `transition: all` | HIGH | DONE | — |
| 003 | Skip `#main-content` page-enter when hero is present | MEDIUM | DONE | — |
| 004 | Tighten hero entrance (blur, duration, dead orb loop) | MEDIUM | DONE | 001 |

Implemented in: `theme/assets/animations.js`, `theme/assets/application.css`, `theme/sections/hero.liquid`, `theme/snippets/css-variables.liquid`.
