import type { APIRoute } from 'astro';
import { site, isPreview } from '../data/site';

export const GET: APIRoute = () => new Response(
  isPreview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
