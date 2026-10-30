// P16 REVIEW VERIFIER — independent harness (zero code shared with the lab battery).
var VC = [];
function vCheck(name, cond) { VC.push({ name: name, pass: !!cond }); }
function vEq(name, got, want) { VC.push({ name: name, pass: JSON.stringify(got) === JSON.stringify(want), got: got, want: want }); }
// ---- needles: the page must contain these exactly ----
function needles(PG) {
  vCheck('n01 title', PG.indexOf('<title>P16 \u00b7 Same problem, different clothes \u00b7 The Patterns Atlas</title>') >= 0);
  vCheck('n02 kicker', PG.indexOf('the sixteenth move of the spine') >= 0);
  vCheck('n03 h1', PG.indexOf('<h1>Same problem, different clothes</h1>') >= 0);
  vCheck('n04 scrabble name', PG.indexOf('Number Scrabble') >= 0);
  vCheck('n05 game sequence', PG.indexOf('A claims 5; B claims 9; A claims 2; B claims 8; A claims 7; B claims 3; A claims 6') >= 0);
  vCheck('n06 luoshu row', PG.indexOf('<td>4 9 2</td><td>3 5 7</td><td>8 1 6</td></tr>') >= 0);
  vCheck('n07 win column', PG.indexOf('completing the right column: 2, 7, 6') >= 0);
  vCheck('n08 card8 bottom-left', PG.indexOf("B's 8 the bottom-left \u2014 the anti-diagonal block") >= 0);
  vCheck('n09 card3 middle-left', PG.indexOf("B's 3 the middle-left, blocking one") >= 0);
  vCheck('n10 box title', PG.indexOf('P16 \u00b7 Same problem, different clothes \u2014 solve the problem it is a copy of') >= 0);
  vCheck('n11 promise box', PG.indexOf('What a dictionary must promise') >= 0);
  vCheck('n12 pairing 8 bottom-left', PG.indexOf('<td>8</td><td>bottom-left</td>') >= 0);
  vCheck('n13 pairing 3 middle-left', PG.indexOf('<td>3</td><td>middle-left</td>') >= 0);
  vCheck('n14 forcing claim', PG.indexOf('the only triple containing 2 and 5 is {2,5,8}, so 8 sits opposite') >= 0);
  vCheck('n15 exactly 8 full', PG.indexOf('exactly 8 of the 362,880 arrangements carry all eight lines') >= 0);
  vCheck('n16 census row', PG.indexOf('<td>168,768</td><td>131,040</td><td>48,960</td><td>10,240</td><td>2,824</td><td>832</td><td>176</td><td>32</td><td>8</td>') >= 0);
  vCheck('n17 failed sums', PG.indexOf('the top row sums to 6, the bottom row to 24, the outer columns to 12 and 18') >= 0);
  vCheck('n18 ten-plus-five', PG.indexOf('ten plus five is fifteen') >= 0);
  vCheck('n19 tz formula', PG.indexOf('disc \\(\\mathrm{tz}(m) + 1\\)') >= 0);
  vCheck('n20 hanoi row 4', PG.indexOf('<tr><td>4</td><td>100</td><td>3</td><td>A to C</td></tr>') >= 0);
  vCheck('n21 machine-check claim', PG.indexOf('every move the rule names is legal, the tower arrives complete, and no position repeats') >= 0);
  vCheck('n22 billionth', PG.indexOf('\\(10^9 = 2^9 \\cdot 1953125\\)') >= 0 && PG.indexOf('nine trailing zeros, disc 10') >= 0);
  vCheck('n23 temple count', PG.indexOf('\\(2^{64} - 1 = 18{,}446{,}744{,}073{,}709{,}551{,}615\\)') >= 0);
  vCheck('n24 temple years', PG.indexOf('about 584.5 billion years') >= 0);
  vCheck('n25 hanoi boundary', PG.indexOf('this page names it and does not build it') >= 0);
  vCheck('n26 machine M', PG.indexOf('\\(M = \\begin{bmatrix} 3 &amp; 1 \\\\ 2 &amp; 2 \\end{bmatrix}\\)') >= 0);
  vCheck('n27 det P', PG.indexOf('det P \\;=\\; 3') >= 0);
  vCheck('n28 diag round trip', PG.indexOf('P^{-1}MP = \\begin{bmatrix} 1 &amp; 0 \\\\ 0 &amp; 4 \\end{bmatrix}') >= 0);
  vCheck('n29 reading', PG.indexOf('its rail reading is \\((1, 2)\\)') >= 0);
  vCheck('n30 spring 2', PG.indexOf('spring 2 gives \\((33,30)\\)') >= 0);
  vCheck('n31 sixty-one digits', PG.indexOf('runs to sixty-one digits and opens \\(1606938044\\ldots\\)') >= 0);
  vCheck('n32 openings', PG.indexOf('opening \\(321387608851\\ldots\\)') >= 0);
  vCheck('n33 price', PG.indexOf('six squarings and two multiplications') >= 0);
  vCheck('n34 boundary', PG.indexOf('the answer above, not its reading') >= 0);
  vCheck('n35 referee A', PG.indexOf('equinumerosity mistaken for isomorphism') >= 0);
  vCheck('n36 referee root', PG.indexOf('the license is the checked promise, not the word "isomorphism"') >= 0);
  vCheck('n37 years exact', PG.indexOf('584,542,046,090 years and change') >= 0);
  vCheck('n38 hint clean', PG.indexOf('then square twice more;') >= 0);
  vCheck('n39 even trap', PG.indexOf('2 + 4 + 6 = 12, not fifteen') >= 0);
  vCheck('n40 adjacency', PG.indexOf('cells 4 and 9 are adjacent') >= 0);
  vCheck('n41 footer next', PG.indexOf('Next: <a href="p17-duality.html">') >= 0);
}
// ---- poisons: none of these may appear ----
function poisons(PG) {
  vCheck('z01 no scale-by-16', PG.indexOf('then scale by 16') < 0);
  vCheck('z02 no card8-middle-left prose', PG.indexOf("B's 8 the middle-left") < 0);
  vCheck('z03 no card8-middle-left table', PG.indexOf('<td>8</td><td>middle-left</td>') < 0);
  vCheck('z04 no card3-bottom-left prose', PG.indexOf("B's 3 the bottom-left") < 0);
  vCheck('z05 no seven squarings', PG.indexOf('seven squarings') < 0);
  vCheck('z06 no dollar', PG.indexOf('$') < 0);
  vCheck('z07 no backtick', PG.indexOf('`') < 0);
  vCheck('z08 no TODO', PG.indexOf('TODO') < 0);
  vCheck('z09 no garble', PG.indexOf('didactic-toe') < 0);
  vCheck('z10 no draft voice', PG.indexOf('... wait:') < 0 && PG.indexOf('... careful:') < 0);
}
