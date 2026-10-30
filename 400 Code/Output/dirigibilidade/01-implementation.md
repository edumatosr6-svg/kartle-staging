---
title: Registro de implementação — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: code
status: validated
version: 3.1.0
sources: []
---

# Registro de implementação

Rodada 6, Mode B (2026-10-30): o projeto revalidado de `300 Specs/330 D-Specs/Output/dirigibilidade/` (rodada 12,
`dspec-validation-20261030-1530`, SUCCESS; F-Spec 4.1.0, seed `revision: 6`, `DOMAIN/DEC-17`) foi aplicado sobre a árvore da rodada 5:
nenhuma tela ensina nem oferece o drift ou o turbo. DES-0009 (novo) retira de `#welcome` o título, a frase e o trecho da tecla de
drift, de `.control-hint` o trecho "· Espaço: drift → turbo" e a seção `.maneuver-guide` inteira com as suas regras de estilo; DES-0007
1.3.0 retira o botão "Drift" do controle de toque, a leitura `touch.has('drift')` e a escrita `driftButton` por quadro; DES-0005 2.0.1
só remete às duas retiradas. Tudo por remoção, sem texto novo no lugar. A tecla de drift continua alimentando `drift` no `Input`
(`src/main.ts:549`), que a simulação ignora. `#lap-end-training` e os demais botões de `.actions` intocados. Nenhum arquivo de
`tests/`, `package.json` ou `tsconfig.json` tocado; `src/maneuvers.ts` fica (ADR-0006, decisão 4: retirada final depende de
`race-lap-validation` e `pista-kart-park`).

## Arquivos tocados nesta rodada (D-CD-01)

| Arquivo | Situação | Camada | Itens de projeto |
|---|---|---|---|
| `index.html` | alterado só por remoção: `#welcome` (`:19`), `.touch-controls` (`:32`), texto de `.control-hint` (`:34`), `.maneuver-guide` (antes `:35`) | aplicação | DES-0007, DES-0009 |
| `src/style.css` | alterado só por remoção (`:3`): regras `.maneuver-guide` (cinco, mais a de `@media(max-width:700px)`) e `.touch-controls button[data-control=drift]` | aplicação | DES-0007, DES-0009 |
| `src/main.ts` | alterado só por remoção: `\|\| touch.has('drift')` em `:549`; as duas linhas `driftButton` (antes `:655-656`) | aplicação | DES-0007 |

Inalterados: `src/physics.ts`, `src/maneuvers.ts` (janela de compatibilidade), `src/lapMessages.ts`, `src/handlingMessages.ts`,
`src/setupRecords.ts`, `scripts/*`, `docs/physics.md`, `tests/*`.

## Portão determinístico desta rodada

| Passo | Resultado |
|---|---|
| `npx tsc --noEmit -p .` | saída 0 |
| `npx vite build` | saída 0 |
| `index.html` contra `/drift\|turbo\|impulso\|combo\|Espaço/i` | nenhuma ocorrência |
| `npx tsx --test tests/*.test.ts` | 432 testes: 422 aprovados, 10 reprovados — todos esperados e devidos a outras etapas (`98-divergences.md`, "Verificações reprovadas") |
| `lint_artifacts.py --stage code --feature dirigibilidade --emit` | ver `97-changelog.md`, rodada 6 |

A física não mudou nesta rodada: as medidas de `npm run bench:handling` da rodada 5 valem (`97-changelog.md`, rodada 5;
`docs/physics.md`).

## Rastreabilidade

A matriz `99-traceability.md` é gerada pelo gate a partir dos campos `sources` dos registros `core/`, `data/`, `web/` e `security/`;
cada registro nomeia, por `REQ-*`, o arquivo e o símbolo que o realiza. O índice `00-index.md` também é gerado. As linhas do registro
de divergências do projeto (4.1.0) e as dependências desta rodada estão em `98-divergences.md`. O histórico das rodadas 1 a 5 (inclusive o portão
e as medidas de `npm run bench:handling` da rodada 5, que esta rodada não move) está em `97-changelog.md`.
