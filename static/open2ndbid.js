function getOpen2ndBid(opener1stBid, user1stBid, openerHand) {
    const spades = openerHand["♠"]?.length || 0;
    const hearts = openerHand["♥"]?.length || 0;

    let open2ndbid = "";

    // Set transfer target based on user's first bid
    if (user1stBid === "2D") {
        window.transferTarget = "hearts";
    } else if (user1stBid === "2H") {
        window.transferTarget = "spades";
    }

    if (window.transferTarget === "hearts") {
        open2ndbid = "2H";  // Complete the transfer to hearts
    } else if (window.transferTarget === "spades") {
        open2ndbid = "2S";  // Complete the transfer to spades
    } else {
        // This is a Stayman sequence (user bid 2C)
        if (spades === 4 && hearts === 4) {
            open2ndbid = "2H";  // Show hearts first with both majors
        } else if (spades === 4) {
            open2ndbid = "2S";  // Show 4 spades
        } else if (hearts === 4) {
            open2ndbid = "2H";  // Show 4 hearts
        } else {
            open2ndbid = "2D";  // No 4-card major
        }
    }

    // Store the bid globally for later reference
    window.open2ndbid = open2ndbid;
    
    // Reset bidding history to ensure correct sequence
    window.biddingHistory = [
        { keith: "1NT", you: user1stBid },    // First round
        { keith: open2ndbid, you: "" }        // Second round
    ];
    
    if (typeof updateBiddingDisplay === 'function') {
        updateBiddingDisplay();
    }

    return open2ndbid;
}

// Make it available globally
window.getOpen2ndBid = getOpen2ndBid;
