// b09-review-verifier.js — adversarial re-verification of B09 "Graphs and numbers
// on them". Zero code shared with b09-lab.js: potentials are SOLVED from rises by
// edge-list relaxation (not queue BFS), spanning sizes by union-find, geometry by
// scaled-integer comparison. Fresh checks (F) must PASS; injected defects (I)
// must be REJECTED — an accepted injection is a verifier failure.
let V = 0, VBAD = 0;
const LINES = [];
function claim(good, label) {
  V++;
  if (good) LINES.push("PASS " + V + " " + label);
  else { VBAD++; LINES.push("REJECTED-FAIL " + V + " " + label); }
}
function refute(cond, label) {
  V++;
  if (cond) LINES.push("REJECTED " + V + " " + label);
  else { VBAD++; LINES.push("INJECTION-ACCEPTED " + V + " " + label); }
}
function settle(Vs, Eds, root) {
  const known = {};
  const p = {};
  for (const v of Vs) known[v] = false;
  p[root] = 0; known[root] = true;
  let frontier = true;
  while (frontier) {
    frontier = false;
    for (const e of Eds) {
      if (known[e[0]] && !known[e[1]]) { p[e[1]] = p[e[0]] + e[2]; known[e[1]] = true; frontier = true; }
      else if (known[e[1]] && !known[e[0]]) { p[e[0]] = p[e[1]] - e[2]; known[e[0]] = true; frontier = true; }
    }
  }
  return p;
}
function cycleSum(omega, walk) { // walk: list of signed edge labels already in order
  let s = 0;
  for (const t of walk) s += t;
  return s;
}
function ufSize(Vs, Eds) {
  const parent = {};
  for (const v of Vs) parent[v] = v;
  function find(x) { while (parent[x] !== x) x = parent[x]; return x; }
  let used = 0;
  for (const e of Eds) {
    const ru = find(e[0]), rv = find(e[1]);
    if (ru !== rv) { parent[ru] = rv; used++; }
  }
  return used;
}
function q10(x) { return Math.round(x * 10); }
function headPoly(p1, p2) {
  const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
  const len = Math.sqrt(dx * dx + dy * dy);
  const cx = p1[0] + 0.55 * dx, cy = p1[1] + 0.55 * dy;
  const bx = cx - 6.5 * (dx / len), by = cy - 6.5 * (dy / len);
  const px = -(dy / len), py = dx / len;
  return [[cx, cy], [bx + 3 * px, by + 3 * py], [bx - 3 * px, by - 3 * py]];
}
// —— fresh checks F01-F17 (independent recomputation of the page's claims) ——
const triV = ["A", "B", "C"];
const triE = [["A", "B", 50], ["B", "C", -75], ["C", "A", 25]];
const p1 = settle(triV, triE, "A");
claim(p1.B - p1.A === 50 && p1.C - p1.B === -75 && p1.A - p1.C === 25, "F01 Lecture 0: rises recovered from solved potentials (+50,-75,+25)");
claim(p1.A + 40 === 40 && p1.B + 40 === 90 && p1.C + 40 === 15, "F02 Lecture 0: page altitudes = solved potentials + 40 (gauge)");
claim(cycleSum(0, [50, -75, 25]) === 0, "F03 Lecture 0: forward loop sums to 0");
claim(cycleSum(0, [-25, 75, -50]) === 0, "F04 Lecture 0: backward loop sums to 0");
const sqV = ["A", "B", "C", "D"];
const sqE = [["A", "B", 4], ["B", "C", -9], ["C", "D", 7], ["D", "A", -2], ["A", "C", -5]];
const p2 = settle(sqV, sqE, "A");
claim(p2.A === 0 && p2.B === 4 && p2.C === -5 && p2.D === 2, "F05 square: potentials solved from rises, root A = (0,4,-5,2)");
claim(p2.A + 3 === 3 && p2.B + 3 === 7 && p2.C + 3 === -2 && p2.D + 3 === 5, "F06 square: page altitudes = solved + 3 (gauge)");
claim(cycleSum(0, [4, -9, 5]) === 0 && cycleSum(0, [-5, 7, -2]) === 0 && cycleSum(0, [4, -9, 7, -2]) === 0, "F07 square: all three cycles die");
claim(-5 === 4 - 9, "F08 square: A->C shortcut = via B = -5");
claim(9 === 7 - 2 + 4 && 9 === -(p2.C - p2.B), "F09 square: C->B both routes = +9");
const paV = ["v0", "v1", "v2", "v3", "v4"];
const paE = [["v0", "v1", 2], ["v1", "v2", -3], ["v2", "v3", 5], ["v3", "v4", 1]];
const p3 = settle(paV, paE, "v0");
claim([p3.v0, p3.v1, p3.v2, p3.v3, p3.v4].join(",") === "0,2,-1,4,5", "F10 path: solved potentials from root 0 = 0,2,-1,4,5");
const p3s = {};
for (const v of paV) p3s[v] = p3[v] + 10;
let g10 = true, rises10 = true;
for (const v of paV) if (p3s[v] !== p3[v] + 10) g10 = false;
for (const e of paE) if (p3s[e[1]] - p3s[e[0]] !== e[2]) rises10 = false;
claim(g10 && rises10 && p3s.v2 === 9 && p3s.v4 === 15, "F11 path: gauge +10 moves every potential by one constant, rises unchanged");
const trV = ["S", "A", "B", "C", "D", "E"];
const trE = [["S", "A", 3], ["S", "B", -4], ["A", "C", 5], ["B", "D", 2], ["C", "E", -1]];
const p4 = settle(trV, trE, "S");
claim([p4.S, p4.A, p4.B, p4.C, p4.D, p4.E].join(",") === "0,3,-4,8,-2,7", "F12 tree: solved potentials from S = 0,3,-4,8,-2,7");
const p4E = settle(trV, trE, "E");
claim([p4E.E, p4E.C, p4E.A, p4E.S, p4E.B, p4E.D].join(",") === "0,1,-4,-7,-11,-9", "F13 tree: re-rooted at E = E0,C1,A-4,S-7,B-11,D-9");
let d7 = true;
for (const v of trV) if (p4E[v] - p4[v] !== -7) d7 = false;
claim(d7, "F14 tree: re-rooting difference is one constant -7 (Claim 3)");
const ex1E = [["A", "B", -15], ["B", "C", 35], ["C", "A", -20]];
const p5 = settle(triV, ex1E, "A");
claim(p5.B - p5.A === -15 && p5.C - p5.B === 35 && p5.A - p5.C === -20, "F15 Ex1: solved rises -15,+35,-20 from potentials");
claim(cycleSum(0, [-15, 35, -20]) === 0 && cycleSum(0, [15, -35, 20]) === 0, "F16 Ex1: clockwise and counterclockwise loops both die");
const ex2E = [["A", "B", 5], ["B", "C", -2], ["C", "D", 5], ["D", "A", -8], ["A", "C", 3]];
const p6 = settle(sqV, ex2E, "A");
claim(p6.A === 0 && p6.B === 5 && p6.C === 3 && p6.D === 8 && p6.A + 1 === 1 && p6.B + 1 === 6 && p6.C + 1 === 4 && p6.D + 1 === 9, "F17 Ex2: solved (0,5,3,8); page altitudes = solved + 1");
// —— fresh checks F18-F26 ——
const gAB = headPoly([70, 195], [255, 175]);
claim(q10(gAB[0][0]) === 1718 && q10(gAB[0][1]) === 1840 && q10(gAB[1][1]) === 1877 && q10(gAB[2][0]) === 1650, "F18 Fig B09.1: arrowhead A->B matches the page (scaled-integer)");
const gBC = headPoly([255, 175], [150, 48]);
claim(q10(gBC[0][0]) === 1973 && q10(gBC[0][1]) === 1052 && q10(gBC[1][0]) === 2037 && q10(gBC[1][1]) === 1082, "F19 Fig B09.1: arrowhead B->C matches the page (scaled-integer)");
const gCA = headPoly([150, 48], [70, 195]);
claim(q10(gCA[1][0]) === 1065 && q10(gCA[1][1]) === 1217 && q10(gCA[2][0]) === 1117 && q10(gCA[2][1]) === 1246, "F20 Fig B09.1: arrowhead C->A matches the page (corner2 x = 1117 scaled)");
claim(ufSize(["S", "A", "B", "C", "D", "E"], [["S", "A"], ["S", "B"], ["A", "C"], ["B", "D"], ["C", "E"]]) === 5, "F21 Ex4: union-find spanning size of the tree = 5 = V-1");
claim(ufSize(["A", "B", "C"], [["A", "B"], ["B", "C"], ["C", "A"]]) === 2, "F22 Ex4: union-find spanning size of the triangle = 2");
claim(ufSize(["A", "B", "C", "D"], [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"]]) === 3, "F23 Ex4: union-find spanning size of square+shortcut = 3");
claim(ufSize(["A", "B", "C", "D"], [["A", "B"], ["A", "C"], ["A", "D"], ["B", "C"], ["B", "D"], ["C", "D"]]) === 3, "F24 Ex4: union-find spanning size of K4 = 3 (so 3 loop tests)");
// closed-walk spot checks on K4 with phi A=0,B=5,C=-1,D=3 (hand-listed walks)
const kPhi = { A: 0, B: 5, C: -1, D: 3 };
const wk = (w) => { let t = 0; for (let i = 0; i + 1 < w.length; i++) t += kPhi[w[i + 1]] - kPhi[w[i]]; return t; };
claim(wk(["A", "B", "C", "D", "A", "C", "B"]) === 5, "F25 K4: walk A-B-C-D-A-C-B totals +5 = phi(B)-phi(A)");
claim(wk(["A", "C", "B", "D", "A", "B", "D", "C", "A"]) === 0, "F26 K4: long closed walk A-C-B-D-A-B-D-C-A totals 0");
// —— injected defects I01-I16: each must be REJECTED by the engine ——
// refute(cond): cond = "engine disagrees with the injected value" — true means
// the engine catches the defect, so the injection is REJECTED (a pass).
// An INJECTION-ACCEPTED line is a verifier failure.
refute(p1.B - p1.A !== 8, "I01 inject phi(B)=8 in lecture 0 (engine recovers +50)");
refute(cycleSum(0, [50, -75, 25]) !== 5, "I02 inject loop total 5 for (+50,-75,+25) (engine 0)");
refute(cycleSum(0, [1, 1, 1]) !== 0, "I03 inject (+1,+1,+1) passes the loop test (engine total 3, fails)");
refute(p2.C - p2.A !== -7, "I04 inject square A->C = -7 (engine -5)");
refute(cycleSum(0, [4, -9, 7, -2]) !== 4, "I05 inject square outer cycle = 4 (engine 0)");
refute((p2.B + 100) - (p2.A + 100) !== 104, "I06 inject gauge +100 changes A->B to +104 (engine still +4)");
refute(p3.v2 !== -2, "I07 inject path phi(v2) = -2 (engine -1)");
refute(p4.C !== 9, "I08 inject tree phi(C) = 9 (engine 8)");
refute(p4.E !== 6, "I09 inject tree phi(E) = 6 (engine 7)");
refute(p4E.A !== -3, "I10 inject re-rooted phi'(A) = -3 (engine -4)");
refute(p4E.S - p4.S !== -8, "I11 inject Claim-3 constant -8 (engine -7)");
refute(cycleSum(0, [15, -35, 20]) !== 20, "I12 inject Ex1 counterclockwise total 20 (engine 0)");
refute(p6.B - p6.C !== 3, "I13 inject Ex2 C->B direct +3 (engine +2)");
refute(ufSize(["A", "B", "C", "D"], [["A", "B"], ["A", "C"], ["A", "D"], ["B", "C"], ["B", "D"], ["C", "D"]]) !== 2, "I14 inject K4 needs 2 loop tests (engine 3)");
refute(ufSize(["A", "B", "C"], [["A", "B"], ["B", "C"], ["C", "A"]]) !== 3, "I15 inject triangle spanning size 3 (engine 2)");
refute(q10(gCA[2][0]) !== 1118, "I16 inject Fig B09.1 arrowhead C->A corner2 x = 111.8 (engine 111.74)");
// —— census ——
let nPass = 0, nRej = 0;
for (const s of LINES) { if (s.indexOf("PASS ") === 0) nPass++; else if (s.indexOf("REJECTED ") === 0) nRej++; }
LINES.push("");
LINES.push("census: " + V + " checks, " + nPass + " pass, " + nRej + " rejected, " + VBAD + " fail");
LINES.push(VBAD === 0 ? "VERDICT: ALL PASS (fresh checks pass, injections rejected)" : "VERDICT: FAILURES PRESENT");
console.log(LINES.join("\n"));
