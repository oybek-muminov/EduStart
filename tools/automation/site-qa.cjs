'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawnSync } = require('node:child_process');
const core = require('./core.cjs');
const widths = [360, 375, 390, 768, 1440];
function prepare(root, artifactDir) {
  const stage = path.join(artifactDir, 'candidate');
  fs.mkdirSync(path.join(stage, 'site'), { recursive: true });
  fs.mkdirSync(path.join(stage, 'evidence'), { recursive: true });
  for (const entry of core.inventory(root)) fs.copyFileSync(path.join(root, entry.file), path.join(stage, entry.file));
  fs.cpSync(path.join(root, 'docs'), path.join(stage, 'docs'), { recursive: true });
  fs.copyFileSync(path.join(root, 'HANDOFF.md'), path.join(stage, 'HANDOFF.md'));
  return stage;
}
async function startServer(stage) {
  const site = path.join(stage, 'site');
  const types = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml' };
  const server = http.createServer(async (req,res) => {
    try {
      if (!['GET','HEAD'].includes(req.method)) return res.writeHead(405).end();
      const name = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const file = path.resolve(site, '.' + (name === '/' ? '/index.html' : name));
      if (!file.startsWith(site + path.sep)) return res.writeHead(403).end();
      const bytes = await fs.promises.readFile(file);
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((resolve,reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',resolve); });
  return { url:'http://127.0.0.1:' + server.address().port, close:() => { server.closeAllConnections(); server.close(); } };
}
function verify(result, stage, logPath) {
  if (result.status !== 'passed') return { passed:false, blocker:result.blocker || result.summary, evidence:[] };
  const events = fs.readFileSync(logPath,'utf8').split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
  const calls = events.filter(event => event.type === 'item.completed' && event.item?.type === 'mcp_tool_call' && event.item.status === 'completed' && !event.item.error && !event.item.result?.isError);
  const browserCalls = calls.filter(event => /chrome|cua_repl|node_repl/.test(event.item.server + ' ' + event.item.tool));
  if (!browserCalls.some(event => /screenshot|Screenshot/.test(event.item.tool + ' ' + JSON.stringify(event.item.arguments)))) {
    return { passed:false, blocker:'No successful real-browser screenshot MCP call in execution trace', evidence:[] };
  }
  const files = [];
  for (const lang of ['uz','ru']) for (const width of widths) {
    const rows = result.matrix.filter(row => row.lang === lang && row.width === width);
    if (rows.length !== 1) return { passed:false, blocker:`Incomplete QA matrix: ${lang}/${width}`, evidence:[] };
    const row = rows[0];
    if (row.actual_width !== width || row.client_width < 1 || row.scroll_width > row.client_width ||
        ['menu','language_switch','demo_contacts','configured_links','keyboard','faq'].some(name => row[name] !== true) ||
        row.console_errors.length || row.failed_requests.length) return { passed:false, blocker:`QA failure: ${lang}/${width}`, evidence:[] };
    if (!/^evidence\/[a-z0-9_-]+\.png$/.test(row.screenshot)) return { passed:false, blocker:'Invalid screenshot path', evidence:[] };
    const filename = path.join(stage,row.screenshot);
    const info = fs.lstatSync(filename);
    if (!info.isFile() || info.isSymbolicLink()) throw new Error('Screenshot must be a regular file');
    const bytes = fs.readFileSync(filename);
    if (bytes.length < 100 || bytes.length > 20*1024*1024 || !bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
      return { passed:false, blocker:'Screenshot PNG missing/invalid', evidence:[] };
    }
    files.push({ path:filename, name:path.basename(filename), sha256:core.hash(bytes), bytes:bytes.length });
  }
  return { passed:true, blocker:null, evidence:files };
}
function proposal(root, stage, artifactDir) {
  if (fs.readdirSync(path.join(stage,'site')).length !== core.inventory(root).length) throw new Error('Candidate added/removed site files outside repair scope');
  const files = [];
  let diff = '';
  for (const original of core.inventory(root)) {
    const candidate = path.join(stage,original.file);
    const info = fs.lstatSync(candidate);
    if (!info.isFile() || info.isSymbolicLink()) throw new Error('Candidate source must be a regular file');
    const bytes = fs.readFileSync(candidate);
    if (core.hash(bytes) === original.sha256) continue;
    const result = spawnSync('git',['diff','--no-index','--',path.join(root,original.file),candidate],{ encoding:'utf8',windowsHide:true });
    if (![0,1].includes(result.status)) throw new Error('Candidate diff failed');
    diff += result.stdout;
    files.push({ file:original.file, sha256:core.hash(bytes), before_sha256:original.sha256 });
  }
  const diffFile = path.join(artifactDir,'candidate-changes.txt');
  fs.writeFileSync(diffFile,diff || 'No source changes.\n');
  return { files, attachment:{ path:diffFile,name:'candidate-changes.txt',sha256:core.hash(fs.readFileSync(diffFile)),bytes:fs.statSync(diffFile).size } };
}
module.exports = { widths,prepare,startServer,verify,proposal };
