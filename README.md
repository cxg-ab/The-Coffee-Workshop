# TCW Main — Shopify theme V1.1

Primary theme for **The Coffee Workshop** (`7medyz-sn.myshopify.com`).

- **Theme name (Admin):** TCW Main  
- **Schema version:** 1.1.0  
- **Canonical GitHub (after migration):** `cxg-ab/TCW-Main`  
- **Migration / primary workflow:** [docs/tcw-main-primary.md](docs/tcw-main-primary.md)

## Prerequisites

- Shopify store + [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)

## CSS: no build step

`theme/assets/application.css` is hand-maintained. Edit it directly.

## Develop / push

```bash
shopify theme dev --path theme --store=7medyz-sn.myshopify.com
shopify theme push --path theme --store=7medyz-sn.myshopify.com --theme=<TCW_MAIN_THEME_ID>
```

## Structure

```
├── theme/          # Shopify theme (deploy this)
├── docs/           # Admin + migration guides
└── plans/          # Motion audit plans (optional)
```

## Standing product rules

- No coffee subscriptions  
- Don’t break roast scroll scrub  
- Product images: contain on `#FAFAF8` (`.tcw-product-media`)  
- Prefer push path `C:\Users\User\tcw-main` (or `tcw-luxury-push` until migrated)
