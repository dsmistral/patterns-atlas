// p58-lab-g-grafts.js — merge-graft receipts machine-verified (battery 7b). Sync; page injected as __p58PageHtml.
(function(){
  const gates=[],poisons=[],rec={};
  const g=(n,c)=>gates.push((c?'PASS ':'FAIL ')+n);
  const p=(n,r)=>poisons.push((r?'REJECTED ':'NOT-CAUGHT ')+n);
  const H=globalThis.__p58PageHtml||'';
  const L2=Math.LN2,PI=Math.PI,LN10=Math.LN10;
  // G1 two-digit prefixes 10/19 among the first 10^4 powers of 2 (mantissa held in [1,100))
  let m=1,c10=0,c19=0;
  for(let k=0;k<10000;k++){const pr=Math.floor(m);if(pr===10)c10++;else if(pr===19)c19++;m*=2;while(m>=100)m/=10;}
  const e10=10000*Math.log(1.1)/LN10,e19=10000*Math.log(20/19)/LN10;
  let tel=0;for(let q=10;q<=19;q++)tel+=Math.log((q+1)/q)/LN10;
  rec.c10=c10;rec.c19=c19;
  g('G1 prefix census @10^4: '+c10+'/'+c19+' vs 413.9/222.8 exp; ten-prefix telescope = log10(2)',
    Math.abs(c10-e10)<=8&&Math.abs(c19-e19)<=8&&Math.abs(tel-Math.log(2)/LN10)<=1e-14
    &&H.indexOf('0.04139')>=0&&H.indexOf('0.02228')>=0&&H.indexOf('N = 10^4')>=0);
  // G2 Khinchin product rebuilt from the digit frequencies alone, a million factors
  let S=0;for(let k=2;k<=1000000;k++)S+=Math.log(k)/L2*Math.log(1+1/(k*(k+2)));
  const K=Math.exp(S);rec.K=K.toFixed(6);
  g('G2 Khinchin product @10^6 = '+K.toFixed(6)+' (true 2.685452, tail priced); page 2.685452 + "returns 2.6854 at a million factors"',
    Math.abs(K-2.685452)<=2e-4&&H.indexOf('2.685452')>=0&&H.indexOf('returns 2.6854 at a million factors')>=0);
  // G3 Gauss digit frequencies: formula = Gauss weight of I_k, six-decimal table, machine census (pi-3 orbit)
  const F=k=>Math.log(1+1/(k*(k+2)))/L2,W=k=>Math.log((k+1)*(k+1)/(k*(k+2)))/L2;
  const tab=['0.415037','0.169925','0.093109','0.058894','0.040642'];
  let fw=true,tb=true;
  for(let k=1;k<=5;k++){fw=fw&&Math.abs(F(k)-W(k))<=1e-15;tb=tb&&F(k).toFixed(6)===tab[k-1];}
  let x=PI-3,geo=0,dg=[0,0,0,0,0,0],emp=true;
  for(let n=0;n<1000000;n++){const r=1/x,k=Math.floor(r);x=r-k;if(k<6)dg[k]++;geo+=Math.log(k);}
  for(let k=1;k<=5;k++)emp=emp&&Math.abs(dg[k]/1000000-F(k))<=4e-3;
  rec.dg=dg.join('/');rec.geoMean=Math.exp(geo/1000000).toFixed(4);
  g('G3 Gauss digits k=1..5: formula = Gauss weight, six-decimal table exact, machine census @10^6 within 4e-3; page 0.41504 + "k = 1"',
    fw&&tb&&emp&&H.indexOf('0.41504')>=0&&H.indexOf('k = 1')>=0);
  // G4 arcsine weighing of the logistic map: two-branch invariance, closed form
  const f=v=>1/(PI*Math.sqrt(v*(1-v)));let mx=0;
  for(let j=1;j<=9;j++){const y=j/10,r=Math.sqrt(1-y),xp=(1+r)/2,xm=(1-r)/2;
    const d=Math.abs(f(xp)/Math.abs(4-8*xp)+f(xm)/Math.abs(4-8*xm)-f(y));if(d>mx)mx=d;}
  rec.arcsineDev=mx.toExponential(2);
  g('G4 arcsine two-branch invariance exact (max dev '+mx.toExponential(2)+', y=0.1..0.9); page "arcsine"',
    mx<=1.1e-15&&H.indexOf('arcsine')>=0);
  // G5 Lyapunov ln 2: theta-route (weight absorbed; midpoints miss the log walls at ANY N) + x-space even-N route
  let sl=0,sx=0;const N=1000000;
  for(let j=1;j<=N;j++){const t=(j-0.5)*PI/(2*N),s=Math.sin(t);sl+=Math.log(Math.abs(4-8*s*s));
    const xx=(j-0.5)/N;sx+=Math.log(Math.abs(4-8*xx))/(PI*Math.sqrt(xx*(1-xx)));}
  const lam=sl/N,lamx=sx/N;rec.thetaLyap=lam.toFixed(5);rec.xLyap=lamx.toFixed(5);
  g('G5 Lyapunov: theta-route @10^6 = '+lam.toFixed(5)+' (|d-ln2|<=2e-4); x-space even-N = '+lamx.toFixed(5)+' (predicted 0.5-1.5e-3 endpoint-strip bias below ln2); page "Lyapunov receipt"',
    Math.abs(lam-L2)<=2e-4&&L2-lamx>=1e-4&&L2-lamx<=1.5e-3&&H.indexOf('Lyapunov receipt')>=0);
  // G6 resonant torus (sqrt2, 2sqrt2) from (0,0): 2x-y invariant, average 1.00000000
  let X=0,Y=0,acc=0;const R2=Math.SQRT2;
  for(let n=0;n<10000;n++){X=(X+R2)%1;Y=(Y+2*R2)%1;acc+=Math.cos(2*PI*(2*X-Y));}
  rec.torus=(acc/10000).toFixed(10);
  g('G6 torus resonance @10^4 from (0,0): avg = '+(acc/10000).toFixed(10)+'; page "1.00000000" + "ten thousand steps from"',
    Math.abs(acc/10000-1)<=1e-9&&H.indexOf('1.00000000')>=0&&H.indexOf('ten thousand steps from')>=0);
  // G7 fixed points: golden section (all 1s) and sqrt2-1 (all 2s). Float note: the Gauss map is
  // EXPANDING at both fixed points (|T'| = 2.618 / 5.83), so drift grows per digit and a long
  // stream outruns double precision — witness 15 digits plus the one-step identities.
  const phi=(Math.sqrt(5)-1)/2,s2=Math.SQRT2-1;
  let a=phi,b=s2,ok=true;
  ok=Math.abs(1/phi-Math.floor(1/phi)-phi)<=1e-15&&Math.abs(1/s2-Math.floor(1/s2)-s2)<=1e-15;
  for(let n=0;n<15;n++){const r=1/a,k=Math.floor(r);ok=ok&&k===1;a=r-k;const q=1/b,l=Math.floor(q);ok=ok&&l===2;b=q-l;}
  g('G7 golden + sqrt2-1 fixed points: one-step identities exact + 15 digits each, all 1s / all 2s; page "digits are all 1s" + "(all 2s)"',
    ok&&H.indexOf('digits are all 1s')>=0&&H.indexOf('(all 2s)')>=0);
  // G8 Gauss branch sum to a hundred thousand branches: four-decimal agreement
  let bd=0;
  [0.1,0.5,0.9].forEach(function(y){let s=0;for(let k=1;k<=100000;k++)s+=1/((k+y)*(k+y+1));
    const d=Math.abs(s/L2-1/((1+y)*L2));if(d>bd)bd=d;});
  rec.branchDev=bd.toExponential(3);
  g('G8 Gauss branch sum @1e5: max dev '+bd.toExponential(3)+' < 5e-5 (four-decimal agreement); page "hundred thousand"',
    bd<5e-5&&H.indexOf('hundred thousand')>=0);
  // poisons: external residue must be absent from the merged page
  p('GP1 external X1 Benford overclaim "four decimal places"',H.indexOf('four decimal places')<0);
  p('GP2 external D1 ordinal "thirteenth"',H.indexOf('thirteenth')<0);
  p('GP3 external X3 "coined" (1884)',H.indexOf('coined')<0);
  p('GP4 external X2 "therefore uniquely ergodic"',H.indexOf('therefore uniquely ergodic')<0);
  p('GP5 external X4 "weeks later"',H.indexOf('weeks later')<0);
  p('GP6 noncanonical hrefs (p24-split-into-waves, p09-find-invariant, p16-structural-isomorphism, p01-pin-down-problem)',
    H.indexOf('p24-split-into-waves')<0&&H.indexOf('p09-find-invariant')<0&&H.indexOf('p16-structural-isomorphism')<0&&H.indexOf('p01-pin-down-problem')<0);
  p('GP7 external D3 inlined <style>',H.indexOf('<style')<0);
  p('GP8 stale pre-graft moons summary',H.indexOf('●○○ ●●○ ●●● ◆ ◐ ◐')<0);
  globalThis.p58LabG={gates,poisons,rec};
})();
