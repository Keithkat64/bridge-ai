
function validateUserBidStayman(userBid, userHand) {
  if (userBid === "2C") {
    const hasLongHeart = userHand?.hearts?.length > 4;
    const hasLongSpade = userHand?.spades?.length > 4;

    if (hasLongHeart || hasLongSpade) {
      showModal("Keith thinks this is a Transfer hand");
      return false; // wait for re-entry
    } else {
      console.log("User has bid Stayman. Proceeding to open2ndbid.js");
      runOpen2ndBid(userHand, window.openerHand); // ✅ correctly passing both hands
      return true;
    }
  }
  return false; // Not Stayman
}
