// B02 formatting pass R1 — fresh verifier engine (session S17, 2026-10-28).
// Zero shared code with the R0 lab (labs/b02-lab.js): independent routes
// (floor-division probes, digit-tracking power walks, scan-based inverse
// searches, regex parses of the shipped SVG bytes). No recursion, no BigInt
// in the value path, deterministic (no randomness). Pieces read the shipped
// page bytes via ctx.pg and the standard MathJax block via ctx.mj.
var B02FP = { pieces: [], name: [] };
B02FP.name.push('P1');
B02FP.pieces.push(function (ctx) {
  var pg = ctx.pg, L = [];
  function cnt(s, sub) { var n = 0, i = 0; while ((i = s.indexOf(sub, i)) !== -1) { n++; i += sub.length; } return n; }
  var lines = pg.split('\n');
  var configLine = lines[7];
  var io = cnt(pg, '\\('), ic = cnt(pg, '\\)');
  var doo = cnt(pg, '\\['), dc = cnt(pg, '\\]');
  L.push('P1a inline pairs: \\( count=' + io + ' \\) count=' + ic + ' (expect 183 = 182 content + 1 config)' + (io === 183 && ic === 183 ? ' — PASS' : ' — FAIL'));
  L.push('P1b display pairs: \\[ count=' + doo + ' \\] count=' + dc + ' (expect 3 = 2 content equations + 1 config)' + (doo === 3 && dc === 3 ? ' — PASS' : ' — FAIL'));
  L.push('P1c config-line share of delimiters: \\(=' + cnt(configLine, '\\(') + ' \\)=' + cnt(configLine, '\\)') + ' \\[=' + cnt(configLine, '\\[') + ' \\]=' + cnt(configLine, '\\]') + ' (each 1)' + (cnt(configLine, '\\(') === 1 && cnt(configLine, '\\)') === 1 && cnt(configLine, '\\[') === 1 && cnt(configLine, '\\]') === 1 ? ' — PASS' : ' — FAIL'));
  L.push('P1d backslashes in config line: ' + (configLine.split('\\').length - 1) + ' (expect 8)' + (configLine.split('\\').length - 1 === 8 ? ' — PASS' : ' — FAIL'));
  L.push('P1e dollar-dollar delimiters: ' + cnt(pg, '$$') + ' (banned, expect 0)' + (cnt(pg, '$$') === 0 ? ' — PASS' : ' — FAIL'));
  var body = lines.filter(function (ln, i) { return i !== 7; }).join('\n');
  var st = 0, ok = true, p = 0;
  while (p < body.length) {
    if (body.startsWith('\\(', p)) { if (st !== 0) ok = false; st = 1; p += 2; }
    else if (body.startsWith('\\)', p)) { if (st !== 1) ok = false; st = 0; p += 2; }
    else if (body.startsWith('\\[', p)) { if (st !== 0) ok = false; st = 2; p += 2; }
    else if (body.startsWith('\\]', p)) { if (st !== 2) ok = false; st = 0; p += 2; }
    else p++;
  }
  if (st !== 0) ok = false;
  L.push('P1f body delimiter alternation (inline and display, config line excluded) balanced=' + ok + (ok ? ' — PASS' : ' — FAIL'));
  L.push('P1g eq-class paragraphs: ' + cnt(pg, 'class="eq"') + ' (expect 3), text-align leftovers: ' + cnt(pg, 'text-align') + ' (expect 0)' + (cnt(pg, 'class="eq"') === 3 && cnt(pg, 'text-align') === 0 ? ' — PASS' : ' — FAIL'));
  return L;
});
B02FP.name.push('P2');
B02FP.pieces.push(function (ctx) {
  var pg = ctx.pg, mj = ctx.mj, L = [];
  function cnt(s, sub) { var n = 0, i = 0; while ((i = s.indexOf(sub, i)) !== -1) { n++; i += sub.length; } return n; }
  var lines = pg.split('\n');
  var mjl = mj.split('\n');
  L.push('P2a config line byte-identical to standard block line 1=' + (lines[7] === mjl[0]) + (lines[7] === mjl[0] ? ' — PASS' : ' — FAIL'));
  L.push('P2b defer line byte-identical to standard block line 2=' + (lines[8] === mjl[1]) + (lines[8] === mjl[1] ? ' — PASS' : ' — FAIL'));
  var tit = pg.indexOf('<title>B02 · Same remainder, new arithmetic — congruence classes · The Patterns Atlas</title>') !== -1;
  L.push('P2c title unchanged=' + tit + (tit ? ' — PASS' : ' — FAIL'));
  L.push('P2d sections=' + cnt(pg, '<section') + ' (expect 7), figures=' + cnt(pg, '<figure') + ' svgs=' + cnt(pg, '<svg') + ' figcaptions=' + cnt(pg, '<figcaption>') + ' (expect 3/3/3)' + (cnt(pg, '<section') === 7 && cnt(pg, '<figure') === 3 && cnt(pg, '<svg') === 3 && cnt(pg, '<figcaption>') === 3 ? ' — PASS' : ' — FAIL'));
  L.push('P2e citable figure ids: strong=' + cnt(pg, '<strong>Fig B02.') + ' aria=' + cnt(pg, 'aria-label="Fig B02.') + ' (expect 3+3)' + (cnt(pg, '<strong>Fig B02.') === 3 && cnt(pg, 'aria-label="Fig B02.') === 3 ? ' — PASS' : ' — FAIL'));
  var httpCount = cnt(pg, 'http');
  var xmlnsCount = cnt(pg, 'xmlns="http://www.w3.org/2000/svg"');
  var extOk = httpCount === 4 && xmlnsCount === 3 && cnt(pg, '<script') === 2 && cnt(pg, '<link') === 1;
  L.push('P2f external references: http occurrences=' + httpCount + ' = 3 SVG xmlns namespaces + 1 jsdelivr CDN; script tags=' + cnt(pg, '<script') + ' (expect 2: MathJax config + defer loader), link tags=' + cnt(pg, '<link') + ' (expect 1)' + (extOk ? ' — PASS' : ' — FAIL'));
  var moji = pg.indexOf('â') !== -1 || pg.indexOf('PLACEHOLDER') !== -1 || pg.indexOf('TODO') !== -1 || pg.indexOf('FIXME') !== -1;
  L.push('P2g mojibake/placeholder scan clean=' + !moji + (!moji ? ' — PASS' : ' — FAIL'));
  var labsLine = pg.indexOf('labs/b02-format-pass.js') !== -1 && pg.indexOf('labs/b02-format-pass-output.txt') !== -1;
  L.push('P2h Labs line names the format-pass artifacts=' + labsLine + (labsLine ? ' — PASS' : ' — FAIL'));
  return L;
});
B02FP.name.push('P3');
B02FP.pieces.push(function (ctx) {
  var pg = ctx.pg, L = [];
  function remD(v, n) { return v - n * Math.floor(v / n); }
  function cong(a, b, n) { return remD(a - b, n) === 0; }
  var v = 1, k, p5 = 0;
  for (k = 1; k <= 5; k++) { v = v * 7; if (k === 5) p5 = v; }
  L.push('P3a 7^5 = ' + p5 + ' (expect 16807), units digit ' + remD(p5, 10) + ' (expect 7)' + (p5 === 16807 && remD(p5, 10) === 7 ? ' — PASS' : ' — FAIL'));
  var b1 = remD(47, 7) === 5 && 47 - 5 === 7 * 6;
  var b2 = remD(2026, 7) === 3 && 2026 - 3 === 7 * 289;
  var b3 = remD(15, 7) === 1 && 15 - 1 === 7 * 2;
  L.push('P3b Lecture 0 receipts: 47 = 7*6 + 5: ' + b1 + '; 2026 = 7*289 + 3: ' + b2 + '; 15 = 7*2 + 1: ' + b3 + (b1 && b2 && b3 ? ' — PASS' : ' — FAIL'));
  var prod = 47 * 2026;
  L.push('P3c 47*2026 = ' + prod + ' (expect 95222); 95222 = 7*13603 + 1: ' + (prod === 95222 && prod - 1 === 7 * 13603 && remD(prod, 7) === 1) + (prod === 95222 && prod - 1 === 7 * 13603 ? ' — PASS' : ' — FAIL'));
  var tex = pg.indexOf('95{,}222') !== -1 && pg.indexOf('282{,}475{,}249') !== -1;
  L.push('P3d page carries the TeX thousands forms: 95{,}222 + 282{,}475{,}249=' + tex + (tex ? ' — PASS' : ' — FAIL'));
  L.push('P3e equivalence at the page numbers: 47≡5 (42=7*6): ' + cong(47, 5, 7) + '; 2026≡3 (2023=7*289): ' + cong(2026, 3, 7) + '; 47≢4 (rem(43,7)=' + remD(43, 7) + '): ' + !cong(47, 4, 7) + (cong(47, 5, 7) && cong(2026, 3, 7) && !cong(47, 4, 7) && remD(43, 7) === 1 ? ' — PASS' : ' — FAIL'));
  L.push('P3f negative receipt: -47≡3 (mod 5) since -47-3=-50=5*(-10): ' + cong(-47, 3, 5) + (cong(-47, 3, 5) ? ' — PASS' : ' — FAIL'));
  var cls = [], w;
  for (w = 0; w <= 30; w++) if (remD(w, 7) === 2) cls.push(w);
  L.push('P3g class of 2 mod 7 inside [0,30] = [' + cls.join(', ') + '] (expect 2, 9, 16, 23, 30); page list present=' + (pg.indexOf('2, 9, 16, 23, 30') !== -1) + (cls.join(',') === '2,9,16,23,30' && pg.indexOf('2, 9, 16, 23, 30') !== -1 ? ' — PASS' : ' — FAIL'));
  L.push('P3h fresh transitive chain 47≡5, 5≡12 (mod 7) -> 47≡12: ' + (cong(47, 5, 7) && cong(5, 12, 7) && cong(47, 12, 7)) + (cong(47, 12, 7) ? ' — PASS' : ' — FAIL'));
  var ds = cong(47, 11, 9) && cong(2026, 10, 9) && cong(10, 1, 9);
  L.push('P3i digit-sum teaser: 47≡4+7, 2026≡2+0+2+6, 10≡1 (mod 9): ' + ds + (ds ? ' — PASS' : ' — FAIL'));
  return L;
});
B02FP.name.push('P4');
B02FP.pieces.push(function (ctx) {
  var pg = ctx.pg, L = [];
  function remD(v, n) { return v - n * Math.floor(v / n); }
  function cong(a, b, n) { return remD(a - b, n) === 0; }
  // Fresh preservation grid (premise-list route): for each modulus, collect
  // premise-holding pairs, then cross them and check sum/diff/product.
  var ns = [3, 7, 10, 13], total = 0, fails = 0, i, j, n;
  for (i = 0; i < ns.length; i++) {
    n = ns[i];
    var prem = [], a, a2, c, c2;
    for (a = 0; a <= 20; a++) for (a2 = 0; a2 <= 20; a2++) if (cong(a, a2, n)) prem.push([a, a2]);
    for (j = 0; j < prem.length; j++) {
      for (c = 0; c <= 20; c++) {
        for (c2 = 0; c2 <= 20; c2++) {
          if (!cong(c, c2, n)) continue;
          total++;
          if (!cong(prem[j][0] + c, prem[j][1] + c2, n)) fails++;
          if (!cong(prem[j][0] - c, prem[j][1] - c2, n)) fails++;
          if (!cong(prem[j][0] * c, prem[j][1] * c2, n)) fails++;
        }
      }
    }
  }
  L.push('P4a fresh preservation grid (n in {3,7,10,13}, operands 0..20): premise cases=' + total + ', conclusion failures=' + fails + ' (expect 0)' + (fails === 0 ? ' — PASS' : ' — FAIL'));
  var red = 0, rf = 0, k;
  for (k = 0; k < 3; k++) {
    n = [5, 7, 10][k];
    for (a = 0; a <= 99; a++) for (c = 0; c <= 99; c++) {
      red++;
      if (remD(remD(a, n) + remD(c, n), n) !== remD(a + c, n)) rf++;
      if (remD(remD(a, n) * remD(c, n), n) !== remD(a * c, n)) rf++;
    }
  }
  L.push('P4b reduce-first identity (n in {5,7,10}, a,c in [0,99]): cases=' + red + ', failures=' + rf + ' (expect 0)' + (rf === 0 ? ' — PASS' : ' — FAIL'));
  var pn = remD(remD(47, 7) * remD(2026, 7), 7) === remD(47 * 2026, 7) && remD(47 * 2026, 7) === 1;
  L.push('P4c page numbers: (5)(3)=15≡1 and 47*2026=95222≡1 (mod 7): ' + pn + (pn ? ' — PASS' : ' — FAIL'));
  var wd = remD(3 + 47, 7) === remD(3 + 5, 7) && remD(3 + 47, 7) === 1;
  L.push('P4d weekday receipt: (3+47) mod 7 = (3+5) mod 7 = 1 = Monday: ' + wd + (wd ? ' — PASS' : ' — FAIL'));
  return L;
});
B02FP.name.push('P5');
B02FP.pieces.push(function (ctx) {
  var L = [];
  function remD(v, n) { return v - n * Math.floor(v / n); }
  var seq = [], k, r = 1;
  for (k = 1; k <= 6; k++) { r = remD(2 * r, 7); seq.push(r); }
  L.push('P5a powers of 2 mod 7, k=1..6 = [' + seq.join(', ') + '] (expect 2, 4, 1, 2, 4, 1)' + (seq.join(',') === '2,4,1,2,4,1' ? ' — PASS' : ' — FAIL'));
  var cyc = (function () { var c = 100 - 3 * 33; return [2, 4, 1][c - 1]; })();
  var tr = 1;
  for (k = 0; k < 100; k++) tr = remD(2 * tr, 7);
  L.push('P5b 2^100 mod 7: cycle route (100=3*33+1 -> 2) = ' + cyc + ', 100-step track = ' + tr + ' (expect 2, 2)' + (cyc === 2 && tr === 2 ? ' — PASS' : ' — FAIL'));
  var d10 = [], t = 1;
  for (k = 1; k <= 5; k++) { t = remD(7 * t, 10); d10.push(t); }
  L.push('P5c powers of 7 mod 10, k=1..5 = [' + d10.join(', ') + '] (expect 7, 9, 3, 1, 7)' + (d10.join(',') === '7,9,3,1,7' ? ' — PASS' : ' — FAIL'));
  var c7 = (function () { var c = remD(100, 4); return [7, 9, 3, 1][c === 0 ? 3 : c - 1]; })();
  var t7 = 1;
  for (k = 0; k < 100; k++) t7 = remD(7 * t7, 10);
  L.push('P5d 7^100 mod 10: cycle route = ' + c7 + ', 100-step track = ' + t7 + ' (expect 1, 1)' + (c7 === 1 && t7 === 1 ? ' — PASS' : ' — FAIL'));
  var full = 1, mod100 = [7], q;
  for (k = 1; k <= 10; k++) {
    full = full * 7;
    if (k >= 2) { mod100.push(remD(7 * mod100[mod100.length - 1], 100)); }
  }
  L.push('P5e 7^10 = ' + full + ' (expect 282475249), last two digits ' + remD(full, 100) + ' (expect 49)' + (full === 282475249 && remD(full, 100) === 49 ? ' — PASS' : ' — FAIL'));
  L.push('P5f mod-100 track of 7^k, k=1..10 = [' + mod100.join(', ') + '] (expect 7, 49, 43, 1, 7, 49, 43, 1, 7, 49)' + (mod100.join(',') === '7,49,43,1,7,49,43,1,7,49' ? ' — PASS' : ' — FAIL'));
  var f2401 = 2401 === 7 * 7 * 7 * 7 && remD(2401, 100) === 1 && 2401 - 1 === 100 * 24;
  L.push('P5g 7^4 = 2401 = 100*24 + 1: ' + f2401 + (f2401 ? ' — PASS' : ' — FAIL'));
  var cancel = cong2(2 * 3, 2 * 8, 10) && !cong2(3, 8, 10) && remD(6, 10) === remD(16, 10) && remD(6, 10) === 6;
  function cong2(a, b, n) { return remD(a - b, n) === 0; }
  L.push('P5h cancellation counterexample: 2*3=6≡2*8=16 (mod 10) but 3≢8: ' + cancel + (cancel ? ' — PASS' : ' — FAIL'));
  return L;
});
B02FP.name.push('P6');
B02FP.pieces.push(function (ctx) {
  var pg = ctx.pg, L = [];
  function remD(v, n) { return v - n * Math.floor(v / n); }
  var sq = [], x;
  for (x = 0; x <= 6; x++) sq.push(remD(x * x, 7));
  var seen = {}, key = [];
  for (x = 0; x < sq.length; x++) if (!seen[sq[x]]) { seen[sq[x]] = true; key.push(sq[x]); }
  key.sort(function (a, b) { return a - b; });
  L.push('P6a squares mod 7, x=0..6 = [' + sq.join(', ') + '] (expect 0, 1, 4, 2, 2, 4, 1); distinct = [' + key.join(', ') + '] (expect 0, 1, 2, 4)' + (sq.join(',') === '0,1,4,2,2,4,1' && key.join(',') === '0,1,2,4' ? ' — PASS' : ' — FAIL'));
  var hits = 0;
  for (x = 0; x <= 27; x++) if (remD(x * x, 7) === 3) hits++;
  L.push('P6b scan x=0..27 for x²≡3 (mod 7): hits=' + hits + ' (expect 0; 3 has no square root mod 7)' + (hits === 0 ? ' — PASS' : ' — FAIL'));
  var abs = key.indexOf(3) === -1 && key.indexOf(5) === -1 && key.indexOf(6) === -1;
  L.push('P6c residues 3, 5, 6 absent from the square set: ' + abs + (abs ? ' — PASS' : ' — FAIL'));
  var tex = pg.indexOf('\\{0, 1, 2, 4\\}') !== -1;
  L.push('P6d page carries the TeX set \\{0, 1, 2, 4\\}=' + tex + (tex ? ' — PASS' : ' — FAIL'));
  return L;
});
B02FP.name.push('P7');
B02FP.pieces.push(function (ctx) {
  var pg = ctx.pg, L = [];
  function remD(v, n) { return v - n * Math.floor(v / n); }
  var e1 = 100 - 30 === 70 && remD(70, 7) === 0 && 2026 - 3 === 2023 && remD(2023, 7) === 0 && 47 - 4 === 43 && remD(43, 7) === 1;
  L.push('P7a Ex1: 100-30=70≡0, 2026-3=2023≡0 (multiples of 7); 47-4=43=7*6+1 (not): ' + e1 + (e1 ? ' — PASS' : ' — FAIL'));
  var sols = [], x, y;
  for (x = 0; x <= 12; x++) if (remD(5 * x - 3, 13) === 0) sols.push(x);
  L.push('P7b Ex2: 5x≡3 (mod 13) solutions x in [0,12] = [' + sols.join(', ') + '] (expect 11 only); witness 55=13*4+3: ' + (55 === 13 * 4 + 3) + (sols.length === 1 && sols[0] === 11 ? ' — PASS' : ' — FAIL'));
  var s4 = [];
  for (x = 0; x <= 3; x++) if (remD(2 * x - 2, 4) === 0) s4.push(x);
  L.push('P7c 2x≡2 (mod 4) solutions in [0,3] = [' + s4.join(', ') + '] (expect 1, 3 — both solve): ' + (s4.join(',') === '1,3' ? ' — PASS' : ' — FAIL'));
  var inv7 = [], pairs7 = [];
  for (x = 1; x <= 6; x++) {
    for (y = 1; y <= 6; y++) if (remD(x * y, 7) === 1) { inv7.push(x); pairs7.push(x + '·' + y); break; }
  }
  L.push('P7d invertible mod 7 = [' + inv7.join(', ') + '] (expect 1..6), partner pairs ' + pairs7.join(', ') + (inv7.join(',') === '1,2,3,4,5,6' && pairs7.join(' ') === '1·1 2·4 3·5 4·2 5·3 6·6' ? ' — PASS' : ' — FAIL'));
  var inv10 = [], inv12 = [];
  for (x = 1; x <= 9; x++) for (y = 1; y <= 9; y++) if (remD(x * y, 10) === 1) { inv10.push(x); break; }
  for (x = 1; x <= 11; x++) for (y = 1; y <= 11; y++) if (remD(x * y, 12) === 1) { inv12.push(x); break; }
  L.push('P7e invertible mod 10 = [' + inv10.join(', ') + '] (expect 1, 3, 7, 9), mod 12 = [' + inv12.join(', ') + '] (expect 1, 5, 7, 11)' + (inv10.join(',') === '1,3,7,9' && inv12.join(',') === '1,5,7,11' ? ' — PASS' : ' — FAIL'));
  var row2 = [], row3 = [], row4 = [], never = true;
  for (y = 0; y <= 11; y++) {
    row2.push(remD(2 * y, 12)); row3.push(remD(3 * y, 12)); row4.push(remD(4 * y, 12));
    if (remD(2 * y, 12) === 1 || remD(3 * y, 12) === 1 || remD(4 * y, 12) === 1) never = false;
  }
  L.push('P7f rows 2y, 3y, 4y mod 12 never hit 1: ' + never + '; 2y row = [' + row2.join(', ') + '] (expect 0,2,4,6,8,10,0,2,4,6,8,10)' + (never && row2.join(',') === '0,2,4,6,8,10,0,2,4,6,8,10' ? ' — PASS' : ' — FAIL'));
  var dsum = remD(47, 9) === 2 && remD(4 + 7, 9) === 2 && remD(2026, 9) === 1 && remD(2 + 0 + 2 + 6, 9) === 1 && remD(10, 9) === 1;
  L.push('P7g digit-sum teaser receipts mod 9: 47≡11≡4+7, 2026≡10≡2+0+2+6: ' + dsum + (dsum ? ' — PASS' : ' — FAIL'));
  return L;
});
B02FP.name.push('P8');
B02FP.pieces.push(function (ctx) {
  var pg = ctx.pg, L = [];
  var svgs = pg.match(/<svg[\s\S]*?<\/svg>/g) || [];
  var s = svgs[0];
  var okAll = svgs.length === 3;
  var vb = s.match(/viewBox="0 0 ([0-9]+) ([0-9]+)"/);
  L.push('P8a figure count=3: ' + okAll + '; fig 1 viewBox ' + vb[1] + 'x' + vb[2] + ' (expect 340x110)' + (okAll && vb[1] === '340' && vb[2] === '110' ? ' — PASS' : ' — FAIL'));
  var ml = s.match(/<line x1="20" y1="44" x2="320" y2="44"/);
  L.push('P8b main number line from (20,44) to (320,44): ' + !!ml + (ml ? ' — PASS' : ' — FAIL'));
  var ticks = s.match(/<line x1="([0-9]+)" y1="41" x2="[0-9]+" y2="47"/g) || [];
  var tvals = [], i, m, okT = ticks.length === 31;
  for (i = 0; i < ticks.length; i++) { m = ticks[i].match(/x1="([0-9]+)"/); tvals.push(Number(m[1])); }
  for (i = 0; i < 31; i++) if (tvals[i] !== 20 + 10 * i) okT = false;
  L.push('P8c ticks: ' + ticks.length + ' at x=20+10k, k=0..30 in order: ' + okT + (okT ? ' — PASS' : ' — FAIL'));
  var labs = s.match(/<text x="([0-9]+)" y="62"[^>]*>([0-9]+)<\/text>/g) || [];
  var okL = labs.length === 7;
  for (i = 0; i < labs.length; i++) {
    m = labs[i].match(/x="([0-9]+)"[^>]*>([0-9]+)</);
    var k = Number(m[2]);
    if (k % 5 !== 0 || k < 0 || k > 30 || Number(m[1]) !== 20 + 10 * k) okL = false;
  }
  L.push('P8d labels: ' + labs.length + ' at multiples of 5, text = value, x = 20+10·value: ' + okL + (okL ? ' — PASS' : ' — FAIL'));
  var circs = s.match(/<circle cx="([0-9]+)" cy="44" r="([0-9.]+)" fill="(#[0-9a-f]{6})"\/>/g) || [];
  var blue = [], gray = [];
  for (i = 0; i < circs.length; i++) {
    m = circs[i].match(/cx="([0-9]+)" cy="44" r="([0-9.]+)" fill="(#[0-9a-f]{6})"/);
    if (m[3] === '#3574d4') blue.push(Number(m[1])); else gray.push(Number(m[1]));
  }
  var wantBlue = [40, 110, 180, 250, 320], okB = blue.length === 5 && gray.length === 26;
  for (i = 0; i < 5; i++) if (blue[i] !== wantBlue[i]) okB = false;
  L.push('P8e dots on the line: blue r=4.5 at x=[' + blue.join(', ') + '] (expect the class 2,9,16,23,30 at 40,110,180,250,320), gray r=2 count=' + gray.length + ' (expect 26): ' + okB + (okB ? ' — PASS' : ' — FAIL'));
  var note = s.match(/<text x="170" y="96"[^>]*>([^<]+)<\/text>/);
  var nlen = note ? note[1].length : -1;
  L.push('P8f note text ' + nlen + ' chars (must be at most 49, no overflow into the 340-wide box): ' + (nlen >= 0 && nlen <= 49 ? ' — PASS' : ' — FAIL'));
  var fc = pg.indexOf('<strong>Fig B02.1.</strong>') !== -1;
  L.push('P8g figcaption cites Fig B02.1: ' + fc + (fc ? ' — PASS' : ' — FAIL'));
  return L;
});
B02FP.name.push('P9');
B02FP.pieces.push(function (ctx) {
  var pg = ctx.pg, L = [];
  var s = (pg.match(/<svg[\s\S]*?<\/svg>/g) || [])[1];
  var vb = s.match(/viewBox="0 0 ([0-9]+) ([0-9]+)"/);
  L.push('P9a fig 2 viewBox ' + vb[1] + 'x' + vb[2] + ' (expect 340x190)' + (vb[1] === '340' && vb[2] === '190' ? ' — PASS' : ' — FAIL'));
  var nodes = s.match(/<circle cx="([0-9.]+)" cy="([0-9.]+)" r="16" fill="(#[0-9a-f]{6})" stroke="(#[0-9a-f]{6})" stroke-width="([0-9.]+)"\/>/g) || [];
  var okN = nodes.length === 3;
  var ctr = [];
  for (var i = 0; i < nodes.length; i++) {
    var m = nodes[i].match(/cx="([0-9.]+)" cy="([0-9.]+)" r="16" fill="(#[0-9a-f]{6})" stroke="(#[0-9a-f]{6})" stroke-width="([0-9.]+)"/);
    ctr.push([Number(m[1]), Number(m[2]), m[3], m[4], m[5]]);
  }
  if (ctr[0][0] !== 170 || ctr[0][1] !== 34 || ctr[1][0] !== 116.31 || ctr[1][1] !== 127 || ctr[2][0] !== 223.69 || ctr[2][1] !== 127) okN = false;
  var hl = ctr[0][2] === '#fbe4e0' && ctr[0][3] === '#c25b4a' && ctr[0][4] === '2.5';
  var norm = ctr[1][2] === '#eef3fa' && ctr[1][3] === '#3574d4' && ctr[2][2] === '#eef3fa';
  L.push('P9b nodes: 2 at (170,34) highlighted=' + hl + '; 4 at (116.31,127) and 1 at (223.69,127) standard=' + norm + (okN && hl && norm ? ' — PASS' : ' — FAIL'));
  var labs = s.match(/<text x="([0-9.]+)" y="([0-9.]+)" font-size="13"[^>]*>([0-9])<\/text>/g) || [];
  var okL = labs.length === 3;
  if (labs.length === 3) {
    var m0 = labs[0].match(/x="170" y="38.5"[^>]*font-weight="700">2</), m1 = labs[1].match(/x="116.31" y="131.5"[^>]*>4</), m2 = labs[2].match(/x="223.69" y="131.5"[^>]*>1</);
    if (!m0 || !m1 || !m2) okL = false;
  }
  L.push('P9c labels: 2 (bold) at top node, 4 and 1 at the base nodes: ' + okL + (okL ? ' — PASS' : ' — FAIL'));
  var lines = s.match(/<line x1="([0-9.]+)" y1="([0-9.]+)" x2="([0-9.]+)" y2="([0-9.]+)" stroke="#8a94a6"/g) || [];
  var polys = s.match(/<polygon points="([0-9.,\- ]+)" fill="#8a94a6"\/>/g) || [];
  var order = [0, 1, 2, 0], okA = lines.length === 3 && polys.length === 3;
  for (var a = 0; a < 3; a++) {
    var lm = lines[a].match(/x1="([0-9.]+)" y1="([0-9.]+)" x2="([0-9.]+)" y2="([0-9.]+)"/);
    var pm = polys[a].match(/points="([0-9.]+),([0-9.]+) /);
    var from = ctr[order[a]], to = ctr[order[a + 1]];
    var sx = Number(lm[1]), sy = Number(lm[2]), ex = Number(lm[3]), ey = Number(lm[4]);
    var tx = Number(pm[1]), ty = Number(pm[2]);
    var dS = Math.sqrt((sx - from[0]) * (sx - from[0]) + (sy - from[1]) * (sy - from[1]));
    var dT = Math.sqrt((tx - to[0]) * (tx - to[0]) + (ty - to[1]) * (ty - to[1]));
    var dE = Math.sqrt((ex - tx) * (ex - tx) + (ey - ty) * (ey - ty));
    if (dS < 13.5 || dS > 18.5 || dT < 13.5 || dT > 18.5 || dE > 10) okA = false;
  }
  L.push('P9d arrows in document order 2->4, 4->1, 1->2; each starts on the source node edge (r=16±2.5) and its tip lands on the target node edge: ' + okA + (okA ? ' — PASS' : ' — FAIL'));
  var note = s.match(/<text x="170" y="175"[^>]*>([^<]+)<\/text>/);
  var nlen = note ? note[1].length : -1;
  L.push('P9e note text ' + nlen + ' chars (at most 49): ' + (nlen >= 0 && nlen <= 49 ? ' — PASS' : ' — FAIL'));
  L.push('P9f figcaption cites Fig B02.2: ' + (pg.indexOf('<strong>Fig B02.2.</strong>') !== -1 ? 'true — PASS' : 'false — FAIL'));
  return L;
});
B02FP.name.push('P10');
B02FP.pieces.push(function (ctx) {
  var pg = ctx.pg, L = [];
  var svgs = pg.match(/<svg[\s\S]*?<\/svg>/g) || [];
  var s = svgs[2];
  var vb = s.match(/viewBox="0 0 ([0-9]+) ([0-9]+)"/);
  L.push('P10a fig 3 viewBox ' + vb[1] + 'x' + vb[2] + ' (expect 340x210)' + (vb[1] === '340' && vb[2] === '210' ? ' — PASS' : ' — FAIL'));
  var left = s.match(/<circle cx="60" cy="([0-9.]+)" r="13" fill="#eef3fa" stroke="#3574d4" stroke-width="1.5"\/>/g) || [];
  var okL = left.length === 7;
  for (var i = 0; i < left.length; i++) { var cyv = Number(left[i].match(/cy="([0-9.]+)"/)[1]); if (cyv !== 26 + 24 * i) okL = false; }
  L.push('P10b left column: 7 solid nodes at cy=26+24k, k=0..6: ' + okL + (okL ? ' — PASS' : ' — FAIL'));
  var right = s.match(/<circle cx="280" cy="([0-9.]+)" r="13" fill="(none|#eef3fa)" stroke="([^"]+)"[^\/]*\/>/g) || [];
  var solid = [], ghost = [], j, m;
  for (j = 0; j < right.length; j++) {
    m = right[j].match(/cy="([0-9.]+)" r="13" fill="(none|#eef3fa)" stroke="([^"]+)"/);
    var k = (Number(m[1]) - 26) / 24;
    if (m[2] === 'none' && m[3] === '#b8c2d0') ghost.push(k); else if (m[2] === '#eef3fa' && m[3] === '#3574d4') solid.push(k); else ghost.push(-1);
  }
  L.push('P10c right column: solid at k=[' + solid.join(',') + '] (expect 0,1,2,4), dashed ghosts at k=[' + ghost.join(',') + '] (expect 3,5,6): ' + (solid.join(',') === '0,1,2,4' && ghost.join(',') === '3,5,6' ? ' — PASS' : ' — FAIL'));
  var lines = s.match(/<line x1="([0-9.]+)" y1="([0-9.]+)" x2="([0-9.]+)" y2="([0-9.]+)" stroke="#8a94a6"/g) || [];
  var polys = s.match(/<polygon points="([0-9.,\- ]+)" fill="#8a94a6"\/>/g) || [];
  var wantTo = [0, 1, 4, 2, 2, 4, 1], okA = lines.length === 7 && polys.length === 7;
  var pairs = [];
  for (var a = 0; a < lines.length; a++) {
    var lm = lines[a].match(/x1="([0-9.]+)" y1="([0-9.]+)"/);
    var pm = polys[a].match(/points="([0-9.]+),([0-9.]+) /);
    var from = (Number(lm[2]) - 26) / 24;
    var tx = Number(pm[1]), ty = Number(pm[2]);
    var best = -1, bestD = 99;
    for (j = 0; j <= 6; j++) {
      var d = Math.abs(Math.sqrt((tx - 280) * (tx - 280) + (ty - (26 + 24 * j)) * (ty - (26 + 24 * j))) - 13);
      if (d < bestD) { bestD = d; best = j; }
    }
    if (from !== a || best !== wantTo[a] || bestD > 2.5) okA = false;
    pairs.push(from + '->' + best);
  }
  L.push('P10d arrows from->to = ' + pairs.join(', ') + ' (expect 0->0, 1->1, 2->4, 3->2, 4->2, 5->4, 6->1; tips on the target edge, r=13±2.5): ' + okA + (okA ? ' — PASS' : ' — FAIL'));
  var sq = [0, 1, 4, 2, 2, 4, 1], okM = true;
  for (a = 0; a < 7; a++) { var r2 = (a * a) - 7 * Math.floor((a * a) / 7); if (r2 !== wantTo[a] || sq[a] !== wantTo[a]) okM = false; }
  L.push('P10e arrow map equals the square census x² mod 7 = [0, 1, 4, 2, 2, 4, 1]: ' + okM + (okM ? ' — PASS' : ' — FAIL'));
  var note = s.match(/<text x="170" y="200"[^>]*>([^<]+)<\/text>/);
  var nlen = note ? note[1].length : -1;
  L.push('P10f note text ' + nlen + ' chars (at most 49): ' + (nlen >= 0 && nlen <= 49 ? ' — PASS' : ' — FAIL'));
  L.push('P10f note text ' + nlen + ' chars (at most 49): ' + (nlen >= 0 && nlen <= 49 ? ' — PASS' : ' — FAIL'));
  L.push('P10g figcaption cites Fig B02.3: ' + (pg.indexOf('<strong>Fig B02.3.</strong>') !== -1 ? 'true — PASS' : 'false — FAIL'));
  return L;
});
B02FP.name.push('P11');
B02FP.pieces.push(function (ctx) {
  var pg = ctx.pg, L = [];
  var svgs = pg.match(/<svg[\s\S]*?<\/svg>/g) || [];
  var okG = svgs.length === 3, q, j, m;
  for (q = 0; q < svgs.length; q++) {
    var vq = svgs[q].match(/viewBox="0 0 ([0-9]+) ([0-9]+)"/);
    if (!vq) okG = false;
    var W = Number(vq[1]), H = Number(vq[2]);
    var coords = svgs[q].match(/(x1|x2|cx|cy|y1|y2)="([0-9.]+)"/g) || [];
    for (j = 0; j < coords.length; j++) {
      m = coords[j].match(/(x1|x2|cx|y1|y2|cy)="([0-9.]+)"/);
      if (m[1].charAt(0) === 'x' && Number(m[2]) > W) okG = false;
      if (m[1].charAt(0) === 'y' && Number(m[2]) > H) okG = false;
    }
    var pts = svgs[q].match(/points="([0-9.,\- ]+)"/g) || [];
    for (j = 0; j < pts.length; j++) {
      var pp = pts[j].match(/points="([0-9.,\- ]+)"/)[1].trim().split(' ');
      for (var w = 0; w < pp.length; w++) {
        var xy = pp[w].split(',');
        if (Number(xy[0]) > W || Number(xy[1]) > H) okG = false;
      }
    }
    if (svgs[q].indexOf('href') !== -1) okG = false;
  }
  L.push('P11a global SVG sanity: 3 svgs, each with a viewBox, all line/circle/polygon coordinates inside their own box, no hrefs: ' + okG + (okG ? ' — PASS' : ' — FAIL'));
  var dt = pg.split('<details').length - 1, ds = pg.split('<summary').length - 1;
  L.push('P11b details blocks=' + dt + ' summaries=' + ds + ' (expect 7/7)' + (dt === 7 && ds === 7 ? ' — PASS' : ' — FAIL'));
  return L;
});
// Driver: runs every piece against the shipped page bytes and returns the
// honest transcript. The verdict counts every line containing FAIL.
function b02fpRun(ctx) {
  var out = [], i, j, k;
  for (i = 0; i < B02FP.pieces.length; i++) {
    out.push('');
    out.push('B02 FORMAT-PASS ' + B02FP.name[i] + ' — 2026-10-28');
    var L = B02FP.pieces[i](ctx);
    for (j = 0; j < L.length; j++) out.push(L[j]);
  }
  var fails = 0;
  for (k = 0; k < out.length; k++) if (out[k].indexOf('FAIL') !== -1) fails++;
  out.push('');
  out.push('VERDICT: FAIL lines = ' + fails + (fails === 0 ? ' — ALL PIECES PASS' : ' — FAILURES PRESENT'));
  return out;
}
