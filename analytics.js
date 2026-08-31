(function () {
  "use strict";

  var MEASUREMENT_ID = "G-P4D45H4MQC";
  var META_PIXEL_ID = "1604301121361456";
  var metaReady = /^\d{10,20}$/.test(META_PIXEL_ID);
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
    var ref = params.get("ref");
    return ref && /^[a-z0-9_-]{1,20}$/i.test(ref) ? ref : "direct";
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
      source_ref: currentSource()
    });
  }

  function startMetaPixel() {
    if (!metaReady || window.fbq) {
      return;
    }

    try {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

      window.fbq("init", META_PIXEL_ID);
      window.fbq("track", "PageView");
    } catch (error) {
      // Analytics must never interfere with site use.
    }
  }

  function sendWhatsAppLead(link) {
    if (!metaReady || !window.fbq || !link) {
      return;
    }

    try {
      var href = link.getAttribute("href") || "";
      var market = /wa\.me\/?\+?971/.test(href) ? "uae"
        : /wa\.me\/?\+?962/.test(href) ? "jo"
          : "unknown";

      window.fbq("track", "Lead", {
        content_name: document.body.getAttribute("data-property-label") ||
          (document.title || "").split("|")[0].trim() ||
          window.location.pathname,
        content_category: "whatsapp_click",
        market: market,
        ref: currentSource(),
        page: window.location.pathname
      });
    } catch (error) {
      // A measurement failure must never cost a WhatsApp conversation.
    }
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

    startMetaPixel();

    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || !target.closest) {
        return;
      }

      sendWhatsAppLead(target.closest('a[href*="wa.me"]'));
    }, true);
  }

  function initialize() {
    startTracking();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
}());
