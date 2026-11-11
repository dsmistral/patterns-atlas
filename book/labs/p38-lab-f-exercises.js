// P38 Lab F - the exercises, machine-verified. Ex1 bridge by hand (|F| values,
// 36-point grid, triangle law); Ex2 exactness threshold + the K >= width rule;
// Ex3 four-dice trend; Ex4 the referee's convicting number; Ex5 the descent.
async function main(tools) {
  const R = { lab: "P38-lab-f-exercises", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  const F = (s) => { let re = 0, im = 0; for (let k = 1; k <= 6; k++) { re += Math.cos(k * s); im += Math.sin(k * s); } return [re, im]; };
  const aF = (s) => Math.hypot(F(s)[0], F(s)[1]);
  // F1 Ex1(a): |F(0)| = 6, |F(pi/3)| = 0, |F(pi/2)| = sqrt(2)
  g("F1 Ex1(a): 6, 0, sqrt(2) = 1.4142 at the three angles",
    Math.abs(aF(0) - 6) < 1e-9 && aF(Math.PI / 3) < 1e-9 && Math.abs(aF(Math.PI / 2) - Math.SQRT2) < 1e-9);
  // F2 Ex1(b): 36-point grid average = two-dice census, all 11 totals
  const gridAvg = (n, K, sPow) => { let re = 0; for (let j = 0; j < K; j++) { const s = 2 * Math.PI * j / K; const f = F(s); const r = Math.hypot(f[0], f[1]); const ph = Math.atan2(f[1], f[0]);
      re += Math.pow(r, sPow) * Math.cos(sPow * ph - 2 * Math.PI * n * j / K); } return re / K; };
  const cens = (s) => { const M = Math.pow(6, s); const c = []; for (let n = s; n <= 6 * s; n++) { let v = 0;
      for (let t = 0; t < M; t++) { let x = t, sum = 0; for (let d = 0; d < s; d++) { sum += (x % 6) + 1; x = Math.floor(x / 6); } if (sum === n) v++; } c.push(v); } return c; };
  const c2 = cens(2); let f2 = true; for (let n = 2; n <= 12; n++) f2 = f2 && Math.abs(gridAvg(n, 36, 2) - c2[n - 2]) < 1e-6;
  g("F2 Ex1(b): 36-point grid = 1,2,3,4,5,6,5,4,3,2,1 exactly", f2 && c2.join(",") === "1,2,3,4,5,6,5,4,3,2,1");
  // F3 Ex1(c): triangle law N(n) = 6 - |n-7| on all 11 totals
  let f3 = true; for (let n = 2; n <= 12; n++) f3 = f3 && c2[n - 2] === 6 - Math.abs(n - 7);
  g("F3 Ex1(c): triangle law 6-|n-7| holds at all 11 totals", f3);
  // F4 Ex2(a,b): K=15 reads N(18)=2; K=16 exact at all 16 totals
  const c3 = cens(3);
  g("F4 Ex2(a,b): K=15 reads N(18)=2.000, K=16 exact all 16", Math.abs(gridAvg(18, 15, 3) - 2) < 1e-6 &&
    [16].every(K => { let ok = true; for (let n = 3; n <= 18; n++) ok = ok && Math.abs(gridAvg(n, K, 3) - c3[n - 3]) < 1e-6; return ok; }));
  // F5 Ex2(c): the rule K >= width w = sM-s+1, tested on (s,M) = (2,6) w=11 and (3,4) w=10
  const rule = (s, M) => { const w = s * M - s + 1; const Fm = (s2) => { let re = 0, im = 0; for (let k = 1; k <= M; k++) { re += Math.cos(k * s2); im += Math.sin(k * s2); } return [re, im]; };
    const ga = (n, K) => { let re = 0; for (let j = 0; j < K; j++) { const sg = 2 * Math.PI * j / K; const f = Fm(sg); const r = Math.hypot(f[0], f[1]); const ph = Math.atan2(f[1], f[0]);
        re += Math.pow(r, s) * Math.cos(s * ph - 2 * Math.PI * n * j / K); } return re / K; };
    const cs = []; for (let n = s; n <= s * M; n++) { let v = 0; const tot = Math.pow(M, s);
      for (let t = 0; t < tot; t++) { let x = t, sum = 0; for (let d = 0; d < s; d++) { sum += (x % M) + 1; x = Math.floor(x / M); } if (sum === n) v++; } cs.push(v); }
    const okAt = (K) => { let ok = true; for (let n = s; n <= s * M; n++) ok = ok && Math.abs(ga(n, K) - cs[n - s]) < 1e-6; return ok; };
    return { w, okW: okAt(w), badW1: !okAt(w - 1) }; };
  const r1 = rule(2, 6), r2 = rule(3, 4);
  g("F5 Ex2(c): rule K >= w confirmed at (2,6) w=11 and (3,4) w=10; K=w-1 fails both",
    r1.w === 11 && r1.okW && r1.badW1 && r2.w === 10 && r2.okW && r2.badW1);
  // F6 Ex3: four-dice census, peak 146 at 14, sum 1296
  const c4 = cens(4);
  g("F6 Ex3(a): 4-dice census sums 1296, peak 146 at n=14", c4.reduce((x, y) => x + y, 0) === 1296 && Math.max(...c4) === 146 && c4.indexOf(146) === 10);
  // F7 Ex3(b): major-only 138.079, quiet 7.921 = 5.43% vs 7.25%
  const majorOnly = (n, sPow, steps) => { steps = steps || 200000; let acc = 0; const A = -Math.PI / 6, B = Math.PI / 6; const dt = (B - A) / steps;
    for (let i = 0; i <= steps; i++) { const s = A + i * dt; const f = F(s); const r = Math.hypot(f[0], f[1]); const ph = Math.atan2(f[1], f[0]);
      const w = (i === 0 || i === steps) ? 0.5 : 1; acc += w * Math.pow(r, sPow) * Math.cos(sPow * ph - n * s); } return acc * dt / (2 * Math.PI); };
  const m4 = majorOnly(14, 4), m10 = majorOnly(10, 3);
  g("F7 Ex3(b): 146-138.079 = 7.921 = 5.43% vs 1.957/27 = 7.25%",
    Math.abs(m4 - 138.079) < 5e-4 && Math.abs((146 - m4) / 146 * 100 - 5.43) < 5e-3 && Math.abs((27 - m10) / 27 * 100 - 7.25) < 5e-3);
  // F8 Ex3(c): Gaussian peaks 29.13 (3 dice) and 151.37 (4 dice), both high
  const var1 = 35 / 12;
  const g3 = 216 / Math.sqrt(2 * Math.PI * 3 * var1), g4 = 1296 / Math.sqrt(2 * Math.PI * 4 * var1);
  g("F8 Ex3(c): Gaussian 29.13 vs 27 (7.9% high), 151.37 vs 146 (3.7% high)",
    Math.abs(g3 - 29.13) < 5e-3 && Math.abs(g4 - 151.37) < 5e-3 && g3 > 27 && g4 > 146);
  // F9 Ex4: the convicting number - major-only at n=3 is 1.164 > 1 (quiet share negative)
  const m3 = majorOnly(3, 3);
  g("F9 Ex4: major-only n=3 = 1.164 > 1, quiet share -0.164 < 0", Math.abs(m3 - 1.164) < 5e-4 && m3 > 1 && (1 - m3) < 0);
  // F10 Ex5(a): census to 100, failures all peel to 7 mod 8
  const isSq = (x) => { const r = Math.round(Math.sqrt(x)); return r * r === x; };
  const fails = (L) => { const f = []; for (let n = 0; n <= L; n++) { let ok = false;
      for (let a = 0; a * a <= n && !ok; a++) for (let b = a; a * a + b * b <= n && !ok; b++) { const c2v = n - a * a - b * b; if (c2v >= b * b && isSq(c2v)) ok = true; }
      if (!ok) f.push(n); } return f; };
  const f100 = fails(100);
  const peel = (n) => { while (n % 4 === 0) n /= 4; return n; };
  g("F10 Ex5(a): fifteen failures to 100, each peeling to 7 mod 8",
    f100.length === 15 && f100.join(",") === "7,15,23,28,31,39,47,55,60,63,71,79,87,92,95" && f100.every(n => peel(n) % 8 === 7));
  // F11 Ex5(b): the descent witnesses 28=4*7, 60=4*15, 92=4*23 (all three in the failure list)
  g("F11 Ex5(b): 28=4*7, 60=4*15, 92=4*23 - descent witnesses all fail", [28, 60, 92].every(n => f100.indexOf(n) !== -1));
  // F12 Ex5(c): 46 = 36+9+1, 46 = 6 mod 8, not a failure
  g("F12 Ex5(c): 46 = 36+9+1 = 6^2+3^2+1^2, 46 = 6 mod 8, succeeds", 36 + 9 + 1 === 46 && 46 % 8 === 6 && f100.indexOf(46) === -1);
  // poisons
  p("FP1 corrupted rule (K = w-1 exact) rejected by F5", r1.okW && r1.badW1);
  p("FP2 corrupted convict (m3 = 0.964 < 1) rejected by F9", !(Math.abs(m3 - 0.964) < 5e-4));
  p("FP3 corrupted descent (28 succeeds) rejected by F11", f100.indexOf(28) !== -1);
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-f-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-f-out.json" });
  R.selfWrite = back.content === out;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
