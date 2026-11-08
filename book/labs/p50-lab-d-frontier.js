// P50 Lab D — S5@d=3, S4@d=4: census, hook-content, modular image dims.
function rankMod(M,nc,p){const A=M.map(r=>r.map(v=>{v%=p;return v<0?v+p:v}));let rk=0;
for(let c=0;c<nc&&rk<A.length;c++){let q=-1;for(let i=rk;i<A.length;i++)if(A[i][c]!==0){q=i;break}
if(q<0)continue;const t=A[rk];A[rk]=A[q];A[q]=t;
for(let i=rk+1;i<A.length;i++){if(A[i][c]===0)continue;const x=A[rk][c],y=A[i][c];
for(let j=0;j<nc;j++){let v=(A[i][j]*x-A[rk][j]*y)%p;if(v<0)v+=p;A[i][j]=v}}
rk++}return rk}
const PS=[8191,131071,524287];
function rankCert(M,nc){const rs=PS.map(p=>rankMod(M,nc,p));return rs[0]===rs[1]&&rs[1]===rs[2]?rs[0]:-1}
function cycOf(p,n){let s=0,c=0;for(let i=0;i<n;i++){if((s>>i)&1)continue;c++;let j=i;while(!((s>>j)&1)){s|=1<<j;j=p[j]-1}}return c}
function typeOf(p,n){const seen=new Array(n).fill(false),lens=[];for(let i=0;i<n;i++){if(seen[i])continue;let l=0,j=i;while(!seen[j]){seen[j]=true;l++;j=p[j]-1}lens.push(l)}return lens.sort().reverse().join('')}
function invArr(p){const q=new Array(p.length).fill(0);for(let i=1;i<=p.length;i++)q[p[i-1]-1]=i;return q}
function hookContent(lam,d){const cols=[];for(let j=0;j<lam[0];j++){let c=0;for(const r of lam)if(r>j)c++;cols.push(c)}
let num=1,den=1;for(let i=0;i<lam.length;i++)for(let j=0;j<lam[i];j++){num*=(d+j-i);den*=(lam[i]+cols[j]-i-j-1)}
return num/den}
function perms(n){const out=[],u=[];for(let i=1;i<=n;i++)u.push(i);
while(true){out.push(u.slice());let k=-1;for(let i=n-2;i>=0;i--)if(u[i]<u[i+1]){k=i;break}
if(k<0)break;let l=-1;for(let i=n-1;i>k;i--)if(u[i]>u[k]){l=i;break}
const t=u[k];u[k]=u[l];u[l]=t;for(let i=k+1,j=n-1;i<j;i++,j--){[u[i],u[j]]=[u[j],u[i]]}}return out}
const P5=perms(5);
if(P5.length!==120)throw new Error('probe');
const T5={'11111':[1,4,5,6,5,4,1],'2111':[1,2,1,0,-1,-2,-1],'221':[1,0,1,-2,1,0,1],
'311':[1,1,-1,0,-1,1,1],'32':[1,-1,1,0,-1,1,-1],'41':[1,0,-1,0,1,0,-1],'5':[1,-1,0,1,0,-1,1]};
const F5=[1,4,5,6,5,4,1];
const cnt5={};for(const p of P5){const t=typeOf(p,5);cnt5[t]=(cnt5[t]||0)+1}
const cntOk5=cnt5['11111']===1&&cnt5['2111']===10&&cnt5['5']===24&&Object.values(cnt5).reduce((a,b)=>a+b,0)===120;
const TY5=P5.map(p=>typeOf(p,5));
function ip5(a,b){let s=0;for(let i=0;i<120;i++)s+=T5[TY5[i]][a]*T5[TY5[i]][b];return s/120}
const orthOk5=[0,1,2,3,4,5,6].every(a=>ip5(a,a)===1)&&ip5(0,1)===0&&ip5(1,2)===0&&ip5(2,4)===0&&ip5(3,5)===0;
const LAM5=[[5],[4,1],[3,2],[3,1,1],[2,2,1],[2,1,1,1],[1,1,1,1,1]];
const m5=[0,1,2,3,4,5,6].map(a=>{let s=0;for(let i=0;i<120;i++)s+=Math.pow(3,cycOf(P5[i],5))*T5[TY5[i]][a];return s/120});
const hc5=LAM5.map(l=>hookContent(l,3));
const led5=m5.reduce((s,mi,i)=>s+mi*F5[i],0);
const img5=m5.reduce((s,mi,i)=>s+(mi>0?F5[i]*F5[i]:0),0);
const IV=P5.map(invArr);
const G5=P5.map((_,i)=>P5.map((pj,j)=>Math.pow(3,cycOf(pj.map(x=>IV[i][x-1]),5))));
const gram5=rankCert(G5,120);
let cc5=0;for(const p of P5)cc5+=Math.pow(3,2*cycOf(p,5));cc5/=120;
const s5={m:m5,hc:hc5,hcOk:m5.every((mi,i)=>mi===hc5[i]),led:led5,ledOk:led5===243,
img:img5,gram:gram5,gramOk:gram5===img5,cc:cc5,ccOk:cc5===m5.reduce((s,mi)=>s+mi*mi,0)};
const P4=perms(4);
const T4={'1111':[1,3,2,3,1],'211':[1,1,0,-1,-1],'22':[1,-1,2,-1,1],'31':[1,0,-1,0,1],'4':[1,-1,0,1,-1]};
const F4=[1,3,2,3,1];
const LAM4=[[4],[3,1],[2,2],[2,1,1],[1,1,1,1]];
const TY4=P4.map(p=>typeOf(p,4));
const m4=[0,1,2,3,4].map(a=>{let s=0;for(let i=0;i<24;i++)s+=Math.pow(4,cycOf(P4[i],4))*T4[TY4[i]][a];return s/24});
const hc4=LAM4.map(l=>hookContent(l,4));
const led4=m4.reduce((s,mi,i)=>s+mi*F4[i],0);
const img4=m4.reduce((s,mi,i)=>s+(mi>0?F4[i]*F4[i]:0),0);
const IV4=P4.map(invArr);
const G4=P4.map((_,i)=>P4.map((pj,j)=>Math.pow(4,cycOf(pj.map(x=>IV4[i][x-1]),4))));
const gram4=rankCert(G4,24);
let cc4=0;for(const p of P4)cc4+=Math.pow(4,2*cycOf(p,4));cc4/=24;
const s4={m:m4,hc:hc4,hcOk:m4.every((mi,i)=>mi===hc4[i]),led:led4,ledOk:led4===256,
img:img4,gram:gram4,gramOk:gram4===img4,cc:cc4,ccOk:cc4===m4.reduce((s,mi)=>s+mi*mi,0)};
const R={cntOk5,orthOk5,s5,s4};
R.allOk=R.cntOk5&&R.orthOk5&&s5.hcOk&&s5.ledOk&&s5.gramOk&&s5.ccOk&&s4.hcOk&&s4.ledOk&&s4.gramOk&&s4.ccOk;
globalThis.LAB_D=R;
