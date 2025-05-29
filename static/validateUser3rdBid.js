function validateUser3rdBid(user3rdbid, responderHand, open3rdbid) {
    // Convert bid to uppercase for consistency
    const upperBid = user3rdbid.toUpperCase();
    
    // Define valid third bids
    const validThirdBids = ["PASS", "4H", "4S", "4NT", "5C", "5D", "5NT"];
    
    // Check if bid is in valid list
    if (!validThirdBids.includes(upperBid)) {
        showModal("Keith thinks you have a better bid");
        return false;
    }

    // Set global flag and return true
    window.validuser3rdbid = true;
    return true;
}

// Make it available globally
window.validateUser3rdBid = validateUser3rdBid;
