---
id: REL-0004
title: Canal web-mobile — a mesma página; vibração da zebra, inclinação negada e navegador sem vibração
feature: pista-kart-park
stage: deploy
status: validated
version: 1.0.0
sources: [DES-0007, DES-0008, DES-0009, DES-0012, DM-0002, NFR-0002, NFR-0004, NFR-0005, TEST-0008, TEST-0009]
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
| Vibração de **20 ms** a cada **0,25 s** (30 passos de simulação) enquanto houver roda na zebra, só no canal `web-mobile` com `navigator.vibrate`; nenhum pulso fora da zebra nem com a volta pausada (AC-US-0005-07, -08; DES-0009) | `src/curbFeedback.ts:5-9` (`CURB_PULSE_MS` 20, `CURB_PULSE_INTERVAL_STEPS` 30; `decideCurbFeedback` por passo, pura); `src/main.ts:178` (`vibrationAvailable`), `:515` (`navigator.vibrate(CURB_PULSE_MS)` só com `feedback.pulse`); provado em `npm test` por CHK-TEST-0008-01, -02, -06, -08 | **H4** no celular (M7): sentir o pulso curto repetido com a roda na zebra; nenhum na reta, nenhum na pausa — E2E-05 |
| Navegador sem `navigator.vibrate`: a volta decorre igual, sem erro e sem aviso; o mesmo registro de repetições (REQ-FEAT-0005-16..19) | `vibrationAvailable` falso → `decideCurbFeedback` nunca devolve `pulse`; nenhum `try`/aviso (CHK-TEST-0008-06) | **H5** (M8): volta com zebras num navegador sem vibração (Safari no iOS, ou Chrome com a vibração desligada no sistema) — E2E-06 |
| Seletor com as duas opções e crédito OSM/ODbL com link nas duas telas, em paisagem e em retrato (AC-US-0001-01; AC-US-0006-01..06; NFR-0005) | `src/main.ts:259-269` (`renderOffer` com o seletor e `renderCredit`), `:465` (crédito no resultado); `index.html` `#track-selector`, `#track-credit`, `#lap-result-credit`; `src/style.css:8` | **H5** (M4, M10): os três elementos visíveis nas duas telas; o link abre `openstreetmap.org/copyright` em outra aba — E2E-05 |
| Inclinação negada: o toque assume com o aviso, e o seletor e a pista ficam como estavam (REQ-FEAT-0001-13) | comportamento de `race-lap-validation`, inalterado; o seletor é independente da entrada | **H5** (M6) — E2E-05 |
| Asfalto de larguras variáveis, zebras no lado declarado e barreira em todo o comprimento, desenhados sobre a cena do Kart 01 (AC-US-0002-08, AC-US-0005-03, AC-US-0004-06) | `src/trackScene.ts` (uma malha de asfalto, uma de zebras, 381 instâncias de barreira, linha de largada); custo de desenho limitado por CHK-TEST-0010-01/-03 | M12 e **H3** no celular — E2E-05 |
| 30 fps sustentados numa volta completa na Kart Park, **paisagem e retrato**, com zebras e barreira na tela (NFR-0002) | custo de desenho: uma malha de asfalto (684 × 2 vértices), uma de zebras, 381 instâncias de uma caixa, o Kart 01 (27 chamadas) | **H6** no celular (M9): `fpsPerSecond` e `minFps ≥ 30` nas duas orientações; nenhuma execução em desktop vale (I9) — E2E-05 |
| Download comprimido abaixo de 3 MB numa primeira visita com cache vazio (RNF02) | tamanho do bundle: 713 321 bytes brutos, 189 855 gzip (+9,8 % contra a release anterior; o arquivo de pista são 43 012 bytes brutos dentro do JS) | M3: lista de transferências de rede em 4G real, cache vazio |
| 0 requisições a outro serviço entre a escolha da Kart Park e o fim da volta (NFR-0004) | arquivo de pista empacotado (`?raw`); catálogo e crédito literais; CHK-TEST-0011-02 | **H7** (M11): rede bloqueada depois do carregamento; a escolha, a volta, a zebra, a barreira e o crédito funcionam — E2E-07 |
| HTTPS para os sensores (RNF06, I6) | a inclinação só é ativada com `window.isSecureContext` e `DeviceOrientationEvent`; em iOS pede `requestPermission` | M1: a URL abre com cadeado; "Ativar inclinação" pede permissão e passa a dirigir |
| Carregamento até o kart andar abaixo de 10 s em 4G (RNF01) | bundle único; sem textura nem modelo externo | M2, em rede 4G real, cache vazio |

## Dispositivos de referência

Os aparelhos e navegadores nomeados para NFR-0002 (notebook e celular intermediário, pelo modelo comercial de RNF03) são decisão
do dono do produto e constam de `docs/kart-park-device-log.md` — o arquivo **não existe** (a estratégia de testes o nomeia; o
estágio de testes e este não o criam, §14): o dono do produto o cria no molde de `docs/kart-01/device-log.md`, com uma entrada
por aparelho e orientação (build, aparelho, navegador, versão, DPR, área de jogo em px, orientação, método da contagem,
`fpsPerSecond`, `minFps`, resultado por roteiro E2E-01 a E2E-08, download, data). As linhas humanas H1–H8 do `runbook.md` são
essas entradas; cabem na mesma sessão de aparelho que as linhas pendentes das releases contidas, escolhendo "Pista sintética"
no seletor para aquelas (`98-divergences.md`, DIV-DP-12). Esta release não escolhe aparelhos.
