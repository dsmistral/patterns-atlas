// P32 V1b — page-text consistency: both P30 door-quotes verbatim, house structure,
// MathJax hygiene, href whitelist multiset, §2 name-free slice, figure citations,
// census claims vs machine, exercise count, poisons.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p32-page.html' });
  const page = String(f.content), B = String.fromCharCode(92), inc = s => page.includes(s);
  gates.push({ claim: 'page whole (39,760 B)', pass: !f.was_truncated && page.length > 39000 });
  gates.push({ claim: 'both P30 door-quotes verbatim (§6 commission + footer sequel)', pass:
    inc('P30 closed with a commission for exactly this one, twice over') &&
    inc('so that "divisibility by ' + B + '(p' + B + ')" becomes algebra with objects you can factor') &&
    inc("this page's own sequel — ideal arithmetic (P32, planned), which localizes whole rings of numbers at a prime and turns \"divisibility by " + B + '(p' + B + ')" into algebra with factorable objects') &&
    inc('In its doors, verbatim:') && inc('And its last words, verbatim:') });
  gates.push({ claim: 'house structure: pattern-box + words, on-ramp, warn-box, moons, kicker, SRI', pass:
    inc('class="pattern-box"') && inc('In words:') && inc('New word: ring.') && inc('New word: norm.') &&
    inc('Scope, honestly.') && inc('<p class="moons">Difficulty: ●○○ ●●○ ●●● ◆ ◐ ◐</p>') &&
    inc('the seventh move of tier 3') && inc('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') });
  gates.push({ claim: 'MathJax hygiene: zero $; balanced inline; 3 displays + head; one double-backslash line', pass:
    !inc('$') && page.split(B + '(').length === page.split(B + ')').length &&
    page.split(B + '[').length - 1 === 4 && page.split(B + ']').length - 1 === 4 &&
    page.split('\n').filter(function (l) { return l.includes(B + B); }).length === 1 });
  const expected = ['assets/style.css', 'b02-congruence-classes.html', 'b02-congruence-classes.html', 'b12-brahmagupta-fibonacci.html', 'index.html', 'index.html', 'p05-canonical-form.html', 'p06-compose-identity.html', 'p09-invariant.html', 'p13-descent.html', 'p30-localize-at-prime.html', 'p30-localize-at-prime.html', 'p33-sheaf-cohomology-bridge.html', 'p33-sheaf-cohomology-bridge.html', 'p33-sheaf-cohomology-bridge.html'];
  gates.push({ claim: 'hrefs exactly the published whitelist multiset (15 links)', pass:
    JSON.stringify((page.match(/href="[^"]*"/g) || []).map(function (h) { return h.slice(6, -1); }).sort()) === JSON.stringify(expected) });
  gates.push({ claim: '§2 name-free slice: no deal, no ideal', pass: (function () { const s = page.slice(page.indexOf('<h2>2'), page.indexOf('<h2>3')); return !/deal/i.test(s) && !/ideal/i.test(s); })() });
  gates.push({ claim: 'figures cited exactly twice each; captions exact', pass:
    page.split('Fig P32.1').length === 3 && page.split('Fig P32.2').length === 3 &&
    inc('Fig P32.1 — Two splits of six, one family factorization.') && inc('Fig P32.2 — A family is a lattice in the grid.') });
  gates.push({ claim: 'census claims vs machine: classes 2/3/3, density one half, ledger', pass: (function () {
    const m = (v, k) => ((v % k) + k) % k;
    const A = {}, Bx = {}, C = {};
    let green20 = 0;
    for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) { A[m(a - b, 2)] = 1; Bx[m(a - b, 3)] = 1; C[m(a + b, 3)] = 1; }
    for (let a = 0; a < 20; a++) for (let b = 0; b < 20; b++) if ((a - b) % 2 === 0) green20++;
    return Object.keys(A).length === 2 && Object.keys(Bx).length === 3 && Object.keys(C).length === 3 && green20 === 200 &&
      inc('two classes, norm ' + B + '(2' + B + ')') && inc('three classes, norm ' + B + '(3' + B + ')') &&
      inc('density one half') && inc('4 = 2^2') && inc('36 = 2^2 ' + B + 'cdot 3 ' + B + 'cdot 3') && inc('6 = 2 ' + B + 'cdot 3');
  })() });
  gates.push({ claim: 'exercise battery: 6 exercises, 12 details blocks, moons ladder', pass:
    (page.match(/class="ex"/g) || []).length === 6 && (page.match(/<details>/g) || []).length === 12 });
  gates.push({ claim: 'footer pointers: P39 plain text, P33 link, P30 atlas-home', pass:
    inc('P39, planned') && inc('p33-sheaf-cohomology-bridge.html') && inc('P30 · Localize at a prime') });
  gates.push({ claim: 'Ex 6 final state on the page: two clauses present, naive law gone', pass:
    inc('The law has two honest clauses') && inc('minus one exactly when ' + B + '(n') && !inc('is ' + B + 'lceil d/2 ' + B + 'rceil' + B + ').') });
  poisons.push({ claim: 'no lab or verifier talk in prose', pass: !/\blabs?\b/i.test(page) && !inc('verifier') });
  poisons.push({ claim: 'no phantom Fig P32.3', pass: !inc('Fig P32.3') });
  poisons.push({ claim: 'no self-link and no planned-page link', pass: !inc('href="p32-ideal-arithmetic.html"') && !/href="(p39|m02)[^"]*"/.test(page) });
  poisons.push({ claim: 'Euclid' + "'" + 's lemma never claimed to hold in the broken ring', pass: !inc('lemma holds') });
  poisons.push({ claim: 'no miscounted census on the page: three classes, norm 2 absent', pass: !inc('three classes, norm ' + B + '(2' + B + ')') });
  return { verifier: 'V1b', gates: gates.length, gatesPass: gates.filter(g => g.pass).length, failed: gates.filter(g => !g.pass).map(g => g.claim), poisons: poisons.length, poisonsPass: poisons.filter(g => g.pass).length, failedPoisons: poisons.filter(g => !g.pass).map(g => g.claim), green: gates.every(g => g.pass) && poisons.every(g => g.pass) };
}
