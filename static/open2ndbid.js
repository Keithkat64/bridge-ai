
function runOpen2ndBid(userHand, openerHand) {
  if (userHand.bid === "2C") {
    if (openerHand.hearts.length === 4) {
      respondWith("2H");
    } else if (openerHand.spades.length === 4) {
      respondWith("2S");
    } else {
      respondWith("2D");
    }
  }
  // Wait for user's second bid next
}

function respondWith(bid) {
  console.log("Opener bids", bid);
  window.biddingHistory.push({ keith: bid, you: "" });
  updateBiddingDisplay();
}
