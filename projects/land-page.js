/* land-page.js — سلوك مشترك لصفحات الأراضي المفردة.
   يطابق منطق صفحة السامك: ref=01 → رسالة الإمارات · ref=02 → رسالة السعودية.
   اسم العقار يُقرأ من data-property-label على <body> فلا يتكرر الملف لكل صفحة. */
(function () {
  var UAE = "971544996724";
  var JORDAN = "962796925269";

  var label = document.body.getAttribute("data-property-label") || "العقار المعروض";

  var params = new URLSearchParams(window.location.search);
  var ref = (params.get("ref") || "").toLowerCase();
  var legacySource = (params.get("src") || "").toLowerCase();
  var source = ref === "01" ? "uae" : ref === "02" ? "ksa" : legacySource;

  var messages = {
    uae: "مرحباً، شاهدت إعلان " + label + " وأرغب بمعرفة التفاصيل والأسعار.",
    ksa: "السلام عليكم ورحمة الله وبركاته، شاهدت إعلان " + label + " في الأردن وأرغب بمعرفة التفاصيل والأسعار.",
    default: "مرحباً، شاهدت " + label + " وأرغب بمعرفة التفاصيل والأسعار."
  };

  var message = messages[source] || messages.default;
  var encoded = encodeURIComponent(message);

  function wire(selector, number) {
    document.querySelectorAll(selector).forEach(function (link) {
      link.href = "https://wa.me/" + number + "?text=" + encoded;
      link.rel = "noopener";
      link.target = "_blank";
    });
  }

  wire("[data-whatsapp]", UAE);
  wire("[data-whatsapp-jo]", JORDAN);

  if (window.lucide) {
    window.lucide.createIcons({ "stroke-width": 1.8 });
  }
}());
