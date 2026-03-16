// member attence attendance

async function loadMemberStats(){

  const res = await fetch("/api/member/attendance/stats");

  const data = await res.json();

  document.getElementById("total-visits").innerText = data.total_visits || 0;

  document.getElementById("visits-month").innerText = data.visits_this_month || 0;

  if(data.last_visit){
    const d = new Date(data.last_visit);
    document.getElementById("last-visit").innerText =
      `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
  }

}
