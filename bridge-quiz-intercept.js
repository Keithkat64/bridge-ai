/**
 * Bridge Quiz Intercept
 * This script completely replaces the quiz completion screen with our own
 */
(function() {
    console.log('Bridge Quiz Intercept loaded');
    
    // Create a style element to hide the original leaderboard
    const style = document.createElement('style');
    style.textContent = `
        #leaderboardBody, table.leaderboard-table {
            display: none !important;
        }
        
        #tablepress-leaderboard {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        #tablepress-leaderboard th {
            background-color: #1a2a6c;
            color: white;
            padding: 10px;
            text-align: left;
        }
        
        #tablepress-leaderboard td {
            padding: 8px 10px;
            border-bottom: 1px solid #ddd;
        }
        
        #tablepress-leaderboard tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    `;
    document.head.appendChild(style);
    
    // Function to check if the quiz completion screen is visible
    function checkForQuizCompletion() {
        const quizComplete = document.getElementById('quiz-complete');
        if (quizComplete && window.getComputedStyle(quizComplete).display !== 'none') {
            console.log('Quiz completion detected!');
            
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
            
            // Find the leaderboard container
            const leaderboardContainer = document.getElementById('leaderboard-container');
            if (leaderboardContainer) {
                // Replace with loading message
                leaderboardContainer.innerHTML = '<h3>Leaderboard</h3><p>Loading TablePress leaderboard...</p>';
                
                // Submit score to WordPress
                submitScoreToWordPress(playerName, score, total, quizId);
            }
            
            // Stop checking
            clearInterval(checkInterval);
        }
    }
    
    // Check every 500ms for quiz completion
    const checkInterval = setInterval(checkForQuizCompletion, 500);
    
    // Function to submit score to WordPress
    function submitScoreToWordPress(playerName, score, maxScore, quizId) {
        console.log('Submitting score to WordPress...');
        
        // Create form data for XHR
        const formData = new FormData();
        formData.append('action', 'submit_bridge_quiz_score');
        formData.append('quiz_id', quizId);
        formData.append('player_name', playerName);
        formData.append('score', score);
        formData.append('max_score', maxScore);
        
        // Convert FormData to URL-encoded string
        const data = Array.from(formData.entries())
            .map(pair => encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]))
            .join('&');
        
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
                            showLeaderboardError('Error saving score to TablePress.');
                        }
                    } catch (e) {
                        console.error('Error parsing response:', e);
                        showLeaderboardError('Error processing server response.');
                    }
                } else {
                    showLeaderboardError('Server error. Could not save score.');
                }
            }
        };
        
        xhr.send(data);
    }
    
    // Function to load leaderboard from WordPress
    function loadLeaderboard(quizId) {
        console.log('Loading TablePress leaderboard...');
        
        // Create form data for XHR
        const formData = new FormData();
        formData.append('action', 'get_bridge_quiz_leaderboard');
        formData.append('quiz_id', quizId);
        
        // Convert FormData to URL-encoded string
        const data = Array.from(formData.entries())
            .map(pair => encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]))
            .join('&');
        
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
                            if (leaderboardContainer) {
                                // Replace with TablePress leaderboard
                                leaderboardContainer.innerHTML = '<h3>Leaderboard</h3>' + response.data.leaderboard;
                                console.log('Replaced leaderboard with TablePress data');
                            }
                        } else {
                            console.error('Error loading leaderboard:', response.data ? response.data.message : 'Unknown error');
                            showLeaderboardError('Error loading TablePress leaderboard.');
                        }
                    } catch (e) {
                        console.error('Error parsing leaderboard response:', e);
                        showLeaderboardError('Error processing leaderboard data.');
                    }
                } else {
                    showLeaderboardError('Server error. Could not load leaderboard.');
                }
            }
        };
        
        xhr.send(data);
    }
    
    // Function to show leaderboard error
    function showLeaderboardError(message) {
        const leaderboardContainer = document.getElementById('leaderboard-container');
        if (leaderboardContainer) {
            leaderboardContainer.innerHTML = `
                <h3>Leaderboard</h3>
                <div style="color: #721c24; background-color: #f8d7da; padding: 10px; border: 1px solid #f5c6cb; border-radius: 4px;">
                    ${message}
                </div>
            `;
        }
    }
})();
