<?php
// 1. First, all PHP functions and initialization
function parse_bridge_solutions($solutions_content) {
    // Split content into individual questions
    $questions = [];
    $current_question = null;
    
    // Split the content into lines
    $lines = explode("\n", $solutions_content);
    
    foreach ($lines as $line) {
        $line = trim($line);
        
        // Look for hand pattern (spades, hearts, diamonds, clubs)
        if (preg_match('/^([AKQJT2-9]+),([AKQJT2-9]+),([AKQJT2-9]+),([AKQJT2-9]+)$/', $line, $matches)) {
            if ($current_question) {
                $questions[] = $current_question;
            }
            
            // Start new question with South's hand
            $current_question = [
                'hand' => [
                    'spades' => $matches[1],
                    'hearts' => $matches[2],
                    'diamonds' => $matches[3],
                    'clubs' => $matches[4]
                ],
                'bidding' => [
                    'dealer' => '',
                    'sequence' => []
                ],
                'options' => [],
                'correct' => '',
                'explanation' => '',
                'fullHand' => [
                    'north' => [],
                    'east' => [],
                    'south' => [
                        'spades' => $matches[1],
                        'hearts' => $matches[2],
                        'diamonds' => $matches[3],
                        'clubs' => $matches[4]
                    ],
                    'west' => []
                ]
            ];
        }
        
        // Look for "Do you bid" pattern
        if (preg_match('/Do you bid.*a\)(.*?)b\)(.*?)(?:c\)(.*?))?(?:d\)(.*?))?/i', $line, $matches)) {
            if ($current_question) {
                $options = [];
                foreach (array_slice($matches, 1) as $index => $option) {
                    if (!empty(trim($option))) {
                        $options[] = [
                            'id' => chr(97 + $index), // 'a', 'b', 'c', etc.
                            'text' => trim($option)
                        ];
                    }
                }
                $current_question['options'] = $options;
            }
        }
        
        // Look for "You bid X" pattern
        if (preg_match('/You bid ([abc]\))(.*?)\./', $line, $matches)) {
            if ($current_question) {
                $current_question['correct'] = $matches[1][0]; // Get just the letter
                $current_question['explanation'] = trim($matches[2]);
            }
        }
        
        // Look for dealer pattern
        if (preg_match('/Dealer:\s*([NSEW])/', $line, $matches)) {
            if ($current_question) {
                $current_question['bidding']['dealer'] = $matches[1];
            }
        }
    }
    
    // Add the last question
    if ($current_question) {
        $questions[] = $current_question;
    }
    
    return $questions;
}

// 2. Get quiz data
$quiz_id = get_the_ID();
$solutions_pdf = get_field('solutions_pdf');

if ($solutions_pdf) {
    // PDF parsing code
    require_once('pdf-parser.php');
    $parser = new \Smalot\PdfParser\Parser();
    $pdf = $parser->parseFile($solutions_pdf['url']);
    $text = $pdf->getText();
    
    // Parse the solutions
    $questions = parse_bridge_solutions($text);
    
    // Create the quiz data structure
    $quiz_data = array(
        'quizId' => $quiz_id,
        'quizDate' => current_time('Y-m-d'),
        'questions' => $questions
    );
} else {
    // No solutions PDF found, use sample data
    $quiz_data = array(
        'quizId' => $quiz_id,
        'quizDate' => current_time('Y-m-d'),
        'questions' => [
            [
                'hand' => [
                    'spades' => 'AQ8',
                    'hearts' => 'J',
                    'diamonds' => '87432',
                    'clubs' => 'QT32'
                ],
                'bidding' => [
                    'dealer' => 'S',
                    'sequence' => [['Pass', '1♠', 'Pass', '3♠']]
                ],
                'options' => [
                    ['id' => 'a', 'text' => '2♥'],
                    ['id' => 'b', 'text' => '2♠'],
                    ['id' => 'c', 'text' => '4♠']
                ],
                'correct' => 'c',
                'explanation' => 'Partner has shown a balanced 16-18 (or 15-17)...you have a fit...so ADD in your shortage points. Your hand is worth 12 tp, so bid game.'
            ]
        ]
    );
}

// 3. Debug output
error_log('Quiz template loaded');
?>

<!-- 4. HTML Structure starts here -->
<!--- Quiz Template Start -->
<div id="quizDebug" style="display:none;">
    Template loaded at: <?php echo date('Y-m-d H:i:s'); ?>
</div>

<!-- Quiz Data JavaScript -->
<script type="text/javascript">
    var quizData = <?php echo json_encode($quiz_data); ?>;
    console.log('Quiz data loaded:', quizData);
</script>

    <!-- Main Quiz Container -->
<div class="quiz-container">
    <button class="close-button" id="closeQuiz">×</button>
    
    <!-- Registration Section -->
    <div id="registrationSection">
        <div class="quiz-header">
            <h1><?php the_title(); ?></h1>
            <p>Please enter your name to begin</p>
        </div>
        <form class="registration-form" id="registrationForm">
            <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" required>
            </div>
            <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" required>
            </div>
            <button type="submit" class="button">Start Quiz</button>
        </form>
    </div>

    <!-- Quiz Section -->
    <div id="quizSection" class="hidden">
        <div class="quiz-header">
            <h1><?php the_title(); ?></h1>
        </div>
        <div class="progress-bar">
            <div class="progress" id="progressBar"></div>
        </div>
        
        <!-- Current Hand Display -->
        <div class="bridge-hand" id="currentHand">
            <div class="suit spades">
                <span class="suit-symbol">♠</span>
                <span class="cards"></span>
            </div>
            <div class="suit hearts">
                <span class="suit-symbol">♥</span>
                <span class="cards"></span>
            </div>
            <div class="suit diamonds">
                <span class="suit-symbol">♦</span>
                <span class="cards"></span>
            </div>
            <div class="suit clubs">
                <span class="suit-symbol">♣</span>
                <span class="cards"></span>
            </div>
        </div>

        <!-- Bidding Box -->
        <div class="bidding-box">
            <div>Dealer: <span id="dealer"></span></div>
            <table class="bidding-table">
                <thead>
                    <tr>
                        <th>West</th>
                        <th>North</th>
                        <th>East</th>
                        <th>South</th>
                    </tr>
                </thead>
                <tbody id="biddingSequence"></tbody>
            </table>
        </div>

        <!-- Answer Options -->
        <div class="radio-options" id="optionsContainer"></div>

        <button class="button" id="submitButton">Submit Answer</button>

        <!-- Answer Feedback -->
        <div class="answer-feedback" id="answerFeedback"></div>
        
        <!-- Full Hand Display -->
        <div class="full-hand hidden" id="fullHand">
            <h3>Full Hand:</h3>
            <div class="compass-layout">
                <div class="compass-position north">
                    <h4>North</h4>
                    <div class="hand-content"></div>
                </div>
                <div class="compass-position west">
                    <h4>West</h4>
                    <div class="hand-content"></div>
                </div>
                <div class="compass-position east">
                    <h4>East</h4>
                    <div class="hand-content"></div>
                </div>
                <div class="compass-position south">
                    <h4>South</h4>
                    <div class="hand-content"></div>
                </div>
            </div>
            <button class="button continue-button" id="continueButton">Continue</button>
        </div>
    </div>

    <!-- Results Section -->
    <div id="resultsSection" class="hidden">
        <div class="quiz-header">
            <h1>Quiz Complete!</h1>
            <p id="scoreDisplay"></p>
        </div>
        <div class="leaderboard">
            <h2>Leaderboard</h2>
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody id="leaderboardBody"></tbody>
            </table>
        </div>
        <button class="button" id="retryButton">Try Again</button>
    </div>

    <!-- Debug Section -->
    <div style="display:none;" id="debugInfo">
        <h3>Debug Information:</h3>
        <pre>
        <?php
            echo "Quiz Data:\n";
            print_r($quiz_data);
            
            // Check for required elements
            echo "\nRequired Elements Check:\n";
            $required_ids = [
                'registrationSection',
                'quizSection',
                'resultsSection',
                'registrationForm',
                'firstName',
                'lastName',
                'currentHand',
                'dealer',
                'biddingSequence',
                'optionsContainer',
                'submitButton',
                'answerFeedback',
                'fullHand',
                'continueButton',
                'progressBar',
                'scoreDisplay',
                'retryButton',
                'closeQuiz'
            ];
        ?>
        </pre>
    </div>
</div>

<!-- Debug Button -->
<button onclick="debugQuiz()" style="position:fixed; bottom:10px; right:10px; z-index:9999;">Debug Quiz</button>
<script>
function debugQuiz() {
    console.log('Debug Info:');
    console.log('Registration Section:', document.getElementById('registrationSection'));
    console.log('Quiz Section:', document.getElementById('quizSection'));
    console.log('Results Section:', document.getElementById('resultsSection'));
    console.log('Quiz Data:', window.quizData);
    console.log('Quiz Instance:', window.quiz);
    
    // Check all required elements
    const requiredIds = <?php echo json_encode($required_ids); ?>;
    const missing = requiredIds.filter(id => !document.getElementById(id));
    if (missing.length > 0) {
        console.error('Missing elements:', missing);
    } else {
        console.log('All required elements found');
    }
}
</script>

<!-- CSS Styles -->
<style>
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --success-color: #27ae60;
    --warning-color: #f39c12;
    --error-color: #e74c3c;
    --background-color: #ecf0f1;
    --text-color: #2c3e50;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    background-color: var(--background-color);
    color: var(--text-color);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.page-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.quiz-container {
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: relative;
    margin: 0 auto;
    max-width: 900px;
}

.close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    background: var(--error-color);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    z-index: 1000;
}

.quiz-header {
    text-align: center;
    margin-bottom: 30px;
    padding-top: 20px;
}

.quiz-header h1 {
    color: var(--primary-color);
    margin-bottom: 10px;
    font-size: 24px;
}

.registration-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

.bridge-hand {
    max-width: 300px;
    margin: 30px auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.suit {
    display: flex;
    align-items: center;
    margin: 10px 0;
    font-family: 'Courier New', monospace;
    font-size: 18px;
}

.suit-symbol {
    width: 30px;
    font-weight: bold;
}

.suit.spades .suit-symbol,
.suit.clubs .suit-symbol {
    color: black;
}

.suit.hearts .suit-symbol,
.suit.diamonds .suit-symbol {
    color: red;
}

.bidding-box {
    max-width: 500px;
    margin: 30px auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.bidding-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

.bidding-table th,
.bidding-table td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
}

.bidding-table th {
    background: #eee;
    font-weight: bold;
}

.radio-options {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin: 30px 0;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
}

.radio-option input[type="radio"] {
    width: 20px;
    height: 20px;
}

.radio-option label {
    font-size: 18px;
    cursor: pointer;
}

.compass-layout {
    display: grid;
    grid-template-areas:
        ". north ."
        "west . east"
        ". south .";
    gap: 20px;
    margin: 40px auto;
    max-width: 800px;
    padding: 20px;
}

.compass-position {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    width: 200px;
}

.compass-position.north { grid-area: north; justify-self: center; }
.compass-position.south { grid-area: south; justify-self: center; }
.compass-position.east { grid-area: east; }
.compass-position.west { grid-area: west; }

.compass-position h4 {
    text-align: center;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
}

.button {
    display: block;
    width: 200px;
    margin: 20px auto;
    padding: 12px 24px;
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s ease;
}

.button:hover {
    background: #2980b9;
}

.button:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
}

.continue-button {
    background: var(--success-color);
}

.continue-button:hover {
    background: #219a52;
}

.answer-feedback {
    max-width: 600px;
    margin: 20px auto;
    padding: 15px;
    border-radius: 8px;
    display: none;
}

.answer-feedback.correct {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.answer-feedback.incorrect {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.progress-bar {
    width: 100%;
    height: 10px;
    background: #ddd;
    border-radius: 5px;
    margin: 20px 0;
    overflow: hidden;
}

.progress {
    height: 100%;
    background: var(--secondary-color);
    width: 0%;
    transition: width 0.3s ease;
}

.hidden {
    display: none;
}

.leaderboard {
    margin-top: 40px;
}

.leaderboard h2 {
    text-align: center;
    margin-bottom: 20px;
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.leaderboard-table th,
.leaderboard-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.leaderboard-table th {
    background: var(--primary-color);
    color: white;
}

.leaderboard-table tr:nth-child(even) {
    background: #f8f9fa;
}

@media (max-width: 768px) {
    .quiz-container {
        padding: 15px;
    }

    .compass-layout {
        gap: 10px;
    }

    .compass-position {
        width: 150px;
        padding: 15px;
    }

    .radio-options {
        flex-direction: column;
        align-items: center;
    }

    .bidding-table th,
    .bidding-table td {
        padding: 8px;
        font-size: 14px;
    }
}
</style>