'use strict';
// One-off precise extension of the existing template. No second localization engine.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
if (fs.existsSync(path.join(root,'site/en.html'))) throw new Error('One-off extension already applied. Read the existing trilingual source; do not regenerate it.');
const copy = JSON.parse(fs.readFileSync(path.join(root,'docs/COPY_UZ_RU.json'),'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(root,'docs/COPY_EN.json'),'utf8'));
const pairs=[];
function walk(a,b) {
  if (typeof a==='string') { assert.equal(typeof b,'string'); pairs.push([a,b]); return; }
  assert.deepEqual(Object.keys(a),Object.keys(b));
  for(const key of Object.keys(a)) walk(a[key],b[key]);
}
walk(copy.uz,en);
let html=fs.readFileSync(path.join(root,'site/index.html'),'utf8');
pairs.push(['Asosiy menyu','Main navigation'],['Yuqoriga','Back to top'],['Aloqa tugmalari uchun JavaScript yoqilgan bo‘lishi kerak.','Enable JavaScript to use the contact buttons.'],['01 / KURSLAR','01 / COURSES'],['02 / YONDASHUV','02 / APPROACH'],['03 / JAMOA','03 / TEAM'],['04 / JARAYON','04 / STEPS'],['06 / ALOQA','06 / CONTACT']);
for(const [source,target] of pairs.sort((a,b)=>b[0].length-a[0].length)) html=html.split(source).join(target);
html=html.replace('<html lang="uz">','<html lang="en">');
const langs=[['uz','index.html','UZ',"O‘zbekcha"],['ru','ru.html','RU','Русский'],['en','en.html','EN','English']];
function links(lang){return '<div class="language-switch" role="group" aria-label="'+({uz:'Tilni tanlash',ru:'Выбор языка',en:'Choose language'}[lang])+'">'+langs.map(([l,file,label,name])=>'<a class="language" href="'+file+'" lang="'+l+'" hreflang="'+l+'" aria-label="'+name+'"'+(lang===l?' aria-current="page"':'')+'>'+label+'</a>').join('')+'</div>';}
for(const [lang,file] of langs){
  let page=lang==='en'?html:fs.readFileSync(path.join(root,'site',file),'utf8');
  page=page.replace(/<a class="language"[^>]*>[^<]*<\/a>/,links(lang));
  fs.writeFileSync(path.join(root,'site',file),page);
}
copy.en=en;
fs.writeFileSync(path.join(root,'docs/COPY_UZ_RU_EN.json'),JSON.stringify(copy,null,2)+'\n');
console.log('Added EN; original UZ/RU copy preserved. 3 matching locale key structures.');
