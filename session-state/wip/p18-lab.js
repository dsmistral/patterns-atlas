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
// ============ p0: page bytes and structure ============
async function p0(page) {
  var T = "p0";
  chk(T, "title is P18's", page.indexOf("<title>P18 · Lift to a higher dimension · The Patterns Atlas</title>") !== -1);
  var mj = "window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']]},svg:{fontCache:'global'}};";
  chk(T, "MathJax config line byte-identical to the house template", page.indexOf("<script>" + mj + "</script>") !== -1);
  chk(T, "tail byte-exact \\n</footer>\\n</body>\\n</html>\\n", page.slice(-27) === "\n</footer>\n</body>\n</html>\n");
  var ids = ["bridge","encounter","name-the-move","the-move-at-work","when-it-fails","what-next","lineage","exercises"];
  for (var i = 0; i < ids.length; i++) chk(T, "section id=" + ids[i], page.indexOf('<section id="' + ids[i] + '">') !== -1);
  chk(T, "8 h2", countOf(page, "<h2>") === 8, "" + countOf(page, "<h2>"));
  chk(T, "9 h3", countOf(page, "<h3>") === 9, "" + countOf(page, "<h3>"));
  chk(T, "3 pattern boxes (box-p18, box-p18a, box-p18b)",
    page.indexOf('id="box-p18"') !== -1 && page.indexOf('id="box-p18a"') !== -1 && page.indexOf('id="box-p18b"') !== -1);
  chk(T, "warn box Scope and price of P18", page.indexOf("<h3>Scope and price of P18</h3>") !== -1);
  chk(T, "10 details = 5 Hint + 5 Worked",
    countOf(page, "<details>") === 10 && countOf(page, "<summary>Hint</summary>") === 5 && countOf(page, "<summary>Worked</summary>") === 5,
    countOf(page, "<details>") + "/" + countOf(page, "<summary>Hint</summary>") + "/" + countOf(page, "<summary>Worked</summary>"));
  chk(T, "5 exercises with the house moon scale (●○○ ●●○ ●●● ◆ ◐)",
    page.indexOf("Exercise 1 (●○○)") !== -1 && page.indexOf("Exercise 2 (●●○)") !== -1 &&
    page.indexOf("Exercise 3 (●●●)") !== -1 && page.indexOf("Exercise 4 (◆)") !== -1 && page.indexOf("Exercise 5 (◐)") !== -1);
  chk(T, "zero dollar-delimiters", page.indexOf("$") === -1);
  chk(T, "zero backticks", page.indexOf("`") === -1);
  var rop = countOf(page, "\\("), rcl = countOf(page, "\\)"), dop = countOf(page, "\\["), dcl = countOf(page, "\\]");
  chk(T, "raw inline openers 594 = closers 594 (1 each inside the MathJax line)",
    rop === 594 && rcl === 594, rop + "/" + rcl);
  chk(T, "raw display openers 2 = closers 2 (1 each inside the MathJax line)",
    dop === 2 && dcl === 2, dop + "/" + dcl);
  chk(T, "2 machine-verified SVG figures", countOf(page, "<svg viewBox") === 2);
  chk(T, "2 digit-tables", countOf(page, 'class="digit-table"') === 2);
  chk(T, "footer return-index + next-link P19",
    page.indexOf('Return to the <a href="index.html">index</a> · Next: <a href="p19-count-outcomes.html">P19 · Count the outcomes</a>') !== -1);
  chk(T, "kicker names the first move of tier 2", page.indexOf("P18 · the first move of tier 2") !== -1);
  chk(T, "onramp: 3 New words (lift, projection, perspectivity)",
    page.indexOf("<strong>New word: lift.</strong>") !== -1 &&
    page.indexOf("<strong>New word: projection.</strong>") !== -1 &&
    page.indexOf("<strong>New word: perspectivity.</strong>") !== -1);
  // needles, one per block (drafted from the page, verified against these bytes)
  var needles = [
    ["h1", "<h1>Lift to a higher dimension</h1>"],
    ["§1", "the object nobody handed us is sometimes a whole extra dimension"],
    ["§2", "This is <strong>Desargues's theorem</strong>"],
    ["§3", "prove the easy version upstairs, and then pay for the trip back down"],
    ["§4E1", "The proof is three sentences."],
    ["§4E2", "Name the room.</strong> The bigger room is the complex numbers"],
    ["§4E3", "Refuse, then lift.</strong>"],
    ["§5A", "a projection is honest only relative to a question"],
    ["§5B", "Floors with no room above"],
    ["§5C", "the room that solves other people's problems"],
    ["§6", "<h3>Doors this opens</h3>"],
    ["§7", "first published inside a book about drawing them"],
    ["§8", "<h2>8 · Exercises</h2>"]
  ];
  for (var k = 0; k < needles.length; k++)
    chk(T, "needle " + needles[k][0], page.indexOf(needles[k][1]) !== -1);
  // poisons: strings that must NOT be on the page (defect pre-images and lies)
  var poisons = [
    ["wrong Hilbert date", "Hilbert, in lectures of 1898–1900"],
    ["wrong Veblen–Wedderburn year", "Veblen and Wedderburn used one in 1908"],
    ["wrong Hamilton year", "Hamilton in 1835 built the room"],
    ["old Ex3 moon", "Exercise 3 (●●○)"],
    ["drafting voice", "wait, that"],
    ["naive polar claim on sinc", "the pair integrand is radial"],
    ["old junk axis", "19x + 10y + 12 = 0"],
    ["wrong census upstairs", "625 × 3 = 1875"]
  ];
  for (var k2 = 0; k2 < poisons.length; k2++)
    chk(T, "poison absent: " + poisons[k2][0], page.indexOf(poisons[k2][1]) === -1);
}
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
// ============ p2: §3 name the move — box content ============
function p2(page) {
  var T = "p2";
  var needles = [
    ["move title", "P18 · Lift to a higher dimension — prove the easy shadow-free problem upstairs"],
    ["move close", "The lift gives room, not truth: everything gained upstairs is provisional until the return trip is paid for"],
    ["sigh", "is a sigh"],
    ["decoration", "If the upstairs proof never touches the extra coordinate, the room was decoration"],
    ["change of subject", "A lift that does not pass this test is a change of subject"],
    ["box A title", "Box P18.A · The three promises of a lift"],
    ["promise 1", "Promise 1"],
    ["promise 2", "Promise 2"],
    ["promise 3", "Promise 3"],
    ["honesty", "in the checks, not the vibes"],
    ["box B title", "Box P18.B · Where it shows up, and the three-key signature"],
    ["key 1", "First, the jam smells like missing room"],
    ["key 2", "a lift without a named projection is a metaphor, and metaphors prove nothing"],
    ["key 3", "you can say in advance what the descent will cost"],
    ["keys close", "One key alone is a guess; two keys, a hypothesis; all three, a plan."],
    ["dandelin", "the foci of a sliced cone appearing as the touching points of spheres inscribed in it"]
  ];
  for (var k = 0; k < needles.length; k++)
    chk(T, "needle " + needles[k][0], page.indexOf(needles[k][1]) !== -1);
  // the three boxes are boxed in the page's own id scheme
  chk(T, "box ids present", page.indexOf('id="box-p18"') !== -1 &&
    page.indexOf('id="box-p18a"') !== -1 && page.indexOf('id="box-p18b"') !== -1);
  // box B names the four terrains and the two later pages
  chk(T, "box B names P20's engine", page.indexOf('P20</a>' + "'s entire engine") !== -1);
  chk(T, "box B names P27", page.indexOf('industrialized as a whole later page (<a href="p27-complex-for-integers.html">P27</a>)') !== -1);
  chk(T, "box B names Dandelin's spheres", page.indexOf("Dandelin's spheres (1822)") !== -1);
  chk(T, "box B names Hamilton 1837", page.indexOf("Hamilton's 1837") !== -1);
  chk(T, "box B names Stirling", page.indexOf("Stirling's formula is honestly proved") !== -1);
}
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
// ============ p3f: Fig P18.2 — the room above, pixel by pixel ============
function p3f(page) {
  var T = "p3f";
  function px(p, q) { return [q[0]-p[0], q[1]-p[1]]; }
  function cross2(u, v) { return u[0]*v[1] - u[1]*v[0]; }
  function onLine(a, b, c, tol) { return Math.abs(cross2(px(a,b), px(a,c))) < (tol || 0.5); }
  var Os = [280,230], A = [410,120], B = [500,50], C = [50,120];
  var Ap = [345,175], Bp = [353.33,170], Cp = [395,285];
  var P = [320,190], Q = [320,78], R = [320,120];
  chk(T, "O*, A, A' collinear in pixels", onLine(Os, A, Ap));
  chk(T, "O*, B, B' collinear in pixels", onLine(Os, B, Bp, 2));
  chk(T, "O*, C, C' collinear in pixels", onLine(Os, C, Cp));
  chk(T, "P on the pixel line AB", onLine(A, B, P));
  chk(T, "P on the pixel line A'B'", onLine(Ap, Bp, P, 2));
  chk(T, "Q on the pixel line BC", onLine(B, C, Q));
  chk(T, "Q on the pixel line B'C'", onLine(Bp, Cp, Q, 2));
  chk(T, "R on the pixel line CA", onLine(C, A, R));
  chk(T, "R on the pixel line C'A'", onLine(Cp, Ap, R));
  chk(T, "P, Q, R all on the vertical line x=320", P[0] === 320 && Q[0] === 320 && R[0] === 320);
  chk(T, "ell drawn as the vertical line (320,15)-(320,288)",
    page.indexOf('<line x1="320" y1="15" x2="320" y2="288"') !== -1);
  chk(T, "P,Q,R inside the drawn span of ell", P[1] > 15 && P[1] < 288 && Q[1] > 15 && Q[1] < 288 && R[1] > 15 && R[1] < 288);
  // the drawn dashes lie on the lines they claim to extend
  chk(T, "dash P-B on line AB", onLine(A, B, [320,190]) && onLine(A, B, [500,50]));
  chk(T, "dash P-(360,166) on line A'B'", onLine(Ap, Bp, [320,190], 2) && onLine(Ap, Bp, [360,166], 2));
  chk(T, "dash C-B on line BC", onLine(B, C, [50,120]) && onLine(B, C, [500,50]));
  chk(T, "dash Q-C' on line B'C'", onLine(Bp, Cp, [320,78], 2) && onLine(Bp, Cp, [395,285], 2));
  chk(T, "dash C-A on line CA", onLine(C, A, [50,120]) && onLine(C, A, [410,120]));
  chk(T, "dash R-C' on line C'A'", onLine(Cp, Ap, [320,120]) && onLine(Cp, Ap, [395,285]));
  chk(T, "light dash O*-A on the ray O*A", onLine(Os, A, [280,230]) && onLine(Os, A, [410,120]));
  chk(T, "light dash O*-B on the ray O*B", onLine(Os, B, [280,230]) && onLine(Os, B, [500,50]));
  chk(T, "light dash C-C' on the ray O*C", onLine(Os, C, [50,120]) && onLine(Os, C, [395,285]));
  // every labelled point is drawn as a circle
  var circles = ['cx="280" cy="230"', 'cx="410" cy="120"', 'cx="500" cy="50"', 'cx="50" cy="120"',
    'cx="345" cy="175"', 'cx="353.33" cy="170"', 'cx="395" cy="285"',
    'cx="320" cy="190"', 'cx="320" cy="78"', 'cx="320" cy="120"'];
  var allC = true;
  for (var i = 0; i < circles.length; i++) if (page.indexOf(circles[i]) === -1) allC = false;
  chk(T, "all ten labelled points drawn as circles", allC);
  // the caption pins the three meets in coordinates
  chk(T, "caption: P = (1,0,1)", page.indexOf("P = (1,0,1)") !== -1);
  chk(T, "caption: Q = (1,8/5,1) in TeX", page.indexOf("Q = (1,\\frac{8}{5},1)") !== -1);
  chk(T, "caption: R = (1,1,1)", page.indexOf("R = (1,1,1)") !== -1);
  chk(T, "caption names both planes and the perspective center",
    page.indexOf("in perspective from") !== -1 && page.indexOf("O^* = (0,0,0)") !== -1);
}
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
// ============ p4: §4 Example 3 (Gaussian) + §5 Exhibits A and C ============
function p4(page) {
  var T = "p4";
  var SQPI = Math.sqrt(Math.PI);
  // --- Example 3: the famous integral, refused then done in two dimensions ---
  var I = simpson(function(x) { return Math.exp(-x*x); }, -6, 6, 2000);
  chk(T, "I = int e^{-x^2} over the line = sqrt(pi) = 1.7724538509", approx(I, SQPI, 1e-10), fmt(I, 10));
  chk(T, "sqrt(pi) = 1.7724538509 as printed", approx(SQPI, 1.7724538509, 5e-10), fmt(SQPI, 10));
  var Isq = I * I;
  chk(T, "I^2 = pi (the product of the two one-dimensional factors)", approx(Isq, Math.PI, 1e-9), fmt(Isq, 10));
  var radial = simpson(function(r) { return Math.exp(-r*r) * r; }, 0, 8, 2000);
  chk(T, "the radial integral int e^{-r^2} r dr = 1/2", approx(radial, 0.5, 1e-10), fmt(radial, 10));
  chk(T, "2 pi times the radial integral = pi (the room pays out)",
    approx(2 * Math.PI * radial, Math.PI, 1e-9));
  var eu = simpson(function(u) { return Math.exp(-u); }, 0, 40, 20000);
  chk(T, "substitution u = r^2, way one: (1/2) int e^{-u} du = 1/2", approx(eu / 2, 0.5, 1e-10), fmt(eu/2, 10));
  var rr = simpson(function(r) { return Math.exp(-r*r) * r; }, 0, 8, 16000);
  var uu = simpson(function(u) { return Math.exp(-u); }, 0, 64, 32000) / 2;
  chk(T, "substitution u = r^2, way two: both quadratures agree", approx(rr, uu, 1e-8), fmt(rr, 10) + " vs " + fmt(uu, 10));
  // --- Exhibit A: the junk room (collapse along z, keep x and y) ---
  function meet2l(p, q, r, s) {
    var d1 = [q[0]-p[0], q[1]-p[1]], d2 = [s[0]-r[0], s[1]-r[1]];
    var den = d1[0]*(-d2[1]) - d1[1]*(-d2[0]);
    if (Math.abs(den) < 1e-15) return null;
    var t = ((r[0]-p[0])*(-d2[1]) - (r[1]-p[1])*(-d2[0])) / den;
    return [p[0] + t*d1[0], p[1] + t*d1[1]];
  }
  function on2(P, a, b) { return Math.abs((b[0]-a[0])*(P[1]-a[1]) - (b[1]-a[1])*(P[0]-a[0])) < 1e-9; }
  var A1c = [0.5, 0], B1c = [0, 0.6], C1c = [4/3, 2];
  var A2c = [4/3, 0], B2c = [0, 1.2], C2c = [-2, -3];
  var O0 = [0, 0];
  chk(T, "collapse: the triangles stay in perspective from O (an accident)",
    on2(O0, A1c, A2c) && on2(O0, B1c, B2c) && on2(O0, C1c, C2c));
  var jP = meet2l(A1c, B1c, A2c, B2c);
  var jQ = meet2l(B1c, C1c, B2c, C2c);
  var jR = meet2l(C1c, A1c, C2c, A2c);
  chk(T, "junk meets land at (-2,3), (-4/7,0), (0,-6/5)",
    jP !== null && jQ !== null && jR !== null &&
    approx(jP[0], -2) && approx(jP[1], 3) &&
    approx(jQ[0], -4/7) && approx(jQ[1], 0) &&
    approx(jR[0], 0) && approx(jR[1], -1.2),
    "(" + fmt(jP[0],4) + "," + fmt(jP[1],4) + ") (" + fmt(jQ[0],4) + "," + fmt(jQ[1],4) + ") (" + fmt(jR[0],4) + "," + fmt(jR[1],4) + ")");
  chk(T, "each junk meet verified on both of its lines",
    jP !== null && on2(jP, A1c, B1c) && on2(jP, A2c, B2c) &&
    on2(jQ, B1c, C1c) && on2(jQ, B2c, C2c) &&
    on2(jR, C1c, A1c) && on2(jR, C2c, A2c));
  chk(T, "one of the three happens to coincide with P=(-2,3)",
    approx(jP[0], -2) && approx(jP[1], 3));
  var lineA = function(x, y) { return 21*x + 10*y + 12; };
  chk(T, "the junk meets are collinear on 21x + 10y + 12 = 0",
    approx(lineA(jP[0], jP[1]), 0, 1e-9) && approx(lineA(jQ[0], jQ[1]), 0, 1e-9) && approx(lineA(jR[0], jR[1]), 0, 1e-9));
  var axis = function(x, y) { return -3*x - 3 - y; };
  chk(T, "and NOT on the axis y = -3x - 3 the question asked about",
    Math.abs(axis(jQ[0], jQ[1])) > 0.1 && Math.abs(axis(jR[0], jR[1])) > 0.1);
  // --- Exhibit C: the room that solves other people's problems ---
  var J = simpson(function(x) { return Math.exp(-x*x*x*x); }, 0, 3, 4000);
  var G54 = 0.9064024771;
  chk(T, "J = int e^{-x^4} = Gamma(5/4) = 0.9064024771", approx(J, G54, 1e-9), fmt(J, 10));
  var Jsm = simpson(function(t) { return 2*t*Math.exp(-Math.pow(t, 8)); }, 0, 2, 4000);
  chk(T, "smooth chain: J = int 2t e^{-t^8} dt, same value", approx(Jsm, G54, 1e-9), fmt(Jsm, 10));
  var J2 = J * J;
  chk(T, "the true J^2 is about 0.8216", approx(J2, 0.8216, 1e-4), fmt(J2, 6));
  var toll = 2 * Math.PI * simpson(function(r) { return Math.exp(-Math.pow(r, 4)) * r; }, 0, 3, 4000);
  chk(T, "the pretend radial toll: pi^{3/2}/2 is about 2.7841", approx(toll, 2.7841, 1e-4) && approx(toll, Math.pow(Math.PI, 1.5)/2, 1e-9), fmt(toll, 6));
  chk(T, "the gap of nearly two: toll minus J^2 is about 1.96", approx(toll - J2, 1.96, 0.01), fmt(toll - J2, 4));
  var c04 = Math.pow(Math.cos(0), 4) + Math.pow(Math.sin(0), 4);
  var c45 = Math.pow(Math.cos(Math.PI/4), 4) + Math.pow(Math.sin(Math.PI/4), 4);
  chk(T, "cos^4 + sin^4 is 1 at 0 degrees, 1/2 at 45 degrees", approx(c04, 1) && approx(c45, 0.5));
  var inRange = true;
  for (var k = 0; k <= 720; k++) {
    var th = k * Math.PI / 720;
    var v = Math.pow(Math.cos(th), 4) + Math.pow(Math.sin(th), 4);
    if (v < 0.5 - 1e-12 || v > 1 + 1e-12) inRange = false;
  }
  chk(T, "cos^4 + sin^4 ranges inside [1/2, 1] (not a constant)", inRange && c04 !== c45);
  chk(T, "page names the junk map and the lesson",
    page.indexOf("a projection is honest only relative to a question") !== -1 &&
    page.indexOf("the room that solves other people's problems") !== -1);
}
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
// ============ p4y: §5 Exhibit B — the plane, and Desargues failing ============
function p4y(page) {
  var T = "p4y";
  function E(a, b) { return 3*a + b; }
  function ea(u) { return Math.floor(u / 3); }
  function eb(u) { return u % 3; }
  function fadd(u, v) { return E((ea(u)+ea(v)) % 3, (eb(u)+eb(v)) % 3); }
  function fsub(u, v) { return E(((ea(u)-ea(v))%3+3) % 3, ((eb(u)-eb(v))%3+3) % 3); }
  function fmul(u, v) {
    return E((((ea(u)*ea(v) - eb(u)*eb(v)) % 9) + 9) % 3,
             (((ea(u)*eb(v) + eb(u)*ea(v)) % 9) + 9) % 3);
  }
  var H = {}; H[E(1,0)] = 1; H[E(2,0)] = 1; H[E(0,1)] = 1; H[E(0,2)] = 1; H[0] = 1;
  function circ(a, b) {
    if (H[a] === 1) return fmul(a, b);
    return fmul(a, fmul(fmul(b, b), b));
  }
  function cinv(u) { for (var w = 0; w < 9; w++) if (circ(u, w) === E(1,0)) return w; return -1; }
  var lines = []; // each line: { vertical: cx or -1, m, b, pts: [81 bools], n: count }
  for (var m = 0; m < 9; m++) for (var b = 0; b < 9; b++) {
    var L = { vertical: -1, m: m, b: b, pts: [], n: 0 };
    for (var x = 0; x < 9; x++) { var y = fadd(circ(m, x), b); L.pts[9*x + y] = 1; L.n++; }
    lines.push(L);
  }
  for (var cx = 0; cx < 9; cx++) {
    var V = { vertical: cx, m: -1, b: -1, pts: [], n: 0 };
    for (var y = 0; y < 9; y++) { V.pts[9*cx + y] = 1; V.n++; }
    lines.push(V);
  }
  chk(T, "81 points and 90 lines (81 nearfield lines plus 9 verticals)",
    9*9 === 81 && lines.length === 90);
  var nineEach = true;
  for (var i = 0; i < 90; i++) if (lines[i].n !== 9) nineEach = false;
  chk(T, "nine points on every line", nineEach);
  // unique line through every pair of points
  var uniqueOK = true;
  for (var p1 = 0; p1 < 81; p1++) for (var p2 = p1+1; p2 < 81; p2++) {
    var cnt = 0;
    for (var l = 0; l < 90; l++) if (lines[l].pts[p1] && lines[l].pts[p2]) cnt++;
    if (cnt !== 1) uniqueOK = false;
  }
  chk(T, "exactly one line through every pair of points", uniqueOK);
  // at most one meet for every pair of lines
  var meetOK = true;
  for (var l1 = 0; l1 < 90; l1++) for (var l2 = l1+1; l2 < 90; l2++) {
    var c = 0;
    for (var q = 0; q < 81; q++) if (lines[l1].pts[q] && lines[l2].pts[q]) c++;
    if (c > 1) meetOK = false;
  }
  chk(T, "at most one meet for every pair of lines", meetOK);
  chk(T, "projective completion: 9^2 + 9 + 1 = 91", 9*9 + 9 + 1 === 91);
  // --- Desargues fails, on small coordinates ---
  var t = E(0,1), twoT = E(0,2), one = E(1,0), two = E(2,0), oneT = E(1,1);
  var A = [t, t], Ap = [twoT, twoT], B = [t, two], Bp = [one, t], C = [0, t], Cp = [0, oneT];
  function onPt(L, P) { return L.pts[9*P[0] + P[1]] === 1; }
  var O = [0, 0];
  var lAA = [], lBB = [], lCC = [];
  for (var l3 = 0; l3 < 90; l3++) {
    if (onPt(lines[l3], A) && onPt(lines[l3], Ap)) lAA.push(l3);
    if (onPt(lines[l3], B) && onPt(lines[l3], Bp)) lBB.push(l3);
    if (onPt(lines[l3], C) && onPt(lines[l3], Cp)) lCC.push(l3);
  }
  var persp = lAA.length === 1 && lBB.length === 1 && lCC.length === 1 &&
    onPt(lines[lAA[0]], O) && onPt(lines[lBB[0]], O) && onPt(lines[lCC[0]], O);
  chk(T, "the two triangles are in perspective from the origin (all three lines checked)", persp);
  function meetLines(L1, L2) {
    var ms = [];
    for (var q2 = 0; q2 < 81; q2++) if (L1.pts[q2] && L2.pts[q2]) ms.push(q2);
    return ms;
  }
  function sideLine(P1, P2) {
    for (var l4 = 0; l4 < 90; l4++) if (onPt(lines[l4], P1) && onPt(lines[l4], P2)) return lines[l4];
    return null;
  }
  var Pl = sideLine(A, B), Ql = sideLine(B, C), Rl = sideLine(C, A);
  var Plp = sideLine(Ap, Bp), Qlp = sideLine(Bp, Cp), Rlp = sideLine(Cp, Ap);
  var mP = meetLines(Pl, Plp), mQ = meetLines(Ql, Qlp), mR = meetLines(Rl, Rlp);
  var Pt = [t, fadd(two, t)], Qt = [twoT, fadd(one, twoT)], Rt = [oneT, t]; // (t,2+t),(2t,1+2t),(1+t,t)
  chk(T, "P = (t, 2+t): the unique meet of AB and A'B'",
    mP.length === 1 && mP[0] === 9*Pt[0] + Pt[1]);
  chk(T, "Q = (2t, 1+2t): the unique meet of BC and B'C'",
    mQ.length === 1 && mQ[0] === 9*Qt[0] + Qt[1]);
  chk(T, "R = (1+t, t): the unique meet of CA and C'A'",
    mR.length === 1 && mR[0] === 9*Rt[0] + Rt[1]);
  var collinear = false;
  for (var l5 = 0; l5 < 90; l5++) {
    if (onPt(lines[l5], Pt) && onPt(lines[l5], Qt) && onPt(lines[l5], Rt)) collinear = true;
  }
  chk(T, "and they are NOT collinear (no line holds all three)", !collinear);
  chk(T, "page pins the failure: And they are not collinear",
    page.indexOf("And they are not collinear") !== -1);
  chk(T, "page pins the meets P = (t,\\; 2+t) etc.",
    page.indexOf("P = (t,\\; 2+t)") !== -1 && page.indexOf("Q = (2t,\\; 1+2t)") !== -1 && page.indexOf("R = (1+t,\\; t)") !== -1);
  chk(T, "page names it the first finite non-Desarguesian plane",
    page.indexOf("the first finite non-Desarguesian plane") !== -1);
  chk(T, "page pins the embeddability boundary (Veblen-Young)",
    page.indexOf("embeds in three-space exactly when Desargues holds in it") !== -1);
}
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
// ============ tail: main — run the battery, tally, verdict ============
async function main() {
  if (typeof __P18_STANDALONE__ === "undefined" || !__P18_STANDALONE__)
    return "P18 lab loaded as a library; set __P18_STANDALONE__ to run the battery.";
  var page = await loadPage("/home/user/knowledge/graph-driven-math-book/wip/p18-raise-dimension.html");
  var out = [];
  out.push("P18 LAB — page loaded, " + page.length + " chars, tail check: " + (page.slice(-27) === "\n</footer>\n</body>\n</html>\n"));
  p0(page); p1(page); p2(page); p3(page); p3d(page); p3f(page); p3x(page);
  p4(page); p4x(page); p4y(page); p5(page); p5x(page);
  var byTag = {}, order = [];
  for (var i = 0; i < __P18_STATE__.checks.length; i++) {
    var c = __P18_STATE__.checks[i];
    if (byTag[c.tag] === undefined) { byTag[c.tag] = { p: 0, f: 0 }; order.push(c.tag); }
    if (c.ok) byTag[c.tag].p++; else byTag[c.tag].f++;
    out.push(c.line);
  }
  var tally = [];
  for (var j = 0; j < order.length; j++)
    tally.push(order[j] + ":" + (byTag[order[j]].p + byTag[order[j]].f) +
      (byTag[order[j]].f > 0 ? "(" + byTag[order[j]].f + " FAIL)" : ""));
  out.push("P18 LAB TALLY  " + tally.join(" "));
  out.push("P18 LAB FINAL: " + __P18_STATE__.pass + "/" + (__P18_STATE__.pass + __P18_STATE__.fail) + ", " + __P18_STATE__.fail + " FAIL");
  return out.join("\n");
}
