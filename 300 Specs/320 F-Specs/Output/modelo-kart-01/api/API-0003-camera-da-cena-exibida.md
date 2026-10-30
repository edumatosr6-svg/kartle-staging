---
id: API-0003
title: Contrato da câmera da cena exibida
feature: modelo-kart-01
stage: fspec
status: validated
version: 2.0.0
sources: [US-0003, AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-08, AC-US-0003-10, AC-US-0003-11, AC-US-0003-12, AC-US-0003-13, AC-US-0003-14]
---

# API-0003 — Contrato da câmera da cena exibida

Contrato único da câmera com que cada quadro da cena é desenhado, em `web-desktop` e `web-mobile`: o modo, a
posição, o ponto de mira e o campo de visão que [RULE-0002](../rules/RULE-0002-camera-de-jogo.md) decide a
partir do estado da volta, da pose do kart e da forma da área de jogo. A apresentação desenha a cena com
ele, e as verificações em tela o leem para julgar os critérios de câmera (I9, "câmera verificada em tela").
É um contrato em processo, dentro do navegador: não há endpoint de rede, caminho HTTP nem prefixo no MVP
(diretrizes do estágio). Nomes em `camelCase` plano com a unidade no sufixo (D-FS-06): `M` metros, `Deg`
graus — a unidade em que os requisitos dão o campo de visão (62°, 60°) —, `Px` pixels.

## Operações

| Operação | Propósito | Quem chama |
|---|---|---|
| `getCameraView` | Lê a câmera com que o quadro corrente é desenhado | Apresentação, em todos os quadros em que a cena é desenhada; verificações em tela dos critérios de câmera |

## Auth

Sem sessão e sem conta (RNF10). Papel permitido: `player` (anônimo), único papel do produto. Contrato
deliberadamente público dentro do cliente: não há segredo a proteger e a leitura não altera estado.

## Parâmetros

Nenhum parâmetro de caminho ou de consulta. A operação lê a câmera do quadro corrente.

## Resposta de `getCameraView`

| Campo | Tipo | Unidade | Obrigatório | Padrão e restrições |
|---|---|---|---|---|
| `cameraMode` | enum `TRACK_OVERVIEW`, `COUNTDOWN_DESCENT`, `RACE_CHASE` | — | sim | decidido pela fase da volta ([RULE-0002](../rules/RULE-0002-camera-de-jogo.md)); `TRACK_OVERVIEW` só com a pista carregada e sem volta ativa (`NO_ACTIVE_LAP`); `RACE_CHASE` em `RUNNING`, em `ENDED` (volta oficial encerrada, válida ou invalidada, com o painel de resultado exibido e o kart parado) e, no treino, do fim de uma volta até a próxima visão geral, com o kart em movimento; nunca `TRACK_OVERVIEW` depois do fim de uma volta, até uma nova contagem (AC-US-0003-10, AC-US-0003-13, AC-US-0003-14) |
| `simStepCount` | inteiro | passos | só com estado de simulação | passo da simulação mostrado no quadro ([API-0001](API-0001-estado-do-kart-para-exibicao.md)); ausente sem estado de simulação |
| `viewShape` | enum `LANDSCAPE`, `PORTRAIT` | — | sim | `LANDSCAPE` com `viewWidthPx` ≥ `viewHeightPx`; `PORTRAIT` com `viewHeightPx` > `viewWidthPx` |
| `viewWidthPx`, `viewHeightPx` | inteiro | px | sim | largura e altura da área de jogo no quadro; maiores que 0 |
| `cameraXM`, `cameraZM` | número | m | sim | posição da câmera no chão, no referencial da pista de `xM`, `zM` |
| `cameraHeightM` | número | m | sim | altura da câmera acima do chão; 1,38 em `RACE_CHASE`, inclusive depois do fim de uma volta, oficial ou de treino (AC-US-0003-01, AC-US-0003-12, AC-US-0003-13, AC-US-0003-14); nunca maior que no quadro anterior em `COUNTDOWN_DESCENT` (AC-US-0003-11) |
| `aimXM`, `aimZM` | número | m | sim | ponto de mira no chão; em `RACE_CHASE`, 3,2 m à frente da posição do kart ao longo do rumo (AC-US-0003-03) |
| `aimHeightM` | número | m | sim | altura do ponto de mira acima do chão; 0,30 em `RACE_CHASE` (AC-US-0003-03) |
| `verticalFovDeg` | número | graus | sim | campo de visão vertical exibido; em `RACE_CHASE`, só o de base da forma corrente, em todos os quadros e sem variação por comando do Jogador: 62 em `LANDSCAPE` (AC-US-0003-04); nunca abaixo de 62 em `PORTRAIT` (AC-US-0003-06) (`DOMAIN/DEC-08`); substitui os campos retirados `baseVerticalFovDeg` e `turboFovDeltaDeg` (ver Compatibilidade) |
| `horizontalFovDeg` | número | graus | sim | campo de visão horizontal exibido, que resulta de `verticalFovDeg` e da razão `viewWidthPx` ÷ `viewHeightPx`; em `RACE_CHASE` e `PORTRAIT`, pelo menos 60 em todos os quadros (AC-US-0003-05) |

Nenhum campo tem padrão que mude comportamento: a leitura não altera a câmera nem a simulação (I4). Os campos
opcionais estão ausentes, e não zerados, quando o modo não os define. Nenhum campo carrega dado pessoal (I6).

Resposta na forma vazia: sem pista carregada (carregamento em curso ou dado de pista ilegível) não há cena; a
operação retorna `NO_SCENE` e nenhum campo.

## Erros

Não há status HTTP. A operação retorna o código abaixo, sem lançar nem alterar estado:

| Código | Condição | Corpo |
|---|---|---|
| `NO_SCENE` | nenhuma pista carregada; nenhuma cena é desenhada | apenas o código |

## Idempotência

Leitura pura: repetir a chamada no mesmo quadro devolve o mesmo valor e não altera estado. Não há chave. Em
`RACE_CHASE`, a câmera é função só da pose do kart do passo `simStepCount` e da forma da área de jogo —
nenhum comando do Jogador entra nela —; depois do fim da volta oficial, `simStepCount` não avança e a leitura
devolve a mesma câmera a cada quadro; depois do fim de uma volta de treino, `simStepCount` continua
avançando e a câmera segue o kart; em `COUNTDOWN_DESCENT`, de `countdownRemainingMs` e da pose do kart; o mesmo passo e a mesma forma
dão a mesma câmera.

## Paginação e sondagem

Sem paginação. A apresentação lê uma vez por quadro desenhado. Não há intervalo de sondagem de rede.

## Compatibilidade

Contrato de leitura desta feature. A câmera de perseguição alta e distante é retirada em corrida e
substituída pela câmera de corrida (`RACE_CHASE`); a câmera alta inicial continua só como visão geral antes
da contagem (`TRACK_OVERVIEW`), com a descida (`COUNTDOWN_DESCENT`) acrescentada, e não volta no fim da
volta oficial, nem com o painel de resultado exibido, nem no fim de uma volta de treino (requisitos,
`01-context.md`, Retiradas e substituições; `DOMAIN/DEC-06`; `DOMAIN/DEC-07`). Nenhum campo publicado
descrevia essas câmeras, então não há campo a rejeitar por causa delas.

Retirados na versão 2.0.0, com o efeito de turbo no campo de visão, que deixou de existir (seed
`revision: 3`, `DOMAIN/DEC-08`; critério 09 de US-0003 retirado):

| Campo retirado | Substituto | O que o leitor encontra |
|---|---|---|
| `baseVerticalFovDeg` | `verticalFovDeg`, que em `RACE_CHASE` é sempre o campo de visão vertical de base da forma corrente | o campo não existe na resposta: ausente, nunca zerado nem preenchido com outro valor |
| `turboFovDeltaDeg` | nenhum valor a ler: sem turbo, a diferença não existe; o campo de visão exibido é `verticalFovDeg` | o campo não existe na resposta: ausente, nunca zerado nem preenchido com outro valor |

A operação não recebe parâmetros, então nenhum pedido carrega esses nomes e não há pedido a rejeitar; a
retirada é declarada nesta tabela, com o substituto, e uma verificação que lia os dois campos sai com o
critério retirado. Nenhum dos dois nomes volta a ser usado, com este ou outro significado. Um campo deste
contrato nunca muda de unidade ou de significado sob o mesmo nome (I3): `verticalFovDeg` mantém nome,
unidade e significado (o campo de visão vertical exibido); só deixa de ter parcela de turbo.
