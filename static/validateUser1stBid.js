function validateUser1stBid(userBid, responderHand) {
  window.validUser1stBid = false;

  const upperBid = userBid.toUpperCase();

  const hasFiveHearts = responderHand.hearts.length >= 5;
  const hasFiveSpades = responderHand.spades.length >= 5;
  const hasFourHearts = responderHand.hearts.length === 4;
  const hasFourSpades = responderHand.spades.length === 4;

  const isTransferHand = hasFiveHearts || hasFiveSpades;
  const isStaymanHand = (hasFourHearts || hasFourSpades) && !isTransferHand;

  if (isTransferHand && upperBid === "2D") {
    window.validUser1stBid = true;
  } else if (isTransferHand && upperBid === "2H") {
    window.validUser1stBid = true;
  } else if (isStaymanHand && upperBid === "2C") {
    window.validUser1stBid = true;
  } else {
    showModal("Keith thinks you have a better bid");
  }
}
