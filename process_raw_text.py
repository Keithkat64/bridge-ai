def extract_bridge_hands():
    # Define Hand 1 with correct positions: North, West, East, South
    hands = [
        {
            'number': 1,
            'cards': {
                'north': {
                    'spades': "AJT84",
                    'hearts': "KT53",
                    'diamonds': "94",
                    'clubs': "AJ"
                },
                'west': {
                    'spades': "KQ",
                    'hearts': "AQJ98",
                    'diamonds': "T872",
                    'clubs': "75"
                },
                'east': {
                    'spades': "76",
                    'hearts': "762",
                    'diamonds': "K63",
                    'clubs': "KQ963"
                },
                'south': {
                    'spades': "9532",
                    'hearts': "4",
                    'diamonds': "AQJ5",
                    'clubs': "T842"
                }
            },
            'dealer': "North",
            'bidding': "North: 1♠\nEast: 2♥\nSouth: ?\nWest: -",
            'question': "Does South bid a) 2S or b) 3S?",
            'solution': "South bids b) 3S. ADD in your shortage points when you hold 4 card support for partner's 5 card suit."
        }
    ]
    
    return hands

def save_hands_to_file(hands, output_file):
    with open(output_file, 'w', encoding='utf-8') as file:
        for hand in hands:
            file.write(f"Hand {hand['number']}:\n\n")
            
            file.write("Cards:\n")
            
            # North
            file.write("North:\n")
            file.write(f"Spades: {hand['cards']['north']['spades']}\n")
            file.write(f"Hearts: {hand['cards']['north']['hearts']}\n")
            file.write(f"Diamonds: {hand['cards']['north']['diamonds']}\n")
            file.write(f"Clubs: {hand['cards']['north']['clubs']}\n\n")
            
            # West
            file.write("West:\n")
            file.write(f"Spades: {hand['cards']['west']['spades']}\n")
            file.write(f"Hearts: {hand['cards']['west']['hearts']}\n")
            file.write(f"Diamonds: {hand['cards']['west']['diamonds']}\n")
            file.write(f"Clubs: {hand['cards']['west']['clubs']}\n\n")
            
            # East
            file.write("East:\n")
            file.write(f"Spades: {hand['cards']['east']['spades']}\n")
            file.write(f"Hearts: {hand['cards']['east']['hearts']}\n")
            file.write(f"Diamonds: {hand['cards']['east']['diamonds']}\n")
            file.write(f"Clubs: {hand['cards']['east']['clubs']}\n\n")
            
            # South
            file.write("South:\n")
            file.write(f"Spades: {hand['cards']['south']['spades']}\n")
            file.write(f"Hearts: {hand['cards']['south']['hearts']}\n")
            file.write(f"Diamonds: {hand['cards']['south']['diamonds']}\n")
            file.write(f"Clubs: {hand['cards']['south']['clubs']}\n\n")
            
            file.write(f"Dealer: {hand['dealer']}\n\n")
            
            file.write("Bidding:\n")
            file.write(f"{hand['bidding']}\n\n")
            
            file.write("Question:\n")
            file.write(f"{hand['question']}\n\n")
            
            file.write("Solution:\n")
            file.write(f"{hand['solution']}\n\n")
            
            file.write("-" * 40 + "\n\n")

# Usage
if __name__ == "__main__":
    output_file = "bridge_hand_1_correct.txt"
    
    print("Extracting bridge hand 1...")
    hands = extract_bridge_hands()
    
    print(f"Saving hand 1 to file...")
    save_hands_to_file(hands, output_file)
    print(f"Hand saved to {output_file}")
    
    input("\nPress Enter to exit...")
