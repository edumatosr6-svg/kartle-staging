---
id: US-0003
title: Traseira viva mas controlável
feature: dirigibilidade
stage: req
status: validated
version: 4.3.0
sources: [SEED/US-3, SEED/RD-01, SEED/RD-05, SEED/RD-06, SEED/RE-01, SEED/NF-03, SEED/IM-I9, DOMAIN/REF-01, DOMAIN/DEC-04, DOMAIN/DEC-15, DOMAIN/DEC-16, DOMAIN/DEC-17]
---

# US-0003 — Traseira viva mas controlável

## História

Como Jogador, quero uma traseira viva mas controlável, para escorregar e segurar.

## Canais

- `web-desktop` e `web-mobile`: mesma condição de forçar (acelerador cheio + esterço cheio acima de
  50 km/h), mesmo limite de recuperação (400 ms), mesmo teto de derrapagem lateral (0,65 rad) e mesma
  ausência de drift e de turbo, medidos no estado da simulação. Nenhuma diferença de limite entre os
  canais.
- `web-desktop`: acelerador e esterço são binários; a condição de forçar é atingida pelas duas teclas
  mantidas acima de 50 km/h. O comando de drift é a tecla de drift; segurá-la não muda nada (critério 08) e
  nenhuma tela a ensina (critérios 12 a 14).
- `web-mobile`: a condição de forçar exige inclinação no ângulo mapeado para esterço 1 (ou −1) e toque de
  acelerador cheio; com esterço parcial a condição de forçar não se mantém. O controle de toque não exibe o
  botão "Drift" nem outro controle de drift (critério 15); o comando de drift no `Input`, mantido ou não,
  vale o mesmo que em `web-desktop` (critério 08).
- `web-mobile` com sensor ausente ou permissão negada: controle por toque, entradas binárias, mesmos
  critérios (I4).
- Os critérios 01 e 05 são observados na volta do piloto de teste na pista sintética; os critérios 03 e 04,
  na pista de teste aberta (`SEED/US-3`, `SEED/RD-06`); os critérios 08 e 10 valem em qualquer ambiente; o
  critério 09 é observado na tela durante a volta e na tela de resultado; o critério 11, no texto
  compartilhado; os critérios 12, 13 e 14, na tela inicial, na dica da barra de ferramentas e no guia de
  manobras; o critério 15, no controle de toque exibido durante a volta.
- Exibição (`SEED/RE-01`): os critérios 09, 11, 12, 13 e 14 valem igual em `web-desktop` e em `web-mobile`. O
  critério 15 é só de `web-mobile`, porque o botão "Drift" que a restrição do seed nomeia é do controle de
  toque no celular; `web-desktop` pilota com teclado (seed, Atores e canais) e não tem controle de toque a
  observar.

## Pré-condições

- Critérios 01 a 11: acerto Arcade assistido selecionado, na sua nova versão (acerto C, `DOMAIN/DEC-15`).
- Critérios 01 e 05: piloto de teste na volta da pista sintética (`npm run bench:handling`).
- Critérios 03 e 04: pista de teste aberta — asfalto sem faixa e sem paredes —; o kart está no asfalto, em
  estado `grip`, acima de 50 km/h.
- Critérios 08 a 11: qualquer volta ou ensaio com o acerto Arcade assistido.
- Critérios 12 a 14: o jogo aberto em `web-desktop` ou em `web-mobile`, com a tela inicial exibida (critério
  12), a dica da barra de ferramentas exibida (critério 13) e o guia de manobras aberto (critério 14). A
  restrição do seed não condiciona a retirada da exibição a um acerto (`SEED/RE-01`).
- Critério 15: `web-mobile`, durante a volta, com o controle de toque exibido, tanto com o sensor de
  inclinação ativo quanto no recuo para toque com sensor ausente ou permissão negada (I4).

## Critérios de aceite

- AC-US-0003-01: No estado da simulação, em todos os passos da volta do piloto de teste na pista sintética
  (condução normal), a telemetria não reporta `oversteer` nem `sliding` (`SEED/US-3`, primeiro critério).
- AC-US-0003-05: No estado da simulação, em todos os passos da volta do piloto de teste na pista sintética
  (condução normal), a derrapagem lateral não passa de 0,65 rad (`SEED/US-3`, primeiro critério).
- AC-US-0003-03: No estado da simulação, na pista de teste aberta, depois de forçar a traseira (acelerador
  cheio e esterço cheio acima de 50 km/h) até a telemetria reportar `oversteer` ou `sliding`, com o esterço
  levado de 1 a 0 (ou de −1 a 0) num passo, a telemetria volta a `grip` em no máximo 400 ms de tempo
  simulado contados desse passo (`SEED/US-3`, segundo critério; `DOMAIN/DEC-04`).
- AC-US-0003-04: No ensaio do critério 03, a derrapagem lateral não passa de 0,65 rad em nenhum passo da
  recuperação: o kart não roda ao recuperar (`SEED/US-3`, segundo critério).
- AC-US-0003-08: No estado da simulação, a mesma sequência de `Input` por passo, aplicada ao mesmo estado
  inicial, com o comando de drift mantido do primeiro ao último passo e sem ele, produz o mesmo estado da
  simulação em todos os passos — posição, velocidade, rumo, estado de aderência e derrapagem lateral:
  segurar a tecla de drift não muda nada, e não há carga, mini-turbo nem impulso (`SEED/US-3`, terceiro
  critério; `SEED/RD-01`).
- AC-US-0003-09: Na tela, em `web-desktop` e em `web-mobile`, durante a volta (HUD) e na tela de resultado,
  não aparece indicador de carga de drift, de turbo ou de impulso, nem combo nem pontuação de drift (`SEED/US-3`, terceiro critério;
  `SEED/RE-01`; `DOMAIN/DEC-15`, `DOMAIN/DEC-16`).
- AC-US-0003-11: No texto compartilhado do resultado, gerado em `web-desktop` ou em `web-mobile`, não
  aparece indicador de carga de drift, de turbo ou de impulso, nem combo nem pontuação de drift (`SEED/US-3`, terceiro critério;
  `SEED/RE-01`; `DOMAIN/DEC-15`, `DOMAIN/DEC-16`).
- AC-US-0003-12: Na tela inicial, em `web-desktop` e em `web-mobile`, nenhum texto, ícone ou controle
  menciona ou oferece o drift ou o turbo: nem o comando de drift (a tecla de drift ou um controle de drift),
  nem carga de drift, turbo, mini-turbo ou impulso, nem combo ou pontuação de drift (`SEED/RE-01`;
  `SEED/US-3`, terceiro critério; `DOMAIN/DEC-17`).
- AC-US-0003-13: Na dica da barra de ferramentas, em `web-desktop` e em `web-mobile`, nenhum texto, ícone ou
  controle menciona ou oferece o drift ou o turbo: nem o comando de drift (a tecla de drift ou um controle de
  drift), nem carga de drift, turbo, mini-turbo ou impulso, nem combo ou pontuação de drift (`SEED/RE-01`;
  `SEED/US-3`, terceiro critério; `DOMAIN/DEC-17`).
- AC-US-0003-14: No guia de manobras, em `web-desktop` e em `web-mobile`, nenhum texto, ícone ou controle
  menciona ou oferece o drift ou o turbo: nem o comando de drift (a tecla de drift ou um controle de drift),
  nem carga de drift, turbo, mini-turbo ou impulso, nem combo ou pontuação de drift (`SEED/RE-01`;
  `SEED/US-3`, terceiro critério; `DOMAIN/DEC-17`).
- AC-US-0003-15: Na tela, em `web-mobile`, durante a volta, o controle de toque não exibe o botão "Drift" nem
  outro controle que acione o comando de drift ou um turbo (`SEED/RE-01`; `SEED/US-3`, terceiro critério;
  `DOMAIN/DEC-17`). Em `web-desktop` o critério não se aplica: não há controle de toque.
- AC-US-0003-10: No estado da simulação, em todo ensaio desta feature que parte de velocidade igual ou
  menor que a velocidade estabilizada e na volta do piloto de teste, inclusive com o comando de drift
  mantido (critério 08), a velocidade do kart nunca passa da velocidade estabilizada que o ensaio do
  critério 02 de US-0004 mede para o mesmo acerto: a velocidade máxima é a mesma em qualquer situação
  (`SEED/US-3`, terceiro critério).
- AC-US-0003-07: A saída de `npm test` ou de `npm run bench:handling` contém, para o acerto Arcade
  assistido, o tempo de recuperação em ms e a derrapagem lateral máxima em rad na recuperação (critérios 03
  e 04); a contagem de passos com `oversteer` ou `sliding` e a derrapagem lateral máxima em rad na volta do
  piloto de teste (critérios 01 e 05); o resultado da comparação com e sem o comando de drift (critério
  08); e a maior velocidade observada em km/h ao lado da velocidade estabilizada (critério 10)
  (`SEED/IM-I9`).

Numeração: os critérios 02 (estados de traseira solta só sob a condição de forçar, em qualquer asfalto) e
06 (o drift continua pontuando) foram retirados na revisão 4 do seed (`DOMAIN/DEC-15`) e os seus números não
são reutilizados; a tabela de migração está em `97-changelog.md`.

## Casos anormais

- **Traseira não solta sob a condição de forçar** (a telemetria não sai de `grip` ou de `understeer`
  enquanto o kart é forçado na pista de teste aberta): o critério 03 não tem passo de partida; o ensaio
  reporta que a traseira não soltou e por quanto tempo foi forçada. O seed não exige que a traseira solte,
  e nenhum critério de "traseira solta obrigatória" é inventado.
- **Esterço reduzido parcialmente em vez de zerado (`web-mobile`)**: o seed não fixa limite para redução
  parcial; o critério 03 é medido com esterço levado a 0. Nenhum limite é inventado para valores
  intermediários.
- **Acelerador mantido cheio durante a recuperação**: o critério 03 é medido com o acelerador mantido
  cheio, porque é o estado que soltou a traseira; soltar o acelerador junto com o esterço não pode
  resultar em tempo de recuperação maior que 400 ms.
- **Recuperação que não volta a `grip` em 400 ms**: o critério 03 falha; o ensaio reporta o tempo até o
  primeiro `grip`.
- **Condição de forçar mantida sem soltar o esterço**: a traseira permanece solta; a derrapagem lateral
  pode exceder 0,65 rad, porque não é recuperação nem condução normal; o Jogador continua controlando o
  kart com o esterço (nenhum estado de "rodada" sem comando é exigido nem proibido pelo seed).
- **Piloto de teste força o kart na volta sintética** (acelerador e esterço cheios acima de 50 km/h numa
  curva): continua sendo condução normal no sentido do seed; os critérios 01 e 05 valem em todos os passos
  da volta, sem exceção.
- **Comando de drift mantido durante a recuperação ou durante a condição de forçar**: não muda nada
  (critério 08); os critérios 03 e 04 valem igual.
- **Replay gravado com drift na versão anterior do acerto**: é de outra versão de acerto e não é comparável
  (US-0005); reproduzido com o novo acerto, o comando de drift gravado não tem efeito (critério 08).
- **Grama ou parede com a traseira solta** (pista sintética): a redução de velocidade de US-0004 se
  aplica; o critério 03 é medido na pista de teste aberta, que não tem grama nem parede.
- **Pausa, perda de foco ou perda do sensor durante a recuperação**: simulação suspensa; os 400 ms são de
  tempo simulado.
- **Tela inicial, dica ou guia cujo conteúdo era só o drift ou o turbo**: retirado esse conteúdo, o seed não
  pede texto novo no lugar (nenhum texto novo de tela, `01-context.md`); os critérios 12 a 14 só exigem que
  nada ali mencione ou ofereça o drift ou o turbo, e o seed não exige nem proíbe que a dica ou o guia continue
  existindo.
- **Idioma da interface**: os critérios 09 e 11 a 15 valem em cada idioma que a interface oferece (RNF11).
- **Tecla de drift pressionada em `web-desktop`**: nada muda na simulação (critério 08); nenhuma tela ensina
  a tecla (critérios 12 a 14) nem mostra indicador de drift ou de turbo (critério 09).
- **Sensor ausente ou permissão negada antes da volta (`web-mobile`)**: controle por toque com estado
  visível (I4); critérios inalterados, e o controle de toque do recuo também não exibe o botão "Drift"
  (critério 15).

## Fontes

- `SEED/US-3` — história e seus três critérios: condução normal observada na volta do piloto de teste na
  pista sintética, sem `oversteer` nem `sliding` e com derrapagem lateral de no máximo 0,65 rad; na pista
  de teste aberta, volta a `grip` em no máximo 400 ms depois de reduzir o esterço, sem rodar; não existe
  drift nem turbo, segurar a tecla de drift não muda nada, não há carga, impulso, combo nem pontuação de
  drift, e a velocidade máxima é a mesma em qualquer situação.
- `SEED/RD-01` — direção comum fácil; não há drift nem turbo.
- `SEED/RD-05`, `DOMAIN/REF-01` — traseira viva mas controlável.
- `SEED/RD-06` — os ensaios de pista de teste não rodam na pista sintética; a volta do piloto de teste roda
  nela.
- `SEED/NF-03` — teclado e inclinação atendem ambos.
- `SEED/IM-I9` — ensaio determinístico.
- `DOMAIN/DEC-04` — 400 ms (mantido por `DOMAIN/DEC-15`).
- `DOMAIN/DEC-15` — acerto C e fim do drift e do turbo de `requirements/11` (carga segurando a tecla,
  mini-turbo, combo e pontuação), 2026-10-29.
- `SEED/RE-01`, `DOMAIN/DEC-16`, `DOMAIN/DEC-17` — retirar o drift e o turbo também tira da tela tudo o que
  mostrava, ensinava ou oferecia os dois: HUD, resultado e texto compartilhado (revisão 5 do seed,
  `DOMAIN/DEC-16`), tela inicial, dica da barra de ferramentas, guia de manobras e o botão "Drift" do controle
  de toque no celular (revisão 6 do seed, `DOMAIN/DEC-17`, 2026-10-30); isso é só remoção de exibição, sem
  regra nova na renderização.

## Pontos em aberto

Nenhum — `DOMAIN/DEC-04` fecha o ponto aberto 04 do seed, mantido por `DOMAIN/DEC-15`.
