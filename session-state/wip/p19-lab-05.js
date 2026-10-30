
// p08 — Exercise 4: the Schur counts and censuses
function schurE(n) {
  var e = 0;
  for (var x = 1; x <= n; x++) for (var y = x; y <= n; y++) { var z = x + y; if (z > n) continue; e += (x === y ? 0.5 : 0.25); }
  return e;
}
ck("p08 Schur E(3) = 0.75 (succeeds)", schurE(3) === 0.75, "" + schurE(3));
ck("p08 Schur E(4) = 1.5 (overflow)", schurE(4) === 1.5, "" + schurE(4));
ck("p08 Schur E(5) = 2.0 (overflow)", schurE(5) === 2.0, "" + schurE(5));
ck("p08 page needles 0.75 / 1.5 / 2.0", P.indexOf("0.75") !== -1 && P.indexOf("1.5") !== -1 && P.indexOf("2.0") !== -1);
ck("p08 page needle four triples", P.indexOf("(1,1,2)") !== -1 && P.indexOf("(1,3,4)") !== -1 && P.indexOf("(2,2,4)") !== -1);
ck("p08 page needle two added triples", P.indexOf("(1,4,5)") !== -1 && P.indexOf("(2,3,5)") !== -1);
function schurAvoiders(n) {
  var count = 0;
  for (var m = 0; m < (1 << n); m++) {
    var c = []; for (var i = 0; i < n; i++) c.push((m >> i) & 1);
    var ok = true;
    for (var x = 1; x <= n && ok; x++) for (var y = x; y <= n && ok; y++) {
      var z = x + y; if (z > n) continue;
      if (c[x - 1] === c[y - 1] && c[y - 1] === c[z - 1]) ok = false;
    }
    if (ok) count++;
  }
  return count;
}
ck("p08 Schur census n=4: 2 avoiders of 16", schurAvoiders(4) === 2, "" + schurAvoiders(4));
ck("p08 Schur census n=5: 0 avoiders of 32", schurAvoiders(5) === 0, "" + schurAvoiders(5));
ck("p08 page needle 2 out of 16", P.indexOf("2\\) out of \\(16") !== -1 || P.indexOf("2 out of 16") !== -1);
ck("p08 page needle Zero colorings of 32", P.indexOf("Zero colorings of \\(32\\)") !== -1 || P.indexOf("Zero colorings of 32") !== -1);
// the hand derivation: the two n=4 avoiders are {1,4} vs {2,3} splits
var avoiderPatterns = [];
for (var m4 = 0; m4 < 16; m4++) {
  var cc = [(m4 >> 0) & 1, (m4 >> 1) & 1, (m4 >> 2) & 1, (m4 >> 3) & 1];
  var okx = true;
  for (var x2 = 1; x2 <= 4 && okx; x2++) for (var y2 = x2; y2 <= 4 && okx; y2++) { var z2 = x2 + y2; if (z2 > 4) continue; if (cc[x2 - 1] === cc[y2 - 1] && cc[y2 - 1] === cc[z2 - 1]) okx = false; }
  if (okx) avoiderPatterns.push(cc.join(""));
}
ck("p08 avoiders are the 0110 and 1001 splits", avoiderPatterns.join(",") === "0110,1001", avoiderPatterns.join(","));

// p09 — Exercise 1 fractions and the labeled five-cycle count; Exercise 5 hand walk
ck("p09 Ex1 fractions 1/32, 1/512, 7/4096",
  Cnk(4, 4) * Math.pow(2, -5) === 1 / 32 &&
  Cnk(5, 5) * Math.pow(2, -9) === 1 / 512 &&
  Cnk(8, 6) * Math.pow(2, -14) === 28 / 16384 && 28 / 16384 === 7 / 4096);
ck("p09 page needles 1/32, 1/512, 7/4096", P.indexOf("\\frac{1}{32}") !== -1 && P.indexOf("\\frac{1}{512}") !== -1 && P.indexOf("\\frac{7}{4096}") !== -1);
var c5count = 1; for (var f5 = 2; f5 <= 5; f5++) c5count *= f5; c5count = c5count / (5 * 2);
ck("p09 labeled C5 count 5!/(5*2) = 12", c5count === 12, "" + c5count);
ck("p09 matches the K5 census (cross-check p01)", c5count === 12 && k5good === 12);
// Exercise 5: the failing P4 walk in vertices 1,2,4,3 (0-based 0,1,3,2)
var walkP4 = walkCut(4, p4edge, [0, 1, 3, 2]);
ck("p09 Ex5 hand walk lands 2 on P4 order 1,2,4,3", walkP4 === 2, "" + walkP4);
ck("p09 Ex5 guarantee 2 >= 3/2", walkP4 >= 1.5);
// the partition claimed on the page: A={1,3,4}, B={2} (0-based A={0,2,3}, B={1}) crosses exactly 2
var crossClaim = 0;
for (var e1 = 0; e1 < 4; e1++) for (var e2 = e1 + 1; e2 < 4; e2++) {
  var sideOf = {}; sideOf[0] = 0; sideOf[2] = 0; sideOf[3] = 0; sideOf[1] = 1;
  if (sideOf[e1] !== sideOf[e2] && p4edge(e1, e2)) crossClaim++;
}
ck("p09 Ex5 sides A={1,3,4} vs B={2} cross exactly 2 edges", crossClaim === 2, "" + crossClaim);
ck("p09 Ex5: the claimed max partition {1,3} vs {2,4} crosses 3", (function () { var so = {}; so[0]=0; so[2]=0; so[1]=1; so[3]=1; var cx=0; for (var a=0;a<4;a++) for (var b=a+1;b<4;b++) if (so[a]!==so[b] && p4edge(a,b)) cx++; return cx; })() === 3);
// verify the max-cut bipartition by full census
var p4max = 0;
for (var pp = 0; pp < 16; pp++) { var cx = 0; for (var q1 = 0; q1 < 4; q1++) for (var q2 = q1 + 1; q2 < 4; q2++) if ((((pp >> q1) & 1) !== ((pp >> q2) & 1)) && p4edge(q1, q2)) cx++; if (cx > p4max) p4max = cx; }
ck("p09 P4 max cut is 3 by census", p4max === 3, "" + p4max);

// tail — verdict
LINES.push("VERDICT: " + (PASS + FAIL) + " checks, " + FAIL + " FAIL");
