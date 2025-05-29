function validateUser4thBid(user4thbid, responderHand, open4thbid) {
    // Convert bid to uppercase for consistency
    const upperBid = user4thbid.toUpperCase();
    
    // Define valid fourth bids
    const validFourthBids = [
        "PASS",
        "5D", "5H", "5S", "5NT",
        "6C", "6D", "6H", "6S", "6NT",
        "7C", "7D", "7H", "7S", "7NT"
    ];
    
    // Check if bid is in valid list
    if (!validFourthBids.includes(upperBid)) {
        showModal("Keith thinks you have a better bid");
        return false;
    }

    // Set global flag and return true
    window.validuser4thbid = true;
    return true;
}

// Make it available globally
window.validateUser4thBid = validateUser4thBid;
