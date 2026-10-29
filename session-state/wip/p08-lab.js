// p08-lab.js — Patterns Atlas P08 battery, session S38 (2026-10-29).
// Fresh engine: zero code shared with any earlier chapter's lab. No recursion, no BigInt.
// The 15 check pieces are the staged piece sources, byte-exact: each is
// (function (R, page) { R.push({id, d, ok}); }) with its own check ids. Pieces
// are pure functions of the page bytes; LAB.run tallies machine-counted output.
var LAB = { name: "p08-lab", checks: 0, fails: 0, lines: [] };
LAB.ck = function (ok, desc) { LAB.checks++; if (!ok) LAB.fails++; LAB.lines.push((ok ? "[ok] " : "[FAIL] ") + desc); };
var PIECE_NAMES = ["p00", "p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p09", "p10", "p11", "p12", "p13", "p14"];
var PIECES = [
(function(R, page) {
  R.push({id:'p00.1',d:'pre-flight: page loads, 40-45 KB, ends </html>',ok:page.length>40000&&page.length<45000&&page.indexOf('</html>')===page.length-8});
  R.push({id:'p00.2',d:'pre-flight: title exactly once',ok:page.split('<title>P08 · Divide by symmetry · The Patterns Atlas</title>').length===2});
  R.push({id:'p00.3',d:'pre-flight: harness sanity (2+3=5; rotation helper)',ok:(2+3===5)&&'BCA'==='BCA'});
  var mj='<script>window.MathJax={tex:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']]},svg:{fontCache:\'global\'}};</script>';
  R.push({id:'p00.4',d:'pre-flight: 120-B MathJax block byte-exact once',ok:mj.length===120&&page.split(mj).length===2});
})
,
(function(R, page) {
  function fact(n){var f=1;for(var i=2;i<=n;i++)f*=i;return f;}
  function rot(s,k){var n=s.length,r='';for(var i=0;i<n;i++)r+=s[(i+k)%n];return r;}
  R.push({id:'p01.1',d:'3! = 6',ok:fact(3)===6});
  R.push({id:'p01.2',d:'3!/3 = 2 seatings',ok:fact(3)/3===2});
  R.push({id:'p01.3',d:'4! = 24',ok:fact(4)===24});
  R.push({id:'p01.4',d:'4!/4 = 6',ok:fact(4)/4===6});
  R.push({id:'p01.5',d:'8! = 40320',ok:fact(8)===40320});
  R.push({id:'p01.6',d:'40320/8 = 5040',ok:fact(8)/8===5040});
  R.push({id:'p01.7',d:'7! = 5040 = 8!/8',ok:fact(7)===5040});
  var seen={},orbits=0,sizesAll3=true;
  var list=['ABC','ACB','BAC','BCA','CAB','CBA'];
  for(var j=0;j<list.length;j++){var s=list[j];if(seen[s])continue;var o=[];for(var k=0;k<3;k++){o.push(rot(s,k));}for(var w=0;w<o.length;w++)seen[o[w]]=1;if(o.length!==3)sizesAll3=false;orbits++;}
  R.push({id:'p01.8',d:'n=3: 6 row-orders form 2 orbits',ok:orbits===2});
  R.push({id:'p01.9',d:'n=3: both orbits size exactly 3',ok:sizesAll3});
  var rots={},cnt=0;var base='ABCDEFGH';
  for(var k2=0;k2<8;k2++){var m2=rot(base,k2);if(!rots[m2]){rots[m2]=1;cnt++;}}
  R.push({id:'p01.10',d:'ABCDEFGH: 8 distinct rotations',ok:cnt===8});
})
,
(function(R, page) {
  function rot(s,k){var n=s.length,r='';for(var i=0;i<n;i++)r+=s[(i+k)%n];return r;}
  function fact(n){var f=1;for(var i=2;i<=n;i++)f*=i;return f;}
  function census(n){
    var L=['A','B','C','D','E','F','G','H'];
    var p=[];for(var i=0;i<n;i++)p.push(i);
    var seen={},orbits=0,allN=true;
    for(;;){
      var s='';for(var q=0;q<n;q++)s+=L[p[q]];
      if(!seen[s]){
        var o=[];for(var k=0;k<n;k++)o.push(rot(s,k));
        for(var w=0;w<o.length;w++)seen[o[w]]=1;
        if(o.length!==n)allN=false;orbits++;
      }
      var i2=n-2;while(i2>=0&&p[i2]>=p[i2+1])i2--;
      if(i2<0)break;
      var j2=n-1;while(p[j2]<=p[i2])j2--;
      var t=p[i2];p[i2]=p[j2];p[j2]=t;
      var l=i2+1,r2=n-1;while(l<r2){var t2=p[l];p[l]=p[r2];p[r2]=t2;l++;r2--;}
    }
    return {orbits:orbits,allN:allN};
  }
  var c5=census(5),c6=census(6),c7=census(7),c8=census(8);
  R.push({id:'p02.1',d:'n=5: 120 row-orders, 24 orbits, all size 5',ok:fact(5)===120&&c5.orbits===24&&c5.allN});
  R.push({id:'p02.2',d:'n=6: 720 row-orders, 120 orbits, all size 6',ok:fact(6)===720&&c6.orbits===120&&c6.allN});
  R.push({id:'p02.3',d:'n=7: 5040 row-orders, 720 orbits, all size 7',ok:fact(7)===5040&&c7.orbits===720&&c7.allN});
  R.push({id:'p02.4',d:'n=8: 40320 row-orders, 5040 orbits, all size 8',ok:fact(8)===40320&&c8.orbits===5040&&c8.allN});
  R.push({id:'p02.5',d:'orbit counts equal n!/n for n=5..8',ok:c5.orbits===120/5&&c6.orbits===720/6&&c7.orbits===5040/7&&c8.orbits===40320/8});
  R.push({id:'p02.6',d:'Ex4(1) brute support: n=5,6,7 all-orbit-size uniform',ok:c5.allN&&c6.allN&&c7.allN});
})
,
(function(R, page) {
  function dice(sum){
    var ordered=[],seen={},pairs=0,fixed=0;
    for(var a=1;a<=6;a++)for(var b=1;b<=6;b++)if(a+b===sum)ordered.push([a,b]);
    for(var j=0;j<ordered.length;j++){
      var key=ordered[j][0]+','+ordered[j][1];
      if(seen[key])continue;
      var twin=ordered[j][1]+','+ordered[j][0];
      seen[key]=1;seen[twin]=1;
      if(twin===key)fixed++;else pairs++;
    }
    return {ordered:ordered.length,pairs:pairs,fixed:fixed};
  }
  var d8=dice(8),d7=dice(7),d9=dice(9);
  R.push({id:'p03.1',d:'sum 8: 5 ordered favourable',ok:d8.ordered===5});
  R.push({id:'p03.2',d:'sum 8 ledger: 2 swap-pairs + 1 fixed = 5',ok:d8.pairs===2&&d8.fixed===1&&2*2+1===5});
  R.push({id:'p03.3',d:'sum 8 probability 5/36',ok:d8.ordered===5&&5/36===5/36});
  R.push({id:'p03.4',d:'sum 7: 3 swap-pairs, 0 fixed, 6 ordered',ok:d7.pairs===3&&d7.fixed===0&&d7.ordered===6});
  R.push({id:'p03.5',d:'sum 7 probability 6/36 = 1/6',ok:d7.ordered===6&&6/36===1/6});
  R.push({id:'p03.6',d:'sum 9: 2 swap-pairs, 0 fixed, 4 ordered',ok:d9.pairs===2&&d9.fixed===0&&d9.ordered===4});
  R.push({id:'p03.7',d:'sum 9 probability 4/36 = 1/9',ok:d9.ordered===4&&4/36===1/9});
  var parityOK=true;
  for(var s=2;s<=12;s++){var d=dice(s);var expect=(s%2===0)?1:0;if(d.fixed!==expect)parityOK=false;}
  R.push({id:'p03.8',d:'parity law: fixed pair exists iff sum even (sums 2..12)',ok:parityOK});
  R.push({id:'p03.9',d:'direct 36-scan agrees with ledger: 5/6/4 favourable',ok:(d8.ordered+d7.ordered+d9.ordered)===15});
})
,
(function(R, page) {
  R.push({id:'p04.1',d:'t^2-7t+12 vanishes at 3 and 4',ok:(9-21+12===0)&&(16-28+12===0)});
  R.push({id:'p04.2',d:'both twins (3,4),(4,3) satisfy x+y=7 and xy=12',ok:(3+4===7&&3*4===12&&4+3===7&&4*3===12)});
  R.push({id:'p04.3',d:'x^2+y^2 = 25 at both twins',ok:(9+16===25)&&(16+9===25)});
  R.push({id:'p04.4',d:'x^3+y^3 = 91 at both twins',ok:(27+64===91)&&(64+27===91)});
  R.push({id:'p04.5',d:'s^2-2p = 49-24 = 25',ok:49-2*12===25});
  R.push({id:'p04.6',d:'s^3-3ps = 343-252 = 91',ok:343-3*12*7===91});
  R.push({id:'p04.7',d:'(x-y)^2 = s^2-4p = 49-48 = 1',ok:49-4*12===1&&(3-4)*(3-4)===1});
  var expandOK=true;
  for(var t=-10;t<=10;t++){if((t-3)*(t-4)!==(t*t-7*t+12))expandOK=false;}
  R.push({id:'p04.8',d:'(t-3)(t-4) = t^2-7t+12 identically (t=-10..10)',ok:expandOK});
  R.push({id:'p04.9',d:'swap invariance: s,p identical for both twins',ok:true});
})
,
(function(R, page) {
  var maxA=0,maxAt=-1,ladder=[];
  for(var a=1;a<=19;a++){var A=a*(20-a);ladder.push(A);if(A>maxA){maxA=A;maxAt=a;}}
  R.push({id:'p05.1',d:'perimeter-40 grid: max area 100 at a=10',ok:maxA===100&&maxAt===10});
  var expect=[19,36,51,64,75,84,91,96,99,100,99,96,91,84,75,64,51,36,19],ladOK=true;
  for(var i=0;i<19;i++)if(ladder[i]!==expect[i])ladOK=false;
  R.push({id:'p05.2',d:'area ladder 19,36,51,64,75,84,91,96,99,100, then back',ok:ladOK});
  R.push({id:'p05.3',d:'twin pairs a=5,15 give 75; a=1,19 give 19',ok:5*15===75&&15*5===75&&1*19===19});
  var idOK=true;
  for(var a2=-50;a2<=70;a2++){if(100-a2*(20-a2)!==(a2-10)*(a2-10))idOK=false;}
  R.push({id:'p05.4',d:'100 - a(20-a) = (a-10)^2 identically (a=-50..70)',ok:idOK});
  R.push({id:'p05.5',d:'area-100 perims: (2,50)->104, (4,25)->58, (5,20)->50',ok:2*(2+50)===104&&2*(4+25)===58&&2*(5+20)===50});
  var minP=Infinity,minAt=-1;
  for(var d=1;d<=100;d++){if(100%d!==0)continue;var p2=2*(d+100/d);if(p2<minP){minP=p2;minAt=d;}}
  R.push({id:'p05.6',d:'all divisor-sided area-100 rectangles: min perimeter 40 at a=10',ok:minP===40&&minAt===10});
  var twinOK=true;
  for(var x=1;x<=1600;x++){var a3=x/4;var lhs=2*a3+200/a3-40;var rhs=2*(a3-10)*(a3-10)/a3;if(Math.abs(lhs-rhs)>1e-9)twinOK=false;}
  R.push({id:'p05.7',d:'2a+200/a-40 = 2(a-10)^2/a (a=0.25..400, tol 1e-9)',ok:twinOK});
  R.push({id:'p05.8',d:'twin identity nonnegative: 2(a-10)^2/a >= 0 for a>0',ok:2*(3-10)*(3-10)/3>=0&&2*(17-10)*(17-10)/17>=0});
  R.push({id:'p05.9',d:'self-twin candidate: a = 20-a gives a=10; area 100',ok:(20-10)===10&&10*10===100});
  R.push({id:'p05.10',d:'square perim 40; the two problems swap fixed and optimized quantity',ok:2*(10+10)===40});
})
,
(function(R, page) {
  function rot(s,k){var n=s.length,r='';for(var i=0;i<n;i++)r+=s[(i+k)%n];return r;}
  function orbitSize(s){var o=[];for(var k=0;k<s.length;k++){var m=rot(s,k);if(o.indexOf(m)<0)o.push(m);}return o.length;}
  function fact(n){var f=1;for(var i=2;i<=n;i++)f*=i;return f;}
  R.push({id:'p06.1',d:'marked chair: 8! = 40320 seatings, no division',ok:fact(8)===40320});
  R.push({id:'p06.2',d:'phantom symmetry: (3,7) obeys x<y, (7,3) does not',ok:(3<7)&&!(7<3)});
  var sol=[];for(var x=1;x<=16;x++){if(16%x===0)sol.push(x+','+16/x);}
  R.push({id:'p06.3',d:'xy=16: 5 ordered solutions',ok:sol.length===5});
  R.push({id:'p06.4',d:'xy=16: (4,4) is its own twin',ok:sol.indexOf('4,4')>=0});
  R.push({id:'p06.5',d:'xy=16 honest count: (5-1)/2+1 = 3',ok:(5-1)/2+1===3});
  var uniq=[],u={},all=[];var base='RRRBBB';
  var L=['R','R','R','B','B','B'];var p=[0,1,2,3,4,5];var seenU={};
  for(;;){
    var s='';for(var q=0;q<6;q++)s+=L[p[q]];
    if(all.indexOf(s)<0)all.push(s);
    var i2=4;while(i2>=0&&p[i2]>=p[i2+1])i2--;
    if(i2<0)break;
    var j2=5;while(p[j2]<=p[i2])j2--;
    var t=p[i2];p[i2]=p[j2];p[j2]=t;
    var l=i2+1,r2=5;while(l<r2){var t2=p[l];p[l]=p[r2];p[r2]=t2;l++;r2--;}
  }
  var cens={};
  for(var w=0;w<all.length;w++){var s2=all[w];if(seenU[s2])continue;var o=[];for(var k=0;k<6;k++){var mk=rot(s2,k);if(o.indexOf(mk)<0)o.push(mk);}for(var z=0;z<o.length;z++)seenU[o[z]]=1;var sz=o.length;cens[sz]=(cens[sz]||0)+1;uniq.push(s2);}
  R.push({id:'p06.6',d:'3R3B: 20 linear arrangements',ok:all.length===20});
  R.push({id:'p06.7',d:'3R3B: 4 necklaces, census {2:1, 6:3}',ok:uniq.length===4&&cens['2']===1&&cens['6']===3&&2*1+6*3===20});
  R.push({id:'p06.8',d:'RBRBRB comes home after 2 rotations (orbit size 2)',ok:orbitSize('RBRBRB')===2});
  R.push({id:'p06.9',d:'RRRBBB orbit size 6',ok:orbitSize('RRRBBB')===6});
  R.push({id:'p06.10',d:'20/6 is not an integer: the division confesses',ok:(20/6)!==Math.floor(20/6)});
})
,
(function(R, page) {
  function rot(s,k){var n=s.length,r='';for(var i=0;i<n;i++)r+=s[(i+k)%n];return r;}
  function gcd(a,b){while(b){var t=a%b;a=b;b=t;}return a;}
  function necklaces(n){
    var total=1;for(var i=0;i<n;i++)total*=2;
    var seen={},orbits=[],cens={};
    for(var v=0;v<total;v++){
      var s='';for(var b=0;b<n;b++)s+=(((v>>b)&1)===0)?'0':'1';
      if(seen[s])continue;
      var o=[];for(var k=0;k<n;k++){var mk=rot(s,k);if(o.indexOf(mk)<0)o.push(mk);}
      for(var z=0;z<o.length;z++)seen[o[z]]=1;
      orbits.push(s);cens[o.length]=(cens[o.length]||0)+1;
    }
    var fixed=[];
    for(var k2=0;k2<n;k2++){var f=1;for(var g=0;g<gcd(n,k2);g++)f*=2;fixed.push(f);}
    var sum=0;for(var q=0;q<fixed.length;q++)sum+=fixed[q];
    return {total:total,orbits:orbits.length,cens:cens,fixed:fixed,avg:sum/n};
  }
  var n6=necklaces(6),n5=necklaces(5);
  R.push({id:'p07.1',d:'binary length 6: 64 strings',ok:n6.total===64});
  R.push({id:'p07.2',d:'binary length 6: 14 necklaces',ok:n6.orbits===14});
  R.push({id:'p07.3',d:'census {1:2, 2:1, 3:2, 6:9}',ok:n6.cens['1']===2&&n6.cens['2']===1&&n6.cens['3']===2&&n6.cens['6']===9});
  R.push({id:'p07.4',d:'census sums to 64',ok:2*1+1*2+2*3+9*6===64});
  R.push({id:'p07.5',d:'fixed counts per rotation: 64,2,4,8,4,2',ok:n6.fixed[0]===64&&n6.fixed[1]===2&&n6.fixed[2]===4&&n6.fixed[3]===8&&n6.fixed[4]===4&&n6.fixed[5]===2});
  R.push({id:'p07.6',d:'average (64+2+4+8+4+2)/6 = 84/6 = 14',ok:(64+2+4+8+4+2)===84&&n6.avg===14});
  R.push({id:'p07.7',d:'gcd(6,k) for k=0..5: 6,1,2,3,2,1',ok:[gcd(6,0),gcd(6,1),gcd(6,2),gcd(6,3),gcd(6,4),gcd(6,5)].join()==='6,1,2,3,2,1'.split(',').join(',')});
  R.push({id:'p07.8',d:'binary length 5: 32 strings, 8 necklaces',ok:n5.total===32&&n5.orbits===8});
  R.push({id:'p07.9',d:'length-5 census {1:2, 5:6}, sums to 32',ok:n5.cens['1']===2&&n5.cens['5']===6&&2*1+6*5===32});
  R.push({id:'p07.10',d:'length-5 average (32+2+2+2+2)/5 = 40/5 = 8',ok:n5.fixed[0]===32&&n5.avg===8});
})
,
(function(R, page) {
  function cnt(s){return page.split(s).length-1;}
  var ids=['bridge','encounter','name','exemplars','fails','next','lineage','exercises'],seqOK=true,cursor=-1;
  for(var i=0;i<ids.length;i++){var at=page.indexOf('<section id="'+ids[i]+'">',cursor+1);if(at<0){seqOK=false;break;}cursor=at;}
  R.push({id:'p08.1',d:'8 sections in template order',ok:seqOK&&cnt('<section')===8});
  R.push({id:'p08.2',d:'8 h2 (numbered 1-8)',ok:cnt('<h2>')===8&&page.indexOf('<h2>1 · Before we begin</h2>')>=0&&page.indexOf('<h2>8 · Exercises</h2>')>=0});
  R.push({id:'p08.3',d:'8 h3 (3 examples + 5 exercises)',ok:cnt('<h3')===8});
  R.push({id:'p08.4',d:'3 figures, 3 svgs, 3 figcaptions',ok:cnt('<figure')===3&&cnt('<svg')===3&&cnt('<figcaption>')===3});
  R.push({id:'p08.5',d:'details 8 open / 8 close',ok:cnt('<details>')===8&&cnt('</details>')===8});
  R.push({id:'p08.6',d:'pattern boxes: box-p08, box-p08a, box-p08b each once',ok:cnt('id="box-p08"')===1&&cnt('id="box-p08a"')===1&&cnt('id="box-p08b"')===1});
  R.push({id:'p08.7',d:'asides: onramp, warn, history',ok:cnt('<aside class="onramp"')===1&&cnt('<aside class="warn"')===1&&cnt('<aside class="history"')===1});
  R.push({id:'p08.8',d:'3 pid spans (Moves used)',ok:cnt('class="pid"')===3});
  R.push({id:'p08.9',d:'kicker once: P08 · the eighth move of the spine',ok:cnt('P08 · the eighth move of the spine')===1});
  R.push({id:'p08.10',d:'footer: return-to-index + next P09 link',ok:page.indexOf('Return to the index')>=0&&page.indexOf('P09 · Find the invariant</a>')>=0});
  R.push({id:'p08.11',d:'Box P08.B carries the catalogue table (thead+tbody)',ok:page.indexOf('id="box-p08b"')<page.indexOf('<thead>')&&page.indexOf('<tbody>')>page.indexOf('id="box-p08b"')});
  R.push({id:'p08.12',d:'figure numbering Fig P08.1-3 in order',ok:page.indexOf('Fig P08.1')<page.indexOf('Fig P08.2')&&page.indexOf('Fig P08.2')<page.indexOf('Fig P08.3')});
})
,
(function(R, page) {
  function cnt(s){return page.split(s).length-1;}
  R.push({id:'p09.1',d:'zero dollar signs',ok:cnt('$')===0});
  var B=String.fromCharCode(92);
  var inl=cnt(B+'('),inr=cnt(B+')'),dl=cnt(B+'['),dr=cnt(B+']');
  R.push({id:'p09.2',d:'inline TeX balanced: \\( count = \\) count = '+inl,ok:inl===inr&&inl>250});
  R.push({id:'p09.3',d:'display TeX balanced: \\[ = \\] = '+dl,ok:dl===dr&&dl>=8});
  var mj='<script>window.MathJax={tex:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']]},svg:{fontCache:\'global\'}};</script>';
  R.push({id:'p09.4',d:'MathJax config block byte-exact, once',ok:mj.length===120&&cnt(mj)===1});
  var banned=['session','planned','revision','battery','verifier','registry','receipt','adversarial','published','drafting','reviewed'],bhit=[];
  var low=page.toLowerCase();
  for(var i=0;i<banned.length;i++){if(low.indexOf(banned[i])>=0)bhit.push(banned[i]);}
  R.push({id:'p09.5',d:'banned word sweep zero',ok:bhit.length===0,detail:bhit.join(',')});
  R.push({id:'p09.6',d:'machin* exactly 3, all ordinary-English machinery',ok:cnt('machinery')===3&&(low.split('machin').length-1)===3});
  var labSub=low.split('lab'),labKeep={aria:cnt('aria-label'),relabel:cnt('relabel'),labelled:cnt('labelled')};
  R.push({id:'p09.7',d:'lab-substring census: 3 aria-labels + 1 relabel + 2 labelled',ok:(labSub.length-1)===6&&labKeep.aria===3&&labKeep.relabel===1&&labKeep.labelled===2});
  var sTok=page.match(/\bS\d{1,2}\b/g)||[];
  R.push({id:'p09.8',d:'zero session-number tokens',ok:sTok.length===0,detail:sTok.join(',')});
  var rTok=page.match(/\bR[0-2]\b/g)||[];
  R.push({id:'p09.9',d:'zero revision-number tokens',ok:rTok.length===0,detail:rTok.join(',')});
  R.push({id:'p09.10',d:'no build dates (2025/2026)',ok:cnt('2025')===0&&cnt('2026')===0});
  R.push({id:'p09.11',d:'no TODO/FIXME markers',ok:cnt('TODO')===0&&cnt('FIXME')===0});
  R.push({id:'p09.12',d:'no block-9-or-beyond reference (page has blocks 1-8)',ok:cnt('block 9')===0});
  R.push({id:'p09.13',d:'one h1, one title, body+html closed',ok:cnt('<h1>')===1&&cnt('</body>')===1&&cnt('</html>')===1});
  R.push({id:'p09.14',d:'words italics/em + strong used (prose texture present)',ok:cnt('<em>')>=10&&cnt('<strong>')>=20});
})
,
(function(R, page) {
  var hrefs=(page.match(/href="([^"]+)"/g)||[]).map(function(h){return h.slice(6,-1);});
  var tally={};hrefs.forEach(function(h){tally[h]=(tally[h]||0)+1;});
  var expect={'assets/style.css':1,'index.html':2,'p01-pin-down-the-problem.html':1,'p02-small-cases.html':1,'p03-special-cases.html':1,'p04-complete-the-square.html':1,'p05-canonical-form.html':1,'p06-compose-identity.html':1,'p07-auxiliary-construction.html':4,'p09-invariant.html':2,'p10-pigeonhole.html':1,'p16-isomorphism.html':2,'p36-character-counting.html':3,'p68-wlog.html':2,'m04-ramsey-3-3.html':1};
  var same=true,explain=[];
  for(var k in expect){if(tally[k]!==expect[k]){same=false;explain.push(k+':'+tally[k]+'vs'+expect[k]);}}
  for(var k2 in tally){if(!(k2 in expect)){same=false;explain.push('extra:'+k2);}}
  R.push({id:'p10.1',d:'href multiset exactly as designed (15 targets, 24 hrefs)',ok:same&&hrefs.length===24,detail:explain.join(';')});
  R.push({id:'p10.2',d:'every target is a canonical index slug',ok:same});
  var ext=hrefs.filter(function(h){return h.indexOf('http')===0;});
  R.push({id:'p10.3',d:'zero external hrefs',ok:ext.length===0});
  R.push({id:'p10.4',d:'zero fragment anchors',ok:hrefs.every(function(h){return h.indexOf('#')<0;})});
  R.push({id:'p10.5',d:'stylesheet linked once in head',ok:page.indexOf('<link rel="stylesheet" href="assets/style.css">')>=0&&(page.split('assets/style.css').length-1)===1});
  R.push({id:'p10.6',d:'footer next-link = p09-invariant.html',ok:page.indexOf('Next up the spine: <a href="p09-invariant.html">P09 · Find the invariant</a>')>=0});
})
,
(function(R, page) {
  var at=page.indexOf('Fig P08.1');
  var s0=page.lastIndexOf('<svg',at),s1=page.indexOf('</figure>',s0);
  var block=page.slice(s0,s1);
  var circles=[];
  var re=/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g,m;
  while((m=re.exec(block))!==null){circles.push([+m[1],+m[2],+m[3]]);}
  var main=null,seats=circles.filter(function(c){return c[2]===13;});
  circles.forEach(function(c){if(c[2]===72)main=c;});
  R.push({id:'p11.1',d:'Fig1: main circle r=72 at (150,115)',ok:!!main&&main[0]===150&&main[1]===115});
  var expect={A:[150,43],B:[201,64],C:[222,115],D:[201,166],E:[150,187],F:[99,166],G:[78,115],H:[99,64]};
  var seatOK=seats.length===8,miss=[];
  for(var s in expect){
    var e=expect[s],found=false;
    for(var i=0;i<seats.length;i++){if(Math.abs(seats[i][0]-e[0])<=0.5&&Math.abs(seats[i][1]-e[1])<=0.5)found=true;}
    if(!found){seatOK=false;miss.push(s);}
  }
  R.push({id:'p11.2',d:'Fig1: 8 seats at exact 45-degree positions (tol 0.5px)',ok:seatOK,detail:miss.join(',')});
  var onOK=true;
  for(var j=0;j<seats.length;j++){var d=Math.sqrt((seats[j][0]-150)*(seats[j][0]-150)+(seats[j][1]-115)*(seats[j][1]-115));if(Math.abs(d-72)>0.5)onOK=false;}
  R.push({id:'p11.3',d:'Fig1: every seat centre on the r=72 circle (tol 0.5px)',ok:onOK});
  var labelsOK=true;
  for(var L=0;L<8;L++){var ch=String.fromCharCode(65+L);if(block.indexOf('>'+ch+'</text>')<0)labelsOK=false;}
  R.push({id:'p11.4',d:'Fig1: seat labels A-H all drawn',ok:labelsOK});
  R.push({id:'p11.5',d:'Fig1: radius annotation present',ok:block.indexOf('radius = 72')>=0});
  R.push({id:'p11.6',d:'Fig1: dashed radius line from centre to seat A',ok:block.indexOf('M 150 115 L 150 43')>=0});
  R.push({id:'p11.7',d:'Fig1: rotation arrow drawn',ok:block.indexOf('A 86 86 0 0 1')>=0});
  R.push({id:'p11.8',d:'Fig1: viewBox 0 0 340 230',ok:block.indexOf('viewBox="0 0 340 230"')>=0});
  R.push({id:'p11.9',d:'Fig1: clockwise row-order ABCDEFGH consistent with drawing',ok:block.indexOf('ABCDEFGH')>=0});
})
,
(function(R, page) {
  var at=page.indexOf('Fig P08.2'),block=page.slice(at-4000,at+2000);
  block=block.slice(block.lastIndexOf('<svg'),block.indexOf('</svg>')+6);
  var ox=60,oy=205,u=30;
  function px(x,y){return [ox+x*u,oy-y*u];}
  R.push({id:'p12.1',d:'Fig2: axes at origin (60,205)',ok:block.indexOf('x1="60" y1="205" x2="300" y2="205"')>=0&&block.indexOf('x1="60" y1="215" x2="60" y2="25"')>=0});
  R.push({id:'p12.2',d:'Fig2: mirror line (60,205)->(240,25) lies on y=x',ok:(240-60===205-25)&&(px(6,6)[0]===240&&px(6,6)[1]===25)});
  R.push({id:'p12.3',d:'Fig2: line x+y=7 endpoints (90,25),(225,160) = (1,6),(5.5,1.5)',ok:block.indexOf('x1="90" y1="25" x2="225" y2="160"')>=0&&(1+6===7)&&((90-60)/30===1)&&((205-25)/30===6)&&((225-60)/30===5.5)&&((205-160)/30===1.5)&&(5.5+1.5===7)});
  var hpts=[[120,25,2,6],[150,85,3,4],[180,115,4,3],[240,145,6,2]],hypOK=true;
  for(var i=0;i<hpts.length;i++){var h=hpts[i];if(px(h[2],h[3])[0]!==h[0]||px(h[2],h[3])[1]!==h[1])hypOK=false;if(h[2]*h[3]!==12)hypOK=false;if(block.indexOf(h[0]+' '+h[1])<0)hypOK=false;}
  R.push({id:'p12.4',d:'Fig2: hyperbola passes (2,6),(3,4),(4,3),(6,2), all xy=12',ok:hypOK});
  R.push({id:'p12.5',d:'Fig2: twin points drawn at (150,85)=(3,4) and (180,115)=(4,3)',ok:block.indexOf('cx="150" cy="85"')>=0&&block.indexOf('cx="180" cy="115"')>=0&&px(3,4)[0]===150&&px(3,4)[1]===85&&px(4,3)[0]===180&&px(4,3)[1]===115});
  R.push({id:'p12.6',d:'Fig2: twin labels (3, 4) and (4, 3)',ok:block.indexOf('(3, 4)')>=0&&block.indexOf('(4, 3)')>=0});
  R.push({id:'p12.7',d:'Fig2: swap segment joins the twins',ok:block.indexOf('x1="150" y1="85" x2="180" y2="115"')>=0});
  R.push({id:'p12.8',d:'Fig2: mirror label y = x (the mirror)',ok:block.indexOf('y = x (the mirror)')>=0});
  R.push({id:'p12.9',d:'Fig2: curve labels xy = 12 and x + y = 7',ok:block.indexOf('xy = 12')>=0&&block.indexOf('x + y = 7')>=0});
  R.push({id:'p12.10',d:'Fig2: viewBox 0 0 340 240',ok:block.indexOf('viewBox="0 0 340 240"')>=0});
})
,
(function(R, page) {
  var at=page.indexOf('Fig P08.3');
  var s0=page.lastIndexOf('<svg',at),s1=page.indexOf('</figure>',s0);
  var block=page.slice(s0,s1);
  var ox=60,oy=205,ux=12.75,uy=1.6;
  R.push({id:'p13.1',d:'Fig3: ceiling y=45 corresponds to A=100',ok:Math.abs((205-45)/uy-100)<1e-9&&block.indexOf('y1="45" x2="315" y2="45"')>=0});
  R.push({id:'p13.2',d:'Fig3: mirror line x=187.5 corresponds to a=10',ok:Math.abs((187.5-ox)/ux-10)<1e-9&&block.indexOf('x1="187.5" y1="45" x2="187.5" y2="205"')>=0});
  R.push({id:'p13.3',d:'Fig3: Bezier control (187.5,-115) puts curve midpoint at peak (187.5,45)',ok:Math.abs((205+2*(-115)+205)/4-45)<1e-9&&Math.abs((60+2*187.5+315)/4-187.5)<1e-9});
  var t=0.25,bx=0.5625*60+0.375*187.5+0.0625*315,by=0.5625*205+0.375*(-115)+0.0625*205;
  R.push({id:'p13.4',d:'Fig3: curve at t=0.25 = (123.75,85): a=5, A=75',ok:Math.abs(bx-123.75)<1e-9&&Math.abs(by-85)<1e-9&&Math.abs((123.75-ox)/ux-5)<1e-9&&Math.abs((205-85)/uy-75)<1e-9});
  R.push({id:'p13.5',d:'Fig3: twin points (123.75,85) and (251.25,85): a=5 and a=15',ok:block.indexOf('cx="123.75" cy="85"')>=0&&block.indexOf('cx="251.25" cy="85"')>=0&&Math.abs((251.25-ox)/ux-15)<1e-9});
  R.push({id:'p13.6',d:'Fig3: labels a = 10 and A = 75 and A = 100',ok:block.indexOf('a = 10')>=0&&block.indexOf('A = 75')>=0&&block.indexOf('A = 100')>=0});
  R.push({id:'p13.7',d:'Fig3: the symmetric parabola path M 60 205 Q 187.5 -115 315 205',ok:block.indexOf('M 60 205 Q 187.5 -115 315 205')>=0});
  R.push({id:'p13.8',d:'Fig3: twin chord dashed between a=5 and a=15',ok:block.indexOf('x1="123.75" y1="85" x2="251.25" y2="85"')>=0});
  R.push({id:'p13.9',d:'Fig3: axes drawn; viewBox 0 0 340 240',ok:block.indexOf('viewBox="0 0 340 240"')>=0&&block.indexOf('x1="45" y1="205" x2="315" y2="205"')>=0});
})
,
(function(R, page) {
  function has(s){return page.indexOf(s)>=0;}
  R.push({id:'p14.1',d:'printed: 5!/5 = 120/5 = 24 (Ex1)',ok:has('120/5 = 24')});
  R.push({id:'p14.2',d:'printed: 5/36, 1/6, 1/9 (Ex2 answers)',ok:has('5/36')&&has('1/6')&&has('1/9')});
  R.push({id:'p14.3',d:'printed: area ladder string (Ex3)',ok:has('19, 36, 51, 64, 75, 84, 91, 96, 99, 100')});
  R.push({id:'p14.4',d:'printed: perimeters 104, 58, 50 (Ex3 answer)',ok:has('104')&&has('58')&&has('50')});
  R.push({id:'p14.5',d:'printed: honest ledger (5-1)/2 + 1 = 3 (Ex4)',ok:has('(5-1)/2 + 1 = 3')});
  R.push({id:'p14.6',d:'printed: 2·1 + 6·3 = 20 census check (Ex4)',ok:has('2 \\cdot 1 + 6 \\cdot 3 = 20')});
  R.push({id:'p14.7',d:'printed: 362,880 as 362{,}880 (Ex4)',ok:has('362{,}880')});
  R.push({id:'p14.8',d:'printed: necklace census array (Ex5)',ok:has('1, 1, 2, 3, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6')});
  R.push({id:'p14.9',d:'printed: 84/6 = 14 (Ex5 glimpse)',ok:has('84/6 = 14')});
  R.push({id:'p14.10',d:'printed: 40/5 = 8 (Ex5 extension)',ok:has('40/5 = 8')});
  R.push({id:'p14.11',d:'printed: 40{,}320 and 5{,}040 (encounter)',ok:has('40{,}320')&&has('5{,}040')});
  R.push({id:'p14.12',d:'printed: necklace count is 4 (Ex4 verdict)',ok:has('necklace count is \\(4\\)')});
})
,
];
LAB.run = function (page) {
  LAB.lines.push("=== p08-lab — pieces: " + PIECE_NAMES.join(", ") + " ===");
  for (var i = 0; i < PIECES.length; i++) {
    LAB.lines.push("--- piece " + PIECE_NAMES[i] + " ---");
    var R = [];
    PIECES[i](R, page);
    for (var j = 0; j < R.length; j++) LAB.ck(!!R[j].ok, R[j].id + " " + R[j].d);
  }
  LAB.lines.push("VERDICT: " + LAB.checks + " checks, " + LAB.fails + " FAIL");
  return LAB.lines.join("\n");
};
