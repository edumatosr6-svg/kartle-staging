---
id: REL-0004
title: Canal web-mobile — a mesma página; vibração da zebra, inclinação negada e navegador sem vibração
feature: pista-kart-park
stage: deploy
status: draft
version: 2.0.0
sources: [ADR-0007, ADR-0008, DES-0005, DES-0007, DES-0008, DES-0009, DES-0012, DM-0002, NFR-0002, NFR-0004, NFR-0005, US-0007, TEST-0008, TEST-0009, TEST-0010, TEST-0011]
---

# REL-0004 — Canal `web-mobile`

## Não há aplicativo nativo

O produto não tem aplicativo nativo e deliberadamente não terá (I10). O canal `web-mobile` é **a mesma página** do canal
`web-desktop`, aberta no navegador do celular, com inclinação ou toque no lugar do teclado. Esta feature não muda isso — mas é a
primeira com um **retorno próprio do celular** (a vibração da zebra) e com um comportamento que depende de uma capacidade do
navegador (`navigator.vibrate`), por isso o celular tem linhas próprias:

| Item do estágio | Nesta release |
|---|---|
| Build móvel | o mesmo `dist/` (`01-release.md`); nenhum build separado |
| Assinatura | não se aplica; a única assinatura é o certificado HTTPS de `*.github.io` (RNF06) |
| Submissão a loja | não se aplica |
| Versão mínima suportada | não há versão instalada: o cliente é sempre a página servida. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`); sem `navigator.vibrate` (Safari no iOS) a volta é igual, sem pulso, sem erro e sem aviso (REQ-FEAT-0005-16..19; E2E-06) |
| Atualização forçada | não se aplica; a janela de coexistência é a do cache do `index.html` (`REL-0003`) |

## O que é específico do celular nesta feature e precisa ser observado

| Requisito | Onde o código depende disso | Como se observa (`smoke.md`, canal `web-mobile`; `runbook.md`, linhas H) |
|---|---|---|
| Vibração de **20 ms** a cada **0,25 s** (30 passos de simulação) enquanto houver roda na zebra, só no canal `web-mobile` com `navigator.vibrate`; nenhum pulso fora da zebra nem com a volta pausada (AC-US-0005-07, -08; DES-0009) | `src/curbFeedback.ts:5-9` (`CURB_PULSE_MS` 20, `CURB_PULSE_INTERVAL_STEPS` 30; `decideCurbFeedback` por passo, pura); `src/main.ts:167` (`vibrationAvailable`), `:558` (`navigator.vibrate(CURB_PULSE_MS)` só com `feedback.pulse`; linhas de `3d5dfdd`); provado em `npm test` por CHK-TEST-0008-01, -02, -06, -08; o relevo da zebra é só desenho e não altera `curbWheelCount` (AC-US-0007-18) | **H5** no celular (M7): sentir o pulso curto repetido com a roda na zebra em relevo; nenhum na reta, nenhum na pausa — E2E-05 |
| Navegador sem `navigator.vibrate`: a volta decorre igual, sem erro e sem aviso; o mesmo registro de repetições (REQ-FEAT-0005-16..19) | `vibrationAvailable` falso → `decideCurbFeedback` nunca devolve `pulse`; nenhum `try`/aviso (CHK-TEST-0008-06) | **H5** (M8): volta com zebras num navegador sem vibração (Safari no iOS, ou Chrome com a vibração desligada no sistema) — E2E-06 |
| Seletor com as duas opções, a Kart Park rotulada "(réplica não oficial) · 691 m", e crédito OSM/ODbL com link no seletor e no painel do resultado de cada volta do treino, em paisagem e em retrato, sem cobrir a volta em andamento (AC-US-0001-01; AC-US-0006-01..08; NFR-0005; ADR-0007) | `src/main.ts:213`, `:254` (`renderCredit` e `renderOffer` com o seletor e o crédito em `#track-credit`; linhas de `3d5dfdd`); o crédito do resultado vai para `#lap-training-result-credit`, último filho de `#lap-training-result`, com o `a` acionável por toque (DES-0007) — realizado em `38354bb` (`renderTrainingResult` preserva o contêiner e redesenha o crédito, `src/main.ts:463` em `3d5dfdd`; `#lap-training-result-credit a{pointer-events:auto}`); `src/style.css` (`.track-credit`) | **H5** (M4, M10): os três elementos visíveis no seletor e no painel; o link abre `openstreetmap.org/copyright` em outra aba — E2E-05 |
| Inclinação negada: o toque assume com o aviso, e o seletor e a pista ficam como estavam (REQ-FEAT-0001-13) | comportamento de `race-lap-validation`, inalterado; o seletor é independente da entrada | **H5** (M6) — E2E-05 |
| O traçado da réplica (versão 2: asfalto de largura constante de 7 m, 22 zebras no lado declarado, barreira de 292 vértices em todo o comprimento), desenhado sobre a cena do Kart 01 (AC-US-0002-08, AC-US-0005-03, AC-US-0004-06) | `src/trackScene.ts` (uma malha de asfalto, uma de zebras, a barreira de pneus em pilhas instanciadas, linha de largada, a faixa de borda e a grama em faixas — o código de desenho não mudou na revisão 3; só o arquivo lido); custo de desenho limitado por CHK-TEST-0010-01/-03 sobre a versão 2 | M12 e **H3** no celular — E2E-05 |
| Acabamento da Kart Park igual nos dois canais, em paisagem e em retrato, com o mesmo tom de grama no mesmo lugar depois de girar o aparelho (US-0007, *Canais*; AC-US-0007-14) | `src/trackScene.ts` (`fbfb073`): o tom vem de `grassToneAt` sobre a posição no mundo, sem canal, tela, `devicePixelRatio` nem `matchMedia` (CHK-TEST-0011-08/-09) | **H10** (M13): o roteiro de H9 em paisagem, girar para retrato, recarregar — E2E-05 |
| 30 fps sustentados numa volta completa na Kart Park, **paisagem e retrato**, com zebras, barreira e o **acabamento de US-0007** na tela (NFR-0002 1.1.0) | custo de desenho: o mesmo código da revisão 2 (`code-validation-20261103-2004.md`: zebras em relevo, duas tiras de faixa de borda, grama em faixas de 1 600 vértices, pilhas de pneus de 132 triângulos numa `InstancedMesh`, o Kart 01 em 27 chamadas) sobre a geometria da versão 2 (asfalto de 691 × 2 vértices, 22 zebras, barreira de 292 vértices); os limites de CHK-TEST-0010-01/-03 passam sobre a versão 2 (`test-validation-20261107-0052.md`) | **H11** no celular (M9): `fpsPerSecond` e `minFps ≥ 30` nas duas orientações; nenhuma execução em desktop vale (I9); o acabamento não é retirado para cumprir — E2E-05 |
| Download comprimido abaixo de 3 MB numa primeira visita com cache vazio (RNF02) | tamanho do bundle: 708 040 bytes brutos, 186 379 gzip (servido em staging, execução 42320960893, `3d5dfdd`; o arquivo de pista da versão 2 são 36 584 bytes brutos dentro do JS); nenhum *asset* além de um JS e um CSS | M3: lista de transferências de rede em 4G real, cache vazio |
| 0 requisições a outro serviço entre a escolha da Kart Park e o fim da volta (NFR-0004) | arquivo de pista empacotado (`?raw`); catálogo e crédito literais; CHK-TEST-0011-02 | **H7** (M11): rede bloqueada depois do carregamento; a escolha, a volta, a zebra, a barreira e o crédito funcionam — E2E-07 |
| HTTPS para os sensores (RNF06, I6) | a inclinação só é ativada com `window.isSecureContext` e `DeviceOrientationEvent`; em iOS pede `requestPermission` | M1: a URL abre com cadeado; "Ativar inclinação" pede permissão e passa a dirigir |
| Carregamento até o kart andar abaixo de 10 s em 4G (RNF01) | bundle único; sem textura nem modelo externo | M2, em rede 4G real, cache vazio |

## Dispositivos de referência

Os aparelhos e navegadores nomeados para NFR-0002 (notebook e celular intermediário, pelo modelo comercial de RNF03) são decisão
do dono do produto e constam de `docs/kart-park-device-log.md` — o arquivo existe desde `1bb63aa` (escrito pelo dono do produto;
o estágio de testes e este não o escrevem, §14), com a execução no celular de 2026-10-30 sobre `e70aad9` (Kart Park versão 1) **sem modelo, navegador
nem versão e sem fps**, e nenhuma entrada sobre o pacote da versão 2 (`index-DszUW7WJ.js`); cada entrada nova segue o molde de `docs/kart-01/device-log.md`, uma por aparelho e orientação (build,
aparelho, navegador, versão, DPR, área de jogo em px, orientação, método da contagem, `fpsPerSecond`, `minFps`, resultado por
roteiro E2E-01 a E2E-09, download, data). As linhas humanas H1–H12 do `runbook.md` são essas entradas; cabem na mesma sessão de aparelho que as linhas pendentes das releases contidas, escolhendo "Pista sintética"
no seletor para aquelas (`98-divergences.md`, DIV-DP-12). Esta release não escolhe aparelhos.
