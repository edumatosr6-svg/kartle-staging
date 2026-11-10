---
title: Divergências — apresentação e som
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.0.0
sources: []
---

# Divergências

Registro durável dos requisitos deste conjunto que o sistema em execução não satisfaz (conventions §6). O
F-Spec é normativo: nenhuma linha abaixo enfraquece um requisito. Base: a árvore do commit `5a0dfb3`. Cada
linha cita o que existe nessa árvore em `arquivo:linha`, a etapa que deve a mudança e o item de projeto que a
fecha. Caminhos relativos à raiz do repositório.

| Requisito | O que exige | O que o sistema faz hoje | Etapa devedora | Item de projeto | Estado |
|---|---|---|---|---|---|
| REQ-FEAT-0001-01, -02, -03, -04 | o documento declara o ícone de página e o do atalho, vindos de `docs/art/icon.png`, sem texto | `index.html:4-8` tem só `charset`, `viewport`, `theme-color`, `description` e `title`: nenhum `link` de ícone; não existe `src/assets/` | código | DES-0001, DM-0001 | open |
| REQ-FEAT-0002-01, -02, -03, -04, -05, -06 | o documento declara a capa (1200 px ou mais), o título "Kartle" e a descrição de uma frase como prévia de link | `index.html:7-8` tem `meta name="description"` com duas frases e `title` "Kartle — Entre na pista"; nenhuma declaração `og:`; nenhuma forma entregue da capa | código | DES-0001, DM-0001 | open |
| REQ-FEAT-0003-10, -11 | o motor é a gravação `engine-loop.mp3`; nenhum tom sintetizado de motor | `src/audio.ts:5` declara o motor `triangle`; `:32-36` criam e iniciam um oscilador; `:51` leva a frequência por velocidade e acelerador | código | DES-0003, ADR-0002 | open |
| REQ-FEAT-0003-04, -05 | `engineGainNorm` igual a 0 em até 200 ms depois de pausa e de resultado | `src/audio.ts:52` usa `setTargetAtTime(0, time, 0.04)`: o ganho se aproxima de 0 e não chega; não existe campo `engineGainNorm` | código | DES-0002, DES-0003 | open |
| REQ-FEAT-0003-06 | motor ao silêncio em até 200 ms depois de um `repositionKart` aceito | `src/main.ts:197-200` aceita o reposicionamento sem avisar o som; `src/lap.ts:188-201` mantém `lapPhase` em `RUNNING`, e `src/main.ts:584` segue pedindo o motor | código | DES-0002, DES-0003, ADR-0003 | open |
| REQ-FEAT-0003-07 | nenhum som de motor a partir da ação que desliga o som | `src/audio.ts:41` desliga com `setTargetAtTime(0, currentTime, 0.03)`: o som decai, não cessa na ação | código | DES-0003 | open |
| REQ-FEAT-0003-02, -03 | `enginePitchRatio` e `engineGainNorm` com as duas desigualdades | `src/audio.ts:51-52` variam uma frequência em Hz e um ganho entre 0,025 e 0,045; não existem os campos de API-0002 nem `getSoundOutput` | código | DES-0002, DES-0003 | open |
| REQ-FEAT-0003-09 (API-0002, `setSoundOn`) | o pedido carrega o estado final e é idempotente | `src/audio.ts:29-43` é `toggle()`: alterna, e uma segunda chamada desfaz a primeira; `src/main.ts:349` o chama | código | DES-0003 | open |
| REQ-FEAT-0003-12 | sem áudio, `setSoundOn` muda `soundOn` como pedido, nenhum som toca e nenhum aviso é acrescentado | `src/main.ts:348-352`: se `toggle()` lança, o controle continua "Som desligado" e a tela mostra "Áudio indisponível neste navegador." | código | DES-0003 | open |
| REQ-FEAT-0004-01, -02, -03, -04, -05, -06, -07 | som de pneu da gravação `tire-screech.mp3` enquanto o kart marca o asfalto, silêncio em até 200 ms | `src/audio.ts` não tem som de pneu; `src/main.ts:586-615` só desenha a marca, e desenha em qualquer superfície | código | DES-0002, DES-0003, ADR-0003 | open |
| REQ-FEAT-0005-02, -04 | os 4 arquivos entregues, no máximo 300.000 bytes, todos no download inicial | nenhum dos 4 é entregue: `dist/` tem só `index.html`, um JS e um CSS; as origens em `docs/art/` e `docs/sfx/` não estão versionadas | código | DES-0001, DM-0001, ADR-0001 | open |
| REQ-FEAT-0005-01, -02, -04, -10, -12 (`ASSET_BUDGET`) | registro da medida do build | `package.json:6-14` não tem script de medida; `scripts/` não tem medida de `dist/` | código | DES-0004 | open |
| REQ-FEAT-0005-06, -07, -14, -15 (registros de `npm test`) | `SOUND_DETERMINISM`, `ASSETS_NEUTRAL`, `SIM_STATE_UNCHANGED` | `tests/` não tem `apresentacao-e-som-*.test.ts` | testes | DES-0004 | open |
| REQ-FEAT-0005-11 | os ensaios da zebra de `pista-kart-park` passam com a feature entregue | `tests/pista-kart-park-feedback.test.ts:165-169` e `:182` afirmam `toggle()` e um motor oscilador: falham com o motor gravado até serem migrados | testes | DES-0003, test-strategy.md | open |
| REQ-FEAT-0005-03, -05, -08, -09, -13 | registros em aparelho: rede, sem rede, 60 fps, 30 fps, inspeção visual | não existe `docs/apresentacao-e-som-device-log.md` | testes | DES-0004, DES-0005 | open |
| REQ-FEAT-0005-16 | nenhuma promoção para produção antes da confirmação da licença | a confirmação ainda não foi registrada (`LICENSE_PENDING`, estado inicial de RULE-0003); produção segue bloqueada | deploy | DES-0005 | open |

Requisitos que a árvore de hoje já satisfaz, sem linha acima: REQ-FEAT-0003-08 (`src/audio.ts:28` nasce
desligado; `index.html:34` mostra "Som desligado") e REQ-FEAT-0002-07 (nenhuma tela mostra a capa: ela ainda
não existe); REQ-FEAT-0005-10 (`package.json:16` tem só `three`); REQ-FEAT-0005-12 (nenhum arquivo de som é
entregue). O projeto os mantém; os testes passam a prová-los.
