
function validateUser3rdBid(user3rdbid) {
  const validThirdBids = ["PASS", "4H", "4S", "4NT", "5C", "5D", "5NT"];
  window.validUserBid = false;

  if (!validThirdBids.includes(user3rdbid.toUpperCase())) {
    showModal("Keith thinks you have a better bid");
    return;
  }

  window.validUserBid = true;
}
