// P09 lab battery — Find the invariant (p09-invariant.html)
// Fresh engine, zero code shared with any earlier chapter's lab.
// Runs via new Function("page", <this file text>)(<page bytes>); returns the output text.
// No recursion, no BigInt in the value path; every check recomputes from scratch.

var PASS = 0, FAIL = 0, OUT = [];
function line(s) { OUT.push(s); }
function check(label, ok) {
  if (ok) { PASS++; line("PASS " + label); }
  else { FAIL++; line("FAIL " + label); }
}
function countIn(hay, needle) {
  var n = 0, i = hay.indexOf(needle);
  while (i !== -1) { n++; i = hay.indexOf(needle, i + needle.length); }
  return n;
}
function has(hay, needle) { return hay.indexOf(needle) !== -1; }
function svgBlock(page, figId) {
  var anchor = page.indexOf(figId);
  if (anchor === -1) return null;
  var start = page.lastIndexOf("<svg", anchor);
  var end = page.indexOf("</svg>", anchor);
  if (start === -1 || end === -1) return null;
  return page.slice(start, end + 6);
}
function figCaption(page, figId) {
  var anchor = page.indexOf(figId);
  if (anchor === -1) return null;
  var cap = page.indexOf("<figcaption>", anchor);
  if (cap === -1) return null;
  var end = page.indexOf("</figcaption>", cap);
  return page.slice(cap, end);
}
function section(page, id) {
  var start = page.indexOf('<section id="' + id + '"');
  if (start === -1) return null;
  var end = page.indexOf("</section>", start);
  return page.slice(start, end);
}
// deterministic pseudo-random (Lehmer; product < 2^53, no BigInt)
var SEED = 20261029;
function rnd() { SEED = (SEED * 48271) % 2147483647; return SEED / 2147483647; }
function rint(n) { return Math.floor(rnd() * n) % n; }
