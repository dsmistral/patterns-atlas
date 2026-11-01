// p26-review-verifier.js — adversarial verifier for P26 "Model it with an equation".
// Zero code shared with the lab: independent derivations, independent counters,
// poisoned injections that must all be REJECTED. Harness injects PAGE (string).
var S_ = { pass: 0, fail: 0, inj: 0 };
function OK(id, cond, note) { if (cond) { S_.pass++; console.log(id + " PASS " + (note || "")); } else { S_.fail++; console.log(id + " FAIL " + (note || "")); } }
function REJ(id, cond, note) { if (cond) { S_.inj++; console.log(id + " REJECTED " + (note || "")); } else { S_.fail++; console.log(id + " NOT-REJECTED " + (note || "")); } }
function howmany(hay, sub) { return hay.split(sub).length - 1; }
function near(a, b, tol) { return Math.abs(a - b) <= tol; }
// independent mug route: k from ln7-ln6 (not ln(7/6))
var kV = (Math.log(7) - Math.log(6)) / 10;
OK("V01", near(Math.exp(-10 * kV), 6 / 7, 1e-15), "k = (ln7-ln6)/10 gives exp(-10k) = 6/7");
OK("V02", near(20 + 70 * (36 / 49), 71.4285714286, 1e-9) && howmany(PAGE, "71.43") === 2, "T(20) = 20 + 70*36/49 = 71.4286, page needle 71.43 x2");
var t60V = 10 * Math.log(7 / 4) / (Math.log(7) - Math.log(6));
OK("V03", near(t60V, 36.3032, 1e-3) && near(20 + 70 * Math.exp(-kV * t60V), 60, 1e-9), "t(60C) = 36.3032, round trip exact");
OK("V04", near(20 + 70 * Math.pow(6 / 7, 3), 64.0816, 1e-4) && howmany(PAGE, "64.08") === 2, "T(30) = 64.0816, needle x2");
// quadratic via Gaussian elimination on the 3-point system (c = 90 known)
var a1 = (1 / 140), b1 = (-15 / 14);
var r11 = (20 + 70 * 36 / 49) - 90; // rhs1: 100a+10b from (10,80): -10; used below differently
var dV = 100 * 20 - 10 * 400; // determinant of [[100,10],[400,20]]
var aV = ((-10) * 20 - 10 * (-90 + 20 + 70 * 36 / 49)) / dV;
var bV = (100 * (-90 + 20 + 70 * 36 / 49) - (-10) * 400) / dV;
OK("V05", near(aV, 1 / 140, 1e-12) && near(bV, -15 / 14, 1e-12), "elimination: a = 1/140, b = -15/14");
function quadV(t) { return aV * t * t + bV * t + 90; }
OK("V06", near(quadV(0), 90, 1e-9) && near(quadV(10), 80, 1e-9) && near(quadV(20), 71.4285714286, 1e-9), "quadratic fits all three measurements");
OK("V07", near(quadV(60), 51.4286, 1e-3) && near(quadV(75), 49.8214, 1e-3) && near(quadV(200), 161.4286, 1e-3), "quadratic receipts 51.43 / 49.82 / 161.43");
// RK4 (not Euler) for the mug, h = 0.05, to t = 36.5
function mugRK(hh, T0, tEnd) { var t = 0, T = T0; while (t < tEnd - 1e-12) { var k1 = -kV * (T - 20), k2 = -kV * (T + hh / 2 * k1 - 20), k3 = -kV * (T + hh / 2 * k2 - 20), k4 = -kV * (T + hh * k3 - 20); T += hh / 6 * (k1 + 2 * k2 + 2 * k3 + k4); t += hh; } return T; }
OK("V08", near(mugRK(0.05, 90, 36.5), 20 + 70 * Math.exp(-kV * 36.5), 1e-8), "RK4 agrees with closed form to 1e-8");
var eu = 90; for (var sE = 0; sE < 73; sE++) eu += 0.5 * (-kV * (eu - 20));
OK("V09", near(eu, 59.7920, 1e-3) && howmany(PAGE, "59.79") === 1, "fresh forward Euler h=0.5 at t=36.5 reads 59.792");
// poison battery, part 1
REJ("I01", howmany(PAGE.split("71.43").join("71.53"), "71.43") === 0, "tampered 71.43 -> 71.53 kills the needle (count drops to 0)");
REJ("I02", howmany(PAGE.split("36.30").join("36.3"), "36.30") === 0, "deleted trailing zeros kill both 36.30 needles");
REJ("I03", PAGE.split("the fourth move of tier 3").join("the fifth move of tier 3").indexOf("the fourth move of tier 3") < 0, "kicker rank tamper detected");
REJ("I04", PAGE.split("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=").join("sha256-TAMPERED0000000000000000000000000000000=").indexOf("1CldwzdEg2k1") < 0, "MathJax pin tamper detected");

// --- rod: independent conservation, convergence, copper, energy checks ---
function slabSim(nCells, rPar, steps, insul, init) {
  var u = [], i;
  for (i = 0; i < nCells; i++) u.push(init(i));
  var tot0 = 0; for (i = 0; i < nCells; i++) tot0 += u[i];
  for (var s = 0; s < steps; s++) {
    var fl = []; for (i = 0; i < nCells - 1; i++) fl.push(-(u[i + 1] - u[i])); // flux rightward per Fourier sign convention
    var nu = []; for (i = 0; i < nCells; i++) {
      var inF = i === 0 ? 0 : fl[i - 1];   // flux in from the left interface (insulated: none)
      var outF = i === nCells - 1 ? 0 : fl[i]; // flux out through the right interface (insulated: none)
      nu.push(u[i] + rPar * (inF - outF));
    }
    u = nu;
  }
  var tot1 = 0; for (i = 0; i < nCells; i++) tot1 += u[i];
  return { drift: tot1 - tot0, u: u };
}
var sim17 = slabSim(17, 0.25, 1500, true, function (i) { return 40 + 3 * Math.sin(i * 1.7) + i; });
OK("V10", Math.abs(sim17.drift) < 1e-9, "17-slab insulated rod (flux-array scheme): drift " + sim17.drift.toExponential(2));
function modeMid(nCells, rPar) {
  var dx = 1 / nCells, dt = rPar * dx * dx * Math.PI * Math.PI; // alpha = 1/pi^2
  var u = [], i; for (i = 0; i < nCells; i++) u.push(100 * Math.sin(Math.PI * (i + 0.5) * dx));
  var steps = Math.floor(Math.LN2 / dt);
  for (var s = 0; s < steps; s++) {
    var nu = []; for (i = 0; i < nCells; i++) {
      var l = i > 0 ? u[i - 1] : 0, rr = i < nCells - 1 ? u[i + 1] : 0;
      nu.push(u[i] + rPar * (l - 2 * u[i] + rr));
    }
    u = nu;
  }
  return u[Math.floor(nCells / 2)];
}
var mid100 = modeMid(100, 0.25), mid200 = modeMid(200, 0.25);
OK("V11", near(mid100, 50.4303, 2e-3) && near(mid200, 50, 0.25) && Math.abs(mid200 - 50) < Math.abs(mid100 - 50), "FTCS midpoint: 100 cells reads " + mid100.toFixed(4) + " (page 50.43), 200 cells converges toward 50");
var thalfV = Math.LN2 / (1.11e-4 * Math.pow(Math.PI / 0.5, 2));
OK("V12", near(thalfV, 158.1768, 1e-2) && near(4 * thalfV, 632.7072, 2e-2), "copper half-time 158.18 s; 1 m rod 632.71 s (page 158.2 / 632.7)");
var tri = []; for (var iT2 = 0; iT2 < 64; iT2++) tri.push(iT2 < 32 ? iT2 * 2 : (63 - iT2) * 2);
var en0 = 0; for (iT2 = 0; iT2 < 64; iT2++) en0 += tri[iT2] * tri[iT2];
var mono2 = true, enC = en0;
for (var sT2 = 0; sT2 < 300; sT2++) {
  var nT = []; for (iT2 = 0; iT2 < 64; iT2++) { var l = iT2 > 0 ? tri[iT2 - 1] : 0, rr = iT2 < 63 ? tri[iT2 + 1] : 0; nT.push(tri[iT2] + 0.25 * (l - 2 * tri[iT2] + rr)); }
  var en1 = 0; for (iT2 = 0; iT2 < 64; iT2++) en1 += nT[iT2] * nT[iT2];
  if (en1 > enC + 1e-9) mono2 = false;
  enC = en1; tri = nT;
}
OK("V13", mono2 && enC < en0, "triangle-profile energy " + en0.toFixed(0) + " -> " + enC.toFixed(0) + " monotone (ends at zero)");
REJ("I05", howmany(PAGE.split('href="index.html"').join('href="evil-injection.html"'), 'href="evil-injection.html"') >= 1, "foreign href injected: whitelist census flags it");

// --- walk: two independent probability routes + parity ---
function pascalRow(n) { var row = [1]; for (var j = 1; j <= n; j++) row.push(row[j - 1] * (n - j + 1) / j); return row; }
var prow = pascalRow(100), p100 = [];
for (var j2 = 0; j2 <= 100; j2++) p100.push(prow[j2] / Math.pow(2, 100));
var dp = [1];
for (var n2 = 1; n2 <= 100; n2++) { var nd = []; for (var q2 = 0; q2 <= 2 * n2; q2++) nd.push(0); for (q2 = 0; q2 < dp.length; q2++) { nd[q2] += dp[q2] / 2; nd[q2 + 2] += dp[q2] / 2; } dp = nd; }
OK("V14", near(p100[50], 0.0795892, 1e-6) && near(dp[100], p100[50], 1e-12) && howmany(PAGE, "0.0796") === 1, "P(X_100=0): Pascal-product " + p100[50].toFixed(7) + " = halving-DP " + dp[100].toFixed(7) + "; page needle 0.0796 x1");
var oddSum = 0; for (var o2 = 1; o2 < dp.length; o2 += 2) oddSum += dp[o2];
OK("V15", oddSum === 0 && near(dp.reduce(function (a, b) { return a + b; }, 0), 1, 1e-9), "parity: odd positions carry 0, all mass on even (P(odd) = " + oddSum + ")");
function walkErr(n3) { var pr = pascalRow(n3); var pex = pr[n3 / 2] / Math.pow(2, n3); var g = Math.sqrt(2 / (Math.PI * n3)); return (g - pex) / pex; }
var e50 = walkErr(50), e200 = walkErr(200);
var stir = (1 - 1 / 400) / Math.sqrt(50 * Math.PI), gaussV = Math.sqrt(2 / (100 * Math.PI));
OK("V16", near(stir, p100[50], 1e-6) && near(e50, 0.00501, 1e-4) && near((gaussV - p100[50]) / p100[50], 0.0025, 1e-5) && near(e200, 0.00125, 1e-5) && near(e50 / 2, (gaussV - p100[50]) / p100[50], 2e-4) && howmany(PAGE, "0.501") === 1 && howmany(PAGE, "0.250") === 1 && howmany(PAGE, "0.125") === 1, "Stirling (1-1/400)/sqrt(50*pi) = " + stir.toFixed(7) + "; Gaussian overshoot 0.501%/0.250%/0.125% at n=50/100/200, halving like 1/n");
// --- figure geometry: bars, curves, dots parsed out of PAGE ---
function parsePts(str) { var out = [], toks = str.trim().split(" "); for (var t2 = 0; t2 < toks.length; t2++) { var xy = toks[t2].split(","); out.push([parseFloat(xy[0]), parseFloat(xy[1])]); } return out; }
var rects = [], rm; var rre = /<rect x="([0-9.]+)" y="([0-9.]+)" width="7" height="([0-9.]+)"/g;
while ((rm = rre.exec(PAGE)) !== null) rects.push([parseFloat(rm[1]), parseFloat(rm[2]), parseFloat(rm[3])]);
var barsOKg = rects.length === 31;
for (var b2 = 0; b2 < rects.length && barsOKg; b2++) {
  var kk = 2 * b2 - 30, expH = 3500 * p100[(100 + kk) / 2];
  if (!near(rects[b2][0], 56.5 + 18 * b2, 1e-9) || !near(rects[b2][1] + rects[b2][2], 330, 1e-9) || !near(rects[b2][2], expH, 0.001)) barsOKg = false;
}
OK("V17", barsOKg, "walk bars: 31 rects, x = 56.5+18j, y+height = 330, height = 3500*P (max dev " + (function () { var m = 0; for (var z = 0; z < rects.length; z++) m = Math.max(m, Math.abs(rects[z][2] - 3500 * p100[(100 + 2 * z - 30) / 2])); return m.toFixed(5); })() + ")");
var plines = [], pm; var ple = /<polyline points="([^"]+)"/g;
while ((pm = ple.exec(PAGE)) !== null) plines.push(parsePts(pm[1]));
var coff = plines[0], coffOK = coff.length === 15;
for (var c2 = 0; c2 < 15 && coffOK; c2++) {
  var tt = 5 * c2, expY = 330 - 3 * (20 + 70 * Math.exp(-kV * tt));
  if (!near(coff[c2][0], 60 + tt * 40 / 7, 0.001) || !near(coff[c2][1], expY, 0.001)) coffOK = false;
}
OK("V18", coffOK && plines.length === 5, "coffee polyline: 15 points on 60+t*40/7 vs 330-3*T(t), no drift (last pt " + coff[14][0] + "," + coff[14][1] + ")");
var rodOK = true;
for (var c3 = 1; c3 <= 3 && rodOK; c3++) {
  var ampV = [100, 100 / Math.SQRT2, 50][c3 - 1], pts = plines[c3];
  if (pts.length !== 21) rodOK = false;
  for (var j3 = 0; j3 < pts.length && rodOK; j3++) {
    var xs3 = j3 / 20;
    if (!near(pts[j3][0], 60 + xs3 * 540, 0.001) || !near(pts[j3][1], 330 - 3 * ampV * Math.sin(Math.PI * xs3), 0.001)) rodOK = false;
  }
}
OK("V19", rodOK, "rod polylines: 3 arches, 21 pts each, amplitudes 100 / 70.7107 / 50 at x = 60..600");
var gau = plines[4], gauOK = gau.length === 31;
for (var g2 = 0; g2 < 31 && gauOK; g2++) {
  var kg = 2 * (g2 - 15), gexp = 330 - 3500 * 2 * Math.exp(-kg * kg / 200) / Math.sqrt(200 * Math.PI);
  if (!near(gau[g2][0], 60 + 18 * g2, 1e-9) || !near(gau[g2][1], gexp, 0.001)) gauOK = false;
}
OK("V20", gauOK, "gaussian overlay: 31 pts, y = 330 - 3500*2*exp(-k^2/200)/sqrt(200*pi) (peak " + gau[15][1] + ")");
var circs = [], cm2; var cre = /<circle cx="([0-9.]+)" cy="([0-9.]+)"/g;
while ((cm2 = cre.exec(PAGE)) !== null) circs.push([parseFloat(cm2[1]), parseFloat(cm2[2])]);
var linEl = /<line x1="60" y1="60" x2="460" y2="270"/.test(PAGE);
OK("V21", circs.length === 4 && near(circs[0][0], 60, 1e-9) && near(circs[0][1], 60, 1e-9) && near(circs[1][0], 117.1429, 1e-9) && near(circs[1][1], 90, 1e-9) && near(circs[2][0], 174.2857, 1e-9) && near(circs[2][1], 115.7142, 1e-9) && near(circs[3][0], 60 + t60V * 40 / 7, 0.001) && near(circs[3][1], 150, 1e-9) && linEl, "mug dots at t=0,10,20 and the 60-degree prediction dot (" + circs[3][0] + "," + circs[3][1] + "); linear guess line (60,60)-(460,270)");
REJ("I06", howmany(PAGE.split("<details>").join("<detaiIs>"), "<details>") !== 10, "details tamper: one tag broken, census no longer finds 10");
REJ("I07", (function () { var m3 = /<rect x="56.5" y="([0-9.]+)" width="7" height="([0-9.]+)"/.exec(PAGE.split('height="3.0235"').join('height="4.0235"')); return m3 === null || !near(parseFloat(m3[1]) + parseFloat(m3[2]), 330, 1e-9); })(), "rect tamper: first bar lifted off the axis, y+height no longer 330");

// --- Exhibit A: the room that moved (midpoint integrator, h = 0.01) ---
function ambV(t) { return 20 + 10 * (1 - Math.exp(-t / 120)); }
var tA = 0, TA = 90, hA = 0.01, T10V = null;
while (tA < 240 - 1e-12) { if (Math.abs(tA - 10) < 1e-12) T10V = TA; TA = TA + hA * (-kV * (TA + hA / 2 * (-kV * (TA - ambV(tA))) - ambV(tA + hA / 2))); tA += hA; }
var model240V = 20 + 70 * Math.exp(-kV * 240);
OK("V22", near(T10V, 80.0594, 0.001) && near(TA, 29.0764, 0.001) && near(model240V, 21.7313, 1e-4) && near(TA - model240V, 7.3451, 0.002) && howmany(PAGE, "80.06") === 1 && howmany(PAGE, "29.08") === 1 && howmany(PAGE, "21.73") === 1, "world midpoint h=0.01: T(10) = " + T10V.toFixed(4) + ", T(240) = " + TA.toFixed(4) + " vs model " + model240V.toFixed(4) + " (off " + (TA - model240V).toFixed(4) + ")");
// --- Exhibit B: Malthus fitted to logistic truth ---
function xLog(tt) { return 1000 / (1 + 99 * Math.exp(-0.5 * tt)); }
var x5V = xLog(5), rV = Math.log(x5V / 10) / 5;
function xExp(tt) { return 10 * Math.exp(rV * tt); }
OK("V23", near(x5V, 109.5721, 1e-3) && howmany(PAGE, "109.57") === 1 && near(xExp(5.5) / xLog(5.5) - 1, 0.0205, 1e-3) && near(xExp(6) / xLog(6) - 1, 0.0486, 1e-3) && near(xExp(7) / xLog(7) - 1, 0.1389, 1e-3) && howmany(PAGE, "2.0\\%") === 1 && howmany(PAGE, "4.9\\%") === 1 && howmany(PAGE, "13.9\\%") === 1, "creep 2.0%/4.9%/13.9% at t=5.5/6/7 as page says");
OK("V24", near(xExp(10), 1200.60, 0.05) && near(xLog(10), 599.86, 0.01) && near(xExp(15), 13155.26, 0.5) && near(xLog(15), 948.09, 0.2) && near(xExp(20), 144144.86, 0.5) && near(xLog(20), 995.53, 0.05) && near(xExp(20) / xLog(20), 145, 0.5) && howmany(PAGE, "1200.6") === 1 && howmany(PAGE, "599.9") === 1 && howmany(PAGE, "13{,}155") === 1 && howmany(PAGE, "948") === 1 && howmany(PAGE, "144{,}145") === 1 && howmany(PAGE, "995.5") === 1, "t=10: " + xExp(10).toFixed(1) + " vs " + xLog(10).toFixed(1) + "; t=15: 13,155 vs 948; t=20: 144,145 vs 995.5 (145x)");
// --- Exhibit C: the arrow of time ---
var fwdC = Math.exp(-Math.pow(20 * Math.PI, 2) * 0.01), bwdC = Math.exp(Math.pow(20 * Math.PI, 2) * 0.01), slowC = Math.exp(-Math.PI * Math.PI * 0.01);
var maxF2 = 0; for (var mC = 1; mC <= 50; mC++) maxF2 = Math.max(maxF2, Math.exp(-Math.pow(mC * Math.PI, 2) * 0.01));
OK("V25", near(fwdC * 1e18, 7.1572, 0.001) && howmany(PAGE, "7.2 \\times 10^{-18}") === 1 && near(bwdC / 1e17, 1.3972, 0.001) && howmany(PAGE, "1.4 \\times 10^{17}") === 1 && near(1e-6 * bwdC, 1.397e11, 1e8) && near(maxF2, slowC, 1e-12) && near(slowC, 0.9060, 1e-4) && howmany(PAGE, "0.906") === 1, "mode-20 factor: forward 7.157e-18, backward 1.397e17; 1e-6 error -> 1.397e11; slowest of fifty = 0.9060");
// --- Exercise 5: traffic, Lax-Friedrichs with lam = 0.4 on 800 cells ---
function lfV(rhol, rhor, steps) {
  var M = 800, rho = []; for (var j = 0; j < M; j++) rho.push(j < 400 ? rhol : rhor);
  var lam = 0.4;
  for (var s = 0; s < steps; s++) { var nr = []; for (j = 0; j < M; j++) { var l = rho[j > 0 ? j - 1 : 0], rr = rho[j < M - 1 ? j + 1 : M - 1]; nr.push(0.5 * (l + rr) - lam * (rr * (1 - rr) - l * (1 - l))); } rho = nr; }
  for (j = 0; j < M - 1; j++) { if ((rho[j] - 0.65) * (rho[j + 1] - 0.65) <= 0) return j; }
  return -1;
}
var shSpd = (lfV(0.4, 0.9, 1200) - lfV(0.4, 0.9, 400)) / 800 / 0.8;
var stSpd = (lfV(0.1, 0.9, 1200) - lfV(0.1, 0.9, 400)) / 800 / 0.8;
OK("V26", near(0.9 * 0.1 - 0.4 * 0.6, -0.15, 1e-12) && near((0.9 * 0.1 - 0.4 * 0.6) / 0.5, -0.30, 1e-12) && near(shSpd, -0.30, 0.02) && near((0.9 * 0.1 - 0.1 * 0.9) / 0.8, 0, 1e-12) && near(stSpd, 0, 0.02) && howmany(PAGE, "-0.30") === 2 && howmany(PAGE, "0.00") === 2, "LF lam=0.4/800 cells: jam tail " + shSpd.toFixed(3) + " road-lengths/s (exact -0.30), standing queue " + stSpd.toFixed(3) + " (exact 0)");
OK("V27", near(0.5 * (1 - 0.5), 0.25, 1e-12) && howmany(PAGE, "1 - \\rho_l - \\rho_r") === 1, "q'(1/2) = 0 with q max 1/4; Rankine-Hugoniot s = 1 - rho_l - rho_r as page states");
// --- Exercise 1: the second mug ---
var kE = Math.log(7 / 6) / 5, T30E = 25 + 70 * Math.pow(6 / 7, 6), t40E = 5 * Math.log(70 / 15) / Math.log(7 / 6);
OK("V28", near(kE, 0.0308301, 1e-7) && howmany(PAGE, "0.0308") === 2 && near(T30E, 52.7599, 1e-3) && howmany(PAGE, "52.76") === 1 && near(t40E, 49.9657, 1e-3) && howmany(PAGE, "49.97") === 1 && near(25 + 70 * Math.exp(-kE * t40E), 40, 1e-9), "Ex1: k = 0.03083, T(30) = " + T30E.toFixed(4) + ", t(40C) = " + t40E.toFixed(4) + ", round trip lands exactly on 40");
// --- Exercise 3: the biased walk, exact DP (p = 0.6 rightward) ---
var qb2 = [1];
for (var nB = 1; nB <= 1000; nB++) { var qB = []; for (var xB = 0; xB <= 2 * nB; xB++) qB.push(0); for (xB = 0; xB < qb2.length; xB++) { qB[xB + 2] += 0.6 * qb2[xB]; qB[xB] += 0.4 * qb2[xB]; } qb2 = qB; }
var mB2 = 0, vB2 = 0, sB = 0;
for (var iB = 0; iB < qb2.length; iB++) sB += (iB - 1000) * qb2[iB];
for (iB = 0; iB < qb2.length; iB++) vB2 += (iB - 1000 - sB) * (iB - 1000 - sB) * qb2[iB];
mB2 = sB;
OK("V29", near(mB2, 200, 1e-6) && near(vB2, 960, 1e-3) && howmany(PAGE, "960") === 1 && howmany(PAGE, "0.6\\,p_n(x-1) + 0.4\\,p_n(x+1)") === 1, "Ex3 DP: mean " + mB2.toFixed(1) + " = (2p-1)n, Var " + vB2.toFixed(1) + " = 4p(1-p)n; recursion weights 0.6/0.4 as fixed");

// --- needle battery: every machine number the page quotes, with multiplicities ---
OK("V30", howmany(PAGE, "0.0154") === 3 && howmany(PAGE, "36.30") === 2 && howmany(PAGE, "71.43") === 2 && howmany(PAGE, "64.08") === 2 && howmany(PAGE, "47.76") === 3 && howmany(PAGE, "59.79") === 1 && howmany(PAGE, "59.88") === 1, "mug needles: k=0.0154 x3, 36.30 x2, 71.43 x2, 64.08 x2, 47.76 x3, Euler 59.79/exact 59.88");
OK("V31", howmany(PAGE, "158.2") === 4 && howmany(PAGE, "632.7") === 2 && howmany(PAGE, "50.43") === 1 && howmany(PAGE, "2.61") === 2 && howmany(PAGE, "28,092") === 2 && howmany(PAGE, "2.3 \\times 10^{-13}") === 1 && howmany(PAGE, "1.11 \\times 10^{-4}") === 1 && howmany(PAGE, "0.906") === 1, "rod/walk needles: 158.2 x4, 632.7 x2, 50.43, 2.61 x2, 28,092 x2, 2.3e-13, 1.11e-4, 0.906");
OK("V32", howmany(PAGE, "51.43") === 2 && howmany(PAGE, "49.8") === 3 && howmany(PAGE, "161.4") === 3 && howmany(PAGE, "109.57") === 1, "parabola/population needles: 51.43 x2, 49.8 x3, 161.4 x3, 109.57");
// --- structure census ---
var idsOK = true, lastIx = -1, idsV = ["bridge", "encounter", "name-the-move", "the-move-at-work", "when-it-fails", "what-next", "lineage", "exercises"];
for (var iV = 0; iV < 8; iV++) { var ixV = PAGE.indexOf('<section id="' + idsV[iV] + '">'); if (ixV < 0 || ixV <= lastIx) idsOK = false; else lastIx = ixV; }
var h2OK = ["1 · Before we begin", "2 · Meet the problem", "3 · Name the move", "4 · The move at work", "5 · When the move fails", "6 · What to try next", "7 · Lineage", "8 · Exercises"].every(function (tt2) { return howmany(PAGE, "<h2>" + tt2 + "</h2>") === 1; });
var wl = ["index.html", "assets/style.css", "p01-pin-down-the-problem.html", "p02-small-cases.html", "p07-auxiliary-construction.html", "p09-invariant.html", "p15-squeeze.html", "p16-isomorphism.html", "p19-count-outcomes.html", "p24-waves.html", "p25-machine-cases.html", "p27-complex-for-integers.html", "p29-energy-methods.html", "p37-ito-calculus.html", "p43-flow-with-surgery.html", "p57-nash-moser.html", "p58-ergodic-correspondence.html"];
var hrefsV = [], hm2; var hre = /href="([^"]*)"/g;
while ((hm2 = hre.exec(PAGE)) !== null) hrefsV.push(hm2[1]);
var hrefOK = hrefsV.length === 41 && hrefsV.every(function (h2v) { return wl.indexOf(h2v) >= 0; });
OK("V33", idsOK && h2OK && hrefOK && howmany(PAGE, 'id="box-p26"') === 1 && howmany(PAGE, 'id="box-p26a"') === 1 && howmany(PAGE, 'id="box-p26b"') === 1 && howmany(PAGE, 'class="pid"') === 3 && howmany(PAGE, "<details>") === 10 && howmany(PAGE, "summary>Hint") === 5 && howmany(PAGE, "summary>Worked answer") === 5 && howmany(PAGE, "<svg ") === 3, "structure: 8 sections in order, 8 h2, 41 whitelisted hrefs, 3 boxes, 3 pid, 10 details (5+5), 3 svg");
OK("V34", howmany(PAGE, "<title>P26 · Model it with an equation · The Patterns Atlas</title>") === 1 && howmany(PAGE, "P26 · the fourth move of tier 3") === 1 && howmany(PAGE, "sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=") === 1 && howmany(PAGE, "mathjax@3.2.2") === 1 && howmany(PAGE, "●○○") === 1 && howmany(PAGE, "●●○") === 1 && howmany(PAGE, "●●●") === 1 && howmany(PAGE, "◆") === 1 && howmany(PAGE, "◐") === 1 && howmany(PAGE, "New word: differential equation") === 1 && howmany(PAGE, "Scope, honestly.") === 1, "identity: title, kicker, pinned MathJax, 5 moons, onramp + scope asides");
OK("V35", howmany(PAGE, "P27 · Complex analysis for integer problems") === 1 && howmany(PAGE, "Check every case by machine") === 1 && howmany(PAGE, "The patterns atlas") === 1 && PAGE.slice(-26) === "</footer>\n</body>\n</html>\n" && howmany(PAGE, "\\(") === howmany(PAGE, "\\)") && howmany(PAGE, "\\[") === howmany(PAGE, "\\]") && PAGE.indexOf("$") < 0 && PAGE.indexOf("`") < 0, "footer routes to P27/P25, tail intact, TeX balanced " + howmany(PAGE, "\\(") + "/" + howmany(PAGE, "\\)") + ", no $ and no backtick anywhere");
OK("V36", howmany(PAGE, "1701") === 3 && howmany(PAGE, "1747") === 2 && howmany(PAGE, "1807") >= 1 && howmany(PAGE, "1822") === 2 && howmany(PAGE, "1855") === 2 && howmany(PAGE, "1900") === 2 && howmany(PAGE, "1905") === 3 && howmany(PAGE, "1955") >= 1 && howmany(PAGE, "1956") >= 1 && howmany(PAGE, "1973") === 2, "lineage dates present: 1701, 1747, 1807, 1822, 1855, 1900, 1905, 1955, 1956, 1973");
// --- poison battery, final round ---
REJ("I08", (function () { var m4 = /<polyline points="([^"]+)"/.exec(PAGE.split("88.5714,75.5778").join("88.5714,75.6778")); var p4 = m4[1].trim().split(" ")[1].split(","); return Math.abs(parseFloat(p4[1]) - (330 - 3 * (20 + 70 * Math.exp(-kV * 5)))) > 0.0005; })(), "coffee polyline tamper: second point off the model curve");
REJ("I09", (function () { var all = PAGE.split("87,296.8152").join("87,296.7152").match(/<polyline points="[^"]+"/g); var y5 = parseFloat(/points="[^"]+"/.exec(all[2])[0].split(" ")[1].split(",")[1]); return Math.abs(y5 - (330 - 3 * (100 / Math.SQRT2) * Math.sin(Math.PI / 20))) > 0.0005; })(), "rod amplitude tamper: middle arch no longer 70.7107 sine");
REJ("I10", howmany(PAGE.split("0.0796").join("0.0795"), "0.0796") === 0, "walk return-chance needle tampered away");
REJ("I11", PAGE.split("</body>\n</html>\n").join("</html>\n").slice(-26) !== "</footer>\n</body>\n</html>\n", "tail tamper: page no longer closes body and html");
REJ("I12", howmany(PAGE.split("●●●").join("●●○"), "●●●") === 0, "moon tamper: Exercise 3 difficulty badge altered");
REJ("I13", howmany(PAGE.split("Scope, honestly.").join(""), "Scope, honestly.") === 0, "scope aside deleted: the honesty contract removed");
REJ("I14", howmany(PAGE.split("<title>P26 · Model it with an equation · The Patterns Atlas</title>").join("<title>TAMPERED</title>"), "<title>P26") === 0, "title tamper: page identity broken");
REJ("I15", howmany(PAGE.split("1.4 \\times 10^{17}").join("1.4 \\times 10^{16}"), "1.4 \\times 10^{17}") === 0, "backward-amplification needle tampered: 10^17 becomes 10^16");
REJ("I16", howmany(PAGE.split("2.61").join("2.71"), "2.61") === 0, "tail-error needle tampered: 2.61% becomes 2.71%");
console.log("VERIFIER " + S_.pass + " PASS, " + S_.inj + " REJECTED, FAILS " + S_.fail);

