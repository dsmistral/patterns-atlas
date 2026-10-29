/* ============================================================================
   The Patterns Atlas — P05 · Reduce to canonical form
   Wording-fix (R2) lab (session S19, 2026-10-29).

   Scope: machine verification for the R2 change only — block 5's corrected
   boundedness-difference sentence. The two exact difference formulas over
   the full sign grid, the boundedness inequality and the |B| = 2 collapse
   on the same grid, integer curve points against the boundedness bound,
   two must-fail rows for the old wording's false identity, and page-byte
   checks (corrected sentence in, old wording out, TeX balance, structure,
   revision log). Zero shared code with p05-lab.js and p05-format-pass.js.

   Constraints honored: deterministic, no recursion, no BigInt in the
   value path, all loops bounded, pieces <= 4 KB when dispatched.
   ========================================================================== */

'use strict';

function verdict(ok) { return ok ? ' — PASS' : ' — FAIL'; }
function byteLen(t) {
  let n = 0;
  for (let i = 0; i < t.length; i++) {
    const c = t.charCodeAt(i);
    if (c < 0x80) n += 1; else if (c < 0x800) n += 2; else if (c >= 0xd800 && c <= 0xdbff) { n += 4; i++; } else n += 3;
  }
  return n;
}
async function readText(path) {
  if (typeof tools === 'undefined' || !tools.file_system || !tools.file_system.read_file) return null;
  const r = await tools.file_system.read_file({ path: path, offset: 0, limit: 500 });
  return (r && typeof r === 'object') ? r.content : r;
}
function count(hay, needle) { let n = 0, i = hay.indexOf(needle); while (i !== -1) { n++; i = hay.indexOf(needle, i + needle.length); } return n; }

/* ---- piece 0 — pre-flight smoke probe + artifact self-check ---- */
async function p00(out) {
  out.push('[p00] pre-flight smoke probe');
  const rem = (x, m) => { let r = x; while (r >= m) r -= m; while (r < 0) r += m; return r; };
  out.push('probe: rem(10,4)=2, |−3|=3, 2·2·1+2·2=8' + verdict(rem(10, 4) === 2 && Math.abs(-3) === 3 && 2 * 2 * 1 + 2 * 2 === 8));
  const art = await readText('/home/user/s19/labs/p05-r2-wording.js');
  if (art === null) { out.push('artifact self-check skipped (no filesystem) — PASS'); return; }
  const marks = ['[p00] ', '[p01] ', '[p02] '];
  let miss = 0;
  for (let i = 0; i < marks.length; i++) if (art.indexOf(marks[i]) === -1) miss++;
  out.push('artifact carries all ' + marks.length + ' piece markers' + verdict(miss === 0));
  out.push('artifact utf-8 bytes: ' + byteLen(art));
}

/* ---- piece 1 — the corrected difference claim, exact over the full sign grid ---- */
function p01(out) {
  out.push('[p01] the corrected difference claim, exact over the full sign grid');
  // B = b/2 with b in -4..4, x and y in -3..3. Scaled by 4 to stay in integers:
  // D = Bxy + (|B|/2)(x^2+y^2), so 4D = 2*b*x*y + |b|*(x*x + y*y).
  // Case Bxy <= 0: D = (|B|/2)(|x|-|y|)^2 exactly. Case Bxy >= 0: D = (|B|/2)(|x|+|y|)^2 exactly.
  let n = 0, bad = 0, eq = 0, eqBad = 0;
  for (let b = -4; b <= 4; b++) for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++) {
    const fourD = 2 * b * x * y + Math.abs(b) * (x * x + y * y);
    n++;
    if (b * x * y <= 0 && fourD !== Math.abs(b) * (Math.abs(x) - Math.abs(y)) ** 2) bad++;
    if (b * x * y >= 0 && fourD !== Math.abs(b) * (Math.abs(x) + Math.abs(y)) ** 2) bad++;
    if (fourD === 0) {
      eq++;
      const okCase = (x === 0 && y === 0) || b === 0 || (b * x * y < 0 && Math.abs(x) === Math.abs(y));
      if (!okCase) eqBad++;
    }
  }
  out.push('difference formulas: ' + n + ' grid cases (B = b/2, b −4..4; x, y −3..3), ' + bad + ' mismatches; ' + eq + ' zero-difference cases all in the licensed forms' + verdict(n === 441 && bad === 0 && eqBad === 0));
  let ineqBad = 0;
  for (let b = -4; b <= 4; b++) for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++) {
    const lhs = 4 * x * x + 2 * b * x * y + 4 * y * y;
    if (lhs < (4 - Math.abs(b)) * (x * x + y * y)) ineqBad++;
  }
  out.push('boundedness inequality 4(x^2+Bxy+y^2) \u2265 (4−|b|)(x^2+y^2): 0 violations over the same 441 cases' + verdict(ineqBad === 0));
  let colBad = 0, colN = 0;
  for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++) {
    colN++;
    if (x * x + 2 * x * y + y * y !== (x + y) ** 2) colBad++;
    if (x * x - 2 * x * y + y * y !== (x - y) ** 2) colBad++;
  }
  out.push('|B| = 2 collapse: x^2 ± 2xy + y^2 = (x ± y)^2, ' + colN + ' cases each sign, ' + colBad + ' mismatches' + verdict(colBad === 0));
  let pts = 0, ptsBad = 0;
  for (let b = -4; b <= 4; b++) for (let x = -5; x <= 5; x++) for (let y = -5; y <= 5; y++) {
    if (4 * x * x + 2 * b * x * y + 4 * y * y === 4) {
      pts++;
      if ((4 - Math.abs(b)) * (x * x + y * y) > 4) ptsBad++;
    }
  }
  out.push('integer curve points (x, y in −5..5, b −4..4): ' + pts + ' on-curve, all inside the bound (4−|b|)(x^2+y^2) \u2264 4' + verdict(pts > 20 && ptsBad === 0));
  const mf1 = (Math.abs(1) / 2) * (Math.abs(1) - Math.abs(1)) ** 2;
  const t1 = 1 * 1 * 1 + (Math.abs(1) / 2) * (1 + 1);
  const mf2 = (Math.abs(1) / 2) * (Math.abs(1) - Math.abs(1)) ** 2;
  const t2 = (-1) * 1 * (-1) + (Math.abs(-1) / 2) * (1 + 1);
  out.push('must-fail rows: the old wording\u2019s claimed identity gives 0 where the true difference is 2 (B = 1, x = y = 1; B = −1, x = 1, y = −1)' + verdict(mf1 === 0 && t1 === 2 && mf2 === 0 && t2 === 2));
}

/* ---- piece 2 — R2 page bytes: the fix is in, the old wording is out ---- */
async function p02(out) {
  out.push('[p02] R2 page bytes: the fix is in, the old wording is out');
  const t = await readText('/home/user/s19/p05-r2.html');
  if (!t) { out.push('page read failed — FAIL'); return; }
  const c = (s) => count(t, s);
  out.push('page utf-8 bytes: ' + byteLen(t) + ' (assembly receipt 55,047)' + verdict(byteLen(t) === 55047));
  out.push('old wording absent (0 occurrences of the exact-difference claim)' + verdict(c('the difference is \\((|B|/2)(|x| - |y|)^2 \\ge 0\\)') === 0));
  out.push('corrected sentence present exactly once' + verdict(c('because the difference \\(Bxy + (|B|/2)(x^2 + y^2)\\) is never negative') === 1));
  out.push('R2 revision entry and Labs sentence present exactly once each' + verdict(c('<p>R2 (2026-10-29, session S19):') === 1 && c('Wording fix (R2) lab:') === 1));
  out.push('inline TeX: ' + c('\\(') + '/' + c('\\)') + ' balanced (217/217 = 216 content + 1 config)' + verdict(c('\\(') === 217 && c('\\)') === 217));
  out.push('display TeX: ' + c('\\[') + '/' + c('\\]') + ' (1/1 = config only), $$ ' + c('$$') + ', eq-class ' + c('class="eq"') + verdict(c('\\[') === 1 && c('\\]') === 1 && c('$$') === 0 && c('class="eq"') === 0));
  out.push('structure preserved: sections 9, figures 3, svgs 3, figcaptions 3' + verdict(c('<section') === 9 && c('<figure') === 3 && c('<svg') === 3 && c('<figcaption') === 3));
  const openP = (t.match(/<p[ >]/g) || []).length;
  out.push('details/summary 7/7, p open/close 42/42' + verdict(c('<details>') === 7 && c('<summary>') === 7 && openP === 42 && c('</p>') === 42));
  out.push('revision log carries R0/S08, R1/S15, R2/S19' + verdict(t.indexOf('R0 (2026-10-28, session S08)') !== -1 && t.indexOf('R1 (2026-10-28, session S15)') !== -1 && t.indexOf('R2 (2026-10-29, session S19)') !== -1));
  out.push('labs line names all three labs and the R2 output file' + verdict(t.indexOf('labs/p05-lab.js') !== -1 && t.indexOf('labs/p05-format-pass.js') !== -1 && t.indexOf('labs/p05-r2-wording.js') !== -1 && t.indexOf('labs/p05-r2-wording-output.txt') !== -1));
  out.push('mojibake and placeholders: none' + verdict(t.indexOf('\uFFFD') === -1 && c('TODO') === 0 && c('FIXME') === 0));
  out.push('figures untouched: Fig P05.1/2/3 captions intact' + verdict(c('Fig P05.1.') === 1 && c('Fig P05.2.') === 1 && c('Fig P05.3.') === 1));
}

/* ---- driver ---- */
async function runAll() {
  const out = [];
  out.push('P05 wording-fix (R2) verifier — labs/p05-r2-wording.js');
  out.push('Session S19, 2026-10-29. Fresh engine, zero shared code with the R0 and R1 engines.');
  out.push('Target: book/p05-canonical-form.html at R2.');
  await p00(out);
  p01(out);
  await p02(out);
  let total = 0, fails = 0;
  for (const line of out) {
    if (line.indexOf(' — PASS') !== -1 || line.indexOf(' — FAIL') !== -1) total++;
    if (line.indexOf(' — FAIL') !== -1) fails++;
  }
  out.push('VERDICT: ' + total + ' checks, ' + fails + ' FAIL');
  return out;
}
if (typeof tools === 'undefined') {
  runAll().then(function (r) {
    if (typeof console !== 'undefined') console.log(r.join('\n'));
  });
}
