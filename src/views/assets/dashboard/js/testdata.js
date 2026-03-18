let members = [];

async function loadMembers() {
  try {
    const res = await fetch("/admin/api/members", {
      method: "GET",
      credentials: "include"
    });


    if (!res.ok) throw new Error("Failed to fetch members");

    const dbMembers = await res.json();

    // Transform DB shape -> UI shape
    members = dbMembers.map(u => ({
      id: String(u.id),                
      firstName: u.firstname,
      lastName: u.lastname,
      email: u.email,
      phone: u.phone,
      tier: u.tier || "Bronze",           
      joindate: u.joindate,
    }));

    renderTable(); // <-- this is your real render function
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadMembers);



document.addEventListener("DOMContentLoaded", () => {
  loadMembers();
});


// --- Helpers ---
const tbody = document.getElementById("membersTbody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const tierFilter = document.getElementById("tierFilter");

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function renderStats(list) {
  const total = list.length;
  const gold = list.filter(m => m.tier === "Gold").length;
  const platinum = list.filter(m => m.tier === "Platinum").length;
  const bronze = list.filter(m => m.tier === "Bronze").length;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statGold").textContent = gold;
  document.getElementById("statPlatinum").textContent = platinum;
  document.getElementById("statBronze").textContent = bronze;
}

function getFilteredMembers() {
  const q = searchInput.value.trim().toLowerCase();
  const tier = tierFilter.value;

  return members.filter(m => {
    const haystack = `${m.firstName} ${m.lastName} ${m.email} ${m.phone} ${m.tier}`.toLowerCase();
    const matchSearch = q === "" ? true : haystack.includes(q);
    const matchTier = tier === "" ? true : m.tier === tier;
    return matchSearch && matchTier;
  });
}

function renderTable() {
  const list = getFilteredMembers();
  renderStats(members);

  tbody.innerHTML = list.map(m => `
          <tr>
            <td>
              <div class="fw-semibold">
              ${escapeHtml(m.firstName)} ${escapeHtml(m.lastName)}
              </div>
            </td>
            <td>${escapeHtml(m.email)}</td>
            <td>${escapeHtml(m.phone)}</td>
            <td>
              <span class="badge rounded-pill bg-${m.tier === "Gold" ? "warning" : m.tier === "Platinum" ? "info" : "secondary"} text-dark">
                ${escapeHtml(m.tier)}
              </span>
            </td>
            <td>${escapeHtml(m.joindate)}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-success checkin-btn" data-user="${m.id}"><i class="fas fa-check"></i></button>
              <button class="btn btn-sm btn-outline-light" onclick="window.location='/admin/member-details/${m.id}'"><i class="fas fa-eye"></i></button>
              <button class="btn btn-sm btn-outline-secondary" onclick="editMember('${m.id}')"><i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-outline-danger ms-1" onclick="deleteMember('${m.id}')"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        `).join("");

  emptyState.style.display = members.length === 0 ? "block" : "none";
}

// --- Actions ---
window.deleteMember = async (id) => {
  try {
    const ok = confirm("Delete this member?");
    if (!ok) return;

    const res = await fetch(`/admin/api/members/${id}`, { method: "DELETE",
      credentials: "include"
     });

    if (!res.ok) throw new Error("Failed to delete");

    // update UI
    members = members.filter(m => m.id !== id);
    renderTable();
    showPopup("Member deleted successfully","success");
  } catch (err) {
    console.error(err);
    showPopup("Could not delete member.","error");
  }
};

window.editMember = async (id) => {
  const m = members.find(x => x.id === id);
  if (!m) return;

  const newTier = prompt("Update tier (Bronze / Gold / Platinum):", m.tier);
  if (!newTier) return;

  const allowed = ["Bronze", "Gold", "Platinum"];
  if (!allowed.includes(newTier)) {
    showPopup("Invalid tier.","error");
    return;
  }

  try {
    const res = await fetch(`/admin/api/members/${id}/tier`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ tier: newTier }),
    });

    if (!res.ok) throw new Error("Failed to update tier");

    // update UI locally
    m.tier = newTier;
    renderTable();
    showPopup("Member updated!","success");
  } catch (err) {
    console.error(err);
    showPopup("Could not update tier.","error");
  }
};


// --- Add Member Modal Form ---
addMemberForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!addMemberForm.checkValidity()) {
    addMemberForm.classList.add("was-validated");
    return;
  }

  try {
    const payload = {
      firstname: document.getElementById("firstName").value.trim(),
      lastname: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      tier: document.getElementById("tier").value.trim() || 'Bronze',
      gender: document.getElementById("gender").value.trim(),
      birthdate: document.getElementById("birthDate").value.trim(),
      joindate: document.getElementById("joindate").value,
      ecname : document.getElementById("eName").value.trim(),
      ephone : document.getElementById("eNumber").value.trim(),
      relationship : document.getElementById("eRship").value.trim(),
      notes: document.getElementById("notes").value.trim(),
    };
   

    const res = await fetch("/admin/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("ADD MEMBER failed:", res.status, data);
      alert(data.message || `Could not add member (HTTP ${res.status})`);
      return;
    }

    // Convert DB response -> UI shape and add to top
    const newMember = {
      id: String(data.id),
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      phone: data.phone,
      tier: data.tier || "Bronze",
      joindate: data.joindate,
    };

    members.unshift(newMember);

    addMemberForm.reset();
    addMemberForm.classList.remove("was-validated");

    const modalEl = document.getElementById("addMemberModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    renderTable();
    showPopup("Member added successfully!","success");
  } catch (err) {
    console.error(err);
    showPopup("Could not add member.", "error");
  }
});

renderTable();


// filters
searchInput.addEventListener("input", renderTable);
tierFilter.addEventListener("change", renderTable);

document.getElementById("year").textContent = new Date().getFullYear();
renderTable();

// check-in member //

document.addEventListener("click", async (e)=>{

  if(!e.target.closest(".checkin-btn")) return;

  const btn = e.target.closest(".checkin-btn");

  const user_id = btn.dataset.user;

  const res = await fetch("/api/attendance/checkin",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      user_id
    })
  });

  const data = await res.json();

 if(data.ok){

  showPopup("Member checked in","success");

  btn.disabled = true;
  btn.classList.remove("btn-outline-success");
  btn.classList.add("btn-success");

} else {

  showPopup(data.message || "Already checked in today","warning");

  btn.disabled = true;
  btn.classList.remove("btn-outline-success");
  btn.classList.add("btn-success");
}

});


// check checked-in status
async function loadCheckinStatus(){

  const buttons = document.querySelectorAll(".checkin-btn");

  for(const btn of buttons){

    const user_id = btn.dataset.user;

    console.log(user_id);

    const res = await fetch(`/api/attendance/status/${user_id}`,{
      credentials:"include"
    });

    const data = await res.json();

    if(data.checked_in_today){

      btn.disabled = true;

      btn.classList.remove("btn-outline-success");
      btn.classList.add("btn-success");

    }

  }

}




// ===== Popup Utility ===== //

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
