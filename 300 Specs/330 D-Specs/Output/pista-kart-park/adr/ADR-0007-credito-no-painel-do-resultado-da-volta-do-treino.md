---
id: ADR-0007
title: Crédito OSM no painel do resultado de cada volta do treino, em vez da tela de resultado da volta
feature: pista-kart-park
stage: dspec
status: validated
version: 1.0.0
sources: [SCR-0002, FEAT-0003, FEAT-0006, REQ-FEAT-0003-14, REQ-FEAT-0003-15, REQ-FEAT-0006-04, REQ-FEAT-0006-05, REQ-FEAT-0006-06, REQ-FEAT-0006-12, REQ-FEAT-0006-13]
---

# ADR-0007 — Crédito OSM no painel do resultado de cada volta do treino

## Contexto

SCR-0002 deste F-Spec acrescenta a linha de crédito OSM à "tela de resultado da volta" de `race-lap-validation`,
que ela nomeia e não redefine (REQ-FEAT-0006-04 a -06; REQ-FEAT-0003-14 e -15: a volta na Kart Park termina e é
apresentada como na pista sintética, pelas regras de `race-lap-validation`, sem mudança). Até a rodada anterior
deste conjunto, o fim de uma volta de treino era a chegada a `ENDED`, seguida da tela `#lap-result`, onde o
crédito foi posto (`#lap-result-credit`, `index.html:25`; `src/main.ts:465`).

O F-Spec revalidado de `race-lap-validation` (seed `revision: 3`; FEAT-0010, SCR-0001 1.1.0, SCR-0003 1.2.1,
API-0001 1.2.0) e o seu projeto (ADR-0006, DES-0007 e DES-0008 1.1.0) retiram a volta `TRAINING` única: o treino é
uma sequência de voltas numa sessão, o resultado de cada volta aparece sem parar o jogo num painel da tela de
corrida (`#lap-training-result`), a tela `#lap-result` passa a ser só da volta oficial e da de reconhecimento, e o
treino termina só por "encerrar treino", que volta à oferta (`#welcome`), sem tela de resultado. Toda volta da
sessão de treino desta feature é `TRAINING` (REQ-FEAT-0001-11), de modo que `#lap-result-credit` nunca mais seria
exibido (FB-01 de `race-lap-validation`, `reports/feedbacks/race-lap-validation/feedback-20261030-1256.md`).

## Decisão

1. Para uma volta de treino, a "tela de resultado" de `race-lap-validation` a que SCR-0002 acrescenta o crédito é o
   painel do resultado da volta do treino (`#lap-training-result`): é o lugar em que aquela feature exibe o
   resultado de cada volta do treino, com validade, motivo, tempo total, quatro setores e "não oficial".
2. A linha de crédito fica dentro desse painel, como último filho (`#lap-training-result-credit`), construída pela
   mesma `renderCredit` e por `creditFor` da entrada do catálogo do `trackId` do resultado exibido; aparece com o
   resultado de cada volta concluída na Kart Park, válida ou inválida, e nunca com o de uma volta na pista
   sintética ([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)).
3. `#lap-result-credit` é retirado de `#lap-result` na mesma entrega (I3: a substituição é projetada no mesmo
   conjunto).
4. O link do crédito no painel abre em outra aba ([ADR-0006](ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md));
   a perda de foco pausa o treino pela regra de `race-lap-validation`, sem mudar resultado algum.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Manter o crédito só em `#lap-result` | `#lap-result` não é exibido para volta de treino (SCR-0003 1.2.1 de `race-lap-validation`); a volta na Kart Park ficaria sem crédito no resultado, contra REQ-FEAT-0006-04 a -06 |
| Exibir o crédito só em `#welcome` depois de "encerrar treino" | o seletor com a Kart Park selecionada já mostra o crédito (REQ-FEAT-0006-01 a -03), mas isso não é o resultado de uma volta: o requisito pede o crédito na tela de resultado de cada volta na Kart Park |
| Uma tela de resultado própria desta feature ao encerrar o treino | acrescentaria uma tela que `race-lap-validation` retirou do treino e um resultado para o treino inteiro que nenhum contrato define (API-0001 1.2.0 não tem resultado de treino); contraria "nomeado e não redefinido" de SCR-0002 |
| Iniciar voltas `OFFICIAL` ou `RECON` na Kart Park para manter `#lap-result` | a sessão de treino só oferece `TRAINING`, sem `challengeNumber` (REQ-FEAT-0001-11); seria mudar o escopo do F-Spec |
| Crédito como irmão do painel, fora de `#lap-training-result` | o crédito apareceria desligado do resultado que credita; dentro do painel ele some e aparece com o resultado, sem regra de visibilidade própria |

## Consequências

- O crédito aparece durante o treino, na coluna direita da tela de corrida, sem cobrir o estado da volta em
  andamento (a posição do painel é de DES-0008 1.1.0 de `race-lap-validation`), com os mesmos textos, menção e link
  do seletor (REQ-FEAT-0006-13), sem rede (REQ-FEAT-0006-12).
- O código desta mudança depende do painel `#lap-training-result`, que a rodada de código de `race-lap-validation`
  cria em `index.html` e `src/main.ts`: entra com ela ou depois dela ([01-architecture](../01-architecture.md),
  "Ordem de entrega").
- O redesenho do painel por `race-lap-validation` atualiza os seus elementos por identificador e não remove o
  contêiner do crédito; o crédito é redesenhado no mesmo ramo, logo depois do painel.
- O texto do F-Spec desta feature que ainda descreve a tela de resultado ao chegar a `ENDED` (SCR-0002, "Pontos de
  entrada", estado "Carregando" e "Sair da tela"; RULE-0003, linha "uma volta já `ENDED` já teve o seu resultado
  exibido pela tela de resultado"; FEAT-0003, linha "Corte ... a volta termina no passo"; FEAT-0001, "depois da
  tela de resultado") fica desatualizado em relação ao contrato revalidado de `race-lap-validation`. Nenhum
  `REQ-*` muda: a questão vai ao autor do F-Spec em
  `300 Specs/320 F-Specs/Output/pista-kart-park/reports/feedback/FEEDBACK-01.md`.

## Status

Proposta deste conjunto, a validar.
