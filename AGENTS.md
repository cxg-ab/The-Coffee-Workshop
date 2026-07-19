# TCW Agent Orchestration Protocol

> **Read this file first** before any Claude / Cursor / ChatGPT / Codex work on The Coffee Workshop.
> Goal: one shared brain — logic, UI/UX, brand, and delivery — without conflicting edits.
>
> **Standing order (all agents):** The store does **not** offer coffee subscriptions. Never add subscribe plans, subscription pages, “Subscribe & save”, or subscription CTAs. If found, remove them.

| Field | Value |
|-------|--------|
| **Project** | The Coffee Workshop Co. — Specialty Coffee (RAK, UAE) |
| **Version archive** | `R:\TCW V1.1` (this folder) |
| **Active theme pack** | `versions\v1.1.0\` |
| **Dev store** | `7medyz-sn.myshopify.com` |
| **GitHub** | https://github.com/cxg-ab/The-Coffee-Workshop |
| **Stack** | Shopify Liquid OS 2.0 + Tailwind + GSAP/ScrollTrigger/Lenis (vanilla JS) |
| **Not in stack** | React, Framer Motion / Motion React, Hydrogen (unless Head of Projects opens Phase 2) |
| **Hard product rule** | **NO coffee subscriptions** — no subscribe plans, CTAs, pages, nav links, FAQ offering subscriptions, or “subscribe & save” commerce. Do not reintroduce. (Footer email newsletter ≠ subscription product; label it “Join” / “Sign up”, never as a coffee plan.) |

---

## 1. Team roles (mandatory)

### Claude — Head of Projects

**Authority:** planning, prioritization, architecture decisions, acceptance of work.

| Owns | Does not do (default) |
|------|------------------------|
| Roadmaps, task breakdown, acceptance criteria | Force-push / git ops unless Cursor unavailable |
| Specs for sections, UX flows, copy tone | Blind coding without a written plan |
| Brand & logic consistency across pages | Running Shopify CLI when Cursor is available |
| Approving Pilot Gpt reports → assign fixes | Inventing new color systems or React deps |
| Deciding **what** ships and **in what order** | Skipping UI/UX / a11y / reduced-motion rules |

**When Claude starts a cycle:**

1. Read this file + latest `reports/PILOT-GPT-*.md` (if any).
2. Update `TASK_BOARD.md` (Done / In progress / Left).
3. Write a short **Mission Brief** (goal, files, constraints, definition of done).
4. Assign execution to **Pilot Cur** and/or review requests to **Pilot Gpt**.

---

### Cursor — Pilot Cur

**Authority:** primary executor in the IDE; GitHub; Shopify CLI; anything Claude cannot run locally.

| Owns | Rules |
|------|--------|
| Implement Liquid / CSS / `animations.js` / snippets / sections | Follow Mission Brief; no scope creep |
| `git` commit / push / PR to GitHub | Commit only when user/Claude asks; never force-push `main` unless user explicitly requests |
| `shopify theme pull` / `push` / `dev` / `check` | Target correct theme ID (see §3) |
| Fix runtime / CLI / auth / path / Drive issues | Prefer surgical diffs; match existing patterns |
| Apply corrections from Pilot Gpt reports | After Claude prioritizes, or when user says “fix from report” |
| Run builds (`npm run build`, theme check) | Respect Ask vs Agent mode; don’t invent deps |

**Pilot Cur checklist before push:**

- [ ] Brand tokens unchanged unless Head approved  
- [ ] EN + AR / RTL still coherent  
- [ ] `prefers-reduced-motion` honored for new motion  
- [ ] Theme editor hooks: `shopify:section:load` / refresh ScrollTrigger if needed  
- [ ] No React / Framer Motion added to Liquid theme  
- [ ] GitHub remote updated when user asks  

---

### ChatGPT — Pilot Gpt

**Authority:** independent QA / logic / UI-UX auditor (Codex or other sources allowed for research).

| Owns | Does not do |
|------|-------------|
| Full-site / multi-page logic review | Silently rewriting production without a report |
| Layout + animation + function connectivity audit | Pushing to GitHub or Shopify (that is Pilot Cur) |
| UI/UX critique vs brand + frontend design rules (§5) | Changing Head-of-Projects priorities |
| Writing **report MD** with findings + assigned fixer | Approving own work as “shipped” |

**Pilot Gpt must deliver a report** in:

```
R:\TCW V1.1\reports\PILOT-GPT-YYYY-MM-DD.md
```

Use the template in `reports/REPORT_TEMPLATE.md`.  
At the end of every report: **ask Claude or Cursor** to apply corrections, with a clear **Done / Left** section.

---

## 2. Operating loop (logic flow)

```text
┌─────────────────┐
│ Claude (Head)   │  Mission Brief + TASK_BOARD
└────────┬────────┘
         │
         ├──────────────► Pilot Cur: implement / CLI / GitHub
         │
         └──────────────► Pilot Gpt: audit (code + UX + page logic)
                              │
                              ▼
                    reports/PILOT-GPT-*.md
                              │
                              ▼
         Claude prioritizes ──► Pilot Cur fixes ──► Pilot Gpt re-check (optional)
                              │
                              ▼
                    TASK_BOARD updated ──► ship / push
```

1. **Plan** (Claude) → 2. **Build** (Cursor) → 3. **Audit** (ChatGPT) → 4. **Correct** (Cursor / Claude) → 5. **Close** (Claude marks Done).

Never skip the audit report when asking Pilot Gpt to “check the website.”

---

## 3. Paths, themes, and GitHub

### Local roots

| Path | Purpose |
|------|---------|
| `R:\TCW V1.1\` | Agent HQ, orchestration MD, reports, version archives |
| `R:\TCW V1.1\versions\v1.1.0\02-luxury-refresh\` | **LIVE theme** — Luxury Refresh `#140498305120`. ⚠️ **code-only partial pull** — `assets/` holds just `animations.js`, `application.css`, `application.js`; no binaries |
| `R:\TCW V1.1\versions\v1.1.0\01-coming-soon-only\` | Old live theme pull — Coming Soon Only `#140499058784`, now unpublished. **Stale + incomplete** (~90 bean frames vs 217 on Shopify). Approved for deletion — see §3.1 |
| `G:\My Drive\The Coffee workshop Website\` | Active Cursor workspace / GitHub clone root |
| GitHub | `https://github.com/cxg-ab/The-Coffee-Workshop` |

### Theme roles

| Theme | Role | Folder |
|-------|------|--------|
| **Luxury Refresh** `#140498305120` | **LIVE / published** storefront (store still password-gated / coming-soon splash to public) | `02-luxury-refresh` |
| Coming Soon Only `#140499058784` | Unpublished (was live before 2026-07-18) | `01-coming-soon-only` |
| TCW Backup `#140533399648` | Unpublished safety snapshot | — |

> **⚠️ Role flip (2026-07-18):** Luxury Refresh is now the LIVE theme. Coming Soon Only is unpublished. The public still sees a coming-soon page because **store password protection is ON** — the live theme is gated, not visible yet.

**Live-theme write rule (important):** Claude's Shopify Admin API (`themeFilesUpsert`) **refuses all file writes to the live/published theme** — safety policy, regardless of the password gate. So Claude can still *edit the Drive copy* and *read* the live theme, but **cannot push** to it. **Any change to Luxury Refresh must be pushed by Pilot Cur via Shopify CLI** (CLI can write live themes), or done by duplicating → editing the draft → publishing.

Default build target for feature work: **`02-luxury-refresh`** (now live — extra care; changes go through Cursor's CLI push).  
Do not change the published theme or turn off password protection without explicit user + Head approval.

### 3.1 Current live state — verified 2026-07-19 (read this before assuming anything)

All facts below were confirmed by direct Shopify Admin API read-back, not from memory or from the Drive copy.

**Store / storefront**

| Fact | Value |
|------|-------|
| Shop | The Coffee Workshop — `7medyz-sn.myshopify.com` |
| Primary domain | `https://thecoffeeworkshop.ae` |
| Password protection | **ON** — public sees a coming-soon splash; the live theme is gated, not yet visible |
| Coming-soon splash source | `02-luxury-refresh/layout/password.liquid` + `templates/password.liquid` (**served by the LIVE theme**, not by the `01-coming-soon-only` theme) |

**Assets — Shopify is the only complete source**

The live theme on Shopify holds the full binary set: **`bean_001` → `bean_217`** (217 frames — note the `coffee-bean-roast` schema text still says "203", it is out of date), plus `bean-roast-scroll.mp4`, `bean-roast-sheet.jpg`, `bean-roast-scroll-poster.jpg`, `hero-loop.mp4`, `logo-primary.png`.

Neither Drive folder is a complete backup: `02-luxury-refresh/assets/` is code-only (3 files), `01-coming-soon-only/assets/` has ~90 frames. **Treat Shopify as authoritative for assets.** If a true offline backup is wanted, run a full `shopify theme pull` of `#140498305120`.

**Head decision (2026-07-19):** local `01-coming-soon-only/` folder is approved for deletion — it is redundant and incomplete, and three copies exist in Shopify (live theme, unpublished Coming Soon `#140499058784`, TCW Backup `#140533399648`). **Do NOT delete the Shopify theme** — it stays as rollback.

**Shipped & verified live (session of 2026-07-17 → 18)**

- **Sticky site header, all pages (D-037)** — root cause was `#header-group` (only header-height) capping the inner header's `sticky top-0`, so the header scrolled away site-wide. Fixed by making the *wrapper* sticky: `#header-group { position: sticky; top: 0; z-index: 50 }`. Header now stays visible while scrolling and shrinks via `.is-compact` (>40px). The earlier hide-on-scroll-down behaviour (D-036) was **reverted** — the header must never hide.
- `header.liquid` also publishes `--tcw-header-h` (56/68px compact, 80/96px full) so sticky bars below it pin flush.
- Collection page: frozen toolbar (Filter left · pills centre · Sort right), AJAX category filtering with `history.pushState`, persistent **ALL** pill, Origin/Note/Process metafield filter, collapses to a minimal pills bar when pinned.
- Top nav = **SHOP · About · Contact** (Accessories/FAQ removed); SHOP target is merchant-editable via the Header setting `shop_link`.

**Open / staged, not yet live**

- **D-038** — `sections/origin-sticky.liquid`: reduced heading/sub/eyebrow/progress font sizes + shrank the `.origin-section-transition` fade (5rem→2.5rem desktop, 4rem→2rem mobile), as a scoped `<style>` block. **Edited on Drive, NOT pushed** (live-theme API block). Scroll-smoothness audit of that section came back clean — no jank fix needed.
- ⚠️ A `shopify theme pull` will **overwrite** that staged file. Push it first, or back it up.

**CSS rule (standing):** `assets/application.css` is ~85KB / 3000+ lines — too large to safely re-emit via `themeFilesUpsert`. All CSS changes go into scoped `<style>` blocks inside individual section files, or via CLI from a non-Drive path.

### CLI reminders (Pilot Cur)

```bash
# From versions/v1.1.0/
# Push a single staged file to the LIVE theme (CLI can write live; Claude's API cannot)
shopify theme push --store 7medyz-sn.myshopify.com --path 02-luxury-refresh --theme 140498305120 --only sections/origin-sticky.liquid

# Full push of the live theme
shopify theme push --store 7medyz-sn.myshopify.com --path 02-luxury-refresh --theme 140498305120

# Full pull incl. assets — makes the Drive copy a real offline backup.
# ⚠️ Overwrites locally staged edits. Push them first.
shopify theme pull --store 7medyz-sn.myshopify.com --path 02-luxury-refresh --theme 140498305120
```

Dev workspace theme push (if working from main project):

```bash
shopify theme push --path theme --theme <ID>
```

---

## 4. Technical truth (agents must obey)

### Motion / animation

- **Use:** GSAP + ScrollTrigger + Lenis + CSS (`animations.js`, section scripts).
- **Do not add:** Framer Motion / `motion/react` (requires React; wrong stack).
- Expand via `data-reveal`, `data-parallax`, ScrollTrigger pin/scrub, optional free GSAP plugins (SplitText, Flip, Observer).
- Always gate motion with `prefers-reduced-motion` and Theme setting `animations_enabled`.

### Frontend design rules (UI/UX hard rules)

Apply on branded / landing / promotional surfaces:

1. First viewport = **one composition** (not a dashboard).  
2. **Brand first** — brand must read as hero-level, not only nav.  
3. Expressive typography (no default Inter/Roboto/Arial/system as display).  
4. Atmosphere backgrounds (gradient / image / subtle pattern — not flat single color only).  
5. Full-bleed hero by default; no inset card heroes unless system requires it.  
6. Hero budget: brand + one headline + one short line + CTA group + one dominant image.  
7. No hero overlays (floating badges, promo chips).  
8. Cards only when needed for interaction.  
9. One job per section.  
10. Real product/place imagery as visual anchor.  
11. Reduce clutter (no pill clusters, stat strips, icon rows in hero).  
12. 2–3 intentional motions max for presence — not noise.  
13. Avoid AI-default looks: purple gradients, cream+terracotta cliché, broadsheet dense columns, dark-mode-by-default, glow spam, emoji decoration.  
14. Desktop **and** mobile must work.  
15. If editing existing theme: **preserve** established TCW patterns.

### Brand tokens (do not invent)

| Token | Hex |
|-------|-----|
| Brand bronze | `#8B5E3C` |
| Brand dark | `#6B4428` |
| Brand light | `#C9A962` |
| Canvas | `#FAFAF8` |
| Surface | `#FFFFFF` |
| Ink | `#1A1A1A` |
| Muted | `#6B6B6B` |
| Line | `#E8E4DC` |

Voice: luxury, bold, simple. Micro-lots, small-batch roast, RAK/UAE specialty. Bilingual EN + AR with RTL.

### Skills / docs to load

- Brand skill: project `.cursor/skills/coffee-workshop-brand/SKILL.md` (or `versions/v1.1.0/docs/`)  
- **UI/UX Pro Max** (standard for ALL projects): https://github.com/nextlevelbuilder/ui-ux-pro-max-skill — install globally (`uipro init --ai claude --global` / `--ai cursor --global`, or Claude plugin marketplace). Use its design-system reasoning + pre-delivery checklist on any UI work. TCW brand tokens (§4) still override its color/font suggestions.  
- `docs/brand-guidelines.md`, `docs/shopify-admin-setup.md`  
- GSAP skills (Cursor plugins) when editing `animations.js`  
- Shopify Liquid / theme CLI skills when touching theme structure  

---

## 5. Page & logic map (what Pilot Gpt must check)

Audit **connectivity**: nav → templates → sections → cart → locales → motion hooks.

| Area | Key files / templates | Logic to verify |
|------|----------------------|-----------------|
| Global shell | `layout/theme.liquid`, header, footer, cart-drawer | Logo, menus, locale, cart count, RTL `dir` |
| Home | `templates/index.json` | Section order; roast / origin / brand story coherence |
| Coming soon | `sections/coming-soon.liquid` | Live theme path; notify form |
| Product | `main-product`, `product.json` | Add to cart → drawer |
| Collection | `main-collection`, `product-card` | Cards, filters later |
| Cart | `main-cart`, drawer | Free shipping threshold AED 300 |
| Pages | about / FAQ / contact | Forms, reveals, links — **no subscriptions page** |
| Motion | `assets/animations.js`, roast section JS | Init, kill on section load, reduced motion |
| i18n | `locales/en.default.json`, `ar.json` | Keys exist; no hardcoded EN-only critical UI |

Pilot Gpt should flag: broken links, orphan sections, dead `data-*` hooks, animation that fights scroll, layout that fails mobile, brand violations, logic gaps (CTA → wrong URL, cart not updating, AR missing).

---

## 6. Report contract (Pilot Gpt)

Every audit creates:

`reports/PILOT-GPT-YYYY-MM-DD.md`

Must include:

1. **Scope** — which theme folder + which pages  
2. **Method** — files read / Codex / preview URL / browser  
3. **Findings** — severity: Blocker / High / Medium / Low  
4. **UI/UX notes** — against §4 design rules + brand  
5. **Logic / connectivity** — page-to-page flows  
6. **Animation / layout** — GSAP, CSS, pin/scrub issues  
7. **Ask for correction** — assign **Claude** (decide) or **Cursor** (implement) per item  
8. **Done vs Left** — checklist synced with `TASK_BOARD.md`  

After Cursor fixes, Pilot Gpt may write `reports/PILOT-GPT-YYYY-MM-DD-recheck.md`.

---

## 7. TASK_BOARD.md protocol

All three agents update `TASK_BOARD.md`:

- Claude: creates / reorders / closes tasks  
- Cursor: marks In progress → Done with short note + date  
- ChatGPT: adds findings as Left items; never deletes Head priorities without note  

Status values: `todo` | `doing` | `blocked` | `done` | `wontfix`

---

## 8. Conflict rules

1. **Head (Claude) wins** on product priority and architecture.  
2. **Pilot Cur wins** on how to execute in this environment (paths, CLI, git).  
3. **Pilot Gpt wins** on evidence in reports — Head/Cur must respond to Blockers before ship.  
4. One writer per file at a time; announce file locks in the Mission Brief when parallel.  
5. Do not duplicate animation libraries.  
6. Google Drive path quirks: if `npm`/git fails on Drive, Pilot Cur may copy to a local path and sync back.

---

## 9. Quick start prompts (copy-paste)

**To Claude (Head):**  
> Read `R:\TCW V1.1\AGENTS.md` and `TASK_BOARD.md`. You are Head of Projects. Plan the next mission for Luxury Refresh and update the board.

**To Cursor (Pilot Cur):**  
> Read `AGENTS.md`. You are Pilot Cur. Implement the Mission Brief / fix items assigned to Cursor. Push to GitHub only if I ask. Use Shopify CLI as needed.

**To ChatGPT (Pilot Gpt):**  
> Read `AGENTS.md`. You are Pilot Gpt. Audit `versions/v1.1.0/02-luxury-refresh` for layout, animation, UI/UX, and page logic. Write `reports/PILOT-GPT-<today>.md` using the template. End with Done/Left and ask Claude or Cursor to correct.

---

## 10. Document index

| File | Owner | Purpose |
|------|-------|---------|
| `AGENTS.md` | All | This protocol (source of truth for roles) |
| `TASK_BOARD.md` | Claude (+ updates by Cur/Gpt) | Done / Left tracker |
| `reports/REPORT_TEMPLATE.md` | Pilot Gpt | Audit template |
| `reports/PILOT-GPT-*.md` | Pilot Gpt | Dated audit reports |
| `versions/v1.1.0/README.md` | Cur | Theme CLI how-to |
| `versions/v1.1.0/manifest.json` | Cur | Theme IDs snapshot |

---

### ⏳ Pending Cursor push (open)

| Item | File | Command | Requested by | Date |
|------|------|---------|--------------|------|
| Origin sticky split — reduce intro font (heading/sub/eyebrow/progress) + shrink fade transition. Change staged in Drive `<style>` block; API blocked (live theme). | `02-luxury-refresh/sections/origin-sticky.liquid` | `shopify theme push --store 7medyz-sn.myshopify.com --path 02-luxury-refresh --theme 140498305120 --only sections/origin-sticky.liquid` | Head (Claude) | 2026-07-18 |

*Last updated: 2026-07-19 — TCW V1.1 agent orchestration (§3.1 current live state added: password gate, 217-frame asset truth, D-037 sticky header shipped, D-038 staged, 01-folder delete approved)*
