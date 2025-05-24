function runOpen2ndBid(responderHand, openerHand) {
  const hearts = openerHand["♥"].length;
  const spades = openerHand["♠"].length;

  if (spades === 4 && hearts === 4) {
    open2ndbid = "2D"; // deny showing either
  } else if (spades === 4) {
    open2ndbid = "2S";
  } else if (hearts === 4) {
    open2ndbid = "2H";
  } else {
    open2ndbid = "2D";
  }

  window.biddingHistory[0].keith = "1NT";
  window.biddingHistory[0].you = "2C";
  window.biddingHistory.push({ keith: open2ndbid, you: "" });

  updateBiddingDisplay();

  // now prompt the user for their next bid
  document.getElementById("next-bid-container").style.display = "block";
  document.getElementById("your-next-bid").focus();
}

