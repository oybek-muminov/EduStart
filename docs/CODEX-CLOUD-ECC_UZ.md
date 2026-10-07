# EduStart uchun ECC va Codex Cloud

## Qo‘shilgan imkoniyatlar

EduStart ichiga ECC manbasiga asoslangan to‘rtta loyiha skill qo‘shilgan:

| Skill | Vazifa |
| --- | --- |
| `ecc-coding-standards` | Kod sifati, nomlash va o‘qilishi |
| `ecc-security-review` | Kontakt havolalari, DOM, maxfiy ma’lumotlar va avtomatlashtirish chegaralari |
| `ecc-tdd-workflow` | Mavjud Node.js test vositasi bilan test → tuzatish → tekshiruv |
| `ecc-verification-loop` | O‘zgarishlarni tekshirish va natijalarni aniq hisobot qilish |

Bu to‘liq global ECC plaginining o‘rnatilishi emas: loyihaga moslashtirilgan skills integratsiyasi. Native plugin, MCP serverlari, Claude buyruqlari, hooks, agent rollari va avtomatik xotira bu paketga qo‘shilmagan. Brauzerdagi Codex Cloud’da ularning to‘liq ishlashi tasdiqlanmagan.

Har bir skillning `references/upstream.md` fayli ECC’dan o‘zgartirilmasdan olingan. `SKILL.md` EduStart’ning oddiy HTML/CSS/JS tuzilmasi, `node:test`, uch til va mavjud ish chegaralariga moslashtirilgan. Boshqa loyiha yoki tizim skill’lari o‘zgartirilmaydi.

## Codex Cloud’da foydalanish

1. O‘zgarishlarni ko‘rib, integratsiya pull request’ini loyihangizga birlashtiring.
2. ChatGPT’da `Work in → Cloud` orqali EduStart muhitini tanlang. Yangi muhit kerak bo‘lsa, `Settings → Codex Cloud → Environments → Create environment` orqali `oybek-muminov/EduStart`ni tanlang.
3. Muhitni sozlash suhbatida quyidagi topshiriqni bering:

> EduStart uchun Node.js 18 yoki undan yangisini ishlating. Loyiha ildizidan bash tools/codex-cloud-setup.sh ni bajaring. AGENTS.md va HANDOFF.md ni o‘qing. Start skill ko‘rsatmalariga loyiha ildizini aniqlash, ECC fayllarini tekshirish va mavjud ish holatini o‘qishni qo‘shing. Native ECC plugin, MCP yoki hooks o‘rnatmang. Natijalarni ko‘rsatib, muhitni nashr qilishga tayyorlang.

4. Sozlash natijasini ko‘rib chiqing, saqlang va muhitni `Publish` yoki `Republish` qiling. Keyin yangi vazifa oching; mavjud vazifa oldingi holatini saqlashi mumkin.
5. Yangi vazifada to‘rtta skillning faol katalogda ko‘rinishini tekshirtiring. Ko‘rinmasa, Codex’dan `.agents/skills/<nom>/SKILL.md`ni bevosita o‘qishni so‘rang. Bu fayl orqali foydalanish bo‘ladi; katalogga avtomatik yuklangan deb hisoblamang.

Sinov topshirig‘i:

> AGENTS.md va HANDOFF.md ni o‘qi. tools/check-ecc.cjs ni bajar. ecc-verification-loop skill faylini o‘qib, loyihadagi ECC integratsiyasini tekshir. Sayt yoki avtomatlashtirish kodini o‘zgartirma. Fayllar tekshiruvi va joriy sessiyada skills ko‘rinishi natijalarini alohida yoz.

Muayyan ish uchun, masalan: `ecc-security-review yordamida site/app.js kontakt havolalarini faqat ko‘rib chiq`. Skill tanlash belgisi joriy interfeysda mavjud bo‘lsa, Codex’da `$ecc-security-review` orqali ham chaqirish mumkin.

## Tekshiruv va mavjud cheklov

```bash
bash tools/codex-cloud-setup.sh
node --test tools/check-ecc.test.cjs
node --check site/app.js
node --check site/config.js
git diff --check
```

Setup faqat Node.js mavjudligi, skill metama’lumotlari va manba/fayl hashlarini tekshiradi. Paket yuklamaydi, tarmoqqa chiqmaydi va tashqi xizmatga yozmaydi. U Codex Cloud muhitini o‘zi yaratmaydi yoki nashr qilmaydi; joriy sessiya katalogini ko‘ra olmaydi.

Eski automation suite’da 9 testning 8 tasi o‘tadi, 1 tasi EN inventory sabab yiqiladi. Bu integratsiyadan oldingi holat: `HANDOFF.md`da qayd etilgan. Setup bu suitni umumiy loyiha sog‘lomligi sifatida ko‘rsatmaydi. Automation ta’miri, haqiqiy brauzer QA, Notion attachment readback va Gumroad nashri alohida vazifalar.

## Manba va yangilash

- Manba: https://github.com/affaan-m/ECC
- Tanlangan commit: `ef648e01899ba3e8dc6371642deaaf64b4477775`.
- Manba yo‘llari: `.agents/skills/coding-standards`, `security-review`, `tdd-workflow`, `verification-loop`.
- Litsenziya: `third_party/ecc/LICENSE` (MIT, Affaan Mustafa).
- Fayl hashlar ro‘yxati: `.agents/ecc.lock.json`.

Yangilashda yangi upstream commitni tekshiring, kerakli reference va moslashtirishlarni ko‘rib chiqing, lock hashlarini yangilang va tekshiruvlarni qayta bajaring. Setupda o‘zgaruvchan `main` yoki `npx ...@latest` yuklanmaydi.

Rasmiy Codex qo‘llanmalari:
- https://learn.chatgpt.com/docs/agent-configuration/agents-md
- https://learn.chatgpt.com/docs/build-skills
- https://learn.chatgpt.com/docs/environments/cloud-environments
