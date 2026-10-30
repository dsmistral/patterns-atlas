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
