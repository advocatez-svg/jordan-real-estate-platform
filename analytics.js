(function () {
  "use strict";

  var MEASUREMENT_ID = "G-P4D45H4MQC";
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

  function initialize() {
    startTracking();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
}());
