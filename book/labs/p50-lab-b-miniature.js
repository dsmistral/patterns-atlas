// P50 Lab B — the miniature. The regular census of S3: central idempotents
// (scaled 6*p_l, integer vectors), pairwise products, the identity sum, traces;
// left/right regular images and both commutant dimensions by exact linear
// solves; Exercise 1's swap pair on C^2 (x) C^2. Deterministic.
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a||1}
const P=[];
for(let a=1;a<=3;a++)for(let b=1;b<=3;b++){if(b===a)continue;for(let c=1;c<=3;c++){if(c===a||c===b)continue;P.push([a,b,c])}}
function cyc(p){let s=0,c=0;for(let i=0;i<3;i++){if((s>>i)&1)continue;c++;let j=i;while(!((s>>j)&1)){s|=1<<j;j=p[j]-1}}return c}
function comp(p,q){return[p[q[0]-1],p[q[1]-1],p[q[2]-1]]}
const key=p=>p.join('');
const IDX={};P.forEach((p,i)=>IDX[key(p)]=i);
const T=P.map(pi=>P.map(pj=>IDX[key(comp(pi,pj))]));
if(!T[0].every((v,i)=>v===i))throw new Error('probe identity row');
const SGN={1:1,2:-1,3:1},STD={1:-1,2:0,3:2};
const L=['triv','sign','std'],F={triv:1,sign:1,std:2};
const SP={};for(const l of L)SP[l]=P.map(p=>F[l]*(l==='triv'?1:(l==='sign'?SGN[cyc(p)]:STD[cyc(p)])));
function prod(a,b){const r=[0,0,0,0,0,0];for(let i=0;i<6;i++)for(let j=0;j<6;j++)r[T[i][j]]+=a[i]*b[j];return r}
const idem=[];
for(const l of L)for(const m of L){
const got=prod(SP[l],SP[m]);
const want=l===m?SP[l].map(v=>6*v):[0,0,0,0,0,0];
idem.push({l,m,ok:got.every((v,i)=>v===want[i])});
}
const sumVec=[0,0,0,0,0,0];for(const l of L)for(let i=0;i<6;i++)sumVec[i]+=SP[l][i];
const sumOk=sumVec.join(',')==='6,0,0,0,0,0';
const traces=L.map(l=>({l,tr:SP[l][0],ok:SP[l][0]===F[l]*F[l]}));
const gateOk=1+1+4===6;
function lmat(g){const M=[];for(let i=0;i<6;i++)M.push([0,0,0,0,0,0]);for(let j=0;j<6;j++)M[T[g][j]][j]=1;return M}
function rmat(h){const M=[];for(let i=0;i<6;i++)M.push([0,0,0,0,0,0]);for(let j=0;j<6;j++)M[T[j][h]][j]=1;return M}
function commRows(A,n){const rows=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++){const row=new Array(n*n).fill(0);
for(let k=0;k<n;k++){row[r*n+k]+=A[k][c];row[k*n+c]-=A[r][k]}rows.push(row)}return rows}
function rankMod(M,nc,p){const A=M.map(r=>r.map(v=>{v%=p;return v<0?v+p:v}));let rk=0;
for(let c=0;c<nc&&rk<A.length;c++){let q=-1;for(let i=rk;i<A.length;i++)if(A[i][c]!==0){q=i;break}
if(q<0)continue;const t=A[rk];A[rk]=A[q];A[q]=t;
for(let i=rk+1;i<A.length;i++){if(A[i][c]===0)continue;const x=A[rk][c],y=A[i][c];
for(let j=0;j<nc;j++){let v=(A[i][j]*x-A[rk][j]*y)%p;if(v<0)v+=p;A[i][j]=v}}
rk++}return rk}
const PS=[8191,131071,524287];
function rankCert(M,nc){const rs=PS.map(p=>rankMod(M,nc,p));return rs[0]===rs[1]&&rs[1]===rs[2]?rs[0]:-1}
function mulM(A,B){const n=A.length,C=[];for(let i=0;i<n;i++){C.push([]);for(let j=0;j<n;j++){let s=0;for(let k=0;k<n;k++)s+=A[i][k]*B[k][j];C[i].push(s)}}return C}
function eqM(A,B){return A.every((r,i)=>r.every((v,j)=>v===B[i][j]))}
const g1=IDX[key([2,1,3])],g2=IDX[key([2,3,1])];
const leftCommDim=36-rankCert(commRows(lmat(g1),6).concat(commRows(lmat(g2),6)),36);
const rightCommDim=36-rankCert(commRows(rmat(g1),6).concat(commRows(rmat(g2),6)),36);
const rightInLeftComm=P.every((_,h)=>eqM(mulM(lmat(g1),rmat(h)),mulM(rmat(h),lmat(g1)))&&eqM(mulM(lmat(g2),rmat(h)),mulM(rmat(h),lmat(g2))));
const leftInRightComm=P.every((_,g)=>eqM(mulM(rmat(g1),lmat(g)),mulM(lmat(g),rmat(g1)))&&eqM(mulM(rmat(g2),lmat(g)),mulM(lmat(g),rmat(g2))));
function flatRank(mats,n){return rankCert(mats.map(M=>{const v=[];for(let i=0;i<n;i++)for(let j=0;j<n;j++)v.push(M[i][j]);return v}),n*n)}
const leftRank=flatRank(P.map((_,i)=>lmat(i)),6),rightRank=flatRank(P.map((_,i)=>rmat(i)),6);
const Sw=[[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]];
const swapCommDim=16-rankCert(commRows(Sw,4),16);
const R={idem,idemOk:idem.every(x=>x.ok),sumOk,traces,tracesOk:traces.every(t=>t.ok),gateOk,
leftCommDim,rightCommDim,rightInLeftComm,leftInRightComm,leftRank,rightRank,
regOk:leftCommDim===6&&rightCommDim===6&&rightInLeftComm&&leftInRightComm&&leftRank===6&&rightRank===6,
swapCommDim,swapOk:swapCommDim===10};
R.allOk=R.idemOk&&R.sumOk&&R.tracesOk&&R.gateOk&&R.regOk&&R.swapOk;
globalThis.LAB_B=R;
