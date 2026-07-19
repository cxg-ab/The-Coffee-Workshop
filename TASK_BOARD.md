# TCW Task Board

> Updated by **Claude (Head)**, **Cursor (Pilot Cur)**, and **ChatGPT (Pilot Gpt)**.  
> Protocol: `AGENTS.md`

**Active target:** `versions/v1.1.0/02-luxury-refresh` — ⚠️ **NOW LIVE/published `#140498305120`** (store still password-gated). API writes to it are blocked → **Cursor pushes via CLI.**  
**Coming Soon Only** `#140499058784` — now unpublished (was live before 2026-07-18)  
**GitHub:** https://github.com/cxg-ab/The-Coffee-Workshop

---

## Done

| ID | Task | By | Date | Notes |
|----|------|----|------|-------|
| D-001 | Pull Coming Soon + Luxury Refresh into v1.1.0 | Cur | 2026-07-17 | Theme IDs in `manifest.json` |
| D-002 | Scaffold TCW V1.1 + npm/docs tooling | Cur | 2026-07-17 | `versions/v1.1.0/package.json` |
| D-003 | Push main project to GitHub | Cur | 2026-07-17 | `cxg-ab/The-Coffee-Workshop` |
| D-004 | Agent orchestration MD (this system) | Cur | 2026-07-17 | `AGENTS.md` + reports template |
| D-005 | Motion Pack v2 — DIY SplitText word masks (hero + `[data-split-title]`, AR/RTL safe) | Claude | 2026-07-17 | `animations.js` rewrite; closes old L-003 |
| D-006 | Origin sticky choreography (clip reveal + image parallax scrub + copy stagger) | Claude | 2026-07-17 | `origin-sticky.liquid` + JS |
| D-007 | PDP pinned gallery (desktop sticky + scrub drift) | Claude | 2026-07-17 | `main-product.liquid` |
| D-008 | `data-parallax` in real use (visit-workshop image, brand-story glow); title reveals on cart/search/404/FAQ | Claude | 2026-07-17 | 6 sections |
| D-009 | View Transitions stub removed; bfcache back-nav fix; editor-reload cleanup | Claude | 2026-07-17 | `animations.js` |
| D-010 | Pushed 10 files to Luxury Refresh theme `#140498305120` via Admin API | Claude | 2026-07-17 | Drive ⇄ Shopify in sync; GitHub NOT yet (see L-002) |
| D-011 | **P1 Home completion** — featured-collection + index order | Cur | 2026-07-17 | Pushed to `#140498305120` |
| D-012 | **P2 AJAX add-to-cart** — `/cart/add.js`, drawer open, header count, OOS errors | Cur | 2026-07-17 | `application.js` + PDP + product-card |
| D-013 | **No subscriptions** — remove all coffee-subscribe UX; agent ban in AGENTS.md | Cur | 2026-07-17 | Home CTA → Visit/About; FAQ rewritten; sections deleted |
| D-014 | **Home strip** — remove Featured beans + Origins marquee (red live dot) | Cur | 2026-07-17 | Unhooked from `index.json`; deleted section files; pushed `#140498305120` |
| D-015 | **Shop-beans dead-end fix + PLP complete (closes L-007)** — hero CTA `/collections/all` (was `/collections`, no template = unstyled default page); PLP sort (8 options), pagination (`paginate` 12/page + styled nav, RTL-safe), split-title, double-animation fix on cards; EN+AR keys | Claude | 2026-07-17 | 5 files pushed `#140498305120`; Drive ⇄ Shopify in sync |
| D-016 | **Visit Us + Footer polish** — Visit heading → "The Coffee Workshop in RAK" (EN+AR); removed logo placeholder card; Footer grid + link polish; brand name EN-only on AR pages | Cur | 2026-07-17 | See notes |
| D-017 | **About us glass rebuild** — compact glass panel, liquid blobs, 2-col copy + 3-col value cards; reduced section height; `brand-story.liquid` + CSS | Cur | 2026-07-17 | Pushed `#140498305120`; src CSS updated (npm build blocked on Drive) |
| D-018 | **Glass layout — Specialty Beans + Visit us** — shared `tcw-glass-*` system; dark glass origin sticky (intro panel + origin cards + liquid blobs); light glass visit panel (contact glass tiles + media frame) | Cur | 2026-07-17 | `origin-sticky.liquid`, `visit-workshop.liquid`, `application.css` → `#140498305120` |
| D-019 | **Specialty Beans glass rollback** — restored `origin-sticky.liquid` to previous non-glass sticky split layout | Cur | 2026-07-17 | Pushed section-only rollback to `#140498305120`; About + Visit glass remain |
| D-020 | **UI/UX Pro Max full homepage edit (P0–P2)** — trust bar, shop strip, mid-page CTA, hero Visit anchor + trust line, origin progress + transition, About glass simplify, Visit image + maps, glass contrast; rollback snapshot in `_rollback/d020-ui-ux-full/` | Cur | 2026-07-17 | Pushed `#140498305120`; revert via ROLLBACK.md or backup theme `#140533399648` |
| D-021 | **Roasted to order — UI/UX Pro Max** — brand gradient, 2-col layout, roast stage stepper, scroll hint, CTA, loader a11y, EN+AR | Cur | 2026-07-17 | `coffee-bean-roast.liquid` + CSS → `#140498305120` |
| D-022 | **Remove `home_shop_strip` (Head call)** — pulled "Shop specialty beans" rail from live `index.json` order; live home now 6 sections (hero → home_trust → roast → origin → brand → visit). Resolves D-014↔D-020 contradiction (D-020 had re-added a featured-beans rail the editor kept). Verified by theme read-back; Drive `index.json` reconciled to live. `AGENT_HANDOFF.md` rewritten to verified live state. | Claude | 2026-07-17 | API push `#140498305120` + read-back; `home-shop-strip.liquid`/`home-shop-cta.liquid` files kept but unused/banned |

---

## In progress

| ID | Task | Owner | Blocked by | Notes |
|----|------|-------|------------|-------|
| D-044 | **Repo moved to `R:\TCW V1.1` + cleanup prepared** (2026-07-19) — off Google Drive at last (Drive sync was the root cause of the stale-push + fork problems). Updated all `G:\My Drive\TCW V1.1` path refs → `R:\TCW V1.1` in `AGENTS.md` + `ANTIGRAVITY-SETUP.md`. Added `.gitignore` (ignores the 17 duplicate skill dirs, `.shopify/`, `*.gdoc`, `01-coming-soon-only/`). Added `cleanup.ps1` (dry-run by default, `-Execute` to apply) which removes the 17 duplicate AI-tool skill folders + the stale `01-coming-soon-only` copy. **Found: 3,060 files in repo, ~1,100 of them duplicate skill markdown across 19 editor config dirs** (`.agents .augment .claude .codebuddy .codewhale .codex .continue .cursor .factory .gemini .github .kilocode .kiro .opencode .qoder .roo .trae .warp .windsurf`) — same content 19×. Keeping `.claude` + `.gemini` only. | Claude | User to run `cleanup.ps1 -Execute` | ⚠️ Verify `R:` is a real local disk, not a RAM disk — RAM disks lose contents on reboot |
| D-043 | **Drive ⇄ live reconciliation — DONE (5 files)** (2026-07-19) — Drive had forked from live; overwrote Drive with live content read via API: `snippets/product-card.liquid` (now the `tcw-product-media` version), `sections/main-collection.liquid` (25.9KB monolith → live 14.7KB refactor), `sections/header.liquid` (+ trust-bar sticky rules), `sections/main-product.liquid` (reverted my `.pdp-media` edit), `sections/origin-sticky.liquid` (live body + D-038 style block re-applied — live has no `<style>` block there so it's a clean addition, not a conflict). **Drive now mirrors live for all touched files.** Remaining Drive-vs-live drift on files I did NOT touch is unverified — a full `shopify theme pull` is still the only way to guarantee 100% parity. | Claude | — | Product backdrop (D-041) NOT re-applied — must go on `.tcw-product-media` in `application.css`, which needs CLI |
| D-042 | **🛑 DRIFT ALERT — DO NOT PUSH staged `product-card.liquid`** (2026-07-19) — live theme read-back shows `snippets/product-card.liquid` now uses a **`tcw-product-media`** system (`--padded`, `--lift` modifiers, `tcw-product-media__img`), with those classes defined in the live `assets/application.css`. Cursor built + pushed this via CLI; the Drive copy predates it and still had `bg-canvas aspect-[4/5]` + `object-cover`. **Pushing the staged D-041 file would regress Cursor's work.** Also: `TCW Backup #140533399648` is gone; new unpublished **`The Coffee Workshop - Category Fix` #140548767840`** (product-card byte-identical to live = fresh duplicate). **Action:** `shopify theme pull` live first, then re-apply the studio-sweep backdrop to `.tcw-product-media` in `application.css` (single shared class → card + PDP in one edit) instead of per-file `<style>` blocks. | Claude (found) → **Cur** | — | Reinforces AGENTS.md rule: always read live before assuming Drive matches |
| D-041 | **⚠️ SUPERSEDED BY D-042 — do not push as-is.** Standard product image backdrop — bronze studio sweep + auto-centre — staged on a **stale** file — `snippets/product-card.liquid`: `.product-card__media` = studio sweep (radial light source top-centre over a `#F7F0E5`→`#E3D0B6` floor gradient) + a two-layer `::after` contact shadow that grounds the product; image z-indexed above it. Replaces `bg-canvas`. Chosen over a flat wash because it supplies a depth cue + matching light direction, and repeats across the grid as a horizon line. Rejected: espresso-dark (fights the `#FAFAF8` canvas / rule 13), warm linen (off-axis light clashes with product shadows). Image switched from Tailwind `object-cover` (was **cropping** products) to `object-fit: contain` + `object-position: center` + 11% padding (9% ≤640px) so any upload auto-centres and is never cropped. Backdrop is one CSS value → whole catalog restyles from one edit. Best paired with transparent-background (cutout) uploads. **PDP gallery matched** — `sections/main-product.liquid` gallery frame given `.pdp-media` with the identical sweep + contact shadow (replaces `bg-canvas`); it already used `object-contain` + flex-centring so no centring change needed. Card and PDP backdrops must be kept in sync — two files, one visual system. | Claude → **Cur to push** | Live-theme API write block | `shopify theme push ... --only snippets/product-card.liquid` · Upload standard: square 2048×2048, transparent PNG/WebP, ~10–12% padding, consistent scale + shadow direction |
| D-040 | ✅ **DONE 2026-07-19** — `cleanup.ps1 -Execute` removed **2,694 files** (3,062 → 368). Gone: 17 duplicate AI-tool skill dirs + local `01-coming-soon-only/`. Theme `02-luxury-refresh` verified fully intact afterwards (all 49 section/snippet/layout/template files, incl. the D-043 reconciled ones). Shopify theme `#140499058784` untouched and still unpublished as rollback, per Head decision. ~~Delete local `01-coming-soon-only` folder~~ — Head decision: local folder ONLY. Shopify theme `#140499058784` stays as unpublished rollback (do NOT delete from admin). **GATED on D-039** — do not delete until the bean frame set is confirmed present in `02-luxury-refresh/assets/`. Then update AGENTS.md §3 + `manifest.json`. | **Cur** | D-039 | Brief: `MISSION-BRIEF-2026-07-19-CUR.md` (M-03) |
| D-039 | **Pull live theme complete incl. assets** — Drive copy of `02-luxury-refresh/assets/` holds only 3 code files; the `bean_001…bean_N` scrub sequence (203 frames per schema) + `bean-roast-scroll.mp4` / `.jpg` posters exist locally ONLY inside `01-coming-soon-only/`, likely incomplete. Run `shopify theme pull --store 7medyz-sn.myshopify.com --path 02-luxury-refresh --theme 140498305120`. ⚠️ Pull will overwrite the staged `origin-sticky.liquid` — push D-038 first or back it up. Report actual frame count vs 203. | **Cur** | Must sequence with D-038 | Brief: `MISSION-BRIEF-2026-07-19-CUR.md` (M-01) |
| D-038 | **Origin sticky split — reduce intro font + shrink fade → STAGED, needs Cursor CLI push** — reduced heading/sub/eyebrow/progress font sizes and shrank the `.origin-section-transition` fade block (5rem→2.5rem desktop, 4rem→2rem mobile). Done as a scoped `<style>` block inside `sections/origin-sticky.liquid` (application.css untouched). Also audited the section for scroll smoothness: clean — sticky intro is pure CSS, progress = cheap per-card ScrollTrigger, clip reveal is `once`, only the image parallax is scrubbed (constant scale → compositor-friendly yPercent). No jank fix needed; no other change made. **API push BLOCKED (live theme) → Cursor must run:** `shopify theme push --store 7medyz-sn.myshopify.com --path 02-luxury-refresh --theme 140498305120 --only sections/origin-sticky.liquid` | Claude → **Cur to push** | Live-theme API write block | Verify on preview after push; optional `will-change` on parallax img left out per "no other change" |
| D-037 | **FIX: header now actually sticks all pages — SHIPPED** — root cause: header sat inside `#header-group` (only header-height), so its `sticky top-0` released after ~1 header of scroll and vanished on scroll-down site-wide. Fix: made `#header-group { position: sticky; top: 0; z-index: 50 }` (containing block now spans the page). Also reverted D-036 hide-on-scroll-down per user — header stays visible while scrolling, just shrinks (`.is-compact`). Collection bar top reverted to always = header height. Verified via theme read-back; layout checked (`theme.liquid`, no clipping ancestor). Files: `header.liquid`, `main-collection.liquid`. | Claude | 2026-07-17 | If still slipping: suspect Lenis/GSAP ancestor transform → deep audit |
| D-036 | **Smart sticky header (hide on scroll-down / reveal on scroll-up) — SHIPPED** (superseded by D-037) — header stays sticky; scrolling down past 200px slides it up (`translateY(-100%)`), scrolling up (or near top ≤60px) slides it back, compact. Direction detection via lastY delta, rAF-throttled. Collection frozen bar coordinates: `top` transitions to 0 when the header is hidden and back to header height when it returns (reads `.is-hidden`), so the toolbar rises to the top for max product room and no gap. Files: `header.liquid`, `main-collection.liquid` → verified. | Claude | 2026-07-17 | Thresholds: hide >200px down, reveal on up / ≤60px |
| D-035 | **Header + collection bar combine on scroll — SHIPPED** — when pinned, the collection header hides its title/hero and takes a translucent blur bg matching the site header, so the Filter·pills·Sort toolbar tucks flush under the shrunk nav as one seamless combined header. Full hero still shows at the top. `main-collection.liquid` (`.ch-title` wrapper + `.is-pinned` merge styles) → verified. | Claude | 2026-07-17 | Always-combined (drop hero entirely) available on request |
| D-034 | **Site header shrinks on scroll — SHIPPED** — sticky header now compacts once scrolled (>40px): inner height 80/96px → 56/68px, logo max-height 64/80px → 36/44px, subtle shadow; own rAF scroll listener toggles `.is-compact` (independent of GSAP). Collection sticky header re-syncs its `top` to the live site-header height every frame so no gap opens as it shrinks. Files: `header.liquid`, `main-collection.liquid` → verified. | Claude | 2026-07-17 | Logo hook = `.tcw-logo__img` |
| D-033 | **Collection toolbar (Filter · pills · Sort) + minimized frozen page title + persistent ALL pill — SHIPPED** — moved Filter (left) and Sort (right) into the same row as the centered pills; product count + filter panel live in the frozen header too (panel drops below the toolbar). Page title stays above the toolbar and shrinks to 1rem when pinned (no longer hidden). ALL pill now always rendered (aggregate = client-side reset, category page = link back to all-beans) so it's never removed when a category is selected. JS filter selectors moved to `document` (filter UI now outside `[data-plp]`). `main-collection.liquid` → verified. | Claude | 2026-07-17 | Mobile: pills wrap to their own row, Filter/Sort below |
| D-032 | **Frozen header collapses to minimal pills bar on scroll — SHIPPED** — scroll logic (`scrollY > 80` → `.is-pinned`) collapses the frozen collection header to just the pills (hides title, description, Arabic bg; trims padding to 0.5rem; smooth padding transition). Full hero shows only at the top; minimal pill bar while browsing. `main-collection.liquid` → verified. | Claude | 2026-07-17 | Threshold 80px |
| D-031 | **Frozen collection header + scrolling products (AJAX) — SHIPPED** — replaced the slim reveal-bar with a full `position: sticky` collection header (title + pills + description) pinned directly under the sticky site header (`z-30`; top synced to site-header height via JS, 80/96px). Products scroll underneath while the header + pills stay frozen; pills keep AJAX-filtering the grid in place. Removed the duplicate `cat-sticky` bar + its observer. `main-collection.liquid` → verified. | Claude | 2026-07-17 | If it doesn't pin, an ancestor `overflow`/`transform` is the cause; frozen header is tall — can compact (hide description when pinned) on request |
| D-030 | **Sticky category pill bar while scrolling — SHIPPED** — once the hero pills scroll under the site header, a slim frozen pill bar (`position: fixed`, blurred white, pinned at header height via `IntersectionObserver` on the hero `.cat-nav`) appears so shoppers keep filtering while scrolling. Duplicate pills share the same `data-cat` handlers → active state syncs both sets. `main-collection.liquid` → verified live. | Claude | 2026-07-17 | Alternative on request: freeze entire hero (title+pills) instead of slim bar |
| D-029 | **All-beans pills = instant client-side category filter (no reload) — SHIPPED** — on the aggregate page an "All" pill appears; clicking a category pill filters the grid in place (each card tagged `data-cats` from product tags ∩ the 5 categories), updates count + active pill, `history.pushState`s the category URL (shareable, back-button works), smooth-scrolls to grid. Coexists with the Origin/Note/Process metafield filter via a single unified `isVisible()`. Gated to aggregate pages (All pill present); real category pages keep their pills as normal links; a pill for a category not present on the page (e.g. Accessories on all-beans) still navigates. `main-collection.liquid` → verified; product tags confirmed present. | Claude | 2026-07-17 | Filtering acts on current page's items (per_page 12 ≥ all-beans 9) |
| D-028 | **Header pill bar removed; SHOP → direct link — SHIPPED** — removed the header pill bar (markup + CSS + toggle JS) entirely. "SHOP" is now a plain nav link to a merchant-selectable target (new Header setting `shop_link`, default `/collections/all-beans`), threaded header → nav-menu → shop-beans-nav-item. Category navigation lives solely on collection pages (pills under the title, D-027). Files: `header.liquid`, `shop-beans-nav-item.liquid`, `nav-menu.liquid` → verified. | Claude | 2026-07-17 | Set the exact SHOP destination in Theme editor → Header → "SHOP link target" |
| D-027 | **Pills repositioned below page name + lighter/outline style — SHIPPED** — category pills now render directly under the collection title (`main-collection.liquid`), recolored to light fill `rgba(255,255,255,.85)` + black (ink) outline (active = ink fill white). Header pill bar recolored to match and simplified to SHOP-toggle-only (removed auto-open on category pages + sessionStorage persistence + data-current-handle) so it no longer duplicates at the top. Files: `header.liquid`, `main-collection.liquid` → verified. | Claude | 2026-07-17 | Home: SHOP still reveals header bar; category pages use the under-title pills |
| D-026 | **Header restructure SHOP\|About\|Contact + pill bar over Arabic bg (UI/UX) — SHIPPED** — top nav now SHOP · About · Contact (forced fallback, `menu_handle: ''`; FAQ/Accessories removed from top). "SHOP" is a pure toggle (no dropdown) — opens the category pill bar at all breakpoints. Pills = Single Origin · Micro-Lot · Exotic · Capsules & Drip · Accessories (removed All-beans/"Shop beans" pill). Pill bar now renders over the `hero-arabic-bg` word field; pills given darker ink fill (hover brand-dark, active brand). Removed the duplicate in-page category pill row from `main-collection.liquid` (single pill set now). Files: `header.liquid`, `shop-beans-nav-item.liquid`, `nav-menu.liquid`, `main-collection.liquid` → verified read-back. | Claude | 2026-07-17 | Bar auto-opens on the 5 category pages + persists via sessionStorage; clears on About/Contact/other. `header.about`/`footer.contact` locale keys reused |
| D-025 | **Header pill-bar + PLP polish (UI/UX) — SHIPPED** — (1) desktop "Shop beans" now opens a category pill bar under the header; persists across bean-category navigation (sessionStorage `tcw-beans-open`), auto-open on bean category pages, clears when clicking Accessories/About/Contact/non-bean links; old vertical dropdown suppressed on desktop, kept on mobile (`header.liquid` + `shop-beans-nav-item.liquid`). (2) Removed "Shop Our Coffee" eyebrow from category pages. (3) Reduced category title (`.collection-header .hero-heading` clamp override — base `.hero-heading` hard-codes a big clamp). (4) Replaced tag subcat filter with a **collapsible metafield filter** (Origin / Note / Process from `coffee.*` metafields; client-side, AND across groups / OR within, badge + clear + empty state, bilingual). Pushed 3 files, verified read-back. | Claude | 2026-07-17 | Filter scope = current page (per_page 12 covers small collections); accessories added to category bar |
| D-024 | **Category-first collection pages (UI/UX) — SHIPPED** — collections confirmed as the 4 category pages (single-origin/micro-lot/exotic/capsules-drip, smart tag rules, already exist). Added to `main-collection.liquid`: (a) top category bar (All beans + 4 cats, bilingual via header locale keys, current highlighted); (b) tag-driven subcategory filter (any non-primary product tag → filter pill via Shopify native tag URLs — add a tag = add a subcategory, no new page); hero "Shop beans" CTA → `/collections/all-beans` (was flat `/collections/all`); empty-state link → all-beans. Pushed `main-collection.liquid` (13567 B) + `index.json`, verified read-back. | Claude | 2026-07-17 | Header "Shop beans ▸" dropdown items are the ADMIN nav menu (Online Store → Navigation) — merchant task, not theme; nav-menu.liquid already renders them if present |
| D-023 | **Visit Us → wide glass layout (UI/UX) — SHIPPED** — full-width frosted-glass panel (`backdrop-filter blur(22px)`, 2rem radius, brand-tinted atmospheric bg); contact details as 4-up row (Phone·Email·Address·Website) w/ translucent brand dividers, RTL-safe; larger title/lead. Styles moved into a **scoped `<style>` block inside `sections/visit-workshop.liquid`** (overrides old `application.css`) — pushed via API to `#140498305120`, verified read-back (9483 B). | Claude | 2026-07-17 | Also mirrored in Drive `application.css`; when Cur next does a full CSS CLI push, the inline block can stay or be removed (harmless duplicate). |
| L-001 | Full Pilot Gpt audit of Luxury Refresh (post D-014 strip) → `reports/PILOT-GPT-2026-07-17.md` | Gpt | — | Read-only; Mission Brief 2026-07-17b |
| L-006 | Cart logic: AED 300 free-shipping bar (main-cart + drawer), qty steppers, remove line | Cur | — | File lock: cart files → Cur; Mission Brief 2026-07-17b |
| L-002 | GitHub sync: Motion Pack v2 + P1/P2 + D-013/D-014 | Cur | — | Commit before starting L-006 |

---

## Left (backlog)

| ID | Task | Priority | Suggested owner | Source |
|----|------|----------|-----------------|--------|
| L-008 | EN/AR locale parity for all new strings + RTL sweep + reduced-motion verification | Medium | Gpt then Cur | Head (P5) |
| L-010 | PDP "You may also like" recommendations rail | Low | Cur | Head |
| L-011 | Contact form success/error states + map block | Low | Cur | Head |
| L-005 | Go-live checklist: Coming Soon → Luxury Refresh switch | Low | Claude | Head |

---

## Won't do

| ID | Task | Reason |
|----|------|--------|
| L-009 | Subscriptions page / app / waitlist | **Banned** — standing order NO subscriptions |

---

## Blocked

| ID | Task | Reason | Unblock |
|----|------|--------|---------|
| — | — | — | — |

---

## Last Mission Brief (Claude fills)

```
Date: 2026-07-17b
Standing orders (ALL agents — unchanged):
  1. NO coffee subscriptions — no plans, pages, CTAs, nav, FAQ. Newsletter "Join" only.
  2. Featured-collection + origins-marquee are REMOVED (D-014). Head confirms:
     out of scope — do not reintroduce unless Head explicitly reopens.

Goal: L-001 audit (Gpt) + L-006 cart polish (Cur), parallel. L-002 git sync first.
Theme: versions/v1.1.0/02-luxury-refresh (#140498305120)
Home order (source of truth): hero → coffee_bean_roast → origin_story → brand_story → visit_workshop

Assigned to Cur:
  1) L-002: commit + push everything current (Motion Pack v2, P1/P2 remnants,
     D-013/D-014 deletions) to GitHub BEFORE new edits — clean diff baseline.
  2) L-006: AED 300 free-shipping progress bar in BOTH main-cart.liquid and
     snippets/cart-drawer.liquid; qty +/- steppers; remove-line link; all wired
     to the P2 AJAX layer (/cart/change.js) — live update, no reload.
     Threshold = theme setting (settings_schema.json), NOT hardcoded.
     Strings via | t with keys in en.default.json AND ar.json; RTL-safe bar
     (use logical properties / dir-aware transform).
  Definition of done: add item → drawer opens showing progress toward AED 300;
     hit 300 → celebratory "free shipping unlocked" state; qty edits update
     totals + bar live; empty cart state correct; mobile + AR/RTL verified;
     shopify theme check clean.
  File locks (Cur only): main-cart.liquid, cart-drawer.liquid, application.js,
     settings_schema.json, locales/*.json.

Cur update (2026-07-17, D-016 — post-brief, user-requested):
  Visit Us: heading now "The Coffee Workshop in RAK"; logo/brand placeholder card
    REMOVED — when no image is set the content column centers (max-w-2xl), and when
    an image IS set it returns to the 2-col grid with parallax. No dead empty card.
  Footer: phone (+971…) and email (info@…) text lines removed from the brand column
    (email still reachable via the bottom social icon + Support→Contact link). Grid
    rebalanced brand 3 / shop 2 / support 2 / legal 2 / news 3; new .tcw-footer-links
    style (inline-block rows, hover slide, dir-aware for RTL). AR heading translated.
  Gpt: please re-verify footer alignment + RTL slide direction, and that Visit Us
    reads well with NO image (current state) and WITH an image if one is later set.

Assigned to Gpt (read-only — do NOT edit theme files):
  L-001 full audit per AGENTS.md §5–§6 → reports/PILOT-GPT-2026-07-17.md
  Scope: home, product, collection, cart+drawer, about, contact, FAQ, 404, search.
  Preview: https://7medyz-sn.myshopify.com?preview_theme_id=140498305120
  Must verify: (a) NO Featured beans section, NO red-dot marquee, NO subscription
  traces (nav/FAQ/locales/templates); (b) hero CTA "Shop beans" target — where
  does it land now that home has no shop section? (collection URL expected);
  (c) Motion Pack v2: split-title FOUC, origin clip/parallax, PDP sticky gallery
  on short viewports, reduced-motion leaves no hidden text; (d) EN/AR parity +
  RTL; (e) dead data-* hooks left over from removed sections.
  Note: cart files are being edited by Cur in parallel — report cart findings
  as advisory, tagged [cart-in-flight], don't file as blockers unless logic-breaking.

Out of scope: publishing live, collection filters, recommendations rail (L-010),
  anything React/Framer Motion, reintroducing removed sections.
```

---

*Keep this board short. Details live in `reports/`.*
