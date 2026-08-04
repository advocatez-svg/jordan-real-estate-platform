(function () {
  var params = new URLSearchParams(window.location.search);
  var ref = (params.get("ref") || "").toLowerCase();
  var legacySource = (params.get("src") || "").toLowerCase();
  var source = ref === "01" ? "uae" : ref === "02" ? "ksa" : legacySource;

  var messages = {
    uae: "مرحباً، شاهدت إعلان مشروع السامك جولد لاند وأرغب بمعرفة التفاصيل والأسعار.",
    ksa: "السلام عليكم ورحمة الله وبركاته، شاهدت إعلان مشروع السامك جولد لاند في الأردن وأرغب بمعرفة التفاصيل والأسعار.",
    default: "مرحباً، شاهدت مشروع السامك جولد لاند وأرغب بمعرفة التفاصيل والأسعار."
  };

  var message = messages[source] || messages.default;
  var whatsappUrl = "https://wa.me/971544996724?text=" + encodeURIComponent(message);

  document.querySelectorAll("[data-whatsapp]").forEach(function (link) {
    link.href = whatsappUrl;
    link.rel = "noopener";
    link.target = "_blank";
  });

  if (window.lucide) {
    window.lucide.createIcons({ "stroke-width": 1.8 });
  }
}());
