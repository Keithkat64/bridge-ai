// Handle score submission
add_action('wp_ajax_submit_bridge_quiz_score', 'submit_bridge_quiz_score');
add_action('wp_ajax_nopriv_submit_bridge_quiz_score', 'submit_bridge_quiz_score');

function submit_bridge_quiz_score() {
    $quiz_id = intval($_POST['quiz_id']);
    $player_name = sanitize_text_field($_POST['player_name']);
    $score = intval($_POST['score']);
    $max_score = intval($_POST['max_score']);
    
    // Get the TablePress table ID (assuming it's 6 as mentioned)
    $table_id = 6;
    
    // Get current table data
    $tablepress_data = TablePress::$model_table->load($table_id);
    $data = $tablepress_data['data'];
    
    // Add new row with score data
    $percentage = round(($score / $max_score) * 100);
    $new_row = array(
        count($data) + 1, // Rank (will be sorted later)
        $player_name,
        $score,
        $max_score,
        $percentage . '%',
        date('Y-m-d H:i:s'),
        $quiz_id // Store quiz_id to filter by it later
    );
    
    $data[] = $new_row;
    
    // Sort by score (descending)
    usort($data, function($a, $b) {
        return $b[2] <=> $a[2]; // Compare score column
    });
    
    // Update ranks
    for ($i = 0; $i < count($data); $i++) {
        $data[$i][0] = $i + 1;
    }
    
    // Save updated table
    $tablepress_data['data'] = $data;
    TablePress::$model_table->save($tablepress_data);
    
    wp_send_json_success();
}

// Get leaderboard data
add_action('wp_ajax_get_bridge_quiz_leaderboard', 'get_bridge_quiz_leaderboard');
add_action('wp_ajax_nopriv_get_bridge_quiz_leaderboard', 'get_bridge_quiz_leaderboard');

function get_bridge_quiz_leaderboard() {
    $quiz_id = intval($_POST['quiz_id']);
    
    // Generate the TablePress shortcode with filter
    $leaderboard = do_shortcode('[table id=6 filter="6='.$quiz_id.'" /]');
    
    wp_send_json_success(array('leaderboard' => $leaderboard));
}
