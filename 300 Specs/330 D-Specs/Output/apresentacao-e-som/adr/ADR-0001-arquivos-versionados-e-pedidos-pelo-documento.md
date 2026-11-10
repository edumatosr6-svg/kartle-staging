---
id: ADR-0001
title: Formas entregues versionadas em src/assets — imagens pedidas pelo documento, gravações embutidas no JS
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.1.0
sources: [RULE-0003, API-0001, REQ-FEAT-0002-01, REQ-FEAT-0005-02, REQ-FEAT-0005-03, REQ-FEAT-0005-04]
---

# ADR-0001 — Formas entregues versionadas em `src/assets/`: imagens pedidas pelo documento, gravações embutidas no JS

## Contexto

O F-Spec pede 4 arquivos na forma entregue, somando no máximo 300.000 bytes, **todos dentro do download
inicial** — inclusive a capa, que nenhuma tela mostra — e nenhum pedido de som ou imagem depois de o jogo
abrir. As origens em `docs/` pesam 5,2 MB e 6,2 MB (imagens) e 115 kB (sons). O projeto não tem `public/`,
não tem `vite.config` e não tem biblioteca de imagem; a lista de dependências de execução não pode crescer.

Duas verificações validadas de outras features leem o texto do código e reprovam qualquer uso de rede ou de
armazenamento do navegador pela aplicação: CHK-TEST-0011-02 de `pista-kart-park`
(`tests/pista-kart-park-layering.test.ts:37-38` e `:58-66`: `fetch`, `XMLHttpRequest`, `WebSocket`,
`localStorage`, `sessionStorage`, `indexedDB`, `navigator.sendBeacon` e `EventSource` em `src/audio.ts` e em
`src/main.ts`, e importação dinâmica em `src/main.ts`) e CHK-TEST-0013-03 de `race-lap-validation` (a mesma
lista, sem `EventSource`, em `src/main.ts`). A versão 1.0.0 desta decisão mandava `src/audio.ts` ler as
gravações com `fetch` e não registrava o conflito; a etapa de código parou em FAIL SPEC
(`reports/feedback/feedback-20261110-1745.md`, SPEC-ISSUE-01).

Decisão do dono do produto, em 2026-11-10: as duas gravações vão **embutidas no pacote JavaScript do
download inicial**, sem `fetch` nem qualquer requisição de rede feita pelo código para buscá-las; a rota com
`fetch` e `preload as="fetch"` é abandonada; nenhum teste validado de outra feature é migrado por causa da
rota de entrega, e o projeto passa nas duas verificações como estão, sem contorná-las.

## Decisão

1. As formas entregues são produzidas uma vez, fora do build, e **versionadas** em `src/assets/`, com o
   registro de origem `feature-assets.json`
   ([DM-0001](../data/DM-0001-registro-de-origem-dos-arquivos-e-estado-do-som.md)). As 4 origens em `docs/`
   também são versionadas.
2. **Imagens: pedidas pelo documento.** `index.html` referencia o ícone por `rel="icon"` e a capa por
   `rel="preload"`, que o navegador busca ao abrir a página
   ([DES-0001](../web/DES-0001-arquivos-entregues-e-declaracoes-da-pagina.md)). O Vite, sem configuração,
   emite cada imagem em `dist/assets/` com o resumo do conteúdo no nome; os endereços declarados no documento
   são relativos à raiz do site.
3. **Gravações: embutidas no JS.** `src/main.ts` importa `./assets/engine-loop.mp3?inline` e
   `./assets/tire-screech.mp3?inline`, por importação estática. O Vite põe os bytes de cada arquivo, sem
   alterá-los, como texto `data:` em base 64 dentro do JS de entrada — o mesmo JS que `index.html` manda
   buscar. As gravações não têm endereço próprio, não são emitidas como arquivo em `dist/` e não são pedidas
   por ninguém: chegam com o script
   ([DES-0003](../web/DES-0003-saida-de-audio-gravacoes-e-controle-de-som.md)).
4. **Nenhuma API de rede no código da aplicação.** `src/audio.ts` e `src/main.ts` não usam nenhum símbolo
   das listas das duas verificações, nem por `globalThis`, nem por nome montado, nem em texto; `src/main.ts`
   não ganha importação dinâmica. CHK-TEST-0011-02 e CHK-TEST-0013-03 continuam valendo como estão.
5. A forma entregue de cada gravação continua sendo o arquivo MP3 de `src/assets/`, cópia byte a byte da
   origem (`DOMAIN/DEC-02`): a base 64 é a codificação de transporte dentro do JS, não uma transformação do
   arquivo. `featureAssetBytes` soma os bytes da forma entregue; o peso do transporte entra em
   `initialDownloadBytes` ([DES-0004](../web/DES-0004-verificacoes-registros-e-medida-do-build.md)).
6. Não se cria manifesto de aplicativo nem declaração `twitter:`.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Ler as gravações com `fetch` em `src/audio.ts`, com `preload as="fetch"` no documento (a versão 1.0.0) | reprova CHK-TEST-0011-02; mantê-la exigiria migrar uma verificação validada de outra feature e reinterpretar o NFR-0004 dela — recusado pelo dono do produto em 2026-11-10 |
| Chamar a rede de modo que a verificação de texto não alcance (`globalThis.fetch`, nome montado, elemento `<audio src>`) | cumpre a letra e burla a intenção de uma verificação validada; recusado pelo dono do produto |
| Importação dinâmica de um módulo só com os sons | é pedido de rede feito pelo código depois de o script rodar, e CHK-TEST-0011-02 proíbe `import(` em `src/main.ts` |
| Converter as imagens no build, por script | exige biblioteca de imagem; o Node não tem uma; uma dependência de desenvolvimento nova para converter dois arquivos uma vez não se paga |
| Pasta `public/` com nomes fixos | muda a estrutura do projeto e tira o resumo do nome: um arquivo trocado continuaria no cache do navegador com o conteúdo antigo |
| Embutir também as imagens | o ícone e a capa são lidos pelo navegador e pelos serviços de prévia por endereço; um endereço `data:` em `og:image` não é aceito por serviço de prévia |
| Buscar a capa pelo script e descartar | usaria rede no código, que as verificações proíbem; o `preload` do documento tem o mesmo efeito sem código |
| Endereço absoluto em `og:image` | o endereço público do jogo não é conhecido pelo projeto (o provedor de publicação está em aberto nas diretrizes) e staging e produção servem o mesmo build; fixar um domínio no documento quebraria um dos dois |
| Manifesto de aplicativo para o atalho | um quinto arquivo e um contrato novo; `apple-touch-icon` já é lido pelo Safari do iOS e pelo Chrome do Android para o atalho |

## Consequências

- O repositório cresce cerca de 11,6 MB com as origens e cerca de 0,23 MB com as formas entregues.
- Trocar uma imagem ou um som exige refazer a forma entregue à mão e atualizar o registro de origem; a
  verificação de resumos acusa o esquecimento.
- Fatos medidos nesta rodada: as duas gravações somam 115.387 bytes (70.998 e 44.389); em base 64 viram
  153.852 caracteres (94.664 e 59.188) dentro do JS; esse texto, comprimido em gzip de nível máximo, pesa
  114.191 bytes — a base 64 de um MP3 volta a cerca do tamanho original quando comprimida. O download inicial
  cresce cerca de 224 kB (de cerca de 187 kB para cerca de 410 kB), dentro dos 3 MB. Todo Jogador baixa a
  capa sem vê-la: é o que o F-Spec pede (RULE-0003).
- Mesmo contando o texto em base 64 no lugar dos bytes do MP3, os 4 arquivos somam 263.227 (36.674 + 72.701
  do ensaio das imagens + 153.852), abaixo dos 300.000 de REQ-FEAT-0005-02. A medida oficial conta os bytes
  da forma entregue (decisão 5).
- O JS de entrada cresce cerca de 154 kB sem compressão, e o navegador o lê inteiro antes de o jogo abrir:
  os sons deixam de baixar em paralelo ao script. Em troca, não existe estado em que o jogo abriu e um som
  ainda está a caminho: o prazo de carregamento, o cancelamento e os motivos `http` e `timeout` da versão
  1.0.0 saem do projeto. O caso "tempo esgotado ao carregar o som na abertura" do F-Spec passa a coincidir
  com o JS não chegar — e aí o jogo não abre (FLOW-0001).
- A medida do build deixa de achar os sons como arquivos de `dist/`: acha os bytes embutidos no JS do
  download inicial, pelo resumo ([DES-0004](../web/DES-0004-verificacoes-registros-e-medida-do-build.md)).
- Os dois textos em base 64 ficam em memória junto do módulo enquanto a página está aberta (cerca de 154 kB
  de caracteres), além dos buffers decodificados.
- O navegador pode avisar no console que a capa pré-carregada não foi usada. O aviso é esperado e inofensivo.
- **Serviços de prévia que só aceitam endereço absoluto em `og:image` mostram a prévia sem imagem**, com o
  título e a descrição — o caso "prévia sem imagem" que FEAT-0002 já admite. Os critérios do F-Spec são
  atendidos (a declaração existe e resolve para a capa), mas o Visitante desses serviços não vê a capa. Fechar
  isso pede o endereço público como entrada do build, que o F-Spec não nomeia: proposta para o
  `SCOPE-BACKLOG.md` do autor, registrada no changelog deste conjunto.
- Fato conferido no Vite 8 instalado: o sufixo `?inline` é reconhecido (`inlineRE` em
  `node_modules/vite/dist/node/chunks/node.js`) e embute o arquivo qualquer que seja o tamanho, sem
  `vite.config`.

## Estado

Aceita. Substitui a versão 1.0.0 (gravações lidas por `fetch`), abandonada em 2026-11-10.
