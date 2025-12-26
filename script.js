const timetable = {
  Mon: [
    { subject: "Calculus (MATH1341)", room: "ICT / 627", start: "08:00", end: "08:50" },
    { subject: "Operating Systems", room: "ICT / 119", start: "09:00", end: "09:50" },
    { subject: "Critical Thinking", room: "ICT / 324", start: "10:00", end: "10:50" },
    { subject: "DAA", room: "ICT / 119", start: "11:00", end: "11:50" },
    { subject: "DBMS Lab", room: "ICT / 220", start: "14:00", end: "14:50" },
    { subject: "DBMS Lab", room: "ICT / 220", start: "15:00", end: "15:50" }
  ],
  Tue: [
    { subject: "Critical Thinking", room: "ICT / 527", start: "08:00", end: "08:50" },
    { subject: "Operating Systems", room: "ICT / 119", start: "09:00", end: "09:50" },
    { subject: "HV", room: "ICT / 328", start: "10:00", end: "10:50" },
    { subject: "Maths", room: "ICT / 224", start: "11:00", end: "11:50" },
    { subject: "EV Tech", room: "ICT / 428", start: "13:00", end: "13:50" }
  ],
  Wed: [
    { subject: "CLAD", room: "ICT / 305", start: "08:00", end: "08:50" },
    { subject: "CLAD", room: "ICT / 305", start: "09:00", end: "09:50" },
    { subject: "DBMS", room: "ICT / 118", start: "10:00", end: "10:50" },
    { subject: "DAA", room: "ICT / 119", start: "11:00", end: "11:50" }
  ],
  Thu: [
    { subject: "DAA Lab", room: "ICT / 209", start: "08:00", end: "08:50" },
    { subject: "DAA Lab", room: "ICT / 209", start: "09:00", end: "09:50" },
    { subject: "Operating Systems", room: "ICT / 119", start: "10:00", end: "10:50" },
    { subject: "DBMS", room: "ICT / 118", start: "11:00", end: "11:50" },
    { subject: "EV Tech", room: "ICT / 428", start: "13:00", end: "13:50" },
    { subject: "Maths", room: "ICT / 207", start: "14:00", end: "14:50" },
    { subject: "HV", room: "ICT / 207", start: "15:00", end: "15:50" }
  ],
  Fri: [
    { subject: "DBMS", room: "ICT / 122", start: "08:00", end: "08:50" },
    { subject: "HV", room: "ICT / 122", start: "09:00", end: "09:50" },
    { subject: "OS Lab", room: "ICT / 219", start: "10:00", end: "10:50" },
    { subject: "OS Lab", room: "ICT / 219", start: "11:00", end: "11:50" },
    { subject: "EV Tech", room: "ICT / 428", start: "13:00", end: "13:50" },
    { subject: "DAA", room: "ICT / 119", start: "14:00", end: "14:50" },
    { subject: "Maths", room: "ICT / 207", start: "15:00", end: "15:50" }
  ]
};

const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const buttons = document.querySelectorAll(".day");
const list = document.querySelector(".class-list");

const title = document.querySelector(".next-class-details h3");
const room = document.querySelector(".next-class-details p:nth-child(2)");
const time = document.querySelector(".next-class-details p:nth-child(3)");
const countdown = document.querySelector(".countdown");

let interval;

function toMinutes(t) {
  const [h,m] = t.split(":").map(Number);
  return h*60 + m;
}

function loadDay(day) {
  clearInterval(interval);
  list.innerHTML = "";

  const now = new Date();
  const currentMin = now.getHours()*60 + now.getMinutes();
  let nextMarked = false;

  timetable[day].forEach(c => {
    const start = toMinutes(c.start);
    const end = toMinutes(c.end);

    let status = "";
    if (currentMin >= start && currentMin < end) status = "current";
    else if (start > currentMin && !nextMarked) {
      status = "next";
      nextMarked = true;
    }

    list.innerHTML += `
      <div class="class-card ${status}">
        <div class="time">${c.start} - ${c.end}</div>
        <div>
          <h4>${c.subject}
            ${status==="current" ? "<span class='badge green'>NOW</span>" : ""}
            ${status==="next" ? "<span class='badge blue'>NEXT</span>" : ""}
          </h4>
          <p>${c.room}</p>
        </div>
      </div>
    `;
  });

  updateNext(day);
}

function updateNext(day) {
  const now = new Date();
  const minsNow = now.getHours()*60 + now.getMinutes();
  const next = timetable[day].find(c => toMinutes(c.start) > minsNow);

  if (!next) {
    title.textContent = "No more classes 🎉";
    room.textContent = "";
    time.textContent = "";
    countdown.textContent = "Enjoy your day!";
    return;
  }

  function updateTimer() {
    const now = new Date();
    const diff = toMinutes(next.start) - (now.getHours()*60 + now.getMinutes());
    title.textContent = next.subject;
    room.textContent = next.room;
    time.textContent = next.start;
    countdown.textContent = diff > 0 ? `Starts in ${diff} min` : "Starting now";
  }

  updateTimer();
  interval = setInterval(updateTimer, 60000);
}

const today = days[new Date().getDay()];
const defaultDay = timetable[today] ? today : "Mon";

buttons.forEach(b => {
  if (b.textContent === defaultDay) b.classList.add("active");
  b.onclick = () => {
    buttons.forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    loadDay(b.textContent);
  };
});

loadDay(defaultDay);
