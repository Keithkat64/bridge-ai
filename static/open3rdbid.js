
function calculateOpen3rdBid(open2ndbid, user2ndbid, opener, userMinor = "") {
  let open3rdbid = "";
  let user3rdbid = "";
  window.validUserBid = false;

  const legalBids = ["2NT", "3NT", "4NT"];
  if (open2ndbid === "2H") legalBids.push("3H", "4H");
  if (open2ndbid === "2S") legalBids.push("3S", "4S");

  if (!legalBids.includes(user2ndbid)) {
    showModal("Keith thinks you have a better bid");
    return { open3rdbid: "", user3rdbid: "" };
  }

  window.validUserBid = true;

  // Handle ace-ask via 4NT
  if (user2ndbid === "4NT") {
    const aceCount = countAces(opener);
    const aceResponseMap = ["5C", "5D", "5H", "5S", "5C"]; // 0,1,2,3,4
    open3rdbid = aceResponseMap[aceCount] || "PASS";
    return { open3rdbid, user3rdbid: "" };
  }

  const hcp = calculateHCP(opener);
  const tp = hcp + countDoubletons(opener);
  const has4Spades = (opener["♠"] || []).length === 4;
  const has4Hearts = (opener["♥"] || []).length === 4;
  const has4InUserMinor = userMinor && (opener[userMinor] || []).length === 4;

  if (open2ndbid === "2H") {
    if (user2ndbid === "2NT") {
      open3rdbid = has4Spades ? (tp >= 18 ? "4S" : "3S") : (hcp === 18 ? "3NT" : "PASS");
    } else if (user2ndbid === "3H") {
      open3rdbid = tp >= 18 ? "4H" : "PASS";
    } else if (user2ndbid === "3NT") {
      open3rdbid = has4Spades ? "4S" : "PASS";
    } else if (user2ndbid === "4H") {
      open3rdbid = "PASS";
    }
  } else if (open2ndbid === "2S") {
    if (user2ndbid === "2NT") {
      open3rdbid = hcp === 18 ? "3NT" : "PASS";
    } else if (user2ndbid === "3S") {
      open3rdbid = tp >= 18 ? "4S" : "PASS";
    } else if (user2ndbid === "3NT" || user2ndbid === "4S") {
      open3rdbid = "PASS";
    }
  } else if (open2ndbid === "2D") {
    if (user2ndbid === "2NT") {
      const clubs = opener["♣"] || [];
      const diamonds = opener["♦"] || [];
      const hasGoodMinor = (hcp === 17 &&
        ((clubs.length === 5 && hasStrongMinor(clubs)) ||
         (diamonds.length === 5 && hasStrongMinor(diamonds))));
      open3rdbid = (hcp === 18 || hasGoodMinor) ? "3NT" : "PASS";
    } else if (user2ndbid === "3NT") {
      open3rdbid = "PASS";
    }
  }

  return { open3rdbid, user3rdbid };
}

function countAces(hand) {
  return ["♠", "♥", "♦", "♣"].reduce((count, suit) => {
    return count + (hand[suit] || []).filter(card => card === "A").length;
  }, 0);
}

function calculateHCP(hand) {
  const hcpMap = { A: 4, K: 3, Q: 2, J: 1 };
  return Object.keys(hand).reduce((total, suit) => {
    return total + (hand[suit] || []).reduce((suitPoints, card) => {
      return suitPoints + (hcpMap[card] || 0);
    }, 0);
  }, 0);
}

function countDoubletons(hand) {
  return ["♠", "♥", "♦", "♣"].filter(suit => {
    const len = (hand[suit] || []).length;
    return len === 2;
  }).length;
}

function hasStrongMinor(suit) {
  const topHonours = ['A', 'K', 'Q'];
  const fiveHonours = ['A', 'K', 'Q', 'J', '10'];
  const honourCount = (cards, set) => (cards || []).filter(card => set.includes(card)).length;
  return honourCount(suit, topHonours) >= 2 || honourCount(suit, fiveHonours) >= 3;
}

window.calculateOpen3rdBid = calculateOpen3rdBid;
window.hasStrongMinor = hasStrongMinor;
