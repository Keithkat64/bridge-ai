
function validateUser1stBid(userBid, responderHand) {
  window.validuser1stbid = false;

  if (!userBid || typeof userBid !== "string" || userBid.length !== 2) {
    return;
  }

  userBid = userBid.toUpperCase();
  const suit = userBid.charAt(1);
  const has4Spades = responderHand.spades.length >= 4;
  const has4Hearts = responderHand.hearts.length >= 4;

  if (userBid === "2C" && (has4Spades || has4Hearts)) {
    window.validuser1stbid = true;
  }

  console.log("validuser1stbid =", window.validuser1stbid);
}
