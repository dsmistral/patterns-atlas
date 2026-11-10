async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const close = (a, b, tol) => Math.abs(a - b) <= tol;

  // A1: shelves of 1/(1+z^2) by equation-solve: W(1+z^2)=1 shelf by shelf
  const N = 20;
  const w = new Array(N + 1).fill(0);
  for (let n = 0; n <= N; n++) {
    let s = n === 0 ? 1 : 0;
    if (n >= 2) s -= w[n - 2];
    w[n] = s;
  }
  gate("A1 page census shelves n=0..7", eq(w.slice(0, 8), [1, 0, -1, 0, 1, 0, -1, 0]), "the encounter's period-four census");

  // A2: geometric route 1/(1+z^2) = sum_k (-z^2)^k
  const g = new Array(N + 1).fill(0);
  for (let k = 0; 2 * k <= N; k++) g[2 * k] = Math.pow(-1, k);
  gate("A2 geometric route equals equation-solve n<=20", eq(g, w), "shelves agree by two routes");

  // A3: angle prices oscillation: a_n = cos(n*pi/2)
  let cosOK = true;
  for (let n = 0; n <= N; n++) if (Math.round(Math.cos(n * Math.PI / 2)) !== w[n]) cosOK = false;
  gate("A3 census equals cos(n*pi/2) n<=20", cosOK, "breaks at right angles force period four");

  // A4: smooth on the whole real line: 1+x^2 never vanishes
  let minDen = Infinity;
  for (let x = -3; x <= 3.0001; x += 0.01) minDen = Math.min(minDen, 1 + x * x);
  gate("A4 no real break: 1+x^2 >= 1 on [-3,3]", minDen >= 1 - 1e-12, "minimum 1 at x=0; nothing on the line breaks");

  // A5: rate of the shelves (limsup |a_n|^(1/n)) equals 1 = 1/|i|
  const rate1 = Math.pow(Math.abs(w[18]), 1 / 18); // |a_18| = 1
  gate("A5 rate 1 for 1/(1+z^2)", close(rate1, 1, 1e-12), "radius 1 = distance to both breaks");

  // A6: shelves of 1/(1+2z^2) by equation-solve (Ex1's object)
  const M = 20;
  const v = new Array(M + 1).fill(0);
  for (let n = 0; n <= M; n++) {
    let s = n === 0 ? 1 : 0;
    if (n >= 2) s -= 2 * v[n - 2];
    v[n] = s;
  }
  gate("A6 Ex1 shelves n=0..7", eq(v.slice(0, 8), [1, 0, -2, 0, 4, 0, -8, 0]), "page Exercise 1's census");

  // A7: even shelves double per two steps -> growth sqrt(2) per step, radius 1/sqrt(2)
  let dblOK = true;
  for (let m = 0; m <= 9; m++) if (v[2 * m] !== Math.pow(-2, m)) dblOK = false;
  const rate2 = Math.pow(Math.abs(v[20]), 1 / 20); // |a_20| = 2^10 -> rate 2^0.5
  gate("A7 even shelves (-2)^m and rate sqrt(2)", dblOK && close(rate2, Math.SQRT2, 1e-9), "growth per step sqrt(2), radius 1/sqrt(2) = 0.7071");

  // A8: break placement from factoring: 1+2z^2 = 0 at z = +-i/sqrt(2), distance 1/sqrt(2)
  const rBreak = 1 / Math.SQRT2;
  const check = (1 + 2 * (rBreak * rBreak * -1)); // z^2 = -1/2 -> 1+2z^2 = 0
  gate("A8 breaks at +-i/sqrt(2), distance = 1/rate", close(check, 0, 1e-15) && close(rBreak, 1 / rate2, 1e-9), "factoring reveals the breaks; distance fixes the radius");

  // poisons
  poison("P1 radius-2 claim rejected", !close(rate1, 0.5, 0.01), "rate 1 measured, not 1/2");
  poison("P2 decay claim for 1/(1+2z^2) rejected", !(Math.abs(v[20]) < Math.abs(v[2])), "even shelves double per two steps");
  poison("P3 real-break claim rejected", (1 + 1 * 1) !== 0 && (1 + 2 * 1) !== 0, "1+z^2 and 1+2z^2 nonzero at z=+-1");
  poison("P4 alternating-period-two claim rejected", w[1] !== -1, "a_1 = 0 kills (−1)^n");
  poison("P5 sign-slip census rejected", !eq([1, 0, -1, 0, 1, 0, 1, 0], w.slice(0, 8)), "shelf 6 resurrected");

  const out = { lab: "p27-lab-a-encounter", date: "2026-11-10", gates, poisons, summary: gates.filter((x) => x.pass).length + "/" + gates.length + " gates, " + poisons.filter((x) => x.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p27-lab-a-encounter.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((x) => !x.pass).concat(poisons.filter((x) => !x.caught)) };
}
