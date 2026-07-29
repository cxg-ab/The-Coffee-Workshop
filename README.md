# The Coffee Workshop — Shopify Theme

Custom Shopify Online Store 2.0 theme for **The Coffee Workshop Co.** — bilingual (EN/AR), white luxury aesthetic with bronze brand accents.

## Prerequisites

- A Shopify store on the **Basic** plan
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) (recommended)

## CSS: no build step

> **`theme/assets/application.css` is hand-maintained and is the single source
> of truth. Edit it directly. Do not add a Tailwind/PostCSS build.**

The theme originally compiled its CSS from `src/styles/application.css` via
PostCSS. That source drifted far behind the committed output (402 lines vs
3,200+), and most of the theme's CSS — the collection filter panel, origin
cards, product page, customer accounts, cinematic hero — exists **only** in the
compiled file. Running the old build would have silently deleted all of it, so
the pipeline (`src/`, `postcss.config.js`, `tailwind.config.js`, `package.json`)
was removed.

Tailwind utility classes already present in `application.css` continue to work;
they are simply no longer regenerated. When you need a new utility, add the rule
by hand.

### 1. Install Shopify CLI (if not installed)

```bash
npm install -g @shopify/cli @shopify/theme
```

### 2. Connect to your store

From the project root:

```bash
shopify theme dev --path theme
```

This uploads a dev theme and opens a preview URL. Log in when prompted.

### 3. Manual upload (without CLI)

1. Zip the contents of the `theme/` folder (not the parent folder).
2. In Shopify Admin → **Online Store → Themes → Add theme → Upload zip**.

## Project structure

```
├── theme/                       # Shopify theme (deploy this)
│   ├── assets/                  # CSS + JS (hand-maintained)
│   ├── config/
│   ├── layout/
│   ├── locales/                 # en.default.json, ar.json
│   ├── sections/
│   ├── snippets/
│   └── templates/
├── assets/brand/                # Source brand assets
└── docs/                        # Admin setup guides
```

## Shopify Admin setup

See [docs/shopify-admin-setup.md](docs/shopify-admin-setup.md) for:

- Uploading logo & favicon
- Enabling Arabic language
- Creating menus, collections, metafields
- Payments, shipping, subscriptions

## Brand

- **Guidelines:** [docs/brand-guidelines.md](docs/brand-guidelines.md)
- **Metafields:** [docs/metafields-schema.md](docs/metafields-schema.md)
- **Logo:** upload via Theme settings → Brand → Logo

### Colour tokens

All colours come from Theme settings via `snippets/css-variables.liquid`.
Use the tokens — never a raw hex — in sections and snippets:

| Token | Alias | Setting |
|-------|-------|---------|
| `--color-brand` / `-dark` / `-light` | — | Brand colours |
| `--color-text` | `--color-ink` | Text |
| `--color-text-muted` | `--color-muted` | Muted text |
| `--color-border` | `--color-line` | Border |
| `--color-bg` / `--color-surface` | — | Background / surface |

## Scripts

| Command | Description |
|---------|-------------|
| `shopify theme dev --path theme` | Live preview on dev theme |
| `shopify theme push --path theme` | Push to a theme |

There is no CSS build command — see **CSS: no build step** above.

## License

Private — The Coffee Workshop Co.
