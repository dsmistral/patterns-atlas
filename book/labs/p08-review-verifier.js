// p08-review-verifier.js — S38 adversarial verifier for p08-symmetry.html.
// Fresh engine: zero code shared with the p08 battery (different harness, independently written checks).
// 14 must-fail injections: each poisons one load-bearing claim of the page; a fresh needle check,
// written independently, must PASS on the real page and FAIL on the doctored one.
// 2 positive controls recompute two mathematical heartbeats of the page from scratch.
// Pre-dispatch audit: every needle passes on the real page; every poison alters it and kills its needle.

var VER = { log: [], pass: 0, fail: 0, audit: [] };

VER.run = function (page) {
  var L = VER.log;
  L.push('=== p08-review-verifier — fresh adversarial engine: 14 injections + 2 controls; zero code shared with the battery ===');

  var TARGETS = {
    V01: 'seating count 5{,}040',
    V02: 'Fig1 seat C at (222,115)',
    V03: 'necklace-count verdict (block 5 + Ex4)',
    V04: '3R3B ledger 2*1 + 6*3 = 20',
    V05: 'Fig2/Fig3 viewBox 340x240',
    V06: 'Fig2 mirror label',
    V07: 'square certificate (a-10)^2',
    V08: 'figure aria-labels (exactly 3)',
    V09: 'dollar-free page',
    V10: 'footer next-link to P09',
    V11: 'Fig3 twin label a = 15: A = 75',
    V12: 'inline TeX balance',
    V13: 'Ex5 census array',
    V14: 'Burnside glimpse 84/6 = 14'
  };

  var needle = {
    V01: function (p) { return p.indexOf('5{,}040') >= 0; },
    V02: function (p) { return p.indexOf('cx="222" cy="115"') >= 0; },
    V03: function (p) { return p.indexOf('necklace count is \\(4\\)') >= 0; },
    V04: function (p) { return p.indexOf('2 \\cdot 1 + 6 \\cdot 3 = 20') >= 0; },
    V05: function (p) { return p.indexOf('viewBox="0 0 340 240"') >= 0; },
    V06: function (p) { return p.indexOf('y = x (the mirror)') >= 0; },
    V07: function (p) { return p.indexOf('100 - 20a + a^2 = (a-10)^2') >= 0; },
    V08: function (p) { var n = 0, i = -1; while ((i = p.indexOf('aria-label="', i + 1)) >= 0) n++; return n === 3; },
    V09: function (p) { return p.indexOf('$') === -1; },
    V10: function (p) { return p.indexOf('Next up the spine: <a href="p09-invariant.html">') >= 0; },
    V11: function (p) { return p.indexOf('a = 15: A = 75') >= 0; },
    V12: function (p) { var a = 0, b = 0, i; for (i = 0; i + 1 < p.length; i++) { if (p.substr(i, 2) === '\\(') a++; if (p.substr(i, 2) === '\\)') b++; } return a === b && a > 100; },
    V13: function (p) { return p.indexOf('1, 1, 2, 3, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6') >= 0; },
    V14: function (p) { return p.indexOf('84/6 = 14') >= 0; }
  };

  var poison = {
    V01: function (p) { return p.split('5{,}040').join('5{,}041'); },
    V02: function (p) { return p.split('cx="222"').join('cx="224"'); },
    V03: function (p) { return p.split('necklace count is \\(4\\)').join('necklace count is \\(3\\)'); },
    V04: function (p) { return p.split('6 \\cdot 3 = 20').join('6 \\cdot 3 = 21'); },
    V05: function (p) { return p.split('viewBox="0 0 340 240"').join('viewBox="0 0 340 230"'); },
    V06: function (p) { return p.split('y = x (the mirror)').join('y = x'); },
    V07: function (p) { return p.split('= (a-10)^2').join('= (a-9)^2'); },
    V08: function (p) { return p.split(' role="img" aria-label="Fig P08.2').join(' role="img" data-label="Fig P08.2'); },
    V09: function (p) { return p.replace('</html>', '</html>$'); },
    V10: function (p) { return p.split('Next up the spine: <a href="p09-invariant.html">').join('Next up the spine: <a href="p10-pigeonhole.html">'); },
    V11: function (p) { return p.split('A = 75').join('A = 76'); },
    V12: function (p) { return p.split('<footer>').join('<footer>\\('); },
    V13: function (p) { return p.split('1, 1, 2, 3, 3, 6').join('1, 1, 2, 2, 3, 6'); },
    V14: function (p) { return p.split('84/6 = 14').join('84/6 = 13'); }
  };

  var ids = ['V01','V02','V03','V04','V05','V06','V07','V08','V09','V10','V11','V12','V13','V14'];
  var auditClean = 0;
  ids.forEach(function (id) {
    if (!needle[id](page)) { VER.audit.push('audit: needle ' + id + ' does not pass on the real page'); return; }
    var d = poison[id](page);
    if (d === page) { VER.audit.push('audit: poison ' + id + ' is a no-op on the real page'); return; }
    if (needle[id](d)) { VER.audit.push('audit: poison ' + id + ' leaves its needle intact'); return; }
    auditClean++;
  });
  L.push('pre-dispatch audit: ' + auditClean + '/14 triples confirmed (needle passes on the real page; poison alters the page; needle dies on the doctored page)');
  if (VER.audit.length > 0) {
    VER.audit.forEach(function (s) { L.push(s); });
    L.push('ABORT: pre-dispatch audit failed — verifier not dispatched');
    return L.join('\n');
  }

  ids.forEach(function (id) {
    var d = poison[id](page);
    if (!needle[id](d)) {
      VER.pass++;
      L.push('PASS ' + id + ' — injection caught: ' + TARGETS[id] + ' poisoned; the fresh needle refutes the doctored page');
    } else {
      VER.fail++;
      L.push('FAIL ' + id + ' — INJECTION SURVIVED: the doctored page still satisfies the fresh needle (' + TARGETS[id] + ')');
    }
  });

  // C1 — fresh 3R3B census from scratch: all C(6,3) = 20 arrangements, orbits under rotation
  var orbitSeen = {}, orbitSizes = [];
  var i, j, k;
  for (i = 0; i < 6; i++) {
    for (j = i + 1; j < 6; j++) {
      for (k = j + 1; k < 6; k++) {
        var red = [i, j, k];
        var s = '';
        var t;
        for (t = 0; t < 6; t++) { s += (red.indexOf(t) >= 0 ? 'R' : 'B'); }
        var canon = s, size = 0, cur = s;
        do {
          if (cur < canon) { canon = cur; }
          cur = cur.slice(1) + cur[0];
          size++;
        } while (cur !== s);
        if (!orbitSeen[canon]) { orbitSeen[canon] = true; orbitSizes.push(size); }
      }
    }
  }
  orbitSizes.sort(function (a, b) { return a - b; });
  var c1ok = orbitSizes.length === 4 && orbitSizes[0] === 2 && orbitSizes[1] === 6 && orbitSizes[2] === 6 && orbitSizes[3] === 6;
  if (c1ok) {
    VER.pass++;
    L.push('PASS C1 — positive control: fresh 3R3B census recomputed from scratch — 4 necklaces, orbit sizes [2, 6, 6, 6], matching the page ledger');
  } else {
    VER.fail++;
    L.push('FAIL C1 — fresh census disagrees with the page ledger: ' + JSON.stringify(orbitSizes));
  }

  // C2 — fresh Fig1 geometry: every r=13 seat circle centre sits on the r=72 circle at (150,115)
  var seats = 0, onCircle = 0, worst = 0;
  var geo = /<circle cx="([0-9.]+)" cy="([0-9.]+)" r="13"/g, m;
  while ((m = geo.exec(page)) !== null) {
    seats++;
    var dx = parseFloat(m[1]) - 150, dy = parseFloat(m[2]) - 115;
    var dev = Math.abs(Math.sqrt(dx * dx + dy * dy) - 72);
    if (dev > worst) { worst = dev; }
    if (dev <= 0.5) { onCircle++; }
  }
  if (seats === 8 && onCircle === 8) {
    VER.pass++;
    L.push('PASS C2 — positive control: fresh Fig1 geometry — all 8 seats lie on the r=72 circle (worst deviation ' + worst.toFixed(3) + ' px)');
  } else {
    VER.fail++;
    L.push('FAIL C2 — fresh geometry: ' + onCircle + '/' + seats + ' seats on the circle, worst deviation ' + worst.toFixed(3) + ' px');
  }

  L.push('VERDICT: ' + (VER.pass + VER.fail) + ' verdict lines — ' + VER.pass + ' PASS, ' + VER.fail + ' FAIL');
  return L.join('\n');
};
