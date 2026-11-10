---
title: Registro de divergências e de critérios não verificados em npm test
feature: apresentacao-e-som
stage: test
status: draft
version: 1.0.0
---

# 98 — Divergências

A execução de 2026-11-10 (`runs/test-run-20261110-1853.spec.log` e `.junit.xml`) coletou 562 verificações, todas
aprovadas; as 85 desta feature estão entre elas. Nenhuma verificação reprova e nenhuma foi retirada.

## Critérios sem verificação em `npm test` — só roteiro em aparelho

Estes critérios só são observáveis no navegador, no aparelho ou pelo ouvido. A estratégia validada os atribui a
roteiros registrados em `docs/apresentacao-e-som-device-log.md`. **Nenhum roteiro foi executado**: enquanto a linha do
roteiro não tiver uma execução registrada, o critério está **não verificado**, não coberto.

| Critério | O que falta observar | Roteiro | Estado |
|---|---|---|---|
| AC-US-0001-05 | o ícone não contém texto | E2E-12 | não verificado |
| AC-US-0002-06 | a capa não contém texto dentro da imagem | E2E-12 | não verificado |
| NFR-0003, linha "sem rede" | motor e pneu tocam com a rede do aparelho desligada depois de abrir | E2E-09, nos dois canais | não verificado |
| NFR-0005 | 60 fps no notebook de referência e 30 fps no celular de referência, com os sons tocando | E2E-10, E2E-11 | não verificado |
| NFR-0008 | 0 marcas, 0 logotipos, 0 textos de terceiros na capa e no ícone, com data e nome de quem inspecionou | E2E-12 | não verificado |
| NFR-0010 | nenhuma promoção para produção antes da confirmação da licença em `DOMAIN.md` | registro de liberação da etapa de deploy (fora desta etapa) | não verificado nesta etapa: é condição de liberação (DES-0005) |

Aprovação de que estes critérios fiquem fora de `npm test`: a estratégia de testes 1.1.0, validada em
`dspec-validation-20261110-1755`, que os declara alcançáveis só por roteiro registrado (I9).

## Critérios com verificação em `npm test` e parte só observável em aparelho

A verificação em `npm test` decide o que o documento declara, o que o código pede à saída de áudio e o que a medida do
build encontra; a parte abaixo fica para o roteiro, também ainda **não executado**.

| Critério | Decidido em `npm test` | Parte que só o roteiro observa | Roteiro |
|---|---|---|---|
| AC-US-0001-01, AC-US-0001-02 | o documento declara o ícone entregue como ícone de página | a aba mostra o ícone | E2E-01, E2E-02 |
| AC-US-0001-03 | o documento declara o mesmo ícone para o atalho | o atalho da tela de início mostra o ícone | E2E-03 |
| AC-US-0001-04, AC-US-0002-05 | os resumos de origem e de forma entregue, as dimensões e a proporção | a imagem entregue é visualmente a da origem | E2E-12 |
| AC-US-0002-01, AC-US-0002-03, AC-US-0002-04 | as três declarações de prévia, com os valores exatos | um serviço de prévia mostra capa, título e descrição | E2E-04 |
| AC-US-0002-07 | nenhum script ou folha de estilo nomeia a capa; o `body` não a referencia | nenhuma tela a mostra | E2E-05 |
| AC-US-0003-01 a AC-US-0003-10 | os estados, os ganhos, o tom, as rampas e os prazos pedidos à saída de áudio; a gravação entregue byte a byte | o que se ouve: motor contínuo, sem buraco na repetição, tom e volume | E2E-06 |
| AC-US-0004-01 a AC-US-0004-06 | o mesmo, para o pneu; a composição de `src/main.ts` como texto | o pneu ouvido enquanto a marca aparece na tela | E2E-07 |
| NFR-0003, linha "pedidos" | nenhuma API de rede no texto do código; nenhum endereço de som no documento | o registro de rede do navegador, da abertura ao fim de uma volta | E2E-08 |
| NFR-0007 | os ensaios da zebra de `pista-kart-park`; o texto da zebra igual ao de antes; nenhum arquivo de som da zebra | o som da zebra ouvido como antes | E2E-13 |

A composição da leitura do quadro em `src/main.ts` (AC-US-0004-01, AC-US-0004-04) não é executada por `npm test`, que
não carrega `src/main.ts`: o nível declarado pela estratégia é contrato de texto (CHK-TEST-0004-10, -11) mais E2E-07.
CHK-TEST-0003-08 executa o bloco de marca real e monta a mesma conjunção num ajudante de teste, mas não substitui a
observação no aparelho.

## Verificação de outra feature modificada

CHK-TEST-0008-07 de `pista-kart-park` foi migrada sob o mesmo identificador, com aprovação do dono do produto de
2026-11-10 registrada em `200 Requirements/220 Input/apresentacao-e-som/DOMAIN.md`; o que mudou e por que os critérios
AC-US-0005-11 e AC-US-0005-12 daquela feature continuam cobertos está na tabela "Migração" do changelog. Nenhum
critério ficou sem verificação por causa dela.
