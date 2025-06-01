let isuser2ndbidvalid = "";
let usermsg2ndbid = "";

function validateSecondBid(responders, open2ndbid, user2ndbid) {
    console.log("Starting validation with:", {
        hcp: responders.hcp,
        hearts: responders.hearts,
        spades: responders.spades,
        clubs: responders.clubs,
        diamonds: responders.diamonds,
        shape: responders.shape,
        shortagePoints: responders.shortagePoints,
        open2ndbid: open2ndbid,
        user2ndbid: user2ndbid
    });

    // RESPONDER HAS 8 OR 9 HCP AND SHOULD BE INVITING GAME
    if (responders.hcp === 8 || responders.hcp === 9) {
        console.log("Checking 8-9 HCP branch");

        if (open2ndbid === "2D") { // opener has no 4 card major
            if (user2ndbid === "2NT") {
                isuser2ndbidvalid = true;
                usermsg2ndbid = "✓ excellent bidding";
            } else {
                isuser2ndbidvalid = false;
                usermsg2ndbid = "❌ Keith would bid 2NT";
            }
            return;
        }

        if (open2ndbid === "2H") {
            if (responders.hearts === 4) { // there is a heart fit, user should bid either 3h OR 4h
                let responders_tp = responders.hcp + responders.shortagePoints;
                if (user2ndbid === "3H") { // correct bid
                    isuser2ndbidvalid = true;
                } else {
                    isuser2ndbidvalid = false;
                    usermsg2ndbid = "Keith would bid 3H";
                }
            } else { // responder has 4 spades
                if (user2ndbid === "2NT") { // correct bid
                    isuser2ndbidvalid = true;
                } else {
                    isuser2ndbidvalid = false;
                    usermsg2ndbid = "Keith would bid 2NT";
                }
            }
            return;
        }

        if (open2ndbid === "2S") {
            if (responders.spades === 4) { // there is a spades fit, user should bid either 3s OR 4s
                let responders_tp = responders.hcp + responders.shortagePoints;
                if (responders_tp === 8 || responders_tp === 9) {
                    if (user2ndbid === "3S") { // correct bid
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3S";
                    }
                }
            } else { // responder has 4 hearts
                if (responders.hcp === 8 || responders.hcp === 9) {
                    if (user2ndbid === "2NT") { // correct bid
                        usermsg2ndbid = "excellent bidding";
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 2NT";
                    }
                }
            }
            return;
        }
    } else {
        // responder has game points
        if (responders.hcp > 9 && responders.hcp < 15) {
            console.log("Checking game points branch (10-14 HCP)");

            if (open2ndbid === "2D") {
                if (responders.clubs > 4) { // responder has 5 clubs
                    if (responders.shape === "5422") { // user should bid 3NT
                        if (user2ndbid === "3NT") {
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "3C is not wrong, but Keith would bid 3NT";
                        }
                    } else { // responder has 5 clubs and a singleton
                        if (user2ndbid === "3C") { // correct
                            isuser2ndbidvalid = true;
                        } else {
                            usermsg2ndbid = "3NT is not wrong, but Keith would bid 3C";
                            isuser2ndbidvalid = false;
                        }
                    }
                }
                if (responders.diamonds > 4) { // responder has 5 diamonds
                    if (responders.shape === "5422") { // user should bid 3NT
                        if (user2ndbid === "3NT") {
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "3D is not wrong, but Keith would bid 3NT";
                        }
                    } else { // responder has 5 diamonds and a singleton
                        if (user2ndbid === "3D") { // correct
                            isuser2ndbidvalid = true;
                        } else {
                            usermsg2ndbid = "3NT is not wrong, but Keith would bid 3D";
                            isuser2ndbidvalid = false;
                        }
                    }
                }
                if (user2ndbid === "3NT") { // correct bid
                    usermsg2ndbid = "excellent bidding";
                } else {
                    isuser2ndbidvalid = false;
                    usermsg2ndbid = "Keith would bid 3NT";
                }
                return;
            }

            if (open2ndbid === "2H") { // opener has 4 hearts
                if (responders.hearts === 4) {
                    let responders_tp = responders.hcp + responders.shortagePoints;
                    if (responders_tp > 14) {
                        if (user2ndbid === "4NT") { // correct, ask for aces
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "Keith would bid 4NT. You should be going to slam";
                        }
                    } else { // responders tp = 10 to 14
                        if (user2ndbid === "4H") { // correct bid
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "Keith would bid 4H";
                        }
                    }
                } else { // responders spades = 4
                    if (responders.clubs > 4) { // responder has 5 clubs
                        if (responders.shape === "5422") { // user should bid 3NT
                            if (user2ndbid === "3NT") {
                                isuser2ndbidvalid = true;
                            } else {
                                isuser2ndbidvalid = false;
                                usermsg2ndbid = "3C is not wrong, but Keith would bid 3NT";
                            }
                        } else { // responder has 4 spades, 5 clubs and a singleton
                            if (user2ndbid === "3C") { // correct
                                isuser2ndbidvalid = true;
                            } else {
                                usermsg2ndbid = "3NT is not wrong, but Keith would bid 3C";
                                isuser2ndbidvalid = false;
                            }
                        }
                    }
                    if (responders.diamonds > 4) { // responder has 5 diamonds
                        if (responders.shape === "5422") { // user should bid 3NT
                            if (user2ndbid === "3NT") {
                                isuser2ndbidvalid = true;
                            } else {
                                isuser2ndbidvalid = false;
                                usermsg2ndbid = "3D is not wrong, but Keith would bid 3NT";
                            }
                        } else { // responder has 4 spades, 5 diamonds and a singleton
                            if (user2ndbid === "3D") { // correct
                                isuser2ndbidvalid = true;
                            } else {
                                usermsg2ndbid = "3NT is not wrong, but Keith would bid 3D";
                                isuser2ndbidvalid = false;
                            }
                        }
                    }
                    if (user2ndbid === "3NT") { // correct bid
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3NT";
                    }
                }
                return;
            }

            if (open2ndbid === "2S") {
                if (responders.spades === 4) {
                    let responders_tp = responders.hcp + responders.shortagePoints;
                    if (responders_tp > 15) {
                        if (user2ndbid === "4NT") { // correct bid
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "Keith would bid 4NT. You should be going to slam";
                        }
                    } else { // responders tp = 10 to 14
                        if (user2ndbid === "4S") { // correct bid
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "Keith would bid 4S";
                        }
                    }
                }
                if (responders.clubs > 4) { // responder has 5 clubs
                    if (responders.shape === "5422") { // user should bid 3NT
                        if (user2ndbid === "3NT") {
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "3C is not wrong, but Keith would bid 3NT";
                        }
                    } else { // responder has 5 clubs and a singleton
                        if (user2ndbid === "3C") { // correct
                            isuser2ndbidvalid = true;
                        } else {
                            usermsg2ndbid = "3NT is not wrong, but Keith would bid 3C";
                            isuser2ndbidvalid = false;
                        }
                    }
                }
                if (responders.diamonds > 4) { // responder has 5 diamonds
                    if (responders.shape === "5422") { // user should bid 3NT
                        if (user2ndbid === "3NT") {
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "3D is not wrong, but Keith would bid 3NT";
                        }
                    } else { // responder has 4 hearts, 5 diamonds and a singleton
                        if (user2ndbid === "3D") { // correct
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "3NT is not wrong, but Keith would bid 3D";
                        }
                    }
                }
                if (user2ndbid === "3NT") { // correct bid
                    isuser2ndbidvalid = true;
                } else {
                    isuser2ndbidvalid = false;
                    usermsg2ndbid = "Keith would bid 3NT";
                }
                return;
            }
        } else { // responders hcp > 14
            console.log("Checking strong hand branch (>14 HCP)");

            if (open2ndbid === "2D") {
                if (responders.clubs > 4) { // responder has 5 clubs
                    if (user2ndbid === "3C") { // correct
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3C";
                    }
                } else {
                    if (responders.diamonds > 4) { // responder has 5 diamonds
                        if (user2ndbid === "3D") { // correct
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "but Keith would bid 3D";
                        }
                    } else {
                        if (user2ndbid === "4NT") { // correct bid
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "Keith would bid 4NT";
                        }
                    }
                }
                return;
            }

            // opener bid 2H
            if (open2ndbid === "2H") { // opener has 4 hearts
                if (responders.hearts === 4) {
                    let responders_tp = responders.hcp + responders.shortagePoints;
                    if (user2ndbid === "4NT") { // correct, ask for aces
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4NT. You should be going to slam";
                    }
                } else { // responders spades = 4
                    if (responders.clubs > 4) { // responder has 5 clubs
                        if (user2ndbid === "3C") {
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "Keith would bid 3C, and then follow up with 4NT";
                        }
                    }

                    if (responders.diamonds > 4) { // responder has 5 diamonds
                        if (user2ndbid === "3D") {
                            isuser2ndbidvalid = true;
                        } else {
                            isuser2ndbidvalid = false;
                            usermsg2ndbid = "Keith would bid 3D, and then follow up with 4NT";
                        }
                    }

                    if (user2ndbid === "4NT") { // correct bid
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4NT";
                    }
                }
                return;
            }

            // opener bid 2S
            if (open2ndbid === "2S") {
                if (responders.spades === 4) {
                    if (user2ndbid === "4NT") {
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4NT. You should be going to slam";
                    }
                }

                if (responders.clubs > 4) { // responder has 5 clubs
                    if (user2ndbid === "3C") { // correct
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3C and then follow up with 4NT";
                    }
                }

                if (responders.diamonds > 4) { // responder has 5 diamonds
                    if (user2ndbid === "3D") { // correct
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3D and then follow up with 4NT";
                    }
                }

                if (user2ndbid === "4NT") { // correct bid
                    isuser2ndbidvalid = true;
                } else {
                    isuser2ndbidvalid = false;
                    usermsg2ndbid = "Keith would bid 4NT";
                }
                return;
            }
        }
    }

    // Add final check for valid bid message
    if (isuser2ndbidvalid === true) {
        usermsg2ndbid = "excellent bidding";
    }
}

window.validateSecondBid = validateSecondBid;