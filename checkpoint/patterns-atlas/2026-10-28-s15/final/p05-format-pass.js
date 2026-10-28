// ============================================================================
// The Patterns Atlas — labs/p05-format-pass.js
// Session S15 (formatting retrofit pass P05: R0 -> R1) — 2026-10-28
// ============================================================================
// SCOPE. book/p05-canonical-form.html was retrofitted from R0 (plain math
// notation) to R1 (TeX via MathJax, three new figures, labs-line extension,
// R1 revision entry). This lab is the formatting-pass verifier: a FRESH
// engine with zero shared code with the R0 battery (labs/p05-lab.js). It
// re-derives every numeric claim on the page from scratch, re-checks the
// structural gates of the R1 retrofit, and parses the three SVG figures
// from the shipped page bytes.
//
// HONEST RUN HISTORY (this session; the page's math never failed a check):
// - P1 structure+receipts: run 1 had a split-vs-newline-count defect
//   (verifier-side); run 2 expected 3 figure ids but the honest count is 6
//   (3 <strong> captions + 3 aria-labels — verifier-side); run 3 PASS;
//   run 4 = post-fill re-run on the final bytes (placeholder 0): PASS.
// - P2 surds: run 1 asserted the cross-product 50*18 = 11025 (a copy of
//   exercise 1's product) — verifier defect; correct is 900 = 30^2. Run 2
//   PASS.
// - P3 mod-7: run 1 PASS. P4 mod-13: run 1 PASS.
// - P5 fractions: run 1 PASS (fresh gcd chain: 9 remainder steps; the R0
//   battery recorded 11 by its subtraction-based accounting — same gcd 2;
//   honest note, no defect).
// - P6 parabolas: run 1 PASS. P7 nested radical: run 1 PASS.
// - P8 conic family: run 2 PASS WITH A GENUINE FINDING. Run 1 tested the
//   page's block-5 stated reason as an exact identity and failed at
//   1600/3969 grid points. The defect is in R0 PROSE (formatting passes
//   alter no math, so it is NOT fixed here — flagged as an R2 candidate):
//   the difference between the form and its lower bound is stated as
//   (|B|/2)(|x|-|y|)^2, which is exact only when sign(xy) = -sign(B);
//   otherwise it is a strict lower bound, not the difference. The R0
//   receipt inequality itself is TRUE (3969 checks, 0 violations), and the
//   true completed square — (B/2)(x+y)^2 for B >= 0, (|B|/2)(x-y)^2 for
//   B <= 0 — verifies with 0 mismatches.
// - P9 figs 1-2 from page bytes: run 1 PASS. P10 fig3: run 1 PASS.
//   Post-fill re-check of P9+P10 on the final bytes: PASS (run 2).
// - PAGE-SIDE figure defects in the FIRST assembly (fixed before the
//   final bytes, recorded in the page's R1 revision entry): fig1/fig2
//   in-SVG note texts were 68-69 chars (clipping risk; P04 precedent caps
//   around 40) and the fig2 note overlapped node 0 — reworded to 42/49
//   chars; fig P05.3's B=3 branch and the (-3,1) witness escaped panel 4
//   into panel 3's box and the viewBox — regenerated with a (u,v)
//   parametrisation of 5u^2-v^2=4, a containment filter [264,331]x[19,157],
//   209+209 samples.
// - No mathematical check of the page ever failed. Page bytes: pre-fill
//   52,155 -> final 53,177 (md5 2f8f6e27f9ae25778a50539fe6f7209a).
// This artifact is the composed record of the pieces as executed in-session
// via the sandbox harness (each piece <= 4KB, run standalone); the recorded
// transcripts are in labs/p05-format-pass-output.txt.
//
// DRIVER: node labs/p05-format-pass.js [pagePath [r0OutputPath]]
// - ARTIFACT VALIDATION (composition, this close-out): run 1 of the
//   composed artifact scored 8/10 — P7 candidate-order expectation
//   (the ascending scan yields [[-2,-1],[2,1]]) and a P9 caption regex
//   wrongly scoped to the <svg> block while <figcaption> lives in the
//   <figure> block; both verifier-side, fixed; run 2: 10/10 PASS
//   against the shipped bytes.
//
// Defaults: ../p05-canonical-form.html and ./p05-lab-output.txt relative to
// this file. Each piece returns { pass, ... }; the driver prints one
// verdict line per piece plus its check details.
// ============================================================================
'use strict';
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
function md5(s) { return crypto.createHash('md5').update(s, 'utf8').digest('hex'); }

// P1 — structure gates of the R1 retrofit + the R0 receipts re-confirmed.
function P1(page, r0out) {
  var cnt = function (re) { var m = page.match(re); return m ? m.length : 0; };
  var counts = {
    inlineOpen: cnt(/\\\(/g), inlineClose: cnt(/\\\)/g),
    displayOpen: cnt(/\\\[/g), displayClose: cnt(/\\\]/g),
    dollars: cnt(/\$\$/g), sections: cnt(/<section/g),
    figures: cnt(/<figure/g), svgs: cnt(/<svg/g), figcaptions: cnt(/<figcaption/g),
    htmlClose: cnt(/<\/html>/g),
    strongFig: cnt(/<strong>Fig P05\./g), ariaFig: cnt(/aria-label="Fig P05\./g),
    emdash: cnt(/\u2014/g), eqClass: cnt(/class="eq"/g), textAlign: cnt(/text-align/g),
    mojibake: cnt(/\uFFFD/g), placeholder: cnt(/PLACEHOLDER|TODO-FILL/g)
  };
  var mj = page.match(/<script>window\.MathJax[\s\S]*?tex-svg\.js[\s\S]*?<\/script>\n/);
  var gates = {
    inline_207_207_balanced: counts.inlineOpen === 207 && counts.inlineClose === 207,
    display_1_1_config_only: counts.displayOpen === 1 && counts.displayClose === 1,
    dollars_0: counts.dollars === 0,
    sections_9: counts.sections === 9,
    figures_svgs_captions_3: counts.figures === 3 && counts.svgs === 3 && counts.figcaptions === 3,
    fig_ids_6_strong3_aria3: counts.strongFig === 3 && counts.ariaFig === 3,
    html_close_1: counts.htmlClose === 1,
    emdash_115: counts.emdash === 115,
    eq_class_0: counts.eqClass === 0,
    text_align_0: counts.textAlign === 0,
    mojibake_0: counts.mojibake === 0,
    placeholder_0: counts.placeholder === 0,
    r1_entry_present: page.indexOf('Formatting pass (R1) lab') >= 0,
    mathjax_block_pinned: !!mj && md5(mj[0]) === '120928f52c10a789eef3606219254605'
  };
  var receipts = [
    'noForm=0 badSquarefree=0',
    '= 32 = (4sqrt2)^2',
    '= 243 = (9sqrt3)^2',
    '2026 = 7*289 + 3',
    'period=6',
    'cycle route=5',
    'remainder 2, NOT divisible',
    'floor(254.6112) + 1 = 255',
    '{0,1,3,4,9,10,12}',
    'x^2=3 at [4,9]',
    'gcd(2026, 4782) = 2',
    '2391 = 3*797'
  ];
  var missing = receipts.filter(function (s) { return r0out.indexOf(s) < 0; });
  var pass = Object.keys(gates).every(function (k) { return gates[k]; }) && missing.length === 0;
  return { piece: 'P1 structure + receipts', counts: counts, gates: gates,
           receiptsChecked: receipts.length, receiptsMissing: missing, pass: pass };
}

// P2 — the surd system re-derived from scratch (squarefree canonical form).
function P2() {
  function isSquare(n) { var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function squarefree(d) { for (var p = 2; p * p <= d; p++) { if (d % (p * p) === 0) return false; } return true; }
  var zero = 0, multi = 0, total = 0;
  for (var n = 2; n <= 500; n++) {
    var reps = 0;
    for (var a = 1; a * a <= n; a++) {
      if (n % (a * a) === 0 && squarefree(n / (a * a))) reps++;
    }
    total += reps;
    if (reps === 0) zero++;
    if (reps > 1) multi++;
  }
  // encounter A: (sqrt50 - sqrt18 + sqrt8)^2 — cross-products must be squares.
  // Run 1 wrongly asserted 50*18 = 11025 (a copy of exercise 1's product);
  // the correct cross-product is 900 = 30^2.
  var crossA = [50 * 18, 50 * 8, 18 * 8];
  var crossAok = crossA.every(isSquare);
  var encounterA = 50 + 18 + 8 - 2 * 30 + 2 * 20 - 2 * 12;   // 32
  var certA = 16 * 2;                                         // (4sqrt2)^2 = 32
  // exercise 1: (sqrt147 + sqrt75 - sqrt27)^2
  var crossE = [147 * 75, 147 * 27, 75 * 27];
  var crossEok = crossE.every(isSquare);
  var exercise1 = 147 + 75 + 27 + 2 * 105 - 2 * 63 - 2 * 45; // 243
  var certE = 81 * 3;                                         // (9sqrt3)^2 = 243
  var pass = zero === 0 && multi === 0 && total === 499 && crossAok &&
             encounterA === 32 && certA === 32 && crossEok &&
             exercise1 === 243 && certE === 243;
  return { piece: 'P2 surds', zero: zero, multi: multi, total: total,
           crossA: crossA, crossE: crossE, encounterA: encounterA,
           exercise1: exercise1, pass: pass };
}

// P3 — the mod-7 work re-derived (fresh engine).
function P3() {
  var q = Math.floor(2026 / 7), r = 2026 - 7 * q;              // 289, 3
  var cyc = [], v = 3;
  for (var k = 0; k < 12; k++) { cyc.push(v); v = (v * 3) % 7; }
  var period = 1; while (cyc[period] !== cyc[0]) period++;       // 6
  var premature = 0;
  for (var i = 1; i < period; i++) { if (cyc[i] === cyc[0]) premature++; }
  var route = cyc[(77 - 1) % period];                            // cyc[4] = 5
  var track = 3;
  for (var s = 1; s <= 76; s++) { track = (track * 3) % 7; }    // 3^77 in 76 multiplications
  var verdict = (route - r + 7) % 7;                             // 2 — NOT divisible
  var digits = Math.floor(77 * Math.log(2026) / Math.LN10) + 1; // 255
  var pass = q === 289 && r === 3 &&
             JSON.stringify(cyc) === JSON.stringify([3, 2, 6, 4, 5, 1, 3, 2, 6, 4, 5, 1]) &&
             period === 6 && premature === 0 && route === 5 && track === 5 &&
             verdict === 2 && digits === 255;
  return { piece: 'P3 mod 7', q: q, r: r, cycle: cyc.slice(0, period),
           period: period, premature: premature, route: route, track: track,
           verdict: verdict, digits: digits, pass: pass };
}

// P4 — the mod-13 square census re-derived.
function P4() {
  var classes = {}, sols3 = [], sols7 = [];
  for (var x = 0; x < 13; x++) {
    var c = (x * x) % 13;
    classes[c] = true;
    if (c === 3) sols3.push(x);
    if (c === 7) sols7.push(x);
  }
  var classSet = Object.keys(classes).map(Number).sort(function (a, b) { return a - b; });
  var census = {};
  for (var y = 0; y < 100; y++) { census[(y * y) % 13] = true; }
  var censusSet = Object.keys(census).map(Number).sort(function (a, b) { return a - b; });
  var censusSame = JSON.stringify(censusSet) === JSON.stringify(classSet);
  var pass = JSON.stringify(classSet) === JSON.stringify([0, 1, 3, 4, 9, 10, 12]) &&
             JSON.stringify(sols3) === JSON.stringify([4, 9]) &&
             sols7.length === 0 && censusSame;
  return { piece: 'P4 mod 13', classSet: classSet, sols3: sols3, sols7: sols7,
           censusSame: censusSame, pass: pass };
}

// P5 — fractions in lowest terms re-derived (fresh remainder-chain gcd).
function P5() {
  var a = 4782, b = 2026, chain = [];
  while (b !== 0) { chain.push(a % b); var t = a % b; a = b; b = t; }
  var chainNZ = chain.slice(0, chain.length - 1);  // 9 nonzero remainders
  var gcd = a;                                     // 2
  var num = 2026 / gcd, den = 4782 / gcd;          // 1013, 2391
  function prime(n) {
    if (n < 2) return false;
    for (var p = 2; p * p <= n; p++) { if (n % p === 0) return false; }
    return true;
  }
  var f1013 = prime(1013), f797 = prime(797), fac2391 = (2391 === 3 * 797);
  var fracs = [];
  for (var p = 1; p <= 9; p++) {
    for (var q = p; q <= 9; q++) {
      var g = p, qq = q;
      while (qq) { var tt = g % qq; g = qq; qq = tt; }
      if (g === 1) fracs.push([p, q]);
    }
  }
  var pairs = 0, violations = 0;
  for (var i = 0; i < fracs.length; i++) {
    for (var j = 0; j < fracs.length; j++) {
      pairs++;
      if (i !== j && fracs[i][0] * fracs[j][1] === fracs[j][0] * fracs[i][1]) violations++;
    }
  }
  var pass = gcd === 2 &&
             JSON.stringify(chainNZ) === JSON.stringify([730, 566, 164, 74, 16, 10, 6, 4, 2]) &&
             num === 1013 && den === 2391 && f1013 && f797 && fac2391 &&
             fracs.length === 28 && pairs === 784 && violations === 0;
  return { piece: 'P5 fractions', gcd: gcd, chain: chainNZ,
           reduced: [num, den], p1013: f1013, p797: f797, fac2391: fac2391,
           fractions: fracs.length, pairs: pairs, violations: violations, pass: pass };
}

// P6 — parabolas: vertex-form identity, translation classification (fresh).
function P6() {
  var f1 = function (x) { return (x - 1) * (x - 1) + 2; };
  var f2 = function (x) { return 2 * (x - 1) * (x - 1) + 2; };
  var f3 = function (x) { return (x + 2) * (x + 2) + 3; };
  // vertex form a(x-h)^2 + k with h = -b/(2a), k = c - b^2/(4a), compared
  // against ax^2 + bx + c in exact integer arithmetic (scaled by 4a):
  // (2ax + b)^2 - b^2 + 4ac = 4a(ax^2 + bx + c)
  var triples = 0, mismatches = 0;
  for (var ai = 1; ai <= 3; ai++) {
    for (var b = -4; b <= 4; b++) {
      for (var c = -5; c <= 5; c++) {
        triples++;
        for (var s = -1; s <= 1; s++) {
          var L = (2 * ai * s + b) * (2 * ai * s + b) - b * b + 4 * ai * c;
          var R = 4 * ai * (ai * s * s + b * s + c);
          if (L !== R) mismatches++;
        }
      }
    }
  }
  var tMism = 0;
  for (var x = -30; x <= 30; x++) { if (f3(x - 3) - 1 !== f1(x)) tMism++; }
  var shifts = 0, m1 = 0, m3 = 0;
  for (var t = -5; t <= 5; t++) {
    for (var u = -5; u <= 5; u++) {
      shifts++;
      var ok1 = true, ok3 = true;
      for (var x2 = -30; x2 <= 30; x2++) {
        if (f2(x2) !== f1(x2 - t) + u) ok1 = false;
        if (f2(x2) !== f3(x2 - t) + u) ok3 = false;
      }
      if (ok1) m1++;
      if (ok3) m3++;
    }
  }
  var sdViol = 0;
  for (var a2 = 1; a2 <= 3; a2++) {
    for (var b2 = -4; b2 <= 4; b2++) {
      for (var c2 = -5; c2 <= 5; c2++) {
        var dd = (4 * a2 + 2 * b2 + c2) - 2 * (a2 + b2 + c2) + c2; // f(2)-2f(1)+f(0)
        if (dd !== 2 * a2) sdViol++;
      }
    }
  }
  var pass = triples === 297 && mismatches === 0 && tMism === 0 &&
             shifts === 121 && m1 === 0 && m3 === 0 && sdViol === 0;
  return { piece: 'P6 parabolas', triples: triples, vertexMismatches: mismatches,
           translationMismatches: tMism, shifts: shifts, f2AsTranslateOfF1: m1,
           f2AsTranslateOfF3: m3, secondDiffViolations: sdViol, pass: pass };
}

// P7 — the nested radical in exact pair arithmetic (a, b) ~ a + b*sqrt(3).
// (Artifact validation run 1 expected [[2,1],[-2,-1]]; the ascending scan
// yields [[-2,-1],[2,1]] — expectation order fixed; the check itself was
// never wrong.)
function P7() {
  function sq(p) { return [p[0] * p[0] + 3 * p[1] * p[1], 2 * p[0] * p[1]]; }
  var s1 = sq([2, 1]);    // [7, 4]  — (2 + sqrt3)^2 = 7 + 4*sqrt3
  var s2 = sq([-2, -1]);  // [7, 4]  — the sign wall: sqrt(7+4sqrt3) = 2+sqrt3, never -2-sqrt3
  // quartic identity (a^2-3)(a^2-4) = a^4-7a^2+12 over 81 rational points
  // a = i/10, i = -40..40, exact via integers scaled by 10^4
  var qm = 0;
  for (var i = -40; i <= 40; i++) {
    var L = (i * i - 300) * (i * i - 400);
    var R = i * i * i * i - 700 * i * i + 120000;
    if (L !== R) qm++;
  }
  // uniqueness scan over halves: (2a)^2 + 3(2b)^2 = 28 and (2a)(2b) = 8
  var cands = [];
  for (var ka = -20; ka <= 20; ka++) {
    for (var kb = -20; kb <= 20; kb++) {
      if (ka * ka + 3 * kb * kb === 28 && ka * kb === 8) cands.push([ka / 2, kb / 2]);
    }
  }
  var positive = cands.filter(function (c) { return c[1] > 0; });
  var pass = JSON.stringify(s1) === JSON.stringify([7, 4]) &&
             JSON.stringify(s2) === JSON.stringify([7, 4]) &&
             qm === 0 &&
             JSON.stringify(cands) === JSON.stringify([[-2, -1], [2, 1]]) &&
             JSON.stringify(positive) === JSON.stringify([[2, 1]]);
  return { piece: 'P7 nested radical', square21: s1, squareM21: s2,
           quarticPoints: 81, quarticMismatches: qm, candidates: cands,
           uniqueWithPositiveB: positive, pass: pass };
}

// P8 — the conic family x^2 + Bxy + y^2 = 1 (with the honest P8.3 finding).
function P8() {
  var Bs = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
  var checks = 0, violations = 0, csMism = 0, claimMism = 0;
  for (var bi = 0; bi < Bs.length; bi++) {
    var B = Bs[bi];
    for (var x = -10; x <= 10; x++) {
      for (var y = -10; y <= 10; y++) {
        var form = x * x + B * x * y + y * y;
        var bound = (1 - Math.abs(B) / 2) * (x * x + y * y);
        checks++;
        if (form < bound - 1e-9) violations++;
        var diff = form - bound;
        // the true completed square (exact identity):
        var trueSq = B >= 0 ? (B / 2) * (x + y) * (x + y)
                            : (Math.abs(B) / 2) * (x - y) * (x - y);
        if (Math.abs(diff - trueSq) > 1e-9) csMism++;
        // the page's block-5 stated reason tested as an exact identity
        // (the honest finding: 1600/3969 mismatches — a lower bound only,
        // exact iff sign(xy) = -sign(B); R0 prose defect, R2 candidate):
        var claimed = (Math.abs(B) / 2) * (Math.abs(x) - Math.abs(y)) *
                                  (Math.abs(x) - Math.abs(y));
        if (Math.abs(diff - claimed) > 1e-9) claimMism++;
      }
    }
  }
  // Pell family s^2 - 5y^2 = 4
  var wit = [[3, 1], [7, 3], [18, 8], [47, 21], [123, 55]];
  var witOK = wit.every(function (w) { return w[0] * w[0] - 5 * w[1] * w[1] === 4; });
  var recOK = true;
  for (var i = 2; i < wit.length; i++) {
    if (wit[i][0] !== 3 * wit[i - 1][0] - wit[i - 2][0] ||
        wit[i][1] !== 3 * wit[i - 1][1] - wit[i - 2][1]) recOK = false;
  }
  // manufactured conic points: x = (s - 3y)/2 on x^2 + 3xy + y^2 = 1,
  // partner root x' = -3y - x, product x*x' = y^2 - 1 (both roots of
  // x^2 + 3yx + (y^2 - 1) = 0)
  var pts = [], ptsOK = true;
  wit.forEach(function (w) {
    var s = w[0], y = w[1];
    if ((s - 3 * y) % 2 !== 0) ptsOK = false;
    var x1 = (s - 3 * y) / 2, x2 = -3 * y - x1;
    [x1, x2].forEach(function (xh) {
      if (xh * xh + 3 * xh * y + y * y !== 1) ptsOK = false;
      if (x1 * x2 !== y * y - 1) ptsOK = false;
      pts.push([xh, y]);
    });
  });
  var pred = [];
  for (var Bp = -3; Bp <= 3; Bp++) { pred.push(Bp * Bp - 4); }
  var pass = checks === 3969 && violations === 0 && csMism === 0 &&
             witOK && recOK && ptsOK && pts.length === 10 &&
             JSON.stringify(pred) === JSON.stringify([5, 0, -3, -4, -3, 0, 5]);
  return { piece: 'P8 conic family', checks: checks, violations: violations,
           completedSquareMismatches: csMism,
           pageClaimTestedAsExact: { checked: checks, mismatches: claimMism },
           pellWitnessesOK: witOK, recurrenceOK: recOK,
           manufacturedPoints: pts, pointsOK: ptsOK, predictor: pred, pass: pass };
}

// P9 — figures 1-2 parsed from the shipped page bytes. Geometry from the
// <svg> blocks; captions from the enclosing <figure> blocks (validation
// run 1 wrongly scoped the caption regex to the svg substring — fixed).
function P9(page) {
  var figs = page.match(/<figure[\s\S]*?<\/figure>/g) || [];
  var fig1 = figs[0] || '', fig2 = figs[1] || '';
  var f1 = (fig1.match(/<svg[\s\S]*?<\/svg>/) || [''])[0];
  var f2 = (fig2.match(/<svg[\s\S]*?<\/svg>/) || [''])[0];
  // fig 1 — the root-2 number line: ticks at 25 + 58k (k = 0..5)
  var tickX = [], re1 = /<line x1="([0-9.]+)" y1="69" x2="([0-9.]+)" y2="75"/g, m1;
  while ((m1 = re1.exec(f1)) !== null) {
    if (m1[1] === m1[2]) tickX.push(+m1[2]);
  }
  var ticksOK = JSON.stringify(tickX) === JSON.stringify([25, 83, 141, 199, 257, 315]);
  var labelsOK = ['>0<', '>√2<', '>2√2<', '>3√2<', '>4√2<', '>5√2<']
    .every(function (s) { return f1.indexOf(s) >= 0; });
  var dots = [], re2 = /<circle cx="([0-9.]+)" cy="72" r="4" fill="#(3574d4|c25b4a)"\/>/g, m2;
  while ((m2 = re2.exec(f1)) !== null) { dots.push([+m2[1], m2[2]]); }
  var dotsOK = JSON.stringify(dots) === JSON.stringify(
    [[141, '3574d4'], [199, '3574d4'], [315, '3574d4'], [257, 'c25b4a']]);
  var dotLabelsOK = ['>√8<', '>√18<', '>√50<', '>4√2<']
    .every(function (s) { return f1.indexOf(s) >= 0; });
  var note1 = (f1.match(/<text x="170" y="112"[^>]*>([^<]*)<\/text>/) || [])[1] || '';
  var note1OK = note1 === 'all four dots sit on whole multiples of √2' && note1.length === 42;
  var fig1OK = ticksOK && labelsOK && dotsOK && dotLabelsOK && note1OK &&
    /aria-label="Fig P05\.1 /.test(f1) && /<strong>Fig P05\.1\.<\/strong>/.test(fig1);
  // fig 2 — the mod-7 clock: nodes at angle -90 + 360k/7 from (160,128), R=90
  var nodes = [], re3 = /<circle cx="([0-9.]+)" cy="([0-9.]+)" r="14" fill="(#[0-9a-f]*)" stroke="(#[0-9a-f]*)" stroke-width="([0-9.]+)"\/>/g, m3;
  while ((m3 = re3.exec(f2)) !== null) {
    nodes.push([+m3[1], +m3[2], m3[3], m3[4], +m3[5]]);
  }
  var nodeOK = nodes.length === 7;
  for (var k = 0; k < 7 && nodeOK; k++) {
    var ang = (-90 + k * 360 / 7) * Math.PI / 180;
    var ex = 160 + 90 * Math.cos(ang), ey = 128 + 90 * Math.sin(ang);
    var hit = nodes.filter(function (n) {
      return Math.abs(n[0] - ex) < 0.05 && Math.abs(n[1] - ey) < 0.05;
    });
    if (hit.length !== 1) nodeOK = false;
  }
  // team highlights: node 3 blue family, node 5 red family, bold labels
  var team3 = nodes.filter(function (n) { return n[2] === '#dce8f7'; });
  var team5 = nodes.filter(function (n) { return n[2] === '#fbe4e0' && n[3] === '#c25b4a'; });
  var ang3 = (-90 + 3 * 360 / 7) * Math.PI / 180;
  var ang5 = (-90 + 5 * 360 / 7) * Math.PI / 180;
  var teamsOK = team3.length === 1 && team5.length === 1 &&
    Math.abs(team3[0][0] - (160 + 90 * Math.cos(ang3))) < 0.05 &&
    Math.abs(team5[0][0] - (160 + 90 * Math.cos(ang5))) < 0.05 &&
    /font-weight="700">3</.test(f2) && /font-weight="700">5</.test(f2);
  // walk arrows: 6 lines + 6 arrowheads, document order = powers of 3 mod 7
  var arrows = [], re4 = /<line x1="([0-9.]+)" y1="([0-9.]+)" x2="([0-9.]+)" y2="([0-9.]+)" stroke="#8a94a6"/g, m4;
  while ((m4 = re4.exec(f2)) !== null) { arrows.push([+m4[1], +m4[2], +m4[3], +m4[4]]); }
  var heads = (f2.match(/<polygon points="[^"]*" fill="#8a94a6"\/>/g) || []).length;
  function nearest(px, py) {
    var best = -1, bd = 1e9;
    nodes.forEach(function (n, idx) {
      var d = (n[0] - px) * (n[0] - px) + (n[1] - py) * (n[1] - py);
      if (d < bd) { bd = d; best = idx; }
    });
    return bd <= 25 * 25 ? best : -1;
  }
  var walk = [];
  var walkOK = arrows.length === 6 && heads === 6;
  for (var ai = 0; ai < arrows.length && walkOK; ai++) {
    var A = nearest(arrows[ai][0], arrows[ai][1]);
    var Bk = nearest(arrows[ai][2], arrows[ai][3]);
    if (A < 0 || Bk < 0) walkOK = false; else walk.push([A, Bk]);
  }
  walkOK = walkOK && JSON.stringify(walk) === JSON.stringify(
    [[3, 2], [2, 6], [6, 4], [4, 5], [5, 1], [1, 3]]);
  var note2 = (f2.match(/<text x="160" y="14"[^>]*>([^<]*)<\/text>/) || [])[1] || '';
  var note2OK = note2 === '2026 ≡ 3 — six steps visit six teams, then repeat' &&
    note2.length === 49;
  var fig2OK = nodeOK && teamsOK && walkOK && note2OK &&
    /aria-label="Fig P05\.2 /.test(f2) && /<strong>Fig P05\.2\.<\/strong>/.test(fig2);
  return { piece: 'P9 figs 1-2', ticks: tickX, fig1Dots: dots, note1: note1.length,
           nodes: nodes.length, teams: teamsOK, arrows: arrows.length,
           arrowheads: heads, walk: walk, note2: note2.length,
           fig1OK: fig1OK, fig2OK: fig2OK, pass: fig1OK && fig2OK };
}

// P10 — figure 3 (the conic family panels) parsed from the shipped page bytes.
function P10(page) {
  var svgs = page.match(/<svg[\s\S]*?<\/svg>/g) || [];
  var f3 = svgs[2];
  // panels: 4 rects at x = 8, 93, 178, 263 (69 wide, y 18..158)
  var rects = [], re = /<rect x="([0-9.]+)" y="([0-9.]+)" width="([0-9.]+)" height="([0-9.]+)" fill="#fdfdfc" stroke="#ccc"\/>/g, m;
  while ((m = re.exec(f3)) !== null) { rects.push([+m[1], +m[2], +m[3], +m[4]]); }
  var panelsOK = JSON.stringify(rects) === JSON.stringify(
    [[8, 18, 69, 140], [93, 18, 69, 140], [178, 18, 69, 140], [263, 18, 69, 140]]);
  // panel 1 — B = 0: the unit circle at 22 px/unit, centre (42.5, 88)
  var circ = /<circle cx="42.5" cy="88" r="22" fill="none" stroke="#3574d4" stroke-width="2.2"\/>/.test(f3);
  // all polylines in document order: [oval, branch1, branch2]
  var polys = [], rep = /<polyline points="([^"]*)"/g, mp;
  while ((mp = rep.exec(f3)) !== null) {
    polys.push(mp[1].trim().split(/\s+/).map(function (p) {
      return p.split(',').map(Number);
    }));
  }
  // panel 2 — B = 1: tilted oval, 73 samples on x^2+xy+y^2 = 1,
  // 22 px/unit, centre (127.5, 88)
  var oval = polys[0] || [];
  var ovalOK = oval.length === 73, ovalDev = 0, ovalContained = true;
  for (var i = 0; i < oval.length; i++) {
    var ox = (oval[i][0] - 127.5) / 22, oy = -(oval[i][1] - 88) / 22;
    var d = Math.abs(ox * ox + ox * oy + oy * oy - 1);
    if (d > ovalDev) ovalDev = d;
    if (d > 1e-3) ovalOK = false;
    if (oval[i][0] < 93 || oval[i][0] > 162 || oval[i][1] < 18 || oval[i][1] > 158) {
      ovalContained = false;
    }
  }
  // panel 3 — B = 2: the two parallel lines x + y = ±1, 22 px/unit,
  // centre (212.5, 88), clipped to the panel
  var lines = [], rel = /<line x1="([0-9.]+)" y1="([0-9.]+)" x2="([0-9.]+)" y2="([0-9.]+)" stroke="#c25b4a" stroke-width="2.2" stroke-dasharray="6 4"\/>/g, ml;
  while ((ml = rel.exec(f3)) !== null) { lines.push(ml.slice(1, 5).map(Number)); }
  var linesOK = lines.length === 2;
  for (var li = 0; li < lines.length && linesOK; li++) {
    var s1 = (lines[li][0] - 212.5) - (lines[li][1] - 88);
    var s2 = (lines[li][2] - 212.5) - (lines[li][3] - 88);
    if (Math.abs(Math.abs(s1) - 22) > 0.01 || s1 !== s2) linesOK = false;
  }
  // panel 4 — B = 3: hyperbola branches, 209 + 209 samples on
  // x^2 + 3xy + y^2 = 1, 11 px/unit, centre (297.5, 88)
  var branches = [polys[1] || [], polys[2] || []];
  var bOK = branches[0].length === 209 && branches[1].length === 209;
  var bDev = 0, bContained = true;
  branches.forEach(function (poly) {
    poly.forEach(function (pt) {
      var X = pt[0], Y = pt[1];
      var x = (X - 297.5) / 11, y = -(Y - 88) / 11;
      var d = Math.abs(x * x + 3 * x * y + y * y - 1);
      if (d > bDev) bDev = d;
      if (d > 0.02) bOK = false;
      if (X < 263 || X > 332 || Y < 18 || Y > 158) bContained = false;
    });
  });
  // witness dots (−3,1), (−1,3), (0,1) on the B = 3 branch
  var dots = [], red = /<circle cx="([0-9.]+)" cy="([0-9.]+)" r="3" fill="#c25b4a"\/>/g, md;
  while ((md = red.exec(f3)) !== null) { dots.push([+md[1], +md[2]]); }
  var dotsOK = JSON.stringify(dots) === JSON.stringify(
    [[264.5, 77], [286.5, 55], [297.5, 77]]);
  // labels + captions + aria
  var labOK = /<text x="42\.5" y="176"[^>]*>B = 0<\/text>/.test(f3) &&
    /<text x="127\.5" y="176"[^>]*>B = 1<\/text>/.test(f3) &&
    /<text x="212\.5" y="176"[^>]*>B = 2<\/text>/.test(f3) &&
    /<text x="297\.5" y="176"[^>]*>B = 3<\/text>/.test(f3) &&
    />circle</.test(f3) && />tilted oval — bounded</.test(f3) &&
    />two parallel lines</.test(f3) && />hyperbola — unbounded</.test(f3);
  var ariaOK = /aria-label="Fig P05\.3 — the family x² \+ Bxy \+ y² = 1 at B = 0, 1, 2, 3: circle, tilted oval, two parallel lines, hyperbola"/.test(f3);
  var pass = panelsOK && circ && ovalOK && ovalContained && linesOK &&
             bOK && bContained && dotsOK && labOK && ariaOK;
  return { piece: 'P10 fig3', panels: rects.length, circle: circ,
           ovalSamples: oval.length, ovalMaxDev: ovalDev, ovalContained: ovalContained,
           lines: lines.length, linesOK: linesOK,
           branchSamples: branches[0].length + branches[1].length,
           branchMaxDev: bDev, branchesContained: bContained,
           dots: dots, labels: labOK, aria: ariaOK, pass: pass };
}

// Driver — runs all ten pieces against the shipped page and the R0 receipts.
function main() {
  var pagePath = process.argv[2] || path.join(__dirname, '..', 'p05-canonical-form.html');
  var r0Path = process.argv[3] || path.join(__dirname, 'p05-lab-output.txt');
  var page = fs.readFileSync(pagePath, 'utf8');
  var r0 = fs.readFileSync(r0Path, 'utf8');
  var results = [P1(page, r0), P2(), P3(), P4(), P5(), P6(), P7(), P8(), P9(page), P10(page)];
  var all = results.every(function (r) { return r.pass; });
  results.forEach(function (r, i) {
    console.log('P' + (i + 1) + ' ' + r.piece + ': ' + (r.pass ? 'PASS' : 'FAIL'));
    console.log(JSON.stringify(r, null, 1));
  });
  console.log(all ? 'VERDICT: PASS — 10/10 pieces'
                  : 'VERDICT: FAIL — see pieces above');
  process.exit(all ? 0 : 1);
}
main();
