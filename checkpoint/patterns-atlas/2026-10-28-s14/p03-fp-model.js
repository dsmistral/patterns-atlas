// labs/p03-format-pass.js — P03 formatting retrofit pass (R1) verifier, session S13.
// Fresh engine, zero shared code with the R0 lab: every numeric claim on the page
// re-verified against the R0 receipts, plus TeX and SVG sanity.
// Engine constraint: runs as recorded transcript pieces (<= 4KB each), concatenated
// in order (P1, P1b, P2..P9). Honest run history: P1 run 1 aborted on a file-reader
// result-shape mismatch before any check ran (the reader now accepts text at
// resource.text / text / content); P1's coordinate-bounds pass used an attribute-key
// regex that skipped digit-bearing names (x1/y1/x2/y2), so the bounds check was
// re-run corrected and is recorded as P1b; both aborted runs produced no check
// output and no check ever failed. P1..P8 ran against the pre-fill page (the
// run-history placeholder still present, expected count 1); P9 is the post-fill
// re-check of the final page. Every mathematical piece ran clean on run 1.

// ---- P1: page/TeX/SVG structural sanity ----
async function piece1() {
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.text ?? r.content ?? String(r);
  };
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  const page = await read("book/p03-special-cases.html");
  const fig1 = await read("labs-src/fig-p03-1.svg");
  const fig2 = await read("labs-src/fig-p03-2.svg");
  const cnt = (s: string, m: string) => s.split(m).length - 1;
  p("P1: page/TeX/SVG structural sanity");
  p("page bytes=" + page.length + " (expect 34246)");
  p("inline-open \\( = " + cnt(page, "\\(") + " (expect 156)");
  p("inline-close \\) = " + cnt(page, "\\)") + " (expect 156)");
  p("display-open \\[ = " + cnt(page, "\\[") + " (expect 2)");
  p("display-close \\] = " + cnt(page, "\\]") + " (expect 2)");
  p("dollar-pairs $$ = " + cnt(page, "$$") + " (expect 0)");
  p("sections = " + cnt(page, "</section>") + " (expect 9), figures = " + cnt(page, "<figure") + " (expect 3), figcaptions = " + cnt(page, "<figcaption>") + " (expect 3)");
  p("svg = " + cnt(page, "<svg") + " (expect 2), eq = " + cnt(page, 'class="eq"') + " (expect 1), </html> = " + cnt(page, "</html>") + " (expect 1)");
  p("placeholder count = " + cnt(page, "RUNHISTORY_PLACEHOLDER") + " (expect 1)");
  const cfg = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
  p("config line byte-exact = " + page.includes(cfg));
  const body = page.replace(cfg, "");
  let bal = true, open = false;
  for (let i = 0; i < body.length - 1; i++) {
    if (body[i] === "\\" && body[i+1] === "(") { if (open) { bal = false; } open = true; }
    if (body[i] === "\\" && body[i+1] === ")") { if (!open) { bal = false; } open = false; }
  }
  p("inline delimiters alternate correctly = " + bal + ", dangling open = " + open);
  for (const nm of ["fig1", "fig2"]) {
    const f = nm === "fig1" ? fig1 : fig2;
    const vb = f.match(/viewBox="0 0 (\d+) (\d+)"/);
    p(nm + ": viewBox = " + (vb ? vb[1] + "x" + vb[2] : "MISSING") + ", href/xlink refs = " + (cnt(f, "href") + cnt(f, "xlink")) + " (expect 0)");
    // coordinate bounds, run 1 — the key regex below only matches letter-only attribute
    // names, so x1/y1/x2/y2 were skipped (10 and 30 coords found); P1b is the corrected
    // re-run and supersedes this count.
    const W = Number(vb[1]), H = Number(vb[2]);
    let inb = true, ncoord = 0, worst = 0;
    const re = /(?:^|\s)([a-z]+)="(-?[\d.]+)"/g;
    let m3: any;
    while ((m3 = re.exec(f)) !== null) {
      const k = m3[1], v = Number(m3[2]);
      if (["x","y","cx","cy","x1","x2","y1","y2"].indexOf(k) < 0) continue;
      const lim = (k === "y" || k === "cy" || k === "y1" || k === "y2") ? H : W;
      ncoord++;
      const d = v < 0 ? -v : (v > lim ? v - lim : 0);
      if (d > worst) worst = d;
      if (d > 0.05) inb = false;
    }
    p(nm + ": " + ncoord + " xy-coords checked, all within viewBox bounds (+/-0.05) = " + inb + ", worst excursion = " + worst.toFixed(3));
  }
  return out;
}

// ---- P1b: SVG coordinate bounds (digit keys included — corrected re-run) ----
async function piece1b() {
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.text ?? r.content ?? String(r);
  };
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P1b: SVG coordinate bounds (digit keys included)");
  for (const nm of ["fig1", "fig2"]) {
    const f = await read("labs-src/fig-p03-" + (nm === "fig1" ? "1" : "2") + ".svg");
    const vb = f.match(/viewBox="0 0 (\d+) (\d+)"/);
    const W = Number(vb[1]), H = Number(vb[2]);
    let inb = true, ncoord = 0, worst = 0;
    const re = /([a-z0-9]+)="(-?[\d.]+)"/g;
    let m: any;
    while ((m = re.exec(f)) !== null) {
      const k = m[1], v = Number(m[2]);
      if (["x","y","cx","cy","x1","x2","y1","y2"].indexOf(k) < 0) continue;
      const lim = (k === "y" || k === "cy" || k === "y1" || k === "y2") ? H : W;
      ncoord++;
      const d = v < 0 ? -v : (v > lim ? v - lim : 0);
      if (d > worst) worst = d;
      if (d > 0.05) inb = false;
    }
    p(nm + ": viewBox " + W + "x" + H + ", " + ncoord + " xy-coords, in bounds (+/-0.05) = " + inb + ", worst excursion = " + worst.toFixed(3));
  }
  return out;
}

// ---- P2: Fig P03.1 geometry + region counts (grid-signature) ----
async function piece2() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P2: Fig P03.1 geometry + region counts (grid-signature)");
  const Li = [[[200,110],[20,110]], [[155,187.94],[65,32.06]], [[65,187.94],[155,32.06]]];
  const Lii = [[[261.37,125.63],[427.94,65]], [[365.63,198.63],[319.22,25.43]], [[423.72,161.62],[265.43,79.22]]];
  const onCircle = (L: number[][][], cx: number, cy: number, r: number) => {
    let worst = 0;
    for (const [a, b] of L) for (const pt of [a, b]) {
      const d = Math.hypot(pt[0]-cx, pt[1]-cy);
      worst = Math.max(worst, Math.abs(d - r));
    }
    return worst;
  };
  p("panel(i): worst |endpoint-dist - 90| = " + onCircle(Li, 110, 110, 90).toFixed(4) + " (tol 0.05, rounding)");
  p("panel(ii): worst |endpoint-dist - 90| = " + onCircle(Lii, 350, 110, 90).toFixed(4) + " (tol 0.05)");
  let worstC = 0;
  for (const [a, b] of Li) {
    const d = Math.abs((b[0]-a[0])*(110-a[1]) - (b[1]-a[1])*(110-a[0])) / Math.hypot(b[0]-a[0], b[1]-a[1]);
    worstC = Math.max(worstC, d);
  }
  p("panel(i): worst distance of center (110,110) from the 3 lines = " + worstC.toFixed(4) + " (concurrent; tol 0.02)");
  const cross = (a: number[], b: number[], c: number[], d: number[]) => {
    const d1 = (b[0]-a[0])*(d[1]-c[1]) - (b[1]-a[1])*(d[0]-c[0]);
    if (Math.abs(d1) < 1e-9) return null;
    const t = ((c[0]-a[0])*(d[1]-c[1]) - (c[1]-a[1])*(d[0]-c[0])) / d1;
    return [a[0] + t*(b[0]-a[0]), a[1] + t*(b[1]-a[1])];
  };
  const Xs: number[][] = [];
  for (let i = 0; i < 3; i++) {
    const [a, b] = Lii[i]; const [c, d] = Lii[(i+1) % 3];
    const x = cross(a, b, c, d);
    Xs.push(x);
    p("panel(ii): crossing " + (i+1) + " at (" + x[0].toFixed(2) + ", " + x[1].toFixed(2) + "), dist from center = " + Math.hypot(x[0]-350, x[1]-110).toFixed(2) + " (inside circle: " + (Math.hypot(x[0]-350, x[1]-110) < 90) + ")");
  }
  const sep = Math.min(Math.hypot(Xs[0][0]-Xs[1][0], Xs[0][1]-Xs[1][1]), Math.hypot(Xs[1][0]-Xs[2][0], Xs[1][1]-Xs[2][1]), Math.hypot(Xs[0][0]-Xs[2][0], Xs[0][1]-Xs[2][1]));
  p("panel(ii): min pairwise crossing separation = " + sep.toFixed(2) + "px (distinct crossings, no concurrency)");
  const countRegions = (L: number[][][], cx: number, cy: number, r: number, step: number) => {
    const sigs = new Set<string>();
    let inside = 0;
    const counts = new Map<string, number>();
    for (let x = cx - r + 0.25; x < cx + r; x += step) {
      for (let y = cy - r + 0.25; y < cy + r; y += step) {
        if (Math.hypot(x-cx, y-cy) >= r - 0.1) continue;
        inside++;
        let s = "";
        for (const [a, b] of L) {
          const c = (b[0]-a[0])*(y-a[1]) - (b[1]-a[1])*(x-a[0]);
          s += c > 0 ? "+" : "-";
        }
        sigs.add(s);
        counts.set(s, (counts.get(s) || 0) + 1);
      }
    }
    let minc = Infinity;
    for (const v of counts.values()) if (v < minc) minc = v;
    return { n: sigs.size, inside, minc };
  };
  const r1 = countRegions(Li, 110, 110, 90, 0.5);
  p("panel(i): distinct grid signatures = " + r1.n + " (expect 6); samples inside = " + r1.inside + ", min samples per region = " + r1.minc);
  const r2 = countRegions(Lii, 350, 110, 90, 0.5);
  p("panel(ii): distinct grid signatures = " + r2.n + " (expect 7); samples inside = " + r2.inside + ", min samples per region = " + r2.minc);
  return out;
}

// ---- P3: cut counts and handshake boundary vs R0 receipts ----
async function piece3() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P3: cut counts and handshake boundary vs R0 receipts");
  const conc = (n: number) => 2 * n;
  const gp = (n: number) => (n * n + n + 2) / 2;
  p("concurrent 2n, n=1..8: " + Array.from({length: 8}, (_, i) => conc(i+1)).join(",") + " (expect 2,4,6,8,10,12,14,16)");
  p("general position (n^2+n+2)/2, n=1..8: " + Array.from({length: 8}, (_, i) => gp(i+1)).join(",") + " (expect 2,4,7,11,16,22,29,37)");
  const agree: number[] = [];
  for (let n = 1; n <= 20; n++) if (conc(n) === gp(n)) agree.push(n);
  p("agreement of 2n and (n^2+n+2)/2 over n=1..20: n=" + agree.join(",") + " (expect exactly 1,2)");
  const hs = (n: number) => n * (n - 1) / 2;
  p("handshake n(n-1)/2 boundary: n=0 -> " + hs(0) + ", n=1 -> " + hs(1) + ", n=2 -> " + hs(2) + " (expect 0,0,1)");
  p("handshake fed n=-2 -> " + hs(-2) + " (expect 3, the meaningless value the page records)");
  return out;
}

// ---- P4: Mersenne claims vs R0 receipts ----
async function piece4() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P4: Mersenne claims vs R0 receipts");
  const vals = Array.from({length: 12}, (_, i) => Math.pow(2, i+1) - 1);
  p("2^n-1, n=1..12: " + vals.join(",") + " (expect 1,3,7,15,31,63,127,255,511,1023,2047,4095)");
  let divOK = true;
  const divDetail: string[] = [];
  for (const n of [4, 6, 8, 9, 10, 12]) {
    for (let d = 2; d < n; d++) {
      if (n % d !== 0) continue;
      const ok = (Math.pow(2, n) - 1) % (Math.pow(2, d) - 1) === 0;
      if (!ok) divOK = false;
      divDetail.push("(" + d + "|" + n + ":" + ok + ")");
    }
  }
  p("divisor rule 2^d-1 | 2^n-1 for every proper divisor d of n in {4,6,8,9,10,12}: " + divOK + " [" + divDetail.join(" ") + "]");
  p("kill n=4: 15 = 3 x 5 = " + (3 * 5) + " (expect 15)");
  p("kill n=11: 2047 = 23 x 89 = " + (23 * 89) + " (expect 2047)");
  const smallestFactor = (m: number) => {
    if (m < 2) return m;
    if (m % 2 === 0) return 2;
    for (let f = 3; f * f <= m; f += 2) if (m % f === 0) return f;
    return 0;
  };
  for (const q of [2, 3, 5, 7, 11, 13, 17, 19, 23]) {
    const m = Math.pow(2, q) - 1;
    const f = smallestFactor(m);
    p("p=" + q + ": 2^p-1 = " + m + (f === 0 ? " PRIME" : " = " + f + " x " + (m / f)));
  }
  p("product check: 47 x 178481 = " + (47 * 178481) + " (expect 8388607)");
  const isqrt = (m: number) => { let r = Math.floor(Math.sqrt(m)); while (r * r > m) r--; while ((r+1) * (r+1) <= m) r++; return r; };
  p("floor(sqrt(8388607)) = " + isqrt(8388607) + " (expect 2896; 2896^2=" + 2896*2896 + " <= 8388607 < 2897^2=" + 2897*2897 + ")");
  p("floor(sqrt(524287)) = " + isqrt(524287) + " (expect 724; 724^2=" + 724*724 + " <= 524287 < 725^2=" + 725*725 + ")");
  return out;
}

// ---- P5: Sophie Germain + average-speed claims vs R0 receipts ----
async function piece5() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P5: Sophie Germain + average-speed claims vs R0 receipts");
  let mism = 0;
  for (let n = 1; n <= 50; n++) {
    if (n*n*n*n + 4 !== (n*n - 2*n + 2) * (n*n + 2*n + 2)) mism++;
  }
  p("SG identity mismatches n=1..50: " + mism + " (expect 0)");
  p("n^4+4 at n=1..4: " + [1,2,3,4].map(n => Math.pow(n,4)+4).join(",") + " (expect 5,20,85,260)");
  p("at n=2 the factors read: " + (4-4+2) + " x " + (4+4+2) + " = " + ((4-4+2)*(4+4+2)) + " (page says 2 x 10 = 20)");
  p("first factor as (n-1)^2+1 at n=1: " + ((1-1)*(1-1)+1) + " (expect 1, the degenerate point)");
  const avg = (a: number, b: number) => 2 * a * b / (a + b);
  const cases: [number, number, number][] = [[30,60,40],[30,30,30],[30,90,45],[50,50,50],[40,60,48]];
  for (const [a, b, e] of cases) {
    const v = avg(a, b);
    p("avg(" + a + "," + b + ") = " + v + " (expect " + e + ", match = " + (v === e) + ")");
  }
  p("avg(30,3000) = " + avg(30,3000).toFixed(6) + " (page: 59.41)");
  p("avg(30,300000) = " + avg(30,300000).toFixed(6) + " (page: 59.994)");
  for (const d of [60, 120, 300]) {
    const v = 2 * d / (d / 30 + d / 60);
    p("simulation 2d/(d/30+d/60) at d=" + d + ": " + v + " km/h (expect 40)");
  }
  p("curve at b=60: avg(30,60) = " + avg(30, 60) + " (caption: passes through (60, 40) — exact = " + (avg(30,60) === 40) + ")");
  p("the tempting wrong answer: (30+60)/2 = " + ((30+60)/2) + ", true average 40 (45 never was)");
  let mono = true, below = true;
  let prev = -1;
  for (let b = 1; b <= 300000; b += 1) {
    const v = avg(30, b);
    if (v <= prev) mono = false;
    if (v >= 60) below = false;
    prev = v;
  }
  p("v(b)=60b/(30+b) strictly increasing over b=1..300000 sampled: " + mono);
  p("v(b) < 60 = 2a for every sampled b (algebraically: 60(30+b)-60b = 1800 > 0 always): " + below + " (caption: creeps towards asymptote without ever reaching it)");
  return out;
}

// ---- P6: lineage identities (Lander-Parkin, Cole) vs R0 receipts ----
async function piece6() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P6: lineage identities (Lander-Parkin, Cole) vs R0 receipts");
  const p5 = (n: number) => { let v = 1; for (let i = 0; i < 5; i++) v *= n; return v; };
  const lhs = p5(27) + p5(84) + p5(110) + p5(133);
  const rhs = p5(144);
  p("27^5=" + p5(27) + ", 84^5=" + p5(84) + ", 110^5=" + p5(110) + ", 133^5=" + p5(133));
  p("Lander-Parkin LHS sum = " + lhs + ", RHS 144^5 = " + rhs + ", equal = " + (lhs === rhs) + " (expect 61917364224, equal)");
  const mpow = (b: number, e: number, m: number) => { let r = 1, x = b % m; let ee = e; while (ee > 0) { if (ee & 1) r = (r * x) % m; x = (x * x) % m; ee = Math.floor(ee / 2); } return r; };
  for (const q of [1000003, 99991]) {
    const l = (mpow(27,5,q) + mpow(84,5,q) + mpow(110,5,q) + mpow(133,5,q)) % q;
    const r = mpow(144,5,q);
    p("mod " + q + ": LHS=" + l + ", RHS=" + r + ", agree=" + (l === r));
  }
  const B1 = 1000000;
  const toL = (n: number) => { const L: number[] = []; while (n > 0) { L.push(n % B1); n = Math.floor(n / B1); } return L; };
  const mulL = (a: number[], b: number[]) => {
    const c = new Array(a.length + b.length).fill(0);
    for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) c[i+j] += a[i] * b[j];
    for (let k = 0; k < c.length; k++) { if (c[k] >= B1) { const t = Math.floor(c[k] / B1); c[k] %= B1; c[k+1] += t; } }
    while (c.length > 1 && c[c.length-1] === 0) c.pop();
    return c;
  };
  const strL = (a: number[]) => { let s = String(a[a.length-1]); for (let i = a.length-2; i >= 0; i--) s += String(a[i]).padStart(6, "0"); return s; };
  const A = 193707721, Bn = 761838257287;
  const prod = strL(mulL(toL(A), toL(Bn)));
  p("Cole product " + A + " x " + Bn + " = " + prod);
  let L2 = [1];
  for (let i = 0; i < 67; i++) {
    let carry = 0; const nx: number[] = [];
    for (const v of L2) { const w = v * 2 + carry; nx.push(w % B1); carry = Math.floor(w / B1); }
    if (carry > 0) nx.push(carry);
    L2 = nx;
  }
  L2[0] -= 1;
  const two67m1 = strL(L2);
  p("2^67 - 1 (limb doubling) = " + two67m1);
  p("Cole identity: product == 2^67-1 = " + (prod === two67m1) + ", both = 147573952589676412927 = " + (prod === "147573952589676412927"));
  for (const q of [1000003, 99991]) {
    const l = ((A % q) * (Bn % q)) % q;
    const r = (mpow(2, 67, q) - 1 + q) % q;
    p("mod " + q + ": product=" + l + ", 2^67-1=" + r + ", agree=" + (l === r));
  }
  return out;
}

// ---- P7: n^2+n+41 kills and Goldbach detector vs R0 receipts ----
async function piece7() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P7: n^2+n+41 kills and Goldbach detector vs R0 receipts");
  const e = (n: number) => n * n + n + 41;
  p("n=40: 1600+40+41 = " + e(40) + " = 41^2 = " + (41*41) + " (expect 1681, match = " + (e(40) === 1681 && 1681 === 41*41) + ")");
  p("n=41: 1681+41+41 = " + e(41) + " = 41 x 43 = " + (41*43) + " (expect 1763, match = " + (e(41) === 1763 && 1763 === 41*43) + ")");
  p("1681 composite (41^2) = true, 1763 composite (41 x 43) = " + (1763 === 41 * 43));
  const N = 1000;
  const sieve = new Array(N + 1).fill(true);
  sieve[0] = false; sieve[1] = false;
  for (let i = 2; i * i <= N; i++) if (sieve[i]) for (let j = i * i; j <= N; j += i) sieve[j] = false;
  let fails = 0, firstFail = -1;
  for (let m = 4; m <= N; m += 2) {
    let ok = false;
    for (let q = 2; q <= m - 2; q++) if (sieve[q] && sieve[m - q]) { ok = true; break; }
    if (!ok) { fails++; if (firstFail < 0) firstFail = m; }
  }
  p("Goldbach evens 4.." + N + ": failures = " + fails + (firstFail >= 0 ? ", first failure " + firstFail : "") + " (expect 0, detector only)");
  p("boundary spot-checks: 4 = 2+2 = " + (2+2) + ", 6 = 3+3 = " + (3+3) + ", 1000 = 3+997 = " + (3+997) + " (997 prime = " + sieve[997] + ")");
  return out;
}

// ---- P8: Fig P03.2 drawn-curve verification ----
async function piece8() {
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.text ?? r.content ?? String(r);
  };
  const f = await read("labs-src/fig-p03-2.svg");
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P8: Fig P03.2 drawn-curve verification");
  const bOf = (x: number) => (x - 50) * 3000 / 370;
  const vOf = (y: number) => (160 - y) * 60 / 140;
  const avg = (b: number) => 60 * b / (30 + b);
  const pm = f.match(/points="([^"]+)"/);
  const pts = pm[1].trim().split(/\s+/);
  let worst = 0, n = 0, bsOK = true;
  for (const tok of pts) {
    const [xs, ys] = tok.split(",");
    const x = Number(xs), y = Number(ys);
    const b = bOf(x), vD = vOf(y), vT = avg(b);
    const d = Math.abs(vD - vT);
    if (d > worst) worst = d;
    if (d > 0.05) bsOK = false;
    n++;
  }
  p("polyline points checked = " + n + " (expect 61), all within 0.05 of 60b/(30+b) = " + bsOK + ", worst deviation = " + worst.toFixed(4));
  const first = pts[0].split(","), last = pts[pts.length-1].split(",");
  p("curve spans b=" + bOf(Number(first[0])).toFixed(2) + " to " + bOf(Number(last[0])).toFixed(2) + " (expect 0 to 3000), step = " + (bOf(Number(pts[1].split(",")[0])) - bOf(Number(first[0]))).toFixed(2) + " (expect 50)");
  const marks: RegExpMatchArray[] = [];
  const re = /<circle cx="([\d.]+)" cy="([\d.]+)" r="3\.2"/g;
  let m: any;
  while ((m = re.exec(f)) !== null) marks.push(m);
  const expMarks = [[53.7, 90, 30, "30"], [57.4, 66.67, 60, "40"], [420, 21.38, 3000, "59.41"]];
  let i = 0;
  for (const [ex, ey, eb, lbl] of expMarks) {
    const cx = Number(marks[i][1]), cy = Number(marks[i][2]);
    const b = bOf(cx), v = vOf(cy);
    const ok = Math.abs(cx - ex) < 0.01 && Math.abs(cy - ey) < 0.01 && Math.abs(b - eb) < 0.05 && Math.abs(v - avg(eb)) < 0.01;
    p("mark " + (i+1) + " at (" + cx + ", " + cy + ") -> b=" + b.toFixed(2) + ", v=" + v.toFixed(3) + ", label \"" + lbl + "\", v matches avg = " + ok + " (avg(" + eb + ") = " + avg(eb).toFixed(4) + ")");
    p("  label \"" + lbl + "\" present in SVG = " + f.includes(">" + lbl + "<"));
    i++;
  }
  const xticks: number[] = []; const rex = /x1="([\d.]+)" y1="160" x2="([\d.]+)" y2="164"/g;
  while ((m = rex.exec(f)) !== null) xticks.push(bOf(Number(m[1])));
  p("x-ticks at b = " + xticks.map(v => v.toFixed(1)).join(", ") + " (expect 0, 1000, 2000, 3000)");
  const yticks: number[] = []; const rey = /x1="46" y1="([\d.]+)" x2="50" y2="([\d.]+)"/g;
  while ((m = rey.exec(f)) !== null) yticks.push(vOf(Number(m[1])));
  p("y-ticks at v = " + yticks.map(v => v.toFixed(1)).join(", ") + " (expect 0, 30, 60)");
  const asym = f.match(/y1="20" x2="420" y2="20"/) !== null;
  p("dashed asymptote at y=20 -> v=" + vOf(20) + " = 2a with a=30 = " + (vOf(20) === 60) + ", present = " + asym + ", labeled \"60 = 2a\" = " + f.includes("60 = 2a"));
  return out;
}

// ---- P9: post-fill re-check of the final page (R1 clause in place) ----
async function piece9() {
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.text ?? r.content ?? String(r);
  };
  const page = await read("book/p03-special-cases.html");
  const cnt = (s: string, m: string) => s.split(m).length - 1;
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  p("P9: post-fill re-check of the final page");
  p("chars=" + page.length + " (wc -c bytes = 35006)");
  p("inline-open = " + cnt(page, "\\(") + ", inline-close = " + cnt(page, "\\)") + " (expect 157/157: 155 body pairs + 1 config + 1 new pair in the R1 run history)");
  p("display-open = " + cnt(page, "\\[") + ", display-close = " + cnt(page, "\\]") + " (expect 2/2)");
  p("dollar-pairs = " + cnt(page, "$$") + " (expect 0)");
  p("placeholder remaining = " + cnt(page, "RUNHISTORY_PLACEHOLDER") + " (expect 0)");
  p("sections = " + cnt(page, "</section>") + ", figures = " + cnt(page, "<figure") + ", figcaptions = " + cnt(page, "<figcaption>") + ", svg = " + cnt(page, "<svg") + ", eq = " + cnt(page, 'class="eq"') + ", </html> = " + cnt(page, "</html>"));
  const cfg = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
  const body = page.replace(cfg, "");
  let bal = true, open = false;
  for (let i = 0; i < body.length - 1; i++) {
    if (body[i] === "\\" && body[i+1] === "(") { if (open) bal = false; open = true; }
    if (body[i] === "\\" && body[i+1] === ")") { if (!open) bal = false; open = false; }
  }
  p("inline delimiters alternate correctly = " + bal + ", dangling = " + open);
  p("R1 entry present = " + page.includes("R1 (2026-10-28, session S13)") + ", honest run history filled = " + page.includes("one caption defect was caught and fixed before the lab ran"));
  p("caption fix present = " + page.includes("without ever reaching it") + ", false claim absent outside the R1 quotation = " + (page.split("misses 45 forever").length - 1 === 1 && page.includes('claimed the curve "misses 45 forever"')));
  return out;
}
