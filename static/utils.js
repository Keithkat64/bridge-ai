
function calculateHCP(hand) {
  const hcpValues = { 'A': 4, 'K': 3, 'Q': 2, 'J': 1 };
  let total = 0;
  for (const suit in hand) {
    total += hand[suit].reduce((sum, rank) => sum + (hcpValues[rank] || 0), 0);
  }
  return total;
}

function countDoubletons(hand) {
  let count = 0;
  for (const suit in hand) {
    if (hand[suit].length === 2) count++;
  }
  return count;
}

function calculateTotalPoints(hand) {
  const hcp = calculateHCP(hand);
  const sp = countDoubletons(hand);  // shortage points from doubletons
  return hcp + sp;
}

// Make all global
window.calculateHCP = calculateHCP;
window.countDoubletons = countDoubletons;
window.calculateTotalPoints = calculateTotalPoints;
