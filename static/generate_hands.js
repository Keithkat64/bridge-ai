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
  const hands = generateHands(); // Generate new random opener + responder hands
  if (!hands || !hands.opener || !hands.responder) {
    showModal("Something went wrong generating the hands.");
    return;
  }

  console.log("New hand generated:", hands);

  // Store hands globally so validation runs on correct hand
  window.openerHand = hands.opener;
  window.responderHand = hands.responder;

  // Reset bidding history and user bid variables
  window.biddingHistory = [{ keith: "1NT", you: "" }];
  userBid = "";
  open2ndbid = "";
  user2ndbid = "";
  user3rdbid = "";

  // Update the hand display
  displayHands(window.openerHand, window.responderHand);
  updateBiddingDisplay();

  // Show the hand area if hidden
  document.getElementById("hand-display").style.display = "block";
}

function displayHands(opener, responder) {
  const suits = ["♠", "♥", "♦", "♣"];
  const formatHand = (hand) =>
    suits.map(suit => {
      const cards = hand[suit] || [];
      const text = cards.join(" ");
      return (suit === "♥" || suit === "♦")
        ? `<span class="hearts">${suit} ${text}</span>`
        : `${suit} ${text}`;
    }).join("<br>");

  document.getElementById("opener-column").innerHTML = formatHand(opener);
  document.getElementById("responder").innerHTML = formatHand(responder);
}

function updateBiddingDisplay() {
  const keithCol = document.getElementById("keith-column");
  const youCol = document.getElementById("you-column");
  keithCol.innerHTML = window.biddingHistory.map(row => row.keith).join("<br>");
  youCol.innerHTML = window.biddingHistory.map(row => row.you).join("<br>");
}

// Modal functions
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

// Expose all globally
window.startWithSystem = startWithSystem;
window.loadNewHand = loadNewHand;
window.displayHands = displayHands;
window.updateBiddingDisplay = updateBiddingDisplay;
window.showModal = showModal;
window.closeModal = closeModal;