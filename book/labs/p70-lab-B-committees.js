// Lab B — P70 committee identities. All checks GREEN.
function main() {
  const out = [];
  const C = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };
  let okId = true, badId = null;
  for (let n = 1; n <= 12 && okId; n++) for (let k = 1; k <= n; k++)
    if (k * C(n,k) !== n * C(n-1,k-1)) { okId = false; badId = [n,k]; break; }
  out.push(['k*C(n,k) = n*C(n-1,k-1) for 1<=k<=n<=12', okId, badId]);
  let okSum = true, badSum = null;
  for (let n = 1; n <= 14; n++) {
    let s = 0; for (let k = 1; k <= n; k++) s += k * C(n,k);
    if (s !== n * Math.pow(2, n-1)) { okSum = false; badSum = n; break; }
  }
  out.push(['sum_k k*C(n,k) = n*2^(n-1) for n<=14', okSum, badSum]);
  out.push(['toy n=4,k=2: 2*6 = 4*3 = 12', 2*C(4,2) === 12 && 4*C(3,1) === 12, null]);
  return out;
}
// result: 3/3 GREEN (see wip/p70-labs-receipt.out.json)
