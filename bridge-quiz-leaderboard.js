/**
 * Bridge Quiz Leaderboard Integration
 * This script intercepts the quiz completion and saves scores to TablePress
 */
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the quiz to be completed
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const quizComplete = document.getElementById('quiz-complete');
                if (quizComplete && quizComplete.style.display !== 'none') {
                    // Quiz has been completed, get the score
                    const finalScore = document.getElementById('final-score');
                    const maxScore = document.getElementById('max-score');
                    
                    if (finalScore && maxScore) {
                        const score = parseInt(finalScore.textContent);
                        const total = parseInt(maxScore.textContent);
                        
                        // Get player name from the score display
                        const scoreDisplay = document.querySelector('.score');
                        let playerName = "Anonymous Player";
                        
                        if (scoreDisplay) {
                            const scoreText = scoreDisplay.textContent;
                            const nameMatch = scoreText.match(/(.*?),\s*you scored/);
                            if (nameMatch && nameMatch[1]) {
                                playerName = nameMatch[1].trim();
                            }
                        }
                        
                        // Get quiz ID
                        const quizIdElement = document.getElementById('quiz-id');
                        const quizId = quizIdElement ? parseInt(quizIdElement.value) : 0;
                        
                        console.log('Quiz completed!', {
                            playerName,
                            score,
                            total,
                            quizId
                        });
                        
                        // Submit score to WordPress
                        submitScoreToWordPress(playerName, score, total, quizId);
                    }
                    
                    // Disconnect observer once quiz is completed
                    observer.disconnect();
                }
            }
        });
    });
    
    // Start observing the quiz container
    const quizContainer = document.querySelector('.bridge-quiz-container');
    if (quizContainer) {
        observer.observe(quizContainer, { 
            attributes: true, 
            childList: true, 
            subtree: true 
        });
    }
    
    // Function to submit score to WordPress
    function submitScoreToWordPress(playerName, score, maxScore, quizId) {
        // Create form data
        const formData = new FormData();
        formData.append('action', 'submit_bridge_quiz_score');
        formData.append('nonce', bridgeQuizAjax.nonce);
        formData.append('quiz_id', quizId);
        formData.append('player_name', playerName);
        formData.append('score', score);
        formData.append('max_score', maxScore);
        
        // Send AJAX request
        fetch(bridgeQuizAjax.ajaxurl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Score submission response:', data);
            if (data.success) {
                console.log('Score saved to TablePress successfully!');
                loadLeaderboard(quizId);
            } else {
                console.error('Error saving score:', data);
            }
        })
        .catch(error => {
            console.error('Error submitting score:', error);
        });
    }
    
    // Function to load leaderboard from WordPress
    function loadLeaderboard(quizId) {
        // Create form data
        const formData = new FormData();
        formData.append('action', 'get_bridge_quiz_leaderboard');
        formData.append('nonce', bridgeQuizAjax.nonce);
        formData.append('quiz_id', quizId);
        
        // Send AJAX request
        fetch(bridgeQuizAjax.ajaxurl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Leaderboard response:', data);
            if (data.success) {
                // Replace the existing leaderboard with the TablePress one
                const leaderboardContainer = document.getElementById('leaderboard-container');
                if (leaderboardContainer) {
                    leaderboardContainer.innerHTML = data.data.leaderboard;
                }
            } else {
                console.error('Error loading leaderboard:', data);
            }
        })
        .catch(error => {
            console.error('Error loading leaderboard:', error);
        });
    }
});
