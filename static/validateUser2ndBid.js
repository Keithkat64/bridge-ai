function validateUser2ndBid(userBid, open2ndbid) {
  window.validUser2ndBid = false;

  const upperBid = userBid.toUpperCase();

  // Always allowed bids for any open2ndbid
  const universalValidBids = ["2NT", "3C", "3D", "3NT", "4NT"];

  // Contextual bids based on Keith's 2nd bid
  const contextualValidBids = {
    "2H": ["3H", "4H"],
    "2S": ["3S", "4S"],
    "2D": [] // No suit-level fit bids allowed
  };

  if (universalValidBids.includes(upperBid) ||
      (contextualValidBids[open2ndbid] && contextualValidBids[open2ndbid].includes(upperBid))) {
    window.validUser2ndBid = true;
  } else {
    showModal("Keith thinks you have a better bid");
  }
}
