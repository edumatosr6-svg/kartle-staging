---
title: Verificações de fumaça — por canal, cada uma observando um limiar
feature: dirigibilidade
stage: deploy
status: validated
version: 1.0.0
sources: [DES-0005, DES-0006, DES-0008, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0007, NFR-0008, NFR-0009, TEST-0007, TEST-0008, TEST-0010]
---

# Verificações de fumaça

Executadas por um humano na URL de **staging** antes da pergunta de promoção e repetidas (subconjunto marcado "prod")
na URL de **produção** depois dela. Cada linha nomeia o limiar que observa; uma linha que só confirma que a página abriu
não prova nada. Os roteiros `E2E-nn` são os de `300 Specs/330 D-Specs/Output/dirigibilidade/test-strategy.md`
(E2E-01 a E2E-03) e o resultado é registrado em `docs/handling-device-log.md` com aparelho, navegador, versão e medida
(arquivo ainda por criar — `98-divergences.md`, DIV-DP-01). As cinco linhas que exigem aparelho, sensor, gravação de tela
ou relógio de parede são as **linhas humanas H1–H5 do `runbook.md`**; as linhas abaixo referem-nas onde a observação
rápida de fumaça e a observação humana completa se tocam.

URLs (GitHub Pages, D23): staging `https://edumatosr6-svg.github.io/kartle-staging/`, produção
`https://edumatosr6-svg.github.io/kartle/` — sempre com a barra final. Abaixo, "a URL" é a de staging antes da promoção e
a de produção depois dela. Como na release anterior, a página oferece só a **volta de treino**; o acerto padrão é o
**Arcade assistido** (opção `arcade` de `#handling-preset`, selecionada por padrão), que nesta release é o
`arcade-assistido-v5`. A pista continua a `synthetic` v2 (NFR-0008); as linhas de `race-lap-validation` que esta release
não repete (contagem, setores, pausa, idiomas, OSM) continuam válidas em
`600 Deploy/Output/race-lap-validation/smoke.md` e não mudaram de resultado esperado, porque esses módulos não mudaram.

Preparação comum: cache vazio (janela anônima), painel de rede e console abertos, idioma do navegador anotado,
`python -I "600 Deploy/Output/dirigibilidade/tools/check_served.py" <URL> index-<hash>.js` executado uma vez (dois GET
de leitura; `<hash>` lido no passo *Build* da execução que publicou — hoje `BiFxJ0FY` em staging).

## Canal `web-desktop` (Chrome, Edge, Firefox e Safari nas versões atuais)

| # | O que se faz | O que se observa | Limiar | Roteiro | prod |
|---|---|---|---|---|---|
| D1 | abrir a URL | cadeado válido (certificado `*.github.io`); painel de rede sem recurso em `http://`; `index.html`, `assets/index-<hash>.js` e `assets/index-dgojskay.css` carregados de `/kartle-staging/assets/` (ou `/kartle/assets/`) com 200; `check_served.py` com `checks=18 failed=0` e o `<hash>` esperado | RNF06: 0 recursos inseguros, certificado válido; integridade: `<hash>` igual ao da execução aprovada (`REL-0005`) | — | sim |
| D2 | com o painel de rede limitando a 4G e cache vazio, recarregar e cronometrar da navegação até o kart responder à primeira tecla | tempo medido | RNF01: abaixo de 10 s | — | sim |
| D3 | na mesma carga, ler o total transferido no painel de rede | bytes transferidos | RNF02: abaixo de 3 145 728 bytes; esperado da ordem de 155 KB comprimidos ou 598 KB brutos (`01-release.md`) | — | sim |
| D4 | ao terminar de carregar, ler `#preset-label`, `#handling-preset`, `#track-status` e `#lap-offer` | `#preset-label` = `ARCADE ASSISTIDO · TREINO LIVRE`; `#handling-preset` com `arcade` selecionado (`#assist-description` "Direção progressiva…"); `#track-status` = `synthetic`; `#lap-offer` com exatamente um botão, "volta de treino". O identificador `arcade-assistido-v5` só aparece depois de uma volta (D7) — é o que SCR-0001/SCR-0002 prescrevem | NFR-0009: o acerto padrão é o publicado (`PUBLISHED_SETUPS.ARCADE_ASSISTIDO`); NFR-0008: pista lida `COMPLETE`, 1 oferta de treino | — | sim |
| D5 | console do navegador ao carregar e durante uma volta inteira | 0 erros; o único registro admitido é um `console.warn` com código (`replay`/`UNREADABLE` etc.), que não ocorre numa volta normal | NFR-0005 / DES-0008: 0 erros; nenhum texto de jogador, aparelho ou máquina no console | — | sim |
| D6 | iniciar a volta de treino com o teclado e observar o HUD até a chegada, passando pela grama e encostando numa parede; Esc no meio e retomar | `#speed` em km/h e `#handling` em texto ("Aderência", "Saindo de frente", "Saindo de traseira", "Derrapando") visíveis com valor durante toda a volta; na pausa os dois mantêm o último valor | AC-US-0004-06 (DES-0005): 2 elementos com valor em todos os quadros observados; 0 ms de avanço na pausa. A observação por quadro, gravada, é **H1** | E2E-01 | sim |
| D7 | completar a volta de treino | `#lap-result` com total `m:ss.mmm`, 4 setores cuja soma é o total, sufixo "não oficial" e **`#lap-result-setup` = `arcade-assistido-v5`** em texto | NFR-0009 / AC-US-0005-04: `setupVersion` em texto ao lado do tempo, igual à publicada; NFR-0008: soma dos setores igual ao total com 0 ms de diferença | E2E-02 (parte de conclusão) | sim |
| D8 | clicar `#lap-share` (desktop sem `navigator.share`: área de transferência) e colar num editor | `Kartle · synthetic v2 · <m:ss.mmm> · arcade-assistido-v5` — um só tempo, sem diferença nem segundo tempo; nenhum nome, data ou dado de aparelho | AC-US-0005-05 (DES-0006, DES-0008): texto com tempo e `setupVersion`, 0 comparações, 0 campos pessoais | E2E-02 (compartilhar) | sim |
| D9 | trocar `#handling-preset` para Realista; observar o melhor tempo; completar uma volta; voltar ao Arcade; observar de novo | ao trocar, o melhor tempo passa a `—`; o resultado do Realista mostra `realista-aluguel-4t-v4` e só o tempo dessa volta (nunca o do Arcade nem uma diferença); ao voltar ao Arcade, `—` de novo | RULE-0003 / AC-US-0005-05: 0 comparações fora de `COMPARABLE`; NFR-0007: o Realista continua `realista-aluguel-4t-v4` | E2E-02 (troca de acerto) | não |
| D10 | registros publicados servidos: na saída de `check_served.py` de D1, as linhas dos três identificadores; localmente, `python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist docs/physics.md` depois de `npm run build` | `arcade-assistido-v5`, `arcade-assistido-v4` e `realista-aluguel-4t-v4` presentes no JS servido; `check_bundle.py` com `checks=20 failed=0` (bloco `handling-baseline` com três entradas e `measuredAtUtc` da v5) | NFR-0009 / DM-0001: 3 de 3 identificadores publicados; NFR-0004: bloco com 3 entradas datadas | — | sim (só `check_served.py`) |
| D11 | depois de carregar, bloquear a rede (painel "offline") e completar uma volta com o Arcade; compartilhar | resultado exibido com `arcade-assistido-v5`; 0 requisições no painel durante a volta e ao compartilhar. A requisição a `fonts.googleapis.com` acontece no carregamento (divergência aceita, DIV-DP-14 da release anterior) e não conta | NFR-0005 / DES-0008: 0 requisições de rede entre o sinal verde e o texto compartilhado | — | não |
| D12 | uma volta completa com o contador de fps do navegador aberto (F12 → Rendering → Frame Rendering Stats), no notebook de referência, página em primeiro plano | fps médio e mínimo | RNF03: 60 fps; NFR-0002 observado indiretamente (custo por passo ≤ 1,10 × a linha de base, **H5**). A medida válida é a **H4** | — | não |

## Canal `web-mobile` (celular intermediário de referência, navegador atual)

| # | O que se faz | O que se observa | Limiar | Roteiro | prod |
|---|---|---|---|---|---|
| M1 | abrir a URL no celular | cadeado válido; "Ativar inclinação" pede permissão e, concedida, o kart responde à inclinação | RNF06: HTTPS válido; `window.isSecureContext` verdadeiro, observável porque a inclinação ativa em vez de avisar "Inclinação indisponível" | — | sim |
| M2 | em rede 4G real (dados móveis, Wi-Fi desligado), cache vazio, cronometrar da navegação até o kart responder ao primeiro toque ou inclinação | tempo medido | RNF01: abaixo de 10 s | — | sim |
| M3 | na mesma carga, total transferido | bytes | RNF02: abaixo de 3 145 728 bytes | — | sim |
| M4 | `#preset-label`, `#handling-preset`, `#track-status`, `#lap-offer` | `ARCADE ASSISTIDO · TREINO LIVRE`; `arcade` selecionado; `synthetic`; um botão "volta de treino" | NFR-0009, NFR-0008 (como em D4) | — | sim |
| M5 | console remoto (inspeção USB ou equivalente) ao carregar e numa volta | 0 erros | NFR-0005 / DES-0008: 0 erros | — | sim |
| M6 | com a inclinação ativa, uma volta inteira observando o HUD; cobrir o sensor no meio e descobrir | `#speed` e `#handling` com valor durante toda a volta; ao cobrir o sensor a volta pausa (≈ 0,5 s) e os dois mantêm o último valor | AC-US-0004-06; NFR-0003: o mesmo HUD com inclinação. A gravação é **H1** (celular) | E2E-01 | sim |
| M7 | completar a volta e tocar `#lap-share` (Web Share) | `#lap-result-setup` = `arcade-assistido-v5`; a folha de compartilhamento do sistema recebe `Kartle · synthetic v2 · <m:ss.mmm> · arcade-assistido-v5` | NFR-0009 / AC-US-0005-05: `setupVersion` em texto; 0 comparações; 0 campos pessoais. A observação completa é **H2** | E2E-02 | sim |
| M8 | com a inclinação ativa, uma volta inteira com esterço parcial (inclinação leve) em todas as curvas, acelerador cheio | o texto de aderência nunca mostra "Saindo de traseira" nem "Derrapando" sem esterço cheio; a traseira só é forçada com acelerador cheio **e** esterço cheio acima de 50 km/h (RULE-0001) | NFR-0003 / AC-US-0003-02: 0 passos de traseira forçada com esterço parcial. É a **H3** | E2E-03 | não |
| M9 | uma volta completa com medida de fps no aparelho nomeado (ferramenta remota do navegador), página em primeiro plano | fps médio e mínimo | RNF03: 30 fps; uma medida em desktop não vale (I9). É a **H4** (celular) | — | não |

## Verificação em produção

Depois da promoção: D1 a D8 e D10 em `web-desktop`; M1 a M7 em `web-mobile`. Qualquer limiar cruzado é gatilho de
reversão (`runbook.md`, *Roll back*).

## Limites desta lista

- `check_served.py` e `check_bundle.py` provam o **servido** e o **empacotado** (hash, elementos, identificadores, bloco
  de linha de base), não o comportamento: não executam a página, não medem ritmo nem leem o console. O comportamento é
  provado por `npm test` (237 verificações, 65 desta feature) nas regras, e por estas linhas e por H1–H5 na tela.
- Nenhuma verificação acima é automatizada de ponta a ponta: o projeto não tem ferramenta de E2E e a feature não
  acrescenta dependência (`test-strategy.md`). A medição de ritmo sob automação do navegador falhou na release anterior
  (1–2 quadros/s sob `requestAnimationFrame` automatizado) e não é tentada de novo: D12/M9 são humanas.
- O `href="/"` da marca e a requisição a `fonts.googleapis.com` no carregamento são divergências aceitas em 2026-10-21
  (DIV-DP-12, DIV-DP-14 de `race-lap-validation`); nenhuma linha acima depende deles.
- O crédito OSM e o aviso ODbL continuam não exigidos (0 dado OSM; D-DP-04 ratificado); a linha D14/M12 da release
  anterior não mudou de resultado e não é repetida aqui.
