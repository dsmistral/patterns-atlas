(function(R, page) {
  var at=page.indexOf('Fig P08.2'),block=page.slice(at-4000,at+2000);
  block=block.slice(block.lastIndexOf('<svg'),block.indexOf('</svg>')+6);
  var ox=60,oy=205,u=30;
  function px(x,y){return [ox+x*u,oy-y*u];}
  R.push({id:'p12.1',d:'Fig2: axes at origin (60,205)',ok:block.indexOf('x1="60" y1="205" x2="300" y2="205"')>=0&&block.indexOf('x1="60" y1="215" x2="60" y2="25"')>=0});
  R.push({id:'p12.2',d:'Fig2: mirror line (60,205)->(240,25) lies on y=x',ok:(240-60===205-25)&&(px(6,6)[0]===240&&px(6,6)[1]===25)});
  R.push({id:'p12.3',d:'Fig2: line x+y=7 endpoints (90,25),(225,160) = (1,6),(5.5,1.5)',ok:block.indexOf('x1="90" y1="25" x2="225" y2="160"')>=0&&(1+6===7)&&((90-60)/30===1)&&((205-25)/30===6)&&((225-60)/30===5.5)&&((205-160)/30===1.5)&&(5.5+1.5===7)});
  var hpts=[[120,25,2,6],[150,85,3,4],[180,115,4,3],[240,145,6,2]],hypOK=true;
  for(var i=0;i<hpts.length;i++){var h=hpts[i];if(px(h[2],h[3])[0]!==h[0]||px(h[2],h[3])[1]!==h[1])hypOK=false;if(h[2]*h[3]!==12)hypOK=false;if(block.indexOf(h[0]+' '+h[1])<0)hypOK=false;}
  R.push({id:'p12.4',d:'Fig2: hyperbola passes (2,6),(3,4),(4,3),(6,2), all xy=12',ok:hypOK});
  R.push({id:'p12.5',d:'Fig2: twin points drawn at (150,85)=(3,4) and (180,115)=(4,3)',ok:block.indexOf('cx="150" cy="85"')>=0&&block.indexOf('cx="180" cy="115"')>=0&&px(3,4)[0]===150&&px(3,4)[1]===85&&px(4,3)[0]===180&&px(4,3)[1]===115});
  R.push({id:'p12.6',d:'Fig2: twin labels (3, 4) and (4, 3)',ok:block.indexOf('(3, 4)')>=0&&block.indexOf('(4, 3)')>=0});
  R.push({id:'p12.7',d:'Fig2: swap segment joins the twins',ok:block.indexOf('x1="150" y1="85" x2="180" y2="115"')>=0});
  R.push({id:'p12.8',d:'Fig2: mirror label y = x (the mirror)',ok:block.indexOf('y = x (the mirror)')>=0});
  R.push({id:'p12.9',d:'Fig2: curve labels xy = 12 and x + y = 7',ok:block.indexOf('xy = 12')>=0&&block.indexOf('x + y = 7')>=0});
  R.push({id:'p12.10',d:'Fig2: viewBox 0 0 340 240',ok:block.indexOf('viewBox="0 0 340 240"')>=0});
})
