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
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) loadingOverlay.classList.remove('hidden');

            this.initializeQuizData();

            if (this.initializeElements()) {
                this.attachEventListeners();
                if (loadingOverlay) loadingOverlay.classList.add('hidden');
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

        this.questions = window.bridgeQuizData || [];
        if (this.questions.length === 0) {
            throw new Error('No questions loaded. Please check the quiz data file.');
        }
    }

    initializeElements() {
        try {
            this.registrationSection = document.getElementById('registrationSection');
            this.quizSection = document.getElementById('quizSection');
            this.resultsSection = document.getElementById('resultsSection');
            this.registrationForm = document.getElementById('registrationForm');
            this.firstNameInput = document.getElementById('firstName');
            this.lastNameInput = document.getElementById('lastName');
            this.currentHandDisplay = document.getElementById('currentHand');
            this.dealer = document.getElementById('dealer');
            this.biddingSequence = document.getElementById('biddingSequence');
            this.optionsContainer = document.getElementById('optionsContainer');
            this.submitButton = document.getElementById('submitButton');
            this.answerFeedback = document.getElementById('answerFeedback');
            this.fullHandDisplay = document.getElementById('fullHand');
            this.continueButton = document.getElementById('continueButton');
            this.progressBar = document.getElementById('progressBar');
            this.scoreDisplay = document.getElementById('scoreDisplay');
            this.retryButton = document.getElementById('retryButton');
            this.closeButton = document.getElementById('closeQuiz');

            return [
                this.registrationSection,
                this.quizSection,
                this.resultsSection,
                this.registrationForm,
                this.firstNameInput,
                this.lastNameInput,
                this.currentHandDisplay,
                this.dealer,
                this.biddingSequence,
                this.optionsContainer,
                this.submitButton,
                this.answerFeedback,
                this.fullHandDisplay,
                this.continueButton,
                this.progressBar,
                this.scoreDisplay,
                this.retryButton,
                this.closeButton
            ].every(Boolean);
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
        const question = this.questions[this.currentQuestion];
        if (!question) return;

        this.fullHandDisplay.classList.add('hidden');
        this.answerFeedback.style.display = 'none';

        this.displayBridgeHand(question.hand);
        this.displayBiddingSequence(question.bidding);
        this.createRadioOptions(question.options);
        this.updateProgressBar();

        this.submitButton.textContent = 'Submit Answer';
        this.submitButton.disabled = true;
        this.submitButton.style.display = 'block';

        this.currentlyShowingAnswer = false;
    }

    displayBridgeHand(hand) {
        ['spades', 'hearts', 'diamonds', 'clubs'].forEach(suit => {
            const el = this.currentHandDisplay.querySelector(`.suit.${suit} .cards`);
            if (el) el.textContent = hand[suit] || '—';
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
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) return;

        const question = this.questions[this.currentQuestion];
        const isCorrect = selected.value === question.correct;

        this.answerFeedback.className = `answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        this.answerFeedback.innerHTML = `<h4>${isCorrect ? 'Correct!' : 'Incorrect'}</h4><p>${question.explanation}</p>`;
        this.answerFeedback.style.display = 'block';

        this.displayFullHand(question.fullHand);
        this.fullHandDisplay.classList.remove('hidden');

        this.submitButton.style.display = 'none';
        if (isCorrect) this.score++;
        this.currentlyShowingAnswer = true;
    }

    displayFullHand(fullHand) {
        ['north', 'south', 'east', 'west'].forEach(pos => {
            const handDiv = this.fullHandDisplay.querySelector(`.${pos} .hand-content`);
            if (handDiv) {
                handDiv.innerHTML = this.formatHandContent(fullHand[pos]);
            }
        });

        this.continueButton.style.display = 'block';
    }

    formatHandContent(hand) {
        return ['spades', 'hearts', 'diamonds', 'clubs'].map(suit => `
            <div class="suit-line">
                <span class="suit-symbol ${suit}">${{ spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' }[suit]}</span>
                <span class="cards">${hand[suit] || '—'}</span>
            </div>`).join('');
    }

    handleContinue() {
        this.fullHandDisplay.classList.add('hidden');
        this.answerFeedback.style.display = 'none';

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

    showResults() {
        this.quizSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');

        this.scoreDisplay.textContent = `${this.firstName} ${this.lastName}, you scored ${this.score} out of ${this.questions.length}`;

        // MODIFIED: Submit score to WordPress instead of localStorage
        this.submitScoreToWordPress();
    }

    // NEW METHOD: Submit score to WordPress
    submitScoreToWordPress() {
        console.log('Submitting score to WordPress...');
        
        // Get quiz ID from hidden input
        const quizIdElement = document.getElementById('quiz-id');
        const quizId = quizIdElement ? parseInt(quizIdElement.value) : 0;
        
        // Create XHR request
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/wp-admin/admin-ajax.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log('Response status:', xhr.status);
                console.log('Response text:', xhr.responseText);
                
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        console.log('Parsed response:', response);
                        
                        if (response.success) {
                            console.log('Score saved successfully!');
                            this.loadLeaderboardFromWordPress(quizId);
                        } else {
                            console.error('Error saving score:', response.data ? response.data.message : 'Unknown error');
                            // Fall back to local leaderboard if WordPress fails
                            this.displayLocalLeaderboard();
                        }
                    } catch (e) {
                        console.error('Error parsing response:', e);
                        // Fall back to local leaderboard if parsing fails
                        this.displayLocalLeaderboard();
                    }
                } else {
                    // Fall back to local leaderboard if request fails
                    this.displayLocalLeaderboard();
                }
            }
        };
        
        const playerName = `${this.firstName} ${this.lastName}`;
        const data = 'action=submit_bridge_quiz_score' + 
                    '&quiz_id=' + encodeURIComponent(quizId) + 
                    '&player_name=' + encodeURIComponent(playerName) + 
                    '&score=' + encodeURIComponent(this.score) + 
                    '&max_score=' + encodeURIComponent(this.questions.length);
        
        xhr.send(data);
    }
    
    // NEW METHOD: Load leaderboard from WordPress
    loadLeaderboardFromWordPress(quizId) {
        console.log('Loading TablePress leaderboard...');
        
        // Create XHR request
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/wp-admin/admin-ajax.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log('Leaderboard response status:', xhr.status);
                console.log('Leaderboard response text:', xhr.responseText);
                
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        console.log('Parsed leaderboard response:', response);
                        
                        if (response.success) {
                            // Replace the leaderboard container
                            const leaderboardContainer = document.getElementById('leaderboard-container');
                            if (leaderboardContainer) {
                                leaderboardContainer.innerHTML = response.data.leaderboard;
                                console.log('Replaced leaderboard with TablePress data');
                            }
                        } else {
                            console.error('Error loading leaderboard:', response.data ? response.data.message : 'Unknown error');
                            // Fall back to local leaderboard
                            this.displayLocalLeaderboard();
                        }
                    } catch (e) {
                        console.error('Error parsing leaderboard response:', e);
                        // Fall back to local leaderboard
                        this.displayLocalLeaderboard();
                    }
                } else {
                    // Fall back to local leaderboard
                    this.displayLocalLeaderboard();
                }
            }
        };
        
        const data = 'action=get_bridge_quiz_leaderboard' + 
                    '&quiz_id=' + encodeURIComponent(quizId);
        
        xhr.send(data);
    }

    // RENAMED: Original displayLeaderboard method renamed to displayLocalLeaderboard
    displayLocalLeaderboard() {
        console.log('Falling back to local leaderboard');
        
        // Get quiz ID from hidden input
        const quizIdElement = document.getElementById('quiz-id');
        const quizId = quizIdElement ? parseInt(quizIdElement.value) : 0;
        
        const key = `${quizId}-scores`;
        const scores = JSON.parse(localStorage.getItem(key) || '[]');
        scores.push({
            firstName: this.firstName,
            lastName: this.lastName,
            score: this.score,
            date: new Date().toISOString()
        });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem(key, JSON.stringify(scores));

        const leaderboardBody = document.getElementById('leaderboardBody');
        if (leaderboardBody) {
            leaderboardBody.innerHTML = '';
            scores.slice(0, 10).forEach((s, i) => {
                leaderboardBody.innerHTML += `
                    <tr><td>${i + 1}</td><td>${s.firstName} ${s.lastName}</td><td>${s.score}</td><td>${new Date(s.date).toLocaleDateString()}</td></tr>
                `;
            });
        }
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
            document.body.innerHTML = '<h1>Quiz Closed</h1><p>You can close this tab now.</p>';
        }
    }

    handleInitializationError() {
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
