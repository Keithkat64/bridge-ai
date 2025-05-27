
// aceask.js
function runAceAsk(userBid, openerHand) {
  return new Promise((resolve) => {
    const aceCount = countAces(openerHand);
    let response;

    switch (aceCount) {
      case 0:
        response = "5C"; break;
      case 1:
        response = "5D"; break;
      case 2:
        response = "5H"; break;
      case 3:
        response = "5S"; break;
      case 4:
        response = "5NT"; break;
      default:
        response = "PASS";
    }

    resolve({ openerBid: response });
  });
}

function countAces(hand) {
  if (!hand || !hand["♠"] || !hand["♥"] || !hand["♦"] || !hand["♣"]) {
    console.error("Invalid hand structure:", hand);
    return 0;
  }

  const allCards = [
    ...hand["♠"],
    ...hand["♥"],
    ...hand["♦"],
    ...hand["♣"]
  ];

  return allCards.filter(card => card === "A").length;
}

window.runAceAsk = runAceAsk;
