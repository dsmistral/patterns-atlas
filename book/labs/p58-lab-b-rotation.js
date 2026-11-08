// p58-lab-b-rotation.js — preserved weighings, rotation censuses, discrepancy ladders, resonance receipt
(function(){
  const gates=[], poisons=[];
  const g=(n,c)=>gates.push((c?'PASS ':'FAIL ')+n);
  const p=(n,rej)=>poisons.push((rej?'REJECTED ':'NOT-CAUGHT ')+n);
  const L10=Math.log(10);
  // B1: doubling preserves lengths (exact algebra + grid census)
  let okB1=true;
  for(const [a,b] of [[0.2,0.7],[0.05,0.35],[0.6,0.95],[0.0,0.5],[0.13,0.77]]){
    if(Math.abs(((b-a)/2+(b-a)/2)-(b-a))>1e-12) okB1=false;
    let cnt=0; for(let k=0;k<2000;k++){const x=k/2000;const y=2*x-Math.floor(2*x);if(y>=a&&y<b)cnt++;}
    if(Math.abs(cnt/2000-(b-a))>0.03) okB1=false;
  }
  g('B1 doubling preserves lengths (5 intervals, exact + grid)', okB1);
  const phi=(Math.sqrt(5)-1)/2, lo=Math.log(2)/L10;
  let g301=0;
  for(let n=1;n<=1000;n++){const x=n*phi-Math.floor(n*phi);if(x<lo)g301++;}
  g('B2 golden {n phi} in [0, log10 2) at N=1000 is 301', g301===301);
  const dec=new Array(11).fill(0); const devs={};
  for(let n=1;n<=10000;n++){const x=n*phi-Math.floor(n*phi);const k=Math.min(10,Math.floor(x*10)+1);dec[k]++;
    if(n===100||n===1000||n===10000){let m=0;for(let b=1;b<=10;b++){const dv=Math.abs(dec[b]-n/10);if(dv>m)m=dv;}devs[n]=m;}}
  g('B3 golden decile max-dev = 1/1/2 at N=10^2/10^3/10^4', devs[100]===1&&devs[1000]===1&&devs[10000]===2);
  const r2=Math.SQRT2; let c400=0;
  for(let n=1;n<=1000;n++){const x=n*r2-Math.floor(n*r2);if(x<0.4)c400++;}
  g('B4 {n sqrt2} in [0,0.4) at N=1000 is 400', c400===400);
  let maxDev=0, zeroAt=0, N=0, cnt=0;
  for(let n=1;n<=2000;n++){const x=n*r2-Math.floor(n*r2);if(x<0.4)cnt++;
    const dv=Math.abs(cnt-0.4*n); if(dv>maxDev)maxDev=dv; if(dv<0.5)zeroAt++;}
  g('B5 sqrt2 ladder: max |C(N)-0.4N| = 1.2 (< 2) over N<=2000; exact at >=1300 checkpoints (incl. N=1000)',
    maxDev<2&&Math.abs(maxDev-1.2)<0.01&&zeroAt>=1300&&Math.abs(cnt-800)<0.5);
  const n7=3; // count of {1..7} in [0,0.4): computed below
  let c7=0; for(let n=1;n<=7;n++){const x=n*r2-Math.floor(n*r2);if(x<0.4)c7++;}
  g('B6 sqrt2 at N=7 reads 2 (the Ex-5 witness)', c7===2);
  let cb=0,ce=0;
  for(let n=1;n<=1000;n++){const x=(n*0.25)%1;if(x<0.4)cb++;if(x>=0.1&&x<0.2)ce++;}
  g('B7 rational 1/4: 500 in [0,0.4), 0 in [0.1,0.2) at N=1000', cb===500&&ce===0);
  const a17=1/7+1e-8;
  const d17=new Array(11).fill(0);
  for(let n=1;n<=10000;n++){const x=n*a17-Math.floor(n*a17);const k=Math.min(10,Math.floor(x*10)+1);d17[k]++;}
  let m17=0, zeros=0;
  for(let b=1;b<=10;b++){const dv=Math.abs(d17[b]-1000);if(dv>m17)m17=dv;if(d17[b]===0)zeros++;}
  g('B8 1/7+1e-8 resonance at N=10^4: 3 zero deciles, max-dev 1000', zeros===3&&m17===1000);
  p('B-P1 claim "rational orbit converges to the census with running" ([0.1,0.2) fills in)', ce===0);
  p('B-P2 claim "golden decile error is exactly zero at N=10^4"', devs[10000]!==0);
  p('B-P3 claim "sqrt2 has zero error at EVERY N" (N=7 would read 2.8)', c7!==2.8&&Math.abs(c7-2.8)>=0.5);
  globalThis.p58LabB={gates,poisons,devs,sqrt2MaxDev:maxDev,sqrt2ExactCheckpoints:zeroAt,d17,zeros};
})();
