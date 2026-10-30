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
