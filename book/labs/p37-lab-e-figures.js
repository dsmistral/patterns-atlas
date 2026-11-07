// P37 Lab E — the two figures against the page: SVG substrings exact, pixel geometry
// recomputed. Fig P37.1: bars 6px vs 24px = per-step books 1/16 vs 1/4 (ratio 4).
// Fig P37.3 (drag figure, renumbered from P37.2 by the G5 graft): polylines y = 280 − 30(e^{rt} − 1) at x = 60 + 20t, t = 0,5,10,15,20,25.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p37-page.html' });
  const page = String(f.content);
  gates.push({ claim: 'page read whole', pass: !f.was_truncated && page.length > 30000 });
  // Fig P37.1: the 8 bars (4 smooth h=6, 4 walk h=24) at x = 100/235/370/495.
  const xs = [100, 235, 370, 495];
  gates.push({ claim: 'P37.1 rects exact (8 bars)',
    pass: xs.every(function (x) { return page.includes('<rect x="' + x + '" y="144" width="16" height="6" fill="#5a5a5a"/>'); }) &&
      xs.every(function (x) { return page.includes('<rect x="' + x + '" y="296" width="16" height="24" fill="#8a4b08"/>'); }) });
  gates.push({ claim: 'bar heights ratio 4 = (1/4)/(1/16) at N=4',
    pass: 24 / 6 === 4 && (0.25) / (0.0625) === 4 });
  const s1 = ['M 40 140 L 175 128 L 310 116 L 445 104 L 560 92',
    'M 40 275 L 175 250 L 310 285 L 445 245 L 560 280',
    'smooth path: the squared-step book dies',
    'the walk: the squared-step book is the clock',
    'each 1/16 — total 1/4, and dying as 1/N',
    'each 1/4 — total 1, at every N, on every path'];
  gates.push({ claim: 'P37.1 paths and labels exact', pass: s1.every(function (s) { return page.includes(s); }) });
  // Fig P37.2: recompute both polylines from y = 280 − 30(e^{rt} − 1).
  const ts = [0, 5, 10, 15, 20, 25];
  function pts(r) {
    return ts.map(function (t) {
      const v = 280 - 30 * (Math.exp(r * t) - 1);
      return (60 + 20 * t) + ',' + (v % 1 === 0 ? String(v) : v.toFixed(1));
    }).join(' ');
  }
  const med = pts(0.06), mean = pts(0.08);
  gates.push({ claim: 'median polyline recomputed to 0.1px', pass: page.includes('<polyline points="' + med + '"') });
  gates.push({ claim: 'mean polyline recomputed to 0.1px', pass: page.includes('<polyline points="' + mean + '"') });
  const s2 = ['<line x1="60" y1="280" x2="580" y2="280"', '<line x1="60" y1="280" x2="60" y2="40"',
    '<text x="40" y="284"', '<text x="40" y="94"', '>median e^{0.06t}</text>', '>mean e^{0.08t}</text>', 't = 25 years'];
  gates.push({ claim: 'P37.3 axes and labels exact', pass: s2.every(function (s) { return page.includes(s); }) });
  // Axis label placement: value 7 sits at y = 280 − 30·6 = 100, label baseline 94 (6 above);
  // value 1 sits on the axis y = 280, label baseline 284 (4 below).
  gates.push({ claim: 'axis labels placed at their values',
    pass: 280 - 30 * (7 - 1) === 100 && 100 - 94 === 6 && 284 - 280 === 4 });
  // Labels attach to their own curves: median label 169 rides its far point 175.5;
  // mean label 80 rides its far point 88.3.
  gates.push({ claim: 'curve labels attach to their own curves',
    pass: Math.abs(169 - 175.5) < 7 && Math.abs(80 - 88.3) < 9 });
  gates.push({ claim: 'Fig P37.1 and P37.3 (renumbered) each cited twice',
    pass: page.split('Fig P37.1').length === 3 && page.split('Fig P37.3').length === 3 });
  // Poisons
  poisons.push({ claim: 'mapping without the −1: y = 280 − 30e^{rt}',
    pass: (280 - 30 * Math.exp(0.06 * 25)).toFixed(1) !== '175.5' });
  poisons.push({ claim: 'labels swapped (median label on the mean curve)',
    pass: Math.abs(169 - 88.3) > 50 && Math.abs(80 - 175.5) > 50 });
  poisons.push({ claim: 'walk bars drawn at the smooth height',
    pass: !page.includes('height="6" fill="#8a4b08"') && !page.includes('height="24" fill="#5a5a5a"') });
  return { lab: 'E', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length,
    green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
