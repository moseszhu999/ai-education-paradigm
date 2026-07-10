import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from './site.config.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, 'dist');
const isZh = config.lang.toLowerCase().startsWith('zh');
const ui = isZh ? {
  tools: '工具',
  toolsTitle: '工具与检查表',
  toolsDescription: '可直接勾选、打印并用于教育试点与日常实践的结构化工具。',
  openTool: '打开工具 →',
  backTools: '← 返回全部工具',
  print: '打印或保存为 PDF',
  notes: '现场记录',
  notesPlaceholder: '记录观察、问题、决定和下一步……',
} : {
  tools: 'Tools',
  toolsTitle: 'Tools and checklists',
  toolsDescription: 'Practical, printable tools for evidence operations and bounded review preparation.',
  openTool: 'Open tool →',
  backTools: '← Back to all tools',
  print: 'Print or save as PDF',
  notes: 'Working notes',
  notesPlaceholder: 'Record observations, questions, decisions, and next actions…',
};

const toolStyles = `
.tools-page{width:min(1000px,calc(100% - 40px));margin:0 auto;padding:72px 0}.tool-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:34px}.tool-shell{width:min(900px,calc(100% - 40px));margin:0 auto;padding:72px 0}.tool-actions{display:flex;gap:12px;flex-wrap:wrap;margin:26px 0}.tool-section{margin:34px 0;padding:26px;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius)}.tool-section h2{font-size:1.55rem}.checklist{list-style:none;padding:0;margin:18px 0 0}.check-item{padding:11px 0;border-bottom:1px solid var(--line)}.check-item:last-child{border-bottom:0}.check-item label{display:flex;gap:12px;align-items:flex-start;cursor:pointer}.check-item input{width:20px;height:20px;margin-top:3px;accent-color:var(--brand);flex:0 0 auto}.tool-notes{width:100%;min-height:180px;padding:16px;border:1px solid var(--line);border-radius:14px;font:inherit;background:#fff}.boundary-note{margin:30px 0;padding:18px 22px;border-left:4px solid var(--accent);background:var(--surface-strong);border-radius:0 14px 14px 0}@media(max-width:820px){.tool-grid{grid-template-columns:1fr}}@media print{.site-header,.site-footer,.tool-actions{display:none!important}.tool-shell{width:100%;padding:0}.tool-section{break-inside:avoid;box-shadow:none}.tool-notes{min-height:120px}body{background:#fff}}
`;

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
  const configuredNav = [...config.nav];
  const toolsLink = { href: '/tools/', label: ui.tools };
  const navItems = configuredNav.some((item) => item.href === '/tools/')
    ? configuredNav
    : [configuredNav[0], toolsLink, ...configuredNav.slice(1)].filter(Boolean);
  const nav = navItems.map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`).join('');
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
<footer class="site-footer"><div class="container footer-grid"><div><strong>${escapeHtml(config.brand)}</strong><p>${escapeHtml(config.footerText)}</p></div><div><a href="/tools/">${escapeHtml(ui.tools)}</a><br><a href="/about/">${escapeHtml(config.aboutLabel)}</a><br><a href="${config.github}">GitHub</a></div></div></footer>
</body></html>`;
}

function card(article) {
  return `<article class="card article-card"><div class="card-meta"><span>${escapeHtml(article.category)}</span><time datetime="${escapeHtml(article.publishedAt)}">${new Date(article.publishedAt).toLocaleDateString(config.locale)}</time></div><h3><a href="/articles/${article.slug}/">${escapeHtml(article.title)}</a></h3><p>${escapeHtml(article.description)}</p><a class="text-link" href="/articles/${article.slug}/">${escapeHtml(config.readMore)}</a></article>`;
}

function toolCard(tool) {
  return `<article class="card"><div class="card-meta"><span>${escapeHtml(tool.category)}</span><span>${escapeHtml(ui.tools)}</span></div><h3><a href="/tools/${tool.slug}/">${escapeHtml(tool.title)}</a></h3><p>${escapeHtml(tool.description)}</p><a class="text-link" href="/tools/${tool.slug}/">${escapeHtml(ui.openTool)}</a></article>`;
}

async function write(relative, content) {
  const target = path.join(outDir, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, 'utf8');
}

async function loadJsonCollection(folder) {
  const dir = path.join(root, 'content', folder);
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
await write('styles.css', `${config.styles}${toolStyles}`);
await write('favicon.svg', config.favicon);
await write('og-default.svg', config.ogImage);

const externalArticles = await loadJsonCollection('articles');
const articles = [...config.articles, ...externalArticles]
  .filter((article) => !article.draft)
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
const tools = (await loadJsonCollection('tools'))
  .filter((tool) => !tool.draft)
  .sort((a, b) => String(a.title).localeCompare(String(b.title), config.locale));

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

for (const tool of tools) {
  const pathname = `/tools/${tool.slug}/`;
  const sections = (tool.sections || []).map((section) => `<section class="tool-section"><h2>${escapeHtml(section.title)}</h2><ul class="checklist">${(section.items || []).map((item) => `<li class="check-item"><label><input type="checkbox"><span>${inline(item)}</span></label></li>`).join('')}</ul></section>`).join('');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: tool.title,
    description: tool.description,
    dateModified: tool.updatedAt || tool.publishedAt || '2026-07-10',
    isPartOf: { '@type': 'WebSite', name: config.brand, url: canonical('/') },
    url: canonical(pathname),
  };
  const body = `<article class="tool-shell"><header class="article-header"><a class="eyebrow" href="/tools/">${escapeHtml(ui.backTools)}</a><p class="category">${escapeHtml(tool.category)}</p><h1>${escapeHtml(tool.title)}</h1><p class="lead">${escapeHtml(tool.description)}</p></header><div class="tool-actions"><button class="button" type="button" onclick="window.print()">${escapeHtml(ui.print)}</button></div><div class="prose"><p>${inline(tool.intro || '')}</p></div>${sections}${tool.boundary ? `<div class="boundary-note"><strong>${isZh ? '使用边界：' : 'Use boundary: '}</strong>${inline(tool.boundary)}</div>` : ''}<section class="tool-section"><h2>${escapeHtml(ui.notes)}</h2><textarea class="tool-notes" placeholder="${escapeHtml(ui.notesPlaceholder)}"></textarea></section></article>`;
  await write(`tools/${tool.slug}/index.html`, layout({ title: `${tool.title} | ${config.brand}`, description: tool.description, pathname, body, jsonLd }));
}

const featured = config.featuredSlugs.map((slug) => articles.find((article) => article.slug === slug)).filter(Boolean);
const conceptPills = config.concepts.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join('');
const heroSteps = config.heroSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
const homeBody = `<section class="hero"><div class="container hero-grid"><div><p class="kicker">${escapeHtml(config.kicker)}</p><h1>${escapeHtml(config.heroTitle)}</h1><p>${escapeHtml(config.heroDescription)}</p><div class="actions"><a class="button" href="${config.primaryCta.href}">${escapeHtml(config.primaryCta.label)}</a><a class="button secondary" href="/articles/">${escapeHtml(config.secondaryCta)}</a></div></div><aside class="hero-panel"><p class="eyebrow">${escapeHtml(config.heroPanelTitle)}</p><ol>${heroSteps}</ol></aside></div></section>
<section class="section alt" id="themes"><div class="container"><div class="section-head"><p class="eyebrow">${escapeHtml(config.conceptEyebrow)}</p><h2>${escapeHtml(config.conceptTitle)}</h2><p>${escapeHtml(config.conceptDescription)}</p></div><div class="pill-list">${conceptPills}</div></div></section>
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">${escapeHtml(config.featuredEyebrow)}</p><h2>${escapeHtml(config.featuredTitle)}</h2><p>${escapeHtml(config.featuredDescription)}</p></div><div class="grid">${featured.map(card).join('')}</div></div></section>
${tools.length ? `<section class="section alt"><div class="container"><div class="section-head"><p class="eyebrow">${escapeHtml(ui.tools)}</p><h2>${escapeHtml(ui.toolsTitle)}</h2><p>${escapeHtml(ui.toolsDescription)}</p></div><div class="grid">${tools.slice(0,3).map(toolCard).join('')}</div></div></section>` : ''}
<section class="section alt" id="boundaries"><div class="container"><div class="callout"><p class="eyebrow light">${escapeHtml(config.calloutEyebrow)}</p><h2>${escapeHtml(config.calloutTitle)}</h2><p>${escapeHtml(config.calloutDescription)}</p><a class="button secondary" href="/about/">${escapeHtml(config.calloutCta)}</a></div></div></section>`;
await write('index.html', layout({ title: config.brand, description: config.description, pathname: '/', body: homeBody }));

const articlesBody = `<section class="articles-page"><p class="eyebrow">${escapeHtml(config.knowledgeLabel)}</p><h1>${escapeHtml(config.articlesTitle)}</h1><p class="lead">${escapeHtml(config.articlesDescription)}</p><div class="article-list">${articles.map(card).join('')}</div></section>`;
await write('articles/index.html', layout({ title: `${config.articlesTitle} | ${config.brand}`, description: config.articlesDescription, pathname: '/articles/', body: articlesBody }));

const toolsBody = `<section class="tools-page"><p class="eyebrow">${escapeHtml(ui.tools)}</p><h1>${escapeHtml(ui.toolsTitle)}</h1><p class="lead">${escapeHtml(ui.toolsDescription)}</p><div class="tool-grid">${tools.map(toolCard).join('')}</div></section>`;
await write('tools/index.html', layout({ title: `${ui.toolsTitle} | ${config.brand}`, description: ui.toolsDescription, pathname: '/tools/', body: toolsBody }));

const aboutBody = `<article class="simple-page prose"><p class="eyebrow">About</p><h1>${escapeHtml(config.aboutTitle)}</h1><p class="lead">${escapeHtml(config.aboutLead)}</p>${config.aboutHtml}</article>`;
await write('about/index.html', layout({ title: `${config.aboutLabel} | ${config.brand}`, description: config.aboutLead, pathname: '/about/', body: aboutBody }));

const urls = ['/', '/articles/', '/tools/', '/about/', ...articles.map((article) => `/articles/${article.slug}/`), ...tools.map((tool) => `/tools/${tool.slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `\n  <url><loc>${canonical(url)}</loc></url>`).join('')}\n</urlset>\n`;
await write('sitemap.xml', sitemap);
await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${canonical('/sitemap.xml')}\n`);

console.log(`Built ${config.brand}: ${articles.length} articles, ${tools.length} tools, ${urls.length} indexed pages.`);
