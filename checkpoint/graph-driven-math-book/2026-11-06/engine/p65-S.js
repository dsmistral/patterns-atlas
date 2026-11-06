/* piece S - census-vs-frozen-page checker for the frozen P65 page. Runs against
   globalThis.PAGE_TEXT (set by the freeze runner before loading pieces); if unset, emits an
   armed note and exits. The census receipts (complete: circles 0/0/2/6/10, prediction met
   5/5) are frozen in the table below. S first re-derives every table entry from the closed
   forms (omega0 = 4*pi^2*sqrt(eps*delta); max/min det 4*sin^2(omega0/2); saddle det
   2 - 2*cosh(omega0); predicted circles 2*floor(2*pi*sqrt(eps*delta)); threshold
   1/(4*pi^2) = 0.02533; pair-5 log-model delta 73*e^(-omega0/2) vs the found 5.01e-6), so
   the frozen table the page is checked against is itself re-validated; then S extracts
   the page's claimed census numbers and cross-checks them against the table.
   Frozen on-page contracts (page authoring must match exactly):
   - S02 tally "0, 0, 2, 6, 10"
   - S03 dets "1.9164" "2.8303" "3.3844" "49.843" "3.9401" "15836" "0.2361" "2.509" with
     "10^{8}", and "2.0866" "2.212" with "10^{14}"
   - S04 k-classifications "k = 1" x >= 3, "k = 1, 2, 3" x >= 2, "k = 1, 2, 3, 4, 5" x >= 1
   - S05 detector-edge honest notes "read 0", "starts and ends", "0.300005", "5.01"
   - S06 threshold and fixed-set claims "1/(4\pi^2)", "0.0253", "Betti", "transverse"
   No recursion, no BigInt. */
(function () {
  var T = globalThis.PAGE_TEXT || "";
  if (!T) {
    vCheck("S00", true, "PAGE_TEXT not set at load: S is armed and will cross-check the frozen page at freeze time (the freeze runner sets globalThis.PAGE_TEXT before loading pieces)");
    globalThis.__S = { ran: false, checks: OUT };
    return;
  }
  function occ(h, s) { return h.split(s).length - 1; }
  var PI = Math.PI, i;
  var pairs = [[0.05, 0.03], [0.1, 0.1], [0.3, 0.2], [0.6, 0.4], [1.0, 0.7]];
  var fzMax = [1.9164, 3.3844, 3.9401, 0.2361, 2.0866];
  var fzSad = [-2.8303, -49.843, -15836.5, -2.5086e8, -2.2118e14];
  var tolMax = [5.5e-5, 5.5e-5, 5.5e-5, 5.5e-5, 5.5e-5];
  var tolSad = [5.5e-4, 5.5e-4, 0.55, 5.5e3, 5.5e10];
  var fzCirc = [0, 0, 2, 6, 10];
  var s1 = true, n1 = [];
  for (i = 0; i < 5; i++) {
    var om = 4 * PI * PI * Math.sqrt(pairs[i][0] * pairs[i][1]);
    var dm = 4 * Math.sin(om / 2) * Math.sin(om / 2);
    var ds = 2 - 2 * Math.cosh(om);
    var kc = 2 * Math.floor(2 * PI * Math.sqrt(pairs[i][0] * pairs[i][1]));
    if (Math.abs(dm - fzMax[i]) > tolMax[i] || Math.abs(ds - fzSad[i]) > tolSad[i] || kc !== fzCirc[i]) {
      s1 = false;
      n1.push("pair " + (i + 1) + " fresh " + dm.toFixed(4) + " / " + ds.toPrecision(6) + " k " + kc + " vs frozen " + fzMax[i] + " / " + fzSad[i] + " / " + fzCirc[i]);
    }
  }
  var thr = 1 / (4 * PI * PI);
  if (Math.abs(thr - 0.0253) > 6e-5) { s1 = false; n1.push("threshold " + thr.toFixed(6)); }
  var d5 = 73 * Math.exp(-2 * PI * PI * Math.sqrt(0.7));
  var off5 = Math.abs(d5 / 5.01e-6 - 1);
  if (off5 > 0.05) { s1 = false; n1.push("log-model delta " + d5.toExponential(3)); }
  if (Math.abs((0.300005 - 5.01e-6) - 0.3) > 1e-6) { s1 = false; n1.push("E* minus delta is not the separatrix 0.3"); }
  if (Math.abs(2.5086e8 / 2.509e8 - 1) > 2e-4 || Math.abs(2.2118e14 / 2.212e14 - 1) > 2e-4) { s1 = false; n1.push("4-s.f. page render off the table"); }
  vCheck("S01", s1, "frozen table re-derived from the closed forms (omega0 = 4*pi^2*sqrt(eps*delta)): " + (s1 ? "all five pairs match (dets within print precision, predicted circles 2*floor(2*pi*sqrt(eps*delta)) = 0/0/2/6/10), threshold " + thr.toFixed(5) + ", pair-5 log-model delta " + d5.toExponential(2) + " = " + (100 * off5).toFixed(1) + "% off the found 5.01e-6 (< 5%)" : "MISMATCH: " + n1.join("; ")));
  var tally = T.indexOf("0, 0, 2, 6, 10") >= 0;
  vCheck("S02", tally, "census tally on page: " + (tally ? "claimed 0, 0, 2, 6, 10 circles per pair - matches the machine census (receipts frozen, prediction met 5/5)" : "the tally string '0, 0, 2, 6, 10' was NOT found - the page's claimed circle counts do not match the machine census"));
  var toks = ["1.9164", "2.8303", "3.3844", "49.843", "3.9401", "15836", "0.2361", "2.509", "10^{8}", "2.0866", "2.212", "10^{14}"], miss = [];
  for (i = 0; i < toks.length; i++) { if (T.indexOf(toks[i]) < 0) { miss.push(toks[i]); } }
  vCheck("S03", miss.length === 0, "per-pair determinants on page: " + (miss.length === 0 ? "all ten det claims present, matching the receipts (+1.9164/-2.8303, +3.3844/-49.843, +3.9401/-15836.5, +0.2361/-2.509e8, +2.0866/-2.212e14) with the magnitude pins" : "MISSING from the page: " + miss.join(", ") + " (machine: +1.9164/-2.8303, +3.3844/-49.843, +3.9401/-15836.5, +0.2361/-2.509e8, +2.0866/-2.212e14)"));
  var k1 = occ(T, "k = 1"), k4 = occ(T, "k = 1, 2, 3"), k5 = occ(T, "k = 1, 2, 3, 4, 5");
  vCheck("S04", k5 >= 1 && k4 >= 2 && k1 >= 3, "k-classifications on page: 'k = 1' x" + k1 + " (>= 3: pair-3 claim + list heads), 'k = 1, 2, 3' x" + k4 + " (>= 2: pair-4 claim + pair-5 list head), 'k = 1, 2, 3, 4, 5' x" + k5 + " (>= 1: pair-5 claim) - machine: pair 3 k = 1, pair 4 k = 1, 2, 3, pair 5 k = 1, 2, 3, 4, 5");
  var h1 = occ(T, "read 0"), h2 = occ(T, "starts and ends"), h3 = occ(T, "0.300005"), h4 = occ(T, "5.01");
  vCheck("S05", h1 >= 1 && h2 >= 1 && h3 >= 1 && h4 >= 1, "detector-edge honest notes on page: counter 'read 0' x" + h1 + " (pair-4 k = 1, the T = 1 endpoint edge), 'starts and ends' x" + h2 + ", 'E = 0.300005' x" + h3 + " and delta '5.01' x" + h4 + " (pair-5 k = 1 at machine resolution, log-model predicted 5e-6)");
  var c1 = occ(T, "1/(4\\pi^2)"), c2 = occ(T, "0.0253"), c3 = occ(T, "Betti"), c4 = occ(T, "transverse");
  vCheck("S06", c1 >= 1 && c2 >= 1 && c3 >= 1 && c4 >= 1, "threshold and fixed-set claims on page: '1/(4\\pi^2)' x" + c1 + ", '0.0253' x" + c2 + " (fresh " + thr.toFixed(5) + "), 'Betti' x" + c3 + " (fixed set = 4 = sum of Betti, pairs 1-2 with equality), 'transverse' x" + c4);
  globalThis.__S = { ran: true, checks: OUT };
})();
