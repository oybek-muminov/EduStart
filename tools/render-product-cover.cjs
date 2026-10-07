'use strict';
const fs=require('node:fs');const path=require('node:path');const {pathToFileURL}=require('node:url');
async function main(){
 const root=path.resolve(__dirname,'..');
 const {puppeteer}=await import(pathToFileURL('C:/Users/Oybek/AppData/Local/npm-cache/_npx/ba38acecdf97096f/node_modules/chrome-devtools-mcp/build/src/third_party/index.js').href);
 const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--window-position=-32000,-32000']});
 try{const page=await browser.newPage();await page.setViewport({width:1280,height:720,deviceScaleFactor:1});await page.setRequestInterception(true);page.on('request',r=>r.url().startsWith('data:')?r.continue():r.abort());let html=fs.readFileSync(path.join(root,'seller/cover.html'),'utf8');html=html.replace('../docs/evidence-v1.0.0/en-1440.png','data:image/png;base64,'+fs.readFileSync(path.join(root,'docs/evidence-v1.0.0/en-1440.png')).toString('base64'));await page.setContent(html,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);const png=await page.screenshot({type:'png'});fs.writeFileSync(path.join(root,'seller/cover.png'),png);console.log('Actual template cover: 1280x720 PNG saved.');}finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
