
document.getElementById('start-game').addEventListener('click', function () {
    
    let wordCount = document.getElementById('word-count').value;
    document.getElementById('word-count').addEventListener('input', function () {
        wordCount = this.value;
    });

    if (!wordCount || isNaN(wordCount || wordCount < 1)) {
        displayMessage('Please enter a valid number of words. (>0)', 'error');
        document.getElementById('word-count').value = '';
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

function showQuestion() {
    const wordPair = words[currentWordIndex];
    const isFrenchToEnglish = Math.random() >= 0.5;

    const correctAnswer = isFrenchToEnglish ? wordPair.ch : wordPair.fr;
    const questionText = isFrenchToEnglish ? wordPair.fr : wordPair.ch;

    // Show the question
    document.getElementById('question-text').textContent = `Translate: ${questionText}`;

    // Generate 3 incorrect answers based on the language of the expected answer
    let possibleAnswers = generateMultipleChoices(correctAnswer, isFrenchToEnglish);

    // Shuffle and display the answers as clickable buttons
    displayChoices(possibleAnswers);
}

function generateMultipleChoices(correctAnswer, isFrenchToEnglish) {
    const choices = [correctAnswer];

    // Collect all possible incorrect answers from the same language as the correct answer
    const answerPool = isFrenchToEnglish
        ? words.map(word => word.ch) // Collect all Chinese answers
        : words.map(word => word.fr); // Collect all French answers

    // Randomly select three incorrect answers from the pool
    while (choices.length < 4) {
        const randomAnswer = answerPool[Math.floor(Math.random() * answerPool.length)];

        // Ensure no duplicate answers
        if (!choices.includes(randomAnswer)) {
            choices.push(randomAnswer);
        }
    }

    // Shuffle the choices array to randomize the position of the correct answer
    return shuffleArray(choices);
}

function displayChoices(choices) {
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = ''; // Clear previous choices

    // Create buttons for each choice
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.classList.add('choice-button');
        button.addEventListener('click', function () {
            checkAnswer(choice);
        });
        choicesContainer.appendChild(button);
    });

    displayMessage('', ''); // Clear any previous messages
}

function checkAnswer(selectedAnswer) {
    const wordPair = words[currentWordIndex];
    const correctAnswer = document.getElementById('question-text').textContent.includes(wordPair.fr)
        ? wordPair.ch
        : wordPair.fr;

    // Remove accents from both the selected and correct answers before comparing
    const normalizedSelectedAnswer = removeAccents(selectedAnswer.toLowerCase());
    const normalizedCorrectAnswer = removeAccents(correctAnswer.toLowerCase());

    if (normalizedSelectedAnswer === normalizedCorrectAnswer) {
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

    document.getElementById('result-text').textContent = resultText;
    displayMessage('', ''); // Clear any previous messages
}

document.getElementById('restart-game').addEventListener('click', function () {
    document.getElementById('results-section').classList.add('hidden');
    document.querySelector('.input-section').classList.remove('hidden');
});

// Helper function to remove accents from a string
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

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
