# EduStart avtomatlashtirish — davom ettirish natijasi

Amaldagi loyiha before-smoke-2.zip bilan saqlandi; asosiy olti sayt fayli o‘zgarmagan.
ECC yoki o‘rnatilgan paketlar takroran o‘rnatilmadi.

## Ishlagan qismlar

Rasmiy `codex exec --approve-for-me` avtomatik approval-review yo‘li publisher
uchun ishladi. `--sandbox read-only` discoveryda saqlandi. Global Notion ruxsati,
trust va himoyalar o‘zgarmadi. Yangi token yoki global Always allow kerak bo‘lmadi.
smoke-2 hisobot native Notion attachment sifatida biriktirildi; qayta yuklanganda
5583 bayt mahalliy faylga aynan mos. SHA256:
9fa2b6363dcd3dda410ad7aff52504c6f0fc4c2ef39d157998636d4164af575b.

site-fix-qa alohida candidate nusxada sayt tuzatishi va haqiqiy Chrome QA qiladi.
Bir ishga atomik lock, task ID/version dedup va ko‘pi bilan 3 repair urinish bor.
Tekshiruvga topshirish yakuniy tasdiqdan ajratildi; ijrochi Bajarildi qo‘ymaydi.
Asosiy saytga avtomatik merge va Gumroad/ijtimoiy tarmoq nashri yo‘q.

Chrome MCP D: pathni rad etdi. O‘rnatilgan rasmiy MCP OS tempni roots ichiga
qo‘shadi; private temp katalogi va faqat unga `--add-dir` bilan PNG olish ishladi.
`allow-unrestricted-paths` yoki kengaytirilgan global ruxsat yo‘q.

## Hal bo‘lmagan to‘siq

qa-smoke-2: 600s controller deadline; kech natijada Chrome qayta ulangan va
`No page found`. UZ/RU dastlabki o‘lchovlari va ikkita genuine PNG bor, ammo
yakuniy 10 qatorli matrix bo‘sh. To‘liq QA va barcha PNG upload/readback o‘tmagan.
Kelgusi QA muddati 1800s qilindi; bu o‘zgarishning to‘liq aylanishi tekshirilmagan.
Candidate app.jsda menyu fokus tuzatishi bor; asosiy sayt o‘zgarmagan.

Mavjud AUTO-TEST-01 sahifasiga reconciled report biriktirildi va qayta ochildi.
Status Toʻsiq bor; approval_by null. Lock konservativ ravishda qoldirildi:
late turn.completed mavjud, structured output yo‘q; qolgan child jarayonlar
aniq reconcile qilinmaguncha bir xil runni davom ettirmang.

## Bir martalik keyingi qadamlar

Chrome MCP sessiyasi/aniq child jarayonlar va lockni reconcile qilish; yangi
versiyada full QA va har bir attachmentni qayta yuklab tekshirish.
Tekshiruvchi mavjud Notion test sahifasidagi yangi hisobot/diff/PNGlarni o‘z
ruxsati bilan ochsin va alohida qaror bersin. D: umumiy fayl manzili emas.
Shundan keyingina alohida jadval ruxsati ko‘rib chiqiladi; jadval hozir o‘chiq.

Asosiy yo‘riqnoma: tools/automation/README_UZ_v1.1.md. Dalillar: .automation/.
HANDOFF.md joriy natija va tarixni saqlaydi.
