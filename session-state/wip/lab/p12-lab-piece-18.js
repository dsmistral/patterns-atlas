(function () {
  var out = "P12 LAB BATTERY OUTPUT\n";
  out += "checks passed: " + LAB.pass + "\n";
  out += "checks failed: " + LAB.fail + "\n";
  var i;
  for (i = 0; i < LAB.notes.length; i++) out += "note: " + LAB.notes[i] + "\n";
  for (i = 0; i < LAB.failures.length; i++) out += "FAIL " + LAB.failures[i] + "\n";
  out += "VERDICT: " + LAB.pass + " PASS / " + LAB.fail + " FAIL\n";
  LAB.OUTPUT = out;
  return out;
})();
