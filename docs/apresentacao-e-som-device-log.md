# Registro de testes em aparelho — apresentacao-e-som

Roteiros `E2E-nn` da estratégia de testes (`300 Specs/330 D-Specs/Output/apresentacao-e-som/test-strategy.md`). O que só
existe no navegador ou no aparelho — a aba, o atalho, a prévia, o que se ouve, a rede, a taxa de quadros — é provado
aqui, por uma pessoa, no aparelho nomeado. Uma linha por execução; o que não foi executado fica marcado como tal:
**ausência de registro nunca vale como aprovação**, e uma execução em desktop não preenche a linha de celular (I9).

**Estado em 2026-11-10: nenhum roteiro foi executado.** Este arquivo foi criado pela etapa de testes só com os roteiros e
os campos vazios. A automação de navegador disponível roda `requestAnimationFrame` a 1–2 fps e não tem saída de áudio:
não serve para nenhuma linha abaixo.

## Como registrar uma execução

Acrescente uma linha na tabela "Execuções" para cada roteiro executado em cada aparelho, com:

| Campo | O que escrever |
|---|---|
| Roteiro | o identificador `E2E-nn` |
| Data | a data da execução |
| Canal | `web-desktop`, `web-mobile` ou "link compartilhado" |
| Aparelho e navegador | o modelo do aparelho e o navegador com a versão; nos roteiros E2E-10 e E2E-11, o notebook e o celular de referência de RNF03 pelo nome |
| Build | o endereço aberto e o nome do JS em `dist/assets/` (por exemplo `index-XXXXXXXX.js`) |
| Operador | o nome de quem executou |
| Medido | o que foi observado ou medido, nas palavras de quem executou; números quando o roteiro pede número |
| Resultado | `passa`, `falha` ou `não observável neste aparelho`, com o motivo |

## Roteiros

| Id | Canal | Passos | Resultado esperado | Critérios |
|---|---|---|---|---|
| E2E-01 | `web-desktop`: Chrome, Edge, Firefox e Safari atuais | abrir o endereço de staging em cada navegador | a aba mostra o ícone do Kartle | AC-US-0001-01 |
| E2E-02 | `web-mobile`: Chrome no Android e Safari no iOS | abrir o endereço de staging | a aba mostra o ícone | AC-US-0001-02 |
| E2E-03 | `web-mobile` | usar "adicionar à tela de início" e olhar a tela de início do aparelho | o atalho mostra o ícone | AC-US-0001-03 |
| E2E-04 | link compartilhado | colar o endereço de staging em ao menos dois aplicativos ou sites que montam prévia, nomeados | capa, título "Kartle" e a descrição "Corra contra o relógio em uma pista de kart e busque a sua melhor volta."; registrar, por serviço, se a imagem apareceu | AC-US-0002-01, AC-US-0002-03, AC-US-0002-04 |
| E2E-05 | `web-desktop` e `web-mobile` | percorrer a tela inicial, o início de volta, a corrida, a pausa e o resultado | nenhuma tela mostra a capa | AC-US-0002-07 |
| E2E-06 | `web-desktop` e `web-mobile` | abrir (som desligado); recarregar e conferir que abre desligado de novo; ligar o som; pilotar parado, acelerando, a baixa e a alta velocidade; pausar; retomar; reposicionar; terminar a volta; desligar o som no meio de uma volta | motor de kart gravado, contínuo, sem buraco na repetição, mais agudo com a velocidade, mais alto com o acelerador; silêncio na pausa, no reposicionamento e no resultado; silêncio imediato ao desligar; nenhum tom sintetizado | AC-US-0003-01 a AC-US-0003-10 |
| E2E-07 | `web-desktop` e `web-mobile` | com o som ligado, provocar deslizes com marca no asfalto, curtos e longos; rodar sem deslizar; parar; desligar o som no meio de um deslize | pneu cantando enquanto a marca aparece na tela; silêncio logo depois; nenhum som de pneu parado, sem deslize ou com o som desligado | AC-US-0004-01 a AC-US-0004-06 |
| E2E-08 | `web-desktop` e `web-mobile` | abrir o registro de rede do navegador antes de abrir o jogo; acompanhar da abertura até o fim de uma volta completa com o som ligado e ao menos um deslize | o ícone e a capa pedidos uma vez cada, na abertura; nenhum pedido com endereço de som em momento algum; 0 pedidos de som ou imagem depois de o jogo abrir | NFR-0003 (pedidos) |
| E2E-09 | `web-desktop` e `web-mobile` | desligar a rede do aparelho depois de o jogo abrir; fazer uma volta completa com o som ligado e um deslize | motor e pneu tocam; 0 sons em falta | NFR-0003 (sem rede) |
| E2E-10 | `web-desktop`, notebook de referência de RNF03 | medir os quadros por segundo ao longo de uma volta completa com o som ligado, o motor tocando e ao menos um deslize com som de pneu | 60 fps sustentados | NFR-0005 |
| E2E-11 | `web-mobile`, celular intermediário de referência de RNF03 | o mesmo | 30 fps sustentados | NFR-0005 |
| E2E-12 | — | inspeção visual de `src/assets/icon.png` e de `src/assets/cover.jpg`, comparando cada um com a origem (`docs/art/icon.png`, `docs/art/cover.png`); registrar a data, o nome de quem inspecionou e o resumo SHA-256 de cada arquivo inspecionado | a mesma imagem da origem; 0 marcas, 0 logotipos, 0 textos de terceiros; 0 textos no ícone e na capa | AC-US-0001-04, AC-US-0001-05, AC-US-0002-05, AC-US-0002-06, NFR-0008 |
| E2E-13 | `web-desktop` e `web-mobile` | com o som ligado, passar com roda na zebra, com e sem deslize | o som da zebra como antes; pode tocar junto com o pneu | NFR-0007 |

E2E-14 foi retirado da estratégia em 2026-11-10 e o identificador não é reaproveitado.

Resumos a citar em E2E-12, os de `src/assets/feature-assets.json` (conferidos contra os arquivos por CHK-TEST-0005-05):

| Arquivo | SHA-256 |
|---|---|
| `src/assets/icon.png` | `c41595441bbcf490af8958a9e612cdfbd54944303fac94961d1aaa32301ca28c` |
| `src/assets/cover.jpg` | `28ed9c012cf24fc77c7fe40278aa9d6cc12475bc5bba9ed8b922bd01e1ee9e40` |

## Execuções

| Roteiro | Data | Canal | Aparelho e navegador | Build | Operador | Medido | Resultado |
|---|---|---|---|---|---|---|---|
| E2E-01 | — | `web-desktop` | — | — | — | — | **não executado** |
| E2E-02 | — | `web-mobile` | — | — | — | — | **não executado** |
| E2E-03 | — | `web-mobile` | — | — | — | — | **não executado** |
| E2E-04 | — | link compartilhado | — | — | — | — | **não executado** |
| E2E-05 | — | `web-desktop` | — | — | — | — | **não executado** |
| E2E-05 | — | `web-mobile` | — | — | — | — | **não executado** |
| E2E-06 | — | `web-desktop` | — | — | — | — | **não executado** |
| E2E-06 | — | `web-mobile` | — | — | — | — | **não executado** |
| E2E-07 | — | `web-desktop` | — | — | — | — | **não executado** |
| E2E-07 | — | `web-mobile` | — | — | — | — | **não executado** |
| E2E-08 | — | `web-desktop` | — | — | — | — | **não executado** |
| E2E-08 | — | `web-mobile` | — | — | — | — | **não executado** |
| E2E-09 | — | `web-desktop` | — | — | — | — | **não executado** |
| E2E-09 | — | `web-mobile` | — | — | — | — | **não executado** |
| E2E-10 | — | `web-desktop` | — | — | — | — | **não executado** |
| E2E-11 | — | `web-mobile` | — | — | — | — | **não executado** |
| E2E-12 | — | — | — | — | — | — | **não executado** |
| E2E-13 | — | `web-desktop` | — | — | — | — | **não executado** |
| E2E-13 | — | `web-mobile` | — | — | — | — | **não executado** |
