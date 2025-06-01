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

    if (responders.hcp === 8 || responders.hcp === 9) {
        console.log("Entering HCP 8-9 block");
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
            console.log("Opener bid 2H");
            if (responders.hearts === 4) { // there is a heart fit
                let responders_tp = responders.hcp + responders.shortagePoints;
                console.log("Heart fit found, total points:", responders_tp);
                
                if (responders_tp === 8 || responders_tp === 9) {
                    if (user2ndbid === "3H") {
                        isuser2ndbidvalid = true;
                        usermsg2ndbid = "excellent bidding";
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3H";
                    }
                    return;
                }
                
                if (responders_tp > 9 && responders_tp < 15) {
                    if (user2ndbid === "4H") {
                        isuser2ndbidvalid = true;
                        usermsg2ndbid = "excellent bidding";
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4H";
                    }
                    return;
                }
                
                if (responders_tp > 15) {
                    if (user2ndbid === "4NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "❌ Keith would bid 4NT";
                    }
                    return;
                }
            }

            // responder has 4 spades
            if (responders.spades === 4) {
                console.log("4 spades found");
                if (responders.hcp === 8 || responders.hcp === 9) {
                    if (user2ndbid === "2NT") {
                        usermsg2ndbid = "✓ excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "❌ Keith would bid 2NT";
                    }
                    return;
                }

                if (responders.hcp > 9 && responders.hcp < 15) {
                    if (responders.clubs > 4) {
                        if (responders.shape === "5422") {
                            if (user2ndbid === "3NT") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                isuser2ndbidvalid = false;
                                usermsg2ndbid = "3C is not wrong, but Keith would bid 3NT";
                            }
                            return;
                        } else { // responder has 4 spades, 5 clubs and a singleton
                            if (user2ndbid === "3C") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                usermsg2ndbid = "3NT is not wrong, but Keith would bid 3C";
                                isuser2ndbidvalid = false;
                            }
                            return;
                        }
                    }

                    if (responders.diamonds > 4) {
                        if (responders.shape === "5422") {
                            if (user2ndbid === "3NT") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                isuser2ndbidvalid = false;
                                usermsg2ndbid = "3D is not wrong, but Keith would bid 3NT";
                            }
                            return;
                        } else { // responder has 4 spades, 5 diamonds and a singleton
                            if (user2ndbid === "3D") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                usermsg2ndbid = "3NT is not wrong, but Keith would bid 3D";
                                isuser2ndbidvalid = false;
                            }
                            return;
                        }
                    }

                    if (user2ndbid === "3NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3NT";
                    }
                    return;
                }

                if (responders.hcp > 15) {
                    if (responders.clubs > 4) {
                        if (user2ndbid === "3C") {
                            usermsg2ndbid = "excellent bidding";
                            isuser2ndbidvalid = true;
                        } else {
                            usermsg2ndbid = "4NT is not wrong, but Keith would bid 3C";
                            isuser2ndbidvalid = false;
                        }
                        return;
                    }

                    if (responders.diamonds > 4) {
                        if (user2ndbid === "3D") {
                            usermsg2ndbid = "excellent bidding";
                            isuser2ndbidvalid = true;
                        } else {
                            usermsg2ndbid = "4NT is not wrong, but Keith would bid 3D";
                            isuser2ndbidvalid = false;
                        }
                        return;
                    }

                    if (user2ndbid === "4NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4NT";
                    }
                    return;
                }
            }
        }

        if (open2ndbid === "2S") {
            if (responders.spades === 4) { // there is a spade fit
                let responders_tp = responders.hcp + responders.shortagePoints;
                console.log("Spade fit found, total points:", responders_tp);
                
                if (responders_tp === 8 || responders_tp === 9) {
                    if (user2ndbid === "3S") {
                        isuser2ndbidvalid = true;
                        usermsg2ndbid = "excellent bidding";
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3S";
                    }
                    return;
                }

                if (responders_tp > 9 && responders_tp < 15) {
                    if (user2ndbid === "4S") {
                        isuser2ndbidvalid = true;
                        usermsg2ndbid = "excellent bidding";
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4S";
                    }
                    return;
                }

                if (responders_tp > 15) {
                    if (user2ndbid === "4NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4NT";
                    }
                    return;
                }
            }

            // responder has 4 hearts
            if (responders.hearts === 4) {
                if (responders.hcp === 8 || responders.hcp === 9) {
                    if (user2ndbid === "2NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 2NT";
                    }
                    return;
                }

                if (responders.hcp > 9 && responders.hcp < 15) {
                    if (responders.clubs > 4) {
                        if (responders.shape === "5422") {
                            if (user2ndbid === "3NT") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                isuser2ndbidvalid = false;
                                usermsg2ndbid = "3C is not wrong, but Keith would bid 3NT";
                            }
                            return;
                        } else { // responder has 5 clubs and a singleton
                            if (user2ndbid === "3C") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                usermsg2ndbid = "3NT is not wrong, but Keith would bid 3C";
                                isuser2ndbidvalid = false;
                            }
                            return;
                        }
                    }

                    if (responders.diamonds > 4) {
                        if (responders.shape === "5422") {
                            if (user2ndbid === "3NT") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                isuser2ndbidvalid = false;
                                usermsg2ndbid = "3D is not wrong, but Keith would bid 3NT";
                            }
                            return;
                        } else { // responder has 4 hearts, 5 diamonds and a singleton
                            if (user2ndbid === "3D") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                usermsg2ndbid = "3NT is not wrong, but Keith would bid 3D";
                                isuser2ndbidvalid = false;
                            }
                            return;
                        }
                    }

                    if (user2ndbid === "3NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 2NT";
                    }
                    return;
                }

                if (responders.hcp > 15) {
                    if (responders.clubs > 4) {
                        if (user2ndbid === "3C") {
                            usermsg2ndbid = "excellent bidding";
                            isuser2ndbidvalid = true;
                        } else {
                            usermsg2ndbid = "4NT is not wrong, but Keith would bid 3C";
                            isuser2ndbidvalid = false;
                        }
                        return;
                    }

                    if (responders.diamonds > 4) {
                        if (user2ndbid === "3D") {
                            usermsg2ndbid = "excellent bidding";
                            isuser2ndbidvalid = true;
                        } else {
                            usermsg2ndbid = "4NT is not wrong, but Keith would bid 3D";
                            isuser2ndbidvalid = false;
                        }
                        return;
                    }

                    if (user2ndbid === "4NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4NT";
                    }
                    return;
                }
            }
        }
    } else {
        // Add this else block to handle cases where HCP > 9
        if (open2ndbid === "2H" && responders.hearts === 4) {
            let responders_tp = responders.hcp + responders.shortagePoints;
            console.log("Heart fit found (HCP > 9), total points:", responders_tp);
            
            if (responders_tp > 9 && responders_tp < 15) {
                if (user2ndbid === "4H") {
                    isuser2ndbidvalid = true;
                    usermsg2ndbid = "excellent bidding";
                } else {
                    isuser2ndbidvalid = false;
                    usermsg2ndbid = "Keith would bid 4H";
                }
                return;
            }
            
            if (responders_tp > 15) {
                if (user2ndbid === "4NT") {
                    usermsg2ndbid = "excellent bidding";
                    isuser2ndbidvalid = true;
                } else {
                    isuser2ndbidvalid = false;
                    usermsg2ndbid = "❌ Keith would bid 4NT";
                }
                return;
            }
        }
    }
    console.log("No validation rule matched");
}

window.validateSecondBid = validateSecondBid;
