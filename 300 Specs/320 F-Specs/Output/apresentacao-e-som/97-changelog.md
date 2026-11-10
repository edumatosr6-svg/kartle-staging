---
title: Registro de mudanças — apresentação e som
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.1
sources: []
---

# Registro de mudanças

## 2026-11-10 — rodada 1, Mode A (geração a partir dos requisitos validados)

**O que mudou**

- Conjunto gerado do zero a partir de `200 Requirements/230 Output/apresentacao-e-som/` (validado em
  2026-11-10; US-0001 a US-0004, NFR-0001 a NFR-0010, `DOMAIN/DEC-01` a `DOMAIN/DEC-03`).
- Cinco funcionalidades (`FEAT-0001` a `FEAT-0005`), três fluxos (`FLOW-0001` a `FLOW-0003`), três
  contratos (`API-0001` a `API-0003`), duas telas (`SCR-0001`, `SCR-0002`) e três regras (`RULE-0001` a
  `RULE-0003`), mais `01-overview.md`, `02-glossary.md` e `98-divergences.md` (sem linhas).
- Todo critério `AC-*` dos requisitos (28) e todo NFR (10) é realizado por ao menos um requisito: US-0001
  em `FEAT-0001`; US-0002 em `FEAT-0002`; US-0003 em `FEAT-0003`; US-0004 em `FEAT-0004`; NFR-0001 a
  NFR-0010 em `FEAT-0005`. Nenhum NFR foi adiado para a etapa de design.
- `00-index.md` e `99-traceability.md` não foram escritos: o gate os gera com `lint_artifacts.py --emit`.

**Decisões de forma registradas**

- Não existe API de rede no MVP (diretrizes do estágio). Os contratos de `api/` são o documento da página
  entregue (`API-0001`), um contrato em processo do som (`API-0002`) e os registros de verificação
  (`API-0003`), com o único papel `player` (anônimo). Nomes de campo em `camelCase` com unidade no sufixo
  (D-FS-06), no lugar do `snake_case` padrão da habilidade do gerador: a diretriz do projeto prevalece.
- As declarações de `API-0001` (`pageIcon`, `homeScreenIcon`, `previewImage`, `previewImageWidthPx`,
  `previewTitle`, `previewDescription`) são nomes lógicos; a marcação que as carrega no documento fica para
  o D-Spec.
- "Saída de áudio do jogo", ponto de observação dos critérios de US-0003 e US-0004, foi especificada como
  `getSoundOutput`: estado, tom (`enginePitchRatio`) e ganho pedido (`engineGainNorm`, `tireGainNorm`).
  "Silêncio" é ganho 0; "tocando" é som disponível e ganho maior que 0.
- "Volta em andamento" foi lida como `lapPhase` `RUNNING` sem reposicionamento em execução, pela definição
  do glossário dos requisitos ("o Jogador está pilotando uma volta"). Antes de a volta começar
  (`COUNTDOWN`, nenhuma volta aceita) o motor não toca: a condição de AC-US-0003-01 é a volta em andamento,
  e nenhum critério pede motor antes dela.
- Reposicionamento (AC-US-0003-06): aceito `repositionKart`, o motor chega ao silêncio em até 200 ms e só
  volta depois de ter chegado ao silêncio, com a volta de novo em andamento. Os requisitos não fixam
  duração mínima do silêncio; nenhuma foi fixada.
- AC-US-0003-01 (nenhum silêncio maior que 50 ms) foi aplicado também ao início: o motor toca em até 50 ms
  depois de o som ser ligado ou de a volta passar a estar em andamento.
- Som desligado (AC-US-0003-07, AC-US-0004-05): sem prazo nos critérios, o silêncio vale a partir da ação.
- "Kart marcando o asfalto" nomeia a situação de marca de pneu de `modelo-kart-01`, sem redefini-la; com a
  simulação suspensa ou parada o kart não marca (AC-US-0004-03).
- "Forma entregue": derivada do arquivo de origem só por redimensionamento, conversão de formato ou
  compressão, pela definição "arquivos desta feature" do glossário dos requisitos.
- NFR-0003 pede os 4 arquivos, a capa inclusive, dentro do download inicial; AC-US-0002-07 pede que
  nenhuma tela do jogo mostre a capa. Os dois foram carregados como estão (`RULE-0003`): o navegador recebe
  a capa ao abrir o jogo e a apresentação não a desenha.
- O texto de `previewDescription` não é fixado pelos requisitos; exige-se uma frase só, em português, e o
  texto fica para o D-Spec.

**Itens fechados**

- Nenhum: primeira rodada, sem relatório de validação nem feedback anterior.

**Itens recusados ou não resolvidos**

- Nenhum requisito diz o que acontece se os termos da licença não permitirem o uso num jogo publicado:
  NFR-0010 declara que os requisitos não escolhem essa resposta. Só a promoção para produção é afetada.
- Nenhum requisito pede que o tom do motor cresça de forma contínua com a velocidade nem que a intensidade
  do pneu varie com o deslize: os critérios só comparam 20 m/s com 5 m/s e acelerador pressionado com
  solto. A função fica para o D-Spec, dentro das desigualdades.
- Nenhum aviso na tela foi especificado para som indisponível: os requisitos não o pedem.
- O limite de 3 MB de NFR-0001 foi mantido na unidade dos requisitos, sem conversão para bytes: os
  requisitos não dizem qual conversão vale. Com a linha de base de 186.291 bytes e o teto de 300.000 bytes
  dos 4 arquivos, a diferença entre as conversões não decide o resultado.
- Nenhuma divergência registrada: esta etapa não lê a raiz de código para derivar comportamento.

## 2026-11-10 — rodada 2, Mode B (relatório `fspec-validation-20261110-1709`)

**O que mudou**

- ISSUE-01 (error): `RULE-0002` passa a ter uma única definição de simulação suspensa ou parada, pelos
  estados que o conjunto já nomeia: suspensa é `lapPhase` `PAUSED`, parada é `lapPhase` `ENDED`. A condição
  "`simStepCount` avançou desde o quadro anterior" foi retirada: um quadro sem passo novo vale o último
  passo avançado e não encerra a marca. A seção "Idempotência e ordem" passa a listar `lapPhase` entre as
  entradas do estado. O reposicionamento segue sem regra própria: o kart deixa de marcar no primeiro passo
  avançado fora da situação de marca. A mesma definição foi levada a `02-glossary.md` ("Kart marcando o
  asfalto"), `FEAT-0004` (tabela de Comportamento, três linhas) e `FLOW-0002` (caso "Nenhum passo avançado
  entre dois quadros").
- ISSUE-03 (warning): a declaração `previewImageWidthPx` foi retirada de `API-0001` (tabela de resposta e
  tabela de compatibilidade). A largura de 1200 px ou mais fica como propriedade da imagem para a qual
  `previewImage` resolve, conferida por `coverWidthPx` em `API-0003`, como já pediam REQ-FEAT-0002-02 e
  AC-US-0002-02. `API-0001` e o passo 2 de `FLOW-0001` dizem agora "cinco declarações", igual ao diagrama.
  A linha da rodada 1 que lista `previewImageWidthPx` entre as declarações fica como registro histórico e
  deixa de valer.
- Versão dos arquivos alterados: 1.0.0 para 1.0.1. Nenhum requisito, campo, declaração, estado ou elemento
  de tela foi acrescentado (§16).

**Itens fechados**

- ISSUE-01, ISSUE-03.

**Itens recusados ou não resolvidos**

- ISSUE-02 (warning), recusado: o limite de `initialDownloadBytes` continua "menor que 3 MB comprimidos" em
  `API-0003`, `FEAT-0005` e `RULE-0003`. Os requisitos (NFR-0001, `SEED/NF-01`, RNF02) dão o limite em MB e
  não fixam a conversão para bytes; escolher 3.000.000 ou 3.145.728 aqui seria decidir o que a fonte não
  decide. O próprio relatório prevê este desfecho. Linha proposta ao autor para
  `200 Requirements/220 Input/apresentacao-e-som/SCOPE-BACKLOG.md` (não escrita por esta etapa): "2026-11-10
  — fspec-validation-20261110-1709 ISSUE-02 — `SEED/NF-01` (RNF02): dizer se 3 MB são 3.000.000 ou
  3.145.728 bytes, para o veredito de `initialDownloadBytes` ser decidível".
- ISSUE-04 (info), sem edição: a leitura "sem som de motor durante `COUNTDOWN`" fica como está, como pede o
  relatório. Proposta ao dono do produto, para `DOMAIN.md` da feature (não escrita por esta etapa):
  confirmar que não há som de motor antes de a volta começar.
