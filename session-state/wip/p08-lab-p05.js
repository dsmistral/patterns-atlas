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
