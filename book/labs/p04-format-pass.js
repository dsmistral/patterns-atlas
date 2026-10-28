// labs/p04-format-pass.js — P04 formatting retrofit pass (R1) verifier, session S14.
// Fresh engine, zero shared code with the R0 lab: every numeric claim on the page
// re-verified against the R0 receipts (labs/p04-lab-output.txt), plus TeX and SVG
// sanity. The page for this pass is a fresh re-assembly: a full platform restart
// destroyed the prior session's scratch state mid-pass, so the R1 page was rebuilt
// programmatically from the R0 master (byte-verified) and the P03 conventions.
// Engine constraints: recorded transcript pieces (<= 4KB each), no recursion,
// no BigInt in the value path, deterministic (no randomness used).
// Honest run history: pieces 1-5, 7, 8 ran clean on run 1; piece 6 run 1 carried
// a malformed evidence line (the Ex4 factor-pair route's y-formula read -16
// instead of -6, so the route check reported false while the page's solutions were
// already confirmed by the scan route and the both-sides-392 checks in the same
// run) — fixed and re-run; piece 9 run 1's eq-class expectation read 5, but the
// honest count is 6 (five equations plus the R1 entry's own prose mention) — an
// expectation annotation defect, corrected and re-run (every other piece-9 line
// identical); piece 10 run 1 revealed the run-history clause quoted the class
// attribute a second time (literal count 7) — reworded; after the R1 entry was
// amended to record that incident, the final re-check is recorded. P1..P9 ran
// against the pre-fill page (placeholder present, expected 1); P10 is the
// post-fill re-check of the final page. No mathematical check ever failed.

// ---- P1: al-Khwārizmī roots, positivity, doubled identity (R0 receipts 1a-1e) ----
async function piece1() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P1: al-Khwārizmī roots, positivity, doubled identity (vs R0 receipts 1a-1e)");
  for (const x of [3, -13]) p("F1 x=" + x + ": x^2+10x = " + (x * x + 10 * x) + " (receipt 1a: 39, 39)");
  p("F2 (x+5)^2 at x=3 -> " + ((3 + 5) * (3 + 5)) + " | at x=-13 -> " + ((-13 + 5) * (-13 + 5)) + " (receipt 1b: 64, 64)");
  p("F2b page's own checks: 9+30 = " + (9 + 30) + " | 169-130 = " + (169 - 130) + " (page: 39, 39)");
  p("F2c both signs of the root: 3 and -13 from (x+5)^2 = 64 (page's ± discipline, P78)");
  let minV = Infinity, minX = 99;
  for (let x = -30; x <= 30; x++) { const v = x * x + 10 * x + 41; if (v < minV) { minV = v; minX = x; } }
  p("F3 min x^2+10x+41 over integers -30..30: " + minV + " at x=" + minX + " (receipt 1c: 16 at -5)");
  let below16 = 0;
  for (let x = -30; x <= 30; x++) if (x * x + 10 * x + 41 < 16) below16++;
  p("F3b grid values below 16 (page: always at least 16): " + below16 + " (expect 0)");
  let checks = 0, mism = 0;
  for (let b = -12; b <= 12; b++) for (let c = -12; c <= 12; c++) for (let x = -8; x <= 8; x++) {
    checks++;
    if (4 * (x * x + b * x + c) !== (2 * x + b) * (2 * x + b) + 4 * c - b * b) mism++;
  }
  p("F4 doubled identity 4(x^2+bx+c)=(2x+b)^2+4c-b^2 over b,c in [-12,12], x in [-8,8]: checks=" + checks + " mismatches=" + mism + " (receipt 1d: 10625, 0)");
  let below = 0;
  for (let b = -10; b <= 10; b++) for (let c = -10; c <= 10; c++) for (let x = -20; x <= 20; x++)
    if (4 * (x * x + b * x + c) < 4 * c - b * b) below++;
  p("F5 grid values below the vertex leftover: " + below + " (receipt 1e: 0)");
  p("F5b the corner: 5 x 5 = " + (5 * 5) + " (page: 25); trial factorization 39 = 3 x 13 (page's encounter)");
  return out;
}
// ---- P2: quadratic formula two routes + Vieta + Exercises 1-2 (R0 receipts 2a-2f) ----
async function piece2() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P2: quadratic formula two routes + Vieta + Exercises 1-2 (vs R0 receipts 2a-2f)");
  let real = 0, complex = 0, agree = 0, dis = 0, subst = 0, vieta = 0, perfect = 0, pFail = 0;
  for (let a = 1; a <= 4; a++) for (let b = -8; b <= 8; b++) for (let c = -8; c <= 8; c++) {
    const disc = b * b - 4 * a * c;
    if (disc < 0) { complex++; continue; }
    real++;
    const s = Math.sqrt(disc);
    const r1 = (-b + s) / (2 * a), r2 = (-b - s) / (2 * a);
    const h = -b / (2 * a);
    const k = (4 * a * c - b * b) / (4 * a);
    const lift = Math.sqrt(-k / a);
    if (Math.abs(Math.abs(r1 - h) - lift) < 1e-9 && Math.abs(Math.abs(r2 - h) - lift) < 1e-9) agree++; else dis++;
    if (Math.abs(a * r1 * r1 + b * r1 + c) > 1e-6 || Math.abs(a * r2 * r2 + b * r2 + c) > 1e-6) subst++;
    if (Math.abs(r1 + r2 + b / a) > 1e-9 || Math.abs(r1 * r2 - c / a) > 1e-9) vieta++;
    if (s === Math.floor(s)) {
      perfect++;
      for (const num of [-b + s, -b - s]) if (a * num * num + b * num * (2 * a) + c * (2 * a) * (2 * a) !== 0) pFail++;
    }
  }
  p("G1 cases: real=" + real + " complex=" + complex + " (receipt 2a: 786, 370)");
  p("G2 formula route vs vertex-form route: agreement=" + agree + " disagreements=" + dis + " (receipt 2a: 786, 0)");
  p("G3 substitution failures=" + subst + " | Vieta sum/product failures=" + vieta + " (receipt 2b: 0, 0)");
  p("G4 perfect-square discriminants=" + perfect + " | exact integer root-check failures=" + pFail + " (receipt 2c: 229, 0)");
  let m1 = 0, m2 = 0;
  for (let x = -30; x <= 30; x++) {
    if (x * x - 8 * x + 3 !== (x - 4) * (x - 4) - 13) m1++;
    if (2 * x * x + 12 * x + 7 !== 2 * (x + 3) * (x + 3) - 11) m2++;
  }
  p("G5 Ex1 x^2-8x+3=(x-4)^2-13 mismatches over [-30,30]: " + m1 + " | Ex2 2x^2+12x+7=2(x+3)^2-11 mismatches: " + m2 + " (receipt 2d: 0, 0)");
  let min1 = Infinity, a1 = 0, min2 = Infinity, a2 = 0;
  for (let x = -30; x <= 30; x++) {
    const v1 = x * x - 8 * x + 3, v2 = 2 * x * x + 12 * x + 7;
    if (v1 < min1) { min1 = v1; a1 = x; }
    if (v2 < min2) { min2 = v2; a2 = x; }
  }
  p("G6 Ex1 min = " + min1 + " at x=" + a1 + " (receipt 2e: -13 at 4) | Ex2 min = " + min2 + " at x=" + a2 + " (receipt 2e: -11 at -3)");
  p("G6b the wrong corner's suggestion: Ex2 value at x=-2 = " + (2 * 4 - 24 + 7) + " (page: -9 at -2, above the true min -11 at -3)");
  p("G7 half-of-the-middle checks: Ex1 half of -8 = -4, corner (-4)^2 = " + ((-4) * (-4)) + " (page hint: 16)");
  return out;
}
// ---- P3: the circle exemplar (R0 receipts 3a-3f) ----
async function piece3() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P3: the circle exemplar x^2+y^2-6x+4y-12=0 (vs R0 receipts 3a-3f)");
  const orig = (x: number, y: number) => x * x + y * y - 6 * x + 4 * y - 12;
  p("H1 leftover sum 3^2 + 2^2 + 12 = " + (3 * 3 + 2 * 2 + 12) + " (receipt 3a: 25, radius 5, center (3,-2))");
  let ag = 0, dg = 0, on = 0;
  const onList: string[] = [];
  for (let x = -5; x <= 11; x++) for (let y = -8; y <= 4; y++) {
    const o = orig(x, y) === 0;
    const c = (x - 3) * (x - 3) + (y + 2) * (y + 2) === 25;
    if (o === c) ag++; else dg++;
    if (o) { on++; onList.push("(" + x + "," + y + ")"); }
  }
  p("H2 round-trip agreement over box x[-5,11], y[-8,4]: " + ag + " disagreements: " + dg + " (receipt 3b: 221, 0)");
  p("H3 integer points on the curve: " + on + " -> " + onList.join(" ") + " (receipt 3c: 12)");
  let maxDev = 0;
  for (let i = 0; i < 240; i++) {
    const th = (i * Math.PI) / 120;
    const d = Math.abs(orig(3 + 5 * Math.cos(th), -2 + 5 * Math.sin(th)));
    if (d > maxDev) maxDev = d;
  }
  p("H4 parametric route, 240 samples: max |original eq| = " + maxDev.toExponential(2) + " (receipt 3d: 1.42e-14; page: 1.4e-14)");
  p("H5 the near-miss (3,2): original = " + orig(3, 2) + " (receipt 3e: -9) | true on-curve spot (3,-7): " + orig(3, -7));
  let eAg = 0, eDg = 0, eOn = 0;
  const eList: string[] = [];
  for (let x = -4; x <= 8; x++) for (let y = -9; y <= 3; y++) {
    const o = x * x - 4 * x + y * y + 6 * y === 3;
    const c = (x - 2) * (x - 2) + (y + 3) * (y + 3) === 16;
    if (o === c) eAg++; else eDg++;
    if (o) { eOn++; eList.push("(" + x + "," + y + ")"); }
  }
  p("H5b exercise conic x^2-4x+y^2+6y=3: agreements=" + eAg + " disagreements=" + eDg + " | integer points: " + eOn + " -> " + eList.join(" ") + " (receipt 3f: 169, 0, 4 — radius 4 = 2^2 admits only the 4 axis points)");
  return out;
}
// ---- P4: Diophantine exemplar + Exercise 4 + Babylonian route (R0 receipts 4a-4h) ----
async function piece4() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P4: Diophantine exemplar + Exercise 4 + Babylonian doubled route (vs R0 receipts 4a-4h)");
  const scan: string[] = [];
  for (let x = -20; x <= 20; x++) for (let y = -20; y <= 20; y++)
    if (x * x + 6 * x === y * y + 4 * y) scan.push("(" + x + "," + y + ")");
  p("I1 scan x^2+6x = y^2+4y over [-20,20]^2: " + scan.length + " solutions -> " + scan.sort().join(" ") + " (receipt 4a: 4)");
  const routeA: string[] = [];
  for (const d of [1, 5, -1, -5]) {
    const e = 5 / d;
    const x = (d + e - 6) / 2, y = (e - d - 4) / 2;
    if (Number.isInteger(x) && Number.isInteger(y)) routeA.push("(" + x + "," + y + ")");
  }
  p("I2 factor-pair route (x-y+1)(x+y+5)=5: " + routeA.length + " solutions -> " + routeA.sort().join(" ") + " (receipt 4b: 4)");
  p("I3 routes agree: " + (JSON.stringify(scan.sort()) === JSON.stringify(routeA.sort())) + " (receipt 4c: true)");
  const scanE: string[] = [];
  for (let x = -40; x <= 40; x++) for (let y = -40; y <= 40; y++)
    if (x * x + 14 * x === y * y + 6 * y + 1) scanE.push("(" + x + "," + y + ")");
  p("I4 Ex4 scan x^2+14x = y^2+6y+1 over [-40,40]^2: " + scanE.length + " -> " + scanE.sort().join(" ") + " (receipt 4d: 4 -> (-28,-23) (-28,17) (14,-23) (14,17))");
  let all392 = true;
  for (const [x, y] of [[14, 17], [14, -23], [-28, -23], [-28, 17]])
    if (x * x + 14 * x !== 392 || y * y + 6 * y + 1 !== 392) all392 = false;
  p("I5 all four Ex4 solutions give both sides = 392: " + all392 + " (receipt 4e: 392 = 392 each time)");
  p("I6 Babylonian doubled route: (2x-7)^2 = " + ((2 * 12 - 7) * (2 * 12 - 7)) + " = 17^2 (receipt 4f: 289) — a perfect square, as the doubled route needs");
  p("I7 tablet answer x=12, y=5: x-y = " + (12 - 5) + " | xy = " + (12 * 5) + " (receipt 4g: 7, 60)");
  p("I8 modern second sign x=-5, y=-12: x-y = " + (-5 - -12) + " | xy = " + (-5 * -12) + " | (2*(-5)-7)^2 = " + ((2 * -5 - 7) * (2 * -5 - 7)) + " (receipts 4g/4h: 7, 60, 289)");
  return out;
}
// ---- P5: integral exemplar + Exercise 5 quartic + cross-term (R0 receipts 5a-5e) ----
async function piece5() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P5: integral exemplar + Exercise 5 quartic + cross-term positivity (vs R0 receipts 5a-5e)");
  const f = (x: number) => 1 / (x * x + 4 * x + 13);
  const F = (x: number) => (1 / 3) * Math.atan((x + 2) / 3);
  p("J1 completed denominator at x=0: (x+2)^2+9 -> " + ((0 + 2) * (0 + 2) + 9) + " | x^2+4x+13 -> " + (0 + 0 + 13) + " (receipt 5a: 13, 13)");
  const h = 1e-6;
  let maxErr = 0;
  for (let x = -12; x <= 12; x += 0.5) {
    const d = (F(x + h) - F(x - h)) / (2 * h);
    if (Math.abs(d - f(x)) > maxErr) maxErr = Math.abs(d - f(x));
  }
  p("J2 derivative round-trip (central diff), x=-12..12 step 0.5: max |err| = " + maxErr.toExponential(2) + " (receipt 5b: 5.21e-11; page: 5.2e-11)");
  const n = 1200, lo = -6, hi = 4, w = (hi - lo) / n;
  let s = f(lo) + f(hi);
  for (let i = 1; i < n; i++) s += (i % 2 === 1 ? 4 : 2) * f(lo + i * w);
  const simp = (w / 3) * s;
  const exact = F(hi) - F(lo);
  p("J3 Simpson(1200) on [-6,4]: " + simp.toFixed(9) + " | antiderivative: " + exact.toFixed(9) + " | diff = " + Math.abs(simp - exact).toExponential(2) + " (receipt 5c: 0.678147979, 0.678147979, 7.19e-14; page: 7.2e-14)");
  let mism = 0, neg = 0, minV = Infinity, minX = 0;
  for (let x = -30; x <= 30; x++) {
    if (x * x * x * x - 4 * x * x + 4 !== (x * x - 2) * (x * x - 2)) mism++;
    const v = x * x * x * x - 4 * x * x + 4;
    if (v < minV) { minV = v; minX = x; }
    if (v < 0) neg++;
  }
  p("J4 Ex5 quartic x^4-4x^2+4=(x^2-2)^2 mismatches over [-30,30]: " + mism + " | negatives: " + neg + " | grid min: " + minV + " at x=" + minX + " (receipt 5d: 0, 0, 1 at -1; true min 0 at x=±sqrt(2), outside the grid)");
  let cm = 0, cneg = 0;
  for (let x = -10; x <= 10; x++) for (let y = -10; y <= 10; y++) {
    if (x * x + 4 * x * y + 5 * y * y !== (x + 2 * y) * (x + 2 * y) + y * y) cm++;
    if (x * x + 4 * x * y + 5 * y * y < 0) cneg++;
  }
  p("J5 cross-term x^2+4xy+5y^2=(x+2y)^2+y^2 mismatches over [-10,10]^2: " + cm + " | negatives: " + cneg + " (receipt 5e: 0, 0 — a sum of two squares, never negative)");
  return out;
}
// ---- P6: page-embedded numeric claims (figure geometry, factor pairs, relations) ----
async function piece6() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P6: page-embedded numeric claims (gnomon areas, parabola values, factor pairs, leftover/discriminant)");
  p("K1 gnomon area identity: 90^2 + 2*90*75 + 75^2 = " + (90 * 90 + 2 * 90 * 75 + 75 * 75) + " = 165^2 = " + (165 * 165) + " (page/R1 entry: 27,225)");
  p("K2 parabola vertex: (-5+5)^2+16 = " + ((-5 + 5) * (-5 + 5) + 16) + " (page: vertex (−5, 16), minimum 16)");
  p("K3 parabola endpoints: at x=-13: 64+16 = " + (64 + 16) + " | at x=3: 64+16 = " + (64 + 16) + " (page/figure: 80 at both ends)");
  let minP = Infinity, argP = 0;
  for (let k = 0; k <= 1120; k++) { const x = -13 + k / 40; const v = (x + 5) * (x + 5) + 16; if (v < minP) { minP = v; argP = x; } }
  p("K4 fine grid x in [-13,3] step 0.025: min = " + minP + " at x=" + argP.toFixed(2) + " (never dips below 16)");
  let isPrime = true;
  for (let d = 2; d * d <= 41; d++) if (41 % d === 0) isPrime = false;
  p("K5 41 is prime: " + isPrime + " | factor pairs of 41: (1,41) (41,1) (-1,-41) (-41,-1) (page Ex4)");
  let pairsOK = true;
  for (const pair of [[1, 41], [41, 1], [-1, -41], [-41, -1]]) {
    const d = pair[0], e = pair[1];
    const x = (d + e - 14) / 2, y = (e - d - 6) / 2;
    if (!Number.isInteger(x) || !Number.isInteger(y) || (x - y + 4) * (x + y + 10) !== 41) pairsOK = false;
  }
  p("K6 Ex4 factor-pair route (x-y+4)(x+y+10)=41 yields 4 integer solutions: " + pairsOK + " (page: (14,17) (14,-23) (-28,-23) (-28,17))");
  let ex2OK = true;
  for (const pair of [[1, 5], [5, 1], [-1, -5], [-5, -1]]) {
    const d = pair[0], e = pair[1];
    const x = (d + e - 6) / 2, y = (e - d - 4) / 2;
    if (!Number.isInteger(x) || !Number.isInteger(y)) ex2OK = false;
  }
  p("K7 Ex2 factor pairs (1,5) (5,1) (-1,-5) (-5,-1) all give integer solutions: " + ex2OK + " (page: (0,0) (0,-4) (-6,-4) (-6,0))");
  let relOK = true;
  for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
    const rhsLeft = (b * b) / 4 - c;
    const disc = b * b - 4 * c;
    if (Math.abs(disc - 4 * rhsLeft) > 1e-9) relOK = false;
    let vmin = Infinity;
    for (let i = 0; i <= 1600; i++) { const x = -40 + i * 0.05; const v = x * x + b * x + c; if (v < vmin) vmin = v; }
    const wantRoots = rhsLeft > 0 ? 2 : (rhsLeft === 0 ? 1 : 0);
    const gotRoots = disc > 0 ? 2 : (disc === 0 ? 1 : 0);
    if (wantRoots !== gotRoots) relOK = false;
    if (Math.abs(vmin + rhsLeft) > 0.01) relOK = false;
  }
  p("K8 Example 1's leftover (monic b^2/4 - c): disc = 4*leftover exactly; positive -> two real roots, zero -> one, negative -> none; grid min = -leftover (b,c in [-4,4]): " + relOK + " (page's sign rule)");
  let ex6OK = true;
  for (let b = -6; b <= 6; b++) for (let c = -6; c <= 6; c++) {
    const ex6Left = c - (b * b) / 4;
    if (Math.abs((b * b - 4 * c) + 4 * ex6Left) > 1e-9) ex6OK = false;
  }
  p("K9 Exercise 6's leftover c - b^2/4: disc = -4*leftover (opposite sign, the relation part (b) asks for), over b,c in [-6,6]: " + ex6OK);
  p("K9b registry cameo numbers: at b=10, c=41: corner (b/2)^2 = " + (5 * 5) + ", Ex6-style leftover = " + (41 - 25) + " (page: 25 paid, 16 left)");
  return out;
}
// ---- P7: Fig P04.1 gnomon geometry (M1-M7) ----
async function piece7() {
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.text ?? r.content ?? String(r);
  };
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P7: Fig P04.1 gnomon geometry (labs-src/fig-p04-1.svg)");
  const f = await read("labs-src/fig-p04-1.svg");
  const vb = f.match(/viewBox="0 0 (\d+) (\d+)"/);
  p("M1 viewBox = " + (vb ? vb[1] + "x" + vb[2] : "MISSING") + " (expect 220x262) | href/xlink refs = " + ((f.split("href").length - 1) + (f.split("xlink").length - 1)) + " (expect 0)");
  const rects: number[][] = [];
  const rr = /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g;
  let m: any;
  while ((m = rr.exec(f)) !== null) rects.push([Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])]);
  const want = [[20, 150, 90, 90], [110, 150, 75, 90], [20, 75, 90, 75], [110, 75, 75, 75]];
  let rectsOK = rects.length === 4;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (rects[i] && rects[i][j] !== want[i][j]) rectsOK = false;
  p("M2 rects parsed = " + rects.length + " (expect 4): " + JSON.stringify(rects) + " exact geometry = " + rectsOK);
  const x0 = Math.min(20, 110), x1 = Math.max(20 + 90, 110 + 75), y0 = Math.min(150, 75), y1 = Math.max(150 + 90, 75 + 75);
  p("M3 assembled square spans x " + x0 + ".." + x1 + " (side " + (x1 - x0) + "), y " + y0 + ".." + y1 + " (side " + (y1 - y0) + ") — both sides 165 = " + ((x1 - x0) === 165 && (y1 - y0) === 165));
  p("M4 area identity: 90^2 + 2*90*75 + 75^2 = " + (90 * 90 + 2 * 90 * 75 + 75 * 75) + " = 165^2 = " + (165 * 165) + " (page/R1 entry: 27,225)");
  p("M5 dashed missing corner present: " + (f.indexOf('stroke-dasharray="6 4"') >= 0) + " | corner rect 75x75 at (110,75): " + (f.indexOf('x="110" y="75" width="75" height="75"') >= 0));
  const labels: string[] = [];
  const tr = /<text[^>]*>([^<]*)<\/text>/g;
  while ((m = tr.exec(f)) !== null) labels.push(m[1]);
  const wantLabels = ["x²", "5x", "5x", "25", "x", "5", "x", "5"];
  let labelsOK = labels.length === 8;
  for (let i = 0; i < 8; i++) if (labels[i] !== wantLabels[i]) labelsOK = false;
  p("M6 text labels = " + labels.length + " (expect 8): [" + labels.join(", ") + "] matches expected multiset/order = " + labelsOK);
  const W = Number(vb[1]), H = Number(vb[2]);
  let inb = true, ncoord = 0, worst = 0;
  const re = /([a-z0-9]+)="(-?[\d.]+)"/g;
  while ((m = re.exec(f)) !== null) {
    const k = m[1], v = Number(m[2]);
    if (["x", "y", "cx", "cy", "x1", "x2", "y1", "y2"].indexOf(k) < 0) continue;
    const lim = (k === "y" || k === "cy" || k === "y1" || k === "y2") ? H : W;
    ncoord++;
    const d = v < 0 ? -v : (v > lim ? v - lim : 0);
    if (d > worst) worst = d;
    if (d > 0.05) inb = false;
  }
  p("M7 " + ncoord + " xy-coords checked, in bounds (+/-0.05) = " + inb + ", worst excursion = " + worst.toFixed(3));
  return out;
}
// ---- P8: Fig P04.2 parabola verification (N1-N8) ----
async function piece8() {
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.content ?? String(r);
  };
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P8: Fig P04.2 vertex-form parabola (labs-src/fig-p04-2.svg)");
  const f = await read("labs-src/fig-p04-2.svg");
  const vb = f.match(/viewBox="0 0 (\d+) (\d+)"/);
  p("N1 viewBox = " + (vb ? vb[1] + "x" + vb[2] : "MISSING") + " (expect 330x232) | href/xlink refs = " + ((f.split("href").length - 1) + (f.split("xlink").length - 1)) + " (expect 0)");
  const pts = (f.match(/points="([^"]+)"/) || [])[1].split(" ");
  p("N2 polyline points = " + pts.length + " (expect 57)");
  const Xof = (x: number) => 40 + (x + 13) * 17.5;
  const Yof = (y: number) => 200 - (y - 16) * 2.65625;
  let xOK = true, worstDev = 0, worstAt = 0;
  for (let k = 0; k < pts.length; k++) {
    const xy = pts[k].split(",");
    const X = Number(xy[0]), Y = Number(xy[1]);
    if (X !== 40 + 5 * k) xOK = false;
    const x = -13 + (2 * k) / 7;
    const yTrue = (x + 5) * (x + 5) + 16;
    const dev = Math.abs(Y - Yof(yTrue));
    if (dev > worstDev) { worstDev = dev; worstAt = k; }
  }
  p("N3 X-coords follow 40+5k exactly (k=0..56) = " + xOK + " | plotted Y vs formula, worst deviation = " + worstDev.toFixed(4) + "px at k=" + worstAt + " (2-decimal rounding, tol 0.005)");
  const v = pts[28].split(",");
  p("N4 vertex point k=28 = (" + v[0] + "," + v[1] + ") -> x = -5, y = 16 exactly: " + (Number(v[0]) === 180 && Number(v[1]) === 200));
  const e0 = pts[0].split(","), e56 = pts[56].split(",");
  p("N5 endpoints (" + e0[0] + "," + e0[1] + ") -> (−13, 80) and (" + e56[0] + "," + e56[1] + ") -> (3, 80): " + (Number(e0[1]) === 30 && Number(e56[1]) === 30) + " (caption: climbs to 80 at both ends)");
  const tickX = f.indexOf('x1="40" y1="200" x2="40" y2="204"') >= 0 && f.indexOf('x1="180" y1="200" x2="180" y2="204"') >= 0 && f.indexOf('x1="320" y1="200" x2="320" y2="204"') >= 0;
  const tickY = f.indexOf('x1="263.5" y1="30" x2="267.5" y2="30"') >= 0 && f.indexOf('x1="263.5" y1="200" x2="267.5" y2="200"') >= 0;
  p("N6 x-ticks at X=40/180/320 (labels −13, −5, 3) = " + tickX + " | y-ticks at Y=30/200 (labels 80, 16) = " + tickY);
  p("N7 dashed minimum line y=200 x=24..320: " + (f.indexOf('x1="24" y1="200" x2="320" y2="200"') >= 0 && f.indexOf('stroke-dasharray="6 4"') >= 0) + " | vertex circle at (180,200): " + (f.indexOf('cx="180" cy="200"') >= 0));
  p("N7b labels present: '(−5, 16)' = " + (f.indexOf("(−5, 16)") >= 0) + ", '(−13, 80)' = " + (f.indexOf("(−13, 80)") >= 0) + ", '(3, 80)' = " + (f.indexOf("(3, 80)") >= 0) + ", curve label = " + (f.indexOf("y = (x + 5)² + 16") >= 0));
  const W = Number(vb[1]), H = Number(vb[2]);
  let inb = true, ncoord = 0, worst = 0;
  const re = /([a-z0-9]+)="(-?[\d.]+)"/g;
  let m: any;
  while ((m = re.exec(f)) !== null) {
    const k = m[1], val = Number(m[2]);
    if (["x", "y", "cx", "cy", "x1", "x2", "y1", "y2"].indexOf(k) < 0) continue;
    const lim = (k === "y" || k === "cy" || k === "y1" || k === "y2") ? H : W;
    ncoord++;
    const d = val < 0 ? -val : (val > lim ? val - lim : 0);
    if (d > worst) worst = d;
    if (d > 0.05) inb = false;
  }
  p("N8 " + ncoord + " xy-coords checked, in bounds (+/-0.05) = " + inb + ", worst excursion = " + worst.toFixed(3) + " (polyline points counted once via the 57-point check)");
  return out;
}
// ---- P9: page/TeX structure sanity, pre-fill (O1-O6) ----
async function piece9() {
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.text ?? r.content ?? String(r);
  };
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P9: page/TeX structure sanity (pre-fill; O1-O6)");
  const page = await read("book/p04-complete-the-square.html");
  const cnt = (s: string, t: string) => s.split(t).length - 1;
  p("O1 chars=" + page.length + " (wc -c bytes = 35093; JS length counts UTF-16 units — multi-byte chars differ) | lines=" + (page.split("\n").length - 1) + " (expect 194)");
  p("O2 inline-open \\( = " + cnt(page, "\\(") + " (expect 145 = 144 content + 1 config), inline-close \\) = " + cnt(page, "\\)") + " (expect 145)");
  p("O2b display-open \\[ = " + cnt(page, "\\[") + " (expect 6 = 5 eq + 1 config), display-close \\] = " + cnt(page, "\\]") + " (expect 6), $$ = " + cnt(page, "$$") + " (expect 0)");
  const cfg = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
  p("O3 MathJax config line byte-exact = " + page.includes(cfg));
  const body = page.replace(cfg, "");
  let bal = true, open = false;
  for (let i = 0; i < body.length - 1; i++) {
    if (body[i] === "\\" && body[i + 1] === "(") { if (open) bal = false; open = true; }
    if (body[i] === "\\" && body[i + 1] === ")") { if (!open) bal = false; open = false; }
  }
  p("O3b inline delimiters alternate correctly = " + bal + ", dangling open = " + open);
  p("O4 sections = " + cnt(page, "</section>") + " (expect 9), figures = " + cnt(page, "<figure") + " (expect 2), figcaptions = " + cnt(page, "<figcaption>") + " (expect 2), svg = " + cnt(page, "<svg") + " (expect 2), eq class = " + cnt(page, 'class="eq"') + " (expect 5 equations + 1 R1 prose mention = 6), </html> = " + cnt(page, "</html>") + " (expect 1)");
  p("O4b text-align = " + cnt(page, "text-align") + " (expect 1, the R1 prose mention) | placeholder = " + cnt(page, "RUNHISTORY_PLACEHOLDER") + " (expect 1 pre-fill)");
  const fig1 = await read("labs-src/fig-p04-1.svg");
  const fig2 = await read("labs-src/fig-p04-2.svg");
  p("O5 inline SVG blocks byte-identical to labs-src files: fig1 = " + page.includes(fig1) + ", fig2 = " + page.includes(fig2));
  p("O6 labs-line extension present = " + page.includes("Formatting pass (R1) lab: <code>labs/p04-format-pass.js</code>") + " | R1 entry present = " + page.includes("R1 (2026-10-28, session S14)") + " | MathJax loader in head = " + (page.includes(cfg) && page.includes('defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2')));
  return out;
}
// ---- P10: post-fill re-check of the final page (R1 run history in place) ----
async function piece10() {
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.text ?? r.content ?? String(r);
  };
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P10: post-fill re-check of the final page");
  const page = await read("book/p04-complete-the-square.html");
  const cnt = (s: string, t: string) => s.split(t).length - 1;
  p("Q1 chars=" + page.length + " (wc -c bytes = 36796) | lines=" + (page.split("\n").length - 1) + " (expect 194)");
  p("Q2 inline-open = " + cnt(page, "\\(") + ", inline-close = " + cnt(page, "\\)") + " (expect 145/145: 144 content + 1 config — the run history adds no TeX) | display = " + cnt(page, "\\[") + "/" + cnt(page, "\\]") + " (expect 6/6) | $$ = " + cnt(page, "$$") + " (expect 0)");
  p("Q3 placeholder remaining = " + cnt(page, "RUNHISTORY_PLACEHOLDER") + " (expect 0)");
  p("Q4 sections = " + cnt(page, "</section>") + ", figures = " + cnt(page, "<figure") + ", figcaptions = " + cnt(page, "<figcaption>") + ", svg = " + cnt(page, "<svg") + ", eq class = " + cnt(page, 'class="eq"') + " (6 = 5 equations + 1 prose mention), </html> = " + cnt(page, "</html>") + ", text-align = " + cnt(page, "text-align") + " (1, the R1 prose mention)");
  const cfg = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
  const body = page.replace(cfg, "");
  let bal = true, open = false;
  for (let i = 0; i < body.length - 1; i++) {
    if (body[i] === "\\" && body[i + 1] === "(") { if (open) bal = false; open = true; }
    if (body[i] === "\\" && body[i + 1] === ")") { if (!open) bal = false; open = false; }
  }
  p("Q5 inline delimiters alternate correctly = " + bal + ", dangling = " + open + " | config byte-exact = " + page.includes(cfg));
  p("Q6 R1 entry present = " + page.includes("R1 (2026-10-28, session S14)") + ", run history filled = " + page.includes("Two lab defects were caught before install") + ", rebuild disclosed = " + page.includes("this assembly is a rebuild"));
  return out;
}
