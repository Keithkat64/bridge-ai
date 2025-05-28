
function submitBid() {
  const bidInput = document.getElementById("userBid");
  const bid = bidInput.value.trim().toUpperCase();
  if (!bid) return;

  bidInput.value = "";
  userBid = bid;

  const history = window.biddingHistory || [];
  const rowIndex = Math.floor(history.length / 2);

  if (history.length === 0) {
    // Opening bid: Keith opens 1NT
    open1stbid = "1NT";
    user1stbid = bid;
    validuser1stbid = validateUser1stBid(user1stbid, responderHand);

    if (validuser1stbid) {
      open2ndbid = getOpen2ndBid(open1stbid, user1stbid, openerHand);
      updateBiddingDisplay([[open1stbid, user1stbid]]);
      updateBiddingDisplay([[open2ndbid, ""]]);
    } else {
      alert("Invalid bid for the hand. Try again.");
    }
  } else if (history.length === 2) {
    // Second round
    user2ndbid = bid;
    validuser2ndbid = validateUser2ndBid(user2ndbid, responderHand, open2ndbid);
    if (validuser2ndbid) {
      open3rdbid = getOpen3rdBid(open2ndbid, user2ndbid, openerHand);
      updateBiddingDisplay([[open2ndbid, user2ndbid]]);
      updateBiddingDisplay([[open3rdbid, ""]]);
    } else {
      alert("Invalid second bid.");
    }
  } else if (history.length === 4) {
    // Third round
    user3rdbid = bid;
    validuser3rdbid = validateUser3rdBid(user3rdbid, responderHand, open3rdbid);
    if (validuser3rdbid) {
      open4thbid = getOpen4thBid(open3rdbid, user3rdbid, openerHand);
      updateBiddingDisplay([[open4thbid, user3rdbid]]);
    } else {
      alert("Invalid third bid.");
    }
  } else if (history.length === 6) {
    user4thbid = bid;
    validuser4thbid = validateUser4thBid(user4thbid, responderHand, open4thbid);
    if (validuser4thbid) {
      open5thbid = getOpen5thBid(open4thbid, user4thbid, openerHand);
      updateBiddingDisplay([[open5thbid, user4thbid]]);
    } else {
      alert("Invalid fourth bid.");
    }
  } else if (history.length === 8) {
    user5thbid = bid;
    validuser5thbid = validateUser5thBid(user5thbid, responderHand, open5thbid);
    if (validuser5thbid) {
      open6thbid = "PASS";
      updateBiddingDisplay([[open6thbid, user5thbid]]);
      alert("Bidding finished.");
    } else {
      alert("Invalid fifth bid.");
    }
  }

  window.biddingHistory = history;
}

function updateBiddingDisplay(rows) {
  const keithCol = document.getElementById("keith-column");
  const youCol = document.getElementById("you-column");

  rows.forEach(([keithBid, yourBid]) => {
    if (keithBid !== undefined && yourBid !== undefined) {
      keithCol.innerHTML += "<div>" + keithBid + "</div>";
      youCol.innerHTML += "<div>" + yourBid + "</div>";
    }
  });
}
