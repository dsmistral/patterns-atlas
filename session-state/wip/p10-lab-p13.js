// p13 — Exercise 5 receipts: the birthday census and the honest reconciliation.
let pd=1,th=-1;
for(let n=1;n<=60;n++){pd*=(365-(n-1))/365;if(1-pd>0.5){th=n;break;}}
ck('§8','birthday-threshold',th===23,'first n with P(shared) > 1/2 is 23');
let p22=1,p23=1;
for(let k=0;k<22;k++)p22*=(365-k)/365;
for(let k=0;k<23;k++)p23*=(365-k)/365;
const q22=Math.round((1-p22)*10000)/10000,q23=Math.round((1-p23)*10000)/10000;
ck('§8','birthday-22',q22===0.4757,'P(shared) at 22 = 0.4757 as printed');
ck('§8','birthday-23',q23===0.5073,'P(shared) at 23 = 0.5073 as printed');
ck('§8','birthday-silence',23<365&&365/23>15.5&&365/23<16.5,'23 < 365: P10 is silent at the threshold; factor ≈ 16 as claimed');
ck('§8','birthday-claims',has('0.4757')&&has('0.5073')&&has('the birthday census'),'Ex5 claims present');
ck('§8','birthday-p19',has('p19-count-outcomes.html'),'Ex5 routes to P19');
