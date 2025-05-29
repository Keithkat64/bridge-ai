
function generateHands() {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  function dealHand(startIndex) {
    const hand = { "♠": [], "♥": [], "♦": [], "♣": [] };
    for (let i = 0; i < 13; i++) {
      const card = deck[startIndex + i];
      hand[card.suit].push(card.rank);
    }
    return hand;
  }

  const opener = dealHand(0);
  const responder = dealHand(13);

  return { opener, responder };
}

function countHCP(hand) {
  const hcpMap = { A: 4, K: 3, Q: 2, J: 1 };
  let points = 0;
  for (let suit of Object.keys(hand)) {
    for (let card of hand[suit]) {
      if (hcpMap[card]) points += hcpMap[card];
    }
  }
  return points;
}

function isValidOpener(hand) {
  const hcp = countHCP(hand);
  const suitLengths = ["♠", "♥", "♦", "♣"].map(suit => (hand[suit] || []).length);
  const shape = [...suitLengths].sort((a, b) => b - a).join("");
  const isBalanced = shape === "4333" || shape === "4432" || shape === "5332";
  const hasSingleton = suitLengths.some(len => len === 1);
  const hasVoid = suitLengths.some(len => len === 0);
  const spades = (hand["♠"] || []).length;
  const hearts = (hand["♥"] || []).length;
  const tooLongMajor = spades > 4 || hearts > 4;

  return (
    hcp >= 16 &&
    hcp <= 18 &&
    isBalanced &&
    !hasSingleton &&
    !hasVoid &&
    !tooLongMajor
  );
}

function startWithSystem(system) {
  console.log("System selected:", system);
  document.getElementById("start-buttons").style.display = "none";
  document.getElementById("hand-display").style.display = "block";

  if (typeof loadNewHand === "function") {
    loadNewHand();
  } else {
    console.error("loadNewHand() is not defined.");
  }
}

function isValidResponder(hand) {
  const hcp = countHCP(hand);
  const spades = (hand["♠"] || []).length;
  const hearts = (hand["♥"] || []).length;

  const has4Major = spades === 4 || hearts === 4;
  const has5PlusMajor = spades > 4 || hearts > 4;

  return (
    (hcp >= 8 && has4Major) ||
    (hcp > 0 && has5PlusMajor)
  );
}

function loadNewHand() {
  let hands;
  let attempts = 0;

  do {
    hands = generateHands();
    attempts++;
  } while (
    (!isValidOpener(hands.opener) || !isValidResponder(hands.responder)) &&
    attempts < 1000
  );

  if (attempts >= 1000) {
    console.warn("Couldn't generate valid hands after 1000 attempts");
  }

  console.log("New hand generated:", hands);

  window.openerHand = hands.opener;
  window.responderHand = hands.responder;

  window.biddingHistory = [{ keith: "1NT", you: "" }];
  userBid = "";
  open2ndbid = "";
  user2ndbid = "";
  user3rdbid = "";

  displayHand("opener-column", window.openerHand);
  displayHand("responder", window.responderHand);
  updateBiddingDisplay();

  const bidRow = document.getElementById("bid-input-row");
  if (bidRow) bidRow.style.display = "block";

  document.getElementById("hand-display").style.display = "block";
}

function displayHand(elementId, hand) {
  const suits = ["♠", "♥", "♦", "♣"];
  const rankOrder = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
  const format = suits.map(suit => {
    const cards = hand[suit] || [];
    const sorted = cards.slice().sort((a, b) => rankOrder.indexOf(a) - rankOrder.indexOf(b));
    const styledCards = sorted.join(" ");
    const colorClass = (suit === "♥" || suit === "♦") ? "hearts" : "blacks";
    return `<div class="${colorClass}">${suit} ${styledCards}</div>`;
  }).join("");
  document.getElementById(elementId).innerHTML = format;
}

function displayHands(opener, responder) {
  displayHand("opener-column", window.openerHand);
  displayHand("responder", window.responderHand);
}

function updateBiddingDisplay() {
  const keithCol = document.getElementById("keith-column");
  const youCol = document.getElementById("you-column");
  keithCol.innerHTML = window.biddingHistory.map(row => row.keith).join("<br>");
  youCol.innerHTML = window.biddingHistory.map(row => row.you).join("<br>");
}

function toggleBiddingControls(enabled) {
    const bidInput = document.getElementById("userBid");
    const submitButton = document.getElementById("submitBtn");
    
    if (enabled) {
        bidInput.removeAttribute("disabled");
        submitButton.removeAttribute("disabled");
    } else {
        bidInput.setAttribute("disabled", "disabled");
        submitButton.setAttribute("disabled", "disabled");
    }
}

function showModal(message) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.style.display = "block";
        toggleBiddingControls(false);  // Disable bidding controls
    }
}

function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none";
        toggleBiddingControls(true);   // Re-enable bidding controls
    }
}

window.showModal = showModal;
window.closeModal = closeModal;
window.startWithSystem = startWithSystem;
window.loadNewHand = loadNewHand;
window.displayHand = displayHand;
window.displayHands = displayHands;
window.updateBiddingDisplay = updateBiddingDisplay;
window.showModal = showModal;
window.closeModal = closeModal;
window.isValidResponder = isValidResponder;
window.isValidOpener = isValidOpener;


console.log("Responder hand =", window.responderHand);
console.log("Opener hand =", window.openerHand);
