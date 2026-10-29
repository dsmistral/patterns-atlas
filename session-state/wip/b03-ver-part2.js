// b03-review-verifier.js — part 2 of 3: the injection rows (must be refuted with printed witnesses) and controls
row("V01", "gcd(1071,462) = 22", true, () => {
  const g = gSub(1071, 462);
  const w = remSub(1071, 22);
  return { refuted: g === 21 && w[1] !== 0, witness: "subtraction gcd gives 21; 1071 leaves " + w[1] + " on division by 22 (" + w[0] + " stacks of 22, leftover " + w[1] + ") — 22 is not even a divisor of 1071" };
});
row("V02", "the (1071,462) dance takes 4 divisions", true, () => {
  const c = chainSub(1071, 462);
  return { refuted: c.qs.length === 3, witness: "the subtraction chain has " + c.qs.length + " divisions (quotients " + c.qs.join(",") + "), not 4" };
});
row("V03", "the (1071,462) quotients are [2,3,8]", true, () => {
  const c = chainSub(1071, 462);
  return { refuted: c.qs[2] === 7, witness: "third quotient is " + c.qs[2] + ": 7 stacks of 21 consume 147 exactly; 8 stacks would be 168, not 147" };
});
row("V04", "7 divides both 2026 and 1491", true, () => {
  const a = remSub(2026, 7), b = remSub(1491, 7);
  return { refuted: a[1] !== 0, witness: "1491 = " + b[0] + "x7 exactly, but 2026 = " + a[0] + "x7 + " + a[1] + " — the leftover " + a[1] + " refutes the shared factor" };
});
row("V05", "2026 x 1321 leaves 2 on division by 1491", true, () => {
  const prod = 2026 * 1321;
  const d = remSub(prod, 1491);
  return { refuted: d[1] === 1, witness: "2026 x 1321 = " + prod + " = " + d[0] + " x 1491 + " + d[1] + " — leftover " + d[1] + ", not 2" };
});
row("V06", "(987,610) takes 15 divisions", true, () => {
  const c = chainSub(987, 610);
  return { refuted: c.qs.length === 14, witness: "the chain has " + c.qs.length + " divisions — thirteen quotients 1, then 2 — not 15" };
});
row("V07", "the steps-census champion below 1000 is (988,611)", true, () => {
  const claimed = chainSub(988, 611), real = chainSub(987, 610);
  return { refuted: claimed.qs.length < real.qs.length, witness: "(988,611) takes only " + claimed.qs.length + " divisions while (987,610) takes " + real.qs.length + " — the claimed champion loses" };
});
row("V08", "every common divisor of (1071,462) divides 20", true, () => {
  const d = remSub(20, 7);
  return { refuted: d[1] !== 0, witness: "7 divides both 1071 and 462, but 20 = 2x7 + " + d[1] + " — 7 does not divide 20" };
});
row("V09", "Box B03.A says every common divisor is at least the gcd", true, () => {
  return { refuted: 1 < 21, witness: "1 is a common divisor of (1071,462) and 1 < 21 — the box says every common divisor DIVIDES the gcd, not exceeds it" };
});
row("V10", "gcd(48,36) = 6", true, () => {
  const g = gSub(48, 36);
  const c48 = remSub(48, 12), c36 = remSub(36, 12);
  return { refuted: g === 12 && c48[1] === 0 && c36[1] === 0, witness: "subtraction gcd gives 12; 48 = " + c48[0] + "x12 + 0 and 36 = " + c36[0] + "x12 + 0 — 6 divides both but 12 is greater, so 6 is not the greatest" };
});
row("V11", "(n-1)^2 leaves 0 on division by n, for every n >= 2", true, () => {
  const d = remSub(81, 10);
  return { refuted: d[1] === 1, witness: "at n = 10: 9^2 = 81 = " + d[0] + "x10 + " + d[1] + " — leftover " + d[1] + ", not 0" };
});
row("V12", "the invertible classes mod 12 are {1,5,7,9}", true, () => {
  let nine = [];
  for (let y = 0; y < 12; y++) nine.push(remSub(9 * y, 12)[1]);
  const c11 = remSub(121, 12);
  return { refuted: nine.indexOf(1) < 0 && c11[1] === 1, witness: "9 x y runs through " + nine.join(",") + " — never 1, so 9 is NOT invertible; and 11x11 = 121 = " + c11[0] + "x12 + " + c11[1] + " — 11 IS invertible and missing from the claimed list" };
});
row("V13", "the halving engine strengthens to r2 < b/3", true, () => {
  const c = chainSub(100, 60);
  const r2 = c.rs[1];
  return { refuted: !(r2 < 60 / 3), witness: "at (100,60): r1 = " + c.rs[0] + ", r2 = " + r2 + ", and b/3 = 20 — r2 equals b/3 exactly, so r2 < b/3 fails (the page's honest claim r2 < b/2 holds: 20 < 30)" };
});
row("V14", "Fig B03.1's rectangle is tiled by two 462-squares, three 147-squares and six 21-squares", true, () => {
  const claimed = 2 * 462 * 462 + 3 * 147 * 147 + 6 * 21 * 21;
  const truth = 1071 * 462;
  return { refuted: claimed !== truth, witness: "claimed area " + claimed + " vs rectangle area " + truth + " — a gap of " + (truth - claimed) + " = one missing 21x21 square" };
});
row("C1", "control: the shipped page's MathJax block is the standard 120 bytes", false, async (page) => {
  const idx = page.indexOf("<script>window.MathJax");
  let len = 0;
  while (page[idx + len] !== "\n") len++;
  return { upheld: idx >= 0 && len === 120, witness: "block found at byte offset " + idx + ", length " + len + " B" };
});
row("C2", "control: the (2026,1491) dance ends at leftover 1 in 9 divisions (coprime)", false, async () => {
  const c = chainSub(2026, 1491);
  const last = c.rs[c.rs.length - 2];
  return { upheld: c.g === 1 && c.qs.length === 9 && last === 1, witness: "chain: quotients " + c.qs.join(",") + " — last nonzero leftover " + last + " after " + c.qs.length + " divisions" };
});
