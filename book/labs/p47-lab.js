// p47 lab — the diagram chase battery. Fresh engine; every receipt of the page re-verified.
// Groups: A the instance · B the census + wide tower · C Short Five · D broken exhibits + exercise receipts · E page needles · F figure checks.
var OUTL = [];
function OUT(s) { OUTL.push(s); }
var LC = { pass: 0, fail: 0 };
function ack(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); LC[ok ? 'pass' : 'fail']++; }

// ---- fresh F2 linear algebra (span-enumeration style; no rref, no recursion) ----
function allV(n) { var o = [], i, j, m = Math.pow(2, n); for (i = 0; i < m; i++) { var v = []; for (j = 0; j < n; j++) v.push((i >> j) & 1); o.push(v); } return o; }
function addV(a, b) { var o = [], i; for (i = 0; i < a.length; i++) o.push(a[i] ^ b[i]); return o; }
function eqV(a, b) { if (a.length !== b.length) return false; var i; for (i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
function zV(n) { var v = [], i; for (i = 0; i < n; i++) v.push(0); return v; }
function apply(M, v) { var o = [], i, j, s; for (i = 0; i < M.length; i++) { s = 0; for (j = 0; j < v.length; j++) s += M[i][j] * v[j]; o.push(s % 2); } return o; }
function matMul(M, W) { var o = [], i, j, k, s, r; for (i = 0; i < M.length; i++) { r = []; for (j = 0; j < W[0].length; j++) { s = 0; for (k = 0; k < M[i].length; k++) s += M[i][k] * W[k][j]; r.push(s % 2); } o.push(r); } return o; }
function matEq(M, W) { if (M.length !== W.length) return false; var i, j; for (i = 0; i < M.length; i++) { if (M[i].length !== W[i].length) return false; for (j = 0; j < M[i].length; j++) if (M[i][j] !== W[i][j]) return false; } return true; }
function spanElems(basis) { var n = basis.length ? basis[0].length : 0, out = [zV(n)], i, k, cur; for (i = 0; i < basis.length; i++) { cur = out.slice(); for (k = 0; k < cur.length; k++) out.push(addV(cur[k], basis[i])); } return out; }
function inSpan(basis, v) { if (!basis.length) { var i0; for (i0 = 0; i0 < v.length; i0++) if (v[i0]) return false; return true; } var e = spanElems(basis), i; for (i = 0; i < e.length; i++) if (eqV(e[i], v)) return true; return false; }
function indepB(vs) { var b = [], i; for (i = 0; i < vs.length; i++) if (!inSpan(b, vs[i])) b.push(vs[i]); return b; }
function colsOf(M) { var c = [], j, i; for (j = 0; j < M[0].length; j++) { var col = []; for (i = 0; i < M.length; i++) col.push(M[i][j]); c.push(col); } return c; }
function imB(M) { return indepB(colsOf(M)); }
function nullB(M, ncol) { var vs = allV(ncol), k = [], i; for (i = 0; i < vs.length; i++) if (eqV(apply(M, vs[i]), zV(M.length))) if (!inSpan(k, vs[i])) k.push(vs[i]); return k; }
function pre(M, y, ncol) { var xs = allV(ncol), o = [], i; for (i = 0; i < xs.length; i++) if (eqV(apply(M, xs[i]), y)) o.push(xs[i]); return o; }
function spanEq(b1, b2) { var i; for (i = 0; i < b1.length; i++) if (!inSpan(b2, b1[i])) return false; for (i = 0; i < b2.length; i++) if (!inSpan(b1, b2[i])) return false; return true; }
function kerElems(H, n) { var vs = allV(n), o = [], i; for (i = 0; i < vs.length; i++) if (eqV(apply(H, vs[i]), zV(H.length))) o.push(vs[i]); return o; }

// ---- the standard 1,2,1 ledgers over F2 ----
// top: A=<a> -i-> B=<b1,b2> -p-> C=<c>->0, i(a)=b1, p(b1)=0, p(b2)=c; bottom mirrored on <a'>,<u,v>,<w>
var I = [[1], [0]], P = [[0, 1]], IP = [[1], [0]], PP = [[0, 1]];
var F0 = [[0]], FID = [[1]], H0 = [[0]], HID = [[1]];
var GINST = [[0, 1], [0, 0]]; // g(b1)=0, g(b2)=u
function sqL(G, F) { return matEq(matMul(G, I), matMul(IP, F)); }
function sqR(G, H) { return matEq(matMul(PP, G), matMul(H, P)); }
// generic snake: ker h (dim dC) -> lifts via Pm: B(dB)->C -> audits Gm: B->B' -> pull back via IPm: A'(dA2)->B'
function snakeRun(F, H, Gm, Pm, IPm, dB, dC, dA2) {
  var r = { ok: true, nz: false, minL: 99, maxL: 0, stall: false, perC: [] };
  var cs = kerElems(H, dC), i, li;
  for (i = 0; i < cs.length; i++) {
    var c = cs[i], ls = pre(Pm, c, dB), ys = [], li2, gx, yy;
    if (ls.length < r.minL) r.minL = ls.length;
    if (ls.length > r.maxL) r.maxL = ls.length;
    if (!ls.length) { r.ok = false; r.stall = true; continue; }
    for (li2 = 0; li2 < ls.length; li2++) {
      gx = apply(Gm, ls[li2]);
      yy = pre(IPm, gx, dA2);
      if (yy.length !== 1) { r.ok = false; r.stall = true; continue; }
      ys.push(yy[0]);
    }
    if (ys.length !== ls.length) continue;
    var j, imF = imB(F);
    for (j = 1; j < ys.length; j++) if (!inSpan(imF, addV(ys[0], ys[j]))) r.ok = false;
    var nz = !inSpan(imF, ys[0]);
    if (nz) r.nz = true;
    r.perC.push({ c: c, lifts: ls.length, y: ys[0], nz: nz ? 1 : 0 });
  }
  return r;
}

// ==== GROUP A: the instance (f=0, h=0, g: b1->0, b2->u) ===
OUT('=== GROUP A: the instance ===');
var rA = snakeRun(F0, H0, GINST, P, IP, 2, 1, 1);
ack('A1 top row exact (im i = ker p, both <b1>)', spanEq(imB(I), nullB(P, 2)) && imB(I).length === 1);
ack('A2 bottom row exact (im i-prime = ker p-prime)', spanEq(imB(IP), nullB(PP, 2)) && imB(IP).length === 1);
ack('A3 both squares commute', sqL(GINST, F0) && sqR(GINST, H0));
ack('A4 ker h = {0, c} (two elements)', kerElems(H0, 1).length === 2);
ack('A5 coker f = two cosets (im f = 0)', imB(F0).length === 0);
ack('A6 delta(0) = [0]', (function () { var s = snakeRun(F0, H0, GINST, P, IP, 2, 1, 1); var pc = null, i; for (i = 0; i < s.perC.length; i++) if (s.perC[i].c[0] === 0) pc = s.perC[i]; return pc && pc.nz === 0; })());
var liftsC = pre(P, [1], 2);
ack('A7 c has exactly 2 lifts (E-station, two witnesses)', liftsC.length === 2, 'lifts=' + JSON.stringify(liftsC));
ack('A8 both lifts audit to u', eqV(apply(GINST, liftsC[0]), [1, 0]) && eqV(apply(GINST, liftsC[1]), [1, 0]));
ack('A9 pull-back unique (U-station): pre(i-prime, u) = {a-prime}', pre(IP, [1, 0], 1).length === 1 && eqV(pre(IP, [1, 0], 1)[0], [1]));
ack('A10 delta(c) = [a-prime] nonzero', rA.nz === true && rA.perC[1].y[0] === 1);
ack('A11 well-defined (both routes same class)', rA.ok === true);
ack('A12 delta linear (zero on 0, nonzero on c)', (function () { var s = snakeRun(F0, H0, GINST, P, IP, 2, 1, 1), pc0 = null, pc1 = null, i; for (i = 0; i < s.perC.length; i++) { if (s.perC[i].c[0] === 0) pc0 = s.perC[i]; if (s.perC[i].c[0] === 1) pc1 = s.perC[i]; } return pc0.nz === 0 && pc1.nz === 1; })());
ack('A13 ker f = <a> (dim 1)', nullB(F0, 1).length === 1);
ack('A14 ker g = <b1> (dim 1)', nullB(GINST, 2).length === 1 && eqV(nullB(GINST, 2)[0], [1, 0]));
ack('A15 coker g: im g = <u>, cosets {[00],[10]} and {[01],[11]}', imB(GINST).length === 1 && eqV(imB(GINST)[0], [1, 0]));
ack('A16 coker h: two cosets {[0]},{[1]}', imB(H0).length === 0);
ack('A17 snake dims 1,1,1,1,1,1', nullB(F0, 1).length === 1 && nullB(GINST, 2).length === 1 && kerElems(H0, 1).length === 2 && (1 - imB(F0).length) === 1 && (2 - imB(GINST).length) === 1 && (1 - imB(H0).length) === 1);
ack('A18 induced ker f->ker g: a |-> b1 (in ker g)', eqV(apply(I, [1]), [1, 0]) && eqV(apply(GINST, apply(I, [1])), [0, 0]));
ack('A19 induced ker g->ker h: b1 |-> 0', eqV(apply(P, [1, 0]), [0]));
ack('A20 induced coker f->coker g: [a-prime] |-> [u] = [0] (zero map)', inSpan(imB(GINST), apply(IP, [1])));
ack('A21 induced coker g->coker h: [v] |-> [w] nonzero', !inSpan(imB(H0), apply(PP, [0, 1])) && eqV(apply(PP, [0, 1]), [1]));
ack('A22 exact at ker g (image-equals-kernel both <b1>)', spanEq([apply(I, [1])], nullB(P, 2)));
ack('A23 exact at ker h (im = 0 = ker delta: delta injective)', (function () { var s = snakeRun(F0, H0, GINST, P, IP, 2, 1, 1), pc0 = null, i; for (i = 0; i < s.perC.length; i++) if (s.perC[i].c[0] === 0) pc0 = s.perC[i]; return pc0 !== null && pc0.nz === 0; })() && eqV(apply(P, [1, 0]), [0]));
ack('A24 exact at coker f (im delta = all = ker zero map: delta surjective)', rA.nz === true);
ack('A25 exact at coker g (im = {[0]} = ker p-prime-induced)', (function () { var reps = [[0, 0], [0, 1]], i, kern = []; for (i = 0; i < reps.length; i++) if (inSpan(imB(H0), apply(PP, reps[i]))) kern.push(reps[i]); return kern.length === 1 && inSpan(imB(GINST), kern[0]); })());
ack('A26 delta is an isomorphism (injective + surjective)', rA.nz === true && (function () { var s = snakeRun(F0, H0, GINST, P, IP, 2, 1, 1), pc0 = null, i; for (i = 0; i < s.perC.length; i++) if (s.perC[i].c[0] === 0) pc0 = s.perC[i]; return pc0.nz === 0; })());
ack('A27 E/U ledger: lift station E (2 witnesses), pull-back station U (unique)', liftsC.length === 2 && pre(IP, [1, 0], 1).length === 1);
ack('A28 p onto (E functional), i-prime injective (U functional)', pre(P, [1], 2).length > 0 && pre(IP, [1, 0], 1).length === 1);

// ==== GROUP B: the census of 64 configurations + the wide tower ===
OUT('=== GROUP B: the census ===');
var census = { total: 0, left: 0, right: 0, both: 0, leftOnly: 0, rightOnly: 0, neither: 0, wellDef: 0, dNonzero: 0, records: [], pinL: true, pinR: true };
var gs16 = [], a4, b4, c4, d4;
for (a4 = 0; a4 < 2; a4++) for (b4 = 0; b4 < 2; b4++) for (c4 = 0; c4 < 2; c4++) for (d4 = 0; d4 < 2; d4++) gs16.push([[a4, b4], [c4, d4]]);
var fs2 = [F0, FID], hs2 = [H0, HID], fi, hi, gi;
for (fi = 0; fi < 2; fi++) for (hi = 0; hi < 2; hi++) for (gi = 0; gi < 16; gi++) {
  census.total++;
  var Fc = fs2[fi], Hc = hs2[hi], Gc = gs16[gi];
  var L = sqL(Gc, Fc), R = sqR(Gc, Hc);
  if (L) census.left++;
  if (R) census.right++;
  if (L && !R) census.leftOnly++;
  if (R && !L) census.rightOnly++;
  if (L && R) census.both++;
  if (!L && !R) census.neither++;
  // matrix-entry pinning: left <=> alpha=f, beta=0; right <=> beta=0, delta=h
  if (L !== (Gc[0][0] === fi && Gc[1][0] === 0)) census.pinL = false;
  if (R !== (Gc[1][0] === 0 && Gc[1][1] === hi)) census.pinR = false;
  if (L && R) {
    var sr = snakeRun(Fc, Hc, Gc, P, IP, 2, 1, 1);
    if (sr.ok && !sr.stall) census.wellDef++;
    if (sr.ok && !sr.stall && sr.nz) { census.dNonzero++; census.records.push('f=' + fi + ' h=' + hi + ' G=' + JSON.stringify(Gc)); }
  }
}
ack('B1 census total 64', census.total === 64, 'total=' + census.total);
ack('B2 left square commutes in 16', census.left === 16, 'left=' + census.left);
ack('B3 right square commutes in 16', census.right === 16, 'right=' + census.right);
ack('B4 both squares in 8', census.both === 8, 'both=' + census.both);
ack('B5 left-only 8, right-only 8', census.leftOnly === 8 && census.rightOnly === 8, 'L-only=' + census.leftOnly + ' R-only=' + census.rightOnly);
ack('B6 neither 40', census.neither === 40, 'neither=' + census.neither);
ack('B7 all 8 both-commuting give delta well-defined', census.wellDef === 8, 'wellDef=' + census.wellDef);
ack('B8 exactly 1 of the 8 has delta nonzero', census.dNonzero === 1, 'dNonzero=' + census.dNonzero + ' ' + census.records.join(' | '));
ack('B9 the one nonzero is the page instance (f=0 h=0 G=[[0,1],[0,0]])', census.records.length === 1 && census.records[0] === 'f=0 h=0 G=' + JSON.stringify([[0, 1], [0, 0]]));
ack('B10 matrix-entry pinning: left <=> (alpha=f, beta=0)', census.pinL === true);
ack('B11 matrix-entry pinning: right <=> (beta=0, delta=h)', census.pinR === true);
ack('B12 independence would predict 4, actual is 8 (16*16/64=4)', census.both === 8 && (census.left * census.right) / census.total === 4);
// the wide tower: dims 2,4,2, f=0, h=0
var IW = [[1, 0], [0, 1], [0, 0], [0, 0]], PW = [[0, 0, 1, 0], [0, 0, 0, 1]];
var IPW = [[1, 0], [0, 1], [0, 0], [0, 0]], PPW = [[0, 0, 1, 0], [0, 0, 0, 1]];
var FW = [[0, 0], [0, 0]], HW = [[0, 0], [0, 0]];
var wt = { commute: 0, wellDef: 0, dNonzero: 0, dZero: 0, zeroG: null, lifts4: true, maxL: 0 };
var g3, g4b;
for (g3 = 0; g3 < 4; g3++) for (g4b = 0; g4b < 4; g4b++) {
  var G4 = [[0, 0, g3 & 1, g4b & 1], [0, 0, (g3 >> 1) & 1, (g4b >> 1) & 1], [0, 0, 0, 0], [0, 0, 0, 0]];
  var Lw = matEq(matMul(G4, IW), matMul(IPW, FW)), Rw = matEq(matMul(PPW, G4), matMul(HW, PW));
  if (Lw && Rw) {
    wt.commute++;
    var srw = snakeRun(FW, HW, G4, PW, IPW, 4, 2, 2);
    if (srw.minL !== 4 || srw.maxL !== 4) wt.lifts4 = false;
    if (srw.ok && !srw.stall) {
      wt.wellDef++;
      if (srw.nz) wt.dNonzero++; else { wt.dZero++; wt.zeroG = JSON.stringify(G4); }
    }
  }
}
ack('B13 wide tower exact (im iW = ker pW, dims 2,4,2)', spanEq(imB(IW), nullB(PW, 4)) && imB(IW).length === 2);
ack('B14 wide tower: 16 commuting maps', wt.commute === 16, 'commute=' + wt.commute);
ack('B15 every anomaly has exactly 4 lifts', wt.lifts4 === true);
ack('B16 all 16 well-defined', wt.wellDef === 16, 'wellDef=' + wt.wellDef);
ack('B17 delta nonzero on 15 of 16', wt.dNonzero === 15, 'dNonzero=' + wt.dNonzero);
ack('B18 delta vanishes only for g=0', wt.dZero === 1 && wt.zeroG === JSON.stringify([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]));

// ==== GROUP C: the Short Five (f=id, h=id) ===
OUT('=== GROUP C: the Short Five ===');
var sf = { total: 0, commute: 0, iso: 0, records: [] };
for (gi = 0; gi < 16; gi++) {
  sf.total++;
  var Gs = gs16[gi];
  if (sqL(Gs, FID) && sqR(Gs, HID)) {
    sf.commute++;
    if (imB(Gs).length === 2) { sf.iso++; sf.records.push(JSON.stringify(Gs)); }
  }
}
ack('C1 Short Five census: 16 possible g', sf.total === 16);
ack('C2 exactly 2 commute with both squares', sf.commute === 2, 'commute=' + sf.commute);
ack('C3 both commuting g are isomorphisms', sf.iso === 2, 'iso=' + sf.iso);
ack('C4 the two: [[1,0],[0,1]] and [[1,1],[0,1]]', sf.records.length === 2 && ((sf.records[0] === JSON.stringify([[1, 0], [0, 1]]) && sf.records[1] === JSON.stringify([[1, 1], [0, 1]])) || (sf.records[1] === JSON.stringify([[1, 0], [0, 1]]) && sf.records[0] === JSON.stringify([[1, 1], [0, 1]]))));
ack('C5 with f=h=id: ker f = 0 and coker f = 0 (zero rooms)', nullB(FID, 1).length === 0 && imB(FID).length === 1);

// ==== GROUP D: the broken exhibits + exercise receipts ===
OUT('=== GROUP D: the broken exhibits ===');
// Exhibit A mode 1: g(b1)=0, g(b2)=v  — left square commutes, right broken
var GA1 = [[0, 0], [0, 1]];
ack('D1 A1: left square commutes, right broken', sqL(GA1, F0) === true && sqR(GA1, H0) === false);
ack('D2 A1: the audit of a lift lands outside ker p-prime (p-prime(v)=w nonzero)', !eqV(apply(PP, apply(GA1, [0, 1])), [0]));
ack('D3 A1: both lifts stall — no y with i-prime(y) = v', pre(IP, apply(GA1, [0, 1]), 1).length === 0 && pre(IP, apply(GA1, [1, 1]), 1).length === 0);
var srA1 = snakeRun(F0, H0, GA1, P, IP, 2, 1, 1);
ack('D4 A1: snake run reports stall, not well-defined', srA1.stall === true && srA1.ok === false);
// Exhibit A mode 2: g(b1)=u, g(b2)=0 — right square commutes, left broken
var GA2 = [[1, 0], [0, 0]];
ack('D5 A2: right square commutes, left broken', sqR(GA2, H0) === true && sqL(GA2, F0) === false);
ack('D6 A2: i-prime still injective in this exhibit', pre(IP, [1, 0], 1).length === 1);
var lA = apply(GA2, [0, 1]), lB = apply(GA2, [1, 1]);
var yA = pre(IP, lA, 1), yB = pre(IP, lB, 1);
ack('D7 A2: route via b2 audits to 0, pulls back to y=0, class [0]', eqV(lA, [0, 0]) && yA.length === 1 && eqV(yA[0], [0]));
ack('D8 A2: route via b1+b2 audits to u, pulls back to y=a-prime, class [1]', eqV(lB, [1, 0]) && yB.length === 1 && eqV(yB[0], [1]));
ack('D9 A2: the two classes differ (im f = 0), delta ill-defined', !inSpan(imB(F0), addV(yA[0], yB[0])));
var srA2 = snakeRun(F0, H0, GA2, P, IP, 2, 1, 1);
ack('D10 A2: snake run reports route-dependence (ok=false, no stall)', srA2.ok === false && srA2.stall === false);
// Exhibit B: bottom intake map zero — squares commute, bottom row not exact
var IPB = [[0], [0]];
ack('D11 B: bottom row broken at B-prime (im i-prime dim 0, ker p-prime dim 1)', imB(IPB).length === 0 && nullB(PP, 2).length === 1);
ack('D12 B: both squares still commute (with the page instance g)', matEq(matMul(GINST, I), matMul(IPB, F0)) && matEq(matMul(PP, GINST), matMul(H0, P)));
ack('D13 B: both lifts audit to u; no y explains u — pull-back stall', eqV(apply(GINST, [0, 1]), [1, 0]) && eqV(apply(GINST, [1, 1]), [1, 0]) && pre(IPB, [1, 0], 1).length === 0);
var srB = snakeRun(F0, H0, GINST, P, IPB, 2, 1, 1);
ack('D14 B: snake run reports stall with squares commuting', srB.stall === true && srB.ok === false);
// Exercise receipts
OUT('=== GROUP D: exercise receipts ===');
var G0 = [[0, 0], [0, 0]];
var srE1 = snakeRun(F0, H0, G0, P, IP, 2, 1, 1);
ack('D15 Ex1(a): zero-audit g0 commutes with both squares', sqL(G0, F0) && sqR(G0, H0));
ack('D16 Ex1(a): delta = [0] on all of ker h (well-defined zero)', srE1.ok === true && srE1.nz === false);
ack('D17 Ex1(b): f=id makes coker f the zero room (delta has no target)', imB(FID).length === 1);
ack('D18 Ex1(b): f=id makes ker f zero (snake endpoint rooms)', nullB(FID, 1).length === 0);
ack('D19 Ex3(a) step 1: the two lifts differ by b1, in im i = ker p', inSpan(imB(I), addV([0, 1], [1, 1])) && eqV(addV([0, 1], [1, 1]), [1, 0]));
ack('D20 Ex3(a) step 2: audits differ by g(b1) = 0 = i-prime(f(a)) for f=0', eqV(addV(apply(GINST, [0, 1]), apply(GINST, [1, 1])), [0, 0]) && eqV(apply(GINST, [1, 0]), [0, 0]));
ack('D21 Ex3(a) step 3: pinned witnesses differ by an element of im f', inSpan(imB(F0), addV([1], [1])));
ack('D22 Ex3(c) refutation witness: a-prime not in im f = 0 in mode 2', !inSpan(imB(F0), [1]));
ack('D23 Ex4 receipts: mode 2 has unique witnesses per route yet differing classes', yA.length === 1 && yB.length === 1 && !eqV(yA[0], yB[0]));

// ==== GROUP E: page needles (byte-exact against the frozen page) ===
OUT('=== GROUP E: page needles ===');
function ND(id, needle) { ack(id, PAGE.indexOf(needle) >= 0, id); }
function NDC(id, needle, count) { var n = PAGE.split(needle).length - 1; ack(id, n === count, 'count=' + n + ' expected=' + count); }
ND('E1 kicker', 'The Patterns Atlas</a> · P47 · the second move of tier 5');
ND('E2 title', '<title>P47 · The diagram chase · The Patterns Atlas</title>');
ND('E3 tagline', 'Some proofs never build anything: send one witness through a diagram');
ND('E4 onramp short-exact words', 'is \\(A\\) plus \\(C\\), recorded honestly');
NDC('E5 honesty clause appears once', 'well-definedness is the theorem, not the paperwork', 1);
ND('E6 pattern box title', 'Pattern P47 — The diagram chase.');
ND('E7 forced home', '\\(\\ker h\\) maps to \\(\\operatorname{coker} f\\)');
ND('E8 A1 stall name', 'no annotation exists');
ND('E9 A2 route-dependence', 'the answers disagree');
ND('E10 B stall', 'no \\(y\\) explains \\(u\\)');
ND('E11 scope box', 'Scope, honestly.');
ND('E12 default habit 1', 'write the diagram before the words');
ND('E13 default habit 2', 'mark every station E or U');
ND('E14 census table', '8 with both, 8 left-only, 8 right-only, 40 with neither');
ND('E15 census delta-nonzero', 'exactly 1 of the 8 has \\(\\delta \\neq 0\\)');
ND('E16 wide tower', '15 of the 16');
ND('E17 wide tower close', 'The bigger the world, the harder it is for the snake to carry nothing');
NDC('E18 quiet majority x3', "the census's quiet majority", 3);
ND('E19 independence note', 'not the 4 that independent conditions would predict');
ND('E20 wide tower wording', 'vanishes on the arrivals and lands in the killed part');
NDC('E21 snake sequence x2', '\\(\\ker f \\to \\ker g \\to \\ker h \\xrightarrow{\\delta} \\operatorname{coker} f \\to \\operatorname{coker} g \\to \\operatorname{coker} h\\)', 2);
ND('E22 delta isomorphism', 'makes \\(\\delta\\) an isomorphism');
ND('E23 sketch gaps', 'Named gaps, stated plainly');
NDC('E24 connecting homomorphism x3', 'connecting homomorphism', 3);
ND('E25 shadow lesson', 'a pattern named late is still a pattern used early');
ND('E26 EU device 1', 'E for <em>there exists</em>');
ND('E27 EU device 2', 'U for <em>at most one</em>');
ND('E28 key 1', 'the rows must be exact');
ND('E29 key 2', 'the squares must commute');
ND('E30 key 3', 'well-definedness must be earned');
ND('E31 section 1 P33 recall', 'P33</a> built the three-step machine');
ND('E32 section 1 P25 recall', 'taught the census discipline');
ND('E33 section 2 story', 'forensic accountant');
ND('E34 rule 1', 'a processing entry gets killed at dispatch exactly when it was explained by intake');
ND('E35 rule 2', 'audit-then-process equals process-then-audit');
ND('E36 figure intro', 'Six rooms, three auditors, two agreements');
ND('E37 section 2 close', 'every long exact sequence in mathematics is a stack of such journeys');
ND('E38 tension paragraph', 'two rows, three columns, everything computable by hand');
ND('E39 fig1 caption', 'Fig P47.1 — the two ledgers and their three auditors');
ND('E40 fig2 caption', 'Fig P47.2 — the snake route: lift \\(c\\) to \\(b_2\\) (leftward along the top row)');
ND('E41 ex1 title', 'Exercise 1 ●○○ · When the snake carries nothing');
ND('E42 ex2 title', 'Exercise 2 ●●○ · The Short Five chase');
ND('E43 ex3 title', 'Exercise 3 ●●● · Well-definedness, proved — and which law kills which failure');
ND('E44 ex4 title', "Exercise 4 ◆ · The senior's proof and the injectivity mirage");
ND('E45 ex5 title', 'Exercise 5 ◐ · Nine rooms — the \\(3 \\times 3\\) lemma, explored');
ND('E46 moons line', 'Difficulty: ●○○ ●●○ ●●● ◆ ◐');
ND('E47 footer next', 'Next:</strong> <a href="p48-representable-functor.html">P48 · The representable functor</a>');
ND('E48 footer next words', 'an object is known by the questions you can ask of it');
ND('E49 footer home', 'The patterns atlas</a> · <a href="p33-sheaf-cohomology-bridge.html">P33 · The sheaf cohomology bridge</a>');
ND('E50 door P53', 'Door <a href="p53-deformation-cohomology.html">P53</a> · deformation cohomology');
ND('E51 door P52', 'Door <a href="p52-microlocal-propagation.html">P52</a>.</strong> The propagation door: a singularity is an obstruction with an address');
ND('E52 door P60', "Door <a href=\"p60-group-completion.html\">P60</a> · group completion, the universal invariant.</strong> An exact category's group completion imposes every short exact sequence");
ND('E53 door P65', 'Door <a href="p65-floer-homology.html">P65</a> · the customers');
ND('E54 literature Weibel', "Weibel's <em>An Introduction to Homological Algebra</em> (Cambridge, 1994)");
ND('E55 literature Mac Lane', "Mac Lane's <em>Homology</em> (Springer, 1963)");
ND('E56 lineage Cartan-Eilenberg', 'Cartan and Eilenberg systematized it in <em>Homological Algebra</em> (1956)');
ND('E57 lineage Tohoku', "Grothendieck's Tôhoku paper (1957)");
ND('E58 lineage naming', 'named for the shape of the route after the two ledgers are unfolded');
ND('E59 MathJax pin', 'sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=');
ND('E60 MathJax version', 'mathjax@3.2.2/es5/tex-svg.js');
ND('E61 MathJax config line (double backslashes in file)', "inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]");
ND('E62 Ex4 diagnosis', "The senior has read station 3's U as if it covered station 1's E.");
ND('E63 Ex4 error name', 'an E read as a U');
ND('E64 Ex4 setup', 'A senior hands you a one-paragraph proof');
ND('E65 Ex5 census-habit close', 'is a genuine open door for the census habit of <a href="p25-machine-cases.html">P25</a>');
ND('E66 Ex1 zero-audit', 'replace the processing auditor by the zero-audit variant \\(g_0\\)');
ND('E67 Exhibit B close', 'Exactness is not paperwork; it is what makes the stations functional');
ND('E68 Exhibit A close', 'The second mode is the dangerous one');
ND('E69 Ex5 honest hedge', 'no counterexample exists at any size');
ND('E70 instance lift E', 'two witnesses, an honest E');
ND('E71 instance lift U', 'an honest U');
NDC('E72 instance class nonzero x2', "\\([a'] \\neq [0]\\)", 2);

// ==== GROUP F: figure machine-checks + structure ===
OUT('=== GROUP F: figures and structure ===');
ND('F1 fig2 lift arrow path', 'M178 50 L154 50');
ND('F2 fig2 push arrow path', 'M126 58 L126 106');
ND('F3 fig2 pull-back arrow path', 'M98 123 L74 123');
ND('F4 fig1 box A', 'A ⟨a⟩');
ND('F5 fig1 box B', 'B ⟨b₁,b₂⟩');
ND('F6 fig1 box C', 'C ⟨c⟩');
ND('F7 fig1 box A-prime', 'A′ ⟨a′⟩');
ND('F8 fig1 box B-prime', 'B′ ⟨u,v⟩');
ND('F9 fig1 box C-prime', 'C′ ⟨w⟩');
ND('F10 fig2 push label', 'g(b2)=u');
NDC('F11 fig2 pull-back label x2', "u = i'(a')", 2);
ND('F12 fig2 delta label', "δ(c) = [a']");
ND('F13 fig2 quotient note', 'mod im f = mod 0');
ND('F14 fig2 auditor note', 'f = 0, h = 0');
ND('F15 fig2 lift label', '>lift</text>');
NDC('F16 fig1 marker usage x7', 'url(#ar47a)', 7);
NDC('F17 fig2 green marker usage x3', 'url(#arg)', 3);
ND('F18 fig1 aria', 'aria-label="The two ledgers');
ND('F19 fig2 aria', 'aria-label="The snake route through the two ledgers"');
NDC('F20 two page figures', 'class="page-figure"', 2);
NDC('F21 two figcaptions', '<figcaption>', 2);
NDC('F22 eight sections', '<section', 8);
NDC('F23 eight h2', '<h2>', 8);
NDC('F24 five mini-tables', 'class="mini-table"', 5);
NDC('F25 nine details blocks', '<details>', 9);
NDC('F26 one pattern box', 'class="pattern-box"', 1);
NDC('F27 one warn box', 'class="warn-box"', 1);
NDC('F28 one sketch marker', 'sketch-marker', 1);
NDC('F29 one moons line', 'class="moons"', 1);
NDC('F30 eleven h3 headers', '<h3', 11);
NDC('F31 href count matches whitelist (15)', 'href="', 15);
ack('F32 no banned lab/session talk', PAGE.indexOf('session') < 0 && PAGE.indexOf('verifier') < 0 && PAGE.indexOf('prototype') < 0);
ack('F33 balanced inline TeX open/close', PAGE.split('\\(').length === PAGE.split('\\)').length);
ack('F34 balanced display TeX open/close', PAGE.split('\\[').length === PAGE.split('\\]').length);

// ==== summary ===
OUT('');
OUT('=== SUMMARY ===');
OUT('total checks: ' + (LC.pass + LC.fail) + ' | PASS: ' + LC.pass + ' | FAIL: ' + LC.fail);
OUT(LC.fail === 0 ? 'p47 lab: ALL GREEN' : 'p47 lab: FAILURES PRESENT');
