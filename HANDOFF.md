# EduStart UZ/RU/EN — keyingi sessiyaga topshirish

## 2026-10-07 — 05 paket tuzatishi, v1.0.1

Foydalanuvchi Notion vazifalari va `oybek-muminov/EduStart` ni solishtirib,
05-vazifani davom ettirishni so‘radi. Quyidagi pauza qaydi tarixiy.
GitHub boshlang‘ich commit: `d580c3dfda95f098f0bdb359f302d215e878624e`.
Ish alohida `codex/edustart-task05-package` branch/worktreeda bajarildi;
asosiy ishchi papkadagi avvalgi automation o‘zgarishlari saqlandi.

### Notion va GitHub farqi

Notionning amaldagi holati: 01–04 Bajarildi; 05 Toʻsiq bor; 06 Tasdiq kutilmoqda;
07 Rejada. 4-oktabrdagi mustaqil tekshiruv S3 readback to‘sig‘ini yechgan,
7 sayt manbasi, oldingi Chrome QA va 21 screenshotni qabul qilgan.
GitHub HANDOFF/DELIVERY eski readback/to‘siq holatini tarix sifatida saqlaydi.
Haqiqiy qolgan 05 xatosi: v1.0.0 ZIPdagi barcha 44 raw entry yo‘li Windows
backslash bilan. Eski verifier ularni normalizatsiya qilib xatoni yashirgan.
START-HERE xaridorga ichki tekshiruv va nashr jarayonini aytgan.

### Paket tuzatishi

- v1.0.0 ZIP/stage/manifest/dalillar saqlandi; yangi paket v1.0.1.
- ZIP builder dependency talab qilmaydi, POSIX yo‘llar va barqaror metadata bilan yig‘adi.
- Verifier raw central/local yo‘llarni tekshiradi; backslash, noto‘g‘ri yo‘l,
  takroriy nom, CRC/manifest yoki local/central nom tafovutini rad etadi.
- START-HERE uch tilda xaridor uchun ochish, config, hosting va litsenziyani tushuntiradi.
  Ichki nazorat/nashr seller/RELEASE-CHECKLIST.md ga ko‘chirildi.
- UZ/RU/EN README va listing paket 1.0.1 / sayt+QA 1.0.0 farqini ko‘rsatadi.
  Muqovadagi v1.0.0 — o‘zgarmagan haqiqiy sayt previewining versiyasi.
- 7 sayt fayli, QA MD/JSON, 21 PNG, muqova va LICENSE.txt baytlari o‘zgarmagan.
  Yangi brauzer QA bajarilgani da’vo qilinmaydi. Litsenziya sotuvchi loyihasi;
  sotuvchi/support/refund bo‘yicha yangi shart o‘ylab topilmadi.

### Tekshirish va topshirish

```sh
node tools/product-package.test.cjs
node tools/prepare-product-package.cjs
node tools/verify-product-zip.cjs
python tools/verify-product-extraction.py
```

Paket: 44 fayl, 3 645 902 bayt. SHA256:
`9a7bfb81c52248301be0f5edc8ed5f854251a2b8ff5e57deb4e9b177c5812be1`.
Amaldagi tekshiruv hisoboti: `release/ZIP-VERIFIED-v1.0.1.json`.
10 ta paket regressiya testi PASS; raw POSIX/local-central/CRC/manifest tekshiruvi PASS.
Oddiy Python extractall va unzip dalili: `release/EXTRACTION-VERIFIED-v1.0.1.json`.
Tarkib: `release/MANIFEST-v1.0.1.json`; sayt/dalil hashlar shu fayllarga bog‘langan.
Tashqi topshirish mavjud GitHub/Notion connectorlari va sozlangan GitHub CLI orqali
bajariladi. Tarmoq buyruqlari ruxsatli sandbox tarmoq rejimida bajariladi;
CLI credential yoki global tarmoq himoyasi o‘zgartirilmadi.

05 tuzatilgan ZIP va tekshiruv dalillari bilan Tasdiq kutilmoqda sifatida topshiriladi.
06 listing/preview versiya mosligi qayd etiladi. Keyingi navbat: mustaqil yakuniy
paket nazorati → Oybek 07 sotuvchi/support/refund/litsenziya → $19 Gumroad nashri.
Sotuvga tayyorlik yoki mustaqil tasdiq ijrochi nomidan belgilanmaydi.
Gumroad nashri va doimiy jadval yoqilmadi.

## Pauza — 2026-10-07 (Asia/Tashkent)

Foydalanuvchi talabi bilan ish xavfsiz nuqtada pauza qilindi. Yangi vazifa
boshlanmasin; davom ettirish faqat foydalanuvchining yangi ko‘rsatmasidan keyin.
Quyidagi eski qaydlar tarix va dalillar uchun saqlandi.

### Bajarilgan ishlar va tekshirilgan holat

- Sessiya boshida `main` ishchi daraxti toza, `origin/main` bilan teng edi.
  Oxirgi loyiha commit: `42442d2` (`update`); mahsulot o‘zgarishlari unda saqlangan.
- UZ/RU/EN v1.0.0 sayt, hujjatlar, oldingi haqiqiy Chrome QA dalillari, muqova
  va ZIP mavjud. Bu sessiyada yangi brauzer QA yoki Notion amali bajarilmadi.
- `node tools/verify-product-zip.cjs`: PASS; 44 fayl, CRC va manifest/stage
  baytlari mos. ZIP SHA256:
  `3ca77a6b62391864c1f66e94094d007b17003630cdc669d141908a6c66fce0db`.
- `node --test tools/automation/core.test.cjs tools/automation/site-qa.test.cjs`:
  9 testdan 8 PASS, 1 FAIL. Quyida sabab qayd etilgan.
- Loyiha nomi va QA/server/automation buyruqlari bo‘yicha Windows jarayonlari
  tekshirildi; mos faol node/codex/python/cmd jarayoni topilmadi.
  `schedule_enabled`, `reviewer_access_verified`, `qa_review_approved` — false.
  Runner/scheduler ishga tushirilmadi; lock/ledger va oldingi dalillar saqlandi.
- Git kuzatadigan maxfiy fayl nomlari va loyiha matnlarida token, private key,
  credential query hamda signed URL belgilari tekshirildi; mos qiymat topilmadi.
  Umumiy secret/password/API key so‘zlari faqat hujjatdagi ogohlantirishlarda.
  `.automation/` Git tomonidan e’tiborsiz qoldiriladi; mahalliy loglar qo‘shilmasin.

### Qolgan vazifalar va to‘siqlar

1. Eski automation auditini uch tilga moslashtirish kerak: `core.cjs` inventory
   ro‘yxatida `en.html` yo‘q. Shu sabab `index.html` va `ru.html`dagi EN havolalari
   auditni `blocked` qiladi va `core.test.cjs:47` testi yiqiladi. Pauza vaqtida
   tuzatilmadi; ushbu runnerni uch tilli mahsulotga avtomatik qo‘llamang.
2. Notiondagi ZIP/PNG binar fayllarining remote readback/hash tekshiruvi oldingi
   S3 timeout sabab tugamagan. Ruxsatli sessiyada mustaqil tekshirilsin;
   muvaffaqiyatli uploadni bayt tekshiruvi deb hisoblamang, qayta upload shart emas.
3. Mahsulot uchun mustaqil vizual/texnik tasdiq va tekshiruvchining Notionga
   kirishi hali tasdiqlanmagan. Oldingi smoke-2 lock/ledger holatini davom
   ettirishdan oldin reconcile qilish kerak; ko‘r-ko‘rona o‘chirmang.
4. Oybek seller identity, support/refund va litsenziya shartlarini yakunlab,
   tasdiqlangan paketni Gumroadga nashr qilishi qolgan. Nashr bajarilmagan.

### Git topshirish chegarasi

Ushbu sessiyadagi yangi o‘zgarish — HANDOFF.md pauza qaydi. Uni `main`ga
commit qilib `origin`ga push qilish foydalanuvchi tomonidan so‘ralgan.
Maxfiy qiymatlar, `.automation/` yoki lokal credential fayllari qo‘shilmasin.
Commit/push natijasi sessiyaning yakuniy javobida beriladi.

## Joriy mahsulot — v1.0.0, 2026-10-04

Avval Notion mahsulot kartasi va mavjud 02–07 vazifalar qayta o‘qildi. Yangi
talab UZ/RU/EN; eski UZ/RU hisobotlari EN uchun dalil hisoblanmadi. Boshlang‘ich
holat .automation/snapshots/before-trilingual-product.zip ichida saqlandi.

02: tabiiy EN 7 bo‘lim, menyu/CTA/FAQ/dialog/footer/title/meta/aria matnlari.
docs/COPY_EN.json va COPY_UZ_RU_EN.json tayyor. Eski UZ/RU JSON saqlangan.
03: mavjud dizayn saqlandi; site/en.html, uch til tanlovi, config address.en/hours.en.
Mobil menu Escape fokusini togglega qaytarish va dialog Tab/Shift+Tab fokus
chegarasi site/app.jsda tuzatildi. Asosiy sayt endi uch tilli v1.0.0.

04: **haqiqiy Chrome QA o‘tdi**. Chrome/154.0.8037.93, o‘rnatilgan Puppeteer
(chrome-devtools-mcp bundle) orqali alohida headless Chrome. Tashqi paket
o‘rnatilmadi, brauzer xavfsizlik flaglari o‘chirilmagan. UZ/RU/EN ×
360/375/390/768/1440 CSS px — 15 qator; 30 haqiqiy klaviatura til o‘tishi;
30 valid/invalid kontakt konfiguratsiyasi. Barcha FAQ Enter/Space, menu
toggle/link/Escape/fokus, dialog Tab/Shift+Tab/Enter/Escape, address/hours,
href/target/rel, konsol/HTTP va horizontal overflow tekshirildi. Xato yo‘q.
Hech kimga xabar/qo‘ng‘iroq yo‘q; sozlangan tashqi havolalar ochilmadi.
Tarqatiladigan config demo=true va bo‘sh kontaktlar. 21 genuine PNG:
docs/evidence-v1.0.0/; hisobot docs/QA-v1.0.0.md/.json, app diff alohida.
To‘liq Firefox/Safari, touch hardware, screen reader/CWV sertifikati yo‘q.
Eski tasdiqlangan vizual baseline yo‘q; mustaqil vizual qabul alohida.
QA harnessning birinchi Shift+Tab API xatosi tuzatildi; ikkinchi run o‘tdi.

05–06: START-HERE, UZ/RU/EN README, uch tilni qamragan bir biznes LICENSE.txt,
Gumroad listing, 1280×720 haqiqiy EN screenshotli cover.png va previewlar tayyor.
LICENSE.txt hali sotuvchi tasdig‘i uchun; seller identity/support/refund shartlari
o‘ylab topilmagan. Oybek 07 da belgilaydi. Narx $19; moslashtirish 690 000 so‘m,
60 daqiqagacha, haftasiga ko‘pi bilan bitta; domen/hosting alohida.

Yakuniy texnik paket: release/EduStart_UZ_RU_EN_v1.0.0.zip — 44 fayl, 3 253 356 bayt.
SHA256: 3ca77a6b62391864c1f66e94094d007b17003630cdc669d141908a6c66fce0db.
CRC, manifestdagi har fayl SHA256 va stage bayt mosligi PASS. Qa/site SHA256
mosligi tekshirildi. Bu ishlab chiqish tayyorligi, insonning yakuniy tasdig‘i emas.

### Notion yetkazilishi va aniq to‘siq

02–06 mavjud vazifalariga natijalar biriktirildi; dublikat vazifa yo‘q.
10 matn artifacti Notiondan qayta download qilinib aynan solishtirildi.
23 binar artifact: ZIP, 21 PNG, cover muvaffaqiyatli POST qilindi. 04 sahifada
21 native image; 06 da cover + EN1440/UZ375/RU768 preview; 05 da native ZIP.
Sahifalar qayta fetch qilinib mavjudligi tasdiqlandi. To‘liq metadata va file IDlar:
docs/DELIVERY-v1.0.0.json. Signed URL/ticket/loglar bu faylga kiritilmagan.

**Binar remote readback tugamadi:** Notion S3 sourceida 3 urinish timeout:
Node 30s; IPv4-first 60s; normal Chrome transport 45s. remote_readback_verified=false.
Upload/link mavjudligi content verification deb olinmadi. Keyin qayta upload
qilinmadi. Matnlar uchun Notion download-attachment ishladi; ZIP/PNG tool matn
formatiga kirmaydi. Tarmoqdagi S3 to‘sig‘i global himoyani o‘chirib chetlab o‘tilmadi.

02 va 03 Tasdiq kutilmoqda. 04–06 texnik QA passed, lekin binar delivery
tekshiruvi sabab Toʻsiq bor. 07 Rejada, Oybek mas’ul. Ijrochi Bajarildi yoki
tekshiruvchi nomidan approval qo‘ymadi. Mahsulot kartasi va 07 ham yangilandi.

Keyingi sessiya: mustaqil nazoratchi 04–06 native attachmentlarni o‘z ruxsatli
sessiyasida ochib ZIP SHA256/CRC/manifest, barcha PNG hash va vizualni tekshirsin.
Yoki shu terminalning S3 read transportini rasmiy tarmoq ruxsati orqali tiklash.
Manba/paketni qayta yaratish yoki yana upload qilish kerak emas. Inson tasdig‘idan
keyin Oybek seller/support/refund va litsenziyani ko‘rib chiqib Gumroadga o‘zi nashr qiladi.
seller/RELEASE-CHECKLIST.md 10–15 daqiqalik tartibni beradi.

Avtomatlashtirish jadvali o‘chiq. Oldingi qa-smoke-2 lock/ledger saqlandi;
bu sessiya mahsulotni bevosita tayyorladi, eski automated runni davom ettirmadi.
Oldingi runner faqat UZ/RU inventoryga mos; uni uch tilli paketga avtomatik
qo‘llamang. Scheduler/global ruxsatlarni o‘zgartirmang. Pastdagi qaydlar tarixiy.

## Joriy davom ettirish — 1.1.0

smoke-2 texnik aylanish **o‘tdi**: rasmiy CLI --approve-for-me avtomatik review
yo‘li bilan report.json Notion test vazifasiga yuklandi, biriktirildi va qayta
yuklab mustaqil baytma-bayt tekshirildi (5583 bayt). SHA256:
9fa2b6363dcd3dda410ad7aff52504c6f0fc4c2ef39d157998636d4164af575b.
Fayl upload ID: 3ee063b0-85c2-8152-ab85-00b2f98f7ac8.
Dalil: .automation/smoke2-independent-readback.json va smoke-cycle.json.
Global Notion ruxsati, hook trust va boshqa himoyalar o‘zgarmagan. Bypass yo‘q.

site-fix-qa handler qo‘shildi: alohida candidate nusxa, private localhost server,
UZ/RU 360/375/390/768/1440 px browser matrix, haqiqiy PNG va MCP call dalil gate,
3 urinish chegarasi, candidate diff va Notion fayl readback. 9 himoya testi o‘tdi.
Asosiy saytga candidate avtomatik merge qilinmaydi. Ijrochi faqat Tasdiq kutilmoqda
yoki Toʻsiq bor qo‘yadi; Bajarildi/yakuniy tasdiq mustaqil tekshiruvchiga tegishli.

qa-smoke-1 haqiqiy Chrome/154 orqali boshlangan; mobile-menu focus qaytishi
candidate app.jsda tuzatildi. To‘liq QA o‘tmadi: browser MCP D: evidence pathini
configured workspace roots sabab rad etdi. Report/diff Notionga yuklandi va
qayta mazmun/hash bilan tekshirildi; test Holati Toʻsiq bor bo‘ldi.

O‘rnatilgan chrome-devtools-mcp McpContext.js roots() har doim OS tempni ruxsatli
ro‘yxatga qo‘shadi. Handler ruxsatli OS temp ichida private captureDir yaratib,
faqat shu katalogni --add-dir bilan invocationga beradi; genuine PNGni evidencega
nusxalaydi. allow-unrestricted-paths yoki yangi browser roots grant ishlatilmaydi.
qa-smoke-2 **to‘siqda to‘xtadi**. Ruxsatli tempga PNG olish ishladi, ikkita haqiqiy
qisman PNG saqlandi (uz-360.png va uz-menu-360.png). Controllerning avvalgi 600s
muddati tugadi; kech kelgan worker Chrome restarted/reconnected / No page found
deb qaytdi. Yakuniy matrix bo‘sh; to‘liq QA o‘tgan deb hisoblanmaydi.
Kelgusi chaqirish uchun qa_timeout_seconds=1800; hali muvaffaqiyatli tasdiqlanmagan.
Candidate app.js menyu yopilganda fokusni togglega qaytaradi; asosiy saytga merge yo‘q.

Reconciled hisobot:
.automation/artifacts/91c0f9125ab54fb8d847a0c0d5b64d4b95929960e683cbfbe37abf4a710410e0/reconciled-report.json
SHA256: f028438d647d01b3a59e31d5eab5700197117425b14a3b736d2334c8a137fa80.
Mavjud Notion AUTO-TEST-01 vazifasiga biriktirildi va qayta ochib mazmuni tekshirildi;
Holat=Toʻsiq bor. Upload ID: 3ef063b0-85c2-8196-ac95-00b247e163a0.
Qisman PNGlar faqat mahalliy; ularning Notionga yuklash/readbacki bajarilmagan.

runner.lock ataylab saqlandi. PID=19040 hozirgi process ro‘yxatida yo‘q,
worker logida turn.completed bor, lekin output-schema natija fayli yo‘q.
Qolgan child jarayonlarining aynan ushbu run bilan bog‘liqligi to‘liq aniqlanmagan.
Lock/ledgerni ko‘r-ko‘rona o‘chirmang yoki bir xil versiyani takrorlamang.
Keyingi sessiya: aniq jarayonlar va Notionni reconcile; Chrome ulanishini tiklash,
faqat yangi task versiyasida to‘liq QA/PNG upload va readback. Infratuzilma to‘sig‘i
sabab qo‘shimcha avtomatik repair urinishlari bajarilmadi (1/3 ishlatildi).

Jadval ro‘yxatdan o‘tkazilmagan/yoqilmagan. Configdagi reviewer_access_verified,
qa_review_approved, schedule_enabled false. Smoke readback yetarli emas: to‘liq
browser QA/dalil readback va mustaqil inson tasdig‘i kerak. Tekshiruvchi kimligi
va sahifaga kirishi hali tasdiqlanmagan. Joriy yo‘riqnoma:
tools/automation/README_UZ_v1.1.md; eski yo‘riqnoma va pastdagi qaydlar tarixiy.

## 2026-10-04 — avtomatlashtirish sessiyasi

Yangi ish: Notion → mahalliy Codex → natija → tekshiruv ijrochisi
`tools/automation/`da tayyorlandi. To‘liq holat docs/AUTOMATION-2026-10-04.md va
tools/automation/README_UZ.md ichida. Avval boshlang‘ich ZIP/SHA256 saqlandi;
6 sayt fayli ZIP bilan taqqoslandi va o‘zgarmagan.

Haqiqiy codex exec Notion self va 04-vazifani faqat o‘qib oldi. Bir zararsiz
AUTO-TEST-01 vazifa (3ee063b085c281c0920febc6f739e816) yaratildi. Ijrochi uni
product relation + Rejada + ready/version marker orqali oldi, statik audit va
SHA256 report yaratdi. Bir xil smoke-1 qayta claim qilinmadi. 5 himoya testi o‘tdi.

**To‘siq:** avtomatik Notion attachment upload `MCP tool call requires approval,
but approval policy is never` bilan rad etildi. Uploadni boshqa yo‘l bilan
aylanib o‘tish bajarilmadi. Test Holati interaktiv sessiyada Toʻsiq bor qilindi.
Ledger .automation/ledger ichida; uni o‘chirmang. Jadval ro‘yxatdan o‘tkazilmagan,
yoqilmagan; schedule gate muvaffaqiyatsiz smoke sabab yoqishni blokladi.

Qolgan ulash: qo‘llab-quvvatlangan Codex write approval/review yo‘lini foydalanuvchi
bilan aniq tanlash; tekshiruvchi Notion sahifasiga kirishini tasdiqlash; ayni test
vazifada yangi smoke-2 versiya bilan upload/readbackni sinash. Hozir faqat
static-audit handler bor; brauzer QA/kod tuzatish handlerlari yo‘q.

04-vazifa brauzer QA to‘sig‘i, 05/06 yakuniy paket/muqova va Oybekning 07 nashri
quyidagi oldingi qaydda qoladi. Loyiha hali sotuvga tayyor deb tasdiqlanmagan.

2026-10-04. Mavjud v0.1.0 davom ettirilmoqda. Mahsulotni qayta yaratmang.
Maqsad: 2026-10-05 gacha Gumroadga yuklashga tayyor paket; hozir tayyorlik tasdiqlanmagan.

## Kelishilgan mahsulot

Ingliz tili/IELTS markazi uchun 7 bo‘limli responsive HTML/CSS/JS; UZ/RU;
Telegram, telefon, HTTPS xarita havolalari. Build/npm/backend talab qilmaydi.
$19 — bitta biznes. Mahalliy moslashtirish 690 000 so‘m, 60 daqiqagacha,
haftasiga ko‘pi bilan bitta buyurtma; domen va hosting alohida.
Gumroad nashri Oybekka tegishli.

## Ushbu sessiyada bajarildi

- Notion mahsulot kartasi va mavjud 04-vazifa tafsilotlari o‘qildi.
- START-HERE, UZ/RU yo‘riqnomalar, QA-results.json, Gumroad tavsifi va litsenziya o‘qildi.
- `tools/serve-site.cjs` qo‘shildi: faqat 127.0.0.1:8765 mahalliy server, dependency yo‘q.
- `tools/check-static.cjs` qo‘shildi va muvaffaqiyatli bajarildi.
- 6 sayt fayli HTTP 200 va diskdagi baytlarga mos; ikkala tilning 7 bo‘limi,
  IDlari, mahalliy havola/aktivlari, viewport va til havolalari statik tekshirildi.
- JS sintaksisi va sukutdagi demo=true/bo‘sh kontaktlar tasdiqlandi.
- `docs/QA-2026-10-04.md` va `docs/QA-2026-10-04.json` saqlandi.
- Mavjud 04-vazifaning Holat/Hisobot/Keyingi qadam maydonlari yangilandi:
  **Toʻsiq bor**. Dublikat yaratilmadi, Bajarildi belgilanmadi.
- Saytning mavjud 6 fayli o‘zgarmadi. Tashqi xabar, qo‘ng‘iroq yoki kontakt navigatsiyasi yo‘q.

## Aniq to‘siq

`cua.getState()` brauzer va ilovalar ro‘yxatini bo‘sh qaytardi.
`cua.createBrowserTab('iab', ...)`: Browser is not available: iab.
`@oai/sky` importi ishladi, ammo `sky.list_apps()` native pipe unavailable,
os error 2 qaytardi. Haqiqiy brauzerda sayt ochilmadi, skrinshotlar olinmadi.
375/768/1440 px, gorizontal siljish, menyu, til bosish, klaviatura, demo dialog,
sozlangan kontakt href va konsol xatolari sinovlari **bajarilmagan**.
Statik/HTTP tekshiruvlarni brauzer sinovi deb hisoblamang.

## Davom ettirish tartibi

1. Ushbu sessiyada browser/Computer Use ulanishini yoqing yoki ishlaydigan brauzer
   ulanishi bor sessiyada loyiha papkasini oching. Avval mavjud brauzerlar ro‘yxatini tekshiring.
2. Server ushbu sessiyada ishga tushirilgan; yashashi terminal sessiyasiga bog‘liq.
   Kerak bo‘lsa `node tools/serve-site.cjs` ni ishga tushiring. URLlar:
   http://127.0.0.1:8765/index.html va http://127.0.0.1:8765/ru.html.
3. QA hisobotidagi jadvalni ikkala til uchun to‘ldiring: 375/768/1440 px;
   asl Notion qabul mezonida 360/390 px ham bor. To‘liq sahifa, mobil menyu,
   demo dialog skrinshotlarini saqlang. Konsol va gorizontal siljishni o‘lchang.
4. Demo va sozlangan/yaroqsiz kontaktlarni vaqtinchalik QA nusxasida tekshiring.
   Telefon, Telegram yoki xarita tashqi havolasini bosmang. Config.jsni demo holatida saqlang.
5. Topilgan nuqsonni tuzatib, tegishli sinovlarni qayta bajaring. Barcha sinovlar
   o‘tgandan keyingina mavjud 04-vazifani **Tasdiq kutilmoqda** holatiga topshiring.
   **Bajarildi** va yakuniy tasdiq mustaqil tekshiruvchi/Oybekka tegishli;
   ijrochi tekshiruvchi nomidan tasdiqlamasin.
6. 06-vazifa: mahsulot muqovasi va tekshirilgan previewlar; Gumroad matni yakuni.
7. 05-vazifa: QA yakunlangach versiya/hujjatlar, litsenziya/support/refund shartlarini
   Oybek bilan yakunlash va yakuniy ZIP. Muqova, litsenziya va support hali tugamagan.
8. 07-vazifa: Oybek yakuniy paketni ko‘rib chiqadi va Gumroadda $19 narxda chiqaradi.

## Manbalar

- Mahsulot: https://app.notion.com/p/3ee063b085c28120a939cfbd9e7aeced
- Mavjud 04-vazifa: https://app.notion.com/p/3ee063b085c28191b702d0c7a1bbd771
- Eski QA: docs/QA-results.json (2026-10-03); tarix sifatida saqlangan.
- Joriy QA: docs/QA-2026-10-04.md va .json.
- Xaridor uchun sayt fayllari: site/. QA vositalari tools/da, sayt aktivlari emas.
