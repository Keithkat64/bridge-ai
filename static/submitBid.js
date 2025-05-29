function submitBid() {
  const bidInput = document.getElementById("userBid");
  const bid = bidInput.value.trim().toUpperCase();
  if (!bid) return;

  bidInput.value = "";
  userBid = bid;

  if (!Array.isArray(window.biddingHistory)) {
    window.biddingHistory = [{ keith: "1NT", you: "" }];
  }

  const history = window.biddingHistory;

  // Check if user bid PASS and end bidding if they did
  if (bid === "PASS") {
    const currentBidIndex = history.findIndex(h => !h.you);
    if (currentBidIndex !== -1) {
      history[currentBidIndex].you = "PASS";
      updateBiddingDisplay();
      showModal("Bidding finished.");
      document.getElementById("bid-input-row").style.display = "none";
      return;
    }
  }

  if (history.length === 1 && !history[0].you) {
    if (!responderHand || !responderHand["♠"] || !responderHand["♥"]) {
      console.error("Responder hand is not properly set before validation:", responderHand);
      showModal("Something went wrong. Please try a new hand.");
      return;
    }

    user1stbid = bid;
    validuser1stbid = validateUser1stBid(user1stbid, responderHand);
    console.log("Validation result:", validuser1stbid);

    if (validuser1stbid === true) {
      open2ndbid = getOpen2ndBid("1NT", user1stbid, openerHand);
      history[0].you = user1stbid;
      history.push({ keith: open2ndbid, you: "" });
      updateBiddingDisplay();
    }
  } else if (history.length === 2 && !history[1].you) {
    user2ndbid = bid;
    validuser2ndbid = validateUser2ndBid(user2ndbid, open2ndbid);
    if (validuser2ndbid) {
      const result = calculateOpen3rdBid(open2ndbid, user2ndbid, openerHand);
      open3rdbid = result.open3rdbid;
      history[1].you = user2ndbid;
      history.push({ keith: open3rdbid, you: "" });
      updateBiddingDisplay();
    }
  } else if (history.length === 3 && !history[2].you) {
    user3rdbid = bid;
    console.log("Processing third bid:", bid);
    validuser3rdbid = validateUser3rdBid(user3rdbid, responderHand, open3rdbid);
    console.log("Third bid validation result:", validuser3rdbid);
    if (validuser3rdbid) {
      console.log("Calculating opener's fourth bid...");
      const result = calculateOpen4thBid(open3rdbid, user3rdbid, openerHand);
      console.log("Fourth bid result:", result);
      open4thbid = result.open4thbid;
      history[2].you = user3rdbid;
      history.push({ keith: open4thbid, you: "" });
      updateBiddingDisplay();
    }
  } else if (history.length === 4 && !history[3].you) {
    user4thbid = bid;
    validuser4thbid = validateUser4thBid(user4thbid, responderHand, open4thbid);
    if (validuser4thbid) {
      open5thbid = getOpen5thBid(open4thbid, user4thbid, openerHand);
      history[3].you = user4thbid;
      history.push({ keith: open5thbid, you: "" });
      updateBiddingDisplay();
    }
  } else if (history.length === 5 && !history[4].you) {
    user5thbid = bid;
    validuser5thbid = validateUser5thBid(user5thbid, responderHand, open5thbid);
    if (validuser5thbid) {
      open6thbid = "PASS";
      history[4].you = user5thbid;
      history.push({ keith: open6thbid, you: "" });
      updateBiddingDisplay();
      showModal("Bidding finished.");
    }
  }

  if (isBiddingFinished()) {
    document.getElementById("bid-input-row").style.display = "none";
  }
}

function isBiddingFinished() {
  return ["PASS"].includes(open3rdbid) ||
         ["PASS"].includes(user3rdbid) ||
         ["PASS"].includes(open4thbid) ||
         ["PASS"].includes(user4thbid) ||
         ["PASS"].includes(open5thbid) ||
         ["PASS"].includes(user5thbid) ||
         ["PASS"].includes(open6thbid) ||
         userBid === "PASS";  // Added check for user's PASS bid
}

window.submitBid = submitBid;
