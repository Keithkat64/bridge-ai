<?php
$text_file = get_field('text_file');
if ($text_file) {
    // Split the text file into questions
    $questions = parse_bridge_questions($text_file);
}

// Function to parse the bridge quiz text file
function parse_bridge_questions($text_file) {
    // Split the file into individual questions
    $questions = explode("QUESTION", $text_file);
    array_shift($questions); // Remove any content before the first question
    
    $parsed_questions = [];
    foreach ($questions as $q) {
        $question = [];
        
        // Extract the South hand
        preg_match('/SOUTH:(.*?)(?=BIDDING:|$)/s', $q, $south_matches);
        $question['south_hand'] = trim($south_matches[1] ?? '');
        
        // Extract the bidding
        preg_match('/BIDDING:(.*?)(?=QUESTION:|$)/s', $q, $bidding_matches);
        $question['bidding'] = trim($bidding_matches[1] ?? '');
        
        // Extract the question text
        preg_match('/QUESTION:(.*?)(?=OPTIONS:|$)/s', $q, $question_matches);
        $question['question_text'] = trim($question_matches[1] ?? '');
        
        // Extract options
        preg_match('/OPTIONS:(.*?)(?=SOLUTION:|$)/s', $q, $options_matches);
        if (isset($options_matches[1])) {
            $options = explode("\n", trim($options_matches[1]));
            $question['options'] = array_filter(array_map('trim', $options));
        }
        
        // Extract solution
        preg_match('/SOLUTION:(.*?)(?=HANDS:|$)/s', $q, $solution_matches);
        $question['solution'] = trim($solution_matches[1] ?? '');
        
        // Extract all hands
        preg_match('/HANDS:(.*?)(?=END|$)/s', $q, $hands_matches);
        $question['all_hands'] = trim($hands_matches[1] ?? '');
        
        $parsed_questions[] = $question;
    }
    
    return $parsed_questions;
}
?>
