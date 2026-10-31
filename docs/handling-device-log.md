# Registro de testes em aparelho — dirigibilidade

Roteiros H* do runbook de `600 Deploy/Output/dirigibilidade/` e linhas de aparelho de `smoke.md`. Uma entrada por execução; o que não foi executado fica marcado como tal — ausência de registro nunca vale como aprovação.

## Execução no celular — 2026-10-30, web-mobile, celular do Eduardo Matos (paisagem), staging

| | |
|---|---|
| Build | staging `https://edumatosr6-svg.github.io/kartle-staging/`, commit `e70aad9` (execução 41109469203, `index-DmxsQuIL.js`; `28d40ef` só registros) |
| Aparelho | celular do dono do produto; modelo, navegador e versão **não informados** |
| Operador | Eduardo Matos, pelo chat (Remote Control), respondendo à lista de 9 itens enviada pelo condutor |
| Relato literal | "Virou bem, rodou legal no celular, vibrou na zebra, quando cortei ele invalidou a volta, aparece as marcas. Resumindo, tudo deu certo" |

| Item da lista | Resultado | Base |
|---|---|---|
| 1 Vira nas curvas fechadas (acerto C) | **passa** | relato: "virou bem" |
| 2 Próxima volta começa sem parar o kart | passa (pelo resumo) | "tudo deu certo"; sem comentário específico |
| 3 Corte invalida a volta e o kart segue | **passa** | relato: "quando cortei ele invalidou a volta" |
| 4 Vibração na zebra | **passa** | relato: "vibrou na zebra" |
| 5 Marcas de pneu ao escorregar | **passa** | relato: "aparece as marcas" |
| 6 Crédito OpenStreetMap no resultado da volta | passa (pelo resumo) | "tudo deu certo"; sem comentário específico |
| 7 Roda liso | **passa (qualitativo)** | relato: "rodou legal"; **fps não medido** — o critério numérico (≥ 30 fps no celular intermediário) segue aberto |
| 8 Nenhum botão ou texto de drift | passa (pelo resumo) | "tudo deu certo"; sem comentário específico |
| 9 Jogável em retrato | passa (pelo resumo) | "tudo deu certo"; sem comentário específico |

**Em aberto depois desta execução:** medição de fps no celular, modelo do aparelho de referência, e todas as linhas do notebook (teclado, 60 fps, som da zebra).
