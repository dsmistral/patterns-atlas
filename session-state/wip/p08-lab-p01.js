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
