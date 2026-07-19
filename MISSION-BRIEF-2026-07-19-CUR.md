# Mission Brief — Pilot Cur — 2026-07-19

**From:** Claude (Head of Projects)
**To:** Cursor (Pilot Cur)
**Protocol:** `AGENTS.md`
**Priority:** M-01 blocks M-03. Do them in order.

---

## Context (read before starting)

Theme roles **flipped** on 2026-07-18:

| Theme | ID | Role |
|-------|----|------|
| **Luxury Refresh** | `140498305120` | **LIVE / published** (store still password-gated) |
| Coming Soon Only | `140499058784` | Unpublished (was live) |
| TCW Backup | `140533399648` | Unpublished snapshot |

**Why Claude can't do these tasks:** the Shopify Admin API refuses all `themeFilesUpsert` writes to a published theme. Claude can read the live theme and edit the Drive copy, but cannot push. CLI can. That's why these are yours.

**Known gap:** `versions/v1.1.0/02-luxury-refresh/assets/` on Drive contains only 3 files (`animations.js`, `application.css`, `application.js`). It is a **code-only partial pull** — the binary assets were never pulled down. The live `coffee-bean-roast` section depends on a `bean_001…bean_N` frame sequence (schema says **203 frames**), plus `bean-roast-scroll.mp4`, `bean-roast-sheet.jpg`, `bean-roast-scroll-poster.jpg`. Locally those exist **only** inside `01-coming-soon-only/assets/`, and likely as an incomplete subset.

---

## M-01 — Pull the live theme complete (assets included) — **DO FIRST**

**Goal:** make the Drive copy of `02-luxury-refresh` a full, faithful mirror of the live theme, so we hold a real offline backup before anything gets deleted.

```bash
# from G:\My Drive\TCW V1.1\versions\v1.1.0
shopify theme pull --store 7medyz-sn.myshopify.com --path 02-luxury-refresh --theme 140498305120
```

**⚠️ Before you run it — protect staged work.** `sections/origin-sticky.liquid` on Drive contains an unpushed change (see M-02). A pull will **overwrite it** with the live version. So either:
- run **M-02 first** (push, then pull), or
- back the file up, pull, then re-apply.

Do not lose that edit.

**Definition of done:**
- [ ] `02-luxury-refresh/assets/` contains the `bean_*.webp` frame sequence
- [ ] Report the **actual frame count** pulled and whether it reaches 203 — if Shopify holds fewer than 203, say so, that's a real finding
- [ ] `bean-roast-scroll.mp4`, `bean-roast-sheet.jpg`, `bean-roast-scroll-poster.jpg` present
- [ ] Note in `TASK_BOARD.md` under D-039 what landed
- [ ] Do **not** delete anything yet

---

## M-02 — Push staged origin-sticky change (D-038)

**Goal:** ship the font/fade trim on the Origin sticky split section.

**File:** `02-luxury-refresh/sections/origin-sticky.liquid` — already edited on Drive, verified, ready.

**What it contains:** a scoped `<style>` block at the top of the section reducing heading / subheading / eyebrow / progress-pill font sizes, and shrinking `.origin-section-transition` (fade block) from 5rem→2.5rem desktop, 4rem→2rem mobile. `application.css` deliberately untouched.

```bash
shopify theme push --store 7medyz-sn.myshopify.com --path 02-luxury-refresh --theme 140498305120 --only sections/origin-sticky.liquid
```

**Definition of done:**
- [ ] Push succeeds; verify by read-back, not by trusting "success" (Drive can serve stale files)
- [ ] Visually confirm on the storefront: heading smaller, fade band thinner
- [ ] No other visual change to the section
- [ ] Mark D-038 done in `TASK_BOARD.md` with date

---

## M-03 — Delete `01-coming-soon-only` — **ONLY after M-01 passes**

**Head decision:** local folder only. The Shopify theme `#140499058784` **stays** as an unpublished rollback copy — do NOT delete it from admin.

**Gate:** do not proceed unless M-01 confirmed the bean frames now live in `02-luxury-refresh/assets/`. If the pull came back short of the full frame set, **stop and report** — deleting would destroy our only local copy.

```bash
# only after the gate above is satisfied
# G:\My Drive\TCW V1.1\versions\v1.1.0\01-coming-soon-only
```

**Definition of done:**
- [ ] `01-coming-soon-only/` removed from Drive
- [ ] Shopify theme `#140499058784` still exists, still unpublished — confirm in admin
- [ ] `AGENTS.md` §3 theme table + `versions/v1.1.0/manifest.json` updated to drop the local folder reference (keep the theme ID documented as an unpublished rollback)
- [ ] `TASK_BOARD.md` D-040 closed with date

---

## Constraints (standing — all tasks)

- **NO coffee subscriptions** anywhere. Ban is absolute.
- Do **not** publish, unpublish, or change theme roles.
- Do **not** turn off store password protection.
- Do **not** reintroduce `origins-marquee`, `featured-collection`, or `home-shop-strip`.
- No React / Framer Motion in the Liquid theme.
- Brand tokens unchanged; EN + AR / RTL must stay coherent.
- Verify every push by read-back — Google Drive can serve stale files mid-push.
- Commit to GitHub only if the user asks.

## Report back

Update `TASK_BOARD.md` (D-038, D-039, D-040) and tell Head:
1. Frame count actually pulled vs the expected 203
2. Whether origin-sticky pushed and verified clean
3. Whether the delete gate passed or you stopped
