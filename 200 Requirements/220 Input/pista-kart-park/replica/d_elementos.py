# Réplica não oficial, passo 2: a pista como lista de elementos (reta ou arco de raio constante),
# com transição linear de curvatura (clotoide) de RAMP m entre elementos. Comprimentos e raios são
# ajustados ao traçado atual por mínimos quadrados, com volta fechada e rumo total = 360°.
import json, numpy as np
from scipy.optimize import least_squares
from scipy.spatial import cKDTree
d = json.load(open('../kart-park.json', encoding='utf-8'))
P = np.array(d['pontos'])[:, :2]
seg = np.diff(np.vstack([P, P[:1]]), axis=0); dsP = np.hypot(*seg.T)
sP = np.concatenate([[0], np.cumsum(dsP)[:-1]]); L0 = dsP.sum()
hP = np.unwrap(np.arctan2(seg[:, 1], seg[:, 0]))
kP = np.gradient(hP) / dsP
W = 5; kS = np.convolve(np.r_[kP[-W:], kP, kP[:W]], np.ones(2 * W + 1) / (2 * W + 1), 'valid')
# segmentação inicial: partição ótima da curvatura (média 2 m) em trechos constantes,
# por programação dinâmica com custo fixo por trecho; trecho com |k| < TH vira reta.
import sys
TH, PEN, MINLEN = 0.012, float(sys.argv[1]) if len(sys.argv) > 1 else 0.002, 6.0
B = 2.0; nb = int(L0 // B); kb = np.array([kS[(sP >= i * B) & (sP < (i + 1) * B)].mean() for i in range(nb)])
cs = np.r_[0, np.cumsum(kb)]; cs2 = np.r_[0, np.cumsum(kb ** 2)]
def sse(i, j): n = j - i; m = (cs[j] - cs[i]) / n; return cs2[j] - cs2[i] - n * m * m
mn = int(MINLEN / B); best = np.full(nb + 1, np.inf); best[0] = 0; prev = np.zeros(nb + 1, int)
for j in range(mn, nb + 1):
    for i in range(0, j - mn + 1):
        if best[i] < np.inf:
            c = best[i] + sse(i, j) + PEN
            if c < best[j]: best[j], prev[j] = c, i
cuts = [nb]
while cuts[-1] > 0: cuts.append(prev[cuts[-1]])
cuts = cuts[::-1]
runs = []
for i, j in zip(cuts[:-1], cuts[1:]):
    m = kb[i:j].mean(); c = 0 if abs(m) < TH else int(np.sign(m))
    if runs and runs[-1][0] == c == 0: runs[-1][1] += (j - i) * B; continue
    runs.append([c, (j - i) * B, m * (j - i) * B])
runs[-1][1] += L0 - nb * B
RAMP, H = 5.0, 0.25
NS = int(round(L0 / H))
types = [r[0] for r in runs]; M = len(runs)
def profile(lens, ks):
    n = NS; s = (np.arange(n) + .5) * lens.sum() / n
    edges = np.concatenate([[0], np.cumsum(lens)])
    kk = np.zeros(n)
    for j in range(M):
        kk[(s >= edges[j]) & (s < edges[j + 1])] = ks[j]
    # rampas lineares centradas em cada junção (inclusive a da volta)
    out = kk.copy()
    for j in range(M):
        e = edges[j]; kprev, knext = ks[j - 1], ks[j]
        m = np.abs(((s - e + lens.sum() / 2) % lens.sum()) - lens.sum() / 2) < RAMP / 2
        u = (((s[m] - e + lens.sum() / 2) % lens.sum()) - lens.sum() / 2 + RAMP / 2) / RAMP
        out[m] = kprev + (knext - kprev) * u
    return s, out, lens.sum() / n
def build(v):
    lens = np.abs(v[:M]); kfree = v[M:2 * M]; x0, y0, h0 = v[2 * M:]
    ks = np.where(np.array(types) == 0, 0.0, kfree)
    s, k, h = profile(lens, ks)
    hd = h0 + np.cumsum(k * h) - k * h / 2
    pts = np.vstack([[x0, y0], [x0, y0] + np.cumsum(h * np.c_[np.cos(hd), np.sin(hd)], 0)])
    return pts, hd[-1] + k[-1] * h / 2 - h0, ks, lens
treeP = cKDTree(P)
def resid(v):
    pts, turn, ks, lens = build(v)
    t = cKDTree(pts[:-1]); a, _ = t.query(P); b, _ = treeP.query(pts[:-1][::4])
    return np.r_[a, b, 30 * (pts[-1] - pts[0]), 300 * (turn - 2 * np.pi)]
lens0 = np.array([r[1] for r in runs]); k0 = np.array([r[2] / r[1] for r in runs])
v0 = np.r_[lens0, k0, P[0], hP[0]]
lo = np.r_[np.full(M, 4.0), np.full(M, -1 / 8.0), -np.inf, -np.inf, -np.inf]
hi = np.r_[np.full(M, 200.0), np.full(M, 1 / 8.0), np.inf, np.inf, np.inf]
v0 = np.clip(v0, lo + 1e-9, hi - 1e-9)
r = least_squares(resid, v0, bounds=(lo, hi), x_scale='jac', max_nfev=4000)
pts, turn, ks, lens = build(r.x)
dev = cKDTree(pts).query(P)[0]
print('elementos', M, '| volta', round(lens.sum(), 1), 'm | fecha', round(float(np.hypot(*(pts[-1] - pts[0]))), 3), 'm | giro', round(np.degrees(turn), 2))
print('desvio do traçado atual: médio %.2f p95 %.2f máx %.2f m' % (dev.mean(), np.percentile(dev, 95), dev.max()))
s0 = 0
for j in range(M):
    kind = 'reta' if types[j] == 0 else ('esq' if ks[j] > 0 else 'dir')
    print(f'{j+1:2d} {kind:4s} de {s0:6.1f} m  comp {lens[j]:6.1f} m' + ('' if types[j] == 0 else f'  raio {1/abs(ks[j]):6.1f} m  ângulo {np.degrees(abs(ks[j])*lens[j]):5.0f}°'))
    s0 += lens[j]
json.dump({'tipos': [int(t) for t in types], 'x': r.x.tolist(), 'ramp': RAMP}, open('d_elementos.json', 'w'))
