
function generateOpenerHand(deck) {
  let tries = 0;
  while (tries++ < 1000) {
    const shuffled = shuffle(deck);
    const hand = shuffled.slice(0, 13);
    const hcp = evaluateHCP(hand);
    const suitCounts = countSuits(hand);
    if (
      hcp >= 16 && hcp <= 18 &&
      suitCounts['♠'] <= 4 &&
      suitCounts['♥'] <= 4 &&
      isBalanced(suitCounts)
    ) return hand;
  }
  return null;
}

function evaluateHCP(hand) {
  const hcpTable = { 'A': 4, 'K': 3, 'Q': 2, 'J': 1 };
  return hand.reduce((total, card) => total + (hcpTable[card[0]] || 0), 0);
}

function countSuits(hand) {
  const suits = { '♠': 0, '♥': 0, '♦': 0, '♣': 0 };
  for (const card of hand) {
    suits[card.slice(-1)]++;
  }
  return suits;
}

function isBalanced(counts) {
  const values = Object.values(counts).sort((a, b) => b - a);
  const shape = values.join('');
  return shape === '4432' || shape === '4333' || shape === '5332' &&
         (counts['♣'] === 5 || counts['♦'] === 5);
}

function shuffle(deck) {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Make them global
window.generateOpenerHand = generateOpenerHand;
window.evaluateHCP = evaluateHCP;
window.countSuits = countSuits;
window.isBalanced = isBalanced;
window.shuffle = shuffle;
