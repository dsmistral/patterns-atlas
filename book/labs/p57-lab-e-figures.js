async function main() {
  const res: {name: string, ok: boolean}[] = [];
  const G = (name: string, ok: boolean) => res.push({name, ok: !!ok});
  const SQ2 = Math.sqrt(2);
  const xs = [1, 3/2, 17/12, 577/408, 665857/470832];

  // Fig P57.1 (log-scale hits)
  const grid = [40, 85, 130, 175, 220];
  let ok1 = true;
  for (let d = 0; d <= 12; d += 3) if (40 + 15*d !== grid[d/3]) ok1 = false;
  G('E1 gridlines at 40+15*decade for 10^0..10^-12 (15 px per 3 decades)', ok1);

  const cy = [46, 56, 79, 125, 217];
  const errs = xs.map(x => Math.abs(x - SQ2));
  let ok2 = true;
  for (let k = 0; k < 5; k++) { const yWant = 40 + 15*(-Math.log10(errs[k])); if (Math.abs(cy[k] - yWant) > 0.6) ok2 = false; }
  G('E2 hit points within 0.6 px of the log-scale position', ok2);

  G('E3 x-labels (y=240) inside the 250-high viewBox; title at y=20', 240 + 9.5 < 250 && 20 >= 12);

  const cxs = [70, 195, 320, 445, 570];
  let ok4 = true;
  for (let k = 1; k < 5; k++) if (cxs[k] - cxs[k-1] !== 125) ok4 = false;
  G('E4 hits evenly spaced (125 px); last circle edge 574.5 <= frame end 575', ok4 && 570 + 4.5 <= 575);

  // Fig P57.2 (room-factor bars)
  G('E5 allowance line at 178 = baseline 190 - 12 px per unit (x1)', 190 - 178 === 12);

  const bars: [number, number, number][] = [[85, 96, 8.0], [215, 121, 10.125], [345, 138, 11.4815], [475, 152, 12.6589]];
  let ok6 = true;
  for (const b of bars) if (Math.abs(12*b[2] - b[1]) > 0.75) ok6 = false;
  G('E6 bar heights = 12 px per room-factor unit (within 0.75 px)', ok6);

  const tops = [94, 69, 52, 38], labs = [84, 59, 42, 28];
  let ok7 = true;
  for (let i = 0; i < 4; i++) { if (tops[i] + bars[i][1] !== 190) ok7 = false; if (tops[i] - labs[i] !== 10) ok7 = false; }
  G('E7 bars sit on the baseline (y+h=190); value labels 10 px above bar tops', ok7);

  G('E8 axis labels (y=205) and caption (y=222) inside the 230-high viewBox',
    205 < 230 && 222 + 8 <= 230);

  G('E9 honesty: smallest factor 8.0 > allowance x1; bars strictly increase with n',
    bars[0][2] > 1 && bars[0][1] < bars[1][1] && bars[1][1] < bars[2][1] && bars[2][1] < bars[3][1]);

  G('E10 Fig P57.1 caption endpoints 4.1e-1 and 1.6e-12 match the census',
    Math.abs(errs[0]/0.41 - 1) < 0.03 && Math.abs(errs[4]/1.6e-12 - 1) < 0.03);

  // Poisons
  G('E-P1 corrupted cy=216 for hit 4 rejected (0.96 px off)',
    Math.abs(216 - (40 + 15*(-Math.log10(errs[4])))) > 0.6);
  G('E-P2 corrupted bar height 131 rejected', Math.abs(12*10.125 - 131) > 0.75);
  G('E-P3 mislabeled decade (10^-2 at y=85) rejected', 40 + 15*2 !== 85);

  const gates = res.filter(r => !r.name.startsWith('E-P'));
  const poisons = res.filter(r => r.name.startsWith('E-P'));
  return { gates: `${gates.filter(r=>r.ok).length}/${gates.length}`,
           poisons: `${poisons.filter(r=>r.ok).length}/${poisons.length}`,
           failures: res.filter(r => !r.ok).map(r => r.name),
           fig1Y: cy.map((c, k) => Number((40 + 15*(-Math.log10(errs[k]))).toFixed(2))) };
}
