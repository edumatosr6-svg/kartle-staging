---
id: API-0002
title: Contrato do estado e do comando do som
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.0
sources: [US-0003, US-0004, NFR-0004, NFR-0009, AC-US-0003-01, AC-US-0003-02, AC-US-0003-03, AC-US-0003-04, AC-US-0003-05, AC-US-0003-06, AC-US-0003-07, AC-US-0003-08, AC-US-0003-09, AC-US-0004-01, AC-US-0004-02, AC-US-0004-03, AC-US-0004-04, AC-US-0004-05]
---

# API-0002 — Contrato do estado e do comando do som

Contrato único, em `web-desktop` e `web-mobile`, do que a apresentação pede à saída de áudio do jogo para o
som do motor e o som de pneu, e do comando que liga e desliga o som. É um contrato em processo, dentro do
navegador e na saída de `npm test`: não há endpoint de rede, caminho HTTP nem prefixo no MVP (diretrizes do
estágio). Nomes em `camelCase` plano com a unidade no sufixo (D-FS-06). É a "saída de áudio do jogo" em que
os critérios de US-0003 e US-0004 são observados.

O contrato só lê a simulação e a volta: `getLapState` e `repositionKart` (`race-lap-validation`),
`getHandlingTelemetry` e `Input` (`dirigibilidade`) e a situação de marca de pneu (`modelo-kart-01`) são
nomeados e não redefinidos. Nada aqui é lido pela simulação (I2).

## Operações

| Operação | Propósito | Quem chama |
|---|---|---|
| `getSoundOutput` | Lê o estado do som e o que está sendo pedido à saída de áudio para o motor e para o pneu | A tela ([SCR-0001](../screens/SCR-0001-controle-de-som-e-saida-de-audio.md)); as verificações |
| `setSoundOn` | Liga ou desliga o som do jogo | Só o controle de som, por ação do Jogador (AC-US-0003-09) |

## Auth

Sem sessão e sem conta (RNF10). Papel permitido nas duas operações: `player` (anônimo), único papel do
produto. Contrato deliberadamente público dentro do cliente: não há segredo a proteger, e o único estado
que `setSoundOn` muda é o do som na página aberta.

## Parâmetros

Nenhum parâmetro de caminho ou de consulta.

## Corpo do pedido de `setSoundOn`

| Campo | Tipo | Unidade | Obrigatório | Padrão e restrições |
|---|---|---|---|---|
| `soundOn` | booleano | — | sim | o estado final pedido: verdadeiro liga, falso desliga. Sem padrão: o pedido sempre diz o estado final, nunca "alternar" |

`getSoundOutput` não tem corpo.

## Resposta de `getSoundOutput`

| Campo | Tipo | Unidade | Obrigatório | Padrão e restrições |
|---|---|---|---|---|
| `soundOn` | booleano | — | sim | falso na abertura e em toda recarga (AC-US-0003-08); só `setSoundOn` o muda. É o "som ligado" que o jogo já tinha e que o som da zebra de `pista-kart-park` lê: mesmo nome, mesmo significado |
| `engineSoundAvailable` | booleano | — | sim | verdadeiro quando a gravação do motor foi carregada e o navegador tem saída de áudio; falso com o arquivo ausente ou ilegível ou sem áudio |
| `tireSoundAvailable` | booleano | — | sim | o mesmo, para a gravação do pneu |
| `engineSoundState` | enum `ENGINE_SILENT`, `ENGINE_PLAYING` | — | sim | pela tabela de [RULE-0001](../rules/RULE-0001-estado-do-som-e-som-do-motor.md); `ENGINE_SILENT` na abertura |
| `enginePitchRatio` | número | razão, sem dimensão | sim | razão entre o tom com que a gravação do motor é tocada e o tom original da gravação; maior que 0; valor maior é tom mais agudo. O sufixo `Ratio` diz a grandeza, por não haver unidade SI. Com `ENGINE_SILENT`, guarda o último valor ou 1 |
| `engineGainNorm` | número | fração de 0 a 1 | sim | ganho pedido à saída de áudio para o motor; 0 é silêncio; maior que 0 em `ENGINE_PLAYING` passado o prazo de 50 ms; 0 em `ENGINE_SILENT` passado o prazo de 200 ms, e a partir da ação quando o som é desligado |
| `tireSoundState` | enum `TIRE_SILENT`, `TIRE_PLAYING` | — | sim | pela tabela de [RULE-0002](../rules/RULE-0002-som-de-pneu.md); `TIRE_SILENT` na abertura |
| `tireGainNorm` | número | fração de 0 a 1 | sim | ganho pedido à saída de áudio para o pneu; 0 é silêncio; maior que 0 em `TIRE_PLAYING`; 0 em `TIRE_SILENT` passado o prazo de 200 ms, e a partir da ação quando o som é desligado |

Todos os campos são obrigatórios. Os campos são novos e nenhum padrão muda comportamento: na abertura
`soundOn` é falso e os dois ganhos são 0, isto é, o jogo abre em silêncio como antes da feature (I4). Nenhum
campo carrega dado pessoal (I6). `engineGainNorm` e `tireGainNorm` não são controle de volume: o Jogador não
os ajusta.

Resposta na forma vazia: não existe. Antes de qualquer volta e antes de o som ser ligado, a operação devolve
todos os campos com `soundOn` falso, `ENGINE_SILENT`, `TIRE_SILENT` e ganhos 0.

## Resposta de `setSoundOn`

Os mesmos campos de `getSoundOutput`, lidos depois de o pedido ter efeito.

## Erros

Não há status HTTP. Nenhuma das duas operações rejeita, lança ou altera a simulação; as condições anormais
aparecem nos campos:

| Condição | Operação | Como aparece | Corpo |
|---|---|---|---|
| Arquivo do som do motor ausente ou ilegível | as duas | `engineSoundAvailable` falso; `ENGINE_SILENT`; `engineGainNorm` 0 | os campos normais |
| Arquivo do som de pneu ausente ou ilegível | as duas | `tireSoundAvailable` falso; `TIRE_SILENT`; `tireGainNorm` 0 | os campos normais |
| Navegador sem saída de áudio | as duas | os dois campos de disponibilidade falsos; `setSoundOn` muda `soundOn` como pedido e nenhum som toca | os campos normais |
| Navegador que só libera áudio depois de um gesto | `setSoundOn` | o pedido vem da ação do Jogador, que é o gesto; nenhuma condição de erro | os campos normais |
| `setSoundOn` sem o campo `soundOn`, ou com valor que não é booleano | `setSoundOn` | pedido ignorado; `soundOn` não muda | os campos normais, inalterados |
| `setSoundOn` pedido por algo que não é ação do Jogador no controle de som | `setSoundOn` | não é um caso de erro do contrato: é proibido por [FEAT-0003](../features/FEAT-0003-som-do-motor-gravado.md) (AC-US-0003-09) | — |

## Idempotência

- `getSoundOutput`: leitura pura. Repetir a chamada não altera estado; enquanto nenhum passo avança e
  nenhum prazo corre, devolve os mesmos valores.
- `setSoundOn`: idempotente sem chave. O pedido carrega o estado final; repetir o mesmo pedido, ou pedir o
  estado em que o som já está, não muda nada e não reinicia nenhum som. Dois pedidos em sequência valem
  pela ordem de chegada: o último decide.
- Recarga da página: `soundOn` volta a falso; o estado não é guardado. Abandono e perda de foco não mudam
  `soundOn`. Nenhuma das operações consome tentativa nem registra resultado (D-FS-04).

## Paginação e sondagem

Sem paginação. A tela lê `getSoundOutput` quando desenha o controle de som; as verificações leem a cada
quadro apresentado ou a cada passo de `STEP`. Não há sondagem de rede: o contrato roda sem rede (D-FS-08).

## Compatibilidade

| Mudança | Tratamento |
|---|---|
| `getSoundOutput`, `setSoundOn` e os seus campos | Contrato novo. Nenhum campo, caminho ou parâmetro publicado é renomeado ou removido |
| `soundOn` | Nomeia, sem mudar o significado, o estado ligado ou desligado que o jogo já tinha; o som da zebra de `pista-kart-park` continua lendo o mesmo estado (NFR-0007) |
| Tom sintetizado do motor | Retirado: a gravação entra no seu lugar (AC-US-0003-10). Não era contrato publicado nem campo; não há nome antigo a rejeitar |
| Som da zebra | Inalterado: nenhum campo deste contrato o descreve nem o comanda |
| `getLapState`, `repositionKart`, `getHandlingTelemetry`, `Input`, `STEP`, `simStepCount` | Inalterados: este contrato só os lê |
| Significado ou unidade de um campo | Nunca muda sob o mesmo nome; uma mudança futura exige nome novo (I3) |
