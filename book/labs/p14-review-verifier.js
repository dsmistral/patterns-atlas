// p14-review-verifier.js — adversarial verifier for P14 "The diagonal argument"
// Fresh engine (no code shared with p14-lab): pi via arcsin series, e-2 via reverse-order
// factorial series, square roots via digit-pair schoolbook method, gamma via uncorrected
// harmonic difference at n=10^7, Fibonacci via Binet, sweep position via closed-form
// phi-sum. Gates: 10 fresh-engine checks, 24 needles (actual page bytes), 12 poisons
// (must be absent), 2 fresh controls, 6 doctored clones (must be rejected).
// Transcript: book/labs/p14-review-verifier-output.txt
function P14_VERIFY(page) {
  var log = [], fails = 0;
  var chk = function (name, cond) { log.push((cond ? 'PASS ' : 'FAIL ') + name); if (!cond) fails++; };
  var tdRow = function (s) { return '<td>' + s.split('').join('</td><td>') + '</td>'; };
  var ck = 1, p4 = 1, term = 0.5, asin = term;
  for (var k = 1; k < 30; k++) { ck = ck * (2 * k - 1) * (2 * k) / (k * k); p4 *= 4; term = ck * Math.pow(0.5, 2 * k + 1) / (p4 * (2 * k + 1)); asin += term; }
  var piF = 6 * asin;
  chk('v1 pi fresh (arcsin) agrees to 1e-11', Math.abs(piF - 3.1415926535897) < 1e-11);
  chk('v2 fresh pi-3 digits 1415926535 (td-separated on page)', Math.floor((piF - 3) * 1e10) === 1415926535 && page.indexOf(tdRow('1415926535')) >= 0);
  var fact = 1; for (var k2 = 1; k2 <= 25; k2++) fact *= k2;
  var e2 = 0, t = 1 / fact;
  for (var k3 = 25; k3 >= 2; k3--) { e2 += t; t *= k3; }
  chk('v3 e-2 fresh (reverse series, k=25..2) digits on page', Math.abs(e2 - 0.7182818284590) < 1e-11 && Math.floor(e2 * 1e10) === 7182818284 && page.indexOf(tdRow('7182818284')) >= 0);
  chk('v4 fresh e/10 digits 271828 (td-separated on page)', Math.floor((e2 + 2) / 10 * 1e6) === 271828 && page.indexOf(tdRow('271828')) >= 0);
  var schoolSqrt = function (v, steps) { var rem = 0, root = 0; var dig = String(v) + '0'.repeat(2 * steps); if (dig.length % 2 === 1) dig = '0' + dig; var pairs = []; for (var i = 0; i < dig.length; i += 2) pairs.push(parseInt(dig.slice(i, i + 2))); for (var j = 0; j < pairs.length; j++) { var pr = pairs[j]; rem = rem * 100 + pr; var d = 0; for (var cand = 9; cand >= 0; cand--) { if ((20 * root + cand) * cand <= rem) { d = cand; break; } } rem -= (20 * root + d) * d; root = root * 10 + d; } return root; };
  var r2 = schoolSqrt(2, 12), r3 = schoolSqrt(3, 12);
  chk('v5 sqrt2 fresh (digit-pair, odd-length padded) digits on page', r2 === 1414213562373 && Math.floor((r2 / 1e12 - 1) * 1e10) === 4142135623 && page.indexOf(tdRow('4142135623')) >= 0);
  chk('v6 sqrt3 fresh (digit-pair) sqrt3/2 digits on page', r3 === 1732050807568 && Math.floor((r3 / 1e12 / 2) * 1e10) === 8660254037 && page.indexOf(tdRow('8660254037')) >= 0);
  var H7 = 0; for (var k4 = 1; k4 <= 10000000; k4++) H7 += 1 / k4;
  var g7 = H7 - Math.log(10000000);
  chk('v7 gamma fresh (n=10^7, no correction) digits on page', Math.floor(g7 * 1e6) === 577215 && page.indexOf(tdRow('577215')) >= 0);
  var phi = (1 + Math.sqrt(5)) / 2;
  var fb = function (k) { return Math.round(Math.pow(phi, k) / Math.sqrt(5)); };
  var fbs = [1, 2, 3, 4, 5, 6].map(fb).join('');
  chk('v8 Fibonacci fresh (Binet) digits on page', fbs === '112358' && page.indexOf(tdRow('112358')) >= 0);
  var gcd = function (a, b) { while (b) { var t2 = b; b = a % b; a = t2; } return a; };
  var phiF = function (q) { var c = 0; for (var p = 1; p < q; p++) if (gcd(p, q) === 1) c++; return c; };
  var pos37 = 1; for (var q2 = 2; q2 <= 6; q2++) pos37 += phiF(q2); pos37 += 3;
  chk('v9 fresh closed-form position 3/7 = row 15 on page', pos37 === 15 && page.indexOf('in row \\(15\\)') >= 0);
  chk('v10 fresh 0.999 truncation identity K=15', (Math.pow(10, 15) - 1) / Math.pow(10, 15) === 1 - 1 / Math.pow(10, 15));
  var needles = ['the census taker','digit-flip machine','shadow number','or-\\(2\\) rule','3, 4, 8, 5, 0, 6, 4, 6','0.11111111','0.111211','2, 3, 2, 1, 2, 5','in row \\(15\\)','D = \\{1\\}','512','Je le vois, mais je ne le crois pas','16 June 1902','Application of the diagonal process','no set whose cardinality is strictly between','the skeptic','phantom diagonal','costume trap','three demands','A numbered claim.','no top rung','P34',"Cantor's theorem",'denominator sweep'];
  var missingN = needles.filter(function (x) { return page.indexOf(x) < 0; });
  chk('v11 24 needles all present', missingN.length === 0);
  var poisons = ['Hilbert','hotel','aleph','beth','Zermelo','axiom of choice','G\u00f6del number','Dedekind cut','power set of the reals','binary complement','p14-lab','infinite hotel'];
  var foundP = poisons.filter(function (x) { return page.indexOf(x) >= 0; });
  chk('v12 12 poisons all absent', foundP.length === 0);
  var ex1 = ['246824','135791','112358','314159','271828','577215'];
  var rowsOk = ex1.every(function (r) { return page.indexOf(tdRow(r)) >= 0; });
  var sh = ex1.map(function (r, i) { return (parseInt(r[i]) === 1 ? 2 : 1); }).join('');
  chk('v13 control: Ex1 row bytes parsed, shadow recomputed = 0.111211', rowsOk && sh === '111211' && page.indexOf('0.111211') >= 0);
  chk('v14 control: fresh pi (arcsin) reproduces Ex1 pi/10 digits 314159', Math.floor(piF / 10 * 1e6) === 314159 && page.indexOf(tdRow('314159')) >= 0);
  var needleGate = function (p) { return needles.filter(function (x) { return p.indexOf(x) < 0; }).length + poisons.filter(function (x) { return p.indexOf(x) >= 0; }).length; };
  var clones = [['3, 4, 8, 5, 0, 6, 4, 6','3, 4, 8, 5, 0, 6, 4, 7'],['0.111211','0.111212'],['in row \\(15\\)','in row \\(16\\)'],['512','513'],['16 June 1902','17 June 1902'],['D = \\{1\\}','D = \\{2\\}']];
  var allRejected = true;
  for (var ci = 0; ci < clones.length; ci++) { var c = page.split(clones[ci][0]).join(clones[ci][1]); if (needleGate(c) === 0) allRejected = false; }
  chk('v15 all 6 doctored clones rejected', allRejected);
  return { fails: fails, total: log.length, log: log, missingN: missingN, foundP: foundP };
}
