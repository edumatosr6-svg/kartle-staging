---
id: DM-0001
title: Linha de base da simulação anterior à feature (fixture versionado) e registro dos testes em tela
feature: modelo-kart-01
stage: dspec
status: validated
version: 1.2.0
sources: [API-0002, FLOW-0003, FEAT-0004, FEAT-0005, FEAT-0006, REQ-FEAT-0004-05, REQ-FEAT-0005-05, REQ-FEAT-0006-07, REQ-FEAT-0006-08, NFR-0001, NFR-0006, NFR-0007]
---

# DM-0001 — Linha de base da simulação e registro dos testes em tela

## Realiza

O dado que `SIM_CONTRACT`, `DETERMINISM` e `WHEEL_POSITIONS` comparam — "a linha de base anterior à feature"
de API-0002, com `BASELINE_MISSING` quando ausente (REQ-FEAT-0005-05, REQ-FEAT-0006-07, -08; NFR-0006,
NFR-0007) — e a forma do registro em tela que FEAT-0004 exige (REQ-FEAT-0004-05; NFR-0001). Não há banco,
tabela nem dado persistido do Jogador: o F-Spec diz que nenhuma mudança de dado persistido ou de esquema é
implicada; os dois artefatos abaixo são arquivos do repositório, lidos por `npm test` ou por pessoas
([ADR-0004](../adr/ADR-0004-linha-de-base-da-simulacao-como-fixture-versionado.md)).

## 1. `tests/fixtures/kart01-sim-baseline.json` (novo; camada Aplicação, dado de teste)

Gravado uma vez por `scripts/kart01-baseline.ts` sobre a árvore imediatamente anterior à primeira mudança de
código desta feature; lido por `readSimBaseline`
([DES-0006](../web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md)).

| Campo | Tipo | Unidade | Nulável | Observação |
|---|---|---|---|---|
| `schemaVersion` | inteiro | — | não | 1; outro valor é `BASELINE_MISSING` |
| `recordedAtUtc` | texto ISO 8601 | — | não | instante da gravação; só documental |
| `recordedOnCommit` | texto (sha) | — | sim | revisão em que foi medido (`--commit`); só documental |
| `stepS` | número | s | não | `STEP` em vigor (1/120) |
| `inputTypeLine` | texto | — | não | a linha `export type Input = ...` de `src/physics.ts`; comparada literalmente: a parte "conjunto de campos" de `inputContractUnchanged`; a parte "faixas" é provada pela saturação de `step` em `simContractCheck` ([DES-0006](../web/DES-0006-verificacoes-de-npm-test-e-relatorio-do-modelo.md): pares além/no limite, limite/dentro e limite/junto ao limite a 0,01; um limite movido para dentro de menos de 0,01 fica para a diferença de 0 linhas em `src/physics.ts` do manifesto da etapa de código), sem campo próprio na linha de base |
| `simWheelbaseM`, `simTrackWidthM` | número | m | não | 1,04 e 1,20: `wheelbase` e `trackWidth` dos acertos publicados |
| `trackId`, `trackVersion` | texto; texto ou inteiro | — | não | da leitura usada (`synthetic`, 2); leitura corrente diferente é `BASELINE_MISSING` |
| `wheelPositions` | objeto por `setupId` → lista de 4 `{ forwardM, leftM }` | m | não | `wheelPositions(config)` de cada acerto publicado, na ordem dianteira esquerda, dianteira direita, traseira esquerda, traseira direita |
| `referenceRuns` | lista de 2 objetos | — | não | uma execução por acerto publicado |
| `referenceRuns[].setupId`, `setupVersion` | enum; texto | — | não | `PUBLISHED_SETUPS[setupId].setupVersion` no momento da gravação; `setupVersion` corrente diferente é `BASELINE_MISSING` |
| `referenceRuns[].lapKind` | enum | — | não | `OFFICIAL` |
| `referenceRuns[].driverMassKg` | número | kg | não | 75 (o `driverMass` do acerto publicado) |
| `referenceRuns[].inputRuns` | lista de `[contagem, throttle, brake, steer, drift]` | passos; adimensionais | não | os `Input` por passo da volta de referência, codificados por corridas; expandidos, no máximo 6 000 passos; replay literal, sem depender do `autopilot` |
| `referenceRuns[].checkStepCount` | inteiro | passos | não | passos aplicados depois da contagem (soma das contagens) |
| `referenceRuns[].lapValidity`, `lapMs`, `sectorMs` | enum; inteiro; lista de 4 inteiros | ms | `lapMs` e `sectorMs` só com `VALID` | de `getLapResult` da sessão final |
| `referenceRuns[].finalKart` | objeto `State` | m, rad, m/s, s | não | o `kart` da sessão final, campo a campo (inclui `telemetry` e `maneuvers`), comparado por `deepEqual` |

Unicidade: um arquivo por repositório; a chave de cada execução é `setupId`. Índices e chaves estrangeiras:
não se aplicam (JSON lido inteiro). Nenhum campo tem padrão: um campo ausente é `BASELINE_MISSING`.

**Plano de migração.** Revisão `schemaVersion` 1, criada pelo gravador. Uma mudança futura de forma é
`schemaVersion` 2 com o leitor de 1 mantido (I3, I5; D-DS-02). **Reversão (downgrade):** apagar o arquivo —
`SIM_CONTRACT`, `DETERMINISM` e `WHEEL_POSITIONS` passam a reportar `FAIL` `BASELINE_MISSING` e nada mais
depende dele; nenhum dado de jogador é tocado. **Preenchimento retroativo:** nenhum. **Janela de
compatibilidade:** o arquivo vale só para o `setupVersion` de cada acerto e para a `trackVersion` gravados;
quando outra feature publica um acerto ou uma pista nova, o seu ciclo regrava o arquivo (`npm run
baseline:kart01 -- --force --commit <sha>`) ou aceita `BASELINE_MISSING` até fazê-lo — nunca uma comparação
contra uma linha de base de outro acerto. Enquanto a `dirigibilidade` estiver em ciclo de acerto, o arquivo só
é gravado depois do seu código validado ([ADR-0003](../adr/ADR-0003-ordem-de-entrega-depois-da-dirigibilidade-e-sem-chave.md)).

**Retenção e privacidade.** Fica no repositório enquanto a feature existir; contém números da simulação,
identificadores de acerto e de pista e um sha de commit; nenhum dado pessoal, nome de máquina, de usuário ou
caminho absoluto (D-DS-04, I6).

## 2. `docs/kart-01/device-log.md` (novo; registro em tela, lido por pessoas)

No molde de `docs/lap-validation-device-log.md`: uma entrada por execução registrada; o que não foi executado
fica marcado como tal; ausência de registro nunca vale como aprovação (I9).

| Campo da entrada | Conteúdo |
|---|---|
| Build | commit, `npm run build`, nomes dos arquivos de `dist/assets/` |
| Aparelho e navegador | modelo comercial do notebook ou celular de referência de RNF03, sistema, navegador e versão, DPR, tamanho da área de jogo em px |
| Orientação | paisagem ou retrato (celular: as duas, uma entrada cada) |
| Método da contagem | ferramentas de desempenho do navegador ou trecho colado no console contando `requestAnimationFrame` por segundo de relógio; nunca código do jogo |
| `fpsPerSecond` | lista com a contagem de quadros de cada segundo da volta completa em corrida, da largada ao fim, aba em primeiro plano, sem pausa |
| `minFps` | a menor contagem da lista; o limite é 60 (notebook) ou 30 (celular) |
| Roteiros `E2E-nn` | resultado e evidência de cada roteiro de `test-strategy.md` executado |
| Download | bytes comprimidos transferidos numa primeira visita com cache vazio, pela lista de transferências de rede (NFR-0002) |

**Retenção e privacidade:** sem identificador de jogador, conta, localização ou nome de usuário; o aparelho é
nomeado pelo modelo comercial. Não há migração: é prosa com tabelas.
