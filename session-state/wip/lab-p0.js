function p0(P) {
  // --- head hygiene ---
  check('p0', 'doctype', P.startsWith('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">'));
  check('p0', 'title', P.includes('<title>B08 · Diagonalization: decoupling by relabelling · The Patterns Atlas</title>'));
  check('p0', 'stylesheet', P.includes('<link rel="stylesheet" href="assets/style.css">'));
  check('p0', 'mathjax block byte-exact', P.includes("<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>"));
  check('p0', 'mathjax integrity', P.includes('integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"'));
  check('p0', 'kicker', P.includes('· B08 · bridge page, group B · before <a href="p16-isomorphism.html">P16</a>'));
  check('p0', 'h1', P.includes('<h1>Diagonalization: decoupling by relabelling</h1>'));
  check('p0', 'tagline names the move', P.includes('The name for the move is <em>diagonalization</em>'));
  // --- structure ---
  const secOpens = (P.match(/<section id="([^"]+)">/g) || []).join(' ');
  check('p0', 'six sections in order', secOpens === '<section id="lecture0"> <section id="idea"> <section id="worked"> <section id="why"> <section id="practice"> <section id="where">');
  check('p0', 'section closes', (P.match(/<\/section>/g) || []).length === 6);
  check('p0', 'h2 count', (P.match(/<h2>/g) || []).length === 6);
  check('p0', 'h2 titles in order', ['1 · Lecture 0 — the phenomenon, before any notation','2 · The idea, named','3 · Worked by hand','4 · Why it is true','5 · Practice','6 · Where this goes'].every(function (t) { return P.includes('<h2>' + t + '</h2>'); }));
  check('p0', 'h3 count', (P.match(/<h3>/g) || []).length === 7);
  check('p0', 'boxes', P.includes('<div class="pattern-box" id="box-b08">') && P.includes('<div class="pattern-box" id="box-b08a">'));
  check('p0', 'figure count', (P.match(/<figure class="fig-tight">/g) || []).length === 3);
  check('p0', 'figcaption count', (P.match(/<figcaption>/g) || []).length === 3);
  check('p0', 'svg count', (P.match(/<svg xmlns=/g) || []).length === 3);
  check('p0', 'aria-labels', (P.match(/aria-label=/g) || []).length === 3);
  check('p0', 'details balanced', (P.match(/<details>/g) || []).length === 8 && (P.match(/<\/details>/g) || []).length === 8);
  check('p0', 'summaries', ['<details><summary>Hint</summary>','<details><summary>Worked answer</summary>'].every(function (s) { return (P.split(s).length - 1) === 4; }));
  check('p0', 'onramp', (P.match(/<aside class="onramp">/g) || []).length === 1);
  check('p0', 'warn aside', (P.match(/<aside class="aside warn">/g) || []).length === 1);
  check('p0', 'footer tail byte-exact', P.endsWith('\n</footer>\n</body>\n</html>\n'));
  // --- TeX hygiene ---
  const inlineO = (P.match(/\\\(/g) || []).length, inlineC = (P.match(/\\\)/g) || []).length;
  const dispO = (P.match(/\\\[/g) || []).length, dispC = (P.match(/\\\]/g) || []).length;
  check('p0', 'inline TeX balanced', inlineO === inlineC && inlineO === 444);
  check('p0', 'display TeX balanced', dispO === dispC && dispO === 20);
  check('p0', 'zero dollar delimiters', !P.includes('$'));
  check('p0', 'one diamond only', (P.match(/◆/g) || []).length === 1);
  // --- banned tokens ---
  ['battery','verifier','session','receipt','registry','planned','revision','adversarial','machine-verified','the gate','scratch','staged','fetch','TODO','FIXME','Lorem'].forEach(function (t) {
    check('p0', 'banned: ' + t, !P.toLowerCase().includes(t.toLowerCase()));
  });
  // 'lab' may appear only inside aria-label and the relabel family
  const labCount = (P.match(/lab/g) || []).length;
  const ariaCount = (P.match(/aria-label=/g) || []).length;
  const elabelCount = (P.match(/elabel/g) || []).length;
  check('p0', "lab only in aria-label/relabel", labCount === ariaCount + elabelCount && labCount === 39);
  check('p0', 'machin is subject matter', (P.match(/machin/g) || []).length >= 60);
  // --- href census ---
  const hrefs = (P.match(/href="[^"]*"/g) || []).sort();
  const expectedHrefs = ['href="assets/style.css"','href="b01-remainders.html"','href="b01-remainders.html"','href="b05-coordinates-basis.html"','href="b05-coordinates-basis.html"','href="b05-coordinates-basis.html"','href="b05-coordinates-basis.html"','href="b06-change-of-basis.html"','href="b06-change-of-basis.html"','href="b06-change-of-basis.html"','href="b06-change-of-basis.html"','href="b06-change-of-basis.html"','href="b06-change-of-basis.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="b07-eigenvectors.html"','href="index.html"','href="index.html"','href="p03-special-cases.html"','href="p05-canonical-form.html"','href="p09-invariant.html"','href="p09-invariant.html"','href="p09-invariant.html"','href="p15-squeeze.html"','href="p15-squeeze.html"','href="p16-isomorphism.html"','href="p16-isomorphism.html"','href="p16-isomorphism.html"','href="p16-isomorphism.html"','href="p66-induction.html"','href="p78-reversible-steps.html"','href="p78-reversible-steps.html"'];
  check('p0', 'href multiset exact', JSON.stringify(hrefs) === JSON.stringify(expectedHrefs));
  // --- practice intro ---
  check('p0', 'grades line', P.includes('Graded by fill: ●○○ comfortable · ●●○ a real step · ●●● a climb · ◐ open exploration.'));
  check('p0', 'no diamond exercise line', P.includes('No ◆ exercise here — there is no pattern to diagnose on a concept page yet.'));
  check('p0', 'exercise headers', ['<h3>Exercise 1 ●○○</h3>','<h3>Exercise 2 ●●○</h3>','<h3>Exercise 3 ●●●</h3>','<h3>Open exploration ◐</h3>'].every(function (h) { return P.includes(h); }));
  check('p0', 'pencil promise', P.includes('Take a pencil'));
}
