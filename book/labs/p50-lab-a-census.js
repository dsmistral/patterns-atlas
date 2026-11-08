// P50 Lab A — the d-ladder census (k = 3, d = 2..5). Multiplicities by character
// inner product vs closed formulas; ledger sum m*f = d^3; permutation-image
// dimension by Gram rank under the trace form; commutant dimension <chi,chi> vs
// sum m^2; the Exercise-2 middle-space GL2 character receipt. Deterministic.
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a||1}
function binom(n,k){let r=1;for(let i=0;i<k;i++)r=Math.round(r*(n-i)/(i+1));return r}
if(binom(4,2)!==6)throw new Error('probe binom');
const P=[];
for(let a=1;a<=3;a++)for(let b=1;b<=3;b++){if(b===a)continue;for(let c=1;c<=3;c++){if(c===a||c===b)continue;P.push([a,b,c])}}
if(P.length!==6)throw new Error('probe |S3|');
function cyc(p){let s=0,c=0;for(let i=0;i<3;i++){if((s>>i)&1)continue;c++;let j=i;while(!((s>>j)&1)){s|=1<<j;j=p[j]-1}}return c}
function inv(p){const q=[0,0,0];for(let i=1;i<=3;i++)q[p[i-1]-1]=i;return q}
function comp(p,q){return[p[q[0]-1],p[q[1]-1],p[q[2]-1]]}
const SGN={1:1,2:-1,3:1},STD={1:-1,2:0,3:2};
const KEYS=['triv','sign','std'];
function chv(k,c){return k==='triv'?1:(k==='sign'?SGN[c]:STD[c])}
function rankMod(M,nc,p){const A=M.map(r=>r.map(v=>{v%=p;return v<0?v+p:v}));let rk=0;
for(let c=0;c<nc&&rk<A.length;c++){let q=-1;for(let i=rk;i<A.length;i++)if(A[i][c]!==0){q=i;break}
if(q<0)continue;const t=A[rk];A[rk]=A[q];A[q]=t;
for(let i=rk+1;i<A.length;i++){if(A[i][c]===0)continue;const x=A[rk][c],y=A[i][c];
for(let j=0;j<nc;j++){let v=(A[i][j]*x-A[rk][j]*y)%p;if(v<0)v+=p;A[i][j]=v}}
rk++}return rk}
const PS=[8191,131071,524287];
function rankCert(M,nc){const rs=PS.map(p=>rankMod(M,nc,p));return rs[0]===rs[1]&&rs[1]===rs[2]?rs[0]:-1}
const rows=[];
for(const d of[2,3,4,5]){
const m=KEYS.map(k=>{let s=0;for(const p of P)s+=Math.pow(d,cyc(p))*chv(k,cyc(p));return s/6});
let cc=0;for(const p of P)cc+=Math.pow(d,2*cyc(p));cc/=6;
const form=[binom(d+2,3),d*(d*d-1)/3,binom(d,3)];
const G=P.map(pi=>P.map(pj=>Math.pow(d,cyc(comp(inv(pi),pj)))));
const img=m[1]>0?6:5;
const led=m[0]+m[1]+2*m[2];
const gr=rankCert(G,6);
rows.push({d,m,form,cc,img,gram:gr,ledgerOk:led===d*d*d,
formOk:form[0]===m[0]&&form[1]===m[2]&&form[2]===m[1],
ccOk:cc===m[0]*m[0]+m[1]*m[1]+m[2]*m[2],gramOk:gr===img});
}
const words=[];for(let i=0;i<2;i++)for(let j=0;j<2;j++)for(let k=0;k<2;k++)words.push([i,j,k]);
const cyc3=P.filter(p=>cyc(p)===1);
if(cyc3.length!==2)throw new Error('probe 3-cycles');
function fixedW(p){const ip=inv(p);const out=[];for(const w of words){const t=[w[ip[0]-1],w[ip[1]-1],w[ip[2]-1]];if(t[0]===w[0]&&t[1]===w[1]&&t[2]===w[2])out.push(w)}return out}
const charReceipts=[];
for(const pair of[[1,2],[3,5],[2,7]]){
const t1=pair[0],t2=pair[1];
const ds=v=>v===0?t1:t2;
const pw=w=>ds(w[0])*ds(w[1])*ds(w[2]);
const trD=words.reduce((s,w)=>s+pw(w),0);
const trF=p=>fixedW(p).reduce((s,w)=>s+pw(w),0);
const got=(2*trD-trF(cyc3[0])-trF(cyc3[1]))/3;
const want=2*(t1*t1*t2+t1*t2*t2);
charReceipts.push({t1,t2,got,want,ok:got===want&&Number.isInteger(got)});
}
const R={rows,charReceipts};
R.allOk=R.rows.every(r=>r.ledgerOk&&r.formOk&&r.ccOk&&r.gramOk)&&R.charReceipts.every(c=>c.ok);
globalThis.LAB_A=R;
