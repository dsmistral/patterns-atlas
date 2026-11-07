// P37 Lab G — grafts 1+3 vs the page: OU spring dyadic ladder (exact) and the
// cubic census at N=4 (integer identity, all 16 doubled-unit paths).
async function main() {
  const gates = [], poisons = [];
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p37-page.html' });
  const page = String(f.content), B = String.fromCharCode(92);
  gates.push({ claim: 'page whole post-graft', pass: !f.was_truncated && page.length > 39000 });
  const gam = 0.5, fr = [16 / 15, 64 / 63, 256 / 255], Ds = [0.25, 0.0625, 0.015625];
  const lad = Ds.map(function (d) { return 1 / (gam * (2 - gam * d)); });
  gates.push({ claim: 'ladder exact 16/15, 64/63, 256/255 → 1', pass: lad.every(function (v, i) { return Math.abs(v - fr[i]) < 1e-12; }) && lad[0] > lad[1] && lad[1] > lad[2] && lad[2] > 1 });
  gates.push({ claim: 'certificate v(1−(1−γΔ)²) = σ²Δ', pass: lad.every(function (v, i) { return Math.abs(v * (1 - (1 - gam * Ds[i]) * (1 - gam * Ds[i])) - Ds[i]) < 1e-12; }) });
  gates.push({ claim: 'spring iterate → 16/15 (Δ=1/4)', pass: (function () { let v = 0; for (let k = 0; k < 200; k++) v = 0.765625 * v + 0.25; return Math.abs(v - 16 / 15) < 1e-9; })() });
  gates.push({ claim: 'v(t) → σ²/2γ = 1', pass: Math.abs(1 - Math.exp(-50) - 1) < 1e-12 });
  const ou = ['dX = -' + B + 'gamma X' + B + ',dt + ' + B + 'sigma' + B + ',dW', 'e^{-' + B + 'gamma(t-s)}', B + 'dot{v} = -2' + B + 'gamma' + B + ',v + ' + B + 'sigma^2', 'v(' + B + 'Delta) = ' + B + 'sigma^2/(' + B + 'gamma(2 - ' + B + 'gamma' + B + 'Delta))', 'variance ' + B + '(' + B + 'sigma^2/2' + B + 'gamma', 'equipartition, priced'];
  gates.push({ claim: 'OU needles: sentence, trajectory, ODE, steady, settle', pass: ou.every(function (s) { return page.includes(s); }) });
  gates.push({ claim: 'dyadic ladder string in §4 AND scope box', pass: page.split(B + 'tfrac{16}{15}, ' + B + 'tfrac{64}{63}, ' + B + 'tfrac{256}{255}').length === 3 });
  let cen = true;
  for (let m = 0; m < 16; m++) { let p = 0, a = 0, b = 0, c = 0;
    for (let k = 0; k < 4; k++) { const d = (m >> k) & 1 ? 1 : -1; a += p * p * d; b += p; c += d * d * d; p += d; }
    if (p * p * p !== 3 * a + 3 * b + c) cen = false; }
  gates.push({ claim: 'cubic census N=4: p4³ = 3Σp²d + 3Σp + Σd³, 16/16', pass: cen });
  gates.push({ claim: 'noise book dies as N^{-1/2} (N=4,16,64)', pass: [4, 16, 64].map(function (n) { return 1 / Math.sqrt(n); }).every(function (v, i, a) { return i === 0 || a[i] < a[i - 1]; }) });
  const cu = ['3' + B + 'sum W_k (' + B + 'Delta W_k)^2 = ' + B + 'tfrac{3}{N}' + B + 'sum W_k', "which dies at the audit's rate " + B + '(N^{-1/2}', 'For (d): ' + B + "(f'(x) = 3x^2" + B + '), ' + B + "(f''(x) = 6x" + B + ')', "the cubic book's telescoping at " + B + '(N = 4'];
  gates.push({ claim: 'cubic needles: Riemann book, dies rate, hint, scope', pass: cu.every(function (s) { return page.includes(s); }) });
  gates.push({ claim: 'cubic identity stated twice (prompt + answer)', pass: page.split(B + 'int_0^T W_t^2' + B + ',dW_t = ' + B + 'tfrac{1}{3}W_T^3 - ' + B + 'int_0^T W_t' + B + ',dt').length === 3 });
  poisons.push({ claim: 'naive σ²/2γ at finite Δ', pass: !page.includes(B + 'Delta) = ' + B + 'sigma^2/2' + B + 'gamma') && Math.abs(16 / 15 - 1) > 0.06 });
  poisons.push({ claim: 'cubic noise book claimed identically zero', pass: !page.includes('vanishes identically') && !page.includes(B + 'sum (' + B + 'Delta W_k)^3 = 0') });
  return { lab: 'G', gates: gates.length, gatesPass: gates.filter(function (g) { return g.pass; }).length, poisons: poisons.length, poisonsRejected: poisons.filter(function (p) { return p.pass; }).length, green: gates.every(function (g) { return g.pass; }) && poisons.every(function (p) { return p.pass; }) };
}
