# Personal Portfolio Website

A personal portfolio website built with Astro, featuring a gallery, blog, and information pages. The site is deployed on Cloudflare Pages.

## Features

- **Gallery**: Showcase of artwork and illustrations with image optimization
- **Blog**: Personal blog posts and articles with content collections
- **Info**: Event information and announcements
- **Links Page**: Social media and external links
- **Dark Mode Toggle**: Automatic and manual theme switching
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **Static Site Generation**: Fast loading times with Astro's SSG approach
- **SEO Optimized**: Automatic sitemap generation

## Project Structure

```text
/
├── public/
│   ├── favicon.ico
│   └── assets/
│       ├── blog/
│       └── illust/
├── src/
│   ├── components/
│   │   ├── DarkModeToggle.astro
│   │   ├── Footer.astro
│   │   ├── GalleryGrid.astro
│   │   ├── GalleryItem.astro
│   │   ├── InfoCard.astro
│   │   ├── NavBar.astro
│   │   ├── PostCard.astro
│   │   └── ...
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
│       ├── gallery/
│       ├── blog/
│       └── info/
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

- Favicon icons located in `public/` directory are © tohu_sand. All rights reserved.
- All other content and code are subject to the project's license terms.
