---
title: Registro de divergências e de critérios não verificados em npm test
feature: modelo-kart-01
stage: test
status: validated
version: 1.2.0
---

# 98 — Divergências

Nenhuma verificação derivada de um critério falha contra a implementação atual: a execução de 2026-10-30 da rodada 4 de testes (`npm test`, totais do próprio runner, `reports/npm-test-latest.log` e `reports/junit-latest.xml`) coletou 443 verificações, 66 delas `CHK-TEST-00nn-nn` desta feature por arquivo (`-model` 20, `-pose` 10, `-camera` 17, `-contract` 19), e todas passaram. As
linhas 19 e 20 de `400 Code/Output/modelo-kart-01/98-divergences.md` (registros `WHEEL_POSITIONS`, `TELEMETRY_WHEEL_POSITIONS`,
`LAYERING`, `RENDER_NEUTRAL`, `SIM_CONTRACT` e `DETERMINISM` em `npm test`) são atendidas por `tests/modelo-kart-01-pose.test.ts` e
`tests/modelo-kart-01-contract.test.ts`; a linha 15 (taxa de quadros nos aparelhos) continua humana, abaixo. As divergências
DIV-23 a DIV-27 de `test-validation-20261030-1453` (marcas por derrapagem, sem cadência, sem jato, sem drift, treino contínuo)
não se reproduzem contra o código da rodada 3: CHK-TEST-0003-16, -0004-06, -17, -18, -19 e -20 passam.

## Divergência de outra feature resolvida nesta rodada (rodada 2, Modo B)

| Id | Origem | Estado | Causa | Resolução | Evidência |
|---|---|---|---|---|---|
| CHK-TEST-0004-13 | `400 Code/Output/pista-kart-park/98-divergences.md`, linha `CHK-TEST-0004-13` | resolved | DES-0003 de `pista-kart-park` acrescenta `barrierTouching` e `barrierContact` a `Telemetry`; `runDiffers` comparava o `State` final inteiro com `finalKart` gravado em `b86b200`, que não tem os dois campos, e reprovava com cada valor gravado idêntico (`lapMs` 29 419 / 43 932 ms) | `runDiffers` compara `finalKart` pelos campos gravados (`recordedFieldsOf`, campo a campo como DM-0001 descreve); a linha de base não foi regravada, porque a janela de DM-0001 só a regrava para outro acerto ou outra pista e aqui `setupVersion` e `trackVersion` são os mesmos (`97-changelog.md`, rodada 2) | `DETERMINISM` `comparedRunCount` 2, `differingRunCount` 0 na execução de 2026-10-27 (296/296); mutação E reprova a verificação com `differingRunCount` 2 na cópia de rascunho; `finalKart.x` + 0,01 e um campo gravado ausente reprovam em memória |

## Interpretação registrada da estratégia (sem verificação reprovada)

| Id | Frase da estratégia | Medido | Como a verificação decide | Motivo |
|---|---|---|---|---|
| AC-US-0002-05 | "a caixa envolvente das quatro rodas tem `min.y` 0 (rodas no chão)" | `min.y` 0,0033 m | CHK-TEST-0001-17: `min.y` arredondado ao centímetro igual a 0, `min.y ≥ 0`, centro de cada roda a um raio do chão (1e-12); valor bruto impresso por `t.diagnostic` | o pneu é um `LatheGeometry` de 14 segmentos sem vértice em −Y (DES-0001 1.1.0; ISSUE-03 info de `code-validation-20261027-1951`); a geometria é a do Cowork, inalterada por decisão do projeto 1.3.0, e RULE-0001 dá toda medida de roda ao centímetro. Não é defeito de código nem tolerância nova. Se o D-Spec quiser a igualdade exata, a frase da estratégia volta ao dspec-loop como feedback; nenhum item de projeto é alterado por este estágio |
| AC-US-0003-04 | "numa sessão real com o fixture de `Input` com `drift` em trechos alternados e aceleração plena (velocidades de 0 a mais de 25 m/s)" | a sessão com `arcade-assistido-v6` chega a ~16 m/s na pista sintética (a reta não dá mais); no `TEST_PAD` aberto, com aceleração plena por 90 s, os acertos param em 19,25 m/s (`arcade-assistido-v6`) e 18,99 m/s (`realista-aluguel-4t-v4`), medido em `test-validation-20261030-1725` | CHK-TEST-0003-04: 62° em todos os quadros da sessão dirigida até a velocidade máxima do acerto (> 15 m/s exigido), e 62° com a pose `moving(25)` a 25 m/s | 25 m/s não é alcançável pela simulação v6 com nenhum acerto publicado; o critério ("a qualquer velocidade") é decidido nas duas faixas, nenhuma afrouxada |
| AC-US-0005-06, AC-US-0005-07 | "`contract` (C), sobre o texto do bloco das marcas de `src/main.ts` … com `>` estrito" e "nenhum estado é forjado para exatamente 6 m/s" | — | CHK-TEST-0004-06, -19, -20 executam o próprio bloco das marcas de `src/main.ts` (transpilado como está, `tyreMarkRunner`) sobre sessões dirigidas e julgam os trechos escritos na `InstancedMesh`; os limites exatos usam uma cópia do passo dirigido com um único campo no limite (`seedLap`), com o controle 6 + 1e-6 / 0,055 + 1e-6 ao lado | pedido da invocação da rodada 4 de testes (decidir pela decisão real com estados dirigidos, não pelo texto); o `>` estrito só se distingue de `>=` no valor exato, que nenhuma condução atinge |

## Critérios retirados do seed (rev 4) e verificações que saíram com eles

| Id | Estado | Decisão do dono do produto | Verificações retiradas | No lugar |
|---|---|---|---|---|
| AC-US-0003-09 | withdrawn | `200 Requirements/220 Input/modelo-kart-01/DOMAIN.md`, 2026-10-29, "Sem efeito de turbo na câmera" (Eduardo Matos) | CHK-TEST-0003-09 | ausência de `baseVerticalFovDeg`/`turboFovDeltaDeg` e 62° com qualquer comando em CHK-TEST-0003-04 (AC-US-0003-04) |
| AC-US-0005-02 | withdrawn | `DOMAIN.md`, 2026-10-29, "Treino contínuo e fim do drift e do turbo" (Eduardo Matos; `DOMAIN/DEC-07`) | CHK-TEST-0001-19, CHK-TEST-0004-05 | CHK-TEST-0001-21 e CHK-TEST-0004-18 (AC-US-0005-05) |
| AC-US-0005-03 | withdrawn | `DOMAIN.md`, 2026-10-29 (`DOMAIN/DEC-07`) e 2026-10-30, "Marcas de pneu sem drift" (Eduardo Matos; `DOMAIN/DEC-09`) | nenhuma: CHK-TEST-0004-06 foi modificada | CHK-TEST-0004-06 (AC-US-0005-06), CHK-TEST-0001-20 e CHK-TEST-0004-17 (AC-US-0005-04) |

## Critérios cuja metade de tela, aparelho, orientação ou navegador só é verificável pelo roteiro registrado

O projeto não tem ferramenta de E2E e a estratégia define os níveis web E2E e mobile E2E como roteiro registrado (`E2E-01` a
`E2E-06` em `test-strategy.md`), gravado por um humano em `docs/kart-01/device-log.md` (criado pela etapa de código com a
execução 1, sem taxa de quadros; este estágio não o escreve: escreve só em `tests/` e em `500 Tests/Output/<feature>/`,
conventions §14). Cada linha abaixo tem a sua regra provada em `npm test` (coluna "Verificado por"); a parte que exige tela,
aparelho ou relógio de parede fica **unverified** até o registro humano. Não é um teste pulado: é um nível sem execução.

| Id | Estado | O que a especificação exige | Verificado por (`npm test`) | Parte não verificada e roteiro que a decide | Quem deve |
|---|---|---|---|---|---|
| AC-US-0001-14 | unverified | todo kart exibido é o Kart 01; o kart provisório não aparece em nenhum quadro, inclusive depois de recarga e de troca de orientação | CHK-TEST-0004-01 (símbolos do kart provisório ausentes de `src/main.ts`, Kart 01 montado e colocado em `kartRoot`), CHK-TEST-0001-11 (duas montagens iguais) | observação na tela antes da largada e em corrida, recarga durante a contagem e a corrida, giro do celular: E2E-01 em desktop e celular | registro humano em `docs/kart-01/device-log.md` |
| AC-US-0001-15 | unverified | o kart projeta sombra no chão, visível junto a ele pela câmera de corrida | CHK-TEST-0001-12 (`castShadow` nas malhas sólidas, não nos decalques), CHK-TEST-0004-02 (`sun.target` segue o kart, caixa de sombra ±60 m) | a sombra vista no chão pela câmera de corrida: E2E-02 | registro humano |
| AC-US-0001-16 | unverified | o número 01 visível na placa do para-choque | CHK-TEST-0001-13 (malha `placaTraseira` com o material da placa), CHK-TEST-0004-03 (`fillText` com `KART01_NUMBER`, decalques pintados) | legibilidade do número na tela: E2E-02 | registro humano |
| AC-US-0002-01 | unverified | rodas dianteiras giradas pelo esterço, observado na tela e no estado | CHK-TEST-0001-14, CHK-TEST-0002-01 | a metade "na tela": E2E-03 | registro humano |
| AC-US-0002-03 | unverified | volante centrado a 0, gira para o lado do esterço e mais com esterço maior, na tela | CHK-TEST-0001-15 | E2E-03 | registro humano |
| AC-US-0002-04 | unverified | mãos sobre o aro em qualquer ângulo, na tela | CHK-TEST-0001-16 | E2E-03 | registro humano |
| AC-US-0002-05 | unverified | kart exibido na posição informada, inclusive na pausa e no primeiro quadro depois do reposicionamento, na tela | CHK-TEST-0001-17, CHK-TEST-0002-04, -05, -06, -07 | E2E-03 (pausa por Esc, troca de aba, sensor coberto; reposicionamento sem deslizamento) | registro humano |
| AC-US-0002-06 | unverified | eixo longitudinal do kart exibido no rumo informado, na tela | CHK-TEST-0001-18, CHK-TEST-0002-07, -08 | E2E-03 | registro humano |
| AC-US-0003-08 | unverified | kart inteiro no quadro numa curva de 90° a 50 km/h, em paisagem e em retrato, na tela | CHK-TEST-0003-08 (projeção dos cantos do modelo pela câmera de corrida em (1280, 720) e (720, 1280)) | a curva vista na tela nas duas formas: E2E-04 no celular e em desktop com janela mais alta que larga | registro humano |
| AC-US-0003-10 | unverified | visão geral da pista inteira antes da contagem, na tela, nas duas formas | CHK-TEST-0003-10, CHK-TEST-0003-14 | pista inteira vista na tela; giro do celular na visão geral: E2E-01 | registro humano |
| AC-US-0003-11 | unverified | descida da câmera durante a contagem sem subir, na tela | CHK-TEST-0003-11 | E2E-01 (contagem observada; pausa e suspensão durante a contagem) | registro humano |
| AC-US-0003-12 | unverified | pose de corrida no quadro do sinal verde, na tela | CHK-TEST-0003-12 | E2E-01 | registro humano |
| AC-US-0003-13 | unverified | câmera atrás do kart parado com o painel de resultado exibido até a próxima visão geral, na tela | CHK-TEST-0003-01, -02, -03, -13, -14 (quadros `ENDED` por conclusão e por reposicionamento; nova volta a partir de `ENDED`) | painel de resultado sobre a cena sem movê-la; "nova volta": E2E-02 | registro humano |
| AC-US-0003-14 | unverified | no treino, depois do fim de uma volta (válida, invalidada ou com reposicionamento), câmera na pose de corrida atrás do kart em movimento, na tela | CHK-TEST-0003-15, CHK-TEST-0003-16, CHK-TEST-0003-18 (treino contínuo: duas voltas fechadas, a segunda invalidada por corte e com reposicionamento, mais 120 passos) | a câmera vista na tela seguindo o kart depois da linha de chegada do treino: E2E-02 | registro humano |
| AC-US-0004-01 | unverified | pelo menos 60 fps sustentados numa volta completa no notebook de referência de RNF03, com o Kart 01, a sombra e a câmera de corrida | nenhuma verificação de `npm test` decide taxa de quadros (I9: só em aparelho nomeado); o custo é limitado por CHK-TEST-0001-09 (27 chamadas, 5 128 triângulos) | E2E-06 no notebook nomeado: `fpsPerSecond` e `minFps` ≥ 60 | registro humano em `docs/kart-01/device-log.md` (execução 1 marca "não medido") |
| AC-US-0004-02 | unverified | pelo menos 30 fps sustentados no celular intermediário de referência, paisagem e retrato | idem | E2E-06 no celular nomeado, nas duas orientações; nenhuma execução em desktop vale | registro humano |
| AC-US-0005-01 | unverified | cada trecho novo de marca nasce sob o pneu traseiro exibido do seu lado, na tela | CHK-TEST-0002-09, -10 (`wheelPositions` como fonte; rodas traseiras do modelo a 3 cm por dentro), CHK-TEST-0004-04, CHK-TEST-0004-06 (cada trecho termina sob a roda traseira do seu lado, a partir de `wheelPositions`) | a marca vista sob o pneu exibido (a diferença de 3 cm de `DOMAIN/DEC-02` decidida na tela); trechos antigos parados; nenhum trecho na pausa: E2E-05 | registro humano |
| AC-US-0005-04 | unverified | nenhuma indicação de drift junto ao kart exibido, antes da largada e em corrida, com qualquer comando, na tela | CHK-TEST-0001-20 (raiz do modelo só com os 16 grupos), CHK-TEST-0004-17 (nada preso a `kartRoot` além do modelo; filhos da cena; sem `.drifting`/`maneuvers`; página sem drift) | E2E-05 na tela, com todos os comandos | registro humano |
| AC-US-0005-05 | unverified | nenhuma fumaça ou chama de turbo no escapamento, antes da largada e em corrida, com qualquer comando, na tela | CHK-TEST-0001-21 (`anchors` só `bumperPlate`, sem `escapamentoSaida`), CHK-TEST-0004-18 (sem jato, cone, `exhaust`, `boost`, `turbo`) | E2E-05 na tela, com todos os comandos | registro humano |
| AC-US-0005-06 | unverified | trecho novo sob cada pneu traseiro em cada quadro com passo novo, volta em andamento, > 6 m/s e > 0,055 rad, na tela | CHK-TEST-0004-06 (o bloco das marcas de `src/main.ts` executado sobre 6 000 passos dirigidos em quadros de 0 a 3 passos, os dois lados de cada limite e da derrapagem) | os trechos vistos na tela ao escorregar de lado: E2E-05 | registro humano |
| AC-US-0005-07 | unverified | nenhum trecho novo sem passo novo, fora de `RUNNING`, a 6 m/s ou menos ou a 0,055 rad ou menos, com qualquer comando, na tela | CHK-TEST-0004-06, CHK-TEST-0004-19 (limites exatos; quadro sem passo), CHK-TEST-0004-20 (contagem, pausa, fim pelo jogador, fim por reposicionamento, fim da volta oficial, sem volta) | nenhum trecho na reta, na visão geral, na contagem, na pausa e depois do fim da volta oficial, na tela: E2E-05 | registro humano |
| NFR-0001 | unverified | taxa de quadros sustentada por segundo da volta, notebook e celular (paisagem e retrato) | nenhuma (I9) | E2E-06, `minFps` por aparelho e orientação | registro humano |
| NFR-0002 | unverified | menos de 3 MB comprimidos numa primeira visita com cache vazio | nenhuma em `npm test`; o build desta rodada mede 642 759 bytes sem compressão (`01-implementation.md` do código) | E2E-06: lista de transferências de rede do navegador | registro humano |
| NFR-0006 (linha 1) | unverified | 0 linhas alteradas em `src/physics.ts`, `src/lap.ts`, `src/track.ts` e nos presets | CHK-TEST-0004-11 (`SIM_CONTRACT`: `STEP`, linha e faixas de `Input`, medidas), CHK-TEST-0004-13 (`DETERMINISM` sobre as duas execuções de referência) | a diferença do repositório em si é registrada pelo manifesto da etapa de código (D-CD-01) e conferida pelo validador de código (mtime anterior à feature) | revisão de código |

Nenhuma linha acima contribui para o veredito deste estágio (conventions §6); cada uma permanece aberta até a execução
registrada, que é uma decisão humana e não uma verificação pulada.
