
window.validuser1stbid = false;

function validateUser1stBid(userBid, hand) {
  const has4CardMajor = hand.spades.length === 4 || hand.hearts.length === 4;

  if (userBid === "2C" && has4CardMajor) {
    window.validuser1stbid = true;
  } else {
    showModal("Keith thinks you have a better bid.");
  }
}
