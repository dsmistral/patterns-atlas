// b08-lab.js — the B08 battery: structural hygiene, needle presence, numeric
// recompute of every claim (powers, orbits, Fibonacci, census, tilt, growth
// detector), SVG pixel-mapping for all three figures.
// Piece-file built: lab-head + lab-p0..p5 + lab-tail, cat-assembled.
// Contract: runBattery(PAGE) returns the verdict; printVerdict(v) prints it.
'use strict';
var counts = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
var failCounts = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
var failures = [];
function check(piece, name, cond) {
  counts[piece] = (counts[piece] || 0) + 1;
  if (cond) return;
  failCounts[piece] = (failCounts[piece] || 0) + 1;
  failures.push(piece + ' :: ' + name);
}
function feq(x, y, tol) { return Math.abs(x - y) <= (tol === undefined ? 1e-9 : tol); }
function matMul(A, B) {
  return A.map(function (r) { return B[0].map(function (_, j) { return r.reduce(function (s, v, k) { return s + v * B[k][j]; }, 0); }); });
}
function matApply(A, v) { return [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]]; }
function matPow(M, n) {
  // iterative repeated squaring — no recursion, doubles only
  var R = [[1, 0], [0, 1]], B = [M[0].slice(), M[1].slice()], e = n;
  while (e > 0) {
    if (e & 1) R = matMul(R, B);
    e = e >> 1;
    if (e > 0) B = matMul(B, B);
  }
  return R;
}
function det2(A) { return A[0][0] * A[1][1] - A[0][1] * A[1][0]; }
function tr2(A) { return A[0][0] + A[1][1]; }
function cross(u, v) { return u[0] * v[1] - u[1] * v[0]; }
function parallel(u, v) { return cross(u, v) === 0; }
function charRoots(M) {
  var t = tr2(M), d = det2(M), disc = t * t - 4 * d;
  if (disc < 0) return { real: false, disc: disc };
  var r = Math.sqrt(disc);
  return { real: true, disc: disc, roots: [(t - r) / 2, (t + r) / 2] };
}
function crushDir(T) {
  if (T[1][1] !== 0 || T[1][0] !== 0) return [T[1][1], -T[1][0]];
  return [T[0][1], -T[0][0]];
}
function eigenDirs(M) {
  // exact eigen-pairs for integer machines with square discriminant
  var t = tr2(M), d = det2(M), disc = t * t - 4 * d, out = [], r, lam, T, dir;
  if (disc < 0) return out;
  if (disc === 0) {
    lam = t / 2;
    T = [[M[0][0] - lam, M[0][1]], [M[1][0], M[1][1] - lam]];
    dir = (T[0][0] === 0 && T[0][1] === 0 && T[1][0] === 0 && T[1][1] === 0) ? [1, 0] : crushDir(T);
    out.push({ lam: lam, dir: dir, everyDir: (T[0][0] === 0 && T[0][1] === 0 && T[1][0] === 0 && T[1][1] === 0) });
    return out;
  }
  r = Math.sqrt(disc);
  if (!feq(r, Math.round(r), 1e-9)) return out;
  out.push({ lam: (t - r) / 2, dir: crushDir([[M[0][0] - (t - r) / 2, M[0][1]], [M[1][0], M[1][1] - (t - r) / 2]]), everyDir: false });
  out.push({ lam: (t + r) / 2, dir: crushDir([[M[0][0] - (t + r) / 2, M[0][1]], [M[1][0], M[1][1] - (t + r) / 2]]), everyDir: false });
  return out;
}
var GRID48 = (function () { var g = [], a, b; for (a = -3; a <= 3; a++) for (b = -3; b <= 3; b++) if (a !== 0 || b !== 0) g.push([a, b]); return g; })();
var GRID625 = (function () { var g = [], v = [-2, -1, 0, 1, 2], a, b, c, d; for (a of v) for (b of v) for (c of v) for (d of v) g.push([[a, b], [c, d]]); return g; })();
function inWindow(v) { return Math.abs(v[0]) <= 3 && Math.abs(v[1]) <= 3; }
