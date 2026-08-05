import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guides = JSON.parse(fs.readFileSync(path.join(root, "data", "guides-v1.json"), "utf8"));
const opportunities = JSON.parse(fs.readFileSync(path.join(root, "data", "opportunities-v1.json"), "utf8"));

const SITE = "https://jordanpropertyjo.com";
const GROUP = "https://www.facebook.com/groups/JordanPropertyGroup";

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(relativePath, content) {
  const output = path.join(root, relativePath);
  ensureDir(path.dirname(output));
  fs.writeFileSync(output, content.trimStart() + "\n", "utf8");
}

function head({ title, description, pathname, image = "/assets/al-samik-social.jpg", type = "website" }) {
  const url = SITE + pathname;
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} | منصة العقارات الأردنية</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${type}">
  <meta property="og:locale" content="ar_JO">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE + image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#173c31">
  <link rel="icon" href="/assets/platform-logo.png" type="image/png">
  <link rel="stylesheet" href="/site.css">
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js" defer></script>
  <script src="/site.js" defer></script>
</head>`;
}

function header() {
  return `<header class="site-header site-header-solid">
  <a class="platform-brand" href="/" aria-label="منصة العقارات الأردنية">
    <img src="/assets/platform-logo.png" alt="منصة العقارات الأردنية" width="256" height="256">
    <span><strong>منصة العقارات الأردنية</strong><small>Jordan Real Estate Platform</small></span>
  </a>
  <nav class="main-nav" aria-label="التنقل الرئيسي">
    <a href="/opportunities/">الفرص</a>
    <a href="/guides/">الدليل العقاري</a>
    <a href="/#projects">المشاريع</a>
    <a href="/contact/">تواصل معنا</a>
  </nav>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wide-inner footer-grid">
    <a class="platform-brand footer-brand" href="/">
      <img src="/assets/platform-logo.png" alt="منصة العقارات الأردنية" width="256" height="256">
      <span><strong>منصة العقارات الأردنية</strong><small>jordanpropertyjo.com</small></span>
    </a>
    <nav aria-label="روابط الموقع">
      <a href="/opportunities/">الفرص</a>
      <a href="/guides/">الدليل</a>
      <a href="/contact/">التواصل</a>
      <a href="/privacy/">الخصوصية</a>
      <a href="/disclosure/">الإفصاح</a>
    </nav>
  </div>
</footer>`;
}

function joinBand(source) {
  return `<section class="join-band" aria-label="الانضمام إلى مجتمع المنصة">
  <div class="wide-inner join-grid">
    <div>
      <p class="section-kicker">لا تفوّت الدفعة التالية</p>
      <h2>تابع الفرص الجديدة داخل مجموعة منصة العقارات الأردنية</h2>
      <p>المشترون والملاك والوسطاء والمستثمرون في مكان واحد، مع فرص مختارة ومحتوى عقاري عملي.</p>
    </div>
    <a class="button button-light" href="${GROUP}" target="_blank" rel="noopener" data-conversion="facebook-group" data-source="${esc(source)}">
      <i data-lucide="facebook" aria-hidden="true"></i>
      انضم إلى المجموعة
    </a>
  </div>
</section>`;
}

function guideCard(guide) {
  return `<article class="guide-card">
  <a class="guide-card-media" href="/guides/${guide.slug}/">
    <img src="${guide.image}" alt="${esc(guide.title)}" width="2048" height="2048" loading="lazy" decoding="async">
  </a>
  <div class="guide-card-copy">
    <p class="content-meta">${esc(guide.category)} · ${esc(guide.readTime)}</p>
    <h2><a href="/guides/${guide.slug}/">${esc(guide.title)}</a></h2>
    <p>${esc(guide.description)}</p>
    <a class="text-link" href="/guides/${guide.slug}/">اقرأ الدليل <i data-lucide="arrow-left" aria-hidden="true"></i></a>
  </div>
</article>`;
}

function renderGuidesIndex() {
  const title = "الدليل العقاري";
  const description = "أدلة عملية للمشتري والمالك والمغترب حول سعر المتر وشراء الأراضي والاستلام وعرض العقار.";
  return `${head({ title, description, pathname: "/guides/" })}
<body>
  ${header()}
  <main>
    <section class="content-hero">
      <div class="wide-inner content-hero-grid">
        <div>
          <p class="section-kicker">معلومة تساعدك قبل القرار</p>
          <h1>الدليل العقاري</h1>
          <p>حوّلنا حملاتنا التوعوية إلى أدلة عملية يمكن الرجوع إليها عند المقارنة والمعاينة والتفاوض.</p>
        </div>
        <div class="content-hero-stat"><strong>${guides.length}</strong><span>أدلة تأسيسية متاحة الآن</span></div>
      </div>
    </section>
    <section class="index-section">
      <div class="wide-inner guide-list">
        ${guides.map(guideCard).join("\n")}
      </div>
    </section>
    ${joinBand("guides-index")}
  </main>
  ${footer()}
</body>
</html>`;
}

function articleSections(guide) {
  return guide.sections.map((section, index) => `<section class="article-section">
    <div class="article-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div>
    <div>
      <h2>${esc(section.heading)}</h2>
      ${(section.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join("\n")}
      ${section.bullets ? `<ul class="check-list">${section.bullets.map(item => `<li><i data-lucide="check" aria-hidden="true"></i><span>${esc(item)}</span></li>`).join("")}</ul>` : ""}
    </div>
  </section>`).join("\n");
}

function renderGuide(guide) {
  const pathname = `/guides/${guide.slug}/`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    image: SITE + guide.image,
    inLanguage: "ar",
    publisher: { "@type": "Organization", name: "منصة العقارات الأردنية", url: SITE }
  });
  return `${head({ title: guide.title, description: guide.description, pathname, image: guide.image, type: "article" })}
<body>
  ${header()}
  <main>
    <article>
      <header class="article-hero">
        <div class="wide-inner article-hero-grid">
          <div>
            <p class="content-meta">${esc(guide.category)} · ${esc(guide.readTime)}</p>
            <h1>${esc(guide.title)}</h1>
            <p>${esc(guide.intro)}</p>
          </div>
          <img src="${guide.image}" alt="${esc(guide.title)}" width="2048" height="2048" fetchpriority="high" decoding="async">
        </div>
      </header>
      <div class="article-shell">
        ${articleSections(guide)}
        <aside class="transparency-note">
          <i data-lucide="info" aria-hidden="true"></i>
          <div><strong>ملاحظة مهمة</strong><p>هذا محتوى توعوي عام، وليس تقييماً عقارياً أو استشارة قانونية أو مالية. تحقق من سند التسجيل والجهات الرسمية واستعن بمختص قبل الالتزام.</p></div>
        </aside>
      </div>
    </article>
    ${joinBand(`guide-${guide.slug}`)}
  </main>
  ${footer()}
  <script type="application/ld+json">${jsonLd}</script>
</body>
</html>`;
}

function number(value) {
  return new Intl.NumberFormat("en-US").format(Number(value));
}

function displayTitle(item) {
  const title = item.title.trim();
  if (/^Apartment for sale$/i.test(title)) return `شقة للبيع في ${item.area}`;
  if (/3 Bedrooms Apartment/i.test(title)) return `شقة 3 غرف نوم للبيع في ${item.area}`;
  if (/4 Bedrooms Apartment/i.test(title)) return `شقة 4 غرف نوم للبيع في ${item.area}`;
  if (/distinctive apartments/i.test(title)) return `شقق مميزة للبيع في ${item.area}`;
  return title;
}

function confidence(item) {
  if (item.area_confidence === "deed_area_extracted") return "ذُكرت مساحة القوشان في بيانات المصدر";
  if (item.area_confidence === "needs_area_verification") return "يلزم التحقق من مساحة القوشان وفصل أي مساحة خارجية";
  return "سعر المتر محسوب على المساحة المعلنة ويحتاج مطابقة القوشان";
}

function opportunityCard(item) {
  return `<article class="opportunity-card" data-opportunity data-area="${esc(item.area)}">
    <div class="opportunity-top">
      <span class="opportunity-area"><i data-lucide="map-pin" aria-hidden="true"></i>${esc(item.area)}</span>
      <span class="opportunity-source">${esc(item.source)}</span>
    </div>
    <h2>${esc(displayTitle(item))}</h2>
    <div class="opportunity-metrics">
      <div><span>السعر</span><strong>${number(item.price)} د.أ</strong></div>
      <div><span>المساحة</span><strong>${number(item.size)} م²</strong></div>
      <div><span>سعر المتر</span><strong>${number(item.ppm)} د.أ</strong></div>
    </div>
    <p class="opportunity-floor"><strong>الطابق:</strong> ${esc(item.floor)}</p>
    <p class="price-reading"><i data-lucide="badge-percent" aria-hidden="true"></i><span><strong>قراءة أولية ملفتة:</strong> أقل من مرجع أسعار العرض المتاح بنحو ${esc(item.discount_vs_reference_pct)}%، مع ضرورة التحقق من تفاصيل المقارنة.</span></p>
    <p class="area-note"><i data-lucide="ruler" aria-hidden="true"></i><span>${esc(confidence(item))}.</span></p>
    <div class="opportunity-actions">
      <a class="button button-compact button-primary" href="tel:${esc(item.phone)}"><i data-lucide="phone" aria-hidden="true"></i>${esc(item.phone)}</a>
      <a class="button button-compact button-outline" href="${esc(item.url)}" target="_blank" rel="noopener"><i data-lucide="images" aria-hidden="true"></i>الصور والإعلان الأصلي</a>
    </div>
    <p class="advertiser-line">${esc(item.advertiser_type)} · الإعلان منقول من المصدر الأصلي · تحقق من توفره عند الاتصال</p>
  </article>`;
}

function renderOpportunities() {
  const areas = [...new Set(opportunities.map(item => item.area))];
  const title = "مخزون إعلانات عقارية للمراجعة";
  const description = "إعلانات عقارية منقولة من مصادرها الأصلية مع السعر والمساحة وسعر المتر. يجب التواصل مع المعلن للتأكد من التوفر.";
  const itemList = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: opportunities.length,
    itemListElement: opportunities.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      name: displayTitle(item)
    }))
  });
  return `${head({ title, description, pathname: "/opportunities/" })}
<body>
  ${header()}
  <main>
    <section class="content-hero opportunities-hero">
      <div class="wide-inner content-hero-grid">
        <div>
          <p class="section-kicker">مخزون الرصد العقاري</p>
          <h1>إعلانات عقارية مختارة للمراجعة</h1>
          <p>هذه إعلانات من مخزون الرصد وقد تتغير حالتها. نعرض بيانات المصدر كما جُمعت، ويجب الاتصال بالمعلن للتأكد من التوفر والتفاصيل قبل أي قرار.</p>
        </div>
        <div class="content-hero-stat"><strong>${opportunities.length}</strong><span>إعلاناً في مخزون المراجعة</span></div>
      </div>
    </section>
    <section class="opportunity-toolbar">
      <div class="wide-inner toolbar-inner">
        <div>
          <strong>تصفية حسب المنطقة</strong>
          <span id="result-count">${opportunities.length} إعلاناً</span>
        </div>
        <div class="filter-control" role="group" aria-label="تصفية الفرص حسب المنطقة">
          <button class="filter-button is-active" type="button" data-filter="all">الكل</button>
          ${areas.map(area => `<button class="filter-button" type="button" data-filter="${esc(area)}">${esc(area)}</button>`).join("")}
        </div>
      </div>
    </section>
    <section class="index-section">
      <div class="wide-inner">
        <div class="opportunity-list">
          ${opportunities.map(opportunityCard).join("\n")}
        </div>
        <div class="transparency-note opportunity-disclosure">
          <i data-lucide="shield-check" aria-hidden="true"></i>
          <div><strong>كيف تقرأ هذه الفرص؟</strong><p>النسب مبنية على مرجع أسعار العرض المتاح لدينا وليست تقييماً رسمياً. في الشقق الأرضية والروف نحسب سعر المتر على مساحة القوشان متى توفرت، ونفصل المساحات الخارجية. تحقق من توفر الإعلان والقوشان وحالة العقار قبل أي التزام.</p><a class="text-link" href="/guides/price-per-sqm/">اقرأ منهجية سعر المتر <i data-lucide="arrow-left" aria-hidden="true"></i></a></div>
        </div>
      </div>
    </section>
    ${joinBand("opportunities-index")}
  </main>
  ${footer()}
  <script type="application/ld+json">${itemList}</script>
</body>
</html>`;
}

write("guides/index.html", renderGuidesIndex());
for (const guide of guides) write(`guides/${guide.slug}/index.html`, renderGuide(guide));
write("opportunities/index.html", renderOpportunities());

const staticPaths = [
  "/",
  "/opportunities/",
  "/guides/",
  ...guides.map(guide => `/guides/${guide.slug}/`),
  "/projects/al-samik-gold-land/",
  "/contact/",
  "/privacy/",
  "/disclosure/"
];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths.map(pathname => `  <url><loc>${SITE}${pathname}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>`;
write("sitemap.xml", sitemap);

console.log(`Built ${guides.length} guides and ${opportunities.length} opportunities.`);
