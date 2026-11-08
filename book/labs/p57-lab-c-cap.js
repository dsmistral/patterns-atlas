async function main() {
  const res: {name: string, ok: boolean}[] = [];
  const G = (name: string, ok: boolean) => res.push({name, ok: !!ok});

  // C1: deferred sup = 1/(theta+1), brute
  const thetas = [2,4,8,16];
  let ok1 = true;
  for (const t of thetas) {
    let sup = 0;
    for (let n = t+1; n <= 2000; n++) { const v = 1/n; if (v > sup) sup = v; }
    if (Math.abs(sup - 1/(t+1)) > 1e-15) ok1 = false;
  }
  G('C1 sup_{n>theta} 1/n = 1/(theta+1) (brute to n=2000)', ok1);

  // C2: the ledger values
  G('C2 the ledger: 1/3, 1/5, 1/9, 1/17',
    thetas.every((t, i) => Math.abs(1/(t+1) - [1/3, 1/5, 1/9, 1/17][i]) < 1e-15));

  // C3: ratios — a little over half, closing on half
  const vals = thetas.map(t => 1/(t+1));
  const ratios = [vals[1]/vals[0], vals[2]/vals[1], vals[3]/vals[2]];
  G('C3 each a little over half the last, closing on half (0.600, 0.556, 0.529)',
    ratios.every(r => r > 0.5 && r < 0.625) && ratios[0] > ratios[1] && ratios[1] > ratios[2] && ratios[2] < 0.535);

  // C4: slack 1/(theta+1) <= 1/theta
  G('C4 1/(theta+1) <= 1/theta (the slack bound)', thetas.every(t => 1/(t+1) <= 1/t));

  // C5: geometric total = exactly one unit
  let s = 0; for (let k = 0; k <= 60; k++) s += Math.pow(2, -(k+1));
  G('C5 sum 2^{-(k+1)} = 1 - 2^{-61} -> "exactly one unit"',
    Math.abs(s - (1 - Math.pow(2, -61))) < 1e-15 && Math.abs(s - 1) < 1e-12);

  // C6: general power between rooms
  let ok6 = true;
  for (const pair of [[1,2],[2,3],[1,3],[2,4]]) {
    const sLo = pair[0], sHi = pair[1];
    for (const t of [2, 8]) {
      let sup = 0;
      for (let n = t+1; n <= 400; n++) { const v = Math.pow(n, sLo - sHi); if (v > sup) sup = v; }
      if (Math.abs(sup - Math.pow(t+1, -(sHi-sLo))) > 1e-12) ok6 = false;
    }
  }
  G('C6 deferred mass = (theta+1)^{-(sbar-s)} (4 room pairs, brute)', ok6);

  // C7: pattern-box budget line
  let ok7 = true;
  for (const sg of [1,2,3,4]) {
    let b = 0; for (let k = 0; k <= 60; k++) b += Math.pow(2, -k*sg);
    if (Math.abs(b - Math.pow(2, sg)/(Math.pow(2, sg)-1)) > 1e-12) ok7 = false;
  }
  G('C7 budget sum_k 2^{-k*sigma} = 2^s/(2^s-1), finite (sigma=1..4)', ok7);

  // Poisons
  G('C-P1 off-by-one 1/theta claim rejected (theta=2: sup is 1/3, not 1/2)',
    Math.abs(1/2 - 1/3) > 1e-15);
  let sBad = 0; for (let k = 0; k <= 60; k++) sBad += Math.pow(2, -k);
  G('C-P2 doubled bill (2^{-k} schedule) rejected: sums to 2, not 1',
    Math.abs(sBad - 2) < 1e-12 && Math.abs(sBad - 1) > 1e-12);
  G('C-P3 wrong power sign rejected: (theta+1)^{+(sbar-s)} is not the sup',
    Math.abs(Math.pow(3, 1) - 1/3) > 1e-12);

  const gates = res.filter(r => !r.name.startsWith('C-P'));
  const poisons = res.filter(r => r.name.startsWith('C-P'));
  return { gates: `${gates.filter(r=>r.ok).length}/${gates.length}`,
           poisons: `${poisons.filter(r=>r.ok).length}/${poisons.length}`,
           failures: res.filter(r => !r.ok).map(r => r.name),
           ratios: ratios.map(r => Number(r.toFixed(4))) };
}
