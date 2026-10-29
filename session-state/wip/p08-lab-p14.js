(function(R, page) {
  function has(s){return page.indexOf(s)>=0;}
  R.push({id:'p14.1',d:'printed: 5!/5 = 120/5 = 24 (Ex1)',ok:has('120/5 = 24')});
  R.push({id:'p14.2',d:'printed: 5/36, 1/6, 1/9 (Ex2 answers)',ok:has('5/36')&&has('1/6')&&has('1/9')});
  R.push({id:'p14.3',d:'printed: area ladder string (Ex3)',ok:has('19, 36, 51, 64, 75, 84, 91, 96, 99, 100')});
  R.push({id:'p14.4',d:'printed: perimeters 104, 58, 50 (Ex3 answer)',ok:has('104')&&has('58')&&has('50')});
  R.push({id:'p14.5',d:'printed: honest ledger (5-1)/2 + 1 = 3 (Ex4)',ok:has('(5-1)/2 + 1 = 3')});
  R.push({id:'p14.6',d:'printed: 2·1 + 6·3 = 20 census check (Ex4)',ok:has('2 \\cdot 1 + 6 \\cdot 3 = 20')});
  R.push({id:'p14.7',d:'printed: 362,880 as 362{,}880 (Ex4)',ok:has('362{,}880')});
  R.push({id:'p14.8',d:'printed: necklace census array (Ex5)',ok:has('1, 1, 2, 3, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6')});
  R.push({id:'p14.9',d:'printed: 84/6 = 14 (Ex5 glimpse)',ok:has('84/6 = 14')});
  R.push({id:'p14.10',d:'printed: 40/5 = 8 (Ex5 extension)',ok:has('40/5 = 8')});
  R.push({id:'p14.11',d:'printed: 40{,}320 and 5{,}040 (encounter)',ok:has('40{,}320')&&has('5{,}040')});
  R.push({id:'p14.12',d:'printed: necklace count is 4 (Ex4 verdict)',ok:has('necklace count is \\(4\\)')});
})
