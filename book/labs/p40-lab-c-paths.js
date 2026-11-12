// p40-lab-c-paths.js — Lab C for P40 (Tropicalize)
// Min-plus shortest paths: tropical matrix product/closure vs classical Floyd-Warshall,
// associativity + distributivity, exact on a fixed 5-node graph. Deterministic, no eval.
// Results exposed via globalThis.P40C; receipt in p40-lab-c-paths.out.json.
var P40C = { label: 'P40 Lab C - min-plus shortest paths vs classical Floyd-Warshall', checks: [], poisons: [] };
function check(name, ok, detail) { P40C.checks.push({ name: name, ok: ok, detail: detail }); }
var INF = 1e15;
var W = [
  [0, 3, 8, INF, INF],
  [2, 0, INF, 5, INF],
  [INF, INF, 0, 2, 7],
  [INF, 4, INF, 0, 1],
  [INF, INF, INF, INF, 0]
];
function floyd(M) {
  var d = M.map(function(r){ return r.slice(); }), n = d.length, i, j, k;
  for (k = 0; k < n; k++) for (i = 0; i < n; i++) for (j = 0; j < n; j++)
    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
  return d;
}
function tropicalMatMul(A, B) {
  var n = A.length, C = [], i, j, k;
  for (i = 0; i < n; i++) { C.push([]);
    for (j = 0; j < n; j++) {
      var best = INF;
      for (k = 0; k < n; k++) { var v = A[i][k] + B[k][j]; if (v < best) best = v; }
      C[i].push(best);
    }
  }
  return C;
}
function tropicalClosure(M) {
  var n = M.length, D = M.map(function(r){ return r.slice(); });
  for (var s = 1; s < n; s++) D = tropicalMatMul(D, M);
  return { D: D, steps: n - 1 };
}
function tropicalMatAdd(A, B) {
  var n = A.length, C = [], i, j;
  for (i = 0; i < n; i++) { C.push([]); for (j = 0; j < n; j++) C[i].push(Math.min(A[i][j], B[i][j])); }
  return C;
}
var fw = floyd(W), cl = tropicalClosure(W), i, j;
var ok1 = true, bad1 = [];
for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) if (fw[i][j] !== cl.D[i][j]) { ok1 = false; bad1.push([i, j, fw[i][j], cl.D[i][j]]); }
check('tropical closure of the weight matrix equals Floyd-Warshall exactly on the 5-node graph (25 cells)', ok1, bad1.length === 0 ? 'all 25 cells equal' : JSON.stringify(bad1));
var assocL = tropicalMatMul(W, tropicalMatMul(W, W));
var assocR = tropicalMatMul(tropicalMatMul(W, W), W);
var ok2 = true;
for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) if (assocL[i][j] !== assocR[i][j]) ok2 = false;
check('tropical matrix multiplication is associative, exactly (W (W W) == (W W) W, 25 cells)', ok2, ok2 ? 'all 25 cells equal' : 'mismatch');
var ok3 = cl.D[0][4] === 9;
check('hand-traced cheapest path 0->4 is 0->1->3->4 with weight 9; closure entry [0][4] = 9', ok3, 'closure[0][4] = ' + cl.D[0][4]);
var M2 = [
  [0, INF, 1, INF, INF],
  [INF, 0, 4, INF, 6],
  [5, INF, 0, INF, 2],
  [INF, INF, 3, 0, INF],
  [1, 2, INF, INF, 0]
];
var lhs = tropicalMatMul(tropicalMatAdd(W, M2), M2);
var rhs = tropicalMatAdd(tropicalMatMul(W, M2), tropicalMatMul(M2, M2));
var ok4 = true, bad4 = [];
for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) if (lhs[i][j] !== rhs[i][j]) { ok4 = false; bad4.push([i, j, lhs[i][j], rhs[i][j]]); }
check('distributivity (A + B) C == (A C) + (B C) in the tropical arithmetic, exact on 25 cells with C = M2', ok4, bad4.length === 0 ? 'all 25 cells equal' : JSON.stringify(bad4));
function tropicalMatMulMax(A, B) {
  var n = A.length, C = [], i, j, k;
  for (i = 0; i < n; i++) { C.push([]);
    for (j = 0; j < n; j++) { var best = -INF;
      for (k = 0; k < n; k++) { var v = A[i][k] + B[k][j]; if (v > best) best = v; }
      C[i].push(best);
    }
  }
  return C;
}
var Dm = W.map(function(r){ return r.slice(); });
for (var s2 = 1; s2 < 5; s2++) Dm = tropicalMatMulMax(Dm, W);
var p1diff = false;
for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) if (Dm[i][j] !== fw[i][j]) p1diff = true;
P40C.poisons.push({ name: 'max-plus closure differs from Floyd-Warshall (wrong arithmetic, wrong answer)', ok: p1diff });
var W2 = W.map(function(r){ return r.slice(); }); W2[0][1] = 30;
var cl2 = tropicalClosure(W2);
P40C.poisons.push({ name: 'corrupting edge 0->1 (3 -> 30) changes closure[0][4] (9 -> 11 via 0->2->3->4)', ok: cl2.D[0][4] === 11, detail: 'closure2[0][4] = ' + cl2.D[0][4] });
function brokenMatMul(A, B) {
  var n = A.length, C = [], i, j;
  for (i = 0; i < n; i++) { C.push([]); for (j = 0; j < n; j++) C[i].push(A[i][0] + B[0][j]); }
  return C;
}
var Db = W.map(function(r){ return r.slice(); });
for (var s3 = 1; s3 < 5; s3++) Db = brokenMatMul(Db, W);
var p3diff = false;
for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) if (Db[i][j] !== fw[i][j]) p3diff = true;
P40C.poisons.push({ name: 'broken matmul (k-loop dropped) fails the Floyd comparison', ok: p3diff });
P40C.summary = { checksTotal: P40C.checks.length, checksPassed: P40C.checks.filter(function(c){return c.ok;}).length, poisonsTotal: P40C.poisons.length, poisonsPassed: P40C.poisons.filter(function(p){return p.ok;}).length, floydMatrix: fw, closureMatrix: cl.D };
globalThis.P40C = P40C;
