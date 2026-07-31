# Homepage motion plans (Emil Kowalski skills)

Audit of the Shopify **homepage** (`templates/index.json`: hero → coffee-bean-roast → origin-sticky → brand-story → visit-workshop) against `emilkowalski/skills` (`improve-animations` + `review-animations` + `find-animation-opportunities`).

- **Commit stamped:** `18f64bd`
- **Stack:** Vanilla Liquid + GSAP 3 + ScrollTrigger + Lenis (desktop) + CSS keyframes
- **Personality:** Luxury specialty coffee — crisp, restrained delight on first paint; not playful bounce
- **Frequency:** Homepage is occasional/rare for first-time visitors (delight OK) but **returning shoppers** hit hero hover/scroll often — decorative mouse/hover motion must stay subtle or die

## Plans (execute in order)

| # | Title | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 001 | Stop competing writers on hero circle | HIGH | TODO | — |
| 002 | Gate/delete button hover scale; kill `transition: all` | HIGH | TODO | — |
| 003 | Skip `#main-content` page-enter when hero is present | MEDIUM | TODO | — |
| 004 | Tighten hero entrance (blur, duration, dead orb loop) | MEDIUM | TODO | 001 |

Recommended order: **001 → 002 → 003 → 004**.

Hand off: ask any agent to `improve-animations execute plans/001-…` (or implement the plan file directly), then re-run `review-animations` on the diff.

Do **not** change coffee-bean-roast scrub behavior (standing TCW rule) unless a plan explicitly says so — none of these do.
