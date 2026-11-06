# Passo 3 da réplica: com largura fixa de 7 m, o asfalto dos trechos quase encostados (≈ 384 × 606 m) se
# sobrepunha (folga −0,37 m) e surgia uma grama nova de 5,6 m entre ≈ 167 e ≈ 655 m. Reajusta os mesmos
# elementos ao traçado atual com duas folgas mínimas de grama: GAP1 no trecho da barreira e GAP2 no outro,
# que assim deixa de precisar de barreira. Uso: python i_folga.py <in.json> GAP1 GAP2 <out.json>
import json, sys, numpy as np
from scipy.optimize import least_squares
from scipy.spatial import cKDTree
GAP1, GAP2, WID = float(sys.argv[2]), float(sys.argv[3]), 7.0
d = json.load(open('../kart-park.json', encoding='utf-8')); P = np.array(d['pontos'])[:, :2]
e = json.load(open(sys.argv[1])); T = np.array(e['tipos']); x0 = np.array(e['x']); M = len(T); RAMP = e['ramp']
L0 = np.hypot(*np.diff(np.vstack([P, P[:1]]), axis=0).T).sum(); NS = int(round(L0 / 0.25))
def build(x):
    lens = np.abs(x[:M]); ks = np.where(T == 0, 0, x[M:2 * M]); a0, b0, h0 = x[2 * M:]
    L = lens.sum(); h = L / NS; s = (np.arange(NS) + .5) * h; ed = np.r_[0, np.cumsum(lens)]
    k = np.zeros(NS)
    for j in range(M): k[(s >= ed[j]) & (s < ed[j + 1])] = ks[j]
    kk = k.copy()
    for j in range(M):
        off = ((s - ed[j] + L / 2) % L) - L / 2; m = np.abs(off) < RAMP / 2
        kk[m] = ks[j - 1] + (ks[j] - ks[j - 1]) * (off[m] + RAMP / 2) / RAMP
    hd = h0 + np.cumsum(kk * h) - kk * h / 2
    pts = np.vstack([[a0, b0], [a0, b0] + np.cumsum(h * np.c_[np.cos(hd), np.sin(hd)], 0)])
    return pts, hd[-1] + kk[-1] * h / 2 - h0, h
BLK = [((355, 420), (575, 635), GAP1), ((150, 185), (635, 675), GAP2)]  # trechos em m de volta
H0 = np.abs(x0[:M]).sum() / NS  # índices fixos, para o vetor de resíduos não mudar de tamanho
IX = [(slice(int(a / H0), int(b / H0), 4), slice(int(c / H0), int(dd / H0), 4), g) for (a, b), (c, dd), g in BLK]
def gaps(pts, h):
    out = []
    for ia, ib, g in IX:
        A = pts[ia]; B = pts[ib]
        D = cKDTree(B).query(A)[0]; out.append(np.maximum(0, g + WID - D))
    return np.concatenate(out)
tP = cKDTree(P)
def resid(x):
    pts, turn, h = build(x); a = cKDTree(pts[:-1]).query(P)[0]; b = tP.query(pts[:-1][::4])[0]
    return np.r_[a, b, 30 * (pts[-1] - pts[0]), 300 * (turn - 2 * np.pi), 20 * gaps(pts, h)]
lo = np.r_[np.full(M, 3.0), np.full(M, -1 / 8), -np.inf, -np.inf, -np.inf]; hi = np.r_[np.full(M, 300.0), np.full(M, 1 / 8), np.inf, np.inf, np.inf]
r = least_squares(resid, np.clip(x0, lo + 1e-9, hi - 1e-9), bounds=(lo, hi), x_scale='jac', max_nfev=3000)
pts, turn, h = build(r.x); dev = cKDTree(pts).query(P)[0]
print(f'GAP1 {GAP1} GAP2 {GAP2}: volta {np.abs(r.x[:M]).sum():.1f} m, fecha {np.hypot(*(pts[-1]-pts[0])):.3f} m, '
      f'desvio médio {dev.mean():.2f} p95 {np.percentile(dev,95):.2f} máx {dev.max():.2f} m, falta de folga máx {gaps(pts, h).max():.2f} m')
json.dump({'tipos': [int(t) for t in T], 'x': r.x.tolist(), 'ramp': RAMP}, open(sys.argv[4], 'w'))
