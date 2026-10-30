// p18-lab.js — fresh battery for P18 "Lift to a higher dimension"
// Piece protocol (S46): lab-head + p0..p5 (+ p3x/p4x/p5x) + tail, cat-assembled.
// Zero code shared with the adversarial verifier. No recursion, no BigInt,
// deterministic throughout (fixed seeds / pure sweeps only).
var __P18_STATE__ = { pass: 0, fail: 0, checks: [] };
function chk(tag, label, ok, detail) {
  var d = (detail === undefined || detail === null) ? "" : "   [" + detail + "]";
  var line = (ok ? "PASS" : "FAIL") + "  " + label + d;
  __P18_STATE__.checks.push({ tag: tag, label: label, ok: ok, line: line });
  if (ok) __P18_STATE__.pass++; else __P18_STATE__.fail++;
  if (!ok && typeof __P18_STOP__ !== "undefined" && __P18_STOP__) throw new Error("FAILED: " + label);
  return ok;
}
function fmt(x, d) { var n = (d === undefined) ? 9 : d; return Number(x).toFixed(n); }
function approx(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }
// --- page loading: chunked read joined on newlines (S50 lesson) ---
async function loadPage(path) {
  var whole = "";
  var off = 0;
  for (var i = 0; i < 12; i++) {
    var r = await tools.file_system.read_file({ path: path, offset: off, limit: 60 });
    var t = (typeof r === "string") ? r : (r.content !== undefined ? r.content : r.text);
    var truncated = (typeof r === "object" && r !== null) ? (r.was_truncated === true) : false;
    whole += (i === 0 ? t : "\n" + t); // re-join the dropped boundary newline
    if (!truncated) break;
    var lines = (typeof r === "object" && r.lines_read !== undefined) ? r.lines_read : 60;
    off = off + lines;
  }
  return whole;
}
function countOf(s, needle) { var n = 0, i = s.indexOf(needle); while (i !== -1) { n++; i = s.indexOf(needle, i + needle.length); } return n; }
// linear algebra helpers, iterative only
function sub(a, b) { return [a[0]-b[0], a[1]-b[1], (a.length>2?a[2]-b[2]:0)]; }
function cross3(u, v) { return [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]; }
function collinear3(p, q, r) { var c = cross3(sub(q,p), sub(r,p)); return Math.hypot(c[0],c[1],c[2]) < 1e-9; }
function line3(p, q) { return { p: p, d: sub(q, p) }; }
function onLine3(L, x) { return collinear3(L.p, [L.p[0]+L.d[0], L.p[1]+L.d[1], L.p[2]+L.d[2]], x); }
function meet2(p, q, r, s) { // 2D meet of line pq with line rs
  var d1 = [q[0]-p[0], q[1]-p[1]], d2 = [s[0]-r[0], s[1]-r[1]];
  var den = d1[0]*d2[1] - d1[1]*d2[0];
  var t = ((r[0]-p[0])*d2[1] - (r[1]-p[1])*d2[0]) / den;
  return [p[0]+t*d1[0], p[1]+t*d1[1]];
}
function simpson(g, a, b, n) {
  var h = (b - a) / n, s = g(a) + g(b);
  for (var i = 1; i < n; i++) s += g(a + i*h) * (i % 2 ? 4 : 2);
  return s * h / 3;
}
