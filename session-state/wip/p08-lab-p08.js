(function(R, page) {
  function cnt(s){return page.split(s).length-1;}
  var ids=['bridge','encounter','name','exemplars','fails','next','lineage','exercises'],seqOK=true,cursor=-1;
  for(var i=0;i<ids.length;i++){var at=page.indexOf('<section id="'+ids[i]+'">',cursor+1);if(at<0){seqOK=false;break;}cursor=at;}
  R.push({id:'p08.1',d:'8 sections in template order',ok:seqOK&&cnt('<section')===8});
  R.push({id:'p08.2',d:'8 h2 (numbered 1-8)',ok:cnt('<h2>')===8&&page.indexOf('<h2>1 · Before we begin</h2>')>=0&&page.indexOf('<h2>8 · Exercises</h2>')>=0});
  R.push({id:'p08.3',d:'8 h3 (3 examples + 5 exercises)',ok:cnt('<h3')===8});
  R.push({id:'p08.4',d:'3 figures, 3 svgs, 3 figcaptions',ok:cnt('<figure')===3&&cnt('<svg')===3&&cnt('<figcaption>')===3});
  R.push({id:'p08.5',d:'details 8 open / 8 close',ok:cnt('<details>')===8&&cnt('</details>')===8});
  R.push({id:'p08.6',d:'pattern boxes: box-p08, box-p08a, box-p08b each once',ok:cnt('id="box-p08"')===1&&cnt('id="box-p08a"')===1&&cnt('id="box-p08b"')===1});
  R.push({id:'p08.7',d:'asides: onramp, warn, history',ok:cnt('<aside class="onramp"')===1&&cnt('<aside class="warn"')===1&&cnt('<aside class="history"')===1});
  R.push({id:'p08.8',d:'3 pid spans (Moves used)',ok:cnt('class="pid"')===3});
  R.push({id:'p08.9',d:'kicker once: P08 · the eighth move of the spine',ok:cnt('P08 · the eighth move of the spine')===1});
  R.push({id:'p08.10',d:'footer: return-to-index + next P09 link',ok:page.indexOf('Return to the index')>=0&&page.indexOf('P09 · Find the invariant</a>')>=0});
  R.push({id:'p08.11',d:'Box P08.B carries the catalogue table (thead+tbody)',ok:page.indexOf('id="box-p08b"')<page.indexOf('<thead>')&&page.indexOf('<tbody>')>page.indexOf('id="box-p08b"')});
  R.push({id:'p08.12',d:'figure numbering Fig P08.1-3 in order',ok:page.indexOf('Fig P08.1')<page.indexOf('Fig P08.2')&&page.indexOf('Fig P08.2')<page.indexOf('Fig P08.3')});
})
