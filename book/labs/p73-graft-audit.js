async function main() {
  const gates = [], poisons = [];
  const gate = (n, ok, note) => gates.push({ name: n, pass: !!ok, note: note || "" });
  const poison = (n, caught, note) => poisons.push({ name: n, caught: !!caught, note: note || "" });

  // fresh integer shelf machinery: arrays indexed by power of x, plain loops, nothing shared with labs or verifiers
  const N = 64; // working size
  const zeros = (n) => { const a = []; for (let i = 0; i < n; i++) a.push(0); return a; };
  const mulSparse = (a, b) => { const o = zeros(a.length + b.length - 1); for (let i = 0; i < a.length; i++) { if (a[i] === 0) continue; for (let j = 0; j < b.length; j++) { if (b[j] === 0) continue; o[i + j] += a[i] * b[j]; } } return o; };

  // G1 — Euler: odd parts equal distinct parts (external Exemplar 3 + its Fig P73.2)
  const TOP = 41;
  let D = [1]; // prod (1 + x^k), k = 1..40
  for (let k = 1; k <= 40; k++) { const f = zeros(k + 1); f[0] = 1; f[k] = 1; D = mulSparse(D, f).slice(0, TOP); }
  let O = [1]; // prod over odd m of 1/(1 - x^m), shelves to 40
  O = zeros(TOP); O[0] = 1;
  for (let m = 1; m <= 39; m += 2) for (let n = m; n < TOP; n++) O[n] += O[n - m];
  let oddEq = true;
  for (let n = 0; n < TOP; n++) if (D[n] !== O[n]) oddEq = false;
  // independent cross-check: explicit partition lists for n <= 12 (fresh enumerator)
  const listDistinct = (n) => { // all strictly decreasing tuples summing to n (each distinct-part partition exactly once)
    const found = [];
    const stack = [[[], n + 1]]; // cap: next value <= cap - 1 (strictly decreasing), first cap n+1
    while (stack.length) { const st = stack.pop(); const parts = st[0], cap = st[1], s = parts.reduce((x, y) => x + y, 0);
      if (s === n) { found.push(parts.join("+")); continue; }
      for (let v = Math.min(cap - 1, n - s); v >= 1; v--) { const p2 = parts.slice(); p2.push(v); stack.push([p2, v]); } }
    return found;
  };
  const listOdd = (n) => { // all nonincreasing odd tuples summing to n (each odd-part multiset exactly once)
    const found = [];
    const stack = [[[], n + 1]];
    while (stack.length) { const st = stack.pop(); const parts = st[0], cap = st[1], s = parts.reduce((x, y) => x + y, 0);
      if (s === n) { found.push(parts.join("+")); continue; }
      let start = Math.min(cap, n - s); if (start % 2 === 0) start--;
      for (let v = start; v >= 1; v -= 2) { const p2 = parts.slice(); p2.push(v); stack.push([p2, v]); } }
    return found;
  };
  let enumOK = true;
  for (let n = 0; n <= 12; n++) {
    if (listDistinct(n).length !== O[n] || listOdd(n).length !== O[n]) enumOK = false;
  }
  gate("G1 Euler odd=distinct: prod(1+x^k) shelves equal odd-parts product shelves n<=40; explicit lists agree n<=12", oddEq && enumOK, "the external's telescoping identity, product route + list route");

  // G2 — derangements via EGF (external Exhibit B + Exercise P73.3): D_n = n! sum_{k<=n} (-1)^k / k!
  const derEGF = (n) => { let s = 0; let fact = 1; for (let i = 2; i <= n; i++) fact *= i; const nf = fact; for (let k = 0; k <= n; k++) { let kf = 1; for (let i = 2; i <= k; i++) kf *= i; s += (k % 2 === 0 ? 1 : -1) * (nf / kf); } return s; };
  const derDP = [1, 0];
  for (let n = 2; n <= 10; n++) derDP.push(n * derDP[n - 1] + (n % 2 === 0 ? 1 : -1)); // D_n = n D_{n-1} + (-1)^n
  let derOK = true;
  for (let n = 0; n <= 10; n++) if (derEGF(n) !== derDP[n]) derOK = false;
  // binomial convolution identity: n! = sum_k C(n,k) D_{n-k} (the external's starting point)
  const pascal = [[1]];
  for (let r = 1; r <= 24; r++) { const prev = pascal[r - 1], row = [1]; for (let c = 1; c < r; c++) row.push(prev[c - 1] + prev[c]); row.push(1); pascal.push(row); }
  const bin2 = (a, b) => (b < 0 || b > a) ? 0 : pascal[a][b];
  let convOK = true;
  for (let n = 0; n <= 10; n++) { let fact = 1; for (let i = 2; i <= n; i++) fact *= i; let s = 0; for (let k = 0; k <= n; k++) s += bin2(n, k) * derDP[n - k]; if (s !== fact) convOK = false; }
  gate("G2 derangements: EGF extraction n! sum (-1)^k/k! = recurrence D_n = n D_{n-1} + (-1)^n, n<=10; n! = sum_k C(n,k) D_{n-k}; D_1..D_5 = 0,1,2,9,44", derOK && convOK && derDP[1] === 0 && derDP[2] === 1 && derDP[3] === 2 && derDP[4] === 9 && derDP[5] === 44, "the external's labelled-structure route, three ways");

  // G3 — unique base representations (external Exercise P73.4): binary and ternary telescoping products
  let B = [1];
  for (let k = 0; k <= 5; k++) { const f = zeros((1 << k) + 1); f[0] = 1; f[1 << k] = 1; B = mulSparse(B, f); }
  let binOK = B.length === 64 && B.every((v) => v === 1) && mulSparse(B, [1]).length === 64;
  let T = [1];
  for (let k = 0; k <= 3; k++) { const f = zeros(2 * Math.pow(3, k) + 1); f[0] = 1; f[Math.pow(3, k)] = 1; f[2 * Math.pow(3, k)] = 1; T = mulSparse(T, f); }
  let terOK = T.length === 81 && T.every((v) => v === 1); // 3^4 - 1 = 80 shelves + constant = 81 entries, all 1
  gate("G3 binary and ternary uniqueness: prod_{k=0..5}(1+x^{2^k}) = 1+x+...+x^63 all-ones shelves; prod_{k=0..3}(1+x^{3^k}+x^{2*3^k}) all-ones through 80", binOK && terOK, "one representation per n, read off the shelves");

  // G4 — Tower of Hanoi (external Exemplar 1 part 1): a_n = 2^n - 1
  const hanoiPF = (n) => Math.pow(2, n) - 1;
  const hanoiDP = [0];
  for (let n = 1; n <= 20; n++) hanoiDP.push(2 * hanoiDP[n - 1] + 1);
  let hanOK = true;
  for (let n = 0; n <= 20; n++) if (hanoiPF(n) !== hanoiDP[n]) hanOK = false;
  gate("G4 Hanoi: partial fractions 1/(1-2x) - 1/(1-x) = 2^n - 1 equals the DP a_n = 2a_{n-1} + 1, n<=20 (a_10 = 1023)", hanOK && hanoiDP[10] === 1023, "inhomogeneous linear recurrence, external's route");

  // G5 — external Exercise P73.1: a_n = 2*3^n - 2^n from a_0=1, a_1=4, a_n = 5a_{n-1} - 6a_{n-2}
  const ex1PF = (n) => 2 * Math.pow(3, n) - Math.pow(2, n);
  const ex1DP = [1, 4];
  for (let n = 2; n <= 20; n++) ex1DP.push(5 * ex1DP[n - 1] - 6 * ex1DP[n - 2]);
  let ex1OK = true;
  for (let n = 0; n <= 20; n++) if (ex1PF(n) !== ex1DP[n]) ex1OK = false;
  // shelf identity (1-5x+6x^2)A = 1-x
  let shelfOK = true;
  for (let n = 0; n <= 20; n++) { const lhs = ex1DP[n] - (n >= 1 ? 5 * ex1DP[n - 1] : 0) + (n >= 2 ? 6 * ex1DP[n - 2] : 0); const rhs = n === 0 ? 1 : (n === 1 ? -1 : 0); if (lhs !== rhs) shelfOK = false; }
  gate("G5 external Ex P73.1: a_n = 2*3^n - 2^n; (1-5x+6x^2)A = 1-x shelf identity; a_2=14, a_3=46", ex1OK && shelfOK && ex1DP[2] === 14 && ex1DP[3] === 46, "distinct real roots drill, two routes");

  // G6 — external Exercise P73.2: sum C(n,j)^2 = C(2n,n); ordered positive 4-tuples summing to 12 = 165
  let sqOK = true;
  for (let n = 0; n <= 10; n++) { let s = 0; for (let j = 0; j <= n; j++) s += bin2(n, j) * bin2(n, j); if (s !== bin2(2 * n, n)) sqOK = false; }
  let geo4 = [1]; // (x + x^2 + ...)^4 via convolving four shifted geometric shelves
  const shiftGeo = zeros(13); for (let i = 1; i <= 12; i++) shiftGeo[i] = 1;
  let g4 = shiftGeo.slice();
  for (let m = 1; m <= 3; m++) g4 = mulSparse(g4, shiftGeo);
  gate("G6 external Ex P73.2: sum_j C(n,j)^2 = C(2n,n) n<=10; [x^12](x/(1-x))^4 = C(11,3) = 165", sqOK && g4[12] === 165 && bin2(11, 3) === 165, "Vandermonde diagonal + constrained compositions");

  // G7 — the clothesline dictionary (external Fig P73.1): shift, index-weight, prefix sums, convolution — on the tiling census
  const f = [];
  { let a = 1, b = 1; f.push(a); f.push(b); for (let n = 2; n <= 20; n++) { const c = a + b; f.push(c); a = b; b = c; } }
  // right shift: x A(x) shelves = (0, f_0, f_1, ...)
  const rShift = [0].concat(f.slice(0, 20));
  // left shift: (A - a_0)/x shelves = (f_1, f_2, ...)
  const lShift = f.slice(1);
  // index weight: x A'(x) shelves = (n * f_n)
  const wIdx = [];
  for (let n = 0; n <= 20; n++) wIdx.push(n * f[n]);
  // prefix sums: A/(1-x) shelves
  const pref = []; let acc = 0;
  for (let n = 0; n <= 20; n++) { acc += f[n]; pref.push(acc); }
  // convolution: A^2 shelf 20 = sum f_i f_{20-i}
  const conv20 = (() => { let s = 0; for (let i = 0; i <= 20; i++) s += f[i] * f[20 - i]; return s; })();
  // verify by fresh series multiplication of the shelf array with itself
  const fSelf = mulSparse(f.slice(0, 21), f.slice(0, 21));
  gate("G7 clothesline rules: xA = right shift, (A-a_0)/x = left shift, xA' = n*a_n, A/(1-x) = prefix sums, A.B = convolution (A^2 shelf 20 = " + conv20 + ")", rShift[1] === f[0] && rShift[10] === f[9] && lShift[0] === f[1] && wIdx[5] === 5 * f[5] && pref[5] === 1 + 1 + 2 + 3 + 5 + 8 && fSelf[20] === conv20, "the external's dictionary, each rule checked on the tiling census");

  // G8 — the spurious plus branch (external Exhibit A): C_+(x) = x^{-1} - 1 - x - 2x^2 - 5x^3 - ...
  // b shelves of sqrt(1-4x) solved from b circle b = 1 - 4x (fresh route, no binomial theorem)
  const b = [1];
  for (let n = 1; n <= 8; n++) { let inner = 0; for (let j = 1; j < n; j++) inner += b[j] * b[n - j]; b.push((n === 1 ? -4 : -inner) / (2 * b[0])); }
  const bOK = b[1] === -2 && b[2] === -2 && b[3] === -4 && b[4] === -10 && b[5] === -28;
  // plus branch: (1 + sqrt)/(2x) -> shelf -1: (1+1)/2 = 1; shelves n>=0: b_{n+1}/2 (negative Catalans)
  const plusShelves = [];
  for (let n = 0; n <= 5; n++) plusShelves.push(b[n + 1] / 2);
  const plusOK = plusShelves.join(",") === "-1,-1,-2,-5,-14,-42";
  gate("G8 spurious plus branch: sqrt(1-4x) shelves solved from the self-convolution; (1+sqrt)/(2x) = x^{-1} - 1 - x - 2x^2 - 5x^3 - 14x^4 - 42x^5", bOK && plusOK, "the external's Exhibit A expansion, confirmed");

  // poisons
  let Obad = zeros(TOP); Obad[0] = 1;
  for (let m = 2; m <= 40; m += 2) for (let n = m; n < TOP; n++) Obad[n] += Obad[n - m]; // EVEN factors only
  let badMismatch = false;
  for (let n = 0; n < TOP; n++) if (Obad[n] !== D[n]) badMismatch = true;
  poison("GP1 an 'odd-parts' product built from even factors caught: shelves diverge from the distinct-parts shelves", badMismatch, "e.g. shelf 1 reads 0 vs 1 — the coin menus must carry the odd values");
  const derBad = [1, 0];
  for (let n = 2; n <= 10; n++) derBad.push(n * derBad[n - 1]); // recurrence without the (-1)^n term
  poison("GP2 derangement recurrence without the (-1)^n term caught: D_2 reads 0, the true value is 1", derBad[2] !== derDP[2] && derDP[2] === 1, "alternation is load-bearing, exactly as in the coin form");

  const out = { lab: "p73-graft-audit", date: "2026-11-10", gates, poisons, summary: gates.filter((g) => g.pass).length + "/" + gates.length + " gates, " + poisons.filter((q) => q.caught).length + "/" + poisons.length + " poisons" };
  let selfWrite = true;
  try { await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p73-graft-audit.out.json", content: JSON.stringify(out, null, 1) }); } catch (e) { selfWrite = false; }
  return { summary: out.summary, selfWrite, fails: gates.filter((g) => !g.pass).concat(poisons.filter((q) => !q.caught)) };
}
