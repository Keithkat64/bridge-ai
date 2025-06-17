/**
 * Bridge Quiz Leaderboard Override
 * This script completely replaces the local leaderboard with TablePress
 */
document.addEventListener('DOMContentLoaded', function() {
    // Function to check if the quiz completion screen is visible
    function checkForQuizCompletion() {
        const quizComplete = document.getElementById('quiz-complete');
        if (quizComplete && window.getComputedStyle(quizComplete).display !== 'none') {
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
                
                // Clear any existing leaderboard
                const leaderboardContainer = document.getElementById('leaderboard-container');
                if (leaderboardContainer) {
                    leaderboardContainer.innerHTML = '<h3>Leaderboard</h3><p>Loading TablePress leaderboard...</p>';
                }
                
                // Submit score to WordPress
                submitScoreToWordPress(playerName, score, total, quizId);
                
                // Stop checking
                clearInterval(checkInterval);
            }
        }
    }
    
    // Check every second for quiz completion
    const checkInterval = setInterval(checkForQuizCompletion, 1000);
    
    // Function to submit score to WordPress
    function submitScoreToWordPress(playerName, score, maxScore, quizId) {
        console.log('Submitting score to WordPress...');
        
        // Create XHR request (more compatible than fetch)
        const xhr = new XMLHttpRequest();
        xhr.open('POST', bridgeQuizAjax.ajaxurl, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('Response status:', xhr.status);
                console.log('Response text:', xhr.responseText);
                
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        console.log('Parsed response:', response);
                        
                        if (response.success) {
                            console.log('Score saved successfully!');
                            loadLeaderboard(quizId);
                        } else {
                            console.error('Error saving score:', response.data ? response.data.message : 'Unknown error');
                        }
                    } catch (e) {
                        console.error('Error parsing response:', e);
                    }
                }
            }
        };
        
        const data = 'action=submit_bridge_quiz_score' + 
                    '&nonce=' + encodeURIComponent(bridgeQuizAjax.nonce) + 
                    '&quiz_id=' + encodeURIComponent(quizId) + 
                    '&player_name=' + encodeURIComponent(playerName) + 
                    '&score=' + encodeURIComponent(score) + 
                    '&max_score=' + encodeURIComponent(maxScore);
        
        xhr.send(data);
    }
    
    // Function to load leaderboard from WordPress
    function loadLeaderboard(quizId) {
        console.log('Loading TablePress leaderboard...');
        
        // Create XHR request
        const xhr = new XMLHttpRequest();
        xhr.open('POST', bridgeQuizAjax.ajaxurl, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('Leaderboard response status:', xhr.status);
                console.log('Leaderboard response text:', xhr.responseText);
                
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        console.log('Parsed leaderboard response:', response);
                        
                        if (response.success) {
                            // Replace the existing leaderboard with the TablePress one
                            const leaderboardContainer = document.getElementById('leaderboard-container');
                            if (leaderboardContainer) {
                                leaderboardContainer.innerHTML = response.data.leaderboard;
                            }
                        } else {
                            console.error('Error loading leaderboard:', response.data ? response.data.message : 'Unknown error');
                        }
                    } catch (e) {
                        console.error('Error parsing leaderboard response:', e);
                    }
                }
            }
        };
        
        const data = 'action=get_bridge_quiz_leaderboard' + 
                    '&nonce=' + encodeURIComponent(bridgeQuizAjax.nonce) + 
                    '&quiz_id=' + encodeURIComponent(quizId);
        
        xhr.send(data);
    }
});
