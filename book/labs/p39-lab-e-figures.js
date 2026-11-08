async function main() {
  const BS = String.fromCharCode(92);
  const MINUS = String.fromCharCode(8722);
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p39-page.html' });
  const page = String(f.content);
  const gates = [], poisons = [];
  const g = (n, p) => gates.push({ name: n, pass: !!p });
  const po = (n, p) => poisons.push({ name: n, pass: !!p });
  const blocks = page.split('<figure');
  const figs = blocks.slice(1).filter(b => b.includes('<figcaption>'));
  const f1 = figs.find(b => b.includes('<strong>Fig P39.2.</strong>')) || '';
  const f2 = figs.find(b => b.includes('<strong>Fig P39.1.</strong>')) || '';
  const parseRects = (blk) => (blk.match(/<rect [^>]*fill="#0f5c57"[^>]*>/g) || []).map(s => ({ x: +(/x="([^"]*)"/.exec(s) || [])[1], y: +(/y="([^"]*)"/.exec(s) || [])[1], h: +(/height="([^"]*)"/.exec(s) || [])[1] }));
  const parseLines = (blk, color) => (blk.match(new RegExp('<line [^>]*stroke="' + color + '"[^>]*>', 'g')) || []).map(s => ({ x1: +(/x1="([^"]*)"/.exec(s) || [])[1], y1: +(/y1="([^"]*)"/.exec(s) || [])[1], y2: +(/y2="([^"]*)"/.exec(s) || [])[1] }));
  const parseCircles = (blk, color) => (blk.match(new RegExp('<circle [^>]*fill="' + color + '"[^>]*>', 'g')) || []).map(s => ({ cx: +(/cx="([^"]*)"/.exec(s) || [])[1], cy: +(/cy="([^"]*)"/.exec(s) || [])[1] }));
  const near = (a, b, tol) => Math.abs(a - b) <= tol;

  g('E1 two figures; Fig P39.1 cited exactly twice; Fig P39.2 exactly twice', blocks.length === 3 && (page.match(/Fig P39\.1/g) || []).length === 2 && (page.match(/Fig P39\.2/g) || []).length === 2);
  const r1 = parseRects(f1);
  const vals = [0.4, 4 / 13, 3 / 11, 8 / 35];
  const expY = vals.map(v => 171 - 304.4 * v);
  g('E2 Fig P39.1 bars: x at 105/220/335/450, bottoms on the 171 axis, tops on scale within 2px', r1.length === 4 && [105, 220, 335, 450].every((x, i) => r1[i].x === x) && r1.every(r => r.y + r.h === 171) && r1.every((r, i) => near(r.y, expY[i], 2)));
  const marks1 = parseLines(f1, '#8a4b08');
  const truthVals = [1 / 3, 4 / 15, 8 / 35];
  const markY = marks1.map(l => l.y1).sort((a, b) => a - b);
  const circ1 = parseCircles(f1, '#8a4b08');
  g('E3 Fig P39.1 truth marks at 69/90/101 on scale; meeting circle at 101', markY.length >= 3 && near(markY[0], 171 - 304.4 * truthVals[0], 2) && near(markY[1], 171 - 304.4 * truthVals[1], 2) && near(markY[2], 171 - 304.4 * truthVals[2], 2) && circ1.length === 1 && near(circ1[0].cy, 101.35, 2));
  const axis1 = parseLines(f1, '#8a94a3');
  g('E4 Fig P39.1 axis line at y=171; scale labels 0.45/0.30/0.15/0.00', axis1.some(l => l.y1 === 171 && l.y2 === 171) && ['0.45', '0.30', '0.15', '0.00'].every(t => f1.includes(t)));
  g('E5 Fig P39.1 value labels 0.400/0.308/0.273/0.229, truth labels 0.333/0.267/0.229 = truth', ['0.400', '0.308', '0.273', '0.229', '0.333', '0.267', '0.229 = truth'].every(t => f1.includes(t)));
  const axis2 = parseLines(f2, '#1a1a1a');
  const grid2 = parseLines(f2, '#d8d4cc');
  g('E6 Fig P39.2 zero line at 115; +1 gridline at 55; minus-1 gridline at 175; labels present', axis2.some(l => l.y1 === 115 && l.y2 === 115) && grid2.some(l => l.y1 === 55) && grid2.some(l => l.y1 === 175) && f2.includes('+1') && f2.includes(MINUS + '1'));
  const c2 = parseCircles(f2, '#0f5c57');
  const greenVals = [1, 1 / 169, 1 / 169, 64 / 169, 1 / 169, 16 / 169, 16 / 169, 16 / 169];
  const cxs = [95, 150, 205, 260, 315, 370, 425, 480];
  g('E7 Fig P39.2 green circles: 8 profiles, cy on scale y = 115 - 60v within 2px', c2.length === 8 && cxs.every((x, i) => c2[i].cx === x) && c2.every((c, i) => near(c.cy, 115 - 60 * greenVals[i], 2)));
  const o2 = parseCircles(f2, '#8a4b08');
  const stems2 = parseLines(f2, '#8a4b08');
  g('E8 Fig P39.2 orange: 3 circles at cy=175 (value -1) with stems from the zero line', o2.length === 3 && o2.every(c => c.cy === 175) && stems2.filter(l => l.y1 === 115 && l.y2 === 175).length === 3);
  const caps = page.match(/<figcaption><strong>Fig P39\.[12]\.<\/strong>([\s\S]*?)<\/figcaption>/g) || [];
  g('E9 captions: pointwise caption (now Fig P39.1, appears first) has 10, 15, 30 and non-negative; ladder caption (now Fig P39.2) has 0.400 and meets', caps.length === 2 && caps[0].includes('10, 15, 30') && caps[0].includes('non-negative') && caps[1].includes('0.400') && caps[1].includes('meets'));
  const arias = page.match(/aria-label="[^"]*"/g) || [];
  g('E10 no aria-label contains "Fig P39" (citation-inflation fix held)', arias.length === 2 && arias.every(s => !s.includes('Fig P39')));

  const f1bad = f1.replace('y="49" width="34" height="122"', 'y="49" width="34" height="132"');
  const r1bad = parseRects(f1bad);
  po('PE1 corrupted bar height (122 to 132) is caught (bottom leaves the axis)', r1bad.length === 4 && r1bad[0].y + r1bad[0].h !== 171);
  const f2bad = f2.replace('cy="92"', 'cy="86"');
  const c2bad = parseCircles(f2bad, '#0f5c57');
  po('PE2 corrupted circle position (92 to 86) is caught (off the pointwise scale)', c2bad.length === 8 && !c2bad.every((c, i) => near(c.cy, 115 - 60 * greenVals[i], 2)));
  const pageBad = page.replace('aria-label="Pointwise', 'aria-label="Fig P39.1 Pointwise');
  po('PE3 citation-inflating aria-label is caught', (pageBad.match(/Fig P39\.1/g) || []).length === 3);

  const gp = gates.filter(x => x.pass).length, pp = poisons.filter(x => x.pass).length;
  return { lab: 'E figures', gates: gp + '/' + gates.length, poisons: pp + '/' + poisons.length, failed: gates.concat(poisons).filter(x => !x.pass).map(x => x.name) };
}
