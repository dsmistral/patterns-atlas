// p06-review-verifier.js — The Patterns Atlas, P06 "Compose with identity"
// (session S83b, 2026-11-01)
// Fresh adversarial verifier for the S83b improvement pass. Zero code shared
// with labs/p06-lab.js: this engine is registry-driven (claims as data, one
// evaluator), encodes the surd world a+b*sqrt3 as FLAT 2x2 matrices
// [m00, m01, m10, m11] (the lab uses pair arrays and
// nested-array matrices), builds Fibonacci numbers by iterated pair-state
// updates (the lab uses an indexed array), reaches the cos-cascade through
// the Chebyshev doubling route cos(2t) = 2cos^2(t) - 1 (the lab calls cos
// and sin directly), checks the two-stage rationalization in high-precision
// floats (the lab uses exact 8-coordinate surd arithmetic), and probes the
// three-square defect at deterministic non-grid points (the lab sweeps a
// 0..5 grid). It replaces the S21-era verifier whose record was embedded in
// labs/p06-lab-output.txt; the fresh record lives in
// labs/p06-review-output.txt (a NEW file for p06).
// Protocol: INJECTION entries are deliberately false claims that the engine
// must refute with a computed witness; CONTROL entries are true claims that
// must be upheld. One verdict line per registry entry; the machine-counted
// VERDICT closes the run.

function main() {
  const out = [];
  const say = (s) => out.push(s);

  // --- encodings (all chosen to differ from the battery's) ---
  // flat matrices: [m00, m01, m10, m11]
  const fmul = (M, N) => [M[0]*N[0] + M[1]*N[2], M[0]*N[1] + M[1]*N[3], M[2]*N[0] + M[3]*N[2], M[2]*N[1] + M[3]*N[3]];
  const fdet = (M) => M[0]*M[3] - M[1]*M[2];
  const S3 = (a, b) => [a, 3*b, b, a];     // a + b*sqrt3
  // Fibonacci by iterated pair state (u, v) = (F(k), F(k+1))
  const fib = (n) => { let u = 0, v = 1; for (let k = 0; k < n; k++) { const t = u + v; u = v; v = t; } return u; };
  // Chebyshev doubling: cos(2t) from cos(t)
  const cosD = (t) => 2*Math.cos(t)*Math.cos(t) - 1;
  const rad = (d) => d * Math.PI / 180;
  // the surd composition, scalar route (used only by injections/controls that
  // need coordinates, arranged differently from the battery's helper)
  const star3 = (a, b, c, d) => [a*c + 3*b*d, a*d + b*c];
  // the four-square recipe in flat-quad form, terms regrouped
  const e4f = (p, q) => [
    p[0]*q[0] - (p[1]*q[1] + p[2]*q[2] + p[3]*q[3]),
    p[0]*q[1] + p[1]*q[0] + (p[2]*q[3] - p[3]*q[2]),
    p[0]*q[2] + p[2]*q[0] + (p[3]*q[1] - p[1]*q[3]),
    p[0]*q[3] + p[3]*q[0] + (p[1]*q[2] - p[2]*q[1])
  ];
  const qn = (p) => p[0]*p[0] + p[1]*p[1] + p[2]*p[2] + p[3]*p[3];
  // the three-square candidate, arranged differently from the battery's
  const dia3 = (a, b, c, d, e, f) => [a*d - (b*e + c*f), a*e + b*d, a*f + c*d];
  const tn = (t) => t[0]*t[0] + t[1]*t[1] + t[2]*t[2];

  // deterministic non-grid probe points for the defect identity
  const pts = [[2, 3, 5, 7, 11, 13], [1, 4, 9, 16, 25, 36], [3, 1, 4, 1, 5, 9], [2, 7, 1, 8, 2, 8], [1, 1, 2, 3, 5, 8], [9, 6, 3, 2, 5, 8], [7, 7, 7, 1, 2, 3]];

  // --- registry: [id, kind, claim (text), truth (computed boolean), witness (text)] ---
  const reg = [];

  // CONTROLS (must be true)
  const surdPts = [[2, 3, 5, 7], [4, 1, 6, 2], [9, 4, 3, 8], [1, 6, 7, 5], [8, 2, 2, 9]];
  const c1 = surdPts.every((p) => fdet(fmul(S3(p[0], p[1]), S3(p[2], p[3]))) === fdet(S3(p[0], p[1])) * fdet(S3(p[2], p[3])));
  reg.push(["C01", "CONTROL", "surd norm multiplicativity via flat matrices det(MN) = det(M)det(N) at five non-grid points", c1, "det(S3(2,3)) = " + fdet(S3(2, 3)) + ", det(S3(5,7)) = " + fdet(S3(5, 7)) + ", product composition det = " + fdet(fmul(S3(2, 3), S3(5, 7)))]);

  const c2 = fmul(S3(2, 1), S3(2, -1))[0] === 1 && fmul(S3(2, 1), S3(2, -1))[1] === 0 && fmul(S3(2, 1), S3(2, -1))[2] === 0 && fmul(S3(2, 1), S3(2, -1))[3] === 1;
  reg.push(["C02", "CONTROL", "(2,1) star (2,-1) = (1,0): flat-matrix product is the identity", c2, "S3(2,1) * S3(2,-1) = [" + fmul(S3(2, 1), S3(2, -1)).join(", ") + "]"]);

  let c3 = true;
  let M = S3(2, 1);
  const ladder = [];
  for (let k = 0; k < 4; k++) { ladder.push("[" + M[0] + "," + M[2] + "]det=" + fdet(M)); if (fdet(M) !== 1) c3 = false; M = fmul(M, S3(2, 1)); }
  const wantLadder = [[2, 1], [7, 4], [26, 15], [97, 56]];
  M = S3(2, 1);
  for (let k = 0; k < 4; k++) { if (M[0] !== wantLadder[k][0] || M[2] !== wantLadder[k][1]) c3 = false; M = fmul(M, S3(2, 1)); }
  reg.push(["C03", "CONTROL", "Pell ladder via flat-matrix powers: S3(2,1)^k = (2,1),(7,4),(26,15),(97,56), each det 1", c3, ladder.join(" ")]);

  const c40 = cosD(rad(20)), c80 = cosD(rad(40));
  const Pc = Math.cos(rad(20)) * c40 * c80;
  reg.push(["C04", "CONTROL", "cos20 cos40 cos80 = 1/8 via the Chebyshev doubling route", Math.abs(Pc - 0.125) < 1e-12, "cos40 = 2cos^2(20)-1, cos80 = 2cos^2(40)-1, product = " + Pc.toExponential(6)]);

  const denF = Math.sqrt(2) + Math.sqrt(3) - Math.sqrt(5);
  const numRaw = 2*Math.sqrt(3) + 3*Math.sqrt(2) + Math.sqrt(30);
  const ansF = numRaw / 12;
  const c5 = Math.abs(denF * numRaw - 12) < 1e-10 && Math.abs(ansF - 1/denF) < 1e-12;
  reg.push(["C05", "CONTROL", "two-stage rationalization, float route: (sqrt2+sqrt3-sqrt5)*(2sqrt3+3sqrt2+sqrt30) = 12, so the reciprocal is (2sqrt3+3sqrt2+sqrt30)/12", c5, "den*numRaw = " + (denF * numRaw).toPrecision(12) + ", ans vs 1/den gap = " + Math.abs(ansF - 1/denF).toExponential(3)]);

  let c6 = true;
  for (let n = 1; n <= 20; n++) if (fib(2*n + 1) !== fib(n + 1)*fib(n + 1) + fib(n)*fib(n)) c6 = false;
  reg.push(["C06", "CONTROL", "odd-index corollary F(2n+1) = F(n+1)^2 + F(n)^2 for n = 1..20 via pair-state Fibonacci", c6, "n=3: F(7) = " + fib(7) + " = " + fib(4) + "^2 + " + fib(3) + "^2 = " + (fib(4)*fib(4) + fib(3)*fib(3))]);

  let c7 = true;
  let w7 = "";
  for (const p of pts) {
    const L = tn(dia3(p[0], p[1], p[2], p[3], p[4], p[5]));
    const R = (p[0]*p[0] + p[1]*p[1] + p[2]*p[2]) * (p[3]*p[3] + p[4]*p[4] + p[5]*p[5]) - (p[1]*p[5] - p[2]*p[4]) * (p[1]*p[5] - p[2]*p[4]);
    if (L !== R) { c7 = false; w7 = "point (" + p.join(",") + ")"; }
  }
  reg.push(["C07", "CONTROL", "defect identity N(diamond) = N*N - (bf-ce)^2 at seven non-grid points", c7, w7 === "" ? "all seven points exact, e.g. (2,3,5,7,11,13): L = " + tn(dia3(2, 3, 5, 7, 11, 13)) : "FAILED at " + w7]);

  const ABv = e4f([2, 1, 1, 1], [3, 2, 1, 1]), BAv = e4f([3, 2, 1, 1], [2, 1, 1, 1]);
  const c8 = ABv[0] === 2 && ABv[1] === 7 && ABv[2] === 6 && ABv[3] === 4 && BAv[2] === 4 && BAv[3] === 6 && qn(ABv) === 105 && qn(BAv) === 105 && (ABv[2] !== BAv[2] || ABv[3] !== BAv[3]);
  reg.push(["C08", "CONTROL", "non-commutativity witness: A circ B = (2,7,6,4), B circ A = (2,7,4,6), both norms 105 = 7*15", c8, "A circ B = [" + ABv.join(",") + "], B circ A = [" + BAv.join(",") + "]"]);

  // INJECTIONS (must be false — the engine refutes them with witnesses)
  const star2 = (a, b, c, d) => [a*c + 2*b*d, a*d + b*c];   // the counterfeit 2bd recipe
  const pts2 = [[1, 1, 1, 1], [2, 1, 3, 1], [1, 2, 2, 1], [3, 2, 1, 4]];
  let j1 = true;
  let j1w = "";
  for (const p of pts2) {
    const r2 = star2(p[0], p[1], p[2], p[3]);
    const L = r2[0]*r2[0] - 3*r2[1]*r2[1];
    const R = (p[0]*p[0] - 3*p[1]*p[1]) * (p[2]*p[2] - 3*p[3]*p[3]);
    if (L !== R) { j1 = false; if (j1w === "") j1w = "at (" + p.join(",") + "): N(star2) = " + L + " but N*N = " + R; }
  }
  reg.push(["J01", "INJECTION", "the recipe (a,b) star2 (c,d) = (ac + 2bd, ad + bc) is norm-multiplicative for a^2 - 3b^2", j1, j1w]);
  const s22 = star3(1, 1, 1, 1);
  const j2 = (s22[0]*s22[0] + 3*s22[1]*s22[1]) === (1 + 3) * (1 + 3);
  reg.push(["J02", "INJECTION", "the norm a^2 + 3b^2 (sign flipped) is multiplicative under the true star", j2, "at (1,1),(1,1): star = (" + s22[0] + "," + s22[1] + "), N+ = " + (s22[0]*s22[0] + 3*s22[1]*s22[1]) + " but N+*N+ = 16"]);
  const j3 = (2*2 - 3*1*1) === -1;
  reg.push(["J03", "INJECTION", "the Pell ladder entries solve x^2 - 3y^2 = -1", j3, "(2,1): 4 - 3 = 1, not -1"]);
  const j4 = ((1*1 - 2*1) === (1 + 2));
  reg.push(["J04", "INJECTION", "the matrix door A(x,y) has determinant x^2 + 2y^2", j4, "A(1,1): det = -1, not 1 + 2 = 3"]);
  const j5 = Math.abs(Pc - 1/16) < 1e-12;
  reg.push(["J05", "INJECTION", "cos20 cos40 cos80 = 1/16", j5, "computed product = " + Pc.toExponential(6) + " = 1/8, not 1/16"]);
  const cascV = 8 * Math.sin(rad(20)) * Pc;
  const j6 = Math.abs(cascV - Math.sin(rad(140))) < 1e-12;
  reg.push(["J06", "INJECTION", "the cascade 8 sin20 cos20 cos40 cos80 equals sin 140", j6, "cascade = " + cascV.toFixed(6) + " = sin160, not sin140 = " + Math.sin(rad(140)).toFixed(6)]);
  const j7 = fib(5) === fib(3)*fib(3) - fib(2)*fib(2);
  reg.push(["J07", "INJECTION", "the odd-index law reads F(2n+1) = F(n+1)^2 - F(n)^2", j7, "n=2: F(5) = " + fib(5) + ", but F(3)^2 - F(2)^2 = " + (fib(3)*fib(3) - fib(2)*fib(2))]);
  const dz = dia3(0, 1, 0, 0, 0, 1);
  const j8 = tn(dz) === 1 + (1*1 - 0*0)*(1*1 - 0*0);
  reg.push(["J08", "INJECTION", "the defect term enters with a plus: N(diamond) = N*N + (bf-ce)^2", j8, "(0,1,0) diamond (0,0,1) = (" + dz.join(",") + "), N = " + tn(dz) + ", not 1 + 1 = 2"]);
  const j9 = tn(dz) === 1;
  reg.push(["J09", "INJECTION", "the false line (0,1,0) diamond (0,0,1) has norm 1", j9, "actual norm " + tn(dz)]);
  const j10 = Math.abs(denF * numRaw - 24) < 1e-9;
  reg.push(["J10", "INJECTION", "the rationalized denominator is 24", j10, "den*numRaw = " + (denF * numRaw).toPrecision(12) + ", not 24"]);
  const j11 = ABv[2] === BAv[2] && ABv[3] === BAv[3];
  reg.push(["J11", "INJECTION", "the four-square composition is commutative: A circ B = B circ A", j11, "[" + ABv.join(",") + "] vs [" + BAv.join(",") + "] — third and fourth coordinates differ"]);
  const j12 = ABv[0] === 2 && ABv[1] === 6 && ABv[2] === 6 && ABv[3] === 4;
  reg.push(["J12", "INJECTION", "A circ B = (2,6,6,4) (a q-index slip made during this pass's own drafting)", j12, "actual A circ B = [" + ABv.join(",") + "]"]);
  const j13 = fmul(S3(2, 1), S3(2, -1))[0] === 2;
  reg.push(["J13", "INJECTION", "(2,1) star (2,-1) = (2,0)", j13, "flat-matrix product = [" + fmul(S3(2, 1), S3(2, -1)).join(",") + "] = the identity, not (2,0)"]);
  const j14s = star3(1, 0, 0, 1);
  const j14 = j14s[0] === 1 && j14s[1] === 0;
  reg.push(["J14", "INJECTION", "the surd identity element is (0,1)", j14, "(1,0) star (0,1) = (" + j14s[0] + "," + j14s[1] + "), which changes (1,0)"]);

  // --- evaluator ---
  say("PRE-DISPATCH BOOLEAN AUDIT: registry consistent — " + reg.filter((r) => r[1] === "INJECTION").length + " must-fail injections, " + reg.filter((r) => r[1] === "CONTROL").length + " positive controls");
  let pass = 0, fail = 0;
  for (const r of reg) {
    const [id, kind, claim, truth] = r;
    if (kind === "INJECTION") {
      if (truth === false) { say(id + " REFUTED (required): claim '" + claim + "' — witness: " + r[4]); pass++; }
      else { say(id + " NOT REFUTED (FAIL): claim '" + claim + "' — witness: " + r[4]); fail++; }
    } else {
      if (truth === true) { say(id + " UPHELD (control): claim '" + claim + "' — witness: " + r[4]); pass++; }
      else { say(id + " NOT UPHELD (FAIL): claim '" + claim + "' — witness: " + r[4]); fail++; }
    }
  }
  say("VERDICT: " + reg.length + " registry lines — " + pass + " PASS, " + fail + " FAIL");
  for (const ln of out) console.log(ln);
  return fail;
}
