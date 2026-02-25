  // Optional: hook buttons later to API calls.
  document.getElementById("saveNutritionBtn")?.addEventListener("click", () => {
    // TODO: send nutrition profile to backend
    alert("Nutrition profile saved (hook API next).");
  });

  document.getElementById("saveCheckInBtn")?.addEventListener("click", () => {
    // TODO: append to table + send to backend
    alert("Check-in saved (hook API next).");
  });


      const sidebar = document.querySelector(".sidebar");
      const toggle = document.getElementById("toggleSidebar");
      const backdrop = document.getElementById("backdrop");

      function openSidebar() {
        sidebar.classList.add("open");
        backdrop.classList.add("show");
      }

      function closeSidebar() {
        sidebar.classList.remove("open");
        backdrop.classList.remove("show");
      }

      toggle?.addEventListener("click", openSidebar);
      backdrop?.addEventListener("click", closeSidebar);

      // Close sidebar when a link is clicked (mobile)
      document.querySelectorAll(".sidebar a").forEach(a => {
        a.addEventListener("click", () => {
          if (window.innerWidth < 992) closeSidebar();
        });
      });
