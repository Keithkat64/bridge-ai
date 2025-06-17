<?php
/**
 * Add a shortcode to display the bridge quiz
 */
function bridge_quiz_shortcode($atts) {
    // Check if we have a quiz_id parameter in the URL
    $url_quiz_id = isset($_GET['quiz_id']) ? intval($_GET['quiz_id']) : 0;
    
    $atts = shortcode_atts(array(
        'id' => $url_quiz_id, // Use URL parameter as default if available
    ), $atts);
    
    $quiz_id_to_find = intval($atts['id']);
    
    // If no quiz ID is specified, show a message
    if ($quiz_id_to_find <= 0) {
        return '<div style="padding: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;">
            <p>No quiz ID specified. Please use the shortcode with an ID parameter or access via a proper quiz link.</p>
            <p>Example: [bridge_quiz id="1234"]</p>
        </div>';
    }
    
    // Try to find a post with matching quiz_id field
    $args = array(
        'post_type' => array('post', 'page'),
        'posts_per_page' => 1,
        'meta_query' => array(
            array(
                'key' => 'quiz_id',
                'value' => $quiz_id_to_find,
                'compare' => '='
            )
        )
    );
    
    $query = new WP_Query($args);
    
    if ($query->have_posts()) {
        $query->the_post();
        $post_id = get_the_ID();
        wp_reset_postdata();
    } else {
        return '<div style="padding: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;">
            <p>No quiz found with ID: ' . esc_html($quiz_id_to_find) . '</p>
        </div>';
    }
    
    // Get the quiz data from ACF field
    $text_file = get_field('input', $post_id);
    
    if (!$text_file) {
        return '<div style="padding: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;">
            <p>No quiz data found for quiz ID: ' . esc_html($quiz_id_to_find) . '</p>
        </div>';
    }
    
    // Parse the text file into quiz data
    $questions = parse_bridge_questions($text_file);
    
    // Start output buffering
    ob_start();
    
    // Include the quiz content directly
    ?>
    <div class="bridge-quiz-container">
        <div class="quiz-container">
            <h1 class="quiz-title">Bridge Bidding Quiz</h1>
            
            <!-- Hidden input to store quiz data -->
            <input type="hidden" id="quiz-data" value="<?php echo esc_attr(json_encode($questions)); ?>">
            <input type="hidden" id="quiz-id" value="<?php echo esc_attr($quiz_id_to_find); ?>">
            
            <div class="quiz-progress">
                <div class="progress-text">
                    Question <span id="current-question">1</span> of <span id="total-questions"><?php echo count($questions); ?></span>
                </div>
                <div class="progress-bar-container">
                    <div id="progress-bar" class="progress-bar"></div>
                </div>
            </div>
            
            <div class="question-container">
                <div class="hand-container">
                    <div class="hand">
                        <h3>South Hand</h3>
                        <div class="suit">
                            <div class="suit-icon spades">♠</div>
                            <div class="cards" id="south-spades"></div>
                        </div>
                        <div class="suit">
                            <div class="suit-icon hearts">♥</div>
                            <div class="cards" id="south-hearts"></div>
                        </div>
                        <div class="suit">
                            <div class="suit-icon diamonds">♦</div>
                            <div class="cards" id="south-diamonds"></div>
                        </div>
                        <div class="suit">
                            <div class="suit-icon clubs">♣</div>
                            <div class="cards" id="south-clubs"></div>
                        </div>
                    </div>
                </div>
                
                <div class="bidding-container">
                    <div class="bidding-title">Bidding (Dealer: <span id="dealer"></span>)</div>
                    <div class="bidding-sequence" id="bidding-sequence"></div>
                </div>
                
                <div class="question" id="question"></div>
                
                <div class="options" id="options"></div>
                
                <button class="submit-btn" id="submit-btn">Submit Answer</button>
                
                <div class="solution-container" id="solution-container">
                    <div class="solution-title">Solution:</div>
                    <div class="solution-text" id="solution-text"></div>
                    
                    <div class="all-hands" id="all-hands">
                        <h3>All Hands</h3>
                        <div class="bridge-table">
                            <div class="north-hand position">
                                <div class="position-label">North</div>
                                <div class="suit">
                                    <div class="suit-icon spades">♠</div>
                                    <div class="cards" id="north-spades"></div>
                                </div>
                                <div class="suit">
                                    <div class="suit-icon hearts">♥</div>
                                    <div class="cards" id="north-hearts"></div>
                                </div>
                                <div class="suit">
                                    <div class="suit-icon diamonds">♦</div>
                                    <div class="cards" id="north-diamonds"></div>
                                </div>
                                <div class="suit">
                                    <div class="suit-icon clubs">♣</div>
                                    <div class="cards" id="north-clubs"></div>
                                </div>
                            </div>
                            
                            <div class="middle-row">
                                <div class="west-hand position">
                                    <div class="position-label">West</div>
                                    <div class="suit">
                                        <div class="suit-icon spades">♠</div>
                                        <div class="cards" id="west-spades"></div>
                                    </div>
                                    <div class="suit">
                                        <div class="suit-icon hearts">♥</div>
                                        <div class="cards" id="west-hearts"></div>
                                    </div>
                                    <div class="suit">
                                        <div class="suit-icon diamonds">♦</div>
                                        <div class="cards" id="west-diamonds"></div>
                                    </div>
                                    <div class="suit">
                                        <div class="suit-icon clubs">♣</div>
                                        <div class="cards" id="west-clubs"></div>
                                    </div>
                                </div>
                                
                                <div class="table-center"></div>
                                
                                <div class="east-hand position">
                                    <div class="position-label">East</div>
                                    <div class="suit">
                                        <div class="suit-icon spades">♠</div>
                                        <div class="cards" id="east-spades"></div>
                                    </div>
                                    <div class="suit">
                                        <div class="suit-icon hearts">♥</div>
                                        <div class="cards" id="east-hearts"></div>
                                    </div>
                                    <div class="suit">
                                        <div class="suit-icon diamonds">♦</div>
                                        <div class="cards" id="east-diamonds"></div>
                                    </div>
                                    <div class="suit">
                                        <div class="suit-icon clubs">♣</div>
                                        <div class="cards" id="east-clubs"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="south-hand position">
                                <div class="position-label">South</div>
                                <div class="suit">
                                    <div class="suit-icon spades">♠</div>
                                    <div class="cards" id="south-spades-all"></div>
                                </div>
                                <div class="suit">
                                    <div class="suit-icon hearts">♥</div>
                                    <div class="cards" id="south-hearts-all"></div>
                                </div>
                                <div class="suit">
                                    <div class="suit-icon diamonds">♦</div>
                                    <div class="cards" id="south-diamonds-all"></div>
                                </div>
                                <div class="suit">
                                    <div class="suit-icon clubs">♣</div>
                                    <div class="cards" id="south-clubs-all"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="next-btn" id="next-btn">Next Question</button>
            </div>
            
            <div class="quiz-complete" id="quiz-complete">
                <h2>Quiz Complete!</h2>
                <div class="score">Your score: <span id="final-score">0</span>/<span id="max-score"><?php echo count($questions); ?></span></div>
                <button class="restart-btn" id="restart-btn">Restart Quiz</button>
                
                <div id="leaderboard-container">
                    <h3>Leaderboard</h3>
                    <p>Loading leaderboard...</p>
                </div>
            </div>
        </div>
    </div>
    <?php
    
    return ob_get_clean();
}
add_shortcode('bridge_quiz', 'bridge_quiz_shortcode');
?>

