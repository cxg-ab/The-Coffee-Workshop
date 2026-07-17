# Agent Handoff — Luxury Refresh (Head of Projects)

**Last verified:** 2026-07-17 (rewritten by Claude/Head against **live theme API read**, not Drive files)
**Store:** `7medyz-sn.myshopify.com` · The Coffee Workshop Co. · RAK, UAE
**Working theme (unpublished):** Luxury Refresh `#140498305120`
**Live storefront (do NOT edit without approval):** Coming Soon Only `#140499058784`
**Backup:** TCW Backup `#140533399648`
**Theme path:** `G:\My Drive\TCW V1.1\versions\v1.1.0\02-luxury-refresh`
**Preview:** https://7medyz-sn.myshopify.com?preview_theme_id=140498305120
**Editor:** https://7medyz-sn.myshopify.com/admin/themes/140498305120/editor
**Orchestration:** `G:\My Drive\TCW V1.1\AGENTS.md` + `TASK_BOARD.md` are the source of truth for roles & priorities.

---

## ⚠️ Read this first — sync truth

**Three copies can disagree:** (1) Google Drive files, (2) GitHub, (3) the live Shopify theme. They have drifted before.
- **Ground truth = the theme on Shopify.** Verify with an API/CLI read, never assume Drive == live.
- The Shopify **admin theme editor autosaves** and will silently overwrite `templates/*.json` (and section settings) pushed by CLI/API. If someone edits in the editor after your push, your push is gone.
- **Google Drive stale push:** `shopify theme push` from `G:\My Drive\...` can report success while Shopify keeps the old file. Push from a non-Drive copy under `C:\Users\User\tcw-luxury-push`, then pull-verify.
- After ANY change: re-read the file back from the theme and confirm the bytes.

---

## Current LIVE state (verified via theme file read, 2026-07-17)

### Homepage order (`templates/index.json`)
```
hero → home_trust → coffee_bean_roast → origin_story → brand_story → visit_workshop
```
Key live settings:
- **hero** — primary CTA `Shop beans → /collections/all`; secondary CTA `Visit us → #visit-workshop` (in-page anchor); `show_trust_line: true`.
- **home_trust** — `home-trust-bar` category strip (Single Origin · Micro-Lot · Exotic · Capsules · Drip).
- **coffee_bean_roast** — 203 frames, `scrub_vh: 190`, captions off. Fragile scroll-scrub; do not rework unless asked.
- **origin_story** — `origin-sticky`, 5 origin blocks (Ethiopia/Panama/Yemen/Colombia/Kenya) with images + split-title/clip choreography.
- **brand_story** — About-us glass values (Micro-lots / Master roasters / UAE specialty).
- **visit_workshop** — contact panel with parallax image + `Get directions`.

### Sections present locally (match live)
`hero, home-trust-bar, coffee-bean-roast, origin-sticky, home-shop-strip, home-shop-cta, brand-story, visit-workshop` + standard `main-*` templates (product, collection, cart, search, 404, page-about, page-faq, contact-form, policy), `header`, `footer`, `announcement-bar`.
Note: `home-shop-cta.liquid` exists as a file but is **not in the live order** (available, unused).

### Removed / banned (confirmed absent from live `order`)
- ❌ Coffee **subscriptions** — no page/section/CTA/nav. **Standing ban.** (`STANDING_ORDER_NO_SUBSCRIPTIONS.md`)
- ❌ `origins-marquee` (red live-dot) — deleted.
- ❌ `featured-collection` (old "SHOP – Featured beans") — deleted.
- ❌ `home_shop_strip` ("Shop specialty beans" rail) — **removed from `order` on Head's call (D-016, 2026-07-17).** File `sections/home-shop-strip.liquid` still exists but is unused; do not re-add without Head approval. Same for `sections/home-shop-cta.liquid` (never in live order).

---

## Recent verified work (Claude, 2026-07-17)

- **Motion Pack v2** (`assets/animations.js`): DIY SplitText word-masks (AR/RTL-safe) on hero + any `[data-split-title]`; origin-sticky clip reveal + image parallax scrub + copy stagger; PDP sticky gallery drift; `data-parallax` live (visit image, brand glow); GSAP page-transition (View Transitions stub removed) + bfcache back-nav fix.
- **Collection page (PLP)** (`sections/main-collection.liquid`): paginate (12/page, admin range), 8-option sort (native `?sort_by`, RTL-safe control), numbered pagination, split-title header, removed double-animation on cards.
- **Hero dead-end fix:** primary CTA → `/collections/all` (was bare `/collections`, no template = unstyled default page).
- **i18n:** EN + AR parity for all new PLP strings (`locales/en.default.json`, `ar.json`).

---

## Standing rules (all agents)

- No coffee subscriptions — ever.
- Do not reintroduce `origins-marquee`, `featured-collection`, or `home-shop-strip` (removed D-016) without Head approval.
- Prefer surgical diffs; match existing TCW patterns. Brand tokens (below) are fixed; do not invent colors/fonts.
- Do not break `coffee-bean-roast` scroll-scrub.
- Gate all motion with `prefers-reduced-motion` + `animations_enabled`.
- Live Coming Soon (`#140499058784`) ≠ Luxury Refresh (`#140498305120`). Always preview with `preview_theme_id=140498305120`.
- Bilingual EN + AR with RTL; every new user-facing string needs a key in **both** locale files.

### Brand tokens (do not invent)
bronze `#8B5E3C` · dark `#6B4428` · light `#C9A962` · canvas `#FAFAF8` · surface `#FFFFFF` · ink `#1A1A1A` · muted `#6B6B6B` · line `#E8E4DC`

### Design skill
UI/UX Pro Max is installed repo-wide (`.claude/`, `.cursor/`, … `skills/`). Use its design-system reasoning + pre-delivery checklist on UI work; **TCW brand tokens override its color/font suggestions.**

---

## Push & verify workflow (Drive-safe)

```powershell
# 1) Sync clean theme to a NON-Drive copy
#    C:\Users\User\tcw-luxury-push  (exclude bean_*.webp if large)
# 2) Edit there
# 3) Push only changed files
shopify theme push --store 7medyz-sn.myshopify.com --theme 140498305120 --path C:\Users\User\tcw-luxury-push --only <files>
# 4) Pull back / read file and confirm bytes + key strings
shopify theme pull --theme 140498305120 --only templates/index.json --force
```
API alternative (what Claude uses, editor-safe *unless* someone opens the editor after): `themeFilesUpsert` on `#140498305120` — allowed on unpublished themes only. **After any push, always re-read the file to confirm it stuck.**

---

## Known pitfalls

| Issue | Detail |
|-------|--------|
| Editor overwrite | Admin theme editor autosaves `index.json` + settings; clobbers CLI/API pushes made before the edit |
| Drive stale push | Local Drive file can report pushed but remote keeps old bytes → push from `C:\` copy |
| Wrong theme | Live Coming Soon has old layouts; only `#140498305120` has current work |
| Nested `<section>` | schema `"tag": "section"` + a liquid `<section>` = double wrapper |
| Orphan section files | `home-shop-cta.liquid` exists but unused; don't assume file presence = rendered |
| Locale drift | New strings pushed to only one of en/ar breaks the other language |

---

## Quick reference — important files

| File | Role |
|------|------|
| `templates/index.json` | Homepage composition (editor-owned — verify after push) |
| `sections/hero.liquid` | Hero; split-title; CTA links |
| `sections/home-trust-bar.liquid` | Category trust strip |
| `sections/coffee-bean-roast.liquid` | Roast scroll-scrub (fragile) |
| `sections/origin-sticky.liquid` | Origins; split-title + clip/parallax |
| `sections/home-shop-strip.liquid` | Featured-beans rail (⚠ open conflict) |
| `sections/brand-story.liquid` | About glass values |
| `sections/visit-workshop.liquid` | Visit contact panel + parallax image |
| `sections/main-collection.liquid` | PLP: sort + paginate + empty state |
| `sections/main-product.liquid` | PDP: sticky gallery, variant pills, AJAX add |
| `assets/animations.js` | GSAP Motion Pack v2 |
| `assets/application.css` | All section CSS (patch directly; npm build may fail on Drive) |
| `locales/en.default.json` / `ar.json` | i18n (keep in parity) |
| `_rollback/d020-ui-ux-full/ROLLBACK.md` | Older D-020 rollback notes |

---

## Success criteria for next agent

- [ ] Any push verified by reading the file **back from the theme**, not by CLI/API "success" alone.
- [x] `home_shop_strip` removed by Head (D-016, 2026-07-17); live order = 6 sections; Drive `index.json` reconciled.
- [ ] GitHub `index.json` synced to the live 6-section order (Cur — L-002) before next push.
- [ ] Roast scroll-scrub still works.
- [ ] EN + AR parity for any new strings; RTL checked.
- [ ] Coming Soon `#140499058784` untouched.
