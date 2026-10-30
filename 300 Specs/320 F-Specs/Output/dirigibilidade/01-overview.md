---
title: Visão geral — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: fspec
status: validated
version: 4.0.1
sources: []
---

# Visão geral

## O que é especificado

Esta especificação funcional diz o que a simulação do Kartle faz, com o acerto padrão **Arcade assistido**
na sua nova versão — o **acerto C**, que o dono do produto escolheu na staging (`DOMAIN/DEC-15`) —, para
que o kart responda ao volante de imediato, faça a curva pedida sem sair de frente, tenha a traseira viva
mas controlável, acelere e transmita velocidade e risco, sem drift nem turbo — e para que o jogo continue
justo: mesma sequência de `Input`, mesmo tempo; passo, solver e `Input` inalterados; acerto declarado como
nova versão, com tempos e replays antigos legíveis mas nunca comparáveis. A base é o conjunto de requisitos
validado em `200 Requirements/230 Output/dirigibilidade/` (US-0001 a US-0005, NFR-0001 a NFR-0009,
versão 4.3.0, seed `revision: 5`), que já carrega as decisões do dono do produto (`DOMAIN/DEC-01`,
`DEC-04`, `DEC-05`, `DEC-07` a `DEC-10`, `DEC-15`, `DEC-16`; `DOMAIN/REF-01` a `REF-03`, rótulos definidos
em `01-context.md` daquele conjunto).

Os limites em vigor são: resposta do volante em 180 ms / 250 ms; raio da trajetória de no máximo 13 m 3 s
depois da partida, com acelerador e esterço cheios, partindo de 50 km/h e de 70 km/h; giro de pelo menos
180° em até 2 s sem acelerador, partindo de 50 km/h; recuperação da traseira em 400 ms, com derrapagem
lateral de no máximo 0,65 rad; 0–60 km/h em 2,5 s; velocidade estabilizada entre 65 km/h e 72 km/h; volta
do piloto de teste em 25 s sem sair do asfalto ([RULE-0002](rules/RULE-0002-ensaios-e-limiares.md)). A
revisão 4 do seed (`DOMAIN/DEC-15`) retirou os ensaios do arco de raio 18 m, a varredura de início do
subesterço, o piso de 105 km/h e a manobra de drift e o turbo de `requirements/11`; a revisão 5
(`DOMAIN/DEC-16`) trocou o raio sem acelerador pelo giro em até 2 s e disse que retirar o drift e o turbo
da tela é só remoção de exibição. Os valores medidos do acerto C que a decisão registra (69,3 km/h; 2,21 s;
≈ 11,7 m; 208°; 23,05 s) são informação, não limites.

**Onde cada ensaio roda (`SEED/RD-06`, `DOMAIN/REF-03`, `DOMAIN/DEC-15`).** Os ensaios de resposta do
volante, de curva (raio e giro) e de recuperação da traseira rodam na **pista de teste aberta** — ambiente
de ensaio próprio, asfalto sem faixa e sem paredes —, não na pista sintética: na resposta do volante o kart
parte em reta com a velocidade **mantida em 50 km/h pelo acelerador**; na curva, parte em linha reta com o
esterço cheio aplicado e mantido desde o passo da partida. Cada ensaio declara a área de asfalto que contém
a sua trajetória; sair dela invalida a medição (`TEST_AREA_EXCEEDED`). Só a volta do piloto de teste usa a
pista sintética — para o tempo de volta e para a condução normal —, além dos ensaios de grama e parede,
que precisam delas. A pista de teste não é dado de pista publicado e não altera a pista sintética nem a
validação de volta (NFR-0008). O ambiente de cada ensaio é campo reportado da saída
([API-0003](api/API-0003-saida-dos-ensaios.md), `benchEnvironment`) e registrado em `docs/physics.md`.

O produto não tem servidor, conta nem sessão no MVP (RNF08, RNF10). Os contratos de `api/` são contratos
em processo dentro do navegador e nos ensaios, únicos para os dois canais, e não endpoints de rede; o único
papel é `player` (anônimo). Nomes de campo em `camelCase` plano com a unidade no sufixo (D-FS-06).

## Por canal

| Canal | O que esta especificação fixa |
|---|---|
| `web-desktop` | Esterço e acelerador binários pelo teclado (0, 1 ou −1); todos os limites de resposta, curva, recuperação, aceleração e velocidade valem sem diferença; a tecla de drift não tem efeito; HUD de velocidade e aderência em todos os quadros da volta, sem indicador de drift ou turbo |
| `web-mobile` | Esterço proporcional pela inclinação e acelerador por toque; os mesmos limites para a inclinação mantida no ângulo mapeado para esterço 1 (ou −1); limites próprios de resposta para esterço parcial (90 % em 180 ms; 10 % em 250 ms); sem sensor ou sem permissão, controle por toque com estado visível e entradas binárias (I4); o controle de drift do toque, se entregue, não tem efeito; o mesmo HUD |
| Piloto de teste (`npm run bench:handling`) | Sem canal de jogo: volta determinística na pista sintética (raios mínimos 24 m e 25 m, grampo de 4 m) com comandos binários, em no máximo 25 s, com zero passos fora do asfalto e, em todos os passos, sem `oversteer`, sem `sliding` e com derrapagem lateral de no máximo 0,65 rad; é a régua de regressão |
| Ensaios na pista de teste aberta (`npm test`, `npm run bench:handling`) | Sem canal de jogo: resposta do volante (partida em reta, 50 km/h mantidos), raio da trajetória (50 km/h e 70 km/h, acelerador cheio), giro (50 km/h, acelerador 0), recuperação da traseira; alimentam a simulação com a mesma forma de `Input` que os adaptadores produzem; o Jogador não pilota na pista de teste |

Todo limite é medido no **estado da simulação**, em tempo simulado (passos de `STEP`), a partir do valor
normalizado de `Input` que o adaptador entrega (I2, I8). Os canais diferem só no adaptador.

## Mapa do conjunto

| Parte | Onde |
|---|---|
| Funcionalidades | `features/FEAT-0001` (resposta do volante), `FEAT-0002` (aderência em curva: raio e giro), `FEAT-0003` (traseira viva e controlável, sem drift nem turbo), `FEAT-0004` (aceleração, velocidade, grama, parede e HUD), `FEAT-0005` (determinismo, piloto de teste e versão do acerto), `FEAT-0006` (requisitos transversais) |
| Fluxos | `flows/FLOW-0001` (passo de simulação e HUD), `FLOW-0002` (ensaio determinístico e volta do piloto de teste), `FLOW-0003` (leitura de replay e comparação entre versões) |
| Contratos | `api/API-0001` (telemetria de dirigibilidade por passo), `API-0002` (versão do acerto no dado publicado, no replay e no resultado), `API-0003` (saída dos ensaios de dirigibilidade) |
| Telas | `screens/SCR-0001` (HUD de velocidade e aderência), `SCR-0002` (resultado e texto compartilhado sem comparação entre versões do acerto) |
| Regras | `rules/RULE-0001` (estado de aderência, condução normal, condição de forçar, recuperação e ausência de drift), `RULE-0002` (ambientes, ensaios e limiares de dirigibilidade), `RULE-0003` (versão do acerto e comparabilidade) |

O índice (`00-index.md`) e a matriz de rastreabilidade (`99-traceability.md`) são gerados pelo gate e não
são escritos à mão.

## Camadas (I2)

Resposta do volante, aderência, recuperação da traseira, aceleração, velocidade máxima, perda na grama e na
parede são decididas pelos parâmetros do acerto e pelas assistências dentro da simulação; a ausência de
efeito do comando de drift também. A apresentação só exibe (HUD, resultado, texto compartilhado) e os
adaptadores de controle só entregam o `Input` normalizado; nenhuma regra de pilotagem é decidida na
renderização nem num adaptador (D-FS-05, NFR-0005). Retirar da tela o que mostrava o drift e o turbo é só
remoção de exibição, permitida pela restrição de I2, sem regra nova na renderização (`SEED/RE-01`,
`DOMAIN/DEC-16`). A validação de volta e o dado de pista não mudam (NFR-0008). A pista de teste é ambiente
da simulação para ensaio: nenhuma tela a exibe e nenhum adaptador a alcança.

## Decisões de forma desta especificação

- A **versão do acerto** é declarada por versão própria do acerto (`setupVersion`), e não por
  `trackVersion`: os requisitos admitem as duas formas (critério 04 de US-0005) e o dado de pista não muda
  (NFR-0008), de modo que só a versão própria preserva as duas exigências ao mesmo tempo.
- Os valores do estado de aderência (`grip`, `understeer`, `oversteer`, `sliding`) são mantidos em
  minúsculas, como os requisitos e o glossário os nomeiam; os enums novos deste conjunto são em
  maiúsculas.
- Os ensaios são especificados como contrato de saída (`API-0003`) porque os critérios dos requisitos
  nomeiam a saída de `npm test` e dos benches como ponto de observação; a forma de serialização dessa
  saída é decisão de projeto.
- A **pista de teste aberta** é um ambiente de ensaio da simulação (`benchEnvironment` `TEST_PAD`); cada
  ensaio declara a área de asfalto que contém a sua trajetória, um disco centrado no ponto de partida de
  raio `testAreaRadiusM` ([RULE-0002](rules/RULE-0002-ensaios-e-limiares.md)). Dentro dela a telemetria
  reporta `surface` `ASPHALT`; fora, `GRASS` no sentido de "fora do asfalto", e a medição é inválida
  (`TEST_AREA_EXCEEDED`, falha do ambiente de ensaio). `wallContact` nunca é verdadeiro ali. A pista
  sintética é `SYNTHETIC_TRACK`.
- A **curva de referência** é verificada por dois ensaios, um por medida: `CORNER_RADIUS` (raio aos 3 s,
  acelerador cheio) e `CORNER_TURN` (giro em até 2 s, acelerador 0). O giro é contrato em radianos,
  apresentado também em graus, como as velocidades em m/s são apresentadas também em km/h (D-FS-06).
- A **condução normal** é a volta do piloto de teste inteira, sem exclusão de passos, como os requisitos a
  definem; a recuperação da traseira é julgada só no ensaio da pista de teste aberta
  ([RULE-0001](rules/RULE-0001-estado-de-aderencia-e-condicao-de-forcar.md)).
- A ausência do drift e do turbo é verificada no estado da simulação por `DRIFT_INERT` (mesma sequência,
  com e sem o comando de drift) e por `SPEED_CAP` (a velocidade nunca passa da estabilizada); o campo de
  `Input` do comando de drift continua existindo, com o mesmo nome e faixa (I8), e a simulação o ignora.

## Lacunas deliberadas

Os requisitos recusaram, com motivo registrado no seu changelog, decidir os pontos abaixo; nenhum critério
os pede, e esta especificação não os decide nem os inventa:

| Ponto | Situação |
|---|---|
| Limite de resposta para a inversão do esterço (de 1 a −1 num passo) | Não fixado; os ensaios de resposta partem de esterço 0 e de regime atingido |
| Limite de recuperação da traseira para redução parcial do esterço (`web-mobile`) | Não fixado; o ensaio leva o esterço a 0 |
| Limite de raio e de giro com esterço parcial (`web-mobile`) | Não fixado; o kart faz raio maior e gira menos por construção |
| Magnitude da perda de velocidade no contato com a parede | Não fixada; exige-se redução a cada contato |
| Perda na grama abaixo de 50 km/h ou com esterço diferente de 0 | Não fixada; a grama continua reduzindo a velocidade |
| Modo de manter a velocidade em 50 km/h no ensaio de resposta (acelerador constante ou regulado por passo), faixa tolerada e janela de estabilização do regime | Parâmetros de ensaio, reportados na saída (`speedHoldMode`, `speedHoldBandMps`, `settleWindowMs`) e registrados em `docs/physics.md`, não limiares de domínio; o que se exige é a condição observável: velocidade mantida (mínimo e máximo reportados) e regime estacionário |
| Duração da janela de medição do raio, raio da área declarada da pista de teste, velocidade de partida e duração máxima do forçar na recuperação | Parâmetros de ensaio (`radiusWindowMs`, `testAreaRadiusM`, `entrySpeedMps`), reportados na saída e registrados em `docs/physics.md`, não limiares |
| Ambiente dos ensaios de 0–60 km/h e de velocidade estabilizada | Não fixado pelos requisitos; `benchEnvironment` é reportado. Grama e parede são ensaiadas na pista sintética por necessidade: a pista de teste não tem grama nem parede |
| Traseira que não solta sob a condição de forçar | Nenhum critério exige que solte; o ensaio reporta `rearReleased` falso e `forcingMs`, sem reprovar |

## Fora do escopo

Idêntico ao dos requisitos:

- Novas pistas ou novas manobras. O drift e o turbo de `requirements/11` foram retirados (2026-10-29): a
  retirada está no escopo ([FEAT-0003](features/FEAT-0003-traseira-viva-e-controlavel.md)); criar
  qualquer manobra especial no lugar deles não está.
- Mudanças no preset Realista — aluguel 4T.
- Som de motor, vibração, câmera (RF13, RF11).
- Volante remoto (`remote-wheel`) e desafio diário.

## Como a especificação é verificada

Cada critério tem ensaio determinístico na saída de `npm test` ou dos benches (`npm run bench:handling`,
bench de física), avançando a simulação com `STEP` sem renderização nem controles (I9), no ambiente que
[RULE-0002](rules/RULE-0002-ensaios-e-limiares.md) declara para cada ensaio; os critérios de tela e de
texto compartilhado (ausência do drift e do turbo; comparação só entre versões iguais) são observados em
[SCR-0001](screens/SCR-0001-hud-de-velocidade-e-aderencia.md) e
[SCR-0002](screens/SCR-0002-resultado-e-texto-compartilhado.md). A rodada de teste do dono do produto na
build (`DOMAIN/DEC-08`) é condição humana de fechamento, posterior à etapa de testes, e não é critério
desta especificação. O ciclo dessa rodada é o de `DOMAIN/DEC-10`: cada rodada de código é publicada em
staging, o dono do produto devolve feedback curto (vira? acelera? traseira?) e os presets são iterados
dentro do pipeline até a aprovação dele; cada rodada de presets é nova versão de acerto
([RULE-0003](rules/RULE-0003-versao-do-acerto-e-comparabilidade.md)) e passa de novo por todos os ensaios;
nenhum preset experimental extra é exposto no painel do jogo, e nenhuma configuração permite escolher entre
versões ([FEAT-0005](features/FEAT-0005-determinismo-piloto-de-teste-e-versao.md), Configuração).
