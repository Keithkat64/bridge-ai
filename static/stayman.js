// stayman-logic.js
export function runStayman(opener, responder) {
  const hcp = responder.hcp;
  const suits = responder.suits;

  const has4H = suits['♥'] === 4;
  const has4S = suits['♠'] === 4;

  if (!(has4H || has4S)) {
    return {
      error: "Keith would choose transfers here",
      redirectTo: "transfers"
    };
  }

  const responderBid = "2C";
  let openerBid;

  if (opener.suits['♥'] === 4) {
    openerBid = "2H";
  } else if (opener.suits['♠'] === 4) {
    openerBid = "2S";
  } else {
    openerBid = "2D";
  }

  return {
    responderBid,
    openerBid,
    nextStep: "awaitResponderRebid"
  };
}
