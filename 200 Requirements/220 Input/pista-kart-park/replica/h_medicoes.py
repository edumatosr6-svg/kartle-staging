# Fatos da réplica para a revisão 3 do seed, medidos sobre kart-park-replica.json (e kart-park.json para comparar).
# Uso: python -I h_medicoes.py <replica.json> <atual.json>
import json, sys, numpy as np
r = json.load(open(sys.argv[1], encoding='utf-8')); a = json.load(open(sys.argv[2], encoding='utf-8'))
P = np.array(r['pontos']); xy = P[:, :2]; W = P[:, 2]; n = len(xy)
seg = np.diff(np.vstack([xy, xy[:1]]), axis=0); sl = np.hypot(*seg.T); s = np.r_[0, np.cumsum(sl)[:-1]]; L = sl.sum()
print(f'pontos {n}, passo {sl.min():.3f}–{sl.max():.3f} m, volta fechada {L:.2f} m, largura {W.min()}–{W.max()} m')
area = 0.5 * np.sum(xy[:, 0] * np.roll(xy[:, 1], -1) - np.roll(xy[:, 0], -1) * xy[:, 1])
hd = np.arctan2(seg[:, 1], seg[:, 0]); dh = np.angle(np.exp(1j * np.diff(np.r_[hd, hd[0]])))
print(f'área shoelace {area:+.1f} m² ({"anti-horário" if area > 0 else "horário"}), giro {np.degrees(dh.sum()):+.1f}°')
print(f'rumo de largada (bússola) {(90 - np.degrees(np.arctan2(*(xy[3] - xy[0])[::-1]))) % 360:.1f}°')
# elementos
E = r['elementos']; arcs = [e for e in E if e['tipo'] != 'reta']
print(f'elementos {len(E)}: {len(E) - len(arcs)} retas, {len(arcs)} arcos; transição {r["transicao_m"]} m')
for e in sorted(arcs, key=lambda e: e['raio_m'])[:8]: print('  ', e)
st = [e for e in E if e['tipo'] == 'reta']; print('  reta mais longa', max(st, key=lambda e: e['comprimento_m']))
# desvio para a linha atual
A = np.array(a['pontos'])[:, :2]
def near(p, Q):
    d = np.hypot(*(Q[None, :, :] - p[:, None, :]).transpose(2, 0, 1)); return d.min(1)
d1 = near(xy, A); d2 = near(A, xy)
print(f'desvio réplica→atual médio {d1.mean():.2f} p95 {np.percentile(d1, 95):.2f} máx {d1.max():.2f} m; atual→réplica máx {d2.max():.2f} m')
# bordas: auto-interseção grosseira (borda interna recua?) e folgas entre trechos não consecutivos
nr = np.c_[-np.sin(hd), np.cos(hd)]; Lb = xy + nr * W[:, None] / 2; Rb = xy - nr * W[:, None] / 2
for nm, B in (('esq', Lb), ('dir', Rb)):
    sb = np.diff(np.vstack([B, B[:1]]), axis=0); back = (np.einsum('ij,ij->i', sb, seg) <= 0).sum(); print(f'borda {nm}: segmentos invertidos {back}')
D = np.hypot(*(xy[None] - xy[:, None]).transpose(2, 0, 1))
ds = np.abs(s[None] - s[:, None]); ds = np.minimum(ds, L - ds)
gap = D - W[None] / 2 - W[:, None] / 2; gap[ds < 40] = np.inf
i, j = np.unravel_index(np.argmin(gap), gap.shape); print(f'menor folga de grama {gap[i, j]:.2f} m em {s[i]:.1f} × {s[j]:.1f} m; centros {D[i, j]:.2f} m')
close = np.where((gap <= 6).any(1))[0]
runs = np.split(close, np.where(np.diff(close) > 1)[0] + 1)
for rr in runs:
    if len(rr): k = rr[np.argmin(gap[rr].min(1))]; print(f'  grama ≤ 6 m: {s[rr[0]]:.0f}–{s[rr[-1]]:.0f} m (mín {gap[k].min():.2f} m contra {s[np.argmin(gap[k])]:.0f} m)')
# zebras
Z = r['zebras']; print(f'zebras {len(Z)}, {sum(z["ate_m"] - z["de_m"] for z in Z):.1f} m; '
                       f'perto da largada (< 5 m): {[z for z in Z if z["de_m"] < 5 or z["ate_m"] > L - 5]}')
# setores: limites da revisão 1 levados para a réplica pelo ponto mais próximo
As = np.r_[0, np.cumsum(np.hypot(*np.diff(A, axis=0).T))]
for b in (201.6, 350.3, 529.9):
    p = A[np.argmin(np.abs(As - b))]; k = np.argmin(np.hypot(*(xy - p).T))
    el = next(e for e in E if e['de_m'] <= s[k] < e['de_m'] + e['comprimento_m'])
    print(f'  setor {b} m → {s[k]:.1f} m na réplica ({el["tipo"]} de {el["de_m"]} m, {el["comprimento_m"]} m)')
