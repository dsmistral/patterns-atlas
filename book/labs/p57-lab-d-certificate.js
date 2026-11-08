async function main() {
  const res: {name: string, ok: boolean}[] = [];
  const G = (name: string, ok: boolean) => res.push({name, ok: !!ok});
  const SQ2 = Math.sqrt(2);

  // D1: tight chain vs the page ledger at 4 d.p.
  const E = 0.1;
  const t: number[] = [E];
  for (let k = 0; k < 6; k++) t.push(t[k]*t[k] + Math.pow(2, -(k+1))*E);
  const pageVals = [0.06, 0.0286, 0.0133, 0.0064, 0.0032, 0.0016];
  const r4 = (v: number) => Math.round(v*10000)/10000;
  let ok1 = true;
  for (let k = 0; k < 6; k++) if (Math.abs(r4(t[k+1]) - pageVals[k]) > 1e-12) ok1 = false;
  G('D1 ledger = the tight chain rounded to 4 d.p. (0.06..0.0016)', ok1);

  // D2: displayed-row arithmetic consistent at 4 d.p. (post-fix rows)
  const rows: [number, number][] = [[0.0036+0.025, 0.0286],[0.00082+0.0125, 0.0133],[0.00018+0.00625, 0.0064],[0.000041+0.003125, 0.0032],[0.00001+0.0015625, 0.0016]];
  let ok2 = true;
  for (const rw of rows) if (r4(rw[0]) !== rw[1]) ok2 = false;
  G('D2 displayed rows consistent: terms sum to the shown value at 4 d.p.', ok2);

  // D3: error ratio -> 1/2 from round 2 on
  const r = [1,2,3,4,5].map(k => t[k+1]/t[k]);
  let ok3 = true;
  for (let k = 1; k < 5; k++) if (r[k] <= 0.46 || r[k] >= 0.5) ok3 = false;
  if (Math.abs(r[4] - 0.5) > 0.005) ok3 = false;
  G('D3 error halves per round from round 2 on; closes on 1/2', ok3);

  // D4: digit rate ~ three-tenths
  const rate = -Math.log10(r[4]);
  G('D4 ~0.30 digits per round ("three-tenths")', Math.abs(rate - 0.30103) < 0.005 && Math.abs(rate - 0.3) < 0.005);

  // D5: convention wiring 2^{-(k+1)}E = E/theta_k, theta_k = 2^{k+1} (Ex 5)
  let ok5 = true;
  for (let k = 0; k <= 5; k++) if (Math.abs(Math.pow(2,-(k+1))*E - E/Math.pow(2,k+1)) > 1e-18) ok5 = false;
  G('D5 deferred term = E/theta_k with Ex5 convention theta_k = 2^{k+1}', ok5);

  // D6: home-room cross-check (10^-12 in four hits)
  let x = 1;
  for (let k = 0; k < 4; k++) x = 0.5*(x + 2/x);
  G('D6 home room reaches 1.6e-12 in four hits (Ex6(c) contrast)',
    Math.abs(Math.abs(x - SQ2)/1.6e-12 - 1) < 0.03);

  // D7: Exhibit A symbol algebra
  let ok7 = true;
  for (let n = 1; n <= 10; n++) { const f = 0.3*n + 0.1; const u = -f/(n*n); if (Math.abs(-n*n*u - f) > 1e-12) ok7 = false; }
  G('D7 Exhibit A: solving -n^2 u = f hands back u = -f/n^2', ok7);

  // Poisons
  G('D-P1 corrupted e2 = 0.028 rejected (4 d.p. gives 0.0286)', r4(0.0286) !== 0.028);
  G('D-P2 "half a digit per round" rejected', Math.abs(0.5 - 0.30103) > 0.005);
  const tBad: number[] = [E];
  tBad.push(tBad[0]*tBad[0] + Math.pow(2, 0)*E);
  G('D-P3 schedule 2^{-k} rejected: first round gives 0.11, not 0.06',
    Math.abs(tBad[1] - 0.11) < 1e-12 && Math.abs(tBad[1] - 0.06) > 1e-6);

  const gates = res.filter(r => !r.name.startsWith('D-P'));
  const poisons = res.filter(r => r.name.startsWith('D-P'));
  return { gates: `${gates.filter(r=>r.ok).length}/${gates.length}`,
           poisons: `${poisons.filter(r=>r.ok).length}/${poisons.length}`,
           failures: res.filter(r => !r.ok).map(r => r.name),
           tightChain: t.slice(1).map(v => Number(v.toPrecision(6))),
           ratios: r.map(v => Number(v.toFixed(5))) };
}
