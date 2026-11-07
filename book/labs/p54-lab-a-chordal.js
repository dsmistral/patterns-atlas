// P54 LAB A — the two ways to hold infinity (Exemplar 1)
// One-point room: line + {inf} = circle via stereographic (u,v) = (2x/(1+x^2), (x^2-1)/(1+x^2)),
// chordal d(x,y) = 2|x-y|/sqrt((1+x^2)(1+y^2)), d(x,inf) = 2/sqrt(1+x^2).
// Two-point room: arctan metric, arctan(+/-inf) = +/- pi/2.
// RECEPT (2026-11-07): |(u,v)| = 1 to 2.2e-16 over x grid; d(1,2) = d(3,inf) = 2/sqrt(10) = 0.63245553
// exactly (central-angle law 2 sin(dtheta/2) confirms: dtheta = 36.87 deg for both pairs);
// x*d(x,inf) -> 2 (1.9900744, 1.9999000, 1.9999990 at x = 10, 100, 1000);
// one-point room: d(n,-n) = 4n/(1+n^2) -> 0 (0.39604, 0.04000, 0.00400) — the two escapes share a name;
// two-point room: d(n,-n) = 2 arctan n -> pi (2.94226, 3.12159, 3.13959 vs pi = 3.14159) — they stay apart.
// ok: true (first run).
(async () => {
  const stereo = (x) => [2 * x / (1 + x * x), (x * x - 1) / (1 + x * x)];
  let maxRes = 0;
  for (let i = -300; i <= 300; i++) { const x = i * 0.1; const [u, v] = stereo(x); const r = Math.abs(u * u + v * v - 1); if (r > maxRes) maxRes = r; }
  const dChord = (x, y) => 2 * Math.abs(x - y) / Math.sqrt((1 + x * x) * (1 + y * y));
  const dInf = (x) => 2 / Math.sqrt(1 + x * x);
  const exact = 2 / Math.sqrt(10);
  const ang = (x) => 2 * Math.atan(x) - Math.PI / 2;
  const dtheta = 2 * Math.sin((ang(2) - ang(1)) / 2), dtheta2 = 2 * Math.sin((Math.PI / 2 - ang(3)) / 2);
  const conv = [1, 10, 100, 1000].map((x) => x * dInf(x));
  const mutual = [10, 100, 1000].map((n) => dChord(n, -n));
  const far = [10, 100, 1000].map((n) => Math.abs(Math.atan(n) - Math.atan(-n)));
  return { ok: maxRes < 1e-15 && Math.abs(dChord(1, 2) - exact) < 1e-15 && Math.abs(dInf(3) - exact) < 1e-15 && Math.abs(dtheta - exact) < 1e-12 && Math.abs(dtheta2 - exact) < 1e-12 && conv[3] > 1.999 && mutual[2] < 0.004 && far[2] > 3.13, maxRes, d12: dChord(1, 2), d3inf: dInf(3), exact, dtheta: [dtheta, dtheta2], conv, mutual, far, pi: Math.PI };
})()
