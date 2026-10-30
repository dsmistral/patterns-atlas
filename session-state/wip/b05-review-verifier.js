// b05-review-verifier.js - adversarial review of b05-coordinates-basis.html (session S46)
// Fresh engine: shares ZERO code with b05-lab.js (different helpers, different algorithms:
// elimination instead of Cramer, split-based parsing instead of exec-regex scans).
// 18 checks: V.01-V.10 on the true page, V.11-V.18 doctored clones that must each be
// REJECTED. All clone mutations are GLOBAL via split().join() - the S45 lesson that
// String.replace is first-occurrence-only and lets clones escape.

function vadd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
function vmul(k, a) { return [k * a[0], k * a[1]]; }
function journey(k, u, m, v) { return vadd(vmul(k, u), vmul(m, v)); }
function cross2(u, v) { return u[0] * v[1] - u[1] * v[0]; }
function solve2(u, v, Pt) {
  // fresh two-equation elimination: p*a + r*b = x ; q*a + s*b = y   (p nonzero for our schemes)
  var p = u[0], q = u[1], r = v[0], s = v[1], x = Pt[0], y = Pt[1];
  var f = q / p;
  var g = s - f * r, rhs = y - f * x;
  var b = rhs / g;
  var a = (x - r * b) / p;
  return [a, b];
}

function core(PAGE) {
  var bad = [];
  function need(s) { if (PAGE.split(s).length < 2) bad.push('missing: ' + s); }
  function avoid(s) { if (PAGE.split(s).length > 1) bad.push('poison present: ' + s); }

  // V.01 head intact
  if (PAGE.split('Coordinates are a measuring scheme').length < 2) bad.push('V.01 title broken');
  if (PAGE.split('mathjax@3.2.2').length < 2) bad.push('V.01 CDN unpinned');
  if (PAGE.split('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=').length < 2) bad.push('V.01 integrity hash broken');

  // V.02 needle battery (32 needles, chosen independently of the lab battery)
  var needles = [
    'flat island; a lighthouse',
    'Two surveyors, two pairs of numbers, one point.',
    'her diagonal is a prison',
    'the slow unfolding of those two sentences',
    'metres for length',
    'health certificate',
    'double-counter',
    'now earning its keep as a scheme-health check',
    'a later convention, not the idea',
    'check-walk',
    'the formulas die die', // placeholder, replaced below
    'a third-of-the-way marker stays a third of the way',
    'the most special point there is',
    'the whole health report',
    'exhibited a working pair and ruled out one and three',
    'nothing breaks in transit',
    'only named here, not built',
    'arrows add leg-by-leg',
    'wearing new boots',
    'no unique repair, only repairs',
    'cover it until you have your own',
    'smuggled into any journey',
    'one backward knight-leg, three forward on the other',
    'census first, rule after, proof last',
    'the 57 reachable squares (of 169) coloured blue',
    'since \\((x+1) + (y-1) = x + y\\); adding 3 to \\(x\\) alone',
    'D = 1 \\times 2 - 1 \\times 2 = 0',
    'readings (3, 2)',
    'rule: x + y \u2261 0 (mod 3)',
    'reachable, whole readings',
    'the empty reading',
    'convert readings wholesale',
    "the surveyor's leg"
  ];
  needles[10] = 'the formulas die at birth';
  for (var ni = 0; ni < needles.length; ni++) need(needles[ni]);

  // V.03 poison battery (must all be absent)
  var poisons = ['lorem', 'TODO', 'FIXME', 'XXX', 'placeholder', 'numpy', 'Gaussian',
    'row-reduce', 'transpose', 'orthonormal', 'eigenvalue', 'Gram', 'Schmidt', 'draft'];
  for (var pi = 0; pi < poisons.length; pi++) avoid(poisons[pi]);

  // V.04 structural controls
  if (PAGE.split('fill-opacity="0.75"').length - 1 !== 58) bad.push('V.04 census+legend count not 58');
  if (PAGE.split('stroke="#ffffff"').length - 1 !== 28) bad.push('V.04 grid lines not 28');
  if (PAGE.split('<details>').length - 1 !== 7) bad.push('V.04 details not 7');
  if (PAGE.split('<figure class="fig-tight">').length - 1 !== 3) bad.push('V.04 figures not 3');
  if (PAGE.split('\u25c6').length - 1 !== 1) bad.push('V.04 diamond count not 1');
  if (PAGE.split('$').length !== 1) bad.push('V.04 dollar sign present');
  if (PAGE.split('<section').length - 1 !== 6) bad.push('V.04 sections not 6');

  // V.05 census re-derivation, fresh split-based parse
  var seg = PAGE.split('<rect ');
  var drawn = {}, drawnN = 0;
  for (var si = 1; si < seg.length; si++) {
    var head = seg[si].slice(0, 200);
    if (head.split('width="11"').length > 1 && head.split('#3574d4').length > 1 && head.split('0.75').length > 1) {
      var xm = /x="(-?\d+)"/.exec(head), ym = /y="(-?\d+)"/.exec(head);
      if (xm && ym) {
        var RX = parseInt(xm[1], 10), RY = parseInt(ym[1], 10);
        var dx = (RX - 30) / 11 - 6, dy = 6 - (RY - 14) / 11;
        if (dx === Math.round(dx) && dy === Math.round(dy) && dx >= -6 && dx <= 6 && dy >= -6 && dy <= 6) {
          drawn[dx + ',' + dy] = 1; drawnN++;
        }
      }
    }
  }
  var predset = {}, predN = 0;
  for (var px = -6; px <= 6; px++) for (var py = -6; py <= 6; py++) {
    if ((px + py) % 3 === 0) { predset[px + ',' + py] = 1; predN++; }
  }
  if (drawnN !== 57 || predN !== 57) bad.push('V.05 census size wrong (drawn ' + drawnN + ', predicted ' + predN + ')');
  for (var pk in predset) if (!drawn[pk]) { bad.push('V.05 census cell missing: ' + pk); break; }
  for (var dk in drawn) if (!predset[dk]) { bad.push('V.05 census cell extra: ' + dk); break; }

  // V.06 closed forms rebuild all reachable cells
  var cfOK = true;
  for (var cx = -6; cx <= 6; cx++) for (var cy = -6; cy <= 6; cy++) {
    if ((cx + cy) % 3 === 0) {
      var ka = (2 * cy - cx) / 3, kb = (2 * cx - cy) / 3;
      if (ka !== Math.round(ka) || kb !== Math.round(kb)) cfOK = false;
      var w = journey(ka, [1, 2], kb, [2, 1]);
      if (Math.abs(w[0] - cx) > 1e-9 || Math.abs(w[1] - cy) > 1e-9) cfOK = false;
    }
  }
  if (!cfOK) bad.push('V.06 closed forms fail to rebuild cells');

  // V.07 stripe invariance, fresh scan (east+south and three-east)
  var stOK = true;
  for (var sx = -6; sx <= 6; sx++) for (var sy = -6; sy <= 6; sy++) {
    var r0 = (sx + sy) % 3 === 0;
    if (sx + 1 <= 6 && sy - 1 >= -6 && ((sx + 1 + sy - 1) % 3 === 0) !== r0) stOK = false;
    if (sx + 3 <= 6 && ((sx + 3 + sy) % 3 === 0) !== r0) stOK = false;
  }
  if (!stOK) bad.push('V.07 stripe invariance broken');

  // V.08 surveyor walks, fresh journey helper
  var w1 = journey(7, [1, 0], 5, [0, 1]), w2 = journey(3, [1, 1], 2, [2, 1]);
  var w3 = journey(11, [1, 1], -2, [2, 3]), w4 = journey(3, [1, 1], 0, [2, 2]);
  var w5 = journey(5, [1, 1], -1, [2, 2]), w6 = journey(2, [1, 1], -1, [2, 2]);
  if (!(w1[0] === 7 && w1[1] === 5)) bad.push('V.08 Ana walk wrong');
  if (!(w2[0] === 7 && w2[1] === 5)) bad.push('V.08 Ben walk wrong');
  if (!(w3[0] === 7 && w3[1] === 5)) bad.push('V.08 Charlie walk wrong');
  if (!(w4[0] === 3 && w4[1] === 3)) bad.push('V.08 Daisy reading wrong');
  if (!(w5[0] === 3 && w5[1] === 3)) bad.push('V.08 Daisy shifted reading wrong');
  if (!(w6[0] === 0 && w6[1] === 0)) bad.push('V.08 Daisy origin pair wrong');

  // V.09 fresh elimination round-trips
  var schemes = [[[1, 1], [2, 1]], [[3, 1], [1, 3]], [[1, 0], [2, 1]], [[1, 2], [3, 1]]];
  var targets = [[7, 5], [10, 7], [2, 4], [4, 3], [-3, 5], [0, 0]];
  var rtOK = true;
  for (var i9 = 0; i9 < schemes.length; i9++) for (var j9 = 0; j9 < targets.length; j9++) {
    var u9 = schemes[i9][0], v9 = schemes[i9][1], t9 = targets[j9];
    var sol = solve2(u9, v9, t9);
    var back = journey(sol[0], u9, sol[1], v9);
    if (Math.abs(back[0] - t9[0]) > 1e-9 || Math.abs(back[1] - t9[1]) > 1e-9) rtOK = false;
  }
  if (!rtOK) bad.push('V.09 elimination round-trip fails');

  // V.10 determinant examples, fresh cross2
  var dets = [cross2([1, 0], [0, 1]), cross2([1, 1], [2, 1]), cross2([1, 1], [2, 3]),
              cross2([1, 1], [2, 2]), cross2([3, 1], [1, 3]), cross2([2, 1], [4, 2]), cross2([1, 2], [3, 1])];
  if (JSON.stringify(dets) !== JSON.stringify([1, -1, 1, 0, 8, 0, -5])) bad.push('V.10 determinant set wrong: ' + JSON.stringify(dets));

  return bad;
}

function runVerifier(PAGE) {
  var out = [];
  var bad = core(PAGE);
  out.push('V.01 head intact: ' + (bad.filter(function (b) { return b.indexOf('V.01') === 0; }).length === 0 ? 'OK' : 'FAIL'));
  out.push('V.02 needle battery: ' + (32 - bad.filter(function (b) { return b.indexOf('missing: ') === 0; }).length) + '/32');
  out.push('V.03 poison battery: ' + bad.filter(function (b) { return b.indexOf('poison present: ') === 0; }).length + ' present (want 0)');
  var ctl = bad.filter(function (b) { return b.indexOf('V.04') === 0; });
  out.push('V.04 structural controls: ' + (ctl.length === 0 ? 'OK (58/28/7/3/1/0dollar/6)' : 'FAIL ' + ctl.join('; ')));
  var c5 = bad.filter(function (b) { return b.indexOf('V.05') === 0; });
  out.push('V.05 census exact-set: ' + (c5.length === 0 ? 'OK (57 drawn = 57 predicted, set-equal)' : 'FAIL ' + c5.join('; ')));
  out.push('V.06 closed forms rebuild: ' + (bad.indexOf('V.06 closed forms fail to rebuild cells') === -1 ? 'OK' : 'FAIL'));
  out.push('V.07 stripe invariance: ' + (bad.indexOf('V.07 stripe invariance broken') === -1 ? 'OK' : 'FAIL'));
  var w8 = bad.filter(function (b) { return b.indexOf('V.08') === 0; });
  out.push('V.08 surveyor walks: ' + (w8.length === 0 ? 'OK (6/6 journeys)' : 'FAIL ' + w8.join('; ')));
  out.push('V.09 elimination round-trips: ' + (bad.indexOf('V.09 elimination round-trip fails') === -1 ? 'OK (4x6)' : 'FAIL'));
  out.push('V.10 determinant set: ' + (bad.filter(function (b) { return b.indexOf('V.10') === 0; }).length === 0 ? 'OK [1,-1,1,0,8,0,-5]' : 'FAIL'));

  function mutate(from, to, label) {
    if (PAGE.split(from).length < 2) { out.push('V.xx ' + label + ': MUTATION NOT APPLIED - escape'); return; }
    var clone = PAGE.split(from).join(to);
    var cb = core(clone);
    out.push(label + ': ' + (cb.length > 0 ? 'REJECTED (' + cb.length + ' core failures, first: ' + cb[0].slice(0, 90) + ')' : 'ESCAPED - verifier too weak'));
  }

  mutate('(of 169)', '(of 168)', 'V.11 clone C1 census claim tampered, rejected');
  mutate('(x+1) + (y-1)', '(x+1) + (y+1)', 'V.12 clone C2 stripe step falsified (east+north), rejected');
  mutate('D = 1 \\times 2 - 1 \\times 2 = 0', 'D = 1 \\times 2 - 1 \\times 2 = 1', 'V.13 clone C3 Daisy determinant flipped, rejected');
  mutate('(3, 2)', '(3, 3)', 'V.14 clone C4 Ben reading corrupted globally, rejected');
  mutate('<rect x="30" y="14" width="11" height="11" fill="#3574d4" fill-opacity="0.75"/>', '', 'V.15 clone C5 one census rect deleted, rejected');
  mutate('<rect x="185" y="98" width="11" height="11" fill="#3574d4" fill-opacity="0.75"/>', '<rect x="185" y="98" width="11" height="11" fill="#3574d4" fill-opacity="0.55"/>', 'V.16 clone C6 legend swatch opacity tampered, rejected');
  mutate('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=', 'sha256-0CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=', 'V.17 clone C7 integrity hash tampered, rejected');
  mutate('rule: x + y \u2261 0 (mod 3)', 'rule: x + y \u2261 1 (mod 3)', 'V.18 clone C8 rule label falsified, rejected');

  var hardFails = bad.filter(function (b) { return b.indexOf('missing: ') !== 0 && b.indexOf('poison present: ') !== 0; });
  out.push('SUMMARY: true page core failures = ' + bad.length + ' (want 0)');
  return out;
}
