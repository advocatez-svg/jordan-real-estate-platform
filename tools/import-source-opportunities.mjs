import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = process.env.SOURCE_REPO || path.resolve(root, "..", "FROM-THE-FUTURE");
const sourceRef = process.env.SOURCE_REF || "origin/main";
const git = process.env.GIT_BIN || "git";
const sourceFiles = [
  { file: "data/top_deals.json", bucket: "ground-roof", limit: 5 },
  { file: "data/standard_floor_top_deals.json", bucket: "standard-floor", limit: 8 },
  { file: "data/middle_class_top_deals.json", bucket: "middle-class", limit: 8 }
];

function gitShow(file) {
  return execFileSync(git, ["-C", sourceRoot, "show", `${sourceRef}:${file}`], { encoding: "utf8" });
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function suspiciousDeedArea(item) {
  const advertised = number(item.advertised_size);
  const internal = number(item.internal_size);
  const title = String(item.title || "");
  return internal > advertised && advertised > 0 && /رقم\s*(الشقه|الشقة)|apartment\s*no/i.test(title);
}

function normalize(item, bucket, postNumber) {
  const advertised = number(item.advertised_size);
  const suspicious = suspiciousDeedArea(item);
  const confidence = suspicious ? "needs_area_verification" : (item.area_confidence || "advertised_area_only");
  const pricingSize = suspicious && advertised ? advertised : number(item.size);
  const price = number(item.price);
  const priceComparisonAvailable = confidence !== "needs_area_verification" && pricingSize > 0;
  return {
    post_number: String(postNumber),
    area: String(item.area || "غير محدد"),
    floor: String(item.ft || "غير مذكور بوضوح في الإعلان الأصلي"),
    price: String(price),
    size: String(pricingSize),
    ppm: priceComparisonAvailable ? String(Math.round(price / pricingSize)) : "",
    discount_vs_reference_pct: priceComparisonAvailable ? String(Math.min(100, Math.abs(Math.round(number(item.diff))))) : "",
    price_comparison_available: priceComparisonAvailable,
    phone: String(item.phone || "").replace(/\s+/g, ""),
    advertiser_type: String(item.advertiser_type || "غير محدد"),
    area_confidence: confidence,
    source: String(item.src || "المصدر الأصلي"),
    title: String(item.title || "إعلان عقاري"),
    url: String(item.url || ""),
    source_bucket: bucket
  };
}

function isEligible(item) {
  return number(item.price) >= 20000
    && number(item.size) >= 40
    && number(item.size) <= 650
    && number(item.ppm) > 0
    && String(item.phone || "").replace(/\s+/g, "").length >= 8
    && /^https?:\/\//i.test(String(item.url || ""))
    && !/\bsold\b|تم البيع/i.test(String(item.title || ""));
}

function sortDeals(items) {
  return [...items].sort((a, b) => {
    const difference = number(a.diff) - number(b.diff);
    if (difference !== 0) return difference;
    return number(a.ppm) - number(b.ppm);
  });
}

const selected = [];
const seenUrls = new Set();
const counts = {};

for (const stream of sourceFiles) {
  const records = JSON.parse(gitShow(stream.file));
  let added = 0;
  for (const item of sortDeals(records)) {
    if (added >= stream.limit || !isEligible(item) || seenUrls.has(item.url)) continue;
    const normalized = normalize(item, stream.bucket, selected.length + 1);
    selected.push(normalized);
    seenUrls.add(item.url);
    added += 1;
  }
  counts[stream.bucket] = added;
}

if (selected.length !== 21) {
  throw new Error(`Expected 21 eligible opportunities, found ${selected.length}.`);
}

const [commit, updatedAt] = execFileSync(git, ["-C", sourceRoot, "log", "-1", "--format=%H|%cI", sourceRef], { encoding: "utf8" }).trim().split("|");
const meta = {
  schema_version: 1,
  source_ref: sourceRef,
  source_commit: commit,
  source_updated_at: updatedAt,
  source_files: sourceFiles.map(stream => stream.file),
  selected_counts: counts,
  total: selected.length
};

fs.writeFileSync(path.join(root, "data", "opportunities-v1.json"), `${JSON.stringify(selected, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(root, "data", "opportunities-meta-v1.json"), `${JSON.stringify(meta, null, 2)}\n`, "utf8");
console.log(`Imported ${selected.length} opportunities from ${commit.slice(0, 7)}: ${JSON.stringify(counts)}.`);