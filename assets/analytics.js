/**
 * GA4 — data-measurement-id 에 G-XXXXXXXXXX 를 넣으면 활성화됩니다.
 * 비어 있거나 placeholder 이면 아무 것도 로드하지 않습니다.
 */
(function () {
  var script = document.currentScript;
  var id = (script && script.getAttribute("data-measurement-id")) || "";
  if (!id || !/^G-[A-Z0-9]{6,}$/i.test(id)) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id, { anonymize_ip: true });

  var loader = document.createElement("script");
  loader.async = true;
  loader.src =
    "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(loader);

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link || typeof gtag !== "function") return;

    if (link.classList.contains("btn-zip")) {
      gtag("event", "file_download", {
        event_category: "download",
        event_label: "beta_zip",
        link_url: link.href,
      });
      return;
    }

    if (link.classList.contains("btn-workshop")) {
      gtag("event", "workshop_apply", {
        event_category: "workshop",
        event_label: "gmail_apply",
      });
      return;
    }

    var href = link.getAttribute("href") || "";
    if (href === "#download") {
      gtag("event", "cta_click", {
        event_category: "navigation",
        event_label: "download_nav",
      });
    } else if (href === "#workshop") {
      gtag("event", "cta_click", {
        event_category: "navigation",
        event_label: "workshop_nav",
      });
    }
  });
})();
