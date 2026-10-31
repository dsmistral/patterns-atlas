// p69-review-verifier.js — adversarial re-verification of P69 "Telescoping".
// Zero code shared with p69-lab.js: own runner, own exact rationals (subtraction
// gcd, object form {t, b}), tail-first sums, conjugate and cross-multiplication
// routes. F01-F26 are fresh re-derivations that must PASS; I01-I16 are poisoned
// claims that must be REJECTED.
var OK = 0, BAD = 0, REJECTED = 0, LEAKED = 0, VLOG = [];
function check(name, ok) { if (ok) { OK++; VLOG.push("PASS " + name); } else { BAD++; VLOG.push("FAIL " + name); } }
function poison(name, isFalse) { if (isFalse) { REJECTED++; VLOG.push("REJECT " + name); } else { LEAKED++; VLOG.push("LEAK " + name); } }
function gcds(a, b) { a = Math.abs(a); b = Math.abs(b); while (a && b) { if (a > b) a -= b; else b -= a; } return a + b; }
function fr(t, b) { if (b < 0) { t = -t; b = -b; } var g = gcds(t, b) || 1; return { t: t / g, b: b / g }; }
function fa(x, y) { return fr(x.b * y.t + y.b * x.t, x.b * y.b); }
function fs(x, y) { return fr(y.b * x.t - x.b * y.t, x.b * y.b); }
function fm(x, y) { return fr(x.t * y.t, x.b * y.b); }
function feq(x, y) { return x.t * y.b === y.t * x.b; }
function flt(x, y) { return x.t * y.b < y.t * x.b; }
function num(x) { return x.t / x.b; }
// --- fresh re-derivations F01-F26 ---
// F01: S(100) by Kahan-compensated summation (different algorithm, same census).
var s = 0, c = 0;
for (var k = 1; k <= 100; k++) { var y = 1 / Math.sqrt(k) - c; var t = s + y; c = (t - s) - y; s = t; }
check("F01 S(100) = 18.5896 by Kahan walk", (Math.round(s * 10000) / 10000).toFixed(4) === "18.5896");
// F02: S(4) summed tail-first.
var s4 = 0;
for (var k4 = 4; k4 >= 1; k4--) s4 += 1 / Math.sqrt(k4);
check("F02 S(4) = 2.7845 tail-first", (Math.round(s4 * 10000) / 10000).toFixed(4) === "2.7845");
// F03: S(9) as S(12) minus the tail (a different subtraction route).
var s12 = 0; for (var k9 = 1; k9 <= 12; k9++) s12 += 1 / Math.sqrt(k9);
var s9 = s12 - (1 / Math.sqrt(10) + 1 / Math.sqrt(11) + 1 / Math.sqrt(12));
check("F03 S(9) = 4.7048 as S(12) minus tail", (Math.round(s9 * 10000) / 10000).toFixed(4) === "4.7048");
// F04: conjugate identity for the step, k=1..100.
var ok4 = true;
for (var k1 = 1; k1 <= 100; k1++) if (Math.abs((Math.sqrt(k1) - Math.sqrt(k1 - 1)) - 1 / (Math.sqrt(k1) + Math.sqrt(k1 - 1))) > 1e-14) ok4 = false;
check("F04 step = 1/(root k + root (k-1)), k=1..100", ok4);
// F05: the four-way chain at Fibonacci-ish k, floats.
var ks = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 199], ok5 = true;
for (var i = 0; i < ks.length; i++) {
  var kk = ks[i], term = 1 / Math.sqrt(kk), stp = Math.sqrt(kk) - Math.sqrt(kk - 1);
  if (!(0.5 * term <= stp + 1e-15 && stp <= term + 1e-15 && term <= 2 * stp + 1e-15)) ok5 = false;
}
check("F05 chain half <= step <= term <= two steps at 12 spaced k", ok5);
// F06: margin identity (3k+1)(k-1) hand-multiplied at k=5.
check("F06 margin 4*125*4 - 44^2 = 64 = (3*5+1)*4", 4 * 125 * 4 - 44 * 44 === 64 && (3 * 5 + 1) * 4 === 64);
// F07: window at n=100 by the conjugate route 2 - 2/(root101 + root100).
var w100 = 2 - 2 / (Math.sqrt(101) + Math.sqrt(100));
check("F07 window = 1.9002 via 2 - 2/(root 101 + root 100)", (Math.round(w100 * 10000) / 10000).toFixed(4) === "1.9002");
// F08: product telescope n=10 by subtraction-gcd fractions = 11/20.
var p = fr(1, 1);
for (var j = 2; j <= 10; j++) p = fm(p, fr(j * j - 1, j * j));
check("F08 prod(1-1/k^2), n=10 = 11/20 = (n+1)/(2n)", feq(p, fr(11, 20)));
// F09: chain one tail-first: prod (k-1)/k, n=10 = 1/10.
var q = fr(1, 1);
for (var j2 = 10; j2 >= 2; j2--) q = fm(q, fr(j2 - 1, j2));
check("F09 chain one = 1/n at n=10, multiplied tail-first", feq(q, fr(1, 10)));
// F10: chain two: prod (k+1)/k, n=10 = 11/2.
var q2 = fr(1, 1);
for (var j3 = 2; j3 <= 10; j3++) q2 = fm(q2, fr(j3 + 1, j3));
check("F10 chain two = (n+1)/2 at n=10", feq(q2, fr(11, 2)));
// F11: Exhibit A truth at n=3 by direct summation = survivor form 21/20.
var d3 = fr(0, 1);
for (var kA = 1; kA <= 3; kA++) d3 = fa(d3, fs(fr(1, kA), fr(1, kA + 2)));
check("F11 Exhibit A truth at n=3: direct = 1 + 1/2 - 1/4 - 1/5 = 21/20", feq(d3, fr(21, 20)));
// F12: the poisoned claim would pay 4/5 at n=3.
check("F12 claim 1 - 1/(n+2) pays 4/5 != 21/20 at n=3", !feq(fr(4, 5), d3));
// F13: Exhibit B tail fence at n=10, K=1000, float.
var tb = 0;
for (var kB = 11; kB <= 1000; kB++) tb += 1 / (kB * (kB - 1));
check("F13 tail sum_{k=11..1000} 1/(k(k-1)) = 0.099 = 1/10 - 1/1000", Math.abs(tb - 0.099) < 1e-12);
// F14: Exhibit C split at k=7.
check("F14 1/7 - 1/9 = 2/63 exactly (the factor-two disease)", feq(fs(fr(1, 7), fr(1, 9)), fr(2, 63)));
// F15: odd lattice at n=7 by direct summation = 7/15.
var o7 = fr(0, 1);
for (var kO = 1; kO <= 7; kO++) o7 = fa(o7, fr(1, 4 * kO * kO - 1));
check("F15 sum 1/(4k^2-1), k=1..7 = 7/15 = n/(2n+1)", feq(o7, fr(7, 15)));
// F16: c=2.005 fails at k=100 by integer cross-multiplication.
check("F16 root(101/100) < 201/200 iff 4040000 < 4040100 — c=2.005 fails at k=100",
   101 * 40000 < 100 * 40401 && 101 * 40000 === 4040000 && 100 * 40401 === 4040100);
// F17: Fibonacci squares via Binet-rounded generator (independent of the lab's recurrence array).
function fibB(n) { var phi = (1 + Math.sqrt(5)) / 2; return Math.round(Math.pow(phi, n) / Math.sqrt(5)); }
var sq = 0;
for (var kF = 1; kF <= 10; kF++) sq += fibB(kF) * fibB(kF);
check("F17 sum F_k^2, n=10 = 4895 = 55*89 (Binet-rounded F)", sq === 4895 && fibB(10) * fibB(11) === 4895);
// F18: Wallis p5 by double factorials, subtraction-gcd fractions.
function dfa(m) { var v = 1; for (var i = m; i >= 2; i -= 2) v *= i; return v; }
var pw = fm(fr(dfa(10), 1), fr(dfa(10), 1));
pw = fm(pw, fr(1, dfa(9))); pw = fm(pw, fr(1, dfa(11)));
check("F18 Wallis p5 = (10!!)^2/(9!!*11!!) = 65536/43659", feq(pw, fr(65536, 43659)));
// F19: Wallis p4 < p5 by cross-multiplication.
check("F19 p4 < p5: 16384*43659 < 65536*11025", 16384 * 43659 < 65536 * 11025);
// F20: the ninth dot of Fig P69.1, y computed from the F03 route.
var y9 = Math.round((230 - 30 * s9) * 10) / 10;
check("F20 dot 9 sits at y = 88.9 on the figure grid", y9 === 88.9);
// F21: the drawn stick by plain integer addition.
check("F21 1 + 3 + 6 + 10 + 15 = 35 by integer addition", 1 + 3 + 6 + 10 + 15 === 35);
// F22: Ex4(a) truth vs claim at n=2 differ.
check("F22 truth 1 - 1/root(3) = 0.4226, claim 1 - 1/root(2) = 0.2929 at n=2",
   (Math.round((1 - 1 / Math.sqrt(3)) * 10000) / 10000).toFixed(4) === "0.4226" &&
   (Math.round((1 - 1 / Math.sqrt(2)) * 10000) / 10000).toFixed(4) === "0.2929");
// F23: Ex4(b) truth at n=3: 4! - 2 = 22 = 2*2! + 3*3!.
var f6 = 1; for (var i6 = 2; i6 <= 4; i6++) f6 *= i6;
check("F23 sum k*k!, k=2..3 = 22 = 4! - 2", 2 * 2 + 3 * 6 === 22 && f6 - 2 === 22);
// F24: Ex4(c) honest sum at n=2: direct 1/4 + 1/10 = survivor form 7/20.
var dir = fa(fr(1, 4), fr(1, 10));
var surv = fm(fr(1, 3), fs(fr(11, 6), fa(fa(fr(1, 3), fr(1, 4)), fr(1, 5))));
check("F24 (1/4 + 1/10) = (1/3)(11/6 - 1/3 - 1/4 - 1/5) = 7/20", feq(dir, surv) && feq(dir, fr(7, 20)));
// F25: the B11 harmonic trap holds at n=100 (cross-page consistency).
var h100 = 0;
for (var kH = 1; kH <= 100; kH++) h100 += 1 / kH;
check("F25 ln(101) = 4.6151 <= H_100 = 5.1874 <= 1 + ln(100) = 5.6052",
   Math.log(101) <= h100 && h100 <= 1 + Math.log(100) &&
   (Math.round(h100 * 10000) / 10000).toFixed(4) === "5.1874");
// F26: approach speed identity 1/2 - u_k = (root(k+1) - root(k))^2 / 2 at k=10.
var u10 = Math.sqrt(10) * (Math.sqrt(11) - Math.sqrt(10));
check("F26 1/2 - u_10 = (root 11 - root 10)^2 / 2", Math.abs((0.5 - u10) - Math.pow(Math.sqrt(11) - Math.sqrt(10), 2) / 2) < 1e-12);
// --- poisoned injections I01-I16: each must be provably FALSE ---
var a2 = fa(fs(fr(1,1), fr(1,3)), fs(fr(1,2), fr(1,4)));
poison("I01 sum(1/k - 1/(k+2)) = 1 - 1/(n+2) dies at n=2", !feq(a2, fs(fr(1,1), fr(1,4))));
poison("I02 1/(k(k+2)) = 1/k - 1/(k+2) dies at k=1", !feq(fs(fr(1,1), fr(1,3)), fr(1,3)));
poison("I03 sum k*k! (k=2..n) = (n+1)! dies at n=2", 2 * 2 !== 6);
poison("I04 1/(4k^2-1) = 1/(2k-1) - 1/(2k+1) dies at k=1", !feq(fr(1,3), fs(fr(1,1), fr(1,3))));
poison("I05 prod(1-1/k^2) = 1/(n+1) dies at n=2", !feq(fr(3,4), fr(1,3)));
poison("I06 prod(1-1/k^2) = n/(n+1) dies at n=2", !feq(fr(3,4), fr(2,3)));
poison("I07 hockey stick = C(n, r+1) (wrong row) dies at r=2, n=6", 1 + 3 + 6 + 10 + 15 !== 20);
poison("I08 sum F_k^2 = F_n^2 dies at n=3", 1 + 1 + 4 !== 4);
poison("I09 sum F_k^2 = F_{n+1}^2 - 1 dies at n=1", 1 !== 1 * 1 - 1);
poison("I10 Wallis p_N = (2N)!!/(2N-1)!! alone dies at N=5", Math.abs(dfa(10) / dfa(9) - num(pw)) > 1);
poison("I11 c=3 workable dies at k=1", 3 * (Math.sqrt(2) - 1) > 1);
poison("I12 window width < 1 dies at n=1", 2 * Math.sqrt(1) - (2 * Math.sqrt(2) - 2) >= 1);
poison("I13 S_n <= root(n) dies at n=2", 1.7071067811865475 > Math.sqrt(2));
poison("I14 sum(1/root k - 1/root(k+1)) = 1 - 1/root(n) dies at n=1", Math.abs(0 - (1 - 1 / Math.sqrt(2))) > 0.29);
poison("I15 odd lattice = (n+1)/(2n+1) dies at n=1", !feq(fr(1,3), fr(2,3)));
poison("I16 S(100) = 18.5986 (transposed digit) is false", (Math.round(s * 10000) / 10000).toFixed(4) !== "18.5986");
// --- verdict ---
console.log("---- p69-review-verifier ----");
console.log("fresh: " + OK + " pass / " + BAD + " fail; injections: " + REJECTED + " rejected / " + LEAKED + " leaked");
for (var iv = 0; iv < VLOG.length; iv++) console.log(VLOG[iv]);
if (BAD === 0 && LEAKED === 0 && OK === 26 && REJECTED === 16) console.log("VERIFIER VERDICT: 26 fresh PASS, 16 injections REJECTED — page confirmed");
else console.log("VERIFIER VERDICT: IRREGULAR — inspect above");
