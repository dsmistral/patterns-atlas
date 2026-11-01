
/* ---------- group D: the etale route ---------- */
var TI_PTS = [{ bit: 1, nb: [1, 3] }, { bit: 2, nb: [2, 3] }];
var d1ok = true, d2ok = true, d3ok = true;
var d4 = {};
for (i = 0; i < PRE.length; i++) {
  P = PRE[i];
  if (stalkSize(P, TI, [1, 3]) !== P.n[1]) { d1ok = false; }
  if (stalkSize(P, TI, [2, 3]) !== P.n[2]) { d1ok = false; }
  var sx = sectionsOver(P, TI, TI_PTS, 3);
  if (sx !== P.n[1] * P.n[2]) { d2ok = false; }
  if (sectionsOver(P, TI, TI_PTS, 0) !== 1) { d3ok = false; }
  var dkey = '1,' + P.n[1] + ',' + P.n[2] + ',' + sx;
  d4[dkey] = (d4[dkey] || 0) + 1;
}
check('D1', 'stalks', d1ok, 'stalk at e ≅ F(E), stalk at w ≅ F(W), for all 190');
check('D2', 'etale sections', d2ok, 's_E · s_W for all 190: any pair of germs is continuous');
check('D3', 'empty sections', d3ok, 'exactly 1 for all 190');
check('D4', 'etale shapes', d4['1,1,1,1'] === 6 && d4['1,1,2,2'] === 26 && d4['1,2,1,2'] === 26 && d4['1,2,2,4'] === 132, '(1,1,1,1)x6, (1,1,2,2)x26, (1,2,1,2)x26, (1,2,2,4)x132');
var MRG2 = { n: [1, 1, 1, 2], m: { '3,1': [0, 0], '3,2': [0, 0], '1,0': [0], '2,0': [0], '3,0': [0, 0] } };
var mStk = stalkSize(MRG2, TI, [1, 3]) === 1 && stalkSize(MRG2, TI, [2, 3]) === 1;
var mSec = sectionsOver(MRG2, TI, TI_PTS, 3);
check('D5', 'etale merge', isPre(MRG2) && MRG2.n[3] === 2 && mStk && mSec === 1, '(1,1,1,2) → (1,1,1,1): the etale repair merges the pair');
var d6ok = true;
var U2, pc2, sc, x, y2, p2, dist;
for (i = 0; i < SHEAVES.length; i++) {
  P = SHEAVES[i];
  for (U2 = 0; U2 < TI.k; U2++) {
    sc = sectionsOver(P, TI, TI_PTS, U2);
    if (sc !== P.n[U2]) { d6ok = false; }
    for (x = 0; x < P.n[U2]; x++) {
      for (y2 = x + 1; y2 < P.n[U2]; y2++) {
        dist = false;
        for (p2 = 0; p2 < TI_PTS.length; p2++) {
          if (!(TI.masks[U2] & TI_PTS[p2].bit)) { continue; }
          pc2 = pointClasses(P, TI, TI_PTS[p2].nb);
          if (ufFind(pc2, U2 * 3 + x) !== ufFind(pc2, U2 * 3 + y2)) { dist = true; break; }
        }
        if (!dist) { d6ok = false; }
      }
    }
  }
}
check('D6', 'sheaves fixed', d6ok, 'for all 5 sheaves the germ-pair map F(U) → F~(U) is a bijection');

/* ---------- group S: the published page ---------- */
var PAGE = fs.readFileSync(path.join(__dirname, '..', 'p62-sheafify-on-site.html'), 'utf8');
function cnt(hay, needle) { return hay.split(needle).length - 1; }
check('S1', 'sections', cnt(PAGE, '<h2>') === 8, '8 h2 sections (§1–§8)');
check('S2', 'figures', cnt(PAGE, '<svg') === 3 && cnt(PAGE, 'page-figure') === 3, '3 svg, 3 page-figure (Fig P62.1–P62.3)');
check('S3', 'boxes', cnt(PAGE, 'class="pattern-box"') === 3 && cnt(PAGE, 'class="eq"') === 1 && cnt(PAGE, 'sketch-marker') === 1 && cnt(PAGE, 'class="moons"') === 1, '3 pattern-box, 1 eq display, 1 sketch-marker, 1 moons');
check('S4', 'exhibits and warnings', cnt(PAGE, '<div class="exhibit">') === 3 && cnt(PAGE, 'warn-box') === 1 && cnt(PAGE, '<details>') === 9, '3 exhibit, 1 warn-box, 9 details');
var PIN_LINE = String.raw`<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"></script>`;
var CFG_LINE = String.raw`window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']]},svg:{fontCache:'global'}};`;
check('S5', 'MathJax pin', PAGE.indexOf(PIN_LINE) >= 0 && PAGE.indexOf(CFG_LINE) >= 0, 'MathJax 3.2.2 pin byte-identical to P60; double-backslash delimiters');
var hrefSet = {};
var hre = /href="([^"]*)"/g;
var hm;
while ((hm = hre.exec(PAGE)) !== null) { hrefSet[hm[1]] = true; }
var WANT = { 'assets/style.css': 1, 'index.html': 1, 'p31-universal-property.html': 1, 'p33-sheaf-cohomology-bridge.html': 1, 'p47-diagram-chase.html': 1, 'p48-representable-functor.html': 1, 'p60-group-completion.html': 1, 'p61-straighten-unstraighten.html': 1 };
var hrefOk = true, kk2;
for (kk2 in hrefSet) { if (hrefSet.hasOwnProperty(kk2) && !WANT[kk2]) { hrefOk = false; } }
for (kk2 in WANT) { if (WANT.hasOwnProperty(kk2) && !hrefSet[kk2]) { hrefOk = false; } }
check('S6', 'links', hrefOk, 'hrefs exactly: style, index, P31, P33, P47, P48, P60, P61');
check('S7', 'no raw TeX', cnt(PAGE, '$') === 0 && PAGE.indexOf('\\begin') < 0, '0 raw dollars, 0 \\begin');
var doorStart = PAGE.indexOf('id="doors"');
var doorEnd = PAGE.indexOf('</section>', doorStart);
check('S8', 'doors and next', doorStart >= 0 && doorEnd > doorStart && cnt(PAGE.slice(doorStart, doorEnd), '<li>') === 6 && PAGE.indexOf(String.raw`Next:</strong> <a href="p61-straighten-unstraighten.html">P61 · Straighten and unstraighten</a>`) >= 0, '6 doors, footer Next = P61 · Straighten and unstraighten');
check('S9', 'corrections enshrined',
  PAGE.indexOf(String.raw`forcing a two-record country`) >= 0 &&
  PAGE.indexOf(String.raw`and that is law, not coincidence`) >= 0 &&
  PAGE.indexOf(String.raw`<p class="eq">`) >= 0 &&
  PAGE.indexOf(String.raw`s_E \\cdot s_W = 2\\) — and two shaped`) >= 0 &&
  PAGE.indexOf(String.raw`P(\\varnothing) = \\{\\ast\\}`) >= 0 &&
  PAGE.indexOf(String.raw`the matching is free`) >= 0 &&
  PAGE.indexOf(String.raw`country of \\(4\\)? no`) < 0 &&
  PAGE.indexOf(String.raw`\\(84\\>)`) < 0 &&
  PAGE.indexOf(String.raw`s_E \cdot s_W`) < 0 &&
  PAGE.indexOf(String.raw`for every \\(U\\), every restriction the identity`) < 0,
  'review corrections enshrined: census parenthetical, law-not-coincidence, eq block, double-backslash cdot, one empty record');

/* ---------- runner ---------- */
var ri, r;
for (ri = 0; ri < RESULTS.length; ri++) {
  r = RESULTS[ri];
  console.log((r.ok ? 'PASS ' : 'FAIL ') + (ri + 1) + '. ' + r.id + ' ' + r.name + ' — ' + r.detail);
}
console.log('p62-lab: ' + (RESULTS.length - FAILED) + '/' + RESULTS.length + ' checks passed');
if (FAILED > 0) { process.exit(1); }
