async function main() {
  const BS = String.fromCharCode(92);
  const f = await tools.file_system.read_file({ path: '/home/user/knowledge/graph-driven-math-book/wip/p39-page.html' });
  const page = String(f.content);
  const mu = (n) => { if (n === 1) return 1; let m = n, r = 1, c = 0; for (let p = 2; p * p <= m; p++) { if (m % p === 0) { c++; m /= p; if (m % p === 0) return 0; r = -r; } } if (m > 1) { c++; r = -r; } return c ? r : 0; };
  const survivors = (X) => { const a = []; for (let n = 1; n <= X; n++) if (n % 2 && n % 3 && n % 5) a.push(n); return a; };
  const divs30 = [1, 2, 3, 5, 6, 10, 15, 30];
  const D = [1, 2, 3, 5, 6];
  const trunc = (n) => D.filter(d => n % d === 0).reduce((s, d) => s + mu(d), 0);
  const gates = [], poisons = [];
  const g = (n, p) => gates.push({ name: n, pass: !!p });
  const po = (n, p) => poisons.push({ name: n, pass: !!p });

  const s30 = survivors(30);
  const disp30 = '30 ' + BS + ';-' + BS + '; 15 ' + BS + ';-' + BS + '; 10 ' + BS + ';-' + BS + '; 6 ' + BS + ';+' + BS + '; 5 ' + BS + ';+' + BS + '; 3 ' + BS + ';+' + BS + '; 2 ' + BS + ';-' + BS + '; 1 ' + BS + ';=' + BS + '; 8';
  g('A1 survivor census at 30: count 8, exact list, page needle', s30.length === 8 && s30.join(', ') === '1, 7, 11, 13, 17, 19, 23, 29' && page.includes('1, 7, 11, 13, 17, 19, 23, 29'));
  let ie30 = 0; for (const d of divs30) ie30 += mu(d) * (30 / d);
  g('A2 exact inclusion-exclusion at 30 = 8 (recomputed) + display needle', ie30 === 8 && page.includes(disp30));
  const floors = divs30.map(d => Math.floor(100 / d));
  let ie100 = 0; for (let i = 0; i < 8; i++) ie100 += mu(divs30[i]) * floors[i];
  g('A3 inclusion-exclusion at 100 with floors = 26 (recomputed) + page needle', ie100 === 26 && page.includes('100 - 50 - 33 - 20 + 16 + 10 + 6 - 3 = 26'));
  g('A4 direct survivor enumeration up to 100 = 26 (independent)', survivors(100).length === 26);
  g('A5 2^15 = 32768 at least thirteen times 2500 + page needles', Math.pow(2, 15) === 32768 && 32768 >= 13 * 2500 && page.includes('32{,}768') && page.includes('thirteen times'));
  g('A6 truncated sign-sum at n=10 = -1 (recomputed) + page needle', trunc(10) === -1 && page.includes('1 - 1 - 1 = -1'));
  g('A7 truncated sign-sum at n=30 = -1 (recomputed) + page needle', trunc(30) === -1 && page.includes('1 - 1 - 1 - 1 + 1 = -1'));
  const ps = {}; for (const d of divs30) { let s = 0; for (const e of D) if (d % e === 0) s += mu(e); ps[d] = s; }
  g('A8 profile sign-sums: dip exactly at profiles 10, 15, 30 (Fig P39.2 claim)', ps[1] === 1 && ps[2] === 0 && ps[3] === 0 && ps[5] === 0 && ps[6] === 0 && ps[10] === -1 && ps[15] === -1 && ps[30] === -1);
  const dips = []; for (let n = 1; n <= 100; n++) if (trunc(n) < 0) dips.push(n);
  const dipOK = dips.every(n => n % 10 === 0 || n % 15 === 0);
  g('A9 all dips up to 100: 13 numbers, every one with profile 10/15/30', dips.length === 13 && dipOK && dips[0] === 10 && dips[12] === 100);
  g('A10 the eight floors match the page terms (100, then 50,33,20,16,10,6,3)', floors[0] === 100 && floors.slice(1).join(', ') === '50, 33, 20, 16, 10, 6, 3');

  const bad100 = page.replace('100 - 50 - 33 - 20 + 16 + 10 + 6 - 3 = 26', '100 - 50 - 33 - 20 + 16 + 10 + 6 - 3 = 27');
  po('P1 corrupted I-E answer (26 to 27) is caught by the needle', !bad100.includes('100 - 50 - 33 - 20 + 16 + 10 + 6 - 3 = 26'));
  const badList = page.replace('1, 7, 11, 13, 17, 19, 23, 29', '1, 7, 11, 13, 17, 19, 23, 25');
  po('P2 corrupted survivor list (29 to 25) is caught', !badList.includes('1, 7, 11, 13, 17, 19, 23, 29'));
  const muBad = (n) => n === 2 ? 1 : mu(n);
  let ieBad = 0; for (const d of divs30) ieBad += muBad(d) * Math.floor(100 / d);
  po('P3 corrupted mu(2)=+1 breaks the recomputed I-E (gives ' + ieBad + ', not 26)', ieBad !== 26);

  const gp = gates.filter(x => x.pass).length, pp = poisons.filter(x => x.pass).length;
  return { lab: 'A census', gates: gp + '/' + gates.length, poisons: pp + '/' + poisons.length, failed: gates.concat(poisons).filter(x => !x.pass).map(x => x.name) };
}
