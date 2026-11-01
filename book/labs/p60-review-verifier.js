/* p60-review-verifier.js — The Patterns Atlas, P60 adversarial review verifier.
 * Independently authored: shares zero code with p60-lab.js.
 * Checks the LIVE published page (book/p60-group-completion.html) against needles
 * transcribed mechanically from it (census at ea98718b, pin corrected at 325193573),
 * plus must-fail injections, a style audit against published P59, and a canon cross-check.
 * Run history: run 1 = 65/68 (F1/F6 verifier technique errors — String.replace replaces
 * first occurrence only, fixed here with split/join; S12 caught a genuine page defect —
 * the MathJax pin had single backslashes where the house pin needs doubles — fixed by
 * page review correction 325193573). run 2 = this output.
 * Deterministic ES5: no recursion, no randomness, no dates, no network.
 * Usage: require('./p60-review-verifier.js').verify(pageHtml, p59Html)
 */
var P60_VERIFY = (function () {
  'use strict';
  var checks = [];
  function add(name, fn) { checks.push({ name: name, fn: fn }); }
  function cnt(s, needle) {
    var n = 0, i = s.indexOf(needle);
    while (i >= 0) { n++; i = s.indexOf(needle, i + needle.length); }
    return n;
  }
  function utf8bytes(s) {
    var n = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) { n += 1; }
      else if (c < 0x800) { n += 2; }
      else if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
        var d = s.charCodeAt(i + 1);
        if (d >= 0xdc00 && d <= 0xdfff) { n += 4; i++; } else { n += 3; }
      } else { n += 3; }
    }
    return n;
  }
  function hrefSet(s) {
    var out = [], re = /href="([^"]*)"/g, m;
    while ((m = re.exec(s)) !== null) { if (out.indexOf(m[1]) < 0) { out.push(m[1]); } }
    out.sort();
    return out;
  }
  function replaceAll(s, a, b) { return s.split(a).join(b); }
  var EXPECTED_HREFS = ['assets/style.css', 'index.html', 'p31-universal-property.html', 'p48-representable-functor.html', 'p59-shearer-entropy.html', 'p62-sheafify-on-site.html', 'p64-virtual-classes.html'];
  var PIN = "window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};";
  var INTEGRITY = 'integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII="';

  // ===== Group T: transcription census =====
  add('T1 page carries exactly 8 h2', function (p) { var n = cnt(p, '<h2>'); return [n === 8, n + ' h2']; });
  add('T2 page carries no h3', function (p) { var n = cnt(p, '<h3'); return [n === 0, n + ' h3']; });
  add('T3 page carries 9 details blocks', function (p) { var n = cnt(p, '<details>'); return [n === 9, n + ' details']; });
  add('T4 page carries 3 svg figures', function (p) { var n = cnt(p, '<svg '); return [n === 3, n + ' svg']; });
  add('T5 page carries 3 page-figures', function (p) { var n = cnt(p, '<figure class="page-figure"'); return [n === 3, n + ' figures']; });
  add('T6 page carries 3 pattern-boxes', function (p) { var n = cnt(p, '<div class="pattern-box"'); return [n === 3, n + ' pattern-box']; });
  add('T7 page carries 3 exhibit divs', function (p) { var n = cnt(p, '<div class="exhibit">'); return [n === 3, n + ' exhibit']; });
  add('T8 page carries 1 warn-box', function (p) { var n = cnt(p, 'class="warn-box"'); return [n === 1, n + ' warn-box']; });
  add('T9 page carries 1 eq block, 1 sketch-marker, 1 moons', function (p) {
    var a = cnt(p, 'class="eq"'), b = cnt(p, 'class="sketch-marker"'), c = cnt(p, 'class="moons"');
    return [a === 1 && b === 1 && c === 1, a + '/' + b + '/' + c];
  });
  add('T10 page carries 6 door list items', function (p) { var n = cnt(p, '<li><strong>Door —'); return [n === 6, n + ' doors']; });
  add('T11 page carries zero dollar-sign delimiters', function (p) { var n = cnt(p, '$'); return [n === 0, n + ' dollars']; });
  add('T12 href set is exactly the seven book targets', function (p) {
    var got = hrefSet(p);
    return [JSON.stringify(got) === JSON.stringify(EXPECTED_HREFS), 'got ' + got.length + ': ' + got.join(', ')];
  });
  add('T13 MathJax pin byte-exact (house pin, double backslashes)', function (p) { return [p.indexOf(PIN) >= 0, cnt(p, PIN) + ' pin copies']; });
  add('T14 MathJax integrity attribute present', function (p) { return [p.indexOf(INTEGRITY) >= 0, 'integrity sha256 present']; });
  add('T15 section ids in canonical order', function (p) {
    var ids = ['id="bridge"', 'id="encounter"', 'id="pattern"', 'id="encounters"', 'id="exhibits"', 'id="doors"', 'id="lineage"', 'id="exercises"'];
    var last = -1;
    for (var i = 0; i < ids.length; i++) {
      var at = p.indexOf(ids[i]);
      if (at < 0 || at <= last) { return [false, ids[i] + ' missing or out of order']; }
      last = at;
    }
    return [true, 'bridge..exercises in order'];
  });
  add('T16 inline TeX count is 392', function (p) { var n = cnt(p, '\\('); return [n === 392, n + ' inline TeX']; });
  add('T17 display TeX count is 2', function (p) { var n = cnt(p, '\\['); return [n === 2, n + ' display TeX']; });
  add('T18 page byte length is 56503 (state after pin correction 325193573)', function (p) { var n = utf8bytes(p); return [n === 56503, n + ' bytes']; });
  add('T19 no lab references, no staging references, no placeholder text', function (p) {
    var bad = [];
    if (p.indexOf('p60-lab') >= 0) { bad.push('lab reference'); }
    if (p.indexOf('session-state') >= 0) { bad.push('staging reference'); }
    if (p.indexOf('TODO') >= 0) { bad.push('TODO'); }
    if (p.indexOf('wait —') >= 0) { bad.push('authoring artifact'); }
    return [bad.length === 0, bad.length === 0 ? 'clean' : bad.join(', ')];
  });
  add('T20 no P16 link and no P16 mention', function (p) {
    var a = cnt(p, 'P16'), b = cnt(p, 'p16-');
    return [a === 0 && b === 0, 'P16 mentions: ' + a + ', p16- links: ' + b];
  });

  // ===== Group M: math receipts, needle-transcribed from the published page =====
  add('M1 ledger receipt 5 + 0 = 3 + 2', function (p) { return [p.indexOf('5 + 0 = 3 + 2') >= 0, 'needle present']; });
  add('M2 columnwise page addition (5,3)+(2,4) = (7,7)', function (p) { return [p.indexOf('(5, 3) + (2, 4) = (7, 7)') >= 0, 'needle present']; });
  add('M3 silence receipt n + 5 = 0 + 2', function (p) { return [p.indexOf('n + 5 = 0 + 2') >= 0, 'needle present']; });
  add('M4 bundle sum (3,1) oplus (1,2) = (4,3)', function (p) { return [p.indexOf('(3, 1) \\oplus (1, 2) = (4, 3)') >= 0, 'needle present']; });
  add('M5 witness law a + d + k = b + c + k', function (p) { return [p.indexOf('a + d + k = b + c + k') >= 0, 'needle present']; });
  add('M6 naive max law max(2,3) = 3 = max(3,3)', function (p) { return [p.indexOf('\\max(2, 3) = 3 = \\max(3, 3)') >= 0, 'needle present']; });
  add('M7 witness repair max(2,2,3) = 3 = max(3,3,3)', function (p) { return [p.indexOf('\\max(2, 2, 3) = 3 = \\max(3, 3, 3)') >= 0, 'needle present']; });
  add('M8 transitivity witness K = d + k1 + k2', function (p) { return [p.indexOf('K = d + k_1 + k_2') >= 0, 'needle present']; });
  add('M9 extension formula fbar([(a,b)]) = f(a)f(b)^-1', function (p) { return [p.indexOf('\\bar{f}([(a,b)]) = f(a) \\cdot f(b)^{-1}') >= 0, 'needle present']; });
  add('M10 max failure 2 oplus 5 = 3 oplus 5', function (p) { return [p.indexOf('2 \\oplus 5 = 3 \\oplus 5') >= 0, 'needle present']; });
  add('M11 prime-exponent receipt 18/12 = ... = 3/2', function (p) { return [p.indexOf('18/12 = (2 \\cdot 3^2)/(2^2 \\cdot 3) = 2^{-1} \\cdot 3 = 3/2') >= 0, 'needle present']; });
  add('M12 cross-multiplication 15*1 = 3*5', function (p) { return [p.indexOf('15 \\cdot 1 = 3 \\cdot 5') >= 0, 'needle present']; });
  add('M13 two-point K0 = Z^2', function (p) { return [p.indexOf('K_0(X) \\cong \\mathbb{Z}^2') >= 0, 'needle present']; });
  add('M14 Euler receipt chi(S2 x S2) = 4 = 2*2', function (p) { return [p.indexOf('\\chi(S^2 \\times S^2) = 4 = 2 \\cdot 2') >= 0, 'needle present']; });
  add('M15 absorbing-zero relation max(a,d,k) = max(b,c,k)', function (p) { return [p.indexOf('\\max(a, d, k) = \\max(b, c, k)') >= 0, 'needle present']; });
  add('M16 collapse witness k = max(a,b)', function (p) { return [p.indexOf('k = \\max(a,b)') >= 0, 'needle present']; });
  add('M17 corrected Ex2 dimension vector (3-2, 1-0) = (1,1)', function (p) { return [p.indexOf('(3 - 2, 1 - 0) = (1,1)') >= 0, 'needle present']; });
  add('M18 corrected Ex2 columnwise witness text', function (p) { return [p.indexOf('column by column — first column \\(3 = 1 + 2\\), second column \\(1 = 1 + 0\\)') >= 0, 'needle present']; });
  add('M19 Ex3 table sizes 25, 36, and 36', function (p) { return [p.indexOf('\\(25\\), \\(36\\), and \\(36\\)') >= 0, 'needle present']; });
  add('M20 BPQ phrasing Z x BSigma-infty+ ~ Omega-infty S-infty', function (p) { return [p.indexOf('\\mathbb{Z} \\times B\\Sigma_\\infty^{+} \\simeq \\Omega^\\infty S^\\infty') >= 0, 'needle present']; });

  // ===== Group F: must-fail injections — the verifier must have teeth =====
  add('F1 digit flip in ledger receipt is caught (all occurrences)', function (p) {
    if (p.indexOf('5 + 0 = 3 + 2') < 0) { return [false, 'base needle missing']; }
    var mut = replaceAll(p, '5 + 0 = 3 + 2', '5 + 0 = 3 + 3');
    return [mut.indexOf('5 + 0 = 3 + 2') < 0 && mut.indexOf('5 + 0 = 3 + 3') >= 0, 'mutation detected by needle check'];
  });
  add('F2 href target mutation is caught', function (p) {
    var mut = replaceAll(p, 'p62-sheafify-on-site.html', 'p63-nope.html');
    var caught = JSON.stringify(hrefSet(mut)) !== JSON.stringify(EXPECTED_HREFS);
    return [caught, 'href set check fails on mutant'];
  });
  add('F3 h3 injection is caught', function (p) {
    var mut = p.replace('<h2>8 · Exercises</h2>', '<h3>fake</h3><h2>8 · Exercises</h2>');
    return [cnt(mut, '<h3') > 0 && cnt(p, '<h3') === 0, 'h3-zero check fails on mutant'];
  });
  add('F4 dollar-delimiter injection is caught', function (p) {
    var mut = p + '\n<p>$x$</p>\n';
    return [cnt(mut, '$') > 0 && cnt(p, '$') === 0, 'dollar-zero check fails on mutant'];
  });
  add('F5 integrity-strip injection is caught', function (p) {
    var mut = p.replace(' integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII="', '');
    return [mut.indexOf(INTEGRITY) < 0 && p.indexOf(INTEGRITY) >= 0, 'pin check fails on mutant'];
  });
  add('F6 false-content injection chi(S1) = 1 is caught (all occurrences)', function (p) {
    if (p.indexOf('\\chi(S^1) = 1') >= 0) { return [false, 'false variant already present']; }
    var mut = replaceAll(p, '\\chi(S^1) = 0', '\\chi(S^1) = 1');
    return [mut.indexOf('\\chi(S^1) = 1') >= 0 && mut.indexOf('\\chi(S^1) = 0') < 0, 'false receipt detected'];
  });
  add('F7 old-defect injection [(1,1)] is the zero is caught', function (p) {
    if (p.indexOf('[(1,1)] is the zero') >= 0) { return [false, 'old defect text present in published page']; }
    var mut = p.replace('column by column — first column', '[(1,1)] is the zero, and column by column — first column');
    return [mut.indexOf('[(1,1)] is the zero') >= 0, 'defect-absence check fails on mutant'];
  });
  add('F8 details-block removal is caught', function (p) {
    if (cnt(p, '<details>') !== 9) { return [false, 'base census wrong']; }
    var mut = p.replace('<details>', '');
    return [cnt(mut, '<details>') === 8, 'details census check fails on mutant'];
  });

  // ===== Group S: style audit against the published P59 house fingerprint =====
  add('S1 kicker line present on P60', function (p) { return [p.indexOf('class="kicker"') >= 0, 'kicker present']; });
  add('S2 tagline present on P60', function (p) { return [p.indexOf('class="tagline"') >= 0, 'tagline present']; });
  add('S3 onramp aside present on P60', function (p) { return [p.indexOf('class="onramp"') >= 0, 'onramp present']; });
  add('S4 exactly one h1 on P60', function (p) { var n = cnt(p, '<h1>'); return [n === 1, n + ' h1']; });
  add('S5 h2 numbered 1 · through 8 ·', function (p) {
    for (var i = 1; i <= 8; i++) {
      if (p.indexOf('<h2>' + i + ' · ') < 0) { return [false, 'missing numbered h2 ' + i]; }
    }
    return [true, 'all eight numbered sections'];
  });
  add('S6 pattern boxes carry ids box-p60, box-p60a, box-p60b', function (p) {
    return [p.indexOf('id="box-p60"') >= 0 && p.indexOf('id="box-p60a"') >= 0 && p.indexOf('id="box-p60b"') >= 0, 'box ids present'];
  });
  add('S7 exhibits are div.exhibit divs, three of them', function (p) { var n = cnt(p, '<div class="exhibit">'); return [n === 3, n + ' exhibit divs']; });
  add('S8 scope box is a warn-box, one only', function (p) { var n = cnt(p, 'class="warn-box"'); return [n === 1, n + ' warn-box']; });
  add('S9 difficulty moons line present', function (p) { return [p.indexOf('class="moons"') >= 0 && p.indexOf('●') >= 0, 'moons present']; });
  add('S10 footer Next points to P62 sheafify', function (p) {
    return [p.indexOf('<strong>Next:</strong> <a href="p62-sheafify-on-site.html">P62 · Sheafify on a site</a>') >= 0, 'footer next correct'];
  });
  add('S11 atlas-home footer present', function (p) { return [p.indexOf('class="atlas-home"') >= 0, 'atlas-home present']; });
  add('S12 P60 and P59 both pin the house MathJax config and link the shared stylesheet', function (p, q) {
    var ok = p.indexOf(PIN) >= 0 && q.indexOf(PIN) >= 0 && p.indexOf('assets/style.css') >= 0 && q.indexOf('assets/style.css') >= 0;
    return [ok, 'both pages carry house pin + stylesheet'];
  });
  add('S13 P60 matches the P59 structural family (8 h2, 0 h3, 9 details, 3 svg, 0 dollars)', function (p, q) {
    var fp = [cnt(p, '<h2>'), cnt(p, '<h3'), cnt(p, '<details>'), cnt(p, '<svg '), cnt(p, '$')];
    var fq = [cnt(q, '<h2>'), cnt(q, '<h3'), cnt(q, '<details>'), cnt(q, '<svg '), cnt(q, '$')];
    var same = fp[0] === fq[0] && fp[1] === fq[1] && fp[2] === fq[2] && fp[3] === fq[3] && fp[4] === fq[4];
    return [same, 'P60 ' + JSON.stringify(fp) + ' vs P59 ' + JSON.stringify(fq)];
  });

  // ===== Group C: canon cross-check and scope honesty =====
  add('C1 scope box discloses not source-verified', function (p) { return [p.indexOf('not source-verified') >= 0, 'disclosure present']; });
  add('C2 McDuff-Segal 1976 named as quoted', function (p) { return [p.indexOf('McDuff and Segal (1976)') >= 0, 'needle present']; });
  add('C3 Barratt-Priddy-Quillen named', function (p) { return [p.indexOf('Barratt–Priddy–Quillen') >= 0, 'needle present']; });
  add('C4 K from Klasse disclosed', function (p) { return [p.indexOf('Klasse') >= 0, 'needle present']; });
  add('C5 Borel-Serre 1958 publication history present', function (p) { return [p.indexOf('published it in 1958') >= 0, 'needle present']; });
  add('C6 no problem-solving-canon misattribution (no Polya/Engel/Zeitz)', function (p) {
    var a = cnt(p, 'Pólya'), b = cnt(p, 'Engel'), c = cnt(p, 'Zeitz');
    return [a === 0 && b === 0 && c === 0, 'Polya ' + a + ', Engel ' + b + ', Zeitz ' + c];
  });
  add('C7 Grothendieck named in lineage', function (p) { return [p.indexOf('Grothendieck') >= 0, 'needle present']; });

  function verify(page, p59) {
    var lines = [], pass = 0;
    for (var i = 0; i < checks.length; i++) {
      var ok = false, detail = '';
      try {
        var r = checks[i].fn(page, p59);
        ok = r[0]; detail = r[1] || '';
      } catch (e) { ok = false; detail = 'EXCEPTION: ' + e; }
      if (ok) { pass++; }
      lines.push((ok ? 'PASS' : 'FAIL') + ' ' + (i + 1) + '. ' + checks[i].name + (detail ? ' — ' + detail : ''));
    }
    lines.push('');
    lines.push('p60-review-verifier: ' + pass + '/' + checks.length + ' checks passed');
    return lines.join('\n');
  }
  return { verify: verify, checks: checks };
})();
if (typeof module !== 'undefined' && module.exports) { module.exports = P60_VERIFY; }
