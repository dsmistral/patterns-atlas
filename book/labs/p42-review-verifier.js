// p42 adversarial verifier — piece 1: fresh numeric engines (zero code shared with the lab)
var V = { pass: 0, fail: 0 };
function vk(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); V[ok ? 'pass' : 'fail']++; }
// fresh engine 1: Kahan compensated summation for H(2^20) and H(10^6)
function kahan(f, N) { var s = 0, c = 0; for (var n = 1; n <= N; n++) { var y = f(n) - c, t = s + y; c = (t - s) - y; s = t; } return s; }
var GAM = 0.5772156649015329;
var kh = kahan(function (n) { return 1 / n; }, 1048576);
vk('V01', Math.abs(kh - 14.440160) < 1e-5 && Math.abs(kh - (20 * Math.log(2) + GAM)) < 1e-4, 'Kahan H(2^20) = ' + kh.toFixed(6) + ', Euler-Maclaurin cross-check 20 ln 2 + gamma = ' + (20 * Math.log(2) + GAM).toFixed(6));
var km = kahan(function (n) { return 1 / n; }, 1000000);
vk('V02', Math.abs(km - 14.3927267) < 1e-6, 'Kahan H(10^6) = ' + km.toFixed(7) + ' (page receipt 14.3927)');
// fresh engine 2: shelves summed BACKWARD (top of each shelf down), independent of lab's forward blocks
var pw2 = [1]; for (var j = 1; j <= 21; j++) pw2.push(pw2[j - 1] * 2);
var bsh = [];
for (j = 0; j < 20; j++) { var b = 0; for (var n = pw2[j + 1] - 1; n >= pw2[j]; n--) { b += 1 / n; } bsh.push(b); }
var ok3 = true;
for (j = 0; j < 20; j++) { if (!(bsh[j] > 0.5 && bsh[j] <= 1)) ok3 = false; }
for (j = 1; j < 20; j++) { if (!(bsh[j] < bsh[j - 1])) ok3 = false; }
vk('V03', ok3, 'backward shelf census: 20 shelves in (1/2, 1], strictly decreasing, S_19 = ' + bsh[19].toFixed(7));
vk('V04', bsh[2] > 0.75952 && bsh[2] < 0.75953, 'shelf 2 by backward summation = ' + bsh[2].toFixed(6) + ' (= 319/420 = 0.759524)');
// exact integer check of the 319/420 receipt: 105+84+70+60
vk('V05', 105 + 84 + 70 + 60 === 319 && (105 + 84 + 70 + 60) / 420 === 319 / 420, 'the tombstone fraction by integers: (105+84+70+60)/420 = 319/420');
// fresh engine 3: the alternating harmonic via PAIRING (no sign loop): sum 1/((2k-1)(2k))
var ps = 0; for (var k = 1; k <= 524288; k++) { ps += 1 / ((2 * k - 1) * (2 * k)); }
vk('V06', Math.abs(ps - Math.log(2)) < 2e-6, 'paired alternating harmonic to 2^20 = ' + ps.toFixed(6) + ' vs ln 2 = ' + Math.log(2).toFixed(6));
// fresh engine 4: log series via partial sum + Euler-Maclaurin tail (sum to 2^12, add analytic tail)
function sumTo(f, N) { var s = 0; for (var n = 2; n <= N; n++) s += f(n); return s; }
var N1 = 4096;
var part = sumTo(function (n) { return 1 / (n * Math.log(n)); }, N1);
var tail = (Math.log(Math.log(1048576)) - Math.log(Math.log(N1))) + 0.5 * (1 / (1048576 * Math.log(1048576)) - 1 / (N1 * Math.log(N1)));
var est = part + tail;
vk('V07', est > 3.39 && est < 3.46, 'log series by partial+integral tail = ' + est.toFixed(4) + ' (machine full-sum receipt 3.4239)');
var part2 = sumTo(function (n) { return 1 / (n * Math.log(n) * Math.log(n)); }, N1);
var tail2 = 1 / Math.log(N1) - 1 / Math.log(1048576) - 0.5 * (1 / (1048576 * Math.log(1048576) * Math.log(1048576)) - 1 / (N1 * Math.log(N1) * Math.log(N1)));
var est2 = part2 + tail2;
vk('V08', est2 > 1.99 && est2 < 2.09, 'convergent cousin by partial+tail = ' + est2.toFixed(4) + ' (machine receipt 2.0376 at 2^20, total near 2.11)');
// fresh engine 5: q-ladder walls by the closed form ((q-1)/q and (q-1) times ln N / ln q)
var lnN = Math.log(1048576);
var qs = [2, 1.5, 1.125, 17 / 16], ok9 = true, walls9 = [];
var pageW = [[10.00, 20.00], [11.29, 17.30], [12.81, 15.13], [13.13, 14.77]];
for (var t = 0; t < 4; t++) {
  var q = qs[t], lo = (q - 1) / q * lnN / Math.log(q), hi = (q - 1) * lnN / Math.log(q);
  walls9.push('q=' + q + ': [' + lo.toFixed(2) + ', ' + hi.toFixed(2) + ']');
  // integer shelving makes the page's walls WIDER: the smooth closed form must sit inside them
  if (lo < pageW[t][0] - 0.02 || hi > pageW[t][1] + 0.02) ok9 = false;
  if (q === 2 && (Math.abs(lo - 10) > 0.01 || Math.abs(hi - 20) > 0.01)) ok9 = false;
}
vk('V09', ok9, 'q-walls by closed form: ' + walls9.join('; ') + ' — sit inside the page\'s integer-shelved receipts (integer shelving widens)');
vk('V10', Math.abs((1 - 1 / 1.5) * lnN / Math.log(1.5) - 11.29) < 0.35 && Math.abs(0.5 * lnN / Math.log(1.5) - 17.30) < 0.35, 'q = 3/2 closed form [' + ((1 / 3) * lnN / Math.log(1.5)).toFixed(2) + ', ' + (0.5 * lnN / Math.log(1.5)).toFixed(2) + '] vs page [11.29, 17.30] within integer slop');
vk('V11', Math.abs(kh - lnN - GAM) < 1e-6, 'the residue by Kahan: H - ln(2^20) = ' + (kh - lnN).toFixed(6) + ' = gamma (page: 0.577216)');
OUT('VERIFIER PIECE 1: ' + V.pass + ' pass, ' + V.fail + ' fail');
// p42 adversarial verifier — piece 2: Haar by tensor ladder + needle panel
var V2 = { pass: 0, fail: 0 };
function wk(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); V2[ok ? 'pass' : 'fail']++; }
// fresh engine 6: the 8x8 Haar rack via the standard recursive ladder (no per-row hand assembly, unlike the lab)
var r2 = Math.SQRT2;
// sequency-ordered ladder (matches the page: constant, then support-8, support-4 x2, support-2 x4):
// coarse rows STRETCH row k of haar(n/2) by 2 (entry j -> positions 2j, 2j+1); fine rows are the identity pairs.
function haar(n) {
  if (n === 2) return [[1 / r2, 1 / r2], [1 / r2, -1 / r2]];
  var sub = haar(n / 2), half = n / 2, Hn = [], k, i, row;
  for (k = 0; k < half; k++) { row = []; for (i = 0; i < n; i++) row.push(sub[k][Math.floor(i / 2)] / Math.SQRT2); Hn.push(row); }
  for (k = 0; k < half; k++) { row = []; for (i = 0; i < n; i++) row.push((Math.floor(i / 2) === k ? (i % 2 === 0 ? 1 : -1) : 0) / Math.SQRT2); Hn.push(row); }
  return Hn;
}
// NOTE: recursion depth 2 (haar(8)->haar(4)->haar(2)) is within the allowed depth.
var H8 = haar(8);
var ones = 0, zeros = 0;
for (var a = 0; a < 8; a++) for (var b = 0; b < 8; b++) { var d = 0; for (var i = 0; i < 8; i++) d += H8[a][i] * H8[b][i]; if (a === b && Math.abs(d - 1) < 1e-12) ones++; if (a !== b && Math.abs(d) < 1e-12) zeros++; }
wk('V12', ones === 8 && zeros === 56, 'tensor-ladder rack orthonormal: 8 ones + 56 zeros of 64');
function dial(v) { var o = []; for (a = 0; a < 8; a++) { var t = 0; for (i = 0; i < 8; i++) t += v[i] * H8[a][i]; o.push(t); } return o; }
// row order in this ladder: constant, then sub-rows scaled — different order from the lab's; use value-multisets
var dr = dial([1, 2, 3, 4, 5, 6, 7, 8]);
var drS = dr.map(x => Math.round(x * 1e6) / 1e6).sort((x, y) => x - y).join(',');
var expR = [36 / Math.sqrt(8), -16 / Math.sqrt(8), -2, -2, -1 / Math.SQRT2, -1 / Math.SQRT2, -1 / Math.SQRT2, -1 / Math.SQRT2].map(x => Math.round(x * 1e6) / 1e6).sort((x, y) => x - y).join(',');
wk('V13', drS === expR, 'ramp dials by the ladder engine match the page list as a multiset: ' + drS);
var ds = dial([0, 0, 0, 0, 100, 0, 0, 0]);
var dsS = ds.map(x => Math.round(x * 1e6) / 1e6).sort((x, y) => x - y).join(',');
var expS = [100 / Math.sqrt(8), -100 / Math.sqrt(8), 0, 50, 0, 0, 100 / Math.SQRT2, 0].map(x => Math.round(x * 1e6) / 1e6).sort((x, y) => x - y).join(',');
wk('V14', dsS === expS, 'spike dials by the ladder engine match: ' + dsS);
var pr = 0; for (a = 0; a < 8; a++) pr += dr[a] * dr[a];
var ps2 = 0; for (a = 0; a < 8; a++) ps2 += ds[a] * ds[a];
wk('V15', Math.abs(pr - 204) < 1e-9 && Math.abs(ps2 - 10000) < 1e-9, 'Parseval by the ladder engine: 204 and 10000');
// the address, read by the ladder engine's own sign walk
var finest = ds.slice(); // rows 4..7 in lab order differ; find max |dial| among non-constant rows
var maxD = 0, where = -1;
for (a = 1; a < 8; a++) { if (Math.abs(ds[a]) > maxD) { maxD = Math.abs(ds[a]); where = a; } }
wk('V16', maxD > 70 && maxD < 71, 'the loudest spike dial is the finest shelf: |' + maxD.toFixed(4) + '| = 100/sqrt(2) = 70.7107');
// needle panel: the page's own receipts, independently written
function pc(s) { return PAGE.split(s).length - 1; }
function pn(id, s, n) { var c = pc(s); wk(id, c >= (n || 1), 'page needle ' + JSON.stringify(s.slice(0, 34)) + ' x' + c); }
pn('V17', 'each shelf carries exactly \\(1\\)');
pn('V18', 'Bounds are walls; readings are poison');
pn('V19', 'the slowest divergence you will ever hold');
pn('V20', 'the dial signs walk the tree and read the spike\'s binary address');
pn('V21', 'position \\(4\\), which is binary \\(100\\)');
pn('V22', 'twice as loud in its own two-sample window');
pn('V23', 'the ladder\'s last rung is calculus');
pn('V24', 'no shelf ever carries as little as a half');
pn('V25', 'a feature of the method rather than a bug in the rulers');
pn('V26', 'the move, unnoticed, in every phone\'s every list');
pn('V27', 'five- and fourteen-digit denominators');
pn('V28', 'Euler\u2013Mascheroni');
pn('V29', 'file it by size');
wk('V30', pc('14.4402') === 5 && pc('3.4239') === 4 && pc('0.693147') === 4, 'receipt counts: 14.4402 x' + pc('14.4402') + ', 3.4239 x' + pc('3.4239') + ', 0.693147 x' + pc('0.693147'));
OUT('VERIFIER PIECE 2: ' + V2.pass + ' pass, ' + V2.fail + ' fail');
// p42 adversarial verifier — piece 3: poisoned clones, every one must be REJECTED
var V3 = { pass: 0, fail: 0 };
function xk(id, ok, msg) { OUT(id + (ok ? ' PASS' : ' FAIL') + (msg ? ' | ' + msg : '')); V3[ok ? 'pass' : 'fail']++; }
function inj(id, mutation, desc) {
  var clone = PAGE.split(mutation[0]).join(mutation[1]);
  var changed = clone !== PAGE;
  // the needle panel that must catch the poison
  var catches = [];
  function c(s) { return clone.split(s).length - 1; }
  if (c('14.4402') !== 5) catches.push('14.4402 count');
  if (c('3.4239') !== 4) catches.push('3.4239 count');
  if (c('0.693147') !== 4) catches.push('0.693147 count');
  if (c('319/420') < 1) catches.push('tombstone 319/420');
  if (c('each shelf carries exactly \\(1\\)') < 1) catches.push('fallacy quote');
  if (c('●○○ ●●○ ●●● ◆ ◐') !== 1) catches.push('moons');
  if (c('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') !== 1) catches.push('MathJax pin');
  if (c('1650') < 1) catches.push('Mengoli 1650');
  if (c('70.7107') < 1) catches.push('spike dial');
  if (c('204') < 2) catches.push('Parseval 204');
  if (c('0.577216') < 1) catches.push('gamma residue');
  if (c('five- and fourteen-digit denominators') !== 1) catches.push('caption denominators');
  if (c('the ladder\'s last rung is calculus') !== 1) catches.push('ladder rung');
  if (c('twice as loud in its own two-sample window') !== 1) catches.push('loudness');
  xk(id, changed && catches.length >= 1, desc + ' — REJECTED via: ' + catches.join(', '));
}
inj('V31', ['14.4402', '14.4403'], 'clone 1: H(2^20) receipt fudged 14.4402 -> 14.4403');
inj('V32', ['319/420', '320/420'], 'clone 2: the tombstone fraction fudged');
inj('V33', ['●○○ ●●○ ●●● ◆ ◐', '●○○ ●●○ ●●● ◆ ●'], 'clone 3: the difficulty moons tampered');
inj('V34', ['1650', '1647'], 'clone 4: Mengoli backdated to 1647');
inj('V35', ['70.7107', '70.7108'], 'clone 5: the spike dial fudged');
inj('V36', ['Parseval holds exactly — \\(204', 'Parseval holds exactly — \\(205'], 'clone 6: Parseval receipt fudged 204 -> 205');
inj('V37', ['0.577216', '0.577215'], 'clone 7: the gamma residue fudged');
inj('V38', ['the ladder\'s last rung is calculus', 'the ladder\'s last rung is algebra'], 'clone 8: the rung sentence doctored');
// control: the real page must pass the full panel
function cR(s) { return PAGE.split(s).length - 1; }
var controlOK = cR('14.4402') === 5 && cR('3.4239') === 4 && cR('0.693147') === 4 && cR('319/420') >= 1 && cR('●○○ ●●○ ●●● ◆ ◐') === 1 && cR('70.7107') >= 1 && cR('204') >= 2 && cR('0.577216') >= 1 && cR('five- and fourteen-digit denominators') === 1 && cR('the ladder\'s last rung is calculus') === 1 && cR('twice as loud in its own two-sample window') === 1 && cR('1650') >= 1 && cR('each shelf carries exactly \\(1\\)') >= 1 && cR('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') === 1;
xk('V39', controlOK, 'control: the real page passes the entire panel');
OUT('VERIFIER PIECE 3: ' + V3.pass + ' pass, ' + V3.fail + ' fail');
