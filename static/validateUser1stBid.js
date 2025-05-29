function validateUser1stBid(userBid, responderHand) {
    console.log("Validating bid:", userBid);
    console.log("Responder hand:", responderHand);
    
    window.validuser1stbid = false;

    if (!userBid || typeof userBid !== "string" || userBid.length !== 2) {
        console.log("Invalid bid format");
        return;
    }

    if (!responderHand || !responderHand["♠"] || !responderHand["♥"]) {
        console.error("Responder hand is undefined or incomplete:", responderHand);
        return;
    }

    userBid = userBid.toUpperCase();
    const has4Spades = responderHand["♠"].length >= 4;
    const has4Hearts = responderHand["♥"].length >= 4;

    console.log("Has 4 spades:", has4Spades);
    console.log("Has 4 hearts:", has4Hearts);

    if (userBid === "2C" && (has4Spades || has4Hearts)) {
        window.validuser1stbid = true;
    }

    console.log("validuser1stbid =", window.validuser1stbid);
}
