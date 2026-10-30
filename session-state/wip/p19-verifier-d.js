
// ===== Panel VC — doctored clones: the checks must FAIL on a broken page =====
var c1 = PG.split("0.0000037").join("0.0000047"); // global: the value appears 4 times
SC("VC clone with doctored E-value fails the E needle", c1.indexOf("0.0000037") === -1 && PG.indexOf("0.0000037") !== -1);
var c2 = PG.split("64{,}512{,}240").join("64{,}512{,}241"); // global: eq + table cell
SC("VC clone with doctored C(32,10) fails the fraction needle", c2.indexOf("64{,}512{,}240") === -1);
var c3 = PG.replace("[['\\\\(','\\\\)']]", "[['\\(','\\)']]");
SC("VC clone with single-backslash MathJax fails the double-backslash needle (the run-2 defect, reproduced)", c3.indexOf("[['\\\\(','\\\\)']]") === -1 && c3.indexOf("[['\\(','\\)']]") !== -1);
var c4 = PG.replace("</footer>\n</body>\n</html>\n", "</footer>\n</body>\n</html>");
SC("VC clone without trailing newline fails the footer gate", c4.slice(-26) !== "</footer>\n</body>\n</html>\n" && c4.length === PG.length - 1);
var c5 = PG.split("R(4,4) &gt; 17").join("R(4,4) &gt; 16"); // global: Example 1 + Box P19.B
SC("VC clone with doctored Paley bound fails the R(4,4) > 17 needle", c5.indexOf("R(4,4) &gt; 17") === -1);
var c6 = PG.replace("12,870", "12,871");
SC("VC clone with doctored k=8 groups cell fails the table needle", c6.indexOf("12,870") === -1);
var c7 = PG.replace("131 digits", "132 digits");
SC("VC clone with doctored digit count fails the 131-digit needle", c7.indexOf("131 digits") === -1 && c7.indexOf("132 digits") !== -1);
var c8 = PG.replace("0.873", "0.973");
SC("VC clone with doctored biased E fails the R(3,4) needle", c8.indexOf("0.64 + 0.233 \\approx 0.873") === -1);
var c9 = PG.replace("\\binom{17}{4} = 2380", "\\binom{17}{4} = 2379");
SC("VC clone with doctored Paley four-set count fails the needle", c9.indexOf("\\binom{17}{4} = 2380") === -1);
// truncation clone: the run-1 harness bug must be caught by the length gate
var c10 = PG.slice(0, 13330);
SC("VC truncated clone (13,330 chars, the run-1 bug) fails length, footer, and needle gates", c10.length !== 62387 && c10.slice(-26) !== "</footer>\n</body>\n</html>\n" && c10.indexOf("8 · Exercises") === -1);

// ===== Panel VD — loader regression tests (the two harness lessons of this session) =====
var lines = PG.split("\n");
var parts = [], i0 = 0;
while (i0 < lines.length) { var sl = lines.slice(i0, i0 + 60); parts.push(sl.join("\n") + ((i0 + 60 < lines.length) ? "\n" : "")); i0 += 60; }
var buggy = parts[0]; // the run-1 bug: stop after the first chunk
SC("VD run-1 bug reproduced: first-chunk-only assembly is short", buggy.length < 62387 && buggy.length > 13000, "buggyLen=" + buggy.length);
SC("VD full chunk loop with join('') is byte-faithful", parts.join("") === PG && parts.join("").length === 62387);
SC("VD chunk count is plausible (204 lines / 60-line chunks = 4)", parts.length === 4, "parts=" + parts.length);
var joinNL = parts.join("\n");
SC("VD join('\\n') assembly injects 3 spurious newlines (P18 lesson)", joinNL.length === PG.length + (parts.length - 1) && joinNL !== PG, "delta=" + (joinNL.length - PG.length));
SC("VD every chunk ends at a line boundary (newline-terminated, like read_file)", parts[0].slice(-1) === "\n" && parts[parts.length - 1].slice(-1) === "\n");
SC("VD 204 newlines total (205 split parts incl. trailing empty)", lines.length === 205 && tally(PG, "\n") === 204, "parts=" + lines.length);
SC("VD length gate 62387 is exact (loader regression)", PG.length === 62387);

// ===== Panel VE — lineage, receipts, cross-references =====
SC("VE Erdos 1947 citation needle", PG.indexOf("Bulletin of the American Mathematical Society 53, 291–297") !== -1);
SC("VE Erdos 1947 paper title needle", PG.indexOf("Some remarks on the theory of graphs") !== -1);
SC("VE Bernstein 1912 Kharkov needle", PG.indexOf("Kharkov Mathematical Society") !== -1 && PG.indexOf("1912") !== -1);
SC("VE Bernstein paper title needle", PG.indexOf("Démonstration du théorème de Weierstrass fondée sur le calcul des probabilités") !== -1);
SC("VE Chebyshev/Bienayme 1860s/1853 needles", PG.indexOf("1860s") !== -1 && PG.indexOf("1853") !== -1);
SC("VE Shannon 1948 needle", PG.indexOf("Claude Shannon, in 1948") !== -1 && PG.indexOf("A Mathematical Theory of Communication") !== -1);
SC("VE Arıkan 2009 polar codes needle", PG.indexOf("Erdal Arıkan") !== -1 && PG.indexOf("polar codes") !== -1 && PG.indexOf("(2009)") !== -1);
SC("VE sixty-one years arithmetic", 2009 - 1948 === 61 && PG.indexOf("sixty-one years") !== -1);
SC("VE Bernstein 35 years before Erdos", 1947 - 1912 === 35 && PG.indexOf("thirty-five years before") !== -1);
SC("VE Lovasz Local Lemma 1975 needle", PG.indexOf("Lovász Local Lemma") !== -1 && PG.indexOf("1975") !== -1);
SC("VE Moser-Tardos 2010 needle", PG.indexOf("Robin Moser and Gábor Tardos, in 2010") !== -1);
SC("VE Marcus-Spielman-Srivastava 2015 needle", PG.indexOf("Adam Marcus, Daniel Spielman, and Nikhil Srivastava, in 2015") !== -1);
SC("VE Alon-Spencer canon needle", PG.indexOf("Noga Alon and Joel Spencer") !== -1);
SC("VE P11 reductio-in-disguise cross-ref", PG.indexOf("P11</a> wearing the room as its quantifier") !== -1);
SC("VE P10 pigeonhole cross-ref", PG.indexOf("P10</a>'s pigeonhole, five objects into two boxes") !== -1);
SC("VE P02 ancestor cross-ref", PG.indexOf("P02</a> taught you to run") !== -1);
SC("VE P25 axis statement", PG.indexOf("census dissolves into average") !== -1);
SC("VE P20 door statement", PG.indexOf("the next move of tier 2") !== -1);
SC("VE onramp indicator needle", PG.indexOf("Its mean is its probability") !== -1);
SC("VE union bound upside-down needle", PG.indexOf("at least \\(1 - \\sum_i \\Pr[A_i]\\)") !== -1);
SC("VE second-moment + LLL deferral named", PG.indexOf("the second-moment method") !== -1);
SC("VE three exhibits present", PG.indexOf("Exhibit A · The vacuous count") !== -1 && PG.indexOf("Exhibit B · The anonymous witness") !== -1 && PG.indexOf("Exhibit C · The wrong experiment") !== -1);
SC("VE Exhibit A overflow verdict 2.5 above 1", PG.indexOf("comfortably above \\(1\\)") !== -1);
SC("VE Exhibit B gap pricing", PG.indexOf("Anonymous is not unreachable") !== -1);
SC("VE Exhibit C cargo-cult line", PG.indexOf("exactly the cargo cult this page exists to dismantle") !== -1);
SC("VE Example 2 derandomization naming", PG.indexOf("the method of conditional expectations") !== -1);
SC("VE Example 3 witness-explicit contrast", PG.indexOf("existence and construction collapse into one") !== -1);
SC("VE three-counts ledger closer", PG.indexOf("Three counts, one ledger") !== -1);
SC("VE Ex1 five-cycle counting", PG.indexOf("\\frac{5!}{5 \\cdot 2}") !== -1);
SC("VE Ex2 boundary 126 checks", PG.indexOf("56 + 70 = 126") !== -1);
SC("VE Ex3 five-term sum 1/16", PG.indexOf("\\frac{1}{16}\\left[f(0) + 4f(\\frac{1}{4})") !== -1);
SC("VE Ex4 diagnosis P01 chair", PG.indexOf("The diagnosis, in P01's chair") !== -1);
SC("VE Ex5 guarantee-versus-luck closer", PG.indexOf("The guarantee is forever; the luck is local.") !== -1);

// tail — verdict
VL.push("VVERDICT: " + (VP + VF) + " checks, " + VF + " FAIL");
