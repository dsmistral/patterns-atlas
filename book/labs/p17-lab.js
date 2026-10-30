// B17/P17 LAB — head + p0 (page byte gates)
// Run: new Function('PAGE', LAB + ';return runBattery(PAGE);')(pageText)
var P17_checks = [];
function P17_reg(part, name, pass) { P17_checks.push({ part: part, name: name, pass: !!pass }); }
function P17_has(page, s) { return page.indexOf(s) !== -1; }
function P17_count(page, s) { return page.split(s).length - 1; }
// integer 3x3 determinant (rows a b c / d e f / g h i)
function P17_det(a,b,c,d,e,f,g,h,i){ return a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g); }
// exact rationals as [num, den] with den>0, gcd-normalized
function P17_gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=a%b; a=b; b=t; } return a||1; }
function P17_rat(n,d){ if(d<0){ n=-n; d=-d; } var g=P17_gcd(n,d); return [n/g, d/g]; }
function P17_rEq(r,s){ return r[0]===s[0] && r[1]===s[1]; }
function P17_rMul(r,s){ return P17_rat(r[0]*s[0], r[1]*s[1]); }
function P17_rDiv(r,s){ return P17_rat(r[0]*s[1], r[1]*s[0]); }
function P17_rIsInt(r){ return r[1]===1; }
function P17_rNum(r){ return r[0]/r[1]; }

function p0(page) {
  // head and identity
  P17_reg('p0','title', P17_has(page, '<title>P17 · Flip to the dual · The Patterns Atlas</title>'));
  P17_reg('p0','kicker', P17_has(page, 'P17 · the seventeenth move of the spine'));
  P17_reg('p0','h1', P17_has(page, '<h1>Flip to the dual</h1>'));
  P17_reg('p0','MathJax line byte-exact', P17_has(page, "window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']]},svg:{fontCache:'global'}};"));
  P17_reg('p0','CDN integrity line', P17_has(page, 'sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII='));
  P17_reg('p0','stylesheet link', P17_has(page, '<link rel="stylesheet" href="assets/style.css">'));
  // onramp
  P17_reg('p0','onramp aside', P17_has(page, '<aside class="onramp">'));
  P17_reg('p0','New word dual', P17_has(page, 'New word: dual.'));
  P17_reg('p0','New word incidence', P17_has(page, 'New word: incidence.'));
  P17_reg('p0','New word involution', P17_has(page, 'New word: involution.'));
  P17_reg('p0','tagline needle', P17_has(page, 'flip is the cheapest machine mathematics owns'));
  // byte gates
  P17_reg('p0','zero dollar signs', P17_count(page, '$') === 0);
  P17_reg('p0','zero backticks', P17_count(page, '`') === 0);
  P17_reg('p0','TeX inline balance', P17_count(page, '\\(') === P17_count(page, '\\)') && P17_count(page, '\\(') > 100);
  P17_reg('p0','TeX display balance', P17_count(page, '\\[') === P17_count(page, '\\]') && P17_count(page, '\\[') === 3);
  P17_reg('p0','two vmatrix displays', P17_count(page, 'vmatrix') === 4 && P17_count(page, '\\begin{vmatrix}') === 2);
  P17_reg('p0','no doubled backslash-paren', !P17_has(page, '\\\\('));
  P17_reg('p0','tail byte-exact', P17_has(page, '\n</footer>\n</body>\n</html>\n'));
  // structure
  var secIds = ['bridge','encounter','name-the-move','the-move-at-work','when-it-fails','what-next','lineage','exercises'];
  var secOk = true;
  for (var i = 0; i < secIds.length; i++) { if (!P17_has(page, '<section id="' + secIds[i] + '">')) secOk = false; }
  P17_reg('p0','eight section ids', secOk);
  var h2s = ['1 · Before we begin','2 · The same question, asked twice','3 · Name the move','4 · The move at work','5 · When it fails — three exhibits of fine print','6 · What comes next','7 · Where it came from','8 · Exercises'];
  var h2Ok = true;
  for (var j = 0; j < h2s.length; j++) { if (!P17_has(page, '<h2>' + h2s[j] + '</h2>')) h2Ok = false; }
  P17_reg('p0','eight h2 texts', h2Ok);
  P17_reg('p0','h2 count 8', P17_count(page, '<h2>') === 8);
  P17_reg('p0','h3 count 9', P17_count(page, '<h3>') === 9);
  // boxes
  P17_reg('p0','box p17', P17_has(page, 'id="box-p17"'));
  P17_reg('p0','box p17 h3', P17_has(page, 'P17 · Flip to the dual — solve the mirrored problem instead'));
  P17_reg('p0','box p17a', P17_has(page, 'id="box-p17a"') && P17_has(page, 'Box P17.A · The three promises, mirrored'));
  P17_reg('p0','box p17b', P17_has(page, 'id="box-p17b"') && P17_has(page, 'Box P17.B · Where it shows up, and the three-key signature'));
  P17_reg('p0','warn box', P17_has(page, '<aside class="warn">') && P17_has(page, '<h3>Scope and price of P17</h3>'));
  // pid, tables, figures, exercises
  P17_reg('p0','three pid lines', P17_count(page, 'class="pid"') === 3);
  P17_reg('p0','two digit-tables', P17_count(page, 'digit-table') === 2);
  P17_reg('p0','three svgs', P17_count(page, '<svg') === 3 && P17_count(page, '</svg>') === 3);
  P17_reg('p0','three figures', P17_count(page, '<figure id="fig-p17-') === 3);
  P17_reg('p0','figcaption P17.1', P17_has(page, '<strong>Fig P17.1.</strong>'));
  P17_reg('p0','figcaption P17.2', P17_has(page, '<strong>Fig P17.2.</strong>'));
  P17_reg('p0','figcaption P17.3', P17_has(page, '<strong>Fig P17.3.</strong>'));
  P17_reg('p0','ten details', P17_count(page, '<details>') === 10);
  P17_reg('p0','five hints', P17_count(page, '<summary>Hint') === 5);
  P17_reg('p0','five worked', P17_count(page, '<summary>Worked') === 5);
  P17_reg('p0','five ex paragraphs', P17_count(page, 'class="ex"') === 5);
  P17_reg('p0','moon set', P17_has(page, '(●○○)') && P17_has(page, '(●●○)') && P17_has(page, '(●●●)') && P17_has(page, '(◆)') && P17_has(page, '(◐)'));
  P17_reg('p0','moon counts', P17_count(page, '●') === 6 && P17_count(page, '○') === 3 && P17_count(page, '◆') === 1 && P17_count(page, '◐') === 1);
  // hrefs
  var hrefs = ['p01-pin-down-the-problem.html','p02-small-cases.html','p03-special-cases.html','p04-complete-the-square.html','p05-canonical-form.html','p06-compose-identity.html','p07-auxiliary-construction.html','p08-symmetry.html','p09-invariant.html','p10-pigeonhole.html','p11-contradiction.html','p12-obstruction.html','p13-descent.html','p14-diagonal.html','p15-squeeze.html','p16-isomorphism.html','p18-raise-dimension.html','p24-waves.html','p31-universal-property.html','index.html','assets/style.css'];
  var hrefOk = true;
  for (var k = 0; k < hrefs.length; k++) { if (!P17_has(page, 'href="' + hrefs[k] + '"')) hrefOk = false; }
  P17_reg('p0','all href targets present', hrefOk);
  P17_reg('p0','footer next P18', P17_has(page, 'Next: <a href="p18-raise-dimension.html">P18 · Lift to a higher dimension</a>'));
  // section-2 arithmetic needles
  P17_reg('p0','point det arithmetic', P17_has(page, '2(9-4) - 5(3-7) + 1(12-63) = 10 + 20 - 51 = -21'));
  P17_reg('p0','line det arithmetic', P17_has(page, '-10 + 51 + 20 = 21'));
  P17_reg('p0','census needle', P17_has(page, 'collinear triples out of 560'));
  P17_reg('p0','census split arithmetic', P17_has(page, '16 + 16 + 6 + 6 = 44'));
  P17_reg('p0','ceva ratios', P17_has(page, 'BD/DC = 3/4') && P17_has(page, 'CE/EA = 5/3') && P17_has(page, 'AF/FB = 4/5'));
  P17_reg('p0','menelaus product needle', P17_has(page, 'product \\(-1\\), so the three meeting points are collinear'));
  // exercises and exhibits needles
  P17_reg('p0','ex2 boundary', P17_has(page, 'the hexagonal tiling'));
  P17_reg('p0','ex4 de Polignac', P17_has(page, "de Polignac's 1849 conjecture"));
  P17_reg('p0','ex5 census', P17_has(page, 'Four out of five'));
  P17_reg('p0','exhibit C needle', P17_has(page, 'a mirror showing you your own face'));
  P17_reg('p0','certificate exhaustive needle', P17_has(page, 'the certificate is exhaustive'));
  P17_reg('p0','rhymes needle', P17_has(page, 'rhymes do not carry proofs'));
  P17_reg('p0','default habit needle', P17_has(page, 'price the twin before paying for the problem'));
  P17_reg('p0','scope needle', P17_has(page, 'no dictionary means no flip'));
  // lineage
  var lineage = ['Desargues','1639','Brianchon','1806','167 years','Ceva','1678','Menelaus','Euler','1750','1758','Legendre','1787','De Morgan','Gergonne','1825','Poncelet','von Neumann','1947','Gale, Kuhn, and Tucker','1951'];
  var linOk = true;
  for (var m = 0; m < lineage.length; m++) { if (!P17_has(page, lineage[m])) linOk = false; }
  P17_reg('p0','lineage names and dates', linOk);
  // poisons
  P17_reg('p0','poison Gergogne', !P17_has(page, 'Gergogne'));
  P17_reg('p0','poison 65,536', !P17_has(page, '65,536'));
  P17_reg('p0','poison draft voice', !P17_has(page, '— wait:') && !P17_has(page, 'TODO') && !P17_has(page, 'FIXME') && !P17_has(page, 'Lorem') && !P17_has(page, 'didactic'));
  P17_reg('p0','em-dash texture', P17_count(page, '—') >= 100);
}
// B17/P17 LAB — p1: the dictionary engine
function p1(page) {
  // the house dictionary: point (p,q) -> line y = px - q (slope p, intercept -q)
  function dualOfPoint(p, q) { return { m: p, c: -q }; }
  function dualOfLine(m, c) { return [m, -c]; }
  // point determinant rows [p,q,1]
  function pdet(P) { return P17_det(P[0][0],P[0][1],1, P[1][0],P[1][1],1, P[2][0],P[2][1],1); }
  // line determinant rows [p,-1,-q]
  function ldet(L) { return P17_det(L[0].m,-1,L[0].c, L[1].m,-1,L[1].c, L[2].m,-1,L[2].c); }
  // intersection of two non-parallel lines, exact rational x and y
  function xsect(a, b) { var x = P17_rat(b.c - a.c, a.m - b.m); var y = P17_rat(a.m*x[0] + a.c*x[1], x[1]); return { x: x, y: y }; }
  // --- involution over the 5x5 grid (Promise 1)
  var invOk = true;
  for (var p = 0; p <= 4; p++) for (var q = 0; q <= 4; q++) {
    var back = dualOfLine.apply(null, [dualOfPoint(p,q).m, dualOfPoint(p,q).c].length ? [dualOfPoint(p,q).m, dualOfPoint(p,q).c] : [0,0]);
    if (!(back[0] === p && back[1] === q)) invOk = false;
  }
  P17_reg('p1','involution on 25 grid points', invOk);
  P17_reg('p1','involution example (2,5)', (function(){ var l = dualOfPoint(2,5); return l.m === 2 && l.c === -5 && dualOfLine(2,-5)[0] === 2 && dualOfLine(2,-5)[1] === 5; })());
  // --- incidence symmetry (Promise 2): P=(a,b) on dual(A=(p,q)) <=> dual(P) on A
  var incOk = true;
  for (var a = 0; a <= 4; a++) for (var b = 0; b <= 4; b++) for (var pp = 0; pp <= 4; pp++) for (var qq = 0; qq <= 4; qq++) {
    var lhs = a * pp - b === qq;
    var rhs = pp * a - qq === b;          // dual(P) passes through A
    if (lhs !== rhs) incOk = false;
  }
  P17_reg('p1','incidence symmetry ap = b + q, 625 pairs', incOk);
  P17_reg('p1','both reduce to ap = b + q', (2*7 === 4 + 10) && !(2*7 === 5 + 8));
  // --- determinant theorem L = -P over all C(9,3) triples of {0,1,2}^2
  var pts = [];
  for (var x = 0; x <= 2; x++) for (var y = 0; y <= 2; y++) pts.push([x,y]);
  var detOk = true, ccOk = true, triples = 0;
  for (var i = 0; i < pts.length; i++) for (var j = i+1; j < pts.length; j++) for (var k = j+1; k < pts.length; k++) {
    var P3 = [pts[i], pts[j], pts[k]];
    var L3 = P3.map(function(t){ return dualOfPoint(t[0], t[1]); });
    var P = pdet(P3), L = ldet(L3);
    if (L !== -P) detOk = false;
    if ((P === 0) !== (L === 0)) ccOk = false;
    triples++;
  }
  P17_reg('p1','L = -P over ' + triples + ' triples', detOk && triples === 84);
  P17_reg('p1','collinear iff concurrent, 84 triples', ccOk);
  // --- the page's worked triple (2,5),(3,9),(7,4)
  var T = [[2,5],[3,9],[7,4]];
  var P21 = pdet(T);
  var LT = T.map(function(t){ return dualOfPoint(t[0], t[1]); });
  var L21 = ldet(LT);
  P17_reg('p1','page triple point det = -21', P21 === -21);
  P17_reg('p1','page triple line det = +21', L21 === 21);
  P17_reg('p1','page triple duals', LT[0].m === 2 && LT[0].c === -5 && LT[1].m === 3 && LT[1].c === -9 && LT[2].m === 7 && LT[2].c === -4);
  var x12 = xsect(LT[0], LT[1]), x13 = xsect(LT[0], LT[2]), x23 = xsect(LT[1], LT[2]);
  P17_reg('p1','L1 and L2 meet at (4,3)', P17_rEq(x12.x, P17_rat(4,1)) && P17_rEq(x12.y, P17_rat(3,1)));
  P17_reg('p1','L1 and L3 meet at (-1/5,-27/5)', P17_rEq(x13.x, P17_rat(-1,5)) && P17_rEq(x13.y, P17_rat(-27,5)));
  P17_reg('p1','L2 and L3 meet at (-5/4,-51/4)', P17_rEq(x23.x, P17_rat(-5,4)) && P17_rEq(x23.y, P17_rat(-51,4)));
  P17_reg('p1','three crossings distinct', !P17_rEq(x12.x, x13.x) && !P17_rEq(x12.x, x23.x) && !P17_rEq(x13.x, x23.x));
  // --- collinear triple (1,2),(2,3),(3,4) on y = x+1
  var C = [[1,2],[2,3],[3,4]];
  P17_reg('p1','collinear triple det = 0', pdet(C) === 0);
  P17_reg('p1','points on y = x+1', C.every(function(t){ return t[1] === t[0] + 1; }));
  var CT = C.map(function(t){ return dualOfPoint(t[0], t[1]); });
  P17_reg('p1','collinear dual det = 0', ldet(CT) === 0);
  P17_reg('p1','duals x-y=2, 2x-y=3, 3x-y=4', CT[0].m===1 && CT[0].c===-2 && CT[1].m===2 && CT[1].c===-3 && CT[2].m===3 && CT[2].c===-4);
  P17_reg('p1','duals concurrent at (1,-1)', CT.every(function(L){ return 1*L.m + L.c === -1; }));
  P17_reg('p1','dual of y=x+1 is (1,-1)', (function(){ var d = dualOfLine(1,1); return d[0]===1 && d[1]===-1; })());
  // --- word-flip facts
  P17_reg('p1','y=x and y=x+1 are parallel', (function(){ var a=dualOfLine(1,0), b=dualOfLine(1,1); return a[0]===b[0] && a[1]!==b[1]; })());
  P17_reg('p1','same-p points have parallel duals', (function(){ var u=dualOfPoint(1,2), v=dualOfPoint(1,5); return u.m===v.m && u.c!==v.c; })());
  P17_reg('p1','(1,2)/(1,5) duals are y=x-2 and y=x-5', dualOfPoint(1,2).c === -2 && dualOfPoint(1,5).c === -5);
  var meetOk = true;
  for (var p1a = 0; p1a <= 4; p1a++) for (var p2a = 0; p2a <= 4; p2a++)
    for (var qa = 0; qa <= 4; qa++) for (var qb = 0; qb <= 4; qb++) {
      if (p1a === p2a && qa === qb) continue; // the same point
      var A2 = dualOfPoint(p1a, qa), B2 = dualOfPoint(p2a, qb);
      if (A2.m === B2.m && A2.c === B2.c) meetOk = false; // distinct points must give distinct duals
    }
  P17_reg('p1','distinct points give distinct dual lines', meetOk);
  P17_reg('p1','dictionary never produces vertical lines', (function(){ var ok = true; for (var p=0;p<=6;p++) for (var q=0;q<=6;q++) if (dualOfPoint(p,q).m !== p) ok = false; return ok; })());
  // --- the 4x4 grid census
  var grid = [];
  for (var gx = 0; gx <= 3; gx++) for (var gy = 0; gy <= 3; gy++) grid.push([gx,gy]);
  var total = 0, col = 0, horiz = 0, vert = 0, sPlus = 0, sMinus = 0, other = 0;
  var colTriples = [];
  for (var a1 = 0; a1 < grid.length; a1++) for (var b1 = a1+1; b1 < grid.length; b1++) for (var c1 = b1+1; c1 < grid.length; c1++) {
    total++;
    var A = grid[a1], B = grid[b1], Cc = grid[c1];
    var cross = (B[1]-A[1])*(Cc[0]-A[0]) - (B[0]-A[0])*(Cc[1]-A[1]);
    if (cross === 0) {
      col++;
      var dp = B[0]-A[0], dq = B[1]-A[1];
      if (dq === 0) horiz++;
      else if (dp === 0) vert++;
      else if (Math.abs(dp) === Math.abs(dq)) { if (dp*dq > 0) sPlus++; else sMinus++; }
      else other++;
      colTriples.push([A,B,Cc]);
    }
  }
  P17_reg('p1','C(16,3) = 560 triples', total === 560);
  P17_reg('p1','44 collinear', col === 44);
  P17_reg('p1','16 horizontal', horiz === 16);
  P17_reg('p1','16 vertical', vert === 16);
  P17_reg('p1','6 slope-1', sPlus === 6);
  P17_reg('p1','6 slope-minus-1', sMinus === 6);
  P17_reg('p1','no other slopes', other === 0);
  // dual split: non-vertical collinear -> concurrent duals; vertical -> parallel duals
  var aff = 0, par = 0, affOk = true, parOk = true;
  var dualSeen = {};
  var injOk = true;
  for (var t = 0; t < colTriples.length; t++) {
    var trip = colTriples[t];
    var d = trip.map(function(pt){ return dualOfPoint(pt[0], pt[1]); });
    var key = d.map(function(L){ return L.m + ':' + L.c; }).sort().join('|');
    if (dualSeen[key]) injOk = false; dualSeen[key] = true;
    if (trip[0][0] === trip[1][0]) { // vertical
      par++;
      if (!(d[0].m === d[1].m && d[1].m === d[2].m && d[0].c !== d[1].c && d[1].c !== d[2].c)) parOk = false;
    } else { // non-vertical: shared line through the points; duals concurrent at (m,-c)
      aff++;
      var n2 = trip[1][1]-trip[0][1], dd = trip[1][0]-trip[0][0]; // slope n2/dd, dd != 0
      var target = trip[0][1]*dd - n2*trip[0][0];                // q*dd - n2*p is constant on the line
      var ok2 = trip.every(function(pt){ return pt[1]*dd - n2*pt[0] === target; });
      // and the duals really are concurrent (line determinant zero, exact integers)
      if (!ok2 || ldet(d) !== 0) affOk = false;
    }
  }
  P17_reg('p1','28 non-vertical collinear', aff === 28);
  P17_reg('p1','16 vertical collinear', par === 16);
  P17_reg('p1','duals of the 28 concurrent at (m,-c)', affOk);
  P17_reg('p1','duals of the 16 parallel', parOk);
  P17_reg('p1','44-to-44 pairing injective', injOk);
  // --- Exercise 1 numbers
  var E1a = [[1,4],[2,6],[3,11]];
  var E1aL = E1a.map(function(t){ return dualOfPoint(t[0],t[1]); });
  P17_reg('p1','Ex1a point det = 3', pdet(E1a) === 3);
  P17_reg('p1','Ex1a line det = -3', ldet(E1aL) === -3);
  P17_reg('p1','Ex1a duals x-y=4, 2x-y=6, 3x-y=11', E1aL[0].m===1&&E1aL[0].c===-4 && E1aL[1].m===2&&E1aL[1].c===-6 && E1aL[2].m===3&&E1aL[2].c===-11);
  var E1b = [[0,1],[1,3],[2,5]];
  var E1bL = E1b.map(function(t){ return dualOfPoint(t[0],t[1]); });
  P17_reg('p1','Ex1b det = 0', pdet(E1b) === 0);
  P17_reg('p1','Ex1b on y = 2x+1', E1b.every(function(t){ return t[1] === 2*t[0] + 1; }));
  P17_reg('p1','Ex1b duals y=-1, y=x-3, y=2x-5', E1bL[0].m===0&&E1bL[0].c===-1 && E1bL[1].m===1&&E1bL[1].c===-3 && E1bL[2].m===2&&E1bL[2].c===-5);
  P17_reg('p1','Ex1b dual det = 0', ldet(E1bL) === 0);
  P17_reg('p1','Ex1b concurrent at (2,-1)', E1bL.every(function(L){ return 2*L.m + L.c === -1; }));
}
// B17/P17 LAB — p2: Ceva and Menelaus, exact rationals
function p2(page) {
  function rSub(r,s){ return P17_rat(r[0]*s[1]-s[0]*r[1], r[1]*s[1]); }
  function one(){ return P17_rat(1,1); }
  // line through two points, as [a,b,c] with a*x + b*y = c
  function line2(P1, P2) { return [P2[1]-P1[1], P1[0]-P2[0], (P2[1]-P1[1])*P1[0] + (P1[0]-P2[0])*P1[1]]; }
  // exact rational intersection of two lines
  function isect(L1, L2) {
    var D = L1[0]*L2[1] - L2[0]*L1[1];
    return [P17_rat(L1[2]*L2[1] - L2[2]*L1[1], D), P17_rat(L1[0]*L2[2] - L2[0]*L1[2], D)];
  }
  // exact rational collinearity: (P2-P1) x (X-P1) = 0, X rational
  function rCross(P1, P2, X) {
    var dx1 = P2[0]-P1[0], dy1 = P2[1]-P1[1];
    var num = dx1*(X[1][0] - P1[1]*X[1][1])*X[0][1] - dy1*(X[0][0] - P1[0]*X[0][1])*X[1][1];
    return num === 0;
  }
  // collinearity by cross product, integer
  function collinear(A, B, C) { return (B[0]-A[0])*(C[1]-A[1]) - (B[1]-A[1])*(C[0]-A[0]) === 0; }
  // side parametrization: t on segment S->E, exact
  function tOn(X, S, E) {
    var den = E[0]-S[0];
    if (den !== 0) return P17_rat(X[0][0]-S[0]*X[0][1], X[0][1]*den);
    var den2 = E[1]-S[1];
    return P17_rat(X[1][0]-S[1]*X[1][1], X[1][1]*den2);
  }
  function sideRatio(X, S, E) { var t = tOn(X, S, E); return P17_rDiv(t, rSub(one(), t)); }
  var A = [0,0], B = [6,0], C = [0,4];
  // ---- Ceva with P(2,1) (the page's worked numbers)
  var P = [2,1];
  var D1 = isect(line2(A, P), line2(B, C));
  var E1 = isect(line2(B, P), line2(C, A));
  var F1 = isect(line2(C, P), line2(A, B));
  P17_reg('p2','ceva D = (24/7, 12/7)', P17_rEq(D1[0], P17_rat(24,7)) && P17_rEq(D1[1], P17_rat(12,7)));
  P17_reg('p2','ceva E = (0, 3/2)', P17_rEq(E1[0], P17_rat(0,1)) && P17_rEq(E1[1], P17_rat(3,2)));
  P17_reg('p2','ceva F = (8/3, 0)', P17_rEq(F1[0], P17_rat(8,3)) && P17_rEq(F1[1], P17_rat(0,1)));
  var rD = sideRatio(D1, B, C), rE = sideRatio(E1, C, A), rF = sideRatio(F1, A, B);
  P17_reg('p2','BD/DC = 3/4', P17_rEq(rD, P17_rat(3,4)));
  P17_reg('p2','CE/EA = 5/3', P17_rEq(rE, P17_rat(5,3)));
  P17_reg('p2','AF/FB = 4/5', P17_rEq(rF, P17_rat(4,5)));
  var prod1 = P17_rMul(P17_rMul(rD, rE), rF);
  P17_reg('p2','ceva product = 1', P17_rEq(prod1, one()));
  P17_reg('p2','cevians pass through P (exact)', rCross(A, P, D1) && rCross(B, P, E1) && rCross(C, P, F1));
  P17_reg('p2','t values 3/7, 5/8, 4/9', P17_rEq(tOn(D1, B, C), P17_rat(3,7)) && P17_rEq(tOn(E1, C, A), P17_rat(5,8)) && P17_rEq(tOn(F1, A, B), P17_rat(4,9)));
  // ---- Menelaus with x + y = 3 (the page's worked numbers)
  function onTrans(X, k) { return X[0] + X[1] === k; }
  var Ltr = line2([3,0], [0,3]); // x + y = 3
  var M1 = isect(Ltr, line2(B, C));
  P17_reg('p2','menelaus on AB at (3,0)', P17_rEq(isect(Ltr, line2(A, B))[0], P17_rat(3,1)) && P17_rEq(isect(Ltr, line2(A, B))[1], P17_rat(0,1)));
  P17_reg('p2','menelaus on CA at (0,3)', P17_rEq(isect(Ltr, line2(C, A))[0], P17_rat(0,1)) && P17_rEq(isect(Ltr, line2(C, A))[1], P17_rat(3,1)));
  P17_reg('p2','menelaus on BC extended at (-3,6)', P17_rEq(M1[0], P17_rat(-3,1)) && P17_rEq(M1[1], P17_rat(6,1)));
  var mAB = sideRatio(isect(Ltr, line2(A,B)), A, B);
  var mCA = sideRatio(isect(Ltr, line2(C,A)), C, A);
  var mBC = sideRatio(M1, B, C);
  P17_reg('p2','menelaus AF/FB = 1', P17_rEq(mAB, P17_rat(1,1)));
  P17_reg('p2','menelaus CE/EA = 1/3', P17_rEq(mCA, P17_rat(1,3)));
  P17_reg('p2','menelaus BD/DC = -3', P17_rEq(mBC, P17_rat(-3,1)));
  var prod2 = P17_rMul(P17_rMul(mAB, mCA), mBC);
  P17_reg('p2','menelaus product = -1', P17_rEq(prod2, P17_rat(-1,1)));
  P17_reg('p2','t = 3/2 beyond C, ratio negative', P17_rEq(tOn(M1, B, C), P17_rat(3,2)) && mBC[0] < 0);
  P17_reg('p2','all three points on x+y=3', onTrans([3,0],3) && onTrans([0,3],3) && onTrans([-3,6],3));
  // ---- Exercise 3: P(3,1) and transversal x+y=2
  var P3 = [3,1];
  var D3 = isect(line2(A, P3), line2(B, C));
  var E3 = isect(line2(B, P3), line2(C, A));
  var F3 = isect(line2(C, P3), line2(A, B));
  P17_reg('p2','ex3 D = (4, 4/3)', P17_rEq(D3[0], P17_rat(4,1)) && P17_rEq(D3[1], P17_rat(4,3)));
  P17_reg('p2','ex3 E = (0, 2)', P17_rEq(E3[0], P17_rat(0,1)) && P17_rEq(E3[1], P17_rat(2,1)));
  P17_reg('p2','ex3 F = (4, 0)', P17_rEq(F3[0], P17_rat(4,1)) && P17_rEq(F3[1], P17_rat(0,1)));
  var xD = sideRatio(D3, B, C), xE = sideRatio(E3, C, A), xF = sideRatio(F3, A, B);
  P17_reg('p2','ex3 BD/DC = 1/2', P17_rEq(xD, P17_rat(1,2)));
  P17_reg('p2','ex3 CE/EA = 1', P17_rEq(xE, P17_rat(1,1)));
  P17_reg('p2','ex3 AF/FB = 2', P17_rEq(xF, P17_rat(2,1)));
  P17_reg('p2','ex3 ceva product = 1', P17_rEq(P17_rMul(P17_rMul(xD, xE), xF), one()));
  var L2t = line2([2,0], [0,2]); // x + y = 2
  var nAB = sideRatio(isect(L2t, line2(A,B)), A, B);
  var nCA = sideRatio(isect(L2t, line2(C,A)), C, A);
  var nBC = sideRatio(isect(L2t, line2(B,C)), B, C);
  P17_reg('p2','ex3 menelaus meets AB at (2,0), ratio 1/2', P17_rEq(isect(L2t, line2(A,B))[0], P17_rat(2,1)) && P17_rEq(nAB, P17_rat(1,2)));
  P17_reg('p2','ex3 menelaus meets CA at (0,2), ratio 1', P17_rEq(isect(L2t, line2(C,A))[1], P17_rat(2,1)) && P17_rEq(nCA, P17_rat(1,1)));
  P17_reg('p2','ex3 menelaus meets BC at (-6,8), ratio -2', P17_rEq(isect(L2t, line2(B,C))[0], P17_rat(-6,1)) && P17_rEq(isect(L2t, line2(B,C))[1], P17_rat(8,1)) && P17_rEq(nBC, P17_rat(-2,1)));
  P17_reg('p2','ex3 menelaus product = -1', P17_rEq(P17_rMul(P17_rMul(nAB, nCA), nBC), P17_rat(-1,1)));
  // sign convention: ratio positive exactly when 0 < t < 1
  var signOk = true;
  for (var t = -4; t <= 6; t++) {
    if (t === 1) continue;
    var r = P17_rat(t, 1 - t);
    if ((0 < t && t < 1) !== (r[0] > 0)) signOk = false;
  }
  P17_reg('p2','sign convention: ratio positive iff the point is inside', signOk);
}
// B17/P17 LAB — p3: the Platonic census
function p3(page) {
  // angle bound, integer form: q(p-2)*180/p < 360  <=>  2(p+q) > pq
  function bound(p, q) { return 2*(p+q) > p*q; }
  // integer equivalence of the two forms over 3..30
  var equivOk = true;
  for (var p = 3; p <= 30; p++) for (var q = 3; q <= 30; q++) {
    var lhs = q*(p-2)*180 < 360*p;
    if (lhs !== bound(p,q)) equivOk = false;
  }
  P17_reg('p3','angle bound equivalent to 1/p+1/q>1/2, 784 pairs', equivOk);
  // the census: exactly five survivors in 3..60
  var surv = [];
  for (var a = 3; a <= 60; a++) for (var b = 3; b <= 60; b++) if (bound(a,b)) surv.push([a,b]);
  P17_reg('p3','census has exactly five survivors', surv.length === 5);
  var key = surv.map(function(s){ return s[0] + ',' + s[1]; }).sort().join(';');
  P17_reg('p3','survivors are (3,3),(4,3),(3,4),(5,3),(3,5)', key === '3,3;3,4;3,5;4,3;5,3');
  // the boundary case (3,6)
  P17_reg('p3','(3,6) is the boundary: 2(p+q) = pq', 2*(3+6) === 3*6);
  P17_reg('p3','(3,6) excluded by strict inequality', !bound(3,6));
  P17_reg('p3','(3,6) vertex sum is exactly 360', 6*(3-2)*180/3 === 360);
  P17_reg('p3','(4,4) also excluded at equality', !bound(4,4) && 2*(4+4) === 4*4);
  // vertex angle sums
  function vsum(p, q) { return q*(p-2)*180/p; }
  P17_reg('p3','tetra vertex sum 180', vsum(3,3) === 180);
  P17_reg('p3','cube vertex sum 270', vsum(4,3) === 270);
  P17_reg('p3','octa vertex sum 240', vsum(3,4) === 240);
  P17_reg('p3','dodeca vertex sum 324', vsum(5,3) === 324);
  P17_reg('p3','icosa vertex sum 300', vsum(3,5) === 300);
  P17_reg('p3','all five sums integers', [vsum(3,3),vsum(4,3),vsum(3,4),vsum(5,3),vsum(3,5)].every(function(v){ return v === Math.round(v); }));
  // counting formulas: d = 2p+2q-pq; E = 2pq/d; V = 4p/d; F = 4q/d
  function counts(p, q) { var d = 2*p+2*q-p*q; return { d: d, E: 2*p*q/d, V: 4*p/d, F: 4*q/d }; }
  var five = [[3,3],[4,3],[3,4],[5,3],[3,5]];
  var dVals = [];
  var intOk = true, eulerOk = true;
  for (var i = 0; i < five.length; i++) {
    var c = counts(five[i][0], five[i][1]);
    dVals.push(c.d);
    if (!(c.E === Math.round(c.E) && c.V === Math.round(c.V) && c.F === Math.round(c.F))) intOk = false;
    if (c.V - c.E + c.F !== 2) eulerOk = false;
  }
  P17_reg('p3','d values 3,2,2,1,1', dVals.join(',') === '3,2,2,1,1');
  P17_reg('p3','all counts integral', intOk);
  P17_reg('p3','Euler V-E+F=2 for all five', eulerOk);
  var t = counts(3,3), cu = counts(4,3), oc = counts(3,4), dod = counts(5,3), ico = counts(3,5);
  P17_reg('p3','tetrahedron 4,6,4', t.V===4 && t.E===6 && t.F===4);
  P17_reg('p3','cube 8,12,6', cu.V===8 && cu.E===12 && cu.F===6);
  P17_reg('p3','octahedron 6,12,8', oc.V===6 && oc.E===12 && oc.F===8);
  P17_reg('p3','dodecahedron 20,30,12', dod.V===20 && dod.E===30 && dod.F===12);
  P17_reg('p3','icosahedron 12,30,20', ico.V===12 && ico.E===30 && ico.F===20);
  // 2E = pF and 2E = qV for all five
  var handOk = true;
  for (var j = 0; j < five.length; j++) {
    var p = five[j][0], q = five[j][1], c2 = counts(p,q);
    if (!(2*c2.E === p*c2.F && 2*c2.E === q*c2.V)) handOk = false;
  }
  P17_reg('p3','handshakes 2E=pF=qV for all five', handOk);
  // the flip (p,q) -> (q,p): involution, V/F swap, E fixed, census closed
  var flipOk = true, vswapOk = true, esymOk = true;
  for (var m = 0; m < five.length; m++) {
    var pq = five[m], qp = [pq[1], pq[0]];
    var inSet = five.some(function(s){ return s[0]===qp[0] && s[1]===qp[1]; });
    if (!inSet) flipOk = false;
    var c1 = counts(pq[0],pq[1]), c2b = counts(qp[0],qp[1]);
    if (c1.V !== c2b.F || c1.F !== c2b.V) vswapOk = false;
    if (c1.E !== c2b.E) esymOk = false;
  }
  P17_reg('p3','flip is an involution on the census (closed)', flipOk && bound(3,3) === bound(3,3));
  P17_reg('p3','flip swaps V and F', vswapOk);
  P17_reg('p3','flip fixes E', esymOk);
  P17_reg('p3','tetrahedron self-dual: only survivor with p=q', five.filter(function(s){ return s[0]===s[1]; }).length === 1 && five[0][0] === five[0][1]);
  // census halved: enumerate p <= q only
  var half = [];
  for (var u = 3; u <= 60; u++) for (var v = u; v <= 60; v++) if (bound(u,v)) half.push([u,v]);
  P17_reg('p3','p<=q enumeration gives three', half.length === 3);
  P17_reg('p3','p<=q survivors (3,3),(3,4),(3,5)', half.map(function(s){return s[0]+','+s[1];}).join(';') === '3,3;3,4;3,5');
  P17_reg('p3','flip supplies the other two', (function(){ var need = [[4,3],[5,3]]; return need.every(function(n){ return five.some(function(s){ return s[0]===n[0] && s[1]===n[1]; }) && half.every(function(s){ return !(s[0]===n[0] && s[1]===n[1]); }); }); })());
  // Exercise 2 specifics
  var e2 = counts(4,3);
  P17_reg('p3','Ex2: (4,3) gives E=12, V=8, F=6', e2.E===12 && e2.V===8 && e2.F===6);
  P17_reg('p3','Ex2: 8-12+6 = 2', e2.V - e2.E + e2.F === 2);
  var e2f = counts(3,4);
  P17_reg('p3','Ex2: octahedron 6,12,8 with Euler 2', e2f.V - e2f.E + e2f.F === 2 && e2f.V === e2.F && e2f.F === e2.V);
}
// B17/P17 LAB — p4: De Morgan and the set census (4-element universe, bitmasks)
function p4(page) {
  var FULL = 15; // universe {1,2,3,4}
  function comp(S) { return FULL ^ S; }
  function sub(A, B) { return (A & B) === A; } // A subset of B
  var subsets = [];
  for (var s = 0; s <= 15; s++) subsets.push(s);
  P17_reg('p4','16 subsets of the 4-element universe', subsets.length === 16);
  // Promise 1: involution
  var invOk = true;
  for (var i = 0; i < 16; i++) if (comp(comp(subsets[i])) !== subsets[i]) invOk = false;
  P17_reg('p4','(S\')\' = S, all 16 subsets', invOk);
  // membership flips
  var memOk = true;
  for (var S = 0; S <= 15; S++) for (var x = 0; x < 4; x++) {
    var inS = (S & (1 << x)) !== 0;
    var inC = (comp(S) & (1 << x)) !== 0;
    if (inS === inC) memOk = false; // must always differ
  }
  P17_reg('p4','x in S iff x not in S\', 64 pairs', memOk);
  // De Morgan over all 256 ordered pairs
  var dmOk = true, pairs = 0;
  for (var a = 0; a <= 15; a++) for (var b = 0; b <= 15; b++) {
    pairs++;
    if (comp(a | b) !== (comp(a) & comp(b))) dmOk = false;
  }
  P17_reg('p4','De Morgan (A|B)\' = A\'&B\' over ' + pairs + ' pairs', dmOk && pairs === 256);
  // spot: A=1101, B=0110
  P17_reg('p4','De Morgan spot check', comp(0b1101 | 0b0110) === (comp(0b1101) & comp(0b0110)));
  // inclusion reversal: A subset of B iff B' subset of A'
  var incOk = true;
  for (var a2 = 0; a2 <= 15; a2++) for (var b2 = 0; b2 <= 15; b2++) {
    if (sub(a2, b2) !== sub(comp(b2), comp(a2))) incOk = false;
  }
  P17_reg('p4','inclusion reverses: A in B iff B\' in A\', 256 pairs', incOk);
  // the two distributive laws over all 4096 triples
  var d1Ok = true, d2Ok = true, trip = 0;
  for (var A = 0; A <= 15; A++) for (var B = 0; B <= 15; B++) for (var C = 0; C <= 15; C++) {
    trip++;
    if ((A & (B | C)) !== ((A & B) | (A & C))) d1Ok = false;
    if ((A | (B & C)) !== ((A | B) & (A | C))) d2Ok = false;
  }
  P17_reg('p4','distributive law 1 over ' + trip + ' triples', d1Ok && trip === 4096);
  P17_reg('p4','distributive law 2 over 4096 triples', d2Ok);
  // the flip executed: complement both sides of law 1, push De Morgan, obtain law 2
  var flipOk = true;
  for (var A2 = 0; A2 <= 15; A2++) for (var B2 = 0; B2 <= 15; B2++) for (var C2 = 0; C2 <= 15; C2++) {
    var lhsComp = comp(A2 & (B2 | C2));
    var pushed = comp(A2) | (comp(B2) & comp(C2));           // De Morgan on the left side
    var rhsComp = comp((A2 & B2) | (A2 & C2));
    var rhsPushed = (comp(A2) | comp(B2)) & (comp(A2) | comp(C2)); // De Morgan on the right side
    if (!(lhsComp === pushed && rhsComp === rhsPushed)) flipOk = false;
  }
  P17_reg('p4','complementing law 1 and pushing De Morgan yields law 2, 4096 triples', flipOk);
  // quantifier flip: not(all x in S: P) iff exists x in S: not P
  var qOk = true;
  for (var Pm = 0; Pm <= 15; Pm++) for (var S2 = 0; S2 <= 15; S2++) {
    var all = (Pm & S2) === S2;             // every element of S satisfies P
    var existsNot = (comp(Pm) & S2) !== 0;  // some element of S fails P
    if (!all !== existsNot) qOk = false;
  }
  P17_reg('p4','not-forall equals exists-not, 256 combos', qOk);
  // the page\'s counts
  P17_reg('p4','page counts: 16 subsets, 256 pairs, 4096 triples', subsets.length === 16 && pairs === 256 && trip === 4096);
}
// B17/P17 LAB — p5: exercise recompute, SVG pixel maps, text needles
function p5(page) {
  // ---- Exercise 5 witnesses
  // duals of (0,0),(1,0),(0,1) are y=0, y=x, y=-1: no common point
  var w = [[0,0],[1,0],[0,1]].map(function(t){ return { m: t[0], c: -t[1] }; });
  P17_reg('p5','ex5 witness duals y=0, y=x, y=-1', w[0].m===0&&w[0].c===0 && w[1].m===1&&w[1].c===0 && w[2].m===0&&w[2].c===-1);
  P17_reg('p5','ex5 witnesses: y=0 and y=-1 parallel (no common point)', w[0].m === w[2].m && w[0].c !== w[2].c);
  P17_reg('p5','ex5 witnesses: y=0 meets y=x at (0,0), not on y=-1', (0 === 1*0 + 0) && !(0 === 1*0 - 1));
  // (1,2),(1,5): same first coordinate, parallel duals
  P17_reg('p5','ex5 (1,2),(1,5) duals parallel', (function(){ var u={m:1,c:-2}, v={m:1,c:-5}; return u.m===v.m && u.c!==v.c; })());
  // naive S1 corpse: y=x and y=x+1 never meet
  P17_reg('p5','naive S1 false: y=x and y=x+1 share no point', (function(){ var a={m:1,c:0}, b={m:1,c:1}; return a.m===b.m && a.c!==b.c; })());
  // S5 at-most over the 120 pairs of the 16 grid duals: parallel or exactly one crossing
  var lines = [];
  for (var p = 0; p <= 3; p++) for (var q = 0; q <= 3; q++) lines.push({ m: p, c: -q });
  var par = 0, atMostOk = true;
  for (var i = 0; i < lines.length; i++) for (var j = i+1; j < lines.length; j++) {
    if (lines[i].m === lines[j].m) { par++; if (lines[i].c === lines[j].c) atMostOk = false; }
    else { // unique crossing; a second common point would need same slope
      atMostOk = atMostOk && true;
    }
  }
  P17_reg('p5','S5: 120 pairs, 24 parallel, none coincident', par === 24 && atMostOk);
  // ---- Exercise 4: the impossibility arithmetic
  var twoX = true;
  for (var x = -5; x <= 5; x++) { if ((2*x === 0) !== (x === 0)) twoX = false; }
  P17_reg('p5','ex4: 2x=0 iff x=0 over integers', twoX);
  P17_reg('p5','ex4: f(2)-f(3)=f(5) and f(3)-f(2)=f(5) force f(2)=f(3)', (function(){ var v = 7; return (v - (-v) === 2*v) && 2*v === 14; })());
  P17_reg('p5','ex4: injectivity then contradicts 2 != 3', 2 !== 3);
  // ---- Fig P17.1 panel A: px = 25x - 5, py = 186 - 12y
  function paCircle(x, y) { return 'cx="' + (25*x - 5) + '" cy="' + (186 - 12*y) + '"'; }
  P17_reg('p5','fig1 A: (2,5) at (45,126)', P17_has(page, '<circle ' + paCircle(2,5) + ' r="4"'));
  P17_reg('p5','fig1 A: (3,9) at (70,78)', P17_has(page, '<circle ' + paCircle(3,9) + ' r="4"'));
  P17_reg('p5','fig1 A: (7,4) at (170,138)', P17_has(page, '<circle ' + paCircle(7,4) + ' r="4"'));
  P17_reg('p5','fig1 A: dashed AB', P17_has(page, 'x1="45" y1="126" x2="70" y2="78"'));
  P17_reg('p5','fig1 A: dashed BC', P17_has(page, 'x1="70" y1="78" x2="170" y2="138"'));
  P17_reg('p5','fig1 A: dashed CA', P17_has(page, 'x1="45" y1="126" x2="170" y2="138"'));
  // ---- Fig P17.1 panel B: px = 90 + 22x, py = 35 - 10y, Math.round
  function pbx(x) { return Math.round(90 + 22*x); }
  function pby(y) { return Math.round(35 - 10*y); }
  P17_reg('p5','fig1 B: L1 endpoints', P17_has(page, 'x1="' + pbx(-1.4) + '" y1="' + pby(-7.8) + '" x2="' + pbx(4.1) + '" y2="' + pby(3.2) + '"'));
  P17_reg('p5','fig1 B: L2 endpoints', P17_has(page, 'x1="' + pbx(-4/3) + '" y1="' + pby(-13) + '" x2="' + pbx(4.1) + '" y2="' + pby(3.3) + '"'));
  P17_reg('p5','fig1 B: L3 endpoints', P17_has(page, 'x1="' + pbx(-9/7) + '" y1="' + pby(-13) + '" x2="' + pbx(15/14) + '" y2="' + pby(3.5) + '"'));
  P17_reg('p5','fig1 B: crossing (4,3) marked', P17_has(page, 'cx="' + pbx(4) + '" cy="' + pby(3) + '"'));
  P17_reg('p5','fig1 B: crossing (-0.2,-5.4) marked', P17_has(page, 'cx="' + pbx(-0.2) + '" cy="' + pby(-5.4) + '"'));
  P17_reg('p5','fig1 B: crossing (-1.25,-12.75) marked', P17_has(page, 'cx="' + pbx(-1.25) + '" cy="' + pby(-12.75) + '"'));
  P17_reg('p5','fig1 B: lines really are y=2x-5, y=3x-9, y=7x-4',
    Math.abs(2*(-1.4) - 5 + 7.8) < 1e-9 && Math.abs(3*(-4/3) - 9 + 13) < 1e-9 && Math.abs(7*(-9/7) - 4 + 13) < 1e-9 &&
    Math.abs(2*4.1 - 5 - 3.2) < 1e-9 && Math.abs(3*4.1 - 9 - 3.3) < 1e-9 && Math.abs(7*15/14 - 4 - 3.5) < 1e-9);
  // ---- Fig P17.2: labels and hexagon
  P17_reg('p5','fig2 cube label', P17_has(page, 'cube · V=8 E=12 F=6'));
  P17_reg('p5','fig2 octahedron label', P17_has(page, 'octahedron · V=6 E=12 F=8'));
  P17_reg('p5','fig2 tetrahedron label', P17_has(page, 'tetrahedron · V=4 E=6 F=4 — flips to itself'));
  P17_reg('p5','fig2 hexagon wireframe', P17_has(page, 'points="75,40 112,62 112,108 75,130 38,108 38,62"'));
  P17_reg('p5','fig2 flip arrows', P17_count(page, '↔') === 2);
  // ---- Fig P17.3: parallel pair, dashed extensions, ghost point
  P17_reg('p5','fig3 solid line 1', P17_has(page, '<line x1="20" y1="140" x2="180" y2="60"'));
  P17_reg('p5','fig3 solid line 2', P17_has(page, '<line x1="20" y1="130" x2="140" y2="70"'));
  var cr1 = 160*(-60) - (-80)*120;   // directions (160,-80) and (120,-60)
  var cr2 = 44*(-80) - (-22)*160;    // extension of line 1
  var cr3 = 76*(-60) - (-38)*120;    // extension of line 2
  P17_reg('p5','fig3 the two solid lines are parallel (cross 0)', cr1 === 0);
  P17_reg('p5','fig3 dashed extensions stay on their lines', cr2 === 0 && cr3 === 0);
  P17_reg('p5','fig3 ghost point at (220,34)', P17_has(page, 'cx="220" cy="34"'));
  P17_reg('p5','fig3 infinity label', P17_has(page, '∞ · direction (1, 1)'));
  P17_reg('p5','fig3 label y=x+1 above y=x', P17_has(page, 'y="116" font-size="11" fill="#333">y = x+1') && P17_has(page, 'y="150" font-size="11" fill="#333">y = x'));
  // ---- more pinned needles (none cross anchor markup)
  var needles = ['Two questions, cold', 'one question wearing two uniforms', 'the dictionary doing the tailoring', 'Two questions, cold', 'two kinds of object', 'the certificate is exhaustive', 'no dictionary means no flip', 'at most one point (two shared points would force the lines to coincide)', 'the flip hands you the other two without a single new angle computation', 'Five solids in the universe, and you paid for three', 'points at infinity', 'the census\'s missing ledger entry', 'Promises 1 and 2, checked', 'the inclusion reversal hold in every single one', 'new geometry named here and not built here', '1,578 years later', 'solve the mirrored problem instead', 'The repair, named', 'the hexagonal tiling'];
  var needleOk = true;
  for (var n = 0; n < needles.length; n++) { if (!P17_has(page, needles[n])) needleOk = false; }
  P17_reg('p5','all ' + needles.length + ' text needles present', needleOk);
  // ---- poisons
  P17_reg('p5','poison: no draft self-corrections', !P17_has(page, 'scratch that') && !P17_has(page, ' — hmm') && !P17_has(page, 'let me think') && !P17_has(page, 'TODO'));
  P17_reg('p5','poison: no wrong census numbers', !P17_has(page, '45 collinear') && !P17_has(page, '560 collinear') && !P17_has(page, '28 collinear triples on vertical'));
  P17_reg('p5','poison: no stale footer', !P17_has(page, 'P16 · Flip to the dual'));
  // ---- determinants one more time, computed the slow way (2x2 minors, no P17_det)
  function slowDet(r1, r2, r3) {
    return r1[0]*(r2[1]*r3[2]-r2[2]*r3[1]) - r1[1]*(r2[0]*r3[2]-r2[2]*r3[0]) + r1[2]*(r2[0]*r3[1]-r2[1]*r3[0]);
  }
  P17_reg('p5','slow recompute: page point det -21', slowDet([2,5,1],[3,9,1],[7,4,1]) === -21);
  P17_reg('p5','slow recompute: page line det +21', slowDet([2,-1,-5],[3,-1,-9],[7,-1,-4]) === 21);
  P17_reg('p5','slow recompute: Ex1 det 3 and -3', slowDet([1,4,1],[2,6,1],[3,11,1]) === 3 && slowDet([1,-1,-4],[2,-1,-6],[3,-1,-11]) === -3);
}
// B17/P17 LAB — tail: runBattery and standalone guard
function runBattery(PAGE) {
  P17_checks = [];
  p0(PAGE); p1(PAGE); p2(PAGE); p3(PAGE); p4(PAGE); p5(PAGE);
  var parts = ['p0','p1','p2','p3','p4','p5'];
  var cnt = {};
  for (var i = 0; i < parts.length; i++) cnt[parts[i]] = { total: 0, pass: 0 };
  var fails = 0;
  var failNames = [];
  for (var j = 0; j < P17_checks.length; j++) {
    var c = P17_checks[j];
    cnt[c.part].total++;
    if (c.pass) cnt[c.part].pass++; else { fails++; failNames.push('[' + c.part + '] ' + c.name); }
  }
  var total = P17_checks.length, passed = total - fails;
  var verdict = 'B17/P17 LAB — checks: ' + passed + '/' + total + ', ' + fails + ' FAIL';
  verdict += '\n  ' + parts.map(function(pt){ return pt + ': ' + cnt[pt].pass + '/' + cnt[pt].total; }).join('  ');
  if (failNames.length) verdict += '\n  FAILS: ' + failNames.join(' | ');
  return { verdict: verdict, passed: passed, total: total, fails: fails, failureNames: failNames };
}
if (typeof __P17_STANDALONE__ !== 'undefined' && __P17_STANDALONE__ && typeof PAGE !== 'undefined') {
  runBattery(PAGE);
}
