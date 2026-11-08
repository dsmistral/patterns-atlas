// P50 Lab E — the page's own numbers: Fig P50.1 coords parsed from the draft (harness supplies globalThis.P50_PAGE_HTML); harmonics; Box gate. Deterministic.
if(typeof globalThis.P50_PAGE_HTML!=='string')throw new Error('missing P50_PAGE_HTML');
const html=globalThis.P50_PAGE_HTML;
const i0=html.indexOf('<svg'),i1=html.indexOf('</svg>');
if(i0<0||i1<0)throw new Error('probe svg');
const svg=html.slice(i0,i1);
const rects=[];const rr=/<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"([^>]*)>/g;let m;
while((m=rr.exec(svg)))rects.push({x:+m[1],y:+m[2],w:+m[3],h:+m[4],dead:m[5].includes('fill="none"')});
const lines=[];const lr=/<line x1="(\d+)" y1="(\d+)" x2="(\d+)" y2="(\d+)"([^>]*)stroke="#fff"/g;
while((m=lr.exec(svg)))lines.push({x1:+m[1],y1:+m[2],x2:+m[3],y2:+m[4]});
const filled=rects.filter(r=>!r.dead);
const areasOk=filled.length===2&&filled[0].w*filled[0].h===3600&&filled[1].w*filled[1].h===3600;
const sumArea=filled.reduce((s,r)=>s+r.w*r.h/900,0);
const dead=rects.filter(r=>r.dead);
const deadOk=dead.length===1&&dead[0].w===30&&dead[0].h===30;
const gridV=lines.filter(l=>l.x1===l.x2&&l.y2-l.y1===30).map(l=>l.x1).sort((a,b)=>a-b);
const gridB2v=lines.filter(l=>l.x1===l.x2&&l.y2-l.y1===60).map(l=>l.x1);
const gridB2h=lines.filter(l=>l.y1===l.y2).map(l=>l.y1);
const gridOk=gridV.join(',')==='170,200,230'&&gridB2v.join(',')==='170'&&gridB2h.join(',')==='140';
const figOk=areasOk&&sumArea===8&&deadOk&&gridOk&&rects.every(r=>r.w%30===0&&r.h%30===0);
// polynomial arithmetic: monomial = exponent key 'a,b,c' -> integer coefficient
const K=(a,b,c)=>a+','+b+','+c;
function add(p,q){const r={...p};for(const k in q)r[k]=(r[k]||0)+q[k];for(const k in r)if(r[k]===0)delete r[k];return r}
const mono=(a,b,c,co)=>co?{[K(a,b,c)]:co}:{};
function lap(p){let r={};for(const k in p){const s=k.split(','),a=+s[0],b=+s[1],c=+s[2],co=p[k];
if(a>1)r=add(r,mono(a-2,b,c,co*a*(a-1)));
if(b>1)r=add(r,mono(a,b-2,c,co*b*(b-1)));
if(c>1)r=add(r,mono(a,b,c-2,co*c*(c-1)))}return r}
function mulr2(p){let r={};for(const k in p){const s=k.split(','),a=+s[0],b=+s[1],c=+s[2],co=p[k];
r=add(r,mono(a+2,b,c,co));r=add(r,mono(a,b+2,c,co));r=add(r,mono(a,b,c+2,co))}return r}
function eqP(p,q){const ks=new Set([...Object.keys(p),...Object.keys(q)]);for(const k of ks)if((p[k]||0)!==(q[k]||0))return false;return true}
if(!eqP(lap(mono(2,0,0,1)),mono(0,0,0,2)))throw new Error('probe laplacian');
const h1=eqP(lap(mono(3,0,0,1)),mono(1,0,0,6));
const h2=eqP(lap(mulr2(mono(0,0,0,1))),mono(0,0,0,6));
const h3=eqP(lap(mulr2(mono(1,0,0,1))),mono(1,0,0,10));
const com=f=>{const a=lap(mulr2(f)),b=mulr2(lap(f)),r={...a};for(const k in b)r[k]=(r[k]||0)-b[k];return r};
const c1=eqP(com(mono(0,0,0,1)),mono(0,0,0,6));
const c2=eqP(com(mono(1,0,0,1)),mono(1,0,0,10));
const c3=eqP(com(mono(2,0,0,1)),mono(2,0,0,14));
const cub=[];for(let a=0;a<=3;a++)for(let b=0;b<=3-a;b++)cub.push(K(a,b,3-a-b));
if(cub.length!==10)throw new Error('probe cubic count');
const LIN=['1,0,0','0,1,0','0,0,1'];
const M3=LIN.map(rk=>cub.map(ck=>{const o={};o[ck]=1;return lap(o)[rk]||0}));
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a||1}
function rank(M,nc){const A=M.map(r=>r.slice());let r=0;
for(let c=0;c<nc&&r<A.length;c++){let p=-1;for(let i=r;i<A.length;i++)if(A[i][c]!==0){p=i;break}
if(p<0)continue;const t=A[r];A[r]=A[p];A[p]=t;
for(let i=r+1;i<A.length;i++){if(A[i][c]===0)continue;const x=A[r][c],y=A[i][c];
for(let j=0;j<nc;j++)A[i][j]=A[i][j]*x-A[r][j]*y;
let g=0;for(const v of A[i])g=gcd(g,v);if(g>1)for(let j=0;j<nc;j++)A[i][j]/=g}
r++}return r}
const lapRank=rank(M3,10);
const h3dim=10-lapRank;
const symOk=[1,2,3,4,5,6].every(n=>{let c=0;for(let a=0;a<=n;a++)c++;return c===n+1});
const gate=(dims,n)=>dims.reduce((s,f)=>s+f*f,0)===n;
const gates={S2:gate([1,1],2),S3:gate([1,1,2],6),S4:gate([1,3,2,3,1],24),S5:gate([1,4,5,6,5,4,1],120)};
const R={fig:{figOk,sumArea},harm:{h1,h2,h3,c1,c2,c3,lapRank,h3dim},symOk,gates};
R.allOk=figOk&&h1&&h2&&h3&&c1&&c2&&c3&&h3dim===7&&symOk&&Object.values(gates).every(Boolean);
globalThis.LAB_E=R;
