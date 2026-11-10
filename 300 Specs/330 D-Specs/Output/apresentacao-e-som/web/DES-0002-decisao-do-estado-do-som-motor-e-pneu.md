---
id: DES-0002
title: Decisão do estado do som, do motor e do pneu
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.0.0
sources: [FEAT-0003, FEAT-0004, API-0002, RULE-0001, RULE-0002, REQ-FEAT-0003-01, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-04, REQ-FEAT-0003-05, REQ-FEAT-0003-06, REQ-FEAT-0003-07, REQ-FEAT-0003-08, REQ-FEAT-0003-09, REQ-FEAT-0003-12, REQ-FEAT-0004-01, REQ-FEAT-0004-02, REQ-FEAT-0004-03, REQ-FEAT-0004-04, REQ-FEAT-0004-05, REQ-FEAT-0004-07]
---

# DES-0002 — Decisão do estado do som, do motor e do pneu

## Realiza

As tabelas de decisão de RULE-0001 e RULE-0002 e os 8 campos de `getSoundOutput` (API-0002): quando o motor
toca, com que tom e com que intensidade (REQ-FEAT-0003-01 a -07, -12; AC-US-0003-01 a -07); o estado inicial
do som (REQ-FEAT-0003-08, -09; AC-US-0003-08, -09); quando o pneu toca e quando silencia (REQ-FEAT-0004-01 a
-05, -07; AC-US-0004-01 a -05).

## Posicionamento

Camada **aplicação**: `src/soundOutput.ts`, **módulo novo**, puro — sem DOM, sem Web Audio, sem leitura de
relógio (o instante chega como argumento) e sem sorteio. Importa só o tipo `LapPhase` de `src/lap.ts`.

Motivo de ser novo: a decisão é o ponto de observação de quase todos os critérios de US-0003 e US-0004, e tem
de ser verificada em `npm test`, onde `src/main.ts` não carrega e `src/audio.ts` depende de Web Audio. É o
mesmo motivo que criou `src/curbFeedback.ts`. Não é simulação: D-DS-07 não se aplica, mas a função é
determinística pelo mesmo desenho — mesmas entradas, mesma saída.

## Interface

```ts
export type EngineSoundState = 'ENGINE_SILENT' | 'ENGINE_PLAYING';
export type TireSoundState = 'TIRE_SILENT' | 'TIRE_PLAYING';
export type SoundOutput = {
  soundOn: boolean; engineSoundAvailable: boolean; tireSoundAvailable: boolean;
  engineSoundState: EngineSoundState; enginePitchRatio: number; engineGainNorm: number;
  tireSoundState: TireSoundState; tireGainNorm: number;
};
export type SoundReading = {
  nowMs: number; lapPhase?: LapPhase; repositionAcceptedAtMs?: number;
  simStepCount?: number; speedMps: number; throttleNorm: number; tireMarkingAsphalt: boolean;
};
export type SoundDecisionInput = SoundReading & { soundOn: boolean; engineSoundAvailable: boolean; tireSoundAvailable: boolean };
export type SoundDecisionState = {
  output: SoundOutput;
  stepReading?: { simStepCount: number; speedMps: number; throttleNorm: number; tireMarkingAsphalt: boolean };
};
export function initialSoundDecision(): SoundDecisionState;
export function decideSoundOutput(state: SoundDecisionState, input: SoundDecisionInput): SoundDecisionState;
```

`SoundOutput` tem exatamente os 8 campos de API-0002, com os mesmos nomes; nenhum campo a mais.

| Entrada | Unidade | Significado |
|---|---|---|
| `nowMs` | ms | instante da avaliação, no relógio do quadro; só é comparado com `repositionAcceptedAtMs` |
| `lapPhase` | — | `lapPhase` de `getLapState`; ausente sem volta |
| `repositionAcceptedAtMs` | ms | instante, no mesmo relógio, do último `repositionKart` aceito; ausente se nunca houve |
| `simStepCount` | passos | contador do último passo avançado (`getHandlingTelemetry`); ausente sem kart |
| `speedMps` | m/s | `speedMps` do último passo avançado |
| `throttleNorm` | fração de 0 a 1 | o campo `throttle` do `Input` entregue ao último passo avançado |
| `tireMarkingAsphalt` | — | o quadro desenhou um trecho novo de marca de pneu e há roda traseira no asfalto ([DES-0003](DES-0003-saida-de-audio-gravacoes-e-controle-de-som.md)) |
| `soundOn`, `engineSoundAvailable`, `tireSoundAvailable` | — | o estado do som e a disponibilidade de cada gravação, dados por `RaceAudio` |

Constantes exportadas:

| Constante | Valor | Unidade | Uso |
|---|---|---|---|
| `ENGINE_PITCH_IDLE_RATIO` | 0,8 | razão | tom com o kart parado |
| `ENGINE_PITCH_TOP_RATIO` | 2,0 | razão | tom na velocidade de referência ou acima |
| `ENGINE_PITCH_TOP_SPEED_MPS` | 32 | m/s | velocidade de referência; acima de toda `governorSpeed` publicada (`src/physics.ts:59`, `:69`, `:81`) |
| `ENGINE_GAIN_IDLE_NORM` | 0,35 | fração | intensidade com o acelerador solto |
| `ENGINE_GAIN_FULL_NORM` | 0,70 | fração | intensidade com o acelerador todo pressionado |
| `TIRE_GAIN_NORM` | 0,50 | fração | intensidade do pneu; constante (RULE-0002 não pede variação) |
| `SOUND_FADE_IN_MS` | 10 | ms | duração da subida do ganho, usada por `RaceAudio` |
| `SOUND_FADE_OUT_MS` | 80 | ms | duração da descida do ganho e do silêncio do reposicionamento |

### Leitura do passo

- `simStepCount` ausente: `stepReading` fica ausente.
- `simStepCount` diferente do guardado (maior, ou menor depois de um reposicionamento ou de uma volta nova):
  `stepReading` passa a ser `{simStepCount, speedMps, throttleNorm, tireMarkingAsphalt}` da entrada, com
  `speedMps` limitado a 0 ou mais e `throttleNorm` limitado a 0–1 (I4).
- `simStepCount` igual ao guardado: `stepReading` não muda e os três valores da entrada são ignorados. É o que
  torna inofensivos o quadro sem passo novo e a leitura repetida do mesmo passo.

### Motor — primeira linha que vale (RULE-0001)

| # | Condição | `engineSoundState` | `engineGainNorm` |
|---|---|---|---|
| 1 | `soundOn` falso | `ENGINE_SILENT` | 0 |
| 2 | `engineSoundAvailable` falso | `ENGINE_SILENT` | 0 |
| 3 | `lapPhase` é `RUNNING`, há `stepReading`, e não há reposicionamento em execução | `ENGINE_PLAYING` | `ENGINE_GAIN_IDLE_NORM + (ENGINE_GAIN_FULL_NORM − ENGINE_GAIN_IDLE_NORM) × throttleNorm` |
| 4, 5 | qualquer outra | `ENGINE_SILENT` | 0 |

Reposicionamento em execução: `repositionAcceptedAtMs` presente e `nowMs < repositionAcceptedAtMs +
SOUND_FADE_OUT_MS`. É função do estado corrente, não de uma borda: reavaliar no mesmo instante dá o mesmo
resultado, e o motor só volta a `ENGINE_PLAYING` depois dos 80 ms em que o ganho chegou a 0.

`enginePitchRatio`, só recalculado na linha 3: `ENGINE_PITCH_IDLE_RATIO + (ENGINE_PITCH_TOP_RATIO −
ENGINE_PITCH_IDLE_RATIO) × min(speedMps / ENGINE_PITCH_TOP_SPEED_MPS, 1)`. Nas outras linhas guarda o último
valor; o valor inicial é 1.

| Verificação das desigualdades | Valor |
|---|---|
| `enginePitchRatio` a 5 m/s | 0,9875 |
| `enginePitchRatio` a 20 m/s | 1,55 — estritamente maior (REQ-FEAT-0003-02) |
| `engineGainNorm` com o acelerador solto | 0,35 — maior que 0 com o kart parado (REQ-FEAT-0003-01) |
| `engineGainNorm` com o acelerador pressionado | 0,70 — estritamente maior, em qualquer velocidade (REQ-FEAT-0003-03) |

O tom depende só da velocidade e a intensidade só do acelerador; assim "o mesmo acelerador" e "a mesma
velocidade" dos critérios valem para qualquer par de leituras.

### Pneu — primeira linha que vale (RULE-0002)

| # | Condição | `tireSoundState` | `tireGainNorm` |
|---|---|---|---|
| 1 | `soundOn` falso | `TIRE_SILENT` | 0 |
| 2 | `tireSoundAvailable` falso | `TIRE_SILENT` | 0 |
| 3 | há `stepReading` com `tireMarkingAsphalt` verdadeiro, e `lapPhase` presente e diferente de `PAUSED` e de `ENDED` | `TIRE_PLAYING` | `TIRE_GAIN_NORM` |
| 4 a 7 | qualquer outra (deixou de marcar, parado, sem deslizar, fora do asfalto) | `TIRE_SILENT` | 0 |

O pneu não tem linha de reposicionamento: depois de um `repositionKart` aceito o próximo passo lido já não
está na situação de marca, e vale a linha 4.

### Ganho pedido e prazos

`engineGainNorm` e `tireGainNorm` são o **alvo** pedido à saída de áudio na avaliação: passam a 0 na mesma
avaliação em que o estado vira silêncio, e a maior que 0 na mesma avaliação em que vira tocando. A rampa até
o alvo é de `RaceAudio` ([DES-0003](DES-0003-saida-de-audio-gravacoes-e-controle-de-som.md)): 10 ms para
subir, 80 ms para descer, imediata quando `soundOn` é falso. Os prazos de 50 ms e de 200 ms do F-Spec ficam
cobertos com folga, e o cálculo está em DES-0003.

## Colaboradores

- Chamado por `RaceAudio.refresh` e `RaceAudio.setSoundOn` (`src/audio.ts`), e pelos testes.
- Não chama ninguém. Não importa `three`, `src/audio.ts`, `src/main.ts` nem `src/physics.ts`.

## Estado e concorrência

O único estado é `SoundDecisionState`, devolvido pela função e guardado por quem chama; a função não tem
estado próprio. Repetição: a mesma entrada sobre o mesmo estado devolve o mesmo estado. Duplicata: o mesmo
`simStepCount` lido duas vezes não muda `stepReading`, não reinicia som e não conta um segundo deslize.
Ordem: vários passos entre dois quadros chegam como uma leitura só, a do último. Contador de sequência:
`simStepCount`, da simulação, só lido. Não há escrita de domínio: nenhuma tentativa é consumida, nenhum
resultado é registrado.

## Comportamento em falha

A função não lança e não rejeita. Entrada fora de faixa é limitada (I4): `speedMps` negativo ou não finito
vale 0, `throttleNorm` fora de 0–1 é limitado, `nowMs` não finito desliga a regra do reposicionamento. Som
indisponível aparece nos campos (linha 2 das duas tabelas), como API-0002 pede. Nada é registrado em log: não
há falha a relatar nem identificador a citar.

## Feature flag

Nenhuma: o F-Spec declara "Configuração: Nenhuma além do estado ligado ou desligado". O padrão é neutro
porque `soundOn` nasce falso e os dois ganhos nascem 0 — o jogo abre em silêncio, como antes (I4).

## Pontos em aberto

Nenhum.
