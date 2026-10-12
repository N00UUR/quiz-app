const currentUser = requireLogin();

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

async function loadQuestions() {
  try {
    const response = await fetch("data/questions.json");

    if (!response.ok) {
      throw new Error("Failed to load questions.");
    }

    questions = await response.json();

    if (!Array.isArray(questions) || questions.length < 10) {
      throw new Error("Invalid question data.");
    }

    displayQuestion();
    document.getElementById("quizContent").classList.remove("d-none");
  } catch {
    showMessage("Could not load questions. Use Live Server and check data/questions.json.");
  } finally {
    document.getElementById("loadingMessage").classList.add("d-none");
  }
}

function displayQuestion() {
  hideMessage();

  const question = questions[currentQuestionIndex];
  const answers = document.getElementById("answers");
  const progress = (currentQuestionIndex / questions.length) * 100;

  document.getElementById("questionNumber").textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  document.getElementById("progressText").textContent = `${currentQuestionIndex} of ${questions.length} answered`;
  document.getElementById("questionText").textContent = question.question;
  document.getElementById("progressBar").style.width = `${progress}%`;
  document.getElementById("quizProgress").setAttribute("aria-valuenow", progress);
  answers.textContent = "";

  question.choices.forEach((choice, index) => {
    const option = document.createElement("div");
    option.className = "form-check border rounded p-3 ps-5 mb-2 answer-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.id = `answer-${index}`;
    input.value = index;
    input.className = "form-check-input";

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.className = "form-check-label";
    label.textContent = choice;

    option.append(input, label);
    answers.append(option);
  });

  document.getElementById("nextButton").textContent = currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next";
}

function submitAnswer(event) {
  event.preventDefault();

  if (currentQuestionIndex >= questions.length) {
    return;
  }

  const selectedAnswer = document.querySelector('input[name="answer"]:checked');

  if (!selectedAnswer) {
    showMessage("Please select an answer before continuing.");
    return;
  }

  if (Number(selectedAnswer.value) === questions[currentQuestionIndex].correctAnswer) {
    score += 1;
  }

  currentQuestionIndex += 1;

  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    const result = { userId: currentUser.id, score, totalQuestions: questions.length };
    localStorage.setItem("quizScore", JSON.stringify(result));
    document.getElementById("nextButton").disabled = true;
    window.location.href = "result.html";
  }
}

if (currentUser) {
  document.getElementById("studentName").textContent = currentUser.name;
  document.getElementById("quizForm").addEventListener("submit", submitAnswer);
  loadQuestions();
}
