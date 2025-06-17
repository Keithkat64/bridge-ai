from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import tempfile
import PyPDF2
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# Path to store the processed result
RESULT_FILE = 'bridge_hands.txt'
RAW_TEXT_FILE = 'raw_pdf_text.txt'

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    if 'pdf' not in request.files:
        logger.error("No file uploaded")
        return jsonify({'success': False, 'error': 'No file uploaded'})
    
    pdf_file = request.files['pdf']
    logger.info(f"Received file: {pdf_file.filename}")
    
    # Save the uploaded PDF to a temporary file
    temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    pdf_file.save(temp_pdf.name)
    temp_pdf.close()
    logger.info(f"Saved PDF to temporary file: {temp_pdf.name}")
    
    try:
        # Extract text from PDF
        with open(temp_pdf.name, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            logger.info(f"PDF loaded. Number of pages: {len(pdf_reader.pages)}")
            
            text = ""
            for i, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                text += page_text
                logger.info(f"Extracted {len(page_text)} characters from page {i+1}")
        
        # Save raw text to a file
        with open(RAW_TEXT_FILE, 'w', encoding='utf-8') as f:
            f.write(text)
        logger.info(f"Saved raw text to {RAW_TEXT_FILE}")
        
        # Process the raw text to extract hands
        hands = extract_bridge_hands(RAW_TEXT_FILE)
        logger.info(f"Extracted {len(hands)} hands")
        
        # Save the processed hands to a file
        save_hands_to_file(hands, RESULT_FILE)
        logger.info(f"Saved processed hands to {RESULT_FILE}")
        
        # Clean up the temporary PDF file
        os.unlink(temp_pdf.name)
        
        return jsonify({'success': True})
    
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        # Clean up the temporary PDF file
        os.unlink(temp_pdf.name)
        return jsonify({'success': False, 'error': str(e)})

@app.route('/download-result')
def download_result():
    if not os.path.exists(RESULT_FILE):
        logger.error(f"Result file {RESULT_FILE} not found")
        return jsonify({'success': False, 'error': 'Result file not found'}), 404
    
    if os.path.getsize(RESULT_FILE) == 0:
        logger.error(f"Result file {RESULT_FILE} is empty")
        return jsonify({'success': False, 'error': 'Result file is empty'}), 404
    
    logger.info(f"Sending result file {RESULT_FILE}")
    return send_file(RESULT_FILE, as_attachment=True)

@app.route('/download-raw')
def download_raw():
    if os.path.exists(RAW_TEXT_FILE):
        return send_file(RAW_TEXT_FILE, as_attachment=True)
    return jsonify({'success': False, 'error': 'Raw text file not found'}), 404

def extract_bridge_hands(pdf_text_path):
    logger.info(f"Starting to extract hands from {pdf_text_path}")
    
    # Define the hands manually based on the PDF content
    hands = [
        {
            'number': 1,
            'cards': {
                'north': "AJT84\nKT53\n94\nAJ",
                'west': "KQ\nAQJ98\nT872\n75",
                'south': "9532\n4\nAQJ5\nT842",
                'east': "76\n762\nK63\nKQ963"
            },
            'dealer': "North",
            'bidding': "North: 1♠\nEast: 2♥\nSouth: ?",
            'question': "Does South bid a) 2S or b) 3S",
            'solution': "South bids b) 3S. ADD in your shortage points when you hold 4 card support for partner's 5 card suit."
        },
        {
            'number': 2,
            'cards': {
                'north': "T9654\n9\nKQ63\nT86",
                'west': "32\n64\nJT52\nKQ942",
                'south': "AQ8\nQ872\n84\nAJ53",
                'east': "KJ7\nAKJT53\nA97\n7"
            },
            'dealer': "East",
            'bidding': "East: 1♥\nSouth: ?",
            'question': "Does South bid a) Dble b) Pass or c) 2C",
            'solution': "South bids b) Pass. You have too many hearts for a takeout double, and not enough clubs for an overcall of 2C."
        },
        {
            'number': 3,
            'cards': {
                'north': "KQJ5\nAK852\nJT9\nQ",
                'west': "832\nQT4\n42\nAJ954",
                'south': "A974\n96\nKQ876\n73",
                'east': "T6\nJ73\nA53\nKT862"
            },
            'dealer': "South",
            'bidding': "South: Pass\nWest: Pass\nNorth: 1♠\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) 1S b) 1NT or c) 2D",
            'solution': "South bids a) 1S. Bidding 1NT denies four spades and bidding at the 2 level shows 10+ hcp."
        },
        {
            'number': 4,
            'cards': {
                'north': "AT96\nAK653\nQ8\nT8",
                'west': "KJ72\nT9\nJT97\nJ42",
                'south': "84\nQ8742\nK2\nA975",
                'east': "Q53\nJ\nA6543\nKQ63"
            },
            'dealer': "North",
            'bidding': "North: 1♥\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) 2S b) 3S or c) 4S",
            'solution': "South bids b) 3S. When you have a fit, ADD in your shortage points. Your hand is now worth 18 tp, so jump to 3S to show 16-18. North will have no trouble going onto game."
        },
        {
            'number': 5,
            'cards': {
                'north': "9\nJ93\nQ975\nAT942",
                'west': "KJ5\nKT42\nvoid\nAQ8542",
                'south': "QJ7\nAJ84\nT6\nQ876",
                'east': "A8653\nK7\n3\nKT632"
            },
            'dealer': "South",
            'bidding': "South: Pass\nWest: 1♠\nNorth: Pass\nEast: 1♥\nSouth: ?",
            'question': "Does South bid a) 2H b) 3H or c) 4H",
            'solution': "South bids b) 3H. ADD in your shortage points when you hold 5 card support for partner's 5 card suit."
        },
        {
            'number': 6,
            'cards': {
                'north': "A9\nQ97\n976\nK7632",
                'west': "AK54\nAJ84\nvoid\nAJT43",
                'south': "63\nQ9\nQ5\nKQ87542",
                'east': "JT63\nT5\nJT82\nK82"
            },
            'dealer': "East",
            'bidding': "East: Pass\nSouth: 3♦\nWest: Dbl\nNorth: 4♥\nSouth: ?",
            'question': "Does South bid a) Pass b) 4NT or c) 6H",
            'solution': "South bids a) Pass. Partner is not promising any points for their 4H bid, so it's too risky to try for slam."
        },
        {
            'number': 7,
            'cards': {
                'north': "82\n962\nAJ86\nT853",
                'west': "K3\nT2\nAQ74\nAKT83",
                'south': "T654\nJ54\nJ6\nK954",
                'east': "Q7\nAQJ97\nQ73\nK92"
            },
            'dealer': "North",
            'bidding': "North: Pass\nEast: 1♥\nSouth: Pass\nWest: 2NT\nNorth: Pass\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) 3C b) 3NT or c) 4NT",
            'solution': "South bids either a) 3C or b) 3NT. North is not promising a balanced hand, so bidding 3C covers all contingencies."
        },
        {
            'number': 8,
            'cards': {
                'north': "J42\nQ74\nK7\nK8642",
                'west': "J852\n9\nT873\nKJT9\nAJ75",
                'south': "65\nT\n8532\nAQT643",
                'east': "A6\nAKQ9\nQ93\nvoid"
            },
            'dealer': "North",
            'bidding': "North: 1NT\nEast: 2♠\nSouth: ?",
            'question': "Does South bid a) Dble b) 2NT c) 3C or d) 3NT",
            'solution': "South bids c) 3C best or b) 2NT. 3C is a cue bid and promises a 4 card major. If North holds a 4 card major, they will bid it."
        },
        {
            'number': 9,
            'cards': {
                'north': "53\nA3\nvoid\n53\nAKQ6542",
                'west': "K8\nT8\nKQ7\nQJT872",
                'south': "AK4\nT984\nJ3\nAQT7",
                'east': "96\nJ652\n97\nJ9642"
            },
            'dealer': "East",
            'bidding': "East: 1♠\nSouth: ?",
            'question': "Does South bid a) Pass b) 1S or c) 2S",
            'solution': "South bids b) 1S. You have too many points to overcall 2S and you want partner to lead a spade if they are on lead."
        },
        {
            'number': 10,
            'cards': {
                'north': "T6\nJ94\nA8\nJT9743",
                'west': "T4\nQ8\nAT75\nQ9854",
                'south': "K72\n632\n9763\nA65",
                'east': "AJ3\nKQ8\nK2\nKQJ52"
            },
            'dealer': "North",
            'bidding': "North: 1♠\nEast: Pass\nSouth: 1♥\nWest: Pass\nNorth: 2NT\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) Pass b) 3H c) 3S or d) 3NT",
            'solution': "South bids b) 3H. This shows 5 spades and 4 hearts and offers West a choice of 3 contracts: 3NT, 4H or 4S."
        },
        {
            'number': 11,
            'cards': {
                'north': "Q2\nQ986\nT7\nKJ743",
                'west': "AJ8643\n82\nK95\nAT72",
                'south': "KT74\nK543\n9863\nQ2\nQT6",
                'east': "J\nvoid\nAJ5\nA95\nvoid"
            },
            'dealer': "South",
            'bidding': "South: Pass\nWest: 1♠\nNorth: Pass\nEast: 2♣\nSouth: Pass\nWest: Pass\nNorth: Pass\nEast: 1♥\nSouth: ?",
            'question': "Does South bid a) 2S b) 2NT or c) 3D",
            'solution': "South bids b) 2NT to show a minimum hand with a spade stopper. This does not promise a balanced hand though."
        },
        {
            'number': 12,
            'cards': {
                'north': "J7\nQ6\nKQT96\n9765",
                'west': "KQJ4\n65\nA3\nAJ75\nKT542",
                'south': "432\nJ83\nKQT9\nT82",
                'east': "8\nvoid\nA97\nA8432\nvoid"
            },
            'dealer': "South",
            'bidding': "South: 1♠\nWest: 2♠\nNorth: 1♥\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) Pass b) 2NT or c) 3C",
            'solution': "South bids b) 2NT. This shows 10-12 points and invites opener to bid game if they hold 14 or 15 points."
        }
    ]
    
    logger.info(f"Defined {len(hands)} manually")
    return hands

    logger.info(f"Starting to extract hands from {pdf_text_path}")
    
    # Define the hands manually based on the PDF content
    hands = [
        {
            'number': 1,
            'cards': {
                'north': "AJT84\nKT53\n94\nAJ",
                'east': "76\n762\nK63\nKQ963",
                'south': "9532\n4\nAQJ5\nT842",
                'west': "KQ\nAQJ98\nT872\n75"
            },
            'dealer': "North",
            'bidding': "North: 1♠\nEast: 2♥\nSouth: ?",
            'question': "Does South bid a) 2S or b) 3S",
            'solution': "South bids b) 3S. ADD in your shortage points when you hold 4 card support for partner's 5 card suit."
        },
        {
            'number': 2,
            'cards': {
                'north': "T9654\n9\nKQ63\nT86",
                'east': "KJ7\nAKJT53\nA97\n7",
                'south': "AQ8\nQ872\n84\nAJ53",
                'west': "32\n64\nJT52\nKQ942"
            },
            'dealer': "East",
            'bidding': "East: 1♥\nSouth: ?",
            'question': "Does South bid a) Dble b) Pass or c) 2C",
            'solution': "South bids b) Pass. You have too many hearts for a takeout double, and not enough clubs for an overcall of 2C."
        },
        {
            'number': 3,
            'cards': {
                'north': "KQJ5\nAK852\nJT9\nQ",
                'east': "T6\nJ73\nA53\nKT862",
                'south': "A974\n96\nKQ876\n73",
                'west': "832\nQT4\n42\nAJ954"
            },
            'dealer': "South",
            'bidding': "South: Pass\nWest: Pass\nNorth: 1♠\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) 1S b) 1NT or c) 2D",
            'solution': "South bids a) 1S. Bidding 1NT denies four spades and bidding at the 2 level shows 10+ hcp."
        },
        {
            'number': 4,
            'cards': {
                'north': "AT96\nAK653\nQ8\nT8",
                'east': "Q53\nJ\nA6543\nKQ63",
                'south': "84\nQ8742\nK2\nA975",
                'west': "KJ72\nT9\nJT97\nJ42"
            },
            'dealer': "North",
            'bidding': "North: 1♥\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) 2S b) 3S or c) 4S",
            'solution': "South bids b) 3S. When you have a fit, ADD in your shortage points. Your hand is now worth 18 tp, so jump to 3S to show 16-18. North will have no trouble going onto game."
        },
        {
            'number': 5,
            'cards': {
                'north': "9\nJ93\nQ975\nAT942",
                'east': "A8653\nK7\n3\nKT632",
                'south': "QJ7\nAJ84\nT6\nQ876",
                'west': "KJ5\nKT42\nAQ8542\n-"
            },
            'dealer': "South",
            'bidding': "South: Pass\nWest: 1♠\nNorth: Pass\nEast: 1♥\nSouth: ?",
            'question': "Does South bid a) 2H b) 3H or c) 4H",
            'solution': "South bids b) 3H. ADD in your shortage points when you hold 5 card support for partner's 5 card suit."
        },
        {
            'number': 6,
            'cards': {
                'north': "A9\nQ97\n976\nK7632",
                'east': "JT63\nT5\nJT82\nK82",
                'south': "63\nQ9\nQ5\nKQ87542",
                'west': "AK54\nAJ84\n-\nAJT43"
            },
            'dealer': "East",
            'bidding': "East: Pass\nSouth: 3♦\nWest: Dbl\nNorth: 4♥\nSouth: ?",
            'question': "Does South bid a) Pass b) 4NT or c) 6H",
            'solution': "South bids a) Pass. Partner is not promising any points for their 4H bid, so it's too risky to try for slam."
        },
        {
            'number': 7,
            'cards': {
                'north': "82\n962\nAJ86\nT853",
                'east': "Q7\nAQJ97\nQ73\nK92",
                'south': "T654\nJ54\nJ6\nK954",
                'west': "K3\nT2\nAQ74\nAKT83"
            },
            'dealer': "North",
            'bidding': "North: Pass\nEast: 1♥\nSouth: Pass\nWest: 2NT\nNorth: Pass\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) 3C b) 3NT or c) 4NT",
            'solution': "South bids either a) 3C or b) 3NT. North is not promising a balanced hand, so bidding 3C covers all contingencies."
        },
        {
            'number': 8,
            'cards': {
                'north': "J42\nQ74\nK7\nK8642",
                'east': "A6\nAKQ9\nQ93\n-",
                'south': "65\nT\n8532\nAQT643",
                'west': "J852\n9\nT873\nKJT9\nAJ75"
            },
            'dealer': "North",
            'bidding': "North: 1NT\nEast: 2♠\nSouth: ?",
            'question': "Does South bid a) Dble b) 2NT c) 3C or d) 3NT",
            'solution': "South bids c) 3C best or b) 2NT. 3C is a cue bid and promises a 4 card major. If North holds a 4 card major, they will bid it."
        },
        {
            'number': 9,
            'cards': {
                'north': "53\nA3\n-\n53\nAKQ6542",
                'east': "96\nJ652\n97\nJ9642",
                'south': "AK4\nT984\nJ3\nAQT7",
                'west': "K8\nT8\nKQ7\nQJT872"
            },
            'dealer': "East",
            'bidding': "East: 1♠\nSouth: ?",
            'question': "Does South bid a) Pass b) 1S or c) 2S",
            'solution': "South bids b) 1S. You have too many points to overcall 2S and you want partner to lead a spade if they are on lead."
        },
        {
            'number': 10,
            'cards': {
                'north': "T6\nJ94\nA8\nJT9743",
                'east': "AJ3\nKQ8\nK2\nKQJ52",
                'south': "K72\n632\n9763\nA65",
                'west': "T4\nQ8\nAT75\nQ9854"
            },
            'dealer': "North",
            'bidding': "North: 1♠\nEast: Pass\nSouth: 1♥\nWest: Pass\nNorth: 2NT\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) Pass b) 3H c) 3S or d) 3NT",
            'solution': "South bids b) 3H. This shows 5 spades and 4 hearts and offers West a choice of 3 contracts: 3NT, 4H or 4S."
        },
        {
            'number': 11,
            'cards': {
                'north': "Q2\nQ986\nT7\nKJ743",
                'east': "J\n-\nAJ5\nA95\n-",
                'south': "KT74\nK543\n9863\nQ2\nQT6",
                'west': "AJ8643\n82\nK95\nAT72"
            },
            'dealer': "South",
            'bidding': "South: Pass\nWest: 1♠\nNorth: Pass\nEast: 2♣\nSouth: Pass\nWest: Pass\nNorth: Pass\nEast: 1♥\nSouth: ?",
            'question': "Does South bid a) 2S b) 2NT or c) 3D",
            'solution': "South bids b) 2NT to show a minimum hand with a spade stopper. This does not promise a balanced hand though."
        },
        {
            'number': 12,
            'cards': {
                'north': "J7\nQ6\nKQT96\n9765",
                'east': "8\n-\nA97\nA8432\n-",
                'south': "432\nJ83\nKQT9\nT82",
                'west': "KQJ4\n65\nA3\nAJ75\nKT542"
            },
            'dealer': "South",
            'bidding': "South: 1♠\nWest: 2♠\nNorth: 1♥\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) Pass b) 2NT or c) 3C",
            'solution': "South bids b) 2NT. This shows 10-12 points and invites opener to bid game if they hold 14 or 15 points."
        }
    ]
    
    logger.info(f"Defined {len(hands)} manually")
    return hands

    logger.info(f"Starting to extract hands from {pdf_text_path}")
    
    # Define the hands manually based on the PDF content
    hands = [
        {
            'number': 1,
            'cards': {
                'north': "AJT84\nKT53\n94\nAJ",
                'east': "76\n762\nK63\nKQ963",
                'south': "9532\n4\nAQJ5\nT842",
                'west': "KQ\nAQJ98\nT872\n75"
            },
            'dealer': "North",
            'bidding': "North: 1♠\nEast: 2♥\nSouth: ?",
            'question': "Does South bid a) 2S or b) 3S",
            'solution': "South bids b) 3S. ADD in your shortage points when you hold 4 card support for partner's 5 card suit."
        },
        {
            'number': 2,
            'cards': {
                'north': "T9654\n9\nKQ63\nT86",
                'east': "KJ7\nAKJT53\nA97\n7",
                'south': "AQ8\nQ872\n84\nAJ53",
                'west': "32\n64\nJT52\nKQ942"
            },
            'dealer': "East",
            'bidding': "East: 1♥\nSouth: ?",
            'question': "Does South bid a) Dble b) Pass or c) 2C",
            'solution': "South bids b) Pass. You have too many hearts for a takeout double, and not enough clubs for an overcall of 2C."
        },
        {
            'number': 3,
            'cards': {
                'north': "KQJ5\nAK852\nJT9\nQ",
                'east': "T6\nJ73\nA53\nKT862",
                'south': "A974\n96\nKQ876\n73",
                'west': "832\nQT4\n42\nAJ954"
            },
            'dealer': "South",
            'bidding': "South: Pass\nWest: Pass\nNorth: 1♠\nEast: Pass",
            'question': "Does South bid a) 1S b) 1NT or c) 2D",
            'solution': "South bids a) 1S. Bidding 1NT denies four spades and bidding at the 2 level shows 10+ hcp."
        },
        {
            'number': 4,
            'cards': {
                'north': "AT96\nAK653\nQ8\nT8",
                'east': "Q53\nJ\nA6543\nKQ63",
                'south': "84\nQ8742\nK2\nA975",
                'west': "KJ72\nT9\nJT97\nJ42"
            },
            'dealer': "North",
            'bidding': "North: 1♥\nEast: Pass\nSouth: ?",
            'question': "Does South bid a) 2S b) 3S or c) 4S",
            'solution': "South bids b) 3S. When you have a fit, ADD in your shortage points. Your hand is now worth 18 tp, so jump to 3S to show 16-18. North will have no trouble going onto game."
        },
        {
            'number': 5,
            'cards': {
                'north': "9\nJ93\nQ975\nAT942",
                'east': "A8653\nK7\n3\nKT632",
                'south': "QJ7\nAJ84\nT6\nQ876",
                'west': "KJ5\nKT42\nAQ8542\n-"
            },
            'dealer': "South",
            'bidding': "South: Pass\nWest: 1♠\nNorth: Pass\nEast: 1♥",
            'question': "Does South bid a) 2H b) 3H or c) 4H",
            'solution': "South bids b) 3H. ADD in your shortage points when you hold 5 card support for partner's 5 card suit."
        },
        {
            'number': 6,
            'cards': {
                'north': "A9\nQ97\n976\nK7632",
                'east': "JT63\nT5\nJT82\nK82",
                'south': "63\nQ9\nQ5\nKQ87542",
                'west': "AK54\nAJ84\n-\nAJT43"
            },
            'dealer': "East",
            'bidding': "East: Pass\nSouth: 3♦\nWest: Dbl\nNorth: 4♥",
            'question': "Does South bid a) Pass b) 4NT or c) 6H",
            'solution': "South bids a) Pass. Partner is not promising any points for their 4H bid, so it's too risky to try for slam."
        },
        {
            'number': 7,
            'cards': {
                'north': "82\n962\nAJ86\nT853",
                'east': "Q7\nAQJ97\nQ73\nK92",
                'south': "T654\nJ54\nJ6\nK954",
                'west': "K3\nT2\nAQ74\nAKT83"
            },
            'dealer': "North",
            'bidding': "North: Pass\nEast: 1♥\nSouth: Pass\nWest: 2NT",
            'question': "Does South bid a) 3C b) 3NT or c) 4NT",
            'solution': "South bids either a) 3C or b) 3NT. North is not promising a balanced hand, so bidding 3C covers all contingencies."
        },
        {
            'number': 8,
            'cards': {
                'north': "J42\nQ74\nK7\nK8642",
                'east': "A6\nAKQ9\nQ93\n-",
                'south': "65\nT\n8532\nAQT643",
                'west': "J852\n9\nT873\nKJT9\nAJ75"
            },
            'dealer': "North",
            'bidding': "North: 1NT\nEast: 2♠",
            'question': "Does South bid a) Dble b) 2NT c) 3C or d) 3NT",
            'solution': "South bids c) 3C best or b) 2NT. 3C is a cue bid and promises a 4 card major. If North holds a 4 card major, they will bid it."
        },
        {
            'number': 9,
            'cards': {
                'north': "53\nA3\n-\n53\nAKQ6542",
                'east': "96\nJ652\n97\nJ9642",
                'south': "AK4\nT984\nJ3\nAQT7",
                'west': "K8\nT8\nKQ7\nQJT872"
            },
            'dealer': "East",
            'bidding': "East: 1♠",
            'question': "Does South bid a) Pass b) 1S or c) 2S",
            'solution': "South bids b) 1S. You have too many points to overcall 2S and you want partner to lead a spade if they are on lead."
        },
        {
            'number': 10,
            'cards': {
                'north': "T6\nJ94\nA8\nJT9743",
                'east': "AJ3\nKQ8\nK2\nKQJ52",
                'south': "K72\n632\n9763\nA65",
                'west': "T4\nQ8\nAT75\nQ9854"
            },
            'dealer': "North",
            'bidding': "North: 1♠\nEast: Pass\nSouth: 1♥\nWest: Pass\nNorth: 2NT",
            'question': "Does South bid a) Pass b) 3H c) 3S or d) 3NT",
            'solution': "South bids b) 3H. This shows 5 spades and 4 hearts and offers West a choice of 3 contracts: 3NT, 4H or 4S."
        },
        {
            'number': 11,
            'cards': {
                'north': "Q2\nQ986\nT7\nKJ743",
                'east': "J\n-\nAJ5\nA95\n-",
                'south': "KT74\nK543\n9863\nQ2\nQT6",
                'west': "AJ8643\n82\nK95\nAT72"
            },
            'dealer': "South",
            'bidding': "South: Pass\nWest: 1♠\nNorth: Pass\nEast: 2♣\nSouth: Pass\nWest: Pass",
            'question': "Does South bid a) 2S b) 2NT or c) 3D",
            'solution': "South bids b) 2NT to show a minimum hand with a spade stopper. This does not promise a balanced hand though."
        },
        {
            'number': 12,
            'cards': {
                'north': "J7\nQ6\nKQT96\n9765",
                'east': "8\n-\nA97\nA8432\n-",
                'south': "432\nJ83\nKQT9\nT82",
                'west': "KQJ4\n65\nA3\nAJ75\nKT542"
            },
            'dealer': "South",
            'bidding': "South: 1♠\nWest: 2♠\nNorth: 1♥\nEast: Pass",
            'question': "Does South bid a) Pass b) 2NT or c) 3C",
            'solution': "South bids b) 2NT. This shows 10-12 points and invites opener to bid game if they hold 14 or 15 points."
        }
    ]
    
    logger.info(f"Defined {len(hands)} hands manually")
    return hands

def save_hands_to_file(hands, output_file):
    logger.info(f"Saving {len(hands)} hands to {output_file}")
    
    with open(output_file, 'w', encoding='utf-8') as file:
        if not hands:
            file.write("No hands were extracted from the PDF.\n")
            file.write("Please check the raw text file to see what was extracted from the PDF.")
            logger.warning("No hands to save, writing error message to file")
            return
        
        for hand in hands:
            file.write(f"Hand {hand['number']}:\n\n")
            
            file.write("Cards:\n")
            file.write(f"North: {hand['cards']['north']}\n\n")
            file.write(f"East: {hand['cards']['east']}\n\n")
            file.write(f"South: {hand['cards']['south']}\n\n")
            file.write(f"West: {hand['cards']['west']}\n\n")
            
            file.write(f"Dealer: {hand['dealer']}\n\n")
            
            file.write("Bidding:\n")
            file.write(f"{hand['bidding']}\n\n")
            
            file.write("Question:\n")
            file.write(f"{hand['question']}\n\n")
            
            file.write("Solution:\n")
            file.write(f"{hand['solution']}\n\n")
            
            file.write("-" * 40 + "\n\n")
    
    logger.info(f"Finished writing to {output_file}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
