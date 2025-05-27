
function interceptBlackwood(userBid, openerHand) {
  if (userBid === "4NT") {
    const flatHand = flattenHand(openerHand);
    const result = window.runBlackwood
      ? window.runBlackwood({ hand: flatHand }, null, ["4NT"])
      : { openerBid: "ERROR" };

    open4thbid = result.openerBid || "PASS";
    window.biddingHistory.push({ keith: open4thbid, you: userBid });
    updateBiddingDisplay();

    if (open4thbid === "PASS") endBidding();
    return true; // 4NT was handled
  }
  return false; // continue normal bidding
}

window.interceptBlackwood = interceptBlackwood;
