'use strict';
// Actual Chrome rendering and keyboard tests. No mocked layout or external navigation.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const {pathToFileURL} = require('node:url');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'docs/evidence-v1.0.0');
const origin='http://127.0.0.1:8765';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const langs={uz:'index.html',ru:'ru.html',en:'en.html'};
async function main(){
  const modulePath=process.env.EDUSTART_PUPPETEER_MODULE || 'C:/Users/Oybek/AppData/Local/npm-cache/_npx/ba38acecdf97096f/node_modules/chrome-devtools-mcp/build/src/third_party/index.js';
  const {puppeteer}=await import(pathToFileURL(modulePath).href);
  fs.mkdirSync(output,{recursive:true});
  const assets=Object.fromEntries(fs.readdirSync(path.join(root,'site')).map(f=>[f,hash(fs.readFileSync(path.join(root,'site',f)))]));
  const report={version:'1.0.0',date:'2026-10-04',started_at:new Date().toISOString(),engine:'Actual installed Chrome via Puppeteer bundled with chrome-devtools-mcp 1.10.1',assets,matrix:[],language_transitions:[],configured_contacts:[],screenshots:[],errors:[],review_state:'awaiting-independent-review',approval_by:null,published:false};
  let browser;
  try {
    browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,pipe:true,args:['--window-position=-32000,-32000'],timeout:30000});
    report.browser=await browser.version();
    const page=await browser.newPage();
    let fixture=null,errors=[],failed=[],httpErrors=[],outbound=[];
    await page.setRequestInterception(true);
    page.on('request',req=>{
      if(!req.url().startsWith(origin+'/')&&!req.url().startsWith('data:')){outbound.push(req.url());return req.abort();}
      if(fixture&&req.url()===origin+'/config.js')return req.respond({status:200,contentType:'text/javascript',body:'window.EDUSTART='+JSON.stringify(fixture)+';'});
      return req.continue();
    });
    page.on('pageerror',err=>errors.push(String(err)));
    page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
    page.on('requestfailed',req=>failed.push({url:req.url(),failure:req.failure()}));
    page.on('response',res=>{if(res.status()>=400)httpErrors.push({url:res.url(),status:res.status()});});
    async function reset(file){errors=[];failed=[];httpErrors=[];outbound=[];await page.goto(origin+'/'+file,{waitUntil:'networkidle0',timeout:20000});}
    async function shot(name,fullPage=true){
      await page.evaluate(()=>{document.activeElement?.blur();scrollTo({top:0,behavior:'instant'});});
      const bytes=Buffer.from(await page.screenshot({type:'png',fullPage}));
      assert.ok(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
      fs.writeFileSync(path.join(output,name),bytes);
      report.screenshots.push({file:'docs/evidence-v1.0.0/'+name,sha256:hash(bytes),bytes:bytes.length});
    }
    for(const [lang,file] of Object.entries(langs))for(const width of [360,375,390,768,1440]){
      fixture=null;
      await page.setViewport({width,height:900,deviceScaleFactor:1});
      await reset(file);
      const row=await page.evaluate(()=>({lang:document.documentElement.lang,width:innerWidth,client_width:document.documentElement.clientWidth,scroll_width:document.documentElement.scrollWidth,sections:[...document.querySelectorAll('main section')].map(s=>({id:s.id,width:s.getBoundingClientRect().width,height:s.getBoundingClientRect().height})),mobile:getComputedStyle(document.querySelector('.menu-toggle')).display!=='none',config:window.EDUSTART}));
      assert.equal(row.lang,lang);assert.equal(row.width,width);assert.equal(row.sections.length,7);assert.ok(row.scroll_width<=row.client_width);
      assert.equal(row.config.demo,true);assert.equal(row.config.telegram,'');assert.equal(row.config.phone,'');assert.equal(row.config.map,'');
      row.menu='desktop-visible';
      if(row.mobile){
        await page.focus('.menu-toggle');await page.keyboard.press('Enter');
        assert.equal(await page.$eval('.menu-toggle',m=>m.getAttribute('aria-expanded')),'true');
        await page.click('.menu-toggle');
        assert.equal(await page.$eval('.menu-toggle',m=>m.getAttribute('aria-expanded')),'false');
        await page.click('.menu-toggle');await page.focus('#navigation a');await page.keyboard.press('Escape');
        assert.ok(await page.evaluate(()=>document.activeElement===document.querySelector('.menu-toggle')&&document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false'));
        await page.click('.menu-toggle');await page.click('#navigation a');
        assert.ok(await page.evaluate(()=>getComputedStyle(document.querySelector('#navigation')).display==='none'&&!document.querySelector('#navigation').contains(document.activeElement)));
        row.menu='PASS: Enter/open, toggle/close, Escape/focus-return, link-close/no-hidden-focus';
      } else assert.notEqual(await page.$eval('#navigation',n=>getComputedStyle(n).display),'none');
      row.faq=[];
      for(let i=0;i<4;i++){
        const selector='.faq-list details:nth-child('+(i+1)+')';
        await page.focus(selector+' summary');await page.keyboard.press('Enter');assert.equal(await page.$eval(selector,d=>d.open),true);
        await page.keyboard.press('Space');assert.equal(await page.$eval(selector,d=>d.open),false);row.faq.push('PASS: Enter/open, Space/close');
      }
      row.demo=[];
      for(const kind of ['telegram','phone','map']){
        await page.click('[data-contact='+kind+']');assert.equal(await page.$eval('dialog',d=>d.open),true);
        assert.ok(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));
        await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));
        await page.keyboard.down('Shift');await page.keyboard.press('Tab');await page.keyboard.up('Shift');assert.ok(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));
        if(kind==='phone')await page.keyboard.press('Enter');else await page.keyboard.press('Escape');
        assert.equal(await page.$eval('dialog',d=>d.open),false);
        assert.equal(await page.evaluate(()=>document.activeElement.dataset.contact),kind);
        assert.ok(page.url().startsWith(origin+'/'));
        row.demo.push({kind,status:'PASS: open, Tab/Shift+Tab containment, close, focus-return; no external navigation'});
      }
      for(const [target,targetFile] of Object.entries(langs))if(target!==lang){
        await page.focus('.language[lang='+target+']');
        await Promise.all([page.waitForNavigation({waitUntil:'networkidle0'}),page.keyboard.press('Enter')]);
        assert.equal(await page.evaluate(()=>document.documentElement.lang),target);
        assert.equal(new URL(page.url()).pathname,'/'+targetFile);
        report.language_transitions.push({width,from:lang,to:target,status:'PASS: keyboard Enter navigation'});
        await reset(file);
      }
      row.language_switch='PASS: both other languages, actual keyboard navigation';
      row.console_errors=[...errors];row.failed_requests=[...failed];row.http_errors=[...httpErrors];row.outbound_requests=[...outbound];
      assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(httpErrors,[]);assert.deepEqual(outbound,[]);
      const final=await page.evaluate(()=>({client_width:document.documentElement.clientWidth,scroll_width:document.documentElement.scrollWidth}));
      assert.ok(final.scroll_width<=final.client_width);row.final_dimensions=final;
      await shot(lang+'-'+width+'.png');row.screenshot='docs/evidence-v1.0.0/'+lang+'-'+width+'.png';
      if(width===375){
        await page.click('.menu-toggle');await shot(lang+'-menu-375.png',false);await page.keyboard.press('Escape');
        await page.click('[data-contact=telegram]');await shot(lang+'-dialog-375.png',false);await page.keyboard.press('Escape');
      }
      report.matrix.push(row);
      fs.writeFileSync(path.join(root,'docs/QA-v1.0.0.json'),JSON.stringify(report,null,2)+'\n');
      console.log(lang+'/'+width+' PASS; genuine screenshot saved');
      // A fresh intercepted public test config. Never click configured contacts.
      for(const valid of [true,false]){
        fixture={brand:'QA fixture',demo:false,telegram:valid?'edustart_qa':'@bad',phone:valid?'+998900000000':'123',map:valid?'https://example.com/map':'javascript:alert(1)',address:{[lang]:'QA address '+lang},hours:{[lang]:'QA hours '+lang}};
        await reset(file);
        const links=await page.evaluate(()=>({hidden:[...document.querySelectorAll('[data-demo]')].every(e=>e.hidden),address:document.querySelector('[data-address]').textContent,hours:document.querySelector('[data-hours]').textContent,links:[...document.querySelectorAll('[data-contact]')].map(a=>({kind:a.dataset.contact,href:a.getAttribute('href'),target:a.target,rel:a.rel}))}));
        assert.equal(links.hidden,true);assert.equal(links.address,'QA address '+lang);assert.equal(links.hours,'QA hours '+lang);
        for(const a of links.links){const expected=valid?({telegram:'https://t.me/edustart_qa',phone:'tel:+998900000000',map:'https://example.com/map'}[a.kind]):'#contact';assert.equal(a.href,expected);if(valid&&a.kind!=='phone'){assert.equal(a.target,'_blank');assert.ok(a.rel.includes('noopener')&&a.rel.includes('noreferrer'));}}
        assert.deepEqual(errors,[]);assert.deepEqual(httpErrors,[]);assert.deepEqual(outbound,[]);
        report.configured_contacts.push({lang,width,valid,status:'PASS: href/target/rel, localized address/hours, demo banners hidden',...links});
      }
    }
    fixture=null;await reset('en.html');
    report.status='passed';report.finished_at=new Date().toISOString();
    report.limitations=['One installed Chrome engine only; Firefox/Safari and real touch hardware not tested.','Visual regression has no previously approved baseline; independent visual acceptance remains pending.','No screen-reader certification or performance/CWV claim.','Seller identity/support/refund decisions remain with Oybek.'];
    assert.equal(report.matrix.length,15);assert.equal(report.language_transitions.length,30);assert.equal(report.configured_contacts.length,30);
    for(const [file,sha]of Object.entries(assets))assert.equal(hash(fs.readFileSync(path.join(root,'site',file))),sha,'Source changed: '+file);
  }catch(error){report.status='blocked';report.errors.push(String(error.stack||error));process.exitCode=1;}
  finally{if(browser)await browser.close();fs.writeFileSync(path.join(root,'docs/QA-v1.0.0.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,matrix:report.matrix.length,transitions:report.language_transitions.length,screenshots:report.screenshots.length,errors:report.errors}));}
}
main().catch(e=>{console.error(e);process.exitCode=1});
