// P64 Lab F — figure coordinates machine-checked against the page's own numbers:
// Fig P64.1 (mapping x = 230 + 80u, y = 150 − 40v) and Fig P64.2 (boundary circle,
// converging lines, affine parallels). String gates use exact substrings of the page.
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p64-page.html' });
  const page = String(f.content);
  gates.push({ claim: 'page read whole', pass: !f.was_truncated && page.length > 40000 });
  // Fig P64.1 mapping (exact integer arithmetic: 80·(±1/2) = ±40):
  // u = −1/2 → x = 190, u = +1/2 → x = 270, u = 0 → x = 230; v = 0 → y = 150.
  gates.push({ claim: 'P64.1 mapping: solid lines at the page zeros ±1/2',
    pass: 230 + 40 === 270 && 230 - 40 === 190 && 150 - 40 * 0 === 150 });
  const s1 = [
    '<line x1="20" y1="150" x2="440" y2="150"',    // the v = 0 axis
    '<line x1="230" y1="20" x2="230" y2="150"',   // doubled constraint u² = 0 at u = 0
    '<line x1="190" y1="20" x2="190" y2="150"',   // u = −1/2
    '<line x1="270" y1="20" x2="270" y2="150"',   // u = +1/2
    '<circle cx="230" cy="150" r="6" fill="none"', // hollow: the eye's one point
    '<circle cx="190" cy="150" r="5"',
    '<circle cx="270" cy="150" r="5"'
  ];
  gates.push({ claim: 'P64.1 SVG elements exact', pass: s1.every(function (s) { return page.includes(s); }) });
  // Fig P64.2: boundary circle center (355,95) r 85; meeting point (440,95) lies on it:
  // (440−355)² + (95−95)² = 7225 = 85². Both right-panel lines end at the meeting point.
  gates.push({ claim: 'P64.2 meeting point on the boundary circle',
    pass: (440 - 355) * (440 - 355) + (95 - 95) * (95 - 95) === 85 * 85 });
  gates.push({ claim: 'P64.2 affine parallels never meet', pass: 100 !== 70 });
  const s2 = [
    '<line x1="20" y1="100" x2="225" y2="100"',   // L: y = 0 (left panel)
    '<line x1="20" y1="70" x2="225" y2="70"',     // y = δ (left panel)
    '<circle cx="355" cy="95" r="85"',
    '<line x1="275" y1="105" x2="440" y2="95"',
    '<line x1="275" y1="65" x2="440" y2="95"',
    '<circle cx="440" cy="95" r="5"'
  ];
  gates.push({ claim: 'P64.2 SVG elements exact', pass: s2.every(function (s) { return page.includes(s); }) });
  // prose citations: each figure named twice (caption + prose)
  gates.push({ claim: 'Fig P64.1 cited from prose', pass: page.split('Fig P64.1').length === 3 });
  gates.push({ claim: 'Fig P64.2 cited from prose', pass: page.split('Fig P64.2').length === 3 });
  // Poisons
  poisons.push({ claim: 'meeting point drawn at the circle center', pass: !page.includes('<circle cx="355" cy="95" r="5"') });
  poisons.push({ claim: 'solid lines drawn at ±1/4', pass: !page.includes('x1="210"') && !page.includes('x1="250"') });
  poisons.push({ claim: 'left-panel parallels drawn meeting', pass: !page.includes('<line x1="20" y1="100" x2="225" y2="70"') });
  const green = gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; });
  return { lab: 'F', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length,
    poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: green };
}
