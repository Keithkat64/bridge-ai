function validateUser5thBid(user5thbid, responderHand, open5thbid) {
    // Convert bid to uppercase for consistency
    const upperBid = user5thbid.toUpperCase();
    
    // Define valid fifth bids
    const validFifthBids = [
        "PASS",
        "6C", "6D", "6H", "6S", "6NT",
        "7C", "7D", "7H", "7S", "7NT"
    ];
    
    // Check if bid is in valid list
    if (!validFifthBids.includes(upperBid)) {
        showModal("Keith thinks you have a better bid");
        return false;
    }

    // If it's not PASS, ensure it's higher than Keith's bid
    if (upperBid !== "PASS") {
        const bidLevels = {
            "5H": 0,  // Add this to compare with Keith's 5H bid
            "6C": 1, "6D": 2, "6H": 3, "6S": 4, "6NT": 5,
            "7C": 6, "7D": 7, "7H": 8, "7S": 9, "7NT": 10
        };

        if (bidLevels[upperBid] <= bidLevels[open5thbid]) {
            showModal("Your bid must be higher than Keith's bid");
            return false;
        }
    }

    // Set global flag and return true
    window.validuser5thbid = true;
    return true;
}

// Make it available globally
window.validateUser5thBid = validateUser5thBid;
