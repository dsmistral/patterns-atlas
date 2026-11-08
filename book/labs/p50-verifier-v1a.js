// P50 Verifier V1a (1/3) — fresh engine, zero shared code with the labs. S3 std re-derived from a presentation; full d-ladder census re-derived by central-idempotent calculus (E=f*sum chi*rho; E^2=6E, orthogonality, sum=6I, trace and rank receipts) and checked against binomial formulas; image dims from the flattened span. Lab data via globalThis.P50_LAB_DATA. Deterministic.
function rnk(M,nc,p){const A=[];for(const r of M){const o=[];for(let j=0;j<nc;j++){let v=r[j]%p;if(v<0)v+=p;o.push(v)}A.push(o)}
let k=0;for(let c=0;c<nc&&k<A.length;c++){let q=-1;for(let i=k;i<A.length;i++)if(A[i][c]!==0){q=i;break}
if(q<0)continue;const t=A[k];A[k]=A[q];A[q]=t;const pv=A[k][c];let inv=1,b=pv,e=p-2;
while(e){if(e&1)inv=inv*b%p;b=b*b%p;e>>=1}
for(let i=0;i<A.length;i++){if(i===k||A[i][c]===0)continue;const g=A[i][c]*inv%p;
for(let j=0;j<nc;j++){let v=A[i][j]-g*A[k][j]%p;if(v<0)v+=p;A[i][j]=v}}
k++}return k}
const PR=[8191,131071,524287];
function rc(M,nc){const a=rnk(M,nc,PR[0]),b=rnk(M,nc,PR[1]),c=rnk(M,nc,PR[2]);return a===b&&b===c?a:-1}
const bn=(n,k)=>{if(k<0||k>n)return 0;let r=1;for(let i=0;i<k;i++)r=Math.round(r*(n-i)/(i+1));return r};
const A2=[[0,1],[1,0]],B2=[[0,-1],[1,-1]],I2=[[1,0],[0,1]];
const m2=(X,Y)=>[[X[0][0]*Y[0][0]+X[0][1]*Y[1][0],X[0][0]*Y[0][1]+X[0][1]*Y[1][1]],[X[1][0]*Y[0][0]+X[1][1]*Y[1][0],X[1][0]*Y[0][1]+X[1][1]*Y[1][1]]];
const eq2=(X,Y)=>X[0][0]===Y[0][0]&&X[0][1]===Y[0][1]&&X[1][0]===Y[1][0]&&X[1][1]===Y[1][1];
const presOk=eq2(m2(A2,A2),I2)&&eq2(m2(B2,m2(B2,B2)),I2)&&eq2(m2(A2,m2(B2,A2)),m2(B2,B2));
const CHD=[I2[0][0]+I2[1][1],A2[0][0]+A2[1][1],B2[0][0]+B2[1][1]];
const S3=[[1,2,3],[2,1,3],[1,3,2],[3,2,1],[2,3,1],[3,1,2]];
function cls(p){if(p[0]===1&&p[1]===2&&p[2]===3)return 0;const fx=(p[0]===1?1:0)+(p[1]===2?1:0)+(p[2]===3?1:0);return fx===1?1:2}
const cc3=[0,0,0];for(const p of S3)cc3[cls(p)]++;
const clsOk=cc3[0]===1&&cc3[1]===3&&cc3[2]===2&&CHD.join()==='2,0,-1';
const mm=(X,Y)=>{const n=X.length,C=[];for(let i=0;i<n;i++){const Ci=new Array(n).fill(0);C.push(Ci);
for(let k=0;k<n;k++){const x=X[i][k];if(!x)continue;const Yk=Y[k];for(let j=0;j<n;j++)Ci[j]+=x*Yk[j]}}return C};
const eqM=(X,Y)=>X.every((r,i)=>r.every((v,j)=>v===Y[i][j]));
const trM=X=>X.reduce((s,r,i)=>s+r[i],0);
function build(d,ch,f){const n=d*d*d,E=[];for(let i=0;i<n;i++)E.push(new Array(n).fill(0));
for(const p of S3){const co=f*ch[cls(p)];
for(let a=0;a<d;a++)for(let b=0;b<d;b++)for(let c=0;c<d;c++){const w=[a,b,c],s=a*d*d+b*d+c;
E[w[p[0]-1]*d*d+w[p[1]-1]*d+w[p[2]-1]][s]+=co}}return E}
function rhoM(p,d){const n=d*d*d,M=[];for(let i=0;i<n;i++)M.push(new Array(n).fill(0));
for(let a=0;a<d;a++)for(let b=0;b<d;b++)for(let c=0;c<d;c++){const w=[a,b,c],s=a*d*d+b*d+c;
M[w[p[0]-1]*d*d+w[p[1]-1]*d+w[p[2]-1]][s]=1}return M}
const CHI=[[1,1,1],[1,-1,1],CHD];
const rows=[];
for(const d of[2,3,4,5]){
const n=d*d*d;
const E=[build(d,CHI[0],1),build(d,CHI[1],1),build(d,CHI[2],2)];
const Z=E[0].map(r=>r.map(()=>0));
const idem=E.every(X=>eqM(mm(X,X),X.map(r=>r.map(v=>6*v))));
const orth=eqM(mm(E[0],E[1]),Z)&&eqM(mm(E[0],E[2]),Z)&&eqM(mm(E[1],E[2]),Z);
const sumOk=E[0].every((r,i)=>r.every((v,j)=>v+E[1][i][j]+E[2][i][j]===(i===j?6:0)));
const m=[trM(E[0])/6,trM(E[1])/6,trM(E[2])/12];
const rk=[rc(E[0],n),rc(E[1],n),rc(E[2],n)];
const fl=S3.map(p=>{const M=rhoM(p,d);const v=[];for(let i=0;i<n;i++)for(let j=0;j<n;j++)v.push(M[i][j]);return v});
const img=rc(fl,n*n);
rows.push({d,m,rk,img,ok:idem&&orth&&sumOk&&rk[0]===m[0]&&rk[1]===m[1]&&rk[2]===2*m[2]&&img===(m[1]>0?6:5)&&m[0]===bn(d+2,3)&&m[1]===bn(d,3)})}
const ladderOk=rows.every(r=>r.ok);
const D=globalThis.P50_LAB_DATA;
if(!D)throw new Error('missing lab data');
const cA=D.a.rows.every((r,i)=>r.m.join()===rows[i].m.join()&&r.img===rows[i].img);
const R={presOk,clsOk,chiStd:CHD,rows,ladderOk,crossA:cA};
R.allOk=R.presOk&&R.clsOk&&ladderOk&&cA;
globalThis.V1A=R;
