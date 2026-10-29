(function(R, page) {
  var at=page.indexOf('Fig P08.1');
  var s0=page.lastIndexOf('<svg',at),s1=page.indexOf('</figure>',s0);
  var block=page.slice(s0,s1);
  var circles=[];
  var re=/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g,m;
  while((m=re.exec(block))!==null){circles.push([+m[1],+m[2],+m[3]]);}
  var main=null,seats=circles.filter(function(c){return c[2]===13;});
  circles.forEach(function(c){if(c[2]===72)main=c;});
  R.push({id:'p11.1',d:'Fig1: main circle r=72 at (150,115)',ok:!!main&&main[0]===150&&main[1]===115});
  var expect={A:[150,43],B:[201,64],C:[222,115],D:[201,166],E:[150,187],F:[99,166],G:[78,115],H:[99,64]};
  var seatOK=seats.length===8,miss=[];
  for(var s in expect){
    var e=expect[s],found=false;
    for(var i=0;i<seats.length;i++){if(Math.abs(seats[i][0]-e[0])<=0.5&&Math.abs(seats[i][1]-e[1])<=0.5)found=true;}
    if(!found){seatOK=false;miss.push(s);}
  }
  R.push({id:'p11.2',d:'Fig1: 8 seats at exact 45-degree positions (tol 0.5px)',ok:seatOK,detail:miss.join(',')});
  var onOK=true;
  for(var j=0;j<seats.length;j++){var d=Math.sqrt((seats[j][0]-150)*(seats[j][0]-150)+(seats[j][1]-115)*(seats[j][1]-115));if(Math.abs(d-72)>0.5)onOK=false;}
  R.push({id:'p11.3',d:'Fig1: every seat centre on the r=72 circle (tol 0.5px)',ok:onOK});
  var labelsOK=true;
  for(var L=0;L<8;L++){var ch=String.fromCharCode(65+L);if(block.indexOf('>'+ch+'</text>')<0)labelsOK=false;}
  R.push({id:'p11.4',d:'Fig1: seat labels A-H all drawn',ok:labelsOK});
  R.push({id:'p11.5',d:'Fig1: radius annotation present',ok:block.indexOf('radius = 72')>=0});
  R.push({id:'p11.6',d:'Fig1: dashed radius line from centre to seat A',ok:block.indexOf('M 150 115 L 150 43')>=0});
  R.push({id:'p11.7',d:'Fig1: rotation arrow drawn',ok:block.indexOf('A 86 86 0 0 1')>=0});
  R.push({id:'p11.8',d:'Fig1: viewBox 0 0 340 230',ok:block.indexOf('viewBox="0 0 340 230"')>=0});
  R.push({id:'p11.9',d:'Fig1: clockwise row-order ABCDEFGH consistent with drawing',ok:block.indexOf('ABCDEFGH')>=0});
})
