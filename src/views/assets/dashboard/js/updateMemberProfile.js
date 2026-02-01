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
  document.getElementById("clearPasswordFieldsBtn")?.addEventListener("click", () => {
    ["currentPassword","newPassword","confirmPassword"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  });

  document.getElementById("updatePasswordBtn")?.addEventListener("click", () => {
    const current = document.getElementById("currentPassword").value.trim();
    const next = document.getElementById("newPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    if (!current || !next || !confirm) {
      alert("Please fill in all password fields.");
      return;
    }
    if (next.length < 8) {
      alert("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      alert("New password and confirm password do not match.");
      return;
    }

    // TODO: API call to update password
    alert("Password updated (hook API next).");
  });

  document.getElementById("logoutAllBtn")?.addEventListener("click", () => {
    // TODO: backend endpoint to revoke tokens/sessions
    alert("All devices logged out (hook API next).");
  });