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
(function () {
  var S2 = Math.sqrt(2), lows = 0, highs = 0, hits = 0, q, p;
  for (q = 1; q <= 10000; q++) {
    p = Math.round(q * S2);
    if (p * p === 2 * q * q) hits++;
    if ((p - 1) * (p - 1) === 2 * q * q) hits++;
    if ((p + 1) * (p + 1) === 2 * q * q) hits++;
    if (p * p < 2 * q * q) lows++; else highs++;
  }
  CHECK("L01 nearest-p census q<=10^4: zero hits, misses on both sides", function () {
    if (hits !== 0) return hits + " hits";
    if (lows === 0 || highs === 0) return "one-sided misses";
    return true;
  });
  var tries = [[7, 5, -1], [17, 12, 1], [41, 29, -1], [99, 70, 1]];
  CHECK("L02 the four tries 7/5,17/12,41/29,99/70 alternate low/high", function () {
    for (var i = 0; i < tries.length; i++) {
      var t = tries[i], s = t[0] * t[0] - 2 * t[1] * t[1];
      if ((s < 0 ? -1 : 1) !== t[2]) return "try " + t[0] + "/" + t[1] + " wrong side";
    }
    return true;
  });
  CHECK("L03 boundary: 2/1 squares to 4; 3/2 squares to 9/4", function () {
    if (2 * 2 * 1 * 1 !== 4 * 1 * 1) return "2/1 fails";
    if (3 * 3 * 2 * 2 !== 9 * 2 * 2) return "3/2 fails";
    return true;
  });
})();
(function () {
  var PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
  function factorize(n) {
    var fs = [], m = n, p = 2;
    while (p * p <= m && m > 1) {
      while (m % p === 0) { fs.push(p); m = m / p; }
      p = (p === 2) ? 3 : p + 2;
    }
    if (m > 1) fs.push(m);
    return fs;
  }
  var allOK = true, det = "", k, i;
  for (k = 1; k <= 12; k++) {
    var P = 1;
    for (i = 0; i < k; i++) P *= PR[i];
    var N = P + 1;
    var fs = factorize(N);
    var offList = false;
    for (i = 0; i < fs.length; i++) if (fs[i] > PR[k - 1]) offList = true;
    if (!offList) { allOK = false; det += " k=" + k; }
    LAB.notes.push("euclid k=" + k + " N=" + N + " factors=" + fs.join("*"));
  }
  CHECK("L04 Euclid machine k=1..12: every product+1 carries an off-list prime", function () {
    return allOK ? true : "no off-list factor at:" + det;
  });
  CHECK("L05 2311 prime; 30031 = 59*509, both prime, off the first-6 list", function () {
    var f2311 = factorize(2311);
    if (f2311.length !== 1 || f2311[0] !== 2311) return "2311 not prime";
    var f = factorize(30031);
    if (f.length !== 2 || f[0] !== 59 || f[1] !== 509) return "30031 = " + f.join("*");
    if (factorize(59).length !== 1 || factorize(509).length !== 1) return "59 or 509 not prime";
    if (!(59 > 13 && 509 > 13)) return "factor on first-6 list";
    return true;
  });
  var modsOK = true, list6 = [2, 3, 5, 7, 11, 13];
  for (i = 0; i < list6.length; i++) if (30031 % list6[i] !== 1) modsOK = false;
  CHECK("L06 30031 mod {2,3,5,7,11,13} = 1 each (B01: one more than a multiple)", function () {
    return modsOK ? true : "mod fail";
  });
})();
(function () {
  var p2 = 1, i, q3 = 1;
  for (i = 0; i < 19; i++) p2 *= 2;
  for (i = 0; i < 12; i++) q3 *= 3;
  CHECK("L07 near miss 19/12: 2^19=524288, 3^12=531441, gap 7153", function () {
    if (p2 !== 524288) return "2^19 = " + p2;
    if (q3 !== 531441) return "3^12 = " + q3;
    if (q3 - p2 !== 7153) return "gap " + (q3 - p2);
    return true;
  });
  var evOK = true, odOK = true, j;
  for (j = 1; j <= 12; j++) {
    var e = 1, o = 1, t;
    for (t = 0; t < j; t++) { e *= 2; o *= 3; }
    if (e % 2 !== 0) evOK = false;
    if (o % 2 !== 1) odOK = false;
  }
  CHECK("L08 census: 2^p always even, 3^q always odd (p,q <= 12)", function () {
    return (evOK && odOK) ? true : "parity census failed";
  });
  var pairs = {}, a, b, p, q;
  for (a = 2; a <= 30; a++) for (b = 2; b <= 30; b++) {
    if (a === b) continue;
    for (p = 1; p <= 4; p++) for (q = 1; q <= 4; q++) {
      if (Math.pow(a, p) === Math.pow(b, q)) { pairs[a + "," + b] = true; }
    }
  }
  var families = {}, c, k;
  for (c = 2; c <= 30; c++) {
    var fam = [c], v = c;
    for (k = 2; k <= 4; k++) { v = v * c; if (v <= 30) fam.push(v); }
    for (i = 0; i < fam.length; i++) for (j = 0; j < fam.length; j++) {
      if (i !== j) families[fam[i] + "," + fam[j]] = true;
    }
  }
  var same = true, cnt = 0;
  for (var key in pairs) { cnt++; if (!families[key]) same = false; }
  for (var key2 in families) { if (!pairs[key2]) same = false; }
  CHECK("L09 log census a,b<=30: rational pairs = exactly the common-base family pairs (20)", function () {
    if (!same) return "bounded search and families disagree";
    if (cnt !== 20) return "pair count " + cnt;
    return true;
  });
  var gate = [];
  for (b = 3; b <= 30; b++) {
    var rat = false;
    for (p = 1; p <= 4; p++) for (q = 1; q <= 4; q++) if (Math.pow(2, p) === Math.pow(b, q)) rat = true;
    if (rat) gate.push(b);
  }
  CHECK("L10 base-2 gate: log2 b rational only at b=4,8,16; log2 4 = 2; log4 8 = 3/2; log4 2 = 1/2", function () {
    if (gate.join(",") !== "4,8,16") return "gate " + gate.join(",");
    if (Math.pow(2, 2) !== 4) return "log2 4 not 2";
    if (Math.pow(4, 3) !== Math.pow(8, 2)) return "log4 8 not 3/2";
    if (Math.pow(4, 1) !== Math.pow(2, 2)) return "log4 2 not 1/2";
    return true;
  });
})();
(function () {
  // 2^68 by digit-array doubling: no BigInt, no recursion, exact.
  var d = [1], i, j;
  for (i = 0; i < 68; i++) {
    var carry = 0;
    for (j = 0; j < d.length; j++) {
      var v = d[j] * 2 + carry;
      d[j] = v % 10;
      carry = Math.floor(v / 10);
    }
    while (carry > 0) { d.push(carry % 10); carry = Math.floor(carry / 10); }
  }
  var s = "";
  for (j = d.length - 1; j >= 0; j--) s += d[j];
  CHECK("L11 2^68 by digit-array doubling = 295147905179352825856 (an honest number, not an absurdity)", function () {
    return s === "295147905179352825856" ? true : "got " + s;
  });
})();
(function () {
  var seen = [], r = 1, digits = "", pos = 0;
  while (seen[r] === undefined && pos < 500) {
    seen[r] = pos;
    r = r * 10;
    digits += Math.floor(r / 97);
    r = r % 97;
    pos++;
  }
  var period = pos - seen[r];
  CHECK("L12 1/97 has decimal period exactly 96 (long division, no recursion)", function () {
    return period === 96 ? true : "period " + period;
  });
  CHECK("L13 first thirty digits show no repeating block (p <= 15), yet it repeats", function () {
    var d30 = digits.slice(0, 30);
    if (d30 !== "010309278350515463917525773195") return "digits " + d30;
    for (var p = 1; p <= 15; p++) {
      var ok = true;
      for (var i = 0; i + p < 30; i++) if (d30.charAt(i) !== d30.charAt(i + p)) { ok = false; break; }
      if (ok) return "repeating block of length " + p;
    }
    return true;
  });
  CHECK("L14 page prints sqrt2 = 1.41421356 (first eight decimals)", function () {
    return Math.sqrt(2).toString().slice(0, 10) === "1.41421356" ? true : Math.sqrt(2).toString();
  });
})();
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
(function () {
  var sieve = [], i, j, primes = [];
  for (i = 2; i <= 200; i++) sieve[i] = true;
  for (i = 2; i <= 200; i++) {
    if (sieve[i]) {
      primes.push(i);
      for (j = 2 * i; j <= 200; j += i) sieve[j] = false;
    }
  }
  var evens = 0, has7 = false;
  for (i = 0; i < primes.length; i++) {
    if (primes[i] % 2 === 0) evens++;
    if (primes[i] === 7) has7 = true;
  }
  CHECK("L19 primes <= 200: exactly one even (the 2), 7 prime and odd, 46 in all", function () {
    if (evens !== 1 || primes[0] !== 2) return "even count " + evens;
    if (!has7 || 7 % 2 === 0) return "7 not an odd prime";
    if (primes.length !== 46) return "count " + primes.length;
    return true;
  });
})();
(function () {
  var D = 180 / Math.PI;
  var a1 = Math.acos(0.8) * D, a2 = Math.acos(0.6) * D;
  CHECK("L20 the 3-4-5 triangle: angles 36.87, 53.13, 90 sum to 180", function () {
    if (a1.toFixed(2) !== "36.87") return "a1 " + a1.toFixed(2);
    if (a2.toFixed(2) !== "53.13") return "a2 " + a2.toFixed(2);
    if (Math.abs(a1 + a2 + 90 - 180) > 1e-9) return "sum off";
    return true;
  });
  var rng = LCG(97), made = 0, bad = 0;
  while (made < 300) {
    var A = 3 + rng() % 50, B = 3 + rng() % 50, C = 3 + rng() % 50;
    if (A + B <= C || A + C <= B || B + C <= A) continue;
    made++;
    var aa = Math.acos((B * B + C * C - A * A) / (2 * B * C)) * D;
    var bb = Math.acos((A * A + C * C - B * B) / (2 * A * C)) * D;
    var cc = 180 - aa - bb;
    var cnt = 0;
    if (aa >= 89.999) cnt++;
    if (bb >= 89.999) cnt++;
    if (cc >= 89.999) cnt++;
    if (cnt >= 2) bad++;
  }
  CHECK("L21 census of 300 seeded integer triangles: none carries two right angles", function () {
    return bad === 0 ? true : bad + " bad triangles of " + made;
  });
})();
(function () {
  var rng = LCG(31), i, worst = 0;
  for (i = 0; i < 100; i++) {
    var a = 1 + rng() % 999, b = 1 + rng() % 999, c = 1 + rng() % 999, d = 1 + rng() % 999;
    var num = a * d - c * b, den = b * d;
    var lhs = a / b - c / d, rhs = num / den;
    var err = Math.abs(lhs - rhs) / Math.max(1, Math.abs(lhs));
    if (err > worst) worst = err;
  }
  CHECK("L22 rationals closed under subtraction: 100 seeded pairs agree with (ad-bc)/bd", function () {
    return worst < 1e-12 ? true : "worst rel err " + worst;
  });
  var T = Math.sqrt(2) + 1 / 3, bestQ = 0, bestP = 0, bestGap = 1, q;
  for (q = 1; q <= 10000; q++) {
    var p = Math.round(q * T), gap = Math.abs(p / q - T);
    if (gap < bestGap) { bestGap = gap; bestQ = q; bestP = p; }
  }
  CHECK("L23 nearest fraction to sqrt2 + 1/3 (q<=10^4): 16385/9376, gap about 3.26e-8", function () {
    if (bestP !== 16385 || bestQ !== 9376) return "found " + bestP + "/" + bestQ;
    if (!(bestGap > 3.25e-8 && bestGap < 3.27e-8)) return "gap " + bestGap;
    return true;
  });
  CHECK("L24 both 16385/9376 and sqrt2+1/3 print as 1.7475469 at seven decimals", function () {
    if ((16385 / 9376).toFixed(7) !== "1.7475469") return "fraction " + (16385 / 9376).toFixed(7);
    if (T.toFixed(7) !== "1.7475469") return "T " + T.toFixed(7);
    return true;
  });
})();
(function () {
  var mism = 0, n;
  for (n = 1; n <= 400; n++) {
    var sq3 = (n * n) % 3 === 0, n3 = n % 3 === 0;
    if (sq3 !== n3) mism++;
  }
  CHECK("L25 mod-3 lemma census n<=400: 3 divides n^2 exactly when 3 divides n", function () {
    return mism === 0 ? true : mism + " mismatches";
  });
  var hits = 0, q;
  for (q = 1; q <= 10000; q++) {
    var p = Math.round(q * Math.sqrt(3));
    if (p * p === 3 * q * q) hits++;
    if ((p - 1) * (p - 1) === 3 * q * q) hits++;
    if ((p + 1) * (p + 1) === 3 * q * q) hits++;
  }
  CHECK("L26 no p with p^2 = 3q^2 for any q <= 10^4", function () {
    return hits === 0 ? true : hits + " hits";
  });
})();
(function () {
  function isPrime(n) {
    if (n < 2) return false;
    var p = 2;
    while (p * p <= n) { if (n % p === 0) return false; p = (p === 2) ? 3 : p + 2; }
    return true;
  }
  CHECK("L27 17555 = 5*3511; 3511 = 4*877+3 and prime", function () {
    if (5 * 3511 !== 17555) return "5*3511 = " + (5 * 3511);
    if (4 * 877 + 3 !== 3511) return "4*877+3 = " + (4 * 877 + 3);
    if (!isPrime(3511)) return "3511 not prime";
    return true;
  });
  var bad = 0, a, b;
  for (a = 0; a <= 30; a++) for (b = 0; b <= 30; b++) {
    var lhs = (4 * a + 1) * (4 * b + 1);
    if (lhs !== 16 * a * b + 4 * a + 4 * b + 1) bad++;
    if (lhs % 4 !== 1) bad++;
  }
  CHECK("L28 (4a+1)(4b+1) = 16ab+4a+4b+1, always 1 mod 4 (a,b <= 30)", function () {
    return bad === 0 ? true : bad + " violations";
  });
  var Q = [3, 7, 11, 19, 23, 31], expect = [11, 83, 923, 17555, 403787, 12517427];
  var allOK = true, det = "", k, i;
  for (k = 1; k <= 6; k++) {
    var P = 1;
    for (i = 0; i < k; i++) P *= Q[i];
    var N = 4 * P - 1;
    if (N !== expect[k - 1]) { allOK = false; det += " k=" + k + " N=" + N; }
    var fs = [], m = N, p = 2;
    while (p * p <= m && m > 1) {
      while (m % p === 0) { fs.push(p); m = m / p; }
      p = (p === 2) ? 3 : p + 2;
    }
    if (m > 1) fs.push(m);
    var fresh = false;
    for (i = 0; i < fs.length; i++) {
      if (fs[i] % 4 === 3) {
        var onList = false, j;
        for (j = 0; j < k; j++) if (fs[i] === Q[j]) onList = true;
        if (!onList && isPrime(fs[i])) fresh = true;
      }
    }
    if (!fresh) { allOK = false; det += " k=" + k + " no fresh 3-mod-4 prime"; }
    LAB.notes.push("ex3 k=" + k + " N=" + N + " factors=" + fs.join("*"));
  }
  CHECK("L29 six runs (11, 83, 923, 17555, 403787, 12517427): each yields a fresh 3-mod-4 prime", function () {
    return allOK ? true : det;
  });
})();
(function () {
  var s = Math.sqrt(2) + Math.sqrt(3);
  var s2 = s * s;
  CHECK("L30 s^2 = 5 + 2*sqrt6; receipt 9.898979485566 at twelve digits", function () {
    if (s2.toFixed(12) !== "9.898979485566") return "s2 " + s2.toFixed(12);
    if (Math.abs((s2 - 5) / 2 - Math.sqrt(6)) > 1e-14) return "sqrt6 transfer off";
    if (Math.sqrt(6).toFixed(12) !== "2.449489742783") return "sqrt6 " + Math.sqrt(6).toFixed(12);
    return true;
  });
  CHECK("L31 (s^2 - 1)/(2s) = sqrt2; receipt 1.414213562373 at twelve digits", function () {
    var v = (s2 - 1) / (2 * s);
    if (v.toFixed(12) !== "1.414213562373") return "got " + v.toFixed(12);
    if (Math.abs(v - Math.sqrt(2)) > 1e-12) return "off sqrt2";
    return true;
  });
  CHECK("L32 s > 0 for the division; sqrt2 + (2 - sqrt2) = 2 exactly", function () {
    if (!(s > 3.09)) return "s not > 3.09";
    var t = Math.sqrt(2) + (2 - Math.sqrt(2));
    if (t !== 2) return "sum " + t;
    return true;
  });
  var hits = 0, b;
  for (b = 1; b <= 10000; b++) {
    var p = Math.round(b * Math.sqrt(6));
    if (p * p === 6 * b * b) hits++;
    if ((p - 1) * (p - 1) === 6 * b * b) hits++;
    if ((p + 1) * (p + 1) === 6 * b * b) hits++;
  }
  CHECK("L33 a^2 = 6b^2 has no solutions for b <= 10^4 (Student B wall census)", function () {
    return hits === 0 ? true : hits + " hits";
  });
})();
(function () {
  var squares = [], n;
  for (n = 2; n <= 100; n++) {
    var p = Math.round(Math.sqrt(n));
    if (p * p === n) squares.push(n);
  }
  CHECK("L34 exactly nine squares between 2 and 100: 4 through 100", function () {
    if (squares.length !== 9) return "count " + squares.length;
    if (squares[0] !== 4 || squares[8] !== 100) return "ends wrong: " + squares.join(",");
    return true;
  });
  var hits = 0, checks = 0, q, nn;
  for (nn = 2; nn <= 100; nn++) {
    var r = Math.round(Math.sqrt(nn));
    if (r * r === nn) continue;
    for (q = 1; q <= 200; q++) {
      var c = q * Math.sqrt(nn), pr = Math.round(c);
      checks++;
      if (pr * pr === nn * q * q) hits++;
      if ((pr - 1) * (pr - 1) === nn * q * q) hits++;
      if ((pr + 1) * (pr + 1) === nn * q * q) hits++;
    }
  }
  CHECK("L35 non-square detector: 18,000 checks (90 non-squares x q<=200), zero hits", function () {
    if (checks !== 18000) return "checks " + checks;
    return hits === 0 ? true : hits + " hits";
  });
  var cubes = [], m;
  for (m = 1; m <= 200; m++) {
    var c3 = Math.round(Math.pow(m, 1 / 3));
    if (c3 * c3 * c3 === m) cubes.push(m);
  }
  CHECK("L36 perfect cubes up to 200: 1, 8, 27, 64, 125", function () {
    return cubes.join(",") === "1,8,27,64,125" ? true : cubes.join(",");
  });
  var chits = 0, mm;
  for (mm = 1; mm <= 200; mm++) {
    var cm = Math.round(Math.pow(mm, 1 / 3));
    if (cm * cm * cm === mm) continue;
    for (q = 1; q <= 60; q++) {
      var v = q * Math.pow(mm, 1 / 3), pw = Math.round(v);
      if (pw * pw * pw === mm * q * q * q) chits++;
      if ((pw - 1) * (pw - 1) * (pw - 1) === mm * q * q * q) chits++;
      if ((pw + 1) * (pw + 1) * (pw + 1) === mm * q * q * q) chits++;
    }
  }
  CHECK("L37 non-cube detector: no p with p^3 = n*q^3 (n<=200 non-cubes, q<=60), zero hits", function () {
    return chits === 0 ? true : chits + " hits";
  });
})();
(function () {
  var out = "P11 LAB BATTERY OUTPUT\n";
  out += "checks passed: " + LAB.pass + "\n";
  out += "checks failed: " + LAB.fail + "\n";
  var i;
  for (i = 0; i < LAB.notes.length; i++) out += "note: " + LAB.notes[i] + "\n";
  for (i = 0; i < LAB.failures.length; i++) out += "FAIL " + LAB.failures[i] + "\n";
  out += "VERDICT: " + LAB.pass + " PASS / " + LAB.fail + " FAIL\n";
  LAB.OUTPUT = out;
  return out;
})();
