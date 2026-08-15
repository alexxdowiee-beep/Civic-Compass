# Civic Compass

An unofficial, installable web app for the 7 Nov 2026 NZ general election — find your council, browse candidates, and read party statements.

This folder is a **ready-to-host bundle**: drop it on any static host and it becomes an installable app (works on iPhone and Android via "Add to Home Screen") with basic offline support and an admin page for updating content without touching code.

## Files in this bundle

| File | Purpose |
|---|---|
| `index.html` | The app itself — UI and logic, fetches its data at runtime |
| `data/*.json` | All the app's content — councils, parties, statements, electorates, candidate bios, council reps |
| `admin.html` | Password + GitHub-token gated editor for updating `data/*.json` without touching code |
| `manifest.json` | Tells the browser how to install it (name, icon, colours) |
| `service-worker.js` | Caches the app shell so it opens offline |
| `icon-192.png` / `icon-512.png` | App icons, generated from your compass logo |

**Important:** `index.html` now *fetches* its data from the `data/` folder at runtime, rather than having it baked in. That means it needs to be served over `http(s)://` — opening it by double-clicking the file (a `file://` address) will fail, since browsers block that kind of local fetch for security. Use one of the hosting options below, or run a local server (`npx serve` in this folder) to test it.

## Fastest way to host it (free, ~5 minutes)

You need a real GitHub repo for this one anyway (the admin page writes to it), so start there:

1. Create a new GitHub repo, and upload all these files/folders to it, keeping the folder structure intact (`data/` stays a subfolder).
2. Pick a host that deploys straight from that repo:
   - **Netlify**: "Add new site" → "Import an existing project" → connect the repo. Auto-deploys on every push.
   - **GitHub Pages**: repo Settings → Pages → set source to the `main` branch, root folder. Free, simplest, no separate account needed.
   - **Cloudflare Pages**: same idea as Netlify, also free.

Once it's hosted on a real `https://` URL, visiting it on a phone will offer "Add to Home Screen" (Safari: Share → Add to Home Screen; Chrome/Android: usually prompts automatically, or Menu → Install app).

## Updating content — the admin page

Open `yoursite.com/admin.html`. It needs three things:

1. **A passphrase** — this is just a personal speed-bump, not real security. Don't overthink it.
2. **Your GitHub repo details** — username, repo name, branch (usually `main`).
3. **A GitHub personal access token** — create a **fine-grained** one at github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens. Scope it to *only this repo*, with *only* "Contents: Read and write" permission, and set an expiry date (e.g. 90 days). This token is the actual security boundary — nobody can save changes without one that has write access to your repo, regardless of the passphrase.

From there:
- **Recent Statements** has a proper form — add a new dated, sourced statement, or remove an old one, then hit save.
- **Everything else** (councils, parties, electorates, candidate bios, council reps) is a raw JSON editor — it fetches the live file from GitHub, you edit the text directly, and it validates the JSON before saving. No pretty form yet for these; edit carefully and keep the structure intact.

Saves commit straight to your GitHub repo. If your host auto-deploys from that repo (Netlify/Cloudflare Pages do this by default; GitHub Pages does too), the live site updates within a minute or two.

**One thing to know:** because `admin.html` lives in the same public repo as the app, anyone who finds the URL can *open* it — they just can't *save* anything without your token. If that bothers you, don't include `admin.html` in your deployed folder at all, and instead keep a local copy on your own machine that you open (double-click, or `npx serve`) only when you want to make an edit — it talks directly to GitHub's API, so it doesn't need to be hosted itself to work.

## Before this goes out to the public

This was built as a personal tool and the data reflects that — worth fixing before wider release:

- **Coverage is uneven.** Selwyn, Christchurch, Ashburton, and Waimakariri have full detail (councillors, mayor, recent decisions, MP, candidate bios). All 63 other councils and most other electorates only show basic official links — a stranger picking a different area will get a noticeably thinner experience.
- **It's a snapshot, not a live feed.** Everything is accurate as of the dates shown in-app (mostly late July 2026), not real-time. The admin page makes updating easier, but nothing updates itself — someone still has to notice something changed and go add it.
- **No feedback mechanism for end users.** If a visitor spots something wrong, there's currently no way for them to flag it. Worth adding even a simple `mailto:` link or a form before wide release.
- **No analytics/monitoring.** You won't know if it's breaking for people, being used, or where it's inaccurate, unless you add something (e.g. a privacy-respecting analytics tool) yourself.
- **Election-content stakes.** Once this isn't just for you, mistakes have more consequence — keep the "Prototype / unofficial" banner visible and accurate, and consider a visible "report an issue" path before promoting it widely.

## If you want an actual App Store / Play Store listing later

This bundle can be wrapped with [Capacitor](https://capacitorjs.com/) into a native iOS/Android app once you're ready — that needs Xcode (Mac) for iOS, Android Studio for Android, an Apple Developer account ($99/yr), and a Google Play Developer account ($25 one-time). Not necessary for a PWA — only relevant if you specifically want store presence.
