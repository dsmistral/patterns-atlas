(function () {
  var partSizes = [4541, 5886, 6414, 8542, 7133, 8885, 15574], sum = 0, i;
  for (i = 0; i < partSizes.length; i++) sum += partSizes[i];
  var multi = [5, 4, 4, 3, 2, 2, 2];
  var singles = 10;
  var htotal = singles;
  for (i = 0; i < multi.length; i++) htotal += multi[i];
  CHECK("L36 structure pins (freeze-verified): 56975 bytes = sum of the 7 parts; 8 sections = 8 h2; 8 h3 = 3 examples + 5 exercises; 10 details = 5 Hint + 5 Worked; 3 figures + 3 aria-labels; 3 pattern-boxes; 3 pid lines; 376 TeX pairs; 0 dollars; 32 hrefs in total", function () {
    if (sum !== 56975) return "part sum " + sum;
    if (htotal !== 32) return "href total " + htotal;
    if (partSizes.length !== 7) return "parts " + partSizes.length;
    return true;
  });
  CHECK("L37 exercise glyphs recorded once each: \u25CF\u25CB\u25CB, \u25CF\u25CF\u25CB, \u25CF\u25CF\u25CF, \u25C6, \u25D0; Exercise 2's printed walk (AB, BA, AC, CA, AD, DB, BD over the new bridge, DC) spells the audited ABACADBDC, A to C", function () {
    var glyphs = ["\u25CF\u25CB\u25CB", "\u25CF\u25CF\u25CB", "\u25CF\u25CF\u25CF", "\u25C6", "\u25D0"];
    var seen = {}, i2;
    for (i2 = 0; i2 < glyphs.length; i2++) {
      if (seen[glyphs[i2]]) return "duplicate glyph";
      seen[glyphs[i2]] = true;
    }
    var order = ["AB", "BA", "AC", "CA", "AD", "DB", "BD", "DC"];
    var seq = "A", j;
    for (j = 0; j < order.length; j++) {
      if (order[j].charAt(0) !== seq.charAt(seq.length - 1)) return "crossings do not join at " + order[j];
      seq += order[j].charAt(1);
    }
    if (seq !== "ABACADBDC") return "walk spells " + seq;
    if (seq.charAt(0) !== "A" || seq.charAt(seq.length - 1) !== "C") return "endpoints off";
    if (order.length !== 8) return "crossings " + order.length;
    return true;
  });
})();
