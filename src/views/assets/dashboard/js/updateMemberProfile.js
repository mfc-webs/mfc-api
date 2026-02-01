  // Preview profile image
  document.getElementById("profileImage")?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    document.getElementById("profilePreview").src = url;
  });

  // Toggle password visibility buttons
  document.querySelectorAll("[data-toggle-pass]")?.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-toggle-pass");
      const input = document.getElementById(id);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  // Save profile hook
  document.getElementById("saveProfileBtn")?.addEventListener("click", async () => {
  try {
    // If you're uploading a file, use FormData:
    const fd = new FormData();

    fd.append("display_name", document.getElementById("displayName")?.value || "");
    fd.append("bio", document.getElementById("bio")?.value || "");

    if (document.getElementById("notifyEmail")?.checked) fd.append("mail_note", "on");
    if (document.getElementById("notifySms")?.checked) fd.append("sms_note", "on");
    if (document.getElementById("notifyWhatsapp")?.checked) fd.append("wa_note", "on");

    const fileInput = document.getElementById("profileImage");
    if (fileInput?.files?.[0]) fd.append("profile_picture", fileInput.files[0]); // IMPORTANT name

    const res = await fetch("/member-profile/update", {
      method: "POST",
      body: fd,
    });

    // Show real response
    const text = await res.text();
    console.log("SAVE PROFILE:", res.status, res.statusText, res.url, text);

    if (!res.ok) {
      alert(`Could not save profile ❌ (status ${res.status})`);
      return;
    }

    alert("Profile saved ✅");
  } catch (err) {
    console.error(err);
    alert("Could not save profile ❌ (network/js error)");
  }
});



  // Password actions
 document.addEventListener("DOMContentLoaded", () => {
  const ids = ["currentPassword", "newPassword", "confirmPassword"];

  const clearPasswords = () => {
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      el.value = "";
      // helps UI update / some libraries / autofill edge cases
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
  };

  document.getElementById("clearPasswordFieldsBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    clearPasswords();
  });

  document.getElementById("updatePasswordBtn")?.addEventListener("click", async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById("currentPassword")?.value.trim();
    const newPassword = document.getElementById("newPassword")?.value.trim();
    const confirmPassword = document.getElementById("confirmPassword")?.value.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await fetch("/member-password/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        alert(data.message || `Could not update password ❌ (status ${res.status})`);
        return;
      }

      clearPasswords();
      alert("Password updated ✅");
    } catch (err) {
      console.error(err);
      alert("Could not update password ❌");
    }
  });
});


  document.getElementById("logoutAllBtn")?.addEventListener("click", () => {
    alert("All devices logged out (hook API next).");
  });