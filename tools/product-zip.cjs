'use strict';
// Small ZIP32 implementation: portable paths and reproducible, uncompressed bytes.
const assert = require('node:assert/strict');
const zlib = require('node:zlib');
const crypto = require('node:crypto');

const MAX_BYTES = 20 * 1024 * 1024;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const crcTable = Array.from({ length: 256 }, (_, i) => {
  let crc = i;
  for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function assertPortablePath(name) {
  assert.equal(typeof name, 'string', 'ZIP path must be a string');
  assert.ok(name.length && !/[\\:<>"|?*\x00-\x1f\x7f]/u.test(name), `Non-portable ZIP path: ${name}`);
  assert.ok(!name.startsWith('/'), `Absolute ZIP path: ${name}`);
  for (const component of name.split('/')) {
    assert.ok(component && component !== '.' && component !== '..', `Unsafe ZIP path: ${name}`);
    assert.ok(!/[. ]$/u.test(component), `Non-portable ZIP path: ${name}`);
    assert.ok(!/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/iu.test(component), `Reserved ZIP path: ${name}`);
  }
  return name;
}

function uniqueName(names, name) {
  assertPortablePath(name);
  // Case-insensitive extraction on Windows must not silently overwrite a file.
  const key = name.toLowerCase();
  assert.ok(!names.has(key), `Duplicate ZIP path: ${name}`);
  names.add(key);
}

function createZip(files) {
  assert.ok(files.length > 0 && files.length < 0xffff, 'ZIP32 entry count exceeded');
  const entries = [...files].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  const names = new Set(), locals = [], centrals = [];
  let offset = 0;
  for (const entry of entries) {
    uniqueName(names, entry.name);
    const name = Buffer.from(entry.name, 'utf8'), bytes = Buffer.from(entry.bytes);
    assert.ok(name.length <= 0xffff && bytes.length <= MAX_BYTES, 'ZIP entry size exceeded');
    const crc = crc32(bytes), local = Buffer.alloc(30), central = Buffer.alloc(46);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8, no encryption or data descriptor.
    local.writeUInt16LE(0, 8); // STORE avoids compressor/platform-dependent output.
    local.writeUInt16LE(0x0021, 12); // Fixed date: 1980-01-01; fixed time: midnight.
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(bytes.length, 18);
    local.writeUInt32LE(bytes.length, 22);
    local.writeUInt16LE(name.length, 26);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(0x0314, 4); // Unix origin, ZIP 2.0.
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0x0021, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(bytes.length, 20);
    central.writeUInt32LE(bytes.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE((0o100644 * 0x10000) >>> 0, 38); // Regular file, never a symlink.
    central.writeUInt32LE(offset, 42);
    locals.push(local, name, bytes);
    centrals.push(central, name);
    offset += local.length + name.length + bytes.length;
  }
  const directory = Buffer.concat(centrals), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  assert.ok(offset + directory.length + end.length <= MAX_BYTES, 'ZIP size exceeded');
  return Buffer.concat([...locals, directory, end]);
}

function readZip(zip) {
  assert.ok(Buffer.isBuffer(zip) && zip.length >= 22 && zip.length <= MAX_BYTES, 'Invalid ZIP size');
  let end = -1;
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 65557); i--) {
    if (zip.readUInt32LE(i) === 0x06054b50 && i + 22 + zip.readUInt16LE(i + 20) === zip.length) {
      end = i;
      break;
    }
  }
  assert.ok(end >= 0, 'Missing ZIP end record');
  assert.equal(zip.readUInt16LE(end + 4), 0, 'Multi-disk ZIP is unsupported');
  assert.equal(zip.readUInt16LE(end + 6), 0, 'Multi-disk ZIP is unsupported');
  const count = zip.readUInt16LE(end + 10), directorySize = zip.readUInt32LE(end + 12);
  const directoryStart = zip.readUInt32LE(end + 16);
  assert.ok(count > 0 && count < 0xffff, 'Invalid ZIP32 entry count');
  assert.equal(zip.readUInt16LE(end + 8), count, 'ZIP entry counts disagree');
  assert.equal(directoryStart + directorySize, end, 'Invalid ZIP central-directory bounds');
  const entries = new Map(), names = new Set(), spans = [];
  let pos = directoryStart, totalExpanded = 0;
  const requireBytes = (start, length, limit, label) => {
    assert.ok(start >= 0 && length >= 0 && start + length <= limit, `Truncated ${label}`);
  };
  for (let i = 0; i < count; i++) {
    requireBytes(pos, 46, end, 'ZIP central header');
    assert.equal(zip.readUInt32LE(pos), 0x02014b50, 'Invalid ZIP central header');
    const flags = zip.readUInt16LE(pos + 8), method = zip.readUInt16LE(pos + 10);
    const expectedCRC = zip.readUInt32LE(pos + 16), size = zip.readUInt32LE(pos + 20);
    const expanded = zip.readUInt32LE(pos + 24), nameLength = zip.readUInt16LE(pos + 28);
    const extra = zip.readUInt16LE(pos + 30), comment = zip.readUInt16LE(pos + 32);
    const offset = zip.readUInt32LE(pos + 42);
    assert.ok((flags & ~0x0800) === 0, 'Unsupported ZIP flags');
    assert.ok(method === 0 || method === 8, 'Unsupported ZIP compression');
    assert.equal(zip.readUInt16LE(pos + 34), 0, 'Multi-disk entry is unsupported');
    assert.notEqual((zip.readUInt32LE(pos + 38) >>> 16) & 0xf000, 0xa000, 'ZIP symlinks are forbidden');
    requireBytes(pos + 46, nameLength + extra + comment, end, 'ZIP central name');
    const rawName = zip.subarray(pos + 46, pos + 46 + nameLength);
    const name = new TextDecoder('utf-8', { fatal: true }).decode(rawName);
    uniqueName(names, name); // Validate original bytes; never normalize backslashes.
    requireBytes(offset, 30, directoryStart, 'ZIP local header');
    assert.equal(zip.readUInt32LE(offset), 0x04034b50, `Invalid local header: ${name}`);
    assert.equal(zip.readUInt16LE(offset + 6), flags, `Local/central flags disagree: ${name}`);
    assert.equal(zip.readUInt16LE(offset + 8), method, `Local/central compression disagrees: ${name}`);
    assert.equal(zip.readUInt32LE(offset + 14), expectedCRC, `Local/central CRC disagrees: ${name}`);
    assert.equal(zip.readUInt32LE(offset + 18), size, `Local/central size disagrees: ${name}`);
    assert.equal(zip.readUInt32LE(offset + 22), expanded, `Local/central expanded size disagrees: ${name}`);
    const localNameLength = zip.readUInt16LE(offset + 26), localExtra = zip.readUInt16LE(offset + 28);
    requireBytes(offset + 30, localNameLength + localExtra, directoryStart, 'ZIP local name');
    assert.ok(rawName.equals(zip.subarray(offset + 30, offset + 30 + localNameLength)), `Local/central names disagree: ${name}`);
    const dataStart = offset + 30 + localNameLength + localExtra;
    requireBytes(dataStart, size, directoryStart, 'ZIP data');
    totalExpanded += expanded;
    assert.ok(expanded <= MAX_BYTES && totalExpanded <= MAX_BYTES, 'ZIP expanded size exceeded');
    const compressed = zip.subarray(dataStart, dataStart + size);
    const bytes = method === 0 ? compressed : zlib.inflateRawSync(compressed, { maxOutputLength: Math.max(1, expanded) });
    assert.equal(bytes.length, expanded, `ZIP expanded size mismatch: ${name}`);
    assert.equal(crc32(bytes), expectedCRC, `ZIP CRC mismatch: ${name}`);
    entries.set(name, bytes);
    spans.push({ start: offset, end: dataStart + size });
    pos += 46 + nameLength + extra + comment;
  }
  assert.equal(pos, end, 'Unexpected ZIP central-directory bytes');
  spans.sort((a, b) => a.start - b.start);
  let next = 0;
  for (const span of spans) {
    assert.equal(span.start, next, 'Overlapping or unindexed ZIP local entries');
    next = span.end;
  }
  assert.equal(next, directoryStart, 'Unexpected ZIP local-entry bytes');
  return entries;
}

module.exports = { assertPortablePath, createZip, readZip, crc32, sha256 };
