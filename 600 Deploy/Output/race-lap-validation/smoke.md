---
title: Verificações de fumaça — por canal, cada uma observando um limiar
feature: race-lap-validation
stage: deploy
status: validated
version: 1.2.0
sources: [DES-0001, DES-0005, DES-0008, DES-0009, DES-0010, ADR-0006, NFR-0003, NFR-0004, NFR-0006, NFR-0007, TEST-0009, TEST-0013, TEST-0015]
---

# Verificações de fumaça

Executadas por um humano na URL de **staging** antes da pergunta de promoção e repetidas (subconjunto marcado "prod")
na URL de **produção** depois dela. Cada linha nomeia o limiar que observa; uma linha que só confirma que a página abriu
não prova nada. Os roteiros `E2E-nn` são os de `300 Specs/330 D-Specs/Output/race-lap-validation/test-strategy.md`
e o resultado é registrado em `docs/lap-validation-device-log.md` por número de execução, com aparelho, navegador, versão
e medida. As execuções 1 (local, parcial) e 2 (staging, operador de sessão: D1, D3, D4, D14) foram sobre a primeira
release; **a execução 3**, humana, é a do roteiro de `runbook.md` (*Linhas humanas*, H1–H6) sobre o build desta rodada.

URLs (GitHub Pages, D23): staging `https://edumatosr6-svg.github.io/kartle-staging/`, produção
`https://edumatosr6-svg.github.io/kartle/` — sempre com a barra final. "A URL" é a de staging antes da promoção e a de
produção depois dela. O build desta rodada (commit `6b314b2`, `assets/index-BwruE9Pq.js`) contém também as releases
`dirigibilidade`, `modelo-kart-01` e `pista-kart-park`: a página abre na pista **Kart Park** e a oferta tem **só "treino"**
(a volta oficial e a de reconhecimento chegam com o desafio diário, DES-0009). Todas as linhas abaixo correm sobre o treino.

Conferência automática antes das linhas humanas (só leitura; não substitui nenhuma delas):
`python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" <URL> index-<hash>.js` → `checks=53 failed=0`
(elementos `#lap-training-result`, `#lap-best-valid`, `#lap-end-training` com "encerrar treino", `#pause`; as 24 chaves de
mensagem com o texto pt e en; os códigos do treino; tamanhos).

Preparação comum: cache vazio (janela anônima), painel de rede aberto, idioma do navegador anotado.

## Canal `web-desktop` (Chrome, Edge, Firefox e Safari nas versões atuais)

| # | O que se faz | O que se observa | Limiar | Roteiro | prod |
|---|---|---|---|---|---|
| D1 | abrir a URL | cadeado válido (certificado `*.github.io`); painel de rede sem recurso em `http://`; *assets* de `/kartle-staging/assets/` (ou `/kartle/assets/`) com 200 | RNF06: 0 recursos inseguros, certificado válido (I6) | — | sim |
| D2 | com o painel de rede limitando a 4G e cache vazio, recarregar e cronometrar da navegação até o kart responder à primeira tecla | tempo medido | RNF01: abaixo de 10 s | — | sim |
| D3 | na mesma carga, ler o total transferido | bytes transferidos | RNF02: abaixo de 3 145 728 bytes; esperado da ordem de 189 KB comprimidos ou 711 KB brutos (`01-release.md`) | — | sim |
| D4 | ao terminar de carregar, ler `#track-status` e `#lap-offer` | `#track-status` com a pista aberta (`kart-park` por padrão; `synthetic` ao trocar no seletor); `#lap-offer` com **exatamente um** botão, "treino", e nenhuma opção de volta oficial nem de reconhecimento | leitura `COMPLETE` (NFR-0012): 1 oferta, a de treino; 0 oferta oficial (AC-US-0008-03, -04) | E2E-06 (parte positiva) | sim |
| D5 | escolher "treino"; observar a contagem | 3, 2, 1 e VERDE em texto, **uma vez**; cronômetro `0:00.000` até o VERDE; acelerar antes do VERDE não move o kart | NFR-0006: numerais com 48 px no mínimo, contraste 4,5:1; contagem de 3 s | E2E-01 | sim |
| D6 | completar a primeira volta do treino com o teclado, sem tocar em nada além da pilotagem | "válida em andamento" durante a volta; tempo de cada setor ao completá-lo; na chegada, o painel `#lap-training-result` **ao lado**, sem cobrir `#lap-state`, com tempo total `m:ss.mmm`, 4 setores cuja soma é o total, "válida" e "não oficial"; o kart **segue andando**, o cronômetro recomeça e nenhuma contagem aparece; "melhor volta válida" aparece | NFR-0006: estado em texto, 4,5:1; soma dos setores = total com 0 ms; 0 contagens depois do VERDE (AC-US-0010-04) | E2E-02 (conclusão), E2E-12 | sim |
| D7 | Esc no meio de uma volta e continuar; trocar de aba e voltar; pausar pelo botão "❚❚ pausar" e continuar por "▶ continuar" | o cronômetro para e retoma do mesmo valor nas três situações; nenhuma contagem na retomada | NFR-0002: 0 ms de avanço durante a pausa (AC-US-0010-15) | E2E-03, E2E-04, E2E-12 | não |
| D8 | numa volta do treino, pular um marcador; noutra, sair da pista além do limite (corte); noutra, reposicionar (tecla `R`) | pulo e corte: "inválida · marcador pulado" / "inválida · corte" **no quadro seguinte**, o kart segue, a volta termina só na chegada seguinte com a validade e o motivo, tempo total e "—" no setor sem tempo; a melhor volta válida não muda; a volta seguinte começa "válida em andamento". Reposicionar: o estado exibido não muda (DES-0005: livre no treino) | NFR-0006: motivo em texto; regras provadas em `npm test` (TEST-0015) | E2E-02 (motivos), E2E-12 | não |
| D9 | depois de carregar, bloquear a rede e completar um treino de duas voltas; encerrar o treino e recarregar (com a rede de volta) com o armazenamento do site limpo antes de abrir | painel exibido a cada chegada; 0 requisições durante o treino; depois de recarregar, 0 entradas em `localStorage`, `sessionStorage`, IndexedDB e cookies da origem. A requisição a `fonts.googleapis.com` é do carregamento e não conta (DIV-DP-14) | NFR-0004: 0 requisições entre a contagem e o encerramento; REQ-FEAT-0009-11: 0 entradas | E2E-08 | não |
| D10 | idioma do navegador em `pt`, `en` e um terceiro (`fr`); recarregar | estado, motivo, "treino"/"training", "pausar"/"pause", "encerrar treino"/"end training", "melhor volta válida"/"best valid lap", "não oficial"/"unofficial" em pt, en e en | NFR-0007 / RNF11: 100 % das mensagens no idioma do navegador; inglês para os demais | E2E-07 | não |
| D11 | tela em escala de cinza durante D5, D6 e D8 | todo estado, motivo e validade do painel legível só pelo texto | NFR-0006: 100 % dos estados com rótulo em texto | E2E-09 | não |
| D12 | um treino de ao menos duas voltas com o contador de fps aberto, no notebook de referência, página em primeiro plano | fps médio e mínimo, inclusive nas chegadas (o painel não pode derrubar o ritmo) | NFR-0003 / RNF03: 60 fps | E2E-10 | não |
| D13 | a mesma sequência de entradas (`reference.inputs` de TEST-0008) nos 4 navegadores | total e 4 setores iguais ao ms | NFR-0008: 0 ms de diferença | E2E-11 | não |
| D14 | procurar o crédito OpenStreetMap e o aviso ODbL na tela inicial (seletor) e no painel/resultado com a Kart Park | o crédito "© colaboradores do OpenStreetMap · licença ODbL" visível com o link (a Kart Park é derivada de OSM; verificação de dono: `pista-kart-park`, H1/H5 do runbook daquela release) | RNF09 / D-DP-04: crédito e aviso visíveis sempre que houver dado OSM no bundle (DIV-DP-05) | — | sim |
| D15 | um treino de **quatro voltas seguidas**: duas válidas, uma com corte, uma válida | quatro painéis, um por chegada, sem parar o kart e sem contagem; "melhor volta válida" = o menor total entre as válidas e inalterada pela inválida; a inválida com "—" no setor não cruzado e o seu total | AC-US-0010-01 a -14: 0 contagens depois do VERDE; melhor volta = mínimo das válidas; 1 painel por chegada | E2E-12 | sim |
| D16 | durante o treino, conferir "encerrar treino" em corrida e em pausa; acioná-lo **em pausa**; escolher "treino" de novo; depois recarregar no meio de um treino | "encerrar treino" visível em corrida e em pausa e ausente fora do treino; ao encerrar, volta à oferta sem resultado para a volta em andamento e nenhuma volta começando; no treino novo, "melhor volta válida" só depois da primeira volta válida deste treino; na reabertura, nenhum resultado e nenhuma melhor volta | AC-US-0010-15 a -18: 0 resultados da volta interrompida; 0 dados herdados entre treinos e recargas | E2E-12 | sim |

## Canal `web-mobile` (celular intermediário de referência, navegador atual)

| # | O que se faz | O que se observa | Limiar | Roteiro | prod |
|---|---|---|---|---|---|
| M1 | abrir a URL no celular | cadeado válido; "Ativar inclinação" pede permissão e, concedida, o kart responde à inclinação | RNF06: HTTPS válido; `window.isSecureContext` verdadeiro | — | sim |
| M2 | em 4G real, cache vazio, cronometrar até o kart responder ao primeiro toque ou inclinação | tempo medido | RNF01: abaixo de 10 s | — | sim |
| M3 | na mesma carga, total transferido | bytes | RNF02: abaixo de 3 145 728 bytes | — | sim |
| M4 | `#track-status` e `#lap-offer` | a pista aberta; exatamente um botão, "treino"; nenhuma opção oficial nem de reconhecimento | NFR-0012: 1 oferta (treino), 0 oficial | E2E-06 (como em D4) | sim |
| M5 | escolher "treino"; observar a contagem | 3, 2, 1, VERDE em texto com 48 px no mínimo, uma vez; estado e motivo com 16 px no mínimo | NFR-0006: 48 px, 16 px, 4,5:1, medidos no aparelho | E2E-01, E2E-07 | sim |
| M6 | completar a primeira volta com inclinação ou toque | o painel lateral com total, 4 setores, "válida" e "não oficial", sem cobrir o estado e legível na tela do celular (paisagem e retrato); o kart segue; nenhuma contagem | NFR-0006 texto e contraste; soma igual ao total | E2E-02, E2E-12 | sim |
| M7 | com a inclinação ativa, cobrir ou desativar o sensor; noutro treino, negar a permissão antes de iniciar | pausa em cerca de 0,5 s; texto de controle por toque visível quando negada | I4: pausa `SENSOR_LOST` até 500 ms depois da última leitura (ADR-0005) | E2E-05 | não |
| M8 | trocar de aplicativo e voltar durante o treino | treino pausado com o mesmo cronômetro; continua só por ação do jogador | NFR-0002: 0 ms de avanço na pausa | E2E-04 | não |
| M9 | modo avião depois de carregar; treino de duas voltas; encerrar; recarregar com a rede de volta | painel a cada chegada; 0 requisições; 0 entradas no armazenamento do site | NFR-0004; REQ-FEAT-0009-11 | E2E-08 | não |
| M10 | idioma do aparelho em pt, en e um terceiro | textos (inclusive "pausar", "encerrar treino", "melhor volta válida") seguem pt, en, en | NFR-0007 / RNF11 | E2E-07 | não |
| M11 | treino de duas voltas com medida de fps no aparelho nomeado | fps médio e mínimo, inclusive nas chegadas | NFR-0003 / RNF03: 30 fps; uma medida em desktop não vale (I9) | E2E-10 | não |
| M12 | crédito OpenStreetMap e aviso ODbL na tela inicial e no resultado com a Kart Park | o mesmo de D14, legível no celular | RNF09 / D-DP-04 | — | sim |
| M13 | treino de quatro voltas seguidas por inclinação ou toque (como D15) | o mesmo de D15 no celular | AC-US-0010-01 a -14 | E2E-12 | sim |
| M14 | "❚❚ pausar" e "encerrar treino" por toque, em corrida e em pausa (como D7 e D16) | os dois botões alcançáveis e legíveis sem cobrir a pista; o mesmo resultado de D16 | AC-US-0010-15, -16: os dois botões nos dois canais | E2E-12 | sim |

## Verificação em produção

Depois da promoção: D1, D2, D3, D4, D5, D6, D14, D15 e D16 em `web-desktop`; M1, M2, M3, M4, M5, M6, M12, M13 e M14 em
`web-mobile`. Qualquer limiar cruzado é gatilho de reversão (`runbook.md`, *Roll back*).

## Limites desta lista

- Nenhuma linha acima é automatizada: o projeto não tem ferramenta de E2E e a feature não acrescenta dependência
  (test-strategy). `npm test` (179 verificações desta feature; 443 na suíte em `6b314b2`) prova as regras;
  `check_served.py` prova que o artefato servido carrega os textos e os elementos; estas linhas provam a página pilotada.
- **E2E-13** (painel só com tempo total e validade numa pista sem setores) não tem linha: a página servida não abre pista de
  fixture e nenhuma pista do catálogo é `INCOMPLETE` (a mesma razão de E2E-06). Decidido por `npm test` (CHK-TEST-0015-25,
  CHK-TEST-0012-14, CHK-TEST-0010-21); a execução 3 registra-o como "não executável pela tela" (`runbook.md`, H4).
- O "desafio do dia" das diretivas ainda não existe: o observável equivalente é D4/M4. A volta oficial só entra numa
  linha desta lista quando for ofertada (DES-0009).
- O `href="/"` da marca aponta, no Pages de projeto, para fora do site (DIV-DP-12, aceito); nenhuma linha depende dele.
