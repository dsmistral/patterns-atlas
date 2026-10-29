(function(R, page) {
  function rot(s,k){var n=s.length,r='';for(var i=0;i<n;i++)r+=s[(i+k)%n];return r;}
  function gcd(a,b){while(b){var t=a%b;a=b;b=t;}return a;}
  function necklaces(n){
    var total=1;for(var i=0;i<n;i++)total*=2;
    var seen={},orbits=[],cens={};
    for(var v=0;v<total;v++){
      var s='';for(var b=0;b<n;b++)s+=(((v>>b)&1)===0)?'0':'1';
      if(seen[s])continue;
      var o=[];for(var k=0;k<n;k++){var mk=rot(s,k);if(o.indexOf(mk)<0)o.push(mk);}
      for(var z=0;z<o.length;z++)seen[o[z]]=1;
      orbits.push(s);cens[o.length]=(cens[o.length]||0)+1;
    }
    var fixed=[];
    for(var k2=0;k2<n;k2++){var f=1;for(var g=0;g<gcd(n,k2);g++)f*=2;fixed.push(f);}
    var sum=0;for(var q=0;q<fixed.length;q++)sum+=fixed[q];
    return {total:total,orbits:orbits.length,cens:cens,fixed:fixed,avg:sum/n};
  }
  var n6=necklaces(6),n5=necklaces(5);
  R.push({id:'p07.1',d:'binary length 6: 64 strings',ok:n6.total===64});
  R.push({id:'p07.2',d:'binary length 6: 14 necklaces',ok:n6.orbits===14});
  R.push({id:'p07.3',d:'census {1:2, 2:1, 3:2, 6:9}',ok:n6.cens['1']===2&&n6.cens['2']===1&&n6.cens['3']===2&&n6.cens['6']===9});
  R.push({id:'p07.4',d:'census sums to 64',ok:2*1+1*2+2*3+9*6===64});
  R.push({id:'p07.5',d:'fixed counts per rotation: 64,2,4,8,4,2',ok:n6.fixed[0]===64&&n6.fixed[1]===2&&n6.fixed[2]===4&&n6.fixed[3]===8&&n6.fixed[4]===4&&n6.fixed[5]===2});
  R.push({id:'p07.6',d:'average (64+2+4+8+4+2)/6 = 84/6 = 14',ok:(64+2+4+8+4+2)===84&&n6.avg===14});
  R.push({id:'p07.7',d:'gcd(6,k) for k=0..5: 6,1,2,3,2,1',ok:[gcd(6,0),gcd(6,1),gcd(6,2),gcd(6,3),gcd(6,4),gcd(6,5)].join()==='6,1,2,3,2,1'.split(',').join(',')});
  R.push({id:'p07.8',d:'binary length 5: 32 strings, 8 necklaces',ok:n5.total===32&&n5.orbits===8});
  R.push({id:'p07.9',d:'length-5 census {1:2, 5:6}, sums to 32',ok:n5.cens['1']===2&&n5.cens['5']===6&&2*1+6*5===32});
  R.push({id:'p07.10',d:'length-5 average (32+2+2+2+2)/5 = 40/5 = 8',ok:n5.fixed[0]===32&&n5.avg===8});
})
