
function runAceAsk(userBid, openerHand) {
  return new Promise((resolve) => {
    const aceCount = countAces(openerHand);
    let response;

    switch (aceCount) {
      case 0:
        response = "5C";
        break;
      case 1:
        response = "5D";
        break;
      case 2:
        response = "5H";
        break;
      case 3:
        response = "5S";
        break;
      case 4:
        response = "5NT";
        break;
      default:
        response = "PASS";
    }

    resolve(response);
  });
}

function countAces(hand) {
  // Combine all suit arrays into a single flat array
  const allCards = [...hand.spades, ...hand.hearts, ...hand.diamonds, ...hand.clubs];
  return allCards.filter(card => card === "A").length;
}

window.runAceAsk = runAceAsk;
