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
            // Add other questions following the same structure
        ];
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.currentlyShowingAnswer = false;
        this.initializeElements();
        this.attachEventListeners();
        this.addStyles();
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
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.nextButton = document.getElementById('nextButton');
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

        this.nextButton.addEventListener('click', () => this.handleNextButton());
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
        
        // Reset answer feedback and full hand
        document.getElementById('answerFeedback').style.display = 'none';
        document.getElementById('fullHand').style.display = 'none';
        
        // Update progress
        this.updateProgressBar();
        
        // Update next button
        this.nextButton.textContent = 'Submit Answer';
        this.nextButton.disabled = true;
        this.currentlyShowingAnswer = false;
    }

    displayBridgeHand(hand) {
        const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
        const symbols = {
            spades: '♠',
            hearts: '♥',
            diamonds: '♦',
            clubs: '♣'
        };

        suits.forEach(suit => {
            const cardSpan = document.querySelector(`.suit.${suit} .cards`);
            cardSpan.textContent = hand[suit] || '—';
        });
    }

    displayBiddingSequence(bidding) {
        const biddingTable = document.getElementById('biddingSequence');
        const dealer = document.getElementById('dealer');
        
        // Set dealer
        dealer.textContent = bidding.dealer;

        // Clear existing bidding
        biddingTable.innerHTML = '';

        // Add bidding rows
        bidding.sequence.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(bid => {
                const td = document.createElement('td');
                td.textContent = bid;
                tr.appendChild(td);
            });
            biddingTable.appendChild(tr);
        });
    }

    createRadioOptions(options) {
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';

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
            label.textContent = `${option.text}`;

            div.appendChild(input);
            div.appendChild(label);
            container.appendChild(div);

            input.addEventListener('change', () => {
                this.nextButton.disabled = false;
            });
        });
    }

    displayFullHand(fullHand) {
        const fullHandDiv = document.getElementById('fullHand');
        fullHandDiv.innerHTML = `
            <h3>Full Hand:</h3>
            <div class="all-hands">
                <div class="hand north">
                    <h4>North</h4>
                    ${this.formatHand(fullHand.north)}
                </div>
                <div class="hand-row">
                    <div class="hand west">
                        <h4>West</h4>
                        ${this.formatHand(fullHand.west)}
                    </div>
                    <div class="hand east">
                        <h4>East</h4>
                        ${this.formatHand(fullHand.east)}
                    </div>
                </div>
                <div class="hand south">
                    <h4>South</h4>
                    ${this.formatHand(fullHand.south)}
                </div>
            </div>
        `;
        fullHandDiv.style.display = 'block';
    }

    formatHand(hand) {
        return `
            <div class="suit spades">♠ ${hand.spades || '—'}</div>
            <div class="suit hearts">♥ ${hand.hearts || '—'}</div>
            <div class="suit diamonds">♦ ${hand.diamonds || '—'}</div>
            <div class="suit clubs">♣ ${hand.clubs || '—'}</div>
        `;
    }

    handleNextButton() {
        if (!this.currentlyShowingAnswer) {
            // Handle answer submission
            this.checkAnswer();
        } else {
            // Move to next question
            if (this.currentQuestion < this.questions.length - 1) {
                this.currentQuestion++;
                this.displayQuestion();
            } else {
                this.showResults();
            }
        }
    }

    checkAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) return;

        const question = this.questions[this.currentQuestion];
        const isCorrect = selectedAnswer.value === question.correct;
        
        // Display feedback
        const feedbackDiv = document.getElementById('answerFeedback');
        feedbackDiv.className = `answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackDiv.innerHTML = `
            <h4>${isCorrect ? 'Correct!' : 'Incorrect'}</h4>
            <p>${question.explanation}</p>
        `;
        feedbackDiv.style.display = 'block';

        // Show full hand
        this.displayFullHand(question.fullHand);

        // Update button and tracking
        this.nextButton.textContent = this.currentQuestion < this.questions.length - 1 ? 'Next Question' : 'Show Results';
        this.currentlyShowingAnswer = true;

        // Update score
        if (isCorrect) {
            this.score++;
        }
    }

    updateProgressBar() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    async showResults() {
        this.quizSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');
        
        const finalScore = this.score;
        this.scoreDisplay.textContent = `${this.firstName} ${this.lastName}, you scored ${finalScore} out of ${this.questions.length}`;
        
        // Save score to leaderboard
        await window.leaderboard.addScore({
            firstName: this.firstName,
            lastName: this.lastName,
            score: finalScore,
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

    addStyles() {
        const styles = `
            .all-hands {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                margin-top: 20px;
            }

            .hand {
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .hand h4 {
                margin: 0 0 10px 0;
                text-align: center;
            }

            .hand-row {
                display: flex;
                gap: 40px;
                width: 100%;
                justify-content: center;
            }

            .suit.spades, .suit.clubs {
                color: black;
            }

            .suit.hearts, .suit.diamonds {
                color: red;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quiz = new BridgeQuiz();
});
