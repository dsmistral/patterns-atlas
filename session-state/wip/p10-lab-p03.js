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
