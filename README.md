# AI Education Paradigm

Public knowledge and research site for an AI-native education paradigm built around Learning Rails, bounded education agents, teacher confirmation, and learning evidence.

## Current release

The initial release generates:

- a search-friendly home page;
- an article index;
- six seed articles;
- an About and research-boundary page;
- canonical URLs, Open Graph metadata, Article JSON-LD, `robots.txt`, and `sitemap.xml`.

The site uses a zero-dependency Node.js static generator. No framework installation is required.

## Local build

```bash
npm run build
npm run dev
```

Generated files are written to `dist/`.

## Cloudflare Pages

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 20 or newer

After deployment, confirm the assigned `pages.dev` address. If it differs from `https://ai-education-paradigm.pages.dev`, update `site` in `site.config.mjs` before submitting the sitemap to Google Search Console.

## Content direction

The first content pillars are:

1. AI-era education paradigm change;
2. Learning Rails and CourseRails;
3. bounded education agents;
4. the changing role of teachers;
5. learning evidence and student learning state;
6. education governance, privacy, and human confirmation.
