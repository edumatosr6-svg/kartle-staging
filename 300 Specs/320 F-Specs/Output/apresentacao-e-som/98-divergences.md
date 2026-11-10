---
title: Divergências — apresentação e som
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.0
sources: []
---

# Divergências

Registro durável dos requisitos deste conjunto que o sistema em execução não satisfaz (conventions §6).
Colunas: requisito, o que o requisito exige, o que o sistema faz hoje (`arquivo:linha`), etapa devedora,
estado.

| Requisito | O que exige | O que o sistema faz hoje | Etapa devedora | Estado |
|---|---|---|---|---|

Nenhuma divergência registrada: esta etapa não lê a raiz de código para derivar comportamento (conventions
§12); apenas nomes existentes foram consultados para não colidir com eles (`getLapState`, `lapPhase`,
`repositionKart`, `getHandlingTelemetry`, `speedMps`, `simStepCount`, `Input`, `STEP`, `soundOn`,
`checkId`, `verdict`, `checkFailReason`, os rótulos "Som ligado" e "Som desligado" do controle de som). Os
requisitos declaram que hoje o jogo não tem ícone nem capa e que o motor é um tom sintetizado — isso é o
motivo da feature; a etapa de código, que lê a raiz de código, registra aqui, com `arquivo:linha`, os
requisitos que o sistema ainda não atende.
