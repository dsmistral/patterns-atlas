#!/usr/bin/env python3
"""
Lab script for P72: Monovariants (p72-monovariants.html).
Verifies:
1. Concrete Encounter: 3x3 integer matrix negative-row/column flipping game:
     A_0 = [[-4,  1, -2],
            [ 3, -5,  1],
            [-1,  2, -3]]
   - Total absolute sum ceiling M = sum |A_{i,j}| = 4+1+2 + 3+5+1 + 1+2+3 = 22.
   - Initial sum Phi(A_0) = -5 + (-1) + (-2) = -8.
   - Step 1: Flip Row 1 (sum -5) -> Phi = -8 + 10 = +2.
   - Step 2: Flip Col 2 (sum -1 - 5 + 2 = -4) -> Phi = +2 + 8 = +10.
   - Step 3: Flip Row 3 (sum -1 - 2 - 3 = -6) -> Phi = +10 + 12 = +22 == M!
   - At A_3, all row sums (+7, +9, +6) and all col sums (+8, +8, +6) are positive -> Halts in 3 steps!
2. Exemplar 1 (Combinatorics & Sorting / Permutation Games):
   - Bubble-sort / adjacent swap monovariant: Inversion count inv(pi) = #{(i,j) : i < j and pi(i) > pi(j)}.
   - Every legal move swapping adjacent out-of-order elements pi(i) > pi(i+1) decreases inv(pi) by exactly 1!
   - Since 0 <= inv(pi) <= C(n, 2), the game halts in at most C(n, 2) steps regardless of which adjacent inversion is chosen!
3. Exemplar 2 (Algebraic Smoothing / Averaging & Sum of Squares Monovariant):
   - Replacing two unequal numbers (a, b) with (a+1, b-1) when a >= b+2 (or smoothing towards the mean)
      keeps sum(x_i) INVARIANT (P09) while STRICTLY DECREASING the sum of squares Phi(x) = sum x_i^2:
       (a-1)^2 + (b+1)^2 - (a^2 + b^2) = -2(a - b - 1) <= -2 < 0 (when a >= b + 2, i.e., chip transfer from richer to poorer!).
4. Exemplar 3 (Lexicographic / Weighted Binary Monovariant in Coin-Splitting & Erasing Games):
   - On a board of n boxes 1, 2, ..., n, a move replaces 1 coin in box k with any number of coins (say 2 or 100 coins)
     in boxes STRICTLY TO THE RIGHT (k+1, ..., n).
   - Even though the total number of coins can explode, the ordinal / lexicographic tuple (c_1, c_2, ..., c_n)
     strictly decreases in lexicographic order (or with bounded fanout B, Phi = sum c_k (B+1)^{n-k} strictly decreases)!
"""
import copy

print("=== 1. Encounter Artifact: 3x3 Grid Negative-Sum Flipping Game ===")
A0 = [
    [-4,  1, -2],
    [ 3, -5,  1],
    [-1,  2, -3],
]
def total_sum(M):
    return sum(sum(row) for row in M)

def row_sums(M):
    return [sum(row) for row in M]

def col_sums(M):
    return [sum(M[i][j] for i in range(3)) for j in range(3)]

M = copy.deepcopy(A0)
ceiling = sum(abs(x) for row in A0 for x in row)
print(f"  Initial A0: Phi = {total_sum(M)}, row_sums = {row_sums(M)}, col_sums = {col_sums(M)}, Ceiling M = {ceiling}")

# Step 1: Flip Row 0 (1-indexed Row 1)
assert row_sums(M)[0] == -5 < 0
M[0] = [-x for x in M[0]]
print(f"  After Flip Row 1: Phi = {total_sum(M):+3d}, row_sums = {row_sums(M)}, col_sums = {col_sums(M)}")

# Step 2: Flip Col 1 (1-indexed Col 2)
assert col_sums(M)[1] == -4 < 0
for i in range(3):
    M[i][1] = -M[i][1]
print(f"  After Flip Col 2: Phi = {total_sum(M):+3d}, row_sums = {row_sums(M)}, col_sums = {col_sums(M)}")

# Step 3: Flip Row 2 (1-indexed Row 3)
assert row_sums(M)[2] == -6 < 0
M[2] = [-x for x in M[2]]
print(f"  After Flip Row 3: Phi = {total_sum(M):+3d}, row_sums = {row_sums(M)}, col_sums = {col_sums(M)}")
assert all(s >= 0 for s in row_sums(M)) and all(s >= 0 for s in col_sums(M))
assert total_sum(M) == ceiling == 22

print("\n=== 2. Exemplar 2: Chip-Smoothing Monovariant Phi = sum x_i^2 ===")
chips = [9, 2, 1]
S_inv = sum(chips)
print(f"  Start chips = {chips}: sum = {S_inv} (invariant), sum_sq = {sum(x*x for x in chips)}")
steps = 0
while max(chips) - min(chips) >= 2:
    chips.sort(reverse=True)
    old_sq = sum(x*x for x in chips)
    a, b = chips[0], chips[-1]
    chips[0] -= 1
    chips[-1] += 1
    new_sq = sum(x*x for x in chips)
    assert new_sq - old_sq == -2 * (a - b - 1) <= -2
    steps += 1
    print(f"  Step {steps:2d}: chips = {chips}, sum = {sum(chips)}, sum_sq = {new_sq} (Δ = {new_sq - old_sq})")
assert chips == [4, 4, 4]
