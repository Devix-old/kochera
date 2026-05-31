(function () {
  "use strict";

  var COOKIE_NAME = "user_consent";
  var COOKIE_DAYS = 365;
  var CATEGORIES = ["necessary", "analytics", "marketing", "functional"];
  var OPTIONAL_CATEGORIES = ["analytics", "marketing", "functional"];
  var DEFAULT_CONSENT = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  };

  var blockedScripts = [];
  var ui = {};

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getCookie(name) {
    var prefix = name + "=";
    var parts = document.cookie ? document.cookie.split(";") : [];
    for (var i = 0; i < parts.length; i += 1) {
      var item = parts[i].trim();
      if (item.indexOf(prefix) === 0) {
        return decodeURIComponent(item.slice(prefix.length));
      }
    }
    return null;
  }

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    var secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = name + "=" + encodeURIComponent(value) + "; Expires=" + expires + "; Path=/; SameSite=Lax" + secure;
  }

  function normalizeConsent(input) {
    var result = clone(DEFAULT_CONSENT);
    if (!input || typeof input !== "object") {
      return result;
    }

    CATEGORIES.forEach(function (category) {
      if (category === "necessary") {
        result.necessary = true;
      } else {
        result[category] = input[category] === true;
      }
    });

    return result;
  }

  function readStoredConsent() {
    var raw = getCookie(COOKIE_NAME);
    if (!raw) {
      return null;
    }

    try {
      var parsed = JSON.parse(raw);
      return {
        choices: normalizeConsent(parsed.choices || parsed),
        timestamp: parsed.timestamp || null
      };
    } catch (error) {
      return null;
    }
  }

  function writeStoredConsent(choices) {
    var payload = {
      choices: normalizeConsent(choices),
      timestamp: new Date().toISOString()
    };
    setCookie(COOKIE_NAME, JSON.stringify(payload), COOKIE_DAYS);

    try {
      localStorage.setItem("user_consent_timestamp", payload.timestamp);
      localStorage.setItem("user_consent_choices", JSON.stringify(payload.choices));
    } catch (error) {
      // localStorage can be unavailable in strict browser modes.
    }

    return payload;
  }

  function currentConsent() {
    var stored = readStoredConsent();
    return stored ? stored.choices : clone(DEFAULT_CONSENT);
  }

  function hasConsent(category) {
    var consent = currentConsent();
    return category === "necessary" || consent[category] === true;
  }

  function markScriptHandled(script) {
    script.setAttribute("data-cmp-handled", "true");
  }

  function getScriptCategory(script) {
    return script.getAttribute("data-category") || script.getAttribute("data-cookieconsent");
  }

  function captureScript(script) {
    var category = getScriptCategory(script);
    if (!category || CATEGORIES.indexOf(category) === -1 || category === "necessary") {
      return;
    }

    if (script.getAttribute("data-cmp-handled") === "true") {
      return;
    }

    var placeholder = document.createComment("cmp blocked " + category + " script");
    var scriptData = {
      category: category,
      src: script.getAttribute("src") || "",
      code: script.getAttribute("data-code") || script.textContent || "",
      type: script.getAttribute("data-type") || script.getAttribute("type") || "text/javascript",
      async: script.hasAttribute("async"),
      defer: script.hasAttribute("defer"),
      attributes: {},
      placeholder: placeholder
    };

    Array.prototype.forEach.call(script.attributes, function (attr) {
      if (
        attr.name !== "src" &&
        attr.name !== "type" &&
        attr.name !== "data-code" &&
        attr.name !== "data-type" &&
        attr.name !== "data-category" &&
        attr.name !== "data-cookieconsent" &&
        attr.name !== "data-cmp-handled"
      ) {
        scriptData.attributes[attr.name] = attr.value;
      }
    });

    blockedScripts.push(scriptData);
    markScriptHandled(script);

    if (script.parentNode) {
      script.parentNode.replaceChild(placeholder, script);
    }
  }

  function captureConsentScripts(root) {
    var scope = root || document;
    var scripts = scope.querySelectorAll ? scope.querySelectorAll("script[data-category], script[data-cookieconsent]") : [];
    Array.prototype.forEach.call(scripts, captureScript);
  }

  function createExecutableScript(item) {
    var script = document.createElement("script");
    script.type = item.type === "text/plain" ? "text/javascript" : item.type;
    script.setAttribute("data-cmp-loaded", item.category);

    Object.keys(item.attributes).forEach(function (name) {
      script.setAttribute(name, item.attributes[name]);
    });

    if (item.async) {
      script.async = true;
    }

    if (item.defer) {
      script.defer = true;
    }

    if (item.src) {
      script.src = item.src;
    } else {
      script.text = item.code;
    }

    return script;
  }

  function loadAllowedScripts() {
    var consent = currentConsent();
    blockedScripts = blockedScripts.filter(function (item) {
      if (!consent[item.category]) {
        return true;
      }

      var executable = createExecutableScript(item);
      if (item.placeholder && item.placeholder.parentNode) {
        item.placeholder.parentNode.replaceChild(executable, item.placeholder);
      } else {
        document.head.appendChild(executable);
      }
      return false;
    });
  }

  function setConsent(choices) {
    var saved = writeStoredConsent(choices);
    hideBanner();
    hideModal();
    showFloatingButton();
    loadAllowedScripts();
    window.dispatchEvent(new CustomEvent("cmp:consentChanged", { detail: saved }));
    return saved.choices;
  }

  function getConsent() {
    return currentConsent();
  }

  function button(text, className, onClick) {
    var el = document.createElement("button");
    el.type = "button";
    el.className = "cmp-button" + (className ? " " + className : "");
    el.textContent = text;
    el.addEventListener("click", onClick);
    return el;
  }

  function createToggle(category, label, description, checked, disabled) {
    var row = document.createElement("div");
    row.className = "cmp-row";

    var copy = document.createElement("div");
    var title = document.createElement("h3");
    var text = document.createElement("p");
    title.textContent = label;
    text.textContent = description;
    copy.appendChild(title);
    copy.appendChild(text);

    var toggle = document.createElement("label");
    toggle.className = "cmp-toggle";
    toggle.setAttribute("aria-label", label);

    var input = document.createElement("input");
    input.type = "checkbox";
    input.name = "cmp-" + category;
    input.checked = checked;
    input.disabled = disabled;
    input.setAttribute("data-cmp-toggle", category);

    var slider = document.createElement("span");
    toggle.appendChild(input);
    toggle.appendChild(slider);

    row.appendChild(copy);
    row.appendChild(toggle);
    return row;
  }

  function createBanner() {
    var banner = document.createElement("section");
    banner.className = "cmp-banner cmp-hidden";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie consent");

    var inner = document.createElement("div");
    inner.className = "cmp-banner__inner";

    var copy = document.createElement("div");
    var title = document.createElement("h2");
    var text = document.createElement("p");
    var link = document.createElement("a");

    title.className = "cmp-title";
    title.textContent = "We use cookies";
    text.className = "cmp-text";
    text.appendChild(document.createTextNode("We use necessary cookies to run this site and optional cookies for analytics, marketing, and functional improvements. "));
    link.className = "cmp-link";
    link.href = "/cookie-policy";
    link.textContent = "Cookie Policy";
    text.appendChild(link);

    copy.appendChild(title);
    copy.appendChild(text);

    var actions = document.createElement("div");
    actions.className = "cmp-actions";
    actions.appendChild(button("Reject All", "cmp-button--ghost", function () {
      setConsent(DEFAULT_CONSENT);
    }));
    actions.appendChild(button("Manage Preferences", "", openModal));
    actions.appendChild(button("Accept All", "cmp-button--primary", function () {
      setConsent({
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true
      });
    }));

    inner.appendChild(copy);
    inner.appendChild(actions);
    banner.appendChild(inner);
    document.body.appendChild(banner);
    ui.banner = banner;
  }

  function createModal() {
    var overlay = document.createElement("div");
    overlay.className = "cmp-overlay cmp-hidden";
    overlay.setAttribute("role", "presentation");

    var modal = document.createElement("section");
    modal.className = "cmp-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Cookie preferences");

    var header = document.createElement("div");
    header.className = "cmp-modal__header";
    var title = document.createElement("h2");
    var text = document.createElement("p");
    title.className = "cmp-title";
    title.textContent = "Cookie preferences";
    text.className = "cmp-text";
    text.textContent = "Choose which optional cookies this site may use. Necessary cookies are always active.";
    header.appendChild(title);
    header.appendChild(text);

    var body = document.createElement("div");
    body.className = "cmp-modal__body";
    body.appendChild(createToggle("necessary", "Necessary", "Required for core site features and security.", true, true));
    body.appendChild(createToggle("analytics", "Analytics", "Helps us understand traffic and improve content.", false, false));
    body.appendChild(createToggle("marketing", "Marketing", "Allows advertising and campaign measurement scripts.", false, false));
    body.appendChild(createToggle("functional", "Functional", "Remembers optional preferences and enhanced features.", false, false));

    var footer = document.createElement("div");
    footer.className = "cmp-modal__footer";
    footer.appendChild(button("Reject All", "cmp-button--ghost", function () {
      setConsent(DEFAULT_CONSENT);
    }));
    footer.appendChild(button("Save Preferences", "cmp-button--primary", saveModalPreferences));

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    ui.overlay = overlay;
  }

  function createFloatingButton() {
    var floating = document.createElement("button");
    floating.type = "button";
    floating.className = "cmp-floating-button cmp-hidden";
    floating.setAttribute("aria-label", "Change cookie preferences");
    floating.title = "Cookie preferences";
    floating.textContent = "C";
    floating.addEventListener("click", openModal);
    document.body.appendChild(floating);
    ui.floating = floating;
  }

  function syncModalToggles() {
    var consent = currentConsent();
    OPTIONAL_CATEGORIES.forEach(function (category) {
      var input = document.querySelector('[data-cmp-toggle="' + category + '"]');
      if (input) {
        input.checked = consent[category] === true;
      }
    });
  }

  function saveModalPreferences() {
    var choices = clone(DEFAULT_CONSENT);
    OPTIONAL_CATEGORIES.forEach(function (category) {
      var input = document.querySelector('[data-cmp-toggle="' + category + '"]');
      choices[category] = input ? input.checked === true : false;
    });
    setConsent(choices);
  }

  function showBanner() {
    if (ui.banner) {
      ui.banner.classList.remove("cmp-hidden");
    }
  }

  function hideBanner() {
    if (ui.banner) {
      ui.banner.classList.add("cmp-hidden");
    }
  }

  function openModal() {
    syncModalToggles();
    if (ui.overlay) {
      ui.overlay.classList.remove("cmp-hidden");
    }
  }

  function hideModal() {
    if (ui.overlay) {
      ui.overlay.classList.add("cmp-hidden");
    }
  }

  function showFloatingButton() {
    if (ui.floating) {
      ui.floating.classList.remove("cmp-hidden");
    }
  }

  function watchFutureScripts() {
    if (!window.MutationObserver) {
      return;
    }

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, function (node) {
          if (!node || node.nodeType !== 1) {
            return;
          }
          if (node.matches && node.matches("script[data-category], script[data-cookieconsent]")) {
            captureScript(node);
          } else {
            captureConsentScripts(node);
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function exposeApi() {
    window.__cmp = {
      getConsent: getConsent,
      setConsent: setConsent,
      hasConsent: hasConsent
    };
  }

  function init() {
    exposeApi();
    captureConsentScripts(document);
    watchFutureScripts();
    createBanner();
    createModal();
    createFloatingButton();

    if (readStoredConsent()) {
      showFloatingButton();
      loadAllowedScripts();
    } else {
      showBanner();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
