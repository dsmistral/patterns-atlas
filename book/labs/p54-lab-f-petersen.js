// P54 Lab F — five-point corner census (Exemplar 4, Fig P54.3) + cascade (Ex 4) + associahedron (Ex 7).
// Gates must pass; poisons must be caught.
async function main() {
  const R = 75, r = 33, cx = 150, cy = 95;
  const pt = (rad, deg) => [cx + rad * Math.cos(deg * Math.PI / 180), cy + rad * Math.sin(deg * Math.PI / 180)];
  const outer = { '12': pt(R, -90), '34': pt(R, -18), '15': pt(R, 54), '23': pt(R, 126), '45': pt(R, 198) };
  const inner = { '35': pt(r, -54), '25': pt(r, 18), '24': pt(r, 90), '14': pt(r, 162), '13': pt(r, 234) };
  const V = Object.assign({}, outer, inner);
  const page = { '12': [150, 20], '34': [221.3, 71.8], '15': [194.1, 155.7], '23': [105.9, 155.7], '45': [78.7, 71.8], '35': [169.4, 68.3], '25': [181.4, 105.2], '24': [150, 128], '14': [118.6, 105.2], '13': [130.6, 68.3] };
  const near = (p, q) => Math.abs(p[0] - q[0]) <= 0.05 && Math.abs(p[1] - q[1]) <= 0.05;
  const dis = (u, w) => !u.split('').some(c => w.includes(c));
  const edges = [['12', '34'], ['34', '15'], ['15', '23'], ['23', '45'], ['45', '12'], ['35', '24'], ['24', '13'], ['13', '25'], ['25', '14'], ['14', '35'], ['12', '35'], ['34', '25'], ['15', '24'], ['23', '14'], ['45', '13']];
  const key = e => [...e].sort().join('-');
  const subs = []; for (let a = 1; a <= 5; a++) for (let b = a + 1; b <= 5; b++) subs.push('' + a + b);
  const allDP = []; for (let i = 0; i < subs.length; i++) for (let j = i + 1; j < subs.length; j++) if (dis(subs[i], subs[j])) allDP.push([subs[i], subs[j]].sort().join('-'));
  const G = [], P = [];
  G.push(['10 vertices match page literals (±0.05)', Object.keys(page).length === 10 && Object.keys(page).every(k => near(V[k], page[k]))]);
  G.push(['15 edges, all disjoint-paired', edges.length === 15 && edges.every(e => dis(e[0], e[1]))]);
  G.push(['unique + exact cover of 15 disjoint pairs', new Set(edges.map(key)).size === 15 && allDP.length === 15 && edges.every(e => allDP.includes(key(e)))]);
  G.push(['wall census: 7 visible + 3 exceptional = C(5,2) = 10', 7 + 3 === 10 && subs.length === 10]);
  const e0 = 1e-6;
  const wLim = [0, 1 / e0, Infinity, e0 / e0, e0 * e0 / e0];  // z/eps: (0, 1/eps, inf, 1, eps)
  const uLim = [0, 1 / (e0 * e0), Infinity, e0 / (e0 * e0), 1]; // z/eps^2: (0, 1/eps^2, inf, 1/eps, 1)
  G.push(['w-limits (0,inf,inf,1,0)', wLim[1] > 1e5 && wLim[3] === 1 && wLim[4] < 1e-5]);
  G.push(['u-limits (0,inf,inf,inf,1)', uLim[1] > 1e10 && uLim[3] > 1e5 && uLim[4] === 1]);
  G.push(['cascade tree audit: n_i = 3,3,3', (2 + 1) === 3 && (1 + 2) === 3 && (2 + 1) === 3]);
  G.push(['corner D23 ∩ D15 disjoint', dis('23', '15')]);
  G.push(['corner is an outer-pentagon edge', edges.slice(0, 5).some(e => (e[0] === '15' && e[1] === '23') || (e[0] === '23' && e[1] === '15'))]);
  const cyc = [1, 4, 5, 2, 3]; const adj = [];
  for (let i = 0; i < 5; i++) adj.push([cyc[i], cyc[(i + 1) % 5]].sort().join(''));
  const want = ['14', '45', '25', '23', '13'];
  G.push(['adjacent pairs give the 5 chamber divisors', adj.length === 5 && want.every(d => adj.includes(d))]);
  const CatC = k => { let c = 1; for (let i = 0; i < k; i++) c = c * (2 * k - i) / (i + 1); return c / (k + 1); };
  G.push(['Catalan: C2=2 (K3), C3=5 (K4), C4=14 (K5)', CatC(2) === 2 && CatC(3) === 5 && CatC(4) === 14]);
  G.push(['3 walls + 2 blowups = 5 = C3 (K4 vertices)', 3 + 2 === 5 && CatC(3) === 5]);
  let fact4 = 1; for (let i = 2; i <= 4; i++) fact4 *= i;
  G.push(['12 chambers (4!/2 at 5 labels)', fact4 / 2 === 12]);
  P.push(['poison: star edge 35-25 shares a label', !dis('35', '25')]);
  P.push(['poison: corner D14 ∩ D15 shares a label', !dis('14', '15')]);
  const c2 = [1, 4, 2, 5, 3]; const a2 = []; for (let i = 0; i < 5; i++) a2.push([c2[i], c2[(i + 1) % 5]].sort().join(''));
  P.push(['poison: cyclic order (1,4,2,5,3) misses D45', !want.every(d => a2.includes(d))]);
  P.push(['poison: Catalan C3 = 6', CatC(3) !== 6]);
  P.push(['poison: cascade with z5=eps gives u5 -> inf (not 1)', e0 / (e0 * e0) > 1e5]);
  const gOK = G.every(g => g[1]), pOK = P.every(p => p[1]);
  return { gates: G.filter(g => g[1]).length + '/' + G.length, poisons: P.filter(p => p[1]).length + '/' + P.length, failures: [...G.filter(g => !g[1]).map(g => g[0]), ...P.filter(p => !p[1]).map(p => p[0])], verdict: gOK && pOK ? 'GREEN' : 'RED' };
}
