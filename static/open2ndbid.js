
function runOpen2ndBid(responderHand, openerHand) {
  if (!openerHand || !openerHand.hearts || !openerHand.spades) {
    console.error("Invalid openerHand passed to runOpen2ndBid:", openerHand);
    showModal("Something went wrong with Keith's hand. Try a new hand.");
    return;
  }

  let bid = "";

  if (openerHand.hearts.length === 4) {
    bid = "2♥";
  } else if (openerHand.spades.length === 4) {
    bid = "2♠";
  } else {
    bid = "2♦";
  }

  console.log("Keith responds with", bid);
  open2ndbid = bid;
  window.biddingHistory.push({ keith: bid, you: "" });
  updateBiddingDisplay();
}
