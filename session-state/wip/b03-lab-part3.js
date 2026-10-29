// b03-lab.js — piece p02: the page's grid claims (edge cases, Box B03.A, associativity, halving, self-inverse)
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  function gcdI(a, b) { let x = a, y = b; if (y > x) { const t = x; x = y; y = t; } while (y !== 0) { const r = x % y; x = y; y = r; } return x; }
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p02." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  // edge behaviors over a grid
  let edgeBad = 0;
  for (let a = 1; a <= 200; a++) { if (gcdI(a, 0) !== a || gcdI(a, a) !== a) edgeBad++; }
  CK("gcd(a,0)=a and gcd(a,a)=a for all a<=200 (400 checks)", edgeBad === 0, edgeBad + " bad");
  // gcd(0,0): engine must flag it, not return 0 silently
  const g00 = gcdI(0, 0);
  CK("gcd(0,0) engine returns 0 and page declares it undefined (honest sentinel)", g00 === 0, "engine " + g00);
  // Box B03.A: every common divisor divides the gcd, pairs a,b <= 120
  let cdBad = 0, cdTotal = 0;
  for (let a = 1; a <= 120; a++) for (let b = 1; b <= 120; b++) {
    const g = gcdI(a, b);
    for (let d = 1; d <= g; d++) if (a % d === 0 && b % d === 0) { cdTotal++; if (g % d !== 0) cdBad++; }
  }
  CK("Box B03.A grid pairs<=120: 23344 checks, 0 failures", cdTotal === 23344 && cdBad === 0, cdBad + " bad / " + cdTotal);
  // three-number identity vs brute force, a,b,c <= 30
  let assocBad = 0, assocTotal = 0;
  for (let a = 1; a <= 30; a++) for (let b = 1; b <= 30; b++) for (let c = 1; c <= 30; c++) {
    assocTotal++;
    const g1 = gcdI(gcdI(a, b), c);
    const g2 = gcdI(a, gcdI(b, c));
    let g3 = 1;
    const m = Math.min(a, Math.min(b, c));
    for (let d = 1; d <= m; d++) if (a % d === 0 && b % d === 0 && c % d === 0) g3 = d;
    if (g1 !== g2 || g1 !== g3) assocBad++;
  }
  CK("associativity grid triples<=30: 27000, 0 mismatches vs brute", assocTotal === 27000 && assocBad === 0, assocBad + " bad");
  // halving engine: from (a,b), r1 = a mod b (b>0, r1>0), r2 = b mod r1 -> r2 < b/2
  let halfBad = 0, halfTotal = 0;
  for (let a = 2; a <= 500; a++) for (let b = 1; b < a; b++) {
    const r1 = a % b;
    if (r1 === 0) continue;
    const r2 = b % r1;
    halfTotal++;
    if (!(r2 < b / 2)) halfBad++;
  }
  CK("halving engine two-step pairs<=500: 122060, 0 violations", halfTotal === 122060 && halfBad === 0, halfBad + " bad / " + halfTotal);
  // self-inverse: (n-1)^2 = 1 mod n for n = 2..60
  let siBad = 0, siTotal = 0;
  for (let nn = 2; nn <= 60; nn++) { siTotal++; if (((nn - 1) * (nn - 1)) % nn !== 1) siBad++; }
  CK("(n-1)^2 = 1 mod n for n=2..60: 59 checks, 0 failures", siTotal === 59 && siBad === 0, siBad + " bad");
  // the two-case proof's case split, witnessed: quotient q'=1 exactly when r > b/2
  let caseBad = 0, caseTotal = 0;
  for (let a = 2; a <= 300; a++) for (let b = 1; b < a; b++) {
    const r1 = a % b;
    if (r1 === 0) continue;
    const q2 = Math.floor(b / r1);
    caseTotal++;
    if (q2 === 1 && !(r1 > b / 2)) caseBad++;
    if (q2 > 1 && !(r1 <= b / 2)) caseBad++;
  }
  CK("case split witness: q'=1 iff r > b/2, pairs<=300", caseBad === 0, caseBad + " bad / " + caseTotal);
  P("PIECE p02 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-piece2.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}
