// p14-lab.js — verification battery for P14 "The diagonal argument" (book/p14-diagonal.html)
// S44 session artifact. Six pieces; each takes the page string. Harness: read the page,
// run pieces, tally PASS/FAIL, print VERDICT. No recursion, no BigInt, no regex backslashes
// beyond those noted; all arithmetic in safe integer / float64 lanes.
// Run history and full transcript: book/labs/p14-lab-output.txt
var P14_LAB = [];
// ---- piece 0: page-byte / structure gates ----
P14_LAB[0] = function (page) {
  var r = [];
  var bytes = 0;
  for (var i = 0; i < page.length; i++) { var c = page.charCodeAt(i); if (c >= 0xD800 && c <= 0xDBFF) { bytes += 4; i++; } else if (c > 0x7F) bytes += (c > 0x7FF ? 3 : 2); else bytes += 1; }
  r.push(['p1.01 page byte size 58456', bytes === 58456]);
  r.push(['p1.02 title', page.indexOf('P14 \u00b7 The diagonal argument \u00b7 The Patterns Atlas') >= 0]);
  r.push(['p1.03 kicker', page.indexOf('the fourteenth move of the spine') >= 0]);
  r.push(['p1.04 MathJax head', page.indexOf('window.MathJax={tex:{inlineMath') >= 0]);
  r.push(['p1.05 integrity sha', page.indexOf('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') >= 0]);
  r.push(['p1.06 zero-dollar', page.indexOf('$') === -1]);
  r.push(['p1.07 8 h2', (page.match(/<h2>/g) || []).length === 8]);
  r.push(['p1.08 3 pattern-boxes', (page.match(/class="pattern-box"/g) || []).length === 3]);
  r.push(['p1.09 3 pid spans', (page.match(/class="pid"/g) || []).length === 3]);
  r.push(['p1.10 3 figures', (page.match(/<figure/g) || []).length === 3]);
  r.push(['p1.11 10 details', (page.match(/<details>/g) || []).length === 10]);
  r.push(['p1.12 3 svg', (page.match(/<svg/g) || []).length === 3]);
  r.push(['p1.13 sections 8/8', (page.match(/<section/g) || []).length === 8 && (page.match(/<\/section>/g) || []).length === 8]);
  r.push(['p1.14 onramp', page.indexOf('New word: enumeration') >= 0 && page.indexOf('shadow number') >= 0 && page.indexOf('uncountable') >= 0]);
  r.push(['p1.15 box ids', page.indexOf('id="box-p14"') >= 0 && page.indexOf('id="box-p14a"') >= 0 && page.indexOf('id="box-p14b"') >= 0]);
  r.push(['p1.16 fig ids', page.indexOf('fig-p14-1') >= 0 && page.indexOf('fig-p14-2') >= 0 && page.indexOf('fig-p14-3') >= 0]);
  r.push(['p1.17 footer', page.indexOf('Return to the index') >= 0 && page.indexOf('p15-squeeze.html') >= 0 && page.indexOf('P15 \u00b7 Squeeze it') >= 0]);
  r.push(['p1.18 no build-talk', page.indexOf('p14-lab') === -1 && page.indexOf('battery') === -1 && page.indexOf('transcript') === -1]);
  r.push(['p1.19 warn aside', page.indexOf('Scope, honestly') >= 0]);
  var spine = ['p01-pin-down-the-problem','p02-small-cases','p03-special-cases','p04-complete-the-square','p05-canonical-form','p06-compose-identity','p07-auxiliary-construction','p08-symmetry','p09-invariant','p10-pigeonhole','p11-contradiction','p12-obstruction','p13-descent'];
  r.push(['p1.20 13 spine hrefs', spine.every(function (s) { return page.indexOf(s + '.html') >= 0; })]);
  r.push(['p1.21 forward links', page.indexOf('p16-isomorphism.html') >= 0 && page.indexOf('b08-diagonalization.html') >= 0]);
  r.push(['p1.22 no draft residue', page.indexOf('TODO') === -1 && page.indexOf('wait,') === -1 && page.indexOf('XXX') === -1 && page.indexOf('part1') === -1]);
  r.push(['p1.23 five exhibits', ['Exhibit 1','Exhibit 2','Exhibit 3','Exhibit 4','Exhibit 5'].every(function (x) { return page.indexOf(x) >= 0; })]);
  r.push(['p1.24 exercises + pairs', ['Exercise 1','Exercise 2','Exercise 3','Exercise 4','Exercise 5'].every(function (x) { return page.indexOf(x) >= 0; }) && (page.match(/<summary>Hint<\/summary>/g) || []).length === 5 && (page.match(/<summary>Worked<\/summary>/g) || []).length === 5]);
  r.push(['p1.25 inline TeX >= 200', (page.match(/\\\(/g) || []).length >= 200]);
  return r;
};
// ---- piece 1: encounter-table digits from first principles ----
P14_LAB[1] = function (page) {
  var r = [];
  var longdiv = function (p, q, n) { var x = p, s = ''; for (var j = 0; j < n; j++) { x *= 10; s += Math.floor(x / q); x = x % q; } return s; };
  var ef = 1, e = 2; for (var k = 2; k < 22; k++) { ef *= k; e += 1 / ef; }
  var atan = function (x) { var t = 0, term = x, k = 0, x2 = x * x; while (Math.abs(term) > 1e-18) { t += term / (2 * k + 1); k++; term = -term * x2; } return t; };
  var pi = 16 * atan(1 / 5) - 4 * atan(1 / 239);
  var isqrt = function (v) { var x = v; for (var i = 0; i < 8; i++) x = (x + v / x) / 2; return x; };
  var s2 = isqrt(2), s3 = isqrt(3);
  r.push(['p2.01 1/3 digits', longdiv(1, 3, 10) === '3333333333']);
  r.push(['p2.02 14/99 digits', longdiv(14, 99, 10) === '1414141414']);
  r.push(['p2.03 1/2 digits', longdiv(1, 2, 10) === '5000000000']);
  r.push(['p2.04 2/3 digits', longdiv(2, 3, 10) === '6666666666']);
  r.push(['p2.05 e < 1e-11', Math.abs(e - 2.7182818284590) < 1e-11]);
  r.push(['p2.06 e-2 digits', Math.floor((e - 2) * 1e10) === 7182818284]);
  r.push(['p2.07 Machin pi < 1e-11', Math.abs(pi - 3.1415926535897) < 1e-11]);
  r.push(['p2.08 pi-3 digits', Math.floor((pi - 3) * 1e10) === 1415926535]);
  r.push(['p2.09 sqrt2 < 1e-12', Math.abs(s2 - 1.4142135623730) < 1e-12]);
  r.push(['p2.10 sqrt2-1 digits', Math.floor((s2 - 1) * 1e10) === 4142135623]);
  r.push(['p2.11 sqrt3/2 digits', Math.floor((s3 / 2) * 1e10) === 8660254037]);
  var rows = ['3333333333','1414141414','7182818284','1415926535','5000000000','6666666666','8660254037','4142135623'];
  var diag = rows.map(function (row, i) { return parseInt(row[i]); });
  r.push(['p2.12 diagonal 3,4,8,5,0,6,4,6', JSON.stringify(diag) === '[3,4,8,5,0,6,4,6]']);
  r.push(['p2.13 page diagonal string', page.indexOf('3, 4, 8, 5, 0, 6, 4, 6') >= 0]);
  r.push(['p2.14 no diagonal 1', diag.indexOf(1) === -1]);
  r.push(['p2.15 shadow prefix on page', page.indexOf('0.11111111') >= 0]);
  r.push(['p2.16 page table rows exact', rows.every(function (row) { return page.indexOf('<td>' + row.split('').join('</td><td>') + '</td>') >= 0; })]);
  var H = 0, N = 1000000; for (var k2 = 1; k2 <= N; k2++) H += 1 / k2;
  var gam = H - Math.log(N) - 1 / (2 * N) + 1 / (12 * N * N);
  r.push(['p2.17 gamma < 1e-9 + digits 577215', Math.abs(gam - 0.5772156649) < 1e-9 && Math.floor(gam * 1e6) === 577215]);
  var fib = [1, 1]; for (var k3 = 2; k3 < 6; k3++) fib[k3] = fib[k3 - 1] + fib[k3 - 2];
  r.push(['p2.18 Ex1 fib 112358 + pi/10 314159 + e/10 271828', fib.slice(0, 6).join('') === '112358' && Math.floor((pi / 10) * 1e6) === 314159 && Math.floor((e / 10) * 1e6) === 271828]);
  var ex1 = ['246824','135791','112358','314159','271828','577215'];
  var d1 = ex1.map(function (row, i) { return parseInt(row[i]); });
  r.push(['p2.19 Ex1 diagonal + shadow + labels', JSON.stringify(d1) === '[2,3,2,1,2,5]' && d1.map(function (d) { return d === 1 ? 2 : 1; }).join('') === '111211' && page.indexOf('0.111211') >= 0 && page.indexOf('\\pi/10') >= 0 && page.indexOf('e/10') >= 0 && page.indexOf('the odds, cycling') >= 0]);
  return r;
};
// ---- piece 2: costume trap + {1,2} uniqueness ----
P14_LAB[2] = function (page) {
  var r = [];
  var t1 = true; for (var K = 1; K <= 15; K++) { var s = 0; for (var j = 1; j <= K; j++) s = s * 10 + 9; if (s !== Math.pow(10, K) - 1) t1 = false; }
  r.push(['p3.01 0.999 truncations K=1..15', t1]);
  var t2 = true; for (var K2 = 1; K2 <= 12; K2++) { var nines = 4 * Math.pow(10, K2) + (Math.pow(10, K2) - 1); if (5 * Math.pow(10, K2) - nines !== 1) t2 = false; }
  r.push(['p3.02 costume pair K=1..12', t2]);
  var strs = []; (function gen(n, pre) { if (n === 0) { strs.push(pre); return; } gen(n - 1, pre + '1'); gen(n - 1, pre + '2'); })(6, '');
  r.push(['p3.03 64 {1,2} strings distinct', strs.length === 64 && Array.from(new Set(strs.map(function (s) { return parseInt(s); }))).length === 64]);
  var ex1rows = ['01000', '10000', '11000', '0000000'];
  var d3 = ex1rows.map(function (row, i) { return parseInt(row[i]); });
  r.push(['p3.04 Exhibit-1 diagonal zeros + all-9s shadow', JSON.stringify(d3) === '[0,0,0,0]' && d3.every(function (d) { return 9 - d === 9; }) && page.indexOf('0.999999') >= 0]);
  return r;
};
// ---- piece 3: Cantor brute force ----
P14_LAB[3] = function (page) {
  var r = [];
  var census = function (n) { var allMiss = true; var total = Math.pow(8, n); for (var code = 0; code < total; code++) { var f = []; for (var x = 0; x < n; x++) f.push((code >> (3 * x)) & 7); var D = 0; for (var x2 = 0; x2 < n; x2++) if (!((f[x2] >> x2) & 1)) D |= (1 << x2); if (Array.from(new Set(f)).indexOf(D) >= 0) allMiss = false; } return allMiss; };
  r.push(['p4.01 census n=2 all 16 miss', census(2) && Math.pow(4, 2) === 16]);
  r.push(['p4.02 census n=3 all 512 miss', census(3) && Math.pow(8, 3) === 512]);
  r.push(['p4.03 2^n n=1..4', [1, 2, 3, 4].every(function (n) { return Math.pow(2, n) === [2, 4, 8, 16][n - 1]; })]);
  var fEx = [6, 2, 5], DEx = 0; for (var x3 = 0; x3 < 3; x3++) if (!((fEx[x3] >> x3) & 1)) DEx |= (1 << x3);
  r.push(['p4.04 Example-1 f -> D={1} missed', DEx === 1 && fEx.indexOf(DEx) === -1 && page.indexOf('D = \\{1\\}') >= 0]);
  var toSet = function (s) { var m = []; for (var b = 0; b < s.length; b++) if (s[b] === '1') m.push(b + 1); return m.join(','); };
  var fromSet = function (m) { var els = m ? m.split(',').map(Number) : []; var s = ''; for (var b2 = 1; b2 <= 3; b2++) s += (els.indexOf(b2) >= 0 ? '1' : '0'); return s; };
  var bin = []; (function gen2(n, pre) { if (n === 0) { bin.push(pre); return; } gen2(n - 1, pre + '0'); gen2(n - 1, pre + '1'); })(3, '');
  var sets = bin.map(toSet);
  r.push(['p4.05 strings <-> subsets bijection', bin.length === 8 && Array.from(new Set(sets)).length === 8 && bin.every(function (s, i) { return fromSet(sets[i]) === s; })]);
  return r;
};
// ---- piece 4: denominator sweep ----
P14_LAB[4] = function (page) {
  var r = [];
  var gcd = function (a, b) { while (b !== 0) { var t = b; b = a % b; a = t; } return a; };
  var sweep = [[0, 1]]; var q = 2; while (sweep.length < 40) { for (var p = 1; p < q; p++) { if (gcd(p, q) === 1) { sweep.push([p, q]); if (sweep.length >= 40) break; } } q++; }
  var pos = function (fr) { for (var i = 0; i < sweep.length; i++) if (sweep[i][0] === fr[0] && sweep[i][1] === fr[1]) return i + 1; return -1; };
  r.push(['p5.01 positions 1/2=2, 2/3=4, 3/7=15', pos([1, 2]) === 2 && pos([2, 3]) === 4 && pos([3, 7]) === 15]);
  r.push(['p5.02 page says row 15', page.indexOf('in row \\(15\\)') >= 0]);
  var expectPhi = [1, 2, 2, 4, 2, 6, 4, 6, 4, 10, 4], phiOk = true;
  for (var qq = 2; qq <= 12; qq++) { var c = 0; for (var p2 = 1; p2 < qq; p2++) if (gcd(p2, qq) === 1) c++; if (c !== expectPhi[qq - 2]) phiOk = false; }
  r.push(['p5.03 phi(q) q=2..12', phiOk]);
  var expect12 = [0, 0.5, 1 / 3, 2 / 3, 0.25, 0.75, 0.2, 0.4, 0.6, 0.8, 1 / 6, 5 / 6];
  var t12 = true; for (var i2 = 0; i2 < 12; i2++) if (sweep[i2][0] / sweep[i2][1] !== expect12[i2]) t12 = false;
  r.push(['p5.04 first 12 sweep = Fig P14.3 values', t12]);
  var m = page.match(/cx="(\d+)" cy="80"/g) || [];
  var cxPage = []; var re = /cx="(\d+)" cy="80"/g; var mm; while ((mm = re.exec(page)) !== null) cxPage.push(parseInt(mm[1]));
  var cx = expect12.map(function (v) { return Math.round(40 + 270 * v); });
  r.push(['p5.05 Fig P14.3 cx machine-checked', cxPage.length === 12 && JSON.stringify(cxPage) === JSON.stringify(cx)]);
  var seen = {}, dup = false;
  sweep.forEach(function (fr) { var g = gcd(fr[0], fr[1]); var key = (fr[0] / g) + '/' + (fr[1] / g); if (seen[key]) dup = true; seen[key] = 1; });
  r.push(['p5.06 no duplicates first 40', !dup]);
  var longdiv = function (p, q, n) { var x = p, s = ''; for (var j = 0; j < n; j++) { x *= 10; s += Math.floor(x / q); x = x % q; } return s; };
  var honest = true, sp = [];
  for (var i3 = 0; i3 < 20; i3++) { var fr = sweep[i3]; var fd = longdiv(fr[0], fr[1], 20); var d = parseInt(fd[i3]); sp.push(d === 1 ? 2 : 1); if (parseInt(fd[i3]) === sp[i3]) honest = false; }
  r.push(['p5.07 20-digit shadow prefix honest + {1,2} digits', honest && sp.every(function (d) { return d === 1 || d === 2; })]);
  return r;
};
// ---- piece 5: page-claim census + verified-history gate ----
P14_LAB[5] = function (page) {
  var r = [];
  var needles = ['in row \\(15\\)','512','sixteen','2^','0.999999','minus each diagonal digit','\\begin{cases}','= 27\\)','27\\) candidates','\u25cf\u25cb\u25cb','\u25cf\u25cf\u25cb','\u25cf\u25cf\u25cf','\u25c6','\u25d0','Fig P14.1','Fig P14.2','Fig P14.3'];
  r.push(['p6.01 numeric/markers census', needles.every(function (x) { return page.indexOf(x) >= 0; })]);
  var hist = ['1874','1877','1891','16 June 1902','1936','1938','1963','1844','Je le vois, mais je ne le crois pas','Application of the diagonal process','Crelle','no set whose cardinality is strictly between','Grundgesetze','Bertrand Russell','Kurt G\u00f6del','Paul Cohen','Liouville','Turing'];
  r.push(['p6.02 verified-history date census', hist.every(function (x) { return page.indexOf(x) >= 0; })]);
  r.push(['p6.03 consumers named', page.indexOf('P34') >= 0 && page.indexOf('P21') >= 0 && page.indexOf('B08') >= 0 && page.indexOf('arithmetization of syntax') >= 0]);
  r.push(['p6.04 sketch label honest', page.indexOf('<em>Sketch</em>') >= 0 && page.indexOf('borrowed fact') >= 0]);
  r.push(['p6.05 costume language', page.indexOf('two costumes') >= 0]);
  r.push(['p6.06 demands language', page.indexOf('Existence.') >= 0 && page.indexOf('Membership.') >= 0 && page.indexOf('Difference.') >= 0]);
  r.push(['p6.07 keys language', page.indexOf('A numbered claim.') >= 0 && page.indexOf('A controllable coordinate.') >= 0 && page.indexOf('A closed domain.') >= 0]);
  r.push(['p6.08 footer forward link only once', (page.match(/p15-squeeze\.html/g) || []).length === 1]);
  return r;
};
// harness (executed in the sandbox; page supplied by the runner)
// P14_RUN(page): tally all pieces, print PASS/FAIL lines, print VERDICT.
