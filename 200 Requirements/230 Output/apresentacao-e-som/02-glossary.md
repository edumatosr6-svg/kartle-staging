---
title: Glossário — apresentação e som
feature: apresentacao-e-som
stage: req
status: validated
version: 1.1.0
sources: [SEED, DOMAIN]
---

# Glossário

Os termos valem igualmente em `web-desktop` e `web-mobile`, salvo indicação.

| Termo | Definição | Canal |
|---|---|---|
| Jogador | Quem abre o jogo, liga o som e pilota o kart | ambos |
| Visitante | Quem vê a prévia de um link do jogo antes de abri-lo (`SEED.md`, Atores e canais) | link compartilhado |
| Ícone | A imagem de `docs/art/icon.png`, sem texto, que identifica o Kartle na aba do navegador e no atalho da tela de início | ambos; atalho só em `web-mobile` |
| Capa | A imagem de `docs/art/cover.png`, sem texto dentro da imagem, que a página declara como imagem de prévia de link; nenhuma tela do jogo a mostra (`DOMAIN/DEC-01`) | link compartilhado |
| Prévia de link | O cartão com imagem, título e descrição que um aplicativo ou site monta ao receber um link, a partir do que a página declara | link compartilhado |
| Página do jogo | O documento que o navegador recebe ao abrir o endereço do Kartle; é onde a capa, o título e a descrição são declarados | ambos |
| Atalho da tela de início | O atalho que o navegador do celular cria quando o Jogador usa "adicionar à tela de início" | `web-mobile` |
| Som ligado, som desligado | Os dois únicos estados do som do jogo; o jogo abre com o som desligado e só o Jogador o liga. Não há controle de volume (`SEED/FE-05`) | ambos |
| Som do motor | O som contínuo do motor do kart; nesta feature, a gravação de motor `docs/sfx/engine-loop.mp3` (`DOMAIN/DEC-02`), no lugar do tom sintetizado | ambos |
| Som de pneu | O som do pneu cantando; a gravação de pneu `docs/sfx/tire-screech.mp3` (`DOMAIN/DEC-02`), que toca enquanto o kart deixa marca de pneu no asfalto | ambos |
| Som da zebra | O ruído curto e grave que se repete com roda na zebra, definido em `pista-kart-park`; não pertence a esta feature e não muda | `web-desktop` (como em `pista-kart-park`) |
| Marca de pneu | O rastro que o jogo já desenha no asfalto quando o kart desliza; é a situação que dispara o som de pneu (`SEED/RD-02`) | ambos |
| Deslizar | Passar do limite de aderência; nesta feature, é observado pela marca de pneu que o kart deixa no asfalto | ambos |
| Volta em andamento | Estado em que o Jogador está pilotando uma volta. A volta deixa de estar em andamento na pausa, no resultado e no reposicionamento (`SEED/US-3`) | ambos |
| Reposicionamento | Recolocação do kart na pista, durante a qual a volta não está em andamento (`SEED/US-3`) | ambos |
| Acelerador pressionado, acelerador solto | Os dois estados do comando de aceleração do Jogador usados para comparar a intensidade do motor na mesma velocidade | ambos |
| Download inicial | Tudo o que o navegador baixa para o jogo abrir, medido em bytes comprimidos; em 2026-11-06 somava 186.291 bytes (`SEED/CTX`) | ambos |
| Arquivos desta feature | A capa, o ícone, o som do motor e o som de pneu na forma em que são entregues ao navegador | ambos |
| Depois de o jogo abrir | O período que começa quando o download inicial termina e a tela inicial do jogo aparece | ambos |
| Arquivos gerados por IA | A capa, o ícone, o som do motor e o som de pneu, gerados no Higgsfield em 2026-11-10; a licença deles condiciona a promoção para produção (NFR-0010) | ambos |
| Staging, produção | Os dois ambientes em que o jogo é publicado; a licença dos arquivos gerados por IA bloqueia só a promoção para produção (`DOMAIN/DEC-03`) | ambos |
| Apresentação | A camada de tela e áudio do jogo; fica fora da simulação e não muda nenhum dado dela (I2) | ambos |
