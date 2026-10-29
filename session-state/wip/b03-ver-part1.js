// b03-review-verifier.js — part 1 of 3: fresh engine (remainder by repeated subtraction, no %, no floor-division) + registry
// Zero code shared with the battery: different algorithms (subtraction-derived quotients, pure subtraction gcd), different names.
function remSub(dividend, divisor) {
  let q = 0, r = dividend;
  while (r >= divisor) { r = r - divisor; q = q + 1; }
  return [q, r];
}
function chainSub(A, B) {
  let big = A, small = B;
  if (small > big) { const t = big; big = small; small = t; }
  const qs = [], rs = [];
  while (small > 0) {
    const qr = remSub(big, small);
    qs.push(qr[0]); rs.push(qr[1]);
    big = small; small = qr[1];
  }
  return { g: big, qs: qs, rs: rs };
}
function gSub(A, B) {
  let x = A, y = B;
  while (x !== 0 && y !== 0) { if (x >= y) { x = x - y; } else { y = y - x; } }
  return x + y;
}
const REG = [];
const row = (id, claim, mustFail, fn) => REG.push({ id: id, claim: claim, mustFail: mustFail, fn: fn });
