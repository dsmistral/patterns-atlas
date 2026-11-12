// P71 Lab D — exercises: Ex1 angle order, Ex3 Erdos-Szekeres, Ex4 a+b=10
async function main() {
  let seed = 555;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  let ok1 = true;
  for (let t = 0; t < 200; t++) {
    const P: number[][] = [[rnd()*10, rnd()*10], [rnd()*10, rnd()*10], [rnd()*10, rnd()*10]];
    const sides = [0,1,2].map(i => Math.hypot(P[(i+1)%3][0]-P[(i+2)%3][0], P[(i+1)%3][1]-P[(i+2)%3][1]));
    const maxS = Math.max(...sides);
    const oppAngle = [0,1,2].map(i => {
      const [X, Y, Z] = [P[i], P[(i+1)%3], P[(i+2)%3]];
      return Math.acos(((Y[0]-X[0])*(Z[0]-X[0]) + (Y[1]-X[1])*(Z[1]-X[1])) / (Math.hypot(Y[0]-X[0], Y[1]-X[1]) * Math.hypot(Z[0]-X[0], Z[1]-X[1])));
    });
    const maxA = Math.max(...oppAngle);
    if (!(oppAngle[sides.indexOf(maxS)] >= maxA - 1e-9)) ok1 = false;
  }
  const a345 = [Math.asin(3/5)*180/Math.PI, Math.asin(4/5)*180/Math.PI, 90];
  const perm16 = [4,3,2,1,8,7,6,5,12,11,10,9,16,15,14,13];
  const maxMono = (arr: number[]) => {
    const n = arr.length, inc = Array(n).fill(1), dec = Array(n).fill(1);
    for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) inc[i] = Math.max(inc[i], inc[j]+1);
      if (arr[j] > arr[i]) dec[i] = Math.max(dec[i], dec[j]+1);
    }
    return [Math.max(...inc), Math.max(...dec)];
  };
  const [i16, d16] = maxMono(perm16);
  let ok17 = true;
  for (let t = 0; t < 1000; t++) {
    const p = Array.from({length: 17}, (_, i) => i + 1);
    for (let i = 16; i > 0; i--) { const j = Math.floor(rnd()*(i+1)); [p[i], p[j]] = [p[j], p[i]]; }
    const [mi, md] = maxMono(p);
    if (mi < 5 && md < 5) ok17 = false;
  }
  const q = (a: number) => 2*(a-5)*(a-5) + 50;
  let maxV = -Infinity, maxAt = -1;
  for (let a = 1; a <= 9; a++) { const v = q(a); if (v > maxV) { maxV = v; maxAt = a; } }
  return {
    checks: [
      ['Ex1 longest side faces a largest angle, 200 random triangles', ok1],
      ['Ex1 3-4-5 angles 36.87/53.13/90 in side order', Math.abs(a345[0]-36.87) < 0.01 && Math.abs(a345[1]-53.13) < 0.01],
      ['Ex3(a) 16-perm: max inc 4 AND max dec 4', i16 === 4 && d16 === 4],
      ['Ex3(c) 1000 random 17-perms all have monotone-5', ok17],
      ['Ex4 max 82 at a=1 (or 9); q(5)=50 min', maxV === 82 && maxAt === 1 && q(5) === 50 && q(9) === 82],
    ],
  };
}
