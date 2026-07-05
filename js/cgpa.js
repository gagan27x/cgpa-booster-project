document.addEventListener("DOMContentLoaded", () => {
  const calculators = document.querySelectorAll("[data-calculator]");
  const percentageButton = document.getElementById("percentage-button");
  const cgpaInput = document.getElementById("cgpa-input");
  const percentageResult = document.getElementById("percentage-result");

  const createRow = (label = "Course") => {
    const row = document.createElement("div");
    row.className = "calc-row grid grid-cols-12 gap-3 items-end p-4 rounded-xl bg-white dark:bg-mint-cardDark border border-mint-borderLight dark:border-mint-borderDark hover:border-primary-600 dark:hover:border-primary-500 transition-colors shadow-mint-sm animate-fade-in-up";
    row.innerHTML = `
      <div class="col-span-12 sm:col-span-5 flex flex-col gap-1">
        <label class="text-[10px] font-bold text-stone-500 dark:text-stone-400">${label} Name</label>
        <input class="w-full px-3 py-2 text-xs rounded-lg border border-mint-borderLight dark:border-mint-borderDark bg-mint-light dark:bg-mint-dark focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none transition-colors dark:text-white" type="text" placeholder="Enter subject name...">
      </div>
      <div class="col-span-5 sm:col-span-3 flex flex-col gap-1">
        <label class="text-[10px] font-bold text-stone-500 dark:text-stone-400">Credits</label>
        <input class="w-full px-3 py-2 text-xs rounded-lg border border-mint-borderLight dark:border-mint-borderDark bg-mint-light dark:bg-mint-dark focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none transition-colors dark:text-white" type="number" min="1" step="1" value="3">
      </div>
      <div class="col-span-5 sm:col-span-3 flex flex-col gap-1">
        <label class="text-[10px] font-bold text-stone-500 dark:text-stone-400">Grade Point</label>
        <input class="w-full px-3 py-2 text-xs rounded-lg border border-mint-borderLight dark:border-mint-borderDark bg-mint-light dark:bg-mint-dark focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none transition-colors dark:text-white" type="number" min="0" max="10" step="0.1" value="8.0">
      </div>
      <div class="col-span-2 sm:col-span-1 flex justify-center pb-0.5">
        <button class="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center justify-center shrink-0" type="button" title="Remove course">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    `;
    
    row.querySelector("button").addEventListener("click", () => {
      row.remove();
      const panel = row.closest("[data-calculator]");
      if (panel) calculateWeightedAverage(panel);
    });
    return row;
  };

  const calculateWeightedAverage = (panel) => {
    const rows = [...panel.querySelectorAll(".calc-row")];
    let totalCredits = 0;
    let weightedPoints = 0;

    rows.forEach((row) => {
      const inputs = row.querySelectorAll("input");
      const credits = Number(inputs[1].value);
      const gradePoint = Number(inputs[2].value);

      if (!Number.isNaN(credits) && !Number.isNaN(gradePoint) && credits > 0) {
        totalCredits += credits;
        weightedPoints += credits * gradePoint;
      }
    });

    const resultBox = panel.querySelector("[data-result]");
    if (!totalCredits) {
      resultBox.innerHTML = `
        <div class="p-4 rounded-xl border border-primary-650/20 bg-primary-50/5 text-stone-500 dark:text-stone-400 flex flex-col gap-1">
          <strong class="text-xs font-bold flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            No courses entered
          </strong>
          <p class="text-[11px] opacity-90">Enter your course metrics to see calculations.</p>
        </div>
      `;
      return;
    }

    const result = weightedPoints / totalCredits;
    const percentage = result * 9.5;

    resultBox.innerHTML = `
      <div class="p-5 rounded-xl border border-mint-borderLight dark:border-mint-borderDark bg-mint-light dark:bg-mint-dark text-stone-700 dark:text-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-mint-sm">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-bold uppercase tracking-wider text-primary-650 dark:text-primary-400">Calculated Average</span>
          <p class="text-xs text-stone-500 dark:text-stone-400 font-medium">Total credits: ${totalCredits.toFixed(0)} | Percentage: ${percentage.toFixed(2)}%</p>
        </div>
        <div class="flex items-baseline gap-1.5 bg-primary-600/10 dark:bg-primary-600/20 px-4 py-2 rounded-lg border border-primary-600/20 w-fit shrink-0">
          <span class="text-xs font-bold text-primary-600 dark:text-primary-400">CGPA:</span>
          <strong class="text-2xl font-black text-primary-600 dark:text-primary-450">${result.toFixed(2)}</strong>
        </div>
      </div>
    `;
  };

  calculators.forEach((panel) => {
    const rowsContainer = panel.querySelector("[data-rows]");
    const addRowButton = panel.querySelector("[data-add-row]");
    const calculateButton = panel.querySelector("[data-calc]");
    const isGpa = panel.dataset.calculator === "gpa";

    rowsContainer.appendChild(createRow(isGpa ? "Subject" : "Course"));
    rowsContainer.appendChild(createRow(isGpa ? "Subject" : "Course"));

    addRowButton.addEventListener("click", () => {
      rowsContainer.appendChild(createRow(isGpa ? "Subject" : "Course"));
    });

    calculateButton.addEventListener("click", () => calculateWeightedAverage(panel));
    panel.addEventListener("input", () => calculateWeightedAverage(panel));
    
    calculateWeightedAverage(panel);
  });

  if (percentageButton && cgpaInput && percentageResult) {
    const updatePercentage = () => {
      const cgpa = Number(cgpaInput.value);
      if (Number.isNaN(cgpa) || !cgpaInput.value) {
        percentageResult.innerHTML = `
          <div class="p-4 rounded-xl border border-mint-borderLight dark:border-mint-borderDark bg-mint-light dark:bg-mint-dark text-stone-500 flex flex-col gap-1">
            <strong class="text-xs font-bold text-stone-750 dark:text-stone-300">Input Required</strong>
            <p class="text-[11px] opacity-90">Please enter a valid cumulative CGPA value.</p>
          </div>
        `;
        return;
      }

      const percentage = cgpa * 9.5;
      percentageResult.innerHTML = `
        <div class="p-5 rounded-xl border border-mint-borderLight dark:border-mint-borderDark bg-mint-light dark:bg-mint-dark text-stone-700 dark:text-stone-300 flex flex-col gap-2 animate-fade-in shadow-mint-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-primary-650 dark:text-primary-400">Equivalent Percentage</span>
            <span class="text-[10px] text-primary-600 font-bold bg-primary-600/10 px-1.5 py-0.5 rounded">CGPA × 9.5</span>
          </div>
          <p class="text-sm font-semibold">Value: <strong class="text-lg text-primary-600 dark:text-primary-450 font-black">${percentage.toFixed(2)}%</strong></p>
        </div>
      `;
    };

    percentageButton.addEventListener("click", updatePercentage);
    cgpaInput.addEventListener("input", updatePercentage);
    
    updatePercentage();
  }
});