---
title: Changelog — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: req
status: validated
version: 4.4.0
sources: [SEED, DOMAIN]
---

# Changelog

## 2026-10-21 — rodada 1, Mode A (geração a partir do seed revision 1 e de `DOMAIN.md`)

**O que mudou**

- Conjunto gerado do zero a partir de `SEED.md` (`revision: 1`, `date: 2026-10-21`) e das decisões de
  2026-10-21 em `DOMAIN.md`: `01-context.md`, `02-glossary.md`, cinco histórias (US-0001 a US-0005, uma
  por história do seed), nove NFRs (NFR-0001 a NFR-0009) e o registro `98-divergences.md`, sem linhas.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.
- Decisões de `DOMAIN.md` aplicadas no lugar dos pontos abertos do seed, com o rótulo `DOMAIN/DEC-nn`
  (nn = número do ponto que fecha), definido em `01-context.md`: DEC-01 (250 ms / 300 ms) em US-0001;
  DEC-02 (45 km/h no raio de 18 m) em US-0002, US-0003 e US-0004; DEC-03 (200 ms) em US-0002; DEC-04
  (400 ms) em US-0003; DEC-05 (3,0 s, piloto de 75 kg) e DEC-06 (95 km/h) em US-0004; DEC-07 (27 s, sem
  sair do asfalto) em US-0005. A referência de sensação (Karting Superstars) ganhou o rótulo
  `DOMAIN/REF-01`.
- Ponto aberto 08 do seed (rodada de teste do dono do produto) mantido como critério final humano, fora
  dos critérios de aceite, registrado em `01-context.md` e em US-0005 (`DOMAIN/DEC-08`); não bloqueia.
- Restrições do seed sem história própria tornadas mensuráveis como NFR: camada de simulação
  (NFR-0005), contrato de passo (NFR-0006), preset Realista (NFR-0007), validação de volta (NFR-0008),
  acerto versionado (NFR-0009). Os quatro NFRs do seed viraram NFR-0001 a NFR-0004.
- Decisão do autor para esta rodada registrada em `01-context.md`: o código fica na raiz do repositório
  (`src/`, `tests/`), não em `400 Code/Source/`; os presets ficam em `src/physics.ts`.
- Interações com `race-lap-validation` registradas em `01-context.md` e NFR-0008: nenhum feedback
  enviado, porque nenhum requisito daquela feature precisa mudar.

**Itens fechados**: nenhum `ISSUE-<nn>` ou `FB-<nn>` (primeira rodada); pontos abertos 01 a 07 fechados
por `DOMAIN.md`.

**Itens recusados, com motivo**

- `NOTES.md` da pasta do seed não foi lido (fora da lista de entrada da etapa).
- `docs/physics.md`, `requirements/10`, `requirements/11` e a raiz de código não foram lidos (fora da
  lista de entrada da etapa, conventions §12); os números "de hoje" usados são os que o seed cita.
- Magnitude da perda de velocidade no contato com a parede: não fixada. O seed diz só "a parede custa
  tempo"; AC-US-0004-05 exige redução de velocidade a cada contato, sem percentual, para não inventar
  limiar de domínio.
- Perda na grama abaixo de 45 km/h e com esterço diferente de 0: não fixada; o seed dá um único
  percentual (30 % em 1 s) sem velocidade de entrada, e este conjunto o aplica nas duas velocidades que o
  seed e `DOMAIN.md` já nomeiam (velocidade estabilizada e 45 km/h).
- Limite de recuperação da traseira para redução parcial do esterço (`web-mobile`): não fixado; DEC-04
  diz "ao reduzir o esterço" e o critério foi medido com esterço levado a 0, única forma comum aos dois
  canais. Proposta ao autor para `SCOPE-BACKLOG.md`: "2026-10-21 req-loop rodada 1 — em `web-mobile`,
  vale o limite de 400 ms também para redução parcial do esterço (por exemplo, a metade)?"
- Janela de estabilização para medir o regime da taxa de guinada: não fixada neste conjunto; é parâmetro
  de ensaio, registrado em `docs/physics.md` (NFR-0004) e reportado pelo ensaio (AC-US-0001-06), não
  limiar de domínio.
- Limite de resposta para inversão do esterço (de 1 a −1): não fixado pelo seed; o caso anormal de
  US-0001 usa a soma dos limites existentes (250 ms + 300 ms), sem número novo.
- Nenhum critério de acessibilidade, idioma, latência de entrada, carregamento ou download foi
  acrescentado: o seed não altera esses aspectos (famílias dispensadas em `01-context.md`).

## 2026-10-21 — rodada 2, Mode B (gate determinístico, 8 erros G4)

**Issues desta rodada** (uma por linha de erro do gate)

- ISSUE-01 — `nfr/NFR-0003`: `AC-US-0001-04` lido como definição de critério filho de US-0001 dentro de NFR-0003.
- ISSUE-02 — `nfr/NFR-0006`: `AC-US-0005-06` lido como definição dentro de NFR-0006.
- ISSUE-03 — `nfr/NFR-0009`: `AC-US-0005-04` lido como definição dentro de NFR-0009.
- ISSUE-04 — `nfr/NFR-0009`: `AC-US-0005-05` lido como definição dentro de NFR-0009.
- ISSUE-05 — `stories/US-0001`: `AC-US-0001-04` já definido em NFR-0003 (duplicata).
- ISSUE-06 — `stories/US-0005`: `AC-US-0005-04` já definido em NFR-0009 (duplicata).
- ISSUE-07 — `stories/US-0005`: `AC-US-0005-05` já definido em NFR-0009 (duplicata).
- ISSUE-08 — `stories/US-0005`: `AC-US-0005-06` já definido em NFR-0006 (duplicata).

**O que mudou**

- Causa única: o gate trata todo token `AC-US-nnnn-nn` num arquivo com id como definição de critério
  filho; os três NFRs só referenciavam critérios das histórias. As referências foram reescritas em prosa,
  sem id de critério: NFR-0003 → "critério 04 de US-0001"; NFR-0006 → "critério 06 de US-0005";
  NFR-0009 → "critérios 04 e 05 de US-0005". Fecha ISSUE-01 a ISSUE-04 por edição.
- ISSUE-05 a ISSUE-08 são consequência das mesmas definições indevidas: com os NFRs corrigidos, cada
  critério fica definido uma única vez, na sua história. Nenhuma linha das histórias foi alterada; os
  critérios AC-US-0001-04 e AC-US-0005-04 a 06 continuam com o mesmo texto. Fechados pelas mesmas
  edições.
- Nenhum requisito, história, critério, campo ou limite acrescentado ou removido (conventions §16).
- `00-index.md` e `99-traceability.md` não foram tocados: o gate os regenera.

**Itens fechados**: ISSUE-01 a ISSUE-08. Divergências registradas: nenhuma.

**Itens recusados, com motivo**: nenhum.

## 2026-10-21 — rodada 3, Mode B (relatório `req-validation-20261021-1603.md`, 5 erros)

**O que mudou**

- ISSUE-01 (R3, US-0003 / glossário): "Condução normal" redefinida em `02-glossary.md` como passo em que
  a condição de forçar não se mantém **e** a manobra de drift de `requirements/11` não está em andamento;
  "Condição de forçar" passou a dizer "fora da manobra de drift, único contexto…". AC-US-0003-01 e
  AC-US-0003-05 carregam a mesma ressalva entre parênteses; a seção Canais de US-0003 (`web-mobile`)
  carrega a mesma ressalva. AC-US-0003-02 e o caso anormal "Drift em andamento" não mudaram. Fechada por
  edição.
- ISSUE-02 e ISSUE-03 (R3, US-0001), fechadas juntas pela segunda forma que ISSUE-03 oferece: a condição
  "esterço 1 ou −1" foi incorporada a AC-US-0001-01 (subida) e AC-US-0001-02 (queda), com o regime em
  módulo; o antigo AC-US-0001-03 (lado oposto por referência) foi retirado e o seu número passou a ser a
  subida com esterço parcial em `web-mobile` (90 % em 250 ms), enquanto AC-US-0001-04 ficou só com a
  queda com esterço parcial (10 % em 300 ms). Seis critérios antes, seis depois; nenhum limite, canal ou
  comportamento novo. Referências renumeradas: seção Canais de US-0001 ("critérios 03 e 04" para esterço
  parcial; esterço binário "0, 1 ou −1"), AC-US-0001-06 ("critérios 01 e 02"), caso anormal "Sensor
  ausente" ("critérios 01 e 02") e NFR-0003 ("critérios 03 e 04 de US-0001").
- ISSUE-04 (R3, US-0001, caso anormal "Esterço invertido"): o limiar derivado de 250 ms + 300 ms foi
  retirado; o caso registra que o seed não fixa limite para a inversão, que este conjunto não fixa nenhum e
  que um limite, se desejado, é pedido ao autor do seed. Supera o item "Limite de resposta para inversão do
  esterço" dos recusados da rodada 1. Fechada por edição.
- ISSUE-05 (R7, `01-context.md`, Restrições): a frase "O código deste projeto fica na raiz do repositório
  (`src/`, `tests/`); os presets ficam em `src/physics.ts` (decisão do autor para esta rodada)" foi
  removida; permanece só a restrição citada do seed. A decisão do autor sobre o layout do repositório
  continua registrada neste changelog (rodada 1) como contexto para `300 Specs/330 D-Specs`, não como
  requisito. Fechada por edição.
- Nenhum requisito, história, critério, campo ou limite acrescentado (conventions §16). `00-index.md` e
  `99-traceability.md` não foram tocados: o gate os regenera.

**Itens fechados**: ISSUE-01 a ISSUE-05. Divergências registradas: nenhuma.

**Itens recusados, com motivo**: nenhum. Proposta ao autor para `SCOPE-BACKLOG.md`, sem acrescentar nada ao
conjunto: "2026-10-21 req-loop rodada 3 — a inversão do esterço (de 1 a −1 num passo) a 50 km/h deve ter
limite de resposta próprio? O seed não o fixa."

## 2026-10-21 — rodada 4, Mode B (relatório `req-validation-20261021-1608.md`, 2 erros)

**O que mudou**

- ISSUE-01 (R4, US-0001, AC-US-0001-05): o critério que exigia `grip` em todos os passos dos critérios
  01 a 04 (sem fonte) foi reescrito com a decisão do dono do produto de 2026-10-21 em `DOMAIN.md`
  (rotulada `DOMAIN/DEC-09` em `01-context.md`): o veredito dos ensaios 01 a 04 depende só do tempo
  medido da taxa de guinada; `understeer` reportado durante o ensaio não falha o ensaio; a aderência em
  curva é julgada só pelo ensaio de 45 km/h no raio de 18 m (US-0002). A forma "nenhum `oversteer`/
  `sliding`" que o relatório oferecia não foi usada: a decisão do autor restringe o critério ao tempo de
  resposta, e a 50 km/h com esterço cheio e acelerador o seed (`SEED/US-3`) admite a traseira solta
  quando o Jogador força. `sources:` de US-0001 e a seção Fontes ganharam `DOMAIN/DEC-09`; a tabela de
  rótulos e a tabela de aplicação de `01-context.md` ganharam a linha de `DOMAIN/DEC-09`. Fechada por
  edição.
- ISSUE-02 (R3, US-0002, AC-US-0002-05): a condição "acelerador 0 mantido ou acelerador cheio mantido
  durante toda a curva" foi incorporada a AC-US-0002-01 e AC-US-0002-02, cada um valendo nas duas
  condições; o antigo critério 05 foi retirado e o antigo 06 (saída do ensaio) passou a ser
  AC-US-0002-05, reportando a maior duração de `understeer` por condição de acelerador. Seis critérios
  antes, cinco depois, com o mesmo conteúdo. Nenhum caso anormal nem outro arquivo referenciava o
  critério 05 ou 06 de US-0002. Fechada por edição.
- Nenhum requisito, história, critério, campo ou limite acrescentado (conventions §16). `00-index.md` e
  `99-traceability.md` não foram tocados: o gate os regenera.

**Itens fechados**: ISSUE-01 e ISSUE-02. Divergências registradas: nenhuma.

**Itens recusados, com motivo**: nenhum.

## 2026-10-21 — rodada 5, Mode A (seed `revision: 2`, acerto agressivo de `DOMAIN.md`)

**Gatilho**: o seed passou a `revision: 2` (mesma data, mesmo autor). O dono do produto testou a build atual
("não vira, não ganha velocidade") e, na última entrada de `DOMAIN.md`, substituiu os valores fechados dos
pontos abertos 01, 02, 05, 06 e 07 pelo acerto agressivo; 03, 04 e a regra "resposta do volante só mede
guinada" permanecem; o ciclo do ponto 08 ficou definido (staging + feedback curto do dono, sem preset
experimental extra). Decisões do autor recebidas para esta rodada e carregadas sem redescoberta.

**O que mudou**

- `01-context.md` (2.0.0): seed `revision: 2`; novo rótulo `DOMAIN/REF-02` (acerto agressivo) e
  `DOMAIN/DEC-10` (ciclo de teste do ponto 08); `DOMAIN/DEC-01`, `02`, `05`, `06` e `07` redefinidos com
  os valores em vigor (180 ms / 250 ms; 50 km/h; 2,5 s; 105 km/h; 25 s), cada um dizendo qual valor
  substitui; `DOMAIN/DEC-09` passa a citar o ensaio de 50 km/h; parágrafo do ponto 08 descreve o ciclo em
  staging e a ausência de preset experimental no painel. Famílias de NFR, restrições e lista fora do escopo
  inalteradas.
- `02-glossary.md` (2.0.0): "Condição de forçar" e "Curva de referência" a 50 km/h; termos novos "Acerto
  agressivo" e "Staging".
- US-0001 (2.0.0): 180 ms (subida) e 250 ms (queda) nos critérios 01 a 04, na seção Canais e no caso
  anormal de velocidade; critério 05 cita o ensaio de 50 km/h; `DOMAIN/REF-02` em `sources:`.
- US-0002 (2.0.0): curva de referência a 50 km/h nos critérios 01 e 02, na seção Canais e no primeiro
  caso anormal; 200 ms e 15 % mantidos.
- US-0003 (2.0.0): condição de forçar acima de 50 km/h na seção Canais e no critério 01; 400 ms e
  0,65 rad mantidos.
- US-0004 (2.0.0): 2,5 s no critério 01; 105 km/h no critério 02; grama com entrada a 50 km/h no critério
  04 e no caso anormal; critério 07 passa a dizer "bench de física" em vez de nomear o script
  (`ISSUE-01` info do relatório `req-validation-20261021-1627.md`, aceita).
- US-0005 (2.0.0): 25 s no critério 03 e no caso anormal; caso anormal novo "Rodada de acerto reprovada
  pelo dono do produto em staging" (`DOMAIN/DEC-10`), sem critério novo.
- NFR-0002, NFR-0007 (2.0.0): "bench de física" em vez de `npm run bench:physics` (mesma info).
  NFR-0004 (2.0.0): idem, e a entrada de `docs/physics.md` passa a dizer a versão de acerto a que se
  refere, com os limites da revisão 2 ao lado dos da linha de base (`DOMAIN/REF-02` em `sources:`).
- NFR-0001, NFR-0003, NFR-0005, NFR-0006, NFR-0008, NFR-0009 e `98-divergences.md`: sem mudança de
  conteúdo; carregados na versão 1.0.0 (nenhum número da revisão 2 os atinge).
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera.

**Tabela de migração** (conventions §17): nenhum item retirado. Cinco histórias e nove NFRs antes e depois;
32 critérios antes e depois (6 + 5 + 7 + 7 + 6 + 0 novos); só valores numéricos e referências mudaram.

**Itens fechados**: nenhum `ISSUE-<nn>`/`FB-<nn>` pendente (o último relatório era SUCCESS); a `ISSUE-01`
info daquele relatório foi aplicada. Divergências registradas: nenhuma.

**Itens recusados, com motivo**

- Decisão do autor "código fica na raiz do repositório (`src/`, `tests/`); presets em `src/physics.ts`;
  benches em `scripts/`": não escrita em `01-context.md` nem em critério, pelo mesmo motivo da rodada 3
  (ISSUE-05, R7: escolha de desenho). Fica registrada aqui como contexto para as etapas de F-Spec e D-Spec,
  que o autor pediu para reprocessar contra a revisão 2.
- "Sem preset experimental extra" não entrou na lista Fora do escopo: a lista é a do seed, que não o
  nomeia; a decisão está no parágrafo do ponto 08 de `01-context.md` (`DOMAIN/DEC-10`).
- Nenhum critério de aceite para o ciclo em staging: o veredito do dono do produto não é observável pelo
  sistema; permanece condição humana de fechamento (`DOMAIN/DEC-08`, `DOMAIN/DEC-10`).
- Os valores anteriores (250/300 ms, 45 km/h, 3,0 s, 95 km/h, 27 s) não permanecem como critério
  alternativo nem como piso: `DOMAIN.md` diz "substitui".
- Os itens recusados das rodadas 1 e 3 continuam recusados pelos mesmos motivos (parede sem percentual;
  grama abaixo da velocidade de referência; recuperação com esterço parcial; janela de estabilização;
  inversão do esterço). As duas propostas de `SCOPE-BACKLOG.md` daquelas rodadas seguem valendo.

## 2026-10-21 — rodada 6, Mode A (seed `revision: 3`, correção de fato e método dos ensaios)

**Gatilho**: o seed passou a `revision: 3` (mesma data, mesmo autor) depois do FAIL SPEC da etapa de código
(`300 Specs/330 D-Specs/Output/dirigibilidade/reports/feedback/feedback-20261021-1827.md`): a pista
sintética não tem curva de raio 18 m (raios mínimos 24 m e 25 m, grampo de 4 m), e o regime da resposta do
volante com acelerador 0 não é estacionário. Nenhum limiar do dono do produto mudou. Decisões do autor
recebidas para esta rodada e carregadas sem redescoberta: a curva de referência é um ensaio em pista de
teste (arco de raio 18 m, faixa da largura da pista, sem paredes, ambiente de ensaio próprio); o ensaio de
resposta do volante roda em reta com a velocidade mantida em 50 km/h pelo acelerador e o regime é o valor
estabilizado nessa condição; só a volta do piloto de teste usa a pista sintética.

**O que mudou**

- `01-context.md` (3.0.0): seed `revision: 3`; parágrafo novo "Onde cada ensaio roda"; rótulos novos
  `SEED/RD-06` (regra de domínio da revisão 3) e `DOMAIN/REF-03` (entrada da revisão 3 de `DOMAIN.md`);
  `DOMAIN/DEC-01`, `DEC-02`, `DEC-03` e `DEC-09` redigidos com o local (pista de teste) e o método
  (velocidade mantida, regime estacionário), mesmos valores; linha de aplicação de `DOMAIN/REF-03` /
  `SEED/RD-06`; parágrafo "Padrão seguro" declara que a tela de seleção de acerto não recebe elemento
  novo (`ISSUE-01` info do relatório `req-validation-20261021-1742.md`, aceita na forma de declaração em
  contexto, sem critério novo); relação com `race-lap-validation` diz que a pista de teste não é pista
  publicada nem toca a pista sintética. Famílias de NFR, restrições e lista fora do escopo inalteradas.
- `02-glossary.md` (3.0.0): "Pista de teste" (termo novo), "Pista sintética" (raios reais; sem curva de
  18 m; só a volta do piloto de teste), "Curva de referência" (ensaio na pista de teste), "Velocidade
  mantida" (termo novo), "Regime da taxa de guinada" (velocidade mantida, janela curta e estacionária),
  "Velocidade de início do subesterço" (na pista de teste), "Linha de base" (mesmo ambiente), "Ensaio"
  (inclui ambiente), "Asfalto" (inclui a faixa da pista de teste); "Recuperação" (termo novo: passos entre
  soltar o esterço sob a condição de forçar e o primeiro `grip`, no máximo 400 ms) e "Condução normal"
  passa a excluir a recuperação; "Condição de forçar" cita a recuperação.
- US-0001 (3.0.0): pré-condições e critérios 01 a 04 na reta da pista de teste com a velocidade mantida
  em 50 km/h pelo acelerador; critério 01 define o regime como valor estabilizado com a velocidade mantida
  numa janela curta e estacionária; critério 05 cita o arco da pista de teste; critério 06 passa a exigir
  na saída do ensaio o regime em rad/s e a velocidade mínima e máxima observadas (prova de velocidade
  mantida), além dos tempos e da janela; caso anormal novo "Velocidade não mantida durante o ensaio";
  seção Canais diz que o Jogador não pilota na pista de teste. Seis critérios antes e depois.
- US-0002 (3.0.0): pré-condições e critérios 01 a 03 na curva de referência da pista de teste (arco de
  raio 18 m, faixa da largura da pista, sem paredes); critério 02 passa de "permanece no asfalto" a
  "permanece dentro da faixa de asfalto do arco" (mesma exigência, no ambiente certo); critério 03 exige a
  linha de base no mesmo ensaio e no mesmo arco; critério 05 reporta também o raio do arco e a largura da
  faixa; caso anormal "Grama ou parede durante a curva" substituído por "Kart sai da faixa de asfalto do
  arco" (a pista de teste não tem grama nem parede) e "Linha de base ausente" diz que uma linha de base
  em curva da pista sintética não serve. Cinco critérios antes e depois.
- US-0003 (3.0.0): critério 01 cita a curva de referência da pista de teste; critérios 01, 02 e 05
  carregam a exclusão da recuperação da condução normal (derivada do segundo critério de `SEED/US-3`,
  que admite a traseira solta até 400 ms depois de reduzir o esterço); critério 04 diz "em nenhum passo
  da recuperação"; critério 07 reporta também a derrapagem máxima em condução normal e a contagem de
  passos de condução normal com `oversteer`/`sliding`; caso anormal novo "Recuperação que não volta a
  `grip` em 400 ms". Sete critérios antes e depois. Isso responde, no nível dos requisitos, ao
  SPEC-ISSUE-06 do feedback do código: os passos de recuperação não são condução normal.
- US-0005 (3.0.0): seção Canais diz que a volta do piloto de teste é o único ensaio na pista sintética
  (raios reais); `SEED/RD-06` e `DOMAIN/REF-03` nas fontes. Critérios inalterados.
- NFR-0004 (3.0.0): a entrada de `docs/physics.md` registra o ambiente de cada ensaio, o modo de manter a
  velocidade, a faixa de velocidade observada, o raio do arco e a largura da faixa.
- US-0004, NFR-0001, NFR-0002, NFR-0003, NFR-0005, NFR-0006, NFR-0007, NFR-0008, NFR-0009 e
  `98-divergences.md`: sem mudança de conteúdo; carregados na versão em que estavam (nenhum item da
  revisão 3 os atinge: a grama, a parede, 0–60 km/h e a velocidade estabilizada não têm ambiente fixado
  pelo seed e continuam como estavam).
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera.

**Tabela de migração** (conventions §17): nenhum item retirado. Cinco histórias e nove NFRs antes e depois;
32 critérios antes e depois (6 + 5 + 7 + 7 + 6 + 0 novos); três termos novos no glossário (Pista de
teste, Velocidade mantida, Recuperação); só ambiente, método e referências mudaram, nenhum valor
numérico.

**Itens fechados**: nenhum `ISSUE-<nn>`/`FB-<nn>` pendente (o último relatório era SUCCESS); a `ISSUE-01`
info daquele relatório foi aplicada como declaração em `01-context.md`. Divergências registradas: nenhuma.

**Itens recusados, com motivo**

- SPEC-ISSUE-01 e SPEC-ISSUE-02 do feedback do código: fechados pelo próprio seed (revisão 3) e carregados
  acima; nenhuma ação própria desta etapa além de refletir o seed.
- SPEC-ISSUE-03 (origem dos registros antigos de `SETUP_VERSION`), SPEC-ISSUE-04 (entrada do Realista em
  `BenchOptions`) e SPEC-ISSUE-05 (literal do estado inicial de `surface`): são interface e desenho de
  projeto (R7); nenhum critério deste conjunto os fixa. O seed não fixa o estado de aderência exibido
  antes do sinal verde (AC-US-0004-06 vale entre o sinal verde e o fim da volta), por isso nada foi
  acrescentado. Ficam para o D-Spec, como o autor decidiu.
- Decisão do autor "código fica na raiz do repositório; presets em `src/physics.ts`; benches em
  `scripts/`; o código parcial existente pode ser lido como as-built, mas o projeto vence": não escrita em
  critério (escolha de desenho, R7); registrada aqui como contexto para as etapas de F-Spec e D-Spec. A
  raiz de código não foi lida (conventions §12).
- Modo de manter a velocidade em 50 km/h (acelerador parcial, janela, ou alimentação a velocidade
  constante): não fixado; é parâmetro de ensaio registrado em `docs/physics.md` (NFR-0004) e reportado na
  saída do ensaio (AC-US-0001-06). O que o conjunto exige é a condição observável: velocidade mantida e
  regime estacionário.
- Largura da faixa e comprimento do arco da pista de teste: não fixados em número; o seed diz "faixa da
  largura da pista" e não dá o comprimento; o ensaio reporta o raio e a largura usados (AC-US-0002-05).
- Ambiente dos ensaios de grama, parede, 0–60 km/h e velocidade estabilizada (US-0004): não fixado; a
  revisão 3 só atribui ambiente aos ensaios de resposta do volante, curva de referência e volta do piloto
  de teste. Proposta ao autor para `SCOPE-BACKLOG.md`: "2026-10-21 req-loop rodada 6 — os ensaios de
  US-4 (0–60 km/h, velocidade estabilizada, grama, parede) rodam na pista sintética ou na pista de teste?"
- Os itens recusados das rodadas 1, 3 e 5 continuam recusados pelos mesmos motivos (parede sem percentual;
  grama abaixo da velocidade de referência; recuperação com esterço parcial; janela de estabilização;
  inversão do esterço; valores anteriores não permanecem como piso). As propostas de `SCOPE-BACKLOG.md`
  daquelas rodadas seguem valendo.

## 2026-10-22 — rodada 7, Mode B (relatório `req-validation-20261022-1411.md`, 2 erros e 1 info)

**Gatilho**: a entrada de 2026-10-22 de `DOMAIN.md`, "Fim da varredura de início do subesterço", decidida
pelo dono do produto após a parada do D-Spec, e a decisão do autor passada a esta rodada: incorporá-la em
US-0002 e nos seus critérios de aceite, com o motivo de reprovação por falta de medida, e nada mais muda
nos requisitos. O seed segue em `revision: 3`.

**O que mudou**

- `01-context.md` (3.1.0): rótulo novo `DOMAIN/DEC-11` na tabela "Itens do seed e decisões de domínio",
  com o texto da decisão; linha `DOMAIN/DEC-11` na tabela "Decisões de domínio aplicadas" (US-0002,
  critérios 03 e 04 e caso anormal de saída da faixa; não muda os critérios 01 e 02); o parágrafo da
  camada de domínio e a introdução das decisões aplicadas citam a entrada de 2026-10-22.
- US-0002 (3.1.0): `DOMAIN/DEC-11` em `sources:` e em Fontes. Critério 03: o ensaio de início do
  subesterço é descrito como na decisão — velocidade crescente no arco de raio 18 m, numa varredura (antes:
  "velocidade de entrada crescente") — e, com o novo acerto, a saída da faixa abaixo de 50 km/h reprova
  por saída do asfalto. Critério 04: a não diminuição do `understeer` vale nas velocidades medidas acima de
  50 km/h (antes: "velocidades de entrada acima de V1"); a saída da faixa acima de 50 km/h é o fim da
  varredura e não reprova se pelo menos duas velocidades acima de 50 km/h foram medidas antes; a saída
  antes da segunda medição acima de 50 km/h reprova por falta de medida, motivo distinto da saída do
  asfalto. Caso anormal "Kart sai da faixa de asfalto do arco": separa a curva de referência dos
  critérios 01 e 02 (toda saída falha o critério 02, em qualquer velocidade) do ensaio de início do
  subesterço dos critérios 03 e 04 (as três regras da decisão). Seção Canais: os limites da decisão
  constam entre os limites iguais nos dois canais. Pontos em aberto: cita `DOMAIN/DEC-11`.
- `02-glossary.md` (3.1.0): a definição de "Velocidade de início do subesterço" descreve o ensaio como o
  critério 03 (velocidade crescente no arco, varredura que termina na saída da faixa, `DOMAIN/DEC-11`).
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera.

**Leituras registradas** (sem decisão nova):

- A mudança do critério 04 de "acima de V1" para "acima de 50 km/h" carrega a decisão: ela declara que
  as duas velocidades medidas acima de 50 km/h são os dados do critério de que o subesterço não diminui,
  o que só vale se o critério cobre as velocidades acima de 50 km/h. É também a letra do seed ("Acima
  dessa velocidade", a de referência, 50 km/h) e o que o caso anormal "Velocidade de entrada acima de
  50 km/h" já dizia do critério 04.
- As regras de fim e de reprovação valem para a varredura do novo acerto, que é o que o ensaio julga; a
  linha de base (acerto anterior) só fornece V0 e continua regida pelo caso anormal "Linha de base
  ausente".
- O código de motivo de reprovação citado na decisão não é escrito no conjunto (é identificador de
  desenho, R7); os critérios dizem "saída do asfalto" (glossário, Asfalto) e "falta de medida".
- A decisão diz "abaixo" e "acima" de 50 km/h; o conjunto repete os termos e não inventa o caso de saída
  exatamente a 50 km/h. Proposta ao autor para `SCOPE-BACKLOG.md`: "2026-10-22 req-loop rodada 7 — no
  ensaio de início do subesterço, a saída da faixa exatamente a 50 km/h reprova ou encerra a varredura?"

**Tabela de migração** (conventions §17): nenhum item retirado. Cinco histórias e nove NFRs antes e
depois; 32 critérios antes e depois, nenhum novo (as regras da decisão entram nos critérios 03 e 04 de
US-0002); nenhum termo novo no glossário (uma definição ajustada); um rótulo de rastreabilidade novo
(`DOMAIN/DEC-11`), exigido pela `ISSUE-01`.

**Itens fechados**: `ISSUE-01`. Divergências registradas em `98-divergences.md`: nenhuma.

**Itens recusados, com motivo**

- `ISSUE-02` (afrouxar o critério 02 e o caso anormal na condição de acelerador cheio, admitindo a saída da
  faixa acima de 50 km/h): recusada. O autor decidiu, para esta rodada, que a decisão de 2026-10-22 vale
  para o ensaio de início do subesterço (a varredura com a velocidade subindo no arco) e que nada mais
  muda nos requisitos; o título da entrada de `DOMAIN.md` é "Fim da varredura de início do subesterço".
  O critério 02 é a curva de referência com entrada a 50 km/h (`SEED/US-2`, primeiro critério;
  `DOMAIN/DEC-02`, `DOMAIN/DEC-03`), outro ensaio, e admitir nele a saída da faixa enfraqueceria um
  critério, o que nenhuma rodada faz para fechar uma issue. O caso anormal de saída da faixa agora diz
  qual regra vale em cada ensaio: na curva de referência, toda saída falha o critério 02, em qualquer
  velocidade; só na varredura dos critérios 03 e 04 valem as regras de `DOMAIN/DEC-11`.
- `ISSUE-03` (info, separar a cláusula da curva de referência da condução normal em AC-US-0003-01):
  recusada nesta rodada. O autor determinou que nada além da decisão de 2026-10-22 muda nos requisitos;
  a issue é `info`, o próprio validador diz que o critério é decidível e mais estrito que o seed, e a
  mudança seria só de redação, moveria a versão de US-0003 e levaria às etapas de F-Spec e D-Spec uma
  mudança sem conteúdo. Fica para a próxima rodada que tocar US-0003 por motivo de conteúdo.
- Os itens recusados das rodadas 1, 3, 5 e 6 continuam recusados pelos mesmos motivos, e as propostas de
  `SCOPE-BACKLOG.md` daquelas rodadas seguem valendo.

## 2026-10-22 — rodada 8, Mode B (relatório `req-validation-20261022-1425.md`, 3 erros e 1 info)

**Gatilho**: o relatório da rodada 7 (FAIL: `ISSUE-01` a `ISSUE-03`, R3, em US-0002; `ISSUE-04`, info, em
US-0003). Decisão do autor carregada sem redescoberta: a decisão de 2026-10-22 de `DOMAIN.md` ("Fim da
varredura de início do subesterço") fica incorporada em US-0002 e nos seus critérios, com o motivo de
reprovação por falta de medida, e nada mais muda nos requisitos. Fonte nova lida nesta rodada: a entrada
de 2026-10-22 de `DOMAIN.md` "Esclarecimento de método da varredura (redator, sem mudar a decisão acima)",
que define a velocidade medida da varredura. O seed segue em `revision: 3`.

**O que mudou**

- `ISSUE-01` (R3, AC-US-0002-03 não atômico): o critério 03 passa a declarar só a velocidade de início do
  subesterço, V1 ≥ 1,15 × V0. As três regras de `DOMAIN/DEC-11` sobre a saída da faixa na varredura —
  abaixo de 50 km/h reprova por saída do asfalto; acima de 50 km/h encerra a varredura sem reprovar com
  pelo menos duas velocidades medidas acima de 50 km/h antes; antes da segunda medição acima de 50 km/h
  reprova por falta de medida — ficam juntas num critério próprio, AC-US-0002-06: uma única observação
  (a velocidade do kart no passo da saída e as velocidades medidas antes dela) decide como a varredura
  termina. As duas últimas regras saíram do critério 04, que juntava a perda progressiva (telemetria de
  `understeer`) com a saída da faixa, a mesma junção que a issue aponta no critério 03. Fechada por
  edição.
- `ISSUE-02` (R3, AC-US-0002-04 sem velocidade medida definida): o critério 04 aplica `DOMAIN/REF-04`
  — cada velocidade medida é um patamar completo de velocidade mantida no arco, cujo tamanho em km/h e
  cuja duração são parâmetros do ensaio registrados em `docs/physics.md` (NFR-0004); em cada patamar
  toma-se a maior sequência de `understeer` consecutivo dentro dele, em ms de tempo simulado, e esse valor
  não diminui de um patamar para o seguinte, de velocidade maior; a comparação é entre patamares, nunca um
  máximo acumulado. O mínimo de duas velocidades medidas acima de 50 km/h fica com grão (dois patamares
  completos) e é citado do critério 06. Fechada por edição.
- O fato "a varredura mede em patamares de velocidade mantida" foi levado a todos os seus lugares:
  critério 03 (descrição do ensaio), critérios 04 e 06, caso anormal "Kart sai da faixa de asfalto do
  arco" (agora cita os critérios 03, 04 e 06 e diz que as regras são as do critério 06), seção Canais
  ("duas velocidades medidas — patamares completos — acima de 50 km/h"), Fontes e Pontos em aberto de
  US-0002; `02-glossary.md`, "Velocidade de início do subesterço" (menor velocidade medida, em cujo
  patamar a telemetria reporta `understeer` por mais de 200 ms consecutivos) e "Velocidade mantida"
  (passa a cobrir também o valor de cada patamar da varredura, além dos 50 km/h do ensaio de resposta do
  volante, sem mudar o que US-0001 exige); `01-context.md`, rótulo novo `DOMAIN/REF-04` na tabela de
  itens do seed e decisões de domínio, linha `DOMAIN/REF-04` na tabela de decisões aplicadas, linha
  `DOMAIN/DEC-11` passando a citar os critérios 03, 04 e 06, e o parágrafo da camada de domínio citando a
  entrada nova. O critério 05 passa a dizer "o ensaio dos critérios 01 a 04 e 06" (mesmo ensaio, mesmos
  campos).
- `ISSUE-03` (R3, AC-US-0002-02 sem citação dos limiares): o critério 02 cita `SEED/US-2` (primeiro
  critério), `DOMAIN/DEC-02` e `DOMAIN/REF-03`. Fechada por edição.
- Versões: US-0002, `01-context.md`, `02-glossary.md` e este changelog em 3.2.0. `00-index.md` e
  `99-traceability.md` não foram escritos: o gate os regenera.

**Superfície (conventions §16)**: AC-US-0002-06 é um id novo, não um requisito novo. O seu conteúdo — as
três regras de `DOMAIN/DEC-11` — já estava no conjunto reprovado (critérios 03 e 04 e caso anormal de
saída da faixa); a divisão é a que `ISSUE-01` pede ("critério próprio"). O id é o próximo livre: os
critérios existentes mantêm os seus números, porque ids não são reaproveitados nem renumerados
(conventions §4). Nenhum campo novo na saída do ensaio, nenhum limiar novo, nenhum termo novo no
glossário.

**Tabela de migração** (conventions §17): nenhum item retirado. AC-US-0002-03 perde a regra de saída da
faixa abaixo de 50 km/h; AC-US-0002-04 perde as regras de fim da varredura e de falta de medida e ganha a
definição de velocidade medida; as três regras passam a AC-US-0002-06. US-0002 vai de cinco para seis
critérios; o conjunto, de 32 para 33, com o mesmo conteúdo exigido. Cinco histórias e nove NFRs antes e
depois; um rótulo de rastreabilidade novo (`DOMAIN/REF-04`).

**Itens fechados**: `ISSUE-01`, `ISSUE-02`, `ISSUE-03`. Divergências registradas em `98-divergences.md`:
nenhuma.

**Itens recusados, com motivo**

- `ISSUE-04` (info, separar a cláusula da curva de referência da condução normal em AC-US-0003-01):
  recusada de novo, pelo mesmo motivo da rodada 7. O autor determinou para esta rodada que nada além da
  decisão de 2026-10-22 muda nos requisitos; a issue é `info` e não bloqueia; o validador diz que o
  critério é decidível e mais estrito que o seed; a mudança seria só de redação e levaria às etapas de
  F-Spec e D-Spec uma nova versão de US-0003 sem conteúdo. Fica para a próxima rodada que tocar US-0003
  por motivo de conteúdo.
- NFR-0004 não foi tocado: ele já exige, para 100 % dos ensaios citados nos critérios de US-0001 a
  US-0005, o registro dos "parâmetros" de cada ensaio em `docs/physics.md`; o tamanho e a duração do
  patamar são parâmetros do ensaio dos critérios 03, 04 e 06 (`DOMAIN/REF-04`) e já estão cobertos.
  Acrescentá-los à enumeração entre parênteses de NFR-0004 seria item de listagem novo numa rodada de
  correção (conventions §16) e moveria a versão de um NFR validado sem mudar o que ele exige.
- A saída do ensaio (critério 05) não ganhou a lista de patamares, a maior sequência de `understeer` por
  patamar nem o motivo de reprovação: seriam campos novos numa rodada de correção (conventions §16). Os
  critérios 04 e 06 são observados na telemetria por passo e no veredito reportado pelo ensaio, como já
  eram. Proposta ao autor para `SCOPE-BACKLOG.md`: "2026-10-22 req-loop rodada 8 — a saída do ensaio de
  início do subesterço deve listar, por patamar, a velocidade e a maior sequência de `understeer`
  consecutivo em ms, e o motivo da reprovação?"
- O caso em que a varredura termina sem saída da faixa (último patamar do ensaio concluído dentro da
  faixa) não é fixado: `DOMAIN/DEC-11` trata só do fim pela saída da faixa, e o número de patamares é
  parâmetro do ensaio (`DOMAIN/REF-04`). Nada foi acrescentado.
- A proposta de `SCOPE-BACKLOG.md` da rodada 7 (saída da faixa exatamente a 50 km/h) segue valendo, e os
  itens recusados das rodadas 1, 3, 5, 6 e 7 continuam recusados pelos mesmos motivos.

## 2026-10-22 — rodada 9, Mode B (relatório `req-validation-20261022-1817.md`, 5 erros e 2 infos)

**Gatilho**: o relatório de revalidação da rodada 8 (FAIL) após as duas entradas de 2026-10-22 que o dono
do produto escreveu em `DOMAIN.md` depois do FAIL SPEC do código
(`300 Specs/330 D-Specs/Output/dirigibilidade/reports/feedback/feedback-20261022-1803.md`): "Início do
subesterço num acerto que não sai de frente" e "Curva de referência com acelerador zero". Decisão do autor
carregada sem redescoberta: as duas decisões entram em US-0002 (critérios e casos anormais); nenhum outro
limiar muda; nada mais muda. Fonte nova lida nesta rodada, além dessas duas: a entrada de 2026-10-22 de
`DOMAIN.md` "Leitura de 'sem subesterço'" (redator, coerente com o ponto aberto 03 do seed, fechado por
`DOMAIN/DEC-03`; o dono pode reverter), acrescentada depois do relatório (o relatório conta 17 entradas;
a pasta tem 18), que fixa a leitura de "sem `understeer`" de que o critério 03 corrigido precisa para ser
decidível. O seed segue em `revision: 3`.

**O que mudou**

- `ISSUE-01` (R4, `01-context.md`): rótulos novos na chave de rastreabilidade — `DOMAIN/DEC-12` ("Início
  do subesterço num acerto que não sai de frente"), `DOMAIN/DEC-13` ("Curva de referência com acelerador
  zero") e `DOMAIN/REF-05` ("Leitura de 'sem subesterço'", redator) —, cada um com o texto da entrada;
  linhas `DOMAIN/DEC-12`, `DOMAIN/DEC-13` e `DOMAIN/REF-05` na tabela de decisões aplicadas (todas em
  US-0002 e no glossário); a linha `DOMAIN/DEC-11` deixa de dizer que na curva de referência "toda saída
  da faixa reprova" e passa a dizer que a saída falha o critério 02 na condição de acelerador cheio
  (`DOMAIN/DEC-13`); o parágrafo da camada de domínio e a introdução das decisões aplicadas citam as três
  entradas. Fechada por edição.
- `ISSUE-02` (R4, AC-US-0002-03): o critério declara o que é a velocidade de início do subesterço (a do
  glossário) e o caso em que nenhum patamar reporta `understeer` por mais de 200 ms consecutivos até a
  saída da faixa acima de 50 km/h: V1 é a velocidade mantida do patamar interrompido pela saída, o
  critério é avaliado com esse valor, a saída do ensaio reporta esse V1 em km/h e nunca sair de frente até
  sair da faixa cumpre o critério (`DOMAIN/DEC-12`, `DOMAIN/REF-05`); o critério 06 continua a decidir se
  a varredura terminou sem reprovar. Fechada por edição.
- `ISSUE-03` (R4, `02-glossary.md`, "Velocidade de início do subesterço"): a definição cita
  `DOMAIN/DEC-03` e `DOMAIN/REF-05` para os 200 ms e acrescenta o caso de recuo para o novo acerto (V1):
  velocidade mantida do patamar interrompido pela saída acima de 50 km/h, que não é um patamar completo no
  sentido de `DOMAIN/REF-04` (`DOMAIN/DEC-12`). Fechada por edição.
- `ISSUE-04` (R2, AC-US-0002-02): o critério 02 fica restrito à condição de acelerador cheio mantido; a
  condição de acelerador 0 é julgada só pelo critério 01, que passa a dizer isso ("permanecer na faixa
  enquanto o kart desacelera não é exigido"); `DOMAIN/DEC-13` citado nos dois. Fechada por edição.
- `ISSUE-05` (R2, caso anormal "Kart sai da faixa de asfalto do arco"): na curva de referência, a saída
  falha o critério 02 só na condição de acelerador cheio; com acelerador 0 o ensaio reporta o passo e a
  posição da saída, não reprova por ela e o critério 01 continua a ser julgado em todo o arco
  (`DOMAIN/DEC-13`). Fechada por edição.
- O fato de `DOMAIN/DEC-12` foi levado a todos os seus lugares: critério 03; caso anormal novo "Nenhum
  patamar reporta `understeer` até a saída da faixa acima de 50 km/h" (V1; critério 05, que já reporta V1
  em km/h; critérios 04 e 06 inalterados; rótulo `understeer` não muda); remissão a ele no caso anormal de
  saída da faixa; `sources:`, Fontes e Pontos em aberto de US-0002; glossário; `01-context.md`. O fato de
  `DOMAIN/DEC-13` foi levado a: critérios 01 e 02, caso anormal de saída da faixa, `sources:`, Fontes e
  Pontos em aberto de US-0002; linhas `DOMAIN/DEC-11` e `DOMAIN/DEC-13` de `01-context.md`.
- Versões: US-0002, `01-context.md`, `02-glossary.md` e este changelog em 3.3.0, `status: draft` até o
  validador. `00-index.md` e `99-traceability.md` não foram escritos: o gate os regenera.

**Leituras registradas** (sem decisão nova):

- "Nenhum patamar reporta `understeer`" em `DOMAIN/DEC-12` é lido com `DOMAIN/REF-05`: nenhuma sequência
  com mais de 200 ms consecutivos em nenhum patamar, completo ou interrompido; é a leitura que a
  `ISSUE-07` do relatório já fazia da variante com acelerador cheio.
- Com acelerador 0, o critério 01 continua medido "em nenhum trecho do arco" (texto anterior, não
  tocado): o arco é a geometria do ensaio, e a posição do kart em relação à faixa não tira um passo do
  arco. `DOMAIN/DEC-13` não diz que a medição para na saída da faixa, e o conjunto não inventa isso.
- A restrição do critério 02 à condição de acelerador cheio não é afrouxamento desta rodada: é a decisão
  do dono do produto em `DOMAIN/DEC-13` ("permanecer na faixa enquanto desacelera não é exigido"), que
  prevalece sobre a leitura anterior do conjunto; o critério continua inteiro para a condição de
  acelerador cheio, a que `SEED/US-2` ("sem depender de soltar o acelerador") se refere.

**Superfície (conventions §16)**: nenhum critério, campo, limiar ou termo novo. O caso anormal novo de
US-0002 é o caso que `DOMAIN/DEC-12` nomeia, pedido pelo autor ("critérios e casos anormais"); ele não
exige nada que os critérios 03 a 06 já não exijam. O critério 05 não ganhou campo: V1 em km/h já constava
da saída do ensaio. Três rótulos de rastreabilidade novos (`DOMAIN/DEC-12`, `DOMAIN/DEC-13`,
`DOMAIN/REF-05`), exigidos pela `ISSUE-01` e pela cobertura de `DOMAIN.md`.

**Tabela de migração** (conventions §17): nenhum item retirado. Cinco histórias, nove NFRs e 33 critérios
antes e depois. AC-US-0002-01 ganha a cláusula "único critério com acelerador 0"; AC-US-0002-02 perde a
condição de acelerador 0, por `DOMAIN/DEC-13`; AC-US-0002-03 ganha a definição de V1 no caso sem
`understeer`; nenhum termo novo no glossário (uma definição ajustada).

**Itens fechados**: `ISSUE-01`, `ISSUE-02`, `ISSUE-03`, `ISSUE-04`, `ISSUE-05`. Divergências registradas
em `98-divergences.md`: nenhuma.

**Itens recusados, com motivo**

- `ISSUE-06` (info, separar a cláusula da curva de referência da condução normal em AC-US-0003-01):
  recusada de novo, pelo mesmo motivo das rodadas 7 e 8. O autor determinou para esta rodada que só as
  duas decisões entram, em US-0002, e nada mais muda; a issue é `info` e não bloqueia; o validador diz que
  o critério é decidível e mais estrito que o seed; a mudança seria só de redação e levaria às etapas
  seguintes uma nova versão de US-0003 sem conteúdo. `DOMAIN/DEC-13` confirma a cláusula como está (com
  acelerador cheio continuam exigidas a permanência na faixa e a ausência de `understeer`/`oversteer`), o
  que a linha `DOMAIN/DEC-13` de `01-context.md` registra sem tocar US-0003. Fica para a próxima rodada
  que tocar US-0003 por motivo de conteúdo.
- `ISSUE-07` (info, leitura de "ausência de `understeer`" com acelerador cheio): nenhuma mudança, como o
  próprio relatório espera. A leitura do validador (o limiar de `DOMAIN/DEC-03`, 200 ms consecutivos, não
  tolerância zero) é a que o redator fixou depois em `DOMAIN.md` (`DOMAIN/REF-05`); se o dono do produto
  quiser tolerância zero com acelerador cheio, `DOMAIN/DEC-03` muda primeiro em `DOMAIN.md`.
- O caso de recuo de V0 (linha de base que não reporta `understeer` em nenhum patamar até a saída da
  faixa) não é fixado: `DOMAIN/DEC-12` nomeia V1, e o seed e `DOMAIN/REF-01` dão o acerto anterior como
  um que "sai de frente". O glossário aplica o recuo ao novo acerto (V1), como a decisão diz. Proposta ao
  autor para `SCOPE-BACKLOG.md`: "2026-10-22 req-loop rodada 9 — se a linha de base não reportar
  `understeer` em nenhum patamar até a saída da faixa, V0 é a velocidade do patamar interrompido ou o
  ensaio reporta linha de base ausente?"
- Os passos fora da faixa na condição de acelerador 0 não ganharam regra própria para o critério 01 (ver
  Leituras registradas). Proposta ao autor para `SCOPE-BACKLOG.md`: "2026-10-22 req-loop rodada 9 — com
  acelerador 0, o critério de 200 ms de `understeer` é medido também nos passos depois de o kart sair da
  faixa?"
- A saída do ensaio (critério 05) não ganhou um campo que diga se V1 veio de um patamar com `understeer`
  ou do patamar interrompido pela saída: seria campo novo numa rodada de correção (conventions §16).
  Proposta ao autor para `SCOPE-BACKLOG.md`: "2026-10-22 req-loop rodada 9 — a saída do ensaio de início
  do subesterço deve dizer se V1 é a velocidade do primeiro patamar com `understeer` ou a do patamar
  interrompido pela saída?"
- NFR-0004, US-0003 e os demais arquivos não foram tocados; as propostas de `SCOPE-BACKLOG.md` das
  rodadas 6, 7 e 8 seguem valendo, e os itens recusados das rodadas 1, 3, 5, 6, 7 e 8 continuam recusados
  pelos mesmos motivos.

## 2026-10-22 — rodada 10, Mode B (gate determinístico, 1 erro G5)

**Gatilho**: o gate determinístico da rodada 9 (`req-loop-phases-20261022-1819.csv`) reprovou o conjunto
com um único erro, em `97-changelog.md`: um token `OPEN-<nn>` não resolvido, que esta etapa não carrega
adiante. As decisões do dono do produto de 2026-10-22 (`DOMAIN/DEC-12`, `DOMAIN/DEC-13`) já estão em
US-0002 (critérios e casos anormais) desde a rodada 9 e não foram tocadas; o seed segue em `revision: 3`.

**Issues desta rodada** (uma por linha de erro do gate)

- ISSUE-01 — `97-changelog.md`: token de ponto em aberto número 03 (forma `OPEN-<nn>`) não resolvido.

**O que mudou**

- `ISSUE-01` (G5): o token era a citação literal do título da entrada de 2026-10-22 de `DOMAIN.md`
  "Leitura de 'sem subesterço'", cujo parêntese diz "redator, coerente com [o ponto aberto 03 do seed, na
  forma de token]; o dono pode reverter", na entrada da rodada 9 deste changelog, e não um ponto em aberto
  do conjunto: o ponto aberto 03 do seed está fechado
  por `DOMAIN/DEC-03` (200 ms) desde a rodada 1 e US-0002 declara "Pontos em aberto: Nenhum". A citação
  passou a dizer "coerente com o ponto aberto 03 do seed, fechado por `DOMAIN/DEC-03`", a mesma forma com
  que `01-context.md` já descreve `DOMAIN/REF-05` (tabela de itens do seed e decisões de domínio). Fechada
  por edição; nenhum outro arquivo do conjunto carregava o token.
- Versão deste changelog: 3.3.1. Nenhum outro arquivo tocado; `00-index.md` e `99-traceability.md` não
  foram escritos: o gate os regenera.

**Superfície (conventions §16)**: nenhum requisito, história, critério, campo, limiar ou termo acrescentado
ou removido.

**Tabela de migração** (conventions §17): nenhum item retirado. Cinco histórias, nove NFRs e 33 critérios
antes e depois.

**Itens fechados**: `ISSUE-01`. Divergências registradas em `98-divergences.md`: nenhuma.

**Itens recusados, com motivo**

- Nenhum item desta rodada recusado. Os itens recusados das rodadas 1, 3, 5, 6, 7, 8 e 9 continuam
  recusados pelos mesmos motivos (entre eles a `ISSUE-06`/`ISSUE-07` info do relatório
  `req-validation-20261022-1817.md`), e as propostas de `SCOPE-BACKLOG.md` das rodadas 6, 7, 8 e 9 seguem
  valendo.

## 2026-10-27 — rodada 11, Mode B (relatório `req-validation-20261027-1659.md`, 2 erros e 2 infos)

**Gatilho**: o dono do produto decidiu em `DOMAIN.md` (2026-10-27), após o FAIL SPEC da rodada 3 de código
(`300 Specs/330 D-Specs/Output/dirigibilidade/reports/feedback/feedback-20261027-1619.md`, SPEC-ISSUE-03),
onde o subesterço é medido na curva de referência com acelerador zero: só no asfalto, até a primeira saída
da faixa; passos na grama depois da saída não entram na medição; limiar de 200 ms mantido; o mesmo vale para
qualquer ensaio em que a permanência na faixa não é exigida. Nenhum outro limiar ou regra muda. O validador
reprovou o conjunto com dois erros (R4: a decisão sem rótulo nem cobertura; R2: US-0002 a contradiz) e
reverificou as duas infos de `req-validation-20261022-1829.md`, que ainda não tinham resposta neste changelog.
O seed segue em `revision: 3`; a decisão entrou pela camada durável `DOMAIN.md`, como as anteriores.

**Issues desta rodada** (uma por issue do relatório)

- ISSUE-01 — error, R4, `01-context.md`: a entrada de 2026-10-27 de `DOMAIN.md` não tem rótulo na chave,
  não consta da tabela de decisões aplicadas nem de nenhum `sources:`; item do seed sem cobertura.
- ISSUE-02 — error, R2, US-0002: o critério 01 conta o `understeer` "em nenhum trecho do arco" com
  acelerador 0 e o caso anormal de saída da faixa diz que o critério 01 continua a ser julgado em todo o
  arco; `DOMAIN.md` fixa que a medição para na primeira saída da faixa.
- ISSUE-03 — info, R3, AC-US-0002-03 e glossário "Velocidade de início do subesterço": as duas leituras de
  `DOMAIN/DEC-12` (fórmula; nunca sair de frente cumpre) só coincidem quando a velocidade do patamar
  interrompido é maior ou igual a 1,15 × V0.
- ISSUE-04 — info, R3, AC-US-0003-01: a cláusula da curva de referência com acelerador cheio está ligada à
  condução normal por "em particular", embora com acelerador cheio a velocidade possa passar de 50 km/h.

**O que mudou**

- `ISSUE-01` (R4, `01-context.md`): a decisão de 2026-10-27 ganhou o rótulo `DOMAIN/DEC-14` na chave de
  rastreabilidade, com o texto da decisão; o parágrafo das decisões de domínio em "O que é a feature" e a
  introdução de "Decisões de domínio aplicadas" a descrevem (decisão do dono do produto, sem ponto aberto
  próprio, sem mudar limiar); a tabela de decisões aplicadas ganhou a linha `DOMAIN/DEC-14` apontando
  US-0002 (critério 01 na condição de acelerador 0; caso anormal "Kart sai da faixa de asfalto do arco"; e,
  por "o mesmo vale para qualquer ensaio em que a permanência na faixa não é exigida", o patamar interrompido
  pela saída acima de 50 km/h dos critérios 03 e 06 e do caso anormal "Nenhum patamar reporta `understeer`
  até a saída da faixa acima de 50 km/h", onde a varredura já terminava na saída por `DOMAIN/DEC-11` e só
  faltava a citação). Fechada por edição.
- `ISSUE-02` (R2, US-0002): o critério 01 passa a declarar que, na condição de acelerador 0, a maior
  sequência de `understeer` consecutivo é contada só nos passos em que o kart está na faixa de asfalto, até
  a primeira saída da faixa, com o limiar de 200 ms inalterado (`DOMAIN/DEC-14`); na condição de acelerador
  cheio a janela continua a ser todo o arco (a permanência na faixa é exigida pelo critério 02). O caso
  anormal "Kart sai da faixa de asfalto do arco" diz que a primeira saída fecha a janela de medição do
  critério 01 (o ensaio continua a reportar o passo e a posição da saída; os passos na grama depois da saída
  não entram na medição — escorregar na grama não é sair de frente) e que na condição de acelerador cheio
  nada muda (a saída falha o critério 02). Fechada por edição.
- O fato de `DOMAIN/DEC-14` foi levado a todos os seus lugares: critério 01; caso anormal de saída da faixa;
  critérios 03 e 06 e caso anormal "Nenhum patamar reporta `understeer` até a saída da faixa acima de
  50 km/h" (o patamar interrompido pela saída acima de 50 km/h é medido só nos passos na faixa, até ela —
  só citação, a varredura já terminava na saída); `sources:`, Fontes e Pontos em aberto de US-0002; chave,
  parágrafo de decisões e tabela de decisões aplicadas de `01-context.md`. A frase "a pista de teste não tem
  paredes nem grama a ensaiar" do caso anormal passou a "não tem paredes, e a grama fora da faixa não é
  ensaiada aqui", porque `DOMAIN/DEC-14` nomeia a grama depois da saída.
- Versões: US-0002, `01-context.md` e este changelog em 3.4.0, `status: draft` até o validador.
  `02-glossary.md`, US-0001, US-0003 a US-0005, os nove NFRs e `98-divergences.md` não foram tocados:
  nenhum deles afirma onde o `understeer` é medido com acelerador 0, e a definição "Velocidade de início do
  subesterço" já diz que a varredura termina quando o kart sai da faixa (`DOMAIN/DEC-11`). `00-index.md` e
  `99-traceability.md` não foram escritos: o gate os regenera.

**Leituras registradas** (sem decisão nova)

- "O mesmo vale para qualquer ensaio em que a permanência na faixa não é exigida" alcança a varredura de
  início do subesterço acima de 50 km/h, em que a saída é o fim natural (`DOMAIN/DEC-11`): o patamar
  interrompido é medido até a saída, como o conjunto já lia; e não alcança a condição de acelerador cheio
  dos critérios 01 e 02, em que a permanência na faixa continua exigida (`DOMAIN/DEC-13`).
- A proposta da rodada 9 a `SCOPE-BACKLOG.md` ("com acelerador 0, o critério de 200 ms de `understeer` é
  medido também nos passos depois de o kart sair da faixa?") está respondida por `DOMAIN/DEC-14`: não.
- `SCOPE-BACKLOG.md` passou a existir na pasta do seed, com duas perguntas de 2026-10-27 adiadas ao autor
  pelo D-Spec (V0 quando a linha de base nunca sai de frente; veredito para saída exatamente a 50 km/h e
  para varredura que termina sem saída). Nenhuma foi decidida; o conjunto não inventa regra para elas.

**Superfície (conventions §16)**: nenhum requisito, história, critério, campo, limiar ou termo acrescentado
ou removido. A janela de medição do critério 01 na condição de acelerador 0 é a decisão do dono do produto
em `DOMAIN/DEC-14`, que prevalece sobre a leitura anterior do conjunto ("em nenhum trecho do arco"); o limiar
de 200 ms e o acerto não mudam.

**Tabela de migração** (conventions §17): nenhum item retirado. Cinco histórias, nove NFRs e 33 critérios
antes e depois. Modificados: AC-US-0002-01 (janela de medição na condição de acelerador 0: só na faixa de
asfalto, até a primeira saída); AC-US-0002-03 e AC-US-0002-06 (só citação de `DOMAIN/DEC-14` no patamar
interrompido pela saída).

**Itens fechados**: `ISSUE-01`, `ISSUE-02`. Divergências registradas em `98-divergences.md`: nenhuma.

**Itens recusados, com motivo**

- `ISSUE-03` (info, R3, AC-US-0002-03 e glossário): nenhuma mudança. O conjunto é decidível como está — a
  saída do ensaio reporta V1 igual à velocidade mantida do patamar interrompido e o veredito é V1 ≥ 1,15 × V0
  (a fórmula governa); as duas leituras de `DOMAIN/DEC-12` só divergem quando essa velocidade fica abaixo de
  1,15 × V0, e a escolha nesse caso é do dono do produto, que a registra primeiro em `DOMAIN.md`. O próprio
  relatório espera nenhuma mudança nesta etapa, e a decisão do autor para esta rodada é "nada mais muda".
  Proposta ao autor para `SCOPE-BACKLOG.md`: "2026-10-27 req-loop rodada 11 — quando a varredura termina
  pela saída da faixa acima de 50 km/h sem subesterço e a velocidade do patamar interrompido fica abaixo de
  1,15 × V0, o critério reprova (fórmula de `DOMAIN/DEC-12`) ou aprova (nunca sair de frente cumpre)?"
- `ISSUE-04` (info, R3, AC-US-0003-01): nenhuma mudança. O critério é decidível como está (estado de
  aderência em todos os passos do arco, inclusive acima de 50 km/h, como o próprio relatório lê) e coerente
  com `DOMAIN/DEC-13`; a decisão do autor para esta rodada restringe a mudança a US-0002 ("Incorpore em
  US-0002. Nada mais muda"). A separação das duas cláusulas fica para uma rodada em que US-0003 se mova.
- Os fatos de código que acompanharam a decisão do autor — identificador do acerto em vigor, o valor que o
  ensaio mede com a regra nova, a localização da biblioteca de ensaios e do código — não entraram no
  conjunto: esta etapa não nomeia módulo, arquivo nem identificador de preset (política de critérios
  estritos, regra 8); eles pertencem às etapas de spec e de código.
- Os itens recusados das rodadas 1, 3, 5, 6, 7, 8 e 9 continuam recusados pelos mesmos motivos, e as
  propostas de `SCOPE-BACKLOG.md` das rodadas 6, 7, 8 e 9 seguem valendo, exceto a da rodada 9 sobre os
  passos depois da saída da faixa com acelerador 0, respondida por `DOMAIN/DEC-14`.

## 2026-10-29 — rodada 12, Mode A (seed `revision: 4`, acerto C, sem drift e sem turbo)

**Gatilho**: o seed passou a `revision: 4` (`date: 2026-10-29`, autor `eduardo.matos`) com a entrada de
2026-10-29 de `DOMAIN.md`, "Acerto C e fim do drift e do turbo" (`DOMAIN/DEC-15`): testando a staging, o dono
do produto disse que "o kart simplesmente não vira" e escolheu o acerto C entre duas prévias; a velocidade
estabilizada passa a ficar entre 65 km/h e 72 km/h; a curva passa a ser julgada pelo raio da trajetória na
pista de teste aberta, no lugar dos ensaios de esterço cheio no arco de raio 18 m; o drift e o turbo de
`requirements/11` saem do jogo. Os pontos abertos 01, 04, 05 e 07 permanecem com os valores em vigor.

**O que mudou**

- `01-context.md` (4.0.0): seed `revision: 4`; parágrafo novo "O acerto C"; "Onde cada ensaio roda"
  reescrito (reta da pista de teste para a resposta do volante; pista de teste aberta para o raio e a
  recuperação; pista sintética para a volta do piloto de teste, que serve ao tempo de volta e à condução
  normal); rótulo novo `DOMAIN/DEC-15`; `SEED/RD-01` com o texto da revisão 4; `DOMAIN/REF-02`,
  `DOMAIN/REF-03` e `DOMAIN/DEC-09` redigidos com a parte que continua em vigor; parágrafo novo "Decisões
  substituídas e não aplicadas", que lista os rótulos que saem do conjunto sem os reutilizar
  (`DOMAIN/DEC-02`, `DEC-03`, `DEC-06`, `DEC-11`, `DEC-12`, `DEC-13`, `DEC-14`, `DOMAIN/REF-04`,
  `REF-05`); tabela de decisões aplicadas refeita; famílias de NFR (acessibilidade e RNF01/02/05 citam a
  retirada do drift e do turbo) e fora do escopo com o texto da revisão 4. Registro de que a lista "Riscos e
  incógnitas" do seed ainda cita os valores antigos dos pontos 02, 03 e 06, e de que o corpo do seed e
  `DOMAIN/DEC-15` prevalecem.
- `02-glossary.md` (4.0.0): termos novos "Acerto C", "Pista de teste aberta", "Raio da trajetória", "Turbo"
  e "Comando de drift"; redefinidos "Pista de teste", "Pista sintética", "Velocidade mantida" (sem a
  varredura), "Curva de referência" (ensaio de raio na pista de teste aberta), "Condição de forçar" (sem o
  drift), "Condução normal" (todos os passos da volta do piloto de teste na pista sintética, `SEED/US-3`),
  "Drift" (retirado), "Direção comum", "Velocidade estabilizada" (é a velocidade máxima) e "Asfalto";
  retirados "Velocidade de início do subesterço" e "Acerto agressivo", que só os critérios retirados usavam.
- US-0001 (3.1.0): pré-condição no acerto C; o critério 05 diz que a aderência em curva é julgada pelos
  ensaios de raio de US-0002, não mais pelo arco de 18 m (`DOMAIN/DEC-09` com `DOMAIN/DEC-15`); limites de
  180 ms e 250 ms inalterados.
- US-0002 (4.0.0): história reescrita sobre os três critérios de raio do seed — critérios novos 07 (50 km/h,
  acelerador cheio, raio de no máximo 13 m 3 s depois da partida), 08 (70 km/h, mesmo limite) e 09 (50 km/h,
  acelerador 0, raio de no máximo 3 m), cada um nos dois lados do esterço; critério 05 (saída do ensaio)
  reescrito; casos anormais refeitos (parada antes de 3 s, traseira solta com acelerador cheio, `understeer`
  durante o ensaio, partida acima da velocidade estabilizada, esterço parcial, área do ensaio).
- US-0003 (4.0.0): critérios 01 e 05 observados em todos os passos da volta do piloto de teste na pista
  sintética, como o primeiro critério do seed passou a dizer; critério 03 na pista de teste aberta, com o
  forçar até a traseira soltar e os dois lados do esterço; critério 07 (saída do ensaio) reescrito;
  critérios novos 08 (o comando de drift mantido não muda o estado da simulação), 09 (nenhum indicador de
  carga, turbo, impulso, combo ou pontuação de drift na tela nem no texto compartilhado) e 10 (a velocidade
  nunca passa da estabilizada); casos anormais novos "Traseira não solta sob a condição de forçar",
  "Piloto de teste força o kart na volta sintética", "Comando de drift mantido durante a recuperação" e
  "Replay gravado com drift na versão anterior"; o caso "Drift em andamento" saiu.
- US-0004 (3.0.0): critério 02 passa a "entre 65 km/h e 72 km/h, inclusive" (`DOMAIN/DEC-15`); critério 04
  (grama a 50 km/h) passa a citar só `SEED/US-4`, porque `DOMAIN/DEC-02` foi substituído; caso anormal
  "Grama a velocidade abaixo de 50 km/h" redigido de novo, sem mudar o que exige.
- US-0005 (3.1.0): pré-condição no acerto C; seção Canais diz que a volta do piloto de teste serve também à
  condução normal de US-0003; `DOMAIN/DEC-10` e `DOMAIN/DEC-15` nas fontes. Critérios inalterados.
- NFR-0004 (4.0.0): a lista de ensaios registrados em `docs/physics.md` troca a curva do arco de 18 m (raio
  do arco, largura da faixa, V0, V1) pelo raio na pista de teste aberta com a janela de medição, e acrescenta
  a volta do piloto de teste com estados de aderência e derrapagem, a comparação com e sem o comando de drift
  e a maior velocidade observada; os limites registrados são os da revisão 4.
- NFR-0005 (1.1.0): diz que a retirada do drift e do turbo tira regras de pilotagem da simulação e não cria
  nenhuma fora dela, e que retirar da tela os indicadores de drift não é regra de pilotagem; `SEED/RD-01`
  nas fontes.
- NFR-0001, NFR-0002, NFR-0003, NFR-0006, NFR-0007, NFR-0008, NFR-0009 e `98-divergences.md`: sem mudança;
  carregados na versão em que estavam. `00-index.md` e `99-traceability.md` não foram escritos: o gate os
  regenera.

**Tabela de migração** (conventions §17). Retiradas aprovadas pelo dono do produto na revisão 4 do seed e na
entrada de 2026-10-29 de `DOMAIN.md` (`DOMAIN/DEC-15`, Eduardo Matos), que substituem os ensaios do arco de
18 m e retiram o drift; os números não são reutilizados.

| Item | Antes | Agora |
|---|---|---|
| AC-US-0001-05 | aderência em curva julgada só no arco de 18 m de US-0002 | modificado: julgada só pelos ensaios de raio de US-0002 |
| AC-US-0002-01 | sem `understeer` acima de 200 ms no arco de 18 m, acelerador 0 e cheio | **retirado** (substituído pelos critérios 07 a 09) |
| AC-US-0002-02 | permanência na faixa do arco de 18 m com acelerador cheio | **retirado** (substituído pelo critério 07) |
| AC-US-0002-03 | V1 ≥ 1,15 × V0 na varredura de início do subesterço | **retirado**, sem substituto: a varredura saiu com `DOMAIN/DEC-15` |
| AC-US-0002-04 | perda da frente progressiva entre patamares | **retirado**, sem substituto (idem) |
| AC-US-0002-05 | saída do ensaio do arco | modificado: saída dos ensaios de raio |
| AC-US-0002-06 | fim da varredura pela saída da faixa | **retirado**, sem substituto (idem) |
| AC-US-0002-07, 08, 09 | — | **novos**: raio de no máximo 13 m (50 km/h e 70 km/h, acelerador cheio) e de no máximo 3 m (50 km/h, acelerador 0), 3 s depois da partida |
| AC-US-0003-01 | sem `oversteer`/`sliding` em condução normal em qualquer asfalto, com a cláusula do arco de 18 m | modificado: em todos os passos da volta do piloto de teste na pista sintética |
| AC-US-0003-02 | `oversteer`/`sliding` só sob forçar, drift ou recuperação, em qualquer asfalto | **retirado**: o seed passou a observar a condução normal na volta do piloto de teste (critérios 01 e 05), e o drift deixou de existir |
| AC-US-0003-03 | recuperação a `grip` em 400 ms, na pista de teste | modificado: na pista de teste aberta, forçar até a traseira soltar, os dois lados |
| AC-US-0003-04 | derrapagem de no máximo 0,65 rad na recuperação | inalterado |
| AC-US-0003-05 | derrapagem de no máximo 0,65 rad em condução normal em qualquer asfalto | modificado: em todos os passos da volta do piloto de teste |
| AC-US-0003-06 | o drift continua possível e pontuando | **retirado** (o oposto passou a valer: critérios 08 e 09) |
| AC-US-0003-07 | saída do ensaio | modificado: inclui a volta do piloto de teste, o comando de drift e a maior velocidade |
| AC-US-0003-08, 09, 10 | — | **novos**: comando de drift sem efeito; nenhum indicador de drift ou turbo na tela; velocidade nunca acima da estabilizada |
| AC-US-0004-02 | pelo menos 105 km/h | modificado: entre 65 km/h e 72 km/h |
| AC-US-0004-04 | grama a 50 km/h, com fonte `DOMAIN/DEC-02` | modificado: só a fonte (`SEED/US-4`) |

Contagem: cinco histórias e nove NFRs antes e depois; critérios 6 + 6 + 7 + 7 + 6 antes e 6 + 4 + 8 + 7 + 6
depois (sete retirados, seis novos).

**Superfície**: Mode A sobre um seed movido; os itens novos (critérios 07 a 09 de US-0002, 08 a 10 de
US-0003 e os cinco termos novos do glossário) realizam itens da revisão 4 (`SEED/US-2`, `SEED/US-3`,
`SEED/RD-01`, `DOMAIN/DEC-15`).

**Itens fechados**: nenhum `ISSUE-<nn>`/`FB-<nn>` pendente (o último relatório,
`req-validation-20261027-1705.md`, era SUCCESS). Os seus dois `info` ficam sem objeto: ISSUE-01 (as duas
leituras de `DOMAIN/DEC-12` no antigo critério 03 de US-0002) porque o critério foi retirado; ISSUE-02 (a
cláusula do arco de 18 m no critério 01 de US-0003) porque a cláusula saiu. Divergências registradas:
nenhuma.

**Leituras registradas**

- Critério 09 de US-0002 (sem acelerador, raio de no máximo 3 m): o seed não diz quando o raio é medido.
  O conjunto mede 3 s depois da partida, como nos dois critérios anteriores do mesmo ensaio ("nas mesmas
  condições", "o raio também fica"), e, se a velocidade chegar a 0 antes de 3 s, o critério reprova por falta
  de medida. **Pede confirmação do dono do produto** antes de a etapa de F-Spec usar o critério. Proposta
  ao autor para `DOMAIN.md` ou `SCOPE-BACKLOG.md`: "2026-10-29 req-loop rodada 12 — no ensaio sem
  acelerador partindo de 50 km/h com esterço cheio, o raio de no máximo 3 m é medido 3 s depois da partida,
  ou é o raio final antes de o kart parar? E se o kart parar antes de 3 s, aprova ou reprova?"
- Restrição `SEED/RE-01` ("mudanças ficam nos presets e nas assistências de `src/physics.ts`") e o
  critério 09 de US-0003 (nenhum indicador de drift na tela): o conjunto lê a restrição como regra sobre
  onde as regras de pilotagem moram (NFR-0005), de modo que retirar da tela os indicadores do drift não a
  fere. **Pede confirmação do dono do produto**, porque a leitura literal ("as mudanças ficam em
  `src/physics.ts`") não deixaria tocar a tela. Proposta ao autor para `SCOPE-BACKLOG.md`: "2026-10-29
  req-loop rodada 12 — a retirada do drift e do turbo pode tocar HUD, tela de resultado e texto compartilhado
  fora de `src/physics.ts`?"
- "Sem rodar" na recuperação continua lido como derrapagem lateral de no máximo 0,65 rad (critério 04), o
  teto que o seed dá para a traseira viva, como desde a rodada 1.
- "Condução normal (pista sintética, piloto de teste)" é lida como todos os passos da volta do piloto de
  teste, inclusive os passos em que ele acelera e esterça cheio acima de 50 km/h.
- "Esterço cheio" nos ensaios de raio vale nos dois lados (1 ou −1), como o glossário define esterço cheio
  desde a rodada 1.

**Itens recusados, com motivo**

- Os valores de parâmetro do acerto C que `DOMAIN/DEC-15` lista (`governorSpeed`, `assistLateralG`,
  `maxSteer`, `friction`, `frontStiffness`): não entram em critério nem em glossário. São constantes de
  física e escolha de desenho (política de critérios estritos, regra 8; `domain-directives.md`, "Seed
  authoring": afinação pertence ao desenho e ao bench); o registro deles em `docs/physics.md` é exigido por
  NFR-0004.
- O identificador `arcade-assistido-v6`: citado em `01-context.md` e no glossário como o nome que a decisão
  dá ao acerto C, sem virar critério; o critério 04 de US-0005 exige uma versão de acerto diferente da
  anterior, e o valor do identificador é desenho, como a rodada 11 já registrou.
- Os valores medidos do acerto C (69,3 km/h; 2,21 s; ≈ 11,7 m; 23,05 s): informação do dono do produto, não
  limites; os limites são os do seed e de `DOMAIN.md`.
- Texto antigo da lista "Riscos e incógnitas" do seed (pontos 02, 03 e 06 com os valores anteriores): esta
  etapa não escreve o seed. Proposta ao autor: atualizar essas três linhas para "substituído por `DOMAIN.md`,
  2026-10-29".
- As duas entradas de 2026-10-27 de `SCOPE-BACKLOG.md` (V0 quando a linha de base nunca sai de frente;
  veredito para a saída exatamente a 50 km/h e para a varredura sem saída) e a proposta da rodada 11 sobre
  V1 abaixo de 1,15 × V0 ficam sem objeto: a varredura do arco de 18 m saiu com `DOMAIN/DEC-15`. Proposta ao
  autor: fechá-las.
- A proposta da rodada 6 sobre o ambiente dos ensaios de US-4 (0–60 km/h, velocidade estabilizada, grama,
  parede) segue sem decisão; o conjunto não fixa ambiente para eles.
- Os itens recusados das rodadas 1, 3, 5, 6, 7, 8, 9 e 11 que não tratavam do arco de 18 m continuam
  recusados pelos mesmos motivos (parede sem percentual; recuperação com esterço parcial; janela de
  estabilização; inversão do esterço; valores anteriores não permanecem como piso).

## 2026-10-30 — rodada 13, Mode A (seed `revision: 5`, giro sem acelerador e alcance da restrição de I2)

**Gatilho**: o seed passou a `revision: 5` com a entrada de 2026-10-30 de `DOMAIN.md`, "Curva sem acelerador e
onde a retirada do drift acontece" (rótulo novo `DOMAIN/DEC-16`). Ela responde às duas leituras que a rodada
12 pediu ao dono do produto:

1. Critério 09 de US-0002 (sem acelerador, partindo de 50 km/h com esterço cheio): **respondida**. O raio de
   no máximo 3 m aos 3 s sai — o acerto C já está a 4 km/h aos 3 s, e um raio medido ali não mede nada — e o
   critério passa a ser o giro de pelo menos 180° em até 2 s (medido no acerto C: 208°). A leitura da rodada
   12 ("3 s depois da partida; parada antes reprova por falta de medida") deixa de valer.
2. Restrição `SEED/RE-01` e critério 09 de US-0003: **respondida**. A restrição passa a dizer que as regras
   de pilotagem ficam na simulação (`src/physics.ts` e `src/maneuvers.ts`) e que retirar o drift e o turbo
   da tela (HUD, resultado e texto compartilhado) é só remoção de exibição, permitida. A leitura da rodada 12
   (a restrição trata de onde moram as regras de pilotagem) passa a ser o texto do seed.

**O que mudou**

- US-0002 (4.1.0): critério 09 reescrito — giro de pelo menos 180° em até 2 s, cada lado; critério 05 (saída
  do ensaio) passa a reportar, para o critério 09, o giro aos 2 s, o instante em que atingiu 180° e a
  velocidade aos 2 s; caso anormal novo "Velocidade chega a 0 antes de 2 s" (o giro conta até a parada; abaixo
  de 180°, reprova) e o de "antes de 3 s" restrito aos critérios 07 e 08; Canais, área do ensaio, pausa,
  Fontes e Pontos em aberto com o giro; `DOMAIN/DEC-16` nas fontes.
- US-0003 (4.1.0): o critério 09 cita `SEED/RE-01` e `DOMAIN/DEC-16` (a remoção da exibição é permitida pela
  restrição); o que ele exige não muda.
- `02-glossary.md` (4.1.0): termo novo "Giro" (variação acumulada do rumo do kart, em graus, a partir da
  partida); "Curva de referência" com as duas medidas (raio aos 3 s com acelerador cheio; giro em até 2 s sem
  acelerador).
- `01-context.md` (4.1.0): seed `revision: 5`; parágrafo novo "Revisão 5 do seed"; `SEED/RE-01` com o texto da
  revisão 5; rótulo e linha de aplicação de `DOMAIN/DEC-16`; restrição citada com o texto novo; o giro de 208°
  entre os valores medidos informativos.
- NFR-0004 (4.1.0): a lista de ensaios registra o raio nas duas condições com acelerador cheio e o giro em até
  2 s sem acelerador.
- NFR-0005 (1.2.0): requisito com o texto novo da restrição (regras de pilotagem em `src/physics.ts` e
  `src/maneuvers.ts`; retirar o drift e o turbo da tela é remoção de exibição permitida); `DOMAIN/DEC-16` nas
  fontes.
- US-0001, US-0004, US-0005, os outros sete NFRs e `98-divergences.md`: sem mudança nesta rodada.
  `00-index.md` e `99-traceability.md` regenerados pelo gate.

**Tabela de migração** (conventions §17): nenhum item retirado nesta rodada.

| Item | Antes (rodada 12) | Agora |
|---|---|---|
| AC-US-0002-09 | raio de no máximo 3 m 3 s depois da partida, sem acelerador | modificado (mesmo item do seed, terceiro critério de US-2): giro de pelo menos 180° em até 2 s |
| AC-US-0002-05 | saída com raio aos 3 s nas três condições | modificado: raio aos 3 s nos critérios 07 e 08; giro aos 2 s no critério 09 |
| AC-US-0003-09 | sem indicador de drift ou turbo na tela | só as fontes (`SEED/RE-01`, `DOMAIN/DEC-16`) |

Contagem: critérios 6 + 4 + 8 + 7 + 6, como na rodada 12. O critério 09 de US-0002 ficou com o seu número,
porque realiza o mesmo critério do seed com a medida que a revisão 5 fixou, como o critério 02 de US-0004
na rodada 12.

**Superfície**: Mode A sobre um seed movido; o único item novo (o termo "Giro") realiza `SEED/US-2` e
`DOMAIN/DEC-16`.

**Itens fechados**: as duas leituras da rodada 12 que pediam o dono do produto, ambas respondidas pela
revisão 5 (acima). Nenhum `ISSUE-<nn>`/`FB-<nn>` pendente; o conjunto da rodada 12 não chegou ao validador.
Divergências registradas: nenhuma.

**Itens recusados, com motivo**

- As propostas da rodada 12 para `SCOPE-BACKLOG.md` sobre as duas leituras ficam sem objeto: a revisão 5 as
  respondeu.
- Os demais itens recusados da rodada 12 seguem recusados pelos mesmos motivos (valores de parâmetro do
  acerto C; identificador `arcade-assistido-v6` como critério; valores medidos como limites), e as propostas
  ao autor seguem valendo: atualizar as linhas dos pontos 02, 03 e 06 da lista "Riscos e incógnitas" do seed,
  que continuam com os valores antigos na revisão 5, e fechar as duas entradas de 2026-10-27 de
  `SCOPE-BACKLOG.md`, sem objeto desde a revisão 4.

## 2026-10-30 — rodada 14, Mode B (relatório `req-validation-20261030-0241.md`, 3 erros e 2 infos)

**O que mudou**

- `ISSUE-01` (error, R3, AC-US-0003-09): o critério foi dividido pelo ponto de observação. O critério 09
  ficou com a tela (HUD durante a volta e tela de resultado); o texto compartilhado do resultado passou ao
  critério novo AC-US-0003-11. Sites carregados: Canais e Pré-condições de US-0003 ("critério 11, no texto
  compartilhado"; "critérios 08 a 11"), a linha de `DOMAIN/DEC-16` na tabela de decisões aplicadas de
  `01-context.md` e NFR-0005 ("critérios 09 e 11 de US-0003"). Fechada por edição.
- `ISSUE-02` (error, R4, cláusula do texto compartilhado): o critério 11 proíbe a mesma lista que o critério
  09 — indicador de carga de drift, de turbo ou de impulso, combo e pontuação de drift —, como pedem
  `SEED/US-3` e `SEED/RE-01` da revisão 5. Fechada por edição.
- `ISSUE-03` (error, R4, NFR-0004, "Como é observado"): o método passa a citar os limites em vigor na revisão
  5 do seed (acerto C, `DOMAIN/DEC-15`, e giro de pelo menos 180° em até 2 s sem acelerador,
  `DOMAIN/DEC-16`), coerentes com a coluna do limite; o raio de 3 m não aparece mais. Fechada por edição.
- `ISSUE-04` (info, R3, US-0002, caso anormal "`understeer` reportado durante o ensaio"): o caso diz que os
  critérios 07 e 08 julgam o raio, o critério 09 julga o giro, e nenhum dos três é reprovado por um passo
  com `understeer`. Fechada por edição.
- `ISSUE-05` (info, R4, US-0001 e glossário): a faixa da largura da pista na reta do ensaio de resposta do
  volante saiu, porque nem o seed nem `DOMAIN/REF-03` a dão. Conforme a orientação do coordenador da rodada
  (o ensaio de resposta do volante roda na pista de teste aberta, como os de US-2; o bench do acerto C mediu
  a resposta do volante nesse ambiente), o ensaio roda na pista de teste aberta, com partida em reta e
  velocidade mantida em 50 km/h; como a pista aberta não tem faixa, o caso "kart sai da faixa" deixa de
  existir. Sites carregados: Canais, Pré-condições e critério 01 de US-0001; "Pista de teste" e "Regime da
  taxa de guinada" de `02-glossary.md`; parágrafo "Onde cada ensaio roda" e a linha `DOMAIN/REF-03`,
  `SEED/RD-06` da tabela de decisões aplicadas de `01-context.md`. Os rótulos `DOMAIN/REF-03` e
  `DOMAIN/DEC-01` da chave citam `DOMAIN.md` ("em reta") e ficaram como estão. Fechada por edição.

**Versões**: US-0001 3.2.0; US-0002 4.1.1; US-0003 4.2.0; NFR-0004 4.2.0; NFR-0005 1.3.0; `01-context.md` e
`02-glossary.md` 4.2.0; este changelog 4.2.0; todos `status: draft` até o validador. US-0004, US-0005, os
outros sete NFRs e `98-divergences.md` não foram tocados. `00-index.md` e `99-traceability.md` regenerados
pelo gate.

**Tabela de migração** (conventions §17): nenhum item retirado. AC-US-0003-09 modificado (só a tela);
AC-US-0003-11 novo, vindo da divisão do critério 09 (a cláusula do texto compartilhado, com a lista
completa). Critérios: 6 + 4 + 8 + 7 + 6 antes e 6 + 4 + 9 + 7 + 6 depois.

**Superfície (conventions §16)**: o critério 11 não acrescenta requisito; é a cláusula do texto
compartilhado que o critério 09 já carregava, separada por pedido de `ISSUE-01` e completada com a lista que
`SEED/US-3` e `SEED/RE-01` já exigem (`ISSUE-02`). Nenhuma história, campo, tela ou limiar novo. A mudança de
ambiente de `ISSUE-05` retira a faixa, que não vinha do seed, e não acrescenta nada.

**Itens fechados**: `ISSUE-01`, `ISSUE-02`, `ISSUE-03`, `ISSUE-04`, `ISSUE-05`. Divergências registradas:
nenhuma.

**Itens recusados, com motivo**: nenhum desta rodada. Os itens recusados e as propostas ao autor das rodadas
12 e 13 seguem valendo pelos mesmos motivos.

## 2026-10-30 — rodada 15, Mode B (relatório `req-validation-20261030-1159.md`, 1 erro)

**O que mudou**

- `ISSUE-01` (error, R3, AC-US-0005-05): o critério foi dividido pelo ponto de observação, como o critério
  09 de US-0003 na rodada 14. O critério 05 ficou com a tela (onde a tela compara tempos, só compara tempos de
  versão igual); o texto compartilhado do resultado passou ao critério novo AC-US-0005-07, com a mesma
  exigência. Sites que citam o critério 05 carregados: caso anormal "Replay da versão anterior reproduzido
  com o novo acerto" ("critérios 05 e 07"), caso anormal "Rodada de acerto reprovada pelo dono do produto em
  staging" ("critérios 01 a 07") e a coluna "Como é observado" de NFR-0009 ("critérios 04, 05 e 07 de
  US-0005"). Fechada por edição.

**Versões**: US-0005 3.2.0; NFR-0009 1.0.1; este changelog 4.3.0; os três `status: draft` até o validador.
Nenhum outro arquivo foi tocado. `00-index.md` e `99-traceability.md` regenerados pelo gate.

**Tabela de migração** (conventions §17): nenhum item retirado. AC-US-0005-05 modificado (só a tela);
AC-US-0005-07 novo, vindo da divisão do critério 05 (a cláusula do texto compartilhado). Critérios: 6 + 4 +
9 + 7 + 6 antes e 6 + 4 + 9 + 7 + 7 depois.

**Superfície (conventions §16)**: o critério 07 não acrescenta requisito; é a cláusula do texto
compartilhado que o critério 05 já carregava, separada por pedido de `ISSUE-01`. Nenhuma história, campo,
tela ou limiar novo.

**Itens fechados**: `ISSUE-01`. Divergências registradas: nenhuma.

**Itens recusados, com motivo**: nenhum desta rodada. Os itens recusados e as propostas ao autor das rodadas
12 a 14 seguem valendo pelos mesmos motivos.

## 2026-10-30 — rodada 16, Mode A (seed `revision: 6`, drift fora de todas as telas)

**Gatilho**: o seed passou a `revision: 6` com a segunda entrada de 2026-10-30 de `DOMAIN.md`, "Drift fora de
todas as telas" (rótulo novo `DOMAIN/DEC-17`). A validação de testes encontrou o drift ainda ensinado na tela
inicial, na dica da barra de ferramentas e no guia de manobras, e o botão "Drift" no controle de toque; a
restrição `SEED/RE-01` passa a nomear todas as telas que mostravam, ensinavam ou ofereciam o drift e o turbo:
HUD, resultado, texto compartilhado, tela inicial, dica da barra de ferramentas, guia de manobras e o botão
"Drift" do controle de toque no celular. Continua sendo só remoção de exibição. Nenhum outro item do seed mudou
entre as revisões 5 e 6; o conjunto validado contra a revisão 5 (`req-validation-20261030-1202.md`) é
reaproveitado e só o que a revisão 6 alcança foi tocado.

**O que mudou**

- US-0003 (4.3.0): quatro critérios atômicos novos na família do critério 09, um por ponto de observação que
  a revisão 6 nomeia — AC-US-0003-12 (tela inicial), AC-US-0003-13 (dica da barra de ferramentas),
  AC-US-0003-14 (guia de manobras), os três em `web-desktop` e em `web-mobile`, com a mesma lista dos critérios
  09 e 11 mais o comando de drift (tecla ou controle), porque essas telas o ensinavam; e AC-US-0003-15 (o
  controle de toque não exibe o botão "Drift" nem outro controle de drift ou de turbo), só em `web-mobile`.
  Canais: a tecla de drift não é ensinada em `web-desktop`; o controle de toque de `web-mobile` não oferece
  controle de drift, e o comando de drift no `Input` continua julgado pelo critério 08; pontos de observação
  dos critérios 12 a 15; parágrafo de exibição por canal. Pré-condições dos critérios 12 a 14 (jogo aberto, a
  tela, a dica ou o guia exibidos; a restrição do seed não condiciona a retirada a um acerto) e do critério 15
  (volta em `web-mobile`, com sensor ou no recuo para toque); a pré-condição do acerto C restrita aos critérios
  01 a 11. Casos anormais novos: tela, dica ou guia cujo conteúdo era só o drift (nenhum texto novo no lugar);
  idioma da interface (RNF11); tecla de drift pressionada em `web-desktop`; o recuo para toque também sem o
  botão "Drift". Fontes com `DOMAIN/DEC-17` e o texto da revisão 6.
- `01-context.md` (4.3.0): seed `revision: 6`; parágrafo novo "Revisão 6 do seed"; `SEED/RE-01` com o texto
  da revisão 6; rótulo e linha de aplicação de `DOMAIN/DEC-17`; restrição citada com o texto novo.
- `02-glossary.md` (4.3.0): termos novos "Tela inicial", "Dica da barra de ferramentas", "Guia de manobras" e
  "Controle de toque"; "Comando de drift" sem o controle de drift do toque.
- NFR-0005 (1.4.0): o requisito cita todas as telas da revisão 6 e os critérios 09 e 11 a 15 de US-0003;
  `DOMAIN/DEC-17` nas fontes.
- NFR-0004 (4.2.1): "os limites em vigor na revisão 5 do seed" passa a "os limites em vigor", porque o seed
  está na revisão 6 e os limites (acerto C, giro em até 2 s) não mudaram.
- US-0001, US-0002, US-0004, US-0005, os outros sete NFRs e `98-divergences.md`: sem mudança.
  `00-index.md` e `99-traceability.md` regenerados pelo gate. Todos os arquivos tocados ficam `status: draft`
  até o validador.

**Tabela de migração** (conventions §17): nenhum item retirado nem modificado.

| Item | Antes (rodada 15) | Agora |
|---|---|---|
| AC-US-0003-12 | — | novo: tela inicial sem drift nem turbo (`SEED/RE-01`, revisão 6) |
| AC-US-0003-13 | — | novo: dica da barra de ferramentas sem drift nem turbo |
| AC-US-0003-14 | — | novo: guia de manobras sem drift nem turbo |
| AC-US-0003-15 | — | novo: controle de toque de `web-mobile` sem o botão "Drift" |
| AC-US-0003-09, AC-US-0003-11 | tela (HUD e resultado); texto compartilhado | sem mudança |

Contagem: critérios 6 + 4 + 9 + 7 + 7 antes e 6 + 4 + 13 + 7 + 7 depois.

**Superfície**: Mode A sobre um seed movido; os quatro critérios novos e os quatro termos novos realizam
`SEED/RE-01` da revisão 6 e `DOMAIN/DEC-17`. Nenhum elemento de tela é acrescentado: os critérios só exigem
retirada.

**Itens fechados**: nenhum `ISSUE-<nn>`/`FB-<nn>` pendente; o conjunto da rodada 15 passou
(`req-validation-20261030-1202.md`). Divergências registradas: nenhuma. A constatação da validação de testes
que motivou a revisão 6 chegou a esta etapa só por `DOMAIN.md`, sem `arquivo:linha`, e esta etapa não lê a
raiz de código; os critérios 12 a 15 são novos nesta revisão e a retirada é devida pela etapa de código na
próxima rodada, como os demais critérios ainda não implementados. `98-divergences.md` não muda.

**Itens recusados, com motivo**

- Nomear o arquivo da tela inicial, da dica e do guia (`DOMAIN.md` cita onde a validação de testes os
  encontrou): recusado, porque o seed não impõe esse arquivo como restrição e nomeá-lo seria decisão de
  desenho (strict-criteria, regra 8).
- Os itens recusados das rodadas 12 a 15 seguem recusados pelos mesmos motivos, e as propostas ao autor seguem
  valendo: atualizar as linhas dos pontos 02, 03 e 06 da lista "Riscos e incógnitas" do seed, que continuam
  com os valores antigos na revisão 6, e fechar as duas entradas de 2026-10-27 de `SCOPE-BACKLOG.md`, sem
  objeto desde a revisão 4. Proposta nova ao autor: o `date:` do seed continua 2026-10-29 nas revisões 5 e 6,
  ambas de 2026-10-30 (conventions §7: `date:` vai para o dia da mudança de revisão).
