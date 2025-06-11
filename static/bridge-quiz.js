class BridgeQuiz {
    constructor() {
        // Show loading indicator immediately
        this.showLoading();
        
        // Initialize quiz data
        this.initializeQuizData()
            .then(() => {
                this.initializeElements();
                this.attachEventListeners();
                this.hideLoading();
            })
            .catch(error => {
                console.error('Error initializing quiz:', error);
                this.handleError('Failed to initialize quiz');
            });
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }

    handleError(message) {
        this.hideLoading();
        alert(message);
    }

    async initializeQuizData() {
        // Simulate loading time for smooth transition
        await new Promise(resolve => setTimeout(resolve, 1000));

this.questions = [
    // Question 1
    {
        hand: {
            spades: "AJT432",
            hearts: "82",
            diamonds: "",
            clubs: "J9654"
        },
        bidding: {
            dealer: "North",
            sequence: [
                ["", "Pass", "1♦", "1NT"],
                ["2♦", "?", "", ""]
            ]
        },
        options: [
            { id: "a", text: "2♥" },
            { id: "b", text: "2♠" },
            { id: "c", text: "4♠" }
        ],
        correct: "c",
        explanation: "North bids 4♠. Partner has shown a balanced 16-18 (or 15-17)...you have a fit...so ADD in your shortage points. Your hand is worth 12 tp, so bid game.",
        fullHand: {
            north: {
                spades: "AJT432",
                hearts: "82",
                diamonds: "",
                clubs: "J9654"
            },
            south: {
                spades: "K973",
                hearts: "AQ3",
                diamonds: "AT82",
                clubs: "K8"
            },
            east: {
                spades: "Q5",
                hearts: "KJ975",
                diamonds: "K",
                clubs: "AQT32"
            },
            west: {
                spades: "86",
                hearts: "T64",
                diamonds: "QJ9765",
                clubs: "97"
            }
        }
    },
    // Question 2
    {
        hand: {
            spades: "AJT8",
            hearts: "QT832",
            diamonds: "853",
            clubs: "Q"
        },
        bidding: {
            dealer: "East",
            sequence: [
                ["", "", "1♣", "Pass"],
                ["1♥", "Pass", "?", ""]
            ]
        },
        options: [
            { id: "a", text: "2♥" },
            { id: "b", text: "3♥" },
            { id: "c", text: "4♥" }
        ],
        correct: "b",
        explanation: "West bids 3♥. ADD in your shortage points when you have 4 or 5 card support for partner's five card suit. Your hand is worth 10tp, so bid 3♥ to show 10-12",
        fullHand: {
            north: {
                spades: "543",
                hearts: "K4",
                diamonds: "96",
                clubs: "AKJ652"
            },
            south: {
                spades: "Q762",
                hearts: "KJT42",
                diamonds: "T743",
                clubs: "98"
            },
            east: {
                spades: "K9",
                hearts: "AJ976",
                diamonds: "AQ7",
                clubs: "T74"
            },
            west: {
                spades: "AJT8",
                hearts: "QT832",
                diamonds: "853",
                clubs: "Q"
            }
        }
    },
    // Question 3
    {
        hand: {
            spades: "QJT9874",
            hearts: "9",
            diamonds: "Q",
            clubs: "J432"
        },
        bidding: {
            dealer: "North",
            sequence: [
                ["", "2♠", "?", ""]
            ]
        },
        options: [
            { id: "a", text: "Pass" },
            { id: "b", text: "4♠" }
        ],
        correct: "a",
        explanation: "South bids Pass. Your hand only revalues to 13 tp, so there is no chance for game. You cannot double dip on the singleton king.",
        fullHand: {
            north: {
                spades: "AK6542",
                hearts: "K8",
                diamonds: "AKQT9",
                clubs: ""
            },
            south: {
                spades: "QJT9874",
                hearts: "9",
                diamonds: "Q",
                clubs: "J432"
            },
            east: {
                spades: "3",
                hearts: "QJ7",
                diamonds: "J6543",
                clubs: "K532"
            },
            west: {
                spades: "",
                hearts: "AT9732",
                diamonds: "872",
                clubs: "AQT98"
            }
        }
    },
    // Question 4
    {
        hand: {
            spades: "AQ6",
            hearts: "75",
            diamonds: "AJ62",
            clubs: "K973"
        },
        bidding: {
            dealer: "West",
            sequence: [
                ["1♣", "Pass", "1♠", "1♥"],
                ["?", "", "", ""]
            ]
        },
        options: [
            { id: "a", text: "Pass" },
            { id: "b", text: "1NT" },
            { id: "c", text: "2♦" }
        ],
        correct: "b",
        explanation: "West bids 1NT. Show a balanced hand with 12-15 hcp and a stopper in hearts.",
        fullHand: {
            north: {
                spades: "54",
                hearts: "T8632",
                diamonds: "87",
                clubs: "T862"
            },
            south: {
                spades: "872",
                hearts: "AJ",
                diamonds: "AQJ",
                clubs: "QT943"
            },
            east: {
                spades: "KJ93",
                hearts: "KQ94",
                diamonds: "KQ94",
                clubs: "5"
            },
            west: {
                spades: "AQ6",
                hearts: "75",
                diamonds: "AJ62",
                clubs: "K973"
            }
        }
    },
    // Question 5
{
    hand: {
        spades: "Q832",
        hearts: "AK8",
        diamonds: "6",
        clubs: "AK976"
    },
    bidding: {
        dealer: "East",
        sequence: [
            ["", "", "1NT", "Pass"],
            ["Pass", "2♣", "Pass", "2♥"],
            ["Pass", "?", "", ""]
        ]
    },
    options: [
        { id: "a", text: "Pass" },
        { id: "b", text: "2♠" },
        { id: "c", text: "3♠" }
    ],
    correct: "c",
    explanation: "East bids either 3♠ (best) or 2♠. You have to try and get in the way of their bidding so that they find it harder to reach slam.",
    fullHand: {
        north: {
            spades: "J76",
            hearts: "543",
            diamonds: "KJT4",
            clubs: "J95"
        },
        south: {
            spades: "94",
            hearts: "Q82",
            diamonds: "9862",
            clubs: "T432"
        },
        east: {
            spades: "AKT5",
            hearts: "JT",
            diamonds: "AQ73",
            clubs: "Q76"
        },
        west: {
            spades: "Q832",
            hearts: "AK8",
            diamonds: "6",
            clubs: "AK976"
        }
    }
},

// Question 6
{
    hand: {
        spades: "AQJ54",
        hearts: "KT3",
        diamonds: "K32",
        clubs: "AT"
    },
    bidding: {
        dealer: "West",
        sequence: [
            ["1♠", "Pass", "2♠", "Pass"],
            ["?", "", "", ""]
        ]
    },
    options: [
        { id: "a", text: "2NT" },
        { id: "b", text: "3♠" },
        { id: "c", text: "3NT" }
    ],
    correct: "b",
    explanation: "West bids 3♦. You want to tell partner that you hold 4 spades without giving up on 6NT if partner cannot fit your spades or diamonds. Bidding 3NT runs the risk of partner passing when they don't hold 4 spades.",
    fullHand: {
        north: {
            spades: "93",
            hearts: "QJ",
            diamonds: "A9765",
            clubs: "K985"
        },
        south: {
            spades: "T872",
            hearts: "A84",
            diamonds: "J4",
            clubs: "7432"
        },
        east: {
            spades: "K6",
            hearts: "97652",
            diamonds: "QT8",
            clubs: "QJ6"
        },
        west: {
            spades: "AQJ54",
            hearts: "KT3",
            diamonds: "K32",
            clubs: "AT"
        }
    }
},

// Question 7
{
    hand: {
        spades: "AT64",
        hearts: "AJ97",
        diamonds: "T84",
        clubs: "A3"
    },
    bidding: {
        dealer: "West",
        sequence: [
            ["1♣", "Pass", "1♥", "Pass"],
            ["1♠", "Pass", "?", ""]
        ]
    },
    options: [
        { id: "a", text: "Pass" },
        { id: "b", text: "3♦" },
        { id: "c", text: "4♥" }
    ],
    correct: "a",
    explanation: "West bids Pass. Partner has shown preference for hearts, but they have already denied three. There is no game, so stop bidding.",
    fullHand: {
        north: {
            spades: "KJ52",
            hearts: "QT4",
            diamonds: "Q2",
            clubs: "KQJ6"
        },
        south: {
            spades: "Q3",
            hearts: "K8652",
            diamonds: "K973",
            clubs: "T4"
        },
        east: {
            spades: "987",
            hearts: "3",
            diamonds: "AJ65",
            clubs: "98752"
        },
        west: {
            spades: "AT64",
            hearts: "AJ97",
            diamonds: "T84",
            clubs: "A3"
        }
    }
},

// Question 8
{
    hand: {
        spades: "JT9873",
        hearts: "K",
        diamonds: "J2",
        clubs: "J432"
    },
    bidding: {
        dealer: "North",
        sequence: [
            ["1NT", "Pass", "2♥", "Pass"],
            ["2♠", "Pass", "?", ""]
        ]
    },
    options: [
        { id: "a", text: "Pass" },
        { id: "b", text: "3♠" },
        { id: "c", text: "4♠" }
    ],
    correct: "a",
    explanation: "North bids Pass. Yes, you have a fit, but your hand is only worth 7 tp, so game is highly unlikely to make.",
    fullHand: {
        north: {
            spades: "65",
            hearts: "QT4",
            diamonds: "QT4",
            clubs: "AQ876"
        },
        south: {
            spades: "JT9873",
            hearts: "K",
            diamonds: "J2",
            clubs: "J432"
        },
        east: {
            spades: "A8753",
            hearts: "K853",
            diamonds: "T5",
            clubs: "42"
        },
        west: {
            spades: "KQ",
            hearts: "AJ962",
            diamonds: "A976",
            clubs: "K9"
        }
    }
},
// Question 9
{
    hand: {
        spades: "53",
        hearts: "KQ942",
        diamonds: "AK987",
        clubs: "A"
    },
    bidding: {
        dealer: "South",
        sequence: [
            ["", "", "", "1♠"],
            ["Pass", "1NT", "Pass", "2♣"],
            ["Pass", "2♥", "Pass", "?"]
        ]
    },
    options: [
        { id: "a", text: "Pass" },
        { id: "b", text: "3♠" },
        { id: "c", text: "4♠" }
    ],
    correct: "a",
    explanation: "South bids Pass. Your hand only revalues to 13 tp, so there is no chance for game. You cannot double dip on the singleton ace.",
    fullHand: {
        north: {
            spades: "Q962",
            hearts: "865",
            diamonds: "JT4",
            clubs: "KQ8"
        },
        south: {
            spades: "53",
            hearts: "KQ942",
            diamonds: "AK987",
            clubs: "A"
        },
        east: {
            spades: "AJ74",
            hearts: "J7",
            diamonds: "53",
            clubs: "97654"
        },
        west: {
            spades: "KT8",
            hearts: "AT3",
            diamonds: "Q62",
            clubs: "JT32"
        }
    }
},

// Question 10
{
    hand: {
        spades: "A962",
        hearts: "AJT",
        diamonds: "A853",
        clubs: "76"
    },
    bidding: {
        dealer: "East",
        sequence: [
            ["", "", "Pass", "1♣"],
            ["Dbl", "1♥", "2♣", "Pass"],
            ["?", "", "", ""]
        ]
    },
    options: [
        { id: "a", text: "Pass" },
        { id: "b", text: "2NT" },
        { id: "c", text: "3NT" }
    ],
    correct: "c",
    explanation: "West bids 3NT. West jumps to game to show 16-18 hcp with a balanced hand.",
    fullHand: {
        north: {
            spades: "QJ5",
            hearts: "J9",
            diamonds: "K9764",
            clubs: "J93"
        },
        south: {
            spades: "K",
            hearts: "Q32",
            diamonds: "T74",
            clubs: "AKT842"
        },
        east: {
            spades: "T8743",
            hearts: "85",
            diamonds: "Q5",
            clubs: "KQ62"
        },
        west: {
            spades: "A962",
            hearts: "AJT",
            diamonds: "A853",
            clubs: "76"
        }
    }
},

// Question 11
{
    hand: {
        spades: "AK93",
        hearts: "Q654",
        diamonds: "AJT86",
        clubs: ""
    },
    bidding: {
        dealer: "South",
        sequence: [
            ["Pass", "1♣", "Pass", "1♥"],
            ["Pass", "?", "", ""]
        ]
    },
    options: [
        { id: "a", text: "2♥" },
        { id: "b", text: "3♥" },
        { id: "c", text: "4♥" }
    ],
    correct: "c",
    explanation: "North bids 4♥. With the heart fit your hand revalues to 19 tp, so bid game!",
    fullHand: {
        north: {
            spades: "AK93",
            hearts: "Q654",
            diamonds: "AJT86",
            clubs: ""
        },
        south: {
            spades: "4",
            hearts: "A87",
            diamonds: "QT752",
            clubs: "JT75"
        },
        east: {
            spades: "4",
            hearts: "953",
            diamonds: "KJT92",
            clubs: "AQ84"
        },
        west: {
            spades: "3",
            hearts: "J86",
            diamonds: "KQ72",
            clubs: "K9632"
        }
    }
},

// Question 12
{
    hand: {
        spades: "K",
        hearts: "K9",
        diamonds: "J9754",
        clubs: "KQT64"
    },
    bidding: {
        dealer: "South",
        sequence: [
            ["Pass", "3♥", "Pass", "?"]
        ]
    },
    options: [
        { id: "a", text: "Pass" },
        { id: "b", text: "3♠" },
        { id: "c", text: "4♥" }
    ],
    correct: "a",
    explanation: "West bids Pass. You have a definite fit, so add in your shortage points. Your hand is now worth 14 tp, but this is not enough for game when partner's range is 8-11.",
    fullHand: {
        north: {
            spades: "AQ8",
            hearts: "J",
            diamonds: "87432",
            clubs: "QT32"
        },
        south: {
            spades: "K",
            hearts: "K9",
            diamonds: "J9754",
            clubs: "KQT64"
        },
        east: {
            spades: "J654",
            hearts: "T32",
            diamonds: "QT96",
            clubs: "A92"
        },
        west: {
            spades: "K6",
            hearts: "AJ5",
            diamonds: "8753",
            clubs: "A87"
        }
    }
}
];

        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.currentlyShowingAnswer = false;
    }

    // ... rest of the existing methods ...
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing quiz');
        window.quiz = new BridgeQuiz();
    } catch (error) {
        console.error('Error initializing quiz:', error);
        document.getElementById('loadingOverlay').classList.add('hidden');
        alert('Failed to initialize quiz. Please refresh the page.');
    }
});
