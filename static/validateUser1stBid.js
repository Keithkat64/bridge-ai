
function validateUser1stBid(userBid, responderHand) {
  const bid = userBid.toUpperCase();
  const spades = responderHand["♠"]?.length || 0;
  const hearts = responderHand["♥"]?.length || 0;

  window.validUserBid = false;

  if (bid === "2C" && spades < 5 && hearts < 5) {
    window.validUserBid = true;
  } else if (bid === "2D" && hearts >= 5) {
    window.validUserBid = true;
    window.transferTarget = "hearts";
  } else if (bid === "2H" && spades >= 5) {
    window.validUserBid = true;
    window.transferTarget = "spades";
  } else {
    showModal("That's not the right bid for your hand.");
  }
}
