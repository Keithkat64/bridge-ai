// open4thbid.js

function calculateOpen4thBid(user3rdbid, openerHand, user4thbid = "") {
  const bid = user3rdbid.toUpperCase();

  if (bid === "4S") {
    open4thbid = "PASS";

  } else if (bid === "4NT") {
    open4thbid = "PASS"; // Let HTML handle Ace Ask

  } else if (bid === "5C" || bid === "5D") {
    open4thbid = "PASS";

  } else if (bid === "5NT") {
    open4thbid = "PASS"; // Let HTML handle King Ask

    if (user4thbid.toUpperCase() !== "PASS") {
      open5thbid = "PASS";
    }

  } else {
    showModal("You have made an incorrect bid. Please try again.");
    return { retry: true };
  }

  return { retry: false };
}

window.calculateOpen4thBid = calculateOpen4thBid;
