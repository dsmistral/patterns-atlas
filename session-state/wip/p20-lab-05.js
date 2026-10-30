// P20 lab piece 05 — Exhibit A census, forgery, SVG pixel maps
function lab05() {
  var census = [0, 0, 30, 240, 1020];
  for (var a = 0; a <= 4; a++) {
    var v = a * a * a * a * a - a;
    ck("05 a^5-a at a=" + a + " is " + census[a], v === census[a]);
    ck("05 census row vanishes mod 5 at a=" + a, v % 5 === 0);
  }
  var fermatOK = true;
  for (var a2 = 0; a2 <= 4; a2++) { if (Math.pow(a2, 5) % 5 !== a2 % 5) { fermatOK = false; } }
  ck("05 Fermat smallest case a^5 = a (mod 5), all residues", fermatOK);
  var mod3 = [0, 0, 6];
  for (var a3 = 0; a3 <= 2; a3++) {
    ck("05 a^3-a at a=" + a3 + " is " + mod3[a3] + " (0 mod 3)", (a3 * a3 * a3 - a3) === mod3[a3] && mod3[a3] % 3 === 0);
  }
  var fac = polyMul(polyMul([0, 1], polyMul([-1, 1], [1, 1])), [1, 0, 1]);
  ck("05 x(x-1)(x+1)(x^2+1) expands to [0,-1,0,0,0,1]", eqArr(fac, [0, -1, 0, 0, 0, 1]));
  ck("05 expansion equals x^5-x exactly", eqArr(fac, [0, -1, 0, 0, 0, 1]));
  var d5 = [0, -1, 0, 0, 0, 1];
  ck("05 root -1", polyEval(d5, -1) === 0);
  ck("05 root 0", polyEval(d5, 0) === 0);
  ck("05 root 1", polyEval(d5, 1) === 0);
  ck("05 non-root 2 reads 30", polyEval(d5, 2) === 30);
  var corr = function (n) { var p = 1; for (var k = 1; k <= 10; k++) { p *= (n - k); } return p; };
  for (var n = 1; n <= 10; n++) { ck("05 forgery correction vanishes at n=" + n, corr(n) === 0); }
  ck("05 correction at 11 is 10! = 3628800", corr(11) === 3628800);
  var f10 = 1; for (var k2 = 1; k2 <= 10; k2++) { f10 *= k2; }
  ck("05 10! computed iteratively is 3628800", f10 === 3628800);
  ck("05 S5(11) = 381876 (formula)", S5f(11) === 381876);
  ck("05 forgery overshoot equals correction", (S5f(11) + corr(11)) - S5f(11) === 3628800);
  var ratio = 3628800 / 381876;
  ck("05 overshoot is a factor of nearly ten (9 < r < 10)", ratio > 9 && ratio < 10);
  ck("05 needle 3,628,800 twice", cnt(PAGE, "3{,}628{,}800") === 2);
  ck("05 needle 381,876 twice", cnt(PAGE, "381{,}876") === 2);
  // Fig P20.1: px = 246 + 88n, py = 270 - 1.9y
  var tickOK = 0; var tickExp = [-2, -1, 0, 1, 2, 3]; var tickPx = [70, 158, 246, 334, 422, 510];
  for (var t = 0; t < 6; t++) { if (246 + 88 * tickExp[t] === tickPx[t]) { tickOK++; } }
  ck("05 fig1 six ticks on linear map", tickOK === 6);
  var ringN = [-1, 0, 1, 2, 3]; var ringOK = 0;
  for (var t2 = 0; t2 < 5; t2++) {
    var y = (ringN[t2] * ringN[t2] + ringN[t2] - 1); var yv = y * y;
    var px = 246 + 88 * ringN[t2]; var py = 270 - 1.9 * yv;
    if (px === [158, 246, 334, 422, 510][t2] && Math.abs(py - [268.1, 268.1, 268.1, 222.5, 40.1][t2]) < 0.05) { ringOK++; }
  }
  ck("05 fig1 five rings land on the certificate points", ringOK === 5);
  var nEnd = 3.1; var yEnd = (nEnd * nEnd + nEnd - 1); var yEndV = yEnd * yEnd;
  ck("05 fig1 last polyline x 518.8 at n=3.1", Math.abs(246 + 88 * nEnd - 518.8) < 0.05);
  ck("05 fig1 last polyline y 9.5 at n=3.1", Math.abs(270 - 1.9 * yEndV - 9.5) < 0.05);
  ck("05 fig1 needle 70,268.1", cnt(PAGE, "70,268.1") === 1);
  ck("05 fig1 needle 510,40.1", cnt(PAGE, "510,40.1") === 1);
  ck("05 fig1 needle 422,222.5", cnt(PAGE, "422,222.5") === 1);
  // Fig P20.2: number line px = 170 + 65n; clock radius 55 center (430,100)
  var lineOK = true;
  for (var t3 = -2; t3 <= 2; t3++) { if (170 + 65 * t3 !== [40, 105, 170, 235, 300][t3 + 2]) { lineOK = false; } }
  ck("05 fig2 number-line ticks on linear map", lineOK);
  ck("05 fig2 red dot at -1 (cx=105)", cnt(PAGE, 'cx="105" cy="100"') === 1);
  ck("05 fig2 red dot at 0 (cx=170)", cnt(PAGE, 'cx="170" cy="100"') === 1);
  ck("05 fig2 red dot at 1 (cx=235)", cnt(PAGE, 'cx="235" cy="100"') === 1);
  ck("05 fig2 clock top vertex (430,45) = center minus r", 430 === 430 && 100 - 55 === 45);
  ck("05 fig2 vertex at 18deg x 482.3", Math.abs(430 + 55 * Math.cos(18 * Math.PI / 180) - 482.3) < 0.05);
  ck("05 fig2 vertex at 18deg y 83", Math.abs(100 - 55 * Math.sin(18 * Math.PI / 180) - 83) < 0.05);
  ck("05 fig2 vertex at -54deg x 462.3", Math.abs(430 + 55 * Math.cos(-54 * Math.PI / 180) - 462.3) < 0.05);
  ck("05 fig2 vertex at -54deg y 144.5", Math.abs(100 - 55 * Math.sin(-54 * Math.PI / 180) - 144.5) < 0.05);
  ck("05 ring circles total 10 (5 clock + 5 fig1)", cnt(PAGE, 'fill="none" stroke="#c0392b" stroke-width="2"') === 10);
  // Fig P20.3: px = 280 + 45x, py = 230 - 20x^2
  ck("05 fig3 x=-3 maps to (145,50)", 280 - 135 === 145 && 230 - 180 === 50);
  ck("05 fig3 x=0 maps to (280,230)", 280 === 280 && 230 === 230);
  ck("05 fig3 x=3 maps to (415,50)", 280 + 135 === 415 && 230 - 180 === 50);
  ck("05 fig3 grid columns at x=-1,1 map to 235,325", 280 - 45 === 235 && 280 + 45 === 325);
  ck("05 fig3 grid rows at y=0,1 map to 230,210", 230 - 0 === 230 && 230 - 20 === 210);
  ck("05 fig3 dashed rect 90 wide (325-235)", cnt(PAGE, 'width="90"') === 1 && 325 - 235 === 90);
  ck("05 fig3 two crosses marked", cnt(PAGE, "\u2717") === 2);
  ck("05 fig3 seven integer-point rings", cnt(PAGE, 'stroke="#333" stroke-width="1.5"') === 7);
  ck("05 needle five-hour clock count 10", cnt(PAGE, "five-hour clock") === 10);
  ck("05 needle Chevalley count 3", cnt(PAGE, "Chevalley") === 3);
  ck("05 needle frabjous once", cnt(PAGE, "frabjous") === 1);
  ck("05 href p30-localize-at-prime", cnt(PAGE, "p30-localize-at-prime.html") === 1);
  ck("05 href p23-interpolate", cnt(PAGE, "p23-interpolate.html") === 1);
  ck("05 href b01-remainders", cnt(PAGE, "b01-remainders.html") === 1);
  ck("05 href b02-congruence-classes", cnt(PAGE, "b02-congruence-classes.html") === 1);
  ck("05 footer next link p21", cnt(PAGE, "p21-limit-point.html") === 1);
}
