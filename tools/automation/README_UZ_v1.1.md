# EduStart ijrochisi — 1.1.0

Ishga tushirish: loyiha terminalida `tools\automation\run-once.cmd`.
Node va amaldagi Codex login/MCP; yangi token/paket/global ruxsat yo‘q.
Har chaqirishda bitta ish; jadval hozir o‘chiq.

## Tayyor topshiriq

Faqat EduStart relationi, Holat=Rejada va aynan bitta tayyor belgi:

```json
{"automation":"edustart-v1","project":"EduStart","ready":true,"version":"audit-1","kind":"static-audit"}
```

static-audit — manbani faqat o‘qish. site-fix-qa — alohida candidate nusxada
haqiqiy brauzer QA va tasdiqlangan nuqson tuzatish taklifi. Unmarked, blocked,
review-pending yoki boshqa mahsulot vazifalari olinmaydi. Notion matni shell
buyrug‘i yoki kengroq ruxsatga aylantirilmaydi.

## Rasmiy tasdiqlash

Discovery `--sandbox read-only`. Publisher va candidate QA `--approve-for-me`:
CLI helpidagi rasmiy avtomatik ko‘rib chiqish + workspace-write sandbox.
Reviewer rad etsa to‘xtaydi. Global Notion Use my default / Allow low-risk
actions o‘zgarmagan. Bypass, Always allow va allow-unrestricted-paths yo‘q.

smoke-2 report.json shu yo‘l bilan Notionga biriktirildi va mustaqil qayta
yuklab tekshirildi: 5583 bayt aynan mos; SHA256
9fa2b6363dcd3dda410ad7aff52504c6f0fc4c2ef39d157998636d4164af575b.
Bu texnik readback; insonning yakuniy tasdig‘i emas.

## Candidate va brauzer QA

Candidate .automation/artifacts/<key>/candidate ichida; server faqat shu nusxani
127.0.0.1 tasodifiy portida beradi. Ijrochi 6 mavjud sayt faylini tuzatishi mumkin;
asosiy sayt/global settings o‘zgarmaydi, Notion bu bosqichda faqat o‘qiladi.
Bir urinishda bitta repair batch; 3 urinish chegarasi diskka avval yoziladi.
Infratuzilma yoki ruxsat to‘sig‘ida darhol to‘xtaydi.

QA: UZ/RU × 360/375/390/768/1440 CSS px; actual viewport/clientWidth/scrollWidth,
7 bo‘lim vizuali, menyu/Escape/link-close, til, klaviatura, FAQ, demo dialoglari,
valid/invalid kontakt href/target/rel, konsol/resurs xatolari. Tashqi kontakt
havolalari ochilmaydi; config demo holatiga qaytariladi.

O‘rnatilgan chrome-devtools-mcp McpContext.js roots() OS tempni ruxsatli ro‘yxatga
qo‘shadi. Private edustart-qa-* capture katalogi shu yerda yaratiladi va faqat
shu invocationga --add-dir bilan beriladi. Browser genuine PNGni shu yerga oladi;
fayl candidate/evidencega nusxalanadi. Browser roots ochilmaydi, D:ga screenshot
yozish qayta talab qilinmaydi. Capture papkasi ledgerda qayd etiladi.

Host gate: haqiqiy browser MCP screenshot call izi, to‘liq matrix, PNG header/hajmi,
statik checks/hashlar va o‘zgarmagan asosiy sayt. Birgina passed javobi yetarli emas.
Bu gate inson vizual tekshiruvini almashtirmaydi.

## Natija va yakuniy tasdiq

report.json, candidate-changes.txt va muvaffaqiyatli QA PNGlar Notion vazifasiga
native attachment bo‘ladi. Har biri qayta o‘qilib mazmun/SHA256 bilan solishtiriladi.
Link/uploaded holati yetarli emas. D:\\, file:// va localhost umumiy havola emas.
Tekshiruvchi Notionga o‘z ruxsati bilan kiradi; uning kirishi hali tasdiqlanmagan.
Raw loglar .automation ichida Gitdan chiqarilgan, yuklanmaydi.

Ijrochi faqat Tasdiq kutilmoqda yoki Toʻsiq bor qo‘yadi. Bajarildi, tekshiruvchi
nomidan qaror, candidate merge va Gumroad/social nashr ijrochiga tegishli emas.
Mustaqil tekshiruvchi/Oybek ko‘rib chiqadi va o‘z tasdig‘ini beradi.

Atomik lock/persistent task-ID:version ledger; blocked/interrupted versiya ham
qayta olinmaydi. Timeout/unknown natijada lock qoladi; jarayon va Notion
tekshirilmasdan uni o‘chirmang. Bitta Windows mashinasi uchun; distributed lock emas.

## Jadval va tekshiruv

register-schedule.cjs --enable uchun smoke upload/readback, to‘liq browser QA
va dalil readback, reviewer kirishi, mustaqil inson tasdig‘i hamda alohida jadval
ruxsati kerak. reviewer_access_verified, qa_review_approved, schedule_enabled
hozir false; ijrochi ularni o‘z-o‘zidan true qilmaydi. Windows jadval
InteractiveToken/LeastPrivilege/IgnoreNew; SYSTEM/admin/parol yo‘q.
Registration va uzoq muddat headless connector hali tasdiqlanmagan.

Testlar: `node --test tools/automation/core.test.cjs tools/automation/site-qa.test.cjs`.
smoke-2 readback/dedup: `node tools/automation/verify-state.cjs`.
