// Module Three checks: every page is rendered from JSON through routes -> controllers -> HBS views.
// Run with: npm test   (Node's built-in test runner, no extra dependencies)
const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../app');
const data = require('../app_server/models/data');

let server;
let base;

const get = async (p) => {
  const res = await fetch(base + p);
  return { status: res.status, html: await res.text() };
};
const count = (html, re) => (html.match(re) || []).length;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

test('GET / renders home from home.json and news.json', async () => {
  const home = await data.read('home');
  const news = await data.read('news');
  const { status, html } = await get('/');
  assert.strictEqual(status, 200);
  assert.match(html, /<title>Travlr Getaways<\/title>/);
  assert.ok(html.includes(home.adbox.heading));
  assert.strictEqual(count(html, /<h4>/g), news.blog.length);
  assert.strictEqual(count(html, /<div class="section">/g), home.tiles.length);
});

test('GET /travel renders one trip card per trips.json record', async () => {
  const trips = await data.read('trips');
  const { status, html } = await get('/travel');
  assert.strictEqual(status, 200);
  assert.match(html, /<title>Travlr Getaways - Travel<\/title>/);
  assert.strictEqual(count(html, /<li>\s*<a href="\/travel"><img/g), trips.length);
  assert.match(html, /Gale Reef/);
  assert.match(html, /Dawson(&#x27;|')s Reef/);
  assert.match(html, /Starts March 14, 2021/);
});

test('trip prices are formatted with thousands separators', async () => {
  const { html } = await get('/travel');
  assert.match(html, /\$799\.00 per person/);
  assert.match(html, /\$1,199\.00 per person/);
  assert.match(html, /\$1,799\.00 per person/);
});

test('GET /rooms renders every room with its rate', async () => {
  const rooms = await data.read('rooms');
  const { status, html } = await get('/rooms');
  assert.strictEqual(status, 200);
  assert.strictEqual(count(html, /<span class="rate">/g), rooms.length);
  for (const r of rooms) {
    assert.ok(html.includes(r.name), r.name);
    assert.ok(html.includes(`Rate: ${r.rate} / Day`), r.name);
  }
});

test('GET /meals renders every meal category', async () => {
  const meals = await data.read('meals');
  const { status, html } = await get('/meals');
  assert.strictEqual(status, 200);
  assert.strictEqual(count(html, /<div class="infos">/g), meals.length);
  for (const m of meals) assert.ok(html.includes(m.featured), m.featured);
});

test('GET /news renders the featured article and sidebar lists', async () => {
  const news = await data.read('news');
  const { status, html } = await get('/news');
  assert.strictEqual(status, 200);
  assert.ok(html.includes(news.featured.title));
  assert.strictEqual(count(html, /<li>\s*<a href="\/news">/g), news.latest.length + news.tips.length);
  for (const para of news.featured.paragraphs) assert.ok(html.includes(para.slice(0, 40)));
});

test('GET /about renders from about.json', async () => {
  const about = await data.read('about');
  const { status, html } = await get('/about');
  assert.strictEqual(status, 200);
  assert.ok(html.includes(about.heading));
  for (const c of about.columns) assert.ok(html.includes(c.heading), c.heading);
});

test('GET /contact renders the form and contact details from site.json', async () => {
  const { contact } = await data.read('site');
  const { status, html } = await get('/contact');
  assert.strictEqual(status, 200);
  assert.match(html, /<form action="\/contact" method="post">/);
  assert.ok(html.includes(contact.telephone));
  assert.ok(html.includes(contact.address));
});

test('POST /contact confirms a valid message and rejects an empty one', async () => {
  const body = (o) => ({
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(o).toString()
  });
  const ok = await fetch(base + '/contact', body({ name: 'Jude', email: 'j@example.com', subject: 's', message: 'hi' }));
  assert.strictEqual(ok.status, 200);
  assert.match(await ok.text(), /Thank you, Jude/);

  const bad = await fetch(base + '/contact', body({ name: '', email: '', message: '' }));
  assert.strictEqual(bad.status, 400);
  assert.match(await bad.text(), /Please enter your name/);
});

test('contact form output is HTML-escaped', async () => {
  const res = await fetch(base + '/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ name: '<script>x</script>', email: 'a@b.c', message: 'm' }).toString()
  });
  const html = await res.text();
  assert.ok(!html.includes('<script>x</script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});

test('header and footer partials share one menu, highlighting the current page', async () => {
  const site = await data.read('site');
  for (const item of site.nav) {
    const { html } = await get(item.href);
    assert.strictEqual(count(html, /<li class="selected">/g), 1, `${item.href} header`);
    assert.strictEqual(count(html, /<li class="active">/g), 1, `${item.href} footer`);
    assert.match(html, new RegExp(`<li class="selected">\\s*<a href="${item.href}">${item.label}</a>`), item.href);
    assert.strictEqual(count(html, /<div id="header">/g), 1);
    assert.strictEqual(count(html, /<div id="footer">/g), 1);
  }
});

test('every internal link and asset on every page resolves (no 404s)', async () => {
  const site = await data.read('site');
  const seen = new Set();
  for (const item of site.nav) {
    const { html } = await get(item.href);
    for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) seen.add(m[1]);
  }
  assert.ok(seen.size > 20, 'expected links to be found');
  for (const t of seen) {
    const r = await fetch(base + t);
    assert.strictEqual(r.status, 200, `${t} returned ${r.status}`);
    await r.arrayBuffer();
  }
});

test('unknown route returns 404 through the error template', async () => {
  const { status, html } = await get('/does-not-exist');
  assert.strictEqual(status, 404);
  assert.match(html, /Not Found/);
  assert.match(html, /<div id="header">/);
});

test('model rejects when a data file is missing', async () => {
  await assert.rejects(() => data.read('does-not-exist'), { code: 'ENOENT' });
});
