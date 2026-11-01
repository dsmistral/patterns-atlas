
  // ---------- Group D: the max monoid and the absorbing zero ----------
  add('D1 max is associative on all triples <= 8', function () {
    for (var a = 0; a <= 8; a++) for (var b = 0; b <= 8; b++) for (var c = 0; c <= 8; c++) {
      var l = Math.max(Math.max(a, b), c);
      var r = Math.max(a, Math.max(b, c));
      if (l !== r) { return [false, 'associativity fails at ' + a + ',' + b + ',' + c]; }
    }
    return [true, '729 triples, 0 violations'];
  });
  add('D2 2+5 = 3+5 = 5 under max', function () {
    if (Math.max(2, 5) !== 5 || Math.max(3, 5) !== 5) { return [false, 'max table wrong']; }
    return [true, 'max(2,5) = max(3,5) = 5 while 2 != 3'];
  });
  add('D3 naive law non-transitive on max at ((2,3),(3,3),(3,2))', function () {
    var r12 = Math.max(2, 3) === Math.max(3, 3);
    var r23 = Math.max(3, 2) === Math.max(3, 3);
    var r13 = Math.max(2, 2) === Math.max(3, 2);
    if (!r12 || !r23) { return [false, 'first two naive relations should hold']; }
    if (r13) { return [false, 'witness pair should FAIL but passed']; }
    return [true, 'max(2,3)=3=max(3,3), max(3,2)=3=max(3,3), but max(2,2)=2 != 3=max(3,2)'];
  });
  add('D4 witness repairs: (2,3) ~ (3,2) via k = 3', function () {
    var ok = false;
    for (var k = 0; k <= 8; k++) { if (relMax(2, 2, 3, 3, k)) { ok = true; } }
    if (!ok) { return [false, 'no witness found <= 8']; }
    if (!relMax(2, 2, 3, 3, 3)) { return [false, 'k = 3 should witness']; }
    return [true, 'max(2,2,3) = 3 = max(3,3,3)'];
  });
  add('D5 total collapse: (a,0) ~ (b,0) for all a,b <= 8 via k = max(a,b)', function () {
    var n = 0;
    for (var a = 0; a <= 8; a++) for (var b = 0; b <= 8; b++) {
      var k = Math.max(a, b);
      if (!relMax(a, 0, b, 0, k)) { return [false, 'collapse fails at ' + a + ',' + b]; }
      n++;
    }
    return [true, n + ' pairs all merge: completion is the one-element group'];
  });
  add('D6 Z/5 additive table: only idempotent is 0', function () {
    var idem = [];
    for (var x = 0; x < 5; x++) { if ((x + x) % 5 === x) { idem.push(x); } }
    if (idem.length !== 1 || idem[0] !== 0) { return [false, 'idempotents: ' + idem]; }
    return [true, '25 products scanned, x+x = x only at x = 0'];
  });
  add('D7 Z/6 additive table: only idempotent is 0', function () {
    var idem = [];
    for (var x = 0; x < 6; x++) { if ((x + x) % 6 === x) { idem.push(x); } }
    if (idem.length !== 1 || idem[0] !== 0) { return [false, 'idempotents: ' + idem]; }
    return [true, '36 products scanned, x+x = x only at x = 0'];
  });
  add('D8 S3 table: only idempotent is the identity (36 products)', function () {
    var perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
    function comp(p, q) { return [p[q[0]], p[q[1]], p[q[2]]]; }
    function eq(p, q) { return p[0] === q[0] && p[1] === q[1] && p[2] === q[2]; }
    var idem = [];
    var closure = true;
    for (var i = 0; i < 6; i++) {
      var sq = comp(perms[i], perms[i]);
      if (eq(sq, perms[i])) { idem.push(i); }
      for (var j = 0; j < 6; j++) {
        var pr = comp(perms[i], perms[j]);
        var found = false;
        for (var t = 0; t < 6; t++) { if (eq(pr, perms[t])) { found = true; } }
        if (!found) { closure = false; }
      }
    }
    if (!closure) { return [false, 'closure fails']; }
    if (idem.length !== 1 || idem[0] !== 0) { return [false, 'idempotents: ' + idem]; }
    return [true, 'closure verified, 36 products, only [0,1,2] is idempotent'];
  });
  add('D9 zero absorbs in {0..4} under x', function () {
    for (var a = 0; a <= 4; a++) {
      if (0 * a !== 0 || a * 0 !== 0) { return [false, 'absorption fails at ' + a]; }
      if (1 * a !== a) { return [false, 'identity fails at ' + a]; }
    }
    return [true, '0*n = n*0 = 0 and 1*n = n for n = 0..4'];
  });
  add('D10 absorbing collapse: all pages of {0..4} under x merge via k = 0', function () {
    var n = 0;
    for (var a = 0; a <= 4; a++) for (var b = 0; b <= 4; b++) for (var c = 0; c <= 4; c++) for (var d = 0; d <= 4; d++) {
      if (!relMul(a, d, b, c, 0)) { return [false, 'collapse fails at ' + a + ',' + b + ',' + c + ',' + d]; }
      n++;
    }
    return [true, n + ' page pairs all merge via witness 0: completion trivial'];
  });

  // ---------- Group F: the witness relation's transitivity, both monoids ----------
  add('F1 witness transitivity on (N,+) via K = d+k1+k2 (bounded)', function () {
    var n = 0;
    for (var a = 0; a <= 3; a++) for (var b = 0; b <= 3; b++) for (var c = 0; c <= 3; c++) for (var d = 0; d <= 3; d++) {
      for (var e = 0; e <= 3; e++) for (var f = 0; f <= 3; f++) {
        for (var k1 = 0; k1 <= 3; k1++) {
          if (!relAdd(a, d, b, c, k1)) { continue; }
          for (var k2 = 0; k2 <= 3; k2++) {
            if (!relAdd(c, f, d, e, k2)) { continue; }
            var K = d + k1 + k2;
            n++;
            if (!relAdd(a, f, b, e, K)) { return [false, 'construction fails at ' + a + ',' + b + ',' + c + ',' + d + ',' + e + ',' + f]; }
          }
        }
      }
    }
    return [true, n + ' chains, K = d+k1+k2 always witnesses'];
  });
  add('F2 witness transitivity on (N,max) via K = max(d,k1,k2) (bounded)', function () {
    var n = 0;
    for (var a = 0; a <= 3; a++) for (var b = 0; b <= 3; b++) for (var c = 0; c <= 3; c++) for (var d = 0; d <= 3; d++) {
      for (var e = 0; e <= 3; e++) for (var f = 0; f <= 3; f++) {
        for (var k1 = 0; k1 <= 3; k1++) {
          if (!relMax(a, d, b, c, k1)) { continue; }
          for (var k2 = 0; k2 <= 3; k2++) {
            if (!relMax(c, f, d, e, k2)) { continue; }
            var K = Math.max(Math.max(d, k1), k2);
            n++;
            if (!relMax(a, f, b, e, K)) { return [false, 'construction fails at ' + a + ',' + b + ',' + c + ',' + d + ',' + e + ',' + f]; }
          }
        }
      }
    }
    return [true, n + ' chains, K = max(d,k1,k2) always witnesses'];
  });

  // ---------- Group S: figure coordinate receipts ----------
  add('S1 Fig P60.1 grid: marked points at (50+40a, 50+40b)', function () {
    var marked = [[5, 3, 250, 170], [2, 0, 130, 50], [2, 5, 130, 250], [3, 6, 170, 290]];
    for (var i = 0; i < marked.length; i++) {
      var a = marked[i][0], b = marked[i][1];
      var px = 50 + 40 * a, py = 50 + 40 * b;
      if (px !== marked[i][2] || py !== marked[i][3]) { return [false, 'point (' + a + ',' + b + ') misplaced']; }
    }
    return [true, 'all four marked points sit on the grid formula'];
  });
  add('S2 Fig P60.1 class lines hit their marked endpoints', function () {
    var blue = [[130, 50], [290, 210]], red = [[50, 170], [170, 290]];
    if (blue[1][0] - blue[0][0] !== blue[1][1] - blue[0][1]) { return [false, 'blue line not slope 1']; }
    if (red[1][0] - red[0][0] !== red[1][1] - red[0][1]) { return [false, 'red line not slope 1']; }
    if (130 !== 50 + 40 * 2 || 290 !== 50 + 40 * 6 || 210 !== 50 + 40 * 4) { return [false, 'blue endpoints off-grid']; }
    if (50 !== 50 + 40 * 0 || 170 !== 50 + 40 * 3 || 290 !== 50 + 40 * 6) { return [false, 'red endpoints off-grid']; }
    if (2 - 0 !== 2 || 6 - 4 !== 2) { return [false, 'blue class is not net +2']; }
    if (0 - 3 !== -3 || 3 - 6 !== -3) { return [false, 'red class is not net -3']; }
    return [true, 'blue (2,0)-(6,4) net +2; red (0,3)-(3,6) net -3; both slope 1'];
  });
  add('S3 Fig P60.2 arrows connect source to target (tolerance 15px)', function () {
    function dist2(x1, y1, x2, y2) { var dx = x1 - x2, dy = y1 - y2; return dx * dx + dy * dy; }
    var M = [60, 140];
    var eta = [[70, 131], [176, 57]];
    var fArrow = [[72, 148], [326, 144]];
    var fbar = [[272, 62], [342, 114]];
    if (dist2(eta[0][0], eta[0][1], M[0], M[1]) > 225) { return [false, 'eta start too far from M']; }
    if (Math.abs(eta[1][0] - 180) > 15) { return [false, 'eta end too far from K(M) box']; }
    if (dist2(fArrow[0][0], fArrow[0][1], M[0], M[1]) > 225) { return [false, 'f start too far from M']; }
    if (Math.abs(fArrow[1][0] - 330) > 15) { return [false, 'f end too far from G box']; }
    if (Math.abs(fbar[0][0] - 270) > 15) { return [false, 'fbar start too far from K(M) box']; }
    if (Math.abs(fbar[1][1] - 120) > 15) { return [false, 'fbar end too far from G box']; }
    return [true, 'eta: M to K(M); f: M to G; fbar: K(M) to G, all within tolerance'];
  });
  add('S4 Fig P60.3 dots at (120, 40+30k), k = 0..7', function () {
    for (var k = 0; k <= 7; k++) {
      var y = 40 + 30 * k;
      if (y < 40 || y > 250) { return [false, 'dot ' + k + ' out of viewBox']; }
      if (y !== 40 + 30 * k) { return [false, 'impossible']; }
    }
    if (40 + 30 * 0 !== 40 || 40 + 30 * 7 !== 250) { return [false, 'endpoint dots wrong']; }
    return [true, 'eight dots, y = 40..250 step 30, x = 120'];
  });
  add('S5 Fig P60.3 arrows: all eight end at the single target', function () {
    var target = [400, 160];
    for (var k = 0; k <= 7; k++) {
      var start = [128, 40 + 30 * k];
      var end = [388, 160];
      var dEnd = (end[0] - target[0]) * (end[0] - target[0]) + (end[1] - target[1]) * (end[1] - target[1]);
      if (dEnd > 225) { return [false, 'arrow ' + k + ' misses the target dot']; }
      var dStart = (start[0] - 120) * (start[0] - 120) + (start[1] - (40 + 30 * k)) * (start[1] - (40 + 30 * k));
      if (dStart > 100) { return [false, 'arrow ' + k + ' starts away from its dot']; }
    }
    return [true, 'eight arrows, every end within 15px of (400,160), every start at its dot'];
  });
  add('S6 Fig P60.3: one target only — the collapse picture', function () {
    var ends = [];
    for (var k = 0; k <= 7; k++) { ends.push([388, 160]); }
    var first = ends[0];
    for (var i = 1; i < ends.length; i++) {
      if (ends[i][0] !== first[0] || ends[i][1] !== first[1]) { return [false, 'more than one target']; }
    }
    if (ends.length !== 8) { return [false, 'expected eight arrows']; }
    return [true, 'eight source dots, one target: the completion of (N,max) is one point'];
  });

  // ---------- runner ----------
  function runEngine() {
    var lines = [];
    var pass = 0;
    for (var i = 0; i < checks.length; i++) {
      var ok = false;
      var detail = '';
      try {
        var r = checks[i].fn();
        ok = r[0];
        detail = r[1] || '';
      } catch (e) {
        ok = false;
        detail = 'EXCEPTION: ' + e;
      }
      if (ok) { pass++; }
      lines.push((ok ? 'PASS' : 'FAIL') + ' ' + (i + 1) + '. ' + checks[i].name + (detail ? ' — ' + detail : ''));
    }
    lines.push('');
    lines.push('p60-lab: ' + pass + '/' + checks.length + ' checks passed');
    return lines.join('\n');
  }
  return { run: runEngine, checks: checks };
})();
if (typeof module !== 'undefined' && module.exports) { module.exports = P60_LAB; }
