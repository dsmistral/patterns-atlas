// P20 lab piece 04 — Desnanot-Jacobi on 5 fixed matrices, bookkeeping, Schwartz-Zippel
function det3(m) {
  return m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
}
function det4(m) {
  var t = 0;
  for (var j = 0; j < 4; j++) {
    var min = [];
    for (var r = 1; r < 4; r++) { for (var c = 0; c < 4; c++) { if (c !== j) { min.push(m[r * 4 + c]); } } }
    var term = m[j] * det3(min);
    t += ((j % 2 === 0) ? term : -term);
  }
  return t;
}
function minor3(m, sr, sc) {
  var min = [];
  for (var r = 0; r < 4; r++) { if (r === sr) { continue; } for (var c = 0; c < 4; c++) { if (c === sc) { continue; } min.push(m[r * 4 + c]); } }
  return det3(min);
}
function DJ(m) {
  var detM = det4(m);
  var core = m[5] * m[10] - m[6] * m[9];
  var lhs = detM * core;
  var rhs = minor3(m, 0, 0) * minor3(m, 3, 3) - minor3(m, 3, 0) * minor3(m, 0, 3);
  return [detM, core, lhs, rhs];
}
function lab04() {
  var M1 = [2,1,0,1, 1,3,1,0, 0,1,2,1, 1,0,1,3];
  var M2 = [3,-1,2,0, 1,4,-2,3, 2,1,5,-1, 0,2,1,6];
  var M3 = [5,2,1,0, 1,6,3,2, 4,1,7,1, 2,3,1,8];
  var M4 = [1,1,1,1, 1,2,3,4, 1,3,5,7, 1,4,7,10];
  var M5 = [7,1,1,2, 0,5,2,1, 3,0,9,4, 1,2,0,6];
  var r1 = DJ(M1); var r2 = DJ(M2); var r3 = DJ(M3); var r4 = DJ(M4); var r5 = DJ(M5);
  ck("04 M1 det 12", r1[0] === 12); ck("04 M1 core 5", r1[1] === 5);
  ck("04 M1 lhs 60", r1[2] === 60); ck("04 M1 rhs 60", r1[3] === 60);
  ck("04 M2 det 344", r2[0] === 344); ck("04 M2 core 22", r2[1] === 22);
  ck("04 M2 both sides 7568", r2[2] === 7568 && r2[3] === 7568);
  ck("04 M3 det 1330", r3[0] === 1330); ck("04 M3 core 39", r3[1] === 39);
  ck("04 M3 both sides 51870", r3[2] === 51870 && r3[3] === 51870);
  ck("04 M4 det 0", r4[0] === 0); ck("04 M4 core 1", r4[1] === 1);
  ck("04 M4 both sides 0", r4[2] === 0 && r4[3] === 0);
  ck("04 M5 det 1735", r5[0] === 1735); ck("04 M5 core 45", r5[1] === 45);
  ck("04 M5 both sides 78075", r5[2] === 78075 && r5[3] === 78075);
  ck("04 bookkeeping 24*2 + 2*6*6 = 120", 24 * 2 + 2 * 6 * 6 === 120);
  var p3 = 1; for (var i = 0; i < 16; i++) { p3 *= 3; }
  ck("04 grid 3^16 = 43046721", p3 === 43046721);
  ck("04 needle 43,046,721 twice", cnt(PAGE, "43{,}046{,}721") === 2);
  ck("04 needle raw product count line", cnt(PAGE, "24 \\cdot 2 + 2 \\cdot 6 \\cdot 6 = 120") === 1);
  ck("04 needle 3^100 escalation", cnt(PAGE, "3^{100}") === 2);
  ck("04 needle det(M) = 12", cnt(PAGE, "\\det(M) = 12") === 1);
  ck("04 needle inner core 5", cnt(PAGE, "inner core determinant \\(5\\)") === 1);
  var x = 6 / 199;
  ck("04 room size 199", 99 * 2 + 1 === 199);
  ck("04 6/199 approx 0.0302", Math.abs(x - 0.0302) < 1e-4);
  ck("04 needle le 0.0302", cnt(PAGE, "le 0.0302") === 1);
  var x5 = Math.pow(x, 5); var x10 = Math.pow(x, 10);
  ck("04 five points 2.49e-8 (within 0.5%)", Math.abs(x5 - 2.4917e-8) < 2.4917e-8 * 0.005);
  ck("04 five points <= 2.5e-8 bound holds", x5 <= 2.5e-8);
  ck("04 needle le 2.5e-8", cnt(PAGE, "le 2.5 \\times 10^{-8}") === 1);
  ck("04 ten points within 0.2% of 6.2e-16", Math.abs(x10 - 6.2e-16) < 6.2e-16 * 0.002);
  ck("04 ten points NOT <= 6.2e-16 (approx was the honest claim)", x10 > 6.2e-16);
  ck("04 needle approx 6.2e-16", cnt(PAGE, "approx 6.2 \\times 10^{-16}") === 1);
  ck("04 stale 'le 6.2' purged", cnt(PAGE, "le 6.2") === 0);
}
