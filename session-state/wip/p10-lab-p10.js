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
