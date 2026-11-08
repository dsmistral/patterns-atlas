// p58-lab-d-density.js — density becomes recurrence: 3-term arithmetic progressions in rotation-density sets
(function(){
  const gates=[], poisons=[];
  const g=(n,c)=>gates.push((c?'PASS ':'FAIL ')+n);
  const p=(n,rej)=>poisons.push((rej?'REJECTED ':'NOT-CAUGHT ')+n);
  const phi=(Math.sqrt(5)-1)/2, N=1000;
  const build=delta=>{
    const A=[];
    for(let n=1;n<=N;n++){const x=n*phi-Math.floor(n*phi);if(x<delta)A.push(n);}
    return A;
  };
  const aps3=A=>{
    const S=new Set(A); let c=0, first=null;
    for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){
      const a=A[i],z=A[j];
      if((a+z)%2!==0)continue;
      const m=(a+z)/2;
      if(m!==a&&S.has(m)){c++;if(!first)first=[a,m,z];}
    }
    return {c,first};
  };
  const A30=build(0.3), r30=aps3(A30);
  const randPred=0.3*0.3*0.3*N*N/4; // independent-scattering estimate
  g('D1 the rotation set at delta=0.3 has exactly 300 members among n<=1000', A30.length===300);
  g('D2 its 3-term progressions number in the thousands (obs '+r30.c+'; random-sowing estimate '+randPred.toFixed(0)+')',
    r30.c>=2000&&r30.c<100000);
  g('D3 and come RICHER than random (obs/random > 1.2)', r30.c>1.2*randPred);
  g('D4 an explicit progression exists and is recorded ('+(r30.first?r30.first.join(', '):'none')+')', r30.first!==null);
  const A50=build(0.05), r50=aps3(A50);
  g('D5 at delta=0.05 progressions persist (obs '+r50.c+' >= 5, members '+A50.length+')', r50.c>=5);
  // powers of two: density zero, AP-free (exponents 1..30)
  const pows=[]; let v=1;
  for(let k=1;k<=30;k++){v*=2;pows.push(v);}
  const rp=aps3(pows);
  g('D6 the powers of two (density zero) hold no 3-term progression (obs '+rp.c+')', rp.c===0);
  const A37=build(0.3).filter(n=>n<=37);
  p('D-P1 claim "the density-0.3 rotation set is progression-free"', r30.c!==0);
  p('D-P2 claim "the powers of two contain a 3-term progression"', rp.c===0);
  p('D-P3 claim "density is exactly 0.3N at every N" (N=37: '+A37.length+' members, not 11.1)', A37.length!==11.1);
  globalThis.p58LabD={gates,poisons,aps30:r30.c,aps005:r50.c,firstAP:r30.first,randPred,apsPows:rp.c};
})();
