(function () {
  "use strict";

  function clean(value) {
    if (!value) {
      return "";
    }

    return String(value).replace(/[^a-zA-Z0-9_.:-]/g, "_").substring(0, 80);
  }

  function eventName(link) {
    var metric = clean(link.getAttribute("data-metric"));
    var product = clean(link.getAttribute("data-metric-product"));
    var type = clean(link.getAttribute("data-metric-type"));

    var parts = [];

    if (metric) {
      parts.push(metric);
    }

    if (product) {
      parts.push(product);
    }

    if (type) {
      parts.push(type);
    }

    if (parts.length === 0) {
      return "";
    }

    return parts.join("_");
  }

  function dispatchMetric(name) {
    if (!name) {
      return;
    }

    if (window.plausible && typeof window.plausible === "function") {
      window.plausible(name);
      return;
    }

    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name);
      return;
    }

    if (window.gtag && typeof window.gtag === "function") {
      window.gtag("event", name);
    }
  }

  function handleMetricClick(event) {
    var link = event.currentTarget;
    dispatchMetric(eventName(link));
  }

  document.addEventListener("DOMContentLoaded", function () {
    var links = document.querySelectorAll("[data-metric]");

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", handleMetricClick);
    }
  });
})();
