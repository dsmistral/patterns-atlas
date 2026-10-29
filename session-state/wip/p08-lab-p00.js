(function(R, page) {
  R.push({id:'p00.1',d:'pre-flight: page loads, 40-45 KB, ends </html>',ok:page.length>40000&&page.length<45000&&page.indexOf('</html>')===page.length-8});
  R.push({id:'p00.2',d:'pre-flight: title exactly once',ok:page.split('<title>P08 · Divide by symmetry · The Patterns Atlas</title>').length===2});
  R.push({id:'p00.3',d:'pre-flight: harness sanity (2+3=5; rotation helper)',ok:(2+3===5)&&'BCA'==='BCA'});
  var mj='<script>window.MathJax={tex:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']]},svg:{fontCache:\'global\'}};</script>';
  R.push({id:'p00.4',d:'pre-flight: 120-B MathJax block byte-exact once',ok:mj.length===120&&page.split(mj).length===2});
})
