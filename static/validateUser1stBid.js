function validateUser1stBid(userBid, responderHand) {
  const spades = responderHand["♠"]?.length || 0;
  const hearts = responderHand["♥"]?.length || 0;
  const bid = userBid.toUpperCase();

  // Assume Stayman if no 5-card major
  const isStayman = spades < 5 && hearts < 5;

  if (isStayman) {
    if (bid === "2C") {
      // ✅ Valid Stayman bid — now update bidding
      window.biddingHistory.at(-1).you = "2C";
      updateBiddingDisplay();
      runOpen2ndBid();
    } else {
      // ❌ Invalid Stayman bid
      showModal("Keith thinks this is a Stayman hand. Please re-enter your bid.");
    }

  } else if (hearts > 4) {
    if (bid === "2D") {
      // ✅ Valid Transfer to hearts
      window.biddingHistory.at(-1).you = "2D";
      updateBiddingDisplay();
      window.transferTarget = "hearts";
      // TODO: Run transfer logic
    } else {
      // ❌ Invalid Transfer to hearts
      showModal("Keith thinks this is a transfer to ♥. Please re-enter your bid.");
    }

  } else if (spades > 4) {
    if (bid === "2H") {
      // ✅ Valid Transfer to spades
      window.biddingHistory.at(-1).you = "2H";
      updateBiddingDisplay();
      window.transferTarget = "spades";
      // TODO: Run transfer logic
    } else {
      // ❌ Invalid Transfer to spades
      showModal("Keith thinks this is a transfer to ♠. Please re-enter your bid.");
    }
  }
}
