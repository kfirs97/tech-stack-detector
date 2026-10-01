import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compile, detect, extractSignals, parsePattern, resolveVersion } from '../src/detect.js';
import { normalizeUrl } from '../src/fetch.js';

const data = f => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), 'utf8'));
const db = compile(data('technologies.json'), data('categories.json'));
const names = r => r.map(t => t.name);

test('pattern syntax: confidence and version templates', () => {
  const p = parsePattern('jquery[.-]([\\d.]+)\\.js\\;version:\\1\\;confidence:80');
  assert.equal(p.confidence, 80);
  assert.equal(resolveVersion(p.version, p.regex.exec('/js/jquery-3.6.0.js')), '3.6.0');
  assert.equal(resolveVersion('\\1?next:', ['x', 'y']), 'next');
  assert.equal(resolveVersion('\\1?next:old', ['x', undefined]), 'old');
});

test('detects a WordPress site with plugins, analytics and a CDN', () => {
  const html = `<!doctype html><html><head>
    <meta name="generator" content="WordPress 6.6.2">
    <link rel="stylesheet" href="https://example.com/wp-content/themes/twentytwentyfour/style.css">
    <script src="https://example.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123"></script>
    </head><body><div class="wp-block-group"><div class="wp-block-cover">Hi</div></div></body></html>`;
  const r = detect(extractSignals({ url: 'https://example.com/', headers: { server: 'cloudflare', 'cf-ray': '8abc-TLV' }, cookies: {}, html }), db);
  const n = names(r);
  for (const expected of ['WordPress', 'PHP', 'MySQL', 'jQuery', 'Cloudflare', 'Google Analytics']) assert.ok(n.includes(expected), `${expected} in ${n}`);
  assert.equal(r.find(t => t.name === 'WordPress').version, '6.6.2');
  assert.ok(r.find(t => t.name === 'WordPress').categories.includes('CMS'));
});

test('detects Next.js/React and Shopify from their typical markup', () => {
  const next = detect(extractSignals({ url: 'https://app.example.com/', headers: { 'x-powered-by': 'Next.js', server: 'Vercel' }, cookies: {}, html: '<html><body><div id="__next"></div><script id="__NEXT_DATA__" type="application/json">{}</script><script src="/_next/static/chunks/main-abc.js"></script></body></html>' }), db);
  assert.ok(names(next).includes('Next.js'), names(next));
  assert.ok(names(next).includes('React'), 'Next.js implies React');
  assert.ok(names(next).includes('Vercel'), names(next));
  const shop = detect(extractSignals({ url: 'https://shop.example.com/', headers: {}, cookies: { _shopify_y: 'x' }, html: '<html><head><script src="https://cdn.shopify.com/s/files/1/0/theme.js"></script></head><body></body></html>' }), db);
  assert.ok(names(shop).includes('Shopify'), names(shop));
});

test('plain pages produce no false positives', () => {
  const r = detect(extractSignals({ url: 'https://plain.example/', headers: {}, cookies: {}, html: '<html><head><title>Plain</title></head><body><p>Hello world, nothing here.</p></body></html>' }), db);
  assert.deepEqual(names(r), []);
});

test('url normalization rejects private hosts', () => {
  assert.equal(normalizeUrl('example.com'), 'https://example.com/');
  assert.equal(normalizeUrl('http://localhost:8080'), null);
  assert.equal(normalizeUrl('http://192.168.1.1'), null);
  assert.equal(normalizeUrl(''), null);
});

import { withDeadline } from '../src/fetch.js';

test('hard deadline rejects a promise that never settles', async () => {
  const started = Date.now();
  await assert.rejects(withDeadline(new Promise(() => {}), 100), { name: 'TimeoutError' });
  assert.ok(Date.now() - started < 1000);
  assert.equal(await withDeadline(Promise.resolve(7), 100), 7);
});
