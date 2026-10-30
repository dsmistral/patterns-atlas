(function () {
  // P12 dispatch harness - mirrors the P11 honest-dispatch-history discipline.
  // The lab source is scanned for "eval(" (must be absent: protocol forbids
  // eval; new Function is the sanctioned dispatcher). A completion tail
  // "return LAB.OUTPUT;" is appended because the Function constructor
  // discards a trailing IIFE's completion value. The source is then
  // dispatched repeatedly; every output is compared byte-for-byte with the
  // first dispatch and the full history is recorded, whatever it says.
  var RUNNER = { history: [] };
  RUNNER.dispatch = function (labSrc, count) {
    if (labSrc.indexOf("eval(") !== -1) {
      RUNNER.history.push("ABORT: lab source contains eval(");
      return "ABORT";
    }
    var base = null, diffs = 0, i;
    for (i = 1; i <= count; i++) {
      var out = new Function(labSrc + "\nreturn LAB.OUTPUT;\n")();
      if (typeof out !== "string") {
        RUNNER.history.push("dispatch " + i + ": output is not a string (harness-undefined)");
        return "ABORT";
      }
      if (base === null) {
        base = out;
        RUNNER.history.push("dispatch " + i + ": " + out.length + " chars");
      } else if (out !== base) {
        diffs++;
        RUNNER.history.push("dispatch " + i + ": DIFFERS from dispatch 1");
      } else {
        RUNNER.history.push("dispatch " + i + ": byte-identical to dispatch 1");
      }
    }
    RUNNER.history.push("total dispatches: " + count + ", differing: " + diffs);
    return base;
  };
  RUNNER.report = function () {
    return RUNNER.history.join("\n");
  };
  var g = (typeof globalThis !== "undefined") ? globalThis : this;
  g.P12_RUNNER = RUNNER;
})();
