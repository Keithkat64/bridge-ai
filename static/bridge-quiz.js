class BridgeQuiz {
    constructor() {
        this.questions = [
            {
                hand: {
                    spades: "AJT432",
                    hearts: "82",
                    diamonds: "",
                    clubs: "J9654"
                },
                bidding: {
                    dealer: "North",
                    sequence: [
                        ["", "Pass", "1♦", "1NT"],
                        ["2♦", "?", "", ""]
                    ]
                },
                options: [
                    { id: "a", text: "2H" },
                    { id: "b", text: "2S" },
                    { id: "c", text: "4S" }
                ],
                correct: "c",
                explanation: "North bids c) 4S. Partner has shown a balanced 16-18 (or 15-17)...you have a fit...so ADD in your shortage points. Your hand is worth 12 tp, so bid game.",
                fullHand: {
                    north: {
                        spades: "AJT432",
                        hearts: "82",
                        diamonds: "",
                        clubs: "J9654"
                    },
                    south: {
                        spades: "K973",
                        hearts: "AQ3",
                        diamonds: "AT82",
                        clubs: "K8"
                    },
                    east: {
                        spades: "Q5",
                        hearts: "KJ975",
                        diamonds: "K",
                        clubs: "AQT32"
                    },
                    west: {
                        spades: "86",
                        hearts: "T64",
                        diamonds: "QJ9765",
                        clubs: "97"
                    }
                }
            }
            // Add other questions here following the same structure
        ];
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.currentlyShowingAnswer = false;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Sections
        this.registrationSection = document.getElementById('registrationSection');
        this.quizSection = document.getElementById('quizSection');
        this.resultsSection = document.getElementById('resultsSection');

        // Forms and inputs
        this.registrationForm = document.getElementById('registrationForm');
        this.firstNameInput = document.getElementById('firstName');
        this.lastNameInput = document.getElementById('lastName');

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

        // Results elements
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.retryButton = document.getElementById('retryButton');
        this.closeButton = document.getElementById('closeQuiz');
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
        const question = this.questions[this.currentQuestion];
        
        // Display the hand
        this.displayBridgeHand(question.hand);
        
        // Display the bidding sequence
        this.displayBiddingSequence(question.bidding);
        
        // Create radio options
        this.createRadioOptions(question.options);
        
        // Reset displays
        this.answerFeedback.style.display = 'none';
        this.fullHandDisplay.classList.add('hidden');
        
        // Update progress
        this.updateProgressBar();
        
        // Update button
        this.submitButton.textContent = 'Submit Answer';
        this.submitButton.disabled = true;
        this.currentlyShowingAnswer = false;
    }

    displayBridgeHand(hand) {
        const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
        
        suits.forEach(suit => {
            const cardSpan = this.currentHandDisplay.querySelector(`.suit.${suit} .cards`);
            cardSpan.textContent = hand[suit] || '—';
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

        // Update score
        if (isCorrect) {
            this.score++;
        }

        this.currentlyShowingAnswer = true;
        this.submitButton.disabled = true;
    }

    displayFullHand(fullHand) {
        const positions = ['north', 'south', 'east', 'west'];
        
        positions.forEach(position => {
            const handContent = this.fullHandDisplay.querySelector(`.${position} .hand-content`);
            handContent.innerHTML = this.formatHandContent(fullHand[position]);
        });
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
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    updateProgressBar() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    async showResults() {
        this.quizSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');
        
        this.scoreDisplay.textContent = `${this.firstName} ${this.lastName}, you scored ${this.score} out of ${this.questions.length}`;
        
        // Save score to leaderboard
        await window.leaderboard.addScore({
            firstName: this.firstName,
            lastName: this.lastName,
            score: this.score,
            date: new Date()
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
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quiz = new BridgeQuiz();
});
