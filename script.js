// =====================================
// 🕒 TIMETABLE DATA
// =====================================
const timetable = {
  Mon: [
    { subject: "Calculus", room: "ICT / 627", start: "08:00", end: "08:50" },
    { subject: "Operating Systems", room: "ICT / 119", start: "09:00", end: "09:50" },
    { subject: "Critical Thinking", room: "ICT / 324", start: "10:00", end: "10:50" },
    { subject: "DAA", room: "ICT / 119", start: "11:00", end: "11:50" },
    { subject: "DBMS Lab", room: "ICT / 220", start: "14:00", end: "14:50" },
    { subject: "DBMS Lab", room: "ICT / 220", start: "15:00", end: "15:50" }
  ],
  Tue: [
    { subject: "Critical Thinking", room: "ICT / 527", start: "08:00", end: "08:50" },
    { subject: "Operating Systems", room: "ICT / 119", start: "09:00", end: "09:50" },
    { subject: "UHV", room: "ICT / 328", start: "10:00", end: "10:50" },
    { subject: "Calculus", room: "ICT / 224", start: "11:00", end: "11:50" },
    { subject: "EV Tech", room: "ICT / 428", start: "13:00", end: "13:50" }
  ],
  Wed: [
    { subject: "GCGC", room: "ICT / 305", start: "08:00", end: "08:50" },
    { subject: "GCGC", room: "ICT / 305", start: "09:00", end: "09:50" },
    { subject: "DBMS", room: "ICT / 118", start: "10:00", end: "10:50" },
    { subject: "DAA", room: "ICT / 119", start: "11:00", end: "11:50" }
  ],
  Thu: [
    { subject: "DAA Lab", room: "ICT / 209", start: "08:00", end: "08:50" },
    { subject: "DAA Lab", room: "ICT / 209", start: "09:00", end: "09:50" },
    { subject: "Operating Systems", room: "ICT / 119", start: "10:00", end: "10:50" },
    { subject: "DBMS", room: "ICT / 118", start: "11:00", end: "11:50" },
    { subject: "EV Tech", room: "ICT / 428", start: "13:00", end: "13:50" },
    { subject: "Calculus", room: "ICT / 207", start: "14:00", end: "14:50" },
    { subject: "UHV", room: "ICT / 207", start: "15:00", end: "15:50" }
  ],
  Fri: [
    { subject: "DBMS", room: "ICT / 122", start: "08:00", end: "08:50" },
    { subject: "UHV", room: "ICT / 122", start: "09:00", end: "09:50" },
    { subject: "OS Lab", room: "ICT / 219", start: "10:00", end: "10:50" },
    { subject: "OS Lab", room: "ICT / 219", start: "11:00", end: "11:50" },
    { subject: "EV Tech", room: "ICT / 428", start: "13:00", end: "13:50" },
    { subject: "DAA", room: "ICT / 119", start: "14:00", end: "14:50" },
    { subject: "Calculus", room: "ICT / 207", start: "15:00", end: "15:50" }
  ]
};


// =====================================
// DOM ELEMENTS
// =====================================
const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const buttons = document.querySelectorAll(".day");
const list = document.querySelector(".class-list");

const title = document.querySelector(".next-class-details h3");
const room = document.querySelector(".next-class-details p:nth-child(2)");
const time = document.querySelector(".next-class-details p:nth-child(3)");
const countdown = document.querySelector(".countdown");

let interval;


// =====================================
// UTIL
// =====================================
function toMinutes(t){
  const [h,m]=t.split(":").map(Number);
  return h*60+m;
}


// =====================================
// LOAD DAY (class list only)
// =====================================
function loadDay(day){
  clearInterval(interval);
  list.innerHTML="";
  const today = days[new Date().getDay()];
  const now = new Date();
  const minsNow = now.getHours()*60 + now.getMinutes();
  let markedNext = false;

  timetable[day].forEach(c=>{
    const start = toMinutes(c.start);
    const end = toMinutes(c.end);

    let status = "";

    // highlight ONLY if viewing TODAY
    if (day === today) {
      if (minsNow >= start && minsNow < end) status = "current";
      else if (!markedNext && start > minsNow){ status = "next"; markedNext = true; }
    }

    list.innerHTML+=`
      <div class="class-card ${status}">
        <div class="time">${c.start} - ${c.end}</div>
        <div>
          <h4>${c.subject}
            ${day===today && status==="current" ? "<span class='badge green'>NOW</span>" : ""}
            ${day===today && status==="next" ? "<span class='badge blue'>NEXT</span>" : ""}
          </h4>
          <p>${c.room}</p>
        </div>
      </div>
    `;
  });
}


// =====================================
// TOP CARD (ALWAYS TODAY)
// =====================================
function updateNext(){
  const today = days[new Date().getDay()];
  const classesToday = timetable[today];
  const now = new Date();
  const current = now.getHours()*60 + now.getMinutes();

  const next = classesToday.find(c => toMinutes(c.start) > current);

  if (!next) {
    title.textContent = "No more classes today 🎉";
    room.textContent = "";
    time.textContent = "";
    countdown.textContent = "Enjoy your day!";
    return;
  }

  function refresh(){
    const now = new Date();
    const diff = toMinutes(next.start) - (now.getHours()*60 + now.getMinutes());
    title.textContent = next.subject;
    room.textContent = next.room;
    time.textContent = next.start;
    countdown.textContent = diff > 0
      ? `⏳ Starts in ${diff} min`
      : "⭐️ Starting now!";
  }

  refresh();
  clearInterval(interval);
  interval = setInterval(refresh, 60000);
}


// =====================================
// NOTIFICATIONS
// =====================================
function requestNotificationAccess(){
  if(!("Notification" in window)) return;
  Notification.requestPermission().then(p=>{
    if(p==="granted") scheduleNotifications();
  });
}

function scheduleNotifications(){
  const today = days[new Date().getDay()];
  const classes = timetable[today];
  if(!classes) return;

  const now = new Date();
  const current = now.getHours()*60 + now.getMinutes();

  classes.forEach(c=>{
    const notifyTime = toMinutes(c.start) - 10;
    if(notifyTime > current){
      setTimeout(()=>{
        new Notification("📚 Class Reminder",{
          body:`${c.subject} in ${c.room} at ${c.start}`,
          icon:"https://cdn-icons-png.flaticon.com/512/2989/2989988.png"
        });
      }, (notifyTime-current)*60000);
    }
  });
}


// =====================================
// 🌙 DARK MODE
// =====================================
const themeBtn = document.getElementById("themeToggle");

function loadTheme(){
  if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
    themeBtn.textContent="☀️ Light Mode";
  }
}
loadTheme();

themeBtn.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  const isDark=document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark?"dark":"light");
});


// =====================================
// INIT
// =====================================
const today = days[new Date().getDay()];
const openDay = timetable[today] ? today : "Mon";

buttons.forEach(b=>{
  if(b.textContent===openDay) b.classList.add("active");
  b.onclick=()=>{
    buttons.forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    loadDay(b.textContent);
  };
});

loadDay(openDay);
updateNext();
requestNotificationAccess();
