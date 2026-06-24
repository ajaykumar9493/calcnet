# Deploy to InfinityFree (calnet.site.je)

InfinityFree is **PHP/static hosting** — it cannot run Node.js or `npm start`.
You must upload the **built static files**, not the source code.

## Step 1 — Build for InfinityFree (important!)

```bash
cd c:\MoneyProjects\calcnet
npm install
npm run build:infinityfree
```

This creates an **`out`** folder. It renames `_next` → **`assets`** because InfinityFree often blocks or skips the `_next` folder (that is why you only see plain text with no styling).

## Step 2 — Upload to InfinityFree

1. Log in to [InfinityFree](https://dash.infinityfree.com/accounts/if0_42246214/domains/calnet.site.je)
2. Open **File Manager** (or use FTP — recommended for large uploads)
3. Go to **`htdocs`** (site root for `calnet.site.je`)
4. **Delete everything** currently in `htdocs`
5. Upload **all contents** of the `out` folder into `htdocs`

Your `htdocs` must include:

```
htdocs/
  index.html
  .htaccess
  assets/          ← REQUIRED (CSS, JS, fonts) — NOT _next
  calculators/
  category/
  ...
```

### Verify upload

Open in browser — these must NOT show the homepage HTML:

- http://calnet.site.je/assets/static/chunks/ (should list or 403, not homepage)
- CSS file inside `assets/static/chunks/*.css` should show CSS code

If CSS URL returns the homepage text, the **`assets` folder is missing** or incomplete.

## Step 3 — Visit site

**http://calnet.site.je**

## Why you saw text only (no design)

The page HTML loaded, but **CSS/JS live in `assets/`** (originally `_next/`). If that folder is missing:

- No Tailwind styling (plain text layout)
- No theme toggle / search interactivity
- No charts on calculator pages

**Fix:** Re-upload using `npm run build:infinityfree` and ensure the **`assets` folder** is fully uploaded (use FTP; File Manager may skip underscore folders).

## FTP tip (recommended)

InfinityFree File Manager sometimes fails on large folders. Use FileZilla:

- Host: `ftpupload.net` (check your InfinityFree FTP details)
- Upload entire `out/` contents to `htdocs/`
- Enable "Show hidden files" and confirm `assets/` uploaded with hundreds of files inside
