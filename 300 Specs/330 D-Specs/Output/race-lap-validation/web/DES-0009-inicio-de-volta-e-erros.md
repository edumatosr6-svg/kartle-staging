---
id: DES-0009
title: Início de volta, oferta de tipo e estados de erro
feature: race-lap-validation
stage: dspec
status: validated
version: 1.2.1
sources: [FEAT-0001, FEAT-0006, FEAT-0008, FEAT-0010, REQ-FEAT-0001-13, REQ-FEAT-0006-09, REQ-FEAT-0006-10, REQ-FEAT-0008-06, REQ-FEAT-0010-18]
---

# DES-0009 — Início de volta, oferta de tipo e estados de erro

## Realiza

Os `REQ-*` em `sources`: nenhuma opção de volta oficial e volta de treino pilotável numa pista de dado incompleto
(AC-US-0008-03, -04); controle por toque com estado visível quando o sensor falta ou a permissão é negada
(REQ-FEAT-0001-13); erro exibido sem volta quando o dado é ilegível ou de esquema desconhecido
(REQ-FEAT-0008-11); a volta à oferta depois do encerramento do treino, sem nenhuma volta iniciada
(AC-US-0010-18). Telas: SCR-0002 (oferta) e os estados Carregando, Vazio, Erro, Permissão negada e Treino encerrado
de SCR-0001. Fluxos: FLOW-0004 e FLOW-0005, passo 13.

## Posicionamento

`index.html`, `src/style.css` e `src/main.ts`, camada **aplicação**. O painel de boas-vindas existente (`#welcome`)
passa a ser a oferta de volta; não há módulo novo. A lista de tipos oferecidos não é decidida aqui: vem de
`offeredLapKinds` ([DES-0005](../core/DES-0005-tipos-de-volta-e-reposicionamento.md)), na simulação.

## Interface

| Estado de SCR-0002 | Condição (`reading.trackDataStatus`) | O que o painel exibe |
|---|---|---|
| Carregando | antes da leitura (a leitura é síncrona e acontece na inicialização; o texto estático inicial é `loadingTrack`) | texto `loadingTrack`; nenhum botão de volta |
| Vazio | `UNREADABLE` | `noTrackAvailable`; nenhum botão de volta |
| Completo | `COMPLETE` | um botão por tipo em `offeredLapKinds(reading, [])`, que hoje é só `startTraining` ("treino": inicia um treino de voltas seguidas com uma única contagem, FEAT-0010) |
| Incompleto | `INCOMPLETE` | o mesmo, nunca `startOfficial`; a pista é pilotável como treino |
| Erro | `UNSUPPORTED_SCHEMA` ou `UNREADABLE` | `trackDataError`; nenhum botão; o dado de esquema desconhecido não é tocado |
| Permissão negada | `web-mobile` com inclinação não ativa | linha de texto `controlFallbackTouch`; os botões continuam |
| Offline | sem rede | idêntico ao online (nenhuma chamada de rede) |

Cada botão tem o texto bilíngue de `message()` e chama `beginLap` (`src/main.ts:296-297`), que inicia a volta por
`startTrainingLap` (`src/trainingSession.ts:81-87`, de `pista-kart-park`): esta chama `startLap(lap, {lapKind:
'TRAINING', trackId, trackVersion, setupId, setupVersion}, reading, config, environment)`, com `trackId` e
`trackVersion` copiados da leitura da sessão de treino (campos no mesmo nível) e `setupId` e `setupVersion` copiados
do acerto corrente da aplicação: o `PublishedSetup` que ela já guarda (`setup`, `src/main.ts:131`, um dos objetos de
`PUBLISHED_SETUPS` de `src/physics.ts`, trocado só pelo seletor `#handling-preset` fora de volta ou treino ativo,
`src/main.ts:320-331`) — o mesmo objeto de que `config` é derivada e cujo par a aplicação já guarda como `setupRef`
(`src/main.ts:165` e `:299`). A fonte é esse objeto, e não uma chamada a
`getSetupVersion` (`src/setupRecords.ts`): os dois valores são os que o dado publicado de `dirigibilidade` declara,
os mesmos que aquele contrato devolve, lidos sem chamá-lo. Como o objeto é publicado por construção, `UNKNOWN_SETUP`
não ocorre neste caminho (ver "Comportamento em falha").
Toda volta iniciada a partir desta mudança informa os dois campos, para que o seu resultado não seja lido pelos
padrões como um registro anterior (API-0002). A aplicação os encaminha sem interpretação e sem decidir nada com
eles; a rejeição `LAP_ALREADY_ACTIVE`
(escolher de novo com volta ativa), `OFFICIAL_NOT_AVAILABLE`, `TRACK_DATA_UNREADABLE` e `TRACK_SCHEMA_UNSUPPORTED`
não têm mensagem própria: são sem efeito e não são exibidas, como determina SCR-0001. Como o painel de oferta é
escondido durante a volta e a oferta nunca lista tipo não permitido, as rejeições só ocorrem por evento
duplicado.

O controle em `web-mobile` é escolhido antes de `startLap`: se `tilt` está ativo, a inclinação governa a direção;
senão o controle por toque, com o texto do estado de Permissão negada visível durante toda a volta
([DES-0008](DES-0008-hud-da-volta-mensagens-e-idioma.md), `#lap-control-fallback`). A tentativa de ativar a inclinação
sem permissão ou sem contexto seguro (`$('tilt').onclick` existente) deixa `tilt` desativado e cai nesse estado.
A contagem e as regras não mudam.

O painel `#welcome` reaparece com a oferta quando uma volta oficial ou de reconhecimento chega a `ENDED` e o Jogador
sai da tela de resultado (SCR-0003 → SCR-0002), com o botão `newLap`. No treino, o painel reaparece no instante em que
`endTraining` é aceito (`emitEndTraining`, [DES-0007](DES-0007-integracao-da-aplicacao.md)), sem passar pela tela de
resultado; o fim de uma volta do treino não reabre a oferta. Com o treino em `ENDED`, nenhum passo avança e nenhuma
volta começa até o Jogador escolher de novo (REQ-FEAT-0010-18); a nova escolha cria outra sessão, com `results` vazia e
sem melhor volta válida (REQ-FEAT-0010-32).

## Colaboradores

Chama `offeredLapKinds`, `startLap` (`src/lap.ts`) e `message` (`src/lapMessages.ts`); lê o acerto corrente do
`PublishedSetup` que a aplicação guarda, vindo de `PUBLISHED_SETUPS` (`src/physics.ts`, dado publicado de
`dirigibilidade`, camada Simulação — sentido permitido, aplicação para simulação). Não chama `src/setupRecords.ts`
neste caminho: `getSetupVersion` não é usado para iniciar a volta. Chamado por `src/main.ts`.

## Estado e concorrência

Sem estado próprio além de "oferta visível ou não", derivado da fase da volta. Idempotência: clicar duas vezes num
botão encontra a volta já ativa e recebe `LAP_ALREADY_ACTIVE` sem efeito; o painel é escondido na primeira
aceitação. Nenhum dado é gravado.

## Comportamento em falha

Erro de leitura: sem botões e com texto; nenhuma volta é criada (`TRACK_DATA_UNREADABLE`,
`TRACK_SCHEMA_UNSUPPORTED`). Sensor negado: recai para toque, com estado visível. Acerto: `UNKNOWN_SETUP` não ocorre
neste caminho — `setupId` e `setupVersion` são lidos do `PublishedSetup` corrente que a aplicação guarda, nunca de
uma chamada a `getSetupVersion` com um id livre — e nenhuma rejeição, aviso ou bloqueio é acrescentado por eles:
`startLap` os copia sem interpretação (API-0002) e o caminho solo não depende deles (I4). Rede: não usada. Registro:
os avisos de DES-0006, só com identificadores.

## Determinismo (D-DS-07)

Não é código de simulação. Provas: a decisão do que se oferece é testada na simulação
(`tests/lap-kinds.test.ts`, `offeredLapKinds` por status) e a escolha de texto em `tests/lap-messages.test.ts`; o
comportamento da tela (botão ausente em dado incompleto, texto de erro, texto de fallback) é verificado no teste
registrado de navegador e de aparelho (test-strategy).

## Feature flag

Nenhuma: FEAT-0006 e FEAT-0008 não têm chave. A oferta de volta oficial depende do desafio diário (outra feature) e,
sem ele, a lista nunca a inclui.

## Pontos em aberto

Nenhum.
