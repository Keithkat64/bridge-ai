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
        return { open5thbid };
    }

    // Handle other sequences
    if (open4thbid === "5H" || open4thbid === "5S") {
        if (user4thbid === "PASS") {
            open5thbid = "PASS";
        } else {
            open5thbid = "PASS";  // Default action
        }
    } else {
        open5thbid = "PASS";  // Default action for unknown sequences
    }

    return { open5thbid };
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

// Make functions available globally with both names
window.calculateOpen5thBid = calculateOpen5thBid;
window.getOpen5thBid = calculateOpen5thBid;  // Add this line to provide the alternative name
window.countKings = countKings;
