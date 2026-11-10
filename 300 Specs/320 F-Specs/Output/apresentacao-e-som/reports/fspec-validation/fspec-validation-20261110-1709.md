---
stage: fspec
feature: apresentacao-e-som
verdict: FAIL
generated: 2026-11-10T17:09:00Z
counts: {blocker: 0, error: 1, warning: 2, info: 1, divergence: 0}
seed: {revision: 2, digest: e7a828ada2d2}
upstream: {stage: req, version: req-validation-20261110-1652}
feedbacks: []
previous: nenhum (primeira validação do conjunto)
population: "validação completa: os 20 arquivos do conjunto"
isolation: "a invocação não trouxe justificativa do gerador; 97-changelog.md faz parte do conjunto, foi lido e a sua seção de decisões de forma não pesou em nenhum julgamento"
status-stamp: "nenhum: veredito FAIL, os arquivos continuam em draft"
---

# Relatório de validação F-Spec — apresentacao-e-som

## Summary

- verdict: FAIL
- blocker: 0
- error: 1
- warning: 2
- info: 1
- divergence: 0

## Issues

### ISSUE-01

- severity: error
- check: F3 (fluxos e modelos de estado não se contradizem)
- file: rules/RULE-0002-som-de-pneu.md
- location: seção "Kart marcando o asfalto", terceira condição ("A simulação está avançando") e a frase seguinte; contra features/FEAT-0004-som-de-pneu.md, tabela de Comportamento, linha "Vários passos avançados entre dois quadros, ou nenhum", e flows/FLOW-0002-som-durante-a-volta.md, caso "Nenhum passo avançado entre dois quadros"
- finding: a regra diz que o kart só marca se `simStepCount` avançou desde o quadro anterior e que deixa de marcar no instante em que a simulação deixa de avançar, enquanto FEAT-0004 e FLOW-0002 dizem que num quadro sem passo novo vale o último passo avançado e os valores não mudam; num quadro sem passo, durante um deslize em corrida, a regra dá `TIRE_SILENT` e a funcionalidade dá `TIRE_PLAYING`, e a própria seção "Idempotência e ordem" da regra declara o estado função só de `soundOn`, `tireSoundAvailable` e do último passo avançado.
- expected: uma única definição de "simulação suspensa ou parada" em RULE-0002, que não trate um quadro isolado sem passo novo como fim da marca (por exemplo, pelos estados de pausa e de resultado que o conjunto já nomeia), com FEAT-0004, FLOW-0002 e o glossário ("Kart marcando o asfalto") dizendo o mesmo.

### ISSUE-02

- severity: warning
- check: F2 (requisito testável, sem ambiguidade)
- file: api/API-0003-registros-de-verificacao.md
- location: campo `initialDownloadBytes` e motivo `INITIAL_DOWNLOAD_EXCEEDED`; também features/FEAT-0005-requisitos-transversais.md, REQ-FEAT-0005-01 e o seu critério de aceite
- finding: o campo é medido em bytes e a condição de `PASS` e de `FAIL` é dada em "3 MB", sem o valor em bytes; entre 3.000.000 e 3.145.728 bytes o veredito não é decidível.
- expected: o limite escrito na unidade do campo, com a fonte que fixa a conversão citada; se os requisitos não a fixam, o ponto vai para o `SCOPE-BACKLOG.md` do autor e o limite fica como está.

### ISSUE-03

- severity: warning
- check: F4 (todo o que o conjunto exige tem fonte nos requisitos)
- file: api/API-0001-declaracoes-da-pagina-do-jogo.md
- location: tabela "Resposta — declarações do documento", linha `previewImageWidthPx`, e a frase "O documento entregue traz sempre as seis declarações"
- finding: o contrato torna obrigatória uma declaração da largura da imagem no documento, que nenhum `REQ-*` e nenhum `AC-*` pede (AC-US-0002-02 e REQ-FEAT-0002-02 falam da largura da imagem, não de uma declaração); o diagrama e o passo 2 de flows/FLOW-0001 também divergem entre si (cinco declarações no diagrama, "seis" na tabela).
- expected: a largura tratada como propriedade da imagem para a qual `previewImage` resolve (já conferida por `coverWidthPx` em API-0003), sem declaração obrigatória própria, e FLOW-0001 e API-0001 com a mesma contagem de declarações.

### ISSUE-04

- severity: info
- check: F7 (toda regra de domínio cita a fonte; nenhum ramo inventado)
- file: rules/RULE-0001-estado-do-som-e-som-do-motor.md
- location: tabela de decisão do estado do motor, linha 5 (`COUNTDOWN`, nenhuma volta aceita); também features/FEAT-0003-som-do-motor-gravado.md, linha "Antes de a volta estar em andamento"
- finding: o motor em silêncio durante a contagem regressiva cita AC-US-0003-01 por inferência; os requisitos definem "volta em andamento" como o Jogador pilotando uma volta e não mencionam a contagem regressiva.
- expected: a leitura fica como está; proposta de entrada em `DOMAIN.md` para o dono do produto confirmar que não há som de motor antes de a volta começar.

## Divergences

Nenhuma; 98-divergences.md não tem linhas.

## Coverage

- Critérios cobertos: 28 de 28 `AC-*` (US-0001 a US-0004), cada um citado por ao menos um `REQ-*`.
- Critérios descobertos: nenhum.
- NFRs: 10 de 10 realizados (NFR-0001 a NFR-0010, em FEAT-0005); nenhum adiado ao D-Spec.
- Requisitos sem fonte: nenhum `REQ-*`; a declaração `previewImageWidthPx` de API-0001 não tem requisito (ISSUE-03).
- Contratos sem consumidor: nenhum.
