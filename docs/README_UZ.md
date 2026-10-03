# EduStart UZ/RU — boshlash
Versiya: 0.1.0, 2026-10-03. Bu ko‘rib chiqish uchun dastlabki paket; sotuvga chiqarishdan oldin vizual va brauzer tekshiruvi zarur.

## Tarkibi
- `site/index.html` — o‘zbekcha, 7 bo‘lim.
- `site/ru.html` — ruscha, 7 bo‘lim.
- `site/styles.css` — responsive dizayn, tashqi shrift talab qilmaydi.
- `site/app.js` — mobil menyu va aloqa sozlamalari.
- `site/config.js` — biznes nomi, kontaktlar, manzil va ish vaqti.
- `site/favicon.svg` — almashtiriladigan oddiy belgi.
- `docs/COPY_UZ_RU.json` — ikki tildagi barcha dastlabki matnlar. Bu tahrir uchun ma’lumotnoma; sahifalar avtomatik ravishda shu JSONni o‘qimaydi.

## 10–15 daqiqalik tanishuv
1. ZIPni oching. `site/index.html` faylini brauzerda oching.
2. RU tugmasi orqali ruscha sahifani tekshiring.
3. Telegram, telefon va xarita tugmalarini bosing: demo rejimida tushuntirish oynasi chiqadi, hech qayerga xabar yuborilmaydi.
4. Kompyuter va telefon ko‘rinishini ko‘rib chiqing; kurslar va ustoz profili namunaviy ekanini tekshiring.

## Xaridor uchun moslashtirish
1. `config.js` ichidagi `brand`, `telegram`, `phone`, `map`, `address.uz/ru`, `hours.uz/ru` qiymatlarini o‘zgartiring. Telefon: xalqaro `+998...` formatida, bo‘shliqlarsiz. Telegram: @ belgisiz username. Xarita: to‘liq `https://...` havola.
2. `index.html` va `ru.html` fayllaridagi kurs, ustoz, narx/jadval, FAQ va asosiy matnlarni bir xil mazmunda tahrirlang. Haqiqiy ma’lumot va ruxsat berilgan suratlar ishlating. Namuna profili va demo ogohlantirishlarini tekshiring.
3. Ikkala HTML faylidagi `<title>` va `meta description`ni markazingizga moslang. `brand` ularni avtomatik o‘zgartirmaydi.
4. Asosiy ranglar `styles.css` boshidagi `:root` qismida. Surat qo‘shilsa uning foydalanish huquqini o‘zingiz ta’minlang.
5. Barcha ma’lumotlar tayyor bo‘lgach `demo: false` belgilang. Sozlanmagan yoki noto‘g‘ri formatdagi kontaktlar demo oynasini ochishda davom etadi.
6. `site` ichidagi barcha fayllarni birgalikda statik hostingning asosiy papkasiga yuklang. `index.html` asosiy sahifa. Fayl nomlarini o‘zgartirsangiz bog‘langan havolalarni ham tuzating.
7. Jonli manzilda barcha tugmalarni o‘zingiz tekshiring.

## Chegaralar
Bu HTML shablon: WordPress/Framer/Webflow mavzusi emas. Build, npm, backend yoki ma’lumotlar bazasi talab qilmaydi. Onlayn to‘lov, ariza saqlash, analitika, CRM va n8n integratsiyasi kiritilmagan. Telegram tugmasi suhbatga olib boradi; avtomatik xabar jo‘natmaydi. Domen/hosting shablon narxiga kirmaydi. JavaScript o‘chirilsa asosiy mazmun va til havolalari ishlaydi, aloqa konfiguratsiyasi uchun JavaScript kerak.

## Nashrdan oldingi tekshiruv
- [ ] Chrome/Firefox/Safari va 360/390/768/1440 px ko‘rinishlar.
- [ ] UZ/RU matnlarning mosligi va imlosi.
- [ ] Menyu, FAQ, klaviatura fokusi, demo oynasi.
- [ ] Haqiqiy Telegram, telefon va xarita havolalari.
- [ ] Yetishmayotgan rasm, gorizontal siljish va xatolar yo‘qligi.
