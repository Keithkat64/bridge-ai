
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from stayman import get_stayman_response

import os
import random

app = Flask(__name__)
CORS(app)

suits = ['♠', '♥', '♦', '♣']
ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
hcp_values = {'A': 4, 'K': 3, 'Q': 2, 'J': 1}

def generate_deck():
    return [(rank, suit) for suit in suits for rank in ranks]

def count_hcp(hand):
    return sum(hcp_values.get(rank, 0) for rank, _ in hand)

def format_hand_by_suit(hand):
    suit_dict = {suit: [] for suit in suits}
    for rank, suit in hand:
        suit_dict[suit].append(rank)
    for suit in suit_dict:
        suit_dict[suit].sort(key=lambda r: ranks[::-1].index(r))
    return suit_dict

def is_balanced_1nt(hand):
    suit_lengths = {suit: 0 for suit in suits}
    for _, suit in hand:
        suit_lengths[suit] += 1
    has_5_card_major = suit_lengths['♠'] >= 5 or suit_lengths['♥'] >= 5
    return not has_5_card_major and max(suit_lengths.values()) <= 5 and min(suit_lengths.values()) >= 2

def generate_valid_opener():
    while True:
        deck = generate_deck()
        random.shuffle(deck)
        opener_hand = deck[:13]
        hcp = count_hcp(opener_hand)
        if 16 <= hcp <= 18 and is_balanced_1nt(opener_hand):
            return opener_hand, deck[13:]

def generate_valid_responder(remaining_deck, opener_cards):
    def is_valid_responder(hand):
        hand_suit_count = {s: 0 for s in suits}
        for rank, suit in hand:
            hand_suit_count[suit] += 1
        hcp = count_hcp(hand)
        return (
            (hcp >= 8 and (hand_suit_count['♠'] == 4 or hand_suit_count['♥'] == 4)) or
            (hand_suit_count['♠'] > 4 or hand_suit_count['♥'] > 4)
        )

    attempts = 0
    while attempts < 500:
        random.shuffle(remaining_deck)
        candidate = remaining_deck[:13]
        if all(card not in opener_cards for card in candidate) and is_valid_responder(candidate):
            return candidate
        attempts += 1
    return remaining_deck[:13]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate-hands')
def generate_hands():
    opener, remaining = generate_valid_opener()
    responder = generate_valid_responder(remaining, opener)

    opener_formatted = format_hand_by_suit(opener)
    responder_formatted = format_hand_by_suit(responder)

    return jsonify({
        "opener": opener_formatted,
        "responder": responder_formatted
    })

@app.route('/api/validate-bid', methods=['POST'])
def validate_bid():
    data = request.get_json()
    return jsonify({"valid": False, "message": "Bid validation logic to be wired in."})

@app.route('/api/next-bid', methods=['POST'])
def next_bid():
    data = request.get_json()
    return jsonify({"nextBid": "stub"})

@app.route('/api/stayman-response', methods=['POST'])
def stayman_response():
    data = request.get_json()
    opener = data.get('opener')
    responder_bid = data.get('responderBid', '2C')
    response = get_stayman_response(opener, responder_bid)
    return jsonify({ "response": response })

from flask import send_from_directory

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
