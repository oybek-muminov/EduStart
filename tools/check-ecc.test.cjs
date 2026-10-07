'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { checkEcc } = require('./check-ecc.cjs');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'edustart-ecc-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const source = path.resolve(__dirname, '..');
  fs.cpSync(path.join(source, '.agents'), path.join(root, '.agents'), { recursive: true });
  fs.cpSync(path.join(source, 'third_party/ecc'), path.join(root, 'third_party/ecc'), { recursive: true });
  return root;
}

function loadLock(root) {
  return JSON.parse(fs.readFileSync(path.join(root, '.agents/ecc.lock.json'), 'utf8'));
}

function saveLock(root, lock) {
  fs.writeFileSync(path.join(root, '.agents/ecc.lock.json'), JSON.stringify(lock));
}

test('a pinned checkout contains four discoverable skill files and their sources', t => {
  const result = checkEcc(fixture(t));
  assert.deepEqual(result.skills.sort(), [
    'ecc-coding-standards', 'ecc-security-review', 'ecc-tdd-workflow', 'ecc-verification-loop'
  ]);
  assert.equal(result.files, 13);
});

test('modified instructions fail integrity verification', t => {
  const root = fixture(t);
  fs.appendFileSync(path.join(root, '.agents/skills/ecc-security-review/SKILL.md'), '\nchanged instructions\n');
  assert.throws(() => checkEcc(root), /hash mismatch/);
});

test('missing upstream references fail instead of reporting an installed skill', t => {
  const root = fixture(t);
  fs.unlinkSync(path.join(root, '.agents/skills/ecc-tdd-workflow/references/upstream.md'));
  assert.throws(() => checkEcc(root), /ENOENT/);
});

test('a lock entry cannot read a file outside the repository', t => {
  const root = fixture(t);
  const lock = loadLock(root);
  lock.license.path = '../outside-repo.txt';
  saveLock(root, lock);
  assert.throws(() => checkEcc(root), /inside the repository/);
});

test('a symlink cannot redirect a verified file outside the repository', t => {
  const root = fixture(t);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'edustart-ecc-outside-'));
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  const license = path.join(root, 'third_party/ecc/LICENSE');
  const target = path.join(outside, 'LICENSE');
  fs.copyFileSync(license, target);
  fs.unlinkSync(license);
  fs.symlinkSync(target, license);
  assert.throws(() => checkEcc(root), /symlink target/);
});

test('hash-valid instructions with mismatched frontmatter fail skill registration checks', t => {
  const root = fixture(t);
  const lock = loadLock(root);
  const skill = lock.skills[0];
  const record = skill.files.find(file => file.path.endsWith('/SKILL.md'));
  const file = path.join(root, record.path);
  const content = fs.readFileSync(file, 'utf8').replace('name: ' + skill.name, 'name: another-skill');
  fs.writeFileSync(file, content);
  record.sha256 = crypto.createHash('sha256').update(content).digest('hex');
  saveLock(root, lock);
  assert.throws(() => checkEcc(root), /skill name must match folder/);
});
