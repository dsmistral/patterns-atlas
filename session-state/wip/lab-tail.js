function runBattery(PAGE) {
  counts = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
  failCounts = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
  failures = [];
  p0(PAGE); p1(PAGE); p2(PAGE); p3(PAGE); p3x(PAGE); p4(PAGE); p5(PAGE); p5x(PAGE);
  var total = counts.p0 + counts.p1 + counts.p2 + counts.p3 + counts.p4 + counts.p5;
  return {
    total: total,
    fail: failures.length,
    counts: { p0: counts.p0, p1: counts.p1, p2: counts.p2, p3: counts.p3, p4: counts.p4, p5: counts.p5 },
    failCounts: { p0: failCounts.p0, p1: failCounts.p1, p2: failCounts.p2, p3: failCounts.p3, p4: failCounts.p4, p5: failCounts.p5 },
    failures: failures.slice()
  };
}
function printVerdict(v) {
  var lines = [];
  lines.push('B08 LAB — checks: ' + (v.total - v.fail) + '/' + v.total + ', ' + v.fail + ' FAIL');
  lines.push('  p0: ' + (v.counts.p0 - v.failCounts.p0) + '/' + v.counts.p0 + '  p1: ' + (v.counts.p1 - v.failCounts.p1) + '/' + v.counts.p1 + '  p2: ' + (v.counts.p2 - v.failCounts.p2) + '/' + v.counts.p2 + '  p3: ' + (v.counts.p3 - v.failCounts.p3) + '/' + v.counts.p3 + '  p4: ' + (v.counts.p4 - v.failCounts.p4) + '/' + v.counts.p4 + '  p5: ' + (v.counts.p5 - v.failCounts.p5) + '/' + v.counts.p5);
  v.failures.forEach(function (f) { lines.push('  FAIL ' + f); });
  var text = lines.join('\n') + '\n';
  if (typeof console !== 'undefined' && console.log) console.log(text);
  return text;
}
if (typeof __B08_STANDALONE__ !== 'undefined' && typeof __PAGE__ !== 'undefined') { printVerdict(runBattery(__PAGE__)); }
