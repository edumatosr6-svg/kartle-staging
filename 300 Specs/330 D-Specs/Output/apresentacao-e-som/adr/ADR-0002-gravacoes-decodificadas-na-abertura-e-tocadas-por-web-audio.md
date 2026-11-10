---
id: ADR-0002
title: Gravações decodificadas na abertura e tocadas por Web Audio em repetição contínua
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.0.0
sources: [RULE-0001, RULE-0002, REQ-FEAT-0003-01, REQ-FEAT-0003-10, REQ-FEAT-0003-11, REQ-FEAT-0005-05, REQ-FEAT-0005-10]
---

# ADR-0002 — Gravações decodificadas na abertura e tocadas por Web Audio em repetição contínua

## Contexto

O motor passa de um oscilador (`src/audio.ts:32-36`) para uma gravação MP3 que precisa: tocar em até 50 ms
depois de o som ser ligado; repetir sem silêncio maior que 50 ms na emenda; mudar de tom com a velocidade;
silenciar em até 200 ms; funcionar sem rede depois de o jogo abrir; e não trazer dependência. O navegador só
libera a saída de áudio depois de um gesto, e o som abre desligado. Um MP3 decodificado costuma trazer
silêncio de preenchimento do codificador no começo e no fim — somados, podem passar de 50 ms.

## Decisão

1. **Decodificar na abertura, tocar no gesto.** Os bytes são lidos e decodificados na avaliação do módulo com
   `OfflineAudioContext`, que não precisa de gesto e não toca nada. O `AudioContext` continua nascendo só na
   ação do Jogador, como hoje. Quando o Jogador liga o som, os buffers já estão prontos.
2. **Fonte de buffer em repetição, nunca parada.** Cada gravação é um `AudioBufferSourceNode` com `loop`,
   iniciado uma vez; tocar e silenciar é só ganho. O motor de hoje já é assim (um oscilador sempre ligado
   atrás de um ganho).
3. **Limites de repetição nas bordas do som.** `findLoopBounds` acha a primeira e a última amostra audível
   do buffer; `loopStart` e `loopEnd` ficam nelas, de modo que o silêncio de preenchimento não entra na
   repetição, qualquer que seja o decodificador do navegador.
4. **Tom por `playbackRate`.** `enginePitchRatio` é a taxa de reprodução da fonte do motor.
5. **Rampas lineares com duração fixa** para o ganho (10 ms para subir, 80 ms para descer), e corte imediato
   quando o som é desligado.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Elemento `<audio loop>` | a emenda da repetição não é garantida sem silêncio, a troca de tom por `playbackRate` tenta preservar a altura por padrão e o controle do ganho é grosseiro |
| Decodificar só no gesto, com o `AudioContext` | a decodificação cairia dentro dos 50 ms do critério, e a disponibilidade do som só seria conhecida depois de o Jogador ligá-lo |
| Criar o `AudioContext` na abertura, suspenso | os navegadores avisam e alguns bloqueiam; o projeto já cria o contexto só no gesto |
| Cortar o silêncio de borda no arquivo | muda os bytes da gravação que o dono do produto aprovou como está (`DOMAIN/DEC-02`); a forma entregue deixa de ser cópia |
| Parar e reiniciar a fonte a cada silêncio | uma fonte de buffer não reinicia: cada retomada criaria nó novo e atrasaria o início |
| `setTargetAtTime` para o ganho, como hoje | aproxima-se de 0 e nunca chega; os critérios pedem ganho igual a 0 ao fim do prazo |
| Biblioteca de áudio | dependência de execução nova, proibida por REQ-FEAT-0005-10 |

## Consequências

- Os dois buffers decodificados ficam em memória enquanto a página está aberta (alguns segundos de áudio
  mono ou estéreo; da ordem de 1 a 2 MB).
- As duas fontes consomem processamento de áudio mesmo em silêncio, como o oscilador de hoje. O custo entra
  na medida de taxa de quadros dos roteiros de aparelho.
- Pode haver um estalo na emenda da repetição se as duas bordas não casarem. O dono do produto ouviu os sons
  e os aprovou como estão; nenhum critério trata de estalo, e este projeto não mistura nem suaviza a emenda.
- A ausência de silêncio maior que 50 ms **dentro** da gravação é propriedade do arquivo: não há decodificador
  de MP3 em `npm test`. A emenda é provada por `findLoopBounds` e pelo contexto de substituição; o que se ouve
  é conferido no roteiro de aparelho.
- O descritor `ENGINE_SOUND` de `pista-kart-park` muda de `'triangle'` para `'recording'`; o som da zebra
  continua sendo a única fonte `'noise'` e o único som que passa por filtro passa-baixa.
- Navegador sem `OfflineAudioContext` fica sem os dois sons e joga igual.

## Estado

Aceita.
