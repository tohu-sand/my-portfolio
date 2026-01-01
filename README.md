# Personal Portfolio Website

A personal portfolio website built with Astro, featuring a gallery, blog, and information pages. The site is deployed on Cloudflare Pages.

## Features

- **Gallery**: Showcase of artwork and illustrations with image optimization
- **Blog**: Personal blog posts and articles with content collections
- **Info**: Event information and announcements
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
│   │   ├── config.ts
│   │   ├── gallery/
│   │   ├── info/
│   │   └── posts/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       ├── index.astro
│       ├── link.astro
│       ├── blog/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── contact/
│       │   ├── index.astro
│       │   └── thank-you.astro
│       ├── gallery/
│       │   ├── index.astro
│       │   └── [slug].astro
│       └── info/
│           └── index.astro
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.x with Static Site Generation
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Typography plugin
- **Icons**: [Astro Icon](https://github.com/natemoo-re/astro-icon) with Lucide and Simple Icons
- **Content Management**: Astro Content Collections with TypeScript validation
- **SEO**: Automatic sitemap generation with @astrojs/sitemap
- **Package Manager**: pnpm
- **Deployment**: Cloudflare Pages

## Development

### Prerequisites
- Node.js (recommended: latest LTS version)
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

## Deployment

This site is automatically deployed to Cloudflare Pages. Any commits to the main branch will trigger a new deployment.

##  License & Copyright

- Source code is licensed under the MIT License. See [LICENSE](LICENSE).
- Content assets (artwork, images, and text in `public/` and `src/content/`) are © tohu_sand. All rights reserved unless otherwise noted.
- Third-party dependency licenses are listed in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
