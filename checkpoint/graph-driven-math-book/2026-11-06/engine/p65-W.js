/* piece W — freeze wrapper for the two detector-edge censuses (owner choice 2026-11-03).
   Runs after piece T in the SAME new-Function scope (uses Tsig/Tdet/TdetH/Tk and
   BF/Bfield/Bwrap/rk4 from head+T). Rule 19 compliance: the crossing counter Tk can read
   0 at the T = 1 endpoint edge (pair 4 k = 1: proven crash if looped on), so every k that
   feeds a sample loop is verified by an INDEPENDENT return-time scan (primary) plus a
   phase-shifted crossing recount (secondary) BEFORE looping; a zero reading or a
   disagreement is recorded and the sample loop is skipped for that root. No recursion,
   no BigInt, all loops fixed-bound. */
globalThis.__P4 = null;
globalThis.__P5K1 = null;
function __WretK(e, d, x) {
  var f = Bfield(e, d), y = [x, 0.25], t = 0, i, g, k = 0, minG = 1e9, maxOff = 0;
  for (i = 1; i <= 20; i++) {
    var yn = rk4(f, y, t, t + 0.05, 48); t += 0.05;
    var dx = Bwrap(yn[0] - x), dy = Bwrap(yn[1] - 0.25);
    g = Math.sqrt(dx * dx + dy * dy);
    if (g < 0.05) { k++; } else { if (g > maxOff) { maxOff = g; } }
    if (g < minG) { minG = g; }
  }
  return { k: k, minG: minG, maxOff: maxOff };
}
function __WphaseK(e, d, x) {
  var f = Bfield(e, d);
  var y = rk4(f, [x, 0.25], 0, 0.25, 240), t = 0.25, k = 0, o0 = Bwrap(y[1] - 0.25), i, o1, yn;
  for (i = 0; i < 959; i++) {
    yn = rk4(f, y, t, t + 1 / 960, 1); t += 1 / 960;
    o1 = Bwrap(yn[1] - 0.25);
    if (o0 < 0 && o1 >= 0 && Math.abs(o0) < 0.25 && Math.abs(o1) < 0.25) { k++; }
    o0 = o1; y = yn;
  }
  return k;
}
function __Wsample(e, d, x, k) {
  var maxF = 0, minDet = 1e300, jj, qp, qx, qy, Fq, aq;
  var xw = ((x + 0.5) % 1 + 1) % 1, Fm = BF(e, d, xw, 0.75, 480);
  var mwF = Math.sqrt(Fm[0] * Fm[0] + Fm[1] * Fm[1]);
  for (jj = 0; jj < 8; jj++) {
    var tj = jj / (8 * k), nst = Math.max(2, Math.round(960 * tj));
    qp = rk4(Bfield(e, d), [x, 0.25], 0, tj, nst);
    qx = ((qp[0] % 1) + 1) % 1; qy = ((qp[1] % 1) + 1) % 1;
    Fq = BF(e, d, qx, qy, 480); aq = Math.sqrt(Fq[0] * Fq[0] + Fq[1] * Fq[1]);
    maxF = Math.max(maxF, aq); minDet = Math.min(minDet, Math.abs(Tdet(e, d, qx, qy)));
  }
  return { maxF: +maxF.toExponential(2), minDet: +minDet.toExponential(2), minWellF: +mwF.toExponential(2) };
}
(function () {
  /* pair 4 (0.6, 0.4): T's scan/bisection/sample loops verbatim, k verified before looping */
  try {
    var e = 0.6, d = 0.4, EM = e + d, Es = e - d, R = EM - Es, i, j, prev = null;
    var out = { pair: [e, d], eq: null, roots: [], tkReads: [], kVerified: [] };
    var q = [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]], eqx = 0;
    for (i = 0; i < 4; i++) { var F = BF(e, d, q[i][0], q[i][1], 480); if (F[0] === 0 && F[1] === 0) { eqx++; } }
    var om = 4 * Math.PI * Math.PI * Math.sqrt(e * d), eom = Math.exp(om);
    var detEM = 4 * Math.pow(Math.sin(om / 2), 2), detS = 2 - 2 * Math.cosh(om);
    var hf = 1e-3 / (eom * 0.79); if (hf > 1e-5) { hf = 1e-5; }
    var fd = null;
    if (hf > 4e-17) { fd = { h: hf, relErr: Math.abs((TdetH(e, d, 0.25, 0.75, hf) - detS) / detS), relErrEM: Math.abs((Tdet(e, d, 0.25, 0.25) - detEM) / detEM) }; }
    out.eq = { exact: eqx, detEM: +detEM.toFixed(4), detS: +detS.toExponential(4), fdCheck: fd };
    var N = 256;
    for (j = 0; j <= N; j++) {
      var E = Es + R * (1e-3 + (1 - 1e-4 - 1e-3) * j / N);
      var s = Tsig(e, d, E);
      if (prev && s && prev.s * s.s < 0 && Math.abs(prev.s) < 0.45 && Math.abs(s.s) < 0.45) {
        var a = prev.E, b = E, sa = prev.s, m, sm, it;
        for (it = 0; it < 36; it++) { m = 0.5 * (a + b); sm = Tsig(e, d, m); if (!sm) { break; } if (sa * sm.s <= 0) { b = m; } else { a = m; sa = sm.s; } }
        var root = Tsig(e, d, 0.5 * (a + b)), absF = Math.sqrt(root.s * root.s + root.dx * root.dx);
        if (absF < 1e-5) {
          var tkRead = Tk(e, d, root.x), ret = __WretK(e, d, root.x), phK = __WphaseK(e, d, root.x);
          out.tkReads.push(tkRead);
          out.kVerified.push({ tk: tkRead, ret: ret.k, phase: phK, minG: +ret.minG.toFixed(4) });
          if (ret.k >= 1 && phK === ret.k) {
            var smp = __Wsample(e, d, root.x, ret.k);
            out.roots.push({ type: "circle", k: ret.k, E: +root.E.toFixed(6), absF: +absF.toExponential(2), maxF: smp.maxF, minDet: smp.minDet, minWellF: smp.minWellF });
          } else {
            out.roots.push({ type: "circle-unverified-k", E: +root.E.toFixed(6), absF: +absF.toExponential(2), tk: tkRead, ret: ret.k, phase: phK });
          }
        } else { out.roots.push({ type: "half", E: +root.E.toFixed(6), absF: +absF.toExponential(3) }); }
      }
      prev = s;
    }
    globalThis.__P4 = out;
  } catch (er) { globalThis.__P4 = { err: String(er && er.message || er) }; }
})();
(function () {
  /* pair 5 (1.0, 0.7) k = 1: geometric delta-scan below T's grid floor (R3c protocol), k verified */
  try {
    var e = 1.0, d = 0.7, Es = e - d, j, prev = null, bracket = null;
    for (j = 0; j <= 96; j++) {
      var delta = 1e-7 * Math.pow(140, j / 96);
      var s = Tsig(e, d, Es + delta);
      if (prev && s && prev.s * s.s < 0 && Math.abs(prev.s) < 0.45 && Math.abs(s.s) < 0.45 && bracket === null) {
        bracket = { lo: prev.E, hi: s.E, sLo: prev.s };
      }
      prev = s;
    }
    var out = { scanned: 97, bracketFound: !!bracket, notes: [] };
    if (bracket) {
      var a = bracket.lo, b = bracket.hi, sa = bracket.sLo, m, sm, it;
      for (it = 0; it < 36; it++) { m = 0.5 * (a + b); sm = Tsig(e, d, m); if (!sm) { break; } if (sa * sm.s <= 0) { b = m; } else { a = m; sa = sm.s; } }
      var root = Tsig(e, d, 0.5 * (a + b)), absF = Math.sqrt(root.s * root.s + root.dx * root.dx);
      out.E = +root.E.toFixed(6); out.absF = +absF.toExponential(4); out.gate = absF < 1e-5;
      if (out.gate) {
        var tkRead = Tk(e, d, root.x), ret = __WretK(e, d, root.x), phK = __WphaseK(e, d, root.x);
        out.tk = tkRead; out.retK = ret.k; out.phaseK = phK; out.minG = +ret.minG.toFixed(6);
        if (ret.k === 1 && phK === 1) {
          var smp = __Wsample(e, d, root.x, 1);
          out.maxF = smp.maxF; out.minDet = smp.minDet; out.minWellF = smp.minWellF;
        } else { out.notes.push("k not verified as 1 (ret " + ret.k + ", phase " + phK + ") - sample loop skipped"); }
      } else { out.notes.push("gate failed - not a resonant loop"); }
    } else { out.notes.push("no sign change bracketed in delta 1e-7..1.4e-5"); }
    globalThis.__P5K1 = out;
  } catch (er) { globalThis.__P5K1 = { err: String(er && er.message || er) }; }
})();
