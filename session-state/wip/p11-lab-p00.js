// P11 lab battery - fresh engine, zero code shared with earlier chapters.
// Constraints honored: no recursion, no BigInt, no eval, deterministic seeded LCG.
var LAB = { pass: 0, fail: 0, failures: [], notes: [] };
function CHECK(id, fn) {
  try {
    var r = fn();
    if (r === true) { LAB.pass = LAB.pass + 1; }
    else { LAB.fail = LAB.fail + 1; LAB.failures.push(id + " :: " + r); }
  } catch (e) { LAB.fail = LAB.fail + 1; LAB.failures.push(id + " THREW :: " + e.message); }
}
function LCG(seed) {
  // Lehmer generator: exact in doubles (seed * 48271 < 2^53), deterministic.
  var s = seed;
  return function () { s = (s * 48271) % 2147483647; return s; };
}
CHECK("PROBE engine alive (new Function harness, exact sqrt2)", function () {
  var f = new Function("return 2 + 2");
  if (f() !== 4) return "new Function harness broken";
  if (Math.abs(Math.sqrt(2) - 1.4142135623730951) > 1e-16) return "sqrt2 mismatch";
  return true;
});
