---
id: ADR-0003
title: Escolhas que o F-Spec deixa para o projeto
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0002, RULE-0001, RULE-0002, API-0002, API-0003, REQ-FEAT-0002-04, REQ-FEAT-0003-02, REQ-FEAT-0003-03, REQ-FEAT-0003-06, REQ-FEAT-0004-01, REQ-FEAT-0005-01]
---

# ADR-0003 — Escolhas que o F-Spec deixa para o projeto

## Contexto

O F-Spec entrega ao D-Spec, em palavras, seis escolhas: o texto da descrição da prévia (FEAT-0002), a
marcação de cada declaração (API-0001), o formato e as dimensões da forma entregue (RULE-0003), a função que
leva a velocidade ao tom e o acelerador à intensidade (RULE-0001), e — implicitamente — como a apresentação
lê "a situação de marca de pneu no asfalto" e o "reposicionamento em execução". Cada uma tem consequência
fora de um item só; ficam registradas aqui, num lugar.

## Decisão

| # | Escolha | Valor | Por quê |
|---|---|---|---|
| 1 | Texto de `previewDescription` | "Corra contra o relógio em uma pista de kart e busque a sua melhor volta." | uma frase, em português, que descreve o que o jogo já faz hoje, sem prometer o que ainda não existe |
| 2 | Marcação das declarações | `rel="icon"`, `rel="apple-touch-icon"`, `og:title`, `og:description`, `og:image` | as que os navegadores e os serviços de prévia leem; tabela em [DES-0001](../web/DES-0001-arquivos-entregues-e-declaracoes-da-pagina.md) |
| 3 | Forma entregue | ícone PNG 192 × 192; capa JPEG 1200 × 670; sons copiados | PNG e JPEG são lidos por todo leitor de prévia e de ícone; 192 px serve à aba e ao atalho com um arquivo só; a capa mantém a proporção da origem ([DM-0001](../data/DM-0001-registro-de-origem-dos-arquivos-e-estado-do-som.md)) |
| 4 | Tom e intensidade do motor | lineares: tom só pela velocidade, de 0,8 a 2,0 até 32 m/s; intensidade só pelo acelerador, de 0,35 a 0,70 | a forma mais simples que satisfaz as duas desigualdades em todo o intervalo; valores em [DES-0002](../web/DES-0002-decisao-do-estado-do-som-motor-e-pneu.md) |
| 5 | Intensidade do pneu | constante, 0,50 | RULE-0002 não pede variação com o deslize |
| 6 | Situação de marca de pneu | o quadro desenhou um trecho novo (`skidIndex` avançou no bloco de marca) | é literalmente "a mesma situação em que a cena desenha um trecho novo", lida do efeito do bloco de `modelo-kart-01`, sem copiar os limiares e sem editar o bloco |
| 7 | "A marca é no asfalto" | ao menos uma das duas rodas traseiras em `'ASPHALT'`, por `getTrackContact` | as marcas são desenhadas sob as rodas traseiras; com uma na zebra e outra no asfalto há marca no asfalto, e os dois sons podem tocar juntos (RULE-0002) |
| 8 | "Reposicionamento em execução" | os 80 ms seguintes a um `repositionKart` aceito | `repositionKart` mantém `lapPhase` em `RUNNING` (`src/lap.ts:188-201`); sem uma janela própria o motor nunca silenciaria. 80 ms é o tempo da descida do ganho: o motor só volta depois de ter chegado ao silêncio (RULE-0001) |
| 9 | Ganho pedido | `engineGainNorm` e `tireGainNorm` são o alvo da avaliação, não o valor instantâneo da rampa | o alvo é função do estado corrente e verificável em `npm test`; a rampa é propriedade da saída de áudio, com duração fixa |
| 10 | `soundOn` sem saída de áudio | `getSoundOutput().soundOn` segue o pedido; `RaceAudio.soundOn()` (lido pela zebra) continua exigindo o contexto rodando | API-0002 pede que o estado mude como pedido; a leitura da zebra é de `pista-kart-park` e não muda (REQ-FEAT-0005-11) |
| 11 | "3 MB" | 3.000.000 bytes | a leitura mais estrita das duas possíveis |
| 12 | "Bytes comprimidos" | soma do gzip de cada arquivo do download inicial | é a medida compatível com a linha de base de 186.291 bytes do F-Spec: HTML, JS e CSS do `dist/` de hoje somam 186.783 bytes em gzip de nível máximo, medidos nesta rodada |
| 13 | Linha de base de `SIM_STATE_UNCHANGED` | `tests/fixtures/kart01-sim-baseline.json`, de 2026-10-30 | é anterior à feature, já guarda o estado final de execuções de referência e é verificada a cada `npm test`; gravar outra duplicaria o dado |
| 14 | Prazo de carregamento de um som | nenhum; escolha retirada em 2026-11-10 (era 8.000 ms) | as gravações chegam embutidas no JS do download inicial ([ADR-0001](ADR-0001-arquivos-versionados-e-pedidos-pelo-documento.md)): não há carregamento separado a que dar prazo. "Tempo esgotado ao carregar o som na abertura" coincide com o JS não chegar, e então o jogo não abre |

## Alternativas consideradas

| Escolha | Alternativa | Por que não |
|---|---|---|
| 4 | manter a parcela do acelerador no tom, como o tom sintetizado de hoje (`src/audio.ts:51`) | nenhum critério pede; com o tom só pela velocidade, "o mesmo acelerador" vale para qualquer par de leituras |
| 6 | extrair a condição (`speedMps > 6`, `sideslipRad > 0.055`) para um módulo puro lido pela cena e pelo som | exigiria editar o bloco de `modelo-kart-01` e o teste que o extrai do texto de `src/main.ts`; é mudança de outra feature |
| 6 | repetir os limiares na decisão do som | redefine uma situação que o F-Spec manda nomear e não redefinir; os dois lados poderiam divergir |
| 7 | exigir as duas rodas traseiras no asfalto | calaria o pneu com uma roda na zebra, caso que RULE-0002 descreve como os dois sons juntos |
| 8 | silêncio até o primeiro passo depois do reposicionamento | o passo seguinte chega em 8 ms; o ganho não teria chegado a 0 |
| 13 | gravar linha de base nova por script | script e arquivo a mais para o mesmo conteúdo |

## Consequências

- Os valores 4, 5 e 8 são constantes exportadas; mudá-los é mudança de projeto, registrada no changelog. A
  escolha 14 não deixa constante: `SOUND_LOAD_TIMEOUT_MS` saiu do projeto.
- A escolha 6 liga o som ao que a cena desenha: o primeiro passo de um deslize não desenha trecho (não há
  ponto anterior) e portanto não toca; o som começa no segundo passo, 8 ms depois.
- A escolha 6 depende de `skidIndex` continuar sendo avançado só quando um trecho é desenhado. Se
  `modelo-kart-01` mudar o bloco, esta leitura muda junto: é a dependência que o F-Spec declara.
- A escolha 10 deixa dois valores com o nome "som ligado" que só diferem sem saída de áudio; está documentada
  em [DES-0003](../web/DES-0003-saida-de-audio-gravacoes-e-controle-de-som.md).

## Estado

Aceita.
