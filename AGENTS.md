# The Coffee Workshop — Agent Guide

Custom Shopify **Online Store 2.0** theme (Liquid). The deployable theme lives in
`theme/`. See `README.md` for the CSS "no build step" rule (`theme/assets/application.css`
is hand-maintained and is the single source of truth) and the store's Admin setup.

## Cursor Cloud specific instructions

### Toolchain
- The only tool this repo needs is the **Shopify CLI** (`shopify`), installed globally by
  the startup update script. There is no `package.json`, lockfile, or CSS build — do not add one.
- npm gotcha: the VM's global npm prefix defaults to `/` (root-only), so a plain
  `npm install -g …` fails with `EACCES`. The update script repoints npm's user-level
  prefix at the active nvm node dir (already on `PATH`) so global installs work without sudo.
  If you install another global CLI by hand, run `npm config set prefix "$(dirname "$(dirname "$(command -v npm)")")"` first.

### Lint / CI gate
- Run the same check CI runs (`.github/workflows/main.yml` → `Shopify/theme-check-action`):
  `shopify theme check --path theme`.
- This works fully offline (no store auth). The theme currently has **pre-existing**
  offenses (a handful of errors + warnings) that are unrelated to environment setup — a
  clean run is not expected. Only worry about *new* offenses your changes introduce.

### Running the storefront (live preview) — needs auth + store password
- Store: `7medyz-sn.myshopify.com`. There is no offline/local render for a Shopify theme —
  a store connection is required to see rendered output.
- Two credentials are needed to run `theme dev` non-interactively:
  1. A **Theme Access token** (`shptka_…`, from the *Theme Access* app in Admin) as
     `SHOPIFY_CLI_THEME_TOKEN` (or `--password`). Without it the CLI prompts a device-code login.
  2. The **storefront password** (the store is in password/"Coming Soon" mode) as
     `SHOPIFY_FLAG_STORE_PASSWORD` (or `--store-password`). Without it `theme dev` prompts
     "Enter your store password" and fails when run non-interactively (e.g. piped to a log).
- Working invocation:
  `SHOPIFY_CLI_THEME_TOKEN=shptka_… SHOPIFY_FLAG_STORE_PASSWORD=… shopify theme dev --path theme --store 7medyz-sn.myshopify.com`
  It serves `http://127.0.0.1:9292` and a hosted preview `https://7medyz-sn.myshopify.com/?preview_theme_id=<id>`.
- Gotcha: if you restart `theme dev` in a fresh shell, `SHOPIFY_CLI_THEME_TOKEN` may resolve to
  a secret set at the environment level — make sure that secret actually holds a `shptka_…`
  value (a wrong value yields `GraphQL 401: Invalid API key or access token`).

### Known bug: local cart AJAX returns 401 (use the hosted preview for cart/checkout)
- On the **local** `http://127.0.0.1:9292` server, cart AJAX routes (`/cart/add.js`, `/cart.js`,
  `/cart/change`, `products.json`) return **401 "access token … invalid"**. This is a known
  Shopify CLI bug (the dev proxy forwards the Bearer token to the cart/checkout proxy) — see
  Shopify/cli issues #1078 and #7568 — not a theme defect. Page rendering (GET) works fine.
- Workaround for testing cart/checkout: use the **Shopify-hosted preview URL**
  `https://7medyz-sn.myshopify.com/?preview_theme_id=<id>` (enter the storefront password once).
  Add-to-cart works there. (Alternatively, downgrading the CLI to `@shopify/cli@3.88.1` restores
  local cart for some, but the hosted preview is the reliable path.)

### Other useful commands
- `shopify theme push --path theme` / `shopify theme pull --path theme` (both need auth).
- Accessibility auditing skills live under `.claude/skills/` (accesslint MCP in `.mcp.json`).
