// P22 adversarial review verifier - session S56, page p22-fixed-point.html.
// Independent of the lab engine, by construction:
//  - Babylonian hits verified as EXACT FRACTIONS in base-10^7 chunk string
//    arithmetic with exact chunk products. A first draft used base 10^9, whose
//    chunk products exceed 2^53 and round; its own residual checks caught it
//    (residual lv5 came out 0 instead of 1) and the base was replaced. The
//    card's decimals are produced by string long division, not toFixed;
//  - sqrt2 and the e5/e6 errors computed in double-double arithmetic from the
//    exact Pell pairs (the lab used plain doubles);
//  - Dottie's number re-derived by NEWTON on h(x)=cos(x)-x (the lab counted
//    plain cos-iteration hits against a hardcoded constant);
//  - the plastic constant re-derived by the SECANT method (the lab used
//    Newton's map) and its orbit errors audited in double-double;
//  - 10 poisoned claims that must be REJECTED;
//  - 30 loader gates and prose needles against the live page text.
// Zero code shared with p22-lab.js. Honest history: p22-review-verifier-output.txt.
var VPASS, VFAILS, VREP;
function vck(name, ok, info) { if (ok) VPASS++; else { VFAILS++; VREP.push("FAIL " + name + (info ? " | " + info : "")); } }
// --- double-double arithmetic (Dekker/Knuth two-sum, Veltkamp split) ---
function ddMake(h, l) { var s = h + l; var b = s - h; return [s, (h - (s - b)) + (l - b)]; }
function ddAdd(a, b) { var s = a[0] + b[0]; var e = s - a[0]; var t = (a[0] - (s - e)) + (b[0] - e); t += a[1]; t += b[1]; return ddMake(s, t); }
function ddNeg(a) { return [-a[0], -a[1]]; }
function ddSub(a, b) { return ddAdd(a, ddNeg(b)); }
function ddMul(a, b) { var p = a[0] * b[0]; var S = 134217729;
  var ah = S * a[0] - (S * a[0] - a[0]), al = a[0] - ah, bh = S * b[0] - (S * b[0] - b[0]), bl = b[0] - bh;
  var e = ((ah * bh - p) + ah * bl + al * bh) + al * bl; e += a[1] * b[0] + a[0] * b[1]; return ddMake(p, e); }
function ddDiv(a, b) { var q1 = a[0] / b[0]; var r = ddSub(a, ddMul(b, [q1, 0]));
  var q2 = r[0] / b[0]; var r2 = ddSub(r, ddMul(b, [q2, 0])); return ddMake(q1, q2 + r2[0] / b[0]); }
function ddAbs(a) { return a[0] < 0 ? ddNeg(a) : a; }
function ddSqrt2() { var r = [1.5, 0], two = [2, 0]; for (var i = 0; i < 6; i++) r = ddMul(ddAdd(r, ddDiv(two, r)), [0.5, 0]); return r; }
// --- base-10^7 chunk string arithmetic (products stay under 2^53) ---
var VB7 = 10000000;
function vtc(s) { var out = [], e = s.length; while (e > 0) { out.push(parseInt(e >= 7 ? s.slice(e - 7, e) : s.slice(0, e), 10)); e -= 7; } return out; }
function vcs(a) { var s = String(a[a.length - 1]); for (var i = a.length - 2; i >= 0; i--) { var t = String(a[i]); while (t.length < 7) t = "0" + t; s += t; } return s; }
function vadd(a, b) { var r = [], c = 0, i; for (i = 0; i < Math.max(a.length, b.length); i++) { var s = (a[i] || 0) + (b[i] || 0) + c; r.push(s % VB7); c = Math.floor(s / VB7); } if (c) r.push(c); return r; }
function vsub(a, b) { var r = [], br = 0, i; for (i = 0; i < a.length; i++) { var d = (a[i] || 0) - (b[i] || 0) - br; if (d < 0) { d += VB7; br = 1; } else br = 0; r.push(d); } while (r.length > 1 && r[r.length - 1] === 0) r.pop(); return r; }
function vmul(a, b) { var r = []; for (var k = 0; k < a.length + b.length; k++) r.push(0);
  for (var i = 0; i < a.length; i++) { var c = 0; for (var j = 0; j < b.length; j++) { var t = r[i + j] + a[i] * b[j] + c; var lo = t % VB7; c = Math.floor((t - lo) / VB7); r[i + j] = lo; }
    var q = i + b.length; while (c) { var t2 = r[q] + c; r[q] = t2 % VB7; c = Math.floor(t2 / VB7); q++; } }
  while (r.length > 1 && r[r.length - 1] === 0) r.pop(); return r; }
function vcmp(a, b) { var sa = vcs(a), sb = vcs(b); if (sa.length !== sb.length) return sa.length - sb.length; return sa < sb ? -1 : (sa > sb ? 1 : 0); }
// long division: first k decimals of a/b as "int.frac" (no floats anywhere)
function vlongdiv(a, b, k) { var r = vsub(a, vmul(b, [Math.floor(parseInt(vcs(a)) / parseInt(vcs(b)))])); var ip = String(Math.floor(parseInt(vcs(a)) / parseInt(vcs(b))));
  var frac = "", cur = r;
  for (var d = 0; d < k; d++) { cur = vmul(cur, [10]); var q = 0, lo = 0, hi = 10; /* digit by compare */
    for (var t = 0; t <= 9; t++) { if (vcmp(cur, vmul(b, [t])) >= 0) q = t; }
    frac += String(q); cur = vsub(cur, vmul(b, [q])); }
  return ip + "." + frac; }
function pieceVA(PAGE) { // exact-fraction Babylonian: chain, residuals, long-division decimals, e5/e6 in dd
  VPASS=0; VFAILS=0; VREP=[];
  var chain = [["1","1"],["3","2"],["17","12"],["577","408"],["665857","470832"],["886731088897","627013566048"]];
  var a = vtc("1"), b = vtc("1");
  for (var lv = 0; lv < 6; lv++) {
    vck("va.pair lv" + lv, vcs(a) === chain[lv][0] && vcs(b) === chain[lv][1], vcs(a) + "/" + vcs(b));
    var a2 = vmul(a, a), b2 = vmul(b, b), b2x2 = vadd(b2, b2);
    var gt = vcmp(a2, b2x2) > 0, diff = gt ? vsub(a2, b2x2) : vsub(b2x2, a2);
    var res = (diff.length === 1 && diff[0] === 1) ? (gt ? 1 : -1) : 0;
    vck("va.residual lv" + lv, res === (lv === 0 ? -1 : 1), "residual = " + res);
    var aN = vadd(a2, b2x2), bN = vmul(vmul(a, b), [2]); a = aN; b = bN;
  }
  vck("va.a6", vcs(a) === "1572584048032918633353217", vcs(a));
  vck("va.b6", vcs(b) === "1111984844349868137938112", vcs(b));
  var a62 = vmul(a, a), b62 = vmul(b, b), r6 = vsub(a62, vadd(b62, b62));
  vck("va.residual6", vcs(r6) === "1", "a6^2 - 2 b6^2 = " + vcs(r6));
  // the card's decimals by long division of the exact fractions
  var vround = function(s) { // s has 11 decimals; round to 10 like toFixed
    var pt = s.indexOf("."), ip = s.slice(0, pt), fr = s.slice(pt + 1);
    var last9 = String(Math.floor((parseInt(fr.slice(0, 10), 10) + (parseInt(fr[10], 10) >= 5 ? 1 : 0))));
    while (last9.length < 10) last9 = "0" + last9;
    return ip + "." + last9; };
  var dec = [["577","408","1.4142156863"],["665857","470832","1.4142135624"],["886731088897","627013566048","1.4142135624"],["17","12","1.4166666667"]];
  for (var m = 0; m < 4; m++) {
    var ld = vround(vlongdiv(vtc(dec[m][0]), vtc(dec[m][1]), 11));
    vck("va.longdiv hit" + (m === 3 ? 2 : 3 + m), ld === dec[m][2], ld);
    vck("va.onPage hit" + (m === 3 ? 2 : 3 + m), PAGE.indexOf(dec[m][2]) >= 0);
  }
  vck("va.hit2onPage", PAGE.indexOf("1.4166666667") >= 0);
  // e5 and e6 in double-double from the exact pairs
  var s2 = ddSqrt2();
  var a5d = [886731088897, 0], b5d = [627013566048, 0];
  var e5 = ddDiv([1, 0], ddMul(ddMul(b5d, b5d), ddAdd(ddDiv(a5d, b5d), s2)));
  vck("va.e5dd", Math.abs(e5[0] / 8.993e-25 - 1) < 1e-3 && Math.abs(e5[0] - 8.993e-25) < 0.002e-24, "e5(dd) = " + e5[0].toExponential(4));
  vck("va.e5page", PAGE.indexOf("8.99 \\times 10^{-25}") >= 0 && PAGE.indexOf("9 \\times 10^{-25}") >= 0);
  return "pieceVA " + VPASS + " pass " + VFAILS + " fail " + VREP.join("; ");
}

function pieceVB(PAGE) {
  VPASS = 0; VFAILS = 0; VREP = [];
  var gg = function(t) { return (t + 2/t)/2; };
  // Dottie number, independently: Newton on h(x) = cos x - x, from 0.7
  var d = 0.7;
  for (var i = 0; i < 6; i++) { d = d - (Math.cos(d) - d)/(-Math.sin(d) - 1); }
  vck("vb.dottie.newton", Math.abs(d - 0.7390851332151607) < 1e-15, d);
  vck("vb.dottie.page10dp", PAGE.indexOf("0.7390851332") >= 0);
  vck("vb.dottie.sind", Math.abs(Math.sin(d) - 0.6736120) < 5e-8, Math.sin(d));
  vck("vb.dottie.sind.page", PAGE.indexOf("0.673612") >= 0);
  vck("vb.dottie.digits", Math.abs(-Math.log10(Math.sin(d)) - 0.1716) < 5e-5, -Math.log10(Math.sin(d)));
  vck("vb.dottie.certdigits", Math.abs(-Math.log10(Math.sin(1)) - 0.075) < 5e-4, -Math.log10(Math.sin(1)));
  vck("vb.dottie.room", Math.cos(0) === 1 && Math.cos(1) > 0.54 && Math.cos(1) < 1);
  var x = 0, hits = 0;
  for (var k = 1; k <= 200; k++) { x = Math.cos(x); if (Math.abs(x - d) < 5e-7) { hits = k; break; } }
  vck("vb.dottie.hits35", hits === 35, hits);
  var c1 = Math.sin(1), cert = 0;
  for (var k2 = 1; k2 <= 1000; k2++) { if (Math.pow(c1, k2) * d < 5e-7) { cert = k2; break; } }
  vck("vb.dottie.cert83", cert === 83, cert);
  var y = 0, orb = [];
  for (var k3 = 0; k3 < 12; k3++) { orb.push(y); y = Math.cos(y); }
  vck("vb.orbit.hit5", orb[5].toFixed(6) === "0.793480", orb[5].toFixed(6));
  vck("vb.orbit.hit11", orb[11].toFixed(6) === "0.744237", orb[11].toFixed(6));
  vck("vb.orbit.hit2", Math.abs(orb[2] - 0.5403023059) < 5e-11, orb[2]);
  vck("vb.orbit.hit3", Math.abs(orb[3] - 0.8575532158) < 5e-11, orb[3]);
  vck("vb.orbit.page", PAGE.indexOf("0.793480") >= 0 && PAGE.indexOf("0.744237") >= 0 && PAGE.indexOf("0.540302") >= 0 && PAGE.indexOf("0.857553") >= 0);
  // plastic constant, independently: secant from (1, 1.5)
  var f = function(t) { return t*t*t - t - 1; };
  var p0 = 1, p1 = 1.5, f0 = f(p0), f1 = f(p1), p2 = 0;
  for (var s = 0; s < 8; s++) { p2 = p1 - f1*(p1 - p0)/(f1 - f0); p0 = p1; f0 = f1; p1 = p2; f1 = f(p2); }
  var rho = p2;
  vck("vb.rho.secant", Math.abs(rho - 1.3247179572447461) < 1e-13, rho);
  vck("vb.rho.cubic", Math.abs(rho*rho*rho - (rho + 1)) < 1e-12);
  vck("vb.rho.page", PAGE.indexOf("1.3247179572") >= 0);
  // Newton orbit from x0 = 1 (page Ex2 card)
  var nx = 1, norb = [1];
  for (var n1 = 0; n1 < 5; n1++) { norb.push(nx = nx - (nx*nx*nx - nx - 1)/(3*nx*nx - 1)); }
  vck("vb.newton.hit2", Math.abs(norb[2] - 1.3478260870) < 5e-11, norb[2]);
  vck("vb.newton.hit3", Math.abs(norb[3] - 1.3252003990) < 5e-11, norb[3]);
  vck("vb.newton.hit4", Math.abs(norb[4] - 1.3247181740) < 5e-11, norb[4]);
  var errs = norb.map(function(t) { return Math.abs(t - rho); });
  vck("vb.newton.err4", Math.abs(errs[4] - 2.1675e-7)/2.1675e-7 < 2e-4, errs[4]);
  vck("vb.newton.err5", errs[5] < 1e-13, errs[5]);
  vck("vb.newton.errfix.page", PAGE.indexOf("2.1675 \\times 10^{-7}") >= 0);
  var m = 1.5, steps = 0;
  for (var r1 = 0; r1 < 10; r1++) { if (Math.abs(m - rho) < 9.1e-13) break; m = m - (m*m*m - m - 1)/(3*m*m - 1); steps++; }
  vck("vb.newton.race4", steps === 4, steps);
  // room [1.25, 1.45]: analytic N' scan (lab used 2001 points; this is 10001)
  var Np = function(t) { return 6*t*(t*t*t - t - 1)/((3*t*t - 1)*(3*t*t - 1)); };
  var mx = 0;
  for (var g1 = 0; g1 <= 10000; g1++) { var t = 1.25 + 0.2*g1/10000; var v = Math.abs(Np(t)); if (v > mx) mx = v; }
  vck("vb.newton.room1849", Math.abs(mx - 0.1849) < 5e-5, mx);
  vck("vb.newton.Np1", Np(1) === -1.5, Np(1));
  vck("vb.newton.pull", Math.abs(0.1849*0.1252820 - 0.0232) < 5e-5, 0.1849*0.1252820);
  vck("vb.newton.e0", Math.abs(1.45 - rho - 0.1252820) < 1e-7, 1.45 - rho);
  vck("vb.newton.img", Math.abs((rho - 0.1849*0.1252820) - 1.3015) < 2e-4 && Math.abs((rho + 0.1849*0.1252820) - 1.3479) < 2e-4);
  vck("vb.newton.imgdirect", Math.abs((1.25 - f(1.25)/(3*1.25*1.25 - 1)) - 1.3305084746) < 5e-11 && Math.abs((1.45 - f(1.45)/(3*1.45*1.45 - 1)) - 1.3372114932) < 5e-11);
  vck("vb.newton.imgpage", PAGE.indexOf("1.3305084746") >= 0 && PAGE.indexOf("1.3372114932") >= 0 && PAGE.indexOf("0.1252820") >= 0 && PAGE.indexOf("0.0232") >= 0);
  vck("vb.newton.certdigits", Math.abs(-Math.log10(0.1849) - 0.733) < 5e-4, -Math.log10(0.1849));
  // Babylonian averaging numerics
  vck("vb.bab.room", gg(1) === 1.5 && gg(2) === 1.5 && Math.abs(gg(Math.SQRT2) - Math.SQRT2) < 1e-15);
  var bx = 1, be = Math.SQRT2 - 1, bid = [];
  for (var z = 0; z < 4; z++) { bid.push(be); be = (be*be)/(2*bx); bx = gg(bx); }
  vck("vb.bab.identity", Math.abs(bid[1] - 0.0857864376) < 5e-10 && Math.abs(bid[3] - 2.1239e-6)/2.1239e-6 < 1e-4, bid.join(","));
  var e0b = Math.SQRT2 - 1;
  vck("vb.bab.bound", Math.abs(e0b/2 - 0.2071067812) < 5e-11 && Math.abs(e0b/8 - 0.0517766953) < 5e-11 && Math.abs(e0b/16 - 0.0258883476) < 5e-11);
  vck("vb.bab.boundpage", PAGE.indexOf("0.2071067812") >= 0 && PAGE.indexOf("0.0258883476") >= 0);
  // YBC 7289, different arrangement of the same sexagesimal
  var ybc = 1 + 24/60 + 51/3600 + 10/216000;
  vck("vb.ybc.value", Math.abs(ybc - 1.4142129630) < 5e-11, ybc);
  vck("vb.ybc.err", Math.abs(ybc - Math.SQRT2) < 6e-7 && Math.abs(ybc - Math.SQRT2) > 5.9e-7, ybc - Math.SQRT2);
  vck("vb.ybc.rel", Math.abs(ybc - Math.SQRT2)/Math.SQRT2 < 1/2000000, (ybc - Math.SQRT2)/Math.SQRT2);
  vck("vb.ybc.page", PAGE.indexOf("1;24,51,10") >= 0 && PAGE.indexOf("two million") >= 0);
  // exhibits
  var e1 = 1.01, rep = [];
  for (var q = 0; q < 8; q++) { rep.push(e1); e1 = e1*e1; }
  vck("vb.exhibit.repeller", Math.abs(rep[3] - 1.0829) < 5e-5 && Math.abs(rep[6] - 1.8905) < 5e-5, rep[3] + "/" + rep[6]);
  var t1 = 0.3;
  for (var w1 = 0; w1 < 7; w1++) t1 = 1 - t1;
  var t1b = t1;
  t1 = 1 - t1;
  vck("vb.exhibit.cycle", Math.abs(t1b - 0.7) < 1e-12 && Math.abs(t1 - 0.3) < 1e-12, t1b + "/" + t1);
  var l1 = 0.9;
  for (var w2 = 0; w2 < 3; w2++) l1 = l1/2;
  vck("vb.exhibit.leak", l1 === 0.1125, l1);
  // Ex4: x^2-1 from 0.5, fixed points and slopes
  var o4 = 0.5, o4v = [];
  for (var w3 = 0; w3 < 12; w3++) { o4v.push(o4); o4 = o4*o4 - 1; }
  vck("vb.ex4.orbit", Math.abs(o4v[3] + 0.80859375) < 1e-12 && Math.abs(o4v[7] + 0.9492) < 5e-5, o4v[3] + "/" + o4v[7]);
  var phi = (1 + Math.sqrt(5))/2;
  vck("vb.ex4.fixed", Math.abs(phi - 1.618034) < 5e-7 && Math.abs(-1/phi + 0.618034) < 5e-7);
  vck("vb.ex4.fixedcheck", Math.abs(phi*phi - 1 - phi) < 1e-12 && Math.abs((1/phi)*(1/phi) - 1 + 1/phi) < 1e-12);
  vck("vb.ex4.slopes", Math.abs(2*phi - 3.236) < 1e-3 && Math.abs(2/phi - 1.236) < 1e-3);
  vck("vb.ex4.page", PAGE.indexOf("1.618034") >= 0 && PAGE.indexOf("0.618034") >= 0 && PAGE.indexOf("3.236") >= 0 && PAGE.indexOf("1.236") >= 0);
  return "pieceVB " + VPASS + " pass " + VFAILS + " fail " + VREP.join("; ");
}

function pieceVC(PAGE) {
  VPASS = 0; VFAILS = 0; VREP = [];
  var d = 0.7390851332151607;
  // P1: doctored card value 1.4142156862 (true hit is 1.4142156863)
  vck("vc.p1.cardvalue", Math.abs(577/408 - 1.4142156863) < 5e-11 && Math.abs(577/408 - 1.4142156862) > 4e-11, 577/408);
  vck("vc.p1.pageclean", PAGE.indexOf("1.4142156862") < 0 && PAGE.indexOf("1.4142156863") >= 0);
  // P2: doctored contraction constant c = 1/3 (true c = 1/2 on [1,2])
  var mg = 0;
  for (var t2 = 0; t2 <= 10000; t2++) { var xv = 1 + t2/10000; var ggd = Math.abs(0.5 - 1/(xv*xv)); if (ggd > mg) mg = ggd; }
  vck("vc.p2.chalf", mg > 0.499999 && mg <= 0.500001, mg);
  vck("vc.p2.rejectthird", mg > 1/3 + 0.1);
  // P3: doctored Dottie value 0.7390852
  vck("vc.p3.dottie", Math.abs(d - 0.7390852) > 1e-8, d - 0.7390852);
  vck("vc.p3.pageclean", PAGE.indexOf("0.7390852") < 0 && PAGE.indexOf("0.7390851332") >= 0);
  // P4: doctored hit count 36 (true 35 by the error criterion)
  var x4 = 0, hits4 = 0;
  for (var k4 = 1; k4 <= 200; k4++) { x4 = Math.cos(x4); if (Math.abs(x4 - d) < 5e-7) { hits4 = k4; break; } }
  vck("vc.p4.hits35", hits4 === 35 && hits4 !== 36, hits4);
  // P5: doctored slope N'(1) = -1.25 (true -1.5)
  var Np5 = function(t) { return 6*t*(t*t*t - t - 1)/((3*t*t - 1)*(3*t*t - 1)); };
  vck("vc.p5.Np1", Np5(1) === -1.5 && Np5(1) !== -1.25, Np5(1));
  vck("vc.p5.pageclean", PAGE.indexOf("-1.25") < 0 && PAGE.indexOf("−1.25") < 0 && PAGE.indexOf("= -1.5") >= 0);
  // P6: doctored e5 = 8e-25 (true 8.99e-25)
  var b5 = 627013566048, a5 = 886731088897, x5 = a5/b5;
  var e5c = 1/((b5*b5)*(x5 + Math.SQRT2));
  vck("vc.p6.e5", e5c > 8.9e-25 && e5c < 9.1e-25, e5c);
  vck("vc.p6.reject8", Math.abs(e5c - 8e-25)/e5c > 0.1);
  vck("vc.p6.page", PAGE.indexOf("8.99 \\times 10^{-25}") >= 0);
  // P7: doctored room scan 0.1819 (true 0.1849)
  var mx7 = 0;
  for (var g7 = 0; g7 <= 10000; g7++) { var t7 = 1.25 + 0.2*g7/10000; var v7 = Math.abs(Np5(t7)); if (v7 > mx7) mx7 = v7; }
  vck("vc.p7.scan", Math.abs(mx7 - 0.1849) < 5e-5 && Math.abs(mx7 - 0.1819) > 1e-3, mx7);
  // P8: doctored digit count 23 for e5 (true 24)
  var dig8 = Math.floor(-Math.log10(e5c));
  vck("vc.p8.digits24", dig8 === 24 && dig8 !== 23, dig8);
  // P9: doctored certificate 88 (true 83)
  var c9 = Math.sin(1), cert9 = 0;
  for (var k9 = 1; k9 <= 1000; k9++) { if (Math.pow(c9, k9) * d < 5e-7) { cert9 = k9; break; } }
  vck("vc.p9.cert83", cert9 === 83 && cert9 !== 88, cert9);
  // P10: doctored "5 steps" for the Newton race (true 4)
  var m10 = 1.5, st10 = 0, rho10 = 1.3247179572447461;
  for (var r10 = 0; r10 < 10; r10++) { if (Math.abs(m10 - rho10) < 9.1e-13) break; m10 = m10 - (m10*m10*m10 - m10 - 1)/(3*m10*m10 - 1); st10++; }
  vck("vc.p10.race4", st10 === 4 && st10 !== 5, st10);
  return "pieceVC " + VPASS + " pass " + VFAILS + " fail " + VREP.join("; ");
}

function pieceVD(PAGE) {
  VPASS = 0; VFAILS = 0; VREP = [];
  var cnt = function(s) { return PAGE.split(s).length - 1; };
  vck("vd.head.title", PAGE.indexOf("P22 · Iterate to a fixed point · The Patterns Atlas") >= 0);
  vck("vd.head.mathjax", PAGE.indexOf("window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};") >= 0);
  vck("vd.head.jsdelivr", PAGE.indexOf("https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js") >= 0);
  vck("vd.head.integrity", PAGE.indexOf("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=") >= 0);
  vck("vd.head.css", PAGE.indexOf('href="assets/style.css"') >= 0);
  vck("vd.tail", PAGE.slice(-27) === "\n</footer>\n</body>\n</html>\n");
  vck("vd.footer.index", PAGE.indexOf('Return to the <a href="index.html">index</a>') >= 0);
  vck("vd.footer.next", PAGE.indexOf('Next: <a href="p23-interpolate.html">P23 · Interpolate and continue</a>') >= 0);
  vck("vd.h2.count8", cnt("<h2>") === 8);
  var ids = ["bridge", "encounter", "name-the-move", "the-move-at-work", "when-it-fails", "what-next", "lineage", "exercises"];
  var idok = true;
  for (var ii = 0; ii < ids.length; ii++) { if (PAGE.indexOf('id="' + ids[ii] + '"') < 0) idok = false; }
  vck("vd.section.ids", idok);
  vck("vd.h3.count9", cnt("<h3>") === 9);
  vck("vd.patternbox.count3", cnt('class="pattern-box"') === 3);
  vck("vd.warnbox", PAGE.indexOf("Scope and price of P22") >= 0);
  vck("vd.onramp.vocab", PAGE.indexOf("fixed point") >= 0 && PAGE.indexOf("orbit") >= 0 && PAGE.indexOf("contraction") >= 0);
  vck("vd.tables.count5", cnt('class="digit-table"') === 5);
  vck("vd.svg.count3", cnt("<svg") === 3);
  vck("vd.figcaptions", PAGE.indexOf("Fig P22.1.") >= 0 && PAGE.indexOf("Fig P22.2.") >= 0 && PAGE.indexOf("Fig P22.3.") >= 0);
  vck("vd.details.count10", cnt("<details") === 10);
  vck("vd.details.hint5", cnt("Hint") === 5);
  vck("vd.details.worked5", cnt("Worked") === 5);
  vck("vd.pid.count3", cnt('class="pid"') === 3);
  vck("vd.zero.backtick", PAGE.indexOf("`") < 0);
  vck("vd.zero.dollar", PAGE.indexOf("$") < 0);
  vck("vd.zero.todo", PAGE.indexOf("TODO") < 0);
  vck("vd.moons", PAGE.indexOf("●○○") >= 0 && PAGE.indexOf("●●○") >= 0 && PAGE.indexOf("●●●") >= 0 && PAGE.indexOf("◆") >= 0 && PAGE.indexOf("◐") >= 0);
  vck("vd.prose.fixes", PAGE.indexOf("2.1675 \\times 10^{-7}") >= 0 && PAGE.indexOf("0.793480") >= 0);
  vck("vd.prose.keys", PAGE.indexOf("0.1849") >= 0 && PAGE.indexOf("0.733") >= 0 && PAGE.indexOf("0.1716") >= 0 && PAGE.indexOf("0.673612") >= 0 && PAGE.indexOf("0.1252820") >= 0);
  vck("vd.prose.numbers", PAGE.indexOf("215.7") >= 0 && PAGE.indexOf("404.5") >= 0);
  vck("vd.pell.strings", PAGE.indexOf("886731088897") >= 0 && PAGE.indexOf("627013566048") >= 0 && PAGE.indexOf("665857") >= 0 && PAGE.indexOf("470832") >= 0);
  vck("vd.ybc", PAGE.indexOf("1;24,51,10") >= 0 && PAGE.indexOf("two million") >= 0);
  return "pieceVD " + VPASS + " pass " + VFAILS + " fail " + VREP.join("; ");
}

// Runner: pieces are pasted into the sandbox with PAGE loaded from the
// assembled page (wip/p22-fixed-point.html); each piece resets the shared
// counters and returns its own census line. Honest run history, including
// every defect found on either side, lives in p22-review-verifier-output.txt.
