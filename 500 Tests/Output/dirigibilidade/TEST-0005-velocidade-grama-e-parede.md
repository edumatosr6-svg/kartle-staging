---
id: TEST-0005
title: Aceleração, velocidade estabilizada, grama e parede
feature: dirigibilidade
stage: test
status: validated
version: 1.1.0
sources: [AC-US-0004-01, AC-US-0004-02, AC-US-0004-03, AC-US-0004-04, AC-US-0004-05, AC-US-0004-07, NFR-0003]
---

# TEST-0005 — Aceleração, velocidade estabilizada, grama e parede

| | |
|---|---|
| Arquivo | `tests/dirigibilidade-speed.test.ts` (estratégia: `speed`) |
| Nível | integração (`runBench` de `ACCELERATION`, `TOP_SPEED`, `GRASS_LOSS` e `WALL_CONTACT` sobre a física real, na área da reta da pista de teste aberta `testPadArea(1500)` e em `CIRCUIT`, com os traços refeitos pelo teste) e contrato (campos de API-0003 4.0.1, `serialize`, `scripts/physics-bench.ts` lido como texto) |
| Interface exercitada | `runBench`, `judge`, `serialize`, `straight`, `grassEntry`, `wallApproach`, `makeInput` (`scripts/handlingBench.ts`); `step`, `getHandlingTelemetry`, `testPadArea`, `CIRCUIT` (`src/physics.ts`) |
| Fixtures | `options(mode)` e `trace()` de `tests/helpers/handling.ts`; `straight(0)` com acelerador cheio até 120 passos sem variação de velocidade; `grassEntry(v)` por 120 passos em `CIRCUIT` (velocidade estabilizada, 50 km/h e 30 km/h); `wallApproach()` por 1 200 passos em `CIRCUIT` |

## Verificações

| Check | Decide | Teste | O que a faria falhar |
|---|---|---|---|
| CHK-TEST-0005-01 | AC-US-0004-01 | from rest on the straight with full throttle the kart reaches 60 km/h within 2.5 s | 0–60 km/h acima de 2 500 ms ou não inteiro, piloto diferente de 75 kg, tempo do registro diferente do primeiro passo a 60 km/h do traço refeito, `judge` aceitando 2 501 ms |
| CHK-TEST-0005-02 | AC-US-0004-02 | on the straight with full throttle the stabilized speed lies between 65 km/h and 72 km/h, both ends included | velocidade estabilizada do traço refeito fora de 65–72 km/h (mutação M1, `governorSpeed` 21,5: reprova), reta que sai da área ou ainda acelerando no último segundo, registro diferente da velocidade final do traço, `judge` aceitando 18,05 ou 20,01 m/s ou recusando 18,056 ou 20,0 m/s |
| CHK-TEST-0005-03 | AC-US-0004-03 | entering the grass at the stabilized speed with full throttle, the speed after 1 s is at most 70 % of the entry speed | velocidade de entrada diferente da estabilizada, perda menor que 30 %, passo fora da grama ou contato com a parede na janela, registro diferente do 120.º passo do traço refeito, precondição não mantida sem `FAIL` |
| CHK-TEST-0005-04 | AC-US-0004-04 | entering the grass at 50 km/h with full throttle, the speed after 1 s is at most 70 % of 50 km/h, and the grass still slows the kart below 50 km/h | entrada diferente de 50 km/h, perda menor que 30 %, grama que não reduz a velocidade a 30 km/h |
| CHK-TEST-0005-05 | AC-US-0004-05 | at every wall contact the speed on the step after the contact is below the speed on the step before it | ensaio sem contato, contato sem perda de velocidade, pares diferentes dos contatos do traço refeito, `judge` sem `MEASUREMENT_MISSING` para a lista vazia (mutação M13 reprova) ou aceitando um par sem perda |
| CHK-TEST-0005-06 | AC-US-0004-07 | the output carries the four records of API-0003 with their environments, in m/s and ms, presented also in km/h and s | ambiente errado, `testAreaRadiusM` diferente dos 1 500 m da área da reta (mutação M11 reprova) ou passo fora dela, campo da área num registro da pista sintética, campo ausente, um só registro de grama, apresentação sem s ou km/h, `bench:physics` deixando de rodar um dos quatro ensaios ou de imprimir a mesma serialização |
| CHK-TEST-0005-07 | NFR-0003 | the keyboard and the tilt forms give the same acceleration, top speed, grass loss and wall contacts | medidas diferentes entre `BINARY` e `PROPORTIONAL` em qualquer dos quatro registros |
