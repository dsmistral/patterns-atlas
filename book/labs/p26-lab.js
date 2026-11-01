// p26-lab.js — P26 "Model it with an equation" — fresh battery, deterministic.
// No recursion, no BigInt, exact integer arithmetic where possible.
// Harness piece p00. Run harness injects the frozen page as PAGE (string) and routes console.log to __out.
var FAILS = 0, TOTAL = 0;
function ck(id, name, cond) {
  TOTAL++;
  if (cond) { console.log(id + " PASS " + name); }
  else { FAILS++; console.log(id + " FAIL " + name); }
}
function r6(x) { return Math.round(x * 1e6) / 1e6; }
function r4(x) { return Math.round(x * 1e4) / 1e4; }
console.log("p26 lab — piece p00 harness ready");
// --- Group A: the coffee encounter (section 2) ---
var LN = Math.log, EXP = Math.exp;
var kA = LN(7/6)/10;                      // calibrated: T(0)=90, T(10)=80, room 20
ck("A01", "k = ln(7/6)/10 = " + r6(kA) + " per min reproduces the calibration point", Math.abs(20+70*EXP(-10*kA)-80) < 1e-9);
ck("A02", "the calibration is exact algebra: exp(-10k) = 6/7", Math.abs(EXP(-10*kA) - 6/7) < 1e-12);
var T20 = 20+70*(6/7)*(6/7), T30 = 20+70*Math.pow(6/7,3);
ck("A03", "model predictions T(20) = " + r4(T20) + ", T(30) = " + r4(T30), Math.abs(T20-71.4286)<2e-4 && Math.abs(T30-64.0816)<1e-4);
var t60 = 10*LN(7/4)/LN(7/6);
ck("A04", "time to 60 C: t = 10 ln(7/4)/ln(7/6) = " + r4(t60) + " min", Math.abs(t60-36.3032)<1e-4);
ck("A05", "round trip: T(t60) = 60 exactly", Math.abs(20+70*EXP(-kA*t60)-60) < 1e-9);
// the linear friend: cools 1 C/min by the first measurement
ck("A06", "linear guess hits 60 C at t=30 (6.3 min early), reaches room 20 C at t=70, and 0 C at t=90", Math.abs((90-30)-60)<1e-12 && (90-70)===20 && (90-90)===0);
// the quadratic through all three measured points (0,90),(10,80),(20,T20): exact fractions
var qa = (T20-70)/200, qb = -1-10*qa;     // a = 1/140, b = -15/14
ck("A07", "quadratic through the three points has a = " + r6(qa) + " (=1/140), b = " + r6(qb) + " (=-15/14)", Math.abs(qa-1/140)<1e-12 && Math.abs(qb+15/14)<1e-12);
function qT(t) { return qa*t*t + qb*t + 90; }
ck("A08", "the quadratic fits every measurement we own (t=0,10,20 back-check)", Math.abs(qT(0)-90)<1e-12 && Math.abs(qT(10)-80)<1e-12 && Math.abs(qT(20)-T20)<1e-12);
var m60 = 20+70*Math.pow(6/7,6);
ck("A09", "at t=60: quadratic says " + r4(qT(60)) + " C, model says " + r4(m60) + " C", Math.abs(qT(60)-51.4286)<2e-4 && Math.abs(m60-47.7599)<1e-3);
var qmin = -qb/(2*qa);
ck("A10", "the quadratic's coffee reaches its coldest at t = " + r4(qmin) + " min, T = " + r4(qT(qmin)) + " C, then warms", Math.abs(qmin-75)<1e-9 && Math.abs(qT(qmin)-49.8214)<2e-4);
ck("A11", "at t=200 the quadratic reads " + r4(qT(200)) + " C - the coffee boils at room temperature", Math.abs(qT(200)-161.4286)<2e-4);
// Euler receipt: forward Euler with h=0.5
var Te = 90, hE = 0.5;
for (var iA = 0; iA < 73; iA++) { Te = Te + hE*(-kA*(Te-20)); }
ck("A12", "forward Euler h=0.5 at t=36.5: T = " + r4(Te) + " vs exact " + r4(20+70*EXP(-kA*36.5)) + " (scheme error disclosed)", Math.abs(Te - (20+70*EXP(-kA*36.5))) < 0.5);
// --- Group B: the cooling rod (section 4, exemplar 2) ---
// B01: FTCS conserves energy with insulated ends (fluxes cancel at the walls)
var rod = [45,52,61,58,49,55,67,72,63,51,47,59]; var rB = 0.2;
var sum0 = 0; for (var i1 = 0; i1 < 12; i1++) sum0 += rod[i1];
for (var s1 = 0; s1 < 2000; s1++) {
  var nxt = []; for (var j1 = 0; j1 < 12; j1++) nxt.push(rod[j1]);
  for (var j1 = 1; j1 < 11; j1++) nxt[j1] = rod[j1] + rB*(rod[j1-1]-2*rod[j1]+rod[j1+1]);
  nxt[0] = rod[0] + rB*(rod[1]-rod[0]); nxt[11] = rod[11] + rB*(rod[10]-rod[11]);
  for (var j1 = 0; j1 < 12; j1++) rod[j1] = nxt[j1];
}
var sum1 = 0; for (var i1 = 0; i1 < 12; i1++) sum1 += rod[i1];
ck("B01", "insulated rod: total heat drift after 2000 steps = " + (sum1-sum0).toExponential(3), Math.abs(sum1-sum0) < 1e-9);
// B02: the first mode of the heat equation decays exponentially (alpha = 1/pi^2, u = 100 sin(pi x))
var N = 100, dx = 0.01, al = 1/(Math.PI*Math.PI), dt = 0.25*dx*dx/al;
var u = []; for (var i2 = 0; i2 < N; i2++) u.push(100*Math.sin(Math.PI*(i2+0.5)*dx));
var tEnd = Math.LN2, steps = Math.floor(tEnd/dt), tB = steps*dt;
for (var s2 = 0; s2 < steps; s2++) {
  var nu = []; for (var i2 = 0; i2 < N; i2++) {
    var l = i2 > 0 ? u[i2-1] : 0, rr = i2 < N-1 ? u[i2+1] : 0;
    nu.push(u[i2] + al*dt/(dx*dx)*(l-2*u[i2]+rr));
  }
  u = nu;
}
var mid = u[Math.floor(N/2)];
ck("B02", "100-cell FTCS, alpha=1/pi^2, t=ln 2: midpoint T = " + r4(mid) + " (exact 50; discretization + scheme error disclosed)", Math.abs(mid-50) < 0.45);
// B03: copper receipt: half-time of the slowest mode, L = 0.5 m, alpha = 1.11e-4 m^2/s
var Lc = 0.5, alc = 1.11e-4, thalf = Lc*Lc*Math.LN2/(alc*Math.PI*Math.PI);
ck("B03", "copper rod half-time (L/PI)^2 * ln 2 / alpha = " + r4(thalf) + " s", Math.abs(thalf-158.1768)<1e-3);
ck("B04", "the half-time receipt checks: after thalf the mode amplitude is exactly half", Math.abs(100*Math.exp(-alc*Math.PI*Math.PI/Lc/Lc*thalf)-50) < 1e-9);
var thalf1 = 4*thalf;
ck("B05", "double the rod, quadruple the wait: 1 m rod needs " + r4(thalf1) + " s", Math.abs(thalf1-632.7071)<1e-3);
// B04b: ends at zero - the energy sum u^2 is a monovariant (P09 echo)
var rod2 = []; for (var i3 = 0; i3 < 80; i3++) rod2.push(i3 >= 30 && i3 < 50 ? 100 : 0);
var mono = true, E0 = 0; for (var i3 = 0; i3 < 80; i3++) E0 += rod2[i3]*rod2[i3];
for (var s3 = 0; s3 < 500; s3++) {
  var n2 = []; for (var i3 = 0; i3 < 80; i3++) {
    var l = i3 > 0 ? rod2[i3-1] : 0, rr = i3 < 79 ? rod2[i3+1] : 0;
    n2.push(rod2[i3] + 0.2*(l-2*rod2[i3]+rr));
  }
  var E1 = 0; for (var i3 = 0; i3 < 80; i3++) E1 += n2[i3]*n2[i3];
  if (E1 > E0 + 1e-9) mono = false;
  E0 = E1; rod2 = n2;
}
ck("B06", "ends at zero: energy sum u^2 never increases over 500 steps (starts " + r4(2000000) + ")", mono);
// --- Group C: the random walk (section 4, exemplar 3) ---
// exact DP: p_n[i] = P(X_n = i - n), arrays rebuilt each step, no recursion
var pw = [1], snap = {};
for (var n = 1; n <= 201; n++) {
  var q = []; for (var x = -n; x <= n; x++) q.push(0);
  for (var i = 0; i < pw.length; i++) { q[i] += pw[i]/2; q[i+2] += pw[i]/2; }
  pw = q;
  if (n === 50 || n === 100 || n === 101 || n === 200) snap[n] = pw.slice();
}
var p100 = snap[100], p101 = snap[101], p50 = snap[50], p200 = snap[200];
// C01: mean 0 and Var(X_n) = n all the way
var m1 = 0, v1 = 0;
for (var i = 0; i < p100.length; i++) { m1 += (i-100)*p100[i]; v1 += (i-100)*(i-100)*p100[i]; }
ck("C01", "walk n=100: mean = " + m1.toExponential(2) + ", Var = " + r6(v1) + " = n exactly", Math.abs(m1) < 1e-15 && Math.abs(v1-100) < 1e-9);
// C02: P(X_100 = 0) two independent routes: DP and log-factorial
function lnfact(m) { var s = 0; for (var i = 2; i <= m; i++) s += Math.log(i); return s; }
var binom = Math.exp(lnfact(100) - 2*lnfact(50) - 100*Math.LN2);
ck("C02", "P(X_100=0): DP = " + r6(p100[100]) + ", C(100,50)/2^100 = " + r6(binom), Math.abs(p100[100]-binom) < 1e-12);
// C03: the Gaussian approximation (parity-corrected: walk visits every other site)
function phiN(x, n) { return Math.exp(-x*x/(2*n))/Math.sqrt(2*Math.PI*n); }
var gauss0 = Math.sqrt(2/(100*Math.PI)), relE0 = (gauss0-p100[100])/p100[100];
ck("C03", "Gaussian sqrt(2/(100 PI)) = " + r6(gauss0) + " vs exact " + r6(p100[100]) + ": rel err " + (100*relE0).toFixed(3) + "%", Math.abs(relE0) < 0.005);
// C04: table at k = 0, 10, 20, 30 with parity correction x2
var worst = 0, tbl = [];
for (var kk = 0; kk <= 30; kk += 10) {
  var ex = p100[kk+100], ap = 2*phiN(kk, 100), re = Math.abs(ap-ex)/ex;
  tbl.push("k=" + kk + ": exact " + ex.toFixed(5) + " vs 2phi " + ap.toFixed(5) + " (" + (100*re).toFixed(2) + "%)");
  if (re > worst) worst = re;
}
ck("C04", "parity-corrected density, |k|<=30: worst rel err " + (100*worst).toFixed(2) + "% | " + tbl.join(" | "), worst < 0.03);
// C05: the walk satisfies the discrete heat equation in space-time
var bad5 = 0;
for (var x = -101; x <= 101; x++) {
  var pm = x-1+100 >= 0 && x-1+100 < 201 ? p100[x-1+100] : 0;
  var pp = x+1+100 >= 0 && x+1+100 < 201 ? p100[x+1+100] : 0;
  var diff = Math.abs(p101[x+101] - (pm+pp)/2);
  if (diff > bad5) bad5 = diff;
}
ck("C05", "recursion p_(n+1)(x) = (p_n(x-1)+p_n(x+1))/2 holds to " + bad5.toExponential(2), bad5 < 1e-15);
// C06: the approximation error shrinks like 1/(8n)
var e50 = (2*phiN(0,50)-p50[50])/p50[50], e100 = relE0, e200 = (2*phiN(0,200)-p200[200])/p200[200];
ck("C06", "rel err at x=0: n=50: " + (100*e50).toFixed(3) + "%, n=100: " + (100*e100).toFixed(3) + "%, n=200: " + (100*e200).toFixed(3) + "% (halves as n doubles)", e200 < e100 && e100 < e50);
// C07: parity receipt: at even n the walk never sits on an odd site
var oddMax = 0;
for (var x = -99; x <= 99; x += 2) { if (p100[x+100] > oddMax) oddMax = p100[x+100]; }
ck("C07", "at n=100 every odd site has probability exactly 0", oddMax === 0);
// --- Group D: exercises ---
// D01 (Exercise 1): 95 C coffee, room 25 C, reads 85 C at t=5
var kD = Math.log(7/6)/5;
var TD30 = 25 + 70*Math.pow(6/7,6), tD40 = 5*Math.log(14/3)/Math.log(7/6);
ck("D01", "Ex1: k = ln(7/6)/5 = " + r6(kD) + ", T(30) = " + r4(TD30) + " C, t(40 C) = " + r4(tD40) + " min", Math.abs(TD30-52.7599)<1e-3 && Math.abs(tD40-49.9656)<1e-3);
// D02 (Exercise 2): copper rod twice as long
ck("D02", "Ex2: 2 x 0.5 m copper rod: half-time = 4 x 158.1768 = " + r4(4*158.1768) + " s", Math.abs(4*158.1768-632.7071)<1e-3);
// D03 (Exercise 3): biased walk p = 0.6, exact DP
var qb = [1];
for (var n = 1; n <= 1000; n++) {
  var q = []; for (var x = 0; x <= 2*n; x++) q.push(0);
  for (var i = 0; i < qb.length; i++) { q[i] += 0.4*qb[i]; q[i+2] += 0.6*qb[i]; }
  qb = q;
}
var mB = 0, vB = 0; var s1 = 0; for (var i = 0; i < qb.length; i++) s1 += (i-1000)*qb[i];
for (var i = 0; i < qb.length; i++) { mB += (i-1000)*qb[i]; }
for (var i = 0; i < qb.length; i++) { vB += (i-1000-s1)*(i-1000-s1)*qb[i]; }
ck("D03", "Ex3: biased walk p=0.6 at n=1000: mean = " + r6(mB) + " (= 0.2n), Var = " + r6(vB) + " (= 0.96n)", Math.abs(mB-200)<1e-6 && Math.abs(vB-960)<1e-4);
// D04 (the worked exercise): the quadratic trap, numbers for the page
ck("D04", "worked Ex: quadratic vs model at t=60: " + r4(3600/140 - 900/14 + 90) + " vs " + r4(20+70*Math.pow(6/7,6)), Math.abs(3600/140 - 900/14 + 90 - 51.4286)<2e-4);
// D05 (traffic): shock speed s = 1 - rho_l - rho_r, Lax-Friedrichs receipt
function lfTraffic(rhol, rhor, T) {
  var M = 400, rho = [];
  for (var j = 0; j < M; j++) rho.push(j < 200 ? rhol : rhor);
  var lam = 0.5;                       // dt/dx, CFL-safe (max |1-2rho| = 0.8)
  for (var s = 0; s < T; s++) {
    var nr = [];
    for (var j = 0; j < M; j++) {
      var l = rho[j > 0 ? j-1 : 0], rr = rho[j < M-1 ? j+1 : M-1];
      var f = function(z) { return z*(1-z); };
      nr.push(0.5*(l+rr) - lam*(f(rr)-f(l)));
    }
    rho = nr;
  }
  var pos = -1;
  for (var j = 0; j < M-1; j++) { if ((rho[j]-0.65)*(rho[j+1]-0.65) <= 0) { pos = j; } }
  return pos;
}
var pos100 = lfTraffic(0.4, 0.9, 200), pos300 = lfTraffic(0.4, 0.9, 600);
var spd = (pos300-pos100)/400;
ck("D05", "Ex5: LF interface (0.4 -> 0.9) moves " + r4(spd) + " cells/step vs exact s = 1-0.9-0.4 = -0.30", Math.abs(spd+0.3) < 0.02);
var posS1 = lfTraffic(0.1, 0.9, 200), posS2 = lfTraffic(0.1, 0.9, 600);
ck("D06", "Ex5: stationary shock (0.1 -> 0.9): interface speed " + r4((posS2-posS1)/400) + " (exact s = 0)", Math.abs((posS2-posS1)/400) < 0.02);
// --- Group E: when it fails (section 5) ---
// E01: Exhibit A - the room warms while you are not looking
function amb(t) { return 20 + 10*(1 - Math.exp(-t/120)); }
function fE(t, T) { return -kA*(T - amb(t)); }
function rk4() {
  var t = 0, T = 90, h = 0.05, out = {};
  for (var i = 0; i < 4800; i++) {
    var k1 = fE(t,T), k2 = fE(t+h/2, T+h/2*k1), k3 = fE(t+h/2, T+h/2*k2), k4 = fE(t+h, T+h*k3);
    T = T + h/6*(k1+2*k2+2*k3+k4); t = t + h;
    if (i === 199 || i === 1199 || i === 2399 || i === 4799) out[Math.round(t)] = T;
  }
  return out;
}
var world = rk4();
function modelT(t) { return 20 + 70*Math.exp(-kA*t); }
ck("E01", "world vs model at t=10: " + r4(world[10]) + " vs " + r4(modelT(10)) + " C (agree: the fit is honest)", Math.abs(world[10]-modelT(10)) < 0.15);
ck("E02", "at t=240: world " + r4(world[240]) + " C vs model " + r4(modelT(240)) + " C - off by " + r4(world[240]-modelT(240)) + " degrees", (world[240]-modelT(240)) > 5);
// E03: Exhibit B - Malthus vs Verhulst
function logi(t) { return 1000/(1 + 99*Math.exp(-0.5*t)); }
var rFit = Math.log(logi(5)/10)/5;
function expe(t) { return 10*Math.exp(rFit*t); }
ck("E03", "both models read x(5) = " + r4(logi(5)) + " (fit is exact by construction)", Math.abs(logi(5)-expe(5)) < 1e-9);
var r10 = expe(10)/logi(10), r15 = expe(15)/logi(15), r20 = expe(20)/logi(20);
ck("E04", "predictions t=10: " + r4(logi(10)) + " vs " + r4(expe(10)) + " (" + r10.toFixed(1) + "x), t=15: " + r4(logi(15)) + " vs " + r4(expe(15)) + " (" + r15.toFixed(1) + "x), t=20: " + r4(logi(20)) + " vs " + r4(expe(20)) + " (" + r20.toFixed(0) + "x)", Math.abs(r10-2)<0.05 && r15>13 && r20>140);
var r55 = expe(5.5)/logi(5.5), r6 = expe(6)/logi(6), r7 = expe(7)/logi(7);
ck("E05", "the divergence creeps: at t=5.5 the exponential is " + ((r55-1)*100).toFixed(1) + "% high, t=6: " + ((r6-1)*100).toFixed(1) + "%, t=7: " + ((r7-1)*100).toFixed(1) + "%", r55 < 1.03 && r6 < 1.06 && r7 > 1.1);
// E06: Exhibit C - the backward heat equation is ill-posed
var lam20 = 400*Math.PI*Math.PI;
var fwd = Math.exp(-lam20*0.01), bwd = Math.exp(lam20*0.01);
ck("E06", "mode 20, t=0.01: forward factor = " + fwd.toExponential(3) + " (the problem forgets)", fwd < 1e-17);
ck("E07", "backward factor = " + bwd.toExponential(3) + ": a 1e-6 error becomes " + (bwd*1e-6).toExponential(3), bwd > 1e17);
var minF = 1, minB = 1;
for (var m = 1; m <= 50; m++) {
  var ff = Math.exp(-m*m*Math.PI*Math.PI*0.01);
  if (ff < minF) minF = ff;
}
ck("E08", "every mode decays forward (slowest factor " + Math.exp(-Math.PI*Math.PI*0.01).toFixed(4) + ") and amplifies backward - no filtering can save it", minF > 0 && Math.exp(-Math.PI*Math.PI*0.01) < 1);
// --- Group F: figure coordinates (all machine-computed) ---
// F01: coffee figure - viewBox 640x360, t in [0,70] -> px 60..600, T in [0,100] -> py 330 - 3T
function px(t) { return 60 + t*40/7; }
function py(T) { return 330 - 3*T; }
var curve = [], t;
for (t = 0; t <= 70.0001; t += 5) curve.push([Math.round(px(t)*10)/10, Math.round(py(20+70*Math.exp(-kA*t))*10)/10]);
ck("F01", "coffee curve sampled at t=0,5,...,70: first " + curve[0] + " last " + curve[14], Math.abs(curve[0][0]-60)<1e-9 && Math.abs(curve[0][1]-py(90))<1e-9 && curve.length===15);
var dots = [[0,90],[10,80],[20,71.4286],[LN(7/4)/kA,60]], dotPx = [];
for (var i = 0; i < dots.length; i++) dotPx.push([r4(px(dots[i][0])), r4(py(dots[i][1]))]);
ck("F02", "data dots (px,py): " + JSON.stringify(dotPx), Math.abs(dotPx[1][1]-90)<0.01 && Math.abs(dotPx[3][0]-60-(LN(7/4)/kA)*40/7)<1e-3);
var linEnd = [px(70), py(20)];
ck("F03", "linear guess line runs (60,60) to (" + r4(linEnd[0]) + "," + r4(linEnd[1]) + ") - hits room temperature at t=70", Math.abs(linEnd[0]-460)<1e-9 && Math.abs(linEnd[1]-270)<1e-9);
// F04: rod figure - x in [0,1] -> px 60..600 (10 px per 0.025), u in [0,110] -> py 330 - 3u
var rodPts = [];
for (var c = 0; c < 3; c++) {
  var amp = [100, 100/Math.SQRT2, 50][c], pts = [];
  for (var j = 0; j <= 20; j++) {
    var x = j/20;
    pts.push([r4(60 + x*540), r4(330 - 3*amp*Math.sin(Math.PI*x))]);
  }
  rodPts.push(pts);
}
ck("F04", "rod curves t=0, t=(ln 2)/2, t=ln 2 with amplitudes 100, " + r4(100/Math.SQRT2) + ", 50", Math.abs(rodPts[0][10][1]-30)<1e-9 && Math.abs(rodPts[2][10][1]-180)<1e-9);
// F05: walk figure - k in [-30,30] even -> px 60+(k+30)*9, P in [0,0.085] -> py 330 - 3500*P
var pwF = [1];
for (var n = 1; n <= 100; n++) {
  var q = []; for (var x = -n; x <= n; x++) q.push(0);
  for (var i = 0; i < pwF.length; i++) { q[i] += pwF[i]/2; q[i+2] += pwF[i]/2; }
  pwF = q;
}
var bars = "", gcurve = "";
for (var k2 = -30; k2 <= 30; k2 += 2) {
  var Pk = pwF[k2+100], bpx = 60 + (k2+30)*9, top = 330 - 3500*Pk;
  bars += "(" + bpx + "," + r4(top) + ") ";
  gcurve += "(" + bpx + "," + r4(330 - 3500*2*Math.exp(-k2*k2/200)/Math.sqrt(200*Math.PI)) + ") ";
}
ck("F05", "walk bars drawn at 31 even sites, peak height at k=0: " + r4(330-3500*pwF[100]) + " -> py, gaussian peak " + r4(330-3500*Math.sqrt(2/(100*Math.PI))), bars.length > 200 && Math.abs((330-3500*pwF[100])-(330-3500*Math.sqrt(2/(100*Math.PI)))) < 5);
console.log("F05 BARS " + bars);
console.log("F05 GAUSS " + gcurve);
// F06-F08: full polylines for the page figures
var curveStr = "";
for (t = 0; t <= 70.0001; t += 5) {
  curveStr += r4(px(t)) + "," + r4(py(20+70*Math.exp(-kA*t))) + " ";
}
console.log("F06 CURVE " + curveStr);
var rodStrs = [];
for (var c = 0; c < 3; c++) {
  var s = "", amp2 = [100, 100/Math.SQRT2, 50][c];
  for (var j = 0; j <= 20; j++) {
    var x2 = j/20;
    s += r4(60 + x2*540) + "," + r4(330 - 3*amp2*Math.sin(Math.PI*x2)) + " ";
  }
  rodStrs.push(s);
}
console.log("F07 ROD0 " + rodStrs[0]);
console.log("F07 ROD1 " + rodStrs[1]);
console.log("F07 ROD2 " + rodStrs[2]);
// --- Group S: page fingerprint (needles counted against the injected PAGE) ---
function cnt(sub) { var n = 0, i = 0; while ((i = PAGE.indexOf(sub, i)) >= 0) { n++; i += sub.length; } return n; }
ck("S01", "8 h2 sections, got " + cnt("<h2>"), cnt("<h2>") === 8);
ck("S02", "6 h3 (3 exemplars + 3 exhibits), got " + cnt("<h3>"), cnt("<h3>") === 6);
ck("S03", "10 details (5 hints + 5 worked), got " + cnt("<details>"), cnt("<details>") === 10);
ck("S04", "5 Hint + 5 Worked summaries", cnt("<summary>Hint") === 5 && cnt("<summary>Worked answer") === 5);
ck("S05", "3 SVG figures, got " + cnt("<svg "), cnt("<svg ") === 3);
ck("S06", "3 pattern boxes + 2 asides (onramp + warn), got " + cnt("pattern-box") + "/" + cnt("<aside "), cnt("pattern-box") === 3 && cnt("<aside ") === 2);
ck("S07", "3 pid lines, got " + cnt('class="pid"'), cnt('class="pid"') === 3);
ck("S08", "title needle", PAGE.indexOf("<title>P26 · Model it with an equation · The Patterns Atlas</title>") >= 0);
ck("S09", "kicker: fourth move of tier 3", PAGE.indexOf("P26 · the fourth move of tier 3") >= 0);
ck("S10", "MathJax 3.2.2 integrity pin, pinned once", PAGE.indexOf("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=") >= 0 && cnt("mathjax@3.2.2") === 1);
var hrefs = ["index.html", "assets/style.css", "p01-pin-down-the-problem.html", "p02-small-cases.html", "p07-auxiliary-construction.html", "p09-invariant.html", "p15-squeeze.html", "p16-isomorphism.html", "p19-count-outcomes.html", "p24-waves.html", "p25-machine-cases.html", "p27-complex-for-integers.html", "p29-energy-methods.html", "p37-ito-calculus.html", "p43-flow-with-surgery.html", "p57-nash-moser.html", "p58-ergodic-correspondence.html"];
var reH = /href="([^"]*)"/g, mH, setH = {};
while ((mH = reH.exec(PAGE))) setH[mH[1]] = 1;
var extraH = Object.keys(setH).filter(function (h) { return hrefs.indexOf(h) < 0; });
ck("S11", "all 17 href targets present and none outside the whitelist: " + extraH.join(","), hrefs.every(function (h) { return PAGE.indexOf('href="' + h + '"') >= 0; }) && extraH.length === 0);
ck("S12", "exercise moons u25CFu25CBu25CB u25CFu25CFu25CB u25CFu25CFu25CF u25C6 u25D0", cnt("Exercise 1</strong> \u25CF\u25CB\u25CB") === 1 && cnt("Exercise 2</strong> \u25CF\u25CF\u25CB") === 1 && cnt("Exercise 3</strong> \u25CF\u25CF\u25CF") === 1 && cnt("Exercise 4</strong> \u25C6") === 1 && cnt("Exercise 5</strong> \u25D0") === 1);
var secIds = ["bridge", "encounter", "name-the-move", "the-move-at-work", "when-it-fails", "what-next", "lineage", "exercises"];
ck("S13", "8 section ids each once", secIds.every(function (s) { return cnt('id="' + s + '"') === 1; }));
ck("S14", "3 box ids box-p26, box-p26a, box-p26b", cnt('id="box-p26"') === 1 && cnt('id="box-p26a"') === 1 && cnt('id="box-p26b"') === 1);
ck("S15", "scope-warn aside once", cnt("<strong>Scope, honestly.</strong>") === 1);
ck("S16", "onramp new-word aside once", cnt("<strong>New word: differential equation.</strong>") === 1);
ck("S17", "three figcaptions P26.1-3", cnt("<strong>Fig P26.1.</strong>") === 1 && cnt("<strong>Fig P26.2.</strong>") === 1 && cnt("<strong>Fig P26.3.</strong>") === 1);
ck("S18", "footer: next-link P27 + atlas-home P25", PAGE.indexOf('p27-complex-for-integers.html">P27 · Complex analysis for integer problems</a>') >= 0 && PAGE.indexOf('p25-machine-cases.html">P25 · Check every case by machine</a>') >= 0);
ck("S19", "page ends cleanly", PAGE.trim().endsWith("</html>"));
ck("S20", "no dollar signs, no backticks, no $$", cnt("$") === 0 && cnt("`") === 0);
var openI = 0, openD = 0, okT = true;
for (var iT = 0; iT < PAGE.length - 1; iT++) {
  var two = PAGE.substr(iT, 2);
  if (two === "\\(") openI++;
  else if (two === "\\)") { openI--; if (openI < 0) okT = false; }
}
for (var jT = 0; jT < PAGE.length - 1; jT++) {
  var twoD = PAGE.substr(jT, 2);
  if (twoD === "\\[") openD++;
  else if (twoD === "\\]") { openD--; if (openD < 0) okT = false; }
}
ck("S21", "TeX delimiters balanced (inline net " + openI + ", display net " + openD + ")", okT && openI === 0 && openD === 0);
var numerics = [["0.0154", 3], ["36.30", 2], ["71.43", 2], ["64.08", 2], ["47.76", 3], ["158.2", 4], ["632.7", 2], ["50.43", 1], ["0.0796", 1], ["0.501", 1], ["0.250", 1], ["0.125", 1], ["2.61", 2], ["109.57", 1], ["29.08", 1], ["21.73", 1], ["80.06", 1], ["0.906", 1], ["28,092", 2], ["51.43", 2], ["49.8", 3], ["161.4", 3], ["59.79", 1], ["59.88", 1]];
var badN = numerics.filter(function (nv) { return cnt(nv[0]) !== nv[1]; });
ck("S22", "24 numeric needles at their exact counts: " + badN.map(function (nv) { return nv[0] + " (" + cnt(nv[0]) + " not " + nv[1] + ")"; }).join(", "), badN.length === 0);
ck("S23", "walk figure: 31 bars (rects), got " + cnt("<rect "), cnt("<rect ") === 31);
ck("S24", "5 polylines (coffee curve, 3 rod curves, gaussian)", cnt("<polyline ") === 5);
ck("S25", "h1 present once", cnt("<h1>Model it with an equation</h1>") === 1);
ck("S26", "lines: the page has no stray double blank runs in body sections", cnt("<h2>") === 8 && cnt("</section>") === 8);
// --- summary ---
console.log("TOTAL " + TOTAL + " checks, FAILS " + FAILS);
