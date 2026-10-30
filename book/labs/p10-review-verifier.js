// p10-review-verifier.js — adversarial verifier for the P10 battery (S40).
// Fresh engine; ZERO shared code with p10-lab.js. The battery is a black box:
//   new Function('page', labSource)(pageSource) -> {text, pass, fail, total}.
// This verifier runs as: new Function('page','lab', src)(pageSource, labSource).
// Guard: battery must be clean on the real page. Each triple poisons one
// needle; the battery MUST go non-clean on the doctored page. Two fresh
// positive controls at the end. Target: 16 checks, 0 MISS.
const V = []; let OK = 0, MISS = 0;
const labRun = p => { const r = (new Function('page', lab))(p); return r.fail; };
const T = [
['fiftysix', 'every single one of the fifty-six', 'every single one of the fifty-seven'],
['pointer', 'the pigeonhole proves that somebody must', 'the pigeonhole proves that nobody must'],
['gt101', '101 > 100', '102 > 100'],
['party-count', '32{,}768', '33{,}768'],
['next-link', 'href="p11-contradiction.html"', 'href="p11-contradiction-x.html"'],
['fig3-mid', 'x1="170" y1="20" x2="170" y2="220"', 'x1="170" y1="20" x2="170" y2="221"'],
['fig1-slot', 'cx="30" cy="92" r="13" fill="#3574d4"', 'cx="30" cy="93" r="13" fill="#3574d4"'],
['mathjax', "fontCache:'global'", "fontCache:'local'"],
['p23', '0.5073', '0.5074'],
['dirichlet', 'Dirichlet', 'Birichlet'],
['repair-num', '2\\sqrt{2}/3 \\approx 0.94', '2\\sqrt{2}/3 \\approx 0.95'],
['h3-ex5', '<h3>Exercise 5 ◐ — the birthday census</h3>', '<h3>Exercise 5 ◐ — the birthday sensus</h3>'],
['fig2-chain', 'cx="114" cy="88" r="11" fill="#3574d4"', 'cx="114" cy="89" r="11" fill="#3574d4"'],
['sharp', 'kn+1', 'kn+2'],
];
const base = labRun(page);
if (base !== 0) {
  V.push('BASE: battery NOT clean on real page (' + base + ' FAIL) — aborting, all triples void');
  for (const t of T) { MISS++; V.push('TRIPLE ' + t[0] + ': void (base dirty)'); }
  V.push('VERDICT: ' + (OK + MISS) + ' checks, ' + MISS + ' MISS');
  return V.join('\n');
}
V.push('BASE: battery clean on real page (0 FAIL)');
for (const [n, ndl, poi] of T) {
  if (page.indexOf(ndl) === -1) { MISS++; V.push('TRIPLE ' + n + ': AUDIT-FAIL needle absent from real page'); continue; }
  const doc = page.replace(ndl, poi);
  if (doc === page || doc.indexOf(ndl) !== -1) { MISS++; V.push('TRIPLE ' + n + ': AUDIT-FAIL poison ineffective or needle survives'); continue; }
  const f = labRun(doc);
  if (f > 0) { OK++; V.push('TRIPLE ' + n + ': caught — battery reports ' + f + ' FAIL on doctored page'); }
  else { MISS++; V.push('TRIPLE ' + n + ': MISSED — battery clean on doctored page'); }
}
// fresh control A: party of six — every one of the 32768 graphs collides; no graph has both a 0 and a 5.
const E = []; for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) E.push([a, b]);
let coll = true, co0 = 0;
for (let m = 0; m < 32768; m++) {
  const d = [0, 0, 0, 0, 0, 0];
  for (let k = 0; k < 15; k++) if ((m >> k) & 1) { d[E[k][0]]++; d[E[k][1]]++; }
  const seen = [false, false, false, false, false, false]; let distinct = 0;
  for (const x of d) if (!seen[x]) { seen[x] = true; distinct++; }
  if (distinct === 6) coll = false;
  if (seen[0] && seen[5]) co0++;
}
if (coll && co0 === 0) { OK++; V.push('CONTROL party: all 32768 graphs collide; zero 0-and-5 coexistence'); }
else { MISS++; V.push('CONTROL party: FAIL coll=' + coll + ' co0=' + co0); }
// fresh control B: phantom repair via 9-bit masks — 16/126 fives evade sum-10; 84/84 sixes hit.
let n5 = 0, ev5 = 0, n6 = 0, h6 = 0;
for (let m = 0; m < 512; m++) {
  const el = []; for (let i = 0; i < 9; i++) if ((m >> i) & 1) el.push(i + 1);
  const pc = el.length; if (pc !== 5 && pc !== 6) continue;
  let hit = false;
  for (let i = 0; i < pc; i++) for (let j = i + 1; j < pc; j++) if (el[i] + el[j] === 10) hit = true;
  if (pc === 5) { n5++; if (!hit) ev5++; } else { n6++; if (hit) h6++; }
}
if (n5 === 126 && ev5 === 16 && n6 === 84 && h6 === 84) { OK++; V.push('CONTROL phantom: 16/126 fives evade; 84/84 sixes hit — repair honest'); }
else { MISS++; V.push('CONTROL phantom: FAIL n5=' + n5 + ' ev5=' + ev5 + ' n6=' + n6 + ' h6=' + h6); }
V.push('VERDICT: ' + (OK + MISS) + ' checks, ' + MISS + ' MISS');
return V.join('\n');
