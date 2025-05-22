from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate-hands')
def generate_hands():
    return jsonify({
        "opener": {
            "spades": ["Q", "2"],
            "hearts": ["Q", "9", "5"],
            "diamonds": ["A", "Q", "7", "6"],
            "clubs": ["A", "K", "8", "7"]
        },
        "responder": {
            "spades": ["A", "K", "10", "8", "7", "5", "4", "3"],
            "hearts": ["10"],
            "diamonds": ["9", "8", "3"],
            "clubs": ["Q"]
        }
    })

@app.route('/api/validate-bid', methods=['POST'])
def validate_bid():
    data = request.get_json()
    return jsonify({ "valid": False, "message": "Bid validation logic to be wired in." })

@app.route('/api/next-bid', methods=['POST'])
def next_bid():
    data = request.get_json()
    return jsonify({ "nextBid": "stub" })
