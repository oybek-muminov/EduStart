'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const qa=JSON.parse(fs.readFileSync(path.join(root,'docs/QA-v1.0.0.json'),'utf8'));
if(qa.status!=='passed'||qa.matrix.length!==15)throw Error('Full browser QA gate has not passed');
const docs={
 'START-HERE.md':`# EduStart UZ/RU/EN — v1.0.0
2026-10-04. Uch tilli, 7 bo‘limli HTML/CSS/JS shablon.

Oching: site/index.html (UZ), site/ru.html (RU), site/en.html (EN).
Yo‘riqnomalar: docs/README_UZ.md, docs/README_RU.md, docs/README_EN.md.
Build, npm yoki backend kerak emas; site/ ichidagi barcha 7 fayl birgalikda tarqatiladi.
Sukutdagi config: demo=true, kontaktlar bo‘sh. Demo hech kimga murojaat yubormaydi.

Chrome brauzer QA: uch til × 360/375/390/768/1440 CSS px; 15 qator,
30 haqiqiy til o‘tishi va 30 sozlangan/yaroqsiz kontakt sinovi o‘tdi.
Hisobot: docs/QA-v1.0.0.md va .json; haqiqiy PNGlar docs/evidence-v1.0.0/ ichida.
Bu bitta Chrome dvigateli sinovi; Firefox/Safari yoki ekran o‘quvchi sertifikati emas.

Narx: $19, bitta biznes uchun. Mahalliy moslashtirish: 690 000 so‘m,
60 daqiqagacha, haftasiga ko‘pi bilan bitta. Domen/hosting alohida.

Nashrdan oldin: mustaqil tekshiruvchi manbalar, QA va rasmlarni ko‘rib chiqadi.
Oybek sotuvchi shaxsi, support aloqa manzili va refund/support shartlarini belgilaydi,
docs/LICENSE.txt va sotuv tavsifini tasdiqlaydi; keyin Gumroadga o‘zi yuklaydi.
Nashr qilinmagan. Jadval yoqilmagan. seller/RELEASE-CHECKLIST.md ga qarang.
`,
 'docs/README_UZ.md':`# EduStart UZ/RU/EN — sozlash
Versiya 1.0.0, 2026-10-04. Bir sahifali responsive shablon, har tilda ayni 7 bo‘lim.

## Boshlash
ZIPni oching va site/index.html ni brauzerda oching. UZ/RU/EN havolalari uchala
sahifada bor. HTML, CSS va JSni oddiy matn muharririda tahrirlash mumkin.
docs/COPY_UZ_RU_EN.json matnlar ma’lumotnomasi; HTML uni avtomatik o‘qimaydi.

## Biznesga moslash
1. site/config.js: brand, telegram (@siz username), phone (xalqaro + format,
bo‘shliqsiz), map (to‘liq HTTPS URL), address.uz/ru/en va hours.uz/ru/en.
Bu fayl ommaviy: parol, API key yoki maxfiy ma’lumot kiritmang.
2. Uchala HTMLdagi kurs, ustoz, jadval, FAQ, title va meta descriptionni bir xil
mazmunda yangilang. brand title/metani avtomatik o‘zgartirmaydi. Namuna ustoz
profilini haqiqiy tekshirilgan ma’lumot va foydalanishga ruxsatli rasm bilan almashtiring.
3. Ranglar styles.css :root qismida. Namuna matnlarni va demo ogohlantirishlarini
tekshirgach demo:false qo‘ying. Bo‘sh/yaroqsiz kontaktlar tushuntirish oynasini ochadi.
4. site/ ichidagi barcha 7 faylni hostingning bitta asosiy katalogiga yuklang.
index.html boshlang‘ich sahifa. HTTPS hosting va domenni alohida tanlaysiz.
5. Jonli saytda uch til, mobil menyu, FAQ, klaviatura, Telegram/telefon/xaritani
o‘zingiz tekshiring. Tugma chat/telefon/xarita ilovasini ochishi mumkin; avtomatik xabar yubormaydi.

## Tarkib va tekshiruv
Sayt: index.html, ru.html, en.html, styles.css, app.js, config.js, favicon.svg.
UZ/RU/EN yo‘riqnomalar, matnlar JSONi, bir biznes litsenziyasi, QA/dalillar va
sotuvchi tavsif/muqova/previewlar paket ichida. Chrome 15 o‘lcham/til sinovi o‘tdi;
aniq natija QA-v1.0.0.md da. Xaridor moslashtirgach yana tekshiradi.

Backend, to‘lov, CRM, ariza saqlash, analytics, domen/hosting va uzluksiz texnik
xizmat kiritilmagan. JavaScript o‘chirilganda matn/til/FAQ o‘qiladi, kontakt
konfiguratsiyasi uchun JS kerak. Surat/shrift/kutubxona tashqaridan yuklanmaydi.
Litsenziya bitta biznes; ikkinchi biznesga alohida xarid kerak.
`,
 'docs/README_RU.md':`# EduStart UZ/RU/EN — настройка
Версия 1.0.0, 4 октября 2026. Семь одинаковых разделов на трёх языках.

1. Распакуйте ZIP, откройте site/index.html. Переключатели UZ/RU/EN доступны
на каждой странице. Сборка, npm и серверная часть не требуются.
2. В site/config.js укажите brand, telegram (имя без @), phone (международный
номер с +, без пробелов), map (полная HTTPS-ссылка), address.uz/ru/en и hours.uz/ru/en.
Файл публичный: не добавляйте пароли и ключи API.
3. Отредактируйте ВСЕ ТРИ HTML-файла: курсы, преподавателей, расписание, FAQ,
title и meta description. brand не меняет title автоматически. Замените
демонстрационный профиль реальными проверенными сведениями и разрешённым фото.
docs/COPY_UZ_RU_EN.json — справочник; HTML не загружает его автоматически.
4. Цвета задаются в :root файла styles.css. После замены всех примеров установите
demo:false. Пустой или неверный контакт продолжит открывать поясняющий диалог.
5. Загрузите все 7 файлов site/ в один корневой каталог статического HTTPS-хостинга.
Домен и хостинг приобретаются отдельно. Проверьте три языка, меню, FAQ, клавиатуру
и реальные ссылки. Telegram открывает чат, а не отправляет сообщение автоматически.

Chrome QA: 3 языка × 360/375/390/768/1440 px, 15 строк, без горизонтального overflow.
Подробности и ограничения: QA-v1.0.0.md/.json; PNG: evidence-v1.0.0/.
Firefox/Safari и программы чтения с экрана не сертифицированы.

Это HTML-шаблон, не тема WordPress/Framer/Webflow. CRM, приём платежей,
хранение заявок, аналитика, установка и постоянное сопровождение не включены.
Для настройки контактных ссылок нужен JavaScript. Одна покупка — один бизнес.
`,
 'docs/README_EN.md':`# EduStart UZ/RU/EN — setup
Version 1.0.0, 4 October 2026. Seven matching sections in Uzbek, Russian and English.

1. Extract the ZIP and open site/index.html, site/ru.html or site/en.html.
No build, npm, framework or backend is required. Use the UZ/RU/EN links on each page.
2. Edit site/config.js: brand, telegram (username without @), phone (international
number starting with +, no spaces), map (full HTTPS URL), address.uz/ru/en and
hours.uz/ru/en. This public file must never contain passwords or API keys.
3. Update ALL THREE HTML files: courses, teacher profile, schedule, FAQ, title and
meta description. brand does not automatically update page titles. Replace sample
profiles with verified information and images you are licensed to use.
docs/COPY_UZ_RU_EN.json is a reference; the pages do not load it at runtime.
4. Change colors in styles.css :root. Set demo:false only after replacing samples.
Blank or invalid contacts keep showing the explanatory dialog.
5. Upload all 7 files in site/ together to the root folder of your static HTTPS
hosting. Domain and hosting are separate. Test all pages and links after deployment.
Telegram opens a chat; the template does not send messages automatically.

Actual Chrome QA passed at 360/375/390/768/1440 CSS px in all three languages.
See QA-v1.0.0.md/.json and evidence-v1.0.0/. Firefox/Safari, screen readers and
performance certification were not tested. Recheck after customization.

No CRM, payments, stored enquiry forms, analytics, installation or ongoing
maintenance is included. Contact configuration requires JavaScript. One purchase
licenses one business website, including one client business; see LICENSE.txt.
`,
 'seller/GUMROAD-LISTING.md':`# Gumroad listing — EduStart UZ/RU/EN v1.0.0
Holat: texnik materiallar ko‘rib chiqishga tayyor. Mustaqil tekshiruv va Oybekning
sotuvchi/support/refund qarori kutiladi. Hali nashr qilinmagan.

**Title:** EduStart UZ/RU/EN — English & IELTS Center HTML Website Template
**Price:** $19
**Short description:** A trilingual Uzbek–Russian–English, seven-section responsive
HTML/CSS/JS template for English language and IELTS centers. No build tools required.

## Product description (English)
Give your education center a clear starting point online. EduStart includes matching
Uzbek, Russian and English pages with seven sections: introduction, courses,
teaching approach, teacher profile, enrollment steps, FAQ and contact information.

Includes editable HTML/CSS/JS source, mobile navigation, language selection,
keyboard-friendly FAQ and demo dialog, a replaceable favicon, public business
configuration, setup guides in three languages and a single-business license.
Set Telegram, phone, HTTPS map, address and hours in config.js. Edit all three
HTML pages to keep your course and teacher information consistent.

The template ships in demo mode with blank contacts. Sample courses and the
illustrated teacher profile must be replaced with your own verified content.
Actual Chrome tests cover all three pages at five widths; screenshots and the
QA report are included. No Firefox/Safari or screen-reader certification is claimed.

This is a static HTML template, not a WordPress theme or Framer/Webflow project.
Domain, hosting, installation, CRM, payments, stored enquiry forms, analytics and
ongoing maintenance are not included. Basic HTML editing is useful. No guaranteed
enrollments, IELTS scores, revenue or search rankings are promised.

License: one business website per purchase, including one client. You may deploy
all three included languages for that business. Reselling or redistributing the
template is prohibited. A second business requires a separate purchase.

## O‘zbekcha qisqa matn
EduStart UZ/RU/EN — ingliz tili va IELTS markazlari uchun 7 bo‘limli responsive
HTML/CSS/JS shablon. O‘zbek, rus va ingliz sahifalari, mobil menyu, FAQ, sozlanadigan
Telegram, telefon va xarita havolalari. $19, bitta biznes uchun litsenziya.
Domen, hosting va o‘rnatish alohida.

## Кратко по-русски
EduStart UZ/RU/EN — адаптивный HTML/CSS/JS-шаблон для центра английского языка
и IELTS. Семь разделов на узбекском, русском и английском, мобильное меню, FAQ,
настраиваемые ссылки Telegram, телефон и карта. $19, лицензия на один бизнес.
Домен, хостинг и установка отдельно.

## Mahalliy moslashtirish
690 000 so‘m: bitta markazning tayyor matn, logo va kontaktlarini kiritish hamda
asosiy ranglarni moslash. 60 daqiqagacha, haftasiga ko‘pi bilan bitta buyurtma.
Domen/hosting alohida. Yangi sahifa/funksiya, professional tarjima yoki qo‘shimcha
tuzatishlar hajmi alohida kelishiladi.

## Oybek nashrdan oldin to‘ldiradi
Sotuvchi nomi va support aloqa manzili; support hajmi/muddati va refund shartlari.
Ular bu paketda o‘ylab topilmagan. RELEASE-CHECKLIST.md ni bajaring.
`,
 'seller/RELEASE-CHECKLIST.md':`# Oybek uchun nashr — 10–15 daqiqa
1. Mustaqil nazoratchi 02–06 vazifalardagi fayllar, QA, litsenziya va previewlarni
tekshirganini tasdiqlang. Ijrochi o‘z ishini yakuniy tasdiqlamaydi.
2. LICENSE.txt ni ko‘rib chiqing: bir biznes, uch til. Sotuvchi shaxsi, support
aloqa manzili/hajmi va refund shartlarini listingda belgilang. Ularni o‘ylab topmadik.
3. Paket SHA256 va tarkib ro‘yxatini tekshiring. ZIPdagi demo kontaktlar bo‘sh
ekanini va uch til mavjudligini tekshiring.
4. Gumroad mahsulotiga title/description, $19, ZIP, cover.png va haqiqiy previewlarni
yuklang. Xaridor ko‘radigan fayl va matnni oxirgi marta tekshiring.
5. Faqat o‘z qaroringizdan keyin nashr qiling. Haqiqiy mahsulot URLini Notionga
yozing; savdo va trafik ko‘rsatkichlarini faqat ular amalda kelganda qayd eting.
Bu fayl Gumroadda nashr qilmaydi va ijtimoiy tarmoqqa xabar yubormaydi.
`
};
for(const [name,text]of Object.entries(docs))fs.writeFileSync(path.join(root,name),text);
const old=fs.readFileSync(path.join(root,'docs/LICENSE-DRAFT.txt'),'utf8');
const license=old.replace('Version 0.1, 3 October 2026','Version 1.0.0, 4 October 2026').replace('both included language versions','all three included language versions (Uzbek, Russian and English)');
fs.writeFileSync(path.join(root,'docs/LICENSE.txt'),license);
const lines=['# EduStart UZ/RU/EN — haqiqiy brauzer QA, v1.0.0','', 'Sana: 2026-10-04. Ijrochi: Codex+ECC. Yakuniy inson tasdig‘i berilmagan.', '', 'Brauzer: '+qa.browser+'; o‘rnatilgan Chrome, alohida headless sessiya. Mock/sintetik layout yo‘q.', '', '| Til | CSS kenglik | client/scroll | Menyu | FAQ/klaviatura | Demo/dialog | Til o‘tishi | Konsol/HTTP |', '|---|---:|---|---|---|---|---|---|',...qa.matrix.map(r=>'| '+r.lang+' | '+r.width+' | '+r.final_dimensions.client_width+'/'+r.final_dimensions.scroll_width+' | PASS | PASS | PASS | PASS | 0 xato |'),'','30 haqiqiy til o‘tishi va 30 valid/invalid config sinovi o‘tdi.','Kontakt href/target/rel tekshirildi, sozlangan tashqi havolalar ochilmadi.','Har tilda address/hours konfiguratsiyasi tekshirildi; demo tarqatish konfiguratsiyasi o‘zgarmagan.','','Tuzatishlar: mobil menyudan Escape chiqqanda fokus togglega qaytadi; link-close yashirin fokus qoldirmaydi; demo dialogida Tab/Shift+Tab fokus chegarasi saqlanadi.','Haqiqiy PNG: 15 full-page, 3 mobile menu, 3 dialog. SHA256 JSON hisobotida.','','Chegaralar: Firefox/Safari, haqiqiy touch qurilma, ekran o‘quvchi va CWV sinovi bajarilmagan.','Tasdiqlangan eski vizual baseline yo‘q; regressiya solishtiruvi INCONCLUSIVE.','Texnik mezonlar PASS; mustaqil vizual va sotuvchi shartlari ko‘rib chiqilishi kutiladi.',''];
fs.writeFileSync(path.join(root,'docs/QA-v1.0.0.md'),lines.join('\n'));
console.log('Trilingual docs/listing/license and QA summary finalized for independent review.');
