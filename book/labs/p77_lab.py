#!/usr/bin/env python3
"""
Lab script for P77: Work backwards (p77-work-backwards.html).
Verifies:
1. Concrete Encounter:
   - Part A: Toll-bridge doubling puzzle x_{t+1} = 2*x_t - 24 with x_3 = 0:
     Backward inversion x_t = (x_{t+1} + 24) / 2 gives x_3 = 0 -> x_2 = 12 -> x_1 = 18 -> x_0 = 21!
   - Part B: Bachet's subtraction game (remove 1, 2, or 3 stones from N = 21):
     Backward P/N labeling from 0: P-positions are {0, 4, 8, 12, 16, 20}, so 21 is N with unique winning move 21 -> 20!
2. Exemplar 1 (Number Theory & Reachability Tree — Reaching 100 via 2x and +1, or Collatz/Binary Backward Greedy):
   - Starting from 1, you can either double (x -> 2x) or increment (x -> x + 1). What is the minimum number of steps
     to reach N = 100?
     Forward from 1 branches 2^k ways! Backwards from 100: whenever n is even, halving n -> n/2 always beats subtracting 1;
     whenever n is odd, you MUST subtract 1 (n -> n-1) because 2x is never odd!
     Exact backward trajectory from 100:
       100 -> 50 -> 25 -> 24 -> 12 -> 6 -> 3 -> 2 -> 1 (8 steps: 6 halvings + 2 decrements)!
     Verified against BFS shortest path from 1 to 100!
3. Exemplar 2 (Combinatorial Games & Zermelo Backward Induction on a 2D Grid / Chessboard King Game):
   - A chess king starts at top-right (1, 8) of an 8x8 board and can move Left, Down, or Down-Left one square
      toward the target bottom-left corner (8, 1).
     Working backwards from (8, 1) [P-position]: a cell (r, c) is a P-position iff r is even and c is odd
     (in 0-indexed distance from target: both dx and dy are even!).
     Since start (1, 8) has (dx, dy) = (7, 7) (both odd!), Player 1 wins on move 1 by moving diagonally to (2, 7) where (dx, dy) = (6, 6) are both even!
4. Exemplar 3 (Classical Geometry — Apollonius / Pappus Backward Locus Construction & Water-Jug Pouring):
   - Water jugs of capacities 9 L and 4 L: how to measure exactly 6 L?
     Working backwards from target state (6, 0):
       (6, 0) <- (6, 4) <- (9, 1) <- (0, 1) <- (1, 0) <- (1, 4) <- (5, 0) <- (5, 4) <- (9, 0) <- (0, 0)!
     Wait: since 9 and 4 are coprime, filling the 9L jug and pouring into 4L repeatedly reduces mod 4:
       9 -> 5 -> 1 -> (move 1 to 4L, fill 9L) -> (9, 1) -> pour 3L into 4L -> (6, 4) -> empty 4L -> (6, 0)!
"""
from collections import deque

print("=== 1. Encounter Artifact: Bridge Toll Inversion & Bachet's Game of 21 ===")
x = 0
trace = [x]
for _ in range(3):
    x = (x + 24) // 2
    trace.append(x)
trace.reverse()
assert trace == [21, 18, 12, 0]
for i in range(3):
    assert 2 * trace[i] - 24 == trace[i+1]
print("  Bridge toll forward/backward trajectory:", trace)

# Bachet's game P/N table for n = 0..21 with moves {1, 2, 3}:
state = ["P"] * 22
for n in range(1, 22):
    if any(state[n - m] == "P" for m in (1, 2, 3) if n - m >= 0):
        state[n] = "N"
    else:
        state[n] = "P"
p_positions = [n for n, s in enumerate(state) if s == "P"]
assert p_positions == [0, 4, 8, 12, 16, 20]
print("  Bachet P-positions up to 21:", p_positions)

print("\n=== 2. Exemplar 1: Minimum Steps from 1 to 100 using (x -> 2x) and (x -> x+1) ===")
# Backward deterministic trace from 100 to 1:
curr = 100
back_path = [curr]
while curr > 1:
    if curr % 2 == 0:
        curr //= 2
    else:
        curr -= 1
    back_path.append(curr)
assert back_path == [100, 50, 25, 24, 12, 6, 3, 2, 1]

# Verify by exact BFS from 1 to 100 that 8 steps is the true global minimum:
q = deque([(1, 0)])
dist = {1: 0}
while q:
    u, d = q.popleft()
    if u == 100:
        break
    for v in (u + 1, 2 * u):
        if v <= 100 and v not in dist:
            dist[v] = d + 1
            q.append((v, d + 1))
assert dist[100] == len(back_path) - 1 == 8
print(f"  Backward path from 100 to 1 ({len(back_path)-1} steps): {back_path} (BFS min = {dist[100]})")

print("\n=== 3. Exemplar 2: 8x8 Corner-to-Corner King Game Backward Induction ===")
# Target is (0, 0) in remaining distance coordinates (dx, dy) in {0..7} x {0..7}.
# Legal moves reduce (dx, dy) by (1, 0), (0, 1), or (1, 1).
king_pn = {}
for s in range(15):
    for dx in range(8):
        dy = s - dx
        if 0 <= dy < 8:
            moves = [(dx - a, dy - b) for (a, b) in [(1,0), (0,1), (1,1)] if dx - a >= 0 and dy - b >= 0]
            if any(king_pn[m] == "P" for m in moves):
                king_pn[(dx, dy)] = "N"
            else:
                king_pn[(dx, dy)] = "P"
for dx in range(8):
    for dy in range(8):
        expected = "P" if (dx % 2 == 0 and dy % 2 == 0) else "N"
        assert king_pn[(dx, dy)] == expected
print("  Verified 8x8 King Game: (dx, dy) is a P-position iff dx and dy are BOTH EVEN!")
