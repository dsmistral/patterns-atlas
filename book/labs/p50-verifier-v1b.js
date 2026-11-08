// P50 Verifier V1b (2/3) — fresh engine part 2, zero shared code with labs: Kronecker-difference commutant nullities; GL2 block via kron; extreme census rows by brute monomial counts; Laplacian identities by exact finite differences; lab data via globalThis.P50_LAB_DATA. Deterministic.
function rnk(M,nc,p){const A=[];for(const r of M){const o=[];for(let j=0;j<nc;j++){let v=r[j]%p;if(v<0)v+=p;o.push(v)}A.push(o)}
let k=0;for(let c=0;c<nc&&k<A.length;c++){let q=-1;for(let i=k;i<A.length;i++)if(A[i][c]!==0){q=i;break}
if(q<0)continue;const t=A[k];A[k]=A[q];A[q]=t;const pv=A[k][c];let inv=1,b=pv,e=p-2;
while(e){if(e&1)inv=inv*b%p;b=b*b%p;e>>=1}
for(let i=0;i<A.length;i++){if(i===k||A[i][c]===0)continue;const g=A[i][c]*inv%p;
for(let j=0;j<nc;j++){let v=A[i][j]-g*A[k][j]%p;if(v<0)v+=p;A[i][j]=v}}
k++}return k}
const PR=[8191,131071,524287];
function rc(M,nc){const a=rnk(M,nc,PR[0]),b=rnk(M,nc,PR[1]),c=rnk(M,nc,PR[2]);return a===b&&b===c?a:-1}
const trs=M=>M[0].map((_,j)=>M.map(r=>r[j]));
function nulCom(ms,n){const I=[];for(let i=0;i<n;i++){I.push([]);for(let j=0;j<n;j++)I[i].push(i===j?1:0)}
const out=[];for(const M of ms){const A=kron(trs(M),I),B=kron(I,M);
for(let i=0;i<n*n;i++)out.push(A[i].map((v,j)=>v-B[i][j]))}
return n*n-rc(out,n*n)}
const Sw=[[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]];
const swapDim=nulCom([Sw],4);
const W8=[];for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let c=0;c<2;c++)W8.push([a,b,c]);
function sm(p){const M=[];for(let i=0;i<8;i++)M.push(new Array(8).fill(0));
for(let s=0;s<8;s++){const w=W8[s];M[w[p[0]-1]*4+w[p[1]-1]*2+w[p[2]-1]][s]=1}return M}
const cubeDim=nulCom([sm([2,1,3]),sm([2,3,1])],8);
function kron(X,Y){const n=X.length,m=Y.length,C=[];for(let i=0;i<n*m;i++){C.push([]);for(let j=0;j<n*m;j++)C[i].push(X[(i/m)|0][(j/m)|0]*Y[i%m][j%m])}return C}
const K2=[[3,-4],[4,3]],Sg=[[1,0],[0,-1]],Dg=[[2,0],[0,1]],Ug=[[1,1],[0,1]];
const RR=kron(K2,K2),SS=kron(Sg,Sg),DD=kron(Dg,Dg),UU=kron(Ug,Ug);
const Om=[1,0,0,1];
const mv=(M,v)=>M.map(r=>r.reduce((s,x,i)=>s+x*v[i],0));
const omOk=mv(RR,Om).join()==='25,0,0,25';
const Pi=Om.map(x=>Om.map(y=>x*y));
const cmm=(X,Y)=>{const n=X.length;for(let i=0;i<n;i++)for(let j=0;j<n;j++){let s=0,t=0;
for(let k=0;k<n;k++){s+=X[i][k]*Y[k][j];t+=Y[i][k]*X[k][j]}if(s!==t)return false}return true};
const piOk=cmm(Pi,RR)&&cmm(Pi,SS)&&!cmm(Pi,DD);
const dims=[nulCom([RR,SS],4),nulCom([RR,SS,DD],4),nulCom([RR,SS,DD,UU],4)];
let c5=0;for(let a=0;a<=4;a++)for(let b=0;b<=4-a;b++)if(a+b===4)c5++;
let c15=0;for(let a=0;a<=4;a++)for(let b=0;b<=4-a;b++)for(let c=0;c<=4-a-b;c++)if(a+b+c===4)c15++;
let c21=0;for(let a=0;a<=5;a++)for(let b=0;b<=5-a;b++)for(let c=0;c<=5-a-b;c++)if(a+b+c===5)c21++;
let c35=0;for(let a=0;a<=4;a++)for(let b=0;b<=4-a;b++)for(let c=0;c<=4-a-b;c++)for(let e=0;e<=4-a-b-c;e++)if(a+b+c+e===4)c35++;
let sq=0;for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let c=0;c<2;c++)for(let e=0;e<2;e++)if(a+b+c+e===4)sq++;
const ext={s4d2:[c5,0],s4d3:[c15,0],s5:[c21,0],s4d4:[c35,sq]};
const f1=(x,y,z)=>x*x*x,fr=(x,y,z)=>x*x+y*y+z*z,f0=(x,y,z)=>(x*x+y*y+z*z)*x;
const lp=f=>(x,y,z)=>f(x+1,y,z)+f(x-1,y,z)+f(x,y+1,z)+f(x,y-1,z)+f(x,y,z+1)+f(x,y,z-1)-6*f(x,y,z);
const lapOk=[[0,0,0],[1,2,3],[2,-1,1],[-3,1,4]].every(pt=>lp(f1)(pt[0],pt[1],pt[2])===6*pt[0]&&lp(fr)(pt[0],pt[1],pt[2])===6&&lp(f0)(pt[0],pt[1],pt[2])===10*pt[0]);
const D=globalThis.P50_LAB_DATA;
if(!D)throw new Error('missing lab data');
const cB=D.b.swapCommDim===swapDim;
const cC=D.c.rows[0].m[0]===ext.s4d2[0]&&D.c.rows[0].m[4]===ext.s4d2[1]&&D.c.rows[1].m[0]===ext.s4d3[0]&&D.c.rows[1].m[4]===ext.s4d3[1];
const cD=D.d.s5.m[0]===ext.s5[0]&&D.d.s5.m[6]===ext.s5[1]&&D.d.s4.m[0]===ext.s4d4[0]&&D.d.s4.m[4]===ext.s4d4[1];
const cF=D.f.o2.cO2===dims[0]&&D.f.o2.cGL===dims[1]&&D.f.o2.cGLu===dims[2]&&D.f.cube.cubeDim===cubeDim;
const R={swapDim,cubeDim,omOk,piOk,dims,ext,lapOk,gates:[2,6,24,120],cross:{cB,cC,cD,cF}};
R.allOk=R.omOk&&R.piOk&&R.swapDim===10&&R.cubeDim===20&&R.dims.join()==='3,2,2'&&R.ext.s5[0]===21&&R.ext.s4d4[0]===35&&R.ext.s4d2[0]===5&&R.ext.s4d3[0]===15&&R.ext.s4d4[1]===1&&R.lapOk&&cB&&cC&&cD&&cF;
globalThis.V1B=R;
