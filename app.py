from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate-hands')
def generate_hands():
    suits = ['S', 'H', 'D', 'C']
    values = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']

    def generate_hcp(card):
        value = card[:-1] if card[:-1] != '10' else 'T'
        return {'A': 4, 'K': 3, 'Q': 2, 'J': 1}.get(value, 0)

    def generate_balanced_hand():
        deck = [v + s for s in suits for v in values]
        attempts = 0
        while attempts < 10000:
            attempts += 1
            random.shuffle(deck)
            hand = deck[:13]
            suit_counts = {s: 0 for s in suits}
            hcp = 0
            for card in hand:
                suit_counts[card[-1]] += 1
                hcp += generate_hcp(card)
            suit_lengths = sorted(suit_counts.values(), reverse=True)
            is_balanced = suit_lengths in [[4, 3, 3, 3], [4, 4, 3, 2], [5, 3, 3, 2]]
            if is_balanced and 16 <= hcp <= 18:
                return hand
        return []

    def build_responder_hand(used_cards, mode):
        deck = [v + s for s in suits for v in values if v + s not in used_cards]
        attempts = 0
        while attempts < 10000:
            attempts += 1
            random.shuffle(deck)
            hand = deck[:13]
            suit_counts = {'S': [], 'H': [], 'D': [], 'C': []}
            for card in hand:
                suit_counts[card[-1]].append(card[:-1])
            if mode == "Stayman":
                if len(suit_counts['S']) == 4 or len(suit_counts['H']) == 4:
                    return hand
            elif mode == "Transfer":
                if len(suit_counts['S']) >= 5 or len(suit_counts['H']) >= 5:
                    return hand
        return []

    def format_hand(hand):
        sorted_hand = {suit: [] for suit in suits}
        order = {v: i for i, v in enumerate(values)}
        for card in hand:
            suit = card[-1]
            rank = card[:-1]
            sorted_hand[suit].append(rank)
        for suit in sorted_hand:
            sorted_hand[suit].sort(key=lambda r: order[r])
        suit_map = {'S': 'spades', 'H': 'hearts', 'D': 'diamonds', 'C': 'clubs'}
        return {
            suit_map[s]: sorted_hand[s] for s in suits
        }

    opener_hand = generate_balanced_hand()
    responder_hand = build_responder_hand(opener_hand, mode="Stayman")

    return jsonify({
        "opener": format_hand(opener_hand),
        "responder": format_hand(responder_hand)
    })

@app.route('/api/validate-bid', methods=['POST'])
def validate_bid():
    data = request.get_json()
    return jsonify({ "valid": False, "message": "Bid validation logic to be wired in." })

@app.route('/api/next-bid', methods=['POST'])
def next_bid():
    data = request.get_json()
    return jsonify({ "nextBid": "stub" })

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
