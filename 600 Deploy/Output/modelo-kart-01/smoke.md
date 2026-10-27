---
title: Verificações de fumaça — por canal e por forma da área de jogo, cada uma observando um limiar
feature: modelo-kart-01
stage: deploy
status: validated
version: 1.0.0
sources: [DES-0001, DES-0002, DES-0003, DES-0004, DES-0005, DES-0007, DM-0001, NFR-0001, NFR-0002, NFR-0003, NFR-0006, TEST-0001, TEST-0002, TEST-0003, TEST-0004]
---

# Verificações de fumaça

Executadas por um humano na URL de **staging** antes da pergunta de promoção e repetidas (subconjunto marcado "prod") na URL de
**produção** depois dela. Cada linha nomeia o limiar que observa; uma linha que só confirma que a página abriu não prova nada.
Os roteiros `E2E-nn` são os de `300 Specs/330 D-Specs/Output/modelo-kart-01/test-strategy.md` (E2E-01 a E2E-06) e o resultado é
registrado em `docs/kart-01/device-log.md` com aparelho, navegador, versão, orientação e medida (DM-0001, seção 2; o arquivo
existe, com a execução 1 parcial). As seis linhas que exigem aparelho nomeado, gravação de tela, orientação ou relógio de parede
são as **linhas humanas H1–H6 do `runbook.md`**; as linhas abaixo referem-nas onde a observação rápida de fumaça e a observação
humana completa se tocam. As 22 linhas `unverified` do veredito de testes (`500 Tests/Output/modelo-kart-01/98-divergences.md`)
são decididas por estas linhas e por H1–H6.

URLs (GitHub Pages, D23): staging `https://edumatosr6-svg.github.io/kartle-staging/`, produção `https://edumatosr6-svg.github.io/kartle/`
— sempre com a barra final. Abaixo, "a URL" é a de staging antes da promoção e a de produção depois dela. A página oferece só
a **volta de treino**; o acerto padrão continua o **Arcade assistido** (`arcade-assistido-v5`) e a pista a `synthetic` v2 — nada
da simulação mudou (NFR-0006). As linhas das releases anteriores que esta não repete (HUD por quadro, comparabilidade entre
acertos, texto compartilhado, inclinação com esterço parcial, contagem, setores, pausa, idiomas, OSM) continuam válidas em
`600 Deploy/Output/dirigibilidade/smoke.md` e `600 Deploy/Output/race-lap-validation/smoke.md` e não mudaram de resultado
esperado, porque esses módulos não mudaram; D11 e M11 abaixo são a regressão mínima que o confirma na tela.

Preparação comum: cache vazio (janela anônima), painel de rede e console abertos, idioma do navegador anotado,
`python -I "600 Deploy/Output/modelo-kart-01/tools/check_served.py" <URL> index-<hash>.js` executado uma vez (três GET de
leitura; `<hash>` lido no passo *Build* da execução que publicou — hoje `D0RarhFV` em staging).

## Canal `web-desktop` (Chrome, Edge, Firefox e Safari nas versões atuais; notebook de referência para D14)

| # | O que se faz | O que se observa | Limiar | Roteiro | prod |
|---|---|---|---|---|---|
| D1 | abrir a URL | cadeado válido (certificado `*.github.io`); painel de rede sem recurso em `http://`; `index.html`, `assets/index-<hash>.js` e `assets/index-dgojskay.css` carregados de `/kartle-staging/assets/` (ou `/kartle/assets/`) com 200 e **nenhum outro recurso do site** (sem textura, modelo ou fonte do bundle); `check_served.py` com `checks=37 failed=0` e o `<hash>` esperado | RNF06: 0 recursos inseguros, certificado válido; NFR-0003: 0 *assets* além de um JS e um CSS; integridade: `<hash>` igual ao da execução aprovada (`REL-0005`) | — | sim |
| D2 | com o painel de rede limitando a 4G e cache vazio, recarregar e cronometrar da navegação até o kart responder à primeira tecla | tempo medido | RNF01: abaixo de 10 s | — | sim |
| D3 | na mesma carga, ler o total transferido no painel de rede | bytes transferidos | NFR-0002 / RNF02: abaixo de 3 145 728 bytes; esperado da ordem de 171 KB comprimidos ou 650 KB brutos (`01-release.md`) | E2E-06 (download) | sim |
| D4 | ao terminar de carregar, antes de iniciar a volta, olhar a cena e ler `#preset-label`, `#track-status` e `#lap-offer` | **visão geral**: a pista inteira do alto, com margem, e o **Kart 01** (laranja, piloto de macacão azul) pequeno na largada — **nenhum kart de caixas**; `#preset-label` = `ARCADE ASSISTIDO · TREINO LIVRE`; `#track-status` = `synthetic`; `#lap-offer` com exatamente um botão, "volta de treino" | AC-US-0003-10: 4 cantos da pista no quadro; AC-US-0001-14: 0 quadros com caixas; NFR-0006: acerto e pista da release anterior | E2E-01 | sim |
| D5 | console do navegador ao carregar e durante uma volta inteira | 0 erros; o único registro admitido é um `console.warn` com código; `kart01-decals`/`NO_2D_CONTEXT` **não** ocorre num navegador de referência (se ocorrer, a placa fica sem número e a linha anota o navegador) | DES-0007: 0 erros; nenhum texto de jogador, aparelho ou máquina no console | — | sim |
| D6 | iniciar a volta de treino e observar a contagem `3`, `2`, `1`, `VERDE` | o primeiro quadro da contagem ainda mostra a visão geral; a câmera desce de forma contínua e **nunca sobe** em nenhum quadro; no `VERDE` a câmera já está atrás do piloto, sem corte | AC-US-0003-11: 0 quadros com a altura a subir; AC-US-0003-12: pose de corrida no quadro do sinal verde (a gravação é **H1**) | E2E-01 | sim |
| D7 | em corrida, olhar o kart e a cena | o Kart 01 inteiro com o piloto, visto de trás e de cima, perto (a câmera a 1,38 m de altura e 3,05 m atrás: o kart ocupa a parte inferior do quadro, o motor à direita do piloto); a **placa `01` legível** no para-choque traseiro; a **sombra** do kart no asfalto junto a ele | AC-US-0001-15 (sombra), AC-US-0001-16 (número legível), AC-US-0003-01..03 (câmera atrás e perto); a confirmação por aparelho é **H2** | E2E-02 | sim |
| D8 | esterçar para os dois lados (teclas) e acelerar | as rodas dianteiras giram para o lado do esterço; o volante gira para o mesmo lado, mais do que as rodas; as mãos ficam no aro; ao acelerar as quatro rodas rolam (mais rápido com mais velocidade) | AC-US-0002-01, -03, -04 (esterço, volante, mãos), AC-US-0002-02 (giro); é **H3** | E2E-03 | sim |
| D9 | em corrida, pausar (Esc; troca de aba) e retomar; reposicionar (R, se oferecido; senão por corte) | na pausa, kart, rodas, câmera, marcas e fumaça ficam parados; ao retomar, continuam do mesmo ponto; depois de reposicionar, kart e câmera aparecem na nova posição e no novo rumo **no quadro seguinte**, sem deslizar | AC-US-0002-05, -06: 0 movimento na pausa; 0 quadros de transição após reposicionar; é **H3** | E2E-03 | não |
| D10 | numa curva de 90° a cerca de 50 km/h; depois com o turbo ativo | o kart com o piloto inteiro no quadro durante toda a curva; com o turbo o campo de visão abre (+4°) e volta ao soltar | AC-US-0003-08: 0 cantos do kart fora do quadro; AC-US-0003-09: abertura visível e retorno; é **H4** (paisagem) | E2E-04 | não |
| D11 | completar a volta de treino; depois "nova volta" | ao cruzar a chegada a simulação para e o kart fica **congelado** (rodas sem giro, nenhuma marca nova), a câmera continua atrás do kart parado e o painel `#lap-result` aparece **sobre a cena sem a mover**; `#lap-result-setup` = `arcade-assistido-v5` com total `m:ss.mmm` e 4 setores; a cena não volta à visão geral enquanto o painel estiver na tela; em "nova volta", o primeiro quadro da contagem está na visão geral | AC-US-0003-13: câmera atrás do kart parado até a próxima visão geral; regressão NFR-0009 da release anterior: `setupVersion` em texto; é parte de **H2** | E2E-02 | sim |
| D12 | em corrida, drift com marcas de pneu (`a`/`d` + Espaço); turbo; reposicionar durante as marcas; pausar durante o drift | cada trecho novo de marca nasce **sob o pneu traseiro exibido** do seu lado; a fumaça sai da **ponteira do escapamento**, lado direito traseiro, só com turbo; depois do reposicionamento os trechos antigos ficam onde estavam e os novos saem da nova posição; na pausa nenhum trecho novo | AC-US-0005-01, -02, -03: 0 marcas fora do pneu, 0 fumaça fora da ponteira, 0 trechos na pausa; é **H5** | E2E-05 | não |
| D13 | redimensionar a janela para **mais alta que larga** (retrato em desktop) e repetir D10; voltar a paisagem com o turbo ativo | o kart com o piloto inteiro no quadro na curva de 90°; o campo de visão da nova forma vale no quadro seguinte à troca; a pose da câmera não muda com a troca | AC-US-0003-08 em retrato (vertical ≥ 62°, horizontal ≥ 60°); REQ-FEAT-0003-15: 1 quadro de atraso no máximo; é **H4** (retrato) | E2E-04 | não |
| D14 | uma volta completa com o contador de fps do navegador aberto (F12 → Rendering → Frame Rendering Stats), no **notebook de referência**, página em primeiro plano, sem pausa | `fpsPerSecond` por segundo da volta e `minFps` | NFR-0001 / RNF03: `minFps` ≥ 60; NFR-0004 observado indiretamente (27 chamadas, 5 128 triângulos). A medida válida é a **H6** | E2E-06 | não |
| D15 | localmente, depois de `npm run build`: `python -I "600 Deploy/Output/modelo-kart-01/tools/check_bundle.py" dist docs/kart-01/device-log.md`; na URL, a saída de `check_served.py` de D1 | `check_bundle.py` com `checks=45 failed=0`; `check_served.py` com os marcadores do Kart 01 (`kart01-decals`, `placaTraseira`, `fillText` de `01`, `=1.38,`, `=3.05,`, `=62,`), `helmet`/`boxGeo` ausentes e `arcade-assistido-v5` presente no JS servido | integridade do empacotamento: 45 de 45 e 37 de 37; NFR-0003: 0 *assets* além de JS e CSS | — | sim (só `check_served.py`) |
| D16 | depois de carregar, bloquear a rede (painel "offline") e completar uma volta com o Kart 01 | a volta decorre inteira com o modelo, a sombra e os efeitos; 0 requisições no painel durante a volta (a requisição a `fonts.googleapis.com` acontece no carregamento — divergência aceita, DIV-DP-10 — e não conta) | DES-0007: 0 requisições de rede entre o sinal verde e o resultado; nenhuma textura ou modelo buscado | — | não |

## Canal `web-mobile` (celular intermediário de referência, navegador atual; paisagem **e** retrato)

| # | O que se faz | O que se observa | Limiar | Roteiro | prod |
|---|---|---|---|---|---|
| M1 | abrir a URL no celular | cadeado válido; "Ativar inclinação" pede permissão e, concedida, o kart responde à inclinação | RNF06: HTTPS válido; `window.isSecureContext` verdadeiro, observável porque a inclinação ativa em vez de avisar "Inclinação indisponível" | — | sim |
| M2 | em rede 4G real (dados móveis, Wi-Fi desligado), cache vazio, cronometrar da navegação até o kart responder ao primeiro toque ou inclinação | tempo medido | RNF01: abaixo de 10 s | — | sim |
| M3 | na mesma carga, total transferido (lista de transferências do navegador remoto) | bytes comprimidos | NFR-0002 / RNF02: abaixo de 3 145 728 bytes; esperado ≈ 171 KB comprimidos; registrado no device log (**H6**) | E2E-06 | sim |
| M4 | na visão geral, segurar o celular em paisagem e depois **girar** para retrato (e de volta) | a pista inteira visível nas duas formas, com margem; o Kart 01 na largada nas duas; nenhum kart de caixas | AC-US-0003-10 e REQ-FEAT-0003-15: 4 cantos da pista no quadro em cada forma, nova forma no quadro seguinte; AC-US-0001-14; é **H1** (celular) | E2E-01 | sim |
| M5 | console remoto (inspeção USB ou equivalente) ao carregar e numa volta | 0 erros | DES-0007: 0 erros | — | sim |
| M6 | iniciar a volta em paisagem e observar a contagem e a corrida | contagem: primeiro quadro na visão geral, descida sem subir, `VERDE` atrás do piloto; corrida: Kart 01 inteiro com o piloto, placa `01` legível, sombra no chão, câmera atrás e perto | AC-US-0003-11, -12; AC-US-0001-15, -16; AC-US-0003-01..03; é **H1**/**H2** (celular) | E2E-01, E2E-02 | sim |
| M7 | em corrida em **retrato**: uma curva de 90° a cerca de 50 km/h; turbo; girar o celular durante a corrida com e sem turbo | o kart com o piloto inteiro no quadro em retrato (campo de visão vertical ≥ 62°, horizontal ≥ 60°); com o turbo o campo abre e volta; ao girar, a pose não muda e o campo da nova forma vale no quadro seguinte | AC-US-0003-08 e -09 nas duas formas: 0 cantos fora do quadro; +4° com turbo; é **H4** (celular) | E2E-04 | sim |
| M8 | com a inclinação ativa: esterçar para os dois lados, acelerar; cobrir o sensor no meio da volta e descobrir; reposicionar | rodas dianteiras e volante giram para o lado da inclinação, mãos no aro, rodas rolam; ao cobrir o sensor a volta pausa (≈ 0,5 s) e kart, rodas, câmera e efeitos param; ao descobrir, continuam; depois de reposicionar, kart e câmera na nova posição no quadro seguinte | AC-US-0002-01..06: 0 movimento na pausa, 0 deslizamento; é **H3** (celular) | E2E-03 | não |
| M9 | uma volta completa em **paisagem** e outra em **retrato**, com a contagem de quadros por segundo (ferramenta remota do navegador ou trecho no console contando `requestAnimationFrame`), página em primeiro plano, sem pausa | `fpsPerSecond` e `minFps` por orientação | NFR-0001 / RNF03 / AC-US-0004-02: `minFps` ≥ 30 nas duas orientações; uma medida em desktop não vale (I9). É a **H6** (celular) | E2E-06 | não |
| M10 | recarregar a página durante a contagem e durante a corrida | a visão geral de novo, com o Kart 01 na largada; nenhum kart de caixas em nenhum quadro, antes ou depois da recarga | AC-US-0001-14: 0 quadros com caixas após recarga; é **H1** | E2E-01 | não |
| M11 | completar a volta e tocar `#lap-share` (Web Share) | o kart congelado com a câmera atrás e o painel sobre a cena; `#lap-result-setup` = `arcade-assistido-v5`; a folha de compartilhamento do sistema recebe `Kartle · synthetic v2 · <m:ss.mmm> · arcade-assistido-v5` | AC-US-0003-13; regressão NFR-0009 / AC-US-0005-05 da release anterior: `setupVersion` em texto, 0 campos pessoais; é parte de **H2** | E2E-02 | sim |

## Verificação em produção

Depois da promoção: D1 a D8, D11 e D15 (só `check_served.py`) em `web-desktop`; M1 a M7 e M11 em `web-mobile`. Qualquer
limiar cruzado é gatilho de reversão (`runbook.md`, *Roll back*).

## Limites desta lista

- `check_served.py` e `check_bundle.py` provam o **servido** e o **empacotado** (hash, elementos, marcadores do modelo, número
  `01`, constantes de câmera, ausência do kart provisório, tamanhos), não o comportamento: não executam a página, não medem
  ritmo nem leem o console. O comportamento é provado por `npm test` (296 verificações, 59 desta feature) nas regras — modelo
  montado em Node, câmera quadro a quadro em (1280, 720) e (720, 1280), contratos transversais — e por estas linhas e por H1–H6
  na tela.
- Nenhuma verificação acima é automatizada de ponta a ponta: o projeto não tem ferramenta de E2E e a feature não acrescenta
  dependência (`test-strategy.md`, NFR-0003). A medição de ritmo sob automação do navegador é inválida (1–2 quadros/s sob
  `requestAnimationFrame` em segundo plano; `docs/kart-01/device-log.md`, execução 1) e não é tentada de novo: D14/M9 são
  humanas.
- A pose exata da câmera (1,38 m / 3,05 m) e o campo de visão não são medidos na tela com instrumento: `CHK-TEST-0003-*` os
  prova sobre sessões reais; a tela confirma a forma real do aparelho (kart inteiro, atrás e perto).
- O `href="/"` da marca e a requisição a `fonts.googleapis.com` no carregamento são divergências aceitas em 2026-10-21
  (DIV-DP-09, DIV-DP-10); nenhuma linha acima depende deles.
- O crédito OSM e o aviso ODbL continuam não exigidos (0 dado OSM; D-DP-04 ratificado); a linha D14/M12 da primeira release não
  mudou de resultado e não é repetida aqui.
