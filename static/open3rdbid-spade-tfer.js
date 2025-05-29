function calculateOpen3rdBidSpadeTransfer(open2ndbid, user2ndbid, opener) {
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

    // Helper function to calculate total points
    function calculateTP(hand) {
        return calculateHCP(hand) + countDoubletons(hand);
    }

    function countDoubletons(hand) {
        let count = 0;
        for (let suit of Object.keys(hand)) {
            if (hand[suit].length === 2) count++;
        }
        return count;
    }

    function hasStrongMinor(suit) {
        const topHonours = ['A', 'K', 'Q'];
        return suit.filter(card => topHonours.includes(card)).length >= 2;
    }

    const hcp = calculateHCP(opener);
    const tp = calculateTP(opener);
    const spadesLength = opener["♠"]?.length || 0;
    const heartsLength = opener["♥"]?.length || 0;
    const clubsLength = opener["♣"]?.length || 0;
    const diamondsLength = opener["♦"]?.length || 0;

    if (user2ndbid === "PASS") {
        open3rdbid = "PASS";
        return { open3rdbid, user3rdbid };
    }

    switch (user2ndbid) {
        case "3H":
            if (spadesLength > 2) {
                open3rdbid = tp > 17 ? "3S" : "4S";
            } else {
                if (heartsLength === 4) {
                    open3rdbid = "4H";
                } else {
                    open3rdbid = "3NT";
                }
            }
            break;

        case "2NT":
            if (spadesLength > 2) {
                if (tp > 17) {
                    open3rdbid = "4S";
                    user3rdbid = "PASS";
                } else {
                    open3rdbid = "3S";
                }
            } else if (hcp === 18) {
                open3rdbid = "3NT";
                user3rdbid = "PASS";
            } else if (hcp === 17) {
                const clubs = opener["♣"] || [];
                const diamonds = opener["♦"] || [];
                if ((clubs.length === 5 && hasStrongMinor(clubs)) || 
                    (diamonds.length === 5 && hasStrongMinor(diamonds))) {
                    open3rdbid = "3NT";
                    user3rdbid = "PASS";
                } else {
                    open3rdbid = "PASS";
                }
            }
            break;

        case "3S":
            if (spadesLength > 2) {
                if (tp > 17) {
                    open3rdbid = "4S";
                    user3rdbid = "PASS";
                } else {
                    open3rdbid = "PASS";
                }
            } else {
                if (hcp === 18) {
                    open3rdbid = "4S";
                    user3rdbid = "PASS";
                } else {
                    open3rdbid = "PASS";
                }
            }
            break;

        case "4S":
            open3rdbid = "PASS";
            break;

        case "3NT":
            open3rdbid = spadesLength > 2 ? "4S" : "PASS";
            break;

        case "3C":
            if (spadesLength > 2) {
                open3rdbid = tp > 17 ? "3S" : "4S";
            } else {
                open3rdbid = clubsLength > 3 ? "4C" : "3NT";
            }
            break;

        case "3D":
            if (spadesLength > 2) {
                open3rdbid = tp > 17 ? "3S" : "4S";
            } else {
                open3rdbid = diamondsLength > 3 ? "4D" : "3NT";
            }
            break;

        case "4NT":
            // Blackwood handling
            const aceCount = countAces(opener);
            switch (aceCount) {
                case 0: open3rdbid = "5C"; break;
                case 1: open3rdbid = "5D"; break;
                case 2: open3rdbid = "5H"; break;
                case 3: open3rdbid = "5S"; break;
                default: open3rdbid = "5C"; break; // 0 or 4 aces
            }
            break;

        default:
            showModal("You have made an incorrect bid");
            return null;
    }

    return { open3rdbid, user3rdbid };
}

function countAces(hand) {
    if (!hand) return 0;
    return Object.values(hand).flat().filter(card => card === "A").length;
}

// Make functions available globally
window.calculateOpen3rdBidSpadeTransfer = calculateOpen3rdBidSpadeTransfer;
