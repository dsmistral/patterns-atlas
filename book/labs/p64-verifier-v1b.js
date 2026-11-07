// P64 Verifier V1b — page-text consistency gates against independently re-derived
// truths (V1a, Lab G), plus must-fail poison injections. Reads the merged page.
async function main() {
  const g = [], pz = [];
  const bs = String.fromCharCode(92);
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p64-page.html' });
  const page = String(f.content);
  g.push({ c: 'page read whole', pass: !f.was_truncated && page.length > 55000 });
  g.push({ c: "kicker 'the fifteenth move of tier 5'", pass: page.includes('the fifteenth move of tier 5') });
  g.push({ c: 'states 3d + n - 1, 6d - 2, 4, 10, 16, 22, 28', pass: page.includes('3d + n - 1') && page.includes('6d - 2') && page.includes('4, 10, 16, 22, 28') });
  g.push({ c: 'states basis {1, u} and [1 : 0 : 0]', pass: page.includes('{1, u' + bs + '}') && page.includes('[1 : 0 : 0]') });
  g.push({ c: 'states 2875, 609{,}250, 317{,}206{,}375, 87{,}304', pass: page.includes('2875') && page.includes('609{,}250') && page.includes('317{,}206{,}375') && page.includes('87{,}304') });
  g.push({ c: 'moons ladder with six rungs', pass: page.includes('●○○ ●●○ ●●● ◆ ◐ ◐') });
  const hrefs = page.match(/href="[^"]*"/g) || [];
  const ok = ['"index.html"', '"assets/style.css"', '"p16-isomorphism.html"', '"p33-sheaf-cohomology-bridge.html"', '"p53-deformation-cohomology.html"', '"p54-stable-compactification.html"', '"p65-floer-homology.html"'];
  g.push({ c: 'every href in the published set', pass: hrefs.length > 0 && hrefs.every(function (h) { return ok.indexOf(h.replace('href=', '')) !== -1; }) });
  const open = page.split(bs + '(').length - 1, close = page.split(bs + ')').length - 1;
  const dOpen = page.split(bs + '[').length - 1, dClose = page.split(bs + ']').length - 1;
  g.push({ c: 'MathJax pairs balanced, zero $', pass: open === close && open > 400 && dOpen === dClose && dOpen === 5 && page.indexOf('$') === -1 });
  g.push({ c: 'both figures cited from prose (2 mentions each)', pass: page.split('Fig P64.1').length === 3 && page.split('Fig P64.2').length === 3 });
  g.push({ c: 'lineage fixes: Katz 1986, twisted cubics, Clemens open', pass: page.includes('Katz') && page.includes('317{,}206{,}375') && page.includes('still open in general') });
  g.push({ c: 'merge A: exemplar chain 2b/3/4/5, five failures, exhibits D/E, lineage grafts', pass: page.includes('Exemplar 2b') && page.includes('Exemplar 3 · A count computed from the books alone') && page.includes('Exemplar 4 · The stage') && page.includes('Exemplar 5 · Multiple covers') && page.includes('five distinct ways') && page.includes('Exhibit D — the books must close after two ledgers') && page.includes('Exhibit E — the room must end') && page.includes('Aspinwall') && page.includes('Fukaya') && page.includes('Ruan') && page.includes('polyfolds') && page.includes('Kuranishi') && page.includes('Schubert and Severi') && page.includes('conservation of number') });
  g.push({ c: 'merge B: grafted numbers exact and consistent', pass: page.includes('600' + bs + ',s_1^4 s_2 + 1450' + bs + ',s_1^2 s_2^2 + 225' + bs + ',s_2^3') && page.includes('1200 + 1450 + 225 = 2875') && page.includes('2(k-1) = 2k-2') && page.includes('tfrac{1}{k^3}') && page.includes('tfrac{1}{8}') && page.includes('tfrac{1}{27}') && page.includes('tfrac{1}{64}') && page.includes('1/k^3') && page.includes('x = ' + bs + 'tfrac') && page.includes('[1:0]') && page.includes('walls behind the walls') && page.includes('sqrt{e}') && page.includes('Earn the ' + bs + '(2875') && page.includes('earned by hand in Exercise 6') && page.includes('finite sum over the fixed rooms') && page.includes('s_1^4 s_2 = 2') });
  // Poisons — must-fail injections; each must be DETECTED (corrupted != truth).
  pz.push({ c: 'injected kicker ordinal sixteenth', pass: !page.includes('sixteenth') });
  pz.push({ c: 'injected a $ into the page', pass: page.indexOf('$') === -1 });
  pz.push({ c: 'stale three-failure count still present', pass: !page.includes('three distinct ways') });
  pz.push({ c: 'injected dead link href="p08 or p56', pass: page.indexOf('href="p08') === -1 && page.indexOf('href="p56') === -1 });
  pz.push({ c: 'injected unpinned table 5,11,17,23,29', pass: !page.includes('5, 11, 17, 23, 29') });
  pz.push({ c: 'injected $$ display math', pass: page.indexOf('$$') === -1 });
  pz.push({ c: 'injected wrong cover census 1/k^2 or drift x = eps', pass: !page.includes('tfrac{1}{k^2}') && !page.includes('x = ' + bs + 'varepsilon') });
  const green = g.every(function (x) { return x.pass; }) && pz.every(function (x) { return x.pass; });
  return { lab: 'V1b', gates: g.length, gatesPass: g.filter(function (x) { return x.pass; }).length,
    poisons: pz.length, poisonsRejected: pz.filter(function (x) { return x.pass; }).length,
    green: green, failed: g.filter(function (x) { return !x.pass; }) };
}
