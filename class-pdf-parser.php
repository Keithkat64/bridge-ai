<?php
if (!defined('ABSPATH')) {
    exit;
}

class Bridge_Quiz_Parser {
    public static function parse_bridge_solutions($solutions_content) {
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
                    $current_question['correct'] = $matches[1][0];
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
}
