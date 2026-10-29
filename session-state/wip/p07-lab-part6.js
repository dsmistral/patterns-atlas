LAB.p11 = function (page) {
  var figs = page.split("<svg");
  LAB.ck(figs.length === 4, "p11 three inline SVGs found (split count " + figs.length + ")");
  var f1 = figs[1], f2 = figs[2], f3 = figs[3];
  LAB.ck(f1.indexOf('viewBox="0 0 320 240"') !== -1, "p11 Fig P07.1 viewBox 320\u00d7240");
  LAB.ck(f1.indexOf('<line x1="30" y1="150" x2="300" y2="150"') !== -1, "p11 Fig1 the river at y = 150");
  LAB.ck(f1.indexOf('cx="80" cy="60"') !== -1 && f1.indexOf('cx="215" cy="105"') !== -1 && f1.indexOf('cx="215" cy="195"') !== -1 && f1.indexOf('cx="170" cy="150"') !== -1, "p11 Fig1 dots A(80,60), B(215,105), B'(215,195), P(170,150)");
  LAB.ck((215 + 215) / 2 === 215 && (105 + 195) / 2 === 150, "p11 Fig1 the bank bisects BB' (midpoint (215,150) on the river line)");
  var t = (170 - 80) / (215 - 80);
  LAB.ck(Math.abs(60 + t * 135 - 150) < 1e-9, "p11 Fig1 P lies on the straight line A\u2192B' (t = 2/3, y hits 150 exactly)");
  var ap = Math.hypot(170 - 80, 150 - 60), pb = Math.hypot(215 - 170, 105 - 150);
  LAB.ck(Math.abs(ap / pb - 2) < 1e-12, "p11 Fig1 leg ratio |AP|:|PB| = 2:1 (4\u221a2 km vs 2\u221a2 km)");
  LAB.ck(Math.abs(ap / 22.5 - Math.sqrt(32)) < 1e-12, "p11 Fig1 scale: |AP| px / 22.5 = 4\u221a2 km exactly");
  LAB.ck(f2.indexOf('viewBox="0 0 340 240"') !== -1, "p11 Fig P07.2 viewBox 340\u00d7240");
  LAB.ck(f2.indexOf('<circle cx="140" cy="130" r="90"') !== -1, "p11 Fig2 the amplitude circle: centre (140,130), r = 90 (5 units at 18 px/unit)");
  LAB.ck(f2.indexOf('cx="194" cy="58"') !== -1, "p11 Fig2 the point P = (3,4) at (194,58)");
  LAB.ck(Math.hypot(194 - 140, 58 - 130) === 90, "p11 Fig2 |OP| = 90 px exactly (= 5 units)");
  LAB.ck(Math.hypot(194 - 140, 130 - 130) === 54 && 130 - 58 === 72, "p11 Fig2 legs 54 px and 72 px (3 and 4 units)");
  var arcA = Math.hypot(174 - 140, 130 - 130), arcB = Math.hypot(160.4 - 140, 102.8 - 130);
  LAB.ck(arcA === 34 && Math.abs(arcB - 34) < 0.02, "p11 Fig2 the \u03c6-arc endpoints both at radius 34 px from O");
  var phiDeg = Math.atan2(130 - 102.8, 160.4 - 140) * 180 / Math.PI;
  LAB.ck(Math.abs(phiDeg - 53.1301024) < 0.01, "p11 Fig2 the arc sweeps \u03c6 = " + phiDeg.toFixed(4) + "\u00b0");
  LAB.ck(f3.indexOf('viewBox="0 0 470 228"') !== -1, "p11 Fig P07.3 viewBox 470\u00d7228");
  LAB.ck(f3.indexOf('<rect x="292" y="62" width="96" height="128"') !== -1, "p11 Fig3(ii) the rectangle 96\u00d7128 px (6 and 8 units at 16 px/unit)");
  LAB.ck(f3.indexOf('cx="110" cy="126"') !== -1, "p11 Fig3(i) M at (110,126)");
  LAB.ck(Math.hypot(96, 128) === 160, "p11 Fig3 triangle legs 96, 128 px \u2192 hypotenuse 160 px (10 units)");
  LAB.ck((158 + 62) / 2 === 110 && (190 + 62) / 2 === 126, "p11 Fig3(i) M is the exact midpoint of the hypotenuse A(158,190)\u2013B(62,62)");
  LAB.ck((388 + 292) / 2 === 340 && (190 + 62) / 2 === 126, "p11 Fig3(ii) the diagonals cross at (340,126) \u2014 both midpoints agree");
  LAB.ck(Math.hypot(340 - 292, 126 - 190) === 80, "p11 Fig3(ii) the median |CM| = 80 px = 5 units exactly (half the 160-px diagonal)");
};

LAB.p12 = function (page) {
  var mblock = "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>";
  LAB.ck(page.indexOf(mblock) !== -1, "p12 the MathJax config block is byte-exact (" + mblock.length + " B)");
  LAB.ck((page.match(/<h2>/g) || []).length === 9, "p12 nine section h2s");
  LAB.ck((page.match(/<svg/g) || []).length === 3 && (page.match(/<figure/g) || []).length === 3 && (page.match(/<figcaption>/g) || []).length === 3, "p12 three svg/figure/figcaption");
  var d = (page.match(/<details>/g) || []).length, dc = (page.match(/<\/details>/g) || []).length;
  LAB.ck(d === 7 && dc === 7, "p12 details/summary " + d + "/" + dc + " (2+2+2+1: hints and answers, the \u25c6 exercise answer-only)");
  var po = (page.match(/<p[\s>]/g) || []).length, pc = (page.match(/<\/p>/g) || []).length;
  LAB.ck(po === pc, "p12 p open/close balance " + po + "/" + pc + " (bare and classed paragraphs both counted)");
  var io = page.split("\\(").length - 1, ic = page.split("\\)").length - 1;
  LAB.ck(io === ic, "p12 inline TeX balance " + io + "/" + ic);
  var doo = page.split("\\[").length - 1, dc2 = page.split("\\]").length - 1;
  LAB.ck(doo === dc2 && doo === 8, "p12 display TeX balance " + doo + "/" + dc2 + " (7 content + 1 config)");
  LAB.ck(page.indexOf("$$") === -1, "p12 zero dollar-dollar delimiters (indexOf check)");
  LAB.ck(page.indexOf("<title>P07 \u00b7 Build an auxiliary object \u00b7 The Patterns Atlas</title>") !== -1, "p12 title exact");
  LAB.ck(page.indexOf("the seventh move of the spine") !== -1, "p12 kicker exact");
  var ok = ["index.html", "assets/style.css", "p01-pin-down-the-problem.html", "p02-small-cases.html", "p03-special-cases.html", "p04-complete-the-square.html", "p05-canonical-form.html", "p06-compose-identity.html", "p08-symmetry.html", "p09-invariant.html", "p10-pigeonhole.html", "p16-isomorphism.html", "p18-raise-dimension.html", "p66-induction.html", "p69-telescoping.html", "p74-strengthen-the-claim.html", "b11-discrete-derivative.html"];
  var bad = [];
  var re = /href="([^"]+)"/g, m;
  while ((m = re.exec(page)) !== null) if (ok.indexOf(m[1]) === -1) bad.push(m[1]);
  LAB.ck(bad.length === 0, "p12 all hrefs canonical (" + (page.match(/href="/g) || []).length + " total, 17 whitelisted)" + (bad.length ? " \u2014 BAD: " + bad.join(",") : ""));
  LAB.ck(page.indexOf("Next up the spine: <a href=\"p08-symmetry.html\">P08 \u00b7 Divide by symmetry</a> (planned)") !== -1, "p12 footer nav exact");
};

LAB.run = function (page, names) {
  LAB.lines.push("=== p07-lab \u2014 pieces: " + names.join(", ") + " ===");
  for (var i = 0; i < names.length; i++) {
    LAB.lines.push("--- piece " + names[i] + " ---");
    LAB[names[i]](page);
  }
  LAB.lines.push("VERDICT: " + LAB.checks + " checks, " + LAB.fails + " FAIL");
  return LAB.lines.join("\n");
};
