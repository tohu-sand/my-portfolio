# Personal Portfolio Website

An Astro site that publishes an illustration gallery, a blog, and event
announcements at https://tohu-sand.com/.

## Overview

All content is Markdown with front matter under `src/content/`, split into
three collections. Astro builds the whole site to static HTML; there is no
server-side code.

| Collection | Directory | Page | Feed |
|---|---|---|---|
| Gallery | `src/content/gallery/` | `/gallery/` | `/gallery/rss.xml` |
| Blog | `src/content/posts/` | `/blog/` | `/rss.xml` |
| Info | `src/content/info/` | `/info/` | `/info/rss.xml` |

Images are not stored in this repository. Front matter references them by URL
on `cdn.tohu-sand.com`.

## Requirements

- Node.js 22.23.2, pinned in `.node-version`
- pnpm 10.13
- Tested on Linux

## Installation

```bash
pnpm install
```

## Usage

Start the development server:

```bash
pnpm dev
```

```text
Dev server running at http://localhost:4321 (pid 6789)
  Stop:   astro dev stop
  Status: astro dev status
  Logs:   astro dev logs
```

The server keeps running after the command returns. Stop it with
`pnpm astro dev stop`.

### Adding content

Create a Markdown file in the collection directory. Each collection has a
schema in `src/content.config.ts`, and the build fails on an entry that does
not match it. An info entry looks like this:

```markdown
---
title: COMITIA152
date: 2025-06-02
category: Event
location: 東京ビッグサイト
url: https://bsky.app/profile/tohu-sand.com/post/3lq6yt6baes2z
description: 東2 M01b「ロボット技術研究会」にて新刊漫画『ペンタナール・オクタノール・ノナナール』（本文20ページ、500円）を販売します。Webでの販売予定はありません。
---
```

Gallery entries need `title`, `date`, `thumbnail`, and either `image` for an
illustration or `reader.src` for a comic. Blog posts need `title`, `date`, and
`thumbnail`, followed by the article body.

### Info drafts

Git ignores files in `src/content/info/drafts/`. `pnpm dev` shows them next to
the published entries; `pnpm build` leaves them out. To publish a draft, move
it up one level into `src/content/info/` and commit it.

## Development

```bash
pnpm check     # type-check .astro and .ts files
pnpm build     # build to dist/
pnpm preview   # serve dist/ at http://localhost:4321
```

`pnpm build` first regenerates `THIRD_PARTY_LICENSES.md` from the installed
dependencies. Run `pnpm licenses` to regenerate it on its own. Like the
development server, `pnpm preview` keeps running in the background; stop it
with `pnpm astro preview stop`.

## Deployment

Cloudflare Pages builds the `main` branch with `pnpm build` and serves `dist/`.
It reads the Node.js version from `.node-version`. HTTP response headers are
set in `public/_headers`, and crawler rules in `public/robots.txt`.

## License

The source code is under the MIT License. See [LICENSE](LICENSE).

Artwork, images, and text under `public/` and `src/content/` are © tohu_sand.
All rights reserved unless noted otherwise.

Third-party dependency licenses are listed in
[THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
