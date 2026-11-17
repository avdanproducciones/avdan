import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const routes = ['/', '/servicios/', '/sobre/', '/contacto/'];
const titles = new Set();
const descriptions = new Set();
const preview = process.env.VERCEL_ENV === 'preview';
let assets = 0;
for (const route of routes) {
  const html = readFileSync(`dist${route}index.html`, 'utf8');
  assert.match(html, /<html lang="es-CL"/);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && !titles.has(title), `Título único: ${route}`);
  assert.ok(description && !descriptions.has(description), `Descripción única: ${route}`);
  titles.add(title); descriptions.add(description);
  assert.ok(html.includes(`rel="canonical" href="https://avdan-bay.vercel.app${route}"`));
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `Un H1: ${route}`);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="twitter:card"/);
  assert.ok(html.includes('application/ld+json'));
  assert.equal(html.includes('content="noindex, nofollow"'), preview);
  for (const [, src] of html.matchAll(/(?:src|href)="(\/[^"?#]*)/g)) {
    if (src === '/' || routes.includes(src)) continue;
    assert.ok(existsSync(`dist${src}`), `Recurso local existente: ${src}`);
    assets++;
  }
}
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const home = readFileSync('dist/index.html', 'utf8');
const initialPlayers = [...home.matchAll(/<iframe\b[^>]*\sdata-autoplay-src="([^"]+)"[^>]*>/g)];
assert.equal(initialPlayers.length, 1, 'Only the hero player loads on entry');
const heroUrl = new URL(initialPlayers[0][1].replaceAll('&amp;', '&'));
assert.equal(heroUrl.pathname, '/embed/hcbyyc0O8Ng');
assert.equal(heroUrl.searchParams.get('autoplay'), '1');
assert.equal(heroUrl.searchParams.get('mute'), '1');
assert.doesNotMatch(home, /<iframe\b[^>]*\ssrc=/, 'Players wait for the local cover to paint or for interaction');
assert.doesNotMatch(home, /<script[^>]+src="https:\/\/www\.youtube\.com\/iframe_api/, 'No initial YouTube API');
assert.doesNotMatch(home, /<link[^>]+rel="stylesheet"/, 'No render-blocking stylesheet');
assert.doesNotMatch(home, /class="loading-screen"/, 'Content is immediately accessible');
assert.match(home, /fetchpriority="high"/);
assert.match(home, /\/media\/optimized\/seleccion-01-360.avif 360w/);
assert.match(home, /\/media\/optimized\/seleccion-01-400.avif 400w/);
assert.match(home, /\/media\/optimized\/eventos-08-card-400.avif 400w/);
assert.match(home, /montserrat-variable\.woff2/);
assert.match(home, /http-equiv="content-security-policy"/);
assert.match(home, /strict-dynamic/);
assert.equal((sitemap.match(/<loc>/g) ?? []).length, preview ? 0 : routes.length);
const robots = readFileSync('dist/robots.txt', 'utf8');
assert.ok(robots.includes(preview ? 'Disallow: /' : 'Sitemap: https://avdan-bay.vercel.app/sitemap.xml'));
assert.match(readFileSync('dist/404.html', 'utf8'), /content="noindex, nofollow"/);
const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
assert.ok(config.headers[0].headers.some(({ key, value }) => key === 'Content-Security-Policy' && value.includes("frame-ancestors 'none'")));
console.log(`OK: ${routes.length} rutas, metadatos, H1, ${assets} referencias locales, sitemap, robots, 404 y configuración CSP (${preview ? 'preview' : 'producción'}).`);
