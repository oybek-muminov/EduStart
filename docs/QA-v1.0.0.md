# EduStart UZ/RU/EN — haqiqiy brauzer QA, v1.0.0

Sana: 2026-10-04. Ijrochi: Codex+ECC. Yakuniy inson tasdig‘i berilmagan.

Brauzer: Chrome/154.0.8037.93; o‘rnatilgan Chrome, alohida headless sessiya. Mock/sintetik layout yo‘q.

| Til | CSS kenglik | client/scroll | Menyu | FAQ/klaviatura | Demo/dialog | Til o‘tishi | Konsol/HTTP |
|---|---:|---|---|---|---|---|---|
| uz | 360 | 360/360 | PASS | PASS | PASS | PASS | 0 xato |
| uz | 375 | 375/375 | PASS | PASS | PASS | PASS | 0 xato |
| uz | 390 | 390/390 | PASS | PASS | PASS | PASS | 0 xato |
| uz | 768 | 768/768 | PASS | PASS | PASS | PASS | 0 xato |
| uz | 1440 | 1440/1440 | PASS | PASS | PASS | PASS | 0 xato |
| ru | 360 | 360/360 | PASS | PASS | PASS | PASS | 0 xato |
| ru | 375 | 375/375 | PASS | PASS | PASS | PASS | 0 xato |
| ru | 390 | 390/390 | PASS | PASS | PASS | PASS | 0 xato |
| ru | 768 | 768/768 | PASS | PASS | PASS | PASS | 0 xato |
| ru | 1440 | 1440/1440 | PASS | PASS | PASS | PASS | 0 xato |
| en | 360 | 360/360 | PASS | PASS | PASS | PASS | 0 xato |
| en | 375 | 375/375 | PASS | PASS | PASS | PASS | 0 xato |
| en | 390 | 390/390 | PASS | PASS | PASS | PASS | 0 xato |
| en | 768 | 768/768 | PASS | PASS | PASS | PASS | 0 xato |
| en | 1440 | 1440/1440 | PASS | PASS | PASS | PASS | 0 xato |

30 haqiqiy til o‘tishi va 30 valid/invalid config sinovi o‘tdi.
Kontakt href/target/rel tekshirildi, sozlangan tashqi havolalar ochilmadi.
Har tilda address/hours konfiguratsiyasi tekshirildi; demo tarqatish konfiguratsiyasi o‘zgarmagan.

Tuzatishlar: mobil menyudan Escape chiqqanda fokus togglega qaytadi; link-close yashirin fokus qoldirmaydi; demo dialogida Tab/Shift+Tab fokus chegarasi saqlanadi.
Haqiqiy PNG: 15 full-page, 3 mobile menu, 3 dialog. SHA256 JSON hisobotida.

Chegaralar: Firefox/Safari, haqiqiy touch qurilma, ekran o‘quvchi va CWV sinovi bajarilmagan.
Tasdiqlangan eski vizual baseline yo‘q; regressiya solishtiruvi INCONCLUSIVE.
Texnik mezonlar PASS; mustaqil vizual va sotuvchi shartlari ko‘rib chiqilishi kutiladi.
