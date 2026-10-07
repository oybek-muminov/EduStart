# EduStart mahalliy ijrochi

**Tarixiy smoke-1 qaydi. Joriy 1.1.0 yo‘riqnoma: [README_UZ_v1.1.md](README_UZ_v1.1.md).**

Holat: zararsiz sinovning o‘qish va mahalliy audit bosqichi ishladi; avtomatik
Notion attachment yozuvi tasdiqlash siyosati sabab rad etildi. Jadval **yoqilmagan**.

## Ishga tushirish

Loyiha papkasidagi oddiy terminalda `tools\automation\run-once.cmd` ni bajaring.
Node va mavjud Codex login/MCP ulanishlari kerak; yangi paket yoki token talab qilinmaydi.
Codex joyi config.json ichidagi codex_js bilan ko‘rsatilgan. CLI separate argument array
bilan chaqiriladi; Notion matni shell buyruqqa aylantirilmaydi.

Ijrochi navbatni o‘qiydi va bir ishni bajarib tugaydi; interval bilan ishga tushirish
uchun Windows jadval skripti tayyorlangan, ammo hozir ro‘yxatdan o‘tkazilmagan.

## Qaysi topshiriqlar olinadi

Vazifalar bazasining tegishli viewsi pagination bilan o‘qiladi. Vazifa EduStart
Mahsulot relationiga ega, Holat=Rejada va sahifada aynan bitta tayyor belgi bo‘lishi kerak:

```json
{"automation":"edustart-v1","project":"EduStart","ready":true,"version":"audit-1","kind":"static-audit"}
```

Hozir tasdiqlangan ijro turi faqat static-audit: mavjud 6 sayt faylini faqat o‘qish,
7 bo‘lim/ID/havola/aktiv/JS sintaksisini tekshirish. Sayt tahriri, brauzer QA,
muqova yaratish va boshqa ish turlari bu ijrochida hali qo‘llanmaydi.
Oddiy eski vazifalarga tayyor belgi avtomatik qo‘shilmaydi.
Notiondagi matnlar ishonchsiz ma’lumot sifatida ishlatiladi; tashqi buyruqlar bajarilmaydi.

## Bitta ish, versiya va urinishlar

- `.automation/runner.lock` boshqa jarayonning ishga kirishini atomik bloklaydi.
- `.automation/ledger/<SHA256(task-ID:version)>.json` ish boshlanishidan oldin yaratiladi.
- Shu ID+versiya tugagan, to‘siqli yoki uzilib qolgan bo‘lsa ham qayta olinmaydi.
- `beginAttempt` sanagichni ijrodan oldin saqlaydi va to‘rtinchi urinishni rad etadi.
  Hozirgi static-audit manbani tuzatmaydi: muvaffaqiyatsiz audit/ruxsat to‘sig‘ida
  birinchi urinishdan keyin to‘xtaydi. Ko‘pi bilan 3 chegarasi avtomatik tuzatishga
  ruxsat degani emas; kod tuzatish handleri hali yozilmagan.
- Timeout/nonzero Codex chiqishida lock saqlanadi: oldingi jarayon va masofaviy
  natija noaniq bo‘lishi mumkin. PID/processlar va Notion natijasini tekshirmasdan
  lock yoki ledgerni o‘chirmang. Lockni tashlab yuborib parallel davom etmang.
- `.automation` holatini yo‘qotish takrorlash himoyasini yo‘qotadi; uni saqlang.
  Faqat bitta Windows mashinasi/foydalanuvchisi ish yuritsin; bu distributed lock emas.

## Natija va tekshiruv

Mahalliy report.json dalillar, vazifa versiyasi, runner versiyasi va har sayt
faylining SHA256 qiymatini saqlaydi. So‘ng Codex bitta Notion text attachment
yaratishi, faqat shu vazifaga biriktirishi va Holatni Tasdiq kutilmoqda qilishi kerak.
Natija Bajarildi deb o‘z-o‘zini tasdiqlamaydi. Upload/download/fetch readback
bir xil kontentni tekshirmaguncha aylanish muvaffaqiyatli hisoblanmaydi.

Tanlangan saqlash usuli: vazifa sahifasiga mahalliy hisobotning Notion attachmenti.
Bu ommaviy URL emas; sahifaga ruxsati bor tekshiruvchi kira oladi.
D:\\, file:// va localhost tekshiruvchi uchun umumiy havola emas.
Hozir upload rad etilgan, file_upload_id yo‘q, tekshiruvchi kirishi aniqlanmagan.
Loglar foydalanuvchi/Notion ma’lumotlarini saqlashi mumkin: .automation Gitga qo‘shilmaydi.

## Bir martalik ulash va qayta sinov

1. Codex exec Notion o‘qishi sinovda ishladi; loginni yoki plaginni qayta o‘rnatmang.
2. Yozish uchun amaldagi ruxsat talabini hal qiling. CLI hozir MCP write approval
   so‘roviga `approval policy is never` sabab javob bera olmadi. Tasdiq talabini
   o‘chirmang yoki bypass bayroqlarini ishlatmang. CLI help `--approve-for-me`
   qo‘llab-quvvatlangan avtomatik ko‘rib chiqishni ko‘rsatadi, ammo bu ijrochida
   yoqilmagan va shu ulanishda tekshirilmagan. Uni faqat foydalanuvchi aniq
   ruxsat bergach sinash yoki yozishni interaktiv tasdiqlash bosqichida qoldirish mumkin.
   Rad etilgan uploadni boshqa connector/token bilan aylanib o‘tmang.
3. Tekshiruvchi kimligini va test vazifasiga o‘z akkauntida kirishini tasdiqlang.
   Yangi sharing ruxsatlari bu sessiyada berilmagan.
4. Shu mavjud AUTO-TEST-01 vazifada smoke-1 yakunini saqlab, tasdiqlangan qayta
   sinov uchun versiyani smoke-2, Holatni Rejada qiling. Dublikat vazifa yaratmang.
   Bir xil smoke-1 ledger yozuvini o‘chirmang.
5. Upload/readback va tekshiruvchi kirishi o‘tgach configdagi tegishli gate qiymatlari
   tasdiqlangan dalil bilan yangilanadi. Shundan keyin, alohida ruxsat bilan,
   `node tools/automation/register-schedule.cjs --enable` ishlatilishi mumkin. Joriy skript
   muvaffaqiyat dalili yo‘qligida Windows jadvaliga umuman yozmaydi.

Jadval foydalanuvchi interaktiv loginida Limited huquq bilan ishlashga tayyorlangan;
SYSTEM, administrator, saqlangan parol, yangi sharing yoki approval bypass yo‘q.
Codex App/connectorning uzoq muddat headless ishlashi hali sinovdan o‘tmagan;
pipe/session tugasa ijrochi to‘siq bilan to‘xtashi kerak.

Tekshiruv buyruqlari: `node --test tools/automation/core.test.cjs` va
`node tools/automation/verify-state.cjs`. Bular log/ledger/source himoyasini
tekshiradi; Notion upload muvaffaqiyatini soxtalashtirmaydi.
