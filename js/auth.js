function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function showMessage(text, type = "danger") {
  const message = document.getElementById("message");
  message.textContent = text;
  message.className = `alert alert-${type}`;
}

function hideMessage() {
  document.getElementById("message").classList.add("d-none");
}

function requireLogin() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "index.html";
  }

  return currentUser;
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

function registerStudent(event) {
  event.preventDefault();
  hideMessage();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    showMessage("Please fill in all fields.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("Please enter a valid email.");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.");
    return;
  }

  const students = getStudents();

  if (students.some((student) => student.email === email)) {
    showMessage("This email is already registered.");
    return;
  }

  const student = { id: Date.now(), name, email, password };
  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));
  window.location.href = "index.html";
}

function loginStudent(event) {
  event.preventDefault();
  hideMessage();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Please enter your email and password.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("Please enter a valid email.");
    return;
  }

  const student = getStudents().find(
    (item) => item.email === email && item.password === password
  );

  if (!student) {
    showMessage("Email or password is incorrect.");
    return;
  }

  const currentUser = { id: student.id, name: student.name, email: student.email };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.removeItem("quizScore");
  window.location.href = "quiz.html";
}

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutButton");

if (registerForm) {
  registerForm.addEventListener("submit", registerStudent);
}

if (loginForm) {
  loginForm.addEventListener("submit", loginStudent);
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
