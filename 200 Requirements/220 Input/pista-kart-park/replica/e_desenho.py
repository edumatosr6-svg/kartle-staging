# Desenha a réplica (arquivo de elementos) sobre o traçado atual, com largura fixa e perfil de curvatura.
import json, sys, numpy as np, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
from scipy.spatial import cKDTree
src = sys.argv[1]; out = sys.argv[2]; WID = float(sys.argv[3]) if len(sys.argv) > 3 else 7.0
d = json.load(open('../kart-park.json', encoding='utf-8')); A = np.array(d['pontos'])
e = json.load(open(src)); T = np.array(e['tipos']); v = np.array(e['x']); M = len(T); RAMP = e['ramp']
lens = np.abs(v[:M]); ks = np.where(T == 0, 0, v[M:2 * M]); x0, y0, h0 = v[2 * M:]
L = lens.sum(); n = int(L / 0.25); h = L / n; s = (np.arange(n) + .5) * h; ed = np.r_[0, np.cumsum(lens)]
k = np.zeros(n)
for j in range(M): k[(s >= ed[j]) & (s < ed[j + 1])] = ks[j]
kk = k.copy()
for j in range(M):
    off = ((s - ed[j] + L / 2) % L) - L / 2; m = np.abs(off) < RAMP / 2
    kk[m] = ks[j - 1] + (ks[j] - ks[j - 1]) * (off[m] + RAMP / 2) / RAMP
hd = h0 + np.cumsum(kk * h) - kk * h / 2
c = np.vstack([[x0, y0], [x0, y0] + np.cumsum(h * np.c_[np.cos(hd), np.sin(hd)], 0)])[:n]
nn = np.c_[-np.sin(hd), np.cos(hd)]
def band(xy, nrm, w, **kw):
    Lb = xy + nrm * w[:, None] / 2; Rb = xy - nrm * w[:, None] / 2
    plt.fill(np.r_[Lb[:, 0], Rb[::-1, 0]], np.r_[Lb[:, 1], Rb[::-1, 1]], **kw)
seg = np.diff(np.vstack([A[:, :2], A[:1, :2]]), axis=0); ha = np.arctan2(seg[:, 1], seg[:, 0])
fig = plt.figure(figsize=(20, 9))
plt.subplot(1, 2, 1)
band(A[:, :2], np.c_[-np.sin(ha), np.cos(ha)], A[:, 2], color='#e9a3a3', alpha=.55, label='atual (largura medida 4,4–10,8 m)')
band(c, nn, np.full(n, WID), color='#4c78a8', alpha=.55, label=f'réplica (largura {WID:g} m)')
plt.plot(*c[::max(1, n // 2000)].T, color='w', lw=.6)
for j in range(M):
    i = min(int((ed[j] + lens[j] / 2) / h), n - 1)
    plt.annotate(str(j + 1), c[i] + nn[i] * (WID / 2 + 3), fontsize=8, ha='center', va='center')
plt.plot(*c[0], 'k^'); plt.gca().set_aspect('equal'); plt.legend(loc='lower right'); plt.title('Kart Park: atual × réplica não oficial (números = elementos)')
plt.subplot(2, 2, 2)
kA = np.gradient(np.unwrap(ha)) / np.hypot(*seg.T); kA = np.convolve(np.r_[kA[-5:], kA, kA[:5]], np.ones(11) / 11, 'valid')
sA = np.r_[0, np.cumsum(np.hypot(*seg.T))[:-1]]
plt.plot(sA, kA, color='#d62728', lw=.8, label='atual'); plt.plot(s, kk, color='#4c78a8', lw=1.4, label='réplica')
plt.axhline(0, color='k', lw=.5); plt.grid(alpha=.3); plt.legend(); plt.ylabel('curvatura 1/m (+ esquerda)'); plt.xlabel('metros da largada')
plt.subplot(2, 2, 4); plt.axis('off')
dev = cKDTree(c).query(A[:, :2])[0]
rows = [f'volta {L:.1f} m · {M} elementos · desvio da linha central: médio {dev.mean():.2f} m, máx {dev.max():.2f} m']
for j in range(M):
    kind = 'reta' if T[j] == 0 else ('esq.' if ks[j] > 0 else 'dir.')
    rows.append(f'{j+1:2d} {kind:4s} {lens[j]:5.1f} m' + ('' if T[j] == 0 else f'  R {1/abs(ks[j]):5.1f} m  {np.degrees(abs(ks[j])*lens[j]):4.0f}°'))
half = (len(rows) + 1) // 2
plt.text(0, 1, '\n'.join(rows[:half]), family='monospace', fontsize=8, va='top')
plt.text(0.5, 1, '\n'.join(rows[half:]), family='monospace', fontsize=8, va='top')
plt.tight_layout(); plt.savefig(out, dpi=100)
np.save(out.replace('.png', '.npy'), np.c_[c, hd])
print(rows[0])
