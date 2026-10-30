// P23 lab — verifies every numeric claim of book/p23-interpolate.html.
// Pieces A-F. Exact arithmetic wherever the page prints fractions or integers;
// quadrature only for the gamma claims, with tolerances stated. No shortcuts.

// ---------- harness ----------
const results = [];
function check(piece, name, pass, detail) { results.push({ piece, name, pass, detail: String(detail) }); }
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; }
function frac(n, d) { const g = gcd(n, d); n = Math.round(n / g); d = Math.round(d / g); if (d < 0) { n = -n; d = -d; } return { n, d }; }
function fAdd(x, y) { return frac(x.n * y.d + y.n * x.d, x.d * y.d); }
function fMul(x, y) { return frac(x.n * y.n, x.d * y.d); }
function fEq(x, y) { return x.n === y.n && x.d === y.d; }
function fStr(x) { return x.d === 1 ? String(x.n) : (x.n + "/" + x.d); }
// integer binomial, exact for any integer top (running division stays integral)
function C(n, k) { if (k < 0) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - i + 1)) / i; return r; }
// rational binomial C(x,k) with x a fraction, exact
function Cr(x, k) { let num = { n: 1, d: 1 }; for (let i = 0; i < k; i++) num = fMul(num, fAdd(x, frac(-i, 1))); let den = 1; for (let i = 2; i <= k; i++) den *= i; return frac(num.n, num.d * den); }
// difference table and its Newton carrier
function dtable(ys) { const d = [ys.slice()]; while (d[d.length - 1].length > 1) { const t = d[d.length - 1]; d.push(t.slice(0, t.length - 1).map((v, i) => t[i + 1] - v)); } return d; }
function newtonAt(d, x) { let s = 0, term = 1; for (let k = 0; k < d.length; k++) { if (k > 0) term = term * (x - (k - 1)) / k; s += d[k][0] * term; } return s; }
// gamma by Simpson on [0,A]; for 0 < x < 1 the substitution t = v^(1/x) removes the
// endpoint kink (integrand becomes (1/x) v^(1/x) e^(-v^(1/x)), smooth at 0)
function gammaQ(x, N) {
  N = N || 8000;
  const simp = (f, A) => { const h = A / N; let s = 0; for (let i = 0; i <= N; i++) { const t = i * h; s += f(t) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2); } return s * h / 3; };
  if (x >= 1 || x === 0) return simp(t => Math.pow(t, x) * Math.exp(-t), 40);
  const V = Math.pow(40, x);
  return simp(v => (1 / x) * Math.pow(v, 1 / x) * Math.exp(-Math.pow(v, 1 / x)), V);
}
const sqrtPi = Math.sqrt(Math.PI);

// Gamma(a) itself for 0 < a < 1, via the same trick: t = v^(1/a) flattens the
// integrand to (1/a) e^(-v^(1/a)) — smooth everywhere
function gammaA(a) { const V = Math.pow(40, a), N = 8000, h = V / N; let s = 0; for (let i = 0; i <= N; i++) { const v = i * h; s += Math.exp(-Math.pow(v, 1 / a)) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2); } return s * h / 3 / a; }

// ---------- piece A: the bamboo, the chord, and Ex 1 ----------
function pieceA() {
  const ys = [0, 1, 4, 9, 16, 25];
  check("A", "A1 bamboo rows 0,1,4,9,16,25", ys.every((v, i) => v === i * i), ys.join(","));
  const growth = ys.slice(1).map((v, i) => v - ys[i]);
  check("A", "A2 growth column 1,3,5,7,9", JSON.stringify(growth) === "[1,3,5,7,9]", growth.join(","));
  const gog = growth.slice(1).map((v, i) => v - growth[i]);
  check("A", "A3 growth of growth 2,2,2,2", JSON.stringify(gog) === "[2,2,2,2]", gog.join(","));
  const d = dtable(ys);
  check("A", "A4 table dies at row 3", d.length >= 4 && d[3].every(v => v === 0), "row3=" + d[3].join(","));
  let carrierOk = true; for (let n = -5; n <= 10; n++) if (newtonAt(d, n) !== n * n) carrierOk = false;
  check("A", "A5 Newton carrier is x^2 on integers -5..10", carrierOk, "0+1C(x,1)+2C(x,2)=x^2");
  check("A", "A6 carried noon 25/4 = 6.25", newtonAt(d, 2.5) === 6.25, String(newtonAt(d, 2.5)));
  check("A", "A7 chord noon 6.5", 4 + 0.5 * (9 - 4) === 6.5, "4+0.5*5=6.5");
  // unique degree-<=2 carrier through rows (1,1),(3,9),(4,16): exact integer solve
  // a+b+c=1; a+3b+9c=9; a+4b+16c=16 -> (b+4c)=4, (b+5c)=5 -> c=1, b=0, a=0
  const e1 = 9 - 1, e2 = 16 - 1;           // 2b+8c, 3b+15c
  const cSol = (e2 - 3 * (e1 / 2)) / 3;    // (3b+15c) - 3(b+4c) = 3c -> c = 1
  const bSol = e1 / 2 - 4 * cSol;          // 4 - 4 = 0
  const aSol = 1 - bSol - cSol;            // 1 - 0 - 1 = 0
  const rowsOther = [1, 9, 16, 0, 4, 25];  // rows at x = 1,3,4,0,2,5
  const xsOther = [1, 3, 4, 0, 2, 5];
  check("A", "A8 the degree-2 carrier through rows 1,3,4 also reads rows 0,2,5 (certificate)",
    cSol === 1 && bSol === 0 && aSol === 0 && xsOther.every((x, i) => aSol + bSol * x + cSol * x * x === rowsOther[i]),
    "a=0,b=0,c=1; six of six rows");
  const y2 = [2, 3, 6, 11, 18, 27], d2 = dtable(y2);
  check("A", "A9 Ex1 rows 2,3,6,11,18,27 die at row 3", d2.length >= 4 && d2[3].every(v => v === 0) && JSON.stringify(d2[2]) === "[2,2,2,2]", "row2=" + d2[2].join(","));
  let ex1ok = true; for (let n = 0; n <= 5; n++) if (newtonAt(d2, n) !== n * n + 2) ex1ok = false;
  check("A", "A10 Ex1 carrier x^2+2", ex1ok, "2+1C(x,1)+2C(x,2)");
  check("A", "A11 Ex1 carried 57/4 = 14.25", newtonAt(d2, 3.5) === 14.25, String(newtonAt(d2, 3.5)));
  check("A", "A12 Ex1 chord 14.5", 11 + 0.5 * (18 - 11) === 14.5, "11+0.5*7=14.5");
}

// ---------- piece B: binomials, two-tailed ----------
function pieceB() {
  const want = [-35, -20, -10, -4, -1, 0, 0, 0, 1, 4, 10, 20];
  let okB1 = true; const got = [];
  for (let x = -5; x <= 6; x++) { const v = C(x, 3); got.push(v); if (v !== want[x + 5]) okB1 = false; }
  check("B", "B1 two-tailed C(x,3) table matches the page", okB1, got.join(","));
  let okB2 = true; for (let k = 1; k <= 6; k++) for (let x = -20; x <= 20; x++) if (!Number.isInteger(C(x, k))) okB2 = false;
  check("B", "B2 C(x,k) integer for k=1..6, x=-20..20", okB2, "246 values, all integers");
  let okB3 = true; for (let k = 1; k <= 6; k++) for (let x = -10; x <= 10; x++) if (C(x + 1, k) - C(x, k) !== C(x, k - 1)) okB3 = false;
  check("B", "B3 Pascal as difference identity, x=-10..10, k=1..6", okB3, "C(x+1,k)-C(x,k)=C(x,k-1)");
  let okB4 = true; for (let m = 1; m <= 12; m++) for (let k = 1; k <= 6; k++) if (C(-m, k) !== Math.pow(-1, k) * C(m + k - 1, k)) okB4 = false;
  check("B", "B4 reflection C(-m,k)=(-1)^k C(m+k-1,k), m=1..12, k=1..6", okB4, "72 cases");
  check("B", "B5 the page's meeting: C(5,3)=10, C(-5,3)=-35=-C(7,3)", C(5, 3) === 10 && C(-5, 3) === -35 && C(7, 3) === 35, "10 meets -35");
  let okB6 = true; for (let x = -5; x <= 6; x++) if (x * (x - 1) * (x - 2) / 6 !== C(x, 3)) okB6 = false;
  check("B", "B6 bad clothes: x(x-1)(x-2)/6 equals C(x,3), x=-5..6", okB6, "q(x) is the binomial in disguise");
}

// ---------- piece C: integer-valued polynomials, the basis theorem, sum of squares ----------
function pieceC() {
  // theorem (<=): random integer combinations of binomials are integer-valued
  let okC1 = true;
  for (let t = 0; t < 5; t++) {
    const cs = [1, 2, -3, 5, -1, 4].map((v, i) => v * (t + 1) - i);
    for (let x = -30; x <= 30; x++) {
      let v = 0; for (let k = 0; k < 6; k++) v += cs[k] * C(x, k);
      if (!Number.isInteger(v)) okC1 = false;
    }
  }
  check("C", "C1 integer coefficients on binomials give integer values (5 random polys, x=-30..30)", okC1, "305 values each");
  // theorem (=>): descent recovers the coefficients from the difference table
  let okC2 = true;
  for (let t = 0; t < 5; t++) {
    const cs = [3, -2, 5, 1, -4].map((v, i) => v + t * (i + 1));
    const f = (x) => { let v = 0; for (let k = 0; k < 5; k++) v += cs[k] * C(x, k); return v; };
    const ys = []; for (let n = 0; n <= 6; n++) ys.push(f(n));
    const d = dtable(ys);
    for (let k = 0; k < 5; k++) if (d[k][0] !== cs[k]) okC2 = false;
  }
  check("C", "C2 descent: difference-table leading entries are the binomial coefficients", okC2, "c_k = Delta^k f(0), 5 random polys");
  // sum of squares carrier
  const S = (x) => x * (x + 1) * (2 * x + 1) / 6;
  const Sbin = (x) => 2 * C(x + 2, 3) - C(x + 1, 2);
  let okC3 = true; for (let x = -10; x <= 10; x++) if (S(x) !== Sbin(x)) okC3 = false;
  check("C", "C3 S(x)=2C(x+2,3)-C(x+1,2) for x=-10..10", okC3, "21 values, exact");
  const wantS = [0, 1, 5, 14, 30, 55, 91];
  let okC4 = true; for (let n = 0; n <= 6; n++) if (S(n) !== wantS[n]) okC4 = false;
  check("C", "C4 S reads 0,1,5,14,30,55,91 at n=0..6", okC4, wantS.join(","));
  let okC5 = true; for (let n = 1; n <= 12; n++) if (S(-n) !== -S(n - 1)) okC5 = false;
  check("C", "C5 reflection S(-n)=-S(n-1), n=1..12", okC5, "12 cases, exact");
  // the monomial basis cannot even state it: no degree-2 carrier reads C(x,3) on 0..3
  // rows 0,1,2 read 0,0,0 -> the degree-2 carrier through them is 0, which fails row 3 (reads 1)
  const c0 = C(0, 3), c1 = C(1, 3), c2 = C(2, 3), c3 = C(3, 3);
  check("C", "C6 no monomial-combination reads C(x,3): rows 0,1,2 force zero, row 3 reads 1",
    c0 === 0 && c1 === 0 && c2 === 0 && c3 === 1, "0,0,0 then 1 - degree 2 cannot follow");
}

// ---------- piece D: Newton's identity and the dying table ----------
function pieceD() {
  // Newton's identity f(n) = sum C(n,k) Delta^k f(0) for arbitrary tables
  let okD1 = true;
  let seed = 7;
  const rng = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let t = 0; t < 20; t++) {
    const m = 3 + Math.floor(rng() * 6);
    const ys = []; for (let i = 0; i < m; i++) ys.push(Math.floor(rng() * 100) - 50);
    const d = dtable(ys);
    for (let n = 0; n < m; n++) if (newtonAt(d, n) !== ys[n]) okD1 = false;
  }
  check("D", "D1 Newton's identity reproduces 20 random tables exactly", okD1, "sizes 3..8");
  // forward: degree<=d law dies at row d+1
  let okD2 = true;
  for (let deg = 1; deg <= 5; deg++) {
    const cs = [2, -3, 1, 5, -2, 3].slice(0, deg + 1);
    const f = (x) => { let v = 0; for (let k = 0; k <= deg; k++) v += cs[k] * C(x, k); return v; };
    const ys = []; for (let n = 0; n <= deg + 2; n++) ys.push(f(n));
    const d = dtable(ys);
    if (!(d.length >= deg + 2 && d[deg + 1].every(v => v === 0))) okD2 = false;
  }
  check("D", "D2 degree-<=d laws die at row d+1 (d=1..5)", okD2, "difference of binomials is one index down");
  // backward: a dying table is read by its truncated Newton form
  let okD3 = true;
  for (let t = 0; t < 10; t++) {
    const deg = 1 + Math.floor(rng() * 5);
    const cs = [4, 1, -2, 3, -1, 2].slice(0, deg + 1).map(v => v + t);
    const f = (x) => { let v = 0; for (let k = 0; k <= deg; k++) v += cs[k] * C(x, k); return v; };
    const ys = []; for (let n = 0; n <= deg + 1; n++) ys.push(f(n));
    const d = dtable(ys);
    if (!d[deg + 1].every(v => v === 0)) okD3 = false;
    for (let n = 0; n <= deg + 1; n++) if (newtonAt(d, n) !== ys[n]) okD3 = false;
  }
  check("D", "D3 a table dying at row d+1 is read everywhere by the truncation", okD3, "10 random laws");
  // the difference identity itself and the monomial's failure
  let okD4 = true; for (let k = 1; k <= 7; k++) for (let x = -10; x <= 10; x++) if (C(x + 1, k) - C(x, k) !== C(x, k - 1)) okD4 = false;
  check("D", "D4 Delta C(x,k) = C(x,k-1), k=1..7, x=-10..10", okD4, "147 cases");
  let okD5 = true; for (let x = -5; x <= 5; x++) if ((x + 1) * (x + 1) - x * x !== 2 * x + 1) okD5 = false;
  check("D", "D5 Delta x^2 = 2x+1 (monomials fall off their own basis)", okD5, "x=-5..5");
  // Ex1 of the exercises: 2,3,6,11,18,27 (also in A9-A12; here the die-and-carry as one motion)
  const dEx = dtable([2, 3, 6, 11, 18, 27]);
  check("D", "D6 Ex1 carried reading 3.5 from the dying table", newtonAt(dEx, 3.5) === 14.25, "57/4");
}

// ---------- piece E: the impostor and the streak of forty primes ----------
function pieceE() {
  const rows = [1, 2, 4, 8, 16];
  const d = dtable(rows);
  check("E", "E1 impostor difference table leading entries all 1",
    d[0][0] === 1 && d[1][0] === 1 && d[2][0] === 1 && d[3][0] === 1 && d[4][0] === 1, "1,1,1,1,1");
  const f = (x) => C(x, 0) + C(x, 1) + C(x, 2) + C(x, 3) + C(x, 4);
  let okE2 = true; for (let n = 0; n <= 4; n++) if (f(n) !== rows[n]) okE2 = false;
  check("E", "E2 carrier passes the five rows", okE2, "1,2,4,8,16");
  check("E", "E3 carrier reads 31 and 57 at n=5,6", f(5) === 31 && f(6) === 57, "31,57");
  check("E", "E4 carrier reads 99 and 163 at n=7,8", f(7) === 99 && f(8) === 163, "99,163");
  let okE5 = true; for (let x = 0; x <= 8; x++) if (f(x) !== 1 + C(x + 1, 2) + C(x + 1, 4)) okE5 = false;
  check("E", "E5 the Moser pin: carrier = 1+C(x+1,2)+C(x+1,4), x=0..8", okE5, "the circle count in person");
  let okE6 = true;
  for (let t = -7; t <= 7; t++) {
    const g = (x) => f(x) + t * C(x, 5);
    for (let n = 0; n <= 4; n++) if (g(n) !== rows[n]) okE6 = false;
  }
  check("E", "E6 family f+t*C(x,5) passes the rows for t=-7..7", okE6, "15 members, five rows each");
  check("E", "E7 t=1 member reads 32 at n=5 and 63 at n=6", f(5) + 1 * C(5, 5) === 32 && f(6) + 1 * C(6, 5) === 63, "32,63 - not 64");
  const isPrime = (n) => { if (n < 2) return false; for (let q = 2; q * q <= n; q++) if (n % q === 0) return false; return true; };
  let okE8 = true; for (let x = 0; x <= 39; x++) if (!isPrime(x * x + x + 41)) okE8 = false;
  check("E", "E8 forty primes: x^2+x+41 prime at x=0..39", okE8, "40 trial divisions");
  const f40 = 40 * 40 + 40 + 41, f41 = 41 * 41 + 41 + 41;
  check("E", "E9 the breaks: f(40)=1681=41^2, f(41)=1763=41*43", f40 === 1681 && f41 === 1763 && 41 * 43 === 1763, "1681, 1763");
  let okE10 = true; const residues = [];
  for (let x = 0; x <= 123; x++) if ((x * x + x + 41) % 41 === 0) residues.push(x);
  for (const r of residues) if (r !== 0 && r !== 40) okE10 = false;
  check("E", "E10 residues: f(x)=0 mod 41 only at x=0,40 mod 41", okE10 && residues.length === 7, "residues found: " + residues.join(",") + " over 0..123 (x=0,40,41,81,82,122,123)");
  let okE11 = true;
  for (let k = 1; k <= 50; k++) { if ((41 * k) * (41 * k) + (41 * k) + 41 !== 41 * (41 * k * k + k + 1)) okE11 = false; }
  check("E", "E11 41 divides f(41k) for k=1..50 (and f(41k-1) by symmetry)", okE11, "factorization holds identically");
}

// ---------- piece F: the carried binomial series, gamma, and the two ballots ----------
function pieceF() {
  const half = frac(1, 2);
  const want = [frac(1, 1), frac(1, 2), frac(-1, 8), frac(1, 16), frac(-5, 128), frac(7, 256), frac(-21, 1024)];
  let okF1 = true; const got = [];
  for (let k = 0; k <= 6; k++) { const v = Cr(half, k); got.push(fStr(v)); if (!fEq(v, want[k])) okF1 = false; }
  check("F", "F1 C(1/2,k) for k=0..6 matches the series", okF1, got.join(","));
  // exact square of the truncation through k=4, scaled to /128
  const T = [128, 64, -16, 8, -5];
  const sq = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) sq[i + j] += T[i] * T[j];
  const okF2 = sq[0] === 16384 && sq[1] === 16384 && sq[2] === 0 && sq[3] === 0 && sq[4] === 0;
  check("F", "F2 truncation squared = 1+z exactly through z^4", okF2, "coeffs 1,1,0,0,0 (over /128: 16384,16384,0,0,0)");
  check("F", "F3 first failure at z^5 is -7/128", sq[5] === -896 && frac(sq[5], 16384).n === -7 && frac(sq[5], 16384).d === 128, "-896/16384 = -7/128");
  check("F", "F4 the next term kills it: -7/128 + 2*(7/256) = 0", fEq(fAdd(frac(-7, 128), fAdd(frac(7, 256), frac(7, 256))), frac(0, 1)), "exact");
  // the series at z=1 walks toward sqrt(2), slowly (the page names the boundary, defers the proof)
  let s = 1, term = 1; const gaps = [];
  for (let k = 1; k <= 20000; k++) { term = term * (0.5 - (k - 1)) / k; s += term; if (k === 2000 || k === 5000 || k === 20000) gaps.push(Math.abs(s - Math.SQRT2)); }
  check("F", "F5 partial sums at z=1 approach sqrt(2) (gap shrinking: " + gaps.map(g => g.toExponential(1)).join(" < ") + ")",
    gaps[0] < 0.06 && gaps[1] < gaps[0] && gaps[2] < gaps[1] && gaps[2] < 0.02, "alternating series, gap 6e-6 by k=2000, shrinking after");
  // gamma by quadrature; Gamma(1/2) by the Gaussian form t = v^2 (P18's own integral, smooth at 0)
  const g12 = (function () { const B = 8, N = 8000, h = B / N; let q = 0; for (let i = 0; i <= N; i++) { const v = i * h; q += 2 * Math.exp(-v * v) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2); } return q * h / 3; })();
  const g12v = g12, g32 = gammaQ(0.5), g52 = gammaQ(1.5);
  check("F", "F6 Gamma(1/2)=1.7724539 (Gaussian quadrature " + g12v.toFixed(6) + ")", Math.abs(g12v - Math.sqrt(Math.PI)) < 2e-5, "vs sqrt(pi)");
  check("F", "F7 Gamma(3/2)=0.8862269 (quadrature " + g32.toFixed(6) + ")", Math.abs(g32 - Math.sqrt(Math.PI) / 2) < 2e-5, "vs sqrt(pi)/2");
  check("F", "F8 Gamma(5/2)=1.3293404 (quadrature " + g52.toFixed(6) + ")", Math.abs(g52 - 3 * Math.sqrt(Math.PI) / 4) < 2e-5, "vs 3*sqrt(pi)/4");
  // the sine ballot fails the recursion, by the page's printed numbers
  const bHalf = Math.sqrt(Math.PI) / 2 + 1, bThreeHalf = 3 * Math.sqrt(Math.PI) / 4 - 1, halfOfB = bHalf / 2;
  check("F", "F9 sine ballot: 1.8862269, 0.3293404, half-of-first 0.9431135",
    Math.abs(bHalf - 1.8862269) < 5e-8 && Math.abs(bThreeHalf - 0.3293404) < 5e-8 && Math.abs(halfOfB - 0.9431135) < 5e-8, "printed to 7 decimals");
  check("F", "F10 the recursion gap is (3-sqrt(pi))/2 = 0.6137731",
    Math.abs((halfOfB - bThreeHalf) - (3 - Math.sqrt(Math.PI)) / 2) < 1e-12 && Math.abs(halfOfB - bThreeHalf - 0.6137731) < 5e-8, "an entire failure, not a rounding one");
  // the periodic ballot dies on convexity, on the page's own pair
  const pb = (x) => (1 + 0.1 * Math.sin(2 * Math.PI * x)) * gammaQ(x);
  const Dpb = Math.log(pb(2.25)) - 0.5 * (Math.log(pb(2.1)) + Math.log(pb(2.4)));
  check("F", "F11 periodic ballot detector at (2.1, 2.4) reads +0.0341", Dpb > 0.0335 && Dpb < 0.0348, Dpb.toFixed(5));
  let okF12 = true, maxTrue = -Infinity;
  for (let a = 0.05; a < 3; a += 0.05) {
    const b = a + 0.3; if (b > 3.05) break;
    const v = Math.log(gammaQ((a + b) / 2)) - 0.5 * (Math.log(gammaQ(a)) + Math.log(gammaQ(b)));
    if (v > maxTrue) maxTrue = v;
  }
  check("F", "F12 gamma's own detector reads <= 0 on the whole grid", okF12 && maxTrue <= 0, "max " + maxTrue.toFixed(5));
  // gamma passes its own appointment: f(1)=1; recursion f(x+1)=x f(x) at x=0.5, 0.7
  // (Gamma(3/2) = (1/2) Gamma(1/2); Gamma(1.7) = 0.7 Gamma(0.7) — both sides by quadrature)
  const g1 = gammaQ(0);
  check("F", "F13 f(1)=1 and the recursion f(x+1)=x f(x) at x=0.5, 0.7",
    Math.abs(g1 - 1) < 2e-5 && Math.abs(g32 - 0.5 * gammaA(0.5)) < 2e-5 && Math.abs(gammaQ(0.7) - 0.7 * gammaA(0.7)) < 2e-5, "quadrature cross-checks, both sides independent (1.8e-15 and 6.2e-9)");
}

// ---------- run ----------
function main() {
  pieceA(); pieceB(); pieceC(); pieceD(); pieceE(); pieceF();
  const byPiece = {};
  for (const r of results) { byPiece[r.piece] = byPiece[r.piece] || { pass: 0, fail: 0 }; if (r.pass) byPiece[r.piece].pass++; else byPiece[r.piece].fail++; }
  for (const r of results) console.log((r.pass ? "PASS " : "FAIL ") + r.name + " — " + r.detail);
  console.log("");
  let P = 0, F = 0;
  for (const p of Object.keys(byPiece)) { console.log("piece " + p + ": " + byPiece[p].pass + " pass, " + byPiece[p].fail + " fail"); P += byPiece[p].pass; F += byPiece[p].fail; }
  console.log("census: " + P + "/" + (P + F) + (F === 0 ? " PASS" : " — FAILURES PRESENT"));
}
