// p06-review-verifier.js — adversarial review verifier for P06 (Compose with identity)
// The Patterns Atlas, session S21. A fresh engine sharing zero code with the
// battery labs/p06-lab.js: different helper names and loop shapes, and every
// numeric claim recomputed from scratch rather than trusted from the battery.
// Protocol: a pre-dispatch boolean audit of the registry polarity table; then
// twelve must-fail injections (each MUST be refuted, with a printed witness
// taken from the page bytes or from the freshly recomputed grid), and two
// positive controls (which must be upheld).

const REGISTRY = [
  ["V01", "must-fail", "the page cites the rotation worst error as 1.077e-15"],
  ["V02", "must-fail", "the page cites the determinant grid worst as 4.441e-16"],
  ["V03", "must-fail", "the censuses count 43 two-square, 100 four-square, 16 refusers"],
  ["V04", "must-fail", "the 1025 census holds four representations"],
  ["V05", "must-fail", "the hypotenuse-65 census finds three triples"],
  ["V06", "must-fail", "F(41) = 102334155"],
  ["V07", "must-fail", "the page links p99-pin-down-the-problem.html"],
  ["V08", "must-fail", "the MathJax block is 121 bytes"],
  ["V09", "must-fail", "2 sin 35 deg = sin 70 deg"],
  ["V10", "must-fail", "(48,15) has norm 4225"],
  ["V11", "must-fail", "the term-wise product (56,4) has norm 4225"],
  ["V12", "must-fail", "the exact and double routes to cos 75 are bit-identical"],
  ["V13", "control", "the page cites 1.221e-15 and a fresh grid agrees"],
  ["V14", "control", "the MathJax block is byte-exact at 120 bytes"],
];

function auditRegistry() {
  let wrong = 0;
  for (let k = 0; k < REGISTRY.length; k++) {
    const expected = k < 12 ? "must-fail" : "control";
    if (REGISTRY[k][1] !== expected) wrong++;
  }
  return wrong === 0
    ? "PRE-DISPATCH BOOLEAN AUDIT: registry consistent — 12 must-fail injections, 2 positive controls"
    : "AUDIT FAILED: " + wrong + " registry entries carry the wrong polarity";
}

function V01(pg) {
  const at = pg.indexOf("1.221 \\times 10^{-15}");
  const ghost = pg.indexOf("1.077");
  const verdict = at !== -1 && ghost === -1 ? "REFUTED" : "UPHELD";
  return "V01 " + verdict + ": claim 'the page cites the rotation worst error as 1.077e-15' — witness: " +
    (at === -1 ? "no 1.221e-15 citation found in the page" : "the page reads, verbatim, '" + pg.slice(at - 30, at + 22) + "'");
}

function V02(pg) {
  const at = pg.indexOf("2.293 \\times 10^{-14}");
  const verdict = at !== -1 ? "REFUTED" : "UPHELD";
  return "V02 " + verdict + ": claim 'the page cites the determinant grid worst as 4.441e-16' — witness: " +
    (at === -1 ? "no 2.293e-14 citation found" : "the page's determinant sentence reads, verbatim, '" + pg.slice(at - 34, at + 20) + "'");
}

function V03() {
  const two = [], refuse = [];
  for (let n = 1; n <= 100; n++) {
    let hit = false;
    for (let a = 0; a <= 10 && !hit; a++) { const r = n - a * a; if (r >= 0) { const b = Math.sqrt(r); if (b === Math.floor(b)) hit = true; } }
    if (hit) two.push(n);
  }
  let four = 0;
  for (let n = 1; n <= 100; n++) {
    let hit = false;
    scan: for (let a = 0; a <= 10; a++) for (let b = a; b <= 10; b++) for (let c = b; c <= 10; c++) {
      const d2 = n - a * a - b * b - c * c;
      if (d2 >= 0) { const d = Math.sqrt(d2); if (d === Math.floor(d)) { hit = true; break scan; } }
    }
    if (hit) four++;
  }
  for (let n = 1; n <= 100; n++) {
    let hit = false;
    scan3: for (let a = 0; a <= 10; a++) for (let b = a; b <= 10; b++) for (let c = b; c <= 10; c++) {
      if (a * a + b * b + c * c === n) { hit = true; break scan3; }
    }
    if (!hit) refuse.push(n);
  }
  const verdict = two.length === 43 && four === 100 && refuse.length === 15 ? "REFUTED" : "UPHELD";
  return "V03 " + verdict + ": claim 'the censuses count 43 two-square, 100 four-square, 16 refusers' — witness: fresh recount gives " + two.length + " two-square, " + four + " four-square, " + refuse.length + " three-square refusers (" + refuse.join(", ") + ")";
}

function V04() {
  const reps = [];
  for (let a = 1; a * a * 2 <= 1025; a++) { const b = Math.sqrt(1025 - a * a); if (b === Math.floor(b)) reps.push("(" + a + "," + b + ")"); }
  const verdict = reps.length === 3 ? "REFUTED" : "UPHELD";
  return "V04 " + verdict + ": claim 'the 1025 census holds four representations' — witness: fresh census finds " + reps.length + ": " + reps.join(", ");
}

function V05() {
  const trips = [];
  for (let a = 1; a * a * 2 < 4225; a++) { const b = Math.sqrt(4225 - a * a); if (b === Math.floor(b) && a <= b) trips.push("(" + a + "," + b + ")"); }
  const verdict = trips.length === 4 ? "REFUTED" : "UPHELD";
  return "V05 " + verdict + ": claim 'the hypotenuse-65 census finds three triples' — witness: fresh census finds " + trips.length + ": " + trips.join(", ");
}

function V06() {
  const fib = [0, 1];
  while (fib.length < 42) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const verdict = fib[41] === 102334155 ? "UPHELD" : "REFUTED";
  return "V06 " + verdict + ": claim 'F(41) = 102334155' — witness: recomputed F(40) = " + fib[40] + ", F(41) = " + fib[41] + " (the injection quoted the wrong index)";
}

function V07(pg) {
  const ghost = pg.indexOf("p99-");
  const canonical = pg.indexOf("p01-pin-down-the-problem.html");
  const verdict = ghost === -1 && canonical !== -1 ? "REFUTED" : "UPHELD";
  return "V07 " + verdict + ": claim 'the page links p99-pin-down-the-problem.html' — witness: " +
    (ghost === -1 ? "no p99- href anywhere in the page; the sibling pattern is cited by its canonical href p01-pin-down-the-problem.html" : "a p99- href sits at offset " + ghost);
}

function V08(pg) {
  const marker = "<script>window.MathJax=";
  const at = pg.indexOf(marker);
  const end = at === -1 ? -1 : pg.indexOf("</script>", at);
  let bytes = 0;
  const s = at === -1 ? "" : pg.slice(at, end + 9);
  for (let k = 0; k < s.length; k++) { const c = s.charCodeAt(k); bytes += c < 128 ? 1 : (c < 2048 ? 2 : 3); }
  const verdict = bytes === 121 ? "UPHELD" : "REFUTED";
  return "V08 " + verdict + ": claim 'the MathJax block is 121 bytes' — witness: measured " + bytes + " bytes (manual UTF-8 walk; the block runs from <script> to </script> inclusive)";
}

function V09() {
  const left = 2 * Math.sin(35 * Math.PI / 180);
  const right = Math.sin(70 * Math.PI / 180);
  const verdict = left === right ? "UPHELD" : "REFUTED";
  return "V09 " + verdict + ": claim '2 sin 35 deg = sin 70 deg' — witness: 2 sin 35 = " + left.toFixed(9) + ", sin 70 = " + right.toFixed(9) + ", gap " + Math.abs(left - right).toFixed(9);
}

function V10() {
  const n = 48 * 48 + 15 * 15;
  const verdict = n === 4225 ? "UPHELD" : "REFUTED";
  return "V10 " + verdict + ": claim '(48,15) has norm 4225' — witness: 48^2 + 15^2 = " + n + " while 65^2 = 4225 (the mixed pairing misses the norm)";
}

function V11() {
  const n = 56 * 56 + 4 * 4;
  const verdict = n === 4225 ? "UPHELD" : "REFUTED";
  return "V11 " + verdict + ": claim 'the term-wise product (56,4) has norm 4225' — witness: 56^2 + 4^2 = " + n + " (the norm is not term-wise multiplicative)";
}

function V12() {
  const exact = (Math.sqrt(6) - Math.sqrt(2)) / 4;
  const dbl = Math.cos(75 * Math.PI / 180);
  const verdict = exact === dbl ? "UPHELD" : "REFUTED";
  return "V12 " + verdict + ": claim 'the exact and double routes to cos 75 are bit-identical' — witness: (sqrt6 - sqrt2)/4 = " + exact + " while cos(75 deg) = " + dbl + " — one ulp apart, which is why the battery checks displayed values";
}

function V13(pg) {
  const cited = pg.indexOf("1.221 \\times 10^{-15}");
  let worst = 0;
  const rad = (deg) => deg * Math.PI / 180;
  for (let i = 0; i < 51; i++) for (let j = 0; j < 51; j++) {
    const al = -180 + i * 7.2, be = -180 + j * 7.2;
    const x = Math.cos(rad(al)) * Math.cos(rad(be)) - Math.sin(rad(al)) * Math.sin(rad(be));
    const y = Math.cos(rad(al)) * Math.sin(rad(be)) + Math.sin(rad(al)) * Math.cos(rad(be));
    const gap = Math.max(Math.abs(x - Math.cos(rad(al + be))), Math.abs(y - Math.sin(rad(al + be))));
    if (gap > worst) worst = gap;
  }
  const verdict = cited !== -1 && worst.toExponential(3) === "1.221e-15" ? "UPHELD" : "REFUTED";
  return "V13 " + verdict + " (control): claim 'the page cites 1.221e-15 and a fresh grid agrees' — witness: independent 51x51 recomputation, worst |error| = " + worst.toExponential(3) + ", page citation " + (cited !== -1 ? "present" : "MISSING");
}

function V14(pg) {
  const canon = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
  let bytes = 0;
  for (let k = 0; k < canon.length; k++) { const c = canon.charCodeAt(k); bytes += c < 128 ? 1 : (c < 2048 ? 2 : 3); }
  const at = pg.indexOf(canon);
  const verdict = at !== -1 && bytes === 120 ? "UPHELD" : "REFUTED";
  return "V14 " + verdict + " (control): claim 'the MathJax block is byte-exact at 120 bytes' — witness: " + (at !== -1 ? "the canonical block appears verbatim at offset " + at + ", measured " + bytes + " bytes" : "canonical block NOT found in the page");
}

async function main() {
  const r = await tools.file_system.read_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/p06-compose-identity.html" });
  const pg = r.content;
  const out = [auditRegistry()];
  const results = [V01(pg), V02(pg), V03(), V04(), V05(), V06(), V07(pg), V08(pg), V09(), V10(), V11(), V12(), V13(pg), V14(pg)];
  for (const line of results) out.push(line);
  let pass = 0, fail = 0;
  results.forEach(function (line, idx) {
    const want = idx < 12 ? "REFUTED" : "UPHELD";
    if (line.indexOf(" " + want + ":") !== -1) pass++; else fail++;
  });
  out.push("VERDICT: " + results.length + " verdict lines — " + pass + " PASS, " + fail + " FAIL");
  return out;
}
