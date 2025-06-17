/**
 * Bridge Quiz Leaderboard Direct Override
 * This script directly modifies the DOM to replace the local leaderboard
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bridge Quiz Leaderboard Direct Override loaded');
    
    // Function to check if the quiz completion screen is visible
    function checkForQuizCompletion() {
        console.log('Checking for quiz completion...');
        
        // Look for the leaderboard table
        const leaderboardTable = document.querySelector('table#leaderboardTable, #leaderboardBody, .leaderboard-table');
        if (leaderboardTable) {
            console.log('Found leaderboard table:', leaderboardTable);
            
            // Get the score and player name
            const scoreDisplay = document.querySelector('.score');
            let playerName = "Anonymous Player";
            let score = 0;
            let total = 10; // Default value
            
            if (scoreDisplay) {
                const scoreText = scoreDisplay.textContent;
                console.log('Score text:', scoreText);
                
                const nameMatch = scoreText.match(/(.*?),\s*you scored/);
                if (nameMatch && nameMatch[1]) {
                    playerName = nameMatch[1].trim();
                }
                
                const scoreMatch = scoreText.match(/you scored (\d+) out of (\d+)/);
                if (scoreMatch && scoreMatch[1] && scoreMatch[2]) {
                    score = parseInt(scoreMatch[1]);
                    total = parseInt(scoreMatch[2]);
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
            
            // Stop checking
            clearInterval(checkInterval);
        }
    }
    
    // Check every second for quiz completion
    const checkInterval = setInterval(checkForQuizCompletion, 1000);
    
    // Function to submit score to WordPress
    function submitScoreToWordPress(playerName, score, maxScore, quizId) {
        console.log('Submitting score to WordPress...');
        
        // Create XHR request
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/wp-admin/admin-ajax.php', true);
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
        xhr.open('POST', '/wp-admin/admin-ajax.php', true);
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
                            // Find the leaderboard container
                            const leaderboardContainer = document.getElementById('leaderboard-container');
                            const leaderboardTable = document.querySelector('table#leaderboardTable, #leaderboardBody, .leaderboard-table');
                            
                            if (leaderboardContainer) {
                                // Replace the entire container
                                leaderboardContainer.innerHTML = '<h3>Leaderboard</h3>' + response.data.leaderboard;
                                console.log('Replaced leaderboard container');
                            } else if (leaderboardTable) {
                                // Replace just the table
                                const tableParent = leaderboardTable.parentNode;
                                const tempDiv = document.createElement('div');
                                tempDiv.innerHTML = response.data.leaderboard;
                                const newTable = tempDiv.querySelector('table');
                                
                                if (newTable && tableParent) {
                                    tableParent.replaceChild(newTable, leaderboardTable);
                                    console.log('Replaced leaderboard table');
                                }
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
                    '&quiz_id=' + encodeURIComponent(quizId);
        
        xhr.send(data);
    }
});
