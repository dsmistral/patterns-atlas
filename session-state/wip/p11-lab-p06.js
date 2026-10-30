(function () {
  var a = 1, b = 1;
  var l1 = [a * a, a * b];
  var l2 = [a * a - b * b, a * b - b * b];
  var l3 = [(a + b) * (a - b), b * (a - b)];
  var divisorZero = (a - b === 0);
  var l5 = [a + b, b];
  CHECK("L15 smuggled chain at a=b=1: lines hold, division by zero flagged, 2=1 manufactured", function () {
    if (l1[0] !== l1[1]) return "line 1 fails";
    if (l2[0] !== l2[1]) return "line 2 fails";
    if (l3[0] !== l3[1]) return "line 3 fails";
    if (!divisorZero) return "divisor a-b not zero";
    if (l5[0] === l5[1]) return "final line came out true";
    if (l5[0] !== 2 || l5[1] !== 1) return "final line not 2 vs 1";
    return true;
  });
})();
