// p29-lab.js — P29 "Energy methods" — fresh battery, deterministic.
// No recursion, no BigInt, exact integer arithmetic where possible.
// Pieces A-X each define pieceRun() and return their transcript; the census
// piece S additionally receives the frozen page injected by the run harness
// as PAGE (string), which also routes console.log to __out. Seeds fixed;
// every piece ran twice in the authoring sandbox, byte-identical both runs.
var __all = [];
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P29-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var k = Math.log(7/6)/10;
  var ts = 10*Math.log(7/4)/Math.log(7/6);
  var rExact = Math.exp(-2*k*ts), rFac = Math.pow(6/7, 2*ts/10);
  lg('A01', Math.abs(rExact-rFac) < 1e-12, 'mug ledger dE/dt=-2kE: E(t*)/E(0)=' + rExact.toPrecision(12) + ' = (6/7)^' + (2*ts/10).toFixed(6) + '; t*=' + ts.toFixed(4) + ' min, E(0)=' + (70*70));
  var hE = Math.log(2)/(2*k), hA = Math.log(2)/k;
  lg('A02', Math.abs(hE - hA/2) < 1e-9, 'energy half-life ' + hE.toFixed(4) + ' min = amplitude half-life ' + hA.toFixed(4) + ' / 2');
  var w0 = 3, wt = w0*Math.exp(-k*ts);
  lg('A03', wt < w0, 'difference mug w(0)=3 deg: w(t*)=' + wt.toFixed(6) + ' deg = sqrt(E_w(t*)); the gap never grows');
  var dts = [30, 1/k, 100], expect = ['mono', 'alt', 'grow'];
  var ok4 = true, msg4 = [];
  for (var i = 0; i < 3; i++) {
    var fac = 1 - 2*k*dts[i], e = 1, grows = false;
    for (var n = 1; n <= 20; n++) { e = e*fac; if (Math.abs(e) > 1.0000001) grows = true; }
    var kind = (fac >= 0 && fac <= 1) ? 'mono' : (fac > -1 && fac < 0 ? 'alt' : (Math.abs(fac) > 1 ? 'grow' : 'alt'));
    msg4.push('dt=' + dts[i].toPrecision(5) + ' fac=' + fac.toPrecision(6) + ': ' + kind);
    if (kind !== expect[i]) ok4 = false;
  }
  lg('A04', ok4, 'Euler mug (1-2k dt)^n: ' + msg4.join('; ') + ' (one-sidedness survives the scheme only while 2k dt <= 1)');
  var dt = 0.01, nS = 10000, eul = 4900;
  for (var s = 0; s < nS; s++) eul = eul*(1 - 2*k*dt);
  var disc = 4900*Math.pow(1-2*k*dt, nS), phys = 4900*Math.exp(-2*k*100);
  var g1 = Math.abs(eul-disc)/disc, g2 = Math.abs(eul-phys)/phys;
  lg('A05', g1 < 1e-12, 'E(100min): Euler=' + eul.toPrecision(10) + ' vs its own closed form=' + disc.toPrecision(10) + ' rel=' + g1.toExponential(2) + '; scheme-vs-physics error=' + g2.toExponential(2) + ' (disclosed price of dt=0.01)');
  return L.join('\n');
}

__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P29-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var N = 12, TH = Math.PI/13, C = Math.cos(TH);
  function energy(u) { var s = 0; for (var j = 0; j < u.length; j++) s += u[j]*u[j]; return s; }
  function step(u) { var w = []; for (var i = 1; i <= N; i++) { var a = (i === 1 ? 0 : u[i-2]), b = (i === N ? 0 : u[i]); w.push((a+b)/2); } return w; }
  function lcg(seed) { var s = seed; return function() { s = (s*16807) % 2147483647; return (s - 1)/2147483646; }; }
  var v = [], i;
  for (i = 1; i <= N; i++) v.push(100*Math.sin(TH*i));
  var E0 = energy(v);
  lg('B01', Math.abs(E0 - 65000) < 1e-5, 'grid arch E0=' + E0.toPrecision(12) + ' (10000*6.5: the half-sum identity sum sin^2 = n/2, walls at 0 and 13)');
  var u = v.slice();
  for (var s2 = 0; s2 < 50; s2++) u = step(u);
  var pred50 = v.map(function(x) { return x*Math.pow(C, 50); });
  var maxdiff = 0;
  for (i = 0; i < N; i++) maxdiff = Math.max(maxdiff, Math.abs(u[i]-pred50[i]));
  var u2 = v.slice();
  for (var s3 = 0; s3 < 200; s3++) u2 = step(u2);
  var dE = Math.abs(energy(u2) - E0*Math.pow(C*C, 200))/(E0*Math.pow(C*C, 200));
  lg('B02', maxdiff < 1e-9 && dE < 1e-9, 'mode-1 exactness: profile(50) vs C^50 v maxdiff=' + maxdiff.toExponential(2) + '; E(200)=' + energy(u2).toPrecision(8) + ' = 65000 cos^400(pi/13) rel=' + dE.toExponential(2));
  var rnd = lcg(2903), mix = [];
  for (i = 0; i < N; i++) mix.push(v[i] + 30*Math.sin(3*TH*(i+1)) + 20*rnd());
  var E0m = energy(mix), uu = mix.slice(), viol = 0, minratio = 1;
  for (var s4 = 1; s4 <= 500; s4++) { uu = step(uu); var env = E0m*Math.pow(C*C, s4); if (energy(uu) > env*(1+1e-9)) viol++; if (s4 === 100) minratio = energy(uu)/env; }
  lg('B03', viol === 0 && minratio < 0.999, 'mixed start: E(n) <= E0 cos^{2n}(pi/13) for 500 steps, violations=' + viol + '; E(100)/envelope(100)=' + minratio.toPrecision(6) + ' (strict: faster than the worst case)');
  var ok4 = true, worst = 0;
  for (var trial = 0; trial < 50; trial++) {
    var p = [], r2 = lcg(9100 + trial);
    for (i = 0; i < N; i++) p.push(200*(r2()-0.5));
    var q = step(p);
    var lhs = energy(q) - energy(p);
    var dprev = [], dnext = [];
    for (i = 0; i <= N; i++) { dprev.push((i === N ? 0 : p[i]) - (i === 0 ? 0 : p[i-1])); }
    for (i = 0; i <= N; i++) { dnext.push((i === N ? 0 : q[i]) - (i === 0 ? 0 : q[i-1])); }
    var s1 = 0, s2 = 0;
    for (i = 0; i <= N; i++) { s1 += dprev[i]*dprev[i]; s2 += dprev[i]*dnext[i]; }
    var rhs = -0.5*(s1 + s2);
    var rel = Math.abs(lhs - rhs)/(Math.abs(lhs) + Math.abs(rhs) + 1e-300);
    if (rel > 1e-12) ok4 = false;
    worst = Math.max(worst, rel);
  }
  lg('B04', ok4, 'exact identity E1-E0 = -1/2[sum (du)^2 + sum du du_next] on 50 random profiles, worst rel dev=' + worst.toExponential(2));
  var z = []; for (i = 0; i < N; i++) z.push(0);
  var zz = z.slice(), mx = 0;
  for (var s5 = 0; s5 < 100; s5++) { zz = step(zz); mx = Math.max(mx, Math.abs(energy(zz))); }
  var A100 = v.slice();
  for (var s6 = 0; s6 < 100; s6++) A100 = step(A100);
  lg('B05', mx === 0, 'audit: difference solution from zero start stays machine-zero 100 steps (E=' + mx + '); truth slab-6 at step 100 = ' + A100[5].toPrecision(8) + ' deg; rival bump 0.5 deg there forces E_w=0.25>0, contradiction');
  var pert = v.slice(); pert[5] = pert[5] + 1;
  var w6 = pert.slice();
  for (var s7 = 0; s7 < 100; s7++) w6 = step(w6);
  var diff = []; for (i = 0; i < N; i++) diff.push(w6[i] - A100[i]);
  var Ew = energy(diff), budget = Math.sqrt(Ew), envb = Math.pow(C*C, 100);
  lg('B06', Ew <= envb*(1+1e-9), '1-deg start error: E_w(100)=' + Ew.toExponential(4) + ' <= cos^200(pi/13)=' + envb.toExponential(4) + '; pointwise budget sqrt(E_w(100))=' + budget.toPrecision(6) + ' deg');
  var claim = A100.slice(); claim[5] = claim[5] + 0.5;
  var bars1 = [], bars2 = [];
  for (i = 0; i < N; i++) { bars1.push(A100[i].toFixed(4)); bars2.push(claim[i].toFixed(4)); }
  var curve = [], cu = v.slice();
  for (var s8 = 0; s8 <= 300; s8 += 25) { curve.push(s8 + ':' + energy(cu).toFixed(4)); for (var q9 = 0; q9 < 25 && s8 < 300; q9++) cu = step(cu); }
  lg('B07', true, 'fig receipts: truth bars [' + bars1.join(' ') + '] claim bars [' + bars2.join(' ') + ']; ledger E(n) ' + curve.join(' '));
  return L.join('\n');
}

__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P29-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var TH = Math.PI/13, C = Math.cos(TH), N = 12;
  function lcg(seed) { var s = seed; return function() { s = (s*16807) % 2147483647; return (s - 1)/2147483646; }; }
  function energy(x) { var s = 0; for (var j = 0; j < x.length; j++) s += x[j]*x[j]; return s; }
  function stepN(x) { var w = []; for (var i2 = 1; i2 <= N; i2++) { var a = (i2 === 1 ? 0 : x[i2-2]), b = (i2 === N ? 0 : x[i2]); w.push((a+b)/2); } return w; }
  var q1 = 2*(1 - C), q2 = 4*Math.pow(Math.sin(TH/2), 2);
  var r = lcg(4177), u = [];
  for (var i = 0; i < N; i++) u.push(100*(r()-0.5));
  for (var s = 0; s < 3000; s++) u = stepN(u);
  var e1 = energy(u); u = stepN(u);
  var emp = energy(u)/e1;
  lg('C01', Math.abs(q1-q2) < 1e-15 && Math.abs(emp - C*C) < 1e-9, 'discrete Poincare: 2(1-cos(pi/13))=' + q1.toPrecision(10) + ' = 4 sin^2(pi/26)=' + q2.toPrecision(10) + '; empirical asymptotic E(n+1)/E(n) after 3000 steps=' + emp.toPrecision(10) + ' = cos^2(pi/13)');
  var q12 = 2*(1 - Math.abs(Math.cos(12*TH)));
  lg('C02', Math.abs(q12 - q1) < 1e-15, 'mode 12 quotient=' + q12.toPrecision(10) + ' = mode 1 quotient: the ledger cannot tell sin(pi x/13) from its sign-alternating twin (sizes, not shapes)');
  var al = 1.11e-4, Lh = 0.5;
  var hA = (Lh/Math.PI)*(Lh/Math.PI)*Math.log(2)/al, hE = hA/2;
  lg('C03', Math.abs(hA - 158.2) < 0.1 && Math.abs(hE - hA/2) < 1e-9, 'copper 0.5 m: amplitude half-time ' + hA.toFixed(1) + ' s (P26 receipt 158.2); energy half-time ' + hE.toFixed(1) + ' s = half');
  var M = 100, dx = Lh/(M+1), dtC = 0.25*dx*dx/al, rr = al*dtC/(dx*dx);
  var t1 = Math.log(100)*Lh*Lh/(2*al*Math.PI*Math.PI);
  var rod = [], j;
  for (j = 1; j <= M; j++) rod.push(100*Math.sin(Math.PI*j/(M+1)));
  var E0 = energy(rod), steps = Math.round(t1/dtC), rod2 = rod.slice();
  for (var s4 = 0; s4 < steps; s4++) {
    var nw = [];
    for (j = 1; j <= M; j++) { var a2 = (j === 1 ? 0 : rod2[j-2]), b2 = (j === M ? 0 : rod2[j]); var c2 = rod2[j-1]; nw.push(c2 + rr*(a2 - 2*c2 + b2)); }
    rod2 = nw;
  }
  var frac = energy(rod2)/E0;
  lg('C04', frac <= 0.0106, 'settling time t = ln(100) L^2/(2 alpha pi^2) = ' + t1.toFixed(1) + ' s; simulated 100-cell copper rod at t: E/E0=' + frac.toPrecision(4) + ' <= 0.01 plus half-percent grid/scheme slack');
  var worstGrid = 0, worstExact = 0, wgrid = 0;
  var nx = 2000, hh = 1/nx;
  for (var t5 = 0; t5 < 20; t5++) {
    var rr2 = lcg(7000 + t5), a = [0,0,0,0,0];
    var sa2 = 0, sk2 = 0;
    for (var k = 1; k <= 4; k++) { a[k] = 2*(rr2() - 0.5); sa2 += a[k]*a[k]; sk2 += k*k*a[k]*a[k]; }
    var ex = sa2/sk2;
    var num = 0, den = 0, jj;
    for (jj = 1; jj < nx; jj++) {
      var x9 = jj*hh, uv = 0;
      for (var k2 = 1; k2 <= 4; k2++) uv += a[k2]*Math.sin(k2*Math.PI*x9);
      num += uv*uv;
      var xm = (jj-1)*hh, xp = (jj+1)*hh, uvm = 0, uvp = 0;
      for (var k3 = 1; k3 <= 4; k3++) { uvm += a[k3]*Math.sin(k3*Math.PI*xm); uvp += a[k3]*Math.sin(k3*Math.PI*xp); }
      var dxd = (uvp - uvm)/(2*hh);
      den += dxd*dxd;
    }
    var grid = (num*hh)*Math.PI*Math.PI/(den*hh);
    if (grid > worstGrid) { worstGrid = grid; wgrid = t5; }
    if (ex > worstExact) worstExact = ex;
  }
  var archN = 0, archD = 0;
  for (jj = 1; jj < nx; jj++) { var x8 = jj*hh; archN += Math.sin(Math.PI*x8)*Math.sin(Math.PI*x8); var d8 = (Math.sin(Math.PI*(jj+1)*hh) - Math.sin(Math.PI*(jj-1)*hh))/(2*hh); archD += d8*d8; }
  var arch = (archN*hh)*Math.PI*Math.PI/(archD*hh);
  lg('C05', worstGrid <= 1.005 && worstExact <= 1 && Math.abs(arch - 1) < 0.005, 'continuum Poincare int u^2 <= (1/pi^2) int u_x^2: 20 random sine-mixture profiles, worst grid ratio=' + worstGrid.toPrecision(4) + ' (profile ' + wgrid + '), worst exact ratio=' + worstExact.toPrecision(4) + '; the arch saturates it: ratio=' + arch.toPrecision(6));
  return L.join('\n');
}

__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P29-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  function binom(n, k) { var v = 1; for (var i = 0; i < k; i++) v = v*(n-i)/(i+1); return v; }
  function lnfact(n) { var s = 0; for (var i = 2; i <= n; i++) s += Math.log(i); return s; }
  function Mbig(n) { return Math.exp(lnfact(2*n) - 2*lnfact(n) - n*Math.log(4)); }
  // D01 exact small-n ledger
  function meetExact(n) {
    var q = {}; q[0] = 1;
    for (var s = 0; s < n; s++) {
      var nq = {}, x;
      for (x in q) { var xi = parseInt(x, 10); nq[xi+1] = (nq[xi+1] || 0) + q[x]; nq[xi-1] = (nq[xi-1] || 0) + q[x]; }
      q = nq;
    }
    var sum = 0, tot = 0;
    for (var x2 in q) { sum += q[x2]*q[x2]; tot += q[x2]; }
    if (tot !== Math.pow(2, n)) return null;
    return sum/Math.pow(4, n);
  }
  var ok1 = true, m1 = [];
  for (var n = 1; n <= 12; n++) {
    var me = meetExact(n), mc = binom(2*n, n)/Math.pow(4, n);
    m1.push(n + ':' + me.toPrecision(10) + '/' + mc.toPrecision(10));
    if (Math.abs(me - mc) > 1e-12*mc) ok1 = false;
  }
  lg('D01', ok1, 'meeting ledger identity sum p^2 = C(2n,n)/4^n exact n=1..12: ' + m1.join(' '));
  // D02 cross-page echo
  var M50 = Mbig(50), M100 = Mbig(100), M200 = Mbig(200);
  lg('D02', Math.abs(M50 - 0.0795892) < 1e-6, 'M(50)=' + M50.toPrecision(8) + ' (P26: the walker returns at step 100 with 0.0796 - same number, one identity); M(100)=' + M100.toPrecision(8) + '; M(200)=' + M200.toPrecision(8));
  // D03 Stirling, error halves as n doubles
  var ms = [M50, M100, M200], ns = [50, 100, 200], st = [0,0,0];
  for (var i3 = 0; i3 < 3; i3++) st[i3] = (1/Math.sqrt(Math.PI*ns[i3]) - ms[i3])/ms[i3];
  lg('D03', st[0] > st[1] && st[1] > st[2] && st[0] < 0.01, 'Stirling 1/sqrt(pi n) overshoots by ' + (100*st[0]).toFixed(3) + '%, ' + (100*st[1]).toFixed(3) + '%, ' + (100*st[2]).toFixed(3) + '% at n=50/100/200 (the error halves, then halves again)');
  // D04 expected meetings: leading term overshoots by a bounded amount (zeta(1/2) correction ~ -0.824)
  var S = 0;
  for (var n4 = 1; n4 <= 200; n4++) S += Mbig(n4);
  var pred = 2*Math.sqrt(200/Math.PI), corr = pred - 0.824;
  lg('D04', S < pred && (pred - S) < 1 && Math.abs(S - corr) < 0.2, 'expected meetings by N=200: exact sum=' + S.toPrecision(8) + ' vs leading 2 sqrt(N/pi)=' + pred.toPrecision(8) + ' and corrected 2 sqrt(N/pi) - 0.824=' + corr.toPrecision(8) + ' (ratio to corrected ' + (S/corr).toPrecision(4) + ')');
  // D05 divergence like sqrt
  var S50 = 0, S100 = 0, S200 = 0, S400 = 0;
  for (var n5 = 1; n5 <= 400; n5++) { var mm = Mbig(n5); if (n5 <= 50) S50 += mm; if (n5 <= 100) S100 += mm; if (n5 <= 200) S200 += mm; S400 += mm; }
  var r200 = S200/S100, r400 = S400/S200;
  lg('D05', r200 > 1.38 && r400 > 1.38 && Math.abs(S400/(2*Math.sqrt(400/Math.PI)) - 1) < 0.05, 'the meeting count grows without bound: S(50)=' + S50.toPrecision(6) + ', S(100)=' + S100.toPrecision(6) + ', S(200)=' + S200.toPrecision(6) + ', S(400)=' + S400.toPrecision(6) + '; doubling N multiplies meetings by ' + r200.toPrecision(4) + ' and ' + r400.toPrecision(4) + ' (sqrt 2 = 1.414)');
  // D06 dictionary receipt: difference walk of two meetings = one lazy walker
  var pd = {0: 1};
  for (var s6 = 0; s6 < 50; s6++) {
    var nd = {}, xx;
    for (xx in pd) { var x3 = parseInt(xx, 10); nd[x3] = (nd[x3] || 0) + 0.5*pd[xx]; nd[x3+2] = (nd[x3+2] || 0) + 0.25*pd[xx]; nd[x3-2] = (nd[x3-2] || 0) + 0.25*pd[xx]; }
    pd = nd;
  }
  var laz = pd['0'] !== undefined ? pd['0'] : 0;
  lg('D06', Math.abs(laz - M50) < 1e-14, 'dictionary receipt: two walkers meeting at step 50 = one difference walker at 0 after 50 lazy steps: ' + laz.toPrecision(8) + ' = M(50), the same number as a single walker returning at step 100 (the P26 echo)');
  return L.join('\n');
}

__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P29-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  function lcg(seed) { var s = seed; return function() { s = (s*16807) % 2147483647; return (s - 1)/2147483646; }; }
  // E01 the world-eater u_t = u^2 is exact per point: u(t) = u0/(1 - u0 t); T* = 1/max
  var A = 100, Tstar = 1/A;
  var u99 = A/(1 - A*0.99*Tstar);
  var h1 = 1e-6, t5b = 0.5*Tstar;
  var u5 = A/(1 - A*t5b);
  var du = (A/(1-A*(t5b+h1)) - A/(1-A*(t5b-h1)))/(2*h1);
  lg('E01', Math.abs(u99 - 10000) < 1e-6 && Math.abs(du/(u5*u5) - 1) < 1e-6, 'world-eater u_t = u^2 solved exactly per point: u(t) = u0/(1 - u0 t); the 100-degree arch blows up at T* = 1/max u0 = 0.01 s; at t = 0.0099 the top reads ' + u99.toFixed(1) + ' degrees, and at t = 0.005 the differential law u_t = u^2 holds to ' + Math.abs(du/(u5*u5) - 1).toExponential(1) + ' relative');
  // E02 Jensen lower bound E(t) >= E0/(1 - sqrt(E0) t)^2, checked below the true blow-up
  var dx = 0.001, arch = [];
  for (var i = 0; i <= 1000; i++) arch.push(A*Math.sin(Math.PI*i/1000));
  function Eat(t) { var s = 0; for (var i = 1; i < 1000; i++) { var u0 = arch[i]; var d = 1 - u0*t; s += u0*u0/(d*d); } return s*dx; }
  var E0g = Eat(0), TE = 1/Math.sqrt(E0g), ok2 = true, m2 = [];
  var fr = [0.3, 0.6, 0.9];
  for (var f = 0; f < 3; f++) {
    var t = fr[f]*Tstar;
    if (t >= Tstar) ok2 = false;
    var lo = E0g/Math.pow(1 - Math.sqrt(E0g)*t, 2), hi = Eat(t);
    m2.push((hi/lo).toPrecision(6));
    if (!(hi >= lo*(1 - 1e-12))) ok2 = false;
  }
  lg('E02', ok2, 'Jensen guarantee dE/dt = 2 int u^3 >= 2 E^(3/2) integrates to E(t) >= E0/(1 - sqrt(E0) t)^2: grid arch at t = 0.3, 0.6, 0.9 x T* (all below both T* and T_E) sits at ' + m2.join(', ') + ' times the floor (never below); the floor is infinite by T_E = ' + TE.toFixed(4) + ' s, the truth by T* = 0.01 s');
  // E03 sharp on constants
  var c = 50, Tc = 1/c, TEc = 1/c;
  lg('E03', Math.abs(Tc - TEc) < 1e-15, 'on a constant field the guarantee is sharp: E0 = c^2, T_E = 1/sqrt(E0) = T* = ' + Tc + ' s, ratio exactly 1 (c = 50)');
  // E04 the arch: ratio sqrt(2)
  var TEa = 1/Math.sqrt(A*A/2);
  lg('E04', Math.abs(TEa/Tstar - Math.SQRT2) < 1e-12, 'the 100-degree arch: E0 = A^2/2, so T_E = 1/sqrt(E0) = ' + TEa.toFixed(7) + ' s vs T* = ' + Tstar + ' s: the guarantee overshoots by exactly sqrt(2) = ' + (TEa/Tstar).toPrecision(16));
  // E05 gallery: 1000 LCG profiles, three noise widths; ratio = max/rms >= 1 always
  var mins = [9, 9, 9], maxs = [0, 0, 0], ws = [0.02, 0.1, 0.5];
  for (var p = 0; p < 1000; p++) {
    var rr = lcg(9000 + p), cls = p % 3, w = ws[cls], cc = 0.05 + 1.95*rr();
    var n = 50, mx = 0, ss = 0;
    for (var i2 = 0; i2 < n; i2++) { var v = cc*(1 + w*(rr() - 0.5)); if (v > mx) mx = v; ss += v*v; }
    var ratio = mx/Math.sqrt(ss/n);
    if (ratio < mins[cls]) mins[cls] = ratio;
    if (ratio > maxs[cls]) maxs[cls] = ratio;
  }
  lg('E05', mins[0] >= 1 && mins[0] < mins[1] && mins[1] < mins[2] && mins[2] < 1.8, 'gallery of 1000 profiles, ratio T_E/T* = max/rms >= 1 always (Jensen): nearest-constant noise 2% -> min ratio ' + mins[0].toPrecision(6) + ', noise 10% -> ' + mins[1].toPrecision(6) + ', noise 50% -> ' + mins[2].toPrecision(6) + ' (max seen ' + maxs[2].toPrecision(4) + '): the guarantee tightens to equality as profiles flatten');
  // E06 diffusion braking: u_t = u_xx + u^2, Dirichlet 0, explicit scheme
  function rodRun(a0, nSteps) {
    var M2 = 100, dx2 = 1/M2, dt2 = 0.2*dx2*dx2, rd = dt2/(dx2*dx2);
    var u2 = [];
    for (var i3 = 1; i3 <= M2; i3++) u2.push(a0*Math.sin(Math.PI*i3/(M2+1)));
    function En(x) { var s = 0; for (var i4 = 0; i4 < x.length; i4++) s += x[i4]*x[i4]; return s*dx2; }
    var E0 = En(u2);
    for (var s2 = 0; s2 < nSteps; s2++) {
      var nw = [];
      for (var i5 = 1; i5 <= M2; i5++) {
        var aL = (i5 === 1 ? 0 : u2[i5-2]), aR = (i5 === M2 ? 0 : u2[i5]), c0 = u2[i5-1];
        nw.push(c0 + rd*(aL - 2*c0 + aR) + dt2*c0*c0);
      }
      u2 = nw;
    }
    return En(u2)/E0;
  }
  var cool = rodRun(0.5, 1000), hot = rodRun(20, 1000);
  lg('E06', cool < 0.9 && hot > 1.1, 'diffusion braking: with u_t = u_xx + u^2 the cool rod (a = 0.5) falls to E/E0 = ' + cool.toPrecision(4) + ' while the hot rod (a = 20) climbs to ' + hot.toPrecision(4) + ' after 0.02 s: the same ledger separates a dying field from one that eats the plate');
  return L.join('\n');
}

__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P29-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var TH = Math.PI/13;
  function lcg(seed) { var s = seed; return function() { s = (s*16807) % 2147483647; return (s - 1)/2147483646; }; }
  function energy(x) { var s = 0; for (var j = 0; j < x.length; j++) s += x[j]*x[j]; return s; }
  function fwd(x) { var w = []; for (var i = 1; i <= 12; i++) { var a = (i === 1 ? 0 : x[i-2]), b = (i === 12 ? 0 : x[i]); w.push((a+b)/2); } return w; }
  function bwd(w) {
    var rr = [0, 0], pp = [0, 1], i;
    for (i = 2; i <= 13; i++) { rr[i] = 2*w[i-2] - rr[i-2]; pp[i] = (i === 2) ? 0 : -pp[i-2]; }
    var s = -rr[13]/pp[13];
    var u = [];
    for (i = 1; i <= 12; i++) u.push(rr[i] + pp[i]*s);
    return u;
  }
  var m2 = [], i2;
  for (i2 = 1; i2 <= 12; i2++) m2.push(Math.sin(2*TH*i2));
  var u = m2.slice(), E0 = energy(u), mono = true;
  for (var s2 = 0; s2 < 10; s2++) { var un = bwd(u); if (energy(un) <= energy(u)) mono = false; u = un; }
  var ratio10 = energy(u)/E0, pred = Math.pow(Math.cos(2*TH), -20);
  lg('F01', mono && Math.abs(ratio10/pred - 1) < 1e-10, 'run the ledger backward (solve the un-smoothing recurrence): after ten undo-steps the mode-2 ledger reads ' + ratio10.toPrecision(6) + ' times its start, matching cos(2 pi/13)^(-20) = ' + pred.toPrecision(6) + ', and it rises at every single step');
  var rr3 = lcg(1234), x0 = [];
  for (i2 = 0; i2 < 12; i2++) x0.push(rr3() - 0.5);
  var xf = x0.slice();
  for (var s3 = 0; s3 < 10; s3++) xf = fwd(xf);
  for (var s4 = 0; s4 < 10; s4++) xf = bwd(xf);
  var err = 0;
  for (i2 = 0; i2 < 12; i2++) err = Math.max(err, Math.abs(xf[i2] - x0[i2]));
  lg('F02', err < 1e-5 && err > 0, 'a ten-step forward-then-backward round trip on a random field returns with error ' + err.toExponential(1) + ' (the solve really inverts the step) - but those lost digits ARE the exhibit: undoing the averaging is ill-conditioned by 8.3x per step at worst, and no amount of care undoes a second, let alone a century');
  var lam = 4*Math.PI*Math.PI, amp = Math.exp(lam), en = Math.exp(2*lam);
  var d = 1e-6*amp;
  lg('F03', Math.abs(Math.log(amp) - lam) < 1e-12 && d > 1e10, 'the continuum receipt: a mode-2 iron rod (alpha = 1) read one second in the past has amplitude multiplied by e^(4 pi^2) = ' + amp.toExponential(3) + ', energy by ' + en.toExponential(3) + '; two presents differing by a millionth of a degree differed by ' + d.toExponential(3) + ' degrees a second ago - the audit premise (the ledger only falls) dies in reverse');
  return L.join('\n');
}

__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P29-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var TH = Math.PI/13, h = 1/13, c2 = 1, dt = 0.03, g = 0.01;
  function lap(u) { var w = []; for (var i = 1; i <= 12; i++) { var a = (i === 1 ? 0 : u[i-2]), b = (i === 12 ? 0 : u[i]); w.push(c2*(a - 2*u[i-1] + b)/(h*h)); } return w; }
  function cross(u1, u0) { var s = 0; for (var i = 1; i <= 13; i++) { var d1 = (i === 13 ? 0 : u1[i-1]) - (i === 1 ? 0 : u1[i-2]); var d0 = (i === 13 ? 0 : u0[i-1]) - (i === 1 ? 0 : u0[i-2]); s += d1*d0; } return 0.5*c2*s/(h*h); }
  function vsq(v) { var s = 0; for (var i = 0; i < 12; i++) s += v[i]*v[i]; return 0.5*s; }
  var u0 = [], i;
  for (i = 1; i <= 12; i++) u0.push(Math.sin(TH*i));
  var lu0 = lap(u0), v = [];
  for (i = 0; i < 12; i++) v.push(0.5*dt*lu0[i]);
  var u = u0.slice(), u1 = [];
  for (i = 0; i < 12; i++) u1.push(u[i] + dt*v[i]);
  var I1 = vsq(v) + cross(u1, u);
  var cur = u1, prev = u, maxdrift = 0;
  var uu = u0.slice(), vv = [];
  var lu0b = lap(uu);
  for (i = 0; i < 12; i++) vv.push(0.5*dt*lu0b[i]);
  var ups = 0, downs = 0, last = 0;
  for (i = 0; i < 12; i++) last += uu[i]*uu[i];
  for (var st = 0; st < 2000; st++) {
    var lu = lap(cur), vn = [];
    for (i = 0; i < 12; i++) vn.push(v[i] + dt*lu[i]);
    var un2 = [];
    for (i = 0; i < 12; i++) un2.push(cur[i] + dt*vn[i]);
    v = vn; prev = cur; cur = un2;
    var It = vsq(v) + cross(cur, prev);
    if (Math.abs(It/I1 - 1) > maxdrift) maxdrift = Math.abs(It/I1 - 1);
    var lub = lap(uu), vnb = [];
    for (i = 0; i < 12; i++) vnb.push(vv[i] + dt*lub[i]);
    var unb = [];
    for (i = 0; i < 12; i++) unb.push(uu[i] + dt*vnb[i]);
    uu = unb; vv = vnb;
    var s3 = 0; for (i = 0; i < 12; i++) s3 += uu[i]*uu[i];
    if (s3 > last) ups++; else if (s3 < last) downs++;
    last = s3;
  }
  lg('G01', ups > 100 && downs > 100, 'the naive ledger sum u^2 on the undamped string is two-sided: over 2000 steps it rises ' + ups + ' times and falls ' + downs + ' times - it certifies nothing');
  lg('G02', maxdrift < 1e-9, 'the full staggered energy 1/2 sum v^2 + 1/2 u^T(-L)u_prev is conserved: worst deviation over 2000 leapfrog steps is ' + maxdrift.toExponential(2) + ' of E (machine roundoff) - the scheme trades the naive ledger for a true one');
  var u2 = u0.slice(), v2 = [];
  var lu0c = lap(u2);
  for (i = 0; i < 12; i++) v2.push(0.5*dt*lu0c[i]);
  var Ia, Ib, chk = null, winBad = 0;
  for (var st3 = 0; st3 < 4000; st3++) {
    if (st3 === 2000) Ia = chk;
    var luc = lap(u2), vnc = [];
    for (i = 0; i < 12; i++) vnc.push((v2[i] + dt*luc[i])/(1 + g*dt));
    var unc = [];
    for (i = 0; i < 12; i++) unc.push(u2[i] + dt*vnc[i]);
    var pr = u2; u2 = unc; v2 = vnc;
    var Ic = vsq(v2) + cross(u2, pr);
    if (st3 % 200 === 199) { if (chk !== null && Ic >= chk) winBad++; chk = Ic; }
  }
  Ib = chk;
  var slope = Math.log(Ib/Ia)/(2000*dt);
  lg('G03', winBad === 0 && Math.abs(slope/g + 1) < 0.05, 'damped string (gamma = 0.01): at every 200-step checkpoint the staggered energy is lower than the one before (20/20 windows fall), tail rate measured ' + slope.toPrecision(4) + ' per second vs the ledger prediction -gamma = -0.01: conservation alone buys stability, only damping buys decay');
  return L.join('\n');
}

__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P29-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  function lcg(seed) { var s = seed; return function() { s = (s*16807) % 2147483647; return (s - 1)/2147483646; }; }
  function gridE(u, dx) { var s = 0; for (var i = 0; i < u.length; i++) s += u[i]*u[i]; return s*dx; }
  function mx(u) { var m = 0; for (var i = 0; i < u.length; i++) if (u[i] > m) m = u[i]; return m; }
  function tent(eps, dx) {
    var n = Math.round(1/dx), u = [];
    for (var i = 0; i <= n; i++) {
      var d = Math.abs(i*dx - 0.5);
      u.push(d >= eps ? 0 : 1 - d/eps);
    }
    return u;
  }
  var eps = [0.1, 0.01, 0.001], Es = [], ok1 = true, parts = [];
  for (var e = 0; e < 3; e++) {
    var dxe = eps[e]/10, u = tent(eps[e], dxe), E = gridE(u, dxe), M = mx(u);
    Es.push(E);
    parts.push('eps ' + eps[e] + ': E = ' + E.toPrecision(4) + ' vs exact 2 eps/3 = ' + (2*eps[e]/3).toPrecision(4));
    if (Math.abs(M - 1) > 1e-12) ok1 = false;
    if (Math.abs(E/(2*eps[e]/3) - 1) > 0.02) ok1 = false;
  }
  lg('H01', ok1 && Es[2] < Es[1]/9 && Es[1] < Es[0]/9, 'tent spikes of half-width ' + eps.join('/') + ' all top out at max = 1.000000 while the ledger reads ' + parts.join(', ') + ' - the ledger goes to zero, the thermometer does not');
  var dxb = 1e-4, nb = Math.round(1/dxb);
  var broad = [];
  for (var i2 = 0; i2 <= nb; i2++) broad.push(1);
  var Eb = gridE(broad, dxb);
  var epsB = 0.001, p = Math.sqrt(Eb/(2*epsB/3));
  var spiky = [];
  for (var i3 = 0; i3 <= nb; i3++) {
    var d3 = Math.abs(i3*dxb - 0.5);
    spiky.push(d3 >= epsB ? 0 : p*(1 - d3/epsB));
  }
  lg('H02', Math.abs(gridE(spiky, dxb)/Eb - 1) < 0.02 && mx(spiky)/mx(broad) > 30, 'same-ledger pair: the flat field (u = 1 everywhere) and a spike of half-width 0.001 both read E = ' + Eb.toPrecision(4) + ', yet their maxima are ' + mx(broad).toFixed(1) + ' and ' + mx(spiky).toFixed(1) + ' degrees - identical budgets, wildly different worst cases (sizes, not locations)');
  var dxr = 1/1000, rr = lcg(777), worst = 0;
  for (var t = 0; t < 200; t++) {
    var u2 = [], m2 = 0;
    for (var i4 = 0; i4 <= 1000; i4++) { var val = rr(); u2.push(val); if (val > m2) m2 = val; }
    var E2 = gridE(u2, dxr), r2 = m2/Math.sqrt(E2/dxr);
    if (r2 > worst) worst = r2;
  }
  var one = [];
  for (var i5 = 0; i5 <= 1000; i5++) one.push(i5 === 500 ? 37 : 0);
  var spikeRatio = mx(one)/Math.sqrt(gridE(one, dxr)/dxr);
  var flatRatio = mx(broad)/Math.sqrt(Eb/dxb);
  lg('H03', worst <= 1 + 1e-12 && Math.abs(spikeRatio - 1) < 1e-12, 'on a fixed grid the ledger buys one bound: E >= max^2 dx gives max <= sqrt(E/dx) - honored by all 200 random profiles (worst ratio to the bound ' + worst.toPrecision(6) + '), saturated exactly by the one-cell spike (ratio 1.000000), slack ' + flatRatio.toPrecision(3) + ' for the flat field - a coarser grid is a blinder ledger');
  return L.join('\n');
}

__all.push(pieceRun());
})();
(function () {
function pieceRun() {
  var L = [];
  function lg(id, ok, msg) { L.push('P29-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  var TH = Math.PI/13, C = Math.cos(TH);
  function lcg(seed) { var s = seed; return function() { s = (s*16807) % 2147483647; return (s - 1)/2147483646; }; }
  var p = [2,4,2], hist = [p.join(',')], Eh = [], ok1 = true;
  function e3(x) { return x[0]*x[0] + x[1]*x[1] + x[2]*x[2]; }
  Eh.push(e3(p));
  for (var s = 0; s < 5; s++) {
    p = [p[1]/2, (p[0]+p[2])/2, p[1]/2];
    hist.push(p.join(','));
    Eh.push(e3(p));
    if (Math.abs(Eh[s+1]/Eh[s] - 0.5) > 1e-12) ok1 = false;
  }
  lg('X01', ok1 && Eh[0] === 24, '3-slab (2,4,2): profiles ' + hist.join(' -> ') + '; ledger ' + Eh.join(' -> ') + ' - exactly halving every step (both even-symmetric modes carry energy quotient cos^2(pi/4) = 1/2)');
  function px3(t) { return 60 + t*33750; }
  function py3(u) { return 330 - u*0.375; }
  var TE = 1/Math.sqrt(5000), truthPts = [], floorPts = [], i2;
  for (i2 = 0; i2 <= 34; i2++) { var t = i2*0.0005; var u = 100/(1 - 100*t); if (u <= 800 && u > 0) truthPts.push(px3(t).toFixed(1) + ',' + py3(u).toFixed(1)); }
  for (i2 = 0; i2 <= 34; i2++) { var t2 = i2*0.0005; var f = Math.sqrt(5000)/(1 - Math.sqrt(5000)*t2); if (f <= 800 && f > 0) floorPts.push(px3(t2).toFixed(1) + ',' + py3(f).toFixed(1)); }
  var pxTE = px3(TE);
  lg('X02', Math.abs(px3(0.01) - 397.5) < 1e-9 && Math.abs(pxTE - 537.2971) < 0.0005 && truthPts.length === 18 && floorPts.length === 26, 'fig P29.3 data: truth cliff polyline [' + truthPts.join(' ') + ']; guarantee floor polyline [' + floorPts.join(' ') + ']; truth asymptote px 397.5 (T* = 0.0100), guarantee asymptote px ' + pxTE.toFixed(1) + ' (T_E = ' + TE.toFixed(4) + ')');
  var N = 12, v = [];
  for (var i3 = 1; i3 <= N; i3++) v.push(100*Math.sin(TH*i3));
  var rnd = lcg(2903), mix = [];
  for (i3 = 0; i3 < N; i3++) mix.push(v[i3] + 30*Math.sin(3*TH*(i3+1)) + 20*rnd());
  function energy(u) { var s2 = 0; for (var j = 0; j < u.length; j++) s2 += u[j]*u[j]; return s2; }
  function step(u) { var w = []; for (var i4 = 1; i4 <= N; i4++) { var a = (i4 === 1 ? 0 : u[i4-2]), b = (i4 === N ? 0 : u[i4]); w.push((a+b)/2); } return w; }
  function px1(n) { return 60 + 1.8*n; }
  function py1(E) { return 330 - (Math.log10(E) + 3)*37.5; }
  var cu = mix.slice(), E0m = energy(cu), ledPts = [], envPts = [], ok3 = true, r100 = 0;
  for (var n1 = 0; n1 <= 300; n1 += 25) {
    var E = energy(cu), env = E0m*Math.pow(C*C, n1);
    if (E > env*(1+1e-9)) ok3 = false;
    if (n1 === 100) r100 = E/env;
    ledPts.push(px1(n1).toFixed(1) + ',' + py1(E).toFixed(1));
    envPts.push(px1(n1).toFixed(1) + ',' + py1(env).toFixed(1));
    for (var q = 0; q < 25 && n1 < 300; q++) cu = step(cu);
  }
  lg('X03', ok3 && Math.abs(r100 - 0.919940) < 1e-5 && ledPts.length === 13, 'fig P29.2 data: mixed start E0=' + E0m.toPrecision(7) + '; ledger polyline [' + ledPts.join(' ') + ']; envelope polyline [' + envPts.join(' ') + ']; ledger/envelope at n=100 = ' + r100.toPrecision(6) + ' (never above)');
  var A100 = v.slice();
  for (var s6 = 0; s6 < 100; s6++) A100 = step(A100);
  var claim = A100.slice(); claim[5] = claim[5] + 0.5;
  var tPts = [], cPts = [], ok4 = true;
  for (var i5 = 0; i5 < N; i5++) {
    var x0 = 70 + 45*i5;
    tPts.push(x0 + ',' + (330 - 46*A100[i5]).toFixed(1));
    cPts.push((x0+17) + ',' + (330 - 46*claim[i5]).toFixed(1));
    if (i5 !== 5 && Math.abs(claim[i5] - A100[i5]) > 1e-12) ok4 = false;
  }
  lg('X04', ok4 && Math.abs(A100[5] - 5.2016666) < 1e-6 && Math.abs(claim[5] - A100[5] - 0.5) < 1e-12, 'fig P29.1 data: truth bar tops [' + tPts.join(' ') + ']; claim bar tops [' + cPts.join(' ') + ']; slab 6 reads ' + A100[5].toPrecision(8) + ' deg truth vs ' + claim[5].toPrecision(8) + ' claimed');
  var hX = 1/13;
  function lapX(u) { var w = []; for (var ix = 1; ix <= 12; ix++) { var a = (ix === 1 ? 0 : u[ix-2]), b = (ix === 12 ? 0 : u[ix]); w.push((a - 2*u[ix-1] + b)/(hX*hX)); } return w; }
  function crossX(u1, u0) { var s = 0; for (var ix = 1; ix <= 13; ix++) { var d1 = (ix === 13 ? 0 : u1[ix-1]) - (ix === 1 ? 0 : u1[ix-2]); var d0 = (ix === 13 ? 0 : u0[ix-1]) - (ix === 1 ? 0 : u0[ix-2]); s += d1*d0; } return 0.5*s/(hX*hX); }
  function dampedSlope(gam, nSteps, tailSteps) {
    var uu = v.slice(), vv = [], ix;
    var lu0 = lapX(uu);
    for (ix = 0; ix < 12; ix++) vv.push(0.5*0.03*lu0[ix]);
    var Ia = 0, Ib = 0;
    for (var st = 0; st < nSteps; st++) {
      var lu = lapX(uu), vn = [];
      for (ix = 0; ix < 12; ix++) vn.push((vv[ix] + 0.03*lu[ix])/(1 + gam*0.03));
      var un = [];
      for (ix = 0; ix < 12; ix++) un.push(uu[ix] + 0.03*vn[ix]);
      var pr = uu; uu = un; vv = vn;
      var Ic = 0.5*(vv[0]*vv[0]+vv[1]*vv[1]+vv[2]*vv[2]+vv[3]*vv[3]+vv[4]*vv[4]+vv[5]*vv[5]+vv[6]*vv[6]+vv[7]*vv[7]+vv[8]*vv[8]+vv[9]*vv[9]+vv[10]*vv[10]+vv[11]*vv[11]) + crossX(uu, pr);
      if (st === nSteps - tailSteps - 1) Ia = Ic;
      if (st === nSteps - 1) Ib = Ic;
    }
    return Math.log(Ib/Ia)/(tailSteps*0.03);
  }
  var lam1 = 2*(1 - C)/(hX*hX);
  var s05 = dampedSlope(0.5, 4000, 2000);
  var s20 = dampedSlope(20, 2400, 600);
  var pred20 = 2*lam1/20;
  lg('X05', Math.abs(s05 + 0.5) < 0.025 && Math.abs(s20/pred20 + 1) < 0.1, 'damped-string tail rates: gamma = 0.5 measures ' + s05.toPrecision(4) + ' per second (the damping coefficient itself); gamma = 20 measures ' + s20.toPrecision(4) + ' against the slow-root floor 2*omega1^2/gamma = ' + pred20.toPrecision(4) + ' - forty times the damping buys about twice the decay: past critical, more damping means slower decay');
  return L.join('\n');
}

__all.push(pieceRun());
})();
(function () {
function pieceRun(PAGE) {
var EXPECTED = 53515;

  var L = [];
  function lg(id, ok, msg) { L.push('P29-' + id + ' ' + (ok ? 'PASS' : 'FAIL') + ' ' + msg); }
  function count(hay, needle) { return hay.split(needle).length - 1; }
  function utf8len(s) { var b = 0; for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); if (c < 0x80) b += 1; else if (c < 0x800) b += 2; else if (c >= 0xD800 && c <= 0xDBFF) { b += 4; i++; } else if (c >= 0xDC00) {} else b += 3; } return b; }
  var low = PAGE.toLowerCase();
  var okAll = true;
  var h2s = PAGE.match(/<h2>[^<]*<\/h2>/g) || [];
  var h2want = ['1 · Before we begin','2 · Meet the problem','3 · Name the move','4 · The move at work','5 · When the move fails','6 · What to try next','7 · Lineage','8 · Exercises'];
  var h2ok = h2s.length === 8 && h2s.every(function (h, i) { return h === '<h2>' + h2want[i] + '</h2>'; });
  var ids = ['bridge','encounter','name-the-move','the-move-at-work','when-it-fails','what-next','lineage','exercises'];
  var idok = ids.every(function (id, i) { return PAGE.indexOf('section id="' + id + '"') >= 0 && (i === 0 || PAGE.indexOf('section id="' + ids[i-1] + '"') < PAGE.indexOf('section id="' + id + '"')); });
  lg('S01', h2ok && idok && PAGE.indexOf('<title>P29 · Energy methods · The Patterns Atlas</title>') >= 0 && PAGE.indexOf('<h1>Energy methods</h1>') >= 0 && PAGE.indexOf('P29 · the fifth move of tier 3') >= 0 && count(PAGE, 'class="tagline"') === 1,
     'structure: 8 h2 exact titles, 8 section ids in order, title/h1/kicker/tagline present');
  var boxes = ['box-p29','box-p29a','box-p29b'];
  var bok = boxes.every(function (b, i) { return PAGE.indexOf('id="' + b + '"') >= 0 && (i === 0 || PAGE.indexOf('id="' + boxes[i-1] + '"') < PAGE.indexOf('id="' + b + '"')); });
  lg('S02', bok && count(PAGE, 'class="pattern-box"') === 3 && count(PAGE, 'class="onramp"') === 1 && count(PAGE, 'class="warn"') === 1 && PAGE.indexOf('id="scope-warn"') >= 0 && PAGE.indexOf('New word: energy.') >= 0 && PAGE.indexOf('Scope, honestly.') >= 0 && count(PAGE, 'class="pid"') === 3,
     'boxes and asides: 3 pattern-box ids in order, onramp once, warn/scope-warn once, 3 pid lines');
  var openP = count(PAGE, '\\('), closeP = count(PAGE, '\\)'), openD = count(PAGE, '\\['), closeD = count(PAGE, '\\]');
  var pin = 'sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=';
  var banned = ['the lab','verifier','session','planned','published','receipt'];
  var bhits = banned.filter(function (t) { return low.indexOf(t) >= 0; });
  lg('S03', openP === closeP && openD === closeD && PAGE.indexOf('$') < 0 && PAGE.indexOf('\u0060') < 0 && count(PAGE, pin) === 1 && bhits.length === 0,
     'tex balance ' + openP + '/' + closeP + ' inline, ' + openD + '/' + closeD + ' display; zero dollars/backticks; MathJax pin once; banned tokens: ' + (bhits.length ? bhits.join(',') : 'none'));
  var hrefs = (PAGE.match(/href="[^"]*"/g) || []).map(function (h) { return h.slice(6, -1); });
  var wl = ['p09-invariant.html','p26-model-with-equation.html','p24-waves.html','p15-squeeze.html','p16-isomorphism.html','p25-machine-cases.html','p19-count-outcomes.html','p11-contradiction.html','p41-mountain-pass.html','p43-flow-with-surgery.html','p55-current-mass.html','p72-monovariants.html','p30-localize-at-prime.html','index.html','assets/style.css'];
  var bad = hrefs.filter(function (h) { return wl.indexOf(h) < 0; });
  var missing = wl.filter(function (w) { return hrefs.indexOf(w) < 0; });
  lg('S04', bad.length === 0 && missing.length === 0, 'hrefs: ' + hrefs.length + ' all whitelisted; every one of the ' + wl.length + ' canonical targets used' + (bad.length ? '; OFF-LIST: ' + bad.join(',') : '') + (missing.length ? '; MISSING: ' + missing.join(',') : ''));
  var svgs = count(PAGE, '<svg');
  var vb = count(PAGE, 'viewBox="0 0 640 360"');
  var figcaps = ['Fig P29.1.','Fig P29.2.','Fig P29.3.'];
  var fkok = figcaps.every(function (f) { return PAGE.indexOf(f) >= 0; });
  var rects = count(PAGE, '<rect');
  var polys = count(PAGE, '<polyline');
  var det = count(PAGE, '<details>');
  lg('S05', svgs === 3 && vb === 3 && fkok && rects === 24 && polys === 4 && det === 10 && count(PAGE, '<summary>Hint</summary>') === 5 && count(PAGE, '<summary>Worked answer</summary>') === 5 && count(PAGE, 'role="img"') === 3 && count(PAGE, 'class="ex"') === 5 && count(PAGE, '●○○') === 1 && count(PAGE, '●●○') === 1 && count(PAGE, '●●●') === 1 && count(PAGE, '◆') === 1 && count(PAGE, '◐') === 1,
     'figures and exercises: 3 svg (viewBox 640x360, role img), figcaptions 1/2/3, 24 rects, 4 polylines, 5 ex with 5 Hint + 5 Worked details, moons once each');
  var needles = ['0.05811636515','0.0795892','22.4828','44.9656','4900','79.1','525.5','1.414213562','0.920','94,332','65,000','11.3936','1.397','38.7','0.01001','0.4970','1.016','0.9822','14.988','15.958','0.9903','224.4160155','0.0525','0.029','5.2017','5.7017','0.0100','0.0141','5000','12 \\to 6 \\to 3 \\to 1.5 \\to 0.75','0.0667','1.007','1.317','5.50','0.0565','8.3','21.589','7.038','10.326','1.451','1.440','0.0751','9.99','2.5 \\times 10^{-14}','4.75 \\times 10^{-4}','0.00067','1.000000'];
  var nmiss = needles.filter(function (n) { return PAGE.indexOf(n) < 0; });
  lg('S06', nmiss.length === 0, 'numeric needles: all ' + needles.length + ' present' + (nmiss.length ? '; MISSING: ' + nmiss.join(' , ') : ''));
  var foot = PAGE.indexOf('<footer>');
  var ord = ['id="exercises"','<footer>','</body>','</html>'];
  var ordok = ord.every(function (o, i) { return PAGE.indexOf(o) >= 0 && (i === 0 || PAGE.indexOf(ord[i-1]) < PAGE.indexOf(o)); });
  var endsOk = PAGE.lastIndexOf('</html>') === PAGE.length - 8;
  lg('S07', ordok && endsOk && count(PAGE, 'p30-localize-at-prime.html') === 1 && count(PAGE, 'class="atlas-home"') === 1 && PAGE.indexOf('P30 · Localize at a prime') >= 0 && PAGE.indexOf('P26 · Model it with an equation') >= 0,
     'footer: exercises then footer then body/html close, Next to P30 once, atlas-home with index + P26, page ends </html>');
  var bytes = utf8len(PAGE);
  lg('S08', bytes === EXPECTED, 'page utf-8 byte length ' + bytes + ' matches the assembled file (' + EXPECTED + ')');
  for (var q = 0; q < L.length; q++) if (L[q].indexOf('FAIL') >= 0) okAll = false;
  return { allPass: okAll, out: L.join('\n') };
}
var __sr = pieceRun(PAGE);
__all.push(__sr.out);
})();
// --- summary ---
var __text = __all.join("\n");
var __lines = __text.split("\n");
var __total = 0, __fails = 0;
for (var qi = 0; qi < __lines.length; qi++) {
  var m = __lines[qi].match(/^P29-\S+ (PASS|FAIL) /);
  if (m) { __total++; if (m[1] === "FAIL") __fails++; }
}
console.log(__text);
console.log("TOTAL " + __total + " checks, FAILS " + __fails);
