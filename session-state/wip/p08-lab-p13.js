(function(R, page) {
  var at=page.indexOf('Fig P08.3'),block=page.slice(at-4000,at+2000);
  block=block.slice(block.lastIndexOf('<svg'),block.indexOf('</svg>')+6);
  var ox=60,oy=205,ux=12.75,uy=1.6;
  R.push({id:'p13.1',d:'Fig3: ceiling y=45 corresponds to A=100',ok:Math.abs((205-45)/uy-100)<1e-9&&block.indexOf('y1="45" x2="315" y2="45"')>=0});
  R.push({id:'p13.2',d:'Fig3: mirror line x=187.5 corresponds to a=10',ok:Math.abs((187.5-ox)/ux-10)<1e-9&&block.indexOf('x1="187.5" y1="45" x2="187.5" y2="205"')>=0});
  R.push({id:'p13.3',d:'Fig3: Bezier control (187.5,-115) puts curve midpoint at peak (187.5,45)',ok:Math.abs((205+2*(-115)+205)/4-45)<1e-9&&Math.abs((60+2*187.5+315)/4-187.5)<1e-9});
  var t=0.25,bx=0.5625*60+0.375*187.5+0.0625*315,by=0.5625*205+0.375*(-115)+0.0625*205;
  R.push({id:'p13.4',d:'Fig3: curve at t=0.25 = (123.75,85): a=5, A=75',ok:Math.abs(bx-123.75)<1e-9&&Math.abs(by-85)<1e-9&&Math.abs((123.75-ox)/ux-5)<1e-9&&Math.abs((205-85)/uy-75)<1e-9});
  R.push({id:'p13.5',d:'Fig3: twin points (123.75,85) and (251.25,85): a=5 and a=15',ok:block.indexOf('cx="123.75" cy="85"')>=0&&block.indexOf('cx="251.25" cy="85"')>=0&&Math.abs((251.25-ox)/ux-15)<1e-9});
  R.push({id:'p13.6',d:'Fig3: labels a = 10 and A = 75 and A = 100',ok:block.indexOf('a = 10')>=0&&block.indexOf('A = 75')>=0&&block.indexOf('A = 100')>=0});
  R.push({id:'p13.7',d:'Fig3: the symmetric parabola path M 60 205 Q 187.5 -115 315 205',ok:block.indexOf('M 60 205 Q 187.5 -115 315 205')>=0});
  R.push({id:'p13.8',d:'Fig3: twin chord dashed between a=5 and a=15',ok:block.indexOf('x1="123.75" y1="85" x2="251.25" y2="85"')>=0});
  R.push({id:'p13.9',d:'Fig3: axes drawn; viewBox 0 0 340 240',ok:block.indexOf('viewBox="0 0 340 240"')>=0&&block.indexOf('x1="45" y1="205" x2="315" y2="205"')>=0});
})
