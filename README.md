# منصة العقارات الأردنية | Jordan Real Estate Platform

Public website for jordanpropertyjo.com.

## Structure

- / Platform home.
- /projects/al-samik-gold-land/ Al Samik Gold Land project page.
- /opportunities/ Transparent review inventory sourced from the extraction pipeline.
- /guides/ Evergreen Arabic real-estate guides.
- /contact/ Contact channels.
- /privacy/ Privacy notice.
- /disclosure/ Property information disclosure.

The site is static and designed for GitHub Pages. It contains no forms, cookies,
automatic WhatsApp redirects, or private customer data.

## Content refresh

The public opportunity inventory is generated from the current `FROM-THE-FUTURE` source snapshot. From the site repository root:

```powershell
$env:SOURCE_REPO = "..\FROM-THE-FUTURE"
$env:SOURCE_REF = "origin/main"
node tools/import-source-opportunities.mjs
node tools/build-content.mjs
node tools/qa-content.mjs
```

The importer deliberately withholds price-per-square-metre comparisons where the deed/internal area for a ground-floor or roof property is not confirmed.
