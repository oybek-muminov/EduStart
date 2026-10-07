'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const { createZip, readZip, sha256 } = require('./product-zip.cjs');
const { prepareProductPackage } = require('./prepare-product-package.cjs');
const { verifyProductZip } = require('./verify-product-zip.cjs');
const root = path.resolve(__dirname, '..');

function records(zip) {
  const end = zip.length - 22, count = zip.readUInt16LE(end + 10), result = [];
  let central = zip.readUInt32LE(end + 16);
  for (let i = 0; i < count; i++) {
    const length = zip.readUInt16LE(central + 28), local = zip.readUInt32LE(central + 42);
    result.push({ central, local, length });
    central += 46 + length + zip.readUInt16LE(central + 30) + zip.readUInt16LE(central + 32);
  }
  return result;
}
function rename(zip, record, name) {
  const bytes = Buffer.from(name);
  assert.equal(bytes.length, record.length);
  bytes.copy(zip, record.central + 46);
  bytes.copy(zip, record.local + 30);
}
const sample = () => createZip([
  { name: 'package/docs/guide.md', bytes: Buffer.from('Setup guide') },
  { name: 'package/site/index.html', bytes: Buffer.from('<html>UZ</html>') }
]);

test('ZIP bytes are deterministic and preserve raw POSIX names', () => {
  const zip = sample();
  assert.ok(zip.equals(sample()));
  const entries = readZip(zip);
  assert.deepEqual([...entries.keys()], ['package/docs/guide.md', 'package/site/index.html']);
  assert.equal(entries.get('package/site/index.html').toString(), '<html>UZ</html>');
});

test('historical Windows names fail instead of being silently normalized', () => {
  const legacy = fs.readFileSync(path.join(root, 'release/EduStart_UZ_RU_EN_v1.0.0.zip'));
  assert.throws(() => readZip(legacy), /Non-portable ZIP path/);
  const zip = sample();
  for (const record of records(zip)) {
    const name = zip.subarray(record.central + 46, record.central + 46 + record.length).toString();
    rename(zip, record, name.replaceAll('/', '\\'));
  }
  assert.throws(() => readZip(zip), /Non-portable ZIP path/);
});

test('traversal and absolute raw names fail', () => {
  const traversal = createZip([{ name: 'package/docs/a.txt', bytes: Buffer.from('a') }]);
  rename(traversal, records(traversal)[0], 'package/.././a.txt');
  assert.throws(() => readZip(traversal), /Unsafe ZIP path/);
  const absolute = createZip([{ name: 'a/b.txt', bytes: Buffer.from('a') }]);
  rename(absolute, records(absolute)[0], '/ab.txt');
  assert.throws(() => readZip(absolute), /Absolute ZIP path/);
});

test('Windows-invalid path characters fail in both writer and raw ZIP reader', () => {
  for (const character of ['<', '>', '"', '|', '?', '*', ':', '\\', '\x00', '\x1f']) {
    const name = `package/d${character}cs/a.txt`;
    assert.throws(() => createZip([{ name, bytes: Buffer.from('a') }]), /Non-portable ZIP path/);
    const zip = createZip([{ name: 'package/docs/a.txt', bytes: Buffer.from('a') }]);
    rename(zip, records(zip)[0], name);
    assert.throws(() => readZip(zip), /Non-portable ZIP path/);
  }
});

test('duplicate and case-colliding raw names fail', () => {
  for (const replacement of ['package/a.txt', 'package/A.txt']) {
    const zip = createZip([
      { name: 'package/a.txt', bytes: Buffer.from('a') },
      { name: 'package/b.txt', bytes: Buffer.from('b') }
    ]);
    rename(zip, records(zip)[1], replacement);
    assert.throws(() => readZip(zip), /Duplicate ZIP path/);
  }
});

test('local and central names must match byte-for-byte', () => {
  const zip = sample(), first = records(zip)[0];
  zip[first.local + 30] = 'P'.charCodeAt(0);
  assert.throws(() => readZip(zip), /Local\/central names disagree/);
});

test('changed file bytes fail CRC validation', () => {
  const zip = sample(), first = records(zip)[0];
  zip[first.local + 30 + first.length] ^= 1;
  assert.throws(() => readZip(zip), /ZIP CRC mismatch/);
});

function extractionFixture(t) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'edustart-zip-test-'));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const archive = path.join(temporary, 'sample.zip');
  fs.writeFileSync(archive, sample());
  return { archive, destination: path.join(temporary, 'extracted') };
}
function assertExtracted(folder) {
  assert.equal(fs.readFileSync(path.join(folder, 'package/site/index.html'), 'utf8'), '<html>UZ</html>');
  assert.equal(fs.readFileSync(path.join(folder, 'package/docs/guide.md'), 'utf8'), 'Setup guide');
  assert.ok(!fs.readdirSync(folder).some(name => name.includes('\\')));
}
function findPython3() {
  for (const command of [{ executable: 'python3', args: [] }, { executable: 'python', args: [] }, { executable: 'py', args: ['-3'] }]) {
    const probe = spawnSync(command.executable, [...command.args, '-c', 'import sys; assert sys.version_info.major == 3'], { encoding: 'utf8', timeout: 5000, windowsHide: true });
    if (probe.status === 0) return command;
  }
  return null;
}

test('standard Python extractall creates nested site/docs directories when available', t => {
  const command = findPython3();
  if (!command) return t.skip('Python 3 is unavailable; Node packaging checks still run');
  const { archive, destination } = extractionFixture(t);
  const python = spawnSync(command.executable, [...command.args, '-c', 'import sys,zipfile; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])', archive, destination], { encoding: 'utf8', timeout: 10000, windowsHide: true });
  assert.equal(python.status, 0, python.stderr || python.error?.message);
  assertExtracted(destination);
});

test('standard unzip creates nested site/docs directories when available', t => {
  const probe = spawnSync('unzip', ['-v'], { encoding: 'utf8', timeout: 5000, windowsHide: true });
  if (probe.error?.code === 'ENOENT') return t.skip('unzip is unavailable; Node packaging checks still run');
  assert.equal(probe.status, 0, probe.stderr || probe.error?.message);
  const { archive, destination } = extractionFixture(t);
  const unzip = spawnSync('unzip', ['-q', archive, '-d', destination], { encoding: 'utf8', timeout: 10000, windowsHide: true });
  assert.equal(unzip.status, 0, unzip.stderr || unzip.error?.message);
  assertExtracted(destination);
});

test('package build preserves history, is idempotent, and requires explicit rebuild after changes', t => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'edustart-package-test-'));
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
  for (const item of ['START-HERE.md', 'site', 'docs', 'seller']) fs.cpSync(path.join(root, item), path.join(fixture, item), { recursive: true });
  const historical = [
    'release/EduStart_UZ_RU_EN_v1.0.0.zip', 'release/MANIFEST-v1.0.0.json',
    'release/ZIP-VERIFIED-v1.0.0.json', 'docs/SOURCES-v1.0.0.json', 'docs/QA-v1.0.0.json'
  ];
  const before = new Map(historical.map(file => [file, sha256(fs.readFileSync(path.join(root, file)))]));
  for (const file of historical.filter(file => file.startsWith('release/'))) {
    fs.mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true });
    fs.copyFileSync(path.join(root, file), path.join(fixture, file));
  }
  const first = prepareProductPackage({ root: fixture });
  assert.equal(first.files, 44);
  assert.equal(first.package_version, '1.0.1');
  assert.equal(first.source_version, '1.0.0');
  assert.equal(first.qa_version, '1.0.0');
  assert.ok(first.bytes < 5 * 1024 * 1024);
  assert.deepEqual(prepareProductPackage({ root: fixture }), first);
  for (const [file, hash] of before) assert.equal(sha256(fs.readFileSync(path.join(fixture, file))), hash, file);
  fs.appendFileSync(path.join(fixture, 'START-HERE.md'), '\nBuyer guide correction.\n');
  assert.throws(() => prepareProductPackage({ root: fixture }), /Stage differs/);
  const rebuilt = prepareProductPackage({ root: fixture, rebuild: true });
  assert.notEqual(rebuilt.sha256, first.sha256);
  assert.deepEqual(verifyProductZip({ root: fixture }), rebuilt);
  const zipFile = path.join(fixture, 'release/EduStart_UZ_RU_EN_v1.0.1.zip');
  const entries = readZip(fs.readFileSync(zipFile));
  const wrongFile = 'EduStart_UZ_RU_EN_v1.0.1/site/config.js';
  const altered = Buffer.from(entries.get(wrongFile));
  altered[0] ^= 1;
  entries.set(wrongFile, altered);
  fs.writeFileSync(zipFile, createZip([...entries].map(([name, bytes]) => ({ name, bytes }))));
  assert.throws(() => verifyProductZip({ root: fixture }), /Manifest SHA256 mismatch/);
  prepareProductPackage({ root: fixture, rebuild: true });
  const stageManifest = path.join(fixture, 'release/stage/EduStart_UZ_RU_EN_v1.0.1/MANIFEST.json');
  fs.appendFileSync(stageManifest, ' ');
  assert.throws(() => verifyProductZip({ root: fixture }), /Stage manifest bytes mismatch/);
  prepareProductPackage({ root: fixture, rebuild: true });
  fs.writeFileSync(path.join(fixture, 'release/stage/EduStart_UZ_RU_EN_v1.0.1/EXTRA.txt'), 'extra');
  assert.throws(() => verifyProductZip({ root: fixture }), /Unexpected stage files/);
  assert.throws(() => prepareProductPackage({ root: fixture, version: '1.0.0', rebuild: true }), /Historical v1.0.0/);
  for (const [file, hash] of before) assert.equal(sha256(fs.readFileSync(path.join(fixture, file))), hash, file);
});
