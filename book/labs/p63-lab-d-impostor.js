async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const mul = (A, B) => [(A[0] * B[0] + A[1] * B[2]) % 3, (A[0] * B[1] + A[1] * B[3]) % 3, (A[2] * B[0] + A[3] * B[2]) % 3, (A[2] * B[1] + A[3] * B[3]) % 3];
  const add = (A, B) => A.map((v, i) => (v + B[i]) % 3);
  const sub = (A, B) => A.map((v, i) => (v - B[i] + 3) % 3);
  const mu = (A, B) => add(mul(A, B), mul(B, A));
  const br = (A, B) => sub(mul(A, B), mul(B, A));
  const mats = []; for (let i = 0; i < 81; i++) mats.push([Math.floor(i / 27) % 3, Math.floor(i / 9) % 3, Math.floor(i / 3) % 3, i % 3]);
  const zero = [0, 0, 0, 0];
  const eq = (A, B) => A.every((v, i) => v === B[i]);

  let d1 = true;
  for (const A of mats) for (const B of mats) if (!eq(mu(A, B), mu(B, A))) d1 = false;
  gate("D1 the anticommutator mu(A,B)=AB+BA is commutative on all 81x81 ordered pairs over F_3", d1, "6561 pairs");
  let d2 = true;
  for (const A of mats) for (const B of mats) if (!eq(br(A, B), sub(zero, br(B, A)))) d2 = false;
  gate("D2 the commutator [A,B]=AB-BA is antisymmetric on all ordered pairs", d2, "6561 pairs");
  const bas = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1], [2, 0, 0, 0], [0, 2, 0, 0], [0, 0, 2, 0], [0, 0, 0, 2], [1, 1, 0, 0]];
  let d3 = true;
  for (const A of bas) for (const B of bas) for (const C of bas) { const J = add(add(br(br(A, B), C), br(br(B, C), A)), br(br(C, A), B)); if (!eq(J, zero)) d3 = false; }
  gate("D3 the commutator satisfies Jacobi on a spanning set of triples (trilinear)", d3, "729 triples");
  let found = null;
  for (const A of mats) { if (found) break; for (const B of mats) { if (found) break; for (const C of mats) if (!eq(mu(mu(A, B), C), mu(A, mu(B, C)))) { found = [A, B, C]; break; } } }
  gate("D4 mu is NOT associative: a counterexample is found by search", !!found, found ? JSON.stringify(found) : "none");
  const F0 = found || [[1, 0, 0, 0], [1, 0, 0, 0], [0, 1, 0, 0]];
  const L = mu(mu(F0[0], F0[1]), F0[2]), R = mu(F0[0], mu(F0[1], F0[2]));
  gate("D5 the counterexample re-verified: mu(mu(X,Y),Z) != mu(X,mu(Y,Z))", !eq(L, R), "L=" + JSON.stringify(L) + " R=" + JSON.stringify(R));
  let foundJ = null;
  for (const A of mats) { if (foundJ) break; for (const B of mats) { if (foundJ) break; for (const C of mats) { const J = add(add(mu(mu(A, B), C), mu(mu(B, C), A)), mu(mu(C, A), B)); if (!eq(J, zero)) { foundJ = [A, B, C, J]; break; } } } }
  gate("D6 mu also fails the Jacobi shape: it is not Lie either", !!foundJ, foundJ ? JSON.stringify(foundJ) : "none");
  gate("D7 the arity-2 census cannot certify: commutative, yet neither associative nor Jacobi", d1 && !!found && !!foundJ, "Com's signature at arity 2, both arity-3 laws fail");

  poison("DP1 claim 'mu is associative' killed by the D4 counterexample", !!found && !eq(mu(mu(found[0], found[1]), found[2]), mu(found[0], mu(found[1], found[2]))), "counterexample stands");
  poison("DP2 claim 'mu satisfies Jacobi' killed by the D6 counterexample", !!foundJ && !eq(foundJ[3], zero), "counterexample stands");
  let p3 = false;
  for (const A of mats) { if (p3) break; for (const B of mats) if (!eq(mu(A, B), sub(zero, mu(B, A)))) { p3 = true; break; } }
  poison("DP3 tampered bracket AB+BA fails antisymmetry", p3, "some pair breaks it");

  const out = { lab: "p63-lab-d-impostor", date: "2026-11-10", gates, poisons, notes: ["2x2 matrices over F_3; Jacobi checked on a spanning set (trilinear)"], summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p63-lab-d-impostor.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
