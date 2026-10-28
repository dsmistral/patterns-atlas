/* ============================================================================
   The Patterns Atlas — P01 adversarial-review verifier (FRESH ENGINE)
   Session S02, 2026-10-28. Shares zero code with labs/p01-lab.js:
   - diagonals re-derived by direct enumeration over vertex pairs (no formulas
     shared with the lab's pair-counting),
   - 100! recomputed exactly with base-1000 limbs (lab used base-1e9),
   - v5(100!) re-derived by the Legendre-route sum over powers of 5,
   - dA/dt by central difference (lab used a forward time step),
   - Bertrand re-simulated with xorshift32 (lab used a 16807 LCG) and a
     different trial count (N = 80,000 vs 100,000),
   - constants re-transcribed from the PAGE text, not from the lab code.
   MUST-FAIL INJECTION ROWS: the verifier is required to REJECT each injected
   wrong claim (diagonals 55, average 50 km/h, loss 5%, ball ₹10, zeros 25,
   Euler run 41, dA/dt 31.42, Bertrand-M2 0.25). A missed injection is a
   verifier failure.
   ============================================================================*/

/* ---- R1: diagonals / average speed / jacket / bat-and-ball ---- */
function R1(): string[] {
  const rows: string[] = [];
  let d12 = 0;
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) {
    const adj = (j - i === 1) || (i === 0 && j === 11);
    if (!adj) d12++;
  }
  rows.push('ACCEPT 12-gon diagonals | page=54 derived=' + d12 + (d12 === 54 ? '' : ' FAIL'));
  rows.push('INJECTION-CAUGHT diagonals=55 | ' + (d12 !== 55 ? 'caught' : 'MISSED'));

  const avg = 600 / (300 / 60 + 300 / 40);          // independent legs: 300 km
  rows.push('ACCEPT average speed | page=48 derived=' + avg + (avg === 48 ? '' : ' FAIL'));
  rows.push('INJECTION-CAUGHT average=50 | ' + (avg !== 50 ? 'caught' : 'MISSED'));

  const lossFrac = 1 - (250 * 1.2 * 0.8) / 250;      // independent cost: 250
  rows.push('ACCEPT jacket loss fraction | page=0.04 derived=' + lossFrac + (Math.abs(lossFrac - 0.04) < 1e-9 ? '' : ' FAIL'));
  rows.push('INJECTION-CAUGHT loss=0.05 | ' + (Math.abs(lossFrac - 0.05) > 1e-9 ? 'caught' : 'MISSED'));

  let ballOk = -1;                                   // independent route: trial all candidates
  for (let cand = 1; cand <= 60; cand++) if (cand + (cand + 100) === 110) ballOk = cand;
  rows.push('ACCEPT ball price | page=5 derived=' + ballOk + (ballOk === 5 ? '' : ' FAIL'));
  rows.push('INJECTION-CAUGHT ball=10 | ' + (ballOk !== 10 ? 'caught' : 'MISSED'));
  return rows;
}

/* ---- R2: 100! base-1000 + Legendre v5 + Euler sweep (odd-divisor isPrime) ---- */
function R2(): string[] {
  const rows: string[] = [];
  const B = 1000;
  let lim = [1];
  for (let m = 2; m <= 100; m++) {
    let carry = 0;
    const out: number[] = [];
    for (let k = 0; k < lim.length; k++) {
      const v = lim[k] * m + carry;
      out.push(v % B);
      carry = (v - (v % B)) / B;
    }
    while (carry > 0) { out.push(carry % B); carry = (carry - (carry % B)) / B; }
    lim = out;
  }
  let s = String(lim[lim.length - 1]);
  for (let k = lim.length - 2; k >= 0; k--) s += ('00' + String(lim[k])).slice(-3);
  let tz = 0; while (s.charAt(s.length - 1 - tz) === '0') tz++;
  rows.push('ACCEPT 100! trailing zeros | page=24 derived=' + tz + (tz === 24 ? '' : ' FAIL'));
  rows.push('ACCEPT 100! digit count | page=158 derived=' + s.length + (s.length === 158 ? '' : ' FAIL'));
  rows.push('ACCEPT 100! leading digits | page=933262154439 derived=' + s.slice(0, 12) + (s.slice(0, 12) === '933262154439' ? '' : ' FAIL'));
  rows.push('INJECTION-CAUGHT zeros=25 | ' + (tz !== 25 ? 'caught' : 'MISSED'));

  let v5 = 0;
  for (let p = 5; p <= 100; p = p * 5) v5 += Math.floor(100 / p);
  rows.push('ACCEPT v5(100!) | page=24 derived=' + v5 + (v5 === 24 ? '' : ' FAIL'));

  const primeOf = (m: number) => {
    if (m < 2) return false;
    if (m === 2) return true;
    if (m % 2 === 0) return false;
    let d = 3;
    while (d * d <= m) { if (m % d === 0) return false; d += 2; }
    return true;
  };
  let run = 0, firstComp = -1;
  for (let n = 0; n <= 45; n++) {
    const val = n * n + n + 41;
    if (firstComp === -1) { if (primeOf(val)) run++; else firstComp = n; }
  }
  rows.push('ACCEPT Euler run length | page=40 derived=' + run + (run === 40 ? '' : ' FAIL'));
  rows.push('ACCEPT Euler first composite | page=40 derived=' + firstComp + (firstComp === 40 ? '' : ' FAIL'));
  rows.push('INJECTION-CAUGHT run=41 | ' + (run !== 41 ? 'caught' : 'MISSED'));
  return rows;
}

/* ---- R3: dA/dt central difference + Bertrand with xorshift32, N=80000 ---- */
function R3(): string[] {
  const rows: string[] = [];
  const h = 0.000001;
  const areaAt = (t: number) => Math.PI * (5 + 2 * t) * (5 + 2 * t);
  const central = (areaAt(h) - areaAt(-h)) / (2 * h);
  rows.push('ACCEPT dA/dt central-diff | page=62.83 derived=' + central.toFixed(2) + (central.toFixed(2) === '62.83' ? '' : ' FAIL'));
  rows.push('INJECTION-CAUGHT dA/dt=31.42 | ' + (central.toFixed(2) !== '31.42' ? 'caught' : 'MISSED'));

  let st = 2463534242 >>> 0;
  const xs = () => {
    st ^= st << 13; st >>>= 0;
    st ^= st >>> 17;
    st ^= st << 5; st >>>= 0;
    return st / 4294967296;
  };
  const T = Math.sqrt(3);
  const N = 80000;
  let h1 = 0, h2 = 0, h3 = 0;
  for (let i = 0; i < N; i++) {
    const ang = xs() * 2 * Math.PI;
    if (Math.sqrt(2 - 2 * Math.cos(ang)) > T) h1++;       // chord length via cosine law
    const d2 = xs();
    if (2 * Math.sqrt(1 - d2 * d2) > T) h2++;
    const d3 = Math.sqrt(1 - xs());                          // 1−u is uniform; independent transcription
    if (2 * Math.sqrt(1 - d3 * d3) > T) h3++;
  }
  const p1 = h1 / N, p2 = h2 / N, p3 = h3 / N;
  rows.push('ACCEPT Bertrand M1 | exact 1/3 derived=' + p1.toFixed(4) + (Math.abs(p1 - 1 / 3) < 0.01 ? '' : ' FAIL'));
  rows.push('ACCEPT Bertrand M2 | exact 1/2 derived=' + p2.toFixed(4) + (Math.abs(p2 - 0.5) < 0.01 ? '' : ' FAIL'));
  rows.push('ACCEPT Bertrand M3 | exact 1/4 derived=' + p3.toFixed(4) + (Math.abs(p3 - 0.25) < 0.01 ? '' : ' FAIL'));
  rows.push('INJECTION-CAUGHT M2=0.25 | ' + (Math.abs(p2 - 0.25) > 0.01 ? 'caught (derived ' + p2.toFixed(4) + ')' : 'MISSED'));
  return rows;
}

const all = [...R1(), ...R2(), ...R3()];
console.log(all.join('\n'));
const bad = all.filter(r => r.includes('FAIL') || r.includes('MISSED'));
console.log(bad.length === 0 ? 'VERDICT: R1+R2+R3 ALL PASS' : 'VERDICT: FAIL — ' + bad.join(' ; '));
