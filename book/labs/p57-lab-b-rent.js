async function main() {
  const res: {name: string, ok: boolean}[] = [];
  const G = (name: string, ok: boolean) => res.push({name, ok: !!ok});
  const w = (n: number) => { let s = 0; for (let m = 1; m < n; m++) s += 1/(m*m*m*(n-m)*(n-m)); return s; };

  // B1 exact census values
  G('B1 w2=1, w3=3/8, w4=155/864, w5=175/1728',
    Math.abs(w(2) - 1) < 1e-14 && Math.abs(w(3) - 3/8) < 1e-14 &&
    Math.abs(w(4) - 155/864) < 1e-14 && Math.abs(w(5) - 175/1728) < 1e-14);

  // B2 page decimals
  G('B2 page decimals 0.375 / 0.1794 / 0.1013',
    Math.abs(w(3) - 0.375) < 1e-12 && Math.abs(w(4) - 0.1794) < 5e-5 && Math.abs(w(5) - 0.1013) < 5e-5);

  // B3 room factors + monotone
  const rf = [2,3,4,5].map(n => n*n*n*w(n));
  G('B3 room factors 1-dp 8.0/10.1/11.5/12.7, monotone',
    Math.abs(rf[0]-8) < 0.05 && Math.abs(rf[1]-10.1) < 0.05 && Math.abs(rf[2]-11.5) < 0.05 && Math.abs(rf[3]-12.7) < 0.05
    && rf[0] < rf[1] && rf[1] < rf[2] && rf[2] < rf[3]);

  // B4 Ex2(a) LCD arithmetic
  G('B4 LCD sums: (288+81+96)/2592 = 155/864; (108+24+16+27)/1728 = 175/1728',
    Math.abs((288+81+96)/2592 - 155/864) < 1e-15 && Math.abs((108+24+16+27)/1728 - 175/1728) < 1e-15);

  // B5 Ex2(c): room factor >= n, brute
  let okRF = true;
  for (let n = 2; n <= 300; n++) if (n*n*n*w(n) < n - 1e-12) okRF = false;
  G('B5 room factor >= n for n=2..300 (Ex2(c), one-derivative loss)', okRF);

  // B6 zeta(3)
  let z = 0; for (let m = 1; m <= 1000000; m++) z += 1/(m*m*m);
  G('B6 zeta(3) = 1.2020569...; page 1.2021', Math.abs(z - 1.2020569) < 1e-6 && Math.abs(z - 1.2021) < 1e-4);

  // B7 room factor at n=10
  G('B7 room factor at n=10 is 18.3 (exact 18.281)', Math.abs(1000*w(10) - 18.3) < 0.05);

  // B8 n^2 w_n -> zeta(3) from above, decreasing (n=100..800)
  const big = [100, 200, 400, 800].map(n => n*n*w(n));
  let okB8 = true;
  for (let i = 0; i < 4; i++) if (big[i] <= z) okB8 = false;
  for (let i = 1; i < 4; i++) if (big[i] >= big[i-1]) okB8 = false;
  if (Math.abs(big[3] - z) > 0.015) okB8 = false;
  G('B8 n^2 w_n decreases to zeta(3), stays above (Exemplar 1)', okB8);

  // B9 Ex3(a) numerics: n^2 w_n strictly decreasing for n>=3, in (1,4)
  let okB9 = true;
  let prev = 9*w(3);
  for (let n = 4; n <= 100; n++) { const cur = n*n*w(n); if (cur >= prev || cur <= 1 || cur > 4) okB9 = false; prev = cur; }
  G('B9 Ex3(a): n^2 w_n strictly decreasing, in (1,4), for n=3..100', okB9 && 9*w(3) < 4);

  // B10 Ex3(c): harmonic ~ log (Euler gamma witness)
  let Hn = 0; for (let m = 1; m < 1000; m++) Hn += 1/m;
  G('B10 H(999) - ln(1000) -> Euler gamma (log growth of the 1/n sums)',
    Math.abs(Hn - Math.log(1000) - 0.57721) < 0.001);

  // B11 room-0 boundary: exact 1/n diverges like log; slack converges
  const wExact = (n: number) => { let s = 0; for (let m = 1; m < n; m++) s += 1/m; return s; };
  const wSlack = (n: number, eps: number) => { let s = 0; for (let m = 1; m < n; m++) s += Math.pow(m, -1-eps)*Math.pow(n-m, -eps); return s; };
  const ratio = wExact(500)/wExact(250);
  G('B11 room-0 boundary: exact 1/n product = H ~ log (grows); slack n^-1.25 product converges',
    wExact(500) > wExact(250) && Math.abs(ratio - Math.log(500)/Math.log(250)) < 0.02
    && wSlack(400, 0.25) < wSlack(200, 0.25) && wSlack(400, 0.25) < 5);

  // Poisons
  G('B-P1 corrupted 155/846 rejected by the B1 detector', Math.abs(155/864 - 155/846) > 1e-14);
  G('B-P2 non-monotone room factors rejected (rf[2] > rf[1], so a swap fires)', !(rf[2] < rf[1]));
  G('B-P3 zeta typo 1.2201 rejected', Math.abs(z - 1.2201) > 1e-6);

  const gates = res.filter(r => !r.name.startsWith('B-P'));
  const poisons = res.filter(r => r.name.startsWith('B-P'));
  return { gates: `${gates.filter(r=>r.ok).length}/${gates.length}`,
           poisons: `${poisons.filter(r=>r.ok).length}/${poisons.length}`,
           failures: res.filter(r => !r.ok).map(r => r.name),
           n2w_samples: big.map((v, i) => [ [100,200,400,800][i], Number(v.toFixed(5)) ]) };
}
