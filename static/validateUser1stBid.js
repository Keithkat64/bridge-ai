function validateUser1stBid(userBid, responderHand) {
  const spades = responderHand["♠"]?.length || 0;
  const hearts = responderHand["♥"]?.length || 0;
  const bid = userBid.toUpperCase();

  if (typeof window.retryCount === "undefined") {
    window.retryCount = 0;
  }

  const isStayman = spades < 5 && hearts < 5;
  let isValid = false;
  let feedback = "";

  if (isStayman) {
    if (bid === "2C") {
      isValid = true;
      window.biddingHistory.at(-1).you = "2C";
      updateBiddingDisplay();
      runOpen2ndBid();
    } else {
      feedback = "Keith thinks this is a Stayman hand. Please re-enter your bid.";
    }

  } else if (hearts > 4) {
    if (bid === "2D") {
      isValid = true;
      window.biddingHistory.at(-1).you = "2D";
      updateBiddingDisplay();
      window.transferTarget = "hearts";
      // TODO: run transfer logic
    } else {
      feedback = "Keith thinks this is a transfer to ♥. Please re-enter your bid.";
    }

  } else if (spades > 4) {
    if (bid === "2H") {
      isValid = true;
      window.biddingHistory.at(-1).you = "2H";
      updateBiddingDisplay();
      window.transferTarget = "spades";
      // TODO: run transfer logic
    } else {
      feedback = "Keith thinks this is a transfer to ♠. Please re-enter your bid.";
    }
  }

  // Only handle retries if the bid is invalid
  if (!isValid) {
    if (window.retryCount === 0) {
      window.retryCount = 1;
      showModal(feedback);
    } else {
      showModal("That's two strikes. Keith is passing for you.");
      window.biddingHistory.at(-1).you = "PASS";
      updateBiddingDisplay();
    }
  } else {
    // Reset after success
    window.retryCount = 0;
  }
}
