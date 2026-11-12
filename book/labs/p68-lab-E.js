// P68 Lab E — exercises ladder verification
async function main() {
  let seed = 777;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const eps = 1e-9;
  const checks: [string, boolean][] = [];
  // Ex1: |a-b|+|b-c|+|c-a| = 2(max-min)
  const ex1 = (a: number, b: number, c: number) => Math.abs(a-b)+Math.abs(b-c)+Math.abs(c-a) - 2*(Math.max(a,b,c)-Math.min(a,b,c));
  checks.push(['Ex1 identity exact on (3,1,4) and (2,5,2)', ex1(3,1,4) === 0 && ex1(2,5,2) === 0]);
  let ok1 = true;
  for (let i = 0; i < 200; i++) { const t = [rnd()*10, rnd()*10, rnd()*10]; if (Math.abs(ex1(t[0],t[1],t[2])) > eps) ok1 = false; }
  checks.push(['Ex1 identity on 200 random triples', ok1]);
  // Ex2: cyclic trap f = sum a^2/b; identity sum a^2/b = sum (a-b)^2/b + (a+b+c)
  const f2 = (a: number, b: number, c: number) => a*a/b + b*b/c + c*c/a;
  const id2 = (a: number, b: number, c: number) => (a-b)*(a-b)/b + (b-c)*(b-c)/c + (c-a)*(c-a)/a;
  checks.push(['Ex2 trap values f(1,2,4)=17.5, f(2,1,4)=12.25', f2(1,2,4) === 17.5 && f2(2,1,4) === 12.25]);
  let ok2 = true;
  for (const t of [[1,2,3],[2,1,4],[3,5,7],[1,1,1],[10,3,2]] as [number,number,number][]) if (Math.abs(f2(...t) - (id2(...t) + (t[0]+t[1]+t[2]))) > 1e-6) ok2 = false;
  checks.push(['Ex2 identity on 5 triples', ok2]);
  // Ex3: IMO 1995/2 — abc=1 => sum 1/(a^3(b+c)) >= 3/2
  const imo = (a: number, b: number, c: number) => 1/(a*a*a*(b+c)) + 1/(b*b*b*(c+a)) + 1/(c*c*c*(a+b));
  const triples: [number,number,number][] = [[1,1,1],[2,1,0.5],[3,1,1/3],[1,2,0.5],[4,0.5,0.5]];
  let ok3 = true;
  for (const t of triples) { const v = imo(...t); if (v < 1.5 - eps) ok3 = false; }
  checks.push(['Ex3 IMO 1995/2 >= 3/2 on 5 abc=1 triples', ok3]);
  checks.push(['Ex3 equality at (1,1,1): value exactly 3/2', Math.abs(imo(1,1,1) - 1.5) < eps]);
  // Ex5: Schur r=2,3 on (5,3,1)
  const schur = (r: number, a: number, b: number, c: number) =>
    Math.pow(a,r)*(a-b)*(a-c) + Math.pow(b,r)*(b-c)*(b-a) + Math.pow(c,r)*(c-a)*(c-b);
  const S2 = schur(2,5,3,1), S3 = schur(3,5,3,1);
  checks.push(['Ex5 S2(5,3,1)=172', S2 === 172]);
  checks.push(['Ex5 S3(5,3,1)=900', S3 === 900]);
  checks.push(['Ex5 172-8 divisible by 4; 900-8 divisible by 2', (172 - 8) % 4 === 0 && (900 - 8) % 2 === 0]);
  let ok5 = true;
  for (let i = 0; i < 200; i++) {
    const a = 1 + Math.floor(rnd()*20), b = 1 + Math.floor(rnd()*20), c = 1 + Math.floor(rnd()*20);
    if (schur(2,a,b,c) < -eps || schur(3,a,b,c) < -eps) ok5 = false;
  }
  checks.push(['Ex5 Schur r=2,3 nonnegative on 200 random integer triples', ok5]);
  return { checks, allGreen: checks.every(c => c[1]), poisons: { S2is196: S2 === 196, S3is996: S3 === 996, imoBelow15: imo(2,1,0.5) < 1.5 } };
}
