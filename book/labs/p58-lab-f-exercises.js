// p58-lab-f-exercises.js — every exercise's arithmetic, machine-verified (float discipline: tolerances, never ===)
(function(){
  const gates=[], poisons=[];
  const g=(n,c)=>gates.push((c?'PASS ':'FAIL ')+n);
  const p=(n,rej)=>poisons.push((rej?'REJECTED ':'NOT-CAUGHT ')+n);
  const L10=Math.log(10), a=Math.log(2)/L10, r2=Math.SQRT2;
  // Ex 1
  const q13=13*a-Math.floor(13*a), q17=17*a-Math.floor(17*a);
  g('F1 {13a}=0.91339 in [log8=0.90309, log9=0.95424); {17a}=0.11751 < log2',
    Math.abs(q13-0.91339)<0.00005&&Math.abs(Math.log(8)/L10-0.90309)<0.00005&&
    Math.abs(Math.log(9)/L10-0.95424)<0.00005&&Math.abs(q17-0.11751)<0.00005&&q17<a);
  const D=[2]; let p13='',p17='';
  for(let n=2;n<=17;n++){let c=0;for(let i=0;i<D.length;i++){const t=2*D[i]+c;D[i]=t%10;c=(t-D[i])/10;}if(c>0)D.push(c);
    if(n===13||n===17){const s=D.slice().reverse().join('');if(n===13)p13=s;else p17=s;}}
  g('F2 2^13=8192 and 2^17=131072 exactly (digit-array big-int)', p13==='8192'&&p17==='131072');
  let mod5ok=true, endsNonZero=true;
  let m=1;
  for(let n=1;n<=200;n++){m=(m*2)%5;if(m===0)mod5ok=false;}
  let e=1;
  for(let n=1;n<=60;n++){e=(e*2)%10;if(e===0)endsNonZero=false;}
  g('F3 Ex1(c): 2^n mod 5 never 0 (n<=200); 2^n never ends in 0 (n<=60)', mod5ok&&endsNonZero);
  // Ex 2 preimage census
  let cnt=0;
  for(let k=0;k<2000;k++){const x=k/2000;const y=2*x-Math.floor(2*x);if(y>=0.2&&y<0.7)cnt++;}
  g('F4 Ex2: doubling preimage of [0.2,0.7) censuses 0.5 (grid 2000, tol 0.03)', Math.abs(cnt/2000-0.5)<0.03);
  // Ex 3(b) half-censuses on both circles
  let hA=0,hB=0;
  for(let n=1;n<=1000;n++){
    let x=n*a-Math.floor(n*a); if(x<0.5)hA++;
    let y=n*r2-Math.floor(n*r2); if(y<0.5)hB++;
  }
  g('F5 Ex3(b): half-census 499 (alpha circle) and 501 (beta circle), both within [495,505]',
    hA===499&&hB===501);
  // Ex 4 sigma ladder
  g('F6 Ex4: sigma 3.0 / 9.49 / 30.0; ratios 3, 9.49, 15',
    Math.abs(Math.sqrt(9)-3)<1e-9&&Math.abs(Math.sqrt(90)-9.49)<0.005&&Math.abs(Math.sqrt(900)-30)<1e-9&&
    Math.abs(Math.sqrt(90)-9.49)<0.005&&Math.abs(30/2-15)<1e-9);
  // Ex 5
  let cb=0,ce=0,c1000=0,c7=0,maxDev=0,zeroAt=0,c=0;
  for(let n=1;n<=2000;n++){
    const x=n*r2-Math.floor(n*r2); if(x<0.4)c++;
    const dv=Math.abs(c-0.4*n); if(dv>maxDev)maxDev=dv; if(dv<0.5)zeroAt++;
    if(n===1000)c1000=c; if(n===7)c7=c;
  }
  for(let n=1;n<=1000;n++){const x=(n*0.25)%1;if(x<0.4)cb++;if(x>=0.1&&x<0.2)ce++;}
  g('F7 Ex5: B=500 and [0.1,0.2)=0; C=400 at N=1000; ladder max dev<2 (obs 1.2), >=1300 exact checkpoints; N=7 reads 2',
    cb===500&&ce===0&&c1000===400&&maxDev<2&&zeroAt>=1300&&c7===2);
  // Ex 6(b): ratio consistency with Lab C's recorded long run
  const lc=globalThis.p58LabC;
  const ratio=lc?lc.ret/lc.ret1e5:null;
  g('F8 Ex6(b): single-run return ratio within [1.8,5.5] of the sqrt(10) scale (obs '+(ratio?ratio.toFixed(2):'n/a')+')',
    ratio!==null&&ratio>=1.8&&ratio<=5.5);
  p('F-P1 claim "sqrt2 reads 0.4N at every N" (N=7 reads '+c7+' of 2.8)', Math.abs(c7-2.8)>=0.5);
  const phi=(Math.sqrt(5)-1)/2; const d10=new Array(11).fill(0);
  for(let n=1;n<=100;n++){const x=n*phi-Math.floor(n*phi);d10[Math.min(10,Math.floor(x*10)+1)]++;}
  let md=0; for(let b=1;b<=10;b++){const dv=Math.abs(d10[b]-10);if(dv>md)md=dv;}
  p('F-P2 claim "golden decile error is zero at N=100" (obs '+md+')', md!==0);
  p('F-P3 claim "the return ratio equals sqrt(10) exactly"', ratio!==null&&Math.abs(ratio-Math.sqrt(10))>0.05);
  globalThis.p58LabF={gates,poisons,hA,hB,maxDev,zeroAt,ratio};
})();
