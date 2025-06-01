function calculateShortagePoints(hand) {
    let shortagePoints = 0;
    
    // Check each suit (hearts, spades, diamonds, clubs)
    for (let suit in hand) {
        // Get the cards in the suit
        let cardsInSuit = hand[suit];
        
        // Count cards in suit
        let cardCount = cardsInSuit.length;
        
        // Calculate base shortage points
        if (cardCount === 0) {  // Void
            shortagePoints += 5;
        } else if (cardCount === 1) {  // Singleton
            shortagePoints += 3;
            
            // Add extra points for honor singletons
            let singletonCard = cardsInSuit[0];
            if (singletonCard === 'A') {
                shortagePoints += 3;
            } else if (singletonCard === 'Q') {
                shortagePoints += 1;
            } else if (singletonCard === 'J') {
                shortagePoints += 2;
            }
            // Note: King gets no extra points
            
        } else if (cardCount === 2) {  // Doubleton
            shortagePoints += 1;
        }
    }
    
    return shortagePoints;
}

// Example usage:
const hand = {
    hearts: ['K'],           // singleton K = 3 points
    spades: [],             // void = 5 points
    diamonds: ['2', '3'],   // doubleton = 1 point
    clubs: ['A']            // singleton A = 6 points (3 + 3)
};

const points = calculateShortagePoints(hand);  // Returns 15
