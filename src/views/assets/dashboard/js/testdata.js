let members = [];

async function loadMembers() {
  try {
    const res = await fetch("/api/members");
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
      joinDate: (u.joindate || "").toString().slice(0, 10), // "YYYY-MM-DD"
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
              <div class="fw-semibold text-white">${escapeHtml(m.firstName)} ${escapeHtml(m.lastName)}</div>
              <div class="small-note">ID: ${escapeHtml(m.id.slice(0, 8))}...</div>
            </td>
            <td>${escapeHtml(m.email)}</td>
            <td>${escapeHtml(m.phone)}</td>
            <td>
              <span class="badge rounded-pill bg-${m.tier === "Gold" ? "warning" : m.tier === "Platinum" ? "info" : "secondary"} text-dark">
                ${escapeHtml(m.tier)}
              </span>
            </td>
            <td>${escapeHtml(m.joinDate)}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-light" onclick="editMember('${m.id}')">Edit</button>
              <button class="btn btn-sm btn-outline-danger ms-1" onclick="deleteMember('${m.id}')">Delete</button>
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

    const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");

    // update UI
    members = members.filter(m => m.id !== id);
    renderTable();
  } catch (err) {
    console.error(err);
    alert("Could not delete member.");
  }
};

window.editMember = async (id) => {
  const m = members.find(x => x.id === id);
  if (!m) return;

  const newTier = prompt("Update tier (Bronze / Gold / Platinum):", m.tier);
  if (!newTier) return;

  const allowed = ["Bronze", "Gold", "Platinum"];
  if (!allowed.includes(newTier)) {
    alert("Invalid tier.");
    return;
  }

  try {
    const res = await fetch(`/api/members/${id}/tier`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: newTier }),
    });

    if (!res.ok) throw new Error("Failed to update tier");

    // update UI locally
    m.tier = newTier;
    renderTable();
  } catch (err) {
    console.error(err);
    alert("Could not update tier.");
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
      tier: document.getElementById("tier").value,
    };

    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      joinDate: new Date(data.joindate).toISOString().slice(0, 10)
    };

    members.unshift(newMember);

    addMemberForm.reset();
    addMemberForm.classList.remove("was-validated");

    const modalEl = document.getElementById("addMemberModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    renderTable();
  } catch (err) {
    console.error(err);
    alert("Could not add member.");
  }
});


  // close modal
  const modalEl = document.getElementById("addMemberModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  renderTable();


// filters
searchInput.addEventListener("input", renderTable);
tierFilter.addEventListener("change", renderTable);

document.getElementById("year").textContent = new Date().getFullYear();
renderTable();