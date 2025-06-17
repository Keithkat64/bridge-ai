/**
 * Bridge Quiz JavaScript
 * Simple version with no leaderboard functionality
 */
class BridgeQuiz {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        try {
            this.initializeQuizData();
            this.initializeElements();
            this.attachEventListeners();
        } catch (error) {
            console.error('Quiz initialization error:', error);
            this.handleInitializationError();
        }
    }

    initializeQuizData() {
        this.currentQuestion = 0;
        this.score = 0;
        this.currentlyShowingAnswer = false;

        // Get quiz data from hidden input
        const quizDataElement = document.getElementById('quiz-data');
        
        // Add debugging code
        if (!quizDataElement) {
            console.error('Quiz data element not found!');
        } else {
            console.log('Quiz data element found:', quizDataElement);
        }

        if (!quizDataElement) {
            throw new Error('Quiz data element not found');
        }
        
        this.questions = JSON.parse(quizDataElement.value);
        if (!this.questions || this.questions.length === 0) {
            throw new Error('No questions loaded');
        }
        
        // Get quiz ID
        const quizIdElement = document.getElementById('quiz-id');
        this.quizId = quizIdElement ? parseInt(quizIdElement.value) : 0;
    }

        this.currentQuestion = 0;
        this.score = 0;
        this.currentlyShowingAnswer = false;

        // Get quiz data from hidden input
        const quizDataElement = document.getElementById('quiz-data');
        if (!quizDataElement) {
            throw new Error('Quiz data element not found');
        }
        
        this.questions = JSON.parse(quizDataElement.value);
        if (!this.questions || this.questions.length === 0) {
            throw new Error('No questions loaded');
        }
        
        // Get quiz ID
        const quizIdElement = document.getElementById('quiz-id');
        this.quizId = quizIdElement ? parseInt(quizIdElement.value) : 0;
    }

    initializeElements() {
        // Registration elements
        this.registrationSection = document.getElementById('registrationSection');
        this.registrationForm = document.getElementById('registrationForm');
        this.firstNameInput = document.getElementById('firstName');
        this.lastNameInput = document.getElementById('lastName');
        
        // Quiz elements
        this.quizSection = document.getElementById('quizSection');
        this.currentQuestionElement = document.getElementById('current-question');
        this.totalQuestionsElement = document.getElementById('total-questions');
        this.progressBar = document.getElementById('progress-bar');
        this.southSpades = document.getElementById('south-spades');
        this.southHearts = document.getElementById('south-hearts');
        this.southDiamonds = document.getElementById('south-diamonds');
        this.southClubs = document.getElementById('south-clubs');
        this.dealer = document.getElementById('dealer');
        this.biddingSequence = document.getElementById('biddingSequence');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.submitButton = document.getElementById('submitButton');
        this.answerFeedback = document.getElementById('answerFeedback');
        this.fullHand = document.getElementById('fullHand');
        this.continueButton = document.getElementById('continueButton');
        
        // Results elements
        this.resultsSection = document.getElementById('resultsSection');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.percentageDisplay = document.getElementById('percentageDisplay');
        this.retryButton = document.getElementById('retryButton');
        this.closeButton = document.getElementById('closeQuiz');
        
        // Set total questions
        if (this.totalQuestionsElement) {
            this.totalQuestionsElement.textContent = this.questions.length;
        }
    }

    attachEventListeners() {
        // Registration form submission
        if (this.registrationForm) {
            this.registrationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.startQuiz();
            });
        }
        
        // Quiz buttons
        if (this.submitButton) {
            this.submitButton.addEventListener('click', () => this.handleSubmit());
        }
        
        if (this.continueButton) {
            this.continueButton.addEventListener('click', () => this.handleContinue());
        }
        
        // Results buttons
        if (this.retryButton) {
            this.retryButton.addEventListener('click', () => this.resetQuiz());
        }
        
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.closeQuiz());
        }
    }

    startQuiz() {
        this.firstName = this.firstNameInput.value.trim();
        this.lastName = this.lastNameInput.value.trim();

        if (!this.firstName || !this.lastName) {
            alert('Please enter both first and last name');
            return;
        }

        this.registrationSection.classList.add('hidden');
        this.quizSection.classList.remove('hidden');
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        if (!question) return;

        // Hide answer feedback and full hand
        this.answerFeedback.style.display = 'none';
        this.fullHand.classList.add('hidden');

        // Update question number and progress bar
        this.currentQuestionElement.textContent = this.currentQuestion + 1;
        this.progressBar.style.width = `${((this.currentQuestion + 1) / this.questions.length) * 100}%`;

        // Display South hand
        this.southSpades.textContent = question.hand.spades;
        this.southHearts.textContent = question.hand.hearts;
        this.southDiamonds.textContent = question.hand.diamonds;
        this.southClubs.textContent = question.hand.clubs;

        // Display dealer and bidding
        this.dealer.textContent = question.bidding.dealer;
        this.biddingSequence.innerHTML = '';
        
        question.bidding.sequence.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(bid => {
                const td = document.createElement('td');
                td.textContent = bid;
                tr.appendChild(td);
            });
            this.biddingSequence.appendChild(tr);
        });

        // Create radio options
        this.optionsContainer.innerHTML = '';
        question.options.forEach(option => {
            const div = document.createElement('div');
            div.className = 'radio-option';

            const input = document.createElement('input');
            input.type = 'radio';
            input.id = `option${option.id}`;
            input.name = 'answer';
            input.value = option.id;

            const label = document.createElement('label');
            label.htmlFor = `option${option.id}`;
            label.textContent = option.text;

            div.appendChild(input);
            div.appendChild(label);
            this.optionsContainer.appendChild(div);

            input.addEventListener('change', () => {
                this.submitButton.disabled = false;
            });
        });

        // Enable submit button
        this.submitButton.textContent = 'Submit Answer';
        this.submitButton.disabled = true;
        this.submitButton.style.display = 'block';

        this.currentlyShowingAnswer = false;
    }

    handleSubmit() {
        if (this.currentlyShowingAnswer) return;
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) return;

        const question = this.questions[this.currentQuestion];
        const isCorrect = selected.value === question.correct;

        // Show answer feedback
        this.answerFeedback.className = `answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        this.answerFeedback.innerHTML = `<h4>${isCorrect ? 'Correct!' : 'Incorrect'}</h4><p>${question.explanation}</p>`;
        this.answerFeedback.style.display = 'block';

        // Display full hand
        this.displayFullHand(question.fullHand);
        this.fullHand.classList.remove('hidden');

        // Hide submit button and show continue button
        this.submitButton.style.display = 'none';
        this.continueButton.style.display = 'block';
        
        if (isCorrect) this.score++;
        this.currentlyShowingAnswer = true;
    }

    displayFullHand(fullHand) {
        // Display all hands
        ['north', 'south', 'east', 'west'].forEach(pos => {
            const handDiv = this.fullHand.querySelector(`.${pos} .hand-content`);
            if (handDiv) {
                handDiv.innerHTML = this.formatHandContent(fullHand[pos]);
            }
        });
    }

    formatHandContent(hand) {
        // Format hand content with suit symbols
        return ['spades', 'hearts', 'diamonds', 'clubs'].map(suit => `
            <div class="suit-line">
                <span class="suit-symbol ${suit}">${{ spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' }[suit]}</span>
                <span class="cards">${hand[suit] || '—'}</span>
            </div>`).join('');
    }

    handleContinue() {
        this.fullHand.classList.add('hidden');
        this.answerFeedback.style.display = 'none';

        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
    // Hide quiz section and show results section
    this.quizSection.classList.add('hidden');
    this.resultsSection.classList.add('hidden'); // Hide the results section

    // Calculate percentage
    const percentage = (this.score / this.questions.length) * 100;
    
    // Display congratulatory message
    alert(`Congratulations ${this.firstName} ${this.lastName}, you scored ${this.score} out of ${this.questions.length}. Your score is ${percentage.toFixed(0)}%`);
}

    resetQuiz() {
        // Reset quiz state
        this.currentQuestion = 0;
        this.score = 0;
        this.currentlyShowingAnswer = false;

        // Reset input fields
        this.firstNameInput.value = '';
        this.lastNameInput.value = '';

        // Show registration and hide results
        this.resultsSection.classList.add('hidden');
        this.registrationSection.classList.remove('hidden');
    }

    closeQuiz() {
        // Close the quiz window
        if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
            window.close();
            document.body.innerHTML = '<h1>Quiz Closed</h1><p>You can close this tab now.</p>';
        }
    }

    handleInitializationError() {
        // Handle initialization errors
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.add('hidden');

        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.innerHTML = `<h2>Quiz Initialization Error</h2><p>Could not load quiz. Try refreshing the page.</p><button onclick="location.reload()">Refresh</button>`;
        const container = document.querySelector('.quiz-container') || document.body;
        container.innerHTML = '';
        container.appendChild(errorMsg);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.quiz = new BridgeQuiz();
    } catch (e) {
        console.error('Quiz failed to load:', e);
        document.body.innerHTML = '<h2>Error loading quiz</h2>';
    }
});
