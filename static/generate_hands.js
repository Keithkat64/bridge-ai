
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
  fetch("https://bridge-ai-production.up.railway.app/api/generate-hands")
    .then(res => res.json())
    .then(data => {
      if (!data.opener || !data.responder) {
        console.error("Invalid hand data from API");
        return;
      }
      displayHands(data.opener, data.responder);
      window.openerHand = data.opener;
      window.responderHand = data.responder;
      window.biddingHistory = [{ keith: "1NT", you: "" }];
      updateBiddingDisplay();
    });
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

// Make globally accessible
window.startWithSystem = startWithSystem;
window.loadNewHand = loadNewHand;
window.displayHands = displayHands;
window.updateBiddingDisplay = updateBiddingDisplay;
