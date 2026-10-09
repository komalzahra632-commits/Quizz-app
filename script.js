const questions = [
  {
    question: "Which planet in our solar system has the most moons?",
    answers: ["Jupiter", "Saturn", "Neptune", "Uranus"],
    correctAnswer: 1,
  },
  {
    question: "What is the only mammal capable of true flight?",
    answers: ["Flying squirrel", "Sugar glider", "Bat", "Colugo"],
    correctAnswer: 2,
  },
  {
    question: "Which artist painted the ceiling of the Sistine Chapel?",
    answers: ["Leonardo da Vinci", "Raphael", "Donatello", "Michelangelo"],
    correctAnswer: 3,
  },
  {
    question: "What is the largest organ in the human body?",
    answers: ["Liver", "Skin", "Lungs", "Brain"],
    correctAnswer: 1,
  },
  {
    question: "In which country did the game of chess originate?",
    answers: ["India", "China", "Persia", "Greece"],
    correctAnswer: 0,
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    answers: ["Gold", "Osmium", "Oxygen", "Oganesson"],
    correctAnswer: 2,
  },
  {
    question: "How many sides does a dodecagon have?",
    answers: ["Ten", "Eleven", "Twelve", "Fourteen"],
    correctAnswer: 2,
  },
  {
    question: "What is the smallest country in the world?",
    answers: ["Monaco", "San Marino", "Liechtenstein", "Vatican City"],
    correctAnswer: 3,
  },
];

const questionCount = document.querySelector("#question-count");
const liveScore = document.querySelector("#live-score");
const progressFill = document.querySelector("#progress-fill");
const progressTrack = document.querySelector(".progress-track");
const questionArea = document.querySelector("#question-area");
const questionText = document.querySelector("#question-text");
const answerList = document.querySelector("#answer-list");
const nextButton = document.querySelector("#next-button");
const nextLabel = document.querySelector("#next-label");
const selectionHint = document.querySelector("#selection-hint");
const quizContent = document.querySelector("#quiz-content");
const resultScreen = document.querySelector("#result-screen");
const resultHeading = document.querySelector("#result-heading");
const resultCopy = document.querySelector("#result-copy");
const finalScore = document.querySelector("#final-score");
const restartButton = document.querySelector("#restart-button");
const footerQuestion = document.querySelector("#footer-question");

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

function renderQuestion() {
  const question = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;

  questionCount.innerHTML = `QUESTION ${String(questionNumber).padStart(2, "0")} <span>/ ${String(questions.length).padStart(2, "0")}</span>`;
  footerQuestion.textContent = String(questionNumber).padStart(2, "0");
  liveScore.textContent = String(score);
  progressFill.style.width = `${(questionNumber / questions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(questionNumber));
  questionText.textContent = question.question;
  nextLabel.textContent = questionNumber === questions.length ? "Submit quiz" : "Next question";
  nextButton.disabled = true;
  selectedAnswer = null;
  selectionHint.textContent = "Choose the best answer to continue";

  answerList.replaceChildren();
  question.answers.forEach((answer, index) => {
    const option = document.createElement("button");
    option.className = "answer-option";
    option.type = "button";
    option.setAttribute("aria-pressed", "false");
    option.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span class="answer-text"></span>`;
    option.querySelector(".answer-text").textContent = answer;
    option.addEventListener("click", () => selectAnswer(index));
    answerList.append(option);
  });

  questionArea.style.animation = "none";
  requestAnimationFrame(() => {
    questionArea.style.animation = "";
  });
}

function selectAnswer(answerIndex) {
  selectedAnswer = answerIndex;
  answerList.querySelectorAll(".answer-option").forEach((option, index) => {
    const isSelected = index === answerIndex;
    option.classList.toggle("selected", isSelected);
    option.setAttribute("aria-pressed", String(isSelected));
  });
  nextButton.disabled = false;
  selectionHint.textContent = "Answer selected — ready when you are";
}

function showResults() {
  quizContent.hidden = true;
  resultScreen.hidden = false;
  finalScore.textContent = String(score);
  progressFill.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", String(questions.length));

  if (score === questions.length) {
    resultHeading.textContent = "A perfect score!";
    resultCopy.textContent = "Every answer, right on the money. Nicely done.";
  } else if (score >= questions.length * 0.625) {
    resultHeading.textContent = "Nicely done.";
    resultCopy.textContent = "You know your stuff. There's always room for one more round.";
  } else if (score >= questions.length * 0.375) {
    resultHeading.textContent = "Good going!";
    resultCopy.textContent = "A solid showing — and now you know a few new things.";
  } else {
    resultHeading.textContent = "Curiosity looks good on you.";
    resultCopy.textContent = "Every quiz is a chance to learn something new. Try again?";
  }
  restartButton.focus();
}

function advanceQuiz() {
  if (selectedAnswer === null) return;

  if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
    score += 1;
  }

  if (currentQuestionIndex === questions.length - 1) {
    liveScore.textContent = String(score);
    showResults();
    return;
  }

  currentQuestionIndex += 1;
  renderQuestion();
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resultScreen.hidden = true;
  quizContent.hidden = false;
  renderQuestion();
}

nextButton.addEventListener("click", advanceQuiz);
restartButton.addEventListener("click", restartQuiz);

renderQuestion();
