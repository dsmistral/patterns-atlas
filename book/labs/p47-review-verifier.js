// p47 adversarial verifier — fresh brute-force engine, zero code shared with the lab.
// Vectors are integer bitmasks (bit j = the j-th basis coordinate); kernels, images,
// lifts and fibers are computed by enumerating ALL vectors of the source space; span
// membership by XOR-basis insertion; quotient classes by minimal coset
// representatives over the enumerated span. Runner injects the page as PAGE.
var OUTL = [];
function OUT(s) { OUTL.push(s); }
var VC = { pass: 0, fail: 0 };
function vk(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); VC[ok ? 'pass' : 'fail']++; }
function popPar(x) { var n = 0; while (x) { n ^= 1; x &= x - 1; } return n; }
function rowMs(M, sd) { var o = [], i, j, m; for (i = 0; i < M.length; i++) { m = 0; for (j = 0; j < sd; j++) if (M[i][j]) m |= 1 << j; o.push(m); } return o; }
function apMs(rm, x) { var o = 0, i; for (i = 0; i < rm.length; i++) if (popPar(rm[i] & x)) o |= 1 << i; return o; }
function allVecs(n) { var o = [], i; for (i = 0; i < (1 << n); i++) o.push(i); return o; }
function redBy(bas, v) { var i, w; for (i = 0; i < bas.length; i++) { w = v ^ bas[i]; if (w < v) v = w; } return v; }
function xbas(vs) { var b = [], i, v; for (i = 0; i < vs.length; i++) { v = redBy(b, vs[i]); if (v) { b.push(v); b.sort(function (a, c) { return c - a; }); } } return b; }
function xdim(vs) { return xbas(vs).length; }
function spanLst(bas) { var sp = [0], i, j, n0; for (i = 0; i < bas.length; i++) { n0 = sp.length; for (j = 0; j < n0; j++) sp.push(sp[j] ^ bas[i]); } return sp; }
function inSpn(bas, v) { return redBy(bas, v) === 0; }
function kern(rm, sd) { var o = [], vs = allVecs(sd), i; for (i = 0; i < vs.length; i++) if (apMs(rm, vs[i]) === 0) o.push(vs[i]); return o; }
function imOf(rm, sd) { var o = [], vs = allVecs(sd), i; for (i = 0; i < vs.length; i++) o.push(apMs(rm, vs[i])); return o; }
function fiber(rm, t, sd) { var o = [], vs = allVecs(sd), i; for (i = 0; i < vs.length; i++) if (apMs(rm, vs[i]) === t) o.push(vs[i]); return o; }
function clsOf(y, spn) { var c = y, i; for (i = 0; i < spn.length; i++) if ((y ^ spn[i]) < c) c = y ^ spn[i]; return c; }
function uniq(a) { var d = {}, o = [], i; for (i = 0; i < a.length; i++) if (!d[a[i]]) { d[a[i]] = 1; o.push(a[i]); } return o; }
function setEq(a, b) { var sa = uniq(a).sort(function (x, y) { return x - y; }), sb = uniq(b).sort(function (x, y) { return x - y; }); if (sa.length !== sb.length) return false; var i; for (i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return false; return true; }
// the chase, walked independently of the lab's runner: per anomaly, EVERY lift is
// audited, pulled back, and classed; well-defined = all lifts of one anomaly agree
// on the class; stall = some lift finds no pre-witness or an unpinned one.
function walk(f, ip, p, g, pp, h, dA, dB, dC, dA2) {
  var imfSp = spanLst(xbas(imOf(f, dA))), per = [], cs = kern(h, dC), i, q;
  for (i = 0; i < cs.length; i++) {
    var c = cs[i], ls = fiber(p, c, dB), cls = [], okc = ls.length > 0, li, au, ys;
    for (li = 0; li < ls.length; li++) {
      au = apMs(g, ls[li]); ys = fiber(ip, au, dA2);
      if (ys.length !== 1) { okc = false; } else { cls.push(clsOf(ys[0], imfSp)); }
    }
    okc = okc && cls.length === ls.length;
    var same = true, k2; for (k2 = 1; k2 < cls.length; k2++) if (cls[k2] !== cls[0]) same = false;
    per.push({ c: c, lifts: ls.length, cls: cls, ok: okc && same, nz: cls.length ? (cls[0] !== clsOf(0, imfSp)) : false });
  }
  var allok = true, anynz = false; for (q = 0; q < per.length; q++) { if (!per[q].ok) allok = false; if (per[q].nz) anynz = true; }
  return { per: per, ok: allok, nz: anynz };
}
OUT('=== GROUP V: the instance, re-derived by bitmask ===');
var I1 = rowMs([[1], [0]], 1), P1 = rowMs([[0, 1]], 2), IP1 = rowMs([[1], [0]], 1), PP1 = rowMs([[0, 1]], 2);
var F0 = rowMs([[0]], 1), FID = rowMs([[1]], 1), H0 = rowMs([[0]], 1), HID = rowMs([[1]], 1);
var GI = rowMs([[0, 1], [0, 0]], 2);
vk('V01 top row exact (p after i is zero, im i = ker p)', (function () { var i, z = true; for (i = 0; i < 2; i++) if (apMs(P1, apMs(I1, i)) !== 0) z = false; return z && setEq(imOf(I1, 1), kern(P1, 2)); })());
vk('V02 bottom row exact', (function () { var i, z = true; for (i = 0; i < 2; i++) if (apMs(PP1, apMs(IP1, i)) !== 0) z = false; return z && setEq(imOf(IP1, 1), kern(PP1, 2)); })());
vk('V03 both squares commute on every vector', (function () { var i, z = true; for (i = 0; i < 2; i++) if (apMs(GI, apMs(I1, i)) !== apMs(IP1, apMs(F0, i))) z = false; for (i = 0; i < 4; i++) if (apMs(PP1, apMs(GI, i)) !== apMs(H0, apMs(P1, i))) z = false; return z; })());
vk('V04 ker h = {0, c}', setEq(kern(H0, 1), [0, 1]));
vk('V05 im f = {0} (coker f has two classes)', xdim(imOf(F0, 1)) === 0);
var WI = walk(F0, IP1, P1, GI, PP1, H0, 1, 2, 1, 1);
vk('V06 c lifts to exactly two witnesses {b2, b1+b2}', fiber(P1, 1, 2).length === 2 && setEq(fiber(P1, 1, 2), [2, 3]));
vk('V07 both audits land on u', apMs(GI, 2) === 1 && apMs(GI, 3) === 1);
vk('V08 the pull-back of u is the single witness a-prime', fiber(IP1, 1, 1).length === 1 && fiber(IP1, 1, 1)[0] === 1);
vk('V09 delta(c) = [a-prime]: nonzero and route-free', WI.ok === true && WI.per[1].nz === true && WI.per[1].cls.length === 2 && WI.per[1].cls[0] === WI.per[1].cls[1] && WI.per[1].cls[0] === 1);
vk('V10 delta(0) = [0]', WI.per[0].nz === false && WI.per[0].cls.length === 2 && WI.per[0].cls[0] === 0 && WI.per[0].cls[1] === 0);
vk('V11 six snake rooms all dim 1', xdim(kern(F0, 1)) === 1 && xdim(kern(GI, 2)) === 1 && xdim(kern(H0, 1)) === 1 && (1 - xdim(imOf(F0, 1))) === 1 && (2 - xdim(imOf(GI, 2))) === 1 && (1 - xdim(imOf(H0, 1))) === 1);
vk('V12 exact at ker g', (function () { var im = [], ks = kern(F0, 1), i; for (i = 0; i < ks.length; i++) im.push(apMs(I1, ks[i])); return setEq(im, kern(GI, 2)); })());
vk('V13 exact at ker h (delta injective)', (function () { var im = [], ks = kern(GI, 2), i, kd = [], q; for (i = 0; i < ks.length; i++) im.push(apMs(P1, ks[i])); for (q = 0; q < WI.per.length; q++) if (WI.per[q].nz === false) kd.push(WI.per[q].c); return setEq(im, kd); })());
vk('V14 exact at coker f (delta surjective)', (function () { var imd = [], kd = [], q, y, imG = xbas(imOf(GI, 2)); for (q = 0; q < WI.per.length; q++) if (WI.per[q].ok) imd.push(WI.per[q].cls[0]); for (y = 0; y < 2; y++) if (inSpn(imG, apMs(IP1, y))) kd.push(y); return setEq(imd, kd); })());
vk('V15 exact at coker g', (function () { var spG = spanLst(xbas(imOf(GI, 2))), imH = xbas(imOf(H0, 1)); var im = [], y, x, kd = []; for (y = 0; y < 2; y++) im.push(clsOf(apMs(IP1, y), spG)); for (x = 0; x < 4; x++) if (inSpn(imH, apMs(PP1, x))) kd.push(clsOf(x, spG)); return setEq(im, kd) && uniq(im).length === 1; })());
vk('V16 delta is an isomorphism (two rooms, two distinct classes)', WI.ok && WI.nz && (function () { var d = {}, q; for (q = 0; q < WI.per.length; q++) d[WI.per[q].cls[0]] = 1; return Object.keys(d).length === 2; })());
OUT('=== GROUP V: the census, re-counted ===');
var fs2 = [F0, FID], hs2 = [H0, HID], gs16 = [], t;
for (t = 0; t < 16; t++) gs16.push(rowMs([[t & 1, (t >> 1) & 1], [(t >> 2) & 1, (t >> 3) & 1]], 2));
var tot = 0, lft = 0, rgt = 0, both = 0, lon = 0, ron = 0, nei = 0, wd = 0, dnz = 0, dnzcfg = '';
var pairC = [0, 0, 0, 0], condOK = true, fi, hi, gi;
for (fi = 0; fi < 2; fi++) for (hi = 0; hi < 2; hi++) for (gi = 0; gi < 16; gi++) {
  var fc = fs2[fi], hc = hs2[hi], gc = gs16[gi], x, l = true, r = true;
  for (x = 0; x < 2; x++) if (apMs(gc, apMs(I1, x)) !== apMs(IP1, apMs(fc, x))) l = false;
  for (x = 0; x < 4; x++) if (apMs(PP1, apMs(gc, x)) !== apMs(hc, apMs(P1, x))) r = false;
  tot++;
  if (l) lft++; if (r) rgt++;
  if (l && r) { both++; pairC[fi * 2 + hi]++; }
  if (l && !r) lon++; if (!l && r) ron++; if (!l && !r) nei++;
  if (l && r) {
    var wc = walk(fc, IP1, P1, gc, PP1, hc, 1, 2, 1, 1);
    if (wc.ok) wd++;
    if (wc.nz) { dnz++; dnzcfg = 'f=' + fi + ' h=' + hi + ' g#' + gi; }
  }
  if (l !== (apMs(gc, 1) === apMs(IP1, apMs(fc, 1)))) condOK = false;
  if (r !== (apMs(PP1, apMs(gc, 1)) === apMs(hc, apMs(P1, 1)) && apMs(PP1, apMs(gc, 2)) === apMs(hc, apMs(P1, 2)))) condOK = false;
}
vk('V17 census 64 / left 16 / right 16', tot === 64 && lft === 16 && rgt === 16, 'tot=' + tot + ' L=' + lft + ' R=' + rgt);
vk('V18 both 8 / left-only 8 / right-only 8 / neither 40', both === 8 && lon === 8 && ron === 8 && nei === 40, 'both=' + both + ' Lonly=' + lon + ' Ronly=' + ron + ' neither=' + nei);
vk('V19 all 8 both-commuting: delta well-defined on every anomaly', wd === 8, 'wellDef=' + wd);
vk('V20 exactly 1 of the 8 has delta nonzero — the page instance g#2', dnz === 1 && dnzcfg === 'f=0 h=0 g#2', 'dnz=' + dnz + ' cfg=' + dnzcfg);
vk('V21 each (f,h) pair leaves exactly 2 both-commuting auditors', pairC[0] === 2 && pairC[1] === 2 && pairC[2] === 2 && pairC[3] === 2, 'pairs=' + pairC.join(','));
vk('V22 commutativity reduces to the pinned matrix entries in all 64', condOK);
vk('V23 the quiet majority: 7 of the 8 well-defined and zero', wd - dnz === 7, 'zeroSnake=' + (wd - dnz));
OUT('=== GROUP V: the Short Five, re-counted ===');
var sf = 0, siso = 0, slist = [];
for (t = 0; t < 16; t++) {
  var gs = gs16[t], x, l = true, r = true;
  for (x = 0; x < 2; x++) if (apMs(gs, apMs(I1, x)) !== apMs(IP1, apMs(FID, x))) l = false;
  for (x = 0; x < 4; x++) if (apMs(PP1, apMs(gs, x)) !== apMs(HID, apMs(P1, x))) r = false;
  if (l && r) {
    sf++;
    var hit = {}, i3; for (i3 = 0; i3 < 4; i3++) hit[apMs(gs, i3)] = 1;
    if (Object.keys(hit).length === 4) siso++;
    slist.push(t);
  }
}
vk('V24 f=h=id: exactly 2 of 16 commute with both squares', sf === 2, 'sf=' + sf + ' ts=' + slist.join(','));
vk('V25 both are bijections and both send b1 to u', siso === 2 && slist.join(',') === '9,11' && apMs(gs16[9], 1) === 1 && apMs(gs16[11], 1) === 1);
OUT('=== GROUP V: the wide tower, re-counted ===');
var IW = rowMs([[1, 0], [0, 1], [0, 0], [0, 0]], 2), PW = rowMs([[0, 0, 1, 0], [0, 0, 0, 1]], 4);
var IPW = rowMs([[1, 0], [0, 1], [0, 0], [0, 0]], 2), PPW = rowMs([[0, 0, 1, 0], [0, 0, 0, 1]], 4);
var FW = rowMs([[0, 0], [0, 0]], 2), HW = rowMs([[0, 0], [0, 0]], 2);
vk('V26 tower rows exact (arrivals = killed part, dims 2,4,2)', setEq(imOf(IW, 2), kern(PW, 4)) && setEq(imOf(IPW, 2), kern(PPW, 4)) && xdim(imOf(IW, 2)) === 2 && xdim(kern(PW, 4)) === 2);
var tk, tcomm = 0, tlifts = true, twd = true, tdnz = 0, tzero = -1;
for (tk = 0; tk < 16; tk++) {
  var m0 = ((tk & 1) ? 4 : 0) | ((tk & 4) ? 8 : 0), m1 = ((tk & 2) ? 4 : 0) | ((tk & 8) ? 8 : 0);
  var GW = [m0, m1, 0, 0];
  var x, l = true, r = true;
  for (x = 0; x < 4; x++) if (apMs(GW, apMs(IW, x)) !== apMs(IPW, apMs(FW, x))) l = false;
  for (x = 0; x < 16; x++) if (apMs(PPW, apMs(GW, x)) !== apMs(HW, apMs(PW, x))) r = false;
  if (l && r) {
    tcomm++;
    var wt = walk(FW, IPW, PW, GW, PPW, HW, 2, 4, 2, 2);
    if (!wt.ok) twd = false;
    var q4; for (q4 = 0; q4 < wt.per.length; q4++) if (wt.per[q4].lifts !== 4) tlifts = false;
    if (wt.nz) tdnz++; else tzero = tk;
  }
}
vk('V27 all 16 arrival-killing maps commute with both squares', tcomm === 16, 'comm=' + tcomm);
vk('V28 every anomaly has exactly 4 lifts', tlifts);
vk('V29 all 16 well-defined', twd);
vk('V30 delta nonzero on 15 of 16, vanishing only at the zero map', tdnz === 15 && tzero === 0, 'dnz=' + tdnz + ' zeroAt=' + tzero);
OUT('=== GROUP V: the broken exhibits, re-run ===');
var GA1 = rowMs([[0, 0], [0, 1]], 2);
var GA2 = rowMs([[1, 0], [0, 0]], 2);
var IPB = rowMs([[0], [0]], 1);
vk('V31 A1: left square commutes, right square broken', (function () { var x, l = true, r = true; for (x = 0; x < 2; x++) if (apMs(GA1, apMs(I1, x)) !== apMs(IP1, apMs(F0, x))) l = false; for (x = 0; x < 4; x++) if (apMs(PP1, apMs(GA1, x)) !== apMs(H0, apMs(P1, x))) r = false; return l && !r; })());
vk('V32 A1: both lifts audit outside the killed part, no pre-witness exists', (function () { var ls = fiber(P1, 1, 2), kpp = xbas(kern(PP1, 2)), i, ok = ls.length === 2, au; for (i = 0; i < ls.length; i++) { au = apMs(GA1, ls[i]); if (au !== 2) ok = false; if (inSpn(kpp, au)) ok = false; if (fiber(IP1, au, 1).length !== 0) ok = false; } return ok; })());
vk('V33 A2: right square commutes, left square broken', (function () { var x, l = true, r = true; for (x = 0; x < 2; x++) if (apMs(GA2, apMs(I1, x)) !== apMs(IP1, apMs(F0, x))) l = false; for (x = 0; x < 4; x++) if (apMs(PP1, apMs(GA2, x)) !== apMs(H0, apMs(P1, x))) r = false; return !l && r; })());
var WA2 = walk(F0, IP1, P1, GA2, PP1, H0, 1, 2, 1, 1);
vk('V34 A2: both routes complete, witnesses pinned uniquely, classes [0] and [1] disagree', WA2.ok === false && apMs(GA2, 2) === 0 && apMs(GA2, 3) === 1 && fiber(IP1, 0, 1).length === 1 && fiber(IP1, 1, 1).length === 1 && WA2.per[1].cls.length === 2 && WA2.per[1].cls[0] === 0 && WA2.per[1].cls[1] === 1);
vk('V35 A2: i-prime is injective (the mirage premise holds)', (function () { var t2, seen = {}; for (t2 = 0; t2 < 2; t2++) seen[apMs(IP1, t2)] = 1; return Object.keys(seen).length === 2; })());
vk('V36 B: bottom row broken at B-prime while both squares still commute', (function () { var x, l = true, r = true; for (x = 0; x < 2; x++) if (apMs(GI, apMs(I1, x)) !== apMs(IPB, apMs(F0, x))) l = false; for (x = 0; x < 4; x++) if (apMs(PP1, apMs(GI, x)) !== apMs(H0, apMs(P1, x))) r = false; return l && r && xdim(imOf(IPB, 1)) === 0 && xdim(kern(PP1, 2)) === 1; })());
var WB = walk(F0, IPB, P1, GI, PP1, H0, 1, 2, 1, 1);
vk('V37 B: audits reach u, no y explains it, no lift rescues', WB.ok === false && (function () { var ls = fiber(P1, 1, 2), i, st = true; for (i = 0; i < ls.length; i++) if (apMs(GI, ls[i]) !== 1 || fiber(IPB, 1, 1).length !== 0) st = false; return st; })());
OUT('=== GROUP V: exercise receipts, re-run ===');
var G0Z = rowMs([[0, 0], [0, 0]], 2);
var WE1 = walk(F0, IP1, P1, G0Z, PP1, H0, 1, 2, 1, 1);
vk('V38 Ex1(a): the zero-audit commutes and delta = 0 everywhere', WE1.ok === true && WE1.nz === false);
vk('V39 Ex1(b): f=id empties both end rooms (ker f = coker f = 0)', xdim(kern(FID, 1)) === 0 && (1 - xdim(imOf(FID, 1))) === 0);
vk('V40 Ex3(c): the mode-2 difference a-prime is outside im f', inSpn(xbas(imOf(F0, 1)), 1) === false);
OUT('=== GROUP V: page needles, control, and poison clones ===');
var NDN = 0;
function needlesMissing(text) {
  var nd = [
    'P47 · The diagram chase · The Patterns Atlas',
    'the second move of tier 5',
    'New word: commutative diagram.',
    "\\(B\\) is \\(A\\) plus \\(C\\), recorded honestly",
    'Rule 1 (the ledgers are honest)',
    'Rule 2 (the audits agree)',
    'audit-then-process equals process-then-audit',
    'Is there a place in the bottom ledger where',
    'What is each of the two rules actually paying for?',
    'Fig P47.1 — the two ledgers and their three auditors.',
    'Pattern P47 — The diagram chase.',
    '(E: a witness exists, possibly many)',
    '(U: at most one answer)',
    'well-definedness is the theorem, not the paperwork.',
    'mark every station E or U',
    'Key 1 — the rows must be exact.',
    'Key 2 — the squares must commute.',
    'Key 3 — well-definedness must be earned.',
    'two witnesses, an honest E',
    'unique: an honest U',
    "the census's quiet majority",
    'dims 1, 1, 1, then 1, 1, 1',
    'every anomaly has 4 lifts, all well-defined',
    'on 15 of the 16',
    'a pattern named late is still a pattern used early',
    'SKETCH — the third encounter opens onto a bigger claim',
    'no annotation exists',
    'The second mode is the dangerous one.',
    'intake explains nothing now',
    'Scope, honestly.',
    'write the diagram before the words',
    'p53-deformation-cohomology.html',
    'p52-microlocal-propagation.html',
    'p60-group-completion.html',
    'p65-floer-homology.html',
    'p48-representable-functor.html',
    'an object is known by the questions you can ask of it',
    'Difficulty: ●○○ ●●○ ●●● ◆ ◐',
    'Exercise 1 ●○○ · When the snake carries nothing',
    'Exercise 2 ●●○ · The Short Five chase',
    'Exercise 3 ●●● · Well-definedness, proved',
    "Exercise 4 ◆ · The senior's proof and the injectivity mirage",
    'Exercise 5 ◐ · Nine rooms',
    '2 of 16, both isomorphisms',
    'an E read as a U',
    'exactly 1 of the 8 has',
    '8 with both, 8 left-only, 8 right-only, 40 with neither',
    'sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=',
    'mathjax@3.2.2',
    "u = i'(a')",
    "δ(c) = [a']",
    'mod im f = mod 0',
    'f = 0, h = 0',
    'Homological Algebra</em> (1956)',
    'Tôhoku paper (1957)',
    'connecting homomorphism</em>',
    "\\(g \\circ i = i' \\circ f\\)",
    '\\ker h \\xrightarrow{\\delta} \\operatorname{coker} f',
    "\\(\\delta(c) = [a'] \\in A'/\\operatorname{im} f\\)",
    '\\(2 \\times 2 \\times 16 = 64\\)',
    'p33-sheaf-cohomology-bridge.html',
    'p46-spectral-sequences.html',
    'p25-machine-cases.html',
    'p12-obstruction.html',
    'b02-congruence-classes.html',
    'Five exercises, moons for difficulty',
    "Mac Lane's <em>Homology</em> (Springer, 1963)",
    'An Introduction to Homological Algebra</em> (Cambridge, 1994)'
  ];
  NDN = nd.length;
  var miss = [], i;
  for (i = 0; i < nd.length; i++) if (text.indexOf(nd[i]) < 0) miss.push(nd[i]);
  return miss;
}
var ctrlv = needlesMissing(PAGE);
vk('P00 control: unmutated page passes all needles', ctrlv.length === 0, 'needles=' + NDN + ' missing=' + ctrlv.length);
var poisons = [
  ['P01 census both-count', '8 with both, 8 left-only, 8 right-only, 40 with neither', '9 with both, 8 left-only, 8 right-only, 40 with neither'],
  ['P02 census delta-nonzero count', 'exactly 1 of the 8 has', 'exactly 2 of the 8 has'],
  ['P03 wide-tower lift count', 'every anomaly has 4 lifts, all well-defined', 'every anomaly has 3 lifts, all well-defined'],
  ['P04 wide-tower delta-nonzero count', 'on 15 of the 16', 'on 14 of the 16'],
  ['P05 Short Five commuting count', '2 of 16, both isomorphisms', '2 of 15, both isomorphisms'],
  ['P06 snake dims', 'dims 1, 1, 1, then 1, 1, 1', 'dims 1, 1, 1, then 1, 1, 2'],
  ['P07 honesty clause', 'well-definedness is the theorem, not the paperwork', 'well-definedness is the paperwork, not the theorem'],
  ['P08 E/U diagnosis', 'an E read as a U', 'a U read as an E']
];
for (var ip = 0; ip < poisons.length; ip++) {
  var nm = poisons[ip][0], fromS = poisons[ip][1], toS = poisons[ip][2];
  var mutated = PAGE.split(fromS).join(toS);
  var missP = needlesMissing(mutated);
  vk(nm, missP.length >= 1, 'REJECTED, ' + missP.length + ' needle(s) missing' + (mutated === PAGE ? ' [WARNING: mutation did not apply]' : ''));
}
OUT('=== SUMMARY ===');
OUT('verifier checks: ' + VC.pass + ' pass, ' + VC.fail + ' fail');
OUT(VC.fail === 0 ? 'VERIFIER P47: ' + VC.pass + '/' + (VC.pass + VC.fail) + ' PASS' : 'VERIFIER P47: ' + VC.pass + '/' + (VC.pass + VC.fail) + ' PASS, ' + VC.fail + ' FAIL');
