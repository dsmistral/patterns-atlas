// b11-review-verifier.js — adversarial verification for B11 (The discrete derivative and telescoping).
// Zero code shared with b11-lab.js: independent implementations, different summation orders,
// different rounding paths. Two kinds of checks:
//   FRESH (F##): a fact the page prints, re-derived independently — must PASS.
//   INJECT (I##): a poisoned version of a page fact — the verifier must REFUTE it.
// A check that is supposed to fail but passes is a verifier bug; every injection here was
// written to be one plausible misstep away from the true value.
let GOOD = 0, BAD = 0;
const LINES = [];
function fresh(id, cond, note) {
  if (cond) { GOOD++; LINES.push("PASS " + id + " fresh — " + note); }
  else { BAD++; LINES.push("FAIL " + id + " fresh — " + note); }
}
function inject(id, refuted, note) {
  if (refuted) { GOOD++; LINES.push("PASS " + id + " injection REJECTED — " + note); }
  else { BAD++; LINES.push("FAIL " + id + " injection ACCEPTED — " + note); }
}
function hsum(n) { // tail-first harmonic sum: opposite order from the lab's forward loop
  let s = 0;
  for (let k = n; k >= 1; k--) s += 1 / k;
  return s;
}
function cross(a, b, c, d) { return a * d - b * c; } // ad - bc
function r1(x) { return Math.round(x * 10 + 1e-7) / 10; }
function q4(x) { return Math.round(x * 10000 + 1e-7) / 10000; }
function d2(x) { return Math.round(x * 100 + 1e-7) / 100; }
function ff(k, m) { let p = 1; let j = k; while (j > k - m) { p *= j; j--; } return p; }
// —— Fresh checks: the page's facts, re-derived independently ——
(function () {
  fresh("F01", cross(50, 60, 4, 5) !== 0 && cross(50, 60, 5, 6) === 0, "Lecture 0: 50/60 is 5/6, not 4/5");
  fresh("F02", cross(1, 2, 30, 60) === 0 && cross(1, 6, 10, 60) === 0 && cross(1, 12, 5, 60) === 0 && cross(1, 20, 3, 60) === 0 && cross(1, 30, 2, 60) === 0,
    "the sixtieths column: 30, 10, 5, 3, 2 sixtieths, checked by cross-multiplication");
  fresh("F03", (function () { let s = 0; for (let k = 1; k <= 40; k++) s += 1 / (k * (k + 1)); return Math.abs(s - 40 / 41) < 1e-12; })(),
    "n = 40 survivors 40/41, float, forward sum");
  fresh("F04", (function () { let s = 0; for (let k = 40; k >= 1; k--) s += 1 / (k * (k + 1)); return Math.abs(s - 40 / 41) < 1e-12; })(),
    "the same sum, tail-first — order does not matter at this size");
  fresh("F05", hsum(1) === 1 && hsum(2) === 1.5 && q4(hsum(4)) === 2.0833 && q4(hsum(12)) === 3.1032,
    "H_1 = 1, H_2 = 1.5, H_4 = 2.0833, H_12 = 3.1032, tail-first");
  fresh("F06", hsum(12366) < 10 && hsum(12367) > 10, "the crossing: H_12366 < 10 < H_12367, tail-first sum");
  fresh("F07", Math.log(22027) > 10 && Math.log(22026) < 10, "ln(22027) > 10 > ln(22026): the lower arm guarantees the crossing by n = 22026");
  fresh("F08", Math.log(8103) < 9 && Math.log(8104) > 9, "ln(8103) < 9 < ln(8104): the upper arm holds H_n < 10 through n = 8103");
  fresh("F09", (function () { let s = 0; for (let k = 1; k <= 100; k++) s += k; return s === 5050 && s === 100 * 101 / 2; })(),
    "Gauss at full size: 1 + ... + 100 = 5050 = 100*101/2");
  fresh("F10", (function () { let s = 0; for (let k = 1; k <= 10; k++) s += k * k; return s === 385 && s === 10 * 11 * 21 / 6; })(),
    "squares at n = 10: 385 = 10*11*21/6");
  fresh("F11", 1 + 4 + 18 + 96 === 119 && (2 - 1) + (6 - 2) + (24 - 6) + (120 - 24) === 119, "1+4+18+96 = 119 = (2-1)+(6-2)+(24-6)+(120-24), the telescoping regrouping");
  fresh("F12", 120 - 1 === 119, "5! - 1 = 119");
  fresh("F13", Math.abs((1 / 2 + 1 / 4 + 1 / 8 + 1 / 16) - 0.9375) < 1e-15 && 0.9375 === 15 / 16, "1/2+1/4+1/8+1/16 = 15/16 = 0.9375");
  fresh("F14", (243 - 1) / 2 === 121 && 1 + 3 + 9 + 27 + 81 === 121, "geometric r = 3, n = 5: 121 both ways");
  fresh("F15", Math.abs((1 / 3 + 1 / 8 + 1 / 15 + 1 / 24) - 17 / 30) < 1e-15, "two-slot hand sum 17/30");
  fresh("F16", Math.abs((1 / 4 - 1 / 40) - 9 / 40) < 1e-15 && Math.abs((1 / 6 + 1 / 24 + 1 / 60) - 9 / 40) < 1e-15,
    "triple-slot at n = 3: 1/4 - 1/40 = 9/40 = 1/6 + 1/24 + 1/60");
  fresh("F17", ff(8, 3) - ff(7, 3) === 126 && 3 * ff(7, 2) === 126, "falling factorial step at k = 7: 336 - 210 = 126 = 3*42");
  fresh("F18", ff(9, 3) + 3 * ff(9, 2) + ff(9, 1) === 729, "k^3 row at k = 9: 504 + 216 + 9 = 729");
  fresh("F19", ff(10, 4) === 5040 && 24 * 210 === 5040, "P23 pin at (k, m) = (10, 4): 10__4 = 4!*C(10,4) = 5040");
  fresh("F20", 1024 - 512 === 512, "2^10 - 2^9 = 2^9: the fixed point at k = 9");
  fresh("F21", 243 - 81 === 162 && 2 * 81 === 162, "Delta(3^4) = (r-1)r^4 = 162, both groupings");
  fresh("F22", q4(hsum(8)) === 2.7179, "H_8 = 2.7179 to four decimals, tail-first");
  fresh("F23", q4(hsum(1000000) - Math.log(1000000)) === 0.5772, "gamma at n = 10^6, tail-first: 0.5772");
  fresh("F24", r1(230 - 55 * 2.564949) === 88.9 && q4(Math.log(13)) === 2.5649, "Fig B11.3 lower arm at n = 12: ln(13) = 2.5649, y = 88.9");
  fresh("F25", r1(230 - 55 * 3.484907) === 38.3 && q4(1 + Math.log(12)) === 3.4849, "Fig B11.3 upper arm at n = 12: 1 + ln(12) = 3.4849, y = 38.3");
  fresh("F26", 220 - 40 === 180 && 12 * 15 === 180 && 220 - 12 * 10 === 100, "Fig B11.2: net 180 px = 12*15, and the k = 4 landing is y = 100");
})();
// —— Injections: poisoned twins of page facts; the verifier must REJECT each one ——
(function () {
  inject("I01", cross(50, 60, 4, 5) !== 0, "poisoned sixtieths total: 50/60 reduced to 4/5 — refuted");
  inject("I02", (function () { let s = 0; for (let k = 1; k <= 100; k++) s += 1 / (k * (k + 1)); return Math.abs(s - 1) > 1e-9; })(),
    "poisoned survivors: the n = 100 sum equals 1 — refuted (it is 100/101)");
  inject("I03", cross(1, 2, 29, 30) !== 0 || cross(1, 3, 29, 30) !== 0 || cross(1, 5, 29, 30) !== 0,
    "poisoned counter-probe: 1/2 + 1/3 + 1/5 = 29/30 — refuted");
  inject("I04", (function () { let s = 0; for (let k = 1; k <= 5; k++) s += k; return s !== 16; })(),
    "poisoned Gauss: sum 1..5 = 16 — refuted (it is 15)");
  inject("I05", (function () { let s = 0; for (let k = 1; k <= 5; k++) s += k * k; return s !== 54; })(),
    "poisoned squares: 1 + 4 + 9 + 16 + 25 = 54 — refuted (it is 55)");
  inject("I06", (function () { let s = 0; for (let k = 1; k <= 5; k++) s += Math.pow(3, k); return s !== 122; })(),
    "poisoned geometric: 1 + 3 + 9 + 27 + 81 = 122 — refuted (it is 121)");
  inject("I07", Math.abs(1 - 1 / 16 - 7 / 8) > 1e-15, "poisoned halving: 1 - 1/16 = 7/8 — refuted (it is 15/16)");
  inject("I08", 120 - 1 !== 118, "poisoned factorial: 5! - 1 = 118 — refuted (it is 119)");
  inject("I09", Math.abs(17 / 30 - 1 / 2) > 1e-15, "poisoned two-slot: 17/30 equals 1/2 — refuted");
  inject("I10", Math.abs(9 / 40 - 1 / 4) > 1e-15, "poisoned triple-slot: 9/40 equals 1/4 — refuted");
  inject("I11", hsum(12366) < 10, "poisoned crossing: first past 10 at n = 12,366 — refuted by tail-first sum");
  inject("I12", q4(5672 / 10000) !== q4(hsum(1000000) - Math.log(1000000)), "poisoned gamma: 0.5672 — refuted (it is 0.5772)");
  inject("I13", Math.floor(Math.exp(9)) !== 8203, "poisoned arm: e^9 = 8203 — refuted (it is 8103)");
  inject("I14", (function () { let ok = true; for (let k = 1; k <= 8; k++) if (Math.pow(3, k + 1) - Math.pow(3, k) === Math.pow(3, k)) ok = false; return ok; })(),
    "poisoned fixed point: 3^k is its own step — refuted (the step is 2*3^k)");
  inject("I15", ff(8, 3) - ff(7, 3) !== 2 * ff(7, 2), "poisoned falling-factorial step: Delta(k^^3) = 2k^^2 — refuted (it is 3k^^2)");
  inject("I16", q4(hsum(8)) !== 2.8179, "poisoned table: H_8 = 2.8179 — refuted (it is 2.7179)");
})();
// —— Verdict ——
console.log(LINES.join("\n"));
console.log("TOTAL: " + GOOD + " PASS, " + BAD + " FAIL — " + (26) + " fresh + " + (16) + " injections");
