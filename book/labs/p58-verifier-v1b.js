// p58-verifier-v1b.js — page-consistency gates, rewired post-merge (7b). Sync by design.
// Inputs injected by the runner: globalThis.__p58PageHtml (the page), globalThis.__p58Parents={p19,p26}.
(function(){
  const gates=[],poisons=[];
  const g=(n,c)=>gates.push((c?'PASS ':'FAIL ')+n);
  const p=(n,r)=>poisons.push((r?'REJECTED ':'NOT-CAUGHT ')+n);
  const H=globalThis.__p58PageHtml||'',PR=globalThis.__p58Parents||{};
  const bs=String.fromCharCode(92);
  const cnt=(s,sub)=>s.split(sub).length-1;
  g('V1b-1 page present and whole (>50000 chars)', H.length>50000);
  g('V1b-2 zero $ delimiters (no $ math anywhere)', H.indexOf('$')===-1);
  const io=cnt(H,bs+'('),ic=cnt(H,bs+')'),dq=cnt(H,bs+'['),dcl=cnt(H,bs+']');
  g('V1b-3 MathJax 295/295 inline + 2/2 display, all balanced', io===295&&ic===295&&dq===2&&dcl===2);
  g('V1b-4 kicker "the seventeenth move of tier 5" exactly once', cnt(H,'the seventeenth move of tier 5')===1);
  g('V1b-5 SRI integrity attribute exactly once', cnt(H,'integrity=')===1);
  const want={'index.html':2,'p03-special-cases.html':1,'p05-canonical-form.html':1,'p09-invariant.html':3,'p10-pigeonhole.html':1,'p15-squeeze.html':1,'p16-isomorphism.html':2,'p19-count-outcomes.html':2,'p24-waves.html':2,'p26-model-with-equation.html':2,'p37-ito-calculus.html':1,'p59-shearer-entropy.html':2,'p69-telescoping.html':1};
  const hs=(H.match(/href="[^"]*"/g)||[]).filter(function(h){return h.slice(-6)==='.html"';});
  const got={};hs.forEach(function(h){got[h.slice(6,-1)]=(got[h.slice(6,-1)]||0)+1;});
  const wk=Object.keys(want);
  g('V1b-6 href multiset exact: 21 html hrefs (22 with stylesheet), all published-canonical, zero extras',
    hs.length===21&&wk.every(function(k){return got[k]===want[k];})&&Object.keys(got).length===wk.length&&H.indexOf('assets/style.css')>=0);
  const i0=H.indexOf('id="encounter"'),enc=H.slice(i0,H.indexOf('</section>',i0));
  const banned=['Benford','Weyl','Birkhoff','Boltzmann','Furstenberg','Sze','Poincar','ergodic','Khinchin','Gauss','Einstein','Polya','Koopman','von Neumann'];
  g('V1b-7 section 2 (encounter) name-free', i0>=0&&banned.every(function(w){return enc.indexOf(w)<0;}));
  g('V1b-8 door-quotes carried: P19 verbatim x1, P26 "run to its ergodic limit" x1',
    cnt(H,'density becomes recurrence, the soft-analysis shadow of counting')===1&&cnt(H,'run to its ergodic limit')===1);
  g('V1b-9 door-quotes verbatim in parents (live fetch at sha 54646a49, archived this session)',
    !!PR.p19&&PR.p19.indexOf('density becomes recurrence, the soft-analysis shadow of counting')>=0
    &&!!PR.p26&&PR.p26.indexOf('trades counting for recurrence')>=0&&PR.p26.indexOf('run to its ergodic limit')>=0);
  g('V1b-10 moons summary "●○○ ●●○ ●●○ ●●● ◆ ◐" once, "Or, in words:" once, six exercises, Fig P58.1/P58.2 x2 each',
    cnt(H,'●○○ ●●○ ●●○ ●●● ◆ ◐')===1&&cnt(H,'Or, in words:')===1&&cnt(H,'<strong>Exercise ')===6
    &&cnt(H,'Fig P58.1')===2&&cnt(H,'Fig P58.2')===2);
  const exRe=/<p class="ex"><strong>Exercise (\d+)[^<]*<\/strong> ([●◆◐○]+)<br>/g;
  let mm,seq=[];
  while((mm=exRe.exec(H)))seq.push(mm[2]);
  const joined=seq.join(' ');
  g('V1b-13 NEW moons-sequence gate (defect #19): per-exercise moons "'+joined+'" match the summary line',
    seq.length===6&&joined==='●○○ ●●○ ●●○ ●●● ◆ ◐');
  const need=['six of the first twenty','1249.4','579.9','271.82','262.83','count 500','at digit 7','never reaches two counts'];
  g('V1b-11 all eight corrected needles present', need.every(function(w){return H.indexOf(w)>=0;}));
  const graft=['0.41504','0.04139','0.02228','N = 10^4','2.685452','returns 2.6854 at a million factors','1.00000000','ten thousand steps from','PNAS 18, 70–82','Green–Tao','Perron–Frobenius','hundred thousand','1 + '+bs+'tfrac{1}{k(k+2)}','Lyapunov receipt','digits are all 1s','(all 2s)','Two rooms, one discipline','Three exemplars','Four exhibits','an 1800 notebook','delta^2'];
  g('V1b-14 all '+graft.length+' graft needles present', graft.every(function(w){return H.indexOf(w)>=0;}));
  const tab=['3010','1761','1249','970','791','670','579','512','458'];
  g('V1b-12 census table row fully present (corrected first-10^4 window)', tab.every(function(w){return H.indexOf(w)>=0;}));
  p('V1b-P1 stale hand-count "seven of the first twenty" / "seven of twenty"',
    H.indexOf('seven of the first twenty')<0&&H.indexOf('seven of twenty')<0);
  p('V1b-P2 stale Benford values 1249.3 / 578.8', H.indexOf('1249.3')<0&&H.indexOf('578.8')<0);
  p('V1b-P3 stale polyline values 271.93 / 380,262.78 (d6 bar y=262.78 is legitimate)',
    H.indexOf('271.93')<0&&H.indexOf('380,262.78')<0);
  p('V1b-P4 orbit-B "count 250"', H.indexOf('count 250')<0);
  p('V1b-P5 "never exceeds one count"', H.indexOf('never exceeds one count')<0);
  p('V1b-P6 stale aria "digits 2 and 4"', H.indexOf('digits 2 and 4')<0);
  p('V1b-P7 external ordinal "thirteenth"', H.indexOf('thirteenth')<0);
  p('V1b-P8 noncanonical href p24-split-into-waves', H.indexOf('p24-split-into-waves')<0);
  p('V1b-P9 planned-page hrefs leaked (p38/p70/p28/p63 as links)',
    H.indexOf('href="p38')<0&&H.indexOf('href="p70')<0&&H.indexOf('href="p28')<0&&H.indexOf('href="p63')<0);
  p('V1b-P10 self-link href to p58', H.indexOf('href="p58')<0);
  p('V1b-P11 stale census digit-2 value 1760 (window 2^2..)', H.indexOf('>1760<')<0&&H.indexOf('1761')>=0);
  p('V1b-P12 external X1 overclaim "four decimal places"', H.indexOf('four decimal places')<0);
  p('V1b-P13 external X3 "coined" / X4 "weeks later"', H.indexOf('coined')<0&&H.indexOf('weeks later')<0);
  p('V1b-P14 external X2 "therefore uniquely ergodic"', H.indexOf('therefore uniquely ergodic')<0);
  p('V1b-P15 noncanonical p09-find-invariant / p16-structural-isomorphism / p01-pin-down-problem',
    H.indexOf('p09-find-invariant')<0&&H.indexOf('p16-structural-isomorphism')<0&&H.indexOf('p01-pin-down-problem')<0);
  p('V1b-P16 inlined <style> in head', H.indexOf('<style')<0);
  p('V1b-P17 stale pre-graft moons summary "●○○ ●●○ ●●● ◆ ◐ ◐"', H.indexOf('●○○ ●●○ ●●● ◆ ◐ ◐')<0);
  p('V1b-P18 "Perron-Frobenius" with ASCII hyphen (graft-damage check)', H.indexOf('Perron-Frobenius')<0);
  globalThis.p58V1b={gates,poisons,chars:H.length,hrefs:hs.length,moons:joined};
})();
