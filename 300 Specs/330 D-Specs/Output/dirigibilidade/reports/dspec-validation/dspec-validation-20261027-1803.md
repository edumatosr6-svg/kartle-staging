---
stage: dspec
feature: dirigibilidade
verdict: SUCCESS
generated: 2026-10-27T18:03:13Z
counts: {blocker: 0, error: 0, warning: 1, info: 4, divergence: 2}
seed: {revision: 3, digest: 7dd24c8b6cab}
upstream: {stage: fspec, version: 3.4.0, status: validated, index-generated: 2026-10-27T17:43:16Z}
feedbacks: []
population: "revalidação após dspec-validation-20261027-1531 (SUCCESS); rodada 9, Mode C (feedback do código feedback-20261027-1619, SPEC-ISSUE-03; F-Spec movido a 3.4.0: API-0003, FEAT-0002, FLOW-0002, RULE-0002, 97-changelog): ISSUE-01 a ISSUE-05 daquele relatório reverificadas primeiro; arquivos com version movida (git diff contra HEAD): 01-architecture.md 3.1.0, 97-changelog.md 3.1.0, 98-divergences.md 3.1.0, adr/ADR-0004 4.1.0, adr/ADR-0005 1.3.0, core/DES-0001 3.4.0, core/DES-0004 5.1.0, test-strategy.md 5.1.0 (00-index.md e 99-traceability.md só mudaram de status, gerados pelo gate); dois intocados sorteados: adr/ADR-0002 2.0.0 e core/DES-0002 1.1.1; lista de REQ-* (62), AC-* (32), NFR-* (9) e DOMAIN/DEC-14 extraída do F-Spec por script; API-0003 3.4.0 comparada campo a campo com DES-0004 5.1.0 (maxUndersteerMs, offAsphaltStepCount, v1Mps); caminhos de módulo (35 distintos) e 250 citações arquivo:linha da população conferidos por script contra a árvore (commit 767508e) e, onde o artefato fixa 0068a57, contra git show 0068a57; símbolos de relógio, sorteio e node:os em scripts/handlingBench.ts por grep; 61 links relativos e 2 blocos mermaid por script; grep de segredos, dado pessoal e TBD/OPEN"
context-ignored: "nenhuma justificativa do gerador chegou pela invocação; 97-changelog.md (versão movida) e as seções Contexto/Alternativas de ADR-0004 e ADR-0005 foram lidos como conteúdo do artefato, não como justificativa; reports/feedback/feedback-20261027-1619.md foi lido como relatório da feature (§12) só para situar SPEC-ISSUE-03"
---

# Relatório de validação — dirigibilidade (D-Spec)

## Summary

- ISSUE-01 de 1531 (warning, citações `arquivo:linha`): sem correção — o registro de mudanças declara "não feito"; os sítios anteriores permanecem e a árvore da rodada de código 3 (`767508e`) acrescentou sítios em `01-architecture.md`, `ADR-0005`, `DES-0004` e `DES-0002`; reportada como ISSUE-01.
- ISSUE-02 de 1531 (info, I4): sem mudança — `ADR-0001` 1.0.1 intacto, seção Feature flag de `DES-0001` 3.4.0 igual; reportada como ISSUE-02.
- ISSUE-03 de 1531 (info, SCR-0002): sem mudança — `ADR-0002` 2.0.0 (amostra) Consequências, primeiro item, e `DES-0006` 1.1.0 intactos; reportada como ISSUE-03.
- ISSUE-04 de 1531 (info, coluna "Item de projeto" nas linhas resolvidas): sem mudança — as duas tabelas resolvidas de `98-divergences.md` 3.1.0 seguem com quatro colunas; reportada como ISSUE-04.
- ISSUE-05 de 1531 (info, nome `throttleCondition` em `DES-0004`): sem mudança — o nome do campo continua ausente do item; reportada como ISSUE-05.
- SPEC-ISSUE-03 (código, 20261027-1619): absorvido pelo F-Spec 3.4.0 (`DOMAIN/DEC-14`: `maxUndersteerMs` com `THROTTLE_ZERO` contado só nos passos na faixa até a primeira saída) e realizado em `DES-0004` 5.1.0 (Realiza, `BenchRecord`, tabela de ensaios, falha, Observabilidade), `ADR-0004` 4.1.0 (decisão 9 e 3, alternativas), `ADR-0005` 1.3.0 (decisão 1), `DES-0001` 3.4.0 (`assistLateralG`), `test-strategy.md` 5.1.0 (AC-US-0002-01, -02), `01-architecture.md` 3.1.0 e `98-divergences.md` 3.1.0, contra `scripts/handlingBench.ts:272-283`, `:280-281`, `:693-697` e `docs/physics.md:253`, `:380`, `:404` em `767508e`.

## Issues

### ISSUE-01

- severidade: warning
- verificação: D9 — "o que existe hoje em `arquivo:linha`" de cada linha do registro (e D2, verificação de posicionamento contra a árvore)
- arquivo: `98-divergences.md`; `01-architecture.md`; `core/DES-0001-acerto-arcade-assistido-v5-e-assistencias.md`; `core/DES-0004-ensaios-de-dirigibilidade-e-saida.md`; `core/DES-0002-telemetria-de-dirigibilidade.md`; `adr/ADR-0004-ensaios-como-biblioteca-e-parametros-de-ensaio.md`; `adr/ADR-0005-pista-de-teste-como-ambiente-da-simulacao-e-velocidade-mantida.md`
- localização: `98-divergences.md` tabela "resolvidas pela rodada de código 2" (`0068a57`) linhas REQ-FEAT-0004-03/-04/-08 (`docs/physics.md:253`), REQ-FEAT-0004-05 (`:254`), REQ-FEAT-0005-01 a -04 (`:255-257`), REQ-FEAT-0005-07 (`:259`), REQ-FEAT-0006-04 (`:260`), REQ-FEAT-0003-02 (`src/physics.ts:46`), e parágrafo final (`src/lap.ts:173`); `01-architecture.md` tabela de compatibilidade, linha "Linha de base em `docs/physics.md`" (`:265-412`); `DES-0001` Posicionamento (`RENTAL_KART` `:50-58`) e tabela de alavancas, linha `assistSteerAllowanceRad` (`docs/physics.md:252`); `DES-0004` tabela Interface, linha `baselineRecord` ("O as-built (`:311`) aceita qualquer `v1Mps` numérico"); `DES-0002` parágrafo "Por que `setup` é parâmetro" (`src/lap.ts:120`); `ADR-0004` Contexto, quarto item (`docs/physics.md:252`); `ADR-0005` decisão 1 (`src/physics.ts:161-163`), decisão 4 (`:277`) e Consequências (`forcingRampMps`, `:46`)
- achado: em `0068a57`, `GRASS_LOSS` está em `docs/physics.md:252` (não `:253`), `WALL_CONTACT` em `:253` (não `:254`), `DETERMINISM` em `:254` (fora de `:255-257`), `STEP_CONTRACT` em `:258` (não `:259`), `REALISTA_UNCHANGED` em `:259` (não `:260`) e `UNDERSTEER_ONSET` de `ARCADE_KART` (808 ms) em `:246` (não `:252`); em `767508e`, `forcingRampMps` está em `src/physics.ts:45` (não `:46`), `RENTAL_KART` começa em `:49` (não `:50`), `Environment`/`CIRCUIT`/`TEST_PAD` estão em `:164-166` (não `:161-163`; `DES-0001` e `DES-0004` citam `:164-166` corretamente), `:277` é uma chave de fechamento (não a distância da parede), o bloco `handling-baseline` está em `docs/physics.md:279-426` (não `:265-412`; a mesma `01-architecture.md` cita `:279-426` no primeiro parágrafo), `src/lap.ts` devolve a sessão fora de `RUNNING` em `:180` (não `:173`) e a cópia do `config` não está em `:120` (as inserções de `:23`, `:30-31`, `:54-55`, `:123-124` deslocaram o arquivo); `scripts/handlingBench.ts:311` já não "aceita qualquer `v1Mps` numérico": `v1FromCompletePlateau` (`:316-321`) e `understeerBaselineRecord` (`:325-330`) realizam a decisão 10, como a própria `98-divergences.md` 3.1.0 (linha REQ-FEAT-0002-04/-05/-07/-10) cita; todas as demais citações `arquivo:linha` da população conferem na árvore que o artefato fixa.
- esperado: renumerar as citações (`docs/physics.md:252`, `:253`, `:254`, `:258`, `:259`, `:246` em `0068a57`; `src/physics.ts:45`, `:49-58`, `:164-166`; `docs/physics.md:279-426`; `src/lap.ts:180` e a linha corrente da cópia do `config`; a linha da distância da parede) e reescrever a frase do as-built de `baselineRecord` em `DES-0004` como entregue em `767508e` (`:316-321`, `:325-330`), sem outra mudança.

### ISSUE-02

- severidade: info
- verificação: D5 — I4 (chave mestra desligada por padrão)
- arquivo: `adr/ADR-0001-versao-do-acerto-como-registro-novo-no-codigo.md`; `core/DES-0001-acerto-arcade-assistido-v5-e-assistencias.md`
- localização: `ADR-0001` linhas 32-37 e 45-46; `DES-0001` linhas 219-227
- achado: sem chave mestra porque FEAT-0005 (Configuração) proíbe configuração para escolher entre o acerto antigo e o novo; o padrão sem mudança de I4 está nos campos opcionais ausentes em `RENTAL_KART`/`ARCADE_KART`, com `REALISTA_UNCHANGED` como prova.
- esperado: nada a mudar.

### ISSUE-03

- severidade: info
- verificação: D3 — cobertura do F-Spec nos dois sentidos
- arquivo: `web/DES-0006-resultado-melhor-tempo-e-texto-compartilhado.md`; `adr/ADR-0002-formato-do-replay-e-registro-de-volta-em-memoria.md`
- localização: `DES-0006` linhas 140-145; `ADR-0002` Consequências, primeiro item
- achado: "abrir um tempo ou replay gravado" e "reproduzir um replay" de SCR-0002 sem tela porque nenhuma feature persiste registros; a redução é declarada e `readReplay`/`replayLap` ficam disponíveis; nenhum `REQ-*` afetado.
- esperado: nada a mudar nesta rodada; a feature que persistir registros cobre esse ponto de entrada.

### ISSUE-04

- severidade: info
- verificação: D9 — campos de cada linha de `98-divergences.md`
- arquivo: `98-divergences.md`
- localização: tabelas "Linhas resolvidas pela rodada de código 3" (2 linhas) e "Linhas resolvidas pela rodada de código 2" (16 linhas)
- achado: as linhas `resolved` trazem requisito, exigência, o que resolveu em `arquivo:linha` e estado, mas não a coluna "Item de projeto" que D9 lista para toda linha; nenhum requisito fica sem item de projeto (os 62 `REQ-*` estão em `sources` de ao menos um DES/DM).
- esperado: nada a mudar para o veredito; opcionalmente acrescentar a coluna "Item de projeto" às tabelas resolvidas, por uniformidade com a tabela aberta.

### ISSUE-05

- severidade: info
- verificação: D3 — contrato API-0003 servido campo a campo
- arquivo: `core/DES-0004-ensaios-de-dirigibilidade-e-saida.md`
- localização: tabela Interface, linha `BenchRecord` (`REFERENCE_CORNER`, `:68-69`); tabela de ensaios, linha `REFERENCE_CORNER`
- achado: o campo obrigatório `throttleCondition` de `REFERENCE_CORNER` (API-0003) continua nomeado no item só pelos seus valores (`THROTTLE_ZERO`, `THROTTLE_FULL`); o nome do campo não aparece em `DES-0004`, embora o as-built (`scripts/handlingBench.ts:68`, `:284`) o carregue e o item afirme "exatamente os campos de API-0003".
- esperado: nomear `throttleCondition` na linha `BenchRecord` de `REFERENCE_CORNER`.

## Divergences

- registro: `98-divergences.md` 3.1.0 — 2 linhas abertas (REQ-FEAT-0002-01/-03/-09 sob `DOMAIN/DEC-14`, etapa devedora código, itens DES-0004/ADR-0004/ADR-0005; REQ-FEAT-0005-07 e REQ-FEAT-0006-03 com a prova em `npm test`, etapa devedora testes, itens DES-0004/test-strategy), cada uma com `REQ-*`, exigência, estado atual em `arquivo:linha`, etapa devedora, item de projeto e estado `open`.
- citações conferidas em `767508e`: `scripts/handlingBench.ts:272-283`, `:280-281` (acumula `understeer` em todos os 300 passos), `:693-697`, `:762-799`, `:367`, `:376-377`, `:379-382`, `:316-321`, `:325-330`, `:698-707`, `:499`; `src/lap.ts:23`, `:30-31`, `:54-55`, `:123-124`, `:278-279`; `src/setupRecords.ts:92-93`, `:109-114`; `src/main.ts:226`; `scripts/keyboard-lap.ts:26`; `docs/physics.md:253` (633 ms, 61 passos fora), `:255`, `:380` e `:404` (`REFERENCE_CORNER` `THROTTLE_ZERO`, `maxUndersteerMs` 633, `offAsphaltStepCount` 61, `FAIL`, nos dois `inputMode`); `tests/` sem `dirigibilidade-*.test.ts` nem `fixtures/records.ts`; `docs/handling-device-log.md` ausente.
- linhas resolvidas: 18 (2 pela rodada de código 3, 16 pela rodada 2), cada uma com o `arquivo:linha` que a resolve (citações de `docs/physics.md:253-260` e `src/physics.ts:46` em `0068a57` em ISSUE-01); nenhum requisito saiu do registro.
- `waived-pending`: nenhuma.

## Coverage

- Requisitos: 62 de 62 cobertos (REQ-FEAT-0001-01..09, 0002-01..10, 0003-01..12, 0004-01..10, 0005-01..12, 0006-01..09); o F-Spec 3.4.0 não acrescentou nem retirou `REQ-*`; as linhas `sources` dos arquivos movidos não mudaram; nenhum descoberto.
- NFR: 9 de 9 com mecanismo e métrica (`test-strategy.md` linhas 121-129 e `DES-0004` Observabilidade).
- API-0003 3.4.0 ↔ `DES-0004` 5.1.0: `maxUndersteerMs` de `REFERENCE_CORNER` com `THROTTLE_ZERO` só nos passos na faixa até a primeira saída e com `THROTTLE_FULL` em todos os passos; `offAsphaltStepCount` informativo na janela inteira, com `offAsphaltFirstStep` como o passo em que a janela fechou; `v1Mps` do patamar interrompido medido só até a saída, inclusive quando esse patamar é o primeiro acima de 200 ms, e o motivo "sem início de subesterço até a saída da faixa" só no caso de `DOMAIN/DEC-12`; nenhum campo nem valor de enum acrescentado; ISSUE-05 para o nome `throttleCondition`. API-0001 ↔ `DES-0002` (amostra): 11 campos e `NO_STATE`, campo a campo. API-0002 ↔ `ADR-0002` (amostra): `LapRecord`, `replayFormatVersion` 1, `RESOLVED_FROM_ABSENCE`, `UNSUPPORTED_FORMAT`.
- RULE-0002 3.4.0 "qualquer ensaio em que a permanência na faixa não é exigida": coberto para `REFERENCE_CORNER` `THROTTLE_ZERO` (`DES-0004`, `ADR-0004` decisão 9) e para o patamar interrompido de `UNDERSTEER_ONSET` (`DES-0004` tabela de ensaios; `ADR-0004` Contexto).
- Itens de projeto sem fonte: nenhum (14 itens, todos com `REQ-*`/`FEAT-*` em `sources`; nenhuma fonte fora do F-Spec).
- Critérios sem caminho de teste alcançável: nenhum (32 de 32 `AC-*`; 6 de 6 `FEAT-*` com nível; AC-US-0002-01 e -02 recomputam `maxUndersteerMs` sobre os passos anteriores ao primeiro `GRASS` e julgam o registro sintético 61/240/125 ms como `PASS`); nenhum gancho, configuração ou endpoint só de teste.
- Caminhos novos declarados e ausentes da árvore: `tests/dirigibilidade-*.test.ts`, `tests/fixtures/records.ts`, `docs/handling-device-log.md`; `docs/physics-baseline.json` só como alternativa recusada em `ADR-0003`; existentes conferidos: `src/physics.ts`, `src/lap.ts`, `src/setupRecords.ts`, `src/handlingMessages.ts`, `src/main.ts`, `src/track.ts`, `src/trackData.ts`, `src/lapTiming.ts`, `src/maneuvers.ts`, `src/lapMessages.ts`, `src/audio.ts`, `src/style.css`, `index.html`, `scripts/handlingBench.ts` (853 linhas), `scripts/keyboard-lap.ts`, `scripts/physics-bench.ts`, `docs/physics.md` (426 linhas), `docs/lap-validation-bench.md`, `tests/physics.test.ts`, `tests/maneuvers.test.ts`, `tests/race-lap-validation-*.test.ts`, `tests/fixtures/trackFiles.ts`.
- Camadas (D-DS-01, I2, I10): nenhum módulo, camada ou dependência nova; `scripts/handlingBench.ts` segue na camada Simulação e o único ponto que muda é a acumulação de `:280-81`; `src/physics.ts` e `ARCADE_ASSISTIDO_V5` não tocados.
- Determinismo (D-DS-07): `scripts/handlingBench.ts` sem `Date`, `performance`, `Math.random`, `node:os`, `node:perf_hooks` fora de comentário; prova nomeada em `DES-0004` Determinismo e `test-strategy.md` NFR-0001/NFR-0005.
- Segredos, dado pessoal, `TBD`, `OPEN-<nn>`: nenhum; 61 links relativos resolvem; 2 blocos `sequenceDiagram` bem formados.
- Feedbacks enviados: nenhum.
