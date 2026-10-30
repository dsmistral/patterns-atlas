// p10-lab — machine receipts for book/p10-pigeonhole.html (S40).
// Pure deterministic engine; executed via new Function('page', code)(html).
const out=[];let PASS=0,FAIL=0;
const ck=(s,n,c,r)=>{if(c){PASS++;out.push('PASS '+s+' '+n+': '+r);}else{FAIL++;out.push('FAIL '+s+' '+n+': '+r);}};
let seed=20261029;const rnd=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648;};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t;}return a;};
const subsets=(arr,k)=>{const res=[],n=arr.length,idx=[];for(let i=0;i<k;i++)idx.push(i);
for(;;){res.push(idx.map(i=>arr[i]));let p=k-1;while(p>=0&&idx[p]===n-k+p)p--;
if(p<0)break;idx[p]++;for(let q=p+1;q<k;q++)idx[q]=idx[q-1]+1;}return res;};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const oddPart=n=>{while(n%2===0)n/=2;return n;};
const has=s=>page.indexOf(s)!==-1;
const cnt=s=>page.split(s).length-1;
const S8=[1,2,3,4,5,6,7,8],S9=[1,2,3,4,5,6,7,8,9],S10=[1,2,3,4,5,6,7,8,9,10];
const pairHit=(s,t)=>{for(let i=0;i<s.length;i++)for(let j=i+1;j<s.length;j++)if(s[i]+s[j]===t)return true;return false;};
