# ===========================================================
#  TCW V1.1 - cleanup script  (ASCII only, PS 5.1 safe)
#  Claude (Head of Projects), 2026-07-19
#
#  1. Removes 17 duplicate AI-tool skill folders (keeps .claude + .gemini)
#  2. Removes the stale 01-coming-soon-only theme copy
#
#  Dry-run by default. Nothing deletes until you pass -Execute.
#
#  Recoverable: skills reinstall; Shopify still holds theme
#  #140499058784 (Coming Soon Only, unpublished) as rollback.
#
#  Usage:
#     cd "R:\TCW V1.1"
#     .\cleanup.ps1
#     .\cleanup.ps1 -Execute
# ===========================================================

param([switch]$Execute)

$Root = "R:\TCW V1.1"
Set-Location $Root

if ($Execute) { $mode = "EXECUTE" } else { $mode = "DRY RUN" }
Write-Host ""
Write-Host "=== TCW cleanup - $mode ===" -ForegroundColor Cyan
Write-Host ""

$before = @(Get-ChildItem -Path $Root -Recurse -File -Force -ErrorAction SilentlyContinue).Count
Write-Host "Files before: $before"
Write-Host ""

# ---- 1. Duplicate skill folders ---------------------------
$dupeSkillDirs = @(
  '.agents','.augment','.codebuddy','.codewhale','.codex','.continue',
  '.cursor','.factory','.github','.kilocode','.kiro','.opencode',
  '.qoder','.roo','.trae','.warp','.windsurf'
)

Write-Host "--- Duplicate skill folders ---" -ForegroundColor Yellow
$dupeTotal = 0
foreach ($d in $dupeSkillDirs) {
    $p = Join-Path $Root $d
    if (Test-Path $p) {
        $n = @(Get-ChildItem -Path $p -Recurse -File -Force -ErrorAction SilentlyContinue).Count
        $dupeTotal = $dupeTotal + $n
        Write-Host ("  {0,-14} {1,5} files" -f $d, $n)
        if ($Execute) {
            try {
                Remove-Item -LiteralPath $p -Recurse -Force -ErrorAction Stop
                if (Test-Path $p) {
                    Write-Host ("      STILL PRESENT after delete: {0}" -f $p) -ForegroundColor Red
                } else {
                    Write-Host "      removed" -ForegroundColor Green
                }
            }
            catch {
                Write-Host ("      FAILED: {0}" -f $_.Exception.Message) -ForegroundColor Red
            }
        }
    }
}
Write-Host ("  {0,-14} {1,5} files total" -f "SUBTOTAL", $dupeTotal)

# ---- 2. Stale coming-soon theme copy ----------------------
Write-Host ""
Write-Host "--- Stale theme copy ---" -ForegroundColor Yellow
$oldTheme = Join-Path $Root "versions\v1.1.0\01-coming-soon-only"
if (Test-Path $oldTheme) {
    $n = @(Get-ChildItem -Path $oldTheme -Recurse -File -Force -ErrorAction SilentlyContinue).Count
    Write-Host ("  {0,-22} {1,5} files" -f "01-coming-soon-only", $n)
    if ($Execute) {
        try {
            Remove-Item -LiteralPath $oldTheme -Recurse -Force -ErrorAction Stop
            if (Test-Path $oldTheme) {
                Write-Host "      STILL PRESENT after delete" -ForegroundColor Red
            } else {
                Write-Host "      removed" -ForegroundColor Green
            }
        }
        catch {
            Write-Host ("      FAILED: {0}" -f $_.Exception.Message) -ForegroundColor Red
        }
    }
}
else {
    Write-Host "  already gone"
}

# ---- Result -----------------------------------------------
Write-Host ""
if ($Execute) {
    $after = @(Get-ChildItem -Path $Root -Recurse -File -Force -ErrorAction SilentlyContinue).Count
    $removed = $before - $after
    Write-Host "Files after:  $after" -ForegroundColor Green
    Write-Host "Removed:      $removed" -ForegroundColor Green
    Write-Host ""
    Write-Host "Done. Next: mark D-040 done in TASK_BOARD.md" -ForegroundColor Green
}
else {
    Write-Host "DRY RUN - nothing deleted." -ForegroundColor Cyan
    Write-Host "Apply with:  .\cleanup.ps1 -Execute" -ForegroundColor Cyan
}
Write-Host ""

# ===========================================================
#  NOT handled here - do these in Shopify admin:
#    delete sections/home-shop-strip.liquid   (banned, unused)
#    delete sections/home-shop-cta.liquid     (unused)
#    delete theme "Category Fix" #140548767840
#    KEEP  theme "Coming Soon Only" #140499058784 as rollback
# ===========================================================
