---
title: Contexto — apresentação e som
feature: apresentacao-e-som
stage: req
status: validated
version: 1.1.0
sources: [SEED, DOMAIN]
---

# Contexto

## O que é a feature

O Kartle passa a ter identidade visual e som de kart (`SEED.md`, Visão geral). A aba do navegador e o
atalho no celular mostram um ícone próprio (US-0001), o link compartilhado mostra uma capa com o nome do
jogo (US-0002), e o Jogador ouve um motor de kart gravado (US-0003) e o pneu cantando quando o kart
desliza (US-0004). Os sons gravados entram no lugar do tom sintetizado do motor.

O seed declara, na seção Contexto, o ponto de partida: o jogo é todo desenhado e sintetizado em código e
não entrega nenhum arquivo de imagem nem de som; não tem ícone nem capa; o download inicial medido no
build de 2026-11-06 soma 186.291 bytes comprimidos. O som do motor existe desde antes do pipeline e não
pertencia a nenhuma feature especificada: **esta feature passa a ser a dona dele**. O som da zebra
pertence a `pista-kart-park` (US-0005 daquele conjunto) e não muda (NFR-0007).

Os arquivos de origem foram gerados por IA em 2026-11-10 e estão em `docs/art/` (capa `cover.png` e ícone
`icon.png`) e em `docs/sfx/` (motor `engine-loop.mp3` e pneu `tire-screech.mp3`, `DOMAIN/DEC-02`).

**Compatibilidade.** O som continua começando desligado e só liga por ação do Jogador, como antes da
feature (US-0003). Nenhum contrato publicado (arquivo de pista, dado persistido, texto compartilhado)
muda: som e imagem são apresentação (I2, NFR-0009). O som da zebra continua o mesmo (NFR-0007).

**Padrão seguro.** A feature vale assim que entregue em staging. É segura ligada porque o som começa
desligado (US-0003), a simulação, a volta e o tempo não dependem de som nem de imagem (NFR-0004,
NFR-0009) e o jogo continua funcionando sem rede depois de aberto (NFR-0003). A promoção para produção
espera a confirmação da licença dos arquivos gerados por IA (NFR-0010).

Seed: `200 Requirements/220 Input/apresentacao-e-som/SEED.md`, `revision: 2`, `date: 2026-11-10`, autor
`eduardo.matos`. A mesma pasta traz `DOMAIN.md`, a camada de domínio durável: as decisões do dono do
produto registradas ali prevalecem sobre os pontos em aberto correspondentes do seed.

## Atores e canais

| Ator | Canal | Papel nesta feature |
|---|---|---|
| Jogador | `web-desktop` | Vê o ícone na aba, liga o som e ouve motor e pneu enquanto pilota |
| Jogador | `web-mobile` | O mesmo no celular, e vê o ícone ao adicionar o jogo à tela de início |
| Visitante | link compartilhado | Vê a capa e o nome do jogo na prévia do link, antes de abrir o jogo |

O Visitante não usa um canal do jogo: ele vê a prévia que um aplicativo ou site monta a partir do que a
página do jogo declara. Por isso os critérios 01 a 06 de US-0002 são observados no documento da página
entregue, que é o mesmo em `web-desktop` e `web-mobile`.

Canal fora do escopo: `remote-wheel` (pós-MVP, I10). Nenhuma história deste conjunto o cobre.

Em US-0003 e US-0004 o comportamento do som é o mesmo em `web-desktop` e `web-mobile`. Em US-0001 a aba
mostra o ícone nos dois canais, e o atalho da tela de início é só de `web-mobile`. Nenhuma história deste
conjunto usa o sensor de inclinação; em `web-mobile`, com sensor ausente ou permissão negada, o controle
recai para toque com estado visível (I4, `[DOMAIN]`) e ícone, capa e sons não mudam.

## Itens do seed e decisões de domínio (chave de rastreabilidade)

Os rótulos abaixo nomeiam os itens do seed e as decisões de `DOMAIN.md`, que não têm identificador
próprio. O `sources:` de cada história e de cada NFR os cita, e a matriz gerada (`99-traceability.md`)
liga cada rótulo aos itens deste conjunto. Um item que uma revisão do seed acrescenta recebe o próximo
número livre da sua família; o rótulo de um item retirado não é reaproveitado. Por isso `SEED/FE-07`, que
a revisão 2 acrescentou, vem depois de `SEED/FE-06` mesmo estando antes dele no texto do seed. As
decisões de `DOMAIN.md` são numeradas na ordem do arquivo.

| Rótulo | Item |
|---|---|
| `SEED/VG` | Visão geral: identidade visual e som de kart; motor gravado no lugar do tom sintetizado |
| `SEED/CTX` | Contexto: download inicial de 186.291 bytes comprimidos em 2026-11-06; esta feature é a dona do som do motor; arquivos de origem em `docs/art/` e `docs/sfx/`, gerados por IA em 2026-11-10 |
| `SEED/US-1` … `SEED/US-4` | As quatro histórias de usuário, na ordem do seed: ícone, capa na prévia do link, motor, pneu |
| `SEED/RD-01` | Som e imagem são apresentação: a simulação, a volta e o tempo não dependem deles (I2) |
| `SEED/RD-02` | O pneu canta na mesma situação em que o kart deixa marca de pneu (decisão desta feature) |
| `SEED/RD-03` | O som da zebra continua o ruído curto e grave definido em `pista-kart-park` (US-5 daquele seed) |
| `SEED/NF-01` | Download inicial, com capa, ícone e sons, menor que 3 MB comprimidos (RNF02) |
| `SEED/NF-02` | Peso somado dos arquivos desta feature, como entregues ao navegador, de no máximo 300.000 bytes |
| `SEED/NF-03` | Nenhuma requisição de rede para buscar som ou imagem desta feature depois de o jogo abrir (RNF08) |
| `SEED/NF-04` | Determinismo: mesmas entradas, mesmo tempo e mesmos setores com o som ligado e desligado (RNF07) |
| `SEED/NF-05` | Os limites de taxa de quadros de RNF03 já especificados continuam valendo com os sons tocando |
| `SEED/RE-01` | O som da zebra não muda |
| `SEED/RE-02` | Nenhuma dependência nova de execução |
| `SEED/RE-03` | Os sons e as imagens vêm dentro do download inicial |
| `SEED/RE-04` | Nenhuma imagem desta feature traz marca, logotipo ou texto de terceiros |
| `SEED/IM-I2` | Som e imagem ficam do lado da apresentação; nenhum dado de simulação muda |
| `SEED/RI-01` | Primeiro ponto de Riscos e incógnitas: capa dentro do jogo. Fechado em 2026-11-10: a capa aparece só na prévia do link |
| `SEED/RI-02` | Segundo ponto de Riscos e incógnitas: qualidade dos sons. Fechado em 2026-11-10: os dois arquivos foram ouvidos e servem como estão |
| `SEED/RI-03` | Terceiro ponto de Riscos e incógnitas: licença dos arquivos gerados por IA (Higgsfield, 2026-11-10). O dono do produto confirma nos termos do plano; bloqueia só a promoção para produção; staging pode usar os arquivos |
| `SEED/FE-01` | Fora do escopo: texturas da pista |
| `SEED/FE-02` | Fora do escopo: música, som de batida, som de grama e som de largada |
| `SEED/FE-03` | Fora do escopo: som da zebra por arquivo |
| `SEED/FE-04` | Fora do escopo: tela de abertura animada, vídeo ou trailer dentro do jogo |
| `SEED/FE-05` | Fora do escopo: controle de volume |
| `SEED/FE-06` | Fora do escopo: céu de fundo e cenário |
| `SEED/FE-07` | Fora do escopo: capa dentro do jogo (acrescentado na revisão 2) |
| `DOMAIN/DEC-01` | 2026-11-10: a capa aparece só na prévia do link; nenhuma tela do jogo mostra a capa |
| `DOMAIN/DEC-02` | 2026-11-10: os dois sons foram ouvidos e servem como estão: `docs/sfx/engine-loop.mp3` e `docs/sfx/tire-screech.mp3` |
| `DOMAIN/DEC-03` | 2026-11-10: a licença dos arquivos gerados por IA é confirmada pelo dono do produto, nos termos do plano do Higgsfield, antes da promoção para produção; bloqueia só a produção; especificação, código e staging seguem |

## Regras de domínio (do seed)

| Regra | Fonte declarada no seed | Onde está neste conjunto |
|---|---|---|
| Som e imagem são apresentação: a simulação, a volta e o tempo não dependem deles (`SEED/RD-01`) | I2 | NFR-0004, NFR-0009; casos anormais das quatro histórias |
| O pneu canta na mesma situação em que o kart deixa marca de pneu (`SEED/RD-02`) | a marca de pneu que o jogo já desenha; decisão desta feature | US-0004 |
| O som da zebra continua o ruído curto e grave definido em `pista-kart-park` (`SEED/RD-03`) | `pista-kart-park` US-5, ponto fechado em 2026-10-22 | NFR-0007 |

## Restrições (citadas do seed, seção Restrições)

- "O som da zebra não muda. Motivo: é critério validado de `pista-kart-park` (US-5)." — NFR-0007.
- "Nenhuma dependência nova de execução. Motivo: restrição já adotada nas features anteriores." —
  NFR-0006.
- "Os sons e as imagens vêm dentro do download inicial. Motivo: o jogo tem de funcionar sem servidor
  depois de aberto (RNF08)." — NFR-0003, NFR-0001.
- "Nenhuma imagem desta feature traz marca, logotipo ou texto de terceiros." — NFR-0008.

## Impacto no domínio (do seed)

- **I2** (`SEED/IM-I2`): som e imagem ficam do lado da apresentação; nenhum dado de simulação muda —
  NFR-0009.
- Demais invariantes: o seed declara nenhum impacto.

## Famílias de requisito não funcional consideradas

| Família | Tratamento |
|---|---|
| Tamanho do download (RNF02) | NFR-0001 e NFR-0002 |
| Taxa de quadros (RNF03) | NFR-0005 |
| Determinismo (RNF07) | NFR-0004 e NFR-0009 |
| Solo sem servidor, disponibilidade e comportamento offline (RNF08) | NFR-0003 |
| Licença dos arquivos gerados por IA | NFR-0010: promoção para produção condicionada à confirmação do dono do produto |
| Latência | Os prazos de som são critérios das histórias: silêncio de no máximo 50 ms e parada em até 200 ms (US-0003, US-0004). Latência de entrada (RNF04): dispensada, a feature não muda os controles |
| Tempo de carga até pilotar (RNF01) | Dispensada: o seed não fixa limite novo; o peso que a feature acrescenta é limitado por NFR-0001 e NFR-0002 |
| Suporte a navegadores (RNF05) | Dispensada: o seed não muda a lista de navegadores |
| Retenção de dados | Dispensada: a feature não persiste dado novo |
| Privacidade e consentimento (RNF10, I6) | Dispensada: a feature não coleta dado do Jogador nem do Visitante |
| Exposição por papel (RBAC) | Dispensada: o jogo não tem contas nem papéis (I10) |
| Idioma pt/en (RNF11) | O seed pede a descrição da prévia do link em português (US-0002) e não pede versão em inglês |
| Acessibilidade | Dispensada: o seed não traz requisito; o deslize continua visível na marca de pneu que o jogo desenha (`SEED/RD-02`), e o som não é o único sinal |
| Observabilidade | Dispensada: não há servidor nem registro novo nesta feature |
| Vazão | Dispensada: não há serviço que receba carga |

## Pontos de Riscos e incógnitas do seed e como foram fechados

O seed traz três pontos na seção Riscos e incógnitas. Os dois primeiros foram fechados pelo dono do
produto em 2026-11-10; o terceiro tem dono, momento e alcance definidos e não bloqueia esta etapa.

| Ponto do seed | Decisão | Onde está neste conjunto |
|---|---|---|
| `SEED/RI-01`, capa dentro do jogo | `DOMAIN/DEC-01`: a capa aparece só na prévia do link; nenhuma tela do jogo a mostra | US-0002 (critério 07); Fora do escopo (`SEED/FE-07`) |
| `SEED/RI-02`, qualidade dos sons | `DOMAIN/DEC-02`: os dois arquivos foram ouvidos e servem como estão | US-0003 (critério 10), US-0004 (critério 06) |
| `SEED/RI-03`, licença dos arquivos gerados por IA | `DOMAIN/DEC-03`: o dono do produto confirma nos termos do plano antes da promoção para produção | NFR-0010 |

A licença (`SEED/RI-03`) bloqueia **só a promoção para produção**: especificação, código e staging
seguem com os arquivos como estão (`DOMAIN/DEC-03`).

## Fora do escopo (do seed)

- Texturas da pista: são de `pista-kart-park` (revisão 4 proposta) (`SEED/FE-01`).
- Música, som de batida, som de grama e som de largada (`SEED/FE-02`).
- Som da zebra por arquivo: continua sintetizado (`SEED/FE-03`).
- Tela de abertura animada, vídeo ou trailer dentro do jogo (`SEED/FE-04`).
- Controle de volume: o som continua só ligado ou desligado (`SEED/FE-05`).
- Capa dentro do jogo: a capa aparece só na prévia do link (`SEED/FE-07`, `DOMAIN/DEC-01`).
- Céu de fundo e cenário (`SEED/FE-06`).
- Canal `remote-wheel` (pós-MVP, I10).
