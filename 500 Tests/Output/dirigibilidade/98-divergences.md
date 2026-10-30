---
title: Registro de divergências e de critérios não verificados em npm test
feature: dirigibilidade
stage: test
status: validated
version: 2.1.0
---

# 98 — Divergências

Nenhuma verificação desta feature falha contra a implementação atual. A execução de 2026-10-30 (`npx tsx --test tests/*.test.ts`,
totais do próprio runner em `reports/npm-test-latest.log` e `reports/junit-latest.xml`) coletou 436 verificações: 427 aprovadas e 9
reprovadas, as 9 de `pista-kart-park` (tabela abaixo). As 65 `CHK-TEST-00nn-nn` desta feature e as suítes `physics`, `maneuvers`,
`race-lap-validation-*` e `modelo-kart-01-*` passam. A linha 14 de `400 Code/Output/dirigibilidade/98-divergences.md` (provas em
`npm test` de test-strategy 6.1.0, inclusive AC-US-0003-12 a -15 em `tests/dirigibilidade-hud-text.test.ts`, e CHK-TEST-0008-03) é
atendida pelas suítes `tests/dirigibilidade-*.test.ts`, exceto a metade humana abaixo.

## Verificações reprovadas na mesma execução, de outra feature

| Verificação | Arquivo | Motivo | Quem deve |
|---|---|---|---|
| CHK-TEST-0005-01, -02, -03, -04, -06, -08, -10 de `pista-kart-park` | `tests/pista-kart-park-lap.test.ts` | suítes de `pista-kart-park`, que esta feature não lê; a validação de código desta feature (`code-validation-20261030-1613`, evidência) lista estas mesmas reprovações como devidas àquela feature (FB-02 da linha 14) | estágio de testes de `pista-kart-park`; fora da cerca de escrita desta feature (conventions §14), não tocadas |
| CHK-TEST-0006-03 de `pista-kart-park` | `tests/pista-kart-park-determinism.test.ts` | idem | idem |
| CHK-TEST-0007-05 de `pista-kart-park` | `tests/pista-kart-park-session.test.ts` | idem | idem |

## Critérios cuja metade de tela, aparelho ou navegador só é verificável pelo roteiro registrado

O projeto não tem ferramenta de E2E e a estratégia define os níveis web E2E e mobile E2E como roteiro registrado (`E2E-01` a
`E2E-04` em `test-strategy.md`), gravado por um humano em `docs/handling-device-log.md` (arquivo que este estágio não cria:
escreve só em `tests/` e em `500 Tests/Output/<feature>/`, conventions §14). Cada linha abaixo tem a sua regra provada em
`npm test` (coluna "Verificado por"); a parte que exige tela, sensor, aparelho ou relógio de parede fica **unverified** até o
registro humano. Não é um teste pulado: é um nível sem execução.

| Id | Estado | O que a especificação exige | Verificado por (`npm test`) | Parte não verificada e roteiro que a decide | Quem deve |
|---|---|---|---|---|---|
| AC-US-0003-09 | unverified | nenhum indicador de carga de drift, turbo ou impulso, combo ou pontuação no HUD e na tela de resultado, em `web-desktop` e `web-mobile` | CHK-TEST-0007-06 (elementos, identificadores, textos e estilos ausentes de `index.html`, `src/main.ts` e `src/style.css`), CHK-TEST-0003-09 e CHK-TEST-0010-08 (o comando não alcança o estado) | observação por quadro com Espaço e o botão de drift segurados em curvas e retas: E2E-01 em desktop e celular | registro humano em `docs/handling-device-log.md` |
| AC-US-0003-12 | unverified | nenhum texto, ícone ou controle da tela inicial menciona ou oferece o drift ou o turbo, em `web-desktop` e `web-mobile` | CHK-TEST-0007-07 (texto servido e nomes acessíveis de `#welcome` e de todo `index.html`, texto gerado por `src/style.css`, mensagens pt e en de `src/lapMessages.ts`; a tela continua com a escolha de pista e a oferta de volta) | a tela inicial renderizada nos dois canais e nos dois idiomas, antes e depois de uma volta: E2E-04 | registro humano em `docs/handling-device-log.md` |
| AC-US-0003-13 | unverified | a dica da barra de ferramentas não menciona nem oferece o drift ou o turbo | CHK-TEST-0007-08 (dica `Dirigir`, só teclas de direção, texto servido da barra sem drift ou turbo) | a barra renderizada no desktop e a área abaixo dela: E2E-04 | registro humano |
| AC-US-0003-14 | unverified | não há guia de manobras que ensine o drift ou o turbo | CHK-TEST-0007-09 (`index.html`, `src/style.css`, literais de `src/main.ts` e mensagens) | a página renderizada nos dois canais e nos dois idiomas: E2E-04 | registro humano |
| AC-US-0003-15 | unverified | no celular, durante a volta, o controle de toque não exibe o botão "Drift" nem outro controle de drift ou turbo | CHK-TEST-0007-10 (exatamente `left`, `right`, `brake`, `throttle` num único `.touch-controls`, sem rótulo de drift, sem estilo nem leitura de um controle de drift) | o controle de toque na contagem e na volta, com a inclinação ativa e com o recuo para toque: E2E-04 no celular | registro humano |
| AC-US-0003-11 | unverified | nenhum conteúdo de drift, turbo, combo ou pontuação no texto compartilhado | CHK-TEST-0007-05 (`formatSharedText` sobre registros válidos e inválidos de quatro versões, pt e en) | o compartilhar real (área de transferência no desktop, Web Share no celular): E2E-02 | registro humano |
| AC-US-0004-06 | unverified | HUD exibe a velocidade em km/h e o estado de aderência em texto em todos os quadros entre o sinal verde e o fim da volta; a pausa mantém o último valor | CHK-TEST-0006-01 (telemetria em todo passo da volta até o primeiro resultado), CHK-TEST-0007-01 (elementos e rótulos) | observação por quadro na tela, inclusive na grama e após bater, e a pausa: E2E-01 | registro humano |
| AC-US-0005-05 | unverified | nenhum tempo da versão anterior apresentado na tela como comparável; melhor tempo `—` ao trocar de acerto; resultado sem a versão do acerto | CHK-TEST-0007-03, CHK-TEST-0007-04, CHK-TEST-0008-03 | exibição do resultado e a troca Arcade → Realista → Arcade: E2E-02 | registro humano |
| AC-US-0005-07 | unverified | nenhum tempo da versão anterior apresentado como comparável no texto compartilhado | CHK-TEST-0007-02 (texto exato, um tempo, sem versão nem diferença, para registros de versões diferentes) | o compartilhar real: E2E-02 | registro humano |
| NFR-0002 | unverified | custo médio por passo no máximo 10 % acima da linha de base, na mesma máquina e runtime | CHK-TEST-0010-02 (regra de `STEP_COST` com valores constantes; linhas de base de fixture e real com `runtimeId`) | a medida de relógio de parede é só dos benches (I9): `npm run bench:handling` na máquina de referência (última: 181,3 µs contra 173,9 µs, 1,04 ×, `400 Code/Output/dirigibilidade/01-implementation.md`) | dono do bench, por rodada de acerto |
| NFR-0003 | unverified | paridade entre teclado e inclinação com o sensor real | CHK-TEST-0001-07, CHK-TEST-0002-08, CHK-TEST-0003-08, CHK-TEST-0005-07, CHK-TEST-0009-06 (mesmo `Input`, mesmas medidas nos dois modos) | inclinação proporcional no celular com o mesmo HUD e sem forçar a traseira com esterço parcial: E2E-03 | registro humano |
| NFR-0004 | unverified | prosa datada de `docs/physics.md` com ambiente, parâmetros, resultado e data por mudança de acerto | CHK-TEST-0010-03 (bloco legível por máquina: entradas v4, v6 e Realista, parâmetros da pista aberta, registros de todos os ensaios de API-0003 4.0.1, nenhum retirado) | a prosa datada é lida na revisão da etapa de código (estratégia, NFR-0004) | revisão de código |

Nenhuma linha acima contribui para o veredito deste estágio (conventions §6); cada uma permanece aberta até a execução
registrada, que é uma decisão humana e não uma verificação pulada.
