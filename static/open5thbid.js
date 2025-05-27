
function calculateOpen5thBid(user4thbid, user5thbid, openerHand) {
  if (user4thbid.toUpperCase() === "PASS") {
    endBidding();
    return;
  }

  if (user4thbid.toUpperCase() === "5NT") {
    const flatHand = flattenHand(openerHand);
    const result = window.runKingAsk
      ? window.runKingAsk({ hand: flatHand }, null, ["5NT"])
      : { openerBid: "ERROR" };
    open5thbid = result.openerBid || "PASS";

    if (user5thbid.toUpperCase() === "PASS") {
      endBidding();
    } else {
      open5thbid = "PASS";
      endBidding();
    }

  } else {
    open5thbid = "PASS";
    endBidding();
  }
}

function flattenHand(hand) {
  return ["♠", "♥", "♦", "♣"].flatMap(suit => hand[suit] || []);
}

window.calculateOpen5thBid = calculateOpen5thBid;
