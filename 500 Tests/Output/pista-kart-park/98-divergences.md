---
title: Registro de divergências, verificação reprovada e critérios não verificados em npm test
feature: pista-kart-park
stage: test
status: validated
version: 1.2.0
---

# 98 — Divergências

A execução de 2026-10-30, depois da rodada 4 do código (`38354bb`) (`npx tsx --test tests/*.test.ts`, totais do próprio runner em `reports/npm-test-latest.log` e
`reports/junit-latest.xml`) coletou 444 verificações, todas aprovadas; as 103 `CHK-TEST-00nn-nn` desta feature estão entre elas.
A linha 12 de `400 Code/Output/pista-kart-park/98-divergences.md` (verificações de `npm test` na Kart Park: determinismo,
camadas, critérios de US-0002 a US-0005) é atendida por `tests/pista-kart-park-*.test.ts`; a linha 13 (promoção) continua da
etapa de deploy, com a regra provada em CHK-TEST-0012-04.

## Verificação que reprovou na rodada 1 e passa desde a correção do código (não enfraquecida, D-TS-07)

| Id | Critério | Estado | O que a verificação exige | Medido | Causa no código | Encaminhamento |
|---|---|---|---|---|---|---|
| CHK-TEST-0004-03 | AC-US-0004-04 (DES-0003, "a 5, 10, 20, 30, 34,5, 60 e 200 m/s ... nunca termina um passo do outro lado") | passing | kart lançado contra o segmento 217 da barreira publicada, dos dois lados, a 60 e 200 m/s, a 90° e 30°, sem cruzar nenhum segmento de barreira em nenhum passo | 0 cruzamentos nos 8 lançamentos desde a correção (execuções de 2026-10-27 20:32 e de 2026-10-30) | rodada 1: o ramo do trajeto de `barrierContactPoint` usava a normal do lado oposto ao de partida; corrigido em `src/physics.ts:372` (`startSideNormal` aponta para o lado de `s`, commit 1a12076, FAIL-01 da validação de testes de 2026-10-27 23:07) | nenhum: a verificação ficou como foi escrita e passa |

## Interpretações registradas (nenhuma verificação reprovada)

| Id | Frase da estratégia ou do projeto | Como a verificação decide | Motivo |
|---|---|---|---|
| AC-US-0004-05 | "num ambiente todo de grama com a barreira da Kart Park e noutro todo de grama com o muro ... posição e velocidade no referencial local do obstáculo são iguais (1e-9) a cada passo desde o passo com `barrierContact`" (DES-0003) | CHK-TEST-0004-04 compara, passo a passo e a 1e-9 em posição normal/tangencial, velocidade normal/tangencial, `yawRate`, rumo e `speed`, uma **barreira reta de 2 pontos na grama de uma geometria construída com a linha central e as zebras do arquivo** contra o muro sintético no trecho 95 (lado externo), do passo do contato aos 10 seguintes em 24 lançamentos (2 lados × 90°, 60°, 45°, 30° × 10, 20, 30 m/s) e aos 60 seguintes a 90°; CHK-TEST-0004-02 e -05 provam na barreira publicada o contato, a perda de velocidade e a semântica de `barrierContact` | A barreira publicada é uma poligonal em zigue-zague na escala de 0,1 m: entre os vértices 209 e 224 os segmentos medem 0,04–0,18 m e a direção de cada um desvia até 87° da direção média (medido no teste de rascunho). A normal de contato é a do segmento cruzado, não a da linha média, e o muro sintético é um polígono de 240 facetas (1,5° por faceta): a igualdade a 1e-9 passo a passo só é definida para dois obstáculos localmente iguais. A barreira reta exercita o **mesmo bloco** de `src/physics.ts` (qualquer `environment.track` com barreiras) e torna a igualdade exata (medido: ≤ 6e-13 em todos os lançamentos nos 10 passos; a 90° ≤ 3e-13 em 60 passos). Com a barreira publicada e a normal média os desvios medidos são de 1e-2 m/s (zigue-zague), não defeito de resposta |
| — (observação para o projeto) | DES-0010 passo 5 / DES-0011 V13–V15 | nenhuma verificação reprova: V13–V15 passam e CHK-TEST-0001-11/-12/-13 confirmam a separação, a folga ≤ 6 m e a grama | A poligonal da barreira (382 vértices, 53,29 m) resulta da amostragem das duas bordas a 0,25 m e dos pontos médios: a direção dos segmentos alterna a cada vértice. Em jogo, a normal de contato muda a cada 0,1 m e o kart pode ricochetear em ângulos inesperados. Fica como feedback para o D-Spec (suavizar ou simplificar a poligonal antes de publicar, numa versão nova), não como reprovação |
| AC-US-0004-01 | "em todo ponto em que a grama entre as bordas ... mede 6 m ou menos" | CHK-TEST-0001-11 usa a definição de V13: trechos pelos índices cuja `d_o` está em 371–414 e 580–615, bordas amostradas a 0,25 m, par com o ponto mais próximo das bordas do outro trecho, nos dois sentidos; "separado" é cruzar **ou tocar a 0,002 m** um segmento de barreira | um par na extremidade do trecho (19,36; −45,99) → (17,18; −46,05), a 2,18 m, passa a 0,002 m da ponta da barreira (18,273; −46,022): é a tolerância do arredondamento a 0,001 m que o projeto declara ("cruza (ou toca)"), e o teste de rascunho mostrou 376 pares, como o validador de código |
| AC-US-0003-04 | "no máximo 25 m" | CHK-TEST-0001-10 afirma espaçamento ≤ 25 m, pelo menos ⌈L/25⌉ marcadores e ordem; não fixa 38 | a contagem (38 a 17,95 m) é escolha do preparo (`MARKER_TARGET_SPACING_M` 18), não critério; fixá-la pinaria a versão publicada |
| AC-US-0003-02 | "o ponto ... cuja distância de volta, medida na linha central original ... é a mais próxima de 201,6 m, de 350,3 m e de 529,9 m" | CHK-TEST-0001-09: o índice que minimiza \|d_o(i) − D_k\| na origem convertida pelo teste e o cruzamento do limite a ≤ 0,01 m da distância publicada desse ponto (199,394 / 347,042 / 525,650 m) | o alvo é medido na linha original e o ponto é lido na publicada, como o critério diz; os valores publicados (≈ 2 m abaixo dos alvos) são a consequência de 682,116 m contra 687,52 m da origem, registrada em `01-implementation.md` |
| AC-US-0006-09 | "nenhuma tela exibe o recorde de 41,45 s" | CHK-TEST-0009-07 e CHK-TEST-0001-16 proíbem `41,45`, `41.45`, `41450`, `00:41`, `KARTPLAN`, `recorde:`, `recordeMs` nos textos de tela e nos módulos, e também `recorde` no arquivo publicado; a palavra `recorde` sozinha é aceita em `index.html` | `index.html` traz o texto de marketing do jogo ("O próximo recorde é seu", "Seu próximo recorde começa na curva") desde antes da feature; o critério é sobre o recorde da pista real |
| AC-US-0005-06 | "`tireForce(..., 'curb', acerto).capacity` igual a 0,85 da de `'asphalt'`" e "stepping the simulation" | CHK-TEST-0003-01 (função pura, 1e-12) e CHK-TEST-0003-02: no passo integrado o atrito recuperado de `capacity/(carga × (550/carga)^0,12)` por roda é 0,85 do asfalto a 1e-9; a razão bruta das capacidades no mesmo passo é 0,85 ± 0,01 (0,849993 medido) | as cargas por roda divergem nos subpassos seguintes ao primeiro (transferência de carga), o que a capacidade carrega; a razão dos atritos é exata |

## Critérios cuja metade de tela, aparelho, som, vibração, navegador ou rede só é verificável pelo roteiro registrado

O projeto não tem ferramenta de E2E e a estratégia define os níveis web E2E e mobile E2E como roteiro registrado (`E2E-01` a
`E2E-08` em `test-strategy.md`). O arquivo que a estratégia nomeia, `docs/kart-park-device-log.md`, e a variante
`docs/kart-park/device-log.md` **não existem**; este estágio não os cria (escreve só em `tests/` e em
`500 Tests/Output/<feature>/`, conventions §14). A etapa de deploy nomeia o registro no aparelho e o roteiro é executado por um
humano. Cada linha abaixo tem a sua regra provada em `npm test` (coluna "Verificado por"); a parte que exige tela, aparelho, som,
vibração, rede do navegador ou relógio de parede fica **unverified** até o registro. Não é um teste pulado: é um nível sem execução.

| Id | Estado | O que a especificação exige | Verificado por (`npm test`) | Parte não verificada e roteiro que a decide | Quem deve |
|---|---|---|---|---|---|
| AC-US-0001-01 | unverified | o seletor da tela inicial oferece as duas opções | CHK-TEST-0007-01 (catálogo), CHK-TEST-0009-08 (um botão por opção) | as duas opções vistas na tela nos quatro navegadores e no celular: E2E-01, E2E-05 | registro humano em `docs/kart-park-device-log.md` |
| AC-US-0001-02 | unverified | ao abrir o jogo a Kart Park está selecionada | CHK-TEST-0007-02, CHK-TEST-0009-08 (`chooseTrack(OPENING_TRACK_ID)`) | recarregar depois de escolher a sintética volta à Kart Park; painel de armazenamento da origem vazio: E2E-01 | registro humano |
| AC-US-0001-05 | unverified | nenhum registro de desafio diário persistido depois de uma volta | CHK-TEST-0007-05 (voltas só `TRAINING`, nunca oficiais), CHK-TEST-0011-02 (nenhum módulo usa armazenamento) | armazenamento do navegador vazio depois de voltas nas duas pistas: E2E-01 | registro humano |
| AC-US-0002-08 | unverified | o asfalto desenhado com as larguras do arquivo | CHK-TEST-0002-01, CHK-TEST-0010-01 (vértices do asfalto = bordas do arquivo) | asfalto com larguras variáveis visto na tela: E2E-03 | registro humano |
| AC-US-0003-06 | unverified | a tela exibe "marcador pulado" | CHK-TEST-0005-03 (`describeTrainingResult` do item de `listLapResults`), CHK-TEST-0009-09 (título do resultado com a razão) | o texto visto na tela de resultado: E2E-03 | registro humano |
| AC-US-0003-11 | unverified | a tela de resultado exibe o tempo total e os 4 setores | CHK-TEST-0005-02 (resultado com `lapMs` e 4 `sectorMs`, formato) | a tela de resultado, perda de foco e recarga: E2E-03 | registro humano |
| AC-US-0004-06 | unverified | a barreira desenhada em todo o comprimento | CHK-TEST-0010-03 (381 instâncias somando 53,29 m) | a barreira vista na tela ao longo dos trechos: E2E-03 | registro humano |
| AC-US-0005-03 | unverified | cada zebra desenhada no lado declarado | CHK-TEST-0010-02 (toda faixa do lado do seu trecho, 34 trechos desenhados) | as zebras vistas na tela: E2E-03 | registro humano |
| AC-US-0005-07 | unverified | o aparelho vibra 20 ms a cada 0,25 s com roda na zebra | CHK-TEST-0008-01, -06 (decisão por passo), CHK-TEST-0008-08 (`navigator.vibrate(CURB_PULSE_MS)` só com `feedback.pulse`) | a vibração sentida no celular de referência, nenhuma fora da zebra ou em pausa: E2E-05 | registro humano (celular intermediário de RNF03) |
| AC-US-0005-08 | unverified | nenhum pulso novo sem roda na zebra | CHK-TEST-0008-02 | idem: E2E-05 | registro humano |
| AC-US-0005-09 | unverified | o som da zebra repetido com roda na zebra | CHK-TEST-0008-03, -06, -07 (nós criados por `curb()`), -08 | o som ouvido em Chrome e Firefox, nenhum fora da zebra: E2E-04 | registro humano |
| AC-US-0005-10 | unverified | nenhuma repetição sem roda na zebra | CHK-TEST-0008-04 | E2E-04 | registro humano |
| AC-US-0005-11 | unverified | som desligado, nenhum som | CHK-TEST-0008-05, -07 (`curb()` sem nó com o som desligado) | E2E-04 | registro humano |
| AC-US-0005-12 | unverified | o som da zebra distinto dos outros | CHK-TEST-0008-07 (fonte de ruído filtrada a 160 Hz; motor `triangle`; recompensa `sine`) | distinguível ao ouvido: E2E-04 | registro humano |
| AC-US-0006-01 a AC-US-0006-06 | unverified | crédito, menção e link nas duas telas | CHK-TEST-0009-01 a -04 (textos, `href`, os dois `renderCredit`, o crédito como último filho de `#lap-training-result`), CHK-TEST-0009-11 (resultado da sintética sem crédito, da Kart Park com ele) | os três elementos vistos nas duas telas nos dois canais; o clique abre `https://openstreetmap.org/copyright`; sintética sem crédito: E2E-01, E2E-03, E2E-05 | registro humano |
| AC-US-0006-07, AC-US-0006-08 | unverified | nome e "687 m" em toda tela que mostra a Kart Park | CHK-TEST-0007-11, CHK-TEST-0009-05, -06 | o rótulo visto no seletor e na etiqueta da pista; navegador em inglês com o nome em português: E2E-01, E2E-08 | registro humano |
| NFR-0002 | unverified | 60 fps no notebook e 30 fps no celular de referência numa volta completa | nenhuma (I9: só em aparelho nomeado); o custo do desenho é limitado por CHK-TEST-0010-01/-03 (uma malha de asfalto, uma de zebras, 381 instâncias) | medidor de quadros do navegador numa volta completa: E2E-03 (notebook), E2E-05 (celular, paisagem e retrato) | registro humano |
| NFR-0004 | unverified | 0 requisições a outros serviços da escolha ao fim da volta | CHK-TEST-0011-02 (nenhum símbolo de rede; arquivo empacotado como `?raw`) | registro de rede do navegador com a rede bloqueada depois do carregamento: E2E-07 | registro humano |
| NFR-0005 | unverified | os 3 elementos do crédito nas 2 telas | CHK-TEST-0009-01 a -04 | inspeção das duas telas em cada canal: E2E-01, E2E-03, E2E-05 | registro humano |
| NFR-0012 (segunda linha) | n/a | crédito da Esri junto ao OSM depois da liberação | CHK-TEST-0012-04 (promoção exige `--esri-decision`; registro em `STAGING`) | só existe depois da decisão registrada em `DOMAIN.md`; E2E da entrega que promover (REQ-FEAT-0006-14) | dono do produto, etapa de deploy |
| REQ-FEAT-0001-13 | unverified | inclinação negada: toque com o aviso, seletor e pista inalterados | nenhuma nova (comportamento de `race-lap-validation`, inalterado) | E2E-05 | registro humano |
| REQ-FEAT-0007-12, NFR-0011 | n/a | código só depois da entrega de `dirigibilidade` | nenhuma: o estágio não executa `git`; o manifesto da etapa de código registra `6ea3862` descendente de `b86b200` | — | manifesto de código (registrado) |
