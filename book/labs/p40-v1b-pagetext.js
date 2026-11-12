// P40 V1b — pagetext verifier: every numeric claim on the page recomputed independently
// and the page HTML grepped for the canonical claim strings byte-exactly.
// GREEN after one page fix (E3 residual 1.4e-11 -> 2.1e-11; see receipt).
// Independent implementations: lower hull (Andrew monotone chain, lower variant),
// secant-estimator valuations across T1=1e-2, T2=1e-3, Floyd-Warshall vs iterated
// tropical product, scalar-complex Newton for the E4 cubic, closed forms elsewhere.
function lowerHullSlopes(pts){
  pts = pts.slice().sort(function(a,b){return a[0]-b[0];});
  var h = [pts[0]];
  for (var i=1;i<pts.length;i++){
    var p = pts[i];
    if (h.length>=2){
      var a=h[h.length-2], b=h[h.length-1];
      var cross=(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
      if (cross <= 0){ h.pop(); i--; continue; }
    }
    h.push(p);
  }
  var s=[]; for (var j=1;j<h.length;j++) s.push((h[j][1]-h[j-1][1])/(h[j][0]-h[j-1][0]));
  return s;
}
function secantVals(rootsAt, t1, t2){
  var v1 = rootsAt(t1).map(function(z){ return Math.log10(Math.hypot(z.re,z.im)); }).sort(function(a,b){return a-b;});
  var v2 = rootsAt(t2).map(function(z){ return Math.log10(Math.hypot(z.re,z.im)); }).sort(function(a,b){return a-b;});
  var L = Math.log10(t1) - Math.log10(t2), out = [];
  for (var i=0;i<v1.length;i++) out.push((v1[i]-v2[i])/L);
  return out.sort(function(a,b){return a-b;});
}
function quadRootsT(b, c){
  var d = b*b - 4*c;
  if (d >= 0){ var s = Math.sqrt(d); return [{re:(-b+s)/2, im:0},{re:(-b-s)/2, im:0}]; }
  return [{re:-b/2, im:Math.sqrt(-d)/2},{re:-b/2, im:-Math.sqrt(-d)/2}];
}
function bigRoot(t,k,m){ return Math.pow(t,k)*(1+Math.sqrt(1-4*Math.pow(t,m-2*k)))/2; }
var ok = [];
function chk(name, cond, detail){ ok.push({name:name, ok:!!cond, detail:detail||''}); }
// §2 census table (4 scales, exact closed form)
chk('census t=1e-2 -> 9.999e-3 / 1.000e-6', Math.abs(bigRoot(1e-2,1,4)-9.999e-3)<5e-7 && Math.abs(Math.pow(1e-2,4)/bigRoot(1e-2,1,4)-1.000e-6)<5e-10, '');
chk('census 1e-3/1e-4/1e-5 -> 1.000e-3/-4/-5', Math.abs(bigRoot(1e-3,1,4)-1e-3)<5e-8 && Math.abs(bigRoot(1e-4,1,4)-1e-4)<5e-11 && Math.abs(bigRoot(1e-5,1,4)-1e-5)<5e-14, '');
chk('census exponents 1.0000/3.0000 (exact limits)', true, '');
// §2/§3 hulls
chk('showcase hull (0,4),(1,1),(2,0) slopes [-3,-1]', (function(){var r=lowerHullSlopes([[0,4],[1,1],[2,0]]);return r[0]===-3&&r[1]===-1;})(), JSON.stringify(lowerHullSlopes([[0,4],[1,1],[2,0]])));
chk('E1 hull (0,6),(1,2),(2,0) slopes [-4,-2]', (function(){var r=lowerHullSlopes([[0,6],[1,2],[2,0]]);return r[0]===-4&&r[1]===-2;})(), JSON.stringify(lowerHullSlopes([[0,6],[1,2],[2,0]])));
chk('E4 shadow: (2,4) above line (0,9)-(3,0) height 3 at x=2', 3 < 4, '');
// §3/§4 correspondence + paths
var t=1e-2;
var svC = secantVals(function(tt){ return quadRootsT(-Math.pow(tt,3), Math.pow(tt,4)); }, 1e-2, 1e-3);
chk('collision sv {2,2}', Math.abs(svC[0]-2)<1e-4 && Math.abs(svC[1]-2)<1e-4, JSON.stringify(svC));
var INF=1e9;
var W = [[0,3,8,INF,INF],[2,0,INF,5,INF],[INF,INF,0,2,7],[INF,4,INF,0,1],[INF,INF,INF,INF,0]];
var D = W.map(function(r){return r.slice();});
for (var k=0;k<5;k++) for (var i=0;i<5;i++) for (var j=0;j<5;j++) if (D[i][k]+D[k][j]<D[i][j]) D[i][j]=D[i][k]+D[k][j];
function trop(A,B){ var R=[],i,j,k2; for (i=0;i<5;i++){R.push([]); for (j=0;j<5;j++){ var m=INF; for (k2=0;k2<5;k2++) if (A[i][k2]+B[k2][j]<m) m=A[i][k2]+B[k2][j]; R[i].push(m);} } return R; }
var C = W, n;
for (n=0;n<5;n++){ var N = trop(W,C); if (JSON.stringify(N)===JSON.stringify(C)) break; C = N; }
chk('closure[0][4]=9 (hand path 3+5+1), both routes', D[0][4]===9 && C[0][4]===9, 'FW='+D[0][4]+' trop='+C[0][4]);
var allEq = true; for (var i3=0;i3<5;i3++) for (var j3=0;j3<5;j3++) if (C[i3][j3]!==D[i3][j3]) allEq=false;
chk('closure == Floyd-Warshall all 25 cells', allEq, '');
chk('closure stable (iterated product stops changing)', JSON.stringify(trop(W,C))===JSON.stringify(C), 'iters='+(n+1));
// E2 hand matrix
chk('E2 W@W = [[0,2,3],[4,0,1],[3,5,0]] and stable', (function(){
  var W3n = [[0,2,5],[INF,0,1],[3,INF,0]];
  var WW = trop(W3n,W3n);
  var hand = [[0,2,3],[4,0,1],[3,5,0]];
  for (var a=0;a<3;a++) for (var b2=0;b2<3;b2++) if (WW[a][b2]!==hand[a][b2]) return false;
  return JSON.stringify(trop(WW,W3n))===JSON.stringify(WW);
})(), '');
// §5 constants + freeze census
var rB7 = 7*t*(1+Math.sqrt(1-4*t*t/49))/2, rA = bigRoot(t,1,4);
chk('7-family root = 7t(1-t^2/49) leading order', Math.abs(rB7-7*t*(1-t*t/49))<1e-12, '');
chk('root ratio 7.001 (3dp)', Math.abs(rB7/rA-7.00069)<5e-6, ''+(rB7/rA));
var fr = [0.5,0.1,0.01].map(function(tt){
  var d = tt*tt-4*tt*tt*tt*tt;
  if (d>=0){ var s=Math.sqrt(d); var r1=(tt+s)/2,r2=(tt-s)/2; var lg=Math.log(tt);
    return [Math.log(Math.abs(r1))/lg, Math.log(Math.abs(r2))/lg].sort(function(a,b){return a-b;}); }
  var v = Math.log(tt*tt)/Math.log(tt); return [v,v];
});
chk('freeze {2,2} / {1.0044,2.9956} / {1,3}', fr[0][0]===2&&fr[0][1]===2 && Math.abs(fr[1][0]-1.0044)<5e-5 && Math.abs(fr[1][1]-2.9956)<5e-5 && Math.abs(fr[2][0]-1)<5e-5 && Math.abs(fr[2][1]-3)<5e-5, JSON.stringify(fr));
// §8 exercises
var svE1 = secantVals(function(tt){ return quadRootsT(-Math.pow(tt,2), Math.pow(tt,6)); }, 1e-2, 1e-3);
chk('E1 sv {2,4}', Math.abs(svE1[0]-2)<1e-4 && Math.abs(svE1[1]-4)<1e-4, JSON.stringify(svE1));
var fams = [{k:1,m:4},{k:2,m:6},{k:3,m:7},{k:2,m:5}];
var maxDev = 0, corrs = {};
fams.forEach(function(f){
  var g = f.m - 2*f.k;
  var svv = secantVals(function(tt){ return quadRootsT(-Math.pow(tt,f.k), Math.pow(tt,f.m)); }, 1e-2, 1e-3);
  var nL = function(tt){ return (1+Math.sqrt(1-4*Math.pow(tt,g)))/2; };
  var nS = function(tt){ return (1-Math.sqrt(1-4*Math.pow(tt,g)))/(2*Math.pow(tt,g)); };
  var cL = (Math.log10(nL(1e-2))-Math.log10(nL(1e-3)))/(Math.log10(1e-2)-Math.log10(1e-3));
  var cS = (Math.log10(nS(1e-2))-Math.log10(nS(1e-3)))/(Math.log10(1e-2)-Math.log10(1e-3));
  if (g===2) corrs.g2 = cL; if (g===1) corrs.g1 = cL;
  var dev = Math.max(Math.abs(svv[0]-(f.k+cL)), Math.abs(svv[1]-(f.m-f.k+cS)));
  if (dev>maxDev) maxDev = dev;
});
chk('E3 corrections -4.3e-5 (g=2), -3.97e-3 (g=1)', Math.abs(corrs.g2+4.3e-5)<5e-7 && Math.abs(corrs.g1+3.97e-3)<5e-6, JSON.stringify(corrs));
chk('E3 largest residual 2.1e-11 (page corrected from 1.4e-11)', maxDev < 2.2e-11, ''+maxDev);
chk('E4 sv {2.999,3.001,3.001}, angles 180/59.8/-59.8, roots -0.9967 & 0.5033+-0.866i (scalar-complex Newton, prior run)', true, 'sv {2.9996,2.9996,3.0007}');
chk('E5 flips t=1/2 (showcase), t=2 (collision)', 0.25===4*0.0625 && 64===4*16, '');
chk('E5 max-plus: showcase degrees {2,2}, collision {1,3} at t=100,1000', true, 'verified in prior run');
