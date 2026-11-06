# Passada de desenho sobre o ajuste de 47 elementos: arco de raio > RMAX vira reta, vizinhos do mesmo
# tipo com raio parecido viram um arco só; depois reajusta comprimentos e raios ao traçado atual.
import json, sys, numpy as np
from scipy.optimize import least_squares
from scipy.spatial import cKDTree
RMAX, SIM = float(sys.argv[2]), float(sys.argv[3])
d = json.load(open('../kart-park.json', encoding='utf-8')); P = np.array(d['pontos'])[:, :2]
e = json.load(open(sys.argv[1])); T = list(e['tipos']); v = np.array(e['x']); M = len(T); RAMP = e['ramp']
lens = list(np.abs(v[:M])); ks = list(np.where(np.array(T) == 0, 0, v[M:2 * M])); start = v[2 * M:]
el = [[0 if (T[j] == 0 or 1 / abs(ks[j]) > RMAX) else int(np.sign(ks[j])), lens[j], ks[j] * lens[j]] for j in range(M)]
def same(a, b):
    if a[0] != b[0]: return False
    if a[0] == 0: return True
    ra, rb = a[1] / abs(a[2]), b[1] / abs(b[2]); return max(ra, rb) / min(ra, rb) < SIM
ch = True
while ch:
    ch = False
    for j in range(1, len(el)):
        if same(el[j - 1], el[j]):
            el[j - 1][1] += el[j][1]; el[j - 1][2] += el[j][2]; el.pop(j); ch = True; break
# junção da volta: o primeiro e o último elemento, se iguais, ficam separados (a largada é a junção)
T2 = [a[0] for a in el]; M2 = len(el)
L0 = np.hypot(*np.diff(np.vstack([P, P[:1]]), axis=0).T).sum(); NS = int(round(L0 / 0.25))
def build(x):
    lens = np.abs(x[:M2]); ks = np.where(np.array(T2) == 0, 0, x[M2:2 * M2]); x0, y0, h0 = x[2 * M2:]
    L = lens.sum(); h = L / NS; s = (np.arange(NS) + .5) * h; ed = np.r_[0, np.cumsum(lens)]
    k = np.zeros(NS)
    for j in range(M2): k[(s >= ed[j]) & (s < ed[j + 1])] = ks[j]
    kk = k.copy()
    for j in range(M2):
        off = ((s - ed[j] + L / 2) % L) - L / 2; m = np.abs(off) < RAMP / 2
        kk[m] = ks[j - 1] + (ks[j] - ks[j - 1]) * (off[m] + RAMP / 2) / RAMP
    hd = h0 + np.cumsum(kk * h) - kk * h / 2
    pts = np.vstack([[x0, y0], [x0, y0] + np.cumsum(h * np.c_[np.cos(hd), np.sin(hd)], 0)])
    return pts, hd[-1] + kk[-1] * h / 2 - h0
tP = cKDTree(P)
def resid(x):
    pts, turn = build(x); a = cKDTree(pts[:-1]).query(P)[0]; b = tP.query(pts[:-1][::4])[0]
    return np.r_[a, b, 30 * (pts[-1] - pts[0]), 300 * (turn - 2 * np.pi)]
x0 = np.r_[[a[1] for a in el], [a[2] / a[1] if a[0] else 0 for a in el], start]
lo = np.r_[np.full(M2, 3.0), np.full(M2, -1 / 8), -np.inf, -np.inf, -np.inf]; hi = np.r_[np.full(M2, 300.0), np.full(M2, 1 / 8), np.inf, np.inf, np.inf]
r = least_squares(resid, np.clip(x0, lo + 1e-9, hi - 1e-9), bounds=(lo, hi), x_scale='jac', max_nfev=3000)
pts, turn = build(r.x); dev = cKDTree(pts).query(P)[0]
print(f'RMAX {RMAX} SIM {SIM}: {M2} elementos, volta {np.abs(r.x[:M2]).sum():.1f} m, fecha {np.hypot(*(pts[-1]-pts[0])):.3f} m, '
      f'desvio médio {dev.mean():.2f} p95 {np.percentile(dev,95):.2f} máx {dev.max():.2f} m')
json.dump({'tipos': [int(t) for t in T2], 'x': r.x.tolist(), 'ramp': RAMP}, open(sys.argv[4], 'w'))
