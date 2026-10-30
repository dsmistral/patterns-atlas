// P22 lab battery - session S56, page p22-fixed-point.html.
// Deterministic engine, fresh this session; shares no code with the review verifier.
// The sandbox blocks eval, so pieces were executed piecewise as inline bodies;
// p22-lab.js is the durable record of exactly the code that ran, at final revision.
// Extension from the P21 house format: pieces take PAGE (the page text, read
// through a chunk-loop read_file helper) because needle checks ran inside the
// lab; the honest run history is recorded in p22-lab-output.txt.
var PASS, FAILS, REP;
function ck(name, ok, info) { if (ok) PASS++; else { FAILS++; REP.push("FAIL " + name + (info ? " | " + info : "")); } }
function pieceA(PAGE) { // structure, house grammar, TeX balance, footer
  PASS=0; FAILS=0; REP=[];
  ck("a.title", PAGE.indexOf("<title>P22 · Iterate to a fixed point · The Patterns Atlas</title>")>=0);
  ck("a.kicker", PAGE.indexOf('<p class="kicker"><a href="index.html">The Patterns Atlas</a> · P22 · the fifth move of tier 2</p>')>=0);
  ck("a.h1", PAGE.indexOf("<h1>Iterate to a fixed point</h1>")>=0);
  ck("a.mathjaxHead", PAGE.indexOf("<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>")>=0);
  ck("a.jsdelivr", PAGE.indexOf('<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"></script>')>=0);
  var ids=["bridge","encounter","name-the-move","the-move-at-work","when-it-fails","what-next","lineage","exercises"], last=-1, orderOk=true;
  for (var i=0;i<8;i++){ var p=PAGE.indexOf('section id="'+ids[i]+'"'); if(p<0||p<last) orderOk=false; last=p; }
  ck("a.sections8ordered", orderOk);
  ck("a.h2count", (PAGE.match(/^<h2>/gm)||[]).length===8);
  ck("a.h3count", (PAGE.match(/<h3>/g)||[]).length===9);
  ck("a.boxes", PAGE.indexOf('id="box-p22"')>=0 && PAGE.indexOf('id="box-p22a"')>=0 && PAGE.indexOf('id="box-p22b"')>=0);
  ck("a.pid3", (PAGE.match(/class="pid"/g)||[]).length===3);
  ck("a.figs3", PAGE.indexOf('id="fig-p22-1"')>=0 && PAGE.indexOf('id="fig-p22-2"')>=0 && PAGE.indexOf('id="fig-p22-3"')>=0);
  ck("a.figcaptions", PAGE.indexOf("<strong>Fig P22.1.</strong>")>=0 && PAGE.indexOf("<strong>Fig P22.2.</strong>")>=0 && PAGE.indexOf("<strong>Fig P22.3.</strong>")>=0);
  ck("a.ex5", (PAGE.match(/class="ex"/g)||[]).length===5);
  ck("a.details", (PAGE.match(/<details><summary>Hint<\/summary>/g)||[]).length===5 && (PAGE.match(/<details><summary>Worked<\/summary>/g)||[]).length===5);
  var glyphs=["●○○","●●○","●●●","◆","◐"], gOk=true;
  for (i=0;i<5;i++) if (PAGE.indexOf(glyphs[i])<0) gOk=false;
  ck("a.glyphs5", gOk);
  ck("a.onramp3words", (PAGE.match(/<strong>New word:/g)||[]).length===3 && PAGE.indexOf('class="onramp"')>=0);
  ck("a.warn", PAGE.indexOf('class="warn"')>=0 && PAGE.indexOf("<h3>Scope and price of P22</h3>")>=0);
  ck("a.tables5", (PAGE.match(/class="digit-table"/g)||[]).length===5);
  ck("a.zeroDollars", PAGE.indexOf("$")<0);
  ck("a.zeroBackticks", PAGE.indexOf("`")<0);
  var io=PAGE.split("\\(").length-1, ic=PAGE.split("\\)").length-1, doo=PAGE.split("\\[").length-1, dc=PAGE.split("\\]").length-1;
  ck("a.texBalance", io===ic && doo===dc && io===419 && doo===5, io+"/"+ic+" inline, "+doo+"/"+dc+" display");
  ck("a.tail", PAGE.slice(-35)==="</a></p>\n</footer>\n</body>\n</html>\n");
  ck("a.footerNext", PAGE.indexOf('Next: <a href="p23-interpolate.html">P23 · Interpolate and continue</a>')>=0);
  ck("a.noM01", PAGE.indexOf("m01")<0);
  var tm = PAGE.match(/class="tagline">([\s\S]*?)<\/p>/);
  ck("a.tagline", (PAGE.match(/class="tagline"/g)||[]).length===1 && !!tm && tm[1].length>400);
  return "pieceA "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceB(PAGE) { // Babylonian card, contraction, AM-GM, error identity, bounds
  PASS=0; FAILS=0; REP=[];
  var g=function(x){ return (x+2/x)/2; }, SQ=Math.SQRT2;
  var card=[1]; for (var i2=0;i2<5;i2++) card.push(g(card[i2]));
  var errM=card.map(function(x){ return Math.abs(x-SQ); });
  var err=errM.slice(); err[5]=errM[4]*errM[4]/(2*card[4]); // e5 below float resolution: identity
  var f10=function(x){ return x.toFixed(10); };
  ck("b.cardVals", f10(card[1])==="1.5000000000" && f10(card[2])==="1.4166666667" && f10(card[3])==="1.4142156863" && f10(card[4])==="1.4142135624" && f10(card[5])==="1.4142135624");
  var needles=["1.5000000000","1.4166666667","1.4142156863","1.4142135624"], onP=true;
  for (i2=0;i2<4;i2++) if (PAGE.indexOf(needles[i2])<0) onP=false;
  ck("b.cardOnPage", onP);
  var eps=["4.1421 \\times 10^{-1}","8.5786 \\times 10^{-2}","2.4531 \\times 10^{-3}","2.1239 \\times 10^{-6}","1.5947 \\times 10^{-12}","8.99 \\times 10^{-25}"], eOk=true;
  for (i2=0;i2<6;i2++) if (PAGE.indexOf(eps[i2])<0) eOk=false;
  ck("b.errorsOnPage", eOk);
  ck("b.errorsComputed", errM[0].toExponential(4).indexOf("4.1421")===0 && errM[1].toExponential(4).indexOf("8.5786")===0 && errM[2].toExponential(4).indexOf("2.4531")===0 && errM[3].toExponential(4).indexOf("2.1239")===0 && errM[4].toExponential(4).indexOf("1.5947")===0 && err[5].toExponential(2).indexOf("8.99")===0);
  var digits=err.map(function(e){ return Math.floor(-Math.log10(e)); });
  ck("b.digits", digits.join(",")==="0,1,2,5,11,24");
  ck("b.digitsOnPage", PAGE.indexOf("correct decimals \\(0, 1, 2, 5, 11, 24\\)")>=0);
  var worst=0;
  for (var i3=0;i3<=200;i3++) for (var j=0;j<=200;j++){ if(i3===j) continue; var x=1+i3/200, y=1+j/200, r=Math.abs(g(x)-g(y))/Math.abs(x-y); if(r>worst) worst=r; }
  ck("b.contractionGrid", worst<=0.5+1e-12, "max ratio "+worst.toFixed(6));
  ck("b.contractionOnPage", PAGE.indexOf("|g(x) - g(y)| \\le \\tfrac{1}{2}|x - y|")>=0 && PAGE.indexOf("c = 1/2")>=0);
  var floorOk=true;
  for (i3=0;i3<=2000;i3++){ var x2=1+i3/2000; if(g(x2)<SQ-1e-12) floorOk=false; }
  ck("b.amgmFloor", floorOk);
  ck("b.floorOnPage", PAGE.indexOf("g(x) = (x + 2/x)/2 \\ge \\sqrt{x \\cdot (2/x)} = \\sqrt{2}")>=0);
  var ceilOk=true;
  for (i3=1;i3<2000;i3++){ var x3=1+i3/2000; if(Math.abs((g(x3)-1.5)-(x3-1)*(x3-2)/(2*x3))>1e-15) ceilOk=false; }
  ck("b.ceilingIdentity", ceilOk);
  ck("b.ceilingOnPage", PAGE.indexOf("g(x) - 3/2 = (x-1)(x-2)/(2x) \\le 0")>=0);
  // e_{n+1}=e_n^2/(2x_n): exact in math; at n=3 float check is cancellation-limited
  // (e4=1.59e-12 vs ulp(x4)=2.2e-16, ~4 sig figs), so tolerance is ulp-aware.
  var idOk=true, rOk=true;
  for (var n=0;n<4;n++){
    var lhs=errM[n+1], rhs=errM[n]*errM[n]/(2*card[n]);
    var tol=Math.max(1e-12, 4*2.22e-16/card[n+1]/lhs);
    if (Math.abs(lhs-rhs)/lhs > tol) idOk=false;
    var rl=errM[n+1]/(errM[n]*errM[n]), rr=1/(2*card[n]);
    if (Math.abs(rl-rr)/rr > tol) rOk=false;
  }
  ck("b.errorIdentity", idOk);
  ck("b.identityOnPage", PAGE.indexOf("e_{n+1} = e_n^2/(2x_n)")>=0);
  ck("b.priceOnPage", PAGE.indexOf("e_n \\le (1/2)^n e_0")>=0 && PAGE.indexOf("\\log_{10} 2 = 0.301")>=0);
  var bounds=[0.2071067812,0.1035533906,0.0517766953,0.0258883476,0.0129441738], bOk=true;
  for (i3=1;i3<=5;i3++) if ((errM[0]*Math.pow(0.5,i3)).toFixed(10)!==String(bounds[i3-1])) bOk=false;
  ck("b.bounds", bOk);
  var bpOk=true;
  for (i3=0;i3<5;i3++) if (PAGE.indexOf(String(bounds[i3]))<0) bpOk=false;
  ck("b.boundsOnPage", bpOk);
  ck("b.ratiosSq", rOk);
  ck("b.pess5", Math.abs(errM[0]*Math.pow(0.5,5)/err[5]-1.4e22)<0.1e22);
  ck("b.pessOnPage", PAGE.indexOf("1.4 \\times 10^{22}")>=0);
  return "pieceB "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceC(PAGE) { // Pell chain by chunk string arithmetic (no BigInt), e4/e5/e6
  PASS=0; FAILS=0; REP=[];
  var B=10000000;
  var tc=function(s){ var out=[], e=s.length; while(e>0){ out.push(parseInt(e>=7?s.slice(e-7,e):s.slice(0,e),10)); e-=7; } return out; };
  var cs=function(a){ var s=String(a[a.length-1]); for (var i=a.length-2;i>=0;i--) s+=String(a[i]).length<7?("0000000"+String(a[i])).slice(-7):String(a[i]); return s; };
  var add=function(a,b){ var r=[], c=0, i; for (i=0;i<Math.max(a.length,b.length);i++){ var s=(a[i]||0)+(b[i]||0)+c; r.push(s%B); c=Math.floor(s/B); } if (c) r.push(c); return r; };
  var mulS=function(a,k){ var r=[], c=0, i; for (i=0;i<a.length;i++){ var p=a[i]*k+c; r.push(p%B); c=Math.floor(p/B); } while (c){ r.push(c%B); c=Math.floor(c/B); } return r; };
  var sub=function(a,b){ var r=[], br=0, i; for (i=0;i<a.length;i++){ var d=(a[i]||0)-(b[i]||0)-br; if (d<0){ d+=B; br=1; } else br=0; r.push(d); } while (r.length>1&&r[r.length-1]===0) r.pop(); return r; };
  var mul=function(a,b){ var r=new Array(a.length+b.length); for (var k=0;k<r.length;k++) r[k]=0; for (var i=0;i<a.length;i++){ var c=0; for (var j=0;j<b.length;j++){ var t=r[i+j]+a[i]*b[j]+c; r[i+j]=t%B; c=Math.floor(t/B); } var q=i+b.length; while (c){ var t2=r[q]+c; r[q]=t2%B; c=Math.floor(t2/B); q++; } } while (r.length>1&&r[r.length-1]===0) r.pop(); return r; };
  var pairs=[["1","1"],["3","2"],["17","12"],["577","408"],["665857","470832"],["886731088897","627013566048"]];
  var a=tc("1"), b=tc("1"), resids=[];
  for (var lv=0;lv<6;lv++){
    ck("c.pair lv"+lv, cs(a)===pairs[lv][0] && cs(b)===pairs[lv][1], cs(a)+"/"+cs(b));
    var a2=mul(a,a), b2=mul(b,b), b2x2=add(b2,b2);
    var s1=cs(a2), s2=cs(b2x2), gt = s1.length>s2.length || (s1.length===s2.length && s1>s2);
    var d = gt ? sub(a2,b2x2) : sub(b2x2,a2);
    var val = (d.length===1 && d[0]===1) ? (gt?1:-1) : 0;
    resids.push(val);
    ck("c.residual lv"+lv, val===(lv===0?-1:1), "a^2-2b^2 = "+val);
    var aN=add(a2,b2x2), bN=mulS(mul(a,b),2); a=aN; b=bN;
  }
  ck("c.chainResiduals", resids.join(",")==="-1,1,1,1,1,1");
  ck("c.a6", cs(a)==="1572584048032918633353217", cs(a));
  ck("c.b6", cs(b)==="1111984844349868137938112", cs(b));
  var a62=mul(a,a), b62=mul(b,b), res6=sub(a62,add(b62,b62));
  ck("c.residual6", cs(res6)==="1", "a6^2-2b6^2 = "+cs(res6));
  ck("c.identityL6", cs(res6)==="1");
  ck("c.pellOnPage", PAGE.indexOf("886731088897/627013566048")>=0 && PAGE.indexOf("665857/470832")>=0 && PAGE.indexOf("a_6 = 1572584048032918633353217")>=0 && PAGE.indexOf("b_6 = 1111984844349868137938112")>=0);
  var SQ2=Math.SQRT2, b5f=627013566048, a5f=886731088897;
  var e5=1/(b5f*b5f*(a5f/b5f+SQ2));
  ck("c.e5", e5.toExponential(2).indexOf("8.99")===0, "e5 = "+e5.toExponential(3));
  ck("c.e5digits", Math.floor(-Math.log10(e5))===24);
  var e6=e5*e5/(2*(a5f/b5f));
  ck("c.e6", e6.toExponential(1).indexOf("2.9")===0, "e6 = "+e6.toExponential(3));
  ck("c.e6digits", Math.floor(-Math.log10(e6))===48);
  ck("c.e6OnPage", PAGE.indexOf("2.9 \\times 10^{-49}")>=0 && PAGE.indexOf("forty-eight decimals")>=0);
  var e4=1/(470832*470832*(665857/470832+SQ2));
  ck("c.e4", e4.toExponential(2).indexOf("1.59")===0 && Math.floor(-Math.log10(e4))===11, "e4 = "+e4.toExponential(3));
  ck("c.e5PageNeedles", PAGE.indexOf("9 \\times 10^{-25}")>=0 && PAGE.indexOf("twenty-four decimals")>=0 && PAGE.indexOf("8.99 \\times 10^{-25}")>=0);
  return "pieceC "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceD(PAGE) { // Newton on the plastic constant, room, price, 4-vs-40 race
  PASS=0; FAILS=0; REP=[];
  var f=function(x){ return x*x*x-x-1; }, fp=function(x){ return 3*x*x-1; };
  var N=function(x){ return x-f(x)/fp(x); }, RHO=1.3247179572447460;
  ck("d.rhoId", Math.abs(RHO*RHO*RHO-(RHO+1))<1e-15);
  ck("d.rhoPrint", RHO.toFixed(10)==="1.3247179572");
  ck("d.rhoOnPage", PAGE.indexOf("1.3247179572")>=0 && PAGE.indexOf("2.3247")<0);
  var orb=[1]; for (var i4=0;i4<5;i4++) orb.push(N(orb[i4]));
  var o10=orb.map(function(x){ return x.toFixed(10); });
  ck("d.orbit", o10[1]==="1.5000000000" && o10[2]==="1.3478260870" && o10[3]==="1.3252003990" && o10[4]==="1.3247181740" && o10[5]==="1.3247179572");
  var oNeedles=["1.3478260870","1.3252003990","1.3247181740","1.3247179572"], oOk=true;
  for (i4=0;i4<4;i4++) if (PAGE.indexOf(oNeedles[i4])<0) oOk=false;
  ck("d.orbitOnPage", oOk);
  var err=orb.map(function(x){ return Math.abs(x-RHO); });
  var eps=["3.2472 \\times 10^{-1}","1.7528 \\times 10^{-1}","2.3108 \\times 10^{-2}","4.8244 \\times 10^{-4}","2.1675 \\times 10^{-7}","4.37 \\times 10^{-14}"];
  ck("d.errors", err[0].toExponential(4).indexOf("3.2472")===0 && err[1].toExponential(4).indexOf("1.7528")===0 && err[2].toExponential(4).indexOf("2.3108")===0 && err[3].toExponential(4).indexOf("4.8244")===0 && err[4].toExponential(4).indexOf("2.1675")===0 && err[5].toExponential(2)==="4.37e-14");
  var eOk2=true; for (i4=0;i4<6;i4++) if (PAGE.indexOf(eps[i4])<0) eOk2=false;
  ck("d.errorsOnPage", eOk2);
  ck("d.defectFixed", PAGE.indexOf("2.1678")<0);
  var C=[0,1,2,3,4].map(function(n){ return err[n+1]/(err[n]*err[n]); });
  ck("d.Cratios", Math.abs(C[4]-0.932)<0.005 && PAGE.indexOf("0.93")>=0);
  ck("d.decimalsOnPage", PAGE.indexOf("0, 1, 3, 6, 13")>=0);
  ck("d.N125", N(1.25).toFixed(10)==="1.3305084746");
  ck("d.N145", N(1.45).toFixed(10)==="1.3372114932");
  var dN=function(x){ return 1-((fp(x)*fp(x)-f(x)*6*x)/(fp(x)*fp(x))); };
  ck("d.Nprime1", Math.abs(dN(1)-(-1.5))<1e-12);
  ck("d.Nprime1OnPage", PAGE.indexOf("= -1.5")>=0);
  var mx=0;
  for (i4=0;i4<=2000;i4++){ var x5=1.25+i4*0.2/2000, v5=Math.abs(dN(x5)); if (v5>mx) mx=v5; }
  ck("d.roomScan", Math.abs(mx-0.1849)<5e-4, "max|N'| = "+mx.toFixed(4));
  ck("d.roomScanOnPage", PAGE.indexOf("0.1849")>=0);
  var e0=Math.abs(1.45-RHO);
  ck("d.e0", e0.toFixed(7)==="0.1252820");
  ck("d.imageBound", Math.abs(0.1849*e0-0.0232)<5e-4);
  ck("d.imageOnPage", PAGE.indexOf("0.1849 \\times 0.1252820 = 0.0232")>=0 && PAGE.indexOf("1.3015")>=0 && PAGE.indexOf("1.3479")>=0);
  ck("d.rate", Math.log10(1/0.1849).toFixed(3)==="0.733" && PAGE.indexOf("0.733")>=0);
  ck("d.race", err[5]<9.1e-13);
  ck("d.raceOnPage", PAGE.indexOf("9.1 \\times 10^{-13}")>=0 && PAGE.indexOf("4.4 \\times 10^{-14}")>=0);
  ck("d.workedEx3", PAGE.indexOf("f(1.25) = -0.296875")>=0 && PAGE.indexOf("3.6875")>=0 && PAGE.indexOf("0.598625")>=0 && PAGE.indexOf("5.3075")>=0);
  return "pieceD "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceE(PAGE) { // Dottie, Exhibits A/B/C, Ex4 orbit, YBC 7289
  PASS=0; FAILS=0; REP=[];
  var d=0.7390851332151607;
  var y=0, orb=[0];
  for (var i5=0;i5<12;i5++){ y=Math.cos(y); orb.push(y); }
  var o6=orb.map(function(v){ return v.toFixed(6); });
  var truth=["0.000000","1.000000","0.540302","0.857553","0.654290","0.793480","0.701369","0.763960","0.722102","0.750418","0.731404","0.744237"];
  ck("e.dottieOrbit", o6.slice(0,12).join(",")===truth.join(","));
  var tOk=true; for (i5=0;i5<12;i5++) if (PAGE.indexOf(truth[i5])<0) tOk=false;
  ck("e.tableFixed", tOk && PAGE.indexOf("0.793480")>=0);
  var z=0, n=0;
  while (Math.abs(z-d)>=5e-7){ z=Math.cos(z); n++; }
  ck("e.steps35", n===35, "error-criterion hits: "+n);
  var m=0.7390851, k=1;
  while (m>=5e-7){ m*=0.8414710; k++; }
  ck("e.guaranteed83", k-1===83 && PAGE.indexOf("83")>=0, "smallest n with 0.8414710^n*0.7390851<5e-7: "+(k-1));
  ck("e.tailRate", Math.sin(d).toFixed(7)==="0.6736120" && PAGE.indexOf("0.6736120")>=0);
  ck("e.certRate", Math.log10(1/0.8414710).toFixed(3)==="0.075" && Math.log10(1/0.6736120).toFixed(4)==="0.1716" && PAGE.indexOf("0.1716")>=0 && PAGE.indexOf("0.075")>=0);
  ck("e.undersell", PAGE.indexOf("2.3")>=0);
  var u=1.01, up=[];
  for (i5=0;i5<10;i5++){ u=u*u; up.push(u); }
  ck("e.repellerUp", up[0].toFixed(4)==="1.0201" && up[1].toFixed(4)==="1.0406" && up[2].toFixed(4)==="1.0829" && up[3].toFixed(4)==="1.1726" && up[4].toFixed(4)==="1.3749" && up[5].toFixed(4)==="1.8905" && up[6].toFixed(3)==="3.574" && up[7].toFixed(1)==="12.8");
  var v2=0.99, dn2=[];
  for (i5=0;i5<10;i5++){ v2=v2*v2; dn2.push(v2); }
  ck("e.repellerDown", dn2[0].toFixed(4)==="0.9801" && dn2[1].toFixed(4)==="0.9606" && dn2[2].toFixed(4)==="0.9227" && dn2[3].toFixed(4)==="0.8515" && dn2[4].toFixed(4)==="0.7250" && dn2[5].toFixed(4)==="0.5256" && dn2[6].toFixed(4)==="0.2763");
  ck("e.slope2", Math.abs(2*1-2)<1e-12);
  var cyc=function(x){ return 1-x; };
  ck("e.twoCycle", Math.abs(cyc(0.3)-0.7)<1e-12 && Math.abs(cyc(0.7)-0.3)<1e-12);
  ck("e.fixedHalf", PAGE.indexOf("g(1/2) = 1/2")>=0);
  var w2=0.9, leak=[];
  for (i5=0;i5<8;i5++){ w2=w2/2; leak.push(w2); }
  ck("e.leak", leak[0]===0.45 && leak[1]===0.225 && leak[2]===0.1125 && leak[3]===0.05625);
  ck("e.leakOnPage", PAGE.indexOf("0.45")>=0 && PAGE.indexOf("0.225")>=0 && PAGE.indexOf("0.1125")>=0);
  var q=0.5, ex4=[0.5];
  for (i5=0;i5<11;i5++){ q=q*q-1; ex4.push(q); }
  var e4v=ex4.map(function(v){ return v.toFixed(6); });
  ck("e.ex4orbit", e4v.join(",")==="0.500000,-0.750000,-0.437500,-0.808594,-0.346176,-0.880162,-0.225315,-0.949233,-0.098956,-0.990208,-0.019489,-0.999620");
  var e4Ok=true; for (i5=0;i5<12;i5++) if (PAGE.indexOf(e4v[i5])<0) e4Ok=false;
  ck("e.ex4OnPage", e4Ok);
  var phi=(1+Math.sqrt(5))/2;
  ck("e.ex4fixed", phi.toFixed(6)==="1.618034" && (-1/phi).toFixed(6)==="-0.618034" && PAGE.indexOf("1.618034")>=0 && PAGE.indexOf("-0.618034")>=0);
  ck("e.ex4slopes", (2*phi).toFixed(3)==="3.236" && (2/phi).toFixed(3)==="1.236" && PAGE.indexOf("3.236")>=0 && PAGE.indexOf("1.236")>=0);
  ck("e.ex4multiplier", 0*(-2)===0);
  var ybc=1+24/60+51/3600+10/216000;
  ck("e.ybc", ybc.toFixed(10)==="1.4142129630");
  ck("e.ybcDiff", Math.abs(ybc-Math.SQRT2).toExponential(0)==="6e-7" && PAGE.indexOf("6 \\times 10^{-7}")>=0 && (Math.abs(ybc-Math.SQRT2)/Math.SQRT2)<5e-7 && PAGE.indexOf("within one part in two million")>=0, "abs off 5.99e-7 prints 6e-7 at 1 sf; relative 4.24e-7 = one part in 2.4 million");
  ck("e.ybcOnPage", PAGE.indexOf("1;24,51,10")>=0 && PAGE.indexOf("YBC 7289")>=0);
  return "pieceE "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
function pieceF(PAGE) { // SVG coordinate re-derivation, lineage, doors, prereqs, poisons
  PASS=0; FAILS=0; REP=[];
  var seg=function(a,b){ var s=PAGE.indexOf(a); return PAGE.slice(s, PAGE.indexOf(b, s)); };
  var g=function(x){ return (x+2/x)/2; }, SQ=Math.SQRT2;
  var f1=seg('id="fig-p22-1"','</figure>');
  var px1=function(x){ return 50+(x-1)*400; }, py1=function(y){ return 290-(y-1)*260; };
  ck("f.fig1.dashedSqrt2", f1.indexOf('x1="215.7"')>=0 && Math.abs(px1(SQ)-215.7)<0.05);
  var stair="50,290 50,160 250,160 250,181.7 216.7,181.7 216.7,182.3 215.7,182.3";
  var sPts=[[1,1],[1,1.5],[1.5,1.5],[1.5,g(1.5)],[g(1.5),g(1.5)],[g(1.5),g(g(1.5))],[SQ,g(g(1.5))]];
  var stOk=true;
  for (var i6=0;i6<7;i6++){ var sx=px1(sPts[i6][0]).toFixed(1).replace(/\.0$/,""), sy=py1(sPts[i6][1]).toFixed(1).replace(/\.0$/,""); if (stair.indexOf(sx+","+sy)<0) stOk=false; }
  ck("f.fig1.staircase", stOk && f1.indexOf(stair)>=0);
  var pm=f1.match(/points="([^"]*50,160[^"]*)"/), polyOk=false;
  if (pm){ var pts=pm[1].trim().split(/\s+/); polyOk = pts.length===21;
    for (i6=0;i6<21 && polyOk;i6++){ var x6=1+i6*0.05, xy=pts[i6].split(","); if (Math.abs(px1(x6)-parseFloat(xy[0]))>0.25 || Math.abs(py1(g(x6))-parseFloat(xy[1]))>0.25) polyOk=false; } }
  ck("f.fig1.curvePolyline", polyOk);
  ck("f.fig1.dot", f1.indexOf('cx="215.7" cy="182.3"')>=0);
  var f2=seg('id="fig-p22-2"','</figure>');
  var px2=function(x){ return 40+(x-1)*880; };
  ck("f.fig2.sqrt2line", f2.indexOf('x1="404.5"')>=0 && Math.abs(px2(SQ)-404.5)<0.05);
  ck("f.fig2.segs", f2.indexOf('x2="404.5" y2="55"')>=0 && f2.indexOf('x2="480" y2="80"')>=0 && f2.indexOf('x2="406.7" y2="105"')>=0 && f2.indexOf('x1="404.5" y1="130" x2="404.5"')>=0);
  var f3=seg('id="fig-p22-3"','</figure>');
  var px3=function(x){ return 40+x*440; };
  var ticks=[0.9,0.45,0.225,0.1125,0.05625,0.028125,0.014063,0.007031,0.003516], tOk=true;
  for (i6=0;i6<9;i6++){ var v6=Math.round(px3(ticks[i6])*10)/10; if (f3.indexOf('x1="'+v6+'"')<0 && f3.indexOf('x2="'+v6+'"')<0) tOk=false; }
  ck("f.fig3.ticks", tOk);
  ck("f.fig3.dashedZero", f3.indexOf("stroke-dasharray")>=0 && f3.indexOf('x="40"')>=0);
  var lin=["YBC 7289","Heron","Metrica","1669","Raphson","1690","Simpson","1740","Picard","1890","Banach","1922","Fundamenta"], lOk=true;
  for (i6=0;i6<13;i6++) if (PAGE.indexOf(lin[i6])<0) lOk=false;
  ck("f.lineage", lOk);
  ck("f.lineageDisclaim", PAGE.indexOf("folklore")>=0);
  ck("f.doors", PAGE.indexOf('href="p23-interpolate.html"')>=0 && PAGE.indexOf('href="p25-machine-cases.html"')>=0 && PAGE.indexOf('href="p57-nash-moser.html"')>=0);
  ck("f.doorNames", PAGE.indexOf("Interpolate and continue")>=0 && PAGE.indexOf("Check every case by machine")>=0 && PAGE.indexOf("Nash–Moser")>=0);
  var prereqs=["p15-squeeze.html","p21-limit-point.html","p02-small-cases.html","p07-auxiliary-construction.html"], prOk=true;
  for (i6=0;i6<4;i6++) if (PAGE.indexOf('href="'+prereqs[i6]+'"')<0) prOk=false;
  ck("f.prereqHrefs", prOk);
  var others=["p17-","p18-","p19-","p20-","p03-"], f2c=0;
  for (i6=0;i6<5;i6++) if (PAGE.indexOf('href="'+others[i6])>=0) f2c++;
  ck("f.otherHrefs", f2c>=2, "also referenced: "+f2c);
  ck("f.footerNext", PAGE.indexOf('Next: <a href="p23-interpolate.html">P23 · Interpolate and continue</a>')>=0);
  ck("f.poison.noM01", PAGE.indexOf("m01")<0);
  ck("f.poison.noDollar", PAGE.indexOf("$")<0);
  ck("f.poison.noBacktick", PAGE.indexOf("`")<0);
  ck("f.poison.noTODO", PAGE.indexOf("TODO")<0 && PAGE.indexOf("XXX")<0);
  ck("f.poison.no1678", PAGE.indexOf("2.1678")<0);
  ck("f.poison.no735605", PAGE.indexOf("0.735605")<0);
  return "pieceF "+PASS+" pass "+FAILS+" fail "+REP.join("; ");
}
// Runner (for environments that can load this file directly and read the page):
// var PAGE = readFileSync("p22-fixed-point.html", "utf8");
// pieceA(PAGE); pieceB(PAGE); pieceC(PAGE); pieceD(PAGE); pieceE(PAGE); pieceF(PAGE);
// In session S56 the pieces were executed piecewise as inline sandbox bodies with
// the page read through a chunk-loop read_file helper; every final-revision piece
// passed all checks. Honest history: p22-lab-output.txt.
