// p04 — TeX hygiene, MathJax block, banned-token sweep.
const io=cnt('\\('),ic=cnt('\\)'),dn=cnt('\\['),dc=cnt('\\]');
ck('§T','inline-balance',io===ic&&io===206,'inline TeX '+io+' open / '+ic+' close (frozen at 206)');
ck('§T','display-balance',dn===dc&&dn===3,'display TeX '+dn+' open / '+dc+' close (2 eq + 1 config)');
ck('§T','no-dollar',cnt('$')===0,'zero raw dollar signs');
ck('§T','mathjax-once',cnt("window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};")===1,'MathJax config block byte-exact, once');
ck('§T','eq2-game',has('class="eq">\\[5 \\text{ chosen numbers}'),'eq 1: the §2 counting display');
ck('§T','eq5-birthday',has('P(\\text{all distinct})'),'eq 2: the birthday display');
const banned=page.match(/\b(simply|lab|machine|machinery|obviously|trivial|trivially|elegant|leverage|delve|robust|seamless|testament|beautiful|gymnastics|magical)\b/gi)||[];
ck('§T','banned-sweep',banned.length===0,'banned-token sweep clean: '+banned.length+' hits');
