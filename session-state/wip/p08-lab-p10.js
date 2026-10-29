(function(R, page) {
  var hrefs=(page.match(/href="([^"]+)"/g)||[]).map(function(h){return h.slice(6,-1);});
  var tally={};hrefs.forEach(function(h){tally[h]=(tally[h]||0)+1;});
  var expect={'assets/style.css':1,'index.html':2,'p01-pin-down-the-problem.html':1,'p02-small-cases.html':1,'p03-special-cases.html':1,'p04-complete-the-square.html':1,'p05-canonical-form.html':1,'p06-compose-identity.html':1,'p07-auxiliary-construction.html':4,'p09-invariant.html':2,'p10-pigeonhole.html':1,'p16-isomorphism.html':2,'p36-character-counting.html':3,'p68-wlog.html':2,'m04-ramsey-3-3.html':1};
  var same=true,explain=[];
  for(var k in expect){if(tally[k]!==expect[k]){same=false;explain.push(k+':'+tally[k]+'vs'+expect[k]);}}
  for(var k2 in tally){if(!(k2 in expect)){same=false;explain.push('extra:'+k2);}}
  R.push({id:'p10.1',d:'href multiset exactly as designed (15 targets, 24 hrefs)',ok:same&&hrefs.length===24,detail:explain.join(';')});
  R.push({id:'p10.2',d:'every target is a canonical index slug',ok:same});
  var ext=hrefs.filter(function(h){return h.indexOf('http')===0;});
  R.push({id:'p10.3',d:'zero external hrefs',ok:ext.length===0});
  R.push({id:'p10.4',d:'zero fragment anchors',ok:hrefs.every(function(h){return h.indexOf('#')<0;})});
  R.push({id:'p10.5',d:'stylesheet linked once in head',ok:page.indexOf('<link rel="stylesheet" href="assets/style.css">')>=0&&(page.split('assets/style.css').length-1)===1});
  R.push({id:'p10.6',d:'footer next-link = p09-invariant.html',ok:page.indexOf('Next up the spine: <a href="p09-invariant.html">P09 · Find the invariant</a>')>=0});
})
