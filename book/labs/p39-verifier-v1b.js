async function main() {
  // V1b — PAGE-NEEDLE verifier: the independent re-derivations of V1a pinned against the page text.
  const BS = String.fromCharCode(92);
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p39-page.html' });
  const page = String(f.content);
  const gates = [], poisons = [];
  const g = (n, p) => gates.push({ name: n, pass: !!p });
  const po = (n, p) => poisons.push({ name: n, pass: !!p });
  const count = (s) => page.split(s).length - 1;

  g('B1 door-quotes verbatim: P30 commission "puts the lens to work at scale" x1; P10 commission "carries this move into number-theoretic territory" x1',
    count('puts the lens to work at scale') === 1 && count('carries this move into number-theoretic territory') === 1);
  g('B2 ordinal honest: kicker "the ninth move of tier 4" x1; the external D1 defect ("fifth move of tier 4") absent; title and h1 name the page',
    count('the ninth move of tier 4') === 1 && count('fifth move of tier 4') === 0 && page.includes('<title>P39 ' + String.fromCharCode(183) + ' The optimized sieve') && count('<h1>The optimized sieve') === 1);
  const s2a = page.indexOf('<h2>2'), s2b = page.indexOf('<h2>3');
  const s2 = page.slice(s2a, s2b);
  const names = ['Eratosthenes', 'Legendre', 'Brun', 'Selberg', 'Chen', 'Iwaniec', 'Zhang', 'Maynard', 'Tao'];
  g('B3 S2 name-free (all nine lineage names absent from the encounter) while S3 names the move exactly once',
    !names.some(n => s2.includes(n)) && count("Selberg's 1947 move") === 1);
  g('B4 pattern-box: "Pattern P39 ' + String.fromCharCode(8212) + ' The optimized sieve" x1; "Or, in words:" x1; bound needle X/V(R) + O(R^2); V(R) via mu^2/phi; anchor lambda_1 = 1',
    count('Pattern P39 ' + String.fromCharCode(8212) + ' The optimized sieve') === 1 && count('Or, in words:') === 1 &&
    page.includes(BS + 'frac{X}{V(R)} + O(R^2)') && page.includes(BS + 'frac{' + BS + 'mu(m)^2}{' + BS + 'varphi(m)}') && count('lambda_1 = 1') >= 1);
  g('B5 Exemplar 1 needles: capacity 13/4; weights -12/13 (shared x1), -5/13, +12/13; ceiling 4/13; truth 4/15; "fifteen percent"',
    page.includes(BS + 'frac{13}{4}') && count('-' + BS + 'tfrac{12}{13}') === 1 && count('-' + BS + 'tfrac{5}{13}') === 1 && count('+' + BS + 'tfrac{12}{13}') === 1 && page.includes(BS + 'frac{4}{13}') && page.includes(BS + 'frac{4}{15}') && count('fifteen percent') === 1);
  g('B6 Exemplar 2 ladder needles: rungs 5/2 -> 2/5, 13/4 -> 4/13, 11/3 -> 3/11, 35/8 -> 8/35; "equals the truth exactly" x1',
    page.includes(BS + 'tfrac52') && page.includes(BS + 'tfrac25') && page.includes(BS + 'tfrac{11}{3}') && page.includes(BS + 'tfrac{3}{11}') && page.includes(BS + 'tfrac{35}{8}') && page.includes(BS + 'tfrac{8}{35}') && count('equals the truth exactly') === 1);
  g('B7 Exemplar 3 twin needles: omega(2) = 1 x2; "two distinct boxes"; V_twin = 20/3; ceiling 3/20 = 0.15; truth 1/10; full identity (1+1)(1+2)(1+2/3); order X/log^2 X',
    count('omega(2) = 1') === 2 && count('two distinct boxes') === 1 && page.includes(BS + 'frac{20}{3}') && page.includes(BS + 'frac{3}{20} = 0.15') && page.includes(BS + 'tfrac{1}{10}') && count('(1+1)(1+2)(1+' + BS + 'frac23)') === 1 && page.includes('X/' + BS + 'log^2 X'));
  g('B8 figure discipline: Fig P39.1 x2, Fig P39.2 x2, caption order 1 then 2, no aria-label carries a citation',
    count('Fig P39.1') === 2 && count('Fig P39.2') === 2 && page.indexOf('<strong>Fig P39.1.</strong>') < page.indexOf('<strong>Fig P39.2.</strong>') && !(page.match(/aria-label="[^"]*Fig P39/g) || []).length);
  g('B9 honest-scope warn-box: aside warn x1; the three exhibits named verbatim; the lower bound honestly declared out of scope',
    count('class="aside warn"') === 1 && count('Exhibit A ' + String.fromCharCode(8212) + ' The parity wall') === 1 && count("Exhibit B " + String.fromCharCode(8212) + " The remainder's budget") === 1 && count('Exhibit C ' + String.fromCharCode(8212) + ' The tuple that sieves itself') === 1 && count('lower bound') >= 1);
  g('B10 doors honest: p30 x3, p10 x5, p42 x4 (post-graft: Exemplar 3 links P42 for Brun shells), p15, p04, b02 hrefs; zero hrefs to p38/p76/m02/p40/p58 (external D2 dead links absent); P38 plain text only',
    count('href="p30-localize-at-prime.html"') === 3 && count('href="p10-pigeonhole.html"') === 5 && count('href="p42-dyadic-decomposition.html"') === 4 && count('href="p15-squeeze.html"') === 1 && count('href="p04-complete-the-square.html"') === 1 && count('href="b02-congruence-classes.html"') === 1 && !/href="[^"]*(p38|p76|m02|p40|p58)/.test(page) && page.includes('(P38, planned)'));
  g('B11 lineage needles present (web pass pending, presence not truth): Eratosthenes; Legendre (1808); Viggo Brun (1915' + String.fromCharCode(8211) + '1919); Atle Selberg (1947); 1949 parity; Chen (1966' + String.fromCharCode(8211) + '1973); Iwaniec (1978' + String.fromCharCode(8211) + '1980); Zhang, Maynard, Tao (2013)',
    page.includes('Eratosthenes') && page.includes('Legendre (1808)') && page.includes('Viggo Brun (1915' + String.fromCharCode(8211) + '1919)') && page.includes('Atle Selberg (1947)') && page.includes('1949') && page.includes('Chen (1966' + String.fromCharCode(8211) + '1973)') && page.includes('Iwaniec (1978' + String.fromCharCode(8211) + '1980)') && page.includes('Zhang, Maynard, Tao (2013)'));
  g('B12 exercise structure: 6 exercises, moons ladder x1, 5 hints + 6 worked answers (11 details); Ex 6 needles 5.9, 1.8x10^5, 7.2x10^4, "two-and-a-half times", "twelve-percent"',
    count('class="ex"') === 6 && count(String.fromCharCode(9679) + String.fromCharCode(9675) + String.fromCharCode(9675) + ' ' + String.fromCharCode(9679) + String.fromCharCode(9679) + String.fromCharCode(9675) + ' ' + String.fromCharCode(9679) + String.fromCharCode(9679) + String.fromCharCode(9679) + ' ' + String.fromCharCode(9670) + ' ' + String.fromCharCode(9680) + ' ' + String.fromCharCode(9680)) === 1 && count('<summary>Hint</summary>') === 5 && count('<summary>Worked answer</summary>') === 6 && page.includes('5.9') && page.includes('1.8 ' + BS + 'times 10^5') && page.includes('7.2 ' + BS + 'times 10^4') && count('two-and-a-half times') === 1 && count('twelve-percent') === 1);

  const cor1 = page.replace('the ninth move of tier 4', 'the fifth move of tier 4');
  po('P1 corrupted ordinal (ninth -> fifth) is caught by the kicker gate', cor1.split('the ninth move of tier 4').length - 1 === 0 && cor1.includes('fifth move of tier 4'));
  const cor2 = page.slice(0, s2b) + ' Selberg ' + page.slice(s2b);
  const c2s2 = cor2.slice(cor2.indexOf('<h2>2'), cor2.indexOf('<h2>3'));
  po('P2 Selberg injected into S2 is caught by the name-free gate', c2s2.includes('Selberg'));
  const cor3 = page.replace('puts the lens to work at scale', 'puts the lens to labour at scale');
  po('P3 corrupted door-quote (work -> labour) is caught by B1', !cor3.includes('puts the lens to work at scale'));
  const cor4 = page.split('O(R^2)').join('O(R^3)');
  po('P4 corrupted remainder order (all O(R^2) -> O(R^3)) is caught by the bound needle', !cor4.includes(BS + 'frac{X}{V(R)} + O(R^2)'));
  const cor5 = page.replace('(P38, planned)', '(<a href="p38-major-minor-arcs.html">P38</a>, planned)');
  po('P5 injected planned-page href is caught by the dead-link gate', /href="[^"]*p38/.test(cor5));
  const cor6 = page.split(BS + 'frac{13}{4}').join(BS + 'frac{14}{4}');
  po('P6 corrupted capacity (13/4 -> 14/4 everywhere) is caught by the Exemplar 1 needle', !cor6.includes(BS + 'frac{13}{4}') && cor6.includes(BS + 'frac{14}{4}'));

  const gp = gates.filter(x => x.pass).length, pp = poisons.filter(x => x.pass).length;
  return { lab: 'V1b needles', gates: gp + '/' + gates.length, poisons: pp + '/' + poisons.length, failed: gates.concat(poisons).filter(x => !x.pass).map(x => x.name) };
}
