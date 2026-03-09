// Overlay JS Logic

// function showAuthOverlay(message) {
//   const overlay = document.getElementById("authOverlay");
//   const msg = document.getElementById("authMessage");

//   msg.textContent = message || "You are not authorized.";
//   overlay.classList.remove("hidden-out");
// }

// function closeAuthOverlay() {
//   document.getElementById("authOverlay").classList.add("hidden-out");
// }

// global JS interceptor

// const originalFetch = window.fetch;

// window.fetch = async (...args) => {

//   const response = await originalFetch(...args);

//   if(response.status === 401 || response.status === 403){

//     try{
//       const data = await response.clone().json();

//       showAuthOverlay(data.message || "Authorization error");

//     }catch{
//       showAuthOverlay("Session expired.");
//     }

//   }

//   return response;
// };

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
      popup.style.background = "#77837abf";
  }

  // Show popup
  popup.classList.remove("hidden");

  // Hide after duration
  setTimeout(() => {
    popup.classList.add("hidden");
  }, duration);
}
