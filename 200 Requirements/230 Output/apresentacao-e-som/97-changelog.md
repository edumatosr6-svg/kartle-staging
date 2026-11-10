---
title: Changelog — apresentação e som
feature: apresentacao-e-som
stage: req
status: validated
version: 1.1.0
sources: [SEED]
---

# Changelog

## 2026-11-10 — rodada 1, Mode A (geração a partir do seed revision 1)

**O que mudou**

- Conjunto gerado do zero a partir de `SEED.md` (`revision: 1`, 2026-11-10): `01-context.md`,
  `02-glossary.md`, quatro histórias (US-0001 a US-0004, uma por história do seed), nove NFRs (NFR-0001 a
  NFR-0009) e o registro `98-divergences.md`, sem linhas.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.
- `NOTES.md` da pasta do seed não foi lido (não é entrada desta etapa); os números usados são os que o
  próprio seed traz.
- Critérios do seed com mais de um comportamento foram separados em critérios atômicos, sem acrescentar
  comportamento: a aba por canal (US-0001), os três estados em que a volta deixa de estar em andamento
  (US-0003), "parado" e "rodando sem deslizar" (US-0004).
- Um critério por som (AC-US-0003-10, AC-US-0004-06) afirma que o som que toca é a gravação de
  `docs/sfx/`; a base é a Visão geral e o Contexto do seed (`SEED/VG`, `SEED/CTX`), que pedem sons
  gravados no lugar do tom sintetizado.
- Restrições, regras de domínio e impacto do seed sem história própria tornados mensuráveis como NFR:
  zebra inalterada (NFR-0007), nenhuma dependência nova (NFR-0006), imagens sem marca de terceiros
  (NFR-0008), apresentação sem efeito na simulação (NFR-0009).
- NFR-0005 cita os números de RNF03 (60 fps em notebook, 30 fps em celular intermediário) como já
  especificados em `pista-kart-park` NFR-0002; o seed desta feature os referencia sem repeti-los.

**Itens fechados**

- Nenhum: primeira rodada, sem relatório anterior.

**Itens recusados ou não resolvidos**

- Os três pontos em aberto do seed (`SEED/RI-01`, `SEED/RI-02`, `SEED/RI-03`) não foram fechados: são decisões do dono do produto e a pasta do
  seed não traz `DOMAIN.md` nem outra decisão registrada. Foram carregados como pontos em aberto
  (`01-context.md`, US-0002, US-0003, US-0004, NFR-0008) e relatados ao loop como parada por decisão
  humana. Nenhum critério foi inventado para respondê-los.
- Nenhum requisito de licença foi escrito para os arquivos gerados por IA: o seed só traz a pergunta
  (`SEED/RI-03`), e uma regra de publicação seria um limite inventado nesta etapa.

## 2026-11-10 — rodada 2, Mode A (regeneração a partir do seed revision 2 e de `DOMAIN.md`)

**O que mudou**

- O seed passou para `revision: 2` e a pasta do seed ganhou `DOMAIN.md` com três decisões do dono do
  produto, rotuladas aqui `DOMAIN/DEC-01` a `DOMAIN/DEC-03`. O conjunto foi rederivado do seed inteiro;
  os arquivos sem diferença de conteúdo ficaram na versão 1.0.0 (NFR-0001 a NFR-0007, NFR-0009,
  `98-divergences.md`).
- `SEED/RI-01` fechado por `DOMAIN/DEC-01`: a capa aparece só na prévia do link. US-0002 ganhou o
  critério 07 (nenhuma tela do jogo mostra a capa) e deixou de ter ponto em aberto; "capa dentro do
  jogo" entrou em Fora do escopo com o rótulo novo `SEED/FE-07`.
- `SEED/RI-02` fechado por `DOMAIN/DEC-02`: os dois sons servem como estão. AC-US-0003-10 e
  AC-US-0004-06 passaram a nomear os arquivos (`docs/sfx/engine-loop.mp3`, `docs/sfx/tire-screech.mp3`);
  US-0003 e US-0004 deixaram de ter ponto em aberto.
- `SEED/RI-03` tratado por `DOMAIN/DEC-03`: NFR-0010 novo, produção condicionada à confirmação da licença
  dos arquivos gerados por IA; bloqueia só a promoção para produção, no molde de NFR-0012 de
  `pista-kart-park`. O ponto saiu de NFR-0008, que ficou só com a restrição de marca de terceiros.
- `01-context.md`: revisão do seed, `DOMAIN.md`, rótulos novos, tabela de como cada ponto foi fechado,
  família de licença. `02-glossary.md`: nomes dos arquivos de som, capa fora das telas do jogo,
  "arquivos gerados por IA" e "staging, produção".
- Na entrada da rodada 1 deste arquivo, as menções aos pontos em aberto pelo identificador do seed foram
  trocadas pelos rótulos `SEED/RI-01` a `SEED/RI-03`: o gate trata o identificador escrito num arquivo
  desta etapa como ponto não resolvido. O sentido da entrada não mudou.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera. `NOTES.md` não foi lido.

**Itens fechados**

- Os três pontos que pararam a rodada 1 por decisão humana. Não havia relatório de validação nem
  feedback a resolver.

**Itens recusados ou não resolvidos**

- Nenhum critério foi escrito para "o motor emenda em loop sem estalo audível": a pergunta era da
  revisão 1 do seed e `DOMAIN/DEC-02` a fechou com a audição do dono do produto, sem limite medido.
- NFR-0010 não diz o que acontece se os termos do plano não permitirem o uso num jogo publicado: nem o
  seed nem `DOMAIN.md` trazem essa regra, e escolhê-la aqui seria inventar uma decisão do dono do
  produto. Só afeta a promoção para produção.
- Nenhuma divergência registrada: esta etapa não lê a raiz de código.
