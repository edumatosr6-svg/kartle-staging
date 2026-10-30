---
title: Verificações de fumaça — por canal, cada uma observando um limiar
feature: dirigibilidade
stage: deploy
status: validated
version: 2.0.0
sources: [DES-0001, DES-0005, DES-0006, DES-0007, DES-0008, DES-0009, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0007, NFR-0009, TEST-0007, TEST-0008, TEST-0010]
---

# Verificações de fumaça

Executadas por um humano na URL de **staging** antes da decisão de promoção e repetidas (subconjunto marcado "prod") na URL
de **produção** na entrega que promover. Cada linha nomeia o limiar que observa; uma linha que só confirma que a página
abriu não prova nada. Os roteiros `E2E-nn` são os de `300 Specs/330 D-Specs/Output/dirigibilidade/test-strategy.md`
(E2E-01 a E2E-04) e o resultado é registrado em `docs/handling-device-log.md` com aparelho, navegador, versão e medida
(arquivo ainda por criar — `98-divergences.md`, DIV-DP-01). As linhas que exigem aparelho, sensor, gravação de tela,
julgamento do dono do produto ou relógio de parede são as **linhas humanas H1–H5 do `runbook.md`**; as linhas abaixo
referem-nas onde a observação rápida de fumaça e a observação humana completa se tocam.

URLs (GitHub Pages, D23): staging `https://edumatosr6-svg.github.io/kartle-staging/`, produção
`https://edumatosr6-svg.github.io/kartle/` — sempre com a barra final. A página oferece a **volta de treino** (treino de
voltas seguidas, de `race-lap-validation`) nas pistas do seletor (de `pista-kart-park`); o acerto padrão é o **Arcade
assistido** (opção `arcade` de `#handling-preset`, selecionada por padrão), que nesta release é o `arcade-assistido-v6`
(acerto C). As linhas de pista, seletor, crédito, treino, Kart 01 e câmera são dos registros daquelas features
(`600 Deploy/Output/<feature>/smoke.md`) e não se repetem aqui.

Preparação comum: cache vazio (janela anônima), painel de rede e console abertos, idioma do navegador anotado,
`python -I "600 Deploy/Output/dirigibilidade/tools/check_served.py" <URL> index-<hash>.js` executado uma vez (dois GET de
leitura; `<hash>` lido no passo *Build* da execução que publicou — hoje `BwruE9Pq` em staging, execução 41101055606).

## Canal `web-desktop` (Chrome, Edge, Firefox e Safari nas versões atuais)

| # | O que se faz | O que se observa | Limiar | Roteiro | prod |
|---|---|---|---|---|---|
| D1 | abrir a URL | cadeado válido (certificado `*.github.io`); painel de rede sem recurso em `http://`; `index.html`, `assets/index-<hash>.js` e `assets/index-oR7KyBh_.css` carregados de `/kartle-staging/assets/` (ou `/kartle/assets/`) com 200; `check_served.py` com `checks=22 failed=0` e o `<hash>` esperado | RNF06: 0 recursos inseguros, certificado válido; integridade: `<hash>` igual ao da execução aprovada (`REL-0005`) | — | sim |
| D2 | com o painel de rede limitando a 4G e cache vazio, recarregar e cronometrar da navegação até o kart responder à primeira tecla | tempo medido | RNF01: abaixo de 10 s | — | sim |
| D3 | na mesma carga, ler o total transferido no painel de rede | bytes transferidos | RNF02: abaixo de 3 145 728 bytes; esperado da ordem de 189 KB comprimidos ou 711 KB brutos (`01-release.md`) | — | sim |
| D4 | ao terminar de carregar, ler `#preset-label`, `#handling-preset`, a tela inicial (`#welcome`) e a barra de ferramentas | `#preset-label` = `ARCADE ASSISTIDO · TREINO LIVRE`; `#handling-preset` com `arcade` selecionado (`#assist-description` "Direção progressiva…"); `#lap-offer` com o botão da volta de treino; a dica ao lado de W A S D é `Dirigir`; nenhum texto, ícone ou controle da tela inicial ou da barra menciona drift, Espaço, carga, turbo, impulso, combo ou pontuação; não há guia de manobras | NFR-0009: o acerto padrão é o publicado; AC-US-0003-12, -13, -14: 0 menções a drift ou turbo. A observação nos dois idiomas é **H3** | E2E-04 | sim |
| D5 | console do navegador ao carregar e durante uma volta inteira | 0 erros; o único registro admitido é um `console.warn` com código (`replay`/`UNREADABLE` etc.), que não ocorre numa volta normal | NFR-0005 / DES-0008: 0 erros; nenhum texto de jogador, aparelho ou máquina no console | — | sim |
| D6 | iniciar a volta de treino com o teclado e observar o HUD durante a volta, passando pela grama e encostando numa parede; Esc no meio e retomar | `#speed` em km/h e `#handling` em texto ("Aderência", "Saindo de frente", "Saindo de traseira", "Derrapando") visíveis com valor durante toda a volta; na pausa os dois mantêm o último valor; nenhum medidor de carga, rótulo de turbo, pontuação ou combo | AC-US-0004-06 (DES-0005): 2 elementos com valor em todos os quadros observados; 0 ms de avanço na pausa; AC-US-0003-09: 0 indicadores de drift ou turbo. A observação por quadro, gravada, é **H4** | E2E-01 | sim |
| D7 | numa volta, segurar Espaço nas retas e nas curvas; depois, na reta mais longa, acelerador cheio até a velocidade estabilizar | segurar Espaço não muda a tela nem a pilotagem; a velocidade estabilizada no `#speed` fica entre 65 e 72 km/h (medida de bench: 69,3 km/h) | US-3: 0 efeitos da tecla de drift (`DRIFT_INERT`); US-4: velocidade estabilizada 65–72 km/h, a mesma em qualquer situação (`SPEED_CAP`). A observação completa é **H3** | E2E-01 | sim |
| D8 | completar a volta de treino | o resultado da volta aparece ao lado da volta seguinte (`#lap-training-result`): validade, total `m:ss.mmm` com "não oficial" e setores; **sem** a versão do acerto e sem conteúdo de drift, turbo, combo ou pontuação | AC-US-0005-05: resultado sem a versão do acerto; AC-US-0003-09: 0 conteúdos de drift ou turbo no resultado | E2E-02 | sim |
| D9 | encerrar o treino; trocar `#handling-preset` para Realista; observar o melhor tempo; completar uma volta; encerrar; voltar ao Arcade; observar de novo | ao trocar, o melhor tempo passa a `—`; com o Realista, só o tempo dessa volta (nunca o do Arcade nem uma diferença); ao voltar ao Arcade, `—` de novo | RULE-0003 / AC-US-0005-05: 0 comparações fora de `COMPARABLE`; NFR-0007: o Realista continua `realista-aluguel-4t-v4` | E2E-02 | não |
| D10 | registros publicados servidos: as linhas de acerto de `check_served.py` de D1; localmente, `python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist docs/physics.md` depois de `npm run build` | JS servido com `arcade-assistido-v6` corrente e `arcade-assistido-v4` anterior, `realista-aluguel-4t-v4`, sem `arcade-assistido-v5`; `check_bundle.py` com `checks=25 failed=0` (bloco `handling-baseline` com v4, Realista e v6 datada; v5 mantida como registro) | NFR-0009 / DM-0001: versão corrente e anterior declaradas; NFR-0004: bloco datado | — | sim (só `check_served.py`) |
| D11 | depois de carregar, bloquear a rede (painel "offline") e completar uma volta com o Arcade | resultado da volta exibido; 0 requisições no painel durante a volta. A requisição a `fonts.googleapis.com` acontece no carregamento (divergência aceita, DIV-DP-10) e não conta | NFR-0005 / DES-0008: 0 requisições de rede entre o sinal verde e o resultado | — | não |
| D12 | uma volta completa com o contador de fps do navegador aberto (F12 → Rendering → Frame Rendering Stats), no notebook de referência, página em primeiro plano | fps médio e mínimo | RNF03: 60 fps; NFR-0002 observado indiretamente. A medida válida é a **H5** | — | não |
| D13 | na curva mais fechada da pista selecionada (os grampos da Kart Park, raio de ≈ 6 m; na sintética, a curva mais fechada), entrar com esterço cheio aliviando o acelerador; repetir com acelerador cheio | aliviando, o kart contorna o grampo sem sair do asfalto; com acelerador cheio, perde velocidade na curva em vez de abrir a trajetória | US-2: raio ≤ 13 m com acelerador e esterço cheios (bench: 11,7 m); ≥ 180° em 2 s sem acelerador (bench: 208°). O julgamento completo é **H2** | — | sim |
| D14 | compartilhar o resultado (`#lap-share`; desktop sem `navigator.share`: área de transferência) | **não executável neste bundle**: o botão só aparece no resultado de uma volta oficial ou de reconhecimento, que a página não oferece (DIV-DP-13). Quando houver, o texto colado é `Kartle · <trackId> v<trackVersion> · <m:ss.mmm>` — um só tempo, sem a versão do acerto, sem drift, turbo, combo ou pontuação, sem nome, data ou aparelho | AC-US-0003-11, AC-US-0005-07: 0 comparações, 0 conteúdos de drift ou turbo, 0 campos pessoais; hoje provado só por `CHK-TEST-0007-02` e `-0007-05` | E2E-02 (compartilhar) | não |

## Canal `web-mobile` (celular intermediário de referência, navegador atual)

| # | O que se faz | O que se observa | Limiar | Roteiro | prod |
|---|---|---|---|---|---|
| M1 | abrir a URL no celular | cadeado válido; "Ativar inclinação" pede permissão e, concedida, o kart responde à inclinação | RNF06: HTTPS válido; `window.isSecureContext` verdadeiro, observável porque a inclinação ativa em vez de avisar "Inclinação indisponível" | — | sim |
| M2 | em rede 4G real (dados móveis, Wi-Fi desligado), cache vazio, cronometrar da navegação até o kart responder ao primeiro toque ou inclinação | tempo medido | RNF01: abaixo de 10 s | — | sim |
| M3 | na mesma carga, total transferido | bytes | RNF02: abaixo de 3 145 728 bytes | — | sim |
| M4 | `#preset-label`, `#handling-preset`, a tela inicial | `ARCADE ASSISTIDO · TREINO LIVRE`; `arcade` selecionado; nenhum texto, ícone ou controle de drift ou turbo; sem guia de manobras | NFR-0009; AC-US-0003-12, -14 (como em D4) | E2E-04 | sim |
| M5 | console remoto (inspeção USB ou equivalente) ao carregar e numa volta | 0 erros | NFR-0005 / DES-0008: 0 erros | — | sim |
| M6 | com a inclinação ativa, uma volta inteira observando o HUD; cobrir o sensor no meio e descobrir | `#speed` e `#handling` com valor durante toda a volta; ao cobrir o sensor a volta pausa e os dois mantêm o último valor | AC-US-0004-06; NFR-0003: o mesmo HUD com inclinação. A gravação é **H4** (celular) | E2E-01 | sim |
| M7 | uma volta com a inclinação ativa e outra com a permissão negada (recuo para toque), olhando o controle de toque durante a contagem e a volta | só ←, →, Freio e Acelerar; nenhum botão "Drift" nem outro controle de drift ou turbo | AC-US-0003-15: 0 controles de drift ou turbo. É parte da **H3** | E2E-04 | sim |
| M8 | com a inclinação ativa, uma volta inteira com esterço parcial (inclinação leve) em todas as curvas, acelerador cheio | o texto de aderência nunca mostra "Saindo de traseira" nem "Derrapando" sem esterço cheio | NFR-0003 / US-3 (condução normal): 0 passos de traseira forçada com esterço parcial. É parte da **H1** (celular) | E2E-03 | não |
| M9 | uma volta completa com medida de fps no aparelho nomeado (ferramenta remota do navegador), página em primeiro plano | fps médio e mínimo | RNF03: 30 fps; uma medida em desktop não vale (I9). É a **H5** (celular) | — | não |
| M10 | compartilhar o resultado pela folha do sistema (Web Share) | **não executável neste bundle** (como D14; DIV-DP-13). Quando houver, a folha recebe `Kartle · <trackId> v<trackVersion> · <m:ss.mmm>` sem a versão do acerto | AC-US-0003-11, AC-US-0005-07 (como em D14) | E2E-02 (compartilhar) | não |

## Verificação em produção

Na entrega que promover (hoje bloqueada pela decisão Esri — `01-release.md`, *Promoção*): D1 a D8, D10 e D13 em
`web-desktop`; M1 a M7 em `web-mobile`. Qualquer limiar cruzado é gatilho de reversão (`runbook.md`, *Roll back*).

## Limites desta lista

- `check_served.py` e `check_bundle.py` provam o **servido** e o **empacotado** (hash, elementos, ausência de drift e turbo no
  HTML, controles de toque, acerto corrente e anterior, bloco de linha de base), não o comportamento: não executam a página,
  não medem ritmo nem leem o console. O JS servido ainda lê o campo `drift` de `Input` (contrato de passo, I8), por isso o
  padrão de drift é verificado só no HTML e no CSS. O comportamento é provado por `npm test` (443 verificações, 65 desta
  feature) e pelo `bench:handling` (56 registros `PASS`), e por estas linhas e por H1–H5 na tela.
- D14 e M10 (compartilhar) ficam na lista mas não são executáveis neste bundle: o botão só aparece no resultado de uma volta
  oficial ou de reconhecimento, que esta página não oferece; o texto compartilhado é provado por `CHK-TEST-0007-02` e
  `-0007-05` (`98-divergences.md`, DIV-DP-13).
- Nenhuma verificação acima é automatizada de ponta a ponta: o projeto não tem ferramenta de E2E e a feature não acrescenta
  dependência (`test-strategy.md`). A medição de ritmo sob automação do navegador é inválida (1–2 quadros/s): D12/M9 são
  humanas.
- O `href="/"` da marca e a requisição a `fonts.googleapis.com` no carregamento são divergências aceitas em 2026-10-21
  (DIV-DP-09, DIV-DP-10); nenhuma linha acima depende deles.
