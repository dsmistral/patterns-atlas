// P50 Verifier V1c (3/3) — poison harness: every detector the fresh engine relies on must REJECT a deliberately corrupted input; unpoisoned controls must pass. Injections: poisoned std character, poisoned census data, poisoned kron witness, poisoned Pi, poisoned swap, poisoned want, poisoned sign. Lab data via globalThis.P50_LAB_DATA. Deterministic.
function rnk(M,nc,p){const A=[];for(const r of M){const o=[];for(let j=0;j<nc;j++){let v=r[j]%p;if(v<0)v+=p;o.push(v)}A.push(o)}
let k=0;for(let c=0;c<nc&&k<A.length;c++){let q=-1;for(let i=k;i<A.length;i++)if(A[i][c]!==0){q=i;break}
if(q<0)continue;const t=A[k];A[k]=A[q];A[q]=t;const pv=A[k][c];let inv=1,b=pv,e=p-2;
while(e){if(e&1)inv=inv*b%p;b=b*b%p;e>>=1}
for(let i=0;i<A.length;i++){if(i===k||A[i][c]===0)continue;const g=A[i][c]*inv%p;
for(let j=0;j<nc;j++){let v=A[i][j]-g*A[k][j]%p;if(v<0)v+=p;A[i][j]=v}}
k++}return k}
const S3=[[1,2,3],[2,1,3],[1,3,2],[3,2,1],[2,3,1],[3,1,2]];
function cls(p){if(p[0]===1&&p[1]===2&&p[2]===3)return 0;const fx=(p[0]===1?1:0)+(p[1]===2?1:0)+(p[2]===3?1:0);return fx===1?1:2}
function build(ch,f){const E=[];for(let i=0;i<8;i++)E.push(new Array(8).fill(0));
for(const p of S3){const co=f*ch[cls(p)];
for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let c=0;c<2;c++){const w=[a,b,c],s=a*4+b*2+c;
E[w[p[0]-1]*4+w[p[1]-1]*2+w[p[2]-1]][s]+=co}}return E}
const mm=(X,Y)=>{const n=X.length,m=Y[0].length,C=[];for(let i=0;i<n;i++){const Ci=new Array(m).fill(0);C.push(Ci);for(let k=0;k<Y.length;k++){const x=X[i][k];if(!x)continue;const Yk=Y[k];for(let j=0;j<m;j++)Ci[j]+=x*Yk[j]}}return C};
const eqM=(X,Y)=>X.every((r,i)=>r.every((v,j)=>v===Y[i][j]));
const Z=E=>E.map(r=>r.map(()=>0));
const idm=E=>eqM(mm(E,E),E.map(r=>r.map(v=>6*v)));
// p1: std character poisoned at 3-cycles (-1 -> 1) must break idempotence (transposition poison invisible: word module has no sign component)
const ctl1=idm(build([2,0,-1],2));
const poi1=!idm(build([2,0,1],2));
// p2: corrupted census data must mismatch the fresh d=2 census
const Et=build([1,1,1],1),Es=build([1,-1,1],1),Ed=build([2,0,-1],2);
const trE=E=>E.reduce((s,r,i)=>s+r[i],0);
const fm=[trE(Et)/6,trE(Es)/6,trE(Ed)/12];
const D=globalThis.P50_LAB_DATA;
if(!D)throw new Error('missing lab data');
const row=D.a.rows[0].m;
const ctl2=fm.join()===row.join();
const rp=row.slice();rp[0]=rp[0]+1;
const poi2=fm.join()!==rp.join();
// p3: poisoned kron witness must break Omega-invariance
const kron=(X,Y)=>{const C=[];for(let i=0;i<4;i++){C.push([]);for(let j=0;j<4;j++)C[i].push(X[(i/2)|0][(j/2)|0]*Y[i%2][j%2])}return C};
const K2=[[3,-4],[4,3]],Sg=[[1,0],[0,-1]];
const RR=kron(K2,K2);
const Om=[1,0,0,1];
const mv=(M,v)=>M.map(r=>r.reduce((s,x,i)=>s+x*v[i],0));
const ctl3=mv(RR,Om).join()==='25,0,0,25';
const poi3=mv(kron([[4,-4],[4,3]],K2),Om).join()!=='25,0,0,25';
// p4: poisoned Pi must stop commuting with the O2 image
const cmm=(X,Y)=>eqM(mm(X,Y),mm(Y,X));
const Pi=Om.map(x=>Om.map(y=>x*y));
const ctl4=cmm(Pi,RR);
const Pip=Pi.map(r=>r.slice());Pip[0][3]=0;
const poi4=!cmm(Pip,RR);
// p5: poisoned swap must change the commutant nullity (Kronecker difference)
const trs=M=>M[0].map((_,j)=>M.map(r=>r[j]));
function nulCom(ms,n){const out=[];for(const M of ms){const Mt=trs(M);
for(let i=0;i<n*n;i++){const r=new Array(n*n).fill(0);
for(let j=0;j<n*n;j++)r[j]=Mt[(i/n)|0][(j/n)|0]*((i%n)===(j%n)?1:0)-(((i/n)|0)===((j/n)|0)?1:0)*M[i%n][j%n];
out.push(r)}}
return n*n-rnk(out,n*n,131071)}
const Sw=[[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]];
const ctl5=nulCom([Sw],4)===10;
const Swp=Sw.map(r=>r.slice());Swp[0][0]=0;
const poi5=nulCom([Swp],4)!==10;
// p6: a poisoned want (commutant dim 4 instead of 3) must be rejected
const d6=nulCom([RR,kron(Sg,Sg)],4);
const ctl6=d6===3;
const poi6=d6!==4;
// p7: sign character poisoned to all-ones must break orthogonality
const ctl7=eqM(mm(Et,Es),Z(Et));
const poi7=!eqM(mm(Et,build([1,1,1],1)),Z(Et));
const ctl=[ctl1,ctl2,ctl3,ctl4,ctl5,ctl6,ctl7];
const poi=[poi1,poi2,poi3,poi4,poi5,poi6,poi7];
const R={ctl,poi};
R.allOk=ctl.every(Boolean)&&poi.every(Boolean);
globalThis.V1C=R;
