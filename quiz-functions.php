<?php
if (!defined('ABSPATH')) {
    exit;
}

class Bridge_Quiz_Functions {
    public static function get_quiz_data($post_id = null) {
        if (!$post_id) {
            $post_id = get_the_ID();
        }

        if (!$post_id || get_post_type($post_id) !== 'quiz') {
            return [];
        }

        // Get text file
        $text_file = get_field('text_file', $post_id);
        $quiz_id = get_field('quiz_id', $post_id);
        
        if (!$text_file) {
            return self::get_sample_data($post_id);
        }

        try {
            // Read text file content
            $file_content = file_get_contents($text_file['url']);
            
            if (!$file_content) {
                throw new Exception('Could not read text file');
            }
            
            // Parse hands using the parser class
            $questions = Bridge_Quiz_Parser::parse_bridge_hands($file_content);
            
            return [
                'quizId' => $quiz_id ? $quiz_id : $post_id,
                'quizDate' => get_field('quiz_date', $post_id),
                'questions' => $questions
            ];
        } catch (Exception $e) {
            error_log('Quiz text file parsing error: ' . $e->getMessage());
            return self::get_sample_data($post_id);
        }
    }

    private static function get_sample_data($post_id) {
        $quiz_id = get_field('quiz_id', $post_id);
        return [
            'quizId' => $quiz_id ? $quiz_id : $post_id,
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
        ];
    }
}
