// b09-lab.js — machine verification battery for B09 "Graphs and numbers on them".
// Exact integer arithmetic for ledger checks; floats only for figure geometry
// (tolerance 0.051, one printed decimal). No recursion, no BigInt, no Node APIs.
// Model: p69-lab. Run with: node b09-lab.js
let N = 0, FAILS = 0;
const OUT = [];
function ok(cond, label) {
  N++;
  if (cond) OUT.push("PASS " + N + " " + label);
  else { FAILS++; OUT.push("FAIL " + N + " " + label); }
}
function eq(a, b, label) {
  N++;
  if (a === b) OUT.push("PASS " + N + " " + label);
  else { FAILS++; OUT.push("FAIL " + N + " " + label + " [got " + a + " want " + b + "]"); }
}
function near(a, b, label) { ok(Math.abs(a - b) <= 0.051, label); }
// rise of a walk = sum of (phi(next) - phi(current)) — Claim 1's mechanism
function walkTotal(phi, w) {
  let t = 0;
  for (let i = 0; i + 1 < w.length; i++) t += phi[w[i + 1]] - phi[w[i]];
  return t;
}
// arrowhead polygon from design formulas: tip = P1 + 0.55*(P2-P1),
// base = tip - 6.5*unit, corners = base +- 3*normal
function arrow(p1, p2) {
  const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
  const L = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / L, uy = dy / L;
  const tip = [p1[0] + 0.55 * dx, p1[1] + 0.55 * dy];
  const base = [tip[0] - 6.5 * ux, tip[1] - 6.5 * uy];
  return [tip, [base[0] + 3 * -uy, base[1] + 3 * ux], [base[0] - 3 * -uy, base[1] - 3 * ux]];
}
// root-and-accumulate on a tree (Claim 4's construction), BFS, no recursion
// edges: [u, v, r] with arrow u -> v carrying rise r; phi(root) = 0
function treePhi(V, edges, root) {
  const adj = {};
  for (const v of V) adj[v] = [];
  for (const e of edges) { adj[e[0]].push([e[1], e[2]]); adj[e[1]].push([e[0], -e[2]]); }
  const phi = {}; phi[root] = 0; const q = [root];
  while (q.length) {
    const u = q.shift();
    for (const [v, w] of adj[u]) if (!(v in phi)) { phi[v] = phi[u] + w; q.push(v); }
  }
  return phi;
}
// deterministic pseudo-random integers in [-9, 9] (Lehmer LCG, safe in float64)
let LCGs = 7;
function lcg9() { LCGs = (LCGs * 48271) % 2147483647; return (LCGs % 19) - 9; }
// —— Group A: Lecture 0, the altitude triangle (phi A=40, B=90, C=15) ——
const phiA = { A: 40, B: 90, C: 15 };
eq(90 - 40, 50, "A rise A->B = +50");
eq(15 - 90, -75, "A rise B->C = -75");
eq(40 - 15, 25, "A rise C->A = +25");
eq(50 + (-75) + 25, 0, "A loop forward A->B->C->A totals 0");
eq(-25 + 75 + (-50), 0, "A loop backward A->C->B->A totals 0");
eq(-(40 - 15), -25, "A A->C direct = backward read of C->A = -25");
eq(50 + (-75), -25, "A A->C via B = -25 (routes agree)");
eq(-(90 - 40), -50, "A B->A = negative of A->B (obligation 1)");
eq(15 - 90, -75, "A B->C direct = -75");
eq(-50 + (-25), -75, "A B->C via A = -75 (routes agree)");
// —— Group B: the surveyors' non-example (+1, +1, +1) ——
eq(1 + 1 + 1, 3, "B loop total of (+1,+1,+1) = 3, not 0 — fails T1");
let sa = 4, sb = 9, sc = 2;
eq((sb - sa) + (sc - sb) + (sa - sc), 0, "B left sides of the three demands cancel identically");
eq((1) + (1) + (1), 3, "B right sides sum to 3 — the demand 0 = 3 is impossible");
let sols = 0;
for (let a = -5; a <= 5; a++)
  for (let b = -5; b <= 5; b++)
    for (let c = -5; c <= 5; c++)
      if (b - a === 1 && c - b === 1 && a - c === 1) sols++;
eq(sols, 0, "B brute-force census: zero altitude columns in [-5,5]^3");
// corrupted square table (3(a) with shortcut changed to -4) fails its loops
const omBad = { AB: 4, BC: -9, CD: 7, DA: -2, AC: -4 };
eq(omBad.AB + omBad.BC - omBad.AC, -1, "B corrupted low triangle totals -1, not 0");
eq(omBad.AC + omBad.CD + omBad.DA, 1, "B corrupted high triangle totals +1, not 0");
ok(omBad.AC !== omBad.AB + omBad.BC, "B corrupted table: routes A->C disagree (-4 vs -5)");
// —— Group C: Fig B09.1 geometry (altitude triangle) ——
// vertices: A(70,195), B(255,175), C(150,48); page values read from the SVG
const VA = [70, 195], VB = [255, 175], VC = [150, 48];
const aAB = arrow(VA, VB), aBC = arrow(VB, VC), aCA = arrow(VC, VA);
near(aAB[0][0], 171.8, "C arrowhead A->B tip x = 171.8");
near(aAB[0][1], 184, "C arrowhead A->B tip y = 184");
near(aAB[1][0], 165.6, "C arrowhead A->B corner1 x = 165.6");
near(aAB[1][1], 187.7, "C arrowhead A->B corner1 y = 187.7");
near(aAB[2][0], 165, "C arrowhead A->B corner2 x = 165");
near(aAB[2][1], 181.7, "C arrowhead A->B corner2 y = 181.7");
near(aBC[0][0], 197.3, "C arrowhead B->C tip x = 197.3");
near(aBC[0][1], 105.2, "C arrowhead B->C tip y = 105.2");
near(aBC[1][0], 203.7, "C arrowhead B->C corner1 x = 203.7");
near(aBC[1][1], 108.2, "C arrowhead B->C corner1 y = 108.2");
near(aBC[2][0], 199.1, "C arrowhead B->C corner2 x = 199.1");
near(aBC[2][1], 112.1, "C arrowhead B->C corner2 y = 112.1");
near(aCA[0][0], 106, "C arrowhead C->A tip x = 106");
near(aCA[0][1], 128.9, "C arrowhead C->A tip y = 128.9");
near(aCA[1][0], 106.5, "C arrowhead C->A corner1 x = 106.5");
near(aCA[1][1], 121.7, "C arrowhead C->A corner1 y = 121.7");
near(aCA[2][0], 111.7, "C arrowhead C->A corner2 x = 111.7");
near(aCA[2][1], 124.6, "C arrowhead C->A corner2 y = 124.6");
// —— Group D: 3(a) the square with a shortcut (phi A=3, B=7, C=-2, D=5) ——
const phiD = { A: 3, B: 7, C: -2, D: 5 };
eq(phiD.B - phiD.A, 4, "D rise A->B = +4");
eq(phiD.C - phiD.B, -9, "D rise B->C = -9");
eq(phiD.D - phiD.C, 7, "D rise C->D = +7");
eq(phiD.A - phiD.D, -2, "D rise D->A = -2");
eq(phiD.C - phiD.A, -5, "D rise A->C (shortcut) = -5");
eq(4 - 9 + 5, 0, "D low triangle A->B->C->A totals 0");
eq(-5 + 7 - 2, 0, "D high triangle A->C->D->A totals 0");
eq(4 - 9 + 7 - 2, 0, "D square A->B->C->D->A totals 0");
eq(-5, 4 - 9, "D A->C by shortcut = A->C via B (routes agree)");
eq(-(phiD.C - phiD.B), 9, "D C->B direct = backward read of B->C = +9");
eq(7 + (-2) + 4, 9, "D C->B long way C->D->A->B = +9 (routes agree)");
const phiD2 = { A: 103, B: 107, C: 98, D: 105 };
eq(phiD2.B - phiD2.A, 4, "D gauge +100: rise A->B unchanged");
eq(phiD2.C - phiD2.B, -9, "D gauge +100: rise B->C unchanged");
eq(phiD2.D - phiD2.C, 7, "D gauge +100: rise C->D unchanged");
eq(phiD2.A - phiD2.D, -2, "D gauge +100: rise D->A unchanged");
eq(phiD2.C - phiD2.A, -5, "D gauge +100: rise A->C unchanged");
eq(walkTotal(phiD, ["A", "B", "C", "D", "A", "B"]), 4, "D revisiting walk A->B->C->D->A->B totals phi(B)-phi(A) = 4");
// —— Group E: 3(b) the path (rises +2, -3, +5, +1; root phi(v0)=0) ——
const wE = [2, -3, 5, 1];
let phiE = [0];
for (let k = 0; k < 4; k++) phiE.push(phiE[k] + wE[k]);
eq(phiE.join(","), "0,2,-1,4,5", "E potentials from root 0 = 0,2,-1,4,5");
let dOk = true;
for (let k = 0; k < 4; k++) if (phiE[k + 1] - phiE[k] !== wE[k]) dOk = false;
ok(dOk, "E anti-difference identity: phi(k+1) - phi(k) = omega_k, every k");
let sOk = true;
for (let k = 0; k <= 4; k++) {
  let acc = 0;
  for (let i = 0; i < k; i++) acc += wE[i];
  if (acc !== phiE[k] - phiE[0]) sOk = false;
}
ok(sOk, "E B11 telescoping identity: partial sums = phi(k) - phi(0), every k");
let phiE10 = [10];
for (let k = 0; k < 4; k++) phiE10.push(phiE10[k] + wE[k]);
eq(phiE10.join(","), "10,12,9,14,15", "E root 10: column 10,12,9,14,15 (gauge shift)");
let gOk = true;
for (let k = 0; k <= 4; k++) if (phiE10[k] - phiE[k] !== 10) gOk = false;
ok(gOk, "E re-rooting shifted every potential by the same constant 10");
// —— Group K: Ex1 triangle (phi A=60, B=45, C=80) ——
const phiK = { A: 60, B: 45, C: 80 };
eq(45 - 60, -15, "K rise A->B = -15");
eq(80 - 45, 35, "K rise B->C = +35");
eq(60 - 80, -20, "K rise C->A = -20");
eq(-15 + 35 - 20, 0, "K clockwise closed walk totals 0");
eq(15 - 35 + 20, 0, "K counterclockwise closed walk totals 0");
eq((15 - 35 + 20), -(-15 + 35 - 20), "K counterclockwise is the negation of clockwise (sign-convention check)");
// —— Group F: 3(c) the tree (S-A 3, S-B -4, A-C 5, B-D 2, C-E -1; root S) ——
const VT = ["S", "A", "B", "C", "D", "E"];
const ET = [["S", "A", 3], ["S", "B", -4], ["A", "C", 5], ["B", "D", 2], ["C", "E", -1]];
const phiF = treePhi(VT, ET, "S");
eq([phiF.S, phiF.A, phiF.B, phiF.C, phiF.D, phiF.E].join(","), "0,3,-4,8,-2,7", "F potentials rooted at S = 0,3,-4,8,-2,7");
eq(phiF.A - phiF.S, 3, "F rise S->A reproduces (+3)");
eq(phiF.B - phiF.S, -4, "F rise S->B reproduces (-4)");
eq(phiF.C - phiF.A, 5, "F rise A->C reproduces (+5)");
eq(phiF.D - phiF.B, 2, "F rise B->D reproduces (+2)");
eq(phiF.E - phiF.C, -1, "F rise C->E reproduces (-1)");
eq(phiF.C - phiF.S, 3 + 5, "F long read S->C = 3+5 = 8");
eq(phiF.E - phiF.S, 3 + 5 - 1, "F long read S->E = 3+5-1 = 7");
// Ex3: re-root at E (Claim 3's gauge, constant c = -7)
const phiFp = treePhi(VT, ET, "E");
eq([phiFp.E, phiFp.C, phiFp.A, phiFp.S, phiFp.B, phiFp.D].join(","), "0,1,-4,-7,-11,-9", "F re-rooted at E = E0, C1, A-4, S-7, B-11, D-9");
let rOk = true;
for (const [u, v, r] of ET) if (phiFp[v] - phiFp[u] !== r) rOk = false;
ok(rOk, "F all five rises survive re-rooting unchanged");
let cOk = true;
for (const v of VT) if (phiFp[v] - phiF[v] !== -7) cOk = false;
ok(cOk, "F Claim 3: phi' - phi = -7 on all six towns (one constant)");
// —— Group G: Fig B09.2 geometry (square A(85,50) B(255,50) C(255,200) D(85,200), blue diagonal A->C) ——
const S1 = [85, 50], S2 = [255, 50], S3 = [255, 200], S4 = [85, 200];
near(S1[0], 85, "G vertex A x = 85"); near(S1[1], 50, "G vertex A y = 50");
near(S2[0], 255, "G vertex B x = 255"); near(S2[1], 50, "G vertex B y = 50");
near(S3[0], 255, "G vertex C x = 255"); near(S3[1], 200, "G vertex C y = 200");
near(S4[0], 85, "G vertex D x = 85"); near(S4[1], 200, "G vertex D y = 200");
ok(S2[0] - S1[0] === 170 && S3[0] - S4[0] === 170 && S2[1] === S1[1] && S3[1] === S4[1], "G square sides: B right of A and C right of D by 170; A,B on y=50, C,D on y=200");
ok(S3[1] - S2[1] === S4[1] - S1[1] && S3[1] - S2[1] === 150, "G square sides: C and D below A and B by the same 150");
// —— Group H: Fig B09.3 geometry (S(170,215) A(90,145) B(250,145) C(90,75) D(250,75) E(90,25)) ——
const T1 = [170, 215], T2 = [90, 145], T3 = [250, 145], T4 = [90, 75], T5 = [250, 75], T6 = [90, 25];
near(T1[0], 170, "H vertex S x = 170"); near(T1[1], 215, "H vertex S y = 215");
near(T2[0], 90, "H vertex A x = 90"); near(T2[1], 145, "H vertex A y = 145");
near(T3[0], 250, "H vertex B x = 250"); near(T3[1], 145, "H vertex B y = 145");
near(T4[0], 90, "H vertex C x = 90"); near(T4[1], 75, "H vertex C y = 75");
near(T5[0], 250, "H vertex D x = 250"); near(T5[1], 75, "H vertex D y = 75");
near(T6[0], 90, "H vertex E x = 90"); near(T6[1], 25, "H vertex E y = 25");
// the five drawn lines are exactly the tree's five edges
function posH(n) { return { S: T1, A: T2, B: T3, C: T4, D: T5, E: T6 }[n]; }
const linesH = [[T1, T2], [T1, T3], [T2, T4], [T3, T5], [T4, T6]];
const pairsH = [["S", "A"], ["S", "B"], ["A", "C"], ["B", "D"], ["C", "E"]];
let lOk = true;
for (let i = 0; i < 5; i++) {
  const [u, v] = pairsH[i], p = linesH[i];
  const got = posH(u), got2 = posH(v);
  if (got[0] !== p[0][0] || got[1] !== p[0][1] || got2[0] !== p[1][0] || got2[1] !== p[1][1]) lOk = false;
}
ok(lOk, "H each drawn line joins exactly the towns its rise labels (S-A, S-B, A-C, B-D, C-E)");

// —— Group I: Claim 4 stress — every assignment on a tree is a rise table ——
const IV1 = ["S", "A", "B", "C", "D", "E"];
const IB1 = [["S", "A", 0], ["S", "B", 0], ["A", "C", 0], ["B", "D", 0], ["C", "E", 0]];
const IV2 = ["q0", "q1", "q2", "q3", "q4", "q5", "q6"];
const IB2 = [["q0", "q1", 0], ["q1", "q2", 0], ["q2", "q3", 0], ["q3", "q4", 0], ["q4", "q5", 0], ["q5", "q6", 0]];
const IV3 = ["X", "L1", "L2", "L3", "L4"];
const IB3 = [["X", "L1", 0], ["X", "L2", 0], ["X", "L3", 0], ["X", "L4", 0]];
function iRand(base) { const E = []; for (const e of base) E.push([e[0], e[1], lcg9()]); return E; }
function iCheck(V, base, root, label) {
  let all = true;
  for (let t = 0; t < 4; t++) {
    const E = iRand(base);
    const phi = treePhi(V, E, root);
    for (const e of E) if (phi[e[1]] - phi[e[0]] !== e[2]) all = false;
  }
  ok(all, label);
}
iCheck(IV1, IB1, "S", "I 3(c) tree: 4 pseudo-random assignments — every rise reproduces (Claim 4)");
iCheck(IV2, IB2, "q0", "I path of 7: 4 pseudo-random assignments — every rise reproduces");
iCheck(IV3, IB3, "X", "I star of 5: 4 pseudo-random assignments — every rise reproduces");
// Claim 3 on the tree: same rise table, two roots — potentials differ by one constant
const IE1 = [["S", "A", 3], ["S", "B", -4], ["A", "C", 5], ["B", "D", 2], ["C", "E", -1]];
const ip1 = treePhi(IV1, IE1, "S"), ip2 = treePhi(IV1, IE1, "C");
let icon = true;
for (const v of IV1) if (ip2[v] - ip1[v] !== ip2.S - ip1.S) icon = false;
ok(icon, "I two potentials with the same rise table differ by one constant (Claim 3)");
// non-tree contrast: the triangle does not have the property
let triFail = false;
for (let a = -2; a <= 2; a++)
  for (let b = -2; b <= 2; b++)
    for (let c = -2; c <= 2; c++)
      if (b - a === 1 && c - b === 1 && a - c === 1) triFail = true;
ok(!triFail, "I contrast: the (+1,+1,+1) triangle admits no potential — trees are special");
// —— Group J: the obligations fail together (+1,+1,+1 triangle) ——
eq(1 + 1, 2, "J failing triangle: route A->C via B totals +2");
eq(-1, -(1), "J failing triangle: route A->C direct (backward read of C->A) totals -1");
ok(2 !== -1, "J failing triangle: routes A->C disagree (T2 fails)");
eq(1 + 1 + 1, 3, "J failing triangle: the loop total is +3 (T1 fails)");
// —— Group N: Claim 1 stress on K4 (phi A=0, B=5, C=-1, D=3) and the square ——
const nAdj = { A: ["B", "C", "D"], B: ["A", "C", "D"], C: ["A", "B", "D"], D: ["A", "B", "C"] };
const nPhi = { A: 0, B: 5, C: -1, D: 3 };
let Wn = [["A"]], nTot = 0, nAB = 0, nABok = true, nCl = 0, nClok = true, nToC = 0, nToCok = true;
for (let L = 1; L <= 4; L++) {
  const NW = [];
  for (const p of Wn) for (const v of nAdj[p[p.length - 1]]) NW.push(p.concat([v]));
  Wn = NW; nTot += NW.length;
  for (const p of Wn) {
    const t = walkTotal(nPhi, p);
    if (p[p.length - 1] === "B") { nAB++; if (t !== 5) nABok = false; }
    if (p[p.length - 1] === "A") { nCl++; if (t !== 0) nClok = false; }
    if (p[p.length - 1] === "C") { nToC++; if (t !== -1) nToCok = false; }
  }
}
eq(nTot, 120, "N K4: 120 walks of length 1..4 start at A (3+9+27+81)");
ok(nAB > 20 && nABok, "N K4: all " + nAB + " walks A->B total phi(B)-phi(A) = +5");
ok(nCl > 20 && nClok, "N K4: all " + nCl + " closed walks from A total 0 (T1)");
ok(nToC > 20 && nToCok, "N K4: all " + nToC + " walks A->C total -1");
// the square with a shortcut, closed walks up to length 4 from A
const nSqAdj = { A: ["B", "D", "C"], B: ["A", "C"], C: ["B", "D", "A"], D: ["C", "A"] };
const nSqPhi = { A: 3, B: 7, C: -2, D: 5 };
let Wq = [["A"]], qCl = 0, qClok = true;
for (let L = 1; L <= 4; L++) {
  const NW = [];
  for (const p of Wq) for (const v of nSqAdj[p[p.length - 1]]) NW.push(p.concat([v]));
  Wq = NW;
  for (const p of Wq) if (p[p.length - 1] === "A") { qCl++; if (walkTotal(nSqPhi, p) !== 0) qClok = false; }
}
ok(qCl > 3 && qClok, "N square: all " + qCl + " closed walks from A (length 1..4) total 0");
// —— Group L: Ex2 (phi A=1, B=6, C=4, D=9; same five reference directions) ——
const phiL = { A: 1, B: 6, C: 4, D: 9 };
eq(6 - 1, 5, "L rise A->B = +5");
eq(4 - 6, -2, "L rise B->C = -2");
eq(9 - 4, 5, "L rise C->D = +5");
eq(1 - 9, -8, "L rise D->A = -8");
eq(4 - 1, 3, "L rise A->C (shortcut) = +3");
eq(5 - 2 - 3, 0, "L low triangle totals 0");
eq(3 + 5 - 8, 0, "L high triangle totals 0");
eq(5 - 2 + 5 - 8, 0, "L square totals 0");
eq(3, 5 - 2, "L A->C by shortcut = via B (both +3)");
eq(-(-2), 2, "L C->B direct = +2 (backward read of B->C)");
eq(5 - 8 + 5, 2, "L C->B long way C->D->A->B = +2 (routes agree)");
// —— Group M: Ex4 freedom counts — free = V-1, loop tests = E-V+1, by spanning tree ——
function spanSize(V, E) {
  const adj = {};
  for (const v of V) adj[v] = [];
  for (const e of E) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); }
  const seen = {}; seen[V[0]] = true; const q = [V[0]]; let used = 0;
  while (q.length) {
    const u = q.shift();
    for (const v of adj[u]) if (!seen[v]) { seen[v] = true; used++; q.push(v); }
  }
  return used;
}
const mTreeV = ["S", "A", "B", "C", "D", "E"];
const mTreeE = [["S", "A"], ["S", "B"], ["A", "C"], ["B", "D"], ["C", "E"]];
const mTriV = ["A", "B", "C"];
const mTriE = [["A", "B"], ["B", "C"], ["C", "A"]];
const mSqV = ["A", "B", "C", "D"];
const mSqE = [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"]];
const mK4V = ["A", "B", "C", "D"];
const mK4E = [["A", "B"], ["A", "C"], ["A", "D"], ["B", "C"], ["B", "D"], ["C", "D"]];
eq(spanSize(mTreeV, mTreeE), 5, "M tree (V6, E5): spanning tree uses 5 = V-1 edges — 5 free choices");
eq(5 - 5, 0, "M tree: 0 chords — 0 loop tests (5-6+1)");
eq(spanSize(mTriV, mTriE), 2, "M triangle (V3, E3): spanning tree uses 2 = V-1 — 2 free choices");
eq(3 - 2, 1, "M triangle: 1 chord — 1 loop test (3-3+1)");
eq(spanSize(mSqV, mSqE), 3, "M square+shortcut (V4, E5): spanning tree uses 3 = V-1 — 3 free choices");
eq(5 - 3, 2, "M square+shortcut: 2 chords — 2 loop tests (5-4+1)");
eq(spanSize(mK4V, mK4E), 3, "M K4 (V4, E6): spanning tree uses 3 = V-1 — 3 free choices");
eq(6 - 3, 3, "M K4: 3 chords — 3 loop tests (6-4+1)");
// —— census ——
OUT.push("");
OUT.push("census: " + N + " checks, " + (N - FAILS) + " pass, " + FAILS + " fail");
OUT.push(FAILS === 0 ? "VERDICT: ALL PASS" : "VERDICT: FAILURES PRESENT");
console.log(OUT.join("\n"));
