// ============ p5x: §8 exercises 4-5, recomputed ============
function p5x(page) {
  var T = "p5x";
  function sinc(x) { return x === 0 ? 1 : Math.sin(x) / x; }
  // --- Exercise 4: the Dirichlet integral, diagnosed ---
  function absSinc(x) { return Math.abs(sinc(x)); }
  var S10 = simpson(absSinc, 0, 10, 4000);
  var S40 = simpson(absSinc, 0, 40, 16000);
  var S100 = simpson(absSinc, 0, 100, 40000);
  chk(T, "Ex4a: |sin x/x| partials about 2.56 / 3.47 / 4.05 at X=10/40/100",
    approx(S10, 2.56, 0.005) && approx(S40, 3.47, 0.005) && approx(S100, 4.05, 0.005),
    fmt(S10, 4) + " / " + fmt(S40, 4) + " / " + fmt(S100, 4));
  chk(T, "Ex4a: absolute convergence fails — the partials keep growing (40 to 100 gains > 0.5)",
    S100 - S40 > 0.5, fmt(S100 - S40, 4));
  var rate = (S100 - S40) / Math.log(100 / 40);
  chk(T, "Ex4a: growth rate about 2/pi (logarithmic)", Math.abs(rate - 2/Math.PI) < 0.15, fmt(rate, 4));
  function pairIntegrand(th) { var x = 5*Math.cos(th), y = 5*Math.sin(th); return Math.sin(x)*Math.sin(y)/(x*y); }
  var v03 = pairIntegrand(0.3), v12 = pairIntegrand(1.2);
  chk(T, "Ex4b: at r=5 the slice at angle 0.3 gives about -0.141 (x~4.78, y~1.48)",
    approx(v03, -0.141, 0.0005) && approx(5*Math.cos(0.3), 4.78, 0.005) && approx(5*Math.sin(0.3), 1.48, 0.005),
    fmt(v03, 4));
  chk(T, "Ex4b: at r=5 the slice at angle 1.2 gives about -0.115 (x~1.81, y~4.66)",
    approx(v12, -0.115, 0.0005) && approx(5*Math.cos(1.2), 1.81, 0.005) && approx(5*Math.sin(1.2), 4.66, 0.005),
    fmt(v12, 4));
  chk(T, "Ex4b: same radius, different values — the integrand is not radial",
    Math.abs(v03 - v12) > 1e-4);
  // (c) the damping machine
  function Ieps(ep, up, n) { return simpson(function(x) { return Math.exp(-ep*x) * sinc(x); }, 0, up, n); }
  var c05 = Math.PI/2 - Math.atan(0.5), c1 = Math.PI/2 - Math.atan(1), c2 = Math.PI/2 - Math.atan(2);
  chk(T, "Ex4c: I(eps) = pi/2 - arctan eps at eps = 0.5 (1e-9)",
    approx(Ieps(0.5, 60, 12000), c05, 1e-9), fmt(Ieps(0.5, 60, 12000), 10));
  chk(T, "Ex4c: I(1) = pi/4 exactly as the page checks",
    approx(Ieps(1, 40, 8000), Math.PI/4, 1e-9), fmt(Ieps(1, 40, 8000), 10));
  chk(T, "Ex4c: I(2) = pi/2 - arctan 2 is about 0.4636",
    approx(Ieps(2, 30, 6000), c2, 1e-9) && approx(c2, 0.4636, 5e-5), fmt(c2, 6));
  var bp05 = simpson(function(x) { return Math.exp(-0.5*x)*Math.sin(x); }, 0, 60, 12000);
  var bp1 = simpson(function(x) { return Math.exp(-1*x)*Math.sin(x); }, 0, 40, 8000);
  var bp2 = simpson(function(x) { return Math.exp(-2*x)*Math.sin(x); }, 0, 30, 6000);
  chk(T, "Ex4c: I'(eps) = -1/(1+eps^2): the by-parts integral at eps = 0.5, 1, 2",
    approx(bp05, 1/(1+0.25), 1e-10) && approx(bp1, 0.5, 1e-10) && approx(bp2, 0.2, 1e-10));
  var weakClosed = Math.PI/2 - Math.atan(0.001);
  var weakBrute = Ieps(0.001, 200, 40000);
  chk(T, "Ex4c: brute force cannot pay it — the eps=0.001 sum to x=200 lands short",
    weakClosed - weakBrute > 1e-3 && weakClosed - weakBrute < 4e-3,
    "short by " + fmt(weakClosed - weakBrute, 5));
  chk(T, "Ex4c: the closed form at eps=0.001 is about 1.5698", approx(weakClosed, 1.5698, 5e-5), fmt(weakClosed, 6));
  chk(T, "page pins the honest boundary (still lands about 0.002 short)",
    page.indexOf("still lands about") !== -1);
  // --- Exercise 5: the census closed in both rooms ---
  var vals = [-2,-1,0,1,2], nP = 0, nZ = 0, nN = 0, pure = 0, shear = 0;
  var schemes = 0, residueOK = true;
  for (var ai = 0; ai < 5; ai++) for (var bi = 0; bi < 5; bi++)
  for (var ci = 0; ci < 5; ci++) for (var di = 0; di < 5; di++) {
    var a = vals[ai], b = vals[bi], c = vals[ci], d = vals[di];
    var tr = a + d, det = a*d - b*c, D = (a-d)*(a-d) + 4*b*c;
    if (D > 0) { nP++; schemes++; }
    else if (D === 0) {
      nZ++;
      var lam = tr / 2;
      if (b === 0 && c === 0 && a === d) { pure++; schemes++; }
      else {
        shear++;
        // the residue: doubled factor present, but only one direction owned
        var nil = (a-lam !== 0 || b !== 0 || c !== 0 || d-lam !== 0);
        if (!nil || !approx(lam*lam - tr*lam + det, 0)) residueOK = false;
      }
    } else { nN++; schemes++; }
  }
  chk(T, "Ex5a: the real census — 416 / 61 / 148, summing to 625",
    nP === 416 && nZ === 61 && nN === 148 && nP + nZ + nN === 625, nP + "/" + nZ + "/" + nN);
  chk(T, "Ex5a: of the 61, five are multiples of the identity table (zero machine included)",
    pure === 5 && shear === 56, pure + "/" + shear);
  chk(T, "Ex5b: 416 + 148 + 5 = 569 own a scheme over the couples", schemes === 569, "" + schemes);
  chk(T, "Ex5b: 421 diagonalizable over the reals (416 + 5), difference exactly the 148",
    nP + pure === 421 && (nP + pure) + nN === 569);
  chk(T, "Ex5b: the residue is the 56 shears — factor present, one direction, unrepairable by numbers",
    shear === 56 && residueOK);
  // (c) M = [[2,-2],[2,2]], one of the 148
  function cm(u, v) { return [u[0]*v[0]-u[1]*v[1], u[0]*v[1]+u[1]*v[0]]; }
  var Mc = function(u, v) { return [[2*u[0]-2*v[0], 2*u[1]-2*v[1]], [2*u[0]+2*v[0], 2*u[1]+2*v[1]]]; };
  function ca2(u, v) { return [u[0]+v[0], u[1]+v[1]]; }
  chk(T, "Ex5c: char lambda^2 - 4 lambda + 8, discriminant -16 (one of the 148)",
    (2-2)*(2-2) + 4*(-2)*2 === -16 && 2*2-(-2)*2 === 8 && 2+2 === 4);
  var charAt = ca2(ca2(cm([2,2], [2,2]), [-8,-8]), [8,0]); // (2+2i)^2 - 4(2+2i) + 8
  chk(T, "Ex5c: the factor 2+2i satisfies the characteristic equation",
    approx(charAt[0], 0) && approx(charAt[1], 0),
    "(" + fmt(charAt[0], 6) + ", " + fmt(charAt[1], 6) + ")");
  var f1 = Mc([1,0], [0,-1]);
  var w1 = [cm([2,2], [1,0]), cm([2,2], [0,-1])];
  chk(T, "Ex5c: M(1,-i) = (2+2i)(1,-i) — the rail, fed",
    approx(f1[0][0], w1[0][0]) && approx(f1[0][1], w1[0][1]) &&
    approx(f1[1][0], w1[1][0]) && approx(f1[1][1], w1[1][1]),
    "(" + f1[0][0] + "+" + f1[0][1] + "i, " + f1[1][0] + "+" + f1[1][1] + "i)");
  var f2 = Mc([1,0], [0,1]);
  var w2 = [cm([2,-2], [1,0]), cm([2,-2], [0,1])];
  chk(T, "Ex5c: the conjugate rail (1,i) carries 2-2i",
    approx(f2[0][0], w2[0][0]) && approx(f2[0][1], w2[0][1]) &&
    approx(f2[1][0], w2[1][0]) && approx(f2[1][1], w2[1][1]));
  var vs = ca2([2,2], [2,-2]), vp = cm([2,2], [2,-2]);
  chk(T, "Ex5c: Vieta — sum 4 = tr, product 8 = det",
    approx(vs[0], 4) && approx(vs[1], 0) && approx(vp[0], 8) && approx(vp[1], 0));
  chk(T, "Ex5c: the scaled turn — scale 2sqrt(2), angle 45 degrees",
    approx(Math.hypot(2,2), 2*Math.sqrt(2)) && approx(Math.PI/4, Math.atan2(2,2)));
}
