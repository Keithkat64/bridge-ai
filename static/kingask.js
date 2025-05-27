
function runKingAsk(opener, responder, bidHistory) {
  const kingCount = countKings(opener.hand);
  const lastBid = bidHistory[bidHistory.length - 1];

  if (lastBid === "5NT") {
    const responses = ["6C", "6D", "6H", "6S"];
    const bid = responses[Math.min(kingCount, 3)];
    return {
      openerBid: bid,
      nextStep: "awaitResponderFinalDecision"
    };
  }

  return { error: "Unexpected bid: Only 5NT is valid for king ask." };
}

function countKings(hand) {
  return hand.filter(card => card.startsWith("K")).length;
}

window.runKingAsk = runKingAsk;
