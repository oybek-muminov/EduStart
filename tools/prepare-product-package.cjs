'use strict';
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const qa=JSON.parse(fs.readFileSync(path.join(root,'docs/QA-v1.0.0.json'),'utf8'));
if(qa.status!=='passed'||qa.matrix.length!==15||qa.screenshots.length!==21)throw Error('Incomplete genuine QA');
const sources=fs.readdirSync(path.join(root,'site')).sort().map(name=>({file:'site/'+name,sha256:sha(fs.readFileSync(path.join(root,'site',name))),content:fs.readFileSync(path.join(root,'site',name),'utf8')}));
for(const source of sources)if(qa.assets[path.basename(source.file)]!==source.sha256)throw Error('QA/source mismatch');
fs.writeFileSync(path.join(root,'docs/SOURCES-v1.0.0.json'),JSON.stringify({version:'1.0.0',kind:'Complete editable source files; UTF-8',files:sources},null,2)+'\n');
const old=path.join(root,'.automation/app-before-product.js');
if(fs.existsSync(old)){const diff=spawnSync('git',['diff','--no-index','--',old,path.join(root,'site/app.js')],{encoding:'utf8',windowsHide:true});if(![0,1].includes(diff.status))throw Error(diff.stderr);fs.writeFileSync(path.join(root,'docs/APP-DIFF-v1.0.0.txt'),diff.stdout);}
const selected=['START-HERE.md',...sources.map(x=>x.file),'docs/COPY_EN.json','docs/COPY_UZ_RU_EN.json','docs/README_UZ.md','docs/README_RU.md','docs/README_EN.md','docs/LICENSE.txt','docs/QA-v1.0.0.json','docs/QA-v1.0.0.md','docs/QA-STATIC-v1.0.0.json','docs/APP-DIFF-v1.0.0.txt',...qa.screenshots.map(x=>x.file),'seller/GUMROAD-LISTING.md','seller/RELEASE-CHECKLIST.md','seller/cover.html','seller/cover.png'];
for(const shot of qa.screenshots)if(sha(fs.readFileSync(path.join(root,shot.file)))!==shot.sha256)throw Error('Screenshot hash mismatch');
const folder=path.join(root,'release/stage/EduStart_UZ_RU_EN_v1.0.0');
if(fs.existsSync(folder))throw Error('Package stage exists: inspect rather than overwrite');
for(const file of selected){const dest=path.join(folder,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,file),dest);}
const manifest={product:'EduStart UZ/RU/EN',version:'1.0.0',price_usd:19,license:'one business, all three languages',technical_qa:'passed',review_state:'awaiting-independent-review',seller_terms:'Oybek confirms identity/support/refund before publication',published:false,files:selected.map(file=>{const b=fs.readFileSync(path.join(folder,file));return {file,bytes:b.length,sha256:sha(b)}})};
fs.writeFileSync(path.join(folder,'MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(root,'release/MANIFEST-v1.0.0.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({stage:folder,files:manifest.files.length+1,total_bytes:manifest.files.reduce((s,f)=>s+f.bytes,0)}));
