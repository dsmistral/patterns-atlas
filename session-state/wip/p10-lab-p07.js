// p07 — Example 2 receipts: 101 of 1..200, divisibility by odd part.
const parts=new Set();for(let n=1;n<=200;n++)parts.add(oddPart(n));
ck('§4','odd-parts',parts.size===100,'exactly 100 distinct odd parts in 1..200');
let bad2=0;
for(let t=0;t<200;t++){const pool=[];for(let i=1;i<=200;i++)pool.push(i);const pick=[];
for(let i=0;i<101;i++){const ix=Math.floor(rnd()*pool.length);pick.push(pool[ix]);pool.splice(ix,1);}
let hitd=false;
outer:for(let i=0;i<101;i++)for(let j=0;j<101;j++)if(i!==j&&pick[j]%pick[i]===0){hitd=true;break outer;}
if(!hitd)bad2++;}
ck('§4','ex2-census',bad2===0,'200 random 101-subsets, all contain a divisibility pair');
const top=[];for(let n=101;n<=200;n++)top.push(n);let dv=0;
for(let i=0;i<top.length;i++)for(let j=0;j<top.length;j++)if(i!==j&&top[j]%top[i]===0)dv++;
ck('§4','top-clean',dv===0,'top hundred 101..200: zero divisibility pairs among all ordered pairs');
ck('§4','c1002',100*99/2===4950,'C(100,2)=4950 as printed');
ck('§4','ex2-claims',has('the hundred and one that must divide')&&has('one hundred boxes')&&has('101 > 100'),'Ex2 claims present');
