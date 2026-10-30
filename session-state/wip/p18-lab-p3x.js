// ============ p3x: §4 Example 2 — the census repaired upstairs ============
function p3x(page) {
  var T = "p3x";
  // Hamilton's couples: [re, im]
  function ca(u, v) { return [u[0]+v[0], u[1]+v[1]]; }
  function cm(u, v) { return [u[0]*v[0]-u[1]*v[1], u[0]*v[1]+u[1]*v[0]]; }
  chk(T, "couples: (0,1)(0,1) = (-1,0)", approx(cm([0,1],[0,1])[0], -1) && approx(cm([0,1],[0,1])[1], 0));
  var embOK = true;
  for (var a = -2; a <= 2; a++) for (var c = -2; c <= 2; c++) {
    if (!approx(ca([a,0],[c,0])[0], a+c) || !approx(cm([a,0],[c,0])[0], a*c)) embOK = false;
  }
  chk(T, "embedding a -> (a,0) carries + and x over untouched", embOK);
  chk(T, "multiplying by i sends (c,d) to (-d,c) (a quarter-turn)",
    approx(cm([0,1],[3,4])[0], -4) && approx(cm([0,1],[3,4])[1], 3));
  // the census, swept and sorted by discriminant sign
  var vals = [-2,-1,0,1,2], nP = 0, nZ = 0, nN = 0, pure = 0, shear = 0, integerLambda = true;
  var vietaOK = true, charOK = true, evCount = 0;
  for (var ai = 0; ai < 5; ai++) for (var bi = 0; bi < 5; bi++)
  for (var ci = 0; ci < 5; ci++) for (var di = 0; di < 5; di++) {
    var a = vals[ai], b = vals[bi], c = vals[ci], d = vals[di];
    var tr = a + d, det = a*d - b*c, D = (a-d)*(a-d) + 4*b*c;
    var lam1, lam2, l1, l2;
    if (D > 0) { nP++; var s = Math.sqrt(D); lam1 = [(tr+s)/2, 0]; lam2 = [(tr-s)/2, 0]; }
    else if (D === 0) {
      nZ++;
      if ((a-d)%2 !== 0) integerLambda = false;
      if (b === 0 && c === 0 && a === d) pure++; else shear++;
      lam1 = [tr/2, 0]; lam2 = [tr/2, 0];
    } else {
      nN++;
      var t2 = Math.sqrt(-D)/2;
      lam1 = [tr/2, t2]; lam2 = [tr/2, -t2];
      // Vieta's two readings on every empty-handed machine
      var s12 = ca(lam1, lam2), p12 = cm(lam1, lam2);
      if (!(approx(s12[0], tr) && approx(s12[1], 0) && approx(p12[0], det) && approx(p12[1], 0))) vietaOK = false;
    }
    // both eigenvalues satisfy the characteristic equation (upstairs, counting multiplicity)
    l1 = lam1; l2 = lam2;
    var e1 = ca(cm(l1, l1), [-tr*l1[0], -tr*l1[1]]), e1f = ca(e1, [det, 0]);
    var e2 = ca(cm(l2, l2), [-tr*l2[0], -tr*l2[1]]), e2f = ca(e2, [det, 0]);
    if (Math.hypot(e1f[0], e1f[1]) > 1e-9 || Math.hypot(e2f[0], e2f[1]) > 1e-9) charOK = false;
    evCount += 2;
  }
  chk(T, "census by discriminant: 416 two-rail, 61 doubled, 148 empty-handed",
    nP === 416 && nZ === 61 && nN === 148, nP + "/" + nZ + "/" + nN);
  chk(T, "of the 61: five pure stretches, fifty-six shears", pure === 5 && shear === 56, pure + "/" + shear);
  chk(T, "every doubled factor is an integer (no half-integer eigenvalue)", integerLambda);
  chk(T, "Vieta's two readings hold on all 148 (sum=trace, product=determinant)", vietaOK);
  chk(T, "both eigenvalues of every machine feed the characteristic equation", charOK);
  chk(T, "the census closes at 625 x 2 = 1250 eigenvalues upstairs", evCount === 1250);
  chk(T, "416 + 61 + 148 = 625", nP + nZ + nN === 625);
  // the quarter-turn, repaired
  var Qi = function(u, v) { return [[-1*v[0], -1*v[1]], [u[0], u[1]]]; }; // [[0,-1],[1,0]]
  var one = [1,0], iC = [0,1], mi = [0,-1];
  var r1 = Qi(one, iC);              // Q(1,i)
  chk(T, "Q(1,i) = (-i,1) = -i(1,i): rail with factor -i",
    approx(r1[0][0], 0) && approx(r1[0][1], -1) && approx(r1[1][0], 1) && approx(r1[1][1], 0) &&
    approx(cm(mi, one)[0], 0) && approx(cm(mi, one)[1], -1) &&
    approx(cm(mi, iC)[0], 1) && approx(cm(mi, iC)[1], 0));
  var r2 = Qi(one, mi);              // Q(1,-i)
  chk(T, "Q(1,-i) = (i,1) = i(1,-i): rail with factor i",
    approx(r2[0][0], 0) && approx(r2[0][1], 1) && approx(r2[1][0], 1) && approx(r2[1][1], 0) &&
    approx(cm(iC, one)[0], 0) && approx(cm(iC, one)[1], 1) &&
    approx(cm(iC, mi)[0], 1) && approx(cm(iC, mi)[1], 0));
  // the concrete repair M = [[1,-2],[2,1]], one of the 148
  var M = function(u, v) { return [[u[0]-2*v[0], u[1]-2*v[1]], [2*u[0]+v[0], 2*u[1]+v[1]]]; };
  chk(T, "M = [[1,-2],[2,1]]: trace 2, determinant 5, discriminant -16",
    1+1 === 2 && 1*1-(-2)*2 === 5 && (1-1)*(1-1)+4*(-2)*2 === -16);
  var feed = M(one, mi);             // M(1,-i)
  var fac = [1,2];                   // 1+2i
  var want = [cm(fac, one), cm(fac, mi)];
  chk(T, "M(1,-i) = (1+2i)(1,-i): rail with factor 1+2i",
    approx(feed[0][0], want[0][0]) && approx(feed[0][1], want[0][1]) &&
    approx(feed[1][0], want[1][0]) && approx(feed[1][1], want[1][1]),
    "(" + feed[0][0] + "+" + feed[0][1] + "i, " + feed[1][0] + "+" + feed[1][1] + "i)");
  var feedC = M(one, iC);           // M(1,i)
  var wantC = [cm([1,-2], one), cm([1,-2], iC)]; // (1-2i) times (1, i)
  chk(T, "conjugate rail: M(1,i) = (1-2i)(1,i), i.e. (1-2i, 2+i)",
    approx(feedC[0][0], wantC[0][0]) && approx(feedC[0][1], wantC[0][1]) &&
    approx(feedC[1][0], wantC[1][0]) && approx(feedC[1][1], wantC[1][1]),
    "(" + feedC[0][0] + "+" + feedC[0][1] + "i, " + feedC[1][0] + "+" + feedC[1][1] + "i)");
  var junk = M(one, [0,0]);          // the wrong descent: drop the imaginary parts
  chk(T, "junk descent: M(1,0) = (1,2), nobody's eigenvector",
    approx(junk[0][0], 1) && approx(junk[0][1], 0) && approx(junk[1][0], 2) && approx(junk[1][1], 0) &&
    !(approx(junk[1][0], 0) && approx(junk[1][1], 0)));
  chk(T, "page pins the repair: the lab checks every step of this paragraph",
    page.indexOf("The lab checks every step of this paragraph by substitution") !== -1);
  chk(T, "page pins the wholesale closure at 625 x 2 = 1250",
    page.indexOf("625 \\times 2 = 1250") !== -1);
}
