(function () {
  "use strict";

  function localOrigin() {
    return "http://localhost:8088";
  }

  function normalizePath(path) {
    if (!path) {
      return "";
    }

    if (path.charAt(0) !== "/") {
      return "/" + path;
    }

    return path;
  }

  function launchWebApp(event) {
    var link = event.currentTarget;
    var appPath = normalizePath(link.getAttribute("data-webapp-path"));

    if (!appPath) {
      return;
    }

    if (window.location.protocol === "file:") {
      event.preventDefault();
      window.location.href = localOrigin() + appPath;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var links = document.querySelectorAll("[data-webapp-launch='true']");

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", launchWebApp);
    }
  });
})();