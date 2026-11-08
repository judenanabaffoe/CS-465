// Module Two checks: routes -> controllers -> HBS views render correctly.
// Run with: npm test   (uses Node's built-in test runner, no extra dependencies)
const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../app');
const trips = require('../data/trips.json');

let server;
let base;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

test('GET / renders the home template inside the layout', async () => {
  const res = await fetch(base + '/');
  const html = await res.text();
  assert.strictEqual(res.status, 200);
  assert.match(html, /<title>Travlr Getaways<\/title>/);
  assert.match(html, /Enjoy the Summer with Us!/);
  assert.match(html, /<li class="selected">\s*<a href="\/">Home<\/a>/);
});

test('GET /travel renders one list item per trip from trips.json', async () => {
  const res = await fetch(base + '/travel');
  const html = await res.text();
  assert.strictEqual(res.status, 200);
  assert.match(html, /<title>Travlr Getaways - Travel<\/title>/);
  assert.strictEqual((html.match(/<h2>/g) || []).length, trips.length);
  // every trip name is escaped by HBS ("Dawson's Reef" -> &#x27;)
  assert.match(html, /Gale Reef/);
  assert.match(html, /Dawson(&#x27;|')s Reef/);
  assert.match(html, /Claire(&#x27;|')s Reef/);
  assert.match(html, /\$799\.00 per person/);
  assert.match(html, /<img src="\/images\/reef1\.jpg"/);
});

test('travel page marks Travel as the selected nav item', async () => {
  const html = await (await fetch(base + '/travel')).text();
  assert.match(html, /<li class="selected">\s*<a href="\/travel">Travel<\/a>/);
  assert.doesNotMatch(html, /<li class="selected">\s*<a href="\/">Home<\/a>/);
});

test('partials render: header navigation and footer', async () => {
  const html = await (await fetch(base + '/travel')).text();
  assert.match(html, /<div id="header">/);
  assert.match(html, /<div id="footer">/);
  assert.match(html, /All Rights Reserved/);
});

test('every link and asset on /travel resolves (no 404s)', async () => {
  const html = await (await fetch(base + '/travel')).text();
  const targets = new Set();
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) targets.add(m[1]);
  assert.ok(targets.size > 10, 'expected links to be found');
  for (const t of targets) {
    const r = await fetch(base + t);
    assert.strictEqual(r.status, 200, `${t} returned ${r.status}`);
  }
});

test('unknown route returns 404 through the error template', async () => {
  const res = await fetch(base + '/does-not-exist');
  assert.strictEqual(res.status, 404);
  assert.match(await res.text(), /Not Found/);
});
