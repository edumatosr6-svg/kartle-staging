---
title: Registro de implementação — apresentação e som
feature: apresentacao-e-som
stage: code
status: draft
version: 1.0.0
sources: []
---

# Registro de implementação

Rodada 1, Mode A (2026-11-10): o projeto validado de `300 Specs/330 D-Specs/Output/apresentacao-e-som/`
(`dspec-validation-20261110-1755`: `01-architecture.md` 1.1.0, DES-0001 1.1.0, DES-0002 1.0.0, DES-0003 1.1.0, DES-0004 1.1.0,
DES-0005 1.1.0, DM-0001 1.1.0, ADR-0001 1.1.0, ADR-0002 1.0.0, ADR-0003 1.1.0, `test-strategy.md` 1.1.0) foi implementado por
inteiro sobre a árvore do commit `5a0dfb3`. A rodada anterior do mesmo dia parou em FAIL SPEC
(`feedback-20261110-1745`, SPEC-ISSUE-01) sem escrever código; esta segue a rota revista: gravações embutidas no JS, nenhuma API
de rede no código. Nada foi commitado. O código fica na raiz do repositório (diretrizes do estágio); caminhos relativos a ela.

## Arquivos

| Arquivo | Mudança | Item |
|---|---|---|
| `src/assets/icon.png` | novo: PNG 192 × 192 RGB, 36.674 bytes | DES-0001, DM-0001 |
| `src/assets/cover.jpg` | novo: JPEG 1200 × 670, qualidade 80, 72.701 bytes | DES-0001, DM-0001 |
| `src/assets/engine-loop.mp3` | novo: cópia byte a byte de `docs/sfx/engine-loop.mp3`, 70.998 bytes | DES-0001, DM-0001 |
| `src/assets/tire-screech.mp3` | novo: cópia byte a byte de `docs/sfx/tire-screech.mp3`, 44.389 bytes | DES-0001, DM-0001 |
| `src/assets/feature-assets.json` | novo: registro de origem, `schemaVersion` 1 | DM-0001 |
| `index.html` | 6 elementos novos em `<head>` (`:9-14`) | DES-0001 |
| `src/soundOutput.ts` | novo, puro (79 linhas) | DES-0002 |
| `src/audio.ts` | alterado (93 → 214 linhas) | DES-0003 |
| `src/main.ts` | alterado (673 → 709 linhas) | DES-0003 |
| `src/rawImports.d.ts` | declaração `*.mp3?inline` | DES-0003 |
| `scripts/assetBudget.ts` | novo (191 linhas) | DES-0004 |
| `scripts/asset-budget.ts` | novo (20 linhas) | DES-0004 |
| `package.json` | script `check:assets` (`:14`); `dependencies` inalterado | DES-0004 |

Não escritos por esta etapa, porque o projeto os atribui à etapa de testes: `tests/apresentacao-e-som-*.test.ts`,
`tests/helpers/soundReport.ts`, a migração de CHK-TEST-0008-07 e `docs/apresentacao-e-som-device-log.md`. Não tocados: os módulos
da simulação e do dado de pista, `src/curbFeedback.ts`, `src/style.css`, o bloco de marca de pneu de `src/main.ts`, e toda linha de
`CURB_SOUND`, `REWARD_SOUND`, `CURB_ATTACK_S`, `whiteNoise`, `RaceAudio.reward()`, `RaceAudio.curb()` e `RaceAudio.soundOn()`.

As 4 origens (`docs/art/icon.png`, `docs/art/cover.png`, `docs/sfx/engine-loop.mp3`, `docs/sfx/tire-screech.mp3`) estão na árvore
sem versão; o commit desta entrega tem de incluí-las junto de `src/assets/` (DES-0001). As outras imagens de `docs/art/` não são
desta feature.

## Portão determinístico (2026-11-10)

| Passo | Resultado |
|---|---|
| `npx tsc --noEmit` | saída 0 |
| `npm run build` | saída 0: `dist/index.html` 7.052 bytes, `dist/assets/index-7Ar5m25g.js` 848.862, `dist/assets/index-q-biCwua.css` 10.850 (igual ao de antes), `dist/assets/icon-Qd4gmSDZ.png` 36.674, `dist/assets/cover-lU6Fa3FJ.jpg` 72.701; nenhum arquivo de áudio em `dist/` |
| `npm run check:assets` | saída 0: `ASSET_BUDGET` `PASS`, `initialDownloadBytes` 411.976, `featureAssetBytes` 224.762, `assetCount` 4, `assetsInInitialDownloadCount` 4, `coverWidthPx` 1200, `curbSoundFileCount` 0, `newRuntimeDependencyCount` 0 |
| `npm test` | 477 verificações, 476 aprovadas, 1 reprovada: CHK-TEST-0008-07 de `pista-kart-park` (`audio.toggle is not a function`), a exceção declarada em "Ordem de entrega" do projeto, que a etapa de testes migra pela tabela de `test-strategy.md`. CHK-TEST-0011-02 e CHK-TEST-0013-03 aprovadas sem mudança |
| `vite build --base=/kartle-staging/` (pasta temporária, fora do repositório) | os endereços de `icon`, `apple-touch-icon`, `og:image` e `preload` saem com a base; a medida sobre essa pasta dá `PASS` com os mesmos valores (`initialDownloadBytes` 411.986) |

`gzip -9` de cada arquivo de `dist/`: `index.html` 2.734, JS 297.561, CSS 3.064, ícone 36.720, capa 70.362; soma 410.441 bytes. A
medida do build usa o gzip de nível 9 do `node:zlib`, que dá 411.976 para o mesmo conjunto.

## Não verificado aqui

Nada foi aberto num navegador: o que se ouve (emenda da repetição, tom, intensidade, estalos), a aba, o atalho, a prévia do link,
o registro de rede e a taxa de quadros são dos roteiros E2E-01 a E2E-13 da etapa de testes. A decodificação real dos dois MP3 pelo
navegador não foi exercitada (`npm test` não tem decodificador). A leitura do valor corrente do ganho (`AudioParam.value`) no início
de cada rampa segue o projeto e depende do navegador; fica para E2E-06.
