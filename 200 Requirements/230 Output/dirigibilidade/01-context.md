---
title: Contexto — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: req
status: validated
version: 4.2.0
sources: [SEED, DOMAIN]
---

# Contexto

## O que é a feature

O acerto padrão **Arcade assistido** do Kartle deve ser divertido de pilotar nos primeiros segundos: o
kart vira quando o Jogador manda, segura a curva em vez de sair de frente, acelera com vontade e transmite
velocidade e risco. A referência de sensação é **Karting Superstars** — direção direta e rápida, muita
aderência em alta velocidade, traseira viva mas que se segura (`SEED.md`, Visão geral; `DOMAIN/REF-01`).
Nada aqui muda o passo da simulação, a validação de volta nem o determinismo: o jogo continua um jogo de
tempo justo.

**Situação de partida (citada do seed, seção Contexto).** O Arcade usa hoje a mesma massa e o mesmo modelo
de pneu do kart de aluguel, com assistências (direção proporcional à velocidade, frenagem equilibrada,
amortecimento de derrapagem) e um motor acima da especificação do aluguel. Os ensaios atuais registrados em
`docs/physics.md`: 0–40 km/h em 3,21 s; 54,3 km/h após 5 s; velocidade estabilizada 79,4 km/h; volta do
piloto de teste em ~31,4 s na pista sintética. O dono do produto testou a build publicada e relatou
subesterço, resposta lenta e pouca sensação de velocidade (`DOMAIN/REF-01`). O acerto **Realista — aluguel
4T** continua existindo e não muda.

**O acerto C (revisão 4 do seed, `DOMAIN/DEC-15`).** Testando a staging, o dono do produto disse que "o
kart simplesmente não vira": com acelerador e esterço cheios, o menor raio do acerto anterior ficava entre
17 m e 25 m. Duas prévias foram publicadas na staging e ele escolheu a **C**, que a decisão de 2026-10-29
nomeia `arcade-assistido-v6`. No mesmo pedido, o drift e o turbo de `requirements/11` — carga segurando a
tecla, mini-turbo, combo e pontuação — saem do jogo. A decisão muda três coisas neste conjunto:

- a velocidade estabilizada em reta passa a ficar **entre 65 km/h e 72 km/h**, perto de um kart de aluguel
  de verdade, no lugar do piso de 105 km/h;
- a curva deixa de ser julgada no arco de raio 18 m — que não vale para um kart que faz curva mais fechada
  que o arco — e passa a ser julgada pelo **raio da trajetória na pista de teste aberta** (US-0002);
- não existe manobra de drift nem turbo (US-0003), e a condução normal é observada na volta do piloto de
  teste na pista sintética.

Os valores medidos que a decisão registra para o acerto C (69,3 km/h estabilizada; 0–60 km/h em 2,21 s;
raio ≈ 11,7 m com acelerador e esterço cheios a partir de 50 km/h; giro de 208° em 2 s sem acelerador a
partir de 50 km/h, `DOMAIN/DEC-16`; volta do piloto de teste em 23,05 s sem sair do asfalto) são informação do dono do produto sobre o acerto que ele escolheu, não limites: os limites
são os das histórias. Os valores de parâmetro do acerto que a decisão lista não entram neste conjunto
(ver `97-changelog.md`).

**Onde cada ensaio roda (`SEED/RD-06`, `DOMAIN/REF-03`, `DOMAIN/DEC-15`).** Os ensaios de resposta do
volante (US-0001), de raio em curva (US-0002) e de recuperação da traseira (US-0003) rodam em **ambiente de
ensaio próprio — a pista de teste aberta**, asfalto sem faixa e sem paredes —, não na pista sintética. Na
resposta do volante o kart parte em reta com a velocidade **mantida em 50 km/h pelo acelerador**, e o regime
da taxa de guinada é o valor estabilizado nessa condição (janela curta e estacionária); o seed não dá faixa
a essa reta. Só a volta do piloto de teste usa a pista sintética — no
ensaio de tempo de volta (US-0005) e no ensaio de condução normal (US-0003). O ambiente de ensaio não é dado
de pista publicado e não altera a pista sintética nem a validação de volta (`SEED/RE-04`, NFR-0008).

**Padrão seguro.** O seed não prevê chave para escolher entre o acerto antigo e o novo: o novo Arcade
assistido vale como padrão assim que a feature é entregue, declarado como nova versão de acerto
(`SEED/IM-I3I5`), de modo que nenhum tempo, replay ou resultado anterior é tratado como comparável. A tela
de seleção de acerto não recebe elemento novo nesta feature: continua oferecendo os acertos Arcade assistido
e Realista — aluguel 4T, e nenhum preset experimental extra é exposto no painel do jogo durante o ciclo de
acerto (`DOMAIN/DEC-10`).

**Revisão 5 do seed (`DOMAIN/DEC-16`, 2026-10-30).** Sem acelerador, a partir de 50 km/h com esterço
cheio, o acerto C já está a 4 km/h aos 3 s, e um raio medido nesse instante não mede nada: a curva sem
acelerador passa a ser julgada pelo giro, de pelo menos 180° em até 2 s (US-0002). A restrição de I2 passa
a dizer que as regras de pilotagem ficam na simulação (`src/physics.ts` e `src/maneuvers.ts`) e que retirar
da tela (HUD, resultado e texto compartilhado) o que mostrava o drift e o turbo é só remoção de exibição,
permitida (US-0003, NFR-0005).

Seed: `200 Requirements/220 Input/dirigibilidade/SEED.md`, `revision: 5`, `date: 2026-10-29`, autor
`eduardo.matos`. Camada de domínio durável: `DOMAIN.md` da mesma pasta, cujas decisões prevalecem sobre os
pontos em aberto correspondentes do seed. A entrada de 2026-10-29 "Acerto C e fim do drift e do turbo"
(`DOMAIN/DEC-15`) substitui o valor do ponto aberto 06 e os ensaios de esterço cheio no arco de raio 18 m
(pontos abertos 02 e 03 e o ensaio de início do subesterço), e mantém os pontos 01, 04, 05 e 07; a entrada
de 2026-10-30 (`DOMAIN/DEC-16`) fixa a medida da curva sem acelerador e o alcance da restrição de I2. A lista
"Riscos e incógnitas" do seed ainda cita, para os pontos 02, 03 e 06, os valores fechados antes; o corpo do
seed (US-2 e US-4) e `DOMAIN/DEC-15` concordam entre si e prevalecem. Este conjunto usa só os valores em
vigor.

## Atores e canais

| Ator | Canal | Papel nesta feature |
|---|---|---|
| Jogador | `web-desktop` | Pilota com teclado: entradas binárias (esterço cheio ou zero; acelerador cheio ou zero) |
| Jogador | `web-mobile` | Pilota com inclinação (esterço proporcional) e toque; com sensor ausente ou permissão negada, recai para toque com estado visível (I4) |
| Piloto de teste | nenhum canal (`npm run bench:handling`) | Volta determinística na pista sintética com comandos binários; é a régua de regressão desta feature |

Canal fora do escopo: `remote-wheel` (pós-MVP, I10; `SEED.md`, Fora do escopo). Nenhuma história deste
conjunto o cobre.

Em todas as histórias, os limites de resposta, aderência, raio, aceleração e velocidade são medidos no
**estado da simulação**, em tempo simulado (passos de `STEP`), a partir do valor normalizado de `Input` que o
adaptador de controle entrega (I2, I8). Por isso os mesmos limites valem para `web-desktop` e `web-mobile`:
o que muda entre os canais é o adaptador — teclado produz esterço 0 ou 1; inclinação produz esterço
proporcional entre −1 e 1; toque produz esterço binário no recuo do sensor. Onde um critério depende de
esterço parcial, a história diz o que vale só em `web-mobile`. Os ensaios na pista de teste alimentam a
simulação com a mesma forma de `Input` que os adaptadores produzem; o Jogador não pilota na pista de teste.

## Itens do seed e decisões de domínio (chave de rastreabilidade)

Os rótulos abaixo nomeiam os itens do seed e as decisões de `DOMAIN.md`, que não têm identificador próprio;
o `sources:` de cada história e de cada NFR cita os que estão em vigor. A matriz gerada
(`99-traceability.md`) liga cada rótulo aos itens deste conjunto.

| Rótulo | Item |
|---|---|
| `SEED/US-1` … `SEED/US-5` | As cinco histórias de usuário da seção Histórias de usuário, na ordem do seed |
| `SEED/RD-01` | Direção comum permanece fácil; não há drift nem turbo (decisão do dono do produto, 2026-10-29, substitui `requirements/11`) |
| `SEED/RD-02` | Realista permanece sem assistências arcade e não muda (`requirements/10`, README) |
| `SEED/RD-03` | Passo fixo `STEP`, solver e significado de `Input` não mudam (I8) |
| `SEED/RD-04` | Mudar acerto que altera tempos é mudança versionada (I3) |
| `SEED/RD-05` | Sensação alvo: Karting Superstars — direção direta, aderência alta em velocidade, traseira viva controlável (decisão do dono do produto, 2026-10-21) |
| `SEED/RD-06` | Os ensaios de resposta do volante e de curva de referência rodam em ambiente de ensaio próprio (pista de teste), não na pista sintética; só o ensaio de volta do piloto de teste usa a pista sintética (revisão 3 do seed, 2026-10-21) |
| `SEED/NF-01` | Determinismo preservado: tempos idênticos em 100 % das execuções repetidas (RNF07) |
| `SEED/NF-02` | Custo por passo da simulação não aumenta mais de 10 % no bench (RNF03) |
| `SEED/NF-03` | Teclado e inclinação atendem, ambos, US-1 a US-4 |
| `SEED/NF-04` | Cada mudança registra parâmetros e resultados em `docs/physics.md` (I9) |
| `SEED/RE-01` | As regras de pilotagem ficam na simulação (`src/physics.ts` e `src/maneuvers.ts`); nada de regra de pilotagem em renderização ou controle (I2); retirar o drift e o turbo da tela (HUD, resultado e texto compartilhado) é só remoção de exibição, sem regra nova na renderização (revisão 5) |
| `SEED/RE-02` | `STEP`, solver de 480 Hz e `Input` não mudam (I8) |
| `SEED/RE-03` | O preset Realista não muda |
| `SEED/RE-04` | A validação de volta (`src/lap.ts`, `src/track.ts`) não muda |
| `SEED/IM-I2` | Toda a mudança na camada de simulação |
| `SEED/IM-I3I5` | Novo acerto declarado como versão; tempos antigos não comparáveis |
| `SEED/IM-I8` | Contrato de passo preservado; só os parâmetros mudam |
| `SEED/IM-I9` | Cada critério tem ensaio determinístico em `npm test` ou nos benches |
| `DOMAIN/REF-01` | Referência de sensação: Karting Superstars; sintomas relatados no acerto atual: sai de frente, lento ao volante, pouca sensação de velocidade e risco |
| `DOMAIN/REF-02` | Acerto agressivo (revisão 2 do seed, 2026-10-21): origem dos valores em vigor dos pontos 01, 05 e 07 (180 ms / 250 ms; 2,5 s; 25 s); os seus valores dos pontos 02 e 06 foram substituídos por `DOMAIN/DEC-15` |
| `DOMAIN/REF-03` | Correção de fato e método dos ensaios (revisão 3 do seed, 2026-10-21): o ensaio de resposta do volante roda em reta da pista de teste com a velocidade mantida em 50 km/h pelo acelerador, e o regime é o valor estabilizado nessa condição (janela curta e estacionária); o ensaio de volta do piloto de teste roda na pista sintética, que não tem curva de 18 m (raios mínimos 24 m e 25 m, grampo de 4 m). A parte sobre o arco de raio 18 m foi substituída por `DOMAIN/DEC-15` |
| `DOMAIN/DEC-01` | Resposta do volante: em reta da pista de teste, com a velocidade mantida em 50 km/h pelo acelerador, a taxa de guinada atinge 90 % do regime em no máximo 180 ms após esterço cheio; ao soltar, cai a 10 % em no máximo 250 ms (mantido por `DOMAIN/DEC-15`) |
| `DOMAIN/DEC-04` | Ao reduzir o esterço com a traseira solta, o kart volta a `grip` em no máximo 400 ms (mantido por `DOMAIN/DEC-15`) |
| `DOMAIN/DEC-05` | 0–60 km/h em no máximo 2,5 s, piloto de 75 kg (mantido por `DOMAIN/DEC-15`) |
| `DOMAIN/DEC-07` | O piloto de teste completa a volta sintética sem sair do asfalto em no máximo 25 s (hoje ~31,4 s) (mantido por `DOMAIN/DEC-15`) |
| `DOMAIN/DEC-08` | Rodada de teste do dono do produto na build antes de fechar a feature; os números são necessários, não suficientes |
| `DOMAIN/DEC-09` | O ensaio de resposta do volante (reta a 50 km/h mantidos, esterço cheio) mede só o tempo de resposta da taxa de guinada; `understeer` transitório nesse ensaio é aceitável. A aderência em curva, que essa decisão mandava julgar no arco de 18 m, passa a ser julgada pelo raio na pista de teste aberta (`DOMAIN/DEC-15`) |
| `DOMAIN/DEC-10` | Ciclo de teste do ponto 08: cada rodada de código é publicada em staging; o dono do produto testa e devolve feedback curto (vira? acelera? traseira?); os presets são iterados dentro do pipeline até a aprovação dele; nenhum preset experimental extra no painel |
| `DOMAIN/DEC-15` | Acerto C e fim do drift e do turbo (2026-10-29, dono do produto): o acerto Arcade passa a ser o acerto C (`arcade-assistido-v6`); velocidade estabilizada entre 65 km/h e 72 km/h no lugar de 105 km/h; a curva passa a ser julgada pelo raio na pista de teste aberta (US-2 do seed) no lugar dos ensaios de esterço cheio no arco de 18 m; drift e turbo de `requirements/11` (carga segurando a tecla, mini-turbo, combo e pontuação) retirados; pontos 01, 04, 05 e 07 mantidos |
| `DOMAIN/DEC-16` | Curva sem acelerador e onde a retirada do drift acontece (2026-10-30, revisão 5 do seed): sem acelerador a partir de 50 km/h com esterço cheio, o critério é o giro de pelo menos 180° em até 2 s (medido no acerto C: 82° no primeiro segundo, 208° em 2 s, 4 km/h aos 3 s), não um raio aos 3 s; a retirada do drift e do turbo inclui a sua exibição (HUD, resultado, texto compartilhado), e a restrição de I2 vale para regras de pilotagem, não para essa remoção |

**Decisões substituídas e não aplicadas.** As entradas de `DOMAIN.md` abaixo não são citadas por nenhum
item deste conjunto, porque `DOMAIN/DEC-15` as substituiu; os seus rótulos não são reutilizados:
`DOMAIN/DEC-02` (50 km/h no arco de raio 18 m), `DOMAIN/DEC-03` (200 ms de `understeer` nesse arco),
`DOMAIN/DEC-06` (105 km/h), `DOMAIN/DEC-11` (fim da varredura de início do subesterço), `DOMAIN/DEC-12`
(início do subesterço num acerto que não sai de frente), `DOMAIN/DEC-13` (arco com acelerador zero),
`DOMAIN/DEC-14` (onde o subesterço é medido no arco com acelerador zero), `DOMAIN/REF-04` (método da
varredura em patamares) e `DOMAIN/REF-05` (leitura de "sem subesterço" no arco).

## Decisões de domínio aplicadas

| Decisão | Histórias e NFRs |
|---|---|
| `DOMAIN/DEC-01` | US-0001 |
| `DOMAIN/DEC-04` | US-0003 |
| `DOMAIN/DEC-05` | US-0004 |
| `DOMAIN/DEC-07` | US-0005 |
| `DOMAIN/DEC-08` | Critério final humano, fora dos critérios de aceite (ver abaixo) |
| `DOMAIN/DEC-09` | US-0001 (critério 05) |
| `DOMAIN/DEC-10` | Ciclo de fechamento humano (ver abaixo); US-0005 (caso anormal de rodada reprovada em staging) |
| `DOMAIN/DEC-15` | US-0001 (critério 05: onde a aderência em curva é julgada), US-0002 (raio na pista de teste aberta), US-0003 (sem drift nem turbo; condução normal na volta do piloto de teste), US-0004 (velocidade estabilizada entre 65 km/h e 72 km/h), US-0005 (nova versão de acerto); `02-glossary.md` |
| `DOMAIN/DEC-16` | US-0002 (critério 09: giro em até 2 s), US-0003 (critérios 09 e 11: remoção da exibição do drift e do turbo na tela e no texto compartilhado), NFR-0004, NFR-0005; `02-glossary.md` ("Giro") |
| `DOMAIN/REF-02` | US-0001, US-0005 (origem dos valores em vigor dos pontos 01 e 07) |
| `DOMAIN/REF-03`, `SEED/RD-06` | US-0001, US-0002 e US-0003 (pista de teste aberta; em US-0001, partida em reta), US-0003 e US-0005 (pista sintética), NFR-0004 (ambiente de cada ensaio registrado) |

**Ponto aberto 08 — critério final humano.** O dono do produto decidiu que a sensação é subjetiva: os
critérios numéricos deste conjunto são necessários, não suficientes, e uma rodada de teste dele na build
publicada precede o fechamento da feature (`DOMAIN/DEC-08`). O ciclo é o de `DOMAIN/DEC-10`: cada rodada
de código vai para staging, o dono do produto responde curto (vira? acelera? traseira?) e os presets são
iterados dentro do pipeline — nova rodada de código e testes — até a aprovação dele, sem preset
experimental extra no painel. Esse critério não é observável pelo sistema, por isso não vira critério de
aceite nem bloqueia esta etapa; ele é registrado aqui e no changelog como condição de fechamento de
responsabilidade do dono do produto, a ser cumprida depois da etapa de testes.

## Restrições (citadas do seed, seção Restrições)

- "As regras de pilotagem ficam na simulação (`src/physics.ts` e `src/maneuvers.ts`); nada de regra de
  pilotagem em renderização ou controle (I2). Motivo: a simulação roda sem DOM e no servidor futuro.
  Retirar o drift e o turbo também tira da tela (HUD, resultado e texto compartilhado) o que mostrava os
  dois; isso é só remoção de exibição, sem regra nova na renderização." — NFR-0005, US-0003.
- "`STEP`, solver de 480 Hz e `Input` não mudam (I8). Motivo: contrato de todos os replays." — NFR-0006.
- "O preset Realista não muda. Motivo: é a referência física documentada." — NFR-0007.
- "A validação de volta (`src/lap.ts`, `src/track.ts`) não muda. Motivo: feature própria já validada." —
  NFR-0008.

## Relação com a feature `race-lap-validation`

O conjunto validado de `race-lap-validation` exige, para a entrega daquela feature, que física e presets
não mudem (NFR-0011 daquele conjunto). A exigência é escopada à entrega daquela feature; esta feature muda
o preset Arcade assistido como mudança versionada (`SEED/RD-04`, NFR-0009) e deixa a validação de volta
intacta (NFR-0008). A pista de teste dos ensaios de US-0001 a US-0003 é ambiente de ensaio, não pista
publicada: não cria pista nova (`SEED.md`, Fora do escopo) nem toca a pista sintética. Nenhum feedback é
enviado àquela feature: nenhum requisito dela precisa mudar.

## Famílias de requisitos não funcionais

| Família | Tratamento |
|---|---|
| Determinismo (RNF07) | Especificada: NFR-0001 |
| Taxa de quadros / custo da simulação (RNF03) | Especificada: NFR-0002 |
| Paridade entre canais de entrada | Especificada: NFR-0003 |
| Observabilidade / evidência (I9) | Especificada: NFR-0004 (ensaios registrados em `docs/physics.md`); telemetria em tempo de execução dispensada — o produto não coleta dados (RNF10) |
| Camada de simulação (I2) | Especificada: NFR-0005 |
| Contrato de passo (I8) | Especificada: NFR-0006 |
| Preset Realista inalterado | Especificada: NFR-0007 |
| Validação de volta inalterada | Especificada: NFR-0008 |
| Compatibilidade de replays e tempos (I3, I5) | Especificada: NFR-0009 |
| Latência de entrada (RNF04) | Dispensada: os limites desta feature são de tempo simulado, do `Input` recebido ao estado da simulação; o caminho do dispositivo até o `Input` não muda e o seed não fixa limite para ele |
| Disponibilidade / solo sem servidor (RNF08) | Dispensada: a feature não introduz dependência de rede; a simulação continua local |
| Comportamento offline | Dispensada: nenhuma mudança no caminho de rede; vale o que já vale para o jogo solo |
| Retenção de dados | Dispensada: a feature não persiste dado novo; a versão do acerto é declarada no dado publicado (NFR-0009), não armazenada por jogador |
| Privacidade e consentimento (RNF10) | Dispensada: nenhum dado pessoal é coletado ou introduzido pela feature (I6) |
| Exposição por papéis (RBAC) | Dispensada: o produto não tem contas nem papéis (I10, RNF10) |
| Acessibilidade | Dispensada como requisito novo: o HUD de velocidade e aderência já existe e esta feature só exige que não regrida (US-0004); nenhum elemento de tela novo — a feature só retira os elementos do drift e do turbo (US-0003) |
| Idioma pt/en (RNF11) | Dispensada: nenhum texto novo de tela |
| Tempo até pilotar (RNF01), tamanho de download (RNF02), suporte a navegadores (RNF05) | Dispensadas: o seed não as altera; a mudança é de parâmetros da simulação e a retirada do drift e do turbo |
| Volume de mensagens | Dispensada: a feature não envia mensagens nem usa servidor |

## Fora do escopo (do seed, seção Fora do escopo)

- Novas pistas ou novas manobras. O drift e o turbo de `requirements/11` foram retirados (2026-10-29): a
  retirada está no escopo (US-0003); criar qualquer manobra especial no lugar deles não está.
- Mudanças no preset Realista.
- Som de motor, vibração, câmera (RF13, RF11).
- Volante remoto e desafio diário.
