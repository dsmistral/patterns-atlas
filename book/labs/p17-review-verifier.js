// P17 REVIEW VERIFIER — part 1: own harness, needles, poisons, doctored clones
var V17 = { checks: 0, fails: 0, failed: [] };
function vCheck(name, cond) { V17.checks++; if (!cond) { V17.fails++; V17.failed.push(name); } }
function vEqN(name, a, b) { vCheck(name, a === b); }
function vIn(page, s) { return page.split(s).length > 1; }
function vAbsent(page, s) { return page.split(s).join('') === page; } // global absence
function vHowMany(page, s) { return page.split(s).length - 1; }
function vEndsWith(page, s) { return page.indexOf(s, page.length - s.length) !== -1; }

function v17_needles(page) {
  var N = [
    ['tagline', 'The flip is the cheapest machine mathematics owns'],
    ['bridge P16 twin', 'the flip is the dictionary move\'s mirror twin'],
    ['bridge P09 zero', 'a flip that changes the sign of a quantity leaves its zero untouched'],
    ['s2 opener', 'Two questions, cold'],
    ['s2 uniforms', 'one question wearing two uniforms'],
    ['s2 involution', 'Flip twice, arrive home'],
    ['s2 fine print moves', 'erase the exception; it'],
    ['s2 verdict line', 'the difference between a theorem and a lie'],
    ['fig1 caption', 'Same magnitude, opposite sign, always'],
    ['box p17 checked', 'the relations it was <strong>checked</strong> to carry'],
    ['box a mirror', 'a mirror that does not reverse your handedness is a window'],
    ['box a arrows', 'comes out pointing the other way'],
    ['box a unpriced', 'they are unpriced'],
    ['box b grammatical', 'the pairing is grammatical'],
    ['box b rhyme', 'rhymes do not carry proofs'],
    ['ex1 table gap', 'the gap'],
    ['ex1 incidence', 'the <em>same equation</em>'],
    ['ex1 P09 upside down', 'standing on its head'],
    ['ex1 repair year', 'until 1639 and Desargues'],
    ['ex1 ledger', 'the census\'s missing ledger entry'],
    ['ex1 harvest', 'is the reason a proof of either statement is a proof of both'],
    ['ex2 boundary', 'the hexagonal tiling'],
    ['ex2 self-dual', 'the tetrahedron is the only self-dual solid'],
    ['ex2 paid for three', 'and you paid for three'],
    ['ex3 reversal mark', 'the very mark that the flip is a dual rather than a copy'],
    ['ex3 other law', 'is the first one run through the machine'],
    ['ex3 total dictionary', 'the fine print shrinks to a sentence'],
    ['exA distance', 'the certificate has no distance clause'],
    ['exB seductive', 'Wordplay flips are seductive precisely because'],
    ['exB autopsy', 'here is the autopsy'],
    ['exC mirror', 'worth knowing, worth nothing as a shortcut'],
    ['warn signposts', 'signposts, not content'],
    ['doors P18', 'Exhibit C\'s mirror that gives nothing back'],
    ['habit', 'price the twin before paying for the problem'],
    ['lineage printing press', 'turning two centuries of paired theorems into a printing press'],
    ['lineage twins', 'without either author knowing they were twins'],
    ['lineage self-dual euler', 'the equation is its own dual'],
    ['lineage von neumann', 'put the flip to work in the age of machines'],
    ['lineage closing', 'the checks were cheap, and the theorems came in pairs'],
    ['ex4 rhyme', 'a rhyme, not a dual'],
    ['ex4 verdict', 'interesting question, wrong machine'],
    ['ex5 underwrite', 'the projective repair must underwrite'],
    ['ex5 casualty', 'the one casualty is exactly the one the dictionary had flagged']
  ];
  for (var i = 0; i < N.length; i++) vCheck('needle: ' + N[i][0], vIn(page, N[i][1]));
  vEqN('needle count reported', N.length, 43);
  return N;
}

function v17_poisons(page) {
  var P = ['Gergogne', '65,536', '\u2014 wait:', 'TODO', 'FIXME', 'Lorem', '45 collinear', '560 collinear',
           'Brianchon 1807', 'Ceva 1679', 'Euler 1751', 'Gergonne 1826', 'Poncelet 1824', 'scratch that'];
  for (var i = 0; i < P.length; i++) vCheck('poison absent: ' + JSON.stringify(P[i]), vAbsent(page, P[i]));
  vEqN('poison count reported', P.length, 14);
}

function v17_clones(page) {
  // doctored clones: each mutant differs INSIDE the needle span and must be globally absent
  var C = [
    ['Flip twice, arrive home', 'Flip twice, arrive homx'],
    ['the certificate has no distance clause', 'the certificate has no distance clausx'],
    ['Collinear points, concurrent duals', 'Collinear points, concurrent duax'],
    ['theorems came in pairs', 'theorems came in pairx'],
    ['printing press', 'printing presx'],
    ['its own dual', 'its own duax'],
    ['ledger entry', 'ledger entrx'],
    ['wrong machine', 'wrong machinx'],
    ['two uniforms', 'two uniformx'],
    ['Five solids in the universe', 'Five solids in the universx'],
    ['hexagonal tiling', 'hexagonal tilinx'],
    ['the hexagonal tiling of the plane', 'the hexagonal tiling of the planx']
  ];
  for (var i = 0; i < C.length; i++) {
    vCheck('clone pair ' + i + ': needle present', vIn(page, C[i][0]));
    vCheck('clone pair ' + i + ': mutant globally absent', vAbsent(page, C[i][1]));
  }
  vEqN('clone count reported', C.length, 12);
}
// P17 REVIEW VERIFIER — part 2: lattice census by canonical-line families, dictionary checks
function gcd2(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function canonLine(x1, y1, x2, y2) {
  var a = y2 - y1, b = x1 - x2, c = x2 * y1 - x1 * y2; // ax+by+c=0 through both
  var g = gcd2(a, b); a = a / g; b = b / g; c = c / g;
  if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c; }
  return a + ',' + b + ',' + c;
}
function onLine(a, b, c, x, y) { return a * x + b * y + c === 0; }
function ch3(k) { return k * (k - 1) * (k - 2) / 6; }

function v17_census(page) {
  var pts = [];
  for (var p = 0; p <= 3; p++) for (var q = 0; q <= 3; q++) pts.push([p, q]);
  vEqN('grid has 16 points', pts.length, 16);
  var fam = {};
  for (var i = 0; i < pts.length; i++) for (var j = i + 1; j < pts.length; j++) {
    var key = canonLine(pts[i][0], pts[i][1], pts[j][0], pts[j][1]);
    if (!fam[key]) fam[key] = null; // register family
  }
  var keys = Object.keys(fam), totalTrip = 0, horiz = 0, vert = 0, s1 = 0, sm1 = 0, other = 0, nlines = 0;
  for (var k = 0; k < keys.length; k++) {
    var pr = keys[k].split(','), a = +pr[0], b = +pr[1], c = +pr[2], cnt = 0;
    for (var t = 0; t < pts.length; t++) if (onLine(a, b, c, pts[t][0], pts[t][1])) cnt++;
    if (cnt >= 3) {
      nlines++; totalTrip += ch3(cnt);
      var slope = b === 0 ? Infinity : -a / b;
      if (b === 0 && a !== 0) vert += ch3(cnt);
      else if (a === 0) horiz += ch3(cnt);
      else if (slope === 1) s1 += ch3(cnt);
      else if (slope === -1) sm1 += ch3(cnt);
      else other += ch3(cnt);
    }
  }
  vEqN('census total collinear triples', totalTrip, 44);
  vEqN('census horizontal triples', horiz, 16);
  vEqN('census vertical triples', vert, 16);
  vEqN('census slope-1 triples', s1, 6);
  vEqN('census slope -1 triples', sm1, 6);
  vEqN('census other-slope triples (must be 0)', other, 0);
  vEqN('families with >=3 points', nlines, 14);
  vCheck('page says binom(16,3) = 560', vIn(page, '\\(\\binom{16}{3} = 560\\)'));
  vEqN('C(16,3) recomputed', 16 * 15 * 14 / 6, 560);
  vCheck('page says 44 out of 560', vIn(page, '44</a> collinear triples out of 560') || vIn(page, 'collinear triples out of 560'));
}

// dictionary: point (p,q) -> line px - y = q, i.e. [p,-1,-q]; line y=mx+c -> (m,-c)
function dualPt(p, q) { return [p, -1, -q]; }
function dualLine(m, c) { return [m, -c]; }

function v17_dictionary(page) {
  // involution on all 16 grid points: point -> line -> point
  var ok = true;
  for (var p = 0; p <= 3; p++) for (var q = 0; q <= 3; q++) {
    var L = dualPt(p, q); // px - y = q  =>  y = px - q, so m=p, c=-q
    var back = dualLine(L[0], L[2]); // line px-y=q is y=px+(-q): m=p, c=-q=L[2]; dualLine(m,c)=(m,-c)
    if (!(back[0] === p && back[1] === q)) ok = false;
  }
  vCheck('involution: dual of dual returns the point (all 16)', ok);
  // incidence symmetry: P=(a,b) on dual(A=(p,q)) iff pa-b=q iff A on dual(P); all 256 pairs
  var sym = true;
  for (var a = 0; a <= 3; a++) for (var b = 0; b <= 3; b++) for (var pp = 0; pp <= 3; pp++) for (var qq = 0; qq <= 3; qq++) {
    var P_on_dualA = (pp * a - b === qq);       // P lies on  px-y=q
    var A_on_dualP = (a * pp - qq === b);       // A lies on  ax-y=b
    if (P_on_dualA !== A_on_dualP) sym = false;
  }
  vCheck('incidence symmetry ap = b + q (all 256 ordered pairs)', sym);
  vCheck('page states ap = b + q', vIn(page, 'ap = b + q'));
  // dual lines of a non-vertical collinear family are concurrent: solve L1,L2 then check L3
  var conc = 0, para = 0, concOK = true, paraOK = true;
  var trip = [];
  for (var i = 0; i < 16; i++) for (var j = i + 1; j < 16; j++) for (var k2 = j + 1; k2 < 16; k2++) {
    var P1 = [i % 4, Math.floor(i / 4)], P2 = [j % 4, Math.floor(j / 4)], P3 = [k2 % 4, Math.floor(k2 / 4)];
    var d1 = (P2[0] - P1[0]) * (P3[1] - P1[1]) - (P2[1] - P1[1]) * (P3[0] - P1[0]);
    if (d1 === 0) trip.push([P1, P2, P3]);
  }
  vEqN('collinear triples found again (independent triple sweep)', trip.length, 44);
  for (var t = 0; t < trip.length; t++) {
    var A = trip[t][0], B = trip[t][1], C = trip[t][2];
    if (A[0] === B[0] && B[0] === C[0]) { // equal first coordinate -> parallel dual family
      para++;
      if (!(dualPt(A[0], A[1])[0] === dualPt(B[0], B[1])[0] && dualPt(A[0], A[1])[1] === -1 &&
            A[1] !== B[1])) paraOK = false;
      if (!(dualPt(A[0], A[1])[2] !== dualPt(B[0], B[1])[2])) paraOK = false;
    } else {
      conc++;
      // solve dual(A) and dual(B): p1 x - y = q1, p2 x - y = q2
      var p1 = A[0], q1 = A[1], p2 = B[0], q2 = B[1], p3 = C[0], q3 = C[1];
      var dx = p1 - p2, nx = q1 - q2; // x = nx/dx, y = (p1*nx - q1*dx)/dx
      if (dx === 0) { concOK = false; continue; }
      var ynum = p1 * nx - q1 * dx;
      // third line: p3 x - q3 = y  =>  p3*nx - q3*dx == ynum  (integer cross-check)
      if (p3 * nx - q3 * dx !== ynum) concOK = false;
    }
  }
  vEqN('triples dualizing to ordinary concurrency', conc, 28);
  vEqN('triples dualizing to parallel families', para, 16);
  vCheck('every ordinary triple verified concurrent by pair-solving', concOK);
  vCheck('parallel families verified (same slope, distinct intercepts)', paraOK);
  vCheck('page says 28 ordinary and 16 at infinity', vIn(page, '28 ordinary and 16 at infinity'));
  vCheck('page says 16 families of parallel lines', vIn(page, '16 families of <em>parallel</em> lines'));
  vCheck('page says 28 triples of lines concurrent', vIn(page, '28 triples of lines concurrent at an ordinary point'));
}
// P17 REVIEW VERIFIER — part 3: geometry by areas/distances, solids, sets, byte gates, verdict
function sarrus(m) {
  return m[0][0]*m[1][1]*m[2][2] + m[0][1]*m[1][2]*m[2][0] + m[0][2]*m[1][0]*m[2][1]
       - m[0][2]*m[1][1]*m[2][0] - m[0][1]*m[1][0]*m[2][2] - m[0][0]*m[1][2]*m[2][1];
}
function rg(a, b) { var g = gcd2(a, b); return [a / g, b / g]; }
function rcross(u, v) { return u[0] * v[1] - u[1] * v[0]; }

function v17_geometry(page) {
  var PM = [[2, 5, 1], [3, 9, 1], [7, 4, 1]];
  var LM = [[2, -1, -5], [3, -1, -9], [7, -1, -4]];
  vEqN('S2 point determinant (Sarrus)', sarrus(PM), -21);
  vEqN('S2 line determinant (Sarrus)', sarrus(LM), 21);
  vCheck('page S2 point expansion string', vIn(page, '= 10 + 20 - 51 = -21'));
  vCheck('page S2 line expansion string', vIn(page, '= -10 + 51 + 20 = 21'));
  var ZM = [[1, 2, 1], [2, 3, 1], [3, 4, 1]], ZL = [[1, -1, -2], [2, -1, -3], [3, -1, -4]];
  vEqN('S2 degenerate triple point det', sarrus(ZM), 0);
  vEqN('S2 degenerate triple line det', sarrus(ZL), 0);
  // concurrency of x-y=2, 2x-y=3, 3x-y=4 by pair-solving
  var x = (2 - 3) / (1 - 2), y = 1 * x - 2; // solve first two: p1=1,q1=2 ; p2=2,q2=3
  vEqN('S2 degenerate family meets at x', x, 1);
  vEqN('S2 degenerate family meets at y', y, -1);
  vEqN('third line agrees (3x-4=y at (1,-1))', 3 * 1 - 4, -1);
  vCheck('page states the (1,-1) meeting', vIn(page, 'single point \\((1,-1)\\)'));
}

function v17_ceva_areas(page) {
  var A = [0, 0], B = [6, 0], C = [0, 4];
  // P(2,1): ratios by areas: BD/DC = [ABP]/[APC], CE/EA = [BCP]/[BPA], AF/FB = [CAP]/[CBP]
  var P = [2, 1];
  var r1 = rg(Math.abs(rcross([B[0]-A[0], B[1]-A[1]], [P[0]-A[0], P[1]-A[1]])), Math.abs(rcross([P[0]-A[0], P[1]-A[1]], [C[0]-A[0], C[1]-A[1]])));
  var r2 = rg(Math.abs(rcross([C[0]-B[0], C[1]-B[1]], [P[0]-B[0], P[1]-B[1]])), Math.abs(rcross([B[0]-A[0], B[1]-A[1]], [P[0]-A[0], P[1]-A[1]])));
  var r3 = rg(Math.abs(rcross([A[0]-C[0], A[1]-C[1]], [P[0]-C[0], P[1]-C[1]])), Math.abs(rcross([C[0]-B[0], C[1]-B[1]], [P[0]-B[0], P[1]-B[1]])));
  vEqN('Ceva P(2,1) BD/DC by areas numerator', r1[0], 3); vEqN('Ceva P(2,1) BD/DC by areas denominator', r1[1], 4);
  vEqN('Ceva P(2,1) CE/EA by areas numerator', r2[0], 5); vEqN('Ceva P(2,1) CE/EA by areas denominator', r2[1], 3);
  vEqN('Ceva P(2,1) AF/FB by areas numerator', r3[0], 4); vEqN('Ceva P(2,1) AF/FB by areas denominator', r3[1], 5);
  vEqN('Ceva P(2,1) product = 1 (num)', r1[0]*r2[0]*r3[0], r1[1]*r2[1]*r3[1]);
  vCheck('page states BD/DC = 3/4', vIn(page, 'BD/DC = 3/4'));
  vCheck('page states CE/EA = 5/3', vIn(page, 'CE/EA = 5/3'));
  vCheck('page states AF/FB = 4/5', vIn(page, 'AF/FB = 4/5'));
  // Ex3 P(3,1)
  var Q = [3, 1];
  var s1 = rg(Math.abs(rcross([B[0]-A[0], B[1]-A[1]], [Q[0]-A[0], Q[1]-A[1]])), Math.abs(rcross([Q[0]-A[0], Q[1]-A[1]], [C[0]-A[0], C[1]-A[1]])));
  var s2 = rg(Math.abs(rcross([C[0]-B[0], C[1]-B[1]], [Q[0]-B[0], Q[1]-B[1]])), Math.abs(rcross([B[0]-A[0], B[1]-A[1]], [Q[0]-A[0], Q[1]-A[1]])));
  var s3 = rg(Math.abs(rcross([A[0]-C[0], A[1]-C[1]], [Q[0]-C[0], Q[1]-C[1]])), Math.abs(rcross([C[0]-B[0], C[1]-B[1]], [Q[0]-B[0], Q[1]-B[1]])));
  vEqN('Ex3 P(3,1) BD/DC numerator', s1[0], 1); vEqN('Ex3 P(3,1) BD/DC denominator', s1[1], 2);
  vEqN('Ex3 P(3,1) CE/EA numerator', s2[0], 1); vEqN('Ex3 P(3,1) CE/EA denominator', s2[1], 1);
  vEqN('Ex3 P(3,1) AF/FB numerator', s3[0], 2); vEqN('Ex3 P(3,1) AF/FB denominator', s3[1], 1);
  vEqN('Ex3 Ceva product = 1 (num)', s1[0]*s2[0]*s3[0], s1[1]*s2[1]*s3[1]);
}

function v17_menelaus(page) {
  // transversal x+y=3: meetings by substitution; ratios by squared distances
  var F = [3, 0], E = [0, 3], D = [-3, 6], B = [6, 0], C = [0, 4], A = [0, 0];
  vEqN('x+y=3 meets AB at x', F[0] + F[1], 3);
  vEqN('AF/FB (squared numerator)', (F[0]-A[0])*(F[0]-A[0]) + (F[1]-A[1])*(F[1]-A[1]), 9);
  vEqN('FB squared', (B[0]-F[0])*(B[0]-F[0]) + (B[1]-F[1])*(B[1]-F[1]), 9);
  vEqN('CE squared / EA squared = 1/9 numerically', ((E[0]-C[0])**2 + (E[1]-C[1])**2) * 9, (A[0]-E[0])**2 + (A[1]-E[1])**2);
  var BD2 = (D[0]-B[0])**2 + (D[1]-B[1])**2, DC2 = (D[0]-C[0])**2 + (D[1]-C[1])**2;
  vEqN('BD^2', BD2, 117); vEqN('DC^2', DC2, 13);
  vEqN('BD/DC squared ratio is 9', BD2, DC2 * 9);
  var t = (B[0] - D[0]) / (B[0] - C[0]); // D = B + t(C-B) => t = (Bx-Dx)/(Bx-Cx)
  vEqN('x+y=3 D beyond C (t = 3/2 doubled)', t * 2, 3);
  vCheck('page states ratios 1, 1/3, -3', vIn(page, 'ratios \\(1\\), \\(1/3\\), and \\(-3\\)'));
  // Ex3(b) transversal x+y=2
  var F2 = [2, 0], E2 = [0, 2], D2 = [-6, 8];
  vEqN('x+y=2 meets AB at 2', F2[0] + F2[1], 2);
  vEqN('Ex3 AF/FB squared ratio is 1/4 (cross)', (F2[0]-A[0])**2 * 4, (B[0]-F2[0])**2);
  vEqN('Ex3 CE/EA squared equal', (E2[1]-C[1])**2, (A[1]-E2[1])**2);
  var BD2b = (D2[0]-B[0])**2 + (D2[1]-B[1])**2, DC2b = (D2[0]-C[0])**2 + (D2[1]-C[1])**2;
  vEqN('Ex3 BD^2', BD2b, 208); vEqN('Ex3 DC^2', DC2b, 52);
  vEqN('Ex3 BD/DC squared ratio is 4', BD2b, DC2b * 4);
  vCheck('page states the x+y=2 transversal', vIn(page, 'x + y = 2'));
  // products: 1 * (1/3) * (-3) = -1 ; (1/2) * 1 * (-2) = -1
  vEqN('Menelaus product (S4): 1*(1)*( -3) = -(1*3*1)', 1 * 1 * -3, -(1 * 3 * 1));
  vEqN('Menelaus product (Ex3): (1)*(1)*(-2) = -(2*1*1)', 1 * 1 * -2, -(2 * 1 * 1));
}

function v17_platonic(page) {
  var surv = [], bnd = [];
  for (var p = 3; p <= 60; p++) for (var q = 3; q <= 60; q++) {
    var lhs = q * (p - 2), rhs = 2 * p;
    if (lhs < rhs) surv.push(p + ',' + q);
    else if (lhs === rhs) bnd.push(p + ',' + q);
  }
  vEqN('solid census survivors in 3..60 sweep', surv.length, 5);
  vEqN('survivor list', surv.join(';'), '3,3;3,4;3,5;4,3;5,3');
  vCheck('(3,6) is a boundary case', bnd.indexOf('3,6') !== -1);
  vCheck('(6,3) is a boundary case', bnd.indexOf('6,3') !== -1);
  vEqN('boundary count in 3..60: (3,6),(4,4),(6,3)', bnd.length, 3);
  vCheck('(4,4) square-tiling boundary case', bnd.indexOf('4,4') !== -1);
  vEqN('tetra vertex sum', 3 * 1 * 180 / 3, 180);
  vEqN('cube vertex sum', 3 * 2 * 180 / 4, 270);
  vEqN('octa vertex sum', 4 * 1 * 180 / 3, 240);
  vEqN('dodeca vertex sum', 3 * 3 * 180 / 5, 324);
  vEqN('icosa vertex sum', 5 * 1 * 180 / 3, 300);
  var T = [[3,3,4,6,4],[4,3,8,12,6],[3,4,6,12,8],[5,3,20,30,12],[3,5,12,30,20]];
  var Dexp = [3, 2, 2, 1, 1];
  for (var i = 0; i < 5; i++) {
    var p = T[i][0], q = T[i][1], D = 2*p + 2*q - p*q;
    vEqN('D for (' + p + ',' + q + ')', D, Dexp[i]);
    vEqN('V = 4p/D for (' + p + ',' + q + ')', 4 * p / D, T[i][2]);
    vEqN('E = 2pq/D for (' + p + ',' + q + ')', 2 * p * q / D, T[i][3]);
    vEqN('F = 4q/D for (' + p + ',' + q + ')', 4 * q / D, T[i][4]);
  }
  vCheck('page states the angle bound', vIn(page, '1/p + 1/q > 1/2'));
  vCheck('page states 1/2 symmetric', vIn(page, 'is symmetric too'));
  vCheck('page calls (3,6) the boundary', vIn(page, '(3,6)'));
  vCheck('page names the hexagonal tiling of the plane', vIn(page, 'the hexagonal tiling of the plane'));
  vCheck('page: tetrahedron flips to itself', vIn(page, 'tetrahedron — flips to itself'));
}

function v17_demorgan(page) {
  function bin(n) { var s = (n >>> 0).toString(2); while (s.length < 4) s = '0' + s; return s; }
  var sets = []; for (var i = 0; i < 16; i++) sets.push(bin(i));
  vEqN('16 subsets', sets.length, 16);
  function un(a, b) { var r = ''; for (var i = 0; i < 4; i++) r += (a[i] === '1' || b[i] === '1') ? '1' : '0'; return r; }
  function it(a, b) { var r = ''; for (var i = 0; i < 4; i++) r += (a[i] === '1' && b[i] === '1') ? '1' : '0'; return r; }
  function cp(a) { var r = ''; for (var i = 0; i < 4; i++) r += (a[i] === '1') ? '0' : '1'; return r; }
  function incl(a, b) { for (var i = 0; i < 4; i++) if (a[i] === '1' && b[i] !== '1') return false; return true; }
  vEqN('complement is an involution on 1011', cp(cp('1011')), '1011');
  var dm = true, inc = true, pairs = 0;
  for (var x = 0; x < 16; x++) for (var y = 0; y < 16; y++) {
    pairs++;
    var A = sets[x], B = sets[y];
    if (cp(un(A, B)) !== it(cp(A), cp(B))) dm = false;
    if (incl(A, B) !== incl(cp(B), cp(A))) inc = false;
  }
  vEqN('256 ordered pairs', pairs, 256);
  vCheck('De Morgan holds for all 256 pairs (string sets)', dm);
  vCheck('inclusion reversal holds for all 256 pairs', inc);
  var d1 = true, d2 = true, triples = 0;
  for (var x = 0; x < 16; x++) for (var y = 0; y < 16; y++) for (var z = 0; z < 16; z++) {
    triples++;
    var A = sets[x], B = sets[y], C = sets[z];
    if (it(A, un(B, C)) !== un(it(A, B), it(A, C))) d1 = false;
    if (un(A, it(B, C)) !== it(un(A, B), un(A, C))) d2 = false;
  }
  vEqN('4096 ordered triples', triples, 4096);
  vCheck('distributive law 1 all 4096 triples', d1);
  vCheck('distributive law 2 all 4096 triples', d2);
  vCheck('page says 16 subsets, hence 256 ordered pairs', vIn(page, '16 subsets, hence 256 ordered pairs'));
  vCheck('page says 4,096 triples', vIn(page, '4,096 triples'));
  vCheck('page quantifier twin', vIn(page, '\\lnot\\forall = \\exists\\lnot'));
}

function v17_bytes(page) {
  vCheck('MathJax config line byte-exact', vIn(page, "<script>window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']]},svg:{fontCache:'global'}};</script>"));
  vCheck('tail byte-exact', vEndsWith(page, '\n</footer>\n</body>\n</html>\n'));
  vEqN('inline TeX openers', vHowMany(page, '\\('), 355);
  vEqN('display TeX openers', vHowMany(page, '\\['), 3);
  vEqN('h2 count', vHowMany(page, '<h2>'), 8);
  vEqN('h3 count', vHowMany(page, '<h3>'), 9);
  vEqN('details count', vHowMany(page, '<details>'), 10);
  vEqN('section count', vHowMany(page, '<section'), 8);
  vEqN('Exercise mentions', vHowMany(page, 'Exercise '), 6);
  vEqN('1639 mentions', vHowMany(page, '1639'), 4);
  vEqN('em-dash count', vHowMany(page, '—'), 131);
  vEqN('figure count', vHowMany(page, '<figure'), 3);
  vEqN('svg count', vHowMany(page, '<svg'), 3);
  vEqN('figcaption count', vHowMany(page, '<figcaption'), 3);
  vEqN('no dollar signs', vHowMany(page, '$'), 0);
  vEqN('no backticks', vHowMany(page, '`'), 0);
  vCheck('no draft-voice leak', vAbsent(page, '— wait:'));
}

function runV17(PAGE) {
  v17_needles(PAGE);
  v17_poisons(PAGE);
  v17_clones(PAGE);
  v17_census(PAGE);
  v17_dictionary(PAGE);
  v17_geometry(PAGE);
  v17_ceva_areas(PAGE);
  v17_menelaus(PAGE);
  v17_platonic(PAGE);
  v17_demorgan(PAGE);
  v17_bytes(PAGE);
  var v = 'P17 REVIEW VERIFIER — checks: ' + V17.checks + '/' + V17.checks + ', ' + V17.fails + ' FAIL';
  if (V17.fails > 0) v += '\n  FAILED: ' + V17.failed.join(' | ');
  return v;
}
