// P15 battery — machine verification of p15-squeeze.html against independently
// computed mathematics. Pure functions of the assembled page bytes: each piece
// is dispatched with (PAGE, T) where T(name, cond, info) records a check.
// No recursion, no BigInt, exact integer arithmetic where the page claims it.

/*PIECE0*/
T('p0.title', /<title>P15 · Squeeze it · The Patterns Atlas<\/title>/.test(PAGE));
T('p0.kicker', PAGE.indexOf('P15 · the fifteenth move of the spine') >= 0);
T('p0.h1', /<h1>Squeeze it<\/h1>/.test(PAGE));
T('p0.head.mathjax', PAGE.indexOf("inlineMath:[['\\\\(','\\\\)']]") >= 0);
T('p0.head.integrity', PAGE.indexOf('sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=') >= 0);
T('p0.stylesheet', PAGE.indexOf('assets/style.css') >= 0);
T('p0.sections', (PAGE.match(/<section id=/g) || []).length === 8 && (PAGE.match(/<\/section>/g) || []).length === 8);
['bridge','encounter','name-the-move','the-move-at-work','when-it-fails','what-next','lineage','exercises'].forEach(function(id){ T('p0.sec.' + id, PAGE.indexOf('section id="' + id + '"') >= 0); });
T('p0.h2count', (PAGE.match(/<h2>/g) || []).length === 8);
T('p0.h3count', (PAGE.match(/<h3>/g) || []).length === 11);
T('p0.boxes', ['box-p15','box-p15a','box-p15b'].every(function(b){ return PAGE.indexOf('id="' + b + '"') >= 0; }) && (PAGE.match(/class="pattern-box"/g) || []).length === 3);
T('p0.pids', (PAGE.match(/class="pid"/g) || []).length === 3);
T('p0.figures', ['fig-p15-1','fig-p15-2','fig-p15-3'].every(function(f){ return PAGE.indexOf('id="' + f + '"') >= 0; }));
T('p0.details10', (PAGE.match(/<details>/g) || []).length === 10);
T('p0.ex5', (PAGE.match(/class="ex"/g) || []).length === 5);
T('p0.exdetails', (PAGE.match(/<details><summary>Hint<\/summary>/g) || []).length === 5 && (PAGE.match(/<details><summary>Worked<\/summary>/g) || []).length === 5);
T('p0.footer', PAGE.indexOf('Return to the index</a> · Next: <a href="b05-coordinates-basis.html">B05 · Coordinates are a measuring scheme</a>') >= 0);
T('p0.nodollar', PAGE.indexOf('$') < 0);
T('p0.onramp3', (PAGE.match(/New word:/g) || []).length === 3);
T('p0.warn', PAGE.indexOf('class="warn"') >= 0 && PAGE.indexOf('Scope, honestly.') >= 0);
T('p0.spine14', ['p01-pin-down-the-problem','p02-small-cases','p03-special-cases','p04-complete-the-square','p05-canonical-form','p06-compose-identity','p07-auxiliary-construction','p08-symmetry','p09-invariant','p10-pigeonhole','p11-contradiction','p12-obstruction','p13-descent','p14-diagonal'].every(function(s){ return PAGE.indexOf(s + '.html') >= 0; }));
T('p0.texbal', (PAGE.match(/\\\(/g) || []).length === (PAGE.match(/\\\)/g) || []).length && (PAGE.match(/\\\[/g) || []).length === (PAGE.match(/\\\]/g) || []).length);
T('p0.poisons', !/TODO|XXX|Lorem|placeholder|drafting|wait —/.test(PAGE));
T('p0.difficulty', ['●○○','●●○','●●●','◆','◐'].every(function(d){ return PAGE.indexOf(d) >= 0; }));
T('p0.uptodate', PAGE.indexOf('p15-squeeze.html') < 0);

/*PIECE1*/
var a1p = 1, b1p = 2 / Math.sqrt(3), n1p = 6;
var chain = [{ n: 6, L: 3 * a1p, U: 3 * b1p }];
for (var i1p = 0; i1p < 8; i1p++) {
  a1p = Math.sqrt(2 - 2 * Math.sqrt(1 - a1p * a1p / 4));
  b1p = b1p / (1 + Math.sqrt(1 + b1p * b1p / 4));
  n1p *= 2;
  chain.push({ n: n1p, L: n1p * a1p / 2, U: n1p * b1p / 2 });
}
T('p1.hexlow', Math.abs(chain[0].L - 3) < 1e-12);
T('p1.hexup', Math.abs(chain[0].U - 2 * Math.sqrt(3)) < 1e-12 && 120000 < 120409);
var s1p = PAGE.indexOf('Start from');
var e1p = PAGE.indexOf('</table>', s1p);
var reg1 = PAGE.slice(s1p, e1p);
var tab = reg1.match(/<tr><td>(6|12|24|48|96|192)<\/td><td>(3\.\d+)<\/td><td>(3\.\d+)<\/td><td>(0\.\d+)<\/td><\/tr>/g) || [];
T('p1.tablerows', tab.length === 6);
tab.forEach(function(row, i) {
  var m = row.match(/<tr><td>(\d+)<\/td><td>(3\.\d+)<\/td><td>(3\.\d+)<\/td><td>(0\.\d+)<\/td><\/tr>/);
  var c = chain[i], lo = parseFloat(m[2]), up = parseFloat(m[3]), gp = parseFloat(m[4]);
  T('p1.walls.n' + m[1], Math.abs(lo - c.L) < 5e-6 && Math.abs(up - c.U) < 5e-6, m[1] + ': ' + lo + '/' + up);
  T('p1.gap.n' + m[1], Math.abs(gp - (c.U - c.L)) < 5e-6, m[1] + ': ' + gp);
});
T('p1.ratio.print', PAGE.indexOf('4.24, 4.05, 4.01, 4.00, 4.00') >= 0);
var gaps = chain.slice(0, 6).map(function(c){ return c.U - c.L; });
var ratioOK = [0,1,2,3,4].every(function(i){ return Math.abs(gaps[i] / gaps[i+1] - [4.24,4.05,4.01,4.00,4.00][i]) < 0.005; });
T('p1.ratio.calc', ratioOK);
T('p1.gapn2.print', PAGE.indexOf('16.7, 15.8, 15.6, 15.5, 15.5, 15.5') >= 0);
var gn2 = chain.slice(0, 6).every(function(c, i){ return Math.abs((c.U - c.L) * c.n * c.n - [16.7,15.8,15.6,15.5,15.5,15.5][i]) < 0.05; });
T('p1.gapn2.calc', gn2);
T('p1.archi.order', chain[4].L > 223 / 71 && chain[4].U < 22 / 7 && Math.abs(223/71 - 3.14085) < 5e-6 && Math.abs(22/7 - 3.14286) < 5e-6);
T('p1.archi.print', PAGE.indexOf('3.14103 &gt; 223/71') >= 0 && PAGE.indexOf('3.14271 &lt; 22/7') >= 0);
T('p1.dec96', Math.floor(chain[4].L * 100) === Math.floor(chain[4].U * 100) && Math.floor(chain[4].L * 100) === 314);
T('p1.dec192', Math.floor(chain[5].L * 1000) === Math.floor(chain[5].U * 1000) && Math.floor(chain[5].L * 1000) === 3141);
T('p1.n1536', chain[8].n === 1536 && Math.floor(chain[8].L * 1e5) === Math.floor(chain[8].U * 1e5));
T('p1.n768no', Math.floor(chain[7].L * 1e5) !== Math.floor(chain[7].U * 1e5));
T('p1.log10_4', Math.abs(Math.log10(4) - 0.602) < 5e-4);
T('p1.a12form', PAGE.indexOf('a_{12} = \\sqrt{2 - \\sqrt 3}') >= 0);
T('p1.b12form', PAGE.indexOf('b_{12} = 4 - 2\\sqrt 3') >= 0);
T('p1.walls12', Math.abs(6 * Math.sqrt(2 - Math.sqrt(3)) - 3.10583) < 5e-6 && Math.abs(6 * (4 - 2 * Math.sqrt(3)) - 3.21539) < 5e-6);
T('p1.gapfactor', Math.abs(0.46410 / 0.10956 - 4.24) < 0.01);
T('p1.cert347', 12 * 10000 < 120409 && 3.47 * 3.47 > 12.04 && 2 * Math.sqrt(3) < 3.47);

/*PIECE2*/
function shoe(p) { return Math.abs((p[1][0] - p[0][0]) * (p[2][1] - p[0][1]) - (p[2][0] - p[0][0]) * (p[1][1] - p[0][1])) / 2; }
T('p2.T1', shoe([[-1,1],[1,1],[0,0]]) === 1);
T('p2.stage2eighth', shoe([[-1,1],[0,0],[-0.5,0.25]]) === 0.125);
T('p2.apex', 2 * (-0.5) === -1 && (-0.5) * (-0.5) === 0.25);
T('p2.apex.print', PAGE.indexOf('(-\\tfrac{1}{2}, \\tfrac{1}{4})') >= 0);
var s2p = PAGE.indexOf('stage adds');
var reg2 = PAGE.slice(s2p, PAGE.indexOf('</table>', s2p));
var cov = reg2.match(/<tr><td>([1-5])<\/td><td>[^<]*<\/td><td>([\d.]+)<\/td><td>[^<]*<\/td><\/tr>/g) || [];
T('p2.covrows', cov.length === 5);
cov.forEach(function(row) {
  var m = row.match(/<tr><td>([1-5])<\/td><td>[^<]*<\/td><td>([\d.]+)<\/td><td>[^<]*<\/td><\/tr>/);
  var k = +m[1], num = Math.pow(4, k + 1) - 4, den = 3 * Math.pow(4, k);
  T('p2.covered.' + k, Math.abs(num / den - parseFloat(m[2])) < 1e-12, m[2]);
  T('p2.gapfrac.' + k, reg2.indexOf('\\tfrac{1}{' + [3,12,48,192,768][k-1] + '}') >= 0);
});
var identOK = [1,2,3,4,5].every(function(k) {
  var covered = (Math.pow(4, k + 1) - 4) / (3 * Math.pow(4, k));
  return Math.abs(covered + (4/3) * Math.pow(4, -k) - 4/3) < 1e-15;
});
T('p2.upperwall.identity', identOK);
T('p2.stageadds', PAGE.indexOf('\\tfrac{T}{4} = \\tfrac{1}{4}') >= 0 && PAGE.indexOf('\\tfrac{T}{16} = \\tfrac{1}{16}') >= 0 && PAGE.indexOf('\\tfrac{T}{64} = \\tfrac{1}{64}') >= 0 && PAGE.indexOf('\\tfrac{T}{256} = \\tfrac{1}{256}') >= 0);
var h = 2 / 2000000, sum = 0;
for (var i2p = 0; i2p < 2000000; i2p++) {
  var xm = -1 + (i2p + 0.5) * h;
  sum += (1 - xm * xm) * h;
}
T('p2.quad', Math.abs(sum - 4/3) < 1e-12, String(sum));
T('p2.integral.print', PAGE.indexOf('\\int_{-1}^{1}(1 - x^2)\\,dx') >= 0);
T('p2.anchors', PAGE.indexOf('points="60,60 260,60 160,150"') >= 0 && PAGE.indexOf('110,127.5') >= 0 && PAGE.indexOf('210,127.5') >= 0);
T('p2.qp24', PAGE.indexOf('twenty-four propositions') >= 0);

/*PIECE3*/
function fact(k) { var f = 1; for (var i = 2; i <= k; i++) f *= i; return f; }
var fbOK = true;
for (var k3 = 1; k3 <= 12; k3++) if (fact(k3) < Math.pow(2, k3 - 1)) fbOK = false;
T('p3.factbound', fbOK);
var eT = 0; for (var j3 = 0; j3 <= 30; j3++) eT += 1 / fact(j3);
T('p3.eval', Math.abs(eT - 2.718281828) < 5e-10);
var F9 = fact(9), num9 = 0;
for (var j9 = 0; j9 <= 9; j9++) num9 += F9 / fact(j9);
T('p3.S9frac', num9 === 986410 && F9 === 362880);
T('p3.S9val', Math.abs(num9 / F9 - 2.718281526) < 5e-10);
T('p3.S9printed', PAGE.indexOf('\\frac{986410}{362880}') >= 0 && PAGE.indexOf('2.718281526') >= 0);
var tailOK = true;
[1,2,3,5,7,9].forEach(function(k) {
  var R = 0; for (var j = k + 1; j <= 60; j++) R += 1 / fact(j);
  if (!(R > 0 && R < 1 / (k * fact(k)))) tailOK = false;
});
T('p3.tailbound', tailOK);
var wall9 = num9 / F9 + 1 / (9 * F9);
T('p3.wall9', Math.abs(wall9 - 2.718281832) < 5e-10);
T('p3.wall9print', PAGE.indexOf('2.718281832') >= 0);
T('p3.wall9cert', Math.floor((num9 / F9) * 1e5) === Math.floor(wall9 * 1e5) && Math.floor(wall9 * 1e5) === 271828);
T('p3.floor_e', Math.floor(eT) === 2 && 2.5 < eT && eT < 3);
T('p3.crudeprint', PAGE.indexOf('2.5 &lt; e &lt; 3') >= 0 && PAGE.indexOf('2.5 &lt; e &lt; 3') === PAGE.lastIndexOf('2.5 &lt; e &lt; 3') ? true : PAGE.indexOf('2.5 &lt; e &lt; 3') >= 0);
T('p3.tailprint', PAGE.indexOf('3.07 \\times 10^{-7}') >= 0 && PAGE.indexOf('0.000000306') >= 0 && PAGE.indexOf('1/3265920') < 0);
var qintOK = true;
[2,3,4].forEach(function(q) {
  var s = 0, FQ = fact(q);
  for (var j = 0; j <= q; j++) s += FQ / fact(j);
  if (!Number.isInteger(s)) qintOK = false;
});
T('p3.qint', qintOK);
T('p3.witness2', Math.abs(2 * (eT - 2.5) - 0.4366) < 5e-5 && 0 < 2 * (eT - 2.5) && 2 * (eT - 2.5) < 1);
T('p3.witness2print', PAGE.indexOf('0.4366') >= 0);
T('p3.eIrrprint', PAGE.indexOf('\\(e\\) is not a fraction') >= 0);
T('p3.boundprint', PAGE.indexOf('\\frac{1}{k \\cdot k!}') >= 0);

/*PIECE4*/
[1,2,5,9,12].forEach(function(K) {
  var t = (Math.pow(10, K) - 1) / Math.pow(10, K);
  T('p4.trunc.' + K, Math.abs((1 - t) * Math.pow(10, K) - 1) < 1e-3);
});
T('p4.eq999', PAGE.indexOf('0.999\\ldots = 1') >= 0 && PAGE.indexOf('ε-trap') >= 0);
var s4 = PAGE.indexOf('lower endpoint');
var reg4 = PAGE.slice(s4, PAGE.indexOf('</table>', s4));
var bis = reg4.match(/<tr><td>(\d+)<\/td><td>([\d.]+)<\/td><td>([\d.]+)<\/td><td>([\d.]+)<\/td><\/tr>/g) || [];
T('p4.bisrows', bis.length === 10);
bis.forEach(function(row) {
  var m = row.match(/<tr><td>(\d+)<\/td><td>([\d.]+)<\/td><td>([\d.]+)<\/td><td>([\d.]+)<\/td><\/tr>/);
  var step = +m[1], lo = parseFloat(m[2]), hi = parseFloat(m[3]), w = parseFloat(m[4]);
  T('p4.dyadic.' + step, Number.isInteger(lo * 1024) && Number.isInteger(hi * 1024), m[2]);
  var klo = Math.round(lo * 1024), khi = Math.round(hi * 1024);
  T('p4.sign.' + step, klo * klo < 2097152 && khi * khi > 2097152, 'k=' + klo);
  T('p4.width.' + step, Math.abs(w - Math.pow(2, -step)) < 1e-15);
});
T('p4.bracket', Math.pow(2, 34) > 1e10 && Math.pow(2, 33) < 1e10);
T('p4.bracket.print', PAGE.indexOf('2^{-34}') >= 0 && PAGE.indexOf('2^{-33}') >= 0);
T('p4.cert', 1414 * 1414 === 1999396 && 1415 * 1415 === 2002225 && 1999396 < 2000000 && 2000000 < 2002225);
T('p4.cert.print', PAGE.indexOf('1414^2 = 1999396') >= 0 && PAGE.indexOf('2002225 = 1415^2') >= 0);
var xb = 1, errs = [];
for (var i4 = 0; i4 < 5; i4++) { errs.push(Math.abs(xb - Math.SQRT2)); xb = 0.5 * (xb + 2 / xb); }
T('p4.bab1', Math.abs(errs[0] - 0.414) < 5e-4 && Math.abs(errs[1] - 0.0858) < 5e-5 && Math.abs(errs[2] - 0.00245) < 5e-6);
T('p4.bab2', Math.abs(errs[3] - 2.1e-6) < 5e-8 && Math.abs(errs[4] - 1.6e-12) < 5e-14);
T('p4.bab.print', ['0.414','0.0858','0.00245','2.1 \\times 10^{-6}','1.6 \\times 10^{-12}'].every(function(s){ return PAGE.indexOf(s) >= 0; }));
T('p4.log10_2', Math.abs(Math.log10(2) - 0.301) < 5e-4);
T('p4.34steps', PAGE.indexOf('ten full decimals cost \\(34\\) steps') >= 0);

/*PIECE5*/
var m5L = PAGE.match(/<polyline points="([^"]+)" fill="none" stroke="#447"/);
var m5U = PAGE.match(/<polyline points="([^"]+)" fill="none" stroke="#a33"/);
T('p5.jawpolylines', !!m5L && !!m5U);
var a5 = 1, b5 = 2 / Math.sqrt(3), n5 = 6;
var ch5 = [{ n: 6, L: 3, U: 2 * Math.sqrt(3) }];
for (var i5 = 0; i5 < 4; i5++) {
  a5 = Math.sqrt(2 - 2 * Math.sqrt(1 - a5 * a5 / 4));
  b5 = b5 / (1 + Math.sqrt(1 + b5 * b5 / 4));
  n5 *= 2;
  ch5.push({ n: n5, L: n5 * a5 / 2, U: n5 * b5 / 2 });
}
var pxf = function(v) { return Math.round((150 - (v - 3) * 258.5) * 10) / 10; };
var ptsL = m5L ? m5L[1].split(' ') : [];
var ptsU = m5U ? m5U[1].split(' ') : [];
T('p5.jawcount', ptsL.length === 5 && ptsU.length === 5);
[6,12,24,48,96].forEach(function(n, i) {
  var expX = 40 + 60 * Math.log2(n / 6);
  var lq = ptsL[i] ? ptsL[i].split(',').map(Number) : [0, 0];
  var uq = ptsU[i] ? ptsU[i].split(',').map(Number) : [0, 0];
  T('p5.jawx.' + n, Math.abs(lq[0] - expX) < 0.01 && Math.abs(uq[0] - expX) < 0.01);
  T('p5.jawy.' + n, Math.abs(lq[1] - pxf(ch5[i].L)) < 0.06 && Math.abs(uq[1] - pxf(ch5[i].U)) < 0.06, lq[1] + '/' + uq[1]);
});
T('p5.piLine', PAGE.indexOf('y1="113.4"') >= 0 && Math.abs(pxf(Math.PI) - 113.4) < 0.06);
var mp5 = PAGE.match(/<polyline points="([^"]+)" fill="none" stroke="#333"/);
T('p5.parapoly', !!mp5);
var okPts = true;
if (mp5) {
  var pp5 = mp5[1].split(' ');
  if (pp5.length !== 25) okPts = false;
  for (var q5 = 0; q5 < pp5.length; q5++) {
    var x5 = -1.2 + q5 * 0.1;
    var exX = Math.round((160 + 100 * x5) * 10) / 10, exY = Math.round((150 - 90 * x5 * x5) * 10) / 10;
    var g5 = pp5[q5].split(',').map(Number);
    if (Math.abs(g5[0] - exX) > 0.06 || Math.abs(g5[1] - exY) > 0.06) okPts = false;
  }
}
T('p5.parapts', okPts);
var mh1 = PAGE.match(/<polygon points="([^"]+)" fill="#e8f0fe" stroke="#447"/);
var mh2 = PAGE.match(/<polygon points="([^"]+)" fill="none" stroke="#a33"/);
T('p5.hexpolys', !!mh1 && !!mh2);
var radOK = true, radOOK = true;
if (mh1 && mh2) {
  mh1[1].split(' ').forEach(function(pt) {
    var c = pt.split(',').map(Number);
    if (Math.abs(Math.hypot(c[0] - 170, c[1] - 130) - 75) > 0.1) radOK = false;
  });
  mh2[1].split(' ').forEach(function(pt) {
    var c = pt.split(',').map(Number);
    if (Math.abs(Math.hypot(c[0] - 170, c[1] - 130) - 86.6025) > 0.1) radOOK = false;
  });
}
T('p5.hexIn', radOK);
T('p5.hexOut', radOOK);
['Measurement of a Circle','Quadrature of the Parabola','twenty-four propositions','Antiphon','Eudoxus','Book XII','Liu Hui','3.1415926','3.1415927','355/113','24{,}576','1647','Gregory of Saint Vincent','Lindemann','1882','Hermite','1873','223/71','22/7','Nine Chapters','3.1416','192'].forEach(function(s) { T('p5.hist.' + s.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12), PAGE.indexOf(s) >= 0, s); });
['p21-limit-point.html','p22-fixed-point.html','p38-major-minor-arcs.html','p56-asymptotic-rescaling.html','m01-root-two-irrational.html'].forEach(function(s) { T('p5.link.' + s.slice(0, 8), PAGE.indexOf(s) >= 0); });
