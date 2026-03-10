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
          <button class="btn btn-sm btn-outline-secondary">Enroll</button>
        `;

      }

      column.appendChild(slot);

    });
  });

}