// P30 Lab E — figures: Fig P30.1 prime circles on the 60+18p grid with the
// right colors, Fig P30.2 the corrected 27-bar 3-lens histogram (height
// 40/3^v₃(n)); both cited twice; regression poisons for the old wrong bars.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p30-page.html' });
  const page = String(f.content);
  gates.push({ claim: 'page whole', pass: !f.was_truncated && page.length > 38000 });
  const SUP = String.fromCharCode(178), EQ = String.fromCharCode(8801), MIN = String.fromCharCode(8722);
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  const friendly = [2, 5, 13, 17, 29];
  let circles = true;
  for (const p of primes) {
    const cx = 60 + 18 * p, fill = friendly.indexOf(p) >= 0 ? '#0f5c57' : '#8a4b08';
    if (!page.includes('<circle cx="' + cx + '" cy="70" r="9" fill="' + fill + '"/>')) circles = false;
    if (!page.includes('<text x="' + cx + '" y="45"')) circles = false;
  }
  gates.push({ claim: 'Fig P30.1: ten circles at cx = 60+18p, green iff p ∈ {2,5,13,17,29}, labels at y=45', pass: circles });
  gates.push({ claim: 'Fig P30.1 witness labels: 1²+1², 2²≡−1, 5²≡−1, 4²≡−1, 12²≡−1', pass:
    page.includes('>1' + SUP + '+1' + SUP + '<') && page.includes('>2' + SUP + EQ + MIN + '1<') && page.includes('>5' + SUP + EQ + MIN + '1<') &&
    page.includes('>4' + SUP + EQ + MIN + '1<') && page.includes('>12' + SUP + EQ + MIN + '1<') &&
    page.includes('<text x="96" y="118"') && page.includes('<text x="150" y="118"') && page.includes('<text x="294" y="118"') &&
    page.includes('<text x="366" y="118"') && page.includes('<text x="582" y="118"') });
  gates.push({ claim: 'Fig P30.1 axis line 80,95 → 600,95', pass: page.includes('<line x1="80" y1="95" x2="600" y2="95"') });
  function v3(n) { let k = 0, m = n; while (m % 3 === 0) { k++; m /= 3; } return k; }
  let bars = true, barsCount = 0, units40 = 0;
  for (let n = 1; n <= 27; n++) {
    const x = 30 + 20 * n;
    const v = v3(n);
    const fill = v === 0 ? '#0f5c57' : '#8a4b08';
    const h = 40 / Math.pow(3, v);
    const ys = Math.round((170 - h) * 10) / 10, hs = Math.round(h * 10) / 10;
    const pat = '<rect x="' + x + '" y="' + ys + '" width="12" height="' + hs + '" fill="' + fill + '"/>';
    if (!page.includes(pat)) bars = false; else barsCount++;
    if (Math.round((ys + hs) * 10) !== 1700) bars = false;
    if (hs === 40) units40++;
  }
  gates.push({ claim: 'Fig P30.2: all 27 bars exact, height 40/3^v₃(n), y+h = 170 exact in tenths', pass: bars && barsCount === 27 });
  gates.push({ claim: 'Fig P30.2 census: 18 unit bars at height 40, 6 at 13.3, 2 at 4.4, 1 at 1.5', pass: units40 === 18 && page.split('height="13.3"').length === 7 && page.split('height="4.4"').length === 3 && page.split('height="1.5"').length === 2 });
  gates.push({ claim: 'Fig P30.2 labels 1, 3, 9, 27 and axis y=170 from 20 to 600', pass:
    page.includes('<text x="56" y="122"') && page.includes('<text x="96" y="148"') && page.includes('<text x="216" y="158"') &&
    page.includes('<text x="576" y="161"') && page.includes('<line x1="20" y1="170" x2="600" y2="170"') });
  gates.push({ claim: 'both figures cited twice (caption + one prose cite)', pass:
    page.split('Fig P30.1').length === 3 && page.split('Fig P30.2').length === 3 });
  gates.push({ claim: 'captions exact', pass: page.includes('Fig P30.1 — Every prime answers') && page.includes('Fig P30.2 — The 3-lens and its idea of size.') });
  poisons.push({ claim: 'no Fig P30.3 (renumber leak)', pass: !page.includes('Fig P30.3') });
  poisons.push({ claim: 'old wrong bar <rect x="190" y="165.6" absent (regression)', pass: !page.includes('<rect x="190" y="165.6"') });
  poisons.push({ claim: 'no witness label under a brown prime (x=114 = p=3 absent)', pass: !page.includes('<text x="114" y="118"') });
  return { lab: 'E', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
