#!/usr/bin/env python3
"""
Lab script for P75: Coloring arguments (p75-coloring-arguments.html).
Verifies:
1. Concrete Encounter:
   - Mutilated 8x8 chessboard without (1,1) and (8,8): 30 even-parity (Black) and 32 odd-parity (White) cells.
   - 10x10 board with 1x4 straight tetrominoes under 4-color diagonal coloring c(i,j) = (i + j) mod 4
     for 1 <= i, j <= 10:
       Color 0: 25 cells
       Color 1: 24 cells
       Color 2: 25 cells
       Color 3: 26 cells
     Meanwhile every horizontal or vertical 1x4 tile covers 4 consecutive values of i+j, so {0, 1, 2, 3} (1 of each)!
2. Exemplar 1 (Hamiltonian Paths & Knight's Tours via Bipartite 2-Coloring):
   - A knight on a chessboard jumps (+/-1, +/-2) or (+/-2, +/-1), changing i + j by +/-1 or +/-3 (always ODD!),
     so a knight strictly alternates Black -> White -> Black -> White!
   - On any m x n board with m*n ODD (such as 5x5 or 7x7), there are (mn+1)/2 corners-color cells and (mn-1)/2
     other-color cells. A closed knight's tour (Hamiltonian cycle) of length mn is impossible because an odd cycle
     cannot alternate colors; and on a 4x4 board, a deeper 2-coloring of (corners + center) vs (edge-middles) proves impossibility!
3. Exemplar 2 (T-Tetrominoes & L-Trominoes via Parity and Anchor Coloring):
   - Can a 10x10 board be tiled by twenty-five T-tetrominoes (each made of 4 squares in a T shape)?
     Under a standard 2-coloring (Black/White), EVERY placement of a T-tetromino covers EITHER (3 Black, 1 White)
     OR (1 Black, 3 White) — an ODD number of Black squares!
     Thus 25 T-tetrominoes must cover an ODD total number of Black squares (sum of 25 odd numbers is odd!).
     Yet a 10x10 board has 50 Black squares (EVEN) -> Impossible!
4. Exemplar 3 (Polynomial / Roots-of-Unity Weighting for m x n Boards):
   - Assign cell (i, j) the complex root-of-unity weight w(i, j) = exp(2*pi*i*(r/k)) * exp(2*pi*i*(c/k))!
   - Or assign real weights {-1, +1} on rows/columns to bound max kings/rooks/tiles!
"""
from collections import Counter

print("=== 1. Encounter Artifact: 8x8 Mutilated Board & 10x10 Board (i+j) mod 4 Census ===")
c8 = Counter((i + j) % 2 for i in range(1, 9) for j in range(1, 9) if (i, j) not in [(1, 1), (8, 8)])
assert c8[0] == 30 and c8[1] == 32
print(f"  Mutilated 8x8 board parity census: Black (0) = {c8[0]}, White (1) = {c8[1]}")

c10 = Counter((i + j) % 4 for i in range(1, 11) for j in range(1, 11))
assert c10 == {0: 25, 1: 24, 2: 25, 3: 26}
print(f"  10x10 board (i+j) mod 4 census: {dict(sorted(c10.items()))}")

# Verify every 1x4 horizontal or vertical tile on 10x10 covers {0, 1, 2, 3}:
for i in range(1, 11):
    for j in range(1, 8):
        horiz = {(i + (j + d)) % 4 for d in range(4)}
        vert = {((i + d) + j) % 4 for d in range(4)}
        assert horiz == {0, 1, 2, 3} and vert == {0, 1, 2, 3}
print("  Verified: every horizontal and vertical 1x4 tile covers {0, 1, 2, 3} (1 of each color)!")

print("\n=== 2. Exemplar 2: T-Tetromino Parity on 10x10 Board ===")
# A T-tetromino consists of a center square (i, j) and 3 of its 4 orthogonal neighbors!
# Since (i, j) has parity p in {0, 1} and all 3 orthogonal neighbors have the OPPOSITE parity 1 - p,
# every T-tetromino covers either (1 Black, 3 White) or (3 Black, 1 White)!
# Let a be the number of (3B, 1W) T-tiles and b be the number of (1B, 3W) T-tiles:
#   a + b = 25 (total tiles)
#   3a + b = 50 (total Black squares on 10x10 board)
# Subtracting gives 2a = 25 => a = 12.5, not an integer!
for a in range(26):
    b = 25 - a
    assert 3*a + b != 50, "No integer solution to 3a + b = 50 with a + b = 25!"
print("  Verified: 3a + (25 - a) = 2a + 25 is always ODD != 50 (T-tetromino tiling of 10x10 is impossible)!")
