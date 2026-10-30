// ============ p2: §3 name the move — box content ============
function p2(page) {
  var T = "p2";
  var needles = [
    ["move title", "P18 · Lift to a higher dimension — prove the easy shadow-free problem upstairs"],
    ["move close", "The lift gives room, not truth: everything gained upstairs is provisional until the return trip is paid for"],
    ["sigh", "is a sigh"],
    ["decoration", "If the upstairs proof never touches the extra coordinate, the room was decoration"],
    ["change of subject", "A lift that does not pass this test is a change of subject"],
    ["box A title", "Box P18.A · The three promises of a lift"],
    ["promise 1", "Promise 1"],
    ["promise 2", "Promise 2"],
    ["promise 3", "Promise 3"],
    ["honesty", "in the checks, not the vibes"],
    ["box B title", "Box P18.B · Where it shows up, and the three-key signature"],
    ["key 1", "First, the jam smells like missing room"],
    ["key 2", "a lift without a named projection is a metaphor, and metaphors prove nothing"],
    ["key 3", "you can say in advance what the descent will cost"],
    ["keys close", "One key alone is a guess; two keys, a hypothesis; all three, a plan."],
    ["dandelin", "the foci of a sliced cone appearing as the touching points of spheres inscribed in it"]
  ];
  for (var k = 0; k < needles.length; k++)
    chk(T, "needle " + needles[k][0], page.indexOf(needles[k][1]) !== -1);
  // the three boxes are boxed in the page's own id scheme
  chk(T, "box ids present", page.indexOf('id="box-p18"') !== -1 &&
    page.indexOf('id="box-p18a"') !== -1 && page.indexOf('id="box-p18b"') !== -1);
  // box B names the four terrains and the two later pages
  chk(T, "box B names P20's engine", page.indexOf('P20</a>' + "'s entire engine") !== -1);
  chk(T, "box B names P27", page.indexOf('industrialized as a whole later page (<a href="p27-complex-for-integers.html">P27</a>)') !== -1);
  chk(T, "box B names Dandelin's spheres", page.indexOf("Dandelin's spheres (1822)") !== -1);
  chk(T, "box B names Hamilton 1837", page.indexOf("Hamilton's 1837") !== -1);
  chk(T, "box B names Stirling", page.indexOf("Stirling's formula is honestly proved") !== -1);
}
