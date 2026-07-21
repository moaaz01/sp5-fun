# SP5 Tools — أدوات عربية مجانية

> أكبر مجموعة أدوات عربية مجانية على الويب — 52+ أداة في 7 تصنيفات

## 🔗 الموقع المباشر

**https://sp5.fun**

## 📋 نظرة عامة

موقع HTML ثابت سريع يقدم أكثر من 52 أداة مجانية باللغة العربية، مصمم خصيصاً للمستخدم العربي مع واجهة RTL كاملة وSEO محسّن.

## 🗂️ هيكل المشروع

```
sp5.fun/
├── index.html              # الصفحة الرئيسية (فلتر تصنيفات + بحث)
├── css/
│   └── style.css           # التنسيقات الرئيسية (خط Tajawal، RTL، متجاوب)
├── js/
│   └── main.js             # JavaScript (client-side فقط، بدون سيرفر)
├── tools/                  # صفحات الأدوات الـ 52+
│   ├── bmi-calculator.html
│   ├── currency-converter.html
│   ├── hijri-converter.html
│   ├── password-generator.html
│   ├── zakat-calculator.html
│   └── ... (52+ أداة)
├── blog/                   # مقالات إرشادية (SEO)
│   ├── index.html
│   ├── bmi-guide.html
│   ├── vat-calculation-guide.html
│   └── ... (16 مقالة)
├── pages/                  # صفحات قانونية ومعلوماتية
│   ├── about.html
│   ├── contact.html
│   ├── privacy.html
│   ├── terms.html
│   ├── cookies.html
│   └── disclaimer.html
├── privacy-policy.html     # سياسة الخصوصية
├── terms-of-service.html   # شروط الاستخدام
├── ads.txt                 # Google AdSense
├── robots.txt              # محركات البحث
└── sitemap.xml             # خريطة الموقع
```

## 🛠️ التصنيفات والأدوات

| الفئة | العدد | أمثلة |
|-------|-------|-------|
| 💰 حاسبات مالية | 10+ | القروض، الرواتب، الفائدة المركبة، الضريبة VAT |
| 🏥 صحة ولياقة | 2 | BMI، السعرات الحرارية |
| 🔄 محولات | 10+ | العملات، الهجري، الحرارة، المنطقة الزمنية |
| 📝 أدوات نصية | 2 | عداد الكلمات، مولد نص عربي |
| 🔒 أمان ومولدات | 4+ | كلمات المرور، QR، فحص القوة |
| 🕌 أدوات إسلامية | 2 | الزكاة، محول الهجري |
| 🌐 أدوات الويب | 2+ | فاحص السرعة، ضاغط الصور |

## 🏗️ البنية التقنية

- **HTML ثابت** — لا سيرفر، لا قاعدة بيانات، لا PHP
- **Client-side فقط** — كل الأدوات تعمل بـ JavaScript في المتصفح
- **RTL عربي** — خط Tajawal من Google Fonts
- **متجاوب** — يعمل على الموبايل والتابلت والكمبيوتر
- **SEO كامل** — schema.org, meta, canonical, sitemap, robots.txt
- **أمان** — CSP headers + XSS protection + HSTS عبر nginx
- **Cloudflare** — Proxy mode مع Full (Strict) SSL

## 🚀 النشر

الموقع يستضيفه nginx على سيرفر Hostinger VPS (فرانكفورت). للنشر:

```bash
# نسخ الملفات مباشرة إلى مجلد الموقع
rsync -avz ./ /www/wwwroot/sp5.fun/

# أو سحب من GitHub
cd /www/wwwroot/sp5.fun
git pull origin main
```

## ⚠️ ملاحظات مهمة

- **Cache-busting:** أي تعديل على CSS/JS لازم يترافق مع `?v=YYYYMMDD` جديد
- **SVG داخل HTML:** لازم يكون لها `width` و `height` صريحين
- **لا تستخدم ImageMagick مع نص عربي** (يعكس RTL→LTR)
- **ads.txt:** يحتوي رقم ناشر Google AdSense

## 📄 الترخيص

جميع الحقوق محفوظة © 2025-2026 SP5