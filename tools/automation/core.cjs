'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const normalId = value => String(value).replaceAll('-', '').toLowerCase();
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function eligible(task, config) {
  return /^[a-f0-9]{32}$/.test(normalId(task.id)) &&
    normalId(task.product_id) === normalId(config.product_id) &&
    normalId(task.source_id) === normalId(config.task_source_id) && task.status === 'Rejada' &&
    task.marker?.automation === 'edustart-v1' && task.marker.project === 'EduStart' &&
    task.marker.ready === true && /^[a-zA-Z0-9._-]{1,64}$/.test(task.marker.version) &&
    config.allowed_kinds.includes(task.marker.kind) && ['static-audit', 'site-fix-qa'].includes(task.marker.kind);
}
const taskKey = task => hash(normalId(task.id) + ':' + task.marker.version);
function claim(directory, task) {
  fs.mkdirSync(directory, { recursive: true });
  const file = path.join(directory, taskKey(task) + '.json');
  const record = { task, phase: 'claimed', attempts: 0, started_at: new Date().toISOString() };
  try { fs.writeFileSync(file, JSON.stringify(record, null, 2), { flag: 'wx' }); }
  catch (error) { if (error.code === 'EEXIST') return null; throw error; }
  return { file, record };
}
function persist(job) {
  // Atomic replacement; interrupted claims remain consumed and require human reconciliation.
  const temporary = job.file + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(job.record, null, 2) + '\n');
  fs.renameSync(temporary, job.file);
}
function beginAttempt(job, maximum) {
  if (!Number.isInteger(maximum) || maximum < 1 || maximum > 3) throw new Error('Attempt limit must be 1..3');
  if (job.record.attempts >= maximum) throw new Error('Attempt budget exhausted; stop and record blocker');
  job.record.attempts += 1;
  persist(job); // Persist before any attempt, so a crash cannot reset the budget.
  return job.record.attempts;
}
function lock(file) {
  const descriptor = fs.openSync(file, 'wx');
  fs.writeFileSync(descriptor, JSON.stringify({ pid: process.pid, started_at: new Date().toISOString() }));
  return ({ keep = false } = {}) => { fs.closeSync(descriptor); if (!keep) fs.unlinkSync(file); };
}
function inventory(root) {
  const files = ['index.html', 'ru.html', 'styles.css', 'app.js', 'config.js', 'favicon.svg'];
  return files.map(file => ({ file: 'site/' + file, sha256: hash(fs.readFileSync(path.join(root, 'site', file))) }));
}
function audit(root, task) {
  const assertions = [];
  const check = (name, pass) => assertions.push({ name, passed: Boolean(pass) });
  const files = inventory(root);
  for (const [file, lang, opposite] of [['index.html', 'uz', 'ru.html'], ['ru.html', 'ru', 'index.html']]) {
    const html = fs.readFileSync(path.join(root, 'site', file), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    check(file + ': 7 sections', [...html.matchAll(/<section\b/g)].length === 7);
    check(file + ': unique IDs', new Set(ids).size === ids.length);
    check(file + ': language', html.includes('<html lang="' + lang + '">'));
    check(file + ': viewport', html.includes('name="viewport"'));
    check(file + ': opposite language link', html.includes('class="language" href="' + opposite + '"'));
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const link = match[1];
      check(file + ': local link ' + link, link.startsWith('#') ? ids.includes(link.slice(1)) : files.some(entry => entry.file === 'site/' + link));
    }
  }
  for (const file of ['app.js', 'config.js']) {
    try { new vm.Script(fs.readFileSync(path.join(root, 'site', file), 'utf8')); check(file + ': syntax', true); }
    catch { check(file + ': syntax', false); }
  }
  const configCode = fs.readFileSync(path.join(root, 'site/config.js'), 'utf8');
  // Do not execute task-supplied code or the website JS: check shipped demo setting text only.
  check('shipped demo mode', /\bdemo\s*:\s*true\b/.test(configCode));
  return {
    project: 'EduStart', task_id: normalId(task.id), task_version: task.marker.version,
    runner_version: '1.1.0', website_version: '0.1.0', created_at: new Date().toISOString(),
    kind: 'static-audit', status: assertions.every(item => item.passed) ? 'passed' : 'blocked',
    evidence: assertions, file_versions: files,
    browser_checks: 'NOT RUN; this harmless task only verifies static source',
    site_changes: 'NONE', outbound_contacts: 'NONE', publishing: 'NONE'
  };
}
module.exports = { normalId, hash, eligible, taskKey, claim, persist, beginAttempt, lock, inventory, audit };
