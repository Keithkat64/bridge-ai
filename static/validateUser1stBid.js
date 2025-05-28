
function validateUser1stBid(userBid, responderHand) {
  console.log("validateUser1stBid CALLED");
  console.log("userBid =", userBid);
  console.log("responderHand =", responderHand);

  window.validuser1stbid = false;

  if (!userBid || !responderHand) {
    console.log("Missing userBid or responderHand");
    return;
  }

  const upperBid = userBid.trim().toUpperCase();
  const spades = responderHand.spades ? responderHand.spades.length : 0;
  const hearts = responderHand.hearts ? responderHand.hearts.length : 0;

  if (upperBid === "2C" && (spades === 4 || hearts === 4)) {
    window.validuser1stbid = true;
    console.log("Valid Stayman bid: 2C with a 4-card major.");
  }

  console.log("validuser1stbid =", window.validuser1stbid);

  if (!window.validuser1stbid) {
    showErrorModal("That's not the right bid for your hand.");
  }
}
