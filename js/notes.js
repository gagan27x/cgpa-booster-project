document.addEventListener("DOMContentLoaded", () => {
  const folderGrid = document.getElementById("folder-grid");
  const modal = document.getElementById("folder-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalFilesList = document.getElementById("modal-files-list");
  const modalClose = document.getElementById("modal-close");

  if (!folderGrid) return;

  let allResources = [];
  let notesGrouped = {};

  async function loadNotes() {
    try {
      const response = await fetch("js/resources-data.json");
      if (!response.ok) throw new Error("Database not found");
      allResources = await response.json();
      
      allResources.forEach(item => {
        if (item.category === "notes" && item.type !== "tool") {
          if (!notesGrouped[item.subject]) {
            notesGrouped[item.subject] = [];
          }
          notesGrouped[item.subject].push(item);
        }
      });

      renderFolders();
    } catch (error) {
      console.error("Error loading notes folders:", error);
      folderGrid.innerHTML = `
        <div class="col-span-full p-8 text-center text-rose-500 border border-rose-500/20 bg-rose-500/5 rounded-lg">
          <p class="font-semibold text-xs">Unable to load Notes folders.</p>
        </div>
      `;
    }
  }

  function renderFolders() {
    const subjects = Object.keys(notesGrouped).sort();
    
    if (subjects.length === 0) {
      folderGrid.innerHTML = `
        <div class="col-span-full p-8 text-center text-stone-500 dark:text-stone-400">
          <p class="font-bold text-xs">No folders found</p>
        </div>
      `;
      return;
    }

    folderGrid.innerHTML = subjects.map(subject => {
      const filesCount = notesGrouped[subject].length;
      const fileLabel = filesCount === 1 ? "1 file" : `${filesCount} files`;
      
      return `
        <article class="bg-white dark:bg-mint-cardDark border border-mint-borderLight dark:border-mint-borderDark rounded-xl p-5 hover:border-primary-600 hover:shadow-mint-sm cursor-pointer transition flex items-center justify-between gap-4 group" data-folder="${subject}">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-lg bg-mint-light dark:bg-mint-dark text-stone-550 dark:text-stone-400 flex items-center justify-center shrink-0 border border-mint-borderLight dark:border-mint-borderDark">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary-600 group-hover:scale-105 transition-transform"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="flex flex-col">
              <h3 class="text-xs font-bold text-stone-800 dark:text-stone-100 group-hover:text-primary-600 transition-colors truncate max-w-[150px] sm:max-w-[200px]" title="${subject}">
                ${subject}
              </h3>
              <span class="text-[9px] text-stone-400 dark:text-stone-500 font-semibold">${fileLabel}</span>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-stone-400 group-hover:text-primary-600 transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
        </article>
      `;
    }).join("");

    folderGrid.querySelectorAll("[data-folder]").forEach(card => {
      card.addEventListener("click", () => {
        const subject = card.dataset.folder;
        openFolderModal(subject);
      });
    });
  }

  function openFolderModal(subject) {
    const files = notesGrouped[subject] || [];
    modalTitle.textContent = `${subject} files`;
    
    const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
    
    modalFilesList.innerHTML = sortedFiles.map(file => {
      let icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-stone-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
      if (file.type === "pdf") {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
      }
      
      return `
        <div class="p-2.5 rounded-lg border border-mint-borderLight dark:border-mint-borderDark bg-mint-light dark:bg-mint-dark flex items-center justify-between gap-4">
          <div class="flex items-center gap-2 max-w-[70%]">
            ${icon}
            <span class="text-xs font-semibold text-stone-700 dark:text-stone-200 truncate" title="${file.name}">${file.name}</span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-[9px] text-stone-500 font-semibold mr-1">${file.size}</span>
            <a href="${file.path}" target="_blank" class="px-2.5 py-1 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-bold transition-all">View</a>
            <a href="${file.path}" download class="p-1 rounded hover:bg-primary-500/10 text-stone-500 transition-all" title="Download">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </a>
          </div>
        </div>
      `;
    }).join("");

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  loadNotes();
});
