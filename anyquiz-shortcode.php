/**
 * Shortcode to list all available quizzes
 */
function bridge_quiz_list_shortcode($atts) {
    $atts = shortcode_atts(array(
        'category' => '',
    ), $atts);
    
    $category_filter = $atts['category'];
    
    // Query for posts with quiz_id field
    $args = array(
        'post_type' => array('post', 'page'),
        'posts_per_page' => -1,
        'meta_query' => array(
            array(
                'key' => 'quiz_id',
                'compare' => 'EXISTS',
            )
        )
    );
    
    // Add category filter if specified
    if (!empty($category_filter)) {
        $args['meta_query'][] = array(
            'key' => 'category',
            'value' => $category_filter,
            'compare' => '=',
        );
    }
    
    $query = new WP_Query($args);
    
    ob_start();
    
    if ($query->have_posts()) {
        ?>
        <div class="bridge-quiz-list">
            <h2>Available Bridge Quizzes</h2>
            
            <div class="quiz-filters">
                <button class="filter-btn active" data-category="all">All</button>
                <button class="filter-btn" data-category="beginner">Beginner</button>
                <button class="filter-btn" data-category="intermediate">Intermediate</button>
                <button class="filter-btn" data-category="advanced">Advanced</button>
            </div>
            
            <div class="quiz-grid">
                <?php
                while ($query->have_posts()) {
                    $query->the_post();
                    $post_id = get_the_ID();
                    $quiz_id = get_field('quiz_id', $post_id);
                    $quiz_date = get_field('quiz_date', $post_id);
                    $category = get_field('category', $post_id);
                    $questions_pdf = get_field('questions_pdf', $post_id);
                    $solutions_pdf = get_field('solutions_pdf', $post_id);
                    
                    // Format the date
                    $formatted_date = !empty($quiz_date) ? date('j F Y', strtotime($quiz_date)) : 'No date';
                    
                    // Create a unique URL for the quiz
                    $quiz_url = add_query_arg('bridge_quiz_id', $quiz_id, get_permalink(get_page_by_path('bridge-quiz')));
                    ?>
                    
                    <div class="quiz-card" data-category="<?php echo esc_attr(strtolower($category)); ?>">
                        <div class="quiz-date"><?php echo esc_html($formatted_date); ?></div>
                        <div class="quiz-category"><?php echo esc_html(ucfirst($category)); ?></div>
                        
                        <div class="quiz-actions">
                            <a href="<?php echo esc_url($quiz_url); ?>" class="quiz-btn primary">Start Quiz</a>
                            
                            <?php if (!empty($questions_pdf)) : ?>
                                <a href="<?php echo esc_url($questions_pdf['url']); ?>" class="quiz-btn secondary" target="_blank">Questions PDF</a>
                            <?php endif; ?>
                            
                            <?php if (!empty($solutions_pdf)) : ?>
                                <a href="<?php echo esc_url($solutions_pdf['url']); ?>" class="quiz-btn secondary" target="_blank">Solutions PDF</a>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <?php
                }
                wp_reset_postdata();
                ?>
            </div>
        </div>
        
        <style>
            .bridge-quiz-list {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .quiz-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .filter-btn {
                padding: 8px 16px;
                background-color: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .filter-btn.active {
                background-color: #1a2a6c;
                color: white;
                border-color: #1a2a6c;
            }
            
            .quiz-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }
            
            .quiz-card {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            
            .quiz-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .quiz-date {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .quiz-category {
                color: #666;
                margin-bottom: 15px;
                font-style: italic;
            }
            
            .quiz-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .quiz-btn {
                display: inline-block;
                padding: 10px 15px;
                text-align: center;
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.3s ease;
            }
            
            .quiz-btn.primary {
                background-color: #1a2a6c;
                color: white;
            }
            
            .quiz-btn.primary:hover {
                background-color: #0d1b4b;
            }
            
            .quiz-btn.secondary {
                background-color: #f0f0f0;
                color: #333;
                border: 1px solid #ddd;
            }
            
            .quiz-btn.secondary:hover {
                background-color: #e0e0e0;
            }
        </style>
        
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const filterButtons = document.querySelectorAll('.filter-btn');
                const quizCards = document.querySelectorAll('.quiz-card');
                
                filterButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const category = this.getAttribute('data-category');
                        
                        // Update active button
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Filter cards
                        quizCards.forEach(card => {
                            if (category === 'all' || card.getAttribute('data-category') === category) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    });
                });
            });
        </script>
        <?php
    } else {
        ?>
        <div class="no-quizzes">
            <p>No quizzes found. Please create quizzes with the required fields.</p>
        </div>
        <?php
    }
    
    return ob_get_clean();
}
add_shortcode('bridge_quiz_list', 'bridge_quiz_list_shortcode');
