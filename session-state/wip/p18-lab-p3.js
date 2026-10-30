// ============ p3: §4 Example 1 — the spatial proof, watched ============
function p3(page) {
  var T = "p3";
  function dot3(u, v) { return u[0]*v[0] + u[1]*v[1] + u[2]*v[2]; }
  // meet of 3D lines P+td and Q+ue, verified on both
  function meet3(P, d, Q, e) {
    var w = cross3(d, e), den = dot3(w, w);
    if (den < 1e-18) return null;
    var t = dot3(cross3(sub(Q, P), e), w) / den;
    var X = [P[0] + t*d[0], P[1] + t*d[1], P[2] + t*d[2]];
    var u = dot3(sub(X, Q), e) / dot3(e, e);
    var Y = [Q[0] + u*e[0], Q[1] + u*e[1], Q[2] + u*e[2]];
    if (Math.hypot(X[0]-Y[0], X[1]-Y[1], X[2]-Y[2]) > 1e-9) return null;
    return X;
  }
  // --- the room upstairs: A,B,C in z=1; A',B',C' in x=1; O* the origin ---
  var Os = [0,0,0], A = [2,1,1], B = [3,2,1], C = [-2,1,1];
  var Ap = [1,0.5,0.5], Bp = [1,2/3,1/3], Cp = [1,-0.5,-0.5];
  chk(T, "A',B',C' on rays from O* (scalars 1/2, 1/3, -1/2)",
    collinear3(Os, A, Ap) && collinear3(Os, B, Bp) && collinear3(Os, C, Cp) &&
    approx(Ap[0], 0.5*2) && approx(Bp[0], (1/3)*3) && approx(Cp[0], -0.5*(-2)));
  chk(T, "triangle 1 lies in z=1", A[2] === 1 && B[2] === 1 && C[2] === 1);
  chk(T, "triangle 2 lies in x=1", Ap[0] === 1 && Bp[0] === 1 && Cp[0] === 1);
  chk(T, "planes z=1 and x=1 meet in the line ell={(1,t,1)}",
    approx(A[0], 1) === false && (function(){ var L = meet3([1,0,1],[0,1,0],[0,0,1],[1,0,0]); return L !== null && approx(L[0],1) && approx(L[2],1); })());
  // --- the three meets, verified by substitution on both lines, both ways ---
  var P3 = meet3(A, sub(B, A), Ap, sub(Bp, Ap));
  var Q3 = meet3(B, sub(C, B), Bp, sub(Cp, Bp));
  var R3 = meet3(C, sub(A, C), Cp, sub(Ap, Cp));
  chk(T, "P=(1,0,1) on AB and on A'B', with x=1, z=1",
    P3 !== null && collinear3(A, B, P3) && collinear3(Ap, Bp, P3) &&
    approx(P3[0], 1) && approx(P3[1], 0) && approx(P3[2], 1));
  chk(T, "Q=(1,8/5,1) on BC and on B'C', with x=1, z=1",
    Q3 !== null && collinear3(B, C, Q3) && collinear3(Bp, Cp, Q3) &&
    approx(Q3[0], 1) && approx(Q3[1], 1.6) && approx(Q3[2], 1));
  chk(T, "R=(1,1,1) on CA and on C'A', with x=1, z=1",
    R3 !== null && collinear3(C, A, R3) && collinear3(Cp, Ap, R3) &&
    approx(R3[0], 1) && approx(R3[1], 1) && approx(R3[2], 1));
  chk(T, "all three meets on ell (x=1, z=1)",
    approx(P3[0],1) && approx(P3[2],1) && approx(Q3[0],1) && approx(Q3[2],1) && approx(R3[0],1) && approx(R3[2],1));
}
