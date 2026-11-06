---
title: Registro de mudanças — pista Kart Park
feature: pista-kart-park
stage: dspec
status: validated
version: 1.7.0
sources: []
---

# Registro de mudanças

## 2026-10-22 — rodada 1, Mode A

**O que mudou**

- Conjunto gerado do zero a partir do F-Spec validado de `300 Specs/320 F-Specs/Output/pista-kart-park/`
  (FEAT-0001 a FEAT-0007 com 101 `REQ-*`, API-0001 a API-0003, FLOW-0001 a FLOW-0003, SCR-0001 a SCR-0003,
  RULE-0001 a RULE-0005; validação `fspec-validation-20261022-1522`, SUCCESS; seed `revision: 1`), das
  diretrizes de `300 Specs/330 D-Specs/Input/domain-directives.md` e da árvore de código na raiz do repositório
  (commit `ac84352` mais a rodada de código 1 de `dirigibilidade`, não commitada), lida só para posicionamento.
- `01-architecture.md`, `test-strategy.md`, `98-divergences.md` (13 linhas abertas); doze itens de projeto:
  `core/DES-0001` a `DES-0006` (leitor do esquema 3, geometria do arquivo, superfície, zebra e barreira na
  física, volta na Kart Park, sessão de treino, invariantes e ordem de entrega), `web/DES-0007` a `DES-0009`
  (tela inicial e resultado, desenho, retorno da zebra), `pipeline/DES-0010` e `DES-0011` (preparo offline,
  verificações, registro e promoção), `security/DES-0012`; dois modelos de dado (`data/DM-0001` arquivo em
  esquema 3, `data/DM-0002` registro de publicação e estado em memória); seis ADRs (`adr/ADR-0001` a
  `ADR-0006`).
- Todo `REQ-*` do F-Spec é realizado por ao menos um item; os contratos API-0001, API-0002 e API-0003 são
  servidos por DES-0001 e DM-0001, DES-0005 e DES-0003, campo a campo.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.

**Decisões do autor para esta execução, aplicadas**

- Seed revisado pelo dono do produto em 2026-10-22, decisões fechadas em `DOMAIN.md`, todo número medido: os
  números do projeto vêm do F-Spec, sem nova medição; os valores que o F-Spec deixou ao D-Spec são constantes
  de projeto com o motivo em ADR-0006, e a evidência por versão publicada fica no registro (`prep`).
- A licença Esri bloqueia só a promoção para produção: ADR-0005, DES-0011 (`promote` exige a referência da
  decisão), DES-0012; nenhuma etapa de especificação nem a publicação em staging é bloqueada.
- O código desta feature só começa depois que `dirigibilidade` passar nos testes: a dependência está em
  `01-architecture.md` ("Ordem de entrega"), com a lista exata dos arquivos que cada feature altera ou congela,
  e em DES-0006 (hash do commit de entrega no manifesto da etapa de código e verificação de ancestralidade).
  `dirigibilidade` congela `src/lap.ts` e `src/track.ts` (NFR-0008 daquela feature) e o dado de pista; este
  projeto altera `src/lap.ts` e `src/trackData.ts` e não altera `src/track.ts`.
- Código na raiz do repositório: todos os caminhos são relativos a ela (`src/`, `scripts/`, `tests/`,
  `index.html`, mais `tracks/` para o dado do preparo offline).
- A pista sintética continua a pista dos ensaios automáticos: o arquivo dela não muda (versão 2) e DES-0006
  verifica que nenhum teste ou bench de `race-lap-validation` e de `dirigibilidade` passa a citar a Kart Park.

**Decisões de projeto registradas**

- Esquema 3 com `TRACK_SCHEMA_VERSION` 3 e consistência própria da versão 3 sobre a geometria do arquivo (C6 v3:
  pontas na grama; C7 v3: largada depois da chegada, sem os 2 m), porque a largada que REQ-FEAT-0002-06 exige
  fica a cerca de 0,5 m da chegada e a versão 3 não tem muro (ADR-0001).
- Preparo offline em TypeScript sob `scripts/` em vez de Python: as verificações V01 a V18 têm de rodar em
  `npm test` e usam as mesmas definições geométricas que a simulação (ADR-0002). Arquivo publicado empacotado
  como texto (`?raw`), sem `fetch`.
- Barreira com 0,1 m de meia espessura de contato e teste no trajeto do subpasso, com a resposta do muro
  repetida sem alterar o bloco do muro (ADR-0003).
- Zebra como terceira superfície, com as expressões da pista sintética mantidas bit a bit (ADR-0004).
- Nenhuma chave de configuração; produção bloqueada na promoção (ADR-0005).
- O rótulo `.track-label` passa a mostrar o nome da pista da sessão (`#track-name`), porque o texto fixo
  "Circuito Aurora" nomearia errado a Kart Park; com a pista sintética ele mostra "Pista sintética", o
  `displayName` do catálogo de API-0002 (REQ-FEAT-0006-07, -08 regem o texto quando a Kart Park é a pista).
- Reposicionamento na Kart Park sobre a linha central do arquivo (REQ-FEAT-0002-12), em vez da linha central
  sintética que `src/lap.ts:154-161` usa hoje.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira geração).

**Itens recusados ou não aplicados, com motivo**

- Feedback a `race-lap-validation` sobre `tests/race-lap-validation-track-data.test.ts:20-21` (CHK-TEST-0009-02)
  e `:24-30` (CHK-TEST-0009-03), que afirmam o literal 2 e usam a versão 3 como "posterior": não escrito por
  este gerador. A consequência e a regra de integração estão em `01-architecture.md`; numa etapa de
  especificação o feedback cruzado é escrito pelo validador, no passo do relatório (conventions §14).
- Chave mestra desligada por padrão (I4 e diretrizes do gerador): não criada; o F-Spec exclui configuração
  de pista de abertura e de liberação da promoção, e o bloqueio de produção fica na promoção (ADR-0005).
- Python para o preparo offline, como as diretrizes do estágio antecipavam: não adotado (ADR-0002).
- Cenário além de asfalto, zebra, grama e barreiras (árvores, tribuna, cerca) na Kart Park: não desenhado
  (`SEED/FE-05`, fora do escopo do F-Spec).
- Texto "PISTA FICTÍCIA" do rodapé (`index.html:44`): não alterado; não exibe nome de pista e nenhum
  requisito o cobre.
- Leituras fora da lista de entrada, declaradas: do arquivo de origem `kart-park.json` da pasta do seed foram
  lidos por script só a estrutura de chaves, os nomes de formato e os valores de enumeração (`formato`,
  `versao`, `pontos_formato`, `sentido`, `lado`, `largada.indice`, a descrição da origem das coordenadas), a
  contagem da forma em que a zebra da largada está codificada (`ate_m` além do comprimento da volta) e o
  resumo SHA-256 e o tamanho do arquivo, para projetar o leitor da origem e fixar a cópia byte a byte; nenhuma
  coordenada, largura ou distância foi lida para o contexto. `SEED.md`, `DOMAIN.md`, `NOTES.md` e
  `medicoes/` não foram lidos. Dos conjuntos de `race-lap-validation` e `dirigibilidade` foram lidos nomes de
  contratos, a forma dos itens de projeto validados e o que `dirigibilidade` altera e congela.

## 2026-10-22 — rodada 2, Mode B

Relatório corrigido: `reports/dspec-validation/dspec-validation-20261022-1614.md` (FAIL; 3 `error`, 2
`warning`, 1 `scope`, 13 divergências). Nenhum módulo, tabela, campo, endpoint ou componente novo (§16): os
símbolos movidos já existiam no conjunto e o módulo que os recebe já existe na árvore.

**O que mudou**

- ISSUE-01 (D5, regra de tela na simulação): `OSM_CREDIT`, `creditFor` e `optionLabel` saem de
  `src/trainingSession.ts` (DES-0005) e passam a `src/lapMessages.ts`, módulo existente da aplicação pura,
  testável em `npm test` (DES-0007). `creditFor` recebe a entrada do catálogo (`osmCredit`) em vez do
  `trackId`, e `optionLabel` a entrada (`displayName`, `displayLengthM`), ambas por tipo estrutural, de modo
  que `src/lapMessages.ts` continua importando só tipos de `./lap` (CHK-TEST-0013-01 de `race-lap-validation`)
  e `MESSAGES` continua com as 20 chaves. `src/trainingSession.ts` guarda só a sessão e as entradas de
  API-0002; REQ-FEAT-0006-01 a -06 saem de `sources` de DES-0005 (continuam em DES-0007). Locais carregados:
  DES-0005 (realiza, posicionamento, interface, colaboradores, provas), DES-0007 (posicionamento, interface,
  importações de `src/main.ts`, colaboradores, observabilidade), DES-0006 (lista de aplicação pura e a
  verificação de que a sessão não guarda texto de crédito), DES-0011 (crédito da Esri acrescido ao que
  `creditFor` devolve), DES-0012 (onde os textos do crédito vivem), `01-architecture.md` (camadas, sentido
  das dependências, ordem de entrega) e `test-strategy.md` (interfaces públicas, FEAT-0006, AC-US-0006-01,
  -04, -07, -08, -09).
- ISSUE-02 (D6, argumentos sem validação): DES-0010 ganha a tabela de argumentos de
  `scripts/track-pipeline.ts` — `<comando>` entre os quatro; `<trackId>` de 1 a 40 caracteres em
  `[a-z0-9-]`, igual a um `trackId` de `TRAINING_TRACKS` com origem em `tracks/sources/` (hoje só
  `kart-park`), antes de montar caminho ou chave; `<trackVersion>` de 1 a 6 dígitos, inteiro de 1 a 999999;
  `--esri-decision` só com `promote`, uma vez, 1 a 200 caracteres sem caractere de controle; qualquer outro
  valor sai com código 1, sem ler nem escrever e sem reproduzir o valor. Locais carregados: DES-0011
  (comandos, `promote`, falha, observabilidade do registro), DM-0002 (restrições de `trackId`,
  `trackVersion`, `esriDecisionRef`), DES-0005 (o programa lê `TRAINING_TRACKS`), DES-0012 (ponto de
  aplicação de `promote`) e `01-architecture.md` (sentido das dependências).
- ISSUE-03 (D8, critério alcançado por artefato só de teste): em DES-0009 o motor, a recompensa e a zebra
  passam a construir o sinal a partir do próprio descritor (tipo da fonte, pico, duração), com os valores de
  hoje para o motor e a recompensa; `CURB_SOUND` é declarado no nível do módulo e lido só por `curb()`. O
  caminho de `npm test` de AC-US-0005-12 observa o sinal construído com um `AudioContext` de substituição
  instalado pelo teste em `globalThis` (sem mudança em `src/audio.ts` para o teste); a prova auditiva fica com
  E2E-04. Locais carregados: `test-strategy.md` (interfaces, fixture, AC-US-0005-12) e `01-architecture.md`.
- ISSUE-04 (D2, corpo de implementação): a linha de `step` da tabela de DES-0003 passa a contrato
  (`barrierTouching` verdadeiro com resposta de barreira num subpasso ou centro a até
  `BARRIER_HALF_WIDTH_M + BARRIER_TOUCH_TOLERANCE_M` de um segmento; falso sem `track` e com `barriers` vazio,
  sem consulta de distância; `barrierContact` só na passagem de falso a verdadeiro). Prova acrescida em
  DES-0003 e a cópia derivada `barriers` vazio em `test-strategy.md`.
- ISSUE-05 (D9, linha sem `arquivo:linha`): a linha REQ-FEAT-0007-13, REQ-FEAT-0006-14 de `98-divergences.md`
  cita `package.json:6-13` (sem script de publicação nem de promoção; sem `tracks/registry.json`) e
  `index.html:19`, `:25` (sem crédito, nem o da Esri).

**Itens fechados**: ISSUE-01, ISSUE-02, ISSUE-03, ISSUE-04, ISSUE-05.

**Migração de verificações planejadas** (nenhuma removida)

| Verificação | Antes | Agora |
|---|---|---|
| `creditFor` da Kart Park e da pista sintética | `session` (DES-0005) | `screens` (DES-0007), sobre as entradas do catálogo |
| `optionLabel` da Kart Park | `session` (DES-0005) | `screens` (DES-0007); `session` prova `displayName` e `displayLengthM` da entrada |
| som da zebra próprio (AC-US-0005-12) | descritores diferentes em `source`; `CURB_SOUND` no texto só dentro de `curb()` | tipo registrado de cada som pelo `AudioContext` de substituição igual ao `source` do descritor e diferente entre os três; só `curb()` cria fonte de buffer e filtro; `audio.curb(` no texto de `src/main.ts` só no laço de passos (mantida) |

**Itens recusados ou não aplicados, com motivo**

- ISSUE-06 (`scope`, `TRACK_SCHEMA_VERSION` 2 no projeto de `race-lap-validation`): nada mudou neste
  conjunto. A decisão é de `race-lap-validation`, pelo FB-01 que o validador escreveu em
  `300 Specs/330 D-Specs/Output/race-lap-validation/reports/feedbacks/pista-kart-park/feedback-20261022-1614.md`;
  a regra de integração continua em `01-architecture.md` ("Consequências para outras features").
- ISSUE-01, módulo novo de aplicação para o crédito (por exemplo `src/trackCredit.ts`): não criado. Uma
  rodada de correção não acrescenta módulo (§16) e `src/lapMessages.ts` já é o módulo de aplicação pura com
  os textos das telas.
- ISSUE-03, segunda alternativa do relatório (manter os descritores só descritivos e verificar o
  comportamento por outro caminho): não adotada; com cada som construído do próprio descritor a comparação
  observa o sinal tocado, e a verificação do grafo de áudio construído chega ao comportamento em `npm test`.
- ISSUE-02, verificação de `npm test` da validação de argumentos: não acrescentada. Exigiria exportar um
  analisador de argumentos do programa (elemento de interface novo numa rodada de correção, §16) ou um teste
  que execute o programa; a regra fica declarada em DES-0010 e é implementada e conferida pela etapa de
  código.
- ISSUE-04, demais linhas da tabela "Mudanças dentro de `integrate` e `step`" e o bloco da barreira de
  DES-0003: não reescritos; o relatório nomeou só a linha de `step`, e as outras descrevem expressões que o
  F-Spec fixa (85 % da aderência, a resposta do muro) e que os testes comparam bit a bit.

## 2026-10-27 — rodada 3, Mode C (feedback do código `reports/feedback/feedback-20261027-2125.md`, SPEC-ISSUE-01 a SPEC-ISSUE-03)

Feedback de `code-validator` (FAIL SPEC, `code-validation-20261027-2125`). Decisões do dono do produto que
regem, dadas ao gerador e não redescobertas: `DOMAIN.md` 2026-10-22 "Fidelidade" (suavizar a linha central
com janela de cerca de 12 m e apresentar como "traçado aproximado"), tolerância da suavização fechada no seed (nenhum ponto suavizado a
mais de 0,30 m da original), SEED US-2 (comprimento medido de novo depois da suavização, 687,5 m ± 1 %; o
rótulo mostra 687 m). Fatos medidos (`NOTES.md`): origem 687,52 m, ruído 0,09 m RMS com 8 m a 13 m de
comprimento de onda.

**O que mudou**

- SPEC-ISSUE-01 (ADR-0006 1.0.0 → 1.1.0; DES-0010 1.0.1 → 1.1.0; DM-0002 1.0.1 → 1.1.0; DES-0011 1.0.1 →
  1.0.2): a regra "iteração de Jacobi com `k` de 0 a 400 escolhido pelo comprimento mais próximo de 687,5 m"
  escolhia `k` 0 sobre este dado (origem já em 687,520 m) e publicava a linha original sem suavização. Regra
  nova: janela fixa de 12 m de distância de volta (± 6 m, medida na linha original), pesos de cosseno
  levantado `½ (1 + cos(π δ / 6))`, uma só aplicação sobre os pontos da origem, grampo de 0,295 m em torno do
  ponto correspondente; comprimento medido de novo sobre a linha arredondada, dentro de 680,625 m a 694,375 m
  senão o preparo falha; `lapLengthM` publicado é o medido; `displayLengthM` continua 687. Evidência medida
  sobre a origem registrada em ADR-0006: a janela adotada dá 682,116 m, maior desvio 0,2955 m, 22 pontos no
  grampo, zigue-zague de 105 para 46 inversões de rumo; a média uniforme sobre os mesmos 12 m dá 680,372 m
  (fora da faixa: o grampo bate em 326 pontos e encurta as curvas). Constantes de DES-0010: `SMOOTH_WINDOW_M`
  12 e `LAP_LENGTH_TOLERANCE` 0,01 entram; `SMOOTH_LAMBDA` e `SMOOTH_MAX_ITERATIONS` saem. DM-0002:
  `prep.smoothingWindowM` substitui `prep.smoothingIterations`. DES-0011: V03 diz que o comprimento é o medido
  na `centerline` gravada depois da suavização. **`trackVersion` continua 1**: o F-Spec fixa a primeira
  versão publicada como 1 (REQ-FEAT-0002-01, RULE-0005, V16) e a entrada `kart-park` 1 que a rodada de
  código 1 gravou em `tracks/registry.json` veio de uma rodada reprovada no gate (FAIL SPEC), nunca validada,
  testada nem implantada (commit `ba221ad` é ponto de controle); DM-0002 ganha o parágrafo "Entrada de rodada
  reprovada" (publicada é a entrada entregue por rodada que passou no gate; `STAGING`/`PRODUCTION` são estados
  de entrada entregue, ADR-0005), e DES-0010/DES-0011 dizem que a rodada de código seguinte retira essa
  entrada e o arquivo e refaz `prepare`/`verify`/`publish kart-park 1`.
- SPEC-ISSUE-02 (DES-0005 1.1.0 → 1.2.0; DES-0007 1.1.0 → 1.2.0; `01-architecture.md` 1.0.1 → 1.0.2):
  `startTrainingLap(session, lap, config, setup?)`, com `setup?: SetupRef` (`src/physics.ts`,
  `{setupId, setupVersion}`) copiado ao pedido de `startLap` sem interpretação, só quando dado, nunca
  derivado — API-0001 1.1.0 de `race-lap-validation`, FB-01 de `dirigibilidade`, `compareLapRecords`. DES-0007
  `beginLap` passa a referência pelo quarto argumento; o diagrama de sequência da volta de treino a carrega;
  prova acrescida em DES-0005 (volta com e sem `setup`).
- SPEC-ISSUE-03 (DES-0010 1.1.0; DES-0002 1.0.0 → 1.1.0): passo 5 reescrito com o procedimento que passa em
  V13 a V15 — pares de amostras nas duas bordas, borda voltada para o outro trecho é a da amostra mais
  próxima dele, marcha de 0,01 m em `pq` para a parte de grama, vértice no meio, ordenação pelo primeiro
  trecho, sequências cortadas em 1 m, constantes `GAP_MARCH_STEP_M` e `BARRIER_SEQUENCE_GAP_M`; passo 9
  reescrito com o fim da linha pela distância à borda **medida** (`beyondTrackEdgeM`), bissecção até
  `LINE_END_TARGET_M` 2,99 m, limite `LINE_MARCH_MAX_M` 60 m, e o motivo (3 m ao longo da normal dão 2,868 m
  no marcador 0 e encontram outra parte no marcador 20; V11 reprova). O requisito não muda: a barreira nunca
  invade o asfalto (V15) e a folga medida fica registrada. DES-0002 lista `closestOnSegment`, `pointInQuad`,
  `centerlineCrossings` e `windingSumOf`, exportados por `src/trackGeometry.ts` e usados por
  `src/trackData.ts`, `src/physics.ts` e `scripts/trackChecks.ts`.
- `00-index.md` e `99-traceability.md` regenerados pelo gate (`lint_artifacts.py --emit`); nenhum outro item
  tocado; `98-divergences.md` inalterado.

**Itens fechados**: SPEC-ISSUE-01, SPEC-ISSUE-02, SPEC-ISSUE-03.

**Itens recusados ou não aplicados, com motivo**

- SPEC-ISSUE-01, primeira sugestão do relatório ("o maior `k` ≤ 400 cujo comprimento fique em 680,625 m a
  694,375 m"): não adotada; escolheria `k` 14 ou 15 por busca no dado (`k` 14 dá 680,779 m, a 0,15 m do limite; `k` 16 dá 680,422 m e
  reprova em V03), e o dono do produto fixou a janela, não a intensidade.
- SPEC-ISSUE-01, "declarar que `k` 0 satisfaz o requisito": não adotada; contraria US-2, AC-US-0002-06,
  FLOW-0003 passo 3 e a decisão "Fidelidade".
- SPEC-ISSUE-01, média móvel uniforme de 12 m (a leitura literal de "janela de cerca de 12 m"): não adotada;
  medida em 680,372 m, fora da faixa de ± 1 % que o F-Spec verifica (V03), porque o grampo de 0,30 m bate em
  metade dos pontos nas curvas de raio abaixo de cerca de 20 m; a janela de 12 m com pesos de cosseno
  levantado mantém a decisão do dono do produto e a faixa.
- SPEC-ISSUE-01, `trackVersion` 2 com o arquivo atual mantido ("se o autor preferir manter o arquivo
  atual"): não adotada; a versão 1 nunca foi entregue e o F-Spec fixa a primeira versão publicada como 1.
- SPEC-ISSUE-02, `SetupRef` como campo da sessão: não adotada; a sessão (RULE-0003) não guarda acerto, e a
  aplicação já guarda a referência (`src/main.ts`, `setupRef`); passar por parâmetro é a cópia sem
  interpretação que API-0001 1.1.0 pede.
- `test-strategy.md`: não alterado; nenhuma linha cita a regra de suavização, a assinatura de
  `startTrainingLap` ou o procedimento da barreira (AC-US-0002-02, -06 continuam por V03 e V07).
- Leituras fora da lista de entrada, declaradas: `tracks/sources/kart-park.json` foi lido por script de
  rascunho (fora do repositório) só para medir as regras candidatas da tabela de ADR-0006; `tracks/registry.json`,
  `src/trainingSession.ts:83`, `src/physics.ts:91-92`, `src/lap.ts:24`, `src/main.ts:165-299`,
  `src/trackGeometry.ts` (assinaturas) e `scripts/trackPrep.ts:1-60, 80-175, 275-370` foram lidos para
  posicionamento; `DOMAIN.md`, `NOTES.md` e `SEED.md` só nos trechos que o chamador nomeou.

## 2026-10-30 — rodada 4, Mode C (feedback de `race-lap-validation`, `reports/feedbacks/race-lap-validation/feedback-20261030-1256.md`, FB-01; retirada do drift e do turbo, `dirigibilidade` seed `revision: 5`)

Entrada: o FB-01 pendente de `race-lap-validation` (F-Spec revalidado com seed `revision: 3`: API-0001 1.2.0,
API-0002 1.2.1, RULE-0002 1.1.1; D-Spec revalidado: ADR-0006, DM-0002 1.2.0 INV-1, DES-0001 1.2.0, DES-0003 1.1.0,
DES-0004 1.1.0, DES-0007 e DES-0008 1.1.0) — o treino é uma sequência de voltas numa sessão, o fim de cada volta é
lido pelo crescimento de `listLapResults` e o treino só termina por `endTraining` —; e a nota do chamador de que o
drift e o turbo saíram do jogo (`dirigibilidade`, seed `revision: 5`; ADR-0006, DES-0001 4.0.0 e DES-0005 2.0.0
daquela feature, em rodada). Os requisitos e o escopo do F-Spec desta feature não mudam.

**O que mudou**

- FB-01, volta na Kart Park (`core/DES-0004` 1.0.0 → 1.1.0): a volta da sessão de treino é uma volta de um treino de
  voltas seguidas de `race-lap-validation`; seção nova "Volta de treino na Kart Park" com o efeito de cada evento
  (chegada no sentido da pista, corte, contramão, chegada de novo, pausa, reposicionamento, `endTraining`); o
  atalho da curva 4 recebe o resultado `MISSED_MARKER` na chegada ou fica `INVALID` com `CUT` no passo e recebe o
  resultado na chegada seguinte; `NOT_TRAINING` entra na lista dos códigos; as provas leem o fim de cada volta pelo
  crescimento de `listLapResults` e nenhuma espera `ENDED` na chegada ou no corte. `src/lap.ts` continua sem
  mudança de modelo por esta feature.
- FB-01, sessão e seletor (`core/DES-0005` 1.2.0 → 1.3.0): `startTrainingLap` inicia o treino inteiro (as voltas
  seguintes começam em `stepLap`, sem nova chamada); a troca de pista descarta o treino, sem resultado para a volta
  em andamento, e as voltas já concluídas não mudam (a frase "uma volta já `ENDED` já teve o resultado exibido" sai);
  provas de troca com o treino em `RUNNING` antes e depois de uma volta concluída e de cada item de `listLapResults`
  `TRAINING`, sem `challengeNumber`, `official` falso; `endTraining` sem item novo.
- FB-01, resultado e crédito (`web/DES-0007` 1.2.0 → 1.3.0; `adr/ADR-0007` 1.0.0, novo): a "tela de resultado" de
  uma volta de treino é o painel do resultado da volta do treino de `race-lap-validation` (`#lap-training-result`);
  a linha de crédito OSM passa a `#lap-training-result-credit`, último filho do painel, desenhada no mesmo ramo do
  redesenho do painel; `#lap-result-credit` é retirado de `#lap-result` (que só exibe volta oficial e de
  reconhecimento) na mesma entrega (I3); o seletor é alcançado na abertura e depois de "encerrar treino"; o link do
  crédito no painel abre outra aba e o treino pausa por `FOCUS_LOST`. ADR-0007 registra a decisão, as alternativas e
  a dependência do painel de `race-lap-validation`.
- FB-01, retorno da zebra (`web/DES-0009` 1.1.0 → 1.2.0; `data/DM-0002` 1.1.0 → 1.2.0): o estado do retorno é
  zerado a cada treino iniciado e a cada sessão nova, nunca no fim de uma volta do treino, porque o kart e o
  `simStepCount` continuam; DM-0002 diz que a volta guardada pela aplicação é o treino inteiro e que a sessão desta
  feature não guarda resultado, contador nem melhor volta.
- FB-01, estratégia de testes (`test-strategy.md` 1.0.1 → 1.1.0): fixture `drive` (para no crescimento de
  `listLapResults` ou em `ENDED`, que numa volta `TRAINING` só vem de `endTraining`); caminhos de AC-US-0001-05,
  AC-US-0001-07, AC-US-0003-05, -07, -09, -10, -11, AC-US-0005-05, AC-US-0006-04, REQ-FEAT-0003-15, E2E-02, E2E-03
  e o nível Web E2E reescritos para o treino de voltas seguidas; parágrafo em "Testes de outras features".
- FB-01, arquitetura e demais sítios do mesmo fato (`01-architecture.md` 1.0.2 → 1.1.0; `core/DES-0006` 1.0.1 →
  1.1.0; `security/DES-0012` 1.0.1 → 1.0.2; `adr/ADR-0006` 1.1.0 → 1.2.0; `98-divergences.md` 1.0.1 → 1.1.0):
  diagrama da volta de treino com o laço de voltas, `endTraining` e a volta à tela inicial; linha de compatibilidade
  de `LapSession`/`listLapResults`/`endTraining` e das telas; consequência e ordem de entrega com a rodada de código
  de `race-lap-validation` (o painel existe antes do crédito mudar; as provas migram junto); DES-0006 acrescenta
  `listLapResults` às leituras da aplicação; DES-0012 e a linha "Aba do link" de ADR-0006 dizem onde o crédito do
  resultado aparece agora; duas linhas novas de divergência (crédito em `#lap-result`, `index.html:25`,
  `src/main.ts:465`, `:592`; verificações e `drive` que esperam `ENDED`, nas linhas que o FB-01 cita).
- Drift e turbo (`core/DES-0003` 1.0.1 → 1.1.0; `adr/ADR-0003` 1.0.0 → 1.1.0; `adr/ADR-0004` 1.0.0 → 1.1.0;
  `web/DES-0009`; `adr/ADR-0006`; `01-architecture.md`; `core/DES-0006`): a escala de drift sai da linha de
  `tireForce` (fica a de forçar); a linha "manobra" (zebra como pista para o drift) passa a "sem mudança desta
  feature", retirada com a manobra por `dirigibilidade`; a resposta da barreira deixa de citar o cancelamento da
  manobra (segue a do muro, que `dirigibilidade` também deixa de cancelar); ADR-0004 tira a condição de pista da
  manobra e a consequência sobre o drift; DES-0009 registra que a recompensa (som do prêmio do drift) deixa de
  tocar e que a zebra não tem efeito de drift nem de turbo; ADR-0006 anota o mesmo no timbre; `01-architecture.md`
  separa `src/maneuvers.ts` (não usado por esta feature) e o `import` de `physics.ts`; DES-0006 tira
  `src/maneuvers.ts` da lista do teste de camada desta feature, condição da retirada final do módulo em
  `dirigibilidade`. O HUD e o retorno da zebra desta feature não mencionavam drift nem turbo.
- Upstream: `300 Specs/320 F-Specs/Output/pista-kart-park/reports/feedback/FEEDBACK-01.md` pergunta ao autor do
  F-Spec pelo alinhamento do texto que ainda descreve a volta de treino terminando em `ENDED` (SCR-0002, RULE-0003,
  FEAT-0003, FEAT-0001, `01-overview.md`). Nenhum `REQ-*` muda.
- `00-index.md` e `99-traceability.md` regenerados pelo gate (`lint_artifacts.py --emit`).

**Itens fechados**: FB-01 de `race-lap-validation` (feedback de 2026-10-30 12:56).

**Migração de verificações planejadas** (nenhuma removida)

| Verificação | Antes | Agora |
|---|---|---|
| CHK-TEST-0005-01 (`tests/pista-kart-park-lap.test.ts:44-54`) | a volta do piloto termina `ENDED` e `VALID` | o item novo de `listLapResults` no cruzamento da chegada é `VALID`; a fase continua `RUNNING` |
| CHK-TEST-0005-03 (`:78-107`) | `ENDED` na chegada, `INVALID` com `MISSED_MARKER` | item novo `INVALID` com `MISSED_MARKER`; fase `RUNNING` |
| CHK-TEST-0005-04 (`:109-123`) | o passo 121 encerra a volta (`ENDED`) com `CUT` | o passo 121 dá `INVALID` com `CUT`, fase `RUNNING`, nenhum item novo |
| CHK-TEST-0005-06 (`:141-156`) | o atalho termina a volta `INVALID` | o item novo, no cruzamento seguinte da chegada, é `INVALID` |
| CHK-TEST-0005-08 (`:182-192`) | depois do fim, nenhum passo, nenhum tempo, mesmo resultado, kart parado | a chegada cruzada de novo encerra a segunda volta com o seu resultado (`lapSequenceCount` 2); o primeiro resultado não muda e não há segundo resultado para ele |
| CHK-TEST-0005-10 (`:208-230`) | `ENDED` e `VALID` depois da retomada | item novo `VALID` no cruzamento depois da retomada, com os marcadores de antes da pausa |
| CHK-TEST-0007-05 (`tests/pista-kart-park-session.test.ts:90-118`) | voltas concluída e cortada chegam a `ENDED`; resultado por `getLapResult` | itens de `listLapResults` (concluída, cortada com resultado na chegada seguinte, marcador pulado) `TRAINING`, sem `challengeNumber`, `official` falso; a cortada segue `RUNNING`; troca de pista e `endTraining` sem item novo |
| CHK-TEST-0007-07 (`:136`) | troca com volta em `COUNTDOWN`, `RUNNING`, `PAUSED`: nenhum resultado | o mesmo, mais `RUNNING` depois de uma volta concluída: a lista do treino descartado continua com os itens já concluídos e nenhum novo |
| `drive` (`tests/helpers/kartParkPilot.ts:112-122`) | para em `ENDED` | para no crescimento de `listLapResults` ou em `ENDED` |
| CHK-TEST-0009-04 (`tests/pista-kart-park-screens.test.ts:47-56`) | `#lap-result-credit` em `#lap-result`, `renderCredit` com `result.trackId` | `#lap-training-result-credit` em `#lap-training-result`, `renderCredit` com o `trackId` do resultado exibido; nenhum `lap-result-credit` |
| CHK-TEST-0011-01 (`tests/pista-kart-park-layering.test.ts:18`, lista de simulação) | inclui `src/maneuvers.ts` | sem `src/maneuvers.ts`; as demais proibições e módulos iguais |
| E2E-02, E2E-03 | tela de resultado ao fim da volta; troca de pista depois da tela de resultado | painel do resultado de cada volta com o crédito, sem parar o kart; "encerrar treino" volta ao seletor; 60 fps num treino de ao menos duas voltas |

**Itens recusados ou não aplicados, com motivo**

- FB-01, alternativa "volta `OFFICIAL`/`RECON` de fixture onde a prova precisa de `ENDED`": não adotada. A sessão
  de treino desta feature só oferece `TRAINING` (REQ-FEAT-0001-11) e REQ-FEAT-0003-15 aplica na Kart Park as regras
  que o Jogador vive; com o fim de cada volta lido pelo crescimento de `listLapResults`, nenhuma prova desta feature
  precisa de `ENDED`.
- Manter `#lap-result-credit` ao lado do crédito novo: não adotado; `#lap-result` não exibe volta de treino
  (DES-0007 1.1.0 de `race-lap-validation`) e o elemento ficaria sem caminho em que aparecer (ADR-0007).
- Tela de resultado própria ao encerrar o treino, ou crédito só em `#welcome` depois de "encerrar treino": não
  adotados (ADR-0007, alternativas).
- Unificar o "Melhor" (`#best`) com a melhor volta válida do treino: não tratado; é de `race-lap-validation` e de
  `dirigibilidade` (proposta já registrada no changelog de `race-lap-validation`), e nenhum requisito desta feature
  o cobre.
- Mudança de código desta feature pelo drift: nenhuma. O cancelamento da manobra na barreira (`src/physics.ts:352`),
  o cálculo de `onRoad` e o comentário que cita RULE-0001 desta feature (`:388-391`) saem pela rodada de código de
  `dirigibilidade` (DES-0001 4.0.0 daquela feature); não é divergência desta feature, porque nenhum requisito dela
  trata de drift.
- `REWARD_SOUND` e a verificação do sinal de `reward()`: mantidos enquanto o método existir em `src/audio.ts`; a
  retirada do método, se vier, é de `dirigibilidade` e chega como feedback.
- Alinhar o texto do F-Spec desta feature (SCR-0002 "Pontos de entrada" em `ENDED`, RULE-0003, FEAT-0003,
  FEAT-0001, `01-overview.md`): não é escrita deste estágio; perguntado ao autor em `FEEDBACK-01.md` do F-Spec. Os
  requisitos são realizados como estão.
- Sem mudança, carregados na versão corrente: `core/DES-0001`, `core/DES-0002`, `web/DES-0008`,
  `pipeline/DES-0010`, `pipeline/DES-0011`, `data/DM-0001`, `adr/ADR-0001`, `adr/ADR-0002`, `adr/ADR-0005`; as
  linhas de `98-divergences.md` anteriores a esta rodada não são rejulgadas.
- Leituras fora da lista de entrada, declaradas: de `race-lap-validation`, o F-Spec (FEAT-0010, SCR-0001, SCR-0003,
  API-0002) e o D-Spec (ADR-0006, DM-0002, DES-0001, DES-0007, DES-0008, changelog), para os nomes e o contrato do
  treino; de `dirigibilidade`, ADR-0006 e as linhas de DES-0001 e DES-0005 sobre a retirada do drift; da árvore,
  `src/main.ts`, `index.html`, `src/style.css`, `src/physics.ts` (linhas da manobra) e os testes nas linhas que o
  FB-01 cita, só para posicionamento.

## 2026-11-03 — rodada de 2026-11-03, Mode A (seed `revision: 2`, acabamento visual)

**O que mudou**

- Upstream: F-Spec revalidado para o seed `revision: 2` (`fspec-validation-20261103-1908`, SUCCESS, commit
  `cb86210`): FEAT-0008 e RULE-0006 novos, SCR-0003 1.1.0, FEAT-0007 1.1.0 (taxa de quadros com o acabamento),
  RULE-0005 1.1.0 (arquivo byte a byte igual, `trackVersion` 1). Regenerado sobre o conjunto existente: todo id e
  todo projeto que a mudança não toca ficam como estavam.
- `web/DES-0008` 2.0.0: `src/trackScene.ts` ganha os filhos `grass` (400 faixas de 5 m em 2 tons, `grassToneAt`
  só da posição) e `edge-lines` (faixa de 0,10 m em esquadro por dentro de cada borda); `curbs` vira rampa de 0 m
  a `CURB_RELIEF_M` 0,04 m; `barriers` passa de caixas a pilhas de 5 pneus de 0,18 m (raio 0,12 m, centros a até
  0,18 m), pretas; `src/main.ts` oculta o `ground` só com a Kart Park visível. Novas constantes
  `EDGE_LINE_WIDTH_M`, `CURB_RELIEF_M`, `TYRE_RADIUS_M`, `TYRE_SEGMENTS`, `TYRE_HEIGHT_M`, `TYRES_PER_STACK`,
  `TYRE_SPACING_M`, `GRASS_STRIPE_M`, `GRASS_TONES` e a função `grassToneAt`; nenhum módulo, dependência,
  arquivo de imagem ou configuração novo. Ids novos: nenhum `DES`, `DM` ou `ADR`; E2E-09 no roteiro.
- `core/DES-0006` 1.2.0: a simulação não muda com o acabamento (nenhum módulo de simulação importa
  `./trackScene`), provado pelo traço `tests/fixtures/kartParkRev1Trace.json` registrado antes do código da
  revisão 2 (REQ-FEAT-0008-08, -25 a -27).
- `pipeline/DES-0011` 1.1.0: o arquivo publicado continua o da versão 1, com o SHA-256 registrado e
  `trackVersion` 1 (REQ-FEAT-0008-28, -29).
- `test-strategy.md` 1.2.0: linha de FEAT-0008, caminho de AC-US-0007-01 a -21 e dos requisitos sem critério de
  história (REQ-FEAT-0008-22 a -29), fixture do traço e luminância calculada no teste, E2E-03, E2E-05 e E2E-07
  com o acabamento, E2E-09 (imagem da pista sintética igual à de antes).
- `98-divergences.md` 1.2.0: uma linha aberta para o acabamento (DES-0008); os requisitos da revisão 2 já
  satisfeitos hoje listados com o ponto do código.
- `01-architecture.md` 1.2.0: escopo FEAT-0001 a FEAT-0008, RULE-0001 a RULE-0006, seed `revision: 2`; linha
  de `src/trackScene.ts`.
- Upstream: `300 Specs/320 F-Specs/Output/pista-kart-park/reports/feedback/FEEDBACK-02.md` (alinhamento de texto
  de RULE-0006 sobre a face de colisão).
- `00-index.md` e `99-traceability.md` regenerados pelo gate (`lint_artifacts.py --emit`).

**Pontos resolvidos no projeto**

- Face de colisão da barreira (REQ-FEAT-0008-14): medida contra a superfície de contato a
  `BARRIER_HALF_WIDTH_M` = 0,1 m de cada lado (ADR-0003), onde o kart para; a face desenhada fica entre 0,073 m e
  0,12 m da poligonal, a no máximo 0,027 m da face de colisão, largura total de 0,146 m a 0,24 m. A constante da
  simulação não muda (NFR-0013, NFR-0014). Folga da poligonal ao asfalto ≥ 0,51 m e à zebra ≥ 5,04 m (seed
  `NOTES.md`, 2026-11-03): nenhum pneu sobre asfalto ou zebra.
- Tons de grama (REQ-FEAT-0008-17): a leitura que vale é a fórmula de RULE-0006,
  \|L(t) − L(ref)\| / L(ref) em [0,08, 0,20], com L a luminância relativa WCAG 2 e ref `#68865b`; a frase de
  SCR-0003 apontada no aviso ISSUE-02 de `fspec-validation-20261103-1908` é deslize de redação. Tons `#6e8f60`
  (0,147) e `#627d56` (0,136).

**Migração de verificações planejadas** (nenhuma removida)

| Verificação | Antes | Agora |
|---|---|---|
| CHK-TEST-0010-03 (`tests/pista-kart-park-scene.test.ts:66`) | uma caixa por segmento, centrada, no comprimento dele, 0,2 m de espessura | pilhas de pneus da primeira à última ponta de cada poligonal, centros a até `TYRE_SPACING_M`, 0,9 m de altura, envoltória a até 0,05 m da face de colisão |
| CHK-TEST-0010-02 (`:33`) | faixas da zebra no lado e no trecho, planas | o mesmo, com os vértices de fora a `CURB_Y + CURB_RELIEF_M` |

**Itens recusados ou não aplicados, com motivo**

- Mudar `BARRIER_HALF_WIDTH_M` para a fileira ficar a no máximo 0,05 m da poligonal, como a frase de RULE-0006
  deduz: não adotado; mudaria a colisão, o que NFR-0013 proíbe, e o kart pararia antes dos pneus vistos.
  Devolvido ao F-Spec em FEEDBACK-02.
- Desenhar a face dos pneus contra a poligonal com a superfície de contato como está: não adotado; o kart
  pararia 0,05 m a 0,1 m antes dos pneus, contra AC-US-0007-11.
- Textura de grama, ruído ou sorteio de tons: não adotados; REQ-FEAT-0008-18 e -23 pedem tom só da posição e
  nada baixado, e uma textura seria arquivo de imagem novo.
- Estreitar a linha de largada para não cobrir a faixa de borda: desnecessário; no ponto 0 ela fica a 0,315 m de
  cada borda, e o teste de cena afirma a folga.
- Novo ADR para as constantes do acabamento: não escrito; são escolhas dentro das medidas que RULE-0006 fixa, sem
  consequência além da feature, com o motivo de cada uma em DES-0008.
- Mudar o texto de SCR-0003 (ISSUE-02 do F-Spec): não é escrita deste estágio; o D-Spec segue RULE-0006.
- REQ-FEAT-0007-12 1.1.0 deixou de exigir o registro da dependência no D-Spec: o registro em `01-architecture.md`
  ("Ordem de entrega") e em DES-0006 fica, porque continua verdadeiro e não acrescenta exigência.
- Sem mudança, carregados na versão corrente: `core/DES-0001` a `DES-0005`, `web/DES-0007`, `web/DES-0009`,
  `pipeline/DES-0010`, `security/DES-0012`, `data/DM-0001`, `data/DM-0002`, `adr/ADR-0001` a `ADR-0007`; as linhas
  de `98-divergences.md` anteriores a esta rodada não são rejulgadas.
- Leituras fora do F-Spec, declaradas: `src/trackScene.ts`, `src/main.ts` (chão, cena sintética, `chooseTrack`),
  `src/trackGeometry.ts` (bordas, normais, `BARRIER_HALF_WIDTH_M`), `src/physics.ts` (exportações),
  `src/tracks/kart-park-v1.json` e `tracks/registry.json` (medidas e resumo), `tests/pista-kart-park-scene.test.ts`
  e `tests/pista-kart-park-publication.test.ts` (nomes das verificações), só para posicionamento. As folgas da
  barreira vêm do seed `NOTES.md` via o pedido desta rodada, não lidas aqui.

## 2026-11-03 — rodada de 2026-11-03, Mode B (`dspec-validation-20261103-1924`, FAIL)

**O que mudou**

- Upstream: F-Spec revalidado (`fspec-validation-20261103-1937`, SUCCESS, commit `73feae8`): RULE-0006 1.1.0
  e FEAT-0008 1.1.0 definem a face de colisão como a superfície em que o kart para de cada lado, não a
  poligonal, e deixam a distância dela à poligonal ao projeto. `01-architecture.md` 1.2.1 passa a citar essa
  validação.
- ISSUE-04 (`web/DES-0008` 2.1.0, "Face de colisão"): fechado citando RULE-0006 1.1.0 ("Face dos pneus") e
  FEAT-0008 1.1.0; a face de colisão do projeto continua a fronteira da superfície de contato a
  `BARRIER_HALF_WIDTH_M` = 0,1 m (ADR-0003, sem mudança). A devolução de FEEDBACK-02 deixa de ser citada.
- ISSUE-05 (`web/DES-0008` 2.1.0, interface, filho `barriers`, medidas, desempenho, observabilidade;
  `test-strategy.md` 1.3.0, linhas AC-US-0004-06 e AC-US-0007-11): uma pilha centrada em cada vértice da
  poligonal e, em cada segmento, pilhas a no máximo `TYRE_SPACING_M`, agora 0,12 m (era 0,18 m, espaçado
  pelo comprimento total); `TYRE_RADIUS_M` 0,1 m (era 0,12 m), a espessura da barreira de ADR-0003;
  instâncias só transladadas. Recalculado sobre `src/tracks/kart-park-v1.json` por `buildTrackGeometry`
  (script descartável fora do repositório), com as fronteiras amostradas a 0,001 m: distância da fronteira
  de contato à face desenhada no máximo 0,019 m, da face à fronteira de contato no máximo 0,023 m, nenhum
  ponto da fronteira de contato dentro de um pneu; a disposição anterior dá 0,070 m e 0,071 m (perto de
  29,69 m). 646 pilhas, 3.230 pneus, 85.272 triângulos numa chamada de desenho. O teste de AC-US-0007-11 mede
  nos dois sentidos entre as fronteiras amostradas a 0,005 m (0,020 m e 0,022 m no projeto; reprova a
  disposição anterior).
- ISSUE-01 (`adr/ADR-0006` 1.2.1, `data/DM-0002` 1.2.1, `pipeline/DES-0010` 1.1.1): o comprimento é o
  derivado da `centerline` gravada, registrado em `prep.lapLengthM`; o texto deixa de sugerir uma chave
  `lapLengthM` no arquivo publicado.
- ISSUE-02 (`01-architecture.md` 1.2.1, "Consequências para outras features"; `test-strategy.md` 1.3.0,
  "Testes de outras features"): a mudança de CHK-TEST-0009-02 e -03 já foi aplicada por `race-lap-validation`
  (commit `32d0adf`; `src/trackData.ts:11`, `tests/race-lap-validation-track-data.test.ts:18-40`).
- `00-index.md` e `99-traceability.md` regenerados pelo gate (`lint_artifacts.py --emit`).

**Itens recusados ou não aplicados, com motivo**

- ISSUE-03 (base única em `98-divergences.md`): não aplicado nesta rodada. Passar as 15 linhas presas a
  `ac84352` para a árvore corrente é rejulgar cada divergência contra o código já entregue (várias deixariam de
  existir), trabalho que não é barato nem seguro numa rodada de correção; é aviso, não condiciona o veredito, e
  cada linha continua a nomear a sua base. Fica para a próxima rodada Mode A ou C.
- Manter `TYRE_RADIUS_M` 0,12 m com pilha em cada vértice: não adotado; os pneus enchem por dentro das viradas
  o vão que a superfície de contato deixa aberto (0,10 m perto de 40,29 m).
- Mudar `BARRIER_HALF_WIDTH_M`: não adotado; NFR-0013 congela a colisão, e RULE-0006 1.1.0 deixa a distância ao
  projeto.
- Nenhum módulo, tabela, campo, componente ou constante novo (§16): as mudanças são de valor e de disposição
  dentro do filho `barriers` que o projeto já tinha.

## 2026-11-06 — rodada de 2026-11-06, Mode A (seed `revision: 3`, réplica não oficial como `kart-park` `trackVersion` 2)

**O que mudou**

- Upstream: F-Spec revalidado para o seed `revision: 3` (`fspec-validation-20261106-1805`, SUCCESS, commit
  `281b617`; rodadas 5 e 6 do changelog do F-Spec). Regenerado sobre o conjunto existente: ids mantidos onde o
  projeto sobrevive; todo arquivo do conjunto voltou a `draft`.
- `core/DES-0005` 2.0.0: entrada do catálogo com `trackVersion` opcional (2 na Kart Park, ausente na sintética),
  nome "Kart Park — São José dos Pinhais (réplica não oficial)" e `displayLengthM` 691; `selectTrainingTrack`
  confere `trackId` e `trackVersion` com a entrada e devolve o código novo `TRACK_VERSION_MISMATCH` (um `trackId`
  diferente, que dava `TRACK_DATA_UNREADABLE`, passa a esse código, como API-0002 2.0.0 pede); provas da versão 2 e
  da recusa do arquivo da versão 1 (REQ-FEAT-0001-15, -16).
- `web/DES-0007` 2.0.0: `src/main.ts` importa `./tracks/kart-park-v2.json?raw` no lugar do arquivo da versão 1, que
  sai do pacote; aviso `track-data TRACK_VERSION_MISMATCH` só com identificadores; rótulo "… (réplica não oficial) ·
  691 m"; nenhum "traçado aproximado" nem "687 m".
- `pipeline/DES-0010` 2.0.0: preparo da versão 2 a partir de `tracks/sources/kart-park-replica.json` (cópia byte a
  byte da réplica, 34.373 bytes, SHA-256 `eba665b6…a24e`): os 691 pontos da réplica nos eixos do jogo com a origem
  dela, sem suavizar nem reamostrar, `widthM` 7,0, as 22 zebras lidas na régua da réplica, setores em retas,
  barreira entre 368,5–406,5 m e 594,5–624,5 m com a guarda nova de 0,2 m da borda da pista; `TRACK_ORIGINS` por
  (`trackId`, `trackVersion`); a versão 1 congelada (o seu preparo fica sem mudança, só para a prova de
  reprodução; `prepare`, `verify` e `publish` de `kart-park 1` recusados).
- `pipeline/DES-0011` 2.0.0: verificações V01 a V20 de RULE-0002 2.0.0 contra a réplica (V01 ponto 0, V06 7,0 m,
  V07 0,10 m, V09 204,9 / 354,9 / 534,7 m, V12 22 trechos, V13/V14 com os trechos novos, V16 `trackVersion` 2, V19
  limites em retas, V20 zebra sem cruzar a largada); publicação da entrada `kart-park` 2; prova da versão 1 pelo
  resumo literal, pela entrada intacta e pelas regras `-text` de `.gitattributes`.
- `data/DM-0001` 2.0.0: os dois arquivos publicados (1 inalterado e fora do pacote, 2 novo); plano de migração,
  reversão e janela da revisão 3, sem mudança de esquema. `data/DM-0002` 2.0.0: `prep.method` opcional
  (`SMOOTHED_ORIGIN` ausente, `REPLICA`), `maxReplicaOffsetM`, entrada 2 acrescentada sem reescrever a 1;
  `registryVersion` continua 1.
- `adr/ADR-0008` 1.0.0, **novo**: a réplica como versão 2 (pontos da réplica sem suavizar; arquivo novo ao lado
  da versão 1; conferência de versão no catálogo; versão 1 fora do pacote; preparo da versão 1 congelado), as duas
  lacunas novas do F-Spec 2.0.0 decididas. `adr/ADR-0006` 2.0.0: suavização e origem das coordenadas restritas à
  versão 1; linha da aparência da barreira alinhada com DES-0008. `adr/ADR-0002` 1.1.0: V01 a V20, importação da
  versão que o catálogo declara.
- `core/DES-0004` 2.0.0: sai o atalho da curva 4 (REQ-FEAT-0003-12 retirado); provas sobre a versão 2.
  `core/DES-0006` 2.0.0: sai a ordem de entrega (REQ-FEAT-0007-12 retirado); NFR-0013 provado na versão 2 com e
  sem o acabamento construído; o traço da revisão 2 continua sobre a versão 1. `core/DES-0001` 1.1.0: os dois
  arquivos publicados são `COMPLETE`.
- `web/DES-0008` 3.0.0: medidas do acabamento sobre a versão 2 (7,0 m no ponto 0, linha de largada a 1,3 m de cada
  borda, virada máxima das bordas de cerca de 7,1°, 691 segmentos por borda); folga dos pneus à pista pela guarda do
  preparo; a contagem de pilhas e as distâncias da face da versão 2 vão ao manifesto do código, com o limite de
  0,05 m afirmado pelo teste. Nenhuma mudança de desenho.
- `security/DES-0012` 1.1.0: dado da versão 2 no pacote, versão 1 e origens fora dele; bloqueio Esri para
  qualquer versão.
- `test-strategy.md` 2.0.0: fixtures da versão 2, da versão 1 e da réplica; linhas de AC-US-0001-08, -09,
  AC-US-0003-12, AC-US-0005-13; linhas de AC-US-0002-*, AC-US-0003-02, AC-US-0005-01, -02, AC-US-0006-07, -08,
  AC-US-0007-01, -07, -11, -12 com os números da revisão 3; REQ-FEAT-0002-19, -20, -21; NFR-0013 com e sem o
  acabamento; E2E-01 e E2E-03 com a réplica. AC-US-0003-09 marcado como retirado.
- `98-divergences.md` 2.0.0: base única na árvore de `281b617` (fecha o aviso ISSUE-03 de
  `dspec-validation-20261103-1924`, deixado na rodada anterior); as 16 linhas antigas resolvidas pelas entregas
  validadas das revisões 1 e 2; 8 linhas abertas para a revisão 3.
- `01-architecture.md` 2.0.0: base, estado do código, linhas da camada, fluxos com `TRACK_VERSION_MISMATCH` e
  `prepare kart-park 2`, compatibilidade do catálogo e do registro, `.gitattributes`, ADR-0008; a seção da ordem de
  entrega vira nota de retirada.
- Sem mudança de texto, só `draft` e versão de correção: `core/DES-0002`, `core/DES-0003`, `web/DES-0009`,
  `adr/ADR-0001`, `adr/ADR-0003`, `adr/ADR-0004`, `adr/ADR-0005`, `adr/ADR-0007`.
- `00-index.md` e `99-traceability.md` regenerados pelo gate (`lint_artifacts.py --emit`).

**Ids**: novo `ADR-0008`. Nenhum `DES` ou `DM` novo nem retirado. `sources:` sem os `REQ-*` retirados pelo F-Spec
(REQ-FEAT-0002-03, REQ-FEAT-0003-12, REQ-FEAT-0007-12, REQ-FEAT-0008-28, -29) e com os novos (REQ-FEAT-0001-15,
-16, REQ-FEAT-0002-19, -20, -21, REQ-FEAT-0003-16, REQ-FEAT-0005-20).

**Migração de verificações planejadas** (conventions §17)

| Verificação | Antes | Agora |
|---|---|---|
| V01 (`scripts/trackChecks.ts`; CHK-TEST-0001-01, -06) | correspondência por índice com a origem, 0,30 m | ponto 0 a no máximo 0,10 m do ponto 0 da réplica (RULE-0002 2.0.0) |
| V03, V06, V07, V09, V12, V13, V14, V16 | números da versão 1 (680,625–694,375 m; larguras 4,4–10,8 m; 0,30 m; 201,6 / 350,3 / 529,9 m; 34 trechos por índice fracionário; 371–414 / 580–615 m; `trackVersion` 1) | os da revisão 3, mesmo id |
| V19, V20 | — | novas (limites em retas; zebra sem cruzar a largada) |
| CHK-TEST-0012-07 (`tests/pista-kart-park-publication.test.ts:163`) | a única entrada `kart-park` é a 1, resumo literal | o resumo literal da versão 1 continua; "única entrada" passa a "a entrada 1 intacta e a 2 acrescentada" |
| CHK-TEST-0012-03 (`:70`) | reprodução da versão 1 | continua, e ganha a reprodução da versão 2 |
| determinismo com `kartParkRev1Trace.json` (`tests/pista-kart-park-determinism.test.ts:72`) | prova de NFR-0013 1.x (antes e depois da revisão 2) | continua sobre a versão 1, como prova de que a simulação não mudou; NFR-0013 2.0.0 passa à execução com e sem o acabamento na versão 2 |
| verificações de sessão, tela, cena e volta sobre `kart-park-v1.json` | versão 1 | versão 2, mesmo id; o piloto de testes recalibrado |

**Verificações retiradas, pendentes de aprovação humana** (conventions §17): a prova do atalho da curva 4
(`tests/pista-kart-park-lap.test.ts:173-187`, AC-US-0003-09) e a afirmação "nenhuma barreira no atalho de 12–26 m
da curva 4" (`tests/pista-kart-park-track-file.test.ts:248-263`, parte de CHK-TEST-0001-12), que seguem
AC-US-0003-09 e REQ-FEAT-0003-12, retirados pelos requisitos e pelo F-Spec na revisão 3; as verificações
específicas da versão 1 de V01 a V18 (correspondência por índice, suavização, 34 trechos), que deixam de julgar o
arquivo da versão 1, agora julgado pelo resumo; e o registro da ordem de entrega no manifesto (REQ-FEAT-0007-12).
A base é a revisão 3 do seed, escrita pelo dono do produto, e as retiradas já feitas upstream; a confirmação do
dono do produto fica pedida no relatório desta rodada, como na rodada 5 do F-Spec.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` desta rodada (Mode A por mudança de revisão); o aviso ISSUE-03
de `dspec-validation-20261103-1924`, deixado para uma rodada Mode A, é fechado pela base única de
`98-divergences.md`.

**Itens recusados ou não aplicados, com motivo**

- Reamostrar a réplica a passo fixo: recusado (ADR-0008); os pontos da réplica já estão a cerca de 1 m e o F-Spec
  verifica o resultado, não o método.
- Apagar o preparo da versão 1 de `scripts/trackPrep.ts`: recusado (ADR-0008); é a mudança maior e retiraria a
  prova de reprodução da versão 1.
- Empacotar o arquivo da versão 1 no jogo: recusado (ADR-0008); sem uso e a uma linha de uma opção que o carregue.
- Novo código de erro além de `TRACK_VERSION_MISMATCH` para "outro `trackId`": não criado; API-0002 2.0.0 põe os
  dois casos no mesmo código.
- Subir `registryVersion` para a forma nova de `prep`: não adotado; `prep.method` é opcional e a ausência vale a
  forma de antes, de modo que o leitor antigo e o novo leem as duas entradas (DM-0002).
- Regra nova em `.gitattributes`: desnecessária; `.gitattributes:5-7` já cobre os arquivos novos. O projeto
  acrescenta só a prova em `npm test`.
- Recalcular aqui a face de colisão e a contagem de pilhas da versão 2: não feito; o arquivo da versão 2 ainda
  não existe, e calcular sobre um preparo provisório anteciparia o código. O limite de 0,05 m é afirmado pelo teste
  e os valores vão ao manifesto.
- Mudar `BARRIER_HALF_WIDTH_M`, `CURB_GRIP_PC`, `STEP` ou o desenho do acabamento: não aplicável; a revisão 3 não
  os pede.
- Leituras fora do F-Spec, declaradas: o código da raiz em `281b617` (`src/trainingSession.ts`, `src/main.ts`,
  `scripts/track-pipeline.ts`, `scripts/trackPrep.ts`, `scripts/trackChecks.ts`, `tracks/registry.json`,
  `.gitattributes`, `tests/fixtures/kartParkFiles.ts` e linhas de testes), para posicionamento. Da réplica, em
  `200 Requirements/220 Input/pista-kart-park/replica/`, só com scripts descartáveis fora do repositório: o tamanho,
  o SHA-256 e os nomes das chaves (o formato que o preparo lê) e agregados de viabilidade (comprimento da poligonal
  convertida, conjunto das larguras, extensão das zebras, sinal da área, elemento dos pontos de setor, virada das
  bordas); nenhum valor dela entrou como requisito, e os números do projeto são os do F-Spec.

## 2026-11-06 — rodada de 2026-11-06, Mode B (`dspec-validation-20261106-1828`, FAIL)

Corrige só as issues do relatório; nenhum módulo, arquivo, campo, verificação ou elemento de tela novo.

| Item | Arquivo | Mudança |
|---|---|---|
| ISSUE-01 (error) | DM-0001 2.0.1, DM-0002 2.0.1 | a reversão da revisão 3 deixa de ser `git revert` que retira arquivos: devolve ao estado anterior só a entrada `kart-park` do catálogo do treino (`src/trainingSession.ts`) e a importação de `src/main.ts`; `src/tracks/kart-park-v2.json`, `tracks/sources/kart-park-replica.json` e a entrada `kart-park` 2 do registro ficam intactos, como API-0001 (Compatibilidade), I3 e REQ-FEAT-0002-17, -18 exigem. O teste da reversão afirma que os arquivos das versões 1 e 2 continuam presentes com o `sha256` registrado e a réplica com o `prep.originSha256` registrado na entrada 2; o registro revertido tem as entradas 1 e 2 iguais às de antes |
| ISSUE-02 (info) | ADR-0001 1.0.2 | a consequência para `race-lap-validation` passa a dizer que a mudança já foi aplicada por aquela feature (commit `32d0adf`), com as âncoras atuais (`tests/race-lap-validation-track-data.test.ts:18-30`, `:32-40`), como em 01-architecture.md |
| ISSUE-03 (info) | DES-0008 3.0.1 | âncoras de `src/main.ts` reconferidas na árvore de `281b617`: mensagem sem WebGL `:30-35`; `minimap` `:404-420`; câmera de visão geral `:615-622` e `applyCameraView` `:522-529`; câmera de sombra `:46-47`; `chooseTrack` `:225-251`, com `ground.visible` já existente em `:239` (a linha do Posicionamento marcada como já entregue) |
| ISSUE-04 (info) | DES-0007 2.0.1 | a tabela de `src/main.ts` reancorada na árvore de `281b617`: `chooseTrack` `:225-251` (existente, não "nova"), `renderOffer` `:253-286`, `beginLap` `:309-320`, `renderHud` `:425-459`, `renderTrainingResult` `:462-488` com o crédito em `:485`, `renderResult` `:489-517` sem `lap-result-credit`, `idleKart` `:563`, aviso de toque `:639-642`; os trechos entregues pelas revisões 1 e 2 marcados como existentes e só a importação (`:13`), as fontes (`:156`) e o aviso de `TRACK_VERSION_MISMATCH` como mudança da revisão 3. As âncoras de `index.html` do Posicionamento (`#lap-training-result` `:26`, `#lap-result` `:27`) carregadas junto, por serem o mesmo fato (`lap-result-credit` já retirado) |

**Divergências**: nenhuma registrada nesta rodada; as 8 de `98-divergences.md` 2.0.0 ficam como estão.

**Itens recusados ou não aplicados, com motivo**

- Marcar como já existentes `src/rawImports.d.ts` ("novo") e as regras `.track-selector`/`.track-credit` de
  `src/style.css` ("alterado") no Posicionamento de DES-0007: não aplicado; o relatório não os aponta e a rodada
  Mode B toca só as issues listadas (§16). Fica para a próxima rodada Mode A ou C.
- Desfazer a revisão 3 por `git revert` dos commits de código: recusado (ISSUE-01); retiraria uma versão
  publicada e a sua entrada do registro, contra I3 e API-0001.
