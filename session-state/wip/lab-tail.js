// --- battery runner ---
function runBattery(PAGE) {
  P0(PAGE); P1(PAGE); P2(PAGE); P3(PAGE); P4(PAGE); P5(PAGE);
  var total = CHECKS.length, fails = 0, byTag = {};
  CHECKS.forEach(function(ch){ if (!ch.pass) fails++; if (!byTag[ch.tag]) byTag[ch.tag] = [0,0]; byTag[ch.tag][0]++; if (!ch.pass) byTag[ch.tag][1]++; });
  var lines = ['B16/P16 LAB — checks: ' + (total - fails) + '/' + total + ', ' + fails + ' FAIL'];
  var order = ['p0','p1','p2','p3','p4','p5'];
  order.forEach(function(t){ if (byTag[t]) lines.push('  ' + t + ': ' + (byTag[t][0] - byTag[t][1]) + '/' + byTag[t][0]); });
  var out = lines.join('\n');
  if (typeof __P16_STANDALONE__ !== 'undefined' && __P16_STANDALONE__ && typeof __PAGE__ !== 'undefined') {
    print(out);
  }
  return out;
}
