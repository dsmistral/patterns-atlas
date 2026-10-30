// ---- clones: mutate the page INSIDE a needle span; the matching needle must then fail ----
function mutate(PG, from, to) { var out = PG.split(from).join(to); return { page: out, happened: out !== PG }; }
function clones(PG) {
  // clone 1: swap the fixed card-8 cell back to the old defect
  var c1 = mutate(PG, "B's 8 the bottom-left", "B's 8 the middle-left");
  vCheck('c01 mutation applied', c1.happened);
  vCheck('c01 needle catches card-8 cell swap', c1.page.indexOf("B's 8 the bottom-left \u2014 the anti-diagonal block") < 0);
  // clone 2: bump the census near-miss family by one
  var c2 = mutate(PG, '<td>10,240</td><td>2,824</td>', '<td>10,240</td><td>2,825</td>');
  vCheck('c02 mutation applied', c2.happened);
  vCheck('c02 needle catches census bump', c2.page.indexOf('<td>168,768</td><td>131,040</td><td>48,960</td><td>10,240</td><td>2,824</td><td>832</td><td>176</td><td>32</td><td>8</td>') < 0);
  // clone 3: corrupt the mean
  var c3 = mutate(PG, '276{,}480/362{,}880 = 16/21', '276{,}480/362{,}880 = 16/20');
  vCheck('c03 mutation applied', c3.happened);
  vCheck('c03 page no longer prints the true mean', c3.page.indexOf('276{,}480/362{,}880 = 16/21') < 0);
  // clone 4: off-by-one tz rule
  var c4 = mutate(PG, 'disc \\(\\mathrm{tz}(m) + 1\\)', 'disc \\(\\mathrm{tz}(m) + 2\\)');
  vCheck('c04 mutation applied', c4.happened);
  vCheck('c04 needle catches tz corruption', c4.page.indexOf('disc \\(\\mathrm{tz}(m) + 1\\)') < 0);
  // clone 5: wrong disc on the billionth move
  var c5 = mutate(PG, 'nine trailing zeros, disc 10', 'nine trailing zeros, disc 11');
  vCheck('c05 mutation applied', c5.happened);
  vCheck('c05 needle catches billionth-disc error', c5.page.indexOf('nine trailing zeros, disc 10') < 0);
  // clone 6: off-by-one year count
  var c6 = mutate(PG, '584,542,046,090 years and change', '584,542,046,091 years and change');
  vCheck('c06 mutation applied', c6.happened);
  vCheck('c06 needle catches year drift', c6.page.indexOf('584,542,046,090 years and change') < 0);
  // clone 7: wrong determinant
  var c7 = mutate(PG, 'det P \\;=\\; 3', 'det P \\;=\\; 4');
  vCheck('c07 mutation applied', c7.happened);
  vCheck('c07 needle catches determinant corruption', c7.page.indexOf('det P \\;=\\; 3') < 0);
  // clone 8: transposed reading
  var c8 = mutate(PG, 'its rail reading is \\((1, 2)\\)', 'its rail reading is \\((2, 1)\\)');
  vCheck('c08 mutation applied', c8.happened);
  vCheck('c08 needle catches reading swap', c8.page.indexOf('its rail reading is \\((1, 2)\\)') < 0);
  // clone 9: broken Luoshu row
  var c9 = mutate(PG, '<td>4 9 2</td><td>3 5 7</td><td>8 1 6</td>', '<td>4 9 2</td><td>3 5 7</td><td>8 6 1</td>');
  vCheck('c09 mutation applied', c9.happened);
  vCheck('c09 needle catches Luoshu corruption', c9.page.indexOf('<td>4 9 2</td><td>3 5 7</td><td>8 1 6</td>') < 0);
  // clone 10: digit-count lie
  var c10 = mutate(PG, 'runs to sixty-one digits', 'runs to sixty-two digits');
  vCheck('c10 mutation applied', c10.happened);
  vCheck('c10 needle catches digit-count lie', c10.page.indexOf('runs to sixty-one digits') < 0);
}
