# Exporta a réplica não oficial no formato kartle-pista (pontos a cada 1 m, largura fixa) com zebras
# geradas por regra de pista de kart, e desenha atual × réplica lado a lado.
import json, numpy as np, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
WID = 7.0; RAMP_SPLIT = 0.5
d = json.load(open('../kart-park.json', encoding='utf-8'))
e = json.load(open('f_40_1.6.json')); T = np.array(e['tipos']); v = np.array(e['x']); M = len(T); RAMP = e['ramp']
lens = np.abs(v[:M]); ks = np.where(T == 0, 0, v[M:2 * M])
T[np.abs(ks) < 1 / 1000] = 0; ks[T == 0] = 0  # arco de raio > 1 km é reta
x0, y0, h0 = v[2 * M:]
L = lens.sum(); n = int(round(L / 0.05)); h = L / n; s = (np.arange(n) + .5) * h; ed = np.r_[0, np.cumsum(lens)]
kk = np.zeros(n)
for j in range(M): kk[(s >= ed[j]) & (s < ed[j + 1])] = ks[j]
k0 = kk.copy()
for j in range(M):
    off = ((s - ed[j] + L / 2) % L) - L / 2; m = np.abs(off) < RAMP / 2
    kk[m] = ks[j - 1] + (ks[j] - ks[j - 1]) * (off[m] + RAMP / 2) / RAMP
hd = h0 + np.cumsum(kk * h) - kk * h / 2
c = np.vstack([[0, 0], np.cumsum(h * np.c_[np.cos(hd), np.sin(hd)], 0)])
gap = c[-1] - c[0]; c = c[:-1] - np.outer(s / L, gap)  # distribui o resíduo de fechamento (mm)
step = int(round(1 / h)); pts = c[::step]; npt = len(pts)
# zebras: interna em toda curva de raio < 30 m (do início ao fim do arco), externa na saída das de raio < 16 m
zeb = []
for j in range(M):
    if T[j] == 0: continue
    R = 1 / abs(ks[j]); inside = 'esquerda' if ks[j] > 0 else 'direita'; outside = 'direita' if ks[j] > 0 else 'esquerda'
    a, b = ed[j], ed[j + 1]
    if R < 30: zeb.append({'lado': inside, 'de_m': round(a + 1, 1), 'ate_m': round(b - 1, 1)})
    if R < 16: zeb.append({'lado': outside, 'de_m': round(b - 0.35 * (b - a), 1), 'ate_m': round(b + 4, 1)})
for z in zeb: z['ate_m'] = round(min(z['ate_m'], L - 0.1), 1)
out = {k: d[k] for k in ['formato', 'versao']}
out.update({'id': 'kart-park-replica', 'nome': 'Kart Park (réplica não oficial)', 'cidade': d['cidade'], 'tipo': d['tipo'],
            'sentido': d['sentido'], 'comprimento_m': round(L, 1), 'comprimento_oficial_m': d['comprimento_oficial_m'],
            'largura_media_m': WID, 'origem': d['origem'], 'largada': {'indice': 0, 'rumo_graus': round(float((90 - np.degrees(h0)) % 360), 1)},
            'pontos_formato': d['pontos_formato'],
            'pontos': [[round(float(x), 2), round(float(y), 2), WID] for x, y in pts], 'zebras': zeb,
            'elementos': [{'tipo': 'reta' if T[j] == 0 else ('esquerda' if ks[j] > 0 else 'direita'), 'de_m': round(ed[j], 1),
                           'comprimento_m': round(lens[j], 1), **({} if T[j] == 0 else {'raio_m': round(1 / abs(ks[j]), 1),
                           'angulo_graus': round(float(np.degrees(abs(ks[j]) * lens[j])), 0)})} for j in range(M)],
            'transicao_m': RAMP,
            'fontes': {'derivada_de': 'kart-park.json (OpenStreetMap way/128739206 + bordas Esri)',
                       'metodo': 'retas e arcos de raio constante ajustados por mínimos quadrados; largura fixa; zebras por regra',
                       'gerado_em': '2026-11-06', 'oficial': False}})
json.dump(out, open('kart-park-replica.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
# desenho lado a lado
def edges(xy, w):
    sg = np.diff(np.vstack([xy, xy[:1]]), axis=0); hh = np.arctan2(sg[:, 1], sg[:, 0]); nr = np.c_[-np.sin(hh), np.cos(hh)]
    return xy + nr * np.asarray(w)[:, None] / 2, xy - nr * np.asarray(w)[:, None] / 2, nr
def draw(ax, xy, w, zebras, title):
    Lb, Rb, nr = edges(xy, w)
    ax.set_facecolor('#6e8f60')
    area = lambda q: abs(np.dot(q[:, 0], np.roll(q[:, 1], 1)) - np.dot(q[:, 1], np.roll(q[:, 0], 1))) / 2
    big, small = (Lb, Rb) if area(Lb) > area(Rb) else (Rb, Lb)
    ax.add_patch(Polygon(big, color='#555')); ax.add_patch(Polygon(small, color='#6e8f60'))
    ax.plot(*np.r_[Lb, Lb[:1]].T, 'w', lw=.8); ax.plot(*np.r_[Rb, Rb[:1]].T, 'w', lw=.8)
    sx = np.r_[0, np.cumsum(np.hypot(*np.diff(xy, axis=0).T))]
    for z in zebras:
        m = (sx >= z['de_m']) & (sx <= z['ate_m'])
        if m.sum() < 2: continue
        sgn = 1 if z['lado'] == 'esquerda' else -1; ww = np.asarray(w)[m][:, None] / 2
        a = xy[m] + sgn * nr[m] * ww; b = xy[m] + sgn * nr[m] * (ww + 1.0)
        for i in range(len(a) - 1):
            ax.add_patch(Polygon([a[i], a[i + 1], b[i + 1], b[i]], color='#d22' if (i // 1) % 2 else 'w', lw=0))
    i0 = 0; ax.plot([Lb[i0, 0], Rb[i0, 0]], [Lb[i0, 1], Rb[i0, 1]], color='k', lw=3)
    ax.set_aspect('equal'); ax.set_xlim(-70, 125); ax.set_ylim(-62, 72); ax.set_xticks([]); ax.set_yticks([]); ax.set_title(title, fontsize=13)
A = np.array(d['pontos'])
fig, ax = plt.subplots(1, 2, figsize=(20, 7.6))
draw(ax[0], A[:, :2], A[:, 2], d['zebras'], f"atual (OSM + bordas da foto) · {d['comprimento_m']} m · largura 4,4–10,8 m")
draw(ax[1], pts, np.full(npt, WID), zeb, f'réplica não oficial · {L:.1f} m · largura {WID:g} m · {M} elementos')
plt.tight_layout(); plt.savefig('kart-park-replica.png', dpi=110)
print(f'volta {L:.1f} m, {npt} pontos, {len(zeb)} zebras, fechamento corrigido {np.hypot(*gap)*1000:.0f} mm')
