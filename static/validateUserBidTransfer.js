
function validateUserBidTransfer(userBid, userHand) {
  userBid = userBid.toUpperCase();

  const hearts = userHand?.hearts?.length || 0;
  const spades = userHand?.spades?.length || 0;

  if (userBid === "2D" && hearts >= 5) {
    computerBid("2H");
    return "WAIT_FOR_USER2NDBID";
  }

  if (userBid === "2H" && spades >= 5) {
    computerBid("2S");
    return "WAIT_FOR_USER2NDBID";
  }

  if (userBid === "2D" || userBid === "2H") {
    if (spades === 4 || hearts === 4) {
      showModal("Keith thinks this is a Stayman hand");
    } else {
      showModal("This is not the correct bid");
    }
    return "WAIT_FOR_RESUBMIT";
  }
}
