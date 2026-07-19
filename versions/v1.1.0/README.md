# The Coffee Workshop — Theme Archive v1.1.0

Pulled from Shopify on **17 July 2026**. Each subfolder is a complete Shopify Online Store 2.0 theme root (ready for `shopify theme dev` / `push` / `pull`).

## Themes in this archive

| Folder | Shopify name | Role | Theme ID | Preview |
|--------|----------------|------|----------|---------|
| `01-coming-soon-only/` | Coming Soon Only | **Live** | `#140499058784` | https://7medyz-sn.myshopify.com |
| `02-luxury-refresh/` | The Coffee Workshop - Luxury Refresh | Unpublished | `#140498305120` | https://7medyz-sn.myshopify.com?preview_theme_id=140498305120 |

### Differences (high level)

- **Coming Soon Only** — password/coming-soon storefront; `index.json` uses coming-soon section; roast section disabled.
- **Luxury Refresh** — full homepage (hero, bean roast scroll, origin sticky, brand story, etc.).

Both themes share the same Liquid codebase structure; settings differ in `config/settings_data.json` and template JSON.

---

## Quick start

### 1. Install dependencies (CSS builds)

From this folder (`versions/v1.1.0/`):

```bash
npm install
npm run build
```

Compiled CSS is written to each theme’s `assets/application.css`.

### 2. Shopify CLI — develop

```bash
# Luxury Refresh (main storefront build)
npm run dev:luxury

# Coming Soon (live theme)
npm run dev:coming-soon
```

Or directly:

```bash
shopify theme dev --store 7medyz-sn.myshopify.com --path 02-luxury-refresh --theme 140498305120
shopify theme dev --store 7medyz-sn.myshopify.com --path 01-coming-soon-only --theme 140499058784
```

### 3. Push / pull

```bash
npm run push:luxury
npm run push:coming-soon
npm run pull:luxury
npm run pull:coming-soon
```

---

## Project layout

```
versions/v1.1.0/
├── 01-coming-soon-only/     # Shopify theme root (live)
├── 02-luxury-refresh/       # Shopify theme root (unpublished)
├── src/styles/              # Tailwind source → both themes' application.css
├── docs/                    # Brand + admin setup guides
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

Each theme folder contains standard Shopify directories:

`assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`

---

## Brand & theme rules

- **Colors:** bronze `#8B5E3C`, canvas `#FAFAF8`, ink `#1A1A1A` (see `docs/brand-guidelines.md`)
- **Stack:** Liquid 2.0 + Tailwind (`src/styles` → `assets/application.css`)
- **Bilingual:** `locales/en.default.json` + `locales/ar.json`, RTL via `dir` on `<html>`
- **Motion:** GSAP + ScrollTrigger in `assets/animations.js`; respect `prefers-reduced-motion`

---

## Manual upload (no CLI)

Zip the **contents** of `01-coming-soon-only` or `02-luxury-refresh` (not the parent folder).  
Shopify Admin → **Online Store → Themes → Add theme → Upload zip**.

---

## Note on Google Drive

If `npm install` is slow or fails on Google Drive, copy `versions/v1.1.0` to a local path (e.g. `C:\Projects\tcw-v1.1.0`) and run builds there. Pulled themes already include compiled `assets/application.css` and work without building.
