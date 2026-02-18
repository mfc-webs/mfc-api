//////// menu sidebar controls
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


// Minimal UI wiring (hook API later)


// Preview profile image
  document.getElementById("profileImage")?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    document.getElementById("profilePreview").src = url;
  });


  document.getElementById("printDetailsBtn")?.addEventListener("click", () => window.print());


// - - - save personal details information button - - - /
document.getElementById("savePersonalBtn")?.addEventListener("click", async () => {
    try {
    // If you're uploading a file, use FormData:
    const data = {

        whatsapp_number: document.getElementById("wa-phone")?.value || "",
        alt_phone: document.getElementById("altPhone")?.value || "",
        street_address: document.getElementById("street")?.value || "",
        city: document.getElementById("city")?.value || "",
        province: document.getElementById("province")?.value || "",
        postal_code: document.getElementById("postalCode")?.value || "",
        notes: document.getElementById("addressNotes")?.value || ""
    };
   


        const res = await fetch("/member-personal-details-update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data),
          });

    // Show real response
    const text = await res.text();
    console.log("SAVE PROFILE:", res.status, res.statusText, res.url, text);


    if (!res.ok) {
      alert(`Could not save ❌ (status ${res.status})`);
      return;
    }

    alert("Personal details saved ✅");

  } catch (err) {
    console.error("Profile update error", err);        // full error
    console.error("CODE:", err.code, "MSG:", err.message); // pg errors have code/message
    return res.status(500).alert("Server error updating your personal details");
  }
});


// - - - Emergency Contact details - - - //

document.getElementById("saveEmergencyBtn")?.addEventListener("click", async () => {

try {
  const data = {
     ecname: document.getElementById("ecName")?.value?.trim(),
     relationship: document.getElementById("ecRelationship")?.value?.trim(),
     phone: document.getElementById("ecPhone")?.value?.trim(),
     priority: document.getElementById("ecPriority")?.value,
     ems_notes: document.getElementById("ecNotes")?.value.trim
  }

    // Validation
    if (!data.ecname || !data.phone) {
        alert("Please enter at least a name and phone number.");
        return;
    }

    const res = await fetch("/member-emergency-contact-update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data),
        });
      
     if (!res.ok) {
      console.log(req.body);
          alert("Failed to save emergency contact.");
          return;
        };

if (!data) return;

  renderEmergencyRow(data);

    // === TABLE MOUNTING ===
function renderEmergencyRow(data) {
  const tbody = document.getElementById("emergencyTable");

  tbody.innerHTML = ""; // clear placeholder

  const badgeClass =
    data.priority === "primary"
      ? "text-bg-primary"
      : "text-bg-secondary";

  const row = document.createElement("tr");

  row.innerHTML = `
    <td class="fw-semibold text-dark">${data.ecname}</td>
    <td class="small-note">${data.relationship || "—"}</td>
    <td class="small-note">${data.phone}</td>
    <td><span class="badge ${badgeClass}">${data.priority}</span></td>
    <td class="text-end">
      <button class="btn btn-outline-secondary btn-sm">Edit</button>
      <button class="btn btn-outline-danger btn-sm">Delete</button>
    </td>
  `;

  tbody.appendChild(row);
}


    // === SUMMARY UPDATE ===
    const summary = document.getElementById("nokSummary");
    if (summary) {
      summary.textContent =
        data.priority === "primary"
          ? `${data.ecname} (Primary)`
          : data.ecname;
    }

    // Close modal (Bootstrap)
    const modalEl = document.getElementById("addEmergencyModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();

    // Reset fields
    ["ecname", "ecRelationship", "ecPhone", "ecNotes"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });


    document.getElementById("ecPriority").value = "secondary";

  } catch (err) {
    alert("Server error updating your emergency contact details");
  }
 }); 

