# Personal Portfolio Website

A personal portfolio website built with Astro, featuring a gallery, blog, and information pages. The site is deployed on Cloudflare Pages and published at **https://tohu-sand.com/**.

## Features

- **Gallery**: Showcase of artwork and illustrations with image optimization
- **Blog**: Personal blog posts and articles with content collections
- **Info**: Event information and announcements
- **RSS Feeds**: Separate feeds for blog, gallery, and info collections
- **Contact**: Contact form with thank-you page
- **Links Page**: Social media and external links
- **Dark Mode Toggle**: Automatic and manual theme switching
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **Static Site Generation**: Fast loading times with Astro's SSG approach
- **SEO Optimized**: Automatic sitemap generation and meta tags

## Project Structure

```text
/
├── public/
│   ├── ads.txt
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── favicon-192.png
│   ├── favicon-512.png
│   └── apple-touch-icon.png
├── src/
│   ├── components/
│   │   ├── DarkModeToggle.astro
│   │   ├── Footer.astro
│   │   ├── GalleryGrid.astro
│   │   ├── GalleryItem.astro
│   │   ├── InfoCard.astro
│   │   ├── NavBar.astro
│   │   └── PostCard.astro
│   ├── content/
│   │   ├── gallery/
│   │   ├── info/
│   │   │   └── drafts/      # unpublished info entries (gitignored)
│   │   └── posts/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── styles/
│   │   └── global.css
│   ├── pages/
│   │   ├── index.astro
│   │   ├── link.astro
│   │   ├── rss.xml.js
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── contact/
│   │   │   ├── index.astro
│   │   │   └── thank-you.astro
│   │   ├── gallery/
│   │   │   ├── index.astro
│   │   │   ├── [slug].astro
│   │   │   └── rss.xml.js
│   │   └── info/
│   │       ├── index.astro
│   │       └── rss.xml.js
│   ├── utils/
│   │   ├── date.ts
│   │   ├── info.ts
│   │   ├── jsonLd.ts
│   │   └── slug.ts
│   └── content.config.ts
├── .node-version
├── astro.config.mjs
├── postcss.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v7.x with Static Site Generation
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3 (via PostCSS) with Typography plugin
- **Icons**: [Astro Icon](https://github.com/natemoo-re/astro-icon) with Lucide and Simple Icons
- **Content Management**: Astro Content Collections with TypeScript validation
- **SEO**: Automatic sitemap generation with @astrojs/sitemap and JSON-LD structured data
- **RSS**: Feed generation with @astrojs/rss
- **Package Manager**: pnpm
- **Deployment**: Cloudflare Pages

## Development

### Prerequisites
- Node.js 22.19 or later (pinned to 22.23.2 in `.node-version`; Astro 7 itself needs 22.12+, but its dependencies require 22.19+)
- pnpm (package manager)

### Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The development server will be available at `http://localhost:4321`.

### Info drafts

Unpublished info entries can be written ahead of time in `src/content/info/drafts/`.
Files in that directory are ignored by git (see `.gitignore`), so they are never committed or deployed.

- `pnpm dev` shows drafts alongside published entries so you can preview them.
- `pnpm build` excludes drafts (see `isPublishedInfo` in `src/utils/info.ts`), so a local production build never includes them either.
- To publish a draft, move the file up one level into `src/content/info/` and commit it.

## Deployment

This site is automatically deployed to Cloudflare Pages and published at https://tohu-sand.com/. Any commits to the main branch will trigger a new deployment.

The Node.js version used by the build is pinned in `.node-version` (Cloudflare Pages reads this file).

##  License & Copyright

- Source code is licensed under the MIT License. See [LICENSE](LICENSE).
- Content assets (artwork, images, and text in `public/` and `src/content/`) are © tohu_sand. All rights reserved unless otherwise noted.
- Third-party dependency licenses are listed in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
