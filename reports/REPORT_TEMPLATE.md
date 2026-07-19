# Pilot Gpt Report Template

Copy to: `reports/PILOT-GPT-YYYY-MM-DD.md`

---

# Pilot Gpt Audit — YYYY-MM-DD

| Field | Value |
|-------|--------|
| **Auditor** | Pilot Gpt (ChatGPT / Codex) |
| **Theme folder** | e.g. `versions/v1.1.0/02-luxury-refresh` |
| **Preview / live URL** | |
| **Related Mission Brief** | (from TASK_BOARD) |
| **Protocol** | `../AGENTS.md` |

## 0. Product bans (fail if present)

- [ ] No coffee subscription section / page / CTA / nav / “subscribe & save”
- [ ] FAQ does not offer subscription plans
- [ ] Hero secondary CTA is not Subscribe → `/pages/subscriptions`

## 1. Scope

- Pages / templates reviewed:
- Sections reviewed:
- Animation files reviewed:
- Out of scope:

## 2. Method

- [ ] Read Liquid / JS / CSS locally  
- [ ] Codex / docs research  
- [ ] Browser / preview check  
- [ ] Theme check / CLI output  
- Notes:

## 3. Findings

### Blockers

| # | Finding | File / page | Ask |
|---|---------|-------------|-----|
| B1 | | | Claude decide / Cursor fix |

### High

| # | Finding | File / page | Ask |
|---|---------|-------------|-----|
| H1 | | | |

### Medium / Low

| # | Finding | File / page | Ask |
|---|---------|-------------|-----|
| M1 | | | |

## 4. UI / UX review

Against `AGENTS.md` §4 (hero budget, brand-first, clutter, motion, mobile, brand tokens):

| Check | Pass / Fail | Notes |
|-------|-------------|-------|
| Brand-first first viewport | | |
| Hero budget / no clutter | | |
| Cards only when needed | | |
| Motion intentional (2–3), reduced-motion OK | | |
| Desktop + mobile | | |
| Tokens / no purple-AI cliché | | |
| EN + AR / RTL | | |

## 5. Logic & page connectivity

| Flow | Status | Notes |
|------|--------|-------|
| Home → Shop / About (or Visit) CTAs | | |
| Collection → Product → Add to cart → Drawer | | |
| Header cart count | | |
| Footer links / newsletter | | |
| Locale switch EN ↔ AR | | |
| Coming soon notify (if live theme) | | |
| Animation init / section reload in editor | | |

## 6. Animation & layout

| Area | Status | Notes |
|------|--------|-------|
| `animations.js` coverage vs `data-*` hooks | | |
| ScrollTrigger pin/scrub (roast / sticky) | | |
| Lenis + ScrollTrigger sync | | |
| CSS marquees / conflicts | | |
| Performance (transform/opacity only) | | |

## 7. Correction requests

**Claude (Head) — decide / prioritize:**

1. …

**Cursor (Pilot Cur) — implement:**

1. …  
2. …

## 8. Done vs Left (this audit cycle)

### Done (verified OK)

- [ ] …

### Left (must fix or track on TASK_BOARD)

- [ ] … → owner: Cur / Claude  
- [ ] … → owner: Cur / Claude  

## 9. Sign-off

| Role | Action needed |
|------|----------------|
| Claude | Update `TASK_BOARD.md` from §8 |
| Cursor | Apply §7 Cur items; push only if user asks |
| Pilot Gpt | Optional recheck report after fixes |

---

*End of report — do not ship Blockers without Head + Cur response.*
