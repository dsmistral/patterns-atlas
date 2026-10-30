// P15 adversarial review verifier — independent second engine, shares no code
// with p15-lab.js. Every check recomputes the mathematics from first principles
// (Math.sin/tan, exact integer arithmetic where the page claims integers) and
// then tests the assembled page bytes. 15 checks; 6 doctored clones that MUST
// be rejected; needle and poison panels. No recursion, no BigInt.

function P15_VERIFY(page) {
  var results = [];
  function C(name, ok) { results.push({ name: name, ok: !!ok }); }

  // ---- 1. hexagon walls, exact + the stopped one-digit trap
  (function() {
    var sinOk = Math.abs(6 * Math.sin(Math.PI / 6) - 3) < 1e-12;
    var tanOk = Math.abs(6 * Math.tan(Math.PI / 6) - 2 * Math.sqrt(3)) < 1e-12;
    var row = page.indexOf('<td>6</td><td>3.00000</td><td>3.46410</td><td>0.46410</td>') >= 0;
    var trap = page.indexOf('3 &lt; \\pi &lt; 2\\sqrt 3') >= 0;
    var twoDec = Math.abs(2 * Math.sqrt(3) - 3.4641016) < 1e-6;
    C('hexagon-exact-walls', sinOk && tanOk && row && trap && twoDec);
  })();

  // ---- 2. polygon table: all six rows recomputed
  (function() {
    var all = true;
    [6, 12, 24, 48, 96, 192].forEach(function(n) {
      var x = Math.PI / n;
      var inn = n * Math.sin(x), out = n * Math.tan(x);
      var gap = out - inn;
      var row = '<td>' + n + '</td><td>' + inn.toFixed(5) + '</td><td>'
               + out.toFixed(5) + '</td><td>' + gap.toFixed(5) + '</td>';
      if (page.indexOf(row) < 0) all = false;
    });
    C('polygon-table-rows', all);
  })();

  // ---- 3. gap column reading
  (function() {
    var s = [6, 12, 24, 48, 96, 192].map(function(n) {
      var x = Math.PI / n;
      return (n * (Math.tan(x) - Math.sin(x))).toFixed(5);
    }).join(', ');
    C('gap-column-string', page.indexOf(s) >= 0);
  })();

  // ---- 4. ratio run and gap*n^2 run + the true limit
  (function() {
    var gaps = [6, 12, 24, 48, 96, 192].map(function(n) {
      var x = Math.PI / n;
      return n * (Math.tan(x) - Math.sin(x));
    });
    var ratios = [];
    for (var i = 0; i < 5; i++) ratios.push((Math.round(gaps[i] / gaps[i + 1] * 100) / 100).toFixed(2));
    var n2 = [6, 12, 24, 48, 96, 192].map(function(n, i) {
      return (Math.round(gaps[i] * n * n * 10) / 10).toFixed(1);
    });
    var limitOk = Math.abs(Math.pow(Math.PI, 3) / 2 - 15.5) < 0.01;
    C('ratios-and-n2-columns',
      page.indexOf(ratios.join(', ')) >= 0 &&
      page.indexOf(n2.join(', ')) >= 0 && limitOk);
  })();

  // ---- 5. Archimedes walls, exact rationals
  (function() {
    var sum1 = 3 * 71 + 10 === 223 && 3 * 7 + 1 === 22;
    var gap = 22 * 71 - 223 * 7 === 1;
    var fp = 223 / 71 < Math.PI && Math.PI < 22 / 7;
    var needles = ['\\frac{223}{71}', '\\frac{22}{7}', '3 + \\frac{10}{71}',
                   'Measurement of a Circle'].every(function(s) { return page.indexOf(s) >= 0; });
    C('archimedes-walls-rationals', sum1 && gap && fp && needles);
  })();

  // ---- 6. Exercise 1 doubling recurrences
  (function() {
    var s3 = Math.sqrt(3);
    var a12 = Math.sqrt(2 - s3);
    var b12 = 4 - 2 * s3;
    var identA = Math.abs(a12 * a12 - (2 - s3)) < 1e-15;
    var identB = Math.abs(2 / (2 + s3) - b12) < 1e-15;
    var vals = a12.toFixed(5) === '0.51764' && b12.toFixed(5) === '0.53590'
            && (6 * a12).toFixed(5) === '3.10583' && (6 * b12).toFixed(5) === '3.21539';
    var sq = 347 * 347 === 120409 && 12 < 12.0409;
    var needles = page.indexOf('b_{12} = 4 - 2\\sqrt 3') >= 0
               && page.indexOf('12.0409') >= 0;
    C('ex1-doubling-recurrences', identA && identB && vals && sq && needles);
  })();

  // ---- 7. Liu Hui: 192 sides, his sliver trap, value 3.1416
  (function() {
    var needles = ['Liu Hui', 'Nine Chapters',
                   'A_{2N} &lt; A_{\\text{circle}} &lt; A_{2N} + D_{2N}',
                   '3.1416', '192'].every(function(s) { return page.indexOf(s) >= 0; });
    var valOk = Math.abs(3.1416 - Math.PI) < 5e-5; // his value = pi to 4 decimals
    C('liu-hui-and-192', needles && valOk);
  })();

  // ---- 8. Zu Chongzhi walls + 355/113 six-decimal accuracy
  (function() {
    var walls = page.indexOf('3.1415926 &lt; \\pi &lt; 3.1415927') >= 0
             && page.indexOf('24{,}576') >= 0;
    var fp = 3.1415926 < Math.PI && Math.PI < 3.1415927;
    var zu = page.indexOf('355/113') >= 0;
    var acc = Math.abs(355 / 113 - Math.PI) < 5e-7;   // six decimals
    var outside = 355 * 10000000 > 31415927 * 113;     // integer cross-mult
    C('zu-walls-and-355', walls && fp && zu && acc && outside);
  })();

  // ---- 9. parabola: triangle T = 1 (shoelace) and segment area = 4/3 (exact)
  (function() {
    var shoelace = Math.abs(0 * (1 - 1) + (-1) * (1 - 0) + 1 * (0 - 1)) / 2; // = 1
    var F = function(x) { return x - x * x * x / 3; };
    var area = F(1) - F(-1);   // 4/3 exactly in fp
    var needles = page.indexOf('area is exactly \\(1\\)') >= 0
               && page.indexOf('y = x^2') >= 0
               && page.indexOf('\\tfrac{4}{3}') >= 0;
    C('parabola-T-and-area', shoelace === 1 && Math.abs(area - 4 / 3) < 1e-15 && needles);
  })();

  // ---- 10. parabola table + wall collapse covered_k + (4/3)T*4^{-k} = 4/3 T
  (function() {
    var covered = [1, 1.25, 1.3125, 1.328125, 1.33203125];
    var gapDen = [3, 12, 48, 192, 768];
    var ok = true;
    for (var k = 1; k <= 5; k++) {
      var cov = (4 / 3) * (1 - Math.pow(4, -k));
      if (cov !== covered[k - 1]) ok = false;
      var gap = (4 / 3) * Math.pow(4, -k);
      if (Math.abs(gap - 1 / gapDen[k - 1]) > 1e-15) ok = false;
      if (Math.abs(cov + gap - 4 / 3) > 1e-15) ok = false;
    }
    var needles = ['1.33203125', '1.328125', '\\tfrac{1}{768}', '\\tfrac{1}{192}',
                   '\\tfrac{1}{48}', '\\tfrac{1}{12}', '\\tfrac{1}{3}']
                  .every(function(s) { return page.indexOf(s) >= 0; });
    C('parabola-table-and-collapse', ok && needles);
  })();

  // ---- 11. e walls from exact fractions: 986410/362880, 8877691/3265920
  (function() {
    var fact = 1, num = 362880; // k = 0 term
    for (var k = 1; k <= 9; k++) { fact *= k; num += 362880 / fact; }
    var numOk = num === 986410;
    var upNum = num * 9 + 1;
    var upOk = upNum === 8877691 && 9 * 362880 === 3265920;
    var lo = Math.floor(num * 1000000000 / 362880);
    var hi = Math.floor(upNum * 1000000000 / 3265920);
    var floorsOk = lo === 2718281525 && hi === 2718281831;
    var round5 = Math.round(num / 362880 * 100000) === 271828
              && Math.round(upNum / 3265920 * 100000) === 271828;
    var needles = page.indexOf('986410') >= 0 && page.indexOf('362880') >= 0
               && page.indexOf('2.718281526') >= 0 && page.indexOf('2.718281832') >= 0
               && page.indexOf('0.000000306') >= 0
               && 2718281832 - 2718281526 === 306; // printed walls differ by 3.06e-7
    C('e-walls-fractions', numOk && upOk && floorsOk && round5 && needles);
  })();

  // ---- 12. tail-bound honesty: the wall 3.07e-7 is derivable, 3.06e-7 is not
  (function() {
    var denom = 3265920;
    var above306 = 306 * denom < 1000000000;   // 1/denom > 3.06e-7
    var below307 = 307 * denom > 1000000000;   // 1/denom < 3.07e-7
    var needle = page.indexOf('3.07 \\times 10^{-7}') >= 0;
    var poison = page.indexOf('3.06 \\times') < 0;
    C('tail-bound-honesty', above306 && below307 && needle && poison);
  })();

  // ---- 13. e floor + irrationality (q!R_q integer in (0,1))
  (function() {
    var facts = true;
    var f = 1;
    for (var k = 1; k <= 20; k++) { f *= k; if (f < Math.pow(2, k - 1)) facts = false; }
    var floorOk = 2.5 < Math.E && Math.E < 3;
    var irr = true;
    var qf = 1;
    for (var q = 1; q <= 10; q++) {
      qf *= q;
      var S = 0, fact2 = 1;
      for (var j = 0; j <= q; j++) { if (j > 0) fact2 *= j; S += 1 / fact2; }
      var v = qf * (Math.E - S);
      if (!(v > 0 && v < 1)) irr = false;
    }
    var witness = Math.abs(2 * (Math.E - 2.5) - 0.4366) < 5e-5;
    var needles = page.indexOf('the walls straddle no integer') >= 0
               && page.indexOf('\\lfloor e \\rfloor = 2') >= 0
               && page.indexOf('0.4366') >= 0;
    C('e-floor-and-irrationality', facts && floorOk && irr && witness && needles);
  })();

  // ---- 14. bisection: 34 steps, integer certificates, adjacency
  (function() {
    var steps = Math.pow(2, -34) < 1e-10 && Math.pow(2, -33) > 1e-10;
    var log2 = Math.abs(Math.log(2) / Math.log(10) - 0.301) < 0.0005; // log10(2)
    var cert = 1414 * 1414 === 1999396 && 1415 * 1415 === 2002225
            && 1999396 < 2000000 && 2000000 < 2002225;
    var adj = Math.floor(1000 * Math.SQRT2) === 1414;
    var needles = page.indexOf('2^{-34}') >= 0
               && page.indexOf('ten full decimals cost \\(34\\) steps') >= 0
               && page.indexOf('0.301') >= 0
               && page.indexOf('1414^2 = 1999396') >= 0
               && page.indexOf('2002225 = 1415^2') >= 0;
    C('bisection-34-and-certificates', steps && cert && adj && needles && log2);
  })();

  // ---- 15. Babylonian machine: error column recomputed, digits double
  (function() {
    var x = 1, ok = true;
    var printed = [0.414, 0.0858, 0.00245, 2.1e-6, 1.6e-12];
    var tols = [5e-4, 5e-5, 5e-6, 5e-8, 5e-14];
    for (var i = 0; i < 5; i++) {
      var err = Math.abs(x - Math.SQRT2);
      if (Math.abs(err - printed[i]) > tols[i]) ok = false;
      x = 0.5 * (x + 2 / x);
    }
    var needles = page.indexOf('0.414') >= 0 && page.indexOf('0.0858') >= 0
               && page.indexOf('0.00245') >= 0 && page.indexOf('2.1 \\times 10^{-6}') >= 0
               && page.indexOf('1.6 \\times 10^{-12}') >= 0;
    C('babylonian-error-doubling', ok && needles);
  })();

  var pass = 0, fail = 0, fails = [];
  results.forEach(function(r) {
    if (r.ok) pass++; else { fail++; fails.push(r.name); }
  });
  return { pass: pass, fail: fail, fails: fails };
}

// ---- doctored clones: each must be REJECTED (at least one check fails)
function P15_CLONES() {
  return [
    { name: 'clone1-tail-defect (the original S45 bug, reintroduced)',
      mutate: function(p) { return p.split('3.07 \\times 10^{-7}').join('3.06 \\times 10^{-7}'); } },
    { name: 'clone2-e-wall-off-by-one',
      mutate: function(p) { return p.split('2.718281832').join('2.718281831'); } },
    { name: 'clone3-b12-recurrence-broken',
      mutate: function(p) { return p.split('b_{12} = 4 - 2\\sqrt 3').join('b_{12} = 4 - 2\\sqrt 5'); } },
    { name: 'clone4-certificate-broken',
      mutate: function(p) { return p.split('1414^2 = 1999396').join('1414^2 = 1999395'); } },
    { name: 'clone5-zu-approx-broken',
      mutate: function(p) { return p.split('355/113').join('356/113'); } },
    { name: 'clone6-ratio-run-broken',
      mutate: function(p) { return p.split('4.24, 4.05').join('4.44, 4.05'); } }
  ];
}

var P15_POISONS = ['TODO', 'XXX', 'Lorem', 'placeholder', 'drafting', 'wait —'];

function P15_RUN(page) {
  var report = {};
  report.verify = P15_VERIFY(page);
  report.clones = P15_CLONES().map(function(c) {
    var doctored = c.mutate(page);
    var mutated = doctored !== page;
    var v = P15_VERIFY(doctored);
    return { name: c.name, mutated: mutated, rejected: v.fail > 0, fails: v.fails };
  });
  report.needles = ['223/71', '22/7', '3.1416', '3.1415926', '3.1415927', '24{,}576',
    '355/113', '986410', '362880', '2.718281526', '2.718281832', '3.07 \\times 10^{-7}',
    '0.4366', '1414^2 = 1999396', '2002225 = 1415^2', '2^{-34}', '0.301', '0.0858',
    '1.6 \\times 10^{-12}', '\\tfrac{1}{768}', '1.33203125', '0.51764', '0.53590', '1647']
    .filter(function(s) { return page.indexOf(s) >= 0; }).length;
  report.poisonsPresent = P15_POISONS.filter(function(s) { return page.indexOf(s) >= 0; });
  return report;
}
