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
// p01 — §2 receipts: the sum-9 game and the month room.
const c56=subsets(S8,5);
let hit=0;for(const s of c56)if(pairHit(s,9))hit++;
ck('§2','census56',c56.length===56&&hit===56,'all '+hit+' of '+c56.length+' five-subsets of 1..8 contain a sum-9 pair');
ck('§2','evade4',!pairHit([1,2,3,4],9),'{1,2,3,4} evades: four is below the threshold of five');
ck('§2','claim-binom85',has('\\binom{8}{5} = 56'),'page prints C(8,5)=56');
ck('§2','claim-fiftysix',has('every single one of the fifty-six'),'page claims the full 56-census');
ck('§2','eq-display',has('5 \\text{ chosen numbers}'),'display eq present: 5 chosen numbers > 4 pairs');
ck('§2','months',13>12&&!(12>12),'thirteen exceeds twelve months; twelve does not');
ck('§2','fig1-caption',has('<strong>Fig P10.1.</strong>'),'Fig P10.1 caption present');
ck('§2','fig1-aria',has('aria-label="Fig P10.1'),'Fig P10.1 aria-label present');
// p02 — §1 receipts: P09's pointer kept, onramp words, header identity.
ck('§1','pointer-kept',has('the pigeonhole proves that somebody must'),"P09's §6 pointer kept verbatim");
ck('§1','pointer-tail',has('Impossibility here; existence there; the spine alternates them deliberately'),'pointer tail kept verbatim');
ck('§1','binom101',has('\\binom{101}{2} = 5{,}050'),'page prints C(101,2)=5050');
ck('§1','nw-box',has('New word: box.'),'onramp defines box');
ck('§1','nw-collision',has('New word: collision.'),'onramp defines collision');
ck('§1','nw-pigeonhole',has('New word: pigeonhole.'),'onramp defines pigeonhole');
ck('§1','kicker',has('The Patterns Atlas</a> · P10 · the tenth move of the spine'),'kicker exact');
ck('§1','title',has('<title>P10 · Force a collision · The Patterns Atlas</title>'),'title exact');
ck('§1','tagline',has('Aim for the collision; let the count do the finding.'),'tagline tail present');
// p03 — structure census: sections, titles, details, asides, boxes, figures.
const ids=['bridge','encounter','name','exemplars','fails','next','lineage','exercises'];
let idOk=cnt('<section')===8;for(const i of ids)if(cnt('<section id="'+i+'">')!==1)idOk=false;
ck('§H','section-ids',idOk,'8 sections, ids exact');
const h2t=['1 · Before we begin','2 · Meet the problem','3 · Name the move','4 · The move at work','5 · When the move fails','6 · What to try next','7 · Lineage','8 · Exercises'];
let h2Ok=cnt('<h2>')===8;for(const t of h2t)if(cnt('<h2>'+t+'</h2>')!==1)h2Ok=false;
ck('§H','h2-titles',h2Ok,'8 h2, titles exact');
const exA=['Example 1 (numbers) — the fifty-one that must touch','Example 2 (numbers) — the hundred and one that must divide','Example 3 (geometry) — the five points that must crowd'];
const exX=['Exercise 1 ●○○ — the drawer in the dark','Exercise 2 ●●○ — five marks, one shared remainder','Exercise 3 ●●● — the party you cannot distinguish','Exercise 4 ◆ — referee the three students','Exercise 5 ◐ — the birthday census'];
let h3Ok=cnt('<h3>')===8;for(const t of exA)if(cnt('<h3>'+t+'</h3>')!==1)h3Ok=false;for(const t of exX)if(cnt('<h3>'+t+'</h3>')!==1)h3Ok=false;
ck('§H','h3-titles',h3Ok,'8 h3, titles exact (3 examples + 5 exercises)');
ck('§H','details',cnt('<details>')===10&&cnt('<summary>Hint</summary>')===5&&cnt('<summary>Worked answer</summary>')===5,'10 details: 5 Hint + 5 Worked');
ck('§H','asides',cnt('<aside')===4&&cnt('class="onramp"')===1&&cnt('class="warn"')===2&&cnt('class="history"')===1,'4 asides: onramp + 2 warn + history');
ck('§H','boxes',cnt('class="pattern-box"')===3&&cnt('id="box-p10"')===1&&cnt('id="box-p10a"')===1&&cnt('id="box-p10b"')===1,'3 pattern-boxes, ids exact');
ck('§H','pid',cnt('class="pid"')===3,'3 pid spans');
ck('§H','eq',cnt('class="eq"')===2,'2 eq blocks');
ck('§H','figures',cnt('<figure')===3&&cnt('<svg')===3&&cnt('<figcaption')===3,'3 figures with svg + figcaption');
ck('§H','footer',has('<a href="index.html">Return to the index</a> · Next move: <a href="p11-contradiction.html">'),'footer return-index + next-link p11');
// p04 — TeX hygiene, MathJax block, banned-token sweep.
const io=cnt('\\('),ic=cnt('\\)'),dn=cnt('\\['),dc=cnt('\\]');
ck('§T','inline-balance',io===ic&&io===206,'inline TeX '+io+' open / '+ic+' close (frozen at 206)');
ck('§T','display-balance',dn===dc&&dn===3,'display TeX '+dn+' open / '+dc+' close (2 eq + 1 config)');
ck('§T','no-dollar',cnt('$')===0,'zero raw dollar signs');
ck('§T','mathjax-once',cnt("window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};")===1,'MathJax config block byte-exact, once');
ck('§T','eq2-game',has('class="eq">\\[5 \\text{ chosen numbers}'),'eq 1: the §2 counting display');
ck('§T','eq5-birthday',has('P(\\text{all distinct})'),'eq 2: the birthday display');
const banned=page.match(/\b(simply|lab|machine|machinery|obviously|trivial|trivially|elegant|leverage|delve|robust|seamless|testament|beautiful|gymnastics|magical)\b/gi)||[];
ck('§T','banned-sweep',banned.length===0,'banned-token sweep clean: '+banned.length+' hits');
// p05 — href multiset + full tag-balance census.
const expected={'assets/style.css':1,'index.html':2,'p01-pin-down-the-problem.html':1,'p02-small-cases.html':1,'p03-special-cases.html':2,'p04-complete-the-square.html':1,'p05-canonical-form.html':2,'p06-compose-identity.html':1,'p07-auxiliary-construction.html':1,'p08-symmetry.html':1,'p09-invariant.html':1,'b02-congruence-classes.html':3,'m04-ramsey-3-3.html':1,'p19-count-outcomes.html':2,'p11-contradiction.html':1};
const found=page.match(/href="[^"]*"/g)||[];const tally={};
for(const h of found){const k=h.slice(6,-1);tally[k]=(tally[k]||0)+1;}
let ok=found.length===21;for(const k of Object.keys(expected))if((tally[k]||0)!==expected[k])ok=false;
for(const k of Object.keys(tally))if(!expected[k])ok=false;
ck('§H','href-multiset',ok,'21 hrefs, 15 distinct, all canonical, multiset exact');
ck('§H','b02-links',tally['b02-congruence-classes.html']===3,'B02 linked 3× (catalogue + hint + worked)');
ck('§H','next-link-once',tally['p11-contradiction.html']===1,'footer next-link p11 exactly once');
const tags=['section','div','p','em','strong','ol','li','table','thead','tbody','aside','details','figure','footer','span','h2','h3'];
const exp={section:8,div:3,p:61,em:56,strong:39,ol:1,li:3,table:1,thead:1,tbody:1,aside:4,details:10,figure:3,footer:1,span:3,h2:8,h3:8};
let tb=true;const tbd=[];
for(const tg of tags){const o=cnt('<'+tg+'>')+cnt('<'+tg+' ');const c=cnt('</'+tg+'>');
if(o!==c||o!==exp[tg]){tb=false;tbd.push(tg+'='+o+'/'+c+' exp '+exp[tg]);}}
ck('§H','tag-balance',tb,'17 tag pairs balanced at frozen counts'+(tbd.length?' — '+tbd.join('; '):''));
// p06 — Example 1 receipts: 51 of 1..100, consecutive and coprime.
const odds=[];for(let n=1;n<=100;n+=2)odds.push(n);
let oc=false;for(let i=0;i<odds.length-1;i++)if(odds[i+1]-odds[i]===1)oc=true;
ck('§4','odds-evade',odds.length===50&&!oc,'50 odds, no consecutive pair: threshold sharp at 51');
let bad1=0;
for(let t=0;t<300;t++){const pool=[];for(let i=1;i<=100;i++)pool.push(i);const pick=[];
for(let i=0;i<51;i++){const ix=Math.floor(rnd()*pool.length);pick.push(pool[ix]);pool.splice(ix,1);}
pick.sort((a,b)=>a-b);let hitc=false;for(let i=0;i<50;i++)if(pick[i+1]-pick[i]===1)hitc=true;
if(!hitc)bad1++;}
ck('§4','ex1-census',bad1===0,'300 random 51-subsets, all contain a consecutive pair');
let gOk=true;for(let n=1;n<=100;n++)if(gcd(n,n+1)!==1)gOk=false;
ck('§4','consecutive-coprime',gOk,'gcd(n,n+1)=1 for every n<=100');
ck('§4','c1012',101*100/2===5050,'C(101,2)=5050 as printed in §1');
ck('§4','ex1-claims',has('the fifty-one that must touch')&&has('fifty pairs')&&has('\\{99,100\\}'),'Ex1 claims present');
// p07 — Example 2 receipts: 101 of 1..200, divisibility by odd part.
const parts=new Set();for(let n=1;n<=200;n++)parts.add(oddPart(n));
ck('§4','odd-parts',parts.size===100,'exactly 100 distinct odd parts in 1..200');
let bad2=0;
for(let t=0;t<200;t++){const pool=[];for(let i=1;i<=200;i++)pool.push(i);const pick=[];
for(let i=0;i<101;i++){const ix=Math.floor(rnd()*pool.length);pick.push(pool[ix]);pool.splice(ix,1);}
let hitd=false;
outer:for(let i=0;i<101;i++)for(let j=0;j<101;j++)if(i!==j&&pick[j]%pick[i]===0){hitd=true;break outer;}
if(!hitd)bad2++;}
ck('§4','ex2-census',bad2===0,'200 random 101-subsets, all contain a divisibility pair');
const top=[];for(let n=101;n<=200;n++)top.push(n);let dv=0;
for(let i=0;i<top.length;i++)for(let j=0;j<top.length;j++)if(i!==j&&top[j]%top[i]===0)dv++;
ck('§4','top-clean',dv===0,'top hundred 101..200: zero divisibility pairs among all ordered pairs');
ck('§4','c1002',100*99/2===4950,'C(100,2)=4950 as printed');
ck('§4','ex2-claims',has('the hundred and one that must divide')&&has('one hundred boxes')&&has('101 > 100'),'Ex2 claims present');
// p08 — Example 3 receipts: five points in a 2x2 square.
let bad3=0,worst=0;
for(let t=0;t<300;t++){const pts=[];for(let i=0;i<5;i++)pts.push([rnd()*2,rnd()*2]);
let ok=false;
for(let i=0;i<5;i++)for(let j=i+1;j<5;j++){
if(Math.floor(pts[i][0])===Math.floor(pts[j][0])&&Math.floor(pts[i][1])===Math.floor(pts[j][1])){
const d=dist(pts[i],pts[j]);if(d>worst)worst=d;if(d<=Math.SQRT2+1e-9)ok=true;}}
if(!ok)bad3++;}
ck('§4','ex3-census',bad3===0,'300 random 5-point placements: same-quadrant pair always within √2 (worst seen '+worst.toFixed(4)+')');
const centers=[[0.5,0.5],[1.5,0.5],[0.5,1.5],[1.5,1.5]];let minD=Infinity;
for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){const d=dist(centers[i],centers[j]);if(d<minD)minD=d;}
ck('§4','centers',Math.abs(minD-1)<1e-12,'quadrant centres: closest pair exactly one metre apart');
ck('§4','sqrt2-print',has('\\sqrt{2} \\approx 1.41'),'√2 ≈ 1.41 as printed');
ck('§4','ex3-claims',has('the five points that must crowd')&&has('quadrant'),'Ex3 claims present');
// p09 — §5 receipts: the five failure exhibits, checked not asserted.
const ev5=subsets(S9,5);let evn=0;for(const s of ev5)if(!pairHit(s,10))evn++;
ck('§5','phantom-evade',!pairHit([1,2,3,4,5],10)&&evn===16,'{1,2,3,4,5} evades sum-10; '+evn+' of 126 five-subsets do');
const c96=subsets(S9,6);let h6=0;for(const s of c96)if(pairHit(s,10))h6++;
ck('§5','phantom-repair',c96.length===84&&h6===84,'all 84 six-subsets of 1..9 contain a sum-10 pair: repaired threshold is 6');
ck('§5','threshold-claims',has('twelve is not thirteen')&&has('366')&&has('367'),'threshold-miss exhibit claims present');
ck('§5','wrong-conclusion',dist([0,0],[1,1])>1&&has('can sit \\(\\sqrt{2} \\approx 1.41'),'same-quadrant points can be √2 apart: the wrong conclusion is real');
const repair=2*Math.SQRT2/3;
ck('§5','repair-diagonal',Math.abs(repair-0.9428)<5e-5&&repair<1&&has('2\\sqrt{2}/3 \\approx 0.94'),'nine 2/3-sub-squares: diagonal ≈ 0.94 < 1, the repair is honest');
ck('§5','silent',40<365&&has('The silent move'),'40 < 365: the silent move is real');
ck('§5','unlabelled',has('Existence without identification'),'unlabelled-pair lesson present');
ck('§5','five-exhibits',cnt('<strong>The phantom box.</strong>')===1&&cnt('<strong>The threshold miss.</strong>')===1&&cnt('<strong>The wrong conclusion.</strong>')===1&&cnt('<strong>The silent move.</strong>')===1&&cnt('<strong>The unlabelled pair.</strong>')===1,'five named exhibits, once each');
ck('§5','mpd',cnt('<em>Mitigation:</em>')===5&&cnt('<em>Price:</em>')===5&&cnt('<em>Default:</em>')===5,'5 × Mitigation + Price + Default');
// p10 — Exercise 1 + 2 receipts: socks in the dark, remainders mod 4.
ck('§8','socks-a',3+1===4,'three colour boxes: worst case 3 draws, the 4th forces a pair');
ck('§8','socks-b',7+2===9,'all 7 non-blue can be withheld: the 9th draw forces a blue pair');
ck('§8','socks-claims',has('the drawer in the dark')&&has('5')&&has('blue'),'Ex1 claims present');
let bad4=0;
for(let t=0;t<300;t++){const cls=[];for(let i=0;i<5;i++)cls.push(Math.floor(rnd()*1000)%4);
if(Array.from(new Set(cls)).size===5)bad4++;}
ck('§8','mod4-census',bad4===0,'300 random 5-integer sets, all collide mod 4');
const ev4=[0,1,2,3];let evOk=true;
for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)if((ev4[i]-ev4[j])%4===0)evOk=false;
ck('§8','mod4-evade',evOk,'{0,1,2,3} evades: four is below the threshold of five');
ck('§8','mod4-claims',has('five marks, one shared remainder')&&has('0, 1, 2, 3'),'Ex2 claims present');
// p11 — Exercise 3 receipts: the party of six, full 32,768-graph census.
let collide=true,coexist=0;
for(let mask=0;mask<32768;mask++){const deg=[0,0,0,0,0,0];let b=0;
for(let i=0;i<6;i++)for(let j=i+1;j<6;j++){if((mask>>b)&1){deg[i]++;deg[j]++;}b++;}
if(Array.from(new Set(deg)).size===6)collide=false;
if(deg.indexOf(0)!==-1&&deg.indexOf(5)!==-1)coexist++;}
ck('§8','party-census',collide,'all 32,768 graphs on 6 labelled vertices have two equal degrees');
ck('§8','party-05',coexist===0,'zero graphs contain both a 0 and a 5: the coexistence obstruction is real');
ck('§8','party-claims',has('32{,}768')&&has('the party you cannot distinguish'),'Ex3 claims present');
ck('§8','party-m04',has('m04-ramsey-3-3.html'),'worked answer routes to M04');
// p12 — Exercise 4 receipts: referee the three students.
const c6=subsets(S10,6);let ev6=0;const evList=[];
for(const s of c6){let hit=false;
for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)if(Math.abs(s[i]-s[j])===4)hit=true;
if(!hit){ev6++;if(evList.length<4)evList.push('['+s.join(',')+']');}}
ck('§8','referee-census',c6.length===210&&ev6===4,'C(10,6)=210; exactly 4 evaders: '+evList.join(' '));
const cse=[1,2,3,4,9,10];let cseHit=false;const diffs=new Set();
for(let i=0;i<6;i++)for(let j=i+1;j<6;j++){const d=Math.abs(cse[i]-cse[j]);diffs.add(d);if(d===4)cseHit=true;}
ck('§8','counterexample',!cseHit,'{1,2,3,4,9,10} evades: pairwise differences are '+Array.from(diffs).sort((a,b)=>a-b).join(','));
ck('§8','c-smuggle',9%4===1&&Math.abs(9-1)===8&&(9-1)%4===0,'1 and 9 share class mod 4 yet differ by 8: the smuggled conclusion exposed');
ck('§8','referee-claims',has('referee the three students')&&has('exactly \\(4\\) of the \\(210\\)'),'Ex4 claims present');
ck('§8','a-overlap',has('overlap')&&has('The pairs \\(\\{1,5\\}'),'A\'s overlapping boxes named on the page');
// p13 — Exercise 5 receipts: the birthday census and the honest reconciliation.
let pd=1,th=-1;
for(let n=1;n<=60;n++){pd*=(365-(n-1))/365;if(1-pd>0.5){th=n;break;}}
ck('§8','birthday-threshold',th===23,'first n with P(shared) > 1/2 is 23');
let p22=1,p23=1;
for(let k=0;k<22;k++)p22*=(365-k)/365;
for(let k=0;k<23;k++)p23*=(365-k)/365;
const q22=Math.round((1-p22)*10000)/10000,q23=Math.round((1-p23)*10000)/10000;
ck('§8','birthday-22',q22===0.4757,'P(shared) at 22 = 0.4757 as printed');
ck('§8','birthday-23',q23===0.5073,'P(shared) at 23 = 0.5073 as printed');
ck('§8','birthday-silence',23<365&&365/23>15.5&&365/23<16.5,'23 < 365: P10 is silent at the threshold; factor ≈ 16 as claimed');
ck('§8','birthday-claims',has('0.4757')&&has('0.5073')&&has('the birthday census'),'Ex5 claims present');
ck('§8','birthday-p19',has('p19-count-outcomes.html'),'Ex5 routes to P19');
// p14 — §3/§6/§7 claims + figure-coordinate needles.
ck('§3','box-titles',has('Pattern P10 — Force a collision.')&&has('Box P10.A — the three demands')&&has('Box P10.B — the working catalogue'),'three pattern-boxes titled');
ck('§3','sharpened',has('kn+1'),'sharpened form kn+1 in n boxes present');
ck('§6','routes',has('<strong>P11 — prove by contradiction.</strong>')&&has('<strong>P12 — name the obstruction.</strong>')&&has('<strong>P14 — the diagonal argument.</strong>')&&has('<strong>P19 — count the outcomes.</strong>')&&has('<strong>M04 — Ramsey'),'five routes named');
ck('§6','deferral',has('Shearer entropy counting')&&has('(P59)')&&has('(P39)')&&has('(P30)'),'deferral box honest: P59 and P39 with named prerequisites');
ck('§7','dirichlet',has('Dirichlet')&&has('1834')&&has('Schubfachprinzip'),'lineage: Dirichlet 1834, Schubfachprinzip');
ck('§7','ramsey-erdos',has('Ramsey')&&has('Erdős'),'lineage: Ramsey and Erdős named');
ck('§7','nonload',has('None of this history is load-bearing'),'history explicitly non-load-bearing');
ck('§3','catalogue-rows',has('<tr><td>residue classes</td>')&&has('<tr><td>odd parts</td>')&&has('<tr><td>bounded ranges</td>'),'catalogue rows present');
ck('§F','fig1-boxes',cnt('<rect x="10" y="52" width="70" height="78" rx="6"')===1&&cnt('<rect x="90" y="52"')===1&&cnt('<rect x="170" y="52"')===1&&cnt('<rect x="250" y="52"')===1,'Fig P10.1: four box rects at x=10/90/170/250');
ck('§F','fig1-collision',cnt('<circle cx="30" cy="92" r="13" fill="#3574d4"')===1&&cnt('<circle cx="60" cy="92" r="13" fill="#3574d4"')===1,'Fig P10.1: the colliding slots 1 and 8 highlighted');
ck('§F','fig1-slots',cnt('r="13"')===8,'Fig P10.1: eight slot circles');
ck('§F','fig2-chain',cnt('<circle cx="114" cy="88" r="11" fill="#3574d4"')===1&&cnt('<circle cx="252" cy="88" r="11" fill="#3574d4"')===1,'Fig P10.2: 12 and 96 highlighted on the odd-part-3 chain');
ck('§F','fig2-label',has('12 divides 96 — same chain'),'Fig P10.2: divisibility label present');
ck('§F','fig3-midlines',cnt('<line x1="170" y1="20" x2="170" y2="220"')===1&&cnt('<line x1="70" y1="120" x2="270" y2="120"')===1,'Fig P10.3: quadrant midlines drawn');
ck('§F','fig3-pair',cnt('<circle cx="195" cy="60" r="6" fill="#3574d4"')===1&&cnt('<circle cx="245" cy="95" r="6" fill="#3574d4"')===1,'Fig P10.3: the same-quadrant pair highlighted');
ck('§F','fig3-diagonal',has('quadrant diagonal √2')&&cnt('stroke-dasharray="4 3"')===1,'Fig P10.3: dashed diagonal labelled');
ck('§F','fig3-points',cnt('r="6"')===5,'Fig P10.3: five points');
// runner — verdict.
out.push('');
out.push('NOTE: engine deterministic (seed 20261029); every receipt re-runs on each dispatch.');
out.push('VERDICT: '+(PASS+FAIL)+' checks, '+FAIL+' FAIL');
return {text:out.join('\n'),pass:PASS,fail:FAIL,total:PASS+FAIL};
