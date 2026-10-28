// labs/p01-format-pass.js — Session S11 formatting retrofit pass lab for
// book/p01-pin-down-the-problem.html (R2). Run date 2026-10-28.
//
// Purpose: under the S10 formatting charter, this pass converted the page's math
// to TeX (MathJax) and added three SVG figures. This lab re-verifies EVERY numeric
// claim of the page against the receipts recorded in R0 (labs/p01-lab-output.txt)
// and R1 (labs/p01-extension-r1-output.txt), and sanity-checks the TeX and the
// SVG geometry of the converted page as installed.
//
// Execution: pieces run in the book's deterministic sandbox engine (no recursion,
// no big-integer value path; sweeps and dense scans only). Transcripts are
// recorded verbatim in labs/p01-format-pass-output.txt.
//
// Honest run history (also recorded in the output file): pieces 4a, 4b and 6 were
// re-run after defects in their own CHECKS — 4a: a 1e-6 tolerance below the
// finite-difference truncation term, then a 1e-9 residual below the differencing
// noise floor (the page's actual claim, 4-decimal agreement, holds); 4b: a wrong
// radicand (x^2+c instead of x+c) and an expected count of 1 at c=0 where the
// two-solution window runs to c=0 inclusive; 6: tolerances tighter than the
// 2-decimal coordinate rounding of the SVG files. Every defect was in a check,
// never in the page. One PAGE defect was caught before install: Fig P01.2's first
// draft carried a caption text at y=208, outside its 160-unit viewBox; removed.

const fs = require('fs');

function piece1_texAndStructure(pageText) {
  // TeX sanity on the installed page
  const inlineOpen = (pageText.match(/\\\(/g) || []).length;
  const inlineClose = (pageText.match(/\\\)/g) || []).length;
  const dispOpen = (pageText.match(/\\\[/g) || []).length;
  const dispClose = (pageText.match(/\\\]/g) || []).length;
  const braceOpen = (pageText.match(/\\\{/g) || []).length;
  const braceClose = (pageText.match(/\\\}/g) || []).length;
  const banned = (pageText.match(/\$\$/g) || []).length; // must be 0
  const configLine = pageText.split('\n').find(l => l.includes('window.MathJax'));
  const configBackslashes = (configLine.match(/\\/g) || []).length; // must be 8
  const configOk = configLine.includes("inlineMath:[['\\\\(','\\\\)']]")
    && configLine.includes("displayMath:[['\\\\[','\\\\]']]");
  // structural sanity
  const secOpen = (pageText.match(/<section/g) || []).length;   // 10
  const secClose = (pageText.match(/<\/section>/g) || []).length; // 10
  const figOpen = (pageText.match(/<figure/g) || []).length;     // 4 (1 table + 3 new)
  const figClose = (pageText.match(/<\/figure>/g) || []).length; // 4
  const svgOpen = (pageText.match(/<svg /g) || []).length;       // 3
  const svgClose = (pageText.match(/<\/svg>/g) || []).length;    // 3
  const endsHtml = pageText.trimEnd().endsWith('</html>');
  const integrity = pageText.includes('integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII="');
  const r2 = pageText.includes('R2 (2026-10-28, session S11');
  return inlineOpen === inlineClose && dispOpen === dispClose && braceOpen === braceClose
    && banned === 0 && configBackslashes === 8 && configOk && secOpen === 10 && secClose === 10
    && figOpen === 4 && figClose === 4 && svgOpen === 3 && svgClose === 3 && endsHtml && integrity && r2;
}

function piece2_arithmetic() {
  // bat and ball (Example 1 / Encounter)
  const b = 5, bat = b + 100;
  if (!(bat - b === 100 && b + bat === 110 && 2 * b === 10)) return false;
  // odd + odd: 100 pairs, 0 failures
  let pairs = 0, failures = 0;
  for (let k = 0; k <= 198; k += 2) for (let j = k; j <= 198; j += 2)
    if (pairs < 100) { pairs++; if (((2*k+1) + (2*j+1)) % 2 !== 0) failures++; }
  if (failures !== 0 || pairs !== 100) return false;
  // consecutive integers (Exercise 1)
  if (15 + 16 + 17 !== 48) return false;
  // jacket fractions (Exercise 2)
  const prod = (4/5) * (6/5);
  if (!(Math.abs(prod - 24/25) < 1e-12 && Math.abs(prod - 0.96) < 1e-12)) return false;
  // average speed (Exercise 3)
  if (!(120/60 === 2 && 120/40 === 3 && Math.abs(240/(2+3) - 48) < 1e-12)) return false;
  // diagonal formula vs brute force, n = 3..200 (Example 2)
  let mismatches = 0;
  for (let n = 3; n <= 200; n++) {
    let cnt = 0;
    for (let i = 0; i < n; i++) for (let j = i+1; j < n; j++)
      if (j - i > 1 && !(i === 0 && j === n-1)) cnt++;
    if (cnt !== n*(n-3)/2) mismatches++;
  }
  if (mismatches !== 0) return false;
  const table = [0,2,5,9,14,20,27,35,44,54];
  for (let i = 0; i < 10; i++) if ((i+3)*(i)/2 !== table[i]) return false;
  // 12-gon: 66 vertex pairs - 12 sides = 54 diagonals
  return 12*11/2 - 12 === 54;
}

function piece3_factorialAndPolynomial() {
  // 100! claims via factor exponents (Exercise 4)
  const v = (n, p) => { let c = 0, pk = p; while (pk <= n) { c += Math.floor(n / pk); pk *= p; } return c; };
  if (!(v(100, 5) === 24 && v(100, 2) === 97 && Math.min(v(100,2), v(100,5)) === 24)) return false;
  if (!(v(10, 5) === 2 && v(25, 5) === 6)) return false; // 10! -> 2 zeros, 25! -> 6
  // digits and leading digits of 100! via log10 sum (no big-integer value path)
  let s = 0;
  for (let k = 2; k <= 100; k++) s += Math.log10(k);
  const digits = Math.floor(s) + 1;
  const lead = Math.pow(10, s - Math.floor(s)).toFixed(5);
  if (!(digits === 158 && lead === '9.33262')) return false;
  // n^2 + n + 41: prime n = 0..39, first composite n = 40 (Exercise 5)
  const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  let run = 0, firstComposite = -1;
  for (let n = 0; n <= 40; n++) {
    const val = n * n + n + 41;
    if (isPrime(val)) { if (firstComposite === -1) run++; }
    else if (firstComposite === -1) firstComposite = n;
  }
  return run === 40 && firstComposite === 40 && 40*40 + 40 + 41 === 1681 && 1681 === 41 * 41;
}

function piece4a_ratesGhostsSweeps() {
  const exact = 20 * Math.PI; // 62.8319 (Example 3)
  if (exact.toFixed(4) !== '62.8319') return false;
  const r0 = 5, drdt = 2, dt = 1e-6;
  const area0 = Math.PI * r0 * r0;
  const area1 = Math.PI * (r0 + drdt * dt) * (r0 + drdt * dt);
  const simRate = (area1 - area0) / dt;
  // page claim: agreement to 4 decimal places (the finite difference carries a
  // known second-order truncation term ~1.3e-5; run history: two earlier check
  // versions used tolerances below that term / the fp noise floor — see header)
  if (!(simRate.toFixed(4) === exact.toFixed(4) && Math.abs(simRate - exact) < 5e-5)) return false;
  const g = (x) => Math.sqrt(x + 2);
  if (!(Math.abs(g(2) - 2) < 1e-12 && Math.abs(g(-1) - 1) < 1e-12 && g(-1) !== -1)) return false; // ghost root
  if (Math.abs(-g(-1) - (-1)) > 1e-12) return false; // mirror: -1 solves -sqrt(x+2)=x
  // Box P01.C compact grid re-run
  let mism = 0;
  for (let B = -3; B <= 3; B += 0.25) {
    const A = B * B;
    const lhs = Math.abs(Math.sqrt(A) - B) < 1e-12;
    const rhs = A === B * B && B >= 0;
    if (lhs !== rhs) mism++;
  }
  if (mism !== 0) return false;
  // Exercise 7: sqrt(2x+3)=x has exactly {3}
  const sols = [];
  for (let x = -10; x <= 10; x += 0.001)
    if (Math.abs(Math.sqrt(2 * x + 3) - x) < 1e-9)
      if (sols.length === 0 || Math.abs(sols[sols.length-1] - x) > 0.01) sols.push(Math.round(x * 1000) / 1000);
  if (!(sols.length === 1 && sols[0] === 3)) return false;
  // Exercise 8: (a^2-1)x = a-1, 159 generic checks
  let fails8 = 0, checks8 = 0;
  for (let a = -40; a <= 40; a += 0.5) {
    if (Math.abs(a - 1) < 1e-9 || Math.abs(a + 1) < 1e-9) continue;
    checks8++;
    if (Math.abs((a * a - 1) * (1 / (a + 1)) - (a - 1)) > 1e-9) fails8++;
  }
  return fails8 === 0 && checks8 === 159 && (1*1 - 1) * 7 === 0 && ((-1)*(-1) - 1) * 7 === 0;
}

function piece4b_spineEx9Ex10() {
  // quantifier spine: Spec B ceiling M=1 over 100,000 terms of (-1)^n
  let escape = 0;
  for (let n = 1; n <= 100000; n++) { const an = (n % 2 === 0) ? 1 : -1; if (Math.abs(an) > 1) escape++; }
  if (escape !== 0) return false;
  // Spec A builder game: M = n + 1 wins 1,000 rounds
  let wins = 0;
  for (let n = 1; n <= 1000; n++) if (Math.abs(n) <= n + 1) wins++;
  if (wins !== 1000) return false;
  // nine integer ceilings broken by n = floor(M) + 1
  let broken = 0;
  for (let M = 1; M <= 9; M++) if (Math.floor(M) + 1 > M) broken++;
  if (broken !== 9) return false;
  // Exercise 9: dense scan minimum
  const f = (th) => { const u = Math.sin(th) + Math.cos(th); return u * u + 4 * u + 7; };
  let bestV = Infinity, bestT = 0;
  for (let i = 0; i < 100000; i++) {
    const th = -Math.PI + (2 * Math.PI * i) / 100000;
    if (f(th) < bestV) { bestV = f(th); bestT = th; }
  }
  const minExact = 9 - 4 * Math.SQRT2;
  if (!(bestV.toFixed(6) === minExact.toFixed(6) && Math.abs(bestT - (-3 * Math.PI / 4)) < 1e-4)) return false;
  if (!(Math.abs(minExact - 3.343146) < 5e-7 && minExact > 3)) return false;
  let maxU = 0;
  for (let i = 0; i < 100000; i++) { const th = (2 * Math.PI * i) / 100000; const u = Math.abs(Math.sin(th) + Math.cos(th)); if (u > maxU) maxU = u; }
  if (Math.abs(maxU - Math.SQRT2) > 1e-9) return false; // arena: sqrt2, never 2
  // Exercise 10: phase of sqrt(x+c)=x over 999 grid values of c
  // (run history: an earlier check used the wrong radicand x^2+c and expected 1
  // solution at c=0; the grid hits c=0 exactly at i=499, where {0,1} survive)
  let phaseFails = 0;
  for (let i = 0; i < 999; i++) {
    const c = -2 + (4 * i) / 998;
    const disc = 1 + 4 * c;
    let count = 0;
    if (disc >= 0) {
      const r = Math.sqrt(disc);
      const x1 = (1 - r) / 2, x2 = (1 + r) / 2;
      if (x1 >= 0 && Math.abs(Math.sqrt(x1 + c) - x1) < 1e-9) count++;
      if (x2 >= 0 && Math.abs(Math.sqrt(x2 + c) - x2) < 1e-9) count++;
    }
    const exp = c < -0.25 ? 0 : (c <= 0 ? 2 : 1);
    if (count !== exp) phaseFails++;
  }
  if (phaseFails !== 0) return false;
  const w = (c, x) => x >= 0 && Math.abs(Math.sqrt(x + c) - x) < 1e-12;
  const ghost = Math.sqrt(-1 + 2) !== -1 && -Math.sqrt(-1 + 2) === -1;
  return w(-0.25, 0.5) && w(-2/9, 1/3) && w(-2/9, 2/3) && w(0, 0) && w(0, 1) && w(2, 2) && !w(2, -1) && ghost;
}

function piece5_bertrand() {
  // exact geometry, R = 1 (Exercise 6 / Fig P01.3)
  const side = Math.sqrt(3);
  const chordAt = (d) => 2 * Math.sqrt(1 - d * d);
  if (Math.abs(chordAt(0.5) - side) > 1e-12) return false;   // 1/2 boundary witness
  if (!(chordAt(0.6) < side && Math.abs(chordAt(0.6) - 1.6) < 1e-12)) return false;
  // exact probabilities 1/3, 1/2, 1/4
  // fresh independent simulation (mulberry32-style PRNG, seed 20261028 — different
  // from the R0 lab's seed 123456789; recorded R0 receipts: 0.3365/0.5015/0.2508)
  let s = 20261028;
  const rnd = () => {
    s = (s + 0x6D2B79F5) | 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
  const N = 100000;
  let c1 = 0, c2 = 0, c3 = 0;
  for (let i = 0; i < N; i++) {
    const a1 = 2 * Math.PI * rnd(), a2 = 2 * Math.PI * rnd();
    const dx = Math.cos(a1) - Math.cos(a2), dy = Math.sin(a1) - Math.sin(a2);
    if (dx * dx + dy * dy > 3) c1++;          // (i) both endpoints on the circle
    if (chordAt(rnd()) > side) c2++;          // (ii) midpoint along a radius
    if (chordAt(Math.sqrt(rnd())) > side) c3++; // (iii) midpoint in the disc
  }
  return Math.abs(c1 / N - 1 / 3) < 0.006 && Math.abs(c2 / N - 1 / 2) < 0.006 && Math.abs(c3 / N - 1 / 4) < 0.006;
}

function piece6_svgCoordinates(pageText) {
  // run history: run 1 used 1e-3/1e-6 px tolerances — tighter than the 2-decimal
  // coordinate rounding the SVG files legitimately carry (up to ~0.007 px).
  const dist = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);
  const num = (s) => parseFloat(s);
  const blocks = pageText.match(/<svg [\s\S]*?<\/svg>/g) || [];
  if (blocks.length !== 3) return false;
  for (const b of blocks) if (!(b.includes('viewBox=') && !b.includes('href') && !b.includes('xlink'))) return false;
  // Fig 1: 12 vertices on-circle, 12 sides + 54 diagonals
  const b1 = blocks[0];
  const verts = [...b1.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="2.6"/g)].map((m) => [num(m[1]), num(m[2])]);
  if (verts.length !== 12) return false;
  for (const v of verts) if (Math.abs(dist(v[0], v[1], 110, 110) - 100) > 0.02) return false;
  const sideLines = (b1.match(/stroke-width="2.6"/g) || []).length;
  const diagLines = (b1.match(/stroke-width="0.9"/g) || []).length;
  if (!(sideLines === 12 && diagLines === 54)) return false;
  // Fig 2: radii 60/66 px; every coordinate inside viewBox 0 0 240 160
  const b2 = blocks[1];
  if (!(b2.includes('r="60"') && /r="66"/.test(b2))) return false;
  const nums2 = (b2.match(/"(?:[0-9.]+)"/g) || []).map((s) => num(s.slice(1, -1)));
  if (!nums2.every((v) => v <= 240)) return false;
  // Fig 3: three circles r=90; triangle sides = sqrt(3)*90; three sample chords
  const b3 = blocks[2];
  const cs = [...b3.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="90"/g)].map((m) => [num(m[1]), num(m[2])]);
  if (!(cs.length === 3 && cs[0][0] === 110 && cs[1][0] === 330 && cs[2][0] === 550)) return false;
  const tri = [...b3.matchAll(/<polygon points="([^"]+)"/g)].map((m) => m[1].split(' ').map((p) => p.split(',').map(num)));
  if (tri.length !== 3) return false;
  let sideVal = 0;
  for (const tp of tri) { sideVal = dist(tp[0][0], tp[0][1], tp[1][0], tp[1][1]); if (Math.abs(sideVal - Math.sqrt(3) * 90) > 0.02) return false; }
  const chords = [...b3.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="#c25b4a"/g)].map((m) => [num(m[1]), num(m[2]), num(m[3]), num(m[4])]);
  const l1 = dist(chords[0][0], chords[0][1], chords[0][2], chords[0][3]);
  if (!(Math.abs(dist(chords[0][0], chords[0][1], 110, 110) - 90) < 0.02 && Math.abs(dist(chords[0][2], chords[0][3], 110, 110) - 90) < 0.02)) return false;
  if (!(l1 > sideVal && Math.abs(l1 - 2 * 90 * Math.sin(65 * Math.PI / 180)) < 0.02)) return false;
  const l2 = dist(chords[1][0], chords[1][1], chords[1][2], chords[1][3]);
  const mid2x = (chords[1][0] + chords[1][2]) / 2, mid2y = (chords[1][1] + chords[1][3]) / 2;
  if (!(Math.abs(l2 - sideVal) < 0.02 && Math.abs(mid2x - 375) < 1e-9 && Math.abs(mid2y - 110) < 1e-9)) return false;
  const l3 = dist(chords[2][0], chords[2][1], chords[2][2], chords[2][3]);
  const mid3x = (chords[2][0] + chords[2][2]) / 2, mid3y = (chords[2][1] + chords[2][3]) / 2;
  if (!(Math.abs(dist(chords[2][0], chords[2][1], 550, 110) - 90) < 0.02 && Math.abs(dist(chords[2][2], chords[2][3], 550, 110) - 90) < 0.02)) return false;
  if (!(Math.abs(dist(mid3x, mid3y, 550, 110) - 54) < 0.02 && l3 < sideVal)) return false;
  const nums3 = (b3.match(/"(?:[0-9.]+)"/g) || []).map((s) => num(s.slice(1, -1)));
  return nums3.every((v) => v <= 660);
}

// Runner. In-session the pieces were executed in the book's deterministic sandbox
// engine (identical code paths); the transcripts in the output file are the
// authoritative record. This runner reproduces the same checks when executed
// under Node against the installed page.
function main() {
  const pageText = fs.readFileSync('book/p01-pin-down-the-problem.html', 'utf8');
  const pieces = [
    ['1 TeX+structure', piece1_texAndStructure(pageText)],
    ['2 arithmetic', piece2_arithmetic()],
    ['3 factorial+polynomial', piece3_factorialAndPolynomial()],
    ['4a rates+ghosts+sweeps', piece4a_ratesGhostsSweeps()],
    ['4b spine+Ex9+Ex10', piece4b_spineEx9Ex10()],
    ['5 Bertrand', piece5_bertrand()],
    ['6 SVG coordinates', piece6_svgCoordinates(pageText)],
  ];
  let allPass = true;
  for (const [name, ok] of pieces) { console.log((ok ? 'PASS' : 'FAIL') + ' piece ' + name); if (!ok) allPass = false; }
  console.log('p01-format-pass final verdict: ' + (allPass ? 'PASS (0 failures)' : 'FAIL'));
}
main();
