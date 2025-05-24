
function validateUser1stBid(userBid, responderHand) {
  const spades = responderHand.spades?.length || 0;
  const hearts = responderHand.hearts?.length || 0;
  const bid = userBid.toUpperCase();

  if (spades < 5 && hearts < 5) {
    // Stayman hand
    if (bid === "2C") {
      window.biddingHistory.at(-1).you = "2C";
      updateBiddingDisplay();
      runOpen2ndBid();
    } else {
      showModal("Keith thinks this is a Stayman hand. Please re-enter your bid.");
    }
  } else {
    if (hearts > 4) {
      // Transfer to hearts
      if (bid === "2D") {
        window.biddingHistory.at(-1).you = "2D";
        updateBiddingDisplay();
        window.transferTarget = "hearts";
        // Placeholder for running transfer logic
      } else {
        showModal("Keith thinks this is a transfer hand. Please re-enter your bid.");
      }
    } else if (spades > 4) {
      // Transfer to spades
      if (bid === "2H") {
        window.biddingHistory.at(-1).you = "2H";
        updateBiddingDisplay();
        window.transferTarget = "spades";
        // Placeholder for running transfer logic
      } else {
        showModal("Keith thinks this is a transfer hand. Please re-enter your bid.");
      }
    }
  }
}
