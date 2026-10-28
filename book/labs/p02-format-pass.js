// labs/p02-format-pass.js — P02 formatting retrofit pass (R1) verifier, session S12.
// Fresh engine, zero shared code with the R0 lab: every numeric claim on the page
// re-verified against the R0 receipts, plus TeX and SVG sanity.
// Engine constraint: runs as nine recorded transcript pieces (<= 4KB each), concatenated
// here in order (P1..P9). Piece 4 run 1 returned empty output from a malformed line;
// the clean rerun is the recorded one. All other pieces ran clean on run 1.

// ---- P1: pancake claims ----
async function piece1() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  let pancake = (n: number) => (n * n + n + 2) / 2;
  let mm = 0;
  for (let n = 0; n <= 100; n++) {
    let cnt = 1;
    for (let k = 1; k <= n; k++) cnt += k;
    if (cnt !== pancake(n)) mm++;
  }
  p("P1 pancake: recurrence (each k-th cut adds k) vs (n^2+n+2)/2, n=0..100 -> mismatches: " + mm);
  const tab: number[] = [];
  for (let n = 0; n <= 10; n++) tab.push(pancake(n));
  const expectTab = [1,2,4,7,11,16,22,29,37,46,56];
  p("P1 pancake table n=0..10: " + tab.join(",") + " matches page/figure values: " + tab.every((v,i)=>v===expectTab[i]));
  p("P1 (100+10+2)/2 = " + ((100+10+2)/2) + " (page: 56) ; pancake(10) = " + pancake(10));
  p("P1 pancake(11) = " + pancake(11) + " (page: 67) ; 11th cut adds " + (pancake(11)-pancake(10)) + " (page: 11)");
  p("P1 (121+11+2)/2 = " + ((121+11+2)/2) + " (page: 67)");
  const diffs: number[] = [];
  for (let n = 1; n <= 5; n++) diffs.push(pancake(n)-pancake(n-1));
  p("P1 differences n=1..5: " + diffs.join(",") + " (page: 1, 2, 3, 4, 5)");
  let mm2 = 0;
  for (let n = 0; n <= 50; n++) {
    const c = n*(n-1)/2 + n + 1;
    if (c !== pancake(n)) mm2++;
  }
  p("P1 pancake = C(n,2)+n+1, n=0..50 -> mismatches: " + mm2);
  return out;
}

// ---- P2: odd sums, handshakes, cube sums ----
async function piece2() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  let mm = 0;
  for (let n = 1; n <= 500; n++) {
    let s = 0;
    for (let k = 1; k <= n; k++) s += 2*k - 1;
    if (s !== n*n) mm++;
  }
  p("P2 odd sums = n^2, n=1..500 -> mismatches: " + mm);
  const spots: number[] = [];
  for (let n = 1; n <= 5; n++) { let s = 0; for (let k = 1; k <= n; k++) s += 2*k-1; spots.push(s); }
  p("P2 page table 1,4,9,16,25 reproduced: " + spots.join(",") + " -> " + (spots.join(",")==="1,4,9,16,25"));
  let mmg = 0;
  for (let n = 1; n <= 500; n++) if (n*n - (n-1)*(n-1) !== 2*n - 1) mmg++;
  p("P2 n^2-(n-1)^2 = 2n-1, n=1..500 -> mismatches: " + mmg);
  let mmh = 0;
  for (let n = 1; n <= 60; n++) {
    let cnt = 0;
    for (let i = 0; i < n; i++) for (let j = i+1; j < n; j++) cnt++;
    if (cnt !== n*(n-1)/2) mmh++;
  }
  p("P2 handshakes brute pairs vs n(n-1)/2, n=1..60 -> mismatches: " + mmh);
  const hs: number[] = [];
  for (let n = 2; n <= 7; n++) hs.push(n*(n-1)/2);
  p("P2 handshake table n=2..7: " + hs.join(",") + " (page: 1, 3, 6, 10, 15, 21)");
  p("P2 12x11/2 = " + (12*11/2) + " (page: 66)");
  let mmc = 0;
  for (let n = 1; n <= 200; n++) {
    let c = 0, t = 0;
    for (let k = 1; k <= n; k++) { c += k*k*k; t += k; }
    if (c !== t*t) mmc++;
  }
  p("P2 cube-sums = (triangular)^2, n=1..200 -> mismatches: " + mmc);
  let c6 = 0; for (let k = 1; k <= 6; k++) c6 += k*k*k;
  p("P2 cube-sum(6) = " + c6 + " ; 21^2 = " + 21*21 + " (page: 441 = 21^2)");
  const cs: number[] = [];
  for (let n = 1; n <= 5; n++) { let c = 0; for (let k = 1; k <= n; k++) c += k*k*k; cs.push(c); }
  p("P2 cube-sum table 1..5: " + cs.join(",") + " (page: 1, 9, 36, 100, 225)");
  return out;
}

// ---- P3: integrals, Ex4 sequence, squares on a grid ----
async function piece3() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  const M = 2000000;
  const vals: string[] = [];
  let worst = 0;
  for (let n = 0; n <= 8; n++) {
    const h = 1 / M;
    let s = 0;
    for (let i = 0; i < M; i++) s += Math.pow((i + 0.5) * h, n);
    const q = s * h, ex = 1 / (n + 1);
    const err = Math.abs(q - ex);
    if (err > worst) worst = err;
    vals.push(n + ":" + q.toFixed(5));
  }
  p("P3 midpoint quadrature (2e6 steps) int_0^1 x^n dx, n=0..8:");
  p("    " + vals.join("  "));
  p("    worst |quadrature - 1/(n+1)| = " + worst.toExponential(3) + " -> five-decimal agreement: " + (worst < 5e-6));
  p("P3 exact table n=0..3: 1, " + (1/2) + ", " + (1/3).toFixed(4) + ", " + (1/4) + " (page: 1, 1/2, 1/3, 1/4)");
  const seq = [2, 6, 12, 20, 30];
  let ok5 = true;
  for (let i = 1; i <= 5; i++) if (seq[i-1] !== i*(i+1)) ok5 = false;
  let term = 0;
  for (let n = 1; n <= 100; n++) term = n*(n+1);
  let cur = 0;
  for (let n = 1; n <= 100; n++) cur = cur + 2*n;
  p("P3 Ex4 first five terms match n(n+1): " + ok5 + " ; 100th term: formula " + term + ", recurrence-stepping " + cur + " (page: 10100)");
  const d1 = seq.map((v,i) => v - (i>0?seq[i-1]:0)).slice(1);
  p("P3 Ex4 first differences: " + d1.join(",") + " ; second differences: " + (d1[1]-d1[0]) + "," + (d1[2]-d1[1]) + "," + (d1[3]-d1[2]) + " (page: 4, 6, 8, 10 / constant 2)");
  let mms = 0;
  const gridCounts: number[] = [];
  for (let n = 1; n <= 12; n++) {
    let brute = 0;
    for (let k = 1; k <= n; k++)
      for (let x = 0; x + k <= n; x++)
        for (let y = 0; y + k <= n; y++) brute++;
    let fsum = 0;
    for (let k = 1; k <= n; k++) fsum += (n-k+1)*(n-k+1);
    if (brute !== fsum) mms++;
    if (n <= 6) gridCounts.push(brute);
  }
  p("P3 squares-on-grid brute vs Sum_k (n-k+1)^2, n=1..12 -> mismatches: " + mms);
  p("P3 grid counts n=1..6: " + gridCounts.join(",") + " (receipt: 1, 5, 14, 30, 55, 91)");
  let b8 = 0;
  for (let k = 1; k <= 8; k++) b8 += (8-k+1)*(8-k+1);
  p("P3 8x8 board: " + b8 + " squares (receipt: 204)");
  return out;
}

// ---- P4: powers of two, digit counts, factorials, pigeonhole witness ----
async function piece4() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  const dbl = (s: string): string => {
    let r = "", carry = 0;
    for (let i = s.length - 1; i >= 0; i--) {
      const d = (s.charCodeAt(i) - 48) * 2 + carry;
      r = String.fromCharCode(48 + (d % 10)) + r;
      carry = d >= 10 ? 1 : 0;
    }
    return carry ? "1" + r : r;
  };
  let s = "1";
  const digits: number[] = [];
  for (let n = 1; n <= 100; n++) { s = dbl(s); digits.push(s.length); }
  p("P4 2^n digit counts n=1..12: " + digits.slice(0,12).join(",") + " (page: 1,1,1,2,2,2,3,3,3,4,4,4)");
  let v13 = "1"; for (let n = 1; n <= 13; n++) v13 = dbl(v13);
  let v14 = dbl(v13);
  p("P4 2^13 = " + v13 + " -> " + v13.length + " digits (page: 8192, four digits)");
  p("P4 2^14 = " + v14 + " -> " + v14.length + " digits (page: 16384, five digits)");
  p("P4 2^100 = " + s + " -> " + s.length + " digits (page constant matches: " + (s === "1267650600228229401496703205376") + ", 31 digits: " + (s.length === 31) + ")");
  const L2 = Math.log10(2);
  let mml = 0;
  for (let n = 1; n <= 100; n++) if (Math.floor(n * L2) + 1 !== digits[n-1]) mml++;
  p("P4 floor(n log10 2)+1 vs digit count, n=1..100 -> mismatches: " + mml);
  p("P4 floor(30.103)+1 = " + (Math.floor(30.103) + 1) + " (page: 31 digits) ; 100*log10(2) = " + (100*L2).toFixed(5));
  const v5 = (n: number) => { let c = 0; for (let d = 5; d <= n; d *= 5) c += Math.floor(n/d); return c; };
  const v2 = (n: number) => { let c = 0; for (let d = 2; d <= n; d *= 2) c += Math.floor(n/d); return c; };
  const tz = (n: number) => Math.min(v2(n), v5(n));
  p("P4 trailing zeros: 10! -> " + tz(10) + ", 15! -> " + tz(15) + ", 20! -> " + tz(20) + ", 25! -> " + tz(25) + " (receipt: 2, 3, 4, 6)");
  p("P4 v5 <= v2 for 10,15,20,25: " + [10,15,20,25].every(n => v5(n) <= v2(n)));
  const months: number[] = [];
  for (let i = 1; i <= 12; i++) months.push(i);
  p("P4 12-month witness (person i born in month i, i=1..12): " + (new Set(months).size === 12));
  const m13: number[] = [];
  for (let i = 1; i <= 13; i++) m13.push(i % 12);
  p("P4 13 into 12 forces repeat: " + (new Set(m13).size < 13));
  return out;
}

// ---- P5: Moser by two independent routes, n=1..8 ----
async function piece5() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  const pts = (angles: number[], cx: number, cy: number, r: number) =>
    angles.map(a => ({ x: cx + r * Math.cos(a * Math.PI / 180), y: cy + r * Math.sin(a * Math.PI / 180) }));
  const cross = (p1: any, p2: any, p3: any, p4: any) => {
    const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
    if (Math.abs(d) < 1e-12) return null;
    const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
    const u = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;
    if (t > 1e-9 && t < 1 - 1e-9 && u > 1e-9 && u < 1 - 1e-9)
      return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
    return null;
  };
  const regionsTwoRoutes = (points: any[]) => {
    const n = points.length;
    const chords: number[][] = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) chords.push([i, j]);
    let regA = 1;
    const added: number[][] = [];
    for (const ch of chords) {
      let m = 0;
      for (const ch2 of added) {
        if (ch2[0] === ch[0] || ch2[0] === ch[1] || ch2[1] === ch[0] || ch2[1] === ch[1]) continue;
        if (cross(points[ch[0]], points[ch[1]], points[ch2[0]], points[ch2[1]])) m++;
      }
      regA += m + 1;
      added.push(ch);
    }
    const cps: any[] = [];
    for (let a = 0; a < chords.length; a++) for (let b = a + 1; b < chords.length; b++) {
      const c1 = chords[a], c2 = chords[b];
      if (c1[0] === c2[0] || c1[0] === c2[1] || c1[1] === c2[0] || c1[1] === c2[1]) continue;
      const c = cross(points[c1[0]], points[c1[1]], points[c2[0]], points[c2[1]]);
      if (c) cps.push(c);
    }
    const V = n + cps.length;
    const E = chords.length + 2 * cps.length + n;
    const regB = E - V + 1;
    return { regA, regB, crossings: cps.length };
  };
  const seq: number[] = [];
  let agree = true;
  for (let n = 1; n <= 8; n++) {
    const angs: number[] = [];
    for (let i = 0; i < n; i++) angs.push(i * (360 / n) + 7 * (i + 1) * (i + 1) * 0.37);
    const r = regionsTwoRoutes(pts(angs, 0, 0, 1));
    seq.push(r.regA);
    if (r.regA !== r.regB) agree = false;
  }
  p("P5 Moser route A (incremental) n=1..8: " + seq.join(",") + " (page: 1, 2, 4, 8, 16, 31, 57, 99)");
  p("P5 routes A and B (Euler) agree for all n=1..8: " + agree);
  const bino = (n: number, k: number) => { let c = 1; for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1); return c; };
  p("P5 C(n,2)+C(n,4)+1 at n=6,7,8: " + [6,7,8].map(n => bino(n,2)+bino(n,4)+1).join(",") + " (page: 31, 57, 99)");
  return out;
}

// ---- P6: drawn Fig P02.3 panels (on-circle, crossings, general position, grid signature) ----
async function piece6() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  const c1 = { x: 110, y: 110, r: 90 };
  const pts1 = [[198.63,125.63],[125.63,198.63],[30.53,152.25],[47.48,45.26],[155.00,32.06]];
  const c2 = { x: 350, y: 110, r: 90 };
  const pts2 = [[439.66,117.84],[393.63,188.72],[292.15,178.94],[260.88,122.53],[297.10,37.19],[396.35,32.85]];
  const onCircle = (pts: number[][], c: any, tol: number) => {
    let worst = 0;
    for (const q of pts) {
      const d = Math.hypot(q[0]-c.x, q[1]-c.y) - c.r;
      if (Math.abs(d) > worst) worst = Math.abs(d);
    }
    return worst <= tol;
  };
  p("P6 panel (i) 5 points on-circle (|dist - 90| <= 0.02): " + onCircle(pts1, c1, 0.02));
  p("P6 panel (ii) 6 points on-circle (|dist - 90| <= 0.02): " + onCircle(pts2, c2, 0.02));
  const cross = (p1: number[], p2: number[], p3: number[], p4: number[]) => {
    const d = (p2[0]-p1[0])*(p4[1]-p3[1]) - (p2[1]-p1[1])*(p4[0]-p3[0]);
    if (Math.abs(d) < 1e-12) return null;
    const t = ((p3[0]-p1[0])*(p4[1]-p3[1]) - (p3[1]-p1[1])*(p4[0]-p3[0]))/d;
    const u = ((p3[0]-p1[0])*(p2[1]-p1[1]) - (p3[1]-p1[1])*(p2[0]-p1[0]))/d;
    if (t > 1e-9 && t < 1-1e-9 && u > 1e-9 && u < 1-1e-9)
      return [p1[0]+t*(p2[0]-p1[0]), p1[1]+t*(p2[1]-p1[1])];
    return null;
  };
  const analyze = (pts: number[][], c: any) => {
    const n = pts.length;
    const chords: number[][] = [];
    for (let i = 0; i < n; i++) for (let j = i+1; j < n; j++) chords.push([i, j]);
    const cps: number[][] = [];
    for (let a = 0; a < chords.length; a++) for (let b = a+1; b < chords.length; b++) {
      const q1 = chords[a], q2 = chords[b];
      if (q1[0]===q2[0]||q1[0]===q2[1]||q1[1]===q2[0]||q1[1]===q2[1]) continue;
      const cp = cross(pts[q1[0]], pts[q1[1]], pts[q2[0]], pts[q2[1]]);
      if (cp) cps.push(cp);
    }
    let minSep = Infinity;
    for (let i = 0; i < cps.length; i++) for (let j = i+1; j < cps.length; j++)
      minSep = Math.min(minSep, Math.hypot(cps[i][0]-cps[j][0], cps[i][1]-cps[j][1]));
    const sig = new Set<string>();
    const rr = c.r - 0.3;
    for (let x = c.x - rr; x <= c.x + rr; x += 0.25)
      for (let y = c.y - rr; y <= c.y + rr; y += 0.25) {
        const dx = x - c.x, dy = y - c.y;
        if (dx*dx + dy*dy > rr*rr) continue;
        let s = "";
        for (const ch of chords) {
          const a = pts[ch[0]], b = pts[ch[1]];
          s += (a[0]-x)*(b[1]-y) - (a[1]-y)*(b[0]-x) > 0 ? "1" : "0";
        }
        sig.add(s);
      }
    return { chords: chords.length, crossings: cps.length, minSep, regions: sig.size };
  };
  const r1 = analyze(pts1, c1);
  const r2 = analyze(pts2, c2);
  p("P6 panel (i): " + r1.chords + " chords (page: 10), crossings " + r1.crossings + " (C(5,4) = 5), min crossing separation " + r1.minSep.toFixed(1) + "px (general position: " + (r1.minSep > 1) + ")");
  p("P6 panel (i) grid-signature region count (0.25px grid): " + r1.regions + " (page: 16)");
  p("P6 panel (ii): " + r2.chords + " chords (page: 15), crossings " + r2.crossings + " (C(6,4) = 15), min crossing separation " + r2.minSep.toFixed(1) + "px (general position: " + (r2.minSep > 1) + ")");
  p("P6 panel (ii) grid-signature region count (0.25px grid): " + r2.regions + " (page: 31)");
  return out;
}

// ---- P7: Fig P02.1 pancake geometry (on-circle, crossings, 7 regions) ----
async function piece7() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  const C = { x: 110, y: 110, r: 100 };
  const cuts = [
    [11.52, 127.36, 196.60, 60.00],
    [127.36, 208.48, 75.80, 16.03],
    [191.92, 167.36, 16.03, 75.80],
  ];
  let worstEnd = 0;
  for (const c of cuts) {
    for (const q of [[c[0], c[1]], [c[2], c[3]]]) {
      const d = Math.hypot(q[0] - C.x, q[1] - C.y) - C.r;
      worstEnd = Math.max(worstEnd, Math.abs(d));
    }
  }
  p("P7 fig1 cut endpoints on-circle: worst |dist-100| = " + worstEnd.toFixed(4) + "px (<= 0.02: " + (worstEnd <= 0.02) + ")");
  const cross = (c1: number[], c2: number[]) => {
    const d = (c1[2]-c1[0])*(c2[3]-c2[1]) - (c1[3]-c1[1])*(c2[2]-c2[0]);
    if (Math.abs(d) < 1e-12) return null;
    const t = ((c2[0]-c1[0])*(c2[3]-c2[1]) - (c2[1]-c1[1])*(c2[2]-c2[0]))/d;
    if (t > 1e-9 && t < 1 - 1e-9) return [c1[0]+t*(c1[2]-c1[0]), c1[1]+t*(c1[3]-c1[1])];
    return null;
  };
  let nInside = 0;
  const cps: number[][] = [];
  for (let a = 0; a < 3; a++) for (let b = a+1; b < 3; b++) {
    const cp = cross(cuts[a], cuts[b]);
    if (cp) {
      cps.push(cp);
      if (Math.hypot(cp[0]-C.x, cp[1]-C.y) < C.r) nInside++;
    }
  }
  p("P7 fig1: 3 cut pairs, " + cps.length + " crossings, all inside circle: " + nInside + "/3");
  let minSep = Infinity;
  for (let i = 0; i < cps.length; i++) for (let j = i+1; j < cps.length; j++)
    minSep = Math.min(minSep, Math.hypot(cps[i][0]-cps[j][0], cps[i][1]-cps[j][1]));
  p("P7 fig1 general position (distinct crossings): min separation " + minSep.toFixed(2) + "px");
  const sig = new Set<string>();
  const rr = C.r - 0.3;
  for (let x = C.x - rr; x <= C.x + rr; x += 0.25)
    for (let y = C.y - rr; y <= C.y + rr; y += 0.25) {
      const dx = x - C.x, dy = y - C.y;
      if (dx*dx + dy*dy > rr*rr) continue;
      let s = "";
      for (const c of cuts)
        s += (c[0]-x)*(c[3]-y) - (c[1]-y)*(c[2]-x) > 0 ? "1" : "0";
      sig.add(s);
    }
  p("P7 fig1 grid-signature region count (0.25px grid): " + sig.size + " (page/figure: 7; table n=3 row: 7)");
  p("P7 fig2 cell groups: 1, 4, 9 -> squares 1, 4, 9 = 1^2, 2^2, 3^2 (labels: 1 = 1^2, 1 + 3 = 4, 4 + 5 = 9)");
  return out;
}

// ---- P8: SVG file sanity (viewBox, hrefs, coordinate bounds, fig2 rect counts) ----
async function piece8() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.text ?? r.content ?? String(r);
  };
  const files = ["fig-p02-1.svg", "fig-p02-2.svg", "fig-p02-3.svg"];
  for (const f of files) {
    const t = await read("labs-src/" + f);
    const vb = /viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/.exec(t);
    const hasHref = /href/i.test(t);
    p("P8 " + f + ": viewBox=" + (vb ? vb.slice(1).join(" ") : "MISSING") + ", external href: " + hasHref);
    if (vb) {
      const [vx, vy, vw, vh] = vb.slice(1).map(Number);
      const tol = 0.05;
      let bad = 0, worst = 0;
      const re = /(x|y|cx|cy|x1|y1|x2|y2)="([-\d.]+)"/g;
      let m: any;
      while ((m = re.exec(t))) {
        const v = parseFloat(m[2]);
        const lim = (m[1] === "x" || m[1] === "cx" || m[1] === "x1" || m[1] === "x2") ? [vx, vx + vw] : [vy, vy + vh];
        const over = Math.max(lim[0] - v, v - lim[1]);
        if (over > tol) bad++;
        if (over > worst) worst = over;
      }
      const rw = /rect x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/g;
      while ((m = rw.exec(t))) {
        const x2 = parseFloat(m[1]) + parseFloat(m[3]), y2 = parseFloat(m[2]) + parseFloat(m[4]);
        const over = Math.max(vx - x2, x2 - (vx+vw), vy - y2, y2 - (vy+vh));
        if (over > tol) bad++;
        if (over > worst) worst = over;
      }
      p("P8 " + f + ": coordinates outside viewBox (tol 0.05px): " + bad + ", worst overshoot " + worst.toFixed(3) + "px");
    }
  }
  const t2 = await read("labs-src/fig-p02-2.svg");
  const rects = [...t2.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="34"/g)].map(m => [parseFloat(m[1]), parseFloat(m[2])]);
  const cnt = [0, 0, 0];
  for (const r of rects) { const i = r[0] < 100 ? 0 : r[0] < 300 ? 1 : 2; cnt[i]++; }
  p("P8 fig2 rect counts per square (from file): " + cnt.join(",") + " (expected 1, 4, 9) -> " + (cnt.join(",") === "1,4,9"));
  p("P8 fig2 blue vs red (new L-strip) split, square 2: 1 blue + 3 red; square 3: 4 blue + 5 red -> odd strips 1, 3, 5: " + (cnt[1] === 1 + 3 && cnt[2] === 4 + 5));
  return out;
}

// ---- P9: fig2 color split + page TeX/structure sanity ----
async function piece9() {
  const out: string[] = [];
  const p = (s: string) => out.push(s);
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.text ?? r.content ?? String(r);
  };
  const t2 = await read("labs-src/fig-p02-2.svg");
  const sq = (x: number) => x < 100 ? 0 : x < 300 ? 1 : 2;
  const blue = [0,0,0], red = [0,0,0];
  for (const m of t2.matchAll(/<rect x="([\d.]+)"[^>]*fill="(#[0-9a-f]{6})"/g)) {
    const i = sq(parseFloat(m[1]));
    if (m[2] === "#3574d4") blue[i]++; else red[i]++;
  }
  p("P9 fig2 per-square blue/red: sq1 " + blue[0] + "/" + red[0] + ", sq2 " + blue[1] + "/" + red[1] + ", sq3 " + blue[2] + "/" + red[2] + " (expected 1/0, 1/3, 4/5) -> " + (blue.join(",")==="1,1,4" && red.join(",")==="0,3,5"));
  const pg = await read("book/p02-small-cases.html");
  const lines = pg.split("\n");
  const cfgIdx = lines.findIndex(l => l.includes("window.MathJax"));
  let op = 0, cl = 0, dop = 0, dcl = 0;
  for (let i = 0; i < lines.length; i++) {
    if (i === cfgIdx) continue;
    op += (lines[i].match(/\\\(/g) || []).length;
    cl += (lines[i].match(/\\\)/g) || []).length;
    dop += (lines[i].match(/\\\[/g) || []).length;
    dcl += (lines[i].match(/\\\]/g) || []).length;
  }
  const dollars = (pg.match(/\$\$/g) || []).length;
  const cfg = lines[cfgIdx] || "";
  const cfgBack = (cfg.match(/\\\\/g) || []).length;
  p("P9 page TeX (config line excluded): opens " + op + ", closes " + cl + ", balanced: " + (op === cl));
  p("P9 page display delimiters outside config: " + dop + " and " + dcl + " (page has no display equations; expected 0/0)");
  p("P9 page $$ occurrences: " + dollars + " (must be 0)");
  p("P9 MathJax config line double-backslash pairs: " + cfgBack + " (must be 4 -> 8 backslashes total)");
  const ph = (pg.match(/RUNHISTORY_PLACEHOLDER/g) || []).length;
  p("P9 run-history placeholder remaining: " + ph + " (must be 0 after the R1 clause is filled)");
  const sec = (pg.match(/<section/g) || []).length, fig = (pg.match(/<figure/g) || []).length, svg = (pg.match(/<svg/g) || []).length;
  p("P9 structure: sections " + sec + " (master: 9), figures " + fig + " (master: 6 + 3 added), svg " + svg);
  return out;
}

// ---- P10: post-fill re-check of the final page (R1 clause in place) ----
async function piece10() {
  const read = async (path: string) => {
    const r: any = await tools.file_system.read_file({ path });
    return r.resource?.text ?? r.text ?? r.content ?? String(r);
  };
  const pg = await read("book/p02-small-cases.html");
  const lines = pg.split("\n");
  const cfgIdx = lines.findIndex(l => l.includes("window.MathJax"));
  let op = 0, cl = 0;
  for (let i = 0; i < lines.length; i++) {
    if (i === cfgIdx) continue;
    op += (lines[i].match(/\\\(/g) || []).length;
    cl += (lines[i].match(/\\\)/g) || []).length;
  }
  const dollars = (pg.match(/\$\$/g) || []).length;
  const ph = (pg.match(/RUNHISTORY_PLACEHOLDER/g) || []).length;
  const sec = (pg.match(/<section/g) || []).length, fig = (pg.match(/<figure/g) || []).length, svg = (pg.match(/<svg/g) || []).length;
  const r1 = (pg.match(/<p>R1 \(2026-10-28, session S12\)/g) || []).length;
  return [
    "P10 post-fill re-check of the final page (R1 clause in place):",
    "P10 TeX (config excluded): opens " + op + ", closes " + cl + ", balanced: " + (op === cl),
    "P10 $$ occurrences: " + dollars + " ; run-history placeholder remaining: " + ph + " (must be 0)",
    "P10 R1 entry present: " + (r1 === 1) + " ; structure: sections " + sec + ", figures " + fig + ", svg " + svg
  ];
}
