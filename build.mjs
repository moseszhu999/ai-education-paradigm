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
  topics: '主题',
  topicsTitle: '主题学习路径',
  topicsDescription: '把文章与工具组织成可连续阅读、可实践的知识路径。',
  openTopic: '进入主题 →',
  backTopics: '← 返回全部主题',
  related: '继续阅读',
  relatedTools: '相关工具',
  articles: '相关文章',
  home: '首页',
} : {
  tools: 'Tools',
  toolsTitle: 'Tools and checklists',
  toolsDescription: 'Practical, printable tools for evidence operations and bounded review preparation.',
  openTool: 'Open tool →',
  backTools: '← Back to all tools',
  print: 'Print or save as PDF',
  notes: 'Working notes',
  notesPlaceholder: 'Record observations, questions, decisions, and next actions…',
  topics: 'Topics',
  topicsTitle: 'Topic pathways',
  topicsDescription: 'Structured pathways that connect foundation insights, practical questions, and usable tools.',
  openTopic: 'Explore topic →',
  backTopics: '← Back to all topics',
  related: 'Continue reading',
  relatedTools: 'Related tools',
  articles: 'Related insights',
  home: 'Home',
};

const extraStyles = `
.tools-page,.topics-page{width:min(1000px,calc(100% - 40px));margin:0 auto;padding:72px 0}.tool-grid,.topic-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:34px}.tool-shell,.topic-shell{width:min(900px,calc(100% - 40px));margin:0 auto;padding:72px 0}.tool-actions{display:flex;gap:12px;flex-wrap:wrap;margin:26px 0}.tool-section{margin:34px 0;padding:26px;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius)}.tool-section h2{font-size:1.55rem}.checklist{list-style:none;padding:0;margin:18px 0 0}.check-item{padding:11px 0;border-bottom:1px solid var(--line)}.check-item:last-child{border-bottom:0}.check-item label{display:flex;gap:12px;align-items:flex-start;cursor:pointer}.check-item input{width:20px;height:20px;margin-top:3px;accent-color:var(--brand);flex:0 0 auto}.tool-notes{width:100%;min-height:180px;padding:16px;border:1px solid var(--line);border-radius:14px;font:inherit;background:#fff}.boundary-note{margin:30px 0;padding:18px 22px;border-left:4px solid var(--accent);background:var(--surface-strong);border-radius:0 14px 14px 0}.breadcrumbs{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:24px;color:var(--muted);font-size:.9rem}.breadcrumbs a{text-decoration:none;color:var(--brand)}.related-block{margin-top:56px;padding-top:34px;border-top:1px solid var(--line)}.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:22px}.topic-section{margin-top:48px}.topic-summary{font-size:1.1rem;color:var(--muted)}@media(max-width:820px){.tool-grid,.topic-grid,.related-grid{grid-template-columns:1fr}}@media print{.site-header,.site-footer,.tool-actions,.breadcrumbs,.related-block{display:none!important}.tool-shell{width:100%;padding:0}.tool-section{break-inside:avoid;box-shadow:none}.tool-notes{min-height:120px}body{background:#fff}}
`;

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const escapeXml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown = '') {
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

function breadcrumbData(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: canonical(item.href),
    })),
  };
}

function graph(main, breadcrumbs) {
  const cleanMain = { ...main };
  delete cleanMain['@context'];
  return { '@context': 'https://schema.org', '@graph': [cleanMain, breadcrumbData(breadcrumbs)] };
}

function breadcrumbHtml(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${items.map((item, index) => index === items.length - 1
    ? `<span aria-current="page">${escapeHtml(item.label)}</span>`
    : `<a href="${item.href}">${escapeHtml(item.label)}</a><span aria-hidden="true">/</span>`).join('')}</nav>`;
}

function layout({ title, description, pathname, body, type = 'website', jsonLd = null }) {
  const url = canonical(pathname);
  const image = canonical('/og-default.svg');
  const configuredNav = [...config.nav].filter((item) => !['/topics/', '/tools/'].includes(item.href));
  const navItems = [configuredNav[0], { href: '/topics/', label: ui.topics }, { href: '/tools/', label: ui.tools }, ...configuredNav.slice(1)].filter(Boolean);
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
  <link rel="alternate" type="application/rss+xml" title="${escapeHtml(config.brand)}" href="${canonical('/feed.xml')}">
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
<footer class="site-footer"><div class="container footer-grid"><div><strong>${escapeHtml(config.brand)}</strong><p>${escapeHtml(config.footerText)}</p></div><div><a href="/topics/">${escapeHtml(ui.topics)}</a><br><a href="/tools/">${escapeHtml(ui.tools)}</a><br><a href="/feed.xml">RSS</a><br><a href="/about/">${escapeHtml(config.aboutLabel)}</a><br><a href="${config.github}">GitHub</a></div></div></footer>
</body></html>`;
}

function card(article) {
  return `<article class="card article-card"><div class="card-meta"><span>${escapeHtml(article.category)}</span><time datetime="${escapeHtml(article.publishedAt)}">${new Date(article.publishedAt).toLocaleDateString(config.locale)}</time></div><h3><a href="/articles/${article.slug}/">${escapeHtml(article.title)}</a></h3><p>${escapeHtml(article.description)}</p><a class="text-link" href="/articles/${article.slug}/">${escapeHtml(config.readMore)}</a></article>`;
}

function toolCard(tool) {
  return `<article class="card"><div class="card-meta"><span>${escapeHtml(tool.category)}</span><span>${escapeHtml(ui.tools)}</span></div><h3><a href="/tools/${tool.slug}/">${escapeHtml(tool.title)}</a></h3><p>${escapeHtml(tool.description)}</p><a class="text-link" href="/tools/${tool.slug}/">${escapeHtml(ui.openTool)}</a></article>`;
}

function topicCard(topic) {
  return `<article class="card"><div class="card-meta"><span>${escapeHtml(ui.topics)}</span><span>${(topic.articleSlugs || []).length} ${escapeHtml(ui.articles)}</span></div><h3><a href="/topics/${topic.slug}/">${escapeHtml(topic.title)}</a></h3><p>${escapeHtml(topic.description)}</p><a class="text-link" href="/topics/${topic.slug}/">${escapeHtml(ui.openTopic)}</a></article>`;
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

function relatedArticles(article, articles, topics) {
  const topic = topics.find((candidate) => (candidate.articleSlugs || []).includes(article.slug));
  const fromTopic = topic ? (topic.articleSlugs || []).filter((slug) => slug !== article.slug) : [];
  const fallback = articles
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const sharedKeywords = (candidate.keywords || []).filter((keyword) => (article.keywords || []).includes(keyword)).length;
      const categoryMatch = candidate.category === article.category ? 2 : 0;
      return { slug: candidate.slug, score: sharedKeywords + categoryMatch };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.slug);
  return [...new Set([...fromTopic, ...fallback])]
    .map((slug) => articles.find((candidate) => candidate.slug === slug))
    .filter(Boolean)
    .slice(0, 3);
}

function relatedBlock(title, items, renderer) {
  if (!items.length) return '';
  return `<section class="related-block"><h2>${escapeHtml(title)}</h2><div class="related-grid">${items.map(renderer).join('')}</div></section>`;
}

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });
await write('styles.css', `${config.styles}${extraStyles}`);
await write('favicon.svg', config.favicon);
await write('og-default.svg', config.ogImage);

const externalArticles = await loadJsonCollection('articles');
const articles = [...config.articles, ...externalArticles]
  .filter((article) => !article.draft)
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
const tools = (await loadJsonCollection('tools'))
  .filter((tool) => !tool.draft)
  .sort((a, b) => String(a.title).localeCompare(String(b.title), config.locale));
const topics = (await loadJsonCollection('topics'))
  .filter((topic) => !topic.draft)
  .sort((a, b) => String(a.title).localeCompare(String(b.title), config.locale));

for (const article of articles) {
  const pathname = `/articles/${article.slug}/`;
  const breadcrumbs = [
    { label: ui.home, href: '/' },
    { label: config.articlesTitle, href: '/articles/' },
    { label: article.title, href: pathname },
  ];
  const related = relatedArticles(article, articles, topics);
  const relatedTopics = topics.filter((topic) => (topic.articleSlugs || []).includes(article.slug));
  const jsonLd = graph({
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: { '@type': 'Person', name: 'Moses Zhu' },
    publisher: { '@type': 'Organization', name: config.brand },
    mainEntityOfPage: canonical(pathname),
    keywords: Array.isArray(article.keywords) ? article.keywords.join(', ') : '',
  }, breadcrumbs);
  const body = `<article class="article-shell">${breadcrumbHtml(breadcrumbs)}<header class="article-header"><p class="category">${escapeHtml(article.category)}</p><h1>${escapeHtml(article.title)}</h1><p class="lead">${escapeHtml(article.description)}</p><div class="article-meta"><span>${new Date(article.publishedAt).toLocaleDateString(config.locale)}</span></div></header><div class="article-body prose">${markdownToHtml(article.body)}</div>${relatedBlock(ui.related, related, card)}${relatedBlock(ui.topics, relatedTopics, topicCard)}</article>`;
  await write(`articles/${article.slug}/index.html`, layout({ title: `${article.title} | ${config.brand}`, description: article.description, pathname, body, type: 'article', jsonLd }));
}

for (const tool of tools) {
  const pathname = `/tools/${tool.slug}/`;
  const breadcrumbs = [
    { label: ui.home, href: '/' },
    { label: ui.toolsTitle, href: '/tools/' },
    { label: tool.title, href: pathname },
  ];
  const sections = (tool.sections || []).map((section) => `<section class="tool-section"><h2>${escapeHtml(section.title)}</h2><ul class="checklist">${(section.items || []).map((item) => `<li class="check-item"><label><input type="checkbox"><span>${inline(item)}</span></label></li>`).join('')}</ul></section>`).join('');
  const relatedTopics = topics.filter((topic) => (topic.toolSlugs || []).includes(tool.slug));
  const jsonLd = graph({
    '@type': 'WebPage',
    name: tool.title,
    description: tool.description,
    dateModified: tool.updatedAt || tool.publishedAt || '2026-07-10',
    isPartOf: { '@type': 'WebSite', name: config.brand, url: canonical('/') },
    url: canonical(pathname),
  }, breadcrumbs);
  const body = `<article class="tool-shell">${breadcrumbHtml(breadcrumbs)}<header class="article-header"><p class="category">${escapeHtml(tool.category)}</p><h1>${escapeHtml(tool.title)}</h1><p class="lead">${escapeHtml(tool.description)}</p></header><div class="tool-actions"><button class="button" type="button" onclick="window.print()">${escapeHtml(ui.print)}</button></div><div class="prose"><p>${inline(tool.intro || '')}</p></div>${sections}${tool.boundary ? `<div class="boundary-note"><strong>${isZh ? '使用边界：' : 'Use boundary: '}</strong>${inline(tool.boundary)}</div>` : ''}<section class="tool-section"><h2>${escapeHtml(ui.notes)}</h2><textarea class="tool-notes" placeholder="${escapeHtml(ui.notesPlaceholder)}"></textarea></section>${relatedBlock(ui.topics, relatedTopics, topicCard)}</article>`;
  await write(`tools/${tool.slug}/index.html`, layout({ title: `${tool.title} | ${config.brand}`, description: tool.description, pathname, body, jsonLd }));
}

for (const topic of topics) {
  const pathname = `/topics/${topic.slug}/`;
  const breadcrumbs = [
    { label: ui.home, href: '/' },
    { label: ui.topicsTitle, href: '/topics/' },
    { label: topic.title, href: pathname },
  ];
  const topicArticles = (topic.articleSlugs || []).map((slug) => articles.find((article) => article.slug === slug)).filter(Boolean);
  const topicTools = (topic.toolSlugs || []).map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean);
  const jsonLd = graph({
    '@type': 'CollectionPage',
    name: topic.title,
    description: topic.description,
    url: canonical(pathname),
    keywords: (topic.keywords || []).join(', '),
    hasPart: [
      ...topicArticles.map((article) => ({ '@type': 'Article', name: article.title, url: canonical(`/articles/${article.slug}/`) })),
      ...topicTools.map((tool) => ({ '@type': 'WebPage', name: tool.title, url: canonical(`/tools/${tool.slug}/`) })),
    ],
  }, breadcrumbs);
  const body = `<article class="topic-shell">${breadcrumbHtml(breadcrumbs)}<header class="article-header"><p class="category">${escapeHtml(ui.topics)}</p><h1>${escapeHtml(topic.title)}</h1><p class="lead">${escapeHtml(topic.description)}</p></header><div class="prose topic-summary">${markdownToHtml(topic.intro || '')}</div><section class="topic-section"><h2>${escapeHtml(ui.articles)}</h2><div class="article-list">${topicArticles.map(card).join('')}</div></section>${topicTools.length ? `<section class="topic-section"><h2>${escapeHtml(ui.relatedTools)}</h2><div class="tool-grid">${topicTools.map(toolCard).join('')}</div></section>` : ''}</article>`;
  await write(`topics/${topic.slug}/index.html`, layout({ title: `${topic.title} | ${config.brand}`, description: topic.description, pathname, body, jsonLd }));
}

const featured = config.featuredSlugs.map((slug) => articles.find((article) => article.slug === slug)).filter(Boolean);
const conceptPills = config.concepts.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join('');
const heroSteps = config.heroSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
const homeBody = `<section class="hero"><div class="container hero-grid"><div><p class="kicker">${escapeHtml(config.kicker)}</p><h1>${escapeHtml(config.heroTitle)}</h1><p>${escapeHtml(config.heroDescription)}</p><div class="actions"><a class="button" href="${config.primaryCta.href}">${escapeHtml(config.primaryCta.label)}</a><a class="button secondary" href="/topics/">${escapeHtml(ui.topicsTitle)}</a></div></div><aside class="hero-panel"><p class="eyebrow">${escapeHtml(config.heroPanelTitle)}</p><ol>${heroSteps}</ol></aside></div></section>
<section class="section alt" id="themes"><div class="container"><div class="section-head"><p class="eyebrow">${escapeHtml(config.conceptEyebrow)}</p><h2>${escapeHtml(config.conceptTitle)}</h2><p>${escapeHtml(config.conceptDescription)}</p></div><div class="pill-list">${conceptPills}</div></div></section>
${topics.length ? `<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">${escapeHtml(ui.topics)}</p><h2>${escapeHtml(ui.topicsTitle)}</h2><p>${escapeHtml(ui.topicsDescription)}</p></div><div class="grid">${topics.slice(0,3).map(topicCard).join('')}</div></div></section>` : ''}
<section class="section alt"><div class="container"><div class="section-head"><p class="eyebrow">${escapeHtml(config.featuredEyebrow)}</p><h2>${escapeHtml(config.featuredTitle)}</h2><p>${escapeHtml(config.featuredDescription)}</p></div><div class="grid">${featured.map(card).join('')}</div></div></section>
${tools.length ? `<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">${escapeHtml(ui.tools)}</p><h2>${escapeHtml(ui.toolsTitle)}</h2><p>${escapeHtml(ui.toolsDescription)}</p></div><div class="grid">${tools.slice(0,3).map(toolCard).join('')}</div></div></section>` : ''}
<section class="section alt" id="boundaries"><div class="container"><div class="callout"><p class="eyebrow light">${escapeHtml(config.calloutEyebrow)}</p><h2>${escapeHtml(config.calloutTitle)}</h2><p>${escapeHtml(config.calloutDescription)}</p><a class="button secondary" href="/about/">${escapeHtml(config.calloutCta)}</a></div></div></section>`;
await write('index.html', layout({ title: config.brand, description: config.description, pathname: '/', body: homeBody }));

const articlesBody = `<section class="articles-page"><p class="eyebrow">${escapeHtml(config.knowledgeLabel)}</p><h1>${escapeHtml(config.articlesTitle)}</h1><p class="lead">${escapeHtml(config.articlesDescription)}</p><div class="article-list">${articles.map(card).join('')}</div></section>`;
await write('articles/index.html', layout({ title: `${config.articlesTitle} | ${config.brand}`, description: config.articlesDescription, pathname: '/articles/', body: articlesBody }));

const toolsBody = `<section class="tools-page"><p class="eyebrow">${escapeHtml(ui.tools)}</p><h1>${escapeHtml(ui.toolsTitle)}</h1><p class="lead">${escapeHtml(ui.toolsDescription)}</p><div class="tool-grid">${tools.map(toolCard).join('')}</div></section>`;
await write('tools/index.html', layout({ title: `${ui.toolsTitle} | ${config.brand}`, description: ui.toolsDescription, pathname: '/tools/', body: toolsBody }));

const topicsBody = `<section class="topics-page"><p class="eyebrow">${escapeHtml(ui.topics)}</p><h1>${escapeHtml(ui.topicsTitle)}</h1><p class="lead">${escapeHtml(ui.topicsDescription)}</p><div class="topic-grid">${topics.map(topicCard).join('')}</div></section>`;
await write('topics/index.html', layout({ title: `${ui.topicsTitle} | ${config.brand}`, description: ui.topicsDescription, pathname: '/topics/', body: topicsBody }));

const aboutBody = `<article class="simple-page prose"><p class="eyebrow">About</p><h1>${escapeHtml(config.aboutTitle)}</h1><p class="lead">${escapeHtml(config.aboutLead)}</p>${config.aboutHtml}</article>`;
await write('about/index.html', layout({ title: `${config.aboutLabel} | ${config.brand}`, description: config.aboutLead, pathname: '/about/', body: aboutBody }));

const latestDate = [...articles.map((item) => item.updatedAt || item.publishedAt), ...tools.map((item) => item.updatedAt || item.publishedAt), ...topics.map((item) => item.updatedAt || item.publishedAt)].filter(Boolean).sort().at(-1) || '2026-07-10';
const urlEntries = [
  { path: '/', lastmod: latestDate },
  { path: '/articles/', lastmod: latestDate },
  { path: '/topics/', lastmod: latestDate },
  { path: '/tools/', lastmod: latestDate },
  { path: '/about/', lastmod: latestDate },
  ...articles.map((article) => ({ path: `/articles/${article.slug}/`, lastmod: article.updatedAt || article.publishedAt })),
  ...topics.map((topic) => ({ path: `/topics/${topic.slug}/`, lastmod: topic.updatedAt || topic.publishedAt || latestDate })),
  ...tools.map((tool) => ({ path: `/tools/${tool.slug}/`, lastmod: tool.updatedAt || tool.publishedAt || latestDate })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries.map((entry) => `\n  <url><loc>${canonical(entry.path)}</loc><lastmod>${escapeXml(entry.lastmod)}</lastmod></url>`).join('')}\n</urlset>\n`;
await write('sitemap.xml', sitemap);
await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${canonical('/sitemap.xml')}\n`);

const rssItems = articles.slice(0, 20).map((article) => `\n    <item>\n      <title>${escapeXml(article.title)}</title>\n      <link>${canonical(`/articles/${article.slug}/`)}</link>\n      <guid>${canonical(`/articles/${article.slug}/`)}</guid>\n      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>\n      <description>${escapeXml(article.description)}</description>\n    </item>`).join('');
const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(config.brand)}</title>\n    <link>${canonical('/')}</link>\n    <description>${escapeXml(config.description)}</description>\n    <language>${escapeXml(config.lang)}</language>\n    <lastBuildDate>${new Date(`${latestDate}T00:00:00Z`).toUTCString()}</lastBuildDate>${rssItems}\n  </channel>\n</rss>\n`;
await write('feed.xml', rss);

console.log(`Built ${config.brand}: ${articles.length} articles, ${topics.length} topics, ${tools.length} tools, ${urlEntries.length} indexed pages.`);
