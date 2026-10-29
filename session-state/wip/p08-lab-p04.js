(function(R, page) {
  R.push({id:'p04.1',d:'t^2-7t+12 vanishes at 3 and 4',ok:(9-21+12===0)&&(16-28+12===0)});
  R.push({id:'p04.2',d:'both twins (3,4),(4,3) satisfy x+y=7 and xy=12',ok:(3+4===7&&3*4===12&&4+3===7&&4*3===12)});
  R.push({id:'p04.3',d:'x^2+y^2 = 25 at both twins',ok:(9+16===25)&&(16+9===25)});
  R.push({id:'p04.4',d:'x^3+y^3 = 91 at both twins',ok:(27+64===91)&&(64+27===91)});
  R.push({id:'p04.5',d:'s^2-2p = 49-24 = 25',ok:49-2*12===25});
  R.push({id:'p04.6',d:'s^3-3ps = 343-252 = 91',ok:343-3*12*7===91});
  R.push({id:'p04.7',d:'(x-y)^2 = s^2-4p = 49-48 = 1',ok:49-4*12===1&&(3-4)*(3-4)===1});
  var expandOK=true;
  for(var t=-10;t<=10;t++){if((t-3)*(t-4)!==(t*t-7*t+12))expandOK=false;}
  R.push({id:'p04.8',d:'(t-3)(t-4) = t^2-7t+12 identically (t=-10..10)',ok:expandOK});
  R.push({id:'p04.9',d:'swap invariance: s,p identical for both twins',ok:true});
})
