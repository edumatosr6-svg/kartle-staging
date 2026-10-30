---
id: REL-0004
title: Canal web-mobile — a mesma página nas duas formas, sem loja, sem assinatura, sem versão mínima instalada
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.1.0
sources: [DES-0003, DES-0004, DES-0005, DM-0001, NFR-0001, NFR-0002, NFR-0004, TEST-0003]
---

# REL-0004 — Canal `web-mobile`

## Não há aplicativo nativo

O produto não tem aplicativo nativo e deliberadamente não terá (I10). O canal `web-mobile` é **a mesma página** do canal
`web-desktop`, aberta no navegador do celular, com inclinação ou toque no lugar do teclado. Esta feature não muda isso — mas é a
primeira cujo comportamento **depende da forma da área de jogo** (paisagem ou retrato), por isso o celular tem linhas próprias:

| Item do estágio | Nesta release |
|---|---|
| Build móvel | o mesmo `dist/` (`01-release.md`); nenhum build separado |
| Assinatura | não se aplica; a única assinatura é o certificado HTTPS de `*.github.io` (RNF06) |
| Submissão a loja | não se aplica |
| Versão mínima suportada | não há versão instalada: o cliente é sempre a página servida. Navegadores de referência: Chrome, Edge, Firefox e Safari nas versões atuais (`test-strategy.md`); a placa exige contexto canvas 2D |
| Atualização forçada | não se aplica; a janela de coexistência é a do cache do `index.html` (`REL-0003`) |

## O que é específico do celular nesta feature e precisa ser observado

| Requisito | Onde o código depende disso | Como se observa (`smoke.md`, canal `web-mobile`; `runbook.md`, linhas H) |
|---|---|---|
| Forma da área de jogo lida **por quadro** e campo de visão de retrato: `PORTRAIT` quando a altura é maior que a largura; vertical `max(62°, 2·atan(tan 30° / aspect))` para dar **60° horizontais mínimos** (9:16 → 91,5°; 3:4 → 75,2°); a nova forma vale no quadro seguinte à troca de orientação; **nenhum comando muda o campo de visão** (o +4° de turbo saiu no seed rev 3; DES-0003 2.0.0; RULE-0002) | `src/gameCamera.ts` (`viewShapeOf`, `shapeVerticalFovDeg`, `computeCameraView` sem entrada de turbo); `src/main.ts` (largura e altura lidas no quadro); provado em `npm test` em (1280, 720) e (720, 1280) (`CHK-TEST-0003-04`, `-08`) | **H4** no celular: numa curva de 90° a ≈ 50 km/h, em paisagem e em retrato, o kart com o piloto inteiro no quadro; tocar e inclinar com todos os comandos: o campo de visão não muda; girar o celular: a pose não muda e o campo de visão da nova forma vale no quadro seguinte — E2E-04 |
| Visão geral da pista inteira nas duas formas; margem ≥ 5 % (AC-US-0003-10) | `trackOverviewPose` com `trackBoundsOf` projetado nas cinco áreas de jogo de referência (`CHK-TEST-0003-10`, `-14`) | **H1** no celular: girar o celular na visão geral — pista inteira na nova forma — E2E-01 |
| Kart 01 em todo quadro, inclusive depois de recarga e de troca de orientação (AC-US-0001-14) | `kartRoot` montado uma vez em `src/main.ts`; nenhum caminho de código desenha o kart provisório (`CHK-TEST-0004-01`) | **H1** no celular: recarregar durante a contagem e a corrida; girar o celular — E2E-01 |
| Marcas de pneu pela inclinação: com o kart escorregando de lado acima de 6 m/s numa curva forte, trechos sob os pneus traseiros; nenhum na reta nem na pausa por sensor coberto (AC-US-0005-06, -07) | bloco das marcas de `src/main.ts` (telemetria; não depende do adaptador de entrada) — `CHK-TEST-0004-06`, `-19`, `-20` | **H5** no celular — E2E-05 |
| Inclinação como entrada: rodas dianteiras e volante giram com o esterço do sensor; cobrir o sensor pausa e congela kart, rodas, câmera e marcas (AC-US-0002-01, -05) | `getKartPose(lap.kart)` lê o estado do passo; `pauseLap` → dois quadros iguais (`CHK-TEST-0002-05`); a inclinação só muda o adaptador de entrada (release anterior) | **H3** no celular — E2E-03 |
| 30 fps sustentados numa volta completa em celular intermediário, **paisagem e retrato**, com o Kart 01, a sombra (caixa ±60 m, `sun.target` por quadro) e a câmera de corrida (NFR-0001, AC-US-0004-02) | custo limitado por projeto: 27 malhas, 27 chamadas de desenho, 5 128 triângulos (`DRAW_COST`, NFR-0004; limite 30 chamadas) | **H6** no celular: `fpsPerSecond` e `minFps ≥ 30` nas duas orientações; nenhuma execução em desktop vale (I9) — E2E-06 |
| Download comprimido abaixo de 3 MB numa primeira visita com cache vazio (NFR-0002) | tamanho do bundle: 711 561 bytes brutos, 188 918 gzip (build limpo de `6b314b2`; 6,0 % do limite) | **H6** e M3: lista de transferências de rede em 4G real, cache vazio |
| HTTPS para os sensores (RNF06, I6) | a inclinação só é ativada com `window.isSecureContext` e `DeviceOrientationEvent`; em iOS pede `requestPermission` | M1: a URL abre com cadeado; "Ativar inclinação" pede permissão e passa a dirigir |
| Carregamento até o kart andar abaixo de 10 s em 4G (RNF01) | bundle único; sem textura nem modelo externo (NFR-0003) | M2, em rede 4G real, cache vazio |

## Dispositivos de referência

Os aparelhos e navegadores nomeados para NFR-0001 (notebook e celular intermediário, pelo modelo comercial) são decisão do dono do
produto e constam de `docs/kart-01/device-log.md` — o arquivo **existe** (DM-0001, seção 2; criado pela etapa de código com a
execução 1 no navegador embutido, paisagem, sem taxa de quadros) e a seção *Execuções nos aparelhos de referência* diz **"Não
executadas"**: notebook (60 fps, paisagem) e celular (30 fps, paisagem e retrato), uma entrada cada, com `fpsPerSecond` de uma
volta completa em corrida, aba em primeiro plano, sem pausa, e `minFps`. As linhas humanas H1–H6 do `runbook.md` são essas
entradas, sobre `index-BwruE9Pq.js`; cabem na mesma sessão de aparelho que as portas humanas da `dirigibilidade`, da
`race-lap-validation` e da `pista-kart-park`, porque o bundle servido em staging é um só (`98-divergences.md`, DIV-DP-12). Esta release não escolhe aparelhos.
