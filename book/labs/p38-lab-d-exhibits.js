// P38 Lab D - the exhibits, machine-verified. Three-squares census to 40 and 100,
// the 4^a(8b+7) legend, the mod-8 wall, the descent, 46 = 36+9+1, and the
// exactness threshold K = 16 = support width (K=15 reads 2, K=14 reads 4).
async function main(tools) {
  const R = { lab: "P38-lab-d-exhibits", gates: [], poisons: [] };
  const g = (n, ok) => R.gates.push({ n, ok: !!ok });
  const p = (n, caught) => R.poisons.push({ n, caught: !!caught });
  // D1 census by exhaustive search 0 <= a <= b <= c
  const isSq = (x) => { const r = Math.round(Math.sqrt(x)); return r * r === x; };
  const fails = (L) => { const f = []; for (let n = 0; n <= L; n++) { let ok = false;
      for (let a = 0; a * a <= n && !ok; a++) for (let b = a; a * a + b * b <= n && !ok; b++) { const c2 = n - a * a - b * b; if (c2 >= b * b && isSq(c2)) ok = true; }
      if (!ok) f.push(n); } return f; };
  const f40 = fails(40), f100 = fails(100);
  g("D1 failures to 40 = 7,15,23,28,31,39; to 100 = 7,15,23,28,31,39,47,55,60,63,71,79,87,92,95",
    f40.join(",") === "7,15,23,28,31,39" && f100.join(",") === "7,15,23,28,31,39,47,55,60,63,71,79,87,92,95");
  // D2 every failure is 4^a(8b+7) - peel factors of 4
  const peel = (n) => { while (n % 4 === 0) n /= 4; return n; };
  let d2 = true; for (const n of f100) d2 = d2 && peel(n) % 8 === 7;
  g("D2 all fifteen failures peel to a number = 7 mod 8", d2);
  // D3 the converse direction on the census: no non-failure is of the forbidden form
  let d3 = true; for (let n = 0; n <= 100; n++) { const bad = peel(n) % 8 === 7; const fail = f100.indexOf(n) !== -1; if (bad !== fail) d3 = false; }
  g("D3 census legend exact to 100: fails iff 4^a(8b+7)", d3);
  // D4 the mod-8 wall: squares are 0,1,4 mod 8; three of them reach 0..6, never 7
  const sqm = new Set(); for (let x = 0; x < 8; x++) sqm.add((x * x) % 8);
  const sums = new Set(); for (const a of sqm) for (const b of sqm) for (const c of sqm) sums.add((a + b + c) % 8);
  g("D4 squares mod 8 = {0,1,4}; three-sums = {0..6}, 7 unreachable",
    [...sqm].sort().join(",") === "0,1,4" && [...sums].sort((x, y) => x - y).join(",") === "0,1,2,3,4,5,6");
  // D5 the descent: 28 = 4*7, 92 = 4*23, 60 = 4*15; any rep of 4m gives one of m (halve evens, mod-4 argument)
  g("D5 descent trio in the failures: 28, 60, 92 all present", f100.indexOf(28) !== -1 && f100.indexOf(60) !== -1 && f100.indexOf(92) !== -1);
  // D6 46 succeeds: 46 = 36 + 9 + 1
  g("D6 46 = 36 + 9 + 1 = 6^2 + 3^2 + 1^2, and 46 not a failure", 36 + 9 + 1 === 46 && f100.indexOf(46) === -1);
  // D7 exactness threshold: K=15 reads n=18 as 2, K=14 reads 4, K=16..17 exact
  const F = (s) => { let re = 0, im = 0; for (let k = 1; k <= 6; k++) { re += Math.cos(k * s); im += Math.sin(k * s); } return [re, im]; };
  const gridAvg = (n, K) => { let re = 0; for (let j = 0; j < K; j++) { const s = 2 * Math.PI * j / K; const f = F(s); const r = Math.hypot(f[0], f[1]); const ph = Math.atan2(f[1], f[0]);
      re += Math.pow(r, 3) * Math.cos(3 * ph - 2 * Math.PI * n * j / K); } return re / K; };
  const cens3 = []; for (let n = 3; n <= 18; n++) { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let d = 1; d <= 6; d++) if (a + b + d === n) c++; cens3.push(c); }
  g("D7 K=15 -> N(18) reads 2.000, K=14 -> 4.000, K=16 exact all 16, K=17 exact all 16",
    Math.abs(gridAvg(18, 15) - 2) < 1e-6 && Math.abs(gridAvg(18, 14) - 4) < 1e-6 &&
    [16, 17].every(K => { let ok = true; for (let n = 3; n <= 18; n++) ok = ok && Math.abs(gridAvg(n, K) - cens3[n - 3]) < 1e-6; return ok; }));
  // D8 collision arithmetic: K=15 merges n=3 and n=18 (18-3=15); K=14 merges n=3,4,17,18
  g("D8 collision ledger: 18-3=15 (K=15), 18-4=14 (K=14); reads 2 = N(3)+N(18), 4 = N(4)+N(18)",
    18 - 3 === 15 && 18 - 4 === 14 && cens3[0] + cens3[15] === 2 && cens3[1] + cens3[15] === 4);
  // poisons
  p("DP1 corrupted legend (28 claimed not of the form) rejected: 28 = 4*7 peels to 7 mod 8", peel(28) % 8 === 7);
  p("DP2 corrupted mod-8 set (squares {0,1,2}) rejected by D4", [...sqm].sort().join(",") !== "0,1,2");
  p("DP3 corrupted threshold (K=15 exact) rejected by D7", !(Math.abs(gridAvg(18, 15) - cens3[15]) < 1e-6));
  const out = JSON.stringify({ lab: R.lab, pass: R.gates.filter(x => x.ok).length, total: R.gates.length, caught: R.poisons.filter(x => x.caught).length, poisons: R.poisons.length, gates: R.gates, poisonsDetail: R.poisons });
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-d-out.json", content: out });
  const back = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p38-lab-d-out.json" });
  R.selfWrite = back.content === out;
  return { lab: R.lab, pass: R.gates.filter(x => x.ok).length + "/" + R.gates.length, caught: R.poisons.filter(x => x.caught).length + "/" + R.poisons.length, selfWrite: R.selfWrite, failed: R.gates.filter(x => !x.ok).map(x => x.n), missed: R.poisons.filter(x => !x.caught).map(x => x.n) };
}
