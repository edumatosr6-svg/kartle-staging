---
stage: fspec
feature: dirigibilidade
verdict: FAIL
generated: 2026-10-30T12:33:09Z
counts: {blocker: 0, error: 5, warning: 1, info: 0, divergence: 0}
seed: {revision: 5, digest: 48feb6d51bf8}
upstream: {stage: req, version: 4.3.0}
feedbacks: []
population: "revalidação após a rodada 11 (Mode C, requisitos 4.3.0, seed revision 5) sobre fspec-validation-20261027-1735.md (SUCCESS, 1 info): a issue anterior reverificada primeiro; arquivos com versão movida: todos os 20 artefatos que leem `status: draft` (01-overview, 02-glossary, 97-changelog só por varredura mecânica, API-0001 a API-0003, FEAT-0001 a FEAT-0006, FLOW-0001 a FLOW-0003, RULE-0001 a RULE-0003, SCR-0001, SCR-0002; 00-index e 99-traceability gerados pelo gate); nenhum artefato intocado restou para sorteio além de 98-divergences.md, lido; lista de AC-* reconstruída dos requisitos 4.3.0 (33 AC, 9 NFR); varreduras mecânicas: links relativos (153, todos resolvem), REQ (64, um modal cada, todos citam AC-*, NFR ou [DOMAIN]; todo REQ coberto por um critério de aceite), OPEN/TBD (nenhum), blocos mermaid (3 sequenceDiagram, 1 stateDiagram-v2) conferidos contra as regras do analisador léxico do Mermaid 11.17.2 (texto de mensagem `:(?:(?:no)?wrap)?[^#\\n;]*`; `;` vira NEWLINE), lidas no pacote, não executadas"
isolation: "nenhuma justificativa do gerador chegou pela tarefa; as linhas de assunto do git log, o git status e as notas de memória do usuário presentes no ambiente foram desconsideradas; de 97-changelog.md só os títulos das rodadas foram lidos; a pasta do seed e a raiz de código não foram lidas"
---

# Relatório de validação — dirigibilidade

## Summary

- veredito: FAIL
- contagens: blocker 0, error 5, warning 1, info 0, divergence 0
- issue anterior: ISSUE-01 de fspec-validation-20261027-1735.md (info, F7, terceiro caso de V1 em "Fim da varredura") encerrada — o ensaio `UNDERSTEER_ONSET` e a seção foram retirados com `DOMAIN/DEC-15` (RULE-0002, "Ensaios retirados")
- status: não gravado (veredito FAIL)

## Issues

### ISSUE-01

- severidade: error
- check: F4
- arquivo: `screens/SCR-0002-resultado-e-texto-compartilhado.md`
- local: Propósito (linha 15), Canal (linha 28), estados Vazio, Populado e Erro (linhas 41-43), parágrafo do texto compartilhado (linha 48), ação "Compartilhar o resultado" (linha 59); também `api/API-0002-versao-do-acerto.md` linha 62, `rules/RULE-0003-versao-do-acerto-e-comparabilidade.md` linha 54, `features/FEAT-0005-determinismo-piloto-de-teste-e-versao.md` linha 97, `flows/FLOW-0003-leitura-de-replay-e-comparacao.md` linhas 34 e 50
- achado: o conjunto acrescenta à tela de resultado e ao texto compartilhado a `setupVersion` em texto ao lado de cada tempo, elemento que nenhum critério dos requisitos 4.3.0 pede e que contradiz `01-context.md` dos requisitos ("nenhum elemento de tela novo — a feature só retira os elementos do drift e do turbo"; RNF11: "nenhum texto novo de tela"); AC-US-0005-05 e AC-US-0005-07 pedem só que tempos de versões diferentes nunca sejam apresentados como comparáveis.
- esperado: a tela de resultado e o texto compartilhado realizam AC-US-0005-05 e AC-US-0005-07 só por não comparar tempos com `comparability` diferente de `COMPARABLE`, sem exibir a `setupVersion`; os campos `setupId` e `setupVersion` do replay e do resultado (AC-US-0005-04, NFR-0009) permanecem; se o rótulo de versão for desejado, ele entra pelos requisitos, não por esta etapa.

### ISSUE-02

- severidade: error
- check: F7
- arquivo: `features/FEAT-0003-traseira-viva-e-controlavel.md`
- local: Estado, tabela de transições, linha 136 ("`grip`/`understeer` para `oversteer`/`sliding` | passo com `forcing` verdadeiro em que a traseira perde aderência")
- achado: o modelo de estado confina a entrada em `oversteer`/`sliding` aos passos com a condição de forçar, ramo sem fonte nos requisitos 4.3.0, que retiraram o critério que restringia os estados de traseira solta à condição de forçar (US-0003, nota de numeração) e cujo RULE-0001 não faz essa restrição (contexto "Forçando" e parágrafo das linhas 33-35).
- esperado: a transição diz o que os requisitos dizem — a traseira pode soltar em qualquer passo fora da volta do piloto de teste, sob a condição de forçar no ensaio de recuperação (AC-US-0003-03) e nunca na volta do piloto de teste (AC-US-0003-01) — sem `forcing` como gatilho exclusivo.

### ISSUE-03

- severidade: error
- check: F1
- arquivo: `flows/FLOW-0001-passo-de-simulacao-e-hud.md`
- local: bloco mermaid `sequenceDiagram`, linha 30 (`S->>S: assistencias; estado de aderencia; superficie; parede`)
- achado: o texto da mensagem contém `;`, que o analisador de `sequenceDiagram` do Mermaid encerra como fim de instrução; "estado de aderencia" vira um ator sozinho e o bloco não é analisado.
- esperado: nenhum texto de mensagem do bloco contém `;` nem `#`; os itens são separados por vírgula ou pela entidade `#59;`.

### ISSUE-04

- severidade: error
- check: F1
- arquivo: `flows/FLOW-0002-ensaio-deterministico-e-piloto-de-teste.md`
- local: bloco mermaid `sequenceDiagram`, linha 30 (`E->>S: Input do passo (STEER_RESPONSE mantem 50 km/h; partida com esterco cheio na curva)`)
- achado: o `;` encerra a instrução; "partida com esterco cheio na curva)" vira instrução sem seta, com `)` inválido, e o bloco não é analisado.
- esperado: o texto da mensagem não contém `;` nem `#`; os itens são separados por vírgula ou pela entidade `#59;`.

### ISSUE-05

- severidade: error
- check: F1
- arquivo: `flows/FLOW-0003-leitura-de-replay-e-comparacao.md`
- local: bloco mermaid `sequenceDiagram`, linha 34 (`A-->>A: nunca compara; exibe cada setupVersion em texto`)
- achado: o `;` encerra a instrução; "exibe cada setupVersion em texto" vira um ator sozinho e o bloco não é analisado.
- esperado: o texto da mensagem não contém `;` nem `#` (e, com ISSUE-01, não exibe a `setupVersion`).

### ISSUE-06

- severidade: warning
- check: F5
- arquivo: `api/API-0003-saida-dos-ensaios.md`
- local: `WALL_CONTACT` `contacts`, linha 110 ("lista vazia é `FAIL`"); tabela Erros, linhas 130-141; `failReason`, linha 48
- achado: o `FAIL` de `WALL_CONTACT` sem nenhum contato não tem `failReason` declarado, embora `failReason` seja obrigatório com `FAIL`, e nenhuma linha da tabela Erros cobre essa condição (`MEASUREMENT_MISSING` está limitado a `CORNER_RADIUS` e `SPEED_CAP`; FLOW-0002 linha 78 também não o nomeia).
- esperado: a tabela Erros nomeia o `failReason` emitido por `WALL_CONTACT` com `contacts` vazio, e FLOW-0002 repete o mesmo código.

## Divergences

Nenhuma.

## Coverage

- critérios cobertos: 33 de 33 (US-0001: 01-06; US-0002: 05, 07, 08, 09; US-0003: 01, 03, 04, 05, 07, 08, 09, 10, 11; US-0004: 01-07; US-0005: 01-07); nenhum descoberto.
- NFR: NFR-0001 a NFR-0009 realizados (FEAT-0005-02, FEAT-0006-06, FEAT-0006-05, FEAT-0006-08, FEAT-0006-01/02, FEAT-0006-03, FEAT-0006-04, FEAT-0006-07, FEAT-0005-08/09); nenhum adiado.
- requisitos sem fonte: nenhum REQ (64); conteúdo sem fonte fora de REQ: ISSUE-01, ISSUE-02.
- fora do escopo de `01-overview.md`: igual ao dos requisitos (quatro itens).
- contratos sem consumidor: nenhum (API-0001: FEAT-0001 a FEAT-0004, FLOW-0001, FLOW-0002, SCR-0001; API-0002: FEAT-0005, FLOW-0003, SCR-0002; API-0003: FEAT-0001 a FEAT-0006, FLOW-0002).
- `98-divergences.md`: cabeçalho bem formado, nenhuma linha.
- feedback entre features: nenhum.
