# TCW Main — primary theme (V1.1)

**TCW Main** is the primary Online Store theme from now on (schema **1.1.0**).

| Role | Name | Notes |
|------|------|--------|
| **Primary** | **TCW Main** | Source of truth. Pull → GitHub → push here. |
| Retire | TCW refactor staging (Phases 1-4) `#140605489248` | Delete in Admin when ready. |
| Live (today) | May still show as “Copy 22” etc. | Publish **TCW Main** when you go live. |

Old GitHub: `cxg-ab/The-Coffee-Workshop`  
**New GitHub (create once):** `cxg-ab/TCW-Main` (or `TCW-Main` under your org)

---

## One-time setup (Windows)

1. In **Shopify Admin → Online Store → Themes**, find **TCW Main**.
2. Note its theme ID (Customize URL: `…/themes/XXXXXXXXX/editor` → that number).
3. Delete **TCW refactor staging (Phases 1-4)** when you no longer need it.
4. Run the script below (edit `THEME_ID` first).

```powershell
# === TCW Main V1.1 — pull Shopify → new GitHub repo ===
$STORE   = "7medyz-sn.myshopify.com"
$THEME_ID = "PASTE_TCW_MAIN_THEME_ID_HERE"   # from Admin URL
$ROOT    = "C:\Users\User\tcw-main"
$REPO    = "cxg-ab/TCW-Main"

# 1) Fresh folder + pull TCW Main from Shopify
New-Item -ItemType Directory -Force -Path $ROOT | Out-Null
Set-Location $ROOT
shopify theme pull --store=$STORE --theme=$THEME_ID --path=theme

# 2) Git + GitHub repo
git init -b main
@"
# TCW Main (theme V1.1)

Primary Shopify theme for The Coffee Workshop (``$STORE``).

``````bash
shopify theme push --store=$STORE --theme=$THEME_ID --path=theme
``````
"@ | Set-Content -Encoding utf8 README.md

git add theme README.md
git commit -m "Initial TCW Main theme V1.1 from Shopify"
gh repo create $REPO --private --source=. --remote=origin --push

# 3) Optional: rename the Shopify theme + publish later in Admin
Write-Host "Done. Repo: https://github.com/$REPO"
Write-Host "Preview: https://$STORE/?preview_theme_id=$THEME_ID"
```

If `gh repo create` is unavailable, create **TCW-Main** on GitHub in the browser, then:

```powershell
git remote add origin https://github.com/cxg-ab/TCW-Main.git
git push -u origin main
```

---

## Day-to-day (after setup)

```powershell
cd C:\Users\User\tcw-main
git pull origin main
shopify theme pull --store=7medyz-sn.myshopify.com --theme=THEME_ID --path=theme
# …edit…
git add -A && git commit -m "Describe change" && git push
shopify theme push --store=7medyz-sn.myshopify.com --theme=THEME_ID --path=theme
```

---

## This cloud workspace

Cannot pull/push Shopify here (Theme Access token 401). After you create **TCW-Main** and push the first pull, point future Cursor/cloud agents at **`cxg-ab/TCW-Main`** instead of `The-Coffee-Workshop`.
