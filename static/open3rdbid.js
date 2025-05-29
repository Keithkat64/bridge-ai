function calculateOpen3rdBid(open2ndbid, user2ndbid, opener, userMinor = "") {
  let open3rdbid = "";
  let user3rdbid = "";
  
  // Helper function to calculate HCP
  function calculateHCP(hand) {
    const hcpMap = { A: 4, K: 3, Q: 2, J: 1 };
    let points = 0;
    for (let suit of Object.keys(hand)) {
      for (let card of hand[suit]) {
        if (hcpMap[card]) points += hcpMap[card];
      }
    }
    return points;
  }

  // Helper function to count doubletons
  function countDoubletons(hand) {
    let count = 0;
    for (let suit of Object.keys(hand)) {
      if (hand[suit].length === 2) count++;
    }
    return count;
  }

  const hcp = calculateHCP(opener);
  const tp = hcp + countDoubletons(opener);

  const has4Spades = (opener["♠"] || []).length === 4;
  const has4Hearts = (opener["♥"] || []).length === 4;

  // Handle Blackwood 4NT
  if (user2ndbid === "4NT") {
    const aceCount = countAces(opener);
    switch (aceCount) {
      case 0: open3rdbid = "5C"; break;
      case 1: open3rdbid = "5D"; break;
      case 2: open3rdbid = "5H"; break;
      case 3: open3rdbid = "5S"; break;
      case 4: open3rdbid = "5NT"; break;
      default: open3rdbid = "PASS";
    }
    return { open3rdbid, user3rdbid: "" };
  }

  if (open2ndbid === "2H") {
    if (user2ndbid === "2NT") {
      if (has4Spades) {
        open3rdbid = tp >= 18 ? "4S" : "3S";
        user3rdbid = tp >= 18 ? "PASS" : "";
      } else {
        open3rdbid = hcp === 18 ? "3NT" : "PASS";
        user3rdbid = open3rdbid === "3NT" ? "PASS" : "";
      }
    } else if (user2ndbid === "3H") {
      open3rdbid = tp >= 18 ? "4H" : "PASS";
      user3rdbid = open3rdbid === "4H" ? "PASS" : "";
    } else if (user2ndbid === "3NT") {
      open3rdbid = has4Spades ? "4S" : "PASS";
    } else if (user2ndbid === "4H") {
      open3rdbid = "PASS";
    } else if (user2ndbid === "3C" || user2ndbid === "3D") {
      const userMinor = user2ndbid === "3C" ? "♣" : "♦";
      if (has4Spades) {
        open3rdbid = tp >= 18 ? "4S" : "PASS";
      } else if (opener[userMinor]?.length >= 4) {
        open3rdbid = "4" + user2ndbid[1];  // Use the minor from user's bid
      } else {
        open3rdbid = "3NT";
      }
    }
  } else if (open2ndbid === "2S") {
    if (user2ndbid === "2NT") {
      open3rdbid = hcp === 18 ? "3NT" : "PASS";
      user3rdbid = open3rdbid === "3NT" ? "PASS" : "";
    } else if (user2ndbid === "3S") {
      open3rdbid = tp >= 18 ? "4S" : "PASS";
      user3rdbid = open3rdbid === "4S" ? "PASS" : "";
    } else if (user2ndbid === "3NT" || user2ndbid === "4S") {
      open3rdbid = "PASS";
    } else if (user2ndbid === "3C" || user2ndbid === "3D") {
      const userMinor = user2ndbid === "3C" ? "♣" : "♦";
      if (opener[userMinor]?.length >= 4) {
        open3rdbid = "4" + user2ndbid[1];  // Use the minor from user's bid
      } else {
        open3rdbid = "3NT";
      }
    }
  } else if (open2ndbid === "2D") {
    if (user2ndbid === "2NT") {
      const clubs = opener["♣"] || [];
      const diamonds = opener["♦"] || [];
      const hasGoodMinor = (hcp === 17 &&
        ((clubs.length === 5 && hasStrongMinor(clubs)) ||
         (diamonds.length === 5 && hasStrongMinor(diamonds))));
      open3rdbid = (hcp === 18 || hasGoodMinor) ? "3NT" : "PASS";
      user3rdbid = open3rdbid === "3NT" ? "PASS" : "";
    } else if (user2ndbid === "3NT") {
      open3rdbid = "PASS";
    } else if (user2ndbid === "3C" || user2ndbid === "3D") {
      const userMinor = user2ndbid === "3C" ? "♣" : "♦";
      if (opener[userMinor]?.length >= 4) {
        open3rdbid = "4" + user2ndbid[1];  // Use the minor from user's bid
      } else {
        open3rdbid = "3NT";
      }
    }
  }

  return { open3rdbid, user3rdbid };
}

function countAces(hand) {
  if (!hand || !hand["♠"] || !hand["♥"] || !hand["♦"] || !hand["♣"]) {
    console.error("Invalid hand structure:", hand);
    return 0;
  }

  const allCards = [
    ...hand["♠"],
    ...hand["♥"],
    ...hand["♦"],
    ...hand["♣"]
  ];

  return allCards.filter(card => card === "A").length;
}

function hasStrongMinor(suit) {
  const topHonours = ['A', 'K', 'Q'];
  const fiveHonours = ['A', 'K', 'Q', 'J', '10'];
  const honourCount = (cards, set) => (cards || []).filter(card => set.includes(card)).length;
  return honourCount(suit, topHonours) >= 2 || honourCount(suit, fiveHonours) >= 3;
}

// Make functions available globally
window.calculateOpen3rdBid = calculateOpen3rdBid;
window.hasStrongMinor = hasStrongMinor;
