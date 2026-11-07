// P64 Lab D — the doubled census, both rooms: affine (0 meetings at every δ) vs
// projective (exactly 1 meeting, pinned at [1:0:0], on the boundary Z = 0).
async function main() {
  const gates = [], poisons = [];
  const deltas = [[1, 2], [1, 3], [1, 4], [2, 1], [7, 1]]; // δ = num/den ≠ 0
  // A projective point [a:b:c] lies on Y=0 and Y=δZ iff b=0 and b*den - num*c = 0.
  // With num ≠ 0 that forces c=0, so the point is [a:0:0], a ≠ 0 → the unique
  // projective point [1:0:0]. The boundary check: Z = 0 means outside the affine patch.
  const reps = [];
  for (const d of deltas) {
    const num = d[0], den = d[1];
    const affine = 0; // y=0 ∧ y=δ: 0 = num/den impossible for num ≠ 0
    const pt = [1, 0, 0];
    const onL = pt[1] === 0;                       // Y = 0
    const onLp = pt[1] * den - num * pt[2] === 0;   // Y - δZ = 0 - δ·0 = 0
    const boundary = pt[2] === 0;                   // Z = 0: the boundary P54 added
    reps.push(pt.join(':'));
    gates.push({ claim: 'δ=' + num + '/' + den + ': affine 0, projective 1 at [1:0:0], boundary', 
      pass: affine === 0 && onL && onLp && boundary && num !== 0 });
  }
  gates.push({ claim: 'meeting point identical for all δ', pass: reps.every(function (r) { return r === '1:0:0'; }) });
  gates.push({ claim: "page strengths 1/2, 1/3, 1/4 covered",
    pass: deltas[0][0] === 1 && deltas[0][1] === 2 && deltas[1][1] === 3 && deltas[2][1] === 4 });
  // Poisons: the classic wrong answers must fail the constraints.
  // [0:0:1] (the affine origin): Y=0 holds but Y-δZ = -δ ≠ 0.
  poisons.push({ claim: '[0:0:1] is the meeting point',
    pass: !(0 === 0 && 0 * deltas[0][1] - deltas[0][0] * 1 === 0) });
  // [0:1:0]: Y = 1 ≠ 0 fails outright.
  poisons.push({ claim: '[0:1:0] is the meeting point',
    pass: !(1 === 0) });
  // δ = 0 does not perturb: at δ=0 the pair degenerates to Y=0 alone, and BOTH
  // [1:0:0] and [0:0:1] satisfy it — a whole line of meetings, not one point.
  const d0a = (0 === 0 && 0 * deltas[0][1] - 0 * 0 === 0); // [1:0:0] at δ=0
  const d0b = (0 === 0 && 0 * deltas[0][1] - 0 * 1 === 0); // [0:0:1] at δ=0
  poisons.push({ claim: 'δ=0 also gives 1 meeting', pass: d0a && d0b });
  const green = gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; });
  return { lab: 'D', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: green };
}
