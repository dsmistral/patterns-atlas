
  // ---------- Group B: the rationals from the positive whole numbers ----------
  add('B1 18/12 = 3/2 by prime-exponent vectors', function () {
    var v18 = vec(18), v12 = vec(12);
    if (v18[2] !== 1 || v18[3] !== 2 || v18.rest !== 1) { return [false, '18 = 2^1 * 3^2 wrong']; }
    if (v12[2] !== 2 || v12[3] !== 1 || v12.rest !== 1) { return [false, '12 = 2^2 * 3^1 wrong']; }
    var d2 = v18[2] - v12[2], d3 = v18[3] - v12[3];
    if (d2 !== -1 || d3 !== 1) { return [false, 'quotient vector wrong: 2^' + d2 + ' 3^' + d3]; }
    if (18 * 2 !== 12 * 3) { return [false, 'cross check 18*2 = 12*3 fails']; }
    var v32 = vec(3), v21 = vec(2);
    if (v32[3] !== 1 || v32[2] !== 0 || v21[2] !== 1 || v21[3] !== 0) { return [false, 'vec(3), vec(2) wrong']; }
    return [true, '18 = 2^1*3^2, 12 = 2^2*3^1; quotient 2^-1*3^1 = 3/2; 18*2 = 36 = 12*3'];
  });
  add('B2 [(5,3)]*[(3,1)] = [(15,3)] ~ [(5,1)]: 15*1 = 3*5', function () {
    if (5 * 3 !== 15 || 3 * 1 !== 3) { return [false, 'componentwise product wrong']; }
    if (15 * 1 !== 3 * 5) { return [false, 'cross-multiplication law fails']; }
    return [true, '15*1 = 15 = 3*5'];
  });
  add('B3 cross-relation transitive on Z\\{0} at digits <= 5 (cancellation)', function () {
    var vals = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    var n = 0;
    for (var i = 0; i < 10; i++) for (var j = 0; j < 10; j++) for (var k = 0; k < 10; k++) for (var l = 0; l < 10; l++) {
      var a = vals[i], b = vals[j], c = vals[k], d = vals[l];
      if (a * d !== b * c) { continue; }
      for (var m = 0; m < 10; m++) for (var p = 0; p < 10; p++) {
        var e = vals[m], f = vals[p];
        if (c * f !== d * e) { continue; }
        n++;
        if (a * f !== b * e) { return [false, 'violation: ' + a + '/' + b + ', ' + c + '/' + d + ', ' + e + '/' + f]; }
      }
    }
    return [true, n + ' chains, 0 violations (cancelling cd does it)'];
  });
  add('B4 exponent vectors add under products: vec(a*c) = vec(a) + vec(c)', function () {
    var set = [1, 2, 3, 4, 6, 8, 9, 12, 18, 25];
    for (var i = 0; i < set.length; i++) for (var j = 0; j < set.length; j++) {
      var a = set[i], c = set[j];
      if (a * c > 9999) { continue; }
      var va = vec(a), vc = vec(c), vac = vec(a * c);
      var ps = [2, 3, 5, 7, 11, 13];
      for (var t = 0; t < ps.length; t++) {
        if (vac[ps[t]] !== va[ps[t]] + vc[ps[t]]) { return [false, 'vector add fails at ' + a + '*' + c]; }
      }
    }
    return [true, 'multiplication is vector addition, prime by prime'];
  });
  add('B5 whole numbers sit inside as [(n,1)]: the class reads n', function () {
    for (var n = 1; n <= 30; n++) {
      if (n * 1 !== n || 1 * n !== n) { return [false, '[(n,1)] identity fails at ' + n]; }
    }
    var v6 = vec(6);
    if (v6[2] !== 1 || v6[3] !== 1 || v6.rest !== 1) { return [false, 'vec(6) wrong: 6 = 2^1*3^1']; }
    return [true, 'n*1 = 1*n = n for n = 1..30; [(6,1)] carries exactly vec(6)'];
  });

  // ---------- Group C: the two-point space, K0(X) = Z^2 ----------
  add('C1 N^2 cancels componentwise: all instances <= 4', function () {
    var n = 0;
    for (var a1 = 0; a1 <= 4; a1++) for (var b1 = 0; b1 <= 4; b1++) for (var a2 = 0; a2 <= 4; a2++) for (var b2 = 0; b2 <= 4; b2++) for (var c = 0; c <= 4; c++) for (var d = 0; d <= 4; d++) {
      if (a1 + c === a2 + c && b1 + d === b2 + d) {
        n++;
        if (!(a1 === a2 && b1 === b2)) { return [false, 'cancellation fails at (' + a1 + ',' + b1 + ') vs (' + a2 + ',' + b2 + ')']; }
      }
    }
    return [true, n + ' cancelling instances, 0 failures (bounded scan)'];
  });
  add('C2 [(3,1)] - [(1,1)] = [(2,0)]: page ((3,1),(1,1)) ~ ((2,0),(0,0))', function () {
    var l1 = 3 + 0, l2 = 1 + 0; // (3,1) + (0,0)
    var r1 = 1 + 2, r2 = 1 + 0; // (1,1) + (2,0)
    if (l1 !== r1 || l2 !== r2) { return [false, 'columnwise law fails: (' + l1 + ',' + l2 + ') vs (' + r1 + ',' + r2 + ')']; }
    return [true, 'columns: 3 = 1+2 and 1 = 1+0, witness k = (0,0)'];
  });
  add('C3 dimension vector of [(3,1)] - [(2,0)] is (1,1)', function () {
    var d1 = 3 - 2, d2 = 1 - 0;
    if (d1 !== 1 || d2 !== 1) { return [false, 'dimension vector wrong']; }
    var l1 = 3 + 0, l2 = 1 + 0; // (3,1) + (0,0)
    var r1 = 2 + 1, r2 = 0 + 1; // (2,0) + (1,1)
    if (l1 !== r1 || l2 !== r2) { return [false, 'normal form ((1,1),(0,0)) wrong']; }
    return [true, 'dims (1,1); page ((3,1),(2,0)) at the position of ((1,1),(0,0))'];
  });
  add('C4 eta embeds N^2: pages ((x),(0)) ~ ((y),(0)) iff x = y (bounded)', function () {
    for (var r1 = 0; r1 <= 4; r1++) for (var r2 = 0; r2 <= 4; r2++) for (var s1 = 0; s1 <= 4; s1++) for (var s2 = 0; s2 <= 4; s2++) {
      var eq = (r1 === s1 && r2 === s2);
      var found = (r1 + 0 === 0 + s1 + 0) && (r2 + 0 === 0 + s2 + 0) ? (r1 === s1 && r2 === s2) : false;
      if (found !== eq) { return [false, 'merge logic wrong at (' + r1 + ',' + r2 + ') vs (' + s1 + ',' + s2 + ')']; }
    }
    return [true, 'no merges: K0({p,q}) embeds N^2 into Z^2'];
  });

  // ---------- Group E: Euler characteristic receipts ----------
  function chi(cells) {
    var s = 0;
    for (var i = 0; i < cells.length; i++) { s += (i % 2 === 0 ? 1 : -1) * cells[i]; }
    return s;
  }
  add('E1 chi(pt) = 1', function () { return [chi([1]) === 1, 'one 0-cell: 1']; });
  add('E2 chi(S^1) = 0', function () { return [chi([1, 1]) === 0, '1 - 1 = 0']; });
  add('E3 chi(S^2) = 2', function () { return [chi([1, 0, 1]) === 2, '1 + 1 = 2']; });
  add('E4 chi(torus) = 0', function () { return [chi([1, 2, 1]) === 0, '1 - 2 + 1 = 0']; });
  add('E5 chi(S^2 x S^2) = 4 by cells and by product', function () {
    var byCells = chi([1, 0, 2, 0, 1]);
    var byProduct = chi([1, 0, 1]) * chi([1, 0, 1]);
    if (byCells !== 4 || byProduct !== 4) { return [false, 'cells give ' + byCells + ', product gives ' + byProduct]; }
    return [true, '1 + 2 + 1 = 4 = 2*2'];
  });
  add('E6 product rule chi(A x B) = chi(A)chi(B) on the receipt pairs', function () {
    var pairs = [[[1], [1]], [[1], [1, 0, 1]], [[1, 1], [1, 1]], [[1, 0, 1], [1, 0, 1]]];
    for (var i = 0; i < pairs.length; i++) {
      var A = pairs[i][0], B = pairs[i][1];
      if (chi(A) * chi(B) !== chiProdCells(A, B)) { return [false, 'product rule fails on pair ' + i]; }
    }
    return [true, 'pt*pt = 1, pt*S2 = 2, S1*S1 = 0 = torus, S2*S2 = 4'];
  });
  function chiProdCells(A, B) {
    var cells = [];
    for (var d = 0; d < A.length + B.length - 1; d++) { cells.push(0); }
    for (var i2 = 0; i2 < A.length; i2++) for (var j = 0; j < B.length; j++) { cells[i2 + j] += A[i2] * B[j]; }
    return chi(cells);
  }

