---
title: Visão geral — apresentação e som
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.0
sources: []
---

# Visão geral

## O que é especificado

Esta especificação funcional diz o que o Kartle **mostra e toca** com a identidade visual e o som de kart:
o ícone na aba do navegador e no atalho da tela de início, a capa, o título e a descrição que a página do
jogo declara para a prévia do link, o som do motor gravado no lugar do tom sintetizado, e o som de pneu
enquanto o kart deixa marca de pneu no asfalto. A base é o conjunto de requisitos validado em
`200 Requirements/230 Output/apresentacao-e-som/` (US-0001 a US-0004, NFR-0001 a NFR-0010), que já carrega
as decisões do dono do produto de 2026-11-10 (`DOMAIN/DEC-01` a `DOMAIN/DEC-03`, rótulos definidos em
`01-context.md` daquele conjunto): a capa aparece só na prévia do link; os dois sons servem como estão; a
licença dos arquivos gerados por IA bloqueia só a promoção para produção.

Som e imagem são apresentação (I2): nada aqui decide validade de volta, tempo ou pontuação, e nenhum dado
de simulação muda (D-FS-05). Esta feature passa a ser a dona do som do motor; o som da zebra continua de
`pista-kart-park` e não muda.

## Por canal

| Item | `web-desktop` | `web-mobile` | Link compartilhado |
|---|---|---|---|
| Ícone na aba do navegador | sim | sim | — |
| Ícone no atalho da tela de início | — | sim | — |
| Capa, título e descrição da prévia | declarados no documento da página, o mesmo nos dois canais | o mesmo documento | o Visitante vê a prévia montada por um aplicativo ou site |
| Capa dentro do jogo | nunca | nunca | — |
| Som do motor e som de pneu | mesmas regras | mesmas regras; sem sensor ou com permissão negada, toque com estado visível (I4), e o som não muda | — |
| Taxa de quadros com os sons tocando | 60 fps no notebook de referência de RNF03 | 30 fps no celular intermediário de referência de RNF03 | — |
| Sem rede depois de o jogo abrir | tudo funciona (D-FS-08) | tudo funciona (D-FS-08) | a busca da capa por um serviço de prévia acontece fora do jogo |

## Como o conjunto se organiza

- Funcionalidades em `features/`: uma por história (ícone, capa, motor, pneu) e uma para os requisitos
  transversais (NFR-0001 a NFR-0010).
- Fluxos em `flows/`: abertura da página e entrega dos arquivos; som durante a volta; verificação.
- Contratos em `api/`: as declarações do documento da página; o estado e o comando do som; os registros de
  verificação. **Não existe API de rede no MVP** (diretrizes do estágio): são o documento entregue e
  contratos em processo, dentro do navegador e na saída de `npm test`, com o único papel `player`
  (anônimo), sem sessão. Nomes de campo em `camelCase` plano com a unidade no sufixo (D-FS-06).
- Telas em `screens/`: o controle de som e a saída de áudio nas telas do jogo; a aba, o atalho e a prévia.
- Regras em `rules/`: estado do som e som do motor; som de pneu; arquivos desta feature, peso e licença.

A lista dos arquivos e a matriz critério ↔ requisito são geradas pelo gate (`00-index.md`,
`99-traceability.md`).

## Diretrizes do estágio que não se aplicam

| Diretriz | Por que não se aplica |
|---|---|
| D-FS-01 | A feature não cria tentativa, resultado, fantasma, medalha, sequência nem estatística; nada é chaveado |
| D-FS-03 | Nenhum fluxo recebe comando de volante remoto, envio de resultado nem publicação de pista; a busca do documento e da capa por um serviço de prévia é leitura e não muda estado |
| D-FS-04 | A feature não consome tentativa nem registra resultado; o único estado que muda é o do som, cuja idempotência está em [RULE-0001](rules/RULE-0001-estado-do-som-e-som-do-motor.md) |

## Contratos existentes nomeados e não redefinidos

`getLapState`, `lapPhase` (`COUNTDOWN`, `RUNNING`, `PAUSED`, `ENDED`) e `repositionKart`, de
`race-lap-validation`; `getHandlingTelemetry`, `speedMps`, `simStepCount`, `Input` e `STEP`, de
`dirigibilidade`; a situação de marca de pneu, de `modelo-kart-01`; o som da zebra, de `pista-kart-park`.

## Fora do escopo

- Texturas da pista; céu de fundo e cenário.
- Música, som de batida, som de grama e som de largada.
- Som da zebra por arquivo: continua sintetizado.
- Tela de abertura animada, vídeo ou trailer dentro do jogo.
- Controle de volume: o som é só ligado ou desligado.
- Capa dentro do jogo (`DOMAIN/DEC-01`).
- Canal `remote-wheel` (pós-MVP, I10).
- O que muda se os termos da licença não permitirem o uso num jogo publicado: os requisitos não escolhem
  essa resposta (NFR-0010), e este conjunto também não.
