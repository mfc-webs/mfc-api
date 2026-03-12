function renderTimetable(data, role="member") {

  const days = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday"
  ];

  days.forEach(day=>{
    const column = document.getElementById(day);
    if(!column) return;

    column.innerHTML = "";

    const sessions = data.filter(s => s.day === day);

    sessions.forEach(session => {

      const slot = document.createElement("div");
      slot.className = "timetable-slot";

      if(role === "admin"){

        slot.innerHTML = `
          <span>${session.class_name}</span>
          <span>${session.time}</span>
          <span>${session.location}</span>
        `;

      } else {

        slot.innerHTML = `
          <span>${session.class_name} ${session.time}</span>
          <button 
            class="btn btn-sm ${session.enrolled ? 'btn-success' : 'btn-outline-light'} enroll-btn"
            data-id="${session.id}"
            ${session.enrolled ? 'disabled' : ''}
          >
            ${session.enrolled ? 'Enrolled' : 'Join Class'}
          </button>
        `;

      }

      column.appendChild(slot);

    });
  });

}

document.addEventListener("click", async (e) => {
  if(!e.target.classList.contains("enroll-btn")) return;

  const button = e.target;
  const sessionId = button.dataset.id;

  try {
    const res = await fetch("/api/class-bookings/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ session_id: sessionId })
    });

    if(res.status === 401){
      // user not logged in → redirect
      window.location.href = "/signup";
      return;
    }

    const data = await res.json();

    if(data.success){
      button.classList.emove("btn-outline-secondary");
      button.classList.add("btn-success");
      button.innerText = "Enrolling...";
      button.disabled = true;
    } else {
      alert(data.message || "Booking failed");
    }

  } catch(err){
    console.log("error:", err);
    console.error(err);
    
    alert("Server error while booking");
  }
});