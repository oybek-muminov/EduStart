'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const qa = require('./site-qa.cjs');
const core = require('./core.cjs');
const config = require('./config.json');
const root = path.resolve(__dirname,'../..');
const tests = path.join(root,'.automation/tests');
fs.mkdirSync(tests,{recursive:true});
const directory = fs.mkdtempSync(path.join(tests,'site-qa-'));
test('site-fix-qa remains project/relation/ready constrained', () => {
  const task = {id:config.smoke_task_id,product_id:config.product_id,source_id:config.task_source_id,status:'Rejada',marker:{automation:'edustart-v1',project:'EduStart',ready:true,version:'qa-test',kind:'site-fix-qa'}};
  assert.equal(core.eligible(task,config),true);
  assert.equal(core.eligible({...task,product_id:'0'.repeat(32)},config),false);
  assert.equal(core.eligible({...task,marker:{...task.marker,kind:'final-approve'}},config),false);
});
test('candidate server actually serves isolated source; fixes never enter main source', async () => {
  const before = core.inventory(root);
  const stage = qa.prepare(root,directory);
  const file = path.join(stage,'site/styles.css');
  fs.appendFileSync(file,'\n/* QA unit-test candidate marker */\n');
  const server = await qa.startServer(stage);
  try {
    const response = await fetch(server.url+'/styles.css');
    assert.equal(response.status,200);
    assert.match(await response.text(),/QA unit-test candidate marker/);
    const result = qa.proposal(root,stage,directory);
    assert.deepEqual(result.files.map(item=>item.file),['site/styles.css']);
    assert.match(fs.readFileSync(result.attachment.path,'utf8'),/QA unit-test candidate marker/);
    assert.deepEqual(core.inventory(root),before);
  } finally { server.close(); }
});
test('a declared pass without browser call evidence cannot become a QA pass', () => {
  const log = path.join(directory,'empty-events.jsonl'); fs.writeFileSync(log,'');
  const result = qa.verify({status:'passed',matrix:[]},path.join(directory,'candidate'),log);
  assert.equal(result.passed,false);
  assert.match(result.blocker,/No successful real-browser/);
});
test('unavailable browser is blocked rather than repaired or self-approved', () => {
  const result = qa.verify({status:'blocked',blocker:'Browser unavailable'},directory,'unused');
  assert.equal(result.passed,false);
  assert.equal(result.blocker,'Browser unavailable');
  assert.deepEqual(result.evidence,[]);
});
