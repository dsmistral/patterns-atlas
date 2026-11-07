// P30 V1b — PAGE-TEXT CONSISTENCY: the page's stated lists, witnesses,
// factorizations, figures, and template gates, checked against V1a's
// independently recomputed truth + poisons.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p30-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole (~40.7 KB)', pass: !f.was_truncated && page.length > 39500 && page.length < 42000 });
  // Machine truth (recomputed here, not trusted from the page).
  function isPrime(x) { for (let q = 2; q * q <= x; q++) if (x % q === 0) return false; return x >= 2; }
  function vp(p, n) { let k = 0, m = Math.abs(n); while (m % p === 0) { k++; m /= p; } return k; }
  function reps0(n) { let c = 0; for (let a = 0; a * a <= n; a++) { const b2 = n - a * a, b = Math.floor(Math.sqrt(b2)); if (b >= a && b * b === b2) c++; } return c; }
  const yes = [], no = [];
  for (let n = 1; n <= 50; n++) (reps0(n) >= 1 ? yes : no).push(n);
  gates.push({ claim: '§2 Yes/No lists = machine census (24 yes, 26 no)', pass:
    page.includes('1, 2, 4, 5, 8, 9, 10, 13, 16, 17, 18, 20, 25, 26, 29, 32, 34, 36, 37, 40, 41, 45, 49, 50') &&
    page.includes('3, 6, 7, 11, 12, 14, 15, 19, 21, 22, 23, 24, 27, 28, 30, 31, 33, 35, 38, 39, 42, 43, 44, 46, 47, 48') &&
    yes.length === 24 && no.length === 26 });
  const stated = [[2, 0], [3, 1], [5, 2], [7, 3], [11, 1], [13, 2], [17, 0], [19, 6], [23, 5], [29, 11]];
  let witNeedles = true;
  for (const w of stated) { if (!page.includes('Mod ' + B + '(' + w[0] + B + '): ' + B + '(x = ' + w[1] + B + ')')) witNeedles = false; }
  let witTrue = true;
  for (const w of stated) { const x = w[1], p = w[0]; if ((x * x - 2) % p !== 0 && (x * x - 17) % p !== 0 && (x * x - 34) % p !== 0) witTrue = false; }
  gates.push({ claim: 'Exhibit A: ten witness needles on page AND all true', pass: witNeedles && witTrue });
  gates.push({ claim: '−1 witnesses + square-set needles', pass:
    page.includes('2^2 = 4 ' + B + 'equiv -1 ' + B + 'pmod 5') && page.includes('5^2 = 25 ' + B + 'equiv -1 ' + B + 'pmod{13}') &&
    page.includes('4^2 = 16 ' + B + 'equiv -1 ' + B + 'pmod{17}') && page.includes('12^2 = 144 ' + B + 'equiv -1 ' + B + 'pmod{29}') &&
    page.includes(B + '{0, 1' + B + '}') && page.includes(B + '{0, 1, 2, 4' + B + '}') && page.includes(B + '{0, 1, 3, 4, 5, 9' + B + '}') });
  const facts = ['52 = 4 ', '58 = 2 ', '65 = 5 ', '68 = 4 ', '72 = 8 ', '74 = 2 ', '80 = 16 ', '82 = 2 ', '85 = 5 ', '90 = 9 ', '98 = 2 '];
  const factProd = [[4, 13, 52], [2, 29, 58], [5, 13, 65], [4, 17, 68], [8, 9, 72], [2, 37, 74], [16, 5, 80], [2, 41, 82], [5, 17, 85], [9, 10, 90], [2, 49, 98]];
  let factNeedles = true;
  for (const t of factProd) { if (!page.includes(t[2] + ' = ' + t[0] + ' ' + B + 'cdot ' + (t[2] / t[0]))) factNeedles = false; }
  for (const s of ['90 = 2 ' + B + 'cdot 3^2 ' + B + 'cdot 5', '98 = 2 ' + B + 'cdot 7^2', '108 = 4 ' + B + 'cdot 27']) { if (!page.includes(s)) factNeedles = false; }
  let factTrue = true; for (const t of factProd) if (t[0] * t[1] !== t[2]) factTrue = false;
  gates.push({ claim: 'factorization needles (14) on page AND all products exact', pass: factNeedles && factTrue });
  gates.push({ claim: 'Ex 5 unit list (with 23) + category lists + product-formula needles', pass:
    page.includes('1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26') && page.includes('3, 6, 12, 15, 21, 24') &&
    page.includes('(1/16)(1/9)(1/25)(3600) = 3600/3600 = 1') && page.includes('12/12 = 1') });
  gates.push({ claim: 'figures: cited twice, captions exact', pass:
    page.split('Fig P30.1').length === 3 && page.split('Fig P30.2').length === 3 &&
    page.includes('Fig P30.1 — Every prime answers') && page.includes('Fig P30.2 — The 3-lens and its idea of size.') });
  const published = ['index.html', 'assets/style.css', 'p05-canonical-form.html', 'p06-compose-identity.html', 'p09-invariant.html', 'p13-descent.html', 'p33-sheaf-cohomology-bridge.html', 'b01-remainders.html', 'b02-congruence-classes.html', 'b12-brahmagupta-fibonacci.html'];
  const hrefs = page.match(/href="[^"]*"/g) || [];
  gates.push({ claim: 'hrefs ⊆ published set (no dead, no planned, no self)', pass: hrefs.length > 0 && hrefs.every(function (h) { return published.indexOf(h.slice(6, -1)) >= 0; }) });
  const sec2 = page.slice(page.indexOf('<h2>2'), page.indexOf('<h2>3'));
  gates.push({ claim: '§2 name-free + register', pass:
    sec2.indexOf('ocalize') < 0 && !/Fermat|Gauss|Hensel|Hasse|Selmer/.test(sec2) });
  gates.push({ claim: 'template: kicker, moons, boxes, head SRI, MathJax balance, 8 sections', pass:
    page.split('the sixth move of tier 3').length === 2 && page.includes('<p class="moons">Difficulty: ●○○ ●●○ ●●● ◆ ◐ ◐</p>') &&
    page.includes('class="pattern-box"') && page.split('Scope, honestly.').length === 2 &&
    page.includes('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') &&
    page.indexOf('$') < 0 && page.split(B + '(').length === page.split(B + ')').length && page.split(B + '[').length === 4 && page.split(B + ']').length === 4 &&
    page.split('<section').length === 9 });
  poisons.push({ claim: 'no Fig P30.3', pass: !page.includes('Fig P30.3') });
  poisons.push({ claim: 'no TODO / placeholder text', pass: !page.includes('TODO') && !page.includes('XXX') && !page.includes('Lorem') });
  poisons.push({ claim: 'no self-link', pass: page.indexOf('p30-localize-at-prime.html') < 0 });
  poisons.push({ claim: 'no links to planned pages (P32, P39, M02)', pass: !/href="[^"]*(p32|p39|m02)/.test(page) });
  poisons.push({ claim: 'fake Exhibit A witness x = 4 mod 19 absent (4² − 2 = 14, 4² − 17 = −1)', pass: !page.includes('Mod ' + B + '(19' + B + '): ' + B + '(x = 4' + B + ')') });
  poisons.push({ claim: 'poison lists absent: 51 or 54 as survivors', pass: !page.includes('51 = ') && !page.includes('54 = ') });
  return { verifier: 'V1b', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
