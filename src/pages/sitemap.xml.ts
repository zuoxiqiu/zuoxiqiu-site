import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const site = new URL('https://zuoxiqiu.com');

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const [thinking, ideas, mvps] = await Promise.all([
    getCollection('thinking'),
    getCollection('ideas'),
    getCollection('mvp'),
  ]);

  const staticPages = ['/', '/thinking/', '/ideas/', '/mvp/', '/about/'];
  const contentPages = [
    ...thinking.map((entry) => ({ path: `/thinking/${entry.id}/`, date: entry.data.date })),
    ...ideas.map((entry) => ({ path: `/ideas/${entry.id}/`, date: entry.data.date })),
    ...mvps.map((entry) => ({ path: `/mvp/${entry.id}/`, date: entry.data.date })),
  ];

  const urls = [
    ...staticPages.map((path) => `<url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`),
    ...contentPages.map(
      ({ path, date }) =>
        `<url><loc>${escapeXml(new URL(path, site).href)}</loc><lastmod>${date
          .toISOString()
          .slice(0, 10)}</lastmod></url>`
    ),
  ].join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
