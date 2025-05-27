
function calculateOpen4thBid(user3rdbid, openerHand) {
  let open4thbid = "";

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
  } else {
    showModal("You have made an incorrect bid. Please try again.");
    return { open4thbid: null, retry: true };
  }

  return { open4thbid, retry: false };
}

function flattenHand(hand) {
  return ["♠", "♥", "♦", "♣"].flatMap(suit => hand[suit] || []);
}

window.calculateOpen4thBid = calculateOpen4thBid;
