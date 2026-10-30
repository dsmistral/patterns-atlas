// ============ p4y: §5 Exhibit B — the plane, and Desargues failing ============
function p4y(page) {
  var T = "p4y";
  function E(a, b) { return 3*a + b; }
  function ea(u) { return Math.floor(u / 3); }
  function eb(u) { return u % 3; }
  function fadd(u, v) { return E((ea(u)+ea(v)) % 3, (eb(u)+eb(v)) % 3); }
  function fsub(u, v) { return E(((ea(u)-ea(v))%3+3) % 3, ((eb(u)-eb(v))%3+3) % 3); }
  function fmul(u, v) {
    return E((((ea(u)*ea(v) - eb(u)*eb(v)) % 9) + 9) % 3,
             (((ea(u)*eb(v) + eb(u)*ea(v)) % 9) + 9) % 3);
  }
  var H = {}; H[E(1,0)] = 1; H[E(2,0)] = 1; H[E(0,1)] = 1; H[E(0,2)] = 1; H[0] = 1;
  function circ(a, b) {
    if (H[a] === 1) return fmul(a, b);
    return fmul(a, fmul(fmul(b, b), b));
  }
  function cinv(u) { for (var w = 0; w < 9; w++) if (circ(u, w) === E(1,0)) return w; return -1; }
  var lines = []; // each line: { vertical: cx or -1, m, b, pts: [81 bools], n: count }
  for (var m = 0; m < 9; m++) for (var b = 0; b < 9; b++) {
    var L = { vertical: -1, m: m, b: b, pts: [], n: 0 };
    for (var x = 0; x < 9; x++) { var y = fadd(circ(m, x), b); L.pts[9*x + y] = 1; L.n++; }
    lines.push(L);
  }
  for (var cx = 0; cx < 9; cx++) {
    var V = { vertical: cx, m: -1, b: -1, pts: [], n: 0 };
    for (var y = 0; y < 9; y++) { V.pts[9*cx + y] = 1; V.n++; }
    lines.push(V);
  }
  chk(T, "81 points and 90 lines (81 nearfield lines plus 9 verticals)",
    9*9 === 81 && lines.length === 90);
  var nineEach = true;
  for (var i = 0; i < 90; i++) if (lines[i].n !== 9) nineEach = false;
  chk(T, "nine points on every line", nineEach);
  // unique line through every pair of points
  var uniqueOK = true;
  for (var p1 = 0; p1 < 81; p1++) for (var p2 = p1+1; p2 < 81; p2++) {
    var cnt = 0;
    for (var l = 0; l < 90; l++) if (lines[l].pts[p1] && lines[l].pts[p2]) cnt++;
    if (cnt !== 1) uniqueOK = false;
  }
  chk(T, "exactly one line through every pair of points", uniqueOK);
  // at most one meet for every pair of lines
  var meetOK = true;
  for (var l1 = 0; l1 < 90; l1++) for (var l2 = l1+1; l2 < 90; l2++) {
    var c = 0;
    for (var q = 0; q < 81; q++) if (lines[l1].pts[q] && lines[l2].pts[q]) c++;
    if (c > 1) meetOK = false;
  }
  chk(T, "at most one meet for every pair of lines", meetOK);
  chk(T, "projective completion: 9^2 + 9 + 1 = 91", 9*9 + 9 + 1 === 91);
  // --- Desargues fails, on small coordinates ---
  var t = E(0,1), twoT = E(0,2), one = E(1,0), two = E(2,0), oneT = E(1,1);
  var A = [t, t], Ap = [twoT, twoT], B = [t, two], Bp = [one, t], C = [0, t], Cp = [0, oneT];
  function onPt(L, P) { return L.pts[9*P[0] + P[1]] === 1; }
  var O = [0, 0];
  var lAA = [], lBB = [], lCC = [];
  for (var l3 = 0; l3 < 90; l3++) {
    if (onPt(lines[l3], A) && onPt(lines[l3], Ap)) lAA.push(l3);
    if (onPt(lines[l3], B) && onPt(lines[l3], Bp)) lBB.push(l3);
    if (onPt(lines[l3], C) && onPt(lines[l3], Cp)) lCC.push(l3);
  }
  var persp = lAA.length === 1 && lBB.length === 1 && lCC.length === 1 &&
    onPt(lines[lAA[0]], O) && onPt(lines[lBB[0]], O) && onPt(lines[lCC[0]], O);
  chk(T, "the two triangles are in perspective from the origin (all three lines checked)", persp);
  function meetLines(L1, L2) {
    var ms = [];
    for (var q2 = 0; q2 < 81; q2++) if (L1.pts[q2] && L2.pts[q2]) ms.push(q2);
    return ms;
  }
  function sideLine(P1, P2) {
    for (var l4 = 0; l4 < 90; l4++) if (onPt(lines[l4], P1) && onPt(lines[l4], P2)) return lines[l4];
    return null;
  }
  var Pl = sideLine(A, B), Ql = sideLine(B, C), Rl = sideLine(C, A);
  var Plp = sideLine(Ap, Bp), Qlp = sideLine(Bp, Cp), Rlp = sideLine(Cp, Ap);
  var mP = meetLines(Pl, Plp), mQ = meetLines(Ql, Qlp), mR = meetLines(Rl, Rlp);
  var Pt = [t, fadd(two, t)], Qt = [twoT, fadd(one, twoT)], Rt = [oneT, t]; // (t,2+t),(2t,1+2t),(1+t,t)
  chk(T, "P = (t, 2+t): the unique meet of AB and A'B'",
    mP.length === 1 && mP[0] === 9*Pt[0] + Pt[1]);
  chk(T, "Q = (2t, 1+2t): the unique meet of BC and B'C'",
    mQ.length === 1 && mQ[0] === 9*Qt[0] + Qt[1]);
  chk(T, "R = (1+t, t): the unique meet of CA and C'A'",
    mR.length === 1 && mR[0] === 9*Rt[0] + Rt[1]);
  var collinear = false;
  for (var l5 = 0; l5 < 90; l5++) {
    if (onPt(lines[l5], Pt) && onPt(lines[l5], Qt) && onPt(lines[l5], Rt)) collinear = true;
  }
  chk(T, "and they are NOT collinear (no line holds all three)", !collinear);
  chk(T, "page pins the failure: And they are not collinear",
    page.indexOf("And they are not collinear") !== -1);
  chk(T, "page pins the meets P = (t,\\; 2+t) etc.",
    page.indexOf("P = (t,\\; 2+t)") !== -1 && page.indexOf("Q = (2t,\\; 1+2t)") !== -1 && page.indexOf("R = (1+t,\\; t)") !== -1);
  chk(T, "page names it the first finite non-Desarguesian plane",
    page.indexOf("the first finite non-Desarguesian plane") !== -1);
  chk(T, "page pins the embeddability boundary (Veblen-Young)",
    page.indexOf("embeds in three-space exactly when Desargues holds in it") !== -1);
}
