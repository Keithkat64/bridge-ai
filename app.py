from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import os
import random

app = Flask(__name__)
CORS(app)

SUITS = ['spades', 'hearts', 'diamonds', 'clubs']
RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']
HCP_VALUES = {'A': 4, 'K': 3, 'Q': 2, 'J': 1}


def generate_deck():
    return [(rank, suit) for suit in SUITS for rank in RANKS]


def deal_hand(deck, excluded_cards=set()):
    hand = {suit: [] for suit in SUITS}
    while sum(len(cards) for cards in hand.values()) < 13:
        card = random.choice(deck)
        if card in excluded_cards:
            continue
        hand[card[1]].append(card[0])
        excluded_cards.add(card)
    for suit in SUITS:
        hand[suit].sort(key=lambda r: RANKS.index(r))
    return hand, excluded_cards


def calculate_hcp(hand):
    return sum(HCP_VALUES.get(rank, 0) for suit in SUITS for rank in hand[suit])


def is_stayman_hand(hand):
    hcp = calculate_hcp(hand)
    return hcp >= 8 and (len(hand['spades']) == 4 or len(hand['hearts']) == 4)


def is_transfer_hand(hand):
    return len(hand['spades']) > 4 or len(hand['hearts']) > 4


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/generate-hands')
def generate_hands():
    deck = generate_deck()
    opener, used = deal_hand(deck)
    responder, used = deal_hand(deck, used)

    # Validate responder hand
    tries = 0
    while not (is_stayman_hand(responder) or is_transfer_hand(responder)):
        responder, used = deal_hand(deck, set(used))
        tries += 1
        if tries > 20:
            break

    return jsonify({"opener": opener, "responder": responder})


@app.route('/api/validate-bid', methods=['POST'])
def validate_bid():
    data = request.get_json()
    return jsonify({"valid": False, "message": "Bid validation logic to be wired in."})


@app.route('/api/next-bid', methods=['POST'])
def next_bid():
    data = request.get_json()
    return jsonify({"nextBid": "stub"})


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
