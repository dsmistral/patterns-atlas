// B01 formatting pass R1 — fresh verifier engine (session S16, 2026-10-28).
// Zero shared code with the R0 lab (labs/b01-lab.js): independent routes
// (subtraction chains, floor-division probes, digit-only tracking, regex
// parses of the shipped SVG bytes). No recursion, no BigInt in the value
// path, deterministic (no randomness). Pieces read the shipped page bytes
// via ctx.pg and the standard MathJax block via ctx.mj.
var B01FP = { pieces: [], name: [] };
B01FP.name.push('P1');
B01FP.pieces.push(function (ctx) {
  var pg = ctx.pg, mj = ctx.mj, L = [];
  function cnt(s, sub) { var n = 0, i = 0; while ((i = s.indexOf(sub, i)) !== -1) { n++; i += sub.length; } return n; }
  var lines = pg.split('\n');
  var configLine = lines[7];
  var io = cnt(pg, '\\('), ic = cnt(pg, '\\)');
  var doo = cnt(pg, '\\['), dc = cnt(pg, '\\]');
  L.push('P1a inline pairs: \\( count=' + io + ' \\) count=' + ic + ' (expect 91 = 90 content + 1 config)' + (io === 91 && ic === 91 ? ' — PASS' : ' — FAIL'));
  L.push('P1b display pairs: \\[ count=' + doo + ' \\] count=' + dc + ' (expect 2 = 1 content equation + 1 config)' + (doo === 2 && dc === 2 ? ' — PASS' : ' — FAIL'));
  L.push('P1c config-line share of delimiters: \\(=' + cnt(configLine, '\\(') + ' \\)=' + cnt(configLine, '\\)') + ' \\[=' + cnt(configLine, '\\[') + ' \\]=' + cnt(configLine, '\\]') + ' (each 1)' + (cnt(configLine, '\\(') === 1 && cnt(configLine, '\\)') === 1 && cnt(configLine, '\\[') === 1 && cnt(configLine, '\\]') === 1 ? ' — PASS' : ' — FAIL'));
  L.push('P1d backslashes in config line: ' + (configLine.split('\\').length - 1) + ' (expect 8)' + (configLine.split('\\').length - 1 === 8 ? ' — PASS' : ' — FAIL'));
  L.push('P1e dollar-dollar delimiters: ' + cnt(pg, '$$') + ' (banned, expect 0)' + (cnt(pg, '$$') === 0 ? ' — PASS' : ' — FAIL'));
  var body = lines.filter(function (ln, i) { return i !== 7; }).join('\n');
  var st = 0, ok = true, p = 0;
  while (p < body.length) {
    if (body.startsWith('\\(', p)) { if (st !== 0) ok = false; st = 1; p += 2; }
    else if (body.startsWith('\\)', p)) { if (st !== 1) ok = false; st = 0; p += 2; }
    else p++;
  }
  L.push('P1f body delimiter alternation (no nested or stray inline pairs)=' + ok + (ok && st === 0 ? ' — PASS' : ' — FAIL'));
  var eqLine = '\\[a = bq + r, \\qquad 0 \\le r &lt; b.\\]';
  L.push('P1g the one display equation is the box form-line: ' + (pg.indexOf(eqLine) !== -1) + (pg.indexOf(eqLine) !== -1 ? ' — PASS' : ' — FAIL'));
  L.push('P1h sections=' + cnt(pg, '<section') + ' (expect 7)' + (cnt(pg, '<section') === 7 ? ' — PASS' : ' — FAIL'));
  L.push('P1i figures=' + cnt(pg, '<figure') + ' svgs=' + cnt(pg, '<svg') + ' figcaptions=' + cnt(pg, '<figcaption>') + ' (expect 3/3/3)' + (cnt(pg, '<figure') === 3 && cnt(pg, '<svg') === 3 && cnt(pg, '<figcaption') === 3 ? ' — PASS' : ' — FAIL'));
  var strongF = cnt(pg, '<strong>Fig B01.'), ariaF = cnt(pg, 'aria-label="Fig B01.');
  L.push('P1j figure-id literals: strong captions=' + strongF + ' aria-labels=' + ariaF + ' (expect 3+3)' + (strongF === 3 && ariaF === 3 ? ' — PASS' : ' — FAIL'));
  L.push('P1k eq-class=' + cnt(pg, 'class="eq"') + ' (expect 1) text-align=' + cnt(pg, 'text-align') + ' (expect 0)' + (cnt(pg, 'class="eq"') === 1 && cnt(pg, 'text-align') === 0 ? ' — PASS' : ' — FAIL'));
  L.push('P1l mojibake (U+FFFD) count: ' + cnt(pg, '\uFFFD') + (cnt(pg, '\uFFFD') === 0 ? ' — PASS' : ' — FAIL'));
  var ph = cnt(pg, 'PLACEHOLDER') + cnt(pg, 'TBD') + cnt(pg, 'FIXME') + cnt(pg, 'XXX');
  L.push('P1m placeholder tokens: ' + ph + (ph === 0 ? ' — PASS' : ' — FAIL'));
  var mjJoined = lines[7] + '\n' + lines[8] + '\n';
  L.push('P1n MathJax block byte-identical to the standard block: ' + (mjJoined === mj) + (mjJoined === mj ? ' — PASS' : ' — FAIL'));
  L.push('P1o em-dash count recorded: ' + cnt(pg, '\u2014'));
  return L;
});
B01FP.name.push('P2');
B01FP.pieces.push(function (ctx) {
  var L = [], checks = 0, fails = 0, b, a, x, q, r, legal, i;
  for (b = 2; b <= 13; b++) {
    for (a = 0; a <= 120; a++) {
      checks++;
      x = a; q = 0;
      while (x >= b) { x -= b; q++; }
      if (!(a === b * q + x && x >= 0 && x < b)) fails++;
    }
  }
  L.push('P2a subtraction route b in [2,13], a in [0,120]: checks=' + checks + ' failures=' + fails + (checks === 1452 && fails === 0 ? ' — PASS' : ' — FAIL'));
  var uchecks = 0, uv = 0;
  for (b = 2; b <= 13; b++) {
    for (a = 0; a <= 120; a++) {
      uchecks++;
      legal = 0;
      for (q = 0; q <= Math.floor(a / b) + 1; q++) {
        r = a - b * q;
        if (r >= 0 && r < b) legal++;
      }
      if (legal !== 1) uv++;
    }
  }
  L.push('P2b uniqueness count over the same grid (exactly one legal q each): checks=' + uchecks + ' violations=' + uv + (uchecks === 1452 && uv === 0 ? ' — PASS' : ' — FAIL'));
  var S = [];
  x = 47;
  while (x >= 0) { S.push(x); x -= 5; }
  var least = S[0];
  for (i = 1; i < S.length; i++) if (S[i] < least) least = S[i];
  L.push('P2c S = {47-5k >= 0} = [' + S.join(', ') + ']; least element = ' + least + (S.length === 10 && least === 2 ? ' — PASS' : ' — FAIL'));
  L.push('P2d 7*289+3 = ' + (7 * 289 + 3) + ' | 7*288+3 = ' + (7 * 288 + 3) + ' (a different number: ' + (7 * 288 + 3 !== 2026) + ')' + (7 * 289 + 3 === 2026 && 7 * 288 + 3 === 2019 ? ' — PASS' : ' — FAIL'));
  var forms = [[9, 2, true], [8, 7, false], [10, -3, false]], okF = true;
  for (i = 0; i < 3; i++) {
    q = forms[i][0]; r = forms[i][1];
    var good = (5 * q + r === 47) && (r >= 0 && r < 5);
    if (good !== forms[i][2]) okF = false;
    L.push('P2e-' + (i + 1) + ' 47 = 5*' + q + ' + (' + r + '): sum=' + (5 * q + r) + ' r-in-window=' + (r >= 0 && r < 5) + ' legal=' + good);
  }
  L.push('P2e the three 47-by-5 decompositions classified correctly=' + okF + (okF ? ' — PASS' : ' — FAIL'));
  return L;
});
B01FP.name.push('P3');
B01FP.pieces.push(function (ctx) {
  var L = [], i, d;
  var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  d = (3 + 47) % 7;
  L.push('P3a (3+47) mod 7 = ' + ((3 + 47) % 7) + ' = ' + names[d] + (d === 1 ? ' — PASS' : ' — FAIL'));
  var walk = 3;
  for (i = 0; i < 47; i++) walk = (walk + 1) % 7;
  L.push('P3b day-by-day walk of 47 single steps from Wednesday lands on ' + names[walk] + (walk === d ? ' — PASS' : ' — FAIL'));
  var d2 = (3 + 2026) % 7;
  var walk2 = 3;
  for (i = 0; i < 2026; i++) walk2 = (walk2 + 1) % 7;
  L.push('P3c (3+2026) mod 7 = ' + d2 + ' = ' + names[d2] + '; the 2026-step walk lands on ' + names[walk2] + (d2 === 6 && walk2 === 6 ? ' — PASS' : ' — FAIL'));
  var r1 = 47 - 7 * 6, r2 = 2026 - 7 * 289;
  L.push('P3d leftover routes: 47 = 7*6 + ' + r1 + ' -> (3+' + r1 + ') mod 7 = ' + ((3 + r1) % 7) + '; 2026 = 7*289 + ' + r2 + ' -> (3+' + r2 + ') mod 7 = ' + ((3 + r2) % 7) + (((3 + r1) % 7 === d && (3 + r2) % 7 === d2) ? ' — PASS' : ' — FAIL'));
  return L;
});
B01FP.name.push('P4');
B01FP.pieces.push(function (ctx) {
  var L = [], a, b, mism = 0, pairs = 0, i, p = 1;
  for (i = 0; i < 4; i++) p = p * 7;
  L.push('P4a 7^4 = ' + p + (p === 2401 ? ' — PASS' : ' — FAIL'));
  L.push('P4b 2401 = 10*240 + ' + (2401 - 10 * 240) + '; units digit = 2401 mod 10 = ' + (2401 % 10) + (2401 === 10 * 240 + 1 && 2401 % 10 === 1 ? ' — PASS' : ' — FAIL'));
  L.push('P4c divisibility-as-zero-remainder: 2401 mod 7 = ' + (2401 % 7) + ', 2047 mod 23 = ' + (2047 % 23) + ', 2047 mod 89 = ' + (2047 % 89) + (2401 % 7 === 0 && 2047 % 23 === 0 && 2047 % 89 === 0 ? ' — PASS' : ' — FAIL'));
  L.push('P4d cross-check 23*89 = ' + (23 * 89) + (23 * 89 === 2047 ? ' — PASS' : ' — FAIL'));
  for (a = 0; a <= 99; a++) {
    for (b = 0; b <= 99; b++) {
      pairs++;
      if (((a % 10) * (b % 10)) % 10 !== (a * b) % 10) mism++;
    }
  }
  L.push('P4e digit-only product identity (a*b) mod 10 = ((a mod 10)*(b mod 10)) mod 10 over [0,99]^2: pairs=' + pairs + ' mismatches=' + mism + (pairs === 10000 && mism === 0 ? ' — PASS' : ' — FAIL'));
  return L;
});
B01FP.name.push('P5');
B01FP.pieces.push(function (ctx) {
  var L = [], n, k, cases = 0, fails = 0, i;
  for (n = 0; n <= 209; n++) {
    if (n % 7 === 3) { cases++; if ((n * n) % 7 !== 2) fails++; }
  }
  L.push('P5a route A (exhaustive n in [0,209] with n mod 7 = 3): cases=' + cases + ' failures=' + fails + (cases === 30 && fails === 0 ? ' — PASS' : ' — FAIL'));
  var kc = 0, kf = 0;
  for (k = 0; k <= 30; k++) {
    kc++;
    n = 7 * k + 3;
    if (n * n - 7 * (7 * k * k + 6 * k + 1) !== 2) kf++;
  }
  L.push('P5b route B (algebra (7k+3)^2 = 7(7k^2+6k+1)+2, exact) over k in [0,30]: checks=' + kc + ' failures=' + kf + (kc === 31 && kf === 0 ? ' — PASS' : ' — FAIL'));
  var spots = [[3, 9], [10, 100], [171, 29241]];
  for (i = 0; i < 3; i++) {
    n = spots[i][0];
    L.push('P5c-' + (i + 1) + ' n=' + n + ': n mod 7 = ' + (n % 7) + ' | n^2 = ' + (n * n) + ' | n^2 mod 7 = ' + ((n * n) % 7) + (n % 7 === 3 && n * n === spots[i][1] && (n * n) % 7 === 2 ? ' — PASS' : ' — FAIL'));
  }
  L.push('P5d honesty note: 172 mod 7 = ' + (172 % 7) + ' (NOT a remainder-3 number) | 172^2 = ' + (172 * 172) + ' | 172^2 mod 7 = ' + ((172 * 172) % 7) + ' | 4^2 = 16 = 7*2+' + (16 - 7 * 2) + (172 % 7 === 4 && (172 * 172) % 7 === 2 && 16 === 7 * 2 + 2 ? ' — PASS' : ' — FAIL'));
  return L;
});
B01FP.name.push('P6');
B01FP.pieces.push(function (ctx) {
  var L = [], u, i, digits = [];
  u = 7;
  for (i = 1; i <= 12; i++) { digits.push(u); u = (u * 7) % 10; }
  var expd = [7, 9, 3, 1, 7, 9, 3, 1, 7, 9, 3, 1], okd = true;
  for (i = 0; i < 12; i++) if (digits[i] !== expd[i]) okd = false;
  L.push('P6a units digits of 7^1..7^12: ' + digits.join(', ') + ' (cycle 7,9,3,1 of length 4)' + (okd ? ' — PASS' : ' — FAIL'));
  var track = 1;
  for (i = 0; i < 100; i++) track = (track * 7) % 10;
  L.push('P6b units digit of 7^100 by digit-only tracking (100 steps): ' + track + (track === 1 ? ' — PASS' : ' — FAIL'));
  var result = 1, base = 7 % 10, e = 100;
  while (e > 0) { if (e % 2 === 1) result = (result * base) % 10; base = (base * base) % 10; e = Math.floor(e / 2); }
  L.push('P6c units digit of 7^100 by square-and-multiply mod 10 (independent route): ' + result + (result === 1 && result === track ? ' — PASS' : ' — FAIL'));
  L.push('P6d 100 = 4*25 exactly, so the cycle closes at position 0 -> 1: ' + (100 === 4 * 25) + (100 === 4 * 25 ? ' — PASS' : ' — FAIL'));
  return L;
});
B01FP.name.push('P7');
B01FP.pieces.push(function (ctx) {
  var L = [], probes = [[-47, 5, -10, 3], [-13, 5, -3, 2], [-1, 5, -1, 4], [-2026, 5, -406, 4]];
  var allOk = true, i;
  for (i = 0; i < probes.length; i++) {
    var a = probes[i][0], b = probes[i][1], eq = probes[i][2], er = probes[i][3];
    var q = Math.floor(a / b), r = a - b * q;
    var ok = (q === eq && r === er && r >= 0 && r < b);
    if (!ok) allOk = false;
    L.push('P7-' + (i + 1) + ' a=' + a + ', b=' + b + ': a = ' + b + '*(' + q + ') + ' + r + ' | 0 <= r < b: ' + (r >= 0 && r < b) + ' (R0 receipt: ' + b + '*(' + eq + ') + ' + er + ')' + (ok ? ' — PASS' : ' — FAIL'));
  }
  L.push('P7 the four negative-dividend probes match the R0 receipts=' + allOk + (allOk ? ' — PASS' : ' — FAIL'));
  return L;
});
B01FP.name.push('P8');
B01FP.pieces.push(function (ctx) {
  var L = [], pg = ctx.pg;
  var m = pg.match(/<svg[^>]*viewBox="0 0 340 212"[^>]*>([\s\S]*?)<\/svg>/);
  if (!m) { L.push('P8 fig1 svg block not found — FAIL'); return L; }
  var s = m[1];
  var circles = s.match(/<circle cx="([0-9.\-]+)" cy="([0-9.\-]+)" r="5" fill="(#[0-9a-f]{6})"\/>/g) || [];
  L.push('P8a fig1 dots: ' + circles.length + ' (expect 47)' + (circles.length === 47 ? ' — PASS' : ' — FAIL'));
  var blue = 0, red = 0, posOk = true, i;
  for (i = 0; i < circles.length; i++) {
    var mm = circles[i].match(/cx="([0-9.\-]+)" cy="([0-9.\-]+)" r="5" fill="(#[0-9a-f]{6})"/);
    var cx = parseFloat(mm[1]), cy = parseFloat(mm[2]), fill = mm[3];
    if (fill === '#3574d4') blue++; else if (fill === '#c25b4a') red++; else posOk = false;
    var row = i < 40 ? Math.floor(i / 10) : 4;
    var col = i < 40 ? i % 10 : i - 40;
    var ex = 46 + 26 * col, ey = 34 + 34 * row;
    if (Math.abs(cx - ex) > 0.001 || Math.abs(cy - ey) > 0.001) posOk = false;
    if (cx + 5 > 340 || cy + 5 > 212) posOk = false;
  }
  L.push('P8b blue=' + blue + ' (expect 45) red=' + red + ' (expect 2)' + (blue === 45 && red === 2 ? ' — PASS' : ' — FAIL'));
  L.push('P8c every dot matches the grid formula (x=46+26k, y=34+34m, row 4 short) and stays in bounds=' + posOk + (posOk ? ' — PASS' : ' — FAIL'));
  var rects = s.match(/<rect x="(34|164)" y="([0-9.\-]+)" width="128" height="24"/g) || [];
  L.push('P8d boxes: ' + rects.length + ' (expect 9)' + (rects.length === 9 ? ' — PASS' : ' — FAIL'));
  var containOk = true, r2;
  for (r2 = 0; r2 < rects.length; r2++) {
    var rm = rects[r2].match(/x="(34|164)" y="([0-9.\-]+)"/);
    var rx = parseInt(rm[1], 10), ry = parseFloat(rm[2]);
    var inside = 0, i2;
    for (i2 = 0; i2 < circles.length; i2++) {
      var mm2 = circles[i2].match(/cx="([0-9.\-]+)" cy="([0-9.\-]+)" r="5" fill="(#[0-9a-f]{6})"/);
      if (mm2[3] !== '#3574d4') continue;
      var cx2 = parseFloat(mm2[1]), cy2 = parseFloat(mm2[2]);
      if (cx2 >= rx && cx2 <= rx + 128 && cy2 >= ry && cy2 <= ry + 24) inside++;
    }
    if (inside !== 5) containOk = false;
    L.push('P8e-' + (r2 + 1) + ' box at x=' + rx + ', y=' + ry + ' contains ' + inside + ' blue dots (expect 5)');
  }
  L.push('P8e every box holds exactly five blue dots=' + containOk + (containOk ? ' — PASS' : ' — FAIL'));
  var note = s.match(/<text x="170" y="200"[^>]*>([^<]+)<\/text>/);
  var nlen = note ? note[1].length : -1;
  L.push('P8f in-SVG note ' + nlen + ' chars (house limit 49)' + (nlen >= 0 && nlen <= 49 ? ' — PASS' : ' — FAIL'));
  return L;
});
B01FP.name.push('P9');
B01FP.pieces.push(function (ctx) {
  var L = [], pg = ctx.pg;
  var m = pg.match(/<svg[^>]*viewBox="0 0 340 110"[^>]*>([\s\S]*?)<\/svg>/);
  if (!m) { L.push('P9 fig2 svg block not found — FAIL'); return L; }
  var s = m[1];
  var band = s.match(/<rect x="120" y="30" width="120" height="28" fill="#dce8f7"\/>/);
  L.push('P9a legal-window band rect x=120..240 (values 0..5 at 24 px/unit) present=' + !!band + (band ? ' — PASS' : ' — FAIL'));
  var ticks = s.match(/<line x1="([0-9.\-]+)" y1="41" x2="[0-9.\-]+" y2="47" stroke="#555f6e" stroke-width="1.5"\/>/g) || [];
  var tickOk = ticks.length === 14, i;
  for (i = 0; i < ticks.length; i++) {
    var tx = parseFloat(ticks[i].match(/x1="([0-9.\-]+)"/)[1]);
    var v = (tx - 120) / 24;
    if (v !== Math.round(v) || v < -4 || v > 9) tickOk = false;
  }
  L.push('P9b ticks: ' + ticks.length + ' at x = 120+24v, v covering [-4,9] exactly, all linear=' + tickOk + (tickOk ? ' — PASS' : ' — FAIL'));
  var labels = s.match(/<text x="([0-9.\-]+)" y="62" font-size="10.5" text-anchor="middle" fill="#555f6e">([^<]+)<\/text>/g) || [];
  var labOk = labels.length === 14, j;
  for (j = 0; j < labels.length; j++) {
    var lm = labels[j].match(/x="([0-9.\-]+)" y="62"[^>]*>([^<]+)</);
    var lv = (parseFloat(lm[1]) - 120) / 24;
    var want = lv < 0 ? '\u2212' + (-lv) : '' + lv;
    if (lm[2] !== want) labOk = false;
  }
  L.push('P9c 14 tick labels match their values (Unicode minus for negatives)=' + labOk + (labOk ? ' — PASS' : ' — FAIL'));
  var marks = s.match(/<circle cx="([0-9.\-]+)" cy="44" r="4.5" fill="(#[0-9a-f]{6})"\/>/g) || [];
  var found = {}, mOk = marks.length === 3, k;
  for (k = 0; k < marks.length; k++) {
    var km = marks[k].match(/cx="([0-9.\-]+)" cy="44" r="4.5" fill="(#[0-9a-f]{6})"/);
    found[(parseFloat(km[1]) - 120) / 24] = km[2];
  }
  mOk = mOk && found[2] === '#3574d4' && found[7] === '#c25b4a' && found[-3] === '#c25b4a';
  L.push('P9d markers: v=2 blue (in window), v=7 and v=-3 red (outside)=' + mOk + (mOk ? ' — PASS' : ' — FAIL'));
  var lbl3 = s.match(/<text x="48"[^>]*fill="#c25b4a">([^<]+)<\/text>/);
  var lbl2 = s.match(/<text x="168"[^>]*fill="#3574d4">([^<]+)<\/text>/);
  var lbl7 = s.match(/<text x="288"[^>]*fill="#c25b4a">([^<]+)<\/text>/);
  var lab3ok = !!(lbl3 && lbl2 && lbl7 && lbl3[1] === 'r = \u22123 \u2717' && lbl2[1] === 'r = 2 \u2713' && lbl7[1] === 'r = 7 \u2717');
  L.push('P9e marker labels "r = \u22123 \u2717", "r = 2 \u2713", "r = 7 \u2717"=' + lab3ok + (lab3ok ? ' — PASS' : ' — FAIL'));
  var arrow = s.match(/<polygon points="316,39.5 326,44 316,48.5" fill="#555f6e"\/>/);
  L.push('P9f number-line arrowhead present=' + !!arrow + (arrow ? ' — PASS' : ' — FAIL'));
  var note = s.match(/<text x="170" y="96"[^>]*>([^<]+)<\/text>/);
  var nlen = note ? note[1].length : -1;
  L.push('P9g in-SVG note ' + nlen + ' chars (house limit 49)' + (nlen >= 0 && nlen <= 49 ? ' — PASS' : ' — FAIL'));
  return L;
});
B01FP.name.push('P10');
B01FP.pieces.push(function (ctx) {
  var L = [], pg = ctx.pg;
  var m = pg.match(/<svg[^>]*viewBox="0 0 340 208"[^>]*>([\s\S]*?)<\/svg>/);
  if (!m) { L.push('P10 fig3 svg block not found — FAIL'); return L; }
  var s = m[1];
  var half = 62 * Math.SQRT1_2;
  var exp = [
    { cx: 170 + half, cy: 92 - half, lab: '7' },
    { cx: 170 + half, cy: 92 + half, lab: '9' },
    { cx: 170 - half, cy: 92 + half, lab: '3' },
    { cx: 170 - half, cy: 92 - half, lab: '1' }
  ];
  var nodes = s.match(/<circle cx="([0-9.\-]+)" cy="([0-9.\-]+)" r="16"[^>]*\/>/g) || [];
  var nodeOk = nodes.length === 4, i;
  for (i = 0; i < nodes.length; i++) {
    var nm = nodes[i].match(/cx="([0-9.\-]+)" cy="([0-9.\-]+)" r="16"/);
    if (Math.abs(parseFloat(nm[1]) - exp[i].cx) > 0.005 || Math.abs(parseFloat(nm[2]) - exp[i].cy) > 0.005) nodeOk = false;
  }
  L.push('P10a four nodes at the square positions (center (170,92), R=62, 45-degree offsets)=' + nodeOk + (nodeOk ? ' — PASS' : ' — FAIL'));
  var labels = s.match(/<text x="([0-9.\-]+)" y="([0-9.\-]+)" font-size="13" text-anchor="middle" fill="#3a4a5e"[^>]*>([^<]+)<\/text>/g) || [];
  var labOk = labels.length === 4, j;
  for (j = 0; j < labels.length; j++) {
    var lm = labels[j].match(/x="([0-9.\-]+)" y="([0-9.\-]+)"[^>]*>([^<]+)</);
    var lx = parseFloat(lm[1]), ly = parseFloat(lm[2]);
    var hit = false;
    for (i = 0; i < 4; i++) if (Math.abs(lx - exp[i].cx) < 0.005 && Math.abs(ly - (exp[i].cy + 4.5)) < 0.005 && lm[3] === exp[i].lab) hit = true;
    if (!hit) labOk = false;
  }
  L.push('P10b node labels 7, 9, 3, 1 at their node centers=' + labOk + (labOk ? ' — PASS' : ' — FAIL'));
  var hi = s.match(/<circle cx="126.16" cy="48.16" r="16" fill="#fbe4e0" stroke="#c25b4a" stroke-width="2.5"\/>/);
  L.push('P10c node "1" (the 7^100 landing) highlighted red=' + !!hi + (hi ? ' — PASS' : ' — FAIL'));
  var arrows = [
    { line: '<line x1="213.84" y1="66.16" x2="213.84" y2="111.14"', tip: [213.84, 118.14], target: [213.84, 135.84], name: '7->9' },
    { line: '<line x1="195.84" y1="135.84" x2="150.86" y2="135.84"', tip: [143.86, 135.84], target: [126.16, 135.84], name: '9->3' },
    { line: '<line x1="126.16" y1="117.84" x2="126.16" y2="72.86"', tip: [126.16, 65.86], target: [126.16, 48.16], name: '3->1' },
    { line: '<line x1="144.16" y1="48.16" x2="189.14" y2="48.16"', tip: [196.14, 48.16], target: [213.84, 48.16], name: '1->7' }
  ];
  var arrOk = true;
  for (j = 0; j < arrows.length; j++) {
    var li = s.indexOf(arrows[j].line);
    if (li === -1) { arrOk = false; continue; }
    if (j > 0 && s.indexOf(arrows[j].line) < s.indexOf(arrows[j - 1].line)) arrOk = false;
    var dx = arrows[j].tip[0] - arrows[j].target[0], dy = arrows[j].tip[1] - arrows[j].target[1];
    var gap = Math.sqrt(dx * dx + dy * dy) - 16;
    if (gap < 0 || gap > 2.5) arrOk = false;
  }
  L.push('P10d four arrows in document order 7->9, 9->3, 3->1, 1->7, tips within 2.5 px of the target node edge=' + arrOk + (arrOk ? ' — PASS' : ' — FAIL'));
  var note = s.match(/<text x="170" y="196"[^>]*>([^<]+)<\/text>/);
  var nlen = note ? note[1].length : -1;
  L.push('P10e in-SVG note ' + nlen + ' chars (house limit 49)' + (nlen >= 0 && nlen <= 49 ? ' — PASS' : ' — FAIL'));
  var svgs = pg.match(/<svg[\s\S]*?<\/svg>/g) || [];
  var sane = svgs.length === 3, q, c;
  for (q = 0; q < svgs.length; q++) {
    var vb = svgs[q].match(/viewBox="0 0 ([0-9]+) ([0-9]+)"/);
    if (!vb) { sane = false; continue; }
    var W = parseFloat(vb[1]), H = parseFloat(vb[2]);
    if (svgs[q].indexOf('href') !== -1) sane = false;
    var xs = svgs[q].match(/(?:^|[\s\"])(?:x|cx|x1|x2)=\"([0-9.\-]+)\"/g) || [];
    for (c = 0; c < xs.length; c++) { var xv = parseFloat(xs[c].match(/\"([0-9.\-]+)\"/)[1]); if (xv < 0 || xv > W) sane = false; }
    var ys = svgs[q].match(/(?:^|[\s\"])(?:y|cy|y1|y2)=\"([0-9.\-]+)\"/g) || [];
    for (c = 0; c < ys.length; c++) { var yv = parseFloat(ys[c].match(/\"([0-9.\-]+)\"/)[1]); if (yv < 0 || yv > H) sane = false; }
    var polys = svgs[q].match(/points="([^"]+)"/g) || [];
    for (c = 0; c < polys.length; c++) {
      var pts = polys[c].match(/points=\"([^\"]+)\"/)[1].split(' ');
      for (var pt = 0; pt < pts.length; pt++) {
        var xy = pts[pt].split(',');
        if (parseFloat(xy[0]) < 0 || parseFloat(xy[0]) > W || parseFloat(xy[1]) < 0 || parseFloat(xy[1]) > H) sane = false;
      }
    }
  }
  L.push('P10f global SVG sanity: 3 svgs, all with viewBox, no hrefs, every coordinate (incl. polygon points) inside its viewBox=' + sane + (sane ? ' — PASS' : ' — FAIL'));
  return L;
});
// Driver: runs every piece against the shipped page bytes and returns the
// honest transcript. The verdict counts lines containing FAIL.
function b01fpRun(ctx) {
  var out = [], i, j, k;
  for (i = 0; i < B01FP.pieces.length; i++) {
    out.push('');
    out.push('B01 FORMAT-PASS ' + B01FP.name[i] + ' — 2026-10-28');
    var L = B01FP.pieces[i](ctx);
    for (j = 0; j < L.length; j++) out.push(L[j]);
  }
  var fails = 0;
  for (k = 0; k < out.length; k++) if (out[k].indexOf('FAIL') !== -1) fails++;
  out.push('');
  out.push('VERDICT: FAIL lines = ' + fails + (fails === 0 ? ' — ALL PIECES PASS' : ' — FAILURES PRESENT'));
  return out;
}
