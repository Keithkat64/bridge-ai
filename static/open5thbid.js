function calculateOpen5thBid(open4thbid, user4thbid, opener) {
    let open5thbid = "";
    console.log("Calculating 5th bid. User bid:", user4thbid);

    // Handle king asking after ace asking
    if (user4thbid === "5NT") {
        const kingCount = countKings(opener);
        console.log("King count:", kingCount);
        switch (kingCount) {
            case 1: open5thbid = "6D"; break;
            case 2: open5thbid = "6H"; break;
            case 3: open5thbid = "6S"; break;
            default: open5thbid = "6C"; break; // 0 or 4 kings
        }
    } else if (user4thbid === "7S") {
        // When user bids 7S, Keith should pass
        open5thbid = "PASS";
    } else {
        // For any other bid, Keith should pass
        open5thbid = "PASS";
    }

    // Return just the bid string instead of an object
    return open5thbid;
}

function countKings(hand) {
    if (!hand || !hand["♠"] || !hand["♥"] || !hand["♦"] || !hand["♣"]) {
        console.error("Invalid hand structure:", hand);
        return 0;
    }

    const allCards = [
        ...hand["♠"],
        ...hand["♥"],
        ...hand["♦"],
        ...hand["♣"]
    ];

    return allCards.filter(card => card === "K").length;
}

// Make functions available globally
window.calculateOpen5thBid = calculateOpen5thBid;
window.getOpen5thBid = calculateOpen5thBid;
window.countKings = countKings;
