
function calculateOpen3rdBid(open2ndbid, user2ndbid, opener, userMinor = "") {
  let open3rdbid = "";
  let user3rdbid = "";

  const hcp = calculateHCP(opener);
  const tp = hcp + countDoubletons(opener);

  const has3Hearts = (opener["♥"] || []).length >= 3;
  const has4Spades = (opener["♠"] || []).length === 4;
  const has4Clubs = (opener["♣"] || []).length === 4;
  const has4Diamonds = (opener["♦"] || []).length === 4;

  if (open2ndbid === "2H") {
    switch (user2ndbid) {
      case "PASS":
        open3rdbid = has3Hearts ? "PASS" : "2NT";
        break;
      case "2S":
        open3rdbid = has3Hearts ? (tp >= 18 ? "4♥" : "PASS") : "PASS";
        break;
      case "2NT":
        if (has3Hearts) {
          open3rdbid = tp >= 18 ? "4♥" : "3♥";
        } else {
          open3rdbid = hcp === 18 ? "3NT" : "PASS";
        }
        break;
      case "3♥":
        open3rdbid = has3Hearts ? (tp >= 18 ? "4♥" : "PASS") : "PASS";
        break;
      case "3NT":
        open3rdbid = has4Spades ? "4S" : "PASS";
        break;
      case "3C":
        if (has3Hearts) {
          open3rdbid = tp >= 18 ? "4♥" : "PASS";
        } else if (has4Spades) {
          open3rdbid = tp >= 18 ? "4S" : "PASS";
        } else if (has4Clubs) {
          open3rdbid = "4C";
        } else {
          open3rdbid = "3NT";
        }
        break;
      case "3D":
        if (has3Hearts) {
          open3rdbid = tp >= 18 ? "4♥" : "PASS";
        } else if (has4Spades) {
          open3rdbid = tp >= 18 ? "4S" : "PASS";
        } else if (has4Diamonds) {
          open3rdbid = "4D";
        } else {
          open3rdbid = "3NT";
        }
        break;
      case "4♥":
        open3rdbid = "PASS";
        break;
      case "4NT":
        const flatHand = flattenHand(opener);
        const result = window.runBlackwood
          ? window.runBlackwood({ hand: flatHand }, null, [user2ndbid])
          : { openerBid: "ERROR" };
        open3rdbid = result.openerBid || "PASS";
        break;
      default:
        showModal("Keith thinks your second bid is invalid after 2♥. Please try again.");
        break;
    }
  }

  return { open3rdbid, user3rdbid };
}

function flattenHand(hand) {
  return ["♠", "♥", "♦", "♣"].flatMap(suit => hand[suit] || []);
}

function countDoubletons(hand) {
  return ["♠", "♥", "♦", "♣"].filter(suit => (hand[suit] || []).length === 2).length;
}

function calculateHCP(hand) {
  const hcpMap = { A: 4, K: 3, Q: 2, J: 1 };
  return Object.values(hand).flat().reduce((acc, card) => acc + (hcpMap[card] || 0), 0);
}

window.calculateOpen3rdBid = calculateOpen3rdBid;
