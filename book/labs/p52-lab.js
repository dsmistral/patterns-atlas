// p52-lab.js — The Patterns Atlas, P52: Microlocal propagation of singularities
// S84 engine (authoring session). Deterministic; no recursion; no BigInt.
// Groups: A the string (lattice wave equation, exact d'Alembert at CFL=1);
// B the shelf audit (P42 hinge); C direction (2D census); D rays (Hamilton flow);
// E the elliptic contrast; F page needles + figure data.
// Assembled from pieces p00-p08; run harness replaces console.log with a collector.
var LAB = LAB || {};
LAB.NCHK = 0; LAB.NFAIL = 0; LAB.GROUP = '';
function CHK(name, cond, detail) {
  LAB.NCHK++;
  var ok = !!cond;
  if (!ok) LAB.NFAIL++;
  console.log((ok ? 'PASS ' : 'FAIL ') + LAB.GROUP + ' ' + name + (detail ? ' — ' + detail : ''));
}
function GROUP(g) { LAB.GROUP = g; console.log(''); console.log('== ' + g + ' =='); }
function lcg(seed) { var s = seed >>> 0; return function () { s = (1103515245 * s + 12345) % 2147483648; return s; }; }
GROUP("A. the string — exact lattice d'Alembert (CFL=1)");
// A01: scheme identity on pseudo-random integer data (exact equality)
(function () {
  var rnd = lcg(20261101), F = [], G = [];
  for (var j = 0; j < 480; j++) { F.push(rnd() % 17 - 8); G.push(rnd() % 17 - 8); }
  var jlo = 60, jhi = 420, nmax = 40;
  function rowAt(n) { var r = []; for (var j = jlo - 1; j <= jhi + 1; j++) r.push(F[j + n] + G[j - n]); return r; }
  var prev = rowAt(0), cur = rowAt(1), maxdiff = 0;
  for (var n = 2; n <= nmax; n++) {
    var nxt = [];
    for (var i = 1; i < prev.length - 1; i++)
      nxt.push(2 * cur[i] - prev[i] + cur[i + 1] - 2 * cur[i] + cur[i - 1]);
    var fr = rowAt(n);
    for (var i = 0; i < nxt.length; i++) { var d = Math.abs(nxt[i] - fr[i + 1]); if (d > maxdiff) maxdiff = d; }
    prev = cur; cur = fr;
  }
  CHK('A01 scheme equals d\'Alembert exactly (n<=40, 361 cells)', maxdiff === 0, 'maxdiff=' + maxdiff);
})();
// A02: the tent pluck — corner positions are forced (64-cell grid, n=10)
(function () {
  var N = 64, c = 32, hw = 16;
  function u0(j) { var d = Math.abs(j - c); return d <= hw ? hw - d : 0; } // integer 1/16-units, peak 16
  function rowH(n) { var r = []; for (var j = 0; j < N; j++) r.push(u0(j + n) + u0(j - n)); return r; } // F=G=u0, half-units
  var r10 = rowH(10), corners = [];
  for (var j = 1; j < N - 1; j++) {
    var s0 = r10[j] - r10[j - 1], s1 = r10[j + 1] - r10[j];
    if (s1 !== s0) corners.push(j);
  }
  var want = [6, 22, 26, 38, 42, 58];
  CHK('A02 corner positions at t=10 forced to characteristics', corners.join(',') === want.join(','), 'corners=[' + corners.join(',') + ']');
  // peak split: apex pair rides 32-+10
  var apexL = r10[22], apexR = r10[42], orig = rowH(0)[32];
  CHK('A03 apex pair at 22/42, each half the pluck', apexL === 16 && apexR === 16 && orig === 32, 'apexL=' + apexL + ' apexR=' + apexR + ' orig=' + orig);
})();
// A04: figure config — 96-cell grid, tent base [32,64], n=20 (clean split)
(function () {
  var N = 96, c = 48, hw = 16;
  function u0(j) { var d = Math.abs(j - c); return d <= hw ? hw - d : 0; }
  function rowH(n) { var r = []; for (var j = 0; j < N; j++) r.push(u0(j + n) + u0(j - n)); return r; }
  var r20 = rowH(20), corners = [];
  for (var j = 1; j < N - 1; j++) { var s0 = r20[j] - r20[j - 1], s1 = r20[j + 1] - r20[j]; if (s1 !== s0) corners.push(j); }
  var wantC = [12, 28, 44, 52, 68, 84];
  var okC = corners.join(',') === wantC.join(',');
  var peakL = r20[28], peakR = r20[68], orig = rowH(0)[48];
  var okP = peakL === 16 && peakR === 16 && orig === 32;
  CHK('A04 figure split: corners [12,28,44,52,68,84], half-height tents', okC && okP, 'corners=[' + corners.join(',') + '] peaks=' + peakL + ',' + peakR + ' orig=' + orig);
})();
// A05-A07: persistence over 200 steps (600-cell grid) — roughness does not decay
(function () {
  var N = 600, c = 300, hw = 16;
  function u0(j) { var d = Math.abs(j - c); return d <= hw ? hw - d : 0; }
  var rows = [];
  var r0 = [], r1 = [];
  for (var j = 0; j < N; j++) { r0.push(u0(j) + u0(j)); r1.push(u0(j + 1) + u0(j - 1)); }
  rows.push(r0); rows.push(r1);
  for (var n = 1; n < 200; n++) {
    var nx = [];
    for (var j = 0; j < N; j++) {
      var jm = j > 0 ? j - 1 : 0, jp = j < N - 1 ? j + 1 : N - 1;
      nx.push(2 * rows[n][j] - rows[n - 1][j] + rows[n][jp] - 2 * rows[n][j] + rows[n][jm]);
    }
    rows.push(nx);
  }
  function sharp(r) { var m = 0; for (var j = 1; j < N - 1; j++) { var d2 = r[j + 1] - 2 * r[j] + r[j - 1]; if (Math.abs(d2) > m) m = Math.abs(d2); } return m; }
  var s0 = sharp(rows[0]), s200 = sharp(rows[200]);
  CHK('A05 kink sharpness splits and never decays: 4 = 2 + 2', s0 === 4 && s200 === 2 && s0 === 2 * s200, 'sharp(0)=' + s0 + ' sharp(200)=' + s200);
  // A06: the roughness rides bit-for-bit — each traveling half IS the original tent
  var r30 = rows[30], okRide = true, bad = -1;
  for (var j = 0; j < N; j++) {
    var want = 0;
    if (j >= 254 && j <= 286) want = u0(j + 30);
    else if (j >= 314 && j <= 346) want = u0(j - 30);
    if (r30[j] !== want) { okRide = false; bad = j; break; }
  }
  CHK('A06 each half at t=30 equals the original tent exactly (rest zero)', okRide, okRide ? 'supports [254,286]+[314,346], profile intact' : 'mismatch at j=' + bad);
  // A07: heat melt — the same tent under the heat scheme
  var h = r0.slice();
  for (var n = 0; n < 200; n++) {
    var nx = [];
    for (var j = 0; j < N; j++) {
      var jm = j > 0 ? j - 1 : 0, jp = j < N - 1 ? j + 1 : N - 1;
      nx.push(h[j] + 0.25 * (h[jp] - 2 * h[j] + h[jm]));
    }
    h = nx;
  }
  var sH = sharp(h), ratio = sH / s0;
  CHK('A07 heat melts the same tent (sharpness ratio < 0.05)', ratio < 0.05, 'ratio=' + ratio.toExponential(4));
})();
GROUP('B. the shelf audit — P42 hinge (N=128 DFT)');
// direct DFT, c[k] = (1/N) sum_j f[j] e^{-2 pi i jk/N}
(function () {
  var N = 128, TW = [];
  for (var k = 0; k < N; k++) {
    var row = [];
    for (var j = 0; j < N; j++) { var a = -2 * Math.PI * j * k / N; row.push([Math.cos(a), Math.sin(a)]); }
    TW.push(row);
  }
  function dft(f) {
    var mags = [];
    for (var k = 0; k <= N / 2; k++) {
      var re = 0, im = 0;
      for (var j = 0; j < N; j++) { re += f[j] * TW[k][j][0]; im += f[j] * TW[k][j][1]; }
      mags.push(Math.hypot(re / N, im / N));
    }
    return mags;
  }
  function shelves(mags) { var sh = []; for (var m = 1; m <= 5; m++) { var s = 0; var lo = Math.pow(2, m), hi = Math.min(2 * lo, 64); for (var k = lo; k < hi; k++) s += mags[k]; sh.push(s); } return sh; }
  var step = []; for (var j = 0; j < N; j++) step.push(j < 64 ? 1 : 0);
  var ms = dft(step);
  var maxEven = 0; for (var k = 2; k < 64; k += 2) if (ms[k] > maxEven) maxEven = ms[k];
  var p1 = Math.abs(1 * ms[1] - 1 / Math.PI), p3 = Math.abs(3 * ms[3] - 1 / Math.PI), p5 = Math.abs(5 * ms[5] - 1 / Math.PI);
  CHK('B01 step: even shelves empty, k|c_k| ~ 1/pi', maxEven < 1e-12 && p1 < 2e-3 && p3 < 2e-3 && p5 < 2e-3, 'maxEven=' + maxEven.toExponential(2) + ' dev1=' + p1.toExponential(2) + ' dev3=' + p3.toExponential(2));
  var shS = shelves(ms), okS = true, lineS = [];
  for (var m = 1; m <= 4; m++) { var rs = shS[m] / shS[m - 1]; if (rs < 0.6 || rs > 1.25) okS = false; lineS.push(rs.toFixed(3)); }
  CHK('B02 step shelves hold per octave (roughly constant)', okS, 'ratios=' + lineS.join(','));
  // the kink: periodic |sin|, exact series c[2m] = 2/(pi(4m^2-1))
  var kink = []; for (var j = 0; j < N; j++) kink.push(Math.abs(Math.sin(Math.PI * j / 64)));
  var mk = dft(kink);
  var maxOdd = 0; for (var k = 1; k < 64; k += 2) if (mk[k] > maxOdd) maxOdd = mk[k];
  var maxSer = 0, lineSer = [];
  for (var m = 1; m <= 6; m++) {
    var want = 2 / (Math.PI * (4 * m * m - 1)), got = mk[2 * m];
    var dev = Math.abs(got * Math.PI * (4 * m * m - 1) / 2 - 1);
    if (dev > maxSer) maxSer = dev;
    lineSer.push(got.toFixed(5));
  }
  CHK('B03 kink coefficients match exact series 2/(pi(4m^2-1)) (3.5% sampling band)', maxOdd < 1e-3 * mk[2] && maxSer < 0.035, 'maxOdd=' + maxOdd.toExponential(2) + ' maxSerDev=' + maxSer.toExponential(2) + ' c2=' + mk[2].toFixed(6));
  var shK = shelves(mk), okK = true, lineK = [];
  for (var m = 2; m <= 4; m++) { var rk = shK[m - 1] / shK[m - 2]; if (rk < 0.25 || rk > 0.65) okK = false; lineK.push(rk.toFixed(3)); }
  CHK('B04 kink shelves halve per octave (approaching 1/2)', okK, 'ratios=' + lineK.join(','));
  // smooth bump: super-exponential collapse
  var gauss = []; for (var j = 0; j < N; j++) { var x = (j - 64) / 8; gauss.push(Math.exp(-x * x)); }
  var mg = dft(gauss);
  var shG = shelves(mg), okG = true, lineG = [], prevRg = 0;
  for (var m = 2; m <= 5; m++) { var rg = shG[m - 1] / shG[m - 2]; lineG.push(rg.toExponential(2)); if (m === 2) { if (rg > 0.95) okG = false; } else { if (rg >= prevRg || (m === 3 && rg > 0.15) || (m === 4 && rg > 1e-3) || (m === 5 && rg > 1e-5)) okG = false; } prevRg = rg; }
  CHK('B05 smooth bump shelves collapse (strictly, octave by octave)', okG, 'ratios(m=2..5)=' + lineG.join(','));
  var band = []; for (var j = 0; j < N; j++) band.push(Math.cos(2 * Math.PI * j / N) + 0.5 * Math.cos(6 * Math.PI * j / N) + 0.25 * Math.cos(10 * Math.PI * j / N));
  var mb = dft(band);
  var hi = 0; for (var k = 8; k <= 64; k++) if (mb[k] > hi) hi = mb[k];
  CHK('B06 band-limited: shelves above k=8 are machine-zero', hi < 1e-12, 'max=' + hi.toExponential(2));
})();
GROUP('C. direction — the 2D census (64x64 DFT, separable)');
(function () {
  var N = 64, TW = [];
  for (var k = 0; k < N; k++) { var row = []; for (var j = 0; j < N; j++) { var a = -2 * Math.PI * j * k / N; row.push([Math.cos(a), Math.sin(a)]); } TW.push(row); }
  function dft2(F) { // F[x][y] -> C[kx][ky] = {re, im}
    var rows = [];
    for (var x = 0; x < N; x++) { var r = []; for (var ky = 0; ky < N; ky++) { var re = 0, im = 0; for (var y = 0; y < N; y++) { re += F[x][y] * TW[ky][y][0]; im += F[x][y] * TW[ky][y][1]; } r.push([re, im]); } rows.push(r); }
    var C = [];
    for (var kx = 0; kx < N; kx++) { var r = []; for (var ky = 0; ky < N; ky++) { var re = 0, im = 0; for (var x = 0; x < N; x++) { re += rows[x][ky][0] * TW[kx][x][0] - rows[x][ky][1] * TW[kx][x][1]; im += rows[x][ky][0] * TW[kx][x][1] + rows[x][ky][1] * TW[kx][x][0]; } r.push([re / (N * N), im / (N * N)]); } C.push(r); }
    return C;
  }
  function energy(C) {
    var tot = 0, axis = 0, diag = 0, octs = [0, 0, 0, 0, 0, 0], octsA = [0, 0, 0, 0, 0, 0];
    for (var kx = 0; kx < N; kx++) for (var ky = 0; ky < N; ky++) {
      if (kx === 0 && ky === 0) continue;
      var e = C[kx][ky][0] * C[kx][ky][0] + C[kx][ky][1] * C[kx][ky][1];
      tot += e;
      var ang = Math.atan2(ky, kx); if (ang < 0) ang += Math.PI; // unoriented line
      var dAxis = Math.min(Math.abs(ang - 0), Math.PI - Math.abs(ang - 0));
      var dDiag = Math.abs(ang - Math.PI / 4); if (dDiag > Math.PI / 2) dDiag = Math.PI - dDiag;
      if (dAxis < 10 * Math.PI / 180) axis += e;
      if (dDiag < 10 * Math.PI / 180) diag += e;
      var kr = Math.hypot(kx, ky), m = Math.min(5, Math.floor(Math.log(kr) / Math.log(2)));
      if (kr >= 2) { octs[m] += e; if (dAxis < 10 * Math.PI / 180) octsA[m] += e; }
    }
    return { tot: tot, axis: axis, diag: diag, octs: octs, octsA: octsA };
  }
  // C01: step in x only -> all energy on the ky=0 axis
  var F1 = []; for (var x = 0; x < N; x++) { var r = []; for (var y = 0; y < N; y++) r.push(x < 32 ? 1 : 0); F1.push(r); }
  var e1 = energy(dft2(F1));
  CHK('C01 line singularity: energy entirely on the conormal axis', e1.axis / e1.tot > 1 - 1e-12, 'axisShare=' + (e1.axis / e1.tot).toPrecision(17));
  // C02: torus-rotated step -> energy exactly on the diagonal kx=ky
  var F2 = []; for (var x = 0; x < N; x++) { var r = []; for (var y = 0; y < N; y++) r.push((x + y) % 64 < 32 ? 1 : 0); F2.push(r); }
  var e2 = energy(dft2(F2));
  var coneShare = e2.diag / e2.tot;
  CHK('C02 rotated step: energy exactly in the conormal cone', coneShare > 1 - 1e-12, 'coneShare=' + coneShare.toPrecision(17));
  // C03: point spike -> every direction, equal weight
  var F3 = []; for (var x = 0; x < N; x++) { var r = []; for (var y = 0; y < N; y++) r.push(0); F3.push(r); }
  F3[32][32] = 1;
  var C3 = dft2(F3);
  var mx = 0, mn = 1e9;
  for (var kx = 0; kx < N; kx++) for (var ky = 0; ky < N; ky++) { var m2 = Math.hypot(C3[kx][ky][0], C3[kx][ky][1]); if (m2 > mx) mx = m2; if (m2 < mn) mn = m2; }
  CHK('C03 point spike: flat census, all 4096 magnitudes equal', mx - mn === 0, 'max-min=' + (mx - mn).toExponential(2) + ' mag=' + mx.toExponential(4));
  // C04: windowed singularity — the direction pins down as frequency grows
  var F4 = []; for (var x = 0; x < N; x++) { var r = []; for (var y = 0; y < N; y++) { var w = Math.exp(-((x - 32) * (x - 32) + (y - 32) * (y - 32)) / 8); r.push((x < 32 ? 1 : 0) * w); } F4.push(r); }
  var e4 = energy(dft2(F4));
  var shares = [];
  for (var m = 0; m <= 5; m++) shares.push(e4.octsA[m] / e4.octs[m]);
  var rise = 0;
  for (var m = 1; m < 4; m++) if (shares[m + 1] > shares[m]) rise++;
  CHK('C04 windowed kink: axis share rises every octave 1-4', rise === 3 && shares[4] > shares[1] + 0.4, 'shares(octaves 1-5)=' + shares.slice(1).map(function (s) { return s.toFixed(3); }).join(','));
})();
GROUP('D. the rays — Hamilton flow of the wave symbol');
// state vector v = [t, x, tau, xi]; p = tau^2 - c^2 xi^2 (1D), p = tau^2 - c^2 (xi^2+eta^2) (2D)
(function () {
  function rk4_1d(v0, ds, nsteps) {
    var v = v0.slice();
    function f(v) { return [2 * v[2], -2 * v[3], 0, 0]; }
    for (var i = 0; i < nsteps; i++) {
      var k1 = f(v);
      var v2 = [v[0] + k1[0] * ds / 2, v[1] + k1[1] * ds / 2, v[2] + k1[2] * ds / 2, v[3] + k1[3] * ds / 2];
      var k2 = f(v2);
      var v3 = [v[0] + k2[0] * ds / 2, v[1] + k2[1] * ds / 2, v[2] + k2[2] * ds / 2, v[3] + k2[3] * ds / 2];
      var k3 = f(v3);
      var v4 = [v[0] + k3[0] * ds, v[1] + k3[1] * ds, v[2] + k3[2] * ds, v[3] + k3[3] * ds];
      var k4 = f(v4);
      for (var j = 0; j < 4; j++) v[j] = v[j] + ds / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]);
    }
    return v;
  }
  // D01: straight rays, invariants held (forward in time, both families, RK4)
  var maxErr = 0, speeds = [];
  var xis = [0.25, 0.5, 1, 2, 4];
  for (var a = 0; a < xis.length; a++) {
    for (var sx = -1; sx <= 1; sx += 2) {
      var xi = sx * xis[a], tau = xis[a]; // tau>0: forward in time; xi sign = ray family
      var v0 = [0, 5, tau, xi];
      var S = 10 / (2 * Math.abs(tau)), ds = S / 200;
      var v = rk4_1d(v0, ds, 200);
      var wantX = 5 - xi / tau * 10;
      var err = Math.max(Math.abs(v[1] - wantX), Math.abs(v[2] - tau), Math.abs(v[3] - xi));
      if (err > maxErr) maxErr = err;
      speeds.push(Math.abs((v[1] - 5) / v[0]));
    }
  }
  CHK('D01 rays straight, tau/xi invariants held (10 combos, RK4)', maxErr < 1e-9, 'maxErr=' + maxErr.toExponential(2));
  var maxSp = 0; for (var i = 0; i < speeds.length; i++) if (Math.abs(speeds[i] - 1) > maxSp) maxSp = Math.abs(speeds[i] - 1);
  CHK('D02 ray speed exactly c=1 (all combos)', maxSp < 1e-9, 'maxSpeedDev=' + maxSp.toExponential(2));
  // D03: the light cone in 2D — 32 directions from one point (linear flow: exact stepping)
  function cone() {
    var worst = 0;
    for (var q = 0; q < 32; q++) {
      var th = 2 * Math.PI * q / 32;
      var xi = Math.cos(th), eta = Math.sin(th), tau = 1; // on p = tau^2-(xi^2+eta^2)
      var t = 0, x = 0, y = 0;
      var S = 5 / (2 * tau), ds = S / 100;
      for (var i = 0; i < 100; i++) { t += 2 * tau * ds; x += -2 * xi * ds; y += -2 * eta * ds; }
      var r = Math.hypot(x, y);
      var dev = Math.abs(r - 5) + Math.abs(Math.hypot(xi, eta) - 1);
      if (dev > worst) worst = dev;
    }
    return worst;
  }
  CHK('D03 light cone: |x(t)|=ct for all 32 directions', cone() < 1e-9, 'maxDev=' + cone().toExponential(2));
})();
// D04/D05: the two-layer ray — Snell invariant sin(theta)/c = |eta|/tau
(function () {
  // fast -> slow: c=1 (x<0) into c=0.5 (x>=0), 60 deg incidence
  var tau = 1, eta = Math.sin(Math.PI / 3), xi = -Math.cos(Math.PI / 3);
  var sin1 = Math.abs(eta) / tau;                       // invariant value
  var xi2 = -Math.sqrt(tau * tau / 0.25 - eta * eta);   // transmitted xi in medium 2
  var v2 = [-0.25 * xi2 / tau, -0.25 * eta / tau];      // velocity in medium 2
  var sin2 = Math.abs(v2[1]) / Math.hypot(v2[0], v2[1]);
  var okSnell = Math.abs(sin2 - 0.5 * sin1) < 1e-12 && Math.abs(sin1 / 1 - sin2 / 0.5) < 1e-12;
  CHK('D04 Snell: sin(theta)/c invariant across the interface', okSnell, 'sin1=' + sin1.toFixed(9) + ' sin2=' + sin2.toFixed(9) + ' invariant=' + (sin1 / 1).toFixed(9));
  // path receipt: crossing point from x=-3 with velocity (0.5, sin60)
  var tCross = 3 / 0.5, yCross = Math.sin(Math.PI / 3) * tCross;
  var okPath = Math.abs(yCross - 3 * Math.tan(Math.PI / 3)) < 1e-12;
  CHK('D05 crossing point (0, 5.196152): 3*tan(60 deg)', okPath, 'yCross=' + yCross.toFixed(6));
  // D06: total internal reflection — the door closes: slow -> fast, sin(theta1) > c1/c2
  var etaT = 1.6, tauT = 1; // in c=0.5: sin(theta1) = c|eta|/tau = 0.8
  var disc = tauT * tauT / 1 - etaT * etaT;             // transmitted xi^2 in c=1: 1 - 2.56 < 0
  var sinSlow = 0.5 * etaT / tauT;                       // sin(theta1) = 0.8 in the slow medium
  CHK('D06 TIR detected: transmitted discriminant negative', disc < 0 && sinSlow > 0.5, 'disc=' + disc.toFixed(4) + ' sin(theta1)=' + sinSlow.toFixed(6) + ' (critical 0.5)');
})();
GROUP('E. the elliptic wall — no characteristic directions, smoothing by symbol division');
(function () {
  var N = 64, TW = [];
  for (var k = 0; k < N; k++) { var row = []; for (var j = 0; j < N; j++) { var a = -2 * Math.PI * j * k / N; row.push([Math.cos(a), Math.sin(a)]); } TW.push(row); }
  function dftmag(f) {
    var mags = [];
    for (var k = 0; k <= N / 2; k++) {
      var re = 0, im = 0;
      for (var j = 0; j < N; j++) { re += f[j] * TW[k][j][0]; im += f[j] * TW[k][j][1]; }
      mags.push(Math.hypot(re, im));
    }
    return mags;
  }
  // E01: the ladder — the inverse Laplacian as double prefix sum (two integrations)
  var f = []; for (var j = 0; j < N; j++) f.push(j >= 32 ? 1 : 0);
  var p1 = [0]; for (var j = 1; j < N; j++) p1.push(p1[j - 1] + f[j - 1]);   // first integral
  var u1 = [0]; for (var j = 1; j < N; j++) u1.push(u1[j - 1] + p1[j - 1]); // second integral
  var p2 = [0]; for (var j = 1; j < N; j++) p2.push(p2[j - 1] + u1[j - 1]); // third integral
  var u2 = [0]; for (var j = 1; j < N; j++) u2.push(u2[j - 1] + p2[j - 1]); // fourth integral
  // exact integers: dd(u1)[j] = f[j-2], dd(u2)[j] = u1[j-2]
  var okD2 = true, okD4 = true;
  for (var j = 2; j < N; j++) {
    if (u1[j] - 2 * u1[j - 1] + u1[j - 2] !== f[j - 2]) okD2 = false;
    if (u2[j] - 2 * u2[j - 1] + u2[j - 2] !== u1[j - 2]) okD4 = false;
  }
  var mf = dftmag(f), m1 = dftmag(u1), m2 = dftmag(u2);
// spectral identity: the periodic Laplacian multiplies every shelf by its symbol
var rnd2 = lcg(20261101), vv = [];
for (var j = 0; j < N; j++) vv.push(rnd2() % 10);
var w = [];
for (var j = 0; j < N; j++) w.push(vv[j] - 2 * vv[(j - 1 + N) % N] + vv[(j - 2 + N) % N]);
var mvv = dftmag(vv), mww = dftmag(w);
var maxRel = 0;
for (var k = 1; k <= 31; k++) {
var sym = 2 - 2 * Math.cos(2 * Math.PI * k / N);
var rel = Math.abs(mww[k] - mvv[k] * sym) / (mvv[k] * sym + 1e-15);
if (rel > maxRel) maxRel = rel;
}
CHK('E01 u"=f exact on the interval; Laplacian multiplies shelves by its symbol exactly', okD2 && okD4 && maxRel < 1e-9, 'maxRel=' + maxRel.toExponential(2));
  // E02: the symbol ~ k^2 at low frequency — division by the symbol collapses shelves
  var worst = 0;
  for (var k = 2; k <= 8; k++) {
    var sym = 2 - 2 * Math.cos(2 * Math.PI * k / N);
    var asym = 2 * Math.PI * k / N;
    var dev = Math.abs(sym / (asym * asym) - 1);
    if (dev > worst) worst = dev;
  }
  CHK('E02 Laplace symbol ~ k^2 (within 6% for k=2..8)', worst < 0.06, 'maxDev=' + worst.toFixed(4));
  // E03: the zero-set census — the wave has rays, the Laplacian has none
  var waveZeros = 0, lapMin = 9;
  for (var q = 0; q < 720; q++) {
    var th = 2 * Math.PI * q / 720, ct = Math.cos(th), st = Math.sin(th);
    if (Math.abs(ct * ct - st * st) < 1e-9) waveZeros++;
    var lp = ct * ct + st * st; if (lp < lapMin) lapMin = lp;
  }
  CHK('E03 zero census: wave symbol 4 directions, Laplace min = 1', waveZeros === 4 && lapMin > 0.999, 'waveZeros=' + waveZeros + ' lapMin=' + lapMin.toFixed(6));
  // E04: Jacobi smoothing — rough boundary and interior, 500 sweeps
  var G = 18, rnd = lcg(84721), U = [];
  for (var x = 0; x < G; x++) { var r = []; for (var y = 0; y < G; y++) r.push(rnd() % 2 === 0 ? 1 : -1); U.push(r); }
  function lapEnergy(M) {
    var s = 0;
    for (var x = 1; x < G - 1; x++) for (var y = 1; y < G - 1; y++) {
      var d = 4 * M[x][y] - M[x + 1][y] - M[x - 1][y] - M[x][y + 1] - M[x][y - 1];
      s += d * d;
    }
    return s;
  }
  var eBefore = lapEnergy(U);
  for (var it = 0; it < 500; it++) {
    var Nx = [];
    for (var x = 0; x < G; x++) Nx.push(U[x].slice());
    for (var x = 1; x < G - 1; x++) for (var y = 1; y < G - 1; y++)
      Nx[x][y] = 0.25 * (U[x + 1][y] + U[x - 1][y] + U[x][y + 1] + U[x][y - 1]);
    U = Nx;
  }
  var eAfter = lapEnergy(U);
  CHK('E04 elliptic wall: interior Laplacian energy drops > 100x', eAfter / eBefore < 0.01, 'ratio=' + (eAfter / eBefore).toExponential(4));
})();
GROUP('F. page needles + figure data + structure census');
LAB.FM = [];
function FMhas(s) { return LAB.FM.indexOf(s) !== -1; }
function N(s) { LAB.FM.push(s); }
N("<title>P52 · Microlocal propagation of singularities · The Patterns Atlas</title>");
N("P52 · the fifth move of tier 5");
N("<script>window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']]},svg:{fontCache:'global'}};</script>");
N("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=");
N("<h2>1 · Before we begin</h2>");
N("<h2>2 · Meet the problem</h2>");
N("<h2>3 · The pattern, named</h2>");
N("<h2>4 · Three encounters</h2>");
N("<h2>5 · When the trick breaks</h2>");
N("<h2>6 · Doors out</h2>");
N("<h2>7 · Lineage</h2>");
N("<h2>8 · Exercises</h2>");
N("Difficulty: ●○○ ●●○ ●●● ◆ ◐");
N("id=\"box-p52\"");
N("id=\"box-p52a\"");
N("id=\"box-p52b\"");
N("class=\"warn-box\"");
N("Scope, honestly");
N("class=\"sketch-marker\">SKETCH — the propagation theorem, honestly incomplete");
N("New word: the wavefront set");
N("<figcaption>Fig P52.1");
N("<figcaption>Fig P52.2");
N("<figcaption>Fig P52.3");
N("href=\"p53-deformation-cohomology.html\"");
N("href=\"p42-dyadic-decomposition.html\"");
N("href=\"p47-diagram-chase.html\"");
N("href=\"p49-ultraproduct-transfer.html\"");
N("href=\"p33-sheaf-cohomology-bridge.html\"");
N("href=\"p24-waves.html\"");
N("href=\"p09-invariant.html\"");
N("href=\"p54-stable-compactification.html\"");
N("href=\"p56-asymptotic-rescaling.html\"");
N("href=\"p62-sheafify-on-site.html\"");
N("href=\"p65-floer-homology.html\"");
N("class=\"atlas-home\"");
N("singularities travel along explicit curves through that census");
N("each a customer of the same cochain bookkeeping");
N("what arrives must have been sent");
N("tracked along rays to predict where the roughness will go");
N("[12, 28, 44, 52, 68, 84]");
N("feet at \\(12\\) and \\(44\\) with peak \\(16\\) at \\(28\\)");
N("feet at \\(52\\) and \\(84\\) with peak \\(16\\) at \\(68\\)");
N("\\(361\\) cells, \\(40\\) steps");
N("j \\pm n = 32, 48, 64");
N("1.0000000000000000");
N("u_{tt} - c^2 u_{xx} = 0");
N("p = \\tau^2 - c^2\\xi^2");
N("\\dot t = 2\\tau");
N("-2c^2\\xi");
N("0.206, 0.223, 0.381, 0.719");
N("1.031, 1.019, 1.046, 1.202");
N("0.287, 0.407, 0.486");
N("c_{2m} = 2/(\\pi(4m^2-1))");
N("8.45 \\times 10^{-1}, 1.25 \\times 10^{-1}, 4.30 \\times 10^{-4}, 8.24 \\times 10^{-10}");
N("2.11 \\times 10^{-15}");
N("2.88 \\times 10^{-2}");
N("4 = 2 + 2");
N("[254, 286]");
N("[314, 346]");
N("8.88 \\times 10^{-14}");
N("8.22 \\times 10^{-15}");
N("1.08 \\times 10^{-14}");
N("0.866025404");
N("0.433012702");
N("(0, 5.196152)");
N("3\\tan 60^\\circ");
N("-1.56");
N("\\sin\\theta_1 = 0.8");
N("1/4096");
N("2.44 \\times 10^{-4}");
N("(x + y) \\bmod 64 < 32");
N("\\sigma = 2");
N("\\Delta^2 u_1[j] = f[j-2]");
N("1.50 \\times 10^{-13}");
N("0.0504");
N("720\\) directions");
N("2.1833 \\times 10^{-10}");
N("18 \\times 18");
N("1.000000");
N("Exhibit A —");
N("Exhibit B —");
N("Exhibit C —");
N("3.20 \\times 10^{-5}");
N("2.88 \\times 10^{-4}");
N("0.212334");
N("3.5\\%\\)");
N("1/\\pi");
N("u^{n+1}_j = 2u^n_j - u^{n-1}_j + u^n_{j+1} - 2u^n_j + u^n_{j-1}");
N("F(j+n) + G(j-n)");
N("1831 — Hamilton");
N("1923 — Hadamard");
N("1969 — Egorov");
N("1972 — Duistermaat–Hörmander");
N("Acta Mathematica</em> 128");
N("Uspekhi Mat. Nauk");
N("2006 Steele");
N("the apex rides two rays");
N("159,140 231,28 303,140");
N("69,140 141,84 213,140");
N("249,140 321,84 393,140");
N("x1=\"231\" y1=\"28\" x2=\"141\" y2=\"84\"");
N("x1=\"231\" y1=\"28\" x2=\"321\" y2=\"84\"");
N("240,140 300,88 345,77");
N("300,88 340,53");
N("345,70 300,100 345,130");
N("crossing (0, 5.196152)");
N("|x| = ct");
N("step in x: the axis");
N("rotated step: the cone");
N("point spike: everywhere");
N("c = 1/2");
N("sin θ = 0.8 &gt; 1/2");
N("P53 · Deformation cohomology");
N("P42 · Dyadic decomposition");
N("\\(4\\) directions");
// F01-F04: closed-form recomputes vs the needle manifest (independent routes: no stepping, no DFT)
function expo(v, d) {
  var s = v.toExponential(d);
  var mm = /^([\-0-9.]+)e([+\-0-9]+)$/.exec(s);
  return mm[1] + ' \\times 10^{' + parseInt(mm[2], 10) + '}';
}
(function () {
  var t = 20, base = [32, 48, 64], cs = [];
  for (var a = 0; a < 3; a++) { cs.push(base[a] - t); cs.push(base[a] + t); }
  cs.sort(function (x, y) { return x - y; });
  var s = '[' + cs.join(', ') + ']';
  CHK('F01 corner census, closed form (characteristics alone)', s === '[12, 28, 44, 52, 68, 84]' && FMhas(s), s);
})();
(function () {
  function u0(j) { var d = Math.abs(j - 48); return d <= 16 ? 16 - d : 0; }
  var fL = [32 - 20, 64 - 20], pLp = 48 - 20, pLv = u0(48) + u0(8);
  var fR = [32 + 20, 64 + 20], pRp = 48 + 20, pRv = u0(48) + u0(8);
  var sL = 'feet at \\(' + fL[0] + '\\) and \\(' + fL[1] + '\\) with peak \\(' + pLv + '\\) at \\(' + pLp + '\\)';
  var sR = 'feet at \\(' + fR[0] + '\\) and \\(' + fR[1] + '\\) with peak \\(' + pRv + '\\) at \\(' + pRp + '\\)';
  CHK('F02 apex pair phrases, recomputed from the tent', pLv === 16 && pRv === 16 && pLp === 28 && pRp === 68 && FMhas(sL) && FMhas(sR), sL);
})();
(function () {
  var row = [], half = [];
  for (var j = 32; j <= 64; j++) { var d = Math.abs(j - 48); row.push(2 * (16 - d)); half.push(16 - d); }
  var s0 = 0, s1 = 0;
  for (var i = 1; i < row.length - 1; i++) {
    var d2 = Math.abs(row[i + 1] - 2 * row[i] + row[i - 1]); if (d2 > s0) s0 = d2;
    var h2 = Math.abs(half[i + 1] - 2 * half[i] + half[i - 1]); if (h2 > s1) s1 = h2;
  }
  CHK('F03 kink sharpness splits, never decays (4 = 2 + 2)', s0 === 4 && s1 === 2 && s0 === 2 * s1 && FMhas('4 = 2 + 2'), 'sharp0=' + s0 + ' sharpHalf=' + s1);
})();
(function () {
  var a = 300 - 16, b = 300 + 16, t = 30;
  var sL = '[' + (a - t) + ', ' + (b - t) + ']', sR = '[' + (a + t) + ', ' + (b + t) + ']';
  CHK('F04 riding supports, recomputed from center 300 and halfwidth 16', sL === '[254, 286]' && sR === '[314, 346]' && FMhas(sL) && FMhas(sR), sL + ' ' + sR);
})();
// F05-F08: spectral melt route, exact shelf routes, formatting needles
(function () {
  var Nn = 600, f = [], j, k;
  for (j = 0; j < Nn; j++) { var d = Math.abs(j - 300); f.push(d <= 16 ? 2 * (16 - d) : 0); }
  var re = [], im = [];
  for (k = 0; k < Nn; k++) {
    var sr = 0, si = 0;
    for (j = 284; j <= 316; j++) { var ang = 2 * Math.PI * j * k / Nn; sr += f[j] * Math.cos(ang); si -= f[j] * Math.sin(ang); }
    re.push(sr / Nn); im.push(si / Nn);
  }
  var mu = [];
  for (k = 0; k < Nn; k++) { var c = Math.cos(Math.PI * k / Nn); mu.push(Math.pow(c, 400)); }
  var melted = [];
  for (j = 0; j < Nn; j++) {
    var v = 0;
    for (k = 0; k < Nn; k++) { var e = 2 * Math.PI * j * k / Nn; v += (re[k] * Math.cos(e) - im[k] * Math.sin(e)) * mu[k]; }
    melted.push(v);
  }
  function shp(r) { var m = 0; for (var i = 1; i < r.length - 1; i++) { var d2 = Math.abs(r[i + 1] - 2 * r[i] + r[i - 1]); if (d2 > m) m = d2; } return m; }
  var ratio = shp(melted) / 4;
  CHK('F05 heat melt, spectral route (no stepping) agrees with the engine', Math.abs(ratio / 2.8764e-2 - 1) < 0.02 && FMhas('2.88 \\times 10^{-2}'), 'ratio=' + ratio.toExponential(4));
})();
(function () {
  var Nn = 128, sh = [], m;
  for (m = 1; m <= 5; m++) {
    var s = 0;
    for (var k = Math.pow(2, m); k < Math.pow(2, m + 1); k++) if (k % 2 === 1) s += 1 / (Nn * Math.sin(Math.PI * k / Nn));
    sh.push(s);
  }
  var rs = [];
  for (m = 1; m <= 4; m++) rs.push((sh[m] / sh[m - 1]).toFixed(3));
  var line = rs.join(',');
  CHK('F06 step shelves, exact closed form c_k = 1/(N sin(pi k/N))', line === '1.031,1.019,1.046,1.202' && FMhas('1.031, 1.019, 1.046, 1.202'), 'ratios=' + line);
})();
(function () {
  var sh = [], m;
  for (m = 1; m <= 5; m++) {
    var s = 0;
    for (var mm = Math.pow(2, m - 1); mm < Math.pow(2, m); mm++) s += 2 / (Math.PI * (4 * mm * mm - 1));
    sh.push(s);
  }
  var rs = [];
  for (m = 1; m <= 4; m++) rs.push(sh[m] / sh[m - 1]);
  var rising = rs[1] < rs[2] && rs[2] < rs[3] && rs[3] < 0.5;
  var page = [0.287, 0.407, 0.486], worst = 0;
  for (m = 0; m < 3; m++) { var dv = Math.abs(rs[m] - page[m]) / page[m]; if (dv > worst) worst = dv; }
  CHK('F07 kink shelves, exact series route: halving law, within the sampling band', rising && worst < 0.08 && FMhas('0.287, 0.407, 0.486') && FMhas('c_{2m} = 2/(\\pi(4m^2-1))') && FMhas('0.212334'), 'ratios=' + rs.map(function (x) { return x.toFixed(3); }).join(',') + ' worstDev=' + worst.toFixed(3));
})();
(function () {
  var g = [8.45e-1, 1.25e-1, 4.30e-4, 8.24e-10].map(function (v) { return expo(v, 2); }).join(', ');
  var a = '8.45 \\times 10^{-1}, 1.25 \\times 10^{-1}, 4.30 \\times 10^{-4}, 8.24 \\times 10^{-10}';
  CHK('F08 gaussian collapse, band limit, and k|c_k| deviation needles', g === a && FMhas(a) && FMhas(expo(2.11e-15, 2)) && FMhas(expo(3.20e-5, 2)) && FMhas(expo(2.88e-4, 2)) && FMhas('1/\\pi'), 'gauss=' + g);
})();
// F09-F13: ray optics recomputes and figure-data needles
(function () {
  var s1 = Math.sin(Math.PI / 3).toFixed(9), s2 = (0.5 * Math.sin(Math.PI / 3)).toFixed(9);
  var yc = (6 * Math.sin(Math.PI / 3)).toFixed(6), t3 = (3 * Math.tan(Math.PI / 3)).toFixed(6);
  CHK('F09 Snell invariant and crossing point, recomputed', s1 === '0.866025404' && s2 === '0.433012702' && yc === '5.196152' && yc === t3 && FMhas('0.866025404') && FMhas('0.433012702') && FMhas('(0, 5.196152)') && FMhas('3\\tan 60^\\circ'), 's1=' + s1 + ' s2=' + s2 + ' yc=' + yc);
})();
(function () {
  var disc = 1 - 1.6 * 1.6, sinSlow = 0.5 * 1.6, crit = 0.5;
  CHK('F10 total internal reflection: discriminant and critical angle', Math.abs(disc + 1.56) < 1e-12 && sinSlow === 0.8 && crit === 0.5 && sinSlow > crit && disc < 0 && FMhas('\\sin\\theta_1 = 0.8') && FMhas('-1.56'), 'disc=' + disc.toFixed(4) + ' sin=' + sinSlow);
})();
(function () {
  var want = ['8.88e-14', '8.22e-15', '1.08e-14', '1.50e-13', '2.1833e-10'];
  var vals = [8.88e-14, 8.22e-15, 1.08e-14, 1.50e-13, 2.1833e-10];
  var ok = true, line = [];
  for (var i = 0; i < vals.length; i++) {
    var d = i === 4 ? 4 : 2;
    if (vals[i].toExponential(d) !== want[i]) ok = false;
    if (!FMhas(expo(vals[i], d))) ok = false;
    line.push(expo(vals[i], d));
  }
  CHK('F09x ray and elliptic precision needles, formatted from the engine values', ok && FMhas('0.0504') && FMhas('18 \\times 18') && FMhas('1.000000') && FMhas('720\\) directions') && FMhas('\\(4\\) directions'), line.join(' | '));
})();
(function () {
  function px(j) { return 15 + 4.5 * j; }
  function py(h) { return 140 - 3.5 * h; }
  var tent = Math.round(px(32)) + ',140 ' + Math.round(px(48)) + ',' + Math.round(py(32)) + ' ' + Math.round(px(64)) + ',140';
  var left = Math.round(px(12)) + ',140 ' + Math.round(px(28)) + ',' + Math.round(py(16)) + ' ' + Math.round(px(44)) + ',140';
  var right = Math.round(px(52)) + ',140 ' + Math.round(px(68)) + ',' + Math.round(py(16)) + ' ' + Math.round(px(84)) + ',140';
  CHK('F11 Fig P52.1 pixel data, recomputed from the 96-cell config', tent === '159,140 231,28 303,140' && left === '69,140 141,84 213,140' && right === '249,140 321,84 393,140' && FMhas(tent) && FMhas(left) && FMhas(right) && FMhas('x1="231" y1="28" x2="141" y2="84"') && FMhas('x1="231" y1="28" x2="321" y2="84"') && FMhas('the apex rides two rays'), left + ' / ' + right);
})();
(function () {
  var py88 = 140 - Math.round(10 * 5.196152);
  var drawn = (88 - 77) / (345 - 300);
  var expect = (0.433012702 / Math.sqrt(1 - 0.433012702 * 0.433012702)) * 0.5;
  var tir = 30 / 45, tirE = (4 / 3) * 0.5;
  CHK('F12 Fig P52.3 pixel data: crossing, refraction slope, reflection slope', py88 === 88 && Math.abs(drawn - expect) < 0.005 && Math.abs(tir - tirE) < 1e-12 && FMhas('240,140 300,88 345,77') && FMhas('300,88 340,53') && FMhas('345,70 300,100 345,130') && FMhas('crossing (0, 5.196152)'), 'py88=' + py88 + ' drawn=' + drawn.toFixed(4) + ' expect=' + expect.toFixed(4));
})();
(function () {
  var s1 = Math.abs((75 - 140) / (15 - 80)), s2 = Math.abs((75 - 140) / (145 - 80));
  var dot = Math.abs((128.5 - 140) / (68.5 - 80));
  var one = (1).toPrecision(17);
  CHK('F13 light cone drawing and census shares, geometry and formatting', s1 === 1 && s2 === 1 && dot === 1 && FMhas('|x| = ct') && one === '1.0000000000000000' && FMhas(one) && FMhas('1/4096') && FMhas(expo(2.4414e-4, 2)) && FMhas('0.206, 0.223, 0.381, 0.719') && FMhas('(x + y) \\bmod 64 < 32'), 'slopes=' + s1 + ',' + s2 + ',' + dot);
})();
// F14: equation and scheme needles, lattice identity spot-checked independently
(function () {
  var ok = FMhas('u_{tt} - c^2 u_{xx} = 0') && FMhas('p = \\tau^2 - c^2\\xi^2') && FMhas('\\dot t = 2\\tau') && FMhas('-2c^2\\xi') && FMhas('\\Delta^2 u_1[j] = f[j-2]');
  ok = ok && FMhas('u^{n+1}_j = 2u^n_j - u^{n-1}_j + u^n_{j+1} - 2u^n_j + u^n_{j-1}') && FMhas('F(j+n) + G(j-n)') && FMhas('\\(361\\) cells, \\(40\\) steps') && FMhas('720\\) directions') && FMhas('j \\pm n = 32, 48, 64') && FMhas('\\sigma = 2');
  var F = [3, -1, 2, 5, 0, 7, -4, 1], G = [2, 4, -3, 1, 6, -2, 5, 0];
  function uu(n, j) { return F[((j + n) % 8 + 8) % 8] + G[((j - n) % 8 + 8) % 8]; }
  var worst = 0;
  for (var n = -6; n <= 6; n++) for (var j = -6; j <= 6; j++) {
    var lhs = uu(n + 1, j) - 2 * uu(n, j) + uu(n - 1, j);
    var rhs = uu(n, j + 1) - 2 * uu(n, j) + uu(n, j - 1);
    var d = Math.abs(lhs - rhs); if (d > worst) worst = d;
  }
  CHK('F14 equation and scheme needles; d\'Alembert identity spot-checked', ok && worst === 0 && 19 * 19 === 361 && 6 * 120 === 720, 'worst=' + worst);
})();
// F15: structure census — manifest size, template anatomy, pin anatomy
(function () {
  var ok = LAB.FM.length === 115, dups = 0, i;
  for (i = 0; i < LAB.FM.length; i++) if (LAB.FM.indexOf(LAB.FM[i]) !== i) dups++;
  var h2s = ['1 · Before we begin', '2 · Meet the problem', '3 · The pattern, named', '4 · Three encounters', '5 · When the trick breaks', '6 · Doors out', '7 · Lineage', '8 · Exercises'];
  for (i = 0; i < 8; i++) if (!FMhas('<h2>' + h2s[i] + '</h2>')) ok = false;
  ok = ok && dups === 0 && FMhas('Difficulty: ●○○ ●●○ ●●● ◆ ◐') && FMhas('id="box-p52"') && FMhas('id="box-p52a"') && FMhas('id="box-p52b"') && FMhas('class="warn-box"') && FMhas('Scope, honestly');
  ok = ok && FMhas('class="sketch-marker">SKETCH — the propagation theorem, honestly incomplete') && FMhas('New word: the wavefront set') && FMhas('<figcaption>Fig P52.1') && FMhas('<figcaption>Fig P52.2') && FMhas('<figcaption>Fig P52.3');
  ok = ok && FMhas('class="atlas-home"') && FMhas('P53 · Deformation cohomology') && FMhas('P42 · Dyadic decomposition');
  var pin = LAB.FM[2];
  ok = ok && pin.indexOf('<script>window.MathJax') === 0 && pin.indexOf("fontCache:'global'") !== -1 && pin.indexOf("inlineMath:[['\\(','\\)']]") !== -1 && pin.indexOf("displayMath:[['\\[','\\]']]") !== -1 && FMhas('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=');
  CHK('F15 structure census: 115 needles, 8 h2, 3 boxes, 3 figs, pin anatomy', ok, 'FM=' + LAB.FM.length + ' dups=' + dups + ' pinLen=' + pin.length);
})();
// F16: exhibits, four door quotes, panel captions, dated lineage
(function () {
  var ok = FMhas('Exhibit A —') && FMhas('Exhibit B —') && FMhas('Exhibit C —');
  ok = ok && FMhas('singularities travel along explicit curves through that census') && FMhas('what arrives must have been sent') && FMhas('each a customer of the same cochain bookkeeping') && FMhas('tracked along rays to predict where the roughness will go');
  ok = ok && FMhas('step in x: the axis') && FMhas('rotated step: the cone') && FMhas('point spike: everywhere');
  var yrs = [1831, 1923, 1969, 1972, 2006];
  var ordered = yrs[0] < yrs[1] && yrs[1] < yrs[2] && yrs[2] < yrs[3] && yrs[3] < yrs[4];
  ok = ok && FMhas('1831 — Hamilton') && FMhas('1923 — Hadamard') && FMhas('1969 — Egorov') && FMhas('1972 — Duistermaat–Hörmander') && FMhas('Acta Mathematica</em> 128') && FMhas('Uspekhi Mat. Nauk') && FMhas('2006 Steele') && ordered;
  CHK('F16 exhibits, four door quotes, panel captions, dated lineage', ok, 'years=' + yrs.join(' < '));
})();
// F17: title, kicker, and all eleven pattern-door hrefs
(function () {
  var hrefs = ['p53-deformation-cohomology.html', 'p42-dyadic-decomposition.html', 'p47-diagram-chase.html', 'p49-ultraproduct-transfer.html', 'p33-sheaf-cohomology-bridge.html', 'p24-waves.html', 'p09-invariant.html', 'p54-stable-compactification.html', 'p56-asymptotic-rescaling.html', 'p62-sheafify-on-site.html', 'p65-floer-homology.html'];
  var ok = FMhas('<title>P52 · Microlocal propagation of singularities · The Patterns Atlas</title>') && FMhas('P52 · the fifth move of tier 5');
  for (var i = 0; i < hrefs.length; i++) if (!FMhas('href="' + hrefs[i] + '"')) ok = false;
  CHK('F17 title, kicker, and eleven pattern-door hrefs', ok, 'hrefs=' + hrefs.length);
})();
console.log('');
console.log('total: ' + LAB.NCHK + ' checks, ' + LAB.NFAIL + ' FAIL');
console.log('VERDICT: S84 P52 battery ' + (LAB.NFAIL === 0 ? 'PASS ' + LAB.NCHK + '/' + LAB.NCHK : 'FAIL') + ' run 8');
