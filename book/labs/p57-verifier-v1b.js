async function main() {
  const rd: any = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p57-page.html' });
  const page: string = rd.content;
  const r: any = await tools.github_app.get_file_contents({ owner: 'dsmistral', repo: 'patterns-atlas', path: 'book/p22-fixed-point.html', ref: 'refs/heads/main' });
  const arr = Array.isArray(r) ? r : [r];
  let p22 = '';
  for (const el of arr) {
    const t = (el && el.resource && typeof el.resource.text === 'string') ? el.resource.text : (typeof el === 'string' ? el : '');
    if (t.length > p22.length) p22 = t;
  }
  const res: {name: string, ok: boolean}[] = [];
  const G = (name: string, ok: boolean) => res.push({name, ok: !!ok});
  const BS = String.fromCharCode(92), EN = String.fromCharCode(8211), EM = String.fromCharCode(8212), AP = String.fromCharCode(39);
  const cnt = (s: string, needle: string) => s.split(needle).length - 1;

  G('B1 our page intact (~34 KB, not truncated)', rd.was_truncated === false && page.length > 33000);
  G('B2 P22 fetched live (>60k chars)', p22.length > 60000);
  G('B3 door-quote 1 verbatim in live P22 (Box P22.B commission)',
    p22.includes('And at the research frontier, ') && p22.includes(AP + 's Nash' + EN + 'Moser fast Newton, built directly on this page'));
  G('B4 door-quote 2 verbatim in live P22 (far-door passage)',
    p22.includes('P57 faces problems where no single room works: the map loses derivatives as the iteration proceeds, and the recipe must re-smooth its own steps as it goes')
    && p22.includes(EM + ' Newton' + AP + 's method where the ground keeps changing under the tangent'));
  G('B5 Pell convention clash resolved: P22 level-6 forty-eight = our forty-eight digits',
    p22.includes('predicts level 6 at forty-eight') && p22.includes('886731088897/627013566048') && page.includes('forty-eight digits'));
  G('B6 our census digits use P22 card convention (0,1,2,5,11,24); no forty-nine',
    p22.includes('0, 1, 2, 5, 11, 24') && cnt(page, 'forty-nine') === 0);
  G('B7 kicker: sixteenth move of tier 5 x1; twelfth x0',
    cnt(page, 'the sixteenth move of tier 5') === 1 && cnt(page, 'twelfth') === 0);

  const hrefs: string[] = (page.match(/href="[^"]*"/g) || []).map(h => h.slice(6, -1));
  const want: [string, number][] = [['index.html',2],['assets/style.css',1],['p15-squeeze.html',2],['p22-fixed-point.html',4],['p26-model-with-equation.html',2],['p42-dyadic-decomposition.html',3],['p52-microlocal-propagation.html',2]];
  const msEq = (arr: string[]) => arr.length === 16 && want.every(([s, n]) => arr.filter(x => x === s).length === n);
  G('B8 href multiset exact (16 total: index 2, css 1, p15 2, p22 4, p26 2, p42 3, p52 2)', msEq(hrefs));

  const SRI = 'sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=';
  const iOpen = cnt(page, BS + '('), iClose = cnt(page, BS + ')'), dOpen = cnt(page, BS + '['), dClose = cnt(page, BS + ']');
  G('B9 MathJax balanced (inline 249/249, display 4/4) + SRI x1',
    iOpen === iClose && dOpen === dClose && iOpen > 200 && dOpen >= 4 && cnt(page, SRI) === 1);

  const enc = page.indexOf('id="encounter"'), pat = page.indexOf('id="pattern"'), exl = page.indexOf('id="exemplars"');
  const slice = page.slice(enc, pat), sec3 = page.slice(pat, exl);
  const names = ['Nash','Moser','Newton','Hamilton','Kantorovich','Raphson','Kolmogorov','Arnold','KAM'];
  G('B10 §2 encounter slice name-free (9 names)', names.every(nm => slice.indexOf(nm) === -1));
  G('B11 Nash' + EN + 'Moser x4 page, x1 in §3 slice',
    cnt(page, 'Nash' + EN + 'Moser') === 4 && cnt(sec3, 'Nash' + EN + 'Moser') === 1);
  G('B12 pattern-box displays: u_{k+1} x1, theta_{k+1} x1, bar{s} x5',
    cnt(page, 'u_{k+1}') === 1 && cnt(page, 'theta_{k+1}') === 1 && cnt(page, 'bar{s}') === 5);
  G('B13 grafts landed: Ex7 x1, free immersion x1, Günther x1, Diophantine x2, Liouville x1, golden x1, seven exercises x1, six x0; href multiset still exact',
    cnt(page, 'How fast should the cap grow?') === 1 && cnt(page, 'free immersion') === 1
    && cnt(page, 'Günther') === 1 && cnt(page, 'Diophantine') === 2 && cnt(page, 'Liouville') === 1
    && cnt(page, 'golden rotation') === 1 && cnt(page, 'seven exercises') === 1
    && cnt(page, 'six exercises') === 0 && msEq(hrefs));

  // Poisons
  G('B-P1 doctored door-quote caught (case change fails verbatim test)',
    !p22.includes('built directly on this PAGE') && p22.includes('built directly on this page'));
  G('B-P2 twelfth injection caught (doctored ordinal counts 1, ours 0)',
    cnt('the twelfth move of tier 5', 'twelfth') === 1 && cnt(page, 'twelfth') === 0);
  G('B-P3 href multiset injection caught (p58 link breaks the multiset)',
    !msEq(hrefs.concat(['p58-planned.html'])));
  G('B-P4 MathJax imbalance caught (unbalanced doctored string detected)',
    (cnt('x ' + BS + '( y', BS + '(') === 1) && (cnt('x ' + BS + '( y', BS + ')') === 0) && iOpen === iClose);
  G('B-P5 §2 name injection caught (detector fires on injected Newton)',
    ('x Newton modes'.indexOf('Newton') !== -1) && slice.indexOf('Newton') === -1);
  G('B-P6 forty-nine claim caught (would clash with P22 level-6 forty-eight)',
    !page.includes('forty-nine digits') && p22.includes('level 6 at forty-eight') && page.includes('forty-eight digits'));
  G('B-P7 external false claims absent (false Liouville rate e^{-e^ x0; golden-constant sqrt{5} x0 — both machine-caught in comparison)',
    cnt(page, 'e^{-e^') === 0 && cnt(page, BS + 'sqrt{5}') === 0);

  const gates = res.filter(r => !r.name.startsWith('B-P'));
  const poisons = res.filter(r => r.name.startsWith('B-P'));
  return { gates: `${gates.filter(r=>r.ok).length}/${gates.length}`,
           poisons: `${poisons.filter(r=>r.ok).length}/${poisons.length}`,
           failures: res.filter(r => !r.ok).map(r => r.name),
           p22chars: p22.length, pageChars: page.length, inlineMath: iOpen, displayMath: dOpen };
}
