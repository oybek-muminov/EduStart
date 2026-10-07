'use strict';
// Uses ONLY the short-lived upload ticket issued by the connected Notion tool.
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
async function upload(relative,ticket){
 if(!/^(release|docs|seller)\/[a-zA-Z0-9_.\/-]+$/.test(relative||'')||relative.split('/').includes('..'))throw Error('Outside product artifacts');
 const url=new URL(ticket.upload_url);if(url.protocol!=='https:'||!['app.notion.com','api.notion.com','www.notion.so'].includes(url.hostname))throw Error('Unexpected upload origin');
 const bytes=fs.readFileSync(path.join(root,relative));
 const form=new FormData();form.append('file',new Blob([bytes],{type:ticket.content_type}),ticket.filename);
 // Exactly one POST; no retry on unknown outcome. Caller reconciles pending status first.
 const response=await fetch(url,{method:'POST',headers:ticket.upload_headers,body:form,signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error('Upload HTTP '+response.status+'; reconcile before retry');
 const data=await response.json();
 const record={file:relative,name:ticket.filename,file_upload_id:data.file_upload_id||ticket.file_upload_id,source:data.markdown_source||'file-upload://'+ticket.file_upload_id,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),readback_verified:false};
 fs.mkdirSync(path.join(root,'.automation/product-uploads'),{recursive:true});
 fs.writeFileSync(path.join(root,'.automation/product-uploads',record.file_upload_id+'.json'),JSON.stringify(record,null,2)+'\n');
 console.log(JSON.stringify(record));
}
async function main(){
 if(process.argv[2]==='--queue'){
  const queue=JSON.parse(fs.readFileSync(path.join(root,'.automation/product-upload-queue.json'),'utf8'));
  for(const item of queue){const record=path.join(root,'.automation/product-uploads',item.ticket.file_upload_id+'.json');if(fs.existsSync(record)){console.log(JSON.stringify({skipped_uploaded:item.file}));continue;}await upload(item.file,item.ticket);}
 }else await upload(process.argv[2],JSON.parse(fs.readFileSync(path.join(root,'.automation/product-upload-ticket.json'),'utf8')));
}
main().catch(e=>{console.error(JSON.stringify({error:e.message,code:e.cause?.code,details:e.cause?.errors?.map(x=>({code:x.code,message:x.message}))}));process.exitCode=1;});
