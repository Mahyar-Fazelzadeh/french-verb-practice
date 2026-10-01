"use strict";

// Module visibility is independent of each module's practice state.
(() => {
  const screens = {
    home: { id: "home-screen", heading: "home-heading", title: "homeTitle" },
    conjugation: { id: "conjugation-module", heading: "conjugation-heading", title: "title" },
    pronouns: { id: "pronouns-module", heading: "pronouns-heading", title: "pronounsTitle" },
  };
  let activeModule = "home";

  function updateTitle() {
    const key = screens[activeModule].title;
    document.getElementById("page-title").setAttribute("data-i18n", key);
    document.title = t(key);
  }

  function showModule(name, focus = true) {
    activeModule = name;
    Object.entries(screens).forEach(([key, screen]) => {
      document.getElementById(screen.id).hidden = key !== name;
    });
    updateTitle();
    if (focus) document.getElementById(screens[name].heading).focus();
  }

  document.getElementById("open-conjugation").addEventListener("click", () => showModule("conjugation"));
  document.getElementById("open-pronouns").addEventListener("click", () => showModule("pronouns"));
  document.getElementById("conjugation-home").addEventListener("click", () => showModule("home"));
  document.getElementById("pronouns-home").addEventListener("click", () => showModule("home"));
  document.getElementById("language-toggle").addEventListener("click", updateTitle);
  showModule("home", false);
})();
