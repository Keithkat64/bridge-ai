
function runOpen2ndBid(responderHand, openerHand = window.openerHand) {
  const hearts = (openerHand["♥"] || []).length;
  const spades = (openerHand["♠"] || []).length;

  if (spades === 4 && hearts === 4) {
    open2ndbid = "2H"; // standard: bid hearts first
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

  const nextBidContainer = document.getElementById("next-bid-container");
  const nextBidInput = document.getElementById("your-next-bid");
  if (nextBidContainer) nextBidContainer.style.display = "block";
  if (nextBidInput) nextBidInput.focus();
}
