import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guides = JSON.parse(fs.readFileSync(path.join(root, "data", "guides-v1.json"), "utf8"));
const opportunities = JSON.parse(fs.readFileSync(path.join(root, "data", "opportunities-v1.json"), "utf8"));
const opportunityMetaPath = path.join(root, "data", "opportunities-meta-v1.json");
const opportunityMeta = fs.existsSync(opportunityMetaPath) ? JSON.parse(fs.readFileSync(opportunityMetaPath, "utf8")) : null;

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
  const normalized = content.trim().replace(/[ \t]+(?=\r?\n)/g, "").replace(/\r?\n/g, "\r\n");
  fs.writeFileSync(output, normalized + "\r\n", "utf8");
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
  <link rel="stylesheet" href="/analytics.css">
  <script src="/analytics.js" defer></script>
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
    <a href="/opportunities/">شقق للبيع</a>
    <a href="/#lands">أراضٍ</a>
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
      <a href="/opportunities/">شقق للبيع</a>
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

const relatedGuideSlugs = {
  "price-per-sqm": ["read-listing-before-contact", "land-buying-checklist"],
  "read-listing-before-contact": ["price-per-sqm", "land-buying-checklist"],
  "land-buying-checklist": ["price-per-sqm", "sell-property-right"],
  "buying-remotely": ["land-buying-checklist", "price-per-sqm"],
  "property-handover-checklist": ["price-per-sqm", "sell-property-right"],
  "sell-property-right": ["price-per-sqm", "property-handover-checklist"]
};

function relatedGuides(guide) {
  const slugs = relatedGuideSlugs[guide.slug] || guides.filter(item => item.slug !== guide.slug).slice(0, 2).map(item => item.slug);
  const items = slugs.map(slug => guides.find(item => item.slug === slug)).filter(Boolean);
  return `<section class="related-guides" aria-labelledby="related-guides-title">
  <h2 id="related-guides-title">أدلة ذات صلة</h2>
  <div class="related-guide-grid">
    ${items.map(item => `<a href="/guides/${item.slug}/"><span>${esc(item.category)}</span><strong>${esc(item.title)}</strong><i data-lucide="arrow-left" aria-hidden="true"></i></a>`).join("\n")}
  </div>
  <a class="text-link" href="/guides/">تصفح كل الأدلة <i data-lucide="arrow-left" aria-hidden="true"></i></a>
</section>`;
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
        ${relatedGuides(guide)}
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
  const title = item.title.trim()
    .replaceAll("مغرري", "مغري")
    .replaceAll("حي الصاحبة", "حي الصحابة")
    .replaceAll("حي الصحابه", "حي الصحابة");
  if (/^Apartment for sale$/i.test(title)) return `شقة للبيع في ${item.area}`;
  if (/3 Bedrooms Apartment/i.test(title)) return `شقة 3 غرف نوم للبيع في ${item.area}`;
  if (/4 Bedrooms Apartment/i.test(title)) return `شقة 4 غرف نوم للبيع في ${item.area}`;
  if (/distinctive apartments/i.test(title)) return `شقق مميزة للبيع في ${item.area}`;
  if (/^Last floor with/i.test(title)) return `شقة طابق أخير مع روف للبيع في ${item.area}`;
  if (/^Roof for sale in Dabouq/i.test(title)) return "روف للبيع في دابوق مع ترس";
  if (/^Distinctive apartment for sale in Airport Road$/i.test(title)) return "شقة مميزة للبيع في طريق المطار";
  return title;
}

function confidence(item) {
  if (item.area_confidence === "deed_area_extracted") return "ذُكرت مساحة القوشان في بيانات المصدر";
  if (item.area_confidence === "needs_area_verification") return "يلزم التحقق من مساحة القوشان وفصل أي مساحة خارجية";
  return "سعر المتر محسوب على المساحة المعلنة ويحتاج مطابقة القوشان";
}

function pricePerSquareMeter(item) {
  if (item.area_confidence === "needs_area_verification") {
    return `<div><span>سعر المتر</span><strong>قيد التحقق</strong></div>`;
  }
  const label = item.area_confidence === "deed_area_extracted" ? "سعر المتر (القوشان)" : "سعر المتر (المعلن)";
  return `<div><span>${label}</span><strong>${number(item.ppm)} د.أ</strong></div>`;
}

function priceReading(item) {
  if (item.price_comparison_available === false || item.area_confidence === "needs_area_verification") {
    return `<p class="price-reading price-reading-caution"><i data-lucide="circle-alert" aria-hidden="true"></i><span><strong>قراءة السعر:</strong> لا نعرض مقارنة مرجعية قبل تأكيد مساحة القوشان وفصل أي مساحة خارجية.</span></p>`;
  }
  return `<p class="price-reading"><i data-lucide="badge-percent" aria-hidden="true"></i><span><strong>قراءة أولية:</strong> أقل من مرجع أسعار العرض المتاح بنحو ${esc(item.discount_vs_reference_pct)}%، مع ضرورة التحقق من تفاصيل المقارنة.</span></p>`;
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
      ${pricePerSquareMeter(item)}
    </div>
    <p class="opportunity-floor"><strong>الطابق:</strong> ${esc(item.floor)}</p>
    ${priceReading(item)}
    <p class="area-note"><i data-lucide="ruler" aria-hidden="true"></i><span>${esc(confidence(item))}.</span></p>
    <div class="opportunity-actions">
      <a class="button button-compact button-primary" href="tel:${esc(item.phone)}"><i data-lucide="phone" aria-hidden="true"></i>${esc(item.phone)}</a>
      <a class="button button-compact button-outline" href="${esc(item.url)}" target="_blank" rel="noopener"><i data-lucide="images" aria-hidden="true"></i>الصور والإعلان الأصلي</a>
    </div>
    <p class="advertiser-line">${esc(item.advertiser_type)} · الإعلان منقول من المصدر الأصلي · تحقق من توفره عند الاتصال</p>
  </article>`;
}

function sourceUpdateLabel() {
  if (!opportunityMeta?.source_updated_at) return "";
  return new Intl.DateTimeFormat("ar-JO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(opportunityMeta.source_updated_at));
}
function renderOpportunities() {
  const areas = [...new Set(opportunities.map(item => item.area))];
  const title = "مخزون إعلانات عقارية للمراجعة";
  const description = "إعلانات عقارية منقولة من مصادرها الأصلية مع السعر والمساحة وسعر المتر. يجب التواصل مع المعلن للتأكد من التوفر.";
  const sourceUpdate = sourceUpdateLabel();
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
          ${sourceUpdate ? `<p class="content-source-note"><i data-lucide="history" aria-hidden="true"></i><span>آخر تغيير محفوظ في بيانات المصدر: ${sourceUpdate}. لا يعني ذلك ضمان أن الإعلان ما زال متاحاً.</span></p>` : ""}
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

function homepageOpportunityCandidates() {
  const selectedAreas = new Set();
  return opportunities
    .filter(item => item.price_comparison_available !== false && item.area_confidence !== "needs_area_verification")
    .sort((left, right) => Number(right.discount_vs_reference_pct || 0) - Number(left.discount_vs_reference_pct || 0))
    .filter((item) => {
      if (selectedAreas.has(item.area)) return false;
      selectedAreas.add(item.area);
      return true;
    })
    .slice(0, 3);
}

function homepageOpportunityCard(item) {
  const floor = item.floor && item.floor !== "الطابق غير مذكور" ? ` · ${esc(item.floor)}` : "";
  return `<article class="home-opportunity">
            <p class="content-meta">${esc(item.area)}${floor}</p>
            <h3>${esc(displayTitle(item))}</h3>
            <dl><div><dt>السعر</dt><dd>${number(item.price)} د.أ</dd></div><div><dt>المساحة</dt><dd>${number(item.size)} م²</dd></div><div><dt>سعر المتر</dt><dd>${number(item.ppm)} د.أ</dd></div></dl>
            <a class="text-link" href="${esc(item.url)}" target="_blank" rel="noopener">التفاصيل والمصدر <i data-lucide="arrow-left" aria-hidden="true"></i></a>
          </article>`;
}

function refreshHomepageOpportunities() {
  const output = path.join(root, "index.html");
  const current = fs.readFileSync(output, "utf8");
  const start = "<!-- GENERATED:HOME_OPPORTUNITIES:START -->";
  const end = "<!-- GENERATED:HOME_OPPORTUNITIES:END -->";
  const cards = homepageOpportunityCandidates().map(homepageOpportunityCard).join("\n");
  if (!cards || !current.includes(start) || !current.includes(end)) {
    throw new Error("Homepage opportunity markers or eligible opportunities are missing.");
  }
  const refreshed = current.replace(
    new RegExp(`${start}[\\s\\S]*?${end}`),
    `${start}\n          ${cards}\n          ${end}`
  );
  write("index.html", refreshed);
}

write("guides/index.html", renderGuidesIndex());
for (const guide of guides) write(`guides/${guide.slug}/index.html`, renderGuide(guide));
write("opportunities/index.html", renderOpportunities());
refreshHomepageOpportunities();

// Project pages are discovered from disk, not listed by hand: the sitemap is
// rewritten wholesale on every build and pushed by the sync workflow, so a
// hand-maintained list silently drops any page nobody remembered to add here.
function projectPaths() {
  const dir = path.join(root, "projects");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, "index.html")))
    .map(entry => `/projects/${entry.name}/`)
    .sort();
}

const staticPaths = [
  "/",
  "/opportunities/",
  "/guides/",
  ...guides.map(guide => `/guides/${guide.slug}/`),
  ...projectPaths(),
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
