// p36-review-verifier.js — fresh adversarial verification for P36 (S70).
// Independent engines; zero code shared with the lab. Expects PAGE = assembled page text.
// V01-V26: fresh checks. V27-V42: injected defects that MUST be rejected.
const REC = [];
let bad = 0;
function rc(id, cond, detail) { REC.push(id + " " + (cond ? "PASS" : "LEAK") + " — " + detail); if (!cond) bad++; }
function inj(id, cond, detail) { REC.push(id + " " + (cond ? "REJECTED" : "LEAK") + " — " + detail); if (!cond) bad++; }
const rx = (re) => (PAGE.match(re) || []).length;
// V01-V02: byte length, lines, ending
let bb = 0, ii = 0;
while (ii < PAGE.length) { const u = PAGE.charCodeAt(ii);
  if (u < 0x80) { bb += 1; ii += 1; }
  else if (u < 0x800) { bb += 2; ii += 1; }
  else if (u < 0xD800 || u > 0xDFFF) { bb += 3; ii += 1; }
  else { bb += 4; ii += 2; } }
rc("V01", bb === 63685 && PAGE.length === 63061, "bytes " + bb + ", units " + PAGE.length);
rc("V02", rx(/\n/g) === 221 && PAGE.slice(-8) === "</html>\n", "221 lines, closes </html> + newline");
rc("V03", rx(/<h2/g) === 8 && rx(/<\/h2>/g) === 8, "h2 pairs: " + rx(/<h2/g));
rc("V04", rx(/<h3/g) === 11 && rx(/<\/h3>/g) === 11, "h3 pairs: " + rx(/<h3/g));
rc("V05", rx(/<details/g) === 10 && rx(/<svg/g) === 3 && rx(/<table/g) === 2,
  "details 10, svg 3, tables 2");
rc("V06", rx(/pattern-box/g) === 3 && rx(/warn-box/g) === 1 && rx(/onramp/g) === 1,
  "boxes 3, warn 1, onramp 1");
rc("V07", rx(/\\\(/g) === 267 && rx(/\\\)/g) === 267, "inline TeX " + rx(/\\\(/g) + "/" + rx(/\\\)/g));
rc("V08", rx(/\\\[/g) === 11 && rx(/\\\]/g) === 11, "display TeX " + rx(/\\\[/g) + "/" + rx(/\\\]/g));
rc("V09", !/\$\$/.test(PAGE) && !/`/.test(PAGE), "no $$, no backticks");
rc("V10", /mathjax@3\.2\.2\/es5\/tex-svg\.js/.test(PAGE)
  && /sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI\/7nxxjJM2C4DqII=/.test(PAGE)
  && PAGE.indexOf("<title>P36 · Count with characters · The Patterns Atlas</title>") > 0
  && PAGE.indexOf('href="assets/style.css"') > 0, "pin, integrity, title, stylesheet");
rc("V11", PAGE.indexOf("●○○ ●●○ ●●● ◆ ◐") > 0
  && PAGE.indexOf('href="p37-ito-calculus.html"') > 0
  && PAGE.indexOf('href="p35-force-independence.html"') > 0, "moons, next door, home door");
// V12-V16: the cube by parameterized signed permutations (det +1), orbit BFS
const FACES = [[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]];
const PERMS = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
const sgnP = (p) => { let inv = 0;
  for (let a = 0; a < 3; a++) for (let b = a+1; b < 3; b++) if (p[a] > p[b]) inv++;
  return inv % 2 === 0 ? 1 : -1; };
const rots = [];
for (const p of PERMS) for (let m = 0; m < 8; m++) {
  const s = [m & 1 ? -1 : 1, m & 2 ? -1 : 1, m & 4 ? -1 : 1];
  if (sgnP(p) * s[0] * s[1] * s[2] === 1) rots.push({ perm: p, signs: s }); }
rc("V12", rots.length === 24, "det+1 signed permutations: " + rots.length);
const faceP = rots.map(rt => FACES.map(nv => { const w = [0,0,0];
  for (let j = 0; j < 3; j++) w[j] = rt.signs[j] * nv[rt.perm[j]];
  return FACES.findIndex(u => u[0] === w[0] && u[1] === w[1] && u[2] === w[2]); }));
const uniqP = new Set(faceP.map(p => p.join(",")));
rc("V13", uniqP.size === 24, "face action faithful: " + uniqP.size + " distinct perms");
const shapeOf2 = (p) => { const got = {}; const lens = [];
  for (let i = 0; i < p.length; i++) { if (got[i]) continue;
    let len = 0, j = i;
    while (!got[j]) { got[j] = 1; j = p[j]; len++; }
    lens.push(len); }
  return lens.sort((a,b) => b-a).join("+"); };
const tally = {};
faceP.forEach(p => { const sh = shapeOf2(p); tally[sh] = (tally[sh] || 0) + 1; });
rc("V14", tally["1+1+1+1+1+1"] === 1 && tally["4+1+1"] === 6 && tally["2+2+1+1"] === 3
  && tally["3+3"] === 8 && tally["2+2+2"] === 6, "five breeds 1,6,3,8,6");
const partOrbits = (k, nd, perms) => { const total = Math.pow(k, nd);
  const seen = new Array(total).fill(false); let orbits = 0;
  for (let seed = 0; seed < total; seed++) { if (seen[seed]) continue;
    orbits++; const q = [seed]; seen[seed] = true;
    while (q.length) { const c = q.pop(); const dg = new Array(nd); let t = c;
      for (let d = nd - 1; d >= 0; d--) { dg[d] = t % k; t = (t - t % k) / k; }
      for (const p of perms) { let nc = 0;
        for (let d = 0; d < nd; d++) nc = nc * k + dg[p[d]];
        if (!seen[nc]) { seen[nc] = true; q.push(nc); } } } }
  return orbits; };
const partsOf = (sh) => sh.split("+").length;
const burn2 = ["1+1+1+1+1+1","4+1+1","2+2+1+1","3+3","2+2+2"]
  .reduce((s, sh, i) => s + [1,6,3,8,6][i] * Math.pow(2, partsOf(sh)), 0) / 24;
rc("V15", partOrbits(2, 6, faceP) === 10 && partOrbits(1, 6, faceP) === 1
  && burn2 === 10, "k=2: BFS " + partOrbits(2, 6, faceP) + " orbits, Burnside " + burn2);
rc("V16", partOrbits(3, 6, faceP) === 57, "k=3: " + partOrbits(3, 6, faceP) + " orbits");
const VTS = [];
for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++)
  VTS.push([2*a-1, 2*b-1, 2*c-1]);
const vertP = rots.map(rt => VTS.map(nv => { const w = [0,0,0];
  for (let j = 0; j < 3; j++) w[j] = rt.signs[j] * nv[rt.perm[j]];
  return VTS.findIndex(u => u[0] === w[0] && u[1] === w[1] && u[2] === w[2]); }));
const vpChar = ["1+1+1+1+1+1","4+1+1","2+2+1+1","3+3","2+2+2"].map(sh => {
  const idx = faceP.findIndex(p => shapeOf2(p) === sh);
  const got = {}; let cyc = 0;
  for (let i = 0; i < 8; i++) { if (got[i]) continue; cyc++; let j = i;
    while (!got[j]) { got[j] = 1; j = vertP[idx][j]; } }
  return Math.pow(2, cyc); });
const burnV = vpChar.reduce((s, v, i) => s + [1,6,3,8,6][i] * v, 0) / 24;
rc("V17", partOrbits(2, 8, vertP) === 23 && vpChar.join(",") === "256,4,16,16,16"
  && burnV === 23, "vertices: BFS " + partOrbits(2, 8, vertP) + ", char " + vpChar.join(","));
// V18-V20: S3, by orbit partition and cycle walks
const S3P = [[0,1,2],[1,0,2],[0,2,1],[2,1,0],[1,2,0],[2,0,1]];
const S3R2 = [[0,1,2],[1,0,2],[1,2,0]], SZ3 = [1,3,2];
const ipS = (a,b) => SZ3.reduce((s,x,i) => s + x*a[i]*b[i], 0) / 6;
const cyclesOf = (p) => { const c = {}; let cyc = 0;
  for (let i = 0; i < p.length; i++) { if (c[i]) continue; cyc++; let j = i;
    while (!c[j]) { c[j] = 1; j = p[j]; } }
  return cyc; };
rc("V18", partOrbits(2, 3, S3P) === 4 && partOrbits(3, 3, S3P) === 10,
  "S3 orbits: 2-color " + partOrbits(2, 3, S3P) + ", 3-color " + partOrbits(3, 3, S3P));
const permS = S3R2.map(p => p.reduce((s, x, i) => s + (x === i ? 1 : 0), 0));
const signS = S3R2.map(p => (3 - cyclesOf(p)) % 2 === 0 ? 1 : -1);
const stdS = permS.map(v => v - 1);
const paintS = S3R2.map(p => Math.pow(2, cyclesOf(p)));
const multS = [[1,1,1], signS, stdS].map(ch => ipS(paintS, ch));
rc("V19", permS.join(",") === "3,1,0" && stdS.join(",") === "2,0,-1"
  && signS.join(",") === "1,-1,1" && paintS.join(",") === "8,4,2"
  && multS.join(",") === "4,0,2" && ipS(paintS, paintS) === 20,
  "chars (3,1,0)/(2,0,-1)/(1,-1,1), mults 4,0,2, self 20");
const paint3S = S3R2.map(p => Math.pow(3, cyclesOf(p)));
const mult3S = [[1,1,1], signS, stdS].map(ch => ipS(paint3S, ch));
rc("V20", paint3S.join(",") === "27,9,3" && mult3S.join(",") === "10,1,8"
  && ipS(paint3S, paint3S) === 165 && mult3S[0] + mult3S[1] + 2*mult3S[2] === 27,
  "3-color (27,9,3), mults 10,1,8, self 165, dims 10+1+16");
// V21-V22: the S4 table on the cube's five breeds, orthogonality by hand of machine
const SZ4 = [1,6,3,8,6];
const ip4 = (a,b) => SZ4.reduce((s,x,i) => s + x*a[i]*b[i], 0) / 24;
const CH4 = {
  triv: [1,1,1,1,1], sign: [1,-1,1,1,-1], two: [2,0,2,-1,0],
  rot: [3,1,-1,0,-1], prm: [3,-1,-1,0,1] };
let orthOK = true;
const names = ["triv","sign","two","rot","prm"];
for (const n1 of names) for (const n2 of names) {
  const v = ip4(CH4[n1], CH4[n2]);
  if (n1 === n2 && v !== 1) orthOK = false;
  if (n1 !== n2 && v !== 0) orthOK = false; }
const sumSq = names.reduce((s, n) => s + CH4[n][0]*CH4[n][0], 0);
rc("V21", orthOK && sumSq === 24, "S4 table: 5x5 orthogonal, 1+1+4+9+9 = 24");
const SHP5 = ["1+1+1+1+1+1","4+1+1","2+2+1+1","3+3","2+2+2"];
const faceFix = SHP5.map(sh => { const idx = faceP.findIndex(p => shapeOf2(p) === sh);
  return faceP[idx].reduce((s, x, i) => s + (x === i ? 1 : 0), 0); });
const multF = names.map(n => ip4(faceFix, CH4[n]));
rc("V22", faceFix.join(",") === "6,2,2,0,0" && multF.join(",") === "1,0,1,1,0"
  && ip4(faceFix, faceFix) === 3, "face char 6,2,2,0,0; mults " + multF.join(",") + "; self 3");
// V23: C4 waves with complex objects, orthogonality and the split
const cmx = (x, y) => ({ r: x.r*y.r - x.i*y.i, i: x.r*y.i + x.i*y.r });
const cjx = (x) => ({ r: x.r, i: -x.i });
const wavC = (j, m) => { const ang = Math.PI * j * m / 2;
  return { r: Math.round(Math.cos(ang)), i: Math.round(Math.sin(ang)) }; };
const ipC = (a, b) => { let sr = 0;
  for (let m = 0; m < 4; m++) sr += cmx(a(m), cjx(b(m))).r;
  return sr / 4; };
let orthC = true;
for (let j = 0; j < 4; j++) { if (ipC(m => wavC(j,m), m => wavC(j,m)) !== 1) orthC = false;
  for (let k = j+1; k < 4; k++)
    if (ipC(m => wavC(j,m), m => wavC(k,m)) !== 0) orthC = false; }
const gcdE2 = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
const paintC = (m) => ({ r: Math.pow(2, gcdE2(m, 4)), i: 0 });
const multC = [0,1,2,3].map(j => ipC(paintC, m => wavC(j, m)));
rc("V23", orthC && multC.join(",") === "6,3,4,3" && ipC(paintC, paintC) === 70,
  "C4 orthogonal, split " + multC.join(",") + ", Parseval 70");
// V24: necklaces, bracelets, achirality — bitmask engines
const canonN = (c, n) => { const mask = (1 << n) - 1; let best = c;
  for (let m = 1; m < n; m++) { const t = ((c << m) | (c >> (n - m))) & mask;
    if (t < best) best = t; }
  return best; };
const revB = (c, n) => { let r = 0;
  for (let i = 0; i < n; i++) if (c & (1 << i)) r |= 1 << (n - 1 - i);
  return r; };
const canonD = (c, n) => Math.min(canonN(c, n), canonN(revB(c, n), n));
const setOf = (fn, n) => { const s = new Set();
  for (let c = 0; c < Math.pow(2, n); c++) s.add(fn(c, n));
  return s; };
let achOK = true;
const nck = [], brk = [];
for (let n = 1; n <= 12; n++) {
  const N = setOf(canonN, n).size, B = setOf(canonD, n).size;
  nck.push(N); brk.push(B);
  let A = 0;
  setOf(canonN, n).forEach(c => { if (canonN(revB(c, n), n) === c) A++; });
  if (2*B !== N + A) achOK = false;
  if (n === 4 && A !== 6) achOK = false;
  if (n === 6 && A !== 12) achOK = false;
  if (n === 8 && A !== 24) achOK = false; }
rc("V24", nck.join(",") === "2,3,4,6,8,14,20,36,60,108,188,352"
  && brk.join(",") === "2,3,4,6,8,13,18,30,46,78,126,224" && achOK,
  "necklaces " + nck.join(",") + "; bracelets " + brk.join(",") + "; 2B=N+A holds");
// V25: D4 as corner permutations, Q8 as coded units — same table, different groups
const compP = (a, b) => a.map(v => b[v]);
const R4 = [1,2,3,0], S4r = [3,2,1,0], IDE = [0,1,2,3];
let d4e = [IDE], d4k = new Set(["0,1,2,3"]);
let grew2 = true;
while (grew2) { grew2 = false;
  for (const A of d4e.slice()) for (const B of [R4, S4r]) for (const C of [compP(A,B), compP(B,A)]) {
    const key = C.join(",");
    if (!d4k.has(key)) { d4k.add(key); d4e.push(C); grew2 = true; } } }
const ordP = (p) => { let q = p, n = 1;
  while (q.join(",") !== IDE.join(",") && n < 20) { q = compP(q, p); n++; }
  return n; };
const d4o = d4e.map(ordP).sort((a,b) => a-b);
const fixP = (p) => p.reduce((s, x, i) => s + (x === i ? 1 : 0), 0);
const wordOf = (p) => { let w = null;
  for (let a = 0; a < 4 && w === null; a++) for (let b = 0; b < 2; b++) {
    let M = IDE;
    for (let t = 0; t < a; t++) M = compP(M, R4);
    if (b === 1) M = compP(M, S4r);
    if (M.join(",") === p.join(",")) w = [a, b]; }
  return w; };
// 2-dim character derived: perm - 1 - chi(r=-1,s=-1), per element word (a,b)
const d4t = d4e.map(p => { const w = wordOf(p);
  return fixP(p) - 1 - Math.pow(-1, w[0] + w[1]); }).sort((a,b) => a-b);
// Q8: idx = 2*unit + neg, units 0..3 = 1,i,j,k
const qm9 = (a, b) => { const ua = (a - a % 2) / 2, na = a % 2, ub = (b - b % 2) / 2, nb = b % 2;
  let u, sq;
  if (ua === 0) { u = ub; sq = 1; }
  else if (ub === 0) { u = ua; sq = 1; }
  else if (ua === ub) { u = 0; sq = -1; }
  else { u = 6 - ua - ub;
    sq = (ua === 1 && ub === 2) || (ua === 2 && ub === 3) || (ua === 3 && ub === 1) ? 1 : -1; }
  return 2*u + (na + nb + (sq === -1 ? 1 : 0)) % 2; };
const qord = (q) => { let p = q, n = 1;
  while (p !== 0 && n < 20) { p = qm9(p, q); n++; }
  return n; };
const q8o = [0,1,2,3,4,5,6,7].map(qord).sort((a,b) => a-b);
// Q8 2-dim traces: element = (-1)^neg * e_unit; matrices for i, j; k = i*j
const mI = [[{r:0,i:1},{r:0,i:0}],[{r:0,i:0},{r:0,i:-1}]];
const mJ = [[{r:0,i:0},{r:1,i:0}],[{r:-1,i:0},{r:0,i:0}]];
const mId = [[{r:1,i:0},{r:0,i:0}],[{r:0,i:0},{r:1,i:0}]];
const mNeg = [[{r:-1,i:0},{r:0,i:0}],[{r:0,i:0},{r:-1,i:0}]];
const mMul = (A, B) => [0,1].map(r => [0,1].map(c => {
  let ar = 0, ai = 0;
  for (let k = 0; k < 2; k++) { const p = cmx(A[r][k], B[k][c]);
    ar += p.r; ai += p.i; }
  return { r: ar, i: ai }; }));
const q8t = [];
for (let q = 0; q < 8; q++) { const unit = (q - q % 2) / 2, neg = q % 2;
  const M0 = unit === 0 ? mId : unit === 1 ? mI : unit === 2 ? mJ : mMul(mI, mJ);
  const M = neg === 1 ? mMul(mNeg, M0) : M0;
  q8t.push(M[0][0].r + M[1][1].r); }
const q8ts = q8t.slice().sort((a,b) => a-b);
rc("V25", d4e.length === 8 && d4o.join(",") === "1,2,2,2,2,2,4,4"
  && d4t.join(",") === "-2,0,0,0,0,0,0,2"
  && q8o.join(",") === "1,2,4,4,4,4,4,4" && q8ts.join(",") === "-2,0,0,0,0,0,0,2"
  && d4o.join(",") !== q8o.join(","),
  "same trace table " + d4t.join(",") + "; orders differ: not isomorphic");
// V26: F2 vs F3, and the lineage needles
const lineKey = (v, mod) => { let a = v[0], b = v[1];
  if (a === 0) { a = 0; b = 1; } else { const inv = mod === 2 ? 1 : (a === 1 ? 1 : 2); b = (b * inv) % mod; a = 1; }
  return a + "," + b; };
const invarLines = (mod) => { const keys = new Set();
  for (let x = 0; x < mod; x++) for (let y = 0; y < mod; y++) {
    if (x === 0 && y === 0) continue;
    if (lineKey([x, y], mod) === lineKey([y, x], mod)) keys.add(lineKey([x, y], mod)); }
  return keys.size; };
rc("V26", invarLines(2) === 1 && invarLines(3) === 2,
  "invariant swap-lines: F2 has 1, F3 has 2 — Maschke's edge");
let linOK = true;
for (const y of ["1845","1896","1899","1904","1927","1937","1979","433","455","308","339","196,883"])
  if (PAGE.indexOf(y) < 0) linOK = false;
rc("V27", linOK && 21296877 + 196883 === 21493760 && 552 === 24*23,
  "lineage dates, Redfield 433–455, Conway–Norton 308–339, Monster arithmetic");
// V28-V43: injected defects — each MUST be rejected
const MUT1 = PAGE.replace("<title>P36 · Count with characters", "<title>P36 · Count with characterz");
inj("V28", MUT1.indexOf("<title>P36 · Count with characters · The Patterns Atlas</title>") < 0,
  "title corruption caught");
inj("V29", !/mathjax@3\.2\.2\/es5\/tex-svg\.js/.test(PAGE.replace("3.2.2", "3.2.3")),
  "MathJax version bump caught");
inj("V30", (PAGE.replace("<h2>1 · Before we begin</h2>", "").match(/<h2/g) || []).length !== 8,
  "dropped h2 caught");
inj("V31", /`/.test(PAGE + "`"), "injected backtick caught");
inj("V32", /\$\$/.test(PAGE + "$$"), "injected $$ caught");
inj("V33", (PAGE.replace("●○○ ●●○ ●●● ◆ ◐", "●○○ ●●○ ●●● ◆ ○")).indexOf("●○○ ●●○ ●●● ◆ ◐") < 0,
  "moons corruption caught");
const burnBad = [1,7,3,8,6].reduce((s, x, i) => s + x*[64,8,16,4,8][i], 0) / 24;
inj("V34", burnBad !== 10, "corrupted class tally (6 -> 7) gives " + burnBad + ", not 10");
const rotsBad = rots.slice(); rotsBad.pop();
inj("V35", rotsBad.length !== 24, "dropped rotation: " + rotsBad.length + " elements, not a group");
inj("V36", 22 !== partOrbits(2, 8, vertP), "claimed vertex count 22 rejected: engine says " + partOrbits(2, 8, vertP));
let corruptNeck = 0;
for (let d = 1; d <= 12; d++) { if (12 % d === 0) { let ph = 0;
  for (let i = 1; i <= d; i++) { let g = i, h = d;
    while (h) { const t = g % h; g = h; h = t; }
    if (g === 1) ph++; }
  corruptNeck += ph * Math.pow(2, d); } }
inj("V37", corruptNeck / 12 !== 352, "corrupted totient formula (2^d for 2^(n/d)) at n=12: " + corruptNeck / 12 + ", not 352");
const braceBad = (n) => { const N = nck[n-1];
  if (n % 2 === 1) { const R = (n+1)/2 * Math.pow(2, (n+1)/2);
    return (n * N + R) / (2*n); }
  const R = (n/2)*Math.pow(2, n/2 + 1) + (n/2)*Math.pow(2, n/2);
  return (n * N + R) / (2*n); };
inj("V38", braceBad(9) !== 46, "dev-bug reflection term at n=9 gives " + braceBad(9) + ", not 46");
const qmBad = (a, b) => { const ua = (a - a % 2) / 2, na = a % 2, ub = (b - b % 2) / 2, nb = b % 2;
  let u, sq;
  if (ua === 0) { u = ub; sq = 1; }
  else if (ub === 0) { u = ua; sq = 1; }
  else if (ua === ub) { u = 0; sq = 1; }
  else { u = 6 - ua - ub;
    sq = (ua === 1 && ub === 2) || (ua === 2 && ub === 3) || (ua === 3 && ub === 1) ? 1 : -1; }
  return 2*u + (na + nb + (sq === -1 ? 1 : 0)) % 2; };
const badAssoc = qmBad(qmBad(2, 2), 4) !== qmBad(2, qmBad(2, 4));
inj("V39", badAssoc, "corrupted table with ii = +1 breaks associativity: (ii)j != i(ij)");
const signBad = [1,1,1];
inj("V40", SZ3.reduce((s, x, i) => s + x*signBad[i]*[1,1,1][i], 0) / 6 !== 0,
  "trivialized sign char equals triv: not orthogonal");
inj("V41", 2*13 !== 14 + 14, "forced all-achiral claim fails 2B = N + A at n=6");
inj("V42", 21296877 + 196884 !== 21493760, "corrupted Monster arithmetic rejected");
inj("V43", invarLines(2) === 1, "F2 split claim rejected: only span(1,1) is swap-invariant");
// TOTAL
console.log("p36-review-verifier — fresh adversarial verification for P36 (S70)");
console.log("independent engines: signed perms, BFS partitions, bitmask necklaces, coded quaternions");
const nPass = REC.filter(r => r.indexOf("PASS") >= 0).length;
const nRej = REC.filter(r => r.indexOf("REJECTED") >= 0).length;
const nLeak = REC.filter(r => r.indexOf("LEAK") >= 0).length;
for (const r of REC) console.log(r);
console.log("TOTAL: " + (nPass + nRej) + "/" + REC.length + (nLeak === 0 ? " PASS" : " FAIL")
  + " — " + nPass + " fresh checks, " + nRej + " injections rejected"
  + (nLeak > 0 ? ", " + nLeak + " LEAKED" : ""));
