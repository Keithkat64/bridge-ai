function validateUser5thBid(user5thbid, responderHand, open5thbid) {
    // Convert bid to uppercase for consistency
    const upperBid = user5thbid.toUpperCase();
    
    // Define valid fifth bids
    const validFifthBids = [
        "PASS",
        "5H", "5S",  // Added 5H and 5S as valid bids after Blackwood
        "5NT",       // Asking for kings
        "6C", "6D", "6H", "6S", "6NT",
        "7C", "7D", "7H", "7S", "7NT"
    ];
    
    // Check if bid is in valid list
    if (!validFifthBids.includes(upperBid)) {
        showModal("Keith thinks you have a better bid");
        return false;
    }

    // If it's not PASS, ensure it's a valid progression
    if (upperBid !== "PASS") {
        const bidLevels = {
            "5C": 1, "5D": 2, "5H": 3, "5S": 4, "5NT": 5,
            "6C": 6, "6D": 7, "6H": 8, "6S": 9, "6NT": 10,
            "7C": 11, "7D": 12, "7H": 13, "7S": 14, "7NT": 15
        };

        // Special case: After Blackwood response, allow same-level bids
        if (open5thbid === "5D" && ["5H", "5S", "5NT"].includes(upperBid)) {
            window.validuser5thbid = true;
            return true;
        }

        // For other cases, bid must be higher
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
