
document.getElementById("saveSessionBtn").addEventListener("click", async () => {
    
    
    const payload = {
      class_type_id: Number(document.getElementById("sessionClassName").value),
      trainer_id: null, // fill in later if you have trainer system
      date: document.getElementById("sessionDate").value,
      time: document.getElementById("sessionTime").value,
      duration: document.getElementById("sessionDuration").value || 0,
      capacity: document.getElementById("sessionCapacity").value || 60,
      location: document.getElementById("sessionLocation").value,
      status: document.getElementById("sessionStatus").value.toLowerCase() || 'scheduled',
      waitlist_enabled : document.getElementById("waitlistSession").value === "No",
      cancellation_deadline_hours: Number(document.getElementById("cancellationSession").value) || 24,
    };
    
    
    const editId = document.getElementById("saveSessionBtn").dataset.editId;

    const url = editId
        ? `/admin/api/class-sessions/${editId}`
        : "/admin/api/class-sessions";

    // Simple front-end validation
    if (!payload.class_type_id) {
      showPopup("Class Name is required", "error");
      return;
    }

    if (!payload.time || !payload.date) {
      showPopup("Time and date is required", "error");
      return;
    }

    const method = editId ? "PUT" : "POST";

    try {

    const res = await fetch( url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const data = await res.json();


    if (data.success) {
      showPopup("Session created successfully", "success");
      location.reload();
    } else {
      showPopup(`Error: ${data.message}`, "error");
    }
  } catch (err) {
    console.error(err);
    showPopup("Server error creating session", "error");
  }
});


// - - - delete sesion - - - //

document.addEventListener("click", async (e) => {

  if (!e.target.closest(".delete-session")) return;

  const btn = e.target.closest(".delete-session");
  const sessionId = btn.dataset.id;

  if (!confirm("Delete this session?")) return;

  try {

    const res = await fetch(`/admin/api/class-sessions/${sessionId}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();

    if (data.success) {
      showPopup("Session deleted", "success");
      location.reload();
    } else {
      showPopup(data.message, "error");
    }

  } catch (err) {
    console.error(err);
    showPopup("Error deleting session", "error");
  }

});

// - - - edit session - - - 

document.addEventListener("click", (e) => {

  const btn = e.target.closest(".edit-session");

  if (!btn) return;

  document.getElementById("sessionClassName").value = btn.dataset.class;

  document.getElementById("sessionDate").value =
    btn.dataset.date.split("T")[0];

  document.getElementById("sessionTime").value =
    btn.dataset.time;

  document.getElementById("sessionCapacity").value =
    btn.dataset.capacity;

  document.getElementById("sessionLocation").value =
    btn.dataset.location;

  document.getElementById("sessionStatus").value =
    btn.dataset.status;

  document.getElementById("saveSessionBtn").dataset.editId =
    btn.dataset.id;

});





// ===== Popup message Utility ===== //

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
