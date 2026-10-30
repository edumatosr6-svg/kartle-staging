---
id: REL-0002
title: Migração — arquivo de pista (leitor v1/v2 mantido), estado da volta e sessão de treino em memória, dado persistido intocado
feature: race-lap-validation
stage: deploy
status: validated
version: 1.1.0
sources: [DM-0001, DM-0002, ADR-0006, NFR-0012, TEST-0009, TEST-0015, CHK-TEST-0009-01, CHK-TEST-0009-03]
---

# REL-0002 — Migração

## Não há banco

O produto não tem banco no MVP (I5; DM-0001, seção *Não há banco*). Os "esquemas" desta release são:

| Esquema | Onde vive | Versão nesta release | Persistido |
|---|---|---|---|
| Arquivo de pista | empacotado no bundle (`SYNTHETIC_TRACK_FILE` em `src/track.ts`; a Kart Park em `src/tracks/kart-park-v1.json`, da release `pista-kart-park`) | primeira release: `schemaVersion` 2, `synthetic` `trackVersion` 2 (DM-0001). No build desta rodada (`6b314b2`) o leitor está no esquema 3 (`TRACK_SCHEMA_VERSION = 3`, mudança da release `pista-kart-park`, com o leitor das versões 1 e 2 mantido); **esta rodada não muda o arquivo nem o leitor** | não: viaja dentro do JS |
| Estado e resultado da volta | memória da página (`LapSession`, `LapResult`; DM-0002 1.2.0) | sem versão: tipo interno, descartado ao recarregar | não |
| Sessão de treino de voltas seguidas (seed rev 3; ADR-0006) | a mesma `LapSession`, com `lapSequenceCount`, `lapStartMs`, a lista de resultados (`trainingLapMs` em cada um) e `bestValidLapMs` derivado (DM-0002, INV-1 a INV-10) | sem versão: campos novos de um tipo interno, descartados ao recarregar ou ao encerrar o treino | não: 0 entradas no armazenamento do site (E2E-08; `smoke.md` D9/M9) |
| Dado do jogador no navegador | nenhum escrito por esta feature (DES-0011; `CHK-TEST-0013-03`) | — | a feature não lê nem escreve |

## Revisões, ordem, duração e reversão (D-DP-01)

| # | Revisão | O que faz | Ordem | Duração | Reversão (downgrade) | Como a reversão foi ensaiada |
|---|---|---|---|---|---|---|
| 1 | arquivo de pista `schemaVersion` 1 → 2 | o leitor `readTrackData` (`src/trackData.ts`, `TRACK_SCHEMA_VERSION = 2`) passa a entender as versões 1 e 2; a versão 1 é lida sem erro como `INCOMPLETE`, mantendo `trackId` e `trackVersion`; uma versão maior que 2 é `UNSUPPORTED_SCHEMA` e fica intacta | única; aplicada no mesmo passo em que o bundle é publicado | 0 s de indisponibilidade: não há dado armazenado a converter | `runbook.md`, *Roll back* R1: nesta primeira release não há `dist/` anterior — despublicar o site (caminho A); nas seguintes, **Re-run all jobs** da última execução verde anterior do workflow `pages`, que reconstrói o commit anterior do lockfile e pede aprovação (caminho B) ou, sem execução anterior reexecutável e só com commit anterior à feature, reverter e reconstruir (caminho C, DM-0001); nada fica gravado em navegador, logo não há dado a desfazer | `npm test`: `CHK-TEST-0009-01` lê `tests/fixtures/track-v1.json` sem erro; `CHK-TEST-0009-03` prova a versão desconhecida intacta (NFR-0012); o `dist/` anterior é um artefato estático que o workflow reconstrói do commit anterior e volta a funcionar ao ser servido |

Não há revisão 2 desta feature. A rodada do seed rev 3 (treino de voltas seguidas) **não acrescenta revisão**: muda só a
forma em memória da sessão (DM-0002 1.2.0), que nasce e morre com a página — nenhuma versão em execução recebe um dado que
não entenda, e a reversão é a republicação do artefato anterior (`runbook.md`, R1: em staging, caminho B pela execução
41076989728, `652bbaa`). O esquema 3 do arquivo de pista pertence à release `pista-kart-park` e é declarado no
`REL-0002` dela. A forma anterior do produto não lia arquivo de pista (a pista era constante no código), por isso
nenhuma versão em execução recebe um arquivo que não entenda nesta entrega (DM-0001, *Janela de compatibilidade*).

## Preenchimento retroativo (backfill)

Nenhum: não existe arquivo de pista armazenado nem dado de jogador a converter (DM-0001, DM-0002). Não há, portanto,
lote, idempotência, progresso ou interrupção a declarar.

## Pistas publicadas para os próximos dias (D-DP-01)

Nenhuma pista é publicada fora do bundle: no build desta rodada os arquivos são o sintético (`trackVersion` 2) e a
Kart Park (`kart-park` versão 1, da release `pista-kart-park`), ambos empacotados no JS. A
regra que esta release deixa em vigor para quando existirem pistas servidas por CDN (pós-MVP, D-DS-03):

- um cliente que só conheça a versão 1 classifica um arquivo versão 2 como `UNSUPPORTED_SCHEMA`, mantém o arquivo
  intacto, exibe o erro e não inicia volta (I4), sem perda;
- uma `trackVersion` publicada nunca é editada no lugar (I3): trocar um marcador desta pista exige publicar
  `trackVersion` 3 e manter a 2 intacta.

## Dado persistido do jogador (I5)

A feature não usa `localStorage`, `sessionStorage` nem IndexedDB (DES-0011). Qualquer dado que outra parte do produto
tenha gravado no navegador **não é lido, convertido nem apagado** por esta release; um dado com versão desconhecida,
quando houver leitor, é mantido intacto e reportado (I4, I5). A persistência do resultado da volta pertence ao desafio
diário (etapa 5) e não entra aqui.

## Janela de compatibilidade

Uma única versão do cliente roda por vez: a página servida pelo CDN. A janela que existe é a do **cache do navegador**:
um jogador com o `index.html` anterior em cache continua carregando os *assets* anteriores (nomes com hash) até buscar o
`index.html` novo. Como nada é persistido nem trocado com servidor, as duas versões coexistem sem conflito; a regra de
cache que encurta essa janela está em `REL-0003`.
