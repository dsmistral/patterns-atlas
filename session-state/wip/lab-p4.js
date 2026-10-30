// P4: the storm office's spring 100 — the block's dictionary recomputed from scratch.
function P4(PAGE) {
  // --- small integer matrix helpers (exact) ---
  function mmul(X, Y) { return [[X[0][0]*Y[0][0] + X[0][1]*Y[1][0], X[0][0]*Y[0][1] + X[0][1]*Y[1][1]], [X[1][0]*Y[0][0] + X[1][1]*Y[1][0], X[1][0]*Y[0][1] + X[1][1]*Y[1][1]]]; }
  function mvec(X, v) { return [X[0][0]*v[0] + X[0][1]*v[1], X[1][0]*v[0] + X[1][1]*v[1]]; }
  // --- the machine and its rails ---
  var M = [[3,1],[2,2]];
  VN('p4', 'M (1,1) = 4 x (1,1)', mvec(M,[1,1]), [4,4]);
  VN('p4', 'M (1,-2) = 1 x (1,-2)', mvec(M,[1,-2]), [1,-2]);
  // P blue-first, det P, P^{-1}MP = diag(1,4) in exact integer arithmetic
  var P = [[1,1],[-2,1]];
  var detP = P[0][0]*P[1][1] - P[0][1]*P[1][0];
  VN('p4', 'det P', detP, 3);
  var MP = mmul(M, P);
  var adj = [[P[1][1], -P[0][1]], [-P[1][0], P[0][0]]]; // adjugate
  var raw = mmul(adj, MP); // = detP * P^{-1}MP
  var okDiag = raw[0][0] % detP === 0 && raw[1][1] % detP === 0 && raw[0][1] === 0 && raw[1][0] === 0 && raw[0][0]/detP === 1 && raw[1][1]/detP === 4;
  V('p4', 'P^{-1}MP = diag(1,4) exactly', okDiag);
  // page needles: machine, rails, P, det
  V('p4', 'page prints M', PAGE.indexOf('\\(M = \\begin{bmatrix} 3 &amp; 1 \\\\ 2 &amp; 2 \\end{bmatrix}\\)') >= 0);
  V('p4', 'page prints the rails', PAGE.indexOf('the red diagonal \\((1,1)\\) stretched \\(\\times 4\\), the blue cove arrow \\((1,-2)\\) stretched \\(\\times 1\\)') >= 0);
  V('p4', 'page prints P blue-first', PAGE.indexOf('\\begin{bmatrix} 1 &amp; 1 \\\\ -2 &amp; 1 \\end{bmatrix}') >= 0);
  V('p4', 'page prints det P = 3', PAGE.indexOf('det P \\;=\\; 3') >= 0);
  V('p4', 'page prints P^{-1}MP = diag(1,4)', PAGE.indexOf('P^{-1}MP = \\begin{bmatrix} 1 &amp; 0 \\\\ 0 &amp; 4 \\end{bmatrix}') >= 0);
  // --- the reading of the office's point ---
  // (3,0) = a(1,-2) + b(1,1): a + b = 3, -2a + b = 0
  var a = 1, b = 2;
  V('p4', 'reading solves the two little equations', a + b === 3 && -2*a + b === 0);
  VN('p4', 'reading of (3,0)', [a, b], [1,2]);
  V('p4', 'page prints the reading', PAGE.indexOf('its rail reading is \\((1, 2)\\)') >= 0);
  V('p4', 'page prints the two equations', PAGE.indexOf('\\(a + b = 3\\)') >= 0 && PAGE.indexOf('\\(-2a + b = 0\\)') >= 0);
  // --- orbit vs closed form, n = 0..6 ---
  var pt = [3,0], orbit = [[3,0]];
  for (var f0 = 1; f0 <= 6; f0++) { pt = mvec(M, pt); orbit.push(pt.slice()); }
  var cfOK = true;
  for (var n0 = 0; n0 <= 6; n0++) { var cf = [1 + 2*Math.pow(4,n0), -2 + 2*Math.pow(4,n0)]; if (cf[0] !== orbit[n0][0] || cf[1] !== orbit[n0][1]) cfOK = false; }
  V('p4', 'closed form (1+2*4^n, -2+2*4^n) matches the orbit n=0..6', cfOK);
  VN('p4', 'orbit n=1 (Lecture 0 first feed)', orbit[1], [9,6]);
  VN('p4', 'orbit n=2', orbit[2], [33,30]);
  VN('p4', 'orbit n=3', orbit[3], [129,126]);
  // x - y = 3 invariant on the orbit
  var invOK = true;
  orbit.forEach(function(o){ if (o[0] - o[1] !== 3) invOK = false; });
  V('p4', 'x - y = 3 on every spring of the orbit', invOK);
  V('p4', 'blue signature 1-(-2)=3, red contributes 1-1=0', (1 - (-2)) === 3 && (1 - 1) === 0);
  // page needles: return ticket, checks, invariant
  V('p4', 'page prints the return ticket', PAGE.indexOf('\\bigl(1 + 2 \\cdot 4^{100},\\;\\; -2 + 2 \\cdot 4^{100}\\bigr)') >= 0);
  V('p4', 'page prints spring-1 check', PAGE.indexOf('\\((1 + 8,\\, -2 + 8) = (9,6)\\)') >= 0);
  V('p4', 'page prints spring-2 check', PAGE.indexOf('spring 2 gives \\((33,30)\\)') >= 0);
  V('p4', 'page prints the invariant', PAGE.indexOf('the difference \\(x - y\\) is exactly \\(3\\) in every spring') >= 0);
  // --- digit-array arithmetic for the immense answer ---
  function dbl(digits) { var carry = 0, out = []; for (var i = digits.length - 1; i >= 0; i--) { var v = digits[i]*2 + carry; out.unshift(v % 10); carry = Math.floor(v / 10); } if (carry) out.unshift(carry); return out; }
  function bigMul(x, y) { var out = []; for (var i = 0; i < x.length + y.length; i++) out.push(0); for (var i2 = x.length - 1; i2 >= 0; i2--) { var carry = 0; for (var j2 = y.length - 1; j2 >= 0; j2--) { var m2 = out[i2 + j2 + 1] + x[i2]*y[j2] + carry; out[i2 + j2 + 1] = m2 % 10; carry = Math.floor(m2 / 10); } var p2 = i2; while (carry > 0) { var m3 = out[p2] + carry; out[p2] = m3 % 10; carry = Math.floor(m3 / 10); p2--; } } return out; }
  function strip(digits) { while (digits.length > 1 && digits[0] === 0) digits.shift(); return digits; }
  function str(digits) { return digits.join(''); }
  // 2^200 and 2^201 by repeated doubling
  var two200 = [1];
  for (var d0 = 0; d0 < 200; d0++) two200 = dbl(two200);
  VN('p4', '2^200 digit count', two200.length, 61);
  VN('p4', '2^200 opens 1606938044', str(two200).slice(0,10), '1606938044');
  var two201 = dbl(two200.slice());
  VN('p4', '2^201 digit count', two201.length, 61);
  VN('p4', '2^201 opens 321387608851', str(two201).slice(0,12), '321387608851');
  // 4^100 by the six squarings + two multiplies route, digit arrays
  var p4arr = [4]; var e = 1;
  var table = { '1': [4] };
  for (var s0 = 0; s0 < 6; s0++) { p4arr = strip(bigMul(p4arr, p4arr)); e = e * 2; table[String(e)] = p4arr.slice(); }
  VN('p4', 'six squarings reach 4^64', e, 64);
  var f100 = strip(bigMul(table['64'], table['32']));
  f100 = strip(bigMul(f100, table['4']));
  VN('p4', '64 + 32 + 4 = 100', 64 + 32 + 4, 100);
  VN('p4', '4^64 * 4^32 * 4^4 = 2^200 (string equal)', str(f100), str(two200));
  // spring 100 coordinates: (2^201 + 1, 2^201 - 2), both 61 digits, differ by 3
  function addSmall(digits, k) { var d = digits.slice(), i = d.length - 1, carry = k; while (carry !== 0) { if (i < 0) { if (carry > 0) { d.unshift(carry); } carry = 0; break; } var v = d[i] + carry; var dd = ((v % 10) + 10) % 10; carry = (v - dd) / 10; d[i] = dd; i--; } return strip(d); }
  var x100 = addSmall(two201, 1), y100 = addSmall(two201, -2);
  VN('p4', 'x_100 digit count', x100.length, 61);
  VN('p4', 'y_100 digit count', y100.length, 61);
  VN('p4', 'x_100 opens 321387608851', str(x100).slice(0,12), '321387608851');
  VN('p4', 'y_100 opens 321387608851', str(y100).slice(0,12), '321387608851');
  V('p4', 'x_100 - y_100 = 3 (61-digit subtraction)', (function(){ var i = x100.length - 1, d = x100.slice(), borrow = 0; for (var q3 = y100.length - 1; q3 >= 0; q3--) { var v = d[i] - y100[q3] - borrow; if (v < 0) { v += 10; borrow = 1; } else borrow = 0; d[i] = v; i--; } var s = strip(d); return str(s) === '3'; })());
  V('p4', 'page prints sixty-one digits and the openings', PAGE.indexOf('runs to sixty-one digits and opens \\(1606938044\\ldots\\)') >= 0 && PAGE.indexOf('opening \\(321387608851\\ldots\\)') >= 0);
  V('p4', 'page says differ by exactly 3', PAGE.indexOf('they differ by exactly \\(3\\)') >= 0);
  // --- price structure needles ---
  V('p4', 'page price: six squarings + two', PAGE.indexOf('six squarings and two multiplications') >= 0);
  V('p4', 'page price: the factorization', PAGE.indexOf('\\(4^{100} = 4^{64} \\cdot 4^{32} \\cdot 4^4\\)') >= 0);
  V('p4', 'page price: eight big multiplications', PAGE.indexOf('eight big multiplications') >= 0);
  // boundary
  V('p4', 'page boundary: answer in translated clothes', PAGE.indexOf('the answer above, not its reading') >= 0);
}
