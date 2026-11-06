/* freeze runner — pass N writes its full receipt blob to globalThis.__OUTPATH.
   Deterministic: fixed file set, fixed order, no randomness, no Date in the value path.
   T is loaded with the four receipt-safe pairs (pair 4 runs via piece W, k-verified,
   because Tk reads 0 at its k = 1 circle - proven infinite-loop path if looped on). */
async function __freezeMain() {
  var W = '/home/user/knowledge/graph-driven-math-book/wip/';
  var readAll = async function (p) {
    var content = '', off = 0, guard = 0, r;
    while (guard < 10) {
      guard++;
      r = await globalThis.__FS_TOOLS.read_file({ path: W + p, offset: off });
      content += r.content;
      if (r.was_truncated && r.next_offset !== null && r.next_offset !== undefined) { off = r.next_offset; } else { break; }
    }
    return content;
  };
  var head = await readAll('p65-lab-head.txt');
  var A = await readAll('p65-A.js');
  var B = await readAll('p65-B.js');
  var T = await readAll('p65-T.js');
  var WRAP = await readAll('p65-W.js');
  var C = await readAll('p65-C.js');
  var D = await readAll('p65-D.js');
  var Q = await readAll('p65-Q.js');
  var S = await readAll('p65-S.js');
  var PAGE = await readAll('p65-page.html');
  globalThis.PAGE_TEXT = PAGE;
  globalThis.__TPAIRS = [[0.05, 0.03], [0.1, 0.1], [0.3, 0.2], [1.0, 0.7]];
  globalThis.__PAIRS = null;
  globalThis.__DEADLINE = null;
  var st = {};
  var run = function (tag, code) {
    try { new Function(code)(); st[tag] = 'ok'; }
    catch (er) { st[tag] = 'ERR ' + String(er && er.message || er).slice(0, 140); }
  };
  run('A', head + A + '; globalThis.__AOUT = OUT;');
  run('B', head + B + '; globalThis.__BOUT = OUT;');
  run('T', head + T + WRAP + '; globalThis.__TOUT = OUT;');
  run('C', head + C + '; globalThis.__COUT = OUT;');
  run('D', head + D + '; globalThis.__DOUT = OUT;');
  run('Q', head + Q);
  run('S', head + S);
  var cnt = function (arr, w) { var n = 0, i; if (!arr) { return 0; } for (i = 0; i < arr.length; i++) { if (arr[i].indexOf(w) >= 0) { n++; } } return n; };
  var blob = {
    meta: { head: head.length, A: A.length, B: B.length, T: T.length, W: WRAP.length, C: C.length, D: D.length, Q: Q.length, S: S.length, page: PAGE.length, pageTail: PAGE.slice(-24), tPairs: 'safe4' },
    A: globalThis.__AOUT, B: globalThis.__BOUT, T: globalThis.__TOUT,
    Trec: globalThis.__T, P4: globalThis.__P4, P5K1: globalThis.__P5K1,
    C: globalThis.__C, D: globalThis.__D, BEXPLORE: globalThis.__BEXPLORE,
    Q: globalThis.__Q, S: globalThis.__S
  };
  var txt = JSON.stringify(blob);
  await globalThis.__FS_TOOLS.write_file({ path: globalThis.__OUTPATH, content: txt });
  var tpr = (globalThis.__T && globalThis.__T.pairs) || [];
  var sum = {
    statuses: st,
    pageChars: PAGE.length, pageTailOk: PAGE.indexOf('</html>') >= 0,
    pass_fail: {
      A: [cnt(globalThis.__AOUT, ' PASS '), cnt(globalThis.__AOUT, ' FAIL ')],
      B: [cnt(globalThis.__BOUT, ' PASS '), cnt(globalThis.__BOUT, ' FAIL ')],
      T: [cnt(globalThis.__TOUT, ' PASS '), cnt(globalThis.__TOUT, ' FAIL ')],
      C: [cnt(globalThis.__C && globalThis.__C.checks, ' PASS '), cnt(globalThis.__C && globalThis.__C.checks, ' FAIL ')],
      D: [cnt(globalThis.__D && globalThis.__D.checks, ' PASS '), cnt(globalThis.__D && globalThis.__D.checks, ' FAIL ')],
      Q: [cnt(globalThis.__Q && globalThis.__Q.checks, ' PASS '), cnt(globalThis.__Q && globalThis.__Q.checks, ' FAIL ')],
      S: [cnt(globalThis.__S && globalThis.__S.checks, ' PASS '), cnt(globalThis.__S && globalThis.__S.checks, ' FAIL ')]
    },
    tPairs: tpr.map(function (r) {
      return { pair: r.pair, eq: r.eq, circles: r.roots.filter(function (x) { return x.type === 'circle'; }).length, halves: r.roots.filter(function (x) { return x.type === 'half'; }).length, circlesDetail: r.roots.filter(function (x) { return x.type === 'circle'; }).map(function (x) { return x.k + '@' + x.E; }) };
    }),
    P4: globalThis.__P4 && { eq: globalThis.__P4.eq, tkReads: globalThis.__P4.tkReads, roots: globalThis.__P4.roots },
    P5K1: globalThis.__P5K1,
    blobChars: txt.length
  };
  return sum;
}
