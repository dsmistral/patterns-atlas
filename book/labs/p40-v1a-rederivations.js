// P40 V1a v3 — independent rederivations, zero shared code with labs A–F.
// GREEN 5/5, run 2026-11-11 (run_typescript sandbox, deterministic, no eval/recursion/BigInt).
// History: v1 had two checker bugs (wrong secant pairing in corner detector; absolute tol on
// product identity); v2 grid-slope heuristic replaced by winner-switch detection; v3 green.
var results = [];
function chk(name, cond, detail){ results.push({name:name, ok:!!cond, detail:detail||''}); }
// 1. corners of min(2x, 1+x, 4) by winner-switch detection on a fine grid
var winners = [];
for (var s = 0; s <= 6000; s++){
  var x = s*6/6000 - 1;
  var w = [2*x, 1+x, 4];
  var wi = 0;
  if (w[1] < w[wi]) wi = 1;
  if (w[2] < w[wi]) wi = 2;
  winners.push({x:x, w:wi});
}
var corners = [];
for (var q = 1; q < winners.length; q++){
  if (winners[q].w !== winners[q-1].w){
    var xc = (winners[q].x + winners[q-1].x)/2;
    if (!corners.some(function(cc){ return Math.abs(cc-xc) < 0.01; })) corners.push(+xc.toFixed(4));
  }
}
chk('corners of min(2x,1+x,4) = {1,3}', corners.length===2 && Math.abs(corners[0]-1)<0.005 && Math.abs(corners[1]-3)<0.005, JSON.stringify(corners));
// 2. Dijkstra APSP == tropical closure, all 25 cells
var INF = 1e9;
var W = [[0,3,8,INF,INF],[2,0,INF,5,INF],[INF,INF,0,2,7],[INF,4,INF,0,1],[INF,INF,INF,INF,0]];
function dijkstra(src){
  var d = [], done = [], i;
  for (i=0;i<5;i++){ d.push(W[src][i]); done.push(false); }
  for (var n=0;n<5;n++){
    var u = -1, best = INF;
    for (i=0;i<5;i++) if (!done[i] && d[i]<best){ best=d[i]; u=i; }
    if (u<0) break; done[u]=true;
    for (i=0;i<5;i++) if (W[u][i]+d[u] < d[i]) d[i] = W[u][i]+d[u];
  }
  return d;
}
function trop(A,B){ var R=[],i,j,k; for (i=0;i<5;i++){R.push([]); for (j=0;j<5;j++){ var m=INF; for (k=0;k<5;k++) if (A[i][k]+B[k][j]<m) m=A[i][k]+B[k][j]; R[i].push(m);} } return R; }
var C = W;
for (var n2=0;n2<5;n2++){ var N = trop(W,C); if (JSON.stringify(N)===JSON.stringify(C)) break; C = N; }
var djOk = true;
for (var i2=0;i2<5;i2++){ var dd = dijkstra(i2); for (var j2=0;j2<5;j2++) if (dd[j2]!==C[i2][j2]) djOk=false; }
chk('Dijkstra APSP == tropical closure, all 25 cells', djOk, '');
// 3. tie case x^2 - 2t^2 x + t^4 = (x - t^2)^2: Vieta identities exact
var tt = 1e-2, b = -2*tt*tt, c = Math.pow(tt,4);
var r1 = (-b + Math.sqrt(b*b-4*c))/2, r2 = (-b - Math.sqrt(b*b-4*c))/2;
chk('tie case Vieta: r1+r2 = 2t^2, r1*r2 = t^4 exactly', r1+r2 === 2*tt*tt && r1*r2 === Math.pow(tt,4), 'prod err '+(r1*r2-Math.pow(tt,4)));
// 4. collision x^2 - t^3 x + t^4: closed-form degrees {2,2} at 4 scales
var degs = [1e-2,1e-3,1e-4,1e-5].map(function(T){
  var d2 = Math.pow(T,6)-4*Math.pow(T,4);
  var mod = d2<0 ? Math.sqrt(Math.pow(T,4)) : null;
  return Math.log(mod)/Math.log(T);
});
chk('collision degrees {2,2} at 4 scales (closed form)', degs.every(function(v){ return Math.abs(v-2)<1e-12; }), JSON.stringify(degs));
// 5. showcase exact closed form valuations -> {1,3} at 4 scales
var vals = [1e-2,1e-3,1e-4,1e-5].map(function(T){
  var big = T*(1+Math.sqrt(1-4*T*T))/2;
  return [Math.log(big)/Math.log(T), Math.log(Math.pow(T,4)/big)/Math.log(T)];
});
chk('showcase exact valuations -> {1,3}', vals.every(function(p){ return Math.abs(p[0]-1)<5e-5 && Math.abs(p[1]-3)<5e-5; }), JSON.stringify(vals));
