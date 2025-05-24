
function validateUserBidStayman(bid, hand) {
  console.log("Validating Stayman bid. Bid:", bid, "Hand:", hand);

  if (!hand) {
    console.error("Responder hand is undefined in validateUserBidStayman");
    return;
  }

  const suitSymbols = ["♠", "♥"];
  let suitCounts = { "♠": 0, "♥": 0 };

  for (const card of hand) {
    if (suitSymbols.includes(card.suit)) {
      suitCounts[card.suit]++;
    }
  }

  console.log("Suit counts for Stayman check:", suitCounts);

  const hasFourCardMajor = suitCounts["♠"] >= 4 || suitCounts["♥"] >= 4;

  if (!hasFourCardMajor) {
    showModal("You need 4 cards in a major to use Stayman. Try Transfers instead.");
    return;
  }

  console.log("User has bid Stayman. Proceeding to open2ndbid.js");
  runOpen2ndBid(hand);
}
