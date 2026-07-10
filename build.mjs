import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from './site.config.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, 'dist');

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.split('\n');
  const output = [];
  let paragraph = [];
  let list = null;
  const flushParagraph = () => {
    if (paragraph.length) output.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (list) output.push(`</${list}>`);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushParagraph(); closeList(); continue; }
    if (line.startsWith('### ')) { flushParagraph(); closeList(); output.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith('## ')) { flushParagraph(); closeList(); output.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith('# ')) { flushParagraph(); closeList(); output.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }
    if (line.startsWith('> ')) { flushParagraph(); closeList(); output.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    if (/^[-*] /.test(line)) {
      flushParagraph();
      if (list !== 'ul') { closeList(); output.push('<ul>'); list = 'ul'; }
      output.push(`<li>${inline(line.slice(2))}</li>`); continue;
    }
    if (/^\d+\. /.test(line)) {
      flushParagraph();
      if (list !== 'ol') { closeList(); output.push('<ol>'); list = 'ol'; }
      output.push(`<li>${inline(line.replace(/^\d+\. /, ''))}</li>`); continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  closeList();
  return output.join('\n');
}

function canonical(pathname) {
  return new URL(pathname, config.site).toString();
}

function layout({ title, description, pathname, body, type = 'website', jsonLd = null }) {
  const url = canonical(pathname);
  const image = canonical('/og-default.svg');
  const nav = config.nav.map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`).join('');
  return `<!doctype html>
<html lang="${config.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="google-site-verification" content="1VqwXHgJlnkzzZwhui5BNQCeGk72fFx62zmG_GF-hjs">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>` : ''}
</head>
<body>
<header class="site-header"><div class="container nav"><a class="brand" href="/"><span class="brand-mark">${escapeHtml(config.mark)}</span><span>${escapeHtml(config.brand)}</span></a><nav class="nav-links">${nav}</nav></div></header>
<main>${body}</main>
<footer class="site-footer"><div class="container footer-grid"><div><strong>${escapeHtml(config.brand)}</strong><p>${escapeHtml(config.footerText)}</p></div><div><a href="/about/">${escapeHtml(config.aboutLabel)}</a><br><a href="${config.github}">GitHub</a></div></div></footer>
</body></html>`;
}

function card(article) {
  return `<article class="card article-card"><div class="card-meta"><span>${escapeHtml(article.category)}</span><time datetime="${escapeHtml(article.publishedAt)}">${new Date(article.publishedAt).toLocaleDateString(config.locale)}</time></div><h3><a href="/articles/${article.slug}/">${escapeHtml(article.title)}</a></h3><p>${escapeHtml(article.description)}</p><a class="text-link" href="/articles/${article.slug}/">${escapeHtml(config.readMore)}</a></article>`;
}

async function write(relative, content) {
  const target = path.join(outDir, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, 'utf8');
}

async function loadExternalArticles() {
  const dir = path.join(root, 'content', 'articles');
  try {
    const files = (await fs.readdir(dir)).filter((name) => name.endsWith('.json')).sort();
    return Promise.all(files.map(async (name) => JSON.parse(await fs.readFile(path.join(dir, name), 'utf8'))));
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });
await write('styles.css', config.styles);
await write('favicon.svg', config.favicon);
await write('og-default.svg', config.ogImage);

const externalArticles = await loadExternalArticles();
const articles = [...config.articles, ...externalArticles]
  .filter((article) => !article.draft)
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

for (const article of articles) {
  const pathname = `/articles/${article.slug}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: { '@type': 'Person', name: 'Moses Zhu' },
    publisher: { '@type': 'Organization', name: config.brand },
    mainEntityOfPage: canonical(pathname),
    keywords: Array.isArray(article.keywords) ? article.keywords.join(', ') : '',
  };
  const body = `<article class="article-shell"><header class="article-header"><a class="eyebrow" href="/articles/">${escapeHtml(config.back)}</a><p class="category">${escapeHtml(article.category)}</p><h1>${escapeHtml(article.title)}</h1><p class="lead">${escapeHtml(article.description)}</p><div class="article-meta"><span>${new Date(article.publishedAt).toLocaleDateString(config.locale)}</span></div></header><div class="article-body prose">${markdownToHtml(article.body)}</div></article>`;
  await write(`articles/${article.slug}/index.html`, layout({ title: `${article.title} | ${config.brand}`, description: article.description, pathname, body, type: 'article', jsonLd }));
}

const featured = config.featuredSlugs.map((slug) => articles.find((article) => article.slug === slug)).filter(Boolean);
const conceptPills = config.concepts.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join('');
const heroSteps = config.heroSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
const homeBody = `<section class="hero"><div class="container hero-grid"><div><p class="kicker">${escapeHtml(config.kicker)}</p><h1>${escapeHtml(config.heroTitle)}</h1><p>${escapeHtml(config.heroDescription)}</p><div class="actions"><a class="button" href="${config.primaryCta.href}">${escapeHtml(config.primaryCta.label)}</a><a class="button secondary" href="/articles/">${escapeHtml(config.secondaryCta)}</a></div></div><aside class="hero-panel"><p class="eyebrow">${escapeHtml(config.heroPanelTitle)}</p><ol>${heroSteps}</ol></aside></div></section>
<section class="section alt" id="themes"><div class="container"><div class="section-head"><p class="eyebrow">${escapeHtml(config.conceptEyebrow)}</p><h2>${escapeHtml(config.conceptTitle)}</h2><p>${escapeHtml(config.conceptDescription)}</p></div><div class="pill-list">${conceptPills}</div></div></section>
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">${escapeHtml(config.featuredEyebrow)}</p><h2>${escapeHtml(config.featuredTitle)}</h2><p>${escapeHtml(config.featuredDescription)}</p></div><div class="grid">${featured.map(card).join('')}</div></div></section>
<section class="section alt" id="boundaries"><div class="container"><div class="callout"><p class="eyebrow light">${escapeHtml(config.calloutEyebrow)}</p><h2>${escapeHtml(config.calloutTitle)}</h2><p>${escapeHtml(config.calloutDescription)}</p><a class="button secondary" href="/about/">${escapeHtml(config.calloutCta)}</a></div></div></section>`;
await write('index.html', layout({ title: config.brand, description: config.description, pathname: '/', body: homeBody }));

const articlesBody = `<section class="articles-page"><p class="eyebrow">${escapeHtml(config.knowledgeLabel)}</p><h1>${escapeHtml(config.articlesTitle)}</h1><p class="lead">${escapeHtml(config.articlesDescription)}</p><div class="article-list">${articles.map(card).join('')}</div></section>`;
await write('articles/index.html', layout({ title: `${config.articlesTitle} | ${config.brand}`, description: config.articlesDescription, pathname: '/articles/', body: articlesBody }));

const aboutBody = `<article class="simple-page prose"><p class="eyebrow">About</p><h1>${escapeHtml(config.aboutTitle)}</h1><p class="lead">${escapeHtml(config.aboutLead)}</p>${config.aboutHtml}</article>`;
await write('about/index.html', layout({ title: `${config.aboutLabel} | ${config.brand}`, description: config.aboutLead, pathname: '/about/', body: aboutBody }));

const urls = ['/', '/articles/', '/about/', ...articles.map((article) => `/articles/${article.slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `\n  <url><loc>${canonical(url)}</loc></url>`).join('')}\n</urlset>\n`;
await write('sitemap.xml', sitemap);
await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${canonical('/sitemap.xml')}\n`);

console.log(`Built ${config.brand}: ${articles.length} articles, ${urls.length} indexed pages.`);
