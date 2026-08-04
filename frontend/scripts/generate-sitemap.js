/* global process */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteUrl = (process.env.SITE_URL || 'https://iternityverse.com').replace(/\/+$/g, '');
const apiBaseUrl = (
  process.env.SITEMAP_API_BASE_URL || 'https://api.iternityverse.com/api/v1'
).replace(/\/+$/g, '');
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.resolve(currentDirectory, '../public');
const today = new Date().toISOString().slice(0, 10);

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const normalizePath = (value) => {
  if (!value || value === '/') {
    return '/';
  }

  return `/${String(value).replace(/^\/+|\/+$/g, '')}`;
};

const toUrlEntry = ({ route, lastmod = today, changefreq = 'weekly', priority = '0.7' }) => ({
  loc: `${siteUrl}${normalizePath(route)}`,
  lastmod,
  changefreq,
  priority,
});

const fetchAll = async (resource, { sort = 'createdAt', order = 'desc' } = {}) => {
  const items = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const url = new URL(`${apiBaseUrl}/${resource}`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', '100');
    url.searchParams.set('sort', sort);
    url.searchParams.set('order', order);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource}: ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    items.push(...(payload.data || []));
    hasNextPage = Boolean(payload.meta?.hasNextPage);
    page += 1;
  }

  return items;
};

const staticRoutes = [
  { route: '/', changefreq: 'daily', priority: '1.0' },
  { route: '/gpus', changefreq: 'daily', priority: '0.95' },
  { route: '/blog', changefreq: 'weekly', priority: '0.85' },
  { route: '/about', changefreq: 'monthly', priority: '0.75' },
  { route: '/contact', changefreq: 'monthly', priority: '0.75' },
  { route: '/faq', changefreq: 'monthly', priority: '0.65' },
  { route: '/privacy', changefreq: 'yearly', priority: '0.45' },
  { route: '/terms', changefreq: 'yearly', priority: '0.45' },
  { route: '/security', changefreq: 'yearly', priority: '0.5' },
  { route: '/acceptable-use', changefreq: 'yearly', priority: '0.45' },
];

const buildSitemap = (entries) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const buildRobots = () => `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /thank-you
Disallow: /403
Disallow: /500

Sitemap: ${siteUrl}/sitemap.xml
`;

const main = async () => {
  const [gpuPackages, blogPosts] = await Promise.all([
    fetchAll('gpu-packages', { sort: 'createdAt', order: 'desc' }),
    fetchAll('blog-posts', { sort: 'publishedAt', order: 'desc' }),
  ]);

  const gpuRoutes = gpuPackages
    .filter((gpuPackage) => gpuPackage.id || gpuPackage._id)
    .flatMap((gpuPackage) => {
      const id = gpuPackage.id || gpuPackage._id;
      const lastmod = (gpuPackage.updatedAt || gpuPackage.createdAt || today).slice(0, 10);

      return [
        toUrlEntry({
          route: `/gpus/${id}`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.9',
        }),
        toUrlEntry({
          route: `/enquiry/${id}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.55',
        }),
      ];
    });

  const blogRoutes = blogPosts
    .filter((post) => post.slug)
    .map((post) =>
      toUrlEntry({
        route: `/blog/${post.slug}`,
        lastmod: (post.updatedAt || post.publishedAt || post.createdAt || today).slice(0, 10),
        changefreq: 'monthly',
        priority: '0.8',
      })
    );

  const entries = [...staticRoutes.map(toUrlEntry), ...gpuRoutes, ...blogRoutes];

  await fs.mkdir(publicDirectory, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(publicDirectory, 'sitemap.xml'), buildSitemap(entries)),
    fs.writeFile(path.join(publicDirectory, 'robots.txt'), buildRobots()),
  ]);

  console.info(
    `Generated sitemap.xml with ${entries.length} URLs (${gpuRoutes.length / 2} GPU packages, ${
      blogRoutes.length
    } blog posts).`
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
