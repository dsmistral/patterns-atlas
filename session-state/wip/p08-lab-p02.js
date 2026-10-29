(function(R, page) {
  function rot(s,k){var n=s.length,r='';for(var i=0;i<n;i++)r+=s[(i+k)%n];return r;}
  function fact(n){var f=1;for(var i=2;i<=n;i++)f*=i;return f;}
  function census(n){
    var L=['A','B','C','D','E','F','G','H'];
    var p=[];for(var i=0;i<n;i++)p.push(i);
    var seen={},orbits=0,allN=true;
    for(;;){
      var s='';for(var q=0;q<n;q++)s+=L[p[q]];
      if(!seen[s]){
        var o=[];for(var k=0;k<n;k++)o.push(rot(s,k));
        for(var w=0;w<o.length;w++)seen[o[w]]=1;
        if(o.length!==n)allN=false;orbits++;
      }
      var i2=n-2;while(i2>=0&&p[i2]>=p[i2+1])i2--;
      if(i2<0)break;
      var j2=n-1;while(p[j2]<=p[i2])j2--;
      var t=p[i2];p[i2]=p[j2];p[j2]=t;
      var l=i2+1,r2=n-1;while(l<r2){var t2=p[l];p[l]=p[r2];p[r2]=t2;l++;r2--;}
    }
    return {orbits:orbits,allN:allN};
  }
  var c5=census(5),c6=census(6),c7=census(7),c8=census(8);
  R.push({id:'p02.1',d:'n=5: 120 row-orders, 24 orbits, all size 5',ok:fact(5)===120&&c5.orbits===24&&c5.allN});
  R.push({id:'p02.2',d:'n=6: 720 row-orders, 120 orbits, all size 6',ok:fact(6)===720&&c6.orbits===120&&c6.allN});
  R.push({id:'p02.3',d:'n=7: 5040 row-orders, 720 orbits, all size 7',ok:fact(7)===5040&&c7.orbits===720&&c7.allN});
  R.push({id:'p02.4',d:'n=8: 40320 row-orders, 5040 orbits, all size 8',ok:fact(8)===40320&&c8.orbits===5040&&c8.allN});
  R.push({id:'p02.5',d:'orbit counts equal n!/n for n=5..8',ok:c5.orbits===120/5&&c6.orbits===720/6&&c7.orbits===5040/7&&c8.orbits===40320/8});
  R.push({id:'p02.6',d:'Ex4(1) brute support: n=5,6,7 all-orbit-size uniform',ok:c5.allN&&c6.allN&&c7.allN});
})
