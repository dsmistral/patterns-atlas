// p58-verifier-v1a.js — INDEPENDENT re-derivation of every load-bearing P58 number.
// Zero code shared with Labs A–F: decimal-STRING arithmetic (vs digit arrays), mulberry32 (vs xorshift32),
// binomial-series prediction (vs spreading recursion), direct (a,e) progression scan (vs pair+Set), fresh constants.
(function(){
  const gates=[],poisons=[];
  const g=(n,c)=>gates.push((c?'PASS ':'FAIL ')+n);
  const p=(n,rej)=>poisons.push((rej?'REJECTED ':'NOT-CAUGHT ')+n);
  // V1: powers of two by decimal-string doubling
  let s='2'; const C=new Array(10).fill(0); let u100=0,u1000=0,n9=0,f20='',unitsBad=0;
  for(let n=1;n<=10000;n++){
    const ld=s.charCodeAt(0)-48, un=s.charCodeAt(s.length-1)-48;
    C[ld]++; if(un===0)unitsBad++;
    if(n<=20)f20+=ld;
    if(n===100)u100=C[1];
    if(n===1000){u1000=C[1];n9=C[9];}
    const o=[]; let c=0;
    for(let i=s.length-1;i>=0;i--){const t=(s.charCodeAt(i)-48)*2+c;o.push(t%10);c=t>9?1:0;}
    if(c)o.push(1);
    o.reverse();
    s=o.join('');
  }
  g('V1a-1 first-20 leading digits 24813612512481361251', f20==='24813612512481361251');
  g('V1a-2 six 1s among the first twenty', (f20.match(/1/g)||[]).length===6);
  g('V1a-3 digit-1 census 30@100, 301@1000; digit-9 45@1000', u100===30&&u1000===301&&n9===45);
  g('V1a-4 full census of the FIRST 10^4 powers (2^1..2^10000) = 3010,1761,1249,970,791,670,579,512,458',
    [3010,1761,1249,970,791,670,579,512,458].every((v,i)=>C[i+1]===v));
  g('V1a-5 no wall hit: units digit of 2^n never 0 (n<=10^4)', unitsBad===0);
  const B=[1,2,3,4,5,6,7,8,9].map(d=>10000*Math.log(1+1/d)*Math.LOG10E);
  const shown=[3010.3,1760.9,1249.4,969.1,791.8,669.5,579.9,511.5,457.6];
  const gaps=B.map((b,i)=>C[i+1]-b);
  const mg=Math.max(...gaps.map(Math.abs));
  g('V1a-6 Benford column + gap row to 1 d.p. (fresh LOG10E route), max |gap| 0.9195 at digit 7',
    B.every((b,i)=>Math.abs(b-shown[i])<0.051)&&gaps.every((v,i)=>Math.abs(v-[-0.3,0.1,-0.4,0.9,-0.8,0.5,-0.9,0.5,0.4][i])<0.051)
    &&Math.abs(mg-0.9195)<0.01&&Math.abs(gaps[6])===mg);
  // V2: rotations, fresh constants
  const phi=2/(1+Math.sqrt(5)), r2=Math.SQRT2, a1=Math.log(2)*Math.LOG10E;
  const dev=N=>{const d=new Array(10).fill(0);for(let n=1;n<=N;n++){const x=n*phi%1;d[(x*10)|0]++;}let m=0;for(let b=0;b<10;b++){const e=Math.abs(d[b]-N/10);if(e>m)m=e;}return m;};
  g('V1a-7 golden decile max-dev 1@100, 1@1000, 2@10^4', dev(100)===1&&dev(1000)===1&&dev(10000)===2);
  let cg=0; for(let n=1;n<=1000;n++){if(n*phi%1<a1)cg++;}
  g('V1a-8 golden orbit in [0, log10 2) at N=1000: 301', cg===301);
  let cs=0,mx=0,ex=0,c7=0,c10=0;
  for(let n=1;n<=2000;n++){if(n*r2%1<0.4)cs++;const dv=Math.abs(cs-0.4*n);if(dv>mx)mx=dv;if(dv<0.5)ex++;if(n===7)c7=cs;if(n===1000)c10=cs;}
  g('V1a-9 sqrt2 ladder: 400@1000, 2@7, 800@2000, max dev 1.2 (<2), exact at >=1300 checkpoints',
    c10===400&&c7===2&&cs===800&&mx>1&&mx<2&&Math.abs(mx-1.2)<0.01&&ex>=1300);
  let cb=0,ce=0; for(let n=1;n<=1000;n++){const x=n*0.25%1;if(x<0.4)cb++;if(x>=0.1&&x<0.2)ce++;}
  g('V1a-10 rational 1/4: 500 in [0,0.4), 0 in [0.1,0.2)', cb===500&&ce===0);
  const ar=1/7+1e-8; const dz=new Array(10).fill(0);
  for(let n=1;n<=10000;n++){const x=n*ar%1;dz[(x*10)|0]++;}
  let zeros=0,mdv=0; for(let b=0;b<10;b++){if(dz[b]===0)zeros++;const e=Math.abs(dz[b]-1000);if(e>mdv)mdv=e;}
  g('V1a-11 1/7+1e-8 resonance: 3 zero deciles, max-dev 1000', zeros===3&&mdv===1000);
  // V3: walker by mulberry32 + binomial-series prediction
  let pk=0.5,sum=0,p50=0,s2000=0,s1e5=0,s1e6=0;
  for(let k=1;k<=500000;k++){if(k>1)pk*=(2*k-1)*(2*k)/(4*k*k);if(k===50)p50=pk;sum+=pk;if(k===1000)s2000=sum;if(k===50000)s1e5=sum;if(k===500000)s1e6=sum;}
  g('V1a-12 binomial route: E[returns by 2000 flips] = 34.7 (tol 0.1)', Math.abs(s2000-34.7)<0.1);
  g('V1a-13 P26 pin p_100(0) = 0.07958924 (binomial C(100,50)/2^100)', Math.abs(p50-0.07958924)<0.0000001);
  const mb=t=>function(){t|=0;t=t+0x6D2B79F5|0;let r=Math.imul(t^t>>>15,1|t);r=r+Math.imul(r^r>>>7,61|r)^r;return((r^r>>>14)>>>0)/4294967296;};
  // 16 fresh-seed walkers: single-run scale is LUMPY (the chapter's own lesson — Lab C: span 2..125 at N=2000),
  // so the independent check is ENSEMBLE concentration + universal thinning, not a one-seed tight band.
  const L6=[],L5=[]; let fmin=1,fmax=0;
  for(let j=0;j<16;j++){
    const w=mb(20241108+j*7919); let pos=0,r6=0,r5=0;
    for(let t=1;t<=1000000;t++){pos+=w()<0.5?-1:1;if(pos===0){r6++;if(t<=100000)r5++;}}
    L6.push(r6);L5.push(r5);const f=r6/1000000;if(f<fmin)fmin=f;if(f>fmax)fmax=f;
  }
  const m6=L6.reduce((a,b)=>a+b,0)/16, m5=L5.reduce((a,b)=>a+b,0)/16;
  const EP=Math.sqrt(2000000/Math.PI), EP5=Math.sqrt(200000/Math.PI);
  const thin=(s1e6/1000000)/(s1e5/100000), rt=Math.sqrt(0.1);
  g('V1a-14 ensemble: mean returns@10^6 in [0.6,1.4]x sqrt(2N/pi) and @10^5 likewise (obs '+m6.toFixed(0)+' vs '+EP.toFixed(0)+', '+m5.toFixed(1)+' vs '+EP5.toFixed(1)+')',
    m6>=0.6*EP&&m6<=1.4*EP&&m5>=0.6*EP5&&m5<=1.4*EP5);
  g('V1a-15 thinning EXACT: binomial E[origin-fraction] ratio 10^5->10^6 equals 1/sqrt(10) (obs '+thin.toFixed(5)+' vs '+rt.toFixed(5)+')',
    Math.abs(thin-rt)<0.002);
  g('V1a-16 every fresh seed is thin: max origin-fraction < 0.004 (obs max '+fmax.toFixed(5)+', span '+Math.min(...L6)+'..'+Math.max(...L6)+')',
    fmax<0.004);
  // V4: progressions by direct (a,e) scan
  const aps=d=>{const M=new Array(1001).fill(false);let m=0;
    for(let n=1;n<=1000;n++){if(n*phi%1<d){M[n]=true;m++;}}
    let c=0,f=null;
    for(let a=1;a<=998;a++){if(!M[a])continue;for(let e=a+1;2*e-a<=1000;e++){if(M[e]&&M[2*e-a]){c++;if(!f)f=[a,e,2*e-a];}}}
    return {c,m,f};};
  const r3=aps(0.3), r5=aps(0.05);
  g('V1a-15 delta=0.3 set: 300 members, 11100 progressions, first [2,10,18]; delta=0.05: 288',
    r3.m===300&&r3.c===11100&&r3.f.join(',')==='2,10,18'&&r5.c===288);
  g('V1a-16 richer than random: 11100 vs scattering estimate 6750 (ratio > 1.5)',
    r3.c>1.5*(0.3*0.3*0.3*1000000/4));
  let pw=[],v=1,apw=0; for(let k=1;k<=30;k++){v*=2;pw.push(v);}
  for(let i=0;i<30;i++)for(let j=i+1;j<30;j++)for(let q=j+1;q<30;q++)if(pw[j]-pw[i]===pw[q]-pw[j])apw++;
  g('V1a-17 powers of two (exponents<=30): zero progressions', apw===0);
  p('V1a-P1 claim "the golden census at N=10^4 is exactly uniform" (max dev '+dev(10000)+')', dev(10000)!==0);
  p('V1a-P2 claim "the sqrt2 ladder error never reaches one count" (max dev '+mx.toFixed(10)+')', mx>1);
  p('V1a-P3 claim "the delta=0.3 rotation set is progression-free" ('+r3.c+' found)', r3.c!==0);
  p('V1a-P4 claim "2^n can open with digit 0"', C[0]===0);
  p('V1a-P5 claim "the 1/7+1e-8 orbit keeps all deciles healthy" ('+zeros+' empty)', zeros!==0);
  globalThis.p58V1a={gates,poisons,EL0:s2000,p50,E1e5:s1e5,E1e6:s1e6,meanL6:m6,meanL5:m5,fmin:fmin,fmax:fmax,spanL6:Math.min(...L6)+'..'+Math.max(...L6),aps30:r3.c,aps005:r5.c,maxdev:mx,exact:ex,gold301:cg};
})();
