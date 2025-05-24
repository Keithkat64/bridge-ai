
function validateUserBidStayman(bid, responderHand) {
  const has4Spades = responderHand.spades && responderHand.spades.length === 4;
  const has4Hearts = responderHand.hearts && responderHand.hearts.length === 4;

  if (!has4Spades && !has4Hearts) {
    showModal("You need 4 cards in a major to use Stayman. Try Transfers instead.");
    return;
  }

  console.log("User has bid Stayman. Proceeding to open2ndbid.js");
  runOpen2ndBid(responderHand, window.openerHand);
}
