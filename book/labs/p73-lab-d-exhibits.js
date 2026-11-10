async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const LIM = 50;
  // route 1: DP, one part size at a time (unlimited supply), iterative
  const pDP = (maxPart) => {
    const f = new Array(LIM + 1).fill(0); f[0] = 1;
    for (let k = 1; k <= maxPart; k++) for (let n = k; n <= LIM; n++) f[n] += f[n - k];
    return f;
  };
  const p = pDP(LIM);

  // route 2: multiply out the product prod_{k<=50} 1/(1-x^k) shelf by shelf, truncated at 40
  const TOP = 40;
  const prod = new Array(TOP + 1).fill(0); prod[0] = 1;
  for (let k = 1; k <= LIM; k++) {
    // multiply by 1/(1-x^k) = 1 + x^k + x^{2k} + ...
    for (let n = k; n <= TOP; n++) prod[n] += prod[n - k];
  }

  // route 3: restricted to parts <= 5
  const r5 = pDP(5);

  gate("D1 p(1..10) = 1,2,3,5,7,11,15,22,30,42", eq(p.slice(1, 11), [1, 2, 3, 5, 7, 11, 15, 22, 30, 42]), "DP shelves");
  let prodOK = true;
  for (let n = 0; n <= TOP; n++) if (prod[n] !== p[n]) prodOK = false;
  gate("D2 Euler product prod 1/(1-x^k) shelves equal DP n<=40", prodOK, "the generating function is the bookkeeping");
  gate("D3 parts<=5 shelves n=0..12 = 1,1,2,3,5,7,10,13,18,23,30,37,47", eq(r5.slice(0, 13), [1, 1, 2, 3, 5, 7, 10, 13, 18, 23, 30, 37, 47]));
  let d4a = true, d4b = true;
  for (let n = 0; n <= 5; n++) if (r5[n] !== p[n]) d4a = false;
  for (let n = 6; n <= 12; n++) if (!(r5[n] < p[n])) d4b = false;
  gate("D4 restricted equals unrestricted through n=5 then strictly behind", d4a && d4b, "no part >5 fits until n=6");

  // route 4: pentagonal recurrence — p(n) rebuilt from p(0)=1 alone
  const pent = (n, allPlus) => {
    let s = 0;
    for (let k = 1; ; k++) {
      const g1 = (k * (3 * k - 1)) / 2, g2 = (k * (3 * k + 1)) / 2;
      if (g1 > n) break;
      s += (allPlus ? 1 : Math.pow(-1, k + 1)) * ((g1 <= n ? pr[n - g1] : 0) + (g2 <= n ? pr[n - g2] : 0));
    }
    return s;
  };
  const pr = new Array(46).fill(0); pr[0] = 1;
  for (let n = 1; n <= 45; n++) pr[n] = pent(n, false);
  gate("D5 pentagonal recurrence reproduces DP for ALL n=1..45", eq(pr.slice(1, 46), p.slice(1, 46)), "Euler's compression of the product into a sum");
  // page instances, recomputed as the running sums the page shows
  const inst6 = p[5] + p[4] - p[1]; // k=1 pair then k=2 first term (second out of range)
  const inst7 = p[6] + p[5] - p[2] - p[0];
  const inst12 = p[11] + p[10] - p[7] - p[5] + p[0];
  gate("D6 page instances p(6)=7+5-1=11, p(7)=11+7-2-1=15, p(12)=56+42-15-7+1=77", inst6 === 11 && inst7 === 15 && inst12 === 77, "recomputed as shown sums, then equal p(6),p(7),p(12)");
  const genPent = [];
  for (let k = 1; k <= 4; k++) { genPent.push((k * (3 * k - 1)) / 2); genPent.push((k * (3 * k + 1)) / 2); }
  gate("D7 generalized pentagonal 1,2,5,7,12,15,22,26", eq(genPent, [1, 2, 5, 7, 12, 15, 22, 26]));

  // poisons
  const allPlus6 = pent(6, true);
  poison("PD1 all-plus recurrence fails: gives 13 at n=6, not 11", allPlus6 === 13 && allPlus6 !== p[6], "signs carry the cancellation");
  poison("PD2 the ORIGINAL page defect list (unrestricted p(n) passed off as parts<=5) caught by D3", !eq(p.slice(0, 13), [1, 1, 2, 3, 5, 7, 10, 13, 18, 23, 30, 37, 47]), "p(6)=11 is not 10 — the error D-B was found by exactly this recomputation");

  const out = { lab: "p73-lab-d-exhibits", date: "2026-11-10", gates, poisons, summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((q) => q.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-lab-d-exhibits.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((q) => !q.caught)) };
}
