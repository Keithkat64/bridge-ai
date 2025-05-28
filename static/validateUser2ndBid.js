
function validateUser2ndBid(userBid, open2ndbid) {
  window.validUserBid = false;

  const upperBid = userBid.toUpperCase();

  const validBidsAlways = ["2NT", "3NT", "4NT", "PASS", "3C", "3D"];

  const validBidsByOpener = {
    "2H": ["3H", "4H"],
    "2S": ["3S", "4S"]
  };

  if (validBidsAlways.includes(upperBid)) {
    window.validUserBid = true;
  } else if (validBidsByOpener[open2ndbid] && validBidsByOpener[open2ndbid].includes(upperBid)) {
    window.validUserBid = true;
  } else {
    showModal("Keith thinks you have a better bid");
  }
}
