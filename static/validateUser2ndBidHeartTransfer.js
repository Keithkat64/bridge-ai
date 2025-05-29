function validateUser2ndBidHeartTransfer(userBid, open2ndbid) {
    const upperBid = userBid.toUpperCase();

    // All valid bids after heart transfer (1NT-2D-2H-?)
    const validBids = [
        "PASS",
        "2S",
        "2NT",
        "3C",
        "3D",
        "3H",
        "3NT",
        "4H",
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
window.validateUser2ndBidHeartTransfer = validateUser2ndBidHeartTransfer;
