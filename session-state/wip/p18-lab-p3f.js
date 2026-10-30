// ============ p3f: Fig P18.2 — the room above, pixel by pixel ============
function p3f(page) {
  var T = "p3f";
  function px(p, q) { return [q[0]-p[0], q[1]-p[1]]; }
  function cross2(u, v) { return u[0]*v[1] - u[1]*v[0]; }
  function onLine(a, b, c, tol) { return Math.abs(cross2(px(a,b), px(a,c))) < (tol || 0.5); }
  var Os = [280,230], A = [410,120], B = [500,50], C = [50,120];
  var Ap = [345,175], Bp = [353.33,170], Cp = [395,285];
  var P = [320,190], Q = [320,78], R = [320,120];
  chk(T, "O*, A, A' collinear in pixels", onLine(Os, A, Ap));
  chk(T, "O*, B, B' collinear in pixels", onLine(Os, B, Bp, 2));
  chk(T, "O*, C, C' collinear in pixels", onLine(Os, C, Cp));
  chk(T, "P on the pixel line AB", onLine(A, B, P));
  chk(T, "P on the pixel line A'B'", onLine(Ap, Bp, P, 2));
  chk(T, "Q on the pixel line BC", onLine(B, C, Q));
  chk(T, "Q on the pixel line B'C'", onLine(Bp, Cp, Q, 2));
  chk(T, "R on the pixel line CA", onLine(C, A, R));
  chk(T, "R on the pixel line C'A'", onLine(Cp, Ap, R));
  chk(T, "P, Q, R all on the vertical line x=320", P[0] === 320 && Q[0] === 320 && R[0] === 320);
  chk(T, "ell drawn as the vertical line (320,15)-(320,288)",
    page.indexOf('<line x1="320" y1="15" x2="320" y2="288"') !== -1);
  chk(T, "P,Q,R inside the drawn span of ell", P[1] > 15 && P[1] < 288 && Q[1] > 15 && Q[1] < 288 && R[1] > 15 && R[1] < 288);
  // the drawn dashes lie on the lines they claim to extend
  chk(T, "dash P-B on line AB", onLine(A, B, [320,190]) && onLine(A, B, [500,50]));
  chk(T, "dash P-(360,166) on line A'B'", onLine(Ap, Bp, [320,190], 2) && onLine(Ap, Bp, [360,166], 2));
  chk(T, "dash C-B on line BC", onLine(B, C, [50,120]) && onLine(B, C, [500,50]));
  chk(T, "dash Q-C' on line B'C'", onLine(Bp, Cp, [320,78], 2) && onLine(Bp, Cp, [395,285], 2));
  chk(T, "dash C-A on line CA", onLine(C, A, [50,120]) && onLine(C, A, [410,120]));
  chk(T, "dash R-C' on line C'A'", onLine(Cp, Ap, [320,120]) && onLine(Cp, Ap, [395,285]));
  chk(T, "light dash O*-A on the ray O*A", onLine(Os, A, [280,230]) && onLine(Os, A, [410,120]));
  chk(T, "light dash O*-B on the ray O*B", onLine(Os, B, [280,230]) && onLine(Os, B, [500,50]));
  chk(T, "light dash C-C' on the ray O*C", onLine(Os, C, [50,120]) && onLine(Os, C, [395,285]));
  // every labelled point is drawn as a circle
  var circles = ['cx="280" cy="230"', 'cx="410" cy="120"', 'cx="500" cy="50"', 'cx="50" cy="120"',
    'cx="345" cy="175"', 'cx="353.33" cy="170"', 'cx="395" cy="285"',
    'cx="320" cy="190"', 'cx="320" cy="78"', 'cx="320" cy="120"'];
  var allC = true;
  for (var i = 0; i < circles.length; i++) if (page.indexOf(circles[i]) === -1) allC = false;
  chk(T, "all ten labelled points drawn as circles", allC);
  // the caption pins the three meets in coordinates
  chk(T, "caption: P = (1,0,1)", page.indexOf("P = (1,0,1)") !== -1);
  chk(T, "caption: Q = (1,8/5,1) in TeX", page.indexOf("Q = (1,\\frac{8}{5},1)") !== -1);
  chk(T, "caption: R = (1,1,1)", page.indexOf("R = (1,1,1)") !== -1);
  chk(T, "caption names both planes and the perspective center",
    page.indexOf("in perspective from") !== -1 && page.indexOf("O^* = (0,0,0)") !== -1);
}
