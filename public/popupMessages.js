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

export default showPopup;