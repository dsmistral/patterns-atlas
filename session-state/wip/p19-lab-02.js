
// p02 — Example 1: the general Ramsey bound digit table, printed value by printed value
var rows = [ [4, 4, 1, 0.03125, "1/32 = 0.03125", "0.96875"],
             [5, 5, 1, 0.001953125, "1/512 \\approx 0.00195", "0.998"],
             [6, 8, 28, 0.001708984375, "\\approx 0.00171", "0.9982"],
             [7, 11, 330, 0.0003147125244140625, "\\approx 0.000315", "0.9996"],
             [8, 16, 12870, 0.00009588897228240967, "\\approx 0.0000959", "0.9999"],
             [10, 32, 64512240, 0.0000036670962799689732, "\\approx 0.0000037", "0.9999963"],
             [12, 64, 3284214703056, 0.00000008901881789905378, "\\approx 0.000000089", "0.9999999"] ];
for (var ri = 0; ri < rows.length; ri++) {
  var k = rows[ri][0], nExp = rows[ri][1], cnkExp = rows[ri][2], eExp = rows[ri][3], needle = rows[ri][4], floorStr = rows[ri][5];
  var n = Math.floor(Math.pow(2, k / 2)), cnk = Cnk(n, k), e = cnk * Math.pow(2, 1 - k * (k - 1) / 2);
  ck("p02 k=" + k + " n=floor(2^(k/2))", n === nExp, n + " vs " + nExp);
  ck("p02 k=" + k + " C(n,k) exact", cnk === cnkExp, cnk + " vs " + cnkExp);
  ck("p02 k=" + k + " E matches", Math.abs(e - eExp) < 1e-18 * Math.max(1, eExp), e + "");
  ck("p02 k=" + k + " E < 1", e < 1);
  ck("p02 k=" + k + " page needle " + needle, P.indexOf(needle) !== -1);
  ck("p02 k=" + k + " good fraction floor " + floorStr, (1 - eExp) >= parseFloat(floorStr), (1 - eExp) + " >= " + floorStr);
  ck("p02 k=" + k + " floor printed", P.indexOf(floorStr) !== -1);
}
ck("p02 page needle C(32,10) comma", P.indexOf("64,512,240") !== -1);
ck("p02 page needle C(64,12) comma", P.indexOf("3,284,214,703,056") !== -1);
ck("p02 page needle C(16,8) comma", P.indexOf("12,870") !== -1);
// the general bound 2^(k/2+1)/k!
function fact(x) { var r = 1; for (var i = 2; i <= x; i++) r *= i; return r; }
var b4 = Math.pow(2, 2 + 1) / fact(4);
ck("p02 bound k=4 is 1/3", Math.abs(b4 - 1 / 3) < 1e-15, b4 + "");
var allBelow = true, allShrinking = true;
for (var k2 = 4; k2 <= 12; k2++) if (Math.pow(2, k2 / 2 + 1) / fact(k2) >= 1) allBelow = false;
for (var k3 = 4; k3 <= 12; k3++) if (Math.sqrt(2) / (k3 + 1) >= 1) allShrinking = false;
ck("p02 bound 2^(k/2+1)/k! < 1 for k=4..12", allBelow);
ck("p02 ratio sqrt(2)/(k+1) < 1 for k >= 4", allShrinking);
ck("p02 page needle 2^3/24 = 1/3", P.indexOf("\\frac{2^3}{24} = \\frac{1}{3}") !== -1);
// the ordered-tuples bound C(n,k) * k! <= n^k (loose but true)
ck("p02 C(64,12)*12! <= 64^12", Cnk(64, 12) * fact(12) <= Math.pow(64, 12), Cnk(64, 12) * fact(12) + " <= " + Math.pow(64, 12));

// p03 — Section 2: the k=10 party, the room sizes, and the powers of two
var p44 = Math.pow(2, 44);
ck("p03 2^44 = 17,592,186,044,416", p44 === 17592186044416, p44 + "");
ck("p03 page needle 2^44 comma", P.indexOf("17{,}592{,}186{,}044{,}416") !== -1);
var c3210 = Cnk(32, 10);
ck("p03 C(32,10) = 64,512,240", c3210 === 64512240, c3210 + "");
var e32 = c3210 / p44;
ck("p03 E = 0.0000037 (rounded)", Math.abs(e32 - 0.0000037) < 5e-8, e32 + "");
ck("p03 Markov floor 1 - E >= 0.9999963", (1 - e32) >= 0.9999963, (1 - e32) + "");
ck("p03 page needle 1 - 0.0000037", P.indexOf("1 - 0.0000037") !== -1);
ck("p03 page needle 0.0004%", P.indexOf("0.0004\\%") !== -1);
ck("p03 0.00037% rounds up under 0.0004%", (e32 * 100) <= 0.0004, (e32 * 100) + "%");
ck("p03 C(32,2) = 496 (room of K32 seatings)", Cnk(32, 2) === 496);
ck("p03 page needle 2^496", P.indexOf("2^{496}") !== -1);
ck("p03 C(10,2) = 45 and mono prob 2^-44", Cnk(10, 2) === 45 && P.indexOf("2 \\cdot 2^{-45} = 2^{-44}") !== -1);
// 2^435 by decimal-string doubling: digit count and leading digits
var digits = "1";
for (var d = 0; d < 435; d++) {
  var carry = 0, out = ""; var arr = digits.split("");
  for (var ai = arr.length - 1; ai >= 0; ai--) { var v = (arr[ai].charCodeAt(0) - 48) * 2 + carry; out = String.fromCharCode(v % 10 + 48) + out; carry = v >= 10 ? 1 : 0; }
  if (carry) out = "1" + out; digits = out;
}
ck("p03 2^435 has 131 digits", digits.length === 131, "len=" + digits.length);
ck("p03 2^435 starts 8.8e130 (8 leading)", digits.slice(0, 1) === "8" && digits.slice(1, 2) === "8", digits.slice(0, 6));
ck("p03 page needle 131 digits", P.indexOf("131 digits") !== -1);
// atoms^1.6 falls short: 1.6 * 80 = 128 < 435 * log10(2) ~ 130.947
ck("p03 atom^1.6 short of 2^435", 1.6 * 80 < 435 * Math.log(2) / Math.log(10), (435 * Math.log(2) / Math.log(10)) + "");
ck("p03 page needle raised to the power 1.6", P.indexOf("raised to the power \\(1.6\\)") !== -1);
// pairs of 30 people
ck("p03 C(30,2) = 435", Cnk(30, 2) === 435);
ck("p03 R(5,5) range 43-48 printed", P.indexOf("between 43 and 48") !== -1);
ck("p03 R(4,4) = 18 printed", P.indexOf("R(4,4) = 18") !== -1);
