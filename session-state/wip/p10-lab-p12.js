// p12 — Exercise 4 receipts: referee the three students.
const c6=subsets(S10,6);let ev6=0;const evList=[];
for(const s of c6){let hit=false;
for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)if(Math.abs(s[i]-s[j])===4)hit=true;
if(!hit){ev6++;if(evList.length<4)evList.push('['+s.join(',')+']');}}
ck('§8','referee-census',c6.length===210&&ev6===4,'C(10,6)=210; exactly 4 evaders: '+evList.join(' '));
const cse=[1,2,3,4,9,10];let cseHit=false;const diffs=new Set();
for(let i=0;i<6;i++)for(let j=i+1;j<6;j++){const d=Math.abs(cse[i]-cse[j]);diffs.add(d);if(d===4)cseHit=true;}
ck('§8','counterexample',!cseHit,'{1,2,3,4,9,10} evades: pairwise differences are '+Array.from(diffs).sort((a,b)=>a-b).join(','));
ck('§8','c-smuggle',9%4===1&&Math.abs(9-1)===8&&(9-1)%4===0,'1 and 9 share class mod 4 yet differ by 8: the smuggled conclusion exposed');
ck('§8','referee-claims',has('referee the three students')&&has('exactly \\(4\\) of the \\(210\\)'),'Ex4 claims present');
ck('§8','a-overlap',has('overlap')&&has('The pairs \\(\\{1,5\\}'),'A\'s overlapping boxes named on the page');
