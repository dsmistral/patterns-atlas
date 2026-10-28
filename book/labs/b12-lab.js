// B12 lab — The Brahmagupta–Fibonacci identity (b12-brahmagupta-fibonacci.html)
// Session S09, 2026-10-28. The Patterns Atlas, bridge page B12 (group D).
// Battery record: the code that produced b12-lab-output.txt, pieces 0–5 plus the
// adversarial verifier (fresh engine, zero shared code with the drafting pieces).
// Constraints honored: no recursion, no BigInt in the value path, deterministic,
// pieces <= 4 KB, pre-flight probe first. Honest run history in the output header.

// ---------- piece 0 — pre-flight probe ----------
function piece0() {
  const a = 1, b = 4, c = 2, d = 3;
  const lhs = (a*a + b*b) * (c*c + d*d);
  const r1 = (a*c - b*d)**2 + (a*d + b*c)**2;
  return 'probe: 17*13=' + lhs + ' route1=' + r1 + ' ' + (lhs === r1 ? 'PASS' : 'FAIL');
}

// ---------- piece 1 — the identity, exhaustive, both routes ----------
function piece1() {
  let n = 0, bad1 = 0, bad2 = 0;
  for (let a = 0; a <= 12; a++) for (let b = 0; b <= 12; b++) for (let c = 0; c <= 12; c++) for (let d = 0; d <= 12; d++) {
    const lhs = (a*a + b*b) * (c*c + d*d);
    n++;
    if (lhs !== (a*c - b*d)**2 + (a*d + b*c)**2) bad1++;
    if (lhs !== (a*c + b*d)**2 + (a*d - b*c)**2) bad2++;
  }
  let nn = 0, nb1 = 0, nb2 = 0;
  for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) for (let c = -6; c <= 6; c++) for (let d = -6; d <= 6; d++) {
    const lhs = (a*a + b*b) * (c*c + d*d);
    nn++;
    if (lhs !== (a*c - b*d)**2 + (a*d + b*c)**2) nb1++;
    if (lhs !== (a*c + b*d)**2 + (a*d - b*c)**2) nb2++;
  }
  return 'piece1: nonneg cases=' + n + ' route1_mismatch=' + bad1 + ' route2_mismatch=' + bad2 +
    ' | neg sweep cases=' + nn + ' route1_mismatch=' + nb1 + ' route2_mismatch=' + nb2 +
    ' VERDICT ' + ((bad1 + bad2 + nb1 + nb2) === 0 ? 'PASS' : 'FAIL');
}

// ---------- piece 2 — Lecture 0 + worked numbers + representation censuses ----------
function piece2() {
  const r1 = (a, b, c, d) => [a*c - b*d, a*d + b*c], r2 = (a, b, c, d) => [a*c + b*d, a*d - b*c];
  const nsq = p => p[0]*p[0] + p[1]*p[1];
  const reps = (m, hi) => { const o = []; for (let x = 0; x <= hi; x++) for (let y = x; y <= hi; y++) if (x*x + y*y === m) o.push('(' + x + ',' + y + ')'); return o; };
  const L = [];
  L.push('lecture0: 17*13=' + (17*13) + ' | 5^2+14^2=' + (25+196) + ' 10^2+11^2=' + (100+121));
  L.push('routes(1,4)x(2,3): r1=(' + r1(1,4,2,3) + ') norm=' + nsq(r1(1,4,2,3)) + ' r2=(' + r2(1,4,2,3) + ') norm=' + nsq(r2(1,4,2,3)));
  L.push('65: r1=(' + r1(1,2,2,3) + ') norm=' + nsq(r1(1,2,2,3)) + ' r2=(' + r2(1,2,2,3) + ') norm=' + nsq(r2(1,2,2,3)));
  L.push('4225: r1=(' + r1(3,4,5,12) + ') norm=' + nsq(r1(3,4,5,12)) + ' r2=(' + r2(3,4,5,12) + ') norm=' + nsq(r2(3,4,5,12)));
  L.push('reps221(0..15)=' + reps(221,15).join(','));
  L.push('reps65(0..8)=' + reps(65,8).join(','));
  L.push('reps4225(0..65)=' + reps(4225,65).join(','));
  L.push('reps325(0..18)=' + reps(325,18).join(','));
  L.push('reps1105(0..33)=' + reps(1105,33).join(','));
  L.push('reps50(0..7)=' + reps(50,7).join(','));
  L.push('triplecheck: 16^2+63^2=' + (256+3969) + ' 33^2+56^2=' + (1089+3136) + ' 25^2+60^2=' + (625+3600) + ' 39^2+52^2=' + (1521+2704));
  return L.join('\n');
}

// ---------- piece 3 — mod-4 census, three-squares non-example, prime census ----------
function piece3() {
  const L = [];
  const sq4 = []; for (let r = 0; r < 4; r++) { const v = (r*r) % 4; if (!sq4.includes(v)) sq4.push(v); }
  const sum4 = []; for (const x of sq4) for (const y of sq4) { const v = (x+y) % 4; if (!sum4.includes(v)) sum4.push(v); }
  L.push('mod4: squares=' + JSON.stringify(sq4) + ' sums=' + JSON.stringify(sum4) + ' has3=' + sum4.includes(3));
  L.push('2027=4*506+3 remainder ' + (2027 - 4*506) + ' | 221 mod 4 = ' + ((17*13) % 4));
  const tset = []; for (let a = 0; a <= 3; a++) for (let b = 0; b <= 3; b++) for (let c = 0; c <= 3; c++) { const v = a*a + b*b + c*c; if (!tset.includes(v)) tset.push(v); }
  L.push('threeSquaresPossible(0..27)=' + JSON.stringify(tset.sort((x,y) => x-y)));
  L.push('15 in set: ' + tset.includes(15) + ' | 3=1+1+1: ' + (1+1+1 === 3) + ' | 5=4+1+0: ' + (4+1+0 === 5));
  const primes = []; for (let p = 2; p < 100; p++) { let isp = true; for (let q = 2; q < p; q++) { if (p % q === 0) isp = false; } if (isp) primes.push(p); }
  const yes = [], no = [];
  for (const p of primes) { let found = null; for (let x = 0; x <= 10 && found === null; x++) for (let y = 0; y <= 10; y++) { if (x*x + y*y === p) found = '(' + x + ',' + y + ')'; }
    if (found) yes.push(p + found + '[p%4=' + (p % 4) + ']'); else no.push(p + '[p%4=' + (p % 4) + ']'); }
  L.push('primes<100 count=' + primes.length);
  L.push('sumOfTwoSquares=' + yes.join(' '));
  L.push('NOT=' + no.join(' '));
  const allOK = yes.every(s => s.includes('[p%4=1]') || s.startsWith('2(1,1)')) && no.every(s => s.includes('[p%4=3]'));
  return L.join('\n') + '\nVERDICT ' + (allOK ? 'PASS' : 'FAIL');
}

// ---------- piece 4 (run 3) — exercises, Brahmagupta N-form, Pell debt ----------
function piece4() {
  const r1 = (a, b, c, d) => [a*c - b*d, a*d + b*c], r2 = (a, b, c, d) => [a*c + b*d, a*d - b*c];
  const nsq = p => p[0]*p[0] + p[1]*p[1];
  const L = [];
  L.push('E1a 65: r1=(' + r1(1,2,2,3) + ') r2=(' + r2(1,2,2,3) + ') norms ' + nsq(r1(1,2,2,3)) + ' ' + nsq(r2(1,2,2,3)));
  const p = r1(2,1,1,1), q = r2(2,1,1,1);
  const pa = p.map(Math.abs).sort((x,y) => x-y), qa = q.map(Math.abs).sort((x,y) => x-y);
  L.push('E1b (2,1)x(1,1): r1=(' + p + ') r2=(' + q + ') norms ' + nsq(p) + ' ' + nsq(q) + ' unorderedPairsEqual=' + (pa[0] === qa[0] && pa[1] === qa[1]));
  const w1 = r1(1,8,1,4), w2 = r2(1,8,1,4), w3 = r1(4,7,1,4), w4 = r2(4,7,1,4);
  L.push('E2 1105: (1,8)x(1,4): r1=(' + w1 + ')=' + nsq(w1) + ' r2=(' + w2 + ')=' + nsq(w2) + ' | (4,7)x(1,4): r1=(' + w3 + ')=' + nsq(w3) + ' r2=(' + w4 + ')=' + nsq(w4));
  let rep2027 = null; for (let x = 0; x <= 45 && rep2027 === null; x++) for (let y = 0; y <= 45; y++) { if (x*x + y*y === 2027) rep2027 = '(' + x + ',' + y + ')'; }
  L.push('E3 2027%4=' + (2027 % 4) + ' rep=' + rep2027);
  let bad = 0, n = 0;
  for (const N of [1,2,3,5]) for (let x = 0; x <= 5; x++) for (let y = 0; y <= 5; y++) for (let z = 0; z <= 5; z++) for (let w = 0; w <= 5; w++) {
    const lhs = (x*x + N*y*y) * (z*z + N*w*w); n++;
    if (lhs !== (x*z - N*y*w)**2 + N*(x*w + y*z)**2) bad++;
    if (lhs !== (x*z + N*y*w)**2 + N*(x*w - y*z)**2) bad++;
  }
  L.push('Nform exhaustive N in {1,2,3,5}: cases=' + n + ' mismatches=' + bad);
  const N = 3, x = 1, y = 1, z = 2, w = 1;
  const lhs = (x*x + N*y*y) * (z*z + N*w*w), rt = (x*z - N*y*w)**2 + N*(x*w + y*z)**2;
  L.push('NformInstance N=3: (1^2+3*1)(2^2+3*1)=' + lhs + ' route=' + rt + ' equal=' + (lhs === rt));
  let pbad = 0, pn = 0;
  for (let s = -5; s <= 5; s++) for (let y = -5; y <= 5; y++) { pn++; if ((3*s + 5*y)**2 - 5*(s + 3*y)**2 !== 4*(s*s - 5*y*y)) pbad++; }
  L.push('pellQuad (3s+5y)^2-5(s+3y)^2=4(s^2-5y^2): cases=' + pn + ' mismatches=' + pbad);
  const step = (s, y) => [3*s + 5*y, s + 3*y];
  const val = t => ((t[0]/2)**2 - 5*(t[1]/2)**2);
  const s1 = step(3,1), s2 = step(7,3), s3 = step(18,8);
  L.push('pellSteps: (3,1)->(' + s1 + ') half=(' + s1[0]/2 + ',' + s1[1]/2 + ') val=' + val(s1) + ' | (7,3)->(' + s2 + ') half=(' + s2[0]/2 + ',' + s2[1]/2 + ') val=' + val(s2) + ' | (18,8)->(' + s3 + ') half=(' + s3[0]/2 + ',' + s3[1]/2 + ') val=' + val(s3));
  L.push('pellValues: 3^2-5*1=' + (9-5) + ' 7^2-5*9=' + (49-45) + ' 18^2-5*64=' + (324-320) + ' 47^2-5*441=' + (2209-2205));
  return L.join('\n');
}

// ---------- piece 5 — trivial-input routes (4225's other representations) ----------
function piece5() {
  const r1 = (a, b, c, d) => [a*c - b*d, a*d + b*c];
  const nsq = p => p[0]*p[0] + p[1]*p[1];
  const t1 = r1(0,13,3,4), t2 = r1(0,5,5,12), t3 = r1(0,13,0,5);
  return [
    '(0,13)x(3,4) r1=(' + t1 + ') norm=' + nsq(t1),
    '(0,5)x(5,12) r1=(' + t2 + ') norm=' + nsq(t2),
    '(0,13)x(0,5) r1=(' + t3 + ') norm=' + nsq(t3),
    'checks: 52^2+39^2=' + (52*52 + 39*39) + ' 60^2+25^2=' + (60*60 + 25*25) + ' 65^2=' + (65*65)
  ].join('\n');
}

// ---------- verifier A — independent recomputation (fresh engine) ----------
function verifierA() {
  const squareOf = new Map(); for (let k = -70; k <= 70; k++) squareOf.set(k*k, k);
  const isSq = v => squareOf.has(v);
  const repList = m => { const o = []; for (let a = 0; a*a <= m; a++) { const rest = m - a*a; if (isSq(rest)) { const b = squareOf.get(rest); if (b >= a) o.push('(' + a + ',' + b + ')'); } } return o; };
  const L = [];
  L.push('VA reps221=' + JSON.stringify(repList(221)));
  L.push('VA reps65=' + JSON.stringify(repList(65)));
  L.push('VA reps4225=' + JSON.stringify(repList(4225)));
  L.push('VA reps325=' + JSON.stringify(repList(325)));
  L.push('VA reps1105=' + JSON.stringify(repList(1105)));
  let fails = 0, seen = 0;
  for (let a = 1; a <= 7; a++) for (let b = 0; b <= 7; b++) for (let c = 1; c <= 7; c++) for (let d = 0; d <= 7; d++) {
    const lhs = (a*a + b*b) * (c*c + d*d), rhs1 = (a*c - b*d)*(a*c - b*d) + (a*d + b*c)*(a*d + b*c);
    seen++; if (lhs !== rhs1) fails++;
  }
  L.push('VA identity grid cases=' + seen + ' fails=' + fails);
  const sub4 = v => { let t = v; while (t >= 4) t -= 4; return t; };
  const c4 = []; for (let r = 0; r < 4; r++) { const v = sub4(r*r); if (c4.indexOf(v) < 0) c4.push(v); }
  L.push('VA squaresMod4=' + JSON.stringify(c4));
  L.push('VA 2027sub4=' + sub4(2027));
  return L.join('\n');
}

// ---------- verifier B (run 3) — 14 must-fail injections + 2 positive controls ----------
function verifierB() {
  const squareOf = new Map(); for (let k = -70; k <= 70; k++) squareOf.set(k*k, k);
  const isSq = v => squareOf.has(v);
  const repList = m => { const o = []; for (let a = 0; a*a <= m; a++) { const r = m - a*a; if (isSq(r)) { const b = squareOf.get(r); if (b >= a) o.push('(' + a + ',' + b + ')'); } } return o; };
  const has = (m, x, y) => x*x + y*y === m;
  let t3rep = false; for (let a = 0; a <= 3 && !t3rep; a++) for (let b = 0; b <= 3 && !t3rep; b++) for (let c = 0; c <= 3; c++) { if (a*a + b*b + c*c === 15) t3rep = true; }
  const r1 = [2*1 - 1*1, 2*1 + 1*1], r2 = [2*1 + 1*1, 2*1 - 1*1];
  const s1 = [Math.abs(r1[0]), Math.abs(r1[1])].sort((x, y) => x - y), s2 = [Math.abs(r2[0]), Math.abs(r2[1])].sort((x, y) => x - y);
  const unorderedEqual = (s1[0] === s2[0] && s1[1] === s2[1]);
  const claims = [
    { id: 'V1', actual: ((1*1 + 1*1)*(1*1 + 1*1) === ((1*1 + 1*1)**2 + (1*1 + 1*1)**2)), expectCaught: true },
    { id: 'V2', actual: has(221, 5, 15), expectCaught: true },
    { id: 'V3', actual: (has(221, 7, 4) && (1*2 + 4*3 === 7) && (1*3 - 4*2 === 4)), expectCaught: true },
    { id: 'V4', actual: has(4225, 33, 55), expectCaught: true },
    { id: 'V5', actual: (repList(325).length === 4), expectCaught: true },
    { id: 'V6', actual: has(1105, 12, 30), expectCaught: true },
    { id: 'V7', actual: (repList(3).length > 0), expectCaught: true },
    { id: 'V8', actual: ((4 % 4 === 2) || (9 % 4 === 2) || (1 === 2) || (0 === 2)), expectCaught: true },
    { id: 'V9', actual: has(2027, 9, 44), expectCaught: true },
    { id: 'V10', actual: t3rep, expectCaught: true },
    { id: 'V11', actual: ((4*7) === ((2 - 3)**2 + 3*(2 - 1)**2)), expectCaught: true },
    { id: 'V12', actual: (repList(4225).length === 4), expectCaught: true },
    { id: 'V13', actual: (!unorderedEqual), expectCaught: true },
    { id: 'V14', actual: ((47*47 - 5*21*21) === 5), expectCaught: true },
    { id: 'P1', actual: ((9 + 16)*(25 + 144) === ((15 - 48)**2 + (36 + 20)**2)), expectCaught: false },
    { id: 'P2', actual: has(221, 10, 11), expectCaught: false }
  ];
  let caught = 0, mustFail = 0, ctrlOK = 0, ctrls = 0; const defects = [];
  const rows = [];
  for (const c of claims) {
    const ok = c.expectCaught ? (c.actual === false) : (c.actual === true);
    if (c.expectCaught) { mustFail++; if (c.actual === false) caught++; else defects.push(c.id + ' MISSED'); }
    else { ctrls++; if (c.actual === true) ctrlOK++; else defects.push(c.id + ' CONTROL_FAILED'); }
    rows.push(c.id + ' ' + (c.expectCaught ? '[must-fail]' : '[control]') + ' evaluates=' + (c.actual ? 'true' : 'false') + ' ' + (ok ? 'caught' : 'NOT-CAUGHT'));
  }
  const verdict = 'VERIFIER RUN 3: caught=' + caught + '/' + mustFail + ' controls=' + ctrlOK + '/' + ctrls + ' ' + (defects.length === 0 ? 'PASS' : 'DEFECTS: ' + defects.join(','));
  return rows.join('\n') + '\n' + verdict;
}

// ---------- runner ----------
const outs = [piece0(), piece1(), piece2(), piece3(), piece4(), piece5(), verifierA(), verifierB()];
console.log(outs.join('\n'));
