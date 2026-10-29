(function(R, page) {
  function cnt(s){return page.split(s).length-1;}
  R.push({id:'p09.1',d:'zero dollar signs',ok:cnt('$')===0});
  var B=String.fromCharCode(92);
  var inl=cnt(B+'('),inr=cnt(B+')'),dl=cnt(B+'['),dr=cnt(B+']');
  R.push({id:'p09.2',d:'inline TeX balanced: \\( count = \\) count = '+inl,ok:inl===inr&&inl>250});
  R.push({id:'p09.3',d:'display TeX balanced: \\[ = \\] = '+dl,ok:dl===dr&&dl>=8});
  var mj='<script>window.MathJax={tex:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']]},svg:{fontCache:\'global\'}};</script>';
  R.push({id:'p09.4',d:'MathJax config block byte-exact, once',ok:mj.length===120&&cnt(mj)===1});
  var banned=['session','planned','revision','battery','verifier','registry','receipt','adversarial','published','drafting','reviewed'],bhit=[];
  var low=page.toLowerCase();
  for(var i=0;i<banned.length;i++){if(low.indexOf(banned[i])>=0)bhit.push(banned[i]);}
  R.push({id:'p09.5',d:'banned word sweep zero',ok:bhit.length===0,detail:bhit.join(',')});
  R.push({id:'p09.6',d:'machin* exactly 3, all ordinary-English machinery',ok:cnt('machinery')===3&&(low.split('machin').length-1)===3});
  var labSub=low.split('lab'),labKeep={aria:cnt('aria-label'),relabel:cnt('relabel'),labelled:cnt('labelled')};
  R.push({id:'p09.7',d:'lab-substring census: 3 aria-labels + 1 relabel + 2 labelled',ok:(labSub.length-1)===6&&labKeep.aria===3&&labKeep.relabel===1&&labKeep.labelled===2});
  var sTok=page.match(/\bS\d{1,2}\b/g)||[];
  R.push({id:'p09.8',d:'zero session-number tokens',ok:sTok.length===0,detail:sTok.join(',')});
  var rTok=page.match(/\bR[0-2]\b/g)||[];
  R.push({id:'p09.9',d:'zero revision-number tokens',ok:rTok.length===0,detail:rTok.join(',')});
  R.push({id:'p09.10',d:'no build dates (2025/2026)',ok:cnt('2025')===0&&cnt('2026')===0});
  R.push({id:'p09.11',d:'no TODO/FIXME markers',ok:cnt('TODO')===0&&cnt('FIXME')===0});
  R.push({id:'p09.12',d:'no block-9-or-beyond reference (page has blocks 1-8)',ok:cnt('block 9')===0});
  R.push({id:'p09.13',d:'one h1, one title, body+html closed',ok:cnt('<h1>')===1&&cnt('</body>')===1&&cnt('</html>')===1});
  R.push({id:'p09.14',d:'words italics/em + strong used (prose texture present)',ok:cnt('<em>')>=10&&cnt('<strong>')>=20});
})
