// b07-review-verifier.js — adversarial verifier, zero code shared with the battery.
// Fresh engine: eigen hunt by feeding (no characteristic polynomial), brute census,
// numeric round-trip at fresh points (read -> stretch by D -> home). Panels:
// 34 needles (each its own check), 8 poisons (must be absent), 8 doctored clones
// (mutations INSIDE needle spans, per the S46 lesson — global split/join, so each
// clone must newly miss a needle).
'use strict';
var V = { pass: 0, fail: 0, notes: [] };
function ok(name, cond) { if (cond) { V.pass++; } else { V.fail++; V.notes.push('FAIL ' + name); } }
function feed(T, a, b) { return [T[0][0] * a + T[0][1] * b, T[1][0] * a + T[1][1] * b]; }
function detX(T) { return T[0][0] * T[1][1] - T[0][1] * T[1][0]; }
function onLine(p, q) { return p[0] * q[1] === p[1] * q[0]; }

var NEEDLES = [
  'A matrix is a machine that eats points and returns points',
  'the machine\'s <em>favourites</em>',
  '\\[M\\vec v \\;=\\; \\lambda\\,\\vec v,\\]',
  'a direction the machine cannot knock off its line',
  'B06\'s Claim 3, one letter renamed',
  'the hunt is two steps, always the same two',
  'two distinct factors, one doubled factor, or none',
  '<em>New word: eigenvector.</em>',
  '<em>New word: eigenvalue.</em>',
  '<em>New word: characteristic polynomial.</em>',
  '<em>New word: trace.</em>',
  'Lecture 0\'s luck, now found by law',
  'the doubled factor owns exactly one direction',
  'no eigen-direction at all',
  '(3-\\lambda)(2-\\lambda) - 2 \\;=\\; \\lambda^2 - 5\\lambda + 4 \\;=\\; (\\lambda - 1)(\\lambda - 4)',
  'both rows say the same equation',
  'exactly 8 sit on a rail: six on the red',
  'exactly 6 stay on their line',
  '0 of the 48',
  'a pure stretch owns every direction there is',
  'the witness arrow \\((s, -q)\\) exhibits it',
  'leaned on and cited, not repeated',
  '\\[\\lambda_1 + \\lambda_2 \\;=\\; \\operatorname{tr} M, \\qquad \\lambda_1 \\lambda_2 \\;=\\; \\det M,\\]',
  'Proof, two lines, by contradiction',
  'This is the door to B08',
  'M = \\lambda P P^{-1} = \\lambda I',
  'nothing in between',
  'Nearly one machine in four owns nothing it leaves alone',
  'two-by-two with real entries',
  'stretch factors without real arrows to ride',
  'What the page closes, it closes completely; what it defers, it names.',
  'that warranty exercised, not luck',
  '\\det P \\;=\\; 1 \\cdot 1 - 1 \\cdot (-2) \\;=\\; 3',
  '\\left(\\tfrac{105}{5}, \\tfrac{60}{5}\\right) = (21, 12)'
];

var POISONS = [
  'wait, that',
  'racine caracteristique',
  '\\frac{1}{5}\\begin{bmatrix} 1 & -1 \\\\ 2 & 1 \\end{bmatrix}',
  '\\det P \\;=\\; 1 \\cdot 1 - 1 \\cdot (-2) \\;=\\; 5',
  'every machine has two eigen-directions',
  'the quarter-turn has eigenvalue 1',
  '\\tfrac{48}{5}',
  'eigenvalue of the shear is 2'
];

var CLONES = [
  ['C1 wrong char-poly root sign', '(\\lambda - 1)(\\lambda - 4)', '(\\lambda - 1)(\\lambda + 4)'],
  ['C2 wrong witness direction', 'the witness arrow \\((s, -q)\\) exhibits it', 'the witness arrow \\((s, q)\\) exhibits it'],
  ['C3 wrong eigen-scheme determinant', '\\det P \\;=\\; 1 \\cdot 1 - 1 \\cdot (-2) \\;=\\; 3', '\\det P \\;=\\; 1 \\cdot 1 - 1 \\cdot (-2) \\;=\\; 5'],
  ['C4 census inflation', 'exactly 8 sit on a rail: six on the red', 'exactly 9 sit on a rail: six on the red'],
  ['C5 shear census inflation', 'exactly 6 stay on their line', 'exactly 7 stay on their line'],
  ['C6 hunt broken', 'the hunt is two steps, always the same two', 'the hunt is three steps, always the same two'],
  ['C7 Vieta reading swap', '\\lambda_1 + \\lambda_2 \\;=\\; \\operatorname{tr} M', '\\lambda_1 + \\lambda_2 \\;=\\; \\det M'],
  ['C8 Ex3 arithmetic slip', '\\left(\\tfrac{105}{5}, \\tfrac{60}{5}\\right) = (21, 12)', '\\left(\\tfrac{105}{5}, \\tfrac{48}{5}\\right) = (21, 12)']
];

function runAll(P) {
  // --- substantive: independent eigen hunt by feeding, no characteristic polynomial ---
  var M = [[3,1],[2,2]];
  var found = [];
  for (var a = -6; a <= 6; a++) for (var b = -6; b <= 6; b++) {
    if (a === 0 && b === 0) continue;
    var w = feed(M, a, b);
    if (onLine(w, [a, b])) {
      var lam = (a !== 0) ? w[0] / a : w[1] / b;
      if (!found.some(function (f) { return onLine(f.d, [a, b]); })) found.push({ d: [a, b], lam: lam });
    }
  }
  ok('substantive: M has exactly 2 eigen-directions on the 13x13 grid', found.length === 2);
  ok('substantive: stretch factors 1 and 4', (found[0].lam === 1 && found[1].lam === 4) || (found[0].lam === 4 && found[1].lam === 1));
  // --- substantive: census by brute feed ---
  var census = 0;
  for (var x = -3; x <= 3; x++) for (var y = -3; y <= 3; y++) {
    if (x === 0 && y === 0) continue;
    var w2 = feed(M, x, y);
    if (onLine(w2, [x, y])) census++;
  }
  ok('substantive: M census 8 of 48', census === 8);
  // --- substantive: scheme round trip at 4 fresh points (read, stretch by D, home) ---
  var Pm = [[1,1],[-2,1]], Pinv = [[1/3,-1/3],[2/3,1/3]];
  [[2,-1],[5,3],[-4,2],[1,6]].forEach(function (pt, i) {
    var direct = feed(M, pt[0], pt[1]);
    var read = feed(Pinv, pt[0], pt[1]);
    var stretched = [read[0] * 1, read[1] * 4]; // stretch by D = diag(1,4): the scheme's middle move
    var back = feed(Pm, stretched[0], stretched[1]);
    ok('substantive: reading round-trips point ' + i, Math.abs(back[0] - direct[0]) < 1e-9 && Math.abs(back[1] - direct[1]) < 1e-9);
  });
  ok('substantive: det P = 3', detX(Pm) === 3);
  ok('substantive: det M = 4', detX(M) === 4);
  // --- needle panel: each needle its own check ---
  NEEDLES.forEach(function (n, i) {
    var present = P.indexOf(n) >= 0;
    ok('needle ' + (i + 1) + '/' + NEEDLES.length + ' present', present);
    if (!present) V.notes.push('MISSING NEEDLE: ' + n);
  });
  // --- poison panel: each poison its own check ---
  POISONS.forEach(function (x, i) {
    var absent = P.indexOf(x) < 0;
    ok('poison ' + (i + 1) + '/' + POISONS.length + ' absent', absent);
    if (!absent) V.notes.push('POISON PRESENT: ' + x);
  });
  // --- clone panel: doctored pages must be rejected by the needle panel ---
  CLONES.forEach(function (c) {
    var doctored = P.split(c[1]).join(c[2]);
    var mutated = doctored !== P;
    var newlyMissing = NEEDLES.filter(function (n) { return P.indexOf(n) >= 0 && doctored.indexOf(n) < 0; }).length;
    ok('clone rejected: ' + c[0], mutated && newlyMissing > 0);
    if (!mutated) V.notes.push('CLONE NOT APPLIED: ' + c[0]);
    else if (newlyMissing === 0) V.notes.push('CLONE ESCAPED: ' + c[0]);
  });
  return { pass: V.pass, fail: V.fail, notes: V.notes, cloneCount: CLONES.length, needleCount: NEEDLES.length, poisonCount: POISONS.length };
}
function verdictLines(r) {
  var lines = [];
  lines.push('B07 REVIEW VERIFIER — ' + r.pass + '/' + (r.pass + r.fail) + ' checks, ' + r.fail + ' FAIL');
  lines.push('  needles: ' + r.needleCount + '  poisons: ' + r.poisonCount + '  doctored clones: ' + r.cloneCount);
  r.notes.forEach(function (n) { lines.push('  ' + n); });
  return lines.join('\n') + '\n';
}
