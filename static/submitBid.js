function createRespondersObject(responderHand) {
    return {
        hcp: countHCP(responderHand),
        hearts: responderHand["♥"].length,
        spades: responderHand["♠"].length,
        clubs: responderHand["♣"].length,
        diamonds: responderHand["♦"].length,
        shape: getHandShape(responderHand),
        shortagePoints: calculateShortagePoints(responderHand)
    };
}

function getHandShape(hand) {
    const lengths = [
        hand["♠"].length,
        hand["♥"].length,
        hand["♦"].length,
        hand["♣"].length
    ].sort((a, b) => b - a);  // Sort in descending order
    return lengths.join("");
}

function showAnalysisModal() {
    if (keithIsTesting === "Y") {
        console.log("Showing analysis modal");
        // Hide bid another hand button
        document.querySelector('.button-container button').style.display = 'none';
        
        // Show analysis modal
        showModal("Do you want Keith to analyse the bidding?");
        
        // Clear any existing buttons
        const modalDiv = document.getElementById('modal');
        while (modalDiv.querySelector('button')) {
            modalDiv.querySelector('button').remove();
        }
        
        // Add Yes/No buttons
        const yesButton = document.createElement('button');
        yesButton.className = 'fancy-button';
        yesButton.textContent = 'YES';
        yesButton.onclick = function() {
            console.log("Yes button clicked");
            closeModal();
            console.log("Creating responders object from:", window.responderHand);
            const responders = createRespondersObject(window.responderHand);
            console.log("Created responders object:", responders);
            console.log("open2ndbid:", open2ndbid);
            console.log("user2ndbid:", user2ndbid);
            validateSecondBid(responders, open2ndbid, user2ndbid);
            console.log("After validateSecondBid call");
            console.log("isuser2ndbidvalid:", isuser2ndbidvalid);
            console.log("usermsg2ndbid:", usermsg2ndbid);
            document.querySelector('.button-container button').style.display = 'block';
        };
        
        const noButton = document.createElement('button');
        noButton.className = 'fancy-button';
        noButton.textContent = 'NO';
        noButton.onclick = function() {
            console.log("No button clicked");
            closeModal();
            document.querySelector('.button-container button').style.display = 'block';
        };
        
        modalDiv.appendChild(yesButton);
        modalDiv.appendChild(noButton);
    } else {
        showModal("Bidding finished.");
    }
}


function submitBid() {
    // Get bid input from either mobile or desktop version
    const bidInput = document.getElementById("mobile-userBid") || document.getElementById("desktop-userBid") || document.getElementById("userBid");
    const bid = bidInput.value.trim().toUpperCase();
    if (!bid) return;

    bidInput.value = "";
    userBid = bid;

    if (!Array.isArray(window.biddingHistory)) {
        window.biddingHistory = [{ keith: "1NT", you: "" }];
    }

    const history = window.biddingHistory;

    // Function to update all versions of an element
    function updateElement(baseId, content) {
        const ids = [`mobile-${baseId}`, `desktop-${baseId}`, baseId];
        ids.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.innerHTML = content;
        });
    }

    // Function to show/hide elements across versions
    function updateElementDisplay(baseId, display) {
        const ids = [`mobile-${baseId}`, `desktop-${baseId}`, baseId];
        ids.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.style.display = display;
        });
    }

    // Check if user bid PASS and end bidding if they did
    if (bid === "PASS") {
        const currentBidIndex = history.findIndex(h => !h.you);
        if (currentBidIndex !== -1) {
            history[currentBidIndex].you = "PASS";
            updateBiddingDisplay();
            showOpenersHand();
            showAnalysisModal();
            updateElementDisplay("bid-input-row", "none");
            return;
        }
    }

    if (history.length === 1 && !history[0].you) {
        if (!responderHand || !responderHand["♠"] || !responderHand["♥"]) {
            console.error("Responder hand is not properly set before validation:", responderHand);
            showModal("Something went wrong. Please try a new hand.");
            return;
        }

        user1stbid = bid;
        validuser1stbid = validateUser1stBid(user1stbid, responderHand);
        console.log("Validation result:", validuser1stbid);

        if (validuser1stbid === true) {
            open2ndbid = getOpen2ndBid("1NT", user1stbid, openerHand);
            history[0].you = user1stbid;
            history.push({ keith: open2ndbid, you: "" });
            updateBiddingDisplay();
        }
    } else if (history.length === 2 && !history[1].you) {
        user2ndbid = bid;
        
        if (bid === "PASS") {
            history[1].you = "PASS";
            updateBiddingDisplay();
            showOpenersHand();
            showAnalysisModal();
            updateElementDisplay("bid-input-row", "none");
            return;
        }
        
        // Handle transfers differently from Stayman
        if (user1stbid === "2D") {  // Heart transfer
            console.log("Heart transfer path");
            validuser2ndbid = validateUser2ndBidHeartTransfer(user2ndbid, open2ndbid);
            if (validuser2ndbid) {
                const result = calculateOpen3rdBidHeartTransfer(open2ndbid, user2ndbid, openerHand);
                open3rdbid = result.open3rdbid;
                user3rdbid = result.user3rdbid;
                history[1].you = user2ndbid;
                history.push({ keith: open3rdbid, you: "" });
                updateBiddingDisplay();
            }
        } else if (user1stbid === "2H") {  // Spade transfer
            console.log("Spade transfer path");
            validuser2ndbid = validateUser2ndBidSpadeTransfer(user2ndbid, open2ndbid);
            if (validuser2ndbid) {
                const result = calculateOpen3rdBidSpadeTransfer(open2ndbid, user2ndbid, openerHand);
                open3rdbid = result.open3rdbid;
                user3rdbid = result.user3rdbid;
                history[1].you = user2ndbid;
                history.push({ keith: open3rdbid, you: "" });
                updateBiddingDisplay();
            }
        } else {  // Stayman sequence
            validuser2ndbid = validateUser2ndBid(user2ndbid, open2ndbid);
            if (validuser2ndbid) {
                const result = calculateOpen3rdBid(open2ndbid, user2ndbid, openerHand);
                open3rdbid = result.open3rdbid;
                history[1].you = user2ndbid;
                history.push({ keith: open3rdbid, you: "" });
                updateBiddingDisplay();
            }
        }
    } else if (history.length === 3 && !history[2].you) {
        user3rdbid = bid;
        
        if (bid === "PASS") {
            history[2].you = "PASS";
            updateBiddingDisplay();
            showOpenersHand();
            showAnalysisModal();
            updateElementDisplay("bid-input-row", "none");
            return;
        }
        
        console.log("Processing third bid:", bid);
        validuser3rdbid = validateUser3rdBid(user3rdbid, responderHand, open3rdbid);
        console.log("Third bid validation result:", validuser3rdbid);
        if (validuser3rdbid) {
            console.log("Calculating opener's fourth bid...");
            const result = calculateOpen4thBid(open3rdbid, user3rdbid, openerHand);
            console.log("Fourth bid result:", result);
            open4thbid = result.open4thbid;
            history[2].you = user3rdbid;
            history.push({ keith: open4thbid, you: "" });
            updateBiddingDisplay();
        }
    } else if (history.length === 4 && !history[3].you) {
        user4thbid = bid;
        
        if (bid === "PASS") {
            history[3].you = "PASS";
            updateBiddingDisplay();
            showOpenersHand();
            showAnalysisModal();
            updateElementDisplay("bid-input-row", "none");
            return;
        }
        
        validuser4thbid = validateUser4thBid(user4thbid, responderHand, open4thbid);
        if (validuser4thbid) {
            if (user4thbid === "5NT") {
                const result = calculateOpen5thBid(open4thbid, user4thbid, openerHand);
                open5thbid = result.open5thbid;
                history[3].you = user4thbid;
                history.push({ keith: open5thbid, you: "" });
                updateBiddingDisplay();
            } else {
                open5thbid = getOpen5thBid(open4thbid, user4thbid, openerHand);
                history[3].you = user4thbid;
                history.push({ keith: open5thbid, you: "" });
                updateBiddingDisplay();
            }
        }
    } else if (history.length === 5 && !history[4].you) {
        user5thbid = bid;
        validuser5thbid = validateUser5thBid(user5thbid, responderHand, open5thbid);
        if (validuser5thbid) {
            open6thbid = "PASS";
            history[4].you = user5thbid;
            history.push({ keith: open6thbid, you: "" });
            updateBiddingDisplay();
            showAnalysisModal();
        }
    }

    if (isBiddingFinished()) {
        updateElementDisplay("bid-input-row", "none");
    }
}

function isBiddingFinished() {
    const passExists = window.biddingHistory.some(bid => 
        bid.keith === "PASS" || bid.you === "PASS"
    );
    
    if (passExists) {
        showOpenersHand();
        if (keithIsTesting === "Y") {
            showAnalysisModal();  // Add this line
        }
    }
    
    return passExists;
}


function showOpenersHand() {
    // First, show the container on mobile
    const openerTd = document.getElementById("opener-td");
    if (openerTd) {
        openerTd.classList.add("show-opener-mobile");
    }

    // Then, after a small delay, show the hand itself
    setTimeout(() => {
        const openerColumn = document.getElementById("opener-column");
        if (openerColumn) {
            openerColumn.classList.remove("hidden-hand");
        }
        
        // Force a redraw for mobile devices
        if (window.innerWidth <= 768) {
            window.dispatchEvent(new Event('resize'));
        }
    }, 100);
}

function updateBiddingDisplay() {
    const keithContent = window.biddingHistory.map(bid => bid.keith).filter(Boolean).join('<br>');
    const youContent = window.biddingHistory.map(bid => bid.you).filter(Boolean).join('<br>');
    
    // Update both mobile and desktop versions
    ['mobile-keith-column', 'desktop-keith-column', 'keith-column'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = keithContent;
    });
    
    ['mobile-you-column', 'desktop-you-column', 'you-column'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = youContent;
    });
}

window.submitBid = submitBid;
window.showOpenersHand = showOpenersHand;
window.updateBiddingDisplay = updateBiddingDisplay;
