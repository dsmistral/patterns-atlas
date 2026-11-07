// P37 Lab H — grafts 4+5+2 vs the page: Fig P37.2 convexity pixel audit, the
// full (t,x) lemma needles, the generator bridge, and the Lévy-1940 bullet.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p37-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole post-graft', pass: !f.was_truncated && page.length > 39000 });
  const fg = [];
  for (let i = -4; i <= 4; i++) { const x = i / 2; fg.push((300 + 60 * x) + ',' + (200 - 20 * x * x)); }
  gates.push({ claim: 'Fig P37.2 curve = y 200−20x², x_px 300+60x (9 pts)', pass: page.includes('<polyline points="' + fg.join(' ') + '"') });
  gates.push({ claim: 'sag 20px = 20 px/unit × 1 (kicks ±1 on x²)', pass: page.includes('<line x1="300" y1="200" x2="300" y2="180"') && (200 - 180) === 20 * ((1 + 1) / 2 - 0) });
  const svg = ['<line x1="120" y1="230" x2="480" y2="230"', '<line x1="180" y1="200" x2="420" y2="200"', '<line x1="240" y1="180" x2="360" y2="180"', '<circle cx="240" cy="180"', '<circle cx="360" cy="180"', '<circle cx="300" cy="200"', '<circle cx="300" cy="180"', '>the sag = ½σ²f″(X)dt</text>', '>f(x), convex</text>', "Fig P37.2 — The correction is curvature's fee."];
  gates.push({ claim: 'Fig P37.2 axis, tangent, chord, circles, labels, caption', pass: svg.every(function (s) { return page.includes(s); }) });
  gates.push({ claim: 'all three figures cited twice (caption + prose)', pass: page.split('Fig P37.1').length === 3 && page.split('Fig P37.2').length === 3 && page.split('Fig P37.3').length === 3 });
  gates.push({ claim: 'full lemma display + (dX)² table entry', pass: page.includes('df(t, X_t) ' + B + ';=' + B + '; ' + B + 'Bigl(f_t + ' + B + 'mu' + B + ', f_x + ' + B + 'tfrac{1}{2}' + B + 'sigma^2' + B + ', f_{xx}' + B + 'Bigr)' + B + ',dt ' + B + ';+' + B + '; ' + B + 'sigma' + B + ', f_x' + B + ', dW.') && page.includes('(dX)^2 = ' + B + 'sigma^2' + B + ',dt') });
  gates.push({ claim: 'generator bridge ×2 (§3 + §6) + heat-type + door list', pass: page.split('generator bridge').length === 3 && page.includes('heat-type equation') && page.includes('the mean-square limit, the generator bridge, Girsanov') });
  const i23 = page.indexOf('<strong>1923 — Wiener.</strong>'), i40 = page.indexOf('<strong>1940 — Lévy.</strong>'), i53 = page.indexOf('<strong>1953 — Doob.</strong>');
  gates.push({ claim: 'Lévy 1940 bullet ordered 1923 < 1940 < 1953', pass: i23 >= 0 && i23 < i40 && i40 < i53 });
  gates.push({ claim: 'Lévy law needle: squared steps sum to t', pass: page.includes('sum to ' + B + '(t') && page.includes('quadratic variation') });
  poisons.push({ claim: 'renumber leftovers (Fig P37.4, old caption reuse)', pass: !page.includes('Fig P37.4') && !page.includes('Fig P37.2 — Mean and median') });
  poisons.push({ claim: 'Lévy credited with the rule itself', pass: !page.includes('Lévy wrote the rule') && page.indexOf('Itô (1944') > 0 });
  return { lab: 'H', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
