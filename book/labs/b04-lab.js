// b04-lab.js — The Patterns Atlas, B04 · Bézout's identity via descent — verification battery (session S37, 2026-10-29)
// Fresh engine: forward certificates through the dance (every member carries its coefficients from the start), split
// pieces ~<= 4 KB each, no recursion, no BigInt in the value path.
// The twelve pieces below were dispatched independently, each against the assembled page bytes
// (b04-bezout.html, 44399 B); each defines its own main(tools) and writes its own transcript.
// Recorded output: b04-lab-output.txt. Honest run history in the output header.

// ===== PIECE p00 — pre-flight probe =====
// b04-lab.js — piece p00: pre-flight probe (fresh engine: forward certificates, iterative, no recursion, no BigInt)
async function main(tools) {
  const out = [];
  const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  // forward certificate engine: every dance member carries its (coefA, coefB) from the start
  function cert(a, b) {
    let m0 = [a, 1, 0], m1 = [b, 0, 1];
    const qs = [], rs = [];
    while (m1[0] !== 0) {
      const q = Math.floor(m0[0] / m1[0]);
      const r = [m0[0] - q * m1[0], m0[1] - q * m1[1], m0[2] - q * m1[2]];
      qs.push(q); rs.push(r[0]);
      m0 = m1; m1 = r;
    }
    return { g: m0[0], qs: qs, rs: rs, x: m0[1], y: m0[2] };
  }
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b04-bezout.html");
  let bl = 0;
  for (let i = 0; i < page.length; i++) { const c = page.codePointAt(i); if (c > 0xFFFF) i++; bl += c < 0x80 ? 1 : (c < 0x800 ? 2 : (c < 0x10000 ? 3 : 4)); }
  const okBytes = bl === 44399;
  P("p00 PRE-FLIGHT PROBE (session S37, fresh engine: forward certificates through the dance, iterative, no recursion, no BigInt)");
  P("CHECK p00.1 page bytes 44399: " + (okBytes ? "PASS" : "FAIL") + " (got " + bl + ")");
  const okTitle = page.indexOf("<title>B04 \u00b7 B\u00e9zout's identity via descent \u00b7 The Patterns Atlas</title>") >= 0;
  P("CHECK p00.2 title byte-exact: " + (okTitle ? "PASS" : "FAIL"));
  const h2 = (page.match(/<h2>/g) || []).length;
  P("CHECK p00.3 six h2 sections: " + (h2 === 6 ? "PASS" : "FAIL") + " (got " + h2 + ")");
  const d = cert(25, 11);
  const okCert = d.g === 1 && d.x === 4 && d.y === -9 && JSON.stringify(d.qs) === "[2,3,1,2]" && 4 * 25 - 9 * 11 === 1;
  P("CHECK p00.4 witness certificate (25,11) g 1 x 4 y -9 qs [2,3,1,2]: " + (okCert ? "PASS" : "FAIL") + " (got " + JSON.stringify(d) + ")");
  const fails = (okBytes ? 0 : 1) + (okTitle ? 0 : 1) + (h2 === 6 ? 0 : 1) + (okCert ? 0 : 1);
  P("PIECE p00 VERDICT: 4 checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece0.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p01 — the climbs of section 3(a)+(b) =====
// b04-lab.js — piece p01: section 3(a)+(b) — the climbs on (25,11) and (2026,1491), recomputed
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p01." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  function cert(a, b) {
    let m0 = [a, 1, 0], m1 = [b, 0, 1];
    const qs = [], rs = [];
    while (m1[0] !== 0) {
      const q = Math.floor(m0[0] / m1[0]);
      const r = [m0[0] - q * m1[0], m0[1] - q * m1[1], m0[2] - q * m1[2]];
      qs.push(q); rs.push(r[0]);
      m0 = m1; m1 = r;
    }
    return { g: m0[0], qs: qs, rs: rs, x: m0[1], y: m0[2] };
  }
  const c1 = cert(25, 11);
  CK("dance (25,11) lines: 25=2x11+3, 11=3x3+2, 3=1x2+1, 2=2x1+0", 2 * 11 + 3 === 25 && c1.qs[0] === 2 && c1.rs[0] === 3 && 3 * 3 + 2 === 11 && c1.qs[1] === 3 && c1.rs[1] === 2 && 1 * 2 + 1 === 3 && c1.qs[2] === 1 && c1.rs[2] === 1 && 2 * 1 + 0 === 2 && c1.qs[3] === 2 && c1.rs[3] === 0);
  CK("climb lines (25,11): 1=3-1x2, then 4x3-11, then 4x25-9x11", 3 - 1 * 2 === 1 && 4 * 3 - 11 === 1 && 4 * 25 - 9 * 11 === 1);
  CK("hunt arithmetic: 4x25=100, 9x11=99, 100-99=1", 4 * 25 === 100 && 9 * 11 === 99 && 100 - 99 === 1);
  const c2 = cert(2026, 1491);
  CK("dance (2026,1491) quotients [1,2,1,3,1,2,3,1,8]", JSON.stringify(c2.qs) === "[1,2,1,3,1,2,3,1,8]", JSON.stringify(c2.qs));
  CK("dance (2026,1491) leftovers [535,421,114,79,35,9,8,1,0]", JSON.stringify(c2.rs) === "[535,421,114,79,35,9,8,1,0]", JSON.stringify(c2.rs));
  CK("each division line true (2026=1x1491+535 ... 8=8x1+0)", 1 * 1491 + 535 === 2026 && 2 * 535 + 421 === 1491 && 1 * 421 + 114 === 535 && 3 * 114 + 79 === 421 && 1 * 79 + 35 === 114 && 2 * 35 + 9 === 79 && 3 * 9 + 8 === 35 && 1 * 8 + 1 === 9 && 8 * 1 + 0 === 8);
  const rows = [[535, 1, -1], [421, -2, 3], [114, 3, -4], [79, -11, 15], [35, 14, -19], [9, -39, 53], [8, 131, -178], [1, -170, 231]];
  let ladOk = true;
  for (const r of rows) if (r[1] * 2026 + r[2] * 1491 !== r[0]) ladOk = false;
  CK("Fig B04.2 ladder: all 8 certificates evaluate to their leftover; engine gives (x,y)=(-170,231)", ladOk && c2.x === -170 && c2.y === 231, "engine (" + c2.x + "," + c2.y + ")");
  CK("climb lines each equal 1: 9-1x8; 4x9-35; 4x79-9x35; 13x79-9x114", 9 - 1 * 8 === 1 && 4 * 9 - 35 === 1 && 4 * 79 - 9 * 35 === 1 && 13 * 79 - 9 * 114 === 1);
  CK("climb lines each equal 1: 13x421-48x114; 61x421-48x535; 61x1491-170x535; 231x1491-170x2026", 13 * 421 - 48 * 114 === 1 && 61 * 421 - 48 * 535 === 1 && 61 * 1491 - 170 * 535 === 1 && 231 * 1491 - 170 * 2026 === 1);
  CK("the identity's two products: 231x1491=344421, 170x2026=344420", 231 * 1491 === 344421 && 170 * 2026 === 344420);
  CK("-170 x 2026 leaves 1 on division by 1491", (((-170 * 2026) % 1491) + 1491) % 1491 === 1);
  CK("-170 + 1491 = 1321", -170 + 1491 === 1321);
  CK("2026 x 1321 = 2676346", 2026 * 1321 === 2676346);
  CK("2676346 = 1795 x 1491 + 1", 1795 * 1491 + 1 === 2676346);
  CK("2026x1491 - 170x2026 = (2026-231)x1491 + 1", 2026 * 1491 - 170 * 2026 === (2026 - 231) * 1491 + 1);
  P("PIECE p01 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece1.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p02 — section 2's examples, Ex1, Ex2 =====
// b04-lab.js — piece p02: section 2's examples, Exercise 1, Exercise 2 — recomputed
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p02." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  function cert(a, b) {
    let m0 = [a, 1, 0], m1 = [b, 0, 1];
    const qs = [], rs = [];
    while (m1[0] !== 0) {
      const q = Math.floor(m0[0] / m1[0]);
      const r = [m0[0] - q * m1[0], m0[1] - q * m1[1], m0[2] - q * m1[2]];
      qs.push(q); rs.push(r[0]);
      m0 = m1; m1 = r;
    }
    return { g: m0[0], qs: qs, rs: rs, x: m0[1], y: m0[2] };
  }
  const e1 = cert(1071, 462);
  CK("7x462 - 3x1071 = 3234 - 3213 = 21 = gcd(1071,462)", 7 * 462 === 3234 && 3 * 1071 === 3213 && 3234 - 3213 === 21 && e1.g === 21);
  CK("(-7)x25 + 16x11 = 1 — a second certificate for (25,11)", -7 * 25 + 16 * 11 === 1);
  CK("both certificates on one family: x=4+11t, y=-9-25t hits (4,-9) at t=0 and (-7,16) at t=-1", 4 + 11 * 0 === 4 && -9 - 25 * 0 === -9 && 4 + 11 * -1 === -7 && -9 - 25 * -1 === 16);
  const vals = {};
  let sweeps = 0;
  for (let x = -40; x <= 40; x++) for (let y = -40; y <= 40; y++) { vals[4 * x + 6 * y] = true; sweeps++; }
  let onlyEven = true;
  for (const k in vals) if (Number(k) % 2 !== 0) onlyEven = false;
  let evensHit = 0;
  for (let e = -396; e <= 396; e += 2) if (vals[e]) evensHit++;
  CK("sweep |x|,|y|<=40 on 4x+6y (" + sweeps + " pairs): all values even", onlyEven);
  CK("every even number from -396 to 396 turns up (" + evensHit + "/397)", evensHit === 397);
  CK("edge case: gcd(a,0)=a witnessed as a = 1xa + 0x0 at a=12 (12=12+0)", 1 * 12 + 0 * 0 === 12);
  const e2 = cert(1386, 322);
  CK("Ex1 dance quotients [4,3,3,2], gcd 14", JSON.stringify(e2.qs) === "[4,3,3,2]" && e2.g === 14);
  CK("Ex1 certificate 10x1386 - 43x322 = 14; engine agrees (x,y)=(10,-43)", 10 * 1386 - 43 * 322 === 14 && e2.x === 10 && e2.y === -43);
  CK("Ex1 check: 13860 - 13846 = 14", 10 * 1386 === 13860 && 43 * 322 === 13846 && 13860 - 13846 === 14);
  CK("Ex1 divided by 14: 10x99 - 43x23 = 1 (990-989), certifying gcd(99,23)=1", 1386 / 14 === 99 && 322 / 14 === 23 && 10 * 99 - 43 * 23 === 1 && 990 - 989 === 1 && cert(99, 23).g === 1);
  const e3 = cert(31, 7);
  CK("Ex2a dance: 31=4x7+3, 7=2x3+1, 3=3x1+0 (qs [4,2,3])", 4 * 7 + 3 === 31 && 2 * 3 + 1 === 7 && 3 * 1 + 0 === 3 && JSON.stringify(e3.qs) === "[4,2,3]");
  CK("Ex2a certificate 9x7 - 2x31 = 1 (63-62); engine agrees (x,y)=(-2,9)", 9 * 7 - 2 * 31 === 1 && 63 - 62 === 1 && e3.x === -2 && e3.y === 9);
  CK("Ex2b x = 9x12 = 108 = 3x31+15, so x=15; check 7x15 = 105 = 3x31+12", 9 * 12 === 108 && 3 * 31 + 15 === 108 && 7 * 15 === 105 && 105 - 3 * 31 === 12);
  const e4 = cert(10, 3);
  CK("Ex2c 10 = 3x3+1; certificate 10-3x3=1; engine (x,y)=(1,-3)", 3 * 3 + 1 === 10 && 10 - 3 * 3 === 1 && e4.x === 1 && e4.y === -3);
  CK("Ex2c -3 dressed as 7 mod 10; 3x7 = 21 = 2x10+1", -3 + 10 === 7 && 3 * 7 === 21 && 21 - 2 * 10 === 1);
  P("PIECE p02 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece2.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p03 — section 3(c)'s congruences, Ex3's family =====
// b04-lab.js — piece p03: section 3(c)'s three congruences and Exercise 3's solution family
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p03." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  function cert(a, b) {
    let m0 = [a, 1, 0], m1 = [b, 0, 1];
    const qs = [], rs = [];
    while (m1[0] !== 0) {
      const q = Math.floor(m0[0] / m1[0]);
      const r = [m0[0] - q * m1[0], m0[1] - q * m1[1], m0[2] - q * m1[2]];
      qs.push(q); rs.push(r[0]);
      m0 = m1; m1 = r;
    }
    return { g: m0[0], qs: qs, rs: rs, x: m0[1], y: m0[2] };
  }
  function gcdI(a, b) { let x = Math.abs(a), y = Math.abs(b); while (y !== 0) { const r = x % y; x = y; y = r; } return x; }
  const k1 = cert(13, 5);
  CK("dance (13,5): 13=2x5+3, 5=1x3+2, 3=1x2+1, 2=2x1+0 (qs [2,1,1,2])", 2 * 5 + 3 === 13 && 1 * 3 + 2 === 5 && 1 * 2 + 1 === 3 && 2 * 1 + 0 === 2 && JSON.stringify(k1.qs) === "[2,1,1,2]");
  CK("climb 1 = 2x13 - 5x5; engine (x,y)=(2,-5)", 2 * 13 - 5 * 5 === 1 && k1.x === 2 && k1.y === -5);
  CK("inverse of 5 is -5 dressed as 8; 5x8 = 40 = 3x13+1", -5 + 13 === 8 && 5 * 8 === 40 && 40 - 3 * 13 === 1);
  CK("x = 8x3 = 24 = 11 mod 13; check 5x11 = 55 = 4x13+3", 8 * 3 === 24 && 24 - 13 === 11 && 5 * 11 === 55 && 55 - 4 * 13 === 3);
  CK("gcd(6,15) = 3 divides 9", gcdI(6, 15) === 3 && 9 % 3 === 0);
  CK("reduced 2x = 3 mod 5; inverse of 2 is 3 (2x3 = 6 = 1 mod 5)", 2 * 3 === 6 && 6 - 5 === 1);
  CK("x = 3x3 = 9 = 4 mod 5", 3 * 3 === 9 && 9 - 5 === 4);
  const sols2 = [];
  for (let x = 0; x < 15; x++) if ((6 * x - 9) % 15 === 0) sols2.push(x);
  CK("scan confirms exactly {4,9,14} mod 15 (three classes = g)", JSON.stringify(sols2) === "[4,9,14]" && sols2.length === 3, JSON.stringify(sols2));
  CK("all three checks: 24=15+9, 54=45+9, 84=75+9", 6 * 4 === 24 && 24 - 15 === 9 && 6 * 9 === 54 && 54 - 45 === 9 && 6 * 14 === 84 && 84 - 75 === 9);
  CK("gcd(4,10) = 2 does not divide 7", gcdI(4, 10) === 2 && 7 % 2 !== 0);
  const sols3 = [];
  for (let x = 0; x < 10; x++) if ((4 * x - 7) % 10 === 0) sols3.push(x);
  CK("scan of all ten classes finds no solution", sols3.length === 0, JSON.stringify(sols3));
  CK("Ex3 base (-1,1): -4+6=2; family x=-1+3t, y=1-2t", -1 * 4 + 1 * 6 === 2);
  const fam = [];
  for (let t = -10; t <= 10; t++) fam.push([-1 + 3 * t, 1 - 2 * t]);
  let famOk = true;
  for (const p of fam) if (4 * p[0] + 6 * p[1] !== 2) famOk = false;
  CK("family members t=-10..10 all solve 4x+6y=2", famOk);
  CK("printed members: t=0 (-1,1); t=1 (2,-1) 8-6=2; t=2 (5,-3) 20-18=2; t=-1 (-4,3) -16+18=2", 8 - 6 === 2 && 20 - 18 === 2 && -16 + 18 === 2 && JSON.stringify(fam[10]) === "[-1,1]" && JSON.stringify(fam[11]) === "[2,-1]" && JSON.stringify(fam[12]) === "[5,-3]" && JSON.stringify(fam[9]) === "[-4,3]");
  let win = 0;
  const winList = [];
  for (let x = -30; x <= 30; x++) for (let y = -30; y <= 30; y++) if (4 * x + 6 * y === 2) { win++; winList.push([x, y]); }
  let capOk = win === 20;
  for (const p of winList) { const t = (p[0] + 1) / 3; if (!Number.isInteger(t) || 1 - 2 * t !== p[1]) capOk = false; }
  CK("window |x|,|y|<=30: exactly 20 solutions, every one on the family", win === 20 && capOk, "found " + win);
  P("PIECE p03 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece3.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p04 — Exercise 4's stamp censuses =====
// b04-lab.js — piece p04: Exercise 4's stamp censuses — (4,7) and (3,5), recomputed by exact scan
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p04." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const mk = (m, s1, s2) => { for (let x = 0; x * s1 <= m; x++) for (let y = 0; y * s2 <= m; y++) if (s1 * x + s2 * y === m) return true; return false; };
  const never47 = [], make47 = [];
  for (let m = 1; m <= 25; m++) (mk(m, 4, 7) ? make47 : never47).push(m);
  CK("stamps (4,7) up to 25: makeable {4,7,8,11,12,14,15,16,18,19,20,21,22,23,24,25}", JSON.stringify(make47) === "[4,7,8,11,12,14,15,16,18,19,20,21,22,23,24,25]", JSON.stringify(make47));
  CK("stamps (4,7): never-makeable {1,2,3,5,6,9,10,13,17}", JSON.stringify(never47) === "[1,2,3,5,6,9,10,13,17]", JSON.stringify(never47));
  CK("the forced-forever block: 18=4+2x7, 19=3x4+7, 20=5x4, 21=3x7", 4 + 2 * 7 === 18 && 3 * 4 + 7 === 19 && 5 * 4 === 20 && 3 * 7 === 21);
  let coverOk = true;
  for (let m = 22; m <= 60; m++) if (!mk(m - 4, 4, 7)) coverOk = false;
  CK("block covers upward: every amount 22..60 = a block base + one more 4-stamp", coverOk);
  CK("4x7-4-7 = 17, the largest never-makeable, on the nose", 4 * 7 - 4 - 7 === 17);
  const never35 = [];
  for (let m = 1; m <= 12; m++) if (!mk(m, 3, 5)) never35.push(m);
  let all8 = true;
  for (let m = 8; m <= 50; m++) if (!mk(m, 3, 5)) all8 = false;
  CK("stamps (3,5): never-makeable {1,2,4,7}; largest 7", JSON.stringify(never35) === "[1,2,4,7]", JSON.stringify(never35));
  CK("stamps (3,5): 3x5-3-5 = 7, again on the nose; every amount from 8 to 50 makeable", 3 * 5 - 3 - 5 === 7 && all8);
  let symOk = true;
  for (let m = 1; m <= 45; m++) if (mk(m, 5, 9) !== mk(m, 9, 5)) symOk = false;
  CK("order symmetry witness: makeable(m;5,9) = makeable(m;9,5) for m<=45", symOk);
  const never59 = [];
  for (let m = 1; m <= 45; m++) if (!mk(m, 5, 9)) never59.push(m);
  CK("beyond the page, honest: (5,9)'s largest never-makeable up to 45 is 31 = 5x9-5-9 — evidence, not a page claim", never59[never59.length - 1] === 31 && 5 * 9 - 5 - 9 === 31, "last=" + never59[never59.length - 1]);
  P("PIECE p04 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece4.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p05 — the corollary censuses =====
// b04-lab.js — piece p05: the corollary censuses — invertibility (Cor 1), cancellation (Cor 3), congruences counted (Cor 4)
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p05." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  function gcdI(a, b) { let x = Math.abs(a), y = Math.abs(b); while (y !== 0) { const r = x % y; x = y; y = r; } return x; }
  let c1cases = 0, c1bad = 0;
  for (const nn of [7, 10, 12, 13, 31]) {
    for (let a = 1; a < nn; a++) {
      c1cases++;
      let scanInv = -1;
      for (let y = 1; y < nn; y++) if ((a * y) % nn === 1) { scanInv = y; break; }
      const cop = gcdI(a, nn) === 1;
      if (cop !== (scanInv >= 0)) c1bad++;
      if (cop) {
        let cx = -999;
        for (let x = -nn; x <= nn && cx === -999; x++) if (((a * x) % nn + nn) % nn === 1) cx = x;
        const dressed = ((cx % nn) + nn) % nn;
        if (dressed !== scanInv) c1bad++;
      }
    }
  }
  CK("Cor 1 census mods 7,10,12,13,31: coprime iff invertible, certificate inverse agrees with the scan (" + c1cases + " classes)", c1cases === 68 && c1bad === 0, c1bad + " bad");
  let c3cases = 0, c3bad = 0;
  for (let nn = 5; nn <= 16; nn++) {
    for (let c = 1; c < nn; c++) {
      const g = gcdI(c, nn), nred = nn / g;
      for (let a = 0; a < nn; a++) for (let b = 0; b < nn; b++) {
        c3cases++;
        const lhs = ((a * c) % nn) === ((b * c) % nn);
        const rhs = (a % nred) === (b % nred);
        if (lhs !== rhs) c3bad++;
      }
    }
  }
  CK("Cor 3 census n=5..16, every c,a,b: ac=bc mod n iff a=b mod n/g (" + c3cases + " cases)", c3bad === 0, c3bad + " bad");
  CK("B02 reconciliation: 2x3 = 6 = 2x8 mod 10, yet 3 != 8 mod 10; g=2 and 3 = 8 mod 5", 2 * 3 === 6 && 2 * 8 === 16 && 16 % 10 === 6 && 3 % 10 !== 8 % 10 && gcdI(2, 10) === 2 && 3 % 5 === 8 % 5);
  CK("free cancellation: 5x2 = 10 = 5x9 mod 7 (both 3), g=1, 2 = 9 mod 7", 5 * 2 === 10 && 10 % 7 === 3 && 45 % 7 === 3 && gcdI(5, 7) === 1 && 2 % 7 === 9 % 7);
  let c4cong = 0, c4scan = 0, c4bad = 0;
  for (let nn = 5; nn <= 16; nn++) {
    for (let a = 1; a < nn; a++) {
      const g = gcdI(a, nn);
      for (let c = 0; c < nn; c++) {
        c4cong++;
        let count = 0;
        for (let x = 0; x < nn; x++) { c4scan++; if ((a * x - c) % nn === 0) count++; }
        const want = (c % g === 0) ? g : 0;
        if (count !== want) c4bad++;
      }
    }
  }
  CK("Cor 4 census n=5..16, every a and c: g classes when g|c, zero when not (" + c4cong + " congruences, " + c4scan + " class checks)", c4cong === 1340 && c4bad === 0, c4bad + " bad");
  P("PIECE p05 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece5.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p06 — Euclid lemma grids, fraction uniqueness, S-grid =====
// b04-lab.js — piece p06: Euclid's lemma grids (Cor 2), fraction uniqueness, the S-descent grid
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p06." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  function gcdI(a, b) { let x = Math.abs(a), y = Math.abs(b); while (y !== 0) { const r = x % y; x = y; y = r; } return x; }
  let eCases = 0, ePrem = 0, eBad = 0;
  for (let nn = 2; nn <= 25; nn++) {
    for (let a = 1; a < nn; a++) {
      if (gcdI(nn, a) !== 1) continue;
      for (let b = 1; b <= 200; b++) {
        eCases++;
        if ((a * b) % nn === 0) { ePrem++; if (b % nn !== 0) eBad++; }
      }
    }
  }
  CK("Euclid lemma grid n=2..25, coprime a, b<=200 (" + eCases + " cases, " + ePrem + " with n|ab): all force n|b", eBad === 0, eBad + " bad");
  let prPrem = 0, prBad = 0, prChecked = 0;
  for (let p = 2; p <= 30; p++) {
    let isPrime = true;
    for (let d = 2; d * d <= p; d++) if (p % d === 0) isPrime = false;
    if (!isPrime) continue;
    prChecked++;
    for (let a = 1; a <= 60; a++) for (let b = 1; b <= 60; b++) if ((a * b) % p === 0) { prPrem++; if (a % p !== 0 && b % p !== 0) prBad++; }
  }
  CK("prime case grid, " + prChecked + " primes p<=30, a,b<=60 (" + prPrem + " with p|ab): p|ab forces p|a or p|b", prBad === 0, prBad + " bad");
  const fr = [];
  for (let b = 2; b <= 12; b++) for (let a = 1; a < b; a++) if (gcdI(a, b) === 1) fr.push([a, b]);
  let fPairs = 0, fBad = 0;
  for (let i = 0; i < fr.length; i++) for (let j = i + 1; j < fr.length; j++) {
    fPairs++;
    if (fr[i][0] * fr[j][1] === fr[j][0] * fr[i][1]) fBad++;
  }
  CK("fraction uniqueness: " + fr.length + " reduced fractions (denominators to 12), all " + fPairs + " cross-pairs unequal — no rival lowest terms", fBad === 0, fBad + " bad");
  let sPairs = 0, sBad = 0;
  for (let a = 1; a <= 10; a++) for (let b = 1; b <= 10; b++) {
    sPairs++;
    let best = -1;
    for (let x = -50; x <= 50; x++) for (let y = -50; y <= 50; y++) {
      const v = a * x + b * y;
      if (v > 0 && (best < 0 || v < best)) best = v;
    }
    if (best !== gcdI(a, b)) sBad++;
  }
  CK("S-grid: the smallest positive combination is the gcd for all " + sPairs + " pairs (a,b <= 10) — the descent proof's set S witnessed", sPairs === 100 && sBad === 0, sBad + " bad");
  P("PIECE p06 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece6.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p07 — page-byte checks I =====
// b04-lab.js — piece p07: page-byte checks I (bytes, TeX balance, MathJax block, structure, hrefs)
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b04-bezout.html");
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p07." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const count = (s) => page.split(s).length - 1;
  let bl = 0;
  for (let i = 0; i < page.length; i++) { const c = page.codePointAt(i); if (c > 0xFFFF) i++; bl += c < 0x80 ? 1 : (c < 0x800 ? 2 : (c < 0x10000 ? 3 : 4)); }
  CK("page bytes 44399", bl === 44399, "got " + bl);
  CK("inline TeX balanced 346/346 (345 content + 1 config)", count("\\(") === 346 && count("\\)") === 346, count("\\(") + "/" + count("\\)"));
  CK("display TeX balanced 18/18 (17 content + 1 config)", count("\\[") === 18 && count("\\]") === 18, count("\\[") + "/" + count("\\]"));
  CK("zero dollar delimiters", count("$") === 0, "got " + count("$"));
  const mjLine = '<script>window.MathJax={tex:{inlineMath:[[\'\\\\(\',\'\\\\)\']],displayMath:[[\'\\\\[\',\'\\\\]\']]},svg:{fontCache:\'global\'}};</script>';
  const mjIdx = page.indexOf(mjLine);
  let mjLen = 0;
  if (mjIdx >= 0) { while (page[mjIdx + mjLen] !== "\n") mjLen++; }
  CK("standard MathJax block present, 120 B byte-exact", mjIdx >= 0 && mjLen === 120, "idx " + mjIdx + " len " + mjLen);
  CK("CDN line with pinned integrity hash present", page.indexOf('src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" integrity="sha256-1CldwzdEg2k1wTmf7s5RWVd7NMXI/7nxxjJM2C4DqII=" crossorigin="anonymous"') >= 0);
  CK("no other external resource: one https://, three http: (the svg xmlns x3), two scripts, one link", count("https://") === 1 && count("http:") === 3 && count('xmlns="http://www.w3.org/2000/svg"') === 3 && (page.match(/<script/g) || []).length === 2 && (page.match(/<link/g) || []).length === 1);
  CK("six h2 sections; section tags balanced 6/6", count("<h2>") === 6 && count("<section") === 6 && count("</section>") === 6);
  const secs = ["1 \u00b7 Lecture 0", "2 \u00b7 The idea, named", "3 \u00b7 Worked by hand", "4 \u00b7 Why it is true", "5 \u00b7 Practice", "6 \u00b7 Where this goes"];
  let secOk = true, at = -1;
  for (const s of secs) { const i = page.indexOf(s); if (i < 0 || i < at) secOk = false; at = i; }
  CK("all six section titles in template order", secOk);
  CK("structure: 3 svg, 3 figcaption, 3 figures, 7 h3, details 7/7, 2 pattern-boxes, 1 warn aside, 3 ul, 0 ol, footer, boxes box-b04 + box-b04a", count("<svg") === 3 && count("<figcaption>") === 3 && count('class="fig-tight"') === 3 && count("<h3>") === 7 && count("<details>") === 7 && count("</details>") === 7 && count('class="pattern-box"') === 2 && page.indexOf('id="box-b04"') >= 0 && page.indexOf('id="box-b04a"') >= 0 && count('class="aside warn"') === 1 && count("<ul>") === 3 && count("<ol>") === 0 && count("<footer>") === 1);
  const hrefs = (page.match(/href="[^"]*"/g) || []).map(h => h.slice(6, -1));
  const wantH = { "assets/style.css": 1, "b02-congruence-classes.html": 2, "b03-euclidean-algorithm.html": 2, "index.html": 2, "m02-two-squares.html": 1, "p02-small-cases.html": 1, "p05-canonical-form.html": 3, "p06-compose-identity.html": 1, "p13-descent.html": 4, "p66-induction.html": 4 };
  let hrefBad = 0, extra = "";
  for (const h of hrefs) if (!(h in wantH)) { hrefBad++; extra = h; }
  let hrefTotal = 0;
  for (const k in wantH) hrefTotal += wantH[k];
  for (const k in wantH) { const got = hrefs.filter(x => x === k).length; if (got !== wantH[k]) hrefBad++; }
  CK("21 hrefs, exact canonical multiset (" + hrefs.length + " found)", hrefs.length === 21 && hrefTotal === 21 && hrefBad === 0, hrefBad + " bad" + (extra ? " extra " + extra : ""));
  P("PIECE p07 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece7.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p08 — page-byte checks II =====
// b04-lab.js — piece p08: page-byte checks II (banned tokens, needles, kicker, footer)
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b04-bezout.html");
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p08." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const count = (s) => page.split(s).length - 1;
  const banned = ["machin", "gate", "session", "planned", "receipt", "battery", "verifier", "adversarial", "revision", "registry", "mandated", "recorded"];
  let banBad = 0, banHits = "";
  for (const t of banned) { const c = count(t) + count(t[0].toUpperCase() + t.slice(1)); if (c !== 0) { banBad++; banHits += " " + t + "=" + c; } }
  CK("banned-token sweep zero (12 tokens, both cases)", banBad === 0, banHits);
  CK("the lab substring exactly 3 (the three figure aria-labels)", count("lab") === 3, "got " + count("lab"));
  const needles = [
    ["1321", 12], ["B\u00e9zout", 7], ["Bachet", 1], ["1730\u20131783", 1], ["1779", 1],
    ["2{,}676{,}346", 2], ["344{,}421", 1], ["344{,}420", 1],
    ["4 \\times 25 - 9 \\times 11", 5], ["231 \\times 1491", 5], ["100 - 99", 2],
    ["13{,}860", 1], ["990 - 989", 1], ["forced-forever", 3], ["ab - a - b", 3],
    ["Scope, honestly", 1], ["certificate", 19], ["descent", 15], ["anti-stack", 6],
    ["\u20b917", 2], ["every even number from \\(-396\\) to \\(396\\) turns up in it.", 1],
    ["every even number in range", 0]
  ];
  let needleBad = 0;
  for (const pair of needles) { const got = count(pair[0]); if (got !== pair[1]) { needleBad++; P("  needle mismatch: '" + pair[0] + "' want " + pair[1] + " got " + got); } }
  CK("all 22 needle strings at expected counts", needleBad === 0, needleBad + " bad");
  const kicker = '<p class="kicker"><a href="index.html">The Patterns Atlas</a> \u00b7 B04 \u00b7 bridge page, group A \u00b7 before <a href="p13-descent.html">P13</a></p>';
  CK("header kicker byte-exact", page.indexOf(kicker) >= 0);
  const footer = '<p><em>The Patterns Atlas</em> \u2014 B04 \u00b7 B\u00e9zout\'s identity via descent (bridge page, group A). <a href="index.html">Return to the index</a>. Group A is complete: B01\u2013B04 stand, debts paid. The spine resumes next: <a href="p13-descent.html">P13 \u00b7 Infinite descent</a>.</p>';
  CK("footer byte-exact (navigation only)", page.indexOf(footer) >= 0);
  P("PIECE p08 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece8.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p09 — Fig B04.1 =====
// b04-lab.js — piece p09: Fig B04.1 — the two number lines, parsed back from the shipped page bytes and recomputed
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b04-bezout.html");
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p09." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const near = (a, b) => Math.abs(a - b) < 1e-6;
  const svgs = (page.match(/<svg[\s\S]*?<\/svg>/g) || []);
  CK("three svg blocks parsed from the page", svgs.length === 3, "got " + svgs.length);
  let fig1 = "";
  for (const s of svgs) if (s.indexOf('aria-label="Fig B04.1') >= 0) fig1 = s;
  CK("Fig B04.1 found by its aria-label id", fig1.length > 0);
  const rectsOf = (svg) => (svg.match(/<rect [^>]*>/g) || []).map(t => {
    const g = (a) => { const m = t.match(a + '="([^"]*)"'); return m ? parseFloat(m[1]) : null; };
    return { x: g("x"), y: g("y"), w: g("width"), h: g("height"), fill: (t.match(/fill="([^"]*)"/) || [null, null])[1] };
  });
  const textsOf = (svg) => (svg.match(/<text [^>]*>[^<]*<\/text>/g) || []).map(t => ({ x: parseFloat((t.match(/x="([^"]*)"/) || [null, 0])[1]), body: t.replace(/<[^>]*>/g, ""), bold: t.indexOf("font-weight") >= 0 }));
  const f1 = rectsOf(fig1);
  const t1 = textsOf(fig1);
  let tick25 = [], tick11 = [];
  for (const r of f1) { if (r.w === 2 && r.y === 48) tick25.push(r.x + 1); if (r.w === 2 && r.y === 102) tick11.push(r.x + 1); }
  let ok25 = tick25.length === 4;
  for (let k = 1; k <= 4; k++) if (!near(tick25[k - 1], 20 + 2.7 * 25 * k)) ok25 = false;
  let ok11 = tick11.length === 9;
  for (let m = 1; m <= 9; m++) if (!near(tick11[m - 1], 20 + 2.7 * 11 * m)) ok11 = false;
  CK("Fig B04.1: four 25-ticks and nine 11-ticks, centers at 20 + 2.7 x (multiple)", ok25 && ok11, "25s " + JSON.stringify(tick25) + " 11s " + JSON.stringify(tick11));
  const boxes = f1.filter(r => r.fill === "none");
  CK("Fig B04.1: two highlight boxes at (284,45) and (281.3,99), 12x14 each", boxes.length === 2 && near(boxes[0].x, 284) && near(boxes[0].y, 45) && near(boxes[1].x, 281.3) && near(boxes[1].y, 99) && boxes[0].w === 12 && boxes[0].h === 14 && boxes[1].w === 12 && boxes[1].h === 14);
  let labOk = true;
  const wantLab = [["25", 87.5], ["50", 155], ["75", 222.5], ["100", 290], ["11", 49.7], ["55", 168.5], ["88", 257.6], ["99", 287.3]];
  for (const pair of wantLab) { const hit = t1.filter(t => t.body === pair[0]); if (hit.length !== 1 || !near(hit[0].x, pair[1])) labOk = false; }
  CK("Fig B04.1: all eight numeric labels at 20 + 2.7 x (value)", labOk);
  const bold = t1.filter(t => t.bold && (t.body === "100" || t.body === "99"));
  CK("Fig B04.1: 100 and 99 carry font-weight 700", bold.length === 2);
  CK("Fig B04.1: the gap 290 - 287.3 = 2.7 px = one unit at the common scale", near(290 - 287.3, 2.7));
  CK("Fig B04.1 integer facts: 4x25 = 100, 9x11 = 99, 100 - 99 = 1", 4 * 25 === 100 && 9 * 11 === 99 && 100 - 99 === 1);
  CK("Fig B04.1 closing label byte-exact", fig1.indexOf("4 stacks of 25 make 100; 9 stacks of 11 make 99 \u2014 and 100 \u2212 99 = 1") >= 0);
  CK("Fig B04.1 one-unit-apart annotation present", fig1.indexOf("one unit apart") >= 0);
  P("PIECE p09 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece9.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p10 — Fig B04.2 =====
// b04-lab.js — piece p10: Fig B04.2 — the certificate ladder, parsed back from the shipped page bytes
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b04-bezout.html");
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p10." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const near = (a, b) => Math.abs(a - b) < 1e-6;
  const svgs = (page.match(/<svg[\s\S]*?<\/svg>/g) || []);
  let fig2 = "";
  for (const s of svgs) if (s.indexOf('aria-label="Fig B04.2') >= 0) fig2 = s;
  CK("Fig B04.2 found by its aria-label id", fig2.length > 0);
  const lines = ["535 = 1 \u00d7 2026 \u2212 1 \u00d7 1491", "421 = \u22122 \u00d7 2026 + 3 \u00d7 1491", "114 = 3 \u00d7 2026 \u2212 4 \u00d7 1491", "79 = \u221211 \u00d7 2026 + 15 \u00d7 1491", "35 = 14 \u00d7 2026 \u2212 19 \u00d7 1491", "9 = \u221239 \u00d7 2026 + 53 \u00d7 1491", "8 = 131 \u00d7 2026 \u2212 178 \u00d7 1491", "1 = \u2212170 \u00d7 2026 + 231 \u00d7 1491"];
  let lineOk = true;
  for (const L of lines) if (fig2.indexOf(">" + L + "<") < 0) lineOk = false;
  CK("Fig B04.2: all eight certificate lines present byte-exact", lineOk);
  const rows = [[535, 1, -1], [421, -2, 3], [114, 3, -4], [79, -11, 15], [35, 14, -19], [9, -39, 53], [8, 131, -178], [1, -170, 231]];
  let valOk = true;
  for (const r of rows) if (r[1] * 2026 + r[2] * 1491 !== r[0]) valOk = false;
  CK("Fig B04.2: all eight certificates evaluate to their leftover", valOk);
  const rectsOf = (svg) => (svg.match(/<rect [^>]*>/g) || []).map(t => {
    const g = (a) => { const m = t.match(a + '="([^"]*)"'); return m ? parseFloat(m[1]) : null; };
    return { x: g("x"), y: g("y"), w: g("width"), h: g("height") };
  });
  const f2 = rectsOf(fig2);
  CK("Fig B04.2: the one band rect at (12,155) 316x19 behind the identity line", f2.length === 1 && near(f2[0].x, 12) && near(f2[0].y, 155) && f2[0].w === 316 && f2[0].h === 19);
  const texts = (fig2.match(/<text [^>]*>[^<]*<\/text>/g) || []).map(t => ({ y: parseFloat((t.match(/y="([^"]*)"/) || [null, 0])[1]), body: t.replace(/<[^>]*>/g, ""), bold: t.indexOf("font-weight") >= 0 }));
  const idLine = texts.filter(t => t.body === "1 = \u2212170 \u00d7 2026 + 231 \u00d7 1491");
  CK("Fig B04.2: identity line bold, y = 169 inside the band (155..174)", idLine.length === 1 && idLine[0].bold && idLine[0].y === 169);
  const lastLine = texts.filter(t => t.body.indexOf("\u2212170 + 1491 = 1321") === 0);
  CK("Fig B04.2: '1321' production line present with true arithmetic (-170 + 1491 = 1321)", lastLine.length === 1 && -170 + 1491 === 1321);
  CK("Fig B04.2 header byte-exact", fig2.indexOf("each leftover of the (2026, 1491) dance, carrying its certificate") >= 0);
  let ys = [];
  for (let i = 0; i < 7; i++) { const L = lines[i]; const hit = texts.filter(t => t.body === L); if (hit.length === 1) ys.push(hit[0].y); }
  let ladderOk = ys.length === 7;
  for (let i = 0; i < 6; i++) if (ys[i + 1] - ys[i] !== 19) ladderOk = false;
  CK("Fig B04.2: the seven pre-identity lines step down by 19 px (36..150)", ladderOk, JSON.stringify(ys));
  P("PIECE p10 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece10.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

// ===== PIECE p11 — Fig B04.3 =====
// b04-lab.js — piece p11: Fig B04.3 — the stamp census, parsed back from the shipped page bytes and recomputed
async function main(tools) {
  const out = []; const P = (s) => out.push(s);
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b04-bezout.html");
  let n = 0, fails = 0;
  const CK = (label, cond, detail) => { n++; if (!cond) fails++; P("CHECK p11." + n + " " + label + ": " + (cond ? "PASS" : "FAIL") + (detail ? " (" + detail + ")" : "")); };
  const near = (a, b) => Math.abs(a - b) < 1e-6;
  let fig3 = "";
  const svgs = (page.match(/<svg[\s\S]*?<\/svg>/g) || []);
  for (const s of svgs) if (s.indexOf('aria-label="Fig B04.3') >= 0) fig3 = s;
  CK("Fig B04.3 found by its aria-label id", fig3.length > 0);
  const rectsOf = (svg) => (svg.match(/<rect [^>]*>/g) || []).map(t => {
    const g = (a) => { const m = t.match(a + '="([^"]*)"'); return m ? parseFloat(m[1]) : null; };
    return { x: g("x"), y: g("y"), w: g("width"), h: g("height"), fill: (t.match(/fill="([^"]*)"/) || [null, null])[1] };
  });
  const f3 = rectsOf(fig3);
  CK("Fig B04.3: 56 rects total (2 legend + 1 band + 1 baseline + 26 ticks + 26 squares)", f3.length === 56, "got " + f3.length);
  const never = { 1: 1, 2: 1, 3: 1, 5: 1, 6: 1, 9: 1, 10: 1, 13: 1, 17: 1 };
  const mk = (m) => { for (let x = 0; x * 4 <= m; x++) for (let y = 0; y * 7 <= m; y++) if (4 * x + 7 * y === m) return true; return false; };
  let redOk = true, blueOk = true, redCount = 0, blueCount = 0;
  for (const r of f3) {
    if (r.fill === "#b3543f" && r.w === 7 && r.y === 70 && r.x !== 22) redCount++;
    if (r.fill === "#3574d4" && r.w === 7 && r.y === 46 && r.x !== 22) blueCount++;
  }
  for (let m = 1; m <= 26; m++) {
    const cx = 18.5 + 12 * (m - 1);
    const sq = f3.filter(r => r.w === 7 && near(r.x, cx));
    if (never[m]) redOk = redOk && sq.length === 1 && sq[0].fill === "#b3543f" && sq[0].y === 70;
    else blueOk = blueOk && sq.length === 1 && sq[0].fill === "#3574d4" && sq[0].y === 46;
  }
  CK("Fig B04.3: red squares exactly at the nine never-makeable amounts (y=70)", redOk && redCount === 9, "red " + redCount);
  CK("Fig B04.3: blue squares at the other seventeen amounts (y=46)", blueOk && blueCount === 17, "blue " + blueCount);
  let tickOk = true;
  for (let m = 1; m <= 26; m++) { const hit = f3.filter(r => r.w === 1.6 && near(r.x, 21.2 + 12 * (m - 1)) && r.y === 60); if (hit.length !== 1) tickOk = false; }
  CK("Fig B04.3: 26 ticks at x = 21.2 + 12 x (n-1), y = 60", tickOk);
  const labels = (fig3.match(/<text [^>]*>[^<]*<\/text>/g) || []).map(t => t.replace(/<[^>]*>/g, ""));
  let labOk = true;
  for (let m = 1; m <= 26; m++) if (labels.indexOf(String(m)) < 0) labOk = false;
  CK("Fig B04.3: all 26 amount labels present", labOk);
  const band = f3.filter(r => r.w === 106 && r.h === 12);
  CK("Fig B04.3: light band (221,36) 106x12", band.length === 1 && near(band[0].x, 221) && near(band[0].y, 36));
  let coverOk = true;
  for (let m = 18; m <= 26; m++) { const cx = 18.5 + 12 * (m - 1); if (!(cx >= 221 && cx + 7 <= 327)) coverOk = false; }
  CK("Fig B04.3: the band covers the squares of 18..26 (mk agrees: 18, 26 makeable; 17 not)", coverOk && mk(18) && mk(26) && !mk(17));
  const base = f3.filter(r => near(r.w, 308) && near(r.h, 1.6));
  CK("Fig B04.3: baseline rect at (18,63.7) 308x1.6", base.length === 1 && near(base[0].x, 18) && near(base[0].y, 63.7));
  CK("Fig B04.3 closing label byte-exact", fig3.indexOf("the largest never-makeable amount is \u20b917 \u2014 exactly 4 \u00d7 7 \u2212 4 \u2212 7") >= 0 && 4 * 7 - 4 - 7 === 17);
  CK("Fig B04.3 legend byte-exact", fig3.indexOf("makeable exactly with \u20b94 and \u20b97 stamps") >= 0 && fig3.indexOf("never makeable") >= 0);
  P("PIECE p11 VERDICT: " + n + " checks, " + fails + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/s37work/b04-piece11.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}

