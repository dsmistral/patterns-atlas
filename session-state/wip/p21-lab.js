// P21 lab battery - session S55, page p21-limit-point.html.
// Deterministic engine, fresh this session; shares no code with the review verifier.
// The sandbox blocks eval, so pieces were executed piecewise as inline bodies;
// the honest run history is recorded in p21-lab-output.txt.
var PASS, FAILS, REP;
function ck(name, ok) { if (ok) PASS++; else { FAILS++; REP.push("FAIL " + name); } }
function f6(x) { return x.toFixed(6); }
function pieceA() { // the card, the rule, collisions, fig P21.1
  PASS=0; FAILS=0; REP=[];
  var hit = function(n) { return (n%2===1) ? 1/3 + 1/(2*n+2) : 2/3 - 1/(2*n+2); };
  var card = ["0.583333","0.500000","0.458333","0.566667","0.416667","0.595238","0.395833","0.611111","0.383333","0.621212","0.375000","0.628205","0.369048","0.633333","0.364583","0.637255"];
  for (var n=1; n<=16; n++) ck("card"+n, f6(hit(n))===card[n-1]);
  var ok17=true; for (n=17; n<=100; n++) { var v=hit(n); if (!(v>1/3 && v<2/3)) ok17=false; }
  ck("rule-range-17to100", ok17);
  var seen=new Set(), dupX=false;
  for (n=1; n<=10000; n++) { if (seen.has(hit(n))) dupX=true; seen.add(hit(n)); }
  ck("distinct-exact-10000", !dupX);
  var pairs=[[1,9],[3,3],[9,1]], allFail=true;
  for (var p=0;p<3;p++) { var M=pairs[p][0]+3, N=pairs[p][1]+3; if (N%4===0 && M%4===2) allFail=false; }
  ck("collision-factor-pairs-fail", allFail);
  var pairOk=false;
  for (var i=1;i<=5&&!pairOk;i++) for (var j=i+1;j<=5;j++) if (Math.abs(hit(i)-hit(j))<0.25) pairOk=true;
  ck("five-hit-pigeonhole", pairOk);
  var inWin=true;
  for (n=5;n<=100000;n++) { var v2=hit(n); if (!(Math.abs(v2-1/3)<0.1 || Math.abs(v2-2/3)<0.1)) { inWin=false; break; } }
  ck("hits5plus-in-windows-100k", inWin);
  var ticks=[296.7,260,241.7,289.3,223.3,301.9,214.2,308.9,208.7,313.3,205,316.4,202.4,318.7,200.4,320.4];
  var fig1=true;
  for (n=1;n<=16;n++) { var px=Math.round((40+440*hit(n))*10)/10; if (px!==ticks[n-1]) fig1=false; }
  ck("fig1-tick-coords", fig1);
  var wl=Math.round((40+440*(1/3-0.1))*10)/10, wr=Math.round((40+440*(2/3-0.1))*10)/10;
  ck("fig1-window-rects", wl===142.7 && wr===289.3 && 440*0.2===88);
  return "pieceA "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceB() { // left-rule machine tree, annotations, eps-windows, fig P21.2
  PASS=0; FAILS=0; REP=[];
  var hit=function(n){ return (n%2===1)?1/3+1/(2*n+2):2/3-1/(2*n+2); };
  var loIn=function(lo,hi){ if(lo<=1/3&&1/3<hi) return true; if(lo<2/3&&2/3<=hi) return true; return false; };
  var cnt=function(lo,hi){ var c=0; for(var n=1;n<=20000;n++){ var v=hit(n); if(v>=lo&&v<=hi)c++; } return c; };
  var tree=[[0,1/2],[1/4,1/2],[1/4,3/8],[5/16,3/8],[5/16,11/32],[21/64,11/32]];
  var lo=0, hi=1, path=[];
  for (var d=0; d<6; d++) {
    var m=(lo+hi)/2, li=loIn(lo,m), ri=loIn(m,hi);
    if (li&&ri) { hi=m; path.push("L(tie)"); } else if (li) { hi=m; path.push("L"); } else { lo=m; path.push("R"); }
    ck("treeD"+(d+1), Math.abs(lo-tree[d][0])<1e-12 && Math.abs(hi-tree[d][1])<1e-12);
  }
  ck("tree-keeps-sequence", path.join(",")==="L(tie),R,L,R,L,R");
  ck("catch-is-1/3", lo<=1/3 && 1/3<=hi && Math.abs(hi-lo-1/64)<1e-12);
  ck("D2-left-zero", cnt(0,1/4)===0);
  ck("D3-right-exactly6", cnt(3/8,1/2)===6);
  ck("D4-left-zero", cnt(1/4,5/16)===0);
  ck("D5-right-exactly19", cnt(11/32,3/8)===19);
  ck("D6-left-zero", cnt(5/16,21/64)===0);
  var w05=true;
  for (var n=11; n<=4001; n+=2) { if (!(Math.abs(hit(n)-1/3)<0.05)) { w05=false; break; } }
  ck("eps05-holds-every-odd-from-11th", w05 && Math.abs(hit(9)-1/3)>=0.05-1e-12);
  var w001=true;
  for (n=501; n<=5999; n+=2) { if (!(Math.abs(hit(n)-1/3)<0.001)) { w001=false; break; } }
  ck("eps001-holds-every-odd-from-500th", w001 && Math.abs(hit(499)-1/3)>=0.001-1e-12);
  var we=true; for (n=10;n<=4000;n+=2){ if(!(Math.abs(hit(n)-2/3)<0.05)){we=false;break;} }
  ck("eps05-holds-every-even-from-10th", we);
  var px=function(v){ return Math.round((40+440*v)*10)/10; };
  var rows=[[0,1],[0,1/2],[1/4,1/2],[1/4,3/8],[5/16,3/8],[5/16,11/32],[21/64,11/32]];
  var fig2=[[40,480],[40,260],[150,260],[150,205],[177.5,205],[177.5,191.3],[184.4,191.3]];
  var fig2ok=true;
  for (var i=0;i<7;i++) { if (px(rows[i][0])!==fig2[i][0]||px(rows[i][1])!==fig2[i][1]) fig2ok=false; }
  ck("fig2-row-coords", fig2ok && px(1/3)===186.7);
  return "pieceB "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceC() { // right-rule tree, crowd audit, Exhibit A window facts
  PASS=0; FAILS=0; REP=[];
  var hit=function(n){ return (n%2===1)?1/3+1/(2*n+2):2/3-1/(2*n+2); };
  var loIn=function(lo,hi){ if(lo<=1/3&&1/3<hi) return true; if(lo<2/3&&2/3<=hi) return true; return false; };
  var cnt=function(lo,hi){ var c=0; for(var n=1;n<=20000;n++){ var v=hit(n); if(v>=lo&&v<=hi)c++; } return c; };
  var rtree=[[1/2,1],[1/2,3/4],[5/8,3/4],[5/8,11/16],[21/32,11/16],[21/32,43/64]];
  var lo=0, hi=1, path=[];
  for (var d=0; d<6; d++) {
    var m=(lo+hi)/2, li=loIn(lo,m), ri=loIn(m,hi);
    if (li&&ri) { lo=m; path.push("R(tie)"); } else if (ri) { lo=m; path.push("R"); } else { hi=m; path.push("L"); }
    ck("rtreeD"+(d+1), Math.abs(lo-rtree[d][0])<1e-12 && Math.abs(hi-rtree[d][1])<1e-12);
  }
  ck("rtree-keeps-sequence", path.join(",")==="R(tie),L,R,L,R,L");
  ck("rcatch-is-2/3-width-1over64", lo<=2/3 && 2/3<=hi && Math.abs(hi-lo-1/64)<1e-12);
  ck("D2-right-zero-hits", cnt(3/4,1)===0);
  ck("window-1over3-infinitely", (1/(2*11+2))<0.05 && (1/(2*500001+2))<0.000001);
  ck("window-2over3-infinitely", (1/(2*10+2))<0.05 && (1/(2*500002+2))<0.000001);
  var samples=[0.1,0.2,0.3,0.4,0.45,0.5,0.55,0.6,0.7,0.8,0.9,0.99];
  for (var s=0;s<samples.length;s++) {
    var x=samples[s], dmin=Math.min(Math.abs(x-1/3),Math.abs(x-2/3)), r=dmin/2, c=0;
    for (var n=1;n<=20000;n++){ var v=hit(n); if (Math.abs(v-x)<r) c++; }
    ck("quiet-window-x"+x, c<100);
  }
  var limOk=true;
  for (n=1;n<=100000;n++){ var v2=hit(n); var dm=Math.min(Math.abs(v2-1/3),Math.abs(v2-2/3)); if (dm>1/3-1e-9) limOk=false; }
  ck("hits-approach-crowd-only", limOk);
  ck("exA-window-around-0-infinite", (1/1001)<0.001 && (1/1000001)<0.000001 && (1/11)<0.1);
  return "pieceC "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceD1() { // EVT: trap table cells, f(1.25), monotone climb, margins
  PASS=0; FAILS=0; REP=[];
  var f=function(x){ return Math.sin(x)+Math.sin(Math.SQRT2*x); };
  var dp=function(x){ return Math.cos(x)+Math.SQRT2*Math.cos(Math.SQRT2*x); };
  var scan=function(lo,hi){ var b=-1e9; for(var x=lo;x<=hi+1e-15;x+=1e-6){ var v=f(x); if(v>b)b=v; } return b; };
  var f4=function(x){ return x.toFixed(4); };
  var s1L=scan(0,5), s1R=scan(5,10), s2L=scan(0,2.5), s2R=scan(2.5,5), s3L=scan(0,1.25), s3R=scan(1.25,2.5), s4L=scan(1.25,1.875), s4R=scan(1.875,2.5);
  ck("L1L", f4(s1L)==="1.9299"); ck("L1R", f4(s1R)==="0.6908");
  ck("L2L", f4(s2L)==="1.9299"); ck("L2R", f4(s2R)==="0.2146");
  ck("L3L", f4(s3L)==="1.9296"); ck("L3R", f4(s3R)==="1.9299");
  ck("L4L", f4(s4L)==="1.9299"); ck("L4R", f4(s4R)==="1.4247");
  ck("f125", f(1.25).toFixed(8)==="1.92964854");
  var minD=1e9; for (var x=0;x<=1.25;x+=1e-4){ if(dp(x)<minD)minD=dp(x); }
  ck("monotone-0-to-125", minD>0.03);
  ck("L3-margin", Math.abs((s3R-s3L)-0.000255571)<5e-7);
  ck("L3-printed-margin-3ten-thousandths", Math.abs((Number(f4(s3R))-Number(f4(s3L))-0.0003))<1e-12);
  var s5L=scan(1.25,1.5625), s5R=scan(1.5625,1.875);
  ck("L5-keep", s5L>s5R && f4(s5L)==="1.9299");
  return "pieceD1 "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceD2() { // EVT: golden-section decoy, peak census, x*, path, gaps
  PASS=0; FAILS=0; REP=[];
  var f=function(x){ return Math.sin(x)+Math.sin(Math.SQRT2*x); };
  var dp=function(x){ return Math.cos(x)+Math.SQRT2*Math.cos(Math.SQRT2*x); };
  var phi=(Math.sqrt(5)-1)/2, a=0, b=10, c=b-phi*(b-a), d2=a+phi*(b-a);
  for (var i=0;i<100;i++){ if (f(c)>f(d2)) { b=d2; d2=c; c=b-phi*(b-a); } else { a=c; c=d2; d2=a+phi*(b-a); } }
  var gsx=(a+b)/2;
  ck("gs-stop", gsx.toFixed(3)==="6.097" && f(gsx).toFixed(6)==="0.533858");
  ck("decoy-6.097-reading", f(6.097).toFixed(6)==="0.533858");
  var prev=dp(0), cps=[];
  for (var x=1e-4;x<=10;x+=1e-4){ var cur=dp(x); if (prev>0 && cur<=0) cps.push(x); prev=cur; }
  var refine=function(x0){ var a2=x0-2e-4, b2=x0+2e-4; for (var j=0;j<60;j++){ var m=(a2+b2)/2; if (dp(m)>0) a2=m; else b2=m; } return (a2+b2)/2; };
  var locs=cps.map(refine);
  ck("three-local-peaks", locs.length===3 && locs[0].toFixed(3)==="1.263" && locs[1].toFixed(3)==="6.097" && locs[2].toFixed(3)==="9.441");
  ck("peak-values", f(locs[0]).toFixed(6)==="1.929904" && f(locs[1]).toFixed(6)==="0.533858" && f(locs[2]).toFixed(6)==="0.690759");
  var x0=1, x1=1.5;
  for (i=0;i<80;i++){ var m2=(x0+x1)/2; if (dp(m2)>0) x0=m2; else x1=m2; }
  var xs=(x0+x1)/2;
  ck("xstar-10dp", xs.toFixed(10)==="1.2632578175");
  ck("fxstar-9dp", f(xs).toFixed(9)==="1.929904111");
  ck("walls-34", (10/Math.pow(2,34)).toExponential(2)==="5.82e-10");
  var scan5=function(lo,hi){ var bb=-1e9; for(var x=lo;x<=hi+1e-15;x+=1e-5){ var v=f(x); if(v>bb)bb=v; } return bb; };
  var rooms=[], lo2=0, hi2=10;
  for (var dd=0; dd<6; dd++) { rooms.push(lo2.toFixed(4)+","+hi2.toFixed(4)); var mm=(lo2+hi2)/2; if (scan5(lo2,mm)>=scan5(mm,hi2)) hi2=mm; else lo2=mm; }
  ck("path-first6", rooms.join("|")==="0.0000,10.0000|0.0000,5.0000|0.0000,2.5000|1.2500,2.5000|1.2500,1.8750|1.2500,1.5625");
  ck("gap-runnerup", (f(xs)-f(locs[2])).toFixed(6)==="1.239145");
  ck("gap-decoy", (f(xs)-f(locs[1])).toFixed(6)==="1.396047");
  return "pieceD2 "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceEF() { // IVT bisection table, rho, Exhibits A/B/C, fig P21.3
  PASS=0; FAILS=0; REP=[];
  var g=function(x){ return x*x*x-x-1; };
  var lo=1, hi=2, rows=[];
  for (var d=0; d<6; d++) {
    var m=(lo+hi)/2, v=g(m);
    rows.push(m.toFixed(6)+"/"+v.toFixed(6)+"/"+(v>0?"L":"R"));
    if (v>0) hi=m; else lo=m;
  }
  ck("bis-rows", rows.join("|")==="1.500000/0.875000/L|1.250000/-0.296875/R|1.375000/0.224609/L|1.312500/-0.051514/R|1.343750/0.082611/L|1.328125/0.014576/L");
  ck("f1-f2", g(1)===-1 && g(2)===5);
  ck("walls-40", Math.pow(2,-40).toExponential(2)==="9.09e-13");
  var a=1, b=2;
  for (var i=0;i<60;i++){ var mm=(a+b)/2; if (g(mm)>0) b=mm; else a=mm; }
  var rho=(a+b)/2;
  ck("rho-10dp", rho.toFixed(10)==="1.3247179572");
  ck("rho3-equals-rho-plus-1", (rho*rho*rho).toFixed(10)==="2.3247179572" && (rho+1).toFixed(10)==="2.3247179572");
  var c=0, first=0, last=0;
  for (var n=1;n<=20000;n++){ var v=1/n; if (v>0.05 && v<0.15){ c++; if(!first)first=n; last=n; } }
  ck("exA-window-13-hits", c===13 && first===7 && last===19);
  var two=false;
  for (var k=0;k<=99 && !two;k++){
    var c1=k, c2=k+0.5, cA=0, cB=0;
    for (n=1;n<=100;n++){ if (Math.abs(n-c1)<0.5) cA++; if (Math.abs(n-c2)<0.5) cB++; }
    if (cA>1 || cB>1) two=true;
  }
  ck("exB-no-two-hits", !two);
  var gg=function(x){ return x<0.5 ? x : 0; };
  var best=-1, bx=-1;
  for (var kk=0;kk<=1000000;kk++){ var x=kk/1000000, val=gg(x); if (val>best){ best=val; bx=x; } }
  ck("exC-sweep-best", best.toFixed(6)==="0.499999" && bx.toFixed(6)==="0.499999");
  var supOk=true; for (kk=0;kk<=100000;kk++){ var x2=kk/100000; if (gg(x2)>=0.5) supOk=false; }
  ck("exC-sup-unattained", supOk);
  var px=function(v){ return Math.round((40+440*v)*10)/10; };
  var fig3=[480,260,186.7,150,128,113.3,102.9,95,88.9,84,80,76.7];
  var fig3ok=true;
  for (n=1;n<=12;n++){ if (px(1/n)!==fig3[n-1]) fig3ok=false; }
  ck("fig3-tick-coords", fig3ok);
  return "pieceEF "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceG() { // Exercise 2 record, Exercise 3 tax, level-4 room
  PASS=0; FAILS=0; REP=[];
  var b=function(n){ return 1/2 + ((n%2===0)?1:-1)/(2*n); };
  var first8=["0.000000","0.750000","0.333333","0.625000","0.400000","0.583333","0.428571","0.562500"];
  var ok8=true;
  for (var n=1;n<=8;n++) if (b(n).toFixed(6)!==first8[n-1]) ok8=false;
  ck("ex2-first8", ok8);
  var closed=[], open=[];
  for (n=1;n<=20000;n++){ var v=b(n); if (Math.abs(v-0.6)<=0.05+1e-12) closed.push(n); if (v>0.55+1e-12 && v<0.65-1e-12) open.push(n); }
  ck("ex2-closed-window-4hits", closed.length===4 && closed.join(",")==="4,6,8,10" && Math.abs(b(10)-0.55)<1e-12);
  ck("ex2-open-window-3hits", open.length===3 && open.join(",")==="4,6,8");
  var never=true; for (n=1;n<=100000;n++) if (b(n)===0.5) never=false;
  ck("ex2-half-never-hit", never);
  var bIn=function(lo,hi){ return (lo<=0.5 && 0.5<hi); };
  var rules=["L","R"];
  for (var rr=0; rr<2; rr++) {
    var lo=0, hi=1, caught=true;
    for (var d=0; d<30; d++) {
      var m=(lo+hi)/2, li=bIn(lo,m), ri=bIn(m,hi);
      if (li&&ri) { if (rules[rr]==="L") hi=m; else lo=m; }
      else if (li) hi=m; else if (ri) lo=m; else { caught=false; break; }
    }
    ck("ex2-"+rules[rr]+"-rule-catches-half", caught && lo<=0.5 && 0.5<=hi && hi-lo<1e-8);
  }
  var cntL=0, cntR=0; for (n=1;n<=10000;n++){ var v2=b(n); if (v2<0.5) cntL++; else cntR++; }
  ck("ex2-level1-tie-even-split", cntL===5000 && cntR===5000);
  ck("ex3-tax-n4", Math.pow(2,-4)*Math.SQRT2<0.1 && Math.pow(2,-3)*Math.SQRT2>0.1);
  ck("ex3-diagonals", (Math.pow(2,-4)*Math.SQRT2).toFixed(4)==="0.0884" && (Math.pow(2,-3)*Math.SQRT2).toFixed(3)==="0.177");
  ck("ex1-level4-room", Math.abs(5/16-0.3125)<1e-15 && Math.abs(3/8-0.375)<1e-15);
  return "pieceG "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
// Runner (for environments that can load this file directly):
// pieceA(); pieceB(); pieceC(); pieceD1(); pieceD2(); pieceEF(); pieceG();
// In session S55 the pieces were executed piecewise as inline sandbox bodies;
// every final-revision piece passed all checks. Honest history: p21-lab-output.txt.
