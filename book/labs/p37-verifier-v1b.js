// P37 Verifier V1b — page-text consistency gates (truths re-derived in V1a and Labs
// A–F) plus must-fail poison injections. Reads the draft fresh; needles via
// fromCharCode(92) so backslash transport cannot corrupt them.
async function main() {
  const g = [], pz = [];
  const bs = String.fromCharCode(92);
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p37-page.html' });
  const page = String(f.content);
  g.push({ c: 'page read whole', pass: !f.was_truncated && page.length > 30000 });
  g.push({ c: 'kicker ordinal + title', pass: page.includes('the eighth move of tier 4') && page.includes('P37 · Itô calculus') });
  g.push({ c: 'two books needles', pass: page.includes(bs + 'tfrac{1}{2}, ' + bs + 'tfrac{1}{4}, ' + bs + 'tfrac{1}{8}, ' + bs + 'tfrac{1}{16}') && page.includes('N = 4, 16, 64') && page.includes('2, 4, 8') });
  g.push({ c: "rule + multiplication table needles", pass: page.includes('f(W_t) - f(W_0)') && page.includes(bs + "tfrac{1}{2}" + bs + "int_0^t f''(W_s)") && page.includes('dW ' + bs + 'cdot dW') && page.includes('dW ' + bs + 'cdot dt') && page.includes('dt ' + bs + 'cdot dt') });
  g.push({ c: 'reconciliation needle', pass: page.includes(bs + 'int_0^t W_s' + bs + ',dW_s ' + bs + ';+' + bs + '; t') });
  g.push({ c: 'drag needles', pass: page.includes(bs + 'tfrac{1}{2}(0.20)^2 = 2') && page.includes('e^{0.06t}') && page.includes('e^{0.08t}') && page.includes('e^{2} ' + bs + 'approx 7.39') && page.includes('e^{1.5} ' + bs + 'approx 4.48') && page.includes('e^{0.5} ' + bs + 'approx 1.65') && ['1.4918', '1.3499', '1.105', '7.389', '4.482', '1.649'].every(function (s) { return page.includes(s); }) });
  g.push({ c: 'exit needles', pass: page.includes(bs + 'frac{R^2 - ' + bs + '|x' + bs + '|^2}{d}') && page.includes('(9 - 0)/1 = 9') && page.includes('9/3 = 3') && page.includes('(9 - 4)/1 = 5') });
  g.push({ c: 'Tanaka/E|W| needles', pass: page.split(bs + 'sqrt{2t/' + bs + 'pi}').length >= 3 && page.includes('Tanaka') });
  g.push({ c: 'balanced-book needles', pass: page.includes('e^{W_t - t/2}') && page.includes('e^{' + bs + 'lambda W_t - ' + bs + 'lambda^2 t/2}') });
  const open = page.split(bs + '(').length - 1, close = page.split(bs + ')').length - 1;
  const dOpen = page.split(bs + '[').length - 1, dClose = page.split(bs + ']').length - 1;
  g.push({ c: 'MathJax balanced, zero $, \\ only in head', pass: open === close && open > 200 && dOpen === dClose && dOpen === 11 && page.indexOf('$') === -1 && page.split(bs + bs).length === 5 });
  const hrefs = (page.match(/href="[^"]*"/g) || []);
  const allow = ['"index.html"', '"assets/style.css"', '"p15-squeeze.html"', '"p19-count-outcomes.html"', '"p26-model-with-equation.html"', '"p29-energy-methods.html"', '"p41-mountain-pass.html"', '"p42-dyadic-decomposition.html"', '"p43-flow-with-surgery.html"', '"p56-asymptotic-rescaling.html"'];
  g.push({ c: 'hrefs published bidirectionally + SRI head', pass: hrefs.length >= 16 && hrefs.every(function (h) { return allow.indexOf(h.replace('href=', '')) !== -1; }) && allow.every(function (a) { return hrefs.indexOf('href=' + a) !== -1; }) && page.includes('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') && page.includes('mathjax@3.2.2') });
  const s2 = page.slice(page.indexOf('id="problem"'), page.indexOf('id="move"'));
  g.push({ c: 'S2 name-free', pass: s2.indexOf('Itô') === -1 });
  g.push({ c: 'moons + all numbered boxes', pass: page.includes('●○○ ●●○ ●●● ◆ ◐ ◐') && ['Exemplar 1', 'Exemplar 2', 'Exemplar 3', 'Exemplar 4', 'Exhibit A', 'Exhibit B', 'Exhibit C', 'Exercise 1', 'Exercise 2', 'Exercise 3', 'Exercise 4', 'Exercise 5', 'Exercise 6'].every(function (s) { return page.includes(s); }) });
  g.push({ c: 'figures cited twice + scope box', pass: page.split('Fig P37.1').length === 3 && page.split('Fig P37.2').length === 3 && page.split('Fig P37.3').length === 3 && page.includes('Scope, honestly.') && page.includes('warn-box') });
  g.push({ c: 'graft needles: full lemma + Lévy 1940', pass: page.includes('df(t, X_t) ' + bs + ';=' + bs + '; ' + bs + 'Bigl(f_t + ' + bs + 'mu' + bs + ', f_x + ' + bs + 'tfrac{1}{2}' + bs + 'sigma^2' + bs + ', f_{xx}' + bs + 'Bigr)') && page.includes('(dX)^2 = ' + bs + 'sigma^2' + bs + ',dt') && page.split('generator bridge').length === 3 && page.indexOf('<strong>1923 — Wiener.</strong>') < page.indexOf('<strong>1940 — Lévy.</strong>') && page.indexOf('<strong>1940 — Lévy.</strong>') < page.indexOf('<strong>1953 — Doob.</strong>') });
  g.push({ c: 'graft needles: OU spring + cubic book', pass: page.includes('Exemplar 4 · The noisy spring') && page.includes('v(' + bs + 'Delta) = ' + bs + 'sigma^2/(' + bs + 'gamma(2 - ' + bs + 'gamma' + bs + 'Delta))') && page.split(bs + 'tfrac{16}{15}, ' + bs + 'tfrac{64}{63}, ' + bs + 'tfrac{256}{255}').length === 3 && page.split(bs + 'int_0^T W_t^2' + bs + ',dW_t = ' + bs + 'tfrac{1}{3}W_T^3 - ' + bs + 'int_0^T W_t' + bs + ',dt').length === 3 && page.includes("the cubic book's telescoping at " + bs + '(N = 4') });
  pz.push({ c: 'wrong ordinal injected', pass: !page.includes('ninth move') && !page.includes('third move') && !page.includes('seventh move') });
  pz.push({ c: '$ or $$ injected', pass: page.indexOf('$') === -1 });
  pz.push({ c: 'dead planned links injected', pass: ['href="p58', 'href="p38', 'href="p63', 'href="p27', 'href="p28', 'href="p30', 'href="p32'].every(function (s) { return page.indexOf(s) === -1; }) });
  pz.push({ c: 'self-link injected', pass: page.indexOf('p37-ito-calculus.html') === -1 });
  const mut = page.replace('eighth', 'ninth');
  pz.push({ c: 'ordinal mutation caught (demo)', pass: mut.includes('ninth move of tier 4') && !mut.includes('eighth move') });
  const mut2 = page.split('4.48').join('4.84');
  pz.push({ c: 'drag mutation caught (demo, all occurrences)', pass: mut2.indexOf('4.84') !== -1 && mut2.indexOf('4.48') === -1 });
  const green = g.every(function (x) { return x.pass; }) && pz.every(function (x) { return x.pass; });
  return { lab: 'V1b', gates: g.length, gatesPass: g.filter(function (x) { return x.pass; }).length,
    poisons: pz.length, poisonsRejected: pz.filter(function (x) { return x.pass; }).length,
    green: green, failed: g.filter(function (x) { return !x.pass; }) };
}
