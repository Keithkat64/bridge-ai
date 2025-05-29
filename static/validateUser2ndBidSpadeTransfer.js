function validateUser2ndBidSpadeTransfer(userBid, open2ndbid) {
    const upperBid = userBid.toUpperCase();

    // All valid bids after spade transfer (1NT-2H-2S-?)
    const validBids = [
        "PASS",
        "2NT",
        "3C",
        "3D",
        "3H",
        "3S",
        "3NT",
        "4S",
        "4NT"
    ];

    if (validBids.includes(upperBid)) {
        window.validUser2ndBid = true;
        return true;
    } else {
        showModal("Keith thinks you have a better bid");
        return false;
    }
}

// Make it available globally
window.validateUser2ndBidSpadeTransfer = validateUser2ndBidSpadeTransfer;
