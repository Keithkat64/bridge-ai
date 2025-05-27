
function runAceAsk(opener, responder, bidHistory) {
  const aceCount = countAces(opener.hand);
  const responses = ["5C", "5D", "5H", "5S", "5C"]; // 0 to 4 aces

  const openerBid = responses[Math.min(aceCount, 4)];
  return { openerBid };
}

function countAces(hand) {
  return hand.filter(card => card.startsWith("A")).length;
}

window.runAceAsk = runAceAsk;
