'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const core = require('./core.cjs');
const config = require('./config.json');
const root = path.resolve(__dirname, '../..');
const testRoot = path.join(root, '.automation/tests');
fs.mkdirSync(testRoot, { recursive: true });
const directory = fs.mkdtempSync(path.join(testRoot, 'guards-'));
const task = { id: config.smoke_task_id, product_id: config.product_id, source_id: config.task_source_id, status: 'Rejada', marker: { automation: 'edustart-v1', project: 'EduStart', ready: true, version: 'guard-test-1', kind: 'static-audit' } };
test('only explicitly ready EduStart static audits are eligible', () => {
  assert.equal(core.eligible(task, config), true);
  for (const change of [{ product_id: '0'.repeat(32) }, { source_id: '0'.repeat(32) }, { status: 'Toʻsiq bor' }, { marker: { ...task.marker, ready: false } }, { marker: { ...task.marker, kind: 'publish' } }, { marker: { ...task.marker, version: '../escape' } }]) {
    assert.equal(core.eligible({ ...task, ...change }, config), false);
  }
});
test('one lock excludes another Windows process; clean release permits next run', () => {
  const file = path.join(directory, 'lock');
  const release = core.lock(file);
  const child = spawnSync(process.execPath, ['-e', "require(process.argv[1]).lock(process.argv[2])", path.join(__dirname, 'core.cjs'), file], { encoding: 'utf8', windowsHide: true });
  assert.notEqual(child.status, 0);
  assert.match(child.stderr, /EEXIST/);
  release();
  core.lock(file)();
});
test('same version stays consumed across processes and interrupted jobs', () => {
  const job = core.claim(directory, task);
  assert.ok(job);
  const child = spawnSync(process.execPath, ['-e', "const c=require(process.argv[1]);process.exit(c.claim(process.argv[2],JSON.parse(process.argv[3]))===null?0:1)", path.join(__dirname, 'core.cjs'), directory, JSON.stringify(task)], { windowsHide: true });
  assert.equal(child.status, 0);
  job.record.phase = 'blocked'; core.persist(job);
  assert.equal(core.claim(directory, task), null);
  assert.ok(core.claim(directory, { ...task, marker: { ...task.marker, version: 'guard-test-2' } }));
});
test('attempt budget is durable and a fourth attempt fails', () => {
  const job = core.claim(directory, { ...task, marker: { ...task.marker, version: 'budget' } });
  assert.equal(core.beginAttempt(job, 3), 1);
  assert.equal(core.beginAttempt(job, 3), 2);
  assert.equal(core.beginAttempt(job, 3), 3);
  assert.throws(() => core.beginAttempt(job, 3), /exhausted/);
  assert.equal(JSON.parse(fs.readFileSync(job.file, 'utf8')).attempts, 3);
  assert.throws(() => core.beginAttempt(job, 4), /limit/);
});
test('actual audit leaves source hashes unchanged and does not claim browser QA', () => {
  const before = core.inventory(root);
  const report = core.audit(root, task);
  assert.equal(report.status, 'passed');
  assert.equal(report.site_changes, 'NONE');
  assert.match(report.browser_checks, /NOT RUN/);
  assert.deepEqual(core.inventory(root), before);
});
