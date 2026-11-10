async function main() {
  // Lab G — graft gates for P73 step (5), owner option (a) FULL 8 grafts.
  // Fresh integer-shelf code; shares nothing with labs A-F, V1a, V1b, style audit.
  // Every numeric claim of the grafted page text is recomputed here from scratch.
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const pois = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });

  // ---------- shelf helpers ----------
  const mul = (a, b, N) => { const r = new Array(N + 1).fill(0); for (let i = 0; i <= N && i < a.length; i++) { if (!a[i]) continue; for (let j = 0; j + i <= N && j < b.length; j++) r[i + j] += a[i] * b[j]; } return r; };
  const eqShelf = (a, b, N) => { for (let i = 0; i <= N; i++) if ((a[i] || 0) !== (b[i] || 0)) return false; return true; };
  const fact = (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
  const pascal = (n) => { const rows = []; let r = [1]; for (let i = 0; i <= n; i++) { rows.push(r.slice()); const nx = [1]; for (let j = 1; j < r.length; j++) nx[j] = r[j - 1] + r[j]; nx.push(1); r = nx; } return rows; };
  const bin = (rows, n, k) => (k < 0 || k > n) ? 0 : rows[n][k];

  // ---------- GG1 odd parts = distinct parts (Exhibit A second specimen) ----------
  const N1 = 40;
  const oddDP = new Array(N1 + 1).fill(0); oddDP[0] = 1;
  for (let k = 1; k <= N1; k += 2) { for (let n = k; n <= N1; n++) oddDP[n] += oddDP[n - k]; } // unbounded odd parts
  const distDP = new Array(N1 + 1).fill(0); distDP[0] = 1;
  for (let k = 1; k <= N1; k++) { for (let n = N1; n >= k; n--) distDP[n] += distDP[n - k]; } // 0/1 distinct parts
  let g1 = true; for (let n = 0; n <= N1; n++) if (oddDP[n] !== distDP[n]) g1 = false;
  gate("G1a odd=distinct DP counts n<=40", g1, "oddDP===distDP shelf by shelf, first mismatch would kill");

  let prodD = [1]; for (let k = 1; k <= N1; k++) prodD = mul(prodD, [1].concat(new Array(k - 1).fill(0)).concat([1]), N1); // prod (1+x^k), factor [1,0..,1]
  let prodO = [1]; for (let j = 1; j <= N1; j += 2) { const geo = new Array(N1 + 1).fill(0); for (let m = 0; m * j <= N1; m++) geo[m * j] = 1; prodO = mul(prodO, geo, N1); }
  gate("G1b product shelves match both DPs", eqShelf(prodD, oddDP, N1) && eqShelf(prodO, distDP, N1), "distinct product and odd product both equal the shared census n<=40");

  let weldOK = true; for (let k = 1; k <= 6; k++) { const f = new Array(k + 2).fill(0); f[0] = 1; f[k] = 1; const g = new Array(k + 1).fill(0); g[0] = 1; g[k] = -1; const w = mul(f, g, 2 * k); const want = new Array(2 * k + 1).fill(0); want[0] = 1; want[2 * k] = -1; if (!eqShelf(w, want, 2 * k)) weldOK = false; }
  gate("G1c weld (1+x^k)(1-x^k)=1-x^{2k} k<=6", weldOK, "the one-line algebra of the specimen, shelf-checked");

  const partLists = (n, kind) => { // explicit stack, no recursion
    const out = []; const st = [{ p: [], rest: n, max: n }];
    while (st.length) { const s = st.pop(); if (s.rest === 0) { out.push(s.p); continue; }
      for (let k = Math.min(s.max, s.rest); k >= 1; k--) { if (kind === "odd" && k % 2 === 0) continue; if (kind === "distinct" && s.p.indexOf(k) >= 0) continue; st.push({ p: s.p.concat([k]), rest: s.rest - k, max: k }); } }
    return out;
  };
  const odd4 = partLists(4, "odd"), dist4 = partLists(4, "distinct");
  const odd4s = odd4.map((p) => p.join("+")).sort().join(";");
  const dist4s = dist4.map((p) => p.join("+")).sort().join(";");
  gate("G1d n=4 instance lists", odd4s === "1+1+1+1;3+1" && dist4s === "3+1;4" && odd4.length === 2 && dist4.length === 2,
    "odd: 1+1+1+1 and 3+1; distinct: 4 and 3+1 — two and two, as the page promises");

  // ---------- GG2 derangements / EGF (labelled door) ----------
  const N2 = 10;
  const D = [1]; for (let n = 1; n <= N2; n++) D[n] = n * D[n - 1] + (n % 2 === 0 ? 1 : -1);
  let dIEok = true; for (let n = 0; n <= N2; n++) { let s = 0; const fn = fact(n); for (let k = 0; k <= n; k++) { const t = fn / fact(k); s += (k % 2 ? -t : t); } if (s !== D[n]) dIEok = false; }
  gate("G2a D_n three routes n<=10", dIEok && D.slice(0, 6).join(",") === "1,0,1,2,9,44", "recurrence nD_{n-1}+(-1)^n and inclusion-exclusion n!*sum(-1)^k/k! agree; table 1,0,1,2,9,44");

  const rows = pascal(2 * N2);
  let idOK = true; for (let n = 0; n <= N2; n++) { let s = 0; for (let k = 0; k <= n; k++) s += bin(rows, n, k) * D[n - k]; if (s !== fact(n)) idOK = false; }
  gate("G2b n! = sum C(n,k)D_{n-k} n<=10", idOK, "the product equation 1/(1-x) = e^x D-hat, scaled by n!, read shelf by shelf");

  // e^{-x}/(1-x) shelves scaled by n!: shelf n of e^{-x}*(1/(1-x)) times n! equals sum_{k<=n} (-1)^k n!/k!
  let egfOK = true; for (let n = 0; n <= N2; n++) { const fn = fact(n); let s = 0; for (let j = 0; j <= n; j++) { const t = fn / fact(j); s += (j % 2 ? -t : t); } if (s !== D[n]) egfOK = false; }
  gate("G2c D-hat = e^{-x}/(1-x) scaled shelves", egfOK, "shelf n of the EGF product, times n!, is D_n — the door's one-line arithmetic");

  // ---------- GG3 binary/ternary uniqueness (Exercise 6) ----------
  const N3 = 63;
  let binProd = [1]; let binRungOK = true;
  for (let k = 0; k <= 5; k++) { const f = new Array((1 << k) + 2).fill(0); f[0] = 1; f[1 << k] = 1; binProd = mul(binProd, f, N3); const g = new Array((1 << k) + 1).fill(0); g[0] = 1; g[1 << k] = -1; const w = mul(f, g, 1 << (k + 1)); const want = new Array((1 << (k + 1)) + 1).fill(0); want[0] = 1; want[1 << (k + 1)] = -1; if (!eqShelf(w, want, 1 << (k + 1))) binRungOK = false; }
  const ones64 = new Array(N3 + 1).fill(1);
  gate("G3a binary ladder", eqShelf(binProd, ones64, N3) && binProd[63] === 1 && (binProd[64] === undefined || binProd[64] === 0) && binRungOK,
    "prod_{k<=5}(1+x^{2^k}) = (1-x^64)/(1-x): all 64 shelves read 1, rung telescopes checked");

  let binLong = [1]; for (let k = 0; k <= 9; k++) { const f = new Array((1 << k) + 2).fill(0); f[0] = 1; f[1 << k] = 1; binLong = mul(binLong, f, 1030); }
  let longOK = true; for (let n = 0; n <= (1 << 10) - 1; n++) if (binLong[n] !== 1) longOK = false;
  gate("G3b forever ladder -> 1/(1-x)", longOK && binLong[1 << 10] === 0, "product k<=9: every shelf 0..1023 reads 1 — the limit package is 1/(1-x)");

  const pow3 = [1, 3, 9, 27, 81, 243];
  let terProd = [1]; let terRungOK = true;
  for (let k = 0; k <= 3; k++) { const f = new Array(2 * pow3[k] + 1).fill(0); f[0] = 1; f[pow3[k]] = 1; f[2 * pow3[k]] = 1; terProd = mul(terProd, f, 81); const g = new Array(pow3[k] + 1).fill(0); g[0] = 1; g[pow3[k]] = -1; const w = mul(f, g, pow3[k + 1]); const want = new Array(pow3[k + 1] + 1).fill(0); want[0] = 1; want[pow3[k + 1]] = -1; if (!eqShelf(w, want, pow3[k + 1])) terRungOK = false; }
  const ones81 = new Array(81).fill(1);
  gate("G3c ternary ladder", eqShelf(terProd, ones81, 80) && terProd[81] === 0 && terRungOK, "prod_{k<=3}(1+x^{3^k}+x^{2*3^k}) = (1-x^81)/(1-x): all 81 shelves read 1, zero at 81");

  // ---------- GG4 Hanoi (Exercise 7a) ----------
  const N4 = 12;
  const han = [0]; for (let n = 1; n <= N4; n++) han[n] = 2 * han[n - 1] + 1;
  let hanCF = true; for (let n = 0; n <= N4; n++) if (han[n] !== Math.pow(2, n) - 1) hanCF = false;
  const geo2 = new Array(N4 + 1).fill(0); for (let n = 0; n <= N4; n++) geo2[n] = Math.pow(2, n);
  const onesN = new Array(N4 + 1).fill(1);
  const pf = new Array(N4 + 1).fill(0); for (let n = 0; n <= N4; n++) pf[n] = geo2[n] - onesN[n];
  gate("G4a Hanoi 2^n-1", hanCF && han[10] === 1023 && eqShelf(pf, han, N4), "recurrence, package 1/(1-2x)-1/(1-x), and a_10 = 1023");

  // package identity: shelves of x/((1-x)(1-2x)) = 2^n - 1, checked via (1-3x+2x^2)*A = x
  let pkgOK = true; for (let n = 0; n <= N4; n++) { const lhs = han[n] - 3 * (n >= 1 ? han[n - 1] : 0) + 2 * (n >= 2 ? han[n - 2] : 0); const rhs = (n === 1) ? 1 : 0; if (lhs !== rhs) pkgOK = false; }
  gate("G4b (1-3x+2x^2)A = x shelf identity", pkgOK, "the filed law, verified as a shelf equation on the closed form's shelves");

  const xShift = new Array(N4 + 1).fill(0); for (let n = 1; n <= N4; n++) xShift[n] = 1; // shelves of x/(1-x): the +1 summed over n>=1
  gate("G4c the +1 files to x/(1-x)", xShift[0] === 0 && xShift[1] === 1 && xShift[N4] === 1, "inhomogeneous constant at every size >= 1, zero at size 0");

  // ---------- GG5 distinct-roots drill (Exercise 7b) ----------
  const dr = [1, 4]; for (let n = 2; n <= N4; n++) dr[n] = 5 * dr[n - 1] - 6 * dr[n - 2];
  let drCF = true; for (let n = 0; n <= N4; n++) if (dr[n] !== 2 * Math.pow(3, n) - Math.pow(2, n)) drCF = false;
  gate("G5a drill census + closed form", dr.slice(0, 6).join(",") === "1,4,14,46,146,454" && drCF, "law 5a_{n-1}-6a_{n-2} regenerates 1,4,14,46,146,454 and equals 2*3^n-2^n through n=12");

  let drPkg = true; for (let n = 0; n <= N4; n++) { const lhs = dr[n] - 5 * (n >= 1 ? dr[n - 1] : 0) + 6 * (n >= 2 ? dr[n - 2] : 0); const rhs = (n === 0) ? 1 : (n === 1 ? -1 : 0); if (lhs !== rhs) drPkg = false; }
  gate("G5b (1-5x+6x^2)A = 1-x shelf identity", drPkg, "the filed law as a shelf equation: shelf 0 reads 1, shelf 1 reads -1, the rest 0");

  const pA = new Array(N4 + 1).fill(0); const pB = new Array(N4 + 1).fill(0);
  for (let n = 0; n <= N4; n++) { pA[n] = 2 * Math.pow(3, n); pB[n] = Math.pow(2, n); }
  gate("G5c partial fractions 2/(1-3x)-1/(1-2x)", eqShelf(new Array(N4 + 1).fill(0).map((_, n) => pA[n] - pB[n]), dr, N4) && 2 * 27 - 8 === 46 && 2 * 243 - 32 === 454, "PF shelves equal the census; page instances 2*27-8=46 and 2*243-32=454");

  // ---------- GG6 one shelf, three questions (Exercise 4) ----------
  let sqOK = true; for (let n = 0; n <= 10; n++) { let s = 0; for (let k = 0; k <= n; k++) s += bin(rows, n, k) * bin(rows, n, k); if (s !== bin(rows, 2 * n, n)) sqOK = false; }
  gate("G6a sum C(n,k)^2 = C(2n,n) n<=10", sqOK && 1 + 16 + 36 + 16 + 1 === 70 && bin(rows, 8, 4) === 70, "identity plus the page's n=4 instance 1+16+36+16+1=70=C(8,4)");

  let ps = new Array(20).fill(1); for (let pass = 1; pass <= 3; pass++) { const nx = new Array(20).fill(0); let acc2 = 0; for (let i = 0; i < 20; i++) { acc2 += ps[i]; nx[i] = acc2; } ps = nx; } // (1-x)^{-4} shelves = C(n+3,3): ones are (1-x)^{-1}, three more prefix passes
  const compShelf12 = ps[8]; // shelf 12 of x^4 (1-x)^{-4}
  gate("G6b compositions of 12 into 4 parts", compShelf12 === 165 && bin(rows, 11, 3) === 165 && ps[8] === bin(rows, 11, 3), "package shelf 12 of (x/(1-x))^4 reads 165 = C(11,3); the subtract-1 route is the same binomial");

  // ---------- GG7 plus-branch pole (Exemplar 3 graft) ----------
  const b = [1, -2]; for (let n = 2; n <= 8; n++) { let s = 0; for (let i = 1; i < n; i++) s += b[i] * b[n - i]; b[n] = -s / 2; }
  let sqrtOK = true; for (let n = 1; n <= 8; n++) { let s = 0; for (let i = 0; i <= n; i++) s += b[i] * b[n - i]; const want = (n === 0) ? 1 : ((n === 1) ? -4 : 0); if (s !== want) sqrtOK = false; }
  gate("G7a sqrt(1-4x) shelves", b.slice(0, 6).join(",") === "1,-2,-2,-4,-10,-28" && sqrtOK, "shelves 1,-2,-2,-4,-10,-28 and (sum b)^2 = 1-4x shelf-checked");

  const c = b.slice(1).map((v) => -v / 2); // Catalan c_n = -b_{n+1}/2
  const q = [1].concat(c.map((v) => -v)); // plus-branch: shelf -1 reads 1, shelf n>=0 reads -c_n
  gate("G7b plus branch = x^{-1} - C", q[0] === 1 && q.slice(1, 7).join(",") === "-1,-1,-2,-5,-14,-42" && c.slice(0, 5).join(",") === "1,1,2,5,14",
    "expanded pole x^{-1}-1-x-2x^2-5x^3-14x^4-...; the good package hangs underneath, C shelves 1,1,2,5,14");

  // ---------- GG8 clothesline rules (differencing door) ----------
  const f = [1, 1]; for (let n = 2; n <= 12; n++) f[n] = f[n - 1] + f[n - 2];
  const N8 = 12;
  const shift = new Array(N8 + 1).fill(0); for (let n = 1; n <= N8; n++) shift[n] = f[n - 1];
  const xf = mul(f, [0, 1], N8);
  const diff = new Array(N8 + 1).fill(0); diff[0] = f[0]; for (let n = 1; n <= N8; n++) diff[n] = f[n] - f[n - 1];
  const fx = mul(f, [1, -1], N8);
  const pre = new Array(N8 + 1).fill(0); let acc = 0; for (let n = 0; n <= N8; n++) { acc += f[n]; pre[n] = acc; }
  const fOnes = mul(f, onesN, N8);
  const back = mul(f, [1, -1, -1], N8);
  const unit = new Array(N8 + 1).fill(0); unit[0] = 1;
  const der = new Array(N8).fill(0); for (let n = 0; n < N8; n++) der[n] = (n + 1) * f[n + 1];
  const xder = new Array(N8 + 1).fill(0); for (let n = 1; n <= N8; n++) xder[n] = der[n - 1];
  const idxWant = new Array(N8 + 1).fill(0); for (let n = 0; n <= N8; n++) idxWant[n] = n * f[n];
  gate("G8 clothesline rules on the census", eqShelf(xf, shift, N8) && eqShelf(fx, diff, N8) && eqShelf(fOnes, pre, N8) && eqShelf(back, unit, N8) && eqShelf(xder, idxWant, N8),
    "shift x^k, differences (1-x)A, prefix A/(1-x), index stamping xA', and F(1-x-x^2)=1 — all shelf-verified on the census");
  // explicit index-rule check
  let idxOK = true; for (let n = 0; n <= N8; n++) if (xder[n] !== n * f[n]) idxOK = false;
  gate("G8b index rule [x^n] xA' = n a_n", idxOK, "each shelf stamped with its own index, census-tested");

  // ---------- poisons ----------
  const evenDP = new Array(N1 + 1).fill(0); evenDP[0] = 1;
  for (let k = 2; k <= N1; k += 2) { for (let n = k; n <= N1; n++) evenDP[n] += evenDP[n - k]; }
  pois("PG1 even-parts claim breaks odd=distinct at n=3", evenDP[3] !== distDP[3] && evenDP[3] === 0 && distDP[3] === 2, "even parts of 3: none (0) vs distinct parts of 3: {3},{2+1} (2)");

  let hom = [0]; for (let n = 1; n <= N4; n++) hom[n] = 2 * hom[n - 1];
  pois("PG2 homogeneous Hanoi a_n=2a_{n-1} fails at shelf 1", hom[1] !== 1 && hom[1] === 0, "dropping the +1 leaves 2a_0=0 at shelf 1 vs the true move count 1");

  let dPlus = [1]; for (let n = 1; n <= 3; n++) { let s = 0; const fn = fact(n); for (let k = 0; k <= n; k++) s += fn / fact(k); dPlus[n] = s; }
  pois("PG3 all-plus derangement sum fails at n=2", dPlus[2] !== D[2] && dPlus[2] === 5 && D[2] === 1, "2!(1+1+1/2)=5 vs D_2=1 — the signs are load-bearing");

  let bad = []; for (let n = 0; n <= 3; n++) bad[n] = Math.pow(3, n) - Math.pow(2, n);
  pois("PG4 drill closed form 3^n-2^n fails at shelf 0", bad[0] !== 1 && bad[0] === 0, "3^0-2^0=0 vs a_0=1");

  let terBad = [1]; for (let k = 0; k <= 3; k++) { const f2 = new Array(4 * pow3[k] + 1).fill(0); f2[0] = 1; f2[pow3[k]] = 1; f2[4 * pow3[k]] = 1; terBad = mul(terBad, f2, 80); }
  pois("PG5 ternary factor x^{3^k}+x^{4*3^k} fails at shelf 2", terBad[2] === 0, "wrong digit shelves leave shelf 2 empty where uniqueness needs 1");

  const allPass = gates.every((g) => g.pass);
  const out = {
    lab: "p73-lab-g-grafts", date: "2026-11-10", gates, poisons,
    notes: [
      "step (5) graft gates, owner option (a) FULL: every numeric claim of the eight grafted passages recomputed from scratch with fresh integer-shelf code",
      "G1 odd=distinct (DP counts n<=40, product shelves, per-factor weld, n=4 instance lists); G2 derangements (recurrence + inclusion-exclusion + scaled EGF shelves, n! identity); G3 binary/ternary ladders (64 and 81 all-one shelves, rung telescoping, forever ladder); G4 Hanoi (2^n-1, a_10=1023, package shelf identity, the +1 filing); G5 drill (census, law, shelf equation, partial fractions); G6 sum C(n,k)^2 + compositions 165; G7 plus-branch pole x^{-1}-C; G8 clothesline rules",
      "poisons: PG1 even-parts, PG2 homogeneous Hanoi, PG3 all-plus derangements, PG4 wrong drill form, PG5 wrong ternary digits — all must be caught (fail where the truth passes)",
    ],
    summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" + (allPass ? "" : " — FAILS PRESENT"),
  };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-lab-g-grafts.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
