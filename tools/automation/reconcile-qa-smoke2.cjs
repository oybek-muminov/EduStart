'use strict';
// Read late worker evidence after a timeout; never resume, approve or clear locks.
const fs = require('node:fs');
const path = require('node:path');
const core = require('./core.cjs');
const qa = require('./site-qa.cjs');
const root = path.resolve(__dirname, '../..');
const key = core.hash('3ee063b085c281c0920febc6f739e816:qa-smoke-2');
const dir = path.join(root,'.automation/artifacts',key);
const log = path.join(root,'.automation/20261004063853591-19040-qa-1.events.jsonl');
const events = fs.readFileSync(log,'utf8').trim().split(/\r?\n/).map(JSON.parse);
const late = JSON.parse(events.filter(x=>x.item?.type==='agent_message').at(-1).item.text);
if (late.status !== 'blocked' || events.at(-1).type !== 'turn.completed') throw new Error('Unreconciled worker log');
const proposal = qa.proposal(root,path.join(dir,'candidate'),dir);
const evidence = fs.readdirSync(path.join(dir,'candidate/evidence')).map(name=>{
  const bytes = fs.readFileSync(path.join(dir,'candidate/evidence',name));
  return {name,bytes:bytes.length,sha256:core.hash(bytes),scope:'PARTIAL ONLY; full QA not passed'};
});
const report = {
  project:'EduStart',task_id:'3ee063b085c281c0920febc6f739e816',version:'qa-smoke-2',runner_version:'1.1.0',key,
  status:'blocked',attempts:1,max_attempts:3,
  blocker:'Controller 600s deadline exceeded; late worker reported browser reconnection / No page found. Final matrix incomplete.',
  late_worker_result:late,partial_evidence:evidence,candidate_changes:proposal.files,
  site_changes:'STAGED PROPOSAL ONLY; main site unchanged',
  smoke2_upload:{passed:true,bytes:5583,sha256:'9fa2b6363dcd3dda410ad7aff52504c6f0fc4c2ef39d157998636d4164af575b',file_upload_id:'3ee063b0-85c2-8152-ab85-00b2f98f7ac8',independent_bytes_equal:true},
  permissions:'Official per-invocation --approve-for-me; private OS-temp screenshot directory via --add-dir; global protections unchanged.',
  future_qa_timeout_seconds:1800,review_state:'blocked',approval_by:null,schedule_enabled:false,
  lock:'Retained. Late turn.completed observed; no output-schema file. Do not clear until exact processes and Notion are reconciled.',
  next_step:'Restore stable chrome-devtools session; reconcile lock and any leftover child processes, then authorize a new task version. Complete real-browser matrix and all evidence readbacks before independent reviewer approval. No publish.'
};
const text=JSON.stringify(report,null,2)+'\n';
fs.writeFileSync(path.join(dir,'reconciled-report.json'),text,{flag:'wx'});
console.log(JSON.stringify({path:path.relative(root,path.join(dir,'reconciled-report.json')),sha256:core.hash(text),content:text}));
