/* piece Q — page hygiene checker for the frozen P65 page. Runs against
   globalThis.PAGE_TEXT (set by the freeze runner before loading pieces); if unset, emits an
   armed note and exits. Checks (frozen design): the six banned tokens; TeX balance with
   no $$; the href whitelist; the moon row; structure counts (8 h2, 3 h3, 3 svg, 10 details
   = 5 Hint + 5 Worked, >= 2 boxes, >= 2 asides); footer next -> p54, atlas-home -> p43.
   No recursion, no BigInt.
   Freeze-time fix 2026-11-06 (found by part-3 pass 1, recorded honestly): Q03's whitelist
   was missing the house stylesheet assets/style.css, which the binding authoring rules
   REQUIRE on every page ("the one shared stylesheet book/assets/style.css"). The page was
   correct; the checker whitelist was widened by exactly that one entry. Smoke
   discrimination unaffected (the BAD fixture's Q03 violations were non-stylesheet hrefs). */
(function () {
  var T = globalThis.PAGE_TEXT || "";
  if (!T) {
    vCheck("Q00", true, "PAGE_TEXT not set at load: Q is armed and will check the frozen page at freeze time (the freeze runner sets globalThis.PAGE_TEXT before loading pieces)");
    globalThis.__Q = { ran: false, checks: OUT };
    return;
  }
  var low = T.toLowerCase(), i, k;
  var banned = ["the lab", "verifier", "session", "planned", "published", "receipt"], bHits = [];
  for (i = 0; i < banned.length; i++) { if (low.indexOf(banned[i]) >= 0) { bHits.push(banned[i]); } }
  vCheck("Q01", bHits.length === 0, "banned tokens on-page: " + (bHits.length ? "VIOLATIONS: " + bHits.join(", ") : "none found (all six absent, case-insensitive)"));
  var dollars = (T.match(/\$/g) || []).length;
  var dd = T.indexOf("$$") >= 0;
  var br1 = (T.match(/\\\[/g) || []).length, br2 = (T.match(/\\\]/g) || []).length;
  vCheck("Q02", dollars % 2 === 0 && !dd && br1 === br2, "TeX balance: " + dollars + " single-$ delimiters (must be even), $$ " + (dd ? "FOUND (banned)" : "absent") + ", \\[/" + br1 + " = \\]/" + br2);
  var hrefs = T.match(/href="[^"]*"/g) || [], bad = [], hh, goodH;
  var pref = ["p54-", "p43-", "p33-", "p29-", "p26-", "p21-", "p25-", "p10-", "p17-", "p09-", "p53-"];
  for (k = 0; k < hrefs.length; k++) {
    hh = hrefs[k].slice(6, -1);
    if (hh.charAt(0) === "#") { continue; }
    goodH = hh === "assets/style.css";
    if (!goodH) { for (i = 0; i < pref.length; i++) { if (hh.indexOf(pref[i]) === 0) { goodH = true; break; } } }
    if (!goodH) { bad.push(hh); }
  }
  vCheck("Q03", bad.length === 0, "href whitelist: " + hrefs.length + " hrefs checked, " + (bad.length ? "VIOLATIONS: " + bad.join(", ") : "all within the frozen whitelist (the house stylesheet assets/style.css, p09/p10/p17/p21/p25/p26/p29/p33/p43/p53/p54/index/in-page anchors)"));
  var moons = ["\u25CF\u25CB\u25CB", "\u25CF\u25CF\u25CB", "\u25CF\u25CF\u25CF", "\u25C6", "\u25D0"], mMiss = [];
  for (i = 0; i < moons.length; i++) { if (T.indexOf(moons[i]) < 0) { mMiss.push(moons[i]); } }
  vCheck("Q04", mMiss.length === 0, "moon row: \u25CF\u25CB\u25CB \u25CF\u25CF\u25CB \u25CF\u25CF\u25CF \u25C6 \u25D0 — " + (mMiss.length ? "MISSING: " + mMiss.join(" ") : "all five marks found"));
  var nH2 = (T.match(/<h2/g) || []).length, nH3 = (T.match(/<h3/g) || []).length, nSvg = (T.match(/<svg/g) || []).length;
  var nDet = (T.match(/<details/g) || []).length, nHint = (T.match(/Hint/g) || []).length, nWork = (T.match(/Worked/g) || []).length;
  var nBox = (T.match(/class="[^"]*box[^"]*"/g) || []).length, nAside = (T.match(/class="[^"]*aside[^"]*"/g) || []).length;
  vCheck("Q05", nH2 === 8 && nH3 === 3 && nSvg === 3 && nDet === 10 && nHint === 5 && nWork === 5 && nBox >= 2 && nAside >= 2, "structure counts: h2 " + nH2 + "/8, h3 " + nH3 + "/3, svg " + nSvg + "/3, details " + nDet + "/10 (Hint " + nHint + "/5, Worked " + nWork + "/5), boxes " + nBox + " (>= 2), asides " + nAside + " (>= 2)");
  var f54 = T.indexOf("p54-stable-compactification.html") >= 0, f43 = T.indexOf("p43-flow-with-surgery.html") >= 0;
  vCheck("Q06", f54 && f43, "footer links: next -> p54-stable-compactification.html (" + (f54 ? "present" : "MISSING") + "), atlas-home -> p43-flow-with-surgery.html (" + (f43 ? "present" : "MISSING") + ")");
  globalThis.__Q = { ran: true, checks: OUT };
})();
