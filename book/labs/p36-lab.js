// p36-lab.js — machine receipts for P36 "Count with characters" (S70).
// Fresh engines, zero borrowed constants; runs with PAGE = the assembled page text.
// Output via console.log, one receipt per line, TOTAL at the end.

const R = [];
function chk(id, cond, detail) { R.push(id + " " + (cond ? "PASS" : "FAIL") + (detail ? " — " + detail : "")); }

// ---------- Group A — the cube, from two generators ----------
const mm = (A,B) => A.map(r => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
const I3 = [[1,0,0],[0,1,0],[0,0,1]];
const Rz = [[0,-1,0],[1,0,0],[0,0,1]], Rx = [[1,0,0],[0,0,-1],[0,1,0]];
let grp = [I3], seenG = new Set([I3.map(r=>r.join()).join(";")]), grew = true;
while (grew) { grew = false;
  for (const A of grp.slice()) for (const B of [Rz, Rx]) for (const C of [mm(A,B), mm(B,A)]) {
    const k = C.map(r=>r.join()).join(";");
    if (!seenG.has(k)) { seenG.add(k); grp.push(C); grew = true; }
  }
}
chk("A01", grp.length === 24, "rotation group size " + grp.length);
const NF = [[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]];
const veq = (a,b) => a[0]===b[0] && a[1]===b[1] && a[2]===b[2];
const facePerms = grp.map(M => { const p = new Array(6);
  for (let i = 0; i < 6; i++) { const v = [0,1,2].map(j => M[j][0]*NF[i][0] + M[j][1]*NF[i][1] + M[j][2]*NF[i][2]);
    for (let j2 = 0; j2 < 6; j2++) if (veq(v, NF[j2])) p[i] = j2; }
  return p; });
const cycOf = (p) => { const s = new Array(p.length).fill(false); let c = 0;
  for (let i = 0; i < p.length; i++) if (!s[i]) { c++; let j = i; while (!s[j]) { s[j] = true; j = p[j]; } }
  return c; };
const shapeOf = (p) => { const s = new Array(p.length).fill(false); const L = [];
  for (let i = 0; i < p.length; i++) if (!s[i]) { let j = i, len = 0; while (!s[j]) { s[j] = true; j = p[j]; len++; } L.push(len); }
  return L.sort((a,b) => b-a).join("+"); };
const classTally = {};
facePerms.forEach(p => { const sh = shapeOf(p); classTally[sh] = (classTally[sh] || 0) + 1; });
const shapes = Object.keys(classTally).sort().map(s => s + ":" + classTally[s]).join(" ");
chk("A02", (classTally["1+1+1+1+1+1"]===1 && classTally["4+1+1"]===6 && classTally["2+2+1+1"]===3 && classTally["3+3"]===8 && classTally["2+2+2"]===6), "class sizes " + shapes);
const orbitsK = (k) => { const canon = new Set();
  for (let c = 0; c < Math.pow(k, 6); c++) { const d = []; let t = c;
    for (let i = 0; i < 6; i++) { d.unshift(t % k); t = (t - t % k) / k; }
    let best = null;
    for (const p of facePerms) { const e = new Array(6); for (let i = 0; i < 6; i++) e[p[i]] = d[i];
      const s = e.join(""); if (best === null || s < best) best = s; }
    canon.add(best); }
  return canon.size; };
// ---------- Group A checks: census, formula, inventory ----------
chk("A03", orbitsK(1) === 1 && orbitsK(2) === 10 && orbitsK(3) === 57,
  "orbit census k=1,2,3 -> " + orbitsK(1) + "," + orbitsK(2) + "," + orbitsK(3));
const formulaK = (k) => (Math.pow(k,6) + 3*Math.pow(k,4) + 12*Math.pow(k,3) + 8*k*k) / 24;
let fOK = true, fOut = [];
for (let k = 1; k <= 6; k++) { const f = formulaK(k); fOut.push(f);
  if (k <= 3 && f !== orbitsK(k)) fOK = false;
  if (k === 4 && f !== 240) fOK = false;
  if (k === 5 && f !== 800) fOK = false;
  if (k === 6 && f !== 2226) fOK = false; }
chk("A04", fOK, "formula k=1..6 -> " + fOut.join(","));
const pmul = (a,b) => { const r = new Array(a.length+b.length-1).fill(0);
  for (let i=0;i<a.length;i++) for (let j=0;j<b.length;j++) r[i+j] += a[i]*b[j]; return r; };
const padd = (a,b) => { const n = Math.max(a.length,b.length), r = new Array(n).fill(0);
  for (let i=0;i<n;i++) r[i] = (a[i]||0) + (b[i]||0); return r; };
const pscale = (c,a) => a.map(x => c*x);
const binom = (n) => { const c = [1]; for (let i=1;i<=n;i++) c.push(c[i-1]*(n-i+1)/i); return c; };
const X2 = pmul([1,0,1],[1,0,1]), X3 = pmul([1,0,0,1],[1,0,0,1]);
let breed = padd(binom(6), pscale(6, pmul(binom(2), [1,0,0,0,1])));
breed = padd(breed, pscale(3, pmul(binom(2), X2)));
breed = padd(breed, pscale(8, X3));
breed = padd(breed, pscale(6, pmul(X2, [1,0,1])));
const inv = breed.map(x => x/24);
chk("A05", inv.join(",") === "1,1,2,2,2,1,1", "inventory polynomial " + inv.join(","));
const tally2 = new Array(7).fill(0);
for (let c = 0; c < 64; c++) { const d = []; let t = c;
  for (let i = 0; i < 6; i++) { d.unshift(t % 2); t = (t - t % 2) / 2; }
  let best = null;
  for (const p of facePerms) { const e = new Array(6); for (let i = 0; i < 6; i++) e[p[i]] = d[i];
    const s = e.join(""); if (best === null || s < best) best = s; }
  if (c === parseInt(best, 2)) tally2[best.split("").filter(x => x === "1").length]++; }
chk("A06", tally2.join(",") === "1,1,2,2,2,1,1", "inventory by census " + tally2.join(","));
// ---------- Group A checks: characters, all derived from engines ----------
const SHAPES = ["1+1+1+1+1+1","4+1+1","2+2+1+1","3+3","2+2+2"];
const CS = SHAPES.map(s => classTally[s]);           // class sizes 1,6,3,8,6
const repIdx = SHAPES.map(s => facePerms.findIndex(p => shapeOf(p) === s));
const traceOf = (M) => M[0][0] + M[1][1] + M[2][2];
const rot = repIdx.map(i => traceOf(grp[i]));        // expect 3,1,-1,0,-1
chk("A07", rot.join(",") === "3,1,-1,0,-1", "rotation char " + rot.join(","));
const ip = (a,b) => CS.reduce((s,x,i) => s + x*a[i]*b[i], 0) / 24;
chk("A08", ip(rot, rot) === 1, "<rot,rot> = " + ip(rot, rot));
const DL = [[1,1,1],[-1,-1,1],[1,-1,-1],[-1,1,-1]];
const diagPerm = grp.map(M => { const p = new Array(4);
  for (let i = 0; i < 4; i++) { const v = [0,1,2].map(j => M[j][0]*DL[i][0] + M[j][1]*DL[i][1] + M[j][2]*DL[i][2]);
    for (let j2 = 0; j2 < 4; j2++) if (veq(v, DL[j2]) || veq(v, DL[j2].map(x => -x))) p[i] = j2; }
  return p; });
const dPerm = repIdx.map(i => diagPerm[i].filter((x,j) => x === j).length); // fixed diagonals
chk("A09", dPerm.join(",") === "4,0,0,1,2", "diagonal perm char " + dPerm.join(","));
const stdP = dPerm.map(x => x - 1);
chk("A10", ip(stdP, stdP) === 1, "perm-1 irreducible, self = " + ip(stdP, stdP));
const signOf = (p) => { const s = new Array(p.length).fill(false); let cyc = 0;
  for (let i = 0; i < p.length; i++) if (!s[i]) { cyc++; let j = i; while (!s[j]) { s[j] = true; j = p[j]; } }
  return ((p.length - cyc) % 2 === 0) ? 1 : -1; };
const sign = repIdx.map(i => signOf(diagPerm[i]));
chk("A11", sign.join(",") === "1,-1,1,1,-1", "sign char " + sign.join(","));
const rotrot = rot.map(x => x*x);
const twodim = rotrot.map((x,i) => x - 1 - rot[i] - stdP[i]);
chk("A12", twodim.join(",") === "2,0,2,-1,0", "2-dim derived " + twodim.join(","));
chk("A13", ip(twodim, twodim) === 1, "2-dim self = " + ip(twodim, twodim));
const face = repIdx.map(i => facePerms[i].filter((x,j) => x === j).length);
chk("A14", face.join(",") === "6,2,2,0,0", "face paint char " + face.join(","));
const TRIV = [1,1,1,1,1];
const mults = [TRIV, rot, twodim, stdP, sign].map(ch2 => ip(face, ch2));
chk("A15", mults.join(",") === "1,1,1,0,0", "face mults triv,rot,2dim,perm-1,sign " + mults.join(","));
chk("A16", ip(face, face) === 3, "face self = " + ip(face, face));
const VT = []; for (const a of [-1,1]) for (const b of [-1,1]) for (const c of [-1,1]) VT.push([a,b,c]);
const vertPerms = grp.map(M => { const p = new Array(8);
  for (let i = 0; i < 8; i++) { const v = [0,1,2].map(j => M[j][0]*VT[i][0] + M[j][1]*VT[i][1] + M[j][2]*VT[i][2]);
    for (let j2 = 0; j2 < 8; j2++) if (veq(v, VT[j2])) p[i] = j2; }
  return p; });
let canonV = new Set();
for (let c = 0; c < 256; c++) { const bits = []; let t = c;
  for (let i = 0; i < 8; i++) { bits.unshift(t % 2); t = (t - t % 2) / 2; }
  let best = null;
  for (const p of vertPerms) { const e = new Array(8); for (let i = 0; i < 8; i++) e[p[i]] = bits[i];
    const s = e.join(""); if (best === null || s < best) best = s; }
  canonV.add(best); }
const vp = repIdx.map(i => { const p = vertPerms[i]; return Math.pow(2, cycOf(p)); });
const vsum = CS.reduce((s,x,i) => s + x*vp[i], 0);
chk("A17", canonV.size === 23 && vsum / 24 === 23, "vertex orbits " + canonV.size + ", Burnside " + vsum + "/24");
chk("A18", vp.join(",") === "256,4,16,16,16", "vertex paint char " + vp.join(","));
// ---------- Group B — S3, the triangle ----------
const ALLP = [[0,1,2],[1,0,2],[0,2,1],[2,1,0],[1,2,0],[2,0,1]];
const S3R = [[0,1,2],[1,0,2],[1,2,0]], CS3 = [1,3,2];
const ip3 = (a,b) => CS3.reduce((s,x,i) => s + x*a[i]*b[i], 0) / 6;
const fixN = (p) => p.filter((x,i) => x === i).length;
const permC = S3R.map(fixN);
chk("B01", permC.join(",") === "3,1,0", "perm char " + permC.join(","));
chk("B02", ip3(permC, permC) === 2, "perm self = " + ip3(permC, permC) + " (not irreducible)");
const std3 = permC.map(x => x - 1), sign3 = S3R.map(signOf);
chk("B03", std3.join(",") === "2,0,-1", "std = perm - 1 = " + std3.join(","));
chk("B04", sign3.join(",") === "1,-1,1", "sign char " + sign3.join(","));
chk("B05", ip3(std3, std3) === 1 && ip3(sign3, sign3) === 1, "std, sign self 1,1");
const s3Canon = (k) => { const canon = new Set();
  for (let c = 0; c < Math.pow(k,3); c++) { const d = []; let t = c;
    for (let i = 0; i < 3; i++) { d.unshift(t % k); t = (t - t % k) / k; }
    let best = null;
    for (const p of ALLP) { const e = [0,0,0]; for (let i = 0; i < 3; i++) e[p[i]] = d[i];
      const s = e.join(""); if (best === null || s < best) best = s; }
    canon.add(best); }
  return canon; };
const paint2 = S3R.map(p => Math.pow(2, cycOf(p)));
chk("B06", paint2.join(",") === "8,4,2", "paint char k=2 " + paint2.join(","));
const TRIV3 = [1,1,1];
chk("B07", s3Canon(2).size === 4 && ip3(paint2, TRIV3) === 4, "bracelets " + s3Canon(2).size + " = <paint,1>");
const m2 = [TRIV3, sign3, std3].map(c2 => ip3(paint2, c2));
chk("B08", m2.join(",") === "4,0,2", "mults triv,sign,std " + m2.join(","));
chk("B09", ip3(paint2, paint2) === 20 && m2[0]*m2[0] + m2[2]*m2[2] === 20, "self 20 = 16 + 4");
const paint3 = S3R.map(p => Math.pow(3, cycOf(p)));
const m3 = [TRIV3, sign3, std3].map(c2 => ip3(paint3, c2));
chk("B10", paint3.join(",") === "27,9,3", "3-color char " + paint3.join(","));
chk("B11", s3Canon(3).size === 10 && m3[0] === 10, "3-color census " + s3Canon(3).size + " = <,1>");
chk("B12", m3.join(",") === "10,1,8", "3-color mults " + m3.join(","));
chk("B13", m3[0]*1 + m3[1]*1 + m3[2]*2 === 27, "dims 10 + 1 + 16 = 27");
chk("B14", ip3(paint3, paint3) === 165 && m3[0]*m3[0] + m3[1] + m3[2]*m3[2] === 165, "self 165 = 100 + 1 + 64");
let lawOK = true;
for (let k = 1; k <= 4; k++) { const pk = S3R.map(p => Math.pow(k, cycOf(p)));
  if (s3Canon(k).size !== ip3(pk, TRIV3)) lawOK = false; }
chk("B15", lawOK, "orbit count = multiplicity of the constant wave, k=1..4");
// ---------- Group C — C4 waves, necklaces, bracelets, chirality ----------
const wave = (j,m) => [Math.round(Math.cos(Math.PI*j*m/2)), Math.round(Math.sin(Math.PI*j*m/2))];
const ch4 = [];
for (let j = 0; j < 4; j++) ch4.push([0,1,2,3].map(m => wave(j,m)));
const expt = [[[1,0],[1,0],[1,0],[1,0]],[[1,0],[0,1],[-1,0],[0,-1]],
  [[1,0],[-1,0],[1,0],[-1,0]],[[1,0],[0,-1],[-1,0],[0,1]]];
let wOK = true;
for (let j = 0; j < 4; j++) for (let m = 0; m < 4; m++)
  if (ch4[j][m][0] !== expt[j][m][0] || ch4[j][m][1] !== expt[j][m][1]) wOK = false;
chk("C01", wOK, "C4 wave table (re,im) j=0..3");
const pip = (a,b) => { let s = 0; for (let m = 0; m < 4; m++) s += a[m][0]*b[m][0] + a[m][1]*b[m][1]; return s/4; };
let dOK = true, oOK = true;
for (let j = 0; j < 4; j++) { if (pip(ch4[j], ch4[j]) !== 1) dOK = false;
  for (let k = j+1; k < 4; k++) if (pip(ch4[j], ch4[k]) !== 0) oOK = false; }
chk("C02", dOK, "orthogonality: each wave self 1");
chk("C03", oOK, "orthogonality: distinct waves 0");
const rot1 = (s) => s.slice(1) + s.slice(0,1);
const neckCanon = (s) => { let t = s, best = s;
  for (let i = 0; i < s.length - 1; i++) { t = rot1(t); if (t < best) best = t; }
  return best; };
const bitsOf = (c,n) => { let b = c.toString(2); while (b.length < n) b = "0" + b; return b; };
const neckSet = (n) => { const set = new Set();
  for (let c = 0; c < Math.pow(2,n); c++) set.add(neckCanon(bitsOf(c,n)));
  return set; };
const gcdE = (a,b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
const neckGcd = (n) => { let s = 0; for (let j = 0; j < n; j++) s += Math.pow(2, gcdE(j,n)); return s/n; };
const phiE = (n) => { let c = 0; for (let i = 1; i <= n; i++) if (gcdE(i,n) === 1) c++; return c; };
const neckTot = (n) => { let s = 0; for (let d = 1; d <= n; d++) if (n % d === 0) s += phiE(d)*Math.pow(2,n/d); return s/n; };
let nOK = true, eOK = true; const nSeq = [];
for (let n = 1; n <= 12; n++) { const a = neckSet(n).size, b = neckGcd(n), c = neckTot(n);
  nSeq.push(a); if (a !== b || a !== c) nOK = false; }
chk("C04", nOK, "necklaces n=1..12, three engines agree: " + nSeq.join(","));
chk("C05", nSeq.join(",") === "2,3,4,6,8,14,20,36,60,108,188,352", "necklace sequence");
const paintC4 = [0,1,2,3].map(m => Math.pow(2, gcdE(m,4)));
const mc4 = [0,1,2,3].map(j => pip(paintC4.map(x => [x,0]), ch4[j]));
chk("C06", paintC4.join(",") === "16,2,4,2" && neckSet(4).size === 6, "C4 paint char " + paintC4 + ", neck(4)=6");
chk("C07", mc4.join(",") === "6,3,4,3", "C4 split " + mc4.join(","));
chk("C08", pip(paintC4.map(x => [x,0]), paintC4.map(x => [x,0])) === 70 && mc4.reduce((s,x) => s + x*x, 0) === 70, "Parseval 70");
const diaCanon = (s) => { const r = s.split("").reverse().join("");
  const a = neckCanon(s), b = neckCanon(r); return a < b ? a : b; };
const braceSet = (n) => { const set = new Set();
  for (let c = 0; c < Math.pow(2,n); c++) set.add(diaCanon(bitsOf(c,n)));
  return set; };
const braceForm = (n) => { let R;
  if (n % 2 === 1) R = n * Math.pow(2, (n+1)/2);
  else R = (n/2)*Math.pow(2, n/2 + 1) + (n/2)*Math.pow(2, n/2);
  return (n * neckGcd(n) + R) / (2*n); };
let bOK = true; const bSeq = [];
for (let n = 1; n <= 12; n++) { const a = braceSet(n).size; bSeq.push(a);
  if (a !== braceForm(n)) bOK = false; }
chk("C09", bOK && bSeq.join(",") === "2,3,4,6,8,13,18,30,46,78,126,224", "bracelets enum = Burnside formula: " + bSeq.join(","));
const achiral = (n) => { let a = 0;
  neckSet(n).forEach(cn => { const r = cn.split("").reverse().join("");
    if (neckCanon(r) === cn) a++; });
  return a; };
chk("C10", achiral(4) === 6 && achiral(6) === 12 && achiral(8) === 24, "achiral 6,12,24 at n=4,6,8");
chk("C11", neckCanon("001011") === "001011" && neckCanon("110100") === "001101"
  && diaCanon("001011") === diaCanon("110100"), "chiral pair 001011/110100: distinct necklaces, one bracelet");
let idOK = true;
for (let n = 1; n <= 12; n++) if (2*braceSet(n).size !== neckSet(n).size + achiral(n)) idOK = false;
chk("C12", idOK, "2B = N + A for n=1..12");
chk("C13", neckSet(6).size === 14 && braceSet(6).size === 13 && achiral(6) === 12, "n=6 spot check: 14 necklaces, 13 bracelets, 12 achiral");
// ---------- Group D — D4 vs Q8, and F2 ----------
const m2m = (A,B) => A.map(r => B[0].map((_, j) => r.reduce((s, x, k) => s + x*B[k][j], 0)));
const I2 = [[1,0],[0,1]];
const R90 = [[0,-1],[1,0]], SD = [[1,0],[0,-1]];
let d4 = [I2], d4seen = new Set(["1,0;0,1"]);
let d4grew = true;
while (d4grew) { d4grew = false;
  for (const A of d4.slice()) for (const B of [R90, SD]) for (const C of [m2m(A,B), m2m(B,A)]) {
    const k = C.map(r => r.join()).join(";");
    if (!d4seen.has(k)) { d4seen.add(k); d4.push(C); d4grew = true; } } }
const orderOf = (M) => { let P = M, n = 1;
  while (P.join(";") !== I2.join(";") && n < 20) { P = m2m(P, M); n++; }
  return n; };
const d4orders = d4.map(orderOf).sort((a,b) => a-b);
chk("D01", d4.length === 8 && d4orders.join(",") === "1,2,2,2,2,2,4,4", "D4 orders " + d4orders.join(","));
chk("D02", d4orders.filter(x => x === 2).length === 5, "D4 involutions " + d4orders.filter(x => x === 2).length);
const d4trace = d4.map(M => M[0][0] + M[1][1]).sort((a,b) => a-b);
chk("D03", d4trace.join(",") === "-2,0,0,0,0,0,0,2", "D4 2-dim traces " + d4trace.join(","));
// Q8 in pair arithmetic: element = (sign, unit), unit 0=1,1=i,2=j,3=k
const U = [
  [[0,1],[1,1],[2,1],[3,1]],
  [[1,1],[0,-1],[3,1],[2,-1]],
  [[2,1],[3,-1],[0,-1],[1,1]],
  [[3,1],[2,1],[1,-1],[0,-1]]];
const qmul = (a,b) => { const r = U[a[1]][b[1]];
  return [a[0]*b[0]*r[1], r[0]]; };
const Q8E = [[1,0],[-1,0],[1,1],[-1,1],[1,2],[-1,2],[1,3],[-1,3]];
const qorder = (q) => { let p = q, n = 1;
  while (!(p[0] === 1 && p[1] === 0) && n < 20) { p = qmul(p, q); n++; }
  return n; };
const q8orders = Q8E.map(qorder).sort((a,b) => a-b);
chk("D04", q8orders.join(",") === "1,2,4,4,4,4,4,4", "Q8 orders " + q8orders.join(","));
chk("D05", q8orders.filter(x => x === 2).length === 1, "Q8 involutions " + q8orders.filter(x => x === 2).length);
let uOK = true;
if (qmul([1,1],[1,2]).join(",") !== "1,3" || qmul([1,2],[1,1]).join(",") !== "-1,3") uOK = false;
if (qmul([1,1],[1,1]).join(",") !== "-1,0" || qmul([1,3],[1,3]).join(",") !== "-1,0") uOK = false;
if (qmul([-1,1],[1,2]).join(",") !== "-1,3") uOK = false;
chk("D06", uOK, "quaternion table: ij=k, ji=-k, ii=kk=-1, (-i)j=-k");
// Q8 2-dim rep over complex pairs: i, j as 2x2 complex matrices
const cmul = (p,q) => ({ re: p.re*q.re - p.im*q.im, im: p.re*q.im + p.im*q.re });
const cx0 = () => ({ re: 0, im: 0 }), cx1 = () => ({ re: 1, im: 0 });
const cm2 = (A,B) => A.map(r => B[0].map((_, j) => r.reduce((s, x, k) => {
  const p = cmul(x, B[k][j]); return { re: s.re + p.re, im: s.im + p.im }; }, cx0())));
const cI = [[cx1(),cx0()],[cx0(),cx1()]];
const Mi = [[{re:0,im:1},cx0()],[cx0(),{re:0,im:-1}]];
const Mj = [[cx0(),cx1()],[{re:-1,im:0},cx0()]];
const cNegI = [[{re:-1,im:0},cx0()],[cx0(),{re:-1,im:0}]];
const Mk = cm2(Mi, Mj);
const unitM = [cI, Mi, Mj, Mk];
const q8trace = [];
for (const q of Q8E) { let M = cI;
  for (let s = 0; s < Math.abs(q[0]); s++) M = cm2(M, unitM[q[1]]);
  if (q[0] === -1) M = cm2(M, cNegI);
  q8trace.push(M[0][0].re + M[1][1].re); }
const q8s = q8trace.slice().sort((a,b) => a-b);
chk("D07", q8s.join(",") === "-2,0,0,0,0,0,0,2", "Q8 2-dim traces " + q8s.join(","));
chk("D08", d4trace.join(",") === q8s.join(",") && d4orders.join(",") !== q8orders.join(","), "same trace table, different order profile: not isomorphic");
// conjugacy class sizes: matrices via orthogonal transpose, pairs via inverse
const classSizes = (elems, conjF) => { const seen = new Set(); const sizes = [];
  for (let i = 0; i < elems.length; i++) { if (seen.has(i)) continue;
    const cl = new Set();
    for (const x of elems) { const c = conjF(x, elems[i]);
      cl.add(elems.findIndex(e => JSON.stringify(e) === JSON.stringify(c))); }
    cl.forEach(j => seen.add(j)); sizes.push(cl.size); }
  return sizes.sort((a,b) => a-b); };
const d4cl = classSizes(d4, (x,g) => { const xt = x[0].map((_, i) => x.map(r => r[i]));
  return m2m(m2m(x, g), xt); });
chk("D09", d4cl.join(",") === "1,1,2,2,2", "D4 class sizes " + d4cl.join(","));
const qinv = (q) => q[1] === 0 ? [q[0], 0] : [-q[0], q[1]];
const q8cl = classSizes(Q8E, (x,g) => qmul(qmul(x, g), qinv(x)));
chk("D10", q8cl.join(",") === "1,1,2,2,2", "Q8 class sizes " + q8cl.join(","));
// F2: swap (x,y) -> (y,x) on the plane
const swapF = (v) => [v[1], v[0]];
const lines2 = [[1,0],[0,1],[1,1]];
const inv2 = lines2.filter(L => { const w = swapF(L); return w[0] === L[0] && w[1] === L[1]; });
chk("D11", inv2.length === 1 && inv2[0].join(",") === "1,1", "F2 invariant lines: only span(1,1)");
const comp2 = lines2.filter(L => !(L[0] === 1 && L[1] === 1) && swapF(L)[0] === L[0] && swapF(L)[1] === L[1]);
chk("D12", comp2.length === 0, "no invariant complement in F2^2");
const lines3 = [[1,0],[0,1],[1,1],[1,2]];
const inv3 = lines3.filter(L => { const w = swapF(L);
  return ((w[0]*L[1] - w[1]*L[0]) % 3 + 3) % 3 === 0; });
chk("D13", inv3.length === 2 && inv3.some(L => L.join(",") === "1,2"), "F3: span(1,1) and span(1,2) both invariant — Maschke restored");
// ---------- Group E — the page itself ----------
let blen = 0;
for (let i = 0; i < PAGE.length; i++) { const c = PAGE.charCodeAt(i);
  if (c < 0x80) blen++;
  else if (c < 0x800) blen += 2;
  else if (c >= 0xD800 && c <= 0xDBFF) { blen += 2; i++; }
  else blen += 3; }
chk("E01", blen === 63685 && PAGE.length === 63061, "page " + blen + " B, " + PAGE.length + " units");
const nl = PAGE.split("\n").length - 1;
chk("E02", nl === 221 && PAGE.endsWith("</html>\n"), nl + " lines, ends </html> + newline");
const cnt = (t) => PAGE.split(t).length - 1;
chk("E03", cnt("<h2") === 8 && cnt("</h2>") === 8, "8 h2");
chk("E04", cnt("<h3") === 11, "11 h3");
chk("E05", cnt("<details") === 10 && cnt("</details>") === 10, "10 details");
chk("E06", cnt("<svg") === 3 && cnt("</svg>") === 3, "3 svg");
chk("E07", cnt("<table") === 2, "2 tables");
chk("E08", cnt("pattern-box") === 3, "3 pattern boxes");
chk("E09", cnt("warn-box") === 1 && cnt("onramp") === 1, "1 warn-box, 1 onramp");
const tO = cnt("\\("), tC = cnt("\\)");
chk("E10", tO === 267 && tC === 267, "inline TeX " + tO + " open / " + tC + " close");
const dO = cnt("\\["), dC = cnt("\\]");
chk("E11", dO === 11 && dC === 11, "display TeX " + dO + " open / " + dC + " close");
chk("E12", PAGE.indexOf("$$") === -1, "no $$ anywhere");
chk("E13", PAGE.indexOf("`") === -1, "no backticks");
chk("E14", PAGE.indexOf("mathjax@3.2.2/es5/tex-svg.js") > 0
  && PAGE.indexOf("sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=") > 0, "MathJax 3.2.2 pin + integrity hash");
chk("E15", PAGE.indexOf("<title>P36 · Count with characters · The Patterns Atlas</title>") > 0
  && PAGE.indexOf('href="assets/style.css"') > 0, "title + stylesheet");
chk("E16", PAGE.indexOf("●○○ ●●○ ●●● ◆ ◐") > 0, "moons line");
chk("E17", PAGE.indexOf('href="p37-ito-calculus.html"') > 0
  && PAGE.indexOf('href="p35-force-independence.html"') > 0
  && PAGE.indexOf('class="atlas-home"') > 0, "footer: next P37, home P35");
chk("E18", cnt("<section") === 8 && cnt("</section>") === 8, "8 sections balanced");
chk("E19", PAGE.indexOf("class=\"page-figure\"") === -1 || cnt("page-figure") >= 3,
  "figure blocks: " + cnt("page-figure"));
// ---------- Group F — the three figures ----------
const svgs = []; let pos = 0;
while (true) { const i = PAGE.indexOf("<svg", pos); if (i < 0) break;
  const j = PAGE.indexOf("</svg>", i); svgs.push(PAGE.slice(i, j + 6)); pos = j + 6; }
chk("F01", svgs.length === 3, "3 svg blocks parsed");
const fig1 = svgs[0];
const wOK2 = fig1.indexOf('width="156"') > 0 && fig1.indexOf('width="86"') > 0
  && Math.abs(156 - 86.4*Math.log(64)/Math.LN10) < 0.5
  && Math.abs(86 - 86.4*Math.log(10)/Math.LN10) < 0.5;
chk("F02", wOK2, "funnel bar widths 156/86 = 86.4·log10(64), 86.4·log10(10)");
chk("F03", fig1.indexOf("1×64 · 6×8 · 3×16 · 8×4 · 6×8") > 0
  && fig1.indexOf("240 = 24 × 10") > 0, "breed string, 240 = 24 × 10");
const paintCls = SHAPES.map(s => Math.pow(2, s.split("+").length));
chk("F04", fig1.indexOf("(64, 8, 16, 4, 8)") > 0
  && paintCls.join(",") === "64,8,16,4,8"
  && CS.reduce((s,x,i) => s + x*paintCls[i], 0) / 24 === 10, "class paint char 2^cycles, Burnside 240/24 = 10");
const fig3 = svgs[1];
chk("F05", fig3.split('height="56"').length - 1 === 2 && fig3.indexOf("4 + 2×2") > 0
  && 4*1 + 2*2 === 8, "S3 split bar: two blocks of 56, 8 = 4·1 + 2·2");
const fig2 = svgs[2];
const circ = fig2.match(/<circle cx="(\d+)" cy="(\d+)" r="(\d+)" stroke="#999"/g) || [];
const dotm = fig2.match(/<circle cx="(\d+)" cy="(\d+)" r="4" fill="#555"\/>/g) || [];
chk("F06", circ.length === 4 && dotm.length === 11, "4 wave circles, 11 dots (" + circ.length + "/" + dotm.length + ")");
let onC = true, cxs = [];
for (const c of circ) { const m1 = c.match(/cx="(\d+)"/); cxs.push(+m1[1]); }
cxs.sort((a,b) => a-b);
chk("F07", cxs.join(",") === "95,225,355,485", "circle centers " + cxs.join(","));
for (const d of dotm) { const m2 = d.match(/cx="(\d+)" cy="(\d+)"/);
  const dx = +m2[1], dy = +m2[2]; let ok = false;
  for (const cxv of cxs) if (Math.abs(Math.sqrt((dx-cxv)*(dx-cxv) + (dy-100)*(dy-100)) - 55) < 0.5) ok = true;
  if (!ok) onC = false; }
chk("F08", onC, "every dot lies on its wave circle, r = 55");
chk("F09", fig2.indexOf("χ₀ constant") > 0 && fig2.indexOf("χ₁ once-around: 1, i, −1, −i") > 0
  && fig2.indexOf("χ₂ twice-around") > 0 && fig2.indexOf("χ₃: 1, −i, −1, i") > 0, "wave captions");
// ---------- Group G — exercise receipts ----------
const ex1 = [...s3Canon(2)].sort();
chk("G01", ex1.join(" ") === "000 001 011 111", "Ex1 canonical forms " + ex1.join(" "));
chk("G02", (8 - 3*4 + 2*2) / 6 === 0 && ip3(paint2, sign3) === 0, "Ex1 <(8,4,2), sign> = 0");
chk("G03", breed[3] === 48 && breed[3] / 24 === 2 && (20 + 3*4 + 8*2) === 48,
  "Ex3 x^3: (20 + 3·4 + 8·2)/24 = 2");
// Ex4 via a second engine: union-find partition instead of canonical strings
const uf = new Array(256).fill(-1);
const ufFind = (i) => { let r = i; while (uf[r] >= 0) r = uf[r];
  while (uf[i] >= 0) { const n2 = uf[i]; uf[i] = r; i = n2; } return r; };
const ufUnion = (a,b) => { const ra = ufFind(a), rb = ufFind(b); if (ra !== rb) uf[ra] = rb; };
for (let c = 0; c < 256; c++) { const bits = []; let t = c;
  for (let i = 0; i < 8; i++) { bits.unshift(t % 2); t = (t - t % 2) / 2; }
  for (const p of vertPerms) { const e = new Array(8);
    for (let i = 0; i < 8; i++) e[p[i]] = bits[i];
    ufUnion(c, parseInt(e.join(""), 2)); } }
let roots = 0;
for (let c = 0; c < 256; c++) if (ufFind(c) === c) roots++;
chk("G04", roots === 23 && canonV.size === 23, "Ex4 octahedron faces: " + roots + " orbits, two engines agree");
// ---------- Group H — lineage and arithmetic ----------
chk("H01", 1*1 + 1*1 + std3[0]*std3[0] === 6, "S3: 1 + 1 + 4 = 6 = |S3|");
chk("H02", TRIV[0]*TRIV[0] + rot[0]*rot[0] + twodim[0]*twodim[0] + stdP[0]*stdP[0] + sign[0]*sign[0] === 24,
  "S4: 1 + 9 + 4 + 9 + 1 = 24 = |S4|");
const d4n = [];
for (const M of d4) { let a = -1, b = -1;
  for (let x = 0; x < 4 && a < 0; x++) for (let y = 0; y < 2; y++) {
    let P = I2; for (let q = 0; q < x; q++) P = m2m(P, R90);
    if (y === 1) P = m2m(P, SD);
    if (P.join(";") === M.join(";")) { a = x; b = y; } }
  d4n.push([a, b]); }
let d4hom = 0, d4homOK = true;
for (const ar of [1,-1]) for (const bs of [1,-1]) {
  const chi = (w) => Math.pow(ar, w[0]) * Math.pow(bs, w[1]);
  let mult = true;
  for (let i = 0; i < 8; i++) for (let j2 = 0; j2 < 8; j2++) {
    const w = d4n[i], v = d4n[j2];
    const prod = m2m(d4[i], d4[j2]);
    const pi = d4.findIndex(M => M.join(";") === prod.join(";"));
    if (chi(d4n[pi]) !== chi(w)*chi(v)) mult = false; }
  if (mult) d4hom++; else d4homOK = false; }
chk("H03", d4hom === 4 && d4homOK && 4*1 + 4 === 8, "D4: four 1-dim chars + one 2-dim, 4 + 4 = 8");
let q8hom = 0;
for (const xi of [1,-1]) for (const xj of [1,-1]) {
  const cu = [1, xi, xj, xi*xj];
  let mult = true;
  for (const a of Q8E) for (const b of Q8E)
    if (cu[qmul(a,b)[1]] !== cu[a[1]] * cu[b[1]]) mult = false;
  if (mult) q8hom++; }
chk("H04", q8hom === 4 && 4*1 + 4 === 8, "Q8: four 1-dim chars + one 2-dim, 4 + 4 = 8");
chk("H05", ch4.reduce((s,w) => s + w[0][0]*w[0][0], 0) === 4, "C4: four waves, 1 + 1 + 1 + 1 = 4");
let dOK2 = true;
for (const y of ["1845","1896","1899","1904","1927","1937","1979"]) if (PAGE.indexOf(y) < 0) dOK2 = false;
chk("H06", dOK2, "lineage dates on page: 1845, 1896, 1899, 1904, 1927, 1937, 1979");
chk("H07", PAGE.indexOf("433") > 0 && PAGE.indexOf("455") > 0 && PAGE.indexOf("308") > 0 && PAGE.indexOf("339") > 0,
  "Redfield 433–455, Conway–Norton 308–339");
chk("H08", PAGE.indexOf("196,883") > 0 && 21296877 + 196883 === 21493760, "Monster 196,883 on page; 21296877 + 196883 = 21493760");
chk("H09", vsum === 552 && vsum === 24*23, "vertex Burnside 552 = 24 × 23");
// ---------- TOTAL ----------
console.log("p36-lab — machine receipts for P36, Count with characters (S70)");
console.log("page: book/p36-character-counting.html — 63685 B / 221 lines / 63061 units");
console.log("engines: fresh census, characters, waves, quaternions — no constants borrowed");
let pass = 0;
for (const r of R) { if (r.indexOf("PASS") > 3) pass++; console.log(r); }
console.log("TOTAL: " + pass + "/" + R.length + (pass === R.length ? " PASS" : " FAIL"));
