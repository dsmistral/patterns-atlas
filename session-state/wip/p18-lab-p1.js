// ============ p1: §2 the planar encounter + Fig P18.1 ============
function p1(page) {
  var T = "p1";
  var O = [0, 0], A = [1, 0], B = [0, 1], C = [2, 3];
  var Ap = [4, 0], Bp = [0, 2], Cp = [-4, -6];
  chk(T, "scalars: A'=4A, B'=2B, C'=-2C",
    Ap[0] === 4*A[0] && Bp[1] === 2*B[1] && Cp[0] === -2*C[0] && Cp[1] === -2*C[1]);
  // perspective from O
  function through2(p, q, o) { return collinear3([p[0], p[1], 0], [q[0], q[1], 0], [o[0], o[1], 0]); }
  chk(T, "AA' is the x-axis through O", through2(A, Ap, O));
  chk(T, "BB' is the y-axis through O", through2(B, Bp, O));
  chk(T, "CC' passes through O (y = 3/2 x)", through2(C, Cp, O));
  // the three meets
  var P = meet2(A, B, Ap, Bp), Q = meet2(B, C, Bp, Cp), R = meet2(C, A, Cp, Ap);
  chk(T, "P = AB ∩ A'B' = (-2,3)", P[0] === -2 && P[1] === 3, "(" + fmt(P[0]) + ", " + fmt(P[1]) + ")");
  chk(T, "Q = BC ∩ B'C' = (-1,0)", Q[0] === -1 && Q[1] === 0, "(" + fmt(Q[0]) + ", " + fmt(Q[1]) + ")");
  chk(T, "R = CA ∩ C'A' = (0,-3)", R[0] === 0 && R[1] === -3, "(" + fmt(R[0]) + ", " + fmt(R[1]) + ")");
  // axis y = -3x - 3
  function onAxis(p) { return Math.abs(-3*p[0] - 3 - p[1]) < 1e-12; }
  chk(T, "axis y = -3x-3 carries P, Q, R", onAxis(P) && onAxis(Q) && onAxis(R));
  // the page's §2 line equations
  chk(T, "AB is x+y=1", Math.abs(A[0]+A[1]-1) < 1e-12 && Math.abs(B[0]+B[1]-1) < 1e-12);
  chk(T, "A'B' is x+2y=4", Math.abs(Ap[0]+2*Ap[1]-4) < 1e-12 && Math.abs(Bp[0]+2*Bp[1]-4) < 1e-12);
  chk(T, "BC is y=x+1", Math.abs(B[1]-(B[0]+1)) < 1e-12 && Math.abs(C[1]-(C[0]+1)) < 1e-12);
  chk(T, "B'C' is y=2x+2", Math.abs(Bp[1]-(2*Bp[0]+2)) < 1e-12 && Math.abs(Cp[1]-(2*Cp[0]+2)) < 1e-12);
  chk(T, "CA is y=3x-3", Math.abs(C[1]-(3*C[0]-3)) < 1e-12 && Math.abs(A[1]-(3*A[0]-3)) < 1e-12);
  chk(T, "C'A' is y=(3/4)x-3", Math.abs(Cp[1]-(0.75*Cp[0]-3)) < 1e-12 && Math.abs(Ap[1]-(0.75*Ap[0]-3)) < 1e-12);
  // Fig P18.1 pixel map: px = 280 + 60x, py = 172 - 14y
  var px = function(x) { return 280 + 60*x; }, py = function(y) { return 172 - 14*y; };
  var pts = [["O",O,280,172],["A",A,340,172],["B",B,280,158],["C",C,400,130],
             ["A'",Ap,520,172],["B'",Bp,280,144],["C'",Cp,40,256],
             ["P",P,160,130],["Q",Q,220,172],["R",R,280,214]];
  for (var i = 0; i < pts.length; i++) {
    var nm = pts[i][0], p = pts[i][1], X = pts[i][2], Y = pts[i][3];
    chk(T, "Fig P18.1 pixel of " + nm + " at (" + X + "," + Y + ")",
      Math.abs(px(p[0]) - X) < 0.51 && Math.abs(py(p[1]) - Y) < 0.51,
      "predicted (" + fmt(px(p[0]), 1) + ", " + fmt(py(p[1]), 1) + ")");
  }
  // the drawn axis line (15,28.5)-(381.4,285) lies on y=-3x-3 in math coords
  var ax1 = [(15-280)/60, (172-28.5)/14], ax2 = [(381.4-280)/60, (172-285)/14];
  chk(T, "Fig P18.1's drawn axis lies on y=-3x-3 (within SVG pixel rounding)",
    Math.abs(-3*ax1[0]-3-ax1[1]) < 0.05 && Math.abs(-3*ax2[0]-3-ax2[1]) < 0.05,
    "(" + fmt(ax1[0], 2) + ", " + fmt(ax1[1], 2) + ") to (" + fmt(ax2[0], 2) + ", " + fmt(ax2[1], 2) + ")");
  // the P dash-line endpoints are on the AB / A'B' extensions (within the viewBox)
  var e1 = [(150-280)/60, (172-127.7)/14], e2 = [(150-280)/60, (172-128.8)/14];
  chk(T, "red dash endpoint on AB extended (x+y=1)", Math.abs(e1[0]+e1[1]-1) < 0.01, "(" + fmt(e1[0], 2) + ", " + fmt(e1[1], 2) + ")");
  chk(T, "blue dash endpoint on A'B' extended (x+2y=4)", Math.abs(e2[0]+2*e2[1]-4) < 0.01, "(" + fmt(e2[0], 2) + ", " + fmt(e2[1], 2) + ")");
  // a fresh Desargues config, recomputed from scratch (independent of §2's)
  var O2 = [1, 1], A2 = [3, 0], B2 = [0, 2], C2 = [-1, -2];
  function scaled(O, V, k) { return [O[0] + k*(V[0]-O[0]), O[1] + k*(V[1]-O[1])]; }
  var kA = 2, kB = -1, kC = 3;
  var A2p = scaled(O2, A2, kA), B2p = scaled(O2, B2, kB), C2p = scaled(O2, C2, kC);
  var ar = (B2[0]-A2[0])*(C2[1]-A2[1]) - (B2[1]-A2[1])*(C2[0]-A2[0]);
  chk(T, "fresh config: triangle non-degenerate (cross 14)", Math.abs(ar - 14) < 1e-12, "cross " + fmt(ar));
  chk(T, "fresh config: perspective scalars from O2",
    through2(A2, A2p, O2) && through2(B2, B2p, O2) && through2(C2, C2p, O2));
  var P2 = meet2(A2, B2, A2p, B2p), Q2 = meet2(B2, C2, B2p, C2p), R2 = meet2(C2, A2, C2p, A2p);
  var d2 = (Q2[0]-P2[0])*(R2[1]-P2[1]) - (Q2[1]-P2[1])*(R2[0]-P2[0]);
  chk(T, "fresh config: P=(4,-2/3) (independent second witness)",
    approx(P2[0], 4) && approx(P2[1], -2/3));
  chk(T, "fresh config: Q=(-3/2,-4) (independent second witness)",
    approx(Q2[0], -1.5) && approx(Q2[1], -4));
  chk(T, "fresh config: R=(15,6) (independent second witness)",
    approx(R2[0], 15) && approx(R2[1], 6));
  var mQR = (R2[1]-P2[1])/(R2[0]-P2[0]), mPQ = (Q2[1]-P2[1])/(Q2[0]-P2[0]);
  chk(T, "fresh config: axis slope 20/33 (independent second witness)",
    approx(mPQ, 20/33) && approx(mQR, 20/33), "slopes " + fmt(mPQ, 6) + " " + fmt(mQR, 6));
  chk(T, "fresh config: meets collinear too (Desargues, second witness)", Math.abs(d2) < 1e-9,
    "meets (" + fmt(P2[0]) + "," + fmt(P2[1]) + ") (" + fmt(Q2[0]) + "," + fmt(Q2[1]) + ") (" + fmt(R2[0]) + "," + fmt(R2[1]) + ")");
}
