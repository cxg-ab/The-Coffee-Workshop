# The Coffee Workshop — Project Plan

> **Status:** Week 1 in progress — foundation scaffolded  
> **MVP target:** 30 days  
> **Last updated:** July 7, 2026

---

## 1. Executive Summary

**The Coffee Workshop** is a premium UAE-focused coffee e-commerce store selling locally roasted, limited-batch beans and accessories. The MVP launches on a **custom Shopify Liquid theme** (Phase 1), with a documented path to **Hydrogen (headless)** later (Phase 2).

**Core goals:** bilingual AR/EN experience, luxury white + gold aesthetic, advanced bean filtering, subscriptions, smooth cart/checkout UX, and Shopify-native automation.

---

## 2. Confirmed Requirements

### Business

| Item | Decision |
|------|----------|
| **Audience** | Home brewers, enthusiasts, pro baristas / advanced hobbyists |
| **Market** | UAE / GCC brand positioning; **ship UAE only** at launch |
| **Language** | Bilingual — Arabic + English (RTL + LTR) |
| **Differentiators** | Direct sourcing, local roasting, limited/small-batch beans |
| **Launch catalog** | 20 beans, 10 accessories |
| **Later catalog** | Equipment, gift boxes (post-MVP) |

### Commerce

| Item | Decision |
|------|----------|
| **Sales** | One-time purchases + subscriptions at launch |
| **Subscriptions** | Single-bean **and** rotating selection plans |
| **Frequency** | Monthly **and** bi-weekly |
| **Subscriber discount** | **10%** off for subscribers |
| **Payments** | Apple Pay, Google Pay, Cash on Delivery |
| **Shipping** | UAE only; **free shipping above AED 300** |
| **Cart UX** | Side drawer + dedicated cart page |

### Product data & filters

| Item | Decision |
|------|----------|
| **Bean filters (priority)** | Flavor notes, process, roast level |
| **Origin filter** | Not MVP priority (can add via metafields later) |
| **Limited batch UX** | Badge + stock visibility (recommend notify-me for sold-out) |

### Design

| Item | Decision |
|------|----------|
| **Mood** | White / light luxury, **gold accents**, bold, simple |
| **3D** | Hero effects on homepage (CSS/WebGL — no heavy 3D product models at MVP) |
| **Motion** | Subtle premium micro-animations; respect `prefers-reduced-motion` |

### Technology

| Item | Decision |
|------|----------|
| **MVP architecture** | **Option C** — Custom Liquid theme now → Hydrogen later |
| **Styling** | Tailwind CSS (via PostCSS build in theme) |
| **Checkout** | Shopify standard Checkout (no Plus customization at MVP) |
| **Automation** | Shopify Email only |
| **Shopify store** | **Yes — Basic plan** |

### Content pages

| Item | Decision |
|------|----------|
| **Launch pages** | **About, FAQ, Privacy, Refund, Shipping, Terms** — templates at launch; copy added when ready |
| **Deferred** | Blog, workshops, brewing guides |
| **Brand assets** | **Logo received** — product photography still needed before Week 4 polish |

---

## 3. Architecture

### Phase 1 — MVP (Liquid Theme)

```
Shopify Admin (products, orders, subscriptions, content)
        │
        ▼
Custom Liquid Theme (this repo)
  ├── Tailwind CSS (built assets)
  ├── Section-based homepage (theme editor)
  ├── Collection filters (metafields + Shopify Search & Discovery)
  ├── Cart drawer (JS) + cart page template
  ├── Customer account templates
  └── Bilingual via Shopify Markets / locale files
        │
        ▼
Shopify Checkout (hosted)
```

### Phase 2 — Headless (Post-MVP)

```
Shopify (Admin + Storefront API + Customer Account API)
        │
        ▼
Hydrogen on Oxygen / Vercel
  ├── Reuse design tokens (colors, typography, spacing)
  ├── Port components conceptually from Liquid sections
  └── Keep URLs / SEO redirects where needed
```

**Why C for 30 days:** Liquid ships faster, full theme editor for marketing, native subscriptions/filter apps integrate cleanly. Hydrogen adds OAuth, hosting, and API layer — better as Phase 2 once catalog and flows are proven.

---

## 4. Tech Stack

| Layer | Choice |
|-------|--------|
| **Platform** | Shopify |
| **Theme** | Online Store 2.0 (JSON templates, sections, blocks) |
| **CSS** | Tailwind CSS 3.x + PostCSS |
| **JS** | Vanilla ES modules (minimal deps; no React in Liquid phase) |
| **Animations** | CSS transitions + optional GSAP for hero only |
| **3D hero** | Lightweight option: CSS 3D transforms + parallax, or single WebGL canvas (Three.js) — scoped to hero section only |
| **Icons** | SVG sprite or Lucide |
| **Fonts** | Premium pairing TBD — e.g. display serif + clean sans (supports AR + EN) |
| **i18n** | Shopify locale files (`en.default.json`, `ar.json`) + RTL stylesheet |
| **Subscriptions** | Shopify Subscriptions app (or Seal Subscriptions — confirm availability on your plan) |
| **Search/filters** | Shopify Search & Discovery + product metafields |
| **Email** | Shopify Email |
| **Version control** | Git + Shopify CLI theme dev |
| **CI (optional)** | GitHub Actions → theme push to staging theme |

---

## 5. Design System (White + Gold Luxury)

### Brand assets (received)

| Asset | Path | Notes |
|-------|------|-------|
| **Primary logo** | `assets/brand/logo-primary.png` | Arabic calligraphy + EN stack; bronze/coffee on white |

**Brand name (from logo):** The Coffee Workshop Co.  
**Tagline:** Speciality Coffee  
**Location line:** UAE · وورك شوب · RAK (Ras Al Khaimah)

### Color tokens (aligned to logo)

Logo uses **warm bronze / coffee-brown** on white — not bright yellow gold. Theme accent will match the logo; optional lighter gold only for subtle highlights (badges, hover).

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#FAFAF8` | Page background (warm white) |
| `--color-surface` | `#FFFFFF` | Cards, drawers |
| `--color-text` | `#1A1A1A` | Primary text |
| `--color-text-muted` | `#6B6B6B` | Secondary text |
| `--color-brand` | `#8B5E3C` | Logo bronze — primary accent, CTAs, links |
| `--color-brand-dark` | `#6B4428` | Hover / active states |
| `--color-brand-light` | `#C9A962` | Optional highlight (badges, borders) |
| `--color-border` | `#E8E4DC` | Dividers, subtle borders |
| `--color-error` | `#B42318` | Form errors |
| `--color-success` | `#067647` | Success states |

### Typography

- **Display:** Bold, confident headlines (large hero type)
- **Body:** Simple, readable, generous line-height
- **Arabic:** Dedicated Arabic font stack with matched visual weight

### UI principles

- Generous whitespace; product photography as hero content
- Brand bronze used sparingly — CTAs, active nav, price highlights, subscription badges
- Bold section titles; minimal UI chrome
- Consistent 8px spacing scale

---

## 6. Folder Structure

```
the-coffee-workshop/
├── PLAN.md                          # This file
├── README.md                        # Setup & dev instructions
├── package.json                     # Tailwind/PostCSS build scripts
├── tailwind.config.js
├── postcss.config.js
│
├── theme/                           # Shopify theme root (Shopify CLI)
│   ├── assets/
│   │   ├── application.css          # Compiled Tailwind output
│   │   ├── application.js           # Main JS bundle
│   │   ├── cart-drawer.js
│   │   ├── collection-filters.js
│   │   ├── hero-3d.js               # Optional WebGL hero
│   │   └── vendor/                  # Minimal third-party if needed
│   │
│   ├── config/
│   │   ├── settings_schema.json     # Theme settings (colors, logo, social)
│   │   └── settings_data.json     # Default settings
│   │
│   ├── layout/
│   │   ├── theme.liquid             # Main layout (RTL/LTR aware)
│   │   └── password.liquid
│   │
│   ├── locales/
│   │   ├── en.default.json
│   │   └── ar.json
│   │
│   ├── sections/                    # OS 2.0 sections (theme editor)
│   │   ├── header.liquid
│   │   ├── footer.liquid
│   │   ├── hero-3d.liquid
│   │   ├── featured-products.liquid
│   │   ├── subscription-cta.liquid
│   │   ├── brand-story.liquid
│   │   ├── limited-batch.liquid
│   │   ├── testimonials.liquid
│   │   ├── newsletter.liquid
│   │   ├── collection-banner.liquid
│   │   ├── main-product.liquid
│   │   ├── main-collection.liquid
│   │   ├── main-cart.liquid
│   │   ├── main-search.liquid
│   │   ├── main-account.liquid
│   │   └── ...
│   │
│   ├── snippets/
│   │   ├── icon.liquid
│   │   ├── product-card.liquid
│   │   ├── product-badges.liquid
│   │   ├── price.liquid
│   │   ├── cart-drawer.liquid
│   │   ├── filter-group.liquid
│   │   ├── subscription-widget.liquid
│   │   ├── locale-switcher.liquid
│   │   └── meta-tags.liquid
│   │
│   └── templates/
│       ├── index.json
│       ├── product.json
│       ├── collection.json
│       ├── cart.json
│       ├── search.json
│       ├── customers/
│       │   ├── account.json
│       │   ├── login.json
│       │   ├── register.json
│       │   └── order.json
│       └── page/
│           ├── about.json           # When pages confirmed
│           ├── faq.json
│           └── ...
│
└── docs/
    ├── shopify-admin-setup.md       # Step-by-step Admin tasks
    ├── metafields-schema.md         # Bean/accessory metafield definitions
    └── hydrogen-migration.md        # Phase 2 notes
```

---

## 7. Sitemap & Page Components

### MVP pages

| Page | URL | Key components |
|------|-----|----------------|
| **Home** | `/` | 3D hero, featured beans, subscription CTA, limited batch strip, brand story, testimonials, newsletter |
| **Beans collection** | `/collections/beans` | Filters (flavor, process, roast), sort, product grid, quick add |
| **Accessories collection** | `/collections/accessories` | Category chips, grid |
| **Product (bean)** | `/products/:handle` | Gallery, flavor notes, process/roast meta, grind options, subscription toggle, related products |
| **Product (accessory)** | `/products/:handle` | Gallery, specs, add to cart |
| **Cart (page)** | `/cart` | Line items, qty, subscription summary, free-shipping progress (AED 300), checkout CTA |
| **Cart (drawer)** | overlay | Mini cart, quick edit, checkout CTA |
| **Search** | `/search` | Product results, filter chips |
| **Subscriptions** | `/pages/subscriptions` | Plan comparison: single bean vs rotating; monthly vs bi-weekly |
| **Account** | `/account` | Orders, addresses, subscription management link |
| **Login / Register** | `/account/login` | Standard customer auth |
| **Checkout** | Shopify hosted | Wallets + COD via payment settings |
| **About / FAQ / Policies** | `/pages/*` | Rich text sections — *templates ready; content TBD* |

### Homepage sections (theme editor)

1. **Hero 3D** — headline, subcopy, dual CTA (Shop Beans / Subscribe), optional WebGL/CSS effect  
2. **Featured beans** — curated collection picker  
3. **Limited batch** — countdown or “X left” from inventory  
4. **Subscription CTA** — two cards: Single Origin Plan / Rotating Plan  
5. **Brand story** — local roasting, direct sourcing  
6. **Featured accessories** — collection picker  
7. **Testimonials** — blocks with quote, name, rating  
8. **Newsletter** — Shopify Email signup  

---

## 8. Product Metafields Schema (Beans)

Define in Shopify Admin → Settings → Custom data → Products.

| Namespace & key | Type | Filter? | Display on PDP |
|-----------------|------|---------|----------------|
| `coffee.process` | Single line or list | Yes | Yes |
| `coffee.roast_level` | Single line (Light/Medium/Dark) | Yes | Yes |
| `coffee.flavor_notes` | List (e.g. chocolate, berry, floral) | Yes | Yes |
| `coffee.origin` | Single line | No (MVP) | Yes |
| `coffee.altitude` | Single line | No | Optional |
| `coffee.varietal` | Single line | No | Optional |
| `coffee.is_limited` | Boolean | No | Badge on card |
| `coffee.roast_date` | Date | No | Optional freshness indicator |

**Accessories metafields (lighter):** `accessory.type`, `accessory.material`, `accessory.compatibility`

---

## 9. Subscriptions Model

| Plan type | Description |
|-----------|-------------|
| **Single bean** | Customer picks one bean; recurring delivery |
| **Rotating selection** | Curated rotating beans each cycle |
| **Frequencies** | Monthly and bi-weekly variants |
| **Discount** | **10%** subscriber discount (confirmed) |

**Shopify Admin tasks (you):**

1. Install **Shopify Subscriptions** (or approved alternative on your plan).  
2. Create selling plans for each frequency × plan type.  
3. Apply subscriber discount in selling plan settings.  
4. Test checkout with subscription + COD rules (COD may be one-time only — confirm).

---

## 10. Milestones (30-Day Schedule)

### Week 1 — Foundation

| # | Task | Deliverable |
|---|------|-------------|
| 1.1 | Init repo, Shopify CLI, link to your store | Dev theme connected |
| 1.2 | Tailwind + PostCSS pipeline | `application.css` build |
| 1.3 | Design tokens in `settings_schema` + base layout | RTL/LTR layout |
| 1.4 | Locales EN + AR skeleton | Translation keys |
| 1.5 | Header, footer, mobile nav, locale switcher | Global chrome |
| 1.6 | Document metafields schema | `docs/metafields-schema.md` |

**Gate:** You confirm Shopify plan, provide store URL, staging theme access.

---

### Week 2 — Core shopping UX

| # | Task | Deliverable |
|---|------|-------------|
| 2.1 | Product card, badges (limited, subscription) | Snippets |
| 2.2 | Collection templates + filter UI | Beans filters live |
| 2.3 | PDP — bean (metafields, variants, subscription widget) | Product template |
| 2.4 | PDP — accessory | Product template |
| 2.5 | Cart drawer + cart page + free shipping bar (AED 300) | Cart flows |
| 2.6 | Search template | Basic search |

**Gate:** You add 5 sample products with metafields for testing.

---

### Week 3 — Homepage & subscriptions

| # | Task | Deliverable |
|---|------|-------------|
| 3.1 | Hero section with 3D/light motion effect | Homepage hero |
| 3.2 | Remaining homepage sections | Full `index.json` |
| 3.3 | Subscriptions landing page | `/pages/subscriptions` |
| 3.4 | Customer account templates | Account area styled |
| 3.5 | Shopify Email signup integration | Newsletter section |
| 3.6 | Performance pass (images, lazy load, CSS purge) | Lighthouse baseline |

**Gate:** You configure selling plans + payment methods in Admin.

---

### Week 4 — Content, QA & launch

| # | Task | Deliverable |
|---|------|-------------|
| 4.1 | Page templates for About, FAQ, policies | Ready when content arrives |
| 4.2 | COD + Apple/Google Pay checkout testing | Payment QA doc |
| 4.3 | Bilingual QA (copy, RTL layout, forms) | Fix list cleared |
| 4.4 | Mobile QA (cart drawer, filters, PDP) | Sign-off |
| 4.5 | SEO basics (meta, OG, product schema) | Snippet in place |
| 4.6 | Publish theme + redirect checklist | **MVP live** |

**Gate:** You upload final 20 beans + 10 accessories; approve go-live.

---

## 11. Shopify Admin Checklist (Your Tasks)

Use `docs/shopify-admin-setup.md` (created during implementation) for detail. Summary:

- [ ] Confirm store plan and enable **Shopify Payments** (for Apple Pay / Google Pay)  
- [ ] Enable **Cash on Delivery** for UAE  
- [ ] Configure **shipping zones** — UAE only; rate rules + free shipping over AED 300  
- [ ] Set up **VAT 5%** if applicable  
- [ ] Create collections: Beans, Accessories  
- [ ] Add product metafields per schema (Section 8)  
- [ ] Install **Search & Discovery** — configure filters for process, roast, flavor notes  
- [ ] Install **Subscriptions** app — create selling plans  
- [ ] Configure **Markets** / languages (EN + AR)  
- [ ] Connect domain  
- [ ] Shopify Email — welcome + abandoned checkout flows  

---

## 12. Open Decisions

| # | Item | Status |
|---|------|--------|
| 1 | Subscriber discount | **Confirmed: 10%** |
| 2 | Launch content pages | **Confirmed: About, FAQ, Privacy, Refund, Shipping, Terms** (copy when ready) |
| 3 | Shopify plan | **Confirmed: Basic** — use Shopify Subscriptions or a Basic-compatible app (e.g. Seal Subscriptions) |
| 4 | Store URL / collaborator access | Needed to start Week 1 |
| 5 | Logo & photography | Client provides before Week 4 polish |
| 6 | COD + subscriptions | Test at checkout; COD may be one-time only |

---

## 13. Performance & Quality Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance (mobile) | ≥ 75 MVP, ≥ 85 post-launch |
| LCP | < 2.5s on 4G |
| CLS | < 0.1 |
| JS budget (theme) | < 80kb gzipped (excl. optional hero 3D) |
| Accessibility | WCAG 2.1 AA basics (contrast, focus, labels) |
| Reduced motion | Honor `prefers-reduced-motion` |

---

## 14. Phase 2 Preview — Hydrogen Migration

Triggered after MVP is stable and revenue flows are validated.

1. Scaffold Hydrogen app; connect Storefront API.  
2. Port design tokens and component library.  
3. Rebuild homepage hero 3D with React Three Fiber (optional).  
4. Implement Customer Account API for account pages.  
5. URL parity + 301 redirects.  
6. A/B or phased rollout.

*Estimated effort:* 4–6 weeks after MVP, depending on feature parity scope.

---

## 15. Approval

**Reply with one of:**

- `Approved` — begin Week 1 implementation  
- `Approved with changes: …` — specify edits to this plan  
- `Hold` — pause until open items in Section 12 are resolved  

**No theme code will be written until you approve this plan.**

---

*Prepared by: Project Manager / Lead Shopify Developer*  
*Project: The Coffee Workshop*
