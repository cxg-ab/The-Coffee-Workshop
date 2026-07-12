---
name: the-coffee-workshop
description: "Store memory for The Coffee Workshop Shopify store (7medyz-sn.myshopify.com). Use when editing theme, pages, products, UI/UX, navigation, or content for this merchant."
metadata:
  store: 7medyz-sn.myshopify.com
  brand: The Coffee Workshop
  theme_live: "The Coffee Workshop - Mobile Fix"
  theme_id: 140466290784
  currency: AED
  locale: en + ar (RTL)
  version: "1.0.0"
  audited: "2026-07-12"
---

# The Coffee Workshop — Store Memory

Connected Shopify store for **The Coffee Workshop Co.**, a UAE specialty coffee roaster based in Ras Al Khaimah.

## Store identity

| Field | Value |
|-------|-------|
| Admin name | My Store |
| Brand | The Coffee Workshop |
| Domain | https://7medyz-sn.myshopify.com |
| Intended public site | www.thecoffeeworkshop.ae |
| Currency | AED |
| Timezone | UTC+4 |
| Status | **Password protected** ("Will be opening soon") |
| Vendor | The Coffee Workshop |

## Live theme

- **Name:** The Coffee Workshop - Mobile Fix
- **Theme ID:** #140466290784 (role: MAIN)
- **Custom theme:** `the-coffee-workshop` v1.1.0 (layout marks v1.2)
- **Author:** The Coffee Workshop Co.
- **Other themes:** `The Coffee Workshop - Shipping Update` (unpublished), `Development (ac6190-CombatXGear)` (dev)

## UI / UX design system

### Visual language
- **Palette:** Bronze brand `#8B5E3C`, dark `#6B4428`, light gold `#C9A962`, warm off-white bg `#FAFAF8`, ink text `#1A1A1A` / `#1C1917`, muted `#6B6B6B`, borders `#E8E4DC`
- **Typography:** Playfair Display (display), Montserrat (body), Noto Kufi Arabic + Noto Sans Arabic (Arabic/RTL)
- **Layout:** `site-container`, max-width ~1150px, mobile-first with `lg:` breakpoints
- **Components:** `btn-primary`, `btn-outline`, `brand-card`, `section-eyebrow`, `section-title`, `prose-brand`
- **Footer:** Dark `#1C1917`, bronze accents, mobile accordion columns

### Motion & interaction
- **GSAP 3.12.7** + ScrollTrigger for scroll animations
- **Lenis** smooth scrolling
- **Flag:** `settings.animations_enabled` (default: true)
- **Signature interactions:**
  - Hero: Arabic decorative background, 3D orb visual, split heading lines
  - Coffee bean roast: 130-frame scroll-scrub animation (green → roasted → coffee pour); pack image uploaded separately, rises from bottom at end
  - Origin sticky: pinned origin cards (Ethiopia, Panama, Yemen, Colombia, Kenya)
  - Page transitions, cart drawer, footer reveal
- **Bilingual:** RTL when `request.locale.iso_code == 'ar'`; hero embeds Arabic word ماستر in heading

### Header
- Announcement bar: "Free UAE shipping on orders over AED 300"
- Menu handle: `main-menu` (API access denied — fallbacks used in nav snippet)
- Fallback nav: Shop beans, Accessories, Subscriptions, About, FAQ
- Locale switcher snippet, cart drawer, mobile dropdown menus

### Contact (theme settings)
- Phone: +971 7 2224466
- Email: info@thecoffeeworkshop.ae
- Address: Al Nahdah St, Dafan Al Khor, Ras Al Khaimah, UAE
- WhatsApp: +97172224466

## Page inventory (all routes)

### Core storefront templates

| # | Page name | URL path | Template | Sections |
|---|-----------|----------|----------|----------|
| 1 | **Homepage** | `/` | `index.json` | hero, coffee-bean-roast, origin-sticky, brand-story |
| 2 | **About Us** | `/pages/about` | `page.about.json` | main-page-about |
| 3 | **FAQ** | `/pages/faq` | `page.faq.json` | main-page-faq (5 Q&A blocks) |
| 4 | **Subscriptions** | `/pages/subscriptions` | `page.subscriptions.json` | main-page-subscriptions |
| 5 | **Contact** | `/pages/contact` | `page.contact.json` | contact-form |
| 6 | **Cart** | `/cart` | `cart.json` | main-cart |
| 7 | **Search** | `/search` | `search.json` | main-search |
| 8 | **404 Not Found** | (any bad URL) | `404.json` | main-404 |
| 9 | **Generic page** | `/pages/{handle}` | `page.json` | main-page-about (fallback) |

### Collection pages

| # | Collection name | Handle | URL | Products |
|---|-----------------|--------|-----|----------|
| 10 | **Home page** | `frontpage` | `/collections/frontpage` | 1 |
| 11 | **Single Origin** | `single-origin` | `/collections/single-origin` | 4 |
| 12 | **Micro-Lot** | `micro-lot` | `/collections/micro-lot` | 1 |
| 13 | **Exotic** | `exotic` | `/collections/exotic` | 1 |
| 14 | **Capsules & Drip** | `capsules-drip` | `/collections/capsules-drip` | 0 |

> Nav fallbacks link to `/collections/beans` and `/collections/accessories` — **these handles do not exist** in admin. Update menus or create matching collections.

### Product pages (all ACTIVE placeholders)

| # | Product name | Handle |
|---|--------------|--------|
| 15 | [PLACEHOLDER] Ethiopia Yirgacheffe Micro-Lot | `placeholder-ethiopia-yirgacheffe-micro-lot` |
| 16 | [PLACEHOLDER] Panama Geisha Reserve | `placeholder-panama-geisha-reserve` |
| 17 | [PLACEHOLDER] Colombia Huila | `placeholder-colombia-huila` |
| 18 | [PLACEHOLDER] Kenya AA | `placeholder-kenya-aa` |
| 19 | [PLACEHOLDER] The Workshop Blend | `placeholder-the-workshop-blend` |

Template: `product.json` → `main-product` section

### Policy pages (Shopify auto-generated)

| # | Page name | URL | Template |
|---|-----------|-----|----------|
| 20 | **Privacy policy** | `/policies/privacy-policy` | `policy.liquid` |
| 21 | **Refund policy** | `/policies/refund-policy` | `policy.liquid` |
| 22 | **Shipping policy** | `/policies/shipping-policy` | `policy.liquid` |
| 23 | **Terms of service** | `/policies/terms-of-service` | `policy.liquid` |
| 24 | **Subscription policy** | `/policies/subscription-policy` | `policy.liquid` (if enabled) |

### Blog

| # | Page name | URL | Articles |
|---|-----------|-----|----------|
| 25 | **News** (blog index) | `/blogs/news` | 0 |

### Customer account (standard Shopify)

| # | Page name | URL |
|---|-----------|-----|
| 26 | Login | `/account/login` |
| 27 | Register | `/account/register` |
| 28 | Account home | `/account` |
| 29 | Orders | `/account/orders` |
| 30 | Addresses | `/account/addresses` |

### Pre-launch

| # | Page name | URL | Notes |
|---|-----------|-----|-------|
| 31 | **Password / Coming soon** | `/password` | Currently gates entire storefront |

## Homepage sections (in order)

1. **Hero** — "Small batches.ماستر roasted." + Shop beans / Subscribe CTAs
2. **Coffee bean roast** — Scroll-driven 133-frame roast animation
3. **Origin sticky** — 5 origin story cards (pinned scroll)
4. **Brand story** — Micro-lots, Master roasters, UAE specialty values

## Theme file map (key files)

```
layout/theme.liquid          # Master layout, fonts, GSAP, RTL
config/settings_schema.json  # Brand, colors, contact, animations, social
config/settings_data.json    # Live settings values
templates/index.json         # Homepage composition
sections/hero.liquid
sections/coffee-bean-roast.liquid
sections/origin-sticky.liquid
sections/brand-story.liquid
sections/header.liquid + header-group.json
sections/footer.liquid + footer-group.json
sections/main-product.liquid
sections/main-collection.liquid
sections/main-cart.liquid
sections/contact-form.liquid
snippets/nav-menu.liquid
snippets/cart-drawer.liquid
snippets/css-variables.liquid
assets/application.css       # ~50KB compiled styles
assets/animations.js         # GSAP animations
assets/bean_001.webp–bean_133.webp  # Roast scroll frames
locales/en.default.json
locales/ar.json
```

## Business rules (from FAQ/content)

- Free UAE shipping on orders over **AED 300**
- Subscriptions: single bean or rotating, monthly/bi-weekly, **10% subscriber discount**
- Payments: Apple Pay, Google Pay, Cash on Delivery (UAE)
- Store beans airtight, use within 2–4 weeks of roast

## CLI connection

```bash
shopify store execute --store 7medyz-sn.myshopify.com --query '...'
shopify theme list --store 7medyz-sn.myshopify.com
```

## Known gaps / watch items

1. Storefront password-protected — public UI not crawlable without password
2. Admin pages (About, FAQ, etc.) have **empty `page.content`** — theme uses locale/section defaults
3. Nav fallbacks reference non-existent collection handles (`beans`, `accessories`)
4. All products are `[PLACEHOLDER]` — catalog not finalized
5. `Capsules & Drip` collection is empty
6. Blog has zero articles
7. Footer menu settings (`menu_shop`, `menu_support`, `menu_legal`) are blank — using fallbacks
