# EduStart UZ/RU/EN — sozlash
Paket versiyasi 1.0.1, 2026-10-07. Sayt va brauzer QA versiyasi 1.0.0. Bir sahifali responsive shablon, har tilda ayni 7 bo‘lim.

## Boshlash
ZIPni to‘liq ajrating. EduStart_UZ_RU_EN_v1.0.1/ ichidagi site/index.html ni brauzerda oching. UZ/RU/EN havolalari uchala
sahifada bor. HTML, CSS va JSni oddiy matn muharririda tahrirlash mumkin.
docs/COPY_UZ_RU_EN.json matnlar ma’lumotnomasi; HTML uni avtomatik o‘qimaydi.

## Biznesga moslash
1. site/config.js: brand, telegram (@ belgisiz username), phone (xalqaro + format,
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
