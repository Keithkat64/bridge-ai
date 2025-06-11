class BridgeQuiz {
    constructor() {
        // Initialize PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
        
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.currentlyShowingAnswer = false;
        
        // Initialize leaderboard
        window.leaderboard = new Leaderboard();
        
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // PDF upload elements
        this.pdfUploadSection = document.getElementById('pdfUploadSection');
        this.questionsPdfInput = document.getElementById('questionsPdf');
        this.solutionsPdfInput = document.getElementById('solutionsPdf');
        this.startQuizSetupButton = document.getElementById('startQuizSetup');
        this.quizContainer = document.getElementById('quizContainer');

        // Quiz elements
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
    }

    attachEventListeners() {
        this.startQuizSetupButton.addEventListener('click', () => this.handlePDFUpload());
        this.registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.startQuiz();
        });
        this.submitButton.addEventListener('click', () => this.handleSubmit());
        this.continueButton.addEventListener('click', () => this.handleContinue());
        this.retryButton.addEventListener('click', () => this.resetQuiz());
        this.closeButton.addEventListener('click', () => this.closeQuiz());
    }

    async handlePDFUpload() {
        try {
            const questionsPdf = this.questionsPdfInput.files[0];
            const solutionsPdf = this.solutionsPdfInput.files[0];

            if (!questionsPdf || !solutionsPdf) {
                alert('Please upload both PDFs');
                return;
            }

            // Parse PDFs
            const questionsText = await this.parsePDF(questionsPdf);
            const solutionsText = await this.parsePDF(solutionsPdf);

            // Extract questions and answers
            this.questions = await this.createQuestions(questionsText, solutionsText);

            if (this.questions.length === 0) {
                throw new Error('No questions could be parsed from the PDFs');
            }

            // Hide PDF upload and show quiz registration
            this.pdfUploadSection.classList.add('hidden');
            this.quizContainer.classList.remove('hidden');
            this.registrationSection.classList.remove('hidden');

        } catch (error) {
            console.error('Error processing PDFs:', error);
            alert('Error processing PDFs. Please try again.');
        }
    }

    async parsePDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
        }
        
        return text;
    }

    async createQuestions(questionsText, solutionsText) {
        const questions = [];
        
        // Regular expressions for parsing
        const questionRegex = /(\d+)\.\s*Does\s+([^?]+)\?/g;
        const optionsRegex = /([a-c])\)\s*([^\n]+)/g;
        const handRegex = /♠\s*([^\n♥]+)\n♥\s*([^\n♦]+)\n♦\s*([^\n♣]+)\n♣\s*([^\n]+)/g;
        const biddingRegex = /Dealer:\s*([^\n]+)\n((?:(?:Pass|[1-7][CDHSN]|X|XX|\?|\s)+\n)+)/g;

        let match;
        while ((match = questionRegex.exec(questionsText)) !== null) {
            const questionNumber = parseInt(match[1]);
            const questionText = match[2].trim();
            
            // Find corresponding hand
            const handMatch = handRegex.exec(questionsText);
            
            // Find corresponding bidding
            const biddingMatch = biddingRegex.exec(questionsText);
            
            // Find options
            const options = [];
            let optionMatch;
            while ((optionMatch = optionsRegex.exec(questionsText)) !== null) {
                options.push({
                    id: optionMatch[1],
                    text: optionMatch[2].trim()
                });
            }

            // Find answer and explanation in solutions
            const solutionRegex = new RegExp(`${questionNumber}\\.\\s*([^\\n]+)\\n([^\\n]+)`);
            const solutionMatch = solutionRegex.exec(solutionsText);
            
            if (handMatch && biddingMatch && solutionMatch) {
                questions.push({
                    hand: {
                        spades: handMatch[1].trim(),
                        hearts: handMatch[2].trim(),
                        diamonds: handMatch[3].trim(),
                        clubs: handMatch[4].trim()
                    },
                    bidding: {
                        dealer: biddingMatch[1].trim(),
                        sequence: this.parseBiddingSequence(biddingMatch[2])
                    },
                    options: options,
                    correct: solutionMatch[1].trim(),
                    explanation: solutionMatch[2].trim(),
                    fullHand: this.parseFullHand(solutionsText, questionNumber)
                });
            }
        }

        return questions;
    }

    parseBiddingSequence(biddingText) {
        const rows = biddingText.trim().split('\n');
        return rows.map(row => 
            row.trim().split(/\s+/).map(bid => bid.trim())
        );
    }

    parseFullHand(solutionsText, questionNumber) {
        // Implementation depends on your PDF format
        // This is a placeholder - implement based on your PDF structure
        return {
            north: { spades: "", hearts: "", diamonds: "", clubs: "" },
            south: { spades: "", hearts: "", diamonds: "", clubs: "" },
            east: { spades: "", hearts: "", diamonds: "", clubs: "" },
            west: { spades: "", hearts: "", diamonds: "", clubs: "" }
        };
    }

    // ... rest of the existing methods ...
}

class Leaderboard {
    constructor() {
        this.scores = JSON.parse(localStorage.getItem('bridgeQuizScores')) || [];
    }

    async addScore(scoreData) {
        this.scores.push(scoreData);
        this.scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('bridgeQuizScores', JSON.stringify(this.scores));
        this.displayLeaderboard();
    }

    displayLeaderboard() {
        const leaderboardBody = document.getElementById('leaderboardBody');
        if (!leaderboardBody) return;

        leaderboardBody.innerHTML = '';
        
        this.scores.slice(0, 10).forEach((score, index) => {
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
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing quiz');
        window.quiz = new BridgeQuiz();
    } catch (error) {
        console.error('Error initializing quiz:', error);
    }
});
