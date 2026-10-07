'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const core = require('./core.cjs');
const root = path.resolve(__dirname, '../..');
const state = path.join(root, '.automation');
const config = require('./config.json');
const probe = JSON.parse(fs.readFileSync(path.join(state, 'probe-result.json'), 'utf8'));
assert.equal(probe.notion_read_verified, true);
const proof = JSON.parse(fs.readFileSync(path.join(state, 'smoke-cycle.json'), 'utf8'));
assert.equal(proof.passed,true);
assert.equal(proof.published.readback_verified,true);
const recordPath = path.join(state,'ledger',proof.key+'.json');
const stored = JSON.parse(fs.readFileSync(recordPath,'utf8'));
const task = stored.task;
assert.ok(task);
assert.ok(core.eligible(task, config));
const key = core.taskKey(task);
const ledger = path.join(state, 'ledger', key + '.json');
assert.ok(fs.existsSync(ledger));
assert.equal(core.claim(path.join(state, 'ledger'), task), null);
const record = JSON.parse(fs.readFileSync(ledger, 'utf8'));
const reportText = fs.readFileSync(path.join(root, record.artifact.path), 'utf8');
assert.equal(core.hash(reportText), record.artifact.sha256);
const report = JSON.parse(reportText);
assert.deepEqual(core.inventory(root), report.file_versions);
assert.equal(report.status, 'passed');
assert.equal(config.schedule_enabled, false);
const result = {
  checked_at: new Date().toISOString(), notion_read_only_exec: 'PASS',
  ready_task_filter: 'PASS', static_audit: 'PASS', same_smoke_version_reclaim: 'REFUSED',
  site_unchanged_since_audit: true, artifact_hash_verified: true,
  smoke_key: key, version:task.marker.version, attempts: record.attempts, status: record.phase,
  automatic_notion_delivery: record.publish.status, blocker: record.blocker || null,
  independent_readback:JSON.parse(fs.readFileSync(path.join(state,'smoke2-independent-readback.json'),'utf8')),
  file_upload_id: record.publish.file_upload_id, reviewer_access_verified: false,
  scheduled_task_registered: false, schedule_enabled: false
};
fs.writeFileSync(path.join(state, 'verification.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
