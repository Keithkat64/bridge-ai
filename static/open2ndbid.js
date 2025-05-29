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
    
    // Update the bidding display - create a new entry instead of modifying the first one
    if (window.biddingHistory) {
        // Keep the original 1NT bid in the first entry
        window.biddingHistory[0].keith = "1NT";  // Ensure first bid stays as 1NT
        window.biddingHistory[0].you = user1stBid;  // Add user's first bid
        
        // Add a new entry for the second round of bidding
        window.biddingHistory.push({ keith: open2ndbid, you: "" });
        
        if (typeof updateBiddingDisplay === 'function') {
            updateBiddingDisplay();
        }
    }

    return open2ndbid;
}

// Make it available globally
window.getOpen2ndBid = getOpen2ndBid;
