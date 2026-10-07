'use strict';
// Supplemental checks only: this does not render HTML or replace browser QA.
const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
async function main() {
  const root = path.resolve(__dirname, '..');
  const files = ['index.html', 'ru.html', 'en.html', 'styles.css', 'app.js', 'config.js', 'favicon.svg'];
  const contents = {};
  const checks = [];
  for (const file of files) {
    const bytes = await fs.readFile(path.join(root, 'site', file));
    contents[file] = bytes.toString('utf8');
    const response = await fetch('http://127.0.0.1:8765/' + file);
    assert.equal(response.status, 200, file);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes, file);
    checks.push({ file, http_status: response.status, served_bytes_match: true, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
  }
  const pages = [];
  for (const [file, lang] of [['index.html', 'uz'], ['ru.html', 'ru'], ['en.html', 'en']]) {
    const html = contents[file];
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal([...html.matchAll(/<section\b/g)].length, 7);
    assert.ok(html.includes('<html lang="' + lang + '">'));
    assert.ok(html.includes('name="viewport"'));
    for (const target of ['index.html', 'ru.html', 'en.html']) assert.ok(html.includes('class="language" href="' + target + '"'));
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (match[1].startsWith('#')) assert.ok(ids.includes(match[1].slice(1)), match[1]);
      else { assert.ok(files.includes(match[1]), match[1]); }
    }
    for (const contact of ['telegram', 'phone', 'map']) assert.ok(html.includes('href="#contact" data-contact="' + contact + '"'));
    pages.push({ file, lang, sections: 7, unique_ids: true, local_links_and_assets: 'PASS', language_link: 'PASS', demo_contact_markup: 'PASS' });
  }
  for (const file of ['app.js', 'config.js']) new vm.Script(contents[file], { filename: file });
  const sandbox = { window: {} };
  vm.runInNewContext(contents['config.js'], sandbox);
  assert.equal(sandbox.window.EDUSTART.demo, true);
  for (const contact of ['telegram', 'phone', 'map']) assert.equal(sandbox.window.EDUSTART[contact], '');
  const result = {
    date: '2026-10-04', executed_at_utc: new Date().toISOString(), version: '1.0.0',
    kind: 'STATIC_AND_HTTP_ONLY', assets: checks, pages,
    javascript_syntax: 'PASS', shipped_config: 'PASS: demo=true; contacts blank',
    browser_checks: 'SEPARATE REAL-BROWSER REPORT: docs/QA-v1.0.0.json',
    requested_widths: [375, 768, 1440], original_notion_widths: [360, 390, 768, 1440],
    site_changes: 'EN + three-language links + menu/dialog focus fixes', outbound_contacts: 'NONE',
    release_status: 'Technical checks only; independent review and seller approval remain separate'
  };
  await fs.writeFile(path.join(root, 'docs/QA-STATIC-v1.0.0.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
