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
