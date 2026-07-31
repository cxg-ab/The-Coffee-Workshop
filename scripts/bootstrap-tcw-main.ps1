# TCW Main V1.1 — pull from Shopify → GitHub TCW-Main
# Edit THEME_ID, then:  powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap-tcw-main.ps1

$ErrorActionPreference = "Stop"
$STORE    = "7medyz-sn.myshopify.com"
$THEME_ID = "PASTE_TCW_MAIN_THEME_ID_HERE"
$ROOT     = "R:\tcw-main"
$REPO     = "cxg-ab/TCW-Main"

if ($THEME_ID -eq "PASTE_TCW_MAIN_THEME_ID_HERE") {
  Write-Error "Set THEME_ID to the TCW Main theme id from Shopify Admin (themes/XXXXX/editor)."
}

New-Item -ItemType Directory -Force -Path $ROOT | Out-Null
Set-Location $ROOT

Write-Host "Pulling TCW Main ($THEME_ID) from $STORE ..."
shopify theme pull --store=$STORE --theme=$THEME_ID --path=theme

if (-not (Test-Path .git)) {
  git init -b main
}

$readme = @"
# TCW Main (theme V1.1)

Primary Shopify theme for The Coffee Workshop.

``````powershell
shopify theme push --store=$STORE --theme=$THEME_ID --path=theme
``````
"@
Set-Content -Path README.md -Value $readme -Encoding utf8

git add theme README.md
git status
git commit -m "Initial TCW Main theme V1.1 from Shopify" --allow-empty

$hasOrigin = git remote 2>$null | Select-String -Pattern "^origin$"
if (-not $hasOrigin) {
  Write-Host "Creating GitHub repo $REPO ..."
  gh repo create $REPO --private --source=. --remote=origin --push
} else {
  git push -u origin main
}

Write-Host ""
Write-Host "OK. Preview: https://$STORE/?preview_theme_id=$THEME_ID"
Write-Host "Repo: https://github.com/$REPO"
Write-Host "Delete 'TCW refactor staging (Phases 1-4)' in Admin when ready."
