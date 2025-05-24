
function calculateOpen3rdBid(open2ndbid, user2ndbid, opener, userMinor = "") {
  let open3rdbid = "";
  let user3rdbid = "";
  const hcp = calculateHCP(opener);
  const tp = hcp + countDoubletons(opener);
  const has4Spades = opener.spades.length === 4;
  const has4InUserMinor = userMinor && opener[userMinor]?.length === 4;

  if (open2ndbid === "2H") {
    if (user2ndbid === "2NT") {
      if (has4Spades) {
        if (tp >= 18) {
          open3rdbid = "4S";
          user3rdbid = "PASS";
        } else {
          open3rdbid = "3S";
        }
      } else {
        if (hcp === 18) {
          open3rdbid = "3NT";
          user3rdbid = "PASS";
        } else {
          open3rdbid = "PASS";
        }
      }
    } else if (user2ndbid === "3H") {
      if (tp >= 18) {
        open3rdbid = "4H";
        user3rdbid = "PASS";
      } else {
        open3rdbid = "PASS";
      }
    } else if (user2ndbid === "3NT") {
      open3rdbid = has4Spades ? "4S" : "PASS";
    } else if (user2ndbid === "4H") {
      open3rdbid = "PASS";
    } else if (user2ndbid === "3C" || user2ndbid === "3D") {
      if (has4Spades) {
        if (tp >= 18) {
          open3rdbid = "3S";
        } else {
          open3rdbid = "4S";
        }
      } else if (has4InUserMinor) {
        open3rdbid = "4" + userMinor.toUpperCase();
      } else {
        open3rdbid = "3NT";
      }
    } else if (user2ndbid === "4NT") {
      open3rdbid = "Number of Aces (Blackwood)";
    }
  }

  else if (open2ndbid === "2S") {
    if (user2ndbid === "2NT") {
      if (hcp === 18) {
        open3rdbid = "3NT";
        user3rdbid = "PASS";
      } else {
        open3rdbid = "PASS";
      }
    } else if (user2ndbid === "3S") {
      if (tp >= 18) {
        open3rdbid = "4S";
        user3rdbid = "PASS";
      } else {
        open3rdbid = "PASS";
      }
    } else if (user2ndbid === "3NT" || user2ndbid === "4S") {
      open3rdbid = "PASS";
    } else if (user2ndbid === "3C" || user2ndbid === "3D") {
      open3rdbid = has4InUserMinor ? "4" + userMinor.toUpperCase() : "3NT";
    } else if (user2ndbid === "4NT") {
      open3rdbid = "Number of Aces (Blackwood)";
    }
  }

  else if (open2ndbid === "2D") {
    if (user2ndbid === "2NT") {
      const hasGoodMinor = (hcp === 17 &&
        ((opener.clubs.length === 5 && hasStrongMinor(opener.clubs)) ||
         (opener.diamonds.length === 5 && hasStrongMinor(opener.diamonds))));
      if (hcp === 18 || hasGoodMinor) {
        open3rdbid = "3NT";
        user3rdbid = "PASS";
      } else {
        open3rdbid = "PASS";
      }
    } else if (user2ndbid === "3NT") {
      open3rdbid = "PASS";
    } else if (user2ndbid === "3C" || user2ndbid === "3D") {
      open3rdbid = has4InUserMinor ? "4" + userMinor.toUpperCase() : "3NT";
    } else if (user2ndbid === "4NT") {
      open3rdbid = "Number of Aces (Blackwood)";
    }
  }

  return { open3rdbid, user3rdbid };
}

function hasStrongMinor(suit) {
  const topHonours = ['A', 'K', 'Q'];
  const fiveHonours = ['A', 'K', 'Q', 'J', '10'];
  const honourCount = (cards, set) => cards.filter(card => set.includes(card)).length;
  return honourCount(suit, topHonours) >= 2 || honourCount(suit, fiveHonours) >= 3;
}
