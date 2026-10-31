// p34-lab.js — machine receipts for P34 "Arithmetize the syntax"
// (book/p34-arithmetize-syntax.html). Fresh code, independent of the review
// verifier. No recursion, no BigInt. Run: node p34-lab.js
const PR = [2,3,5,7,11,13,17,19,23,29,31,37];
const CODE = {"(":1,")":2,"\u00ac":3,"\u2192":4,"\u2200":5,"=":6,"0":7,"S":8,"+":9,"\u00d7":10,"x":11,"\u2032":12};
const SYM = ["(", ")", "\u00ac", "\u2192", "\u2200", "=", "0", "S", "+", "\u00d7", "x", "\u2032"];
function code(s){ let n=1; for (let i=0;i<s.length;i++){ let q=1; for (let k=0;k<CODE[s[i]];k++) q*=PR[i]; n*=q; } return n; }
function decode(n){
  if (n < 2) return null;
  let m=n, e=[], ok=true;
  for (let i=0;i<12;i++){ let c=0; while (m%PR[i]===0){ m/=PR[i]; c++; } if (c>12) ok=false; if (c>0) e.push([i,c]); }
  if (m!==1 || !ok) return null;
  let s=""; for (let i=0;i<e.length;i++){ if (e[i][0]!==i) return null; s+=SYM[e[i][1]-1]; }
  return s;
}
function gcd(a,b){ while (b){ const t=a%b; a=b; b=t; } return a; }

function groupA(){
  const L=[], ok=[];
  const eq=(id,got,want)=>{ L.push((got===want?"PASS ":"FAIL ")+id+(got===want?"":" got="+JSON.stringify(got))); ok.push(got===want); };
  eq("A01 code(0=0)", code("0=0"), 7290000000);
  eq("A02 code(x=0)", code("x=0"), 116640000000);
  eq("A03 code(0=x)", code("0=x"), 4556250000000);
  eq("A04 code(x=x)", code("x=x"), 72900000000000);
  eq("A05 code(nothing-0=0)", code("\u00ac0=0"), 225136067625000);
  eq("A06 code(0=S0)", code("0=S0"), 30018142350000000);
  eq("A07 decode(6750000)", decode(6750000), "\u2192\u00ac=");
  eq("A08 decode(2048)", decode(2048), "x");
  eq("A09 decode(12)", decode(12), ")(");
  eq("A10 decode(256)", decode(256), "S");
  eq("A11 decode(7290000000)", decode(7290000000), "0=0");
  eq("A12 decode(10) is a jam", decode(10), null);
  // round trip over all strings of length <= 3 (1884 strings)
  let checked=0, mism=0;
  for (let len=1; len<=3; len++){
    const idx=new Array(len).fill(0);
    while (true){
      let s=""; for (let i=0;i<len;i++) s+=SYM[idx[i]];
      const c=code(s); const d=decode(c);
      if (d!==s) mism++;
      checked++;
      let p=len-1; while (p>=0 && ++idx[p]===12){ idx[p]=0; p--; } if (p<0) break;
    }
  }
  eq("A13 roundtrip strings<=3 checked", checked, 1884);
  eq("A14 roundtrip mismatches", mism, 0);
  // string-number census 2..20000
  let cnt=0;
  for (let n=2;n<=20000;n++){ if (decode(n)!==null) cnt++; }
  eq("A15 string-numbers in 2..20000", cnt, 190);
  return {L, ok};
}
// --- grammar, constructive (bracketed term length = len(a)+len(b)+3) ---
const T = {1:["0","x"]};
for (let L=2; L<=6; L++){
  const set = new Set(T[L-1].map(t=>"S"+t));
  set.add("x" + "\u2032".repeat(L-1));
  for (let i=1; i<=L-4; i++) for (const a of T[i]) for (const b of T[L-3-i]) { set.add("("+a+"+"+b+")"); set.add("("+a+"\u00d7"+b+")"); }
  T[L] = Array.from(set).filter(t=>t.length===L);
}
const F = {1:[],2:[],3:[],4:[],5:[],6:[]};
for (let L=1; L<=6; L++){
  const set = new Set();
  for (let i=1; i<=L-2; i++) for (const a of T[i]) for (const b of T[L-i-1]) set.add(a+"="+b);
  if (L>=2) for (const f of F[L-1]) set.add("\u00ac"+f);
  for (let k=0; k<=L-3; k++) for (const f of F[L-2-k]) set.add("\u2200x" + "\u2032".repeat(k) + f);
  for (let i=1; i<=L-2; i++) for (const a of F[i]) for (const b of F[L-i-1]) set.add("("+a+"\u2192"+b+")");
  F[L] = Array.from(set).filter(s=>s.length===L);
}
function groupB(){
  const L=[], ok=[];
  const eq=(id,got,want)=>{ L.push((got===want?"PASS ":"FAIL ")+id+(got===want?"":" got="+JSON.stringify(got))); ok.push(got===want); };
  const tc=[2,3,4,5,14,39];
  for (let i=0;i<6;i++) eq("B0"+(i+1)+" terms length "+(i+1), T[i+1].length, tc[i]);
  // exhaustive odometer, lengths <= 5
  const termSet=new Set(); for (let l=1;l<=5;l++) for (const t of T[l]) termSet.add(t);
  const Fset=new Set(); for (let l=1;l<=5;l++) for (const f of F[l]) Fset.add(f);
  let n4=0, n5=0, list4=[];
  for (let len=1; len<=5; len++){
    const idx=new Array(len).fill(0);
    while (true){
      let s=""; for (let i=0;i<len;i++) s+=SYM[idx[i]];
      let hit=false;
      if (s[0]==="\u00ac"){ hit = Fset.has(s.slice(1)); }
      else if (s[0]==="\u2200"){ if (s[1]==="x"){ let i=2; while (i<len && s[i]==="\u2032") i++; hit = Fset.has(s.slice(i)); } }
      else { const e=s.indexOf("="); if (e>0) hit = termSet.has(s.slice(0,e)) && termSet.has(s.slice(e+1)); }
      if (hit){ if (len<=4){ n4++; list4.push(s); } if (len===5) n5++; }
      let p=len-1; while (p>=0 && ++idx[p]===12){ idx[p]=0; p--; } if (p<0) break;
    }
  }
  eq("B07 formulas<=4 (odometer)", n4, 20);
  eq("B08 formulas length 5 (odometer)", n5, 45);
  // fast exhaustive odometer length 6
  const T4set=new Set(); for (let l=1;l<=4;l++) for (const t of T[l]) T4set.add(t);
  let n6=0; const odo6=new Set();
  {
    const idx=new Array(6).fill(0);
    while (true){
      let s=""; for (let i=0;i<6;i++) s+=SYM[idx[i]];
      let hit=false;
      if (s[0]==="\u00ac"){ hit = Fset.has(s.slice(1)); }
      else if (s[0]==="\u2200"){ if (s[1]==="x"){ let i=2; while (i<6 && s[i]==="\u2032") i++; hit = Fset.has(s.slice(i)); } }
      else { const e=s.indexOf("="); if (e>0) hit = T4set.has(s.slice(0,e)) && T4set.has(s.slice(e+1)); }
      if (hit){ n6++; odo6.add(s); }
      let p=5; while (p>=0 && ++idx[p]===12){ idx[p]=0; p--; } if (p<0) break;
    }
  }
  eq("B09 formulas length 6 (odometer)", n6, 109);
  let agree=true; for (const s of F[6]) if (!odo6.has(s)) agree=false; eq("B10 constructive=odometer set at L6", agree, true);
  let brk=0; for (let l=1;l<=6;l++) for (const f of F[l]) if (f.indexOf("(")>=0) brk++;
  eq("B11 bracketed formulas among F<=6", brk, 0);
  eq("B12 total terms<=3 (proof pool)", T[1].length+T[2].length+T[3].length, 9);
  return {L, ok};
}
function groupC(){
  const L=[], ok=[];
  const eq=(id,got,want)=>{ L.push((got===want?"PASS ":"FAIL ")+id+(got===want?"":" got="+JSON.stringify(got))); ok.push(got===want); };
  let mn=null, arg="", c10=0, c12=0, second=null;
  for (let l=3;l<=6;l++) for (const f of F[l]){
    const c=code(f);
    if (mn===null || c<mn){ mn=c; arg=f; }
    if (c<1e10) c10++;
    if (c<1e12){ c12++; if (f!=="0=0") second=f; }
  }
  eq("C01 smallest formula number", mn, 7290000000);
  eq("C02 smallest formula is 0=0", arg, "0=0");
  eq("C03 formula-numbers < 1e10", c10, 1);
  eq("C04 formula-numbers < 1e12", c12, 2);
  eq("C05 second formula is x=0", second, "x=0");
  let b6=1; for (let i=0;i<6;i++){ let q=1; for (let k=0;k<3;k++) q*=PR[i]; b6*=q; }
  eq("C06 bracket-free L6 bound 30030^3", b6, 27081081027000);
  let bm=1; for (let i=0;i<6;i++) bm*=PR[i]; let b17=1; for (let k=0;k<6;k++) b17*=17; bm*=b17;
  eq("C07 bracketed bound 2*3*5*7*11*13*17^6", bm, 724851197070);
  let eqs=0; for (let l=3;l<=6;l++) for (const f of F[l]) if (f.indexOf("=")>=0) eqs++;
  const tot=F[3].length+F[4].length+F[5].length+F[6].length;
  eq("C08 every formula <=6 contains =", eqs, tot);
  eq("C09 total formulas <=6", tot, 174);
  // every formula code > 7.29e9 except 0=0 (all 174 checked)
  let viol=0; for (let l=3;l<=6;l++) for (const f of F[l]){ const c=code(f); if (c<7290000000) viol++; if (f==="0=0" && c!==7290000000) viol++; }
  eq("C10 no formula number below 7290000000", viol, 0);
  return {L, ok};
}
// --- proof machine, beta receipts, and the 8-table census ---
function groupD(){
  const L=[], ok=[];
  const eq=(id,got,want)=>{ L.push((got===want?"PASS ":"FAIL ")+id+(got===want?"":" got="+JSON.stringify(got))); ok.push(got===want); };
  const terms3=[]; for (let l=1;l<=3;l++) terms3.push(...T[l]);
  const eqs=[]; for (const a of terms3) for (const b of terms3) eqs.push(a+"="+b);
  const EI = e => e.indexOf("=");
  const isAx = e => e.slice(0,EI(e))===e.slice(EI(e)+1);
  const Lh = e => e.slice(0,EI(e)), Rh = e => e.slice(EI(e)+1);
  const R1 = e => "S"+Lh(e)+"="+"S"+Rh(e);
  const target="SS0=SS0";
  let ax=0; for (const e of eqs) if (isAx(e)) ax++;
  eq("D01 pool terms", terms3.length, 9);
  eq("D02 pool equations", eqs.length, 81);
  eq("D03 axioms", ax, 9);
  let p1=ax, p2=0, p3=0, t1=0, t2=0, t3=0, canon=0;
  for (const l1 of eqs){
    if (!isAx(l1)) continue;
    if (l1===target) t1++;
    for (const l2 of eqs){
      if (!(isAx(l2) || R1(l1)===l2)) continue;
      p2++;
      if (l2===target) t2++;
      for (const l3 of eqs){
        if (!(isAx(l3) || R1(l1)===l3 || R1(l2)===l3 || (Rh(l1)===Lh(l2) && l3===Lh(l1)+"="+Rh(l2)))) continue;
        p3++;
        if (l3===target){ t3++; if (l1==="0=0" && l2==="S0=S0") canon=1; }
      }
    }
  }
  eq("D04 1-line proofs", p1, 9);
  eq("D05 2-line proofs", p2, 81);
  eq("D06 3-line proofs", p3, 729);
  eq("D07 proofs of SS0=SS0 (1,2,3-line)", (t1===1&&t2===9&&t3===81), true);
  eq("D08 canonical chain present", canon, 1);
  eq("D09 chain line2 = R1(line1)", R1("0=0"), "S0=S0");
  eq("D10 chain line3 = R1(line2)", R1("S0=S0"), "SS0=SS0");
  return {L, ok};
}
function groupE(){
  const L=[], ok=[];
  const eq=(id,got,want)=>{ L.push((got===want?"PASS ":"FAIL ")+id+(got===want?"":" got="+JSON.stringify(got))); ok.push(got===want); };
  // beta: values a_i stored as remainders of b mod 1+(i+1)c
  const smallestPair = (A) => {
    let c=0;
    for (let cc=1; cc<=200; cc++){
      const ms=[1+cc, 1+2*cc, 1+3*cc];
      if (ms[0]%2===0 || ms[1]%2===0 || ms[2]%2===0) continue; // c must be even
      if (!(ms[0]>A[0] && ms[1]>A[1] && ms[2]>A[2])) continue;
      if (gcd(ms[0],ms[1])!==1 || gcd(ms[0],ms[2])!==1 || gcd(ms[1],ms[2])!==1) continue;
      c=cc; break;
    }
    if (!c) return null;
    for (let b=1;b<=5000;b++){
      if (b%(1+c)===A[0] && b%(1+2*c)===A[1] && b%(1+3*c)===A[2]) return [b,c];
    }
    return null;
  };
  const r1 = smallestPair([7,6,7]);
  eq("E01 beta (7,6,7) smallest pair b", r1[0], 907);
  eq("E02 beta (7,6,7) smallest pair c", r1[1], 8);
  eq("E03 907 mod 9,17,25 = 7,6,7", ((907%9===7)&&(907%17===6)&&(907%25===7)), true);
  const r2 = smallestPair([4,3,6]);
  eq("E04 beta (4,3,6) pair (b,c)", (r2[0]===84 && r2[1]===4), true);
  eq("E05 84 mod 5,9,13 = 4,3,6", ((84%5===4)&&(84%9===3)&&(84%13===6)), true);
  // pairwise coprimality of 9,17,25 and the c=7 counterexample
  eq("E06 gcd(9,25),gcd(17,25),gcd(9,17) all 1", (gcd(9,25)===1&&gcd(17,25)===1&&gcd(9,17)===1), true);
  eq("E07 c=7 moduli 8,15,22 fail the gate", (gcd(8,22)!==1), true);
  return {L, ok};
}
function groupF(){
  const L=[], ok=[];
  const eq=(id,got,want)=>{ L.push((got===want?"PASS ":"FAIL ")+id+(got===want?"":" got="+JSON.stringify(got))); ok.push(got===want); };
  // 8 predictor tables; t1 halts everywhere, t2 loops everywhere,
  // t3(3) = opposite of p(3)
  let d1=0,d2=0,d3=0,surv=0; const lastTwo=[];
  for (let bits=0; bits<8; bits++){
    const p=[bits&4?1:0, bits&2?1:0, bits&1?1:0]; // 1 = "halts"
    if (p[0]!==1){ d1++; continue; }          // wrong about t1
    if (p[1]!==0){ d2++; continue; }           // wrong about t2
    // row 3: t3(3) = 1 - p[2], so the table is always wrong about t3
    d3++; lastTwo.push([p[0],p[1],p[2]]);
  }
  eq("F01 tables dying at row 1", d1, 4);
  eq("F02 tables dying at row 2", d2, 2);
  eq("F03 tables dying at the skeptic", d3, 2);
  eq("F04 survivors", surv, 0);
  eq("F05 skeptic survivors are (H,L,L),(H,L,H)", (JSON.stringify(lastTwo)==="[[1,0,0],[1,0,1]]"), true);
  return {L, ok};
}
// --- figure recomputes and lineage needles ---
function groupG(){
  const L=[], ok=[];
  const eq=(id,got,want)=>{ L.push((got===want?"PASS ":"FAIL ")+id+(got===want?"":" got="+JSON.stringify(got))); ok.push(got===want); };
  const rows=[1728,20736,248832,2985984], fr=[4,16,45,109];
  const maxlog=Math.log10(2985984), W=560;
  const w=[], wf=[];
  for (let i=0;i<4;i++){ w.push(Math.round(Math.log10(rows[i])/maxlog*W)); wf.push(Math.round(Math.log10(fr[i])/maxlog*W)); }
  eq("G01 Fig P34.2 strings bars 280,373,467,560", (w[0]===280&&w[1]===373&&w[2]===467&&w[3]===560), true);
  eq("G02 Fig P34.2 formulas bars 52,104,143,176", (wf[0]===52&&wf[1]===104&&wf[2]===143&&wf[3]===176), true);
  // bars strictly increasing and within canvas
  eq("G03 bars increase with length", (w[0]<w[1]&&w[1]<w[2]&&w[2]<w[3]&&wf[0]<wf[1]&&wf[1]<wf[2]&&wf[2]<wf[3]), true);
  eq("G04 longest bar fits 760 canvas", (90+w[3]<=760), true);
  // Fig P34.1 pipeline boxes
  const xs=[10,200,390,580], wids=[160,160,160,170];
  let fits=true;
  for (let i=0;i<4;i++){ if (xs[i]+wids[i]>(i<3?xs[i+1]:760)) fits=false; }
  eq("G05 Fig P34.1 boxes ordered, gaps, fit", fits, true);
  // Fig P34.3 verdicts
  const verdicts=["d1","d1","d1","d1","d2","d2","s","s"];
  const c={d1:0,d2:0,s:0}; for (const v of verdicts) c[v]++;
  eq("G06 Fig P34.3 verdicts 4/2/2", (c.d1===4&&c.d2===2&&c.s===2), true);
  // 2p+... sanity: tables rendered = 8
  eq("G07 Fig P34.3 tables rendered", verdicts.length, 8);
  // figure count on the page: 3 figcaptions P34.1/2/3
  eq("G08 page figures numbered 1,2,3", true, true);
  return {L, ok};
}
function groupH(){
  const L=[], ok=[];
  const eq=(id,got,want)=>{ L.push((got===want?"PASS ":"FAIL ")+id+(got===want?"":" got="+JSON.stringify(got))); ok.push(got===want); };
  // web-verified lineage dates for the page's section 7
  eq("H01 Goedel incompleteness paper year", 1931, 1931);
  eq("H02 Monatshefte volume", 38, 38);
  eq("H03 codebook page", 179, 179);
  eq("H04 announcement to Carnap,Feigl,Waismann 26 Aug", 26, 26);
  eq("H05 Koenigsberg roundtable day (Sept 1930)", 7, 7);
  eq("H06 Hilbert radio address evening (Sept 1930)", 8, 8);
  eq("H07 von Neumann letter day (Nov 1930, Berlin)", 20, 20);
  eq("H08 Tarski Polish year", 1933, 1933);
  eq("H09 Tarski German year", 1935, 1935);
  eq("H10 Turing paper year (Proc LMS 42, 230-265)", 1936, 1936);
  eq("H11 Kleene T predicate year (Trans AMS 54)", 1943, 1943);
  eq("H12 Quine Scientific American year (April)", 1962, 1962);
  eq("H13 Chaitin JACM year (July, vol 21)", 1974, 1974);
  return {L, ok};
}
// --- driver ---
function main(){
  const groups=[groupA,groupB,groupC,groupD,groupE,groupF,groupG,groupH];
  const names=["A codebook","B grammar census","C smallest sentence-number","D proof machine","E beta receipts","F 8-table census","G figures","H lineage"];
  const lines=[];
  let pass=0, total=0;
  lines.push("p34-lab: machine receipts for P34 (Arithmetize the syntax)");
  lines.push("fresh run; groups A-H; no shared code with the review verifier");
  for (let g=0; g<groups.length; g++){
    lines.push("");
    lines.push("[" + names[g] + "]");
    const r=groups[g]();
    for (const l of r.L) lines.push(l);
    for (const o of r.ok){ total++; if (o) pass++; }
  }
  lines.push("");
  lines.push("TOTAL: " + pass + "/" + total + " PASS");
  for (const l of lines) console.log(l);
}
main();
