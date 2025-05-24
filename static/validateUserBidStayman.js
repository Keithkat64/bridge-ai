
function validateUserBidStayman(bid, responderHand) {
  const spades = responderHand['♠'] || responderHand['spades'] || [];
  const hearts = responderHand['♥'] || responderHand['hearts'] || [];

  const has4Majors = (spades.length === 4 || hearts.length === 4);
  const hasNoMajors = (spades.length < 4 && hearts.length < 4);

  if (hasNoMajors) {
    showModal("You need 4 cards in a major to use Stayman. Try Transfers instead.");
    return;
  }

  console.log("User has bid Stayman. Proceeding to open2ndbid.js");
  runOpen2ndBid(window.openerHand, bid);
}
