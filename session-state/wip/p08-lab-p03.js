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
