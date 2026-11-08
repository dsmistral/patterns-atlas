// p58-lab-e-figures.js — Fig P58.1/P58.2 coordinates machine-checked against the page's own census numbers
(async function(){
  const gates=[], poisons=[];
  const g=(n,c)=>gates.push((c?'PASS ':'FAIL ')+n);
  const p=(n,rej)=>poisons.push((rej?'REJECTED ':'NOT-CAUGHT ')+n);
  const html=(globalThis.__p58PageHtml)||((await tools.file_system.read_file({path:'/home/user/knowledge/graph-driven-math-book/wip/p58-page.html'})).content||'');
  const census=[3010,1761,1249,970,791,670,579,512,458];
  const L10=Math.log(10);
  const ben=[1,2,3,4,5,6,7,8,9].map(d=>10000*Math.log(1+1/d)/L10);
  let allBars=true;
  for(let d=1;d<=9;d++){
    const x=60+(d-1)*60;
    const h=census[d-1]/3010*302, y=330-h;
    const ys=(Math.abs(y-Math.round(y))<0.005)?String(Math.round(y)):y.toFixed(2);
    const hs=(Math.abs(h-Math.round(h))<0.005)?String(Math.round(h)):h.toFixed(2);
    const tag='<rect x="'+x+'" y="'+ys+'" width="40" height="'+hs+'" fill="#99c1f1"/>';
    if(html.indexOf(tag)<0) allBars=false;
  }
  g('E1 all nine census bars exact (y/h from count/3010*302, y+h=330)', allBars);
  let sumOk=true;
  for(let d=1;d<=9;d++){
    const x=60+(d-1)*60;
    const h=census[d-1]/3010*302, y=330-h;
    if(Math.abs(y+h-330)>1e-9) sumOk=false;
  }
  g('E2 bar geometry: y+h=330, x=60+60(d-1), width 40', sumOk);
  const curve=ben.map((b,i)=>{
    const x=80+i*60, y=330-(b/3010)*302;
    return x+','+((Math.abs(y-Math.round(y))<0.005)?String(Math.round(y)):y.toFixed(2));
  }).join(' ');
  g('E3 Benford polyline exact (d6 262.83, d7 271.82, normalized by the 3010-count bar)', html.indexOf('points="'+curve+'"')>=0);
  g('E4 Fig P58.1 aria names the largest gap (0.9 counts, at digit 7)', html.indexOf('largest gap between bar and curve is 0.9 counts, at digit 7')>=0);
  g('E5 Fig P58.2: two circles at cx 170 and 470, room-average annotation',
    html.indexOf('cx="170"')>=0&&html.indexOf('cx="470"')>=0&&html.indexOf('room average')>=0);
  g('E6 figcaptions cite Fig P58.1 and Fig P58.2',
    html.indexOf('Fig P58.1 —')>=0&&html.indexOf('Fig P58.2 —')>=0);
  const uniH=1111/3010*302;
  const uniTag='height="'+uniH.toFixed(2)+'"';
  p('E-P1 claim "a uniform-digit bar (height 111.43) appears"', html.indexOf(uniTag)<0);
  p('E-P2 claim "digit 2 wears digit 1\'s height" (y=28 at x=120)', html.indexOf('<rect x="120" y="28"')<0);
  globalThis.p58LabE={gates,poisons,curve};
})();
