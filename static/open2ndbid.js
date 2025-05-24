
function runOpen2ndBid(userHand, openerHand) {
  let bid = "";

  if (openerHand.hearts.length === 4) {
    bid = "2♥";
  } else if (openerHand.spades.length === 4) {
    bid = "2♠";
  } else {
    bid = "2♦"; // deny major
  }

  console.log("Keith responds with", bid);
  open2ndbid = bid;
  window.biddingHistory.push({ keith: bid, you: "" });
  updateBiddingDisplay();
}
