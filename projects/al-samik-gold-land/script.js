(function () {
  var params = new URLSearchParams(window.location.search);
  var ref = (params.get("ref") || "").toLowerCase();
  var legacySource = (params.get("src") || "").toLowerCase();
  var source = ref === "01" ? "uae" : ref === "02" ? "ksa" : legacySource;
  var whatsappNumbers = {
    uae: "971544996724",
    jordan: "962796925269"
  };
  var messages = {
    details: {
      uae: "مرحباً، شاهدت إعلان مشروع السامك جولد لاند وأرغب بمعرفة التفاصيل والأسعار.",
      ksa: "السلام عليكم ورحمة الله وبركاته، شاهدت إعلان مشروع السامك جولد لاند في الأردن وأرغب بمعرفة التفاصيل والأسعار.",
      default: "مرحباً، شاهدت مشروع السامك جولد لاند وأرغب بمعرفة التفاصيل والأسعار."
    },
    visit: {
      uae: "مرحباً، شاهدت مشروع السامك جولد لاند وأرغب بترتيب زيارة للمشروع.",
      ksa: "السلام عليكم ورحمة الله وبركاته، شاهدت مشروع السامك جولد لاند في الأردن وأرغب بترتيب زيارة للمشروع.",
      default: "مرحباً، شاهدت مشروع السامك جولد لاند وأرغب بترتيب زيارة للمشروع."
    },
    investment: {
      uae: "مرحباً، شاهدت مشروع السامك جولد لاند وأرغب بمعرفة تفاصيل الاستثمار في المشروع.",
      ksa: "السلام عليكم ورحمة الله وبركاته، شاهدت مشروع السامك جولد لاند في الأردن وأرغب بمعرفة تفاصيل الاستثمار في المشروع.",
      default: "مرحباً، شاهدت مشروع السامك جولد لاند وأرغب بمعرفة تفاصيل الاستثمار في المشروع."
    }
  };
  var marketCopy = {
    uae: {
      kicker: "للمهتمين من الإمارات",
      copy: "فرصة امتلاك أرض سكنية في الأردن، مع معلومات واضحة وخطوة عملية لترتيب زيارة المشروع.",
      assurance: "ابدأ من الموقع والمعلومات الواضحة، ثم رتّب زيارتك في الوقت المناسب لك."
    },
    ksa: {
      kicker: "للمهتمين من السعودية",
      copy: "مشروع أراضٍ سكنية في الأردن، مع معلومات واضحة وخطوة عملية لترتيب زيارة المشروع.",
      assurance: "ابدأ من الموقع والمعلومات الواضحة، ثم رتّب زيارتك في الوقت المناسب لك."
    }
  };

  function messageFor(intent) {
    var set = messages[intent] || messages.details;
    return set[source] || set.default;
  }

  function configureWhatsApp(selector, number) {
    document.querySelectorAll(selector).forEach(function (link) {
      var intent = link.getAttribute("data-whatsapp-intent") || "details";
      link.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(messageFor(intent));
      link.rel = "noopener";
      link.target = "_blank";
    });
  }

  configureWhatsApp("[data-whatsapp]", whatsappNumbers.uae);
  configureWhatsApp("[data-whatsapp-jo]", whatsappNumbers.jordan);

  if (marketCopy[source]) {
    Object.keys(marketCopy[source]).forEach(function (key) {
      document.querySelectorAll("[data-market-" + key + "]").forEach(function (element) {
        element.textContent = marketCopy[source][key];
      });
    });
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-conversion]");

    if (!target) {
      return;
    }

    window.dispatchEvent(new CustomEvent("jrep:conversion", {
      detail: {
        name: target.getAttribute("data-conversion"),
        project: "al-samik-gold-land",
        source: source || "direct"
      }
    }));
  });

  if (window.lucide) {
    window.lucide.createIcons({ "stroke-width": 1.8 });
  }
}());
