# خطة النشر — SP5 Tools

## البنية التحتية

| العنصر | القيمة |
|--------|-------|
| **الخادم** | Hostinger VPS — Frankfurt, Germany |
| **IP** | 72.62.145.229 |
| **المسار** | `/www/wwwroot/sp5.fun/` |
| **الويب سيرفر** | nginx (aaPanel) |
| **SSL** | Cloudflare Origin Certificate (*.sp5.fun) صالح لـ 2041 |
| **Cloudflare** | Proxy mode + Full (Strict) SSL |
| **DNS** | sp5.fun → 72.62.145.229 (Cloudflare proxy) |

## النشر من GitHub

```bash
# 1. سحب آخر نسخة
cd /www/wwwroot/sp5.fun
git pull origin main

# 2. التحقق من الصحة
curl -sI https://sp5.fun/ | head -5

# 3. تنظيف كاش Cloudflare (اختياري)
# من لوحة Cloudflare → Caching → Purge Everything
```

## Cache-Busting ⚠️

أي تعديل على `css/style.css` أو `js/main.js` لازم يترافق مع `?v=` جديد في كل HTML:

```html
<link rel="stylesheet" href="/css/style.css?v=20260721">
<script src="/js/main.js?v=20260721"></script>
```

بدون هذا: Cloudflare يخزّن نسخة قديمة مع `immutable` header والمتصفح ما يطلب الجديد.

## إعدادات nginx المهمة

- **Gzip:** مفعل لـ text/css, application/json, application/javascript, text/xml
- **Security Headers:** X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, CSP, HSTS
- **Cache:** HTML = 1 ساعة | Static (css/js/images) = 30 يوم
- **Redirects:** www → non-www, /index.html → /

## الأدوات الجديدة

لإضافة أداة جديدة:
1. أنشئ `tools/اسم-الأداة.html`
2. أضف الرابط في `index.html` (قسم التصنيف المناسب)
3. أضف `?v=` جديد على style.css و main.js
4. حدّث `sitemap.xml`
5. git commit + push

## روابط مهمة

- الموقع: https://sp5.fun
- Google AdSense: pub-2351071222567371
- Cloudflare Dashboard: sp5.fun domain settings