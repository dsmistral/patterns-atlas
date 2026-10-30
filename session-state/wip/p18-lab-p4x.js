// ============ p4x: §5 Exhibit B — the nearfield, algebra first ============
function p4x(page) {
  var T = "p4x";
  // F9 = {a + b t : a,b in F3}, t^2 = -1 = 2 (mod 3); element = index 3a+b
  function E(a, b) { return 3*a + b; }
  function ea(u) { return Math.floor(u / 3); }
  function eb(u) { return u % 3; }
  function fadd(u, v) { return E((ea(u)+ea(v)) % 3, (eb(u)+eb(v)) % 3); }
  function fneg(u) { return E((3 - ea(u)) % 3, (3 - eb(u)) % 3); }
  function fmul(u, v) {
    return E((((ea(u)*ea(v) - eb(u)*eb(v)) % 9) + 9) % 3,
             (((ea(u)*eb(v) + eb(u)*ea(v)) % 9) + 9) % 3);
  }
  var t = E(0,1);
  chk(T, "t^2 = -1 = 2 in F9", fmul(t, t) === E(2,0));
  // the squares (the order-4 subgroup of F9*), 0 is a square too
  var H = {}; H[E(1,0)] = 1; H[E(2,0)] = 1; H[E(0,1)] = 1; H[E(0,2)] = 1; H[0] = 1;
  function isSq(u) { return H[u] === 1; }
  function cube(u) { return fmul(fmul(u, u), u); }
  // Dickson's twist: a circ b = ab if a is a square, a b^3 otherwise
  function circ(a, b) { return isSq(a) ? fmul(a, b) : fmul(a, cube(b)); }
  chk(T, "one line shows the twist biting: (1+t) circ t = 1+2t",
    circ(E(1,1), t) === E(1,2));
  chk(T, "while 1 circ t + t circ t = t + 2 — not equal",
    fadd(circ(E(1,0), t), circ(t, t)) === E(2,1) && circ(E(1,1), t) !== fadd(circ(E(1,0), t), circ(t, t)));
  chk(T, "right-distributivity over a sum is gone (the same witness)",
    circ(fadd(E(1,0), t), t) !== fadd(circ(E(1,0), t), circ(t, t)));
  // associativity: all 9^3 triples
  var assocOK = true;
  for (var i = 0; i < 9; i++) for (var j = 0; j < 9; j++) for (var k = 0; k < 9; k++)
    if (circ(circ(i, j), k) !== circ(i, circ(j, k))) assocOK = false;
  chk(T, "circ is associative (full 729-triple sweep)", assocOK);
  // identity and inverses
  var idOK = true, invOK = true;
  for (var i2 = 0; i2 < 9; i2++) {
    if (circ(E(1,0), i2) !== i2 || circ(i2, E(1,0)) !== i2) idOK = false;
    if (i2 !== 0) {
      var found = false;
      for (var j2 = 0; j2 < 9; j2++) if (circ(i2, j2) === E(1,0)) found = true;
      if (!found) invOK = false;
    }
  }
  chk(T, "identity is 1 on both sides", idOK);
  chk(T, "every nonzero element owns an inverse", invOK);
  // left-distributivity: full sweep
  var leftOK = true;
  for (var i3 = 0; i3 < 9; i3++) for (var j3 = 0; j3 < 9; j3++) for (var k3 = 0; k3 < 9; k3++)
    if (circ(i3, fadd(j3, k3)) !== fadd(circ(i3, j3), circ(i3, k3))) leftOK = false;
  chk(T, "circ distributes from the left (full sweep)", leftOK);
  // so it is a nearfield — and the page says so
  chk(T, "page names Dickson's twist (1905, the first proper nearfield)",
    page.indexOf("Dickson's twist (1905, the first proper nearfield)") !== -1);
  chk(T, "page names the 1907 Veblen-Wedderburn plane",
    page.indexOf("Veblen and Wedderburn published in 1907") !== -1);
  chk(T, "page pins the field recipe (three digits, t^2 = -1, mod 3)",
    page.indexOf("complex-style arithmetic mod 3") !== -1);
}
