async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });
  const shapes = (n) => {
    if (n === 1) return ["x"];
    const out = [];
    for (let k = 1; k < n; k++) for (const l of shapes(k)) for (const r of shapes(n - k)) out.push([l, r]);
    return out;
  };
  const leaves = (t) => (t === "x" ? 1 : leaves(t[0]) + leaves(t[1]));
  const graft = (a, b, s) => {
    const go = (t, k) => {
      if (t === "x") return k === s ? b : "x";
      return [go(t[0], k), go(t[1], k + leaves(t[0]))];
    };
    return go(a, 1);
  };
  const lbl = (t, i) => (t === "x" ? String(i) : "(" + lbl(t[0], i) + lbl(t[1], i + leaves(t[0])) + ")");
  const perms = (n) => {
    const out = [];
    const go = (pre, rest) => {
      if (!rest.length) { out.push(pre); return; }
      rest.forEach((v, i) => go(pre.concat(v), rest.slice(0, i).concat(rest.slice(i + 1))));
    };
    go([], Array.from({ length: n }, (_, i) => i + 1));
    return out;
  };
  const S = (n) => shapes(n);
  const key = (t) => JSON.stringify(t);

  const counts = [2, 3, 4, 5, 6].map((n) => S(n).length);
  gate("A1 composite census inputs 2..6 = 1,2,5,14,42", JSON.stringify(counts) === "[1,2,5,14,42]", counts.join(","));
  const exp4 = ["(((12)3)4)", "((1(23))4)", "((12)(34))", "(1((23)4))", "(1(2(34)))"].sort();
  const got4 = S(4).map((t) => lbl(t, 1)).sort();
  gate("A2 the five 4-input bracketings match Ex1's worked list", JSON.stringify(got4) === JSON.stringify(exp4), got4.join(" "));
  const set5 = new Set(S(5).map(key));
  let a3 = true, n33 = 0;
  for (const a of S(3)) for (const b of S(3)) for (let s = 1; s <= 3; s++) { const g = graft(a, b, s); n33++; if (leaves(g) !== 5 || !set5.has(key(g))) a3 = false; }
  gate("A3 graft of a 3-composite into a 3-composite is a 5-composite (closure)", a3, n33 + " grafts, all closed");
  const res23 = [];
  for (const a of S(2)) for (const b of S(2)) for (let s = 1; s <= 2; s++) res23.push(key(graft(a, b, s)));
  const d3 = S(3).map(key);
  gate("A4 grafting 2-composites into 2-composites yields each 3-composite exactly once", d3.every((k) => res23.filter((x) => x === k).length === 1) && res23.length === 2, res23.length + " grafts");
  let a5 = true, n5 = 0;
  for (const a of S(3)) for (let s = 1; s <= 3; s++) for (let u = s + 1; u <= 3; u++) {
    const b = S(2)[0], c = S(2)[0];
    const g1 = graft(graft(a, b, s), c, u + 1);
    const g2 = graft(graft(a, c, u), b, s);
    n5++; if (key(g1) !== key(g2)) a5 = false;
  }
  gate("A5 grafting at distinct slots is order-independent (the grafting law)", a5, n5 + " cases");
  const wc = [2, 3, 4, 5].map((n) => perms(n).length);
  gate("A6 word room census 2,6,24,120 at arities 2..5", JSON.stringify(wc) === "[2,6,24,120]", wc.join(","));
  const neck = (n) => { const set = new Set(); for (const p of perms(n)) { const s = p.join(""); let b = s; for (let i = 1; i < n; i++) { const r = s.slice(i) + s.slice(0, i); if (r < b) b = r; } set.add(b); } return set.size; };
  const bc = [2, 3, 4, 5].map(neck);
  gate("A7 bracket room census 1,2,6,24 at arities 2..5 (necklace method, Witt cross-check)", JSON.stringify(bc) === "[1,2,6,24]", bc.join(","));
  const table = [[1, 2, 1], [1, 6, 2], [1, 24, 6], [1, 120, 24]];
  gate("A8 the page's address-book rows match machine rooms (all-equal 1, word n!, bracket (n-1)!)", table.every((row, i) => row[0] === 1 && row[1] === wc[i] && row[2] === bc[i]), JSON.stringify(table));
  const g33 = graft(S(3)[0], S(3)[0], 2);
  gate("A9 graft arithmetic |a|+|b|-1: 3+3-1=5 (Fig P63.1's claim)", leaves(g33) === 5 && leaves(S(3)[0]) + leaves(S(3)[0]) - 1 === 5, "graft leaves " + leaves(g33));
  const keys6 = new Set(S(6).map(key));
  gate("A10 the 42 composites of six inputs are 42 distinct trees", keys6.size === 42, "distinct=" + keys6.size);

  poison("AP1 tampered census [1,2,5,16] rejected by the machine", JSON.stringify([1, 2, 5, 16]) !== JSON.stringify(counts), "machine " + counts.join(","));
  poison("AP2 tampered word room (n-1)! rejected", JSON.stringify([1, 2, 6, 24]) !== JSON.stringify(wc), "machine " + wc.join(","));
  poison("AP3 tampered graft arithmetic |a|+|b| rejected", leaves(S(3)[0]) + leaves(S(3)[0]) !== 5, "6 != 5");

  const out = { lab: "p63-lab-a-census", date: "2026-11-10", gates, poisons, summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((p) => p.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p63-lab-a-census.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((p) => !p.caught)) };
}
