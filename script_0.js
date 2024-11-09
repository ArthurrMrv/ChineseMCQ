document.getElementById('start-game').addEventListener('click', function () {
    const wordCount = document.getElementById('word-count').value;
    if (!wordCount || isNaN(wordCount)) {
        displayMessage('Please enter a valid number of words.', 'error');
        return;
    }

    if (wordCount < 1 ) { 
        displayMessage('Please enter at least 1.', 'error');
        return;
    }

    startGame(parseInt(wordCount));
});

let currentWordIndex = 0;
let correctAnswers = 0;
let words = [];

function startGame(wordCount) {
    fetch('words.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {

            wordCount = Math.min(wordCount, data.length); // Ensure we don't try to get more words than available

            words = shuffleArray(data).slice(0, wordCount);
            currentWordIndex = 0;
            correctAnswers = 0;

            document.querySelector('.input-section').classList.add('hidden');
            document.getElementById('quiz-section').classList.remove('hidden');
            document.getElementById('result-message').textContent = ''; // Clear old messages
            showQuestion();
        })
        .catch(error => {
            displayMessage('Failed to load words. Please try again later.', 'error');
            console.error('Error loading words:', error);
        });
}

document.getElementById('submit-answer').addEventListener('click', function () {
    checkAnswer();
});

function showQuestion() {
    const wordPair = words[currentWordIndex];
    const isFrenchToEnglish = Math.random() >= 0.5;

    document.getElementById('question-text').textContent = isFrenchToEnglish
        ? `Translate: ${wordPair.fr}`
        : `Translate: ${wordPair.ch}`;

    document.getElementById('answer').value = ''; // Clear previous input
}

// Helper function to remove accents from a string
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function checkAnswer() {
    const answer = document.getElementById('answer').value.trim().toLowerCase();
    const wordPair = words[currentWordIndex];
    const correctAnswer = document.getElementById('question-text').textContent.includes(wordPair.fr)
        ? wordPair.ch
        : wordPair.fr;

    // Remove accents from both the answer and the correct answer before comparing
    const normalizedAnswer = removeAccents(answer);
    const normalizedCorrectAnswer = removeAccents(correctAnswer.toLowerCase());

    if (normalizedAnswer === normalizedCorrectAnswer) {
        correctAnswers++;
        displayMessage(`Correct! The translation is: ${correctAnswer}`, 'success');
    } else {
        displayMessage(`Incorrect. The correct translation is: ${correctAnswer}`, 'error');
    }

    currentWordIndex++;

    if (currentWordIndex < words.length) {
        setTimeout(showQuestion, 2000); // Delay next question by 2 seconds
    } else {
        setTimeout(showResults, 2000); // Delay showing results by 2 seconds
    }
}

function showResults() {
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');

    const score = (correctAnswers / words.length) * 100;
    let resultText = `You got ${correctAnswers} out of ${words.length} correct.`;

    if (score >= 75) {
        resultText += " Great job!";
    } else if (score >= 50) {
        resultText += " Not bad!";
    } else {
        resultText += " Better luck next time!";
    }

    displayMessage('', ''); // Clear any previous messages

    document.getElementById('result-text').textContent = resultText;
}

document.getElementById('restart-game').addEventListener('click', function () {
    document.getElementById('results-section').classList.add('hidden');
    document.querySelector('.input-section').classList.remove('hidden');
});

// Helper function to display messages on the screen
function displayMessage(message, type) {
    const messageElement = document.getElementById('result-message');
    messageElement.textContent = message;
    messageElement.className = ''; // Reset any previous class
    if (type === 'success') {
        messageElement.classList.add('success-message');
    } else if (type === 'error') {
        messageElement.classList.add('error-message');
    }
}

// Helper function to shuffle the word list
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
