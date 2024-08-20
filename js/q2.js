// q2.js

const questions = [
    "I found myself getting upset by quite trivial things.",
    "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion).",
    "I couldn't seem to experience any positive feeling at all.",
    "I was aware of dryness of my mouth.",
    "I had a feeling of shakiness (e.g., legs going to give way).",
    "I just couldn't seem to get going.",
    "I tended to over-react to situations.",
    "I found myself in situations that made me so anxious I was most relieved when they ended.",
    "I felt that I had nothing to look forward to.",
    "I found it difficult to relax.",
    "I felt that I was using a lot of nervous energy.",
    "I had a feeling of faintness.",
    "I found myself getting upset rather easily.",
    "I felt scared without any good reason.",
    "I felt that I had lost interest in just about everything.",
    "I felt sad and depressed.",
    "I felt I was close to panic.",
    "I felt I wasn't worth much as a person.",
    "I found myself getting impatient when I was delayed in any way (e.g., elevators, traffic lights, being kept waiting).",
    "I found it hard to calm down after something upset me.",
    "I perspired noticeably (e.g., hands sweaty) in the absence of high temperatures or physical exertion."
];

const answers = [
    "Did not apply to me at all",
    "Applied to me to some degree, or some of the time",
    "Applied to me to a considerable degree, or a good part of the time",
    "Applied to me very much, or most of the time"
];

const colors = [
    '#ffcccc', '#ccffcc', '#ccccff', '#ffffcc'
];

const DASS_questions = {
    'Stress': [1, 4, 7, 10, 13, 16, 19],
    'Anxiety': [2, 5, 8, 11, 14, 17, 20],
    'Depression': [3, 6, 9, 12, 15, 18, 21]
};

const DASS_severity_ratings = {
    'Stress': [[0, 15], [15, 19], [19, 26], [26, 34], [34, Infinity]],
    'Anxiety': [[0, 8], [8, 10], [10, 15], [15, 20], [20, Infinity]],
    'Depression': [[0, 10], [10, 14], [14, 21], [21, 28], [28, Infinity]]
};

const DASS_severity = {
    'Stress': ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe'],
    'Anxiety': ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe'],
    'Depression': ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe']
};

let currentPage = 0;
const questionsPerPage = 3;
let selectedAnswers = new Array(questions.length).fill(null);

// Generate a unique user ID
function generateUserID() {
    return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

// On DOMContentLoaded, load user data and initialize page
document.addEventListener("DOMContentLoaded", () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.log('No user ID found. Redirecting to q1.html.');
        window.location.href = 'q1.html';
        return;
    }

    const savedAnswers = sessionStorage.getItem('selectedAnswers');
    if (savedAnswers) {
        selectedAnswers = JSON.parse(savedAnswers);
    }

    currentPage = Math.floor(selectedAnswers.filter(a => a !== null).length / questionsPerPage);
    renderPage();
});

// Render questions and answers on the page
function renderPage() {
    const questionsList = document.getElementById('questions-list');
    questionsList.innerHTML = '';
    const start = currentPage * questionsPerPage;
    const end = Math.min(start + questionsPerPage, questions.length);
    const currentQuestions = questions.slice(start, end);

    currentQuestions.forEach((question, index) => {
        const questionIndex = start + index;
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `<p>${questionIndex + 1}. ${question}</p>`;
        answers.forEach((answer, answerIndex) => {
            const answerElement = document.createElement('label');
            answerElement.innerText = answer;
            answerElement.style.backgroundColor = colors[answerIndex % colors.length];
            answerElement.classList.add('answer');

            if (selectedAnswers[questionIndex] === answerIndex) {
                answerElement.classList.add('selected');
            }

            answerElement.addEventListener('click', () => handleAnswerClick(answerElement, questionIndex, answerIndex));
            answerElement.addEventListener('dblclick', () => handleAnswerDblClick(answerElement, questionIndex));

            questionElement.appendChild(answerElement);
        });

        questionsList.appendChild(questionElement);
    });

    updateProgressBar();
    updateNavigationButtons();
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentPage === 0;
    nextBtn.innerText = currentPage >= Math.ceil(questions.length / questionsPerPage) - 1 ? 'Submit' : 'Next';
}

// Handle single click on an answer
function handleAnswerClick(element, questionIndex, answerIndex) {
    selectAnswer(element, questionIndex, answerIndex);
}

// Handle double click to deselect an answer
function handleAnswerDblClick(element, questionIndex) {
    deselectAnswer(questionIndex);
}

// Select an answer and update sessionStorage
function selectAnswer(element, questionIndex, answerIndex) {
    const answerElements = document.querySelectorAll(`.question:nth-child(${questionIndex - currentPage * questionsPerPage + 1}) .answer`);
    answerElements.forEach((el, index) => {
        if (index === answerIndex) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    });
    selectedAnswers[questionIndex] = answerIndex;
    sessionStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
}

// Deselect an answer
function deselectAnswer(questionIndex) {
    const answerElements = document.querySelectorAll(`.question:nth-child(${questionIndex - currentPage * questionsPerPage + 1}) .answer`);
    answerElements.forEach(el => el.classList.remove('selected'));
    selectedAnswers[questionIndex] = null;
    sessionStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
}

// Navigate to the next page
function nextPage() {
    if (validateAnswers()) {
        if (currentPage < Math.ceil(questions.length / questionsPerPage) - 1) {
            currentPage++;
            renderPage();
        } else {
            calculateResults();
        }
    } else {
        alert('Please answer all questions on this page before proceeding.');
    }
}

// Navigate to the previous page
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderPage();
    }
}

// Update progress bar based on the current page
function updateProgressBar() {
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');

    const progressPercentage = ((currentPage + 1) / totalPages) * 100;
    progressBarFill.style.width = `${progressPercentage}%`;
    progressText.innerText = `Page ${currentPage + 1} of ${totalPages}`;
}

// Validate if all answers on the current page are selected
function validateAnswers() {
    const start = currentPage * questionsPerPage;
    const end = Math.min(start + questionsPerPage, questions.length);
    for (let i = start; i < end; i++) {
        if (selectedAnswers[i] === null) {
            return false;
        }
    }
    return true;
}

// Calculate and display results based on selected answers
function calculateResults() {
    const scores = {
        'Stress': 0,
        'Anxiety': 0,
        'Depression': 0
    };

    Object.keys(DASS_questions).forEach(category => {
        DASS_questions[category].forEach(index => {
            if (selectedAnswers[index - 1] !== null) {
                scores[category] += selectedAnswers[index - 1];
            }
        });
        scores[category] *= 2; // Adjust if necessary
    });

    console.log('Raw Scores:', scores);

    const results = {};
    Object.keys(scores).forEach(category => {
        for (let i = 0; i < DASS_severity_ratings[category].length; i++) {
            if (scores[category] >= DASS_severity_ratings[category][i][0] && scores[category] < DASS_severity_ratings[category][i][1]) {
                results[category] = DASS_severity[category][i];
                break;
            }
        }
    });

    console.log('Results:', results);
    sessionStorage.setItem('results', JSON.stringify(results));
    window.location.href = 'q3.html';
}