(function () {
  "use strict";

  var MEASUREMENT_ID = "G-P4D45H4MQC";
  var CONSENT_KEY = "jrep-analytics-consent-v1";
  var trackingStarted = false;

  function normalizeEventName(value) {
    var normalized = String(value || "conversion")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40);

    return /^[a-z]/.test(normalized) ? normalized : "conversion_" + normalized;
  }

  function currentSource() {
    var params = new URLSearchParams(window.location.search);
    return params.get("ref") || params.get("src") || "direct";
  }

  function gtag() {
    window.dataLayer.push(arguments);
  }

  function sendConversion(target) {
    if (!trackingStarted || !target) {
      return;
    }

    gtag("event", normalizeEventName(target.getAttribute("data-conversion")), {
      conversion_label: target.getAttribute("data-conversion"),
      page_path: window.location.pathname,
      source_ref: currentSource(),
      link_text: (target.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100)
    });
  }

  function startTracking() {
    if (trackingStarted) {
      return;
    }

    trackingStarted = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || gtag;
    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID, { send_page_view: true });

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);

    document.addEventListener("click", function (event) {
      sendConversion(event.target.closest("[data-conversion]"));
    });
  }

  function createBanner() {
    if (document.querySelector(".analytics-consent")) {
      return document.querySelector(".analytics-consent");
    }

    var banner = document.createElement("section");
    banner.className = "analytics-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "اختيار التحليلات");
    banner.innerHTML =
      '<div class="analytics-consent__content">' +
        '<strong>تحسين تجربة الموقع</strong>' +
        '<p>نستخدم Google Analytics لفهم الصفحات والأزرار المفيدة. لا نقرأ رسائل واتساب ولا نرسل أرقام الهواتف إلى Google.</p>' +
      '</div>' +
      '<div class="analytics-consent__actions">' +
        '<button type="button" class="analytics-consent__accept">السماح بالتحليلات</button>' +
        '<button type="button" class="analytics-consent__reject">الاستمرار بدون تحليلات</button>' +
        '<a href="/privacy/">الخصوصية</a>' +
      '</div>';

    banner.querySelector(".analytics-consent__accept").addEventListener("click", function () {
      window.localStorage.setItem(CONSENT_KEY, "granted");
      banner.remove();
      startTracking();
    });

    banner.querySelector(".analytics-consent__reject").addEventListener("click", function () {
      window.localStorage.setItem(CONSENT_KEY, "denied");
      banner.remove();
    });

    document.body.appendChild(banner);
    return banner;
  }

  function openPreferences() {
    var banner = createBanner();
    banner.querySelector(".analytics-consent__accept").focus();
  }

  function initialize() {
    var consent = window.localStorage.getItem(CONSENT_KEY);

    if (consent === "granted") {
      startTracking();
    } else if (consent !== "denied") {
      createBanner();
    }

    document.querySelectorAll("[data-analytics-preferences]").forEach(function (button) {
      button.addEventListener("click", openPreferences);
    });
  }

  window.JREPAnalytics = { openPreferences: openPreferences };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
}());
