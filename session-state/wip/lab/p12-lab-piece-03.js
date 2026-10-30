(function () {
  var tries = [[45, 2], [44, 91], [43, 178], [42, 263], [41, 346], [40, 427]];
  var ok = true, i;
  for (i = 0; i < tries.length; i++) {
    if (2027 - tries[i][0] * tries[i][0] !== tries[i][1]) ok = false;
    var b = Math.round(Math.sqrt(tries[i][1]));
    if (b * b === tries[i][1]) ok = false;
  }
  CHECK("L03 near-miss table: 2027-45^2=2, -44^2=91, -43^2=178, -42^2=263, -41^2=346, -40^2=427, none a square; 427 between 400 and 441", function () {
    if (!ok) return "table arithmetic off";
    if (!(427 > 400 && 427 < 441)) return "427 not between 20^2 and 21^2";
    return true;
  });
  CHECK("L04 2029 = 4*507+1 = 45^2+2^2 = 2025+4 - the first try lands", function () {
    if (4 * 507 + 1 !== 2029 || 2029 % 4 !== 1) return "class claim off";
    if (45 * 45 + 2 * 2 !== 2029) return "45^2+2^2 != 2029";
    if (2025 + 4 !== 2029) return "receipt off";
    return true;
  });
  var hits = 0, residues = [], aa;
  for (aa = 0; aa <= 4; aa++) {
    var t = 21 - aa * aa;
    residues.push(t);
    var bb = Math.round(Math.sqrt(t));
    if (bb * bb === t) hits++;
  }
  LAB.notes.push("21 scan residues=" + residues.join(",") + " hits=" + hits);
  CHECK("L05 21 = 4*5+1 refuses: residues 21, 20, 17, 12 (a=0..3) none square; a=5 overshoots", function () {
    if (4 * 5 + 1 !== 21 || 21 % 4 !== 1) return "class claim off";
    if (residues.join(",") !== "21,20,17,12,5") return "residues " + residues.join(",");
    if (hits !== 0) return hits + " hits";
    if (!(5 * 5 > 21)) return "overshoot claim off";
    return true;
  });
  CHECK("L06 2031 = 4*507+3, 2035 = 4*508+3, 2039 = 4*509+3 - three more sealed years, zero searches", function () {
    if (4 * 507 + 3 !== 2031 || 4 * 508 + 3 !== 2035 || 4 * 509 + 3 !== 2039) return "year arithmetic off";
    if (2031 % 4 !== 3 || 2035 % 4 !== 3 || 2039 % 4 !== 3) return "class claim off";
    return true;
  });
})();
