
function validateUser2ndBid(user2ndbid, open2ndbid) {
  const validSecondBids = ["2NT", "3NT", "4NT"];
  if (open2ndbid === "2H") validSecondBids.push("3H", "4H");
  if (open2ndbid === "2S") validSecondBids.push("3S", "4S");

  window.validUserBid = false;

  if (!validSecondBids.includes(user2ndbid)) {
    showModal("Keith thinks you have a better bid");
    return;
  }

  window.validUserBid = true;
}
