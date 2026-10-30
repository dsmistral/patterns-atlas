(function () {
  var sieve = [], i, j, primes = [];
  for (i = 2; i <= 200; i++) sieve[i] = true;
  for (i = 2; i <= 200; i++) {
    if (sieve[i]) {
      primes.push(i);
      for (j = 2 * i; j <= 200; j += i) sieve[j] = false;
    }
  }
  var evens = 0, has7 = false;
  for (i = 0; i < primes.length; i++) {
    if (primes[i] % 2 === 0) evens++;
    if (primes[i] === 7) has7 = true;
  }
  CHECK("L19 primes <= 200: exactly one even (the 2), 7 prime and odd, 46 in all", function () {
    if (evens !== 1 || primes[0] !== 2) return "even count " + evens;
    if (!has7 || 7 % 2 === 0) return "7 not an odd prime";
    if (primes.length !== 46) return "count " + primes.length;
    return true;
  });
})();
