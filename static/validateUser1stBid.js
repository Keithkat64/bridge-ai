function validateUser1stBid(user1stBid, responderHand) {
    // Get the number of hearts and spades from responderHand
    const responderHearts = responderHand["♥"].length;
    const responderSpades = responderHand["♠"].length;

    // Check if this is a Stayman hand
    if (responderHearts < 5 && responderSpades < 5) {
        // Stayman hand
        if (user1stBid === "2C") {
            return true;
        } else {
            showModal("Keith thinks this is a Stayman hand. Please bid 2C.");
            return false;
        }
    } else {
        // Check for transfer to spades
        if (responderSpades > 4) {
            // Transfer to spades
            if (user1stBid === "2H") {
                return true;
            } else {
                showModal("With 5+ spades, you should transfer by bidding 2H. Please try again.");
                return false;
            }
        } else if (responderHearts > 4) {
            // Transfer to hearts
            if (user1stBid === "2D") {
                return true;
            } else {
                showModal("With 5+ hearts, you should transfer by bidding 2D. Please try again.");
                return false;
            }
        }
    }
    
    // If we get here, something unexpected happened
    showModal("Invalid hand configuration");
    return false;
}

// Export the function for use in other modules
window.validateUser1stBid = validateUser1stBid;
