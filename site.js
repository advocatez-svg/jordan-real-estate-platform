(function () {
  function renderIcons() {
    if (window.lucide) {
      window.lucide.createIcons({ "stroke-width": 1.8 });
    }
  }

  function setupMobileNavigation() {
    const header = document.querySelector(".site-header");
    const navigation = document.querySelector(".main-nav");

    if (!header || !navigation || header.querySelector(".nav-toggle")) return;

    const navigationId = navigation.id || "site-navigation";
    navigation.id = navigationId;
    document.body.classList.add("has-mobile-nav");

    const toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-controls", navigationId);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "فتح قائمة التنقل");
    toggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
    header.appendChild(toggle);

    const closeNavigation = () => {
      navigation.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "فتح قائمة التنقل");
    };

    toggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل");
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNavigation();
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) closeNavigation();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavigation();
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 681px)").matches) closeNavigation();
    });
  }

  function setupOpportunityFilters() {
    const buttons = Array.from(document.querySelectorAll("[data-filter]"));
    const cards = Array.from(document.querySelectorAll("[data-opportunity]"));
    const count = document.querySelector("#result-count");

    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        let visible = 0;

        buttons.forEach((item) => item.classList.toggle("is-active", item === button));
        cards.forEach((card) => {
          const show = filter === "all" || card.dataset.area === filter;
          card.hidden = !show;
          if (show) visible += 1;
        });

        if (count) count.textContent = `${visible} فرصة`;
      });
    });
  }

  setupMobileNavigation();
  renderIcons();
  setupOpportunityFilters();
}());
