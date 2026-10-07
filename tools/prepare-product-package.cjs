'use strict';
// Package-only rebuild: source, historical QA, source snapshot and v1.0.0 stay intact.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { assertPortablePath, createZip, sha256 } = require('./product-zip.cjs');
const { DEFAULT_VERSION, SOURCE_VERSION, assertVersion, stageFiles, verifyProductZip } = require('./verify-product-zip.cjs');

function prepareProductPackage({ root = path.resolve(__dirname, '..'), version = DEFAULT_VERSION, rebuild = false } = {}) {
  assertVersion(version);
  assert.notEqual(version, SOURCE_VERSION, 'Historical v1.0.0 artifacts must not be overwritten');
  const qa = JSON.parse(fs.readFileSync(path.join(root, `docs/QA-v${SOURCE_VERSION}.json`), 'utf8'));
  assert.ok(qa.version === SOURCE_VERSION && qa.status === 'passed' && qa.matrix.length === 15 && qa.screenshots.length === 21, 'Incomplete historical browser QA');
  const sources = fs.readdirSync(path.join(root, 'site')).sort().map(name => {
    assertPortablePath(name);
    const bytes = fs.readFileSync(path.join(root, 'site', name));
    return { file: 'site/' + name, sha256: sha256(bytes), content: bytes.toString('utf8') };
  });
  assert.equal(sources.length, 7, 'Expected seven unchanged source files');
  assert.equal(Object.keys(qa.assets).length, sources.length, 'QA/source file count mismatch');
  for (const source of sources) assert.equal(qa.assets[path.basename(source.file)], source.sha256, `QA/source mismatch: ${source.file}`);
  const snapshot = JSON.parse(fs.readFileSync(path.join(root, `docs/SOURCES-v${SOURCE_VERSION}.json`), 'utf8'));
  assert.equal(snapshot.version, SOURCE_VERSION, 'Historical source snapshot version mismatch');
  assert.deepEqual(snapshot.files, sources, 'Historical source snapshot bytes mismatch');
  const selected = [
    'START-HERE.md', ...sources.map(source => source.file), 'docs/COPY_EN.json', 'docs/COPY_UZ_RU_EN.json',
    'docs/README_UZ.md', 'docs/README_RU.md', 'docs/README_EN.md', 'docs/LICENSE.txt',
    `docs/QA-v${SOURCE_VERSION}.json`, `docs/QA-v${SOURCE_VERSION}.md`, `docs/QA-STATIC-v${SOURCE_VERSION}.json`,
    `docs/APP-DIFF-v${SOURCE_VERSION}.txt`, ...qa.screenshots.map(shot => shot.file),
    'seller/GUMROAD-LISTING.md', 'seller/RELEASE-CHECKLIST.md', 'seller/cover.html', 'seller/cover.png'
  ];
  assert.equal(new Set(selected).size, selected.length, 'Duplicate package source');
  const files = selected.map(file => {
    assertPortablePath(file);
    assert.ok(fs.lstatSync(path.join(root, file)).isFile(), `Package source must be a regular file: ${file}`);
    return { file, bytes: fs.readFileSync(path.join(root, file)) };
  });
  for (const shot of qa.screenshots) {
    assert.ok(shot.file.startsWith(`docs/evidence-v${SOURCE_VERSION}/`), 'Unexpected screenshot path');
    assert.equal(sha256(files.find(file => file.file === shot.file).bytes), shot.sha256, `Screenshot hash mismatch: ${shot.file}`);
  }
  const manifest = {
    product: 'EduStart UZ/RU/EN', version, package_version: version,
    source_version: SOURCE_VERSION, qa_version: SOURCE_VERSION,
    price_usd: 19, license: 'one business, all three languages', technical_qa: 'passed',
    review_state: 'awaiting-independent-review', seller_terms: 'Oybek confirms identity/support/refund before publication',
    published: false, files: files.map(file => ({ file: file.file, bytes: file.bytes.length, sha256: sha256(file.bytes) }))
  };
  const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
  const packageName = `EduStart_UZ_RU_EN_v${version}`, folder = path.join(root, 'release/stage', packageName);
  const staged = [...files, { file: 'MANIFEST.json', bytes: manifestBytes }];
  const zipBytes = createZip(staged.map(file => ({ name: `${packageName}/${file.file}`, bytes: file.bytes })));
  const outputs = [
    { file: path.join(root, `release/MANIFEST-v${version}.json`), bytes: manifestBytes },
    { file: path.join(root, `release/${packageName}.zip`), bytes: zipBytes }
  ];
  if (fs.existsSync(folder) && !rebuild) {
    assert.deepEqual(stageFiles(folder).sort(), staged.map(file => file.file).sort(), 'Stage differs; inspect or use --rebuild');
    for (const file of staged) assert.ok(file.bytes.equals(fs.readFileSync(path.join(folder, file.file))), `Stage differs: ${file.file}; inspect or use --rebuild`);
  }
  for (const output of outputs) {
    if (fs.existsSync(output.file) && !rebuild) assert.ok(output.bytes.equals(fs.readFileSync(output.file)), `Artifact differs: ${path.basename(output.file)}; inspect or use --rebuild`);
  }
  fs.mkdirSync(path.dirname(folder), { recursive: true });
  if (!fs.existsSync(folder) || rebuild) {
    const temporary = fs.mkdtempSync(path.join(path.dirname(folder), `.${packageName}-`));
    try {
      for (const file of staged) {
        const dest = path.join(temporary, file.file);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, file.bytes, { flag: 'wx' });
      }
      if (rebuild && fs.existsSync(folder)) fs.rmSync(folder, { recursive: true });
      fs.renameSync(temporary, folder);
    } finally {
      if (fs.existsSync(temporary)) fs.rmSync(temporary, { recursive: true });
    }
  }
  for (const output of outputs) {
    if (rebuild || !fs.existsSync(output.file)) fs.writeFileSync(output.file, output.bytes);
  }
  return verifyProductZip({ root, version });
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2), rebuild = args.includes('--rebuild');
    const versions = args.filter(arg => arg !== '--rebuild');
    assert.ok(versions.length <= 1, 'Usage: node tools/prepare-product-package.cjs [1.0.1] [--rebuild]');
    console.log(JSON.stringify(prepareProductPackage({ version: versions[0] || DEFAULT_VERSION, rebuild }), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { prepareProductPackage };
