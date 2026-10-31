---
name: deploy
description: Put a static web app online at a public URL with GitHub Pages, Netlify, Vercel, or Cloudflare Pages, and check the live build. Use when the user wants to deploy, publish, host, or share the app, or asks for a URL.
argument-hint: "[host, e.g. github-pages]"
---

# Deploy

The template builds to static files in `dist/`. Any static host serves it.
Routes use the URL hash and `vite.config.ts` sets `base: "./"`, so the
build works at a domain root and under a subpath with no server rewrites.

Data stays in each visitor's browser. Deploying shares the app, never the
user's data. Say so when you hand over the URL.

## 1. Check first

```bash
npm run check
```

It exits 0. Never deploy a build that fails its checks.

Deploying publishes the app to the internet. Confirm the host and that the
repo or site may be public before the first deploy.

## 2. Pick a host

| Host | Best when | Needs |
| --- | --- | --- |
| GitHub Pages | The code is already on GitHub | A GitHub repo, Pages enabled with "GitHub Actions" as the source |
| Netlify | Drag and drop or one command, no repo needed | `npx netlify-cli deploy`, a Netlify account |
| Vercel | The user already uses Vercel | `npx vercel`, a Vercel account |
| Cloudflare Pages | The user already uses Cloudflare | `npx wrangler pages deploy dist`, a Cloudflare account |

With no preference and the code on GitHub, use GitHub Pages.

## 3. GitHub Pages

Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then in the repo: Settings > Pages > Source: GitHub Actions. Push to
`main`. The URL is `https://<user>.github.io/<repo>/`.

Check: the workflow run is green (`gh run list --limit 1`, or the Actions
tab), and the URL loads.

## 4. Other hosts

Each one takes the `dist/` folder after `npm run build`:

```bash
npx netlify-cli deploy --dir=dist --prod
npx vercel --prod                       # framework preset: Vite, output: dist
npx wrangler pages deploy dist --project-name=<app-name>
```

The first run asks the user to sign in, in their browser. Let them do it.
Never ask for or paste a token.

## 5. Check the live build

Run the self-test against the live URL once. The template's
`playwright.config.ts` skips the local server when `LIVE_URL` is set:

```bash
LIVE_URL=https://<user>.github.io/<repo>/ npm run selftest      # bash, zsh
$env:LIVE_URL="https://<user>.github.io/<repo>/"; npm run selftest   # PowerShell
```

Every test opens a fresh browser profile with a `?store=` test database,
so this never touches a visitor's data. The URL ends with `/`, or relative
paths resolve one folder up.

Also take a snapshot of the live URL and open it with the Read tool: check
the icon, the title, and that the page is not blank. A blank page on a
subpath almost always means `base` is not `"./"`.

## 6. Tell the user

Give the URL, the host, how a new deploy happens (push to `main`, or the
command), and one line: "Each visitor's data stays in their own browser."

Done when the live URL loads the app, the self-test passes against it, and
the user has the URL and the way to deploy again.
