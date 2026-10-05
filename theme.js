/**
 * Universal Lab Manual Theme Controller
 * Seamlessly manages light & dark modes with persistent local preference,
 * zero-FOUC (Flash of Unstyled Content) detection, and multi-page sync.
 */
(function () {
  const STORAGE_KEY = "lab_theme";

  // 1. Immediately apply theme before page paints
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = saved || (systemPrefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", initialTheme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }

  // 2. Global Toggle API
  window.toggleSiteTheme = function () {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
    updateToggleButtons(next);
  };

  function updateToggleButtons(theme) {
    const btns = document.querySelectorAll(".theme-toggle-btn");
    btns.forEach(btn => {
      const icon = btn.querySelector(".theme-icon");
      const text = btn.querySelector(".theme-text");
      if (theme === "dark") {
        if (icon) icon.textContent = "☀️";
        if (text) text.textContent = "Light";
        btn.classList.add("is-dark");
        btn.setAttribute("title", "Switch to Light Theme");
      } else {
        if (icon) icon.textContent = "🌙";
        if (text) text.textContent = "Dark";
        btn.classList.remove("is-dark");
        btn.setAttribute("title", "Switch to Dark Theme");
      }
    });
  }

  // 3. Sync UI after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      updateToggleButtons(current);
    });
  } else {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    updateToggleButtons(current);
  }
})();
