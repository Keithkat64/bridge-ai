let isuser2ndbidvalid = "";
let usermsg2ndbid = "";

function validateSecondBid(responders, open2ndbid, user2ndbid) {
    if (responders.hcp === 8 || responders.hcp === 9) {
        if (open2ndbid === "2D") { // opener has no 4 card major
            if (user2ndbid === "2NT") {
                isuser2ndbidvalid = true;
                usermsg2ndbid = "✓ excellent bidding";
            } else {
                isuser2ndbidvalid = false;
                usermsg2ndbid = "❌ Keith would bid 2NT";
            }
        }

        if (open2ndbid === "2H") {
            if (responders.hearts === 4) { // there is a heart fit
                let responders_tp = responders.hcp + responders.shortagePoints;
                
                if (responders_tp === 8 || responders_tp === 9) {
                    if (user2ndbid === "3H") {
                        isuser2ndbidvalid = true;
                        usermsg2ndbid = "excellent bidding";
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3H";
                    }
                }
                
                if (responders_tp > 9 && responders_tp < 15) {
                    if (user2ndbid === "4H") {
                        isuser2ndbidvalid = true;
                        usermsg2ndbid = "excellent bidding";
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4H";
                    }
                }
                
                if (responders_tp > 15) {
                    if (user2ndbid === "4NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "❌ Keith would bid 4NT";
                    }
                }
            }

            // responder has 4 spades
            if (responders.spades === 4) {
                if (responders.hcp === 8 || responders.hcp === 9) {
                    if (user2ndbid === "2NT") {
                        usermsg2ndbid = "✓ excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "❌ Keith would bid 2NT";
                    }
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
                        } else { // responder has 4 spades, 5 clubs and a singleton
                            if (user2ndbid === "3C") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                usermsg2ndbid = "3NT is not wrong, but Keith would bid 3C";
                                isuser2ndbidvalid = false;
                            }
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
                        } else { // responder has 4 spades, 5 diamonds and a singleton
                            if (user2ndbid === "3D") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                usermsg2ndbid = "3NT is not wrong, but Keith would bid 3D";
                                isuser2ndbidvalid = false;
                            }
                        }
                    }

                    if (user2ndbid === "3NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3NT";
                    }
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
                    }

                    if (responders.diamonds > 4) {
                        if (user2ndbid === "3D") {
                            usermsg2ndbid = "excellent bidding";
                            isuser2ndbidvalid = true;
                        } else {
                            usermsg2ndbid = "4NT is not wrong, but Keith would bid 3D";
                            isuser2ndbidvalid = false;
                        }
                    }

                    if (user2ndbid === "4NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4NT";
                    }
                }
            }
        }

        if (open2ndbid === "2S") {
            if (responders.spades === 4) { // there is a spade fit
                let responders_tp = responders.hcp + responders.shortagePoints;
                
                if (responders_tp === 8 || responders_tp === 9) {
                    if (user2ndbid === "3S") {
                        isuser2ndbidvalid = true;
                        usermsg2ndbid = "excellent bidding";
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 3S";
                    }
                }

                if (responders_tp > 9 && responders_tp < 15) {
                    if (user2ndbid === "4S") {
                        isuser2ndbidvalid = true;
                        usermsg2ndbid = "excellent bidding";
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4S";
                    }
                }

                if (responders_tp > 15) {
                    if (user2ndbid === "4NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4NT";
                    }
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
                        } else { // responder has 5 clubs and a singleton
                            if (user2ndbid === "3C") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                usermsg2ndbid = "3NT is not wrong, but Keith would bid 3C";
                                isuser2ndbidvalid = false;
                            }
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
                        } else { // responder has 4 hearts, 5 diamonds and a singleton
                            if (user2ndbid === "3D") {
                                usermsg2ndbid = "excellent bidding";
                                isuser2ndbidvalid = true;
                            } else {
                                usermsg2ndbid = "3NT is not wrong, but Keith would bid 3D";
                                isuser2ndbidvalid = false;
                            }
                        }
                    }

                    if (user2ndbid === "3NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 2NT";
                    }
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
                    }

                    if (responders.diamonds > 4) {
                        if (user2ndbid === "3D") {
                            usermsg2ndbid = "excellent bidding";
                            isuser2ndbidvalid = true;
                        } else {
                            usermsg2ndbid = "4NT is not wrong, but Keith would bid 3D";
                            isuser2ndbidvalid = false;
                        }
                    }

                    if (user2ndbid === "4NT") {
                        usermsg2ndbid = "excellent bidding";
                        isuser2ndbidvalid = true;
                    } else {
                        isuser2ndbidvalid = false;
                        usermsg2ndbid = "Keith would bid 4NT";
                    }
                }
            }
        }
    }
}
window.validateSecondBid = validateSecondBid;
