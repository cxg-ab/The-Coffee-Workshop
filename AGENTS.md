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

### Running the storefront (live preview) — needs auth
- `shopify theme dev --path theme --store 7medyz-sn.myshopify.com` uploads a dev theme and
  serves a live preview, but it requires **Shopify authentication** to the store. It is NOT
  provisioned in the cloud VM by default; the command prints a device-code login URL and waits.
- To run it non-interactively, set a Theme Access token as `SHOPIFY_CLI_THEME_TOKEN` (created
  via the *Theme Access* app in Shopify Admin) and pass `--store 7medyz-sn.myshopify.com`.
  Otherwise an interactive `shopify auth login` / device-code login is required.
- Store: `7medyz-sn.myshopify.com`. There is no offline/local render for a Shopify theme —
  the store connection is required to see rendered output.

### Other useful commands
- `shopify theme push --path theme` / `shopify theme pull --path theme` (both need auth).
- Accessibility auditing skills live under `.claude/skills/` (accesslint MCP in `.mcp.json`).
