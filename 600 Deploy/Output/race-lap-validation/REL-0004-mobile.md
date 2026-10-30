---
id: REL-0004
title: Canal web-mobile — a mesma página, sem loja, sem assinatura, sem versão mínima instalada
feature: race-lap-validation
stage: deploy
status: validated
version: 1.1.0
sources: [DES-0007, DES-0008, DES-0011, ADR-0006, NFR-0003, NFR-0006, TEST-0003, TEST-0015]
---

# REL-0004 — Canal `web-mobile`

## Não há aplicativo nativo

O produto não tem aplicativo nativo e deliberadamente não terá (I10). O canal `web-mobile` é **a mesma página** do
canal `web-desktop`, aberta no navegador do celular, com inclinação ou toque no lugar do teclado. Por isso:

| Item do estágio | Nesta release |
|---|---|
| Build móvel | o mesmo `dist/` (`01-release.md`); nenhum build separado |
| Assinatura | não se aplica; a única assinatura é o certificado HTTPS do domínio (RNF06) |
| Submissão a loja | não se aplica |
| Versão mínima suportada | não há versão instalada: o cliente é sempre a página servida. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`) |
| Atualização forçada | não se aplica; a janela de coexistência é a do cache do `index.html` (`REL-0003`) |

## O que é específico do celular e precisa ser observado na release

| Requisito | Onde o código depende disso | Como se observa (`smoke.md`, canal `web-mobile`) |
|---|---|---|
| HTTPS para os sensores (RNF06, I6) | `src/main.ts`: a inclinação só é ativada com `window.isSecureContext` e `DeviceOrientationEvent` presentes; em iOS pede `requestPermission` | a URL publicada abre com cadeado; "Ativar inclinação" pede permissão e passa a dirigir; sem HTTPS a página avisa "Inclinação indisponível" |
| Sensor negado ou perdido (I4) | pausa por `SENSOR_LOST` depois de cerca de 500 ms sem leitura; texto de controle por toque visível quando a permissão é negada (ADR-0005, DES-0007) | roteiro E2E-05 |
| Texto de estado e motivo com 16 px no mínimo e contraste 4,5:1 (NFR-0006) | `src/style.css` (`--lap-state-size`, fichas) | roteiro E2E-07, medido no aparelho |
| 30 fps sustentados numa volta completa em celular intermediário (NFR-0003) | `src/frameClock.ts`: no máximo 12 passos por quadro (teto de 0,1 s), DES-0007 | roteiro E2E-10, no aparelho nomeado; uma execução em desktop não vale (I9) |
| Carregamento até o kart andar abaixo de 10 s em 4G (RNF01) | tamanho do bundle (`01-release.md`: 711 477 bytes servidos em staging nesta rodada; 188 898 gzip) | medida em rede 4G real ou limitada, cache vazio |
| Treino de voltas seguidas por toque (seed rev 3; ADR-0006) | `index.html`: `#pause` ("❚❚ pausar" / "▶ continuar") e `#lap-end-training` ("encerrar treino") na barra de ações, os dois por toque; `#lap-training-result` ao lado do estado da volta | M13 e M14 (E2E-12): os dois botões alcançáveis e legíveis, em paisagem e em retrato, sem cobrir a pista; o painel legível na tela pequena |

## Dispositivos de referência

Os aparelhos e navegadores nomeados para NFR-0003 (notebook e celular intermediário) são os de RNF03 e devem constar do
registro humano `docs/lap-validation-device-log.md`. O log tem a **execução 1** (local, só `web-desktop`, parcial, de
estado e texto) e a **execução 2** (staging, desktop, operador de sessão: D1, D3, D4 e D14 da primeira release passam;
nenhuma medida de ritmo válida sob automação). Nenhuma linha `M*` foi executada até agora. **Falta a execução 3**, humana,
sobre o build desta rodada em staging (`6b314b2`), pelo roteiro de `runbook.md` (*Linhas humanas*, H1–H6): no notebook,
H1 a H4 (inclusive o treino de voltas seguidas, E2E-12); no celular, **H5** (M1–M12) e **H6** (M13, M14: o treino de
voltas seguidas por inclinação ou toque, "pausar" e "encerrar treino" por toque). Esta release não escolhe aparelhos: é
decisão do dono do produto, registrada no log.
