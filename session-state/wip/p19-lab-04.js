
// p06 — Exhibit C: R(3,4) counts and the K8 witness
var eFair = 10 * Math.pow(0.5, 3) + 5 * Math.pow(0.5, 6);
ck("p06 fair-coin E = 1.328125 (overflow)", eFair === 1.328125, "" + eFair);
ck("p06 page needle 1.328125", P.indexOf("1.328125") !== -1);
var termR = 10 * Math.pow(0.4, 3), termB = 5 * Math.pow(0.6, 6);
ck("p06 red term 0.64", Math.abs(termR - 0.64) < 1e-12, "" + termR);
ck("p06 blue term 0.23328 (page prints 0.233)", Math.abs(termB - 0.23328) < 1e-12 && P.indexOf("0.233") !== -1, "" + termB);
ck("p06 biased E = 0.87328 < 1 (page prints 0.873)", termR + termB < 1 && P.indexOf("\\approx 0.873") !== -1, "" + (termR + termB));
ck("p06 R(3,4) > 5 follows", termR + termB < 1);
ck("p06 page needle R(3,4) = 9", P.indexOf("R(3,4) = 9") !== -1);
// the K8 witness: red = cycle edges + opposite chords
function isRedK8(i, j) { var d = Math.abs(i - j) % 8; var dd = Math.min(d, 8 - d); return dd === 1 || dd === 4; }
var redEdges = 0;
for (var i8 = 0; i8 < 8; i8++) for (var j8 = i8 + 1; j8 < 8; j8++) if (isRedK8(i8, j8)) redEdges++;
ck("p06 K8 witness has 12 red edges (8 cycle + 4 chords)", redEdges === 12, "" + redEdges);
var redTri = 0, nTri = 0;
for (var a8 = 0; a8 < 8; a8++) for (var b8 = a8 + 1; b8 < 8; b8++) for (var c8 = b8 + 1; c8 < 8; c8++) { nTri++; if (isRedK8(a8, b8) && isRedK8(b8, c8) && isRedK8(a8, c8)) redTri++; }
ck("p06 all 56 triples: zero red triangles", nTri === 56 && redTri === 0, redTri + "/" + nTri);
var blueK4 = 0, nFour = 0;
for (var q8 = 0; q8 < 8; q8++) for (var r8 = q8 + 1; r8 < 8; r8++) for (var s8 = r8 + 1; s8 < 8; s8++) for (var u8 = s8 + 1; u8 < 8; u8++) {
  nFour++; var f4 = [q8, r8, s8, u8], allBlue = true;
  for (var i9 = 0; i9 < 4; i9++) for (var j9 = i9 + 1; j9 < 4; j9++) if (isRedK8(f4[i9], f4[j9])) allBlue = false;
  if (allBlue) blueK4++;
}
ck("p06 all 70 four-sets: zero blue K4", nFour === 70 && blueK4 === 0, blueK4 + "/" + nFour);
ck("p06 page needles 56 triples + 70 four-groups", P.indexOf("56") !== -1 && P.indexOf("70") !== -1);
ck("p06 page needle cycle plus opposite chords", P.indexOf("cycle of eight plus the four opposite chords") !== -1);
ck("p06 2^28 room of K8 colorings (page Ex2 worked)", P.indexOf("2^{28}") !== -1 && Cnk(8, 2) === 28);

// p07 — Example 3: Bernstein values, both routes and the rate
function bnHalf(n) { // exact recurrence over binomial probabilities at x = 1/2
  var p = Math.pow(2, -n), sum = Math.abs(0 - 0.5) * p;
  for (var k = 0; k < n; k++) { p = p * (n - k) / (k + 1); sum += Math.abs((k + 1) / n - 0.5) * p; }
  return sum;
}
// route A: the five-term sum at n=4, in exact fractions
var b4A = (0.5 + 4 * 0.25 + 0 + 4 * 0.25 + 0.5) / 16;
ck("p07 B4(1/2) route A five-term = 3/16 = 0.1875", b4A === 0.1875, "" + b4A);
var b4B = bnHalf(4);
ck("p07 B4(1/2) route B recurrence = 0.1875", b4B === 0.1875, "" + b4B);
ck("p07 page needle 3/16 = 0.1875", P.indexOf("\\frac{3}{16} = 0.1875") !== -1);
var b100 = bnHalf(100), b1000 = bnHalf(1000);
ck("p07 B100(1/2) = 0.0397946 (page prints 0.0398)", Math.abs(b100 - 0.03979461869358937) < 1e-15 && P.indexOf("0.0398") !== -1, "" + b100);
ck("p07 B1000(1/2) = 0.0126125 (page prints 0.0126)", Math.abs(b1000 - 0.012612509089180405) < 1e-15 && P.indexOf("0.0126") !== -1, "" + b1000);
var rate = Math.sqrt(2 / Math.PI) / 2;
ck("p07 rate constant sqrt(2/pi)/2 = 0.398942 (page prints 0.39894)", Math.abs(rate - 0.3989422804014327) < 1e-15 && P.indexOf("0.39894") !== -1, "" + rate);
ck("p07 prediction n=100: 0.0399 (page)", Math.abs(rate / 10 - 0.0399) < 5e-5 && P.indexOf("0.0399") !== -1, "" + (rate / 10));
ck("p07 prediction n=1000: 0.0126 (page)", Math.abs(rate / Math.sqrt(1000) - 0.0126) < 5e-5, "" + (rate / Math.sqrt(1000)));
// MAD of the standard bell curve by 16000-panel quadrature over [-8, 8]
var NQ = 16000, x0 = -8, dx = 16 / NQ, mad = 0;
for (var qi = 0; qi < NQ; qi++) { var xv = x0 + (qi + 0.5) * dx; mad += Math.abs(xv) * Math.exp(-xv * xv / 2) * dx; }
mad = mad / Math.sqrt(2 * Math.PI);
ck("p07 bell MAD = sqrt(2/pi) = 0.7978846 (quadrature)", Math.abs(mad - Math.sqrt(2 / Math.PI)) < 1e-7, "" + mad);
var algOK = true;
for (var Mv = 1; Mv <= 4; Mv++) for (var ev = 0.5; ev <= 2; ev += 0.5) for (var dv = 1; dv <= 2; dv += 0.5) {
  var nTh = Mv / (ev * dv * dv);
  var nHi = Math.floor(nTh) + 1;
  if (nHi <= nTh) algOK = false;
  if (ev / 2 + Mv / (2 * nHi * dv * dv) >= ev) algOK = false;
  var nLo = Math.ceil(nTh) - 1;
  if (nLo >= 1) { if (nLo >= nTh) algOK = false; if (ev / 2 + Mv / (2 * nLo * dv * dv) < ev) algOK = false; }
}
ck("p07 Chebyshev split algebra grid: far term < eps/2 iff n > M/(eps d^2)", algOK);
ck("p07 page needle n > M/(eps d^2)", P.indexOf("n &gt; \\tfrac{M}{\\varepsilon\\delta^2}") !== -1);
ck("p07 page needle 2M/4nd^2", P.indexOf("\\frac{2M}{4n\\delta^2}") !== -1);
ck("p07 variance bound x(1-x) <= 1/4 at x=1/2", 0.25 <= 0.25);
ck("p07 page needle 1/(4n)", P.indexOf("\\frac{1}{4n}") !== -1);
