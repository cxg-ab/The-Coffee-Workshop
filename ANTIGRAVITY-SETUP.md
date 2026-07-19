# Antigravity project setup — The Coffee Workshop

> Written by Claude (Head of Projects), 2026-07-19.
> Companion to `AGENTS.md`. Follow in order — step 5 matters most.

---

## ⚠️ Step 0 — The folder decision (read this first)

**Do NOT put the project inside `G:\My Drive\`.**

Google Drive is a *syncing* folder. Git is a *database* of thousands of small files in `.git/`. Drive syncs them mid-write, locks files while indexing, and creates `file (1).liquid` conflict copies. Symptoms you've already hit on this project:

- Drive serving stale files during pushes (documented in `AGENTS.md`)
- The Drive copy silently forking from the live theme (D-042 / D-043)
- `npm` / `git` failures on Drive paths (`AGENTS.md` §8)

Put the working repo on a **local disk**:

```
C:\dev\the-coffee-workshop\
```

Keep `R:\TCW V1.1\` for what Drive is good at — the orchestration docs (`AGENTS.md`, `TASK_BOARD.md`, `reports/`). Those are human-readable, rarely written by tooling, and benefit from cloud backup.

**Rule:** code lives local + GitHub. Docs live on Drive. Never both.

---

## Step 1 — Prerequisites

Install, then confirm each one reports a version:

```powershell
node --version      # Node 18+
git --version
shopify version     # npm install -g @shopify/cli @shopify/theme
```

---

## Step 2 — Clone the repo to the local path

```powershell
mkdir C:\dev
cd C:\dev
git clone https://github.com/cxg-ab/The-Coffee-Workshop.git the-coffee-workshop
cd the-coffee-workshop
```

---

## Step 3 — Open in Antigravity + set the terminal policy

1. Antigravity → **Open Folder** → `C:\dev\the-coffee-workshop`
2. Sign in with your Google account.
3. Settings → **Terminal Execution Policy**.
   - Start on **Request review**, not "Always proceed". You approve each command.
   - Add an allow-list for safe reads once you trust it: `git status`, `git diff`, `ls`, `shopify theme list`.
   - Keep `shopify theme push`, `git push`, and anything with `rm` / `--force` on manual review. This theme is **live**.

---

## Step 4 — Authenticate Shopify CLI

```powershell
shopify auth login --store 7medyz-sn.myshopify.com
shopify theme list --store 7medyz-sn.myshopify.com
```

`theme list` should show:

| Theme | ID | Role |
|-------|----|------|
| The Coffee Workshop - Luxury Refresh | `140498305120` | **live** |
| Coming Soon Only | `140499058784` | unpublished |
| The Coffee Workshop - Category Fix | `140548767840` | unpublished |

---

## Step 5 — ⚠️ Reconcile before you trust anything

**GitHub is stale.** `TASK_BOARD.md` item **L-002** ("GitHub sync: Motion Pack v2 + P1/P2 + D-013/D-014") is still open — meaning work shipped to Shopify was never pushed to GitHub. The Drive copy had also forked (D-042).

So: **Shopify live is the single source of truth. Not GitHub, not Drive.**

Pull live down over the repo before doing any work:

```powershell
cd C:\dev\the-coffee-workshop
shopify theme pull --store 7medyz-sn.myshopify.com --path theme --theme 140498305120
```

This also fixes a second problem: it brings down the **binary assets** (217 `bean_*.webp` frames, `bean-roast-scroll.mp4`, posters) that no local copy currently has in full.

Then inspect what changed before committing:

```powershell
git status
git diff --stat
```

Expect a large diff. That diff *is* the drift — it's the gap between GitHub and reality.

---

## Step 6 — Commit the reconciled truth

```powershell
git add -A
git commit -m "chore: reconcile repo with live theme 140498305120 (closes L-002)"
git push origin main
```

After this, GitHub and Shopify agree for the first time. Mark **L-002 done** in `TASK_BOARD.md`.

---

## Step 7 — Give the agent its rules

Antigravity agents read repo-root context files. Copy the protocol in so the agent inherits the standing rules instead of guessing:

```powershell
copy "R:\TCW V1.1\AGENTS.md" C:\dev\the-coffee-workshop\AGENTS.md
```

Non-negotiables it must respect (all already in `AGENTS.md`):

- **NO coffee subscriptions** — anywhere, ever
- Theme `140498305120` is **LIVE** — never push without explicit approval
- Never publish/unpublish a theme or disable the store password
- No React / Framer Motion in the Liquid theme
- Don't reintroduce `origins-marquee`, `featured-collection`, `home-shop-strip`
- Verify every push by read-back — never trust a "success" message alone

---

## Step 8 — `.gitignore`

Confirm the repo root has at least:

```
node_modules/
.DS_Store
Thumbs.db
*.log
.shopify/
```

---

## First tasks to hand the agent (in order)

1. `theme pull` + commit — step 5–6 above (**do this first**)
2. Push staged D-038 — `sections/origin-sticky.liquid` (font/fade trim)
3. Add the studio-sweep product backdrop to `.tcw-product-media` in `assets/application.css` — one edit covers collection cards **and** PDP
4. Delete orphan sections `home-shop-strip.liquid`, `home-shop-cta.liquid` (in no template; `home-shop-strip` is on the banned list)
5. Delete the duplicate `Category Fix` theme once confirmed redundant
6. Delete local `R:\TCW V1.1\versions\v1.1.0\01-coming-soon-only\` — Shopify holds three copies, keep theme `#140499058784` as rollback

---

## After this is working

`R:\TCW V1.1\versions\v1.1.0\02-luxury-refresh\` becomes **obsolete** — the local repo replaces it. Don't maintain both; that duplication is what created the fork. Retire it once step 6 is green.
