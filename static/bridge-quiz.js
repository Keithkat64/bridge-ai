class BridgeQuiz {
    constructor() {
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
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = [];
    this.currentlyShowingAnswer = false;

    this.questions = [
        // Question 1
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
                { id: "a", text: "2♥" },
                { id: "b", text: "2♠" },
                { id: "c", text: "4♠" }
            ],
            correct: "c",
            explanation: "North bids 4♠. Partner has shown a balanced 16-18 (or 15-17)...you have a fit...so ADD in your shortage points. Your hand is worth 12 tp, so bid game.",
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
        },
        // Question 2
        {
            hand: {
                spades: "AJT8",
                hearts: "QT832",
                diamonds: "853",
                clubs: "Q"
            },
            bidding: {
                dealer: "East",
                sequence: [
                    ["", "", "1♣", "Pass"],
                    ["1♥", "Pass", "?", ""]
                ]
            },
            options: [
                { id: "a", text: "2♥" },
                { id: "b", text: "3♥" },
                { id: "c", text: "4♥" }
            ],
            correct: "b",
            explanation: "West bids 3♥. ADD in your shortage points when you have 4 or 5 card support for partner's five card suit. Your hand is worth 10tp, so bid 3♥ to show 10-12",
            fullHand: {
                north: {
                    spades: "543",
                    hearts: "K4",
                    diamonds: "96",
                    clubs: "AKJ652"
                },
                south: {
                    spades: "Q762",
                    hearts: "KJT42",
                    diamonds: "T743",
                    clubs: "98"
                },
                east: {
                    spades: "K9",
                    hearts: "AJ976",
                    diamonds: "AQ7",
                    clubs: "T74"
                },
                west: {
                    spades: "AJT8",
                    hearts: "QT832",
                    diamonds: "853",
                    clubs: "Q"
                }
            }
        },
        // Question 3
        {
            hand: {
                spades: "QJT9874",
                hearts: "9",
                diamonds: "Q",
                clubs: "J432"
            },
            bidding: {
                dealer: "North",
                sequence: [
                    ["", "2♠", "?", ""]
                ]
            },
            options: [
                { id: "a", text: "Pass" },
                { id: "b", text: "4♠" }
            ],
            correct: "a",
            explanation: "South bids Pass. Your hand only revalues to 13 tp, so there is no chance for game. You cannot double dip on the singleton king.",
            fullHand: {
                north: {
                    spades: "AK6542",
                    hearts: "K8",
                    diamonds: "AKQT9",
                    clubs: ""
                },
                south: {
                    spades: "QJT9874",
                    hearts: "9",
                    diamonds: "Q",
                    clubs: "J432"
                },
                east: {
                    spades: "3",
                    hearts: "QJ7",
                    diamonds: "J6543",
                    clubs: "K532"
                },
                west: {
                    spades: "",
                    hearts: "AT9732",
                    diamonds: "872",
                    clubs: "AQT98"
                }
            }
        },
        // Question 4
        {
            hand: {
                spades: "AQ6",
                hearts: "75",
                diamonds: "AJ62",
                clubs: "K973"
            },
            bidding: {
                dealer: "West",
                sequence: [
                    ["1♣", "Pass", "1♠", "1♥"],
                    ["?", "", "", ""]
                ]
            },
            options: [
                { id: "a", text: "Pass" },
                { id: "b", text: "1NT" },
                { id: "c", text: "2♦" }
            ],
            correct: "b",
            explanation: "West bids 1NT. Show a balanced hand with 12-15 hcp and a stopper in hearts.",
            fullHand: {
                north: {
                    spades: "54",
                    hearts: "T8632",
                    diamonds: "87",
                    clubs: "T862"
                },
                south: {
                    spades: "872",
                    hearts: "AJ",
                    diamonds: "AQJ",
                    clubs: "QT943"
                },
                east: {
                    spades: "KJ93",
                    hearts: "KQ94",
                    diamonds: "KQ94",
                    clubs: "5"
                },
                west: {
                    spades: "AQ6",
                    hearts: "75",
                    diamonds: "AJ62",
                    clubs: "K973"
                }
            }
        },
        // Question 5
        {
            hand: {
                spades: "Q832",
                hearts: "AK8",
                diamonds: "6",
                clubs: "AK976"
            },
            bidding: {
                dealer: "East",
                sequence: [
                    ["", "", "1NT", "Pass"],
                    ["Pass", "2♣", "Pass", "2♥"],
                    ["Pass", "?", "", ""]
                ]
            },
            options: [
                { id: "a", text: "Pass" },
                { id: "b", text: "2♠" },
                { id: "c", text: "3♠" }
            ],
            correct: "c",
            explanation: "East bids either 3♠ (best) or 2♠. You have to try and get in the way of their bidding so that they find it harder to reach slam.",
            fullHand: {
                north: {
                    spades: "J76",
                    hearts: "543",
                    diamonds: "KJT4",
                    clubs: "J95"
                },
                south: {
                    spades: "94",
                    hearts: "Q82",
                    diamonds: "9862",
                    clubs: "T432"
                },
                east: {
                    spades: "AKT5",
                    hearts: "JT",
                    diamonds: "AQ73",
                    clubs: "Q76"
                },
                west: {
                    spades: "Q832",
                    hearts: "AK8",
                    diamonds: "6",
                    clubs: "AK976"
                }
            }
        },
        // Question 6
        {
            hand: {
                spades: "AQJ54",
                hearts: "KT3",
                diamonds: "K32",
                clubs: "AT"
            },
            bidding: {
                dealer: "West",
                sequence: [
                    ["1♠", "Pass", "2♠", "Pass"],
                    ["?", "", "", ""]
                ]
            },
            options: [
                { id: "a", text: "2NT" },
                { id: "b", text: "3♦" },
                { id: "c", text: "3NT" }
            ],
            correct: "b",
            explanation: "West bids 3♦. You want to tell partner that you hold 4 spades without giving up on 6NT if partner cannot fit your spades or diamonds. Bidding 3NT runs the risk of partner passing when they don't hold 4 spades.",
            fullHand: {
                north: {
                    spades: "93",
                    hearts: "QJ",
                    diamonds: "A9765",
                    clubs: "K985"
                },
                south: {
                    spades: "T872",
                    hearts: "A84",
                    diamonds: "J4",
                    clubs: "7432"
                },
                east: {
                    spades: "K6",
                    hearts: "97652",
                    diamonds: "QT8",
                    clubs: "QJ6"
                },
                west: {
                    spades: "AQJ54",
                    hearts: "KT3",
                    diamonds: "K32",
                    clubs: "AT"
                }
            }
        },
        // Question 7
        {
            hand: {
                spades: "AT64",
                hearts: "AJ97",
                diamonds: "T84",
                clubs: "A3"
            },
            bidding: {
                dealer: "West",
                sequence: [
                    ["1♣", "Pass", "1♥", "Pass"],
                    ["1♠", "Pass", "?", ""]
                ]
            },
            options: [
                { id: "a", text: "Pass" },
                { id: "b", text: "3♦" },
                { id: "c", text: "4♥" }
            ],
            correct: "a",
            explanation: "West bids Pass. Partner has shown preference for hearts, but they have already denied three. There is no game, so stop bidding.",
            fullHand: {
                north: {
                    spades: "KJ52",
                    hearts: "QT4",
                    diamonds: "Q2",
                    clubs: "KQJ6"
                },
                south: {
                    spades: "Q3",
                    hearts: "K8652",
                    diamonds: "K973",
                    clubs: "T4"
                },
                east: {
                    spades: "987",
                    hearts: "3",
                    diamonds: "AJ65",
                    clubs: "98752"
                },
                west: {
                    spades: "AT64",
                    hearts: "AJ97",
                    diamonds: "T84",
                    clubs: "A3"
                }
            }
        },
        // Question 8
        {
            hand: {
                spades: "JT9873",
                hearts: "K",
                diamonds: "J2",
                clubs: "J432"
            },
            bidding: {
                dealer: "North",
                sequence: [
                    ["1NT", "Pass", "2♥", "Pass"],
                    ["2♠", "Pass", "?", ""]
                ]
            },
            options: [
                { id: "a", text: "Pass" },
                { id: "b", text: "3♠" },
                { id: "c", text: "4♠" }
            ],
            correct: "a",
            explanation: "North bids Pass. Yes, you have a fit, but your hand is only worth 7 tp, so game is highly unlikely to make.",
            fullHand: {
                north: {
                    spades: "65",
                    hearts: "QT4",
                    diamonds: "QT4",
                    clubs: "AQ876"
                },
                south: {
                    spades: "JT9873",
                    hearts: "K",
                    diamonds: "J2",
                    clubs: "J432"
                },
                east: {
                    spades: "A8753",
                    hearts: "K853",
                    diamonds: "T5",
                    clubs: "42"
                },
                west: {
                    spades: "KQ",
                    hearts: "AJ962",
                    diamonds: "A976",
                    clubs: "K9"
                }
            }
        },
        // Question 9
        {
            hand: {
                spades: "53",
                hearts: "KQ942",
                diamonds: "AK987",
                clubs: "A"
            },
            bidding: {
                dealer: "South",
                sequence: [
                    ["", "", "", "1♠"],
                    ["Pass", "1NT", "Pass", "2♣"],
                    ["Pass", "2♥", "Pass", "?"]
                ]
            },
            options: [
                { id: "a", text: "Pass" },
                { id: "b", text: "3♠" },
                { id: "c", text: "4♠" }
            ],
            correct: "a",
            explanation: "South bids Pass. Your hand only revalues to 13 tp, so there is no chance for game. You cannot double dip on the singleton ace.",
            fullHand: {
                north: {
                    spades: "Q962",
                    hearts: "865",
                    diamonds: "JT4",
                    clubs: "KQ8"
                },
                south: {
                    spades: "53",
                    hearts: "KQ942",
                    diamonds: "AK987",
                    clubs: "A"
                },
                east: {
                    spades: "AJ74",
                    hearts: "J7",
                    diamonds: "53",
                    clubs: "97654"
                },
                west: {
                    spades: "KT8",
                    hearts: "AT3",
                    diamonds: "Q62",
                    clubs: "JT32"
                }
            }
        },
        // Question 10
        {
            hand: {
                spades: "A962",
                hearts: "AJT",
                diamonds: "A853",
                clubs: "76"
            },
            bidding: {
                dealer: "East",
                sequence: [
                    ["", "", "Pass", "1♣"],
                    ["Dbl", "1♥", "2♣", "Pass"],
                    ["?", "", "", ""]
                ]
            },
            options: [
                { id: "a", text: "Pass" },
                { id: "b", text: "2NT" },
                { id: "c", text: "3NT" }
            ],
            correct: "c",
            explanation: "West bids 3NT. West jumps to game to show 16-18 hcp with a balanced hand.",
            fullHand: {
                north: {
                    spades: "QJ5",
                    hearts: "J9",
                    diamonds: "K9764",
                    clubs: "J93"
                },
                south: {
                    spades: "K",
                    hearts: "Q32",
                    diamonds: "T74",
                    clubs: "AKT842"
                },
                east: {
                    spades: "T8743",
                    hearts: "85",
                    diamonds: "Q5",
                    clubs: "KQ62"
                },
                west: {
                    spades: "A962",
                    hearts: "AJT",
                    diamonds: "A853",
                    clubs: "76"
                }
            }
        },
        // Question 11
        {
            hand: {
                spades: "AK93",
                hearts: "Q654",
                diamonds: "AJT86",
                clubs: ""
            },
            bidding: {
                dealer: "South",
                sequence: [
                    ["Pass", "1♣", "Pass", "1♥"],
                    ["Pass", "?", "", ""]
                ]
            },
            options: [
                { id: "a", text: "2♥" },
                { id: "b", text: "3♥" },
                { id: "c", text: "4♥" }
            ],
            correct: "c",
            explanation: "North bids 4♥. With the heart fit your hand revalues to 19 tp, so bid game!",
            fullHand: {
                north: {
                    spades: "AK93",
                    hearts: "Q654",
                    diamonds: "AJT86",
                    clubs: ""
                },
                south: {
                    spades: "4",
                    hearts: "A87",
                    diamonds: "QT752",
                    clubs: "JT75"
                },
                east: {
                    spades: "4",
                    hearts: "953",
                    diamonds: "KJT92",
                    clubs: "AQ84"
                },
                west: {
                    spades: "3",
                    hearts: "J86",
                    diamonds: "KQ72",
                    clubs: "K9632"
                }
            }
        },
        // Question 12
        {
            hand: {
                spades: "K",
                hearts: "K9",
                diamonds: "J9754",
                clubs: "KQT64"
            },
            bidding: {
                dealer: "South",
                sequence: [
                    ["Pass", "3♥", "Pass", "?"]
                ]
            },
            options: [
                { id: "a", text: "Pass" },
                { id: "b", text: "3♠" },
                { id: "c", text: "4♥" }
            ],
            correct: "a",
            explanation: "West bids Pass. You have a definite fit, so add in your shortage points. Your hand is now worth 14 tp, but this is not enough for game when partner's range is 8-11.",
            fullHand: {
                north: {
                    spades: "AQ8",
                    hearts: "J",
                    diamonds: "87432",
                    clubs: "QT32"
                },
                south: {
                    spades: "K",
                    hearts: "K9",
                    diamonds: "J9754",
                    clubs: "KQT64"
                },
                east: {
                    spades: "J654",
                    hearts: "T32",
                    diamonds: "QT96",
                    clubs: "A92"
                },
                west: {
                    spades: "K6",
                    hearts: "AJ5",
                    diamonds: "8753",
                    clubs: "A87"
                }
            }
        }
    ];
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

        // Make sure continue button is visible and properly connected
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
        
        // Save score to localStorage
        const scores = JSON.parse(localStorage.getItem('bridgeQuizScores') || '[]');
        scores.push({
            firstName: this.firstName,
            lastName: this.lastName,
            score: this.score,
            date: new Date().toISOString()
        });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('bridgeQuizScores', JSON.stringify(scores));
        
        // Display leaderboard
        this.displayLeaderboard(scores);
    }

    displayLeaderboard(scores) {
        const leaderboardBody = document.getElementById('leaderboardBody');
        if (!leaderboardBody) return;

        leaderboardBody.innerHTML = '';
        
        scores.slice(0, 10).forEach((score, index) => {
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
