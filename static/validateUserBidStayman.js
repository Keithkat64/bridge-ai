
function validateUserBidStayman(bid, hand) {
  console.log("Validating Stayman bid. Bid:", bid, "Hand:", hand);

  const spadeCount = hand.spades ? hand.spades.length : 0;
  const heartCount = hand.hearts ? hand.hearts.length : 0;

  if (spadeCount === 4 || heartCount === 4) {
    console.log("Stayman bid accepted.");
    runOpen2ndBid();
  } else {
    showModal("You need 4 cards in a major to use Stayman. Try Transfers instead.");
  }
}
