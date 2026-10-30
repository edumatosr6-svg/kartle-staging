---
id: DES-0010
title: Tela de resultado da volta
feature: race-lap-validation
stage: dspec
status: validated
version: 1.2.1
sources: [FEAT-0002, FEAT-0004, FEAT-0006, FEAT-0010, REQ-FEAT-0002-02, REQ-FEAT-0002-03, REQ-FEAT-0002-06, REQ-FEAT-0004-03, REQ-FEAT-0006-07, REQ-FEAT-0010-21]
---

# DES-0010 — Tela de resultado da volta

## Realiza

Os `REQ-*` em `sources`: exibir a volta como válida com o tempo total e os quatro tempos de setor (AC-US-0002-01
a -03), no formato `m:ss.mmm` (AC-US-0002-06); identificar em texto como "não oficial" o tempo de uma volta de
reconhecimento ou de pista de dado incompleto (AC-US-0008-01); não exibir tempo oficial numa volta inválida
e exibir o motivo (AC-US-0004-03, -04); só comparar dois tempos quando a `comparability` dos dois registros é
`COMPARABLE` (SCR-0003, "Comparação de tempos"; FB-01 de `dirigibilidade`, aceito no F-Spec na rodada de 2026-10-22).
Tela: SCR-0003, só para a volta oficial e a de reconhecimento: depois do encerramento delas nenhuma volta seguinte
começa (AC-US-0010-21). O resultado de cada volta do treino não usa esta tela: aparece em SCR-0001, sem parar o jogo
([DES-0008](DES-0008-hud-da-volta-mensagens-e-idioma.md), `#lap-training-result`).

## Posicionamento

`index.html`, `src/style.css` e `src/main.ts`, camada **aplicação**: um painel `#lap-result` dentro de
`.game-shell`. Sem módulo novo; os textos e o formato vêm de `src/lapMessages.ts`
([DES-0008](DES-0008-hud-da-volta-mensagens-e-idioma.md)). A tela só exibe o `LapResult` produzido pela simulação.

## Interface

O painel aparece quando `lapPhase` chega a `ENDED` numa volta `OFFICIAL` ou `RECON`, no quadro do encerramento, lendo
`getLapResult` (sem espera,
sem rede). Estados:

| Estado | Condição | Conteúdo |
|---|---|---|
| Válida oficial | `lapValidity` `VALID` e `official` verdadeiro | `lapResultValid`; `totalLabel` com `formatLapTime(lapMs)`; os quatro `sectorLabel` n com `formatLapTime(sectorMs[n-1])` |
| Válida não oficial | `VALID` e `official` falso (reconhecimento, ou pista de dado incompleto) | o mesmo, mais `lapUnofficial` ao lado do tempo total |
| Inválida | `INVALID` | `lapStateInvalid` e o texto do motivo; nenhum tempo total, nenhum tempo de setor, nenhum tempo oficial |
| Vazio | `getLapResult` devolve `NO_RESULT` (volta na contramão, recarregada ou abandonada) | o painel não é exibido |
| Erro | volta `ENDED` sem resultado (defesa que não deve ocorrer) | o painel não é exibido e nenhuma mensagem própria é definida |
| Offline | sem rede | idêntico ao online |
| Permissão negada | não se aplica | — |

Ações: um botão `newLap` que leva à oferta ([DES-0009](DES-0009-inicio-de-volta-e-erros.md)). Esta feature não
oferece compartilhar, gravar nem consumir tentativa (pertencem ao desafio diário). O texto de estado e de motivo
usa as mesmas fichas e tamanhos de DES-0008 (4,5:1; 16 px no mínimo); o painel tem fundo opaco, de modo que o fundo
imediato é determinado.

O tempo total e os de setor exibidos são a conversão direta dos inteiros do resultado; a exibição não
arredonda e a igualdade entre execuções é verificada no resultado em ms, e não no texto (RULE-0003).

## Comparação de tempos (SCR-0003)

O resultado lido traz `setupId` e `setupVersion` quando o pedido `startLap` os informou ([DM-0002](../data/DM-0002-estado-da-volta-em-memoria.md)).
Qualquer comparação entre o resultado e outro registro — diferença, melhor tempo ou ordenação — só é exibida
quando `compareLapRecords(a, b)` (`src/setupRecords.ts`, de `dirigibilidade`, camada Simulação) devolve
`{comparability: 'COMPARABLE'}`:

| Resposta de `compareLapRecords` | O que a tela mostra |
|---|---|
| `{comparability: 'COMPARABLE'}` | a comparação |
| `{comparability: 'SETUP_VERSION_DIFFERS' \| 'SETUP_DIFFERS' \| 'TRACK_DIFFERS'}` | nenhuma comparação; os tempos do próprio resultado continuam exibidos |
| `{code: 'INCOMPLETE_RECORD'}` | nenhuma comparação; `console.warn('lap-record', code)`, só o código |

A decisão é sempre da simulação e do leitor de registros, nunca da renderização (D-FS-05, I2): a aplicação passa
os dois registros e exibe ou não, sem comparar campos por conta própria. Um resultado anterior, sem os dois campos,
entra na comparação com os padrões de leitura de API-0001, aplicados por `resolveSetupRef` dentro de
`compareLapRecords` (I5). Quais tempos são comparados e de onde vêm (melhor tempo gravado, tentativa anterior) é
do desafio diário; esta feature fixa só a precondição. Posicionamento no código em execução: `src/main.ts:289-295`
(`renderBest`) e `src/main.ts:524-538` (melhor registro), ambos na camada aplicação. A partir da rodada de 2026-10-30
o melhor registro é atualizado a cada resultado novo, e não só ao chegar a `ENDED`
([DES-0007](DES-0007-integracao-da-aplicacao.md)): no treino, cada volta concluída na chegada é um resultado e passa
pela mesma precondição; em volta oficial e de reconhecimento os dois instantes coincidem.

O texto compartilhado e o replay derivados deste resultado são registros de `dirigibilidade`
(`src/handlingMessages.ts`, `src/setupRecords.ts`): copiam `setupVersion` do resultado e obedecem à mesma
precondição; esta feature não os projeta. Os elementos `#lap-result-setup` e `#lap-share` já existentes no painel
pertencem àquela feature e não são superfície de SCR-0003.

## Colaboradores

Chama `getLapResult` (`src/lap.ts`), `formatLapTime` e `message` (`src/lapMessages.ts`) e, para a precondição de
comparação, `compareLapRecords` (`src/setupRecords.ts`, de `dirigibilidade`, camada Simulação — sentido permitido,
aplicação para simulação). Chamado por `src/main.ts`.

## Estado e concorrência

Sem estado próprio. O resultado é lido, nunca gravado: nada é persistido no navegador por esta feature
(REQ-FEAT-0009-11). Ler duas vezes dá o mesmo valor, pois o resultado não muda depois de `ENDED`.

## Comportamento em falha

Sem dependência. Resultado ausente com a volta encerrada: o painel não aparece e nada é registrado.

## Determinismo (D-DS-07)

Exibição pura de um inteiro. Provas: `tests/lap-messages.test.ts` (formato dos tempos, texto "não oficial" por
`official`) e `tests/lap-state.test.ts` (resultado `VALID` com quatro setores e soma igual ao total; resultado
`INVALID` sem tempos). A decisão de comparabilidade é provada onde é decidida, em `dirigibilidade`
(`compareLapRecords`); esta tela só a consome. A ausência de comparação fora de `COMPARABLE` é verificada no passo
"comparação de tempos" do roteiro E2E-02 da test-strategy: treino com uma volta válida concluída no acerto corrente;
encerramento do treino e troca de acerto pelo seletor existente `#handling-preset` (só fora de volta ou de treino
ativo, `src/main.ts:320-332`); outro treino com uma volta válida — o melhor tempo exibido não é comparado com o do
outro acerto (`SETUP_DIFFERS`); segunda volta válida no mesmo acerto — a comparação é exibida (`COMPARABLE`). O ramo
`TRACK_DIFFERS` é alcançado no mesmo roteiro pela troca de pista: a árvore empacota duas pistas de treino
(`TRAINING_TRACKS`, `src/trainingSession.ts:12-15`), trocadas por `chooseTrack` (`src/main.ts:227`), e `renderBest`
compara o melhor registro com a pista corrente (`src/main.ts:289-295`); com o melhor tempo da Kart Park, a pista
sintética não o exibe nem o compara. O ramo `SETUP_VERSION_DIFFERS` não é alcançável pela tela (o seletor de acerto só
oferece as versões publicadas correntes) e não ganha superfície de teste: fica provado nos testes de
`compareLapRecords` de `dirigibilidade`, no ponto de decisão.

## Feature flag

Nenhuma: FEAT-0002 não tem chave.

## Pontos em aberto

Nenhum.
