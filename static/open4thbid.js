
// open4thbid.js

function calculateOpen4thBid(user3rdbid, openerHand, user4thbid = "") {
  const bid = user3rdbid.toUpperCase();
  let open4thbid = "";

  const aceCount = ["A♠", "A♥", "A♦", "A♣"].filter(ace => openerHand.includes(ace)).length;
  const kingCount = ["K♠", "K♥", "K♦", "K♣"].filter(king => openerHand.includes(king)).length;

  if (bid === "4S") {
    open4thbid = "PASS";

  } else if (bid === "4NT") {
    switch (aceCount) {
      case 0:
      case 4:
        open4thbid = "5C";
        break;
      case 1:
        open4thbid = "5D";
        break;
      case 2:
        open4thbid = "5H";
        break;
      case 3:
        open4thbid = "5S";
        break;
      default:
        open4thbid = "PASS";
    }

  } else if (bid === "5C" || bid === "5D") {
    open4thbid = "PASS";

  } else if (bid === "5NT") {
    switch (kingCount) {
      case 0:
      case 4:
        open4thbid = "6C";
        break;
      case 1:
        open4thbid = "6D";
        break;
      case 2:
        open4thbid = "6H";
        break;
      case 3:
        open4thbid = "6S";
        break;
      default:
        open4thbid = "PASS";
    }

  } else {
    showModal("You have made an incorrect bid. Please try again.");
    return { retry: true };
  }

  return { open4thbid };
}

window.calculateOpen4thBid = calculateOpen4thBid;
