const currentUser = requireLogin();

if (currentUser) {
  const result = JSON.parse(localStorage.getItem("quizScore"));

  if (!result || result.userId !== currentUser.id) {
    window.location.href = "quiz.html";
  } else {
    const percentage = (result.score / result.totalQuestions) * 100;
    const passed = percentage >= 50;
    const status = document.getElementById("status");

    document.getElementById("studentName").textContent = currentUser.name;
    document.getElementById("scoreValue").textContent = result.score;
    document.getElementById("totalQuestions").textContent = result.totalQuestions;
    document.getElementById("percentage").textContent = `${Math.round(percentage)}%`;
    status.textContent = passed ? "Pass" : "Fail";
    status.className = passed ? "badge text-bg-success" : "badge text-bg-danger";
    showMessage(passed ? "You passed the quiz." : "You failed the quiz. Try again.", passed ? "success" : "danger");
    document.getElementById("resultContent").classList.remove("d-none");

    document.getElementById("tryAgainButton").addEventListener("click", () => {
      localStorage.removeItem("quizScore");
      window.location.href = "quiz.html";
    });
  }
}
