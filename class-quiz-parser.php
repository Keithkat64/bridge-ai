<?php
if (!defined('ABSPATH')) {
    exit;
}

class Bridge_Quiz_Parser {
    public static function parse_bridge_hands($content) {
        $questions = [];
        
        // Split the content into individual hands
        $hands = preg_split('/\-{10,}/', $content);
        
        foreach ($hands as $hand) {
            if (empty(trim($hand))) continue;
            
            $question = self::parse_single_hand($hand);
            if ($question) {
                $questions[] = $question;
            }
        }
        
        return $questions;
    }
    
    private static function parse_single_hand($hand_text) {
        // Initialize the question structure
        $question = [
            'hand' => [
                'spades' => '',
                'hearts' => '',
                'diamonds' => '',
                'clubs' => ''
            ],
            'bidding' => [
                'dealer' => '',
                'sequence' => []
            ],
            'options' => [],
            'correct' => '',
            'explanation' => '',
            'fullHand' => [
                'north' => [
                    'spades' => '',
                    'hearts' => '',
                    'diamonds' => '',
                    'clubs' => ''
                ],
                'east' => [
                    'spades' => '',
                    'hearts' => '',
                    'diamonds' => '',
                    'clubs' => ''
                ],
                'south' => [
                    'spades' => '',
                    'hearts' => '',
                    'diamonds' => '',
                    'clubs' => ''
                ],
                'west' => [
                    'spades' => '',
                    'hearts' => '',
                    'diamonds' => '',
                    'clubs' => ''
                ]
            ]
        ];
        
        // Extract cards section
        if (preg_match('/Cards:(.*?)Dealer:/s', $hand_text, $cards_match)) {
            $cards_section = $cards_match[1];
            
            // Extract North's cards
            if (preg_match('/North:\s*([A-Z0-9]+)\s*([A-Z0-9]+)\s*([A-Z0-9]+)\s*([A-Z0-9]+)/s', $cards_section, $north_match)) {
                $question['fullHand']['north']['spades'] = $north_match[1];
                $question['fullHand']['north']['hearts'] = $north_match[2];
                $question['fullHand']['north']['diamonds'] = $north_match[3];
                $question['fullHand']['north']['clubs'] = $north_match[4];
            }
            
            // Extract East's cards
            if (preg_match('/East:\s*([A-Z0-9]+)\s*([A-Z0-9]+)\s*([A-Z0-9]+)\s*([A-Z0-9]+)/s', $cards_section, $east_match)) {
                $question['fullHand']['east']['spades'] = $east_match[1];
                $question['fullHand']['east']['hearts'] = $east_match[2];
                $question['fullHand']['east']['diamonds'] = $east_match[3];
                $question['fullHand']['east']['clubs'] = $east_match[4];
            }
            
            // Extract South's cards
            if (preg_match('/South:\s*([A-Z0-9]+)\s*([A-Z0-9]+)\s*([A-Z0-9]+)\s*([A-Z0-9]+)/s', $cards_section, $south_match)) {
                $question['hand']['spades'] = $south_match[1];
                $question['hand']['hearts'] = $south_match[2];
                $question['hand']['diamonds'] = $south_match[3];
                $question['hand']['clubs'] = $south_match[4];
                
                // Also store in fullHand
                $question['fullHand']['south']['spades'] = $south_match[1];
                $question['fullHand']['south']['hearts'] = $south_match[2];
                $question['fullHand']['south']['diamonds'] = $south_match[3];
                $question['fullHand']['south']['clubs'] = $south_match[4];
            }
            
            // Extract West's cards
            if (preg_match('/West:\s*([A-Z0-9]+)\s*([A-Z0-9]+)\s*([A-Z0-9]+)\s*([A-Z0-9]+)/s', $cards_section, $west_match)) {
                $question['fullHand']['west']['spades'] = $west_match[1];
                $question['fullHand']['west']['hearts'] = $west_match[2];
                $question['fullHand']['west']['diamonds'] = $west_match[3];
                $question['fullHand']['west']['clubs'] = $west_match[4];
            }
        }
        
        // Extract dealer
        if (preg_match('/Dealer:\s*([NSEW])/', $hand_text, $dealer_match)) {
            $question['bidding']['dealer'] = $dealer_match[1];
        }
        
        // Extract bidding sequence
        if (preg_match('/Bidding:(.*?)Question:/s', $hand_text, $bidding_match)) {
            $bidding_section = $bidding_match[1];
            $bidding_lines = explode("\n", trim($bidding_section));
            
            $sequence = [];
            $current_row = [];
            
            foreach ($bidding_lines as $line) {
                $line = trim($line);
                if (empty($line)) continue;
                
                if (preg_match('/([NSEW]):\s*(.+)/', $line, $bid_match)) {
                    $position = $bid_match[1];
                    $bid = $bid_match[2];
                    
                    // Add to current row based on position
                    switch ($position) {
                        case 'N':
                            $current_row[1] = $bid;
                            break;
                        case 'E':
                            $current_row[2] = $bid;
                            break;
                        case 'S':
                            $current_row[3] = $bid;
                            break;
                        case 'W':
                            $current_row[0] = $bid;
                            break;
                    }
                    
                    // If we have a complete row, add it to the sequence
                    if (count($current_row) == 4) {
                        $sequence[] = array_values($current_row);
                        $current_row = [];
                    }
                }
            }
            
            // Add any remaining bids
            if (!empty($current_row)) {
                // Fill in missing positions with "Pass"
                for ($i = 0; $i < 4; $i++) {
                    if (!isset($current_row[$i])) {
                        $current_row[$i] = "?";
                    }
                }
                $sequence[] = array_values($current_row);
            }
            
            $question['bidding']['sequence'] = $sequence;
        }
        
        // Extract question and options
        if (preg_match('/Question:(.*?)Does South bid\s+(.*?)Solution:/s', $hand_text, $question_match)) {
            $options_text = $question_match[2];
            
            // Extract options
            preg_match_all('/([a-d])\)\s*([^a-d\)]+)/i', $options_text, $options_matches, PREG_SET_ORDER);
            
            $options = [];
            foreach ($options_matches as $option_match) {
                $options[] = [
                    'id' => strtolower($option_match[1]),
                    'text' => trim($option_match[2])
                ];
            }
            
            $question['options'] = $options;
        }
        
        // Extract solution
        if (preg_match('/Solution:(.*?)South bids\s+([a-d])\)(.*?)(?:\-{10,}|$)/s', $hand_text, $solution_match)) {
            $question['correct'] = strtolower($solution_match[2]);
            $question['explanation'] = trim($solution_match[3]);
        }
        
        // Validate that we have the minimum required data
        if (empty($question['hand']['spades']) || empty($question['options']) || empty($question['correct'])) {
            error_log('Incomplete hand data: ' . substr($hand_text, 0, 100) . '...');
            return null;
        }
        
        return $question;
    }
}
