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
  const allSuitsMinTwo = suitLengths.every(len => len >= 2);

  return (
    hcp >= 16 &&
    hcp <= 18 &&
    (hand["♠"] || []).length < 5 &&
    (hand["♥"] || []).length < 5 &&
    isBalanced &&
    allSuitsMinTwo
  );
}
function isStaymanHand(hand) {
  const hcp = countHCP(hand);
  const has4Spades = (hand["♠"] || []).length === 4;
  const has4Hearts = (hand["♥"] || []).length === 4;
  return hcp >= 8 && (has4Spades || has4Hearts);
}

function isTransferHand(hand) {
  const hearts = (hand["♥"] || []).length;
  const spades = (hand["♠"] || []).length;
  return hearts >= 5 || spades >= 5;
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

function loadNewHand() {
  let hands;
  let attempts = 0;

  do {
    hands = generateHands();
    attempts++;
  } while (
    (!isBalancedAndValidOpener(hands.opener) ||
     (!isStaymanHand(hands.responder) && !isTransferHand(hands.responder)))
    && attempts < 50
  );

  if (!hands || !hands.opener || !hands.responder) {
    showModal("Something went wrong generating the hands.");
    return;
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

function showModal(message) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  if (modal && modalMessage) {
    modalMessage.textContent = message;
    modal.style.display = "block";
  }
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }
}

window.startWithSystem = startWithSystem;
window.loadNewHand = loadNewHand;
window.displayHand = displayHand;
window.displayHands = displayHands;
window.updateBiddingDisplay = updateBiddingDisplay;
window.showModal = showModal;
window.closeModal = closeModal;