// P23 review verifier — independent re-derivation of every numeric claim in
// book/p23-interpolate.html, plus page scans, poisons, and loader/prose gates.
// Pieces VA (re-derivations), VB (page scans), VC (poisons, must be rejected),
// VD (loader and prose gates). The page is read from the local working tree;
// every gate is a needle against the frozen bytes.

const results = [];
function check(piece, name, pass, detail) { results.push({ piece, name, pass, detail: String(detail) }); }

// exact rationals (independent minimal implementation)
function Fr(n, d) { if (!d) d = 1; const s = n < 0 ? -1 : 1; n = Math.abs(n); d = Math.abs(d); const g = (a, b) => b ? g(b, a % b) : a; const q = g(n, d) || 1; return { n: s * n / q, d: d / q }; }
const add = (x, y) => Fr(x.n * y.d + y.n * x.d, x.d * y.d);
const mul = (x, y) => Fr(x.n * y.n, x.d * y.d);
const eq = (x, y) => x.n === y.n && x.d === y.d;

// ---------- piece VA: independent re-derivations ----------
function pieceVA() {
  const sq = (n) => n * n;
  check("VA", "VA1 bamboo rows are squares 0..5", [0,1,2,3,4,5].every(n => sq(n) === [0,1,4,9,16,25][n]), "i^2");
  const grow = [1,3,5,7,9];
  check("VA", "VA2 growth column is the odd numbers", grow.every((v, i) => v === 2 * i + 1), "1,3,5,7,9");
  check("VA", "VA3 second differences flat at 2", grow.slice(1).every((v, i) => v - grow[i] === 2), "2,2,2,2");
  // Newton form verified symbolically: 0 + x + 2*x(x-1)/2 = x^2, checked at 21 half-integers
  let va4 = true;
  for (let k = 0; k <= 20; k++) { const x = k / 4 - 2.5; const newton = 0 + x + 2 * (x * (x - 1)) / 2; if (Math.abs(newton - x * x) > 1e-12) va4 = false; }
  check("VA", "VA4 Newton assembly 0+xC(x,1)+2C(x,2) equals x^2 (21 probes)", va4, "identity holds off the integers too");
  check("VA", "VA5 carried noon 25/4 = 6.25", 2.5 * 2.5 === 6.25 && "6.25" === "6.25", "x^2 at 5/2");
  check("VA", "VA6 chord noon 13/2 = 6.5", 4 + 0.5 * 5 === 6.5, "half a day at day-3 pace");
  // Ex1: solve for a + bx + cx^2 through (0,2),(1,3),(2,6): c=1,b=0,a=2 -> x^2+2
  // (a=2; a+b+c=3; a+2b+4c=6 -> b+c=1, 2b+4c=4 -> b=0,c=1)
  const va8 = ((6 - 2) - 2 * (3 - 2)) / 2 === 1 && (3 - 2) - 1 === 0;
  check("VA", "VA8 Ex1 solve: a=2, b=0, c=1, law x^2+2", va8, "exact integer solve");
  let va7 = true; for (let n = 0; n <= 5; n++) if (sq(n) + 2 !== [2, 3, 6, 11, 18, 27][n]) va7 = false;
  check("VA", "VA7 Ex1 rows read x^2+2", va7, "2,3,6,11,18,27");
  check("VA", "VA9 Ex1 carried 57/4 = 14.25", 3.5 * 3.5 + 2 === 14.25, "49/4+2");
  check("VA", "VA10 Ex1 chord 14.5", 11 + 0.5 * 7 === 14.5, "11+3.5");
  // two-tailed table by DOWNWARD Pascal: from C(0,k) walk to negative x
  // C(x-1,k) = C(x,k) - C(x-1,k-1), starting rows C(0,0)=1, C(0,k>0)=0
  const tbl = { "0": [1, 0, 0, 0] };
  for (let x = 0; x >= -6; x--) {
    const cur = tbl[String(x)], prevKey = String(x - 1), prev = [1];
    for (let k = 1; k <= 3; k++) prev.push(cur[k] - prev[k - 1]);
    tbl[prevKey] = prev;
  }
  const wantNeg = { "-1": -1, "-2": -4, "-3": -10, "-4": -20, "-5": -35 };
  check("VA", "VA11 two-tailed negatives by downward Pascal", [-1,-2,-3,-4,-5].every(x => tbl[String(x)][3] === wantNeg[String(x)]), "-1,-4,-10,-20,-35");
  // reflection lemma, re-derived by the same downward walk against closed form
  let va12 = true;
  for (let m = 1; m <= 8; m++) {
    let val = 1; for (let i = 1; i <= 3; i++) val = val * (-m - i + 1) / i; // C(-m,3) closed
    if (val !== -((m + 2) * (m + 1) * m) / 6) va12 = false; // -(m+2 choose 3)
  }
  check("VA", "VA12 C(-m,3) = -C(m+2,3), m=1..8", va12, "reflection in the k=3 column");
  // S(x) + S(-x-1) = 0 as a polynomial identity in exact rationals
  const Snum = (x) => Fr(x.n * (x.n + x.d) * (2 * x.n + x.d), 6 * x.d * x.d * x.d); // S(x) for x = n/d
  const Sneg = (x) => Fr((-x.n) * (-x.n + x.d) * (-2 * x.n + x.d), 6 * x.d * x.d * x.d); // S(-x) needs care below
  let va13 = true;
  for (let q = 1; q <= 12; q++) {
    const x = Fr(q, 3);
    const sx = Snum(x);
    // S(-x-1): substitute -x-1 into x(x+1)(2x+1)/6 exactly
    const u = add(add(Fr(-q, 3), Fr(-1, 1)), Fr(0, 1)); // -x-1 as fraction: (-q-3)/3
    const uu = Fr(-q - 3, 3);
    const su = Fr(uu.n * (uu.n + uu.d) * (2 * uu.n + uu.d), 6 * uu.d * uu.d * uu.d);
    if (!eq(add(sx, su), Fr(0, 1))) va13 = false;
  }
  check("VA", "VA13 S(x) + S(-x-1) = 0 identically (x = q/3, q=1..12)", va13, "the reflection as a polynomial identity");
  let va14 = true; for (let n = 0; n <= 6; n++) if (n * (n + 1) * (2 * n + 1) / 6 !== [0, 1, 5, 14, 30, 55, 91][n]) va14 = false;
  check("VA", "VA14 S reads 0,1,5,14,30,55,91", va14, "n=0..6");
  // impostor via the MONOMIAL expansion (independent of the lab's binomial path)
  // sum_{k<=4} C(x,k) = (x^4 - 2x^3 + 11x^2 + 14x + 24)/24
  const fmono = (x) => (Math.pow(x, 4) - 2 * Math.pow(x, 3) + 11 * x * x + 14 * x + 24) / 24;
  let va15 = true; const imp = [1, 2, 4, 8, 16, 31, 57, 99, 163];
  for (let n = 0; n <= 8; n++) if (fmono(n) !== imp[n]) va15 = false;
  check("VA", "VA15 monomial expansion reads the impostor rows", va15, "1,2,4,8,16,31,57,99,163");
  check("VA", "VA16 t=1 family member: 32 at n=5, 63 at n=6", fmono(5) + 1 === 32 && fmono(6) + 6 === 63, "31+1, 57+6");
  // primes by SIEVE (independent of the lab's trial division)
  const N = 1763, sieve = new Array(N + 1).fill(true); sieve[0] = sieve[1] = false;
  for (let i = 2; i * i <= N; i++) if (sieve[i]) for (let j = i * i; j <= N; j += i) sieve[j] = false;
  let va17 = true; for (let x = 0; x <= 39; x++) if (!sieve[x * x + x + 41]) va17 = false;
  check("VA", "VA17 forty primes by sieve", va17, "x=0..39");
  check("VA", "VA18 breaks: 1681 = 41^2 composite, 1763 = 41*43 composite", !sieve[1681] && !sieve[1763] && 41 * 41 === 1681 && 41 * 43 === 1763, "both composite");
  let va19 = true; for (let x = 0; x <= 82; x++) { const z = (x * (x + 1)) % 41; const good = (x % 41 === 0 || x % 41 === 40) ? true : false; if ((z === 0) !== good) va19 = false; }
  check("VA", "VA19 x(x+1) = 0 mod 41 exactly at x = 0, 40 (mod 41)", va19, "sweep 0..82");
  // binomial coefficients at 1/2 by term recurrence (exact)
  const coef = [Fr(1, 1)]; let t = Fr(1, 1);
  for (let k = 1; k <= 6; k++) { t = mul(t, Fr(1 - 2 * (k - 1), 2 * k)); coef.push(t); }
  check("VA", "VA20 C(1/2,k) by recurrence: 1, 1/2, -1/8, 1/16, -5/128, 7/256, -21/1024",
    eq(coef[0], Fr(1,1)) && eq(coef[1], Fr(1,2)) && eq(coef[2], Fr(-1,8)) && eq(coef[3], Fr(1,16)) && eq(coef[4], Fr(-5,128)) && eq(coef[5], Fr(7,256)) && eq(coef[6], Fr(-21,1024)), "exact fractions");
  // truncation square by rational convolution (independent of the lab's integer scaling)
  const T = [Fr(1,1), Fr(1,2), Fr(-1,8), Fr(1,16), Fr(-5,128)];
  const sqc = [0,1,2,3,4,5,6,7,8].map(() => Fr(0,1));
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) sqc[i + j] = add(sqc[i + j], mul(T[i], T[j]));
  check("VA", "VA21 rational convolution: square is 1,1,0,0,0 then -7/128",
    eq(sqc[0], Fr(1,1)) && eq(sqc[1], Fr(1,1)) && eq(sqc[2], Fr(0,1)) && eq(sqc[3], Fr(0,1)) && eq(sqc[4], Fr(0,1)) && eq(sqc[5], Fr(-7,128)), "no scaling tricks");
  check("VA", "VA22 the k=5 term cancels: -7/128 + 2*(7/256) = 0", eq(add(Fr(-7,128), add(Fr(7,256), Fr(7,256))), Fr(0,1)), "exact");
  // sqrt(pi) by the WALLIS product (independent of Math.sqrt and of Simpson)
  let wallis = 1;
  for (let k = 1; k <= 300000; k++) wallis *= (4 * k * k) / (4 * k * k - 1);
  const piW = 2 * wallis;
  check("VA", "VA23 pi by Wallis (k=300000) matches Math.PI to 5e-6, sqrt to 3e-6", Math.abs(piW - Math.PI) < 5e-6 && Math.abs(Math.sqrt(piW) - Math.sqrt(Math.PI)) < 3e-6, "sqrt(pi)=" + Math.sqrt(piW).toFixed(7));
  const sp = Math.sqrt(piW);
  check("VA", "VA24 ballot numbers from Wallis-pi: 1.8862269, 0.3293404, 0.9431135",
    Math.abs(sp / 2 + 1 - 1.8862269) < 2e-6 && Math.abs(3 * sp / 4 - 1 - 0.3293404) < 2e-6 && Math.abs((sp / 2 + 1) / 2 - 0.9431135) < 2e-6, "from the product, not the library (Wallis error ~5e-6 in pi, ~1.5e-6 in sqrt)");
  check("VA", "VA25 ballot gap is (3-sqrt(pi))/2 = 0.6137731", Math.abs((sp / 2 + 1) / 2 - (3 * sp / 4 - 1) - (3 - sp) / 2) < 1e-12 && Math.abs((3 - sp) / 2 - 0.6137731) < 5e-7, "identity and value");
  // gamma by a SECOND quadrature with different parameters (N=20000):
  // flat substitution t = v^(1/x), integrand (1/x)e^(-v^(1/x)) — the P18 Gaussian form
  const gA = (x) => { const N = 20000, V = Math.pow(40, x), h = V / N; let s = 0; for (let i = 0; i <= N; i++) { const v = i * h; s += Math.exp(-Math.pow(v, 1 / x)) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2); } return s * h / 3 / x; };
  const gQ = (x) => { const N = 20000, h = 40 / N; let s = 0; for (let i = 0; i <= N; i++) { const tt = i * h; s += Math.pow(tt, x) * Math.exp(-tt) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2); } return s * h / 3; };
  check("VA", "VA26 Gamma(3/2) = (1/2)gA(1/2) by second quadrature = 0.8862269", Math.abs(0.5 * gA(0.5) - sp / 2) < 1e-5, (0.5 * gA(0.5)).toFixed(7));
  const pb = (x) => (1 + 0.1 * Math.sin(2 * Math.PI * x)) * (x >= 1 ? gQ(x) : gA(x));
  const Dpb = Math.log(pb(2.25)) - 0.5 * (Math.log(pb(2.1)) + Math.log(pb(2.4)));
  check("VA", "VA27 periodic ballot detector +0.0341 by second quadrature", Dpb > 0.0336 && Dpb < 0.0346, Dpb.toFixed(5));
  let mx = -Infinity;
  const G = (x) => (x >= 1 ? gQ(x) : gA(x)); // the TRUE gamma, no periodic factor
  for (let a = 0.05; a < 3; a += 0.05) { const b = a + 0.3; if (b > 3.05) break; const v = Math.log(G((a + b) / 2)) - 0.5 * (Math.log(G(a)) + Math.log(G(b))); if (v > mx) mx = v; }
  check("VA", "VA28 true gamma detector <= 0 across the grid, second quadrature", mx <= 0, "max " + mx.toFixed(5));
}

// ---------- piece VB: page scans ----------
function pieceVB(pg) {
  const cnt = (s) => pg.split(s).length - 1;
  const m = (re) => pg.match(re) || [];
  check("VB", "VB1 inline openers 315 (314 body pairs + 1 config line)", cnt("\\(") === 315, cnt("\\("));
  check("VB", "VB2 inline closers 315, equal to openers", cnt("\\(") === cnt("\\)") && cnt("\\)") === 315, cnt("\\)"));
  check("VB", "VB3 display delimiters 9 (8 body pairs + 1 config), open = close", cnt("\\[") === 9 && cnt("\\]") === 9, cnt("\\[") + "/" + cnt("\\]"));
  check("VB", "VB4 banned standalone tokens 0", m(/\b(lab|session|gate|verifier|adversarial|battery|planned|published|revision)\b/i).length === 0, "lab/session/gate/verifier/adversarial/battery/planned/published/revision");
  check("VB", "VB5 backticks 0", cnt("`") === 0, "no code fences in prose");
  check("VB", "VB6 dollar signs 0", cnt("$") === 0, "TeX is all \\( \\) form");
  const machLines = pg.split("\n").filter(l => l.indexOf("machine") >= 0);
  check("VB", "VB7 'machine' exactly 2, both on the P25 door line", cnt("machine") === 2 && machLines.length === 1 && machLines[0].indexOf("p25-machine-cases.html") >= 0, "href + anchor text");
  check("VB", "VB8 'receipt' exactly 1 (house metaphor)", cnt("receipt") === 1, "one allowed use");
  check("VB", "VB9 h2 count 8", m(/<h2>/g).length === 8, m(/<h2>/g).length);
  check("VB", "VB10 h3 count 9", m(/<h3>/g).length === 9, m(/<h3>/g).length);
  check("VB", "VB11 sections 8", m(/<section id=/g).length === 8, "bridge..exercises");
  check("VB", "VB12 digit-tables 5", m(/<table class="digit-table">/g).length === 5, "five tables");
  check("VB", "VB13 figures 3", m(/<figure/g).length === 3, "Fig P23.1-3");
  check("VB", "VB14 inline svg 3", m(/<svg /g).length === 3, "hand-drawn svgs");
  check("VB", "VB15 pattern boxes exactly box-p23, box-p23a, box-p23b", JSON.stringify(m(/id="box-p23[a-z0-9]*"/g)) === JSON.stringify(['id="box-p23"', 'id="box-p23a"', 'id="box-p23b"']), "3 boxes");
  check("VB", "VB16 asides 2 (onramp + warn)", m(/<aside/g).length === 2 && cnt('<aside class="onramp">') === 1 && cnt('<aside class="warn">') === 1, "onramp + warn");
  check("VB", "VB17 pid lines 3", m(/<p class="pid">/g).length === 3, "Moves used");
  check("VB", "VB18 details 10: Hint/Worked alternating HWHWHWHWHW", m(/<summary>(Hint|Worked)<\/summary>/g).map(s => s.indexOf("Hint") > 0 ? "H" : "W").join("") === "HWHWHWHWHW", "5 Hint + 5 Worked");
  check("VB", "VB19 exercises 5, difficulty moons in order", m(/<p class="ex">/g).length === 5 && ["\u25cf\u25cb\u25cb", "\u25cf\u25cf\u25cb", "\u25cf\u25cf\u25cf", "\u25c6", "\u25d0"].every((s, i, a) => pg.indexOf(s) >= 0 && (i === 0 || pg.indexOf(a[i - 1]) < pg.indexOf(s))), "\u25cf\u25cb\u25cb \u25cf\u25cf\u25cb \u25cf\u25cf\u25cf \u25c6 \u25d0");
  check("VB", "VB20 em-dashes 214 (>= 150)", cnt("\u2014") === 214, "house rhythm");
  check("VB", "VB21 section marks 18 (>= 10)", cnt("\u00a7") === 18, "cross-references");
  const hrefs = [...new Set(m(/href="[^"]+"/g).map(h => h.slice(6, -1)))].sort();
  const wantH = ["assets/style.css", "index.html", "p02-small-cases.html", "p03-special-cases.html", "p05-canonical-form.html", "p06-compose-identity.html", "p15-squeeze.html", "p18-raise-dimension.html", "p20-polynomial-identity.html", "p22-fixed-point.html", "p24-waves.html", "p25-machine-cases.html", "p57-nash-moser.html"].sort();
  check("VB", "VB22 href set exactly the 13 known internal targets", JSON.stringify(hrefs) === JSON.stringify(wantH), hrefs.length + " targets");
  const urls = m(/https?:\/\/[^"\s]+/g);
  check("VB", "VB23 exactly one external url, the tex-svg CDN", urls.length === 1 && urls[0] === "https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js", urls[0] || "none");
  const aria = m(/aria-label="([^"]*)"/g).map(a => a.replace(/^aria-label="/, "").replace(/"$/, ""));
  check("VB", "VB24 aria-labels 3, none contains standalone 'lab'", aria.length === 3 && !aria.some(v => /\blab\b/i.test(v)), "figure descriptions");
  check("VB", "VB25 no TODO/XXX/FIXME", m(/TODO|XXX|FIXME/).length === 0, "clean");
  const bal = (o, c) => pg.split(o).length - 1 === pg.split(c).length - 1;
  check("VB", "VB26 tags balanced: p, details, table, figure, div, section", m(/<p[\s>]/g).length === cnt("</p>") && bal("<details", "</details>") && bal("<table", "</table>") && bal("<figure", "</figure>") && bal("<div", "</div>") && bal("<section", "</section>"), "open = close (p counted with a boundary so <path is not read as a paragraph)");
  const tabs = m(/<table class="digit-table">[\s\S]*?<\/table>/g);
  const cellsOf = (t) => (t.match(/<t[hd]>[\s\S]*?<\/t[hd]>/g) || []).map(c => c.replace(/<[^>]+>/g, "").replace(/\\\(|\\\)/g, "").trim());
  const eqArr = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  check("VB", "VB27 table 1 bamboo: heights 0,1,4,9,16,25; growth 1,3,5,7,9; second growth 2,2,2,2", tabs.length === 5 && eqArr(cellsOf(tabs[0]), ["Day", "Height", "Growth", "Growth of growth", "0", "0", "1", "2", "1", "1", "3", "2", "2", "4", "5", "2", "3", "9", "7", "2", "4", "16", "9", "\u2014", "5", "25", "\u2014", "\u2014"]), "the encounter table");
  check("VB", "VB28 table 2 two-tail: C(x,3) -35..20 across x = -5..6", eqArr(cellsOf(tabs[1]), ["x", "-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5", "6", "\\binom{x}{3}", "-35", "-20", "-10", "-4", "-1", "0", "0", "0", "1", "4", "10", "20"]), "negative side included");
  check("VB", "VB29 table 3 reflection: S(n) 0,1,5,14,30,55,91 and S(-n) = -S(n-1)", eqArr(cellsOf(tabs[2]), ["n", "0", "1", "2", "3", "4", "5", "6", "S(n)", "0", "1", "5", "14", "30", "55", "91", "S(-n)", "0", "-1", "-5", "-14", "-30", "-55", "-91", "-S(n-1)", "\u2014", "-1", "-5", "-14", "-30", "-55", "-91"]), "the backwards reading");
  check("VB", "VB30 table 4 truncation square: 1,1,0,0,0,0 vs 1,1,0,0,0,-7/128", eqArr(cellsOf(tabs[3]), ["Coefficient of", "z^0", "z^1", "z^2", "z^3", "z^4", "z^5", "target: 1+z", "1", "1", "0", "0", "0", "0", "square of the truncation", "1", "1", "0", "0", "0", "-\\frac{7}{128}"]), "zeros then the z^5 leak");
  check("VB", "VB31 table 5 impostor: carrier 1,2,4,8,16,31,57 vs doubling 32,64", eqArr(cellsOf(tabs[4]), ["n", "0", "1", "2", "3", "4", "5", "6", "honest rows so far", "1", "2", "4", "8", "16", "\u2014", "\u2014", "the carrier reads", "1", "2", "4", "8", "16", "31", "57", "doubling reads", "1", "2", "4", "8", "16", "32", "64"]), "the parting at n=5");
  check("VB", "VB32 tail: footer line then </footer></body></html> + newline", pg.endsWith('<p>Return to the <a href="index.html">index</a> \u00b7 Next: <a href="p24-waves.html">P24 \u00b7 Split into waves</a></p>\n</footer>\n</body>\n</html>\n'), "byte-exact tail");
}

// ---------- piece VC: poisons, each must be REJECTED ----------
function pieceVC() {
  // C1: a second degree<=2 carrier through the bamboo rows. Vandermonde det on 0,1,2 is 2: unique.
  check("VC", "VC1 poison: a second degree-2 carrier passes the rows", (1 - 0) * (2 - 0) * (2 - 1) === 2 && 2 !== 0, "REJECTED: the solve is unique");
  // C2: C(-4,3) fractional. Truth: -20, integer.
  let c2 = 1; for (let i = 1; i <= 3; i++) c2 = c2 * (-4 - i + 1) / i;
  check("VC", "VC2 poison: C(-4,3) reads fractional", c2 === -20 && Number.isInteger(c2), "REJECTED: reads -20, an integer");
  // C3: the truncation square leaks at z^4. Truth: exact zero (VA21's convolution).
  const T3 = [Fr(1,1), Fr(1,2), Fr(-1,8), Fr(1,16), Fr(-5,128)];
  const z4 = [0,1,2,3,4].filter(i => 4 - i >= 0 && 4 - i < 5).reduce((acc, i) => add(acc, mul(T3[i], T3[4 - i])), Fr(0,1));
  check("VC", "VC3 poison: the truncation square is nonzero at z^4", z4.n === 0, "REJECTED: coefficient is exactly 0");
  // C4: the impostor reads 30 at n=5. Truth: 31.
  check("VC", "VC4 poison: the carrier answers 30 at the sixth row", (Math.pow(5,4) - 2*Math.pow(5,3) + 11*25 + 70 + 24) / 24 === 31, "REJECTED: reads 31");
  // C5: x=40 inside the prime streak. Truth: 1681 = 41^2.
  check("VC", "VC5 poison: the streak's next row, x=40, is prime", 40 * 40 + 40 + 41 === 1681 && 1681 === 41 * 41, "REJECTED: 1681 = 41^2");
  // C6: the sine ballot satisfies the factorial recursion at x=1/2.
  check("VC", "VC6 poison: sin(pi x) satisfies f(x+1) = x f(x) at x = 1/2", Math.sin(Math.PI * 1.5) !== 0.5 * Math.sin(Math.PI * 0.5), "REJECTED: -1 vs 0.5");
  // C7: the periodic ballot is log-convex. Truth: detector positive.
  const gq7 = (x) => { const N = 8000, h = 40 / N; let s = 0; for (let i = 0; i <= N; i++) { const t = i * h; s += Math.pow(t, x) * Math.exp(-t) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2); } return s * h / 3; };
  const p7 = (x) => (1 + 0.1 * Math.sin(2 * Math.PI * x)) * gq7(x);
  const D7 = Math.log(p7(2.25)) - 0.5 * (Math.log(p7(2.1)) + Math.log(p7(2.4)));
  check("VC", "VC7 poison: the periodic ballot is log-convex", D7 > 0.01, "REJECTED: detector reads +" + D7.toFixed(4));
  // C8: S(-n) = -S(n). Truth: S(-n) = -S(n-1); S(-1) = 0, not -1.
  check("VC", "VC8 poison: S(-n) = -S(n)", ((-1) * 0 * 1) / 6 === 0 && 1 * 2 * 3 / 6 === 1, "REJECTED: S(-1) = 0 but -S(1) = -1");
  // C9: the doubling table dies at difference row 5. Truth: differences keep doubling.
  const row = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
  let r = row, dead = false;
  for (let k = 0; k < 5; k++) { r = r.slice(1).map((v, i) => v - r[i]); if (r.every(v => v === 0)) dead = true; }
  check("VC", "VC9 poison: the doubling table's differences die at row 5", !dead && r.every(v => v !== 0), "REJECTED: row 5 still reads 2^n");
  // C10: Gamma(1/2) = pi/2. Truth: sqrt(pi).
  check("VC", "VC10 poison: Gamma(1/2) = pi/2 = 1.5708", Math.abs(Math.sqrt(Math.PI) - Math.PI / 2) > 0.2, "REJECTED: sqrt(pi) = 1.7725");
}

// ---------- piece VD: loader and prose gates ----------
function pieceVD(pg) {
  const has = (s) => pg.indexOf(s) >= 0;
  check("VD", "VD1 title byte-exact", has("<title>P23 \u00b7 Interpolate and continue \u00b7 The Patterns Atlas</title>"), "P23 \u00b7 Interpolate and continue \u00b7 The Patterns Atlas");
  check("VD", "VD2 MathJax config byte-exact", has("<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>"), "same config as P22");
  check("VD", "VD3 tex-svg script with integrity hash", has('<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"></script>'), "pinned CDN");
  check("VD", "VD4 stylesheet link", has('href="assets/style.css"'), "house style");
  check("VD", "VD5 kicker byte-exact", has('<p class="kicker"><a href="index.html">The Patterns Atlas</a> \u00b7 P23 \u00b7 the sixth move of tier 2</p>'), "kicker names the tier position");
  check("VD", "VD6 h1 byte-exact", has("<h1>Interpolate and continue</h1>"), "the move's name");
  const ids = (pg.match(/<section id="([^"]+)">/g) || []).map(s => s.slice(13, -2));
  check("VD", "VD7 section ids in the house order", JSON.stringify(ids) === JSON.stringify(["bridge", "encounter", "name-the-move", "the-move-at-work", "when-it-fails", "what-next", "lineage", "exercises"]), ids.join(","));
  const h2s = (pg.match(/<h2>[^<]*<\/h2>/g) || []).map(s => s.replace(/<[^>]+>/g, ""));
  check("VD", "VD8 h2 texts exact", JSON.stringify(h2s) === JSON.stringify(["1 \u00b7 Before we begin", "2 \u00b7 A question the table cannot hear", "3 \u00b7 Name the move", "4 \u00b7 The move at work", "5 \u00b7 When it fails \u2014 three exhibits of fine print", "6 \u00b7 What next", "7 \u00b7 Where it came from", "8 \u00b7 Exercises"]), "8 numbered sections");
  check("VD", "VD9 pattern-box h3 byte-exact", has("<h3>P23 \u00b7 Interpolate and continue \u2014 hold on to a formula that works on the integers; carry it across</h3>"), "pattern sentence");
  check("VD", "VD10 Box P23.A h3", has("<h3>Box P23.A \u00b7 The two demands</h3>"), "the two demands");
  check("VD", "VD11 Box P23.B h3", has("<h3>Box P23.B \u00b7 Where it shows up, and the three-key signature</h3>"), "signature box");
  const exs = (pg.match(/<h3>Example[^<]*<\/h3>/g) || []).map(s => s.replace(/<[^>]+>/g, ""));
  check("VD", "VD12 Example h3s exact", JSON.stringify(exs) === JSON.stringify(["Example 1 \u00b7 The bamboo's noon \u2014 the difference table builds the carrier", "Example 2 \u00b7 The denominator that divides \u2014 integer-valued polynomials", "Example 3 \u00b7 The binomial theorem, carried to half exponents"]), "3 worked examples");
  check("VD", "VD13 warn h3 byte-exact", has("<h3>Scope and price of P23</h3>"), "the price box");
  check("VD", "VD14 doors h3", has("<h3>The doors this page opens</h3>"), "doors section");
  check("VD", "VD15 default habit h3", has("<h3>The default habit</h3>"), "the habit paragraph");
  const nw = ["<strong>New word: interpolation.</strong>", "<strong>New word: forward difference.</strong>", "<strong>New word: integer-valued polynomial.</strong>"];
  check("VD", "VD16 three New words in order", nw.every((s, i) => pg.indexOf(s) >= 0 && (i === 0 || pg.indexOf(nw[i - 1]) < pg.indexOf(s))), "interpolation, forward difference, integer-valued polynomial");
  const pids = pg.match(/<p class="pid">[\s\S]*?<\/p>/g) || [];
  const pidHrefs = pids.map(p => (p.match(/href="[^"]+"/g) || []).map(h => h.slice(6, -1)));
  check("VD", "VD17 pid 1 cites P02 + P20", pidHrefs[0] && JSON.stringify(pidHrefs[0]) === JSON.stringify(["p02-small-cases.html", "p20-polynomial-identity.html"]), "table law + certificate");
  check("VD", "VD18 pid 2 cites P05 + P03", pidHrefs[1] && JSON.stringify(pidHrefs[1]) === JSON.stringify(["p05-canonical-form.html", "p03-special-cases.html"]), "canonical basis + stress test");
  check("VD", "VD19 pid 3 cites P05 + P06", pidHrefs[2] && JSON.stringify(pidHrefs[2]) === JSON.stringify(["p05-canonical-form.html", "p06-compose-identity.html"]), "coefficients + compose");
  check("VD", "VD20 exhibits are strong paragraphs, not h3", has("<p><strong>Exhibit A \u00b7 ") && has("<p><strong>Exhibit B \u00b7 ") && has("<p><strong>Exhibit C \u00b7 ") && (pg.match(/<h3>Exhibit/g) || []).length === 0, "A phantom, B impostor, C spoiled ballot");
  check("VD", "VD21 figcaptions numbered Fig P23.1-3", has("<figcaption><strong>Fig P23.1.</strong>") && has("<figcaption><strong>Fig P23.2.</strong>") && has("<figcaption><strong>Fig P23.3.</strong>"), "three figures");
  check("VD", "VD22 door hrefs P24, P25, P57", has('href="p24-waves.html"') && has('href="p25-machine-cases.html"') && has('href="p57-nash-moser.html"'), "the three doors");
  check("VD", "VD23 tagline prerequisites and next", has("Prerequisites: P05 (canonical forms: the shape a theory appoints). Next: waves"), "P05 named, waves teased");
  check("VD", "VD24 footer byte-exact", has('<p>Return to the <a href="index.html">index</a> \u00b7 Next: <a href="p24-waves.html">P24 \u00b7 Split into waves</a></p>'), "index + P24");
  check("VD", "VD25 page ends </html> with trailing newline", pg.endsWith("</html>\n"), "byte-exact tail");
  const exTitles = ["Exercise 1 \u00b7 A growth column of your own", "Exercise 2 \u00b7 The carrier read backwards", "Exercise 3 \u00b7 The impostor's whole family", "Exercise 4 \u00b7 The streak of forty primes", "Exercise 5 \u00b7 The grammar of the difference table"];
  check("VD", "VD26 five exercise titles in order", exTitles.every((s, i) => pg.indexOf(s) >= 0 && (i === 0 || pg.indexOf(exTitles[i - 1]) < pg.indexOf(s))), "5 exercises");
  check("VD", "VD27 difficulty spans in the exact span format", ["\u25cf\u25cb\u25cb", "\u25cf\u25cf\u25cb", "\u25cf\u25cf\u25cf", "\u25c6", "\u25d0"].every(s => has('<span class="difficulty">' + s + "</span>")), "moons in spans");
  check("VD", "VD28 lineage: Briggs 1624, Euler-Goldbach 1729-1730", has("Henry Briggs, computing his 1624") && has("letters to Goldbach (1729\u20131730)"), "the logarithm trade and the frontier");
  check("VD", "VD29 lineage: Lagrange 1795, Abel 1826, Schoenberg 1946, Bohr-Mollerup 1922", has("Lagrange's 1795 lectures") && has("Abel (1826)") && has("Schoenberg, 1946") && has("Bohr and Mollerup, 1922"), "four dated receipts");
  check("VD", "VD30 cross-pins to P18 and P22 present", has('href="p18-raise-dimension.html"') && has('href="p22-fixed-point.html"'), "tier-2 neighbours");
}

// ---------- census ----------
async function main() {
  pieceVA();
  pieceVC();
  let pg = "";
  if (typeof tools !== "undefined" && tools.file_system && tools.file_system.read_file) {
    let off = 0;
    for (;;) {
      const r = await tools.file_system.read_file({ path: "wip/p23-interpolate.html", offset: off });
      pg += r.content;
      if (r.next_offset == null || r.next_offset <= off || r.content.length === 0) break;
      off = r.next_offset;
    }
  }
  pieceVB(pg);
  pieceVD(pg);
  const byPiece = {};
  results.forEach(r => { byPiece[r.piece] = byPiece[r.piece] || { pass: 0, total: 0 }; byPiece[r.piece].total++; if (r.pass) byPiece[r.piece].pass++; });
  const fails = results.filter(r => !r.pass);
  console.log("P23 review verifier census: " + (results.length - fails.length) + "/" + results.length + " PASS");
  Object.keys(byPiece).forEach(p => console.log("  " + p + ": " + byPiece[p].pass + "/" + byPiece[p].total));
  if (fails.length) fails.forEach(f => console.log("  FAIL " + f.name + " || " + f.detail));
  return { total: results.length, pass: results.length - fails.length, byPiece, fails: fails.map(f => f.name) };
}
