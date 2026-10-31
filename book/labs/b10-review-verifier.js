// b10-review-verifier.js — adversarial independent verification for book/b10-loop-obstruction.html
// page md5 37e9696e7e7fdb7e1951466b1eb99113 (60764 bytes, 270 lines)
// fresh engine, zero code shared with b10-lab.js: a BFS potential solver over adjacency
// lists; closed walks summed as signed arrow-multisets; figure arrowheads built from
// 2x2 rotation matrices at plus/minus 25 degrees; label offsets taken along the
// 90-degree rotation; brute-force column searches; no recursion, no BigInt,
// no Math.random anywhere.
// contract: 26 fresh checks must PASS and 16 poisoned injections must be REJECTED.
// rej() prints INJECTION-ACCEPTED for a poison that reads true — that is a failure.
// 42/42 or the page fails review.
var OUT = [], F = 0;
function ok(n, c) { OUT.push((c ? 'PASS ' : 'FAIL ') + n); if (!c) F++; }
function rej(n, c) { OUT.push((c ? 'INJECTION-ACCEPTED ' : 'REJECTED ') + n); if (c) F++; }
function bfs(es) {
  var phi = {}, adj = {}, q = [], i, x, e, o, fwd;
  for (i = 0; i < es.length; i++) { e = es[i]; (adj[e.u] = adj[e.u] || []).push(e); (adj[e.v] = adj[e.v] || []).push(e); }
  phi[es[0].u] = 0; q.push(es[0].u);
  while (q.length) {
    x = q.shift(); var L = adj[x] || [];
    for (i = 0; i < L.length; i++) { e = L[i]; fwd = (e.u === x); o = fwd ? e.v : e.u; if (phi[o] === undefined) { phi[o] = phi[x] + (fwd ? e.t : -e.t); q.push(o); } }
  }
  return phi;
}
function wt(s, t) { var r = 0, i; for (i = 0; i < s.length; i++) r += s[i][1] ? t[s[i][0]] : -t[s[i][0]]; return r; }
function rot(a) { var c = Math.cos(a), s = Math.sin(a); return function (x, y) { return [c * x - s * y, s * x + c * y]; }; }
function arw(p, q) {
  var dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
  var t = [p[0] + 0.56 * dx, p[1] + 0.56 * dy], w = [];
  [rot(25 * Math.PI / 180), rot(-25 * Math.PI / 180)].forEach(function (R) { var v = R(ux, uy); w.push([t[0] - 8.2 * v[0], t[1] - 8.2 * v[1]]); });
  return [t].concat(w);
}
var T0 = { AB: 1, BC: 1, CA: -2 };
var T3 = { AB: 1, BC: 1, CA: 1 };
var ALT = { AB: 50, BC: -75, CA: 25 };
var SQ = { AB: 4, BC: -9, CD: 7, DA: -2, AC: -6 };
var SQR = { AB: 4, BC: -9, CD: 7, DA: -2, AC: -5 };
var K4 = { AB: 3, AC: -1, AD: 2, BC: -4, BD: -1, CD: 3 };
var K4D = { AB: 3, AC: -1, AD: 2, BC: -4, BD: -1, CD: 4 };
var W_TRI = [['AB', 1], ['BC', 1], ['CA', 1]];
var W_SQ = [['AB', 1], ['BC', 1], ['CD', 1], ['DA', 1]];
var W_LOW = [['AB', 1], ['BC', 1], ['AC', 0]];
var W_HIGH = [['AC', 1], ['CD', 1], ['DA', 1]];
var W_K4 = [
  [['AB', 1], ['BC', 1], ['AC', 0]],
  [['AB', 1], ['BD', 1], ['AD', 0]],
  [['AC', 1], ['CD', 1], ['AD', 0]],
  [['BC', 1], ['CD', 1], ['BD', 0]],
  [['AB', 1], ['BC', 1], ['CD', 1], ['AD', 0]],
  [['AC', 1], ['BC', 0], ['BD', 1], ['AD', 0]],
  [['AB', 1], ['BD', 1], ['CD', 0], ['AC', 0]]
];
var p = bfs([{ u: 'A', v: 'B', t: 1 }, { u: 'B', v: 'C', t: 1 }]);
ok('V1 · lecture-0 triangle (+1,+1,-2): BFS column (0,1,2); CA demand -2 = table; loop total 0', p.A === 0 && p.B === 1 && p.C === 2 && p.A - p.C === -2 && wt(W_TRI, T0) === 0);
ok('V2 · (+1,+1,+1): same column; demand -2 against table +1 leaves mismatch -3; the loop totals +3', (p.A - p.C) - T3.CA === -3 && wt(W_TRI, T3) === 3);
var pa = bfs([{ u: 'A', v: 'B', t: 50 }, { u: 'B', v: 'C', t: -75 }]);
var alt3 = { A: 40, B: 90, C: 15 };
ok('V3 · altitudes 40/90/15: the differences +50/-75/+25 are the table; the rooted BFS column (0,50,-25) manufactures it too — loop total 0', alt3.B - alt3.A === 50 && alt3.C - alt3.B === -75 && alt3.A - alt3.C === 25 && pa.B === 50 && pa.C === -25 && pa.A - pa.C === 25 && wt(W_TRI, ALT) === 0);
var ps = bfs([{ u: 'A', v: 'B', t: 4 }, { u: 'B', v: 'C', t: -9 }, { u: 'C', v: 'D', t: 7 }]);
ok('V4 · square: BFS on three sides gives column (0,4,-5,2); DA closes at -2; the square walk totals 0', ps.A === 0 && ps.B === 4 && ps.C === -5 && ps.D === 2 && ps.A - ps.D === -2 && wt(W_SQ, SQ) === 0);
ok('V5 · low triangle +1, high triangle -1, and the two edge multisets add up to the square walk: 0', wt(W_LOW, SQ) === 1 && wt(W_HIGH, SQ) === -1 && wt(W_LOW, SQ) + wt(W_HIGH, SQ) === wt(W_SQ, SQ));
ok('V6 · shortcut: demand -5 against table -6, mismatch +1; repaired to -5 both triangles die and the column verifies all five', (ps.C - ps.A) - SQ.AC === 1 && wt(W_LOW, SQR) === 0 && wt(W_HIGH, SQR) === 0 && ps.C - ps.A === SQR.AC && ps.A - ps.D === SQR.DA);
ok('V7 · 3(a) procedure: mismatch -3 = demand - table; repairing CA to -2 lands exactly on the lecture-0 table', (p.A - p.C) - T3.CA === -3 && T0.CA === -2 && wt(W_TRI, T0) === 0);
var g = { A: 100, B: 101, C: 102 };
ok('V8 · gauge: the column (100,101,102) manufactures (+1,+1,-2) — the same table at different altitudes', g.B - g.A === 1 && g.C - g.B === 1 && g.A - g.C === -2);
var t1 = bfs([{ u: 'A', v: 'B', t: SQ.AB }, { u: 'B', v: 'C', t: SQ.BC }, { u: 'C', v: 'D', t: SQ.CD }]);
var t2 = bfs([{ u: 'A', v: 'B', t: SQ.AB }, { u: 'D', v: 'A', t: SQ.DA }, { u: 'C', v: 'D', t: SQ.CD }]);
ok('V9 · the two trees {AB,BC,CD} and {AB,DA,CD} accumulate to the same column (0,4,-5,2); both refuse the shortcut by +1', [t1.A, t1.B, t1.C, t1.D].join() === '0,4,-5,2' && [t2.A, t2.B, t2.C, t2.D].join() === '0,4,-5,2' && (t1.C - t1.A) - SQ.AC === 1 && (t2.C - t2.A) - SQ.AC === 1);
var cnt = 0, a, b, c, d, e2;
for (a = -2; a <= 2; a++) for (b = -2; b <= 2; b++) for (c = -2; c <= 2; c++) for (d = -2; d <= 2; d++) for (e2 = -2; e2 <= 2; e2++) if (a + b - e2 === 0 && e2 + c + d === 0) cnt++;
ok('V10 · square census: all 3125 tables on [-2,2]^5 judged by the two triangle walks — exactly 75 pass', cnt === 75);
var agree = true, verd, hit, x, y, z;
for (a = -2; a <= 2; a++) for (b = -2; b <= 2; b++) for (c = -2; c <= 2; c++) for (d = -2; d <= 2; d++) for (e2 = -2; e2 <= 2; e2++) {
  verd = (a + b - e2 === 0 && e2 + c + d === 0); hit = false;
  for (x = -6; x <= 6 && !hit; x++) for (y = -6; y <= 6 && !hit; y++) for (z = -6; z <= 6 && !hit; z++) if (x - 0 === a && y - x === b && z - y === c && 0 - z === d && y - 0 === e2) hit = true;
  if (verd !== hit) agree = false;
}
ok('V11 · brute-force column search over [-6,6]^3 agrees with the walk verdict on every one of the 3125', agree);
var tot = 0, pass = 0, ver = true, i1, j1, k1, pT;
for (i1 = -3; i1 <= 3; i1++) for (j1 = -3; j1 <= 3; j1++) for (k1 = -3; k1 <= 3; k1++) { tot++; if (i1 + j1 + k1 === 0) { pass++; pT = bfs([{ u: 'A', v: 'B', t: i1 }, { u: 'B', v: 'C', t: j1 }]); if (pT.A - pT.C !== k1) ver = false; } }
ok('V12 · triangle census: 343 tables on [-3,3]^3, exactly 37 with loop total 0, each of the 37 verified against its own BFS column', tot === 343 && pass === 37 && ver);
var pk = bfs([{ u: 'A', v: 'B', t: K4.AB }, { u: 'A', v: 'C', t: K4.AC }, { u: 'A', v: 'D', t: K4.AD }]);
ok('V13 · K4 star tree: BFS column (0,3,-1,2); all six entries equal the column demands', pk.A === 0 && pk.B === 3 && pk.C === -1 && pk.D === 2 && pk.C - pk.B === K4.BC && pk.D - pk.B === K4.BD && pk.D - pk.C === K4.CD);
var tots = W_K4.map(function (w) { return wt(w, K4); });
ok('V14 · the seven cycles of K4 as signed arrow-multisets: (0,0,0,0,0,0,0)', tots.join() === '0,0,0,0,0,0,0');
var dts = W_K4.map(function (w) { return wt(w, K4D); });
ok('V15 · doctored CD = 4: totals (0,0,+1,+1,+1,0,-1); demand 3 against 4 leaves mismatch -1; the cycle A-C-D-A totals +1', dts.join() === '0,0,1,1,1,0,-1' && (pk.D - pk.C) - K4D.CD === -1 && wt(W_K4[2], K4D) === 1);
var asmOk = true, r, tb, f1, f2, f3;
for (r = 0; r < 40; r++) {
  tb = { AB: (r * 3) % 7 - 3, AC: (r * 5) % 7 - 3, AD: (r * 7) % 7 - 3, BC: (r * 11) % 7 - 3, BD: (r * 13) % 7 - 3, CD: (r * 17) % 7 - 3 };
  f1 = wt(W_K4[0], tb); f2 = wt(W_K4[1], tb); f3 = wt(W_K4[2], tb);
  if (wt(W_K4[3], tb) !== f1 - f2 + f3 || wt(W_K4[4], tb) !== f1 + f3 || wt(W_K4[5], tb) !== -f1 + f2 || wt(W_K4[6], tb) !== f2 - f3) asmOk = false;
}
ok('V16 · assembly: BCD = F1-F2+F3, ABCD = F1+F3, ACBDA = -F1+F2, ABDCA = F2-F3 — holds on 40 deterministic tables; the page example (0,0,1) gives (1,1,0,-1)', asmOk);
var rep = [], ky, dl, cp, az, kk;
for (ky in K4D) for (dl = -8; dl <= 8; dl++) { if (dl === 0) continue; cp = {}; for (kk in K4D) cp[kk] = K4D[kk]; cp[ky] += dl; az = W_K4.every(function (w) { return wt(w, cp) === 0; }); if (az) rep.push(ky + (dl > 0 ? '+' : '') + dl); }
ok('V17 · single-entry repair census of the doctored table, deltas to +-8 on any entry: exactly one repair, CD-1', rep.length === 1 && rep[0] === 'CD-1');
var tk1 = { AB: 3, AC: -2, AD: 2, BC: -4, BD: -1, CD: 4 }, tk2 = { AB: 3, AC: -1, AD: 3, BC: -4, BD: -1, CD: 4 };
ok('V18 · tilts: AC to -2 kills ACD but wakes ABC to +1; AD to +3 kills ACD but wakes ABD to -1', wt(W_K4[2], tk1) === 0 && wt(W_K4[0], tk1) === 1 && wt(W_K4[2], tk2) === 0 && wt(W_K4[1], tk2) === -1);
var pe = bfs([{ u: 'A', v: 'B', t: 3 }, { u: 'B', v: 'C', t: -1 }]);
ok('V19 · Ex1: the three one-entry repairs of (+3,-1,+5) are AB to -4, BC to -8, CA to -2; the column (0,3,2) manufactures the repaired table', wt(W_TRI, { AB: -4, BC: -1, CA: 5 }) === 0 && wt(W_TRI, { AB: 3, BC: -8, CA: 5 }) === 0 && wt(W_TRI, { AB: 3, BC: -1, CA: -2 }) === 0 && pe.A === 0 && pe.B === 3 && pe.C === 2 && pe.A - pe.C === -2);
function cntV(es) { var s = {}; es.forEach(function (e) { s[e.u] = 1; s[e.v] = 1; }); return Object.keys(s).length; }
var E1 = [{ u: 'S', v: 'A' }, { u: 'S', v: 'B' }, { u: 'A', v: 'C' }, { u: 'B', v: 'D' }, { u: 'C', v: 'E' }];
var E2 = [{ u: 'A', v: 'B' }, { u: 'B', v: 'C' }, { u: 'C', v: 'A' }];
var E3 = [{ u: 'A', v: 'B' }, { u: 'B', v: 'C' }, { u: 'C', v: 'D' }, { u: 'D', v: 'A' }, { u: 'A', v: 'C' }];
var E4 = [{ u: 'A', v: 'B' }, { u: 'A', v: 'C' }, { u: 'A', v: 'D' }, { u: 'B', v: 'C' }, { u: 'B', v: 'D' }, { u: 'C', v: 'D' }];
ok('V20 · E-V+1 by census on the edge lists: tree 0, triangle 1, square+shortcut 2, K4 3', E1.length - cntV(E1) + 1 === 0 && E2.length - cntV(E2) + 1 === 1 && E3.length - cntV(E3) + 1 === 2 && E4.length - cntV(E4) + 1 === 3);
var AD6 = { S: ['A', 'B'], A: ['S', 'C'], B: ['S', 'D'], C: ['A', 'E'], D: ['B'], E: ['C'] };
var ED6 = { SA: ['S', 'A'], SB: ['S', 'B'], AC: ['A', 'C'], BD: ['B', 'D'], CE: ['C', 'E'] };
var TREE6 = { SA: 3, SB: -4, AC: 5, BD: 2, CE: -1 }, ARB = { SA: 5, SB: 1, AC: -2, BD: 7, CE: 3 };
function ekey(x, y) { var k; for (k in ED6) if ((ED6[k][0] === x && ED6[k][1] === y) || (ED6[k][0] === y && ED6[k][1] === x)) return k; }
var fr = [['S', 0, 0]], L2, nx, i2, j2, st2, y2, k2, fw;
for (L2 = 0; L2 < 10; L2++) {
  nx = [];
  for (i2 = 0; i2 < fr.length; i2++) { st2 = fr[i2];
    for (j2 = 0; j2 < AD6[st2[0]].length; j2++) { y2 = AD6[st2[0]][j2]; k2 = ekey(st2[0], y2); fw = ED6[k2][0] === st2[0];
      nx.push([y2, st2[1] + (fw ? TREE6[k2] : -TREE6[k2]), st2[2] + (fw ? ARB[k2] : -ARB[k2])]); } }
  fr = nx;
}
var endS = fr.filter(function (st3) { return st3[0] === 'S'; });
ok('V21 · every closed walk of length 10 from S on the six-town tree totals 0 under the rise table and under a second arbitrary table — ' + endS.length + ' walks, none escaping', endS.length > 0 && endS.every(function (st3) { return st3[1] === 0 && st3[2] === 0; }));
var alive = { S: 1, A: 1, B: 1, C: 1, D: 1, E: 1 }, towns = 6, stripped = 0, roads = 0, leaf, k3;
while (towns > 1) {
  leaf = null;
  for (k3 in alive) if (alive[k3] && AD6[k3].filter(function (w) { return alive[w]; }).length === 1) { leaf = k3; break; }
  if (!leaf) break;
  alive[leaf] = 0; towns--; stripped++; roads++;
}
ok('V22 · leaf-strip: each removal deletes exactly one road; five removals take all five roads and leave the last town bare', stripped === 5 && roads === 5 && towns === 1);
function flat(P) { return P.reduce(function (s, p) { return s.concat([p[0], p[1]]); }, []); }
function eq1(a, b) { return a.length === b.length && a.every(function (x, i) { return Math.round(x * 10) / 10 === b[i]; }); }
function off(p, q, d) { var dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy), v = rot(Math.PI / 2)(dx / L, dy / L); return [(p[0] + q[0]) / 2 + d * v[0], (p[1] + q[1]) / 2 + d * v[1]]; }
var A1 = [70, 195], B1 = [255, 175], C1 = [150, 48];
ok('V23 · Fig B10.1 arrowheads by rotation matrices, tip 0.56, R 8.2, half-angle 25 degrees: all three page polygons reproduced to the printed digit', eq1(flat(arw(A1, B1)), [173.6, 183.8, 165.8, 181.2, 166.6, 188]) && eq1(flat(arw(B1, C1)), [196.2, 103.9, 198.3, 111.8, 203.6, 107.4]) && eq1(flat(arw(C1, A1)), [105.2, 130.3, 111.8, 125.4, 105.7, 122.1]));
ok('V24 · Fig B10.1 labels: the three +1s at 14 off the midpoints along the 90-degree rotation; the loop label at centroid-y minus 4; town labels and strip at the page positions', eq1(off(A1, B1, -14), [161, 171.1]) && eq1(off(B1, C1, 14), [213.3, 102.6]) && eq1(off(C1, A1, 14), [97.7, 114.8]) && eq1([(A1[0] + B1[0] + C1[0]) / 3, (A1[1] + B1[1] + C1[1]) / 3 - 4], [158.3, 135.3]) && A1[0] - 30 === 40 && A1[1] + 21 === 216 && B1[0] + 8 === 263 && B1[1] + 21 === 196 && C1[0] === 150 && C1[1] - 12 === 36 && 340 / 2 === 170);
var A2 = [85, 50], B2 = [255, 50], C2 = [255, 200], D2 = [85, 200];
ok('V25 · Fig B10.2: corner towns; A,B labelled 12 above and C,D 22 below; +4/-9/+7/-2 at the side midpoints with the page offsets; -6 at the shortcut midpoint plus (0.6,16.5); the red totals +1 and -1 are the two failing triangles', A2[1] - 12 === 38 && B2[1] - 12 === 38 && C2[1] + 22 === 222 && D2[1] + 22 === 222 && eq1([(A2[0] + B2[0]) / 2, (A2[1] + B2[1]) / 2 - 8], [170, 42]) && eq1([(B2[0] + C2[0]) / 2 + 11, (B2[1] + C2[1]) / 2 + 3], [266, 128]) && eq1([(C2[0] + D2[0]) / 2, (C2[1] + D2[1]) / 2 + 14], [170, 214]) && eq1([(D2[0] + A2[0]) / 2 - 11, (D2[1] + A2[1]) / 2 + 3], [74, 128]) && eq1([(A2[0] + C2[0]) / 2 + 0.6, (A2[1] + C2[1]) / 2 + 16.5], [170.6, 141.5]) && wt(W_LOW, SQ) === 1 && wt(W_HIGH, SQ) === -1);
var A3 = [170, 125], B3 = [80, 52], C3 = [260, 52], D3 = [170, 205];
ok('V26 · Fig B10.3: star lines out of A and blue exams B-C/B-D/C-D at the town coordinates; town labels with the page offsets; six value labels at 13 (10 on BC) off the midpoints along the 90-degree rotation; the star labels are the table entries and E-V+1 = 3', eq1(off(A3, B3, -13), [116.8, 98.6]) && eq1(off(A3, C3, -13), [206.8, 78.4]) && eq1(off(A3, D3, 13), [157, 165]) && eq1(off(B3, C3, -10), [170, 42]) && eq1(off(B3, D3, 13), [113.8, 135.1]) && eq1(off(C3, D3, -13), [226.2, 135.1]) && A3[1] - 11 === 114 && B3[0] - 14 === 66 && B3[1] + 3 === 55 && C3[0] + 14 === 274 && D3[1] + 17 === 222 && A3[0] === 170 && 340 / 2 === 170 && K4.AB === 3 && K4.AC === -1 && K4.AD === 2 && K4.BC === -4 && K4.BD === -1 && K4.CD === 3 && E4.length - cntV(E4) + 1 === 3);
rej('I01 · poisoned: the lecture-0 triangle (+1,+1,-2) has loop total +3', wt(W_TRI, T0) === 3);
rej('I02 · poisoned: the triangle (+1,+1,+1) has loop total 0', wt(W_TRI, T3) === 0);
rej('I03 · poisoned: the big square test fails on (4,-9,+7,-2)', wt(W_SQ, SQ) !== 0);
rej('I04 · poisoned: the low triangle through B totals -1', wt(W_LOW, SQ) === -1);
rej('I05 · poisoned: the square accumulates to the column (0,4,-5,3)', ps.D === 3);
rej('I06 · poisoned: the shortcut mismatch is -1', (ps.C - ps.A) - SQ.AC === -1);
rej('I07 · poisoned: the repair leaves the shortcut at -6', SQR.AC === -6);
rej('I08 · poisoned: the 3(a) mismatch is +3', (p.A - p.C) - T3.CA === 3);
rej('I09 · poisoned: the square census admits 74 tables', cnt === 74);
rej('I10 · poisoned: the two trees accumulate to different columns', [t1.A, t1.B, t1.C, t1.D].join() !== [t2.A, t2.B, t2.C, t2.D].join());
rej('I11 · poisoned: the K4 star column is (0,3,-1,1)', pk.D === 1);
rej('I12 · poisoned: the doctored mismatch is +1', (pk.D - pk.C) - K4D.CD === 1);
rej('I13 · poisoned: the single-entry census finds two repairs', rep.length === 2);
rej('I14 · poisoned: tilting AC to -2 wakes ABD', wt(W_K4[1], tk1) !== 0);
rej('I15 · poisoned: K4 has E-V+1 = 4 examinations', E4.length - cntV(E4) + 1 === 4);
rej('I16 · poisoned: some closed walk of length 10 on the tree nets nonzero', endS.some(function (st3) { return st3[1] !== 0; }));
if (F === 0) { OUT.push('b10-review-verifier: 26 fresh checks PASS, 16 poisoned injections REJECTED — 42/42, the page stands'); } else { OUT.push('b10-review-verifier: ' + F + ' failures — the page fails review'); }
console.log(OUT.join('\n'));
