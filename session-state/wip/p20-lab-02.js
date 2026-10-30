// P20 lab piece 02 — S5 formula, Vandermonde (exact integers), two-variable exhaustive
function binom(n, k) { if (k < 0 || k > n) return 0; var r = 1; for (var i = 0; i < k; i++) { r = r * (n - i) / (i + 1); } return r; }
function S5num(n) { return n * n * (n + 1) * (n + 1) * (2 * n * n + 2 * n - 1); }
function S5f(n) { return S5num(n) / 12; }
function sumP5(n) { var s = 0; for (var k = 1; k <= n; k++) { s += k * k * k * k * k; } return s; }
function lab02() {
  var expF = [0, 1, 33, 276, 1300, 4425, 12201];
  for (var n = 0; n <= 6; n++) {
    ck("02 numerator divisible by 12 at n=" + n, S5num(n) % 12 === 0);
    ck("02 F(n) exact at n=" + n, S5f(n) === expF[n]);
  }
  for (var n = 1; n <= 6; n++) { ck("02 increment F(n)-F(n-1)=n^5 at n=" + n, S5f(n) - S5f(n - 1) === n * n * n * n * n); }
  ck("02 F(10) = 220825", S5f(10) === 220825);
  ck("02 direct sum 1..10 = 220825", sumP5(10) === 220825);
  ck("02 F(11) = 381876", S5f(11) === 381876);
  ck("02 direct sum 1..11 = 381876", sumP5(11) === 381876);
  ck("02 needle 12201", cnt(PAGE, "12201") === 1);
  ck("02 needle 7776 twice (two cells, one row)", cnt(PAGE, "7776") === 2);
  ck("02 needle Faulhaber formula prose", cnt(PAGE, "n^2(n+1)^2(2n^2+2n-1)") >= 1);
  var v1 = [4, 10, 20, 35];
  for (var m = 0; m <= 3; m++) {
    ck("02 Vandermonde LHS at m=" + m, binom(m + 4, 3) === v1[m]);
    ck("02 Vandermonde RHS at m=" + m, 4 + 6 * m + 4 * binom(m, 2) + binom(m, 3) === v1[m]);
  }
  ck("02 Vandermonde m=4 both 56", binom(8, 3) === 56 && 4 + 24 + 4 * binom(4, 2) + binom(4, 3) === 56);
  ck("02 Vandermonde m=5 both 84", binom(9, 3) === 84 && 4 + 30 + 4 * binom(5, 2) + binom(5, 3) === 84);
  var lhsP = polyMul(polyMul([4, 1], [3, 1]), [2, 1]);
  ck("02 LHS cubic coefficients [24,26,9,1]", eqArr(lhsP, [24, 26, 9, 1]));
  var t0 = [24, 0, 0, 0]; var t1 = [0, 36, 0, 0]; var t2 = polyMul([0, 12], [-1, 1]); var t3 = polyMul(polyMul([0, 1], [-1, 1]), [-2, 1]);
  var rhs6 = [0, 0, 0, 0];
  var terms = [t0, t1, t2, t3];
  for (var ti = 0; ti < 4; ti++) { for (var j = 0; j < terms[ti].length; j++) { rhs6[j] += terms[ti][j]; } }
  ck("02 6*RHS cubic coefficients [24,26,9,1]", eqArr(rhs6, [24, 26, 9, 1]));
  ck("02 coefficient arrays equal after clearing denominator", eqArr(lhsP, rhs6));
  ck("02 needle vdm sum 4+18+12+1", cnt(PAGE, "4 + 18 + 12 + 1 = 35") === 1);
  ck("02 needle binom{m+4}{3} count 3", cnt(PAGE, "binom{m+4}{3}") === 3);
  for (var m = 0; m <= 8; m++) {
    for (var nn = 0; nn <= 8; nn++) {
      var rhs2 = 0;
      for (var k = 0; k <= 3; k++) { rhs2 += binom(m, k) * binom(nn, 3 - k); }
      ck("02 two-var Vandermonde m=" + m + ",n=" + nn, binom(m + nn, 3) === rhs2);
    }
  }
  ck("02 monomial census C(4+1,1)=5", binom(5, 1) === 5);
  ck("02 monomial census C(2+2,2)=6", binom(4, 2) === 6);
  ck("02 monomial census C(4+2,2)=15", binom(6, 2) === 15);
  ck("02 monomial census C(4+8,8)=495", binom(12, 8) === 495);
  ck("02 monomial census C(6+16,16)=74613", binom(22, 16) === 74613);
  ck("02 needle 74,613", cnt(PAGE, "74{,}613") === 1);
}
