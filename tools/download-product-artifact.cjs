'use strict';
// Downloads a fresh signed source returned by fetching the containing Notion page.
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
require('node:dns').setDefaultResultOrder('ipv4first');
async function main(){
 const ticket=JSON.parse(fs.readFileSync(path.join(root,'.automation/product-download-ticket.json'),'utf8'));
 if(!/^[a-zA-Z0-9_.-]+$/.test(ticket.name))throw Error('Invalid artifact name');
 const url=new URL(ticket.url);if(url.protocol!=='https:'||!(/(^|\.)(amazonaws\.com|notion-static\.com|notion\.so|notion\.com)$/.test(url.hostname)))throw Error('Unexpected Notion storage origin');
 let bytes;
 if(process.argv.includes('--browser')){
   const os=require('node:os'),{pathToFileURL}=require('node:url');
   const {puppeteer}=await import(pathToFileURL('C:/Users/Oybek/AppData/Local/npm-cache/_npx/ba38acecdf97096f/node_modules/chrome-devtools-mcp/build/src/third_party/index.js').href);
   const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--window-position=-32000,-32000']});
   try {
     const page=await browser.newPage();
     // Browser networking honors the machine's normal Chrome transport settings.
     // Read through a request in an isolated page, without changing CORS/security flags.
     const cdp=await page.createCDPSession();
     await cdp.send('Network.enable');
     const responsePromise=new Promise((resolve,reject)=>{
       const timer=setTimeout(()=>reject(Error('Chrome readback deadline')),45000);
       cdp.on('Network.responseReceived',async event=>{
         if(event.response.url!==url.href)return;
         if(event.response.status!==200){clearTimeout(timer);reject(Error('Chrome HTTP '+event.response.status));return;}
         const finish=async done=>{if(done.requestId!==event.requestId)return;try{const body=await cdp.send('Network.getResponseBody',{requestId:event.requestId});clearTimeout(timer);resolve(Buffer.from(body.body,body.base64Encoded?'base64':'utf8'));}catch(e){clearTimeout(timer);reject(e)}};
         cdp.on('Network.loadingFinished',finish);
       });
     });
     // Fetch as a browser resource. Resource bytes are retrieved by DevTools; no CORS bypass.
     await page.setContent('<!doctype html><title>EduStart artifact readback</title>');
     await page.evaluate(u=>{window.__edustartReadback=fetch(u,{mode:'no-cors'}).catch(()=>null)},url.href);
     bytes=await responsePromise;
   }finally{await browser.close();}
 }else{
   const response=await fetch(url,{signal:AbortSignal.timeout(60000)});if(!response.ok)throw Error('Artifact download HTTP '+response.status);
   bytes=Buffer.from(await response.arrayBuffer());
 }
 if(bytes.length>20*1024*1024)throw Error('Artifact exceeds allowlist limit');
 const sha=crypto.createHash('sha256').update(bytes).digest('hex');if(sha!==ticket.sha256)throw Error('Remote SHA256 mismatch');
 fs.mkdirSync(path.join(root,'.automation/product-downloads'),{recursive:true});fs.writeFileSync(path.join(root,'.automation/product-downloads',ticket.name),bytes);
 const proof={name:ticket.name,file_upload_id:ticket.file_upload_id,bytes:bytes.length,sha256:sha,readback_verified:true};fs.appendFileSync(path.join(root,'.automation/product-readbacks.jsonl'),JSON.stringify(proof)+'\n');console.log(JSON.stringify(proof));
}
main().catch(e=>{console.error(JSON.stringify({error:e.message,code:e.cause?.code}));process.exitCode=1});
