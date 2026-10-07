'use strict';
// Offline file-integrity check; this does not inspect Codex's active skill inventory.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function readInside(root, relativePath) {
  assert.equal(typeof relativePath, 'string', 'file path must be a string');
  assert.ok(relativePath.length > 0 && !path.isAbsolute(relativePath), 'file path must be relative');
  const resolved = path.resolve(root, relativePath);
  assert.ok(resolved.startsWith(root + path.sep), 'file path must stay inside the repository');
  const real = fs.realpathSync(resolved);
  assert.ok(real.startsWith(root + path.sep), 'symlink target must stay inside the repository');
  return fs.readFileSync(real);
}

function verifyFile(root, record) {
  assert.ok(/^[a-f0-9]{64}$/.test(record.sha256), 'file must have a SHA256 digest');
  const bytes = readInside(root, record.path);
  const actual = crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(actual, record.sha256, 'hash mismatch: ' + record.path);
  return bytes;
}

function checkEcc(repoRoot) {
  const root = fs.realpathSync(repoRoot);
  const lock = JSON.parse(readInside(root, '.agents/ecc.lock.json').toString('utf8'));
  assert.equal(lock.schemaVersion, 1, 'unsupported ECC lock schema');
  assert.equal(lock.integration, 'repo-skills', 'expected repository skill integration');
  assert.equal(lock.upstream.repository, 'https://github.com/affaan-m/ECC');
  assert.ok(/^[a-f0-9]{40}$/.test(lock.upstream.commit), 'upstream commit must be pinned');
  assert.ok(Array.isArray(lock.skills) && lock.skills.length > 0, 'skills list must not be empty');
  verifyFile(root, lock.license);

  const names = new Set();
  let fileCount = 1;
  for (const skill of lock.skills) {
    assert.ok(/^ecc-[a-z0-9-]+$/.test(skill.name), 'invalid ECC skill name');
    assert.ok(!names.has(skill.name), 'duplicate ECC skill name');
    names.add(skill.name);
    assert.equal(skill.path, '.agents/skills/' + skill.name, 'unexpected skill location');
    assert.ok(Array.isArray(skill.files), 'skill files must be an array');
    const records = new Map();
    for (const record of skill.files) {
      assert.ok(record.path.startsWith(skill.path + '/'), 'skill file must belong to its folder');
      assert.ok(!records.has(record.path), 'duplicate skill file');
      records.set(record.path, verifyFile(root, record));
      fileCount++;
    }
    const skillPath = skill.path + '/SKILL.md';
    const content = records.get(skillPath)?.toString('utf8');
    assert.ok(content, 'SKILL.md must be present');
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content)?.[1];
    assert.ok(frontmatter, 'SKILL.md must have YAML frontmatter');
    assert.equal(/^name:\s*(.+)$/m.exec(frontmatter)?.[1].trim(), skill.name, 'skill name must match folder');
    assert.ok(/^description:\s*\S.+$/m.test(frontmatter), 'skill description must be present');
    const metadata = records.get(skill.path + '/agents/openai.yaml')?.toString('utf8');
    assert.ok(metadata?.includes('$' + skill.name), 'metadata must mention the same skill');
    assert.ok(records.has(skill.path + '/references/upstream.md'), 'pinned upstream reference must be present');
  }
  return { skills: [...names], files: fileCount, upstreamCommit: lock.upstream.commit };
}

if (require.main === module) {
  try {
    const result = checkEcc(path.resolve(__dirname, '..'));
    console.log('ECC files verified: ' + result.skills.length + ' repository skills, ' + result.files + ' pinned files.');
    for (const name of result.skills) console.log('- ' + name);
  } catch (error) {
    console.error('ECC file verification failed: ' + error.message);
    process.exitCode = 1;
  }
}

module.exports = { checkEcc };
