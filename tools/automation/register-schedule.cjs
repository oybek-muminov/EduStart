'use strict';
// Windows scheduler registration only after verified smoke + reviewer access + explicit enable.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const config = require('./config.json');
const proofPath = path.join(root, '.automation/smoke-cycle.json');
function fail(message) { console.error(message); process.exit(1); }
if (!process.argv.includes('--enable')) fail('Schedule disabled: explicit --enable required.');
if (!fs.existsSync(proofPath)) fail('Schedule blocked: successful smoke-cycle proof does not exist.');
const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
if (!proof.passed || !proof.published?.readback_verified) fail('Schedule blocked: upload/readback failed.');
if (!config.reviewer_access_verified || !config.schedule_enabled) fail('Schedule blocked: reviewer access or schedule approval missing.');
const qaProofPath = path.join(root,'.automation/site-qa-cycle.json');
if (!fs.existsSync(qaProofPath) || !config.qa_review_approved) fail('Schedule blocked: full browser QA and independent human review missing.');
const qaProof = JSON.parse(fs.readFileSync(qaProofPath,'utf8'));
if (!qaProof.passed || !qaProof.published?.readback_verified) fail('Schedule blocked: full browser QA/evidence readback failed.');
if (config.smoke_task_id !== proof.task_id.replaceAll('-', '')) fail('Smoke task mismatch.');
if (process.platform !== 'win32') fail('This registration is Windows only.');
const name = 'EduStart-Codex-Queue';
const query = spawnSync('schtasks.exe', ['/Query', '/TN', name], { windowsHide: true, encoding: 'utf8' });
if (query.error) fail(query.error.message);
if (query.status === 0) fail('Existing scheduled task found; refusing to overwrite.');
const xmlEscape = value => value.replace(/[<>&"']/g, character => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;' }[character]));
const account = (process.env.USERDOMAIN ? process.env.USERDOMAIN + '\\' : '') + os.userInfo().username;
const start = new Date(Date.now() + 5 * 60 * 1000);
const two = value => String(value).padStart(2, '0');
const boundary = `${start.getFullYear()}-${two(start.getMonth()+1)}-${two(start.getDate())}T${two(start.getHours())}:${two(start.getMinutes())}:${two(start.getSeconds())}`;
const xml = `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
<Triggers><TimeTrigger><Repetition><Interval>PT30M</Interval><StopAtDurationEnd>false</StopAtDurationEnd></Repetition><StartBoundary>${boundary}</StartBoundary><Enabled>true</Enabled></TimeTrigger></Triggers>
<Principals><Principal id="Author"><UserId>${xmlEscape(account)}</UserId><LogonType>InteractiveToken</LogonType><RunLevel>LeastPrivilege</RunLevel></Principal></Principals>
<Settings><MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy><ExecutionTimeLimit>PT25M</ExecutionTimeLimit><Enabled>true</Enabled></Settings>
<Actions Context="Author"><Exec><Command>${xmlEscape(process.execPath)}</Command><Arguments>${xmlEscape('"' + path.join(__dirname, 'runner.cjs') + '"')}</Arguments><WorkingDirectory>${xmlEscape(root)}</WorkingDirectory></Exec></Actions>
</Task>`;
const xmlPath = path.join(root, '.automation/schedule.xml');
fs.writeFileSync(xmlPath, Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(xml, 'utf16le')]));
const result = spawnSync('schtasks.exe', ['/Create', '/TN', name, '/XML', xmlPath], { windowsHide: true, encoding: 'utf8' });
if (result.error || result.status !== 0) fail(result.error?.message || result.stderr || result.stdout);
const verified = spawnSync('schtasks.exe', ['/Query', '/TN', name, '/XML'], { windowsHide: true, encoding: 'utf8' });
if (verified.status !== 0) fail('Registration readback failed; reconcile in Task Scheduler.');
console.log(verified.stdout);
