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
