import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const opportunities = JSON.parse(fs.readFileSync(path.join(root, "data", "opportunities-v1.json"), "utf8"));
const meta = JSON.parse(fs.readFileSync(path.join(root, "data", "opportunities-meta-v1.json"), "utf8"));
const output = process.env.OUTPUT_FILE || path.join(root, "operations", "current-group-posts-v1.md");
const startDate = new Date(`${process.env.START_DATE || "2026-08-17"}T12:00:00Z`);
const times = ["3:00 PM", "6:00 PM", "9:00 PM"];
const sourceDate = new Intl.DateTimeFormat("ar-JO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(meta.source_updated_at));

function number(value) {
  return new Intl.NumberFormat("en-US").format(Number(value));
}

function title(item) {
  if (item.floor === "أرضي") return `شقة أرضية للبيع - ${item.area}`;
  if (item.floor === "روف") return `شقة روف للبيع - ${item.area}`;
  return `شقة للبيع - ${item.area}`;
}

function scheduleFor(index) {
  const date = new Date(startDate);
  date.setUTCDate(date.getUTCDate() + Math.floor(index / times.length));
  return {
    iso: date.toISOString().slice(0, 10),
    time: times[index % times.length],
    day: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(date)
  };
}

function meterLine(item) {
  if (item.area_confidence === "needs_area_verification") {
    return "💵 سعر المتر: قيد التحقق، لأن مساحة القوشان وفصل أي مساحة خارجية غير مؤكدين في المصدر.";
  }
  if (item.area_confidence === "deed_area_extracted") {
    return `💵 سعر المتر حسب مساحة القوشان: حوالي ${number(item.ppm)} دينار/م²`;
  }
  return `💵 سعر المتر حسب المساحة المعلنة: حوالي ${number(item.ppm)} دينار/م²`;
}

function priceReading(item) {
  if (item.price_comparison_available === false || item.area_confidence === "needs_area_verification") {
    return "📊 قراءة السعر: لا ننشر مقارنة مرجعية قبل تأكيد مساحة القوشان وفصل المساحات الخارجية عن المساحة الداخلية.";
  }
  return `📊 قراءة السعر: حسب مرجع أسعار العرض المتاح لدينا، السعر المعلن أقل بنحو ${item.discount_vs_reference_pct}% مع ضرورة مطابقة المساحة وحالة العقار قبل أي قرار.`;
}

function post(item, index) {
  const slot = scheduleFor(index);
  const trackingUrl = `https://jordanpropertyjo.com/opportunities/?utm_source=facebook&utm_medium=organic&utm_campaign=group_inventory_aug17&utm_content=post_${String(index + 1).padStart(2, "0")}`;
  return `## Post ${String(index + 1).padStart(2, "0")} — ${slot.day} ${slot.iso} — ${slot.time}\n\n` +
`**Destination:** منصة العقارات الأردنية | Jordan Real Estate Platform  \n` +
`**Publisher:** Jordan Real Estate Managers  \n` +
`**Timezone:** Asia/Amman\n\n` +
`🔥 إعلان عقاري منقول من المصدر الأصلي\n` +
`🏷️ العنوان: ${title(item)}\n` +
`📍 الموقع: ${item.area}\n` +
`💰 السعر: ${number(item.price)} دينار\n` +
`📐 المساحة المذكورة: ${number(item.size)} متر مربع\n` +
`${meterLine(item)}\n` +
`🏘️ نوع العقار: شقة للبيع\n` +
`🪜 معلومات إضافية: الطابق: ${item.floor}\n` +
`👤 المالك/الوسيط: ${item.advertiser_type}\n` +
`📞 للتواصل مع المعلن: ${item.phone}\n\n` +
`${priceReading(item)}\n\n` +
`🔎 ملاحظة شفافية:\n` +
`ننقل بيانات هذا الإعلان من المصدر الأصلي. آخر تغيير محفوظ في بيانات المصدر: ${sourceDate}. يجب التأكد من التوفر، القوشان، المساحة الفعلية، وحالة العقار مباشرةً قبل اتخاذ قرار الشراء.\n\n` +
`تابعوا دليل المنصة وصفحة الفرص للمقارنة العملية:\n` +
`${trackingUrl}\n\n` +
`قناة الفرص العقارية على تيلجرام:\n` +
`https://t.me/+MRS4fjIbDbVmOWRk\n\n` +
`لمشاهدة الصور والتفاصيل الأصلية راجع رابط الإعلان:\n` +
`${item.url}\n`;
}

const schedule = opportunities.map((item, index) => {
  const slot = scheduleFor(index);
  const trackingUrl = `https://jordanpropertyjo.com/opportunities/?utm_source=facebook&utm_medium=organic&utm_campaign=group_inventory_aug17&utm_content=post_${String(index + 1).padStart(2, "0")}`;
  return `| ${String(index + 1).padStart(2, "0")} | ${slot.iso} | ${slot.time} | ${item.area} | ${item.floor} |`;
}).join("\n");
const posts = opportunities.map(post).join("\n---\n\n");
const content = `# دفعة منشورات المجموعة من مخزون الرصد — v1\n\n## المصدر والتوقيت\n\n- مصدر البيانات: commit ${meta.source_commit.slice(0, 7)} من ${meta.source_ref}.\n- آخر تغيير محفوظ في المصدر: ${sourceDate}.\n- الناشر: Jordan Real Estate Managers.\n- الوجهة: مجموعة منصة العقارات الأردنية | Jordan Real Estate Platform فقط.\n- لا تنشر هذه الدفعة في Facebook Page أو Instagram.\n- كل إعلان ينتهي بالرابط الأصلي لمشاهدة الصور، ولا يوصف بأنه متاح بلا تأكيد مباشر من المعلن.\n\n## الجدول\n\n| المنشور | التاريخ | الوقت | المنطقة | الطابق |\n|---:|---|---|---|---|\n${schedule}\n\n---\n\n${posts}`;
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${content.replace(/[ \t]+(?=\r?\n)/g, "")}\n`, "utf8");
console.log(`Wrote ${opportunities.length} group posts to ${output}.`);