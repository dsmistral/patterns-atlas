LAB.p09 = function (page) {
  var B = [6, 2], Bp = [6, -2];
  LAB.ck((B[0] + Bp[0]) / 2 === 6 && (B[1] + Bp[1]) / 2 === 0, "p09 the river bisects BB': midpoint (6, 0) on the bank exactly");
  LAB.ck(B[0] === Bp[0], "p09 BB' is perpendicular to the bank (vertical against horizontal)");
  var x, mism = 0, viol = 0;
  for (x = 0; x <= 6.001; x += 0.5) {
    if (Math.abs(Math.hypot(6 - x, 2) - Math.hypot(6 - x, -2)) > 1e-12) mism++;
    var d1 = Math.hypot(x, 4), d2 = Math.hypot(6 - x, 2), ABp = Math.hypot(6, -6);
    if (d1 + d2 < ABp - 1e-12) viol++;
  }
  LAB.ck(mism === 0, "p09 mirror-twin legs: |(x,0)\u2192B| = |(x,0)\u2192B'| over the 13-point grid, 0 mismatches");
  LAB.ck(viol === 0, "p09 triangle inequality: no broken path A\u2192bank\u2192B' beats the straight line |AB'| = 6\u221a2 (0 violations)");
  var e4 = Math.hypot(4, 4) + Math.hypot(2, 2), e39 = Math.hypot(3.9, 4) + Math.hypot(2.1, 2);
  LAB.ck(Math.abs(e4 - Math.hypot(6, -6)) < 1e-15 && e39 > Math.hypot(6, -6), "p09 equality only at x = 4 (x = 3.9 already loses by " + (e39 - Math.hypot(6, -6)).toExponential(3) + ")");
};

LAB.p10 = function (page) {
  var claims = [
    "6\\sqrt{2} \\approx 8.4853", "10.5262", "8.6056", "53.1301024", "36.8698976",
    "67.3801351", "22.6198649", "1.776 \\times 10^{-15}", "8.9 \\times 10^{-16}",
    "1.3 \\times 10^{-5}", "1{,}089", "625", "995", "2{,}580", "5{,}300", "33\\%",
    "15{,}941", "26{,}614", "36.8698976"
  ];
  var missing = [];
  for (var i = 0; i < claims.length; i++) if (page.indexOf(claims[i]) === -1) missing.push(claims[i]);
  LAB.ck(missing.length === 0, "p10 all cited values appear on the page verbatim" + (missing.length ? " \u2014 MISSING: " + missing.join(", ") : " (" + claims.length + " claims)"));
  LAB.ck(page.indexOf("$$") === -1, "p10 zero dollar-dollar delimiters on the page");
  LAB.ck((page.match(/class="pid"/g) || []).length === 3, "p10 pid spans: 3 (one per exemplar)");
  LAB.ck((page.match(/class="eq"/g) || []).length === 7, "p10 eq paragraphs: 7 display blocks");
  LAB.ck((page.match(/<figcaption>/g) || []).length === 3, "p10 figcaptions: 3");
  LAB.ck(page.indexOf("123") !== -1 && page.indexOf("724") !== -1, "p10 the two power-sum answers appear (123, 724)");
};
