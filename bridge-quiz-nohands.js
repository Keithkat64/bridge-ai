class BridgeQuiz {
    constructor() {
        // Add debugging at the start
        console.log('QUIZ: Constructor called');
        console.log('QUIZ: Window quizData:', window.quizData);
        
        // Wait for DOM to be fully loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        try {
            // Show loading overlay first
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.classList.remove('hidden');
            }

            // Initialize quiz data
            this.initializeQuizData();

            // Initialize DOM elements only after confirming they exist
            if (this.initializeElements()) {
                this.attachEventListeners();
                if (loadingOverlay) {
                    loadingOverlay.classList.add('hidden');
                }
            } else {
                throw new Error('Required quiz elements not found');
            }
        } catch (error) {
            console.error('Quiz initialization error:', error);
            this.handleInitializationError();
        }
    }

    initializeQuizData() {
        // Add debugging
        console.log('QUIZ: Initializing quiz data');
        console.log('QUIZ: Available quizData:', window.quizData);
        
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.currentlyShowingAnswer = false;

        if (typeof window.quizData !== 'undefined' && window.quizData.questions) {
            console.log('QUIZ: Found quiz data, loading questions');
            this.questions = window.quizData.questions;
        } else {
            console.error('QUIZ: No quiz data found in window.quizData');
            this.questions = [];
        }
        
        // Log the final questions array
        console.log('QUIZ: Final questions array:', this.questions);
    }

    initializeElements() {
        try {
            // Sections
            this.registrationSection = document.getElementById('registrationSection');
            this.quizSection = document.getElementById('quizSection');
            this.resultsSection = document.getElementById('resultsSection');

            // Check if required sections exist
            if (!this.registrationSection || !this.quizSection || !this.resultsSection) {
                console.error('Required sections not found');
                return false;
            }

            // Forms and inputs
            this.registrationForm = document.getElementById('registrationForm');
            this.firstNameInput = document.getElementById('firstName');
            this.lastNameInput = document.getElementById('lastName');

            // Check if registration elements exist
            if (!this.registrationForm || !this.firstNameInput || !this.lastNameInput) {
                console.error('Registration elements not found');
                return false;
            }

            // Quiz elements
            this.currentHandDisplay = document.getElementById('currentHand');
            this.dealer = document.getElementById('dealer');
            this.biddingSequence = document.getElementById('biddingSequence');
            this.optionsContainer = document.getElementById('optionsContainer');
            this.submitButton = document.getElementById('submitButton');
            this.answerFeedback = document.getElementById('answerFeedback');
            this.fullHandDisplay = document.getElementById('fullHand');
            this.continueButton = document.getElementById('continueButton');
            this.progressBar = document.getElementById('progressBar');

            // Check if quiz elements exist
            if (!this.currentHandDisplay || !this.dealer || !this.biddingSequence || 
                !this.optionsContainer || !this.submitButton || !this.answerFeedback || 
                !this.fullHandDisplay || !this.continueButton || !this.progressBar) {
                console.error('Quiz elements not found');
                return false;
            }

            // Results elements
            this.scoreDisplay = document.getElementById('scoreDisplay');
            this.retryButton = document.getElementById('retryButton');
            this.closeButton = document.getElementById('closeQuiz');

            // Check if results elements exist
            if (!this.scoreDisplay || !this.retryButton || !this.closeButton) {
                console.error('Results elements not found');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error initializing elements:', error);
            return false;
        }
    }

    attachEventListeners() {
        this.registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.startQuiz();
        });

        this.submitButton.addEventListener('click', () => this.handleSubmit());
        this.continueButton.addEventListener('click', () => this.handleContinue());
        this.retryButton.addEventListener('click', () => this.resetQuiz());
        this.closeButton.addEventListener('click', () => this.closeQuiz());
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
        console.log('Displaying question:', this.currentQuestion);
        
        const question = this.questions[this.currentQuestion];
        if (!question) {
            console.error('No question found for index:', this.currentQuestion);
            return;
        }
        
        // Reset the view
        if (this.fullHandDisplay) {
            this.fullHandDisplay.classList.add('hidden');
        }
        if (this.answerFeedback) {
            this.answerFeedback.style.display = 'none';
        }

        // Display the hand
        this.displayBridgeHand(question.hand);
        
        // Display the bidding sequence
        this.displayBiddingSequence(question.bidding);
        
        // Create radio options
        this.createRadioOptions(question.options);
        
        // Update progress
        this.updateProgressBar();
        
        // Reset submit button
        if (this.submitButton) {
            this.submitButton.textContent = 'Submit Answer';
            this.submitButton.disabled = true;
            this.submitButton.style.display = 'block';
        }

        this.currentlyShowingAnswer = false;
    }

    displayBridgeHand(hand) {
        const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
        
        suits.forEach(suit => {
            const cardSpan = this.currentHandDisplay.querySelector(`.suit.${suit} .cards`);
            if (cardSpan) {
                cardSpan.textContent = hand[suit] || '—';
            }
        });
    }

    displayBiddingSequence(bidding) {
        this.dealer.textContent = bidding.dealer;
        this.biddingSequence.innerHTML = '';

        bidding.sequence.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(bid => {
                const td = document.createElement('td');
                td.textContent = bid;
                tr.appendChild(td);
            });
            this.biddingSequence.appendChild(tr);
        });
    }

    createRadioOptions(options) {
        this.optionsContainer.innerHTML = '';

        options.forEach(option => {
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
    }

    handleSubmit() {
        if (this.currentlyShowingAnswer) return;

        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) return;

        const question = this.questions[this.currentQuestion];
        const isCorrect = selectedAnswer.value === question.correct;
        
        // Display feedback
        this.answerFeedback.className = `answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        this.answerFeedback.innerHTML = `
            <h4>${isCorrect ? 'Correct!' : 'Incorrect'}</h4>
            <p>${question.explanation}</p>
        `;
        this.answerFeedback.style.display = 'block';

        // Show full hand
        this.displayFullHand(question.fullHand);
        this.fullHandDisplay.classList.remove('hidden');

        // Hide submit button
        this.submitButton.style.display = 'none';

        // Update score
        if (isCorrect) {
            this.score++;
        }

        this.currentlyShowingAnswer = true;
    }

    displayFullHand(fullHand) {
        const positions = ['north', 'south', 'east', 'west'];
        
        positions.forEach(position => {
            const handContent = this.fullHandDisplay.querySelector(`.${position} .hand-content`);
            if (handContent) {
                handContent.innerHTML = this.formatHandContent(fullHand[position]);
            }
        });

        // Make sure continue button is visible
        if (this.continueButton) {
            this.continueButton.style.display = 'block';
        }
    }

    formatHandContent(hand) {
        const suits = [
            { symbol: '♠', name: 'spades' },
            { symbol: '♥', name: 'hearts' },
            { symbol: '♦', name: 'diamonds' },
            { symbol: '♣', name: 'clubs' }
        ];

        return suits.map(suit => `
            <div class="suit-line">
                <span class="suit-symbol ${suit.name}">${suit.symbol}</span>
                <span class="cards">${hand[suit.name] || '—'}</span>
            </div>
        `).join('');
    }

    handleContinue() {
        console.log('Handling continue, current question:', this.currentQuestion);
        
        // Hide the full hand and feedback
        if (this.fullHandDisplay) {
            this.fullHandDisplay.classList.add('hidden');
        }
        if (this.answerFeedback) {
            this.answerFeedback.style.display = 'none';
        }

        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            console.log('Moving to question:', this.currentQuestion);
            this.displayQuestion();
        } else {
            console.log('Quiz complete, showing results');
            this.showResults();
        }
    }

    updateProgressBar() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
    }

    showResults() {
        this.quizSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');
        
        this.scoreDisplay.textContent = `${this.firstName} ${this.lastName}, you scored ${this.score} out of ${this.questions.length}`;
        
        // Get quiz ID from window.quizData
        const quizId = window.quizData && window.quizData.quizId ? window.quizData.quizId : 'default';
        
        // Save score to localStorage with quiz ID
        const scores = JSON.parse(localStorage.getItem('bridgeQuizScores') || '[]');
        scores.push({
            firstName: this.firstName,
            lastName: this.lastName,
            score: this.score,
            date: new Date().toISOString(),
            quizId: quizId // Add quiz ID to the score
        });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('bridgeQuizScores', JSON.stringify(scores));
        
        // Display leaderboard for this quiz
        this.displayLeaderboard(scores, quizId);
        
        // Save score to server
        this.saveScoreToServer(quizId);
    }

    displayLeaderboard(scores, quizId) {
        const leaderboardBody = document.getElementById('leaderboardBody');
        if (!leaderboardBody) return;

        leaderboardBody.innerHTML = '';
        
        // Filter scores for current quiz
        const filteredScores = scores.filter(score => score.quizId === quizId);
        
        filteredScores.slice(0, 10).forEach((score, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${score.firstName} ${score.lastName}</td>
                <td>${score.score}</td>
                <td>${new Date(score.date).toLocaleDateString()}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    }

    // New method to save scores to the server
    saveScoreToServer(quizId) {
        // Check if AJAX variables are available
        if (!window.quizAjax || !window.quizAjax.ajaxurl || !window.quizAjax.nonce) {
            console.error('AJAX variables not found. Score not saved to server.');
            return;
        }
        
        const data = new FormData();
        data.append('action', 'save_quiz_score');
        data.append('security', window.quizAjax.nonce);
        data.append('quiz_id', quizId);
        data.append('user_name', `${this.firstName} ${this.lastName}`);
        data.append('score', this.score);
        
        fetch(window.quizAjax.ajaxurl, {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(data => {
            console.log('Score saved to server:', data);
        })
        .catch(error => {
            console.error('Error saving score to server:', error);
        });
    }

    resetQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.currentlyShowingAnswer = false;
        
        this.firstNameInput.value = '';
        this.lastNameInput.value = '';
        
        this.resultsSection.classList.add('hidden');
        this.registrationSection.classList.remove('hidden');
    }

    closeQuiz() {
        if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
            window.close();
            // Fallback if window.close() doesn't work
            document.body.innerHTML = '<h1>Quiz Closed</h1><p>You can close this tab now.</p>';
        }
    }

    handleInitializationError() {
        // Hide loading overlay if it exists
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }

        // Show error message to user
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <h2>Quiz Initialization Error</h2>
            <p>Sorry, there was a problem loading the quiz. Please try refreshing the page.</p>
            <button onclick="location.reload()">Refresh Page</button>
        `;

        // Try to insert error message in a visible location
        const quizContainer = document.querySelector('.quiz-container') || document.body;
        quizContainer.innerHTML = '';
        quizContainer.appendChild(errorMessage);
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing quiz');
        window.quiz = new BridgeQuiz();
    } catch (error) {
        console.error('Error creating quiz instance:', error);
        // Show error message if initialization fails
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <h2>Quiz Error</h2>
            <p>Failed to start the quiz. Please refresh the page.</p>
            <button onclick="location.reload()">Refresh Page</button>
        `;
        document.body.appendChild(errorMessage);
    }
});

<script>

    :root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --success-color: #27ae60;
    --warning-color: #f39c12;
    --error-color: #e74c3c;
    --background-color: #ecf0f1;
    --text-color: #2c3e50;
}
</script>