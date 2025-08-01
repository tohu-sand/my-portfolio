# Personal Portfolio Website

A personal portfolio website built with Astro, featuring a gallery, blog, and information pages. The site is deployed on Cloudflare Pages.

## 🌟 Features

- **Gallery**: Showcase of artwork and illustrations
- **Blog**: Personal blog posts and articles
- **Info**: Event information and announcements
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **Static Site Generation**: Fast loading times with Astro's SSG approach

## 🚀 Project Structure

```text
/
├── public/
│   ├── favicon.ico
│   └── assets/
│       ├── blog/
│       └── illust/
├── src/
│   ├── components/
│   │   ├── Footer.astro
│   │   ├── GalleryGrid.astro
│   │   ├── NavBar.astro
│   │   └── ...
│   ├── content/
│   │   ├── gallery/
│   │   ├── info/
│   │   └── posts/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       ├── index.astro
│       ├── gallery/
│       ├── blog/
│       └── info/
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Astro Icon](https://github.com/natemoo-re/astro-icon)
- **Package Manager**: pnpm
- **Deployment**: Cloudflare Pages

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command        | Action                                      |
| :------------- | :------------------------------------------ |
| `pnpm install` | Installs dependencies                       |
| `pnpm dev`     | Starts local dev server at `localhost:4321` |
| `pnpm build`   | Build your production site to `./dist/`    |
| `pnpm preview` | Preview your build locally, before deploying |

## 🚀 Deployment

This site is automatically deployed to Cloudflare Pages. Any commits to the main branch will trigger a new deployment.

##  License & Copyright

- Favicon icons located in `public/` directory are © tohu_sand. All rights reserved.
- All other content and code are subject to the project's license terms.
