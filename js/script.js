document.addEventListener("DOMContentLoaded", () => {
  // Navigation elements
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = document.querySelectorAll("[data-nav]");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Active state styling for navigation links
  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop() || "index.html";
    if (linkPage === currentPage) {
      link.classList.add(
        "text-primary-600",
        "dark:text-primary-400",
        "font-semibold",
        "border-primary-600",
        "dark:border-primary-400",
        "border-b-2"
      );
      link.classList.remove("text-slate-600", "dark:text-slate-300");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.add(
        "text-slate-600",
        "dark:text-slate-300",
        "hover:text-primary-600",
        "dark:hover:text-primary-400"
      );
      link.classList.remove("font-semibold", "border-b-2");
    }
  });

  // Mobile menu toggle logic using Tailwind classes
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isHidden = siteNav.classList.contains("hidden");
      if (isHidden) {
        siteNav.classList.remove("hidden");
        // Simple micro-animation on open
        siteNav.classList.add("flex", "animate-fade-in-up");
        navToggle.setAttribute("aria-expanded", "true");
        // Change icon to X
        navToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
      } else {
        siteNav.classList.add("hidden");
        siteNav.classList.remove("flex", "animate-fade-in-up");
        navToggle.setAttribute("aria-expanded", "false");
        // Change icon back to Menu
        navToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        `;
      }
    });
  }

  // Set current year dynamically for footer
  const yearNodes = document.querySelectorAll("[data-year]");
  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
});