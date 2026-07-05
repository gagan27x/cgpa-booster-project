document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("[data-resource-search]");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const gridContainer = document.getElementById("resource-grid");

  if (!gridContainer) return;

  let allResources = [];
  let activeFilter = "all";
  let itemsLimit = 24;

  async function loadResources() {
    try {
      const response = await fetch("js/resources-data.json");
      if (!response.ok) throw new Error("Database not found");
      allResources = await response.json();
      renderResources();
    } catch (error) {
      console.error("Error loading resources database:", error);
      gridContainer.innerHTML = `
        <div class="col-span-full p-8 text-center text-rose-500 border border-rose-500/20 bg-rose-500/5 rounded-lg">
          <p class="font-semibold text-xs">Unable to load resources database.</p>
        </div>
      `;
    }
  }

  function getTypeDetails(type) {
    const ext = type.toLowerCase();
    switch (ext) {
      case "pdf":
        return { label: "PDF", class: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" };
      case "docx":
      case "doc":
        return { label: "Word", class: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" };
      case "pptx":
      case "ppt":
        return { label: "PowerPoint", class: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20" };
      case "jpg":
      case "jpeg":
      case "png":
        return { label: "Image", class: "bg-emerald-500/10 text-emerald-750 dark:text-emerald-450 border-emerald-500/20" };
      case "tool":
        return { label: "Tool", class: "bg-primary-600/10 text-primary-600 dark:text-primary-400 border-primary-600/20" };
      default:
        return { label: ext.toUpperCase(), class: "bg-stone-500/10 text-stone-700 dark:text-stone-400 border-stone-500/20" };
    }
  }

  function renderResources() {
    const term = searchInput ? searchInput.value.trim().toLowerCase() : "";
    
    const filtered = allResources.filter((item) => {
      const matchesFilter = activeFilter === "all" || item.category === activeFilter;
      const searchStr = `${item.name} ${item.subject} ${item.type} ${item.category}`.toLowerCase();
      const matchesSearch = !term || searchStr.includes(term);
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-full p-12 text-center text-stone-500 dark:text-stone-400">
          <p class="font-bold text-xs">No resources matched your search</p>
        </div>
      `;
      return;
    }

    const showLoadMore = filtered.length > itemsLimit;
    const itemsToDisplay = filtered.slice(0, itemsLimit);

    let html = itemsToDisplay.map((item) => {
      const typeInfo = getTypeDetails(item.type);
      const isTool = item.type === "tool";
      const fileActionText = isTool ? "Open Tool" : "Open File";
      const iconSVG = isTool ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="shrink-0"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      ` : `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      `;

      return `
        <article class="bg-cozy-50 dark:bg-dark-100 border border-cozy-200 dark:border-dark-50 rounded-xl p-5 hover:border-primary-600 hover:shadow-cozy-sm transition flex flex-col justify-between gap-5 group">
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded text-[9px] font-bold border ${typeInfo.class}">
                ${typeInfo.label}
              </span>
              <span class="text-[9px] text-stone-400 dark:text-stone-500 font-semibold">${item.size}</span>
            </div>
            
            <h3 class="text-xs font-bold text-stone-850 dark:text-stone-100 group-hover:text-primary-600 transition-colors line-clamp-2" title="${item.name}">
              ${item.name}
            </h3>
            
            <span class="text-[9px] font-semibold text-stone-400 dark:text-stone-500 block -mt-1">
              Subject: ${item.subject}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <a href="${item.path}" target="_blank" class="flex-grow py-2 rounded-lg text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-cozy-sm">
              ${iconSVG}
              ${fileActionText}
            </a>
            ${!isTool ? `
            <a href="${item.path}" download class="p-2 rounded-lg bg-cozy-100 dark:bg-dark-200 hover:bg-primary-500/10 text-stone-600 dark:text-stone-400 transition-all border border-cozy-200 dark:border-dark-50" title="Download File">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </a>
            ` : ''}
          </div>
        </article>
      `;
    }).join("");

    if (showLoadMore) {
      html += `
        <div class="col-span-full flex justify-center py-3">
          <button id="load-more-btn" type="button" class="px-5 py-2 rounded-lg text-xs font-bold bg-cozy-100 dark:bg-dark-200 hover:bg-primary-500/10 text-stone-700 dark:text-stone-300 border border-cozy-200 dark:border-dark-50 transition-all shadow-cozy-sm">
            Load More (${filtered.length - itemsLimit} remaining)
          </button>
        </div>
      `;
    }

    gridContainer.innerHTML = html;

    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        itemsLimit += 24;
        renderResources();
      });
    }
  }

  // Cozy Ghibli chips filter styling
  const activeClasses = ["bg-primary-600", "text-white", "border-primary-600"];
  const inactiveClasses = [
    "bg-cozy-50",
    "dark:bg-dark-100",
    "text-stone-600",
    "dark:text-stone-400",
    "border-cozy-200",
    "dark:border-dark-50",
    "hover:bg-primary-500/10"
  ];

  filterButtons.forEach((button) => {
    const isDefault = button.dataset.filter === activeFilter;
    if (isDefault) {
      button.classList.add(...activeClasses);
    } else {
      button.classList.add(...inactiveClasses);
    }

    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      itemsLimit = 24;
      
      filterButtons.forEach((btn) => {
        btn.classList.remove(...activeClasses);
        btn.classList.add(...inactiveClasses);
      });
      
      button.classList.remove(...inactiveClasses);
      button.classList.add(...activeClasses);
      
      renderResources();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      itemsLimit = 24;
      renderResources();
    });
  }

  loadResources();
});