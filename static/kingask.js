
function runKingAsk(userBid, openerHand) {
  return new Promise((resolve) => {
    let response;

    const kings = openerHand.filter(card => ['♠', '♥', '♦', '♣'].includes(card[0]) && card[1] === 'K');
    const kingCount = kings.length;

    switch (kingCount) {
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
