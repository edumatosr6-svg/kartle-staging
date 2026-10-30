---
id: REL-0004
title: Canal web-mobile — a mesma página, sem loja, sem assinatura, sem versão mínima instalada
feature: dirigibilidade
stage: deploy
status: validated
version: 2.0.0
sources: [DES-0005, DES-0006, DES-0007, DES-0009, NFR-0002, NFR-0003, TEST-0007]
---

# REL-0004 — Canal `web-mobile`

## Não há aplicativo nativo

O produto não tem aplicativo nativo e deliberadamente não terá (I10). O canal `web-mobile` é **a mesma página** do canal
`web-desktop`, aberta no navegador do celular, com inclinação ou toque no lugar do teclado. Esta feature não muda isso:

| Item do estágio | Nesta release |
|---|---|
| Build móvel | o mesmo `dist/` (`01-release.md`); nenhum build separado |
| Assinatura | não se aplica; a única assinatura é o certificado HTTPS de `*.github.io` (RNF06) |
| Submissão a loja | não se aplica |
| Versão mínima suportada | não há versão instalada: o cliente é sempre a página servida. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`) |
| Atualização forçada | não se aplica; a janela de coexistência é a do cache do `index.html` (`REL-0003`) |

## O que é específico do celular nesta feature e precisa ser observado

| Requisito | Onde o código depende disso | Como se observa (`smoke.md`, canal `web-mobile`; `runbook.md`, linhas H) |
|---|---|---|
| Paridade entre teclado e inclinação (NFR-0003): o mesmo `Input` por passo produz as mesmas medidas nos dois modos | a inclinação só muda o adaptador de entrada; a telemetria e o HUD são os mesmos (DES-0005, DES-0007); provado em `npm test` nos modos `BINARY` e `PROPORTIONAL` (`CHK-TEST-0001-07`, `-0002-08`, `-0003-08`, `-0005-07`, `-0009-06`) e nos 56 registros do `bench:handling` | **H1** no celular: a sensação do acerto C com a inclinação; o esterço parcial não força a traseira (texto de aderência nunca "Saindo de traseira"/"Derrapando" sem acelerador cheio e esterço cheio) — E2E-03 |
| Controle de toque sem drift (AC-US-0003-15) | `.touch-controls` de `index.html` com exatamente `left`, `right`, `brake`, `throttle`; o adaptador de toque não lê mais `drift` (DES-0007, *Retirada do botão Drift*) | `check_served.py` (linha do controle de toque); **H3** no celular: com a inclinação ativa e de novo com a permissão negada (recuo para toque), durante a contagem e a volta, só ←, →, Freio e Acelerar — E2E-04 |
| HUD em todos os quadros, inclusive na grama e após bater; último valor mantido na pausa (AC-US-0004-06) | `#speed` e `#handling` escritos por quadro a partir da telemetria (DES-0005) | **H4** no celular: gravação da tela do sinal verde ao fim; cobrir o sensor pausa e mantém o valor — E2E-01 |
| HTTPS para os sensores (RNF06, I6) | a inclinação só é ativada com `window.isSecureContext` e `DeviceOrientationEvent`; em iOS pede `requestPermission` | M1: a URL abre com cadeado; "Ativar inclinação" pede permissão e passa a dirigir |
| 30 fps sustentados numa volta completa em celular intermediário (RNF03), com o custo por passo até 1,10 × a linha de base (NFR-0002) | no máximo 12 passos por quadro; o v6 custa 181,3 µs por passo contra 173,9 µs da linha de base v4 (1,04 ×) na máquina de referência (2026-10-30) | **H5** no celular: fps médio e mínimo numa volta; `npm run bench:handling` na máquina de referência (`STEP_COST` `PASS`) |
| Carregamento até o kart andar abaixo de 10 s em 4G (RNF01) | tamanho do bundle: 711 477 bytes (188 912 comprimidos) | M2, em rede 4G real, cache vazio |

## Dispositivos de referência

Os aparelhos e navegadores nomeados para RNF03 e NFR-0003 (notebook e celular intermediário) são decisão do dono do
produto e devem constar de `docs/handling-device-log.md` — **arquivo que ainda não existe** (nenhum estágio o criou; este não
o cria — cerca de escrita, §14; `98-divergences.md`, DIV-DP-01). As cinco linhas humanas H1–H5 do `runbook.md` são a
"execução 1" desse log; podem ser feitas na mesma sessão das portas humanas de `race-lap-validation`, `modelo-kart-01` e
`pista-kart-park`, sobre a mesma URL de staging, porque o bundle é um só. Esta release não escolhe aparelhos.
