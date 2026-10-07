# EduStart Notion → Codex → natija → tekshiruv sinovi

2026-10-04, Asia/Tashkent. Ijrochi versiyasi 1.0.0.
**To‘liq aylanish bloklangan; doimiy jadval ro‘yxatdan o‘tkazilmadi va yoqilmadi.**

## Saqlangan boshlang‘ich holat

Avval mavjud sayt, hujjatlar, seller, tools, START-HERE va HANDOFF ZIPga olindi:
`.automation/snapshots/baseline-2026-10-04.zip`.
SHA256: AE6F89AB78F2EA6B8DE3778FB1F3114CB83799000A25B94149C87B3AF16C9429.
ZIPdagi 6 sayt fayli yakunda diskdagi fayllar bilan SHA256 bo‘yicha taqqoslandi:
barchasi o‘zgarmagan. Git commit/reset bajarilmadi; oldingi untracked ish saqlandi.

## Haqiqiy sinovlar

| Bosqich | Natija |
| --- | --- |
| codex exec read-only Notion self va mavjud 04-vazifa fetch | O‘TDI |
| Notiondan tegishli product relation, Rejada va ready/version belgili vazifani olish | O‘TDI |
| Mahalliy statik audit va dalillar/SHA256/versiyali report.json | O‘TDI |
| Shu smoke-1 versiyasini qayta claim qilish | RAD ETILDI — himoya ishladi |
| Boshqa process lockni olsa parallel kirish | RAD ETILDI — himoya testi o‘tdi |
| To‘rtinchi urinish | RAD ETILDI — sanagich diskda 3 bo‘lib qoldi |
| Mahalliy hisobotni avtomatik Notion attachment qilish | RUXSAT TO‘SIG‘I |
| Attachment download/readback va tekshiruvchi kirishi | BAJARILMADI |
| --enable bilan jadvalni yoqishga urinish | GATE BLOKLADI — smoke muvaffaqiyat dalili yo‘q |

`node --test tools/automation/core.test.cjs`: 5 test, 5 o‘tdi.
`node tools/automation/verify-state.cjs`: real smoke ledgeri, hash, dedup va o‘zgarmagan
sayt tekshirildi; natija `.automation/verification.json`da.

Test vazifasi — bitta yangi zararsiz vazifa; mavjud 04-vazifa o‘rnini egallamaydi:
https://app.notion.com/p/3ee063b085c281c0920febc6f739e816.
Versiya smoke-1; bir urinish; ledger phase=blocked.
Mahalliy hisobot:
`.automation/artifacts/a3081aa5a4dd285ca5b84135a8742efea3fec77eda7a037b113d97c0ead01c4e/report.json`.
Hisobot SHA256: 1f5bad415b8c0691d2a202716403bfb763fbd7d0342ad3bcc6327d916ab39f1e.
Bu mahalliy manzil; umumiy havola emas.

## Aniq ruxsat to‘sig‘i

codex exec publisher quyidagi xatoni qaytardi:
`Notion attachment creation rejected: MCP tool call requires approval, but approval policy is never.`
`file_upload_id=null`, `readback_verified=false`.
Rad etilgan attachment parent sessiya yoki boshqa token orqali yuklanmadi.
Timeout yoki unknown writes qayta yuborilmaydi; reconciliation talab qilinadi.

Notion ruxsatlari faqat o‘qib ko‘rildi: global Allow low-risk actions;
Notion Use my default. Bu headless attachment writega kafolat bermaydi.
Hook trust, plugin permission, execution policy va credentiallar o‘zgartirilmadi.
Bypass bayroqlari va --approve-for-me ishlatilmadi.

Joriy interaktiv sessiyada test vazifasiga to‘siq/xulosa/versiya/hash qayd etildi,
Holat Toʻsiq bor qo‘yildi. Bu avtomatik publisher ishlaganini anglatmaydi.

## Saqlash va tekshiruvchi

Tayyorlangan yo‘l: har natijani o‘z Notion vazifasiga native attachment qilish;
sahifaga ruxsati bor tekshiruvchi shu yerdan oladi. D:\\, file:// va localhost
ommaviy yoki boshqa foydalanuvchi ko‘ra oladigan havola sifatida ishlatilmaydi.
Hozir attachment yuklanmagan va tekshiruvchi kimligi/kirishi tasdiqlanmagan.
Yangi sharing ruxsati berilmadi. Raw loglar .automation ichida va Gitdan chiqarilgan.

## Tayyorlangan Windows ijrochi chegaralari

`tools/automation/run-once.cmd` — bir marta queue → bitta ish → publish/readback.
Normal polling bir xil ID+versiyani, hatto to‘siqli yoki interrupted bo‘lsa ham olmaydi.
Atomik lock va persistent ledger bitta Windows mashinasida bitta faol ishni ta’minlaydi.
Interrupted child outcome noaniq bo‘lsa lock saqlanadi; inson tekshirishi kerak.
Ko‘pi bilan 3 urinish sanagichi bor; ma’lum ruxsat to‘sig‘ida birinchi urinishdan to‘xtadi.

Hozir faqat static-audit handleri tayyor. Sayt tuzatish handleri va haqiqiy brauzer
QA avtomatlashtirilmagan. Kod tahriri/Gumroad/social publishing vakolati yo‘q.
`register-schedule.cjs` smoke/readback/reviewer gate bilan tayyorlandi; real jadval
yaratish qismi hali sinovdan o‘tmagan, chunki precondition bajarilmadi.

## Qolgan bir martalik qadamlar

1. MCP writega kerak bo‘lgan tasdiqlash usulini Codexda qo‘llab-quvvatlangan yo‘l
   orqali aniq tanlash. --approve-for-me CLI helpda mavjud, lekin bu sessiyada
   ruxsat berilmagan/yoqilmagan/sinalmagan; review rad etishi mumkin. Ruxsatni
   chetlab o‘tish yoki global Always allow qilish tavsiya etilmaydi.
2. Tekshiruvchi kimligini va test sahifasiga kirishini tasdiqlash.
3. Shu mavjud test vazifaga yangi smoke-2 versiyasini aniq tasdiqlab berish,
   Holat=Rejada bilan qayta aylanishni sinash; smoke-1 ledgerini o‘chirmaslik.
4. Upload/readback/tekshiruvchi kirishi va qayta sessiyada MCP ishlashi tasdiqlansa,
   jadvalni yoqishni alohida hal qilish. Hozir schedule_enabled=false.

To‘liq foydalanish yo‘riqnomasi: tools/automation/README_UZ.md.
