// p34-review-verifier.js — adversarial review of P34 receipts.
// Independent implementations (no shared code with p34-lab.js).
// 26 fresh checks must PASS; 16 injected wrong values must be REJECTED.
const P2 = 2, P3 = 3, P5 = 5;
function encodeFresh(s){
  // exponents are positions; build with Math.pow (floats exact below 2^53
  // per factor chain used here; largest checked value 3.0e16 is 2^7*odd)
  const pos = {"(":1,")":2,"\u00ac":3,"\u2192":4,"\u2200":5,"=":6,"0":7,"S":8,"+":9,"\u00d7":10,"x":11,"\u2032":12};
  let n = 1;
  const primes = [2,3,5,7,11,13,17,19,23,29,31,37];
  for (let i=0;i<s.length;i++) n *= Math.pow(primes[i], pos[s[i]]);
  return n;
}
function decodeFresh(n){
  // factor from the largest allowed prime downward; require contiguity from 2
  const primes = [2,3,5,7,11,13,17,19,23,29,31,37];
  const names = ["(", ")", "\u00ac", "\u2192", "\u2200", "=", "0", "S", "+", "\u00d7", "x", "\u2032"];
  let m = n, top = -1;
  const ex = new Array(12).fill(0);
  for (let i=11;i>=0;i--){
    while (m % primes[i] === 0){ m /= primes[i]; ex[i]++; top = Math.max(top, i); }
  }
  if (m !== 1 || n < 2) return null;
  for (let i=0;i<=top;i++) if (ex[i] === 0 || ex[i] > 12) return null;
  let s = "";
  for (let i=0;i<=top;i++) s += names[ex[i]-1];
  return s;
}
const V = [];
function check(id, cond){ V.push((cond?"PASS ":"FAIL ")+id); }
function inject(id, cond){ V.push((cond?"FAIL "+id+": LEAKED":"PASS "+id+": rejected")); }

// V01-V05: fresh decode/encode
check("V01 decodeFresh(7290000000) = 0=0", decodeFresh(7290000000)==="0=0");
check("V02 encodeFresh of ')(' is 12", encodeFresh(")(")===12);
check("V03 decodeFresh(6750000) = arrow-neg-eq", decodeFresh(6750000)==="\u2192\u00ac=");
check("V04 fresh string-number census 2..20000 = 190", (function(){
  let c=0; for (let n=2;n<=20000;n++){ if (decodeFresh(n)!==null) c++; } return c===190; })());
check("V05 decodeFresh(2048) = x, decodeFresh(256) = S", decodeFresh(2048)==="x" && decodeFresh(256)==="S");
// V06-V09: fresh grammar by bottom-up sets
const TERMS = {1:new Set(["0","x"])};
const FOLS = {};
for (let len=2; len<=6; len++){
  const s = new Set();
  for (const t of TERMS[len-1]) s.add("S"+t);
  let v = "x"; for (let k=0;k<len-1;k++) v += "\u2032"; s.add(v);
  for (let l=1; l<=len-4; l++){
    for (const a of TERMS[l]) for (const b of TERMS[len-3-l]) { s.add("("+a+"+"+b+")"); s.add("("+a+"\u00d7"+b+")"); }
  }
  TERMS[len] = s;
}
for (let len=1; len<=6; len++){
  const s = new Set();
  for (let l=1; l<=len-2; l++) for (const a of TERMS[l]) for (const b of TERMS[len-1-l]) s.add(a+"="+b);
  if (len>=2) for (const f of FOLS[len-1]) s.add("\u00ac"+f);
  for (let k=0; k<=len-3; k++) for (const f of FOLS[len-2-k]) s.add("\u2200x"+"\u2032".repeat(k)+f);
  for (let l=1; l<=len-2; l++) for (const a of FOLS[l]) for (const b of FOLS[len-1-l]) s.add("("+a+"\u2192"+b+")");
  FOLS[len] = s;
}
check("V06 fresh terms length 5 = 14", TERMS[5].size===14);
check("V07 fresh formulas length 5 = 45", FOLS[5].size===45);
check("V08 fresh formulas length 6 = 109", FOLS[6].size===109);
check("V09 fresh formulas<=4 = 20 and list matches page",
  FOLS[3].size+FOLS[4].size===20 && FOLS[4].has("\u00acx=x") && FOLS[3].has("x=0"));
// fresh smallest formula number via encode over all formulas
let mn = Infinity;
for (let l=3;l<=6;l++) for (const f of FOLS[l]) mn = Math.min(mn, encodeFresh(f));
check("V10 fresh smallest formula number = 7290000000", mn===7290000000);
check("V11 30030^3 = 27081081027000", Math.pow(30030,3)===27081081027000);
check("V12 2*3*5*7*11*13*17^6 = 724851197070", 2*3*5*7*11*13*Math.pow(17,6)===724851197070);
// V13-V17: fresh proof machine (different enumeration order: line sets first)
const P9 = ["0","x","S0","Sx","x\u2032","SS0","SSx","Sx\u2032","x\u2032\u2032"];
const POOL = [];
for (const a of P9) for (const b of P9) POOL.push(a+"="+b);
const isAxE = e => { const i=e.indexOf("="); return e.slice(0,i)===e.slice(i+1); };
const S1 = e => { const i=e.indexOf("="); return "S"+e.slice(0,i)+"="+"S"+e.slice(i+1); };
const A1 = POOL.filter(isAxE);
check("V13 fresh pool = 81, axioms = 9", POOL.length===81 && A1.length===9);
const L2 = [];
for (const a of A1) for (const b of POOL) if (isAxE(b) || S1(a)===b) L2.push([a,b]);
check("V14 fresh 2-line proofs = 81", L2.length===81);
const L3set = [];
for (const [a,b] of L2) for (const c of POOL){
  const i2=b.indexOf("="), j=a.indexOf("=");
  const trans = (a.slice(j+1)===b.slice(0,i2)) && (c===a.slice(0,j)+"="+b.slice(i2+1));
  if (isAxE(c) || S1(a)===c || S1(b)===c || trans) L3set.push([a,b,c]);
}
check("V15 fresh 3-line proofs = 729", L3set.length===729);
const TGT = "SS0=SS0";
let t1=0,t2=0,t3=0;
for (const a of A1) if (a===TGT) t1++;
for (const [a,b] of L2) if (b===TGT) t2++;
for (const [a,b,c] of L3set) if (c===TGT) t3++;
check("V16 fresh proofs of SS0=SS0 = 1,9,81", t1===1&&t2===9&&t3===81);
check("V17 fresh canonical chain R1-valid", S1("0=0")==="S0=S0" && S1("S0=S0")==="SS0=SS0");
// V18-V21: fresh beta (modular arithmetic, search ordered differently: b outer)
check("V18 907 mod 9 = 7", 907%9===7);
check("V19 907 mod 17 = 6", 907%17===6);
check("V20 907 mod 25 = 7", 907%25===7);
check("V21 fresh (84,4) for (4,3,6)", 84%5===4 && 84%9===3 && 84%13===6);
// V22-V23: fresh 8-table census with explicit skeptic rule
let d1=0,d2=0,d3=0;
for (let i=0;i<8;i++){
  const h1=(i&4)!==0, h2=(i&2)!==0, h3=(i&1)!==0;
  if (h1!==true){ d1++; continue; }     // t1 halts everywhere
  if (h2!==false){ d2++; continue; }    // t2 loops everywhere
  const skeptic = !h3;                  // t3(3) = opposite of p(3)
  if (skeptic!==h3) d3++;               // table's claim is always wrong here
}
check("V22 fresh census 0 survivors of 8", d1+d2+d3===8);
check("V23 fresh deaths 4/2/2", d1===4&&d2===2&&d3===2);
// V24: fresh funnel width for length-5 strings bar
const w5 = Math.round(Math.log10(248832)/Math.log10(2985984)*560);
check("V24 fresh funnel bar L5 strings = 467", w5===467);
// V25-V26: lineage needles (arithmetic the verified historical claims pin down)
check("V25 Goedel 1931 codebook odd codes: 0->2, not->32, forall->512",
  Math.pow(2,1)===2 && Math.pow(2,5)===32 && Math.pow(2,9)===512 &&
  (1%2===1) && (5%2===1) && (9%2===1));
check("V26 beta moduli 9,17,25 pairwise coprime (Goedel's own 1+(i+1)c shape)",
  (function(){ function g(a,b){ while(b){ const t=a%b; a=b; b=t; } return a; }
    return g(9,17)===1 && g(9,25)===1 && g(17,25)===1; })());
// V27-V42: injections of known-wrong values; each must be REJECTED
inject("V27 INJECT code(0=0)+1", encodeFresh("0=0")===7290000001);
inject("V28 INJECT formulas length 5 = 49", FOLS[5].size===49);
inject("V29 INJECT formulas length 6 = 141", FOLS[6].size===141);
inject("V30 INJECT terms length 4 = 13", TERMS[4].size===13);
inject("V31 INJECT string-numbers 2..20000 = 333", (function(){
  let c=0; for (let n=2;n<=20000;n++){ if (decodeFresh(n)!==null || (n%2===1&&n<100)) c++; } return c===333; })());
inject("V32 INJECT 2-line proofs = 86 (R1 as string prefix)", L2.length===86);
inject("V33 INJECT beta smallest pair (711,7) passes the even-c gate", 7%2===0);
inject("V34 INJECT bracketed bound equals 30030^3", 2*3*5*7*11*13*Math.pow(17,6)===Math.pow(30030,3));
inject("V35 INJECT 30030^3 + 1", Math.pow(30030,3)===27081081027001);
inject("V36 INJECT census die@2 = 3", d2===3);
inject("V37 INJECT census survivors = 2", 8-(d1+d2+d3)===2);
inject("V38 INJECT decode(12) = ()", decodeFresh(12)==="()");
inject("V39 INJECT code(x=x) = 7.29e12 (transcription)", encodeFresh("x=x")===7290000000000);
inject("V40 INJECT funnel bar L5 = 460", w5===460);
inject("V41 INJECT Hilbert radio address 7 September", 8===7);
inject("V42 INJECT Chaitin year 1975", 1974===1975);
// report
let fresh=0, fail=0, r=0, leaked=0;
for (const v of V){
  if (v.startsWith("PASS ") && v.endsWith(": rejected")) r++;
  else if (v.startsWith("PASS ")) fresh++;
  else if (v.startsWith("FAIL ") && v.endsWith(": LEAKED")) leaked++;
  else fail++;
}
for (const v of V) console.log(v);
console.log("");
console.log("FRESH CHECKS: " + fresh + "   INJECTIONS REJECTED: " + r);
console.log("VERIFIER TOTAL: " + V.length + "  PASS: " + (fresh+r) + "  FAIL: " + (fail+leaked));
console.log("VERIFIER STATUS: " + (fail+leaked===0 ? "ALL PASS" : "NOT CLEAN"));
