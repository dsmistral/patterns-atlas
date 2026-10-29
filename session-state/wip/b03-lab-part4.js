// b03-lab.js — piece p03: the page's censuses (invertibility ties + the 1000 steps census)
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  function gcdI(a, b) { let x = a, y = b; if (y > x) { const t = x; x = y; y = t; } while (y !== 0) { const r = x % y; x = y; y = r; } return x; }
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p03." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  function invertibles(m) { const r = []; for (let a = 1; a < m; a++) { for (let y = 1; y < m; y++) if ((a * y) % m === 1) { r.push(a); break; } } return r; }
  function coprimes(m) { const r = []; for (let a = 1; a < m; a++) if (gcdI(a, m) === 1) r.push(a); return r; }
  const c7 = invertibles(7), c10 = invertibles(10), c12 = invertibles(12);
  CK("invertible classes mod 7 = {1,2,3,4,5,6}", JSON.stringify(c7) === "[1,2,3,4,5,6]", JSON.stringify(c7));
  CK("invertible classes mod 10 = {1,3,7,9}", JSON.stringify(c10) === "[1,3,7,9]", JSON.stringify(c10));
  CK("invertible classes mod 12 = {1,5,7,11}", JSON.stringify(c12) === "[1,5,7,11]", JSON.stringify(c12));
  const k7 = coprimes(7), k10 = coprimes(10), k12 = coprimes(12);
  CK("coprime classes mod 7 = invertible classes", JSON.stringify(k7) === JSON.stringify(c7));
  CK("coprime classes mod 10 = invertible classes", JSON.stringify(k10) === JSON.stringify(c10));
  CK("coprime classes mod 12 = invertible classes", JSON.stringify(k12) === JSON.stringify(c12));
  let easyTotal = 0, easyBad = 0;
  const mods = [[c7, 7], [c10, 10], [c12, 12]];
  for (const pair of mods) for (const a of pair[0]) { easyTotal++; if (gcdI(a, pair[1]) !== 1) easyBad++; }
  CK("easy direction: all 14 invertible classes coprime (14/14)", easyTotal === 14 && easyBad === 0, easyBad + " bad / " + easyTotal);
  function steps(a, b) { let x = a, y = b, s = 0; if (y > x) { const t = x; x = y; y = t; } while (y !== 0) { const r = x % y; x = y; y = r; s++; } return s; }
  let maxS = 0; const argmax = [];
  for (let a = 2; a <= 1000; a++) for (let b = 1; b < a; b++) {
    const s = steps(a, b);
    if (s > maxS) { maxS = s; argmax.length = 0; argmax.push([a, b]); }
    else if (s === maxS) argmax.push([a, b]);
  }
  let pairCount = 0;
  for (let a = 2; a <= 1000; a++) pairCount += a - 1;
  CK("census pairs 1<=b<a<=1000 = 499500", pairCount === 499500, "got " + pairCount);
  CK("census max divisions = 14", maxS === 14, "got " + maxS);
  CK("census argmax = exactly [(987,610)]", JSON.stringify(argmax) === "[[987,610]]", JSON.stringify(argmax));
  CK("census runner-up (610,377) = 13 steps", steps(610, 377) === 13, "got " + steps(610, 377));
  let lameBad = 0;
  for (let a = 2; a <= 1000; a++) for (let b = 1; b < a; b++) {
    if (steps(a, b) > 5 * String(b).length) lameBad++;
  }
  CK("Lame bound steps<=5*digits: 0 violations over the full census", lameBad === 0, lameBad + " bad");
  CK("Lame check worst pair: 14 <= 5*3 = 15", maxS <= 15 && String(610).length === 3 && 5 * 3 === 15, maxS + " vs " + 15);
  P("PIECE p03 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-piece3.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}
