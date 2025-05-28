
function runOpen2ndBid(responderHand, openerHand = window.openerHand) {
  if (!window.validUserBid) return;

  const spades = openerHand["♠"]?.length || 0;
  const hearts = openerHand["♥"]?.length || 0;

  let open2ndbid = "";

  if (window.transferTarget === "hearts") {
    open2ndbid = "2H";
  } else if (window.transferTarget === "spades") {
    open2ndbid = "2S";
  } else {
    // Stayman reply
    if (spades === 4 && hearts === 4) {
      open2ndbid = "2H";
    } else if (spades === 4) {
      open2ndbid = "2S";
    } else if (hearts === 4) {
      open2ndbid = "2H";
    } else {
      open2ndbid = "2D";
    }
  }

  window.biddingHistory.push({ keith: open2ndbid, you: "" });
  updateBiddingDisplay();
}
