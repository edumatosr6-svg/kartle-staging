---
id: DES-0005
title: Privacidade, rede, marcas de terceiros e licença
feature: apresentacao-e-som
stage: dspec
status: validated
version: 1.1.0
sources: [FEAT-0005, RULE-0003, REQ-FEAT-0005-03, REQ-FEAT-0005-13, REQ-FEAT-0005-16]
---

# DES-0005 — Privacidade, rede, marcas de terceiros e licença

## Realiza

- Nenhum pedido de rede para som ou imagem depois de o jogo abrir (REQ-FEAT-0005-03).
- Capa e ícone sem marca, logotipo ou texto de terceiros, por inspeção registrada (REQ-FEAT-0005-13), e sem
  texto (REQ-FEAT-0001-04 e REQ-FEAT-0002-06, realizados em
  [DES-0001](../web/DES-0001-arquivos-entregues-e-declaracoes-da-pagina.md) e conferidos pela mesma inspeção).
- Nenhuma promoção para produção antes da confirmação da licença (REQ-FEAT-0005-16).

## Posicionamento

Item transversal, sem módulo de código próprio. Os pontos de aplicação são: `index.html` e
`src/audio.ts` (rede), `docs/apresentacao-e-som-device-log.md` (inspeção) e o registro de liberação da etapa
de deploy (licença). Camada **aplicação** (mapa das diretrizes) para o item inteiro; o registro de
aparelho fica na árvore `docs/` e o registro de liberação na etapa de deploy, os dois fora de `src/`.

## Interface

### Sessão e papéis

Não há caminho autenticado. O produto não tem conta, sessão nem papel além de `player`, anônimo (API-0001,
API-0002, API-0003). Por isso não existe ponto de verificação de sessão nem de papel a nomear: `setSoundOn`
é chamado só pelo manipulador de clique do controle `#sound` em `src/main.ts`, e o único estado que muda é o
do som na página aberta. Não há webhook, e não há segredo: a feature não lê variável de ambiente nem chave.

### Rede

| Regra | Onde é garantida |
|---|---|
| Todo arquivo da feature sai da mesma origem do jogo | `index.html` referencia só `/src/assets/` para as 2 imagens; as 2 gravações não têm endereço: vêm dentro do JS do jogo (importação `?inline`); nenhum endereço de outro domínio entra |
| Os 4 arquivos chegam no download inicial | as 2 imagens, pelos elementos `link` de [DES-0001](../web/DES-0001-arquivos-entregues-e-declaracoes-da-pagina.md), pedidos pelo documento ao abrir; as 2 gravações, embutidas no JS de entrada que o documento manda buscar |
| O código da aplicação não usa a rede | `src/audio.ts` e `src/main.ts` não usam nenhuma API de rede nem de armazenamento, por nenhum caminho ([DES-0003](../web/DES-0003-saida-de-audio-gravacoes-e-controle-de-som.md)); garantem-no as verificações validadas CHK-TEST-0011-02 (`pista-kart-park`) e CHK-TEST-0013-03 (`race-lap-validation`), que este projeto não migra nem contorna |
| Depois de abrir, nenhum pedido | `RaceAudio.loadRecordings` decodifica o que já está em memória, uma vez, na avaliação do módulo, sem nova tentativa; o jogo não cria elemento que referencie a capa, o ícone ou um som por endereço |
| Nenhum dado sai do aparelho | os únicos pedidos da feature são os `GET` do próprio documento para as 2 imagens, sem corpo, sem parâmetro de consulta e sem cabeçalho próprio; nada do Jogador é transmitido (I6, D-DS-04) |

### Inspeção visual das duas imagens

Registrada em `docs/apresentacao-e-som-device-log.md`, roteiro de inspeção de
[test-strategy.md](../test-strategy.md), sobre `src/assets/icon.png` e `src/assets/cover.jpg` — a forma
entregue. Campos da linha: data; nome de quem inspecionou; `deliveredSha256` de cada imagem; contagem de
marcas, de logotipos e de textos de terceiros (as três têm de ser 0); contagem de qualquer texto no ícone e
na capa (0 nas duas).

O nome registrado é o de um membro da equipe, exigido por REQ-FEAT-0005-13; não é dado de jogador. Uma imagem
cujo resumo mudou depois da inspeção precisa de inspeção nova: o teste de `npm test` compara o resumo
inspecionado com o de `feature-assets.json`.

### Licença e promoção

| `licenseStatus` | Como é lido | Staging | Produção |
|---|---|---|---|
| `LICENSE_PENDING` | não há entrada de confirmação da licença, com data, no `DOMAIN.md` da feature | permitida | bloqueada |
| `LICENSE_CONFIRMED` | a entrada existe | permitida | permitida, atendidos os demais requisitos |

Ponto de aplicação: o item de liberação da etapa de deploy. O mesmo build serve staging e produção; não há
chave no código nem variável de build que troque de comportamento por ambiente. Quem promove para produção
— decisão humana, como hoje — confere a entrada no `DOMAIN.md` e escreve no registro de liberação a data da
confirmação antes da data da promoção. Sem essa linha no registro, a promoção não acontece. A etapa de
deploy leva essa condição no roteiro de liberação desta feature.

O que muda se os termos não permitirem o uso num jogo publicado não é decidido aqui (FEAT-0005): o estado
continua `LICENSE_PENDING`.

## Colaboradores

A etapa de testes escreve as linhas de inspeção e de rede no registro de aparelho; a etapa de deploy escreve
o registro de liberação; o dono do produto escreve a confirmação no `DOMAIN.md`. Nenhum módulo do jogo lê
`licenseStatus`.

## Estado e concorrência

`licenseStatus` é fato registrado, não estado do jogo. A transição é idempotente: registrar de novo a mesma
confirmação não muda nada; não há transição de volta. A inspeção é por resumo de arquivo: repetir sobre o
mesmo arquivo dá a mesma linha.

## Comportamento em falha

| Falha | Comportamento |
|---|---|
| Marca, logotipo ou texto achado na inspeção | a imagem é trocada na origem, a forma entregue é refeita, o registro de origem é atualizado e a inspeção é repetida |
| Pedido de rede para uma das 2 imagens depois de abrir, ou qualquer pedido de som, em qualquer momento | o roteiro de rede falha; corrige-se o ponto que pediu, sem carregamento sob demanda |
| Licença não confirmada na hora da promoção | staging segue; produção espera |

O registro de aparelho e o de liberação carregam identificadores (roteiro, build, resumo, data), nunca
conteúdo de jogador nem segredo (I6, D-DS-06).

## Feature flag

Nenhuma: não há comportamento a ligar. O bloqueio de produção é uma condição de liberação, não uma
configuração do jogo (FEAT-0005, Configuração).

## Pontos em aberto

Nenhum.
