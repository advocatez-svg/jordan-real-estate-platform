(function () {
  function renderIcons() {
    if (window.lucide) {
      window.lucide.createIcons({ "stroke-width": 1.8 });
    }
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

  renderIcons();
  setupOpportunityFilters();
}());
