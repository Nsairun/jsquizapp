const categorySelect = document.getElementById('categorySelect');
const difficultySelect = document.getElementById('difficultySelect');
const questionSection = document.getElementById('questionSection');
const questionElement = document.getElementById('question');
const answerSection = document.getElementById('answerSection');
const nextButton = document.getElementById('nextButton');
const startButton = document.getElementById('startButton');
const resultsSection = document.getElementById('resultsSection');
const correctCountElement = document.getElementById('correctCount');
const wrongCountElement = document.getElementById('wrongCount');

const apiUrl = 'https://opentdb.com/api.php?amount=10';

let currentQuestionIndex = 0;
let questions = [];
let correctCount = 0;
let wrongCount = 0;

fetch('https://opentdb.com/api_category.php')
  .then(response => response.json())
  .then(data => {
    data.trivia_categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.text = category.name;
      categorySelect.appendChild(option);
    });
  });

startButton.addEventListener('click', startQuiz);

function startQuiz() {
  const selectedCategory = categorySelect.value;
  const selectedDifficulty = difficultySelect.value;

  const url = `${apiUrl}&category=${selectedCategory}&difficulty=${selectedDifficulty}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      questions = data.results;
      currentQuestionIndex = 0;
      correctCount = 0;
      wrongCount = 0;

      displayQuestion();
      startButton.classList.add('hidden');
      questionSection.classList.remove('hidden');
      resultsSection.classList.add('hidden');
    });
}

function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  questionElement.innerHTML = currentQuestion.question;
  answerSection.innerHTML = '';

  currentQuestion.answers = shuffle([...currentQuestion.incorrect_answers, currentQuestion.correct_answer]);

  currentQuestion.answers.forEach(answer => {
    const answerLabel = document.createElement('label');
    const answerInput = document.createElement('input');
    answerInput.type = 'radio';
    answerInput.name = 'answer';
    answerInput.value = answer;
    answerLabel.classList.add('block', 'mb-2');
    answerLabel.appendChild(answerInput);
    answerLabel.appendChild(document.createTextNode(answer));
    answerSection.appendChild(answerLabel);
  });

  nextButton.classList.add('hidden');
}

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
   array[randomIndex] = temporaryValue;
  }

  return array;
}

answerSection.addEventListener('change', () => {
  nextButton.classList.remove('hidden');
});

nextButton.addEventListener('click', showNextQuestion);

function showNextQuestion() {
  const checkedInput = document.querySelector('input[name="answer"]:checked');

  if (!checkedInput) {
    alert('Please select an answer');
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = checkedInput.value;
  const correctAnswer = currentQuestion.correct_answer;

  if (userAnswer === correctAnswer) {
    correctCount++;
  } else {
    wrongCount++;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex === questions.length) {
    showResults();
  } else {
    displayQuestion();
  }
}

function showResults() {
  questionSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');

  correctCountElement.textContent = `Correct Answers: ${correctCount}`;
  wrongCountElement.textContent = `Wrong Answers: ${wrongCount}`;

  startButton.classList.remove('hidden');
}