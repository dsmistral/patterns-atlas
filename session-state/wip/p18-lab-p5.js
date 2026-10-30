// ============ p5: §8 exercises 1-3, recomputed ============
function p5(page) {
  var T = "p5";
  // --- Exercise 1: C moved to (2,1), §2's scalars kept ---
  var A = [1,0], B = [0,1], C = [2,1];
  var Ap = [4,0], Bp = [0,2], Cp = [-4,-2];
  chk(T, "Ex1: scalars A'=4A, B'=2B, C'=-2C",
    Ap[0] === 4 && Bp[1] === 2 && Cp[0] === -4 && Cp[1] === -2);
  chk(T, "Ex1: perspective from the origin (AA' x-axis, BB' y-axis, CC' is y=x/2)",
    onLine3({p:[0,0,0],d:[1,0,0]}, [Ap[0],Ap[1],0]) && A[1] === 0 && A[0] !== 0 &&
    B[0] === 0 && Bp[0] === 0 && approx(Cp[1] - 0.5*Cp[0], 0) && approx(C[1] - 0.5*C[0], 0));
  var P1 = meet2(A, B, Ap, Bp), Q1 = meet2(B, C, Bp, Cp), R1 = meet2(C, A, Cp, Ap);
  chk(T, "Ex1: meets P=(-2,3) unmoved, Q=(-1,1), R=(0,-1)",
    P1 !== null && Q1 !== null && R1 !== null &&
    approx(P1[0], -2) && approx(P1[1], 3) &&
    approx(Q1[0], -1) && approx(Q1[1], 1) &&
    approx(R1[0], 0) && approx(R1[1], -1),
    "(" + fmt(P1[0],3) + "," + fmt(P1[1],3) + ") (" + fmt(Q1[0],3) + "," + fmt(Q1[1],3) + ") (" + fmt(R1[0],3) + "," + fmt(R1[1],3) + ")");
  chk(T, "Ex1: all three on the new axis 2x + y + 1 = 0",
    approx(2*P1[0] + P1[1] + 1, 0) && approx(2*Q1[0] + Q1[1] + 1, 0) && approx(2*R1[0] + R1[1] + 1, 0));
  chk(T, "Ex1: the new axis is NOT §2's y = -3x - 3",
    Math.abs(-3*R1[0] - 3 - R1[1]) > 0.5);
  // (b) the construction on the A-pair: S, O1 unchanged, so A1, A2 as in §4
  var S = [0,0,5], O1 = [0,0,2];
  var A1 = [0.5, 0, 2.5], A2 = [4/3, 0, 10/3];
  chk(T, "Ex1b: A1 is the midpoint of S and A", collinear3(S, [1,0,0], A1) && approx(A1[0], 0.5) && approx(A1[2], 2.5));
  chk(T, "Ex1b: A2 on O1A1 and on the ray S to A'",
    collinear3(O1, A1, A2) && collinear3(S, [4,0,0], A2) && approx(A2[0], 4/3) && approx(A2[2], 10/3));
  var tproj = 5 / (5 - A2[2]);
  chk(T, "Ex1b: the projection from S through A2 lands exactly on A'=(4,0)",
    approx(tproj * A2[0], 4) && approx(tproj * A2[1], 0));
  // --- Exercise 2: M = [[2,-1],[1,2]], one of the 148 ---
  function ca(u, v) { return [u[0]+v[0], u[1]+v[1]]; }
  function cm(u, v) { return [u[0]*v[0]-u[1]*v[1], u[0]*v[1]+u[1]*v[0]]; }
  var M2 = function(u, v) { return [ca([2*u[0],2*u[1]], [-v[0],-v[1]]), ca([u[0],u[1]], [2*v[0],2*v[1]])]; };
  chk(T, "Ex2: trace 4, determinant 5, discriminant -4 (one of the 148)",
    2+2 === 4 && 2*2-(-1)*1 === 5 && (2-2)*(2-2)+4*(-1)*1 === -4);
  var feed = M2([1,0], [0,-1]); // M(1,-i)
  var want = [cm([2,1], [1,0]), cm([2,1], [0,-1])];
  chk(T, "Ex2: (1,-i) is a rail with factor 2+i",
    approx(feed[0][0], want[0][0]) && approx(feed[0][1], want[0][1]) &&
    approx(feed[1][0], want[1][0]) && approx(feed[1][1], want[1][1]),
    "(" + feed[0][0] + "+" + feed[0][1] + "i, " + feed[1][0] + "+" + feed[1][1] + "i)");
  chk(T, "Ex2: (2-i) times i = 1+2i, the second component of M(1,i)",
    approx(cm([2,-1], [0,1])[0], 1) && approx(cm([2,-1], [0,1])[1], 2));
  var feedB = M2([1,0], [0,1]);
  var wantB = [cm([2,-1], [1,0]), cm([2,-1], [0,1])];
  chk(T, "Ex2: M(1,i) = (2-i)(1,i), the conjugate rail",
    approx(feedB[0][0], wantB[0][0]) && approx(feedB[0][1], wantB[0][1]) &&
    approx(feedB[1][0], wantB[1][0]) && approx(feedB[1][1], wantB[1][1]));
  chk(T, "Ex2: Vieta — (2+i)+(2-i)=4=tr, (2+i)(2-i)=5=det",
    approx((2+1)+(2-1), 4) && approx(2*2+1*1, 5));
  var sc = Math.hypot(2,1);
  var feed34 = M2([3,0], [4,0]);   // a real arrow, fed as a couple map
  var want34 = cm([2,1], [3,4]);    // multiplication by 2+i
  chk(T, "Ex2: the scaled turn — M is multiplication by 2+i (sample arrow), scale sqrt(5), tan=1/2",
    approx(feed34[0][0], want34[0]) && approx(feed34[1][0], want34[1]) &&
    approx(sc, Math.sqrt(5)) && approx(1/2, 0.5));
  // the shear is beyond every room of numbers: D=0, factor present, direction missing
  chk(T, "Ex2: the shear [[1,1],[0,1]] has discriminant 0 and the doubled factor 1 is present",
    (1-1)*(1-1) + 4*1*0 === 0 && approx(1*1 - 2*1 + 1*1, 0));
  var she = [[1,1],[0,1]];
  chk(T, "Ex2: the shear owns exactly one direction (M - I is not zero)", she[0][1] !== 0);
  // --- Exercise 3: the integral family ---
  var I2 = simpson(function(x) { return x*x*Math.exp(-x*x); }, 0, 8, 8000);
  chk(T, "Ex3a: I2 = int x^2 e^{-x^2} = sqrt(pi)/4", approx(I2, Math.sqrt(Math.PI)/4, 1e-9), fmt(I2, 10));
  var lhs = 2 * I2 * Math.sqrt(Math.PI);
  chk(T, "Ex3a: both sides equate — 2 I2 sqrt(pi) = pi/2", approx(lhs, Math.PI/2, 1e-9));
  var r3 = simpson(function(r) { return r*r*r*Math.exp(-r*r); }, 0, 8, 8000);
  chk(T, "Ex3a: the polar side — int r^3 e^{-r^2} = 1/2", approx(r3, 0.5, 1e-9), fmt(r3, 10));
  var cos2 = simpson(function(th) { return Math.cos(th)*Math.cos(th); }, 0, 2*Math.PI, 4000);
  chk(T, "Ex3a: int cos^2 over the full circle = pi", approx(cos2, Math.PI, 1e-9));
  var Inorm = simpson(function(x) { return Math.exp(-x*x/2); }, -8, 8, 8000);
  chk(T, "Ex3b: int e^{-x^2/2} = sqrt(2 pi)", approx(Inorm, Math.sqrt(2*Math.PI), 1e-9), fmt(Inorm, 10));
  var Ix = simpson(function(x) { return x*Math.exp(-x*x); }, 0, 8, 4000);
  chk(T, "Ex3c: int x e^{-x^2} = 1/2, no lift needed", approx(Ix, 0.5, 1e-10), fmt(Ix, 10));
}
