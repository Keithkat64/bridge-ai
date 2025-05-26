function validateUser1stBid(userBid, responderHand) {
  const spades = responderHand["♠"]?.length || 0;
  const hearts = responderHand["♥"]?.length || 0;
  const bid = userBid.toUpperCase();

  // Track retry count
  if (typeof window.retryCount === "undefined") {
    window.retryCount = 0;
  }

  // Assume Stayman if no 5-card major
  const isStayman = spades < 5 && hearts < 5;

  let isValid = false;

  if (isStayman) {
    if (bid === "2C") {
      isValid = true;
      window.biddingHistory.at(-1).you = "2C";
      updateBiddingDisplay();
      runOpen2ndBid();
    } else {
      showModal("Keith thinks this is a Stayman hand. Please re-enter your bid.");
    }

  } else if (hearts > 4) {
    if (bid === "2D") {
      isValid = true;
      window.biddingHistory.at(-1).you = "2D";
      updateBiddingDisplay();
      window.transferTarget = "hearts";
      // TODO: Run transfer logic
    } else {
      showModal("Keith thinks this is a transfer to ♥. Please re-enter your bid.");
    }

  } else if (spades > 4) {
    if (bid === "2H") {
      isValid = true;
      window.biddingHistory.at(-1).you = "2H";
      updateBiddingDisplay();
      window.transferTarget = "spades";
      // TODO: Run transfer logic
    } else {
      showModal("Keith thinks this is a transfer to ♠. Please re-enter your bid.");
    }
  }

  // Retry handling
  if (!isValid) {
    window.retryCount++;
    if (window.retryCount >= 2) {
      showModal("That's two strikes. Keith is passing for you.");
      window.biddingHistory.at(-1).you = "PASS";
      updateBiddingDisplay();
      // Optional: end bidding or show 'Bid another hand?' buttons
    }
  } else {
    // Reset retry count on success
    window.retryCount = 0;
  }
}
