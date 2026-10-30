// ============ p3d: §4 Example 1 — the descent construction, watched ============
function p3d(page) {
  var T = "p3d";
  function dot3(u, v) { return u[0]*v[0] + u[1]*v[1] + u[2]*v[2]; }
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
  var S = [0,0,5], O1 = [0,0,2];
  var SA = [1,0,0], SB = [0,1,0], SC = [2,3,0];
  var SAp = [4,0,0], SBp = [0,2,0], SCp = [-4,-6,0];
  var A1 = [0.5,0,2.5], B1 = [0,0.6,2], C1 = [4/3,2,5/3];
  var A2 = [4/3,0,10/3], B2 = [0,1.2,2], C2 = [-2,-3,2.5];
  chk(T, "A1 on the ray from S through A", collinear3(S, SA, A1));
  chk(T, "B1 on the ray from S through B", collinear3(S, SB, B1));
  chk(T, "C1 on the ray from S through C", collinear3(S, SC, C1));
  var gA = meet3(O1, sub(A1, O1), S, sub(SAp, S));
  var gB = meet3(O1, sub(B1, O1), S, sub(SBp, S));
  var gC = meet3(O1, sub(C1, O1), S, sub(SCp, S));
  chk(T, "A2 = O1A1 meet SA' = (4/3,0,10/3), on both lines",
    gA !== null && collinear3(O1, A1, gA) && collinear3(S, SAp, gA) &&
    approx(gA[0], 4/3) && approx(gA[1], 0) && approx(gA[2], 10/3));
  chk(T, "B2 = O1B1 meet SB' = (0,6/5,2), on both lines",
    gB !== null && collinear3(O1, B1, gB) && collinear3(S, SBp, gB) &&
    approx(gB[0], 0) && approx(gB[1], 1.2) && approx(gB[2], 2));
  chk(T, "C2 = O1C1 meet SC' = (-2,-3,5/2), on both lines",
    gC !== null && collinear3(O1, C1, gC) && collinear3(S, SCp, gC) &&
    approx(gC[0], -2) && approx(gC[1], -3) && approx(gC[2], 2.5));
  chk(T, "the stated A2,B2,C2 sit on their meets",
    approx(A2[0],gA[0]) && approx(B2[1],gB[1]) && approx(C2[0],gC[0]));
  chk(T, "A1A2, B1B2, C1C2 all pass through O1",
    collinear3(A1, A2, O1) && collinear3(B1, B2, O1) && collinear3(C1, C2, O1));
  chk(T, "C2 on the ray opposite C1 (perspectivity permits)",
    approx((C2[0]-O1[0]) + 1.5*(C1[0]-O1[0]), 0) &&
    approx((C2[1]-O1[1]) + 1.5*(C1[1]-O1[1]), 0));
  var n1 = cross3(sub(B1, A1), sub(C1, A1));
  var n2 = cross3(sub(B2, A2), sub(C2, A2));
  var nw = cross3(n1, n2);
  chk(T, "lifted triangles lie in two distinct planes", Math.hypot(nw[0], nw[1], nw[2]) > 1e-9);
  chk(T, "neither lifted plane is z=0", Math.abs(n1[2]) > 1e-9 && Math.abs(n2[2]) > 1e-9);
  chk(T, "all six lifted vertices off the floor z=0",
    A1[2] !== 0 && B1[2] !== 0 && C1[2] !== 0 && A2[2] !== 0 && B2[2] !== 0 && C2[2] !== 0);
  var lines9 = [[A1,A2],[B1,B2],[C1,C2],[A1,B1],[B1,C1],[C1,A1],[A2,B2],[B2,C2],[C2,A2]];
  var clear = true;
  for (var i = 0; i < 9; i++) if (collinear3(S, lines9[i][0], lines9[i][1])) clear = false;
  chk(T, "the center S lies on none of the nine lines", clear);
  var mAB = meet3(A1, sub(B1, A1), A2, sub(B2, A2));
  var mBC = meet3(B1, sub(C1, B1), B2, sub(C2, B2));
  var mCA = meet3(C1, sub(A1, C1), C2, sub(A2, C2));
  chk(T, "all three spatial meets exist", mAB !== null && mBC !== null && mCA !== null);
  chk(T, "spatial meets collinear (the lifted axis)",
    mAB !== null && mBC !== null && mCA !== null && collinear3(mAB, mBC, mCA));
  function projS(X) { var t = 5 / (5 - X[2]); return [t * X[0], t * X[1], 0]; }
  var pA = projS(A1), pB = projS(B1), pC = projS(C1), pAp = projS(A2), pBp = projS(B2), pCp = projS(C2);
  chk(T, "six lifted vertices project onto §2's six vertices",
    approx(pA[0],1) && approx(pA[1],0) && approx(pB[0],0) && approx(pB[1],1) &&
    approx(pC[0],2) && approx(pC[1],3) && approx(pAp[0],4) && approx(pAp[1],0) &&
    approx(pBp[0],0) && approx(pBp[1],2) && approx(pCp[0],-4) && approx(pCp[1],-6));
  chk(T, "projection preserves meets: mAB projects to P=(-2,3)", mAB !== null &&
    approx(mAB[0], -2) && approx(mAB[1], 3) && approx(mAB[2], 0));
  var pjBC = projS(mBC), pjCA = projS(mCA);
  chk(T, "mBC projects to Q=(-1,0)", mBC !== null && approx(pjBC[0], -1) && approx(pjBC[1], 0));
  chk(T, "mCA projects to R=(0,-3)", mCA !== null && approx(pjCA[0], 0) && approx(pjCA[1], -3));
  chk(T, "the projected meets lie on §2's axis y=-3x-3",
    approx(pjBC[1], -3*pjBC[0]-3) && approx(pjCA[1], -3*pjCA[0]-3));
  chk(T, "ray from S through A1 continues past A1 to A", collinear3(S, A1, SA) && A1[2] > 0 && A1[2] < 5);
  chk(T, "page claims the lab verifies all six projections", page.indexOf("the lab verifies all six") !== -1);
}
