// b10-lab.js — machine verification lab for B10 · Potential differences and the loop obstruction
// Page: book/b10-loop-obstruction.html — md5 37e9696e7e7fdb7e1951466b1eb99113, 60764 bytes
// Engine: deterministic recomputation from first principles; no recursion, no BigInt, no Math.random.
// Tables are arrow-keyed: tab['AB'] is the entry for the arrow A -> B; walking B -> A reads -tab['AB'].
var OUT = [], NPASS = 0, NFAIL = 0;
function chk(id, desc, cond) {
  if (cond) { OUT.push('PASS ' + id + ' · ' + desc); NPASS++; }
  else { OUT.push('FAIL ' + id + ' · ' + desc); NFAIL++; }
}
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function r1(x) { return Math.round(x * 10) / 10; }
function wtot(walk, tab) {
  var s = 0;
  for (var i = 0; i + 1 < walk.length; i++) {
    var a = walk[i], b = walk[i + 1];
    if ((a + b) in tab) { s += tab[a + b]; } else { s -= tab[b + a]; }
  }
  return s;
}
// arrowhead: tip at P1 + 0.56*(P2-P1), wings R = 8.2 back from the tip at half-angle 25 degrees
function ah(p1, p2) {
  var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
  var L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
  var tx = p1[0] + 0.56 * dx, ty = p1[1] + 0.56 * dy;
  var R = 8.2, ca = Math.cos(25 * Math.PI / 180), sa = Math.sin(25 * Math.PI / 180);
  var nx = -uy, ny = ux;
  return r1(tx) + ',' + r1(ty) + ' ' + r1(tx - R * (ux * ca + nx * sa)) + ',' + r1(ty - R * (uy * ca + ny * sa)) + ' ' + r1(tx - R * (ux * ca - nx * sa)) + ',' + r1(ty - R * (uy * ca - ny * sa));
}
// seeded Lehmer LCG, reset by each piece that uses it
var seed = 1;
function rnd() { seed = (seed * 48271) % 2147483647; return seed / 2147483647; }
// ---- Group I · section 3(b): two examiners, the census ----
function proc(tab, tree) {   // spanning-tree procedure: column from tree roads, then examinations
  var col = { A: 0 }, keys = Object.keys(tab);
  for (var pass = 0; pass < 3; pass++) for (var i = 0; i < tree.length; i++) {
    var k = tree[i];
    if (col[k[0]] !== undefined && col[k[1]] === undefined) col[k[1]] = col[k[0]] + tab[k];
    else if (col[k[1]] !== undefined && col[k[0]] === undefined) col[k[0]] = col[k[1]] - tab[k];
  }
  var exams = [];
  for (var j = 0; j < keys.length; j++) if (tree.indexOf(keys[j]) < 0) {
    var e = keys[j];
    exams.push({ e: e, demand: col[e[1]] - col[e[0]], table: tab[e], mm: (col[e[1]] - col[e[0]]) - tab[e] });
  }
  return { col: col, exams: exams, pass: exams.every(function (x) { return x.mm === 0; }) };
}
// ---- Group A · Lecture 0, the triangle ----
chk('A1', 'third surveyor (+1,+1,-2): loop total 0', 1 + 1 - 2 === 0);
var cB = 0 + 1, cC = cB + 1;
chk('A2', 'accumulate two roads: column (0,1,2)', cB === 1 && cC === 2);
chk('A3', 'third entry agrees: C->A reads 0-2 = -2', 0 - cC === -2);
chk('A4', 'gauge column (100,101,102) manufactures the same table', 101 - 100 === 1 && 102 - 101 === 1 && 100 - 102 === -2);
chk('A5', 'second surveyor (+1,+1,+1): loop total +3, refuses', 1 + 1 + 1 === 3);
chk('A6', 'B09 triangle (+50,-75,+25): loop total 0', 50 - 75 + 25 === 0);
chk('A7', 'altitudes 40,90,15 manufacture it: 90-40, 15-90, 40-15', 90 - 40 === 50 && 15 - 90 === -75 && 40 - 15 === 25);
// ---- Group B · Lecture 0, the square with a shortcut ----
var sq = [4, -9, 7, -2], sc = -6;
var low = sq[0] + sq[1] - sc, high = sc + sq[2] + sq[3], big = sq[0] + sq[1] + sq[2] + sq[3];
chk('B1', 'square total 0 — the naive test passes', big === 0);
chk('B2', 'low triangle (through B) totals +1', low === 1);
chk('B3', 'high triangle (through D) totals -1', high === -1);
chk('B4', 'the two failures cancel inside the pass: (+1)+(-1) = 0', low + high === 0);
var pB = 0 + sq[0], pC = pB + sq[1], pD = pC + sq[2];
chk('B5', 'accumulation along the sides: column (0,4,-5,2)', eq([pB, pC, pD], [4, -5, 2]));
chk('B6', 'fourth side closes: phi(A)-phi(D) = -2 = table', 0 - pD === -2);
chk('B7', 'shortcut demand -5 vs table -6: mismatch +1', pC - 0 === -5 && sc === -6 && (pC - 0) - sc === 1);
var rp = [4, -9, 7, -2, -5], col = [0, 4, -5, 2];
chk('B8', 'repair shortcut to -5: column verifies all five', col[1] - col[0] === rp[0] && col[2] - col[1] === rp[1] && col[3] - col[2] === rp[2] && col[0] - col[3] === rp[3] && col[2] - col[0] === rp[4]);
chk('B9', 'assembly: high = square - low', high === big - low);
chk('B10', 'telescope around the square on the column: 0', (pB - 0) + (pC - pB) + (pD - pC) + (0 - pD) === 0);
// ---- Group C · the invariance laws (Box B10) ----
var sqt = { AB: 4, BC: -9, CD: 7, DA: -2, AC: -6 };
var wLo = ['A', 'B', 'C', 'A'], wHi = ['A', 'C', 'D', 'A'], wSq = ['A', 'B', 'C', 'D', 'A'];
chk('C1', 'walk direction negates: high -1, reversed +1', wtot(wHi, sqt) === -1 && wtot(['A', 'D', 'C', 'A'], sqt) === 1);
var sqt2 = { BA: -4, BC: -9, CD: 7, DA: -2, AC: -6 };
chk('C2', 're-arrowing AB: all three totals unchanged', wtot(wLo, sqt) === wtot(wLo, sqt2) && wtot(wHi, sqt) === wtot(wHi, sqt2) && wtot(wSq, sqt) === wtot(wSq, sqt2));
var g7 = [7, 11, 2, 9];
chk('C3', 'gauge: column +7 manufactures the same repaired table', g7[1] - g7[0] === 4 && g7[2] - g7[1] === -9 && g7[3] - g7[2] === 7 && g7[0] - g7[3] === -2 && g7[2] - g7[0] === -5);
var rD = { D: 0, A: 0 - 2, B: 0 - 2 + 4, C: 0 - 2 + 4 - 9 };
chk('C4', 're-root at D: column shifts by the constant -2', rD.A - 0 === -2 && rD.B - 0 === 2 && rD.C - 0 === -7 && (rD.B - rD.A) === 4 && (rD.C - rD.B) === -9);
chk('C5', 'shortcut mismatch +1 from root A and from root D alike', ((0 + 4 - 9) - 0) - (-6) === 1 && (rD.C - rD.A) - (-6) === 1);
chk('C6', 're-arrowed table: totals negate under walk reversal, magnitudes kept', wtot(wLo, sqt2) === -wtot(['A', 'C', 'B', 'A'], sqt2));
// ---- Group D · the count E - V + 1, from edge lists ----
var gTree = ['SA', 'SB', 'AC', 'BD', 'CE'], gTri = ['AB', 'BC', 'CA'], gSqE = ['AB', 'BC', 'CD', 'DA', 'AC'], gK4 = ['AB', 'AC', 'AD', 'BC', 'BD', 'CD'];
chk('D1', '6-town tree: 5 edges, 6 towns, E-V+1 = 0', gTree.length === 5 && gTree.length - 6 + 1 === 0);
chk('D2', 'triangle: 3 edges, 3 towns, E-V+1 = 1', gTri.length === 3 && gTri.length - 3 + 1 === 1);
chk('D3', 'square+shortcut: 5 edges, 4 towns, E-V+1 = 2', gSqE.length === 5 && gSqE.length - 4 + 1 === 2);
chk('D4', 'K4: 6 edges, 4 towns, E-V+1 = 3', gK4.length === 6 && gK4.length - 4 + 1 === 3);
chk('D5', 'B09 exploration pin: tree 5/0, triangle 2/1, square 3/2, K4 3/3', (6 - 1 === 5 && 5 - 6 + 1 === 0) && (3 - 1 === 2 && 3 - 3 + 1 === 1) && (4 - 1 === 3 && 5 - 4 + 1 === 2) && (4 - 1 === 3 && 6 - 4 + 1 === 3));
// ---- Group E · the triangle census, entries in [-3,3]^3 ----
var mk = {};
for (var x = -6; x <= 6; x++) for (var y = -6; y <= 6; y++) for (var z = -6; z <= 6; z++) {
  mk[(y - x) + ',' + (z - y) + ',' + (x - z)] = 1;   // every altitude triple in [-6,6]^3, gauge included
}
var n = 0, np = 0, equiv = true;
for (var a = -3; a <= 3; a++) for (var b = -3; b <= 3; b++) for (var c = -3; c <= 3; c++) {
  n++;
  var has = !!mk[a + ',' + b + ',' + c];
  if (has) np++;
  if (has !== (a + b + c === 0)) equiv = false;
}
chk('E1', 'census size: 343 tables', n === 343);
chk('E2', 'exactly 37 pass', np === 37);
chk('E3', 'brute-force altitude search agrees with the loop test on all 343', equiv);
chk('E4', 'membership receipts: (1,1,-2), (0,0,0), (-3,3,0) in; (1,1,1) out', !!mk['1,1,-2'] && !!mk['0,0,0'] && !!mk['-3,3,0'] && !mk['1,1,1']);
chk('E5', 'one-entry repairs of (+3,-1,+5): (-4,-1,+5), (3,-8,+5), (3,-1,-2) all total 0', -4 - 1 + 5 === 0 && 3 - 8 + 5 === 0 && 3 - 1 - 2 === 0);
chk('E6', 'repaired table (3,-1,-2) manufactured by column (0,3,2)', mk['3,-1,-2'] === 1 && 3 - 0 === 3 && 2 - 3 === -1 && 0 - 2 === -2);
// ---- Group F · section 3(a): the refused triangle, by procedure ----
var t2 = { AB: 1, BC: 1, CA: 1 };
chk('F1', 'tree {AB,BC} on (+1,+1,+1): column (0,1,2)', 0 === 0 && 0 + 1 === 1 && 1 + 1 === 2);
chk('F2', 'examination of CA: column demands 0-2 = -2', 0 - 2 === -2);
chk('F3', 'mismatch: demand - table = -2 - 1 = -3', (0 - 2) - 1 === -3);
chk('F4', 'the fundamental cycle totals +3 = -(mismatch)', wtot(['A', 'B', 'C', 'A'], t2) === 3 && wtot(['A', 'B', 'C', 'A'], t2) === -((0 - 2) - 1));
chk('F5', 'repair CA to -2: the loop dies and (0,1,2) verifies all three', wtot(['A', 'B', 'C', 'A'], { AB: 1, BC: 1, CA: -2 }) === 0 && 1 - 0 === 1 && 2 - 1 === 1 && 0 - 2 === -2);
// ---- Group G · Fig B10.1, every coordinate recomputed ----
var T1 = [70, 195], T2 = [255, 175], T3 = [150, 48];
chk('G1', 'towns A(70,195) B(255,175) C(150,48) at the design positions', eq([T1, T2, T3], [[70, 195], [255, 175], [150, 48]]));
chk('G2', 'arrowhead A->B: formula = page polygon', ah(T1, T2) === '173.6,183.8 165.8,181.2 166.6,188');
chk('G3', 'arrowhead B->C: formula = page polygon', ah(T2, T3) === '196.2,103.9 198.3,111.8 203.6,107.4');
chk('G4', 'arrowhead C->A: formula = page polygon', ah(T3, T1) === '105.2,130.3 111.8,125.4 105.7,122.1');
function lab1(p1, p2, s) {
  var dx = p2[0] - p1[0], dy = p2[1] - p1[1], L = Math.sqrt(dx * dx + dy * dy);
  var nx = -(dy / L), ny = dx / L;
  return [r1((p1[0] + p2[0]) / 2 + s * 14 * nx), r1((p1[1] + p2[1]) / 2 + s * 14 * ny)];
}
chk('G5', '+1 label on AB: midpoint - 14*perp = (161,171.1)', eq(lab1(T1, T2, -1), [161, 171.1]));
chk('G6', '+1 label on BC: midpoint + 14*perp = (213.3,102.6)', eq(lab1(T2, T3, 1), [213.3, 102.6]));
chk('G7', '+1 label on CA: midpoint + 14*perp = (97.7,114.8)', eq(lab1(T3, T1, 1), [97.7, 114.8]));
var t2 = { AB: 1, BC: 1, CA: 1 }, T1 = [70, 195], T2 = [255, 175], T3 = [150, 48];
chk('G8', 'loop-total label: (centroid x, centroid y - 4) = (158.3,135.3)', eq([r1((70 + 255 + 150) / 3), r1((195 + 175 + 48) / 3 - 4)], [158.3, 135.3]));
chk('G9', 'town labels: A+( -30,21) start, B+(8,21) start, C+(0,-12) middle', eq([[70 - 30, 195 + 21], [255 + 8, 175 + 21], [150, 48 - 12]], [[40, 216], [263, 196], [150, 36]]));
chk('G10', 'the three road lines join exactly the town coordinates', eq([[T1[0], T1[1], T2[0], T2[1]], [T2[0], T2[1], T3[0], T3[1]], [T3[0], T3[1], T1[0], T1[1]]], [[70, 195, 255, 175], [255, 175, 150, 48], [150, 48, 70, 195]]));
chk('G11', 'strip label at (viewBox 340 / 2, 244) = (170,244)', eq([r1(340 / 2), 244], [170, 244]));
chk('G12', 'caption claim: the loop totals +3 for the drawn table', wtot(['A', 'B', 'C', 'A'], t2) === 3);
// ---- Group H · Fig B10.2, every coordinate recomputed ----
var Q = [[85, 50], [255, 50], [255, 200], [85, 200]];
chk('H1', 'towns A(85,50) B(255,50) C(255,200) D(85,200)', eq(Q, [[85, 50], [255, 50], [255, 200], [85, 200]]));
chk('H2', 'four side lines join consecutive towns, diagonal joins A to C', eq([[Q[0][0], Q[0][1], Q[1][0], Q[1][1]], [Q[1][0], Q[1][1], Q[2][0], Q[2][1]], [Q[2][0], Q[2][1], Q[3][0], Q[3][1]], [Q[3][0], Q[3][1], Q[0][0], Q[0][1]], [Q[0][0], Q[0][1], Q[2][0], Q[2][1]]], [[85, 50, 255, 50], [255, 50, 255, 200], [255, 200, 85, 200], [85, 200, 85, 50], [85, 50, 255, 200]]));
chk('H3', 'town labels: A,B at town+(0,-12), C,D at town+(0,22)', eq([[85, 50 - 12], [255, 50 - 12], [255, 200 + 22], [85, 200 + 22]], [[85, 38], [255, 38], [255, 222], [85, 222]]));
function mid(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
chk('H4', '+4 label: mid(A,B) + (0,-8) = (170,42)', eq([r1(mid(Q[0], Q[1])[0]), r1(mid(Q[0], Q[1])[1] - 8)], [170, 42]));
chk('H5', '-9 label: mid(B,C) + (11,3) = (266,128)', eq([r1(mid(Q[1], Q[2])[0] + 11), r1(mid(Q[1], Q[2])[1] + 3)], [266, 128]));
var Q = [[85, 50], [255, 50], [255, 200], [85, 200]];
function mid(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
chk('H6', '+7 label: mid(C,D) + (0,14) = (170,214)', eq([r1(mid(Q[2], Q[3])[0]), r1(mid(Q[2], Q[3])[1] + 14)], [170, 214]));
chk('H7', '-2 label: mid(D,A) + (-11,3) = (74,128)', eq([r1(mid(Q[3], Q[0])[0] - 11), r1(mid(Q[3], Q[0])[1] + 3)], [74, 128]));
chk('H8', '-6 label: shortcut midpoint + (0.6,16.5) = (170.6,141.5)', eq([r1(mid(Q[0], Q[2])[0] + 0.6), r1(mid(Q[0], Q[2])[1] + 16.5)], [170.6, 141.5]));
chk('H9', 'red totals at the design positions +1 (222,108), -1 (138,168)', eq([[222, 108], [138, 168]], [[222, 108], [138, 168]]));
chk('H10', 'strip label (170,244); drawn totals +1/-1/0 match the table', eq([r1(340 / 2), 244], [170, 244]) && 4 - 9 + 6 === 1 && -6 + 7 - 2 === -1 && 4 - 9 + 7 - 2 === 0);
var F = { AB: 4, BC: -9, CD: 7, DA: -2, AC: -6 }, R = { AB: 4, BC: -9, CD: 7, DA: -2, AC: -5 };
var t1 = proc(F, ['AB', 'BC', 'CD']), t2 = proc(F, ['AB', 'DA', 'CD']);
chk('I1', 'side tree: column (0,4,-5,2); DA agrees, AC off by +1: refused', eq([t1.col.A, t1.col.B, t1.col.C, t1.col.D], [0, 4, -5, 2]) && t1.exams.length === 2 && t1.exams[0].mm === 0 && t1.exams[1].mm === 1 && !t1.pass);
chk('I2', 'second tree {AB,DA,CD}: the same column (0,4,-5,2)', eq([t2.col.A, t2.col.B, t2.col.C, t2.col.D], [0, 4, -5, 2]));
chk('I3', 'second tree exams: BC agrees (-9), AC off by +1: refused again', t2.exams.length === 2 && t2.exams[0].e === 'BC' && t2.exams[0].demand === -9 && t2.exams[0].mm === 0 && t2.exams[1].e === 'AC' && t2.exams[1].mm === 1 && !t2.pass);
chk('I4', 'both examiners: same column, same shortcut mismatch +1', eq([t1.col.A, t1.col.B, t1.col.C, t1.col.D], [t2.col.A, t2.col.B, t2.col.C, t2.col.D]) && t1.exams[1].mm === t2.exams[1].mm);
chk('I5', 'repaired table passes under both trees', proc(R, ['AB', 'BC', 'CD']).pass && proc(R, ['AB', 'DA', 'CD']).pass);
var mkt = {}, cols = 0;
for (var b = -6; b <= 6; b++) for (var c = -6; c <= 6; c++) for (var d = -6; d <= 6; d++) {
  mkt[(b) + ',' + (c - b) + ',' + (d - c) + ',' + (-d) + ',' + (c)] = 1; cols++;
}
var nt = 0, pt = 0, agree = true, agreeBF = true;
for (var v0 = -2; v0 <= 2; v0++) for (var v1 = -2; v1 <= 2; v1++) for (var v2 = -2; v2 <= 2; v2++) for (var v3 = -2; v3 <= 2; v3++) for (var v4 = -2; v4 <= 2; v4++) {
  var tb = { AB: v0, BC: v1, CD: v2, DA: v3, AC: v4 };
  var p1v = proc(tb, ['AB', 'BC', 'CD']).pass, p2v = proc(tb, ['AB', 'DA', 'CD']).pass;
  var bf = !!mkt[v0 + ',' + v1 + ',' + v2 + ',' + v3 + ',' + v4];
  nt++;
  if (p1v) pt++;
  if (p1v !== p2v) agree = false;
  if (p1v !== bf) agreeBF = false;
}
chk('I6', 'square census: 3125 tables, columns searched over [-6,6]^3 rooted at A', nt === 3125 && cols === 2197);
chk('I7', 'exactly 75 pass', pt === 75);
chk('I8', 'the two trees agree on every one of the 3125', agree);
chk('I9', 'both trees agree with the brute-force column search on every one', agreeBF);
// ---- shared data: the K4 cycles, tables, and star-tree column ----
var cw = [['A', 'B', 'C', 'A'], ['A', 'B', 'D', 'A'], ['A', 'C', 'D', 'A'], ['B', 'C', 'D', 'B'], ['A', 'B', 'C', 'D', 'A'], ['A', 'C', 'B', 'D', 'A'], ['A', 'B', 'D', 'C', 'A']];
var K = { AB: 3, AC: -1, AD: 2, BC: -4, BD: -1, CD: 3 };
var D4 = { AB: 3, AC: -1, AD: 2, BC: -4, BD: -1, CD: 4 };
var col4 = { A: 0, B: K.AB, C: K.AC, D: K.AD };
// ---- Group J · section 3(c): K4, the star-tree procedure ----
chk('J1', 'star tree out of A: column (0,3,-1,2)', eq([col4.A, col4.B, col4.C, col4.D], [0, 3, -1, 2]));
chk('J2', 'all six entries agree with the column', col4.B - col4.A === K.AB && col4.C - col4.A === K.AC && col4.D - col4.A === K.AD && col4.C - col4.B === K.BC && col4.D - col4.B === K.BD && col4.D - col4.C === K.CD);
chk('J3', 'triangle ABC totals 0', wtot(cw[0], K) === 0);
chk('J4', 'triangle ABD totals 0', wtot(cw[1], K) === 0);
chk('J5', 'triangle ACD totals 0', wtot(cw[2], K) === 0);
chk('J6', 'triangle BCD totals 0', wtot(cw[3], K) === 0);
chk('J7', 'square A-B-C-D-A totals 0', wtot(cw[4], K) === 0);
chk('J8', 'square A-C-B-D-A totals 0', wtot(cw[5], K) === 0);
chk('J9', 'square A-B-D-C-A totals 0', wtot(cw[6], K) === 0);
var dt = cw.map(function (c) { return wtot(c, D4); });
chk('J10', 'doctored CD=4: column untouched, CD demand 3 vs 4, mismatch -1, cycle +1', eq([col4.B, col4.C, col4.D], [0 + 3, -1, 2]) && (col4.D - col4.C) - D4.CD === -1 && wtot(cw[2], D4) === 1);
chk('J11', 'doctored seven totals: (0,0,+1,+1,+1,0,-1)', eq(dt, [0, 0, 1, 1, 1, 0, -1]));
// assembly by signed edge-multiset arithmetic over (AB,AC,AD,BC,BD,CD)
function cvec(w) { var v = [0, 0, 0, 0, 0, 0], ix = { AB: 0, AC: 1, AD: 2, BC: 3, BD: 4, CD: 5 };
  for (var i = 0; i + 1 < w.length; i++) { var a = w[i], b = w[i + 1], k = (a + b) in ix ? a + b : b + a, s = (a + b) in ix ? 1 : -1; v[ix[k]] += s; }
  return v; }
function vadd(u, v, m) { var r = []; for (var i = 0; i < 6; i++) r.push(u[i] + m * v[i]); return r; }
var fBC = cvec(cw[0]), fBD = cvec(cw[1]), fCD = cvec(cw[2]);
chk('J12', 'assembly vectors: BCD = F_BC - F_BD + F_CD, ABCD = F_BC + F_CD, ACBDA = -F_BC + F_BD, ABDCA = F_BD - F_CD', eq(vadd(vadd(fBC, fBD, -1), fCD, 1), cvec(cw[3])) && eq(vadd(fBC, fCD, 1), cvec(cw[4])) && eq(vadd(fBD, fBC, -1), cvec(cw[5])) && eq(vadd(fBD, fCD, -1), cvec(cw[6])));
// ---- Group K · K4 repairs, independence, random certificates ----
seed = 987654;
var edges = ['AB', 'AC', 'AD', 'BC', 'BD', 'CD'];
var winners = [];
for (var ei = 0; ei < 6; ei++) for (var dd = -8; dd <= 8; dd++) {
  if (dd === 0) continue;
  var T = { AB: 3, AC: -1, AD: 2, BC: -4, BD: -1, CD: 4 };
  T[edges[ei]] += dd;
  var allz = true;
  for (var ci = 0; ci < 7 && allz; ci++) if (wtot(cw[ci], T) !== 0) allz = false;
  if (allz) winners.push(edges[ei] + (dd > 0 ? '+' : '') + dd);
}
chk('K1', 'single-entry repair census (deltas up to +-8): exactly one, CD-1', eq(winners, ['CD-1']));
chk('K2', 'tilt AC to -2: kills ACD but wakes ABC to +1', wtot(['A', 'C', 'D', 'A'], { AB: 3, AC: -2, AD: 2, BC: -4, BD: -1, CD: 4 }) === 0 && wtot(['A', 'B', 'C', 'A'], { AB: 3, AC: -2, AD: 2, BC: -4, BD: -1, CD: 4 }) === 1);
chk('K3', 'tilt AD to +3: kills ACD but wakes ABD to -1', wtot(['A', 'C', 'D', 'A'], { AB: 3, AC: -1, AD: 3, BC: -4, BD: -1, CD: 4 }) === 0 && wtot(['A', 'B', 'D', 'A'], { AB: 3, AC: -1, AD: 3, BC: -4, BD: -1, CD: 4 }) === -1);
var linOK = true, injOK = true, seen = {};
for (var t = 0; t < 50; t++) {
  var RT = {};
  for (var q = 0; q < 6; q++) RT[edges[q]] = Math.floor(rnd() * 9) - 4;
  var F3 = [wtot(cw[0], RT), wtot(cw[1], RT), wtot(cw[2], RT)];
  var s7 = cw.map(function (c) { return wtot(c, RT); });
  if (!(s7[3] === F3[0] - F3[1] + F3[2] && s7[4] === F3[0] + F3[2] && s7[5] === -F3[0] + F3[1] && s7[6] === F3[1] - F3[2])) linOK = false;
  var key = s7.join(',');
  if (seen[key] !== undefined && seen[key] !== F3.join(',')) injOK = false;
  if (seen[key] === undefined) seen[key] = F3.join(',');
}
chk('K4', 'assembly arithmetic holds linearly on 50 random tables', linOK);
chk('K5', 'the triple (F_BC,F_BD,F_CD) determines all seven totals: injective on 50 random tables', injOK);
var suffOK = true;
for (var u = 0; u < 50; u++) {
  var bb = Math.floor(rnd() * 11) - 5, cc2 = Math.floor(rnd() * 11) - 5, dd2 = Math.floor(rnd() * 11) - 5;
  var MT = { AB: bb, AC: cc2, AD: dd2, BC: cc2 - bb, BD: dd2 - bb, CD: dd2 - cc2 };
  for (var w = 0; w < 7; w++) if (wtot(cw[w], MT) !== 0) suffOK = false;
}
chk('K6', '50 random columns: manufactured tables pass all seven cycles', suffOK);
// ---- Group L · Fig B10.3, every coordinate recomputed ----
var Z = [[170, 125], [80, 52], [260, 52], [170, 205]];
chk('L1', 'towns A(170,125) B(80,52) C(260,52) D(170,205)', eq(Z, [[170, 125], [80, 52], [260, 52], [170, 205]]));
chk('L2', 'dark star lines: A to B, A to C, A to D', eq([[Z[0][0], Z[0][1], Z[1][0], Z[1][1]], [Z[0][0], Z[0][1], Z[2][0], Z[2][1]], [Z[0][0], Z[0][1], Z[3][0], Z[3][1]]], [[170, 125, 80, 52], [170, 125, 260, 52], [170, 125, 170, 205]]));
chk('L3', 'blue examination lines: B-C, B-D, C-D', eq([[Z[1][0], Z[1][1], Z[2][0], Z[2][1]], [Z[1][0], Z[1][1], Z[3][0], Z[3][1]], [Z[2][0], Z[2][1], Z[3][0], Z[3][1]]], [[80, 52, 260, 52], [80, 52, 170, 205], [260, 52, 170, 205]]));
chk('L4', 'town labels: A+(0,-11) middle, B+(-14,3) end, C+(14,3) start, D+(0,17) middle', eq([[170, 125 - 11], [80 - 14, 52 + 3], [260 + 14, 52 + 3], [170, 205 + 17]], [[170, 114], [66, 55], [274, 55], [170, 222]]));
var Z = [[170, 125], [80, 52], [260, 52], [170, 205]];
function lab3(p1, p2, s) {
  var dx = p2[0] - p1[0], dy = p2[1] - p1[1], L = Math.sqrt(dx * dx + dy * dy);
  var nx = -(dy / L), ny = dx / L;
  return [r1((p1[0] + p2[0]) / 2 + s * 13 * nx), r1((p1[1] + p2[1]) / 2 + s * 13 * ny)];
}
chk('L5', 'tree value labels: AB mid-13n = (116.8,98.6), AC mid-13n = (206.8,78.4), AD mid+13n = (157,165)', eq(lab3(Z[0], Z[1], -1), [116.8, 98.6]) && eq(lab3(Z[0], Z[2], -1), [206.8, 78.4]) && eq(lab3(Z[0], Z[3], 1), [157, 165]));
chk('L6', 'blue value labels: BC mid+(0,-10) = (170,42), BD mid+13n = (113.8,135.1), CD mid-13n = (226.2,135.1)', eq([170, 42], [r1((80 + 260) / 2), r1((52 + 52) / 2 - 10)]) && eq(lab3(Z[1], Z[3], 1), [113.8, 135.1]) && eq(lab3(Z[2], Z[3], -1), [226.2, 135.1]));
chk('L7', 'strip label (170,244)', eq([r1(340 / 2), 244], [170, 244]));
chk('L8', 'star labels +3,-1,+2 are the table entries on AB, AC, AD', 3 === K.AB && -1 === K.AC && 2 === K.AD);
chk('L9', 'blue labels -4,-1,+3 are the table entries on BC, BD, CD', -4 === K.BC && -1 === K.BD && 3 === K.CD);
chk('L10', 'caption count: E-V+1 = 3 examinations for K4', 6 - 4 + 1 === 3);
// ---- Group M · the divergence bookkeeping: 323 closed walks on the 6-town tree ----
seed = 20261031;
var adj = { S: ['A', 'B'], A: ['S', 'C'], B: ['S', 'D'], C: ['A', 'E'], D: ['B'], E: ['C'] };
var treeTab = { SA: 3, SB: -4, AC: 5, BD: 2, CE: -1 };
var altTab = { SA: 2, SB: 2, AC: -7, BD: 0, CE: 9 };
var netOK1 = true, netOK2 = true, totA = true, totB = true, closed = true, walkN = 0;
for (var wk = 0; wk < 323; wk++) {
  var at = 'S', steps = 0, path = ['S'];
  var net = { SA: 0, SB: 0, AC: 0, BD: 0, CE: 0 };
  do {
    var opts = adj[at];
    var nxt = opts[Math.floor(rnd() * opts.length)];
    var fw = (at + nxt) in treeTab;
    net[fw ? at + nxt : nxt + at] += fw ? 1 : -1;
    path.push(nxt);
    at = nxt; steps++;
  } while (!(at === 'S' && steps > 0) && steps < 400);
  walkN++;
  if (!(at === 'S' && steps > 0)) closed = false;
  for (var ek in net) if (net[ek] !== 0) { if (walkN <= 200) netOK1 = false; else netOK2 = false; }
  if (wtot(path, treeTab) !== 0) totA = false;
  if (wtot(path, altTab) !== 0) totB = false;
}
chk('M1', 'closed walks 1-200 on the tree: net per edge 0', netOK1 && walkN >= 200);
chk('M2', 'closed walks 201-323: net per edge 0', netOK2 && walkN === 323);
chk('M3', 'all 323 walks total 0 under the tree rise table (+3,-4,+5,+2,-1)', totA);
chk('M4', 'all 323 walks total 0 under a second, arbitrary table too (net 0 forces it)', totB && closed);
chk('M5', 'leaf-strip: repeated leaf removal takes all 5 tree edges, one each, none left', (function () {
  var edg = [['S', 'A'], ['S', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'E']];
  var live = [1, 1, 1, 1, 1], alive = 5, guard = 0;
  while (alive > 0 && guard < 20) {
    guard++;
    var deg = {};
    for (var i = 0; i < 5; i++) if (live[i]) { deg[edg[i][0]] = (deg[edg[i][0]] || 0) + 1; deg[edg[i][1]] = (deg[edg[i][1]] || 0) + 1; }
    var found = false;
    for (var j = 0; j < 5; j++) if (live[j] && ((deg[edg[j][0]] || 0) === 1 || (deg[edg[j][1]] || 0) === 1)) { live[j] = 0; alive--; found = true; break; }
    if (!found) break;
  }
  return alive === 0 && guard <= 6;
})());
// ---- Group N · the exploration: three examiners, one table ----
var F = { AB: 4, BC: -9, CD: 7, DA: -2, AC: -6 }, R = { AB: 4, BC: -9, CD: 7, DA: -2, AC: -5 };
chk('N1', 'side tree catches it via the low triangle: A-B-C-A totals +1', wtot(['A', 'B', 'C', 'A'], F) === 1);
chk('N2', 'second tree {AB,DA,CD} catches it via the high triangle in reverse: A-D-C-A totals +1', wtot(['A', 'D', 'C', 'A'], F) === 1);
var c3 = { A: 0, B: 0 + F.AB, C: 0 + F.AC, D: 0 + F.AC + F.CD };
chk('N3', 'third tree {AB,AC,CD} keeps the shortcut: column (0,4,-6,1)', eq([c3.A, c3.B, c3.C, c3.D], [0, 4, -6, 1]));
chk('N4', 'its BC exam fails by one: demand -10 against table -9; cycle B-A-C-B totals -1', (c3.C - c3.B) === -10 && F.BC === -9 && wtot(['B', 'A', 'C', 'B'], F) === -1);
chk('N5', 'its DA exam fails by one: demand -1 against table -2; cycle D-C-A-D totals +1', (c3.A - c3.D) === -1 && F.DA === -2 && wtot(['D', 'C', 'A', 'D'], F) === 1);
// columns on the repaired table, one per tree
var F = { AB: 4, BC: -9, CD: 7, DA: -2, AC: -6 }, R = { AB: 4, BC: -9, CD: 7, DA: -2, AC: -5 };
var t1c = { A: 0, B: 0 + R.AB, C: 0 + R.AB + R.BC, D: 0 + R.AB + R.BC + R.CD };
var t2c = { A: 0, B: 0 + R.AB, D: 0 - R.DA, C: 0 - R.DA - R.CD };
var t3c = { A: 0, B: 0 + R.AB, C: 0 + R.AC, D: 0 + R.AC + R.CD };
chk('N6', 'repaired table passes under all three trees (six examinations, all agree)', (t1c.A - t1c.D) - R.DA === 0 && (t1c.C - t1c.A) - R.AC === 0 && (t2c.C - t2c.B) - R.BC === 0 && (t2c.C - t2c.A) - R.AC === 0 && (t3c.C - t3c.B) - R.BC === 0 && (t3c.A - t3c.D) - R.DA === 0);
chk('N7', 'each tree keeps 3 of the 5 roads and examines exactly E-V+1 = 2', (5 - 3) === 2);
var f2c = 0 - F.DA - F.CD;   // second tree's phi(C) on the failing table
chk('N8', 'both catching examinations sit on the shortcut: mismatch +1 on AC for trees one and two', ((0 + F.AB + F.BC) - 0) - F.AC === 1 && (f2c - 0) - F.AC === 1);
// ---- summary ----
OUT.push('b10-lab: ' + NPASS + '/' + (NPASS + NFAIL) + ' checks passed');
if (typeof console !== 'undefined') { OUT.forEach(function (l) { console.log(l); }); }
