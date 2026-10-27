---
title: Registro de divergências e de critérios não verificados em npm test
feature: dirigibilidade
stage: test
status: validated
version: 1.0.0
---

# 98 — Divergências

Nenhuma verificação derivada de um critério falha contra a implementação atual: a execução de 2026-10-27 (`npm test`, totais do
próprio runner, `reports/npm-test-latest.log` e `reports/junit-latest.xml`) coletou 237 verificações — as 172 existentes
(`physics`, `maneuvers`, `race-lap-validation-*`) e as 65 novas `CHK-TEST-00nn-nn` — e todas passaram. Não há divergência
código-versus-especificação aberta neste estágio; a linha D de `400 Code/Output/dirigibilidade/98-divergences.md` (prova em
`npm test` de todo registro de API-0003) é atendida pelas suítes `tests/dirigibilidade-*.test.ts`, exceto a metade humana abaixo.

## Critérios cuja metade de tela, aparelho ou navegador só é verificável pelo roteiro registrado

O projeto não tem ferramenta de E2E e a estratégia define os níveis web E2E e mobile E2E como roteiro registrado (`E2E-01` a
`E2E-03` em `test-strategy.md`), gravado por um humano em `docs/handling-device-log.md` (arquivo que este estágio não cria:
escreve só em `tests/` e em `500 Tests/Output/<feature>/`, conventions §14). Cada linha abaixo tem a sua regra provada em
`npm test` (coluna "Verificado por"); a parte que exige tela, sensor, aparelho ou relógio de parede fica **unverified** até o
registro humano. Não é um teste pulado: é um nível sem execução.

| Id | Estado | O que a especificação exige | Verificado por (`npm test`) | Parte não verificada e roteiro que a decide | Quem deve |
|---|---|---|---|---|---|
| AC-US-0004-06 | unverified | HUD exibe a velocidade em km/h e o estado de aderência em texto em todos os quadros entre o sinal verde e o fim da volta, em `web-desktop` e `web-mobile`; a pausa mantém o último valor | CHK-TEST-0006-01 (telemetria em todo passo da volta), CHK-TEST-0007-01 (elementos e rótulos) | observação por quadro na tela, inclusive na grama e após bater, e a pausa: E2E-01 em desktop e celular | registro humano em `docs/handling-device-log.md` |
| AC-US-0005-05 | unverified | nenhum tempo da versão anterior apresentado na tela ou no texto compartilhado como comparável; melhor tempo `—` ao trocar de acerto | CHK-TEST-0007-02, CHK-TEST-0007-03, CHK-TEST-0007-04, CHK-TEST-0008-03 | exibição do resultado com `setupVersion`, troca Arcade → Realista → Arcade e o compartilhar (área de transferência e Web Share): E2E-02 | registro humano |
| NFR-0002 | unverified | custo médio por passo no máximo 10 % acima da linha de base, na mesma máquina e runtime | CHK-TEST-0010-02 (regra de `STEP_COST` com valores constantes; linha de base real com `runtimeId`) | a medida de relógio de parede é só dos benches (I9): `npm run bench:handling` na máquina de referência, registrada em `docs/physics.md` (última: 220,4 µs contra 203,3 µs, 1,08 ×, `400 Code/Output/dirigibilidade/01-implementation.md`) | dono do bench, por rodada de acerto |
| NFR-0003 | unverified | paridade entre teclado e inclinação com o sensor real | CHK-TEST-0001-07, CHK-TEST-0002-08, CHK-TEST-0003-08, CHK-TEST-0005-07, CHK-TEST-0009-06 (mesmo `Input`, mesmas medidas nos dois modos) | inclinação proporcional no celular com o mesmo HUD e sem forçar a traseira com esterço parcial: E2E-03 | registro humano |
| NFR-0004 | unverified | prosa datada de `docs/physics.md` com ambiente, parâmetros, resultado e data por mudança de acerto | CHK-TEST-0010-03 (bloco legível por máquina: três entradas, parâmetros, registros de todos os ensaios com ambiente) | a prosa datada é lida na revisão da etapa de código (estratégia, NFR-0004) | revisão de código |

Nenhuma linha acima contribui para o veredito deste estágio (conventions §6); cada uma permanece aberta até a execução
registrada, que é uma decisão humana e não uma verificação pulada.
