(function () {
  var f = 1, i;
  for (i = 2; i <= 16; i++) f *= i;
  LAB.notes.push("16! = " + f);
  CHECK("L18 16! = 20922789888000; at a million arrangements per second, roughly eight months", function () {
    if (f !== 20922789888000) return "16! = " + f;
    var months = f / 1e6 / 86400 / 30.44;
    if (!(months > 7.5 && months < 8.5)) return "months " + months.toFixed(2);
    LAB.notes.push("16!/1e6 seconds = " + (f / 1e6) + " = " + months.toFixed(2) + " months");
    return true;
  });
})();
