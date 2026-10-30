// B08-style harness for P16. Runs against PAGE (the full page text).
var CHECKS = [];
function V(tag, name, cond) { CHECKS.push({ tag: tag, name: name, pass: !!cond }); }
function VN(tag, name, value, expect) { CHECKS.push({ tag: tag, name: name, pass: JSON.stringify(value) === JSON.stringify(expect), got: value, want: expect }); }
function P0(PAGE) {
  // --- head & identity ---
  V('p0', 'doctype first', PAGE.startsWith('<!DOCTYPE html>\n<html lang="en">'));
  V('p0', 'title', PAGE.indexOf('<title>P16 \u00b7 Same problem, different clothes \u00b7 The Patterns Atlas</title>') >= 0);
  V('p0', 'stylesheet', PAGE.indexOf('<link rel="stylesheet" href="assets/style.css">') >= 0);
  V('p0', 'MathJax line', PAGE.indexOf("window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};") >= 0);
  V('p0', 'integrity line', PAGE.indexOf('integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"></script>') >= 0);
  V('p0', 'kicker', PAGE.indexOf('The Patterns Atlas</a> \u00b7 P16 \u00b7 the sixteenth move of the spine') >= 0);
  V('p0', 'h1', PAGE.indexOf('<h1>Same problem, different clothes</h1>') >= 0);
  // --- section skeleton ---
  var ids = ['bridge','encounter','name-the-move','the-move-at-work','when-it-fails','what-next','lineage','exercises'];
  var titles = ['1 \u00b7 Before we begin','2 \u00b7 Meet the problem','3 \u00b7 Name the move','4 \u00b7 The move at work','5 \u00b7 When the move fails','6 \u00b7 What to try next','7 \u00b7 Lineage','8 \u00b7 Exercises'];
  for (var i = 0; i < 8; i++) { V('p0', 'section id ' + ids[i], PAGE.indexOf('<section id="' + ids[i] + '">') >= 0); V('p0', 'h2 title ' + (i+1), PAGE.indexOf('<h2>' + titles[i] + '</h2>') >= 0); }
  // --- boxes ---
  V('p0', 'box p16', PAGE.indexOf('<div class="pattern-box" id="box-p16">') >= 0);
  V('p0', 'box p16a', PAGE.indexOf('<div class="pattern-box" id="box-p16a">') >= 0);
  V('p0', 'box p16b', PAGE.indexOf('<div class="pattern-box" id="box-p16b">') >= 0);
  V('p0', 'box p16 title', PAGE.indexOf('P16 \u00b7 Same problem, different clothes \u2014 solve the problem it is a copy of') >= 0);
  V('p0', 'box p16a title', PAGE.indexOf('What a dictionary must promise') >= 0);
  V('p0', 'box p16b title', PAGE.indexOf('Where the move appears, and its three-key signature') >= 0);
  // --- figures ---
  V('p0', 'fig 1', PAGE.indexOf('<figure id="fig-p16-1">') >= 0);
  V('p0', 'fig 2', PAGE.indexOf('<figure id="fig-p16-2">') >= 0);
  V('p0', 'fig 3', PAGE.indexOf('<figure id="fig-p16-3">') >= 0);
  VN('p0', 'svg count', (PAGE.match(/<svg /g) || []).length, 3);
  VN('p0', 'figcaption count', (PAGE.match(/<figcaption>/g) || []).length, 3);
  VN('p0', 'details count', (PAGE.match(/<details>/g) || []).length, 10);
  VN('p0', 'ex count', (PAGE.match(/class="ex"/g) || []).length, 5);
  VN('p0', 'pid count', (PAGE.match(/class="pid"/g) || []).length, 3);
  // --- footer ---
  V('p0', 'footer next P17', PAGE.indexOf('<p><a href="index.html">Return to the index</a> \u00b7 Next: <a href="p17-duality.html">P17 \u00b7 Flip to the dual</a></p>') >= 0);
  V('p0', 'tail byte-exact', PAGE.endsWith('\n</html>\n'));
  V('p0', 'tail structure', PAGE.indexOf('\n</footer>\n</body>\n</html>') >= 0);
  // --- cleanliness: forbidden strings ---
  V('p0', 'no dollar sign', PAGE.indexOf('$') < 0);
  V('p0', 'no backtick', PAGE.indexOf('`') < 0);
  V('p0', 'no code element', PAGE.indexOf('<code') < 0);
  V('p0', 'no pre element', PAGE.indexOf('<pre') < 0);
  V('p0', 'no draft voice wait', PAGE.indexOf('... wait:') < 0);
  V('p0', 'no draft voice careful', PAGE.indexOf('... careful:') < 0);
  V('p0', 'no didactic garble', PAGE.indexOf('didactic-toe') < 0);
  V('p0', 'no TODO', PAGE.indexOf('TODO') < 0);
  // --- structural balances ---
  VN('p0', 'section balance', (PAGE.match(/<section id=/g) || []).length, (PAGE.match(/<\/section>/g) || []).length);
  VN('p0', 'div balance', (PAGE.match(/<div /g) || []).length, (PAGE.match(/<\/div>/g) || []).length);
  VN('p0', 'table balance', (PAGE.match(/<table /g) || []).length, (PAGE.match(/<\/table>/g) || []).length);
  VN('p0', 'p balance', (PAGE.match(/<p[ >]/g) || []).length, (PAGE.match(/<\/p>/g) || []).length);
  VN('p0', 'a balance', (PAGE.match(/<a /g) || []).length, (PAGE.match(/<\/a>/g) || []).length);
  VN('p0', 'figure balance', (PAGE.match(/<figure id=/g) || []).length, (PAGE.match(/<\/figure>/g) || []).length);
  VN('p0', 'details balance', (PAGE.match(/<details>/g) || []).length, (PAGE.match(/<\/details>/g) || []).length);
  // --- TeX delimiters balanced ---
  var iopen = (PAGE.match(/\\\(/g) || []).length, iclose = (PAGE.match(/\\\)/g) || []).length;
  var dopen = (PAGE.match(/\\\[/g) || []).length, dclose = (PAGE.match(/\\\]/g) || []).length;
  VN('p0', 'inline open', iopen, iclose);
  VN('p0', 'display open', dopen, dclose);
  VN('p0', 'bmatrix balance', (PAGE.match(/begin\{bmatrix\}/g) || []).length, (PAGE.match(/end\{bmatrix\}/g) || []).length);
  // --- onramp new words ---
  V('p0', 'onramp present', PAGE.indexOf('<aside class="onramp">') >= 0);
  V('p0', 'new word dictionary', PAGE.indexOf('<strong>New word: dictionary.</strong>') >= 0);
  V('p0', 'new word structure', PAGE.indexOf('<strong>New word: structure.</strong>') >= 0);
  V('p0', 'new word isomorphism', PAGE.indexOf('<strong>New word: isomorphism.</strong>') >= 0);
  // --- required links present ---
  var links = ['p01-pin-down-the-problem.html','p02-small-cases.html','p03-special-cases.html','p05-canonical-form.html','p07-auxiliary-construction.html','p09-invariant.html','p12-obstruction.html','p78-reversible-steps.html','b05-coordinates-basis.html','b06-change-of-basis.html','b07-eigenvectors.html','b08-diagonalization.html','p17-duality.html','p18-raise-dimension.html','p31-universal-property.html','p70-double-counting.html','b02-congruence-classes.html'];
  for (var j = 0; j < links.length; j++) V('p0', 'link ' + links[j], PAGE.indexOf('href="' + links[j] + '"') >= 0);
  // --- scope aside ---
  V('p0', 'scope aside', PAGE.indexOf('<aside class="warn"><strong>Scope, honestly.</strong>') >= 0);
  // --- pid move lines ---
  V('p0', 'pid P01 P03', PAGE.indexOf('pinning the win-relations before any translation') >= 0);
  V('p0', 'pid P02 P07', PAGE.indexOf('tabulating the small cases until they rhyme') >= 0);
  V('p0', 'pid B07 B08 P09', PAGE.indexOf('hunting the rails') >= 0 && PAGE.indexOf('watching the invariant ride through') >= 0);
}
