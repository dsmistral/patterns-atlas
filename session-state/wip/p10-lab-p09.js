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
