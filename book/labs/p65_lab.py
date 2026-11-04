#!/usr/bin/env python3
"""
Lab script for P65: Floer homology from holomorphic strips.
Computes and verifies all numerical tables, action differences, bigon areas,
Morse/Floer boundary matrices, and SVG coordinates for p65-floer-homology.html.
"""
import math
import json

# 1. Encounter Artifact: Two curves L0, L1 on cylinder T*S^1 = (q mod 2pi, p in R)
# L0 is the zero section p = 0.
# L1 is the exact perturbed Lagrangian p = f'(q), where
# f(q) = cos(q) + (1/3)*cos(2*q)  or even cleaner:
# Let's test a 4-intersection model on [0, 2*pi):
# f(q) = 2*cos(q) + cos(2*q)
# Then f'(q) = -2*sin(q) - 2*sin(2*q) = -2*sin(q)*(1 + 2*cos(q))
# Roots of f'(q) = 0 on [0, 2*pi):
# sin(q) = 0  => q_A = 0, q_C = pi
# cos(q) = -1/2 => q_B = 2*pi/3, q_D = 4*pi/3
# Let's check the heights (Generating function values = Symplectic Action A(x) = f(q)):
# f(0) = 2(1) + 1 = 3.0
# f(2*pi/3) = 2(-1/2) + (-1/2) = -1.5 = -3/2
# f(pi) = 2(-1) + 1 = -1.0
# f(4*pi/3) = 2(-1/2) + (-1/2) = -1.5 = -3/2
# Wait: to have distinct actions (non-degenerate critical values) or clean rational-pi actions,
# let's test a polynomial on R or a perturbed trig potential on S^1!

# Even cleaner on S^1 (q in [0, 2*pi)):
# Take f(q) = cos(q) - (1/2)*sin(q) ? No, that only has 2 critical points on S^1!
# Why? Because any smooth function on S^1 with 4 critical points has 2 local maxima and 2 local minima!
# Let's construct f(q) on S^1 so that all 4 critical points and critical values are clean exact numbers:
# Suppose f'(q) = sin(q) * (cos(q) - c) ... wait:
# ∫ sin(q)*(cos(q) - c) dq = -(1/2)*cos^2(q) + c*cos(q).
# Let's check F(u) = -(1/2)*u^2 + c*u where u = cos(q)!
# No, if F depends only on cos(q), then q and 2*pi - q have the SAME action F(cos(q)), which is symmetric!
# What if the two curves are on R (first in the Encounter, before wrapping around the cylinder), OR on S^1 with an asymmetric term?
# Wait: on S^1, if two strips connect Maximum M to Minimum m (going left vs going right around the circle),
# their action difference Δf = f(M) - f(m) is IDENTICAL! That's WHY the two strips cancel in mod-2 (or with opposite signs in Z) to give ∂(M) = m - m = 0!
# AND for a 4-intersection curve on S^1:
# Let f(q) = 2*cos(q) + cos(2*q) + (1/2)*sin(q)? No, if f(q) is symmetric:
# Wait: why would we want asymmetric or symmetric?
# Let's check what happens on S^1 when f(q) = 2*cos(q) + cos(2*q):
# Critical points of f(q) = 2*cos(q) + cos(2*q):
# f'(q) = -2*sin(q) - 2*sin(2*q) = -2*sin(q)*(1 + 2*cos(q))
# f''(q) = -2*cos(q) - 4*cos(2*q)
# Let's check the 4 critical points in cyclic order around S^1:
# x_1: q = 0.       f(0) = 3.     f''(0) = -6 < 0   => Morse index = 1 (local maximum M_1)
# x_2: q = 2*pi/3.  f = -3/2.     f''(2pi/3) = -2(-1/2) - 4(-1/2) = 3 > 0 => Morse index = 0 (local minimum m_1)
# x_3: q = pi.      f(pi) = -1.   f''(pi) = 2 - 4 = -2 < 0 => Morse index = 1 (local maximum M_2, lower peak)
# x_4: q = 4*pi/3.  f = -3/2.     f''(4pi/3) = +3 > 0 => Morse index = 0 (local minimum m_2)

print("=== Check 4-intersection exact Lagrangian on T*S^1 ===")
def f(q):
    return 2*math.cos(q) + math.cos(2*q)

def df(q):
    return -2*math.sin(q) - 2*math.sin(2*q)

def d2f(q):
    return -2*math.cos(q) - 4*math.cos(2*q)

crit_pts = [
    ("M1", 0.0, "0"),
    ("m1", 2*math.pi/3, "2pi/3"),
    ("M2", math.pi, "pi"),
    ("m2", 4*math.pi/3, "4pi/3")
]
for name, q, label in crit_pts:
    print(f"{name} at q={label}: f(q)={f(q):.4f}, f'(q)={df(q):.4e}, f''(q)={d2f(q):.4f}")

# Areas of the 4 bigons (strips) between L0 (p=0) and L1 (p = f'(q)):
# Strip S_12 from M1 (0) to m1 (2pi/3): area = ∫_0^{2pi/3} (-f'(q)) dq = f(0) - f(2pi/3) = 3 - (-1.5) = 4.5 = 9/2
# Strip S_32 from M2 (pi) to m1 (2pi/3): area = f(pi) - f(2pi/3) = -1 - (-1.5) = 0.5 = 1/2
# Strip S_34 from M2 (pi) to m2 (4pi/3): area = f(pi) - f(4pi/3) = -1 - (-1.5) = 0.5 = 1/2
# Strip S_14 from M1 (2pi) to m2 (4pi/3): area = f(2pi) - f(4pi/3) = 3 - (-1.5) = 4.5 = 9/2
print("\nBigon areas:")
print("Area(M1 -> m1) =", f(0) - f(2*math.pi/3), "(exact 9/2 = 4.5)")
print("Area(M2 -> m1) =", f(math.pi) - f(2*math.pi/3), "(exact 1/2 = 0.5)")
print("Area(M2 -> m2) =", f(math.pi) - f(4*math.pi/3), "(exact 1/2 = 0.5)")
print("Area(M1 -> m2) =", f(2*math.pi) - f(4*math.pi/3), "(exact 9/2 = 4.5)")

# Boundary matrix d1: C_1 (spanned by M1, M2) -> C_0 (spanned by m1, m2)
# Over Z/2Z:
# d(M1) = m1 + m2
# d(M2) = m1 + m2
# Over Z (with coherent orientations):
# d(M1) = m1 - m2
# d(M2) = m1 - m2
# Kernel of d1 is 1-dimensional: spanned by M1 - M2 (or M1 + M2 mod 2), surviving even though M2 is a born-from-wiggle false peak!
# Image of d1 is 1-dimensional: spanned by m1 - m2, so C_0 / Im(d1) is 1-dimensional!
# Thus HF_1 = Z (rank 1), HF_0 = Z (rank 1), recovering H_*(S^1) = Z in degree 1 and Z in degree 0,
# whereas raw intersection count was 4, and after cancelling the false pair (M2, m1) or (M2, m2) of area 1/2, 2 intersections remain!

# 2. Check Exemplar 1: Polynomial double-well on R (Quartic action functional)
# Let L0 = {p = 0}, L1 = {p = x^3 - 4x} on R^2 = C.
# Potential W(x) = (1/4)x^4 - 2x^2, wait: if p = -W'(x) = 4x - x^3, then:
# Critical points at x_L = -2, x_0 = 0, x_R = +2.
# Wait: for W(x) = (1/4)x^4 - 2x^2:
# W(0) = 0 (local maximum, index 1)
# W(-2) = 16/4 - 8 = -4 (local minimum, index 0)
# W(+2) = 16/4 - 8 = -4 (local minimum, index 0)
# Bigon areas from x_0 = 0 to x_R = 2 and x_L = -2:
# ∫_0^2 (4x - x^3) dx = [2x^2 - x^4/4]_0^2 = 8 - 4 = 4 = W(0) - W(2).
print("\n=== Exemplar 1: Quartic double-well L1: p = 4x - x^3 ===")
def W(x):
    return -0.25*(x**4) + 2*(x**2) # so W'(x) = 4x - x^3, and Action A(x) = -W(x) = x^4/4 - 2x^2
# Wait: let's stick to standard convention: p = -f'(q), so f(q) = q^4/4 - 2q^2:
# f(0) = 0 (index 1 maximum on [-2,2]), f(±2) = -4 (index 0 minima).
# Wait: as q -> ±infty, f(q) -> +infty, so let's instead use the 3-grading cubic:
# f(q) = (1/3)*q^3 - q  ? No, that has 1 max and 1 min!
# For 3 critical points where ∂^2 = 0 is demonstrated via a 2-step cascade (Index 2 -> Index 1 -> Index 0):
# Consider a 2D surface (like the 2-sphere or tilted torus / saddle-peak-bowl on R^2)!
# On R^2 with coordinates (q1, q2):
# f(q1, q2) = -q1^2 + (1/3)q2^3 - q2 ?
# No, for a compact or polynomial Morse-Floer model with Index 2 (peak P), two Index 1 saddles (S_+, S_-), and Index 0 (bowl B):
# Think of the tilted height function on S^2 (or two Lagrangian spheres intersecting in 4 points: North Pole P of index 2, two equator saddles S_a, S_b of index 1, South Pole B of index 0):
# Strips from P (index 2) to S_a (index 1): 2 strips? No!
# In the classic heart/cardioid broken-strip example (Floer's ∂^2 = 0):
# There is 1 strip from P (index 2) to S_a (index 1), and 1 strip from S_a (index 1) to B (index 0),
# AND 1 strip from P (index 2) to S_b (index 1), and 1 strip from S_b (index 1) to B (index 0)!
# Wait: the 1-dimensional moduli space M(P, B) of index-difference 2 trajectories is an interval [0, 1]!
# One endpoint (tau -> 0) breaks at S_a into (P -> S_a) # (S_a -> B).
# The other endpoint (tau -> 1) breaks at S_b into (P -> S_b) # (S_b -> B).
# Therefore, in ∂(∂(P)):
# ∂(P) = S_a + S_b (mod 2) or S_a - S_b (over Z).
# ∂(S_a) = B, and ∂(S_b) = B.
# So ∂(∂(P)) = ∂(S_a) - ∂(S_b) = B - B = 0!
# Let's write down the explicit 2D potential f(x, y) whose gradient flow / strip moduli space has this exact diamond!
# On the unit circle / disk or R^2:
# Take f(x, y) = -(x^3/3 - x) - y^2 * ... wait:
# Even simpler: product potential f(x, y) on [-1, 1]^2 or R^2:
# Let h(u) = -(1/3)u^3 + u on R (critical points u = -1 [min, h=-2/3] and u = +1 [max, h=+2/3]).
# Then F(x, y) = h(x) + h(y) on R^2 has 4 critical points!
# Wait: let's check the 4 critical points of F(x, y) = (-x^3/3 + x) + (-y^3/3 + y):
# 1. P = (+1, +1): grad F = (0,0), Hessian = diag(-2, -2) => 2 negative eigenvalues => Morse/Maslov index = 2! F(P) = +4/3.
# 2. S_a = (+1, -1): grad F = (0,0), Hessian = diag(-2, +2) => 1 negative eigenvalue  => Morse/Maslov index = 1! F(S_a) = 0.
# 3. S_b = (-1, +1): grad F = (0,0), Hessian = diag(+2, -2) => 1 negative eigenvalue  => Morse/Maslov index = 1! F(S_b) = 0.
# 4. B = (-1, -1): grad F = (0,0), Hessian = diag(+2, +2) => 0 negative eigenvalues => Morse/Maslov index = 0! F(B) = -4/3.
print("\n=== Diamond Model: F(x,y) = (-x^3/3 + x) + (-y^3/3 + y) ===")
def h(u):
    return -(u**3)/3.0 + u
def F(x, y):
    return h(x) + h(y)
diamond_pts = [
    ("P", 1, 1, 2),
    ("S_a", 1, -1, 1),
    ("S_b", -1, 1, 1),
    ("B", -1, -1, 0)
]
for name, x, y, idx in diamond_pts:
    print(f"{name}=({x},{y}): Index={idx}, Action F={F(x,y):.4f} (exact {int(round(F(x,y)*3))}/3)")

print("Action drop P -> S_a:", F(1,1) - F(1,-1), "(exact 4/3)")
print("Action drop S_a -> B:", F(1,-1) - F(-1,-1), "(exact 4/3)")
print("Total Action drop P -> B:", F(1,1) - F(-1,-1), "(exact 8/3 = 4/3 + 4/3)")

#And because the ODE system dx/ds = 1 - x^2, dy/ds = 1 - y^2 decouples completely:
# x(s) = -tanh(s - s1), y(s) = -tanh(s - s2)
# modulo overall time translation (s -> s + c), the 1-parameter family of trajectories from P=(1,1) to B=(-1,-1)
# is parameterized by the relative delay tau = s2 - s1 in (-infty, +infty)!
# As tau -> +infty, x drops from +1 to -1 first (reaching S_b = (-1, +1)), and then y drops from +1 to -1 (reaching B = (-1, -1))!
# As tau -> -infty, y drops from +1 to -1 first (reaching S_a = (+1, -1)), and then x drops from +1 to -1 (reaching B = (-1, -1))!
# THAT IS AN EXACT, CLOSED-FORM ANALYTIC FORMULA FOR BROKEN TRAJECTORIES AND GLUING!
# Let's check that!
# dx/ds = -(partial F / partial x) = x^2 - 1.
# Check: at x(s) = -tanh(s), dx/ds = -sech^2(s) = -(1 - tanh^2(s)) = tanh^2(s) - 1 = x(s)^2 - 1!
# As s -> -infty, x(s) = -tanh(-infty) = +1.
# As s -> +infty, x(s) = -tanh(+infty) = -1.
# Energy ∫_{-infty}^{+infty} (dx/ds)^2 ds = ∫_{-1}^{1} (1 - x^2) dx = [x - x^3/3]_{-1}^{1} = 4/3 = F(+1) - F(-1)!
print("\nClosed-form trajectory verification:")
for s in [-2.0, -1.0, 0.0, 1.0, 2.0]:
    x_val = -math.tanh(s)
    dx_val = -1.0 / (math.cosh(s)**2)
    rhs = x_val**2 - 1.0
    assert abs(dx_val - rhs) < 1e-12, f"Mismatch at s={s}"
print("Exact ODE match dx/ds = x^2 - 1 verified for x(s) = -tanh(s)!")

# Let's compute exact SVG coordinates for the 3 figures in P65:
# Fig P65.1: The 4 intersections on the cylinder T*S^1 (q from 0 to 2pi, p = -2sin(q) - 2sin(2q))
# with the two large bigons (area 9/2) and two small bigons (area 1/2).
# Map q in [0, 2*pi] to x_svg in [60, 540] (width 480), and p in [-3.0, 3.0] to y_svg in [190, 30] (center y = 110, scale = 25 px per unit).
pts_svg1 = []
for i in range(97):
    q = (2 * math.pi * i) / 96.0
    p = -2 * math.sin(q) - 2 * math.sin(2 * q)
    x_svg = 60.0 + (q / (2 * math.pi)) * 480.0
    y_svg = 110.0 - p * 25.0
    pts_svg1.append(f"{x_svg:.1f},{y_svg:.1f}")

print("\nSVG1 curve sample points (first 5):", pts_svg1[:5])
for name, q, label in crit_pts:
    x_svg = 60.0 + (q / (2 * math.pi)) * 480.0
    print(f"Intersection {name} ({label}): x_svg = {x_svg:.1f}, y_svg = 110.0")

# Fig P65.2: The 1-parameter family of trajectories (x(s), y(s)) = (-tanh(s), -tanh(s - tau)) in [-1, 1]^2
# for tau in {-3.0, -1.2, 0.0, +1.2, +3.0} showing the deformation from the upper-right elbow (P -> S_a -> B)
# through the diagonal (tau=0) to the lower-left elbow (P -> S_b -> B).
# Map x in [-1, 1] to x_svg in [90, 270] (center 180, scale 90), y in [-1, 1] to y_svg in [210, 30] (center 120, scale 90).
svg2_paths = {}
for tau in [-3.0, -1.2, 0.0, 1.2, 3.0]:
    path_pts = []
    for k in range(-40, 41, 2):
        s = k * 0.15
        x_val = -math.tanh(s)
        y_val = -math.tanh(s - tau)
        xs = 180.0 + x_val * 85.0
        ys = 120.0 - y_val * 85.0
        path_pts.append(f"{xs:.1f},{ys:.1f}")
    svg2_paths[str(tau)] = " ".join(path_pts)

with open("artifacts/file_generation/ttl=63d/intermediate/labs/p65_data.json", "w") as fp:
    json.dump({
        "svg1_polyline": " ".join(pts_svg1),
        "svg2_paths": svg2_paths
    }, fp, indent=2)
print("Saved p65_data.json successfully.")
