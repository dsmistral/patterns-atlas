// P20 lab piece 06 — runner and tail verdict
async function labMain() {
  await labLoadPage();
  lab01(); lab02(); lab03(); lab04(); lab05();
  var byPiece = { "00": 0, "01": 0, "02": 0, "03": 0, "04": 0, "05": 0 };
  for (var i = 0; i < L.fails.length; i++) {
    var tag = L.fails[i].slice(0, 2);
    if (byPiece[tag] !== undefined) { byPiece[tag]++; }
  }
  return {
    pass: L.pass, fail: L.fail, total: L.pass + L.fail,
    fails: L.fails, failsByPiece: byPiece,
    verdict: (L.fail === 0) ? "P20 LAB: ALL CHECKS PASS" : "P20 LAB: FAILURES PRESENT"
  };
}
