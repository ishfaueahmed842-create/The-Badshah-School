/* The Smart Modern Public School - shared app logic */
const DB_KEY = "smps_db_v1";

const defaultDB = {
  users: [
    { id: "S1001", name: "Ayesha Khan", className: "9-A", email: "ayesha@student.smps.edu", password: "student123", role: "student", phone: "0300-1112233", attendance: "96%", fee: "Paid" },
    { id: "S1002", name: "Hamza Ali", className: "10-B", email: "hamza@student.smps.edu", password: "student123", role: "student", phone: "0301-4455667", attendance: "91%", fee: "Pending" }
  ],
  teachers: [
    { id: "T01", name: "Ms. Sara Ahmed", subject: "English", classes: "8, 9", email: "sara@smps.edu" },
    { id: "T02", name: "Mr. Imran Malik", subject: "Mathematics", classes: "9, 10", email: "imran@smps.edu" },
    { id: "T03", name: "Dr. Nida Farooq", subject: "Science", classes: "6-8", email: "nida@smps.edu" },
    { id: "T04", name: "Mr. Bilal Hussain", subject: "Computer", classes: "9-12", email: "bilal@smps.edu" }
  ],
  notices: [
    { id: 1, title: "Mid-Term Exams Schedule", date: "2026-09-20", body: "Mid-term exams will start from 5 October. Date sheet is available at the office." },
    { id: 2, title: "Parent-Teacher Meeting", date: "2026-09-25", body: "PTM will be held on Saturday from 9:00 AM to 1:00 PM." },
    { id: 3, title: "Sports Week", date: "2026-10-12", body: "Annual sports week registrations are open for all classes." }
  ],
  admissions: [
    { id: 1, name: "Zara Sheikh", applyingFor: "Grade 6", status: "Pending", phone: "0321-9988776" },
    { id: 2, name: "Omar Raza", applyingFor: "Grade 1", status: "Approved", phone: "0333-1122334" }
  ],
  messages: [
    { id: 1, name: "Fatima Noor", email: "fatima@email.com", message: "Please share the admission form deadline.", date: "2026-09-16" }
  ],
  gallery: [
    "Science Lab", "Library", "Sports Day", "Morning Assembly", "Computer Lab", "Art Class", "Annual Function", "Campus View"
  ],
  admin: { username: "admin", password: "admin123" }
};

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDB));
    return structuredClone(defaultDB);
  }
  try { return JSON.parse(raw); } catch { return structuredClone(defaultDB); }
}
function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(() => { t.style.display = "none"; }, 2200);
}

function toggleNav() {
  document.getElementById("nav")?.classList.toggle("open");
}

function renderNotices(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const db = loadDB();
  el.innerHTML = db.notices.map(n => `
    <article class="card notice">
      <small>${n.date}</small>
      <h4>${n.title}</h4>
      <p>${n.body}</p>
    </article>
  `).join("");
}

function renderTeachers(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const db = loadDB();
  el.innerHTML = db.teachers.map(t => `
    <article class="card">
      <div class="icon-box">👩‍🏫</div>
      <h4>${t.name}</h4>
      <p><strong>${t.subject}</strong></p>
      <p>Classes: ${t.classes}</p>
    </article>
  `).join("");
}

function renderGallery(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const db = loadDB();
  const photos = [
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1577896852618-01eeeecd36e0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1588072432836-e10032774343?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80"
  ];
  el.innerHTML = db.gallery.map((g, i) =>
    photos[i] ? `<img src="${photos[i]}" alt="${g}" title="${g}">` : `<div class="ph">${g}</div>`
  ).join("");
}

function handleContact(e) {
  e.preventDefault();
  const db = loadDB();
  const form = e.target;
  db.messages.unshift({
    id: Date.now(),
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
    date: new Date().toISOString().slice(0, 10)
  });
  saveDB(db);
  form.reset();
  toast("Message sent. Admin will review it.");
}

function handleAdmission(e) {
  e.preventDefault();
  const db = loadDB();
  const form = e.target;
  db.admissions.unshift({
    id: Date.now(),
    name: form.fullName.value,
    applyingFor: form.grade.value,
    status: "Pending",
    phone: form.phone.value
  });
  saveDB(db);
  form.reset();
  toast("Admission application submitted.");
}

function studentLogin(e) {
  e.preventDefault();
  const id = e.target.studentId.value.trim();
  const pass = e.target.password.value;
  const db = loadDB();
  const user = db.users.find(u => (u.id === id || u.email === id) && u.password === pass && u.role === "student");
  if (!user) { toast("Invalid student credentials"); return; }
  sessionStorage.setItem("smps_student", JSON.stringify(user));
  location.href = "student-dashboard.html";
}

function adminLogin(e) {
  e.preventDefault();
  const db = loadDB();
  const u = e.target.username.value.trim();
  const p = e.target.password.value;
  if (u === db.admin.username && p === db.admin.password) {
    sessionStorage.setItem("smps_admin", "1");
    location.href = "admin-dashboard.html";
  } else toast("Invalid admin credentials");
}

function requireStudent() {
  const raw = sessionStorage.getItem("smps_student");
  if (!raw) { location.href = "login.html"; return null; }
  return JSON.parse(raw);
}

function requireAdmin() {
  if (sessionStorage.getItem("smps_admin") !== "1") {
    location.href = "admin-login.html";
    return false;
  }
  return true;
}

function logout(kind) {
  sessionStorage.removeItem(kind === "admin" ? "smps_admin" : "smps_student");
  location.href = "index.html";
}

function showPanel(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
  document.querySelectorAll(".sidebar button, .sidebar a").forEach(a => a.classList.remove("active"));
  document.querySelector(`[data-panel="${id}"]`)?.classList.add("active");
}

function renderAdmin() {
  if (!requireAdmin()) return;
  const db = loadDB();
  const kpi = document.getElementById("kpis");
  if (kpi) {
    kpi.innerHTML = `
      <div class="card"><b>${db.users.length}</b><div>Students</div></div>
      <div class="card"><b>${db.teachers.length}</b><div>Teachers</div></div>
      <div class="card"><b>${db.admissions.length}</b><div>Admissions</div></div>
      <div class="card"><b>${db.notices.length}</b><div>Notices</div></div>`;
  }
  const st = document.getElementById("studentsTable");
  if (st) st.innerHTML = `<tr><th>ID</th><th>Name</th><th>Class</th><th>Email</th><th>Fee</th><th></th></tr>` +
    db.users.map(u => `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.className}</td><td>${u.email}</td><td>${u.fee}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteStudent('${u.id}')">Delete</button></td></tr>`).join("");
  const tt = document.getElementById("teachersTable");
  if (tt) tt.innerHTML = `<tr><th>ID</th><th>Name</th><th>Subject</th><th>Classes</th><th></th></tr>` +
    db.teachers.map(t => `<tr><td>${t.id}</td><td>${t.name}</td><td>${t.subject}</td><td>${t.classes}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteTeacher('${t.id}')">Delete</button></td></tr>`).join("");
  const at = document.getElementById("admissionsTable");
  if (at) at.innerHTML = `<tr><th>Name</th><th>Grade</th><th>Phone</th><th>Status</th><th></th></tr>` +
    db.admissions.map(a => `<tr><td>${a.name}</td><td>${a.applyingFor}</td><td>${a.phone}</td><td>${a.status}</td>
      <td><button class="btn btn-success btn-sm" onclick="setAdmission(${a.id},'Approved')">Approve</button>
      <button class="btn btn-danger btn-sm" onclick="setAdmission(${a.id},'Rejected')">Reject</button></td></tr>`).join("");
  const nt = document.getElementById("noticesManage");
  if (nt) nt.innerHTML = db.notices.map(n => `<div class="card"><strong>${n.title}</strong> — ${n.date}<p>${n.body}</p>
    <button class="btn btn-danger btn-sm" onclick="deleteNotice(${n.id})">Delete</button></div>`).join("");
  const gt = document.getElementById("galleryManage");
  if (gt) gt.innerHTML = db.gallery.map((g,i) => `<span class="card" style="display:inline-block;margin:6px">${g}
    <button class="btn btn-danger btn-sm" onclick="deleteGallery(${i})">x</button></span>`).join("");
  const mt = document.getElementById("messagesTable");
  if (mt) mt.innerHTML = `<tr><th>Name</th><th>Email</th><th>Message</th><th>Date</th></tr>` +
    db.messages.map(m => `<tr><td>${m.name}</td><td>${m.email}</td><td>${m.message}</td><td>${m.date}</td></tr>`).join("");
}

function addStudent(e) {
  e.preventDefault();
  const db = loadDB();
  const f = e.target;
  db.users.push({
    id: f.sid.value, name: f.sname.value, className: f.sclass.value,
    email: f.semail.value, password: f.spass.value || "student123",
    role: "student", phone: f.sphone.value, attendance: "100%", fee: "Pending"
  });
  saveDB(db); f.reset(); toast("Student added"); renderAdmin();
}
function deleteStudent(id) {
  const db = loadDB();
  db.users = db.users.filter(u => u.id !== id);
  saveDB(db); renderAdmin();
}
function addTeacher(e) {
  e.preventDefault();
  const db = loadDB();
  const f = e.target;
  db.teachers.push({ id: f.tid.value, name: f.tname.value, subject: f.tsubject.value, classes: f.tclasses.value, email: f.temail.value });
  saveDB(db); f.reset(); toast("Teacher added"); renderAdmin();
}
function deleteTeacher(id) {
  const db = loadDB();
  db.teachers = db.teachers.filter(t => t.id !== id);
  saveDB(db); renderAdmin();
}
function setAdmission(id, status) {
  const db = loadDB();
  const a = db.admissions.find(x => x.id === id);
  if (a) a.status = status;
  saveDB(db); renderAdmin();
}
function addNotice(e) {
  e.preventDefault();
  const db = loadDB();
  db.notices.unshift({ id: Date.now(), title: e.target.ntitle.value, date: e.target.ndate.value, body: e.target.nbody.value });
  saveDB(db); e.target.reset(); toast("Notice published"); renderAdmin();
}
function deleteNotice(id) {
  const db = loadDB();
  db.notices = db.notices.filter(n => n.id !== id);
  saveDB(db); renderAdmin();
}
function addGallery(e) {
  e.preventDefault();
  const db = loadDB();
  db.gallery.push(e.target.gtitle.value);
  saveDB(db); e.target.reset(); renderAdmin();
}
function deleteGallery(i) {
  const db = loadDB();
  db.gallery.splice(i, 1);
  saveDB(db); renderAdmin();
}

function renderStudentDash() {
  const user = requireStudent();
  if (!user) return;
  const box = document.getElementById("studentInfo");
  if (box) box.innerHTML = `
    <div class="grid-3">
      <div class="card"><h4>${user.name}</h4><p>ID: ${user.id}</p><p>Class: ${user.className}</p></div>
      <div class="card"><h4>Attendance</h4><p style="font-size:28px;font-weight:800">${user.attendance}</p></div>
      <div class="card"><h4>Fee Status</h4><p>${user.fee}</p><p>${user.email}</p></div>
    </div>`;
  renderNotices("studentNotices");
}

document.addEventListener("DOMContentLoaded", () => {
  renderNotices("noticeList");
  renderTeachers("teacherGrid");
  renderGallery("galleryGrid");
  if (document.body.dataset.page === "admin") renderAdmin();
  if (document.body.dataset.page === "student") renderStudentDash();
});
