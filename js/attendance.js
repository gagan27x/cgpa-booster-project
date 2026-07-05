document.addEventListener("DOMContentLoaded", () => {
  const body = document.getElementById("attendance-body");
  const addSubjectButton = document.getElementById("add-subject");
  const recalculateButton = document.getElementById("recalculate-attendance");
  const overallPercent = document.getElementById("overall-percent");
  const overallTarget = document.getElementById("overall-target");
  const overallRequired = document.getElementById("overall-required");

  const createRow = (name = "Subject") => {
    const row = document.createElement("article");
    row.className = "attendance-row bg-white dark:bg-mint-cardDark border border-mint-borderLight dark:border-mint-borderDark rounded-xl p-5 shadow-mint-sm flex flex-col md:flex-row justify-between items-center gap-6 relative group animate-fade-in-up";
    row.innerHTML = `
      <!-- Left Side: Name and Inputs -->
      <div class="flex flex-col gap-4 w-full md:w-3/5">
        <!-- Subject Name -->
        <div class="flex items-center gap-2">
          <input class="font-bold text-base bg-transparent border-b border-dashed border-mint-borderLight dark:border-mint-borderDark hover:border-primary-600 focus:border-primary-600 focus:ring-0 outline-none w-full pb-0.5 text-stone-850 dark:text-stone-100 transition-colors" type="text" placeholder="${name}">
        </div>

        <!-- Counters Grid -->
        <div class="grid grid-cols-3 gap-3">
          <!-- Attended Classes -->
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold uppercase tracking-wider text-stone-400">Attended</label>
            <div class="flex items-center rounded-lg border border-mint-borderLight dark:border-mint-borderDark bg-mint-light dark:bg-mint-dark overflow-hidden h-8">
              <button class="dec-attended px-2.5 text-stone-500 hover:bg-primary-500/10 transition-colors h-full font-bold select-none" type="button">-</button>
              <input class="attended-input w-full text-center text-xs bg-transparent outline-none font-bold dark:text-white" type="number" min="0" step="1" value="12">
              <button class="inc-attended px-2.5 text-stone-500 hover:bg-primary-500/10 transition-colors h-full font-bold select-none" type="button">+</button>
            </div>
          </div>

          <!-- Total Classes -->
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold uppercase tracking-wider text-stone-400">Total</label>
            <div class="flex items-center rounded-lg border border-mint-borderLight dark:border-mint-borderDark bg-mint-light dark:bg-mint-dark overflow-hidden h-8">
              <button class="dec-total px-2.5 text-stone-500 hover:bg-primary-500/10 transition-colors h-full font-bold select-none" type="button">-</button>
              <input class="total-input w-full text-center text-xs bg-transparent outline-none font-bold dark:text-white" type="number" min="0" step="1" value="15">
              <button class="inc-total px-2.5 text-stone-500 hover:bg-primary-500/10 transition-colors h-full font-bold select-none" type="button">+</button>
            </div>
          </div>

          <!-- Target Percentage -->
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold uppercase tracking-wider text-stone-400">Target %</label>
            <div class="flex items-center rounded-lg border border-mint-borderLight dark:border-mint-borderDark bg-mint-light dark:bg-mint-dark overflow-hidden h-8 px-2">
              <input class="target-input w-full text-center text-xs bg-transparent outline-none font-bold dark:text-white" type="number" min="1" max="100" step="1" value="75">
              <span class="text-[10px] font-bold text-stone-400">%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: SVG Progress ring and Info status -->
      <div class="flex items-center gap-5 w-full md:w-2/5 justify-between md:justify-end border-t md:border-t-0 border-mint-borderLight dark:border-mint-borderDark pt-4 md:pt-0">
        <!-- Status Text & Remove button -->
        <div class="flex flex-col gap-1 md:items-end">
          <span class="status-chip text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit border">Update values</span>
          <button class="delete-btn text-[9px] font-bold text-stone-400 hover:text-rose-500 hover:underline flex items-center gap-1 mt-1 transition-colors" type="button">
            Delete
          </button>
        </div>

        <!-- Circular Progress Ring SVG -->
        <div class="relative flex items-center justify-center shrink-0">
          <svg class="w-14 h-14">
            <circle class="text-mint-borderLight dark:text-mint-borderDark" stroke-width="4.5" stroke="currentColor" fill="transparent" r="22" cx="28" cy="28"/>
            <circle class="progress-ring-circle text-primary-600" stroke-width="4.5" stroke-dasharray="138.23" stroke-dashoffset="138.23" stroke-linecap="round" stroke="currentColor" fill="transparent" r="22" cx="28" cy="28"/>
          </svg>
          <span class="percent-label absolute text-[9px] font-black text-stone-750 dark:text-stone-300">0%</span>
        </div>
      </div>
    `;

    const attendedInput = row.querySelector(".attended-input");
    const totalInput = row.querySelector(".total-input");

    row.querySelector(".dec-attended").addEventListener("click", () => {
      attendedInput.value = Math.max(0, Number(attendedInput.value) - 1);
      recalculate();
    });
    row.querySelector(".inc-attended").addEventListener("click", () => {
      attendedInput.value = Number(attendedInput.value) + 1;
      if (Number(totalInput.value) < Number(attendedInput.value)) {
        totalInput.value = attendedInput.value;
      }
      recalculate();
    });

    row.querySelector(".dec-total").addEventListener("click", () => {
      totalInput.value = Math.max(0, Number(totalInput.value) - 1);
      if (Number(attendedInput.value) > Number(totalInput.value)) {
        attendedInput.value = totalInput.value;
      }
      recalculate();
    });
    row.querySelector(".inc-total").addEventListener("click", () => {
      totalInput.value = Number(totalInput.value) + 1;
      recalculate();
    });

    row.querySelector(".delete-btn").addEventListener("click", () => {
      row.remove();
      recalculate();
    });

    return row;
  };

  const classesNeeded = (attended, total, targetPercent) => {
    if (targetPercent >= 100) {
      return attended === total ? 0 : Infinity;
    }

    const numerator = targetPercent * total - attended * 100;
    if (numerator <= 0) {
      return 0;
    }

    return Math.ceil(numerator / (100 - targetPercent));
  };

  const recalculate = () => {
    const rows = [...body.querySelectorAll(".attendance-row")];
    let attendedTotal = 0;
    let classTotal = 0;
    let targetAccumulator = 0;

    rows.forEach((row) => {
      const attended = Number(row.querySelector(".attended-input").value);
      const total = Number(row.querySelector(".total-input").value);
      const target = Number(row.querySelector(".target-input").value);
      const status = row.querySelector(".status-chip");
      const circle = row.querySelector(".progress-ring-circle");
      const percentLabel = row.querySelector(".percent-label");

      if (Number.isNaN(attended) || Number.isNaN(total) || total <= 0 || attended < 0 || attended > total) {
        status.textContent = "Empty";
        status.className = "status-chip text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit border border-mint-borderLight bg-mint-light text-stone-500 dark:border-mint-borderDark dark:bg-mint-dark dark:text-stone-400";
        percentLabel.textContent = "0%";
        circle.style.strokeDashoffset = 138.23;
        circle.className = "progress-ring-circle text-mint-borderLight dark:text-mint-borderDark";
        return;
      }

      const currentPercent = (attended / total) * 100;
      const needed = classesNeeded(attended, total, target);

      attendedTotal += attended;
      classTotal += total;
      targetAccumulator += target;

      percentLabel.textContent = `${Math.round(currentPercent)}%`;
      const offset = 138.23 - (currentPercent / 100) * 138.23;
      circle.style.strokeDashoffset = Math.max(0, Math.min(138.23, offset));

      if (needed === Infinity) {
        status.textContent = `Unreachable`;
        status.className = "status-chip text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400";
        circle.className = "progress-ring-circle text-rose-500 dark:text-rose-400";
      } else if (needed === 0) {
        status.textContent = `On Track`;
        status.className = "status-chip text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit border border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-900/30 dark:bg-primary-950/20 dark:text-primary-400";
        circle.className = "progress-ring-circle text-primary-600 dark:text-primary-400";
      } else {
        status.textContent = `Need ${needed} classes`;
        status.className = "status-chip text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400";
        circle.className = "progress-ring-circle text-amber-600 dark:text-amber-400";
      }
    });

    if (!rows.length || !classTotal) {
      overallPercent.textContent = "0%";
      overallTarget.textContent = "75%";
      overallRequired.textContent = "0";
      return;
    }

    const overallPercentage = (attendedTotal / classTotal) * 100;
    const overallTargetPercent = targetAccumulator / rows.length;
    const overallNeeded = classesNeeded(attendedTotal, classTotal, overallTargetPercent);

    overallPercent.textContent = `${overallPercentage.toFixed(1)}%`;
    overallTarget.textContent = `${overallTargetPercent.toFixed(0)}%`;
    
    if (overallNeeded === Infinity) {
      overallRequired.textContent = "∞";
      overallRequired.className = "text-rose-500 font-extrabold";
    } else {
      overallRequired.textContent = `${overallNeeded}`;
      overallRequired.className = overallNeeded === 0 ? "text-primary-650 font-extrabold" : "text-amber-600 font-extrabold";
    }
  };

  body.appendChild(createRow("Mathematics"));
  body.appendChild(createRow("Physics"));
  recalculate();

  addSubjectButton.addEventListener("click", () => {
    body.appendChild(createRow("New Subject"));
    recalculate();
  });

  recalculateButton.addEventListener("click", recalculate);
  body.addEventListener("input", recalculate);
});