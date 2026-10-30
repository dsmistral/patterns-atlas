function p5(P) {
  // --- §5 intro ---
  check('p5', 'grades line present', P.includes('●●● a climb · ◐ open exploration. Hints and worked answers are collapsible.'));
  // --- Ex1 ---
  var A = [[2, 1], [1, 2]], P1 = [[1, 1], [-1, 1]], P1i = [[0.5, -0.5], [0.5, 0.5]], D1 = [[1, 0], [0, 3]];
  check('p5', 'Ex1 statement', P.includes('The symmetric machine \\(A = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}\\) — the machine of <a href="b07-eigenvectors.html">B07</a>\'s first exercise, rails already hunted: \\((1,1)\\) with \\(\\lambda = 3\\) and \\((1,-1)\\) with \\(\\lambda = 1\\)'));
  check('p5', 'Ex1 task filing', P.includes('File the eigen-scheme\'s dictionary \\(P\\) — smaller stretch factor\'s rail first — health-check it, and write the reverse dictionary by Box B06.A'));
  check('p5', 'Ex1 task return trip', P.includes('feed \\((1,0)\\) five times, one feed per rung, and check the last rung against the closed form\'s first column'));
  check('p5', 'Ex1 (a) first column needle', P.includes('(a) First column the \\(\\lambda = 1\\) rail \\((1,-1)\\), second the \\(\\lambda = 3\\) rail \\((1,1)\\)'));
  check('p5', 'Ex1 P display', P.includes('\\(P = \\begin{bmatrix} 1 & 1 \\\\ -1 & 1 \\end{bmatrix}\\), \\(\\det P = 1 + 1 = 2 \\ne 0\\), healthy'));
  check('p5', 'Ex1 P inverse display', P.includes('\\(P^{-1} = \\frac{1}{2}\\begin{bmatrix} 1 & -1 \\\\ 1 & 1 \\end{bmatrix}\\) by Box B06.A'));
  check('p5', 'Ex1 (b) middle product', P.includes('= \\frac{1}{2}\\begin{bmatrix} 1 & -1 \\\\ 3 & 3 \\end{bmatrix}\\begin{bmatrix} 1 & 1 \\\\ -1 & 1 \\end{bmatrix} = \\frac{1}{2}\\begin{bmatrix} 2 & 0 \\\\ 0 & 6 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 3 \\end{bmatrix}\\)'));
  check('p5', 'Ex1 pure stretch read', P.includes(': a pure stretch, \\(\\times 1\\) and \\(\\times 3\\), no mixing'));
  check('p5', 'Ex1 A^5 display', P.includes('\\(A^5 = P \\begin{bmatrix} 1 & 0 \\\\ 0 & 3^5 \\end{bmatrix} P^{-1} = \\frac{1}{2}\\begin{bmatrix} 1 & 243 \\\\ -1 & 243 \\end{bmatrix}\\begin{bmatrix} 1 & -1 \\\\ 1 & 1 \\end{bmatrix} = \\frac{1}{2}\\begin{bmatrix} 244 & 242 \\\\ 242 & 244 \\end{bmatrix} = \\begin{bmatrix} 122 & 121 \\\\ 121 & 122 \\end{bmatrix}\\)'));
  check('p5', 'Ex1 ladder display', P.includes('The ladder: \\(A(1,0) = (2,1)\\); \\(A(2,1) = (5,4)\\); \\(A(5,4) = (14,13)\\); \\(A(14,13) = (41,40)\\); \\(A(41,40) = (122,121)\\)'));
  check('p5', 'Ex1 closed form column', P.includes('the closed form\'s first column is \\(\\left(\\frac{1 + 3^5}{2}, \\frac{-1 + 3^5}{2}\\right) = (122, 121)\\): three routes, one answer'));
  check('p5', 'Ex1 trace glance', P.includes('The trace glance agrees: \\(122 + 122 = 244 = 1 + 3^5\\)'));
  // math: Ex1 verified
  var A5 = matMul(matMul(P1, matPow(D1, 5)), P1i);
  check('p5', 'Ex1 A^5 = [[122,121],[121,122]]', feq(A5[0][0], 122) && feq(A5[0][1], 121) && feq(A5[1][0], 121) && feq(A5[1][1], 122));
  check('p5', 'Ex1 P^-1AP = diag(1,3)', (function () { var W = matMul(matMul(P1i, A), P1); return feq(W[0][0], 1) && feq(W[1][1], 3) && feq(W[0][1], 0) && feq(W[1][0], 0); })());
  check('p5', 'Ex1 det P = 2', det2(P1) === 2);
  check('p5', 'Ex1 trace 244 = 1 + 3^5', 122 + 122 === 1 + Math.pow(3, 5));
  check('p5', 'Ex1 closed-form first column is (122,121)', feq((1 + Math.pow(3, 5)) / 2, 122) && feq((Math.pow(3, 5) - 1) / 2, 121));
  var lad = true, v = [1, 0], seen = [[1, 0], [2, 1], [5, 4], [14, 13], [41, 40], [122, 121]];
  for (var s = 1; s < seen.length; s++) { v = matApply(A, v); if (!(feq(v[0], seen[s][0]) && feq(v[1], seen[s][1]))) lad = false; }
  check('p5', 'Ex1 ladder rungs match A-orbit', lad);
  check('p5', 'Ex1 A^5 first column is the fifth feed', (function () { var W = matPow(A, 5); return feq(W[0][0], 122) && feq(W[1][0], 121); })());
  // --- Ex2 ---
  var C = [[3, 2], [2, 6]], P2 = [[2, 1], [-1, 2]], P2i = [[0.4, -0.2], [0.2, 0.4]], D2 = [[2, 0], [0, 7]];
  check('p5', 'Ex2 statement', P.includes('A second storm machine washes up, \\(C = \\begin{bmatrix} 3 & 2 \\\\ 2 & 6 \\end{bmatrix}\\)'));
  check('p5', 'Ex2 (a) char', P.includes('\\(\\operatorname{tr} C = 9\\), \\(\\det C = 18 - 4 = 14\\): \\(\\lambda^2 - 9\\lambda + 14 = (\\lambda - 2)(\\lambda - 7)\\)'));
  check('p5', 'Ex2 rail at 2', P.includes('For \\(\\lambda = 2\\): \\(C - 2I = \\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\end{bmatrix}\\), so \\(a + 2b = 0\\), rail \\((2,-1)\\)'));
  check('p5', 'Ex2 rail at 2 check', P.includes('check: \\(C(2,-1) = (6-2,\\; 4-6) = (4,-2) = 2(2,-1)\\)'));
  check('p5', 'Ex2 rail at 7', P.includes('For \\(\\lambda = 7\\): \\(C - 7I = \\begin{bmatrix} -4 & 2 \\\\ 2 & -1 \\end{bmatrix}\\), so \\(b = 2a\\), rail \\((1,2)\\)'));
  check('p5', 'Ex2 rail at 7 check', P.includes('check: \\(C(1,2) = (3+4,\\; 2+12) = (7,14) = 7(1,2)\\)'));
  check('p5', 'Ex2 (b) P display', P.includes('\\(P = \\begin{bmatrix} 2 & 1 \\\\ -1 & 2 \\end{bmatrix}\\), \\(\\det P = 4 + 1 = 5\\), healthy'));
  check('p5', 'Ex2 (b) verify chain', P.includes('= \\frac{1}{5}\\begin{bmatrix} 4 & -2 \\\\ 7 & 14 \\end{bmatrix}\\begin{bmatrix} 2 & 1 \\\\ -1 & 2 \\end{bmatrix} = \\frac{1}{5}\\begin{bmatrix} 10 & 0 \\\\ 0 & 35 \\end{bmatrix} = \\begin{bmatrix} 2 & 0 \\\\ 0 & 7 \\end{bmatrix}\\)'));
  check('p5', 'Ex2 (c) C^5 display', P.includes('\\(C^5 = P \\begin{bmatrix} 32 & 0 \\\\ 0 & 16807 \\end{bmatrix} P^{-1} = \\frac{1}{5}\\begin{bmatrix} 64 & 16807 \\\\ -32 & 33614 \\end{bmatrix}\\begin{bmatrix} 2 & -1 \\\\ 1 & 2 \\end{bmatrix} = \\frac{1}{5}\\begin{bmatrix} 16935 & 33550 \\\\ 33550 & 67260 \\end{bmatrix} = \\begin{bmatrix} 3387 & 6710 \\\\ 6710 & 13452 \\end{bmatrix}\\)'));
  check('p5', 'Ex2 (d) trace display', P.includes('Trace: \\(3387 + 13452 = 16839 = 32 + 16807 = 2^5 + 7^5\\) — Vieta\'s sum reading one floor up, holding'));
  check('p5', 'Ex2 school route display', P.includes('School route: \\(C^2 = \\begin{bmatrix} 13 & 18 \\\\ 18 & 40 \\end{bmatrix}\\); \\(C^4 = (C^2)^2 = \\begin{bmatrix} 493 & 954 \\\\ 954 & 1924 \\end{bmatrix}\\); \\(C^5 = C^4 C = \\begin{bmatrix} 3387 & 6710 \\\\ 6710 & 13452 \\end{bmatrix}\\)'));
  check('p5', 'Ex2 closer', P.includes('Both routes, one table'));
  // math: Ex2 verified
  var C5 = matMul(matMul(P2, matPow(D2, 5)), P2i);
  check('p5', 'Ex2 C^5 = [[3387,6710],[6710,13452]]', feq(C5[0][0], 3387) && feq(C5[0][1], 6710) && feq(C5[1][0], 6710) && feq(C5[1][1], 13452));
  check('p5', 'Ex2 P^-1CP = diag(2,7)', (function () { var W = matMul(matMul(P2i, C), P2); return feq(W[0][0], 2) && feq(W[1][1], 7) && feq(W[0][1], 0) && feq(W[1][0], 0); })());
  check('p5', 'Ex2 det P = 5', det2(P2) === 5);
  check('p5', 'Ex2 C(2,-1) = 2(2,-1)', (function () { var w = matApply(C, [2, -1]); return w[0] === 4 && w[1] === -2; })());
  check('p5', 'Ex2 C(1,2) = 7(1,2)', (function () { var w = matApply(C, [1, 2]); return w[0] === 7 && w[1] === 14; })());
  check('p5', 'Ex2 trace 16839 = 2^5 + 7^5', 3387 + 13452 === Math.pow(2, 5) + Math.pow(7, 5));
  check('p5', 'Ex2 school C^2 agrees', (function () { var C2 = matMul(C, C); return feq(C2[0][0], 13) && feq(C2[0][1], 18) && feq(C2[1][0], 18) && feq(C2[1][1], 40); })());
  check('p5', 'Ex2 school C^4 agrees', (function () { var C2 = matMul(C, C), C4 = matMul(C2, C2); return feq(C4[0][0], 493) && feq(C4[0][1], 954) && feq(C4[1][0], 954) && feq(C4[1][1], 1924); })());
  check('p5', 'Ex2 school C^5 agrees', (function () { var C2 = matMul(C, C), W = matMul(matMul(C2, C2), C); return feq(W[0][0], 3387) && feq(W[0][1], 6710) && feq(W[1][0], 6710) && feq(W[1][1], 13452); })());
  check('p5', 'Ex2 D^5 = diag(32, 16807)', (function () { var W = matPow(D2, 5); return W[0][0] === 32 && W[1][1] === 16807 && W[0][1] === 0 && W[1][0] === 0; })());
}
