async function main() {
  const rd: any = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p57-page.html' });
  const page: string = rd.content;
  const res: {name: string, ok: boolean}[] = [];
  const G = (name: string, ok: boolean) => res.push({name, ok: !!ok});
  const BS = String.fromCharCode(92);
  const cnt = (needle: string) => page.split(needle).length - 1;
  const is = (needle: string, n: number) => cnt(needle) === n;

  G('F0 page read intact (not truncated, ~34 KB)', rd.was_truncated === false && page.length > 33000);
  G('F1 census fractions: 3/2 x3 (table, Ex1(b), Ex7 kappa), 17/12, 577/408, 665857/470832 x1',
    is('3/2', 3) && is('17/12', 1) && is('577/408', 1) && is('665857/470832', 1));
  G('F2 error needles: 4.1e-1 x2, 8.6e-2 x2, 2.5e-3 x1, 2.1e-6 x2, 1.6e-12 x3',
    is('4.1 ' + BS + 'times 10^{-1}', 2) && is('8.6 ' + BS + 'times 10^{-2}', 2)
    && is('2.5 ' + BS + 'times 10^{-3}', 1) && is('2.1 ' + BS + 'times 10^{-6}', 2)
    && is('1.6 ' + BS + 'times 10^{-12}', 3));
  G('F3 rent needles: 155/864 x2, 175/1728 x2, 3/8 x1; 8.0 x4, 10.1 x5, 11.5 x4, 12.7 x4',
    is('155/864', 2) && is('175/1728', 2) && is('3/8', 1)
    && is('8.0', 4) && is('10.1', 5) && is('11.5', 4) && is('12.7', 4));
  G('F4 18.3 x1; 1.2021 x2; zeta(3) x3; 10.125/11.481/12.659 x1',
    is('18.3', 1) && is('1.2021', 2) && is('zeta(3)', 3) && is('10.125', 1) && is('11.481', 1) && is('12.659', 1));
  G('F5 1/3, 1/5, 1/9, 1/17 x3', is('1/3, 1/5, 1/9, 1/17', 3));
  G('F6 Ex6: 0.06 x2, 0.0286/0.0133/0.0064/0.0032/0.0016 x1; exact deferred terms; 4 d.p. note',
    is('0.06', 2) && is('0.0286', 1) && is('0.0133', 1) && is('0.0064', 1) && is('0.0032', 1) && is('0.0016', 1)
    && is('0.003125', 1) && is('0.0015625', 1) && is('sums rounded to four decimal places', 1));
  G('F7 "a little over half the last" x1; old "roughly half" gone',
    is('a little over half the last, closing on half', 1) && is('roughly half the last', 0));
  const moons = String.fromCharCode(9679,9675,9675,32,9679,9679,9675,32,9679,9679,9679,32,9670,32,9680,32,9680,32,9680);
  G('F8 moons x1; Exercise 1-7 headers x1; Hint x6, Worked answer x7',
    is(moons, 1)
    && [1,2,3,4,5,6,7].every(i => is('Exercise ' + i + ' ' + String.fromCharCode(183), 1))
    && is('<summary>Hint', 6) && is('<summary>Worked answer', 7));
  const enc = page.indexOf('id="encounter"'), pat = page.indexOf('id="pattern"');
  const slice = page.slice(enc, pat);
  const names = ['Nash','Moser','Newton','Hamilton','Kantorovich','Raphson','Kolmogorov','Arnold','KAM'];
  G('F9 §2 encounter slice name-free (9 names, zero hits)',
    names.every(nm => slice.indexOf(nm) === -1));
  const sec3 = page.slice(pat, page.indexOf('id="exemplars"'));
  const EN = String.fromCharCode(8211);
  G('F10 Nash-Moser (en-dash) x4 page, x1 in §3; hyphen variant x0; KAM lineage named x1',
    is('Nash' + EN + 'Moser', 4)
    && (sec3.split('Nash' + EN + 'Moser').length - 1) === 1
    && is('Nash-Moser', 0) && is('Kolmogorov' + EN + 'Arnold' + EN + 'Moser', 1));
  G('F11 door-quotes verbatim: "built directly on this page" x1; far-door tail x1',
    is('built directly on this page', 1) && is('ground keeps changing under the tangent', 1));
  G('F12 lineage: 1669, 1690 / 1948-49 / 1954-1956 / 1961-1966 / 1982 / fluxions x1',
    is('1669, 1690', 1) && is('1948' + EN + '49', 1)
    && is('1954' + EN + '1956', 1) && is('1961' + EN + '1966', 1)
    && is('1982', 1) && is('method of fluxions', 1));
  G('F13 floor-convention digits (P22-consistent): forty-eight digits x1, forty-nine x0, two/five digits x1, (eleven) x1; sketch-not-proof x1; door-with-name x3; three-tenths x2; (P58, planned) x2; twelfth x0; no p58/self href',
    is('forty-eight digits', 1) && is('forty-nine', 0)
    && is('two digits', 1) && is('five digits', 1) && is('(eleven)', 1)
    && is('three digits', 0) && is('six digits', 0)
    && is('sketch, not proof', 1)
    && is('door with its name on it', 3) && is('three-tenths of a digit per round', 2)
    && is('(P58, planned)', 2) && is('twelfth', 0) && is('p58-', 0) && is('p57-nash-moser.html', 0));
  G('F14 grafts locked + G2 correction locked: Ex7 header x1, free immersion x1, Günther x1, Diophantine x2, Liouville x1, golden rotation x1, cannot-be-frozen x1, seven exercises x1, six x0; honest balance E/e_k^2 x2, sigma = 3d x2, reserve triple the rent x2, superlinear x2; external slips absent (kappa = 1 + x0, symmetric point x0, sqrt{5} x0, e^{-e^ x0)',
    is('How fast should the cap grow?', 1) && is('free immersion', 1) && is('Günther', 1)
    && is('Diophantine', 2) && is('Liouville', 1) && is('golden rotation', 1)
    && is('cannot be frozen', 1) && is('seven exercises', 1) && is('six exercises', 0)
    && is('E/e_k^2', 2) && is(BS + 'sigma = 3d', 2) && is('reserve triple the rent', 2) && is('superlinear', 2)
    && is(BS + 'kappa = 1 +', 0) && is('the symmetric point', 0)
    && is(BS + 'sqrt{5}', 0) && is('e^{-e^', 0));

  // Poisons
  G('F-P1 doctored slice detector fires (injected "Newton" caught)',
    ('x Newton modes'.indexOf('Newton') !== -1) && names.includes('Newton'));
  G('F-P2 wrong expected count rejected (155/864 is x2, not x3)', !is('155/864', 3));
  G('F-P3 hyphen variant detector (Nash-Moser would be caught)', is('Nash-Moser', 0) && 'Nash-Moser' !== 'Nash' + EN + 'Moser');

  const gates = res.filter(r => !r.name.startsWith('F-P'));
  const poisons = res.filter(r => r.name.startsWith('F-P'));
  return { gates: `${gates.filter(r=>r.ok).length}/${gates.length}`,
           poisons: `${poisons.filter(r=>r.ok).length}/${poisons.length}`,
           failures: res.filter(r => !r.ok).map(r => r.name),
           bytesRead: page.length };
}
