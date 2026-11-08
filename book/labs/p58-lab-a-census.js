// p58-lab-a-census.js — exact leading-digit census of powers of two (digit-array big-int; no BigInt, no recursion)
(function(){
  const gates=[], poisons=[];
  const g=(n,c)=>gates.push((c?'PASS ':'FAIL ')+n);
  const p=(n,rej)=>poisons.push((rej?'REJECTED ':'NOT-CAUGHT ')+n);
  const D=[2]; const C=new Array(10).fill(0); C[2]=1; let s100=0,s1000=0,d9=0; // C[2]=1 seeds 2^1's own digit: the census window is the FIRST 10^4 powers, 2^1..2^10000
  for(let n=2;n<=10000;n++){
    let carry=0;
    for(let i=0;i<D.length;i++){const t=2*D[i]+carry;D[i]=t%10;carry=(t-D[i])/10;}
    if(carry>0)D.push(carry);
    const ld=D[D.length-1];C[ld]++;
    if(n===100)s100=C[1];
    if(n===1000){s1000=C[1];d9=C[9];}
  }
  const E=[2]; const first=['2'];
  for(let n=2;n<=20;n++){let carry=0;for(let i=0;i<E.length;i++){const t=2*E[i]+carry;E[i]=t%10;carry=(t-E[i])/10;}if(carry>0)E.push(carry);first.push(String(E[E.length-1]));}
  g('A1 first-20 leading digits = 24813612512481361251', first.join('')==='24813612512481361251');
  g('A2 six 1s among first 20', (first.join('').match(/1/g)||[]).length===6);
  g('A3 digit-1 at n=100 is 30', s100===30);
  g('A4 digit-1 at n=1000 is 301, digit-9 is 45', s1000===301&&d9===45);
  g('A5 census of the first 10^4 powers (2^1..2^10000) = 3010,1761,1249,970,791,670,579,512,458',
    [3010,1761,1249,970,791,670,579,512,458].every((v,i)=>C[i+1]===v));
  const L10=Math.log(10);
  const ben=[1,2,3,4,5,6,7,8,9].map(d=>10000*Math.log(1+1/d)/L10);
  const shown=[3010.3,1760.9,1249.4,969.1,791.8,669.5,579.9,511.5,457.6];
  g('A6a Benford column to 1 d.p. (tol 0.051)', ben.every((v,i)=>Math.abs(v-shown[i])<0.051));
  const gapRow=[-0.3,0.1,-0.4,0.9,-0.8,0.5,-0.9,0.5,0.4];
  const gaps=ben.map((v,i)=>C[i+1]-v);
  g('A6b gap row to 1 d.p. (tol 0.051)', gaps.every((v,i)=>Math.abs(v-gapRow[i])<0.051));
  const mg=Math.max(...gaps.map(Math.abs));
  g('A6c max |gap| = 0.9195 at digit 7 (tol 0.01)', Math.abs(mg-0.9195)<0.01);
  const a=Math.log(2)/L10;
  const U=[2]; let unitsBad=0;
  for(let n=2;n<=10000;n++){let c2=0;for(let i=0;i<U.length;i++){const t=2*U[i]+c2;U[i]=t%10;c2=(t-U[i])/10;}if(c2>0)U.push(c2);if(U[0]===0)unitsBad++;}
  g('A7 units digit of 2^n never 0 for n<=10^4 (exact big-int: no wall hit)', unitsBad===0);
  const q13=13*a-Math.floor(13*a), q17=17*a-Math.floor(17*a);
  const l8=Math.log(8)/L10, l9=Math.log(9)/L10;
  g('A8a {13a} in [log8, log9)', q13>=l8&&q13<l9);
  g('A8b {13a}=0.91339 and {17a}=0.11751 (tol 5e-5), {17a}<log2',
    Math.abs(q13-0.91339)<0.00005&&Math.abs(q17-0.11751)<0.00005&&q17<a);
  let wrong=0;
  for(let n=1;n<=1000;n++){const x=n*a-Math.floor(n*a);if(x>=a&&x<Math.log(3)/L10)wrong++;}
  p('A-P1 claim "digit-1 lives in [log2,log3)" (count would be 176, not 301)', wrong!==s1000);
  p('A-P2 claim "digits uniform: 1111 each at n=10^4"', C[1]!==1111);
  p('A-P3 claim "digit-9 opens 100 of the first 1000 powers"', d9!==100);
  globalThis.p58LabA={gates,poisons,unitsBad,wrongIntervalCount:wrong};
})();
