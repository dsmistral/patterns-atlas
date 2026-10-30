// p14 — §3/§6/§7 claims + figure-coordinate needles.
ck('§3','box-titles',has('Pattern P10 — Force a collision.')&&has('Box P10.A — the three demands')&&has('Box P10.B — the working catalogue'),'three pattern-boxes titled');
ck('§3','sharpened',has('kn+1'),'sharpened form kn+1 in n boxes present');
ck('§6','routes',has('<strong>P11 — prove by contradiction.</strong>')&&has('<strong>P12 — name the obstruction.</strong>')&&has('<strong>P14 — the diagonal argument.</strong>')&&has('<strong>P19 — count the outcomes.</strong>')&&has('<strong>M04 — Ramsey'),'five routes named');
ck('§6','deferral',has('Shearer entropy counting')&&has('(P59)')&&has('(P39)')&&has('(P30)'),'deferral box honest: P59 and P39 with named prerequisites');
ck('§7','dirichlet',has('Dirichlet')&&has('1834')&&has('Schubfachprinzip'),'lineage: Dirichlet 1834, Schubfachprinzip');
ck('§7','ramsey-erdos',has('Ramsey')&&has('Erdős'),'lineage: Ramsey and Erdős named');
ck('§7','nonload',has('None of this history is load-bearing'),'history explicitly non-load-bearing');
ck('§3','catalogue-rows',has('<tr><td>residue classes</td>')&&has('<tr><td>odd parts</td>')&&has('<tr><td>bounded ranges</td>'),'catalogue rows present');
ck('§F','fig1-boxes',cnt('<rect x="10" y="52" width="70" height="78" rx="6"')===1&&cnt('<rect x="90" y="52"')===1&&cnt('<rect x="170" y="52"')===1&&cnt('<rect x="250" y="52"')===1,'Fig P10.1: four box rects at x=10/90/170/250');
ck('§F','fig1-collision',cnt('<circle cx="30" cy="92" r="13" fill="#3574d4"')===1&&cnt('<circle cx="60" cy="92" r="13" fill="#3574d4"')===1,'Fig P10.1: the colliding slots 1 and 8 highlighted');
ck('§F','fig1-slots',cnt('r="13"')===8,'Fig P10.1: eight slot circles');
ck('§F','fig2-chain',cnt('<circle cx="114" cy="88" r="11" fill="#3574d4"')===1&&cnt('<circle cx="252" cy="88" r="11" fill="#3574d4"')===1,'Fig P10.2: 12 and 96 highlighted on the odd-part-3 chain');
ck('§F','fig2-label',has('12 divides 96 — same chain'),'Fig P10.2: divisibility label present');
ck('§F','fig3-midlines',cnt('<line x1="170" y1="20" x2="170" y2="220"')===1&&cnt('<line x1="70" y1="120" x2="270" y2="120"')===1,'Fig P10.3: quadrant midlines drawn');
ck('§F','fig3-pair',cnt('<circle cx="195" cy="60" r="6" fill="#3574d4"')===1&&cnt('<circle cx="245" cy="95" r="6" fill="#3574d4"')===1,'Fig P10.3: the same-quadrant pair highlighted');
ck('§F','fig3-diagonal',has('quadrant diagonal √2')&&cnt('stroke-dasharray="4 3"')===1,'Fig P10.3: dashed diagonal labelled');
ck('§F','fig3-points',cnt('r="6"')===5,'Fig P10.3: five points');
