// P50 Lab C — S4 censuses at d = 3 and d = 2. Multiplicities by character
// inner product vs hook-content products; ledgers; image dims by Gram rank;
// commutant ledger <chi,chi> vs sum m^2. Deterministic.
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a||1}
const P=[];
for(let a=1;a<=4;a++)for(let b=1;b<=4;b++){if(b===a)continue;for(let c=1;c<=4;c++){if(c===a||c===b)continue;
for(let e=1;e<=4;e++){if(e===a||e===b||e===c)continue;P.push([a,b,c,e])}}}
if(P.length!==24)throw new Error('probe |S4|');
function cyc(p){let s=0,c=0;for(let i=0;i<4;i++){if((s>>i)&1)continue;c++;let j=i;while(!((s>>j)&1)){s|=1<<j;j=p[j]-1}}return c}
function type(p){const seen=[false,false,false,false];const lens=[];for(let i=0;i<4;i++){if(seen[i])continue;let l=0,j=i;while(!seen[j]){seen[j]=true;l++;j=p[j]-1}lens.push(l)}return lens.sort().reverse().join('')}
const TB={'1111':[1,3,2,3,1],'211':[1,1,0,-1,-1],'22':[1,-1,2,-1,1],'31':[1,0,-1,0,1],'4':[1,-1,0,1,-1]};
const F=[1,3,2,3,1];
const cnt={};for(const p of P){const t=type(p);cnt[t]=(cnt[t]||0)+1}
const cntOk=cnt['1111']===1&&cnt['211']===6&&cnt['22']===3&&cnt['31']===8&&cnt['4']===6;
function ip(a,b){let s=0;for(const p of P){const t=type(p);s+=TB[t][a]*TB[t][b]}return s/24}
const orthOk=ip(0,0)===1&&ip(0,1)===0&&ip(1,1)===1&&ip(3,3)===1;
function inv(p){const q=[0,0,0,0];for(let i=1;i<=4;i++)q[p[i-1]-1]=i;return q}
function comp(p,q){return[p[q[0]-1],p[q[1]-1],p[q[2]-1],p[q[3]-1]]}
function rankMod(M,nc,p){const A=M.map(r=>r.map(v=>{v%=p;return v<0?v+p:v}));let rk=0;
for(let c=0;c<nc&&rk<A.length;c++){let q=-1;for(let i=rk;i<A.length;i++)if(A[i][c]!==0){q=i;break}
if(q<0)continue;const t=A[rk];A[rk]=A[q];A[q]=t;
for(let i=rk+1;i<A.length;i++){if(A[i][c]===0)continue;const x=A[rk][c],y=A[i][c];
for(let j=0;j<nc;j++){let v=(A[i][j]*x-A[rk][j]*y)%p;if(v<0)v+=p;A[i][j]=v}}
rk++}return rk}
const PS=[8191,131071,524287];
function rankCert(M,nc){const rs=PS.map(p=>rankMod(M,nc,p));return rs[0]===rs[1]&&rs[1]===rs[2]?rs[0]:-1}
function hookContent(lam,d){
const cols=[];for(let j=0;j<lam[0];j++){let c=0;for(const r of lam)if(r>j)c++;cols.push(c)}
let num=1,den=1;
for(let i=0;i<lam.length;i++)for(let j=0;j<lam[i];j++){
num*=(d+j-i);den*=(lam[i]+cols[j]-i-j-1)}
if(num%den!==0)throw new Error('hook-content not integral');
return num/den}
const LAM=[[4],[3,1],[2,2],[2,1,1],[1,1,1,1]];
function census(d){
const m=[0,1,2,3,4].map(a=>{let s=0;for(const p of P){const t=type(p);s+=Math.pow(d,cyc(p))*TB[t][a]}return s/24});
const hc=LAM.map(l=>hookContent(l,d));
const led=m.reduce((s,mi,i)=>s+mi*F[i],0);
const img=m.reduce((s,mi,i)=>s+(mi>0?F[i]*F[i]:0),0);
const G=P.map(pi=>P.map(pj=>Math.pow(d,cyc(comp(inv(pi),pj)))));
const gram=rankCert(G,24);
let cc=0;for(const p of P)cc+=Math.pow(d,2*cyc(p));cc/=24;
return{d,m,hc,hcOk:m.every((mi,i)=>mi===hc[i]),led,ledOk:led===Math.pow(d,4),
img,gram,gramOk:gram===img,cc,ccOk:cc===m.reduce((s,mi)=>s+mi*mi,0)}}
const rows=[census(2),census(3)];
const R={cntOk,orthOk,rows};
R.allOk=R.cntOk&&R.orthOk&&R.rows.every(r=>r.hcOk&&r.ledOk&&r.gramOk&&r.ccOk);
globalThis.LAB_C=R;
