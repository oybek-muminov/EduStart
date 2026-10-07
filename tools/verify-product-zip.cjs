'use strict';
// Validate raw ZIP paths, local/central consistency, CRC, manifest and stage bytes.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { assertPortablePath, readZip, sha256 } = require('./product-zip.cjs');
const DEFAULT_VERSION = '1.0.1', SOURCE_VERSION = '1.0.0';

function assertVersion(version) {
  assert.match(version, /^\d+\.\d+\.\d+$/, 'Use a version such as 1.0.1');
  return version;
}

function stageFiles(folder, relative = '') {
  return fs.readdirSync(path.join(folder, relative), { withFileTypes: true }).flatMap(entry => {
    const file = relative ? `${relative}/${entry.name}` : entry.name;
    assertPortablePath(file);
    assert.ok(!entry.isSymbolicLink(), `Stage symlink is forbidden: ${file}`);
    if (entry.isDirectory()) return stageFiles(folder, file);
    assert.ok(entry.isFile(), `Stage contains a non-file: ${file}`);
    return [file];
  });
}

function verifyProductZip({ root = path.resolve(__dirname, '..'), version = DEFAULT_VERSION, writeReport = true } = {}) {
  assertVersion(version);
  const packageName = `EduStart_UZ_RU_EN_v${version}`;
  const filename = `release/${packageName}.zip`, zip = fs.readFileSync(path.join(root, filename));
  const entries = readZip(zip), prefix = `${packageName}/`, manifestName = `${prefix}MANIFEST.json`;
  assert.ok(entries.has(manifestName), 'Expected package MANIFEST.json is missing');
  const manifestBytes = entries.get(manifestName), manifest = JSON.parse(manifestBytes.toString('utf8'));
  assert.equal(manifest.version, version, 'Manifest version disagrees with package name');
  if (version !== SOURCE_VERSION) {
    assert.equal(manifest.package_version, version, 'Package version is missing or wrong');
    assert.equal(manifest.source_version, SOURCE_VERSION, 'Source version is wrong');
    assert.equal(manifest.qa_version, SOURCE_VERSION, 'Historical QA version is wrong');
  }
  assert.ok(Array.isArray(manifest.files), 'Manifest file list is missing');
  assert.equal(entries.size, manifest.files.length + 1, 'ZIP and manifest file counts disagree');
  const folder = path.join(root, 'release/stage', packageName), expectedFiles = new Set(['MANIFEST.json']);
  for (const file of manifest.files) {
    assertPortablePath(file.file);
    assert.ok(!expectedFiles.has(file.file), `Duplicate manifest file: ${file.file}`);
    expectedFiles.add(file.file);
    const bytes = entries.get(prefix + file.file);
    assert.ok(bytes, `Missing ZIP file: ${file.file}`);
    assert.equal(bytes.length, file.bytes, `Manifest byte count mismatch: ${file.file}`);
    assert.equal(sha256(bytes), file.sha256, `Manifest SHA256 mismatch: ${file.file}`);
    assert.ok(bytes.equals(fs.readFileSync(path.join(folder, file.file))), `Stage bytes mismatch: ${file.file}`);
  }
  assert.ok(manifestBytes.equals(fs.readFileSync(path.join(folder, 'MANIFEST.json'))), 'Stage manifest bytes mismatch');
  assert.ok(manifestBytes.equals(fs.readFileSync(path.join(root, `release/MANIFEST-v${version}.json`))), 'Release manifest bytes mismatch');
  assert.deepEqual(stageFiles(folder).sort(), [...expectedFiles].sort(), 'Unexpected stage files');
  const qa = JSON.parse(entries.get(prefix + `docs/QA-v${SOURCE_VERSION}.json`));
  assert.equal(qa.version, SOURCE_VERSION, 'QA version mismatch');
  assert.equal(qa.status, 'passed', 'Historical source QA has not passed');
  assert.equal(Object.keys(qa.assets).length, 7, 'Expected seven source hashes');
  for (const [file, hash] of Object.entries(qa.assets)) {
    assertPortablePath(file);
    assert.equal(sha256(entries.get(prefix + 'site/' + file)), hash, `Source/QA hash mismatch: ${file}`);
  }
  assert.equal(qa.screenshots.length, 21, 'Expected 21 historical screenshots');
  for (const shot of qa.screenshots) {
    assertPortablePath(shot.file);
    assert.equal(sha256(entries.get(prefix + shot.file)), shot.sha256, `Screenshot/QA hash mismatch: ${shot.file}`);
  }
  const result = {
    filename, bytes: zip.length, sha256: sha256(zip), files: entries.size,
    raw_posix_paths: 'PASS', local_central_names: 'PASS', crc: 'PASS',
    manifest_and_stage_bytes: 'PASS', source_sha256: 'PASS (7 files)',
    screenshot_sha256: 'PASS (21 files)', version: manifest.version,
    package_version: version, source_version: SOURCE_VERSION, qa_version: SOURCE_VERSION,
    technical_qa: manifest.technical_qa, review_state: manifest.review_state, published: manifest.published
  };
  if (writeReport) fs.writeFileSync(path.join(root, `release/ZIP-VERIFIED-v${version}.json`), JSON.stringify(result, null, 2) + '\n');
  return result;
}

if (require.main === module) {
  try {
    assert.ok(process.argv.length <= 3, 'Usage: node tools/verify-product-zip.cjs [1.0.1]');
    console.log(JSON.stringify(verifyProductZip({ version: process.argv[2] || DEFAULT_VERSION }), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { DEFAULT_VERSION, SOURCE_VERSION, assertVersion, stageFiles, verifyProductZip };
