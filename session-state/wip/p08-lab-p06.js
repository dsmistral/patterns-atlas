(function(R, page) {
  function rot(s,k){var n=s.length,r='';for(var i=0;i<n;i++)r+=s[(i+k)%n];return r;}
  function orbitSize(s){var o=[];for(var k=0;k<s.length;k++){var m=rot(s,k);if(o.indexOf(m)<0)o.push(m);}return o.length;}
  function fact(n){var f=1;for(var i=2;i<=n;i++)f*=i;return f;}
  R.push({id:'p06.1',d:'marked chair: 8! = 40320 seatings, no division',ok:fact(8)===40320});
  R.push({id:'p06.2',d:'phantom symmetry: (3,7) obeys x<y, (7,3) does not',ok:(3<7)&&!(7<3)});
  var sol=[];for(var x=1;x<=16;x++){if(16%x===0)sol.push(x+','+16/x);}
  R.push({id:'p06.3',d:'xy=16: 5 ordered solutions',ok:sol.length===5});
  R.push({id:'p06.4',d:'xy=16: (4,4) is its own twin',ok:sol.indexOf('4,4')>=0});
  R.push({id:'p06.5',d:'xy=16 honest count: (5-1)/2+1 = 3',ok:(5-1)/2+1===3});
  var uniq=[],u={},all=[];var base='RRRBBB';
  var L=['R','R','R','B','B','B'];var p=[0,1,2,3,4,5];var seenU={};
  for(;;){
    var s='';for(var q=0;q<6;q++)s+=L[p[q]];
    if(all.indexOf(s)<0)all.push(s);
    var i2=4;while(i2>=0&&p[i2]>=p[i2+1])i2--;
    if(i2<0)break;
    var j2=5;while(p[j2]<=p[i2])j2--;
    var t=p[i2];p[i2]=p[j2];p[j2]=t;
    var l=i2+1,r2=5;while(l<r2){var t2=p[l];p[l]=p[r2];p[r2]=t2;l++;r2--;}
  }
  var cens={};
  for(var w=0;w<all.length;w++){var s2=all[w];if(seenU[s2])continue;var o=[];for(var k=0;k<6;k++){var mk=rot(s2,k);if(o.indexOf(mk)<0)o.push(mk);}for(var z=0;z<o.length;z++)seenU[o[z]]=1;var sz=o.length;cens[sz]=(cens[sz]||0)+1;uniq.push(s2);}
  R.push({id:'p06.6',d:'3R3B: 20 linear arrangements',ok:all.length===20});
  R.push({id:'p06.7',d:'3R3B: 4 necklaces, census {2:1, 6:3}',ok:uniq.length===4&&cens['2']===1&&cens['6']===3&&2*1+6*3===20});
  R.push({id:'p06.8',d:'RBRBRB comes home after 2 rotations (orbit size 2)',ok:orbitSize('RBRBRB')===2});
  R.push({id:'p06.9',d:'RRRBBB orbit size 6',ok:orbitSize('RRRBBB')===6});
  R.push({id:'p06.10',d:'20/6 is not an integer: the division confesses',ok:(20/6)!==Math.floor(20/6)});
})
