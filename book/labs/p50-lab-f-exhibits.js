// P50 Lab F — exhibits: F2 receipts; O2 vs GL2 commutants (3 -> 2) with Pi; d=2 cube 64-unknown commutant solve. Deterministic.
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a||1}
function rankMod(M,nc,p){const A=M.map(r=>r.map(v=>{v%=p;return v<0?v+p:v}));let rk=0;
for(let c=0;c<nc&&rk<A.length;c++){let q=-1;for(let i=rk;i<A.length;i++)if(A[i][c]!==0){q=i;break}
if(q<0)continue;const t=A[rk];A[rk]=A[q];A[q]=t;
for(let i=rk+1;i<A.length;i++){if(A[i][c]===0)continue;const x=A[rk][c],y=A[i][c];
for(let j=0;j<nc;j++){let v=(A[i][j]*x-A[rk][j]*y)%p;if(v<0)v+=p;A[i][j]=v}}
rk++}return rk}
const PS=[8191,131071,524287];
function rankCert(M,nc){const rs=PS.map(p=>rankMod(M,nc,p));return rs[0]===rs[1]&&rs[1]===rs[2]?rs[0]:-1}
// F2 receipts
const g2=[[1,1],[0,1]],N2=[[0,1],[0,0]];
const mm2=(A,B)=>[[0,1],[1,0]].map((_,i)=>[0,1].map(j=>(A[i][0]*B[0][j]+A[i][1]*B[1][j])%2));
const eq2=(A,B)=>A.every((r,i)=>r.every((v,j)=>v===B[i][j]));
if(!eq2(mm2(N2,N2),[[0,0],[0,0]]))throw new Error('probe N^2');
const n2sq=eq2(mm2(N2,N2),[[0,0],[0,0]]);
const gE1=eq2(mm2(g2,[[1,0],[0,0]]),[[1,0],[0,0]]);
const eg=[[(1+g2[0][0])%2,g2[0][1]%2],[g2[1][0]%2,(1+g2[1][1])%2]];
const avgFails=!eq2(eg,[[0,0],[0,0]])&&[0,1].every(x=>(2*x)%2===0);
let commF2=true;
for(const a of[0,1])for(const b of[0,1])for(const c of[0,1])for(const d of[0,1]){
const L=[[a,b],[0,a]],M2=[[c,d],[0,c]];
if(!eq2(mm2(L,M2),mm2(M2,L)))commF2=false}
const noComp=[0,1].every(x=>{const gx=[(x+1)%2,1];let ok=false;
for(const l of[0,1]){const lx=[(l*x)%2,l];if(lx[0]===gx[0]&&lx[1]===gx[1])ok=true}return !ok});
const gateF2=1!==2;
// 4x4 integer matrices on basis e1*e1, e1*e2, e2*e1, e2*e2
const I4=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
const Sw=[[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]];
const A=[[9,-12,-12,16],[12,9,-16,-12],[12,-16,9,-12],[16,12,12,9]];
const B=[[1,0,0,0],[0,-1,0,0],[0,0,-1,0],[0,0,0,1]];
const Dg=[[4,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,1]];
const Ug=[[1,1,1,1],[0,1,0,1],[0,0,1,1],[0,0,0,1]];
const Pi=[[1,0,0,1],[0,0,0,0],[0,0,0,0],[1,0,0,1]];
const Om=[1,0,0,1];
function mul(A,B){const n=A.length,C=[];for(let i=0;i<n;i++){C.push([]);for(let j=0;j<n;j++){let s=0;for(let k=0;k<n;k++)s+=A[i][k]*B[k][j];C[i].push(s)}}return C}
function eqM(A,B){return A.every((r,i)=>r.every((v,j)=>v===B[i][j]))}
const mV=(M,v)=>M.map(r=>r.reduce((s,x,i)=>s+x*v[i],0));
const omOk=eqM(mV(A,Om).map(x=>[x]),[[25],[0],[0],[25]]);
const piCommAB=eqM(mul(Pi,A),mul(A,Pi))&&eqM(mul(Pi,B),mul(B,Pi));
const piFailD=!eqM(mul(Pi,Dg),mul(Dg,Pi));
const flat=mats=>mats.map(M=>{const v=[];for(let i=0;i<4;i++)for(let j=0;j<4;j++)v.push(M[i][j]);return v});
const span3=rankCert(flat([I4,Sw,Pi]),16);
function commRows(Mats,n){const rows=[];for(const X of Mats)for(let r=0;r<n;r++)for(let c=0;c<n;c++){
const row=new Array(n*n).fill(0);for(let k=0;k<n;k++){row[r*n+k]+=X[k][c];row[k*n+c]-=X[r][k]}rows.push(row)}return rows}
const cO2=16-rankCert(commRows([A,B],4),16);
const cGL=16-rankCert(commRows([A,B,Dg],4),16);
const cGLu=16-rankCert(commRows([A,B,Dg,Ug],4),16);
const inC=eqM(mul(Sw,A),mul(A,Sw))&&piCommAB;
// d=2 cube: 8 words, slot-permutation matrices, 64-unknown commutant solve
const words=[];for(let i=0;i<2;i++)for(let j=0;j<2;j++)for(let k=0;k<2;k++)words.push([i,j,k]);
function pmat(p){const ip=[0,1,2,3].map(i=>i===0?0:p.indexOf(i)+1);
const M=[];for(let t=0;t<8;t++)M.push([0,0,0,0,0,0,0,0]);
for(let s=0;s<8;s++){const w=words[s];const t4=[w[ip[1]-1],w[ip[2]-1],w[ip[3]-1]];
M[t4[0]*4+t4[1]*2+t4[2]][s]=1}return M}
const M12=pmat([2,1,3]),M123=pmat([2,3,1]);
const tr=M=>M.reduce((s,r,i)=>s+r[i],0);
if(tr(M12)!==4||tr(M123)!==2)throw new Error('probe traces');
const cubeDim=64-rankCert(commRows([M12,M123],8),64);
const R={f2:{n2sq,gE1,avgFails,commF2,noComp,gateF2},
o2:{omOk,piCommAB,piFailD,span3,cO2,cGL,cGLu,inC},cube:{cubeDim}};
R.allOk=R.f2.n2sq&&R.f2.gE1&&R.f2.avgFails&&R.f2.commF2&&R.f2.noComp&&R.f2.gateF2
&&R.o2.omOk&&R.o2.piCommAB&&R.o2.piFailD&&R.o2.span3===3&&R.o2.cO2===3&&R.o2.cGL===2&&R.o2.cGLu===2&&R.o2.inC&&R.cube.cubeDim===20;
globalThis.LAB_F=R;
