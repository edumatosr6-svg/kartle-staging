---
title: Verificações de fumaça — por canal, cada uma observando um limiar; executadas em staging (produção só depois da decisão Esri)
feature: pista-kart-park
stage: deploy
status: validated
version: 1.0.0
sources: [DES-0003, DES-0005, DES-0007, DES-0008, DES-0009, DES-0011, DES-0012, DM-0001, DM-0002, NFR-0001, NFR-0002, NFR-0004, NFR-0005, NFR-0006, NFR-0008, NFR-0010, NFR-0012, TEST-0001, TEST-0007, TEST-0008, TEST-0009, TEST-0012]
---

# Verificações de fumaça

Executadas por um humano na URL de **staging**. As linhas marcadas "prod" são as que se repetem na URL de **produção** — **mas só
na entrega que promover a Kart Park, depois da decisão Esri** (ADR-0005; NFR-0012): nesta release não há verificação em produção,
porque não há promoção. Cada linha nomeia o limiar que observa; uma linha que só confirma que a página abriu não prova nada. Os
roteiros `E2E-nn` são os de `300 Specs/330 D-Specs/Output/pista-kart-park/test-strategy.md` (E2E-01 a E2E-08) e o resultado é
registrado em `docs/kart-park-device-log.md` (a criar pelo dono do produto no molde de `docs/kart-01/device-log.md`) com aparelho,
navegador, versão, orientação e medida. As oito linhas que exigem aparelho nomeado, ouvido, mão, navegador nomeado, rede bloqueada
ou relógio de parede são as **linhas humanas H1–H8 do `runbook.md`**; as linhas abaixo referem-nas onde a observação rápida de
fumaça e a observação humana completa se tocam. As 22 linhas `unverified`/`n/a` do veredito de testes
(`500 Tests/Output/pista-kart-park/98-divergences.md`) são decididas por estas linhas e por H1–H8.

URLs (GitHub Pages, D23): staging `https://edumatosr6-svg.github.io/kartle-staging/`, produção `https://edumatosr6-svg.github.io/kartle/`
— sempre com a barra final. Abaixo, "a URL" é a de staging. A página abre na **Kart Park** com o seletor; a única oferta é a
**volta de treino**; o acerto padrão continua o **Arcade assistido** (`arcade-assistido-v5`). As linhas das releases anteriores
(HUD, acertos, texto compartilhado, inclinação, contagem, setores, pausa, idiomas; Kart 01, câmera, placa, sombra, efeitos)
continuam válidas em `600 Deploy/Output/modelo-kart-01/smoke.md` e anteriores, **escolhendo "Pista sintética" no seletor** —
nada da simulação na sintética mudou (NFR-0008); D18 e M10 abaixo são a regressão mínima que o confirma na tela.

Preparação comum: cache vazio (janela anônima), painel de rede e console abertos, idioma do navegador anotado,
`python -I "600 Deploy/Output/pista-kart-park/tools/check_served.py" <URL> index-<hash>.js` executado uma vez (três GET de
leitura; `<hash>` lido no passo *Build* da execução que publicou — esperado `DYFBop8t` para `d9139a2`).

## Canal `web-desktop` (Chrome, Edge, Firefox e Safari nas versões atuais; notebook de referência para D14)

| # | O que se faz | O que se observa | Limiar | Roteiro | prod |
|---|---|---|---|---|---|
| D1 | abrir a URL | cadeado válido (certificado `*.github.io`); painel de rede sem recurso em `http://`; `index.html`, `assets/index-<hash>.js` e `assets/index-<hash>.css` carregados de `/kartle-staging/assets/` com 200 e **nenhum outro recurso do site** (nenhum `.json` buscado: o arquivo de pista vem dentro do JS); `check_served.py` com `checks=74 failed=0` e o `<hash>` esperado | RNF06: 0 recursos inseguros, certificado válido; NFR-0010: 0 *assets* além de um JS e um CSS; NFR-0006: SHA-256 do arquivo da Kart Park no JS servido igual ao registrado; NFR-0001: literal abaixo de 200 000 bytes; integridade: `<hash>` igual ao da execução (`REL-0005`) | — | sim |
| D2 | com o painel de rede limitando a 4G e cache vazio, recarregar e cronometrar da navegação até o kart responder à primeira tecla na Kart Park | tempo medido | RNF01: abaixo de 10 s | — | sim |
| D3 | na mesma carga, ler o total transferido no painel de rede | bytes transferidos | RNF02: abaixo de 3 145 728 bytes; esperado da ordem de 190 KB comprimidos ou 713 KB brutos (`01-release.md`) | — | sim |
| D4 | ao terminar de carregar, antes de iniciar a volta, olhar a tela inicial e ler `#track-selector`, `#track-name`, `#track-credit`, `#track-status`, `#lap-offer` | o seletor com **duas** opções, "Kart Park — São José dos Pinhais (traçado aproximado) · 687 m" marcada (`aria-pressed`) e "Pista sintética"; `#track-name` com o mesmo rótulo; `#track-credit` visível com os **três** elementos: "© colaboradores do OpenStreetMap", "licença ODbL" e o link `openstreetmap.org/copyright`; `#track-status` = `kart-park`; `#lap-offer` com exatamente um botão, "volta de treino"; a visão geral mostra o asfalto da Kart Park, as zebras vermelhas e brancas, a barreira, a linha de largada e o Kart 01 na largada; nenhum "41,45", nenhum "recorde" da pista | AC-US-0001-01, -02: 2 opções, Kart Park marcada; AC-US-0006-01, -02, -07, -08: 3 elementos e o rótulo; AC-US-0006-09: 0 recordes; NFR-0005; D-DP-04; é **H1** | E2E-01 | sim |
| D5 | console do navegador ao carregar, ao trocar de pista (D7) e durante uma volta inteira na Kart Park | 0 erros; nenhum `track-data` (o arquivo empacotado é válido) | DES-0012: 0 erros; nenhum texto de jogador, aparelho ou máquina no console | — | sim |
| D6 | clicar no link do crédito | abre `https://openstreetmap.org/copyright` **em outra aba**; a aba do jogo continua no mesmo estado (seletor, sem volta iniciada); o painel de rede do jogo não registra a navegação como requisição do jogo | AC-US-0006-03: o destino exato; DES-0012: `target="_blank"`, `rel="noopener noreferrer"` (a página aberta não tem acesso ao jogo) — é **H1** | E2E-01 | sim |
| D7 | clicar em "Pista sintética"; olhar a cena e os rótulos; clicar de volta em "Kart Park" | a cena troca para a sintética: `#track-name` = "Pista sintética", `#track-status` = `synthetic`, **o crédito some** (`#track-credit` oculto), o kart aparece na largada da sintética, nenhuma volta em andamento, a única oferta continua "volta de treino"; a volta ao clicar "Kart Park" restaura o rótulo, o crédito e a cena da Kart Park, com o kart na largada dela | AC-US-0001-01; AC-US-0006-04 (sintética sem crédito); DES-0005: `selectTrainingTrack` sem volta em andamento; é **H2** | E2E-02 | sim |
| D8 | com a sintética escolhida, recarregar a página; depois de voltas nas duas pistas, abrir o painel de armazenamento da origem (Application → Storage) | a página volta **na Kart Park** marcada; `localStorage`, `sessionStorage`, IndexedDB e cookies da origem **vazios** | AC-US-0001-02: abertura sempre na Kart Park; AC-US-0001-05: 0 registros persistidos; REQ-FEAT-0001-03; é **H1** | E2E-01 | não |
| D9 | iniciar a volta de treino na Kart Park e completá-la, passando por todos os marcadores; olhar o asfalto, as zebras e a barreira durante a volta; ler o resultado | o asfalto com **larguras variáveis** (estreito e largo nos lugares da pista real); as zebras do lado declarado de cada curva; a barreira contínua entre os dois trechos quase encostados, nos dois lados; ao cruzar a chegada, `#lap-result` com `#lap-result-total` em `m:ss.mmm`, **4 setores**, `#lap-result-setup` = `arcade-assistido-v5` e `#lap-result-credit` com os três elementos do crédito | AC-US-0002-08, AC-US-0005-03, AC-US-0004-06: desenho conforme o arquivo; AC-US-0003-11: total e 4 setores; AC-US-0006-04..06: crédito no resultado; é **H3** | E2E-03 | sim |
| D10 | numa volta nova, cortar pela grama de modo a pular um marcador (ou passar a 3 m além da borda por mais tempo que o corte admite) e completar | a volta termina **inválida**; o título do resultado traz "marcador pulado" (ou a razão do corte) e o crédito continua na tela de resultado | AC-US-0003-06: o texto exato; DES-0004: corte e reposicionamento na linha central da Kart Park; é **H3** | E2E-03 | não |
| D11 | numa volta nova, dirigir contra a barreira entre os trechos quase encostados, a cerca de 50 km/h, de frente e em ângulo; depois encostar devagar e seguir | o kart **bate e não passa** em nenhuma tentativa: perde velocidade, fica do lado de onde veio, continua dirigível; nunca aparece do outro lado nem "trava" dentro da barreira; o HUD continua a responder | AC-US-0004-04: 0 cruzamentos (a prova numérica é CHK-TEST-0004-02/-03 de 5 a 200 m/s; aqui é a sensação na tela — um ricochete estranho é observação, atravessar é reprovação); é **H3** | E2E-03 | não |
| D12 | com o som **ligado** (`#sound`), passar com uma roda sobre a zebra numa curva e manter; sair da zebra; depois com o som **desligado**, repetir — em **Chrome e Firefox** | com o som ligado, um ruído curto e **grave** que se repete enquanto houver roda na zebra, distinto do motor e do som de recompensa; **nenhum** fora da zebra; com o som desligado, **nenhum** som da zebra | AC-US-0005-09, -10, -11, -12: repetição só com roda na zebra, distinção, silêncio desligado; DES-0009: ruído a 160 Hz, 60 ms, a cada 12 passos (0,1 s); é **H4** | E2E-04 | não |
| D13 | durante uma volta na Kart Park, trocar de aba (perda de foco) e voltar; recarregar a página a meio da volta | a volta pausa com a perda de foco e retoma ao voltar; depois da recarga, a tela inicial na Kart Park **sem resultado** e sem volta em andamento | REQ-FEAT-0003-15: pausa e retomada como na sintética; nenhum resultado sobrevive à recarga (nada persistido); é **H3** | E2E-03 | não |
| D14 | uma volta completa na Kart Park com o contador de fps do navegador aberto (F12 → Rendering → Frame Rendering Stats), no **notebook de referência**, página em primeiro plano, sem pausa, com zebras e barreira na tela | `fpsPerSecond` por segundo da volta e `minFps` | NFR-0002 / RNF03: `minFps` ≥ 60; a medida válida é a **H6** | E2E-03 | não |
| D15 | depois de carregar, bloquear a rede (painel "offline"); escolher a sintética e depois a Kart Park; completar uma volta na Kart Park passando pela zebra e tocando a barreira; ler o crédito | a escolha, a volta, a zebra, a barreira, o resultado e o crédito funcionam; **0 requisições** no painel entre a escolha e o resultado (a requisição a `fonts.googleapis.com` acontece no carregamento — divergência aceita, DIV-DP-10 — e não conta); o link do crédito pode não abrir sem rede | NFR-0004: 0 requisições a outro serviço da escolha ao fim da volta; REQ-FEAT-0006-12: crédito sem rede; é **H7** | E2E-07 | não |
| D16 | abrir a URL num navegador com o idioma **inglês** | o nome "Kart Park — São José dos Pinhais (traçado aproximado) · 687 m", "Pista sintética" e o crédito em **português**, iguais; os demais textos (HUD, oferta, resultado) em inglês | AC-US-0006-07, -08: nome e comprimento idênticos em qualquer idioma (literais fora de `MESSAGES`); é **H8** | E2E-08 | não |
| D17 | localmente, depois de `npm run build`: `python -I "600 Deploy/Output/pista-kart-park/tools/check_bundle.py" dist tracks/registry.json`; na URL, a saída de `check_served.py` de D1 | `check_bundle.py` com `checks=83 failed=0`; `check_served.py` com o arquivo da Kart Park uma vez no JS e o SHA-256 registrado, os textos do seletor e do crédito, `vibrate(20)`, `lowpassHz:160`, as malhas `asphalt`/`curbs`/`barriers`/`start-line`, `esri`/`41.45`/`recorde`/`Circuito Aurora`/`helmet`/`boxGeo` ausentes, `arcade-assistido-v5` e `kart01-decals` presentes | integridade do empacotamento: 83 de 83 e 74 de 74; NFR-0001, NFR-0006, NFR-0010, NFR-0012 (0 `esri`), AC-US-0006-09 (0 recordes) | — | sim (só `check_served.py`) |
| D18 | escolher "Pista sintética", completar uma volta e tocar/clicar `#lap-share`; olhar o Kart 01 e a câmera durante a volta | `#lap-result-setup` = `arcade-assistido-v5`; texto compartilhado `Kartle · synthetic v2 · <m:ss.mmm> · arcade-assistido-v5`; nenhum crédito no resultado; o Kart 01 com placa `01` e sombra, câmera atrás e perto, visão geral antes da contagem — tudo como na release anterior | NFR-0008: simulação e resultado da sintética inalterados; AC-US-0006-04: sintética sem crédito; regressão de `modelo-kart-01` (D4/D7/D11 daquela lista) | E2E-02 | sim |

## Canal `web-mobile` (celular intermediário de referência, navegador atual; paisagem **e** retrato; e um navegador sem `navigator.vibrate`)

| # | O que se faz | O que se observa | Limiar | Roteiro | prod |
|---|---|---|---|---|---|
| M1 | abrir a URL no celular | cadeado válido; "Ativar inclinação" pede permissão e, concedida, o kart responde à inclinação na Kart Park | RNF06: HTTPS válido; `window.isSecureContext` verdadeiro, observável porque a inclinação ativa em vez de avisar "Inclinação indisponível" | — | sim |
| M2 | em rede 4G real (dados móveis, Wi-Fi desligado), cache vazio, cronometrar da navegação até o kart responder ao primeiro toque ou inclinação | tempo medido | RNF01: abaixo de 10 s | — | sim |
| M3 | na mesma carga, total transferido (lista de transferências do navegador remoto) | bytes comprimidos | RNF02: abaixo de 3 145 728 bytes; esperado ≈ 190 KB comprimidos; registrado no device log (**H6**) | — | sim |
| M4 | na tela inicial, em paisagem e depois **em retrato**: ler o seletor, o rótulo e o crédito | as duas opções com a Kart Park marcada; o rótulo "Kart Park — São José dos Pinhais (traçado aproximado) · 687 m"; os três elementos do crédito **legíveis e inteiros** nas duas orientações (a linha discreta não é cortada pela área de jogo); o toque no link abre `openstreetmap.org/copyright` em outra aba | AC-US-0001-01, -02; AC-US-0006-01..03, -07, -08; NFR-0005; é **H5** | E2E-05 | sim |
| M5 | console remoto (inspeção USB ou equivalente) ao carregar, ao trocar de pista e numa volta | 0 erros | DES-0012: 0 erros | — | sim |
| M6 | **negar** a permissão de inclinação (ou abrir num navegador que não a oferece) | o controle por toque assume, com o aviso de inclinação indisponível; o seletor continua com as duas opções e a Kart Park marcada; a pista e o crédito não mudam | REQ-FEAT-0001-13: toque com aviso, seletor e pista inalterados; é **H5** | E2E-05 | não |
| M7 | com a vibração do aparelho ligada no sistema, iniciar uma volta na Kart Park e passar com uma roda sobre a zebra numa curva, mantendo-a; sair da zebra; pausar com a roda na zebra (cobrir o sensor; ou `#pause`) | um **pulso curto** (20 ms) que se repete a cada ≈ 0,25 s enquanto houver roda na zebra; **nenhum** pulso na reta, fora da zebra, nem com a volta pausada; ao retomar com a roda ainda na zebra, os pulsos voltam | AC-US-0005-07, -08: 20 ms a cada 0,25 s só com roda na zebra, 0 fora, 0 na pausa; DES-0009; é **H4** (celular) | E2E-05 | não |
| M8 | repetir uma volta com zebras num navegador **sem** `navigator.vibrate` (Safari no iOS; ou o mesmo celular com a vibração desligada no sistema, anotando qual) | a volta decorre igual, sem vibração, **sem erro no console e sem aviso** na tela; a zebra continua a reduzir a aderência (o kart escorrega mais sobre ela) | REQ-FEAT-0005-16..19: nenhum erro, nenhum aviso, o mesmo jogo; é **H5** | E2E-06 | não |
| M9 | uma volta completa na Kart Park em **paisagem** e outra em **retrato**, com a contagem de quadros por segundo (ferramenta remota do navegador ou trecho no console contando `requestAnimationFrame`), página em primeiro plano, sem pausa, zebras e barreira na tela | `fpsPerSecond` e `minFps` por orientação | NFR-0002 / RNF03: `minFps` ≥ 30 nas duas orientações; uma medida em desktop não vale (I9); é a **H6** (celular) | E2E-05 | não |
| M10 | completar a volta na Kart Park e tocar `#lap-share`; depois escolher "Pista sintética", completar uma volta e tocar `#lap-share` | na Kart Park: `#lap-result` com total, 4 setores e **o crédito** com os três elementos; na sintética: resultado **sem** crédito, `#lap-result-setup` = `arcade-assistido-v5`, folha de compartilhamento com `Kartle · synthetic v2 · <m:ss.mmm> · arcade-assistido-v5` | AC-US-0006-04..06 e -04 (sintética sem crédito); AC-US-0003-11; NFR-0008 (regressão); é **H5** | E2E-05, E2E-02 | sim |
| M11 | depois do carregamento, modo avião; escolher a Kart Park, completar uma volta passando pela zebra e tocando a barreira; ler o crédito | tudo funciona; 0 requisições do jogo entre a escolha e o resultado | NFR-0004; REQ-FEAT-0006-12; é **H7** (celular) | E2E-07 | não |
| M12 | em corrida na Kart Park, em paisagem e em retrato, olhar o asfalto, as zebras e a barreira pela câmera de corrida; bater na barreira a ≈ 50 km/h | asfalto de larguras variáveis, zebras do lado declarado, barreira contínua e o Kart 01 sobre o asfalto da Kart Park, nas duas orientações; o kart bate e não passa | AC-US-0002-08, AC-US-0005-03, AC-US-0004-06, AC-US-0004-04 (sensação); é **H3** (celular) | E2E-05 | não |

## Verificação em produção

**Não se aplica a esta release**: a Kart Park não é promovida (ADR-0005; NFR-0012). Na entrega que promover, depois da decisão
Esri e com o crédito da Esri no código: D1 a D7, D9, D17 (só `check_served.py`) e D18 em `web-desktop`; M1 a M5 e M10 em
`web-mobile`; e a linha nova daquela entrega — o crédito da Esri no texto da decisão nas duas telas (NFR-0012, segunda linha;
REQ-FEAT-0006-14). Qualquer limiar cruzado é gatilho de reversão (`runbook.md`, *Roll back*). **Hoje, sobre a URL de produção,
`check_served.py` desta release deve reprovar** (404, ou um bundle sem a Kart Park): é o estado esperado.

## Limites desta lista

- `check_served.py` e `check_bundle.py` provam o **servido** e o **empacotado** (hash, elementos, o arquivo da Kart Park byte a
  byte contra o registro, textos do seletor e do crédito, constantes da zebra, malhas, ausência de `esri` e do recorde, tamanhos),
  não o comportamento: não executam a página, não medem ritmo, não ouvem nem sentem. O comportamento é provado por `npm test`
  (398 verificações, 102 desta feature) nas regras — leitura do esquema 3, geometria, zebra como superfície, barreira de 5 a
  200 m/s, volta inteira na Kart Park com o piloto de teste, determinismo, sessão e catálogo, decisão do retorno por passo,
  textos do crédito, cena construída em Node, camadas, registro de publicação — e por estas linhas e por H1–H8 na tela.
- Nenhuma verificação acima é automatizada de ponta a ponta: o projeto não tem ferramenta de E2E e a feature não acrescenta
  dependência (`test-strategy.md`, NFR-0010). A medição de ritmo sob automação do navegador é inválida e a vibração não é
  observável fora do aparelho: D14/M9 e M7 são humanas.
- O `href="/"` da marca e a requisição a `fonts.googleapis.com` no carregamento são divergências aceitas em 2026-10-21
  (DIV-DP-09, DIV-DP-10); nenhuma linha acima depende deles, e D15/M11 começam a contar depois do carregamento.
- O crédito da Esri não existe nesta release por projeto; a sua linha pertence à entrega que promover.
