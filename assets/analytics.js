/** GA4 click events — gtag is loaded from index.html <head> */
(function () {
  if (typeof window.gtag !== "function") return;

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link) return;

    if (link.classList.contains("btn-zip")) {
      gtag("event", "file_download", {
        event_category: "download",
        event_label: "beta_zip",
        link_url: link.href,
      });
      return;
    }

    var href = link.getAttribute("href") || "";
    if (href === "#download") {
      gtag("event", "cta_click", {
        event_category: "navigation",
        event_label: "download_nav",
      });
    }
  });
})();
