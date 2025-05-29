function calculateOpen4thBid(open3rdbid, user3rdbid, opener) {
    let open4thbid = "";
    console.log("Calculating 4th bid. User bid:", user3rdbid);

    // Handle Blackwood 4NT (asking for aces)
    if (user3rdbid === "4NT") {
        const aceCount = countAces(opener);
        console.log("Ace count:", aceCount);
        switch (aceCount) {
            case 1: open4thbid = "5D"; break;
            case 2: open4thbid = "5H"; break;
            case 3: open4thbid = "5S"; break;
            default: open4thbid = "5C"; break; // 0 or 4 aces
        }
        return { open4thbid };
    }

    // Handle 5NT (asking for kings)
    if (user3rdbid === "5NT") {
        const kingCount = countKings(opener);
        console.log("King count:", kingCount);
        switch (kingCount) {
            case 1: open4thbid = "6D"; break;
            case 2: open4thbid = "6H"; break;
            case 3: open4thbid = "6S"; break;
            default: open4thbid = "6C"; break; // 0 or 4 kings
        }
        return { open4thbid };
    }

    // Handle other sequences
    if (open3rdbid === "3NT") {
        if (user3rdbid === "PASS") {
            open4thbid = "PASS";
        } else {
            open4thbid = "PASS";  // Default action
        }
    } else {
        open4thbid = "PASS";  // Default action for unknown sequences
    }

    return { open4thbid };
}

function countAces(hand) {
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

    return allCards.filter(card => card === "A").length;
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

// Helper function to validate hand structure
function isValidHand(hand) {
    return hand && 
           hand["♠"] && Array.isArray(hand["♠"]) &&
           hand["♥"] && Array.isArray(hand["♥"]) &&
           hand["♦"] && Array.isArray(hand["♦"]) &&
           hand["♣"] && Array.isArray(hand["♣"]);
}

// Helper function to count any specific card
function countCard(hand, card) {
    if (!isValidHand(hand)) {
        console.error("Invalid hand structure:", hand);
        return 0;
    }

    const allCards = [
        ...hand["♠"],
        ...hand["♥"],
        ...hand["♦"],
        ...hand["♣"]
    ];

    return allCards.filter(c => c === card).length;
}

// Make all functions available globally
window.calculateOpen4thBid = calculateOpen4thBid;
window.countAces = countAces;
window.countKings = countKings;
window.isValidHand = isValidHand;
window.countCard = countCard;

// Add some debugging helpers
function debugHand(hand) {
    if (!isValidHand(hand)) {
        console.error("Invalid hand structure for debugging:", hand);
        return;
    }

    console.log("Hand analysis:");
    console.log("Aces:", countAces(hand));
    console.log("Kings:", countKings(hand));
    console.log("Full hand:", hand);
}
window.debugHand = debugHand;
