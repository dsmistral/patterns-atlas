/* piece T — targeted fixed-set census for the five pairs (owner choice 2026-11-03).
   Fact: a point is fixed by the time-1 map iff it is an equilibrium or lies on a level
   loop whose period T = 1/k (the time-1 map is the identity on such loops). So: certify
   the 4 equilibria (bit-exact F) and root-find the resonant levels via the signed
   y-mismatch sigma(E) = wrap(y1 - 1/4) on the max-well loop family p(E) = (xR(E), 1/4);
   genuine circles pass the full |F| gate and the k-classification (upward crossings of
   the line y = 1/4 during time 1); the min well is the mirror (x,y)->(x+1/2,y+1/2),
   H -> -H, same fixed set, spot-checked per circle. No recursion, no BigInt. */
function TxE(e, d, E) { var c = (E - d) / e; if (c < -1 || c > 1) return null; var w = Math.acos(c); return (Math.PI / 2 + w) / (2 * Math.PI); }
function Tsig(e, d, E) { var x = TxE(e, d, E); if (x === null) return null; var r = Bphi(e, d, x, 0.25, 480); return { E: E, x: x, s: Bwrap(r[1] - 0.25), dx: Bwrap(r[0] - x) }; }
function Tdet(e, d, x, y) { var h = 1e-5, a = BF(e, d, x + h, y, 480), b = BF(e, d, x - h, y, 480), c = BF(e, d, x, y + h, 480), g = BF(e, d, x, y - h, 480); var j1 = (a[0] - b[0]) / (2 * h), j2 = (c[0] - g[0]) / (2 * h), j3 = (a[1] - b[1]) / (2 * h), j4 = (c[1] - g[1]) / (2 * h); return j1 * j4 - j2 * j3; }
function TdetH(e, d, x, y, hh) { var a = BF(e, d, x + hh, y, 480), b = BF(e, d, x - hh, y, 480), c = BF(e, d, x, y + hh, 480), g = BF(e, d, x, y - hh, 480); var j1 = (a[0] - b[0]) / (2 * hh), j2 = (c[0] - g[0]) / (2 * hh), j3 = (a[1] - b[1]) / (2 * hh), j4 = (c[1] - g[1]) / (2 * hh); return j1 * j4 - j2 * j3; }
function Tk(e, d, x) { var f = Bfield(e, d), dt = 1 / 960, y = [x, 0.25], t = 0, i, k = 0, o0 = 0, o1, yn; for (i = 0; i < 960; i++) { yn = rk4(f, y, t, t + dt, 1); t += dt; o1 = Bwrap(yn[1] - 0.25); if (o0 < 0 && o1 >= 0 && Math.abs(o0) < 0.25 && Math.abs(o1) < 0.25) { k++; } o0 = o1; y = yn; } return k; }
globalThis.__T = null;
(function () {
  var pairs = globalThis.__TPAIRS || [[0.05, 0.03], [0.1, 0.1], [0.3, 0.2], [0.6, 0.4], [1.0, 0.7]], out = [], p;
  for (p = 0; p < pairs.length; p++) {
    var e = pairs[p][0], d = pairs[p][1], EM = e + d, Es = e - d, R = EM - Es;
    var rec = { pair: [e, d], eq: null, roots: [] }, i;
    var q = [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]];
    var eqx = 0;
    for (i = 0; i < 4; i++) { var F = BF(e, d, q[i][0], q[i][1], 480); if (F[0] === 0 && F[1] === 0) { eqx++; } }
    var om = 4 * Math.PI * Math.PI * Math.sqrt(e * d), eom = Math.exp(om);
    var detEM = 4 * Math.pow(Math.sin(om / 2), 2), detS = 2 - 2 * Math.cosh(om);
    var hf = 1e-3 / (eom * 0.79); if (hf > 1e-5) { hf = 1e-5; }
    var fd = null;
    if (hf > 4e-17) { fd = { h: hf, relErr: Math.abs((TdetH(e, d, 0.25, 0.75, hf) - detS) / detS), relErrEM: Math.abs((Tdet(e, d, 0.25, 0.25) - detEM) / detEM) }; }
    rec.eq = { exact: eqx, detEM: +detEM.toFixed(4), detS: +detS.toExponential(4), fdCheck: fd };
    var N = 256, prev = null, j;
    for (j = 0; j <= N; j++) {
      var E = Es + R * (1e-3 + (1 - 1e-4 - 1e-3) * j / N);
      var s = Tsig(e, d, E);
      if (prev && s && prev.s * s.s < 0 && Math.abs(prev.s) < 0.45 && Math.abs(s.s) < 0.45) {
        var a = prev.E, b = E, sa = prev.s, m, sm, it;
        for (it = 0; it < 36; it++) { m = 0.5 * (a + b); sm = Tsig(e, d, m); if (!sm) { break; } if (sa * sm.s <= 0) { b = m; } else { a = m; sa = sm.s; } }
        var root = Tsig(e, d, 0.5 * (a + b)), absF = Math.sqrt(root.s * root.s + root.dx * root.dx);
        if (absF < 1e-5) {
          var k = Tk(e, d, root.x), maxF = 0, minDet = 1e300, jj;
          var xw = ((root.x + 0.5) % 1 + 1) % 1, Fm = BF(e, d, xw, 0.75, 480);
          var mwF = Math.sqrt(Fm[0] * Fm[0] + Fm[1] * Fm[1]);
          for (jj = 0; jj < 8; jj++) {
            var tj = jj / (8 * k), nst = Math.max(2, Math.round(960 * tj));
            var qp = rk4(Bfield(e, d), [root.x, 0.25], 0, tj, nst);
            var qx = ((qp[0] % 1) + 1) % 1, qy = ((qp[1] % 1) + 1) % 1;
            var Fq = BF(e, d, qx, qy, 480), aq = Math.sqrt(Fq[0] * Fq[0] + Fq[1] * Fq[1]);
            maxF = Math.max(maxF, aq); minDet = Math.min(minDet, Math.abs(Tdet(e, d, qx, qy)));
          }
          rec.roots.push({ type: "circle", k: k, E: +root.E.toFixed(6), absF: +absF.toExponential(2), maxF: +maxF.toExponential(2), minDet: +minDet.toExponential(2), minWellF: +mwF.toExponential(2) });
        } else { rec.roots.push({ type: "half", E: +root.E.toFixed(6), absF: +absF.toExponential(3) }); }
      }
      prev = s;
    }
    out.push(rec);
  }
  globalThis.__T = { pairs: out, bchecks: OUT };
})();
