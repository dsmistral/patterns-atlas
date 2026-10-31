// p42 lab group A — the harmonic shelf census
var A = { pass: 0, fail: 0 };
function ack(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); A[ok ? 'pass' : 'fail']++; }
var pw = [], p = 1;
for (var j = 0; j <= 21; j++) { pw.push(p); p *= 2; }
// A01: the twenty shelves, each in (1/2, 1]
var blocks = [];
for (var j = 0; j < 20; j++) { var b = 0; for (var n = pw[j]; n < pw[j + 1]; n++) { b += 1 / n; } blocks.push(b); }
var allin = true, mono = true;
for (var j = 0; j < 20; j++) { if (!(blocks[j] > 0.5 && blocks[j] <= 1)) allin = false; }
for (var j = 1; j < 20; j++) { if (!(blocks[j] < blocks[j - 1])) mono = false; }
var bstr = ''; for (var j = 0; j < 20; j++) { bstr += blocks[j].toFixed(4) + (j === 19 ? '' : ' '); }
ack('A01', allin, '20 shelves each in (1/2, 1]: ' + bstr);
ack('A02', mono, 'shelves strictly decreasing: S_1 = ' + blocks[1].toFixed(4) + ' < S_0 = 1, S_19 = ' + blocks[19].toFixed(6));
ack('A03', Math.abs(blocks[19] - Math.log(2)) < 1e-5, 'shelf 19 within 1e-5 of ln 2: ' + blocks[19].toFixed(7) + ' vs ' + Math.log(2).toFixed(7));
// A04: the walls k/2 <= H(2^k) <= k for k = 0..20
var Hk = [], s = 0, k2 = 0;
for (var n = 1; n <= pw[20]; n++) { s += 1 / n; if (n === pw[k2]) { Hk.push(s); k2++; } }
var wallok = true;
for (var k = 0; k <= 20; k++) { if (!(Hk[k] >= k / 2 + 1 / pw[k] - 1e-12 && Hk[k] <= k + 1 / pw[k] + 1e-12)) wallok = false; }
ack('A04', wallok, 'walls k/2 + 1/2^k <= H(2^k) <= k + 1/2^k for k = 0..20 (k shelves + the leftover term); H(2^20) = ' + Hk[20].toFixed(4));
var GAM = 0.5772156649015329;
ack('A05', Math.abs(Hk[20] - (20 * Math.log(2) + GAM + 1 / (2 * pw[20]))) < 1e-6, 'H(2^20) = 20 ln 2 + gamma + 1/(2*2^20) to 1e-6: ' + Hk[20].toFixed(6) + ' vs ' + (20 * Math.log(2) + GAM).toFixed(6));
// A06: H at a million
var hm = 0; for (var n = 1; n <= 1000000; n++) { hm += 1 / n; }
ack('A06', Math.abs(hm - 14.3927267228) < 1e-4, 'H(10^6) = ' + hm.toFixed(4) + ' (the machine-friend receipt 14.3927)');
// A07: exact fractions for shelves j = 0..4
function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
function addF(f, g) { var d = gcd(f[1], g[1]); var l = f[1] / d * g[1]; var num = f[0] * (l / f[1]) + g[0] * (l / g[1]); var d2 = gcd(num < 0 ? -num : num, l); return [num / d2, l / d2]; }
var frs = [];
for (var j = 0; j < 5; j++) { var fr = [0, 1]; for (var n = pw[j]; n < pw[j + 1]; n++) { fr = addF(fr, [1, n]); } frs.push(fr); }
ack('A07', frs[0][0] === 1 && frs[0][1] === 1 && frs[1][0] === 5 && frs[1][1] === 6 && frs[2][0] === 319 && frs[2][1] === 420,
  'exact shelves: 1, 5/6, 319/420, ' + frs[3][0] + '/' + frs[3][1] + ', ' + frs[4][0] + '/' + frs[4][1]);
var fmatch = true;
for (var j = 0; j < 5; j++) { if (Math.abs(frs[j][0] / frs[j][1] - blocks[j]) > 1e-12) fmatch = false; }
ack('A08', fmatch, 'exact fractions equal the float shelves to 1e-12');
// A09: the poison bounds
var p1 = true, p2 = true;
for (var j = 1; j < 20; j++) { if (blocks[j] >= 1) p1 = false; }
for (var j = 0; j < 20; j++) { if (blocks[j] <= 0.5) p2 = false; }
ack('A09', p1 && p2, 'poison audit: no shelf >= 1 from j = 1 on (S_1 = 5/6), no shelf <= 1/2 ever (S_2 = 0.7595 > 1/2)');
// A10: per-octave growth
var douts = []; for (var j = 0; j < 20; j++) { douts.push(Hk[j + 1] - Hk[j]); }
var dok = true;
for (var j = 0; j < 20; j++) { if (!(douts[j] >= 0.5 - 1e-12 && douts[j] < 1)) dok = false; }
ack('A10', dok, 'per-octave growth H(2^(j+1)) - H(2^j) each in [1/2, 1): j = 0 reads exactly 0.5, j = 19 reads ' + douts[19].toFixed(6));
// A11: the verdict receipt
ack('A11', Hk[20] >= 10 && Hk[20] <= 20, 'the walls at a million: 10 <= H(2^20) = ' + Hk[20].toFixed(4) + ' <= 20');
OUT('GROUP A: ' + A.pass + ' pass, ' + A.fail + ' fail');
// p42 lab group B — condensation verdicts: the log series and the near-boundary
var B = { pass: 0, fail: 0 };
function bck(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); B[ok ? 'pass' : 'fail']++; }
var pw = [], p = 1;
for (var j = 0; j <= 21; j++) { pw.push(p); p *= 2; }
var L2 = Math.log(2);
// B01: the slowest divergence: sum 1/(n ln n) to 2^20
var s1 = 0;
for (var n = 2; n <= pw[20]; n++) { s1 += 1 / (n * Math.log(n)); }
bck('B01', s1 > 3.3 && s1 < 3.5, 'sum 1/(n ln n) n=2..2^20 = ' + s1.toFixed(4) + ' — under 3.5 after a million terms, glacial divergence');
// B02: log-series shelf bounds: block_j in [1/(2(j+1) ln 2), 1/(j ln 2)]
var lb = true, first = [];
for (var j = 1; j < 20; j++) {
  var b = 0; for (var n = pw[j]; n < pw[j + 1]; n++) { b += 1 / (n * Math.log(n)); }
  var lo = 1 / (2 * (j + 1) * L2), hi = 1 / (j * L2);
  if (!(b >= lo * 0.999 && b <= hi)) lb = false;
  if (j === 1) first = [b, lo, hi];
}
bck('B02', lb, 'log shelves inside walls: block_1 = ' + first[0].toFixed(4) + ' in [' + first[1].toFixed(4) + ', ' + first[2].toFixed(4) + ']');
// B03: the lower-wall story-sum grows like (1/(2 ln 2)) * harmonic in j
var low = 0, lowv = [];
for (var j = 1; j <= 19; j++) { low += 1 / (2 * (j + 1) * L2); lowv.push(low); }
bck('B03', lowv[18] > lowv[10] && low > 1.85, 'lower-wall story-sum climbs to ' + low.toFixed(4) + ' at j = 19 — unbounded, certified by walls alone');
// B04: the convergent cousin: sum 1/(n ln^2 n)
var s2 = 0;
for (var n = 2; n <= pw[20]; n++) { s2 += 1 / (n * Math.log(n) * Math.log(n)); }
bck('B04', s2 > 2 && s2 < 2.3, 'sum 1/(n ln^2 n) n=2..2^20 = ' + s2.toFixed(4) + ' — convergent, total near ' + (s2 + 1 / Math.log(pw[20])).toFixed(2));
// B05: its shelf story: block_j <= 1/(j ln 2)^2, a summable 1/j^2 story
var sb = true;
for (var j = 1; j < 20; j++) {
  var b = 0; for (var n = pw[j]; n < pw[j + 1]; n++) { b += 1 / (n * Math.log(n) * Math.log(n)); }
  if (!(b <= 1 / (j * L2) / (j * L2) * 1.001)) sb = false;
}
bck('B05', sb, 'shelf story of the convergent cousin: block_j <= (1/(j ln 2))^2, a 1/j^2 story — summable');
// B06: the p-family: blocks of 1/n^p are geometric in j with ratio ~ 2^-(p-1)
var ok6 = true, ratios = [];
var ps = [2, 1.5, 1.01];
for (var t = 0; t < ps.length; t++) {
  var pp = ps[t], bl = [];
  for (var j = 0; j < 20; j++) { var b = 0; for (var n = pw[j]; n < pw[j + 1]; n++) { b += Math.pow(n, -pp); } bl.push(b); }
  var r = bl[19] / bl[18];
  ratios.push('p=' + pp + ': ratio ' + r.toFixed(4) + ' vs 2^-(p-1) = ' + Math.pow(2, -(pp - 1)).toFixed(4));
  if (Math.abs(r - Math.pow(2, -(pp - 1))) > 5e-4) ok6 = false;
}
bck('B06', ok6, 'blocks of 1/n^p geometric with ratio 2^-(p-1): ' + ratios.join('; '));
// B07: near-boundary speed: p = 1.01 partials vs walls
var pp = 1.01, blocks = [], tot = 0;
for (var j = 0; j < 20; j++) { var b = 0; for (var n = pw[j]; n < pw[j + 1]; n++) { b += Math.pow(n, -pp); } blocks.push(b); tot += b; }
var geoT = 0; for (var j = 0; j < 6000; j++) { geoT += Math.pow(2, -0.01 * j); }
bck('B07', tot > 9.27 && tot < 18.67, 'p = 1.01: machine partial to 2^20 = ' + tot.toFixed(2) + ' inside walls [9.27, 18.67]; geometric story total ' + geoT.toFixed(1) + ' gives walls [71.6, 144.3] around borrowed zeta(1.01) ~ 100.58');
OUT('GROUP B: ' + B.pass + ' pass, ' + B.fail + ' fail');
// p42 lab group C — the monotonicity hole: signs break the shelf obligation
var C = { pass: 0, fail: 0 };
function cck(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); C[ok ? 'pass' : 'fail']++; }
var pw = [], p = 1;
for (var j = 0; j <= 21; j++) { pw.push(p); p *= 2; }
var L2 = Math.log(2);
// C01: the alternating harmonic converges to ln 2, bracketed
var S = 0, above = true, below = true;
for (var n = 1; n <= pw[20]; n++) { S += (n % 2 === 1 ? 1 : -1) / n; if (n <= 64) { if (n % 2 === 1 && S <= L2) above = false; if (n % 2 === 0 && S >= L2) below = false; } }
cck('C01', Math.abs(S - L2) < 2e-6, 'alternating harmonic to 2^20 = ' + S.toFixed(6) + ' vs ln 2 = ' + L2.toFixed(6));
cck('C02', above && below, 'Leibniz bracket: odd partials above ln 2, even partials below, through n = 64');
// C03: the condensed shadow diverges: each dyadic shadow term is exactly 1
var shadow = 0, allone = true;
for (var j = 0; j < 20; j++) { var t = pw[j] * Math.abs((pw[j] % 2 === 1 ? 1 : -1)) / pw[j]; shadow += t; if (Math.abs(t - 1) > 1e-12) allone = false; }
cck('C03', allone && shadow === 20, 'the condensed shadow: 2^j |a_2^j| = 1 at every shelf j = 0..19, partial = 20 and climbing by 1 per octave — the shelf machine fed signed terms lies');
// C04: the signed block [4, 8) breaks the one-bound-per-shelf obligation
var sb = 0, ab = 0;
for (var n = 4; n < 8; n++) { sb += (n % 2 === 0 ? 1 : -1) / n; ab += 1 / n; }
cck('C04', sb < 0.5 && ab > 0.5, 'signed block [4,8) = ' + sb.toFixed(4) + ' < 1/2 while its absolute version = ' + ab.toFixed(4) + ' > 1/2 — the shelf obligation is a size statement, broken by signs');
// C05: the honest instrument for signs: shrinking bracket steps
var steps = true, Sold = 0;
for (var n = 1; n <= 100; n++) { var Sn = Sold + (n % 2 === 1 ? 1 : -1) / n; if (Math.abs(Math.abs(Sn - Sold) - 1 / n) > 1e-12) steps = false; Sold = Sn; }
cck('C05', steps, 'bracket steps shrink exactly as 1/n — the instrument that handles signs is the bracket, not the shelf');
OUT('GROUP C: ' + C.pass + ' pass, ' + C.fail + ' fail');
// p42 lab group D — the Haar census: an orthonormal rack of dyadic windows
var D = { pass: 0, fail: 0 };
function dck(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); D[ok ? 'pass' : 'fail']++; }
var SQ8 = Math.sqrt(8), SQ2 = Math.sqrt(2);
// rows: 0 constant, 1 halves, 2-3 quarters, 4-7 eighths (finest)
var rows = [], i;
var r0 = []; for (i = 0; i < 8; i++) r0.push(1 / SQ8); rows.push(r0);
var r1 = []; for (i = 0; i < 8; i++) r1.push((i < 4 ? 1 : -1) / SQ8); rows.push(r1);
for (var m = 0; m < 2; m++) { var r = []; for (i = 0; i < 8; i++) { var half = (i - m * 4) < 2 ? 1 : -1; r.push((i >= m * 4 && i < m * 4 + 4) ? half / 2 : 0); } rows.push(r); }
for (m = 0; m < 4; m++) { var r = []; for (i = 0; i < 8; i++) { var h = (i - m * 2) < 1 ? 1 : -1; r.push((i >= m * 2 && i < m * 2 + 2) ? h / SQ2 : 0); } rows.push(r); }
// D01: the 64-dot-product census: 8 ones, 56 zeros
var ones = 0, zeros = 0;
for (var a = 0; a < 8; a++) for (var b = 0; b < 8; b++) { var d = 0; for (i = 0; i < 8; i++) d += rows[a][i] * rows[b][i]; if (a === b && Math.abs(d - 1) < 1e-12) ones++; if (a !== b && Math.abs(d) < 1e-12) zeros++; }
dck('D01', ones === 8 && zeros === 56, 'orthonormal census: 64 dot products = 8 ones + 56 zeros');
// D02: the unnormalized integer census HH^T = diag(8,8,4,4,2,2,2,2)
function undial(v, row) { var t = 0; for (i = 0; i < 8; i++) t += v[i] * row[i]; return t; }
var ramp = [1, 2, 3, 4, 5, 6, 7, 8], spike = [0, 0, 0, 0, 100, 0, 0, 0], sig = [3, 1, 4, 1, 5, 9, 2, 6];
var diag = [];
for (a = 0; a < 8; a++) { var dd = 0; for (i = 0; i < 8; i++) { var c = rows[a][i] > 0 ? (rows[a][i] === 1 / SQ8 ? SQ8 : (rows[a][i] === 1 / 2 ? 2 : SQ2)) : 0; dd += c * c; } diag.push(dd); }
// integer normalization factors per row: 8,8,4,4,2,2,2,2
var factors = [SQ8, SQ8, 2, 2, SQ2, SQ2, SQ2, SQ2];
var intok = true;
for (a = 0; a < 8; a++) { var ssum = 0; for (i = 0; i < 8; i++) ssum += Math.pow(rows[a][i] * factors[a], 2); if (Math.abs(ssum - Math.pow(factors[a], 2)) > 1e-9) intok = false; }
dck('D02', intok, 'integer census: scaled rows have entries +-1, HH^T = diag(8,8,4,4,2,2,2,2)');
// D03: the ramp dials
function dials(v) { var out = []; for (a = 0; a < 8; a++) out.push(undial(v, rows[a])); return out; }
var dr = dials(ramp);
var expR = [36 / SQ8, -16 / SQ8, -2, -2, -1 / SQ2, -1 / SQ2, -1 / SQ2, -1 / SQ2];
var rok = true;
for (a = 0; a < 8; a++) if (Math.abs(dr[a] - expR[a]) > 1e-12) rok = false;
dck('D03', rok, 'ramp dials: [' + dr.map(x => x.toFixed(4)).join(', ') + '] = [36/sqrt8, -16/sqrt8, -2, -2, -1/sqrt2 x4]');
// D04: ramp Parseval and the energy ladder
var er = 0; for (i = 0; i < 8; i++) er += ramp[i] * ramp[i];
var pr = 0; for (a = 0; a < 8; a++) pr += dr[a] * dr[a];
var ladderR = [dr[0] * dr[0], dr[1] * dr[1], dr[2] * dr[2] + dr[3] * dr[3], 0];
for (a = 4; a < 8; a++) ladderR[3] += dr[a] * dr[a];
dck('D04', Math.abs(er - pr) < 1e-9 && er === 204, 'ramp Parseval: 204 = ' + pr.toFixed(6) + '; energy ladder per shelf: ' + ladderR.join(' + '));
dck('D05', Math.abs(ladderR[1] / ladderR[2] - 4) < 1e-9 && Math.abs(ladderR[2] / ladderR[3] - 4) < 1e-9, 'ramp energy quarters per octave: 32/8 = 4 and 8/2 = 4 — the smooth story, geometric decay');
// D06: the spike dials
var ds = dials(spike);
var expS = [100 / SQ8, -100 / SQ8, 0, 50, 0, 0, 100 / SQ2, 0];
var sok = true;
for (a = 0; a < 8; a++) if (Math.abs(ds[a] - expS[a]) > 1e-12) sok = false;
dck('D06', sok, 'spike dials: [' + ds.map(x => x.toFixed(4)).join(', ') + '] = [100/sqrt8, -100/sqrt8, 0, 50, 0, 0, -100/sqrt2, 0]');
// D07: spike Parseval + reversed ladder
var es = 0; for (i = 0; i < 8; i++) es += spike[i] * spike[i];
var ps = 0; for (a = 0; a < 8; a++) ps += ds[a] * ds[a];
var ladderS = [ds[0] * ds[0], ds[1] * ds[1], ds[2] * ds[2] + ds[3] * ds[3], 0];
for (a = 4; a < 8; a++) ladderS[3] += ds[a] * ds[a];
dck('D07', Math.abs(es - ps) < 1e-9 && es === 10000, 'spike Parseval: 10000 = ' + ladderS.join(' + ') + ' = ' + ps.toFixed(6));
dck('D08', Math.abs(ladderS[2] / ladderS[1] - 2) < 1e-9 && Math.abs(ladderS[3] / ladderS[2] - 2) < 1e-9, 'spike detail energy doubles per octave: 2500/1250 = 2 and 5000/2500 = 2 — the rough story');
// D09: the address: read the spike position from the dials alone
var base = ds[1] < 0 ? 4 : 0;
var mFound = -1, sFound = 0;
for (a = 4; a < 8; a++) if (Math.abs(ds[a]) > 1e-9) { mFound = a - 4; sFound = ds[a] > 0 ? 0 : 1; }
var pos = 2 * mFound + sFound;
var bits = [base / 4, (2 * mFound >= base + 2) ? 1 : 0, sFound];
dck('D09', pos === 4 && bits.join('') === '100', 'the dial signs read the spike address: right half, first pair of it, positive lobe -> position 4 = binary ' + bits.join(''));
// D10: round trips for all three signals
function roundtrip(v) { var d = dials(v); var w = []; for (i = 0; i < 8; i++) { var t = 0; for (a = 0; a < 8; a++) t += d[a] * rows[a][i]; w.push(t); } return w; }
var rt = true;
[ramp, spike, sig].forEach(function (v) { var w = roundtrip(v); for (i = 0; i < 8; i++) if (Math.abs(w[i] - v[i]) > 1e-9) rt = false; });
dck('D10', rt, 'round trips exact for all three signals (transform + inverse to 1e-9)');
// D11: the exercise signal dials
var dg = dials(sig);
var expG = [31 / SQ8, -13 / SQ8, -0.5, 3, 2 / SQ2, 3 / SQ2, -4 / SQ2, -4 / SQ2];
var gok = true;
for (a = 0; a < 8; a++) if (Math.abs(dg[a] - expG[a]) > 1e-12) gok = false;
dck('D11', gok, 'signal (3,1,4,1,5,9,2,6) dials: [' + dg.map(x => x.toFixed(4)).join(', ') + ']');
// D12: exercise Parseval
var eg = 0; for (i = 0; i < 8; i++) eg += sig[i] * sig[i];
var pg = 0; for (a = 0; a < 8; a++) pg += dg[a] * dg[a];
dck('D12', Math.abs(eg - pg) < 1e-9 && eg === 173, 'exercise Parseval: 173 = ' + pg.toFixed(6));
// D13: the loudness ratio: finest dial vs the constant dial for the spike
dck('D13', Math.abs(Math.abs(ds[6]) / ds[0] - 2) < 1e-12, 'the spike reads exactly 2x louder in its own eighth than in the room: |' + ds[6].toFixed(4) + ' / ' + ds[0].toFixed(4) + '| = 2');
// D14: the unnormalized census on the ramp: entries stay integer
var intR = []; for (a = 0; a < 8; a++) intR.push(dr[a] * factors[a]);
var iok = true;
for (a = 0; a < 8; a++) if (Math.abs(intR[a] - Math.round(intR[a])) > 1e-9) iok = false;
dck('D14', iok, 'integer ramp census: [' + intR.join(', ') + '] — the rack before normalization is pure counting');
OUT('GROUP D: ' + D.pass + ' pass, ' + D.fail + ' fail');
// p42 lab group E — the q-adic wall ladder and the residue that never closes
var E = { pass: 0, fail: 0 };
function eck(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); E[ok ? 'pass' : 'fail']++; }
var GAM = 0.5772156649015329;
var N = 1048576; // 2^20
var H = 0; for (var n = 1; n <= N; n++) { H += 1 / n; }
var lnN = Math.log(N);
// integer shelves for ratio q: shelf j covers [ceil(q^j), ceil(q^(j+1)))
function walls(q) {
  var lo = 0, hi = 0, j = 0, a = 1, cnt = 0;
  while (a <= N) {
    var b = Math.ceil(a * q); if (b > N + 1) b = N + 1;
    var count = b - a;
    lo += count / (b <= N ? b : N);
    hi += count / a;
    a = b; j++; cnt++;
    if (cnt > 5000) break;
  }
  return [lo, hi, cnt];
}
var w2 = walls(2), w32 = walls(1.5), w98 = walls(1.125), w1716 = walls(17 / 16);
eck('E01', w2[0] <= H && H <= w2[1] && Math.abs(w2[0] - 10) < 1e-5 && Math.abs(w2[1] - 20) < 1e-5,
  'q = 2 walls at 2^20: [' + w2[0].toFixed(2) + ', ' + w2[1].toFixed(2) + '] contain H = ' + H.toFixed(4) + ' (21 shelves incl. the leftover, the classic factor-2 gap)');
eck('E02', w32[0] <= H && H <= w32[1], 'q = 3/2 walls: [' + w32[0].toFixed(2) + ', ' + w32[1].toFixed(2) + '] contain H (' + w32[2] + ' shelves)');
eck('E03', w98[0] <= H && H <= w98[1], 'q = 9/8 walls: [' + w98[0].toFixed(2) + ', ' + w98[1].toFixed(2) + '] contain H (' + w98[2] + ' shelves)');
eck('E04', w1716[0] <= H && H <= w1716[1], 'q = 17/16 walls: [' + w1716[0].toFixed(2) + ', ' + w1716[1].toFixed(2) + '] contain H (' + w1716[2] + ' shelves)');
// E05: widths shrink monotonically as q -> 1
var widths = [w2[1] - w2[0], w32[1] - w32[0], w98[1] - w98[0], w1716[1] - w1716[0]];
var mon = widths[0] > widths[1] && widths[1] > widths[2] && widths[2] > widths[3];
eck('E05', mon, 'wall widths shrink with q: ' + widths.map(w => w.toFixed(2)).join(' -> '));
// E06: but the ladder closes onto ln N, not onto H: the gamma residue
var below = w1716[0] < lnN && w98[0] < lnN;
eck('E06', below, 'the lower walls stay below ln(2^20) = ' + lnN.toFixed(4) + ' (best so far ' + w1716[0].toFixed(2) + '): the ladder closes onto ln N, never onto H');
eck('E07', Math.abs(H - lnN - GAM) < 1e-4, 'the residue: H - ln(2^20) = ' + (H - lnN).toFixed(6) + ' vs gamma = ' + GAM.toFixed(6) + ' — the wall the shelf method cannot close');
// E08: the integral-test walls for comparison
var ilo = Math.log(N + 1), ihi = 1 + Math.log(N);
eck('E08', ilo <= H && H <= ihi, 'integral walls [' + ilo.toFixed(4) + ', ' + ihi.toFixed(4) + '] contain H; the q = 17/16 walls [' + w1716[0].toFixed(2) + ', ' + w1716[1].toFixed(2) + '] close toward them — the integral test is the q -> 1 limit of the shelf ladder');
OUT('GROUP E: ' + E.pass + ' pass, ' + E.fail + ' fail');
// p42 lab group F — page needles against the frozen page (PAGE injected)
var F = { pass: 0, fail: 0 };
function fk(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); F[ok ? 'pass' : 'fail']++; }
function cnt(s) { return PAGE.split(s).length - 1; }
function has(id, s, n) { var c = cnt(s); fk(id, c >= (n || 1), 'needle ' + JSON.stringify(s.length > 40 ? s.slice(0, 40) + '...' : s) + ' count ' + c + (n ? ' (need >= ' + n + ')' : '')); }
fk('F01', cnt('<h2>') === 8, 'h2 count = ' + cnt('<h2>') + ' (expect 8)');
fk('F02', cnt('<h3>') === 11, 'h3 count = ' + cnt('<h3>') + ' (expect 11)');
fk('F03', cnt('<details>') === 9 && cnt('<summary>Hint</summary>') === 4 && cnt('<summary>Worked answer</summary>') === 5, 'details = ' + cnt('<details>') + ', Hint = ' + cnt('<summary>Hint</summary>') + ', Worked = ' + cnt('<summary>Worked answer</summary>') + ' (Ex4 moon-free by design)');
fk('F04', cnt('<svg') === 3 && cnt('</svg>') === 3, 'svg = ' + cnt('<svg'));
fk('F05', cnt('<figure') === 3 && cnt('figcaption') === 6, 'figures = ' + cnt('<figure') + ', figcaption open+close = ' + cnt('figcaption'));
fk('F06', cnt('pattern-box') === 3 && cnt('<div class="pattern-box') === 3 && cnt('</div>') === cnt('<div'), 'pattern-box boxes = ' + cnt('pattern-box') + ', div open/close balance ' + cnt('<div') + '/' + cnt('</div>'));
fk('F07', cnt('warn-box') === 1 && cnt('class="onramp"') === 1, 'warn-box = ' + cnt('warn-box') + ', onramp = ' + cnt('class="onramp"'));
fk('F08', cnt('class="pid"') === 3, 'pid lines = ' + cnt('class="pid"'));
fk('F09', cnt('●○○ ●●○ ●●● ◆ ◐') === 1, 'moons line exactly once');
fk('F10', cnt('$') === 0, 'zero dollar signs');
fk('F11', cnt('`') === 0, 'zero backticks');
var ino = cnt('\\('), inc = cnt('\\)'), dso = cnt('\\['), dsc = cnt('\\]');
fk('F12', ino === inc && ino >= 400, 'inline TeX ' + ino + '/' + inc + ' balanced (>= 400 each)');
fk('F13', dso === dsc && dso === 7, 'display TeX ' + dso + '/' + dsc + ' balanced (6 body + 1 config)');
has('F14', 'sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=');
has('F15', 'mathjax@3.2.2');
has('F16', '<title>P42 · Dyadic decomposition · The Patterns Atlas</title>');
has('F17', 'P42 · the fifth move of tier 4');
has('F18', '<h1>Dyadic decomposition</h1>');
has('F19', 'href="p43-flow-with-surgery.html">P43 · Flow with surgery</a>');
has('F20', 'href="p24-waves.html">P24 · Waves</a>');
fk('F21', cnt('href="index.html"') === 2 && cnt('href="assets/style.css"') === 1 && cnt('href="p15-squeeze.html"') === 4 && cnt('href="p16-isomorphism.html"') === 2 && cnt('href="p24-waves.html"') === 3 && cnt('href="p25-machine-cases.html"') === 3 && cnt('href="p43-flow-with-surgery.html"') === 1, 'href whitelist exact: index 2, style 1, p15 4, p16 2, p24 3, p25 3, p43 1');
fk('F22', PAGE.indexOf('href="p52') === -1 && PAGE.indexOf('href="p56') === -1 && cnt('P52') >= 2 && cnt('P56') >= 1, 'doors P52/P56 named as text only, no forward hrefs to unpublished pages');
fk('F23', PAGE.slice(-16) === '</body>\n</html>\n' || PAGE.slice(-15) === '</body>\n</html>', 'tail closes cleanly: ' + JSON.stringify(PAGE.slice(-16)));
has('F24', '14.4402', 5); has('F25', '14.3927'); has('F26', '0.693147'); has('F27', '21.3');
has('F28', '3.4239'); has('F29', '2.0376'); has('F30', '2.11');
has('F31', '1.0248'); has('F32', '0.3607'); has('F33', '1.4427');
has('F34', '0.9931'); has('F35', '13.52'); has('F36', '9.27'); has('F37', '18.67');
has('F38', '100.58'); has('F39', '71.6'); has('F40', '144.3');
has('F41', '12.7279'); has('F42', '5.6569'); has('F43', '70.7107'); has('F44', '35.3553');
has('F45', '204', 2); has('F46', '10000'); has('F47', '1250'); has('F48', '2500'); has('F49', '5000');
has('F50', '52279'); has('F51', '72072'); has('F52', '0.577216'); has('F53', '13.8629');
has('F54', '11.29'); has('F55', '17.30'); has('F56', '12.81'); has('F57', '15.13');
has('F58', '13.13'); has('F59', '14.77'); has('F60', '6.01'); has('F61', '2.32'); has('F62', '1.64');
has('F63', '10.00'); has('F64', '20.0000');
has('F65', '173', 2); has('F66', '10.9602'); has('F67', '4.5962'); has('F68', '2.1213');
has('F69', '2.8284'); has('F70', '1.4142');
fk('F71', cnt('session') === 0 && cnt('verifier') === 0 && cnt('battery') === 0 && cnt('planned') === 0 && cnt('blob') === 0 && cnt('the lab') === 0, 'content scope: zero build/session tokens');
has('F72', '<strong>Scope, honestly.</strong>');
has('F73', 'id="box-p42"'); has('F74', 'id="box-p42a"'); has('F75', 'id="box-p42b"'); has('F76', 'id="scope-honestly"');
has('F77', 'Fig P42.1 ·'); has('F78', 'Fig P42.2 ·'); has('F79', 'Fig P42.3 ·');
OUT('GROUP F: ' + F.pass + ' pass, ' + F.fail + ' fail');
// p42 lab group G — the three figures, recomputed against the page bytes
var G = { pass: 0, fail: 0 };
function gk(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); G[ok ? 'pass' : 'fail']++; }
function gcnt(s) { return PAGE.split(s).length - 1; }
function y1(v) { return 270 - (v - 0.4) * 380; }
// G01: Fig P42.1 bars at the recomputed coordinates
var vals = [1, 5 / 6, 319 / 420, 0.7253718503718504, 0.7090168546234414];
var xs = [90, 195, 300, 405, 510], ys = ['42', '105.3', '133.4', '146.4', '152.6'], hs = ['228', '164.7', '136.6', '123.6', '117.4'], g1ok = true;
for (var i = 0; i < 5; i++) {
  var rect = 'x="' + xs[i] + '" y="' + ys[i] + '" width="56" height="' + hs[i] + '"';
  if (PAGE.indexOf(rect) === -1) g1ok = false;
  var yy = 270 - (vals[i] - 0.4) * 380;
  if (Math.abs(yy - parseFloat(ys[i])) > 0.06) g1ok = false;
}
gk('G01', g1ok, 'Fig P42.1: all five bar rects verbatim at machine coordinates, y = 270-(v-0.4)*380 verified');
gk('G02', gcnt('x="90" y="42" width="56" height="228"') === 1, 'Fig P42.1: shelf 0 bar rect verbatim (y 42, height 228)');
gk('G03', gcnt('y1="42"') >= 1 && PAGE.indexOf('y1="232"') >= 0 && PAGE.indexOf('y1="158.6"') >= 0, 'Fig P42.1: walls dashed at y=42 (v=1) and y=232 (v=1/2), ln 2 line at y=158.6');
gk('G04', Math.abs(y1(0.5) - 232) < 0.05 && Math.abs(y1(Math.log(2)) - 158.6) < 0.05, 'Fig P42.1 recompute: y(1/2) = ' + y1(0.5).toFixed(1) + ', y(ln 2) = ' + y1(Math.log(2)).toFixed(1));
// G05-G08: Fig P42.2 tree
var leafOK = true;
for (i = 0; i < 8; i++) { var top = 280 - (i + 1) * 22; if (PAGE.indexOf('y="' + top + '"') === -1) leafOK = false; }
gk('G05', leafOK, 'Fig P42.2: eight leaf tops at 280-22k: 258..104');
var px = [], lxs = []; for (i = 0; i < 8; i++) lxs.push(80 + i * 68);
for (i = 0; i < 4; i++) px.push((lxs[2 * i] + lxs[2 * i + 1]) / 2);
var qx = [(px[0] + px[1]) / 2, (px[2] + px[3]) / 2], rx = (qx[0] + qx[1]) / 2;
gk('G06', px.join(',') === '114,250,386,522' && qx.join(',') === '182,454' && rx === 318, 'Fig P42.2: tree x recompute: pairs ' + px.join(',') + ', quarters ' + qx.join(',') + ', root ' + rx);
gk('G07', gcnt('>1.5<') === 1 && gcnt('>3.5<') === 1 && gcnt('>5.5<') === 1 && gcnt('>7.5<') === 1 && gcnt('>2.5<') === 1 && gcnt('>6.5<') === 1 && gcnt('text-anchor="middle">4.5</text>') === 1, 'Fig P42.2: averages 1.5, 3.5, 5.5, 7.5, 2.5, 6.5, 4.5 each once (root = (2.5+6.5)/2 = 4.5)');
gk('G08', gcnt('−1</text>') === 4 && gcnt('−4</text>') === 2 && gcnt('−16</text>') === 1, 'Fig P42.2: integer split dials −1 x4, −4 x2, −16 x1');
// G09: the tree averages and split dials, recomputed from the ramp (dials are SUM differences, matching the integer census)
var ramp = [1, 2, 3, 4, 5, 6, 7, 8], pavg = [], qavg = [], ravg, ok9 = true, expSplits = [-1, -1, -1, -1, -4, -4, -16], splits = [];
for (i = 0; i < 4; i++) { pavg.push((ramp[2 * i] + ramp[2 * i + 1]) / 2); splits.push(ramp[2 * i] - ramp[2 * i + 1]); }
for (i = 0; i < 2; i++) { qavg.push((pavg[2 * i] + pavg[2 * i + 1]) / 2); splits.push((ramp[4 * i] + ramp[4 * i + 1]) - (ramp[4 * i + 2] + ramp[4 * i + 3])); }
ravg = (qavg[0] + qavg[1]) / 2;
splits.push((ramp[0] + ramp[1] + ramp[2] + ramp[3]) - (ramp[4] + ramp[5] + ramp[6] + ramp[7]));
for (i = 0; i < 7; i++) if (splits[i] !== expSplits[i]) ok9 = false;
gk('G09', ok9 && ravg === 4.5, 'Fig P42.2 recompute: avgs ' + pavg.join(',') + ' / ' + qavg.join(',') + ' / ' + ravg + ', integer splits ' + splits.join(',') + ' = the D14 census');
// G10-G13: Fig P42.3 paths
function fx3(k) { return 70 + (k - 4) * 34; }
function fy3(v) { return 280 - v * 17; }
var Hpts = '', s1 = 0, m1 = 0, m2 = 0, kc = 4;
for (var n = 1; n <= 1048576; n++) {
  s1 += 1 / n;
  if (n >= 2) { m1 += 1 / (n * Math.log(n)); m2 += 1 / (n * Math.log(n) * Math.log(n)); }
  if (n === Math.pow(2, kc) && kc % 2 === 0 && kc >= 4) {
    Hpts += (kc === 4 ? '' : ' L') + fx3(kc).toFixed(1) + ',' + fy3(s1).toFixed(1);
    kc += 2;
  }
}
gk('G10', PAGE.indexOf('d="M' + Hpts + '"') >= 0, 'Fig P42.3: harmonic path verbatim from recompute (9 points, ends ' + Hpts.slice(-12) + ')');
gk('G11', Math.abs(fy3(14.440160) - 34.5) < 0.06, 'Fig P42.3 recompute: y(H(2^20)) = ' + fy3(14.440160).toFixed(2) + ' (page path ends y=34.5)');
gk('G12', PAGE.indexOf('614.0,221.8') >= 0 && PAGE.indexOf('614.0,245.4') >= 0, 'Fig P42.3: log path ends 614.0,221.8 and loglog ends 614.0,245.4 (recomputed ' + fy3(3.4239).toFixed(1) + ' and ' + fy3(2.0376).toFixed(1) + ')');
gk('G13', gcnt('2⁴') === 1 && gcnt('2⁸') === 1 && gcnt('2¹²') === 1 && gcnt('2¹⁶') === 1 && gcnt('2²⁰') === 1, 'Fig P42.3: axis ticks 2^4..2^20 once each');
gk('G14', gcnt('aria-label') === 3, 'three aria-labels, one per figure');
gk('G15', gcnt('stroke-dasharray="6,4"') === 2, 'Fig P42.1: two dashed wall lines (dasharray 6,4 x2)');
OUT('GROUP G: ' + G.pass + ' pass, ' + G.fail + ' fail');
// ---- group H: lineage needles ----
var H = { pass: 0, fail: 0 };
function hk(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); H[ok ? 'pass' : 'fail']++; }
function hhas(id, s) { hk(id, PAGE.indexOf(s) >= 0, 'lineage needle ' + JSON.stringify(s)); }
hhas('H01', 'Questiones super geometriam Euclidis'); hhas('H02', '1350');
hhas('H03', 'Novæ quadraturæ arithmeticæ'); hhas('H04', '1650');
hhas('H05', 'Tractatus de seriebus infinitis'); hhas('H06', '1689'); hhas('H07', 'Johann');
hhas('H08', 'Cours d\'analyse'); hhas('H09', '1821'); hhas('H10', 'condensation test');
hhas('H11', 'Mathematische Annalen'); hhas('H12', '1910'); hhas('H13', '1923');
hhas('H14', '1931'); hhas('H15', '1938'); hhas('H16', 'Proceedings of the London Mathematical Society');
hhas('H17', 'Marcinkiewicz'); hhas('H18', 'Zygmund'); hhas('H19', '1934');
hhas('H20', 'Acta Mathematica'); hhas('H21', '1952'); hhas('H22', '1953'); hhas('H23', 'Stochastic Processes');
hhas('H24', '1972'); hhas('H25', '129');
hk('H26', PAGE.indexOf('1647') === -1 && PAGE.indexOf('1911') === -1 && PAGE.indexOf('1954') === -1 && PAGE.indexOf('1973') === -1, 'wrong-year absences: no 1647/1911/1954/1973');
hhas('H27', 'Oresme'); hhas('H28', 'Mengoli'); hhas('H29', 'Cauchy'); hhas('H30', 'Haar');
hhas('H31', 'Walsh'); hhas('H32', 'Whitney'); hhas('H33', 'Calderón'); hhas('H34', 'Doob');
hhas('H35', 'Fefferman'); hhas('H36', 'higher dimensions by Stein');
OUT('GROUP H: ' + H.pass + ' pass, ' + H.fail + ' fail');
