import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const ignoredDirs = new Set([".git", "node_modules", "operations"]);
const failures = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith(".") || ignoredDirs.has(entry.name)) return [];
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function fail(message) {
  failures.push(message);
}

function resolvePublicPath(value, htmlFile) {
  const clean = value.split(/[?#]/, 1)[0];
  if (!clean || /^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(clean)) return null;
  const target = clean.startsWith("/")
    ? path.join(root, clean.replace(/^\/+/, ""))
    : path.resolve(path.dirname(htmlFile), clean);
  if (path.extname(target)) return target;
  return path.join(target, "index.html");
}

const files = walk(root);
const htmlFiles = files.filter(file => file.endsWith(".html"));

for (const file of files.filter(file => /\.(?:html|css|js|mjs|json|xml)$/i.test(file))) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  if (text.includes("\uFFFD")) fail(`${relative}: contains replacement characters`);
  if (text.includes("?".repeat(3))) fail(`${relative}: contains suspicious question-mark corruption`);
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${relative}: missing a non-empty title`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = resolvePublicPath(match[1], file);
    if (target && !fs.existsSync(target)) fail(`${relative}: missing local target ${match[1]}`);
  }
}

const opportunities = JSON.parse(fs.readFileSync(path.join(root, "data", "opportunities-v1.json"), "utf8"));
const guides = JSON.parse(fs.readFileSync(path.join(root, "data", "guides-v1.json"), "utf8"));
const opportunityMeta = JSON.parse(fs.readFileSync(path.join(root, "data", "opportunities-meta-v1.json"), "utf8"));
if (!/^[0-9a-f]{40}$/i.test(String(opportunityMeta.source_commit || ""))) fail("opportunity metadata has no valid source commit");
if (opportunityMeta.total !== opportunities.length) fail("opportunity metadata total does not match data");
for (const item of opportunities.filter(item => item.area_confidence === "needs_area_verification")) {
  if (item.ppm || item.discount_vs_reference_pct || item.price_comparison_available !== false) fail(`ambiguous opportunity ${item.post_number} exposes an unsupported price comparison`);
}
if (opportunities.length !== 21) fail(`expected 21 opportunities, found ${opportunities.length}`);
if (guides.length < 6) fail(`expected at least 6 guides, found ${guides.length}`);
for (const guide of guides) {
  if (!guide.slug || !guide.title || !guide.image || !Array.isArray(guide.sections) || !guide.sections.length) fail(`invalid guide data: ${guide.slug || "unknown"}`);
  const guideHtml = path.join(root, "guides", guide.slug, "index.html");
  if (!fs.existsSync(guideHtml)) fail(`guide page missing: ${guide.slug}`);
  if (!fs.existsSync(path.join(root, guide.image.replace(/^\/+/, "")))) fail(`guide image missing: ${guide.image}`);
}

const opportunitiesHtml = fs.readFileSync(path.join(root, "opportunities", "index.html"), "utf8");
const cardCount = (opportunitiesHtml.match(/class="opportunity-card"/g) || []).length;
const phoneCount = (opportunitiesHtml.match(/href="tel:/g) || []).length;
if (cardCount !== opportunities.length) fail(`opportunity card count is ${cardCount}`);
if (phoneCount !== opportunities.length) fail(`opportunity phone-link count is ${phoneCount}`);

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const match of sitemap.matchAll(/<loc>https:\/\/jordanpropertyjo\.com(.*?)<\/loc>/g)) {
  const publicPath = match[1] || "/";
  const target = publicPath === "/"
    ? path.join(root, "index.html")
    : path.join(root, publicPath.replace(/^\/+|\/+$/g, ""), "index.html");
  if (!fs.existsSync(target)) fail(`sitemap target missing: ${publicPath}`);
}

if (failures.length) {
  console.error(`QA failed with ${failures.length} issue(s):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`QA passed: ${htmlFiles.length} HTML pages, ${opportunities.length} opportunities, ${guides.length} guides.`);
