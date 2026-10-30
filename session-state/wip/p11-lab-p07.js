(function () {
  var list = [2, 3, 5, 7, 11, 13, 59, 509];
  var P = 1, i;
  for (i = 0; i < list.length; i++) P *= list[i];
  CHECK("L16 the 8-prime list multiplies to 901830930; product-plus-one = 901830931", function () {
    if (P !== 901830930) return "product " + P;
    if (P + 1 !== 901830931) return "N " + (P + 1);
    return true;
  });
  var modsOK = true;
  for (i = 0; i < list.length; i++) if (901830931 % list[i] !== 1) modsOK = false;
  CHECK("L17 N mod each listed prime = 1: no listed prime divides it", function () {
    return modsOK ? true : "mod fail";
  });
  var fs = [], m = 901830931, p = 2;
  while (p * p <= m && m > 1) {
    while (m % p === 0) { fs.push(p); m = m / p; }
    p = (p === 2) ? 3 : p + 2;
  }
  if (m > 1) fs.push(m);
  LAB.notes.push("901830931 factors=" + fs.join("*"));
  var allOff = true;
  for (i = 0; i < fs.length; i++) {
    var on = false, j;
    for (j = 0; j < list.length; j++) if (fs[i] === list[j]) on = true;
    if (on) allOff = false;
  }
  CHECK("L18 factorization of 901830931 is entirely off-list", function () {
    return allOff ? true : "on-list factor found";
  });
})();
