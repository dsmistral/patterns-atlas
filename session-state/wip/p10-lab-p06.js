// p06 — Example 1 receipts: 51 of 1..100, consecutive and coprime.
const odds=[];for(let n=1;n<=100;n+=2)odds.push(n);
let oc=false;for(let i=0;i<odds.length-1;i++)if(odds[i+1]-odds[i]===1)oc=true;
ck('§4','odds-evade',odds.length===50&&!oc,'50 odds, no consecutive pair: threshold sharp at 51');
let bad1=0;
for(let t=0;t<300;t++){const pool=[];for(let i=1;i<=100;i++)pool.push(i);const pick=[];
for(let i=0;i<51;i++){const ix=Math.floor(rnd()*pool.length);pick.push(pool[ix]);pool.splice(ix,1);}
pick.sort((a,b)=>a-b);let hitc=false;for(let i=0;i<50;i++)if(pick[i+1]-pick[i]===1)hitc=true;
if(!hitc)bad1++;}
ck('§4','ex1-census',bad1===0,'300 random 51-subsets, all contain a consecutive pair');
let gOk=true;for(let n=1;n<=100;n++)if(gcd(n,n+1)!==1)gOk=false;
ck('§4','consecutive-coprime',gOk,'gcd(n,n+1)=1 for every n<=100');
ck('§4','c1012',101*100/2===5050,'C(101,2)=5050 as printed in §1');
ck('§4','ex1-claims',has('the fifty-one that must touch')&&has('fifty pairs')&&has('\\{99,100\\}'),'Ex1 claims present');
