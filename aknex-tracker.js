/**
 * AKNEX Core Universal Telemetry & Feedback SDK
 * Auto-detects sites, tracks visitor metrics/clicks, and handles dynamic forms.
 */
(function () {
  const API_BASE = "https://feedback.adhavanmasscoc.workers.dev";

  // Auto-map domains to your Cloudflare D1 site IDs
  const SITE_MAP = {
    "labanswer.vercel.app": "site_lab_manual",
    "aadhavan-k.vercel.app": "site_portfolio",
    "aknex-ai.vercel.app": "site_aknex_ai",
    "aknex.ai": "site_aknex_ai",
    "www.aknex.ai": "site_aknex_ai",
    "aknex.vercel.app": "site_aknex_main",
    "aknex-official.vercel.app": "site_aknex_official",
    "citfoodfinder.com": "site_cit_food",
    "www.citfoodfinder.com": "site_cit_food",
    "railflow-java.vercel.app": "site_railflow",
    "aknex-railflow.vercel.app": "site_railflow",
    "aknex-crowdiq.vercel.app": "site_crowdiq",
    "aknex-tools.vercel.app": "site_ultra_tools",
    "cit-connect-topaz.vercel.app": "site_cit_connect"
  };

  // Determine site ID via data attribute or current hostname
  const scriptTag = document.currentScript;
  const configuredSiteId = scriptTag ? scriptTag.getAttribute("data-site") : null;
  const currentHost = window.location.hostname;
  const siteId = configuredSiteId || SITE_MAP[currentHost] || "site_lab_manual";

  // Safe beacon sender (runs in background without freezing UI)
  function sendBeacon(endpoint, data) {
    const payload = JSON.stringify({ site_id: siteId, page_url: window.location.href, ...data });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${API_BASE}${endpoint}`, payload);
    } else {
      fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  }

  // 1. Telemetry: Track page arrival
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => sendBeacon("/api/v1/telemetry", { event_type: "pageview" }));
  } else {
    sendBeacon("/api/v1/telemetry", { event_type: "pageview" });
  }

  // 2. Telemetry: Track all button & link interactions
  document.addEventListener("click", function (event) {
    const target = event.target.closest("button, a, input[type='button'], input[type='submit']");
    if (!target) return;

    // Ignore clicks inside the feedback box to avoid telemetry spam
    if (target.closest(".feedback-box") || target.classList.contains("btn-submit")) return;

    const label = (target.innerText || target.value || target.getAttribute("aria-label") || target.title || "")
      .trim()
      .slice(0, 60);

    sendBeacon("/api/v1/telemetry", {
      event_type: "click",
      element_tag: target.tagName,
      element_id: target.id || null,
      element_text: label || "Unlabeled Element"
    });
  }, true);

  // 3. Global Feedback Submission Engine
  window.AKNEX = window.AKNEX || {};
  window.AKNEX.submitFeedback = async function (customData = {}) {
    // Dynamically detect fields on the page if not explicitly supplied
    let userIdentifier = customData.name || customData.email || "";
    let messageText = customData.message || customData.feedback || "";
    let ratingVal = customData.rating || null;
    let categoryVal = customData.category || "general";

    if (!userIdentifier) {
      const nameElem = document.getElementById("name") || 
                       document.querySelector("input[name='name']") || 
                       document.querySelector("input[type='email']");
      if (nameElem) userIdentifier = nameElem.value.trim();
    }

    if (!messageText) {
      const msgElem = document.getElementById("feedback") || 
                      document.getElementById("message") || 
                      document.querySelector("textarea");
      if (msgElem) messageText = msgElem.value.trim();
    }

    if (!messageText) {
      throw new Error("Message field is empty");
    }

    const isEmail = userIdentifier.includes("@");

    const payload = {
      site_id: siteId,
      message: messageText,
      user_name: isEmail ? null : (userIdentifier || "Anonymous"),
      user_email: isEmail ? userIdentifier : null,
      rating: ratingVal ? parseInt(ratingVal, 10) : null,
      category: categoryVal,
      page_url: window.location.href,
      page_title: document.title
    };

    const res = await fetch(`${API_BASE}/api/v1/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorResponse = await res.json().catch(() => ({}));
      throw new Error(errorResponse.error || "Failed to submit feedback");
    }

    return await res.json();
  };
})();
