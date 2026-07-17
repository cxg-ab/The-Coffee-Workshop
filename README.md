# The Coffee Workshop — Shopify Theme

Custom Shopify Online Store 2.0 theme for **The Coffee Workshop Co.** — bilingual (EN/AR), white luxury aesthetic with bronze brand accents.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A Shopify store on the **Basic** plan
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) (recommended)

## Note: Google Drive workspace

If `npm install` fails in Google Drive, run builds from a local folder (e.g. `C:\Projects\the-coffee-workshop`) or use:

```bash
npm run build
```

The compiled `theme/assets/application.css` is committed so the theme works when uploaded without building locally.

### 1. Install dependencies

```bash
npm install
npm run build
```

For development with live CSS rebuild:

```bash
npm run watch
```

### 2. Install Shopify CLI (if not installed)

```bash
npm install -g @shopify/cli @shopify/theme
```

### 3. Connect to your store

From the project root:

```bash
shopify theme dev --path theme
```

This uploads a dev theme and opens a preview URL. Log in when prompted.

### 4. Manual upload (without CLI)

1. Zip the contents of the `theme/` folder (not the parent folder).
2. In Shopify Admin → **Online Store → Themes → Add theme → Upload zip**.

## Project structure

```
├── src/styles/application.css   # Tailwind source
├── theme/                       # Shopify theme (deploy this)
│   ├── assets/                  # Compiled CSS + JS
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
- **Cursor skill:** `.cursor/skills/coffee-workshop-brand/` (auto guides brand-consistent theme work)
- **Logo:** upload via Theme settings → Brand → Logo

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile Tailwind → `theme/assets/application.css` |
| `npm run watch` | Watch and rebuild CSS |
| `shopify theme dev --path theme` | Live preview on dev theme |

## License

Private — The Coffee Workshop Co.
