# Jio Miguel Ong — Personal Website

The source for my personal website, a static site hosted on GitHub Pages.

**Live site:** https://jiomiguelong.uk

## About

A small, fast, dependency-free personal site introducing my work across strategy and
product, communications, community organising, open-source research and hospitality.
It is built with plain HTML, CSS and a little vanilla JavaScript, with no build step
and no frameworks.

## Pages

| Page | File | Description |
| --- | --- | --- |
| Home | `index.html` | Introduction and short personal story |
| Experience | `experience.html` | Full professional history, each role detailed |
| Education | `education.html` | Academic history with modules and subjects |
| Photography | `photography.html` | Wildlife photography gallery with a lightbox |
| Socials | `socials.html` | Links to all my profiles and contact channels |

## Structure

```
.
├── index.html
├── experience.html
├── education.html
├── photography.html
├── socials.html
├── shared.css          # shared tokens, nav, footer, rail, timeline, reset
├── shared.js           # mobile menu and on-page rail highlighting
├── favicon.ico         # kept at root for the browser default fallback
├── og-image.png        # link-preview image used by every page
├── CNAME
├── assets/
│   ├── favicon.svg
│   └── apple-touch-icon.png
└── photos/
    ├── web/      # full-size images shown in the gallery lightbox
    └── thumbs/   # thumbnails shown in the gallery grid
```

## Built with

- HTML5 and modern CSS (Grid, Flexbox, custom properties)
- Vanilla JavaScript for the gallery and lightbox
- Google Fonts: Bricolage Grotesque (variable: optical size, width, weight)
- GitHub Pages for hosting, with a custom domain

## Running locally

No build is required, but the pages use root-relative paths (`/assets/…`) and
extensionless links (`/experience`), so opening `index.html` straight from disk breaks
navigation. Serve the folder with a server that maps `/experience` to
`experience.html`, as GitHub Pages does. With Node.js installed:

```bash
npx serve .
# then visit http://localhost:3000
```

A plain `python -m http.server` will load the pages but return 404 for every nav link.

## Deployment

The site is published with GitHub Pages from the repository's main branch. To deploy,
commit and push; GitHub Pages rebuilds automatically.

Internal links are written without the `.html` extension (for example `/experience`),
and GitHub Pages serves the matching file automatically, so addresses appear as
`jiomiguelong.uk/experience` rather than `…/experience.html`. The custom domain is
configured in the repository settings under Pages.

## Photography

The gallery reads its list of images from an array in `photography.html`. Web-optimised
copies live in `photos/web` (full size, about 1800×1200) and `photos/thumbs` (grid,
900×600), under the same filename. To add a photo, place both files in those folders
and add an entry with the filename and a short description (`alt`) to the array.

Every sixth photo is shown as a large tile, so keep the total a multiple of three or
the desktop grid ends with a gap.

## Licence

© 2026 Jio Miguel Ong. All rights reserved. The site content, text and photographs are
not licensed for reuse without permission.
