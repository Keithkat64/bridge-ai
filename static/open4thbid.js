
function calculateOpen4thBid(user3rdbid, openerHand, user4thbid = "") {
  const bid = user3rdbid.toUpperCase();

  if (bid === "4S") {
    open4thbid = "PASS";

  } else if (bid === "4NT") {
    const flatHand = flattenHand(openerHand);
    const result = window.runBlackwood
      ? window.runBlackwood({ hand: flatHand }, null, [bid])
      : { openerBid: "ERROR" };
    open4thbid = result.openerBid || "PASS";

  } else if (bid === "5C" || bid === "5D") {
    open4thbid = "PASS";

  } else if (bid === "5NT") {
    const flatHand = flattenHand(openerHand);
    const result = window.runBlackwood
      ? window.runBlackwood({ hand: flatHand }, null, [bid])
      : { openerBid: "ERROR" };
    open4thbid = result.openerBid || "PASS";

    if (user4thbid.toUpperCase() !== "PASS") {
      open5thbid = "PASS";
    }

  } else {
    showModal("You have made an incorrect bid. Please try again.");
    return { retry: true };
  }

  return { retry: false };
}

function flattenHand(hand) {
  return ["♠", "♥", "♦", "♣"].flatMap(suit => hand[suit] || []);
}

window.calculateOpen4thBid = calculateOpen4thBid;
