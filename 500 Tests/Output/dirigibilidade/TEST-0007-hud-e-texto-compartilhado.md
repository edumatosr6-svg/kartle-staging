---
id: TEST-0007
title: HUD, tela de resultado e texto compartilhado sem versão do acerto, drift nem turbo
feature: dirigibilidade
stage: test
status: validated
version: 1.1.0
sources: [AC-US-0004-06, AC-US-0005-05, AC-US-0005-07, AC-US-0003-09, AC-US-0003-11]
---

# TEST-0007 — HUD, tela de resultado e texto compartilhado sem versão do acerto, drift nem turbo

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-hud-text.test.ts` (estratégia: `hud-text`) |
| Nível | unitário, sem DOM: `formatSharedText` e `shareLabel` sobre registros sintéticos; contrato por texto: `src/main.ts`, `index.html` e `src/style.css` lidos como texto |
| Interface exercitada | `formatSharedText`, `shareLabel` (`src/handlingMessages.ts`); `formatLapTime`, `message` (`src/lapMessages.ts`) |
| Fixtures | `record(patch)`: `LapRecord` sintético da pista `synthetic` v2, válido (83 456 ms) e inválido (`CUT`), com `setupVersion` `arcade-assistido-v4`, `-v5`, `-v6` e `fixture-setup-9.9.9`; pt e en |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0007-01 | AC-US-0004-06 | the HUD has a speed element in km/h and a handling element with a non-empty text for each of the four states | `#speed` ou `#handling` removidos de `index.html`, rótulo vazio ou repetido para um dos quatro estados, HUD que não converte `speedMps` em km/h, HUD que não lê por API-0001 |
| CHK-TEST-0007-02 | AC-US-0005-07 | the shared text carries exactly the game, the track, its version and one time or the invalid state: never the setup version, a second time nor a difference | texto diferente de `Kartle · <trackId> v<trackVersion> · <tempo ou estado inválido>`, versão do acerto no texto (mutação M5 reprova), segundo tempo ou diferença, volta inválida com tempo, dois registros de versões diferentes gerando textos que se citam, em pt ou en |
| CHK-TEST-0007-03 | AC-US-0005-05 | the result screen carries the share control with a label in each language and no setup-version element | rótulo vazio ou igual nas duas línguas, controle `#lap-share` removido, elemento `#lap-result-setup` de volta na tela de resultado (mutação M6 reprova) ou escrito por `src/main.ts` |
| CHK-TEST-0007-04 | AC-US-0005-05 | the application shows a best time only when the records are COMPARABLE and clears it when the setup changes | melhor tempo exibido sem `COMPARABLE`, troca de acerto que mantém `bestRecord`, substituição do melhor sem comparar, diferença entre tempos calculada em `src/main.ts` |
| CHK-TEST-0007-05 | AC-US-0003-11 | the shared text of any result, valid or invalid, in either language, carries no drift, turbo, boost, charge, combo, style or score content | palavra de drift, turbo, impulso, carga, combo, estilo ou pontos no texto de qualquer registro, válido ou inválido, em pt ou en (mutação M5, "drift 300": reprova), texto com mais de três partes |
| CHK-TEST-0007-06 | AC-US-0003-09 | the HUD and the result screen carry no drift meter, turbo label, style score, combo or boost element, and the application never draws one | `style-score`, `combo`, `drift-hud`, `drift-meter`, `drift-label`, `drift-help` ou `lap-result-setup` em `index.html` (mutação M6 reprova) ou endereçados por `src/main.ts`, `chargeTier`, import de `./maneuvers`, leitura de pontos, combo, cadeia, carga ou prêmio, literal de turbo, carga de drift, combo ou pontos de estilo em `src/main.ts`, regra `.drift-hud`/`.drift-meter`/`.style-score`/`.boosting` em `src/style.css`, conteúdo de drift na tela de resultado |
