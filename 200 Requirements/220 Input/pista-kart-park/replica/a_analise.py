# Análise do traçado atual (kart-park.json): curvatura e largura ao longo da volta.
import json, numpy as np, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
d = json.load(open('../kart-park.json', encoding='utf-8'))
p = np.array(d['pontos']); xy = p[:, :2]; w = p[:, 2]
seg = np.diff(np.vstack([xy, xy[:1]]), axis=0); ds = np.hypot(*seg.T); s = np.concatenate([[0], np.cumsum(ds)[:-1]])
h = np.unwrap(np.arctan2(seg[:, 1], seg[:, 0]))
k = np.gradient(h) / ds  # curvatura 1/m
ks = np.convolve(np.r_[k[-5:], k, k[:5]], np.ones(11) / 11, 'valid')
fig, ax = plt.subplots(1, 2, figsize=(18, 8))
n = np.c_[-np.sin(h), np.cos(h)]
L = xy + n * w[:, None] / 2; R = xy - n * w[:, None] / 2
ax[0].fill(np.r_[L[:, 0], R[::-1, 0]], np.r_[L[:, 1], R[::-1, 1]], color='#bbb')
ax[0].plot(*L.T, 'k', lw=.6); ax[0].plot(*R.T, 'k', lw=.6); ax[0].plot(*xy.T, 'r', lw=.5)
for i in range(0, len(s), 25): ax[0].annotate(f'{s[i]:.0f}', xy[i], fontsize=7, color='b')
ax[0].set_aspect('equal'); ax[0].set_title('atual: bordas + linha central (números = metros)')
ax[1].plot(s, ks, label='curvatura 1/m (média 11 m)'); ax[1].plot(s, w / 50, label='largura/50')
ax[1].axhline(0, color='k', lw=.5); ax[1].legend(); ax[1].grid(alpha=.3); ax[1].set_xlabel('m')
plt.tight_layout(); plt.savefig('a_analise.png', dpi=110)
print('volta', round(ds.sum(), 1), 'm; pontos', len(xy))
# sinais de "tortura": trocas de sinal da curvatura e raios < 6 m
r = 1 / np.maximum(np.abs(ks), 1e-6)
print('trechos com raio < 6 m:', [round(s[i]) for i in np.where(r < 6)[0][::5]])
sign = np.sign(np.where(np.abs(ks) < 0.01, 0, ks)); ch = np.where(np.diff(sign[sign != 0]) != 0)[0]
print('trocas de lado da curva:', len(ch))
