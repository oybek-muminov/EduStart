# EduStart UZ/RU/EN — setup
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
