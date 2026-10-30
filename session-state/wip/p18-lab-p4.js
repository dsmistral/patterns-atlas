// ============ p4: §4 Example 3 (Gaussian) + §5 Exhibits A and C ============
function p4(page) {
  var T = "p4";
  var SQPI = Math.sqrt(Math.PI);
  // --- Example 3: the famous integral, refused then done in two dimensions ---
  var I = simpson(function(x) { return Math.exp(-x*x); }, -6, 6, 2000);
  chk(T, "I = int e^{-x^2} over the line = sqrt(pi) = 1.7724538509", approx(I, SQPI, 1e-10), fmt(I, 10));
  chk(T, "sqrt(pi) = 1.7724538509 as printed", approx(SQPI, 1.7724538509, 5e-10), fmt(SQPI, 10));
  var Isq = I * I;
  chk(T, "I^2 = pi (the product of the two one-dimensional factors)", approx(Isq, Math.PI, 1e-9), fmt(Isq, 10));
  var radial = simpson(function(r) { return Math.exp(-r*r) * r; }, 0, 8, 2000);
  chk(T, "the radial integral int e^{-r^2} r dr = 1/2", approx(radial, 0.5, 1e-10), fmt(radial, 10));
  chk(T, "2 pi times the radial integral = pi (the room pays out)",
    approx(2 * Math.PI * radial, Math.PI, 1e-9));
  var eu = simpson(function(u) { return Math.exp(-u); }, 0, 40, 20000);
  chk(T, "substitution u = r^2, way one: (1/2) int e^{-u} du = 1/2", approx(eu / 2, 0.5, 1e-10), fmt(eu/2, 10));
  var rr = simpson(function(r) { return Math.exp(-r*r) * r; }, 0, 8, 16000);
  var uu = simpson(function(u) { return Math.exp(-u); }, 0, 64, 32000) / 2;
  chk(T, "substitution u = r^2, way two: both quadratures agree", approx(rr, uu, 1e-8), fmt(rr, 10) + " vs " + fmt(uu, 10));
  // --- Exhibit A: the junk room (collapse along z, keep x and y) ---
  function meet2l(p, q, r, s) {
    var d1 = [q[0]-p[0], q[1]-p[1]], d2 = [s[0]-r[0], s[1]-r[1]];
    var den = d1[0]*(-d2[1]) - d1[1]*(-d2[0]);
    if (Math.abs(den) < 1e-15) return null;
    var t = ((r[0]-p[0])*(-d2[1]) - (r[1]-p[1])*(-d2[0])) / den;
    return [p[0] + t*d1[0], p[1] + t*d1[1]];
  }
  function on2(P, a, b) { return Math.abs((b[0]-a[0])*(P[1]-a[1]) - (b[1]-a[1])*(P[0]-a[0])) < 1e-9; }
  var A1c = [0.5, 0], B1c = [0, 0.6], C1c = [4/3, 2];
  var A2c = [4/3, 0], B2c = [0, 1.2], C2c = [-2, -3];
  var O0 = [0, 0];
  chk(T, "collapse: the triangles stay in perspective from O (an accident)",
    on2(O0, A1c, A2c) && on2(O0, B1c, B2c) && on2(O0, C1c, C2c));
  var jP = meet2l(A1c, B1c, A2c, B2c);
  var jQ = meet2l(B1c, C1c, B2c, C2c);
  var jR = meet2l(C1c, A1c, C2c, A2c);
  chk(T, "junk meets land at (-2,3), (-4/7,0), (0,-6/5)",
    jP !== null && jQ !== null && jR !== null &&
    approx(jP[0], -2) && approx(jP[1], 3) &&
    approx(jQ[0], -4/7) && approx(jQ[1], 0) &&
    approx(jR[0], 0) && approx(jR[1], -1.2),
    "(" + fmt(jP[0],4) + "," + fmt(jP[1],4) + ") (" + fmt(jQ[0],4) + "," + fmt(jQ[1],4) + ") (" + fmt(jR[0],4) + "," + fmt(jR[1],4) + ")");
  chk(T, "each junk meet verified on both of its lines",
    jP !== null && on2(jP, A1c, B1c) && on2(jP, A2c, B2c) &&
    on2(jQ, B1c, C1c) && on2(jQ, B2c, C2c) &&
    on2(jR, C1c, A1c) && on2(jR, C2c, A2c));
  chk(T, "one of the three happens to coincide with P=(-2,3)",
    approx(jP[0], -2) && approx(jP[1], 3));
  var lineA = function(x, y) { return 21*x + 10*y + 12; };
  chk(T, "the junk meets are collinear on 21x + 10y + 12 = 0",
    approx(lineA(jP[0], jP[1]), 0, 1e-9) && approx(lineA(jQ[0], jQ[1]), 0, 1e-9) && approx(lineA(jR[0], jR[1]), 0, 1e-9));
  var axis = function(x, y) { return -3*x - 3 - y; };
  chk(T, "and NOT on the axis y = -3x - 3 the question asked about",
    Math.abs(axis(jQ[0], jQ[1])) > 0.1 && Math.abs(axis(jR[0], jR[1])) > 0.1);
  // --- Exhibit C: the room that solves other people's problems ---
  var J = simpson(function(x) { return Math.exp(-x*x*x*x); }, 0, 3, 4000);
  var G54 = 0.9064024771;
  chk(T, "J = int e^{-x^4} = Gamma(5/4) = 0.9064024771", approx(J, G54, 1e-9), fmt(J, 10));
  var Jsm = simpson(function(t) { return 2*t*Math.exp(-Math.pow(t, 8)); }, 0, 2, 4000);
  chk(T, "smooth chain: J = int 2t e^{-t^8} dt, same value", approx(Jsm, G54, 1e-9), fmt(Jsm, 10));
  var J2 = J * J;
  chk(T, "the true J^2 is about 0.8216", approx(J2, 0.8216, 1e-4), fmt(J2, 6));
  var toll = 2 * Math.PI * simpson(function(r) { return Math.exp(-Math.pow(r, 4)) * r; }, 0, 3, 4000);
  chk(T, "the pretend radial toll: pi^{3/2}/2 is about 2.7841", approx(toll, 2.7841, 1e-4) && approx(toll, Math.pow(Math.PI, 1.5)/2, 1e-9), fmt(toll, 6));
  chk(T, "the gap of nearly two: toll minus J^2 is about 1.96", approx(toll - J2, 1.96, 0.01), fmt(toll - J2, 4));
  var c04 = Math.pow(Math.cos(0), 4) + Math.pow(Math.sin(0), 4);
  var c45 = Math.pow(Math.cos(Math.PI/4), 4) + Math.pow(Math.sin(Math.PI/4), 4);
  chk(T, "cos^4 + sin^4 is 1 at 0 degrees, 1/2 at 45 degrees", approx(c04, 1) && approx(c45, 0.5));
  var inRange = true;
  for (var k = 0; k <= 720; k++) {
    var th = k * Math.PI / 720;
    var v = Math.pow(Math.cos(th), 4) + Math.pow(Math.sin(th), 4);
    if (v < 0.5 - 1e-12 || v > 1 + 1e-12) inRange = false;
  }
  chk(T, "cos^4 + sin^4 ranges inside [1/2, 1] (not a constant)", inRange && c04 !== c45);
  chk(T, "page names the junk map and the lesson",
    page.indexOf("a projection is honest only relative to a question") !== -1 &&
    page.indexOf("the room that solves other people's problems") !== -1);
}
