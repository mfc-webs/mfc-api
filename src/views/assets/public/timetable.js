function renderTimetable(data, role="member") {

  const days = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday"
  ];

  days.forEach(day=>{
    const column = document.getElementById(day);
    if(!column) return;

    column.innerHTML = "";

    const sessions = data
    .filter(s => s.day === day)
    .sort((a,b) => a.time.localeCompare(b.time));

    

    sessions.forEach(session => {

      const slot = document.createElement("div");
      slot.className = "timetable-slot";

      const d = new Date(session.starts_at);

      const date = `${d.getDate()}/${d.getMonth()+1}`;
      const button = `
              <button 
                class="btn btn-sm ${session.enrolled ? 'btn-success' : 'btn-outline-light'} enroll-btn"
                data-id="${session.id}"
                ${session.enrolled ? 'disabled' : ''}
              >
                ${session.enrolled ? 'Enrolled' : 'Join'}
              </button>
            `;
      
        switch (role) {

          case "admin":
            slot.innerHTML = `
            <div class="border p-1 rounded-3">
              <div class="d-flex justify-content-between border-bottom-1">
                  <span class="glass-card border-1 rounded-1 btn-outline-light p-10">#${session.id}</span>
                  <span> ${session.class_name}</span>
                  <span>${session.time}</span>
                  <span>${date}</span>
              </div>
              <div class=" mt-1 mb-1"></div>
              <span class="mt-2">${session.location}</span>
            </div>
            `;
          break;

          case "member":
            slot.innerHTML = `
            <div class=" p-1 rounded-3">
              <div class="d-flex justify-content-between">
                  <div class="d-flex flex-wrap width-100 justify-content-between gap-2" style="width: 80%; padding-right: 10px">
                    <div>${session.class_name}</div> 
                    <div>${session.time} ${date}</div>
                  </div> 
                  <span>
                    ${button}
                  </span>
              </div>
              <div class="${session.location == null ? 'd-none' : ''}">
                <div class="border-bottom small-note mb-1 mt-2"></div>
                <span class="mt-2">${session.location}</span>
              </div>
            </div
            `;
          break;

          default:
            slot.innerHTML = `
            <div class="d-flex justify-content-between ">
                  <div class="d-flex flex-wrap width-100 justify-content-between gap-2" style="width: 80%; padding-right: 10px">
                    <div>${session.class_name}</div> 
                    <div>${session.time} ${date}</div>
                  </div> 
                  <span>
                    ${button}
                  </span>
              </div>
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
      window.location.href = "/login";
      return;
    }

    const data = await res.json();

    if(data.success){
      button.classList.remove("btn-outline-light");
      button.classList.add("btn-success");
      button.innerText = "Enrolled";
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