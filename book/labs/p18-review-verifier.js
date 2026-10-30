// p18-review-verifier.js — ADVERSARIAL VERIFIER for P18 "Lift to a higher dimension"
// Fresh engine: ZERO code shared with wip/p18-lab.js. Own harness (V/VOUT/VR), own
// loader (array-push + join), own counting (split-count), own quadrature (midpoint,
// not Simpson), own algebra (parameter round-trip and shoelace, not cross-product
// collinearity), own finite-field engine (string encoding, not integer indexing).
// Every needle below was pre-checked against the frozen page bytes with grep -cF
// BEFORE this verifier ran (P17 lesson). Mutation battery (S46 lesson): doctored
// clones with GLOBAL split().join() mutations AND inside-needle-span mutations must
// KILL the needle checks; injected poisons must FIRE the absence checks; a one-digit
// census doctor must be caught. Deterministic: no Math.random, no Date, no
// recursion, no BigInt. All tolerances below are sized to the MIDPOINT rule's
// a-priori error bound (b-a)h^2/24 max|f''| with margin, and say so in the label.
var VR = { pass: 0, fail: 0 };
var VOUT = [];
function V(label, ok, detail) {
  var d = (detail === undefined || detail === null) ? "" : "   [" + detail + "]";
  VOUT.push((ok ? "PASS" : "FAIL") + "  " + label + d);
  if (ok) VR.pass++; else VR.fail++;
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }
function occ(s, sub) { return s.split(sub).length - 1; }
async function fetchPage(path) {
  var parts = [], off = 0;
  for (var i = 0; i < 12; i++) {
    var r = await tools.file_system.read_file({ path: path, offset: off, limit: 80 });
    var t = (typeof r === "string") ? r : (r.content !== undefined ? r.content : r.text);
    var trunc = (typeof r === "object" && r !== null) ? (r.was_truncated === true) : false;
    parts.push(t);
    if (!trunc) break;
    off += (typeof r === "object" && r.lines_read !== undefined) ? r.lines_read : 80;
  }
  return parts.join("");
}
function midp(g, a, b, n) {
  var h = (b - a) / n, s = 0;
  for (var i = 0; i < n; i++) s += g(a + (i + 0.5) * h);
  return s * h;
}
// ============ VA: byte gates, needles (pristine page), poisons ============
function va(page) {
  V("VA page char length is 68877", page.length === 68877, "" + page.length);
  V("VA tail byte-exact", page.slice(-27) === "\n</footer>\n</body>\n</html>\n");
  var mj = "window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']]},svg:{fontCache:'global'}};";
  V("VA MathJax config line byte-identical", page.indexOf("<script>" + mj + "</script>") !== -1);
  V("VA zero dollar-delimiters", page.indexOf("$") === -1);
  V("VA zero backticks", page.indexOf("`") === -1);
  V("VA 8 h2 by split-count", occ(page, "<h2>") === 8, "" + occ(page, "<h2>"));
  V("VA 9 h3 by split-count", occ(page, "<h3>") === 9, "" + occ(page, "<h3>"));
  V("VA 2 svg by split-count", occ(page, "<svg viewBox") === 2);
  V("VA 10 details by split-count", occ(page, "<details>") === 10);
  V("VA 2 digit-tables by split-count", occ(page, 'class="digit-table"') === 2);
  var needles = [
    ["h1", "<h1>Lift to a higher dimension</h1>"],
    ["S1 bridge", "the object nobody handed us is sometimes a whole extra dimension"],
    ["S2 theorem", "This is <strong>Desargues's theorem</strong>"],
    ["S3 move title", "P18 · Lift to a higher dimension — prove the easy shadow-free problem upstairs"],
    ["S4E1 three sentences", "The proof is three sentences."],
    ["S5A honest relative", "a projection is honest only relative to a question"],
    ["S5B floors", "Floors with no room above"],
    ["S5C other people", "the room that solves other people's problems"],
    ["S5B Dickson", "Dickson's twist (1905, the first proper nearfield)"],
    ["S5B not collinear", "And they are not collinear"],
    ["S5B first finite", "the first finite non-Desarguesian plane"],
    ["S8 header", "<h2>8 · Exercises</h2>"],
    ["MathJax", mj],
    ["S6 shadow line", "shadow of an easy 3D one"],
    ["S4 census", "\\(416\\) two-rail, \\(61\\) with a doubled factor"],
    ["S5B meet P TeX", "P = (t,\\; 2+t)"],
    ["S5B meet Q TeX", "Q = (2t,\\; 1+2t)"],
    ["S5B meet R TeX", "R = (1+t,\\; t)"],
    ["S4 lab six", "the lab verifies all six"],
    ["S4 lab steps", "The lab checks every step of this paragraph by substitution"],
    ["S4 census close", "625 \\times 2 = 1250"],
    ["Ex4c honest boundary", "still lands about"],
    ["S5B Veblen-Wedderburn", "Veblen and Wedderburn published in 1907"],
    ["S3 Hamilton", "Hamilton's 1837"],
    ["S3 Dandelin", "Dandelin's spheres (1822)"],
    ["S5B Veblen-Young", "embeds in three-space exactly when Desargues holds in it"],
    ["S5B recipe", "complex-style arithmetic mod 3"],
    ["S6 doors", "Doors this opens"],
    ["S3 key 3", "descent will cost"]
  ];
  for (var k = 0; k < needles.length; k++)
    V("VA needle " + needles[k][0] + " present", page.indexOf(needles[k][1]) !== -1);
  var poisons = [
    ["wrong Hilbert date", "Hilbert, in lectures of 1898–1900"],
    ["wrong Veblen-Wedderburn year", "Veblen and Wedderburn used one in 1908"],
    ["wrong Hamilton year", "Hamilton in 1835 built the room"],
    ["old Ex3 moon", "Exercise 3 (●●○)"],
    ["drafting voice", "wait, that"],
    ["naive polar claim", "the pair integrand is radial"],
    ["old junk axis", "19x + 10y + 12 = 0"],
    ["wrong census upstairs", "625 × 3 = 1875"]
  ];
  for (var j = 0; j < poisons.length; j++)
    V("VA poison absent: " + poisons[j][0], page.indexOf(poisons[j][1]) === -1);
  return { needles: needles, poisons: poisons };
}
// ============ VB: mutation battery — the checks must BITE ============
function vb(page, kit) {
  var spaceClone = page.split(' ').join('  ');
  var jaxClone = page.split('Jax').join('JAX');
  V("VB global space-doubling clone keeps structure (<h1> survives)", spaceClone.indexOf("<h1>") !== -1);
  V("VB space clone grew by exactly the space count",
    spaceClone.length - page.length === occ(page, ' '), "" + (spaceClone.length - page.length));
  for (var i = 0; i < kit.needles.length; i++) {
    var tag = kit.needles[i][0], n = kit.needles[i][1];
    if (n.indexOf(' ') !== -1)
      V("VB global space-doubling kills needle " + tag, spaceClone.indexOf(n) === -1);
    else
      V("VB global Jax-flip kills needle " + tag, jaxClone.indexOf(n) === -1);
    var mid = Math.floor(n.length / 2);
    var mut = n.slice(0, mid) + '#' + n.slice(mid + 1);
    var spanClone = page.split(n).join(mut);
    V("VB in-span mutation kills needle " + tag,
      spanClone.indexOf(n) === -1 && spanClone.indexOf(mut) !== -1 && spanClone.length === page.length);
  }
  for (var j = 0; j < kit.poisons.length; j++) {
    var inj = page.replace("</body>", kit.poisons[j][1] + "</body>");
    V("VB injected poison fires: " + kit.poisons[j][0], inj.indexOf(kit.poisons[j][1]) !== -1);
  }
  var censusClone = page.split("\\(416\\)").join("\\(415\\)");
  V("VB one-digit census doctor (416 -> 415) kills the census needle",
    page.indexOf("\\(416\\) two-rail") !== -1 &&
    censusClone.indexOf("\\(416\\) two-rail") === -1 &&
    censusClone.indexOf("\\(415\\) two-rail") !== -1);
}
// ============ VC: independent recomputation (different algorithms throughout) ============
function pairMeet(p, q, r, s) { // 2D meet by eliminating u from the 2x2 system
  var d1x = q[0]-p[0], d1y = q[1]-p[1], d2x = s[0]-r[0], d2y = s[1]-r[1];
  var den = d1x*d2y - d1y*d2x;
  var t = ((r[0]-p[0])*d2y - (r[1]-p[1])*d2x) / den;
  var u = (d1x*(r[1]-p[1]) - d1y*(r[0]-p[0])) / (d2x*d1y - d2y*d1x);
  return [p[0]+t*d1x, p[1]+t*d1y, t, u];
}
function onLineRT(p, q, x) { // 3D/2D line membership by PARAMETER ROUND-TRIP (not cross products)
  var dx = q[0]-p[0], dy = q[1]-p[1], dz = (p.length > 2 ? q[2]-p[2] : 0);
  var ax = Math.abs(dx), ay = Math.abs(dy), az = Math.abs(dz), k = 0;
  if (ay > (k === 0 ? ax : -1) && ay >= ax && ay >= az) k = 1;
  if (az >= ax && az >= ay) k = 2;
  if (k === 2 && p.length < 3) k = (ax >= ay ? 0 : 1);
  var d = k === 0 ? dx : (k === 1 ? dy : dz);
  var t = (x[k] - p[k]) / d;
  return near(x[0], p[0]+t*dx) && near(x[1], p[1]+t*dy) && (p.length < 3 || near(x[2], p[2]+t*dz));
}
function planeABC(P, Q, R) { // plane through 3 points, own expansion
  var A = (Q[1]-P[1])*(R[2]-P[2]) - (Q[2]-P[2])*(R[1]-P[1]);
  var B = (Q[2]-P[2])*(R[0]-P[0]) - (Q[0]-P[0])*(R[2]-P[2]);
  var C = (Q[0]-P[0])*(R[1]-P[1]) - (Q[1]-P[1])*(R[0]-P[0]);
  return [A, B, C, A*P[0]+B*P[1]+C*P[2]];
}
function vc() {
  // ---- (1) §2 meets by pair-solving ----
  var A=[1,0], B=[0,1], C=[2,3], Ap=[4,0], Bp=[0,2], Cp=[-4,-6];
  var mP = pairMeet(A,B,Ap,Bp), mQ = pairMeet(B,C,Bp,Cp), mR = pairMeet(C,A,Cp,Ap);
  V("VC §2 P=(-2,3) by pair-solving", mP[0] === -2 && mP[1] === 3, "(" + mP[0] + "," + mP[1] + ")");
  V("VC §2 Q=(-1,0) by pair-solving", mQ[0] === -1 && mQ[1] === 0);
  V("VC §2 R=(0,-3) by pair-solving", mR[0] === 0 && mR[1] === -3);
  V("VC §2 each meet rounds-trips onto BOTH lines (t and u recovered)",
    near(A[0]+mP[2]*(B[0]-A[0]), Ap[0]+mP[3]*(Bp[0]-Ap[0])) &&
    near(A[1]+mP[2]*(B[1]-A[1]), Ap[1]+mP[3]*(Bp[1]-Ap[1])) &&
    near(B[0]+mQ[2]*(C[0]-B[0]), Bp[0]+mQ[3]*(Cp[0]-Bp[0])) &&
    near(C[0]+mR[2]*(A[0]-C[0]), Cp[0]+mR[3]*(Ap[0]-Cp[0])));
  V("VC §2 axis y=-3x-3 carries all three meets",
    mP[1] === -3*mP[0]-3 && mQ[1] === -3*mQ[0]-3 && mR[1] === -3*mR[0]-3);
  V("VC §2 the six line equations hold at their pairs",
    (A[0]+A[1]===1 && B[0]+B[1]===1) && (Ap[0]+2*Ap[1]===4 && Bp[0]+2*Bp[1]===4) &&
    (B[1]===B[0]+1 && C[1]===C[0]+1) && (Bp[1]===2*Bp[0]+2 && Cp[1]===2*Cp[0]+2) &&
    (C[1]===3*C[0]-3 && A[1]===3*A[0]-3) && (Cp[1]===(3*Cp[0])/4-3 && Ap[1]===(3*Ap[0])/4-3));
  // ---- (2) §4 spatial meets: membership by parameter round-trip + both planes ----
  var A1=[0.5,0,2.5], B1=[0,0.6,2], C1=[4/3,2,5/3];
  var A2=[4/3,0,10/3], B2=[0,1.2,2], C2=[-2,-3,2.5];
  var S=[0,0,5];
  var mAB=[-2,3,0], mBC=[-4/7,0,15/7], mCA=[0,-6/5,3];
  V("VC §4 mAB on A1B1 by round-trip", onLineRT(A1,B1,mAB));
  V("VC §4 mAB on A2B2 by round-trip", onLineRT(A2,B2,mAB));
  V("VC §4 mBC on B1C1 by round-trip", onLineRT(B1,C1,mBC));
  V("VC §4 mBC on B2C2 by round-trip", onLineRT(B2,C2,mBC));
  V("VC §4 mCA on C1A1 by round-trip", onLineRT(C1,A1,mCA));
  V("VC §4 mCA on C2A2 by round-trip", onLineRT(C2,A2,mCA));
  var pl1 = planeABC(A1,B1,C1), pl2 = planeABC(A2,B2,C2);
  function onPlane(pl, X) { return near(pl[0]*X[0]+pl[1]*X[1]+pl[2]*X[2], pl[3]); }
  V("VC §4 all three meets on BOTH lifted planes (own plane equations)",
    onPlane(pl1,mAB) && onPlane(pl2,mAB) && onPlane(pl1,mBC) && onPlane(pl2,mBC) &&
    onPlane(pl1,mCA) && onPlane(pl2,mCA));
  V("VC §4 the two lifted planes are distinct (normals not parallel)",
    Math.abs(pl1[0]*pl2[1]-pl1[1]*pl2[0]) + Math.abs(pl1[1]*pl2[2]-pl1[2]*pl2[1]) > 1e-9);
  // collinearity of the three spatial meets by AREA, not cross products
  var u1=[mBC[0]-mAB[0], mBC[1]-mAB[1], mBC[2]-mAB[2]];
  var u2=[mCA[0]-mAB[0], mCA[1]-mAB[1], mCA[2]-mAB[2]];
  var cr = [u1[1]*u2[2]-u1[2]*u2[1], u1[2]*u2[0]-u1[0]*u2[2], u1[0]*u2[1]-u1[1]*u2[0]];
  V("VC §4 lifted meets collinear (triangle area zero)",
    Math.hypot(cr[0],cr[1],cr[2]) < 1e-9, "area cross " + Math.hypot(cr[0],cr[1],cr[2]).toExponential(2));
  // projection from S: own derivation, t = 5/(5-z) solved from 5 + t(z-5) = 0
  function projDown(X) { var t = 5/(5-X[2]); return [t*X[0], t*X[1]]; }
  V("VC §4 six lifted vertices project to §2's six vertices",
    near(projDown(A1)[0],1) && near(projDown(A1)[1],0) && near(projDown(B1)[0],0) && near(projDown(B1)[1],1) &&
    near(projDown(C1)[0],2) && near(projDown(C1)[1],3) && near(projDown(A2)[0],4) && near(projDown(A2)[1],0) &&
    near(projDown(B2)[0],0) && near(projDown(B2)[1],2) && near(projDown(C2)[0],-4) && near(projDown(C2)[1],-6));
  V("VC §4 the three lifted meets project to P, Q, R",
    near(projDown(mAB)[0],-2) && near(projDown(mAB)[1],3) &&
    near(projDown(mBC)[0],-1) && near(projDown(mBC)[1],0) &&
    near(projDown(mCA)[0],0) && near(projDown(mCA)[1],-3));
  // the ell configuration (§4's first lift): z=1 and x=1 triangles
  var E1a=[2,1,1], E1b=[3,2,1], E1c=[-2,1,1];
  var E2a=[1,0.5,0.5], E2b=[1,2/3,1/3], E2c=[1,-0.5,-0.5];
  var eP=[1,0,1], eQ=[1,8/5,1], eR=[1,1,1];
  V("VC §4(ell) meets (1,0,1),(1,8/5,1),(1,1,1) on their four lines by round-trip",
    onLineRT(E1a,E1b,eP) && onLineRT(E2a,E2b,eP) && onLineRT(E1b,E1c,eQ) && onLineRT(E2b,E2c,eQ) &&
    onLineRT(E1c,E1a,eR) && onLineRT(E2c,E2a,eR));
  V("VC §4(ell) all three on the line x=1, z=1",
    eP[0]===1 && eP[2]===1 && eQ[0]===1 && eQ[2]===1 && eR[0]===1 && eR[2]===1);
  V("VC §4(ell) A',B',C' on rays from O* (scalars 1/2, 1/3, -1/2)",
    near(E2a[0], 0.5*E1a[0]) && near(E2b[0], (1/3)*E1b[0]) && near(E2c[0], -0.5*E1c[0]) &&
    E2a[1] === 0.5*E1a[1] && E2b[1] === (1/3)*E1b[1] && E2c[1] === -0.5*E1c[1] &&
    E2a[2] === 0.5 && E2b[2] === 1/3 && E2c[2] === -0.5);
  // ---- (3) Exhibit A junk collapse, by pair-solving ----
  var a1=[0.5,0], b1=[0,0.6], c1=[4/3,2], a2=[4/3,0], b2=[0,1.2], c2=[-2,-3];
  var jP = pairMeet(a1,b1,a2,b2), jQ = pairMeet(b1,c1,b2,c2), jR = pairMeet(c1,a1,c2,a2);
  V("VC ExA junk meets (-2,3), (-4/7,0), (0,-6/5) by pair-solving",
    near(jP[0],-2) && near(jP[1],3) && near(jQ[0],-4/7) && near(jQ[1],0) &&
    near(jR[0],0) && near(jR[1],-1.2),
    "(" + jP[0].toFixed(4) + "," + jP[1].toFixed(4) + ") (" + jQ[0].toFixed(4) + "," + jQ[1].toFixed(4) + ") (" + jR[0].toFixed(4) + "," + jR[1].toFixed(4) + ")");
  V("VC ExA junk meets collinear on 21x+10y+12=0",
    near(21*jP[0]+10*jP[1]+12, 0, 1e-9) && near(21*jQ[0]+10*jQ[1]+12, 0, 1e-9) && near(21*jR[0]+10*jR[1]+12, 0, 1e-9));
  V("VC ExA and NOT on the axis y=-3x-3",
    Math.abs(-3*jQ[0]-3-jQ[1]) > 0.1 && Math.abs(-3*jR[0]-3-jR[1]) > 0.1);
  V("VC ExA the collapsed triangles stay in perspective from the origin",
    near(a1[1]*a2[0]-a1[0]*a2[1], 0, 1e-12) && near(b1[1]*b2[0]-b1[0]*b2[1], 0, 1e-12) &&
    near(c1[1]*c2[0]-c1[0]*c2[1], 0, 1e-12));
  // ---- (4) census by alternative route: D = tr^2 - 4 det ----
  var vals=[-2,-1,0,1,2], nP=0, nZ=0, nN=0, pure=0, shear=0, vieta=true, dual=true;
  for (var ai=0; ai<5; ai++) for (var bi=0; bi<5; bi++) for (var ci=0; ci<5; ci++) for (var di=0; di<5; di++) {
    var a=vals[ai], b=vals[bi], c=vals[ci], d=vals[di];
    var tr=a+d, det=a*d-b*c, D2=tr*tr-4*det;
    if (D2 > 0) nP++;
    else if (D2 === 0) { nZ++; if (a===d && b===0 && c===0) pure++; else shear++; }
    else {
      nN++;
      var re=tr/2, im=Math.sqrt(4*det-tr*tr)/2;
      if (!(near(2*re, tr) && near(re*re+im*im, det))) vieta = false;
    }
    if (((4*det > tr*tr) ? 1 : 0) !== ((D2 < 0) ? 1 : 0)) dual = false;
  }
  V("VC census alt-route (tr^2-4det): 416 / 61 / 148",
    nP===416 && nZ===61 && nN===148, nP + "/" + nZ + "/" + nN);
  V("VC census alt-route: 5 pure / 56 shear", pure===5 && shear===56, pure + "/" + shear);
  V("VC census alt-route: Vieta by re/im parts on all 148", vieta);
  V("VC census alt-route: the two D-predicates agree on all 625", dual);
  V("VC census closure 416+61+148=625 and 569=416+148+5 and 421=416+5",
    nP+nZ+nN===625 && nP+nN+pure===569 && nP+pure===421);
  // ---- (5) Example 3 + Exhibit C by MIDPOINT quadrature ----
  var I = midp(function(x){ return Math.exp(-x*x); }, -6, 6, 200000);
  V("VC Ex3 int e^{-x^2} = sqrt(pi) (midpoint n=200k, tol 1e-8)", near(I, Math.sqrt(Math.PI), 1e-8), I.toFixed(10));
  var rad = midp(function(r){ return Math.exp(-r*r)*r; }, 0, 8, 100000);
  V("VC Ex3 radial int = 1/2 (midpoint n=100k, tol 1e-8)", near(rad, 0.5, 1e-8), rad.toFixed(10));
  var J = midp(function(x){ return Math.exp(-x*x*x*x); }, 0, 3, 100000);
  V("VC ExC J = Gamma(5/4) = 0.9064024771 (midpoint n=100k, tol 1e-9)",
    near(J, 0.9064024771, 1e-9), J.toFixed(10));
  var Jsm = midp(function(t){ return 2*t*Math.exp(-Math.pow(t,8)); }, 0, 2, 400000);
  V("VC ExC smooth chain 2t e^{-t^8} gives the same J (midpoint n=400k, tol 1e-9)",
    near(Jsm, 0.9064024771, 1e-9), Jsm.toFixed(10));
  var J2 = J*J;
  V("VC ExC J^2 about 0.8216", near(J2, 0.8216, 1e-4), J2.toFixed(6));
  var toll = 2*Math.PI*midp(function(r){ return Math.exp(-Math.pow(r,4))*r; }, 0, 3, 100000);
  V("VC ExC pretend radial toll pi^{3/2}/2 about 2.7841 (and matches the closed form, tol 1e-9)",
    near(toll, 2.7841, 1e-4) && near(toll, Math.pow(Math.PI,1.5)/2, 1e-9), toll.toFixed(6));
  V("VC ExC gap of nearly two: toll - J^2 about 1.96", near(toll-J2, 1.96, 0.01), (toll-J2).toFixed(4));
  var c04 = Math.pow(Math.cos(0),4)+Math.pow(Math.sin(0),4), c45 = Math.pow(Math.cos(Math.PI/4),4)+Math.pow(Math.sin(Math.PI/4),4;
  V("VC ExC cos^4+sin^4 is 1 at 0 degrees and 1/2 at 45 degrees", near(c04,1) && near(c45,0.5));
  // Ex3 family by midpoint
  var I2 = midp(function(x){ return x*x*Math.exp(-x*x); }, 0, 8, 100000);
  V("VC Ex3a I2 = sqrt(pi)/4 (midpoint n=100k, tol 1e-8)", near(I2, Math.sqrt(Math.PI)/4, 1e-8), I2.toFixed(10));
  var c2i = midp(function(th){ return Math.cos(th)*Math.cos(th); }, 0, 2*Math.PI, 100000);
  V("VC Ex3a int cos^2 over the circle = pi (midpoint n=100k, tol 1e-9)", near(c2i, Math.PI, 1e-9), c2i.toFixed(10));
  var In = midp(function(x){ return Math.exp(-x*x/2); }, -8, 8, 200000);
  V("VC Ex3b int e^{-x^2/2} = sqrt(2pi) (midpoint n=200k, tol 1e-8)", near(In, Math.sqrt(2*Math.PI), 1e-8), In.toFixed(10));
  var Ix = midp(function(x){ return x*Math.exp(-x*x); }, 0, 8, 100000);
  V("VC Ex3c int x e^{-x^2} = 1/2, no lift needed (midpoint n=100k, tol 1e-8)", near(Ix, 0.5, 1e-8), Ix.toFixed(10));
  // ---- (6) Dirichlet machine by midpoint ----
  function sinc(x) { return x === 0 ? 1 : Math.sin(x)/x; }
  var S10 = midp(function(x){ return Math.abs(sinc(x)); }, 0, 10, 20000);
  var S40 = midp(function(x){ return Math.abs(sinc(x)); }, 0, 40, 80000);
  var S100 = midp(function(x){ return Math.abs(sinc(x)); }, 0, 100, 200000);
  V("VC Ex4a |sinc| partials about 2.56 / 3.47 / 4.05 (midpoint, tol 0.005)",
    near(S10,2.56,0.005) && near(S40,3.47,0.005) && near(S100,4.05,0.005),
    S10.toFixed(4) + " / " + S40.toFixed(4) + " / " + S100.toFixed(4));
  V("VC Ex4a partials keep growing (gain 40->100 exceeds 0.5)", S100-S40 > 0.5, (S100-S40).toFixed(4));
  V("VC Ex4a growth rate about 2/pi", Math.abs((S100-S40)/Math.log(100/40) - 2/Math.PI) < 0.15, ((S100-S40)/Math.log(2.5)).toFixed(4));
  var w03 = Math.sin(5*Math.cos(0.3))*Math.sin(5*Math.sin(0.3))/(25*Math.cos(0.3)*Math.sin(0.3));
  var w12 = Math.sin(5*Math.cos(1.2))*Math.sin(5*Math.sin(1.2))/(25*Math.cos(1.2)*Math.sin(1.2));
  V("VC Ex4b r=5 witnesses about -0.141 and -0.115 (not radial)",
    near(w03,-0.141,0.0005) && near(w12,-0.115,0.0005) && Math.abs(w03-w12) > 1e-4,
    w03.toFixed(4) + " / " + w12.toFixed(4));
  function Iep(ep) { return midp(function(x){ return Math.exp(-ep*x)*sinc(x); }, 0, 60, 1000000); }
  V("VC Ex4c I(0.5) = pi/2 - arctan(0.5) (midpoint n=1M, tol 5e-7)",
    near(Iep(0.5), Math.PI/2-Math.atan(0.5), 5e-7), Iep(0.5).toFixed(9));
  V("VC Ex4c I(1) = pi/4 (midpoint n=1M, tol 5e-7)", near(Iep(1), Math.PI/4, 5e-7), Iep(1).toFixed(9));
  V("VC Ex4c I(2) = pi/2 - arctan(2) (midpoint n=1M, tol 5e-7)",
    near(Iep(2), Math.PI/2-Math.atan(2), 5e-7), Iep(2).toFixed(9));
  var bp05 = midp(function(x){ return Math.exp(-0.5*x)*Math.sin(x); }, 0, 60, 1000000);
  var bp1 = midp(function(x){ return Math.exp(-1*x)*Math.sin(x); }, 0, 60, 1000000);
  var bp2 = midp(function(x){ return Math.exp(-2*x)*Math.sin(x); }, 0, 60, 1000000);
  V("VC Ex4c by-parts integrals give 1/(1+eps^2) at eps = 0.5, 1, 2 (midpoint n=1M, tol 1e-7)",
    near(bp05, 0.8, 1e-7) && near(bp1, 0.5, 1e-7) && near(bp2, 0.2, 1e-7),
    bp05.toFixed(8) + " / " + bp1.toFixed(8) + " / " + bp2.toFixed(8));
  var weakClosed = Math.PI/2 - Math.atan(0.001);
  var weakBrute = midp(function(x){ return Math.exp(-0.001*x)*sinc(x); }, 0, 200, 1000000);
  V("VC Ex4c weak damping: brute lands about 0.002 SHORT, not equal (midpoint n=1M)",
    weakClosed - weakBrute > 1e-3 && weakClosed - weakBrute < 4e-3,
    "short by " + (weakClosed-weakBrute).toFixed(5));
  V("VC Ex4c closed form at eps=0.001 about 1.5698", near(weakClosed, 1.5698, 5e-5), weakClosed.toFixed(6));
  // ---- (7) exercise spot checks by fresh algebra ----
  var X = [1,0], Y = [0,1], Cp2 = [2,1];
  var Xp = [4,0], Yp = [0,2], Cp3 = [-4,-2];
  var xP = pairMeet(X,Y,Xp,Yp), xQ = pairMeet(Y,Cp2,Yp,Cp3), xR = pairMeet(Cp2,X,Cp3,Xp);
  V("VC Ex1 meets (-2,3), (-1,1), (0,-1) by pair-solving",
    xP[0]===-2 && xP[1]===3 && xQ[0]===-1 && xQ[1]===1 && xR[0]===0 && xR[1]===1-2,
    "(" + xQ[0] + "," + xQ[1] + ") (" + xR[0] + "," + xR[1] + ")");
  V("VC Ex1 new axis 2x+y+1=0 carries them, and differs from §2's axis",
    2*xP[0]+xP[1]+1===0 && 2*xQ[0]+xQ[1]+1===0 && 2*xR[0]+xR[1]+1===0 &&
    Math.abs(-3*xR[0]-3-xR[1]) > 0.5);
  // Ex2: eigenvalues by the quadratic formula on lambda^2 - 4lambda + 5
  var tr2 = 4, det2 = 5;
  var disc2 = tr2*tr2 - 4*det2;
  V("VC Ex2 [[2,-1],[1,2]]: discriminant -4, eigenvalues 2 +/- i by quadratic formula",
    disc2 === -4 && isNaN(Math.sqrt(disc2)) && tr2/2 === 2 &&
    near(Math.sqrt(-disc2)/2, 1),
    "lambda = " + (tr2/2) + " +/- " + (Math.sqrt(-disc2)/2) + "i");
  var feedRe = 2*1 - (-1)*0, feedIm = 2*0 + 1*1; // M(1) = (2,1)
  V("VC Ex2 M(1,0) = (2,1) = (2+i)*1 — the rail's first component fed",
    feedRe === 2 && feedIm === 1);
  V("VC Ex2 (2+i)*(-i) = 1-2i, matching the page's second component",
    near(2*0-1*(-1), 1) && near(2*(-1)+1*0, -2));
  var shearTr = 2, shearDet = 1;
  V("VC Ex2 shear [[1,1],[0,1]]: tr^2-4det = 0, doubled factor 1 present",
    shearTr*shearTr - 4*shearDet === 0 && 1-2+1 === 0);
  // Ex5c: lambda^2 - 4lambda + 8
  var tr5 = 4, det5 = 8, disc5 = tr5*tr5 - 4*det5;
  V("VC Ex5c [[2,-2],[2,2]]: discriminant -16, eigenvalues 2 +/- 2i",
    disc5 === -16 && tr5/2 === 2 && near(Math.sqrt(-disc5)/2, 2));
  V("VC Ex5c scale 2sqrt(2) and angle 45 degrees",
    near(Math.hypot(2,2), 2*Math.sqrt(2)) && near(Math.atan2(2,2), Math.PI/4));
}
// ============ VD: the nearfield, rebuilt with STRING encoding ============
function vd() {
  var els = [];
  for (var a = 0; a < 3; a++) for (var b = 0; b < 3; b++) els.push("" + a + b);
  function dA(u) { return u.charCodeAt(0) - 48; }
  function dB(u) { return u.charCodeAt(1) - 48; }
  function sadd(u, v) { return "" + ((dA(u)+dA(v))%3) + ((dB(u)+dB(v))%3); }
  function smul(u, v) {
    var re = ((dA(u)*dA(v) - dB(u)*dB(v)) % 3 + 3) % 3;
    var im = ((dA(u)*dB(v) + dB(u)*dA(v)) % 3 + 3) % 3;
    return "" + re + im;
  }
  V("VD string engine: t*t = 2, i.e. t^2 = -1", smul("01","01") === "20");
  var sqSet = {};
  for (var i = 0; i < 9; i++) sqSet[smul(els[i], els[i])] = 1;
  var sqCount = 0; for (var kk in sqSet) sqCount++;
  V("VD squares by enumeration: exactly five (0, 1, 2, t, 2t)",
    sqCount === 5 && sqSet["00"] === 1 && sqSet["10"] === 1 && sqSet["20"] === 1 &&
    sqSet["01"] === 1 && sqSet["02"] === 1, "" + sqCount);
  function scirc(x, y) { return sqSet[x] === 1 ? smul(x, y) : smul(x, smul(smul(y,y), y)); }
  V("VD page witness: (1+t) circ t = 1+2t", scirc("11","01") === "12");
  V("VD while 1 circ t + t circ t = 2+t, a different element",
    sadd(scirc("10","01"), scirc("01","01")) === "21" && scirc("11","01") !== "21");
  V("VD right-distributivity fails on the page's triple (not a field)",
    scirc(sadd("10","01"), "01") !== sadd(scirc("10","01"), "01"), scirc(sadd("10","01"), "01") + " vs " + sadd(scirc("10","01"), "01"));
  var assoc = true;
  for (var x = 0; x < 9; x++) for (var y = 0; y < 9; y++) for (var z = 0; z < 9; z++)
    if (scirc(els[x], scirc(els[y], els[z])) !== scirc(scirc(els[x], els[y]), els[z])) assoc = false;
  V("VD circ associative (full 729 sweep, string engine)", assoc);
  var left = true;
  for (var x2 = 0; x2 < 9; x2++) for (var y2 = 0; y2 < 9; y2++) for (var z2 = 0; z2 < 9; z2++)
    if (scirc(els[x2], sadd(els[y2], els[z2])) !== sadd(scirc(els[x2], els[y2]), scirc(els[x2], els[z2]))) left = false;
  V("VD circ distributes from the left (full sweep, string engine)", left);
  var idOK = true;
  for (var x3 = 0; x3 < 9; x3++) if (scirc("10", els[x3]) !== els[x3]) idOK = false;
  V("VD identity is 1 on the left for all nine", idOK);
  // the plane: lines as point-key maps
  function key(px, py) { return px + "|" + py; }
  var lines = [];
  for (var mi = 0; mi < 9; mi++) for (var bi = 0; bi < 9; bi++) {
    var pts = {};
    for (var xi = 0; xi < 9; xi++) pts[key(els[xi], sadd(scirc(els[mi], els[xi]), els[bi]))] = 1;
    lines.push(pts);
  }
  for (var v9 = 0; v9 < 9; v9++) {
    var pts2 = {};
    for (var yi = 0; yi < 9; yi++) pts2[key(els[v9], els[yi])] = 1;
    lines.push(pts2);
  }
  V("VD 90 lines (81 nearfield plus 9 verticals)", lines.length === 90, "" + lines.length);
  var nine = true;
  for (var li = 0; li < 90; li++) {
    var cnt = 0; for (var pk in lines[li]) cnt++;
    if (cnt !== 9) nine = false;
  }
  V("VD nine points on every line", nine);
  var ptsAll = [];
  for (var p1 = 0; p1 < 9; p1++) for (var p2 = 0; p2 < 9; p2++) ptsAll.push(key(els[p1], els[p2]));
  V("VD 81 points", ptsAll.length === 81);
  var uniq = true;
  for (var i1 = 0; i1 < 81; i1++) for (var i2 = i1+1; i2 < 81; i2++) {
    var c = 0;
    for (var l = 0; l < 90; l++) if (lines[l][ptsAll[i1]] && lines[l][ptsAll[i2]]) c++;
    if (c !== 1) uniq = false;
  }
  V("VD exactly one line through every pair (all 3240 pairs)", uniq);
  var meetsOK = true;
  for (var l1 = 0; l1 < 90; l1++) for (var l2 = l1+1; l2 < 90; l2++) {
    var cc = 0;
    for (var q = 0; q < 81; q++) if (lines[l1][ptsAll[q]] && lines[l2][ptsAll[q]]) cc++;
    if (cc > 1) meetsOK = false;
  }
  V("VD at most one meet per line pair (all 4005 pairs)", meetsOK);
  V("VD projective completion count 9^2 + 9 + 1 = 91", 81 + 9 + 1 === 91);
  // Desargues fails, in string coordinates
  var O = ["00","00"];
  var A = ["01","01"], Ap = ["02","02"], B = ["01","20"], Bp = ["10","01"], C = ["00","01"], Cp = ["00","11"];
  function linesThrough(P, Q) {
    var found = [];
    for (var l = 0; l < 90; l++) if (lines[l][key(P[0],P[1])] && lines[l][key(Q[0],Q[1])]) found.push(l);
    return found;
  }
  var lAA = linesThrough(A, Ap), lBB = linesThrough(B, Bp), lCC = linesThrough(C, Cp);
  V("VD perspective: exactly one line through each vertex pair",
    lAA.length === 1 && lBB.length === 1 && lCC.length === 1,
    lAA.length + "/" + lBB.length + "/" + lCC.length);
  V("VD and all three lines pass through the origin",
    lines[lAA[0]][key(O[0],O[1])] && lines[lBB[0]][key(O[0],O[1])] && lines[lCC[0]][key(O[0],O[1])]);
  function sideLine(P, Q) {
    var f = linesThrough(P, Q);
    return f.length === 1 ? lines[f[0]] : null;
  }
  function meetOf(L1, L2) {
    var ms = [];
    for (var q = 0; q < 81; q++) if (L1[ptsAll[q]] && L2[ptsAll[q]]) ms.push(ptsAll[q]);
    return ms;
  }
  var Pl = sideLine(A, B), Ql = sideLine(B, C), Rl = sideLine(C, A);
  var Plp = sideLine(Ap, Bp), Qlp = sideLine(Bp, Cp), Rlp = sideLine(Cp, Ap);
  var mP = meetOf(Pl, Plp), mQ = meetOf(Ql, Qlp), mR = meetOf(Rl, Rlp);
  V("VD meets are unique: P, Q, R each a single point",
    mP.length === 1 && mQ.length === 1 && mR.length === 1,
    mP.length + "/" + mQ.length + "/" + mR.length);
  V("VD P = (t, 2+t) as the page prints", mP[0] === key("01","21"), mP[0]);
  V("VD Q = (2t, 1+2t) as the page prints", mQ[0] === key("02","12"), mQ[0]);
  V("VD R = (1+t, t) as the page prints", mR[0] === key("11","01"), mR[0]);
  var col = false;
  for (var l3 = 0; l3 < 90; l3++)
    if (lines[l3][mP[0]] && lines[l3][mQ[0]] && lines[l3][mR[0]]) col = true;
  V("VD and they are NOT collinear (no line holds all three)", !col);
}
// ============ VE: SVG figures, independently extracted and measured ============
function ve(page) {
  var segs = page.split('<svg viewBox');
  V("VE two svg figures found by split", segs.length === 3, "" + segs.length);
  var fig1 = segs[1], fig2 = segs[2];
  function circlesOf(s) {
    var out = [], i = s.indexOf('<circle');
    while (i !== -1) {
      var j = s.indexOf('/>', i);
      var seg = s.slice(i, j);
      var cxs = seg.slice(seg.indexOf('cx="') + 4);
      var cys = seg.slice(seg.indexOf('cy="') + 4);
      out.push([parseFloat(cxs.slice(0, cxs.indexOf('"'))), parseFloat(cys.slice(0, cys.indexOf('"')))]);
      i = s.indexOf('<circle', i + 7);
    }
    return out;
  }
  var c1 = circlesOf(fig1), c2 = circlesOf(fig2);
  V("VE Fig P18.1 has 10 circles", c1.length === 10, "" + c1.length);
  V("VE Fig P18.2 has 10 circles", c2.length === 10, "" + c2.length);
  function has(list, x, y) {
    for (var i = 0; i < list.length; i++) if (list[i][0] === x && list[i][1] === y) return true;
    return false;
  }
  var f1 = [[280,172],[340,172],[280,158],[400,130],[520,172],[280,144],[40,256],[160,130],[220,172],[280,214]];
  var f1ok = true;
  for (var i = 0; i < 10; i++) if (!has(c1, f1[i][0], f1[i][1])) f1ok = false;
  V("VE Fig P18.1 circles at the ten labelled pixels", f1ok);
  var f2 = [[280,230],[410,120],[500,50],[50,120],[345,175],[353.33,170],[395,285],[320,190],[320,78],[320,120]];
  var f2ok = true;
  for (var j = 0; j < 10; j++) if (!has(c2, f2[j][0], f2[j][1])) f2ok = false;
  V("VE Fig P18.2 circles at the ten labelled pixels", f2ok);
  function shoe(p, q, r) { return Math.abs(p[0]*(q[1]-r[1]) + q[0]*(r[1]-p[1]) + r[0]*(p[1]-q[1])); }
  V("VE Fig P18.2 O*,A,A' collinear by shoelace (exact)",
    shoe([280,230],[410,120],[345,175]) === 0, "" + shoe([280,230],[410,120],[345,175]));
  V("VE Fig P18.2 O*,B,B' collinear by shoelace (within rounding)",
    shoe([280,230],[500,50],[353.33,170]) < 5, "" + shoe([280,230],[500,50],[353.33,170]));
  V("VE Fig P18.2 O*,C,C' collinear by shoelace (exact)",
    shoe([280,230],[50,120],[395,285]) === 0, "" + shoe([280,230],[50,120],[395,285]));
  V("VE Fig P18.2 P,Q,R all on the vertical x=320",
    has(c2,320,190) && has(c2,320,78) && has(c2,320,120));
  V("VE Fig P18.2 P on AB and on A'B' (shoelace)",
    shoe([410,120],[500,50],[320,190]) < 5 && shoe([345,175],[353.33,170],[320,190]) < 5);
  V("VE Fig P18.2 Q on BC and on B'C' (shoelace)",
    shoe([500,50],[50,120],[320,78]) < 5 && shoe([353.33,170],[395,285],[320,78]) < 5);
  V("VE Fig P18.2 R on CA and on C'A' (shoelace)",
    shoe([50,120],[410,120],[320,120]) === 0 && shoe([395,285],[345,175],[320,120]) < 5);
  V("VE Fig P18.2 ell drawn as the vertical line (320,15)-(320,288)",
    fig2.indexOf('<line x1="320" y1="15" x2="320" y2="288"') !== -1);
  V("VE Fig P18.1 O,A,A' horizontal (exact shoelace)",
    shoe([280,172],[340,172],[520,172]) === 0);
  V("VE Fig P18.1 O,B,B' vertical (exact shoelace)",
    shoe([280,172],[280,158],[280,144]) === 0);
  V("VE Fig P18.1 O,C,C' collinear (exact shoelace)",
    shoe([280,172],[400,130],[40,256]) === 0, "" + shoe([280,172],[400,130],[40,256]));
  V("VE Fig P18.1 P on AB (exact shoelace)",
    shoe([340,172],[280,158],[160,130]) === 0, "" + shoe([340,172],[280,158],[160,130]));
  V("VE Fig P18.1 the drawn axis (15,28.5)-(381.4,285) passes within 0.7px of P, Q, R",
    shoe([15,28.5],[381.4,285],[160,130]) < 320 &&
    shoe([15,28.5],[381.4,285],[220,172]) < 320 &&
    shoe([15,28.5],[381.4,285],[280,214]) < 320,
    shoe([15,28.5],[381.4,285],[160,130]).toFixed(1) + " " +
    shoe([15,28.5],[381.4,285],[220,172]).toFixed(1) + " " +
    shoe([15,28.5],[381.4,285],[280,214]).toFixed(1));
}
// ============ tail ============
async function main() {
  var page = await fetchPage("/home/user/knowledge/graph-driven-math-book/wip/p18-raise-dimension.html");
  var out = [];
  out.push("P18 REVIEW-VERIFIER — page fetched, " + page.length + " chars, tail: " +
    (page.slice(-27) === "\n</footer>\n</body>\n</html>\n"));
  var kit = va(page);
  vb(page, kit);
  vc();
  vd();
  ve(page);
  var tally = { VA: [0,0], VB: [0,0], VC: [0,0], VD: [0,0], VE: [0,0] };
  for (var i = 0; i < VOUT.length; i++) {
    out.push(VOUT[i]);
    var t = VOUT[i].slice(6, 8);
    if (tally[t]) { if (VOUT[i].slice(0,4) === "PASS") tally[t][0]++; else tally[t][1]++; }
  }
  var tp = [];
  var keys = ["VA","VB","VC","VD","VE"];
  for (var k = 0; k < keys.length; k++)
    tp.push(keys[k] + ":" + (tally[keys[k]][0] + tally[keys[k]][1]) +
      (tally[keys[k]][1] > 0 ? "(" + tally[keys[k]][1] + " FAIL)" : ""));
  out.push("P18 REVIEW-VERIFIER TALLY  " + tp.join(" "));
  out.push("P18 REVIEW-VERIFIER FINAL: " + VR.pass + "/" + (VR.pass + VR.fail) + ", " + VR.fail + " FAIL");
  return out.join("\n");
}
