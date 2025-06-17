<?php
/**
 * Template Name: Bridge Quiz
 * Template Post Type: post, page
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

get_header();

// Get the quiz data from ACF field
$text_file = get_field('input');
$quiz_id = get_field('quiz_id') ?: 0;

// Parse the text file into quiz data
$questions = array();
if ($text_file) {
    $questions = parse_bridge_questions($text_file);
}

// Function to parse the bridge quiz text file if not already defined
if (!function_exists('parse_bridge_questions')) {
    function parse_bridge_questions($text_file) {
        // Split by hand markers
        $hands = explode("Hand ", $text_file);
        array_shift($hands); // Remove any content before the first hand
        
        $parsed_questions = array();
        foreach ($hands as $hand) {
            // Extract hand number
            preg_match('/(\d+):/', $hand, $hand_num_matches);
            $hand_num = isset($hand_num_matches[1]) ? $hand_num_matches[1] : '';
            
            // Extract cards section
            preg_match('/Cards:(.*?)Dealer:/s', $hand, $cards_matches);
            $cards_section = isset($cards_matches[1]) ? trim($cards_matches[1]) : '';
            
            // Extract dealer
            preg_match('/Dealer: (.*?)Bidding:/s', $hand, $dealer_matches);
            $dealer = isset($dealer_matches[1]) ? trim($dealer_matches[1]) : '';
            
            // Extract bidding
            preg_match('/Bidding:(.*?)Question:/s', $hand, $bidding_matches);
            $bidding_text = isset($bidding_matches[1]) ? trim($bidding_matches[1]) : '';
            $bidding = array_filter(array_map('trim', explode("\n", $bidding_text)));
            
            // Extract question
            preg_match('/Question:(.*?)Solution:/s', $hand, $question_matches);
            $question_text = isset($question_matches[1]) ? trim($question_matches[1]) : '';
            
            // Extract solution
            preg_match('/Solution:(.*?)(?:-{40}|$)/s', $hand, $solution_matches);
            $solution = isset($solution_matches[1]) ? trim($solution_matches[1]) : '';
            
            // Parse the cards for each player
            $north_cards = extract_player_cards($cards_section, 'North:');
            $east_cards = extract_player_cards($cards_section, 'East:');
            $south_cards = extract_player_cards($cards_section, 'South:');
            $west_cards = extract_player_cards($cards_section, 'West:');
            
            // Parse the question options
            preg_match('/Does South bid (.*?)$/m', $question_text, $options_match);
            $options_text = isset($options_match[1]) ? trim($options_match[1]) : '';
            
            // Extract options like "a) 2S or b) 3S"
            $options = array();
            $correct_answer = '';
            
            // Check if the solution contains the answer
            if (preg_match('/South bids ([a-z]\))/', $solution, $answer_match)) {
                $correct_answer = strtolower(substr($answer_match[1], 0, 1)); // Extract just the letter
            }
            
            // Parse options like "a) 2S or b) 3S"
            if (preg_match_all('/([a-z])\) ([^\s]+)/', $options_text, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    $option_letter = strtolower($match[1]);
                    $option_text = $match[2];
                    $options[] = array(
                        'text' => $match[0], // Full text like "a) 2S"
                        'value' => $option_letter, // Just the letter
                        'id' => $option_letter // Use letter as ID
                    );
                }
            }
            
            // Create the question object
            $question = array(
                'dealer' => $dealer,
                'bidding' => array(
                    'dealer' => $dealer,
                    'sequence' => array_chunk($bidding, 4) // Group bidding into rows of 4
                ),
                'question' => $question_text,
                'options' => $options,
                'correct' => $correct_answer,
                'explanation' => $solution,
                'hand' => $south_cards,
                'fullHand' => array(
                    'north' => $north_cards,
                    'east' => $east_cards,
                    'south' => $south_cards,
                    'west' => $west_cards
                )
            );
            
            $parsed_questions[] = $question;
        }
        
        return $parsed_questions;
    }
}

// Helper function to extract player cards if not already defined
if (!function_exists('extract_player_cards')) {
    function extract_player_cards($cards_section, $player) {
        $pattern = '/' . $player . ' (.*?)(?=(?:North:|East:|South:|West:)|$)/s';
        preg_match($pattern, $cards_section, $matches);
        
        $cards_text = isset($matches[1]) ? trim($matches[1]) : '';
        $lines = array_filter(array_map('trim', explode("\n", $cards_text)));
        
        // Assuming the order is spades, hearts, diamonds, clubs
        return array(
            'spades' => isset($lines[0]) ? $lines[0] : '',
            'hearts' => isset($lines[1]) ? $lines[1] : '',
            'diamonds' => isset($lines[2]) ? $lines[2] : '',
            'clubs' => isset($lines[3]) ? $lines[3] : ''
        );
    }
}
?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header class="entry-header">
                <h1 class="entry-title"><?php the_title(); ?></h1>
            </header>

            <div class="entry-content">
                <?php if (!empty($questions)): ?>
                    <!-- Hidden input to store quiz data -->
                    <input type="hidden" id="quiz-data" value="<?php echo esc_attr(json_encode($questions)); ?>">
                    <input type="hidden" id="quiz-id" value="<?php echo esc_attr($quiz_id); ?>">
                    
                    <div class="bridge-quiz-container">
                        <div class="quiz-container">
                            <h1 class="quiz-title">Bridge Bidding Quiz</h1>
                            
                            <!-- Registration Section -->
                            <div id="registrationSection" class="registration-section">
                                <h2>Enter Your Name</h2>
                                <form id="registrationForm" class="registration-form">
                                    <div class="form-group">
                                        <label for="firstName">First Name</label>
                                        <input type="text" id="firstName" name="firstName" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="lastName">Last Name</label>
                                        <input type="text" id="lastName" name="lastName" required>
                                    </div>
                                    <button type="submit" class="start-btn">Start Quiz</button>
                                </form>
                            </div>
                            
                            <!-- Quiz Section -->
                            <div id="quizSection" class="quiz-section hidden">
                                <div class="quiz-progress">
                                    <div class="progress-text">
                                        Question <span id="current-question">1</span> of <span id="total-questions"><?php echo count($questions); ?></span>
                                    </div>
                                    <div class="progress-bar-container">
                                        <div id="progress-bar" class="progress-bar"></div>
                                    </div>
                                </div>
                                
                                <div id="currentHand" class="current-hand">
                                    <h3>South Hand</h3>
                                    <div class="suit spades">
                                        <div class="suit-icon">♠</div>
                                        <div class="cards" id="south-spades"></div>
                                    </div>
                                    <div class="suit hearts">
                                        <div class="suit-icon">♥</div>
                                        <div class="cards" id="south-hearts"></div>
                                    </div>
                                    <div class="suit diamonds">
                                        <div class="suit-icon">♦</div>
                                        <div class="cards" id="south-diamonds"></div>
                                    </div>
                                    <div class="suit clubs">
                                        <div class="suit-icon">♣</div>
                                        <div class="cards" id="south-clubs"></div>
                                    </div>
                                </div>
                                
                                <div class="bidding-container">
                                    <div class="bidding-title">Bidding (Dealer: <span id="dealer"></span>)</div>
                                    <table class="bidding-table">
                                        <tbody id="biddingSequence"></tbody>
                                    </table>
                                </div>
                                
                                <div id="optionsContainer" class="options-container"></div>
                                
                                <button id="submitButton" class="submit-btn" disabled>Submit Answer</button>
                                
                                <div id="answerFeedback" class="answer-feedback" style="display: none;"></div>
                                
                                <div id="fullHand" class="full-hand hidden">
                                    <h3>All Hands</h3>
                                    <div class="hands-grid">
                                        <div class="north position">
                                            <div class="position-label">North</div>
                                            <div class="hand-content"></div>
                                        </div>
                                        <div class="west position">
                                            <div class="position-label">West</div>
                                            <div class="hand-content"></div>
                                        </div>
                                        <div class="east position">
                                            <div class="position-label">East</div>
                                            <div class="hand-content"></div>
                                        </div>
                                        <div class="south position">
                                            <div class="position-label">South</div>
                                            <div class="hand-content"></div>
                                        </div>
                                    </div>
                                    <button id="continueButton" class="continue-btn">Continue</button>
                                </div>
                            </div>
                            
                            <!-- Results Section -->
                            <div id="resultsSection" class="results-section hidden">
                                <h2>Quiz Complete!</h2>
                                <div id="scoreDisplay" class="score-display"></div>
                                <div id="percentageDisplay" class="percentage-display"></div>
                                <button id="retryButton" class="retry-btn">Try Again</button>
                                <button id="closeQuiz" class="close-btn">Close Quiz</button>
                            </div>
                        </div>
                    </div>
                <?php else: ?>
                    <div style="padding: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; margin: 20px 0;">
                        <h3>No Quiz Data Found</h3>
                        <p>Please check that the ACF field 'text_file' contains valid quiz data.</p>
                        
                        <?php if (current_user_can('edit_posts')): ?>
                            <div style="margin-top: 15px; padding: 10px; background-color: #f0f0f0; border: 1px solid #ddd;">
                                <h4>Debug Information (visible to admins only):</h4>
                                <p>Quiz ID: <?php echo $quiz_id; ?></p>
                                <p>ACF field 'text_file' exists: <?php echo function_exists('get_field') ? 'Yes' : 'No (ACF not active)'; ?></p>
                                <p>Text file content exists: <?php echo !empty($text_file) ? 'Yes (' . strlen($text_file) . ' characters)' : 'No'; ?></p>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </article>
    </main>
</div>

<?php get_footer(); ?>
