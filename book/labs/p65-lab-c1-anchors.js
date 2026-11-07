// P65 Lab C1 — exact anchors: sphere rotation, torus slide, cap area.
// Iterative only, no recursion, no BigInt, deterministic.
// Recorded receipt (2026-11-06, run in-sandbox; first attempt's probe correctly
// rejected an exact-equality gate on 2-2cos(pi/2) = 1.9999999999999998 — gates
// on transcendental values must use tolerances):
//   rotation (theta = pi/2): det of (x,y)-block = 2 (forces x=y=0 => exactly the 2 poles);
//     both poles exactly fixed; 1000-station Fibonacci spot-check: 0 near-fixed, min displacement 0.063
//   slide (x,y)->(x+1/2,y) on 32x32 grid: 1024/1024 stations moved => 0 fixed points (exact integers)
//   cap area: Simpson n=1000 (exact for quadratics): 1.333333333333334, err 6.7e-16
// Covers page claims: §2 rotation = 2 fixed points; §2 slide = 0 fixed points;
// §4 Example 2 cap area 4/3.
async function main() {
  const th = Math.PI / 2;
  const det = 2 - 2 * Math.cos(th);
  if (Math.abs(det - 2) > 1e-12) return { probeFail: det };
  const rot = (p: number[]) => [Math.cos(th)*p[0] - Math.sin(th)*p[1], Math.sin(th)*p[0] + Math.cos(th)*p[1], p[2]];
  const NP = 1000, ga = Math.PI * (3 - Math.sqrt(5));
  let close = 0, minDisp = Infinity;
  for (let i = 0; i < NP; i++) {
    const z = 1 - 2 * (i + 0.5) / NP;
    const r = Math.sqrt(Math.max(0, 1 - z * z));
    const az = ga * i;
    const p = [r * Math.cos(az), r * Math.sin(az), z];
    const q = rot(p);
    const d = Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]);
    if (d < minDisp) minDisp = d;
    if (d < 0.02) close++;
  }
  const pole = (s: number) => { const q = rot([0, 0, s]); return Math.abs(q[0]) + Math.abs(q[1]) + Math.abs(q[2] - s) < 1e-15; };
  const polesFixed = pole(1) && pole(-1);
  let slideMoved = 0;
  for (let i = 0; i < 32; i++) for (let j = 0; j < 32; j++) if ((i + 16) % 32 !== i) slideMoved++;
  const f = (x: number) => 1 - x * x;
  const n = 1000;
  let S = f(-1) + f(1);
  for (let k = 1; k < n; k++) S += f(-1 + 2 * k / n) * (k % 2 ? 4 : 2);
  const I = S * 2 / (3 * n);
  const ok = Math.abs(det - 2) < 1e-12 && close === 0 && polesFixed && slideMoved === 1024 && Math.abs(I - 4/3) < 1e-12;
  return { det, gridStations: NP, nearFixed: close, minDisp: +minDisp.toFixed(6), polesFixed,
    slideMoved: slideMoved + '/1024', capArea: I, capErr: Math.abs(I - 4/3), ok };
}
