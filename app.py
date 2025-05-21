from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate-hands')
def generate_hands():
    return jsonify({ "status": "stub", "message": "Hand generation to be wired in." })

@app.route('/api/validate-bid', methods=['POST'])
def validate_bid():
    data = request.get_json()
    return jsonify({ "valid": False, "message": "Bid validation logic to be wired in." })

@app.route('/api/next-bid', methods=['POST'])
def next_bid():
    data = request.get_json()
    return jsonify({ "nextBid": "stub" })

if __name__ == '__main__':
    app.run(debug=True)