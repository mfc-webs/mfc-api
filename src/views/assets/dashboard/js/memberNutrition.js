  // Close sidebar when a link is clicked (mobile)
      document.querySelectorAll(".sidebar a").forEach(a => {
        a.addEventListener("click", () => {
          if (window.innerWidth < 992) closeSidebar();
        });
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



  
  // Optional: hook buttons later to API calls.
  document.getElementById("saveNutritionBtn")?.addEventListener("click", () => {
    
  });

  document.getElementById("saveDietBtn").addEventListener("click", async () => {
  const payload = {
    diet_type: document.getElementById("dietType").value || null,
    meals_per_day: document.getElementById("mealsPerDay").value || null,
    water_per_day: document.getElementById("waterPerDay").value || null,
    foods_avoid: document.getElementById("foodsAvoid").value || null,
    supplements: document.getElementById("supplements").value || null,
    hydration_goal: document.getElementById("hydrationGoal").value || null,
    allergies: document.getElementById("allergies").value || null,
    restrictions: document.getElementById("restrictions").value || null,
    preferred_checkin_day: document.getElementById("checkInDay").value || null,
  };

  try {
    const res = await fetch("/member/dietary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
        credentials: "include"
    });

    const data = await res.json();


    console.log(data)
    if (data.success) {
      showPopup(data.message, "success");
    } else {
      showPopup(data.message, "error");
    }

  } catch (err) {
    showPopup(data.message, "error");
  }
});
  

  document.getElementById("saveCheckInBtn")?.addEventListener("click", () => {
    // TODO: append to table + send to backend
    alert("Check-in saved (hook API next).");
  });


    
     // ===== Popup Utility =====
function showPopup(message, type = "success", duration = 4000) {
  const popup = document.getElementById("popup");
  if (!popup) return;

  // Set message
  popup.textContent = message;

  // Style based on type
  switch (type) {
    case "success":
      popup.style.background = "#28a746bf"; // green
      break;
    case "error":
      popup.style.background = "#dc3545bf"; // red
      break;
    case "info":
      popup.style.background = "#007bffbf"; // blue
      break;
    default:
      popup.style.background = "#28a746bf";
  }

  // Show popup
  popup.classList.remove("hidden");

  // Hide after duration
  setTimeout(() => {
    popup.classList.add("hidden");
  }, duration);
}
