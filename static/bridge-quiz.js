// bridge-quiz.js
class BridgeQuiz {
    constructor() {
        this.questions = [
            {
                question: "Does North bid:",
                options: [
                    { id: "a", text: "2H" },
                    { id: "b", text: "2S" },
                    { id: "c", text: "4S" }
                ],
                correct: "c"
            },
            {
                question: "Does West bid:",
                options: [
                    { id: "a", text: "2H" },
                    { id: "b", text: "3H" },
                    { id: "c", text: "4H" }
                ],
                correct: "b"
            },
            {
                question: "Does South bid:",
                options: [
                    { id: "a", text: "Pass" },
                    { id: "b", text: "4S" }
                ],
                correct: "a"
            },
            {
                question: "Does West bid:",
                options: [
                    { id: "a", text: "Pass" },
                    { id: "b", text: "1NT" },
                    { id: "c", text: "2D" }
                ],
                correct: "b"
            },
            {
                question: "Does East bid:",
                options: [
                    { id: "a", text: "Pass" },
                    { id: "b", text: "2S" },
                    { id: "c", text: "3S" }
                ],
                correct: "c"
            },
            {
                question: "Does West bid:",
                options: [
                    { id: "a", text: "2S" },
                    { id: "b", text: "3D" },
                    { id: "c", text: "3NT" },
                    { id: "d", text: "4NT" }
                ],
                correct: "b"
            },
            {
                question: "Does North bid:",
                options: [
                    { id: "a", text: "2H" },
                    { id: "b", text: "3H" },
                    { id: "c", text: "4H" }
                ],
                correct: "c"
            },
            {
                question: "Does West bid:",
                options: [
                    { id: "a", text: "2NT" },
                    { id: "b", text: "3S" },
                    { id: "c", text: "3NT" }
                ],
                correct: "c"
            },
            {
                question: "Does South bid:",
                options: [
                    { id: "a", text: "2S" },
                    { id: "b", text: "3S" },
                    { id: "c", text: "4S" }
                ],
                correct: "c"
            },
            {
                question: "Does West bid:",
                options: [
                    { id: "a", text: "Pass" },
                    { id: "b", text: "3S" },
                    { id: "c", text: "4S" }
                ],
                correct: "a"
            },
            {
                question: "Does North bid:",
                options: [
                    { id: "a", text: "Pass" },
                    { id: "b", text: "3S" },
                    { id: "c", text: "4S" }
                ],
                correct: "a"
            },
            {
                question: "Does West bid:",
                options: [
                    { id: "a", text: "Pass" },
                    { id: "b", text: "3D" },
                    { id: "c", text: "4H" }
                ],
                correct: "a"
            }
        ];
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
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

        this.nextButton.addEventListener('click', () => this.handleNextQuestion());
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
        this.questionText.textContent = question.question;
        this.optionsContainer.innerHTML = '';
        
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = `${option.id.toUpperCase()}) ${option.text}`;
            button.addEventListener('click', () => this.selectOption(option.id, button));
            this.optionsContainer.appendChild(button);
        });

        this.updateProgressBar();
        this.nextButton.disabled = true;
    }

    selectOption(optionId, selectedButton) {
        this.userAnswers[this.currentQuestion] = optionId;
        
        // Update UI
        this.optionsContainer.querySelectorAll('.option').forEach(button => {
            button.classList.remove('selected');
        });
        selectedButton.classList.add('selected');
        
        this.nextButton.disabled = false;
    }

    handleNextQuestion() {
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

    calculateScore() {
        this.score = this.userAnswers.reduce((score, answer, index) => {
            return score + (answer === this.questions[index].correct ? 1 : 0);
        }, 0);
        return this.score;
    }

    async showResults() {
        this.quizSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');
        
        const finalScore = this.calculateScore();
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
